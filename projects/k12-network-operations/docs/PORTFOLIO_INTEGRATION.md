# Portfolio Integration — v6

This project was designed to sit beside the existing Browser OS and Service Provider NOC projects rather than look like a separate template.

## Recommended deployment path

Copy the complete project directory into the portfolio repository as:

```text
projects/
└── k12-network-operations/
    ├── index.html
    ├── dashboard/
    ├── portfolio/
    ├── assets/
    ├── case-studies/
    ├── data/
    └── ...
```

The project is static and does not require a backend. Its public HTML uses a restrictive Content Security Policy and does not make network requests.

## Add it to the main website

`integration/project-card.html` contains a project card built with the same `project-card`, `project-content`, `project-screenshot`, and `project-link` classes already used on the main portfolio.

Recommended placement: the **Network Engineering** section, next to the Service Provider NOC Security Engineering Lab.

## Suggested navigation link

If a dedicated navigation item is desired:

```html
<li><a href="projects/k12-network-operations/" target="_blank" rel="noopener">K12 Ops</a></li>
```

For a less crowded navigation bar, leave it as a project card only.

## Why the v6 experience matches the portfolio

The project deliberately reuses the strongest interaction patterns from the existing site:

- a guided operator mission rather than a passive page;
- switchable operational scenarios;
- live, deterministic metrics;
- explicit synthetic/simulation boundaries;
- raw evidence that can be inspected instead of summary-only claims;
- a technical terminal with safe commands;
- architecture paired with operational decisions;
- validation, rollback, and negative testing;
- direct recruiter/interviewer entry points.

## Public truth boundary

Do not remove the synthetic-data notice. The 35 districts, incidents, users, telemetry, and performance metrics are fictional. The portfolio value is the implementation, troubleshooting method, code, architecture, evidence design, and validation—not a claim of production administration for those fictional districts.
