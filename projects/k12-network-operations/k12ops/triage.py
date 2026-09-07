from __future__ import annotations
from .model import TriageResult

def triage_scenario(scenarios: list[dict], scenario_id: str) -> TriageResult:
    for s in scenarios:
        if s.get('id') == scenario_id:
            return TriageResult(
                scenario_id=scenario_id,
                severity=s['severity'],
                fault_domain=s['fault_domain'],
                next_actions=list(s['actions']),
                evidence=list(s['evidence']),
                escalation=s['escalation'],
            )
    raise KeyError(f'Unknown scenario: {scenario_id}')

def suggest_fault_domain(observations: dict[str,bool]) -> str:
    if not observations.get('link', True): return 'Physical/Endpoint'
    if not observations.get('ip', True): return 'DHCP/Access'
    if not observations.get('gateway', True): return 'LAN/VLAN'
    if not observations.get('dns', True): return 'DNS'
    if not observations.get('tcp', True): return 'Firewall/Filter/WAN'
    if not observations.get('auth', True): return 'Identity/Policy'
    if not observations.get('app', True): return 'Application/SaaS'
    return 'No fault reproduced'
