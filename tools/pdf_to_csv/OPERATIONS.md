# Operating the PDF Bridge on Windows

How to keep the PDF bridge running in the background so the iPad / GitHub Pages app can reach it without a terminal window babysitting a `python` process.

## One-time install

From PowerShell, in the project's `tools\pdf_to_csv\` directory:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install-task.ps1
```

What this does:

- Registers a Windows scheduled task named **PxP PDF Bridge**
- Runs `pythonw.exe -m pdf_to_csv.server` (the `w` variant is windowless — no console pops up)
- Triggers at every user login
- Auto-restarts up to 5 times on failure
- Starts the bridge immediately

You only run this once. Reboots, logouts, sleep — the task re-arms automatically at login.

You also need Tailscale routing set up once (covered in `README.md`):

```powershell
tailscale serve --bg --set-path=/api/ http://127.0.0.1:8766
```

## Daily use

Nothing. The bridge is up. Status pill in the app's Data tab tells you so.

## Ad-hoc control

All scripts live in `tools\pdf_to_csv\scripts\`. Run from PowerShell with `-ExecutionPolicy Bypass` (or set the policy globally to `RemoteSigned` once and skip the flag):

| Script | Effect |
| --- | --- |
| `start-bridge.ps1`   | Trigger the task now (no-op if already running). Useful after manual stops. |
| `stop-bridge.ps1`    | Stop the task and kill any stray `pythonw -m pdf_to_csv.server` processes. Task stays registered. |
| `status-bridge.ps1`  | Print task state, process PIDs, `/health` probe result, and `tailscale serve status`. Read-only. |
| `uninstall-task.ps1` | Stop the task and remove it from Task Scheduler. Tailscale routes are left alone. |

You can also manage it from the GUI: **Task Scheduler** (`taskschd.msc`) → Task Scheduler Library → **PxP PDF Bridge**.

## Logs

`pythonw.exe` discards stdout/stderr, so there's no log file. To diagnose, stop the task and run the bridge in the foreground temporarily:

```powershell
.\scripts\stop-bridge.ps1
cd ..
python -m pdf_to_csv.server
```

You'll see all uvicorn / extractor output in that terminal. Ctrl-C to stop, then `.\scripts\start-bridge.ps1` to restore the background run.

## Uninstall

```powershell
.\scripts\uninstall-task.ps1
```

If you also want to stop publishing the bridge over Tailscale:

```powershell
tailscale serve reset
```

## Troubleshooting

- **Status pill says offline despite task running:** Run `.\scripts\status-bridge.ps1`. If `/health` succeeds locally but the iPad sees offline, the issue is Tailscale (PC asleep, `tailscale serve` not configured, or iPad's Tailscale paused).
- **Port 8766 already in use:** A foreground bridge is still running in some terminal. Close it, or run `stop-bridge.ps1`.
- **Task fails immediately on login (last result non-zero):** Open the task in `taskschd.msc` → History tab. Most common cause is `pythonw.exe` not on the path used by Task Scheduler — re-run `install-task.ps1` after fixing your PATH or installing Python.
