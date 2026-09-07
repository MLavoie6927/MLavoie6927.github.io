from __future__ import annotations

def _index(data: dict) -> dict[str, dict]:
    return {s['id']: s for s in data.get('services', [])}

def dependency_chain(data: dict, service_id: str) -> list[str]:
    idx=_index(data)
    if service_id not in idx:
        raise KeyError(service_id)
    out=[]; seen=set()
    def walk(sid: str):
        if sid in seen: return
        seen.add(sid)
        for dep in idx[sid].get('depends_on',[]):
            walk(dep)
        out.append(sid)
    walk(service_id)
    return out

def blast_radius(data: dict, failed_service_id: str) -> list[str]:
    idx=_index(data)
    if failed_service_id not in idx:
        raise KeyError(failed_service_id)
    impacted=[]
    for sid in idx:
        if sid == failed_service_id: continue
        if failed_service_id in dependency_chain(data,sid): impacted.append(sid)
    return sorted(impacted)

def service_summary(data: dict, service_id: str) -> dict:
    idx=_index(data); s=idx[service_id]
    return {'service':s['name'],'tier':s['tier'],'criticality':s['criticality'],'dependencies':dependency_chain(data,service_id)[:-1],'blast_radius':blast_radius(data,service_id)}
