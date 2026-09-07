# Generated Enterprise Operations Report

> All values are synthetic portfolio data.

## Executive status

- Regional health score: **81/100**
- Districts: **35**
- Sites: **70**
- Modeled assets: **116,228**
- Open tickets: **12**
- First-response SLA attainment: **90.0%**
- Restore SLA attainment (closed tickets): **87.5%**
- Sample configuration compliance: **50%**
- Configuration drift findings: **4**
- Telemetry samples: **288**
- Maximum injected packet loss: **15.35%**

## Capacity watchlist

| District | Current P95 | Three-month projection | Risk |
|---|---:|---:|---|
| DIST-27 | 80.0% | 87.6% | WATCH |
| DIST-15 | 73.2% | 80.8% | WATCH |

## Assurance findings

| Device | Control | Severity | Expected | Actual |
|---|---|---|---|---|
| DIST-12-EDGE | snmp_version | MEDIUM | `3` | `2c` |
| DIST-12-EDGE | ntp_servers | MEDIUM | `['10.255.0.10', '10.255.0.11']` | `['10.255.0.10']` |
| DIST-12-EDGE | ssh_source | HIGH | `MGMT` | `ANY` |
| DIST-19-CORE | syslog_target | MEDIUM | `10.255.0.20` | `10.255.0.99` |

## Interpretation

The synthetic environment intentionally contains imperfect states. A useful operations portfolio should demonstrate how faults, SLA misses, and configuration drift are detected, prioritized, changed, verified, and documented—not present a frictionless fictional network in which every control is already perfect.
