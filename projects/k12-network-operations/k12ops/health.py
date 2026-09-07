from __future__ import annotations
from .model import HealthSummary

def calculate_health(inventory: dict, tickets: list[dict] | None = None) -> HealthSummary:
    tickets = tickets or []
    districts = inventory.get('districts', [])
    sites = sum(len(d.get('sites', [])) for d in districts)
    devices = sum(d.get('asset_count',0) for d in districts)
    open_tickets = sum(t.get('status') not in {'Resolved','Closed'} for t in tickets)
    p1 = sum(t.get('severity') == 'P1' and t.get('status') not in {'Resolved','Closed'} for t in tickets)
    p2 = sum(t.get('severity') == 'P2' and t.get('status') not in {'Resolved','Closed'} for t in tickets)
    score = max(0, 100 - p1*8 - p2*3 - max(0,open_tickets-10))
    warnings=[]
    if p1: warnings.append(f'{p1} active P1 incident(s)')
    if p2: warnings.append(f'{p2} active P2 incident(s)')
    if open_tickets > 10: warnings.append('Open-ticket volume exceeds lab baseline')
    return HealthSummary(len(districts), sites, devices, open_tickets, score, warnings)
