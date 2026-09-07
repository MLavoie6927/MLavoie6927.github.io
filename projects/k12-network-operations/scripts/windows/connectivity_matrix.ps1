param(
    [string[]]$Targets = @("example.com","login.microsoftonline.com","accounts.google.com")
)

Write-Host "=== Connectivity Matrix ==="
Write-Host "Timestamp: $(Get-Date -Format o)"

foreach ($target in $Targets) {
    Write-Host "`n--- $target ---"
    try {
        $dns = Resolve-DnsName $target -ErrorAction Stop | Where-Object {$_.IPAddress} | Select-Object -ExpandProperty IPAddress -Unique
        Write-Host "DNS: $($dns -join ', ')"
    } catch { Write-Host "DNS: FAILED - $($_.Exception.Message)" }

    foreach ($port in 443,80) {
        $r = Test-NetConnection -ComputerName $target -Port $port -WarningAction SilentlyContinue
        Write-Host "TCP/$port: $($r.TcpTestSucceeded) Remote=$($r.RemoteAddress)"
    }
}
