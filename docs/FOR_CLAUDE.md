# FOR_CLAUDE.md

Handoff for continuing the Baseball PxP Chart app.

## Project Goal

Build a local-first HTML/CSS/JS baseball play-by-play scorecard/HUD for radio PxP prep and live game charting. The current build is still static HTML/CSS/JS, but it now syncs a single JSON state document through Supabase Auth/Realtime while retaining `localStorage` as the local cache.

Primary user need: duplicate the usefulness of a handwritten baseball scorecard, especially the diamond notation, while making player stats, pitching data, line score, substitutions, and notes dynamic.

## Main Files

- `index.html`: app shell and panels.
- `styles.css`: layout, scorecard grid, pitcher HUD, defense chart, line score styling.
- `app.js`: state, CSV import, player/pitcher stat logic, scorecard rendering, event handling.
- `docs/DATA_PIPELINE.md`: early notes on future CSV/PDF import architecture.
- `docs/HANDOFF.md`: previous short handoff.
- `docs/FOR_CLAUDE.md`: this file.

## Current Data Model

State is stored in browser `localStorage` under this key and mirrored to Supabase `app_state` when signed in:

```js
pxp-baseball-chart-v1
```

The app keeps separate chart state for both teams:

```js
state.charts.home
state.charts.away
```

Important chart fields:

- `lineup`: player IDs in batting order.
- `lineupPositions`: position labels by lineup slot.
- `scorecard`: keyed by lineup slot, inning, and optional extra AB.
- `extraAbs`: tracks additional at-bats per player/inning.
- `baseState`: current live runners on first/second/third.
- `inningTotals`: per-inning `R/H/E/LOB/RISP`.
- `activePitcherId`, `bullpenIds`, `pitchCounts`, `pitchingLines`, `pitchLog`.
- `substitutions`: per-lineup-slot substitution metadata.

Scorecard cell keys:

- First AB in an inning: `slot-inning`, for example `1-3`.
- Extra ABs: `slot-inning-abNumber`, for example `1-3-2`.

## What Has Been Built

### Scorecard / Diamonds

- Only one editable inning is shown at a time.
- "Show Full Chart" reveals the full scorecard to date.
- Each at-bat cell has:
  - Count input.
  - RBI dropdown from 0-4.
  - Diamond path buttons.
  - B/S/F pitch buttons.
  - Result buttons: `BB`, `K`, `Kc`, `1B`, `2B`, `3B`, `HR`, `ROE`, `E`.
  - "More" dropdown for detailed notation.
  - Clear button.
- At-bat outcomes render in the middle of the diamond.
- Extra at-bats can be added per lineup slot/inning.
- Extra at-bats now render horizontally in the editable inning and in the full chart.
- Extra at-bats can now be removed individually with a `-` button.

### Base / Runner Logic

Basic auto-advancement exists:

- `1B`: batter to first, first to second, second to third, third scores.
- `2B`: batter to second, first to third, second/third score.
- `3B`: batter to third, all existing runners score.
- `HR`: batter and existing runners score.
- `BB`, `HBP`, `ROE`: batter to first.

Recent important fix:

- The Bases HUD was correct, but original runner diamonds stayed showing first base. A helper now finds the runner's latest scorecard cell and updates that visual path when the runner advances.
- RISP now increments only when a runner first reaches second or third, not when they move from second to third.

Relevant helpers in `app.js`:

- `diamondPathThrough(base)`
- `emptyDiamondPath()`
- `activeDiamondTerminal(bases)`
- `scoringPathActive(bases)`
- `setBatterBaseState(chart, batterId, terminalBase)`
- `findLatestScoreCellKeyForPlayer(playerId, exceptKey)`
- `updateRunnerDiamond(playerId, terminalBase, exceptKey)`

### Line Score

- Line score shows each inning with `R`, `H`, `E`, `LOB`, and `RISP`.
- A totals column `T` was added.
- Inning edit dropdowns are tucked under the Bases HUD to save vertical space.
- The Bases/Edit panel was moved to the right side of the line score area to stop overlap.

### Pitching HUD

The opposing pitcher HUD includes:

- Total pitches thrown.
- W-L.
- ERA.
- G/GS.
- IP.
- HR.
- BB.
- K.
- AVG/BAA.
- Live game line: IP, H, R, ER, BB, K, HR, BF, P/S.

