
"use strict";

/*
  Browser OS 2.1 Advanced Operations Layer
  This file extends Browser OS 2.0 while preserving the static trust boundary:
  no host shell, no external network client, no real credentials, no repository API.
*/

const ADVANCED_VERSION = "2.1.0";

const ADVANCED_APPS = Object.freeze([
  { id: "case-window", name: "Case & Evidence Manager", icon: "▤", keywords: "case evidence timeline chain custody investigation" },
  { id: "detection-window", name: "Detection Engineering", icon: "⌁", keywords: "detection rules analytics correlation tuning" },
  { id: "intel-window", name: "Threat Intelligence", icon: "◇", keywords: "ioc indicators enrichment sightings intelligence" },
  { id: "stack-window", name: "Network Stack", icon: "⌘", keywords: "routing route arp dns interface topology" },
  { id: "package-window", name: "Update Center", icon: "⬢", keywords: "packages patch updates inventory vulnerability" },
  { id: "compliance-window", name: "Compliance Auditor", icon: "✓", keywords: "compliance controls audit baseline hardening" },
  { id: "memory-window", name: "Memory Inspector", icon: "▥", keywords: "memory handles modules maps process forensics" },
  { id: "audit-window", name: "Audit Trail", icon: "◫", keywords: "audit timeline actions history accountability" }
]);

function advNow() {
  return new Date().toISOString();
}

function advText(value, max = 300) {
  return String(value ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .slice(0, max)
    .trim();
}

function advLower(value) {
  return String(value ?? "").toLowerCase();
}

function advId(prefix, number) {
  return prefix + "-" + String(number).padStart(4, "0");
}

function advDefaults() {
  const now = advNow();
  return {
    version: 1,
    selectedCase: "CASE-0001",
    selectedRule: "DET-0001",
    selectedIndicator: "IOC-0001",
    selectedPackage: "browser-kernel",
    selectedMemoryPid: 917,
    nextCase: 3,
    nextEvidence: 9,
    nextAudit: 1,
    nextRule: 61,
    nextIndicator: 81,
    cases: [
      {
        id: "CASE-0001",
        title: "Encoded PowerShell Investigation",
        severity: "HIGH",
        status: "OPEN",
        owner: "soc",
        created: now,
        updated: now,
        incidents: ["INC-001"],
        tags: ["powershell", "execution", "network"],
        hypothesis: "Document-launched PowerShell and Rundll32 produced suspicious outbound TLS behavior.",
        summary: "Correlate process, network, packet, log, and memory evidence for WS-042.",
        disposition: "Pending analyst conclusion",
        notes: [
          { time: now, author: "soc", text: "Case created from INC-001 with Office → PowerShell → Rundll32 lineage." }
        ],
        timeline: [
          { time: "2026-09-03T17:40:03Z", type: "process", title: "Office spawned PowerShell", detail: "WINWORD.EXE spawned powershell.exe on WS-042." },
          { time: "2026-09-03T17:40:04Z", type: "detection", title: "Encoded command observed", detail: "PowerShell command line contained encoded-command behavior." },
          { time: "2026-09-03T17:40:08Z", type: "network", title: "TLS session established", detail: "Rundll32-associated flow reached 203.0.113.91:443." }
        ]
      },
      {
        id: "CASE-0002",
        title: "Credential Access Validation",
        severity: "CRITICAL",
        status: "MONITORING",
        owner: "forensics",
        created: now,
        updated: now,
        incidents: ["INC-002"],
        tags: ["credential-access", "domain-controller"],
        hypothesis: "Protected-process access may represent credential dumping behavior.",
        summary: "Validate synthetic credential access on DC-01 and preserve evidence.",
        disposition: "Contained in synthetic environment",
        notes: [
          { time: now, author: "forensics", text: "Initial memory profile preserved for comparison." }
        ],
        timeline: [
          { time: "2026-09-03T17:44:11Z", type: "security", title: "Credential-access alert", detail: "Synthetic telemetry recorded protected-process access." }
        ]
      }
    ],
    evidence: [
      { id: "EVD-0001", caseId: "CASE-0001", type: "process", source: "Process Explorer", collected: now, integrity: "VERIFIED", description: "WINWORD → PowerShell → Rundll32 lineage", payload: "905 WINWORD.EXE\n910 powershell.exe\n917 rundll32.exe" },
      { id: "EVD-0002", caseId: "CASE-0001", type: "network", source: "Network Monitor", collected: now, integrity: "VERIFIED", description: "PID 917 outbound TLS session", payload: "192.0.2.23:52344 -> 203.0.113.91:443 TCP/TLS" },
      { id: "EVD-0003", caseId: "CASE-0001", type: "packet", source: "Packet Analyzer", collected: now, integrity: "VERIFIED", description: "TLS Client Hello with synthetic SNI", payload: "telemetry-sync.example / 203.0.113.91" },
      { id: "EVD-0004", caseId: "CASE-0001", type: "log", source: "Log Viewer", collected: now, integrity: "VERIFIED", description: "WS-042 security/firewall timeline", payload: "process spawn -> encoded command -> outbound TLS" },
      { id: "EVD-0005", caseId: "CASE-0002", type: "memory", source: "Memory Inspector", collected: now, integrity: "VERIFIED", description: "Protected-process access metadata", payload: "synthetic credential-access memory profile" },
      { id: "EVD-0006", caseId: "CASE-0002", type: "log", source: "Log Viewer", collected: now, integrity: "VERIFIED", description: "Critical credential-access event", payload: "2026-09-03T17:44:11Z synthetic credential access alert" },
      { id: "EVD-0007", caseId: null, type: "baseline", source: "Compliance Auditor", collected: now, integrity: "VERIFIED", description: "Secure configuration baseline", payload: "connect-src none / default deny / no credentials" },
      { id: "EVD-0008", caseId: null, type: "system", source: "System Information", collected: now, integrity: "VERIFIED", description: "Browser OS 2.1 metadata", payload: "advanced operations layer" }
    ],
    interfaces: [
      { name: "lo", state: "UP", mac: "00:00:00:00:00:00", ipv4: "127.0.0.1/8", mtu: 65536, rx: 18440, tx: 18440 },
      { name: "bos0", state: "UP", mac: "02:42:c0:00:02:0a", ipv4: "192.0.2.10/24", mtu: 1500, rx: 842310, tx: 473901 },
      { name: "lab0", state: "UP", mac: "02:42:c6:33:64:0a", ipv4: "198.51.100.10/24", mtu: 1500, rx: 123881, tx: 174110 }
    ],
    routes: [
      { destination: "127.0.0.0/8", gateway: "0.0.0.0", iface: "lo", metric: 0, proto: "kernel", scope: "link" },
      { destination: "192.0.2.0/24", gateway: "0.0.0.0", iface: "bos0", metric: 100, proto: "kernel", scope: "link" },
      { destination: "198.51.100.0/24", gateway: "192.0.2.1", iface: "bos0", metric: 120, proto: "static", scope: "global" },
      { destination: "203.0.113.0/24", gateway: "192.0.2.1", iface: "bos0", metric: 130, proto: "static", scope: "global" },
      { destination: "0.0.0.0/0", gateway: "192.0.2.1", iface: "bos0", metric: 200, proto: "static", scope: "global" }
    ],
    arp: [
      { ip: "192.0.2.1", mac: "02:42:c0:00:02:01", iface: "bos0", state: "REACHABLE", age: 12 },
      { ip: "192.0.2.53", mac: "02:42:c0:00:02:35", iface: "bos0", state: "STALE", age: 84 },
      { ip: "198.51.100.20", mac: "02:42:c6:33:64:14", iface: "lab0", state: "REACHABLE", age: 23 }
    ],
    dns: [
      { name: "soc.local", type: "A", value: "198.51.100.20", ttl: 274, source: "static-lab" },
      { name: "sentinel.local", type: "A", value: "198.51.100.40", ttl: 250, source: "static-lab" },
      { name: "fileserver.local", type: "A", value: "198.51.100.10", ttl: 281, source: "static-lab" },
      { name: "telemetry-sync.example", type: "A", value: "203.0.113.91", ttl: 43, source: "synthetic-evidence" }
    ],
    updateHistory: [],
    complianceScans: [],
    memoryProfiles: {
      "842": {
        pid: 842,
        process: "updater.exe",
        architecture: "x64",
        integrity: "Medium",
        privateBytes: 22528,
        workingSet: 31240,
        threads: 9,
        handles: ["File updater.dat", "Event UpdateWorkerReady", "TCP 203.0.113.74:443"],
        modules: ["updater.exe", "kernel32.dll", "ntdll.dll", "winhttp.dll"],
        maps: ["RX IMAGE updater.exe", "RW PRIVATE heap", "RX IMAGE kernel32.dll"],
        anomalies: ["Periodic outbound TLS session requires behavioral review."]
      },
      "905": {
        pid: 905,
        process: "WINWORD.EXE",
        architecture: "x64",
        integrity: "Medium",
        privateBytes: 47104,
        workingSet: 83012,
        threads: 18,
        handles: ["File invoice.docm", "Process powershell.exe PID 910", "Registry Office"],
        modules: ["WINWORD.EXE", "VBE7.DLL", "kernel32.dll"],
        maps: ["RX IMAGE WINWORD.EXE", "RW PRIVATE heap"],
        anomalies: ["Spawned powershell.exe from document context."]
      },
      "910": {
        pid: 910,
        process: "powershell.exe",
        architecture: "x64",
        integrity: "Medium",
        privateBytes: 31744,
        workingSet: 60122,
        threads: 12,
        handles: ["Parent WINWORD.EXE PID 905", "Child rundll32.exe PID 917", "Pipe powershell-host-910"],
        modules: ["powershell.exe", "System.Management.Automation.ni.dll", "clr.dll"],
        maps: ["RX IMAGE powershell.exe", "RW PRIVATE managed-heap"],
        anomalies: ["EncodedCommand argument observed.", "Office parent process is atypical."]
      },
      "917": {
        pid: 917,
        process: "rundll32.exe",
        architecture: "x64",
        integrity: "Medium",
        privateBytes: 15360,
        workingSet: 28884,
        threads: 6,
        handles: ["Parent powershell.exe PID 910", "TCP 203.0.113.91:443", "DNS telemetry-sync.example"],
        modules: ["rundll32.exe", "javascript.dll synthetic-demo-entry", "kernel32.dll", "wininet.dll"],
        maps: ["RX IMAGE rundll32.exe", "RW PRIVATE heap", "RX PRIVATE synthetic-code-region"],
        anomalies: ["Outbound TLS to investigation destination.", "Private executable region for training.", "Suspicious parent chain."]
      }
    },
    audit: [
      { id: "AUD-0000", time: now, actor: "system", action: "advanced.initialize", target: "Browser OS 2.1", outcome: "SUCCESS", detail: "Advanced state initialized." }
    ],
    rules: [],
    indicators: [],
    packages: [],
    controls: []
  };
}

function advPopulateDatasets(advanced) {
  if (!advanced.rules.length) {
    advanced.rules = ADV_RULE_SEED.map(item => ({ ...item }));
  }
  if (!advanced.indicators.length) {
    advanced.indicators = ADV_IOC_SEED.map(item => ({ ...item }));
  }
  if (!advanced.packages.length) {
    advanced.packages = ADV_PACKAGE_SEED.map(item => ({ ...item }));
  }
  if (!advanced.controls.length) {
    advanced.controls = ADV_CONTROL_SEED.map(item => ({ ...item }));
  }
}

function advEnsure() {
  const defaults = advDefaults();
  if (!state.advanced || typeof state.advanced !== "object") {
    state.advanced = defaults;
  }
  const advanced = state.advanced;
  for (const [key, value] of Object.entries(defaults)) {
    if (!(key in advanced)) {
      advanced[key] = deepClone(value);
    }
  }
  advPopulateDatasets(advanced);
  persistState();
  return advanced;
}

function advState() {
  return advEnsure();
}

function advAudit(action, target, outcome = "SUCCESS", detail = "", actor = state.activeUser || "system") {
  const advanced = advState();
  const id = advId("AUD", advanced.nextAudit++);
  advanced.audit.unshift({
    id,
    time: advNow(),
    actor,
    action,
    target,
    outcome,
    detail: advText(detail, 500)
  });
  advanced.audit = advanced.audit.slice(0, 500);
  persistState();
  renderAdvAudit();
  return id;
}

function advMutate(action, target, callback) {
  if (!requireMutable(action)) {
    advAudit(action, target, "BLOCKED", "Forensics Mode blocked mutation.");
    return false;
  }
  try {
    callback();
    persistState();
    advAudit(action, target, "SUCCESS", "Simulation state updated.");
    return true;
  } catch (error) {
    advAudit(action, target, "FAILED", error instanceof Error ? error.message : String(error));
    toast("Advanced operation failed", error instanceof Error ? error.message : String(error), "error");
    return false;
  }
}

function advWindow(id, icon, title, body) {
  const section = document.createElement("section");
  section.id = id;
  section.className = "os-window wide-window advanced-window";
  section.dataset.appName = title;
  section.setAttribute("role", "dialog");
  section.setAttribute("aria-label", title);
  section.innerHTML = `
    <header class="window-titlebar drag-handle">
      <div class="window-title"><span class="window-app-icon">${escapeHtml(icon)}</span>${escapeHtml(title)}</div>
      <div class="window-controls">
        <button class="window-control" data-minimize-window type="button">—</button>
        <button class="window-control" data-maximize-window type="button">□</button>
        <button class="window-control close" data-close-window type="button">×</button>
      </div>
    </header>
    <div class="window-content">${body}</div>
  `;
  return section;
}

function advMountWindow(section) {
  const desktop = byId("desktop");
  const taskbar = qs(".taskbar", desktop || document);
  if (!desktop || !taskbar) return;
  desktop.insertBefore(section, taskbar);
  section.querySelector("[data-close-window]")?.addEventListener("click", () => closeWindow(section));
  section.querySelector("[data-minimize-window]")?.addEventListener("click", () => minimizeWindow(section));
  section.querySelector("[data-maximize-window]")?.addEventListener("click", () => toggleMaximize(section));
  section.addEventListener("mousedown", () => bringToFront(section));
  section.querySelector(".drag-handle")?.addEventListener("pointerdown", startDrag);
}

function advMountLauncher(app) {
  const startApps = qs(".start-apps");
  if (startApps && !startApps.querySelector(`[data-open-app="${app.id}"]`)) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.openApp = app.id;
    button.innerHTML = `<span>${escapeHtml(app.icon)}</span>${escapeHtml(app.name)}`;
    button.addEventListener("click", () => {
      advOpen(app.id);
      setStartMenu(false);
    });
    startApps.appendChild(button);
  }
  const desktopIcons = qs(".desktop-icons");
  if (desktopIcons && !desktopIcons.querySelector(`[data-open-app="${app.id}"]`)) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "desktop-icon adv-icon";
    button.dataset.openApp = app.id;
    button.innerHTML = `<span class="desktop-icon-symbol">${escapeHtml(app.icon)}</span><span>${escapeHtml(app.name)}</span>`;
    button.addEventListener("click", () => advOpen(app.id));
    desktopIcons.appendChild(button);
  }
}

function advBuildWindows() {
  if (byId("case-window")) return;
  const windows = [
    advWindow("case-window", "▤", "Case & Evidence Manager", `
      <div class="tool-header"><div><div class="eyebrow">INCIDENT RESPONSE</div><h2>Case & Evidence Manager</h2></div><button id="adv-case-new" class="primary-button compact" type="button">New Case</button></div>
      <div class="adv-grid-three">
        <aside class="adv-panel"><input id="adv-case-search" class="os-input" type="search" placeholder="Filter cases..."><div id="adv-case-list" class="adv-list"></div></aside>
        <section id="adv-case-detail" class="adv-panel adv-main"></section>
        <aside class="adv-panel"><h3>Evidence Locker</h3><div id="adv-evidence-list" class="adv-list"></div><button id="adv-evidence-capture" class="ghost-button compact" type="button">Capture Evidence</button></aside>
      </div>
    `),
    advWindow("detection-window", "⌁", "Detection Engineering", `
      <div class="tool-header"><div><div class="eyebrow">DETECTION ENGINEERING</div><h2>Analytics Workbench</h2></div><button id="adv-detect-all" class="primary-button compact" type="button">Run All Rules</button></div>
      <div class="metric-grid"><article class="metric-card"><span>Rules</span><strong id="adv-rule-count">0</strong></article><article class="metric-card"><span>Enabled</span><strong id="adv-rule-enabled">0</strong></article><article class="metric-card"><span>Matches</span><strong id="adv-rule-matches">0</strong></article><article class="metric-card"><span>High/Critical</span><strong id="adv-rule-high">0</strong></article></div>
      <div class="adv-grid-two"><aside class="adv-panel"><input id="adv-rule-search" class="os-input" type="search" placeholder="Search rules..."><div id="adv-rule-list" class="adv-list"></div></aside><section id="adv-rule-detail" class="adv-panel adv-main"></section></div>
    `),
    advWindow("intel-window", "◇", "Threat Intelligence", `
      <div class="tool-header"><div><div class="eyebrow">LOCAL SYNTHETIC INTELLIGENCE</div><h2>Threat Intelligence Workspace</h2></div><button id="adv-intel-correlate" class="primary-button compact" type="button">Correlate Sightings</button></div>
      <div class="filter-bar"><input id="adv-intel-search" class="os-input" type="search" placeholder="Search IOC, tag, context..."><select id="adv-intel-severity" class="os-select"><option value="all">All severities</option><option>HIGH</option><option>MEDIUM</option><option>BENIGN</option><option>CONTEXTUAL</option></select></div>
      <div class="adv-grid-two"><aside class="adv-panel"><div id="adv-intel-list" class="adv-list"></div></aside><section id="adv-intel-detail" class="adv-panel adv-main"></section></div>
    `),
    advWindow("stack-window", "⌘", "Network Stack", `
      <div class="tool-header"><div><div class="eyebrow">VIRTUAL TCP/IP INTERNALS</div><h2>Network Stack Inspector</h2></div><button id="adv-stack-refresh" class="ghost-button compact" type="button">Refresh</button></div>
      <div class="adv-tabs"><button class="adv-tab active" data-adv-stack="interfaces">Interfaces</button><button class="adv-tab" data-adv-stack="routes">Routes</button><button class="adv-tab" data-adv-stack="arp">ARP</button><button class="adv-tab" data-adv-stack="dns">DNS</button><button class="adv-tab" data-adv-stack="trace">Trace</button></div>
      <div id="adv-stack-panel" class="adv-panel adv-main"></div>
    `),
    advWindow("package-window", "⬢", "Update Center", `
      <div class="tool-header"><div><div class="eyebrow">PATCH MANAGEMENT</div><h2>Update Center</h2></div><button id="adv-package-all" class="primary-button compact" type="button">Install All Updates</button></div>
      <div class="metric-grid"><article class="metric-card"><span>Packages</span><strong id="adv-pkg-count">0</strong></article><article class="metric-card"><span>Updates</span><strong id="adv-pkg-updates">0</strong></article><article class="metric-card"><span>Security</span><strong id="adv-pkg-security">0</strong></article><article class="metric-card"><span>History</span><strong id="adv-pkg-history">0</strong></article></div>
      <div class="adv-grid-two"><aside class="adv-panel"><input id="adv-package-search" class="os-input" type="search" placeholder="Filter packages..."><div id="adv-package-list" class="adv-list"></div></aside><section id="adv-package-detail" class="adv-panel adv-main"></section></div>
    `),
    advWindow("compliance-window", "✓", "Compliance Auditor", `
      <div class="tool-header"><div><div class="eyebrow">CONFIGURATION ASSURANCE</div><h2>Compliance Auditor</h2></div><button id="adv-compliance-scan" class="primary-button compact" type="button">Run Audit Scan</button></div>
      <div class="adv-score"><strong id="adv-compliance-score">0%</strong><div><h3 id="adv-compliance-posture">Evaluating</h3><p id="adv-compliance-summary" class="muted"></p></div></div>
      <div class="filter-bar"><select id="adv-compliance-filter" class="os-select"><option value="all">All controls</option><option>PASS</option><option>WARN</option><option>FAIL</option></select><button id="adv-compliance-remediate" class="ghost-button compact">Remediate Eligible</button></div>
      <div id="adv-control-list" class="adv-controls"></div><div class="adv-panel"><h3>Scan History</h3><div id="adv-compliance-history"></div></div>
    `),
    advWindow("memory-window", "▥", "Memory Inspector", `
      <div class="tool-header"><div><div class="eyebrow">SYNTHETIC PROCESS FORENSICS</div><h2>Memory Inspector</h2></div><div class="status-pill neutral">NO REAL MEMORY ACCESS</div></div>
      <div class="adv-grid-two"><aside class="adv-panel"><div id="adv-memory-list" class="adv-list"></div></aside><section id="adv-memory-detail" class="adv-panel adv-main"></section></div>
    `),
    advWindow("audit-window", "◫", "Audit Trail", `
      <div class="tool-header"><div><div class="eyebrow">OPERATOR ACCOUNTABILITY</div><h2>Unified Audit Trail</h2></div><button id="adv-audit-json" class="ghost-button compact">View JSON</button></div>
      <div class="filter-bar"><input id="adv-audit-search" class="os-input" type="search" placeholder="Search audit events..."><select id="adv-audit-outcome" class="os-select"><option value="all">All outcomes</option><option>SUCCESS</option><option>FAILED</option><option>BLOCKED</option></select></div>
      <div class="table-wrapper"><table class="data-table"><thead><tr><th>Time</th><th>ID</th><th>Actor</th><th>Action</th><th>Target</th><th>Outcome</th></tr></thead><tbody id="adv-audit-table"></tbody></table></div><pre id="adv-audit-detail" class="adv-code">Select an audit event.</pre>
    `)
  ];
  windows.forEach(advMountWindow);
  ADVANCED_APPS.forEach(advMountLauncher);
}

