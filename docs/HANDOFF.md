# Handoff Notes

## Current app shape

- Static HTML/CSS/JS app.
- Main files:
  - `index.html`
  - `styles.css`
  - `app.js`
- Local browser storage key: `pxp-baseball-chart-v1`.
- Team/opponent chart state is split under `state.charts.home` and `state.charts.away`.

## Recent fixes

- Result buttons are now closer to idempotent per scorecard cell.
- `reverseChartCell(cellKey)` reverses:
  - batter stat event created by a chart action
  - live pitcher-line deltas
  - pitch-count button deltas
  - inning total deltas
  - base state snapshot for that cell
- Clearing an individual cell now calls `reverseChartCell`.
- Added `ROE` and `E` buttons.
- Renamed steal buttons to `Steal 2B` and `Steal 3B` to avoid confusion with sacrifice bunt notation.
- Added basic automatic base-state movement:
  - `1B`: batter to first, first to second, second to third, third scores
  - `2B`: batter to second, first to third, second/third score
  - `3B`: batter to third, existing runners score
  - `HR`: clears bases and adds runs
- Outcome appears in the middle of each diamond.
- Multiple at-bats per lineup slot/inning are supported through `extraAbs`.

## Known rough edges

- The runner movement model is still simplified. A real version should use a per-at-bat runner movement drawer:
  - batter destination
  - runner from first destination/out
  - runner from second destination/out
  - runner from third destination/out
  - RBI / earned run / error attribution
- Clearing an older cell restores the base state snapshot from that cell, which can clobber later base-state changes. A proper event log replay model would solve this.
- Manual base-path toggles update RISP, but they do not fully model runner identity or outs.
- Box-score/PDF import is not implemented yet; see `docs/DATA_PIPELINE.md`.

## Suggested next architecture move

Move from mutating totals directly to event replay:

1. Store every PA, pitch, steal, error, and runner movement as immutable events.
2. Recompute derived batter stats, pitcher lines, inning totals, base state, and scorecard display from those events.
3. Let users edit/delete events, then replay.

That will prevent stacked totals, stale base states, and difficult reversal bugs.
