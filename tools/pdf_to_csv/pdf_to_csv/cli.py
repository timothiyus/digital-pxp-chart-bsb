"""Command-line interface for pdf_to_csv."""

from __future__ import annotations

import sys
from pathlib import Path

import click
import pdfplumber

from .detect import detect, override_detection
from .extractors import EXTRACTORS


_KIND_CHOICES = ("auto", "season", "box", "roster")
_FORMAT_CHOICES = ("auto", "gamechanger", "prestosports", "maxpreps", "generic")


def _resolve_kind(flag: str, detected_kind: str) -> str:
    if flag == "auto":
        return detected_kind
    return {
        "season": "season_stats",
        "box": "box_score",
        "roster": "roster",
    }[flag]


def _resolve_source(flag: str, detected_source: str, kind: str) -> str:
    if flag != "auto":
        return flag
    if kind == "roster":
        return "roster"
    return detected_source


@click.command()
@click.argument("input_pdf", type=click.Path(exists=True, dir_okay=False, path_type=Path))
@click.option(
    "-o", "--out",
    type=click.Path(dir_okay=False, path_type=Path),
    default=None,
    help="Output CSV path. Defaults to <input>.csv next to the PDF.",
)
@click.option(
    "--kind",
    type=click.Choice(_KIND_CHOICES, case_sensitive=False),
    default="auto",
    help="Document kind. 'auto' uses detection.",
)
@click.option(
    "--format", "fmt",
    type=click.Choice(_FORMAT_CHOICES, case_sensitive=False),
    default="auto",
    help="Source provider format. 'auto' uses detection.",
)
@click.option(
    "--quiet", is_flag=True,
    help="Suppress progress output (errors still print).",
)
def main(input_pdf: Path, out: Path | None, kind: str, fmt: str, quiet: bool) -> None:
    """Translate a stats / roster / box-score PDF into a CSV the app importer can read."""
    output_path = out or input_pdf.with_suffix(".csv")

    with pdfplumber.open(input_pdf) as pdf:
        detection = detect(pdf)
        if not quiet:
            click.echo(f"Detected: source={detection.source}, kind={detection.kind} "
                       f"(confidence {detection.confidence:.0%})")
            for reason in detection.reasons:
                click.echo(f"  - {reason}")

        cli_source = None if fmt == "auto" else fmt
        cli_kind_flag = None if kind == "auto" else _resolve_kind(kind, detection.kind)
        detection = override_detection(detection, source=cli_source, kind=cli_kind_flag)

        # Roster kind always routes to the roster extractor.
        source_key = "roster" if detection.kind == "roster" else detection.source
        if source_key not in EXTRACTORS:
            source_key = "generic"

        extractor = EXTRACTORS[source_key]()
        result = extractor.extract(pdf, detection.kind)

    if result.rows_extracted == 0:
        click.echo(
            f"Extraction produced 0 rows from {input_pdf}. "
            f"Try --format generic or --kind {{season,box,roster}}.",
            err=True,
        )
        for warning in result.warnings:
            click.echo(f"  warning: {warning}", err=True)
        sys.exit(1)

    result.csv.write(output_path)

    if not quiet:
        click.echo(f"Extractor: {extractor.name}")
        click.echo(f"Rows extracted: {result.rows_extracted}")
        for warning in result.warnings:
            click.echo(f"  warning: {warning}")
        click.echo(f"Wrote: {output_path}")
