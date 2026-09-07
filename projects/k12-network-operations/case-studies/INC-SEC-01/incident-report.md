# Security Incident Report — INC-SEC-01

## Condition

A STUDENT network path could reach a management-subnet host because an ACL permit sequence preceded the intended deny.

## Response

1. Restricted testing to the single known destination.
2. Preserved ACL and event evidence.
3. Identified policy sequence error.
4. Applied an approved, narrow ACL correction.
5. Validated both denied student access and allowed authorized management access.
6. Confirmed ordinary student DNS/HTTPS service remained functional.

## Preventive Improvement

Add automated configuration validation that checks for broad STUDENT→MGMT permits before deployment and include negative-control segmentation tests in the post-change checklist.
