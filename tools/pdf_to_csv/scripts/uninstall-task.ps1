# Stop and unregister the PxP PDF Bridge scheduled task. Tailscale routes
# are unaffected; run `tailscale serve reset` separately if you want to
# tear those down too.

$ErrorActionPreference = "Stop"
$taskName = "PxP PDF Bridge"

if (Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue) {
    Stop-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
    Write-Host "Task '$taskName' removed."
} else {
    Write-Host "Task '$taskName' not registered. Nothing to do."
}

# Belt-and-suspenders: kill any lingering pythonw running our module.
$leftovers = Get-CimInstance Win32_Process -Filter "Name = 'pythonw.exe' OR Name = 'python.exe'" |
    Where-Object { $_.CommandLine -like "*pdf_to_csv.server*" }

if ($leftovers) {
    foreach ($proc in $leftovers) {
        try {
            Stop-Process -Id $proc.ProcessId -Force -ErrorAction Stop
            Write-Host "Stopped leftover bridge process (PID $($proc.ProcessId))."
        } catch {
            Write-Warning "Could not stop PID $($proc.ProcessId): $($_.Exception.Message)"
        }
    }
}
