/*
 * ATLAS OS v3.0
 * Browser-resident operating environment layered over ATLAS Enterprise v2.
 * Static GitHub Pages safe: no real sockets, host shell, host filesystem, or backend.
 */
(() => {
  "use strict";

  const VERSION = "3.0.0";
  const BUILD = "2026-09-08";
  const ROOT = "[data-network-server-lab]";
  const SETTINGS_KEY = "atlas.os.v3.settings";
  const FILES_KEY = "atlas.os.v3.files";
  const LAYOUT_KEY = "atlas.os.v3.layout";

  const $ = (q, s = document) => s.querySelector(q);
  const $$ = (q, s = document) => Array.from(s.querySelectorAll(q));
  const now = () => Date.now();
  const clamp = (v, a, b) => Math.min(b, Math.max(a, Number(v) || 0));
  const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const esc = (v) => String(v ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  const time = (ts = now()) => new Date(ts).toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const shortTime = (ts = now()) => new Date(ts).toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" });
  const dateLabel = (ts = now()) => new Date(ts).toLocaleDateString([], { weekday: "short", month: "short", day: "2-digit" });
  const dateTime = (ts = now()) => new Date(ts).toLocaleString([], { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" });

  function duration(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return [h, m, s].map((x) => String(x).padStart(2, "0")).join(":");
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

  function normalizePath(input, cwd = "/") {
    const raw = String(input || ".");
    const absolute = raw.startsWith("/") ? raw : `${cwd}/${raw}`;
    const parts = [];
    for (const part of absolute.split("/")) {
      if (!part || part === ".") continue;
      if (part === "..") parts.pop();
      else parts.push(part);
    }
    return `/${parts.join("/")}` || "/";
  }

  function parentPath(path) {
    const parts = normalizePath(path).split("/").filter(Boolean);
    parts.pop();
    return `/${parts.join("/")}` || "/";
  }

  function baseName(path) {
    const parts = normalizePath(path).split("/").filter(Boolean);
    return parts.length ? parts[parts.length - 1] : "/";
  }

  function saveLocal(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  function loadLocal(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function download(name, data, type = "application/json") {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function waitForAtlas(timeout = 8000) {
    return new Promise((resolve, reject) => {
      const started = now();
      const poll = () => {
        if (window.ATLAS?.engine) return resolve(window.ATLAS);
        if (now() - started > timeout) return reject(new Error("ATLAS Enterprise v2 engine not found."));
        setTimeout(poll, 50);
      };
      poll();
    });
  }

  class VirtualFS {
    constructor(os) {
      this.os = os;
      this.cwd = "/home/analyst";
      this.nodes = new Map();
      this.seed();
      this.load();
    }

    seed() {
      const dirs = [
        "/", "/etc", "/etc/atlas", "/home", "/home/analyst", "/home/analyst/Documents",
        "/home/analyst/Investigations", "/home/analyst/Exports", "/proc", "/proc/atlas",
        "/proc/net", "/tmp", "/var", "/var/log", "/var/log/atlas", "/var/lib",
        "/var/lib/atlas", "/snapshots"
      ];

      dirs.forEach((path) => this.nodes.set(path, {
        type: "dir",
        path,
        readonly: !path.startsWith("/home/analyst") && path !== "/tmp",
        createdAt: now(),
        modifiedAt: now()
      }));

      const files = [
        ["/home/analyst/README.txt", false, [
          "ATLAS OS v3 Analyst Workspace",
          "=============================",
          "",
          "This workstation is a static-browser operating-system simulation.",
          "",
          "Try these terminal commands:",
          "  neofetch",
          "  ps",
          "  ip addr",
          "  ss",
          "  cat /proc/atlas/status",
          "  journalctl security",
          "  atlasctl connect 5",
          "  atlasctl load heavy",
          "  atlasctl ddos 360",
          "  atlasctl incidents",
          "",
          "Writable locations: /home/analyst and /tmp"
        ].join("\n")],
        ["/home/analyst/Investigations/incident-notes.txt", false, "Analyst investigation notes.\n\n"],
        ["/home/analyst/Documents/architecture.txt", false, [
          "ATLAS architecture",
          "",
          "Simulation engine: window.ATLAS.engine",
          "Desktop shell: ATLAS OS v3",
          "Hosting: static HTML/CSS/JavaScript",
          "Packets and flows: synthetic state objects",
          "Terminal: simulated commands only",
          "Host filesystem access: disabled",
          "Host command execution: disabled"
        ].join("\n")],
        ["/etc/atlas/server.conf", true, "HOST=127.0.0.1\nPORT=60000\nTRANSPORT=TCP\nTLS=TLS1.3\nMAX_SESSIONS=64\nMODE=browser-simulation"],
        ["/etc/atlas/security.conf", true, "DEFAULT_POLICY=deny\nAUTO_SCALE=true\nAUTO_CONTAIN=true\nREAL_SOCKET_ACCESS=false\nHOST_COMMAND_EXECUTION=false\nHOST_FILESYSTEM_ACCESS=false"]
      ];

      files.forEach(([path, readonly, content]) => this.nodes.set(path, {
        type: "file", path, readonly, content, createdAt: now(), modifiedAt: now()
      }));
    }

    dynamicPaths() {
      return [
        "/proc/atlas/status",
        "/proc/atlas/processes",
        "/proc/net/sessions",
        "/proc/net/flows",
        "/etc/atlas/firewall.rules",
        "/var/log/atlas/events.log",
        "/var/log/atlas/security.log",
        "/var/log/atlas/audit.log",
        "/var/log/atlas/auth.log",
        "/var/lib/atlas/incidents.json",
        "/var/lib/atlas/sessions.json"
      ];
    }

    ensureDynamic() {
      this.dynamicPaths().forEach((path) => {
        if (!this.nodes.has(path)) this.nodes.set(path, {
          type: "file", path, readonly: true, dynamic: true, createdAt: now(), modifiedAt: now()
        });
      });

      this.os.engine.state.snapshots.forEach((snapshot) => {
        const path = `/snapshots/${snapshot.id}.json`;
        if (!this.nodes.has(path)) this.nodes.set(path, {
          type: "file", path, readonly: true, dynamic: true, snapshotId: snapshot.id,
          createdAt: snapshot.createdAt, modifiedAt: snapshot.createdAt
        });
      });
    }

    load() {
      const saved = loadLocal(FILES_KEY, {});
      Object.entries(saved).forEach(([path, node]) => {
        if (path.startsWith("/home/analyst") || path.startsWith("/tmp")) this.nodes.set(path, node);
      });
    }

    persist() {
      const data = {};
      this.nodes.forEach((node, path) => {
        if (path.startsWith("/home/analyst") || path.startsWith("/tmp")) data[path] = node;
      });
      saveLocal(FILES_KEY, data);
    }

    dynamicContent(path) {
      const e = this.os.engine;
      if (path === "/proc/atlas/status") return [
        `phase=${e.state.phase}`,
        `health=${Number(e.state.health).toFixed(1)}`,
        `health_label=${e.state.healthLabel}`,
        `cpu=${Number(e.state.cpu).toFixed(1)}`,
        `memory=${Number(e.state.memory).toFixed(1)}`,
        `pps=${e.state.pps}`,
        `sessions=${e.state.sessions.filter((s) => s.state === "connected").length}`,
        `queue=${e.state.jobs.length}`,
        `workers=${e.workers.length}`,
        `incidents=${e.state.incidents.filter((i) => i.status !== "closed").length}`,
        `uptime=${e.state.startedAt ? duration(now() - e.state.startedAt) : "offline"}`
      ].join("\n");
      if (path === "/proc/atlas/processes") return this.os.processManager.list().map((p) => `${p.pid}\t${p.user}\t${p.state}\t${p.cpu.toFixed(1)}\t${p.memory.toFixed(1)}\t${p.name}`).join("\n");
      if (path === "/proc/net/sessions") return e.state.sessions.map((s) => `${s.id}\t${s.state}\t${s.ip}:${s.port}\t${s.username}/${s.role}\trtt=${s.rtt || 0}\trisk=${s.risk}`).join("\n");
      if (path === "/proc/net/flows") return e.state.flows.map((f) => `${f.id}\t${f.protocol}\t${f.source}:${f.sport}\t${f.destination}:${f.dport}\tpkts=${f.packets}\tbytes=${f.bytes}\trisk=${f.risk}`).join("\n");
      if (path === "/etc/atlas/firewall.rules") return e.firewall.map((r) => `${r.id}\t${r.enabled ? "ON" : "OFF"}\tprio=${r.priority}\t${r.protocol}\t${r.source}\tport=${r.port}\t${r.action}\t${r.reason}`).join("\n");
      if (path === "/var/log/atlas/events.log") return e.logs.items.map((x) => `${dateTime(x.ts)} ${x.level.padEnd(8)} ${x.component.padEnd(12)} ${x.message}`).join("\n");
      if (path === "/var/log/atlas/security.log") return e.logs.items.filter((x) => ["SECURITY", "ERROR", "WARN"].includes(x.level)).map((x) => `${dateTime(x.ts)} ${x.level.padEnd(8)} ${x.component.padEnd(12)} ${x.message}`).join("\n");
      if (path === "/var/log/atlas/audit.log") return e.state.audit.slice().reverse().map((x) => `${dateTime(x.ts)} actor=${x.actor} action=${x.action} data=${JSON.stringify(x.data)}`).join("\n");
      if (path === "/var/log/atlas/auth.log") return e.authLog.items.map((x) => `${dateTime(x.ts)} user=${x.username} source=${x.source} success=${x.success} reason=${x.reason}`).join("\n");
      if (path === "/var/lib/atlas/incidents.json") return JSON.stringify(e.state.incidents, null, 2);
      if (path === "/var/lib/atlas/sessions.json") return JSON.stringify(e.state.sessions, null, 2);
      return "";
    }

    stat(path) {
      this.ensureDynamic();
      return this.nodes.get(normalizePath(path, this.cwd)) || null;
    }

    exists(path) {
      return Boolean(this.stat(path));
    }

    list(path = this.cwd) {
      this.ensureDynamic();
      const normalized = normalizePath(path, this.cwd);
      const node = this.nodes.get(normalized);
      if (!node || node.type !== "dir") return [];
      const prefix = normalized === "/" ? "/" : `${normalized}/`;
      const out = [];
      this.nodes.forEach((candidate, candidatePath) => {
        if (!candidatePath.startsWith(prefix) || candidatePath === normalized) return;
        const rest = candidatePath.slice(prefix.length);
        if (!rest || rest.includes("/")) return;
        out.push({ ...candidate, name: rest });
      });
      return out.sort((a, b) => a.type === b.type ? a.name.localeCompare(b.name) : a.type === "dir" ? -1 : 1);
    }

    read(path) {
      this.ensureDynamic();
      const normalized = normalizePath(path, this.cwd);
      const node = this.nodes.get(normalized);
      if (!node || node.type !== "file") throw new Error(`No such file: ${normalized}`);
      if (node.snapshotId) return JSON.stringify(this.os.engine.state.snapshots.find((s) => s.id === node.snapshotId) || {}, null, 2);
      if (node.dynamic || this.dynamicPaths().includes(normalized)) return this.dynamicContent(normalized);
      return node.content || "";
    }

    write(path, content) {
      const normalized = normalizePath(path, this.cwd);
      if (!normalized.startsWith("/home/analyst") && !normalized.startsWith("/tmp")) throw new Error("Permission denied: only /home/analyst and /tmp are writable.");
      const parent = this.nodes.get(parentPath(normalized));
      if (!parent || parent.type !== "dir") throw new Error("Parent directory does not exist.");
      const old = this.nodes.get(normalized);
      if (old?.readonly) throw new Error("Permission denied: read-only file.");
      this.nodes.set(normalized, { type: "file", path: normalized, readonly: false, content: String(content), createdAt: old?.createdAt || now(), modifiedAt: now() });
      this.persist();
      return true;
    }

    mkdir(path) {
      const normalized = normalizePath(path, this.cwd);
      if (!normalized.startsWith("/home/analyst") && !normalized.startsWith("/tmp")) throw new Error("Permission denied.");
      if (this.nodes.has(normalized)) throw new Error("Path already exists.");
      const parent = this.nodes.get(parentPath(normalized));
      if (!parent || parent.type !== "dir") throw new Error("Parent directory does not exist.");
      this.nodes.set(normalized, { type: "dir", path: normalized, readonly: false, createdAt: now(), modifiedAt: now() });
      this.persist();
    }

    remove(path) {
      const normalized = normalizePath(path, this.cwd);
      const node = this.nodes.get(normalized);
      if (!node) throw new Error("No such file or directory.");
      if (!normalized.startsWith("/home/analyst") && !normalized.startsWith("/tmp")) throw new Error("Permission denied.");
      if (node.readonly) throw new Error("Read-only path.");
      if (node.type === "dir") {
        for (const candidate of this.nodes.keys()) if (candidate.startsWith(`${normalized}/`)) throw new Error("Directory not empty.");
      }
      this.nodes.delete(normalized);
      this.persist();
    }
  }

  class ProcessManager {
    constructor(os) {
      this.os = os;
      this.nextPid = 2200;
      this.appPids = new Map();
      this.core = [
        { pid: 1, ppid: 0, user: "root", name: "atlas-init", state: "S", cpu: .2, memory: 22, protected: true, kind: "core" },
        { pid: 7, ppid: 1, user: "root", name: "atlas-kernel-sim", state: "S", cpu: .4, memory: 48, protected: true, kind: "core" },
        { pid: 24, ppid: 1, user: "root", name: "atlas-desktop", state: "S", cpu: .8, memory: 96, protected: true, kind: "core" },
        { pid: 31, ppid: 24, user: "root", name: "atlas-window-manager", state: "S", cpu: .5, memory: 44, protected: true, kind: "core" }
      ];
    }

    registerApp(appId) {
      if (!this.appPids.has(appId)) this.appPids.set(appId, this.nextPid++);
      return this.appPids.get(appId);
    }

    unregisterApp(appId) {
      this.appPids.delete(appId);
    }

    list() {
      const services = [];
      let pid = 350;
      for (const service of this.os.engine.services.values()) services.push({
        pid: pid++, ppid: 1, user: service.name === "auth" ? "authsvc" : "root",
        name: `atlas-${service.name}d`, state: service.state === "running" ? "S" : service.state === "degraded" ? "D" : "T",
        cpu: Number(service.cpu || 0), memory: Number(service.memory || 0), protected: service.critical,
        kind: "service", serviceName: service.name
      });
      const apps = [];
      for (const [appId, appPid] of this.appPids.entries()) {
        const app = this.os.apps.get(appId);
        if (!app) continue;
        apps.push({ pid: appPid, ppid: 24, user: "analyst", name: app.process || `atlas-${appId}`, state: this.os.windows.isMinimized(appId) ? "S" : "R", cpu: this.os.windows.isFocused(appId) ? rand(3, 18) / 10 : rand(0, 6) / 10, memory: app.memory || 48, protected: false, kind: "app", appId });
      }
      return [...this.core.map((x) => ({ ...x, cpu: x.cpu + rand(0, 3) / 10 })), ...services, ...apps].sort((a, b) => a.pid - b.pid);
    }

    kill(pid) {
      const proc = this.list().find((x) => x.pid === Number(pid));
      if (!proc) return { ok: false, message: `PID ${pid} not found.` };
      if (proc.protected) return { ok: false, message: `${proc.name} is protected and cannot be terminated.` };
      if (proc.kind === "service") {
        this.os.engine.stopService(proc.serviceName);
        return { ok: true, message: `${proc.name} stopped.` };
      }
      if (proc.kind === "app") {
        this.os.windows.close(proc.appId);
        return { ok: true, message: `${proc.name} terminated.` };
      }
      return { ok: false, message: "Unsupported process type." };
    }
  }

  class WindowManager {
    constructor(os) {
      this.os = os;
      this.layer = null;
      this.taskArea = null;
      this.records = new Map();
      this.z = 100;
      this.cascade = 0;
      this.drag = null;
      this.resize = null;
      document.addEventListener("pointermove", (event) => this.pointerMove(event));
      document.addEventListener("pointerup", () => this.pointerUp());
    }

    mount(layer, taskArea) {
      this.layer = layer;
      this.taskArea = taskArea;
    }

    layout(appId, app) {
      const saved = loadLocal(LAYOUT_KEY, {});
      if (saved[appId]) return saved[appId];
      const offset = (this.cascade++ % 9) * 24;
      return {
        left: 55 + offset,
        top: 34 + offset,
        width: Math.min(app.width || 900, window.innerWidth - 90),
        height: Math.min(app.height || 620, window.innerHeight - 120),
        maximized: false
      };
    }

    save(appId) {
      const record = this.records.get(appId);
      if (!record) return;
      const rect = record.element.getBoundingClientRect();
      const saved = loadLocal(LAYOUT_KEY, {});
      saved[appId] = {
        left: parseFloat(record.element.style.left) || rect.left,
        top: parseFloat(record.element.style.top) || rect.top,
        width: parseFloat(record.element.style.width) || rect.width,
        height: parseFloat(record.element.style.height) || rect.height,
        maximized: record.maximized
      };
      saveLocal(LAYOUT_KEY, saved);
    }

    open(appId) {
      const app = this.os.apps.get(appId);
      if (!app) return null;
      if (this.records.has(appId)) {
        const record = this.records.get(appId);
        record.minimized = false;
        record.element.classList.remove("is-minimized");
        this.focus(appId);
        this.os.renderApp(appId);
        return record.element;
      }

      const layout = this.layout(appId, app);
      const element = document.createElement("section");
      element.className = "atlas-os-window";
      element.dataset.appId = appId;
      element.style.left = `${layout.left}px`;
      element.style.top = `${layout.top}px`;
      element.style.width = `${layout.width}px`;
      element.style.height = `${layout.height}px`;
      element.style.zIndex = String(++this.z);
      element.innerHTML = `
        <header class="atlas-os-titlebar" data-window-drag>
          <div class="atlas-os-title"><span>${app.icon}</span><strong>${esc(app.title)}</strong><small>${esc(app.subtitle || "")}</small></div>
          <div class="atlas-os-window-controls">
            <button data-window-action="minimize" aria-label="Minimize">—</button>
            <button data-window-action="maximize" aria-label="Maximize">□</button>
            <button class="close" data-window-action="close" aria-label="Close">×</button>
          </div>
        </header>
        <div class="atlas-os-window-body" data-app-body="${appId}"></div>
        <div class="atlas-os-resizer" data-window-resize></div>
      `;
      this.layer.appendChild(element);

      const task = document.createElement("button");
      task.type = "button";
      task.className = "atlas-os-running-app";
      task.dataset.runningApp = appId;
      task.innerHTML = `<span>${app.icon}</span><span>${esc(app.shortTitle || app.title)}</span>`;
      this.taskArea.appendChild(task);

      const record = { appId, element, task, minimized: false, maximized: false, restoreRect: null };
      this.records.set(appId, record);
      this.os.processManager.registerApp(appId);

      element.addEventListener("pointerdown", () => this.focus(appId));
      $("[data-window-drag]", element).addEventListener("pointerdown", (event) => {
        if (!event.target.closest("[data-window-action]")) this.startDrag(event, appId);
      });
      $("[data-window-resize]", element).addEventListener("pointerdown", (event) => this.startResize(event, appId));
      $$("[data-window-action]", element).forEach((button) => button.addEventListener("click", (event) => {
        event.stopPropagation();
        if (button.dataset.windowAction === "minimize") this.minimize(appId);
        if (button.dataset.windowAction === "maximize") this.toggleMaximize(appId);
        if (button.dataset.windowAction === "close") this.close(appId);
      }));
      task.addEventListener("click", () => {
        const current = this.records.get(appId);
        if (!current) return;
        if (current.minimized) {
          current.minimized = false;
          current.element.classList.remove("is-minimized");
          this.focus(appId);
        } else if (this.isFocused(appId)) this.minimize(appId);
        else this.focus(appId);
      });

      if (layout.maximized) this.maximize(appId);
      else this.focus(appId);
      this.os.renderApp(appId);
      return element;
    }

    close(appId) {
      const record = this.records.get(appId);
      if (!record) return false;
      this.save(appId);
      record.element.remove();
      record.task.remove();
      this.records.delete(appId);
      this.os.processManager.unregisterApp(appId);
      return true;
    }

    focus(appId) {
      const record = this.records.get(appId);
      if (!record) return;
      record.element.style.zIndex = String(++this.z);
      this.records.forEach((x, id) => {
        x.element.classList.toggle("is-focused", id === appId);
        x.task.classList.toggle("is-active", id === appId);
      });
    }

    minimize(appId) {
      const record = this.records.get(appId);
      if (!record) return;
      record.minimized = true;
      record.element.classList.add("is-minimized");
      record.task.classList.remove("is-active");
    }

    maximize(appId) {
      const record = this.records.get(appId);
      if (!record || record.maximized) return;
      const rect = record.element.getBoundingClientRect();
      record.restoreRect = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
      record.maximized = true;
      record.element.classList.add("is-maximized");
      record.element.style.left = "6px";
      record.element.style.top = "6px";
      record.element.style.width = "calc(100% - 12px)";
      record.element.style.height = "calc(100% - 12px)";
      this.focus(appId);
    }

    restore(appId) {
      const record = this.records.get(appId);
      if (!record || !record.maximized) return;
      const rect = record.restoreRect || this.layout(appId, this.os.apps.get(appId));
      record.maximized = false;
      record.element.classList.remove("is-maximized");
      record.element.style.left = `${rect.left}px`;
      record.element.style.top = `${rect.top}px`;
      record.element.style.width = `${rect.width}px`;
      record.element.style.height = `${rect.height}px`;
      this.focus(appId);
    }

    toggleMaximize(appId) {
      const record = this.records.get(appId);
      if (!record) return;
      if (record.maximized) this.restore(appId);
      else this.maximize(appId);
    }

    startDrag(event, appId) {
      const record = this.records.get(appId);
      if (!record || record.maximized) return;
      event.preventDefault();
      const rect = record.element.getBoundingClientRect();
      this.drag = { appId, x: event.clientX, y: event.clientY, left: rect.left, top: rect.top };
      this.focus(appId);
    }

    startResize(event, appId) {
      const record = this.records.get(appId);
      if (!record || record.maximized) return;
      event.preventDefault();
      event.stopPropagation();
      const rect = record.element.getBoundingClientRect();
      this.resize = { appId, x: event.clientX, y: event.clientY, width: rect.width, height: rect.height };
      this.focus(appId);
    }

    pointerMove(event) {
      if (this.drag) {
        const record = this.records.get(this.drag.appId);
        if (record) {
          record.element.style.left = `${clamp(this.drag.left + event.clientX - this.drag.x, 0, Math.max(0, window.innerWidth - 280))}px`;
          record.element.style.top = `${clamp(this.drag.top + event.clientY - this.drag.y, 0, Math.max(0, window.innerHeight - 90))}px`;
        }
      }
      if (this.resize) {
        const record = this.records.get(this.resize.appId);
        if (record) {
          record.element.style.width = `${clamp(this.resize.width + event.clientX - this.resize.x, 360, Math.max(380, window.innerWidth - 10))}px`;
          record.element.style.height = `${clamp(this.resize.height + event.clientY - this.resize.y, 260, Math.max(280, window.innerHeight - 60))}px`;
        }
      }
    }

    pointerUp() {
      if (this.drag) this.save(this.drag.appId);
      if (this.resize) this.save(this.resize.appId);
      this.drag = null;
      this.resize = null;
    }

    body(appId) {
      const record = this.records.get(appId);
      return record ? $(`[data-app-body="${appId}"]`, record.element) : null;
    }

    isFocused(appId) {
      return this.records.get(appId)?.element.classList.contains("is-focused") || false;
    }

    isMinimized(appId) {
      return this.records.get(appId)?.minimized || false;
    }
  }

  class Terminal {
    constructor(os) {
      this.os = os;
      this.cwd = "/home/analyst";
      this.history = [];
      this.historyIndex = 0;
      this.lines = [
        { text: "ATLAS OS Terminal v3.0", kind: "system" },
        { text: 'Type "help" for commands. All commands are constrained to the browser simulation.', kind: "muted" }
      ];
    }

    prompt() {
      const display = this.cwd === "/home/analyst" ? "~" : this.cwd.startsWith("/home/analyst/") ? `~${this.cwd.slice(13)}` : this.cwd;
      return `analyst@atlas-ws-01:${display}$`;
    }

    print(text, kind = "normal") {
      this.lines.push({ text: String(text ?? ""), kind });
      if (this.lines.length > 800) this.lines.splice(0, this.lines.length - 800);
      this.os.refreshTerminal();
    }

    tokenize(raw) {
      return raw.match(/"[^"]*"|'[^']*'|\S+/g)?.map((x) => x.replace(/^["']|["']$/g, "")) || [];
    }

    async execute(raw) {
      const commandLine = String(raw || "").trim();
      if (!commandLine) return;
      this.history.push(commandLine);
      this.history = this.history.slice(-200);
      this.historyIndex = this.history.length;
      this.print(`${this.prompt()} ${commandLine}`, "command");
      const args = this.tokenize(commandLine);
      const command = (args.shift() || "").toLowerCase();
      const e = this.os.engine;
      const vfs = this.os.vfs;

      try {
        if (command === "help") return this.print([
          "ATLAS OS shell commands",
          "-----------------------",
          "help | clear | history | whoami | hostname | date | uptime",
          "pwd | ls [path] | cd <path> | cat <file>",
          "write <file> <text> | touch <file> | mkdir <dir> | rm <path>",
          "uname -a | neofetch | ps | top | kill <pid> | free | df",
          "ip addr | ss | netstat | ping <session-id>",
          "journalctl [security] | apps | open <app-id>",
          "atlasctl status | start | stop | restart",
          "atlasctl connect [count] | sessions | load <profile> | workers <n> | drain",
          "atlasctl ddos [count] | beacon <session> | block <ip> | unblock <ip> | firewall",
          "atlasctl services | service start|stop|restart <name>",
          "atlasctl incidents | incident close|contain|assign <id>",
          "atlasctl snapshot [label] | restore <id> | fault clear | export"
        ].join("\n"));
        if (command === "clear") { this.lines.length = 0; return this.os.refreshTerminal(); }
        if (command === "history") return this.print(this.history.map((x, i) => `${String(i + 1).padStart(3)}  ${x}`).join("\n"));
        if (command === "whoami") return this.print("analyst");
        if (command === "hostname") return this.print("atlas-ws-01");
        if (command === "date") return this.print(new Date().toString());
        if (command === "uptime") return this.print(e.state.startedAt ? `up ${duration(now() - e.state.startedAt)}, ${e.state.sessions.filter((s) => s.state === "connected").length} sessions` : "ATLAS service offline");
        if (command === "pwd") return this.print(this.cwd);
        if (command === "ls") {
          const path = normalizePath(args[0] || this.cwd, this.cwd);
          const node = vfs.stat(path);
          if (!node) return this.print(`ls: ${path}: No such file or directory`, "error");
          if (node.type === "file") return this.print(baseName(path));
          return this.print(vfs.list(path).map((x) => `${x.type === "dir" ? "d" : "-"}${x.readonly ? "r-xr-xr-x" : "rw-rw-r--"}  ${x.name}${x.type === "dir" ? "/" : ""}`).join("\n"));
        }
        if (command === "cd") {
          const path = normalizePath(args[0] || "/home/analyst", this.cwd);
          const node = vfs.stat(path);
          if (!node || node.type !== "dir") return this.print(`cd: ${path}: Not a directory`, "error");
          this.cwd = path;
          return;
        }
        if (command === "cat") return args[0] ? this.print(vfs.read(normalizePath(args[0], this.cwd))) : this.print("cat: missing operand", "error");
        if (command === "write") {
          if (!args[0]) return this.print("write: missing file", "error");
          const path = normalizePath(args[0], this.cwd);
          vfs.write(path, args.slice(1).join(" "));
          this.os.refreshIfOpen("files");
          return this.print(`wrote ${path}`);
        }
        if (command === "touch") {
          if (!args[0]) return this.print("touch: missing file", "error");
          const path = normalizePath(args[0], this.cwd);
          vfs.write(path, vfs.exists(path) ? vfs.read(path) : "");
          return this.os.refreshIfOpen("files");
        }
        if (command === "mkdir") {
          if (!args[0]) return this.print("mkdir: missing operand", "error");
          vfs.mkdir(normalizePath(args[0], this.cwd));
          return this.os.refreshIfOpen("files");
        }
        if (command === "rm") {
          if (!args[0]) return this.print("rm: missing operand", "error");
          vfs.remove(normalizePath(args[0], this.cwd));
          return this.os.refreshIfOpen("files");
        }
        if (command === "uname") return this.print("ATLAS-OS atlas-ws-01 3.0.0-browser #1 SMP SIM x86_64 JavaScript");
        if (command === "neofetch") return this.print([
          "      ╭────────────╮",
          "  ╭───╯  ATLAS OS  ╰───╮",
          "  ╰────────────────────╯",
          "analyst@atlas-ws-01",
          "--------------------",
          `OS: ATLAS OS ${VERSION}`,
          `Engine: ATLAS Enterprise ${window.ATLAS.version}`,
          "Kernel: browser state machine",
          `Uptime: ${e.state.startedAt ? duration(now() - e.state.startedAt) : "offline"}`,
          `Processes: ${this.os.processManager.list().length}`,
          `Sessions: ${e.state.sessions.filter((s) => s.state === "connected").length}`,
          `Workers: ${e.workers.length}`,
          `CPU: ${Number(e.state.cpu).toFixed(1)}%`,
          `Memory: ${Number(e.state.memory).toFixed(1)}%`,
          `Health: ${Number(e.state.health).toFixed(1)}% ${e.state.healthLabel}`
        ].join("\n"));
        if (command === "ps") return this.print([" PID  USER       S  CPU%  MEM(MB) COMMAND", ...this.os.processManager.list().map((p) => `${String(p.pid).padStart(4)}  ${p.user.padEnd(10)} ${p.state}  ${p.cpu.toFixed(1).padStart(4)}  ${p.memory.toFixed(1).padStart(7)} ${p.name}`)].join("\n"));
        if (command === "kill") {
          const result = this.os.processManager.kill(Number(args[0]));
          this.os.refreshIfOpen("tasks");
          return this.print(result.message, result.ok ? "normal" : "error");
        }
        if (command === "top") {
          const procs = this.os.processManager.list().sort((a, b) => b.cpu - a.cpu).slice(0, 12);
          return this.print([`top - ${shortTime()}  CPU ${Number(e.state.cpu).toFixed(1)}% MEM ${Number(e.state.memory).toFixed(1)}%`, `Tasks ${this.os.processManager.list().length}  Queue ${e.state.jobs.length}  Sessions ${e.state.sessions.filter((s) => s.state === "connected").length}`, "", " PID USER       CPU% MEM COMMAND", ...procs.map((p) => `${String(p.pid).padStart(4)} ${p.user.padEnd(10)} ${p.cpu.toFixed(1).padStart(4)} ${String(Math.round(p.memory)).padStart(3)}M ${p.name}`)].join("\n"));
        }
        if (command === "free") {
          const total = 8192, used = Math.round(total * clamp(e.state.memory, 0, 100) / 100), free = total - used;
          return this.print(`              total       used       free\nMem:       ${String(total).padStart(8)}   ${String(used).padStart(8)}   ${String(free).padStart(8)}\nSwap:          2048          0       2048`);
        }
        if (command === "df") return this.print("Filesystem       Size Used Avail Use% Mounted on\natlasfs           8G 2.3G 5.7G 29% /\natlas-home        2G 412M 1.6G 21% /home\ntmpfs             1G  16M 1008M 2% /tmp");
        if (command === "ip" && args[0] === "addr") return this.print("1: lo <LOOPBACK,UP> mtu 65536\n    inet 127.0.0.1/8\n2: atlas0 <BROADCAST,MULTICAST,UP> mtu 1500\n    link/ether 02:41:54:4c:41:53\n    inet 10.20.0.10/24\n    note: simulated interface; no real host networking");
        if (command === "ss" || command === "netstat") return this.print(["State   Local Address        Peer Address", "LISTEN  127.0.0.1:60000      0.0.0.0:*", ...e.state.sessions.filter((s) => s.state === "connected").map((s) => `ESTAB   127.0.0.1:60000      ${s.ip}:${s.port}`)].join("\n"));
        if (command === "ping") {
          const id = Number(args[0]);
          const rtt = e.ping(id);
          return this.print(rtt === false || rtt == null ? `session ${id} unavailable` : `64 bytes from session-${id}: time=${rtt} ms`, rtt === false || rtt == null ? "error" : "normal");
        }
        if (command === "journalctl") {
          const security = args[0] === "security";
          return this.print(e.logs.items.filter((x) => !security || ["SECURITY", "ERROR", "WARN"].includes(x.level)).slice(-80).map((x) => `${dateTime(x.ts)} ${x.component}[atlas]: ${x.level} ${x.message}`).join("\n"));
        }
        if (command === "apps") return this.print([...this.os.apps.values()].map((x) => `${x.id.padEnd(12)} ${x.title}`).join("\n"));
        if (command === "open") {
          if (!this.os.apps.has(args[0])) return this.print(`open: app '${args[0]}' not found`, "error");
          this.os.openApp(args[0]);
          return;
        }
        if (command === "atlasctl") return this.atlasctl(args);
        return this.print(`${command}: command not found`, "error");
      } catch (error) {
        this.print(error.message || String(error), "error");
      }
    }

    async atlasctl(args) {
      const e = this.os.engine;
      const sub = (args.shift() || "status").toLowerCase();
      if (sub === "status") return this.print(`phase=${e.state.phase}\nhealth=${Number(e.state.health).toFixed(1)} ${e.state.healthLabel}\ncpu=${Number(e.state.cpu).toFixed(1)}%\nmemory=${Number(e.state.memory).toFixed(1)}%\nsessions=${e.state.sessions.filter((s) => s.state === "connected").length}/64\nworkers=${e.workers.length}\nqueue=${e.state.jobs.length}/600\npps=${e.state.pps}\nincidents=${e.state.incidents.filter((i) => i.status !== "closed").length}`);
      if (sub === "start") return e.boot();
      if (sub === "stop") return e.shutdown(false);
      if (sub === "restart") return e.restart();
      if (sub === "connect") {
        const count = clamp(Number(args[0] || 1), 1, 20);
        for (let i = 0; i < count; i += 1) await e.connect();
        return this.print(`connected ${count} session request(s)`);
      }
      if (sub === "sessions") return this.print(e.state.sessions.filter((s) => s.state === "connected").map((s) => `${s.id}\t${s.ip}:${s.port}\t${s.username}/${s.role}\trtt=${s.rtt}ms\trisk=${s.risk}`).join("\n") || "No connected sessions.");
      if (sub === "load") { e.generateLoad((args[0] || "moderate").toLowerCase()); return this.print(`load generated: ${args[0] || "moderate"}`); }
      if (sub === "workers") { if (!args[0]) return this.print(`workers=${e.workers.length}`); e.resizeWorkers(Number(args[0])); return this.print(`workers=${e.workers.length}`); }
      if (sub === "drain") { e.drainQueue(); return this.print("queue drained"); }
      if (sub === "ddos") { const count = clamp(Number(args[0] || 360), 20, 1000); e.synFlood("203.0.113.77", count); return this.print(`generated ${count}-packet SYN-flood scenario`); }
      if (sub === "beacon") { e.beacon(Number(args[0])); return this.print(`beacon scenario session=${args[0]}`); }
      if (sub === "block") { e.block(args[0], "ATLAS OS terminal block", 60); return this.print(`blocked ${args[0]}`); }
      if (sub === "unblock") { e.unblock(args[0]); return this.print(`unblocked ${args[0]}`); }
      if (sub === "firewall") return this.print(e.firewall.map((r) => `${r.id}\t${r.enabled ? "ON" : "OFF"}\t${r.protocol}\t${r.source}\tport=${r.port}\t${r.action}`).join("\n"));
      if (sub === "services") return this.print([...e.services.values()].map((s) => `${s.name}\t${s.state}\tcpu=${Number(s.cpu).toFixed(1)}%\tmem=${s.memory}MB`).join("\n"));
      if (sub === "service") {
        const action = args[0], name = args[1];
        if (action === "start") e.startService(name);
        else if (action === "stop") e.stopService(name);
        else if (action === "restart") e.restartService(name);
        else return this.print("usage: atlasctl service start|stop|restart <name>", "error");
        return this.print(`service ${name}: ${action}`);
      }
      if (sub === "incidents") return this.print(e.state.incidents.map((i) => `${i.id}\t${i.severity}\t${i.status}\t${i.owner}\t${i.title}`).join("\n") || "No incidents.");
      if (sub === "incident") {
        const action = args[0], id = args[1];
        if (action === "close") e.setIncidentStatus(id, "closed", "Closed from terminal.");
        else if (action === "contain") e.setIncidentStatus(id, "contained", "Contained from terminal.");
        else if (action === "assign") e.assignIncident(id, "SOC Analyst");
        else return this.print("usage: atlasctl incident close|contain|assign <id>", "error");
        return this.print(`${id}: ${action}`);
      }
      if (sub === "snapshot") { const snap = e.captureSnapshot(args.join(" ") || "ATLAS OS snapshot"); return this.print(`snapshot=${snap?.id || "created"}`); }
      if (sub === "restore") return this.print(e.restoreSnapshot(args[0]) ? `restored ${args[0]}` : "snapshot not found", e.restoreSnapshot ? "normal" : "error");
      if (sub === "fault" && args[0] === "clear") { e.clearFaults(); return this.print("faults cleared"); }
      if (sub === "export") { download(`atlas-os-state-${Date.now()}.json`, JSON.stringify(e.exportState(), null, 2)); return this.print("state export generated"); }
      return this.print(`unknown atlasctl subcommand: ${sub}`, "error");
    }
  }

  class AtlasOS {
    constructor(atlas) {
      this.atlas = atlas;
      this.engine = atlas.engine;
      this.root = document.querySelector(ROOT);
      this.shell = null;
      this.started = false;
      this.loggedIn = false;
      this.settings = {
        accent: "cyan",
        wallpaper: "grid",
        transparency: true,
        animations: true,
        showSeconds: true,
        autoBoot: true,
        notifications: true,
        ...loadLocal(SETTINGS_KEY, {})
      };
      this.apps = new Map();
      this.windows = new WindowManager(this);
      this.processManager = new ProcessManager(this);
      this.vfs = new VirtualFS(this);
      this.terminal = new Terminal(this);
      this.notifications = [];
      this.selectedSession = null;
      this.selectedIncident = null;
      this.packetProtocol = "ALL";
      this.packetFilter = "";
      this.eventFilter = "ALL";
      this.eventSearch = "";
      this.filePath = "/home/analyst";
      this.fileSelected = null;
      this.fileEditing = null;
      this.registerApps();
      this.buildLaunchButton();
      this.bindEngine();
    }

    registerApps() {
      const data = [
        ["server", "Server Manager", "Server", "▣", "Operations", "Lifecycle, sessions, workers and queue", "atlas-server-manager", 72, 1020, 650],
        ["network", "Network Center", "Network", "⌁", "Network", "Interfaces, sessions and flows", "atlas-network-center", 62, 1040, 650],
        ["packets", "Packet Analyzer", "Packets", "≋", "Security", "Synthetic PCAP and flow correlation", "atlas-packet-analyzer", 94, 1180, 700],
        ["firewall", "Firewall", "Firewall", "⬢", "Security", "Policy, rate limiting and containment", "atlas-firewall-console", 56, 1050, 650],
        ["soc", "SOC Center", "SOC", "◉", "Security", "Detection, incidents and response", "atlas-soc-center", 110, 1140, 700],
        ["identity", "Identity & Access", "Identity", "♙", "Security", "RBAC, lockouts and auth logs", "atlas-identity-manager", 52, 960, 610],
        ["services", "Service Manager", "Services", "⚙", "Operations", "Runtime dependencies and controls", "atlas-service-manager", 54, 960, 620],
        ["dns", "DNS Manager", "DNS", "◎", "Network", "Records, cache and resolver state", "atlas-dns-manager", 48, 900, 570],
        ["pki", "TLS / PKI", "TLS", "◇", "Security", "Certificate and handshake state", "atlas-pki-manager", 46, 860, 560],
        ["monitor", "System Monitor", "Monitor", "⌁", "System", "Performance and health history", "atlas-system-monitor", 68, 1020, 650],
        ["tasks", "Task Manager", "Tasks", "▤", "System", "Processes, apps and services", "atlas-task-manager", 52, 970, 620],
        ["events", "Event Viewer", "Events", "☷", "Security", "Server, security and audit telemetry", "atlas-event-viewer", 76, 1080, 650],
        ["files", "File Explorer", "Files", "▰", "System", "Virtual filesystem and analyst workspace", "atlas-file-explorer", 70, 1020, 650],
        ["terminal", "Terminal", "Terminal", ">_", "System", "Simulated shell and atlasctl", "atlas-terminal", 60, 1020, 640],
        ["recovery", "Recovery Center", "Recovery", "↶", "Operations", "Snapshots, rollback and export", "atlas-recovery-center", 46, 920, 600],
        ["settings", "Settings", "Settings", "⚙", "System", "Desktop and behavior preferences", "atlas-settings", 38, 820, 570],
        ["about", "About ATLAS OS", "About", "ⓘ", "System", "Architecture and safety boundary", "atlas-about", 28, 780, 570]
      ];
      data.forEach(([id, title, shortTitle, icon, category, subtitle, process, memory, width, height]) => this.apps.set(id, { id, title, shortTitle, icon, category, subtitle, process, memory, width, height }));
    }

    buildLaunchButton() {
      const target = $(".nsl-section-header", this.root) || this.root;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "atlas-os-launch";
      button.innerHTML = `<span class="atlas-os-launch-mark">A</span><span><strong>Launch ATLAS OS</strong><small>Open the full network operations workstation</small></span>`;
      button.addEventListener("click", () => this.launch());
      target.prepend(button);
    }

    buildShell() {
      if (this.shell) return;
      this.shell = document.createElement("section");
      this.shell.id = "atlas-os";
      this.shell.className = "atlas-os-shell is-hidden";
      this.shell.innerHTML = `
        <div class="atlas-os-boot" data-screen="boot">
          <div class="atlas-os-boot-brand"><div class="atlas-os-logo">A</div><div><strong>ATLAS OS</strong><span>Advanced Telemetry, Logging, Analysis &amp; Security</span></div></div>
          <div class="atlas-os-boot-progress"><div class="atlas-os-boot-bar"><span id="atlas-boot-fill"></span></div><div id="atlas-boot-status">Preparing workstation...</div></div>
          <small class="atlas-os-build">v${VERSION} · build ${BUILD} · browser simulation</small>
        </div>
        <div class="atlas-os-login is-hidden" data-screen="login">
          <div class="atlas-os-login-clock"><strong id="atlas-login-time">${shortTime()}</strong><span id="atlas-login-date">${dateLabel()}</span></div>
          <div class="atlas-os-login-card"><div class="atlas-os-avatar">AL</div><h2>Analyst Workstation</h2><p>ATLAS\\analyst</p><button id="atlas-signin">Sign in</button><label><input id="atlas-autoboot" type="checkbox" ${this.settings.autoBoot ? "checked" : ""}> Start ATLAS-NET-01 services during sign-in</label></div>
          <button class="atlas-os-return" data-os-exit>Return to portfolio</button>
        </div>
        <div class="atlas-os-desktop is-hidden" data-screen="desktop">
          <div class="atlas-os-wallpaper"></div>
          <div class="atlas-os-desktop-icons" id="atlas-desktop-icons"></div>
          <div class="atlas-os-window-layer" id="atlas-window-layer"></div>
          <aside class="atlas-os-start-menu" id="atlas-start-menu"><div class="atlas-os-start-head"><div class="atlas-os-start-brand"><div>A</div><span><strong>ATLAS OS</strong><small>analyst@atlas-ws-01</small></span></div><input id="atlas-start-search" placeholder="Search applications..."></div><div class="atlas-os-start-apps" id="atlas-start-apps"></div><footer><button data-start="settings">⚙ Settings</button><button data-start="lock">◈ Lock</button><button data-start="exit">↩ Portfolio</button></footer></aside>
          <aside class="atlas-os-notify-center" id="atlas-notify-center"><header><span><strong>Notifications</strong><small>Security and system events</small></span><button id="atlas-notify-clear">Clear</button></header><div id="atlas-notify-list"></div></aside>
          <aside class="atlas-os-quick" id="atlas-quick"><header><strong>Quick Controls</strong><small>Workstation state</small></header><div class="atlas-os-quick-grid"><button data-quick="server"><span>▣</span><strong>Server</strong><small id="atlas-quick-server">offline</small></button><button data-quick="firewall"><span>⬢</span><strong>Firewall</strong><small>default deny</small></button><button data-quick="packets"><span>≋</span><strong>Packets</strong><small id="atlas-quick-pps">0 pps</small></button><button data-quick="soc"><span>◉</span><strong>Incidents</strong><small id="atlas-quick-incidents">0 open</small></button></div><div class="atlas-os-quick-health"><div><span>Health</span><strong id="atlas-quick-health">0%</strong></div><div class="atlas-os-meter"><span id="atlas-quick-health-bar"></span></div></div></aside>
          <div class="atlas-os-toast-layer" id="atlas-toast-layer"></div>
          <footer class="atlas-os-taskbar"><button class="atlas-os-start-button" id="atlas-start-button"><span>A</span></button><button class="atlas-os-pinned" data-pinned="server">▣</button><button class="atlas-os-pinned" data-pinned="soc">◉</button><button class="atlas-os-pinned" data-pinned="terminal">&gt;_</button><button class="atlas-os-pinned" data-pinned="files">▰</button><div class="atlas-os-task-running" id="atlas-task-running"></div><div class="atlas-os-tray"><button id="atlas-tray-health" class="atlas-os-health"><span></span><em id="atlas-health-text">OFFLINE</em></button><button id="atlas-quick-button">⌃</button><button id="atlas-notify-button">♢<b id="atlas-notify-badge" class="is-hidden">0</b></button><button id="atlas-clock"><strong id="atlas-clock-time">${shortTime()}</strong><small id="atlas-clock-date">${dateLabel()}</small></button></div></footer>
        </div>`;
      document.body.appendChild(this.shell);
      this.windows.mount($("#atlas-window-layer", this.shell), $("#atlas-task-running", this.shell));
      this.renderDesktopIcons();
      this.renderStartApps();
      this.bindShell();
      this.applySettings();
      this.updateTaskbar();
      this.startClock();
    }

    bindShell() {
      $("#atlas-signin", this.shell).addEventListener("click", () => this.signIn());
      $$("[data-os-exit]", this.shell).forEach((b) => b.addEventListener("click", () => this.exit()));
      $("#atlas-start-button", this.shell).addEventListener("click", (event) => { event.stopPropagation(); this.togglePanel("start"); });
      $("#atlas-notify-button", this.shell).addEventListener("click", (event) => { event.stopPropagation(); this.togglePanel("notify"); });
      $("#atlas-quick-button", this.shell).addEventListener("click", (event) => { event.stopPropagation(); this.togglePanel("quick"); });
      $("#atlas-clock", this.shell).addEventListener("click", (event) => { event.stopPropagation(); this.togglePanel("notify"); });
      $("#atlas-start-search", this.shell).addEventListener("input", (event) => this.renderStartApps(event.target.value));
      $("#atlas-notify-clear", this.shell).addEventListener("click", () => { this.notifications.length = 0; this.renderNotifications(); });
      $$("[data-pinned]", this.shell).forEach((b) => b.addEventListener("click", () => this.openApp(b.dataset.pinned)));
      $("[data-start='settings']", this.shell).addEventListener("click", () => { this.closePanels(); this.openApp("settings"); });
      $("[data-start='lock']", this.shell).addEventListener("click", () => this.lock());
      $("[data-start='exit']", this.shell).addEventListener("click", () => this.exit());
      $$("[data-quick]", this.shell).forEach((b) => b.addEventListener("click", async () => {
        if (b.dataset.quick === "server") {
          if (this.engine.state.phase === "offline") await this.engine.boot();
          else await this.engine.shutdown(false);
        } else this.openApp(b.dataset.quick);
        this.closePanels();
      }));
      document.addEventListener("pointerdown", (event) => {
        if (!this.started || !this.loggedIn) return;
        if (!event.target.closest("#atlas-start-menu") && !event.target.closest("#atlas-start-button")) $("#atlas-start-menu", this.shell).classList.remove("is-open");
        if (!event.target.closest("#atlas-notify-center") && !event.target.closest("#atlas-notify-button") && !event.target.closest("#atlas-clock")) $("#atlas-notify-center", this.shell).classList.remove("is-open");
        if (!event.target.closest("#atlas-quick") && !event.target.closest("#atlas-quick-button")) $("#atlas-quick", this.shell).classList.remove("is-open");
      });
      document.addEventListener("keydown", (event) => {
        if (!this.started || !this.loggedIn) return;
        if (event.key === "Escape") this.closePanels();
        if (event.ctrlKey && event.altKey && event.key.toLowerCase() === "t") { event.preventDefault(); this.openApp("terminal"); }
        if (event.ctrlKey && event.shiftKey && event.key === "Escape") { event.preventDefault(); this.openApp("tasks"); }
      });
    }

    bindEngine() {
      const refresh = ["render", "server", "sessions", "workers", "queue", "packets", "flows", "firewall", "tls", "dns", "auth", "services", "incidents", "faults", "audit", "snapshots", "metrics", "tick"];
      refresh.forEach((name) => this.engine.bus.on(name, () => {
        if (!this.started) return;
        this.updateTaskbar();
        const map = {
          server: ["server", "monitor", "tasks"], sessions: ["server", "network", "packets", "soc", "monitor", "files"], workers: ["server", "monitor", "tasks"], queue: ["server", "monitor"], packets: ["network", "packets", "monitor", "files"], flows: ["network", "packets", "files"], firewall: ["firewall", "soc", "files"], tls: ["pki", "server"], dns: ["dns"], auth: ["identity", "soc", "files"], services: ["services", "server", "tasks"], incidents: ["soc", "monitor", "files"], faults: ["soc", "monitor"], audit: ["events", "recovery", "files"], snapshots: ["recovery", "files"], metrics: ["monitor", "server"], tick: ["monitor", "server", "network", "tasks"], render: [...this.windows.records.keys()]
        };
        (map[name] || []).forEach((id) => this.refreshIfOpen(id));
      }));
      this.engine.bus.on("log", (entry) => {
        if (!this.started) return;
        this.refreshIfOpen("events");
        if (this.settings.notifications && ["SECURITY", "ERROR"].includes(entry.level)) this.notify(`${entry.level}: ${entry.component}`, entry.message, entry.level === "ERROR" ? "danger" : "warning", "events");
      });
    }

    renderDesktopIcons() {
      const container = $("#atlas-desktop-icons", this.shell);
      const ids = ["server", "network", "soc", "packets", "terminal", "files", "monitor", "recovery"];
      container.innerHTML = ids.map((id) => { const app = this.apps.get(id); return `<button data-desktop-app="${id}"><span>${app.icon}</span><strong>${esc(app.shortTitle)}</strong></button>`; }).join("");
      $$("[data-desktop-app]", container).forEach((b) => { b.addEventListener("dblclick", () => this.openApp(b.dataset.desktopApp)); b.addEventListener("click", () => { $$("[data-desktop-app]", container).forEach((x) => x.classList.remove("selected")); b.classList.add("selected"); }); });
    }

    renderStartApps(search = "") {
      const container = $("#atlas-start-apps", this.shell);
      const query = search.trim().toLowerCase();
      container.innerHTML = ["Operations", "Network", "Security", "System"].map((category) => {
        const apps = [...this.apps.values()].filter((app) => app.category === category && (!query || `${app.title} ${app.subtitle} ${app.id}`.toLowerCase().includes(query)));
        if (!apps.length) return "";
        return `<section><h4>${category}</h4><div>${apps.map((app) => `<button data-start-app="${app.id}"><span>${app.icon}</span><em><strong>${esc(app.title)}</strong><small>${esc(app.subtitle)}</small></em></button>`).join("")}</div></section>`;
      }).join("") || `<p class="atlas-os-empty">No matching applications.</p>`;
      $$("[data-start-app]", container).forEach((b) => b.addEventListener("click", () => { this.closePanels(); this.openApp(b.dataset.startApp); }));
    }

    async launch() {
      this.buildShell();
      this.shell.classList.remove("is-hidden");
      if (this.loggedIn) return this.showScreen("desktop");
      this.started = true;
      this.showScreen("boot");
      const steps = [["Initializing workstation", 10], ["Mounting virtual filesystem", 24], ["Starting event bus", 35], ["Starting window manager", 48], ["Registering network applications", 62], ["Loading security controls", 75], ["Loading recovery subsystem", 88], ["Verifying browser-only boundary", 96], ["Workstation ready", 100]];
      for (const [label, progress] of steps) {
        $("#atlas-boot-status", this.shell).textContent = label;
        $("#atlas-boot-fill", this.shell).style.width = `${progress}%`;
        if (this.settings.animations) await new Promise((resolve) => setTimeout(resolve, 80));
      }
      this.showScreen("login");
    }

    async signIn() {
      this.settings.autoBoot = $("#atlas-autoboot", this.shell).checked;
      this.saveSettings();
      const button = $("#atlas-signin", this.shell);
      button.disabled = true;
      button.textContent = "Signing in...";
      if (this.settings.autoBoot && this.engine.state.phase === "offline") await this.engine.boot();
      this.loggedIn = true;
      this.showScreen("desktop");
      button.disabled = false;
      button.textContent = "Sign in";
      this.notify("ATLAS OS ready", "Analyst workstation initialized.", "success");
      setTimeout(() => this.openApp("server"), this.settings.animations ? 120 : 0);
    }

    lock() { this.loggedIn = false; this.closePanels(); this.showScreen("login"); }
    exit() { this.closePanels(); this.shell?.classList.add("is-hidden"); }
    showScreen(name) { $$("[data-screen]", this.shell).forEach((x) => x.classList.toggle("is-hidden", x.dataset.screen !== name)); }
    openApp(id) { this.closePanels(); return this.windows.open(id); }
    refreshIfOpen(id) { if (this.windows.records.has(id)) this.renderApp(id); }
    closePanels() { ["#atlas-start-menu", "#atlas-notify-center", "#atlas-quick"].forEach((q) => $(q, this.shell)?.classList.remove("is-open")); }

    togglePanel(name) {
      const map = { start: "#atlas-start-menu", notify: "#atlas-notify-center", quick: "#atlas-quick" };
      const target = $(map[name], this.shell);
      ["#atlas-start-menu", "#atlas-notify-center", "#atlas-quick"].forEach((q) => { const node = $(q, this.shell); if (node !== target) node.classList.remove("is-open"); });
      target.classList.toggle("is-open");
      if (name === "notify") this.renderNotifications();
      if (name === "start" && target.classList.contains("is-open")) $("#atlas-start-search", this.shell).focus();
    }

    notify(title, message, severity = "info", appId = null) {
      const item = { id: `${now()}-${Math.random()}`, ts: now(), title, message, severity, appId, read: false };
      this.notifications.unshift(item);
      this.notifications = this.notifications.slice(0, 80);
      if (this.settings.notifications && this.shell) {
        const toast = document.createElement("button");
        toast.className = `atlas-os-toast ${severity}`;
        toast.innerHTML = `<span>${severity === "danger" ? "!" : severity === "warning" ? "⚠" : severity === "success" ? "✓" : "i"}</span><em><strong>${esc(title)}</strong><small>${esc(message)}</small></em>`;
        toast.addEventListener("click", () => { if (appId) this.openApp(appId); toast.remove(); });
        $("#atlas-toast-layer", this.shell).appendChild(toast);
        setTimeout(() => toast.remove(), 5500);
      }
      this.renderNotifications();
      return item;
    }

    renderNotifications() {
      if (!this.shell) return;
      const list = $("#atlas-notify-list", this.shell);
      const badge = $("#atlas-notify-badge", this.shell);
      const unread = this.notifications.filter((x) => !x.read).length;
      badge.textContent = unread;
      badge.classList.toggle("is-hidden", unread === 0);
      list.innerHTML = this.notifications.map((x) => `<button data-notification="${x.id}" class="${x.severity}"><span>${x.severity === "danger" ? "!" : x.severity === "warning" ? "⚠" : x.severity === "success" ? "✓" : "i"}</span><em><strong>${esc(x.title)}</strong><small>${esc(x.message)}</small><time>${time(x.ts)}</time></em></button>`).join("") || `<p class="atlas-os-empty">No notifications.</p>`;
      $$("[data-notification]", list).forEach((b) => b.addEventListener("click", () => { const item = this.notifications.find((x) => x.id === b.dataset.notification); if (!item) return; item.read = true; if (item.appId) this.openApp(item.appId); this.renderNotifications(); }));
    }

    startClock() {
      const tick = () => {
        if (!this.shell) return;
        const display = this.settings.showSeconds ? time() : shortTime();
        [["#atlas-clock-time", display], ["#atlas-clock-date", dateLabel()], ["#atlas-login-time", display], ["#atlas-login-date", dateLabel()]].forEach(([q, value]) => { const node = $(q, this.shell); if (node) node.textContent = value; });
      };
      tick();
      setInterval(tick, 1000);
    }

    applySettings() {
      if (!this.shell) return;
      this.shell.dataset.accent = this.settings.accent;
      this.shell.dataset.wallpaper = this.settings.wallpaper;
      this.shell.classList.toggle("no-transparency", !this.settings.transparency);
      this.shell.classList.toggle("no-animations", !this.settings.animations);
    }

    saveSettings() { saveLocal(SETTINGS_KEY, this.settings); this.applySettings(); }

    updateTaskbar() {
      if (!this.shell) return;
      const e = this.engine;
      const health = $("#atlas-tray-health", this.shell);
      $("#atlas-health-text", this.shell).textContent = e.state.phase === "online" ? `${e.state.healthLabel} ${Number(e.state.health).toFixed(0)}%` : "OFFLINE";
      health.dataset.state = e.state.phase !== "online" ? "offline" : e.state.health < 50 ? "critical" : e.state.health < 80 ? "warning" : "healthy";
      $("#atlas-quick-server", this.shell).textContent = e.state.phase;
      $("#atlas-quick-pps", this.shell).textContent = `${e.state.pps} pps`;
      $("#atlas-quick-incidents", this.shell).textContent = `${e.state.incidents.filter((i) => i.status !== "closed").length} open`;
      $("#atlas-quick-health", this.shell).textContent = `${Number(e.state.health).toFixed(0)}%`;
      $("#atlas-quick-health-bar", this.shell).style.width = `${clamp(e.state.health, 0, 100)}%`;
    }

    metric(label, value, detail = "") { return `<div class="atlas-os-metric"><span>${esc(label)}</span><strong>${esc(value)}</strong>${detail ? `<small>${esc(detail)}</small>` : ""}</div>`; }
    pill(value, state = "neutral") { return `<span class="atlas-os-pill ${state}">${esc(value)}</span>`; }
    card(title, subtitle, content) { return `<section class="atlas-os-card"><header><span>${esc(subtitle)}</span><h3>${esc(title)}</h3></header>${content}</section>`; }

    renderApp(id) {
      const body = this.windows.body(id);
      if (!body) return;
      const renderers = { server: () => this.renderServer(), network: () => this.renderNetwork(), packets: () => this.renderPackets(), firewall: () => this.renderFirewall(), soc: () => this.renderSoc(), identity: () => this.renderIdentity(), services: () => this.renderServices(), dns: () => this.renderDns(), pki: () => this.renderPki(), monitor: () => this.renderMonitor(), tasks: () => this.renderTasks(), events: () => this.renderEvents(), files: () => this.renderFiles(), terminal: () => this.renderTerminal(), recovery: () => this.renderRecovery(), settings: () => this.renderSettings(), about: () => this.renderAbout() };
      body.innerHTML = renderers[id]?.() || "";
      this.bindApp(id, body);
      if (id === "monitor") this.drawCharts();
      if (id === "terminal") this.refreshTerminal();
    }

    renderServer() {
      const e = this.engine;
      const sessions = e.state.sessions;
      const connected = sessions.filter((s) => s.state === "connected");
      const uptime = e.state.startedAt ? duration(now() - e.state.startedAt) : "00:00:00";
      return `<div class="atlas-os-app">
        <div class="atlas-os-toolbar"><button class="primary" data-server="boot" ${e.state.phase !== "offline" ? "disabled" : ""}>Start Server</button><button data-server="restart" ${e.state.phase === "offline" ? "disabled" : ""}>Restart</button><button class="danger" data-server="shutdown" ${e.state.phase === "offline" ? "disabled" : ""}>Shutdown</button><i></i><button data-server="connect">Add Client</button><button data-server="connect5">Add 5</button><button data-server="load">Heavy Load</button><button data-server="snapshot">Snapshot</button></div>
        <div class="atlas-os-metrics cols-4">${this.metric("Server", e.state.phase.toUpperCase(), `Uptime ${uptime}`)}${this.metric("Health", `${Number(e.state.health).toFixed(0)}%`, e.state.healthLabel)}${this.metric("Sessions", `${connected.length}/64`, `${e.state.accepts} accepted`)}${this.metric("Queue", `${e.state.jobs.length}/600`, `${e.workers.length} workers`)}${this.metric("CPU", `${Number(e.state.cpu).toFixed(1)}%`)}${this.metric("Memory", `${Number(e.state.memory).toFixed(1)}%`)}${this.metric("Network", `${e.state.pps} pps`, `${e.state.dropped} dropped`)}${this.metric("Messages", String(e.state.messages), `${bytes(e.state.bytesIn)} in`)}</div>
        <div class="atlas-os-split wide-left">${this.card("Session Table", "Clients and transport state", `<div class="atlas-os-table-wrap"><table class="atlas-os-table"><thead><tr><th>ID</th><th>Endpoint</th><th>Identity</th><th>State</th><th>TLS</th><th>RTT</th><th>Traffic</th><th>Risk</th></tr></thead><tbody>${sessions.map((s) => `<tr data-server-session="${s.id}" class="${this.selectedSession === s.id ? "selected" : ""}"><td>${s.id}</td><td>${esc(s.ip)}:${s.port}</td><td>${esc(s.username)}/${esc(s.role)}</td><td>${this.pill(s.state, s.state === "connected" ? "good" : s.state === "closed" ? "bad" : "warn")}</td><td>${s.tls?.protocol || "--"}</td><td>${s.rtt || 0} ms</td><td>${bytes((s.rx || 0) + (s.tx || 0))}</td><td>${s.risk}</td></tr>`).join("") || `<tr><td colspan="8">No session history.</td></tr>`}</tbody></table></div>`)}
        ${this.card("Worker Pool", "Simulated execution threads", `<div class="atlas-os-worker-list">${e.workers.map((w) => `<div><span><strong>${esc(w.id)}</strong><small>${w.completed} done · ${w.failed} failed</small></span><div class="atlas-os-meter"><span style="width:${clamp(w.utilization, 0, 100)}%"></span></div><em>${Number(w.utilization).toFixed(0)}%</em></div>`).join("")}</div><div class="atlas-os-actions"><button data-server="worker-minus">− Worker</button><button data-server="worker-plus">+ Worker</button><button data-server="drain">Drain Queue</button></div>`)}</div>
      </div>`;
    }

    renderNetwork() {
      const e = this.engine;
      const sessions = e.state.sessions;
      const selected = sessions.find((s) => s.id === this.selectedSession) || sessions.find((s) => s.state === "connected");
      if (selected) this.selectedSession = selected.id;
      return `<div class="atlas-os-app">
        <div class="atlas-os-toolbar"><button data-network="connect">New Session</button><button data-network="ping" ${selected ? "" : "disabled"}>Ping</button><button data-network="isolate" ${selected ? "" : "disabled"}>Isolate</button><button data-network="release" ${selected ? "" : "disabled"}>Release</button><button class="danger" data-network="disconnect" ${selected ? "" : "disabled"}>Disconnect</button><i></i><button data-open="packets">Packet Analyzer</button><button data-open="firewall">Firewall</button></div>
        <div class="atlas-os-metrics cols-4">${this.metric("Interface", "atlas0", "10.20.0.10/24")}${this.metric("State", "UP", "MTU 1500")}${this.metric("Listener", "127.0.0.1:60000", "TCP / TLS 1.3")}${this.metric("Packet Rate", `${e.state.pps} pps`, `${e.state.dropped} dropped`)}</div>
        <div class="atlas-os-split wide-left">${this.card("Sessions", "Connection state", `<div class="atlas-os-table-wrap"><table class="atlas-os-table"><thead><tr><th>ID</th><th>Remote</th><th>User</th><th>State</th><th>RTT</th><th>Loss</th><th>Risk</th></tr></thead><tbody>${sessions.map((s) => `<tr data-network-session="${s.id}" class="${selected?.id === s.id ? "selected" : ""}"><td>${s.id}</td><td>${esc(s.ip)}:${s.port}</td><td>${esc(s.username)}</td><td>${s.state}</td><td>${s.rtt || 0} ms</td><td>${Number(s.loss || 0).toFixed(1)}%</td><td>${s.risk}</td></tr>`).join("") || `<tr><td colspan="7">No sessions.</td></tr>`}</tbody></table></div>`)}
        ${this.card("Connection Inspector", "Selected client", selected ? `<dl class="atlas-os-dl"><dt>Session</dt><dd>${selected.id}</dd><dt>Remote</dt><dd>${esc(selected.ip)}:${selected.port}</dd><dt>Identity</dt><dd>${esc(selected.username)} / ${esc(selected.role)}</dd><dt>State</dt><dd>${selected.state}</dd><dt>TLS</dt><dd>${selected.tls ? `${selected.tls.protocol} · ${selected.tls.cipher}` : "--"}</dd><dt>RTT</dt><dd>${selected.rtt || 0} ms</dd><dt>RX</dt><dd>${bytes(selected.rx || 0)}</dd><dt>TX</dt><dd>${bytes(selected.tx || 0)}</dd><dt>Risk</dt><dd>${selected.risk}/100</dd><dt>Isolation</dt><dd>${selected.isolated ? "Contained" : "Normal"}</dd></dl><div class="atlas-os-input-action"><input id="atlas-network-message" placeholder="ServerMessage payload"><button data-network="send">Send</button></div>` : `<p class="atlas-os-empty">Select or create a session.</p>`)}</div>
        ${this.card("Stateful Flow Table", "Synthetic network telemetry", `<div class="atlas-os-table-wrap compact"><table class="atlas-os-table"><thead><tr><th>Flow</th><th>Source</th><th>Destination</th><th>Proto</th><th>Packets</th><th>Bytes</th><th>Risk</th><th>Action</th></tr></thead><tbody>${e.state.flows.slice(0, 120).map((f) => `<tr><td>${f.id}</td><td>${esc(f.source)}:${f.sport}</td><td>${esc(f.destination)}:${f.dport}</td><td>${f.protocol}</td><td>${f.packets}</td><td>${bytes(f.bytes)}</td><td>${f.risk}</td><td>${f.action}</td></tr>`).join("") || `<tr><td colspan="8">No flows.</td></tr>`}</tbody></table></div>`)}</div>`;
    }

    renderPackets() {
      const e = this.engine;
      const query = this.packetFilter.trim().toLowerCase();
      const packets = e.state.packets.filter((p) => (this.packetProtocol === "ALL" || p.protocol === this.packetProtocol) && (!query || `${p.source} ${p.destination} ${p.flags} ${p.note} ${p.action} ${p.sessionId || ""}`.toLowerCase().includes(query))).slice(-600).reverse();
      return `<div class="atlas-os-app"><div class="atlas-os-toolbar"><select id="atlas-packet-protocol">${["ALL", "TCP", "TLS", "ICMP", "DNS", "HTTP/2"].map((x) => `<option ${x === this.packetProtocol ? "selected" : ""}>${x}</option>`).join("")}</select><input id="atlas-packet-filter" class="grow" value="${esc(this.packetFilter)}" placeholder="Filter source, destination, flags, action, note..."><button data-packet="clear">Clear Buffer</button><button class="danger" data-packet="ddos">Generate SYN Flood</button></div>
      <div class="atlas-os-metrics cols-5">${this.metric("Captured", String(e.state.packets.length))}${this.metric("Flows", String(e.state.flows.length))}${this.metric("Packet Rate", `${e.state.pps} pps`)}${this.metric("Dropped", String(e.state.dropped))}${this.metric("Matches", String(packets.length))}</div>
      ${this.card("Packet Capture", "Synthetic PCAP telemetry", `<div class="atlas-os-table-wrap tall"><table class="atlas-os-table"><thead><tr><th>#</th><th>Time</th><th>Dir</th><th>Source</th><th>Destination</th><th>Proto</th><th>Flags</th><th>Len</th><th>Action</th><th>Session</th><th>Info</th></tr></thead><tbody>${packets.map((p) => `<tr><td>${p.id}</td><td>${time(p.ts)}</td><td>${p.direction}</td><td>${esc(p.source)}:${p.sport}</td><td>${esc(p.destination)}:${p.dport}</td><td>${p.protocol}</td><td>${esc(p.flags)}</td><td>${p.length}</td><td>${this.pill(p.action, p.action === "allow" ? "good" : "bad")}</td><td>${p.sessionId || "--"}</td><td>${esc(p.note)}</td></tr>`).join("") || `<tr><td colspan="11">No matching packet records.</td></tr>`}</tbody></table></div>`)}<p class="atlas-os-note">Packet capture is generated entirely by the ATLAS simulation engine; no real browser or host packets are read.</p></div>`;
    }

    renderFirewall() {
      const e = this.engine;
      const blocks = [...e.dynamicBlocks.values()];
      return `<div class="atlas-os-app"><div class="atlas-os-metrics cols-4">${this.metric("Policy", "DEFAULT DENY")}${this.metric("Rules", String(e.firewall.length), `${e.firewall.filter((r) => r.enabled).length} enabled`)}${this.metric("Blocks", String(blocks.length))}${this.metric("Dropped", String(e.state.dropped))}</div>
      <div class="atlas-os-split wide-left">${this.card("Firewall Policy", "Ordered rule evaluation", `<div class="atlas-os-table-wrap"><table class="atlas-os-table"><thead><tr><th>Rule</th><th>On</th><th>Priority</th><th>Proto</th><th>Source</th><th>Port</th><th>Action</th><th>Reason</th><th></th></tr></thead><tbody>${e.firewall.map((r) => `<tr><td>${r.id}</td><td><button class="atlas-os-toggle ${r.enabled ? "on" : ""}" data-fw-toggle="${r.id}"></button></td><td>${r.priority}</td><td>${r.protocol}</td><td>${esc(r.source)}</td><td>${r.port}</td><td>${this.pill(r.action, r.action === "allow" ? "good" : r.action === "deny" ? "bad" : "warn")}</td><td>${esc(r.reason)}</td><td><button data-fw-remove="${r.id}">×</button></td></tr>`).join("")}</tbody></table></div>`)}
      ${this.card("Add Rule", "Analyst policy", `<label class="atlas-os-field"><span>Source</span><input id="atlas-fw-source" value="203.0.113.0/24"></label><label class="atlas-os-field"><span>Protocol</span><select id="atlas-fw-protocol"><option>tcp</option><option>udp</option><option>*</option></select></label><label class="atlas-os-field"><span>Port</span><input id="atlas-fw-port" value="60000"></label><label class="atlas-os-field"><span>Action</span><select id="atlas-fw-action"><option>deny</option><option>allow</option><option>rate-limit</option></select></label><label class="atlas-os-field"><span>Reason</span><input id="atlas-fw-reason" value="SOC analyst rule"></label><button class="atlas-os-wide primary" data-fw="add">Add Rule</button>`)}</div>
      ${this.card("Dynamic Containment", "Temporary source blocks", `<div class="atlas-os-table-wrap compact"><table class="atlas-os-table"><thead><tr><th>Source</th><th>Reason</th><th>Expires</th><th></th></tr></thead><tbody>${blocks.map((b) => `<tr><td>${esc(b.source)}</td><td>${esc(b.reason)}</td><td>${dateTime(b.expiresAt)}</td><td><button data-fw-unblock="${esc(b.source)}">Unblock</button></td></tr>`).join("") || `<tr><td colspan="4">No dynamic blocks.</td></tr>`}</tbody></table></div>`)}</div>`;
    }

    renderSoc() {
      const e = this.engine;
      const incidents = e.state.incidents;
      const selected = incidents.find((i) => i.id === this.selectedIncident) || incidents[0] || null;
      if (selected) this.selectedIncident = selected.id;
      const open = incidents.filter((i) => i.status !== "closed");
      const risky = e.state.sessions.filter((s) => s.risk >= 25).sort((a, b) => b.risk - a.risk).slice(0, 10);
      return `<div class="atlas-os-app"><div class="atlas-os-toolbar"><button class="danger" data-soc-scenario="ddos">SYN Flood</button><button data-soc-scenario="auth">Auth Attack</button><button data-soc-scenario="beacon">Beacon</button><button data-soc-scenario="queue">Queue Saturation</button><button data-soc-scenario="tls">TLS Failure</button><button data-soc-scenario="dns">DNS Outage</button><i></i><button data-soc="clear">Clear Faults</button></div>
      <div class="atlas-os-metrics cols-5">${this.metric("Open Incidents", String(open.length), `${open.filter((i) => ["high", "critical"].includes(i.severity)).length} high/critical`)}${this.metric("Security Logs", String(e.logs.items.filter((x) => x.level === "SECURITY").length))}${this.metric("Risk Sessions", String(risky.length))}${this.metric("Blocks", String(e.dynamicBlocks.size))}${this.metric("Dropped", String(e.state.dropped))}</div>
      <div class="atlas-os-split even">${this.card("Incident Queue", "Case management", `<div class="atlas-os-incidents">${incidents.map((i) => `<button data-soc-incident="${i.id}" class="${selected?.id === i.id ? "selected" : ""}"><span class="${i.severity}">${i.severity.toUpperCase()}</span><em><strong>${i.id} · ${esc(i.title)}</strong><small>${esc(i.summary)}</small><time>${i.status} · ${i.owner} · ${time(i.createdAt)}</time></em></button>`).join("") || `<p class="atlas-os-empty">No incidents. Launch a scenario.</p>`}</div>`)}
      ${this.card("Incident Workbench", "Selected case", selected ? `<dl class="atlas-os-dl"><dt>Incident</dt><dd>${selected.id}</dd><dt>Type</dt><dd>${esc(selected.type)}</dd><dt>Severity</dt><dd>${selected.severity}</dd><dt>Status</dt><dd>${selected.status}</dd><dt>Owner</dt><dd>${selected.owner}</dd><dt>Evidence</dt><dd>${selected.evidence.map(esc).join(", ") || "--"}</dd><dt>Created</dt><dd>${dateTime(selected.createdAt)}</dd></dl><div class="atlas-os-actions"><button data-soc="assign">Assign</button><button data-soc="contain">Contain</button><button data-soc="resolve">Resolve</button><button class="primary" data-soc="close">Close</button></div><div class="atlas-os-timeline">${selected.timeline.map((x) => `<div><time>${time(x.ts)}</time><strong>${esc(x.action)}</strong><span>${esc(x.note)}</span></div>`).join("")}</div>` : `<p class="atlas-os-empty">Select an incident.</p>`)}</div>
      <div class="atlas-os-split even">${this.card("High-Risk Sessions", "Behavioral prioritization", `<div class="atlas-os-table-wrap compact"><table class="atlas-os-table"><thead><tr><th>Session</th><th>Endpoint</th><th>User</th><th>Risk</th><th>Isolated</th></tr></thead><tbody>${risky.map((s) => `<tr><td>${s.id}</td><td>${esc(s.ip)}:${s.port}</td><td>${esc(s.username)}</td><td>${s.risk}</td><td>${s.isolated ? "Yes" : "No"}</td></tr>`).join("") || `<tr><td colspan="5">No elevated-risk sessions.</td></tr>`}</tbody></table></div>`)}
      ${this.card("Latest Security Telemetry", "Event stream", `<div class="atlas-os-log-preview">${e.logs.items.filter((x) => ["SECURITY", "ERROR", "WARN"].includes(x.level)).slice(-16).reverse().map((x) => `<div class="${x.level.toLowerCase()}"><time>${time(x.ts)}</time><strong>${x.level}</strong><span>${esc(x.component)}</span><p>${esc(x.message)}</p></div>`).join("") || `<p class="atlas-os-empty">No security telemetry.</p>`}</div>`)}</div></div>`;
    }

    renderIdentity() {
      const e = this.engine;
      const users = [...e.users.values()];
      const auth = e.authLog.latest(120).slice().reverse();
      return `<div class="atlas-os-app"><div class="atlas-os-metrics cols-4">${this.metric("Accounts", String(users.length), `${users.filter((u) => u.enabled).length} enabled`)}${this.metric("Locked", String(users.filter((u) => u.lockedUntil > now()).length))}${this.metric("Auth Events", String(e.authLog.items.length))}${this.metric("Failures", String(auth.filter((x) => !x.success).length))}</div>
      ${this.card("Identity Directory", "Role-based access simulation", `<div class="atlas-os-table-wrap"><table class="atlas-os-table"><thead><tr><th>User</th><th>Role</th><th>Enabled</th><th>Failures</th><th>Locked</th><th>Logins</th><th>Last Login</th><th>Actions</th></tr></thead><tbody>${users.map((u) => `<tr><td>${esc(u.username)}</td><td>${esc(u.role)}</td><td>${u.enabled ? "Yes" : "No"}</td><td>${u.failures}</td><td>${u.lockedUntil > now() ? "Yes" : "No"}</td><td>${u.logins}</td><td>${u.lastLogin ? dateTime(u.lastLogin) : "--"}</td><td><button data-id-unlock="${u.username}">Unlock</button><button data-id-toggle="${u.username}">${u.enabled ? "Disable" : "Enable"}</button><button data-id-fail="${u.username}">Fail ×6</button></td></tr>`).join("")}</tbody></table></div>`)}
      ${this.card("Authentication Log", "Security telemetry", `<div class="atlas-os-table-wrap compact"><table class="atlas-os-table"><thead><tr><th>Time</th><th>User</th><th>Source</th><th>Result</th><th>Reason</th></tr></thead><tbody>${auth.map((x) => `<tr><td>${time(x.ts)}</td><td>${esc(x.username)}</td><td>${esc(x.source)}</td><td>${this.pill(x.success ? "SUCCESS" : "FAIL", x.success ? "good" : "bad")}</td><td>${esc(x.reason)}</td></tr>`).join("") || `<tr><td colspan="5">No authentication events.</td></tr>`}</tbody></table></div>`)}</div>`;
    }

    renderServices() {
      const services = [...this.engine.services.values()];
      return `<div class="atlas-os-app"><div class="atlas-os-toolbar"><button data-services="start-all">Start All</button><button data-services="restart-running">Restart Running</button><button class="danger" data-services="stop-all">Stop All</button></div><div class="atlas-os-service-grid">${services.map((s) => `<section><header><span><small>${s.critical ? "CRITICAL" : "SUPPORT"}</small><strong>${esc(s.display)}</strong></span>${this.pill(s.state, s.state === "running" ? "good" : s.state === "degraded" ? "warn" : "bad")}</header><dl class="atlas-os-dl"><dt>Name</dt><dd>${s.name}</dd><dt>CPU</dt><dd>${Number(s.cpu).toFixed(1)}%</dd><dt>Memory</dt><dd>${s.memory} MB</dd><dt>Restarts</dt><dd>${s.restarts}</dd><dt>Dependencies</dt><dd>${s.dependencies.join(", ") || "None"}</dd></dl><div class="atlas-os-actions"><button data-service-start="${s.name}">Start</button><button data-service-restart="${s.name}">Restart</button><button class="danger" data-service-stop="${s.name}">Stop</button></div></section>`).join("")}</div></div>`;
    }

    renderDns() {
      const e = this.engine;
      return `<div class="atlas-os-app"><div class="atlas-os-split even">${this.card("DNS Records", "Local service discovery", `<div class="atlas-os-table-wrap"><table class="atlas-os-table"><thead><tr><th>Name</th><th>Address</th></tr></thead><tbody>${[...e.dns.entries()].map(([name, address]) => `<tr><td>${esc(name)}</td><td>${esc(address)}</td></tr>`).join("")}</tbody></table></div>`)}${this.card("Resolver", "Interactive query", `<label class="atlas-os-field"><span>Hostname</span><input id="atlas-dns-query" value="telemetry.atlas.local"></label><div class="atlas-os-actions"><button class="primary" data-dns="resolve">Resolve</button><button data-dns="flush">Flush Cache</button><button class="danger" data-dns="fault">Toggle Outage</button></div><div class="atlas-os-result" id="atlas-dns-result">Query a hostname to view resolver output.</div>`)}</div>
      ${this.card("Resolver Cache", "TTL state", `<div class="atlas-os-table-wrap compact"><table class="atlas-os-table"><thead><tr><th>Name</th><th>Address</th><th>TTL</th></tr></thead><tbody>${[...e.dnsCache.entries()].map(([name, x]) => `<tr><td>${esc(name)}</td><td>${esc(x.address)}</td><td>${Math.max(0, Math.ceil((x.expiresAt - now()) / 1000))}s</td></tr>`).join("") || `<tr><td colspan="3">Cache empty.</td></tr>`}</tbody></table></div>`)}</div>`;
    }

    renderPki() {
      const e = this.engine, c = e.certificate, days = Math.floor((c.expiresAt - now()) / 86400000);
      return `<div class="atlas-os-app"><div class="atlas-os-split even">${this.card("Server Certificate", "ATLAS Lab Root CA", `<dl class="atlas-os-dl certificate"><dt>Subject</dt><dd>${esc(c.subject)}</dd><dt>Issuer</dt><dd>${esc(c.issuer)}</dd><dt>Serial</dt><dd>${esc(c.serial)}</dd><dt>Fingerprint</dt><dd class="mono">${esc(c.fingerprint)}</dd><dt>Issued</dt><dd>${dateTime(c.issuedAt)}</dd><dt>Expires</dt><dd>${dateTime(c.expiresAt)}</dd><dt>Remaining</dt><dd>${days} days</dd><dt>Status</dt><dd>${this.pill(e.certificateValid() ? "VALID" : "EXPIRED", e.certificateValid() ? "good" : "bad")}</dd></dl><div class="atlas-os-actions"><button class="primary" data-pki="rotate">Rotate</button><button class="danger" data-pki="expire">Force Expiry</button></div>`)}${this.card("TLS Runtime", "Handshake telemetry", `<div class="atlas-os-metrics cols-2 nested">${this.metric("Protocol", "TLS 1.3")}${this.metric("Cipher", "AES-256-GCM")}${this.metric("Successful", String(e.tlsStats.ok))}${this.metric("Failed", String(e.tlsStats.failed))}${this.metric("Rotations", String(e.tlsStats.rotations))}${this.metric("TLS Fault", e.state.faults.tls ? "ACTIVE" : "NONE")}</div><p class="atlas-os-note">TLS is modeled in memory; no real browser certificate store is modified.</p>`)}</div></div>`;
    }

    renderMonitor() {
      const e = this.engine;
      return `<div class="atlas-os-app"><div class="atlas-os-metrics cols-6">${this.metric("Health", `${Number(e.state.health).toFixed(0)}%`, e.state.healthLabel)}${this.metric("CPU", `${Number(e.state.cpu).toFixed(1)}%`)}${this.metric("Memory", `${Number(e.state.memory).toFixed(1)}%`)}${this.metric("Queue", String(e.state.jobs.length))}${this.metric("Packet Rate", `${e.state.pps} pps`)}${this.metric("Incidents", String(e.state.incidents.filter((i) => i.status !== "closed").length))}</div><div class="atlas-os-chart-grid">${this.card("System Health", "Last 120 samples", `<canvas id="atlas-chart-health" width="720" height="210"></canvas>`)}${this.card("CPU & Memory", "Resource utilization", `<canvas id="atlas-chart-resource" width="720" height="210"></canvas>`)}${this.card("Queue & Sessions", "Workload", `<canvas id="atlas-chart-work" width="720" height="210"></canvas>`)}${this.card("Packet Rate", "Network telemetry", `<canvas id="atlas-chart-network" width="720" height="210"></canvas>`)}</div></div>`;
    }

    renderTasks() {
      const processes = this.processManager.list();
      return `<div class="atlas-os-app"><div class="atlas-os-metrics cols-4">${this.metric("Processes", String(processes.length))}${this.metric("Running", String(processes.filter((p) => p.state === "R").length))}${this.metric("CPU", `${Number(this.engine.state.cpu).toFixed(1)}%`)}${this.metric("Memory", `${Number(this.engine.state.memory).toFixed(1)}%`)}</div>${this.card("Processes", "Desktop, services and protected core", `<div class="atlas-os-table-wrap tall"><table class="atlas-os-table"><thead><tr><th>PID</th><th>PPID</th><th>User</th><th>Process</th><th>Type</th><th>State</th><th>CPU</th><th>Memory</th><th>Protection</th><th></th></tr></thead><tbody>${processes.map((p) => `<tr><td>${p.pid}</td><td>${p.ppid}</td><td>${esc(p.user)}</td><td>${esc(p.name)}</td><td>${p.kind}</td><td>${p.state}</td><td>${p.cpu.toFixed(1)}%</td><td>${p.memory.toFixed(1)} MB</td><td>${p.protected ? this.pill("PROTECTED", "warn") : this.pill("USER", "good")}</td><td><button data-task-kill="${p.pid}" ${p.protected ? "disabled" : ""}>End</button></td></tr>`).join("")}</tbody></table></div>`)}<p class="atlas-os-note">Ending an app process closes its window. Ending a non-protected service process stops that simulated service. Protected core/critical processes refuse termination.</p></div>`;
    }

    renderEvents() {
      const e = this.engine, query = this.eventSearch.trim().toLowerCase();
      const entries = e.logs.items.filter((x) => (this.eventFilter === "ALL" || x.level === this.eventFilter) && (!query || `${x.level} ${x.component} ${x.message}`.toLowerCase().includes(query))).slice(-600).reverse();
      return `<div class="atlas-os-app"><div class="atlas-os-toolbar"><select id="atlas-event-level">${["ALL", "DEBUG", "INFO", "SUCCESS", "WARN", "ERROR", "SECURITY"].map((x) => `<option ${x === this.eventFilter ? "selected" : ""}>${x}</option>`).join("")}</select><input id="atlas-event-search" class="grow" value="${esc(this.eventSearch)}" placeholder="Filter component, level or message..."><button data-event="export">Export Logs</button><button data-event="audit">Export Audit</button></div><div class="atlas-os-metrics cols-5">${this.metric("Total", String(e.logs.items.length))}${this.metric("Security", String(e.logs.items.filter((x) => x.level === "SECURITY").length))}${this.metric("Errors", String(e.logs.items.filter((x) => x.level === "ERROR").length))}${this.metric("Warnings", String(e.logs.items.filter((x) => x.level === "WARN").length))}${this.metric("Filtered", String(entries.length))}</div>${this.card("System Event Log", "Structured telemetry", `<div class="atlas-os-table-wrap tall"><table class="atlas-os-table"><thead><tr><th>Time</th><th>Level</th><th>Component</th><th>Message</th></tr></thead><tbody>${entries.map((x) => `<tr class="level-${x.level.toLowerCase()}"><td>${time(x.ts)}</td><td>${x.level}</td><td>${esc(x.component)}</td><td>${esc(x.message)}</td></tr>`).join("") || `<tr><td colspan="4">No matching events.</td></tr>`}</tbody></table></div>`)}</div>`;
    }

    renderFiles() {
      const entries = this.vfs.list(this.filePath), selected = this.fileSelected ? this.vfs.stat(this.fileSelected) : null;
      return `<div class="atlas-os-files"><div class="atlas-os-file-toolbar"><button data-file="up" ${this.filePath === "/" ? "disabled" : ""}>↑</button><button data-file="home">⌂</button><div>${esc(this.filePath)}</div><button data-file="new-file">New File</button><button data-file="new-folder">New Folder</button></div><div class="atlas-os-file-layout"><aside>${[["/home/analyst", "⌂", "Home"], ["/home/analyst/Documents", "▤", "Documents"], ["/home/analyst/Investigations", "◉", "Investigations"], ["/var/log/atlas", "☷", "Logs"], ["/etc/atlas", "⚙", "Configuration"], ["/proc/atlas", "▣", "Runtime"], ["/proc/net", "⌁", "Network"], ["/snapshots", "↶", "Snapshots"], ["/tmp", "◇", "Temporary"]].map(([path, icon, label]) => `<button data-file-nav="${path}" class="${this.filePath === path ? "selected" : ""}"><span>${icon}</span><strong>${label}</strong></button>`).join("")}</aside><main><div class="atlas-os-file-grid">${entries.map((x) => `<button data-file-item="${esc(x.path)}" data-file-type="${x.type}" class="${this.fileSelected === x.path ? "selected" : ""}"><span>${x.type === "dir" ? "▰" : x.path.endsWith(".json") ? "{ }" : x.path.includes("/log/") ? "☷" : "▤"}</span><strong>${esc(x.name)}</strong><small>${x.type === "dir" ? "Folder" : x.readonly ? "Read only" : "Writable"}</small></button>`).join("") || `<p class="atlas-os-empty">Folder empty.</p>`}</div></main><section class="atlas-os-file-preview">${selected ? `<div class="atlas-os-file-icon">${selected.type === "dir" ? "▰" : "▤"}</div><h3>${esc(baseName(selected.path))}</h3><dl class="atlas-os-dl"><dt>Type</dt><dd>${selected.type}</dd><dt>Path</dt><dd>${esc(selected.path)}</dd><dt>Access</dt><dd>${selected.readonly ? "Read only" : "Writable"}</dd></dl>${selected.type === "file" ? `<button class="atlas-os-wide primary" data-file="open-selected">Open</button>${selected.readonly ? "" : `<button class="atlas-os-wide danger" data-file="delete-selected">Delete</button>`}` : `<button class="atlas-os-wide primary" data-file="enter-selected">Open Folder</button>`}` : `<p class="atlas-os-empty">Select a file or folder.</p>`}</section></div>${this.fileEditing ? `<div class="atlas-os-editor"><header><span><strong>${esc(this.fileEditing)}</strong><small>${this.vfs.stat(this.fileEditing)?.readonly ? "Read-only generated file" : "Editable analyst file"}</small></span><span>${this.vfs.stat(this.fileEditing)?.readonly ? "" : `<button data-file="save-editor">Save</button>`}<button data-file="close-editor">Close</button></span></header><textarea id="atlas-editor-text" ${this.vfs.stat(this.fileEditing)?.readonly ? "readonly" : ""}>${esc(this.vfs.read(this.fileEditing))}</textarea></div>` : ""}</div>`;
    }

    renderTerminal() {
      return `<div class="atlas-os-terminal"><header><span>analyst@atlas-ws-01</span><button data-terminal="clear">Clear</button><button data-terminal="help">Help</button></header><div id="atlas-terminal-output"></div><form id="atlas-terminal-form"><span id="atlas-terminal-prompt">${esc(this.terminal.prompt())}</span><input id="atlas-terminal-input" autocomplete="off" spellcheck="false"></form></div>`;
    }

    refreshTerminal() {
      const body = this.windows.body("terminal");
      if (!body) return;
      const output = $("#atlas-terminal-output", body), prompt = $("#atlas-terminal-prompt", body);
      if (!output || !prompt) return;
      output.innerHTML = this.terminal.lines.map((x) => `<div class="${x.kind}">${esc(x.text).replaceAll("\n", "<br>")}</div>`).join("");
      prompt.textContent = this.terminal.prompt();
      output.scrollTop = output.scrollHeight;
    }

    renderRecovery() {
      const e = this.engine;
      return `<div class="atlas-os-app"><div class="atlas-os-toolbar"><button class="primary" data-recovery="snapshot">Create Recovery Point</button><button data-recovery="export">Export State</button><button data-recovery="audit">Export Audit</button></div><div class="atlas-os-metrics cols-4">${this.metric("Snapshots", String(e.state.snapshots.length))}${this.metric("Audit Entries", String(e.state.audit.length))}${this.metric("Health", `${Number(e.state.health).toFixed(0)}%`, e.state.healthLabel)}${this.metric("Server", e.state.phase.toUpperCase())}</div>${this.card("Recovery Points", "State capture and rollback", `<div class="atlas-os-table-wrap"><table class="atlas-os-table"><thead><tr><th>ID</th><th>Label</th><th>Created</th><th>State</th><th>Sessions</th><th>Incidents</th><th></th></tr></thead><tbody>${e.state.snapshots.map((s) => `<tr><td>${s.id}</td><td>${esc(s.label)}</td><td>${dateTime(s.createdAt)}</td><td>${s.state.phase}</td><td>${s.state.sessions.filter((x) => x.state === "connected").length}</td><td>${s.state.incidents.length}</td><td><button class="warning" data-restore="${s.id}">Restore</button></td></tr>`).join("") || `<tr><td colspan="7">No recovery points.</td></tr>`}</tbody></table></div>`)}<p class="atlas-os-note warning">Restore rewinds only the simulated ATLAS state. It cannot alter the visitor computer, browser files, GitHub repository or website source.</p></div>`;
    }

    settingToggle(name, title, detail) {
      return `<div class="atlas-os-setting"><span><strong>${esc(title)}</strong><small>${esc(detail)}</small></span><button class="atlas-os-toggle ${this.settings[name] ? "on" : ""}" data-setting="${name}"></button></div>`;
    }

    renderSettings() {
      return `<div class="atlas-os-app"><div class="atlas-os-settings">${this.card("Appearance", "Desktop personalization", `<label class="atlas-os-field"><span>Accent</span><select id="atlas-setting-accent">${["cyan", "green", "blue", "purple", "amber"].map((x) => `<option value="${x}" ${this.settings.accent === x ? "selected" : ""}>${x}</option>`).join("")}</select></label><label class="atlas-os-field"><span>Wallpaper</span><select id="atlas-setting-wallpaper">${["grid", "mesh", "midnight", "topology", "minimal"].map((x) => `<option value="${x}" ${this.settings.wallpaper === x ? "selected" : ""}>${x}</option>`).join("")}</select></label>`)}${this.card("Behavior", "Workstation options", `${this.settingToggle("transparency", "Window transparency", "Blurred translucent surfaces")}${this.settingToggle("animations", "Animations", "Boot and panel transitions")}${this.settingToggle("showSeconds", "Clock seconds", "Show seconds on taskbar")}${this.settingToggle("autoBoot", "Auto-start server", "Start ATLAS services on sign-in")}${this.settingToggle("notifications", "Security notifications", "Show security and error toasts")}`)}${this.card("Local Browser Data", "Desktop persistence", `<p class="atlas-os-paragraph">Settings, writable virtual files and window positions are stored in browser localStorage. The server engine remains page-memory state until exported.</p><div class="atlas-os-actions"><button data-settings="layout">Reset Layout</button><button data-settings="files">Reset User Files</button><button class="danger" data-settings="all">Reset Settings</button></div>`)}</div></div>`;
    }

    renderAbout() {
      return `<div class="atlas-os-app atlas-os-about"><div class="atlas-os-about-hero"><div>A</div><span><small>ATLAS OS</small><h2>Network Operations &amp; Security Workstation</h2><p>Version ${VERSION} · build ${BUILD}</p></span></div><div class="atlas-os-metrics cols-3">${this.metric("Desktop Apps", String(this.apps.size), "stateful tools")}${this.metric("Engine", `v${this.atlas.version}`, "ATLAS Enterprise")}${this.metric("Hosting", "STATIC", "GitHub Pages safe")}</div>${this.card("Architecture", "What is actually operating", `<ul class="atlas-os-features"><li><strong>Window/process model:</strong> draggable, resizable, minimizable and maximizable app windows register simulated PIDs.</li><li><strong>Shared engine:</strong> operations and security apps control the same server/session/packet/firewall/identity/service/incident state.</li><li><strong>Virtual filesystem:</strong> generated /proc, /var/log and /etc plus writable /home/analyst and /tmp.</li><li><strong>Terminal:</strong> Linux-style commands and atlasctl are constrained to the simulation.</li><li><strong>Recovery:</strong> state snapshots can rewind the ATLAS backend.</li><li><strong>SOC correlation:</strong> scenarios create packets, logs, blocks, risk and incidents across multiple apps.</li></ul>`)}${this.card("Safety Boundary", "Static browser architecture", `<div class="atlas-os-safety"><div><strong>No real sockets</strong><span>Packets and flows are JavaScript objects.</span></div><div><strong>No host shell</strong><span>No PowerShell, CMD, Bash or system binaries.</span></div><div><strong>No host filesystem</strong><span>File Explorer uses an isolated virtual filesystem.</span></div><div><strong>No real credentials</strong><span>Accounts are fictional simulation state.</span></div><div><strong>No backend required</strong><span>HTML, CSS and JavaScript only.</span></div><div><strong>No website write path</strong><span>Cannot alter GitHub or deployment source.</span></div></div>`)}</div>`;
    }

    bindApp(id, body) {
      if (id === "server") this.bindServer(body);
      if (id === "network") this.bindNetwork(body);
      if (id === "packets") this.bindPackets(body);
      if (id === "firewall") this.bindFirewall(body);
      if (id === "soc") this.bindSoc(body);
      if (id === "identity") this.bindIdentity(body);
      if (id === "services") this.bindServices(body);
      if (id === "dns") this.bindDns(body);
      if (id === "pki") this.bindPki(body);
      if (id === "tasks") this.bindTasks(body);
      if (id === "events") this.bindEvents(body);
      if (id === "files") this.bindFiles(body);
      if (id === "terminal") this.bindTerminal(body);
      if (id === "recovery") this.bindRecovery(body);
      if (id === "settings") this.bindSettings(body);
    }

    bindServer(body) {
      const on = (name, fn) => $(`[data-server="${name}"]`, body)?.addEventListener("click", fn);
      on("boot", () => this.engine.boot());
      on("restart", () => this.engine.restart());
      on("shutdown", () => this.engine.shutdown(false));
      on("connect", () => this.engine.connect());
      on("connect5", async () => { for (let i = 0; i < 5; i += 1) await this.engine.connect(); });
      on("load", () => this.engine.generateLoad("heavy"));
      on("snapshot", () => this.engine.captureSnapshot("Server Manager snapshot"));
      on("worker-minus", () => this.engine.resizeWorkers(this.engine.workers.length - 1));
      on("worker-plus", () => this.engine.resizeWorkers(this.engine.workers.length + 1));
      on("drain", () => this.engine.drainQueue());
      $$('[data-server-session]', body).forEach((row) => row.addEventListener("click", () => { this.selectedSession = Number(row.dataset.serverSession); this.renderApp("server"); }));
    }

    bindNetwork(body) {
      const selected = this.engine.state.sessions.find((s) => s.id === this.selectedSession) || this.engine.state.sessions.find((s) => s.state === "connected");
      if (selected) this.selectedSession = selected.id;
      $$('[data-network-session]', body).forEach((row) => row.addEventListener("click", () => { this.selectedSession = Number(row.dataset.networkSession); this.renderApp("network"); }));
      const on = (name, fn) => $(`[data-network="${name}"]`, body)?.addEventListener("click", fn);
      on("connect", () => this.engine.connect());
      on("ping", () => selected && this.engine.ping(selected.id));
      on("isolate", () => selected && this.engine.isolate(selected.id));
      on("release", () => selected && this.engine.release(selected.id));
      on("disconnect", () => selected && this.engine.disconnect(selected.id));
      on("send", () => { const input = $("#atlas-network-message", body); if (selected && input?.value.trim()) { this.engine.send(selected.id, input.value.trim()); input.value = ""; } });
      $$('[data-open]', body).forEach((b) => b.addEventListener("click", () => this.openApp(b.dataset.open)));
    }

    bindPackets(body) {
      $("#atlas-packet-protocol", body)?.addEventListener("change", (event) => { this.packetProtocol = event.target.value; this.renderApp("packets"); });
      $("#atlas-packet-filter", body)?.addEventListener("input", (event) => { this.packetFilter = event.target.value; });
      $("#atlas-packet-filter", body)?.addEventListener("change", () => this.renderApp("packets"));
      $('[data-packet="clear"]', body)?.addEventListener("click", () => { this.engine.state.packets.length = 0; this.engine.state.flows.length = 0; this.engine.log("INFO", "PCAP", "Packet and flow buffers cleared from ATLAS OS."); this.engine.bus.emit("packets"); this.engine.bus.emit("flows"); });
      $('[data-packet="ddos"]', body)?.addEventListener("click", () => this.engine.synFlood("203.0.113.77", 360));
    }

    bindFirewall(body) {
      $$('[data-fw-toggle]', body).forEach((b) => b.addEventListener("click", () => this.engine.toggleFirewallRule(b.dataset.fwToggle)));
      $$('[data-fw-remove]', body).forEach((b) => b.addEventListener("click", () => this.engine.removeFirewallRule(b.dataset.fwRemove)));
      $$('[data-fw-unblock]', body).forEach((b) => b.addEventListener("click", () => this.engine.unblock(b.dataset.fwUnblock)));
      $('[data-fw="add"]', body)?.addEventListener("click", () => this.engine.addFirewallRule({ source: $("#atlas-fw-source", body).value.trim() || "*", protocol: $("#atlas-fw-protocol", body).value, port: $("#atlas-fw-port", body).value.trim() === "*" ? "*" : Number($("#atlas-fw-port", body).value), action: $("#atlas-fw-action", body).value, reason: $("#atlas-fw-reason", body).value.trim() || "SOC analyst rule" }));
    }

    bindSoc(body) {
      $$('[data-soc-incident]', body).forEach((b) => b.addEventListener("click", () => { this.selectedIncident = b.dataset.socIncident; this.renderApp("soc"); }));
      $$('[data-soc-scenario]', body).forEach((b) => b.addEventListener("click", async () => {
        const s = b.dataset.socScenario;
        if (s === "ddos") this.engine.synFlood("203.0.113.77", 420);
        if (s === "auth") this.engine.simulateAuthFailures("analyst", 7, "198.51.100.23");
        if (s === "queue") this.engine.generateLoad("burst");
        if (s === "beacon") { let session = this.engine.state.sessions.find((x) => x.state === "connected"); if (!session) session = await this.engine.connect(); if (session) this.engine.beacon(session.id); }
        if (s === "tls") { this.engine.expireCertificate(); await this.engine.connect({ ip: "10.10.9.88" }); this.engine.raise("TLS_CERT_EXPIRED", "high", "TLS certificate failure", "A new session failed because the simulated certificate expired.", [this.engine.certificate.serial]); }
        if (s === "dns") { this.engine.setFault("dns", true); this.engine.resolve("telemetry.atlas.local"); this.engine.raise("DNS_OUTAGE", "high", "DNS resolver outage", "Local service discovery failed during a simulated resolver outage.", ["telemetry.atlas.local"]); }
      }));
      $('[data-soc="clear"]', body)?.addEventListener("click", () => this.engine.clearFaults());
      const incident = this.engine.incident(this.selectedIncident);
      if (incident) {
        $('[data-soc="assign"]', body)?.addEventListener("click", () => this.engine.assignIncident(incident.id, "SOC Analyst"));
        $('[data-soc="contain"]', body)?.addEventListener("click", () => this.engine.setIncidentStatus(incident.id, "contained", "Containment executed from SOC Center."));
        $('[data-soc="resolve"]', body)?.addEventListener("click", () => this.engine.setIncidentStatus(incident.id, "resolved", "Recovery validated from SOC Center."));
        $('[data-soc="close"]', body)?.addEventListener("click", () => this.engine.setIncidentStatus(incident.id, "closed", "Case closed after analyst review."));
      }
    }

    bindIdentity(body) {
      $$('[data-id-unlock]', body).forEach((b) => b.addEventListener("click", () => this.engine.unlockUser(b.dataset.idUnlock)));
      $$('[data-id-toggle]', body).forEach((b) => b.addEventListener("click", () => this.engine.toggleUser(b.dataset.idToggle)));
      $$('[data-id-fail]', body).forEach((b) => b.addEventListener("click", () => this.engine.simulateAuthFailures(b.dataset.idFail, 6, "198.51.100.23")));
    }

    bindServices(body) {
      $$('[data-service-start]', body).forEach((b) => b.addEventListener("click", () => this.engine.startService(b.dataset.serviceStart)));
      $$('[data-service-stop]', body).forEach((b) => b.addEventListener("click", () => this.engine.stopService(b.dataset.serviceStop)));
      $$('[data-service-restart]', body).forEach((b) => b.addEventListener("click", () => this.engine.restartService(b.dataset.serviceRestart)));
      $('[data-services="start-all"]', body)?.addEventListener("click", () => this.engine.startAllServices());
      $('[data-services="stop-all"]', body)?.addEventListener("click", () => this.engine.stopAllServices());
      $('[data-services="restart-running"]', body)?.addEventListener("click", () => { [...this.engine.services.values()].filter((s) => s.state === "running").forEach((s) => this.engine.restartService(s.name)); });
    }

    bindDns(body) {
      $('[data-dns="resolve"]', body)?.addEventListener("click", () => { const name = $("#atlas-dns-query", body).value.trim(); const address = this.engine.resolve(name); $("#atlas-dns-result", body).innerHTML = address ? `<strong>${esc(name)}</strong><span>${esc(address)}</span><small>NOERROR · cache populated</small>` : `<strong>${esc(name)}</strong><span>Resolution failed</span><small>NXDOMAIN or resolver outage</small>`; });
      $('[data-dns="flush"]', body)?.addEventListener("click", () => this.engine.flushDns());
      $('[data-dns="fault"]', body)?.addEventListener("click", () => this.engine.setFault("dns", !this.engine.state.faults.dns));
    }

    bindPki(body) {
      $('[data-pki="rotate"]', body)?.addEventListener("click", () => this.engine.rotateCertificate());
      $('[data-pki="expire"]', body)?.addEventListener("click", () => this.engine.expireCertificate());
    }

    bindTasks(body) {
      $$('[data-task-kill]', body).forEach((b) => b.addEventListener("click", () => { const result = this.processManager.kill(Number(b.dataset.taskKill)); this.notify(result.ok ? "Process action complete" : "Process action denied", result.message, result.ok ? "success" : "warning"); this.refreshIfOpen("tasks"); }));
    }

    bindEvents(body) {
      $("#atlas-event-level", body)?.addEventListener("change", (event) => { this.eventFilter = event.target.value; this.renderApp("events"); });
      $("#atlas-event-search", body)?.addEventListener("input", (event) => { this.eventSearch = event.target.value; });
      $("#atlas-event-search", body)?.addEventListener("change", () => this.renderApp("events"));
      $('[data-event="export"]', body)?.addEventListener("click", () => download(`atlas-events-${Date.now()}.json`, JSON.stringify(this.engine.logs.items, null, 2)));
      $('[data-event="audit"]', body)?.addEventListener("click", () => download(`atlas-audit-${Date.now()}.json`, JSON.stringify(this.engine.state.audit, null, 2)));
    }

    bindFiles(body) {
      $$('[data-file-nav]', body).forEach((b) => b.addEventListener("click", () => { this.filePath = b.dataset.fileNav; this.fileSelected = null; this.fileEditing = null; this.renderApp("files"); }));
      $$('[data-file-item]', body).forEach((b) => {
        b.addEventListener("click", () => { this.fileSelected = b.dataset.fileItem; this.renderApp("files"); });
        b.addEventListener("dblclick", () => { if (b.dataset.fileType === "dir") { this.filePath = b.dataset.fileItem; this.fileSelected = null; this.fileEditing = null; } else { this.fileSelected = b.dataset.fileItem; this.fileEditing = b.dataset.fileItem; } this.renderApp("files"); });
      });
      $('[data-file="up"]', body)?.addEventListener("click", () => { this.filePath = parentPath(this.filePath); this.fileSelected = null; this.fileEditing = null; this.renderApp("files"); });
      $('[data-file="home"]', body)?.addEventListener("click", () => { this.filePath = "/home/analyst"; this.fileSelected = null; this.fileEditing = null; this.renderApp("files"); });
      $('[data-file="open-selected"]', body)?.addEventListener("click", () => { this.fileEditing = this.fileSelected; this.renderApp("files"); });
      $('[data-file="enter-selected"]', body)?.addEventListener("click", () => { const node = this.vfs.stat(this.fileSelected); if (node?.type === "dir") { this.filePath = node.path; this.fileSelected = null; this.renderApp("files"); } });
      $('[data-file="close-editor"]', body)?.addEventListener("click", () => { this.fileEditing = null; this.renderApp("files"); });
      $('[data-file="save-editor"]', body)?.addEventListener("click", () => { this.vfs.write(this.fileEditing, $("#atlas-editor-text", body).value); this.notify("File saved", this.fileEditing, "success"); this.renderApp("files"); });
      $('[data-file="delete-selected"]', body)?.addEventListener("click", () => { try { this.vfs.remove(this.fileSelected); this.fileSelected = null; this.fileEditing = null; this.notify("File deleted", "Writable virtual file removed.", "success"); this.renderApp("files"); } catch (error) { this.notify("Delete failed", error.message, "warning"); } });
      $('[data-file="new-file"]', body)?.addEventListener("click", () => { let n = 1, path; do { path = `${this.filePath}/new-file-${n++}.txt`; } while (this.vfs.exists(path)); try { this.vfs.write(path, ""); this.fileSelected = path; this.fileEditing = path; this.renderApp("files"); } catch (error) { this.notify("New file failed", error.message, "warning"); } });
      $('[data-file="new-folder"]', body)?.addEventListener("click", () => { let n = 1, path; do { path = `${this.filePath}/New Folder ${n++}`; } while (this.vfs.exists(path)); try { this.vfs.mkdir(path); this.renderApp("files"); } catch (error) { this.notify("New folder failed", error.message, "warning"); } });
    }

    bindTerminal(body) {
      const input = $("#atlas-terminal-input", body);
      $("#atlas-terminal-form", body)?.addEventListener("submit", async (event) => { event.preventDefault(); const raw = input.value; input.value = ""; await this.terminal.execute(raw); this.refreshTerminal(); });
      input?.addEventListener("keydown", (event) => {
        if (event.key === "ArrowUp") { event.preventDefault(); this.terminal.historyIndex = clamp(this.terminal.historyIndex - 1, 0, this.terminal.history.length); input.value = this.terminal.history[this.terminal.historyIndex] || ""; }
        if (event.key === "ArrowDown") { event.preventDefault(); this.terminal.historyIndex = clamp(this.terminal.historyIndex + 1, 0, this.terminal.history.length); input.value = this.terminal.history[this.terminal.historyIndex] || ""; }
      });
      $('[data-terminal="clear"]', body)?.addEventListener("click", () => { this.terminal.lines.length = 0; this.refreshTerminal(); });
      $('[data-terminal="help"]', body)?.addEventListener("click", () => this.terminal.execute("help"));
      setTimeout(() => input?.focus(), 0);
    }

    bindRecovery(body) {
      $('[data-recovery="snapshot"]', body)?.addEventListener("click", () => { const s = this.engine.captureSnapshot(`ATLAS OS ${dateTime()}`); this.notify("Recovery point created", s?.id || "Snapshot captured", "success"); });
      $('[data-recovery="export"]', body)?.addEventListener("click", () => download(`atlas-os-export-${Date.now()}.json`, JSON.stringify(this.engine.exportState(), null, 2)));
      $('[data-recovery="audit"]', body)?.addEventListener("click", () => download(`atlas-os-audit-${Date.now()}.json`, JSON.stringify(this.engine.state.audit, null, 2)));
      $$('[data-restore]', body).forEach((b) => b.addEventListener("click", () => { const ok = this.engine.restoreSnapshot(b.dataset.restore); this.notify(ok ? "Recovery complete" : "Recovery failed", ok ? `${b.dataset.restore} restored.` : "Snapshot not found.", ok ? "success" : "danger"); }));
    }

    bindSettings(body) {
      $("#atlas-setting-accent", body)?.addEventListener("change", (event) => { this.settings.accent = event.target.value; this.saveSettings(); });
      $("#atlas-setting-wallpaper", body)?.addEventListener("change", (event) => { this.settings.wallpaper = event.target.value; this.saveSettings(); });
      $$('[data-setting]', body).forEach((b) => b.addEventListener("click", () => { this.settings[b.dataset.setting] = !this.settings[b.dataset.setting]; this.saveSettings(); this.renderApp("settings"); }));
      $('[data-settings="layout"]', body)?.addEventListener("click", () => { localStorage.removeItem(LAYOUT_KEY); this.notify("Layout reset", "New windows use default positions.", "success"); });
      $('[data-settings="files"]', body)?.addEventListener("click", () => { localStorage.removeItem(FILES_KEY); this.vfs = new VirtualFS(this); this.notify("User files reset", "Virtual analyst workspace restored.", "success"); this.refreshIfOpen("files"); });
      $('[data-settings="all"]', body)?.addEventListener("click", () => { localStorage.removeItem(SETTINGS_KEY); this.settings = { accent: "cyan", wallpaper: "grid", transparency: true, animations: true, showSeconds: true, autoBoot: true, notifications: true }; this.saveSettings(); this.renderApp("settings"); });
    }

    drawCharts() {
      const body = this.windows.body("monitor");
      if (!body) return;
      const history = this.engine.state.metrics.slice(-120);
      this.drawChart($("#atlas-chart-health", body), history, [{ key: "health", color: "#2dd4bf", max: 100 }]);
      this.drawChart($("#atlas-chart-resource", body), history, [{ key: "cpu", color: "#38bdf8", max: 100 }, { key: "memory", color: "#a78bfa", max: 100 }]);
      this.drawChart($("#atlas-chart-work", body), history, [{ key: "queue", color: "#f59e0b", max: 600 }, { key: "sessions", color: "#34d399", max: 64 }]);
      this.drawChart($("#atlas-chart-network", body), history, [{ key: "pps", color: "#fb7185", max: Math.max(200, ...history.map((x) => Number(x.pps || 0))) }]);
    }

    drawChart(canvas, history, series) {
      if (!canvas) return;
      const ctx = canvas.getContext("2d"), w = canvas.width, h = canvas.height, pad = 22;
      ctx.clearRect(0, 0, w, h); ctx.fillStyle = "#07111c"; ctx.fillRect(0, 0, w, h); ctx.strokeStyle = "rgba(148,163,184,.14)"; ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i += 1) { const y = pad + ((h - pad * 2) / 4) * i; ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(w - pad, y); ctx.stroke(); }
      series.forEach((def) => { ctx.strokeStyle = def.color; ctx.lineWidth = 2; ctx.beginPath(); history.forEach((point, i) => { const x = history.length <= 1 ? pad : pad + (i / (history.length - 1)) * (w - pad * 2); const value = clamp(Number(point[def.key] || 0), 0, def.max); const y = h - pad - (value / def.max) * (h - pad * 2); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }); ctx.stroke(); });
    }
  }

  async function initialize() {
    const root = document.querySelector(ROOT);
    if (!root || root.dataset.atlasOsV3 === "true") return;
    try {
      const atlas = await waitForAtlas();
      root.dataset.atlasOsV3 = "true";
      const os = new AtlasOS(atlas);
      window.ATLAS_OS = Object.freeze({ version: VERSION, build: BUILD, os, launch: () => os.launch(), open: (id) => os.openApp(id), terminal: (command) => os.terminal.execute(command), listApps: () => [...os.apps.keys()], listProcesses: () => os.processManager.list(), readFile: (path) => os.vfs.read(path), writeFile: (path, content) => os.vfs.write(path, content) });
      atlas.engine.log("SUCCESS", "ATLAS-OS", `ATLAS OS v${VERSION} desktop integration loaded.`);
      atlas.engine.audit("atlas_os.initialize", { version: VERSION, build: BUILD });
    } catch (error) {
      console.error("[ATLAS OS]", error);
      const warning = document.createElement("div");
      warning.className = "atlas-os-load-error";
      warning.textContent = "ATLAS OS could not initialize because ATLAS Enterprise v2 was not loaded first.";
      root.prepend(warning);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();
