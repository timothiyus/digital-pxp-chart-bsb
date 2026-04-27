"""Detect the source provider and document kind from a PDF.

Returns (source, kind) where:
    source in {"gamechanger", "prestosports", "maxpreps", "generic"}
    kind   in {"season_stats", "box_score", "roster"}
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Optional

import pdfplumber


@dataclass
class Detection:
    source: str
    kind: str
    confidence: float
    reasons: list[str]


# Header-text fingerprints that are stable across providers.
_PRESTOSPORTS_URL = re.compile(r"sidearm|presto|monospace-template|teaminfo-network", re.IGNORECASE)
_GAMECHANGER_FP = re.compile(r"gamechanger", re.IGNORECASE)
_MAXPREPS_FP = re.compile(r"maxpreps", re.IGNORECASE)

# Roster page indicator: header row containing both 'NO' and 'POS' but no batting/pitching markers.
_ROSTER_HEADER = re.compile(r"\bNO\.?\b.*\bNAME\b.*\bPOS\.?\b", re.IGNORECASE)
_BATTING_HEADER = re.compile(r"#\s+Player\s+AVG\b|\bAVG\b.*\bAB\b.*\bRBI\b", re.IGNORECASE)
_PITCHING_HEADER = re.compile(r"#\s+Player\s+ERA\b|\bERA\b.*\bIP\b.*\bWHIP\b|\bERA\b.*\bIP\b", re.IGNORECASE)
# Box score = single game (one date, fewer rows). Heuristic: title contains "GM", "@", or a date pattern.
_BOX_SCORE_HINT = re.compile(r"\b(box ?score|game ?\d|gm\s*\d|@)\b", re.IGNORECASE)


def detect(pdf: pdfplumber.PDF) -> Detection:
    reasons: list[str] = []

    # Concatenate text from up to the first 3 pages for fingerprinting.
    sample = ""
    for page in pdf.pages[:3]:
        sample += (page.extract_text() or "") + "\n"

    metadata_blob = " ".join(
        str(v) for v in (pdf.metadata or {}).values() if v
    )
    haystack = f"{metadata_blob}\n{sample}"

    # --- Source ---
    source = "generic"
    if _GAMECHANGER_FP.search(haystack):
        source = "gamechanger"
        reasons.append("matched 'gamechanger' fingerprint")
    elif _MAXPREPS_FP.search(haystack):
        source = "maxpreps"
        reasons.append("matched 'maxpreps' fingerprint")
    elif _PRESTOSPORTS_URL.search(haystack):
        source = "prestosports"
        reasons.append("matched prestosports/sidearm URL pattern")

    # --- Kind ---
    has_batting = bool(_BATTING_HEADER.search(sample))
    has_pitching = bool(_PITCHING_HEADER.search(sample))
    has_roster_header = bool(_ROSTER_HEADER.search(sample))

    if has_batting or has_pitching:
        # Box-score vs season-stats: box scores tend to title themselves.
        title_blob = (pdf.metadata or {}).get("Title", "") + " " + sample[:400]
        if _BOX_SCORE_HINT.search(title_blob) and not has_pitching and not has_batting:
            kind = "box_score"
            reasons.append("title hints box-score and limited stat sections")
        else:
            kind = "season_stats"
            reasons.append(
                f"stat headers found: batting={has_batting}, pitching={has_pitching}"
            )
    elif has_roster_header:
        kind = "roster"
        reasons.append("matched roster header (NO/NAME/POS)")
    else:
        # Fall through: probably roster-like or unknown. Default to roster only
        # when a 'NAME' column is visible without stat columns; otherwise season_stats
        # so the generic extractor still gets a chance.
        if re.search(r"\bNAME\b", sample, re.IGNORECASE):
            kind = "roster"
            reasons.append("no stat headers but found NAME column")
        else:
            kind = "season_stats"
            reasons.append("no clear signals; defaulting to season_stats")

    confidence = 0.85 if source != "generic" else 0.5
    if source != "generic" and (has_batting or has_roster_header):
        confidence = 0.95

    return Detection(source=source, kind=kind, confidence=confidence, reasons=reasons)


def override_detection(
    detection: Detection,
    *,
    source: Optional[str] = None,
    kind: Optional[str] = None,
) -> Detection:
    """Apply CLI overrides for source/kind to a Detection."""
    return Detection(
        source=source or detection.source,
        kind=kind or detection.kind,
        confidence=1.0 if (source or kind) else detection.confidence,
        reasons=detection.reasons + (["overridden by CLI flag"] if (source or kind) else []),
    )
