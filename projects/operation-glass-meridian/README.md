# Operation Glass Meridian | Interactive Intelligence Lab v4.1

Designed and implemented by Marc Lavoie, this browser-based portfolio project presents an end-to-end all-source intelligence workflow while remaining fully static and GitHub Pages compatible.

## Start here

Open `index.html`, then follow the suggested workflow:

1. Review the 30 synthetic intelligence reports.
2. Evaluate source quality and diagnostic value.
3. Test competing hypotheses, assumptions, bias, and deception.
4. Task collection and monitor warning indicators.
5. Build a defensible executive judgment with explicit confidence and gaps.

The interface includes a guided introduction for first-time visitors and a complete command workspace for deeper analysis.

## Major v4 additions

- Eight-stage intelligence workflow status strip
- Evidence Board with pinning, decision relevance, analytic disposition, and rationale
- Weighted ACH evidence (1–5 diagnostic weight)
- Key Assumptions Check workspace
- Nine-item cognitive-bias register
- Deception and red-team laboratory
- Alternative Futures / Cone of Plausibility workspace
- Six sequential instructor intelligence injects
- Full analytic Decision Log
- 4,000–6,000 word assessment paper builder with section word counts
- APA Research Library tracking the minimum 12 scholarly/professional sources
- Automated tradecraft quality checks and publication gate
- 100-point graduate rubric self-assessment
- JSON export/import for portable workspace backups
- Markdown intelligence-product export
- Print-ready paper/final-assessment output
- Dashboard priority-evidence and quality summaries

## Existing v3 capabilities retained

- 30 intelligence reports
- HUMINT, SIGINT, GEOINT/IMINT, MASINT, OSINT/SOCMINT, CYBINT/DNINT, FININT, TECHINT, MEDINT, ORBAT, diplomatic, political, transportation, energy, and deception reporting
- Source Matrix
- Intelligence search/filtering
- Evidence epistemic classification
- Analyst scratchpad and per-report notes
- H1–H4 probabilities and locked checkpoints
- ACH
- Timeline
- Collection planner
- Indicators & Warning board
- applied intelligence tradecraft questions
- Executive Brief
- Final Assessment Builder
- 03:20:00 simulation clock
- localStorage persistence
- Responsive/mobile design

## Portfolio truth boundary

Operation Glass Meridian is a training simulation. Norland, Estavia, the reporting, and the operational events are fictional. The project demonstrates software design and analytic tradecraft; it does not claim access to operational intelligence systems or production data.

Visitor work is stored only under the scoped `glassMeridianLab.v1` browser-storage key. The project has no backend, API, database, account system, repository token, or network request path.

## Files

- `index.html` — standalone project page and complete lab markup
- `glass-meridian.css` — namespaced styling
- `project.css` — portfolio shell, onboarding, responsive, and accessibility refinements
- `glass-meridian.js` — v3/base simulation engine plus v4 bridge
- `glass-meridian-v4-addon.js` — v4 command-edition capabilities
- `preview.png` — tested project preview used by the main portfolio
- `VALIDATION.json` — current structural, browser-workflow, and boundary validation record
- `SHA256SUMS.json` — SHA-256 integrity manifest for the published project files

The scripts load in this order immediately before `</body>`:

```html
<script src="glass-meridian.js"></script>
<script src="glass-meridian-v4-addon.js"></script>
```

## Validation

The repository validator checks local assets, duplicate IDs, workspace controls, the 30-report model, JavaScript syntax, and the no-network boundary. Workspace import accepts only a valid version 4 Glass Meridian export under 2 MB. Browser QA covers desktop and mobile workspace switching, evidence rendering, modal behavior, horizontal overflow, console errors, and unexpected external requests.
