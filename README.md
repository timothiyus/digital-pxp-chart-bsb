# PxP Baseball Chart

Local-first baseball charting app for play-by-play radio prep and live game use.

## What works now

- Import GameChanger-style CSV stat exports.
- Manage editable rosters, player numbers, pronunciation guides, positions, class years, and broadcast notes.
- Build and reorder a lineup board, including substitute rows.
- Switch between separate charts for your team and the opponent.
- Use a visual diamond chart from 3 to 20 innings with count, RBI, result notation, and tappable base-path shading.
- Edit one selected inning at a time; use the full-chart toggle to review all innings as compact outcome/count/RBI summaries.
- Track inning H/R/E/LOB/RISP on the main chart with per-inning selectors and previous/next inning controls.
- Show the at-bat outcome in the center of each diamond.
- Add extra at-bats for bat-around innings and stack them in the full-chart view.
- Track current base state and stolen-base buttons from the main chart.
- Add balls, strikes, and fouls from the chart while updating the active pitcher's pitch count.
- Track starting pitcher, current pitcher, bullpen dropdown selections, pitch counts, live game pitching lines, and a pitch log.
- Reset live pitching counts/lines with a pitching reset control.
- Use result buttons for BB, K, Kc, 1B, 2B, 3B, and HR so chart entries update batter and pitcher stats.
- Store previous-start notes for pitchers.
- Log live plate appearances and update batting stats immediately.
- Generate a small player snapshot/rundown from current stats.
- Attach PDFs as prep references.
- Persist everything locally in browser storage.
- Export the current workspace as JSON.

## How to run

Open `index.html` directly in a browser, or run a simple local server:

```powershell
python -m http.server 5173
```

Then visit `http://localhost:5173`.

## Supabase path

The app state is already separated into:

- `game`
- `players`
- `events`
- `lineup`
- `sources`

Those can map cleanly into Supabase tables later. The browser `localStorage` calls in `app.js` are the storage boundary to replace first.

`supabase-schema.sql` contains a starter table/RLS layout for that migration.

## Next build targets

- PDF text extraction for roster/stat PDFs.
- Dedicated team and season views.
- Pitching and fielding live event updates.
- Multiple plate appearances in the same inning for bat-around frames.
- Supabase auth and sync.
- AI-assisted player rundown generation from notes plus stat context.

Two dummy CSVs are included in `Sample Data` for testing non-Garden City rosters:

- `Dummy Team - Prairie View Falcons Stats.csv`
- `Dummy Team - Riverbend Tigers Stats.csv`

See `docs/DATA_PIPELINE.md` for the PDF, box-score, and historical-season import plan.
"# digital-pxp-chart-bsb" 
