# Known Limitations — Browser OS 3.0

Browser OS 3.0 intentionally does **not** claim to be a production EDR, SIEM, operating system, firewall, identity provider, packet sniffer, malware sandbox, or incident-response platform.

- Enterprise telemetry is synthetic and deterministic.
- No real malware is executed.
- Process and memory views do not inspect the visitor's computer.
- Network flows and packets are JavaScript objects and never leave the browser as simulated traffic.
- Threat intelligence is local synthetic context; it is not live reputation data.
- Identity sessions are simulation handles, not authentication tokens.
- Firewall enforcement applies to Browser OS synthetic flows only.
- Browser-local persistence can be cleared by the browser or privacy settings.
- Generated incident reports are portfolio artifacts, not production records.
- The static-site architecture cannot protect private content placed in the public repository.
- GitHub account/repository security remains outside the Browser OS application boundary.
- Browser behavior can vary across engines; CI provides syntax/static validation but is not a substitute for broad cross-browser QA.

The purpose of the project is to demonstrate security reasoning, correlation, detection engineering, incident workflow, response verification, reporting, and software engineering within a safe public portfolio environment.
