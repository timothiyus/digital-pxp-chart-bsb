# pdf_to_csv

Convert baseball stat / roster / box-score PDFs into CSVs the
[Baseball PxP app](../../README.md) can import without modification.

## Why

The app's existing CSV importer (`importPlayersFromCsv` in `app.js`) reads a
specific column layout — `Number`, `Last`, `First`, plus stat columns — and
relies on duplicate column names (`HR`, `BB`, `SO`, `H`, `R` appear twice;
the second occurrence holds pitching stats). GameChanger exports a CSV in
this shape directly. Other providers (Prestosports, MaxPreps, college
sports networks) only ship PDFs. This tool bridges the gap: drop in a PDF,
get back a CSV that opens in the Data tab importer untouched.

## Install

```
pip install -r requirements.txt
```

Requires Python 3.10+.

## Use

There are two ways to use this tool:

### A. Browser bridge (drop a PDF in the app, get data back automatically)

Start the local HTTP bridge, then keep it running while you use the app:

```
cd tools/pdf_to_csv
python -m pdf_to_csv.server
```

The bridge listens on `http://127.0.0.1:8766` (port 8766 to keep 8765 free for whatever static server you use to host the app itself, like `http-server`). Open the app's **Data** tab — the "PDF bridge" pill should turn green ("ready"). Click **Import Stats / Roster PDF** in the Season Stats section, or **Import Box Score PDF** in the Box Scores section, and the parsed rows land directly in your roster / box-score list.

If the pill says "offline", the app couldn't reach the bridge — start it (or click the pill to retry once the server is up).

### A2. Remote use over Tailscale (iPad / phone / second laptop)

You can keep the bridge running on a home PC and reach the app from any device on your tailnet — no public ports, no auth to write, end-to-end encrypted. Wake-on-LAN pairs nicely: wake the PC, the bridge is back online, you import.

**One-time setup on the PC:**

1. Run the static app and the bridge as you normally would:
   ```
   npx http-server -p 8765 -c-1 --silent       # or python -m http.server 8765
   cd tools/pdf_to_csv && python -m pdf_to_csv.server
   ```
2. Tell Tailscale to expose them through the tailnet (one-time, persists across reboots):
   ```
   tailscale serve --bg http://127.0.0.1:8765
   tailscale serve --bg --set-path=/api/ http://127.0.0.1:8766
   ```
   The first command serves the app at `https://<your-pc>.<tailnet>.ts.net/`. The second proxies `/api/*` to the bridge. Both bind to `127.0.0.1` locally — nothing is exposed on Wi-Fi/Ethernet.

3. Verify with `tailscale serve status`. You should see the two routes.

**On the iPad (or any tailnet device):**

1. Install the Tailscale app, sign in to the same tailnet.
2. Open Safari → `https://<your-pc>.<tailnet>.ts.net/`.
3. Optionally **Add to Home Screen** for a one-tap launcher.
4. Open the **Data** tab — the pill should turn green ("PDF bridge: ready"). Drop PDFs as you would on the PC.

The browser auto-detects the URL: locally it talks directly to `127.0.0.1:8766`; remotely it uses `/api` on the same origin (which `tailscale serve` proxies to the bridge). No config changes needed in the app.

The same bridge also backs up PrestoSports XML imports. If the iPad browser blocks a pasted XML box-score link because of CORS, the app retries through `/api/fetch-xml` and imports the response as a series box score.

**Optional override** if you run the bridge on a different host or path: in the browser console,
```
localStorage.setItem('pxp.pdfBridgeUrl', 'https://other-host.ts.net:9000');
```
Clear it with `localStorage.removeItem('pxp.pdfBridgeUrl')`.

**To stop publishing the routes** (e.g., when you take the laptop somewhere public):
```
tailscale serve reset
```

### B. CLI (manual PDF → CSV → import)

From the repo root:

```
python -m tools.pdf_to_csv.pdf_to_csv <input.pdf> [-o OUTPUT.csv] [--kind auto|season|box|roster] [--format auto|gamechanger|prestosports|maxpreps|generic]
```

Or from this directory:

