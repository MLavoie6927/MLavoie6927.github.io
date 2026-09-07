# Network Support Specialist II — Portfolio Evidence Matrix

The supplied role description combines on-site/remote K–12 support, Windows/Linux/ChromeOS, Microsoft and Google cloud administration, routers/firewalls/filters, routed-network troubleshooting, MDF/IDF knowledge, scripting, monitoring, documentation, project coordination, vendor/NOC escalation, and service to 35 districts.

This matrix shows where each capability is **demonstrated**, not merely mentioned.

| Role capability | Implementation in this repository | Demonstration proof |
|---|---|---|
| Windows workstations / Windows Server | PowerShell endpoint, event, domain/DNS, and Intune collectors | `scripts/windows/` + tooling code view |
| Linux/Unix | interface, route, resolver, socket, and service-health collectors | `scripts/linux/` |
| ChromeOS / Google environment | managed-device checklist and Google Workspace runbook | `configs/chromeos/`, `configs/google/` |
| Active Directory | SRV discovery, secure-channel, account-health, DNS/time workflow | `test_domain_dns.ps1`, AD runbooks |
| Entra ID / Intune | local registration/enrollment evidence and M365 support path | `intune_enrollment_triage.ps1`, M365 runbook |
| Microsoft 365 / Google Workspace | identity/application troubleshooting paths | `configs/m365/`, `configs/google/`, identity diagram |
| LAN / WAN troubleshooting | evidence-first decision tree and featured WAN case | `case-studies/INC-WAN-01/` |
| TCP/IP / routed networks | addressing, VLAN/SVI, OSPF/BGP, route/path tooling | `configs/network/`, `service_path_test.py` |
| Routers / firewalls / filters | reference configurations and machine-readable policy | `configs/network/`, `configs/security/` |
| Internet filter support | exact dependency isolation and narrow exception workflow | `INC-FILTER-01`, web-filter runbook |
| MDF / IDF | physical/logical design and troubleshooting | `VLAN_MDF_IDF_PLAN.md`, MDF/IDF runbook + diagram |
| SMTP / POP3 / IMAP / HTTP / DNS | email and DNS runbooks plus connectivity testing | `docs/runbooks/EMAIL.md`, `DNS_DHCP.md` |
| SNMP / utilization monitoring | SNMPv3 plan, thresholds, event taxonomy, synthetic cockpit | `configs/monitoring/`, dashboard |
| PowerShell / batch scripting | multiple read-only collectors and quick-triage batch | `scripts/windows/` |
| Routine scripting / automation | zero-dependency Python operations CLI and Bash collectors | `k12ops/`, `scripts/linux/` |
| Service-request prioritization | P1–P4 model and synthetic work queue | `SLA_PRIORITY_MATRIX.md`, dashboard |
| Detailed logs / reports | incident evidence, weekly operations report, generated report | `case-studies/`, `reports/`, `docs/` |
| K-20 / NOC escalation | evidence packet with circuit boundary and specific request | `INC-WAN-01/escalation.md` |
| Vendor / ISP coordination | escalation matrix, vendor template, outage communication | `ESCALATION_MATRIX.md`, `VENDOR_ESCALATION_TEMPLATE.md` |
| Project/change management | scope, approval, risk, validation, rollback, closure | `CHANGE_MANAGEMENT.md`, `INC-FILTER-01/change-record.md` |
| Security / segmentation | VLAN policy model and positive/negative-control validation | `INC-SEC-01`, segmentation diagram |
| 35-district support context | deterministic 35-district / 70-site inventory | `data/districts.json`, district explorer |
| Customer communication | scope-first method, plain-language impact, actionable handoff | case studies, outage communication templates |

## Interview Principle

Do not present the synthetic 35-district environment as production experience. Present the project as evidence that the technical model, troubleshooting method, scripting approach, security reasoning, documentation discipline, and escalation quality are already understood and can transfer into an authorized K–12 environment.


## Operations engineering extensions

| Capability | v5 evidence |
|---|---|
| Monitor network utilization and project needs | `data/capacity_history.json`, `k12ops/capacity.py`, Capacity console |
| Maintain detailed logs/documentation | telemetry replay, evidence bundles, generated operations report |
| Plan upgrades/services as a team | change-risk model with approvals, rollback, and validation |
| Escalate to upstream NOC/vendors | six case studies plus evidence package builder |
| Keep infrastructure secure and supportable | configuration baseline and drift analyzer |
| Troubleshoot cloud-dependent applications | service dependency/blast-radius graph |
