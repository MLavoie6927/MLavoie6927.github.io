#!/usr/bin/env python3
"""Generate portable full-text answer key and CSV for Codex import. Marc Lavoie, 2026-11-14."""
import pathlib,json,csv,collections
root=pathlib.Path(__file__).parent
bank=json.loads((root/'data/questions.json').read_text('utf8'))
questions=bank['questions']
sections=list(dict.fromkeys(q['section'] for q in questions))
lines=['# ATLAS CDL Exam Academy — 300 original questions, answers and explanations','',
       '**Prepared for:** Marc Lavoie · **Date:** November 14, 2026 · **Version:** 1.0','',
       '> These are original exam-style practice items. They are **not exact official state CDL test questions**, and no guarantee of passing is made. Each question has four choices and one provided correct answer. Verify current state/manual and vehicle-specific requirements.','',
       '## Question counts','',
       '| Subject | Questions |','|---|---:|']
for sec in sections:
    lines.append(f'| {sec} | {sum(q["section"]==sec for q in questions)} |')
lines.extend(['| **TOTAL** | **300** |','','---',''])
for sec in sections:
    lines.extend([f'## {sec}', ''])
    for i,q in enumerate([q for q in questions if q['section']==sec],1):
        lines.extend([f'### {sec} {i}. {q["question"]}',f'*Topic: {q["topic"]} · Reference: {q["sourceId"]} · ID: `{q["id"]}`*',''])
        for j,o in enumerate(q['options']):lines.append(f'- **{chr(65+j)}.** {o}')
        lines.extend(['',f'**Correct answer: {chr(65+q["answer"])} — {q["options"][q["answer"]]}**','',f'**Explanation:** {q["explanation"]}','',''])
(root/'ALL_QUESTIONS_AND_ANSWERS.md').write_text('\n'.join(lines),encoding='utf8')
with (root/'data/questions.csv').open('w',newline='',encoding='utf8') as f:
    w=csv.writer(f);w.writerow(['id','section','topic','question','A','B','C','D','correct_letter','correct_answer','explanation','source_id','review_status'])
    for q in questions:w.writerow([q['id'],q['section'],q['topic'],q['question'],*q['options'],chr(65+q['answer']),q['options'][q['answer']],q['explanation'],q['sourceId'],q['reviewStatus']])
print('Wrote',root/'ALL_QUESTIONS_AND_ANSWERS.md', 'and data/questions.csv')
