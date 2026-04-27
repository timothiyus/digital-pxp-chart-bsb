# Data Pipeline Plan

This app needs three import paths, because play-by-play prep rarely arrives in one clean format.

## 1. CSV stats

Current status: working for GameChanger-style stat CSVs.

The importer reads the header row containing `Number`, `Last`, and `First`, then maps batting, pitching, and fielding columns into each player record.

## 2. PDF stat packets

Implemented as `tools/pdf_to_csv` — a Python CLI that converts source PDFs into CSVs the existing browser importer can consume unchanged. See [`tools/pdf_to_csv/README.md`](../tools/pdf_to_csv/README.md) for installation and usage.

The CLI auto-detects the source provider (Prestosports, GameChanger, MaxPreps) and document kind (season stats, box score, roster), dispatches to the right extractor, and writes a CSV next to the input PDF. The user reviews the CSV before importing, which doubles as the manual-resolution step for ambiguous name matches.

Two interfaces, same extractors:

- **Browser bridge** (`python -m pdf_to_csv.server`) — a FastAPI service on `127.0.0.1:8766`. The Data tab POSTs the PDF to `/parse`, the bridge returns CSV text + detection metadata, and the app pipes the result through the existing CSV importer. The Data tab shows a live "PDF bridge: ready / offline" pill so users know whether the bridge is reachable before they upload.
- **CLI** (`python -m pdf_to_csv <pdf>`) — for one-off conversions, scripting, or when running the bridge isn't convenient.

Why bridge instead of in-browser parsing:

- Browser-only PDF parsing isn't reliable for monospace positioned-text renders (e.g., Prestosports' `monospace-template`).
- The existing CSV importer already does name matching by `(side, number, first, last)` key — the bridge just feeds it cleaner data.
- The bridge runs entirely on `localhost`; nothing leaves the machine.

Stack: `pdfplumber` for text/table extraction, `rapidfuzz` for fuzzy column-name aliasing, `click` for the CLI, `FastAPI` + `uvicorn` for the bridge.

## 3. Box scores and historical seasons

The database should treat every stat source as an additive record, not a destructive overwrite.

Suggested model:

- `players`: identity, pronunciation, class, position, notes.
- `teams`: school/program identity.
- `seasons`: year plus team.
- `games`: opponent, date, location, result.
- `game_player_lines`: box-score batting/pitching/fielding lines by player.
- `season_stat_snapshots`: imported season totals from CSV/PDF.
- `plate_appearances`: manually logged or imported specific AB history.
- `player_aliases`: name matching across PDFs, previous seasons, and stat sites.

This allows previous years, freshman-only sparse data, previous matchups, and live game updates to coexist without losing source context.
