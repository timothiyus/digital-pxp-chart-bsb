# PxP Baseball Chart

Local-first baseball charting app for play-by-play radio prep and live game use.

## What works now

- Import GameChanger-style season, conference, and box-score CSV exports.
- Import PrestoSports roster/stat CSV slices for overall and conference splits.
- Reach the app from an iPad / second laptop over Tailscale (no public ports).
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
- Persist everything locally in browser storage.
- Export the current workspace as JSON.

## How to run

Open `index.html` directly in a browser, or run a simple local server:

```powershell
python -m http.server 5173
```

Then visit `http://localhost:5173`.

## Supabase sync

The app now syncs a single JSON state document per signed-in user through Supabase Auth, Realtime, and the `app_state` table in `supabase-schema.sql`. Email OTP sign-in expects the 8-digit token delivered by Supabase/Resend.

## Next build targets

- Dedicated team and season views.
- Pitching and fielding live event updates.
- Multiple plate appearances in the same inning for bat-around frames.
- Broader regression coverage for scorecard and sync workflows.
- AI-assisted player rundown generation from notes plus stat context.

Two dummy CSVs are included in `Sample Data` for testing non-Garden City rosters:

- `Dummy Team - Prairie View Falcons Stats.csv`
- `Dummy Team - Riverbend Tigers Stats.csv`

See `docs/DATA_PIPELINE.md` for the historical data import plan.
"# digital-pxp-chart-bsb" 
