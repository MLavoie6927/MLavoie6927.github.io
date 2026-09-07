# Configuration Compliance & Drift

The project now contains a small configuration-assurance workflow.

```bash
python -m k12ops.cli drift \
  --baseline configs/compliance/baseline.json \
  --snapshots data/config_snapshots.json
```

The baseline checks:

- SNMPv3
- approved NTP sources
- centralized syslog target
- management VLAN
- STUDENT → MGMT deny
- GUEST → internal deny
- management-only SSH source
- default-route presence expectation

The sample dataset deliberately includes drift so the portfolio demonstrates detection and prioritization rather than an unrealistically perfect environment.
