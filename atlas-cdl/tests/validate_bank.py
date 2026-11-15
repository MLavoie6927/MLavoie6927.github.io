#!/usr/bin/env python3
"""ATLAS CDL question bank structural validator. Author Marc Lavoie 2026-11-14."""
import json, collections, pathlib, re, sys
root=pathlib.Path(__file__).resolve().parents[1]
data=json.loads((root/'data/questions.json').read_text('utf8'))
questions=data['questions']
assert data['version']=='1.0.0'
assert len(questions)==300, f'Expected 300, got {len(questions)}'
assert len({q['id'] for q in questions})==300
assert len({q['question'].lower() for q in questions})==300
expected={'General':77,'Cargo':25,'Air':49,'Combination':38,'Doubles':15,'Tank':15,'Hazmat':25,'Passenger':18,'School':18,'Inspection':20}
assert dict(collections.Counter(q['section'] for q in questions))==expected
for q in questions:
    assert all(k in q for k in ('id','section','topic','question','options','answer','explanation','sourceId','original','reviewStatus'))
    assert q['original'] is True
    assert q['reviewStatus']=='author_review_required'
    assert 0 <= q['answer'] <=3 and len(q['options'])==4
    assert len(set(o.strip().lower() for o in q['options']))==4
    assert len(q['explanation'])>=20 and len(q['question'])>=25
    assert len(q['topic'])>=5 and q['sourceId']
    assert re.fullmatch('[A-Z]{2}-[0-9a-f]{10}',q['id'])
print('PASS: 300 unique original practice questions; correct option indices and required fields present.')
print('Breakdown:', dict(collections.Counter(q['section'] for q in questions)))
print('WARNING: Structural tests are not a substitute for instructor-level legal/content review.')
