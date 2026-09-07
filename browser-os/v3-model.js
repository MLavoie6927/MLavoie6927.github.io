"use strict";

/*
  Browser OS 3.0 model layer.
  Pure data + analysis helpers. No DOM, storage, network, or host APIs.
  Exports to window.BrowserOS3Model in-browser and module.exports in Node.
*/
(function universalModel(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.BrowserOS3Model = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function modelFactory() {
  const VERSION = "3.0.0";

  const ATTACK_STAGES = Object.freeze([
    {
      id: "ATK-00",
      offset: "14:02:17",
      phase: "DELIVERY",
      technique: "T1566.001",
      title: "External attachment delivered",
      detail: "A synthetic finance-themed message delivers Q3_Benefits_Update.docm to user mturner on WS-108. At delivery time the event is not independently classified as malicious.",
      evidenceType: "email",
      severity: "INFO",
      pivot: "timeline",
      signals: ["email-delivery", "attachment-docm"]
    },
    {
      id: "ATK-01",
      offset: "14:04:51",
      phase: "EXECUTION",
      technique: "T1204.002",
      title: "User opens document",
      detail: "WINWORD.EXE opens Q3_Benefits_Update.docm from the Downloads directory.",
      evidenceType: "process",
      severity: "LOW",
      pivot: "process",
      signals: ["office-document", "user-execution"]
    },
    {
      id: "ATK-02",
      offset: "14:04:54",
      phase: "EXECUTION",
      technique: "T1059.001",
      title: "Office spawns encoded PowerShell",
      detail: "WINWORD.EXE creates powershell.exe with an encoded command line. This is suspicious but not independently dispositive.",
      evidenceType: "process",
      severity: "HIGH",
      pivot: "process",
      signals: ["office-parent", "powershell", "encoded-command"]
    },
    {
      id: "ATK-03",
      offset: "14:04:56",
      phase: "DEFENSE EVASION",
      technique: "T1218.011",
      title: "Signed binary proxy execution",
      detail: "PowerShell launches Rundll32 with a synthetic JavaScript-style entry point.",
      evidenceType: "process",
      severity: "HIGH",
      pivot: "process",
      signals: ["rundll32", "suspicious-parent", "proxy-execution"]
    },
    {
      id: "ATK-04",
      offset: "14:05:01",
      phase: "PERSISTENCE",
      technique: "T1547.001",
      title: "Run-key persistence created",
      detail: "A synthetic HKCU Run value named OneDriveHealth invokes the staged Rundll32 command at sign-in.",
      evidenceType: "registry",
      severity: "HIGH",
      pivot: "timeline",
      signals: ["run-key", "persistence", "rundll32"]
    },
    {
      id: "ATK-05",
      offset: "14:05:03",
      phase: "COMMAND & CONTROL",
      technique: "T1071.004",
      title: "Suspicious DNS resolution",
      detail: "WS-108 resolves cdn-sync.example to documentation-range address 203.0.113.200.",
      evidenceType: "dns",
      severity: "MEDIUM",
      pivot: "packet",
      signals: ["dns-query", "rare-domain", "203.0.113.200"]
    },
    {
      id: "ATK-06",
      offset: "14:05:04",
      phase: "COMMAND & CONTROL",
      technique: "T1071.001",
      title: "TLS session established",
      detail: "Rundll32-associated PID 2116 opens a synthetic TLS session to 203.0.113.200:443.",
      evidenceType: "network",
      severity: "HIGH",
      pivot: "network",
      signals: ["tls-egress", "rundll32-network", "203.0.113.200"]
    },
    {
      id: "ATK-07",
      offset: "14:05:21",
      phase: "COMMAND & CONTROL",
      technique: "T1071.001",
      title: "Periodic beacon pattern emerges",
      detail: "Three synthetic sessions occur at nearly fixed intervals, raising confidence that the destination is not ordinary browsing.",
      evidenceType: "network",
      severity: "HIGH",
      pivot: "network",
      signals: ["periodicity", "repeat-tls", "low-jitter"]
    },
    {
      id: "ATK-08",
      offset: "14:05:39",
      phase: "CREDENTIAL ACCESS",
      technique: "T1003",
      title: "Credential-access behavior",
      detail: "The staged process requests a synthetic protected-process handle associated with credential material.",
      evidenceType: "memory",
      severity: "CRITICAL",
      pivot: "memory",
      signals: ["protected-process-access", "credential-access", "suspicious-lineage"]
    },
    {
      id: "ATK-09",
      offset: "14:05:58",
      phase: "LATERAL MOVEMENT",
      technique: "T1021.002",
      title: "SMB lateral-movement attempt",
      detail: "WS-108 attempts a synthetic SMB connection to FS-02 at 198.51.100.55:445 using mturner's session context.",
      evidenceType: "network",
      severity: "CRITICAL",
      pivot: "network",
      signals: ["smb", "lateral-movement", "workstation-to-server"]
    },
    {
      id: "ATK-10",
      offset: "14:06:03",
      phase: "DEFENSE",
      technique: "POLICY",
      title: "Segmentation blocks SMB attempt",
      detail: "The virtual firewall denies WS-108 to FS-02 TCP/445, limiting demonstrated blast radius.",
      evidenceType: "firewall",
      severity: "INFO",
      pivot: "firewall",
      signals: ["default-deny", "blocked-smb", "segmentation"]
    },
    {
      id: "ATK-11",
      offset: "14:06:14",
      phase: "DETECTION",
      technique: "CORRELATION",
      title: "Multi-source detection promoted",
      detail: "Detection engine correlates Office lineage, encoded PowerShell, persistence, DNS, TLS, and protected-process access into INC-301.",
      evidenceType: "detection",
      severity: "CRITICAL",
      pivot: "detection",
      signals: ["multi-source-correlation", "incident-promotion", "high-confidence"]
    },
    {
      id: "ATK-12",
      offset: "14:07:03",
      phase: "ANALYST",
      technique: "IR",
      title: "Analyst investigation begins",
      detail: "The scenario pauses for the analyst. Evidence is available across process, DNS, packet, firewall, identity, detection, memory, and case views.",
      evidenceType: "analyst",
      severity: "INFO",
      pivot: "commander",
      signals: ["triage-start", "evidence-ready"]
    }
  ]);

  const RECRUITER_STEPS = Object.freeze([
    { id: "R-01", title: "Watch the compromise develop", app: "recruiter-window", instruction: "Start the live intrusion and watch telemetry accumulate without revealing the conclusion." },
    { id: "R-02", title: "Validate process lineage", app: "process-window", instruction: "Pivot to WS-108 and confirm Office → PowerShell → Rundll32 behavior." },
    { id: "R-03", title: "Correlate DNS and network evidence", app: "evidence-graph-window", instruction: "Use the graph to pivot from process to DNS, destination, packet, and detection evidence." },
    { id: "R-04", title: "Explain the detection", app: "detection-studio-window", instruction: "Run the analytic, compare tuning, and distinguish high-confidence behavior from false-positive candidates." },
    { id: "R-05", title: "Contain the intrusion", app: "incident-command-window", instruction: "Isolate WS-108, block the IOC, revoke the synthetic session, and remove persistence." },
    { id: "R-06", title: "Prove containment worked", app: "verification-window", instruction: "Re-run C2, management, persistence, identity, and reboot tests and verify expected outcomes." },
    { id: "R-07", title: "Communicate the result", app: "reporting-window", instruction: "Generate an executive brief and a technical incident report from the recorded evidence." }
  ]);

  const ARCHITECTURE_MODULES = Object.freeze([
    { id: "ui", name: "UI / Window Manager", layer: 1, purpose: "Desktop, taskbar, windows, guided incident workflow, keyboard navigation.", inputs: "Operator actions", outputs: "Application intents", trust: "Presentation only" },
    { id: "services", name: "Virtual OS Services", layer: 2, purpose: "Service lifecycle, process state, scheduler, identity/session simulation.", inputs: "Application intents", outputs: "State transitions", trust: "Synthetic system state" },
    { id: "eventbus", name: "State + Event Bus", layer: 3, purpose: "Normalizes attack events, analyst actions, audit events, and cross-application pivots.", inputs: "Subsystem events", outputs: "Correlated telemetry", trust: "In-memory + namespaced storage" },
    { id: "telemetry", name: "Synthetic Endpoint Telemetry", layer: 4, purpose: "Processes, logs, packets, DNS, firewall, registry, memory, identity, network flows.", inputs: "Scenario stages", outputs: "Evidence records", trust: "Synthetic, deterministic" },
    { id: "detection", name: "Detection Engine", layer: 5, purpose: "Correlates independent signals, scores confidence, exposes tuning and false-positive tradeoffs.", inputs: "Evidence records", outputs: "Matches + incidents", trust: "Real rule-evaluation logic" },
    { id: "correlation", name: "Incident Correlation", layer: 6, purpose: "Builds scope, timeline, confidence, ATT&CK mapping, and evidence completeness.", inputs: "Detections + evidence", outputs: "Incident model", trust: "Real correlation logic over synthetic data" },
    { id: "investigation", name: "Investigation Tools", layer: 7, purpose: "Process, graph, SIEM, memory, network, cases, detection, threat-intel pivots.", inputs: "Incident model", outputs: "Analyst findings", trust: "Interactive reasoning surface" },
    { id: "response", name: "Response Engine", layer: 8, purpose: "Isolation, firewall block, session revocation, persistence removal, reboot and validation.", inputs: "Analyst decisions", outputs: "Containment state", trust: "Synthetic enforcement with real state transitions" },
    { id: "verification", name: "Verification Harness", layer: 9, purpose: "Proves malicious paths fail while approved management paths remain functional.", inputs: "Containment state", outputs: "PASS/FAIL evidence", trust: "Deterministic control validation" },
    { id: "reporting", name: "Reporting / Audit", layer: 10, purpose: "Executive brief, technical report, immutable-style audit trail, engineering proof.", inputs: "Investigation state", outputs: "Communications artifacts", trust: "Generated from recorded state" }
  ]);

  const TRUTH_MODEL = Object.freeze({
    synthetic: [
      "Enterprise endpoints, users, IP addresses, domains, incidents, emails, registry values, packets, memory artifacts and threat-intelligence records.",
      "Attack execution and containment effects. No actual malware executes and no real host is isolated.",
      "Identity sessions and MFA assurance. No passwords, OAuth grants, access tokens or identity-provider calls exist.",
      "Firewall/network traffic. Browser OS never transmits these synthetic packets onto a real network."
    ],
    real: [
      "JavaScript state engine, state transitions and application/window orchestration.",
      "Detection-rule evaluation, threshold tuning, confidence scoring and false-positive comparison logic.",
      "Evidence graph construction and cross-application pivot logic.",
      "Firewall-policy evaluation against synthetic flows and verification of expected allow/deny outcomes.",
      "Case, timeline, incident-command, audit and report-generation logic.",
      "Namespaced browser persistence and read-only Forensics Mode enforcement.",
      "Automated source validation and engineering tests shipped with the project."
    ],
    boundary: [
      "No backend or server-side secret store.",
      "No external network requests from Browser OS.",
      "No GitHub token, SSH private key or repository write path in the application.",
      "No operating-system shell, host filesystem API or real process/memory access.",
      "GitHub Pages source remains public and must never contain private data or credentials."
    ]
  });

  const DEFAULT_TUNING = Object.freeze({
    minSignals: 4,
    requireProcessLineage: true,
    requireNetworkSignal: true,
    suppressKnownUpdater: true,
    beaconJitterMaxPercent: 12,
    scoreThreshold: 72
  });

  const STATUS_FLOW = Object.freeze([
    "NEW",
    "TRIAGE",
    "INVESTIGATING",
    "CONTAINING",
    "REMEDIATING",
    "VALIDATING",
    "CLOSED"
  ]);

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function text(value, max) {
    const limit = Number.isFinite(max) ? max : 1200;
    return String(value == null ? "" : value)
      .replace(/[\u0000-\u001f\u007f]/g, " ")
      .slice(0, limit)
      .trim();
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, Number(value) || 0));
  }

  function createState(now) {
    const stamp = now || new Date().toISOString();
    return {
      version: 3,
      created: stamp,
      updated: stamp,
      recruiter: {
        active: false,
        step: 0,
        completed: [],
        startedAt: null,
        mode: "guided"
      },
      attack: {
        status: "IDLE",
        stageIndex: -1,
        speed: 1,
        startedAt: null,
        pausedAt: null,
        endpoint: "WS-108",
        user: "mturner",
        destination: "203.0.113.200",
        domain: "cdn-sync.example",
        events: [],
        processPids: [2104, 2110, 2116],
        connectionIds: [],
        persistencePresent: false,
        credentialRisk: false,
        lateralAttempted: false,
        segmentationBlocked: false
      },
      commander: {
        incidentId: "INC-301",
        status: "NEW",
        severity: "CRITICAL",
        confidence: 35,
        owner: "soc",
        escalation: "Not escalated",
        businessImpact: "Potential compromise of one user workstation; lateral movement not yet proven successful.",
        scope: ["WS-108", "mturner"],
        rootCause: "Pending investigation",
        recovery: "Not started",
        lessons: "Pending closure",
        containment: {
          hostIsolated: false,
          iocBlocked: false,
          sessionsRevoked: false,
          persistenceRemoved: false,
          endpointRebooted: false
        }
      },
      detectionStudio: {
        tuning: deepClone(DEFAULT_TUNING),
        baseline: null,
        current: null,
        history: []
      },
      evidence: [],
      analystActions: [],
      verification: {
        lastRun: null,
        score: 0,
        results: []
      },
      reports: {
        executive: "",
        technical: "",
        generatedAt: null
      },
      engineering: {
        assertions: 0,
        passed: 0,
        failed: 0,
        build: "Browser OS 3.0"
      },
      ui: {
        selectedGraphNode: "incident:INC-301",
        selectedTimelineEvent: null,
        architectureModule: "ui",
        reportTab: "executive"
      }
    };
  }

  function normalizeState(candidate, now) {
    const base = createState(now);
    if (!candidate || typeof candidate !== "object" || candidate.version !== 3) return base;
    const merged = deepClone(base);
    Object.assign(merged, candidate);
    merged.recruiter = Object.assign({}, base.recruiter, candidate.recruiter || {});
    merged.attack = Object.assign({}, base.attack, candidate.attack || {});
    merged.commander = Object.assign({}, base.commander, candidate.commander || {});
    merged.commander.containment = Object.assign({}, base.commander.containment, (candidate.commander || {}).containment || {});
    merged.detectionStudio = Object.assign({}, base.detectionStudio, candidate.detectionStudio || {});
    merged.detectionStudio.tuning = Object.assign({}, base.detectionStudio.tuning, (candidate.detectionStudio || {}).tuning || {});
    merged.verification = Object.assign({}, base.verification, candidate.verification || {});
    merged.reports = Object.assign({}, base.reports, candidate.reports || {});
    merged.engineering = Object.assign({}, base.engineering, candidate.engineering || {});
    merged.ui = Object.assign({}, base.ui, candidate.ui || {});
    return merged;
  }

  function signalSet(events) {
    const set = new Set();
    (events || []).forEach(event => (event.signals || []).forEach(signal => set.add(signal)));
    return set;
  }

  function evaluateDetection(events, tuning) {
    const cfg = Object.assign({}, DEFAULT_TUNING, tuning || {});
    const signals = signalSet(events);
    const evidenceFamilies = new Set((events || []).map(event => event.evidenceType));
    const requiredSignals = [
      "office-parent",
      "encoded-command",
      "run-key",
      "dns-query",
      "rundll32-network",
      "periodicity",
      "protected-process-access",
      "lateral-movement"
    ];
    const matchedSignals = requiredSignals.filter(signal => signals.has(signal));
    const processSatisfied = !cfg.requireProcessLineage || (signals.has("office-parent") && signals.has("encoded-command"));
    const networkSatisfied = !cfg.requireNetworkSignal || (signals.has("dns-query") && signals.has("rundll32-network"));
    const independentFamilies = ["process", "registry", "dns", "network", "memory", "firewall"].filter(family => evidenceFamilies.has(family));
    const rawScore =
      matchedSignals.length * 8 +
      independentFamilies.length * 6 +
      (signals.has("periodicity") ? 8 : 0) +
      (signals.has("protected-process-access") ? 10 : 0) +
      (signals.has("lateral-movement") ? 8 : 0);
    const score = clamp(rawScore, 0, 100);
    const countSatisfied = matchedSignals.length >= clamp(cfg.minSignals, 1, 8);
    const promoted = countSatisfied && processSatisfied && networkSatisfied && score >= clamp(cfg.scoreThreshold, 20, 100);
    return {
      promoted,
      score,
      matchedSignals,
      matchedCount: matchedSignals.length,
      independentFamilies,
      processSatisfied,
      networkSatisfied,
      threshold: cfg.scoreThreshold,
      minSignals: cfg.minSignals,
      rationale: promoted
        ? "Multiple independent evidence families satisfy process, network and confidence requirements."
        : "Evidence does not yet satisfy all configured promotion requirements."
    };
  }

  function falsePositiveCandidate(tuning) {
    const cfg = Object.assign({}, DEFAULT_TUNING, tuning || {});
    const updaterSignals = ["periodicity", "repeat-tls", "signed-updater", "known-destination"];
    const suppressed = cfg.suppressKnownUpdater;
    const score = suppressed ? 14 : 48;
    return {
      name: "Vendor updater periodic TLS",
      process: "updater.exe",
      destination: "203.0.113.74:443",
      signals: updaterSignals,
      score,
      suppressed,
      disposition: suppressed ? "SUPPRESSED / BENIGN CONTEXT" : "REVIEW REQUIRED"
    };
  }

  function transitionAllowed(from, to) {
    const a = STATUS_FLOW.indexOf(from);
    const b = STATUS_FLOW.indexOf(to);
    if (a === -1 || b === -1) return false;
    if (b === a) return true;
    if (b === a + 1) return true;
    if (from === "TRIAGE" && to === "CLOSED") return true;
    return false;
  }

  function calculateEvidenceCompleteness(v3) {
    const types = new Set((v3.evidence || []).map(item => item.type));
    const expected = ["email", "process", "registry", "dns", "network", "packet", "memory", "firewall", "detection", "identity"];
    const present = expected.filter(type => types.has(type));
    return {
      expected,
      present,
      missing: expected.filter(type => !types.has(type)),
      percent: Math.round((present.length / expected.length) * 100)
    };
  }

  function confidenceFromState(v3) {
    const detection = v3.detectionStudio.current || evaluateDetection(v3.attack.events, v3.detectionStudio.tuning);
    const completeness = calculateEvidenceCompleteness(v3);
    let confidence = Math.round(detection.score * 0.65 + completeness.percent * 0.35);
    if (v3.attack.segmentationBlocked) confidence = Math.min(100, confidence + 2);
    return clamp(confidence, 0, 100);
  }

  function buildEvidenceGraph(v3) {
    const events = v3.attack.events || [];
    const has = id => events.some(event => event.id === id);
    const nodes = [
      { id: "user:mturner", label: "mturner", type: "user", status: v3.commander.containment.sessionsRevoked ? "contained" : "observed", pivot: "identity-window", x: 8, y: 46 },
      { id: "endpoint:WS-108", label: "WS-108", type: "endpoint", status: v3.commander.containment.hostIsolated ? "contained" : "affected", pivot: "incident-command-window", x: 23, y: 46 },
      { id: "process:2104", label: "WINWORD.EXE", type: "process", status: has("ATK-01") ? "observed" : "pending", pivot: "process-window", x: 40, y: 20 },
      { id: "process:2110", label: "powershell.exe", type: "process", status: has("ATK-02") ? "suspicious" : "pending", pivot: "process-window", x: 40, y: 46 },
      { id: "process:2116", label: "rundll32.exe", type: "process", status: has("ATK-03") ? "suspicious" : "pending", pivot: "process-window", x: 40, y: 72 },
      { id: "registry:run", label: "HKCU Run", type: "registry", status: v3.attack.persistencePresent ? "suspicious" : has("ATK-04") ? "contained" : "pending", pivot: "attack-timeline-window", x: 58, y: 12 },
      { id: "dns:cdn-sync.example", label: "cdn-sync.example", type: "dns", status: has("ATK-05") ? "suspicious" : "pending", pivot: "packet-window", x: 58, y: 34 },
      { id: "ip:203.0.113.200", label: "203.0.113.200", type: "ip", status: v3.commander.containment.iocBlocked ? "contained" : has("ATK-06") ? "suspicious" : "pending", pivot: "network-window", x: 58, y: 56 },
      { id: "memory:2116", label: "Protected handle", type: "memory", status: has("ATK-08") ? "critical" : "pending", pivot: "memory-window", x: 58, y: 78 },
      { id: "server:FS-02", label: "FS-02:445", type: "server", status: v3.attack.segmentationBlocked ? "blocked" : has("ATK-09") ? "attempted" : "pending", pivot: "firewall-window", x: 76, y: 24 },
      { id: "detection:BOS3-DET-301", label: "BOS3-DET-301", type: "detection", status: has("ATK-11") ? "fired" : "pending", pivot: "detection-studio-window", x: 76, y: 50 },
      { id: "incident:INC-301", label: "INC-301", type: "incident", status: v3.commander.status, pivot: "incident-command-window", x: 91, y: 50 }
    ];
    const edges = [
      ["user:mturner", "endpoint:WS-108", "signed in"],
      ["endpoint:WS-108", "process:2104", "runs"],
      ["process:2104", "process:2110", "spawns"],
      ["process:2110", "process:2116", "spawns"],
      ["process:2116", "registry:run", "persists"],
      ["process:2116", "dns:cdn-sync.example", "resolves"],
      ["dns:cdn-sync.example", "ip:203.0.113.200", "answers"],
      ["process:2116", "ip:203.0.113.200", "TLS"],
      ["process:2116", "memory:2116", "accesses"],
      ["endpoint:WS-108", "server:FS-02", "SMB attempt"],
      ["process:2116", "detection:BOS3-DET-301", "signals"],
      ["ip:203.0.113.200", "detection:BOS3-DET-301", "signals"],
      ["memory:2116", "detection:BOS3-DET-301", "signals"],
      ["detection:BOS3-DET-301", "incident:INC-301", "promotes"]
    ].map((edge, index) => ({ id: "EDGE-" + String(index + 1).padStart(2, "0"), from: edge[0], to: edge[1], label: edge[2] }));
    return { nodes, edges };
  }

  function verificationResults(v3) {
    const c = v3.commander.containment;
    const attack = v3.attack;
    const results = [
      {
        id: "VER-01",
        name: "Malicious C2 retry",
        expected: "BLOCKED",
        actual: c.hostIsolated || c.iocBlocked ? "BLOCKED" : "ALLOWED",
        pass: Boolean(c.hostIsolated || c.iocBlocked),
        evidence: c.hostIsolated ? "Endpoint isolation denies synthetic C2 egress." : c.iocBlocked ? "Explicit IOC policy denies 203.0.113.200:443." : "No containment control currently denies the C2 path."
      },
      {
        id: "VER-02",
        name: "Authorized SOC management",
        expected: "ALLOWED",
        actual: "ALLOWED",
        pass: true,
        evidence: "Synthetic management channel to 198.51.100.40:443 remains available by design."
      },
      {
        id: "VER-03",
        name: "Persistence after sign-in",
        expected: "ABSENT",
        actual: !attack.persistencePresent && c.persistenceRemoved ? "ABSENT" : "PRESENT",
        pass: Boolean(!attack.persistencePresent && c.persistenceRemoved),
        evidence: !attack.persistencePresent && c.persistenceRemoved ? "OneDriveHealth Run value is absent." : "Synthetic Run value is still registered."
      },
      {
        id: "VER-04",
        name: "Compromised user session",
        expected: "REVOKED",
        actual: c.sessionsRevoked ? "REVOKED" : "ACTIVE",
        pass: Boolean(c.sessionsRevoked),
        evidence: c.sessionsRevoked ? "mturner synthetic sessions marked revoked." : "At least one mturner synthetic session remains active."
      },
      {
        id: "VER-05",
        name: "Lateral SMB path",
        expected: "BLOCKED",
        actual: attack.segmentationBlocked ? "BLOCKED" : "UNVERIFIED",
        pass: Boolean(attack.segmentationBlocked),
        evidence: attack.segmentationBlocked ? "Virtual segmentation policy denied WS-108 → FS-02 TCP/445." : "No blocking evidence recorded."
      },
      {
        id: "VER-06",
        name: "Post-remediation reboot",
        expected: "CLEAN",
        actual: c.endpointRebooted && !attack.persistencePresent ? "CLEAN" : c.endpointRebooted ? "PERSISTENCE RETURNED" : "NOT TESTED",
        pass: Boolean(c.endpointRebooted && !attack.persistencePresent),
        evidence: c.endpointRebooted && !attack.persistencePresent ? "Synthetic endpoint rebooted without recreating malicious process lineage." : "A clean reboot has not yet been demonstrated."
      }
    ];
    const passed = results.filter(item => item.pass).length;
    return { results, score: Math.round((passed / results.length) * 100), passed, total: results.length };
  }

  function executiveReport(v3) {
    const confidence = confidenceFromState(v3);
    const ver = verificationResults(v3);
    const complete = calculateEvidenceCompleteness(v3);
    const c = v3.commander.containment;
    return [
      "BROWSER OS 3.0 — EXECUTIVE INCIDENT BRIEF",
      "Incident: INC-301 | Synthetic portfolio exercise",
      "",
      "ASSESSMENT",
      `Browser OS assesses with ${confidence}% confidence that WS-108 experienced a simulated intrusion beginning with a phishing-delivered Office document and progressing through encoded PowerShell, Rundll32 proxy execution, persistence, command-and-control activity, credential-access behavior, and an attempted SMB lateral movement.`,
      "",
      "SCOPE & IMPACT",
      `${v3.commander.businessImpact} Evidence completeness is ${complete.percent}%.`,
      "",
      "CONTAINMENT",
      `Host isolation: ${c.hostIsolated ? "complete" : "pending"}; IOC block: ${c.iocBlocked ? "complete" : "pending"}; session revocation: ${c.sessionsRevoked ? "complete" : "pending"}; persistence removal: ${c.persistenceRemoved ? "complete" : "pending"}.`,
      "",
      "VALIDATION",
      `${ver.passed}/${ver.total} verification checks pass (${ver.score}%). Authorized SOC management remains available while the malicious C2 path is expected to be denied after containment.`,
      "",
      "NEXT ACTION",
      v3.commander.status === "CLOSED" ? "Incident is closed with lessons learned recorded." : "Complete outstanding containment/verification actions, document root cause, and close only after recovery evidence is complete.",
      "",
      "TRUTH MODEL",
      "All enterprise telemetry and attack activity in this brief are synthetic. The correlation, state-transition, policy-evaluation, evidence-graph, verification, and report-generation logic are implemented in the Browser OS application."
    ].join("\n");
  }

  function technicalReport(v3) {
    const detection = v3.detectionStudio.current || evaluateDetection(v3.attack.events, v3.detectionStudio.tuning);
    const ver = verificationResults(v3);
    const complete = calculateEvidenceCompleteness(v3);
    const timeline = (v3.attack.events || []).map(event => `${event.offset || event.time || "--:--:--"}  ${event.title}  [${event.technique || "N/A"}]`).join("\n");
    const actions = (v3.analystActions || []).map(action => `${action.time}  ${action.action}  ${action.detail}`).join("\n") || "No analyst actions recorded.";
    const checks = ver.results.map(item => `${item.pass ? "PASS" : "FAIL"} ${item.id} ${item.name}: expected=${item.expected} actual=${item.actual}\n  ${item.evidence}`).join("\n");
    return [
      "BROWSER OS 3.0 — TECHNICAL INCIDENT REPORT",
      "Incident: INC-301",
      "Classification: SYNTHETIC PORTFOLIO EXERCISE",
      "",
      "1. SUMMARY",
      v3.commander.businessImpact,
      "",
      "2. SCOPE",
      `Affected entities: ${v3.commander.scope.join(", ")}`,
      `Severity: ${v3.commander.severity}`,
      `Confidence: ${confidenceFromState(v3)}%`,
      `Evidence completeness: ${complete.percent}% (${complete.present.join(", ")})`,
      "",
      "3. ATTACK TIMELINE",
      timeline || "Scenario not yet executed.",
      "",
      "4. DETECTION",
      `Promotion: ${detection.promoted ? "YES" : "NO"}`,
      `Score: ${detection.score}/100 (threshold ${detection.threshold})`,
      `Matched signals: ${detection.matchedSignals.join(", ") || "none"}`,
      `Independent evidence families: ${detection.independentFamilies.join(", ") || "none"}`,
      `Rationale: ${detection.rationale}`,
      "",
      "5. ANALYST ACTIONS",
      actions,
      "",
      "6. ROOT CAUSE",
      v3.commander.rootCause,
      "",
      "7. RECOVERY",
      v3.commander.recovery,
      "",
      "8. VALIDATION",
      checks,
      "",
      "9. LESSONS LEARNED",
      v3.commander.lessons,
      "",
      "10. SECURITY / TRUTH BOUNDARY",
      "No malware executed, no real endpoint was isolated, no credentials were collected, and no external network traffic was generated. Browser OS evaluates synthetic state locally inside the visitor's browser."
    ].join("\n");
  }

  function recruiterProgress(v3) {
    const done = new Set(v3.recruiter.completed || []);
    const total = RECRUITER_STEPS.length;
    return {
      current: clamp(v3.recruiter.step, 0, total - 1),
      complete: done.size,
      total,
      percent: Math.round((done.size / total) * 100)
    };
  }

  function architectureEdges() {
    return ARCHITECTURE_MODULES.slice(0, -1).map((item, index) => ({ from: item.id, to: ARCHITECTURE_MODULES[index + 1].id }));
  }

  return Object.freeze({
    VERSION,
    ATTACK_STAGES,
    RECRUITER_STEPS,
    ARCHITECTURE_MODULES,
    TRUTH_MODEL,
    DEFAULT_TUNING,
    STATUS_FLOW,
    createState,
    normalizeState,
    evaluateDetection,
    falsePositiveCandidate,
    transitionAllowed,
    calculateEvidenceCompleteness,
    confidenceFromState,
    buildEvidenceGraph,
    verificationResults,
    executiveReport,
    technicalReport,
    recruiterProgress,
    architectureEdges,
    text,
    clamp,
    deepClone
  });
});
