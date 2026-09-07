from __future__ import annotations
import json
from pathlib import Path

def build_evidence_bundle(case_dir: str|Path, output: str|Path) -> dict:
    case=Path(case_dir); out=Path(output); out.mkdir(parents=True,exist_ok=True)
    copied=[]
    for p in sorted(case.rglob('*')):
        if p.is_file():
            rel=p.relative_to(case); dest=out/rel; dest.parent.mkdir(parents=True,exist_ok=True); dest.write_bytes(p.read_bytes()); copied.append(str(rel))
    manifest={'case':case.name,'files':copied,'synthetic':True}
    (out/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
    return manifest
