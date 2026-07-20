# Public Publishing Security Checklist

Use this checklist before publishing or updating the cybersecurity portfolio on GitHub Pages.

## Remove Sensitive Information

Do not publish:

- Passwords
- API keys
- Access tokens
- Session cookies
- Qwiklabs credentials
- Private school credentials
- Private emails
- Private phone numbers
- Home addresses
- Real incident logs
- Private company data
- Internal IP addresses
- Internal hostnames
- Cloud project IDs
- Cloud account numbers
- Student IDs
- Screenshots containing sensitive data

## Screenshot Review

Before adding screenshots, verify that they do not show:

- Account names or personal profile details
- Email addresses
- Phone numbers
- Cloud project names or IDs
- Tenant IDs or subscription IDs
- Internal network details
- Private URLs
- Tokens, keys, or QR codes
- Real alerts from private environments
- Customer, employer, or school data

Use cropped or redacted screenshots when needed. When in doubt, use a placeholder screenshot instead.

## Project Documentation Review

Before publishing project write-ups:

- Use synthetic sample logs instead of real incident logs.
- Use documentation-safe placeholder values when examples are needed.
- Replace private paths, usernames, hostnames, and organization names with placeholders.
- Confirm commands do not expose secrets in arguments or output.
- Remove lab credentials and training platform details.
- Avoid publishing exploit steps that could enable misuse.
- Describe security outcomes, detection logic, and defensive lessons clearly.

## Resume and Contact Review

Before linking a resume:

- Remove private phone numbers unless intentionally public.
- Remove home address details.
- Remove non-public employer, school, or client information.
- Remove private references.
- Confirm all email addresses and social links are intended for public use.

## Git and Repository Review

Before pushing publicly:

- Check all staged changes.
- Search the repository for terms such as `password`, `token`, `secret`, `key`, `credential`, and `private`.
- Confirm deleted secrets are not still present in Git history.
- Do not commit `.env` files, private notes, raw logs, exported browser data, or screenshots with sensitive data.
- Keep the repository free of tracking scripts, analytics snippets, API keys, backend code, and database files.

## Final Public Release Check

Publish only when:

- Every placeholder that remains is clearly marked as a placeholder.
- All project cards use safe summaries.
- All repository links are safe to open publicly.
- All screenshots are sanitized or replaced with placeholders.
- The site works on desktop and mobile.
- The portfolio communicates skills without exposing private environments or credentials.
