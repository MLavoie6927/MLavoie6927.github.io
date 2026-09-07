# Browser OS 3.0 — Security Operations Workstation

Browser OS 3.0 is a static, browser-native cybersecurity portfolio workstation designed to demonstrate **security judgment**, not merely tool-themed UI.

The project runs on GitHub Pages with plain HTML, CSS and JavaScript. It has no application backend, no external network client, no repository credentials, and no website write path. All enterprise data and attack activity are synthetic. The implemented engineering is the state engine, event correlation, detection evaluation, evidence graph, incident workflow, response verification, reporting, local persistence and application orchestration.

## The recruiter experience

The preferred entry point is the boot-screen button:

**★ Start 5-Minute Recruiter Demo**

The demo follows a single shared incident from beginning to end:

```text
Phishing attachment
       ↓
WINWORD.EXE
       ↓
Encoded PowerShell
       ↓
Rundll32 proxy execution
       ↓
Run-key persistence
       ↓
DNS resolution
       ↓
TLS command-and-control pattern
       ↓
Credential-access behavior
       ↓
SMB lateral-movement attempt
       ↓
Segmentation block
       ↓
Multi-source detection
       ↓
Analyst investigation
       ↓
Containment / remediation
       ↓
Positive + negative verification
       ↓
Executive + technical reporting
```

The scenario deliberately does not reveal the answer at the beginning. Individual events can be ambiguous in isolation. Confidence rises as independent endpoint, DNS, network, firewall, packet, memory and identity evidence correlate.

## Browser OS 3.0 applications

### Recruiter Demo
A guided seven-step walkthrough intended for a recruiter or hiring manager who has only a few minutes. It can play the intrusion live, pause, single-step events, change speed and switch into analyst mode.

### Evidence Graph
Builds an entity graph connecting:

```text
User → Endpoint → Process → Process → Process
                         ├→ Registry persistence
                         ├→ DNS → IP
                         ├→ Memory evidence
                         └→ Detection → Incident
Endpoint → Server SMB attempt
```

Graph nodes pivot into the relevant Browser OS applications.

### Detection Studio
Implements `BOS3-DET-301`, a multi-source analytic with configurable:

- minimum suspicious-signal count;
- promotion-score threshold;
- Office-to-PowerShell lineage requirement;
- DNS + process-network requirement;
- benign updater suppression.

The studio compares current results with a captured baseline and includes a deliberately ambiguous periodic updater case to demonstrate false-positive control.

### Incident Commander
Tracks:

- lifecycle: `NEW → TRIAGE → INVESTIGATING → CONTAINING → REMEDIATING → VALIDATING → CLOSED`;
- severity and confidence;
- evidence completeness;
- owner and escalation;
- business impact;
- root cause;
- recovery status;
- lessons learned;
- containment controls.

The lifecycle has transition guards instead of allowing arbitrary status changes.

### Attack Timeline
Combines attack events and analyst actions into one chronological reconstruction. Timeline entries can pivot into process, network, packet, firewall, memory, detection, verification and incident views.

### Response Verification
Containment is not treated as complete merely because a button was clicked. The verification harness tests:

1. malicious C2 retry is blocked;
2. authorized SOC management remains allowed;
3. synthetic persistence is absent;
4. compromised user sessions are revoked;
5. the lateral SMB path remains blocked;
6. a post-remediation reboot does not recreate the malicious process lineage.

This intentionally includes both negative and positive controls.

### Incident Reports
Generates two products from current incident state:

- executive incident brief;
- technical incident report.

Reports include scope, confidence, timeline, detection evidence, analyst actions, root cause, recovery, validation and explicit truth-model language.

### Architecture
Shows the system as an engineered pipeline:

```text
UI / Window Manager
       ↓
Virtual OS Services
       ↓
State + Event Bus
       ↓
Synthetic Endpoint Telemetry
       ↓
Detection Engine
       ↓
Incident Correlation
       ↓
Investigation Tools
       ↓
Response Engine
       ↓
Verification Harness
       ↓
Reporting / Audit
```

### Engineering Proof
Displays the build-time automated assertion manifest and links the conceptual engineering artifacts shipped in the project: tests, CI, threat model, security invariants, limitations, ADRs and changelog.

### Truth & Security Boundary
Makes three categories explicit:

- **Synthetic:** endpoints, users, packets, attack events, memory artifacts, identities and enterprise incidents.
- **Implemented:** state transitions, rule evaluation, correlation, graph construction, workflow logic, policy evaluation, verification and reporting.
- **Boundary:** no backend, no real shell, no external network client, no repository credential, no real host filesystem/process/memory access.

## Existing Browser OS 2.x capabilities retained

Browser OS 3.0 retains and integrates the earlier workstation layers:

