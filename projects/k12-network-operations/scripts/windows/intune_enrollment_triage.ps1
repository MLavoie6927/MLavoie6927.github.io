<#
Local, read-only triage of Windows registration/enrollment indicators.
Does not connect to Microsoft Graph.
#>

Write-Host "=== Device Registration ==="
dsregcmd /status

Write-Host "`n=== MDM Enrollment Registry Paths ==="
Get-ChildItem "HKLM:\SOFTWARE\Microsoft\Enrollments" -ErrorAction SilentlyContinue |
    Select-Object PSChildName

Write-Host "`n=== Relevant Event Logs ==="
$logs = @(
    "Microsoft-Windows-DeviceManagement-Enterprise-Diagnostics-Provider/Admin",
    "Microsoft-Windows-AAD/Operational"
)

foreach ($log in $logs) {
    Write-Host "`n--- $log ---"
    Get-WinEvent -LogName $log -MaxEvents 20 -ErrorAction SilentlyContinue |
        Select-Object TimeCreated, Id, LevelDisplayName, Message
}
