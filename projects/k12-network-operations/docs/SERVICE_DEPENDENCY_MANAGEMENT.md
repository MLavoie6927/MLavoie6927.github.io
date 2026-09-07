# Service Dependency Management

A user-facing service is rarely a single endpoint.

Example:

```text
Instructional SaaS
├── Regional DNS
│   └── Campus LAN
├── Internet Filtering
│   ├── Regional Firewall
│   │   └── Regional WAN
│   │       └── Upstream Education Network
│   ├── Regional WAN
│   └── Regional DNS
├── Regional WAN
└── Identity
```

Use:

```bash
python -m k12ops.cli dependencies --services data/services.json --service svc-instructional
```

The command reports both prerequisites and the blast radius of a selected dependency.
