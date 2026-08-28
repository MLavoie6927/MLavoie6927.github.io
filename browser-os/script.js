"use strict";

/*
  Browser OS v1.0
  ============================================================
  HARD SECURITY BOUNDARY

  This file intentionally does NOT:
    - use eval() or Function()
    - invoke Bash, PowerShell, CMD, WSL or any operating-system shell
    - call fetch(), XMLHttpRequest, WebSocket or EventSource
    - contain a GitHub token, SSH key, deployment credential or password
    - call GitHub repository write/delete APIs
    - use the File System Access API
    - call localStorage.clear()

  All mutable state is simulated JavaScript data and browserOS.v3.*
  localStorage keys belonging to the current visitor.
  ============================================================
*/

const KEY = {
  state: "browserOS.v3.state",
  sandbox: "browserOS.v3.sandbox"
};

const BrowserOS = {
  version: "1.0.0",
  hostname: "browser-os",
  username: "guest",
  currentDirectory: "/home/guest",
  bootTime: Date.now(),
  zIndex: 20,
  history: [],
  historyIndex: 0,
  bootMode: "standard",
  bootFinished: false,
  selectedBootMode: "standard",
  missionProgress: new Set(),
  storageAvailable: true
};

const StorageLayer = {
  get(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      BrowserOS.storageAvailable = true;
      return value === null ? fallback : value;
    } catch {
      BrowserOS.storageAvailable = false;
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
      BrowserOS.storageAvailable = true;
      return true;
    } catch {
      BrowserOS.storageAvailable = false;
      return false;
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
      BrowserOS.storageAvailable = true;
      return true;
    } catch {
      BrowserOS.storageAvailable = false;
      return false;
    }
  }
};

const deepClone = value =>
  typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));

const DEFAULT_INCIDENTS = [
  {
    id:"INC-001",severity:"HIGH",endpoint:"WS-042",status:"INVESTIGATING",
    title:"Encoded PowerShell Execution",user:"jsmith",
    processTree:"WINWORD.EXE\n └─ powershell.exe\n     └─ rundll32.exe",
    command:"powershell.exe -enc SQBFAFgA...",network:"192.0.2.23 → 203.0.113.91:443",
    mitre:"T1059.001 - PowerShell\nT1218.011 - Rundll32"
  },
  {
    id:"INC-002",severity:"CRITICAL",endpoint:"DC-01",status:"CONTAINED",
    title:"Credential Dumping Behavior",user:"svc_backup",
    processTree:"services.exe\n └─ suspicious.exe\n     └─ lsass access",
    command:"Simulated credential access activity",network:"192.0.2.5 → 192.0.2.22:445",
    mitre:"T1003 - OS Credential Dumping"
  },
  {
    id:"INC-003",severity:"MEDIUM",endpoint:"WS-017",status:"CLOSED",
    title:"Suspicious DNS Activity",user:"mgarcia",
    processTree:"browser.exe",command:"DNS telemetry anomaly",
    network:"Repeated NXDOMAIN activity",mitre:"T1071.004 - DNS"
  },
  {
    id:"INC-004",severity:"HIGH",endpoint:"WS-031",status:"INVESTIGATING",
    title:"Possible C2 Beaconing",user:"alee",
    processTree:"explorer.exe\n └─ updater.exe",
    command:"Periodic outbound connection",network:"192.0.2.31 → 203.0.113.74:443",
    mitre:"T1071.001 - Web Protocols"
  }
];

const DEFAULT_PROCESSES = [
  {pid:1,ppid:0,user:"root",name:"browser-init",cpu:.1,mem:5,status:"RUNNING",protected:true,cmd:"/sbin/browser-init --sandbox"},
  {pid:114,ppid:1,user:"root",name:"virtual-fs",cpu:.1,mem:7,status:"RUNNING",protected:true,cmd:"virtual-fs --readonly-system --sandbox=/home/guest/sandbox"},
  {pid:221,ppid:1,user:"root",name:"network-sim",cpu:.2,mem:8,status:"RUNNING",protected:true,cmd:"network-sim --interface bos0 --virtual-only"},
  {pid:317,ppid:1,user:"soc",name:"telemetry-agent",cpu:.6,mem:12,status:"RUNNING",protected:true,cmd:"telemetry-agent --sources security,dns,browser,firewall"},
  {pid:401,ppid:317,user:"soc",name:"detection-engine",cpu:.4,mem:10,status:"RUNNING",protected:true,cmd:"detection-engine --synthetic"},
  {pid:622,ppid:1,user:"guest",name:"browser-shell",cpu:.1,mem:6,status:"RUNNING",protected:true,cmd:"browser-shell --allowlist"},
  {pid:730,ppid:1,user:"guest",name:"bos-browser",cpu:.3,mem:18,status:"RUNNING",protected:false,cmd:"bos-browser --virtual-network-only"},
  {pid:842,ppid:1,user:"guest",name:"updater.exe",cpu:1.4,mem:22,status:"RUNNING",protected:false,cmd:"C:\\Users\\guest\\AppData\\Local\\updater.exe --silent"},
  {pid:905,ppid:1,user:"jsmith",name:"WINWORD.EXE",cpu:.7,mem:46,status:"RUNNING",protected:false,cmd:"C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE invoice.docm"},
  {pid:910,ppid:905,user:"jsmith",name:"powershell.exe",cpu:2.8,mem:31,status:"RUNNING",protected:false,cmd:"powershell.exe -NoProfile -EncodedCommand SQBFAFgA..."},
  {pid:917,ppid:910,user:"jsmith",name:"rundll32.exe",cpu:1.2,mem:15,status:"RUNNING",protected:false,cmd:"rundll32.exe javascript:synthetic-demo-entry"}
];

const DEFAULT_CONNECTIONS = [
  {id:"C-001",pid:842,process:"updater.exe",endpoint:"WS-031",local:"192.0.2.10:51522",remote:"203.0.113.74:443",protocol:"TCP/TLS",state:"ESTABLISHED"},
  {id:"C-002",pid:401,process:"detection-engine",endpoint:"BROWSER-OS",local:"192.0.2.10:51402",remote:"198.51.100.40:443",protocol:"TCP/TLS",state:"ESTABLISHED"},
  {id:"C-003",pid:917,process:"rundll32.exe",endpoint:"WS-042",local:"192.0.2.23:52344",remote:"203.0.113.91:443",protocol:"TCP/TLS",state:"ESTABLISHED"}
];

const DEFAULT_LOGS = [
  {time:"2026-08-28T11:51:03Z",source:"security",level:"high",message:"WS-042 WINWORD.EXE spawned powershell.exe"},
  {time:"2026-08-28T11:51:04Z",source:"security",level:"high",message:"WS-042 powershell.exe encoded_command=true"},
  {time:"2026-08-28T11:51:08Z",source:"firewall",level:"warn",message:"ALLOW 192.0.2.23 -> 203.0.113.91 TCP/443"},
  {time:"2026-08-28T11:55:11Z",source:"security",level:"critical",message:"DC-01 simulated credential access behavior detected"},
  {time:"2026-08-28T11:58:43Z",source:"security",level:"high",message:"WS-031 periodic HTTPS connection pattern detected"},
  {time:"2026-08-28T12:00:00Z",source:"system",level:"info",message:"Browser OS synthetic telemetry engine initialized"}
];

