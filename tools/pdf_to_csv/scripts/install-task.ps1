# Register a Windows Scheduled Task that runs the PDF bridge in the
# background under pythonw.exe (no console window) at user logon.
#
# Run from PowerShell:
#   powershell -ExecutionPolicy Bypass -File .\install-task.ps1
#
# Or:
#   pwsh -ExecutionPolicy Bypass -File .\install-task.ps1
#
# Idempotent: re-running re-registers the task with the latest paths.

$ErrorActionPreference = "Stop"

$taskName = "PxP PDF Bridge"
$bridgeRoot = (Resolve-Path "$PSScriptRoot\..").Path

# Locate pythonw.exe alongside whatever python is on PATH.
$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) {
    throw "python.exe not found on PATH. Install Python 3.10+ and re-run."
}
$pythonDir = Split-Path $python.Source
$pythonw = Join-Path $pythonDir "pythonw.exe"
if (-not (Test-Path $pythonw)) {
    Write-Warning "pythonw.exe not found at $pythonw. Falling back to python.exe (a console window will appear)."
    $pythonw = $python.Source
}

$action = New-ScheduledTaskAction `
    -Execute $pythonw `
    -Argument "-m pdf_to_csv.server" `
    -WorkingDirectory $bridgeRoot

$trigger = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME

$settings = New-ScheduledTaskSettingsSet `
    -StartWhenAvailable `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -RestartCount 5 `
    -RestartInterval (New-TimeSpan -Minutes 1) `
    -ExecutionTimeLimit (New-TimeSpan -Days 365)

$principal = New-ScheduledTaskPrincipal `
    -UserId $env:USERNAME `
    -LogonType Interactive `
    -RunLevel Limited

Register-ScheduledTask `
    -TaskName $taskName `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Principal $principal `
    -Force | Out-Null

Write-Host "Registered scheduled task: $taskName"
Write-Host "  Working dir: $bridgeRoot"
Write-Host "  Command:     $pythonw -m pdf_to_csv.server"

# Try to start it now, but only if port 8766 isn't already taken (e.g. by a
# foreground bridge running in another terminal).
$portInUse = $false
try {
    $listening = Get-NetTCPConnection -LocalPort 8766 -State Listen -ErrorAction SilentlyContinue
    if ($listening) { $portInUse = $true }
} catch {}

if ($portInUse) {
    Write-Host ""
    Write-Warning "Port 8766 is already in use (probably a foreground bridge in another terminal)."
    Write-Host "  Stop that one, then run: .\start-bridge.ps1"
} else {
    Start-ScheduledTask -TaskName $taskName
    Start-Sleep -Seconds 2
    try {
        $health = Invoke-WebRequest -Uri "http://127.0.0.1:8766/health" -UseBasicParsing -TimeoutSec 3
        Write-Host ""
        Write-Host "Bridge running. Health check: $($health.StatusCode) OK"
    } catch {
        Write-Warning "Task started, but /health probe failed: $($_.Exception.Message)"
        Write-Host "Run .\status-bridge.ps1 in a moment to re-check."
    }
}
