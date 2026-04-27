"""Output CSV schemas locked to the browser importer.

The browser importer at app.js:414 (importPlayersFromCsv) and app.js:513
(importBoxScoreFromCsv) reads columns by header name via headerIndex(),
which supports duplicate column names (the second occurrence of HR/BB/SO/H/R
holds pitching stats). The csv module preserves duplicates; pandas would
silently dedupe, so we write rows directly.
"""

from __future__ import annotations

import csv
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable, Mapping


SEASON_STATS_COLUMNS: list[str] = [
    "Number", "Last", "First", "Hometown", "Height", "Weight",
    "GP", "PA", "AB", "H", "2B", "3B", "HR", "RBI", "R",
    "BB", "SO", "HBP", "SF", "SB", "CS",
    "IP", "GS", "BF", "W", "L", "#P", "S%", "ERA", "WHIP", "BAA",
    "HR", "BB", "SO", "H", "R", "ER",
]

BOX_SCORE_COLUMNS: list[str] = [
    "Number", "Last", "First",
    "AB", "H", "2B", "3B", "HR", "BB", "SO", "RBI", "R", "SB", "HBP", "IP",
]

ROSTER_COLUMNS: list[str] = [
    "Number", "Last", "First", "Position", "ClassYear",
    "Height", "Weight", "Hometown",
]


def _column_keys(columns: list[str]) -> list[str]:
    """Generate per-position keys so duplicate column names address distinct slots.

    SEASON_STATS_COLUMNS lists 'HR' twice (batting + pitching). We address the
    second occurrence with the key 'HR#2' in row dicts; the writer emits the
    raw 'HR' header twice in the CSV so app.js headerIndex() sees both.
    """
    seen: dict[str, int] = {}
    keys: list[str] = []
    for col in columns:
        seen[col] = seen.get(col, 0) + 1
        keys.append(col if seen[col] == 1 else f"{col}#{seen[col]}")
    return keys


SEASON_STATS_KEYS: list[str] = _column_keys(SEASON_STATS_COLUMNS)
BOX_SCORE_KEYS: list[str] = _column_keys(BOX_SCORE_COLUMNS)
ROSTER_KEYS: list[str] = _column_keys(ROSTER_COLUMNS)


@dataclass
class CsvOutput:
    """Final CSV output ready to be written."""

    kind: str  # "season_stats" | "box_score" | "roster"
    columns: list[str]
    keys: list[str]
    rows: list[dict[str, object]] = field(default_factory=list)

    def write(self, path: Path) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("w", encoding="utf-8", newline="") as fh:
            self._write_to(fh)

    def to_string(self) -> str:
        import io
        buf = io.StringIO()
        self._write_to(buf)
        return buf.getvalue()

    def _write_to(self, fh) -> None:
        writer = csv.writer(fh)
        writer.writerow(self.columns)
        for row in self.rows:
            writer.writerow([_format_cell(row.get(key, "")) for key in self.keys])


def _format_cell(value: object) -> str:
    if value is None or value == "":
        return ""
    if isinstance(value, float):
        if value.is_integer():
            return str(int(value))
        return f"{value:g}"
    return str(value)


def season_stats_output(rows: Iterable[Mapping[str, object]]) -> CsvOutput:
    return CsvOutput(
        kind="season_stats",
        columns=SEASON_STATS_COLUMNS,
        keys=SEASON_STATS_KEYS,
        rows=[dict(row) for row in rows],
    )


def box_score_output(rows: Iterable[Mapping[str, object]]) -> CsvOutput:
    return CsvOutput(
        kind="box_score",
        columns=BOX_SCORE_COLUMNS,
        keys=BOX_SCORE_KEYS,
        rows=[dict(row) for row in rows],
    )


def roster_output(rows: Iterable[Mapping[str, object]]) -> CsvOutput:
    return CsvOutput(
        kind="roster",
        columns=ROSTER_COLUMNS,
        keys=ROSTER_KEYS,
        rows=[dict(row) for row in rows],
    )