const DEFAULT_PACKETS = [
  {no:1,time:"0.0000",src:"192.0.2.10",dst:"192.0.2.53",proto:"DNS",info:"Standard query A soc.local",detail:"Frame 1\nEthernet II\nInternet Protocol Version 4\nUser Datagram Protocol\nDomain Name System\n    Query: A soc.local"},
  {no:2,time:"0.0162",src:"192.0.2.53",dst:"192.0.2.10",proto:"DNS",info:"Standard query response A 198.51.100.20",detail:"Frame 2\nEthernet II\nIPv4\nUDP\nDNS\n    Answer: soc.local = 198.51.100.20"},
  {no:3,time:"0.0411",src:"192.0.2.10",dst:"198.51.100.20",proto:"TCP",info:"51500 → 80 [SYN]",detail:"Frame 3\nEthernet II\nIPv4\nTCP\n    Flags: SYN\n    Source Port: 51500\n    Destination Port: 80"},
  {no:4,time:"0.0594",src:"198.51.100.20",dst:"192.0.2.10",proto:"TCP",info:"80 → 51500 [SYN, ACK]",detail:"Frame 4\nEthernet II\nIPv4\nTCP\n    Flags: SYN, ACK"},
  {no:5,time:"0.0617",src:"192.0.2.10",dst:"198.51.100.20",proto:"TCP",info:"51500 → 80 [ACK]",detail:"Frame 5\nEthernet II\nIPv4\nTCP\n    Flags: ACK"},
  {no:6,time:"0.0823",src:"192.0.2.10",dst:"198.51.100.20",proto:"HTTP",info:"GET / HTTP/1.1 Host: soc.local",detail:"Frame 6\nEthernet II\nIPv4\nTCP\nHypertext Transfer Protocol\n    GET / HTTP/1.1\n    Host: soc.local"},
  {no:7,time:"3.4012",src:"192.0.2.23",dst:"192.0.2.53",proto:"DNS",info:"Standard query A telemetry-sync.example",detail:"Frame 7\nEthernet II\nIPv4\nUDP\nDNS\n    Query: A telemetry-sync.example\n    Endpoint: WS-042"},
  {no:8,time:"3.4188",src:"192.0.2.53",dst:"192.0.2.23",proto:"DNS",info:"Response A 203.0.113.91",detail:"Frame 8\nEthernet II\nIPv4\nUDP\nDNS\n    Answer: telemetry-sync.example = 203.0.113.91"},
  {no:9,time:"3.4421",src:"192.0.2.23",dst:"203.0.113.91",proto:"TCP",info:"52344 → 443 [SYN]",detail:"Frame 9\nEthernet II\nIPv4\nTCP\n    Source Port: 52344\n    Destination Port: 443\n    Flags: SYN\n    Process: rundll32.exe (PID 917)"},
  {no:10,time:"3.4599",src:"203.0.113.91",dst:"192.0.2.23",proto:"TCP",info:"443 → 52344 [SYN, ACK]",detail:"Frame 10\nEthernet II\nIPv4\nTCP\n    Flags: SYN, ACK"},
  {no:11,time:"3.4630",src:"192.0.2.23",dst:"203.0.113.91",proto:"TCP",info:"52344 → 443 [ACK]",detail:"Frame 11\nEthernet II\nIPv4\nTCP\n    Flags: ACK"},
  {no:12,time:"3.5074",src:"192.0.2.23",dst:"203.0.113.91",proto:"TLS",info:"Client Hello (SNI telemetry-sync.example)",detail:"Frame 12\nEthernet II\nIPv4\nTCP\nTransport Layer Security\n    Handshake: Client Hello\n    Server Name: telemetry-sync.example\n    Process: rundll32.exe (PID 917)\n    Incident: INC-001"}
];

const VIRTUAL_SITES = {
  "soc.local": {
    ip:"198.51.100.20",port:80,title:"SOC Operations Portal",tag:"Security Operations",
    text:"Synthetic security telemetry, active investigations and host containment status.",
    cards:[["4","Open incidents"],["7","Telemetry sources"],["1","Critical incident"]]
  },
  "intranet.local": {
    ip:"198.51.100.30",port:80,title:"Corporate Intranet",tag:"Internal Service",
    text:"Browser OS internal resources, policy links and staff notices.",
    cards:[["14","Published policies"],["3","Change notices"],["99.99%","Service availability"]]
  },
  "fileserver.local": {
    ip:"198.51.100.10",port:443,title:"Secure File Server",tag:"Internal Storage",
    text:"Read-only demonstration shares used by the Browser OS laboratory.",
    cards:[["6","Evidence bundles"],["12","Detection packages"],["0","External shares"]]
  },
  "malware-lab.local": {
    ip:"198.51.100.90",port:8080,title:"Malware Analysis Lab",tag:"Isolated Lab VLAN",
    text:"Synthetic malware-analysis environment. Samples and detonation activity are simulated.",
    cards:[["3","Queued samples"],["1","Active detonation"],["90","Lab VLAN"]]
  },
  "firewall.local": {
    ip:"198.51.100.1",port:443,title:"Virtual Firewall",tag:"Network Security",
    text:"Policy and session visualization for the Browser OS simulated network.",
    cards:[["18","Allow rules"],["7","Block rules"],["2","Active anomalies"]]
  },
  "sentinel.local": {
    ip:"198.51.100.40",port:443,title:"SIEM Workspace",tag:"Detection Engineering",
    text:"Synthetic analytics rules, incidents and threat-hunting telemetry.",
    cards:[["42","Analytics rules"],["4","Incidents"],["7","Data connectors"]]
  }
};

function defaultState() {
  return {
    incidents: deepClone(DEFAULT_INCIDENTS),
    processes: deepClone(DEFAULT_PROCESSES),
    connections: deepClone(DEFAULT_CONNECTIONS),
    logs: deepClone(DEFAULT_LOGS),
    packets: deepClone(DEFAULT_PACKETS),
    captureEnabled: true,
    nextPacket: 13,
    nextConnection: 4,
    virtualDestroyed: false
  };
}

const isRecord = value => value !== null && typeof value === "object" && !Array.isArray(value);
const isText = (value, max=6000) => typeof value === "string" && value.length <= max;
const isFiniteNumber = value => typeof value === "number" && Number.isFinite(value);

const STATE_VALIDATORS = Object.freeze({
  incidents: incident => isRecord(incident) &&
    ["id","severity","endpoint","status","title","user","processTree","command","network","mitre"]
      .every(key => isText(incident[key])),
  processes: process => isRecord(process) &&
    ["pid","ppid","cpu","mem"].every(key => isFiniteNumber(process[key])) &&
    ["user","name","status","cmd"].every(key => isText(process[key])) &&
    typeof process.protected === "boolean",
  connections: connection => isRecord(connection) &&
    isFiniteNumber(connection.pid) &&
    ["id","process","endpoint","local","remote","protocol","state"].every(key => isText(connection[key])),
  logs: log => isRecord(log) && ["time","source","level","message"].every(key => isText(log[key])),
  packets: packet => isRecord(packet) && isFiniteNumber(packet.no) &&
    ["time","src","dst","proto","info","detail"].every(key => isText(packet[key]))
});

function validStateArray(value, fallback, validator, limit) {
  if (!Array.isArray(value) || !value.every(validator)) return deepClone(fallback);
  return value.slice(-limit);
}

function loadState() {
  try {
    const parsed = JSON.parse(StorageLayer.get(KEY.state, "null"));
    if (!isRecord(parsed)) return defaultState();
    const defaults = defaultState();
    return {
      ...defaults,
      incidents: validStateArray(parsed.incidents, DEFAULT_INCIDENTS, STATE_VALIDATORS.incidents, 25),
      processes: validStateArray(parsed.processes, DEFAULT_PROCESSES, STATE_VALIDATORS.processes, 60),
      connections: validStateArray(parsed.connections, DEFAULT_CONNECTIONS, STATE_VALIDATORS.connections, 120),
      logs: validStateArray(parsed.logs, DEFAULT_LOGS, STATE_VALIDATORS.logs, 300),
      packets: validStateArray(parsed.packets, DEFAULT_PACKETS, STATE_VALIDATORS.packets, 300),
      captureEnabled: typeof parsed.captureEnabled === "boolean" ? parsed.captureEnabled : defaults.captureEnabled,
      nextPacket: Number.isSafeInteger(parsed.nextPacket) && parsed.nextPacket > 0 ? parsed.nextPacket : defaults.nextPacket,
      nextConnection: Number.isSafeInteger(parsed.nextConnection) && parsed.nextConnection > 0 ? parsed.nextConnection : defaults.nextConnection,
      virtualDestroyed: typeof parsed.virtualDestroyed === "boolean" ? parsed.virtualDestroyed : defaults.virtualDestroyed
    };
  } catch {
    return defaultState();
  }
}

function loadSandbox() {
  try {
    const parsed = JSON.parse(StorageLayer.get(KEY.sandbox, "{}"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed)
        .filter(([path, value]) => path.startsWith("/home/guest/sandbox/") && typeof value === "string")
        .slice(0, 50)
        .map(([path, value]) => [path.slice(0, 180), value.slice(0, 8000)])
    );
  } catch {
    return {};
  }
}

let state = loadState();
let sandboxFiles = loadSandbox();

function saveState() {
  return StorageLayer.set(KEY.state, JSON.stringify(state));
}
function saveSandbox() {
  return StorageLayer.set(KEY.sandbox, JSON.stringify(sandboxFiles));
}
function stamp() {
  return new Date().toISOString();
}
function addLog(source, level, message) {
  state.logs.push({time:stamp(),source,level,message});
  if (state.logs.length > 300) state.logs = state.logs.slice(-300);
  saveState();
  renderLogs();
  updateIncidentMetrics();
}
function addPacket(src,dst,proto,info,detail) {
  if (!state.captureEnabled) return;
  state.packets.push({
    no:state.nextPacket++,
    time:((Date.now()-BrowserOS.bootTime)/1000).toFixed(4),
    src,dst,proto,info,detail
  });
  if (state.packets.length > 300) state.packets = state.packets.slice(-300);
  saveState();
  renderPackets();
}

