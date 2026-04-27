# Stop the bridge task and any stray pythonw process running our module.
# The task remains registered and will re-arm at next logon.

$ErrorActionPreference = "Stop"
$taskName = "PxP PDF Bridge"

if (Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue) {
    Stop-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
    Write-Host "Stopped scheduled task '$taskName'."
}

$strays = Get-CimInstance Win32_Process -Filter "Name = 'pythonw.exe' OR Name = 'python.exe'" |
    Where-Object { $_.CommandLine -like "*pdf_to_csv.server*" }

if ($strays) {
    foreach ($proc in $strays) {
        try {
            Stop-Process -Id $proc.ProcessId -Force -ErrorAction Stop
            Write-Host "Killed lingering bridge process (PID $($proc.ProcessId))."
        } catch {
            Write-Warning "Could not stop PID $($proc.ProcessId): $($_.Exception.Message)"
        }
    }
} else {
    Write-Host "No bridge processes detected."
}
