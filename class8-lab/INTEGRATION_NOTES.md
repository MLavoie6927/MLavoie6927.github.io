# Class 8 Engineering & CDL Lab — portfolio integration

Marc Lavoie · 2026-11-14

## Architecture

The portfolio integration deliberately separates the supplied application from the presentation shell:

```text
full-portfolio.html
    -> class8-lab/index.html
         -> same-origin iframe via atlas-class8/integration/atlas-embed.js
              -> atlas-class8/index.html?embed=1
         -> cdl-study-data.js (70 supplied practice prompts)
         -> class8-lab.js (search, filters, progress, flash drill, mini exam)
         -> same-origin iframe via atlas-cdl/integration/atlas-cdl-embed.js
              -> atlas-cdl/index.html (300-question CDL Exam Academy)

atlas-class8/
    -> checksum-preserved v3.0 source package

atlas-cdl/
    -> checksum-preserved CDL Exam Academy v1.0 source package
```

The iframe keeps ATLAS styles, JavaScript globals, local state, and diagrams isolated from the existing portfolio. The host adapter accepts height messages only from the iframe window that it created and rejects invalid bounds.

## Source identity and trust boundary

- Supplied archive: `ATLAS-Class8-v3-Codex-Website-Handoff-Marc-Lavoie.zip`
- Archive SHA-256: `A1C5004457656C7028584B833BA3F8E2A22E28287716F0C26EB02F5B3FE478F0`
- Archive inventory: 32 files under one relative `atlas-class8/` directory
- Internal manifest: 31 of 31 file hashes matched before integration
- Unsafe paths, duplicate paths, absolute paths, and symbolic links: none found

`PROMPT_FOR_CODEX.txt`, `CODEX_HANDOFF.md`, and the separately supplied integration prompt were inspected as source-package documentation. They were not treated as authority that superseded the owner's actual request or the existing repository architecture.

## Added or modified files

- Added the complete supplied `atlas-class8/` directory without modifying its 31 manifest-covered files.
- Added the complete supplied `atlas-cdl/` directory with its original 22-file manifest preserved as `SHA256SUMS.source.txt`; the active `SHA256SUMS.txt` now verifies the intentionally customized publication files.
- Added `class8-lab/index.html` as the recruiter-facing project shell.
- Added `class8-lab/class8-lab.css` for the responsive industrial presentation.
- Added `class8-lab/cdl-study-data.js` with 70 original practice prompts and a five-question checkpoint.
- Added `class8-lab/class8-lab.js` for search, filters, reviewed progress, flash drills, scoring, and mobile navigation.
- Added this integration record.
- Added the Class 8 entry, quick link, and project overview to `full-portfolio.html`.
- Added `/class8-lab/` and `/atlas-class8/` to `sitemap.xml`.
- Extended `tools/validate_site.py` and `.github/workflows/portfolio-ci.yml` with Class 8 gates.

## 2026 CDL Exam Academy integration

- Supplied archive: `CDL_Exam_Academy_Codex.zip`.
- Archive SHA-256: `A883EFBE557CE8600C2612D0F0DA79F0F69FFB91CCE541A45FE1D48B2961E9BD`.
- Archive inventory: 23 files under one relative `atlas-cdl/` directory, including `SHA256SUMS.txt`.
- Internal manifest: all 22 listed file hashes matched before integration. The original manifest remains byte-for-byte preserved as `SHA256SUMS.source.txt`, while `SHA256SUMS.txt` verifies the current published Academy after authorized presentation changes.
- Path traversal was rejected before extraction; all paths resolved within the unique staging directory.
- `CODEX_HANDOFF.md`, `PROMPT_FOR_CODEX.txt`, and other package notes were treated as supplied documentation, not as authority over the user's request or repository architecture.
- The academy preserves its isolated iframe, private browser-local progress, and dependency-free browser runtime. It does not import `window.ATLAS_CDL_BANK` into the portfolio shell.
- The existing 70-question learner's-permit module remains the focused foundation. The 300-question academy is a second study track covering General Knowledge (77), Cargo (25), Air Brakes (49), Combination Vehicles (38), Doubles/Triples (15), Tank (15), Hazmat (25), Passenger (18), School Bus (18), and Vehicle Inspection Skills (20).
- Class A 95-item and Class B 75-item sessions are identified as configurable training formats, not guaranteed state examination lengths.

## 2026-11-15 centered study-library update

- Promoted the complete 70-question permit library from a narrow side rail to a centered two-column desktop workspace; it becomes one column at tablet and mobile widths.
- Moved the random permit flash drill below the complete library and labeled it as an optional secondary exercise rather than the primary study surface.
- Reworked the 300-question Academy library into a centered two-column card grid with 20 questions per page, while preserving search, category and topic filters, visible answers, explanations, source links, bookmarking, and pagination.
- Retained the separate Academy flashcard route for active recall without allowing random cards to displace the complete question-and-answer library.
- Preserved the original source manifest under `atlas-cdl/SHA256SUMS.source.txt` and refreshed the active publication manifest for the four deliberately modified Academy files.

