from __future__ import annotations
SLA={'P1':{'response':15,'restore':120},'P2':{'response':30,'restore':240},'P3':{'response':120,'restore':480},'P4':{'response':240,'restore':1440}}

def analyze_sla(tickets: list[dict]) -> dict:
    rows=[]
    for t in tickets:
        target=SLA.get(t.get('severity'),SLA['P4'])
        response=t.get('first_response_minutes')
        restore=t.get('restore_minutes')
        rows.append({
          'ticket_id':t.get('ticket_id'),'severity':t.get('severity'),
          'response_met': response is not None and response <= target['response'],
          'restore_met': None if restore is None else restore <= target['restore'],
          'response_minutes':response,'restore_minutes':restore,
          'response_target':target['response'],'restore_target':target['restore']
        })
    closed=[r for r in rows if r['restore_met'] is not None]
    resp=sum(r['response_met'] for r in rows)
    rest=sum(r['restore_met'] for r in closed)
    return {'tickets':len(rows),'response_attainment_pct':round(100*resp/len(rows),1) if rows else 100.0,'restore_attainment_pct':round(100*rest/len(closed),1) if closed else 100.0,'rows':rows}
