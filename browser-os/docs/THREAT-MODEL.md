# Browser OS 3.0 Threat Model

## Purpose
Browser OS is a public, static GitHub Pages portfolio application. Its primary security objective is to demonstrate security-operations reasoning without creating a real management plane, real offensive capability, or repository write path.

## Assets
1. Integrity of the public portfolio source.
2. Confidentiality of the visitor's real device and browser data outside Browser OS namespaced state.
3. Accuracy of the portfolio truth model.
4. Integrity of synthetic investigation state, evidence, reports, and test results.
5. Recruiter trust: simulated enterprise telemetry must not be presented as production experience.

## Trust boundaries
- **Public source boundary:** everything shipped to GitHub Pages is public.
- **Browser OS state boundary:** mutable state is synthetic and browser-local.
- **Host boundary:** Browser OS does not receive a host shell, host process API, host memory API, or host filesystem API.
- **Network boundary:** CSP retains `connect-src 'none'`; scenario packets and destinations are data objects only.
- **Repository boundary:** application code has no GitHub credential or repository write API.

## Threats and mitigations
### Secret publication
Risk: a credential, token, private identifier, or real log is accidentally committed.
Mitigations: security checklist, CI source scans, documentation-only IP ranges, explicit no-secret invariant.

### XSS or unsafe HTML rendering
Risk: synthetic/user-entered notes could be inserted as active markup.
Mitigations: UI output uses HTML escaping for dynamic text; no external script dependencies; CSP restricts script sources to self.

### Misleading portfolio claims
Risk: synthetic data could be interpreted as production telemetry or independent professional deployment.
Mitigations: truth model visible in the guided workflow, reporting, security boundary window, README, and known limitations.

### External data exfiltration
Risk: Browser OS could be modified to transmit visitor data.
Mitigations: `connect-src 'none'`, no external network client, no analytics dependency, CI security invariant.

### Destructive host behavior
Risk: a simulation action could alter the user's host or repository.
Mitigations: state transitions operate on JavaScript objects; no OS shell, File System Access API, GitHub write path, or backend.

### State corruption
Risk: stale/incompatible browser-local state could break the demo.
Mitigations: versioned model normalization, scenario reset, snapshots, deterministic defaults, validation tests.

### False confidence in containment
Risk: an incident could be marked complete without validation.
Mitigations: dedicated verification suite checks malicious C2 denial, approved management continuity, persistence removal, session revocation, segmentation, and clean reboot.

## Residual risk
Browser OS remains client-side JavaScript delivered by a public website. A future code change could weaken these guarantees. The CI checks and documentation reduce that risk but do not replace code review or GitHub account security.
