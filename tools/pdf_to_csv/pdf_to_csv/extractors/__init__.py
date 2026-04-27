from .base import Extractor, ExtractionResult
from .gamechanger import GameChangerExtractor
from .prestosports import PrestosportsExtractor
from .maxpreps import MaxPrepsExtractor
from .roster import RosterExtractor
from .generic import GenericExtractor

EXTRACTORS = {
    "gamechanger": GameChangerExtractor,
    "prestosports": PrestosportsExtractor,
    "maxpreps": MaxPrepsExtractor,
    "roster": RosterExtractor,
    "generic": GenericExtractor,
}

__all__ = [
    "Extractor",
    "ExtractionResult",
    "EXTRACTORS",
    "GameChangerExtractor",
    "PrestosportsExtractor",
    "MaxPrepsExtractor",
    "RosterExtractor",
    "GenericExtractor",
]
