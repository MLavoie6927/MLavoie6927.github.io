"use strict";

/*
  Browser OS 2.0
  Static browser-native cybersecurity and systems administration simulator.

  SECURITY BOUNDARY
  - No eval() or Function().
  - No fetch(), XMLHttpRequest, WebSocket, EventSource, or external network client.
  - No operating-system shell invocation.
  - No GitHub API calls, repository credentials, SSH keys, passwords, or deployment tokens.
  - No File System Access API.
  - Persistence is limited to browserOS.v4.* keys in the current visitor's browser.
*/

const STORAGE_PREFIX = "browserOS.v4.";
const STORAGE_KEYS = Object.freeze({
  state: STORAGE_PREFIX + "state",
  snapshots: STORAGE_PREFIX + "snapshots",
  workspace: STORAGE_PREFIX + "workspace"
});

const APP_DEFINITIONS = Object.freeze([
  { id: "ops-window", name: "Operations Center", icon: "▦", keywords: "dashboard performance health metrics" },
  { id: "terminal-window", name: "Terminal", icon: "⌨", keywords: "shell commands cli administration" },
  { id: "soc-window", name: "SOC Console", icon: "◆", keywords: "incidents alerts detection response" },
  { id: "process-window", name: "Process Explorer", icon: "◫", keywords: "process pid cpu memory lineage" },
  { id: "network-window", name: "Network Monitor", icon: "◎", keywords: "connections tcp udp sessions network" },
  { id: "packet-window", name: "Packet Analyzer", icon: "⇄", keywords: "packets dns tls tcp analysis" },
  { id: "logs-window", name: "Log Viewer", icon: "≡", keywords: "events logs telemetry system security" },
  { id: "files-window", name: "Virtual File System", icon: "▣", keywords: "files editor sandbox filesystem" },
  { id: "services-window", name: "Service Manager", icon: "⚙", keywords: "systemd services dependencies restart" },
  { id: "identity-window", name: "Identity & Sessions", icon: "♙", keywords: "users roles session mfa identity" },
  { id: "firewall-window", name: "Firewall Manager", icon: "⬡", keywords: "firewall policy rules stateful acl" },
  { id: "scheduler-window", name: "Task Scheduler", icon: "◷", keywords: "cron schedule automation jobs" },
  { id: "query-window", name: "Telemetry Query Console", icon: "⌕", keywords: "query siem search filter telemetry" },
  { id: "snapshot-window", name: "Snapshots & Recovery", icon: "◩", keywords: "snapshot recovery backup state" },
  { id: "system-window", name: "System Information", icon: "ⓘ", keywords: "system version security architecture" }
]);

const BOOT_MODE_DESCRIPTIONS = Object.freeze({
  standard: "Full virtual network, service, scheduler, and SOC simulation.",
  safe: "Minimal services; synthetic traffic and scheduled task execution disabled.",
  forensics: "Read-only evidence mode; all state-changing operations are blocked."
});

