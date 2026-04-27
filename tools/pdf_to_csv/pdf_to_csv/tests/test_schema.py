"""Schema tests: the writer must preserve duplicate column names verbatim
because the browser importer reads pitching stats from the second occurrence
of HR/BB/SO/H/R via headerIndex(headers, name, 2)."""

from pathlib import Path

from pdf_to_csv.schema import (
    SEASON_STATS_COLUMNS,
    BOX_SCORE_COLUMNS,
    season_stats_output,
    box_score_output,
    roster_output,
)


def _read_csv(path: Path) -> list[list[str]]:
    import csv
    with path.open(encoding="utf-8") as fh:
        return list(csv.reader(fh))


def test_season_stats_header_has_duplicate_pitching_columns():
    duplicates = [c for c in SEASON_STATS_COLUMNS if SEASON_STATS_COLUMNS.count(c) > 1]
    assert set(duplicates) == {"HR", "BB", "SO", "H", "R"}


def test_season_stats_round_trip_preserves_duplicates(tmp_path: Path):
    out_path = tmp_path / "out.csv"
    season_stats_output(
        [
            {
                "Number": "31",
                "Last": "Togher",
                "First": "Sean",
                "AB": 146,
                "H": 61,
                "HR": 13,
                "R": 54,
                "BB": 35,
                "SO": 18,
                "ERA": 7.71,
                "IP": 42.0,
                "H#2": 58,
                "R#2": 39,
                "BB#2": 16,
                "SO#2": 29,
                "HR#2": 11,
                "ER": 36,
            }
        ]
    ).write(out_path)

    rows = _read_csv(out_path)
    headers = rows[0]
    record = rows[1]

    h_positions = [i for i, h in enumerate(headers) if h == "H"]
    assert len(h_positions) == 2, "expected duplicate H columns to survive"
    assert record[h_positions[0]] == "61"
    assert record[h_positions[1]] == "58"

    hr_positions = [i for i, h in enumerate(headers) if h == "HR"]
    assert record[hr_positions[0]] == "13"
    assert record[hr_positions[1]] == "11"


def test_box_score_columns_match_importer_subset():
    # importBoxScoreFromCsv reads exactly these columns by name (app.js:536-547).
    required = {
        "Number", "Last", "First",
        "AB", "H", "2B", "3B", "HR", "BB", "SO", "RBI", "R", "SB", "HBP", "IP",
    }
    assert required.issubset(set(BOX_SCORE_COLUMNS))


def test_roster_writes_minimum_importer_fields(tmp_path: Path):
    out_path = tmp_path / "roster.csv"
    roster_output(
        [{"Number": "1", "First": "Cody", "Last": "Kilpatrick", "Position": "C/OF",
          "ClassYear": "SO", "Hometown": "Sheridan, WY / Sheridan HS"}]
    ).write(out_path)
    rows = _read_csv(out_path)
    assert "Number" in rows[0]
    assert "Last" in rows[0]
    assert "First" in rows[0]
    assert rows[1][rows[0].index("Last")] == "Kilpatrick"


def test_box_score_output_writes_empty_pitching(tmp_path: Path):
    out_path = tmp_path / "box.csv"
    box_score_output([{"Number": "31", "Last": "Togher", "First": "Sean", "AB": 4, "H": 2}]).write(out_path)
    rows = _read_csv(out_path)
    assert rows[1][rows[0].index("AB")] == "4"
    assert rows[1][rows[0].index("H")] == "2"
    assert rows[1][rows[0].index("IP")] == ""
