"""Helpers for cleaning extracted values: names, numbers, aliases."""

from __future__ import annotations

import re
from typing import Optional

from rapidfuzz import process, fuzz


# Provider-specific column header -> canonical importer column.
# Add aliases here as new provider quirks surface.
COLUMN_ALIASES: dict[str, str] = {
    # Identity
    "#": "Number",
    "No.": "Number",
    "No": "Number",
    "Jersey": "Number",
    "Number": "Number",
    "Player": "Player",
    "Name": "Player",
    "Last": "Last",
    "Last Name": "Last",
    "First": "First",
    "First Name": "First",

    # Batting
    "GP": "GP",
    "G": "GP",
    "PA": "PA",
    "AB": "AB",
    "H": "H",
    "Hits": "H",
    "2B": "2B",
    "3B": "3B",
    "HR": "HR",
    "HRs": "HR",
    "RBI": "RBI",
    "RBIs": "RBI",
    "R": "R",
    "Runs": "R",
    "BB": "BB",
    "Walks": "BB",
    "SO": "SO",
    "K": "SO",
    "Ks": "SO",
    "Strikeouts": "SO",
    "HBP": "HBP",
    "SF": "SF",
    "SAC": "SF",
    "SH": "SH",
    "SB": "SB",
    "CS": "CS",

    # Pitching
    "IP": "IP",
    "GS": "GS",
    "BF": "BF",
    "W": "W",
    "L": "L",
    "ERA": "ERA",
    "WHIP": "WHIP",
    "BAA": "BAA",
    "B/AVG": "BAA",
    "OAVG": "BAA",
    "OPP AVG": "BAA",
    "ER": "ER",
    "APP": "APP",  # appearances; not stored directly but useful as fallback for GP

    # Roster
    "POS.": "Position",
    "POS": "Position",
    "Pos": "Position",
    "Pos.": "Position",
    "CL.": "ClassYear",
    "CL": "ClassYear",
    "Yr": "ClassYear",
    "Yr.": "ClassYear",
    "Class": "ClassYear",
    "HT.": "Height",
    "HT": "Height",
    "Ht": "Height",
    "Ht.": "Height",
    "Height": "Height",
    "WT.": "Weight",
    "WT": "Weight",
    "Wt": "Weight",
    "Wt.": "Weight",
    "Weight": "Weight",
    "Hometown": "Hometown",
    "HOMETOWN": "Hometown",
    "HOMETOWN/HIGH SCHOOL": "Hometown",
    "Hometown/High School": "Hometown",
    "Hometown / High School": "Hometown",
}


def canonical_column(label: str) -> Optional[str]:
    """Return the canonical column name for a provider header label, or None."""
    if not label:
        return None
    stripped = label.strip()
    if stripped in COLUMN_ALIASES:
        return COLUMN_ALIASES[stripped]
    # Try a case-insensitive fallback.
    for key, value in COLUMN_ALIASES.items():
        if key.lower() == stripped.lower():
            return value
    return None


def fuzzy_canonical_column(label: str, threshold: int = 80) -> Optional[str]:
    """Fuzzy match a label against known aliases. Returns canonical or None.

    Short alias keys like '#' or 'K' inflate WRatio scores artificially, so we
    restrict candidates to those within a couple of characters of the input
    length before scoring.
    """
    if not label:
        return None
    cleaned = label.strip()
    if not cleaned:
        return None
    candidates = [
        key for key in COLUMN_ALIASES
        if abs(len(key) - len(cleaned)) <= 2
    ]
    if not candidates:
        return None
    match = process.extractOne(
        cleaned,
        candidates,
        scorer=fuzz.ratio,
        score_cutoff=threshold,
    )
    if not match:
        return None
    return COLUMN_ALIASES[match[0]]


_NUMERIC_BLANKS = {"", "-", "--", "—", "–", "N/A", "n/a", "NA"}


def parse_number(value: object) -> float:
    """Parse a stat cell into a float. Empty/dash markers become 0."""
    if value is None:
        return 0.0
    if isinstance(value, (int, float)):
        return float(value)
    s = str(value).strip()
    if s in _NUMERIC_BLANKS:
        return 0.0
    s = s.rstrip("%").replace(",", "").lstrip("+")
    # Leading dot like ".418" parses fine via float.
    try:
        return float(s)
    except ValueError:
        return 0.0


def parse_int(value: object) -> int:
    """Parse a stat cell into an int. Floats are truncated."""
    return int(parse_number(value))


# Strip trailing periods used as visual padding in monospace stat dumps.
_NAME_PADDING = re.compile(r"\.{2,}$")


def clean_name_token(token: str) -> str:
    """Remove dot padding ('Sean Togher.........' -> 'Sean Togher')."""
    return _NAME_PADDING.sub("", token).strip().rstrip(".")


def split_first_last(full_name: str) -> tuple[str, str]:
    """Split a player name into (First, Last).

    Handles three formats commonly seen in PDFs:
      - "Last, First"        -> ("First", "Last")
      - "Last, First Middle" -> ("First Middle", "Last")
      - "First Last"         -> ("First", "Last")
      - "First Middle Last"  -> ("First Middle", "Last")
      - "Last, First Suffix" e.g. "Smith Jr, John" -> ("John", "Smith Jr")

    Single-token names land entirely in Last to keep the importer's required
    Last field populated.
    """
    name = clean_name_token(full_name)
    if not name:
        return "", ""
    if "," in name:
        last, first = name.split(",", 1)
        return first.strip(), last.strip()
    parts = name.split()
    if len(parts) == 1:
        return "", parts[0]
    return " ".join(parts[:-1]), parts[-1]


def split_hometown_school(value: str) -> tuple[str, str]:
    """Split 'Sheridan, WY / Sheridan HS' -> ('Sheridan, WY', 'Sheridan HS')."""
    if not value:
        return "", ""
    if "/" in value:
        town, school = value.split("/", 1)
        return town.strip(), school.strip()
    return value.strip(), ""


def is_summary_row(token: str) -> bool:
    """Total / Opponents rows in stat dumps are not players."""
    cleaned = clean_name_token(token).lower()
    return cleaned.startswith("total") or cleaned.startswith("opponent")


def empty_stat_keys() -> dict[str, str]:
    """Return a fresh dict with every numeric stat key set to '' (writer formats blanks)."""
    return {}
