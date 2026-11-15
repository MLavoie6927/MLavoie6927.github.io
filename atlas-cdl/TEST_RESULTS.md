# Test results — ATLAS CDL Exam Academy v1.0

**Date:** 2026-11-14  
**Owner:** Marc Lavoie  
**Environment:** Python + Playwright, system Chromium, local assets injected in memory due to automated-browser restrictions on `file://`/localhost navigation.

## Bank tests — PASSED

- Exactly 300 original practice questions.
- 10 sections with expected category counts.
- Unique stable hash-based IDs and unique question stems.
- Four unique nonempty answer options per question.
- Correct answer indices in 0–3.
- Explanations, topic names, source IDs, attribution and review-status fields present.
- JSON and browser-ready JS generated from the same human-editable source.

Command: `python tests/validate_bank.py`

## Browser checks — PASSED

- Main dashboard renders six pathways, five interactive vehicle-system SVG target groups, and the correct 300 count.
- Search, category filtering, pagination and bookmark toggle function.
- Flashcards reveal the answer and hide again when advancing.
- Eighteen inspection checklist stations render, mark as reviewed and update correctly.
- Hazmat 20-question exam grades 20/20 as 100% correct.
- Class A 95-question exam runs end to end: General/Cargo 50/50, Air 25/25, Combination 20/20; each section passes separately.
- 390px mobile layout shows no unintended horizontal page overflow and the study guide is reachable.
- No uncaught JavaScript errors observed during the tested desktop/mobile flows.
- Screenshots captured in `preview-desktop.png` and `preview-mobile.png`.

Command: `python tests/test_browser.py`

## Not verified

- Official state DMV exam questions (not provided or asserted).
- Individual question content against a current licensed CDL instructor's approved question set.
- Deployed GitHub Pages integration; this package has not been committed to a user repository.
- Realtime compliance with every state rule, OEM-specific inspection specification or endorsement exception.
- Browser persistence across reload in restricted `about:blank` browser-test origin; saved progress code is provided and should be rechecked on the destination site's real same-origin URL.
- Screen reader and full accessibility conformance audit; interface includes semantic labels but no formal WCAG certification.

The test results concern application behavior and structure, not official testing validity or guaranteed licensing outcomes.
