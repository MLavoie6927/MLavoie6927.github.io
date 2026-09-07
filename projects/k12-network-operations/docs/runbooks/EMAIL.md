# Email Service Runbook

## Layers

1. account/license
2. DNS (MX/autodiscover where applicable)
3. network/TCP/TLS
4. client profile
5. authentication/MFA
6. provider status
7. mailbox/quota/policy

## Protocol Awareness

SMTP is mail transport/submission; IMAP and POP are retrieval protocols. Modern Microsoft/Google environments usually rely on provider-specific authenticated HTTPS and modern authentication even when these protocols remain part of the conceptual support scope.
