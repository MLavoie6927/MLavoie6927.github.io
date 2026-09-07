# Visual Architecture & Diagram Index

The v3 visual edition adds a consistent set of original vector diagrams to make the project easier to understand during interviews, GitHub review, and portfolio demonstrations.

All diagrams are available as **SVG** for crisp browser rendering and **PNG** for screenshots/social-media use.

## Diagram Set

| Diagram | Purpose |
|---|---|
| `regional-topology.svg` | End-to-end multi-district service path |
| `fault-isolation.svg` | Evidence-first troubleshooting sequence |
| `identity-cloud.svg` | AD / Entra / Intune / M365 / Google architecture |
| `vlan-segmentation.svg` | VLANs and trust boundaries |
| `noc-escalation.svg` | NOC/carrier/vendor escalation workflow |
| `incident-lifecycle.svg` | Detect-to-document incident lifecycle |
| `monitoring-evidence.svg` | Telemetry to evidence pipeline |
| `mdf-idf-path.svg` | Physical building network path |
| `operations-command-view.svg` | Dashboard / portfolio hero illustration |

## Interview Use

A practical sequence is:

1. Start with `regional-topology.svg` to explain the service path.
2. Use `fault-isolation.svg` to explain your troubleshooting method.
3. Open `vlan-segmentation.svg` when discussing K–12 security and student/staff separation.
4. Use `identity-cloud.svg` for AD, Entra, Intune, Microsoft 365, ChromeOS, and Google Workspace questions.
5. Finish with `noc-escalation.svg` to show how you hand off a WAN/provider issue with evidence.

## Assets

```text
assets/diagrams/
├── regional-topology.svg
├── fault-isolation.svg
├── identity-cloud.svg
├── vlan-segmentation.svg
├── noc-escalation.svg
├── incident-lifecycle.svg
├── monitoring-evidence.svg
├── mdf-idf-path.svg
├── operations-command-view.svg
└── png/
    └── matching 1600×900 PNG exports
```