function advOpen(id) {
  openWindow(id);
  advRenderApp(id);
}

function advRenderApp(id) {
  if (id === "case-window") renderAdvCases();
  if (id === "detection-window") renderAdvRules();
  if (id === "intel-window") renderAdvIntel();
  if (id === "stack-window") renderAdvStack();
  if (id === "package-window") renderAdvPackages();
  if (id === "compliance-window") renderAdvCompliance();
  if (id === "memory-window") renderAdvMemory();
  if (id === "audit-window") renderAdvAudit();
}

function advSelectedCase() {
  const advanced = advState();
  return advanced.cases.find(item => item.id === advanced.selectedCase) || advanced.cases[0] || null;
}

function advCaseEvidence(caseId) {
  return advState().evidence.filter(item => item.caseId === caseId);
}

function renderAdvCases() {
  const advanced = advState();
  const search = advLower(byId("adv-case-search")?.value);
  const list = byId("adv-case-list");
  if (list) {
    list.innerHTML = advanced.cases
      .filter(item => !search || advLower(item.id + " " + item.title + " " + item.owner + " " + item.tags.join(" ")).includes(search))
      .map(item => `<button class="adv-list-item ${item.id === advanced.selectedCase ? "active" : ""}" data-adv-case="${escapeHtml(item.id)}"><span><strong>${escapeHtml(item.id)}</strong><b>${escapeHtml(item.severity)}</b></span><em>${escapeHtml(item.title)}</em><small>${escapeHtml(item.status)} · ${escapeHtml(item.owner)}</small></button>`)
      .join("");
    qsa("[data-adv-case]", list).forEach(button => button.addEventListener("click", () => {
      advanced.selectedCase = button.dataset.advCase;
      persistState();
      renderAdvCases();
    }));
  }
  const current = advSelectedCase();
  const detail = byId("adv-case-detail");
  if (detail && current) {
    detail.innerHTML = `
      <div class="adv-head"><div><div class="eyebrow">${escapeHtml(current.id)}</div><h2>${escapeHtml(current.title)}</h2></div><span class="status-pill neutral">${escapeHtml(current.status)}</span></div>
      <div class="detail-grid"><div><span>Severity</span><strong>${escapeHtml(current.severity)}</strong></div><div><span>Owner</span><strong>${escapeHtml(current.owner)}</strong></div><div><span>Incidents</span><strong>${escapeHtml(current.incidents.join(", ") || "None")}</strong></div><div><span>Updated</span><strong>${escapeHtml(shortDate(current.updated))}</strong></div></div>
      <section class="adv-section"><h3>Hypothesis</h3><p>${escapeHtml(current.hypothesis)}</p></section>
      <section class="adv-section"><h3>Summary</h3><p>${escapeHtml(current.summary)}</p></section>
      <section class="adv-section"><h3>Disposition</h3><p>${escapeHtml(current.disposition)}</p></section>
      <section class="adv-section"><div class="adv-section-head"><h3>Timeline</h3><button id="adv-case-timeline-add" class="ghost-button compact">Add Event</button></div><div class="adv-timeline">${current.timeline.map(item => `<div><time>${escapeHtml(shortDate(item.time))}</time><span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.type)}</small><p>${escapeHtml(item.detail)}</p></span></div>`).join("")}</div></section>
      <section class="adv-section"><div class="adv-section-head"><h3>Notes</h3><button id="adv-case-note-add" class="ghost-button compact">Add Note</button></div>${current.notes.slice().reverse().map(item => `<article class="adv-note"><strong>${escapeHtml(item.author)}</strong><time>${escapeHtml(shortDate(item.time))}</time><p>${escapeHtml(item.text)}</p></article>`).join("")}</section>
      <div class="adv-actions"><button id="adv-case-status" class="primary-button compact">${current.status === "CLOSED" ? "Reopen Case" : "Close Case"}</button><button id="adv-case-sync" class="ghost-button compact">Sync Incident</button></div>
    `;
    byId("adv-case-note-add")?.addEventListener("click", advAddCaseNote);
    byId("adv-case-timeline-add")?.addEventListener("click", advAddTimeline);
    byId("adv-case-status")?.addEventListener("click", advToggleCase);
    byId("adv-case-sync")?.addEventListener("click", advSyncIncident);
  }
  const evRoot = byId("adv-evidence-list");
  if (evRoot && current) {
    evRoot.innerHTML = advCaseEvidence(current.id).map(item => `<button class="adv-list-item" data-adv-evidence="${item.id}"><span><strong>${item.id}</strong><b>${item.integrity}</b></span><em>${escapeHtml(item.description)}</em><small>${escapeHtml(item.type)} · ${escapeHtml(item.source)}</small></button>`).join("") || `<div class="adv-empty">No evidence linked.</div>`;
    qsa("[data-adv-evidence]", evRoot).forEach(button => button.addEventListener("click", () => {
      const item = advanced.evidence.find(entry => entry.id === button.dataset.advEvidence);
      if (!item || !detail) return;
      const pre = document.createElement("pre");
      pre.className = "adv-code";
      pre.textContent = JSON.stringify(item, null, 2);
      detail.prepend(pre);
    }));
  }
}

function advNewCase() {
  const title = advText(window.prompt("Case title:", "New Security Investigation") || "", 120);
  if (!title) return;
  const advanced = advState();
  advMutate("case.create", title, () => {
    const id = advId("CASE", advanced.nextCase++);
    const now = advNow();
    advanced.cases.push({ id, title, severity: "MEDIUM", status: "OPEN", owner: state.activeUser, created: now, updated: now, incidents: [], tags: ["analyst-created"], hypothesis: "Define the working hypothesis.", summary: "Analyst-created Browser OS case.", disposition: "Pending", notes: [], timeline: [] });
    advanced.selectedCase = id;
  });
  renderAdvCases();
}

function advAddCaseNote() {
  const current = advSelectedCase();
  if (!current) return;
  const text = advText(window.prompt("Analyst note:", "") || "", 800);
  if (!text) return;
  advMutate("case.note.add", current.id, () => {
    current.notes.push({ time: advNow(), author: state.activeUser, text });
    current.updated = advNow();
  });
  renderAdvCases();
}

function advAddTimeline() {
  const current = advSelectedCase();
  if (!current) return;
  const title = advText(window.prompt("Timeline title:", "Analyst observation") || "", 120);
  if (!title) return;
  const detail = advText(window.prompt("Timeline detail:", "") || "", 500);
  advMutate("case.timeline.add", current.id, () => {
    current.timeline.push({ time: advNow(), type: "analyst", title, detail: detail || "Analyst-added event." });
    current.updated = advNow();
  });
  renderAdvCases();
}

function advToggleCase() {
  const current = advSelectedCase();
  if (!current) return;
  advMutate("case.status.change", current.id, () => {
    current.status = current.status === "CLOSED" ? "OPEN" : "CLOSED";
    current.updated = advNow();
  });
  renderAdvCases();
}

function advSyncIncident() {
  const current = advSelectedCase();
  if (!current) return;
  advMutate("case.incident.sync", current.id, () => {
    current.incidents.forEach(id => {
      const incident = state.incidents.find(item => item.id === id);
      if (!incident) return;
      incident.status = current.status === "CLOSED" ? "RESOLVED" : "INVESTIGATING";
    });
  });
  renderIncidents();
  renderAdvCases();
}

function advCaptureEvidence() {
  const advanced = advState();
  const current = advSelectedCase();
  if (!current) return;
  const type = advText(window.prompt("Evidence type:", "log") || "", 30);
  const description = advText(window.prompt("Evidence description:", "Analyst capture") || "", 180);
  if (!type || !description) return;
  advMutate("evidence.capture", current.id, () => {
    const id = advId("EVD", advanced.nextEvidence++);
    let payload = "Synthetic analyst evidence.";
    if (type === "process") payload = state.processes.slice(0, 20).map(item => `${item.pid} ${item.ppid} ${item.user} ${item.name} ${item.status}`).join("\n");
    if (type === "network") payload = state.connections.slice(0, 20).map(item => `${item.id} ${item.process} ${item.local} -> ${item.remote}`).join("\n");
    if (type === "log") payload = state.logs.slice(0, 20).map(item => `${item.time} ${item.source} ${item.level} ${item.message}`).join("\n");
    if (type === "packet") payload = state.packets.slice(0, 20).map(item => `${item.no} ${item.src} -> ${item.dst} ${item.proto} ${item.info}`).join("\n");
    advanced.evidence.push({ id, caseId: current.id, type, source: "Analyst Capture", collected: advNow(), integrity: "VERIFIED", description, payload });
    current.timeline.push({ time: advNow(), type: "evidence", title: "Evidence captured " + id, detail: description });
    current.updated = advNow();
  });
  renderAdvCases();
}

function advRuleMatch(rule) {
  const detector = rule.detector;
  if (detector === "encoded-powershell") {
    const ps = state.processes.find(item => advLower(item.name) === "powershell.exe");
    const parent = ps ? processByPid(ps.ppid) : null;
    return Boolean(ps && parent && advLower(parent.name).includes("winword") && advLower(ps.cmd).includes("encoded"));
  }
  if (detector === "rundll32-tls") {
    return state.connections.some(item => advLower(item.process) === "rundll32.exe" && item.remote.startsWith("203.0.113."));
  }
  if (detector === "credential-access") {
    return state.logs.some(item => advLower(item.message).includes("credential access"));
  }
  if (detector === "service-stop") {
    return state.services.some(item => item.protected && item.state !== "running");
  }
  if (detector === "remote-admin-deny") {
    return state.logs.some(item => advLower(item.message).includes("deny") && /(22|3389)/.test(item.message));
  }
  if (detector === "beacon") {
    return state.connections.some(item => advLower(item.process).includes("updater") && item.remote.startsWith("203.0.113."));
  }
  if (detector === "nxdomain") {
    return state.logs.filter(item => advLower(item.message).includes("nxdomain")).length >= rule.threshold;
  }
  if (detector === "priv-session") {
    return state.sessions.some(session => {
      if (session.status !== "active") return false;
      const user = userByName(session.username);
      return Boolean(user && user.role.includes("Administrator") && !user.mfa);
    });
  }
  if (detector === "high-cpu") {
    return state.processes.some(item => Number(item.cpu) >= rule.threshold);
  }
  if (detector === "external-flow") {
    return state.connections.some(item => item.remote.startsWith("203.0.113."));
  }
  return false;
}

function advRunRule(rule, notify = true) {
  if (!rule.enabled) return false;
  const matched = advRuleMatch(rule);
  rule.lastRun = advNow();
  if (matched) {
    rule.matches += 1;
    addLog("detection", advLower(rule.severity), `Advanced rule ${rule.id} matched: ${rule.name}`);
    if (notify) toast("Detection matched", rule.id + " · " + rule.name, "warn");
  } else if (notify) {
    toast("No match", rule.id + " produced no current match.", "info");
  }
  persistState();
  advAudit("detection.run", rule.id, "SUCCESS", matched ? "MATCH" : "NO MATCH", "detection-engine");
  return matched;
}

function advRunAllRules() {
  const advanced = advState();
  let matches = 0;
  advanced.rules.forEach(rule => {
    if (rule.enabled && advRunRule(rule, false)) matches += 1;
  });
  toast("Detection sweep", matches + " advanced rules matched.", matches ? "warn" : "success");
  advAudit("detection.sweep", "all-rules", "SUCCESS", matches + " matches", "detection-engine");
  renderAdvRules();
}

function advSelectedRule() {
  const advanced = advState();
  return advanced.rules.find(item => item.id === advanced.selectedRule) || advanced.rules[0];
}

function renderAdvRules() {
  const advanced = advState();
  const search = advLower(byId("adv-rule-search")?.value);
  const filtered = advanced.rules.filter(item => !search || advLower(item.id + " " + item.name + " " + item.technique + " " + item.logic).includes(search));
  if (byId("adv-rule-count")) byId("adv-rule-count").textContent = advanced.rules.length;
  if (byId("adv-rule-enabled")) byId("adv-rule-enabled").textContent = advanced.rules.filter(item => item.enabled).length;
  if (byId("adv-rule-matches")) byId("adv-rule-matches").textContent = advanced.rules.reduce((sum, item) => sum + item.matches, 0);
  if (byId("adv-rule-high")) byId("adv-rule-high").textContent = advanced.rules.filter(item => ["HIGH", "CRITICAL"].includes(item.severity)).length;
  const root = byId("adv-rule-list");
  if (root) {
    root.innerHTML = filtered.map(item => `<button class="adv-list-item ${item.id === advanced.selectedRule ? "active" : ""}" data-adv-rule="${item.id}"><span><strong>${item.id}</strong><b>${item.severity}</b></span><em>${escapeHtml(item.name)}</em><small>${item.enabled ? "ENABLED" : "DISABLED"} · ${item.technique} · ${item.matches} matches</small></button>`).join("");
    qsa("[data-adv-rule]", root).forEach(button => button.addEventListener("click", () => {
      advanced.selectedRule = button.dataset.advRule;
      persistState();
      renderAdvRules();
    }));
  }
  const rule = advSelectedRule();
  const detail = byId("adv-rule-detail");
  if (detail && rule) {
    detail.innerHTML = `<div class="adv-head"><div><div class="eyebrow">${rule.id} · ${rule.technique}</div><h2>${escapeHtml(rule.name)}</h2></div><span class="status-pill ${rule.enabled ? "good" : "neutral"}">${rule.enabled ? "ENABLED" : "DISABLED"}</span></div><div class="detail-grid"><div><span>Severity</span><strong>${rule.severity}</strong></div><div><span>Source</span><strong>${rule.source}</strong></div><div><span>Threshold</span><strong>${rule.threshold}</strong></div><div><span>Matches</span><strong>${rule.matches}</strong></div></div><section class="adv-section"><h3>Logic</h3><pre class="adv-code">${escapeHtml(rule.logic)}</pre></section><section class="adv-section"><h3>False Positives</h3><p>${escapeHtml(rule.falsePositive)}</p></section><section class="adv-section"><h3>Tuning</h3><p>${escapeHtml(rule.tuning)}</p></section><div class="adv-actions"><button id="adv-rule-run" class="primary-button compact">Run Rule</button><button id="adv-rule-toggle" class="ghost-button compact">${rule.enabled ? "Disable" : "Enable"}</button><button id="adv-rule-clone" class="ghost-button compact">Clone</button></div>`;
    byId("adv-rule-run")?.addEventListener("click", () => {
      advRunRule(rule);
      renderAdvRules();
    });
    byId("adv-rule-toggle")?.addEventListener("click", () => {
      advMutate("detection.toggle", rule.id, () => { rule.enabled = !rule.enabled; });
      renderAdvRules();
    });
    byId("adv-rule-clone")?.addEventListener("click", () => {
      advMutate("detection.clone", rule.id, () => {
        const clone = deepClone(rule);
        clone.id = advId("DET", advanced.nextRule++);
        clone.name += " — Analyst Copy";
        clone.enabled = false;
        clone.matches = 0;
        clone.lastRun = null;
        advanced.rules.push(clone);
        advanced.selectedRule = clone.id;
      });
      renderAdvRules();
    });
  }
}

function advIndicatorMatches(indicator) {
  const needle = advLower(indicator.value);
  const matches = [];
  state.logs.forEach(item => {
    if (advLower(item.message).includes(needle)) matches.push({ type: "log", detail: item.message });
  });
  state.connections.forEach(item => {
    if (advLower(item.remote + " " + item.local + " " + item.process).includes(needle)) matches.push({ type: "connection", detail: `${item.process} ${item.local} -> ${item.remote}` });
  });
  state.packets.forEach(item => {
    if (advLower(item.src + " " + item.dst + " " + item.info).includes(needle)) matches.push({ type: "packet", detail: `${item.proto} ${item.info}` });
  });
  state.processes.forEach(item => {
    if (advLower(item.name + " " + item.cmd).includes(needle)) matches.push({ type: "process", detail: `${item.pid} ${item.name} ${item.cmd}` });
  });
  return matches.slice(0, 40);
}

function advSelectedIndicator() {
  const advanced = advState();
  return advanced.indicators.find(item => item.id === advanced.selectedIndicator) || advanced.indicators[0];
}

