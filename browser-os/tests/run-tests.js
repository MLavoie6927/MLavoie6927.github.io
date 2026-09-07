"use strict";

const fs = require("fs");
const path = require("path");
const M = require("../v3-model.js");

const root = path.resolve(__dirname, "..");
let assertions = 0;
let passed = 0;
const failures = [];

function check(condition, message) {
  assertions += 1;
  if (condition) {
    passed += 1;
  } else {
    failures.push(message);
  }
}

function eq(actual, expected, message) {
  check(actual === expected, `${message} | expected=${JSON.stringify(expected)} actual=${JSON.stringify(actual)}`);
}

function includes(value, needle, message) {
  check(String(value).includes(needle), `${message} | missing=${needle}`);
}

function read(relative) {
  return fs.readFileSync(path.join(root, relative), "utf8");
}

// Model/version/state assertions.
eq(M.VERSION, "3.0.0", "model version");
const base = M.createState("2026-09-03T20:00:00Z");
eq(base.version, 3, "v3 state schema version");
eq(base.attack.status, "IDLE", "initial attack state");
eq(base.attack.stageIndex, -1, "initial stage index");
eq(base.commander.incidentId, "INC-301", "default incident id");
eq(base.commander.status, "NEW", "default incident status");
eq(base.commander.severity, "CRITICAL", "default severity");
eq(base.evidence.length, 0, "default evidence empty");
eq(base.analystActions.length, 0, "default analyst actions empty");
eq(base.verification.score, 0, "default verification score");

const normalized = M.normalizeState({ version: 3, attack: { status: "PAUSED" }, commander: { containment: { hostIsolated: true } } }, "2026-09-03T20:00:00Z");
eq(normalized.attack.status, "PAUSED", "normalization preserves attack status");
eq(normalized.attack.endpoint, "WS-108", "normalization restores attack defaults");
eq(normalized.commander.containment.hostIsolated, true, "normalization preserves nested containment");
eq(normalized.commander.containment.iocBlocked, false, "normalization restores nested containment defaults");

// Attack stage schema and uniqueness assertions.
eq(M.ATTACK_STAGES.length, 13, "attack stage count");
const stageIds = new Set();
const offsets = new Set();
M.ATTACK_STAGES.forEach((stage, index) => {
  check(/^ATK-\d{2}$/.test(stage.id), `stage ${index} id format`);
  check(!stageIds.has(stage.id), `stage ${index} id unique`);
  stageIds.add(stage.id);
  check(/^\d{2}:\d{2}:\d{2}$/.test(stage.offset), `stage ${stage.id} time format`);
  check(!offsets.has(stage.offset), `stage ${stage.id} time unique`);
  offsets.add(stage.offset);
  check(stage.phase.length >= 3, `stage ${stage.id} phase populated`);
  check(stage.technique.length >= 2, `stage ${stage.id} technique populated`);
  check(stage.title.length >= 8, `stage ${stage.id} title populated`);
  check(stage.detail.length >= 35, `stage ${stage.id} detail sufficiently descriptive`);
  check(stage.evidenceType.length >= 3, `stage ${stage.id} evidence type populated`);
  check(Array.isArray(stage.signals) && stage.signals.length >= 2, `stage ${stage.id} has multiple analytic signals`);
  stage.signals.forEach((signal, signalIndex) => check(signal.length >= 3, `stage ${stage.id} signal ${signalIndex} populated`));
});

// Scenario progression should build confidence and eventually promote.
for (let count = 0; count <= M.ATTACK_STAGES.length; count += 1) {
  const events = M.ATTACK_STAGES.slice(0, count);
  const result = M.evaluateDetection(events, M.DEFAULT_TUNING);
  check(result.score >= 0 && result.score <= 100, `prefix ${count} score bounded`);
  check(result.matchedCount >= 0 && result.matchedCount <= 8, `prefix ${count} match count bounded`);
  check(Array.isArray(result.independentFamilies), `prefix ${count} telemetry families array`);
  if (count < 3) check(result.promoted === false, `prefix ${count} not prematurely promoted`);
}
const fullDetection = M.evaluateDetection(M.ATTACK_STAGES, M.DEFAULT_TUNING);
check(fullDetection.promoted, "full scenario promotes detection");
check(fullDetection.score >= M.DEFAULT_TUNING.scoreThreshold, "full detection meets score threshold");
check(fullDetection.independentFamilies.includes("process"), "detection contains process family");
check(fullDetection.independentFamilies.includes("network"), "detection contains network family");
check(fullDetection.independentFamilies.includes("memory"), "detection contains memory family");
check(fullDetection.independentFamilies.includes("firewall"), "detection contains firewall family");

