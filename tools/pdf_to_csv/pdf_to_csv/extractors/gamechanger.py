"""Extractor for GameChanger PDF stat exports.

GameChanger PDFs vary by template, but typically expose a structured table
that pdfplumber.extract_tables() handles cleanly — one wide table per page
with a header row containing 'Number', 'Last', 'First' (matching their CSV
export). We map columns through normalize.canonical_column().

When a sample GameChanger PDF is unavailable, this extractor falls back
gracefully: if no usable table is found it returns an empty result with a
warning, and the CLI should retry via the GenericExtractor.
"""

from __future__ import annotations

from typing import Optional

import pdfplumber

from ..normalize import canonical_column, parse_number, split_first_last
from ..schema import box_score_output, season_stats_output
from .base import Extractor, ExtractionResult


def _normalise_headers(raw_headers: list[Optional[str]]) -> list[Optional[str]]:
    return [canonical_column((h or "").strip()) for h in raw_headers]


def _row_to_record(headers: list[Optional[str]], row: list[Optional[str]]) -> Optional[dict[str, object]]:
    if not row:
        return None
    record: dict[str, object] = {}
    seen_counts: dict[str, int] = {}
    for header, cell in zip(headers, row):
        if not header or cell is None:
            continue
        cell = cell.strip()
        seen_counts[header] = seen_counts.get(header, 0) + 1
        key = header if seen_counts[header] == 1 else f"{header}#{seen_counts[header]}"
        if header == "Player":
            first, last = split_first_last(cell)
            record["First"] = first
            record["Last"] = last
        elif header in {"First", "Last", "Hometown", "Height", "Weight", "Number", "Position", "ClassYear"}:
            record[key] = cell
        else:
            record[key] = parse_number(cell)
    if not record.get("Number") and not record.get("Last"):
        return None
    return record


class GameChangerExtractor:
    name = "gamechanger"

    def extract(self, pdf: pdfplumber.PDF, kind: str) -> ExtractionResult:
        warnings: list[str] = []
        rows: list[dict[str, object]] = []
        for page in pdf.pages:
            for table in page.extract_tables() or []:
                if not table or len(table) < 2:
                    continue
                headers = _normalise_headers(table[0])
                if not any(h == "Number" for h in headers if h):
                    continue
                for raw in table[1:]:
                    record = _row_to_record(headers, raw)
                    if record:
                        rows.append(record)

        if not rows:
            warnings.append("no GameChanger table detected; consider --format generic")

        if kind == "box_score":
            return ExtractionResult(box_score_output(rows), len(rows), warnings)
        return ExtractionResult(season_stats_output(rows), len(rows), warnings)