function renderAdvIntel() {
  const advanced = advState();
  const search = advLower(byId("adv-intel-search")?.value);
  const severity = byId("adv-intel-severity")?.value || "all";
  const filtered = advanced.indicators.filter(item => {
    if (severity !== "all" && item.severity !== severity) return false;
    return !search || advLower(item.id + " " + item.type + " " + item.value + " " + item.tags + " " + item.context).includes(search);
  });
  const list = byId("adv-intel-list");
  if (list) {
    list.innerHTML = filtered.map(item => `<button class="adv-list-item ${item.id === advanced.selectedIndicator ? "active" : ""}" data-adv-ioc="${item.id}"><span><strong>${escapeHtml(item.value)}</strong><b>${item.type}</b></span><em>${item.status}</em><small>${item.confidence}% confidence · ${item.sightings} sightings</small></button>`).join("");
    qsa("[data-adv-ioc]", list).forEach(button => button.addEventListener("click", () => {
      advanced.selectedIndicator = button.dataset.advIoc;
      persistState();
      renderAdvIntel();
    }));
  }
  const item = advSelectedIndicator();
  const detail = byId("adv-intel-detail");
  if (detail && item) {
    const matches = advIndicatorMatches(item);
    detail.innerHTML = `<div class="adv-head"><div><div class="eyebrow">${item.id} · ${item.type}</div><h2>${escapeHtml(item.value)}</h2></div><span class="status-pill neutral">${item.severity}</span></div><div class="detail-grid"><div><span>Confidence</span><strong>${item.confidence}%</strong></div><div><span>Status</span><strong>${item.status}</strong></div><div><span>Sightings</span><strong>${item.sightings}</strong></div><div><span>Last Seen</span><strong>${escapeHtml(shortDate(item.lastSeen))}</strong></div></div><section class="adv-section"><h3>Context</h3><p>${escapeHtml(item.context)}</p></section><section class="adv-section"><h3>Tags</h3><p>${escapeHtml(item.tags.join(" · "))}</p></section><section class="adv-section"><h3>Current Telemetry Matches</h3>${matches.map(hit => `<article class="adv-match"><strong>${hit.type}</strong><span>${escapeHtml(hit.detail)}</span></article>`).join("") || `<div class="adv-empty">No current sightings.</div>`}</section><div class="adv-actions"><button id="adv-intel-sighting" class="primary-button compact">Add Sighting</button><button id="adv-intel-case" class="ghost-button compact">Link to Current Case</button></div>`;
    byId("adv-intel-sighting")?.addEventListener("click", () => {
      advMutate("intel.sighting", item.id, () => { item.sightings += 1; item.lastSeen = advNow(); });
      renderAdvIntel();
    });
    byId("adv-intel-case")?.addEventListener("click", () => advLinkIntelCase(item));
  }
}

function advCorrelateIntel() {
  const advanced = advState();
  let total = 0;
  advanced.indicators.forEach(item => {
    const count = advIndicatorMatches(item).length;
    if (count) {
      item.sightings += count;
      item.lastSeen = advNow();
      total += count;
    }
  });
  persistState();
  advAudit("intel.correlate", "local-dataset", "SUCCESS", total + " sightings correlated", "intel-engine");
  toast("Threat intel correlation", total + " local synthetic sightings correlated.", "success");
  renderAdvIntel();
}

function advLinkIntelCase(item) {
  const current = advSelectedCase();
  if (!current) return;
  advMutate("intel.case.link", current.id, () => {
    current.notes.push({ time: advNow(), author: state.activeUser, text: `Linked ${item.id} ${item.value} confidence=${item.confidence}%` });
    current.timeline.push({ time: advNow(), type: "intel", title: "Indicator linked", detail: item.value + " · " + item.context });
    current.updated = advNow();
  });
  renderAdvCases();
  toast("Indicator linked", item.value + " linked to " + current.id, "success");
}

function renderAdvStack() {
  const root = byId("adv-stack-panel");
  if (!root) return;
  const tab = qs("[data-adv-stack].active")?.dataset.advStack || "interfaces";
  if (tab === "interfaces") advStackInterfaces(root);
  if (tab === "routes") advStackRoutes(root);
  if (tab === "arp") advStackArp(root);
  if (tab === "dns") advStackDns(root);
  if (tab === "trace") advStackTrace(root);
}

function advStackInterfaces(root) {
  const advanced = advState();
  root.innerHTML = `<div class="table-wrapper"><table class="data-table"><thead><tr><th>Interface</th><th>State</th><th>MAC</th><th>IPv4</th><th>MTU</th><th>RX</th><th>TX</th></tr></thead><tbody>${advanced.interfaces.map(item => `<tr><td>${item.name}</td><td>${item.state}</td><td>${item.mac}</td><td>${item.ipv4}</td><td>${item.mtu}</td><td>${item.rx.toLocaleString()}</td><td>${item.tx.toLocaleString()}</td></tr>`).join("")}</tbody></table></div><div class="adv-callout">Synthetic interfaces only. Browser OS does not access the device network stack.</div>`;
}

function advStackRoutes(root) {
  const advanced = advState();
  root.innerHTML = `<div class="adv-section-head"><h3>IPv4 Routing Table</h3><button id="adv-route-add" class="ghost-button compact">Add Route</button></div><div class="table-wrapper"><table class="data-table"><thead><tr><th>Destination</th><th>Gateway</th><th>Interface</th><th>Metric</th><th>Protocol</th><th></th></tr></thead><tbody>${advanced.routes.map((item, index) => `<tr><td>${item.destination}</td><td>${item.gateway}</td><td>${item.iface}</td><td>${item.metric}</td><td>${item.proto}</td><td>${item.proto === "static" && item.destination !== "0.0.0.0/0" ? `<button class="table-action" data-adv-route-delete="${index}">Delete</button>` : ""}</td></tr>`).join("")}</tbody></table></div>`;
  byId("adv-route-add")?.addEventListener("click", advAddRoute);
  qsa("[data-adv-route-delete]", root).forEach(button => button.addEventListener("click", () => advDeleteRoute(Number(button.dataset.advRouteDelete))));
}

function advStackArp(root) {
  const advanced = advState();
  root.innerHTML = `<div class="adv-section-head"><h3>Neighbor Cache</h3><button id="adv-arp-flush" class="ghost-button compact">Flush Dynamic</button></div><div class="table-wrapper"><table class="data-table"><thead><tr><th>IPv4</th><th>MAC</th><th>Interface</th><th>State</th><th>Age</th></tr></thead><tbody>${advanced.arp.map(item => `<tr><td>${item.ip}</td><td>${item.mac}</td><td>${item.iface}</td><td>${item.state}</td><td>${item.age}s</td></tr>`).join("")}</tbody></table></div>`;
  byId("adv-arp-flush")?.addEventListener("click", () => {
    advMutate("arp.flush", "neighbor-cache", () => { advanced.arp = advanced.arp.filter(item => item.ip === "192.0.2.1"); });
    renderAdvStack();
  });
}

function advStackDns(root) {
  const advanced = advState();
  root.innerHTML = `<div class="adv-section-head"><h3>DNS Cache</h3><button id="adv-dns-flush" class="ghost-button compact">Flush Dynamic</button></div><div class="table-wrapper"><table class="data-table"><thead><tr><th>Name</th><th>Type</th><th>Value</th><th>TTL</th><th>Source</th></tr></thead><tbody>${advanced.dns.map(item => `<tr><td>${item.name}</td><td>${item.type}</td><td>${item.value}</td><td>${item.ttl}s</td><td>${item.source}</td></tr>`).join("")}</tbody></table></div><div class="adv-form"><input id="adv-dns-name" class="os-input" value="soc.local"><button id="adv-dns-lookup" class="primary-button compact">Resolve</button></div><pre id="adv-dns-result" class="adv-code">Ready.</pre>`;
  byId("adv-dns-flush")?.addEventListener("click", () => {
    advMutate("dns.flush", "resolver-cache", () => { advanced.dns = advanced.dns.filter(item => item.source === "static-lab"); });
    renderAdvStack();
  });
  byId("adv-dns-lookup")?.addEventListener("click", advDnsLookup);
}

function advStackTrace(root) {
  root.innerHTML = `<div class="adv-form"><input id="adv-trace-target" class="os-input" value="203.0.113.91"><button id="adv-trace-run" class="primary-button compact">Trace Route</button></div><div id="adv-trace-result" class="adv-trace"><div class="adv-empty">Ready for a synthetic route trace.</div></div>`;
  byId("adv-trace-run")?.addEventListener("click", advTrace);
}

function advAddRoute() {
  const advanced = advState();
  const destination = advText(window.prompt("Destination CIDR:", "203.0.113.128/25") || "", 40);
  const gateway = advText(window.prompt("Gateway:", "192.0.2.1") || "", 40);
  if (!destination || !gateway) return;
  advMutate("route.add", destination, () => {
    advanced.routes.splice(Math.max(advanced.routes.length - 1, 0), 0, { destination, gateway, iface: "bos0", metric: 140, proto: "static", scope: "global" });
  });
  renderAdvStack();
}

function advDeleteRoute(index) {
  const advanced = advState();
  const item = advanced.routes[index];
  if (!item) return;
  advMutate("route.delete", item.destination, () => { advanced.routes.splice(index, 1); });
  renderAdvStack();
}

function advDnsLookup() {
  const advanced = advState();
  const name = advLower(byId("adv-dns-name")?.value);
  const result = byId("adv-dns-result");
  if (!result) return;
  const hit = advanced.dns.find(item => item.name.toLowerCase() === name);
  result.textContent = hit ? `CACHE HIT\n${hit.name} ${hit.type} ${hit.value}\nTTL ${hit.ttl}\nSource ${hit.source}` : `NXDOMAIN\n${name}\nExternal recursion disabled`;
  advAudit("dns.lookup", name, "SUCCESS", hit ? "cache hit" : "NXDOMAIN");
}

function advTrace() {
  const target = advText(byId("adv-trace-target")?.value || "", 100);
  const root = byId("adv-trace-result");
  if (!target || !root) return;
  const known = target.startsWith("198.51.100.") || target.startsWith("203.0.113.");
  const hops = known ? [["192.0.2.1", randomInt(1,3), "virtual-gateway"], ["198.51.100.254", randomInt(5,9), "lab-transit"], [target, randomInt(10,18), "synthetic-destination"]] : [["192.0.2.1", randomInt(1,3), "virtual-gateway"], ["*", null, "external routing disabled"]];
  root.innerHTML = hops.map((hop, index) => `<div class="adv-hop"><strong>${index + 1}</strong><span>${escapeHtml(hop[0])}</span><span>${hop[1] === null ? "*" : hop[1] + " ms"}</span><small>${escapeHtml(hop[2])}</small></div>`).join("");
  advAudit("route.trace", target, "SUCCESS", hops.length + " hops");
}

function advSelectedPackage() {
  const advanced = advState();
  return advanced.packages.find(item => item.name === advanced.selectedPackage) || advanced.packages[0];
}

function renderAdvPackages() {
  const advanced = advState();
  const search = advLower(byId("adv-package-search")?.value);
  const items = advanced.packages.filter(item => !search || advLower(item.name + " " + item.description).includes(search));
  if (byId("adv-pkg-count")) byId("adv-pkg-count").textContent = advanced.packages.length;
  if (byId("adv-pkg-updates")) byId("adv-pkg-updates").textContent = advanced.packages.filter(item => item.status === "UPDATE").length;
  if (byId("adv-pkg-security")) byId("adv-pkg-security").textContent = advanced.packages.filter(item => item.status === "UPDATE" && item.security).length;
  if (byId("adv-pkg-history")) byId("adv-pkg-history").textContent = advanced.updateHistory.length;
  const list = byId("adv-package-list");
  if (list) {
    list.innerHTML = items.map(item => `<button class="adv-list-item ${item.name === advanced.selectedPackage ? "active" : ""}" data-adv-package="${item.name}"><span><strong>${escapeHtml(item.name)}</strong><b>${item.security ? "SECURITY" : "STABLE"}</b></span><em>${item.installed} → ${item.available}</em><small>${item.status} · ${item.size} KB</small></button>`).join("");
    qsa("[data-adv-package]", list).forEach(button => button.addEventListener("click", () => {
      advanced.selectedPackage = button.dataset.advPackage;
      persistState();
      renderAdvPackages();
    }));
  }
  const item = advSelectedPackage();
  const detail = byId("adv-package-detail");
  if (detail && item) {
    detail.innerHTML = `<div class="adv-head"><div><div class="eyebrow">${item.channel.toUpperCase()}</div><h2>${escapeHtml(item.name)}</h2></div><span class="status-pill ${item.status === "CURRENT" ? "good" : "neutral"}">${item.status}</span></div><div class="detail-grid"><div><span>Installed</span><strong>${item.installed}</strong></div><div><span>Available</span><strong>${item.available}</strong></div><div><span>Size</span><strong>${item.size} KB</strong></div><div><span>Security</span><strong>${item.security ? "YES" : "NO"}</strong></div></div><section class="adv-section"><h3>Description</h3><p>${escapeHtml(item.description)}</p></section><section class="adv-section"><h3>Advisory</h3><p>${escapeHtml(item.advisory)}</p></section><div class="adv-actions"><button id="adv-package-update-one" class="primary-button compact" ${item.status === "CURRENT" ? "disabled" : ""}>Install Update</button><button id="adv-package-verify" class="ghost-button compact">Verify</button></div>`;
    byId("adv-package-update-one")?.addEventListener("click", () => {
      advInstallPackage(item);
      renderAdvPackages();
      renderAdvCompliance();
    });
    byId("adv-package-verify")?.addEventListener("click", () => {
      const checksum = "sha256:synthetic-" + item.name.replaceAll("-", "") + "-" + item.installed.replaceAll(".", "");
      toast("Package verified", checksum, "success");
      advAudit("package.verify", item.name, "SUCCESS", checksum);
    });
  }
}

function advInstallPackage(item, notify = true) {
  if (item.status === "CURRENT") return false;
  const advanced = advState();
  let changed = false;
  advMutate("package.update", item.name, () => {
    const from = item.installed;
    item.installed = item.available;
    item.status = "CURRENT";
    advanced.updateHistory.unshift({ time: advNow(), package: item.name, from, to: item.installed, actor: state.activeUser, security: item.security });
    changed = true;
  });
  if (changed && notify) toast("Update installed", item.name + " " + item.installed, "success");
  return changed;
}

function advInstallAll() {
  const advanced = advState();
  let count = 0;
  advanced.packages.forEach(item => {
    if (item.status === "UPDATE" && advInstallPackage(item, false)) count += 1;
  });
  toast("Update run complete", count + " packages updated.", "success");
  advAudit("package.update-all", "all-packages", "SUCCESS", count + " updated");
  renderAdvPackages();
  renderAdvCompliance();
}

function advEvaluateControls() {
  const advanced = advState();
  const securityUpdates = advanced.packages.filter(item => item.security && item.status === "UPDATE").length;
  const stoppedProtected = state.services.filter(item => item.protected && item.state !== "running").length;
  const highDisabled = advanced.rules.filter(item => ["HIGH", "CRITICAL"].includes(item.severity) && !item.enabled).length;
  advanced.controls.forEach(control => {
    if (control.check === "network-boundary") control.status = "PASS";
    if (control.check === "no-secrets") control.status = "PASS";
    if (control.check === "default-deny") control.status = state.firewallRules.some(item => item.action === "deny" && item.protocol === "ANY") ? "PASS" : "FAIL";
    if (control.check === "security-updates") control.status = securityUpdates ? "WARN" : "PASS";
    if (control.check === "protected-services") control.status = stoppedProtected ? "FAIL" : "PASS";
    if (control.check === "high-rules") control.status = highDisabled ? "WARN" : "PASS";
    if (control.check === "snapshot") control.status = snapshots.length ? "PASS" : "WARN";
    if (control.check === "sandbox") control.status = Object.entries(state.filesystem).every(([path, entry]) => !entry.writable || path.startsWith("/home/guest/sandbox")) ? "PASS" : "FAIL";
    if (control.check === "mfa") control.status = state.users.filter(item => item.role.includes("Administrator")).every(item => item.mfa) ? "PASS" : "FAIL";
    if (control.check === "audit") control.status = advanced.audit.length ? "PASS" : "WARN";
  });
}

function advComplianceScore() {
  advEvaluateControls();
  const controls = advState().controls;
  if (!controls.length) return 100;
  const points = controls.reduce((sum, item) => sum + (item.status === "PASS" ? 1 : item.status === "WARN" ? 0.5 : 0), 0);
  return Math.round(points / controls.length * 100);
}

function advRunCompliance() {
  const advanced = advState();
  const score = advComplianceScore();
  advanced.complianceScans.unshift({ time: advNow(), score, pass: advanced.controls.filter(item => item.status === "PASS").length, warn: advanced.controls.filter(item => item.status === "WARN").length, fail: advanced.controls.filter(item => item.status === "FAIL").length, actor: state.activeUser });
  advanced.complianceScans = advanced.complianceScans.slice(0, 30);
  persistState();
  advAudit("compliance.scan", "baseline", "SUCCESS", "score=" + score, "compliance-auditor");
  toast("Compliance scan", "Synthetic posture score " + score + "%.", score >= 90 ? "success" : "warn");
  renderAdvCompliance();
}

function renderAdvCompliance() {
  const advanced = advState();
  advEvaluateControls();
  const score = advComplianceScore();
  if (byId("adv-compliance-score")) byId("adv-compliance-score").textContent = score + "%";
  if (byId("adv-compliance-posture")) byId("adv-compliance-posture").textContent = score >= 95 ? "Strong posture" : score >= 80 ? "Review recommended" : "Remediation required";
  if (byId("adv-compliance-summary")) byId("adv-compliance-summary").textContent = `${advanced.controls.filter(item => item.status === "PASS").length} pass · ${advanced.controls.filter(item => item.status === "WARN").length} warning · ${advanced.controls.filter(item => item.status === "FAIL").length} fail`;
  const filter = byId("adv-compliance-filter")?.value || "all";
  const root = byId("adv-control-list");
  if (root) {
    root.innerHTML = advanced.controls.filter(item => filter === "all" || item.status === filter).map(item => `<article class="adv-control"><div><span class="eyebrow">${item.id} · ${escapeHtml(item.family)}</span><h3>${escapeHtml(item.title)}</h3><span class="status-pill ${item.status === "PASS" ? "good" : item.status === "FAIL" ? "bad" : "neutral"}">${item.status}</span></div><p><strong>Evidence:</strong> ${escapeHtml(item.evidence)}</p><p><strong>Remediation:</strong> ${escapeHtml(item.remediation)}</p></article>`).join("");
  }
  const history = byId("adv-compliance-history");
  if (history) history.innerHTML = advanced.complianceScans.slice(0, 10).map(item => `<div class="adv-history"><time>${escapeHtml(shortDate(item.time))}</time><span>${item.score}% · ${item.pass}P ${item.warn}W ${item.fail}F</span><small>${escapeHtml(item.actor)}</small></div>`).join("") || `<div class="adv-empty">No scans yet.</div>`;
}

