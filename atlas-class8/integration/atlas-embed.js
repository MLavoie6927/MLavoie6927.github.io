/*
 * ATLAS CLASS 8 | zero-dependency website embed | v3.0
 * Marc Lavoie | 2026-11-14
 * Add script + data-atlas-class8 element. This component never changes host styles.
 */
'use strict';
(()=>{
  const css=`.atlas-class8-mount{width:100%;max-width:100%;display:block;background:#0a1a27;border:1px solid #284757;border-radius:14px;overflow:hidden;box-shadow:0 22px 55px rgba(4,17,29,.2)}.atlas-class8-mount iframe{border:0;display:block;width:100%;height:1000px;min-height:650px;background:#0a1a27}`;
  const style=document.createElement('style');style.textContent=css;document.head.append(style);
  const mounts=new Map();
  function connect(node){
    if(node.dataset.atlasReady==='1')return;
    node.dataset.atlasReady='1';
    node.classList.add('atlas-class8-mount');
    const source=node.getAttribute('data-atlas-src')||'./atlas-class8/index.html?embed=1#explorer';
    const frame=document.createElement('iframe');
    frame.title=node.getAttribute('data-atlas-title')||'ATLAS Class 8 interactive semi-truck and trailer engineering lab';
    frame.src=source;
    frame.loading='lazy';
    frame.setAttribute('allowfullscreen','');
    frame.setAttribute('referrerpolicy','strict-origin-when-cross-origin');
    node.append(frame);
    mounts.set(frame,node);
  }
  function connectAll(){document.querySelectorAll('[data-atlas-class8]').forEach(connect);}
  window.addEventListener('message',event=>{
    if(!event.data||event.data.source!=='ATLAS_CLASS8_FRAME'||event.data.type!=='resize')return;
    for(const [iframe] of mounts){
      if(event.source!==iframe.contentWindow)continue;
      // The iframe itself is the required source; cross-site messages are ignored.
      const height=Number(event.data.height);
      if(!Number.isFinite(height)||height<500||height>30000)return;
      iframe.style.height=Math.ceil(height+3)+'px';
      return;
    }
  });
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',connectAll);else connectAll();
})();