const deepClone = value => {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomChoice = values => values[Math.floor(Math.random() * values.length)];
const nowIso = () => new Date().toISOString();
const timeOnly = value => new Date(value).toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
const shortDate = value => new Date(value).toLocaleString([], { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
const byId = id => document.getElementById(id);
const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

const StorageLayer = Object.freeze({
  get(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }
});

function createDefaultState() {
  const created = nowIso();
  return {
    version: 4,
    bootMode: "standard",
    selectedBootMode: "standard",
    booted: false,
    bootTime: Date.now(),
    zIndex: 30,
    captureEnabled: true,
    networkGenerationEnabled: true,
    schedulerEnabled: true,
    performance: {
      cpu: 18,
      memory: 42,
      disk: 37,
      networkKbps: 84,
      cpuHistory: Array.from({ length: 60 }, () => randomInt(8, 34)),
      memoryHistory: Array.from({ length: 60 }, () => randomInt(36, 48))
    },
    activeUser: "guest",
    sessionLocked: false,
    currentDirectory: "/home/guest",
    terminalHistory: [],
    terminalHistoryIndex: 0,
    opsEvents: [
      { time: created, title: "Browser OS state initialized", detail: "Virtual subsystems loaded from default state." }
    ],
    services: [
      { name: "browser-init.service", description: "Browser OS initialization manager", state: "running", startup: "enabled", pid: 1, deps: [], restarts: 0, protected: true },
      { name: "virtual-fs.service", description: "Virtual filesystem and sandbox provider", state: "running", startup: "enabled", pid: 114, deps: ["browser-init.service"], restarts: 0, protected: true },
      { name: "network-sim.service", description: "Synthetic network stack", state: "running", startup: "enabled", pid: 221, deps: ["browser-init.service"], restarts: 0, protected: true },
      { name: "telemetry-agent.service", description: "Security telemetry collector", state: "running", startup: "enabled", pid: 317, deps: ["virtual-fs.service", "network-sim.service"], restarts: 0, protected: true },
      { name: "detection-engine.service", description: "Synthetic analytics and correlation engine", state: "running", startup: "enabled", pid: 401, deps: ["telemetry-agent.service"], restarts: 0, protected: true },
      { name: "scheduler.service", description: "Browser OS scheduled task service", state: "running", startup: "enabled", pid: 455, deps: ["browser-init.service"], restarts: 0, protected: false },
      { name: "session-manager.service", description: "Local simulated identity and session manager", state: "running", startup: "enabled", pid: 510, deps: ["browser-init.service"], restarts: 0, protected: true },
      { name: "firewall.service", description: "Stateful virtual firewall policy engine", state: "running", startup: "enabled", pid: 550, deps: ["network-sim.service"], restarts: 0, protected: true },
      { name: "browser-shell.service", description: "Allowlisted Browser OS terminal dispatcher", state: "running", startup: "enabled", pid: 622, deps: ["virtual-fs.service", "session-manager.service"], restarts: 0, protected: true },
      { name: "bos-browser.service", description: "Virtual .local browser client", state: "running", startup: "manual", pid: 730, deps: ["network-sim.service", "firewall.service"], restarts: 0, protected: false }
    ],
    users: [
      { username: "guest", role: "Standard User", mfa: false, locked: false, lastSignIn: created, groups: ["users", "lab"] },
      { username: "soc", role: "SOC Analyst", mfa: true, locked: false, lastSignIn: created, groups: ["users", "soc", "security-read"] },
      { username: "admin", role: "System Administrator", mfa: true, locked: false, lastSignIn: created, groups: ["users", "admins", "security-admin"] },
      { username: "forensics", role: "Forensics Analyst", mfa: true, locked: false, lastSignIn: created, groups: ["users", "forensics", "evidence-read"] }
    ],
    sessions: [
      { id: "SES-1001", username: "guest", assurance: "standard", started: created, status: "active", source: "local-console" }
    ],
    firewallRules: [
      { id: 10, action: "allow", protocol: "UDP", source: "192.0.2.0/24", destination: "192.0.2.53", port: "53", enabled: true, description: "Permit virtual DNS" },
      { id: 20, action: "allow", protocol: "TCP", source: "192.0.2.0/24", destination: "198.51.100.0/24", port: "80,443", enabled: true, description: "Permit allowlisted internal web services" },
      { id: 30, action: "allow", protocol: "TCP", source: "192.0.2.0/24", destination: "203.0.113.0/24", port: "443", enabled: true, description: "Permit synthetic threat-lab TLS for investigation" },
      { id: 40, action: "deny", protocol: "TCP", source: "any", destination: "any", port: "22,3389", enabled: true, description: "Block remote administration protocols" },
      { id: 50, action: "deny", protocol: "ANY", source: "any", destination: "any", port: "any", enabled: true, description: "Default deny" }
    ],
    firewallStats: {
      allowed: 124,
      blocked: 17,
      trackedSessions: 3
    },
    tasks: [
      { id: "TASK-001", name: "Security health snapshot", schedule: "every 5m", command: "health-check", enabled: true, lastRun: null, nextRun: Date.now() + 300000, runCount: 0 },
      { id: "TASK-002", name: "Rotate synthetic logs", schedule: "every 15m", command: "log-rotate", enabled: true, lastRun: null, nextRun: Date.now() + 900000, runCount: 0 },
      { id: "TASK-003", name: "Detection correlation sweep", schedule: "every 2m", command: "detect-sweep", enabled: true, lastRun: null, nextRun: Date.now() + 120000, runCount: 0 },
      { id: "TASK-004", name: "Sandbox integrity check", schedule: "every 10m", command: "sandbox-check", enabled: true, lastRun: null, nextRun: Date.now() + 600000, runCount: 0 }
    ],
    taskHistory: [],
    incidents: [
      {
        id: "INC-001",
        severity: "HIGH",
        endpoint: "WS-042",
        status: "INVESTIGATING",
        title: "Encoded PowerShell Execution",
        owner: "soc",
        user: "jsmith",
        processTree: "WINWORD.EXE → powershell.exe → rundll32.exe",
        command: "powershell.exe -NoProfile -EncodedCommand SQBFAFgA...",
        network: "192.0.2.23 → 203.0.113.91:443",
        mitre: ["T1059.001", "T1218.011"],
        notes: "Macro-originated encoded PowerShell followed by Rundll32 and TLS egress."
      },
      {
        id: "INC-002",
        severity: "CRITICAL",
        endpoint: "DC-01",
        status: "CONTAINED",
        title: "Credential Dumping Behavior",
        owner: "soc",
        user: "svc_backup",
        processTree: "services.exe → suspicious.exe → lsass access",
        command: "Simulated credential-access behavior",
        network: "192.0.2.5 → 192.0.2.22:445",
        mitre: ["T1003"],
        notes: "Synthetic LSASS-access pattern contained for investigation."
      },
      {
        id: "INC-003",
        severity: "MEDIUM",
        endpoint: "WS-017",
        status: "CLOSED",
        title: "Suspicious DNS Activity",
        owner: "soc",
        user: "mgarcia",
        processTree: "browser.exe",
        command: "Repeated synthetic DNS resolution failures",
        network: "Repeated NXDOMAIN activity",
        mitre: ["T1071.004"],
        notes: "Closed after confirming benign lab lookup loop."
      },
      {
        id: "INC-004",
        severity: "HIGH",
        endpoint: "WS-031",
        status: "INVESTIGATING",
        title: "Possible C2 Beaconing",
        owner: "soc",
        user: "alee",
        processTree: "explorer.exe → updater.exe",
        command: "Periodic outbound connection",
        network: "192.0.2.31 → 203.0.113.74:443",
        mitre: ["T1071.001"],
        notes: "Periodic TLS interval requires validation against endpoint evidence."
      }
    ],
    processes: [
      { pid: 1, ppid: 0, user: "root", name: "browser-init", cpu: 0.1, mem: 5, status: "RUNNING", protected: true, cmd: "/sbin/browser-init --sandbox" },
      { pid: 114, ppid: 1, user: "root", name: "virtual-fs", cpu: 0.1, mem: 7, status: "RUNNING", protected: true, cmd: "virtual-fs --readonly-system --sandbox=/home/guest/sandbox" },
      { pid: 221, ppid: 1, user: "root", name: "network-sim", cpu: 0.2, mem: 8, status: "RUNNING", protected: true, cmd: "network-sim --interface bos0 --virtual-only" },
      { pid: 317, ppid: 1, user: "soc", name: "telemetry-agent", cpu: 0.6, mem: 12, status: "RUNNING", protected: true, cmd: "telemetry-agent --sources security,dns,firewall" },
      { pid: 401, ppid: 317, user: "soc", name: "detection-engine", cpu: 0.4, mem: 10, status: "RUNNING", protected: true, cmd: "detection-engine --synthetic" },
      { pid: 455, ppid: 1, user: "root", name: "scheduler", cpu: 0.1, mem: 6, status: "RUNNING", protected: false, cmd: "scheduler --local-only" },
      { pid: 510, ppid: 1, user: "root", name: "session-manager", cpu: 0.1, mem: 5, status: "RUNNING", protected: true, cmd: "session-manager --simulated-identities" },
      { pid: 550, ppid: 221, user: "root", name: "firewall", cpu: 0.2, mem: 8, status: "RUNNING", protected: true, cmd: "firewall --stateful --default-deny" },
      { pid: 622, ppid: 1, user: "guest", name: "browser-shell", cpu: 0.1, mem: 6, status: "RUNNING", protected: true, cmd: "browser-shell --allowlist" },
      { pid: 730, ppid: 1, user: "guest", name: "bos-browser", cpu: 0.3, mem: 18, status: "RUNNING", protected: false, cmd: "bos-browser --virtual-network-only" },
      { pid: 842, ppid: 1, user: "guest", name: "updater.exe", cpu: 1.4, mem: 22, status: "RUNNING", protected: false, cmd: "C:\\Users\\guest\\AppData\\Local\\updater.exe --silent" },
      { pid: 905, ppid: 1, user: "jsmith", name: "WINWORD.EXE", cpu: 0.7, mem: 46, status: "RUNNING", protected: false, cmd: "WINWORD.EXE invoice.docm" },
      { pid: 910, ppid: 905, user: "jsmith", name: "powershell.exe", cpu: 2.8, mem: 31, status: "RUNNING", protected: false, cmd: "powershell.exe -NoProfile -EncodedCommand SQBFAFgA..." },
      { pid: 917, ppid: 910, user: "jsmith", name: "rundll32.exe", cpu: 1.2, mem: 15, status: "RUNNING", protected: false, cmd: "rundll32.exe javascript:synthetic-demo-entry" }
    ],
    connections: [
      { id: "C-001", pid: 842, process: "updater.exe", local: "192.0.2.10:51522", remote: "203.0.113.74:443", protocol: "TCP/TLS", state: "ESTABLISHED", policy: "ALLOW" },
      { id: "C-002", pid: 401, process: "detection-engine", local: "192.0.2.10:51402", remote: "198.51.100.40:443", protocol: "TCP/TLS", state: "ESTABLISHED", policy: "ALLOW" },
      { id: "C-003", pid: 917, process: "rundll32.exe", local: "192.0.2.23:52344", remote: "203.0.113.91:443", protocol: "TCP/TLS", state: "ESTABLISHED", policy: "ALLOW" }
    ],
    packets: [
      { no: 1, time: "0.0000", src: "192.0.2.10", dst: "192.0.2.53", proto: "DNS", info: "Standard query A soc.local", detail: "Ethernet II\nIPv4\nUDP 53002 → 53\nDNS query A soc.local" },
      { no: 2, time: "0.0162", src: "192.0.2.53", dst: "192.0.2.10", proto: "DNS", info: "Response A 198.51.100.20", detail: "Ethernet II\nIPv4\nUDP 53 → 53002\nDNS answer soc.local = 198.51.100.20" },
      { no: 3, time: "0.0411", src: "192.0.2.10", dst: "198.51.100.20", proto: "TCP", info: "51500 → 80 [SYN]", detail: "Ethernet II\nIPv4\nTCP\nFlags: SYN" },
      { no: 4, time: "3.4012", src: "192.0.2.23", dst: "192.0.2.53", proto: "DNS", info: "Query telemetry-sync.example", detail: "Endpoint WS-042\nDNS A telemetry-sync.example" },
      { no: 5, time: "3.4188", src: "192.0.2.53", dst: "192.0.2.23", proto: "DNS", info: "Response A 203.0.113.91", detail: "DNS answer 203.0.113.91\nDocumentation-range address" },
      { no: 6, time: "3.4421", src: "192.0.2.23", dst: "203.0.113.91", proto: "TCP", info: "52344 → 443 [SYN]", detail: "Process rundll32.exe PID 917\nTCP SYN to 203.0.113.91:443" },
      { no: 7, time: "3.5074", src: "192.0.2.23", dst: "203.0.113.91", proto: "TLS", info: "Client Hello SNI telemetry-sync.example", detail: "TLS Client Hello\nSNI telemetry-sync.example\nProcess rundll32.exe PID 917\nIncident INC-001" }
    ],
    logs: [
      { time: "2026-09-03T17:40:03Z", source: "security", level: "high", message: "WS-042 WINWORD.EXE spawned powershell.exe" },
      { time: "2026-09-03T17:40:04Z", source: "security", level: "high", message: "WS-042 powershell.exe encoded_command=true" },
      { time: "2026-09-03T17:40:08Z", source: "firewall", level: "warn", message: "ALLOW 192.0.2.23 -> 203.0.113.91 TCP/443 rule=30" },
      { time: "2026-09-03T17:44:11Z", source: "security", level: "critical", message: "DC-01 simulated credential access behavior detected" },
      { time: "2026-09-03T17:46:43Z", source: "security", level: "high", message: "WS-031 periodic HTTPS connection pattern detected" },
      { time: created, source: "system", level: "info", message: "Browser OS 3.0 synthetic telemetry engine initialized" }
    ],
    filesystem: {
      "/home/guest": {
        type: "dir",
        children: ["readme.txt", "investigation-notes.md", "sandbox"]
      },
      "/home/guest/readme.txt": {
        type: "file",
        writable: false,
        content: "Browser OS 3.0\n\nThis is a static browser-native simulation.\nNo real host filesystem or repository is exposed."
      },
      "/home/guest/investigation-notes.md": {
        type: "file",
        writable: false,
        content: "# Investigation Notes\n\nUse SOC, process, network, packet, and log evidence to validate INC-001."
      },
      "/home/guest/sandbox": {
        type: "dir",
        children: ["analyst-notes.txt"]
      },
      "/home/guest/sandbox/analyst-notes.txt": {
        type: "file",
        writable: true,
        content: "Analyst scratchpad. This file is stored only in Browser OS local simulation state."
      },
      "/var/log": {
        type: "dir",
        children: ["security.log", "system.log", "firewall.log"]
      },
      "/var/log/security.log": {
        type: "file",
        writable: false,
        generated: "security"
      },
      "/var/log/system.log": {
        type: "file",
        writable: false,
        generated: "system"
      },
      "/var/log/firewall.log": {
        type: "file",
        writable: false,
        generated: "firewall"
      },
      "/etc": {
        type: "dir",
        children: ["hostname", "firewall.conf", "services.conf"]
      },
      "/etc/hostname": {
        type: "file",
        writable: false,
        content: "browser-os"
      },
      "/etc/firewall.conf": {
        type: "file",
        writable: false,
        generated: "firewall-config"
      },
      "/etc/services.conf": {
        type: "file",
        writable: false,
        generated: "services-config"
      }
    },
    currentFilePath: null,
    queryHistory: [],
    nextPacket: 8,
    nextConnection: 4,
    nextRuleId: 60,
    nextTaskId: 5,
    nextSessionId: 1002
  };
}

function loadState() {
  const defaults = createDefaultState();
  const raw = StorageLayer.get(STORAGE_KEYS.state, "");
  if (!raw) {
    return defaults;
  }
  const parsed = safeJsonParse(raw, null);
  if (!parsed || parsed.version !== 4) {
    return defaults;
  }
  return parsed;
}

let state = loadState();
let snapshots = safeJsonParse(StorageLayer.get(STORAGE_KEYS.snapshots, "[]"), []);
let performanceTimer = null;
let simulationTimer = null;
let schedulerTimer = null;
let clockTimer = null;
let dragState = null;

function persistState() {
  StorageLayer.set(STORAGE_KEYS.state, JSON.stringify(state));
}

function persistSnapshots() {
  StorageLayer.set(STORAGE_KEYS.snapshots, JSON.stringify(snapshots));
}

function isReadOnly() {
  return state.bootMode === "forensics";
}

function requireMutable(action) {
  if (!isReadOnly()) {
    return true;
  }
  toast("Read-only mode", action + " is blocked in Forensics Mode.", "warn");
  addLog("system", "warn", "Forensics Mode blocked mutation: " + action, false);
  return false;
}

function addOpsEvent(title, detail) {
  state.opsEvents.unshift({
    time: nowIso(),
    title,
    detail
  });
  state.opsEvents = state.opsEvents.slice(0, 80);
}

function addLog(source, level, message, persist = true) {
  state.logs.unshift({
    time: nowIso(),
    source,
    level,
    message
  });
  state.logs = state.logs.slice(0, 600);
  if (persist) {
    persistState();
  }
  renderLogs();
}

function toast(title, message, type = "info") {
  const stack = byId("toast-stack");
  if (!stack) {
    return;
  }
  const node = document.createElement("div");
  node.className = "toast " + type;
  const strong = document.createElement("strong");
  strong.textContent = title;
  const span = document.createElement("span");
  span.textContent = message;
  node.append(strong, span);
  stack.appendChild(node);
  window.setTimeout(() => {
    node.remove();
  }, 4200);
}

function formatBytesLike(value) {
  if (value < 1024) {
    return value + " KB/s";
  }
  return (value / 1024).toFixed(1) + " MB/s";
}

function serviceByName(name) {
  return state.services.find(service => service.name === name) || null;
}

function processByPid(pid) {
  return state.processes.find(process => process.pid === Number(pid)) || null;
}

function userByName(username) {
  return state.users.find(user => user.username === username) || null;
}

function activeServices() {
  return state.services.filter(service => service.state === "running");
}

function activeIncidents() {
  return state.incidents.filter(incident => !["CLOSED", "RESOLVED"].includes(incident.status));
}

function activeSessions() {
  return state.sessions.filter(session => session.status === "active");
}

function systemHealthScore() {
  const servicePenalty = state.services.filter(service => service.state !== "running" && service.startup === "enabled").length * 9;
  const incidentPenalty = state.incidents.filter(incident => incident.severity === "CRITICAL" && incident.status !== "CLOSED").length * 12;
  const cpuPenalty = Math.max(0, state.performance.cpu - 75) * 0.4;
  const memoryPenalty = Math.max(0, state.performance.memory - 80) * 0.5;
  return clamp(Math.round(100 - servicePenalty - incidentPenalty - cpuPenalty - memoryPenalty), 0, 100);
}

function bootLine(status, message) {
  const output = byId("boot-output");
  if (!output) {
    return;
  }
  const row = document.createElement("div");
  row.className = "boot-line";
  const tag = document.createElement("span");
  tag.className = status.toLowerCase();
  tag.textContent = "[ " + status + " ]";
  const text = document.createElement("span");
  text.textContent = message;
  row.append(tag, text);
  output.appendChild(row);
  output.scrollTop = output.scrollHeight;
}

function delay(milliseconds) {
  return new Promise(resolve => window.setTimeout(resolve, milliseconds));
}

async function runBoot(mode, fast) {
  const output = byId("boot-output");
  if (!output) {
    return;
  }
  output.replaceChildren();
  state.bootMode = mode;
  state.selectedBootMode = mode;
  state.bootTime = Date.now();
  state.booted = false;
  const baseLines = [
    ["INFO", "BrowserBIOS 2.0 initializing"],
    ["OK", "Memory sandbox allocated"],
    ["OK", "Virtual filesystem mounted"],
    ["OK", "System directories marked read-only"],
    ["OK", "Writable sandbox mounted at /home/guest/sandbox"],
    ["OK", "Local identity subsystem initialized"],
    ["OK", "Stateful virtual firewall policy loaded"],
    ["OK", "Service dependency graph validated"],
    ["OK", "Task scheduler initialized"],
    ["OK", "Telemetry query engine initialized"],
    ["OK", "Snapshot recovery provider initialized"],
    ["OK", "Repository access interface: NOT PRESENT"],
    ["OK", "Real credentials: NONE"],
    ["OK", "External requests: BLOCKED BY CSP"],
    ["OK", "Arbitrary shell execution: DISABLED"]
  ];
  const modeLines = {
    standard: [
      ["OK", "Synthetic network generation enabled"],
      ["OK", "Scheduled task execution enabled"],
      ["OK", "Security telemetry generation enabled"]
    ],
    safe: [
      ["WARN", "Safe Mode disables synthetic network generation"],
      ["WARN", "Safe Mode pauses scheduled task execution"],
      ["OK", "Minimal administration services enabled"]
    ],
    forensics: [
      ["WARN", "Forensics Mode mounted state read-only"],
      ["WARN", "Network and scheduler mutations disabled"],
      ["OK", "Evidence viewers initialized"]
    ]
  };
  const lines = [
    ...baseLines,
    ...modeLines[mode],
    ["INFO", "Starting Browser OS desktop..."]
  ];
  for (const [status, message] of lines) {
    bootLine(status, message);
    if (!fast) {
      await delay(65);
    }
  }
  if (!fast) {
    await delay(180);
  }
  finishBoot();
}

function finishBoot() {
  state.booted = true;
  state.networkGenerationEnabled = state.bootMode === "standard";
  state.schedulerEnabled = state.bootMode === "standard";
  byId("boot-screen")?.classList.add("hidden");
  byId("desktop")?.classList.remove("hidden");
  applyBootMode();
  initializeTerminal();
  renderAll();
  persistState();
  startRuntimeTimers();
  byId("desktop")?.focus();
  toast("Browser OS 3.0", BOOT_MODE_DESCRIPTIONS[state.bootMode], "info");
}

function applyBootMode() {
  const mode = state.bootMode.toUpperCase();
  const modeNode = byId("system-boot-mode");
  const taskMode = byId("taskbar-mode");
  const startMode = byId("start-mode-label");
  const networkNode = byId("taskbar-network");
  if (modeNode) {
    modeNode.textContent = mode;
  }
  if (taskMode) {
    taskMode.textContent = mode;
  }
  if (startMode) {
    startMode.textContent = state.bootMode[0].toUpperCase() + state.bootMode.slice(1) + " session";
  }
  if (networkNode) {
    if (state.bootMode === "standard") {
      networkNode.textContent = "● SECURE";
      networkNode.style.color = "var(--green)";
    } else {
      networkNode.textContent = "● VIRTUAL NET PAUSED";
      networkNode.style.color = "var(--yellow)";
    }
  }
  const mutableIds = [
    "ops-clear-events",
    "network-new-flow",
    "packet-clear",
    "log-clear-view",
    "file-new",
    "file-save",
    "identity-add",
    "session-switch",
    "session-revoke-all",
    "fw-add-rule",
    "fw-test",
    "task-add",
    "task-history-clear",
    "snapshot-create",
    "snapshot-reset",
    "reset-browser-os"
  ];
  for (const id of mutableIds) {
    const control = byId(id);
    if (!control) {
      continue;
    }
    control.disabled = state.bootMode === "forensics";
    control.title = state.bootMode === "forensics" ? "Disabled in Forensics Mode" : "";
  }
  const capture = byId("capture-toggle");
  if (capture) {
    capture.disabled = state.bootMode !== "standard";
  }
}

function startRuntimeTimers() {
  stopRuntimeTimers();
  clockTimer = window.setInterval(updateClock, 1000);
  performanceTimer = window.setInterval(updatePerformance, 1300);
  simulationTimer = window.setInterval(runtimeTick, 4200);
  schedulerTimer = window.setInterval(schedulerTick, 1000);
  updateClock();
  updatePerformance();
}

function stopRuntimeTimers() {
  if (clockTimer) {
    window.clearInterval(clockTimer);
  }
  if (performanceTimer) {
    window.clearInterval(performanceTimer);
  }
  if (simulationTimer) {
    window.clearInterval(simulationTimer);
  }
  if (schedulerTimer) {
    window.clearInterval(schedulerTimer);
  }
}

function updateClock() {
  const node = byId("taskbar-clock");
  if (!node) {
    return;
  }
  node.textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function updatePerformance() {
  const runningCount = activeServices().length;
  const processLoad = state.processes
    .filter(process => process.status === "RUNNING")
    .reduce((sum, process) => sum + Number(process.cpu || 0), 0);
  const serviceNoise = runningCount * 0.45;
  const incidentNoise = activeIncidents().length * 1.2;
  const targetCpu = clamp(Math.round(7 + processLoad + serviceNoise + incidentNoise + randomInt(-4, 7)), 3, 96);
  state.performance.cpu = Math.round(state.performance.cpu * 0.62 + targetCpu * 0.38);
  const targetMemory = clamp(Math.round(34 + runningCount * 1.3 + state.processes.length * 0.35 + randomInt(-2, 3)), 20, 94);
  state.performance.memory = Math.round(state.performance.memory * 0.78 + targetMemory * 0.22);
  state.performance.disk = clamp(state.performance.disk + randomInt(-1, 1), 31, 72);
  state.performance.networkKbps = state.networkGenerationEnabled ? clamp(state.performance.networkKbps + randomInt(-36, 58), 12, 2048) : 0;
  state.performance.cpuHistory.push(state.performance.cpu);
  state.performance.cpuHistory = state.performance.cpuHistory.slice(-60);
  state.performance.memoryHistory.push(state.performance.memory);
  state.performance.memoryHistory = state.performance.memoryHistory.slice(-60);
  renderOperations();
}

function runtimeTick() {
  if (!state.booted) {
    return;
  }
  if (state.networkGenerationEnabled && state.captureEnabled) {
    maybeGenerateBackgroundPacket();
  }
  jitterProcesses();
  if (Math.random() < 0.22) {
    const events = [
      ["system", "info", "Service heartbeat sweep completed"],
      ["security", "info", "Detection engine correlation window evaluated"],
      ["firewall", "info", "State table aging sweep completed"],
      ["system", "info", "Virtual filesystem integrity metadata checked"]
    ];
    const event = randomChoice(events);
    addLog(event[0], event[1], event[2]);
  }
  renderAllVisible();
  persistState();
}

function jitterProcesses() {
  for (const process of state.processes) {
    if (process.status !== "RUNNING") {
      process.cpu = 0;
      continue;
    }
    const change = (Math.random() - 0.5) * 0.6;
    process.cpu = Number(clamp(process.cpu + change, 0.1, process.protected ? 4.5 : 8.5).toFixed(1));
  }
}

function bringToFront(windowElement) {
  state.zIndex += 1;
  windowElement.style.zIndex = String(state.zIndex);
}

function openWindow(id) {
  const element = byId(id);
  if (!element) {
    return;
  }
  element.classList.add("visible");
  bringToFront(element);
  createTaskbarButton(element);
  setStartMenu(false);
  renderApp(id);
  if (id === "terminal-window") {
    window.setTimeout(() => byId("terminal-input")?.focus(), 0);
  }
}

function closeWindow(windowElement) {
  if (!windowElement) {
    return;
  }
  windowElement.classList.remove("visible");
  removeTaskbarButton(windowElement.id);
}

function minimizeWindow(windowElement) {
  if (!windowElement) {
    return;
  }
  windowElement.classList.remove("visible");
}

function toggleMaximize(windowElement) {
  if (!windowElement) {
    return;
  }
  windowElement.classList.toggle("maximized");
}

function createTaskbarButton(windowElement) {
  const taskbar = byId("taskbar-apps");
  if (!taskbar) {
    return;
  }
  if (qs('[data-task-window="' + windowElement.id + '"]')) {
    return;
  }
  const button = document.createElement("button");
  button.type = "button";
  button.className = "taskbar-app";
  button.dataset.taskWindow = windowElement.id;
  button.textContent = windowElement.dataset.appName || windowElement.id;
  button.addEventListener("click", () => {
    if (!windowElement.classList.contains("visible")) {
      windowElement.classList.add("visible");
      bringToFront(windowElement);
      renderApp(windowElement.id);
      return;
    }
    if (Number(windowElement.style.zIndex) === state.zIndex) {
      minimizeWindow(windowElement);
      return;
    }
    bringToFront(windowElement);
  });
  taskbar.appendChild(button);
}

function removeTaskbarButton(id) {
  qs('[data-task-window="' + id + '"]')?.remove();
}

function initializeWindowManager() {
  qsa("[data-open-app]").forEach(button => {
    button.addEventListener("click", () => {
      openWindow(button.dataset.openApp);
    });
  });
  qsa("[data-close-window]").forEach(button => {
    button.addEventListener("click", event => {
      closeWindow(event.target.closest(".os-window"));
    });
  });
  qsa("[data-minimize-window]").forEach(button => {
    button.addEventListener("click", event => {
      minimizeWindow(event.target.closest(".os-window"));
    });
  });
  qsa("[data-maximize-window]").forEach(button => {
    button.addEventListener("click", event => {
      toggleMaximize(event.target.closest(".os-window"));
    });
  });
  qsa(".os-window").forEach(windowElement => {
    windowElement.addEventListener("mousedown", () => {
      bringToFront(windowElement);
    });
  });
  qsa(".drag-handle").forEach(handle => {
    handle.addEventListener("pointerdown", startDrag);
  });
}

function startDrag(event) {
  if (event.target.closest(".window-controls")) {
    return;
  }
  if (window.matchMedia("(max-width: 900px)").matches) {
    return;
  }
  const windowElement = event.currentTarget.closest(".os-window");
  if (!windowElement || windowElement.classList.contains("maximized")) {
    return;
  }
  bringToFront(windowElement);
  const rect = windowElement.getBoundingClientRect();
  dragState = {
    element: windowElement,
    startX: event.clientX,
    startY: event.clientY,
    left: rect.left,
    top: rect.top
  };
  document.addEventListener("pointermove", continueDrag);
  document.addEventListener("pointerup", endDrag, { once: true });
}

function continueDrag(event) {
  if (!dragState) {
    return;
  }
  const element = dragState.element;
  const left = clamp(dragState.left + event.clientX - dragState.startX, -element.offsetWidth + 140, window.innerWidth - 120);
  const top = clamp(dragState.top + event.clientY - dragState.startY, 0, window.innerHeight - 90);
  element.style.left = left + "px";
  element.style.top = top + "px";
}

function endDrag() {
  document.removeEventListener("pointermove", continueDrag);
  dragState = null;
}

function setStartMenu(open) {
  byId("start-menu")?.classList.toggle("visible", Boolean(open));
}

function buildStartMenu() {
  const root = byId("start-apps");
  if (!root) {
    return;
  }
  root.replaceChildren();
  for (const app of APP_DEFINITIONS) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.openApp = app.id;
    const icon = document.createElement("span");
    icon.textContent = app.icon;
    const text = document.createTextNode(app.name);
    button.append(icon, text);
    button.addEventListener("click", () => {
      openWindow(app.id);
    });
    root.appendChild(button);
  }
}

function initializeStartMenu() {
  const startButton = byId("start-button");
  const startMenu = byId("start-menu");
  startButton?.addEventListener("click", event => {
    event.stopPropagation();
    setStartMenu(!startMenu?.classList.contains("visible"));
  });
  document.addEventListener("click", event => {
    if (!startMenu?.contains(event.target) && !startButton?.contains(event.target)) {
      setStartMenu(false);
    }
  });
  byId("restart-browser-os")?.addEventListener("click", () => {
    location.reload();
  });
  byId("reset-browser-os")?.addEventListener("click", () => {
    resetSimulation();
  });
}

function renderApp(id) {
  switch (id) {
    case "ops-window":
      renderOperations();
      break;
    case "soc-window":
      renderIncidents();
      break;
    case "process-window":
      renderProcesses();
      break;
    case "network-window":
      renderNetwork();
      break;
    case "packet-window":
      renderPackets();
      break;
    case "logs-window":
      renderLogs();
      break;
    case "files-window":
      renderFiles();
      break;
    case "services-window":
      renderServices();
      break;
    case "identity-window":
      renderIdentity();
      break;
    case "firewall-window":
      renderFirewall();
      break;
    case "scheduler-window":
      renderScheduler();
      break;
    case "query-window":
      renderQueryHistory();
      break;
    case "snapshot-window":
      renderSnapshots();
      break;
    case "system-window":
      renderSystem();
      break;
    default:
      break;
  }
}

function renderAllVisible() {
  qsa(".os-window.visible").forEach(windowElement => {
    renderApp(windowElement.id);
  });
}

function renderAll() {
  renderOperations();
  renderIncidents();
  renderProcesses();
  renderNetwork();
  renderPackets();
  renderLogs();
  renderFiles();
  renderServices();
  renderIdentity();
  renderFirewall();
  renderScheduler();
  renderQueryHistory();
  renderSnapshots();
  renderSystem();
}

function renderOperations() {
  const cpu = byId("metric-cpu");
  const memory = byId("metric-memory");
  const disk = byId("metric-disk");
  const services = byId("metric-services");
  const sessions = byId("metric-sessions");
  const incidents = byId("metric-incidents");
  if (cpu) {
    cpu.textContent = state.performance.cpu + "%";
  }
  if (memory) {
    memory.textContent = state.performance.memory + "%";
  }
  if (disk) {
    disk.textContent = state.performance.disk + "%";
  }
  if (services) {
    services.textContent = activeServices().length + "/" + state.services.length;
  }
  if (sessions) {
    sessions.textContent = String(activeSessions().length);
  }
  if (incidents) {
    incidents.textContent = String(activeIncidents().length);
  }
  const cpuMeter = byId("meter-cpu");
  const memoryMeter = byId("meter-memory");
  const diskMeter = byId("meter-disk");
  if (cpuMeter) {
    cpuMeter.style.width = state.performance.cpu + "%";
  }
  if (memoryMeter) {
    memoryMeter.style.width = state.performance.memory + "%";
  }
  if (diskMeter) {
    diskMeter.style.width = state.performance.disk + "%";
  }
  const score = systemHealthScore();
  const pill = byId("ops-health-pill");
  if (pill) {
    pill.textContent = score >= 85 ? "HEALTHY " + score : score >= 65 ? "DEGRADED " + score : "AT RISK " + score;
    pill.className = "status-pill " + (score >= 85 ? "good" : score >= 65 ? "warn" : "bad");
  }
  const briefHealth = byId("brief-health");
  const briefSummary = byId("brief-summary");
  if (briefHealth) {
    briefHealth.textContent = "System health: " + score + "/100";
  }
  if (briefSummary) {
    briefSummary.textContent = activeServices().length + "/" + state.services.length + " services running · " + activeIncidents().length + " open incidents · " + formatBytesLike(state.performance.networkKbps) + " synthetic traffic";
  }
  renderPerformanceChart();
  renderOpsEvents();
  renderDependencyMap();
}

function renderPerformanceChart() {
  const root = byId("performance-chart");
  if (!root) {
    return;
  }
  const fragment = document.createDocumentFragment();
  for (const sample of state.performance.cpuHistory) {
    const bar = document.createElement("span");
    bar.style.height = clamp(sample, 3, 100) + "%";
    bar.title = "CPU " + sample + "%";
    fragment.appendChild(bar);
  }
  root.replaceChildren(fragment);
}

function renderOpsEvents() {
  const root = byId("ops-event-list");
  if (!root) {
    return;
  }
  const fragment = document.createDocumentFragment();
  const events = state.opsEvents.slice(0, 18);
  if (!events.length) {
    const empty = document.createElement("div");
    empty.className = "muted";
    empty.textContent = "No operations recorded.";
    fragment.appendChild(empty);
  }
  for (const event of events) {
    const row = document.createElement("div");
    row.className = "event-item";
    const time = document.createElement("time");
    time.textContent = timeOnly(event.time);
    const body = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = event.title;
    const detail = document.createElement("span");
    detail.textContent = event.detail;
    body.append(title, detail);
    row.append(time, body);
    fragment.appendChild(row);
  }
  root.replaceChildren(fragment);
}

function renderDependencyMap() {
  const root = byId("dependency-map");
  if (!root) {
    return;
  }
  const fragment = document.createDocumentFragment();
  for (const service of state.services) {
    const node = document.createElement("div");
    const dependenciesHealthy = service.deps.every(dep => serviceByName(dep)?.state === "running");
    node.className = "dependency-node " + (service.state === "running" && dependenciesHealthy ? "ok" : "bad");
    const title = document.createElement("strong");
    title.textContent = service.name.replace(".service", "");
    const stateText = document.createElement("small");
    stateText.textContent = service.state.toUpperCase() + " · deps: " + (service.deps.length ? service.deps.map(dep => dep.replace(".service", "")).join(", ") : "none");
    node.append(title, stateText);
    fragment.appendChild(node);
  }
  root.replaceChildren(fragment);
}

function incidentSeverityRank(severity) {
  const ranks = {
    CRITICAL: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1
  };
  return ranks[severity] || 0;
}

function renderIncidents() {
  const body = byId("incident-table-body");
  if (!body) {
    return;
  }
  const sorted = [...state.incidents].sort((a, b) => {
    const rank = incidentSeverityRank(b.severity) - incidentSeverityRank(a.severity);
    if (rank !== 0) {
      return rank;
    }
    return a.id.localeCompare(b.id);
  });
  const fragment = document.createDocumentFragment();
  for (const incident of sorted) {
    const row = document.createElement("tr");
    const values = [
      incident.id,
      incident.severity,
      incident.endpoint,
      incident.status,
      incident.title,
      incident.owner
    ];
    for (const value of values) {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    }
    const action = document.createElement("td");
    const inspect = document.createElement("button");
    inspect.type = "button";
    inspect.textContent = "Inspect";
    inspect.addEventListener("click", () => {
      showIncidentDetail(incident.id);
    });
    const contain = document.createElement("button");
    contain.type = "button";
    contain.textContent = incident.status === "CONTAINED" ? "Contained" : "Contain";
    contain.disabled = incident.status === "CONTAINED" || incident.status === "CLOSED" || isReadOnly();
    contain.addEventListener("click", () => {
      containIncident(incident.id);
    });
    action.append(inspect, contain);
    row.appendChild(action);
    fragment.appendChild(row);
  }
  body.replaceChildren(fragment);
  const active = activeIncidents();
  const critical = state.incidents.filter(incident => incident.severity === "CRITICAL" && incident.status !== "CLOSED").length;
  const contained = state.incidents.filter(incident => incident.status === "CONTAINED").length;
  if (byId("soc-active")) {
    byId("soc-active").textContent = String(active.length);
  }
  if (byId("soc-critical")) {
    byId("soc-critical").textContent = String(critical);
  }
  if (byId("soc-contained")) {
    byId("soc-contained").textContent = String(contained);
  }
  if (byId("soc-events")) {
    byId("soc-events").textContent = String(state.logs.length);
  }
}

function showIncidentDetail(id) {
  const incident = state.incidents.find(item => item.id === id);
  const detail = byId("incident-detail");
  if (!incident || !detail) {
    return;
  }
  detail.textContent = [
    "INCIDENT " + incident.id,
    "Severity: " + incident.severity,
    "Status: " + incident.status,
    "Endpoint: " + incident.endpoint,
    "User: " + incident.user,
    "Owner: " + incident.owner,
    "",
    "Detection: " + incident.title,
    "Process lineage: " + incident.processTree,
    "Command: " + incident.command,
    "Network: " + incident.network,
    "MITRE ATT&CK: " + incident.mitre.join(", "),
    "",
    "Analyst notes: " + incident.notes
  ].join("\n");
}

function containIncident(id) {
  if (!requireMutable("incident containment")) {
    return;
  }
  const incident = state.incidents.find(item => item.id === id);
  if (!incident) {
    return;
  }
  incident.status = "CONTAINED";
  const affected = state.connections.filter(connection => connection.local.startsWith(endpointAddress(incident.endpoint)));
  for (const connection of affected) {
    connection.state = "BLOCKED";
    connection.policy = "CONTAIN";
  }
  addLog("security", "high", incident.endpoint + " contained for " + incident.id, false);
  addOpsEvent("Endpoint contained", incident.endpoint + " isolated for incident " + incident.id + ".");
  persistState();
  renderIncidents();
  renderNetwork();
  renderOperations();
  toast("Containment complete", incident.endpoint + " isolated inside the simulation.", "warn");
}

function endpointAddress(endpoint) {
  const map = {
    "WS-042": "192.0.2.23",
    "WS-031": "192.0.2.31",
    "WS-017": "192.0.2.17",
    "DC-01": "192.0.2.5"
  };
  return map[endpoint] || "192.0.2.10";
}

function renderProcesses() {
  const body = byId("process-table-body");
  if (!body) {
    return;
  }
  const search = (byId("process-search")?.value || "").trim().toLowerCase();
  const statusFilter = byId("process-status-filter")?.value || "all";
  const rows = state.processes.filter(process => {
    const searchMatch = !search || [process.pid, process.ppid, process.user, process.name, process.cmd].join(" ").toLowerCase().includes(search);
    const statusMatch = statusFilter === "all" || process.status === statusFilter;
    return searchMatch && statusMatch;
  });
  const fragment = document.createDocumentFragment();
  for (const process of rows) {
    const row = document.createElement("tr");
    const values = [
      process.pid,
      process.ppid,
      process.user,
      process.name,
      process.cpu.toFixed(1) + "%",
      process.mem + " MB",
      process.status
    ];
    for (const value of values) {
      const cell = document.createElement("td");
      cell.textContent = String(value);
      row.appendChild(cell);
    }
    const action = document.createElement("td");
    const inspect = document.createElement("button");
    inspect.type = "button";
    inspect.textContent = "Inspect";
    inspect.addEventListener("click", () => {
      showProcessDetail(process.pid);
    });
    const kill = document.createElement("button");
    kill.type = "button";
    kill.textContent = "Terminate";
    kill.disabled = process.protected || process.status === "TERMINATED" || isReadOnly();
    kill.addEventListener("click", () => {
      terminateProcess(process.pid);
    });
    action.append(inspect, kill);
    row.appendChild(action);
    fragment.appendChild(row);
  }
  body.replaceChildren(fragment);
}

function processChildren(pid) {
  return state.processes.filter(process => process.ppid === Number(pid));
}

function showProcessDetail(pid) {
  const process = processByPid(pid);
  const detail = byId("process-detail");
  if (!process || !detail) {
    return;
  }
  const parent = processByPid(process.ppid);
  const children = processChildren(process.pid);
  const connections = state.connections.filter(connection => connection.pid === process.pid);
  detail.textContent = [
    "PROCESS " + process.name,
    "PID: " + process.pid,
    "PPID: " + process.ppid + (parent ? " (" + parent.name + ")" : ""),
    "User: " + process.user,
    "Status: " + process.status,
    "Protected: " + (process.protected ? "yes" : "no"),
    "CPU: " + process.cpu.toFixed(1) + "%",
    "Memory: " + process.mem + " MB",
    "Command: " + process.cmd,
    "",
    "Children: " + (children.length ? children.map(child => child.pid + "/" + child.name).join(", ") : "none"),
    "Connections: " + (connections.length ? connections.map(connection => connection.remote + " " + connection.state).join(", ") : "none")
  ].join("\n");
}

function terminateProcess(pid) {
  if (!requireMutable("process termination")) {
    return;
  }
  const process = processByPid(pid);
  if (!process || process.protected || process.status === "TERMINATED") {
    return;
  }
  process.status = "TERMINATED";
  process.cpu = 0;
  for (const connection of state.connections) {
    if (connection.pid === process.pid) {
      connection.state = "CLOSED";
    }
  }
  addLog("system", "warn", "Process terminated pid=" + process.pid + " name=" + process.name, false);
  addOpsEvent("Process terminated", process.name + " PID " + process.pid + " terminated by operator.");
  persistState();
  renderProcesses();
  renderNetwork();
  toast("Process terminated", process.name + " PID " + process.pid, "warn");
}

function renderNetwork() {
  const body = byId("network-table-body");
  if (!body) {
    return;
  }
  const search = (byId("network-search")?.value || "").trim().toLowerCase();
  const rows = state.connections.filter(connection => {
    return !search || Object.values(connection).join(" ").toLowerCase().includes(search);
  });
  const fragment = document.createDocumentFragment();
  for (const connection of rows) {
    const row = document.createElement("tr");
    const values = [
      connection.pid,
      connection.process,
      connection.local,
      connection.remote,
      connection.protocol,
      connection.state,
      connection.policy
    ];
    for (const value of values) {
      const cell = document.createElement("td");
      cell.textContent = String(value);
      row.appendChild(cell);
    }
    const action = document.createElement("td");
    const close = document.createElement("button");
    close.type = "button";
    close.textContent = "Close";
    close.disabled = connection.state !== "ESTABLISHED" || isReadOnly();
    close.addEventListener("click", () => {
      closeConnection(connection.id);
    });
    action.appendChild(close);
    row.appendChild(action);
    fragment.appendChild(row);
  }
  body.replaceChildren(fragment);
  const active = state.connections.filter(connection => connection.state === "ESTABLISHED").length;
  if (byId("network-active-count")) {
    byId("network-active-count").textContent = String(active);
  }
}

function closeConnection(id) {
  if (!requireMutable("connection termination")) {
    return;
  }
  const connection = state.connections.find(item => item.id === id);
  if (!connection) {
    return;
  }
  connection.state = "CLOSED";
  addLog("firewall", "info", "Operator closed connection " + id + " remote=" + connection.remote, false);
  addOpsEvent("Connection closed", id + " to " + connection.remote + " closed.");
  persistState();
  renderNetwork();
}

function generateSyntheticFlow() {
  if (!requireMutable("synthetic network flow")) {
    return;
  }
  if (state.bootMode !== "standard") {
    toast("Network paused", "Synthetic flows require Standard Mode.", "warn");
    return;
  }
  const candidates = [
    { process: "bos-browser", pid: 730, source: "192.0.2.10", destination: "198.51.100.20", port: 443, protocol: "TCP/TLS" },
    { process: "telemetry-agent", pid: 317, source: "192.0.2.10", destination: "198.51.100.40", port: 443, protocol: "TCP/TLS" },
    { process: "updater.exe", pid: 842, source: "192.0.2.31", destination: "203.0.113.74", port: 443, protocol: "TCP/TLS" },
    { process: "browser-shell", pid: 622, source: "192.0.2.10", destination: "192.0.2.53", port: 53, protocol: "UDP/DNS" }
  ];
  const selected = randomChoice(candidates);
  const verdict = evaluateFirewallPacket(selected.source, selected.destination, selected.protocol.startsWith("UDP") ? "UDP" : "TCP", selected.port);
  const id = "C-" + String(state.nextConnection).padStart(3, "0");
  state.nextConnection += 1;
  const connection = {
    id,
    pid: selected.pid,
    process: selected.process,
    local: selected.source + ":" + randomInt(49152, 62000),
    remote: selected.destination + ":" + selected.port,
    protocol: selected.protocol,
    state: verdict.action === "allow" ? "ESTABLISHED" : "BLOCKED",
    policy: verdict.action.toUpperCase()
  };
  state.connections.unshift(connection);
  if (verdict.action === "allow") {
    state.firewallStats.allowed += 1;
    state.firewallStats.trackedSessions += 1;
  } else {
    state.firewallStats.blocked += 1;
  }
  addLog("firewall", verdict.action === "allow" ? "info" : "warn", verdict.action.toUpperCase() + " synthetic flow " + connection.local + " -> " + connection.remote + " rule=" + verdict.rule.id, false);
  addOpsEvent("Synthetic flow evaluated", connection.id + " verdict " + connection.policy + ".");
  persistState();
  renderNetwork();
  renderFirewall();
  toast("Synthetic flow", connection.id + " " + connection.policy + " by rule " + verdict.rule.id, verdict.action === "allow" ? "info" : "warn");
}

function maybeGenerateBackgroundPacket() {
  const flows = state.connections.filter(connection => connection.state === "ESTABLISHED");
  if (!flows.length) {
    return;
  }
  const flow = randomChoice(flows);
  const parts = flow.remote.split(":");
  const packet = {
    no: state.nextPacket,
    time: ((Date.now() - state.bootTime) / 1000).toFixed(4),
    src: flow.local.split(":")[0],
    dst: parts[0],
    proto: flow.protocol.includes("TLS") ? "TLS" : flow.protocol.includes("DNS") ? "DNS" : "TCP",
    info: flow.protocol.includes("TLS") ? "Application Data" : "Synthetic session traffic",
    detail: "Synthetic frame\nConnection " + flow.id + "\nProcess " + flow.process + " PID " + flow.pid + "\nPolicy " + flow.policy
  };
  state.nextPacket += 1;
  state.packets.push(packet);
  state.packets = state.packets.slice(-300);
  renderPackets();
}

function renderPackets() {
  const body = byId("packet-table-body");
  if (!body) {
    return;
  }
  const filter = (byId("packet-filter")?.value || "").trim().toLowerCase();
  const rows = state.packets.filter(packet => {
    return !filter || Object.values(packet).join(" ").toLowerCase().includes(filter);
  });
  const fragment = document.createDocumentFragment();
  for (const packet of rows) {
    const row = document.createElement("tr");
    const values = [packet.no, packet.time, packet.src, packet.dst, packet.proto, packet.info];
    for (const value of values) {
      const cell = document.createElement("td");
      cell.textContent = String(value);
      row.appendChild(cell);
    }
    row.addEventListener("click", () => {
      const detail = byId("packet-detail");
      if (detail) {
        detail.textContent = "Frame " + packet.no + "\nTime: " + packet.time + "\nSource: " + packet.src + "\nDestination: " + packet.dst + "\nProtocol: " + packet.proto + "\nInfo: " + packet.info + "\n\n" + packet.detail;
      }
    });
    fragment.appendChild(row);
  }
  body.replaceChildren(fragment);
  const toggle = byId("capture-toggle");
  if (toggle) {
    toggle.textContent = state.captureEnabled ? "Stop Capture" : "Start Capture";
  }
}

function renderLogs() {
  const root = byId("log-list");
  if (!root) {
    return;
  }
  const source = (byId("log-source-filter")?.value || "all").toLowerCase();
  const search = (byId("log-search")?.value || "").trim().toLowerCase();
  const rows = state.logs.filter(log => {
    const sourceMatch = source === "all" || log.source.toLowerCase() === source;
    const searchMatch = !search || Object.values(log).join(" ").toLowerCase().includes(search);
    return sourceMatch && searchMatch;
  });
  const fragment = document.createDocumentFragment();
  for (const log of rows.slice(0, 300)) {
    const row = document.createElement("div");
    row.className = "log-entry";
    const time = document.createElement("span");
    time.textContent = shortDate(log.time);
    const src = document.createElement("span");
    src.textContent = log.source;
    const level = document.createElement("span");
    level.className = "level-" + log.level;
    level.textContent = log.level.toUpperCase();
    const message = document.createElement("span");
    message.textContent = log.message;
    row.append(time, src, level, message);
    fragment.appendChild(row);
  }
  if (!rows.length) {
    const empty = document.createElement("div");
    empty.className = "muted";
    empty.textContent = "No logs match the current filter.";
    fragment.appendChild(empty);
  }
  root.replaceChildren(fragment);
}

function normalizeVirtualPath(input) {
  if (!input) {
    return state.currentDirectory;
  }
  if (input.startsWith("/")) {
    return input.replace(/\/$/, "") || "/";
  }
  const base = state.currentDirectory.replace(/\/$/, "");
  const combined = base + "/" + input;
  const parts = [];
  for (const part of combined.split("/")) {
    if (!part || part === ".") {
      continue;
    }
    if (part === "..") {
      parts.pop();
      continue;
    }
    parts.push(part);
  }
  return "/" + parts.join("/");
}

function generatedFileContent(node) {
  if (!node?.generated) {
    return node?.content || "";
  }
  if (node.generated === "security") {
    return state.logs.filter(log => log.source === "security").map(log => log.time + " " + log.level.toUpperCase() + " " + log.message).join("\n");
  }
  if (node.generated === "system") {
    return state.logs.filter(log => log.source === "system").map(log => log.time + " " + log.level.toUpperCase() + " " + log.message).join("\n");
  }
  if (node.generated === "firewall") {
    return state.logs.filter(log => log.source === "firewall").map(log => log.time + " " + log.level.toUpperCase() + " " + log.message).join("\n");
  }
  if (node.generated === "firewall-config") {
    return state.firewallRules.map(rule => rule.id + " " + rule.action.toUpperCase() + " " + rule.protocol + " " + rule.source + " -> " + rule.destination + " port " + rule.port + " " + (rule.enabled ? "enabled" : "disabled")).join("\n");
  }
  if (node.generated === "services-config") {
    return state.services.map(service => service.name + " state=" + service.state + " startup=" + service.startup + " deps=" + service.deps.join(",")).join("\n");
  }
  return "";
}

function renderFiles() {
  const sidebar = byId("file-sidebar");
  const list = byId("file-list");
  const display = byId("file-path-display");
  if (!sidebar || !list || !display) {
    return;
  }
  const roots = ["/home/guest", "/home/guest/sandbox", "/var/log", "/etc"];
  const sidebarFragment = document.createDocumentFragment();
  for (const path of roots) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = path;
    button.className = state.currentDirectory === path ? "active" : "";
    button.addEventListener("click", () => {
      state.currentDirectory = path;
      state.currentFilePath = null;
      renderFiles();
    });
    sidebarFragment.appendChild(button);
  }
  sidebar.replaceChildren(sidebarFragment);
  display.textContent = state.currentDirectory;
  const directory = state.filesystem[state.currentDirectory];
  const fragment = document.createDocumentFragment();
  if (!directory || directory.type !== "dir") {
    const empty = document.createElement("div");
    empty.className = "muted";
    empty.textContent = "Directory unavailable.";
    fragment.appendChild(empty);
  } else {
    for (const child of directory.children) {
      const path = normalizeVirtualPath(child);
      const node = state.filesystem[path];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "file-item";
      const title = document.createElement("strong");
      title.textContent = (node?.type === "dir" ? "▣ " : "□ ") + child;
      const detail = document.createElement("small");
      detail.textContent = node?.type === "dir" ? "Directory" : node?.writable ? "Writable sandbox file" : "Read-only virtual file";
      button.append(title, detail);
      button.addEventListener("click", () => {
        if (node?.type === "dir") {
          state.currentDirectory = path;
          state.currentFilePath = null;
          renderFiles();
          return;
        }
        state.currentFilePath = path;
        const editor = byId("file-editor");
        if (editor) {
          editor.value = generatedFileContent(node);
          editor.readOnly = !node?.writable || isReadOnly();
        }
        const status = byId("file-editor-status");
        if (status) {
          status.textContent = path + (node?.writable ? " · sandbox writable" : " · read only");
        }
      });
      fragment.appendChild(button);
    }
  }
  list.replaceChildren(fragment);
  const current = state.currentFilePath ? state.filesystem[state.currentFilePath] : null;
  const editor = byId("file-editor");
  if (editor && current) {
    editor.value = generatedFileContent(current);
    editor.readOnly = !current.writable || isReadOnly();
  }
}

function createSandboxFile() {
  if (!requireMutable("file creation")) {
    return;
  }
  if (state.currentDirectory !== "/home/guest/sandbox") {
    state.currentDirectory = "/home/guest/sandbox";
  }
  const directory = state.filesystem["/home/guest/sandbox"];
  let index = 1;
  let name = "new-file-" + index + ".txt";
  while (directory.children.includes(name)) {
    index += 1;
    name = "new-file-" + index + ".txt";
  }
  const path = "/home/guest/sandbox/" + name;
  directory.children.push(name);
  state.filesystem[path] = {
    type: "file",
    writable: true,
    content: ""
  };
  state.currentFilePath = path;
  addLog("system", "info", "Sandbox file created " + path, false);
  addOpsEvent("Sandbox file created", path);
  persistState();
  renderFiles();
  const editor = byId("file-editor");
  if (editor) {
    editor.focus();
  }
}

function saveCurrentFile() {
  if (!requireMutable("file save")) {
    return;
  }
  const path = state.currentFilePath;
  const node = path ? state.filesystem[path] : null;
  if (!node || !node.writable) {
    toast("Save blocked", "Select a writable sandbox file.", "warn");
    return;
  }
  const editor = byId("file-editor");
  node.content = editor?.value || "";
  addLog("system", "info", "Sandbox file saved " + path, false);
  addOpsEvent("Sandbox file saved", path + " · " + node.content.length + " characters.");
  persistState();
  const status = byId("file-editor-status");
  if (status) {
    status.textContent = path + " · saved " + new Date().toLocaleTimeString();
  }
  toast("File saved", path, "info");
}

function renderServices() {
  const body = byId("service-table-body");
  if (!body) {
    return;
  }
  const fragment = document.createDocumentFragment();
  for (const service of state.services) {
    const row = document.createElement("tr");
    const values = [
      service.name,
      service.state.toUpperCase(),
      service.startup,
      service.pid || "-",
      service.deps.length ? service.deps.join(", ") : "none",
      service.restarts
    ];
    for (const value of values) {
      const cell = document.createElement("td");
      cell.textContent = String(value);
      row.appendChild(cell);
    }
    const action = document.createElement("td");
    const inspect = document.createElement("button");
    inspect.type = "button";
    inspect.textContent = "Inspect";
    inspect.addEventListener("click", () => {
      showServiceDetail(service.name);
    });
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.textContent = service.state === "running" ? "Stop" : "Start";
    toggle.disabled = isReadOnly() || (service.protected && service.state === "running");
    toggle.addEventListener("click", () => {
      setServiceState(service.name, service.state === "running" ? "stopped" : "running");
    });
    const restart = document.createElement("button");
    restart.type = "button";
    restart.textContent = "Restart";
    restart.disabled = isReadOnly() || service.state !== "running";
    restart.addEventListener("click", () => {
      restartService(service.name);
    });
    action.append(inspect, toggle, restart);
    row.appendChild(action);
    fragment.appendChild(row);
  }
  body.replaceChildren(fragment);
}

function serviceDependents(name) {
  return state.services.filter(service => service.deps.includes(name));
}

function showServiceDetail(name) {
  const service = serviceByName(name);
  const detail = byId("service-detail");
  if (!service || !detail) {
    return;
  }
  const dependents = serviceDependents(name);
  const recent = state.logs.filter(log => log.message.includes(name)).slice(0, 8);
  detail.textContent = [
    "UNIT " + service.name,
    "Description: " + service.description,
    "State: " + service.state,
    "Startup: " + service.startup,
    "PID: " + (service.pid || "none"),
    "Protected: " + (service.protected ? "yes" : "no"),
    "Restarts: " + service.restarts,
    "Dependencies: " + (service.deps.length ? service.deps.join(", ") : "none"),
    "Dependents: " + (dependents.length ? dependents.map(item => item.name).join(", ") : "none"),
    "",
    "Recent events:",
    ...(recent.length ? recent.map(log => log.time + " " + log.level.toUpperCase() + " " + log.message) : ["No service-specific events recorded."])
  ].join("\n");
}

function setServiceState(name, desiredState) {
  if (!requireMutable("service state change")) {
    return false;
  }
  const service = serviceByName(name);
  if (!service) {
    return false;
  }
  if (desiredState === "running") {
    const missing = service.deps.filter(dep => serviceByName(dep)?.state !== "running");
    if (missing.length) {
      toast("Dependency failure", service.name + " requires " + missing.join(", "), "error");
      addLog("system", "warn", "Failed to start " + service.name + " missing dependencies=" + missing.join(","), false);
      return false;
    }
    service.state = "running";
    if (!service.pid) {
      service.pid = randomInt(700, 1800);
    }
    syncServiceProcess(service, true);
    addLog("system", "info", "Started " + service.name, false);
    addOpsEvent("Service started", service.name);
    toast("Service started", service.name, "info");
  } else {
    if (service.protected) {
      toast("Protected service", service.name + " cannot be stopped from the UI.", "warn");
      return false;
    }
    const runningDependents = serviceDependents(name).filter(item => item.state === "running");
    if (runningDependents.length) {
      toast("Dependent services active", "Stop dependents first: " + runningDependents.map(item => item.name).join(", "), "warn");
      return false;
    }
    service.state = "stopped";
    syncServiceProcess(service, false);
    addLog("system", "warn", "Stopped " + service.name, false);
    addOpsEvent("Service stopped", service.name);
    toast("Service stopped", service.name, "warn");
  }
  persistState();
  renderServices();
  renderProcesses();
  renderOperations();
  return true;
}

function syncServiceProcess(service, running) {
  const baseName = service.name.replace(".service", "");
  let process = state.processes.find(item => item.name === baseName || item.pid === service.pid);
  if (running) {
    if (!process) {
      process = {
        pid: service.pid,
        ppid: 1,
        user: "root",
        name: baseName,
        cpu: 0.1,
        mem: 6,
        status: "RUNNING",
        protected: service.protected,
        cmd: baseName + " --virtual-service"
      };
      state.processes.push(process);
    }
    process.status = "RUNNING";
    process.cpu = Math.max(process.cpu, 0.1);
  } else if (process) {
    process.status = "STOPPED";
    process.cpu = 0;
  }
}

function restartService(name) {
  if (!requireMutable("service restart")) {
    return;
  }
  const service = serviceByName(name);
  if (!service || service.state !== "running") {
    return;
  }
  service.restarts += 1;
  service.pid = randomInt(700, 2200);
  syncServiceProcess(service, true);
  addLog("system", "info", "Restarted " + service.name + " pid=" + service.pid, false);
  addOpsEvent("Service restarted", service.name + " now PID " + service.pid + ".");
  persistState();
  renderServices();
  renderProcesses();
  toast("Service restarted", service.name, "info");
}

function renderIdentity() {
  const banner = byId("session-banner");
  const body = byId("identity-table-body");
  const userSelect = byId("session-user");
  const history = byId("session-history");
  if (banner) {
    const user = userByName(state.activeUser);
    banner.innerHTML = "";
    const left = document.createElement("div");
    const strong = document.createElement("strong");
    strong.textContent = "Active session: " + state.activeUser;
    const small = document.createElement("small");
    small.textContent = (user?.role || "Unknown role") + " · " + (state.sessionLocked ? "LOCKED" : "unlocked") + " · local simulation only";
    left.append(strong, small);
    const right = document.createElement("span");
    right.className = "status-pill " + (state.sessionLocked ? "warn" : "good");
    right.textContent = state.sessionLocked ? "LOCKED" : "ACTIVE";
    banner.append(left, right);
  }
  if (body) {
    const fragment = document.createDocumentFragment();
    for (const user of state.users) {
      const row = document.createElement("tr");
      const values = [
        user.username,
        user.role,
        user.mfa ? "Required" : "Not required",
        user.locked ? "Yes" : "No",
        shortDate(user.lastSignIn)
      ];
      for (const value of values) {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      }
      const action = document.createElement("td");
      const lock = document.createElement("button");
      lock.type = "button";
      lock.textContent = user.locked ? "Unlock user" : "Lock user";
      lock.disabled = isReadOnly() || user.username === state.activeUser;
      lock.addEventListener("click", () => {
        toggleUserLock(user.username);
      });
      const inspect = document.createElement("button");
      inspect.type = "button";
      inspect.textContent = "Groups";
      inspect.addEventListener("click", () => {
        toast(user.username + " groups", user.groups.join(", "), "info");
      });
      action.append(lock, inspect);
      row.appendChild(action);
      fragment.appendChild(row);
    }
    body.replaceChildren(fragment);
  }
  if (userSelect) {
    const current = userSelect.value || state.activeUser;
    const fragment = document.createDocumentFragment();
    for (const user of state.users.filter(item => !item.locked)) {
      const option = document.createElement("option");
      option.value = user.username;
      option.textContent = user.username + " — " + user.role;
      fragment.appendChild(option);
    }
    userSelect.replaceChildren(fragment);
    if (state.users.some(user => user.username === current && !user.locked)) {
      userSelect.value = current;
    } else {
      userSelect.value = state.activeUser;
    }
  }
  if (history) {
    const fragment = document.createDocumentFragment();
    const sessions = [...state.sessions].reverse().slice(0, 20);
    for (const session of sessions) {
      const row = document.createElement("div");
      row.className = "event-item";
      const time = document.createElement("time");
      time.textContent = timeOnly(session.started);
      const bodyNode = document.createElement("div");
      const strong = document.createElement("strong");
      strong.textContent = session.id + " · " + session.username;
      const detail = document.createElement("span");
      detail.textContent = session.assurance + " · " + session.status + " · " + session.source;
      bodyNode.append(strong, detail);
      row.append(time, bodyNode);
      fragment.appendChild(row);
    }
    history.replaceChildren(fragment);
  }
}

function toggleUserLock(username) {
  if (!requireMutable("identity lock change")) {
    return;
  }
  const user = userByName(username);
  if (!user || user.username === state.activeUser) {
    return;
  }
  user.locked = !user.locked;
  addLog("identity", user.locked ? "warn" : "info", (user.locked ? "Locked" : "Unlocked") + " simulated account " + username, false);
  addOpsEvent("Identity policy changed", username + " lock=" + user.locked + ".");
  persistState();
  renderIdentity();
}

function addDemoUser() {
  if (!requireMutable("identity creation")) {
    return;
  }
  let number = 1;
  let username = "analyst" + number;
  while (state.users.some(user => user.username === username)) {
    number += 1;
    username = "analyst" + number;
  }
  const user = {
    username,
    role: "Security Analyst",
    mfa: true,
    locked: false,
    lastSignIn: nowIso(),
    groups: ["users", "soc", "lab"]
  };
  state.users.push(user);
  addLog("identity", "info", "Created simulated identity " + username, false);
  addOpsEvent("Demo identity created", username + " role=" + user.role + ".");
  persistState();
  renderIdentity();
  toast("Identity created", username + " is a simulated local user.", "info");
}

function createSimulatedSession() {
  if (!requireMutable("session creation")) {
    return;
  }
  const username = byId("session-user")?.value || state.activeUser;
  const assurance = byId("session-assurance")?.value || "standard";
  const user = userByName(username);
  if (!user || user.locked) {
    toast("Session denied", "Selected simulated account is unavailable.", "error");
    return;
  }
  for (const session of state.sessions) {
    if (session.status === "active") {
      session.status = "superseded";
    }
  }
  const id = "SES-" + state.nextSessionId;
  state.nextSessionId += 1;
  state.sessions.push({
    id,
    username,
    assurance,
    started: nowIso(),
    status: "active",
    source: "local-console"
  });
  state.activeUser = username;
  user.lastSignIn = nowIso();
  addLog("identity", "info", "Created simulated session " + id + " user=" + username + " assurance=" + assurance, false);
  addOpsEvent("Session switched", id + " active as " + username + ".");
  persistState();
  updateTerminalPrompt();
  renderIdentity();
  renderOperations();
  toast("Session active", username + " · " + assurance, "info");
}

function lockWorkstation() {
  if (!requireMutable("workstation lock")) {
    return;
  }
  state.sessionLocked = true;
  byId("lock-screen")?.classList.remove("hidden");
  const label = byId("lock-user");
  if (label) {
    label.textContent = "Session " + state.activeUser + " is locked.";
  }
  addLog("identity", "info", "Workstation locked by " + state.activeUser, false);
  persistState();
  renderIdentity();
}

function unlockWorkstation() {
  state.sessionLocked = false;
  byId("lock-screen")?.classList.add("hidden");
  addLog("identity", "info", "Workstation unlocked using local simulation control", false);
  persistState();
  renderIdentity();
  toast("Workstation unlocked", "No real credential was requested.", "info");
}

function revokeAllSessions() {
  if (!requireMutable("session revocation")) {
    return;
  }
  for (const session of state.sessions) {
    session.status = "revoked";
  }
  const id = "SES-" + state.nextSessionId;
  state.nextSessionId += 1;
  state.sessions.push({
    id,
    username: state.activeUser,
    assurance: "local-recovery",
    started: nowIso(),
    status: "active",
    source: "recovery-console"
  });
  addLog("identity", "warn", "Revoked all demo sessions; recovery session " + id + " created", false);
  addOpsEvent("Sessions revoked", "All prior simulation sessions revoked.");
  persistState();
  renderIdentity();
  renderOperations();
}

function matchAddress(ruleValue, address) {
  if (ruleValue === "any") {
    return true;
  }
  if (!ruleValue.includes("/")) {
    return ruleValue === address;
  }
  const [base, maskText] = ruleValue.split("/");
  const mask = Number(maskText);
  if (mask === 24) {
    return base.split(".").slice(0, 3).join(".") === address.split(".").slice(0, 3).join(".");
  }
  if (mask === 16) {
    return base.split(".").slice(0, 2).join(".") === address.split(".").slice(0, 2).join(".");
  }
  return base === address;
}

function matchPort(rulePort, port) {
  if (String(rulePort).toLowerCase() === "any") {
    return true;
  }
  const values = String(rulePort).split(",").map(value => value.trim());
  for (const value of values) {
    if (value.includes("-")) {
      const [start, end] = value.split("-").map(Number);
      if (Number(port) >= start && Number(port) <= end) {
        return true;
      }
      continue;
    }
    if (Number(value) === Number(port)) {
      return true;
    }
  }
  return false;
}

function evaluateFirewallPacket(source, destination, protocol, port) {
  const normalizedProtocol = String(protocol).toUpperCase();
  const ordered = [...state.firewallRules].filter(rule => rule.enabled).sort((a, b) => a.id - b.id);
  for (const rule of ordered) {
    const protocolMatch = rule.protocol === "ANY" || rule.protocol.toUpperCase() === normalizedProtocol;
    const sourceMatch = matchAddress(rule.source, source);
    const destinationMatch = matchAddress(rule.destination, destination);
    const portMatch = normalizedProtocol === "ICMP" ? true : matchPort(rule.port, port);
    if (protocolMatch && sourceMatch && destinationMatch && portMatch) {
      return {
        action: rule.action,
        rule
      };
    }
  }
  return {
    action: "deny",
    rule: {
      id: "implicit",
      description: "Implicit default deny"
    }
  };
}

function renderFirewall() {
  const body = byId("firewall-rule-body");
  if (body) {
    const fragment = document.createDocumentFragment();
    const rules = [...state.firewallRules].sort((a, b) => a.id - b.id);
    for (const rule of rules) {
      const row = document.createElement("tr");
      const values = [
        rule.id,
        rule.action.toUpperCase(),
        rule.protocol,
        rule.source,
        rule.destination,
        rule.port,
        rule.enabled ? "Yes" : "No"
      ];
      for (const value of values) {
        const cell = document.createElement("td");
        cell.textContent = String(value);
        row.appendChild(cell);
      }
      const action = document.createElement("td");
      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.textContent = rule.enabled ? "Disable" : "Enable";
      toggle.disabled = isReadOnly();
      toggle.addEventListener("click", () => {
        toggleFirewallRule(rule.id);
      });
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "Delete";
      remove.disabled = isReadOnly() || rule.id <= 50;
      remove.addEventListener("click", () => {
        deleteFirewallRule(rule.id);
      });
      action.append(toggle, remove);
      row.appendChild(action);
      fragment.appendChild(row);
    }
    body.replaceChildren(fragment);
  }
  if (byId("fw-rule-count")) {
    byId("fw-rule-count").textContent = String(state.firewallRules.length);
  }
  if (byId("fw-allowed")) {
    byId("fw-allowed").textContent = String(state.firewallStats.allowed);
  }
  if (byId("fw-blocked")) {
    byId("fw-blocked").textContent = String(state.firewallStats.blocked);
  }
  if (byId("fw-sessions")) {
    byId("fw-sessions").textContent = String(state.firewallStats.trackedSessions);
  }
}

function toggleFirewallRule(id) {
  if (!requireMutable("firewall rule toggle")) {
    return;
  }
  const rule = state.firewallRules.find(item => item.id === id);
  if (!rule) {
    return;
  }
  rule.enabled = !rule.enabled;
  addLog("firewall", "warn", "Rule " + id + " enabled=" + rule.enabled, false);
  addOpsEvent("Firewall rule changed", "Rule " + id + " enabled=" + rule.enabled + ".");
  persistState();
  renderFirewall();
}

function deleteFirewallRule(id) {
  if (!requireMutable("firewall rule deletion")) {
    return;
  }
  if (id <= 50) {
    return;
  }
  const before = state.firewallRules.length;
  state.firewallRules = state.firewallRules.filter(rule => rule.id !== id);
  if (state.firewallRules.length === before) {
    return;
  }
  addLog("firewall", "warn", "Deleted custom firewall rule " + id, false);
  addOpsEvent("Firewall rule deleted", "Rule " + id + ".");
  persistState();
  renderFirewall();
}

function addFirewallRule() {
  if (!requireMutable("firewall rule creation")) {
    return;
  }
  const rule = {
    id: state.nextRuleId,
    action: state.nextRuleId % 2 === 0 ? "allow" : "deny",
    protocol: "TCP",
    source: "192.0.2.0/24",
    destination: "198.51.100.0/24",
    port: String(8000 + state.nextRuleId),
    enabled: true,
    description: "Operator-created demonstration rule"
  };
  state.nextRuleId += 10;
  state.firewallRules.splice(Math.max(0, state.firewallRules.length - 1), 0, rule);
  addLog("firewall", "info", "Created custom firewall rule " + rule.id, false);
  addOpsEvent("Firewall rule created", "Rule " + rule.id + " " + rule.action.toUpperCase() + " TCP port " + rule.port + ".");
  persistState();
  renderFirewall();
  toast("Firewall rule created", "Rule " + rule.id + " can be enabled, disabled, or deleted.", "info");
}

function runFirewallTest() {
  if (!requireMutable("firewall packet evaluation")) {
    return;
  }
  const source = byId("fw-test-src")?.value.trim() || "192.0.2.23";
  const destination = byId("fw-test-dst")?.value.trim() || "203.0.113.91";
  const protocol = byId("fw-test-proto")?.value || "TCP";
  const port = Number(byId("fw-test-port")?.value || 443);
  const verdict = evaluateFirewallPacket(source, destination, protocol, port);
  if (verdict.action === "allow") {
    state.firewallStats.allowed += 1;
  } else {
    state.firewallStats.blocked += 1;
  }
  const detail = byId("fw-test-result");
  if (detail) {
    detail.textContent = [
      "PACKET POLICY EVALUATION",
      "Source: " + source,
      "Destination: " + destination,
      "Protocol: " + protocol,
      "Destination port: " + port,
      "",
      "Verdict: " + verdict.action.toUpperCase(),
      "Matched rule: " + verdict.rule.id,
      "Reason: " + (verdict.rule.description || "Policy match")
    ].join("\n");
  }
  addLog("firewall", verdict.action === "allow" ? "info" : "warn", verdict.action.toUpperCase() + " policy test " + source + " -> " + destination + ":" + port + " rule=" + verdict.rule.id, false);
  persistState();
  renderFirewall();
}

function renderScheduler() {
  const body = byId("task-table-body");
  const history = byId("task-history");
  if (body) {
    const fragment = document.createDocumentFragment();
    for (const task of state.tasks) {
      const row = document.createElement("tr");
      const values = [
        task.name,
        task.schedule,
        task.command,
        task.enabled ? "Yes" : "No",
        task.lastRun ? shortDate(task.lastRun) : "Never",
        task.enabled ? shortDate(task.nextRun) : "Disabled"
      ];
      for (const value of values) {
        const cell = document.createElement("td");
        cell.textContent = String(value);
        row.appendChild(cell);
      }
      const action = document.createElement("td");
      const run = document.createElement("button");
      run.type = "button";
      run.textContent = "Run now";
      run.disabled = isReadOnly();
      run.addEventListener("click", () => {
        runTask(task.id, "manual");
      });
      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.textContent = task.enabled ? "Disable" : "Enable";
      toggle.disabled = isReadOnly();
      toggle.addEventListener("click", () => {
        toggleTask(task.id);
      });
      action.append(run, toggle);
      row.appendChild(action);
      fragment.appendChild(row);
    }
    body.replaceChildren(fragment);
  }
  if (history) {
    const fragment = document.createDocumentFragment();
    for (const item of state.taskHistory.slice(0, 40)) {
      const row = document.createElement("div");
      row.className = "event-item";
      const time = document.createElement("time");
      time.textContent = timeOnly(item.time);
      const detail = document.createElement("div");
      const strong = document.createElement("strong");
      strong.textContent = item.task + " · " + item.result;
      const span = document.createElement("span");
      span.textContent = item.detail;
      detail.append(strong, span);
      row.append(time, detail);
      fragment.appendChild(row);
    }
    if (!state.taskHistory.length) {
      const empty = document.createElement("div");
      empty.className = "muted";
      empty.textContent = "No scheduled task executions recorded yet.";
      fragment.appendChild(empty);
    }
    history.replaceChildren(fragment);
  }
}

function scheduleIntervalMilliseconds(schedule) {
  const match = /^every\s+(\d+)([smh])$/i.exec(schedule.trim());
  if (!match) {
    return 300000;
  }
  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  if (unit === "s") {
    return amount * 1000;
  }
  if (unit === "m") {
    return amount * 60000;
  }
  return amount * 3600000;
}

function schedulerTick() {
  if (!state.booted || !state.schedulerEnabled || isReadOnly()) {
    return;
  }
  const now = Date.now();
  for (const task of state.tasks) {
    if (!task.enabled) {
      continue;
    }
    if (Number(task.nextRun) <= now) {
      runTask(task.id, "scheduled");
    }
  }
}

function runTask(id, trigger) {
  if (!requireMutable("scheduled task execution")) {
    return;
  }
  const task = state.tasks.find(item => item.id === id);
  if (!task) {
    return;
  }
  let result = "SUCCESS";
  let detail = "Command completed.";
  if (task.command === "health-check") {
    const score = systemHealthScore();
    detail = "System health score " + score + "/100.";
  } else if (task.command === "log-rotate") {
    const before = state.logs.length;
    state.logs = state.logs.slice(0, 400);
    detail = "Retained " + state.logs.length + " of " + before + " synthetic events.";
  } else if (task.command === "detect-sweep") {
    const suspicious = state.connections.filter(connection => connection.remote.startsWith("203.0.113.") && connection.state === "ESTABLISHED").length;
    detail = "Correlation sweep found " + suspicious + " lab-range external sessions.";
  } else if (task.command === "sandbox-check") {
    const sandbox = state.filesystem["/home/guest/sandbox"];
    detail = "Sandbox contains " + (sandbox?.children.length || 0) + " virtual files.";
  } else {
    detail = "Custom safe command '" + task.command + "' simulated successfully.";
  }
  const timestamp = nowIso();
  task.lastRun = timestamp;
  task.runCount += 1;
  task.nextRun = Date.now() + scheduleIntervalMilliseconds(task.schedule);
  state.taskHistory.unshift({
    time: timestamp,
    task: task.id,
    trigger,
    result,
    detail
  });
  state.taskHistory = state.taskHistory.slice(0, 100);
  addLog("scheduler", "info", task.id + " " + trigger + " result=" + result + " " + detail, false);
  addOpsEvent("Scheduled task executed", task.id + " · " + detail);
  persistState();
  renderScheduler();
  renderOperations();
  if (trigger === "manual") {
    toast("Task completed", task.name + " · " + detail, "info");
  }
}

function toggleTask(id) {
  if (!requireMutable("scheduled task toggle")) {
    return;
  }
  const task = state.tasks.find(item => item.id === id);
  if (!task) {
    return;
  }
  task.enabled = !task.enabled;
  if (task.enabled) {
    task.nextRun = Date.now() + scheduleIntervalMilliseconds(task.schedule);
  }
  addLog("scheduler", "info", task.id + " enabled=" + task.enabled, false);
  addOpsEvent("Task schedule changed", task.id + " enabled=" + task.enabled + ".");
  persistState();
  renderScheduler();
}

function addScheduledTask() {
  if (!requireMutable("scheduled task creation")) {
    return;
  }
  const numeric = String(state.nextTaskId).padStart(3, "0");
  const task = {
    id: "TASK-" + numeric,
    name: "Operator health audit " + numeric,
    schedule: "every 7m",
    command: "health-check",
    enabled: true,
    lastRun: null,
    nextRun: Date.now() + 420000,
    runCount: 0
  };
  state.nextTaskId += 1;
  state.tasks.push(task);
  addLog("scheduler", "info", "Created " + task.id + " schedule=" + task.schedule, false);
  addOpsEvent("Scheduled task created", task.id + " " + task.name + ".");
  persistState();
  renderScheduler();
  toast("Task created", task.id + " runs " + task.schedule + ".", "info");
}

function datasetByName(name) {
  if (name === "logs") return state.logs;
  if (name === "incidents") return state.incidents;
  if (name === "processes") return state.processes;
  if (name === "connections") return state.connections;
  if (name === "services") return state.services;
  return [];
}

function normalizeQueryValue(raw) {
  const trimmed = raw.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function getRecordField(record, field) {
  const exact = Object.keys(record).find(key => key.toLowerCase() === field.toLowerCase());
  return exact ? record[exact] : undefined;
}

function executeTelemetryQuery(sourceName, queryText) {
  let rows = deepClone(datasetByName(sourceName));
  let projectedFields = null;
  const stages = queryText.split("|").map(stage => stage.trim()).filter(Boolean);
  for (const stage of stages) {
    const whereContains = /^where\s+([\w.-]+)\s+contains\s+(.+)$/i.exec(stage);
    if (whereContains) {
      const field = whereContains[1];
      const expected = normalizeQueryValue(whereContains[2]).toLowerCase();
      rows = rows.filter(record => String(getRecordField(record, field) ?? "").toLowerCase().includes(expected));
      continue;
    }
    const whereEquals = /^where\s+([\w.-]+)\s*=\s*(.+)$/i.exec(stage);
    if (whereEquals) {
      const field = whereEquals[1];
      const expected = normalizeQueryValue(whereEquals[2]).toLowerCase();
      rows = rows.filter(record => String(getRecordField(record, field) ?? "").toLowerCase() === expected);
      continue;
    }
    const sortMatch = /^sort\s+([\w.-]+)(?:\s+(asc|desc))?$/i.exec(stage);
    if (sortMatch) {
      const field = sortMatch[1];
      const direction = (sortMatch[2] || "asc").toLowerCase();
      rows.sort((a, b) => {
        const av = getRecordField(a, field);
        const bv = getRecordField(b, field);
        if (typeof av === "number" && typeof bv === "number") {
          return direction === "desc" ? bv - av : av - bv;
        }
        const cmp = String(av ?? "").localeCompare(String(bv ?? ""));
        return direction === "desc" ? -cmp : cmp;
      });
      continue;
    }
    const limitMatch = /^limit\s+(\d+)$/i.exec(stage);
    if (limitMatch) {
      rows = rows.slice(0, clamp(Number(limitMatch[1]), 1, 200));
      continue;
    }
    const projectMatch = /^project\s+(.+)$/i.exec(stage);
    if (projectMatch) {
      projectedFields = projectMatch[1].split(",").map(field => field.trim()).filter(Boolean);
      continue;
    }
    throw new Error("Unsupported query stage: " + stage);
  }
  if (!projectedFields) {
    const fieldSet = new Set();
    for (const row of rows.slice(0, 20)) {
      Object.keys(row).forEach(key => fieldSet.add(key));
    }
    projectedFields = Array.from(fieldSet).slice(0, 10);
  }
  return { rows, fields: projectedFields };
}

function runQuery() {
  const sourceName = byId("query-source")?.value || "logs";
  const input = byId("query-input");
  const queryText = input?.value.trim() || "";
  const status = byId("query-status");
  const results = byId("query-results");
  if (!results) return;
  if (!queryText) {
    results.innerHTML = '<div class="muted" style="padding:18px">Enter a query.</div>';
    return;
  }
  try {
    const result = executeTelemetryQuery(sourceName, queryText);
    renderQueryResults(result.rows, result.fields);
    const historyItem = { time: nowIso(), source: sourceName, query: queryText, count: result.rows.length };
    state.queryHistory.unshift(historyItem);
    state.queryHistory = state.queryHistory.slice(0, 30);
    persistState();
    renderQueryHistory();
    if (status) status.textContent = result.rows.length + " rows";
    addOpsEvent("Telemetry query executed", sourceName + " · " + result.rows.length + " rows.");
  } catch (error) {
    results.innerHTML = "";
    const pre = document.createElement("pre");
    pre.className = "detail-pane";
    pre.textContent = "Query error: " + error.message;
    results.appendChild(pre);
    if (status) status.textContent = "Query error";
  }
}

function renderQueryResults(rows, fields) {
  const root = byId("query-results");
  if (!root) return;
  if (!rows.length) {
    root.innerHTML = '<div class="muted" style="padding:18px">Query returned 0 rows.</div>';
    return;
  }
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  for (const field of fields) {
    const th = document.createElement("th");
    th.textContent = field;
    headRow.appendChild(th);
  }
  thead.appendChild(headRow);
  const tbody = document.createElement("tbody");
  for (const row of rows.slice(0, 200)) {
    const tr = document.createElement("tr");
    for (const field of fields) {
      const td = document.createElement("td");
      const value = getRecordField(row, field);
      td.textContent = Array.isArray(value) ? value.join(", ") : typeof value === "object" && value !== null ? JSON.stringify(value) : String(value ?? "");
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.append(thead, tbody);
  root.replaceChildren(table);
}

function renderQueryHistory() {
  const root = byId("query-history");
  if (!root) return;
  const fragment = document.createDocumentFragment();
  for (const item of state.queryHistory.slice(0, 12)) {
    const row = document.createElement("div");
    row.className = "event-item";
    const body = document.createElement("div");
    const strong = document.createElement("strong");
    strong.textContent = item.source + " · " + item.count + " rows";
    const span = document.createElement("span");
    span.textContent = item.query;
    body.append(strong, span);
    row.appendChild(body);
    row.addEventListener("click", () => {
      if (byId("query-source")) byId("query-source").value = item.source;
      if (byId("query-input")) byId("query-input").value = item.query;
    });
    fragment.appendChild(row);
  }
  root.replaceChildren(fragment);
}

function createSnapshot() {
  if (!requireMutable("snapshot creation")) return;
  const snapshot = {
    id: "SNAP-" + String(Date.now()).slice(-8),
    created: nowIso(),
    label: "Operator snapshot",
    health: systemHealthScore(),
    state: deepClone(state)
  };
  snapshots.unshift(snapshot);
  snapshots = snapshots.slice(0, 8);
  persistSnapshots();
  addLog("system", "info", "Created simulation snapshot " + snapshot.id, false);
  addOpsEvent("Snapshot created", snapshot.id + " health=" + snapshot.health + ".");
  persistState();
  renderSnapshots();
  toast("Snapshot created", snapshot.id + " stored in browser-local Browser OS storage.", "info");
}

function restoreSnapshot(id) {
  if (!requireMutable("snapshot restore")) return;
  const snapshot = snapshots.find(item => item.id === id);
  if (!snapshot) return;
  state = deepClone(snapshot.state);
  state.booted = true;
  state.bootTime = Date.now();
  addOpsEvent("Snapshot restored", id + " restored by operator.");
  addLog("system", "warn", "Restored simulation snapshot " + id, false);
  persistState();
  applyBootMode();
  renderAll();
  updateTerminalPrompt();
  toast("Snapshot restored", id, "warn");
}

function deleteSnapshot(id) {
  if (!requireMutable("snapshot deletion")) return;
  snapshots = snapshots.filter(item => item.id !== id);
  persistSnapshots();
  renderSnapshots();
}

function renderSnapshots() {
  const root = byId("snapshot-list");
  if (!root) return;
  const fragment = document.createDocumentFragment();
  if (!snapshots.length) {
    const empty = document.createElement("div");
    empty.className = "muted";
    empty.textContent = "No snapshots have been created.";
    fragment.appendChild(empty);
  }
  for (const snapshot of snapshots) {
    const card = document.createElement("article");
    card.className = "snapshot-card";
    const title = document.createElement("h3");
    title.textContent = snapshot.id;
    const meta = document.createElement("small");
    meta.textContent = shortDate(snapshot.created) + " · health " + snapshot.health + "/100";
    const buttons = document.createElement("div");
    buttons.className = "button-row";
    const inspect = document.createElement("button");
    inspect.type = "button";
    inspect.className = "ghost-button compact";
    inspect.textContent = "Inspect";
    inspect.addEventListener("click", () => {
      const detail = byId("snapshot-detail");
      if (detail) detail.textContent = JSON.stringify({ id: snapshot.id, created: snapshot.created, health: snapshot.health, services: snapshot.state.services, incidents: snapshot.state.incidents, activeUser: snapshot.state.activeUser }, null, 2);
    });
    const restore = document.createElement("button");
    restore.type = "button";
    restore.className = "primary-button compact";
    restore.textContent = "Restore";
    restore.disabled = isReadOnly();
    restore.addEventListener("click", () => restoreSnapshot(snapshot.id));
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "danger-button compact";
    remove.textContent = "Delete";
    remove.disabled = isReadOnly();
    remove.addEventListener("click", () => deleteSnapshot(snapshot.id));
    buttons.append(inspect, restore, remove);
    card.append(title, meta, buttons);
    fragment.appendChild(card);
  }
  root.replaceChildren(fragment);
}

function resetSimulation() {
  if (!requireMutable("simulation reset")) return;
  const mode = state.bootMode;
  state = createDefaultState();
  state.bootMode = mode;
  state.selectedBootMode = mode;
  state.booted = true;
  state.bootTime = Date.now();
  persistState();
  applyBootMode();
  renderAll();
  initializeTerminal(true);
  addOpsEvent("Simulation reset", "Default Browser OS 3.0 state restored.");
  persistState();
  toast("Simulation reset", "Default Browser OS 3.0 state restored.", "warn");
}

function renderSystem() {
  if (byId("system-boot-mode")) byId("system-boot-mode").textContent = state.bootMode.toUpperCase();
  if (byId("system-storage-status")) {
    const testKey = STORAGE_PREFIX + "storage-test";
    const ok = StorageLayer.set(testKey, "1");
    StorageLayer.remove(testKey);
    byId("system-storage-status").textContent = ok ? "Available · browserOS.v4.* only" : "Unavailable · memory only";
  }
}

function terminalPrint(text = "", type = "") {
  const output = byId("terminal-output");
  if (!output) return;
  const line = document.createElement("div");
  line.className = "terminal-line" + (type ? " " + type : "");
  line.textContent = String(text);
  output.appendChild(line);
  while (output.childElementCount > 700) output.firstElementChild?.remove();
  output.scrollTop = output.scrollHeight;
}

function initializeTerminal(force = false) {
  const output = byId("terminal-output");
  if (!output) return;
  if (output.dataset.initialized && !force) return;
  output.replaceChildren();
  output.dataset.initialized = "true";
  terminalPrint("Browser OS Security Operations Pro", "success");
  terminalPrint("Version 3.0.0 · BrowserKernel JS 4.0 · " + state.bootMode.toUpperCase() + " MODE", "info");
  terminalPrint("Repository / website write access: NOT PRESENT", "success");
  terminalPrint("External network client: BLOCKED BY CONTENT SECURITY POLICY", "success");
  terminalPrint('Type "help" for commands.', "muted");
  terminalPrint("");
  updateTerminalPrompt();
}

function updateTerminalPrompt() {
  const prompt = byId("terminal-prompt");
  if (!prompt) return;
  const path = state.currentDirectory === "/home/guest" ? "~" : state.currentDirectory;
  prompt.textContent = state.activeUser + "@browser-os:" + path + "$";
}

function commandHelp() {
  const lines = [
    "GENERAL",
    "  help, clear, date, uptime, whoami, hostname, uname, history",
    "FILES",
    "  pwd, ls [path], cd <path>, cat <file>, touch <file>, write <file> <text>",
    "PROCESSES",
    "  ps, top, kill <pid>",
    "NETWORK",
    "  ip, ss, ping <documentation-address>, dns <name>, packets, flow generate",
    "SECURITY",
    "  incidents, investigate <INC-ID>, isolate <endpoint>",
    "FIREWALL",
    "  fw list, fw test <src> <dst> <tcp|udp> <port>, fw enable <id>, fw disable <id>",
    "SERVICES",
    "  service list, service status <name>, service start|stop|restart <name>",
    "IDENTITY",
    "  users, sessions, session switch <user>, lock",
    "SCHEDULER",
    "  task list, task run <id>, task enable|disable <id>",
    "QUERY",
    "  query <source> <pipeline>",
    "SNAPSHOTS",
    "  snapshot list, snapshot create, snapshot restore <id>",
    "SYSTEM",
    "  health, services, security, apps, open <app-name>"
  ];
  lines.forEach(line => terminalPrint(line, line.endsWith(":") ? "info" : ""));
}

function terminalList(pathArg) {
  const path = normalizeVirtualPath(pathArg || state.currentDirectory);
  const node = state.filesystem[path];
  if (!node) {
    terminalPrint("ls: no such file or directory: " + path, "error");
    return;
  }
  if (node.type === "file") {
    terminalPrint(path.split("/").pop());
    return;
  }
  for (const child of node.children) terminalPrint(child);
}

function terminalCd(pathArg) {
  if (!pathArg) {
    state.currentDirectory = "/home/guest";
    updateTerminalPrompt();
    return;
  }
  const path = normalizeVirtualPath(pathArg);
  const node = state.filesystem[path];
  if (!node || node.type !== "dir") {
    terminalPrint("cd: not a directory: " + path, "error");
    return;
  }
  state.currentDirectory = path;
  updateTerminalPrompt();
  renderFiles();
}

function terminalCat(pathArg) {
  if (!pathArg) {
    terminalPrint("cat: missing file operand", "error");
    return;
  }
  const path = normalizeVirtualPath(pathArg);
  const node = state.filesystem[path];
  if (!node || node.type !== "file") {
    terminalPrint("cat: no such file: " + path, "error");
    return;
  }
  terminalPrint(generatedFileContent(node));
}

function terminalTouch(name) {
  if (!requireMutable("terminal file creation")) return;
  if (!name || name.includes("/")) {
    terminalPrint("touch: use a simple filename inside the sandbox", "error");
    return;
  }
  if (state.currentDirectory !== "/home/guest/sandbox") {
    terminalPrint("touch: writes are restricted to /home/guest/sandbox", "warn");
    return;
  }
  const path = state.currentDirectory + "/" + name;
  const directory = state.filesystem[state.currentDirectory];
  if (!state.filesystem[path]) {
    directory.children.push(name);
    state.filesystem[path] = { type: "file", writable: true, content: "" };
  }
  persistState();
  terminalPrint("created " + path, "success");
  renderFiles();
}

function terminalWrite(args) {
  if (!requireMutable("terminal file write")) return;
  const name = args.shift();
  const text = args.join(" ");
  if (!name || !text) {
    terminalPrint("usage: write <file> <text>", "error");
    return;
  }
  const path = normalizeVirtualPath(name);
  const node = state.filesystem[path];
  if (!node || node.type !== "file" || !node.writable) {
    terminalPrint("write: target must be a writable sandbox file", "error");
    return;
  }
  node.content = text;
  persistState();
  terminalPrint("wrote " + text.length + " characters to " + path, "success");
  renderFiles();
}

function terminalPs() {
  terminalPrint("PID   PPID  USER        CPU   MEM   STATUS      PROCESS", "info");
  for (const process of state.processes) {
    terminalPrint(String(process.pid).padEnd(6) + String(process.ppid).padEnd(6) + process.user.padEnd(12) + (process.cpu.toFixed(1) + "%").padEnd(6) + (process.mem + "M").padEnd(6) + process.status.padEnd(12) + process.name);
  }
}

function terminalTop() {
  const rows = [...state.processes].filter(process => process.status === "RUNNING").sort((a, b) => b.cpu - a.cpu).slice(0, 8);
  terminalPrint("Browser OS top · CPU " + state.performance.cpu + "% · MEM " + state.performance.memory + "% · " + rows.length + " shown", "info");
  for (const process of rows) terminalPrint(String(process.pid).padEnd(7) + process.name.padEnd(24) + process.cpu.toFixed(1).padStart(5) + "%  " + process.mem + " MB");
}

function terminalIp() {
  terminalPrint("1: lo: <LOOPBACK,UP> mtu 65536");
  terminalPrint("    inet 127.0.0.1/8 scope host lo");
  terminalPrint("2: bos0: <BROADCAST,MULTICAST,UP> mtu 1500");
  terminalPrint("    inet 192.0.2.10/24 brd 192.0.2.255 scope global bos0");
  terminalPrint("    default via 192.0.2.1 dev bos0");
  terminalPrint("    documentation-only virtual network", "muted");
}

function terminalSs() {
  terminalPrint("State        Process              Local                     Peer", "info");
  for (const connection of state.connections) terminalPrint(connection.state.padEnd(13) + connection.process.padEnd(21) + connection.local.padEnd(26) + connection.remote + " " + connection.policy);
}

function terminalPing(target) {
  if (!target) {
    terminalPrint("usage: ping <virtual-address>", "error");
    return;
  }
  const allowed = target.startsWith("192.0.2.") || target.startsWith("198.51.100.") || target.startsWith("203.0.113.");
  if (!allowed) {
    terminalPrint("ping: external targets are blocked; use RFC 5737 documentation ranges", "warn");
    return;
  }
  for (let i = 1; i <= 4; i += 1) terminalPrint("64 bytes from " + target + ": seq=" + i + " ttl=64 time=" + randomInt(8, 36) + " ms");
}

function terminalDns(name) {
  const map = { "soc.local": "198.51.100.20", "sentinel.local": "198.51.100.40", "firewall.local": "198.51.100.1", "fileserver.local": "198.51.100.10", "telemetry-sync.example": "203.0.113.91" };
  if (!name || !map[name]) {
    terminalPrint("DNS NXDOMAIN: " + (name || "<missing>"), "warn");
    return;
  }
  terminalPrint(name + " A " + map[name], "success");
}

function terminalIncidents() {
  terminalPrint("ID        SEVERITY    STATUS          ENDPOINT    DETECTION", "info");
  for (const incident of state.incidents) {
    terminalPrint(incident.id.padEnd(10) + incident.severity.padEnd(12) + incident.status.padEnd(16) + incident.endpoint.padEnd(12) + incident.title);
  }
}

function terminalInvestigate(id) {
  const incident = state.incidents.find(item => item.id.toLowerCase() === String(id || "").toLowerCase());
  if (!incident) {
    terminalPrint("investigate: unknown incident " + (id || ""), "error");
    return;
  }
  terminalPrint("Incident: " + incident.id, "info");
  terminalPrint("Severity: " + incident.severity);
  terminalPrint("Status: " + incident.status);
  terminalPrint("Endpoint: " + incident.endpoint);
  terminalPrint("User: " + incident.user);
  terminalPrint("Process: " + incident.processTree);
  terminalPrint("Network: " + incident.network);
  terminalPrint("MITRE: " + incident.mitre.join(", "));
  terminalPrint("Notes: " + incident.notes);
  openWindow("soc-window");
  showIncidentDetail(incident.id);
}

function terminalIsolate(endpoint) {
  if (!requireMutable("endpoint isolation")) return;
  const incident = state.incidents.find(item => item.endpoint.toLowerCase() === String(endpoint || "").toLowerCase());
  if (!incident) {
    terminalPrint("isolate: unknown synthetic endpoint " + (endpoint || ""), "error");
    return;
  }
  containIncident(incident.id);
  terminalPrint("contained " + incident.endpoint + " for " + incident.id, "success");
}

function terminalKill(pidText) {
  const pid = Number(pidText);
  const process = processByPid(pid);
  if (!process) {
    terminalPrint("kill: unknown pid " + pidText, "error");
    return;
  }
  if (process.protected) {
    terminalPrint("kill: PID " + pid + " is protected by Browser OS policy", "warn");
    return;
  }
  terminateProcess(pid);
  terminalPrint("terminated PID " + pid + " " + process.name, "success");
}

function terminalService(args) {
  const action = (args.shift() || "list").toLowerCase();
  if (action === "list") {
    terminalPrint("UNIT                           STATE      STARTUP    PID", "info");
    for (const service of state.services) terminalPrint(service.name.padEnd(31) + service.state.padEnd(11) + service.startup.padEnd(11) + String(service.pid || "-") );
    return;
  }
  const nameInput = args.join(" ");
  const fullName = nameInput.endsWith(".service") ? nameInput : nameInput + ".service";
  const service = serviceByName(fullName);
  if (!service) {
    terminalPrint("service: unknown unit " + fullName, "error");
    return;
  }
  if (action === "status") {
    terminalPrint(service.name + " - " + service.description, "info");
    terminalPrint("Loaded: " + service.startup);
    terminalPrint("Active: " + service.state);
    terminalPrint("PID: " + (service.pid || "none"));
    terminalPrint("Dependencies: " + (service.deps.join(", ") || "none"));
    terminalPrint("Restart count: " + service.restarts);
    return;
  }
  if (action === "start") {
    const ok = setServiceState(fullName, "running");
    terminalPrint(ok ? "started " + fullName : "failed to start " + fullName, ok ? "success" : "error");
    return;
  }
  if (action === "stop") {
    const ok = setServiceState(fullName, "stopped");
    terminalPrint(ok ? "stopped " + fullName : "failed to stop " + fullName, ok ? "success" : "error");
    return;
  }
  if (action === "restart") {
    restartService(fullName);
    terminalPrint("restart requested for " + fullName, "success");
    return;
  }
  terminalPrint("usage: service list|status|start|stop|restart [name]", "error");
}

function terminalFirewall(args) {
  const action = (args.shift() || "list").toLowerCase();
  if (action === "list") {
    terminalPrint("ID   ACTION  PROTO  SOURCE            DESTINATION       PORT      ENABLED", "info");
    for (const rule of [...state.firewallRules].sort((a, b) => a.id - b.id)) terminalPrint(String(rule.id).padEnd(5) + rule.action.toUpperCase().padEnd(8) + rule.protocol.padEnd(7) + rule.source.padEnd(18) + rule.destination.padEnd(18) + String(rule.port).padEnd(10) + String(rule.enabled));
    return;
  }
  if (action === "test") {
    const source = args[0];
    const destination = args[1];
    const protocol = args[2];
    const port = Number(args[3]);
    if (!source || !destination || !protocol || !Number.isFinite(port)) {
      terminalPrint("usage: fw test <src> <dst> <tcp|udp> <port>", "error");
      return;
    }
    const verdict = evaluateFirewallPacket(source, destination, protocol, port);
    terminalPrint(verdict.action.toUpperCase() + " rule=" + verdict.rule.id + " reason=" + (verdict.rule.description || "policy match"), verdict.action === "allow" ? "success" : "warn");
    return;
  }
  if (action === "enable" || action === "disable") {
    const id = Number(args[0]);
    const rule = state.firewallRules.find(item => item.id === id);
    if (!rule) {
      terminalPrint("fw: unknown rule " + args[0], "error");
      return;
    }
    if (!requireMutable("firewall rule change")) return;
    rule.enabled = action === "enable";
    persistState();
    renderFirewall();
    terminalPrint("rule " + id + " enabled=" + rule.enabled, "success");
    return;
  }
  terminalPrint("usage: fw list | fw test <src> <dst> <proto> <port> | fw enable|disable <id>", "error");
}

function terminalUsers() {
  terminalPrint("USER          ROLE                    MFA       LOCKED", "info");
  for (const user of state.users) terminalPrint(user.username.padEnd(14) + user.role.padEnd(24) + String(user.mfa).padEnd(10) + String(user.locked));
}

function terminalSessions() {
  terminalPrint("SESSION       USER          ASSURANCE       STATUS        SOURCE", "info");
  for (const session of state.sessions) terminalPrint(session.id.padEnd(14) + session.username.padEnd(14) + session.assurance.padEnd(16) + session.status.padEnd(14) + session.source);
}

function terminalSession(args) {
  const action = (args.shift() || "list").toLowerCase();
  if (action === "list") {
    terminalSessions();
    return;
  }
  if (action === "switch") {
    const username = args[0];
    const user = userByName(username);
    if (!user || user.locked) {
      terminalPrint("session: user unavailable " + (username || ""), "error");
      return;
    }
    if (!requireMutable("session switch")) return;
    if (byId("session-user")) byId("session-user").value = username;
    createSimulatedSession();
    terminalPrint("active simulated identity is now " + username, "success");
    return;
  }
  terminalPrint("usage: session list | session switch <user>", "error");
}

function terminalTask(args) {
  const action = (args.shift() || "list").toLowerCase();
  if (action === "list") {
    terminalPrint("ID        ENABLED  SCHEDULE     LAST RUN              COMMAND", "info");
    for (const task of state.tasks) terminalPrint(task.id.padEnd(10) + String(task.enabled).padEnd(9) + task.schedule.padEnd(13) + (task.lastRun ? shortDate(task.lastRun) : "Never").padEnd(22) + task.command);
    return;
  }
  const id = (args[0] || "").toUpperCase();
  const task = state.tasks.find(item => item.id === id);
  if (!task) {
    terminalPrint("task: unknown task " + id, "error");
    return;
  }
  if (action === "run") {
    runTask(id, "terminal");
    terminalPrint("executed " + id, "success");
    return;
  }
  if (action === "enable" || action === "disable") {
    if (!requireMutable("task schedule change")) return;
    task.enabled = action === "enable";
    if (task.enabled) task.nextRun = Date.now() + scheduleIntervalMilliseconds(task.schedule);
    persistState();
    renderScheduler();
    terminalPrint(id + " enabled=" + task.enabled, "success");
    return;
  }
  terminalPrint("usage: task list | task run <id> | task enable|disable <id>", "error");
}

function terminalQuery(rawAfterCommand) {
  const firstSpace = rawAfterCommand.indexOf(" ");
  if (firstSpace < 0) {
    terminalPrint("usage: query <source> <pipeline>", "error");
    return;
  }
  const source = rawAfterCommand.slice(0, firstSpace).trim();
  const queryText = rawAfterCommand.slice(firstSpace + 1).trim();
  if (!datasetByName(source).length && !["logs", "incidents", "processes", "connections", "services"].includes(source)) {
    terminalPrint("query: unknown source " + source, "error");
    return;
  }
  try {
    const result = executeTelemetryQuery(source, queryText);
    terminalPrint("query returned " + result.rows.length + " rows", "info");
    terminalPrint(result.fields.join(" | "), "info");
    for (const row of result.rows.slice(0, 25)) terminalPrint(result.fields.map(field => String(getRecordField(row, field) ?? "")).join(" | "));
  } catch (error) {
    terminalPrint("query error: " + error.message, "error");
  }
}

function terminalSnapshot(args) {
  const action = (args.shift() || "list").toLowerCase();
  if (action === "list") {
    if (!snapshots.length) {
      terminalPrint("no snapshots", "muted");
      return;
    }
    for (const snapshot of snapshots) terminalPrint(snapshot.id + " " + shortDate(snapshot.created) + " health=" + snapshot.health);
    return;
  }
  if (action === "create") {
    createSnapshot();
    terminalPrint("snapshot created", "success");
    return;
  }
  if (action === "restore") {
    const id = args[0];
    restoreSnapshot(id);
    terminalPrint("snapshot restore requested: " + id, "success");
    return;
  }
  terminalPrint("usage: snapshot list|create|restore <id>", "error");
}

function terminalSecurity() {
  terminalPrint("Browser OS 3.0 security boundary", "info");
  terminalPrint("backend........................ NONE", "success");
  terminalPrint("external network client........ NONE", "success");
  terminalPrint("connect-src CSP................. none", "success");
  terminalPrint("real credentials................ NONE", "success");
  terminalPrint("repository write API............ NONE", "success");
  terminalPrint("arbitrary code execution........ DISABLED", "success");
  terminalPrint("persistence namespace........... browserOS.v4.*", "success");
  terminalPrint("filesystem...................... VIRTUAL / SANDBOXED", "success");
}

function terminalHealth() {
  const score = systemHealthScore();
  terminalPrint("System health score: " + score + "/100", score >= 85 ? "success" : score >= 65 ? "warn" : "error");
  terminalPrint("CPU: " + state.performance.cpu + "%");
  terminalPrint("Memory: " + state.performance.memory + "%");
  terminalPrint("Disk: " + state.performance.disk + "%");
  terminalPrint("Network: " + formatBytesLike(state.performance.networkKbps));
  terminalPrint("Services: " + activeServices().length + "/" + state.services.length + " running");
  terminalPrint("Open incidents: " + activeIncidents().length);
  terminalPrint("Active sessions: " + activeSessions().length);
}

function terminalOpen(nameParts) {
  const name = nameParts.join(" ").toLowerCase();
  const app = APP_DEFINITIONS.find(item => item.name.toLowerCase() === name || item.id.replace("-window", "").replaceAll("-", " ") === name || item.keywords.includes(name));
  if (!app) {
    terminalPrint("open: unknown application " + name, "error");
    return;
  }
  openWindow(app.id);
  terminalPrint("opened " + app.name, "success");
}

function executeTerminalCommand(raw) {
  const args = raw.trim().split(/\s+/);
  const command = (args.shift() || "").toLowerCase();
  switch (command) {
    case "help": commandHelp(); break;
    case "clear": byId("terminal-output")?.replaceChildren(); break;
    case "date": terminalPrint(new Date().toString()); break;
    case "uptime": terminalPrint("up " + Math.floor((Date.now() - state.bootTime) / 1000) + " seconds, mode " + state.bootMode); break;
    case "whoami": terminalPrint(state.activeUser); break;
    case "hostname": terminalPrint("browser-os"); break;
    case "uname": terminalPrint("Browser OS 3.0.0 BrowserKernel-JS-4.0 BrowserSandbox"); break;
    case "history": state.terminalHistory.forEach((item, index) => terminalPrint(String(index + 1).padStart(3) + "  " + item)); break;
    case "pwd": terminalPrint(state.currentDirectory); break;
    case "ls": terminalList(args[0]); break;
    case "cd": terminalCd(args[0]); break;
    case "cat": terminalCat(args[0]); break;
    case "touch": terminalTouch(args[0]); break;
    case "write": terminalWrite(args); break;
    case "ps": terminalPs(); break;
    case "top": terminalTop(); break;
    case "kill": terminalKill(args[0]); break;
    case "ip":
    case "ifconfig": terminalIp(); break;
    case "ss":
    case "netstat": terminalSs(); break;
    case "ping": terminalPing(args[0]); break;
    case "dns": terminalDns(args[0]); break;
    case "packets": openWindow("packet-window"); terminalPrint("opened packet analyzer", "info"); break;
    case "flow": if ((args[0] || "").toLowerCase() === "generate") { generateSyntheticFlow(); terminalPrint("synthetic flow generated", "success"); } else terminalPrint("usage: flow generate", "error"); break;
    case "incidents": terminalIncidents(); break;
    case "investigate": terminalInvestigate(args[0]); break;
    case "isolate": terminalIsolate(args[0]); break;
    case "service": terminalService(args); break;
    case "services": terminalService(["list"]); break;
    case "fw": terminalFirewall(args); break;
    case "users": terminalUsers(); break;
    case "sessions": terminalSessions(); break;
    case "session": terminalSession(args); break;
    case "lock": lockWorkstation(); terminalPrint("workstation locked", "success"); break;
    case "task": terminalTask(args); break;
    case "query": terminalQuery(raw.trim().slice(command.length).trim()); break;
    case "snapshot": terminalSnapshot(args); break;
    case "security": terminalSecurity(); break;
    case "health": terminalHealth(); break;
    case "apps": APP_DEFINITIONS.forEach(app => terminalPrint(app.name + " — " + app.keywords)); break;
    case "open": terminalOpen(args); break;
    default: terminalPrint(command + ": command not found. Type help.", "error"); break;
  }
}

function initializeTerminalEvents() {
  const form = byId("terminal-form");
  const input = byId("terminal-input");
  if (!form || !input) return;
  form.addEventListener("submit", event => {
    event.preventDefault();
    const raw = input.value.trim();
    input.value = "";
    if (!raw) return;
    state.terminalHistory.push(raw);
    state.terminalHistory = state.terminalHistory.slice(-100);
    state.terminalHistoryIndex = state.terminalHistory.length;
    terminalPrint(byId("terminal-prompt")?.textContent + " " + raw, "command");
    executeTerminalCommand(raw);
    updateTerminalPrompt();
    persistState();
  });
  input.addEventListener("keydown", event => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      state.terminalHistoryIndex = clamp(state.terminalHistoryIndex - 1, 0, state.terminalHistory.length);
      input.value = state.terminalHistory[state.terminalHistoryIndex] || "";
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      state.terminalHistoryIndex = clamp(state.terminalHistoryIndex + 1, 0, state.terminalHistory.length);
      input.value = state.terminalHistory[state.terminalHistoryIndex] || "";
    }
  });
}

function initializeAppEvents() {
  byId("ops-clear-events")?.addEventListener("click", () => {
    if (!requireMutable("operations event clear")) return;
    state.opsEvents = [];
    persistState();
    renderOperations();
  });
  byId("process-search")?.addEventListener("input", renderProcesses);
  byId("process-status-filter")?.addEventListener("change", renderProcesses);
  byId("network-search")?.addEventListener("input", renderNetwork);
  byId("network-new-flow")?.addEventListener("click", generateSyntheticFlow);
  byId("packet-filter")?.addEventListener("input", renderPackets);
  byId("capture-toggle")?.addEventListener("click", () => {
    if (state.bootMode !== "standard") {
      toast("Capture unavailable", "Packet capture requires Standard Mode.", "warn");
      return;
    }
    state.captureEnabled = !state.captureEnabled;
    persistState();
    renderPackets();
  });
  byId("packet-clear")?.addEventListener("click", () => {
    if (!requireMutable("packet capture clear")) return;
    state.packets = [];
    persistState();
    renderPackets();
  });
  byId("log-source-filter")?.addEventListener("change", renderLogs);
  byId("log-search")?.addEventListener("input", renderLogs);
  byId("log-clear-view")?.addEventListener("click", () => {
    if (!requireMutable("log clear")) return;
    state.logs = [];
    persistState();
    renderLogs();
  });
  byId("file-new")?.addEventListener("click", createSandboxFile);
  byId("file-save")?.addEventListener("click", saveCurrentFile);
  byId("service-refresh")?.addEventListener("click", () => {
    renderServices();
    toast("Service state refreshed", activeServices().length + "/" + state.services.length + " running.", "info");
  });
  byId("identity-add")?.addEventListener("click", addDemoUser);
  byId("session-switch")?.addEventListener("click", createSimulatedSession);
  byId("session-lock")?.addEventListener("click", lockWorkstation);
  byId("unlock-session")?.addEventListener("click", unlockWorkstation);
  byId("session-revoke-all")?.addEventListener("click", revokeAllSessions);
  byId("fw-add-rule")?.addEventListener("click", addFirewallRule);
  byId("fw-test")?.addEventListener("click", runFirewallTest);
  byId("task-add")?.addEventListener("click", addScheduledTask);
  byId("task-history-clear")?.addEventListener("click", () => {
    if (!requireMutable("task history clear")) return;
    state.taskHistory = [];
    persistState();
    renderScheduler();
  });
  byId("query-run")?.addEventListener("click", runQuery);
  byId("query-clear")?.addEventListener("click", () => {
    if (byId("query-input")) byId("query-input").value = "";
    if (byId("query-results")) byId("query-results").replaceChildren();
    if (byId("query-status")) byId("query-status").textContent = "";
  });
  qsa("[data-query-example]").forEach(button => {
    button.addEventListener("click", () => {
      if (byId("query-input")) byId("query-input").value = button.dataset.queryExample;
    });
  });
  byId("snapshot-create")?.addEventListener("click", createSnapshot);
  byId("snapshot-export-view")?.addEventListener("click", () => {
    const detail = byId("snapshot-detail");
    if (detail) {
      detail.textContent = JSON.stringify({
        version: state.version,
        bootMode: state.bootMode,
        activeUser: state.activeUser,
        health: systemHealthScore(),
        services: state.services,
        users: state.users,
        firewallRules: state.firewallRules,
        tasks: state.tasks,
        incidents: state.incidents
      }, null, 2);
    }
  });
  byId("snapshot-reset")?.addEventListener("click", resetSimulation);
  byId("system-command-palette")?.addEventListener("click", () => openCommandPalette());
  byId("system-about-security")?.addEventListener("click", () => {
    openWindow("terminal-window");
    terminalSecurity();
  });
}

const PALETTE_ACTIONS = Object.freeze([
  { id: "action-health", name: "Run system health check", keywords: "health diagnostics status", run: () => { openWindow("terminal-window"); terminalHealth(); } },
  { id: "action-flow", name: "Generate synthetic network flow", keywords: "network traffic packet", run: generateSyntheticFlow },
  { id: "action-snapshot", name: "Create simulation snapshot", keywords: "snapshot recovery backup", run: createSnapshot },
  { id: "action-lock", name: "Lock simulated workstation", keywords: "session lock identity", run: lockWorkstation },
  { id: "action-query-high", name: "Query high-severity security logs", keywords: "siem query high security logs", run: () => { openWindow("query-window"); if (byId("query-source")) byId("query-source").value = "logs"; if (byId("query-input")) byId("query-input").value = "where level = high | sort time desc | limit 25"; runQuery(); } },
  { id: "action-reset", name: "Reset Browser OS simulation", keywords: "reset defaults recovery", run: resetSimulation }
]);

function paletteItems(query) {
  const normalized = query.trim().toLowerCase();
  const apps = APP_DEFINITIONS.map(app => ({
    id: app.id,
    name: app.name,
    type: "Application",
    keywords: app.keywords,
    run: () => openWindow(app.id)
  }));
  const actions = PALETTE_ACTIONS.map(action => ({ ...action, type: "Action" }));
  const all = [...apps, ...actions];
  if (!normalized) return all;
  return all.filter(item => (item.name + " " + item.keywords).toLowerCase().includes(normalized));
}

function renderPalette(query = "") {
  const root = byId("palette-results");
  if (!root) return;
  const items = paletteItems(query).slice(0, 18);
  const fragment = document.createDocumentFragment();
  for (const item of items) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "palette-item";
    const name = document.createElement("span");
    name.textContent = item.name;
    const type = document.createElement("small");
    type.textContent = item.type;
    button.append(name, type);
    button.addEventListener("click", () => {
      closeCommandPalette();
      item.run();
    });
    fragment.appendChild(button);
  }
  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "muted";
    empty.style.padding = "14px";
    empty.textContent = "No matching Browser OS action.";
    fragment.appendChild(empty);
  }
  root.replaceChildren(fragment);
}

function openCommandPalette(initial = "") {
  const palette = byId("command-palette");
  const input = byId("palette-input");
  if (!palette || !input) return;
  palette.classList.remove("hidden");
  input.value = initial;
  renderPalette(initial);
  window.setTimeout(() => input.focus(), 0);
}

function closeCommandPalette() {
  byId("command-palette")?.classList.add("hidden");
}

function initializeCommandPalette() {
  byId("start-command-palette")?.addEventListener("click", () => {
    setStartMenu(false);
    openCommandPalette();
  });
  byId("palette-input")?.addEventListener("input", event => {
    renderPalette(event.target.value);
  });
  byId("command-palette")?.addEventListener("click", event => {
    if (event.target === byId("command-palette")) closeCommandPalette();
  });
  document.addEventListener("keydown", event => {
    const ctrlOrMeta = event.ctrlKey || event.metaKey;
    if (ctrlOrMeta && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (byId("command-palette")?.classList.contains("hidden")) openCommandPalette();
      else closeCommandPalette();
    }
    if (event.key === "Escape") {
      closeCommandPalette();
      setStartMenu(false);
    }
    if (ctrlOrMeta && event.shiftKey && event.key.toLowerCase() === "t") {
      event.preventDefault();
      openWindow("terminal-window");
    }
    if (ctrlOrMeta && event.shiftKey && event.key.toLowerCase() === "o") {
      event.preventDefault();
      openWindow("ops-window");
    }
    if (ctrlOrMeta && event.shiftKey && event.key.toLowerCase() === "q") {
      event.preventDefault();
      openWindow("query-window");
    }
  });
}

function initializeBootEvents() {
  qsa("[data-boot-mode]").forEach(button => {
    button.addEventListener("click", () => {
      qsa("[data-boot-mode]").forEach(candidate => candidate.classList.toggle("active", candidate === button));
      state.selectedBootMode = button.dataset.bootMode;
      persistState();
    });
  });
  byId("boot-selected")?.addEventListener("click", () => runBoot(state.selectedBootMode || "standard", false));
  byId("quick-boot")?.addEventListener("click", () => runBoot(state.selectedBootMode || "standard", true));
}

function sanitizeRestoredState() {
  if (!Array.isArray(state.services)) state.services = createDefaultState().services;
  if (!Array.isArray(state.users)) state.users = createDefaultState().users;
  if (!Array.isArray(state.sessions)) state.sessions = createDefaultState().sessions;
  if (!Array.isArray(state.firewallRules)) state.firewallRules = createDefaultState().firewallRules;
  if (!Array.isArray(state.tasks)) state.tasks = createDefaultState().tasks;
  if (!Array.isArray(state.taskHistory)) state.taskHistory = [];
  if (!Array.isArray(state.incidents)) state.incidents = createDefaultState().incidents;
  if (!Array.isArray(state.processes)) state.processes = createDefaultState().processes;
  if (!Array.isArray(state.connections)) state.connections = createDefaultState().connections;
  if (!Array.isArray(state.packets)) state.packets = createDefaultState().packets;
  if (!Array.isArray(state.logs)) state.logs = createDefaultState().logs;
  if (!Array.isArray(state.opsEvents)) state.opsEvents = [];
  if (!Array.isArray(state.queryHistory)) state.queryHistory = [];
  if (!state.filesystem || typeof state.filesystem !== "object") state.filesystem = createDefaultState().filesystem;
  if (!state.performance || !Array.isArray(state.performance.cpuHistory)) state.performance = createDefaultState().performance;
  if (!state.firewallStats) state.firewallStats = createDefaultState().firewallStats;
  if (!state.activeUser || !userByName(state.activeUser)) state.activeUser = "guest";
  state.selectedBootMode = ["standard", "safe", "forensics"].includes(state.selectedBootMode) ? state.selectedBootMode : "standard";
  state.bootMode = ["standard", "safe", "forensics"].includes(state.bootMode) ? state.bootMode : state.selectedBootMode;
}

function initializeStoredWorkspace() {
  sanitizeRestoredState();
  if (state.booted) {
    state.booted = false;
    persistState();
  }
  qsa("[data-boot-mode]").forEach(button => button.classList.toggle("active", button.dataset.bootMode === state.selectedBootMode));
}

function initializeAccessibility() {
  qsa(".os-window").forEach(windowElement => {
    if (!windowElement.hasAttribute("role")) windowElement.setAttribute("role", "dialog");
    if (!windowElement.hasAttribute("aria-label")) windowElement.setAttribute("aria-label", windowElement.dataset.appName || "Browser OS application");
  });
  qsa("[data-close-window]").forEach(button => {
    const windowElement = button.closest(".os-window");
    button.setAttribute("aria-label", "Close " + (windowElement?.dataset.appName || "window"));
  });
  qsa("[data-minimize-window]").forEach(button => {
    const windowElement = button.closest(".os-window");
    button.setAttribute("aria-label", "Minimize " + (windowElement?.dataset.appName || "window"));
  });
  qsa("[data-maximize-window]").forEach(button => {
    const windowElement = button.closest(".os-window");
    button.setAttribute("aria-label", "Maximize " + (windowElement?.dataset.appName || "window"));
  });
}

function initialize() {
  initializeStoredWorkspace();
  buildStartMenu();
  initializeWindowManager();
  initializeStartMenu();
  initializeBootEvents();
  initializeTerminalEvents();
  initializeAppEvents();
  initializeCommandPalette();
  initializeAccessibility();
  updateClock();
  updateTerminalPrompt();
  renderAll();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize, { once: true });
} else {
  initialize();
}
