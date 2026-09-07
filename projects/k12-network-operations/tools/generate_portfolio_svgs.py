from pathlib import Path
from html import escape

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets' / 'portfolio'
OUT.mkdir(parents=True, exist_ok=True)

STYLE = '''
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#071522"/><stop offset="1" stop-color="#0b2034"/></linearGradient>
  <linearGradient id="panel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#102a42"/><stop offset="1" stop-color="#0a1c2d"/></linearGradient>
  <linearGradient id="cyan" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#43bfe9"/><stop offset="1" stop-color="#7ee0ff"/></linearGradient>
  <filter id="glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <marker id="arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0 0 L12 6 L0 12 z" fill="#67d5ff"/></marker>
  <marker id="arrow-muted" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0 0 L12 6 L0 12 z" fill="#4e7895"/></marker>
</defs>
<style>
  .bg{fill:url(#bg)}.panel{fill:url(#panel);stroke:#2f6181;stroke-width:2}.panel2{fill:#0b2135;stroke:#244b66;stroke-width:2}.title{font:700 32px Inter,Segoe UI,Arial,sans-serif;fill:#eef7ff}.h{font:700 22px Inter,Segoe UI,Arial,sans-serif;fill:#edf6ff}.t{font:15px Inter,Segoe UI,Arial,sans-serif;fill:#9eb4c8}.small{font:12px Inter,Segoe UI,Arial,sans-serif;fill:#7896ad;letter-spacing:.04em}.tag{font:700 12px Inter,Segoe UI,Arial,sans-serif;fill:#7fdcff;letter-spacing:.12em}.line{stroke:#67d5ff;stroke-width:4;fill:none;marker-end:url(#arrow)}.mutedline{stroke:#456e8a;stroke-width:3;fill:none;marker-end:url(#arrow-muted)}.dash{stroke:#365d77;stroke-width:2;stroke-dasharray:8 8;fill:none}.good{fill:#63e6a7}.warn{fill:#ffd166}.bad{fill:#ff7f8e}.cyan{fill:#67d5ff}.icon{stroke:#78dfff;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round}
</style>'''