/* virtual filesystem */
const systemDirectories = new Set([
  "/","/bin","/etc","/home","/home/guest","/home/guest/sandbox",
  "/opt","/opt/security","/var","/var/log"
]);

const systemFiles = {
  "/etc/hostname":"browser-os",
  "/etc/os-release":`NAME="Browser OS"
VERSION="1.0.0"
ID=browser-os
PRETTY_NAME="Browser OS Security Edition"
ARCHITECTURE="Client-side simulation sandbox"`,
  "/etc/security.conf":`repository_access = false
github_write_api = not_implemented
github_credentials = none
backend_access = false
arbitrary_code_execution = false
external_network = disabled
system_directories = read_only
sandbox_directory = /home/guest/sandbox
local_storage_prefix = browserOS.v3.`,
  "/home/guest/README.txt":`Welcome to Browser OS v1.0.

Try:
  mission
  help
  ps
  netstat
  logs
  packets
  browse soc.local
  dns soc.local
  incidents
  investigate INC-001
  isolate WS-042
  kill 842
  security`,
  "/opt/security/architecture.txt":`REAL PORTFOLIO HOST
  GitHub Pages static files
           X
           | no write path
           v
BROWSER OS SIMULATION
  virtual filesystem
  synthetic processes
  synthetic network and packets
  virtual .local services
  browserOS.v3.* visitor storage`,
  "/opt/security/network.status":"Virtual network interface bos0\nExternal networking: disabled\nInternal .local services: enabled",
  "/opt/security/packet.status":"Packet source: synthetic Browser OS network stack\nCapture target: virtual packets only",
  "/var/log/README.txt":"Open the Log Viewer application for dynamic synthetic telemetry."
};

function normalizePath(path) {
  if (!path) return BrowserOS.currentDirectory;
  let candidate = path;
  if (candidate === "~") candidate = "/home/guest";
  if (candidate.startsWith("~/")) candidate = "/home/guest/" + candidate.slice(2);
  else if (!candidate.startsWith("/")) candidate = BrowserOS.currentDirectory + "/" + candidate;
  const output = [];
  for (const part of candidate.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") output.pop();
    else output.push(part);
  }
  return "/" + output.join("/");
}
function directoryExists(path) {
  return systemDirectories.has(normalizePath(path));
}
function readVirtualFile(path) {
  const p = normalizePath(path);
  if (Object.hasOwn(systemFiles,p)) return systemFiles[p];
  if (Object.hasOwn(sandboxFiles,p)) return sandboxFiles[p];
  return null;
}
function listDirectory(path) {
  const p = normalizePath(path);
  if (!directoryExists(p)) return null;
  const prefix = p === "/" ? "/" : p + "/";
  const found = new Map();
  for (const dir of systemDirectories) {
    if (dir === p || dir === "/") continue;
    if (dir.startsWith(prefix)) {
      const rest = dir.slice(prefix.length);
      if (rest && !rest.includes("/")) found.set(rest,"directory");
    }
  }
  for (const filePath of Object.keys({...systemFiles,...sandboxFiles})) {
    if (filePath.startsWith(prefix)) {
      const rest = filePath.slice(prefix.length);
      if (rest && !rest.includes("/")) found.set(rest,"file");
    }
  }
  return [...found.entries()].map(([name,type])=>({name,type}));
}

/* boot */
const bootScreen = document.getElementById("boot-screen");
const bootOutput = document.getElementById("boot-output");
const desktop = document.getElementById("desktop");

document.querySelectorAll("[data-boot-mode]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll("[data-boot-mode]").forEach(x=>x.classList.remove("active"));
    btn.classList.add("active");
    BrowserOS.selectedBootMode = btn.dataset.bootMode;
  });
});

function bootLine(status,message) {
  const line=document.createElement("div");
  line.className="boot-line";
  const s=document.createElement("span");
  s.textContent=`[ ${status} ]`;
  s.className=status==="OK"?"boot-ok":status==="WARN"?"boot-warn":"boot-info";
  const m=document.createElement("span");
  m.textContent=message;
  line.append(s,m);
  bootOutput.appendChild(line);
  bootOutput.scrollTop=bootOutput.scrollHeight;
}
function delay(ms){return new Promise(r=>setTimeout(r,ms));}

async function runBoot(mode=BrowserOS.selectedBootMode,fast=false) {
  if (BrowserOS.bootFinished) return;
  BrowserOS.bootMode=mode;
  bootOutput.textContent="";
  document.getElementById("boot-options").style.pointerEvents="none";

  const modeLines = {
    standard:[
      ["OK","Virtual network stack enabled"],
      ["OK","Packet capture engine enabled"],
      ["OK","Browser .local resolver enabled"]
    ],
    safe:[
      ["WARN","Safe Mode: virtual network stack disabled"],
      ["WARN","Safe Mode: packet generation disabled"],
      ["OK","Minimal protected services initialized"]
    ],
    forensics:[
      ["WARN","Forensics Mode: network generation frozen"],
      ["OK","Evidence viewers initialized read-only"],
      ["OK","Packet and log evidence loaded"]
    ]
  };

  const lines=[
    ["INFO",`BrowserBIOS 1.0 boot mode: ${mode.toUpperCase()}`],
    ["OK","Memory sandbox initialized"],
    ["OK","Virtual filesystem mounted"],
    ["OK","System directories set read-only"],
    ["OK","Writable sandbox mounted /home/guest/sandbox"],
    ["OK","Repository write interface: NOT PRESENT"],
    ["OK","GitHub credentials: NONE"],
    ["OK","Content Security Policy: connect-src NONE"],
    ["OK","Arbitrary shell execution: DISABLED"],
    ...modeLines[mode],
    ["INFO","Starting Browser OS desktop..."]
  ];

  for(const [status,message] of lines){
    bootLine(status,message);
    if(!fast) await delay(90);
  }
  if(!fast) await delay(220);
  finishBoot();
}

function finishBoot(){
  BrowserOS.bootFinished=true;
  bootScreen.classList.add("hidden");
  desktop.classList.remove("hidden");
  applyBootMode();
  updateClock();
  renderAll();
  initializeTerminal();
  desktop.focus();
  if(state.virtualDestroyed) showKernelPanic();
}
document.getElementById("boot-selected").addEventListener("click",()=>runBoot(BrowserOS.selectedBootMode,false));
document.getElementById("skip-boot").addEventListener("click",()=>runBoot(BrowserOS.selectedBootMode,true));

function applyBootMode(){
  const mode=BrowserOS.bootMode;
  document.getElementById("system-boot-mode").textContent=mode.toUpperCase();
  document.getElementById("taskbar-mode").textContent=mode.toUpperCase();
  document.getElementById("start-mode-label").textContent=mode[0].toUpperCase()+mode.slice(1)+" session";

  const networkOffline = mode !== "standard";
  document.getElementById("taskbar-network").textContent = networkOffline ? "● VIRTUAL NET OFF" : "● SECURE";
  document.getElementById("taskbar-network").style.color = networkOffline ? "var(--yellow)" : "var(--green)";
  document.body.dataset.bootMode = mode;
  ["log-clear-view","packet-clear","reset-browser-os"].forEach(id=>{
    const control=document.getElementById(id);
    if(control){
      control.disabled=mode==="forensics";
      control.title=mode==="forensics"?"Disabled in read-only Forensics Mode":"";
    }
  });
  const captureControl=document.getElementById("capture-toggle");
  if(captureControl){
    captureControl.disabled=mode!=="standard";
    captureControl.title=mode!=="standard"?"Synthetic capture requires Standard Mode":"";
  }
}

/* clock */
function updateClock(){
  const c=document.getElementById("taskbar-clock");
  if(c) c.textContent=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
}
setInterval(updateClock,1000);

/* window manager */
const startMenu=document.getElementById("start-menu");
const taskbarApps=document.getElementById("taskbar-apps");
const startButton=document.getElementById("start-button");

const MISSION_STEP_BY_APP = Object.freeze({
  "soc-window":"incident",
  "process-window":"process",
  "network-window":"network",
  "packet-window":"packets",
  "logs-window":"logs"
});

