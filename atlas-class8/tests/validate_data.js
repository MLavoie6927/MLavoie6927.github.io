/* ATLAS Class 8 data-integrity tests | 2026-11-14 | Marc Lavoie */
'use strict';
const fs=require('node:fs');const vm=require('node:vm');const path=require('node:path');const assert=require('node:assert/strict');
const root=path.join(__dirname,'..');const environment={window:{}};
for(const name of ['catalog','training-data','blueprints','component-art'])vm.runInNewContext(fs.readFileSync(path.join(root,'js',`${name}.js`),'utf8'),environment,{filename:name+'.js'});
const {ZONES,PARTS,FLUIDS}=environment.window.LAB_DATA;
const T=environment.window.ATLAS_TRAINING;
const idSet=new Set(PARTS.map(p=>p.id)),zoneSet=new Set(ZONES.map(z=>z.id));
assert.equal(PARTS.length,117,'v1 part catalog retained');
assert.equal(ZONES.length,29,'all 29 clickable zones retained');
assert.equal(FLUIDS.length,10,'fluid reference dataset retained');
assert.equal(idSet.size,PARTS.length,'unique component IDs');
assert.equal(zoneSet.size,ZONES.length,'unique zone IDs');
for(const p of PARTS){assert(zoneSet.has(p.zone),`part ${p.id} has a valid zone`);assert(p.partsMin<=p.partsMax,`part ${p.id} price range`);assert(p.hoursMin<=p.hoursMax,`part ${p.id} hours range`);assert(p.wear&&p.replace&&p.inspection,`part ${p.id} has inspection text`);}
assert.equal(Object.keys(T.SYSTEMS).length,5);
for(const [id,system] of Object.entries(T.SYSTEMS)){
 assert.equal(system.nodes.length,6,`${id} has six steps`);
 for(const n of system.nodes)assert(idSet.has(n[3]),`blueprint ${id} missing part reference ${n[3]}`);
 for(const [a,b] of system.connections)assert(a>=0&&a<6&&b>=0&&b<6,`${id} node links valid`);
}
assert.equal(T.SCENARIOS.length,8);assert.equal(T.INSPECTION_STATIONS.length,18);assert.equal(T.SERVICE_ITEMS.length,12);assert.equal(T.QUIZ.length,15);
for(const x of T.SCENARIOS){assert(idSet.has(x.part),`scenario ${x.id} linked to a part`);assert(x.answer>=0&&x.answer<x.choices.length);}
for(const q of T.QUIZ)assert(q.answer>=0&&q.answer<q.options.length);
console.log('PASS: 117 unique parts, 29 zones, 10 fluids');
console.log('PASS: 5 system diagrams / 30 valid component node references');
console.log('PASS: 8 diagnosis cases / 18 inspections / 12 service items / 15 quiz questions');
console.log('PASS: component pricing, hours, descriptions and cross-references valid');
