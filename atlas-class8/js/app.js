/*
 * ATLAS / CLASS 8 ENGINEERING STUDIO | Interactive application controller
 * 2026-11-14 | Author: Marc Lavoie | v2.0
 * Original vanilla-JavaScript implementation. Works from file:// without build tools.
 * Educational simulation, not an OEM-certified service procedure.
 */
'use strict';
(() => {
  const D = window.LAB_DATA, T = window.ATLAS_TRAINING, B = window.ATLAS_DRAWINGS, Art = window.ATLAS_ART;
  if (!D || !T || !B) { document.body.textContent = 'Required application data did not load. Keep all extracted files in their original folders.'; return; }
  const $ = id => document.getElementById(id);
  const N = (v, fallback=0) => { const n=Number(v); return Number.isFinite(n) && n>=0 ? n : fallback; };
  const int = v => Number(v).toLocaleString('en-US',{maximumFractionDigits:0});
  const decimal = (v,n=1) => Number(v).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:n});
  const usd = v => Number(v).toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
  const between = (lo,hi,f=usd) => Math.abs(lo-hi)<.0001 ? f(lo) : `${f(lo)} – ${f(hi)}`;
  const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const zoneById = Object.fromEntries(D.ZONES.map(z=>[z.id,z]));
  const partById = Object.fromEntries(D.PARTS.map(p=>[p.id,p]));
  const validScreens = ['explorer','systems','air','weight','diagnostics','inspection','fluids','maintenance','repairs','knowledge','references','xray','drivetrain','tires','loadplan'];
  const names = {'explorer':'INTERACTIVE VEHICLE','systems':'SYSTEM BLUEPRINTS','air':'AIR BRAKE SIMULATOR','weight':'AXLE & BRIDGE LIMITS','diagnostics':'FAULT DIAGNOSIS','inspection':'PRE-TRIP INSPECTION','fluids':'FLUID CAPACITIES','maintenance':'SERVICE SCHEDULE','repairs':'REPAIR ESTIMATOR','knowledge':'CDL KNOWLEDGE CHECK','references':'REFERENCE LIBRARY','xray':'X-RAY SYSTEMS ATLAS','drivetrain':'TORQUE & GEARING LAB','tires':'18-TIRE CONDITION LAB','loadplan':'CARGO BALANCE STUDIO'};
  const KEY='atlas-class8-2026-v2';
  const initialMaintenance=()=>Object.fromEntries(T.SERVICE_ITEMS.map(s=>[s.id,{interval:s.interval,last:s.last}]));
  const state = {
    screen:'explorer',selectedPart:'engine-block',view:'both',vehicle:'All',system:'All',search:'',
    blueprint:'power',blueprintNode:0,
    air:{pressure:115,leak:2,vehicle:'combination',result:null},
    inspection:{},notes:'',repairs:[],labor:149,maintenance:initialMaintenance(),odo:275000,
    diagnostic:{selected:0,answers:{}},
    fluid:{selected:'oil',levels:{},overrides:{}},
    quiz:{index:0,picked:null,revealed:false,answers:{}}
  };
  try {
    const stored=JSON.parse(localStorage.getItem(KEY)||'null');
    if(stored && typeof stored==='object') {
      if(stored.inspection && typeof stored.inspection==='object') state.inspection=stored.inspection;
      if(typeof stored.notes==='string') state.notes=stored.notes.slice(0,1500);
      if(Array.isArray(stored.repairs)) state.repairs=stored.repairs.filter(x=>partById[x.id]).map(x=>({id:x.id,qty:Math.max(1,Math.min(99,Math.floor(N(x.qty,1))))}));
      if(N(stored.labor,-1)>=0) state.labor=Math.min(10000,N(stored.labor,149));
      if(stored.maintenance && typeof stored.maintenance==='object') T.SERVICE_ITEMS.forEach(s=>{const x=stored.maintenance[s.id];if(x&&Number.isFinite(+x.interval)&&Number.isFinite(+x.last)){state.maintenance[s.id]={interval:Math.min(1000000,Math.max(1,N(x.interval,s.interval))),last:Math.min(99999999,N(x.last,s.last))};}});
      if(Number.isFinite(+stored.odo))state.odo=Math.min(99999999,N(stored.odo,275000));
      if(stored.fluid?.levels && typeof stored.fluid.levels==='object') state.fluid.levels=stored.fluid.levels;
      if(stored.fluid?.overrides && typeof stored.fluid.overrides==='object')state.fluid.overrides=stored.fluid.overrides;
      if(stored.theme==='light')document.body.classList.add('light');
    }
  } catch(e) { /* Persistence may be disabled in private windows; everything still works. */ }
  const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify({inspection:state.inspection,notes:state.notes,repairs:state.repairs,labor:state.labor,maintenance:state.maintenance,odo:state.odo,fluid:{levels:state.fluid.levels,overrides:state.fluid.overrides},theme:document.body.classList.contains('light')?'light':'dark'}));}catch(e){}};
  function download(name,body,type){const blob=new Blob([body],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function go(screen){if(!validScreens.includes(screen))screen='explorer';state.screen=screen;
    document.querySelectorAll('.screen').forEach(e=>e.classList.toggle('active',e.id===`screen-${screen}`));
    document.querySelectorAll('[data-nav]').forEach(e=>e.classList.toggle('active',e.dataset.nav===screen));
    $('crumbTitle').textContent=names[screen];$('rail').classList.remove('open');$('menuToggle').setAttribute('aria-expanded','false');
    try{if(location.hash!==`#${screen}`)history.replaceState(null,'',`#${screen}`);}catch(e){};
    window.scrollTo({top:0,behavior:'instant'});
  }
  function initNavigation(){
    document.querySelectorAll('[data-nav]').forEach(el=>el.addEventListener('click',()=>go(el.dataset.nav)));
    document.querySelectorAll('[data-route]').forEach(el=>el.addEventListener('click',()=>go(el.dataset.route)));
    $('menuToggle').addEventListener('click',()=>{const open=$('rail').classList.toggle('open');$('menuToggle').setAttribute('aria-expanded',String(open));});
    $('themeToggle').addEventListener('click',()=>{document.body.classList.toggle('light');persist();});
    window.addEventListener('hashchange',()=>go(location.hash.slice(1)));
    document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName)){e.preventDefault();go('explorer');$('partSearch').focus();}});
  }
  // ================================================================
  // COMPONENT ATLAS — geometry overlays reuse the original 29 regions
  // ================================================================
  const RECT=[['chassis',390,397,378,46],['cab',234,191,228,233],['engine',75,309,161,113],['cooling',72,342,48,77],['intake',195,309,42,67],['emissions',434,211,34,151],['fuel',396,429,109,68],['transmission',283,399,151,43],['driveline',471,413,112,24],['steering',150,428,100,23],['front-suspension',116,434,105,27],['drive-axles',505,427,187,29],['air-brakes',575,440,72,21],['fifth-wheel',591,379,142,30],['electrical',354,333,92,59],['steer-tires',125,441,89,87],['drive-tires',504,441,197,87],['trailer-body',684,192,800,198],['trailer-roof',682,177,817,24],['trailer-floor',681,407,807,30],['trailer-cargo',873,246,329,122],['trailer-air',1004,431,155,30],['trailer-electrical',713,382,95,33],['trailer-tandem',1243,428,239,31],['trailer-brakes',1334,442,89,24],['trailer-lights',1478,343,34,73],['trailer-rear',1482,189,35,318],['trailer-landing',807,427,64,88],['trailer-tires',1290,440,199,90]];
  const TAG_ZONES=new Set(['engine','cab','fifth-wheel','steer-tires','drive-tires','air-brakes','trailer-body','trailer-cargo','trailer-landing','trailer-tires','trailer-rear']);
  function svgEl(tag,attrs){const e=document.createElementNS('http://www.w3.org/2000/svg',tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));return e;}
  function selectRegion(id){const zone=zoneById[id];if(!zone)return;
    state.vehicle=zone.vehicle;state.system='All';state.search='';$('partSearch').value='';$('systemSelect').value='All';filterButtons();
    const hit=D.PARTS.find(p=>p.zone===id);if(hit)choosePart(hit.id);
  }
  function hotspots(){const host=$('hotspots'),labels=$('diagramLabels');let n=0;
    RECT.forEach(([id,x,y,w,h])=>{const zone=zoneById[id];if(!zone)return;
      const r=svgEl('rect',{x,y,width:w,height:h,rx:Math.min(8,h/4),class:'hotspot','data-zone':id,tabindex:'0',role:'button','aria-label':`Explore ${zone.name} (${zone.vehicle})`});
      const title=svgEl('title',{});title.textContent=zone.name;r.append(title);
      r.addEventListener('click',()=>selectRegion(id));r.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectRegion(id);}});
      host.append(r);
      if(TAG_ZONES.has(id)){n++;const cx=x+w/2,cy=y+Math.min(19,h/2);const dot=svgEl('circle',{cx,cy,r:12,class:'diagram-tag'}),num=svgEl('text',{x:cx,y:cy+4,class:'diagram-tag-text'});num.textContent=n;labels.append(dot,num);}
    });
  }
  function setView(v){state.view=v;const boxes={both:'0 70 1560 530',tractor:'35 155 750 395',trailer:'650 155 880 395'};$('vehicleSvg').setAttribute('viewBox',boxes[v]);document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===v));}
  function filterButtons(){document.querySelectorAll('[data-vehicle]').forEach(b=>b.classList.toggle('active',b.dataset.vehicle===state.vehicle));}
  function matching(){const q=state.search.toLowerCase().trim();return D.PARTS.filter(p=>(state.vehicle==='All'||p.vehicle===state.vehicle)&&(state.system==='All'||p.system===state.system)&&(!q||[p.name,p.description,p.inspection,p.wear,p.replace,p.system,p.id].some(s=>s.toLowerCase().includes(q))));}
  function renderParts(){const visible=matching();$('matchedParts').textContent=`${visible.length} records`;const root=$('partList');root.replaceChildren();if(!visible.length){root.textContent='No matching parts. Change filters or search for another symptom.';return;}
    const frag=document.createDocumentFragment();visible.forEach(p=>{const row=document.createElement('button');row.type='button';row.className=`part-row ${state.selectedPart===p.id?'active':''}`;row.innerHTML=`<span class="part-symbol">${p.vehicle==='Tractor'?'⚙':'▣'}</span><span class="part-subtext"><b>${esc(p.name)}</b><small>${esc(p.vehicle)} / ${esc(zoneById[p.zone].name)}</small></span><span class="part-forward">↗</span>`;row.addEventListener('click',()=>choosePart(p.id));frag.append(row);});root.append(frag);
  }
  const costFor=(p,qty=1)=>({partsMin:p.partsMin*qty,partsMax:p.partsMax*qty,laborMin:p.hoursMin*qty*state.labor,laborMax:p.hoursMax*qty*state.labor,min:(p.partsMin+p.hoursMin*state.labor)*qty,max:(p.partsMax+p.hoursMax*state.labor)*qty});
  function choosePart(id){const p=partById[id];if(!p)return;state.selectedPart=id;const index=D.PARTS.findIndex(x=>x.id===id);
    $('detailName').textContent=p.name;$('detailPath').textContent=`${p.vehicle} / ${p.system} / ${zoneById[p.zone].name}`;
    $('detailDesc').textContent=p.description;$('detailInspect').textContent=p.inspection;$('detailWear').textContent=p.wear;$('detailReplace').textContent=p.replace;$('detailInterval').textContent=p.interval;
    $('componentCutaway').innerHTML=Art.render(p);$('detailNumber').textContent=`${p.vehicle==='Tractor'?'TR':'TL'}–${String(index+1).padStart(3,'0')}`;$('detailIcon').textContent=p.vehicle==='Tractor'?'⚙':'▤';
    $('detailRisk').textContent=p.priority==='high'?'SAFETY / CRITICAL':'SCHEDULED / MONITOR';$('detailRisk').classList.toggle('medium',p.priority!=='high');
    const c=costFor(p);$('detailPrice').textContent=between(c.min,c.max);$('detailCostDetail').textContent=`Parts ${between(p.partsMin,p.partsMax)} + ${between(p.hoursMin,p.hoursMax,x=>decimal(x,1))} technician hr × ${usd(state.labor)}/hr`;
    document.querySelectorAll('.hotspot').forEach(e=>e.classList.toggle('selected',e.dataset.zone===p.zone));
    if(state.view!=='both'&&state.view!==p.vehicle.toLowerCase())setView(p.vehicle.toLowerCase());renderParts();
  }
  function initAtlas(){hotspots();$('partCount').innerHTML=`${D.PARTS.length}<span> parts</span>`;
    const systems=[...new Set(D.PARTS.map(p=>p.system))].sort();$('systemSelect').innerHTML='<option value="All">All system categories</option>'+systems.map(s=>`<option value="${esc(s)}">${esc(s)}</option>`).join('');
    document.querySelectorAll('[data-vehicle]').forEach(b=>b.addEventListener('click',()=>{state.vehicle=b.dataset.vehicle;filterButtons();renderParts();}));
    document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
    $('partSearch').addEventListener('input',e=>{state.search=e.target.value;renderParts();});
    $('systemSelect').addEventListener('change',e=>{state.system=e.target.value;renderParts();});
    $('addPartBtn').addEventListener('click',()=>{addRepair(state.selectedPart);$('addPartBtn').textContent='✓ ADDED TO WORK ORDER';setTimeout(()=>{$('addPartBtn').textContent='+ ADD TO REPAIR PLAN';},1000);});
    choosePart('engine-block');
  }
  // ================================================================
  // SYSTEM BLUEPRINTS — selectable flow nodes linked to the parts index
  // ================================================================
  function renderBlueprint(){const spec=T.SYSTEMS[state.blueprint],i=state.blueprintNode,n=spec.nodes[i];
    document.querySelectorAll('[data-system]').forEach(b=>b.classList.toggle('active',b.dataset.system===state.blueprint));
    $('systemLabel').textContent=spec.label;$('systemName').textContent=spec.name;$('systemSummary').textContent=spec.summary;
    $('systemDrawing').innerHTML=B.systemSVG(spec,i);
    $('systemDrawing').querySelectorAll('[data-node]').forEach(n=>{const choose=()=>{state.blueprintNode=+n.dataset.node;renderBlueprint();};n.addEventListener('click',choose);n.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}});});
    $('systemDetail').innerHTML=`<div><div class="kicker">SELECTED FLOW MODULE / ${String(i+1).padStart(2,'0')}</div><b>${esc(n[1])} — ${esc(n[2])}</b><p>${esc(n[4])}</p></div><button class="btn primary" id="openBlueprintPart">OPEN COMPONENT RECORD ↗</button>`;
    $('openBlueprintPart').addEventListener('click',()=>{const p=partById[n[3]];state.vehicle=p.vehicle;state.system='All';state.search='';$('partSearch').value='';$('systemSelect').value='All';filterButtons();go('explorer');choosePart(n[3]);$('detailName').scrollIntoView({block:'center',behavior:'smooth'});});
    $('systemSteps').innerHTML=spec.nodes.map((step,j)=>`<article><span class="seq">MODULE ${String(j+1).padStart(2,'0')}</span><h4>${esc(step[1])}</h4><p>${esc(step[4])}</p></article>`).join('');
  }
  function initBlueprint(){document.querySelectorAll('[data-system]').forEach(b=>b.addEventListener('click',()=>{state.blueprint=b.dataset.system;state.blueprintNode=0;renderBlueprint();}));renderBlueprint();}
  // ================================================================
  // AIR-BRAKE BENCH — deterministic pressure-decay educational exercise
  // ================================================================
  function renderAir(){const a=state.air;$('pressureVal').textContent=`${a.pressure} psi`;$('leakVal').textContent=`${a.leak} psi/min`;
    $('airPressure').value=a.pressure;$('airLeak').value=a.leak;$('brakeVehicle').value=a.vehicle;
    $('gaugeValue').textContent=a.pressure;$('gaugeArc').setAttribute('stroke-dasharray',`${Math.round(a.pressure/140*100)} 100`);
    const status=$('airStatus');status.className='status-label';if(a.pressure<=45){status.textContent='CRITICAL LOW PRESSURE';status.classList.add('bad');$('gaugeArc').setAttribute('stroke','#ff9186');}else if(a.pressure<=60){status.textContent='LOW-AIR WARNING';status.classList.add('warn');$('gaugeArc').setAttribute('stroke','#ffcb84');}else{status.textContent='TRAINING PRESSURE';$('gaugeArc').setAttribute('stroke','#59edcd');}
    if(a.result){const r=a.result;const panel=$('airResult');panel.className=`test-result ${r.passed?'pass':'fail'}`;
      panel.innerHTML=`<span>${r.passed?'IN-EXAMPLE LIMIT':'CHECK FAILED / UNSAFE'}</span><h3>${r.passed?'Pressure loss within example threshold':'Exceeds test threshold or insufficient pressure'}</h3><p>Start: <b>${int(r.start)} psi</b> · End: <b>${int(r.end)} psi</b> · Applied loss: <b>${int(r.loss)} psi in one minute</b> · Example threshold: <b>${r.limit} psi/min</b>. ${esc(r.message)}</p>`;
    }else{$('airResult').className='test-result neutral';$('airResult').innerHTML='<span>AWAITING TEST</span><h3>Ready to analyze</h3><p>Choose a leak severity and press RUN APPLIED-LOSS TEST to compare the modeled one-minute drop against the selected example limit.</p>';}
  }
  function initAir(){state.air.result=null;$('airRouting').innerHTML=B.airFlow();
    $('airPressure').addEventListener('input',e=>{state.air.pressure=+e.target.value;state.air.result=null;renderAir();});
    $('airLeak').addEventListener('input',e=>{state.air.leak=+e.target.value;state.air.result=null;renderAir();});
    $('brakeVehicle').addEventListener('change',e=>{state.air.vehicle=e.target.value;state.air.result=null;renderAir();});
    $('pumpAir').addEventListener('click',()=>{state.air.pressure=Math.min(140,state.air.pressure+10);state.air.result=null;renderAir();});
    $('applyBrake').addEventListener('click',()=>{state.air.pressure=Math.max(0,state.air.pressure-6);state.air.result=null;renderAir();});
    $('resetAir').addEventListener('click',()=>{state.air={pressure:115,leak:2,vehicle:'combination',result:null};renderAir();});
    $('runAirTest').addEventListener('click',()=>{const a=state.air,limit=a.vehicle==='combination'?4:3,start=a.pressure,end=Math.max(0,start-a.leak),loss=start-end;
      const passed=loss<=limit && start>60 && end>60;
      a.result={start,end,loss,limit,passed,message:start<=60?'Starting pressure is too low for a normal functional braking demonstration.':loss>limit?'An excessive applied air loss calls for locating and repairing leakage before operation.':'This result addresses ONLY one simplified applied-loss criterion; other system checks remain required.'};
      a.pressure=end;renderAir();
    });renderAir();
  }
  // ================================================================
  // WEIGHT LAB — individual axles and every contiguous bridge subgroup
  // ================================================================
  const DEFAULT_AXLES=[{weight:12000,pos:0},{weight:16000,pos:15.5},{weight:16000,pos:20},{weight:15500,pos:48},{weight:15500,pos:52.5}];
  const OVER_AXLES=[{weight:12500,pos:0},{weight:18000,pos:15.5},{weight:18000,pos:20},{weight:18000,pos:48},{weight:18000,pos:52.5}];
  function fillAxles(arr){$('axleInputs').innerHTML=arr.map((a,i)=>`<div class="axle-input"><span>A${i+1}</span><label>Load (lb)<input data-axle-weight="${i}" type="number" min="0" value="${a.weight}" aria-label="Weight axle ${i+1} in pounds"></label><label>Position (ft)<input data-axle-position="${i}" type="number" min="0" step="0.5" value="${a.pos}" aria-label="Position axle ${i+1} in feet"></label></div>`).join('');
    $('axleInputs').querySelectorAll('input').forEach(el=>el.addEventListener('input',renderWeight));
  }
  function getAxles(){return Array.from({length:5},(_,i)=>({weight:N(document.querySelector(`[data-axle-weight="${i}"]`).value),pos:N(document.querySelector(`[data-axle-position="${i}"]`).value)}));}
  // A conservative, instructional approximation of federal bridge formula; floor to 500.
  function bridgeCap(span,count){if(count<2)return 20000;const formula=500*(span*count/(count-1)+12*count+36);return Math.min(80000,Math.max(0,Math.floor(formula/500)*500));}
  function modelGroups(axles,steerGAWR){const out=[];
    for(let first=0;first<5;first++)for(let last=first;last<5;last++){
      const count=last-first+1, span=axles[last].pos-axles[first].pos, total=axles.slice(first,last+1).reduce((s,a)=>s+a.weight,0);
      let cap=count===1 ? (first===0?Math.min(20000,steerGAWR):20000) : bridgeCap(Math.max(0,span),count);
      // Tandem axle limits are applied to modeled adjacent tandem pairs 2-3 and 4-5.
      if(count===2&&((first===1&&last===2)||(first===3&&last===4)))cap=Math.min(34000,cap);
      if(count===5)cap=Math.min(80000,cap);
      out.push({first,last,count,span,total,cap,over:total>cap});
    }return out;
  }
  function renderWeight(){const a=getAxles(),tare=N($('wtTractor').value)+N($('wtTrailer').value),computed=tare+N($('wtCargo').value),actual=a.reduce((s,x)=>s+x.weight,0),gawr=N($('wtSteerGawr').value,12000);
    const valid=a.every((x,i)=>i===0||x.pos>a[i-1].pos),groups=modelGroups(a,gawr),failures=groups.filter(g=>g.over),mismatch=Math.abs(computed-actual)>100;
    $('axleDiagram').innerHTML=B.axleSVG(a);$('wtGross').textContent=`${int(computed)} lb`;$('wtScale').textContent=`${int(actual)} lb`;$('wtHeadroom').textContent=`${int(Math.max(0,80000-computed))} lb`;$('wtPayloadCap').textContent=`${int(Math.max(0,80000-tare))} lb`; $('wtGroups').textContent=groups.length;
    const status=$('grossStatus');status.className='status-label';status.textContent=(failures.length||computed>80000||!valid)?'MODEL LIMIT EXCEEDED':mismatch?'WEIGHTS DO NOT RECONCILE':'BASELINE CHECKS PASS';if(failures.length||computed>80000||!valid)status.classList.add('bad');else if(mismatch)status.classList.add('warn');
    const warn=[];if(!valid)warn.push(['bad','Axle positions must increase from the steer axle to the rear trailer axle.']);
    if(computed>80000)warn.push(['bad',`Entered gross ${int(computed)} lb exceeds the normal 80,000 lb federal Interstate ceiling.`]);
    if(mismatch)warn.push(['warn',`Tare plus cargo (${int(computed)} lb) differs from individual scale axle totals (${int(actual)} lb). Verify both readings.`]);
    if(failures.length)warn.push(['bad',`${failures.length} of 15 modeled axle groups exceed a baseline cap. Review all flagged rows.`]);
    if(!warn.length)warn.push(['pass','No modeled baseline violations with the supplied inputs. This is not a legal operating authorization; other ratings, exceptions and routes still matter.']);
    $('weightAlerts').innerHTML=warn.map(([cls,text])=>`<div class="weight-alert ${cls}">${esc(text)}</div>`).join('');
    $('bridgeRows').innerHTML=groups.map(g=>`<tr><td><b>A${g.first+1}${g.first===g.last?'':`–A${g.last+1}`}</b></td><td>${decimal(g.span)} ft</td><td>${int(g.total)} lb</td><td>${int(g.cap)} lb</td><td class="${g.over?'pill-fail':'pill-pass'}">${g.over?'OVER':'WITHIN'}</td></tr>`).join('');
  }
  function initWeight(){fillAxles(DEFAULT_AXLES);
    ['wtTractor','wtTrailer','wtCargo','wtSteerGawr'].forEach(id=>$(id).addEventListener('input',renderWeight));
    $('resetWeight').addEventListener('click',()=>{$('wtTractor').value=19000;$('wtTrailer').value=14000;$('wtCargo').value=42000;$('wtSteerGawr').value=12000;fillAxles(DEFAULT_AXLES);renderWeight();});
    $('loadBalanced').addEventListener('click',()=>{$('wtTractor').value=19000;$('wtTrailer').value=14000;$('wtCargo').value=42000;fillAxles(DEFAULT_AXLES);renderWeight();});
    $('loadOverloaded').addEventListener('click',()=>{$('wtTractor').value=19000;$('wtTrailer').value=14000;$('wtCargo').value=51500;fillAxles(OVER_AXLES);renderWeight();});
    renderWeight();
  }
  // ================================================================
  // FAULT DIAGNOSIS WORKBENCH — one attempt per scenario, replayable
  // ================================================================
  function chooseScenario(i){state.diagnostic.selected=i;renderScenario();}
  function renderScenario(){const i=state.diagnostic.selected,s=T.SCENARIOS[i],answer=state.diagnostic.answers[s.id];
    $('scenarioCount').textContent=`${T.SCENARIOS.length} scenarios`;$('scenarioTitle').textContent=s.title;$('scenarioSeverity').textContent=s.severity;$('scenarioSeverity').classList.toggle('medium',s.severity!=='CRITICAL');
    $('scenarioList').innerHTML=T.SCENARIOS.map((x,j)=>`<button class="scenario-button ${i===j?'active':''}" data-case="${j}"><span>${String(j+1).padStart(2,'0')}</span><div><b>${esc(x.title)}</b><small>${esc(x.system)} · ${x.severity}</small></div></button>`).join('');
    $('scenarioList').querySelectorAll('[data-case]').forEach(b=>b.addEventListener('click',()=>chooseScenario(+b.dataset.case)));
    $('scenarioSymptoms').innerHTML='<b>OBSERVED TELEMETRY / DRIVER REPORT</b>'+s.symptoms.map(x=>`<p>${esc(x)}</p>`).join('');
    $('scenarioQuestion').textContent=s.question;
    $('scenarioOptions').innerHTML=s.choices.map((c,j)=>`<button class="option-btn ${answer!=null?(j===s.answer?'correct':j===answer?'wrong':''):''}" data-choice="${j}" ${answer!=null?'disabled':''}><span class="option-letter">${String.fromCharCode(65+j)}</span>${esc(c)}</button>`).join('');
    $('scenarioOptions').querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>{if(state.diagnostic.answers[s.id]!=null)return;state.diagnostic.answers[s.id]=+b.dataset.choice;renderScenario();}));
    const good=answer===s.answer;$('scenarioFeedback').innerHTML=answer==null?'':`<div class="${good?'feedback-success':'feedback-error'}"><b>${good?'Correct engineering judgment.':'Review the safety decision.'}</b> ${esc(s.why)} <button class="btn ghost tiny" id="casePart">VIEW RELATED PART ↗</button></div>`;
    $('casePart')?.addEventListener('click',()=>{const p=partById[s.part];state.vehicle=p.vehicle;filterButtons();go('explorer');choosePart(p.id);});
    const done=Object.keys(state.diagnostic.answers).length,score=T.SCENARIOS.filter(x=>state.diagnostic.answers[x.id]===x.answer).length;$('scenarioScore').textContent=`${score} correct / ${done} attempted`;
  }
  function initDiagnostics(){$('nextScenario').addEventListener('click',()=>chooseScenario((state.diagnostic.selected+1)%T.SCENARIOS.length));renderScenario();}
  // ================================================================
  // WALKAROUND INSPECTION — tri-state checkpoints + exported evidence
  // ================================================================
  function renderInspection(){const stations=T.INSPECTION_STATIONS,done=stations.filter(x=>state.inspection[x.id]).length,passes=stations.filter(x=>state.inspection[x.id]==='pass').length,attention=stations.filter(x=>state.inspection[x.id]==='attention').length,defect=stations.filter(x=>state.inspection[x.id]==='defect').length;
    $('inspectionCounter').textContent=`${done} of ${stations.length}`;$('inspectionProgress').style.width=`${100*done/stations.length}%`;
    $('inspectionList').innerHTML=stations.map((s,i)=>`<article class="inspection-item"><div class="inspection-item-head"><b>${String(i+1).padStart(2,'0')} · ${esc(s.name)}</b><small>${esc(s.vehicle)}</small></div><p>${esc(s.instructions)}</p><div class="inspection-buttons">${[['pass','PASS'],['attention','NEEDS ATTENTION'],['defect','DEFECT']].map(([v,text])=>`<button data-inspection="${s.id}" data-value="${v}" class="${state.inspection[s.id]===v?'selected':''}" aria-pressed="${String(state.inspection[s.id]===v)}">${text}</button>`).join('')}</div></article>`).join('');
    $('inspectionList').querySelectorAll('[data-inspection]').forEach(b=>b.addEventListener('click',()=>{const old=state.inspection[b.dataset.inspection];if(old===b.dataset.value)delete state.inspection[b.dataset.inspection];else state.inspection[b.dataset.inspection]=b.dataset.value;persist();renderInspection();}));
    $('inspectionTotals').innerHTML=`<div><span>PASS</span><strong>${passes}</strong></div><div><span>ATTENTION</span><strong>${attention}</strong></div><div><span>DEFECT</span><strong>${defect}</strong></div>`;
    $('inspectionOutcome').innerHTML=defect?`<b>HOLD FOR DEFECT ASSESSMENT</b><p>${defect} component station(s) marked DEFECT. Treat safety-critical items as grounds to stop and arrange qualified assessment/repair.</p>`:attention?`<b>FOLLOW-UP REQUIRED</b><p>${attention} station(s) need attention. Resolve the issues and verify safe condition before operating.</p>`:done===stations.length?'<b>ALL TRAINING STATIONS REVIEWED</b><p>No defects recorded. This checklist does not substitute for an actual vehicle inspection or legal documentation.</p>':`<b>INSPECTION IN PROGRESS</b><p>${stations.length-done} station(s) still require assessment. A blank entry is not a passed inspection.</p>`;
    const findings=stations.filter(s=>['attention','defect'].includes(state.inspection[s.id]));
    $('inspectionFindings').innerHTML=findings.length?findings.map(s=>`<div class="finding ${state.inspection[s.id]}">${esc(s.name)} <span>${state.inspection[s.id]==='defect'?'DEFECT':'FOLLOW-UP'}</span></div>`).join(''):'<p class="module-footnote">No issues recorded yet.</p>';
  }
  function initInspection(){state.notes=String(state.notes||'').slice(0,1500);$('inspectionNotes').value=state.notes;
    $('inspectionNotes').addEventListener('input',e=>{state.notes=e.target.value.slice(0,1500);persist();});
    $('resetInspection').addEventListener('click',()=>{state.inspection={};state.notes='';$('inspectionNotes').value='';persist();renderInspection();});
    $('exportInspection').addEventListener('click',()=>{const report={report_type:'Educational Pre-Trip Inspection Practice',generated_at:new Date().toISOString(),vehicle:'Illustrative Class 8 tractor and 53-foot dry van',stations:T.INSPECTION_STATIONS.map(s=>({...s,result:state.inspection[s.id]||'not inspected'})),notes:state.notes,notice:'Training only: not a legal DVIR or roadworthiness certification.'};download('atlas-class8-pretrip-report.json',JSON.stringify(report,null,2),'application/json');});
    renderInspection();
  }
  // ================================================================
  // FLUID CAPACITY LAB — unit conversion and clearly labeled assumptions
  // ================================================================
  function selectFluid(id){const f=D.FLUIDS.find(x=>x.id===id);if(!f)return;state.fluid.selected=id;
    if(state.fluid.levels[id]==null)state.fluid.levels[id]=75;
    if(state.fluid.overrides[id]==null)state.fluid.overrides[id]=f.max;
    renderFluid();
  }
  function renderFluid(){const f=D.FLUIDS.find(x=>x.id===state.fluid.selected),amount=Math.min(100000,N(state.fluid.overrides[f.id],f.max)),percent=Math.min(100,Math.max(0,N(state.fluid.levels[f.id],75))),content=amount*percent/100,missing=amount-content;
    $('fluidList').innerHTML=D.FLUIDS.map(x=>`<button class="fluid-choice ${x.id===f.id?'active':''}" data-fluid="${x.id}"><span><b>${esc(x.name)}</b><small>${esc(x.type)} · ${esc(x.system)}</small></span><strong>${between(x.min,x.max,z=>decimal(z,1))} L</strong></button>`).join('');
    $('fluidList').querySelectorAll('[data-fluid]').forEach(b=>b.addEventListener('click',()=>selectFluid(b.dataset.fluid)));
    $('fluidName').textContent=f.name;$('fluidType').textContent=f.type.toUpperCase();$('fluidCapacity').textContent=`${decimal(amount,1)} L`;$('fluidCurrent').textContent=`${decimal(content,1)} L`;$('fluidMissing').textContent=`${decimal(missing,1)} L`;
    $('fluidPercent').textContent=`${percent}%`;$('fluidFill').value=percent;$('fluidOverride').value=amount;
    $('tankGraphic').innerHTML=`<div class="tank-shell"><div class="tank-level" style="height:${f.id==='air'?0:percent}%"></div></div><div class="tank-lines"><span></span><span></span><span></span><span></span><span></span></div>`;
    $('fluidNote').innerHTML=`<b>CAPACITY CLASS:</b> ${esc(f.type)}<br><b>VOLUME:</b> ${decimal(amount/3.785411784,2)} US gal (if applicable)<br><b>IMPORTANT:</b> ${esc(f.note)}`;
    if(f.id==='air'){$('fluidNote').innerHTML='<b>NOT APPLICABLE:</b> Conventional tractor–trailer air brake reservoirs contain compressed air; hydraulic brake fluid capacity is not applicable. Do not add hydraulic fluid to pneumatic reservoirs.';}
  }
  function initFluids(){ $('fluidFill').addEventListener('input',e=>{state.fluid.levels[state.fluid.selected]=Math.max(0,Math.min(100,+e.target.value));persist();renderFluid();});
    $('fluidOverride').addEventListener('input',e=>{state.fluid.overrides[state.fluid.selected]=N(e.target.value);persist();renderFluid();});selectFluid('oil');
  }
  // ================================================================
  // MILEAGE SERVICE SCHEDULER — editable examples, persisted locally
  // ================================================================
  function renderMaintenance(){const odo=state.odo;let overdue=0,soon=0,ok=0;
    $('maintenanceRows').innerHTML=T.SERVICE_ITEMS.map(s=>{const m=state.maintenance[s.id],due=m.last+m.interval,remaining=due-odo;
      const cls=remaining<0?'status-overdue':remaining<=Math.min(5000,m.interval*.1)?'status-soon':'status-ok';if(remaining<0)overdue++;else if(cls==='status-soon')soon++;else ok++;
      const label=remaining<0?`OVERDUE ${int(Math.abs(remaining))} mi`:cls==='status-soon'?`DUE SOON / ${int(remaining)} mi`:`${int(remaining)} mi left`;
      return `<tr><td><b>${esc(s.name)}</b><br><small title="${esc(s.note)}" style="color:var(--muted)">Educational placeholder</small></td><td><input data-service="${s.id}" data-field="interval" type="number" min="1" step="1000" value="${m.interval}" aria-label="Interval for ${esc(s.name)}"></td><td><input data-service="${s.id}" data-field="last" type="number" min="0" value="${m.last}" aria-label="Last service mileage for ${esc(s.name)}"></td><td>${int(due)} mi</td><td class="${cls}">${label}</td></tr>`;
    }).join('');
    $('maintenanceRows').querySelectorAll('[data-service]').forEach(e=>e.addEventListener('change',()=>{const {service,field}=e.dataset;state.maintenance[service][field]=field==='interval'?Math.max(1,N(e.value,1)):N(e.value);persist();renderMaintenance();}));
    $('maintenanceSummary').innerHTML=`<div><span>SERVICE ITEMS</span><strong>${T.SERVICE_ITEMS.length}</strong></div><div><span>ON SCHEDULE</span><strong>${ok}</strong></div><div class="soon"><span>DUE SOON</span><strong>${soon}</strong></div><div class="overdue"><span>PAST EXAMPLE DUE</span><strong>${overdue}</strong></div>`;
  }
  function initMaintenance(){$('odoInput').value=state.odo;$('odoInput').addEventListener('input',e=>{state.odo=N(e.target.value);persist();renderMaintenance();});
    $('resetMaintenance').addEventListener('click',()=>{state.maintenance=initialMaintenance();state.odo=275000;$('odoInput').value=275000;persist();renderMaintenance();});renderMaintenance();
  }
  // ================================================================
  // REPAIR ESTIMATOR — broad cost ranges, exports original CSV work order
  // ================================================================
  function addRepair(id){const old=state.repairs.find(x=>x.id===id);if(old)old.qty=Math.min(99,old.qty+1);else state.repairs.push({id,qty:1});persist();renderRepairs();}
  function renderRepairs(){const root=$('repairRows');if(!state.repairs.length){root.innerHTML='<tr><td colspan="6">No components selected yet. Use ADD COMPONENT or the atlas to build a work order.</td></tr>';}else{
      root.innerHTML=state.repairs.map(x=>{const p=partById[x.id],c=costFor(p,x.qty);return `<tr><td><b>${esc(p.name)}</b><br><small>${esc(p.vehicle)} / ${esc(p.system)}</small></td><td><input class="qty-field" type="number" min="1" max="99" value="${x.qty}" data-repair-qty="${p.id}" aria-label="Quantity of ${esc(p.name)}"></td><td>${between(p.partsMin,p.partsMax)}</td><td>${between(p.hoursMin,p.hoursMax,z=>decimal(z,1))}</td><td><b>${between(c.min,c.max)}</b></td><td><button class="remove-btn" data-repair-remove="${p.id}" aria-label="Remove ${esc(p.name)}">×</button></td></tr>`;}).join('');
      root.querySelectorAll('[data-repair-qty]').forEach(e=>e.addEventListener('change',()=>{const line=state.repairs.find(x=>x.id===e.dataset.repairQty);if(line)line.qty=Math.max(1,Math.min(99,Math.round(N(e.value,1))));persist();renderRepairs();}));
      root.querySelectorAll('[data-repair-remove]').forEach(e=>e.addEventListener('click',()=>{state.repairs=state.repairs.filter(x=>x.id!==e.dataset.repairRemove);persist();renderRepairs();}));
    }
    const totals=state.repairs.reduce((s,x)=>{const c=costFor(partById[x.id],x.qty);s.pm+=c.partsMin;s.px+=c.partsMax;s.lm+=c.laborMin;s.lx+=c.laborMax;return s;},{pm:0,px:0,lm:0,lx:0});
    $('repairPartsTotal').textContent=between(totals.pm,totals.px);$('repairLaborTotal').textContent=between(totals.lm,totals.lx);$('repairGrandTotal').textContent=between(totals.pm+totals.lm,totals.px+totals.lx);
    if(state.selectedPart)choosePart(state.selectedPart);
  }
  const csvCell=s=>`"${String(s).replace(/"/g,'""')}"`;
  function exportRepairs(){const head=['Part ID','Part','Vehicle','Quantity','Parts Minimum USD','Parts Maximum USD','Labor Hours Minimum','Labor Hours Maximum','Shop Rate USD per hour','Estimated Total Minimum USD','Estimated Total Maximum USD'];
    const rows=[head,...state.repairs.map(x=>{const p=partById[x.id],c=costFor(p,x.qty);return [p.id,p.name,p.vehicle,x.qty,c.partsMin,c.partsMax,p.hoursMin*x.qty,p.hoursMax*x.qty,state.labor,Math.round(c.min),Math.round(c.max)];})];
    rows.push(['Disclaimer','Illustrative estimates only; validate part fitment, shop rate, diagnostics, tax and labor times.']);
    download('atlas-class8-repair-work-order.csv','\ufeff'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n'),'text/csv;charset=utf-8');
  }
  function initRepairs(){const picker=$('repairPicker');picker.innerHTML=D.PARTS.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(p=>`<option value="${p.id}">${esc(p.vehicle)} · ${esc(p.name)}</option>`).join('');picker.value='engine-block';
    $('repairPickerAdd').addEventListener('click',()=>addRepair(picker.value));$('laborRate').value=state.labor;
    $('laborRate').addEventListener('input',e=>{state.labor=Math.min(10000,N(e.target.value));persist();renderRepairs();});
    $('clearRepairs').addEventListener('click',()=>{state.repairs=[];persist();renderRepairs();});$('exportRepairs').addEventListener('click',exportRepairs);renderRepairs();
  }
  // ================================================================
  // ASSESSMENT — 15 questions, reveal explanations after submission
  // ================================================================
  function renderQuiz(){const q=T.QUIZ[state.quiz.index],a=state.quiz.answers,picked=state.quiz.picked,revealed=state.quiz.revealed,done=Object.keys(a).length,score=T.QUIZ.filter((x,i)=>a[i]===x.answer).length;
    $('quizProgress').textContent=`QUESTION ${state.quiz.index+1} / ${T.QUIZ.length}`;$('quizBar').style.width=`${100*done/T.QUIZ.length}%`;$('quizQuestion').textContent=q.q;
    $('quizOptions').innerHTML=q.options.map((opt,i)=>`<button class="option-btn ${revealed?(i===q.answer?'correct':i===picked?'wrong':''):i===picked?'selected':''}" data-quiz-opt="${i}" ${revealed?'disabled':''}><span class="option-letter">${String.fromCharCode(65+i)}</span>${esc(opt)}</button>`).join('');
    $('quizOptions').querySelectorAll('[data-quiz-opt]').forEach(b=>b.addEventListener('click',()=>{state.quiz.picked=+b.dataset.quizOpt;renderQuiz();}));
    const good=revealed&&picked===q.answer;
    $('quizFeedback').innerHTML=revealed?`<div class="${good?'feedback-success':'feedback-error'}"><b>${good?'Correct.':'Not quite.'}</b> ${esc(q.why)}</div>`:'';
    const next=$('quizNext');next.disabled=picked==null&&!revealed;next.textContent=revealed?(state.quiz.index===T.QUIZ.length-1?'VIEW RESULTS →':'NEXT QUESTION →'):'CHECK ANSWER';
    $('quizResult').innerHTML=`<div class="score-number">${score}<span style="font-size:25px;color:var(--muted)">/${T.QUIZ.length}</span></div><h3>${done===T.QUIZ.length?(score/T.QUIZ.length>=.8?'PRACTICE PASS':'REVIEW REQUIRED'):'Practice progress'}</h3><p>${done} answered · ${score} correct · ${done?Math.round(score/done*100):0}% current accuracy</p>`;
    const topics=[...new Set(T.QUIZ.map(x=>x.topic))];$('quizTopics').innerHTML=topics.map(t=>{const items=T.QUIZ.map((x,i)=>({x,i})).filter(o=>o.x.topic===t),correct=items.filter(o=>a[o.i]===o.x.answer).length,complete=items.filter(o=>a[o.i]!=null).length;return `<div><span>${esc(t)}</span><b>${correct} / ${complete}</b></div>`;}).join('');
  }
  function advanceQuiz(){const q=T.QUIZ[state.quiz.index];if(!state.quiz.revealed){if(state.quiz.picked==null)return;state.quiz.answers[state.quiz.index]=state.quiz.picked;state.quiz.revealed=true;renderQuiz();return;}
    if(state.quiz.index===T.QUIZ.length-1){const score=T.QUIZ.filter((x,i)=>state.quiz.answers[i]===x.answer).length;const target=score/T.QUIZ.length>=.8;
      $('quizFeedback').innerHTML=`<div class="${target?'feedback-success':'feedback-error'}"><b>${target?'Passed the 80% practice benchmark.':'Below the 80% practice benchmark.'}</b> Score: ${score}/${T.QUIZ.length} (${Math.round(score/T.QUIZ.length*100)}%). Use START OVER to practice again.</div>`;$('quizNext').disabled=true;$('quizNext').textContent='ASSESSMENT COMPLETE';return;
    }
    state.quiz.index++;state.quiz.picked=null;state.quiz.revealed=false;renderQuiz();
  }
  function initQuiz(){$('quizNext').addEventListener('click',advanceQuiz);$('quizRestart').addEventListener('click',()=>{state.quiz={index:0,picked:null,revealed:false,answers:{}};renderQuiz();});renderQuiz();}
  // ================================================================
  // REFERENCE LIBRARY — external official sources, not required to run
  // ================================================================
  function initReferences(){$('sourcesList').innerHTML=T.SOURCES.map(s=>`<a href="${esc(s.url)}" rel="noopener noreferrer" target="_blank" class="source-item"><span class="source-type">${esc(s.type)} ↗</span><b>${esc(s.name)}</b><p>${esc(s.description)}</p></a>`).join('');}
  function init(){initNavigation();initAtlas();initBlueprint();initAir();initWeight();initDiagnostics();initInspection();initFluids();initMaintenance();initRepairs();initQuiz();initReferences();go(location.hash.slice(1));}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  // Minimal, read-only diagnostic surface for automated regression checks.
  window.ATLAS_HOST={navigate:go,openPart(id){
    if(!partById[id])return false;
    const p=partById[id];state.vehicle=p.vehicle;state.system='All';state.search='';
    $('partSearch').value='';$('systemSelect').value='All';filterButtons();go('explorer');
    choosePart(id);$('detailName').scrollIntoView({block:'center',behavior:'smooth'});return true;
  },applyAxleEstimate(weights,tractor,trailer,cargo){
    if(!Array.isArray(weights)||weights.length!==5||weights.some(w=>!Number.isFinite(w)||w<0))return false;
    if([tractor,trailer,cargo].some(w=>!Number.isFinite(w)||w<0))return false;
    for(let i=0;i<5;i++){
      const el=document.querySelector(`[data-axle-weight="${i}"]`);if(!el)return false;
      el.value=weights[i].toFixed(2);
    }
    for(const [id,n] of [['wtTractor',tractor],['wtTrailer',trailer],['wtCargo',cargo]])$(id).value=n;
    renderWeight();go('weight');return true;
  }};
  window.ATLAS_TEST={bridgeCap,modelGroups,get state(){return state;},get parts(){return D.PARTS.length;},get zones(){return RECT.length;}};
})();