document.querySelectorAll(".os-window").forEach(windowElement=>{
  const appName=windowElement.dataset.appName||"application";
  const labels={
    "data-minimize-window":`Minimize ${appName}`,
    "data-maximize-window":`Maximize ${appName}`,
    "data-close-window":`Close ${appName}`
  };
  Object.entries(labels).forEach(([attribute,label])=>{
    const button=windowElement.querySelector(`[${attribute}]`);
    if(button&&!button.hasAttribute("aria-label"))button.setAttribute("aria-label",label);
  });
});

Object.keys(MISSION_STEP_BY_APP).forEach(windowId=>{
  const windowElement=document.getElementById(windowId);
  const titlebar=windowElement?.querySelector(".window-titlebar");
  const controls=titlebar?.querySelector(".window-controls");
  if(!titlebar||!controls)return;
  const button=document.createElement("button");
  button.type="button";
  button.className="mission-return";
  button.textContent="← Guide";
  button.setAttribute("aria-label","Return to the guided investigation");
  button.addEventListener("click",()=>openWindow("mission-window"));
  titlebar.insertBefore(button,controls);
});

function markMissionStep(step){
  if(!step)return;
  BrowserOS.missionProgress.add(step);
  renderMission();
}

function renderMission(){
  const total=document.querySelectorAll("[data-mission-step]").length;
  const complete=BrowserOS.missionProgress.size;
  const percent=Math.round((complete/total)*100);
  document.querySelectorAll("[data-mission-step]").forEach(item=>{
    const isComplete=BrowserOS.missionProgress.has(item.dataset.missionStep);
    item.classList.toggle("is-complete",isComplete);
    item.setAttribute("aria-label",`${item.dataset.missionStep} step ${isComplete?"complete":"not complete"}`);
  });
  document.getElementById("mission-progress-value").textContent=`${percent}%`;
  document.getElementById("mission-progress-bar").style.width=`${percent}%`;
  const result=document.getElementById("mission-result");
  result.classList.toggle("is-complete",complete===total);
  result.querySelector("strong").textContent=complete===total?"Mission complete":"Mission objective";
  result.querySelector("span").textContent=complete===total
    ?"INC-001 was validated and WS-042 was contained inside the simulation. The real host remained untouched."
    :`Complete all six investigation steps. ${complete} of ${total} steps recorded.`;
}

function bringToFront(el){BrowserOS.zIndex++;el.style.zIndex=BrowserOS.zIndex;}
function openWindow(id){
  const el=document.getElementById(id); if(!el)return;
  if(id==="browser-window"){
    const browserProc=state.processes.find(p=>p.pid===730);
    if(browserProc && browserProc.status==="TERMINATED" && BrowserOS.bootMode!=="forensics"){
      browserProc.status="RUNNING"; browserProc.cpu=.3; addLog("system","info","bos-browser process restarted by user");
    }
  }
  el.classList.add("visible"); bringToFront(el); createTaskbarButton(el);
  markMissionStep(MISSION_STEP_BY_APP[id]);
  if(id==="terminal-window") setTimeout(()=>document.getElementById("terminal-input").focus(),0);
  if(id==="network-window") renderNetwork();
  if(id==="process-window") renderProcesses();
  if(id==="logs-window") renderLogs();
  if(id==="packet-window") renderPackets();
  if(id==="browser-window" && !document.getElementById("browser-page").dataset.loaded) navigateVirtual("http://soc.local",false);
}
function closeWindow(el){el.classList.remove("visible");removeTaskbarButton(el.id);}
function minimizeWindow(el){el.classList.remove("visible");}
function toggleMaximize(el){el.classList.toggle("maximized");}
function createTaskbarButton(el){
  if(document.querySelector(`[data-task-window="${el.id}"]`)) return;
  const b=document.createElement("button"); b.type="button"; b.className="taskbar-app"; b.dataset.taskWindow=el.id; b.textContent=el.dataset.appName;
  b.addEventListener("click",()=>{
    if(!el.classList.contains("visible")){el.classList.add("visible");bringToFront(el);return;}
    if(Number(el.style.zIndex)===BrowserOS.zIndex){minimizeWindow(el);return;}
    bringToFront(el);
  });
  taskbarApps.appendChild(b);
}
function removeTaskbarButton(id){document.querySelector(`[data-task-window="${id}"]`)?.remove();}
document.querySelectorAll("[data-open-app]").forEach(b=>b.addEventListener("click",()=>{openWindow(b.dataset.openApp);setStartMenu(false);}));
document.querySelectorAll("[data-close-window]").forEach(b=>b.addEventListener("click",e=>closeWindow(e.target.closest(".os-window"))));
document.querySelectorAll("[data-minimize-window]").forEach(b=>b.addEventListener("click",e=>minimizeWindow(e.target.closest(".os-window"))));
document.querySelectorAll("[data-maximize-window]").forEach(b=>b.addEventListener("click",e=>toggleMaximize(e.target.closest(".os-window"))));
document.querySelectorAll(".os-window").forEach(w=>w.addEventListener("mousedown",()=>bringToFront(w)));

document.querySelectorAll(".drag-handle").forEach(h=>h.addEventListener("pointerdown",startDrag));
function startDrag(e){
  if(e.target.closest(".window-control"))return;
  if(window.matchMedia("(max-width: 900px)").matches)return;
  const w=e.currentTarget.closest(".os-window");
  if(w.classList.contains("maximized"))return;
  bringToFront(w);
  const sx=e.clientX,sy=e.clientY,r=w.getBoundingClientRect(),sl=r.left,st=r.top;
  const move=ev=>{
    const left=Math.max(-w.offsetWidth+120,Math.min(sl+ev.clientX-sx,window.innerWidth-120));
    const top=Math.max(0,Math.min(st+ev.clientY-sy,window.innerHeight-90));
    w.style.left=left+"px";w.style.top=top+"px";
  };
  const stop=()=>{document.removeEventListener("pointermove",move);document.removeEventListener("pointerup",stop);};
  document.addEventListener("pointermove",move);document.addEventListener("pointerup",stop);
}

function setStartMenu(open){
  startMenu.classList.toggle("visible",open);
  startButton.setAttribute("aria-expanded",String(open));
}
startButton.setAttribute("aria-expanded","false");
startButton.addEventListener("click",e=>{e.stopPropagation();setStartMenu(!startMenu.classList.contains("visible"));});
document.addEventListener("click",e=>{if(!startMenu.contains(e.target)&&!startButton.contains(e.target))setStartMenu(false);});
document.addEventListener("keydown",e=>{if(e.key==="Escape")setStartMenu(false);});
document.getElementById("restart-browser-os").addEventListener("click",()=>location.reload());
document.getElementById("reset-browser-os").addEventListener("click",()=>{if(mutationAllowed("simulation reset"))resetSimulation();});

document.querySelectorAll("[data-mission-open]").forEach(button=>button.addEventListener("click",()=>{
  const windowId=button.dataset.missionOpen;
  openWindow(windowId);
  if(windowId==="process-window")showProcessDetail(910);
  if(windowId==="packet-window"){
    document.getElementById("packet-filter").value="203.0.113.91";
    renderPackets();
    const rows=document.querySelectorAll("#packet-table-body tr");
    rows[rows.length-1]?.click();
  }
  if(windowId==="logs-window"){
    document.getElementById("log-source-filter").value="all";
    document.getElementById("log-search").value="WS-042";
    renderLogs();
  }
}));
document.querySelectorAll("[data-mission-command]").forEach(button=>button.addEventListener("click",()=>{
  openWindow("terminal-window");
  terminalInput.value=button.dataset.missionCommand;
  terminalInput.focus();
}));
document.getElementById("mission-reset").addEventListener("click",()=>{
  BrowserOS.missionProgress.clear();
  renderMission();
});

/* terminal */
const terminalOutput=document.getElementById("terminal-output");
const terminalForm=document.getElementById("terminal-form");
const terminalInput=document.getElementById("terminal-input");
const terminalPrompt=document.getElementById("terminal-prompt");

function mutationAllowed(action){
  if(BrowserOS.bootMode!=="forensics")return true;
  terminalPrint(`Forensics Mode is read-only: ${action} was not performed.`,"warning");
  terminalPrint("Reboot in Standard Mode to change simulated state.","muted");
  return false;
}

