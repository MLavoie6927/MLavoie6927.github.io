"use strict";

/*
  Browser OS 3.0 — Security Operations Workstation
  Recruiter demonstration, live synthetic intrusion, evidence graph,
  detection engineering, incident command, containment verification,
  reporting, architecture and engineering proof.

  SECURITY BOUNDARY
  - static browser application only
  - no host shell or host filesystem access
  - no external network client
  - no credentials, tokens or repository write path
  - all enterprise telemetry and attack activity is synthetic
*/

(function BrowserOS3Runtime() {
  const M = window.BrowserOS3Model;
  if (!M) throw new Error("Browser OS 3.0 model layer was not loaded.");

  const VERSION = M.VERSION;
  const APP_LIST = Object.freeze([
    { id: "recruiter-window", icon: "★", name: "Recruiter Demo", keywords: "recruiter five minute demo walkthrough attack analyst", desktop: true },
    { id: "evidence-graph-window", icon: "⌬", name: "Evidence Graph", keywords: "graph entity relationship pivot evidence process dns ip", desktop: true },
    { id: "detection-studio-window", icon: "⌁", name: "Detection Studio", keywords: "rule tuning false positive analytics threshold detection", desktop: true },
    { id: "incident-command-window", icon: "◆", name: "Incident Commander", keywords: "incident response scope contain remediate validate root cause", desktop: true },
    { id: "attack-timeline-window", icon: "◴", name: "Attack Timeline", keywords: "timeline investigation events attack mitre evidence", desktop: false },
    { id: "verification-window", icon: "✓", name: "Response Verification", keywords: "verify containment test c2 management reboot persistence", desktop: true },
    { id: "reporting-window", icon: "▧", name: "Incident Reports", keywords: "executive technical report communication brief", desktop: false },
    { id: "architecture-window", icon: "▦", name: "Architecture", keywords: "architecture engineering layers event bus detection response", desktop: false },
    { id: "engineering-window", icon: "⚒", name: "Engineering Proof", keywords: "tests ci invariants threat model adr validation quality", desktop: false },
    { id: "truth-window", icon: "◎", name: "Truth & Security Boundary", keywords: "synthetic real truth model security boundary limitations", desktop: false }
  ]);

  const PIVOT_LABELS = Object.freeze({
    "process-window": "Process Explorer",
    "network-window": "Network Monitor",
    "packet-window": "Packet Analyzer",
    "firewall-window": "Firewall Manager",
    "memory-window": "Memory Inspector",
    "identity-window": "Identity & Sessions",
    "detection-studio-window": "Detection Studio",
    "incident-command-window": "Incident Commander",
    "attack-timeline-window": "Attack Timeline"
  });

  let v3 = M.normalizeState(state.v3);
  let attackTimer = null;
  let recruiterTimer = null;
  let bootPollTimer = null;
  let bound = false;

  function save() {
    v3.updated = new Date().toISOString();
    state.v3 = v3;
    persistState();
  }

  function now() {
    return new Date().toISOString();
  }

  function h(value) {
    return escapeHtml(String(value == null ? "" : value));
  }

  function q(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qa(selector, root) {
    return Array.from((root || document).querySelectorAll(selector));
  }

  function setText(id, value) {
    const node = byId(id);
    if (node) node.textContent = String(value == null ? "" : value);
  }

  function setHtml(id, value) {
    const node = byId(id);
    if (node) node.innerHTML = value;
  }

  function activeIncident() {
    return state.incidents.find(item => item.id === "INC-301") || null;
  }

  function attackStageExecuted(stageId) {
    return v3.attack.events.some(event => event.id === stageId);
  }

  function audit(action, target, outcome, detail) {
    if (typeof advAudit === "function") {
      advAudit("v3." + action, target, outcome || "SUCCESS", detail || "", state.activeUser || "soc");
    }
    addOpsEvent("Browser OS 3.0 · " + action, detail || target);
  }

  function analystAction(action, detail, evidenceType) {
    v3.analystActions.unshift({
      id: "ACT-" + String(v3.analystActions.length + 1).padStart(3, "0"),
      time: now(),
      action,
      detail,
      evidenceType: evidenceType || "response",
      actor: state.activeUser || "soc"
    });
    v3.analystActions = v3.analystActions.slice(0, 200);
    audit(action, "INC-301", "SUCCESS", detail);
    save();
  }

  function addEvidence(type, source, description, payload, pivot) {
    const existing = v3.evidence.find(item => item.description === description);
    if (existing) return existing;
    const item = {
      id: "V3E-" + String(v3.evidence.length + 1).padStart(3, "0"),
      time: now(),
      type,
      source,
      description,
      payload,
      pivot: pivot || "attack-timeline-window",
      integrity: "SYNTHETIC / VERIFIED STATE"
    };
    v3.evidence.push(item);
    save();
    return item;
  }

  function ensureScenarioIndicators() {
    if (!state.advanced || !Array.isArray(state.advanced.indicators)) return;
    const seeds = [
      { id: "IOC-0301", type: "domain", value: "cdn-sync.example", confidence: 42, severity: "CONTEXTUAL", status: "MONITOR", firstSeen: now(), lastSeen: now(), sightings: 1, tags: ["synthetic", "inc-301", "weak-context"], context: "Initially weak local context. Confidence should rise only after independent process, DNS, network and memory correlation." },
      { id: "IOC-0302", type: "ipv4", value: "203.0.113.200", confidence: 48, severity: "MEDIUM", status: "MONITOR", firstSeen: now(), lastSeen: now(), sightings: 1, tags: ["synthetic", "inc-301", "documentation-range"], context: "Documentation-range destination used by the Browser OS 3.0 scenario. Initial reputation alone is intentionally non-conclusive." }
    ];
    seeds.forEach(seed => {
      if (!state.advanced.indicators.some(item => item.id === seed.id)) state.advanced.indicators.unshift(seed);
    });
  }

  function ensureCoreEntities() {
    if (!state.users.some(user => user.username === "mturner")) {
      state.users.push({
        username: "mturner",
        role: "Finance User",
        mfa: true,
        locked: false,
        lastSignIn: now(),
        groups: ["users", "finance"]
      });
    }
    if (!state.sessions.some(session => session.id === "SES-3010")) {
      state.sessions.push({
        id: "SES-3010",
        username: "mturner",
        assurance: "mfa",
        started: now(),
        status: "active",
        source: "WS-108"
      });
    }
    ensureScenarioIndicators();
    save();
  }

  function removeScenarioArtifacts() {
    state.processes = state.processes.filter(process => ![2104, 2110, 2116].includes(process.pid));
    state.connections = state.connections.filter(connection => !String(connection.id).startsWith("V3-C"));
    state.packets = state.packets.filter(packet => !String(packet.info || "").includes("BOS3"));
    state.logs = state.logs.filter(log => !String(log.message || "").includes("[BOS3]"));
    state.incidents = state.incidents.filter(incident => incident.id !== "INC-301");
    state.firewallRules = state.firewallRules.filter(rule => !String(rule.description || "").startsWith("BOS3"));
    state.sessions = state.sessions.filter(session => session.id !== "SES-3010");
    state.users = state.users.filter(user => user.username !== "mturner");
    if (state.advanced) {
      state.advanced.cases = (state.advanced.cases || []).filter(item => item.id !== "CASE-0301");
      state.advanced.evidence = (state.advanced.evidence || []).filter(item => !String(item.id || "").startsWith("V3E-"));
      state.advanced.indicators = (state.advanced.indicators || []).filter(item => !["IOC-0301", "IOC-0302"].includes(item.id));
    }
    persistState();
  }

  function resetScenario(options) {
    const opts = options || {};
    stopAttack();
    removeScenarioArtifacts();
    const engineering = v3.engineering;
    const recruiter = opts.keepRecruiter ? v3.recruiter : M.createState().recruiter;
    v3 = M.createState();
    v3.engineering = engineering;
    v3.recruiter = recruiter;
    ensureCoreEntities();
    save();
    renderV3All();
    toast("Browser OS 3.0", "INC-301 scenario reset to a clean pre-attack state.", "info");
  }

  function stageTimestamp(stage) {
    return `2026-09-03T${stage.offset}Z`;
  }

  function pushPacket(src, dst, proto, info, detail) {
    state.packets.push({
      no: state.nextPacket++,
      time: ((state.nextPacket - 1) * 0.1247).toFixed(4),
      src,
      dst,
      proto,
      info: "BOS3 " + info,
      detail: "Browser OS 3.0 synthetic packet\n" + detail
    });
    state.packets = state.packets.slice(-400);
  }

  function pushConnection(id, pid, process, local, remote, protocol, connectionState, policy) {
    const existing = state.connections.find(item => item.id === id);
    if (existing) {
      Object.assign(existing, { pid, process, local, remote, protocol, state: connectionState, policy });
      return existing;
    }
    const item = { id, pid, process, local, remote, protocol, state: connectionState, policy };
    state.connections.push(item);
    return item;
  }

  function pushProcess(process) {
    const existing = state.processes.find(item => item.pid === process.pid);
    if (existing) Object.assign(existing, process);
    else state.processes.push(process);
  }

  function ensureAdvancedCase() {
    if (!state.advanced) return;
    if (!state.advanced.cases.some(item => item.id === "CASE-0301")) {
      state.advanced.cases.unshift({
        id: "CASE-0301",
        title: "WS-108 Multi-Source Intrusion",
        severity: "CRITICAL",
        status: "OPEN",
        owner: "soc",
        created: now(),
        updated: now(),
        incidents: ["INC-301"],
        tags: ["phishing", "powershell", "persistence", "c2", "credential-access", "lateral-movement"],
        hypothesis: "A phishing-delivered document led to execution, persistence, C2, credential-access behavior and attempted lateral movement.",
        summary: "Browser OS 3.0 recruiter scenario. Correlate independent evidence before containment.",
        disposition: "Pending analyst conclusion",
        notes: [{ time: now(), author: "system", text: "Case generated by Browser OS 3.0 live attack scenario." }],
        timeline: []
      });
    }
  }

  function syncAdvancedEvidence(item) {
    if (!state.advanced) return;
    if (!state.advanced.evidence.some(evidence => evidence.id === item.id)) {
      state.advanced.evidence.push({
        id: item.id,
        caseId: "CASE-0301",
        type: item.type,
        source: item.source,
        collected: item.time,
        integrity: "VERIFIED",
        description: item.description,
        payload: item.payload
      });
    }
  }

  function recordStageEvidence(stage, source, description, payload, pivot) {
    const item = addEvidence(stage.evidenceType, source, description, payload, pivot || stage.pivot);
    syncAdvancedEvidence(item);
    ensureAdvancedCase();
    if (state.advanced) {
      const case301 = state.advanced.cases.find(item => item.id === "CASE-0301");
      if (case301 && !case301.timeline.some(item => item.title === stage.title)) {
        case301.timeline.push({ time: stageTimestamp(stage), type: stage.evidenceType, title: stage.title, detail: stage.detail });
        case301.updated = now();
      }
    }
    save();
  }

  const STAGE_HANDLERS = {
    "ATK-00": stage => {
      addLog("email", "info", "[BOS3] WS-108 mturner received Q3_Benefits_Update.docm from external sender");
      recordStageEvidence(stage, "Synthetic Mail Gateway", "External attachment delivered to mturner", "Q3_Benefits_Update.docm | external sender | delivered", "attack-timeline-window");
    },
    "ATK-01": stage => {
      pushProcess({ pid: 2104, ppid: 1, user: "mturner", name: "WINWORD.EXE", cpu: 0.7, mem: 48, status: "RUNNING", protected: false, cmd: "WINWORD.EXE C:\\Users\\mturner\\Downloads\\Q3_Benefits_Update.docm" });
      addLog("security", "info", "[BOS3] WS-108 WINWORD.EXE opened Q3_Benefits_Update.docm user=mturner");
      recordStageEvidence(stage, "Endpoint Process Telemetry", "WINWORD opened the delivered document", "PID 2104 | mturner | Q3_Benefits_Update.docm", "process-window");
    },
    "ATK-02": stage => {
      pushProcess({ pid: 2110, ppid: 2104, user: "mturner", name: "powershell.exe", cpu: 3.8, mem: 37, status: "RUNNING", protected: false, cmd: "powershell.exe -NoProfile -EncodedCommand U3ludGhldGljLURlbW8=" });
      addLog("security", "high", "[BOS3] WS-108 WINWORD.EXE pid=2104 spawned powershell.exe pid=2110 encoded_command=true");
      recordStageEvidence(stage, "Endpoint Process Telemetry", "Office-to-PowerShell process lineage", "2104 WINWORD.EXE -> 2110 powershell.exe | EncodedCommand", "process-window");
    },
    "ATK-03": stage => {
      pushProcess({ pid: 2116, ppid: 2110, user: "mturner", name: "rundll32.exe", cpu: 1.9, mem: 21, status: "RUNNING", protected: false, cmd: "rundll32.exe javascript:synthetic-browser-os-demo" });
      addLog("security", "high", "[BOS3] WS-108 powershell.exe pid=2110 spawned rundll32.exe pid=2116 proxy_execution=true");
      recordStageEvidence(stage, "Endpoint Process Telemetry", "PowerShell-to-Rundll32 proxy execution", "2110 powershell.exe -> 2116 rundll32.exe", "process-window");
    },
    "ATK-04": stage => {
      v3.attack.persistencePresent = true;
      addLog("registry", "high", "[BOS3] WS-108 HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run OneDriveHealth created by pid=2116");
      recordStageEvidence(stage, "Registry Telemetry", "Synthetic Run-key persistence", "HKCU Run | OneDriveHealth | rundll32 synthetic entry", "attack-timeline-window");
    },
    "ATK-05": stage => {
      if (state.advanced) {
        const domain = state.advanced.indicators.find(item => item.id === "IOC-0301");
        if (domain) { domain.confidence = 52; domain.sightings += 1; domain.lastSeen = now(); domain.context = "DNS telemetry now links this previously weak contextual domain to suspicious Office → PowerShell → Rundll32 lineage."; }
      }
      addLog("dns", "warn", "[BOS3] WS-108 query cdn-sync.example response=203.0.113.200 pid=2116");
      pushPacket("192.0.2.108", "192.0.2.53", "DNS", "Query A cdn-sync.example", "WS-108 / PID 2116 / query A cdn-sync.example");
      pushPacket("192.0.2.53", "192.0.2.108", "DNS", "Response A 203.0.113.200", "Documentation-range synthetic answer");
      recordStageEvidence(stage, "DNS + Packet Telemetry", "Rare domain resolved by suspicious process", "cdn-sync.example -> 203.0.113.200 | PID 2116", "packet-window");
    },
    "ATK-06": stage => {
      if (state.advanced) {
        const ip = state.advanced.indicators.find(item => item.id === "IOC-0302");
        if (ip) { ip.confidence = 61; ip.sightings += 1; ip.lastSeen = now(); ip.context = "Process-attributed TLS egress raises confidence, but the destination is not treated as conclusive without additional behavior."; }
      }
      const id = "V3-C01";
      pushConnection(id, 2116, "rundll32.exe", "192.0.2.108:53122", "203.0.113.200:443", "TCP/TLS", "ESTABLISHED", "ALLOW");
      if (!v3.attack.connectionIds.includes(id)) v3.attack.connectionIds.push(id);
      addLog("firewall", "high", "[BOS3] ALLOW WS-108 192.0.2.108 -> 203.0.113.200 TCP/443 process=rundll32.exe pid=2116");
      pushPacket("192.0.2.108", "203.0.113.200", "TCP", "53122 -> 443 [SYN]", "PID 2116 rundll32.exe");
      pushPacket("192.0.2.108", "203.0.113.200", "TLS", "Client Hello SNI cdn-sync.example", "PID 2116 / INC-301 candidate");
      recordStageEvidence(stage, "Network + Firewall + Packet Telemetry", "Rundll32-associated TLS egress", "192.0.2.108 -> 203.0.113.200:443 | PID 2116", "network-window");
      const packetEvidence = addEvidence("packet", "Packet Analyzer", "INC-301 DNS/TCP/TLS packet sequence", "DNS cdn-sync.example -> 203.0.113.200 | TCP SYN | TLS Client Hello | PID 2116", "packet-window");
      syncAdvancedEvidence(packetEvidence);
    },
    "ATK-07": stage => {
      ["V3-C02", "V3-C03"].forEach((id, index) => {
        pushConnection(id, 2116, "rundll32.exe", `192.0.2.108:${53124 + index * 2}`, "203.0.113.200:443", "TCP/TLS", "ESTABLISHED", "ALLOW");
        if (!v3.attack.connectionIds.includes(id)) v3.attack.connectionIds.push(id);
        pushPacket("192.0.2.108", "203.0.113.200", "TLS", `Beacon ${index + 2}/3 Application Data`, `Synthetic periodicity interval ${17 + index}s / PID 2116`);
      });
      addLog("network", "high", "[BOS3] WS-108 periodic TLS pattern destination=203.0.113.200 intervals=17s,18s,17s jitter=2.7%");
      recordStageEvidence(stage, "Network Analytics", "Low-jitter periodic TLS beacon pattern", "destination=203.0.113.200 | intervals 17/18/17s | jitter 2.7%", "network-window");
    },
    "ATK-08": stage => {
      v3.attack.credentialRisk = true;
      addLog("security", "critical", "[BOS3] WS-108 rundll32.exe pid=2116 requested synthetic protected-process handle credential_access=true");
      if (state.advanced && state.advanced.memoryProfiles) {
        state.advanced.memoryProfiles["2116"] = {
          pid: 2116,
          process: "rundll32.exe",
          architecture: "x64",
          integrity: "Medium",
          privateBytes: 27136,
          workingSet: 45112,
          threads: 8,
          handles: ["Parent powershell.exe PID 2110", "TCP 203.0.113.200:443", "ProtectedProcess synthetic-credential-material"],
          modules: ["rundll32.exe", "kernel32.dll", "wininet.dll", "synthetic-stage.dll"],
          maps: ["RX IMAGE rundll32.exe", "RW PRIVATE heap", "RX PRIVATE training-region"],
          anomalies: ["Synthetic protected-process access", "Network-active proxy binary", "Suspicious Office lineage"]
        };
      }
      recordStageEvidence(stage, "Synthetic Memory Telemetry", "Protected-process access from suspicious lineage", "PID 2116 | synthetic credential material handle", "memory-window");
    },
    "ATK-09": stage => {
      v3.attack.lateralAttempted = true;
      pushConnection("V3-C04", 2116, "rundll32.exe", "192.0.2.108:54022", "198.51.100.55:445", "TCP/SMB", "SYN-SENT", "PENDING");
      addLog("network", "critical", "[BOS3] WS-108 attempted SMB connection to FS-02 198.51.100.55:445 user=mturner pid=2116");
      pushPacket("192.0.2.108", "198.51.100.55", "TCP", "54022 -> 445 [SYN]", "Synthetic SMB lateral movement attempt / PID 2116");
      recordStageEvidence(stage, "Network Telemetry", "Attempted workstation-to-server SMB movement", "WS-108 -> FS-02 198.51.100.55:445 | PID 2116", "network-window");
    },
    "ATK-10": stage => {
      v3.attack.segmentationBlocked = true;
      const conn = state.connections.find(item => item.id === "V3-C04");
      if (conn) { conn.state = "BLOCKED"; conn.policy = "DENY"; }
      state.firewallStats.blocked += 1;
      addLog("firewall", "info", "[BOS3] DENY WS-108 192.0.2.108 -> FS-02 198.51.100.55 TCP/445 rule=default-deny segmentation=effective");
      recordStageEvidence(stage, "Stateful Firewall", "Segmentation denied attempted SMB movement", "DENY 192.0.2.108 -> 198.51.100.55:445 | default deny", "firewall-window");
    },
    "ATK-11": stage => {
      runDetection(false);
      ensureIncident();
      if (state.advanced) {
        ["IOC-0301", "IOC-0302"].forEach(id => {
          const indicator = state.advanced.indicators.find(item => item.id === id);
          if (indicator) {
            indicator.confidence = id === "IOC-0301" ? 91 : 94;
            indicator.severity = "HIGH";
            indicator.status = "CORRELATED";
            indicator.lastSeen = now();
            indicator.context = "Confidence promoted by independent process, persistence, DNS, network, beacon, credential-access and lateral-movement evidence in INC-301.";
          }
        });
      }
      recordStageEvidence(stage, "Detection Engine", "Multi-source analytic promoted INC-301", "Office lineage + persistence + DNS + TLS + credential access + lateral attempt", "detection-studio-window");
    },
    "ATK-12": stage => {
      const incident = ensureIncident();
      incident.status = "INVESTIGATING";
      v3.commander.status = "INVESTIGATING";
      v3.commander.confidence = M.confidenceFromState(v3);
      addLog("soc", "info", "[BOS3] Analyst opened INC-301; scenario paused awaiting investigation and response");
      recordStageEvidence(stage, "SOC Console", "Analyst investigation started", "INC-301 status=INVESTIGATING owner=soc", "incident-command-window");
    }
  };

  function ensureIncident() {
    let incident = activeIncident();
    const detection = v3.detectionStudio.current || M.evaluateDetection(v3.attack.events, v3.detectionStudio.tuning);
    if (!incident) {
      incident = {
        id: "INC-301",
        severity: "CRITICAL",
        endpoint: "WS-108",
        status: "TRIAGE",
        title: "Multi-Source Phishing Intrusion",
        owner: "soc",
        user: "mturner",
        processTree: "WINWORD.EXE → powershell.exe → rundll32.exe",
        command: "powershell.exe -NoProfile -EncodedCommand [synthetic]",
        network: "192.0.2.108 → 203.0.113.200:443; SMB attempt → 198.51.100.55:445",
        mitre: ["T1566.001", "T1059.001", "T1218.011", "T1547.001", "T1071.004", "T1071.001", "T1003", "T1021.002"],
        notes: `Browser OS 3.0 synthetic scenario. Detection score ${detection.score}/100.`
      };
      state.incidents.unshift(incident);
    }
    return incident;
  }

  function executeStage(index) {
    const stage = M.ATTACK_STAGES[index];
    if (!stage || attackStageExecuted(stage.id)) return;
    ensureCoreEntities();
    const event = Object.assign({}, stage, { time: stageTimestamp(stage), executedAt: now() });
    v3.attack.events.push(event);
    v3.attack.stageIndex = index;
    v3.attack.status = index === M.ATTACK_STAGES.length - 1 ? "AWAITING_ANALYST" : "RUNNING";
    if (STAGE_HANDLERS[stage.id]) STAGE_HANDLERS[stage.id](stage);
    save();
    renderV3All();
    renderAll();
    if (state.advanced && typeof advRenderAll === "function") advRenderAll();
    if (index === M.ATTACK_STAGES.length - 1) {
      stopAttack(false);
      toast("INC-301 ready", "The live attack has paused. Switch to Analyst View to investigate and contain it.", "warn");
    }
  }

  function attackDelay() {
    const speed = Number(v3.attack.speed || 1);
    return Math.max(350, Math.round(1700 / speed));
  }

  function scheduleNextStage() {
    if (v3.attack.status !== "RUNNING") return;
    const next = v3.attack.stageIndex + 1;
    if (next >= M.ATTACK_STAGES.length) return;
    attackTimer = window.setTimeout(() => {
      executeStage(next);
      if (v3.attack.status === "RUNNING") scheduleNextStage();
    }, attackDelay());
  }

  function startAttack(options) {
    const opts = options || {};
    if (!requireMutable("start Browser OS 3.0 synthetic attack")) return;
    if (v3.attack.status === "COMPLETE" || v3.attack.stageIndex >= M.ATTACK_STAGES.length - 1) resetScenario({ keepRecruiter: true });
    if (v3.attack.stageIndex < 0) {
      v3.attack.startedAt = now();
      v3.commander.status = "NEW";
      v3.commander.confidence = 20;
      ensureCoreEntities();
    }
    v3.attack.status = "RUNNING";
    if (opts.speed) v3.attack.speed = Number(opts.speed);
    save();
    stopAttackTimerOnly();
    executeStage(v3.attack.stageIndex + 1);
    if (v3.attack.status === "RUNNING") scheduleNextStage();
    renderV3All();
  }

  function pauseAttack() {
    if (v3.attack.status !== "RUNNING") return;
    stopAttackTimerOnly();
    v3.attack.status = "PAUSED";
    v3.attack.pausedAt = now();
    save();
    renderV3All();
  }

  function resumeAttack() {
    if (v3.attack.status !== "PAUSED") return;
    v3.attack.status = "RUNNING";
    save();
    scheduleNextStage();
    renderV3All();
  }

  function stepAttack() {
    if (!requireMutable("step synthetic attack")) return;
    stopAttackTimerOnly();
    const next = v3.attack.stageIndex + 1;
    if (next < M.ATTACK_STAGES.length) executeStage(next);
  }

  function stopAttackTimerOnly() {
    if (attackTimer) window.clearTimeout(attackTimer);
    attackTimer = null;
  }

  function stopAttack(updateStatus) {
    stopAttackTimerOnly();
    if (updateStatus !== false && v3.attack.status === "RUNNING") v3.attack.status = "PAUSED";
    save();
  }

  function runDetection(recordHistory) {
    const result = M.evaluateDetection(v3.attack.events, v3.detectionStudio.tuning);
    const benign = M.falsePositiveCandidate(v3.detectionStudio.tuning);
    if (!v3.detectionStudio.baseline) {
      v3.detectionStudio.baseline = {
        tuning: M.deepClone(v3.detectionStudio.tuning),
        result: M.deepClone(result),
        benign: M.deepClone(benign),
        time: now()
      };
    }
    v3.detectionStudio.current = result;
    if (recordHistory !== false) {
      v3.detectionStudio.history.unshift({
        time: now(),
        tuning: M.deepClone(v3.detectionStudio.tuning),
        result: M.deepClone(result),
        benign: M.deepClone(benign)
      });
      v3.detectionStudio.history = v3.detectionStudio.history.slice(0, 25);
      analystAction("detection.run", `BOS3-DET-301 score=${result.score} promoted=${result.promoted} signals=${result.matchedCount}`, "detection");
    }
    if (result.promoted) {
      v3.commander.confidence = Math.max(v3.commander.confidence, M.confidenceFromState(v3));
    }
    save();
    return { result, benign };
  }

  function setDetectionTuning(field, value) {
    if (!requireMutable("tune detection analytic")) return;
    if (field === "minSignals" || field === "scoreThreshold" || field === "beaconJitterMaxPercent") value = Number(value);
    if (field === "requireProcessLineage" || field === "requireNetworkSignal" || field === "suppressKnownUpdater") value = Boolean(value);
    v3.detectionStudio.tuning[field] = value;
    save();
    renderDetectionStudio();
  }

  function updateIncidentStatus(next) {
    if (!requireMutable("change incident status")) return;
    const current = v3.commander.status;
    if (!M.transitionAllowed(current, next)) {
      toast("Workflow guard", `${current} cannot transition directly to ${next}. Follow the incident lifecycle.`, "warn");
      return;
    }
    v3.commander.status = next;
    const incident = ensureIncident();
    incident.status = next;
    if (state.advanced) {
      const case301 = state.advanced.cases.find(item => item.id === "CASE-0301");
      if (case301) case301.status = next === "CLOSED" ? "CLOSED" : "OPEN";
    }
    analystAction("incident.status", `${current} → ${next}`, "incident");
    save();
    renderV3All();
    renderAll();
  }

  function addResponseFirewallRule() {
    if (!state.firewallRules.some(rule => rule.description === "BOS3 block INC-301 C2 IOC")) {
      const id = Math.max(60, ...state.firewallRules.map(rule => Number(rule.id) || 0)) + 10;
      state.firewallRules.splice(Math.max(0, state.firewallRules.length - 1), 0, {
        id,
        action: "deny",
        protocol: "TCP",
        source: "192.0.2.108",
        destination: "203.0.113.200",
        port: "443",
        enabled: true,
        description: "BOS3 block INC-301 C2 IOC"
      });
    }
  }

  function isolateHost() {
    if (!requireMutable("isolate WS-108")) return;
    v3.commander.containment.hostIsolated = true;
    v3.commander.status = "CONTAINING";
    const incident = ensureIncident();
    incident.status = "CONTAINING";
    state.connections.forEach(connection => {
      if (String(connection.local).startsWith("192.0.2.108") && String(connection.remote).startsWith("203.0.113.200")) {
        connection.state = "BLOCKED";
        connection.policy = "ISOLATION";
      }
    });
    addLog("response", "high", "[BOS3] WS-108 isolated from synthetic untrusted egress; SOC management exception retained");
    addEvidence("response", "Response Engine", "WS-108 endpoint isolation applied", "C2 egress blocked; synthetic SOC management exception preserved", "verification-window");
    analystAction("response.isolate", "WS-108 isolated; malicious egress blocked while management path retained.", "response");
    save();
    renderV3All();
    renderAll();
  }

  function blockIOC() {
    if (!requireMutable("block INC-301 IOC")) return;
    addResponseFirewallRule();
    v3.commander.containment.iocBlocked = true;
    state.connections.forEach(connection => {
      if (String(connection.remote).startsWith("203.0.113.200")) {
        connection.state = "BLOCKED";
        connection.policy = "DENY IOC";
      }
    });
    addLog("firewall", "high", "[BOS3] response policy denies 192.0.2.108 -> 203.0.113.200 TCP/443 IOC=blocked");
    addEvidence("firewall", "Firewall Manager", "INC-301 destination IOC blocked", "DENY 192.0.2.108 -> 203.0.113.200 TCP/443", "firewall-window");
    analystAction("response.block-ioc", "Blocked 203.0.113.200:443 for WS-108 in the virtual firewall.", "firewall");
    save();
    renderV3All();
    renderAll();
  }

  function revokeSessions() {
    if (!requireMutable("revoke mturner sessions")) return;
    state.sessions.forEach(session => {
      if (session.username === "mturner") session.status = "revoked";
    });
    v3.commander.containment.sessionsRevoked = true;
    addLog("identity", "high", "[BOS3] mturner synthetic sessions revoked due to INC-301 credential risk");
    addEvidence("identity", "Identity & Session Center", "mturner sessions revoked", "All synthetic mturner session handles status=revoked", "identity-window");
    analystAction("response.revoke-sessions", "Revoked synthetic mturner sessions after credential-access evidence.", "identity");
    save();
    renderV3All();
    renderAll();
  }

  function removePersistence() {
    if (!requireMutable("remove synthetic persistence")) return;
    v3.attack.persistencePresent = false;
    v3.commander.containment.persistenceRemoved = true;
    if (v3.commander.status === "CONTAINING") {
      v3.commander.status = "REMEDIATING";
      const incident = ensureIncident();
      incident.status = "REMEDIATING";
    }
    addLog("registry", "high", "[BOS3] remediation removed HKCU Run OneDriveHealth synthetic persistence");
    addEvidence("registry", "Remediation", "Synthetic Run-key persistence removed", "HKCU Run OneDriveHealth absent", "verification-window");
    analystAction("response.remove-persistence", "Removed OneDriveHealth synthetic Run-key persistence.", "registry");
    save();
    renderV3All();
  }

  function rebootEndpoint() {
    if (!requireMutable("reboot synthetic endpoint")) return;
    [2104, 2110, 2116].forEach(pid => {
      const process = state.processes.find(item => item.pid === pid);
      if (process) process.status = "TERMINATED";
    });
    state.connections.forEach(connection => {
      if (String(connection.local).startsWith("192.0.2.108")) connection.state = connection.state === "BLOCKED" ? "BLOCKED" : "CLOSED";
    });
    v3.commander.containment.endpointRebooted = true;
    if (v3.attack.persistencePresent) {
      pushProcess({ pid: 2116, ppid: 1, user: "mturner", name: "rundll32.exe", cpu: 1.1, mem: 19, status: "RUNNING", protected: false, cmd: "rundll32.exe javascript:synthetic-browser-os-demo [restored by Run key]" });
      addLog("system", "critical", "[BOS3] WS-108 reboot validation FAILED: synthetic persistence recreated rundll32.exe");
    } else {
      addLog("system", "info", "[BOS3] WS-108 reboot validation: malicious process lineage did not return");
    }
    analystAction("response.reboot", v3.attack.persistencePresent ? "WS-108 rebooted; persistence returned." : "WS-108 rebooted; malicious lineage did not return.", "recovery");
    save();
    renderV3All();
    renderAll();
  }

  function runVerification(record) {
    const suite = M.verificationResults(v3);
    v3.verification.lastRun = now();
    v3.verification.score = suite.score;
    v3.verification.results = suite.results;
    if (record !== false) {
      analystAction("verification.run", `${suite.passed}/${suite.total} checks passed (${suite.score}%).`, "verification");
      suite.results.forEach(item => addLog("verification", item.pass ? "info" : "warn", `[BOS3] ${item.pass ? "PASS" : "FAIL"} ${item.id} ${item.name} expected=${item.expected} actual=${item.actual}`));
    }
    if (suite.score === 100) {
      v3.commander.recovery = "Containment validated: C2 denied, management retained, persistence absent, sessions revoked, segmentation effective, clean reboot demonstrated.";
      if (v3.commander.status === "REMEDIATING") v3.commander.status = "VALIDATING";
    }
    save();
    renderV3All();
    return suite;
  }

  function generateReports(record) {
    v3.commander.confidence = M.confidenceFromState(v3);
    v3.reports.executive = M.executiveReport(v3);
    v3.reports.technical = M.technicalReport(v3);
    v3.reports.generatedAt = now();
    if (record !== false) analystAction("report.generate", "Executive and technical incident reports generated from recorded Browser OS state.", "reporting");
    save();
    renderReporting();
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => toast("Copied", "Report copied to clipboard.", "info")).catch(() => toast("Copy unavailable", "Select the report text manually.", "warn"));
    } else {
      toast("Copy unavailable", "Select the report text manually.", "warn");
    }
  }

  function downloadText(filename, text) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function windowShell(id, icon, title, body, extraClass) {
    const section = document.createElement("section");
    section.id = id;
    section.className = `os-window wide-window v3-window ${extraClass || ""}`.trim();
    section.dataset.appName = title;
    section.setAttribute("role", "dialog");
    section.setAttribute("aria-label", title);
    section.innerHTML = `
      <header class="window-titlebar drag-handle">
        <div class="window-title"><span class="window-app-icon">${h(icon)}</span>${h(title)}</div>
        <div class="window-controls">
          <button class="window-control" data-minimize-window type="button" aria-label="Minimize ${h(title)}">—</button>
          <button class="window-control" data-maximize-window type="button" aria-label="Maximize ${h(title)}">□</button>
          <button class="window-control close" data-close-window type="button" aria-label="Close ${h(title)}">×</button>
        </div>
      </header>
      <div class="window-content">${body}</div>`;
    return section;
  }

  function mountWindow(section) {
    const desktop = byId("desktop");
    const taskbar = q(".taskbar", desktop || document);
    if (!desktop || !taskbar) return;
    desktop.insertBefore(section, taskbar);
    section.querySelector("[data-close-window]")?.addEventListener("click", () => closeWindow(section));
    section.querySelector("[data-minimize-window]")?.addEventListener("click", () => minimizeWindow(section));
    section.querySelector("[data-maximize-window]")?.addEventListener("click", () => toggleMaximize(section));
    section.addEventListener("mousedown", () => bringToFront(section));
    section.querySelector(".drag-handle")?.addEventListener("pointerdown", startDrag);
  }

  function buildWindows() {
    if (byId("recruiter-window")) return;
    const windows = [
      windowShell("recruiter-window", "★", "Recruiter Demo", `
        <div class="v3-hero">
          <div>
            <div class="eyebrow">FIVE-MINUTE PORTFOLIO WALKTHROUGH</div>
            <h2>Live Attack → Investigation → Response</h2>
            <p>Watch a synthetic intrusion unfold across independent telemetry, then switch into analyst mode to validate, contain, verify and report it.</p>
          </div>
          <div class="v3-hero-score"><strong id="v3-recruiter-progress">0%</strong><span>walkthrough</span></div>
        </div>
        <div class="v3-truth-strip"><strong>Truth model:</strong> enterprise telemetry is synthetic; correlation, rule evaluation, state transitions, evidence graph, response verification and reporting are implemented application logic.</div>
        <div class="v3-attack-console">
          <div class="v3-attack-status"><span id="v3-attack-dot"></span><strong id="v3-attack-status">IDLE</strong><small id="v3-attack-stage">Ready to begin</small></div>
          <div class="button-row">
            <button id="v3-live-start" class="primary-button" type="button">▶ Start Live Attack</button>
            <button id="v3-live-pause" class="ghost-button" type="button">Pause</button>
            <button id="v3-live-step" class="ghost-button" type="button">Step Event</button>
            <button id="v3-switch-analyst" class="primary-button" type="button">Switch to Analyst View</button>
            <button id="v3-live-reset" class="ghost-button" type="button">Reset Scenario</button>
          </div>
          <label class="v3-speed">Attack playback <select id="v3-attack-speed" class="os-select"><option value="0.5">0.5×</option><option value="1" selected>1×</option><option value="2">2×</option><option value="4">4×</option></select></label>
        </div>
        <div class="v3-recruiter-layout">
          <section class="v3-panel"><div class="v3-panel-head"><h3>Guided recruiter path</h3><span id="v3-recruiter-counter">0 / 7</span></div><div id="v3-recruiter-steps" class="v3-step-list"></div></section>
          <section class="v3-panel"><div class="v3-panel-head"><h3>Live scenario stream</h3><span id="v3-live-count">0 events</span></div><div id="v3-live-stream" class="v3-live-stream"></div></section>
        </div>
      `, "v3-recruiter-window"),
      windowShell("evidence-graph-window", "⌬", "Evidence Graph", `
        <div class="tool-header"><div><div class="eyebrow">ENTITY RELATIONSHIP INVESTIGATION</div><h2>Evidence Graph</h2></div><div class="button-row"><button id="v3-graph-refresh" class="ghost-button compact">Refresh</button><button id="v3-graph-center" class="ghost-button compact">Center Incident</button></div></div>
        <div class="v3-graph-layout"><section class="v3-graph-canvas" id="v3-graph-canvas"><svg id="v3-graph-svg" aria-hidden="true"></svg><div id="v3-graph-nodes"></div></section><aside class="v3-panel"><h3>Selected entity</h3><div id="v3-graph-detail" class="v3-detail">Select a node to inspect evidence and pivot.</div></aside></div>
      `),
      windowShell("detection-studio-window", "⌁", "Detection Studio", `
        <div class="tool-header"><div><div class="eyebrow">DETECTION ENGINEERING</div><h2>BOS3-DET-301 · Multi-Source Intrusion Correlation</h2></div><button id="v3-detect-run" class="primary-button compact">Run Analytic</button></div>
        <div class="v3-detect-grid">
          <section class="v3-panel"><h3>Rule logic</h3><pre id="v3-detection-logic" class="v3-code"></pre><div class="v3-form-grid">
            <label>Minimum matched signals<input id="v3-tune-signals" type="range" min="1" max="8" step="1"><output id="v3-tune-signals-value"></output></label>
            <label>Promotion score threshold<input id="v3-tune-score" type="range" min="20" max="100" step="1"><output id="v3-tune-score-value"></output></label>
            <label><input id="v3-tune-lineage" type="checkbox"> Require Office → PowerShell lineage</label>
            <label><input id="v3-tune-network" type="checkbox"> Require DNS + process-network correlation</label>
            <label><input id="v3-tune-updater" type="checkbox"> Suppress known updater context</label>
          </div></section>
          <section class="v3-panel"><h3>Current evaluation</h3><div id="v3-detection-result"></div></section>
          <section class="v3-panel"><h3>False-positive control</h3><div id="v3-fp-result"></div></section>
          <section class="v3-panel"><h3>Before / after comparison</h3><div id="v3-detect-compare"></div></section>
        </div>
      `),
      windowShell("incident-command-window", "◆", "Incident Commander", `
        <div class="v3-command-head"><div><div class="eyebrow">INCIDENT COMMAND</div><h2>INC-301 · WS-108 Multi-Source Intrusion</h2><p id="v3-command-summary"></p></div><div class="v3-command-score"><strong id="v3-command-confidence">0%</strong><span>confidence</span></div></div>
        <div class="metric-grid"><article class="metric-card"><span>Status</span><strong id="v3-command-status"></strong></article><article class="metric-card"><span>Severity</span><strong id="v3-command-severity"></strong></article><article class="metric-card"><span>Evidence</span><strong id="v3-command-evidence"></strong></article><article class="metric-card"><span>Verification</span><strong id="v3-command-verification"></strong></article></div>
        <div class="v3-command-layout">
          <section class="v3-panel"><h3>Incident lifecycle</h3><div id="v3-status-flow" class="v3-status-flow"></div><h3>Response controls</h3><div class="v3-response-grid"><button data-v3-response="isolate">Isolate WS-108</button><button data-v3-response="block">Block C2 IOC</button><button data-v3-response="revoke">Revoke mturner Sessions</button><button data-v3-response="persistence">Remove Persistence</button><button data-v3-response="reboot">Reboot Endpoint</button><button data-v3-response="verify" class="primary-button">Run Validation</button></div><div id="v3-containment-state" class="v3-containment-grid"></div></section>
          <section class="v3-panel"><h3>Commander's assessment</h3><div class="form-stack"><label>Owner<select id="v3-commander-owner" class="os-select"><option>soc</option><option>forensics</option><option>admin</option></select></label><label>Escalation<select id="v3-commander-escalation" class="os-select"><option>Not escalated</option><option>SOC Lead</option><option>Incident Commander</option><option>Executive notification</option></select></label><label>Business impact<textarea id="v3-commander-impact" class="v3-textarea"></textarea></label><label>Root cause<textarea id="v3-commander-root" class="v3-textarea"></textarea></label><label>Recovery<textarea id="v3-commander-recovery" class="v3-textarea"></textarea></label><label>Lessons learned<textarea id="v3-commander-lessons" class="v3-textarea"></textarea></label><button id="v3-commander-save" class="primary-button">Save Assessment</button></div></section>
        </div>
      `),
      windowShell("attack-timeline-window", "◴", "Attack Timeline", `
        <div class="tool-header"><div><div class="eyebrow">INVESTIGATION TIMELINE</div><h2>INC-301 Event Reconstruction</h2></div><div class="filter-bar"><select id="v3-timeline-filter" class="os-select"><option value="all">All evidence</option><option>process</option><option>network</option><option>dns</option><option>registry</option><option>memory</option><option>firewall</option><option>detection</option><option>analyst</option></select></div></div>
        <div id="v3-timeline" class="v3-timeline"></div>
      `),
      windowShell("verification-window", "✓", "Response Verification", `
        <div class="v3-verify-head"><div><div class="eyebrow">PROVE THE CONTROL WORKED</div><h2>Post-Containment Validation</h2><p>Security actions are not considered complete until the expected malicious path fails and necessary management paths still work.</p></div><button id="v3-verify-run" class="primary-button">Run Verification Suite</button></div>
        <div class="v3-score-card"><strong id="v3-verify-score">0%</strong><div><span>Validation score</span><p id="v3-verify-summary">No suite executed yet.</p></div></div>
        <div id="v3-verification-results" class="v3-verification-results"></div>
      `),
      windowShell("reporting-window", "▧", "Incident Reports", `
        <div class="tool-header"><div><div class="eyebrow">TECHNICAL + EXECUTIVE COMMUNICATION</div><h2>Incident Report Builder</h2></div><div class="button-row"><button id="v3-report-generate" class="primary-button compact">Generate Reports</button><button id="v3-report-copy" class="ghost-button compact">Copy</button><button id="v3-report-download" class="ghost-button compact">Download .txt</button></div></div>
        <div class="v3-tabs"><button class="v3-tab active" data-v3-report="executive">Executive Brief</button><button class="v3-tab" data-v3-report="technical">Technical Report</button></div><textarea id="v3-report-output" class="v3-report-output" spellcheck="false" readonly></textarea><div id="v3-report-meta" class="security-note"></div>
      `),
      windowShell("architecture-window", "▦", "Architecture", `
        <div class="tool-header"><div><div class="eyebrow">ENGINEERING VIEW</div><h2>Browser OS 3.0 Architecture</h2></div><div class="status-pill good">STATIC / LOCAL</div></div><div class="v3-architecture-layout"><section id="v3-architecture-flow" class="v3-architecture-flow"></section><aside id="v3-architecture-detail" class="v3-panel"></aside></div>
      `),
      windowShell("engineering-window", "⚒", "Engineering Proof", `
        <div class="v3-engineering-head"><div><div class="eyebrow">SOFTWARE ENGINEERING EVIDENCE</div><h2>Build Quality & Security Invariants</h2></div><div class="v3-test-badge"><strong id="v3-test-count">—</strong><span>assertions passed</span></div></div>
        <div class="v3-engineering-grid"><section class="v3-panel"><h3>Automated validation</h3><div id="v3-test-summary"></div></section><section class="v3-panel"><h3>Security invariants</h3><div id="v3-invariants"></div></section><section class="v3-panel"><h3>Engineering artifacts</h3><div id="v3-engineering-artifacts"></div></section><section class="v3-panel"><h3>Threat model</h3><div id="v3-threat-summary"></div></section></div>
      `),
      windowShell("truth-window", "◎", "Truth & Security Boundary", `
        <div class="v3-truth-head"><div><div class="eyebrow">PORTFOLIO INTEGRITY</div><h2>What is synthetic, what is real, and what Browser OS cannot do</h2></div><div class="status-pill good">EXPLICIT TRUTH MODEL</div></div><div class="v3-truth-grid"><section class="v3-panel"><h3>Synthetic enterprise data</h3><div id="v3-truth-synthetic"></div></section><section class="v3-panel"><h3>Implemented application logic</h3><div id="v3-truth-real"></div></section><section class="v3-panel"><h3>Permanent security boundary</h3><div id="v3-truth-boundary"></div></section></div>
      `)
    ];
    windows.forEach(mountWindow);
  }

  function mountLauncher(app) {
    const startApps = byId("start-apps") || q(".start-apps");
    if (startApps && !startApps.querySelector(`[data-open-app="${app.id}"]`)) {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.openApp = app.id;
      button.innerHTML = `<span>${h(app.icon)}</span>${h(app.name)}`;
      button.addEventListener("click", () => { openV3(app.id); setStartMenu(false); });
      startApps.appendChild(button);
    }
    const desktopIcons = q(".desktop-icons");
    if (app.desktop && desktopIcons && !desktopIcons.querySelector(`[data-open-app="${app.id}"]`)) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "desktop-icon v3-desktop-icon";
      button.dataset.openApp = app.id;
      button.innerHTML = `<span class="desktop-icon-symbol">${h(app.icon)}</span><span>${h(app.name)}</span>`;
      button.addEventListener("click", () => openV3(app.id));
      desktopIcons.appendChild(button);
    }
  }

  function simplifyDesktopLaunchers() {
    qa(".desktop-icons .adv-icon").forEach(node => node.remove());
  }

  function mountBootRecruiter() {
    const actions = q(".boot-actions");
    if (!actions || byId("v3-boot-recruiter")) return;
    const button = document.createElement("button");
    button.id = "v3-boot-recruiter";
    button.className = "v3-recruiter-boot";
    button.type = "button";
    button.innerHTML = `<strong>★ Start 5-Minute Recruiter Demo</strong><span>Live attack → investigation → containment → proof → report</span>`;
    actions.insertAdjacentElement("beforebegin", button);
    button.addEventListener("click", () => {
      v3.recruiter.active = true;
      v3.recruiter.startedAt = now();
      v3.recruiter.step = 0;
      v3.recruiter.completed = [];
      save();
      runBoot("standard", true);
      waitForDesktop(() => {
        openV3("recruiter-window");
        startRecruiterDemo();
      });
    });
  }

  function waitForDesktop(callback) {
    if (bootPollTimer) window.clearInterval(bootPollTimer);
    let attempts = 0;
    bootPollTimer = window.setInterval(() => {
      attempts += 1;
      if (state.booted && !byId("desktop")?.classList.contains("hidden")) {
        window.clearInterval(bootPollTimer);
        bootPollTimer = null;
        callback();
      } else if (attempts > 60) {
        window.clearInterval(bootPollTimer);
        bootPollTimer = null;
      }
    }, 50);
  }

  function openV3(id) {
    openWindow(id);
    renderV3App(id);
    if (v3.recruiter.active) markRecruiterByApp(id);
  }

  function renderV3App(id) {
    if (id === "recruiter-window") renderRecruiter();
    if (id === "evidence-graph-window") renderEvidenceGraph();
    if (id === "detection-studio-window") renderDetectionStudio();
    if (id === "incident-command-window") renderIncidentCommander();
    if (id === "attack-timeline-window") renderTimeline();
    if (id === "verification-window") renderVerification();
    if (id === "reporting-window") renderReporting();
    if (id === "architecture-window") renderArchitecture();
    if (id === "engineering-window") renderEngineering();
    if (id === "truth-window") renderTruth();
  }

  function renderV3All() {
    APP_LIST.forEach(app => {
      const node = byId(app.id);
      if (node && node.classList.contains("visible")) renderV3App(app.id);
    });
    renderRecruiter();
  }

  function startRecruiterDemo() {
    v3.recruiter.active = true;
    v3.recruiter.startedAt = v3.recruiter.startedAt || now();
    save();
    openV3("recruiter-window");
    if (v3.attack.status === "IDLE") startAttack({ speed: 1 });
    renderRecruiter();
  }

  function markRecruiterStep(id) {
    if (!v3.recruiter.completed.includes(id)) v3.recruiter.completed.push(id);
    const index = M.RECRUITER_STEPS.findIndex(step => step.id === id);
    if (index >= 0) v3.recruiter.step = Math.min(M.RECRUITER_STEPS.length - 1, index + 1);
    save();
    renderRecruiter();
  }

  function markRecruiterByApp(appId) {
    const step = M.RECRUITER_STEPS.find(item => item.app === appId);
    if (step && step.id !== "R-01") markRecruiterStep(step.id);
  }

  function switchAnalystView() {
    markRecruiterStep("R-01");
    openV3("incident-command-window");
    toast("Analyst View", "INC-301 is ready for evidence-driven triage and response.", "info");
  }

  function recruiterOpenStep(index) {
    const step = M.RECRUITER_STEPS[index];
    if (!step) return;
    v3.recruiter.step = index;
    save();
    if (step.id === "R-01") {
      openV3("recruiter-window");
      if (v3.attack.status === "IDLE") startAttack();
    } else {
      openV3(step.app);
    }
    markRecruiterStep(step.id);
  }

  function renderRecruiter() {
    if (!byId("v3-recruiter-steps")) return;
    const progress = M.recruiterProgress(v3);
    setText("v3-recruiter-progress", progress.percent + "%");
    setText("v3-recruiter-counter", `${progress.complete} / ${progress.total}`);
    setText("v3-live-count", `${v3.attack.events.length} events`);
    setText("v3-attack-status", v3.attack.status);
    const last = v3.attack.events[v3.attack.events.length - 1];
    setText("v3-attack-stage", last ? `${last.offset} · ${last.title}` : "Ready to begin");
    const dot = byId("v3-attack-dot");
    if (dot) dot.className = v3.attack.status === "RUNNING" ? "running" : v3.attack.status === "AWAITING_ANALYST" ? "alert" : "";
    const start = byId("v3-live-start");
    if (start) start.textContent = v3.attack.status === "PAUSED" ? "▶ Resume Live Attack" : v3.attack.status === "RUNNING" ? "Attack Running…" : "▶ Start Live Attack";
    const pause = byId("v3-live-pause");
    if (pause) pause.disabled = v3.attack.status !== "RUNNING";
    const steps = byId("v3-recruiter-steps");
    steps.innerHTML = M.RECRUITER_STEPS.map((step, index) => {
      const complete = v3.recruiter.completed.includes(step.id);
      const active = index === v3.recruiter.step;
      return `<button class="v3-step ${complete ? "complete" : ""} ${active ? "active" : ""}" data-v3-recruiter-step="${index}"><span>${complete ? "✓" : String(index + 1).padStart(2, "0")}</span><div><strong>${h(step.title)}</strong><p>${h(step.instruction)}</p></div><em>Open →</em></button>`;
    }).join("");
    const stream = byId("v3-live-stream");
    if (stream) stream.innerHTML = v3.attack.events.slice().reverse().map(event => `<article class="v3-stream-event ${h(event.severity.toLowerCase())}"><time>${h(event.offset)}</time><div><span>${h(event.phase)}</span><strong>${h(event.title)}</strong><p>${h(event.detail)}</p></div></article>`).join("") || `<div class="v3-empty">Press <strong>Start Live Attack</strong> to generate the first synthetic event.</div>`;
  }

  function graphNodeById(id) {
    return M.buildEvidenceGraph(v3).nodes.find(node => node.id === id) || null;
  }

  function renderEvidenceGraph() {
    const graph = M.buildEvidenceGraph(v3);
    const nodeWrap = byId("v3-graph-nodes");
    const svg = byId("v3-graph-svg");
    if (!nodeWrap || !svg) return;
    nodeWrap.innerHTML = graph.nodes.map(node => `<button class="v3-graph-node ${h(node.type)} ${h(String(node.status).toLowerCase())} ${v3.ui.selectedGraphNode === node.id ? "selected" : ""}" style="left:${node.x}%;top:${node.y}%" data-v3-graph-node="${h(node.id)}"><span>${h(node.type)}</span><strong>${h(node.label)}</strong><small>${h(node.status)}</small></button>`).join("");
    svg.innerHTML = "";
    const ns = "http://www.w3.org/2000/svg";
    graph.edges.forEach(edge => {
      const from = graph.nodes.find(node => node.id === edge.from);
      const to = graph.nodes.find(node => node.id === edge.to);
      if (!from || !to) return;
      const line = document.createElementNS(ns, "line");
      line.setAttribute("x1", from.x + "%"); line.setAttribute("y1", from.y + "%"); line.setAttribute("x2", to.x + "%"); line.setAttribute("y2", to.y + "%");
      line.setAttribute("class", "v3-graph-edge");
      svg.appendChild(line);
    });
    renderGraphDetail(graphNodeById(v3.ui.selectedGraphNode));
  }

  function evidenceForNode(node) {
    if (!node) return [];
    const map = {
      user: ["identity"], endpoint: ["email", "process", "network", "firewall"], process: ["process", "memory"], registry: ["registry"], dns: ["dns", "packet"], ip: ["network", "packet", "firewall"], memory: ["memory"], server: ["network", "firewall"], detection: ["detection"], incident: ["detection", "analyst", "response"]
    };
    return v3.evidence.filter(item => (map[node.type] || []).includes(item.type));
  }

  function renderGraphDetail(node) {
    const detail = byId("v3-graph-detail");
    if (!detail) return;
    if (!node) { detail.textContent = "Select a node to inspect evidence and pivot."; return; }
    const evidence = evidenceForNode(node);
    detail.innerHTML = `<div class="v3-node-title"><span class="v3-node-type">${h(node.type)}</span><h3>${h(node.label)}</h3><strong>${h(node.status)}</strong></div><p>Pivot target: ${h(PIVOT_LABELS[node.pivot] || node.pivot)}</p><button class="primary-button compact" data-v3-pivot="${h(node.pivot)}">Open ${h(PIVOT_LABELS[node.pivot] || "Evidence")}</button><h4>Correlated evidence</h4><div class="v3-evidence-mini">${evidence.map(item => `<article><strong>${h(item.source)}</strong><span>${h(item.description)}</span></article>`).join("") || "No evidence captured yet."}</div>`;
  }

  function pivotTo(target) {
    if (!target) return;
    if (target === "process-window") {
      openWindow(target);
      const process = state.processes.find(item => item.pid === 2116) || state.processes.find(item => item.pid === 2110);
      if (process && typeof showProcessDetail === "function") showProcessDetail(process.pid);
      return;
    }
    if (APP_LIST.some(app => app.id === target)) openV3(target);
    else openWindow(target);
  }

  function renderDetectionStudio() {
    if (!byId("v3-detection-result")) return;
    const cfg = v3.detectionStudio.tuning;
    const current = v3.detectionStudio.current || M.evaluateDetection(v3.attack.events, cfg);
    const fp = M.falsePositiveCandidate(cfg);
    setText("v3-tune-signals-value", cfg.minSignals);
    setText("v3-tune-score-value", cfg.scoreThreshold);
    const signals = byId("v3-tune-signals"); if (signals) signals.value = cfg.minSignals;
    const score = byId("v3-tune-score"); if (score) score.value = cfg.scoreThreshold;
    const lineage = byId("v3-tune-lineage"); if (lineage) lineage.checked = cfg.requireProcessLineage;
    const network = byId("v3-tune-network"); if (network) network.checked = cfg.requireNetworkSignal;
    const updater = byId("v3-tune-updater"); if (updater) updater.checked = cfg.suppressKnownUpdater;
    setText("v3-detection-logic", [
      "RULE BOS3-DET-301",
      "PROMOTE WHEN:",
      `  matched suspicious signals >= ${cfg.minSignals}`,
      `  confidence score >= ${cfg.scoreThreshold}`,
      `  Office → PowerShell lineage required = ${cfg.requireProcessLineage}`,
      `  DNS + process-network correlation required = ${cfg.requireNetworkSignal}`,
      `  known updater suppression = ${cfg.suppressKnownUpdater}`,
      "",
      "CORRELATED SIGNAL FAMILIES:",
      "  process | registry | dns | network | memory | firewall",
      "",
      "This analytic evaluates local synthetic telemetry only."
    ].join("\n"));
    setHtml("v3-detection-result", `<div class="v3-detect-score ${current.promoted ? "promoted" : "pending"}"><strong>${current.score}</strong><span>/ 100</span><em>${current.promoted ? "PROMOTED" : "NOT PROMOTED"}</em></div><p>${h(current.rationale)}</p><div class="v3-chip-row">${current.matchedSignals.map(signal => `<span>${h(signal)}</span>`).join("")}</div><div class="v3-kv"><span>Independent telemetry</span><strong>${h(current.independentFamilies.join(", ") || "none")}</strong><span>Process requirement</span><strong>${current.processSatisfied ? "PASS" : "FAIL"}</strong><span>Network requirement</span><strong>${current.networkSatisfied ? "PASS" : "FAIL"}</strong></div>`);
    setHtml("v3-fp-result", `<div class="v3-fp-card ${fp.suppressed ? "suppressed" : "review"}"><span>Candidate</span><strong>${h(fp.name)}</strong><p>${h(fp.process)} → ${h(fp.destination)}</p><div class="v3-kv"><span>Score</span><strong>${fp.score}</strong><span>Disposition</span><strong>${h(fp.disposition)}</strong></div><p>This demonstrates why periodic TLS by itself should not be treated as conclusive C2.</p></div>`);
    const baseline = v3.detectionStudio.baseline;
    setHtml("v3-detect-compare", baseline ? `<table class="data-table"><thead><tr><th>Metric</th><th>Baseline</th><th>Current</th></tr></thead><tbody><tr><td>Score</td><td>${baseline.result.score}</td><td>${current.score}</td></tr><tr><td>Promotion</td><td>${baseline.result.promoted ? "YES" : "NO"}</td><td>${current.promoted ? "YES" : "NO"}</td></tr><tr><td>Min signals</td><td>${baseline.tuning.minSignals}</td><td>${cfg.minSignals}</td></tr><tr><td>Score threshold</td><td>${baseline.tuning.scoreThreshold}</td><td>${cfg.scoreThreshold}</td></tr><tr><td>Updater disposition</td><td>${h(baseline.benign.disposition)}</td><td>${h(fp.disposition)}</td></tr></tbody></table>` : `<p>Run the analytic once to capture a baseline, then tune the rule and run it again.</p>`);
  }

  function renderIncidentCommander() {
    if (!byId("v3-command-status")) return;
    const completeness = M.calculateEvidenceCompleteness(v3);
    const verification = v3.verification.lastRun ? v3.verification.score + "%" : "Not run";
    v3.commander.confidence = M.confidenceFromState(v3);
    setText("v3-command-status", v3.commander.status);
    setText("v3-command-severity", v3.commander.severity);
    setText("v3-command-evidence", completeness.percent + "%");
    setText("v3-command-verification", verification);
    setText("v3-command-confidence", v3.commander.confidence + "%");
    setText("v3-command-summary", v3.commander.businessImpact);
    const statusFlow = byId("v3-status-flow");
    if (statusFlow) statusFlow.innerHTML = M.STATUS_FLOW.map(status => `<button class="v3-status-step ${status === v3.commander.status ? "active" : ""}" data-v3-status="${status}">${h(status)}</button>`).join("");
    const c = v3.commander.containment;
    setHtml("v3-containment-state", [
      ["Host isolated", c.hostIsolated], ["IOC blocked", c.iocBlocked], ["Sessions revoked", c.sessionsRevoked], ["Persistence removed", c.persistenceRemoved], ["Endpoint rebooted", c.endpointRebooted], ["SMB segmentation", v3.attack.segmentationBlocked]
    ].map(([label, ok]) => `<div class="${ok ? "pass" : "pending"}"><span>${ok ? "✓" : "○"}</span><strong>${h(label)}</strong></div>`).join(""));
    const owner = byId("v3-commander-owner"); if (owner) owner.value = v3.commander.owner;
    const escalation = byId("v3-commander-escalation"); if (escalation) escalation.value = v3.commander.escalation;
    const impact = byId("v3-commander-impact"); if (impact && document.activeElement !== impact) impact.value = v3.commander.businessImpact;
    const root = byId("v3-commander-root"); if (root && document.activeElement !== root) root.value = v3.commander.rootCause;
    const recovery = byId("v3-commander-recovery"); if (recovery && document.activeElement !== recovery) recovery.value = v3.commander.recovery;
    const lessons = byId("v3-commander-lessons"); if (lessons && document.activeElement !== lessons) lessons.value = v3.commander.lessons;
  }

  function saveCommanderAssessment() {
    if (!requireMutable("save incident commander assessment")) return;
    v3.commander.owner = byId("v3-commander-owner")?.value || v3.commander.owner;
    v3.commander.escalation = byId("v3-commander-escalation")?.value || v3.commander.escalation;
    v3.commander.businessImpact = M.text(byId("v3-commander-impact")?.value, 1200) || v3.commander.businessImpact;
    v3.commander.rootCause = M.text(byId("v3-commander-root")?.value, 1200) || v3.commander.rootCause;
    v3.commander.recovery = M.text(byId("v3-commander-recovery")?.value, 1200) || v3.commander.recovery;
    v3.commander.lessons = M.text(byId("v3-commander-lessons")?.value, 1200) || v3.commander.lessons;
    analystAction("incident.assessment", "Incident commander assessment updated.", "incident");
    toast("Assessment saved", "Incident command fields were saved to Browser OS local state.", "info");
  }

  function timelineItems() {
    const scenario = v3.attack.events.map(event => ({ id: event.id, time: event.offset, phase: event.phase, technique: event.technique, title: event.title, detail: event.detail, type: event.evidenceType, pivot: event.pivot, kind: "scenario" }));
    const actions = v3.analystActions.slice().reverse().map(action => ({ id: action.id, time: new Date(action.time).toLocaleTimeString([], { hour12: false }), phase: "ANALYST RESPONSE", technique: "IR", title: action.action, detail: action.detail, type: action.evidenceType, pivot: action.evidenceType === "verification" ? "verification-window" : "incident-command-window", kind: "analyst" }));
    return [...scenario, ...actions].sort((a, b) => String(a.time).localeCompare(String(b.time)));
  }

  function renderTimeline() {
    const root = byId("v3-timeline");
    if (!root) return;
    const filter = byId("v3-timeline-filter")?.value || "all";
    const items = timelineItems().filter(item => filter === "all" || item.type === filter);
    root.innerHTML = items.map(item => `<article class="v3-timeline-item ${h(item.kind)}"><div class="v3-timeline-time">${h(item.time)}</div><div class="v3-timeline-marker"></div><div class="v3-timeline-card"><div><span>${h(item.phase)}</span><em>${h(item.technique)}</em></div><button data-v3-timeline-id="${h(item.id)}"><strong>${h(item.title)}</strong><p>${h(item.detail)}</p><small>${h(item.type)} · click to pivot</small></button></div></article>`).join("") || `<div class="v3-empty">No timeline events match this filter.</div>`;
  }

  function renderVerification() {
    if (!byId("v3-verification-results")) return;
    const suite = v3.verification.lastRun ? { results: v3.verification.results, score: v3.verification.score, passed: v3.verification.results.filter(item => item.pass).length, total: v3.verification.results.length } : M.verificationResults(v3);
    setText("v3-verify-score", suite.score + "%");
    setText("v3-verify-summary", v3.verification.lastRun ? `${suite.passed}/${suite.total} controls currently pass. Last run ${new Date(v3.verification.lastRun).toLocaleTimeString()}.` : "Preview of expected verification results. Run the suite to record evidence.");
    setHtml("v3-verification-results", suite.results.map(item => `<article class="v3-verification ${item.pass ? "pass" : "fail"}"><div class="v3-verification-icon">${item.pass ? "✓" : "×"}</div><div><span>${h(item.id)}</span><strong>${h(item.name)}</strong><p>${h(item.evidence)}</p><div class="v3-kv-inline"><em>Expected ${h(item.expected)}</em><em>Actual ${h(item.actual)}</em></div></div></article>`).join(""));
  }

  function renderReporting() {
    if (!byId("v3-report-output")) return;
    if (!v3.reports.executive || !v3.reports.technical) generateReports(false);
    const tab = v3.ui.reportTab || "executive";
    qa("[data-v3-report]").forEach(button => button.classList.toggle("active", button.dataset.v3Report === tab));
    const output = byId("v3-report-output");
    output.value = tab === "technical" ? v3.reports.technical : v3.reports.executive;
    setText("v3-report-meta", `Generated ${v3.reports.generatedAt ? new Date(v3.reports.generatedAt).toLocaleString() : "on demand"}. All enterprise telemetry described in these reports is synthetic.`);
  }

  function renderArchitecture() {
    const flow = byId("v3-architecture-flow");
    const detail = byId("v3-architecture-detail");
    if (!flow || !detail) return;
    flow.innerHTML = M.ARCHITECTURE_MODULES.map((module, index) => `<button class="v3-arch-module ${module.id === v3.ui.architectureModule ? "active" : ""}" data-v3-arch="${h(module.id)}"><span>${String(index + 1).padStart(2, "0")}</span><strong>${h(module.name)}</strong><small>${h(module.purpose)}</small></button>${index < M.ARCHITECTURE_MODULES.length - 1 ? `<div class="v3-arch-arrow">↓</div>` : ""}`).join("");
    const module = M.ARCHITECTURE_MODULES.find(item => item.id === v3.ui.architectureModule) || M.ARCHITECTURE_MODULES[0];
    detail.innerHTML = `<div class="eyebrow">LAYER ${module.layer}</div><h3>${h(module.name)}</h3><p>${h(module.purpose)}</p><div class="v3-kv"><span>Inputs</span><strong>${h(module.inputs)}</strong><span>Outputs</span><strong>${h(module.outputs)}</strong><span>Trust model</span><strong>${h(module.trust)}</strong></div><div class="security-note">Architecture is intentionally browser-local. Synthetic enterprise behavior is modeled as state transitions; no external service is required for the demonstration.</div>`;
  }

  function loadEngineeringManifest() {
    const manifest = window.BROWSER_OS_TEST_MANIFEST || { assertions: 0, passed: 0, failed: 0, generated: "Not run" };
    v3.engineering.assertions = manifest.assertions || 0;
    v3.engineering.passed = manifest.passed || 0;
    v3.engineering.failed = manifest.failed || 0;
    v3.engineering.generated = manifest.generated || "Not run";
    save();
    return manifest;
  }

  function renderEngineering() {
    if (!byId("v3-test-summary")) return;
    const manifest = loadEngineeringManifest();
    setText("v3-test-count", manifest.passed || "—");
    setHtml("v3-test-summary", `<div class="v3-test-score ${manifest.failed ? "fail" : "pass"}"><strong>${manifest.failed ? "FAIL" : "PASS"}</strong><span>${manifest.passed}/${manifest.assertions} assertions</span><small>${h(manifest.generated || "build-time validation")}</small></div><ul><li>Model and state normalization tests</li><li>Attack-stage schema and ATT&CK mapping checks</li><li>Detection scoring/tuning tests</li><li>Incident lifecycle transition tests</li><li>Evidence graph consistency checks</li><li>Response-verification tests</li><li>Security-boundary static checks</li><li>HTML/CSS/JavaScript integration checks</li></ul>`);
    setHtml("v3-invariants", [
      "CSP retains connect-src 'none'",
      "No repository credentials or deployment secrets in Browser OS source",
      "No real host shell or OS process invocation",
      "No host File System Access API",
      "Synthetic IP space uses documentation ranges",
      "Forensics Mode mutations are blocked through the existing guard",
      "Response verification must preserve the approved management path",
      "Synthetic vs implemented behavior is labeled explicitly"
    ].map(item => `<div class="v3-invariant"><span>✓</span><strong>${h(item)}</strong></div>`).join(""));
    setHtml("v3-engineering-artifacts", [
      ["tests/run-tests.js", "Dependency-free Node assertion suite"],
      ["tests/test-runner.html", "Browser-facing test evidence page"],
      [".github/workflows/browser-os-ci.yml", "Automated syntax + invariant validation"],
      ["docs/THREAT-MODEL.md", "Assets, trust boundaries, threats and mitigations"],
      ["docs/KNOWN-LIMITATIONS.md", "Explicit limitations and non-claims"],
      ["docs/SECURITY-INVARIANTS.md", "Permanent project safety constraints"],
      ["docs/adr/", "Architecture decision records"],
      ["CHANGELOG.md", "Versioned engineering history"]
    ].map(([file, desc]) => `<div class="v3-artifact"><code>${h(file)}</code><span>${h(desc)}</span></div>`).join(""));
    setHtml("v3-threat-summary", `<p><strong>Primary asset:</strong> integrity of the public portfolio and clarity of its truth model.</p><p><strong>Primary risks:</strong> accidental secret publication, misleading production claims, script injection, unsafe external connectivity, state corruption and recruiter confusion.</p><p><strong>Design response:</strong> static CSP-restricted architecture, no external network client, namespaced state, explicit synthetic labels, read-only mode, encoded output, deterministic test suite and documented limitations.</p>`);
  }

  function renderTruth() {
    if (!byId("v3-truth-synthetic")) return;
    setHtml("v3-truth-synthetic", M.TRUTH_MODEL.synthetic.map(item => `<div class="v3-truth-item synthetic"><span>SYN</span><p>${h(item)}</p></div>`).join(""));
    setHtml("v3-truth-real", M.TRUTH_MODEL.real.map(item => `<div class="v3-truth-item real"><span>REAL</span><p>${h(item)}</p></div>`).join(""));
    setHtml("v3-truth-boundary", M.TRUTH_MODEL.boundary.map(item => `<div class="v3-truth-item boundary"><span>BOUNDARY</span><p>${h(item)}</p></div>`).join(""));
  }

  function bindEvents() {
    if (bound) return;
    bound = true;
    document.addEventListener("click", event => {
      const recruiterStep = event.target.closest("[data-v3-recruiter-step]");
      if (recruiterStep) recruiterOpenStep(Number(recruiterStep.dataset.v3RecruiterStep));
      const graphNode = event.target.closest("[data-v3-graph-node]");
      if (graphNode) {
        v3.ui.selectedGraphNode = graphNode.dataset.v3GraphNode;
        save();
        renderEvidenceGraph();
      }
      const pivot = event.target.closest("[data-v3-pivot]");
      if (pivot) pivotTo(pivot.dataset.v3Pivot);
      const status = event.target.closest("[data-v3-status]");
      if (status) updateIncidentStatus(status.dataset.v3Status);
      const response = event.target.closest("[data-v3-response]");
      if (response) {
        const action = response.dataset.v3Response;
        if (action === "isolate") isolateHost();
        if (action === "block") blockIOC();
        if (action === "revoke") revokeSessions();
        if (action === "persistence") removePersistence();
        if (action === "reboot") rebootEndpoint();
        if (action === "verify") runVerification();
      }
      const timeline = event.target.closest("[data-v3-timeline-id]");
      if (timeline) {
        const item = timelineItems().find(entry => entry.id === timeline.dataset.v3TimelineId);
        if (item) pivotTo(item.pivot);
      }
      const reportTab = event.target.closest("[data-v3-report]");
      if (reportTab) {
        v3.ui.reportTab = reportTab.dataset.v3Report;
        save();
        renderReporting();
      }
      const arch = event.target.closest("[data-v3-arch]");
      if (arch) {
        v3.ui.architectureModule = arch.dataset.v3Arch;
        save();
        renderArchitecture();
      }
    });

    byId("v3-live-start")?.addEventListener("click", () => v3.attack.status === "PAUSED" ? resumeAttack() : startAttack());
    byId("v3-live-pause")?.addEventListener("click", pauseAttack);
    byId("v3-live-step")?.addEventListener("click", stepAttack);
    byId("v3-switch-analyst")?.addEventListener("click", switchAnalystView);
    byId("v3-live-reset")?.addEventListener("click", () => resetScenario({ keepRecruiter: true }));
    byId("v3-attack-speed")?.addEventListener("change", event => { v3.attack.speed = Number(event.target.value); save(); if (v3.attack.status === "RUNNING") { stopAttackTimerOnly(); scheduleNextStage(); } });
    byId("v3-graph-refresh")?.addEventListener("click", renderEvidenceGraph);
    byId("v3-graph-center")?.addEventListener("click", () => { v3.ui.selectedGraphNode = "incident:INC-301"; save(); renderEvidenceGraph(); });
    byId("v3-detect-run")?.addEventListener("click", () => { runDetection(true); renderDetectionStudio(); markRecruiterStep("R-04"); });
    byId("v3-tune-signals")?.addEventListener("input", event => setDetectionTuning("minSignals", event.target.value));
    byId("v3-tune-score")?.addEventListener("input", event => setDetectionTuning("scoreThreshold", event.target.value));
    byId("v3-tune-lineage")?.addEventListener("change", event => setDetectionTuning("requireProcessLineage", event.target.checked));
    byId("v3-tune-network")?.addEventListener("change", event => setDetectionTuning("requireNetworkSignal", event.target.checked));
    byId("v3-tune-updater")?.addEventListener("change", event => setDetectionTuning("suppressKnownUpdater", event.target.checked));
    byId("v3-commander-save")?.addEventListener("click", saveCommanderAssessment);
    byId("v3-timeline-filter")?.addEventListener("change", renderTimeline);
    byId("v3-verify-run")?.addEventListener("click", () => { runVerification(true); markRecruiterStep("R-06"); });
    byId("v3-report-generate")?.addEventListener("click", () => { generateReports(true); markRecruiterStep("R-07"); });
    byId("v3-report-copy")?.addEventListener("click", () => copyText(byId("v3-report-output")?.value || ""));
    byId("v3-report-download")?.addEventListener("click", () => downloadText(v3.ui.reportTab === "technical" ? "INC-301-technical-report.txt" : "INC-301-executive-brief.txt", byId("v3-report-output")?.value || ""));
  }

  function installStateHooks() {
    if (typeof resetSimulation === "function" && !resetSimulation.__browserOS3Wrapped) {
      const coreReset = resetSimulation;
      const wrappedReset = function() {
        if (typeof isReadOnly === "function" && isReadOnly()) { coreReset(); return; }
        stopAttackTimerOnly();
        coreReset();
        v3 = M.normalizeState(state.v3);
        state.v3 = v3;
        ensureCoreEntities();
        loadEngineeringManifest();
        save();
        renderV3All();
      };
      wrappedReset.__browserOS3Wrapped = true;
      resetSimulation = wrappedReset;
    }
    if (typeof restoreSnapshot === "function" && !restoreSnapshot.__browserOS3Wrapped) {
      const coreRestore = restoreSnapshot;
      const wrappedRestore = function(id) {
        if (typeof isReadOnly === "function" && isReadOnly()) { coreRestore(id); return; }
        stopAttackTimerOnly();
        coreRestore(id);
        v3 = M.normalizeState(state.v3);
        state.v3 = v3;
        ensureCoreEntities();
        loadEngineeringManifest();
        save();
        renderV3All();
      };
      wrappedRestore.__browserOS3Wrapped = true;
      restoreSnapshot = wrappedRestore;
    }
  }

  function installPalette() {
    if (typeof paletteItems !== "function" || paletteItems.__browserOS3Wrapped) return;
    const core = paletteItems;
    const wrapped = function(query) {
      const normalized = String(query || "").toLowerCase();
      const base = core(query);
      const apps = APP_LIST.map(app => ({ id: app.id, name: app.name, type: "Browser OS 3.0", keywords: app.keywords, run: () => openV3(app.id) }));
      const actions = [
        { id: "v3-start-attack", name: "Start Browser OS 3.0 live attack", type: "Recruiter Action", keywords: "attack scenario recruiter", run: () => { openV3("recruiter-window"); startAttack(); } },
        { id: "v3-switch-analyst", name: "Switch to analyst view", type: "Recruiter Action", keywords: "analyst investigate incident", run: switchAnalystView },
        { id: "v3-verify", name: "Run INC-301 response verification", type: "Response Action", keywords: "verify containment", run: () => { openV3("verification-window"); runVerification(); } },
        { id: "v3-report", name: "Generate INC-301 reports", type: "Reporting Action", keywords: "report executive technical", run: () => { openV3("reporting-window"); generateReports(); } }
      ];
      const extra = apps.concat(actions);
      return normalized ? base.concat(extra.filter(item => (item.name + " " + item.keywords).toLowerCase().includes(normalized))) : base.concat(extra);
    };
    wrapped.__browserOS3Wrapped = true;
    paletteItems = wrapped;
  }

  function terminalHelp() {
    terminalPrint("Browser OS 3.0 commands:", "success");
    [
      "recruiter start|status|next",
      "attack start|pause|resume|step|status|reset",
      "graph open",
      "detect3 run|status|threshold <20-100>|signals <1-8>",
      "incident3 status|advance|isolate|block-ioc|revoke|remove-persistence|reboot",
      "verify3 run|status",
      "report3 executive|technical",
      "architecture3",
      "truth3",
      "engineering3"
    ].forEach(line => terminalPrint("  " + line));
  }

  function nextLifecycleStatus() {
    const index = M.STATUS_FLOW.indexOf(v3.commander.status);
    return index >= 0 && index < M.STATUS_FLOW.length - 1 ? M.STATUS_FLOW[index + 1] : null;
  }

  function v3Terminal(raw) {
    const parts = raw.trim().split(/\s+/);
    const cmd = String(parts.shift() || "").toLowerCase();
    const sub = String(parts.shift() || "").toLowerCase();
    if (cmd === "v3-help") { terminalHelp(); return true; }
    if (cmd === "recruiter") {
      if (sub === "start") startRecruiterDemo();
      else if (sub === "next") recruiterOpenStep(Math.min(M.RECRUITER_STEPS.length - 1, v3.recruiter.step + 1));
      else terminalPrint(`Recruiter mode=${v3.recruiter.active} progress=${M.recruiterProgress(v3).percent}% step=${v3.recruiter.step + 1}/${M.RECRUITER_STEPS.length}`);
      return true;
    }
    if (cmd === "attack") {
      if (sub === "start") startAttack();
      else if (sub === "pause") pauseAttack();
      else if (sub === "resume") resumeAttack();
      else if (sub === "step") stepAttack();
      else if (sub === "reset") resetScenario({ keepRecruiter: true });
      else terminalPrint(`INC-301 attack status=${v3.attack.status} stage=${v3.attack.stageIndex + 1}/${M.ATTACK_STAGES.length} events=${v3.attack.events.length}`);
      return true;
    }
    if (cmd === "graph") { openV3("evidence-graph-window"); return true; }
    if (cmd === "detect3") {
      if (sub === "run") { const out = runDetection(true); terminalPrint(`BOS3-DET-301 score=${out.result.score} promoted=${out.result.promoted} matched=${out.result.matchedCount}`); }
      else if (sub === "threshold") { setDetectionTuning("scoreThreshold", Number(parts[0] || 72)); }
      else if (sub === "signals") { setDetectionTuning("minSignals", Number(parts[0] || 4)); }
      else { const out = runDetection(false); terminalPrint(`BOS3-DET-301 score=${out.result.score} threshold=${out.result.threshold} promoted=${out.result.promoted}`); }
      return true;
    }
    if (cmd === "incident3") {
      if (sub === "advance") { const next = nextLifecycleStatus(); if (next) updateIncidentStatus(next); else terminalPrint("INC-301 already at final lifecycle state."); }
      else if (sub === "isolate") isolateHost();
      else if (sub === "block-ioc") blockIOC();
      else if (sub === "revoke") revokeSessions();
      else if (sub === "remove-persistence") removePersistence();
      else if (sub === "reboot") rebootEndpoint();
      else terminalPrint(`INC-301 status=${v3.commander.status} severity=${v3.commander.severity} confidence=${M.confidenceFromState(v3)}% evidence=${M.calculateEvidenceCompleteness(v3).percent}%`);
      return true;
    }
    if (cmd === "verify3") {
      const suite = sub === "run" ? runVerification(true) : M.verificationResults(v3);
      terminalPrint(`Verification ${suite.passed}/${suite.total} PASS score=${suite.score}%`);
      suite.results.forEach(item => terminalPrint(`${item.pass ? "PASS" : "FAIL"} ${item.id} ${item.name}: ${item.actual}`));
      return true;
    }
    if (cmd === "report3") {
      generateReports(false);
      const text = sub === "technical" ? v3.reports.technical : v3.reports.executive;
      text.split("\n").forEach(line => terminalPrint(line));
      return true;
    }
    if (cmd === "architecture3") { openV3("architecture-window"); return true; }
    if (cmd === "truth3") { openV3("truth-window"); return true; }
    if (cmd === "engineering3") { openV3("engineering-window"); return true; }
    return false;
  }

  function installTerminal() {
    if (typeof executeTerminalCommand !== "function" || executeTerminalCommand.__browserOS3Wrapped) return;
    const core = executeTerminalCommand;
    const wrapped = function(raw) {
      if (v3Terminal(raw)) return;
      if (raw.trim().toLowerCase() === "help") {
        core(raw);
        terminalPrint("");
        terminalHelp();
        return;
      }
      core(raw);
    };
    wrapped.__browserOS3Wrapped = true;
    executeTerminalCommand = wrapped;
  }

  function updateVersionLabels() {
    document.title = "Browser OS 3.0 | Marc Lavoie";
    qa(".boot-version").forEach(node => node.textContent = "Browser-Based Security Operations Workstation · v3.0.0");
    const watermark = q(".watermark-subtitle");
    if (watermark) watermark.textContent = "Security Operations Workstation · v3.0";
    const startHeader = q(".start-menu-header strong");
    if (startHeader) startHeader.textContent = "Browser OS 3.0";
    setText("system-version", "3.0.0 Security Operations Workstation");
  }

  function enhanceCoreAccessibility() {
    qa(".os-window").forEach(windowNode => {
      const title = windowNode.dataset.appName || "application window";
      windowNode.setAttribute("role", "dialog");
      windowNode.setAttribute("aria-label", title);
      const actions = [
        ["[data-minimize-window]", "Minimize"],
        ["[data-maximize-window]", "Maximize"],
        ["[data-close-window]", "Close"]
      ];
      actions.forEach(([selector, action]) => {
        const control = q(selector, windowNode);
        if (!control) return;
        control.type = "button";
        if (!control.getAttribute("aria-label")) control.setAttribute("aria-label", `${action} ${title}`);
      });
    });
  }

  function initialize() {
    state.v3 = v3;
    ensureCoreEntities();
    buildWindows();
    APP_LIST.forEach(mountLauncher);
    simplifyDesktopLaunchers();
    mountBootRecruiter();
    bindEvents();
    installStateHooks();
    installPalette();
    installTerminal();
    loadEngineeringManifest();
    updateVersionLabels();
    enhanceCoreAccessibility();
    renderV3All();
    audit("ready", "Browser OS 3.0", "SUCCESS", "Recruiter mode, live attack, evidence graph, detection studio, incident command, verification, reporting, architecture, engineering proof and truth model mounted.");
    window.BrowserOS3 = Object.freeze({
      version: VERSION,
      getState: () => M.deepClone(v3),
      startAttack,
      pauseAttack,
      resumeAttack,
      stepAttack,
      resetScenario,
      runDetection: () => runDetection(true),
      isolateHost,
      blockIOC,
      revokeSessions,
      removePersistence,
      rebootEndpoint,
      runVerification: () => runVerification(true),
      generateReports: () => { generateReports(true); return M.deepClone(v3.reports); },
      open: openV3
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();
