# Baseball PxP Chart Roadmap

Living backlog for post-live-test improvements.

## Critical Reliability

- Preserve added games across refresh, service worker updates, and device handoff.
- Audit cloud sync so workspace pushes/pulls are predictable and visible.
- Keep local saves resilient when the workspace grows large from imported data, multi-game series, and team metadata.

## Completed

- [x] Add a roster edit modal from roster cards/table rows so edits do not force scrolling back to the top form.
- [x] Add previous/next player controls inside the roster edit modal for fast roster cleanup.
- [x] Auto-populate the defense chart from lineup position entries while preserving dropdown overrides.
- [x] First-pass pitcher stat pipeline audit: add manual App editing and make pitcher appearances fall back from imported/live pitching data instead of showing 0 apps for pitchers with mound stats.
- [x] Add HUD Basic/Advanced view toggles for batter and pitcher cards.
- [x] Add a `series` stat scope for charted workspace games, covering batting and pitching.
- [x] Add a settings toggle for tappable stat explanations with formula and broadcast-style examples.
- [x] Reshape batter HUD Basic/Advanced rows around PA, slash, power, speed, plate-discipline, and current-game leverage stats.
- [x] Clarify that PrestoSports roster imports expect `.TRX` files with names in `First Last` order.

## Roster Workflow

- Keep the existing new-player workflow, but make roster-card editing the primary fast path during game prep.

## Defense Workflow

- Preserve the defense chart as editable dropdowns so live defensive adjustments and substitutions can override the default.
- Reuse the existing substitution mechanics where possible, since substitution updates already feed the defensive view.

## HUD Statistics

- Keep the main HUD readable and let deeper analytics appear only when selected.

## Series Stats

- Expand series stats into generated end-of-game and live stats views once those pages exist.

## Advanced Analytics

- Define the advanced batting and pitching metrics worth surfacing for broadcast prep.
- Calculate advanced analytics live throughout the ballgame where the chart data supports it.
- Add broadcast-friendly language for explaining notable advanced metrics.
- Dynamically surface source-specific stats when uploaded data supports them, especially GameChanger-only QAB, C%, hard-hit, batted-ball, BA/RISP, two-out RBI, pitch mix, first-pitch strike, swing-and-miss, and Presto-only GO/FO or split report fields.

## End Of Game

- When the final scheduled inning ends, show choices for:
  - Finish ballgame.
  - Add innings.
  - Edit inning.
- Finishing a game should keep the game editable later.
- Generate an in-app final box score from the scorer's charted data.
- Use the generated box score as the trusted source when outside scorers classify hits/errors differently.
- Feed completed-game stats cleanly into subsequent games in a series.

## Live Statistics Page

- Add a dedicated Live Statistics tab.
- Include player search.
- Show complete live batting and pitching lines for players who appear in the game.
- Make it useful for players who enter late or were not part of the main HUD focus.

## Stat Explanations

- Add more explanation entries as new advanced analytics are introduced.

## Setup Profiles

- Add a way to save and reuse setup settings outside of full workspace JSON export/import.
- Include team setup, venue/location defaults, league/conference info, colors, and common broadcast metadata.