function terminalPrint(text="",type=""){
  const line=document.createElement("div");line.className="terminal-line";
  if(type)line.classList.add("terminal-"+type);
  line.textContent=String(text);
  terminalOutput.appendChild(line);
  while(terminalOutput.childElementCount>500)terminalOutput.firstElementChild.remove();
  terminalOutput.scrollTop=terminalOutput.scrollHeight;
}
function updatePrompt(){
  const path=BrowserOS.currentDirectory==="/home/guest"?"~":BrowserOS.currentDirectory;
  terminalPrompt.textContent=`${BrowserOS.username}@${BrowserOS.hostname}:${path}$`;
}
function initializeTerminal(){
  if(terminalOutput.dataset.initialized)return;
  terminalOutput.dataset.initialized="true";
  terminalPrint("Browser OS Security Edition","success");
  terminalPrint("Version 1.0.0 · "+BrowserOS.bootMode.toUpperCase()+" MODE","info");
  terminalPrint("Repository / website write access: NOT PRESENT","success");
  terminalPrint('Type "help" for commands.','muted');terminalPrint("");updatePrompt();
}
terminalForm.addEventListener("submit",e=>{
  e.preventDefault();const raw=terminalInput.value.trim();terminalInput.value="";
  if(!raw)return;BrowserOS.history.push(raw);BrowserOS.history=BrowserOS.history.slice(-60);BrowserOS.historyIndex=BrowserOS.history.length;
  terminalPrint(`${terminalPrompt.textContent} ${raw}`,"command");executeCommand(raw);updatePrompt();
});
terminalInput.addEventListener("keydown",e=>{
  if(e.key==="ArrowUp"){e.preventDefault();BrowserOS.historyIndex=Math.max(0,BrowserOS.historyIndex-1);terminalInput.value=BrowserOS.history[BrowserOS.historyIndex]||"";}
  if(e.key==="ArrowDown"){e.preventDefault();BrowserOS.historyIndex=Math.min(BrowserOS.history.length,BrowserOS.historyIndex+1);terminalInput.value=BrowserOS.history[BrowserOS.historyIndex]||"";}
});

function executeCommand(raw){
  const args=raw.split(/\s+/);const cmd=(args.shift()||"").toLowerCase();
  switch(cmd){
    case"help":commandHelp();break;
    case"clear":terminalOutput.textContent="";break;
    case"pwd":terminalPrint(BrowserOS.currentDirectory);break;
    case"ls":commandLs(args);break;
    case"cd":commandCd(args);break;
    case"cat":commandCat(args);break;
    case"touch":commandTouch(args);break;
    case"write":commandWrite(args);break;
    case"rm":commandRm(args,raw);break;
    case"whoami":terminalPrint(BrowserOS.username);break;
    case"hostname":terminalPrint(BrowserOS.hostname);break;
    case"uname":terminalPrint("Browser OS 1.0.0 BrowserKernel-JS-3.0 BrowserSandbox");break;
    case"date":terminalPrint(new Date().toString());break;
    case"uptime":terminalPrint(`up ${Math.floor((Date.now()-BrowserOS.bootTime)/1000)} seconds, 1 user, mode ${BrowserOS.bootMode}`);break;
    case"ps":commandPs();break;
    case"top":commandTop();break;
    case"netstat":case"ss":commandNetstat();break;
    case"ip":case"ifconfig":commandIp();break;
    case"ping":commandPing(args);break;
    case"dns":commandDns(args);break;
    case"browse":commandBrowse(args);break;
    case"mission":openWindow("mission-window");terminalPrint("Opened the guided INC-001 investigation mission.","info");break;
    case"logs":commandLogs();break;
    case"packets":commandPackets();break;
    case"kill":commandKill(args);break;
    case"incidents":commandIncidents();break;
    case"investigate":commandInvestigate(args);break;
    case"isolate":commandIsolate(args);break;
    case"security":commandSecurity();break;
    case"history":BrowserOS.history.forEach((x,i)=>terminalPrint(`${String(i+1).padStart(4)}  ${x}`));break;
    case"reset-lab":if(mutationAllowed("simulation reset")){resetSimulation(false);terminalPrint("Simulation restored to defaults.","success");}break;
    case"about":commandAbout();break;
    case"sudo":terminalPrint("sudo: administrative OS execution is not implemented.","warning");break;
    case"shutdown":case"reboot":terminalPrint("Restarting Browser OS simulation...","info");setTimeout(()=>location.reload(),450);break;
    default:terminalPrint(`${cmd}: command not found`,"error");terminalPrint('Type "help" for supported simulated commands.','muted');
  }
}

