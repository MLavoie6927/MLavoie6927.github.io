/* ATLAS USA Class A CDL v1.1 — GPS route trap visual engine
 * 2026-11-17 · Marc Lavoie
 * This is an offline educational atlas, NOT route authorization, current DOT conditions, or GPS evidence.
 * Road segments are schematic approximations. A source-backed RESTRICTION does not imply a GPS
 * provider has actually returned an incorrect route. Always verify current signage and rules.
 */
(() => {
  'use strict';
  const records=window.ATLAS_ROAD_TRAPS;
  if (!Array.isArray(records)) return;
  const NS='http://www.w3.org/2000/svg';
  const $=s=>document.querySelector(s);
  const list=$('#trap-list'), detail=$('#gps-detail'), points=$('#map-trap-markers'), lines=$('#map-trap-lines');
  if(!list||!detail||!points||!lines)return;
  const catColors={access:'#ff857e',clearance:'#ffb279',geometry:'#cba7ff',weight:'#f8ce74',hazmat:'#fca0d2',weather:'#84caff'};
  const catSymbols={access:'⊘',clearance:'↕',geometry:'⌁',weight:'⚖',hazmat:'◇',weather:'≈'};
  const catLabels={access:'Truck restricted',clearance:'Low clearance',geometry:'Narrow / length / turns',weight:'Weight / registration',hazmat:'Hazmat routing',weather:'Conditions / weather'};
  const riskLabel={ban:'Road access restriction',length:'Combination length limitation',weight:'Gross vehicle weight limitation',registration:'Registered-weight limitation',kpra:'KPRA length limitation',conditional:'Segment / condition dependent',hazmat:'Cargo-dependent limitation'};
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const n=(x)=>Number.isFinite(x)?x.toLocaleString('en-US'):'';
  const state={selected:records[0].id,search:'',category:'all',show:true};
  function makeNode(name,attr,parent){const e=document.createElementNS(NS,name);for(const [k,v] of Object.entries(attr||{}))e.setAttribute(k,String(v));if(parent)parent.append(e);return e;}
  function getFiltered(){return records.filter(r=>(state.category==='all'||r.category===state.category)&&(!state.search||`${r.title} ${r.region} ${r.state} ${r.restriction} ${r.why} ${catLabels[r.category]}`.toLowerCase().includes(state.search)));}
  function previewSvg(category){
    // Purpose-built illustrative mini diagrams, not measured bridge dimensions or turn paths.
    const common='<defs><linearGradient id="previewRoad" x1="0" x2="1"><stop stop-color="#132d44"/><stop offset="1" stop-color="#183a51"/></linearGradient></defs><rect width="500" height="174" rx="14" fill="#081c2c"/><path d="M0 138H500" stroke="#0d4a59" stroke-width="1" stroke-dasharray="5 6"/><path d="M25 150H475" stroke="#558194" stroke-width="2" stroke-dasharray="15 9" opacity=".65"/>';
    const truck='<g transform="translate(112 93)"><rect x="0" y="0" width="153" height="38" rx="6" fill="#b4d3e2"/><rect x="122" y="-5" width="51" height="43" rx="5" fill="#57a9bd"/><rect x="134" y="4" width="26" height="15" rx="2" fill="#173a57"/><circle cx="29" cy="40" r="10" fill="#0c1c2d" stroke="#8fb5c5" stroke-width="4"/><circle cx="146" cy="40" r="10" fill="#0c1c2d" stroke="#8fb5c5" stroke-width="4"/></g>';
    let art='';
    if(category==='clearance')art='<rect x="40" y="23" width="424" height="16" fill="#7d92a3"/><rect x="49" y="39" width="26" height="109" fill="#607f91"/><rect x="426" y="39" width="26" height="109" fill="#607f91"/><path d="M289 40V94 M279 51L289 40L299 51 M279 83L289 94L299 83" stroke="#ffb279" stroke-width="4" fill="none"/>'+truck+'<text x="318" y="79" fill="#ffcf9f" font-size="17" font-family="Arial" font-weight="800">LOW BRIDGE</text>';
    else if(category==='geometry')art='<path d="M0 106C105 30 165 171 270 83S405 34 500 96" fill="none" stroke="#6b91a0" stroke-width="57"/><path d="M0 106C105 30 165 171 270 83S405 34 500 96" fill="none" stroke="#1d3d53" stroke-width="52"/><path d="M0 106C105 30 165 171 270 83S405 34 500 96" stroke="#ecc56c" fill="none" stroke-dasharray="9 11" stroke-width="3"/><g transform="translate(175 35) rotate(20)"><rect width="129" height="23" rx="4" fill="#e1ddc4"/><rect x="114" y="-7" width="29" height="30" rx="4" fill="#78b4c7"/></g><circle cx="340" cy="51" r="23" fill="#ff857e" opacity=".88"/><text x="340" y="58" font-size="22" text-anchor="middle" font-family="Arial" font-weight="900" fill="#111b27">!</text>';
    else if(category==='weight')art='<path d="M25 110H477" stroke="#839eaf" stroke-width="13"/><path d="M25 123L76 155M477 123L426 155" stroke="#6a8fa0" stroke-width="9"/>'+truck+'<rect x="285" y="35" width="165" height="37" rx="5" fill="#eac978"/><text x="368" y="60" font-size="18" text-anchor="middle" font-family="Arial" font-weight="900" fill="#14243a">WEIGHT LIMIT</text>';
    else if(category==='hazmat')art=truck+'<path d="M315 33L352 104H278Z" fill="#f2a7ca"/><text x="315" y="87" font-size="35" text-anchor="middle" font-family="Arial" font-weight="900" fill="#24374a">!</text><text x="363" y="77" font-size="15" font-family="Arial" font-weight="800" fill="#ffd9e9">TUNNEL / CARGO</text>';
    else if(category==='weather')art=truck+'<path d="M23 51C105 12 107 73 194 46M265 27C346 -6 390 60 468 28M279 103C350 75 394 137 463 91" stroke="#84caff" stroke-width="5" stroke-linecap="round" fill="none" stroke-dasharray="16 8"/><text x="333" y="150" fill="#a6dafa" font-size="15" font-family="Arial" font-weight="800">CONDITIONS CHANGE</text>';
    else art=truck+'<circle cx="339" cy="64" r="43" fill="#f77779" stroke="#ffcbbe" stroke-width="5"/><path d="M312 37L366 91" stroke="#fff6e9" stroke-width="9"/><text x="395" y="130" fill="#ffafaa" text-anchor="middle" font-size="15" font-family="Arial" font-weight="800">TRUCKS RESTRICTED</text>';
    return `<svg viewBox="0 0 500 174" role="img" aria-label="Stylized ${esc(catLabels[category])} hazard diagram; not to scale">${common}${art}</svg>`;
  }
  function profile(){const vals={length:Number($('#truck-length').value),height:Number($('#truck-height').value),weight:Number($('#truck-weight').value),kpra:Number($('#truck-kpra').value),registration:Number($('#truck-registration').value)};if(Object.values(vals).some(v=>!Number.isFinite(v)||v<=0))return null;return vals;}
  function assess(r,v){
    const suffix=' This does NOT establish overall road clearance, route legality, an exception or current road status.';
    if(!v)return {tone:'warning',heading:'PROFILE INCOMPLETE',description:'Enter positive vehicle measurements to compare against the published restriction.'};
    if(r.rule==='ban')return {tone:'stop',heading:'PUBLISHED ACCESS RESTRICTION',description:'The published road restriction excludes commercial Class A traffic on this segment. Check any authority-issued exception; do not enter based on passenger GPS.'};
    if(r.rule==='length'){const hit=v.length>r.limit;return {tone:hit?'stop':'warning',heading:hit?'COMBINATION LENGTH CONFLICT':'LENGTH THRESHOLD NOT EXCEEDED',description:`Entered overall length ${v.length} ft; published threshold ${r.limit} ft. ${hit?'The selected combination exceeds the referenced length limit.':'Only this specific length comparison did not flag a conflict.'}${suffix}`};}
    if(r.rule==='kpra'){const hit=v.kpra>r.limit;return {tone:hit?'stop':'warning',heading:hit?'KPRA CONFLICT':'KPRA THRESHOLD NOT EXCEEDED',description:`Entered KPRA ${v.kpra} ft; published threshold ${r.limit} ft. ${hit?'The entered KPRA exceeds this restriction.':'Only KPRA was compared.'}${suffix}`};}
    if(r.rule==='weight'){const hit=v.weight>r.limit;return {tone:hit?'stop':'warning',heading:hit?'GROSS WEIGHT CONFLICT':'RESTRICTION / EXCEPTIONS NEED REVIEW',description:`Entered gross weight ${n(v.weight)} lb; referenced threshold ${n(r.limit)} lb. ${hit?'The entered weight exceeds the cited corridor restriction; published exceptions may apply.':'Only the weight threshold was compared.'}${suffix}`};}
    if(r.rule==='registration'){const hit=v.registration>=r.limit;return {tone:hit?'stop':'warning',heading:hit?'REGISTERED WEIGHT RESTRICTION':'REGISTRATION THRESHOLD NOT REACHED',description:`Entered registered weight ${n(v.registration)} lb; published restriction applies to heavy trucks registered at ${n(r.limit)} lb or more. ${hit?'This entered registration falls within the restricted class.':'Other restrictions can still apply.'}${suffix}`};}
    if(r.rule==='hazmat')return {tone:'warning',heading:'CARGO CLASSIFICATION REQUIRED',description:'Hazardous-material restrictions cannot be assessed from vehicle dimensions alone. Review placards, materials, quantities, permits and current tunnel rules.'};
    return {tone:'warning',heading:'VERIFY ROAD SEGMENT / CONDITIONS',description:'Current conditions, exceptions, load, trailer configuration, road signs and/or required certifications may determine applicability. This is not an automatic ban or a route-clearance approval.'};
  }
  function drawCurrentAssessment(){const r=records.find(z=>z.id===state.selected),out=$('#vehicle-result');if(!r||!out)return;const a=assess(r,profile());out.className=`vehicle-result ${a.tone}`;out.innerHTML=`<span>${esc(a.heading)}</span><p>${esc(a.description)}</p>`;}
  function infoMarkup(r){const limit=r.limit?`${r.rule==='registration'||r.rule==='weight'?n(r.limit)+' LB':r.limit+' FT'} LIMIT`:'OFFICIAL SEGMENT GUIDANCE';return `<div class="gps-detail-label"><span class="gps-category-dot" style="background:${catColors[r.category]}"></span>${esc(catLabels[r.category].toUpperCase())}<span class="gps-detail-source">GOVERNMENT SOURCE</span></div><h3>${esc(r.title)}</h3><p class="gps-detail-region">${esc(r.region)} · ${esc(r.state)} · ${esc(r.id)}</p><div class="gps-diagram">${previewSvg(r.category)}<span class="gps-diagram-annotation">SCHEMATIC / NOT TO SCALE</span></div><div class="gps-rule-label"><span>${esc(riskLabel[r.rule])}</span><strong>${esc(limit)}</strong></div><div class="gps-fact"><small>WHY PASSENGER GPS CAN MISLEAD</small><p>${esc(r.why)}</p></div><div class="gps-fact restriction"><small>PUBLISHED RESTRICTION OR GUIDANCE</small><p>${esc(r.restriction)}</p></div><div class="gps-fact action"><small>CLASS A CDL RESPONSE</small><p>${esc(r.action)}</p></div><a class="gps-authority-link" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">OPEN ${esc(r.authority)} REFERENCE ↗</a><p class="gps-detail-foot">Official publication reviewed ${esc(r.verifiedOn)}. Coordinates and lines are approximate. Check current signage and segment boundaries before acting.</p>`;}
  function selectRoad(id,focus=false,scroll=false){const r=records.find(z=>z.id===id);if(!r)return;state.selected=id;detail.innerHTML=infoMarkup(r);drawCurrentAssessment();
    $('#gps-mini-name').textContent=r.title;$('#gps-mini-status').textContent=`${catLabels[r.category]} · ${r.state} · authority referenced`;
    const side=$('#selected-panel');if(side){side.innerHTML=`<div class="selected-content"><div class="selected-type"><span>⚠ GPS TRAP ROAD</span><span class="type-chip">SOURCE-BACKED</span></div><h3>${esc(r.title)}</h3><p class="selected-city">${esc(r.region)}, ${esc(r.state)} · ${esc(catLabels[r.category])}</p><p class="selected-description">${esc(r.why)}</p><div class="selected-action"><b>PUBLISHED RULE / GUIDANCE</b>${esc(r.restriction)}</div><a href="${esc(r.url)}" class="source-link" target="_blank" rel="noopener noreferrer">VIEW ${esc(r.authority.toUpperCase())} SOURCE ↗</a><p class="selected-note">Diagram highlight only. Not road geometry or a current navigation clearance.</p></div>`;}
    renderList();drawMap();
    if(focus)window.ATLAS_TEST_API?.focusPoint?.(r.x,r.y,3.9);
    if(scroll)$('#gps-inspector').scrollIntoView({behavior:'smooth',block:'start'});
  }
  function renderList(){const visible=getFiltered();$('#trap-results').textContent=`${visible.length} of ${records.length} source-backed road profiles`;
    const f=document.createDocumentFragment();visible.forEach(r=>{const b=document.createElement('button');b.type='button';b.className='trap-item'+(r.id===state.selected?' active':'');b.setAttribute('aria-pressed',String(r.id===state.selected));b.innerHTML=`<span class="trap-symbol" style="--trap-accent:${catColors[r.category]}">${catSymbols[r.category]}</span><span class="trap-copy"><strong>${esc(r.title)}</strong><small>${esc(r.state)} / ${esc(catLabels[r.category])}</small></span><span class="trap-arrow">⌖</span>`;
    b.addEventListener('click',()=>selectRoad(r.id,true,true));f.append(b);});list.replaceChildren(f);
    if(!visible.length)list.innerHTML='<div class="trap-none">No matching named roads in this curated edition.</div>';
  }
  function polyline(group,r){let str=`M ${r.trace[0][0]} ${r.trace[0][1]}`;if(r.trace.length>1){const [a,b]=r.trace;const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;str+=` Q ${mx-6} ${my-7} ${b[0]} ${b[1]}`;}makeNode('path',{d:str,class:'trap-road-shadow','data-road':r.id},group);makeNode('path',{d:str,class:'trap-road-highlight','data-road':r.id,'stroke':catColors[r.category]},group);}
  function drawMap(){if(!state.show){lines.replaceChildren();points.replaceChildren();return;}lines.replaceChildren();points.replaceChildren();const vis=getFiltered();vis.forEach(r=>polyline(lines,r));const z=window.ATLAS_TEST_API?.getCamera?.().zoom || 1;
    const threshold=30/z,clusters=[];
    vis.forEach(r=>{let c=clusters.find(o=>Math.hypot(o.x-r.x,o.y-r.y)<threshold);if(c){c.items.push(r);c.x=c.items.reduce((a,v)=>a+v.x,0)/c.items.length;c.y=c.items.reduce((a,v)=>a+v.y,0)/c.items.length;}else clusters.push({x:r.x,y:r.y,items:[r]});});
    clusters.sort((a,b)=>b.items.length-a.items.length).forEach(c=>{
      const group=c.items.length>1;const r=c.items[0];const g=makeNode('g',{transform:`translate(${c.x} ${c.y}) scale(${1/z})`,class:group?'trap-cluster':'trap-marker'+(r.id===state.selected?' active':''),role:'button',tabindex:0,'aria-label':group?`${c.items.length} source-backed truck road issues; zoom to see each`:`Inspect ${r.title}`},points);
      if(group){makeNode('circle',{r:22,class:'trap-cluster-aura'},g);makeNode('circle',{r:16,class:'trap-cluster-core'},g);makeNode('text',{x:0,y:5,class:'trap-cluster-count'},g).textContent=c.items.length;}
      else{makeNode('circle',{r:20,class:'trap-halo'},g);makeNode('circle',{r:14,fill:catColors[r.category],class:'trap-pin'},g);makeNode('text',{x:0,y:5,class:'trap-glyph'},g).textContent='!';}
      const title=makeNode('title',{},g);title.textContent=group?`${c.items.length} GPS-trap road profiles (zoom in)`:r.title+' — '+r.restriction;
      const act=()=>{if(group)window.ATLAS_TEST_API?.focusPoint?.(c.x,c.y,Math.max(4,z*2));else selectRoad(r.id,false);};
      g.addEventListener('pointerdown',e=>e.stopPropagation());g.addEventListener('click',e=>{e.stopPropagation();act();});g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();act();}});
    });
  }
  function init(){
    $('#stat-gps').textContent=records.length;
    $('#trap-search').addEventListener('input',e=>{state.search=e.target.value.trim().toLowerCase();renderList();drawMap();});
    $('#trap-category').addEventListener('change',e=>{state.category=e.target.value;renderList();drawMap();});
    $('#trap-clear').addEventListener('click',()=>{$('#trap-search').value='';$('#trap-category').value='all';state.search='';state.category='all';renderList();drawMap();});
    $('#layer-gps-traps').addEventListener('change',e=>{state.show=e.target.checked;drawMap();});
    ['length','height','weight','kpra','registration'].forEach(name=>$('#truck-'+name).addEventListener('input',drawCurrentAssessment));
    window.addEventListener('atlas:camera',drawMap);
    // Draw with national viewport and a detailed featured entry for high-impact Smugglers Notch.
    state.selected='GPS-VT-01';selectRoad('GPS-VT-01',false,false);
    window.ATLAS_TRAP_TEST={records:()=>records.length,filtered:()=>getFiltered().length,selected:()=>state.selected,assess:(id,values)=>assess(records.find(r=>r.id===id),values),select:id=>selectRoad(id,true,false),mapPins:()=>points.children.length,mapLines:()=>lines.children.length};
  }
  init();
})();