def svg(width,height,body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img">{STYLE}<rect width="100%" height="100%" rx="28" class="bg"/>{body}</svg>'

def txt(x,y,s,cls='t',anchor='start'):
    return f'<text x="{x}" y="{y}" class="{cls}" text-anchor="{anchor}">{escape(s)}</text>'

def box(x,y,w,h,title,lines=(),accent='#67d5ff',status=None):
    o=[f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="20" class="panel"/>',f'<circle cx="{x+30}" cy="{y+30}" r="8" fill="{accent}"/>',txt(x+50,y+37,title,'h')]
    for i,line in enumerate(lines): o.append(txt(x+24,y+72+i*24,line,'t'))
    if status:
        color={'good':'#63e6a7','warn':'#ffd166','bad':'#ff7f8e'}.get(status,'#67d5ff')
        o.append(f'<circle cx="{x+w-24}" cy="{y+26}" r="6" fill="{color}" filter="url(#glow)"/>')
    return ''.join(o)

# Hero illustration
body=[]
body.append('<circle cx="720" cy="280" r="220" fill="#0f3652" opacity=".36"/><circle cx="300" cy="650" r="250" fill="#0c2c42" opacity=".35"/>')
body.append(txt(70,70,'REGIONAL EDUCATION NETWORK','tag'))
# central core
body.append('<rect x="380" y="285" width="260" height="170" rx="28" fill="#0e2940" stroke="#4a89ad" stroke-width="2"/>')
body.append(txt(510,335,'REGIONAL CORE','h','middle'))
body.append(txt(510,368,'Routing · Security · Monitoring','t','middle'))
for cx,cy in [(445,410),(510,410),(575,410)]: body.append(f'<circle cx="{cx}" cy="{cy}" r="10" fill="#67d5ff" opacity=".85"/>')
# districts left/right
coords=[(70,170,'DIST-01','High School · Elementary'),(70,500,'DIST-18','High School · Elementary'),(700,160,'DIST-27','High School · Elementary'),(700,500,'DIST-35','High School · Elementary')]
for x,y,title,sub in coords:
    body.append(f'<rect x="{x}" y="{y}" width="230" height="120" rx="20" class="panel"/>')
    body.append(txt(x+22,y+40,title,'h')); body.append(txt(x+22,y+70,sub,'t')); body.append(txt(x+22,y+96,'STAFF · STUDENT · SERVER · MGMT','small'))
# lines
for x1,y1,x2,y2 in [(300,230,380,330),(300,560,380,420),(700,220,640,330),(700,560,640,420)]: body.append(f'<path d="M{x1} {y1} C{(x1+x2)//2} {y1},{(x1+x2)//2} {y2},{x2} {y2}" class="mutedline"/>')
# cloud
body.append('<rect x="360" y="70" width="300" height="105" rx="52" fill="#0c2438" stroke="#2d607f" stroke-width="2"/>')
body.append(txt(510,112,'MICROSOFT 365 · GOOGLE WORKSPACE','h','middle')); body.append(txt(510,144,'Cloud identity · SaaS · collaboration','t','middle'))
body.append('<path d="M510 285 L510 175" class="line"/>')
# NOC
body.append('<rect x="355" y="600" width="310" height="105" rx="18" class="panel2"/>'); body.append(txt(510,638,'UPSTREAM NOC / CARRIER','h','middle')); body.append(txt(510,670,'Circuit · provider handoff · escalation','t','middle')); body.append('<path d="M510 455 L510 600" class="line"/>')
# telemetry dots
for i,(x,y,c) in enumerate([(335,280,'#63e6a7'),(655,275,'#63e6a7'),(334,470,'#ffd166'),(658,470,'#67d5ff')]): body.append(f'<circle cx="{x}" cy="{y}" r="7" fill="{c}" filter="url(#glow)"/>')
(OUT/'hero-network.svg').write_text(svg(1000,820,''.join(body)),encoding='utf-8')

# Architecture stack
body=[]
body.append(txt(70,65,'END-TO-END SERVICE PATH','tag')); body.append(txt(70,108,'Regional K–12 Network Operations Architecture','title'))
labels=[
(70,175,200,175,'USER / ENDPOINT',['Windows 11','ChromeOS','Linux'],'#67d5ff'),
(305,175,200,175,'IDENTITY',['AD DS / DNS','Entra / Intune','Google Identity'],'#9d9cff'),
(540,175,200,175,'ACCESS / CAMPUS',['IDF access','MDF / L3 core','VLAN / DHCP relay'],'#63e6a7'),
(775,175,200,175,'SECURITY EDGE',['Firewall','Internet filter','TLS / policy logs'],'#ffd166'),
(1010,175,200,175,'WAN / UPSTREAM',['District edge','K-20 / provider','Circuit handoff'],'#ff9b86'),
(1245,175,285,175,'CLOUD / INTERNET',['Microsoft 365','Google Workspace','SaaS / web / mail'],'#67d5ff')]
for x,y,w,h,title,lines,accent in labels: body.append(box(x,y,w,h,title,lines,accent,'good'))
for i in range(len(labels)-1):
    x=labels[i][0]+labels[i][2]; y=262; x2=labels[i+1][0]
    body.append(f'<path d="M{x} {y} L{x2-10} {y}" class="line"/>')
# support plane
body.append('<rect x="70" y="440" width="1460" height="210" rx="24" fill="#091b2a" stroke="#234a66" stroke-width="2"/>')
body.append(txt(100,482,'OPERATIONS / CONTROL PLANE','tag'))
ops=[('OBSERVE','SNMPv3 · syslog · endpoint'),('ISOLATE','Scope · tests · failed boundary'),('CHANGE','Approval · scope · rollback'),('VERIFY','Retest path · controls'),('ESCALATE','Evidence · circuit · request')]
for i,(h,t) in enumerate(ops):
    x=100+i*285
    body.append(f'<rect x="{x}" y="520" width="250" height="90" rx="15" class="panel2"/>');body.append(txt(x+18,552,h,'h'));body.append(txt(x+18,580,t,'small'))
# trust boundaries
body.append('<path d="M515 145 L515 380" class="dash"/>');body.append(txt(525,390,'identity boundary','small'))
body.append('<path d="M985 145 L985 380" class="dash"/>');body.append(txt(995,390,'district edge','small'))
body.append('<path d="M1220 145 L1220 380" class="dash"/>');body.append(txt(1230,390,'provider boundary','small'))
(OUT/'architecture-stack.svg').write_text(svg(1600,720,''.join(body)),encoding='utf-8')

# Segmentation control plane
body=[]
body.append(txt(55,58,'SEGMENTATION & MANAGEMENT-PLANE CONTROL','tag')); body.append(txt(55,100,'Campus VLAN Security Model','title'))
# core
body.append(box(455,145,290,125,'L3 CORE / FIREWALL',['SVIs · ACLs · policy logs'],'#67d5ff','good'))
zones=[
(70,365,210,130,'STAFF','10.NN.10.0/24','#67d5ff'),
(310,365,210,130,'STUDENT','10.NN.20.0/23','#ffd166'),
(550,365,210,130,'SERVER','10.NN.30.0/24','#63e6a7'),
(790,365,210,130,'MGMT','10.NN.40.0/24','#9d9cff'),
(1030,365,210,130,'GUEST / IOT','10.NN.50/60.0','#889fb3')]
for x,y,w,h,n,cidr,color in zones:
    body.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="18" class="panel"/>');body.append(f'<rect x="{x}" y="{y}" width="{w}" height="7" rx="4" fill="{color}"/>');body.append(txt(x+20,y+47,n,'h'));body.append(txt(x+20,y+78,cidr,'t'));body.append(txt(x+20,y+106,'policy zone','small'))
    body.append(f'<path d="M600 270 C600 320,{x+w/2} 320,{x+w/2} {y}" class="mutedline"/>')
# policy list
policies=[('STUDENT → MGMT','DENY','#ff7f8e'),('GUEST → INTERNAL','DENY','#ff7f8e'),('MGMT → INFRA','ALLOW','#63e6a7'),('STAFF → INTERNET','POLICY','#67d5ff'),('STUDENT → INTERNET','FILTERED','#ffd166')]
for i,(p,a,c) in enumerate(policies):
    y=555+i*38
    body.append(txt(110,y,p,'t'));body.append(f'<rect x="365" y="{y-22}" width="95" height="28" rx="9" fill="{c}" opacity=".12" stroke="{c}"/>');body.append(txt(412,y-2,a,'small','middle'))
body.append('<rect x="600" y="545" width="590" height="165" rx="18" class="panel2"/>');body.append(txt(625,582,'CHANGE STANDARD','tag'));body.append(txt(625,618,'Requester · business need · exact source/destination · service','t'));body.append(txt(625,648,'risk · implementation · approval · validation · rollback','t'));body.append(txt(625,678,'closure evidence · review / expiry when appropriate','t'))
(OUT/'segmentation-control-plane.svg').write_text(svg(1280,760,''.join(body)),encoding='utf-8')

# WAN case study evidence map
body=[]
body.append(txt(60,58,'FEATURED CASE · INC-WAN-01','tag'));body.append(txt(60,100,'Evidence-First WAN Fault Isolation','title'))
steps=[
('01','USER REPORT','Internet unavailable',''),('02','LOCAL SERVICES','Gateway + AD/DNS reachable','good'),('03','DISTRICT EDGE','WAN up/up · route present','good'),('04','TRACEROUTE','Stops at provider handoff','warn'),('05','FAULT DOMAIN','Upstream / carrier','bad'),('06','HANDOFF','NOC evidence package','good')]
for i,(n,h,t,s) in enumerate(steps):
    x=55+i*195
    body.append(f'<rect x="{x}" y="170" width="170" height="140" rx="17" class="panel"/>');body.append(txt(x+18,204,n,'tag'));body.append(txt(x+18,238,h,'h'));body.append(txt(x+18,270,t,'small'))
    if s:body.append(f'<circle cx="{x+145}" cy="{195}" r="7" class="{s}" filter="url(#glow)"/>')
    if i<len(steps)-1:body.append(f'<path d="M{x+170} 240 L{x+188} 240" class="line"/>')
body.append('<rect x="55" y="370" width="1115" height="230" rx="20" class="panel2"/>');body.append(txt(80,408,'SYNTHETIC EVIDENCE','tag'))
lines=['ping gateway: <1 ms  ✓','internal AD/DNS: reachable  ✓','edge interface: up/up · errors 0  ✓','default route: present  ✓','hop 3: 198.51.100.9 provider-handoff','hop 4+: timeout  ✕','recent local changes: none']
for i,l in enumerate(lines): body.append(txt(90+(i%2)*540,450+(i//2)*37,l,'t'))
body.append(txt(60,662,'Decision: local network remains healthy through the provider boundary; escalate with exact circuit, timestamps, source subnets, and path evidence.','t'))
(OUT/'wan-case-study.svg').write_text(svg(1220,710,''.join(body)),encoding='utf-8')

# Identity dependency map
body=[]
body.append(txt(55,58,'IDENTITY / DEVICE / APPLICATION DEPENDENCIES','tag'));body.append(txt(55,100,'Authentication Is a Service Path Too','title'))
items=[(70,175,220,120,'WINDOWS DEVICE',['DomainJoined','AzureAdJoined','AzureAdPrt'],'#67d5ff'),(355,175,220,120,'AD DS / DNS',['computer object','SRV discovery','Kerberos / time'],'#63e6a7'),(640,175,220,120,'ENTRA ID',['user/device identity','MFA / CA','token issuance'],'#9d9cff'),(925,175,220,120,'INTUNE',['enrollment','compliance','configuration'],'#ffd166')]
for x,y,w,h,n,lines,c in items: body.append(box(x,y,w,h,n,lines,c,'good'))
for i in range(len(items)-1):body.append(f'<path d="M{items[i][0]+items[i][2]} 235 L{items[i+1][0]-10} 235" class="line"/>')
body.append(box(220,410,310,135,'MICROSOFT 365',['Outlook · OneDrive · SharePoint','license · auth · service health'],'#67d5ff','good'))
body.append(box(700,410,310,135,'GOOGLE WORKSPACE',['ChromeOS · Drive · groups / OU','sharing · browser policy'],'#63e6a7','good'))
body.append('<path d="M750 295 C750 350,375 350,375 410" class="mutedline"/>');body.append('<path d="M1040 295 C1040 350,855 350,855 410" class="mutedline"/>')
body.append(txt(55,620,'Troubleshooting question: is the failure network reachability, device registration, identity policy, authorization, or provider service health?','t'))
(OUT/'identity-service-dependency.svg').write_text(svg(1220,680,''.join(body)),encoding='utf-8')

# Operations evidence loop
body=[]
body.append(txt(55,58,'OPERATIONS METHOD','tag'));body.append(txt(55,100,'Evidence → Decision → Verification Loop','title'))
centers=[(190,290,'SCOPE','who / where / impact','#67d5ff'),(445,185,'COLLECT','read-only evidence','#9d9cff'),(740,185,'ISOLATE','failed boundary','#63e6a7'),(995,290,'ACT','fix or escalate','#ffd166'),(865,500,'VERIFY','positive + negative tests','#63e6a7'),(475,500,'DOCUMENT','cause · action · result','#67d5ff')]
for x,y,h,t,c in centers:
    body.append(f'<circle cx="{x}" cy="{y}" r="92" fill="#0b2135" stroke="{c}" stroke-width="2"/>');body.append(txt(x,y-5,h,'h','middle'));body.append(txt(x,y+26,t,'small','middle'))
for (x1,y1,_,_,_),(x2,y2,_,_,_) in zip(centers,centers[1:]+centers[:1]): body.append(f'<path d="M{x1} {y1} Q{(x1+x2)/2} {(y1+y2)/2-35} {x2} {y2}" class="line"/>')
body.append(txt(610,355,'NO RANDOM CHANGES','tag','middle'));body.append(txt(610,382,'Every action must be justified by observed evidence','t','middle'))
(OUT/'operations-evidence-loop.svg').write_text(svg(1220,660,''.join(body)),encoding='utf-8')

print('generated', len(list(OUT.glob('*.svg'))), 'portfolio SVGs')
