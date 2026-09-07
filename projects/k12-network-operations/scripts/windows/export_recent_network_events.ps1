param(
    [int]$Hours = 8,
    [string]$OutputCsv = ".\network_events.csv"
)

$start = (Get-Date).AddHours(-1 * $Hours)
$events = foreach ($log in @('System','Microsoft-Windows-NetworkProfile/Operational','Microsoft-Windows-DNS-Client/Operational')) {
    Get-WinEvent -FilterHashtable @{LogName=$log; StartTime=$start} -ErrorAction SilentlyContinue |
        Select-Object @{n='Log';e={$log}}, TimeCreated, Id, LevelDisplayName, ProviderName, Message
}
$events | Sort-Object TimeCreated | Export-Csv -NoTypeInformation -Path $OutputCsv
Write-Host "Exported $($events.Count) events to $OutputCsv"