const strictDetection = M.evaluateDetection(M.ATTACK_STAGES.slice(0, 7), { minSignals: 8, scoreThreshold: 95, requireProcessLineage: true, requireNetworkSignal: true });
check(!strictDetection.promoted, "strict tuning prevents weak early promotion");
const relaxedDetection = M.evaluateDetection(M.ATTACK_STAGES.slice(0, 8), { minSignals: 2, scoreThreshold: 30, requireProcessLineage: true, requireNetworkSignal: true });
check(relaxedDetection.promoted, "relaxed tuning can promote sufficiently correlated scenario");
const fpSuppressed = M.falsePositiveCandidate({ suppressKnownUpdater: true });
const fpUnsuppressed = M.falsePositiveCandidate({ suppressKnownUpdater: false });
check(fpSuppressed.suppressed, "known updater suppression enabled");
check(!fpUnsuppressed.suppressed, "known updater suppression can be disabled");
check(fpSuppressed.score < fpUnsuppressed.score, "benign context lowers candidate score");

// Recruiter workflow.
eq(M.RECRUITER_STEPS.length, 7, "recruiter step count");
const recruiterApps = new Set();
M.RECRUITER_STEPS.forEach((step, index) => {
  check(/^R-\d{2}$/.test(step.id), `recruiter ${index} id format`);
  check(step.title.length >= 8, `recruiter ${step.id} title descriptive`);
  check(step.instruction.length >= 20, `recruiter ${step.id} instruction descriptive`);
  check(step.app.endsWith("-window"), `recruiter ${step.id} target is window`);
  recruiterApps.add(step.app);
});
eq(recruiterApps.size, 7, "recruiter steps use distinct primary windows");
const recruiterState = M.createState();
recruiterState.recruiter.completed = ["R-01", "R-02", "R-03"];
const recruiterProgress = M.recruiterProgress(recruiterState);
eq(recruiterProgress.complete, 3, "recruiter complete count");
eq(recruiterProgress.total, 7, "recruiter total count");
check(recruiterProgress.percent >= 42 && recruiterProgress.percent <= 43, "recruiter percent calculation");

// Incident lifecycle state machine.
M.STATUS_FLOW.forEach((status, index) => {
  check(M.transitionAllowed(status, status), `${status} self transition allowed`);
  if (index < M.STATUS_FLOW.length - 1) check(M.transitionAllowed(status, M.STATUS_FLOW[index + 1]), `${status} sequential transition allowed`);
  if (index + 2 < M.STATUS_FLOW.length && status !== "TRIAGE") check(!M.transitionAllowed(status, M.STATUS_FLOW[index + 2]), `${status} skip transition blocked`);
});
check(M.transitionAllowed("TRIAGE", "CLOSED"), "triage false-positive closure allowed");
check(!M.transitionAllowed("CLOSED", "NEW"), "closed incident cannot reset through lifecycle transition");
check(!M.transitionAllowed("BOGUS", "NEW"), "unknown status rejected");

// Evidence completeness.
const completeState = M.createState();
["email", "process", "registry", "dns", "network", "packet", "memory", "firewall", "detection", "identity"].forEach((type, index) => completeState.evidence.push({ id: `E-${index}`, type }));
const completeness = M.calculateEvidenceCompleteness(completeState);
eq(completeness.percent, 100, "full evidence completeness");
eq(completeness.missing.length, 0, "no missing evidence at 100 percent");
const partialState = M.createState();
partialState.evidence = [{ type: "process" }, { type: "network" }, { type: "dns" }];
const partial = M.calculateEvidenceCompleteness(partialState);
eq(partial.percent, 30, "partial evidence completeness");
check(partial.missing.includes("identity"), "partial evidence reports identity missing");

