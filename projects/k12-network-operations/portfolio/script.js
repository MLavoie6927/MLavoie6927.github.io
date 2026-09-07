(() => {
  const D = window.PORTFOLIO_DATA;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

  // Role-alignment cards
  const roleGrid = document.getElementById('roleGrid');
  roleGrid.innerHTML = D.roles.map(([abbr,title,copy]) => `
    <article class="role-card"><span>${esc(abbr)}</span><h3>${esc(title)}</h3><p>${esc(copy)}</p></article>`).join('');

  // Case studies
  const caseContent = document.getElementById('caseContent');
  function renderCase(key) {
    const c = D.cases[key];
    caseContent.innerHTML = `
      <div class="case-top">
        <div><div class="section-label">${esc(c.id)} · ${esc(c.domain)}</div><h3>${esc(c.title)}</h3><p>${esc(c.summary)}</p></div>
        <span class="case-severity">${esc(c.severity)}</span>
      </div>
      <div class="case-layout">
        <div class="case-timeline">${c.steps.map((s,i)=>`<div class="case-step"><span class="num">${i+1}</span><div><strong>${esc(s[0])}</strong><p>${esc(s[1])}</p></div></div>`).join('')}</div>
        <div class="evidence-box"><div class="evidence-head"><span>SYNTHETIC EVIDENCE EXCERPT</span><b>READ-ONLY</b></div><pre>${esc(c.evidence)}</pre></div>
      </div>
      <div class="case-result">${c.result.map(([a,b])=>`<div><span>${esc(a)}</span><strong>${esc(b)}</strong></div>`).join('')}</div>`;
  }
  document.querySelectorAll('[data-case]').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('[data-case]').forEach(b => {b.classList.toggle('active', b === btn); b.setAttribute('aria-selected', b === btn ? 'true' : 'false');});
    renderCase(btn.dataset.case);
  }));
  renderCase('wan');

  // Synthetic chart
  const chart = document.getElementById('wanChart');
  const values = [31,28,26,25,29,35,44,53,61,57,49,45,43,47,52,58,65,62,55,48,44,40,37,33];
  const W=760,H=190,pad=18,max=80;
  const x=i=>pad+i*((W-pad*2)/(values.length-1));
  const y=v=>H-pad-v*(H-pad*2)/max;
  let path = values.map((v,i)=>`${i?'L':'M'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  let area = `${path} L ${x(values.length-1)} ${H-pad} L ${x(0)} ${H-pad} Z`;
  chart.innerHTML = `
    <defs><linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#67d5ff" stop-opacity=".24"/><stop offset="1" stop-color="#67d5ff" stop-opacity="0"/></linearGradient></defs>
    ${[20,40,60,80].map(v=>`<line x1="${pad}" y1="${y(v)}" x2="${W-pad}" y2="${y(v)}" stroke="#17374f" stroke-width="1"/><text x="${pad}" y="${y(v)-5}" fill="#58738b" font-size="10">${v}%</text>`).join('')}
    <path d="${area}" fill="url(#areaG)"/><path d="${path}" fill="none" stroke="#67d5ff" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    ${values.map((v,i)=>i%4===0?`<circle cx="${x(i)}" cy="${y(v)}" r="3" fill="#06101d" stroke="#67d5ff" stroke-width="2"/>`:``).join('')}
  `;

  // Ticket metrics
  const open = D.tickets.filter(t => String(t.status).toLowerCase() !== 'resolved');
  document.getElementById('openTickets').textContent = open.length;
  const sevCounts = ['P1','P2','P3','P4'].map(s => [s, open.filter(t=>t.severity===s).length]);
  const maxCount = Math.max(1,...sevCounts.map(x=>x[1]));
  document.getElementById('severityBars').innerHTML = sevCounts.map(([s,n])=>`<div class="sev-row"><b>${s}</b><span class="sev-track"><i style="width:${Math.round((n/maxCount)*100)}%"></i></span><span>${n}</span></div>`).join('');

  // Domain key from scenarios grouped broadly
  const broad = {Network:0,Identity:0,Security:0,Cloud:0,Endpoint:0};
  D.scenarios.forEach(s=>{
    const f=(s.fault_domain||'').toLowerCase();
    if(/dns|dhcp|wan|routing|network|idf|wireless|capacity/.test(f)) broad.Network++;
    else if(/ad|entra|identity|ntp/.test(f)) broad.Identity++;
    else if(/filter|firewall|segment|security|tls/.test(f)) broad.Security++;
    else if(/m365|google|saas|mail|cloud/.test(f)) broad.Cloud++;
    else broad.Endpoint++;
  });
  const keyColors=['#67d5ff','#9d9cff','#63e6a7','#ffd166','#55718a'];
  document.getElementById('domainKey').innerHTML = Object.entries(broad).map(([k,v],i)=>`<span><i style="background:${keyColors[i]}"></i>${esc(k)} ${v}</span>`).join('');

  // District inventory
  const tbody = document.getElementById('districtRows');
  function renderDistricts(q='') {
    q=q.trim().toLowerCase();
    const rows=D.districts.filter(d => !q || `${d.id} ${d.name}`.toLowerCase().includes(q)).slice(0,35);
    tbody.innerHTML=rows.map(d=>{
      const totalWan=d.sites.reduce((a,s)=>a+(s.wan_mbps||0),0);
      return `<tr><td><strong>${esc(d.id)}</strong><br><span style="color:#7893a9">${esc(d.name)}</span></td><td>${d.sites.length}</td><td>${Number(d.asset_count).toLocaleString()}</td><td>${totalWan>=1000?(totalWan/1000).toFixed(1)+' Gbps':totalWan+' Mbps'}</td><td>${d.platforms.slice(0,3).map(p=>esc(p)).join(' · ')}</td><td><span class="health-pill"><i></i>${d.demo_health}%</span></td></tr>`;
    }).join('');
  }
  renderDistricts();
  document.getElementById('districtSearch').addEventListener('input',e=>renderDistricts(e.target.value));

  // Code tabs
  const codeEl=document.getElementById('codeSample'), titleEl=document.getElementById('terminalTitle');
  function highlight(text){
    return esc(text)
      .replace(/(^|\n)(#.*)/g,'$1<span class="cm">$2</span>')
      .replace(/\b(Get-[A-Za-z]+|Select-Object|Resolve-DnsName|python|ip|ss|ping|permit|deny|interface|description)\b/g,'<span class="kw">$1</span>')
      .replace(/(&quot;.*?&quot;|'.*?')/g,'<span class="str">$1</span>');
  }
  function renderCode(k){const c=D.code[k];titleEl.textContent=c.title;codeEl.innerHTML=highlight(c.text)}
  document.querySelectorAll('[data-code]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-code]').forEach(b=>b.classList.toggle('active',b===btn));renderCode(btn.dataset.code)}));
  renderCode('powershell');

  // Soft scroll spy on primary nav
  const sections=[...document.querySelectorAll('main section[id]')];
  const navLinks=[...document.querySelectorAll('.topnav a')];
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){navLinks.forEach(a=>a.style.color=a.getAttribute('href')==='#'+e.target.id?'#fff':'')}})}, {rootMargin:'-25% 0px -65% 0px'});
    sections.forEach(s=>io.observe(s));
  }
})();
