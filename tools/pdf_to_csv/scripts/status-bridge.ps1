# Show the bridge's task state, process info, and a /health probe.
# Read-only — safe to run any time.

$ErrorActionPreference = "Continue"
$taskName = "PxP PDF Bridge"

Write-Host "=== Scheduled Task ==="
$task = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($task) {
    $info = Get-ScheduledTaskInfo -TaskName $taskName
    Write-Host "  State:       $($task.State)"
    Write-Host "  Last run:    $($info.LastRunTime)"
    Write-Host "  Last result: $($info.LastTaskResult)"
} else {
    Write-Host "  Not registered. Run .\install-task.ps1 first."
}

Write-Host ""
Write-Host "=== Process ==="
$procs = Get-CimInstance Win32_Process -Filter "Name = 'pythonw.exe' OR Name = 'python.exe'" |
    Where-Object { $_.CommandLine -like "*pdf_to_csv.server*" }
if ($procs) {
    foreach ($p in $procs) {
        Write-Host "  PID $($p.ProcessId)  ($($p.Name))"
    }
} else {
    Write-Host "  No bridge process running."
}

Write-Host ""
Write-Host "=== Health ==="
try {
    $r = Invoke-WebRequest -Uri "http://127.0.0.1:8766/health" -UseBasicParsing -TimeoutSec 3
    Write-Host "  /health -> $($r.StatusCode) OK"
    Write-Host "  Body:     $($r.Content)"
} catch {
    Write-Host "  /health -> FAILED  ($($_.Exception.Message))"
}

Write-Host ""
Write-Host "=== Tailscale Serve ==="
try {
    & tailscale serve status 2>&1 | ForEach-Object { Write-Host "  $_" }
} catch {
    Write-Host "  tailscale CLI not on PATH"
}
