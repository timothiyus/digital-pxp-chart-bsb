# Data Pipeline Plan

This app needs three import paths, because play-by-play prep rarely arrives in one clean format.

## 1. CSV stats

Current status: working for GameChanger-style stat CSVs.

The importer reads the header row containing `Number`, `Last`, and `First`, then maps batting, pitching, and fielding columns into each player record.

## 2. PDF stat packets

Required next step: a local parser service.

Browser-only PDF parsing is not reliable enough for stat packets, especially when tables are generated as positioned text. The right path is:

- Extract text and tables with Python.
- Normalize tables into a shared player-stat shape.
- Show an import review screen before writing records.
- Let the user manually resolve names that do not match exactly.

Recommended Python stack:

- `pdfplumber` for table/text extraction.
- `pandas` for cleanup and column mapping.
- `rapidfuzz` for player name matching.
- `FastAPI` later if the browser app needs a local import endpoint.

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