- Operations Center;
- service/dependency manager;
- process explorer;
- network monitor;
- packet analyzer;
- log viewer;
- virtual browser;
- local SIEM-style query console;
- stateful virtual firewall;
- identity and session center;
- task scheduler;
- snapshots/recovery;
- sandboxed virtual filesystem and editor;
- threat-intelligence workspace;
- advanced case/evidence manager;
- 60-rule advanced detection library;
- network stack inspector;
- update center;
- 60-control compliance auditor;
- synthetic memory inspector;
- unified audit trail;
- command palette and allowlisted terminal.

## Terminal additions

Browser OS 3.0 adds:

```text
v3-help

recruiter start
recruiter status
recruiter next

attack start
attack pause
attack resume
attack step
attack status
attack reset

graph open

detect3 run
detect3 status
detect3 threshold 78
detect3 signals 5

incident3 status
incident3 advance
incident3 isolate
incident3 block-ioc
incident3 revoke
incident3 remove-persistence
incident3 reboot

verify3 run
verify3 status

report3 executive
report3 technical

architecture3
truth3
engineering3
```

The terminal is still an allowlisted JavaScript command dispatcher. It is not Bash, PowerShell, CMD, WSL or an operating-system shell.

## Shared state model

The strongest realism improvement in 3.0 is that applications no longer act like unrelated dashboards.

When the scenario spawns PID 2116, the process exists in the same core process collection rendered by Process Explorer. When that process resolves a domain and opens TLS, packets, connections and logs are added to the same datasets used by the existing Network Monitor, Packet Analyzer and Log Viewer. When the endpoint is isolated, the corresponding connection state changes. When persistence is removed and the endpoint is rebooted, verification evaluates those same state transitions.

The reports are generated from current recorded state rather than hard-coded incident prose.

## Security boundary

The Browser OS page retains a Content Security Policy containing:

```text
connect-src 'none'
```

Browser OS 3.0 does not intentionally implement:

- `fetch()` or XHR network access;
- WebSocket/EventSource clients;
- `eval()` or dynamic Function execution;
- GitHub PATs, SSH private keys or deployment credentials;
- repository create/update/delete calls;
- host operating-system shell access;
- File System Access API access;
- real process or memory inspection.

Local incident state remains under the existing Browser OS namespaced storage model.

## Documentation-range addressing

Synthetic network addresses use RFC 5737 ranges such as:

- `192.0.2.0/24`
- `198.51.100.0/24`
- `203.0.113.0/24`

These are documentation ranges and are not intended to represent real enterprise infrastructure.

## Automated validation

The dependency-free Node test suite currently reports:

```text
624 assertions
624 passed
0 failed
```

Run it with:

```bash
node tests/run-tests.js
```

JavaScript syntax checks:

```bash
node --check script.js
node --check advanced.js
node --check v3-model.js
node --check v3.js
node --check tests/run-tests.js
```

The test suite covers:

- model/version/state normalization;
- attack-stage schema and uniqueness;
- detection scoring and threshold behavior;
- false-positive suppression;
- recruiter workflow;
- incident lifecycle transitions;
- evidence completeness;
- evidence graph consistency;
- response verification;
- report truth disclosures;
- architecture model;
- truth model;
- source/integration security invariants;
- documentation/engineering artifact presence.

A browser-readable evidence page is available at `tests/test-runner.html`.

## CI

The project ships a GitHub Actions workflow at `.github/workflows/browser-os-ci.yml` in this standalone package. In the portfolio repository, the workflow must live at the repository root:

```text
.github/workflows/browser-os-ci.yml
```

The workflow validates JavaScript syntax, executes the assertion suite, checks the CSP boundary, and scans the Browser OS 3.0 source for common GitHub/private-key secret markers.

## Engineering documentation

- `docs/THREAT-MODEL.md`
- `docs/SECURITY-INVARIANTS.md`
- `docs/KNOWN-LIMITATIONS.md`
- `docs/adr/ADR-001-static-trust-boundary.md`
- `docs/adr/ADR-002-shared-state-incident-model.md`
- `docs/adr/ADR-003-verify-response-not-just-contain.md`
- `docs/adr/ADR-004-explicit-truth-model.md`
- `CHANGELOG.md`
- `VALIDATION.md`
- `DEPLOY.md`

## Portfolio truth model

Browser OS 3.0 is a portfolio engineering project and training simulation. It should be described as an implemented browser-native simulation, not as production EDR/SIEM deployment experience.

A defensible summary is:

> Browser OS is an interactive security-operations environment I built to demonstrate how I correlate endpoint, identity, process, DNS, firewall and network evidence, scope a synthetic intrusion, contain it, validate recovery, improve detections and communicate the result. The enterprise telemetry is synthetic; the correlation, rule evaluation, state-transition, evidence-graph, verification and reporting logic are implemented in the application.
