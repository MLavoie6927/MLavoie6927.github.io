# Browser OS 3.0 Security Invariants

These constraints are design requirements, not optional features.

1. Browser OS remains a static site with no application backend.
2. CSP retains `connect-src 'none'` for the Browser OS page.
3. Browser OS source contains no GitHub PAT, SSH private key, deployment credential, password, API secret, or refresh token.
4. Browser OS does not invoke Bash, PowerShell, CMD, WSL, or another host shell.
5. Browser OS does not use `eval()` or dynamic function construction.
6. Browser OS does not use the host File System Access API.
7. Browser OS does not call GitHub repository create/update/delete endpoints.
8. Scenario IP addresses remain RFC 5737 documentation ranges.
9. Synthetic user, endpoint, packet, memory, identity, incident and intelligence data are visibly labeled synthetic.
10. Forensics Mode remains read-only for Browser OS state-changing actions.
11. Response actions operate only on simulated state.
12. Containment is not considered validated until the verification suite tests both negative and positive controls.
13. Generated reports repeat the truth-model disclosure.
14. Automated validation must fail when key source or security invariants are missing.
