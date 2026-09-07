from __future__ import annotations

def compare_device(device: dict, required: dict) -> list[dict]:
    findings=[]
    for key, expected in required.items():
        actual=device.get(key)
        if actual != expected:
            severity='HIGH' if key in {'student_to_mgmt','guest_to_internal','ssh_source'} else 'MEDIUM'
            findings.append({'device':device.get('device','unknown'),'key':key,'expected':expected,'actual':actual,'severity':severity})
    return findings

def analyze_drift(baseline: dict, snapshots: dict) -> dict:
    req=baseline.get('required',{})
    findings=[]
    for device in snapshots.get('devices',[]): findings.extend(compare_device(device,req))
    total=len(snapshots.get('devices',[]))
    compliant=sum(1 for d in snapshots.get('devices',[]) if not compare_device(d,req))
    score=round(100*compliant/total) if total else 100
    return {'devices':total,'compliant_devices':compliant,'score':score,'findings':findings}
