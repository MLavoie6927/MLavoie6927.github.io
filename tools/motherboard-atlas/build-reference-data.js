/* Marc Lavoie | 2026-11-13 | extract checked v3 motherboard profiles into reference datasets. */
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'motherboard-binary.js'),'utf8');
const match=source.match(/const profiles = (\[[\s\S]*?\]);\nconst pathSteps/);
if(!match)throw Error('Could not locate v3 profile dataset');
const original=Function('return '+match[1])();
const roleMap={
 'cpu-socket':'Passive board interface','vrm':'Power regulation and digital control','eps':'Passive power connector',
 'dimm':'Memory storage and memory interface','chipset':'Protocol and device controller','pcie-x16':'Passive high-speed interconnect','pcie-x1':'Passive high-speed interconnect',
 'm2':'Passive high-speed interconnect','m2-secondary':'Passive high-speed interconnect','sata':'Passive high-speed interconnect','atx24':'Passive power connector',
 'bios':'Nonvolatile byte storage and command interface','cmos':'Battery-backed timekeeping','rear-io':'Passive mixed-protocol connectors',
 'audio':'Sample conversion and control registers','ethernet':'Packet controller and PHY','usb-header':'Passive protocol connector','fpanel':'Simple digital I/O',
 'fan':'Motor control and tachometer signaling','heatsink':'Passive thermal management','pcb':'Passive routed substrate','clock':'Clock generation and synchronization',
 'debug':'Debug/status reporting','wifi':'Wireless controller, firmware and PHY','capacitors':'Passive electrical storage/filtering',
 'cpu-cores':'ISA machine-instruction execution','gpu-cores':'Graphics-specific machine-instruction execution','l3':'Cache bit storage','memory-controller':'Memory protocol controller',
 'fabric':'On-die high-speed interconnect','pcie-phy':'Physical signaling and PCIe link controller','power-grid':'Passive on-die power delivery',
 'clock-grid':'Clock distribution','silicon':'Semiconductor substrate','interconnect':'Passive on-die signaling','transistor':'Switching primitive',
 'package':'Passive electrical fanout','bumps':'Passive electrical contacts','heatspreader':'Passive thermal management'};
const records=original.map(p=>({...p,representation_class:roleMap[p.id]||'Other'}));
if(records.length!==39)throw Error('Expected 39 reference profiles; got '+records.length);
for(const p of records)if(!roleMap[p.id])throw Error('Missing representation class for '+p.id);
const out={title:'Motherboard and Chips v4.0 · chip-to-binary correlation catalog',author:'Marc Lavoie',date:'2026-11-13',purpose:'Conceptual cross-reference dataset, not physical wiring diagrams',board_components:25,chip_components:14,count:records.length,profiles:records};
fs.writeFileSync(path.join(root,'reference','chip-to-binary-map.json'),JSON.stringify(out,null,2)+'\n');
const cols=['id','name','layer','representation_class','kind','example','behavior','signal','path','note'];
const quote=x=>'"'+String(x??'').replace(/"/g,'""').replace(/\r?\n/g,' ')+'"';
fs.writeFileSync(path.join(root,'reference','chip-to-binary-map.csv'),cols.join(',')+'\n'+records.map(p=>cols.map(c=>quote(p[c])).join(',')).join('\n')+'\n');
let text='# Chip-to-Binary Cross-Reference: 39 Components\n\n**Research and integration: Marc Lavoie · 2026-11-13**\n\nThis reference groups the illustrated 25 motherboard parts and 14 chip layers by their actual behavior. The examples are educational representations; a connector or heatsink does not execute code.\n\n';
for(const p of records){text+=`## ${p.name} (${p.id})\n\n- **Layer:** ${p.layer} | **Class:** ${p.representation_class}\n- **Type:** ${p.kind}\n- **Example:** \`${p.example.replace(/`/g,"'")}\`\n- **Behavior:** ${p.behavior}\n- **Actual signals:** ${p.signal}\n- **System route:** ${p.path}\n- **Qualification:** ${p.note}\n\n`;}
fs.writeFileSync(path.join(root,'reference','CHIP-PROFILES.md'),text);
console.log('Wrote',records.length,'profiles / 3 reference exports');