function commandHelp(){
  terminalPrint(`BROWSER OS COMMANDS

Filesystem
  pwd                     Current virtual directory
  ls [path]               List virtual files
  cd <path>               Change virtual directory
  cat <file>              Read virtual file
  touch <file>            Create sandbox file
  write <file> <text>     Write sandbox file
  rm <file>               Delete sandbox file
  rm -rf /                Destroy ONLY the virtual OS

System / Processes
  ps
  top
  kill <pid>
  whoami
  hostname
  uname
  date
  uptime
  history
  clear

Networking
  ip
  netstat
  ss
  ping <virtual-host>
  dns <virtual-host>
  browse <virtual-host>

Telemetry
  logs
  packets

Security Operations
  mission
  incidents
  investigate <INC-ID>
  isolate <endpoint>
  security

Maintenance
  reset-lab
  reboot
  about

No command is passed to a real shell. Website source and GitHub repository files are outside this simulation.`);
}
function commandLs(args){
  const requested=args[0]||BrowserOS.currentDirectory,entries=listDirectory(requested);
  if(!entries){terminalPrint(`ls: ${requested}: directory not found`,"error");return;}
  if(!entries.length){terminalPrint("(empty directory)","muted");return;}
  entries.forEach(x=>terminalPrint(x.type==="directory"?x.name+"/":x.name,x.type==="directory"?"info":""));
}
function commandCd(args){
  const p=normalizePath(args[0]||"/home/guest");
  if(!directoryExists(p)){terminalPrint(`cd: ${args[0]||""}: no such directory`,"error");return;}
  BrowserOS.currentDirectory=p;
}
function commandCat(args){
  if(!args[0]){terminalPrint("cat: missing file operand","error");return;}
  const c=readVirtualFile(args[0]);if(c===null){terminalPrint(`cat: ${args[0]}: file not found`,"error");return;}terminalPrint(c);
}
function isWritableSandboxFile(path){
  return path.startsWith("/home/guest/sandbox/") && path.length>"/home/guest/sandbox/".length && !path.endsWith("/");
}
function commandTouch(args){
  if(!mutationAllowed("virtual file creation"))return;
  if(!args[0]){terminalPrint("Usage: touch filename.txt","warning");return;}
  const p=normalizePath(args[0]);if(!isWritableSandboxFile(p)){terminalPrint("Permission denied: provide a file inside /home/guest/sandbox.","error");return;}
  sandboxFiles[p]=sandboxFiles[p]||"";saveSandbox();renderFileManager("/home/guest/sandbox");terminalPrint(`Created virtual file: ${p}`,"success");
}
function commandWrite(args){
  if(!mutationAllowed("virtual file write"))return;
  if(args.length<2){terminalPrint("Usage: write filename.txt text","warning");return;}
  const p=normalizePath(args.shift());if(!isWritableSandboxFile(p)){terminalPrint("Permission denied: provide a file inside /home/guest/sandbox.","error");return;}
  const text=args.join(" ");sandboxFiles[p]=text;saveSandbox();renderFileManager("/home/guest/sandbox");terminalPrint(`Wrote ${text.length} characters to ${p}`,"success");
}
function commandRm(args,raw){
  if(!mutationAllowed("virtual file deletion"))return;
  const destructiveRoot=/\brm\b.*(?:-rf|-fr|--recursive).*(?:\s\/\s*$|\s\/$)/i.test(raw) || raw.trim()==="rm -rf /";
  if(destructiveRoot){destroyVirtualOS();return;}
  const filtered=args.filter(x=>!x.startsWith("-"));if(!filtered.length){terminalPrint("rm: missing operand","error");return;}
  const p=normalizePath(filtered[0]);if(!isWritableSandboxFile(p)){terminalPrint("Permission denied: virtual system filesystem is read-only.","error");terminalPrint("Real website files are not addressable by Browser OS.","muted");return;}
  if(!Object.hasOwn(sandboxFiles,p)){terminalPrint(`rm: ${p}: file not found`,"error");return;}
  delete sandboxFiles[p];saveSandbox();renderFileManager("/home/guest/sandbox");terminalPrint(`Deleted virtual sandbox file: ${p}`,"success");
}
function effectiveProcessStatus(process){
  return process.pid===221 && BrowserOS.bootMode!=="standard" ? "STOPPED" : process.status;
}
function effectiveProcessCpu(process){
  return effectiveProcessStatus(process)==="RUNNING" ? process.cpu : 0;
}
function effectiveConnectionState(connection){
  if(BrowserOS.bootMode==="standard" || connection.state!=="ESTABLISHED")return connection.state;
  return BrowserOS.bootMode==="forensics" ? "CAPTURED" : "SUSPENDED";
}
function commandPs(){
  terminalPrint(" PID  PPID USER     CPU  MEM  STATUS      PROCESS");
  state.processes.forEach(p=>terminalPrint(`${String(p.pid).padStart(4)} ${String(p.ppid).padStart(5)} ${p.user.padEnd(8)} ${String(effectiveProcessCpu(p).toFixed(1)).padStart(4)} ${String(p.mem).padStart(4)}  ${effectiveProcessStatus(p).padEnd(10)}  ${p.name}`));
}
function commandTop(){
  const running=state.processes.filter(p=>effectiveProcessStatus(p)==="RUNNING");
  const cpu=running.reduce((a,p)=>a+effectiveProcessCpu(p),0).toFixed(1),mem=running.reduce((a,p)=>a+p.mem,0);
  terminalPrint(`Browser OS Process Monitor
CPU: ${cpu}% simulated
Memory: ${mem} MB simulated
Repository access: 0
Backend sessions: 0
Processes: ${running.length} running`);
}
function commandNetstat(){
  terminalPrint("PID   PROCESS          LOCAL                    REMOTE                   STATE");
  state.connections.forEach(c=>terminalPrint(`${String(c.pid).padEnd(5)} ${c.process.padEnd(16)} ${c.local.padEnd(24)} ${c.remote.padEnd(24)} ${effectiveConnectionState(c)}`));
}
function commandIp(){
  terminalPrint(`1: lo
    inet 127.0.0.1/8

2: bos0
    inet 192.0.2.10/24
    state ${BrowserOS.bootMode==="standard"?"UP":"DOWN"}
    mode VIRTUAL

default via 192.0.2.1 dev bos0
External network access: DISABLED`);
}
function commandPing(args){
  if(!args[0]){terminalPrint("ping: missing host","error");return;}
  const host=cleanHost(args[0]),site=VIRTUAL_SITES[host];
  if(BrowserOS.bootMode!=="standard"){terminalPrint("ping: virtual network is disabled in this boot mode","warning");return;}
  if(!site){terminalPrint(`ping: ${host}: virtual DNS resolution failed`,"error");addLog("dns","warn",`NXDOMAIN ${host}`);return;}
  addLog("dns","info",`Resolved ${host} -> ${site.ip}`);
  terminalPrint(`PING ${host} (${site.ip}) 56 bytes of data`);
  [1,2,3].forEach((n,i)=>terminalPrint(`64 bytes from ${site.ip}: seq=${n} ttl=64 time=${(1.7+i*.4).toFixed(1)} ms`));
  terminalPrint("3 packets transmitted, 3 received, 0% packet loss");
}
function commandDns(args){
  if(!args[0]){terminalPrint("Usage: dns host.local","warning");return;}
  if(!virtualNetworkEnabled()){terminalPrint("dns: virtual resolver is disabled in this boot mode","warning");return;}
  const host=cleanHost(args[0]),site=VIRTUAL_SITES[host];
  if(site){terminalPrint(`${host}\t${site.ip}`);addLog("dns","info",`A ${host} -> ${site.ip}`);}
  else{terminalPrint(`${host}: NXDOMAIN`,"error");addLog("dns","warn",`NXDOMAIN ${host}`);}
}
function commandBrowse(args){
  if(!args[0]){terminalPrint("Usage: browse soc.local","warning");return;}
  const url=args[0].includes("://")?args[0]:"http://"+args[0];
  openWindow("browser-window");navigateVirtual(url,true);
}
function commandLogs(){openWindow("logs-window");terminalPrint(`Opened Log Viewer (${state.logs.length} events).`,"info");}
function commandPackets(){openWindow("packet-window");terminalPrint(`Opened Packet Analyzer (${state.packets.length} packets).`,"info");}
function commandKill(args){
  const pid=Number(args[0]);if(!Number.isInteger(pid)){terminalPrint("Usage: kill <pid>","warning");return;}
  const result=terminateProcess(pid);terminalPrint(result.message,result.ok?"success":"error");
}
function commandIncidents(){
  terminalPrint("INCIDENT   SEVERITY   ENDPOINT   STATUS          DETECTION");
  terminalPrint("-----------------------------------------------------------------------");
  state.incidents.forEach(i=>terminalPrint(`${i.id.padEnd(10)} ${i.severity.padEnd(10)} ${i.endpoint.padEnd(10)} ${i.status.padEnd(15)} ${i.title}`));
}
function commandInvestigate(args){
  const id=(args[0]||"").toUpperCase(),i=state.incidents.find(x=>x.id===id);
  if(!i){terminalPrint(id?`Incident ${id} not found.`:"Usage: investigate INC-001","error");return;}
  terminalPrint(`Incident: ${i.id}
Severity: ${i.severity}
Status: ${i.status}
Endpoint: ${i.endpoint}
User: ${i.user}

Detection:
${i.title}

Process Tree:
${i.processTree}

Command / Activity:
${i.command}

Network:
${i.network}

MITRE ATT&CK:
${i.mitre}`);
}
function commandIsolate(args){
  if(!mutationAllowed("endpoint containment"))return;
  const endpoint=(args[0]||"").toUpperCase();if(!endpoint){terminalPrint("Usage: isolate WS-042","warning");return;}
  const matched=state.incidents.filter(i=>i.endpoint.toUpperCase()===endpoint);
  if(!matched.length){terminalPrint(`Endpoint ${endpoint} not found in synthetic incident database.`,"error");return;}
  matched.forEach(i=>i.status="CONTAINED");
  state.connections.filter(c=>c.endpoint.toUpperCase()===endpoint&&c.state==="ESTABLISHED").forEach(c=>{c.state="TERMINATED";});
  addLog("security","high",`Endpoint ${endpoint} isolated in simulation`);
  saveState();renderAll();terminalPrint(`STATUS: ${endpoint} CONTAINED`,"success");terminalPrint("No real endpoint or network action occurred.","muted");
  if(endpoint==="WS-042")markMissionStep("contain");
}
function commandSecurity(){
  terminalPrint(`Browser OS Security Boundary

GitHub repository access....... NONE
GitHub write API............... NOT IMPLEMENTED
Repository credentials......... NONE
Backend server................. NONE
External fetch/network......... NONE
Shell execution................ NONE
Dynamic code execution......... NONE
File System Access API......... NONE
System virtual files........... READ ONLY
Writable location.............. /home/guest/sandbox
Persistent key prefix.......... browserOS.v3.*

Browser OS has no capability to alter or delete the website that hosts it.`);
}
function commandAbout(){terminalPrint(`Browser OS ${BrowserOS.version}
Static browser-native cybersecurity environment.
Boot mode: ${BrowserOS.bootMode}
Network model: internal synthetic .local services only.
Persistence: scoped localStorage.
Real website/repository write capability: none.`);}

/* files UI */
const fileList=document.getElementById("file-list"),filePathDisplay=document.getElementById("file-path-display");
function renderFileManager(path){
  const p=normalizePath(path),entries=listDirectory(p);if(!entries)return;
  filePathDisplay.textContent=p;fileList.textContent="";
  document.getElementById("file-preview").textContent="Select a virtual file to inspect its contents.";
  if(!entries.length){const e=document.createElement("div");e.className="file-item";e.textContent="This virtual directory is empty.";fileList.appendChild(e);return;}
  entries.forEach(entry=>{
    const item=document.createElement("button");item.type="button";item.className="file-item";
    const icon=document.createElement("div");icon.className="file-item-icon";icon.textContent=entry.type==="directory"?"▣":"▪";
    const name=document.createElement("div");name.className="file-item-name";name.textContent=entry.name;
    const type=document.createElement("div");type.className="file-item-type";type.textContent=entry.type==="directory"?"Virtual folder":"Virtual file";
    item.append(icon,name,type);
    const entryPath=p==="/"?"/"+entry.name:p+"/"+entry.name;
    if(entry.type==="directory"){
      item.addEventListener("click",()=>renderFileManager(entryPath));
    }else{
      item.addEventListener("click",()=>{
        document.getElementById("file-preview").textContent=readVirtualFile(entryPath)||"(empty virtual file)";
      });
    }
    fileList.appendChild(item);
  });
}
document.querySelectorAll("[data-file-path]").forEach(b=>b.addEventListener("click",()=>{
  document.querySelectorAll("[data-file-path]").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderFileManager(b.dataset.filePath);
}));

