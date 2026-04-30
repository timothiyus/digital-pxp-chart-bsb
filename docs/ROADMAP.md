# Baseball PxP Chart Roadmap

Living backlog for post-live-test improvements.

## Critical Reliability

- Preserve added games across refresh, service worker updates, and device handoff.
- Audit cloud sync so workspace pushes/pulls are predictable and visible.
- Keep local saves resilient when the workspace grows large from imported data, multi-game series, and team metadata.

## Roster Workflow

- Add an edit-player modal from roster cards so edits do not force scrolling back to the top form.
- Add previous/next player controls inside the edit flow for fast roster cleanup.
- Keep the existing new-player workflow, but make roster-card editing the primary fast path during game prep.

## Defense Workflow

- Auto-populate the defense chart from lineup position entries.
- Preserve the defense chart as editable dropdowns so live defensive adjustments and substitutions can override the default.
- Reuse the existing substitution mechanics where possible, since substitution updates already feed the defensive view.

## HUD Statistics

- Add HUD stat tabs/buttons for batting views:
  - Current rundown/basic stats.
  - Advanced batting statistics.
  - Current game.
  - Series.
  - Overall.
  - Conference.
  - Non-conference.
- Add the same scope structure for pitcher HUD stats.
- Audit pitcher stat pipelines where players show as not having appeared despite imported/game data.
- Keep the main HUD readable and let deeper analytics appear only when selected.

## Series Stats

- Add a `series` stat scope that combines Game 1, Game 2, Game 3, etc. within the current workspace series.
- Apply series stats to both batting and pitching.
- Make series stats update live as games are added and charted.

## Advanced Analytics

- Define the advanced batting and pitching metrics worth surfacing for broadcast prep.
- Calculate advanced analytics live throughout the ballgame where the chart data supports it.
- Add broadcast-friendly language for explaining notable advanced metrics.

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

- Add a settings toggle for tappable stat explanations.
- When enabled, tapping a stat pill should show:
  - What the stat means.
  - The formula.
  - A quick broadcast-friendly calculation example.
- Tapping the stat again should dismiss the explanation.
- Cover every calculated stat that needs explanation, especially rate stats like SLG.

## Setup Profiles

- Add a way to save and reuse setup settings outside of full workspace JSON export/import.
- Include team setup, venue/location defaults, league/conference info, colors, and common broadcast metadata.
