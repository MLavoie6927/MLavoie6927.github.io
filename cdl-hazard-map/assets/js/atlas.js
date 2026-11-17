/* ATLAS U.S. Class A CDL Road Hazard Atlas | Marc Lavoie | 2026-11-17
   Standalone visual reference, no remote dependencies and NO navigation authorization.
*/
(() => {
 'use strict';
 const embedMode=new URLSearchParams(window.location.search).get('embed');
 if(embedMode==='1'||embedMode==='map'){document.body.classList.add('embed');if(embedMode==='map')document.body.classList.add('map-only');}
 const geo = window.ATLAS_GEOGRAPHY;
 const hazards = window.ATLAS_HAZARDS;
 if (!geo || !Array.isArray(hazards)) {document.body.textContent='ATLAS data files could not be loaded.';return;}
 const W=1250,H=790, NS='http://www.w3.org/2000/svg';
 const colors={access:'#ff7780',clearance:'#ffa465',geometry:'#c09cf9',weather:'#66c2f8',weight:'#edcf79',hazmat:'#f98ad7',facility:'#65e0b7'};
 const glyphs={access:'×',clearance:'↕',geometry:'↪',weather:'≋',weight:'⚖',hazmat:'◇',facility:'▣'};
 const titles={access:'Restricted roads',clearance:'Low clearance',geometry:'Length / geometry',weather:'Weather / wind',weight:'Weight / bridges',hazmat:'Hazardous materials',facility:'Pickups / docks'};
 const $=s=>document.querySelector(s);
 const svg=$('#usa-map'), canvas=$('#map-canvas');
 const groups={states:$('#map-states'),labels:$('#map-labels'),heat:$('#map-heat'),corridors:$('#map-corridors'),markers:$('#map-markers'),insets:$('#map-insets')};
 const tooltip=$('#map-tooltip');
 const filters={category:'all',status:'all',state:'',search:'',showOfficial:true,showIllustrative:true,heat:true,corridors:true,labels:true};
 const camera={x:0,y:0,w:W,h:H};
 let zoom=1,selectedId='',lastMarkerCount=0,isDragging=false,pointerStart=null,moved=false;
 const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function el(tag,attr={},parent=null){const node=document.createElementNS(NS,tag);Object.entries(attr).forEach(([k,v])=>node.setAttribute(k,String(v)));if(parent)parent.append(node);return node;}
 function fmt(n){return Number(n).toLocaleString('en-US');}
 function getFiltered(includeView=false){
   const q=filters.search.trim().toLowerCase();
   return hazards.filter(h=>{
     if(filters.category!=='all'&&h.category!==filters.category)return false;
     if(filters.status!=='all'&&h.status!==filters.status)return false;
     if(h.status==='official'&&!filters.showOfficial)return false;
     if(h.status==='illustrative'&&!filters.showIllustrative)return false;
     if(filters.state&&h.state!==filters.state)return false;
     if(q&&!`${h.title} ${h.place} ${h.state} ${h.summary} ${titles[h.category]}`.toLowerCase().includes(q))return false;
     if(includeView&&(h.x<camera.x-20||h.x>camera.x+camera.w+20||h.y<camera.y-20||h.y>camera.y+camera.h+20))return false;
     return true;
   });
 }
 function cameraSet(x,y,w,h){
   const nW=clamp(w,W/7,W),nH=nW*H/W;
   camera.w=nW;camera.h=nH;camera.x=clamp(x,0,W-nW);camera.y=clamp(y,0,H-nH);
   zoom=W/nW;svg.setAttribute('viewBox',`${camera.x} ${camera.y} ${nW} ${nH}`);
   $('#zoom-level').textContent=`${Math.round(zoom*100)}%`;
   drawMarkers();renderList();window.dispatchEvent(new CustomEvent('atlas:camera',{detail:{x:camera.x,y:camera.y,w:camera.w,h:camera.h,zoom}}));
 }
 function zoomAt(factor,x=camera.x+camera.w/2,y=camera.y+camera.h/2){
   const newW=clamp(camera.w/factor,W/7,W);
   const relativeX=(x-camera.x)/camera.w,relativeY=(y-camera.y)/camera.h;
   cameraSet(x-relativeX*newW,y-relativeY*newW*(H/W),newW,newW*(H/W));
 }
 function focusPoint(x,y,target=2.8){
   const z=Math.max(target,zoom);const width=W/z;
   cameraSet(x-width/2,y-(width*H/W)/2,width,width*H/W);
 }
 function resetCamera(){cameraSet(0,0,W,H);}
 function eventPoint(e){const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse());}
 function createBaseMap(){
   const stateHigh=hazards.reduce((acc,h)=>{if(h.status==='official')acc[h.state]=(acc[h.state]||0)+1;return acc;},{});
   geo.states.forEach(s=>{
     const p=el('path',{d:s.path,'data-state':s.abbr,class:`state-path${stateHigh[s.abbr]?' state-dense':''}`,role:'button',tabindex:'0','aria-label':`${s.name}, filter hazards`,'fill-rule':'evenodd'},groups.states);
     el('title',{},p).textContent=`${s.name} — select state`;
     p.addEventListener('click',()=>selectState(s.abbr));
     p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectState(s.abbr);}});
     // Small northeastern state labels clutter the map; labels are selectively drawn.
     if(!['DC','RI','DE','CT','NJ','MA','MD'].includes(s.abbr))el('text',{x:s.cx,y:s.cy,'class':`state-label${['HI','VT','NH'].includes(s.abbr)?' tiny':''}`},groups.labels).textContent=s.abbr;
   });
   el('path',{d:'M 84 615 H 356 V 765 H 84 Z',class:'inset-bracket'},groups.insets);
   el('path',{d:'M 364 687 H 550 V 765 H 364 Z',class:'inset-bracket'},groups.insets);
   el('text',{x:102,y:628,class:'inset-label'},groups.insets).textContent='ALASKA';
   el('text',{x:375,y:707,class:'inset-label'},groups.insets).textContent='HAWAII';
   // Generalized corridor guides, not road geometry or certified truck routes.
   const byId=Object.fromEntries(hazards.map(h=>[h.id,h]));
   const routes=[
     ['ZONE-WA-01','ZONE-OR-01','US-CA-08','US-CA-01','US-CA-07'],
     ['US-CA-01','ZONE-AZ-01','ZONE-NM-01','ZONE-TX-02','ZONE-TX-01','ZONE-LA-01','ZONE-AL-01','ZONE-FL-01'],
     ['ZONE-NV-01','ZONE-UT-01','US-WY-01','ZONE-NE-01','ZONE-IA-01','ZONE-IL-01','ZONE-OH-01'],
     ['ZONE-FL-01','ZONE-GA-01','ZONE-NC-01','ZONE-VA-01','ZONE-DC-01','ZONE-PA-02','US-NY-01','US-MA-01'],
     ['ZONE-WA-01','ZONE-MT-01','ZONE-SD-01','ZONE-MN-01','ZONE-WI-01','ZONE-IL-01','ZONE-MI-01'],
     ['ZONE-AZ-01','ZONE-NM-01','ZONE-OK-01','ZONE-AR-01','ZONE-TN-02','ZONE-TN-01','ZONE-NC-01'],
     ['ZONE-TX-01','ZONE-LA-01','ZONE-MS-01','ZONE-AL-01','ZONE-GA-01','ZONE-SC-01'],
   ];
   routes.forEach((ids)=>{
     const pts=ids.map(id=>byId[id]).filter(Boolean);
     const d=pts.map((p,i)=>(i?'L':'M')+p.x+' '+p.y).join(' ');
     el('path',{d,class:'corridor halo'},groups.corridors);
     el('path',{d,class:'corridor'},groups.corridors);
   });
   updateLayers();
 }
 function updateLayers(){groups.labels.style.display=filters.labels?'':'none';groups.corridors.style.display=filters.corridors?'':'none';groups.heat.style.display=filters.heat?'':'none';
   for(const p of groups.states.children){if(p.nodeName==='path')p.classList.toggle('state-active',filters.state===p.dataset.state);}
 }
 function selectState(state){filters.state=filters.state===state?'':state;updateLayers();drawMarkers();renderList();
   const s=geo.states.find(v=>v.abbr===filters.state);$('#map-mode').textContent=s?`${s.name.toUpperCase()} SELECTED`: (filters.category==='all'?'ALL CATEGORIES':titles[filters.category].toUpperCase());
   if(s){const locals=getFiltered(false);if(locals.length){focusPoint(locals[0].x,locals[0].y,Math.max(zoom,2));}else{resetCamera();}}else{resetCamera();}}
 function makeHeat(list){groups.heat.replaceChildren();
   if(!filters.heat)return;
   // Heat here is visual emphasis / concentration of curated entries, NOT collision frequency.
   const rough=list.filter((_,i)=>i%1===0);
   rough.forEach(h=>el('circle',{cx:h.x,cy:h.y,r:h.status==='official'?62:39,fill:h.status==='official'?'url(#heat-gradient)':'url(#heat-gradient-cyan)','pointer-events':'none',opacity:h.status==='official'?.78:.65},groups.heat));
 }
 function makeClusterPin(items){const isGroup=items.length>1;
   const x=items.reduce((a,i)=>a+i.x,0)/items.length,y=items.reduce((a,i)=>a+i.y,0)/items.length;
   const zoomComp=1/zoom; // marker sizes remain fairly consistent when zooming
   const g=el('g',{transform:`translate(${x} ${y}) scale(${zoomComp})`,class:isGroup?'cluster':'map-marker'+(items[0].id===selectedId?' selected':''),tabindex:'0',role:'button','aria-label':isGroup?`Zoom to group of ${items.length} map points`:items[0].title},groups.markers);
   if(isGroup){
     el('circle',{cx:0,cy:0,r:28,class:'cluster-glow'},g);el('circle',{cx:0,cy:0,r:22,class:'cluster-outer'},g);el('circle',{cx:0,cy:0,r:17,class:'cluster-ring'},g);
     el('text',{x:0,y:1,class:'cluster-number'},g).textContent=items.length;
   }else{
     const h=items[0],color=colors[h.category];
     el('circle',{cx:0,cy:0,r:19,fill:color,class:'halo'},g);
     el('circle',{cx:0,cy:0,r:19,class:'selection-ring'},g);
     el('circle',{cx:0,cy:0,r:12.8,stroke:color,class:'pinring'},g);
     el('circle',{cx:0,cy:0,r:7.6,fill:color,class:'inner'},g);
     el('text',{x:0,y:.5,class:'glyph'},g).textContent=glyphs[h.category];
     if(h.status==='illustrative'){el('circle',{cx:9.2,cy:-9.2,r:3.5,fill:'#82c2d8',stroke:'#081f2b','stroke-width':'1'},g);}
   }
   function activate(){if(isGroup){focusPoint(x,y,zoom*1.9);}else selectHazard(items[0].id,true);}
   g.addEventListener('click',e=>{e.stopPropagation();activate();});
   g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});
   g.addEventListener('pointerenter',e=>showTooltip(e,isGroup?`${items.length} locations grouped`:items[0].title,isGroup?'ZOOM TO EXPAND':items[0].place));
   g.addEventListener('pointermove',e=>moveTooltip(e));
   g.addEventListener('pointerleave',hideTooltip);
 }
 function drawMarkers(){
   const list=getFiltered();lastMarkerCount=list.length;
   groups.markers.replaceChildren();makeHeat(list);
   // Geo-space clustering scales with view zoom, while marker symbols stay on-screen size.
   const threshold=32/zoom;
   const clusters=[];
   list.forEach(h=>{
     let c=clusters.find(c=>Math.hypot(c.x-h.x,c.y-h.y)<threshold);
     if(c){c.items.push(h);c.x=c.items.reduce((a,i)=>a+i.x,0)/c.items.length;c.y=c.items.reduce((a,i)=>a+i.y,0)/c.items.length;}
     else clusters.push({x:h.x,y:h.y,items:[h]});
   });
   clusters.sort((a,b)=>a.items.length-b.items.length).forEach(c=>makeClusterPin(c.items));
   $('#shown-count').textContent=fmt(list.length);
   $('#stat-total').textContent=hazards.length;
   $('#stat-verified').textContent=hazards.filter(h=>h.status==='official').length;
   $('#stat-planning').textContent=hazards.filter(h=>h.status==='illustrative').length;
 }
 function showTooltip(e,title,sub){tooltip.hidden=false;tooltip.innerHTML=`<small>MAP INTELLIGENCE</small><b>${esc(title)}</b><span>${esc(sub)}</span>`;moveTooltip(e);}
 function moveTooltip(e){if(tooltip.hidden)return;const r=canvas.getBoundingClientRect();const left=clamp(e.clientX-r.left+15,8,r.width-280),top=clamp(e.clientY-r.top+12,8,r.height-82);tooltip.style.left=`${left}px`;tooltip.style.top=`${top}px`;}
 function hideTooltip(){tooltip.hidden=true;}
 function selectHazard(id,doFocus){const h=hazards.find(v=>v.id===id);if(!h)return;selectedId=id;
  const official=h.status==='official';
  $('#selected-panel').innerHTML=`<div class="selected-content"><div class="selected-type"><span>${esc(titles[h.category].toUpperCase())}</span><span class="type-chip ${official?'':'illustrative'}">${official?'SOURCE-BACKED':'ILLUSTRATIVE ONLY'}</span></div><h3>${esc(h.title)}</h3><p class="selected-city">${esc(h.place)}, ${esc(h.state)} · ${esc(h.kind)}</p><p class="selected-description">${esc(h.summary)}</p><div class="selected-action"><b>OPERATIONAL CONSIDERATION</b>${esc(h.action)}</div>${official?`<a class="source-link" target="_blank" rel="noopener noreferrer" href="${esc(h.url)}">VIEW ${esc(h.source.toUpperCase())} SOURCE <span aria-hidden="true">↗</span></a>`:`<div class="selected-note">${esc(h.detail)}</div>`}<p class="selected-note" style="margin-top:12px">Approximate regional pin, not a navigable or survey-accurate road location. Recheck current restrictions with the responsible authority.</p></div>`;
  if(doFocus)focusPoint(h.x,h.y,2.6);else drawMarkers();
  renderList();
 }
 function renderList(){const list=getFiltered(true);
   const wrap=$('#location-list');wrap.replaceChildren();$('#list-count').textContent=`${list.length} results`;
   if(!list.length){const n=document.createElement('div');n.className='no-results';n.textContent='No matching locations in this view. Reset filters or zoom out to see more.';wrap.append(n);return;}
   // Listing official-first is intentional; does not imply that illustrations are recorded crashes.
   list.sort((a,b)=>(a.id===selectedId?-1:0)-(b.id===selectedId?-1:0)|| (a.status===b.status?0:a.status==='official'?-1:1)||a.state.localeCompare(b.state));
   const fragment=document.createDocumentFragment();
   list.forEach(h=>{
     const btn=document.createElement('button');btn.type='button';btn.className='location-item'+(h.id===selectedId?' active':'');
     btn.innerHTML=`<span class="location-symbol" style="--symbol:${colors[h.category]}">${esc(glyphs[h.category])}</span><span class="location-copy"><strong>${esc(h.title)}</strong><small>${esc(h.place)}, ${esc(h.state)} · ${h.status==='official'?'Source-backed':'Planning example'}</small></span><span class="location-arrow">›</span>`;
     btn.addEventListener('click',()=>selectHazard(h.id,true));fragment.append(btn);
   });wrap.append(fragment);
 }
 function setCategory(category){filters.category=category;filters.state='';
   document.querySelectorAll('.filter-pill').forEach(b=>{const active=b.dataset.category===category;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
   $('#map-mode').textContent=category==='all'?'ALL CATEGORIES':titles[category].toUpperCase();updateLayers();resetCamera();}
 function setStatus(status){filters.status=status;document.querySelectorAll('.status-tab').forEach(b=>{const on=b.dataset.status===status;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});drawMarkers();renderList();}
 function resetAll(){filters.search='';filters.state='';filters.category='all';filters.status='all';$('#search-input').value='';setCategory('all');setStatus('all');resetCamera();}
 function saveSvg(){
   // Save full national extent, independent of the current zoom, with visual-only map data.
   const cloned=svg.cloneNode(true);cloned.setAttribute('xmlns',NS);cloned.setAttribute('viewBox',`0 0 ${W} ${H}`);cloned.setAttribute('width',String(W));cloned.setAttribute('height',String(H));
   const original=svg.getAttribute('viewBox');svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
   // Internal stylesheet so exported diagram retains the critical visual categories.
   const style=el('style',{},cloned);style.textContent=`.state-path{fill:#18384a;stroke:#456a7c;stroke-width:1}.state-dense{fill:#204357}.state-label{font:700 11px Arial;fill:#8ab9c8;text-anchor:middle;stroke:#071826;stroke-width:2;paint-order:stroke}.inset-label{font:700 13px Arial;fill:#8ad8d4}.inset-bracket{fill:none;stroke:#6193a3;stroke-width:1;stroke-dasharray:4 7}.corridor{fill:none;stroke:#65e5dd;stroke-opacity:.35;stroke-width:2;stroke-dasharray:8 7}.corridor.halo{stroke-opacity:.08;stroke-width:9;stroke-dasharray:none}.glyph{fill:white;font:900 14px Arial;text-anchor:middle;dominant-baseline:middle}.pinring{fill:#092033;stroke-width:2}.inner{stroke:#092033;stroke-width:2}.halo{opacity:.2}.cluster-ring{fill:#16394c;stroke:#88e6e1;stroke-width:2}.cluster-number{fill:#fff;font:800 15px Arial;text-anchor:middle;dominant-baseline:middle}.cluster-outer{fill:none;stroke:#88dcd9;stroke-dasharray:3 5}.cluster-glow{fill:#55d5d5;opacity:.15}.selected{opacity:1}.trap-road-shadow{fill:none;stroke:#ff945c;stroke-opacity:.22;stroke-width:10;stroke-linecap:round}.trap-road-highlight{fill:none;stroke-width:3.4;stroke-linecap:round;stroke-dasharray:4 5;stroke-opacity:.95}.trap-pin{stroke:#fff1d8;stroke-width:2.7}.trap-halo{fill:#ff9548;fill-opacity:.19;stroke:#ffab69;stroke-width:1.2}.trap-glyph{text-anchor:middle;fill:#092034;font:900 17px Arial}.trap-cluster-aura{fill:#f4a366;fill-opacity:.17;stroke:#f7b679;stroke-width:1.5;stroke-dasharray:3 3}.trap-cluster-core{fill:#bf6b38;stroke:#fff0d7;stroke-width:2}.trap-cluster-count{text-anchor:middle;fill:#fff4e8;font:900 13px Arial}`;
   cloned.querySelectorAll('[tabindex],[role],[aria-label]').forEach(n=>{n.removeAttribute('tabindex');n.removeAttribute('role');n.removeAttribute('aria-label');});
   // Regenerate markers at 100% for export so zoom transforms do not affect their size.
   cloned.querySelectorAll('#map-markers > g, #map-trap-markers > g').forEach(n=>{const t=n.getAttribute('transform');if(t)n.setAttribute('transform',t.replace(/ scale\([^)]*\)/,''));});
   const serialization=new XMLSerializer().serializeToString(cloned);svg.setAttribute('viewBox',original);
   const url=URL.createObjectURL(new Blob([serialization],{type:'image/svg+xml;charset=utf-8'}));
   const a=document.createElement('a');a.href=url;a.download='ATLAS-USA-Class-A-CDL-Hazard-Map.svg';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 function init(){createBaseMap();drawMarkers();renderList();
   document.querySelectorAll('.filter-pill').forEach(b=>b.addEventListener('click',()=>setCategory(b.dataset.category)));
   document.querySelectorAll('.status-tab').forEach(b=>b.addEventListener('click',()=>setStatus(b.dataset.status)));
   $('#search-input').addEventListener('input',e=>{filters.search=e.target.value;filters.state='';updateLayers();drawMarkers();renderList();});
   $('#clear-search').addEventListener('click',resetAll);
   ['official','illustrative','heat','corridors','labels'].forEach(layer=>$('#layer-'+layer).addEventListener('change',e=>{
      const field={official:'showOfficial',illustrative:'showIllustrative',heat:'heat',corridors:'corridors',labels:'labels'}[layer];filters[field]=e.target.checked;updateLayers();drawMarkers();renderList();
   }));
   $('#zoom-in').addEventListener('click',()=>zoomAt(1.45));$('#zoom-out').addEventListener('click',()=>zoomAt(1/1.45));
   $('#zoom-reset').addEventListener('click',resetCamera);$('#save-svg').addEventListener('click',saveSvg);
   svg.addEventListener('wheel',e=>{e.preventDefault();const p=eventPoint(e);zoomAt(e.deltaY<0?1.32:1/1.32,p.x,p.y);},{passive:false});
   svg.addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('.map-marker,.cluster,.trap-marker,.trap-cluster'))return;isDragging=true;moved=false;const p=eventPoint(e);pointerStart={x:p.x,y:p.y,camX:camera.x,camY:camera.y};svg.classList.add('dragging');svg.setPointerCapture(e.pointerId);});
   svg.addEventListener('pointermove',e=>{if(!isDragging||!pointerStart)return;const p=eventPoint(e);const dx=p.x-pointerStart.x,dy=p.y-pointerStart.y;if(Math.abs(dx)+Math.abs(dy)>2)moved=true;cameraSet(pointerStart.camX-dx,pointerStart.camY-dy,camera.w,camera.h);});
   function endPan(e){if(!isDragging)return;isDragging=false;pointerStart=null;svg.classList.remove('dragging');if(svg.hasPointerCapture(e.pointerId))svg.releasePointerCapture(e.pointerId);}
   svg.addEventListener('pointerup',endPan);svg.addEventListener('pointercancel',endPan);
   svg.addEventListener('keydown',e=>{if(e.key==='+'||e.key==='='){zoomAt(1.4);e.preventDefault();}if(e.key==='-'){zoomAt(1/1.4);e.preventDefault();}if(e.key==='0'){resetCamera();e.preventDefault();}});
   document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();$('#search-input').focus();}if(e.key==='Escape'){hideTooltip();if(document.activeElement===$('#search-input'))$('#search-input').blur();}});
   window.addEventListener('resize',hideTooltip);
   window.ATLAS_TEST_API={focusPoint:(x,y,zoomTarget=3)=>focusPoint(x,y,zoomTarget),getCamera:()=>({...camera,zoom}),getFiltered:()=>getFiltered(),getCounts:()=>({total:hazards.length,official:hazards.filter(h=>h.status==='official').length,planning:hazards.filter(h=>h.status==='illustrative').length,visible:lastMarkerCount}),focus:id=>selectHazard(id,true),reset:resetAll,zoom:()=>zoom};
 }
 init();
})();