function advRemediate() {
  const advanced = advState();
  advMutate("compliance.remediate", "eligible-controls", () => {
    advanced.packages.forEach(item => { if (item.security) { item.installed = item.available; item.status = "CURRENT"; } });
    state.services.forEach(item => { if (item.protected) item.state = "running"; });
    advanced.rules.forEach(item => { if (["HIGH", "CRITICAL"].includes(item.severity)) item.enabled = true; });
    state.users.forEach(item => { if (item.role.includes("Administrator")) item.mfa = true; });
  });
  advRunCompliance();
  renderAdvPackages();
  renderAdvRules();
}

function advMemoryProfile() {
  const advanced = advState();
  return advanced.memoryProfiles[String(advanced.selectedMemoryPid)] || null;
}

function advMemoryScore(profile) {
  if (!profile) return 0;
  let score = profile.anomalies.length * 18;
  if (advLower(profile.process).includes("powershell")) score += 15;
  if (advLower(profile.process).includes("rundll32")) score += 18;
  if (profile.handles.some(item => item.includes("203.0.113."))) score += 15;
  if (profile.maps.some(item => item.includes("RX PRIVATE"))) score += 20;
  return clamp(score, 0, 100);
}

function renderAdvMemory() {
  const advanced = advState();
  const root = byId("adv-memory-list");
  if (root) {
    root.innerHTML = Object.values(advanced.memoryProfiles).map(profile => `<button class="adv-list-item ${Number(advanced.selectedMemoryPid) === profile.pid ? "active" : ""}" data-adv-mem="${profile.pid}"><span><strong>PID ${profile.pid}</strong><b>${advMemoryScore(profile)}%</b></span><em>${escapeHtml(profile.process)}</em><small>${profile.threads} threads · ${profile.architecture}</small></button>`).join("");
    qsa("[data-adv-mem]", root).forEach(button => button.addEventListener("click", () => {
      advanced.selectedMemoryPid = Number(button.dataset.advMem);
      persistState();
      renderAdvMemory();
    }));
  }
  const profile = advMemoryProfile();
  const detail = byId("adv-memory-detail");
  if (detail && profile) {
    detail.innerHTML = `<div class="adv-head"><div><div class="eyebrow">PID ${profile.pid} · ${profile.architecture}</div><h2>${escapeHtml(profile.process)}</h2></div><span class="status-pill neutral">${advMemoryScore(profile)}% SUSPICION</span></div><div class="detail-grid"><div><span>Integrity</span><strong>${profile.integrity}</strong></div><div><span>Private Bytes</span><strong>${profile.privateBytes} KB</strong></div><div><span>Working Set</span><strong>${profile.workingSet} KB</strong></div><div><span>Threads</span><strong>${profile.threads}</strong></div></div><section class="adv-section"><h3>Anomalies</h3>${profile.anomalies.map(item => `<p class="adv-anomaly">${escapeHtml(item)}</p>`).join("")}</section><div class="adv-mem-grid"><section class="adv-section"><h3>Handles</h3><pre class="adv-code">${escapeHtml(profile.handles.join("\n"))}</pre></section><section class="adv-section"><h3>Modules</h3><pre class="adv-code">${escapeHtml(profile.modules.join("\n"))}</pre></section></div><section class="adv-section"><h3>Virtual Memory Map</h3><pre class="adv-code">${escapeHtml(profile.maps.join("\n"))}</pre></section><div class="adv-actions"><button id="adv-memory-evidence" class="primary-button compact">Preserve Evidence</button><button id="adv-memory-correlate" class="ghost-button compact">Correlate PID</button></div><section id="adv-memory-correlation" class="adv-section"></section>`;
    byId("adv-memory-evidence")?.addEventListener("click", () => advPreserveMemory(profile));
    byId("adv-memory-correlate")?.addEventListener("click", () => advCorrelateMemory(profile));
  }
}

function advPreserveMemory(profile) {
  const current = advSelectedCase();
  if (!current) return;
  const advanced = advState();
  advMutate("memory.evidence.preserve", current.id, () => {
    const id = advId("EVD", advanced.nextEvidence++);
    advanced.evidence.push({ id, caseId: current.id, type: "memory-profile", source: "Memory Inspector", collected: advNow(), integrity: "VERIFIED", description: `Memory profile PID ${profile.pid} ${profile.process}`, payload: JSON.stringify(profile, null, 2) });
    current.timeline.push({ time: advNow(), type: "evidence", title: "Memory profile preserved", detail: `PID ${profile.pid} ${profile.process}` });
    current.updated = advNow();
  });
  toast("Evidence preserved", `PID ${profile.pid} linked to ${current.id}`, "success");
  renderAdvCases();
}

function advCorrelateMemory(profile) {
  const process = processByPid(profile.pid);
  const connections = state.connections.filter(item => item.pid === profile.pid);
  const logs = state.logs.filter(item => advLower(item.message).includes(advLower(profile.process)) || advLower(item.message).includes(String(profile.pid)));
  const children = state.processes.filter(item => item.ppid === profile.pid);
  const root = byId("adv-memory-correlation");
  if (root) root.innerHTML = `<h3>Correlation</h3><div class="detail-grid"><div><span>Process State</span><strong>${escapeHtml(process?.status || "NOT RUNNING")}</strong></div><div><span>Connections</span><strong>${connections.length}</strong></div><div><span>Logs</span><strong>${logs.length}</strong></div><div><span>Children</span><strong>${children.length}</strong></div></div><pre class="adv-code">${escapeHtml([...connections.map(item => `NET ${item.local} -> ${item.remote}`), ...children.map(item => `CHILD ${item.pid} ${item.name}`), ...logs.slice(0, 10).map(item => `LOG ${item.time} ${item.message}`)].join("\n") || "No extra correlations.")}</pre>`;
  advAudit("memory.correlate", String(profile.pid), "SUCCESS", `${connections.length} connections / ${logs.length} logs / ${children.length} children`);
}

function renderAdvAudit() {
  const advanced = advState();
  const search = advLower(byId("adv-audit-search")?.value);
  const outcome = byId("adv-audit-outcome")?.value || "all";
  const items = advanced.audit.filter(item => (outcome === "all" || item.outcome === outcome) && (!search || advLower(item.actor + " " + item.action + " " + item.target + " " + item.detail).includes(search)));
  const root = byId("adv-audit-table");
  if (root) {
    root.innerHTML = items.slice(0, 250).map(item => `<tr data-adv-audit="${item.id}"><td>${escapeHtml(shortDate(item.time))}</td><td>${item.id}</td><td>${escapeHtml(item.actor)}</td><td>${escapeHtml(item.action)}</td><td>${escapeHtml(item.target)}</td><td>${item.outcome}</td></tr>`).join("");
    qsa("[data-adv-audit]", root).forEach(row => row.addEventListener("click", () => {
      const item = advanced.audit.find(entry => entry.id === row.dataset.advAudit);
      if (item && byId("adv-audit-detail")) byId("adv-audit-detail").textContent = JSON.stringify(item, null, 2);
    }));
  }
}

function advTerminalHelp() {
  terminalPrint("Browser OS advanced commands:", "success");
  terminalPrint("  case list | case open CASE-0001 | case note <text> | case close");
  terminalPrint("  evidence list | evidence capture <type> <description>");
  terminalPrint("  detect list | detect run [RULE] | detect enable RULE | detect disable RULE");
  terminalPrint("  intel list | intel search <text> | intel correlate | intel sighting IOC-0001");
  terminalPrint("  route show | route trace <target>");
  terminalPrint("  arp show | arp flush");
  terminalPrint("  dnsx cache | dnsx lookup <name> | dnsx flush");
  terminalPrint("  pkg list | pkg status <name> | pkg update <name> | pkg update-all");
  terminalPrint("  compliance scan | compliance list [status] | compliance remediate");
  terminalPrint("  mem inspect|handles|modules|maps <pid>");
  terminalPrint("  audit tail [count] | audit search <text>");
}

function advTerminal(raw) {
  const parts = raw.trim().split(/\s+/);
  const command = advLower(parts.shift() || "");
  const advanced = advState();
  if (command === "advanced-help") {
    advTerminalHelp();
    return true;
  }
  if (command === "case") {
    const sub = advLower(parts[0] || "list");
    if (sub === "list") advanced.cases.forEach(item => terminalPrint(`${item.id} ${item.severity} ${item.status} ${item.title}`));
    else if (sub === "open") {
      const item = advanced.cases.find(entry => entry.id === String(parts[1] || "").toUpperCase());
      if (!item) terminalPrint("case not found", "error");
      else { advanced.selectedCase = item.id; persistState(); advOpen("case-window"); terminalPrint("opened " + item.id, "success"); }
    } else if (sub === "note") {
      const current = advSelectedCase();
      const text = advText(raw.slice(raw.toLowerCase().indexOf("case note") + 9), 800);
      if (!current || !text) terminalPrint("usage: case note <text>", "error");
      else { advMutate("case.note.add", current.id, () => current.notes.push({ time: advNow(), author: state.activeUser, text })); terminalPrint("note added", "success"); }
    } else if (sub === "close") {
      const current = advSelectedCase();
      if (current && current.status !== "CLOSED") advToggleCase();
      terminalPrint(current ? current.id + " " + current.status : "no selected case");
    }
    return true;
  }
  if (command === "evidence") {
    const sub = advLower(parts[0] || "list");
    const current = advSelectedCase();
    if (sub === "list") (current ? advCaseEvidence(current.id) : advanced.evidence).forEach(item => terminalPrint(`${item.id} ${item.type} ${item.integrity} ${item.description}`));
    else if (sub === "capture") {
      if (!current) terminalPrint("no selected case", "error");
      else {
        const type = parts[1] || "note";
        const description = advText(parts.slice(2).join(" ") || "Terminal evidence", 180);
        advMutate("evidence.capture", current.id, () => {
          const id = advId("EVD", advanced.nextEvidence++);
          advanced.evidence.push({ id, caseId: current.id, type, source: "Terminal", collected: advNow(), integrity: "VERIFIED", description, payload: "Synthetic terminal evidence capture." });
        });
        terminalPrint("evidence captured", "success");
      }
    }
    return true;
  }
  if (command === "detect") {
    const sub = advLower(parts[0] || "list");
    if (sub === "list") advanced.rules.forEach(rule => terminalPrint(`${rule.id} ${rule.enabled ? "ON" : "OFF"} ${rule.severity} matches=${rule.matches} ${rule.name}`));
    else if (sub === "run") {
      const id = String(parts[1] || "").toUpperCase();
      if (!id) { advRunAllRules(); terminalPrint("detection sweep complete", "success"); }
      else {
        const rule = advanced.rules.find(item => item.id === id);
        if (!rule) terminalPrint("rule not found", "error");
        else terminalPrint(`${id}: ${advRunRule(rule, false) ? "MATCH" : "NO MATCH"}`);
      }
    } else if (sub === "enable" || sub === "disable") {
      const rule = advanced.rules.find(item => item.id === String(parts[1] || "").toUpperCase());
      if (!rule) terminalPrint("rule not found", "error");
      else { advMutate("detection." + sub, rule.id, () => { rule.enabled = sub === "enable"; }); terminalPrint(rule.id + " " + (rule.enabled ? "enabled" : "disabled")); }
    }
    return true;
  }
  if (command === "intel") {
    const sub = advLower(parts[0] || "list");
    if (sub === "list") advanced.indicators.slice(0, 100).forEach(item => terminalPrint(`${item.id} ${item.type} ${item.confidence}% ${item.status} ${item.value}`));
    else if (sub === "search") {
      const needle = advLower(parts.slice(1).join(" "));
      advanced.indicators.filter(item => advLower(item.value + " " + item.tags.join(" ") + " " + item.context).includes(needle)).slice(0, 50).forEach(item => terminalPrint(`${item.id} ${item.value} confidence=${item.confidence}% sightings=${item.sightings}`));
    } else if (sub === "correlate") { advCorrelateIntel(); terminalPrint("intel correlation complete", "success"); }
    else if (sub === "sighting") {
      const item = advanced.indicators.find(entry => entry.id === String(parts[1] || "").toUpperCase());
      if (!item) terminalPrint("indicator not found", "error");
      else { advMutate("intel.sighting", item.id, () => { item.sightings += 1; item.lastSeen = advNow(); }); terminalPrint(item.id + " sightings=" + item.sightings); }
    }
    return true;
  }
  if (command === "route") {
    const sub = advLower(parts[0] || "show");
    if (sub === "show") advanced.routes.forEach(item => terminalPrint(`${item.destination.padEnd(18)} ${item.gateway.padEnd(16)} ${item.iface.padEnd(6)} metric=${item.metric} ${item.proto}`));
    else if (sub === "trace") {
      const target = parts[1] || "203.0.113.91";
      terminalPrint(`1 192.0.2.1 ${randomInt(1,3)} ms virtual-gateway`);
      if (target.startsWith("198.51.100.") || target.startsWith("203.0.113.")) { terminalPrint(`2 198.51.100.254 ${randomInt(5,9)} ms lab-transit`); terminalPrint(`3 ${target} ${randomInt(10,18)} ms synthetic-destination`); }
      else terminalPrint("2 * * * external routing disabled", "warning");
    }
    return true;
  }
  if (command === "arp") {
    const sub = advLower(parts[0] || "show");
    if (sub === "show") advanced.arp.forEach(item => terminalPrint(`${item.ip} ${item.mac} ${item.iface} ${item.state} age=${item.age}`));
    else if (sub === "flush") { advMutate("arp.flush", "cache", () => { advanced.arp = advanced.arp.filter(item => item.ip === "192.0.2.1"); }); terminalPrint("dynamic ARP entries flushed"); }
    return true;
  }
  if (command === "dnsx") {
    const sub = advLower(parts[0] || "cache");
    if (sub === "cache") advanced.dns.forEach(item => terminalPrint(`${item.name} ${item.type} ${item.value} ttl=${item.ttl}`));
    else if (sub === "lookup") {
      const name = advLower(parts[1] || "");
      const hit = advanced.dns.find(item => item.name.toLowerCase() === name);
      terminalPrint(hit ? `${hit.name} ${hit.type} ${hit.value} ttl=${hit.ttl}` : `${name}: NXDOMAIN external recursion disabled`, hit ? "success" : "warning");
    } else if (sub === "flush") { advMutate("dns.flush", "cache", () => { advanced.dns = advanced.dns.filter(item => item.source === "static-lab"); }); terminalPrint("dynamic DNS entries flushed"); }
    return true;
  }
  if (command === "pkg") {
    const sub = advLower(parts[0] || "list");
    if (sub === "list") advanced.packages.forEach(item => terminalPrint(`${item.name.padEnd(24)} ${item.installed.padEnd(9)} -> ${item.available.padEnd(9)} ${item.status} ${item.security ? "SECURITY" : ""}`));
    else if (sub === "status") {
      const item = advanced.packages.find(entry => entry.name === parts[1]);
      terminalPrint(item ? JSON.stringify(item, null, 2) : "package not found", item ? "" : "error");
    } else if (sub === "update") {
      const item = advanced.packages.find(entry => entry.name === parts[1]);
      if (!item) terminalPrint("package not found", "error");
      else { advInstallPackage(item, false); terminalPrint(item.name + " installed=" + item.installed, "success"); }
    } else if (sub === "update-all") { advInstallAll(); terminalPrint("all available updates processed", "success"); }
    return true;
  }
  if (command === "compliance") {
    const sub = advLower(parts[0] || "scan");
    if (sub === "scan") { advRunCompliance(); terminalPrint("score=" + advComplianceScore() + "%"); }
    else if (sub === "list") {
      const filter = String(parts[1] || "").toUpperCase();
      advEvaluateControls();
      advanced.controls.filter(item => !filter || item.status === filter).forEach(item => terminalPrint(`${item.id} ${item.status} ${item.severity} ${item.title}`));
    } else if (sub === "remediate") { advRemediate(); terminalPrint("eligible controls remediated"); }
    return true;
  }
  if (command === "mem") {
    const sub = advLower(parts[0] || "inspect");
    const pid = Number(parts[1] || advanced.selectedMemoryPid);
    const profile = advanced.memoryProfiles[String(pid)];
    if (!profile) terminalPrint("no profile for pid " + pid, "error");
    else if (sub === "inspect") { terminalPrint(`PID ${pid} ${profile.process} score=${advMemoryScore(profile)}%`); profile.anomalies.forEach(item => terminalPrint("! " + item, "warning")); }
    else if (sub === "handles") profile.handles.forEach(item => terminalPrint(item));
    else if (sub === "modules") profile.modules.forEach(item => terminalPrint(item));
    else if (sub === "maps") profile.maps.forEach(item => terminalPrint(item));
    return true;
  }
  if (command === "audit") {
    const sub = advLower(parts[0] || "tail");
    if (sub === "tail") advanced.audit.slice(0, clamp(Number(parts[1] || 20), 1, 100)).forEach(item => terminalPrint(`${shortDate(item.time)} ${item.id} ${item.actor} ${item.action} ${item.target} ${item.outcome}`));
    else if (sub === "search") {
      const needle = advLower(parts.slice(1).join(" "));
      advanced.audit.filter(item => advLower(item.actor + " " + item.action + " " + item.target + " " + item.detail).includes(needle)).slice(0,50).forEach(item => terminalPrint(`${shortDate(item.time)} ${item.id} ${item.action} ${item.target} ${item.outcome}`));
    }
    return true;
  }
  return false;
}

function advInstallTerminal() {
  const core = executeTerminalCommand;
  executeTerminalCommand = function(raw) {
    if (advTerminal(raw)) return;
    if (raw.trim().toLowerCase() === "help") {
      core(raw);
      terminalPrint("");
      advTerminalHelp();
      return;
    }
    core(raw);
  };
}

function advInstallPalette() {
  const core = paletteItems;
  paletteItems = function(query) {
    const normalized = advLower(query);
    const base = core(query);
    const extra = ADVANCED_APPS.map(app => ({ id: app.id, name: app.name, type: "Advanced Application", keywords: app.keywords, run: () => advOpen(app.id) }));
    const actions = [
      { id: "adv-sweep", name: "Run advanced detection sweep", type: "Advanced Action", keywords: "detection analytics sweep", run: advRunAllRules },
      { id: "adv-scan", name: "Run compliance audit", type: "Advanced Action", keywords: "compliance baseline scan", run: () => { advOpen("compliance-window"); advRunCompliance(); } },
      { id: "adv-intel-corr", name: "Correlate threat intelligence", type: "Advanced Action", keywords: "intel ioc correlation", run: () => { advOpen("intel-window"); advCorrelateIntel(); } },
      { id: "adv-updates", name: "Open Update Center", type: "Advanced Action", keywords: "package patch updates", run: () => advOpen("package-window") }
    ];
    const all = [...extra, ...actions];
    if (!normalized) return [...base, ...all];
    return [...base, ...all.filter(item => advLower(item.name + " " + item.keywords).includes(normalized))];
  };
}

function advInstallOpenWindow() {
  const core = openWindow;
  openWindow = function(id) {
    core(id);
    if (ADVANCED_APPS.some(app => app.id === id)) advRenderApp(id);
  };
}

