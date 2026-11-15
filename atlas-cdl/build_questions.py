#!/usr/bin/env python3
"""Build and validate original ATLAS CDL exam-style study questions.
Author: Marc Lavoie, 2026-11-14. Maintained as a human-reviewable question source.
"""
import json,random,re,pathlib,collections,hashlib
ROOT=pathlib.Path(__file__).parent
raw=(ROOT/'data/questions-source.txt').read_text(encoding='utf8')
items=[]; sec=topic=ref=None
for num,line in enumerate(raw.splitlines(),1):
    s=line.strip()
    if not s or s.startswith('#'): continue
    if s.startswith('@@ '):
        parts=s[3:].split(' :: ')
        if len(parts)!=3: raise ValueError(f'Bad header at {num}: {s}')
        sec,topic,ref=parts
        continue
    fields=[x.strip() for x in s.split('|')]
    if len(fields)!=6: raise ValueError(f'Question at line {num}: {len(fields)} fields, expected 6')
    if not all(fields) or not sec: raise ValueError(f'Blank at {num}')
    stem,correct,*rest=fields
    wrongs=rest[:3]
    why=rest[3]
    if len(set(x.lower() for x in [correct]+wrongs)) != 4: raise ValueError(f'Duplicate options at line {num}')
    opts=[correct]+wrongs
    rng=random.Random(num*20261114)
    rng.shuffle(opts)
    ident=f"{dict(general='GK',cargo='CG',air='AB',combination='CV',doubles='DT',tank='TK',hazmat='HM',passenger='PS',school='SB',inspection='VI')[sec.lower().split()[0]]}-{hashlib.sha256(stem.casefold().encode()).hexdigest()[:10]}"
    items.append({'id':ident,'section':sec,'topic':topic,'question':stem,'options':opts,'answer':opts.index(correct),'explanation':why,'sourceId':ref,'original':True,'reviewStatus':'author_review_required'})
if len({i['question'].casefold() for i in items})!=len(items):
    counts=collections.Counter(i['question'].casefold() for i in items)
    raise ValueError('Repeated stems: '+str([s for s,n in counts.items() if n>1]))
for i in items:
    if not (0<=i['answer']<4): raise ValueError(i['id'])
    if len(i['question'])<25 or len(i['explanation'])<20: raise ValueError('Short stem/explanation '+i['id'])
meta={'title':'ATLAS CDL Exam Academy · Original Practice Bank','version':'1.0.0','updated':'2026-11-14','author':'Marc Lavoie','license':'Original educational content; official CDL manuals remain third-party copyrighted works. Do not represent these as authentic DMV questions.','notice':'Practice only; confirm state manual and current vehicle-specific inspection requirements. The author has not independently validated every question with an official examiner.','questions':items}
(ROOT/'data/questions.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
(ROOT/'data/questions.js').write_text('/* Original CDL practice questions. Maintainer: Marc Lavoie, 2026-11-14. */\nwindow.ATLAS_CDL_BANK = '+json.dumps(meta,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf8')
summary=collections.Counter(i['section'] for i in items)
print('Generated',len(items),'original questions:',dict(summary))