Pitch buttons in the scorecard update pitch count and pitcher live line.

Bullpen support exists as IDs and display strips, but UX still needs serious refinement.

### Substitutions

- Each lineup slot has a sub dropdown and PH/PR/CR/DEF text.
- Selecting a sub displays basic batting info for that sub.
- Sub handling is still attached to a lineup slot and does not yet fully replace/branch player identity for event replay.

### Dummy Data

Two dummy teams exist in `Sample Data`:

- `Dummy Team - Prairie View Falcons Stats.csv`
- `Dummy Team - Riverbend Tigers Stats.csv`

Each has 12 players so the user can test subs and pitchers without reusing Garden City data.

## Recent Changelog

### Data tab, freetext diamond notation, segmented toggle, SHOW-ALL fix

- **New top-level Data tab** next to Chart/Roster/Pitching/Game Log. Sub-tabs: Season Stats / Box Scores / Export / Settings & Help.
- **Season Stats** subsection holds the existing Import CSV + Attach PDF flow, moved out of the top header. Top header now contains only the Reset button.
- **Box Scores** subsection: new CSV import format for per-game lines (`Number, Last, First, AB, H, 2B, 3B, HR, BB, SO, RBI, ...`). Captures `gameDate`, `opponent`, and a `resultNote` per import. Stored in `state.boxScores: [{ id, side, gameDate, opponent, resultNote, lines: [{ playerId, AB, H, ... }] }]`. Listed in the subsection with delete affordance.
- **Active Batter Detail "Recent Games" strip** surfaces the last 5 box-score lines for the active batter (e.g., `4/15  vs Pratt  2/4 · 1 HR, 2 RBI`). Pulls automatically from box scores filtered by `playerId`.
- **Settings & Help subsection** contains the notation cheat sheet (token / meaning / stat-bearing flag) plus a storage explanation.
- **Freetext notation in the diamond center.** The static "1B/-/F8" display became an `<input>` with a shared `<datalist id="notation-suggestions">`. Type any token; on blur or Enter, known stat-bearing tokens (1B/2B/3B/HR/BB/K/Kc/HBP/ROE/E/FC/SF/SAC/SH) trigger `applyChartAction` automatically. Unknown tokens (F8, 6-4-3 DP, "weak grounder to short") are kept as flavor text and shown in gold (`is-unknown` class). New helpers: `notationStatMap`, `notationSuggestions`, `notationActionKey`, `populateNotationDatalist`. The old bottom-row notation `<select>` is removed; the score-result-row now just holds Clear and Remove-AB.
- **Segmented toggle** replaces the FOCUS/SHOW-ALL single button. Pill-shaped two-button group with active state and shadow; lives next to Prev / Next At Bat.
- **SHOW ALL semantic fixed.** In `viewMode === "all"`, every visible row gets the full count/pitch/result/notation surface (the compact treatment is now gated on `focusMode && !isActive && !hasRunner`). In `focused` mode, only the active row is full-size.

### Paper-fidelity overhaul: no auto-advance, bat-around column displacement, focused view, batter detail

