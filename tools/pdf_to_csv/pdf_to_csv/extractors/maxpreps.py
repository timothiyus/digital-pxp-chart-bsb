"""Extractor for MaxPreps PDF stat exports.

MaxPreps stat sheets ship a structured table per stat category (batting,
pitching, fielding). They share the GameChanger-style table layout closely
enough that the same extract_tables() approach works as a starting point.
We alias common MaxPreps-specific column labels (e.g., 'K' -> 'SO',
'OPP AVG' -> 'BAA') in normalize.COLUMN_ALIASES.

When a sample arrives, refine here. Until then, the GameChanger extractor
provides the right shape.
"""

from __future__ import annotations

import pdfplumber

from .gamechanger import GameChangerExtractor
from .base import Extractor, ExtractionResult


class MaxPrepsExtractor:
    name = "maxpreps"

    def __init__(self) -> None:
        self._inner = GameChangerExtractor()

    def extract(self, pdf: pdfplumber.PDF, kind: str) -> ExtractionResult:
        result = self._inner.extract(pdf, kind)
        # Replace warning text so users know which extractor ran.
        result.warnings = [
            w.replace("GameChanger", "MaxPreps") for w in result.warnings
        ]
        return result
