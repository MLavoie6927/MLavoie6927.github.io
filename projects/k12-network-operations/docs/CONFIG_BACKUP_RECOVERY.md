# Configuration Backup & Recovery

## Coverage

- routers,
- firewalls,
- managed switches,
- filtering policy exports,
- DHCP/DNS configuration,
- automation/scripts.

## Controls

- versioned backups,
- access-controlled storage,
- no plaintext secrets in Git,
- documented restore procedure,
- periodic restore test,
- before/after snapshot around major changes.

## Recovery Verification

A backup is not considered useful until a representative configuration can be restored in the lab and the expected interfaces, VLANs, routes, and policies validate successfully.
