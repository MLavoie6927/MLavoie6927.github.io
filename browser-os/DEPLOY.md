# Deploy Browser OS 3.0 to the Portfolio Repository

Browser OS 3.0 is designed for the portfolio path:

```text
browser-os/
```

## Browser OS files
Copy the contents of this package into the repository's `browser-os/` directory, replacing the older Browser OS files while preserving the complete 3.0 tree.

Required runtime files include:

```text
browser-os/index.html
browser-os/styles.css
browser-os/script.js
browser-os/advanced.js
browser-os/v3.css
browser-os/v3-model.js
browser-os/test-manifest.js
browser-os/v3.js
browser-os/tests/
browser-os/docs/
browser-os/README.md
browser-os/CHANGELOG.md
browser-os/VALIDATION.md
browser-os/DEPLOY.md
```

## GitHub Actions workflow
GitHub only recognizes workflows at repository root. Copy:

```text
browser-os/.github/workflows/browser-os-ci.yml
```

from this standalone package to:

```text
.github/workflows/browser-os-ci.yml
```

in the portfolio repository.

## Pre-deployment validation

```bash
node --check browser-os/script.js
node --check browser-os/advanced.js
node --check browser-os/v3-model.js
node --check browser-os/v3.js
node browser-os/tests/run-tests.js
```

Expected Browser OS 3.0 assertion result for this package:

```text
624 passed / 624 assertions
```

## Security review
Before publishing, confirm:

- CSP still contains `connect-src 'none'`;
- no real logs or private identifiers were introduced;
- no PAT, private key, credential or session secret was added;
- all enterprise scenario data remains synthetic;
- the Truth & Security Boundary screen remains enabled.
