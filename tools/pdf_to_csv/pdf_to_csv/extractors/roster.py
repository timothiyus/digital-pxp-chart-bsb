"""Extractor for roster-only PDFs (no stats).

Targets Sidearm/Prestosports-style college roster pages with a header row
like:
    NO. NAME POS. B/T CL. HT. WT. HOMETOWN/HIGH SCHOOL
followed by one row per player. The roster may span multiple pages, with
the header repeated. Non-player decoration (e.g., "Coaching Staff" page)
is skipped because it does not match the player-row regex.
"""

from __future__ import annotations

import re
from typing import Optional

import pdfplumber

from ..normalize import (
    parse_int,
    split_first_last,
    split_hometown_school,
)
from ..schema import roster_output
from .base import Extractor, ExtractionResult, collect_text


_HEADER = re.compile(
    r"^NO\.?\s+NAME\s+POS\.?\s+B/T\s+CL\.?\s+HT\.?\s+WT\.?\s+HOMETOWN",
    re.IGNORECASE,
)

# A roster row has: number-or-RS, then a name made of 1+ word tokens, then
# a position token, optional B/T, a class year, optional ht, optional wt,
# and the hometown/school. The HT and WT fields are often blank in extracted
# text, which collapses adjacent fields. We anchor on the leading id and the
# trailing hometown.
_PLAYER_ROW = re.compile(
    r"""^
        (?P<num>\d+|RS|R-?[A-Z]+)\s+               # 1, 47, RS
        (?P<name>[A-Za-z][A-Za-z'.\-\s]+?)\s+      # First Last (lazy)
        (?P<position>[A-Z/]+)\s+                   # IF, RHP/IF
        (?:(?P<bt>[A-Z/\-]+)\s+)?                  # B/T (often blank)
        (?P<class_year>FR|SO|JR|SR|RS|RS-FR|RS-SO|RS-JR|RS-SR|R-FR|R-SO|R-JR|R-SR)
        (?:\s+(?P<height>\d{1,2}-\d{1,2}))?         # 6-1
        (?:\s+(?P<weight>\d{2,3}))?                 # 185
        \s+(?P<hometown>.+)$
    """,
    re.VERBOSE,
)


def _parse_row(line: str) -> Optional[dict[str, object]]:
    match = _PLAYER_ROW.match(line.strip())
    if not match:
        return None
    name = match.group("name").strip()
    first, last = split_first_last(name)
    hometown_raw = match.group("hometown") or ""
    hometown, _school = split_hometown_school(hometown_raw)
    return {
        "Number": match.group("num"),
        "First": first,
        "Last": last,
        "Position": (match.group("position") or "").strip(),
        "ClassYear": (match.group("class_year") or "").strip(),
        "Height": (match.group("height") or "").strip(),
        "Weight": (match.group("weight") or "").strip(),
        # Keep the full hometown/school string — it's how the user reads the roster
        # in the broadcast booth — splitting school out loses radio-prep value.
        "Hometown": hometown_raw.strip(),
    }


class RosterExtractor:
    name = "roster"

    def extract(self, pdf: pdfplumber.PDF, kind: str) -> ExtractionResult:
        warnings: list[str] = []
        rows: list[dict[str, object]] = []
        seen_numbers: set[str] = set()

        for page_text in collect_text(pdf):
            in_table = False
            for raw in page_text.splitlines():
                line = raw.strip()
                if not line:
                    continue
                if _HEADER.match(line):
                    in_table = True
                    continue
                if not in_table:
                    continue
                # End of table on this page: hitting a "Coaching Staff" type heading
                if line.lower().startswith("coaching staff"):
                    in_table = False
                    continue
                row = _parse_row(line)
                if row is None:
                    continue
                key = f"{row['Number']}|{row['First']}|{row['Last']}".lower()
                if key in seen_numbers:
                    continue
                seen_numbers.add(key)
                rows.append(row)

        if not rows:
            warnings.append("no roster rows matched; PDF layout may be unsupported")

        return ExtractionResult(
            csv=roster_output(rows),
            rows_extracted=len(rows),
            warnings=warnings,
        )
