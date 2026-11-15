# Codex integration handoff — ATLAS CDL Exam Academy v1.0

**Owner:** Marc Lavoie  
**Created:** 2026-11-14  
**Target:** Existing cybersecurity and engineering portfolio website, including the existing ATLAS Class 8 engineering module.

## Mission

Integrate a new, working **CDL Exam Academy** module containing 300 original, independently authored exam-style practice questions. **Do not overwrite or regenerate the existing ATLAS Class 8 tractor-trailer module.** This is an additional tab or submodule.

## What is included

- `index.html`: standalone semantic HTML application.
- `app/styles.css`: responsive isolated professional exam dashboard.
- `app/app.js`: navigation, study library, mock exam grading, flashcards, bookmarks, source links and progress export.
- `data/questions-source.txt`: original human-readable master questions with explanation and 4 options.
- `data/questions.json`: structured questions, answer indices, topics, source references and review flags.
- `data/questions.js`: browser-friendly question data; works even from local `file://` without `fetch()`.
- `ALL_QUESTIONS_AND_ANSWERS.md`: full human-readable question and answer key.
- `integration/website-snippet.html`: iframe embedding example.
- `integration/atlas-cdl-embed.js`: small postMessage iframe-resize adapter with same-origin and source-window checks.
- `docs/SOURCES.md`: authoritative source links and verified federal baseline facts.
- `docs/CONTENT_REVIEW.md`: safety and editorial review notes, including state-specific and vehicle-specific caveats.
- `tests`: machine-readable bank validation and browser smoke/regression test.

## Integration steps

1. Inspect the repository and identify its actual navigation, page templates, JavaScript and deployment base path.
2. Add entire release folder contents under `<website-repository>/atlas-cdl/`.
3. Add top-level **CDL Exam Academy** navigation, or add a **CDL Permit Practice** child tab inside the existing **Semi-Truck Engineering Lab**, matching the existing site conventions.
4. Use `integration/website-snippet.html` if a same-origin iframe fits the website's route architecture. **Update its relative URLs to the actual page location.** Otherwise, link directly to `atlas-cdl/index.html`.
5. If an iframe is used, load the adapter from the *hosting page* and test resizing, mobile layout and frame origin. The app sends only `{type:'atlas-cdl:resize',height:...}` and does not expose user answers across frames.
6. **Do not import the question bank into the host global scope.** The `window.ATLAS_CDL_BANK` global exists only within the iframe's isolated browsing context. If directly merging the app, namespace/rewrite it to avoid collisions.
7. Preserve all files and relative paths when copying. All runtime code works without CDN assets, API keys or build tools.
8. Verify the current repo's existing tests/build and GitHub Pages relative paths; never assume `/atlas-cdl/` works at the domain root on a project site.

## Required test paths

- Overview → Class A practice → 95-question session → category-by-category 80% grading.
- General 20/25/50 question variants and endorsement-specific exams.
- Study library: search, category filter, topic filter, pagination and bookmarking.
- Flashcard reveal, previous/next, section shuffle.
- Review missed/seen/bookmarked, export progress JSON.
- 18-step inspection walk-through and study guide.
- Source links for Arkansas, Tennessee, FMCSA and FHWA.
- 375px mobile, 768px tablet, 1440px desktop and landscape overflow.
- Zero uncaught browser errors and no breaking host CSS changes.

## Regulatory and ethical requirements

**Never call these "the actual CDL DMV questions."** They are newly authored practice questions. Individual states draw from their own licensing exams; the official item banks have not been supplied or authenticated. No score or wording guarantees passing a state exam. Present the official manual and licensing requirements as authoritative.

The **Class A mock format (50 general/cargo + 25 air + 20 combination)** is a learning configuration. Do not imply every jurisdiction has exactly that test length. The federal minimum pass standard is 80% on each knowledge test; see `docs/SOURCES.md`.

**State selector behavior:** selecting Arkansas or Tennessee changes the prominent source reference, not the substantive content of questions. The bank follows federal and Arkansas manual topic structure. A fully state-specific Tennessee bank would require explicit Tennessee manual editorial verification before labeling it state-specific.

Air-brake low-warning thresholds, parking-valve behavior and inspection instructions are vehicle-dependent. The Arkansas modernized supplement illustrates a 55 psi or manufacturer-specified low-warning threshold and typical 20–45 psi pop-out; do not use the app as a certified inspection procedure.

Hazmat endorsement requires additional TSA/ELDT and applicable legal conditions. Class A/B initial training requires applicable ELDT before skills examinations. The questions are educational and do not substitute for official training.

## Git workflow

Create a feature branch if needed, integrate and test, inspect the diff for unrelated edits, then commit and push/create PR if authorized. Report changed paths, test results, link to commit/PR and any remaining issues. **Do not claim the website was updated or deployed unless actual repository changes and deployment are verified.**