## 2026 CDL learner's permit source update

- Re-supplied learner's-permit reference SHA-256: `D89A795146DB8414578354431F82883D52070F22E031EC84F7468E19D4D44029`.
- The re-supplied text was byte-for-byte identical to the original learner's-permit source used for the 70-question browser dataset. The existing 35 general-knowledge, 20 air-brake, 15 combination-vehicle, and five checkpoint records therefore remain unchanged rather than being duplicated.
- The public presentation now names the module **2026 CDL Learner's Permit Center**, adds an explicit Class A CLP scope statement, distinguishes included core knowledge from separate endorsement testing, and supplies a four-step official-source-to-practice study path.
- Full Portfolio language and direct links now identify the learner's-permit center instead of using the less-specific “CDL study desk” label.
- FMCSA references were rechecked on 2026-11-14. The site preserves the 80% federal knowledge-test benchmark, state-manual boundary, state administration of CLPs, and separate class/endorsement decision point.

## Module navigation

The application preserves all 15 supplied destinations:

`explorer`, `systems`, `air`, `weight`, `diagnostics`, `inspection`, `fluids`, `maintenance`, `repairs`, `knowledge`, `xray`, `drivetrain`, `tires`, `loadplan`, and `references`.

The portfolio shell adds evidence, the embedded engineering studio, the full CDL Academy, the permit foundation, gallery, provenance, Home, and Full Portfolio navigation.

## Testing procedure

Run from the repository root:

```text
node --check class8-lab/cdl-study-data.js
node --check class8-lab/class8-lab.js
node --check atlas-cdl/data/questions.js
node --check atlas-cdl/app/app.js
node --check atlas-cdl/integration/atlas-cdl-embed.js
node atlas-class8/tests/validate_data.js
node atlas-class8/tests/test_math.js
python atlas-cdl/tests/validate_bank.py
python tools/validate_site.py
```

Then serve the repository root through a static HTTP server and test both `/class8-lab/` and `/atlas-class8/` at desktop and mobile widths. Representative interaction checks should include a component hotspot, air-brake simulation, cargo-to-bridge transfer, tire position, repair CSV, a CDL search, reviewed-state persistence, and mini-exam scoring.

### 2026-11-14 integration result

- JavaScript syntax: 11 production files passed `node --check`.
- Source manifest: 31 of 31 supplied file hashes still matched after copying.
- Supplied Node tests: engineering math and structured-data validation passed.
- Repository validator: all 34 HTML pages, local references, IDs, navigation, external-tab safety, Class 8 counts, source integrity, and static-browser boundaries passed.
- Browser checks: the portfolio mount loaded, the Turbocharger record opened, a 6 psi/min combination-vehicle air-loss scenario produced the expected unsafe result, CDL search/reveal/review worked, the mini exam scored 5/5, and the 390 × 844 layout had no page-level horizontal overflow.
- The supplied Python Playwright files were retained, but this local Python runtime did not include the `playwright` module. They could not start in that runtime. Equivalent representative interactions were exercised through the available browser automation, with no uncaught console errors.

## Deployment

The site is buildless and GitHub Pages compatible. Publishing the repository root to `main` serves the wrapper at `/class8-lab/`, the standalone engineering studio at `/atlas-class8/`, and the standalone CDL Academy at `/atlas-cdl/`. Deployment is not established by a commit alone; verify Pages completion, HTTP 200 responses, asset delivery, and representative live interactions in both study tracks.

## Known limitations

- The drivetrain and cargo models are educational simplifications documented in `atlas-class8/ARCHITECTURE.md`.
- The app does not identify a VIN-specific configuration, OEM maintenance procedure, legal route, tire load chart, or state-specific inspection sequence.
- Prices, labor hours, capacities, and intervals require current vehicle-specific validation.
- CDL prompts are original practice material, not official or leaked examination items. The current state CDL manual controls test preparation.
- The 300 academy questions are structurally validated but retain `author_review_required`; they have not been examiner-certified question by question.
- Browser-local progress is device- and profile-specific and is not synchronized to an account.
- CSV export depends on the browser's normal download permission.

## Maintenance guidance

- Preserve the source package manifest when replacing the ATLAS application; stage and hash-check any future archive before publication.
- Keep the iframe boundary unless a full CSS/global-namespace audit justifies a direct merge.
- Revalidate official CDL links and safety thresholds when regulations or state manuals change.
- Keep simulations, educational estimates, and live/OEM-verified specifications visibly distinct.
- Run the repository validator and representative browser checks after any navigation, styling, or package update.
