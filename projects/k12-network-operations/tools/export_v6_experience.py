from __future__ import annotations
import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CASES = ["INC-WAN-01","INC-FILTER-01","INC-SEC-01","INC-DNS-01","INC-WIFI-01","INC-INTUNE-01"]

def read_text(p: Path) -> str:
    return p.read_text(encoding="utf-8", errors="replace")

def build_text() -> str:
    scenarios = {x["id"]: x for x in json.loads((ROOT / "data/scenarios.json").read_text(encoding="utf-8"))}
    tickets = {x["ticket_id"]: x for x in json.loads((ROOT / "data/tickets.json").read_text(encoding="utf-8"))}
    payload: dict[str, object] = {"cases": {}, "version": "6.0"}
    for cid in CASES:
        case_dir = ROOT / "case-studies" / cid
        meta = scenarios.get(cid, {})
        ticket = tickets.get(cid, {})
        files = {}
        for p in sorted(case_dir.rglob("*")):
            if p.is_file() and p.suffix.lower() in {".md", ".txt", ".json", ".csv", ".log"}:
                files[p.relative_to(case_dir).as_posix()] = read_text(p)
        payload["cases"][cid] = {
            "id": cid,
            "severity": meta.get("severity") or ticket.get("severity") or "P3",
            "summary": meta.get("summary") or ticket.get("summary") or cid,
            "fault_domain": meta.get("fault_domain") or ticket.get("fault_domain") or "Unknown",
            "escalation": meta.get("escalation", "Remediate or escalate at the isolated fault boundary."),
            "actions": meta.get("actions", []),
            "evidence": meta.get("evidence", []),
            "files": files,
        }
    return "window.K12_V6_DATA = " + json.dumps(payload, indent=2) + ";\n"

def main() -> None:
    ap=argparse.ArgumentParser()
    ap.add_argument('--check',action='store_true')
    args=ap.parse_args()
    out=ROOT/'portfolio/v6-data.js'
    expected=build_text()
    if args.check:
        actual=out.read_text(encoding='utf-8') if out.exists() else ''
        if actual != expected:
            raise SystemExit('portfolio/v6-data.js is stale; run python tools/export_v6_experience.py')
        print('v6 evidence export is current')
        return
    out.write_text(expected,encoding='utf-8')
    print(f"wrote {out.relative_to(ROOT)} with {len(CASES)} evidence-rich cases")

if __name__ == '__main__':
    main()
