<#
Requires the ActiveDirectory PowerShell module.
Read-only account inventory for an authorized lab/domain.
#>

param(
    [string]$OutputCsv = ".\ad_account_health.csv"
)

if (-not (Get-Module -ListAvailable -Name ActiveDirectory)) {
    Write-Error "ActiveDirectory module not installed."
    exit 1
}

Import-Module ActiveDirectory

Get-ADUser -Filter * -Properties Enabled,LastLogonDate,PasswordLastSet,LockedOut |
    Select-Object SamAccountName,Enabled,LockedOut,LastLogonDate,PasswordLastSet |
    Sort-Object SamAccountName |
    Export-Csv -NoTypeInformation -Path $OutputCsv

Write-Host "Wrote read-only account health report to $OutputCsv"
