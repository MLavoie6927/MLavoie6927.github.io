# SLA & Service Management

The synthetic ticket set now includes timestamps, response time, restoration time, owner, site, and impact classification.

Lab targets:

| Priority | First response | Restore target |
|---|---:|---:|
| P1 | 15 min | 120 min |
| P2 | 30 min | 240 min |
| P3 | 120 min | 480 min |
| P4 | 240 min | 1440 min |

Analyze:

```bash
python -m k12ops.cli sla --tickets data/tickets.json
```

This demonstrates service-management reasoning without presenting synthetic metrics as production history.
