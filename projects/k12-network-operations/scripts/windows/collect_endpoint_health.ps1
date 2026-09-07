<#
.SYNOPSIS
Read-only Windows endpoint triage collection.
#>

$ErrorActionPreference = "SilentlyContinue"

Write-Host "=== K12 Endpoint Health ==="
Write-Host "Timestamp: $(Get-Date -Format o)"
Write-Host "Computer: $env:COMPUTERNAME"
Write-Host "User: $env:USERNAME"
Write-Host ""

Write-Host "=== OS ==="
Get-CimInstance Win32_OperatingSystem |
    Select-Object Caption, Version, BuildNumber, LastBootUpTime

Write-Host "`n=== Network Adapters ==="
Get-NetAdapter |
    Select-Object Name, Status, LinkSpeed, MacAddress

Write-Host "`n=== IP Configuration ==="
Get-NetIPConfiguration |
    Select-Object InterfaceAlias, IPv4Address, IPv4DefaultGateway, DNSServer

Write-Host "`n=== Routes ==="
Get-NetRoute -AddressFamily IPv4 |
    Sort-Object RouteMetric |
    Select-Object -First 20 DestinationPrefix, NextHop, RouteMetric, InterfaceAlias

Write-Host "`n=== DNS Client ==="
Get-DnsClientServerAddress -AddressFamily IPv4 |
    Select-Object InterfaceAlias, ServerAddresses

Write-Host "`n=== Time ==="
w32tm /query /status

Write-Host "`n=== Entra / Domain Registration Summary ==="
dsregcmd /status | Select-String "AzureAdJoined|DomainJoined|DeviceId|TenantId|AzureAdPrt"

Write-Host "`n=== Recent System Errors ==="
Get-WinEvent -FilterHashtable @{LogName='System'; Level=2; StartTime=(Get-Date).AddHours(-4)} -MaxEvents 20 |
    Select-Object TimeCreated, Id, ProviderName, Message
