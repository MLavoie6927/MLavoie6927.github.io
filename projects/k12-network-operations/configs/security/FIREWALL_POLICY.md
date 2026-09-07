# Firewall Policy Design

## Objectives

- protect management plane,
- isolate student/guest networks,
- permit required instructional services,
- log security-relevant denies,
- avoid broad `any-any` exceptions.

## Example Policy

| From | To | Service | Action |
|---|---|---|---|
| MGMT | network infrastructure | admin protocols | allow |
| STAFF | Internet | DNS/HTTP/HTTPS | allow via policy |
| STUDENT | Internet | DNS/HTTP/HTTPS | allow via filter |
| GUEST | RFC1918 internal | any | deny |
| STUDENT | MGMT | any | deny |
| IOT | user networks | any | deny by default |

## Change Rule

Every exception should identify:

- requester,
- business use,
- source group,
- destination,
- service/port,
- expiration/review date when appropriate.
