# Change Record — CHG-LAB-0042

- **Requester:** instructional technology lead (synthetic)
- **Business need:** access approved learning application
- **Source scope:** STAFF group only
- **Destination:** `api.learning-example.test`
- **Service:** HTTPS / TCP 443 through managed web filter
- **Risk:** low; specific dependency only
- **Implementation:** add FQDN to STAFF application allowlist
- **Rollback:** remove the single FQDN entry
- **Validation:** teacher workflow + STUDENT control test
- **Approval:** synthetic lab change authority
