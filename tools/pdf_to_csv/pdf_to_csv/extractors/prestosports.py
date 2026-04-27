"""Extractor for Prestosports / Sidearm 'monospace-template' stat dumps.

These PDFs are positioned-text monospace renders — pdfplumber.extract_tables()
returns nothing useful, so we parse plain text. Three sections appear, each
introduced by a recognisable header line and terminated by 'Total...' rows:

    # Player AVG GP GS AB R H 2B 3B HR RBI TB SLG% BB HBP SO GDP OB% SF SH SB CS PO A E FLD%
    # Player ERA W L APP GS CG SHO SV IP H R ER BB SO 2B 3B HR AB B/AVG WP HBP BK SFA SHA
    # Player G TC PO A E FPCT DP SBA RCS RCS% PB CI

Each player row looks like:
    31 Sean Togher......... .418 45 45 146 ...

The dot-padded name token separates id+name from the value list.
"""

from __future__ import annotations

import re
from typing import Optional

import pdfplumber

from ..normalize import (
    clean_name_token,
    is_summary_row,
    parse_number,
    split_first_last,
)
from ..schema import box_score_output, season_stats_output
from .base import Extractor, ExtractionResult, collect_lines


_PLAYER_ROW = re.compile(
    r"^(?P<id>\S+)\s+(?P<name>.+?)\.{2,}\s+(?P<rest>.+)$"
)
_BATTING_HEADER = re.compile(r"^#\s+Player\s+AVG\b")
_PITCHING_HEADER = re.compile(r"^#\s+Player\s+ERA\b")
_FIELDING_HEADER = re.compile(r"^#\s+Player\s+G\s+TC\b")


# Mapping from Prestosports column name to the row dict key written to CSV.
# Keys ending in '#2' target the second occurrence of a duplicated header in
# SEASON_STATS_COLUMNS so the importer reads them as pitching values.
_BATTING_FIELDS: dict[str, str] = {
    "GP": "GP",
    "AB": "AB",
    "R": "R",
    "H": "H",
    "2B": "2B",
    "3B": "3B",
    "HR": "HR",
    "RBI": "RBI",
    "BB": "BB",
    "HBP": "HBP",
    "SO": "SO",
    "SF": "SF",
    "SB": "SB",
    "CS": "CS",
}

_PITCHING_FIELDS: dict[str, str] = {
    "ERA": "ERA",
    "W": "W",
    "L": "L",
    "GS": "GS",
    "IP": "IP",
    "H": "H#2",
    "R": "R#2",
    "ER": "ER",
    "BB": "BB#2",
    "SO": "SO#2",
    "HR": "HR#2",
    "B/AVG": "BAA",
}

_BOX_BATTING_FIELDS: dict[str, str] = {
    "AB": "AB",
    "R": "R",
    "H": "H",
    "2B": "2B",
    "3B": "3B",
    "HR": "HR",
    "RBI": "RBI",
    "BB": "BB",
    "HBP": "HBP",
    "SO": "SO",
    "SB": "SB",
}


def _split_header(line: str) -> list[str]:
    """Split a Prestosports header line on whitespace, dropping the leading '#'."""
    tokens = line.split()
    if tokens and tokens[0] == "#":
        tokens = tokens[1:]
    # Header always starts with 'Player' as the second column descriptor; we
    # don't include it among the value columns since values come *after* the
    # dot-padded name.
    if tokens and tokens[0] == "Player":
        tokens = tokens[1:]
    return tokens


def _parse_player_row(line: str) -> Optional[tuple[str, str, list[str]]]:
    """Return (number, full_name, values) or None for non-player rows."""
    match = _PLAYER_ROW.match(line)
    if not match:
        return None
    raw_id = match.group("id")
    name = clean_name_token(match.group("name"))
    if is_summary_row(raw_id) or is_summary_row(name):
        return None
    values = match.group("rest").split()
    return raw_id, name, values