```
python -m pdf_to_csv <input.pdf> ...
```

The output CSV defaults to `<input>.csv` next to the source PDF. Then import the CSV from the Data tab as you would a GameChanger CSV.

### Examples

Auto-detect a Prestosports/Sidearm season-stats PDF:

```
python -m pdf_to_csv "Sample Data/2025-26 Baseball Statistics - Garden City Community College - Garden City CC - Print Version.pdf"
```

Roster-only PDF (must pass `--kind roster` if the document doesn't carry a
clear stats fingerprint):

```
python -m pdf_to_csv "Sample Data/2025-26 Baseball Roster - Garden City CC - Print Version.pdf" --kind roster
```

Force a specific extractor when detection guesses wrong:

```
python -m pdf_to_csv mystery_packet.pdf --format generic
```

Then in the app: open the **Data** tab, switch to **My Team** or
**Opponent**, and use **Import Season CSV** / **Import Box Score CSV**
exactly as you would with a GameChanger CSV.

## Supported sources

| Source | Status | Notes |
| --- | --- | --- |
| Prestosports / Sidearm college templates | Implemented | Parses positioned-text monospace renders. Handles batting + pitching for two-way players. |
| Roster pages (Sidearm/Prestosports layout) | Implemented | Header `NO. NAME POS. B/T CL. HT. WT. HOMETOWN/HIGH SCHOOL`. |
| GameChanger | Stub (table-based) | Targets pdfplumber `extract_tables()` output. Refine when a sample PDF is available. |
| MaxPreps | Stub (table-based) | Reuses GameChanger pipeline + extra column aliases. Refine when a sample is available. |
| Generic fallback | Implemented | Tries table extraction, then falls back to text parsing. Used when no provider matches. |

## Layout

```
tools/pdf_to_csv/
├── README.md                  (this file)
├── requirements.txt
└── pdf_to_csv/
    ├── __main__.py            python -m pdf_to_csv entry
    ├── cli.py                 click CLI
    ├── detect.py              format & kind detection
    ├── schema.py              output CSV columns + writer (preserves duplicate headers)
    ├── normalize.py           aliases, name/number parsing
    ├── extractors/
    │   ├── base.py
    │   ├── prestosports.py    monospace text parser
    │   ├── roster.py          Sidearm-style roster pages
    │   ├── gamechanger.py     table-extraction stub
    │   ├── maxpreps.py        wraps gamechanger + alias overrides
    │   └── generic.py         fallback
    ├── server.py              FastAPI bridge for the browser app (POST /parse, GET /health)
    └── tests/                 pytest suite, golden-file tests against Sample Data/
```

## Output schema

The CSV writer emits columns the browser importer reads at
[`app.js:445`](../../app.js):

- **Identity**: `Number`, `Last`, `First`, `Hometown`, `Height`, `Weight`
- **Batting**: `GP`, `PA`, `AB`, `H`, `2B`, `3B`, `HR`, `RBI`, `R`, `BB`, `SO`, `HBP`, `SF`, `SB`, `CS`
- **Pitching**: `IP`, `GS`, `BF`, `W`, `L`, `#P`, `S%`, `ERA`, `WHIP`, `BAA`, plus a second occurrence of `HR`, `BB`, `SO`, `H`, `R`, and finally `ER`

The duplicate column names are required — the importer's `headerIndex(headers, name, 2)` reads the second occurrence as pitching stats.

## Tests

```
python -m pytest pdf_to_csv/tests
```

The extractor tests assert against the sample PDFs in
[`Sample Data/`](../../Sample%20Data/). They skip cleanly if the PDFs aren't
available.

## Adding a new provider

1. Drop a sample PDF in `Sample Data/`.
2. Add an extractor module under `pdf_to_csv/extractors/` implementing the
   `Extractor` protocol from `base.py`.
3. Register it in `extractors/__init__.py:EXTRACTORS`.
4. Add a fingerprint to `detect.py` so auto-detection picks the new source.
5. Add column aliases in `normalize.COLUMN_ALIASES` for any new header
   strings.
6. Add a golden-file test in `tests/test_extractors.py`.
