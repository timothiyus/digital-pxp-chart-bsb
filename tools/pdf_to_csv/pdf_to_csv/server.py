"""Local HTTP bridge so the browser app can POST PDFs and get CSVs back.

Listens on http://127.0.0.1:8766 by default — port 8766 is chosen to leave
8765 free for the http-server / static dev server people commonly run to
host the app itself.

Run from this directory:
    python -m pdf_to_csv.server

Or from the repo root:
    python -m tools.pdf_to_csv.pdf_to_csv.server

Endpoints:
    GET  /health        liveness probe used by the Data tab status pill
    POST /parse         multipart upload; returns JSON {csv, kind, source, rows, warnings}

CORS is wide open because this binds to localhost only and exists solely to
serve the local browser app (which may be opened via file:// or
http://localhost:<anything>).
"""

from __future__ import annotations

import io
import logging
import os
import sys
from typing import Optional


# When the server is launched via pythonw.exe (no console window — used by
# Windows scheduled tasks), sys.stdout / sys.stderr can be None, which
# crashes uvicorn the first time it tries to log. Redirect to devnull so
# logging is a no-op instead of an exception.
if sys.stdout is None:
    sys.stdout = open(os.devnull, "w", encoding="utf-8")
if sys.stderr is None:
    sys.stderr = open(os.devnull, "w", encoding="utf-8")

import pdfplumber
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from . import __version__
from .detect import detect, override_detection
from .extractors import EXTRACTORS


log = logging.getLogger("pdf_to_csv.server")


app = FastAPI(title="pdf_to_csv bridge", version=__version__)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {"ok": True, "service": "pdf_to_csv", "version": __version__}


_KIND_FLAG = {
    "auto": None,
    "season": "season_stats",
    "season_stats": "season_stats",
    "box": "box_score",
    "box_score": "box_score",
    "roster": "roster",
}


@app.post("/parse")
async def parse_pdf(
    file: UploadFile = File(...),
    kind: Optional[str] = Form("auto"),
    fmt: Optional[str] = Form("auto"),
) -> dict:
    if not (file.filename or "").lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="upload must be a .pdf file")

    raw = await file.read()
    if not raw:
        raise HTTPException(status_code=400, detail="empty upload")

    kind_key = (kind or "auto").lower()
    if kind_key not in _KIND_FLAG:
        raise HTTPException(status_code=400, detail=f"invalid kind: {kind}")
    fmt_key = (fmt or "auto").lower()

    try:
        with pdfplumber.open(io.BytesIO(raw)) as pdf:
            detection = detect(pdf)
            cli_source = None if fmt_key == "auto" else fmt_key
            cli_kind = _KIND_FLAG[kind_key]
            detection = override_detection(detection, source=cli_source, kind=cli_kind)
            source_key = "roster" if detection.kind == "roster" else detection.source
            if source_key not in EXTRACTORS:
                source_key = "generic"
            extractor = EXTRACTORS[source_key]()
            result = extractor.extract(pdf, detection.kind)
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001 — surface any extractor crash to the client
        log.exception("parse failed for %s", file.filename)
        raise HTTPException(status_code=500, detail=f"extractor error: {exc}") from exc

    if result.rows_extracted == 0:
        raise HTTPException(
            status_code=422,
            detail={
                "message": "no rows extracted; try overriding kind/fmt",
                "detected_source": detection.source,
                "detected_kind": detection.kind,
                "warnings": result.warnings,
            },
        )

    return {
        "csv": result.csv.to_string(),
        "kind": result.csv.kind,
        "source": extractor.name,
        "detected_source": detection.source,
        "detected_kind": detection.kind,
        "filename": file.filename,
        "rows": result.rows_extracted,
        "warnings": result.warnings,
    }


def _serve(host: str = "127.0.0.1", port: int = 8766) -> None:
    import uvicorn

    uvicorn.run(app, host=host, port=port, log_level="info")


if __name__ == "__main__":
    _serve()