function advBindEvents() {
  byId("adv-case-search")?.addEventListener("input", renderAdvCases);
  byId("adv-case-new")?.addEventListener("click", advNewCase);
  byId("adv-evidence-capture")?.addEventListener("click", advCaptureEvidence);
  byId("adv-rule-search")?.addEventListener("input", renderAdvRules);
  byId("adv-detect-all")?.addEventListener("click", advRunAllRules);
  byId("adv-intel-search")?.addEventListener("input", renderAdvIntel);
  byId("adv-intel-severity")?.addEventListener("change", renderAdvIntel);
  byId("adv-intel-correlate")?.addEventListener("click", advCorrelateIntel);
  byId("adv-stack-refresh")?.addEventListener("click", renderAdvStack);
  byId("adv-package-search")?.addEventListener("input", renderAdvPackages);
  byId("adv-package-all")?.addEventListener("click", advInstallAll);
  byId("adv-compliance-scan")?.addEventListener("click", advRunCompliance);
  byId("adv-compliance-filter")?.addEventListener("change", renderAdvCompliance);
  byId("adv-compliance-remediate")?.addEventListener("click", advRemediate);
  byId("adv-audit-search")?.addEventListener("input", renderAdvAudit);
  byId("adv-audit-outcome")?.addEventListener("change", renderAdvAudit);
  byId("adv-audit-json")?.addEventListener("click", () => {
    if (byId("adv-audit-detail")) byId("adv-audit-detail").textContent = JSON.stringify(advState().audit.slice(0,100), null, 2);
  });
  qsa("[data-adv-stack]").forEach(button => button.addEventListener("click", () => {
    qsa("[data-adv-stack]").forEach(item => item.classList.toggle("active", item === button));
    renderAdvStack();
  }));
}

function advRenderAll() {
  renderAdvCases();
  renderAdvRules();
  renderAdvIntel();
  renderAdvStack();
  renderAdvPackages();
  renderAdvCompliance();
  renderAdvMemory();
  renderAdvAudit();
}

function advHeartbeat() {
  const advanced = advState();
  if (!state.booted) return;
  advanced.interfaces.forEach(item => {
    if (item.state !== "UP") return;
    item.rx += randomInt(200, 2500);
    item.tx += randomInt(180, 1800);
  });
  advanced.arp.forEach(item => {
    item.age += 5;
    if (item.age > 120) item.state = "STALE";
  });
  advanced.dns.forEach(item => {
    if (item.source !== "static-lab") item.ttl = Math.max(0, item.ttl - 5);
  });
  persistState();
  if (byId("stack-window")?.classList.contains("visible")) renderAdvStack();
}

let advTimer = null;

function advInitialize() {
  advEnsure();
  advBuildWindows();
  advBindEvents();
  advInstallTerminal();
  advInstallPalette();
  advInstallOpenWindow();
  document.title = "Browser OS 2.1 | Marc Lavoie";
  qsa(".boot-version").forEach(node => node.textContent = "Browser-Based Security Operations Environment · v2.1");
  advRenderAll();
  advAudit("advanced.ready", "Browser OS 2.1", "SUCCESS", "Eight advanced applications mounted.", "system");
  if (advTimer) window.clearInterval(advTimer);
  advTimer = window.setInterval(advHeartbeat, 5000);
}