def _accumulate_section(
    lines: list[str],
    start_index: int,
    header_tokens: list[str],
    field_map: dict[str, str],
    rows_by_id: dict[str, dict[str, object]],
    *,
    include_identity: bool,
) -> int:
    """Walk lines after a header, populating rows_by_id. Returns next index."""
    i = start_index + 1
    while i < len(lines):
        line = lines[i]
        # Stop if we hit the next section header.
        if (
            _BATTING_HEADER.match(line)
            or _PITCHING_HEADER.match(line)
            or _FIELDING_HEADER.match(line)
        ):
            break
        parsed = _parse_player_row(line)
        if parsed is None:
            # Skip total/opponent rows but keep scanning until next header.
            i += 1
            continue
        number, name, values = parsed
        first, last = split_first_last(name)
        # Truncate or pad values to header length so zip aligns by position.
        values = values[: len(header_tokens)]
        record = rows_by_id.setdefault(number, {})
        if include_identity:
            record["Number"] = number
            record["First"] = first
            record["Last"] = last
        for token, value in zip(header_tokens, values):
            target = field_map.get(token)
            if target is None:
                continue
            record[target] = parse_number(value)
        i += 1
    return i


def _extract_season_stats(lines: list[str]) -> tuple[list[dict[str, object]], list[str]]:
    rows_by_id: dict[str, dict[str, object]] = {}
    warnings: list[str] = []

    saw_batting = False
    saw_pitching = False

    i = 0
    while i < len(lines):
        line = lines[i]
        if _BATTING_HEADER.match(line):
            saw_batting = True
            tokens = _split_header(line)
            i = _accumulate_section(
                lines, i, tokens, _BATTING_FIELDS, rows_by_id, include_identity=True
            )
            continue
        if _PITCHING_HEADER.match(line):
            saw_pitching = True
            tokens = _split_header(line)
            i = _accumulate_section(
                lines, i, tokens, _PITCHING_FIELDS, rows_by_id, include_identity=True
            )
            continue
        # Fielding section adds nothing the importer reads — skip.
        i += 1

    if not saw_batting:
        warnings.append("no batting section detected")
    if not saw_pitching:
        warnings.append("no pitching section detected")

    # Compute derived fields the importer reads.
    for record in rows_by_id.values():
        ab = parse_number(record.get("AB"))
        bb = parse_number(record.get("BB"))
        hbp = parse_number(record.get("HBP"))
        sf = parse_number(record.get("SF"))
        if ab or bb or hbp or sf:
            record["PA"] = ab + bb + hbp + sf
        ip = parse_number(record.get("IP"))
        p_h = parse_number(record.get("H#2"))
        p_bb = parse_number(record.get("BB#2"))
        if ip > 0:
            record["WHIP"] = round((p_h + p_bb) / ip, 3)

    rows = sorted(
        rows_by_id.values(),
        key=lambda r: (str(r.get("Last", "")).lower(), str(r.get("First", "")).lower()),
    )
    return rows, warnings


def _extract_box_score(lines: list[str]) -> tuple[list[dict[str, object]], list[str]]:
    """Best-effort box-score extraction reusing batting parsing.

    Prestosports formal box scores aren't represented in the current sample
    set, so we lean on the same batting header pattern. Pitching IP, if a
    pitching section exists, is mapped onto the IP column.
    """
    rows_by_id: dict[str, dict[str, object]] = {}
    warnings: list[str] = []
    saw_any = False

    i = 0
    while i < len(lines):
        line = lines[i]
        if _BATTING_HEADER.match(line):
            saw_any = True
            tokens = _split_header(line)
            i = _accumulate_section(
                lines, i, tokens, _BOX_BATTING_FIELDS, rows_by_id, include_identity=True
            )
            continue
        if _PITCHING_HEADER.match(line):
            tokens = _split_header(line)
            i = _accumulate_section(
                lines, i, tokens, {"IP": "IP"}, rows_by_id, include_identity=True
            )
            continue
        i += 1

    if not saw_any:
        warnings.append("no batting section detected for box-score extraction")

    rows = sorted(
        rows_by_id.values(),
        key=lambda r: (str(r.get("Last", "")).lower(), str(r.get("First", "")).lower()),
    )
    return rows, warnings


class PrestosportsExtractor:
    name = "prestosports"

    def extract(self, pdf: pdfplumber.PDF, kind: str) -> ExtractionResult:
        lines = collect_lines(pdf)
        if kind == "box_score":
            rows, warnings = _extract_box_score(lines)
            csv_out = box_score_output(rows)
        else:
            rows, warnings = _extract_season_stats(lines)
            csv_out = season_stats_output(rows)
        return ExtractionResult(csv=csv_out, rows_extracted=len(rows), warnings=warnings)
