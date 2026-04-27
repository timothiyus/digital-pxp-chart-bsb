"""Golden-file tests against the real PDFs in Sample Data/.

These tests are skipped when the sample PDFs aren't present, so the suite
remains runnable in clones that don't include them.
"""

from pathlib import Path

import pytest
import pdfplumber

from pdf_to_csv.detect import detect
from pdf_to_csv.extractors import (
    PrestosportsExtractor,
    RosterExtractor,
    GenericExtractor,
)


REPO_ROOT = Path(__file__).resolve().parents[4]
SAMPLE_DIR = REPO_ROOT / "Sample Data"

STATS_PDF = (
    SAMPLE_DIR
    / "2025-26 Baseball Statistics - Garden City Community College - Garden City CC - Print Version.pdf"
)
ROSTER_PDF = (
    SAMPLE_DIR
    / "2025-26 Baseball Roster - Garden City CC - Print Version.pdf"
)


@pytest.fixture(scope="module")
def stats_pdf():
    if not STATS_PDF.exists():
        pytest.skip(f"sample PDF missing: {STATS_PDF.name}")
    with pdfplumber.open(STATS_PDF) as pdf:
        yield pdf


@pytest.fixture(scope="module")
def roster_pdf():
    if not ROSTER_PDF.exists():
        pytest.skip(f"sample PDF missing: {ROSTER_PDF.name}")
    with pdfplumber.open(ROSTER_PDF) as pdf:
        yield pdf


def test_detects_prestosports_from_stats_pdf(stats_pdf):
    detection = detect(stats_pdf)
    assert detection.source == "prestosports"
    assert detection.kind == "season_stats"


def test_prestosports_extracts_two_way_player(stats_pdf):
    """Roy Higinbotham (#17) hits AND pitches; both stat lines must land
    in the same row, with pitching stats targeting the duplicate columns."""
    result = PrestosportsExtractor().extract(stats_pdf, "season_stats")
    assert result.rows_extracted >= 30
    higinbotham = next(r for r in result.csv.rows if r.get("Last") == "Higinbotham")
    # Batting (first occurrence keys)
    assert higinbotham["AB"] == 51
    assert higinbotham["H"] == 19
    assert higinbotham["HR"] == 3
    assert higinbotham["RBI"] == 11
    # Pitching (second occurrence keys, written to the second HR/BB/SO/H/R columns)
    assert higinbotham["IP"] == 20.0
    assert higinbotham["W"] == 0
    assert higinbotham["L"] == 1
    assert higinbotham["ERA"] == 8.10
    assert higinbotham["ER"] == 18
    assert higinbotham["H#2"] == 14
    assert higinbotham["BB#2"] == 27
    assert higinbotham["SO#2"] == 24


def test_prestosports_skips_total_and_opponents_rows(stats_pdf):
    result = PrestosportsExtractor().extract(stats_pdf, "season_stats")
    last_names = [r.get("Last") for r in result.csv.rows]
    assert "Total" not in last_names
    assert "Opponents" not in last_names


def test_prestosports_pitcher_only_has_no_batting(stats_pdf):
    """Joe Baumbach (#45) only pitches in this season — batting fields stay blank."""
    result = PrestosportsExtractor().extract(stats_pdf, "season_stats")
    baumbach = next(r for r in result.csv.rows if r.get("Last") == "Baumbach")
    assert baumbach.get("AB") in (None, 0, "", 0.0) or baumbach.get("AB") == 0
    assert baumbach["IP"] == 27.1
    assert baumbach["W"] == 2
    assert baumbach["ERA"] == 9.22


def test_roster_extracts_all_players(roster_pdf):
    result = RosterExtractor().extract(roster_pdf, "roster")
    assert result.rows_extracted == 45  # confirmed against printed roster
    numbers = [r["Number"] for r in result.csv.rows]
    assert "RS" in numbers  # Drew Patterson
    assert "1" in numbers and "47" in numbers


def test_roster_preserves_hometown_and_school(roster_pdf):
    result = RosterExtractor().extract(roster_pdf, "roster")
    kilpatrick = next(r for r in result.csv.rows if r["Last"] == "Kilpatrick")
    assert kilpatrick["First"] == "Cody"
    assert kilpatrick["Position"] == "C/OF"
    assert kilpatrick["ClassYear"] == "SO"
    assert "Sheridan" in kilpatrick["Hometown"]
    assert "Sheridan HS" in kilpatrick["Hometown"]


def test_roster_handles_combined_position_token(roster_pdf):
    """RHP/IF and OF/IF should arrive intact, not split across columns."""
    result = RosterExtractor().extract(roster_pdf, "roster")
    quintela = next(r for r in result.csv.rows if r["Last"] == "Quintela")
    assert quintela["Position"] == "RHP/IF"


def test_generic_falls_back_to_text_parser(stats_pdf):
    """Generic must handle the prestosports text format without explicit detection."""
    result = GenericExtractor().extract(stats_pdf, "season_stats")
    assert result.rows_extracted >= 30


def test_csv_writes_to_tmp(tmp_path, stats_pdf):
    """End-to-end: write a real CSV and verify duplicate column headers persist."""
    result = PrestosportsExtractor().extract(stats_pdf, "season_stats")
    out = tmp_path / "stats.csv"
    result.csv.write(out)
    text = out.read_text(encoding="utf-8")
    # headerIndex() in app.js relies on this exact duplication
    assert text.split("\n")[0].count(",HR,") + text.split("\n")[0].count(",HR\n") + (1 if text.split("\n")[0].endswith(",HR") else 0) >= 1
    headers = text.split("\n")[0].split(",")
    assert headers.count("HR") == 2
    assert headers.count("BB") == 2
    assert headers.count("SO") == 2
    assert headers.count("H") == 2
    assert headers.count("R") == 2
