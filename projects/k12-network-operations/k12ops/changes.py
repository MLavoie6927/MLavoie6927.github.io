from __future__ import annotations
WEIGHT={'Low':1,'Medium':2,'High':3}

def score_change(change: dict) -> dict:
    base=WEIGHT.get(change.get('risk','Medium'),2)*20
    if not change.get('rollback'): base+=20
    if len(change.get('validation',[]))<2: base+=15
    if len(change.get('approvals',[]))<1: base+=20
    score=min(100,base)
    level='HIGH' if score>=70 else 'MEDIUM' if score>=40 else 'LOW'
    return {'id':change.get('id'),'score':score,'level':level,'ready':bool(change.get('rollback') and change.get('validation') and change.get('approvals'))}
