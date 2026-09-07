# Lab Build Guide

## Minimum Build

You can demonstrate this project with:

- 1 Windows 11 VM
- 1 Windows Server evaluation VM for AD/DNS
- 1 Ubuntu Server VM
- 1 firewall/router VM such as pfSense or OPNsense
- Optional ChromeOS Flex device or a documented ChromeOS support simulation
- Optional second subnet to emulate another district

## Example Virtual Networks

| VLAN | Name | Subnet | Purpose |
|---:|---|---|---|
| 10 | STAFF | 10.10.10.0/24 | staff workstations |
| 20 | STUDENT | 10.10.20.0/24 | student devices |
| 30 | SERVER | 10.10.30.0/24 | AD/DNS/application servers |
| 40 | MGMT | 10.10.40.0/24 | infrastructure management |
| 50 | GUEST | 10.10.50.0/24 | isolated guest access |

## Build Order

1. Create VLANs/subnets.
2. Configure gateway interfaces.
3. Add DHCP scopes.
4. Deploy AD/DNS.
5. Join Windows workstation.
6. Deploy Linux test server.
7. Configure stateful outbound firewall rules.
8. Configure guest/student segmentation.
9. Add DNS and HTTP test services.
10. Run included validation scripts.
11. Work through incident scenarios.
12. Record findings using the ticket templates.
13. Create one mock upstream escalation.
14. Produce a weekly operations report.

## Optional Microsoft Components

If you have a Microsoft 365 developer or lab tenant:

- Entra ID test users
- Intune enrollment
- Conditional Access in report-only mode
- Microsoft Defender telemetry

## Optional Google Components

If you have an authorized Google Workspace lab tenant:

- Organizational units
- Test accounts
- Chrome policies
- Shared Drive permissions

Do not use a school production tenant for experiments unless explicitly authorized.
