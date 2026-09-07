# Synthetic Telemetry Replay

`data/telemetry.json` contains 72 hours of deterministic 15-minute samples. It is explicitly synthetic and contains one injected packet-loss event so alert logic can be demonstrated.

```bash
python -m k12ops.cli telemetry --telemetry data/telemetry.json
```

Use the dataset to discuss:

- baseline versus anomaly,
- utilization versus packet loss,
- when high traffic is not itself an outage,
- correlation between monitoring and user reports,
- evidence timestamps during NOC escalation.
