# Syslog / Event Taxonomy

## Categories

- LINK: interface up/down, flap
- ROUTING: adjacency/peer/route change
- AUTH: administrative login/failure
- CONFIG: configuration modification
- SECURITY: firewall deny/policy event
- SYSTEM: CPU, memory, temperature, power
- SERVICE: DNS/DHCP/application health

## Minimum Fields

Timestamp/timezone, device, site/district, facility/severity, event category, interface/service, message, correlation/ticket ID when available.
