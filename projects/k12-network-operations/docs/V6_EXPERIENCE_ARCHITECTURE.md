# v6 Experience Architecture

## Purpose

v6 separates the portfolio into three layers so a recruiter, interviewer, and technical reviewer can each enter at the appropriate depth.

```text
PORTFOLIO LANDING PAGE
30-second comprehension
        │
        ▼
OPERATIONS CENTER
interactive operator workflow
        │
        ▼
REPOSITORY EVIDENCE
raw artifacts, scripts, configs, tests
```

## Layer 1 — Landing page

`index.html` is designed for fast comprehension.

It contains:

- switchable incident states;
- a 35-district digital-twin preview;
- live synthetic metrics;
- the evidence-first operating model;
- service architecture;
- six-case evidence browser;
- engineering-system summaries;
- a safe operations terminal;
- validation and truth-boundary statements.

## Layer 2 — Operations Center

`dashboard/index.html` is the operator workspace.

It contains:

- shift briefing;
- mission progress state;
- regional overview;
- clickable district twin;
- guided incidents;
- raw evidence vault;
- service dependencies/blast radius;
- configuration assurance;
- capacity engineering;
- change control;
- virtual terminal;
- architecture gallery.

## Layer 3 — Repository evidence

The browser experience is backed by the repository rather than independent demo text.

`portfolio/data.js` is generated from canonical structured data. `portfolio/v6-data.js` is generated from the six case-study directories. The v6 export validator detects stale generated browser data.

## Static safety model

The public experience is intentionally incapable of changing the real portfolio or GitHub repository.

```text
Browser UI
   │
   ├── reads bundled static JavaScript data
   ├── changes local DOM/session state
   └── displays synthetic artifacts

   X no backend
   X no GitHub token
   X no repository write API
   X no external network request
   X no shell execution
```

## Design principle

Visual polish is useful only when it improves technical comprehension. v6 therefore prioritizes interactive state, evidence provenance, decision paths, and operator feedback over decorative graphics.
