"""Extractor protocol and shared helpers for pdfplumber-based parsers."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Iterable, Optional, Protocol

import pdfplumber

from ..schema import CsvOutput


@dataclass
class ExtractionResult:
    csv: CsvOutput
    rows_extracted: int
    warnings: list[str] = field(default_factory=list)


class Extractor(Protocol):
    name: str

    def extract(self, pdf: pdfplumber.PDF, kind: str) -> ExtractionResult: ...


def collect_text(pdf: pdfplumber.PDF) -> list[str]:
    """Return per-page text for the entire PDF (in order)."""
    return [page.extract_text() or "" for page in pdf.pages]


def collect_lines(pdf: pdfplumber.PDF) -> list[str]:
    """Concatenate every page and split on newlines, dropping blank lines."""
    text = "\n".join(collect_text(pdf))
    return [line for line in (raw.strip() for raw in text.splitlines()) if line]


def find_header_index(lines: Iterable[str], predicate) -> Optional[int]:
    for i, line in enumerate(lines):
        if predicate(line):
            return i
    return None