/* network monitor */
function renderNetwork(){
  const body=document.getElementById("network-table-body");body.textContent="";
  const online=BrowserOS.bootMode==="standard";
  const forensics=BrowserOS.bootMode==="forensics";
  const pill=document.getElementById("network-mode-pill");
  pill.textContent=online?"ONLINE":forensics?"EVIDENCE FROZEN":"DISABLED";
  pill.className="status-pill "+(online?"good":"warn");
  state.connections.forEach(c=>{
    const tr=document.createElement("tr");
    tr.classList.toggle("mission-evidence-row",c.id==="C-003");
    [c.pid,c.process,c.local,c.remote,c.protocol,effectiveConnectionState(c)].forEach(v=>appendCell(tr,v));
    const td=document.createElement("td"),btn=document.createElement("button");btn.type="button";btn.className="table-action danger";btn.textContent="Terminate";
    btn.disabled=c.state!=="ESTABLISHED"||!online;
    btn.title=!online?"Connection controls require Standard Mode":"";
    btn.addEventListener("click",()=>terminateConnection(c.id));td.appendChild(btn);tr.appendChild(td);body.appendChild(tr);
  });
  document.getElementById("network-active-count").textContent=online?state.connections.filter(c=>c.state==="ESTABLISHED").length:0;
}
function terminateConnection(id){
  if(!virtualNetworkEnabled()){terminalPrint("Connection termination requires Standard Mode.","warning");return;}
  if(!mutationAllowed("connection termination"))return;
  const c=state.connections.find(x=>x.id===id);if(!c||c.state!=="ESTABLISHED")return;
  c.state="TERMINATED";addLog("firewall","warn",`Connection ${id} terminated: ${c.local} -> ${c.remote}`);saveState();renderNetwork();
}

/* processes */
function renderProcesses(){
  const body=document.getElementById("process-table-body");body.textContent="";
  state.processes.forEach(p=>{
    const tr=document.createElement("tr");
    tr.classList.toggle("mission-evidence-row",[905,910,917].includes(p.pid));
    [p.pid,p.ppid,p.user,p.name,effectiveProcessCpu(p).toFixed(1)+"%",p.mem+" MB",effectiveProcessStatus(p),p.protected?"SYSTEM":"USER"].forEach(v=>appendCell(tr,v));
    tr.addEventListener("click",()=>showProcessDetail(p.pid));
    const td=document.createElement("td"),btn=document.createElement("button");btn.type="button";btn.className="table-action danger";btn.textContent="Terminate";btn.disabled=p.protected||p.status==="TERMINATED"||BrowserOS.bootMode==="forensics";
    btn.addEventListener("click",e=>{e.stopPropagation();terminateProcess(p.pid);});td.appendChild(btn);tr.appendChild(td);body.appendChild(tr);
  });
}
function showProcessDetail(pid){
  const p=state.processes.find(x=>x.pid===pid);if(!p)return;
  const children=state.processes.filter(x=>x.ppid===pid).map(x=>`${x.pid}:${x.name}`).join(", ")||"none";
  const conns=state.connections.filter(x=>x.pid===pid).map(x=>`${x.local} -> ${x.remote} [${effectiveConnectionState(x)}]`).join("\n")||"none";
  document.getElementById("process-detail").textContent=`PID: ${p.pid}
PPID: ${p.ppid}
User: ${p.user}
Process: ${p.name}
Status: ${effectiveProcessStatus(p)}
Protected: ${p.protected ? "yes" : "no"}

Command Line:
${p.cmd}

Children:
${children}

Network Connections:
${conns}`;
}
function terminateProcess(pid){
  if(!mutationAllowed("process termination"))return{ok:false,message:"Process termination is disabled in read-only Forensics Mode."};
  const p=state.processes.find(x=>x.pid===pid);
  if(!p)return{ok:false,message:`PID ${pid} not found.`};
  if(p.protected)return{ok:false,message:`PID ${pid} (${p.name}) is a protected Browser OS system process.`};
  if(p.status==="TERMINATED")return{ok:false,message:`PID ${pid} is already terminated.`};
  p.status="TERMINATED";p.cpu=0;
  state.connections.filter(c=>c.pid===pid&&c.state==="ESTABLISHED").forEach(c=>c.state="TERMINATED");
  addLog("system","warn",`Process ${p.name} (${pid}) terminated in simulation`);
  saveState();renderProcesses();renderNetwork();
  if(pid===730){document.getElementById("browser-page").textContent="The simulated browser process was terminated. Reopen the Browser application to restart it.";}
  return{ok:true,message:`Terminated simulated process ${p.name} (${pid}).`};
}

/* logs */
function renderLogs(){
  const list=document.getElementById("log-list");
  if(!list)return;
  const source=(document.getElementById("log-source-filter")?.value)||"all";
  const q=(document.getElementById("log-search")?.value||"").trim().toLowerCase();
  list.textContent="";
  const filtered=state.logs.filter(l=>(source==="all"||l.source===source)&&(!q||`${l.time} ${l.source} ${l.level} ${l.message}`.toLowerCase().includes(q))).slice().reverse();
  if(!filtered.length){const d=document.createElement("div");d.className="detail-panel";d.textContent="No simulated log events match the current filter.";list.appendChild(d);return;}
  filtered.forEach(l=>{
    const row=document.createElement("div");row.className="log-row";
    row.classList.toggle("mission-evidence-row",l.message.includes("WS-042"));
    const t=document.createElement("span");t.className="log-time";t.textContent=l.time;
    const s=document.createElement("span");s.className="log-source";s.textContent=l.source;
    const lv=document.createElement("span");lv.className="log-level "+l.level;lv.textContent=l.level.toUpperCase();
    const m=document.createElement("span");m.className="log-message";m.textContent=l.message;
    row.append(t,s,lv,m);list.appendChild(row);
  });
}
document.getElementById("log-source-filter").addEventListener("change",renderLogs);
document.getElementById("log-search").addEventListener("input",renderLogs);
document.getElementById("log-clear-view").addEventListener("click",()=>{if(!mutationAllowed("log clearing"))return;state.logs=[];saveState();renderLogs();updateIncidentMetrics();});

/* packets */
function renderPackets(){
  const body=document.getElementById("packet-table-body");if(!body)return;
  const q=(document.getElementById("packet-filter").value||"").trim().toLowerCase();body.textContent="";
  state.packets.filter(p=>!q||`${p.no} ${p.time} ${p.src} ${p.dst} ${p.proto} ${p.info}`.toLowerCase().includes(q)).forEach(p=>{
    const tr=document.createElement("tr");[p.no,p.time,p.src,p.dst,p.proto,p.info].forEach(v=>appendCell(tr,v));
    tr.classList.toggle("mission-evidence-row",p.src==="203.0.113.91"||p.dst==="203.0.113.91");
    tr.addEventListener("click",()=>{document.querySelectorAll(".packet-table tbody tr").forEach(x=>x.classList.remove("selected"));tr.classList.add("selected");document.getElementById("packet-detail").textContent=p.detail;});
    body.appendChild(tr);
  });
  document.getElementById("capture-toggle").textContent=state.captureEnabled?"Stop Capture":"Start Capture";
}
document.getElementById("packet-filter").addEventListener("input",renderPackets);
document.getElementById("capture-toggle").addEventListener("click",()=>{if(!mutationAllowed("capture state change"))return;state.captureEnabled=!state.captureEnabled;saveState();renderPackets();addLog("system","info",`Synthetic packet capture ${state.captureEnabled?"started":"stopped"}`);});
document.getElementById("packet-clear").addEventListener("click",()=>{if(!mutationAllowed("packet clearing"))return;state.packets=[];state.nextPacket=1;saveState();renderPackets();document.getElementById("packet-detail").textContent="Capture cleared. New packets will appear when virtual traffic is generated.";});

