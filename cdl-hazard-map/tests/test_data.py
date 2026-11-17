"""Validate offline map records; no network access required."""
import json
from pathlib import Path
from urllib.parse import urlparse
ROOT=Path(__file__).resolve().parents[1]
hazards=json.loads((ROOT/'assets/data/hazards.json').read_text())
geo=json.loads((ROOT/'assets/data/us-state-geometry.json').read_text())
states={s['abbr'] for s in geo['states']}
assert len(states)==51, f'Missing state geometry {len(states)}'
assert len(hazards)==80
assert len({h['id'] for h in hazards})==len(hazards)
assert {h['state'] for h in hazards}==states
assert sum(h['status']=='official' for h in hazards)==30
assert sum(h['status']=='illustrative' for h in hazards)==50
assert all(h['category'] in {'access','clearance','geometry','weather','weight','hazmat','facility'} for h in hazards)
for h in hazards:
    assert isinstance(h['x'],(int,float)) and 0<=h['x']<=1250,h
    assert isinstance(h['y'],(int,float)) and 0<=h['y']<=790,h
    assert h['summary'] and h['action']
    if h['status']=='official':
        url=urlparse(h['url'])
        assert url.scheme=='https' and url.hostname, h
        assert h['source'] and 'illustrative' not in h['kind'].lower()
    else:
        assert not h['url'] and 'Illustrative' in h['kind']
print('PASS: 80 distinct entries, all 50 states + DC, 30 sourced items, 50 separate editorial planning zones, complete categories and map coordinates')