// Evidence graph consistency.
const graphState = M.createState();
graphState.attack.events = M.deepClone(M.ATTACK_STAGES);
graphState.attack.persistencePresent = true;
graphState.attack.segmentationBlocked = true;
const graph = M.buildEvidenceGraph(graphState);
check(graph.nodes.length >= 12, "graph includes investigation entities");
check(graph.edges.length >= 14, "graph includes relationship edges");
const graphIds = new Set(graph.nodes.map(node => node.id));
graph.nodes.forEach(node => {
  check(node.id.includes(":"), `graph node ${node.id} typed id`);
  check(node.label.length >= 2, `graph node ${node.id} label`);
  check(node.type.length >= 2, `graph node ${node.id} type`);
  check(node.pivot.endsWith("-window"), `graph node ${node.id} pivot target`);
  check(node.x >= 0 && node.x <= 100, `graph node ${node.id} x bounded`);
  check(node.y >= 0 && node.y <= 100, `graph node ${node.id} y bounded`);
});
graph.edges.forEach(edge => {
  check(graphIds.has(edge.from), `graph edge ${edge.id} from exists`);
  check(graphIds.has(edge.to), `graph edge ${edge.id} to exists`);
  check(edge.label.length >= 2, `graph edge ${edge.id} label`);
});

// Response verification tests.
const response = M.createState();
response.attack.segmentationBlocked = true;
let suite = M.verificationResults(response);
check(suite.score < 100, "uncontained incident cannot fully verify");
check(suite.results.find(item => item.id === "VER-02").pass, "approved SOC management control remains positive");
response.commander.containment.hostIsolated = true;
response.commander.containment.iocBlocked = true;
response.commander.containment.sessionsRevoked = true;
response.commander.containment.persistenceRemoved = true;
response.commander.containment.endpointRebooted = true;
response.attack.persistencePresent = false;
suite = M.verificationResults(response);
eq(suite.score, 100, "fully contained incident verifies at 100 percent");
eq(suite.passed, suite.total, "all verification controls pass");
suite.results.forEach(item => {
  check(item.id.startsWith("VER-"), `${item.name} verification id`);
  check(item.expected.length >= 3, `${item.id} expected state populated`);
  check(item.actual.length >= 3, `${item.id} actual state populated`);
  check(item.evidence.length >= 20, `${item.id} evidence narrative populated`);
});

// Reports and truth-model disclosures.
response.attack.events = M.deepClone(M.ATTACK_STAGES);
response.evidence = completeState.evidence;
response.commander.businessImpact = "Synthetic single-workstation impact for test.";
response.commander.rootCause = "Synthetic phishing document execution.";
response.commander.recovery = "Synthetic recovery complete.";
response.commander.lessons = "Improve attachment controls and detection coverage.";
response.detectionStudio.current = M.evaluateDetection(response.attack.events, M.DEFAULT_TUNING);
const execReport = M.executiveReport(response);
const techReport = M.technicalReport(response);
includes(execReport, "EXECUTIVE INCIDENT BRIEF", "executive report heading");
includes(execReport, "synthetic", "executive report truth disclosure");
includes(execReport, "INC-301", "executive report incident id");
includes(techReport, "TECHNICAL INCIDENT REPORT", "technical report heading");
includes(techReport, "ATTACK TIMELINE", "technical report timeline");
includes(techReport, "VALIDATION", "technical report validation");
includes(techReport, "No malware executed", "technical report non-claim");
M.ATTACK_STAGES.forEach(stage => includes(techReport, stage.title, `technical report includes ${stage.id}`));

// Architecture schema and linear flow.
eq(M.ARCHITECTURE_MODULES.length, 10, "architecture module count");
const archIds = new Set();
M.ARCHITECTURE_MODULES.forEach((module, index) => {
  check(!archIds.has(module.id), `architecture ${module.id} unique`);
  archIds.add(module.id);
  eq(module.layer, index + 1, `architecture ${module.id} layer order`);
  check(module.name.length >= 5, `architecture ${module.id} name`);
  check(module.purpose.length >= 25, `architecture ${module.id} purpose`);
  check(module.inputs.length >= 5, `architecture ${module.id} inputs`);
  check(module.outputs.length >= 5, `architecture ${module.id} outputs`);
  check(module.trust.length >= 5, `architecture ${module.id} trust model`);
});
const archEdges = M.architectureEdges();
eq(archEdges.length, M.ARCHITECTURE_MODULES.length - 1, "architecture linear edge count");
archEdges.forEach(edge => {
  check(archIds.has(edge.from), `architecture edge from ${edge.from} exists`);
  check(archIds.has(edge.to), `architecture edge to ${edge.to} exists`);
});

