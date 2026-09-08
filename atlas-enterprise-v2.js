/*
 * ATLAS-NET-01 ENTERPRISE SIMULATION UPGRADE v2.0
 * Browser-only / GitHub Pages-safe network operations lab.
 * Load AFTER your existing script.js.
 */
(() => {
  "use strict";

  const root = document.querySelector("[data-network-server-lab]");
  if (!root || root.dataset.atlasEnterprise === "true") return;
  root.dataset.atlasEnterprise = "true";

  const VERSION = "2.0.0";
  const BUILD = "2026-09-08";
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const clamp = (n, min, max) => Math.min(max, Math.max(min, Number(n) || 0));
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (items) => items[Math.floor(Math.random() * items.length)];
  const chance = (p) => Math.random() < p;
  const now = () => Date.now();
  const id = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 8)}`;

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function time(ts = now()) {
    return new Date(ts).toLocaleTimeString([], {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  function dateTime(ts = now()) {
    return new Date(ts).toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  function duration(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
  }

  function bytes(value) {
    let n = Math.max(0, Number(value) || 0);
    const units = ["B", "KB", "MB", "GB"];
    let i = 0;
    while (n >= 1024 && i < units.length - 1) {
      n /= 1024;
      i += 1;
    }
    return `${n >= 10 || i === 0 ? n.toFixed(0) : n.toFixed(1)} ${units[i]}`;
  }

  function download(name, text, type = "application/json") {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  class Bus {
    constructor() {
      this.events = new Map();
    }
    on(name, fn) {
      if (!this.events.has(name)) this.events.set(name, new Set());
      this.events.get(name).add(fn);
      return () => this.events.get(name)?.delete(fn);
    }
    emit(name, data) {
      for (const fn of this.events.get(name) || []) {
        try {
          fn(data);
        } catch (error) {
          console.error("ATLAS event error", name, error);
        }
      }
    }
  }

  class Ring {
    constructor(limit) {
      this.limit = limit;
      this.items = [];
    }
    push(item) {
      this.items.push(item);
      if (this.items.length > this.limit) {
        this.items.splice(0, this.items.length - this.limit);
      }
      return item;
    }
    clear() {
      this.items.length = 0;
    }
    latest(count) {
      return this.items.slice(-count);
    }
  }

  const config = {
    host: "127.0.0.1",
    port: 60000,
    maxSessions: 64,
    maxQueue: 600,
    baseWorkers: 8,
    maxWorkers: 32,
    minWorkers: 2,
    workerCapacity: 6,
    baseLatency: 14,
    maxPackets: 1000,
    maxFlows: 300,
    autoScale: true,
    autoContain: true,
    authFailThreshold: 5,
    tickMs: 1000
  };

  const initialState = () => ({
    phase: "offline",
    startedAt: null,
    ticks: 0,
    health: 0,
    healthLabel: "OFFLINE",
    cpu: 0,
    memory: 22,
    pps: 0,
    dropped: 0,
    messages: 0,
    accepts: 0,
    rejects: 0,
    bytesIn: 0,
    bytesOut: 0,
    nextSession: 10001,
    nextPacket: 1,
    nextFlow: 1,
    nextJob: 1,
    nextIncident: 1,
    nextRule: 100,
    selectedSession: null,
    selectedFlow: null,
    selectedIncident: null,
    activeTab: "overview",
    sessions: [],
    packets: [],
    flows: [],
    jobs: [],
    incidents: [],
    audit: [],
    snapshots: [],
    metrics: [],
    faults: {
      packetLoss: false,
      packetLossPct: 0,
      latency: false,
      latencyMs: 0,
      cpu: false,
      cpuPct: 0,
      memory: false,
      memoryPct: 0,
      dns: false,
      auth: false,
      tls: false
    }
  });

  class AtlasEngine {
    constructor() {
      this.bus = new Bus();
      this.logs = new Ring(900);
      this.authLog = new Ring(300);
      this.state = initialState();
      this.timer = null;
      this.busy = false;
      this.lastAutoScale = 0;
      this.workers = [];
      this.firewall = [];
      this.dynamicBlocks = new Map();
      this.dns = new Map();
      this.dnsCache = new Map();
      this.users = new Map();
      this.services = new Map();
      this.certificate = null;
      this.tlsStats = { ok: 0, failed: 0, rotations: 0 };
      this.commandHistory = [];
      this.setupDefaults();
    }

    setupDefaults() {
      this.resizeWorkers(config.baseWorkers, false);
      this.firewall = [
        {
          id: "FW-001",
          enabled: true,
          priority: 10,
          protocol: "tcp",
          source: "10.0.0.0/8",
          port: 60000,
          action: "allow",
          reason: "Private lab network"
        },
        {
          id: "FW-002",
          enabled: true,
          priority: 20,
          protocol: "tcp",
          source: "*",
          port: 60000,
          action: "rate-limit",
          reason: "Listener protection"
        },
        {
          id: "FW-003",
          enabled: true,
          priority: 90,
          protocol: "*",
          source: "*",
          port: "*",
          action: "deny",
          reason: "Default deny"
        }
      ];

      [
        ["telemetry.atlas.local", "10.20.0.15"],
        ["auth.atlas.local", "10.20.0.20"],
        ["updates.atlas.local", "10.20.0.25"],
        ["db.atlas.local", "10.20.0.30"],
        ["queue.atlas.local", "10.20.0.35"],
        ["soc.atlas.local", "10.20.0.40"]
      ].forEach(([name, address]) => this.dns.set(name, address));

      [
        ["analyst", "analyst"],
        ["operator", "operator"],
        ["service", "service"]
      ].forEach(([username, role]) => {
        this.users.set(username, {
          username,
          role,
          enabled: true,
          failures: 0,
          lockedUntil: 0,
          logins: 0,
          lastLogin: null
        });
      });

      [
        ["listener", "TCP Listener", true, []],
        ["tls", "TLS Context", true, ["listener"]],
        ["auth", "Authentication", true, []],
        ["queue", "Message Queue", true, []],
        ["telemetry", "Telemetry Pipeline", false, ["queue"]],
        ["resolver", "DNS Resolver", false, []]
      ].forEach(([name, display, critical, dependencies]) => {
        this.services.set(name, {
          name,
          display,
          critical,
          dependencies,
          state: "stopped",
          restarts: 0,
          cpu: 0,
          memory: rand(20, 55)
        });
      });

      this.rotateCertificate(false);
    }

    log(level, component, message, data = {}) {
      const entry = { id: id("log"), ts: now(), level, component, message, data };
      this.logs.push(entry);
      this.bus.emit("log", entry);
      return entry;
    }

    audit(action, data = {}) {
      this.state.audit.unshift({ id: id("audit"), ts: now(), actor: "atlas-sim", action, data });
      if (this.state.audit.length > 700) this.state.audit.length = 700;
      this.bus.emit("audit");
    }

    raise(type, severity, title, summary, evidence = []) {
      const existing = this.state.incidents.find((i) => i.type === type && i.status !== "closed");
      if (existing && type !== "BEACON") return existing;
      const incident = {
        id: `INC-${String(this.state.nextIncident++).padStart(4, "0")}`,
        type,
        severity,
        title,
        summary,
        evidence,
        status: "open",
        owner: "Unassigned",
        createdAt: now(),
        updatedAt: now(),
        timeline: [{ ts: now(), action: "created", note: "Incident created by simulation engine." }]
      };
      this.state.incidents.unshift(incident);
      this.log("SECURITY", "INCIDENT", `${incident.id} ${severity.toUpperCase()} ${title}`);
      this.audit("incident.create", { id: incident.id, type, severity });
      this.bus.emit("incidents");
      return incident;
    }

    incident(idValue) {
      return this.state.incidents.find((i) => i.id === idValue) || null;
    }

    setIncidentStatus(idValue, status, note) {
      const incident = this.incident(idValue);
      if (!incident) return false;
      incident.status = status;
      incident.updatedAt = now();
      incident.timeline.push({ ts: now(), action: status, note: note || status });
      this.log("INFO", "INCIDENT", `${incident.id} -> ${status.toUpperCase()}`);
      this.audit("incident.status", { id: incident.id, status });
      this.bus.emit("incidents");
      return true;
    }

    assignIncident(idValue, owner = "SOC Analyst") {
      const incident = this.incident(idValue);
      if (!incident) return false;
      incident.owner = owner;
      incident.updatedAt = now();
      incident.timeline.push({ ts: now(), action: "assigned", note: owner });
      this.audit("incident.assign", { id: incident.id, owner });
      this.bus.emit("incidents");
      return true;
    }

    rotateCertificate(announce = true) {
      const old = this.certificate?.serial || null;
      this.certificate = {
        serial: `ATL-${rand(100000, 999999)}-${rand(1000, 9999)}`,
        subject: "CN=atlas-net-01.atlas.local",
        issuer: "CN=ATLAS Lab Root CA",
        issuedAt: now(),
        expiresAt: now() + 90 * 86400000,
        fingerprint: Array.from({ length: 16 }, () => rand(0, 255).toString(16).padStart(2, "0")).join(":").toUpperCase()
      };
      if (announce) {
        this.tlsStats.rotations += 1;
        this.log("SECURITY", "TLS", `Certificate rotated ${old || "none"} -> ${this.certificate.serial}`);
        this.audit("tls.rotate", { old, next: this.certificate.serial });
        this.bus.emit("tls");
      }
    }

    expireCertificate() {
      this.certificate.expiresAt = now() - 1000;
      this.log("WARN", "TLS", `Certificate ${this.certificate.serial} forced expired.`);
      this.audit("tls.expire", { serial: this.certificate.serial });
      this.bus.emit("tls");
    }

    certificateValid() {
      return this.certificate.expiresAt > now();
    }

    handshake(session) {
      if (this.state.faults.tls || !this.certificateValid()) {
        this.tlsStats.failed += 1;
        this.log("ERROR", "TLS", `Handshake failed for session ${session.id}.`);
        this.bus.emit("tls");
        return false;
      }
      this.tlsStats.ok += 1;
      session.tls = {
        protocol: "TLS 1.3",
        cipher: "TLS_AES_256_GCM_SHA384",
        resumed: chance(0.25)
      };
      this.log("SUCCESS", "TLS", `Session ${session.id} negotiated TLS 1.3.`);
      this.bus.emit("tls");
      return true;
    }

    authenticate(username, success = true, source = "10.10.0.50") {
      const user = this.users.get(username);
      if (this.state.faults.auth) {
        success = false;
      }
      let reason = "Authenticated";
      if (!user || !user.enabled) {
        success = false;
        reason = "Unknown or disabled account";
      } else if (user.lockedUntil > now()) {
        success = false;
        reason = "Account locked";
      } else if (!success) {
        user.failures += 1;
        reason = "Invalid credential simulation";
        if (user.failures >= config.authFailThreshold) {
          user.lockedUntil = now() + 30000;
          reason = "Account locked after repeated failures";
          this.raise("AUTH_BRUTE_FORCE", "high", `Repeated authentication failures: ${username}`, reason, [source, username]);
        }
      } else {
        user.failures = 0;
        user.lockedUntil = 0;
        user.logins += 1;
        user.lastLogin = now();
      }
      const event = { ts: now(), username, source, success, reason };
      this.authLog.push(event);
      this.log(success ? "SUCCESS" : "SECURITY", "AUTH", `${username}@${source}: ${reason}`);
      this.audit("auth.login", event);
      this.bus.emit("auth");
      return success ? { ok: true, role: user.role } : { ok: false, reason };
    }

    unlockUser(username) {
      const user = this.users.get(username);
      if (!user) return false;
      user.failures = 0;
      user.lockedUntil = 0;
      this.log("INFO", "AUTH", `${username} unlocked.`);
      this.audit("auth.unlock", { username });
      this.bus.emit("auth");
      return true;
    }

    toggleUser(username) {
      const user = this.users.get(username);
      if (!user) return false;
      user.enabled = !user.enabled;
      this.log("WARN", "AUTH", `${username} ${user.enabled ? "enabled" : "disabled"}.`);
      this.audit("auth.toggle", { username, enabled: user.enabled });
      this.bus.emit("auth");
      return true;
    }

    resolve(name) {
      if (this.state.faults.dns) {
        this.log("ERROR", "DNS", `${name} resolution failed: resolver outage.`);
        return null;
      }
      const cached = this.dnsCache.get(name);
      if (cached && cached.expiresAt > now()) {
        this.log("DEBUG", "DNS", `${name} cache hit -> ${cached.address}`);
        return cached.address;
      }
      const address = this.dns.get(name);
      if (!address) {
        this.log("WARN", "DNS", `NXDOMAIN ${name}`);
        return null;
      }
      this.dnsCache.set(name, { address, expiresAt: now() + 60000 });
      this.log("INFO", "DNS", `${name} -> ${address}`);
      this.bus.emit("dns");
      return address;
    }

    flushDns() {
      this.dnsCache.clear();
      this.log("INFO", "DNS", "Resolver cache flushed.");
      this.audit("dns.flush");
      this.bus.emit("dns");
    }

    service(name) {
      return this.services.get(name) || null;
    }

    startService(name, silent = false) {
      const service = this.service(name);
      if (!service) return false;
      for (const dep of service.dependencies) this.startService(dep, true);
      service.state = "running";
      if (!silent) {
        this.log("SUCCESS", "SERVICE", `${service.display} started.`);
        this.audit("service.start", { name });
      }
      this.bus.emit("services");
      return true;
    }

    stopService(name, silent = false) {
      const service = this.service(name);
      if (!service) return false;
      service.state = "stopped";
      for (const candidate of this.services.values()) {
        if (candidate.dependencies.includes(name) && candidate.state === "running") {
          candidate.state = "degraded";
        }
      }
      if (!silent) {
        this.log("WARN", "SERVICE", `${service.display} stopped.`);
        this.audit("service.stop", { name });
      }
      if (service.critical && this.state.phase === "online") {
        this.raise("SERVICE_OUTAGE", "high", `Critical service stopped: ${service.display}`, `${service.display} stopped while the server was online.`, [name]);
      }
      this.bus.emit("services");
      return true;
    }

    restartService(name) {
      const service = this.service(name);
      if (!service) return false;
      this.stopService(name, true);
      service.restarts += 1;
      this.startService(name, true);
      this.log("INFO", "SERVICE", `${service.display} restarted (${service.restarts}).`);
      this.audit("service.restart", { name, restarts: service.restarts });
      this.bus.emit("services");
      return true;
    }

    startAllServices() {
      for (const service of this.services.values()) service.state = "running";
      this.bus.emit("services");
    }

    stopAllServices() {
      for (const service of this.services.values()) service.state = "stopped";
      this.bus.emit("services");
    }

    resizeWorkers(count, announce = true) {
      const target = clamp(count, config.minWorkers, config.maxWorkers);
      while (this.workers.length < target) {
        const index = this.workers.length + 1;
        this.workers.push({
          id: `worker-${String(index).padStart(2, "0")}`,
          state: "idle",
          utilization: 0,
          completed: 0,
          failed: 0
        });
      }
      while (this.workers.length > target) this.workers.pop();
      if (announce) {
        this.log("INFO", "WORKER", `Worker pool resized to ${target}.`);
        this.audit("workers.resize", { count: target });
      }
      this.bus.emit("workers");
      return target;
    }

    enqueue(type, payload = {}, priority = 50) {
      if (this.state.jobs.length >= config.maxQueue) {
        this.log("ERROR", "QUEUE", `Queue overflow; ${type} rejected.`);
        this.raise("QUEUE_OVERFLOW", "critical", "Message queue overflow", `Queue reached ${config.maxQueue} jobs.`, [type]);
        return null;
      }
      const job = {
        id: this.state.nextJob++,
        type,
        payload,
        priority,
        createdAt: now(),
        attempts: 0
      };
      this.state.jobs.push(job);
      this.state.jobs.sort((a, b) => a.priority - b.priority || a.createdAt - b.createdAt);
      this.bus.emit("queue");
      return job;
    }

    processQueue() {
      if (!this.state.jobs.length) {
        this.workers.forEach((worker) => {
          worker.state = "idle";
          worker.utilization *= 0.78;
        });
        return;
      }
      for (const worker of this.workers) {
        let count = 0;
        worker.state = "busy";
        while (this.state.jobs.length && count < config.workerCapacity) {
          const job = this.state.jobs.shift();
          job.attempts += 1;
          let failed = false;
          if (job.type === "message") {
            this.state.messages += 1;
            this.state.bytesIn += job.payload.bytes || 128;
            this.state.bytesOut += job.payload.bytes || 128;
          }
          if (job.type === "dns") failed = !this.resolve(job.payload.name);
          if (job.type === "auth") failed = !this.authenticate(job.payload.username, job.payload.success, job.payload.source).ok;
          if (failed) worker.failed += 1;
          else worker.completed += 1;
          count += 1;
        }
        worker.utilization = worker.utilization * 0.6 + (count / config.workerCapacity) * 100 * 0.4;
        worker.state = count ? "busy" : "idle";
      }
      this.bus.emit("queue");
      this.bus.emit("workers");
    }

    drainQueue() {
      const count = this.state.jobs.length;
      this.state.jobs.length = 0;
      this.log("WARN", "QUEUE", `Queue drained manually (${count} jobs).`);
      this.audit("queue.drain", { count });
      this.bus.emit("queue");
    }

    firewallDecision(source, protocol = "tcp", port = config.port) {
      const dynamic = this.dynamicBlocks.get(source);
      if (dynamic && dynamic.expiresAt > now()) {
        return { action: "deny", rule: "DYNAMIC-BLOCK", reason: dynamic.reason };
      }
      if (dynamic && dynamic.expiresAt <= now()) this.dynamicBlocks.delete(source);
      for (const rule of [...this.firewall].sort((a, b) => a.priority - b.priority)) {
        if (!rule.enabled) continue;
        if (rule.protocol !== "*" && rule.protocol !== protocol) continue;
        if (rule.port !== "*" && Number(rule.port) !== Number(port)) continue;
        const sourceMatch = rule.source === "*" || source === rule.source || (rule.source === "10.0.0.0/8" && source.startsWith("10."));
        if (!sourceMatch) continue;
        return { action: rule.action, rule: rule.id, reason: rule.reason };
      }
      return { action: "deny", rule: "IMPLICIT", reason: "Implicit deny" };
    }

    addFirewallRule({ source = "*", protocol = "tcp", port = 60000, action = "deny", reason = "Analyst rule" } = {}) {
      const rule = {
        id: `FW-${String(this.state.nextRule++).padStart(3, "0")}`,
        enabled: true,
        priority: 30,
        protocol,
        source,
        port,
        action,
        reason
      };
      this.firewall.push(rule);
      this.log("SECURITY", "FIREWALL", `${rule.id} added: ${action} ${source}`);
      this.audit("firewall.add", rule);
      this.bus.emit("firewall");
      return rule;
    }

    toggleFirewallRule(ruleId) {
      const rule = this.firewall.find((r) => r.id === ruleId);
      if (!rule) return false;
      rule.enabled = !rule.enabled;
      this.log("INFO", "FIREWALL", `${rule.id} ${rule.enabled ? "enabled" : "disabled"}.`);
      this.audit("firewall.toggle", { id: rule.id, enabled: rule.enabled });
      this.bus.emit("firewall");
      return true;
    }

    removeFirewallRule(ruleId) {
      const index = this.firewall.findIndex((r) => r.id === ruleId);
      if (index < 0) return false;
      const [rule] = this.firewall.splice(index, 1);
      this.log("WARN", "FIREWALL", `${rule.id} removed.`);
      this.audit("firewall.remove", { id: rule.id });
      this.bus.emit("firewall");
      return true;
    }

    block(source, reason = "Manual containment", seconds = 60) {
      this.dynamicBlocks.set(source, { source, reason, expiresAt: now() + seconds * 1000 });
      this.log("SECURITY", "FIREWALL", `${source} blocked for ${seconds}s: ${reason}`);
      this.audit("firewall.block", { source, reason, seconds });
      this.bus.emit("firewall");
    }

    unblock(source) {
      if (!this.dynamicBlocks.delete(source)) return false;
      this.log("INFO", "FIREWALL", `${source} unblocked.`);
      this.audit("firewall.unblock", { source });
      this.bus.emit("firewall");
      return true;
    }

    recordPacket({ direction = "in", source, destination, sport, dport, protocol = "TCP", flags = "ACK", length = 64, sessionId = null, action = "allow", note = "" }) {
      const packet = {
        id: this.state.nextPacket++,
        ts: now(),
        direction,
        source,
        destination,
        sport,
        dport,
        protocol,
        flags,
        length,
        sessionId,
        action,
        note
      };
      this.state.packets.push(packet);
      if (this.state.packets.length > config.maxPackets) {
        this.state.packets.splice(0, this.state.packets.length - config.maxPackets);
      }
      if (action === "deny" || action === "drop") this.state.dropped += 1;
      this.updateFlow(packet);
      this.bus.emit("packets");
      return packet;
    }

    updateFlow(packet) {
      const key = `${packet.source}:${packet.sport}>${packet.destination}:${packet.dport}/${packet.protocol}`;
      let flow = this.state.flows.find((f) => f.key === key);
      if (!flow) {
        flow = {
          id: this.state.nextFlow++,
          key,
          source: packet.source,
          sport: packet.sport,
          destination: packet.destination,
          dport: packet.dport,
          protocol: packet.protocol,
          sessionId: packet.sessionId,
          packets: 0,
          bytes: 0,
          risk: 0,
          action: packet.action,
          firstSeen: packet.ts,
          lastSeen: packet.ts
        };
        this.state.flows.unshift(flow);
        if (this.state.flows.length > config.maxFlows) this.state.flows.length = config.maxFlows;
      }
      flow.packets += 1;
      flow.bytes += packet.length;
      flow.lastSeen = packet.ts;
      flow.action = packet.action;
      if (packet.action !== "allow") flow.risk = clamp(flow.risk + 15, 0, 100);
      if (packet.flags.includes("SYN")) flow.risk = clamp(flow.risk + 2, 0, 100);
      this.bus.emit("flows");
    }

    session(sessionId) {
      return this.state.sessions.find((s) => s.id === Number(sessionId)) || null;
    }

    async connect(options = {}) {
      if (this.state.phase !== "online") {
        this.log("WARN", "SESSION", "Connection rejected: server offline.");
        return null;
      }
      const active = this.state.sessions.filter((s) => s.state === "connected").length;
      if (active >= config.maxSessions) {
        this.state.rejects += 1;
        this.log("WARN", "SESSION", "Connection rejected: session limit reached.");
        return null;
      }
      const source = options.ip || `10.10.${rand(1, 20)}.${rand(10, 240)}`;
      const decision = this.firewallDecision(source, "tcp", config.port);
      if (decision.action === "deny") {
        this.state.rejects += 1;
        this.recordPacket({ direction: "in", source, destination: config.host, sport: rand(20000, 64000), dport: config.port, protocol: "TCP", flags: "SYN", action: "deny", note: decision.rule });
        this.log("SECURITY", "FIREWALL", `Connection from ${source} denied by ${decision.rule}.`);
        return null;
      }
      if (decision.action === "rate-limit" && chance(0.15)) {
        this.state.rejects += 1;
        this.log("WARN", "FIREWALL", `Connection from ${source} rate-limited.`);
        return null;
      }
      const session = {
        id: this.state.nextSession++,
        ip: source,
        port: options.port || rand(20000, 64000),
        username: options.username || pick(["analyst", "operator", "service"]),
        role: "unknown",
        state: "handshake",
        connectedAt: now(),
        closedAt: null,
        closeReason: "",
        tls: null,
        rtt: 0,
        rx: 0,
        tx: 0,
        throughput: 0,
        risk: 0,
        isolated: false
      };
      this.state.sessions.unshift(session);
      this.state.accepts += 1;
      this.state.selectedSession = session.id;
      this.recordPacket({ direction: "in", source: session.ip, destination: config.host, sport: session.port, dport: config.port, protocol: "TCP", flags: "SYN", sessionId: session.id, action: "allow", note: "Connection request" });
      this.log("INFO", "SESSION", `Session ${session.id} TCP handshake from ${session.ip}:${session.port}.`);
      this.bus.emit("sessions");
      await new Promise((resolve) => setTimeout(resolve, 80));
      if (!this.handshake(session)) {
        session.state = "closed";
        session.closedAt = now();
        session.closeReason = "TLS handshake failed";
        this.state.rejects += 1;
        this.bus.emit("sessions");
        return null;
      }
      const auth = this.authenticate(session.username, true, session.ip);
      if (!auth.ok) {
        session.state = "closed";
        session.closedAt = now();
        session.closeReason = auth.reason;
        this.state.rejects += 1;
        this.bus.emit("sessions");
        return null;
      }
      session.role = auth.role;
      session.state = "connected";
      session.rtt = config.baseLatency + rand(2, 18);
      this.recordPacket({ direction: "out", source: config.host, destination: session.ip, sport: config.port, dport: session.port, protocol: "TLS", flags: "PSH,ACK", length: rand(120, 260), sessionId: session.id, action: "allow", note: "ServerAccept" });
      this.log("SUCCESS", "SESSION", `Session ${session.id} connected as ${session.username}/${session.role}.`);
      this.audit("session.connect", { id: session.id, source: session.ip, user: session.username, role: session.role });
      this.bus.emit("sessions");
      return session;
    }

    disconnect(sessionId, reason = "Operator disconnect") {
      const session = this.session(sessionId);
      if (!session || session.state !== "connected") return false;
      session.state = "closed";
      session.closedAt = now();
      session.closeReason = reason;
      this.recordPacket({ direction: "out", source: config.host, destination: session.ip, sport: config.port, dport: session.port, protocol: "TCP", flags: "FIN,ACK", sessionId: session.id, action: "allow", note: reason });
      this.log("WARN", "SESSION", `Session ${session.id} disconnected: ${reason}`);
      this.audit("session.disconnect", { id: session.id, reason });
      this.bus.emit("sessions");
      return true;
    }

    isolate(sessionId) {
      const session = this.session(sessionId);
      if (!session || session.state !== "connected") return false;
      session.isolated = true;
      session.risk = clamp(session.risk + 10, 0, 100);
      this.block(session.ip, `Session ${session.id} isolation`, 60);
      this.log("SECURITY", "SESSION", `Session ${session.id} isolated.`);
      this.audit("session.isolate", { id: session.id });
      this.bus.emit("sessions");
      return true;
    }

    release(sessionId) {
      const session = this.session(sessionId);
      if (!session) return false;
      session.isolated = false;
      this.unblock(session.ip);
      this.log("INFO", "SESSION", `Session ${session.id} released from isolation.`);
      this.audit("session.release", { id: session.id });
      this.bus.emit("sessions");
      return true;
    }

    ping(sessionId) {
      const session = this.session(sessionId);
      if (!session || session.state !== "connected") return null;
      const rtt = config.baseLatency + rand(0, 18) + (this.state.faults.latency ? this.state.faults.latencyMs : 0);
      session.rtt = rtt;
      this.recordPacket({ direction: "out", source: config.host, destination: session.ip, sport: 0, dport: 0, protocol: "ICMP", flags: "ECHO", length: 84, sessionId: session.id, action: session.isolated ? "drop" : "allow", note: "Ping request" });
      if (session.isolated) {
        this.log("WARN", "PING", `Session ${session.id} ping dropped: isolated.`);
        return null;
      }
      this.recordPacket({ direction: "in", source: session.ip, destination: config.host, sport: 0, dport: 0, protocol: "ICMP", flags: "ECHO_REPLY", length: 84, sessionId: session.id, action: "allow", note: "Ping response" });
      this.log("INFO", "PING", `Session ${session.id} RTT ${rtt} ms.`);
      this.bus.emit("sessions");
      return rtt;
    }

    send(sessionId, message) {
      const session = this.session(sessionId);
      if (!session || session.state !== "connected" || session.isolated) return false;
      const size = new TextEncoder().encode(String(message)).length;
      this.enqueue("message", { sessionId: session.id, bytes: size, message }, 40);
      this.recordPacket({ direction: "out", source: config.host, destination: session.ip, sport: config.port, dport: session.port, protocol: "TLS", flags: "PSH,ACK", length: size + 80, sessionId: session.id, action: "allow", note: "ServerMessage" });
      this.log("INFO", "MESSAGE", `Queued ${size}-byte message for session ${session.id}.`);
      this.audit("message.send", { id: session.id, bytes: size });
      return true;
    }

    broadcast(message) {
      let delivered = 0;
      for (const session of this.state.sessions.filter((s) => s.state === "connected" && !s.isolated)) {
        if (this.send(session.id, message)) delivered += 1;
      }
      this.log("INFO", "MESSAGE", `Broadcast queued for ${delivered} session(s).`);
      this.audit("message.broadcast", { delivered });
      return delivered;
    }

    generateLoad(profile = "moderate") {
      if (this.state.phase !== "online") return 0;
      const profiles = { light: 80, moderate: 220, heavy: 420, burst: 590 };
      const total = profiles[profile] || profiles.moderate;
      let queued = 0;
      for (let i = 0; i < total; i += 1) {
        if (this.enqueue(chance(0.82) ? "message" : "telemetry", { bytes: rand(64, 1400) }, profile === "burst" ? 15 : 50 + rand(-6, 6))) queued += 1;
      }
      this.log("WARN", "LOAD", `${profile.toUpperCase()} load generated: ${queued} jobs.`);
      this.audit("load.generate", { profile, queued });
      return queued;
    }

    synFlood(source = "203.0.113.77", count = 300) {
      count = clamp(count, 20, 1000);
      for (let i = 0; i < count; i += 1) {
        const decision = this.firewallDecision(source, "tcp", config.port);
        const denied = decision.action === "deny" || decision.action === "rate-limit";
        this.recordPacket({ direction: "in", source, destination: config.host, sport: rand(20000, 65000), dport: config.port, protocol: "TCP", flags: "SYN", length: 60, action: denied ? "deny" : "allow", note: `SYN flood / ${decision.rule}` });
        if (!denied) this.enqueue("connection-attempt", { source }, 10);
      }
      this.log("SECURITY", "NET", `SYN flood simulated: ${count} packets from ${source}.`);
      if (config.autoContain) this.block(source, "Automatic DDoS containment", 45);
      this.raise("SYN_FLOOD", "critical", "Simulated SYN flood detected", `${count} SYN packets generated from ${source}; containment executed.`, [source, `${count} packets`]);
    }

    beacon(sessionId) {
      const session = this.session(sessionId);
      if (!session || session.state !== "connected") return false;
      for (let i = 0; i < 8; i += 1) {
        this.recordPacket({ direction: "out", source: config.host, destination: "198.51.100.44", sport: config.port, dport: 443, protocol: "TLS", flags: "PSH,ACK", length: rand(120, 250), sessionId: session.id, action: "allow", note: "Periodic beacon simulation" });
      }
      session.risk = clamp(session.risk + 45, 0, 100);
      this.raise("BEACON", "high", `Periodic outbound beacon: session ${session.id}`, "Synthetic periodic TLS callbacks generated for analyst investigation.", [String(session.id), "198.51.100.44:443"]);
      this.log("SECURITY", "NET", `Beacon simulation attached to session ${session.id}.`);
      this.bus.emit("sessions");
      return true;
    }

    simulateAuthFailures(username = "analyst", count = 6, source = "198.51.100.23") {
      count = clamp(count, 1, 20);
      for (let i = 0; i < count; i += 1) this.authenticate(username, false, source);
      this.log("SECURITY", "AUTH", `${count} failed logins simulated for ${username}.`);
    }

    setFault(name, value) {
      if (!(name in this.state.faults)) return false;
      this.state.faults[name] = value;
      this.log("WARN", "FAULT", `${name} -> ${value}`);
      this.audit("fault.change", { name, value });
      this.bus.emit("faults");
      return true;
    }

    clearFaults() {
      this.state.faults = initialState().faults;
      this.log("SUCCESS", "FAULT", "All faults cleared.");
      this.audit("fault.clear");
      this.bus.emit("faults");
    }

    captureSnapshot(label = "Manual snapshot") {
      const snapshot = {
        id: `SNAP-${String(this.state.snapshots.length + 1).padStart(3, "0")}`,
        label,
        createdAt: now(),
        state: structuredClone({ ...this.state, snapshots: [] }),
        firewall: structuredClone(this.firewall),
        blocks: Array.from(this.dynamicBlocks.entries()),
        dns: Array.from(this.dns.entries()),
        cache: Array.from(this.dnsCache.entries()),
        users: Array.from(this.users.entries()),
        services: Array.from(this.services.entries()),
        workers: structuredClone(this.workers),
        certificate: structuredClone(this.certificate),
        tlsStats: structuredClone(this.tlsStats)
      };
      this.state.snapshots.unshift(snapshot);
      if (this.state.snapshots.length > 12) this.state.snapshots.length = 12;
      this.log("SUCCESS", "SNAPSHOT", `${snapshot.id} captured: ${label}`);
      this.audit("snapshot.capture", { id: snapshot.id, label });
      this.bus.emit("snapshots");
      return snapshot;
    }

    restoreSnapshot(snapshotId) {
      const snapshot = this.state.snapshots.find((s) => s.id === snapshotId);
      if (!snapshot) return false;
      const snapshots = this.state.snapshots;
      this.state = structuredClone(snapshot.state);
      this.state.snapshots = snapshots;
      this.firewall = structuredClone(snapshot.firewall);
      this.dynamicBlocks = new Map(snapshot.blocks);
      this.dns = new Map(snapshot.dns);
      this.dnsCache = new Map(snapshot.cache);
      this.users = new Map(snapshot.users);
      this.services = new Map(snapshot.services);
      this.workers = structuredClone(snapshot.workers);
      this.certificate = structuredClone(snapshot.certificate);
      this.tlsStats = structuredClone(snapshot.tlsStats);
      this.log("WARN", "SNAPSHOT", `${snapshot.id} restored.`);
      this.audit("snapshot.restore", { id: snapshot.id });
      if (this.state.phase === "online") this.startTimer();
      else this.stopTimer();
      this.bus.emit("render");
      return true;
    }

    exportState() {
      return {
        version: VERSION,
        build: BUILD,
        exportedAt: now(),
        config,
        state: this.state,
        workers: this.workers,
        firewall: this.firewall,
        dynamicBlocks: Array.from(this.dynamicBlocks.entries()),
        dns: Array.from(this.dns.entries()),
        dnsCache: Array.from(this.dnsCache.entries()),
        users: Array.from(this.users.entries()),
        services: Array.from(this.services.entries()),
        certificate: this.certificate,
        tlsStats: this.tlsStats,
        logs: this.logs.items,
        authLog: this.authLog.items
      };
    }

    async boot() {
      if (this.busy || this.state.phase !== "offline") return false;
      this.busy = true;
      this.state.phase = "starting";
      this.bus.emit("server");
      const steps = [
        ["KERNEL", "Allocating simulation state..."],
        ["NET", "Configuring atlas0 / MTU 1500..."],
        ["WORKER", `Starting ${this.workers.length}-worker pool...`],
        ["QUEUE", "Initializing bounded priority queue..."],
        ["FIREWALL", "Loading default-deny policy..."],
        ["TLS", `Loading certificate ${this.certificate.serial}...`],
        ["AUTH", "Starting identity subsystem..."],
        ["DNS", "Starting resolver/cache..."],
        ["TELEMETRY", "Opening packet, flow, metric and audit buffers..."]
      ];
      for (const [component, message] of steps) {
        this.log("INFO", component, message);
        await new Promise((resolve) => setTimeout(resolve, 70));
      }
      this.startAllServices();
      this.state.phase = "online";
      this.state.startedAt = now();
      this.state.health = 100;
      this.state.healthLabel = "HEALTHY";
      this.startTimer();
      this.log("SUCCESS", "SERVER", `ATLAS-NET-01 online at ${config.host}:${config.port} (simulation).`);
      this.audit("server.boot", { host: config.host, port: config.port, workers: this.workers.length });
      this.busy = false;
      this.bus.emit("server");
      this.bus.emit("render");
      return true;
    }

    async shutdown(force = false) {
      if (this.busy || this.state.phase === "offline") return false;
      this.busy = true;
      this.state.phase = "stopping";
      this.bus.emit("server");
      this.log(force ? "ERROR" : "WARN", "SERVER", force ? "Forced shutdown initiated." : "Graceful shutdown initiated.");
      if (!force) {
        const deadline = now() + 1000;
        while (this.state.jobs.length && now() < deadline) {
          this.processQueue();
          await new Promise((resolve) => setTimeout(resolve, 80));
        }
      } else {
        this.state.jobs.length = 0;
      }
      for (const session of this.state.sessions) {
        if (session.state === "connected") {
          session.state = "closed";
          session.closedAt = now();
          session.closeReason = force ? "Forced shutdown" : "Server shutdown";
        }
      }
      this.stopAllServices();
      this.stopTimer();
      this.state.phase = "offline";
      this.state.health = 0;
      this.state.healthLabel = "OFFLINE";
      this.log("SUCCESS", "SERVER", "ATLAS-NET-01 offline.");
      this.audit("server.shutdown", { force });
      this.busy = false;
      this.bus.emit("server");
      this.bus.emit("sessions");
      this.bus.emit("render");
      return true;
    }

    async restart() {
      if (this.busy) return false;
      await this.shutdown(false);
      await new Promise((resolve) => setTimeout(resolve, 120));
      return this.boot();
    }

    startTimer() {
      this.stopTimer();
      this.timer = setInterval(() => this.tick(), config.tickMs);
    }

    stopTimer() {
      if (this.timer) clearInterval(this.timer);
      this.timer = null;
    }

    tickSessions() {
      for (const session of this.state.sessions.filter((s) => s.state === "connected")) {
        session.rtt = config.baseLatency + rand(0, 18) + (this.state.faults.latency ? this.state.faults.latencyMs : 0);
        session.rx += rand(0, 800);
        session.tx += rand(0, 950);
        session.throughput = session.isolated ? 0 : rand(20, 450);
        if (chance(0.45)) {
          const drop = this.state.faults.packetLoss && chance(this.state.faults.packetLossPct / 100);
          this.recordPacket({
            direction: chance(0.55) ? "in" : "out",
            source: chance(0.55) ? session.ip : config.host,
            destination: chance(0.55) ? config.host : session.ip,
            sport: session.port,
            dport: config.port,
            protocol: chance(0.75) ? "TLS" : "TCP",
            flags: pick(["ACK", "PSH,ACK", "ACK", "ACK"]),
            length: rand(90, 1450),
            sessionId: session.id,
            action: drop ? "drop" : "allow",
            note: drop ? "Simulated packet loss" : "Session traffic"
          });
        }
        if (chance(0.2)) this.enqueue("message", { sessionId: session.id, bytes: rand(80, 900) }, 50);
      }
      this.bus.emit("sessions");
    }

    tickServices() {
      for (const service of this.services.values()) {
        if (service.state === "running") {
          service.cpu = Math.min(100, rand(0, 12) + this.state.jobs.length / 80);
          service.memory = clamp(service.memory + rand(-2, 3), 10, 250);
        } else {
          service.cpu = 0;
        }
      }
      this.bus.emit("services");
    }

    autoscale() {
      if (!config.autoScale || now() - this.lastAutoScale < 5000) return;
      const depth = this.state.jobs.length;
      if (depth > 250 && this.workers.length < config.maxWorkers) {
        this.lastAutoScale = now();
        this.resizeWorkers(this.workers.length + 2);
        this.log("INFO", "AUTOSCALE", `Queue depth ${depth}; worker pool scaled up.`);
      } else if (depth < 20 && this.workers.length > config.baseWorkers) {
        this.lastAutoScale = now();
        this.resizeWorkers(this.workers.length - 1);
        this.log("INFO", "AUTOSCALE", "Queue normalized; worker pool scaled down.");
      }
    }

    updateHealth() {
      const active = this.state.sessions.filter((s) => s.state === "connected").length;
      const workerAverage = this.workers.reduce((sum, w) => sum + w.utilization, 0) / Math.max(1, this.workers.length);
      const queuePct = (this.state.jobs.length / config.maxQueue) * 100;
      let cpu = 8 + workerAverage * 0.72 + queuePct * 0.18 + active * 0.45;
      let memory = 22 + active * 0.7 + this.state.jobs.length * 0.035 + this.state.packets.length * 0.007;
      if (this.state.faults.cpu) cpu += this.state.faults.cpuPct;
      if (this.state.faults.memory) memory += this.state.faults.memoryPct;
      this.state.cpu = clamp(cpu, 0, 100);
      this.state.memory = clamp(memory, 0, 100);
      const recent = this.state.packets.filter((p) => now() - p.ts <= 1000);
      this.state.pps = recent.length;
      let health = 100;
      health -= Math.max(0, this.state.cpu - 65) * 0.35;
      health -= Math.max(0, this.state.memory - 70) * 0.3;
      health -= queuePct * 0.18;
      health -= (this.state.faults.packetLoss ? this.state.faults.packetLossPct : 0) * 1.7;
      health -= this.state.incidents.filter((i) => i.status !== "closed").length * 2.5;
      this.state.health = clamp(health, 0, 100);
      this.state.healthLabel = this.state.health < 45 ? "CRITICAL" : this.state.health < 70 ? "DEGRADED" : this.state.health < 88 ? "WARN" : "HEALTHY";
      if (queuePct > 80 && !this.state.incidents.some((i) => i.type === "QUEUE_PRESSURE" && i.status !== "closed")) {
        this.raise("QUEUE_PRESSURE", "critical", "Critical queue pressure", `Queue depth ${this.state.jobs.length}/${config.maxQueue}.`, [`${queuePct.toFixed(1)}%`]);
      }
      if (this.state.cpu > 90 && !this.state.incidents.some((i) => i.type === "CPU_SATURATION" && i.status !== "closed")) {
        this.raise("CPU_SATURATION", "high", "CPU saturation", `CPU reached ${this.state.cpu.toFixed(1)}%.`, ["worker pool"]);
      }
      this.state.metrics.push({ ts: now(), health: this.state.health, cpu: this.state.cpu, memory: this.state.memory, queue: this.state.jobs.length, sessions: active, pps: this.state.pps });
      if (this.state.metrics.length > 120) this.state.metrics.shift();
      this.bus.emit("metrics");
    }

    cleanup() {
      for (const [source, block] of this.dynamicBlocks.entries()) {
        if (block.expiresAt <= now()) this.dynamicBlocks.delete(source);
      }
      for (const [name, cached] of this.dnsCache.entries()) {
        if (cached.expiresAt <= now()) this.dnsCache.delete(name);
      }
    }

    tick() {
      if (this.state.phase !== "online") return;
      this.state.ticks += 1;
      this.tickSessions();
      this.processQueue();
      this.tickServices();
      this.autoscale();
      this.cleanup();
      this.updateHealth();
      this.bus.emit("tick");
    }

    reset() {
      this.stopTimer();
      this.logs.clear();
      this.authLog.clear();
      this.state = initialState();
      this.workers = [];
      this.firewall = [];
      this.dynamicBlocks = new Map();
      this.dns = new Map();
      this.dnsCache = new Map();
      this.users = new Map();
      this.services = new Map();
      this.tlsStats = { ok: 0, failed: 0, rotations: 0 };
      this.setupDefaults();
      this.log("INFO", "SYSTEM", `ATLAS Enterprise v${VERSION} reset.`);
      this.bus.emit("render");
    }
  }

  class AtlasUI {
    constructor(engine) {
      this.engine = engine;
      this.shell = this.buildShell();
      this.consoleLevel = "ALL";
      this.consoleText = "";
      this.packetProtocol = "ALL";
      this.packetText = "";
      this.commandHistory = [];
      this.commandIndex = 0;
      this.bindGlobal();
      this.bindEngine();
      this.syncLegacy();
      this.renderAll();
    }

    buildShell() {
      const shell = document.createElement("section");
      shell.className = "atlasx-shell";
      shell.id = "atlas-enterprise-console";
      shell.innerHTML = `
        <header class="atlasx-header">
          <div>
            <span class="atlasx-kicker">ATLAS Enterprise Simulation v${VERSION}</span>
            <h3>ATLAS-NET-01 Network Operations &amp; Security Console</h3>
            <p>Stateful server, traffic, packet, firewall, TLS, DNS, identity, service, incident, fault, audit and recovery simulation.</p>
          </div>
          <div class="atlasx-status-cluster">
            <span class="atlasx-status" id="atlasx-server-status">OFFLINE</span>
            <span class="atlasx-status" id="atlasx-health-status">OFFLINE</span>
            <button class="atlasx-btn atlasx-btn-primary" data-global="boot">Boot</button>
            <button class="atlasx-btn" data-global="restart">Restart</button>
            <button class="atlasx-btn atlasx-btn-danger" data-global="shutdown">Shutdown</button>
          </div>
        </header>
        <nav class="atlasx-tabs" aria-label="ATLAS enterprise console">
          ${[
            ["overview", "Overview"],
            ["sessions", "Sessions"],
            ["workers", "Queue & Workers"],
            ["packets", "Packet Analyzer"],
            ["firewall", "Firewall"],
            ["tls", "TLS"],
            ["dns", "DNS"],
            ["auth", "Identity"],
            ["services", "Services"],
            ["incidents", "Incidents"],
            ["faults", "Fault Lab"],
            ["audit", "Audit & Snapshots"],
            ["console", "Command Console"]
          ].map(([key, label], index) => `<button class="atlasx-tab${index === 0 ? " is-active" : ""}" data-tab="${key}">${label}</button>`).join("")}
        </nav>
        <div class="atlasx-panels">
          ${["overview", "sessions", "workers", "packets", "firewall", "tls", "dns", "auth", "services", "incidents", "faults", "audit", "console"].map((key) => `<section class="atlasx-panel${key === "overview" ? " is-active" : ""}" data-panel="${key}"></section>`).join("")}
        </div>
        <div class="atlasx-boundary"><strong>Safety boundary:</strong> all packets, sessions, credentials, services and faults are simulated in browser memory. No real sockets, host commands or external requests are used.</div>
      `;
      const target = $(".nsl-workbench", root) || $(".section-inner", root) || root;
      target.appendChild(shell);
      return shell;
    }

    panel(name) {
      return $(`[data-panel="${name}"]`, this.shell);
    }

    bindGlobal() {
      this.shell.addEventListener("click", (event) => {
        const tab = event.target.closest("[data-tab]");
        if (tab) this.activate(tab.dataset.tab);
        const global = event.target.closest("[data-global]");
        if (global) {
          if (global.dataset.global === "boot") this.engine.boot();
          if (global.dataset.global === "restart") this.engine.restart();
          if (global.dataset.global === "shutdown") this.engine.shutdown(false);
        }
      });
    }

    bindEngine() {
      ["render", "server", "sessions", "workers", "queue", "packets", "flows", "firewall", "tls", "dns", "auth", "services", "incidents", "faults", "audit", "snapshots", "metrics", "tick"].forEach((name) => {
        this.engine.bus.on(name, () => {
          this.renderHeader();
          if (name === "render") this.renderAll();
          else this.renderActive();
        });
      });
      this.engine.bus.on("log", () => {
        if (this.engine.state.activeTab === "console") this.renderConsoleLines();
      });
    }

    syncLegacy() {
      const bind = (idValue, fn) => document.getElementById(idValue)?.addEventListener("click", fn);
      bind("nsl-start-server", () => { if (this.engine.state.phase === "offline") this.engine.boot(); });
      bind("nsl-stop-server", () => { if (this.engine.state.phase === "online") this.engine.shutdown(false); });
      bind("nsl-reset-lab", () => this.engine.reset());
      bind("nsl-connect-client", () => { if (this.engine.state.phase === "online") this.engine.connect(); });
    }

    activate(name) {
      this.engine.state.activeTab = name;
      $$('[data-tab]', this.shell).forEach((tab) => tab.classList.toggle("is-active", tab.dataset.tab === name));
      $$('[data-panel]', this.shell).forEach((panel) => panel.classList.toggle("is-active", panel.dataset.panel === name));
      this.renderActive();
    }

    renderAll() {
      this.renderHeader();
      ["overview", "sessions", "workers", "packets", "firewall", "tls", "dns", "auth", "services", "incidents", "faults", "audit", "console"].forEach((name) => this.render(name));
      this.activate(this.engine.state.activeTab || "overview");
    }

    renderActive() {
      this.render(this.engine.state.activeTab);
    }

    render(name) {
      const fn = this[`render_${name}`];
      if (typeof fn === "function") fn.call(this);
    }

    renderHeader() {
      const state = this.engine.state;
      const server = $("#atlasx-server-status", this.shell);
      const health = $("#atlasx-health-status", this.shell);
      if (!server || !health) return;
      server.textContent = state.phase.toUpperCase();
      server.className = `atlasx-status is-${state.phase}`;
      health.textContent = `${state.healthLabel} ${state.health.toFixed(0)}%`;
      health.className = `atlasx-status is-${state.healthLabel.toLowerCase()}`;
      const boot = $('[data-global="boot"]', this.shell);
      const restart = $('[data-global="restart"]', this.shell);
      const shutdown = $('[data-global="shutdown"]', this.shell);
      if (boot) boot.disabled = this.engine.busy || state.phase !== "offline";
      if (restart) restart.disabled = this.engine.busy || state.phase === "offline";
      if (shutdown) shutdown.disabled = this.engine.busy || state.phase === "offline";
    }

    metric(label, value) {
      return `<div class="atlasx-metric"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`;
    }

    render_overview() {
      const panel = this.panel("overview");
      const s = this.engine.state;
      const active = s.sessions.filter((x) => x.state === "connected").length;
      const open = s.incidents.filter((x) => x.status !== "closed").length;
      panel.innerHTML = `
        <div class="atlasx-grid">
          <section class="atlasx-card">
            <span class="atlasx-label">Composite health</span>
            <div class="atlasx-health-ring" style="--atlasx-health:${s.health}%"><div><strong>${s.health.toFixed(0)}%</strong><span>${s.healthLabel}</span></div></div>
            ${this.progress("CPU", s.cpu)}
            ${this.progress("Memory", s.memory)}
            ${this.progress("Queue", (s.jobs.length / config.maxQueue) * 100)}
          </section>
          <section class="atlasx-card wide">
            <span class="atlasx-label">Live runtime</span>
            <h4>ATLAS-NET-01</h4>
            <div class="atlasx-metric-grid">
              ${this.metric("Uptime", s.startedAt ? duration(now() - s.startedAt) : "00:00:00")}
              ${this.metric("Sessions", `${active}/${config.maxSessions}`)}
              ${this.metric("Queue", `${s.jobs.length}/${config.maxQueue}`)}
              ${this.metric("Workers", this.engine.workers.length)}
              ${this.metric("Packets/s", s.pps)}
              ${this.metric("Messages", s.messages)}
              ${this.metric("Open Incidents", open)}
              ${this.metric("Dropped", s.dropped)}
            </div>
            <div class="atlasx-action-row atlasx-top-gap">
              <button class="atlasx-btn atlasx-btn-primary" data-overview="connect">Add Session</button>
              <button class="atlasx-btn" data-overview="load">Generate Load</button>
              <button class="atlasx-btn atlasx-btn-warning" data-overview="auth">Failed Login Burst</button>
              <button class="atlasx-btn atlasx-btn-danger" data-overview="ddos">SYN Flood Scenario</button>
              <button class="atlasx-btn" data-overview="snapshot">Snapshot</button>
            </div>
          </section>
          <section class="atlasx-card wide"><span class="atlasx-label">120-second history</span><h4>Health / CPU / Queue</h4><canvas class="atlasx-chart" id="atlasx-chart" width="900" height="160"></canvas></section>
          <section class="atlasx-card"><span class="atlasx-label">Defensive posture</span><h4>Controls</h4><div class="atlasx-detail"><dl><dt>TLS</dt><dd>${this.engine.certificateValid() ? "Valid" : "Expired"}</dd><dt>Firewall</dt><dd>${this.engine.firewall.filter((r) => r.enabled).length} active rules</dd><dt>Auto-scale</dt><dd>${config.autoScale ? "Enabled" : "Disabled"}</dd><dt>Auto-contain</dt><dd>${config.autoContain ? "Enabled" : "Disabled"}</dd><dt>Faults</dt><dd>${Object.values(s.faults).filter((v) => v === true).length} toggles active</dd></dl></div></section>
        </div>`;
      $$('[data-overview]', panel).forEach((button) => button.addEventListener("click", () => {
        const action = button.dataset.overview;
        if (action === "connect") this.engine.connect();
        if (action === "load") this.engine.generateLoad("moderate");
        if (action === "auth") this.engine.simulateAuthFailures();
        if (action === "ddos") this.engine.synFlood();
        if (action === "snapshot") this.engine.captureSnapshot("Overview snapshot");
      }));
      this.drawChart();
    }

    progress(label, value) {
      value = clamp(value, 0, 100);
      return `<div class="atlasx-progress-row"><span>${esc(label)}</span><div class="atlasx-progress"><span style="--value:${value}%"></span></div><strong>${value.toFixed(0)}%</strong></div>`;
    }

    drawChart() {
      const canvas = $("#atlasx-chart", this.shell);
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const history = this.engine.state.metrics;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(71,85,105,.28)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i += 1) {
        const y = (h / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      const series = [
        ["health", "#2dd4bf", (v) => v],
        ["cpu", "#38bdf8", (v) => v],
        ["queue", "#f59e0b", (v) => (v / config.maxQueue) * 100]
      ];
      for (const [key, color, transform] of series) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        history.forEach((point, index) => {
          const x = history.length <= 1 ? 0 : (index / (history.length - 1)) * w;
          const y = h - (clamp(transform(point[key]), 0, 100) / 100) * h;
          if (index === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }
    }

    render_sessions() {
      const panel = this.panel("sessions");
      const s = this.engine.state;
      const selected = this.engine.session(s.selectedSession);
      panel.innerHTML = `
        <div class="atlasx-grid">
          <section class="atlasx-card full"><div class="atlasx-action-row">
            <button class="atlasx-btn atlasx-btn-primary" data-session-action="add">Add Session</button>
            <button class="atlasx-btn" data-session-action="five">Add 5</button>
            <button class="atlasx-btn" data-session-action="ping">Ping</button>
            <button class="atlasx-btn atlasx-btn-warning" data-session-action="beacon">Beacon Scenario</button>
            <button class="atlasx-btn atlasx-btn-warning" data-session-action="isolate">Isolate</button>
            <button class="atlasx-btn" data-session-action="release">Release</button>
            <button class="atlasx-btn atlasx-btn-danger" data-session-action="disconnect">Disconnect</button>
          </div></section>
          <section class="atlasx-card wide"><span class="atlasx-label">Connection table</span><h4>Session State</h4><div class="atlasx-table-wrap"><table class="atlasx-table"><thead><tr><th>ID</th><th>Source</th><th>User</th><th>Role</th><th>State</th><th>TLS</th><th>RTT</th><th>RX</th><th>TX</th><th>Risk</th></tr></thead><tbody>
            ${s.sessions.slice(0, 80).map((x) => `<tr data-session-id="${x.id}" class="${x.id === s.selectedSession ? "is-selected" : ""}"><td>${x.id}</td><td>${esc(x.ip)}:${x.port}</td><td>${esc(x.username)}</td><td>${esc(x.role)}</td><td><span class="atlasx-pill ${x.state === "connected" ? "good" : x.state === "closed" ? "bad" : "warn"}">${x.state}</span></td><td>${x.tls?.protocol || "--"}</td><td>${x.rtt ? `${x.rtt} ms` : "--"}</td><td>${bytes(x.rx)}</td><td>${bytes(x.tx)}</td><td>${x.risk}</td></tr>`).join("") || `<tr><td colspan="10">No sessions.</td></tr>`}
          </tbody></table></div></section>
          <section class="atlasx-card"><span class="atlasx-label">Selected session</span><h4>Inspection</h4><div class="atlasx-detail">${selected ? `<dl><dt>ID</dt><dd>${selected.id}</dd><dt>Endpoint</dt><dd>${esc(selected.ip)}:${selected.port}</dd><dt>Identity</dt><dd>${esc(selected.username)} / ${esc(selected.role)}</dd><dt>State</dt><dd>${selected.state}</dd><dt>TLS</dt><dd>${selected.tls ? `${selected.tls.protocol} / ${selected.tls.cipher}` : "--"}</dd><dt>RTT</dt><dd>${selected.rtt} ms</dd><dt>Throughput</dt><dd>${selected.throughput} Kbps</dd><dt>Risk</dt><dd>${selected.risk}/100</dd><dt>Isolated</dt><dd>${selected.isolated ? "Yes" : "No"}</dd><dt>Age</dt><dd>${duration(now() - selected.connectedAt)}</dd><dt>Close reason</dt><dd>${esc(selected.closeReason || "--")}</dd></dl>` : `<p>Select a session.</p>`}</div><div class="atlasx-commandbar"><input class="atlasx-input" id="atlasx-session-message" placeholder="ServerMessage payload"><button class="atlasx-btn atlasx-btn-primary" data-session-action="send">Send</button></div></section>
        </div>`;
      $$('[data-session-id]', panel).forEach((row) => row.addEventListener("click", () => { s.selectedSession = Number(row.dataset.sessionId); this.render_sessions(); }));
      $$('[data-session-action]', panel).forEach((button) => button.addEventListener("click", async () => {
        const action = button.dataset.sessionAction;
        if (action === "add") await this.engine.connect();
        if (action === "five") for (let i = 0; i < 5; i += 1) await this.engine.connect();
        if (action === "ping" && s.selectedSession) this.engine.ping(s.selectedSession);
        if (action === "beacon" && s.selectedSession) this.engine.beacon(s.selectedSession);
        if (action === "isolate" && s.selectedSession) this.engine.isolate(s.selectedSession);
        if (action === "release" && s.selectedSession) this.engine.release(s.selectedSession);
        if (action === "disconnect" && s.selectedSession) this.engine.disconnect(s.selectedSession);
        if (action === "send" && s.selectedSession) {
          const input = $("#atlasx-session-message", panel);
          if (input.value.trim()) this.engine.send(s.selectedSession, input.value.trim());
          input.value = "";
        }
      }));
    }

    render_workers() {
      const panel = this.panel("workers");
      const s = this.engine.state;
      panel.innerHTML = `
        <div class="atlasx-grid">
          <section class="atlasx-card full"><div class="atlasx-action-row">${["light", "moderate", "heavy", "burst"].map((p) => `<button class="atlasx-btn ${p === "burst" ? "atlasx-btn-danger" : p === "heavy" ? "atlasx-btn-warning" : ""}" data-load="${p}">${p[0].toUpperCase() + p.slice(1)} Load</button>`).join("")}<button class="atlasx-btn" data-worker-action="drain">Drain Queue</button><button class="atlasx-btn" data-worker-action="minus">- Worker</button><button class="atlasx-btn" data-worker-action="plus">+ Worker</button></div></section>
          <section class="atlasx-card wide"><span class="atlasx-label">Execution pool</span><h4>Worker Utilization</h4><div class="atlasx-worker-grid">${this.engine.workers.map((w) => `<div class="atlasx-worker"><strong>${w.id}</strong><small>${w.state} · ${w.completed} done · ${w.failed} failed</small><div class="atlasx-progress"><span style="--value:${w.utilization}%"></span></div></div>`).join("")}</div></section>
          <section class="atlasx-card"><span class="atlasx-label">Queue</span><h4>Backlog</h4><div class="atlasx-metric-grid compact">${this.metric("Depth", s.jobs.length)}${this.metric("Capacity", config.maxQueue)}${this.metric("Workers", this.engine.workers.length)}${this.metric("Proc/Tick", this.engine.workers.length * config.workerCapacity)}</div></section>
          <section class="atlasx-card full"><span class="atlasx-label">Priority queue</span><h4>Queued Jobs</h4><div class="atlasx-table-wrap"><table class="atlasx-table"><thead><tr><th>ID</th><th>Type</th><th>Priority</th><th>Age</th><th>Attempts</th><th>Payload</th></tr></thead><tbody>${s.jobs.slice(0, 160).map((j) => `<tr><td>${j.id}</td><td>${esc(j.type)}</td><td>${j.priority}</td><td>${Math.round((now() - j.createdAt) / 1000)}s</td><td>${j.attempts}</td><td>${esc(JSON.stringify(j.payload)).slice(0, 120)}</td></tr>`).join("") || `<tr><td colspan="6">Queue empty.</td></tr>`}</tbody></table></div></section>
        </div>`;
      $$('[data-load]', panel).forEach((b) => b.addEventListener("click", () => this.engine.generateLoad(b.dataset.load)));
      $$('[data-worker-action]', panel).forEach((b) => b.addEventListener("click", () => {
        if (b.dataset.workerAction === "drain") this.engine.drainQueue();
        if (b.dataset.workerAction === "minus") this.engine.resizeWorkers(this.engine.workers.length - 1);
        if (b.dataset.workerAction === "plus") this.engine.resizeWorkers(this.engine.workers.length + 1);
      }));
    }

    render_packets() {
      const panel = this.panel("packets");
      const packets = this.engine.state.packets.filter((p) => (this.packetProtocol === "ALL" || p.protocol === this.packetProtocol) && (!this.packetText || [p.source, p.destination, p.flags, p.action, p.note].join(" ").toLowerCase().includes(this.packetText.toLowerCase()))).slice(-260).reverse();
      const selectedFlow = this.engine.state.flows.find((f) => f.id === this.engine.state.selectedFlow);
      panel.innerHTML = `
        <div class="atlasx-grid">
          <section class="atlasx-card full"><div class="atlasx-action-row"><select class="atlasx-select inline" id="atlasx-packet-protocol">${["ALL", "TCP", "TLS", "DNS", "ICMP"].map((p) => `<option ${this.packetProtocol === p ? "selected" : ""}>${p}</option>`).join("")}</select><input class="atlasx-input filter-input" id="atlasx-packet-filter" placeholder="Filter packet fields..." value="${esc(this.packetText)}"><button class="atlasx-btn" data-packet-action="clear">Clear</button><button class="atlasx-btn atlasx-btn-danger" data-packet-action="ddos">SYN Flood</button></div></section>
          <section class="atlasx-card wide"><span class="atlasx-label">Packet capture</span><h4>${packets.length} matching packets</h4><div class="atlasx-table-wrap tall"><table class="atlasx-table"><thead><tr><th>#</th><th>Time</th><th>Dir</th><th>Source</th><th>Destination</th><th>Proto</th><th>Flags</th><th>Len</th><th>Action</th><th>Note</th></tr></thead><tbody>${packets.map((p) => `<tr><td>${p.id}</td><td>${time(p.ts)}</td><td>${p.direction}</td><td>${esc(p.source)}:${p.sport}</td><td>${esc(p.destination)}:${p.dport}</td><td>${p.protocol}</td><td>${esc(p.flags)}</td><td>${p.length}</td><td><span class="atlasx-pill ${p.action === "allow" ? "good" : "bad"}">${p.action}</span></td><td>${esc(p.note)}</td></tr>`).join("") || `<tr><td colspan="10">No packets.</td></tr>`}</tbody></table></div></section>
          <section class="atlasx-card"><span class="atlasx-label">Network rate</span><h4>Live Telemetry</h4><div class="atlasx-metric-grid compact">${this.metric("PPS", this.engine.state.pps)}${this.metric("Packets", this.engine.state.packets.length)}${this.metric("Flows", this.engine.state.flows.length)}${this.metric("Dropped", this.engine.state.dropped)}</div></section>
          <section class="atlasx-card wide"><span class="atlasx-label">Stateful flows</span><h4>Flow Table</h4><div class="atlasx-table-wrap"><table class="atlasx-table"><thead><tr><th>ID</th><th>Source</th><th>Destination</th><th>Proto</th><th>Packets</th><th>Bytes</th><th>Risk</th><th>Action</th></tr></thead><tbody>${this.engine.state.flows.slice(0, 140).map((f) => `<tr data-flow-id="${f.id}" class="${f.id === this.engine.state.selectedFlow ? "is-selected" : ""}"><td>${f.id}</td><td>${esc(f.source)}:${f.sport}</td><td>${esc(f.destination)}:${f.dport}</td><td>${f.protocol}</td><td>${f.packets}</td><td>${bytes(f.bytes)}</td><td>${f.risk}</td><td>${f.action}</td></tr>`).join("") || `<tr><td colspan="8">No flows.</td></tr>`}</tbody></table></div></section>
          <section class="atlasx-card"><span class="atlasx-label">Flow inspection</span><h4>Selected Flow</h4><div class="atlasx-detail">${selectedFlow ? `<dl><dt>ID</dt><dd>${selectedFlow.id}</dd><dt>Source</dt><dd>${esc(selectedFlow.source)}:${selectedFlow.sport}</dd><dt>Destination</dt><dd>${esc(selectedFlow.destination)}:${selectedFlow.dport}</dd><dt>Protocol</dt><dd>${selectedFlow.protocol}</dd><dt>Packets</dt><dd>${selectedFlow.packets}</dd><dt>Bytes</dt><dd>${bytes(selectedFlow.bytes)}</dd><dt>Risk</dt><dd>${selectedFlow.risk}</dd></dl>` : `<p>Select a flow.</p>`}</div></section>
        </div>`;
      $("#atlasx-packet-protocol", panel)?.addEventListener("change", (e) => { this.packetProtocol = e.target.value; this.render_packets(); });
      $("#atlasx-packet-filter", panel)?.addEventListener("change", (e) => { this.packetText = e.target.value; this.render_packets(); });
      $$('[data-flow-id]', panel).forEach((row) => row.addEventListener("click", () => { this.engine.state.selectedFlow = Number(row.dataset.flowId); this.render_packets(); }));
      $$('[data-packet-action]', panel).forEach((b) => b.addEventListener("click", () => {
        if (b.dataset.packetAction === "clear") { this.engine.state.packets.length = 0; this.engine.state.flows.length = 0; this.engine.log("INFO", "PCAP", "Packet and flow buffers cleared."); this.render_packets(); }
        if (b.dataset.packetAction === "ddos") this.engine.synFlood();
      }));
    }

    render_firewall() {
      const panel = this.panel("firewall");
      panel.innerHTML = `
        <div class="atlasx-grid">
          <section class="atlasx-card wide"><span class="atlasx-label">Policy engine</span><h4>Firewall Rules</h4><div class="atlasx-table-wrap"><table class="atlasx-table"><thead><tr><th>Rule</th><th>On</th><th>Priority</th><th>Proto</th><th>Source</th><th>Port</th><th>Action</th><th>Reason</th><th></th></tr></thead><tbody>${this.engine.firewall.map((r) => `<tr><td>${r.id}</td><td><button class="atlasx-switch ${r.enabled ? "is-on" : ""}" data-fw-toggle="${r.id}"></button></td><td>${r.priority}</td><td>${r.protocol}</td><td>${esc(r.source)}</td><td>${r.port}</td><td><span class="atlasx-pill ${r.action === "allow" ? "good" : r.action === "deny" ? "bad" : "warn"}">${r.action}</span></td><td>${esc(r.reason)}</td><td><button class="atlasx-btn" data-fw-remove="${r.id}">Remove</button></td></tr>`).join("")}</tbody></table></div></section>
          <section class="atlasx-card"><span class="atlasx-label">Add policy</span><h4>New Rule</h4><div class="atlasx-form-grid"><label>Source<input class="atlasx-input" id="fw-source" value="203.0.113.0/24"></label><label>Protocol<select class="atlasx-select" id="fw-proto"><option>tcp</option><option>udp</option><option>*</option></select></label><label>Port<input class="atlasx-input" id="fw-port" value="60000"></label><label>Action<select class="atlasx-select" id="fw-action"><option>deny</option><option>allow</option><option>rate-limit</option></select></label></div><label class="atlasx-field-label">Reason<input class="atlasx-input" id="fw-reason" value="Analyst-created rule"></label><button class="atlasx-btn atlasx-btn-primary atlasx-top-gap" data-fw-action="add">Add Rule</button></section>
          <section class="atlasx-card full"><span class="atlasx-label">Dynamic containment</span><h4>Temporary Blocks</h4><div class="atlasx-table-wrap"><table class="atlasx-table"><thead><tr><th>Source</th><th>Reason</th><th>Expires</th><th></th></tr></thead><tbody>${Array.from(this.engine.dynamicBlocks.values()).map((b) => `<tr><td>${esc(b.source)}</td><td>${esc(b.reason)}</td><td>${dateTime(b.expiresAt)}</td><td><button class="atlasx-btn" data-unblock="${esc(b.source)}">Unblock</button></td></tr>`).join("") || `<tr><td colspan="4">No dynamic blocks.</td></tr>`}</tbody></table></div></section>
        </div>`;
      $$('[data-fw-toggle]', panel).forEach((b) => b.addEventListener("click", () => this.engine.toggleFirewallRule(b.dataset.fwToggle)));
      $$('[data-fw-remove]', panel).forEach((b) => b.addEventListener("click", () => this.engine.removeFirewallRule(b.dataset.fwRemove)));
      $$('[data-unblock]', panel).forEach((b) => b.addEventListener("click", () => this.engine.unblock(b.dataset.unblock)));
      $('[data-fw-action="add"]', panel)?.addEventListener("click", () => this.engine.addFirewallRule({ source: $("#fw-source", panel).value.trim() || "*", protocol: $("#fw-proto", panel).value, port: $("#fw-port", panel).value.trim() === "*" ? "*" : Number($("#fw-port", panel).value), action: $("#fw-action", panel).value, reason: $("#fw-reason", panel).value.trim() || "Analyst-created rule" }));
    }

    render_tls() {
      const panel = this.panel("tls");
      const c = this.engine.certificate;
      const remaining = Math.floor((c.expiresAt - now()) / 86400000);
      panel.innerHTML = `<div class="atlasx-grid"><section class="atlasx-card half"><span class="atlasx-label">Certificate</span><h4>Server Identity</h4><div class="atlasx-detail"><dl><dt>Subject</dt><dd>${esc(c.subject)}</dd><dt>Issuer</dt><dd>${esc(c.issuer)}</dd><dt>Serial</dt><dd>${esc(c.serial)}</dd><dt>Fingerprint</dt><dd>${esc(c.fingerprint)}</dd><dt>Issued</dt><dd>${dateTime(c.issuedAt)}</dd><dt>Expires</dt><dd>${dateTime(c.expiresAt)}</dd><dt>Remaining</dt><dd>${remaining} days</dd><dt>Status</dt><dd>${this.engine.certificateValid() ? "VALID" : "EXPIRED"}</dd></dl></div><div class="atlasx-action-row atlasx-top-gap"><button class="atlasx-btn atlasx-btn-primary" data-tls="rotate">Rotate Certificate</button><button class="atlasx-btn atlasx-btn-danger" data-tls="expire">Force Expiry</button></div></section><section class="atlasx-card half"><span class="atlasx-label">Handshake telemetry</span><h4>TLS Runtime</h4><div class="atlasx-metric-grid compact">${this.metric("Protocol", "TLS 1.3")}${this.metric("Cipher", "AES-256-GCM")}${this.metric("Successful", this.engine.tlsStats.ok)}${this.metric("Failed", this.engine.tlsStats.failed)}${this.metric("Rotations", this.engine.tlsStats.rotations)}${this.metric("Fault", this.engine.state.faults.tls ? "ON" : "OFF")}</div></section></div>`;
      $$('[data-tls]', panel).forEach((b) => b.addEventListener("click", () => b.dataset.tls === "rotate" ? this.engine.rotateCertificate() : this.engine.expireCertificate()));
    }

    render_dns() {
      const panel = this.panel("dns");
      panel.innerHTML = `<div class="atlasx-grid"><section class="atlasx-card wide"><span class="atlasx-label">Lab records</span><h4>DNS Records</h4><div class="atlasx-table-wrap"><table class="atlasx-table"><thead><tr><th>Name</th><th>Address</th></tr></thead><tbody>${Array.from(this.engine.dns.entries()).map(([n, a]) => `<tr><td>${esc(n)}</td><td>${esc(a)}</td></tr>`).join("")}</tbody></table></div></section><section class="atlasx-card"><span class="atlasx-label">Resolver</span><h4>Query</h4><input class="atlasx-input" id="dns-query" value="telemetry.atlas.local"><div class="atlasx-action-row atlasx-top-gap"><button class="atlasx-btn atlasx-btn-primary" data-dns="resolve">Resolve</button><button class="atlasx-btn" data-dns="flush">Flush</button></div><div class="atlasx-detail atlasx-top-gap" id="dns-result"><p>Run a query.</p></div></section><section class="atlasx-card full"><span class="atlasx-label">Cache</span><h4>Cached Responses</h4><div class="atlasx-table-wrap"><table class="atlasx-table"><thead><tr><th>Name</th><th>Address</th><th>TTL</th></tr></thead><tbody>${Array.from(this.engine.dnsCache.entries()).map(([n, v]) => `<tr><td>${esc(n)}</td><td>${esc(v.address)}</td><td>${Math.max(0, Math.ceil((v.expiresAt - now()) / 1000))}s</td></tr>`).join("") || `<tr><td colspan="3">Cache empty.</td></tr>`}</tbody></table></div></section></div>`;
      $$('[data-dns]', panel).forEach((b) => b.addEventListener("click", () => {
        if (b.dataset.dns === "flush") this.engine.flushDns();
        if (b.dataset.dns === "resolve") {
          const name = $("#dns-query", panel).value.trim();
          const address = this.engine.resolve(name);
          $("#dns-result", panel).innerHTML = address ? `<dl><dt>Name</dt><dd>${esc(name)}</dd><dt>Address</dt><dd>${esc(address)}</dd><dt>Status</dt><dd>NOERROR</dd></dl>` : `<dl><dt>Name</dt><dd>${esc(name)}</dd><dt>Status</dt><dd>Resolution failed</dd></dl>`;
        }
      }));
    }

    render_auth() {
      const panel = this.panel("auth");
      const users = Array.from(this.engine.users.values());
      panel.innerHTML = `<div class="atlasx-grid"><section class="atlasx-card wide"><span class="atlasx-label">Accounts / RBAC</span><h4>Identity Directory</h4><div class="atlasx-table-wrap"><table class="atlasx-table"><thead><tr><th>User</th><th>Role</th><th>Enabled</th><th>Failures</th><th>Locked</th><th>Logins</th><th>Last Login</th><th></th></tr></thead><tbody>${users.map((u) => `<tr><td>${esc(u.username)}</td><td>${esc(u.role)}</td><td>${u.enabled ? "Yes" : "No"}</td><td>${u.failures}</td><td>${u.lockedUntil > now() ? "Yes" : "No"}</td><td>${u.logins}</td><td>${u.lastLogin ? dateTime(u.lastLogin) : "--"}</td><td><button class="atlasx-btn" data-unlock="${u.username}">Unlock</button><button class="atlasx-btn" data-user-toggle="${u.username}">${u.enabled ? "Disable" : "Enable"}</button></td></tr>`).join("")}</tbody></table></div></section><section class="atlasx-card"><span class="atlasx-label">Authentication test</span><h4>Generate Event</h4><select class="atlasx-select" id="auth-user">${users.map((u) => `<option>${u.username}</option>`).join("")}</select><input class="atlasx-input atlasx-top-gap" id="auth-source" value="198.51.100.23"><div class="atlasx-action-row atlasx-top-gap"><button class="atlasx-btn atlasx-btn-primary" data-auth="success">Success</button><button class="atlasx-btn atlasx-btn-warning" data-auth="fail">Failure</button><button class="atlasx-btn atlasx-btn-danger" data-auth="burst">6 Failures</button></div></section><section class="atlasx-card full"><span class="atlasx-label">Security log</span><h4>Authentication Events</h4><div class="atlasx-table-wrap"><table class="atlasx-table"><thead><tr><th>Time</th><th>User</th><th>Source</th><th>Result</th><th>Reason</th></tr></thead><tbody>${this.engine.authLog.latest(150).reverse().map((e) => `<tr><td>${time(e.ts)}</td><td>${esc(e.username)}</td><td>${esc(e.source)}</td><td><span class="atlasx-pill ${e.success ? "good" : "bad"}">${e.success ? "SUCCESS" : "FAIL"}</span></td><td>${esc(e.reason)}</td></tr>`).join("") || `<tr><td colspan="5">No events.</td></tr>`}</tbody></table></div></section></div>`;
      $$('[data-unlock]', panel).forEach((b) => b.addEventListener("click", () => this.engine.unlockUser(b.dataset.unlock)));
      $$('[data-user-toggle]', panel).forEach((b) => b.addEventListener("click", () => this.engine.toggleUser(b.dataset.userToggle)));
      $$('[data-auth]', panel).forEach((b) => b.addEventListener("click", () => {
        const user = $("#auth-user", panel).value;
        const source = $("#auth-source", panel).value.trim();
        if (b.dataset.auth === "success") this.engine.authenticate(user, true, source);
        if (b.dataset.auth === "fail") this.engine.authenticate(user, false, source);
        if (b.dataset.auth === "burst") this.engine.simulateAuthFailures(user, 6, source);
      }));
    }

    render_services() {
      const panel = this.panel("services");
      panel.innerHTML = `<div class="atlasx-grid">${Array.from(this.engine.services.values()).map((svc) => `<section class="atlasx-card"><span class="atlasx-label">${svc.critical ? "Critical service" : "Supporting service"}</span><h4>${esc(svc.display)}</h4><div class="atlasx-detail"><dl><dt>Name</dt><dd>${svc.name}</dd><dt>State</dt><dd><span class="atlasx-pill ${svc.state === "running" ? "good" : svc.state === "degraded" ? "warn" : "bad"}">${svc.state}</span></dd><dt>CPU</dt><dd>${Number(svc.cpu).toFixed(1)}%</dd><dt>Memory</dt><dd>${svc.memory} MB</dd><dt>Restarts</dt><dd>${svc.restarts}</dd><dt>Dependencies</dt><dd>${svc.dependencies.join(", ") || "None"}</dd></dl></div><div class="atlasx-action-row atlasx-top-gap"><button class="atlasx-btn atlasx-btn-primary" data-service="start:${svc.name}">Start</button><button class="atlasx-btn" data-service="restart:${svc.name}">Restart</button><button class="atlasx-btn atlasx-btn-danger" data-service="stop:${svc.name}">Stop</button></div></section>`).join("")}</div>`;
      $$('[data-service]', panel).forEach((b) => b.addEventListener("click", () => {
        const [action, name] = b.dataset.service.split(":");
        if (action === "start") this.engine.startService(name);
        if (action === "stop") this.engine.stopService(name);
        if (action === "restart") this.engine.restartService(name);
      }));
    }

    render_incidents() {
      const panel = this.panel("incidents");
      const s = this.engine.state;
      const selected = this.engine.incident(s.selectedIncident) || s.incidents[0] || null;
      if (selected && !s.selectedIncident) s.selectedIncident = selected.id;
      const playbooks = {
        SYN_FLOOD: ["Validate source concentration and SYN/ACK imbalance.", "Confirm temporary firewall containment.", "Inspect queue depth and worker saturation.", "Validate listener health after traffic reduction.", "Close after packet rate returns to baseline."],
        AUTH_BRUTE_FORCE: ["Validate repeated failures against the same account.", "Review source and affected sessions.", "Lock or disable account if required.", "Inspect successful login following failures.", "Document credential disposition."],
        QUEUE_PRESSURE: ["Freeze nonessential load generation.", "Measure queue age and utilization.", "Scale workers safely.", "Drain stale low-priority work if needed.", "Validate error rate after recovery."],
        BEACON: ["Inspect session identity and flow periodicity.", "Review packet-size pattern.", "Correlate destination with session activity.", "Contain the session if evidence supports it.", "Preserve packet and audit evidence."]
      };
      panel.innerHTML = `<div class="atlasx-grid"><section class="atlasx-card wide"><span class="atlasx-label">Case queue</span><h4>Security / Availability Incidents</h4>${s.incidents.map((i) => `<article class="atlasx-incident-card severity-${i.severity} ${i.id === s.selectedIncident ? "is-selected" : ""}" data-incident-id="${i.id}"><div class="atlasx-incident-meta"><span class="atlasx-pill ${["critical", "high"].includes(i.severity) ? "bad" : "warn"}">${i.severity}</span><span class="atlasx-pill">${i.status}</span><span class="atlasx-pill">${i.owner}</span></div><h5>${i.id} · ${esc(i.title)}</h5><p>${esc(i.summary)}</p></article>`).join("") || `<p>No incidents. Run a security or fault scenario.</p>`}</section><section class="atlasx-card"><span class="atlasx-label">Incident handling</span><h4>${selected ? selected.id : "No selection"}</h4>${selected ? `<div class="atlasx-detail"><dl><dt>Type</dt><dd>${esc(selected.type)}</dd><dt>Severity</dt><dd>${selected.severity}</dd><dt>Status</dt><dd>${selected.status}</dd><dt>Owner</dt><dd>${selected.owner}</dd><dt>Created</dt><dd>${dateTime(selected.createdAt)}</dd><dt>Evidence</dt><dd>${selected.evidence.map(esc).join(", ") || "--"}</dd></dl></div><div class="atlasx-action-row atlasx-top-gap"><button class="atlasx-btn" data-incident-action="assign">Assign</button><button class="atlasx-btn atlasx-btn-warning" data-incident-action="contain">Contain</button><button class="atlasx-btn" data-incident-action="resolve">Resolve</button><button class="atlasx-btn atlasx-btn-primary" data-incident-action="close">Close</button></div><h4>Playbook</h4><ol class="atlasx-playbook">${(playbooks[selected.type] || ["Validate signal.", "Preserve evidence.", "Contain affected component.", "Recover service.", "Document disposition."]).map((x) => `<li>${esc(x)}</li>`).join("")}</ol><h4>Timeline</h4><div class="atlasx-table-wrap"><table class="atlasx-table"><tbody>${selected.timeline.map((t) => `<tr><td>${time(t.ts)}</td><td>${esc(t.action)}</td><td>${esc(t.note)}</td></tr>`).join("")}</tbody></table></div>` : `<p>Select an incident.</p>`}</section></div>`;
      $$('[data-incident-id]', panel).forEach((card) => card.addEventListener("click", () => { s.selectedIncident = card.dataset.incidentId; this.render_incidents(); }));
      $$('[data-incident-action]', panel).forEach((b) => b.addEventListener("click", () => {
        if (!selected) return;
        if (b.dataset.incidentAction === "assign") this.engine.assignIncident(selected.id);
        if (b.dataset.incidentAction === "contain") this.engine.setIncidentStatus(selected.id, "contained", "Containment actions applied.");
        if (b.dataset.incidentAction === "resolve") this.engine.setIncidentStatus(selected.id, "resolved", "Recovery validated.");
        if (b.dataset.incidentAction === "close") this.engine.setIncidentStatus(selected.id, "closed", "Closed after analyst review.");
      }));
    }

    render_faults() {
      const panel = this.panel("faults");
      const f = this.engine.state.faults;
      const toggle = (name, title, note) => `<div class="atlasx-toggle-row"><div><strong>${esc(title)}</strong><small>${esc(note)}</small></div><button class="atlasx-switch ${f[name] ? "is-on" : ""}" data-fault-toggle="${name}"></button></div>`;
      panel.innerHTML = `<div class="atlasx-grid"><section class="atlasx-card half"><span class="atlasx-label">Dependency failures</span><h4>Subsystem Faults</h4>${toggle("dns", "DNS Outage", "Resolver requests fail.")}${toggle("auth", "Authentication Outage", "Login attempts fail.")}${toggle("tls", "TLS Failure", "New handshakes fail.")}</section><section class="atlasx-card half"><span class="atlasx-label">Performance faults</span><h4>Degradation</h4>${toggle("packetLoss", "Packet Loss", "Drops a configurable percentage of packets.")}<label class="atlasx-field-label">Packet loss %<input class="atlasx-input" type="number" id="fault-loss" min="0" max="50" value="${f.packetLossPct}"></label>${toggle("latency", "Added Latency", "Adds RTT and processing latency.")}<label class="atlasx-field-label">Latency ms<input class="atlasx-input" type="number" id="fault-latency" min="0" max="1500" value="${f.latencyMs}"></label>${toggle("cpu", "CPU Pressure", "Raises simulated CPU utilization.")}<label class="atlasx-field-label">CPU points<input class="atlasx-input" type="number" id="fault-cpu" min="0" max="80" value="${f.cpuPct}"></label>${toggle("memory", "Memory Pressure", "Raises simulated memory utilization.")}<label class="atlasx-field-label">Memory points<input class="atlasx-input" type="number" id="fault-memory" min="0" max="70" value="${f.memoryPct}"></label></section><section class="atlasx-card full"><span class="atlasx-label">Integrated scenarios</span><h4>Exercise Launcher</h4><div class="atlasx-action-row"><button class="atlasx-btn atlasx-btn-warning" data-scenario="queue">Queue Saturation</button><button class="atlasx-btn atlasx-btn-danger" data-scenario="ddos">SYN Flood + Auto Block</button><button class="atlasx-btn atlasx-btn-warning" data-scenario="auth">Authentication Attack</button><button class="atlasx-btn atlasx-btn-warning" data-scenario="dns">DNS Failure</button><button class="atlasx-btn atlasx-btn-danger" data-scenario="tls">Expired Certificate</button><button class="atlasx-btn" data-scenario="clear">Clear All Faults</button></div></section></div>`;
      $$('[data-fault-toggle]', panel).forEach((b) => b.addEventListener("click", () => this.engine.setFault(b.dataset.faultToggle, !f[b.dataset.faultToggle])));
      [["#fault-loss", "packetLossPct", 50], ["#fault-latency", "latencyMs", 1500], ["#fault-cpu", "cpuPct", 80], ["#fault-memory", "memoryPct", 70]].forEach(([selector, name, max]) => $(selector, panel)?.addEventListener("change", (e) => this.engine.setFault(name, clamp(e.target.value, 0, max))));
      $$('[data-scenario]', panel).forEach((b) => b.addEventListener("click", async () => {
        if (b.dataset.scenario === "queue") this.engine.generateLoad("burst");
        if (b.dataset.scenario === "ddos") this.engine.synFlood("203.0.113.77", 360);
        if (b.dataset.scenario === "auth") this.engine.simulateAuthFailures("analyst", 7, "198.51.100.23");
        if (b.dataset.scenario === "dns") { this.engine.setFault("dns", true); this.engine.resolve("telemetry.atlas.local"); this.engine.raise("DNS_OUTAGE", "high", "Resolver outage", "Synthetic DNS failure affected service discovery.", ["resolver"]); }
        if (b.dataset.scenario === "tls") { this.engine.expireCertificate(); await this.engine.connect({ ip: "10.10.9.88" }); this.engine.raise("TLS_CERT_EXPIRED", "high", "TLS certificate expired", "New session negotiation failed because the simulated certificate expired.", [this.engine.certificate.serial]); }
        if (b.dataset.scenario === "clear") this.engine.clearFaults();
      }));
    }

    render_audit() {
      const panel = this.panel("audit");
      const s = this.engine.state;
      panel.innerHTML = `<div class="atlasx-grid"><section class="atlasx-card full"><div class="atlasx-action-row"><button class="atlasx-btn atlasx-btn-primary" data-audit-action="snapshot">Capture Snapshot</button><button class="atlasx-btn" data-audit-action="export">Export Full State JSON</button><button class="atlasx-btn" data-audit-action="audit">Export Audit JSON</button></div></section><section class="atlasx-card half"><span class="atlasx-label">Recovery points</span><h4>Snapshots</h4><div class="atlasx-table-wrap"><table class="atlasx-table"><thead><tr><th>ID</th><th>Label</th><th>Created</th><th></th></tr></thead><tbody>${s.snapshots.map((x) => `<tr><td>${x.id}</td><td>${esc(x.label)}</td><td>${dateTime(x.createdAt)}</td><td><button class="atlasx-btn" data-restore="${x.id}">Restore</button></td></tr>`).join("") || `<tr><td colspan="4">No snapshots.</td></tr>`}</tbody></table></div></section><section class="atlasx-card half"><span class="atlasx-label">Audit trail</span><h4>Operator / Engine Actions</h4><div class="atlasx-table-wrap tall"><table class="atlasx-table"><thead><tr><th>Time</th><th>Actor</th><th>Action</th><th>Details</th></tr></thead><tbody>${s.audit.slice(0, 260).map((a) => `<tr><td>${time(a.ts)}</td><td>${esc(a.actor)}</td><td>${esc(a.action)}</td><td>${esc(JSON.stringify(a.data)).slice(0, 180)}</td></tr>`).join("") || `<tr><td colspan="4">No audit events.</td></tr>`}</tbody></table></div></section></div>`;
      $$('[data-audit-action]', panel).forEach((b) => b.addEventListener("click", () => {
        if (b.dataset.auditAction === "snapshot") this.engine.captureSnapshot("Analyst recovery point");
        if (b.dataset.auditAction === "export") download(`atlas-enterprise-state-${Date.now()}.json`, JSON.stringify(this.engine.exportState(), null, 2));
        if (b.dataset.auditAction === "audit") download(`atlas-enterprise-audit-${Date.now()}.json`, JSON.stringify(this.engine.state.audit, null, 2));
      }));
      $$('[data-restore]', panel).forEach((b) => b.addEventListener("click", () => this.engine.restoreSnapshot(b.dataset.restore)));
    }

    render_console() {
      const panel = this.panel("console");
      panel.innerHTML = `<div class="atlasx-grid"><section class="atlasx-card wide"><span class="atlasx-label">Structured event stream</span><h4>ATLAS Event Console</h4><div class="atlasx-action-row"><select class="atlasx-select inline" id="console-level">${["ALL", "DEBUG", "INFO", "SUCCESS", "WARN", "ERROR", "SECURITY"].map((x) => `<option ${this.consoleLevel === x ? "selected" : ""}>${x}</option>`).join("")}</select><input class="atlasx-input filter-input" id="console-filter" placeholder="Filter logs..." value="${esc(this.consoleText)}"><button class="atlasx-btn" data-console="clear">Clear</button></div><div class="atlasx-console atlasx-top-gap" id="atlasx-console-output"></div><form class="atlasx-commandbar" id="atlasx-command-form"><input class="atlasx-input" id="atlasx-command-input" autocomplete="off" spellcheck="false" placeholder="help | status | sessions | connect 5 | load heavy | ddos | snapshot ..."><button class="atlasx-btn atlasx-btn-primary" type="submit">Run</button></form></section><section class="atlasx-card"><span class="atlasx-label">Command reference</span><h4>Operations CLI</h4><div class="atlasx-help">${["help", "status", "boot | shutdown | restart", "connect [count]", "sessions", "ping <id>", "isolate <id>", "release <id>", "disconnect <id>", "message <id> <text>", "broadcast <text>", "load light|moderate|heavy|burst", "workers <count>", "queue | drain", "packets [count]", "flows", "ddos [packets]", "beacon <session-id>", "firewall", "block <ip>", "unblock <ip>", "tls | cert rotate | cert expire", "dns <name> | dns flush", "auth fail <user> [count]", "services", "service start|stop|restart <name>", "incident list", "incident close <id>", "fault clear", "snapshot [label]", "snapshots", "export", "clear"].map((x) => `<code>${esc(x)}</code>`).join("")}</div></section></div>`;
      $("#console-level", panel)?.addEventListener("change", (e) => { this.consoleLevel = e.target.value; this.renderConsoleLines(); });
      $("#console-filter", panel)?.addEventListener("input", (e) => { this.consoleText = e.target.value; this.renderConsoleLines(); });
      $('[data-console="clear"]', panel)?.addEventListener("click", () => { this.engine.logs.clear(); this.renderConsoleLines(); });
      $("#atlasx-command-form", panel)?.addEventListener("submit", (e) => { e.preventDefault(); const input = $("#atlasx-command-input", panel); const raw = input.value.trim(); input.value = ""; if (raw) { this.commandHistory.push(raw); this.commandIndex = this.commandHistory.length; this.runCommand(raw); } });
      $("#atlasx-command-input", panel)?.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp") { e.preventDefault(); this.commandIndex = clamp(this.commandIndex - 1, 0, this.commandHistory.length); e.target.value = this.commandHistory[this.commandIndex] || ""; }
        if (e.key === "ArrowDown") { e.preventDefault(); this.commandIndex = clamp(this.commandIndex + 1, 0, this.commandHistory.length); e.target.value = this.commandHistory[this.commandIndex] || ""; }
      });
      this.renderConsoleLines();
    }

    renderConsoleLines() {
      const output = $("#atlasx-console-output", this.shell);
      if (!output) return;
      const textFilter = this.consoleText.toLowerCase();
      const items = this.engine.logs.items.filter((x) => (this.consoleLevel === "ALL" || x.level === this.consoleLevel) && (!textFilter || [x.level, x.component, x.message, JSON.stringify(x.data)].join(" ").toLowerCase().includes(textFilter))).slice(-300);
      output.innerHTML = items.map((x) => `<div class="atlasx-log level-${x.level.toLowerCase()}"><span class="time">${time(x.ts)}</span><span class="level">${x.level}</span><span class="component">${esc(x.component)}</span><span>${esc(x.message)}</span></div>`).join("");
      output.scrollTop = output.scrollHeight;
    }

    async runCommand(raw) {
      const args = raw.match(/"[^"]*"|'[^']*'|\S+/g)?.map((x) => x.replace(/^["']|["']$/g, "")) || [];
      const command = (args.shift() || "").toLowerCase();
      const num = (index, fallback = null) => Number.isFinite(Number(args[index])) ? Number(args[index]) : fallback;
      this.engine.log("DEBUG", "CLI", `> ${raw}`);
      if (command === "help") return this.engine.log("INFO", "CLI", "Commands: status, boot, shutdown, restart, connect, sessions, ping, isolate, release, disconnect, message, broadcast, load, workers, queue, drain, packets, flows, ddos, beacon, firewall, block, unblock, tls, cert, dns, auth, services, service, incident, fault, snapshot, snapshots, export, clear.");
      if (command === "status") return this.engine.log("INFO", "CLI", `server=${this.engine.state.phase} health=${this.engine.state.health.toFixed(0)}% sessions=${this.engine.state.sessions.filter((s) => s.state === "connected").length} queue=${this.engine.state.jobs.length} workers=${this.engine.workers.length} pps=${this.engine.state.pps}`);
      if (command === "boot") return this.engine.boot();
      if (command === "shutdown") return this.engine.shutdown(args[0] === "--force");
      if (command === "restart") return this.engine.restart();
      if (command === "connect") { for (let i = 0; i < clamp(num(0, 1), 1, 20); i += 1) await this.engine.connect(); return; }
      if (command === "sessions") { const list = this.engine.state.sessions.filter((s) => s.state === "connected"); if (!list.length) return this.engine.log("INFO", "CLI", "No connected sessions."); list.forEach((s) => this.engine.log("INFO", "CLI", `${s.id} ${s.ip}:${s.port} ${s.username}/${s.role} RTT=${s.rtt}ms risk=${s.risk} isolated=${s.isolated}`)); return; }
      if (command === "ping") return this.engine.ping(num(0));
      if (command === "isolate") return this.engine.isolate(num(0));
      if (command === "release") return this.engine.release(num(0));
      if (command === "disconnect") return this.engine.disconnect(num(0));
      if (command === "message") return this.engine.send(num(0), args.slice(1).join(" "));
      if (command === "broadcast") return this.engine.broadcast(args.join(" "));
      if (command === "load") return this.engine.generateLoad((args[0] || "moderate").toLowerCase());
      if (command === "workers") return num(0) ? this.engine.resizeWorkers(num(0)) : this.engine.log("INFO", "CLI", `workers=${this.engine.workers.length}`);
      if (command === "queue") return this.engine.log("INFO", "CLI", `queue=${this.engine.state.jobs.length}/${config.maxQueue}`);
      if (command === "drain") return this.engine.drainQueue();
      if (command === "packets") { this.engine.state.packets.slice(-clamp(num(0, 10), 1, 50)).forEach((p) => this.engine.log("INFO", "CLI", `#${p.id} ${p.source}:${p.sport} -> ${p.destination}:${p.dport} ${p.protocol} ${p.flags} ${p.action}`)); return; }
      if (command === "flows") { this.engine.state.flows.slice(0, 20).forEach((f) => this.engine.log("INFO", "CLI", `flow=${f.id} ${f.source}:${f.sport}->${f.destination}:${f.dport} ${f.protocol} packets=${f.packets} bytes=${f.bytes} risk=${f.risk}`)); return; }
      if (command === "ddos") return this.engine.synFlood("203.0.113.77", clamp(num(0, 300), 20, 1000));
      if (command === "beacon") return this.engine.beacon(num(0));
      if (command === "firewall") { this.engine.firewall.forEach((r) => this.engine.log("INFO", "CLI", `${r.id} ${r.enabled ? "ON" : "OFF"} p=${r.priority} src=${r.source} port=${r.port} action=${r.action}`)); return; }
      if (command === "block") return this.engine.block(args[0], "CLI block", 60);
      if (command === "unblock") return this.engine.unblock(args[0]);
      if (command === "tls") return this.engine.log("INFO", "CLI", `TLS1.3 cert=${this.engine.certificate.serial} valid=${this.engine.certificateValid()} success=${this.engine.tlsStats.ok} failed=${this.engine.tlsStats.failed}`);
      if (command === "cert" && args[0] === "rotate") return this.engine.rotateCertificate();
      if (command === "cert" && args[0] === "expire") return this.engine.expireCertificate();
      if (command === "dns" && args[0] === "flush") return this.engine.flushDns();
      if (command === "dns") return this.engine.log("INFO", "CLI", `${args[0]} -> ${this.engine.resolve(args[0]) || "resolution failed"}`);
      if (command === "auth" && args[0] === "fail") return this.engine.simulateAuthFailures(args[1] || "analyst", clamp(num(2, 1), 1, 20));
      if (command === "services") { for (const x of this.engine.services.values()) this.engine.log("INFO", "CLI", `${x.name} ${x.state} cpu=${Number(x.cpu).toFixed(1)}% mem=${x.memory}MB restarts=${x.restarts}`); return; }
      if (command === "service") { const [action, name] = args; if (action === "start") return this.engine.startService(name); if (action === "stop") return this.engine.stopService(name); if (action === "restart") return this.engine.restartService(name); }
      if (command === "incident" && (args[0] || "list") === "list") { this.engine.state.incidents.forEach((i) => this.engine.log("INFO", "CLI", `${i.id} ${i.severity} ${i.status} ${i.title}`)); return; }
      if (command === "incident" && args[0] === "close") return this.engine.setIncidentStatus(args[1], "closed", "Closed from CLI.");
      if (command === "fault" && args[0] === "clear") return this.engine.clearFaults();
      if (command === "snapshot") return this.engine.captureSnapshot(args.join(" ") || "CLI snapshot");
      if (command === "snapshots") { this.engine.state.snapshots.forEach((s) => this.engine.log("INFO", "CLI", `${s.id} ${dateTime(s.createdAt)} ${s.label}`)); return; }
      if (command === "export") { download(`atlas-enterprise-state-${Date.now()}.json`, JSON.stringify(this.engine.exportState(), null, 2)); return this.engine.log("SUCCESS", "CLI", "State export generated."); }
      if (command === "clear") { this.engine.logs.clear(); return this.renderConsoleLines(); }
      this.engine.log("WARN", "CLI", `${command}: command not found. Type help.`);
    }
  }

  const engine = new AtlasEngine();
  const ui = new AtlasUI(engine);
  engine.log("INFO", "SYSTEM", `ATLAS Enterprise Simulation v${VERSION} build ${BUILD} initialized.`);
  engine.log("SECURITY", "BOUNDARY", "Browser-only simulation: no real sockets, host commands, credentials or external requests.");
  engine.audit("system.initialize", { version: VERSION, build: BUILD });

  window.ATLAS = Object.freeze({
    version: VERSION,
    build: BUILD,
    engine,
    ui,
    boot: () => engine.boot(),
    shutdown: (force = false) => engine.shutdown(force),
    restart: () => engine.restart(),
    connect: (options) => engine.connect(options),
    disconnect: (sessionId, reason) => engine.disconnect(sessionId, reason),
    isolate: (sessionId) => engine.isolate(sessionId),
    release: (sessionId) => engine.release(sessionId),
    ping: (sessionId) => engine.ping(sessionId),
    send: (sessionId, message) => engine.send(sessionId, message),
    broadcast: (message) => engine.broadcast(message),
    load: (profile) => engine.generateLoad(profile),
    ddos: (source, count) => engine.synFlood(source, count),
    beacon: (sessionId) => engine.beacon(sessionId),
    snapshot: (label) => engine.captureSnapshot(label),
    exportState: () => engine.exportState(),
    reset: () => engine.reset()
  });
})();