/* browser + virtual network */
function cleanHost(value){
  let v=value.trim().toLowerCase();
  v=v.replace(/^https?:\/\//,"").split("/")[0].split(":")[0];
  return v;
}
function normalizeVirtualUrl(value){
  let v=value.trim();
  if(!v.includes("://"))v="http://"+v;
  try{
    const u=new URL(v);
    return {url:u,host:u.hostname.toLowerCase()};
  }catch{return null;}
}
function virtualNetworkEnabled(){return BrowserOS.bootMode==="standard";}
function navigateVirtual(value,emitTelemetry=true){
  const page=document.getElementById("browser-page"),status=document.getElementById("browser-status"),address=document.getElementById("browser-address");
  page.dataset.loaded="true";
  const parsed=normalizeVirtualUrl(value);
  if(!parsed){renderBrowserError("Invalid virtual address","Enter one of the Browser OS .local services.");return;}
  address.value=parsed.url.href;
  const site=VIRTUAL_SITES[parsed.host];

  if(!virtualNetworkEnabled()){
    renderBrowserError("Virtual network unavailable",`${BrowserOS.bootMode.toUpperCase()} mode does not generate network traffic.`);
    status.textContent="bos0 DOWN";return;
  }
  if(!site){
    renderBrowserError("External navigation blocked",`${parsed.host} is not a predefined Browser OS .local service. No real network request was made.`);
    status.textContent="Blocked by Browser OS network boundary";
    if(emitTelemetry){addLog("dns","warn",`NXDOMAIN / blocked external navigation: ${parsed.host}`);addPacket("192.0.2.10","192.0.2.53","DNS",`Standard query A ${parsed.host}`,`DNS query for ${parsed.host}\nResult: NXDOMAIN / blocked by Browser OS virtual resolver`);}
    return;
  }

  if(emitTelemetry) simulateNavigation(parsed.host,site,parsed.url.protocol);
  renderVirtualSite(site,parsed.host);
  status.textContent=`${parsed.host} → ${site.ip}:${site.port} · VIRTUAL`;
}
function simulateNavigation(host,site,scheme){
  const localPort=51500+Math.floor(Math.random()*300);
  addLog("browser","info",`Navigate ${scheme}//${host}/`);
  addLog("dns","info",`A ${host} -> ${site.ip}`);
  addPacket("192.0.2.10","192.0.2.53","DNS",`Standard query A ${host}`,`Domain Name System\n    Query: A ${host}`);
  addPacket("192.0.2.53","192.0.2.10","DNS",`Response A ${site.ip}`,`Domain Name System\n    Answer: ${host} = ${site.ip}`);
  addPacket("192.0.2.10",site.ip,"TCP",`${localPort} → ${site.port} [SYN]`,`Transmission Control Protocol\n    Source Port: ${localPort}\n    Destination Port: ${site.port}\n    Flags: SYN`);
  addPacket(site.ip,"192.0.2.10","TCP",`${site.port} → ${localPort} [SYN, ACK]`,`Transmission Control Protocol\n    Flags: SYN, ACK`);
  addPacket("192.0.2.10",site.ip,"TCP",`${localPort} → ${site.port} [ACK]`,`Transmission Control Protocol\n    Flags: ACK`);
  if(site.port===443){
    addPacket("192.0.2.10",site.ip,"TLS",`Client Hello SNI=${host}`,`Transport Layer Security 1.3\n    Handshake: Client Hello\n    Server Name: ${host}`);
  }else{
    addPacket("192.0.2.10",site.ip,"HTTP",`GET / Host: ${host}`,`Hypertext Transfer Protocol\n    GET / HTTP/1.1\n    Host: ${host}`);
  }
  const existing=state.connections.find(c=>c.pid===730&&c.remote===`${site.ip}:${site.port}`&&c.state==="ESTABLISHED");
  if(!existing){
    state.connections.push({id:`C-${String(state.nextConnection++).padStart(3,"0")}`,pid:730,process:"bos-browser",endpoint:"BROWSER-OS",local:`192.0.2.10:${localPort}`,remote:`${site.ip}:${site.port}`,protocol:site.port===443?"TCP/TLS":"TCP/HTTP",state:"ESTABLISHED"});
  }
  saveState();renderNetwork();
}
function renderVirtualSite(site,host){
  const page=document.getElementById("browser-page");page.textContent="";
  const wrap=document.createElement("div");wrap.className="virtual-site";
  const tag=document.createElement("div");tag.className="site-topline";tag.textContent=`${site.tag} · ${host}`;
  const h=document.createElement("h1");h.textContent=site.title;
  const p=document.createElement("p");p.textContent=site.text;
  const grid=document.createElement("div");grid.className="virtual-card-grid";
  site.cards.forEach(([value,label])=>{const card=document.createElement("div");card.className="virtual-card";const strong=document.createElement("strong");strong.textContent=value;const span=document.createElement("span");span.textContent=label;card.append(strong,span);grid.appendChild(card);});
  const note=document.createElement("p");note.textContent=`Resolved internally to ${site.ip}:${site.port}. This page was rendered from Browser OS JavaScript data; no external HTTP request occurred.`;
  wrap.append(tag,h,p,grid,note);page.appendChild(wrap);
}
function renderBrowserError(title,message){
  const page=document.getElementById("browser-page");page.textContent="";
  const box=document.createElement("div");box.className="browser-error";
  const h=document.createElement("h2");h.textContent=title;const p=document.createElement("p");p.textContent=message;
  box.append(h,p);page.appendChild(box);
}
document.getElementById("browser-form").addEventListener("submit",e=>{e.preventDefault();navigateVirtual(document.getElementById("browser-address").value,true);});
document.getElementById("browser-home").addEventListener("click",()=>navigateVirtual("http://soc.local",true));
document.querySelectorAll("[data-virtual-url]").forEach(b=>b.addEventListener("click",()=>navigateVirtual(b.dataset.virtualUrl,true)));

/* incidents */
function renderIncidentTable(){
  const body=document.getElementById("incident-table-body");body.textContent="";
  state.incidents.forEach(i=>{
    const tr=document.createElement("tr");appendCell(tr,i.id);
    tr.classList.toggle("mission-evidence-row",i.id==="INC-001");
    const sevTd=document.createElement("td"),sev=document.createElement("span");sev.className="severity "+i.severity.toLowerCase();sev.textContent=i.severity;sevTd.appendChild(sev);tr.appendChild(sevTd);
    appendCell(tr,i.endpoint);appendCell(tr,i.status);appendCell(tr,i.title);
    const td=document.createElement("td"),btn=document.createElement("button");btn.className="table-action";btn.type="button";btn.textContent="Investigate";
    btn.addEventListener("click",()=>{openWindow("terminal-window");terminalPrint(`${terminalPrompt.textContent} investigate ${i.id}`,"command");commandInvestigate([i.id]);});td.appendChild(btn);tr.appendChild(td);body.appendChild(tr);
  });
  updateIncidentMetrics();
}
function updateIncidentMetrics(){
  document.getElementById("metric-active").textContent=state.incidents.filter(i=>i.status!=="CLOSED").length;
  document.getElementById("metric-critical").textContent=state.incidents.filter(i=>i.severity==="CRITICAL").length;
  document.getElementById("metric-contained").textContent=state.incidents.filter(i=>i.status==="CONTAINED").length;
  document.getElementById("metric-telemetry").textContent=state.logs.length;
}
function appendCell(row,value){const td=document.createElement("td");td.textContent=String(value);row.appendChild(td);}

/* virtual destruction/reinstall */
function destroyVirtualOS(){
  state.virtualDestroyed=true;saveState();
  addLog("system","critical","Virtual root filesystem destroyed by simulated rm -rf /");
  terminalPrint("[ Browser OS Virtual Filesystem ]","error");
  terminalPrint("Virtual filesystem destroyed. Real website and GitHub repository unchanged.","warning");
  setTimeout(showKernelPanic,250);
}
function showKernelPanic(){document.getElementById("kernel-panic").classList.remove("hidden");}
function reinstallVirtualOS(){
  state=defaultState();sandboxFiles={};saveState();saveSandbox();
  document.getElementById("kernel-panic").classList.add("hidden");
  BrowserOS.currentDirectory="/home/guest";BrowserOS.bootTime=Date.now();BrowserOS.missionProgress.clear();
  renderAll();terminalPrint("Browser OS virtual environment reinstalled.","success");
}
document.getElementById("reinstall-os").addEventListener("click",reinstallVirtualOS);
document.getElementById("panic-reboot").addEventListener("click",()=>location.reload());

function resetSimulation(reloadUi=true){
  state=defaultState();sandboxFiles={};
  StorageLayer.remove(KEY.state);StorageLayer.remove(KEY.sandbox);
  BrowserOS.currentDirectory="/home/guest";BrowserOS.bootTime=Date.now();BrowserOS.missionProgress.clear();
  if(reloadUi)renderAll();else renderAll();
}

/* render */
function renderAll(){
  renderFileManager("/home/guest");
  renderNetwork();
  renderProcesses();
  renderLogs();
  renderPackets();
  renderIncidentTable();
  renderMission();
  if(BrowserOS.bootMode!=="forensics")saveState();
  const storageStatus=document.getElementById("system-storage-status");
  if(storageStatus){
    storageStatus.textContent=BrowserOS.storageAvailable?"Scoped browser storage available":"Memory-only fallback";
    storageStatus.classList.toggle("safe-text",BrowserOS.storageAvailable);
  }
}