// Truth model content.
check(M.TRUTH_MODEL.synthetic.length >= 4, "truth model synthetic section substantial");
check(M.TRUTH_MODEL.real.length >= 6, "truth model real section substantial");
check(M.TRUTH_MODEL.boundary.length >= 5, "truth model boundary section substantial");
M.TRUTH_MODEL.synthetic.forEach((item, index) => check(item.length >= 40, `synthetic truth item ${index} descriptive`));
M.TRUTH_MODEL.real.forEach((item, index) => check(item.length >= 30, `real truth item ${index} descriptive`));
M.TRUTH_MODEL.boundary.forEach((item, index) => check(item.length >= 25, `boundary truth item ${index} descriptive`));

// Source and integration invariants.
const indexHtml = read("index.html");
const v3Source = read("v3.js");
const modelSource = read("v3-model.js");
const css = read("v3.css");
const readme = read("README.md");
const threat = read("docs/THREAT-MODEL.md");
const invariants = read("docs/SECURITY-INVARIANTS.md");
const limitations = read("docs/KNOWN-LIMITATIONS.md");

includes(indexHtml, "connect-src 'none'", "CSP blocks external connect destinations");
includes(indexHtml, "v3-model.js", "index loads v3 model");
includes(indexHtml, "v3.js", "index loads v3 runtime");
includes(indexHtml, "v3.css", "index loads v3 styles");
includes(indexHtml, "test-manifest.js", "index loads generated test manifest");
check(!/https?:\/\/[^\s"']+\.js/.test(indexHtml), "no external JavaScript URL");
check(!/https?:\/\/[^\s"']+\.css/.test(indexHtml), "no external CSS URL");

["fetch(", "XMLHttpRequest(", "new WebSocket(", "new EventSource(", "eval(", "new Function("].forEach(token => {
  check(!v3Source.includes(token), `v3 runtime excludes ${token}`);
  check(!modelSource.includes(token), `v3 model excludes ${token}`);
});
["ghp_", "github_pat_", "-----BEGIN PRIVATE KEY-----", "-----BEGIN OPENSSH PRIVATE KEY-----"].forEach(token => {
  check(!v3Source.includes(token), `v3 runtime excludes secret marker ${token}`);
  check(!modelSource.includes(token), `v3 model excludes secret marker ${token}`);
});

["recruiter-window", "evidence-graph-window", "detection-studio-window", "incident-command-window", "attack-timeline-window", "verification-window", "reporting-window", "architecture-window", "engineering-window", "truth-window"].forEach(id => check(v3Source.includes(id), `runtime implements ${id}`));
["v3-graph-node", "v3-verification", "v3-status-flow", "v3-report-output", "v3-recruiter-boot"].forEach(selector => check(css.includes(selector), `styles include ${selector}`));

includes(threat, "Trust boundaries", "threat model contains trust boundaries");
includes(threat, "Secret publication", "threat model contains secret publication risk");
includes(threat, "False confidence in containment", "threat model contains response validation risk");
includes(invariants, "connect-src 'none'", "security invariants retain CSP boundary");
includes(invariants, "documentation ranges", "security invariants require documentation ranges");
includes(limitations, "does **not** claim", "limitations explicitly reject production-equivalence claims");

// Documentation and architecture artifacts exist.
[
  "CHANGELOG.md",
  "docs/THREAT-MODEL.md",
  "docs/SECURITY-INVARIANTS.md",
  "docs/KNOWN-LIMITATIONS.md",
  "docs/adr/ADR-001-static-trust-boundary.md",
  "docs/adr/ADR-002-shared-state-incident-model.md",
  "docs/adr/ADR-003-verify-response-not-just-contain.md",
  "docs/adr/ADR-004-explicit-truth-model.md"
].forEach(file => check(fs.existsSync(path.join(root, file)), `artifact exists: ${file}`));

// README should be updated by build before release.
check(readme.length > 1000, "README is substantive");

const result = {
  version: M.VERSION,
  assertions,
  passed,
  failed: assertions - passed,
  generated: new Date().toISOString(),
  failures
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;
