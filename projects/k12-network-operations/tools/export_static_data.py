#!/usr/bin/env python3
from pathlib import Path
import argparse, json
ROOT=Path(__file__).resolve().parents[1]

def build() -> str:
    p=ROOT/'portfolio/data.js'
    text=p.read_text(encoding='utf-8')
    marker='\nwindow.ENTERPRISE_DATA = '
    base=text.split(marker,1)[0]
    raw=base[len('window.PORTFOLIO_DATA = '):].strip().rstrip(';')
    D=json.loads(raw)
    D['districts']=json.loads((ROOT/'data/districts.json').read_text(encoding='utf-8'))['districts']
    D['tickets']=json.loads((ROOT/'data/tickets.json').read_text(encoding='utf-8'))
    D['scenarios']=json.loads((ROOT/'data/scenarios.json').read_text(encoding='utf-8'))
    E={
        'services':json.loads((ROOT/'data/services.json').read_text(encoding='utf-8'))['services'],
        'changes':json.loads((ROOT/'data/changes.json').read_text(encoding='utf-8')),
        'telemetry':json.loads((ROOT/'data/telemetry.json').read_text(encoding='utf-8'))['samples'],
        'capacity':json.loads((ROOT/'data/capacity_history.json').read_text(encoding='utf-8'))['districts'],
        'configSnapshots':json.loads((ROOT/'data/config_snapshots.json').read_text(encoding='utf-8'))['devices'],
    }
    return 'window.PORTFOLIO_DATA = '+json.dumps(D,indent=2)+';\n'+marker+json.dumps(E,separators=(',',':'))+';\n'

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--check',action='store_true')
    args=ap.parse_args()
    p=ROOT/'portfolio/data.js'
    expected=build()
    if args.check:
        if not p.exists() or p.read_text(encoding='utf-8')!=expected:
            raise SystemExit('portfolio/data.js is stale; run tools/export_static_data.py')
        print('portfolio/data.js current')
    else:
        p.write_text(expected,encoding='utf-8')
        print(p)

if __name__=='__main__': main()
