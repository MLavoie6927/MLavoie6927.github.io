#!/usr/bin/env python3
"""Offline validation for the static portfolio and synthetic case-study layer."""
from __future__ import annotations
from pathlib import Path
import json, re, sys, xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parents[1]
errors=[]

def fail(msg): errors.append(msg)

def require(path: Path):
    if not path.exists(): fail(f"missing: {path.relative_to(ROOT)}")

# Core data
try:
    districts=json.loads((ROOT/'data/districts.json').read_text(encoding='utf-8'))['districts']
    if len(districts)!=35: fail(f"expected 35 districts, found {len(districts)}")
    ids=[d['id'] for d in districts]
    if len(set(ids))!=len(ids): fail('duplicate district IDs')
    required_vlans={10,20,30,40,50,60}
    for d in districts:
        vids={v['id'] for v in d.get('vlans',[])}
        if vids!=required_vlans: fail(f"{d['id']} VLAN set {sorted(vids)} != {sorted(required_vlans)}")
        if len(d.get('sites',[]))!=2: fail(f"{d['id']} expected 2 sites")
except Exception as e: fail(f"district inventory parse/validation: {e}")

for name,expected in [('scenarios.json',20),('tickets.json',20)]:
    try:
        data=json.loads((ROOT/'data'/name).read_text(encoding='utf-8'))
        if len(data)!=expected: fail(f"{name}: expected {expected}, found {len(data)}")
    except Exception as e: fail(f"{name}: {e}")

# Enterprise operations datasets
for r in ['data/services.json','data/changes.json','data/telemetry.json','data/capacity_history.json','data/config_snapshots.json','configs/compliance/baseline.json']:
    require(ROOT/r)

# Required presentation assets
required=[
 'index.html','portfolio/index.html','portfolio/styles.css','portfolio/data.js','portfolio/script.js',
 'dashboard/index.html','dashboard/styles.css','dashboard/script.js','case-studies/README.md',
 'docs/PORTFOLIO_PRESENTATION.md','docs/JOB_REQUIREMENT_MAPPING.md','docs/OPERATIONS_ENGINEERING.md','docs/CONFIGURATION_COMPLIANCE.md','docs/SERVICE_DEPENDENCY_MANAGEMENT.md',
 'assets/portfolio/hero-network.svg','assets/portfolio/architecture-stack.svg',
 'assets/portfolio/segmentation-control-plane.svg','assets/portfolio/wan-case-study.svg',
 'assets/portfolio/identity-service-dependency.svg','assets/portfolio/operations-evidence-loop.svg'
]
for r in required: require(ROOT/r)

# SVG parse + PNG pair
for svg in sorted((ROOT/'assets/portfolio').glob('*.svg')):
    try: ET.parse(svg)
    except Exception as e: fail(f"invalid SVG {svg.name}: {e}")
    require(ROOT/'assets/portfolio/png'/f'{svg.stem}.png')

# Featured case evidence
case_requirements={
 'INC-WAN-01':['README.md','evidence/client-tests.txt','evidence/traceroute.txt','evidence/edge-interface.txt','evidence/snmp-alert.json','escalation.md','closure.md'],
 'INC-FILTER-01':['README.md','evidence/filter-event.json','evidence/service-tests.txt','evidence/dependencies.csv','change-record.md','validation.txt'],
 'INC-SEC-01':['README.md','evidence/acl-before.txt','evidence/security-event.json','evidence/acl-after.txt','validation.txt','incident-report.md'],
 'INC-DNS-01':['README.md','evidence/event.json','evidence/diagnostics.txt','validation.txt'],
 'INC-WIFI-01':['README.md','evidence/event.json','evidence/diagnostics.txt','validation.txt'],
 'INC-INTUNE-01':['README.md','evidence/event.json','evidence/diagnostics.txt','validation.txt']}
for case,items in case_requirements.items():
    for item in items: require(ROOT/'case-studies'/case/item)

# JSON evidence parse
for p in (ROOT/'case-studies').glob('*/evidence/*.json'):
    try:
        d=json.loads(p.read_text(encoding='utf-8'))
        if d.get('synthetic') is not True: fail(f"evidence JSON not explicitly synthetic: {p.relative_to(ROOT)}")
    except Exception as e: fail(f"invalid evidence JSON {p.relative_to(ROOT)}: {e}")

# Static links in HTML. Skip anchors, remote URLs, and links intended for GitHub markdown viewers.
attr_re=re.compile(r'''(?:href|src)=["']([^"']+)["']''',re.I)
for html in [ROOT/'index.html',ROOT/'portfolio/index.html',ROOT/'dashboard/index.html']:
    text=html.read_text(encoding='utf-8')
    base=html.parent
    for target in attr_re.findall(text):
        if target.startswith(('#','http:','https:','mailto:','tel:','data:','javascript:')): continue
        clean=target.split('#',1)[0].split('?',1)[0]
        if not clean: continue
        resolved=(base/clean).resolve()
        try: resolved.relative_to(ROOT.resolve())
        except ValueError: fail(f"path escapes repository in {html.relative_to(ROOT)}: {target}"); continue
        if not resolved.exists(): fail(f"broken link in {html.relative_to(ROOT)}: {target}")

# Required portfolio sections + truth labeling
ptext=(ROOT/'portfolio/index.html').read_text(encoding='utf-8').lower()
for sid in ['architecture','case-studies','tooling','security','proof','interview']:
    if f'id="{sid}"' not in ptext: fail(f"portfolio missing section #{sid}")
if 'synthetic' not in ptext or 'no production credentials' not in ptext:
    fail('portfolio must explicitly label synthetic data and no production credentials')

# JavaScript basic sanity: expected data namespace and no remote dependency fetch.
for js in [ROOT/'portfolio/script.js',ROOT/'dashboard/script.js']:
    t=js.read_text(encoding='utf-8')
    if 'PORTFOLIO_DATA' not in t: fail(f"{js.name} missing portfolio data namespace")
    if re.search(r'fetch\s*\(\s*["\']https?://',t): fail(f"remote fetch found in {js.relative_to(ROOT)}")

if errors:
    print('PORTFOLIO VALIDATION: FAIL')
    for e in errors: print(' -',e)
    sys.exit(1)
print('PORTFOLIO VALIDATION: PASS')
print(f' - districts: 35')
print(f' - scenarios: 20')
print(f' - featured cases: {len(case_requirements)}')
print(f' - portfolio SVGs: {len(list((ROOT/"assets/portfolio").glob("*.svg")))}')
print(' - static links/assets: verified')
print(' - synthetic/safe-lab labeling: verified')
