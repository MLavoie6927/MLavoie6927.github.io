# Browser OS 3.0 Architecture

Browser OS 3.0 is intentionally layered so the guided incident workflow does not become a collection of unrelated mock screens.

```text
┌──────────────────────────────┐
│ UI / Window Manager          │
│ desktop · taskbar · palette  │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ Virtual OS Services          │
│ services · users · scheduler │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ Shared State / Event Model   │
│ core state · v3 incident     │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ Synthetic Telemetry          │
│ process · DNS · packet ·     │
│ firewall · memory · identity │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ Detection / Correlation      │
│ signals · score · thresholds │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ Investigation                │
│ graph · timeline · query ·   │
│ cases · memory · network     │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ Response Engine              │
│ isolate · block · revoke ·   │
│ persistence · reboot         │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ Verification Harness         │
│ negative + positive controls │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ Reporting / Audit            │
│ executive · technical · log  │
└──────────────────────────────┘
```

## Model layer
`v3-model.js` contains pure functions and scenario definitions. It has no DOM or storage dependency, so the same logic can be exercised by Node tests and the browser runtime.

## Runtime layer
`v3.js` integrates the model with the retained Browser OS 2.0/2.1 core. It mounts applications dynamically and mutates the same process, packet, connection, incident, firewall, identity and advanced-evidence collections used elsewhere in the workstation.

## Why this matters
The architecture supports cross-tool consistency. The process that appears in Process Explorer is the process attributed to the C2 session. The same IOC can appear in threat intelligence, network evidence, detection scoring and firewall response. Reports are generated from state rather than copied from static prose.
