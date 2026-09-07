from __future__ import annotations
from html.parser import HTMLParser
from pathlib import Path
import json, re, subprocess, sys

ROOT=Path(__file__).resolve().parents[1]
PUBLIC=[ROOT/'index.html',ROOT/'dashboard/index.html']
REQUIRED_CASES={'INC-WAN-01','INC-FILTER-01','INC-SEC-01','INC-DNS-01','INC-WIFI-01','INC-INTUNE-01'}
ALLOWED_EXTERNAL_NAV={'https://mlavoie6927.github.io/#network-engineering'}

class P(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=[]; self.refs=[]
    def handle_starttag(self,tag,attrs):
        d=dict(attrs)
        if 'id' in d:self.ids.append(d['id'])
        for k in ('src','href'):
            v=d.get(k)
            if v:self.refs.append(v)

def fail(msg):
    print('FAIL:',msg); return 1

def main():
    errors=0
    for page in PUBLIC:
        text=page.read_text(encoding='utf-8')
        p=P();p.feed(text)
        if len(p.ids)!=len(set(p.ids)): errors+=fail(f'duplicate id in {page.relative_to(ROOT)}')
        if "connect-src 'none'" not in text: errors+=fail(f'missing static boundary CSP in {page.relative_to(ROOT)}')
        for ref in p.refs:
            if ref.startswith(('#','mailto:','tel:','javascript:')): continue
            if ref.startswith(('http://','https://')):
                if ref in ALLOWED_EXTERNAL_NAV: continue
                errors+=fail(f'external public-page reference {ref} in {page.relative_to(ROOT)}'); continue
            clean=ref.split('#',1)[0].split('?',1)[0]
            if not clean: continue
            target=(page.parent/clean).resolve()
            if not target.exists(): errors+=fail(f'missing asset/link {ref} from {page.relative_to(ROOT)}')
    # required V6 files
    for rel in ['portfolio/v6.css','portfolio/v6.js','portfolio/v6-data.js','dashboard/v6.css','dashboard/v6.js','assets/previews/k12-ops-v6-card.png','assets/previews/k12-ops-v6-social.png','integration/project-card.html','docs/PORTFOLIO_INTEGRATION.md','docs/V6_DEMO_SCRIPT.md','docs/V6_EXPERIENCE_ARCHITECTURE.md']:
        if not (ROOT/rel).exists(): errors+=fail(f'missing {rel}')
    # data coverage
    inventory=json.loads((ROOT/'data/districts.json').read_text(encoding='utf-8'))
    districts=inventory.get('districts', []) if isinstance(inventory, dict) else inventory
    if len(districts)!=35: errors+=fail('district model is not 35 districts')
    if sum(len(d.get('sites',[])) for d in districts)!=70: errors+=fail('site model is not 70 sites')
    scenarios=json.loads((ROOT/'data/scenarios.json').read_text(encoding='utf-8'))
    if len(scenarios)!=20: errors+=fail('scenario model is not 20 scenarios')
    # exported case coverage
    raw=(ROOT/'portfolio/v6-data.js').read_text(encoding='utf-8')
    prefix='window.K12_V6_DATA = '
    if not raw.startswith(prefix): errors+=fail('invalid v6-data prefix')
    else:
        data=json.loads(raw[len(prefix):].rstrip().rstrip(';'))
        if set(data.get('cases',{}))!=REQUIRED_CASES: errors+=fail('v6 case export coverage mismatch')
        for cid,c in data.get('cases',{}).items():
            if len(c.get('files',{}))<3: errors+=fail(f'{cid} has too few embedded evidence artifacts')
    # dashboard required views and operator experience markers
    dash=(ROOT/'dashboard/index.html').read_text(encoding='utf-8')
    for marker in ['Shift Briefing','Regional Digital Twin','Evidence Vault','Virtual Operations Terminal','Change Control','Capacity Engineering']:
        if marker.lower() not in dash.lower(): errors+=fail(f'dashboard missing {marker}')
    # landing experience markers
    landing=(ROOT/'index.html').read_text(encoding='utf-8')
    for marker in ['scenario-switcher','heroTwin','Evidence Casebook','Operations Center','Portfolio truth boundary']:
        if marker.lower() not in landing.lower(): errors+=fail(f'landing missing {marker}')
    # JS selector sanity: all literal $('#id') references should exist in the matching page
    for js_rel,page_rel in [('portfolio/v6.js','index.html'),('dashboard/v6.js','dashboard/index.html')]:
        js=(ROOT/js_rel).read_text(encoding='utf-8'); page=(ROOT/page_rel).read_text(encoding='utf-8'); ids=set(re.findall(r'id="([^"]+)"',page))
        refs=set(re.findall(r"\$\('#([A-Za-z0-9_-]+)'\)",js))
        missing=sorted(refs-ids)
        if missing: errors+=fail(f'{js_rel} references missing ids: {missing}')
    # syntax checks
    for js_rel in ['portfolio/v6.js','dashboard/v6.js']:
        r=subprocess.run(['node','--check',str(ROOT/js_rel)],capture_output=True,text=True)
        if r.returncode: errors+=fail(f'node syntax error in {js_rel}: {r.stderr.strip()}')
    # freshness check
    r=subprocess.run([sys.executable,str(ROOT/'tools/export_v6_experience.py'),'--check'],capture_output=True,text=True)
    if r.returncode: errors+=fail(r.stderr.strip() or r.stdout.strip())
    if errors:
        raise SystemExit(errors)
    print('PASS: v6 experience validation')
    print('  35 districts / 70 sites / 20 scenarios')
    print('  6 embedded evidence-rich cases')
    print('  landing + operations center assets/IDs/CSP verified')
    print('  JavaScript syntax and generated-data freshness verified')

if __name__=='__main__': main()
