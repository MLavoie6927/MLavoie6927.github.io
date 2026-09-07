#!/usr/bin/env python3
from __future__ import annotations
from pathlib import Path
import argparse, json, sys
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
from k12ops.sla import analyze_sla
from k12ops.drift import analyze_drift
from k12ops.capacity import regional_forecast
from k12ops.telemetry import summarize_telemetry
from k12ops.health import calculate_health

def build() -> str:
    inv=json.loads((ROOT/'data/districts.json').read_text(encoding='utf-8'))
    tickets=json.loads((ROOT/'data/tickets.json').read_text(encoding='utf-8'))
    sla=analyze_sla(tickets)
    drift=analyze_drift(json.loads((ROOT/'configs/compliance/baseline.json').read_text(encoding='utf-8')),json.loads((ROOT/'data/config_snapshots.json').read_text(encoding='utf-8')))
    cap=regional_forecast(json.loads((ROOT/'data/capacity_history.json').read_text(encoding='utf-8')))
    tele=summarize_telemetry(json.loads((ROOT/'data/telemetry.json').read_text(encoding='utf-8')))
    health=calculate_health(inv,tickets)
    watch=[x for x in cap if x['risk']!='NORMAL'][:10]
    s=f'''# Generated Enterprise Operations Report\n\n> All values are synthetic portfolio data.\n\n## Executive status\n\n- Regional health score: **{health.score}/100**\n- Districts: **{health.districts}**\n- Sites: **{health.sites}**\n- Modeled assets: **{health.devices:,}**\n- Open tickets: **{health.open_tickets}**\n- First-response SLA attainment: **{sla['response_attainment_pct']}%**\n- Restore SLA attainment (closed tickets): **{sla['restore_attainment_pct']}%**\n- Sample configuration compliance: **{drift['score']}%**\n- Configuration drift findings: **{len(drift['findings'])}**\n- Telemetry samples: **{tele['samples']}**\n- Maximum injected packet loss: **{tele['max_packet_loss_pct']}%**\n\n## Capacity watchlist\n\n| District | Current P95 | Three-month projection | Risk |\n|---|---:|---:|---|\n'''
    for x in watch: s+=f"| {x['district']} | {x['current_p95_pct']}% | {x['forecast_p95_pct'][-1]}% | {x['risk']} |\n"
    s+='''\n## Assurance findings\n\n| Device | Control | Severity | Expected | Actual |\n|---|---|---|---|---|\n'''
    for f in drift['findings']: s+=f"| {f['device']} | {f['key']} | {f['severity']} | `{f['expected']}` | `{f['actual']}` |\n"
    s+='''\n## Interpretation\n\nThe synthetic environment intentionally contains imperfect states. A useful operations portfolio should demonstrate how faults, SLA misses, and configuration drift are detected, prioritized, changed, verified, and documented—not present a frictionless fictional network in which every control is already perfect.\n'''
    return s

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--check',action='store_true'); args=ap.parse_args()
    out=ROOT/'reports/enterprise-operations-report.md'; expected=build()
    if args.check:
        if not out.exists() or out.read_text(encoding='utf-8')!=expected:
            raise SystemExit('enterprise report is stale; run tools/generate_enterprise_report.py')
        print('enterprise report current')
    else:
        out.write_text(expected,encoding='utf-8'); print(out)
if __name__=='__main__': main()
