# Interactive Interview Q&A

This static GitHub Pages application contains 200 interview-practice questions in four subjects:

- General: 16
- Cybersecurity: 24
- Networking: 125
- Portfolio: 35

It uses plain HTML, CSS, and JavaScript. There is no backend, database, analytics, external library, API, login, or write path to the GitHub repository.

## Files

- `index.html` provides the semantic application structure and restrictive content security policy.
- `styles.css` provides the responsive presentation.
- `questions.js` contains the generated, read-only question bank.
- `script.js` provides category switching, search, random practice, and accordion controls.

Question cards are created with DOM methods and `textContent`; the application does not inject question data through `innerHTML`.
