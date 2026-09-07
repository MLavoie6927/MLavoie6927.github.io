# Web Filter Exception Procedure

## Goal

Resolve legitimate access problems without creating broad bypasses.

## Workflow

1. Capture exact URL/FQDN.
2. Confirm user, group, and device scope.
3. Record block reason/category.
4. Validate reputation and business purpose.
5. Identify dependencies such as:
   - CDN,
   - authentication domain,
   - API,
   - media host,
   - WebSocket endpoint.
6. Determine whether staff-only access is sufficient.
7. Implement the smallest approved exception.
8. Test from both allowed and non-allowed groups.
9. Document and review.

## Do Not

- disable TLS inspection globally,
- bypass filtering for an entire district because one SaaS app fails,
- allow an entire cloud provider when specific FQDNs are sufficient.
