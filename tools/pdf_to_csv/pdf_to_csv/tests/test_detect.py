from pathlib import Path

import pytest
import pdfplumber

from pdf_to_csv.detect import detect, override_detection


REPO_ROOT = Path(__file__).resolve().parents[4]
SAMPLE_DIR = REPO_ROOT / "Sample Data"


def test_detects_roster_pdf():
    path = SAMPLE_DIR / "2025-26 Baseball Roster - Garden City CC - Print Version.pdf"
    if not path.exists():
        pytest.skip("sample roster PDF missing")
    with pdfplumber.open(path) as pdf:
        det = detect(pdf)
    assert det.kind == "roster"


def test_detects_stats_pdf_as_prestosports():
    path = (
        SAMPLE_DIR
        / "2025-26 Baseball Statistics - Garden City Community College - Garden City CC - Print Version.pdf"
    )
    if not path.exists():
        pytest.skip("sample stats PDF missing")
    with pdfplumber.open(path) as pdf:
        det = detect(pdf)
    assert det.source == "prestosports"
    assert det.kind == "season_stats"


def test_override_detection_replaces_fields():
    base = type("D", (), {"source": "prestosports", "kind": "season_stats", "confidence": 0.9, "reasons": ["x"]})()
    overridden = override_detection(base, source="gamechanger", kind="box_score")
    assert overridden.source == "gamechanger"
    assert overridden.kind == "box_score"
    assert overridden.confidence == 1.0
    assert "overridden" in overridden.reasons[-1]