- **Auto-advance removed.** `applyChartAction` no longer chain-moves runners on 1B/2B/3B/HR/BB. The result button only sets the batter's path on the diamond + the batter's stats + the inning H/R count for the batter. Existing runners on base stay where they are; the broadcaster manually advances each via the runner's diamond or per-row ADV/SCORED/OUT buttons. Strict paper fidelity.
- **Bat-around column displacement.** When the order wraps in inning N and the same slot's natural column N is already filled, the next AB displaces into column N+1 (or further) with `cell.actualInning = N`. Stats accrue to the actual inning, not the column. The editable view auto-renders the natural column AND any adjacent column that holds cells displaced from it. Displaced cells render with a dashed gold outline + "FROM INN N" tag. Conversely, when a slot in inning N+1 has its primary column taken by a displaced cell, the natural N+1 AB stacks as an extra in the same column rather than cascading further right.
- **Focused view by default.** Score grid hides every row except AT BAT, ON DECK, IN HOLE, and any row whose runner is currently on base (per `chart.baseState`). Toggle "SHOW ALL" / "FOCUS 3" in the Up Next strip. Cuts visible row count from 9 to typically 3-5.
- **Compact non-active rows.** Non-active visible rows (on-deck, in-hole, has-runner) render with a smaller diamond (96 px) and no count/pitch/result/notation surface. Diamond bases stay tappable and runner-controls still appear when there's a live runner. Click any batting-order badge to make that slot the active batter (for backfill/correction).
- **Active cell highlight.** The single cell where the active batter's next AB will land gets a green glow ring + drop shadow, even across multi-column displacement.
- **Active Batter Detail panel** fills the dead space in the inning-totals row. Shows: pronunciation in italic gold, slash line (AVG/OBP/SLG/OPS), advanced metrics (ISO/BB%/K%/BABIP/HR/XBH/RBI/SB-attempts), tonight's PA summary, and the last 4 plate appearance results from `state.events`, plus broadcast notes.
- **New helpers**: `getActiveCellLocation`, `ensureActiveCellExists`, `visibleColumnsForView`, `cellActualInning`, `cellHasResult`, `tonightLineForPlayer`, `batterDetailHtml`, `renderScoreCellHtml`, `rowRunnerTerminalForSlot`. Old `slotNeedsExtraAb` is dead but left in place.
- **State**: chart now carries `viewMode: "focused" | "all"` (defaulted in `normalizeState`).
- **Refactor**: `renderScorecard` rewritten to support multi-column rendering. The grid becomes `auto | repeat(visibleColumns, 1fr)` instead of a fixed 2-column layout.

### Runner Mechanics Overhaul (paper-fidelity, iPad-ready)

- Each editable diamond now renders an SVG `<polyline>` showing the actual base path home → 1B → 2B → 3B → home, drawn as a thick green line that grows as the runner advances. Replaces the old "color in the corners" visualization.
- Base markers are 50x50 invisible touch targets centered on each corner with a smaller 20x20 visible square that scales/glows on tap. Targets extend slightly outside the diamond box for forgiving finger taps.
- Diamond size bumped from 82px to 132px in the editable inning.
- Per-cell `runner-controls` row appears only when the cell's terminal is 1B/2B/3B: three big buttons — `→ ADV` (advance one base), `SCORED` (set to home), `OUT` (clear runner). Wired through new `applyTerminalChange(cellKey, newTerminal)` helper that handles R/RISP/baseState updates centrally.
- Removed the AB-cell dim on non-active rows (paper-fidelity: every row stays bright). Replaced with row-level highlight: `has-runner-on-base` rows show a gold left bar; active rows still show green; an `ON 1B/2B/3B` pill appears next to the AT BAT/ON DECK/IN HOLE pill on rows whose runner is on base.
- `score-cell.has-runner` gets a green outline + tinted background; `has-scored` gets a gold tint. At-a-glance you can find runners on the chart.
- Bases HUD redesigned as a single mirror-diamond — small SVG showing home/1B/2B/3B with paths drawn between occupied bases. Each base is a tappable mini-base with the runner's number and last name; tap clears the runner everywhere.
- Result buttons changed from 9-column to 5-column grid (taller buttons, 2 rows). Pitch buttons bumped to 40px min-height. Notation select bumped to 38px.
- Inputs in score cells set to `font-size: 16px` to suppress iOS auto-zoom on focus.
- `touch-action: manipulation` and `-webkit-tap-highlight-color: transparent` applied to all interactive elements in the chart to remove the 300ms tap delay and the gray flash on iOS Safari.
- Refactored: extracted `applyTerminalChange(cellKey, newTerminal)` from the in-handler base-click logic; the base toggle, runner-advance/score/out buttons, and any future runner UI all share the same path.

### Active Batter / Up Next System

- New chart state field: `currentSlot` (1-9, persisted, defaults to 1, migrates cleanly).
- Helpers added near the scorecard helpers in `app.js`: `getCurrentSlot`, `slotAfter`, `playerAtSlot`, `batterIdAtSlot`, `slotHasResultInInning`, `advanceBatter`, `rewindBatter`.
- New "Up Next" strip at the top of the scorecard board shows AT BAT / ON DECK / IN HOLE with batter number, name, and AVG/OBP/OPS for each. Includes Prev / Next At Bat buttons.
- Each score row now renders inside a `.score-row` wrapper with `is-active` / `is-on-deck` / `is-in-hole` classes. Active row gets accent highlight; non-active rows are dimmed but still clickable for backfill.
- Each row has a circular batting-order badge (1-9) and a status pill (AT BAT / ON DECK / IN HOLE) on the player headline.
- `applyChartAction` auto-advances the pointer when the result was entered on the active slot. Backfill on a non-active slot does not advance.
- `Next Inning` preserves `currentSlot`. The new inning starts with whoever was up next.
- Bat-around: when `advanceBatter` lands on a slot that already has a result this inning, it auto-increments `extraAbs` so the next AB is created without a manual "Add At-Bat" click.
- `rewindBatter` cleans up an empty trailing extra-AB cell if it was created by the just-passed advance.

