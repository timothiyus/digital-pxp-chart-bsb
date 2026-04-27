# Ad-hoc start of the registered PxP PDF Bridge task.
# Useful if you stopped it manually or rebooted.

$ErrorActionPreference = "Stop"
$taskName = "PxP PDF Bridge"

if (-not (Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue)) {
    throw "Task '$taskName' is not registered. Run .\install-task.ps1 first."
}

Start-ScheduledTask -TaskName $taskName
Start-Sleep -Seconds 2

try {
    $r = Invoke-WebRequest -Uri "http://127.0.0.1:8766/health" -UseBasicParsing -TimeoutSec 3
    Write-Host "Bridge started. /health -> $($r.StatusCode) OK"
} catch {
    Write-Warning "Task triggered, but /health probe failed: $($_.Exception.Message)"
    Write-Host "Wait a few seconds and run .\status-bridge.ps1 to re-check."
}
