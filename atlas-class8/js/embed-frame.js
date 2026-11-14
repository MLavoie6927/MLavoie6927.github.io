/* ATLAS v3 | child-frame height signaling | Marc Lavoie | 2026-11-14 */
'use strict';
(()=>{
  const query=new URLSearchParams(location.search);
  if(query.get('embed')!=='1'||window.parent===window)return;
  document.body.classList.add('embed');
  let last=0;
  function send(){
    const h=Math.ceil(Math.max(document.documentElement.scrollHeight,document.body.scrollHeight));
    if(Math.abs(h-last)<2)return;last=h;
    // Content is height only; no personal data is sent to the host page.
    window.parent.postMessage({source:'ATLAS_CLASS8_FRAME',type:'resize',height:h},'*');
  }
  const start=()=>{
    send();
    if('ResizeObserver' in window){const observer=new ResizeObserver(send);observer.observe(document.documentElement);observer.observe(document.body);observer.observe(document.getElementById('mainContent'));}
    window.addEventListener('load',send);
    window.addEventListener('resize',send);
    window.addEventListener('hashchange',send);
    document.addEventListener('click',send,{passive:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
