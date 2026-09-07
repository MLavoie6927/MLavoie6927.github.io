from __future__ import annotations
import ipaddress
from .model import ValidationFinding

def validate_inventory(data: dict) -> list[ValidationFinding]:
    out: list[ValidationFinding] = []
    districts = data.get('districts', [])
    ids = [d.get('id') for d in districts]
    if len(ids) != len(set(ids)):
        out.append(ValidationFinding('ERROR','DUP_DISTRICT','District IDs must be unique'))
    if len(districts) != 35:
        out.append(ValidationFinding('WARN','DISTRICT_COUNT',f'Expected 35 lab districts, found {len(districts)}'))

    seen_nets: list[ipaddress.IPv4Network] = []
    for d in districts:
        did = d.get('id','?')
        sites = d.get('sites', [])
        if not sites:
            out.append(ValidationFinding('ERROR','NO_SITE',f'{did} has no sites'))
        for vlan in d.get('vlans', []):
            try:
                net = ipaddress.ip_network(vlan['cidr'])
            except Exception:
                out.append(ValidationFinding('ERROR','BAD_CIDR',f"{did} invalid CIDR: {vlan.get('cidr')}"))
                continue
            for prior in seen_nets:
                if net.overlaps(prior):
                    out.append(ValidationFinding('ERROR','OVERLAP',f'{net} overlaps {prior}'))
            seen_nets.append(net)
    if not out:
        out.append(ValidationFinding('OK','VALID','Inventory passed structural validation'))
    return out
