/* Node v18+ | no npm dependencies | 2026-11-17 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.join(__dirname,'..');
const logic=require('../js/logic.js');
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'js/catalog.js'),'utf8'),sandbox,{filename:'catalog.js'});
vm.runInNewContext(fs.readFileSync(path.join(root,'js/quiz.js'),'utf8'),sandbox,{filename:'quiz.js'});
const data=sandbox.window.ATLAS_CDL_DATA;const quiz=sandbox.window.ATLAS_CDL_QUIZ;
assert.ok(data.scenarios.length>=200,'at least 200 curated records');
assert.equal(data.scenarios.length,222,'catalog version expected scenario count');
assert.equal(data.categories.reduce((n,c)=>n+c.count,0),data.scenarios.length);
assert.equal(new Set(data.scenarios.map(s=>s.id)).size,data.scenarios.length);
for(const s of data.scenarios){assert.ok(data.categories.some(c=>c.id===s.category),s.id+' missing category');assert.ok(['low','medium','high','critical'].includes(s.severity));for(const k of ['title','situation','action','driver','coordination','unsafe','source'])assert.ok(s[k].length>10,s.id+' missing '+k);assert.ok(/^https:\/\//.test(s.source));}
assert.equal(quiz.length,24);assert.equal(new Set(quiz.map(x=>x.id)).size,quiz.length);for(const q of quiz){assert.ok(q.choices.length>=3);assert.ok(Number.isInteger(q.correct)&&q.correct>=0&&q.correct<q.choices.length);assert.ok(q.why.length>=25);}
const p={heightFt:13,heightIn:6,widthFt:8,widthIn:6,lengthFt:73,grossLb:78000,hazmat:false};
function evaluate(restriction,profile=p){return logic.checkFit({profile,restriction});}
assert.equal(evaluate({clearanceFt:12,clearanceIn:6}).status,'STOP','low bridge must block');
assert.equal(evaluate({clearanceFt:13,clearanceIn:6}).status,'STOP','equal clearance must block');
assert.equal(evaluate({clearanceFt:14,clearanceIn:0}).status,'VERIFY','passing dimension alone is not route approval');
assert.equal(evaluate({maxLengthFt:35}).status,'STOP','overlength must block');
assert.equal(evaluate({maxGrossLb:75000}).status,'STOP','overweight must block');
assert.equal(evaluate({maxWidthFt:8,maxWidthIn:0}).status,'STOP','overwidth must block');
assert.equal(evaluate({noTrucks:true}).status,'STOP','truck exclusion must block');
assert.equal(evaluate({hazmatBan:true},{...p,hazmat:true}).status,'STOP','hazmat ban must block hazmat truck');
assert.equal(evaluate({hazmatBan:true},{...p,hazmat:false}).status,'VERIFY','non hazmat not automatically blocked by hazmat ban');
assert.equal(evaluate({}).status,'VERIFY','unknown restrictions cannot be approved');
assert.equal(evaluate({clearanceFt:14,clearanceIn:0},{...p,heightIn:12}).status,'INVALID','bad inches invalidates input');
assert.equal(evaluate({}, {...p,grossLb:0}).status,'INVALID','nonpositive weight invalid');
assert.equal(logic.ftInToInches(13,6),162);
assert.equal(logic.ftInToInches(0,0),null);
assert.equal(logic.filterScenarios(data.scenarios,{q:'bridge',category:'all',severity:'all'}).every(x=>[x.title,x.situation,x.action,x.basis].join(' ').toLowerCase().includes('bridge')),true);
assert.ok(logic.filterScenarios(data.scenarios,{category:'R',severity:'critical'}).length>0);
assert.equal(logic.validateReport({location:'Route 14',description:'Posted low overhead bridge',evidence:'unverified'}).length,0);
assert.ok(logic.validateReport({location:'X',description:'unsafe',evidence:'fake'}).length>0);
assert.ok(logic.fmtCSV([{location:'A,"B"',description:'x\ny'}],['location','description']).includes('"A,""B"""'));
console.log(`PASS | ${data.scenarios.length} scenarios | ${data.categories.length} categories | ${quiz.length} drills | clearance and report validators`);
