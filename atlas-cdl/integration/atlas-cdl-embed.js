/*
 * ATLAS CDL embed adapter — Marc Lavoie — 2026-11-14
 * Keeps the quiz app same-origin and isolated from host website CSS.
 * Host page should include an iframe[data-atlas-cdl-embed].
 */
(() => {
  'use strict';
  const frames=[...document.querySelectorAll('iframe[data-atlas-cdl-embed]')];
  if(!frames.length)return;
  for(const f of frames){f.style.width='100%';f.style.border='0';f.style.display='block';f.style.minHeight='680px';f.style.height='1100px';f.setAttribute('loading','lazy');f.setAttribute('title',f.getAttribute('title')||'ATLAS CDL Exam Academy');}
  window.addEventListener('message',event=>{
    if(event.origin!==window.location.origin)return;
    if(!event.data||event.data.type!=='atlas-cdl:resize')return;
    const frame=frames.find(f=>f.contentWindow===event.source);
    if(!frame)return;
    const h=Number(event.data.height);
    if(!Number.isFinite(h)||h<250||h>100000)return;
    frame.style.height=`${Math.ceil(h+2)}px`;
  });
})();
