"""Heuristic fallback when no provider-specific extractor matches.

Strategy:
  1. Try GameChanger-style table extraction (works for any PDF that produces
     proper tables via pdfplumber).
  2. If that yields nothing, try Prestosports-style text parsing — many
     positioned-text stat dumps from other providers share the
     '<num> <name>........... <values>' shape.
  3. Roster mode runs the RosterExtractor regardless, since roster layouts
     are roughly consistent.
"""

from __future__ import annotations

import pdfplumber

from .base import Extractor, ExtractionResult
from .gamechanger import GameChangerExtractor
from .prestosports import PrestosportsExtractor
from .roster import RosterExtractor


class GenericExtractor:
    name = "generic"

    def extract(self, pdf: pdfplumber.PDF, kind: str) -> ExtractionResult:
        if kind == "roster":
            return RosterExtractor().extract(pdf, kind)

        gc_result = GameChangerExtractor().extract(pdf, kind)
        if gc_result.rows_extracted > 0:
            gc_result.warnings.append("matched via generic fallback (table extraction)")
            return gc_result

        ps_result = PrestosportsExtractor().extract(pdf, kind)
        ps_result.warnings.append("matched via generic fallback (text parsing)")
        return ps_result
