# Internet Filtering Runbook

## Questions

- Which user/group?
- Which exact URL/FQDN?
- What category/action appears in the filter log?
- Does the application use additional authentication/CDN/API/WebSocket domains?
- Does the problem reproduce outside the managed browser/profile?

## Safe Exception Design

Prefer user/group + destination + required service over global bypass. Validate both the requested application and a control case that should remain blocked.
