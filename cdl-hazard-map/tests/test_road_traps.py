"""Official-source road-profile dataset and safe-profile logic fixture checks.
The data is intentionally NOT a road centerline or live navigation product.
"""
from pathlib import Path
from urllib.parse import urlparse
import json
R=Path(__file__).resolve().parents[1]
a=json.loads((R/'assets/data/road-traps.json').read_text())
assert len(a)==30
assert len({r['id'] for r in a})==30
assert len({r['state'] for r in a})==15
assert {'access','clearance','geometry','weather','weight','hazmat'}<=set(r['category'] for r in a)
for r in a:
    assert r['id'].startswith('GPS-') and r['restriction'] and r['action'] and r['why']
    assert r['authority'] and r['verifiedOn']=='2026-11-17' and r['classification']=='sourced'
    u=urlparse(r['url']);assert u.scheme=='https' and u.netloc
    assert 0<=r['x']<=1250 and 0<=r['y']<=790
    assert len(r['trace'])==2 and all(len(v)==2 for v in r['trace'])
    if r['rule'] in ('length','weight','kpra','registration'): assert r['limit']>0
    else:assert r['limit'] is None
print('PASS: 30 distinct sourced named-road profiles; 15 states; source URLs, categories, rule types and geographic anchors valid')
