# ADR-001: Preserve a Static Trust Boundary

**Status:** Accepted

## Context
The portfolio is hosted on GitHub Pages. Adding a fake front-end login or embedding service credentials would create misleading or unsafe security properties.

## Decision
Browser OS remains fully static. It does not gain a backend, repository credential, external network client, or private-data feature.

## Consequences
- Recruiters can run the demo without accounts.
- All source must be treated as public.
- Private content cannot be secured by Browser OS itself.
- All enterprise data used by the workstation must be synthetic or sanitized.
