from __future__ import annotations
from collections import Counter
from .health import calculate_health


def operations_report(inventory: dict, tickets: list[dict]) -> str:
    h = calculate_health(inventory, tickets)
    sev = Counter(t.get('severity', 'Unknown') for t in tickets)
    domains = Counter(t.get('fault_domain', 'Unknown') for t in tickets)
    lines = [
        '# Generated K–12 Operations Report',
        '',
        f'- Districts: {h.districts}',
        f'- Sites: {h.sites}',
        f'- Managed/simulated assets: {h.devices:,}',
        f'- Open tickets: {h.open_tickets}',
        f'- Health score: {h.score}/100',
        '',
        '## Ticket Severity',
        '',
    ]
    lines += [f'- {k}: {v}' for k, v in sorted(sev.items())]
    lines += ['', '## Fault Domains', '']
    lines += [f'- {k}: {v}' for k, v in domains.most_common()]
    if h.warnings:
        lines += ['', '## Warnings', ''] + [f'- {x}' for x in h.warnings]
    return '\n'.join(lines) + '\n'