### Latest UI Fixes

- Moved Bases HUD and Edit Inning controls farther right from the line score.
- Added responsive fallback so the line score and bases stack cleanly on smaller screens.
- Added totals to the line score.
- Moved edit inning dropdowns under the Bases HUD.

### Latest Scorecard Fixes

- Added removable extra at-bats.
- Full chart extra at-bats now flow horizontally.
- Editable chart extra at-bats flow horizontally.
- Manual diamond clicks update live base locations.
- Auto-advanced runners now update their original diamonds.
- Steals update runner diamonds.
- Clearing a base from the Bases HUD clears the runner's diamond path.
- RISP logic was corrected to avoid counting a runner twice after second base.

## Known Problems / Next Big Fixes

### 1. Event Replay Is Needed

The current app mutates totals and stats directly. This works for quick testing, but it is fragile.

Known risk:

- Clearing or editing an older cell can restore a stale `baseStateBefore` snapshot and may clobber later state.

Recommended architecture:

1. Store every pitch, PA result, steal, error, substitution, and runner movement as immutable events.
2. Recompute:
   - Scorecard diamonds.
   - Base state.
   - Batter stats.
   - Pitcher live line.
   - Inning totals.
   - Line score.
3. Let edits modify/delete events, then replay.

This is the biggest thing that will turn the project from "good prototype" into reliable game software.

### 2. Runner Movement Needs a Real Drawer

Automatic advancement is useful, but baseball is too weird for it to be enough.

Needed per PA:

- Batter destination: out/first/second/third/home.
- Runner from first destination or out.
- Runner from second destination or out.
- Runner from third destination or out.
- RBI attribution.
- Error attribution.
- Earned/unearned handling.
- Fielder's choice handling.
- Courtesy runner/pinch runner handling.

This can be compact UI, but it needs to exist.

### 3. Pitching / Bullpen UX Still Needs Work

The user wants:

- Starter selection.
- Bullpen dropdowns from roster.
- Pitching change button inside pitching HUD.
- Current pitcher switches cleanly.
- Previous starts display:
  - IP, H, R, ER, HR, BB, K, BF, P/S.
- Master reset for live pitching numbers.

Some pieces exist, but the tab mechanics and bullpen selection remain confusing.

### 4. PDF Import Is Not Implemented

The user needs PDF stat packets imported accurately. That likely requires a Python or server-side extraction pipeline later.

Suggested path:

- Parse CSVs immediately in-browser where possible.
- For PDFs, build a Python extraction utility using a real table/text extraction library.
- Normalize into a player/team/stat schema.
- Let user review mapped columns before committing to database.

See `docs/DATA_PIPELINE.md`.

### 5. Supabase Sync

Supabase is wired as a single JSON-document sync layer in `app_state`, with email OTP auth and realtime updates. Future normalized tables may still be useful if this grows beyond document sync:

- teams
- players
- games
- lineups
- appearances
- plate_appearances
- pitches
- runner_movements
- pitching_appearances
- stat_snapshots
- sources/imports

## User Preferences / Product Direction

- This is not a generic baseball scoring app. It is a PxP broadcaster HUD.
- Dense, usable, low-friction information beats pretty marketing UI.
- The diamond visual representation is crucial.
- At-bat result in the middle of the diamond is fundamental.
- The app must preserve the feel of writing into a classic baseball scorecard.
- Pitching data is critical and should stay visible.
- Every stat needs labels/indicators because raw numbers are hard to parse at speed.
- The user often works from PDFs, not clean CSVs.
- The user needs fast prep across games/seasons, not one-off game entry.

## Quick Verification Command

Run:

```powershell
node --check app.js
```

This has passed after the latest changes.