const ADV_RULE_SEED = Object.freeze([
  {
    id: "DET-0001",
    name: "Office / Script Analytic 01",
    enabled: true,
    severity: "HIGH",
    source: "office---script",
    technique: "T1059.001",
    detector: "encoded-powershell",
    threshold: 1,
    logic: "Office parent AND powershell.exe AND encoded command",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 1,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0002",
    name: "Signed Binary Proxy Analytic 02",
    enabled: true,
    severity: "MEDIUM",
    source: "signed-binary-proxy",
    technique: "T1218.011",
    detector: "rundll32-tls",
    threshold: 1,
    logic: "rundll32.exe AND outbound TLS to lab-external documentation range",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 1,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0003",
    name: "Credential Access Analytic 03",
    enabled: true,
    severity: "HIGH",
    source: "credential-access",
    technique: "T1003",
    detector: "credential-access",
    threshold: 1,
    logic: "security event contains credential access behavior",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 1,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0004",
    name: "Defense Evasion Analytic 04",
    enabled: true,
    severity: "CRITICAL",
    source: "defense-evasion",
    technique: "T1562.001",
    detector: "service-stop",
    threshold: 1,
    logic: "protected service state is not running",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0005",
    name: "Remote Services Analytic 05",
    enabled: true,
    severity: "MEDIUM",
    source: "remote-services",
    technique: "T1021",
    detector: "remote-admin-deny",
    threshold: 1,
    logic: "firewall deny involving TCP/22 or TCP/3389",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0006",
    name: "Command and Control Analytic 06",
    enabled: true,
    severity: "HIGH",
    source: "command-and-control",
    technique: "T1071.001",
    detector: "beacon",
    threshold: 3,
    logic: "updater-like process with repeated lab-external TLS",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 1,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0007",
    name: "DNS Analytic 07",
    enabled: true,
    severity: "MEDIUM",
    source: "dns",
    technique: "T1071.004",
    detector: "nxdomain",
    threshold: 5,
    logic: "repeated NXDOMAIN observations above threshold",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0008",
    name: "Valid Accounts Analytic 08",
    enabled: true,
    severity: "HIGH",
    source: "valid-accounts",
    technique: "T1078",
    detector: "priv-session",
    threshold: 1,
    logic: "administrator session active while MFA assurance is false",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0009",
    name: "Resource Abuse Analytic 09",
    enabled: true,
    severity: "MEDIUM",
    source: "resource-abuse",
    technique: "T1496",
    detector: "high-cpu",
    threshold: 20,
    logic: "process CPU exceeds analytic threshold",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0010",
    name: "Network Anomaly Analytic 10",
    enabled: true,
    severity: "MEDIUM",
    source: "network-anomaly",
    technique: "T1041",
    detector: "external-flow",
    threshold: 1,
    logic: "connection destination belongs to 203.0.113.0/24",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 1,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0011",
    name: "Office / Script Analytic 11",
    enabled: true,
    severity: "HIGH",
    source: "office---script",
    technique: "T1059.001",
    detector: "encoded-powershell",
    threshold: 1,
    logic: "Office parent AND powershell.exe AND encoded command",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0012",
    name: "Signed Binary Proxy Analytic 12",
    enabled: true,
    severity: "MEDIUM",
    source: "signed-binary-proxy",
    technique: "T1218.011",
    detector: "rundll32-tls",
    threshold: 1,
    logic: "rundll32.exe AND outbound TLS to lab-external documentation range",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0013",
    name: "Credential Access Analytic 13",
    enabled: false,
    severity: "HIGH",
    source: "credential-access",
    technique: "T1003",
    detector: "credential-access",
    threshold: 1,
    logic: "security event contains credential access behavior",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0014",
    name: "Defense Evasion Analytic 14",
    enabled: true,
    severity: "CRITICAL",
    source: "defense-evasion",
    technique: "T1562.001",
    detector: "service-stop",
    threshold: 1,
    logic: "protected service state is not running",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0015",
    name: "Remote Services Analytic 15",
    enabled: true,
    severity: "MEDIUM",
    source: "remote-services",
    technique: "T1021",
    detector: "remote-admin-deny",
    threshold: 1,
    logic: "firewall deny involving TCP/22 or TCP/3389",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0016",
    name: "Command and Control Analytic 16",
    enabled: true,
    severity: "HIGH",
    source: "command-and-control",
    technique: "T1071.001",
    detector: "beacon",
    threshold: 3,
    logic: "updater-like process with repeated lab-external TLS",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0017",
    name: "DNS Analytic 17",
    enabled: true,
    severity: "MEDIUM",
    source: "dns",
    technique: "T1071.004",
    detector: "nxdomain",
    threshold: 5,
    logic: "repeated NXDOMAIN observations above threshold",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0018",
    name: "Valid Accounts Analytic 18",
    enabled: true,
    severity: "HIGH",
    source: "valid-accounts",
    technique: "T1078",
    detector: "priv-session",
    threshold: 1,
    logic: "administrator session active while MFA assurance is false",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0019",
    name: "Resource Abuse Analytic 19",
    enabled: true,
    severity: "MEDIUM",
    source: "resource-abuse",
    technique: "T1496",
    detector: "high-cpu",
    threshold: 20,
    logic: "process CPU exceeds analytic threshold",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0020",
    name: "Network Anomaly Analytic 20",
    enabled: true,
    severity: "MEDIUM",
    source: "network-anomaly",
    technique: "T1041",
    detector: "external-flow",
    threshold: 1,
    logic: "connection destination belongs to 203.0.113.0/24",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0021",
    name: "Office / Script Analytic 21",
    enabled: true,
    severity: "HIGH",
    source: "office---script",
    technique: "T1059.001",
    detector: "encoded-powershell",
    threshold: 1,
    logic: "Office parent AND powershell.exe AND encoded command",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0022",
    name: "Signed Binary Proxy Analytic 22",
    enabled: true,
    severity: "MEDIUM",
    source: "signed-binary-proxy",
    technique: "T1218.011",
    detector: "rundll32-tls",
    threshold: 1,
    logic: "rundll32.exe AND outbound TLS to lab-external documentation range",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0023",
    name: "Credential Access Analytic 23",
    enabled: true,
    severity: "HIGH",
    source: "credential-access",
    technique: "T1003",
    detector: "credential-access",
    threshold: 1,
    logic: "security event contains credential access behavior",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0024",
    name: "Defense Evasion Analytic 24",
    enabled: true,
    severity: "CRITICAL",
    source: "defense-evasion",
    technique: "T1562.001",
    detector: "service-stop",
    threshold: 1,
    logic: "protected service state is not running",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0025",
    name: "Remote Services Analytic 25",
    enabled: true,
    severity: "MEDIUM",
    source: "remote-services",
    technique: "T1021",
    detector: "remote-admin-deny",
    threshold: 1,
    logic: "firewall deny involving TCP/22 or TCP/3389",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0026",
    name: "Command and Control Analytic 26",
    enabled: false,
    severity: "HIGH",
    source: "command-and-control",
    technique: "T1071.001",
    detector: "beacon",
    threshold: 3,
    logic: "updater-like process with repeated lab-external TLS",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0027",
    name: "DNS Analytic 27",
    enabled: true,
    severity: "MEDIUM",
    source: "dns",
    technique: "T1071.004",
    detector: "nxdomain",
    threshold: 5,
    logic: "repeated NXDOMAIN observations above threshold",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0028",
    name: "Valid Accounts Analytic 28",
    enabled: true,
    severity: "HIGH",
    source: "valid-accounts",
    technique: "T1078",
    detector: "priv-session",
    threshold: 1,
    logic: "administrator session active while MFA assurance is false",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0029",
    name: "Resource Abuse Analytic 29",
    enabled: true,
    severity: "MEDIUM",
    source: "resource-abuse",
    technique: "T1496",
    detector: "high-cpu",
    threshold: 20,
    logic: "process CPU exceeds analytic threshold",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0030",
    name: "Network Anomaly Analytic 30",
    enabled: true,
    severity: "MEDIUM",
    source: "network-anomaly",
    technique: "T1041",
    detector: "external-flow",
    threshold: 1,
    logic: "connection destination belongs to 203.0.113.0/24",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0031",
    name: "Office / Script Analytic 31",
    enabled: true,
    severity: "HIGH",
    source: "office---script",
    technique: "T1059.001",
    detector: "encoded-powershell",
    threshold: 1,
    logic: "Office parent AND powershell.exe AND encoded command",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0032",
    name: "Signed Binary Proxy Analytic 32",
    enabled: true,
    severity: "MEDIUM",
    source: "signed-binary-proxy",
    technique: "T1218.011",
    detector: "rundll32-tls",
    threshold: 1,
    logic: "rundll32.exe AND outbound TLS to lab-external documentation range",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0033",
    name: "Credential Access Analytic 33",
    enabled: true,
    severity: "HIGH",
    source: "credential-access",
    technique: "T1003",
    detector: "credential-access",
    threshold: 1,
    logic: "security event contains credential access behavior",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0034",
    name: "Defense Evasion Analytic 34",
    enabled: true,
    severity: "CRITICAL",
    source: "defense-evasion",
    technique: "T1562.001",
    detector: "service-stop",
    threshold: 1,
    logic: "protected service state is not running",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0035",
    name: "Remote Services Analytic 35",
    enabled: true,
    severity: "MEDIUM",
    source: "remote-services",
    technique: "T1021",
    detector: "remote-admin-deny",
    threshold: 1,
    logic: "firewall deny involving TCP/22 or TCP/3389",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0036",
    name: "Command and Control Analytic 36",
    enabled: true,
    severity: "HIGH",
    source: "command-and-control",
    technique: "T1071.001",
    detector: "beacon",
    threshold: 3,
    logic: "updater-like process with repeated lab-external TLS",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0037",
    name: "DNS Analytic 37",
    enabled: true,
    severity: "MEDIUM",
    source: "dns",
    technique: "T1071.004",
    detector: "nxdomain",
    threshold: 5,
    logic: "repeated NXDOMAIN observations above threshold",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0038",
    name: "Valid Accounts Analytic 38",
    enabled: true,
    severity: "HIGH",
    source: "valid-accounts",
    technique: "T1078",
    detector: "priv-session",
    threshold: 1,
    logic: "administrator session active while MFA assurance is false",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0039",
    name: "Resource Abuse Analytic 39",
    enabled: false,
    severity: "MEDIUM",
    source: "resource-abuse",
    technique: "T1496",
    detector: "high-cpu",
    threshold: 20,
    logic: "process CPU exceeds analytic threshold",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0040",
    name: "Network Anomaly Analytic 40",
    enabled: true,
    severity: "MEDIUM",
    source: "network-anomaly",
    technique: "T1041",
    detector: "external-flow",
    threshold: 1,
    logic: "connection destination belongs to 203.0.113.0/24",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0041",
    name: "Office / Script Analytic 41",
    enabled: true,
    severity: "HIGH",
    source: "office---script",
    technique: "T1059.001",
    detector: "encoded-powershell",
    threshold: 1,
    logic: "Office parent AND powershell.exe AND encoded command",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0042",
    name: "Signed Binary Proxy Analytic 42",
    enabled: true,
    severity: "MEDIUM",
    source: "signed-binary-proxy",
    technique: "T1218.011",
    detector: "rundll32-tls",
    threshold: 1,
    logic: "rundll32.exe AND outbound TLS to lab-external documentation range",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0043",
    name: "Credential Access Analytic 43",
    enabled: true,
    severity: "HIGH",
    source: "credential-access",
    technique: "T1003",
    detector: "credential-access",
    threshold: 1,
    logic: "security event contains credential access behavior",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0044",
    name: "Defense Evasion Analytic 44",
    enabled: true,
    severity: "CRITICAL",
    source: "defense-evasion",
    technique: "T1562.001",
    detector: "service-stop",
    threshold: 1,
    logic: "protected service state is not running",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0045",
    name: "Remote Services Analytic 45",
    enabled: true,
    severity: "MEDIUM",
    source: "remote-services",
    technique: "T1021",
    detector: "remote-admin-deny",
    threshold: 1,
    logic: "firewall deny involving TCP/22 or TCP/3389",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0046",
    name: "Command and Control Analytic 46",
    enabled: true,
    severity: "HIGH",
    source: "command-and-control",
    technique: "T1071.001",
    detector: "beacon",
    threshold: 3,
    logic: "updater-like process with repeated lab-external TLS",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0047",
    name: "DNS Analytic 47",
    enabled: true,
    severity: "MEDIUM",
    source: "dns",
    technique: "T1071.004",
    detector: "nxdomain",
    threshold: 5,
    logic: "repeated NXDOMAIN observations above threshold",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0048",
    name: "Valid Accounts Analytic 48",
    enabled: true,
    severity: "HIGH",
    source: "valid-accounts",
    technique: "T1078",
    detector: "priv-session",
    threshold: 1,
    logic: "administrator session active while MFA assurance is false",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0049",
    name: "Resource Abuse Analytic 49",
    enabled: true,
    severity: "MEDIUM",
    source: "resource-abuse",
    technique: "T1496",
    detector: "high-cpu",
    threshold: 20,
    logic: "process CPU exceeds analytic threshold",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0050",
    name: "Network Anomaly Analytic 50",
    enabled: true,
    severity: "MEDIUM",
    source: "network-anomaly",
    technique: "T1041",
    detector: "external-flow",
    threshold: 1,
    logic: "connection destination belongs to 203.0.113.0/24",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0051",
    name: "Office / Script Analytic 51",
    enabled: true,
    severity: "HIGH",
    source: "office---script",
    technique: "T1059.001",
    detector: "encoded-powershell",
    threshold: 1,
    logic: "Office parent AND powershell.exe AND encoded command",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0052",
    name: "Signed Binary Proxy Analytic 52",
    enabled: false,
    severity: "MEDIUM",
    source: "signed-binary-proxy",
    technique: "T1218.011",
    detector: "rundll32-tls",
    threshold: 1,
    logic: "rundll32.exe AND outbound TLS to lab-external documentation range",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0053",
    name: "Credential Access Analytic 53",
    enabled: true,
    severity: "HIGH",
    source: "credential-access",
    technique: "T1003",
    detector: "credential-access",
    threshold: 1,
    logic: "security event contains credential access behavior",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0054",
    name: "Defense Evasion Analytic 54",
    enabled: true,
    severity: "CRITICAL",
    source: "defense-evasion",
    technique: "T1562.001",
    detector: "service-stop",
    threshold: 1,
    logic: "protected service state is not running",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0055",
    name: "Remote Services Analytic 55",
    enabled: true,
    severity: "MEDIUM",
    source: "remote-services",
    technique: "T1021",
    detector: "remote-admin-deny",
    threshold: 1,
    logic: "firewall deny involving TCP/22 or TCP/3389",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0056",
    name: "Command and Control Analytic 56",
    enabled: true,
    severity: "HIGH",
    source: "command-and-control",
    technique: "T1071.001",
    detector: "beacon",
    threshold: 3,
    logic: "updater-like process with repeated lab-external TLS",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0057",
    name: "DNS Analytic 57",
    enabled: true,
    severity: "MEDIUM",
    source: "dns",
    technique: "T1071.004",
    detector: "nxdomain",
    threshold: 5,
    logic: "repeated NXDOMAIN observations above threshold",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0058",
    name: "Valid Accounts Analytic 58",
    enabled: true,
    severity: "HIGH",
    source: "valid-accounts",
    technique: "T1078",
    detector: "priv-session",
    threshold: 1,
    logic: "administrator session active while MFA assurance is false",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0059",
    name: "Resource Abuse Analytic 59",
    enabled: true,
    severity: "MEDIUM",
    source: "resource-abuse",
    technique: "T1496",
    detector: "high-cpu",
    threshold: 20,
    logic: "process CPU exceeds analytic threshold",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
  {
    id: "DET-0060",
    name: "Network Anomaly Analytic 60",
    enabled: true,
    severity: "MEDIUM",
    source: "network-anomaly",
    technique: "T1041",
    detector: "external-flow",
    threshold: 1,
    logic: "connection destination belongs to 203.0.113.0/24",
    falsePositive: "Synthetic benign activity can resemble this behavior; validate parentage, signer, user, destination, and timing.",
    tuning: "Correlate at least two independent telemetry dimensions before promoting to a high-confidence incident.",
    matches: 0,
    lastRun: "2026-09-03T22:00:00Z"
  },
]);

const ADV_IOC_SEED = Object.freeze([
  {
    id: "IOC-0001",
    type: "ipv4",
    value: "203.0.113.4",
    confidence: 47,
    severity: "MEDIUM",
    status: "MONITOR",
    firstSeen: "2026-09-03T17:01:00Z",
    lastSeen: "2026-09-03T22:01:00Z",
    sightings: 3,
    tags: ["synthetic", "training", "set-01"],
    context: "Local Browser OS synthetic intelligence object 01; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0002",
    type: "domain",
    value: "signal-02.example",
    confidence: 54,
    severity: "CONTEXTUAL",
    status: "DUAL-USE",
    firstSeen: "2026-09-03T17:02:00Z",
    lastSeen: "2026-09-03T22:02:00Z",
    sightings: 6,
    tags: ["synthetic", "training", "set-01"],
    context: "Local Browser OS synthetic intelligence object 02; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0003",
    type: "process",
    value: "powershell.exe",
    confidence: 61,
    severity: "BENIGN",
    status: "ALLOWLISTED",
    firstSeen: "2026-09-03T17:03:00Z",
    lastSeen: "2026-09-03T22:03:00Z",
    sightings: 9,
    tags: ["synthetic", "training", "set-01"],
    context: "Local Browser OS synthetic intelligence object 03; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0004",
    type: "hash",
    value: "synthetic00047bbc",
    confidence: 68,
    severity: "HIGH",
    status: "LAB-SUSPICIOUS",
    firstSeen: "2026-09-03T17:04:00Z",
    lastSeen: "2026-09-03T22:04:00Z",
    sightings: 12,
    tags: ["synthetic", "training", "set-01"],
    context: "Local Browser OS synthetic intelligence object 04; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0005",
    type: "ipv4",
    value: "203.0.113.16",
    confidence: 75,
    severity: "MEDIUM",
    status: "MONITOR",
    firstSeen: "2026-09-03T17:05:00Z",
    lastSeen: "2026-09-03T22:05:00Z",
    sightings: 15,
    tags: ["synthetic", "training", "set-01"],
    context: "Local Browser OS synthetic intelligence object 05; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0006",
    type: "domain",
    value: "signal-06.example",
    confidence: 82,
    severity: "CONTEXTUAL",
    status: "DUAL-USE",
    firstSeen: "2026-09-03T17:06:00Z",
    lastSeen: "2026-09-03T22:06:00Z",
    sightings: 1,
    tags: ["synthetic", "training", "set-01"],
    context: "Local Browser OS synthetic intelligence object 06; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0007",
    type: "process",
    value: "rundll32.exe",
    confidence: 89,
    severity: "BENIGN",
    status: "ALLOWLISTED",
    firstSeen: "2026-09-03T17:07:00Z",
    lastSeen: "2026-09-03T22:07:00Z",
    sightings: 4,
    tags: ["synthetic", "training", "set-01"],
    context: "Local Browser OS synthetic intelligence object 07; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0008",
    type: "hash",
    value: "synthetic0008f778",
    confidence: 96,
    severity: "HIGH",
    status: "LAB-SUSPICIOUS",
    firstSeen: "2026-09-03T17:08:00Z",
    lastSeen: "2026-09-03T22:08:00Z",
    sightings: 7,
    tags: ["synthetic", "training", "set-01"],
    context: "Local Browser OS synthetic intelligence object 08; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0009",
    type: "ipv4",
    value: "203.0.113.28",
    confidence: 45,
    severity: "MEDIUM",
    status: "MONITOR",
    firstSeen: "2026-09-03T17:09:00Z",
    lastSeen: "2026-09-03T22:09:00Z",
    sightings: 10,
    tags: ["synthetic", "training", "set-01"],
    context: "Local Browser OS synthetic intelligence object 09; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0010",
    type: "domain",
    value: "signal-10.example",
    confidence: 52,
    severity: "CONTEXTUAL",
    status: "DUAL-USE",
    firstSeen: "2026-09-03T17:10:00Z",
    lastSeen: "2026-09-03T22:10:00Z",
    sightings: 13,
    tags: ["synthetic", "training", "set-01"],
    context: "Local Browser OS synthetic intelligence object 10; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0011",
    type: "process",
    value: "updater.exe",
    confidence: 59,
    severity: "BENIGN",
    status: "ALLOWLISTED",
    firstSeen: "2026-09-03T17:11:00Z",
    lastSeen: "2026-09-03T22:11:00Z",
    sightings: 16,
    tags: ["synthetic", "training", "set-02"],
    context: "Local Browser OS synthetic intelligence object 11; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0012",
    type: "hash",
    value: "synthetic000c7335",
    confidence: 66,
    severity: "HIGH",
    status: "LAB-SUSPICIOUS",
    firstSeen: "2026-09-03T17:12:00Z",
    lastSeen: "2026-09-03T22:12:00Z",
    sightings: 2,
    tags: ["synthetic", "training", "set-02"],
    context: "Local Browser OS synthetic intelligence object 12; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0013",
    type: "ipv4",
    value: "203.0.113.40",
    confidence: 73,
    severity: "MEDIUM",
    status: "MONITOR",
    firstSeen: "2026-09-03T17:13:00Z",
    lastSeen: "2026-09-03T22:13:00Z",
    sightings: 5,
    tags: ["synthetic", "training", "set-02"],
    context: "Local Browser OS synthetic intelligence object 13; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0014",
    type: "domain",
    value: "signal-14.example",
    confidence: 80,
    severity: "CONTEXTUAL",
    status: "DUAL-USE",
    firstSeen: "2026-09-03T17:14:00Z",
    lastSeen: "2026-09-03T22:14:00Z",
    sightings: 8,
    tags: ["synthetic", "training", "set-02"],
    context: "Local Browser OS synthetic intelligence object 14; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0015",
    type: "process",
    value: "WINWORD.EXE",
    confidence: 87,
    severity: "BENIGN",
    status: "ALLOWLISTED",
    firstSeen: "2026-09-03T17:15:00Z",
    lastSeen: "2026-09-03T22:15:00Z",
    sightings: 11,
    tags: ["synthetic", "training", "set-02"],
    context: "Local Browser OS synthetic intelligence object 15; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0016",
    type: "hash",
    value: "synthetic0010eef1",
    confidence: 94,
    severity: "HIGH",
    status: "LAB-SUSPICIOUS",
    firstSeen: "2026-09-03T17:16:00Z",
    lastSeen: "2026-09-03T22:16:00Z",
    sightings: 14,
    tags: ["synthetic", "training", "set-02"],
    context: "Local Browser OS synthetic intelligence object 16; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0017",
    type: "ipv4",
    value: "203.0.113.52",
    confidence: 43,
    severity: "MEDIUM",
    status: "MONITOR",
    firstSeen: "2026-09-03T17:17:00Z",
    lastSeen: "2026-09-03T22:17:00Z",
    sightings: 0,
    tags: ["synthetic", "training", "set-02"],
    context: "Local Browser OS synthetic intelligence object 17; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0018",
    type: "domain",
    value: "signal-18.example",
    confidence: 50,
    severity: "CONTEXTUAL",
    status: "DUAL-USE",
    firstSeen: "2026-09-03T17:18:00Z",
    lastSeen: "2026-09-03T22:18:00Z",
    sightings: 3,
    tags: ["synthetic", "training", "set-02"],
    context: "Local Browser OS synthetic intelligence object 18; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0019",
    type: "process",
    value: "wscript.exe",
    confidence: 57,
    severity: "BENIGN",
    status: "ALLOWLISTED",
    firstSeen: "2026-09-03T17:19:00Z",
    lastSeen: "2026-09-03T22:19:00Z",
    sightings: 6,
    tags: ["synthetic", "training", "set-02"],
    context: "Local Browser OS synthetic intelligence object 19; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0020",
    type: "hash",
    value: "synthetic00146aae",
    confidence: 64,
    severity: "HIGH",
    status: "LAB-SUSPICIOUS",
    firstSeen: "2026-09-03T17:20:00Z",
    lastSeen: "2026-09-03T22:20:00Z",
    sightings: 9,
    tags: ["synthetic", "training", "set-02"],
    context: "Local Browser OS synthetic intelligence object 20; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0021",
    type: "ipv4",
    value: "203.0.113.64",
    confidence: 71,
    severity: "MEDIUM",
    status: "MONITOR",
    firstSeen: "2026-09-03T17:21:00Z",
    lastSeen: "2026-09-03T22:21:00Z",
    sightings: 12,
    tags: ["synthetic", "training", "set-03"],
    context: "Local Browser OS synthetic intelligence object 21; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0022",
    type: "domain",
    value: "signal-22.example",
    confidence: 78,
    severity: "CONTEXTUAL",
    status: "DUAL-USE",
    firstSeen: "2026-09-03T17:22:00Z",
    lastSeen: "2026-09-03T22:22:00Z",
    sightings: 15,
    tags: ["synthetic", "training", "set-03"],
    context: "Local Browser OS synthetic intelligence object 22; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0023",
    type: "process",
    value: "powershell.exe",
    confidence: 85,
    severity: "BENIGN",
    status: "ALLOWLISTED",
    firstSeen: "2026-09-03T17:23:00Z",
    lastSeen: "2026-09-03T22:23:00Z",
    sightings: 1,
    tags: ["synthetic", "training", "set-03"],
    context: "Local Browser OS synthetic intelligence object 23; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0024",
    type: "hash",
    value: "synthetic0018e66a",
    confidence: 92,
    severity: "HIGH",
    status: "LAB-SUSPICIOUS",
    firstSeen: "2026-09-03T17:24:00Z",
    lastSeen: "2026-09-03T22:24:00Z",
    sightings: 4,
    tags: ["synthetic", "training", "set-03"],
    context: "Local Browser OS synthetic intelligence object 24; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0025",
    type: "ipv4",
    value: "203.0.113.76",
    confidence: 41,
    severity: "MEDIUM",
    status: "MONITOR",
    firstSeen: "2026-09-03T17:25:00Z",
    lastSeen: "2026-09-03T22:25:00Z",
    sightings: 7,
    tags: ["synthetic", "training", "set-03"],
    context: "Local Browser OS synthetic intelligence object 25; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0026",
    type: "domain",
    value: "signal-26.example",
    confidence: 48,
    severity: "CONTEXTUAL",
    status: "DUAL-USE",
    firstSeen: "2026-09-03T17:26:00Z",
    lastSeen: "2026-09-03T22:26:00Z",
    sightings: 10,
    tags: ["synthetic", "training", "set-03"],
    context: "Local Browser OS synthetic intelligence object 26; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0027",
    type: "process",
    value: "rundll32.exe",
    confidence: 55,
    severity: "BENIGN",
    status: "ALLOWLISTED",
    firstSeen: "2026-09-03T17:27:00Z",
    lastSeen: "2026-09-03T22:27:00Z",
    sightings: 13,
    tags: ["synthetic", "training", "set-03"],
    context: "Local Browser OS synthetic intelligence object 27; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0028",
    type: "hash",
    value: "synthetic001c6227",
    confidence: 62,
    severity: "HIGH",
    status: "LAB-SUSPICIOUS",
    firstSeen: "2026-09-03T17:28:00Z",
    lastSeen: "2026-09-03T22:28:00Z",
    sightings: 16,
    tags: ["synthetic", "training", "set-03"],
    context: "Local Browser OS synthetic intelligence object 28; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0029",
    type: "ipv4",
    value: "203.0.113.88",
    confidence: 69,
    severity: "MEDIUM",
    status: "MONITOR",
    firstSeen: "2026-09-03T17:29:00Z",
    lastSeen: "2026-09-03T22:29:00Z",
    sightings: 2,
    tags: ["synthetic", "training", "set-03"],
    context: "Local Browser OS synthetic intelligence object 29; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0030",
    type: "domain",
    value: "signal-30.example",
    confidence: 76,
    severity: "CONTEXTUAL",
    status: "DUAL-USE",
    firstSeen: "2026-09-03T17:30:00Z",
    lastSeen: "2026-09-03T22:30:00Z",
    sightings: 5,
    tags: ["synthetic", "training", "set-03"],
    context: "Local Browser OS synthetic intelligence object 30; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0031",
    type: "process",
    value: "updater.exe",
    confidence: 83,
    severity: "BENIGN",
    status: "ALLOWLISTED",
    firstSeen: "2026-09-03T17:31:00Z",
    lastSeen: "2026-09-03T22:31:00Z",
    sightings: 8,
    tags: ["synthetic", "training", "set-04"],
    context: "Local Browser OS synthetic intelligence object 31; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0032",
    type: "hash",
    value: "synthetic0020dde3",
    confidence: 90,
    severity: "HIGH",
    status: "LAB-SUSPICIOUS",
    firstSeen: "2026-09-03T17:32:00Z",
    lastSeen: "2026-09-03T22:32:00Z",
    sightings: 11,
    tags: ["synthetic", "training", "set-04"],
    context: "Local Browser OS synthetic intelligence object 32; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0033",
    type: "ipv4",
    value: "203.0.113.100",
    confidence: 97,
    severity: "MEDIUM",
    status: "MONITOR",
    firstSeen: "2026-09-03T17:33:00Z",
    lastSeen: "2026-09-03T22:33:00Z",
    sightings: 14,
    tags: ["synthetic", "training", "set-04"],
    context: "Local Browser OS synthetic intelligence object 33; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0034",
    type: "domain",
    value: "signal-34.example",
    confidence: 46,
    severity: "CONTEXTUAL",
    status: "DUAL-USE",
    firstSeen: "2026-09-03T17:34:00Z",
    lastSeen: "2026-09-03T22:34:00Z",
    sightings: 0,
    tags: ["synthetic", "training", "set-04"],
    context: "Local Browser OS synthetic intelligence object 34; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0035",
    type: "process",
    value: "WINWORD.EXE",
    confidence: 53,
    severity: "BENIGN",
    status: "ALLOWLISTED",
    firstSeen: "2026-09-03T17:35:00Z",
    lastSeen: "2026-09-03T22:35:00Z",
    sightings: 3,
    tags: ["synthetic", "training", "set-04"],
    context: "Local Browser OS synthetic intelligence object 35; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0036",
    type: "hash",
    value: "synthetic002459a0",
    confidence: 60,
    severity: "HIGH",
    status: "LAB-SUSPICIOUS",
    firstSeen: "2026-09-03T17:36:00Z",
    lastSeen: "2026-09-03T22:36:00Z",
    sightings: 6,
    tags: ["synthetic", "training", "set-04"],
    context: "Local Browser OS synthetic intelligence object 36; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0037",
    type: "ipv4",
    value: "203.0.113.112",
    confidence: 67,
    severity: "MEDIUM",
    status: "MONITOR",
    firstSeen: "2026-09-03T17:37:00Z",
    lastSeen: "2026-09-03T22:37:00Z",
    sightings: 9,
    tags: ["synthetic", "training", "set-04"],
    context: "Local Browser OS synthetic intelligence object 37; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0038",
    type: "domain",
    value: "signal-38.example",
    confidence: 74,
    severity: "CONTEXTUAL",
    status: "DUAL-USE",
    firstSeen: "2026-09-03T17:38:00Z",
    lastSeen: "2026-09-03T22:38:00Z",
    sightings: 12,
    tags: ["synthetic", "training", "set-04"],
    context: "Local Browser OS synthetic intelligence object 38; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0039",
    type: "process",
    value: "wscript.exe",
    confidence: 81,
    severity: "BENIGN",
    status: "ALLOWLISTED",
    firstSeen: "2026-09-03T17:39:00Z",
    lastSeen: "2026-09-03T22:39:00Z",
    sightings: 15,
    tags: ["synthetic", "training", "set-04"],
    context: "Local Browser OS synthetic intelligence object 39; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0040",
    type: "hash",
    value: "synthetic0028d55c",
    confidence: 88,
    severity: "HIGH",
    status: "LAB-SUSPICIOUS",
    firstSeen: "2026-09-03T17:40:00Z",
    lastSeen: "2026-09-03T22:40:00Z",
    sightings: 1,
    tags: ["synthetic", "training", "set-04"],
    context: "Local Browser OS synthetic intelligence object 40; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0041",
    type: "ipv4",
    value: "203.0.113.124",
    confidence: 95,
    severity: "MEDIUM",
    status: "MONITOR",
    firstSeen: "2026-09-03T17:41:00Z",
    lastSeen: "2026-09-03T22:41:00Z",
    sightings: 4,
    tags: ["synthetic", "training", "set-05"],
    context: "Local Browser OS synthetic intelligence object 41; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0042",
    type: "domain",
    value: "signal-42.example",
    confidence: 44,
    severity: "CONTEXTUAL",
    status: "DUAL-USE",
    firstSeen: "2026-09-03T17:42:00Z",
    lastSeen: "2026-09-03T22:42:00Z",
    sightings: 7,
    tags: ["synthetic", "training", "set-05"],
    context: "Local Browser OS synthetic intelligence object 42; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0043",
    type: "process",
    value: "powershell.exe",
    confidence: 51,
    severity: "BENIGN",
    status: "ALLOWLISTED",
    firstSeen: "2026-09-03T17:43:00Z",
    lastSeen: "2026-09-03T22:43:00Z",
    sightings: 10,
    tags: ["synthetic", "training", "set-05"],
    context: "Local Browser OS synthetic intelligence object 43; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0044",
    type: "hash",
    value: "synthetic002c5119",
    confidence: 58,
    severity: "HIGH",
    status: "LAB-SUSPICIOUS",
    firstSeen: "2026-09-03T17:44:00Z",
    lastSeen: "2026-09-03T22:44:00Z",
    sightings: 13,
    tags: ["synthetic", "training", "set-05"],
    context: "Local Browser OS synthetic intelligence object 44; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0045",
    type: "ipv4",
    value: "203.0.113.136",
    confidence: 65,
    severity: "MEDIUM",
    status: "MONITOR",
    firstSeen: "2026-09-03T17:45:00Z",
    lastSeen: "2026-09-03T22:45:00Z",
    sightings: 16,
    tags: ["synthetic", "training", "set-05"],
    context: "Local Browser OS synthetic intelligence object 45; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0046",
    type: "domain",
    value: "signal-46.example",
    confidence: 72,
    severity: "CONTEXTUAL",
    status: "DUAL-USE",
    firstSeen: "2026-09-03T17:46:00Z",
    lastSeen: "2026-09-03T22:46:00Z",
    sightings: 2,
    tags: ["synthetic", "training", "set-05"],
    context: "Local Browser OS synthetic intelligence object 46; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0047",
    type: "process",
    value: "rundll32.exe",
    confidence: 79,
    severity: "BENIGN",
    status: "ALLOWLISTED",
    firstSeen: "2026-09-03T17:47:00Z",
    lastSeen: "2026-09-03T22:47:00Z",
    sightings: 5,
    tags: ["synthetic", "training", "set-05"],
    context: "Local Browser OS synthetic intelligence object 47; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0048",
    type: "hash",
    value: "synthetic0030ccd5",
    confidence: 86,
    severity: "HIGH",
    status: "LAB-SUSPICIOUS",
    firstSeen: "2026-09-03T17:48:00Z",
    lastSeen: "2026-09-03T22:48:00Z",
    sightings: 8,
    tags: ["synthetic", "training", "set-05"],
    context: "Local Browser OS synthetic intelligence object 48; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0049",
    type: "ipv4",
    value: "203.0.113.148",
    confidence: 93,
    severity: "MEDIUM",
    status: "MONITOR",
    firstSeen: "2026-09-03T17:49:00Z",
    lastSeen: "2026-09-03T22:49:00Z",
    sightings: 11,
    tags: ["synthetic", "training", "set-05"],
    context: "Local Browser OS synthetic intelligence object 49; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0050",
    type: "domain",
    value: "signal-50.example",
    confidence: 42,
    severity: "CONTEXTUAL",
    status: "DUAL-USE",
    firstSeen: "2026-09-03T17:00:00Z",
    lastSeen: "2026-09-03T22:00:00Z",
    sightings: 14,
    tags: ["synthetic", "training", "set-05"],
    context: "Local Browser OS synthetic intelligence object 50; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0051",
    type: "process",
    value: "updater.exe",
    confidence: 49,
    severity: "BENIGN",
    status: "ALLOWLISTED",
    firstSeen: "2026-09-03T17:01:00Z",
    lastSeen: "2026-09-03T22:01:00Z",
    sightings: 0,
    tags: ["synthetic", "training", "set-06"],
    context: "Local Browser OS synthetic intelligence object 51; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0052",
    type: "hash",
    value: "synthetic00344892",
    confidence: 56,
    severity: "HIGH",
    status: "LAB-SUSPICIOUS",
    firstSeen: "2026-09-03T17:02:00Z",
    lastSeen: "2026-09-03T22:02:00Z",
    sightings: 3,
    tags: ["synthetic", "training", "set-06"],
    context: "Local Browser OS synthetic intelligence object 52; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0053",
    type: "ipv4",
    value: "203.0.113.160",
    confidence: 63,
    severity: "MEDIUM",
    status: "MONITOR",
    firstSeen: "2026-09-03T17:03:00Z",
    lastSeen: "2026-09-03T22:03:00Z",
    sightings: 6,
    tags: ["synthetic", "training", "set-06"],
    context: "Local Browser OS synthetic intelligence object 53; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0054",
    type: "domain",
    value: "signal-54.example",
    confidence: 70,
    severity: "CONTEXTUAL",
    status: "DUAL-USE",
    firstSeen: "2026-09-03T17:04:00Z",
    lastSeen: "2026-09-03T22:04:00Z",
    sightings: 9,
    tags: ["synthetic", "training", "set-06"],
    context: "Local Browser OS synthetic intelligence object 54; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0055",
    type: "process",
    value: "WINWORD.EXE",
    confidence: 77,
    severity: "BENIGN",
    status: "ALLOWLISTED",
    firstSeen: "2026-09-03T17:05:00Z",
    lastSeen: "2026-09-03T22:05:00Z",
    sightings: 12,
    tags: ["synthetic", "training", "set-06"],
    context: "Local Browser OS synthetic intelligence object 55; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0056",
    type: "hash",
    value: "synthetic0038c44e",
    confidence: 84,
    severity: "HIGH",
    status: "LAB-SUSPICIOUS",
    firstSeen: "2026-09-03T17:06:00Z",
    lastSeen: "2026-09-03T22:06:00Z",
    sightings: 15,
    tags: ["synthetic", "training", "set-06"],
    context: "Local Browser OS synthetic intelligence object 56; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0057",
    type: "ipv4",
    value: "203.0.113.172",
    confidence: 91,
    severity: "MEDIUM",
    status: "MONITOR",
    firstSeen: "2026-09-03T17:07:00Z",
    lastSeen: "2026-09-03T22:07:00Z",
    sightings: 1,
    tags: ["synthetic", "training", "set-06"],
    context: "Local Browser OS synthetic intelligence object 57; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0058",
    type: "domain",
    value: "signal-58.example",
    confidence: 40,
    severity: "CONTEXTUAL",
    status: "DUAL-USE",
    firstSeen: "2026-09-03T17:08:00Z",
    lastSeen: "2026-09-03T22:08:00Z",
    sightings: 4,
    tags: ["synthetic", "training", "set-06"],
    context: "Local Browser OS synthetic intelligence object 58; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0059",
    type: "process",
    value: "wscript.exe",
    confidence: 47,
    severity: "BENIGN",
    status: "ALLOWLISTED",
    firstSeen: "2026-09-03T17:09:00Z",
    lastSeen: "2026-09-03T22:09:00Z",
    sightings: 7,
    tags: ["synthetic", "training", "set-06"],
    context: "Local Browser OS synthetic intelligence object 59; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0060",
    type: "hash",
    value: "synthetic003c400b",
    confidence: 54,
    severity: "HIGH",
    status: "LAB-SUSPICIOUS",
    firstSeen: "2026-09-03T17:10:00Z",
    lastSeen: "2026-09-03T22:10:00Z",
    sightings: 10,
    tags: ["synthetic", "training", "set-06"],
    context: "Local Browser OS synthetic intelligence object 60; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0061",
    type: "ipv4",
    value: "203.0.113.184",
    confidence: 61,
    severity: "MEDIUM",
    status: "MONITOR",
    firstSeen: "2026-09-03T17:11:00Z",
    lastSeen: "2026-09-03T22:11:00Z",
    sightings: 13,
    tags: ["synthetic", "training", "set-07"],
    context: "Local Browser OS synthetic intelligence object 61; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0062",
    type: "domain",
    value: "signal-62.example",
    confidence: 68,
    severity: "CONTEXTUAL",
    status: "DUAL-USE",
    firstSeen: "2026-09-03T17:12:00Z",
    lastSeen: "2026-09-03T22:12:00Z",
    sightings: 16,
    tags: ["synthetic", "training", "set-07"],
    context: "Local Browser OS synthetic intelligence object 62; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0063",
    type: "process",
    value: "powershell.exe",
    confidence: 75,
    severity: "BENIGN",
    status: "ALLOWLISTED",
    firstSeen: "2026-09-03T17:13:00Z",
    lastSeen: "2026-09-03T22:13:00Z",
    sightings: 2,
    tags: ["synthetic", "training", "set-07"],
    context: "Local Browser OS synthetic intelligence object 63; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0064",
    type: "hash",
    value: "synthetic0040bbc7",
    confidence: 82,
    severity: "HIGH",
    status: "LAB-SUSPICIOUS",
    firstSeen: "2026-09-03T17:14:00Z",
    lastSeen: "2026-09-03T22:14:00Z",
    sightings: 5,
    tags: ["synthetic", "training", "set-07"],
    context: "Local Browser OS synthetic intelligence object 64; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0065",
    type: "ipv4",
    value: "203.0.113.196",
    confidence: 89,
    severity: "MEDIUM",
    status: "MONITOR",
    firstSeen: "2026-09-03T17:15:00Z",
    lastSeen: "2026-09-03T22:15:00Z",
    sightings: 8,
    tags: ["synthetic", "training", "set-07"],
    context: "Local Browser OS synthetic intelligence object 65; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0066",
    type: "domain",
    value: "signal-66.example",
    confidence: 96,
    severity: "CONTEXTUAL",
    status: "DUAL-USE",
    firstSeen: "2026-09-03T17:16:00Z",
    lastSeen: "2026-09-03T22:16:00Z",
    sightings: 11,
    tags: ["synthetic", "training", "set-07"],
    context: "Local Browser OS synthetic intelligence object 66; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0067",
    type: "process",
    value: "rundll32.exe",
    confidence: 45,
    severity: "BENIGN",
    status: "ALLOWLISTED",
    firstSeen: "2026-09-03T17:17:00Z",
    lastSeen: "2026-09-03T22:17:00Z",
    sightings: 14,
    tags: ["synthetic", "training", "set-07"],
    context: "Local Browser OS synthetic intelligence object 67; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0068",
    type: "hash",
    value: "synthetic00443784",
    confidence: 52,
    severity: "HIGH",
    status: "LAB-SUSPICIOUS",
    firstSeen: "2026-09-03T17:18:00Z",
    lastSeen: "2026-09-03T22:18:00Z",
    sightings: 0,
    tags: ["synthetic", "training", "set-07"],
    context: "Local Browser OS synthetic intelligence object 68; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0069",
    type: "ipv4",
    value: "203.0.113.208",
    confidence: 59,
    severity: "MEDIUM",
    status: "MONITOR",
    firstSeen: "2026-09-03T17:19:00Z",
    lastSeen: "2026-09-03T22:19:00Z",
    sightings: 3,
    tags: ["synthetic", "training", "set-07"],
    context: "Local Browser OS synthetic intelligence object 69; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0070",
    type: "domain",
    value: "signal-70.example",
    confidence: 66,
    severity: "CONTEXTUAL",
    status: "DUAL-USE",
    firstSeen: "2026-09-03T17:20:00Z",
    lastSeen: "2026-09-03T22:20:00Z",
    sightings: 6,
    tags: ["synthetic", "training", "set-07"],
    context: "Local Browser OS synthetic intelligence object 70; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0071",
    type: "process",
    value: "updater.exe",
    confidence: 73,
    severity: "BENIGN",
    status: "ALLOWLISTED",
    firstSeen: "2026-09-03T17:21:00Z",
    lastSeen: "2026-09-03T22:21:00Z",
    sightings: 9,
    tags: ["synthetic", "training", "set-08"],
    context: "Local Browser OS synthetic intelligence object 71; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0072",
    type: "hash",
    value: "synthetic0048b340",
    confidence: 80,
    severity: "HIGH",
    status: "LAB-SUSPICIOUS",
    firstSeen: "2026-09-03T17:22:00Z",
    lastSeen: "2026-09-03T22:22:00Z",
    sightings: 12,
    tags: ["synthetic", "training", "set-08"],
    context: "Local Browser OS synthetic intelligence object 72; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0073",
    type: "ipv4",
    value: "203.0.113.220",
    confidence: 87,
    severity: "MEDIUM",
    status: "MONITOR",
    firstSeen: "2026-09-03T17:23:00Z",
    lastSeen: "2026-09-03T22:23:00Z",
    sightings: 15,
    tags: ["synthetic", "training", "set-08"],
    context: "Local Browser OS synthetic intelligence object 73; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0074",
    type: "domain",
    value: "signal-74.example",
    confidence: 94,
    severity: "CONTEXTUAL",
    status: "DUAL-USE",
    firstSeen: "2026-09-03T17:24:00Z",
    lastSeen: "2026-09-03T22:24:00Z",
    sightings: 1,
    tags: ["synthetic", "training", "set-08"],
    context: "Local Browser OS synthetic intelligence object 74; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0075",
    type: "process",
    value: "WINWORD.EXE",
    confidence: 43,
    severity: "BENIGN",
    status: "ALLOWLISTED",
    firstSeen: "2026-09-03T17:25:00Z",
    lastSeen: "2026-09-03T22:25:00Z",
    sightings: 4,
    tags: ["synthetic", "training", "set-08"],
    context: "Local Browser OS synthetic intelligence object 75; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0076",
    type: "hash",
    value: "synthetic004c2efd",
    confidence: 50,
    severity: "HIGH",
    status: "LAB-SUSPICIOUS",
    firstSeen: "2026-09-03T17:26:00Z",
    lastSeen: "2026-09-03T22:26:00Z",
    sightings: 7,
    tags: ["synthetic", "training", "set-08"],
    context: "Local Browser OS synthetic intelligence object 76; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0077",
    type: "ipv4",
    value: "203.0.113.232",
    confidence: 57,
    severity: "MEDIUM",
    status: "MONITOR",
    firstSeen: "2026-09-03T17:27:00Z",
    lastSeen: "2026-09-03T22:27:00Z",
    sightings: 10,
    tags: ["synthetic", "training", "set-08"],
    context: "Local Browser OS synthetic intelligence object 77; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0078",
    type: "domain",
    value: "signal-78.example",
    confidence: 64,
    severity: "CONTEXTUAL",
    status: "DUAL-USE",
    firstSeen: "2026-09-03T17:28:00Z",
    lastSeen: "2026-09-03T22:28:00Z",
    sightings: 13,
    tags: ["synthetic", "training", "set-08"],
    context: "Local Browser OS synthetic intelligence object 78; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0079",
    type: "process",
    value: "wscript.exe",
    confidence: 71,
    severity: "BENIGN",
    status: "ALLOWLISTED",
    firstSeen: "2026-09-03T17:29:00Z",
    lastSeen: "2026-09-03T22:29:00Z",
    sightings: 16,
    tags: ["synthetic", "training", "set-08"],
    context: "Local Browser OS synthetic intelligence object 79; no external enrichment or reputation service is queried."
  },
  {
    id: "IOC-0080",
    type: "hash",
    value: "synthetic0050aab9",
    confidence: 78,
    severity: "HIGH",
    status: "LAB-SUSPICIOUS",
    firstSeen: "2026-09-03T17:30:00Z",
    lastSeen: "2026-09-03T22:30:00Z",
    sightings: 2,
    tags: ["synthetic", "training", "set-08"],
    context: "Local Browser OS synthetic intelligence object 80; no external enrichment or reputation service is queried."
  },
]);

const ADV_PACKAGE_SEED = Object.freeze([
  {
    name: "browser-kernel",
    installed: "2.1.2",
    available: "2.1.3",
    channel: "stable",
    status: "UPDATE",
    size: 99,
    security: true,
    description: "Synthetic Browser OS component for browser kernel functionality.",
    advisory: "Training advisory BOS-2001: validate update state and preserve simulation compatibility."
  },
  {
    name: "virtual-fs",
    installed: "3.2.4",
    available: "3.2.5",
    channel: "stable",
    status: "UPDATE",
    size: 118,
    security: false,
    description: "Synthetic Browser OS component for virtual fs functionality.",
    advisory: "Training advisory BOS-2002: validate update state and preserve simulation compatibility."
  },
  {
    name: "network-sim",
    installed: "4.3.6",
    available: "4.3.6",
    channel: "stable",
    status: "CURRENT",
    size: 137,
    security: true,
    description: "Synthetic Browser OS component for network sim functionality.",
    advisory: "Training advisory BOS-2003: validate update state and preserve simulation compatibility."
  },
  {
    name: "telemetry-agent",
    installed: "5.4.8",
    available: "5.4.9",
    channel: "stable",
    status: "UPDATE",
    size: 156,
    security: true,
    description: "Synthetic Browser OS component for telemetry agent functionality.",
    advisory: "Training advisory BOS-2004: validate update state and preserve simulation compatibility."
  },
  {
    name: "detection-engine",
    installed: "1.5.0",
    available: "1.5.1",
    channel: "stable",
    status: "UPDATE",
    size: 175,
    security: false,
    description: "Synthetic Browser OS component for detection engine functionality.",
    advisory: "Training advisory BOS-2005: validate update state and preserve simulation compatibility."
  },
  {
    name: "firewall-engine",
    installed: "2.6.2",
    available: "2.6.2",
    channel: "stable",
    status: "CURRENT",
    size: 194,
    security: true,
    description: "Synthetic Browser OS component for firewall engine functionality.",
    advisory: "Training advisory BOS-2006: validate update state and preserve simulation compatibility."
  },
  {
    name: "session-manager",
    installed: "3.7.4",
    available: "3.7.5",
    channel: "stable",
    status: "UPDATE",
    size: 213,
    security: false,
    description: "Synthetic Browser OS component for session manager functionality.",
    advisory: "Training advisory BOS-2007: validate update state and preserve simulation compatibility."
  },
  {
    name: "query-console",
    installed: "4.8.6",
    available: "4.8.7",
    channel: "stable",
    status: "UPDATE",
    size: 232,
    security: true,
    description: "Synthetic Browser OS component for query console functionality.",
    advisory: "Training advisory BOS-2008: validate update state and preserve simulation compatibility."
  },
  {
    name: "evidence-manager",
    installed: "5.9.8",
    available: "5.9.8",
    channel: "stable",
    status: "CURRENT",
    size: 251,
    security: false,
    description: "Synthetic Browser OS component for evidence manager functionality.",
    advisory: "Training advisory BOS-2009: validate update state and preserve simulation compatibility."
  },
  {
    name: "compliance-auditor",
    installed: "1.0.0",
    available: "1.0.1",
    channel: "stable",
    status: "UPDATE",
    size: 270,
    security: false,
    description: "Synthetic Browser OS component for compliance auditor functionality.",
    advisory: "Training advisory BOS-2010: validate update state and preserve simulation compatibility."
  },
  {
    name: "packet-decoder",
    installed: "2.1.2",
    available: "2.1.3",
    channel: "stable",
    status: "UPDATE",
    size: 289,
    security: false,
    description: "Synthetic Browser OS component for packet decoder functionality.",
    advisory: "Training advisory BOS-2011: validate update state and preserve simulation compatibility."
  },
  {
    name: "log-indexer",
    installed: "3.2.4",
    available: "3.2.4",
    channel: "stable",
    status: "CURRENT",
    size: 308,
    security: true,
    description: "Synthetic Browser OS component for log indexer functionality.",
    advisory: "Training advisory BOS-2012: validate update state and preserve simulation compatibility."
  },
  {
    name: "scheduler-runtime",
    installed: "4.3.6",
    available: "4.3.7",
    channel: "stable",
    status: "UPDATE",
    size: 327,
    security: false,
    description: "Synthetic Browser OS component for scheduler runtime functionality.",
    advisory: "Training advisory BOS-2013: validate update state and preserve simulation compatibility."
  },
  {
    name: "snapshot-manager",
    installed: "5.4.8",
    available: "5.4.9",
    channel: "stable",
    status: "UPDATE",
    size: 346,
    security: false,
    description: "Synthetic Browser OS component for snapshot manager functionality.",
    advisory: "Training advisory BOS-2014: validate update state and preserve simulation compatibility."
  },
  {
    name: "process-model",
    installed: "1.5.0",
    available: "1.5.0",
    channel: "stable",
    status: "CURRENT",
    size: 365,
    security: false,
    description: "Synthetic Browser OS component for process model functionality.",
    advisory: "Training advisory BOS-2015: validate update state and preserve simulation compatibility."
  },
  {
    name: "dns-resolver",
    installed: "2.6.2",
    available: "2.6.3",
    channel: "stable",
    status: "UPDATE",
    size: 384,
    security: true,
    description: "Synthetic Browser OS component for dns resolver functionality.",
    advisory: "Training advisory BOS-2016: validate update state and preserve simulation compatibility."
  },
  {
    name: "route-engine",
    installed: "3.7.4",
    available: "3.7.5",
    channel: "stable",
    status: "UPDATE",
    size: 403,
    security: false,
    description: "Synthetic Browser OS component for route engine functionality.",
    advisory: "Training advisory BOS-2017: validate update state and preserve simulation compatibility."
  },
  {
    name: "audit-journal",
    installed: "4.8.6",
    available: "4.8.6",
    channel: "stable",
    status: "CURRENT",
    size: 422,
    security: true,
    description: "Synthetic Browser OS component for audit journal functionality.",
    advisory: "Training advisory BOS-2018: validate update state and preserve simulation compatibility."
  },
  {
    name: "intel-cache",
    installed: "5.9.8",
    available: "5.9.9",
    channel: "stable",
    status: "UPDATE",
    size: 441,
    security: false,
    description: "Synthetic Browser OS component for intel cache functionality.",
    advisory: "Training advisory BOS-2019: validate update state and preserve simulation compatibility."
  },
  {
    name: "case-manager",
    installed: "1.0.0",
    available: "1.0.1",
    channel: "stable",
    status: "UPDATE",
    size: 460,
    security: true,
    description: "Synthetic Browser OS component for case manager functionality.",
    advisory: "Training advisory BOS-2020: validate update state and preserve simulation compatibility."
  },
  {
    name: "policy-engine",
    installed: "2.1.2",
    available: "2.1.2",
    channel: "stable",
    status: "CURRENT",
    size: 479,
    security: false,
    description: "Synthetic Browser OS component for policy engine functionality.",
    advisory: "Training advisory BOS-2021: validate update state and preserve simulation compatibility."
  },
  {
    name: "identity-model",
    installed: "3.2.4",
    available: "3.2.5",
    channel: "stable",
    status: "UPDATE",
    size: 498,
    security: false,
    description: "Synthetic Browser OS component for identity model functionality.",
    advisory: "Training advisory BOS-2022: validate update state and preserve simulation compatibility."
  },
  {
    name: "task-runner",
    installed: "4.3.6",
    available: "4.3.7",
    channel: "stable",
    status: "UPDATE",
    size: 517,
    security: false,
    description: "Synthetic Browser OS component for task runner functionality.",
    advisory: "Training advisory BOS-2023: validate update state and preserve simulation compatibility."
  },
  {
    name: "metrics-agent",
    installed: "5.4.8",
    available: "5.4.8",
    channel: "stable",
    status: "CURRENT",
    size: 536,
    security: true,
    description: "Synthetic Browser OS component for metrics agent functionality.",
    advisory: "Training advisory BOS-2024: validate update state and preserve simulation compatibility."
  },
  {
    name: "ui-runtime",
    installed: "1.5.0",
    available: "1.5.1",
    channel: "stable",
    status: "UPDATE",
    size: 555,
    security: false,
    description: "Synthetic Browser OS component for ui runtime functionality.",
    advisory: "Training advisory BOS-2025: validate update state and preserve simulation compatibility."
  },
  {
    name: "storage-layer",
    installed: "2.6.2",
    available: "2.6.3",
    channel: "stable",
    status: "UPDATE",
    size: 574,
    security: false,
    description: "Synthetic Browser OS component for storage layer functionality.",
    advisory: "Training advisory BOS-2026: validate update state and preserve simulation compatibility."
  },
  {
    name: "sandbox-editor",
    installed: "3.7.4",
    available: "3.7.4",
    channel: "stable",
    status: "CURRENT",
    size: 593,
    security: false,
    description: "Synthetic Browser OS component for sandbox editor functionality.",
    advisory: "Training advisory BOS-2027: validate update state and preserve simulation compatibility."
  },
  {
    name: "event-correlator",
    installed: "4.8.6",
    available: "4.8.7",
    channel: "stable",
    status: "UPDATE",
    size: 612,
    security: true,
    description: "Synthetic Browser OS component for event correlator functionality.",
    advisory: "Training advisory BOS-2028: validate update state and preserve simulation compatibility."
  },
  {
    name: "memory-profiler",
    installed: "5.9.8",
    available: "5.9.9",
    channel: "stable",
    status: "UPDATE",
    size: 631,
    security: false,
    description: "Synthetic Browser OS component for memory profiler functionality.",
    advisory: "Training advisory BOS-2029: validate update state and preserve simulation compatibility."
  },
  {
    name: "topology-renderer",
    installed: "1.0.0",
    available: "1.0.0",
    channel: "stable",
    status: "CURRENT",
    size: 650,
    security: false,
    description: "Synthetic Browser OS component for topology renderer functionality.",
    advisory: "Training advisory BOS-2030: validate update state and preserve simulation compatibility."
  },
]);

const ADV_CONTROL_SEED = Object.freeze([
  {
    id: "BOS-001",
    family: "Platform Boundary",
    title: "External network clients remain disabled — control 01",
    check: "network-boundary",
    status: "PASS",
    severity: "CRITICAL",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Platform Boundary.",
    remediation: "Restore the expected Browser OS simulation state associated with network-boundary."
  },
  {
    id: "BOS-002",
    family: "Secrets",
    title: "No real secrets embedded in static assets — control 02",
    check: "no-secrets",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Secrets.",
    remediation: "Restore the expected Browser OS simulation state associated with no-secrets."
  },
  {
    id: "BOS-003",
    family: "Network Security",
    title: "Virtual firewall retains default deny — control 03",
    check: "default-deny",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Network Security.",
    remediation: "Restore the expected Browser OS simulation state associated with default-deny."
  },
  {
    id: "BOS-004",
    family: "Patch Management",
    title: "Synthetic security updates are current — control 04",
    check: "security-updates",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Patch Management.",
    remediation: "Restore the expected Browser OS simulation state associated with security-updates."
  },
  {
    id: "BOS-005",
    family: "Service Hardening",
    title: "Protected services remain running — control 05",
    check: "protected-services",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Service Hardening.",
    remediation: "Restore the expected Browser OS simulation state associated with protected-services."
  },
  {
    id: "BOS-006",
    family: "Detection",
    title: "High-severity detections remain enabled — control 06",
    check: "high-rules",
    status: "PASS",
    severity: "MEDIUM",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Detection.",
    remediation: "Restore the expected Browser OS simulation state associated with high-rules."
  },
  {
    id: "BOS-007",
    family: "Recovery",
    title: "Recovery snapshot exists — control 07",
    check: "snapshot",
    status: "PASS",
    severity: "MEDIUM",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Recovery.",
    remediation: "Restore the expected Browser OS simulation state associated with snapshot."
  },
  {
    id: "BOS-008",
    family: "Filesystem",
    title: "Writable files remain in sandbox — control 08",
    check: "sandbox",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Filesystem.",
    remediation: "Restore the expected Browser OS simulation state associated with sandbox."
  },
  {
    id: "BOS-009",
    family: "Identity",
    title: "Privileged demo users retain MFA assurance — control 09",
    check: "mfa",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Identity.",
    remediation: "Restore the expected Browser OS simulation state associated with mfa."
  },
  {
    id: "BOS-010",
    family: "Audit",
    title: "Administrative mutations are auditable — control 10",
    check: "audit",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Audit.",
    remediation: "Restore the expected Browser OS simulation state associated with audit."
  },
  {
    id: "BOS-011",
    family: "Platform Boundary",
    title: "External network clients remain disabled — control 11",
    check: "network-boundary",
    status: "PASS",
    severity: "CRITICAL",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Platform Boundary.",
    remediation: "Restore the expected Browser OS simulation state associated with network-boundary."
  },
  {
    id: "BOS-012",
    family: "Secrets",
    title: "No real secrets embedded in static assets — control 12",
    check: "no-secrets",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Secrets.",
    remediation: "Restore the expected Browser OS simulation state associated with no-secrets."
  },
  {
    id: "BOS-013",
    family: "Network Security",
    title: "Virtual firewall retains default deny — control 13",
    check: "default-deny",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Network Security.",
    remediation: "Restore the expected Browser OS simulation state associated with default-deny."
  },
  {
    id: "BOS-014",
    family: "Patch Management",
    title: "Synthetic security updates are current — control 14",
    check: "security-updates",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Patch Management.",
    remediation: "Restore the expected Browser OS simulation state associated with security-updates."
  },
  {
    id: "BOS-015",
    family: "Service Hardening",
    title: "Protected services remain running — control 15",
    check: "protected-services",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Service Hardening.",
    remediation: "Restore the expected Browser OS simulation state associated with protected-services."
  },
  {
    id: "BOS-016",
    family: "Detection",
    title: "High-severity detections remain enabled — control 16",
    check: "high-rules",
    status: "PASS",
    severity: "MEDIUM",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Detection.",
    remediation: "Restore the expected Browser OS simulation state associated with high-rules."
  },
  {
    id: "BOS-017",
    family: "Recovery",
    title: "Recovery snapshot exists — control 17",
    check: "snapshot",
    status: "PASS",
    severity: "MEDIUM",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Recovery.",
    remediation: "Restore the expected Browser OS simulation state associated with snapshot."
  },
  {
    id: "BOS-018",
    family: "Filesystem",
    title: "Writable files remain in sandbox — control 18",
    check: "sandbox",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Filesystem.",
    remediation: "Restore the expected Browser OS simulation state associated with sandbox."
  },
  {
    id: "BOS-019",
    family: "Identity",
    title: "Privileged demo users retain MFA assurance — control 19",
    check: "mfa",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Identity.",
    remediation: "Restore the expected Browser OS simulation state associated with mfa."
  },
  {
    id: "BOS-020",
    family: "Audit",
    title: "Administrative mutations are auditable — control 20",
    check: "audit",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Audit.",
    remediation: "Restore the expected Browser OS simulation state associated with audit."
  },
  {
    id: "BOS-021",
    family: "Platform Boundary",
    title: "External network clients remain disabled — control 21",
    check: "network-boundary",
    status: "PASS",
    severity: "CRITICAL",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Platform Boundary.",
    remediation: "Restore the expected Browser OS simulation state associated with network-boundary."
  },
  {
    id: "BOS-022",
    family: "Secrets",
    title: "No real secrets embedded in static assets — control 22",
    check: "no-secrets",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Secrets.",
    remediation: "Restore the expected Browser OS simulation state associated with no-secrets."
  },
  {
    id: "BOS-023",
    family: "Network Security",
    title: "Virtual firewall retains default deny — control 23",
    check: "default-deny",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Network Security.",
    remediation: "Restore the expected Browser OS simulation state associated with default-deny."
  },
  {
    id: "BOS-024",
    family: "Patch Management",
    title: "Synthetic security updates are current — control 24",
    check: "security-updates",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Patch Management.",
    remediation: "Restore the expected Browser OS simulation state associated with security-updates."
  },
  {
    id: "BOS-025",
    family: "Service Hardening",
    title: "Protected services remain running — control 25",
    check: "protected-services",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Service Hardening.",
    remediation: "Restore the expected Browser OS simulation state associated with protected-services."
  },
  {
    id: "BOS-026",
    family: "Detection",
    title: "High-severity detections remain enabled — control 26",
    check: "high-rules",
    status: "PASS",
    severity: "MEDIUM",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Detection.",
    remediation: "Restore the expected Browser OS simulation state associated with high-rules."
  },
  {
    id: "BOS-027",
    family: "Recovery",
    title: "Recovery snapshot exists — control 27",
    check: "snapshot",
    status: "PASS",
    severity: "MEDIUM",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Recovery.",
    remediation: "Restore the expected Browser OS simulation state associated with snapshot."
  },
  {
    id: "BOS-028",
    family: "Filesystem",
    title: "Writable files remain in sandbox — control 28",
    check: "sandbox",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Filesystem.",
    remediation: "Restore the expected Browser OS simulation state associated with sandbox."
  },
  {
    id: "BOS-029",
    family: "Identity",
    title: "Privileged demo users retain MFA assurance — control 29",
    check: "mfa",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Identity.",
    remediation: "Restore the expected Browser OS simulation state associated with mfa."
  },
  {
    id: "BOS-030",
    family: "Audit",
    title: "Administrative mutations are auditable — control 30",
    check: "audit",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Audit.",
    remediation: "Restore the expected Browser OS simulation state associated with audit."
  },
  {
    id: "BOS-031",
    family: "Platform Boundary",
    title: "External network clients remain disabled — control 31",
    check: "network-boundary",
    status: "PASS",
    severity: "CRITICAL",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Platform Boundary.",
    remediation: "Restore the expected Browser OS simulation state associated with network-boundary."
  },
  {
    id: "BOS-032",
    family: "Secrets",
    title: "No real secrets embedded in static assets — control 32",
    check: "no-secrets",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Secrets.",
    remediation: "Restore the expected Browser OS simulation state associated with no-secrets."
  },
  {
    id: "BOS-033",
    family: "Network Security",
    title: "Virtual firewall retains default deny — control 33",
    check: "default-deny",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Network Security.",
    remediation: "Restore the expected Browser OS simulation state associated with default-deny."
  },
  {
    id: "BOS-034",
    family: "Patch Management",
    title: "Synthetic security updates are current — control 34",
    check: "security-updates",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Patch Management.",
    remediation: "Restore the expected Browser OS simulation state associated with security-updates."
  },
  {
    id: "BOS-035",
    family: "Service Hardening",
    title: "Protected services remain running — control 35",
    check: "protected-services",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Service Hardening.",
    remediation: "Restore the expected Browser OS simulation state associated with protected-services."
  },
  {
    id: "BOS-036",
    family: "Detection",
    title: "High-severity detections remain enabled — control 36",
    check: "high-rules",
    status: "PASS",
    severity: "MEDIUM",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Detection.",
    remediation: "Restore the expected Browser OS simulation state associated with high-rules."
  },
  {
    id: "BOS-037",
    family: "Recovery",
    title: "Recovery snapshot exists — control 37",
    check: "snapshot",
    status: "PASS",
    severity: "MEDIUM",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Recovery.",
    remediation: "Restore the expected Browser OS simulation state associated with snapshot."
  },
  {
    id: "BOS-038",
    family: "Filesystem",
    title: "Writable files remain in sandbox — control 38",
    check: "sandbox",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Filesystem.",
    remediation: "Restore the expected Browser OS simulation state associated with sandbox."
  },
  {
    id: "BOS-039",
    family: "Identity",
    title: "Privileged demo users retain MFA assurance — control 39",
    check: "mfa",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Identity.",
    remediation: "Restore the expected Browser OS simulation state associated with mfa."
  },
  {
    id: "BOS-040",
    family: "Audit",
    title: "Administrative mutations are auditable — control 40",
    check: "audit",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Audit.",
    remediation: "Restore the expected Browser OS simulation state associated with audit."
  },
  {
    id: "BOS-041",
    family: "Platform Boundary",
    title: "External network clients remain disabled — control 41",
    check: "network-boundary",
    status: "PASS",
    severity: "CRITICAL",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Platform Boundary.",
    remediation: "Restore the expected Browser OS simulation state associated with network-boundary."
  },
  {
    id: "BOS-042",
    family: "Secrets",
    title: "No real secrets embedded in static assets — control 42",
    check: "no-secrets",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Secrets.",
    remediation: "Restore the expected Browser OS simulation state associated with no-secrets."
  },
  {
    id: "BOS-043",
    family: "Network Security",
    title: "Virtual firewall retains default deny — control 43",
    check: "default-deny",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Network Security.",
    remediation: "Restore the expected Browser OS simulation state associated with default-deny."
  },
  {
    id: "BOS-044",
    family: "Patch Management",
    title: "Synthetic security updates are current — control 44",
    check: "security-updates",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Patch Management.",
    remediation: "Restore the expected Browser OS simulation state associated with security-updates."
  },
  {
    id: "BOS-045",
    family: "Service Hardening",
    title: "Protected services remain running — control 45",
    check: "protected-services",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Service Hardening.",
    remediation: "Restore the expected Browser OS simulation state associated with protected-services."
  },
  {
    id: "BOS-046",
    family: "Detection",
    title: "High-severity detections remain enabled — control 46",
    check: "high-rules",
    status: "PASS",
    severity: "MEDIUM",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Detection.",
    remediation: "Restore the expected Browser OS simulation state associated with high-rules."
  },
  {
    id: "BOS-047",
    family: "Recovery",
    title: "Recovery snapshot exists — control 47",
    check: "snapshot",
    status: "PASS",
    severity: "MEDIUM",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Recovery.",
    remediation: "Restore the expected Browser OS simulation state associated with snapshot."
  },
  {
    id: "BOS-048",
    family: "Filesystem",
    title: "Writable files remain in sandbox — control 48",
    check: "sandbox",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Filesystem.",
    remediation: "Restore the expected Browser OS simulation state associated with sandbox."
  },
  {
    id: "BOS-049",
    family: "Identity",
    title: "Privileged demo users retain MFA assurance — control 49",
    check: "mfa",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Identity.",
    remediation: "Restore the expected Browser OS simulation state associated with mfa."
  },
  {
    id: "BOS-050",
    family: "Audit",
    title: "Administrative mutations are auditable — control 50",
    check: "audit",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Audit.",
    remediation: "Restore the expected Browser OS simulation state associated with audit."
  },
  {
    id: "BOS-051",
    family: "Platform Boundary",
    title: "External network clients remain disabled — control 51",
    check: "network-boundary",
    status: "PASS",
    severity: "CRITICAL",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Platform Boundary.",
    remediation: "Restore the expected Browser OS simulation state associated with network-boundary."
  },
  {
    id: "BOS-052",
    family: "Secrets",
    title: "No real secrets embedded in static assets — control 52",
    check: "no-secrets",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Secrets.",
    remediation: "Restore the expected Browser OS simulation state associated with no-secrets."
  },
  {
    id: "BOS-053",
    family: "Network Security",
    title: "Virtual firewall retains default deny — control 53",
    check: "default-deny",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Network Security.",
    remediation: "Restore the expected Browser OS simulation state associated with default-deny."
  },
  {
    id: "BOS-054",
    family: "Patch Management",
    title: "Synthetic security updates are current — control 54",
    check: "security-updates",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Patch Management.",
    remediation: "Restore the expected Browser OS simulation state associated with security-updates."
  },
  {
    id: "BOS-055",
    family: "Service Hardening",
    title: "Protected services remain running — control 55",
    check: "protected-services",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Service Hardening.",
    remediation: "Restore the expected Browser OS simulation state associated with protected-services."
  },
  {
    id: "BOS-056",
    family: "Detection",
    title: "High-severity detections remain enabled — control 56",
    check: "high-rules",
    status: "PASS",
    severity: "MEDIUM",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Detection.",
    remediation: "Restore the expected Browser OS simulation state associated with high-rules."
  },
  {
    id: "BOS-057",
    family: "Recovery",
    title: "Recovery snapshot exists — control 57",
    check: "snapshot",
    status: "PASS",
    severity: "MEDIUM",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Recovery.",
    remediation: "Restore the expected Browser OS simulation state associated with snapshot."
  },
  {
    id: "BOS-058",
    family: "Filesystem",
    title: "Writable files remain in sandbox — control 58",
    check: "sandbox",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Filesystem.",
    remediation: "Restore the expected Browser OS simulation state associated with sandbox."
  },
  {
    id: "BOS-059",
    family: "Identity",
    title: "Privileged demo users retain MFA assurance — control 59",
    check: "mfa",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Identity.",
    remediation: "Restore the expected Browser OS simulation state associated with mfa."
  },
  {
    id: "BOS-060",
    family: "Audit",
    title: "Administrative mutations are auditable — control 60",
    check: "audit",
    status: "PASS",
    severity: "HIGH",
    evidence: "Synthetic control evidence generated from Browser OS state for assessment family Audit.",
    remediation: "Restore the expected Browser OS simulation state associated with audit."
  },
]);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", advInitialize, { once: true });
} else {
  advInitialize();
}
