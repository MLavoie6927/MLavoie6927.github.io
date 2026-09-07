from __future__ import annotations

def summarize_telemetry(data: dict, warn_util: float=80.0, warn_loss: float=2.0) -> dict:
    samples=data.get('samples',[])
    if not samples: return {'samples':0,'max_utilization_pct':0,'max_packet_loss_pct':0,'alerts':[]}
    maxu=max(float(s.get('wan_utilization_pct',0)) for s in samples)
    maxl=max(float(s.get('packet_loss_pct',0)) for s in samples)
    alerts=[]
    for s in samples:
        if float(s.get('packet_loss_pct',0))>=warn_loss:
            alerts.append({'timestamp':s['timestamp'],'type':'PACKET_LOSS','value':s['packet_loss_pct']})
        elif float(s.get('wan_utilization_pct',0))>=warn_util:
            alerts.append({'timestamp':s['timestamp'],'type':'WAN_UTILIZATION','value':s['wan_utilization_pct']})
    return {'samples':len(samples),'max_utilization_pct':maxu,'max_packet_loss_pct':maxl,'alerts':alerts}
