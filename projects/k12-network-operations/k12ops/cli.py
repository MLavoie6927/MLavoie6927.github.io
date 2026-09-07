from __future__ import annotations
import argparse, json
from .io import load_json
from .validate import validate_inventory
from .triage import triage_scenario
from .health import calculate_health
from .report import operations_report
from .dependencies import service_summary
from .drift import analyze_drift
from .capacity import regional_forecast
from .sla import analyze_sla
from .changes import score_change
from .telemetry import summarize_telemetry
from .evidence import build_evidence_bundle

def main() -> int:
    parser=argparse.ArgumentParser(prog='k12ops',description='Synthetic K-12 operations engineering CLI')
    sub=parser.add_subparsers(dest='cmd',required=True)
    p=sub.add_parser('validate'); p.add_argument('--inventory',required=True)
    p=sub.add_parser('health'); p.add_argument('--inventory',required=True); p.add_argument('--tickets')
    p=sub.add_parser('triage'); p.add_argument('--scenario',required=True); p.add_argument('--id',required=True)
    p=sub.add_parser('report'); p.add_argument('--inventory',required=True); p.add_argument('--tickets',required=True)
    p=sub.add_parser('dependencies'); p.add_argument('--services',required=True); p.add_argument('--service',required=True)
    p=sub.add_parser('drift'); p.add_argument('--baseline',required=True); p.add_argument('--snapshots',required=True)
    p=sub.add_parser('capacity'); p.add_argument('--history',required=True); p.add_argument('--top',type=int,default=10)
    p=sub.add_parser('sla'); p.add_argument('--tickets',required=True)
    p=sub.add_parser('change-risk'); p.add_argument('--changes',required=True); p.add_argument('--id')
    p=sub.add_parser('telemetry'); p.add_argument('--telemetry',required=True)
    p=sub.add_parser('bundle'); p.add_argument('--case-dir',required=True); p.add_argument('--output',required=True)
    a=parser.parse_args()
    if a.cmd=='validate':
        findings=validate_inventory(load_json(a.inventory)); [print(f'[{f.level}] {f.code}: {f.message}') for f in findings]; return 1 if any(f.level=='ERROR' for f in findings) else 0
    if a.cmd=='health':
        h=calculate_health(load_json(a.inventory),load_json(a.tickets) if a.tickets else []); print(json.dumps(h.__dict__,indent=2)); return 0
    if a.cmd=='triage':
        r=triage_scenario(load_json(a.scenario),a.id); print(json.dumps(r.__dict__,indent=2)); return 0
    if a.cmd=='report': print(operations_report(load_json(a.inventory),load_json(a.tickets)),end=''); return 0
    if a.cmd=='dependencies': print(json.dumps(service_summary(load_json(a.services),a.service),indent=2)); return 0
    if a.cmd=='drift': print(json.dumps(analyze_drift(load_json(a.baseline),load_json(a.snapshots)),indent=2)); return 0
    if a.cmd=='capacity': print(json.dumps(regional_forecast(load_json(a.history))[:a.top],indent=2)); return 0
    if a.cmd=='sla': print(json.dumps(analyze_sla(load_json(a.tickets)),indent=2)); return 0
    if a.cmd=='change-risk':
        changes=load_json(a.changes); rows=[c for c in changes if not a.id or c.get('id')==a.id]; print(json.dumps([dict(c,analysis=score_change(c)) for c in rows],indent=2)); return 0
    if a.cmd=='telemetry': print(json.dumps(summarize_telemetry(load_json(a.telemetry)),indent=2)); return 0
    if a.cmd=='bundle': print(json.dumps(build_evidence_bundle(a.case_dir,a.output),indent=2)); return 0
    return 2
if __name__=='__main__': raise SystemExit(main())
