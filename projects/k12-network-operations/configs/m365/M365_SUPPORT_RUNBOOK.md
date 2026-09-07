# Microsoft 365 / Entra / Intune Operations Runbook

## Identity Path

UPN → account enabled → license → MFA → Conditional Access → device registration → token/SSO state → application permissions.

## Windows Registration

```powershell
dsregcmd /status
```

Review `AzureAdJoined`, `DomainJoined`, `DeviceId`, `TenantId`, `AzureAdPrt`, and diagnostics. Interpret results in the context of the organization's join model rather than expecting every field to be `YES`.

## Intune

Validate enrollment, management authority, primary user, compliance, last check-in, assignment scope, filters, dependencies, and conflicting profiles.

## Microsoft 365 Application Troubleshooting

- provider/service health,
- licensing,
- authentication/MFA,
- network/TLS/proxy/filter path,
- application cache/profile,
- SharePoint/OneDrive permissions and synchronization.

## Evidence

Preserve timestamps, correlation/request IDs, exact error codes, device/user identifiers allowed by policy, and local network test results.
