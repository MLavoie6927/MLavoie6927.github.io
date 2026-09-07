param(
    [Parameter(Mandatory=$true)]
    [string]$Domain
)

$ErrorActionPreference = "Continue"

Write-Host "=== Domain / DNS Validation for $Domain ==="

Write-Host "`n[1] DNS servers"
Get-DnsClientServerAddress -AddressFamily IPv4 |
    Select-Object InterfaceAlias, ServerAddresses

Write-Host "`n[2] Domain A/AAAA resolution"
Resolve-DnsName $Domain -ErrorAction Continue

Write-Host "`n[3] AD LDAP SRV record"
Resolve-DnsName "_ldap._tcp.dc._msdcs.$Domain" -Type SRV -ErrorAction Continue

Write-Host "`n[4] Secure channel"
nltest /sc_verify:$Domain

Write-Host "`n[5] Domain controller discovery"
nltest /dsgetdc:$Domain

Write-Host "`n[6] Time"
w32tm /query /status
