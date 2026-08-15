(function () {
  "use strict";

  var scenarios = {
    normal: {
      title: "Normal Service-Provider Operation",
      description: "All provider adjacencies, label-switched paths, customer VPNs, security controls, and telemetry pipelines are healthy.",
      severity: "Operational",
      severityClass: "severity-normal",
      bgp: "8 / 8",
      ospf: "12 / 12",
      lsp: "Healthy",
      sites: "3 / 3",
      utilization: "38%",
      syn: "214 pps",
      critical: "0",
      siem: "Healthy",
      eventId: "EVT-0000",
      eventName: "No active incident",
      eventDetail: "Baseline traffic is within threshold and no customer-impacting event is present.",
      path: ["Telemetry", "Baseline", "Service healthy"]
    },
    ddos: {
      title: "DDoS Against Customer A Web Service",
      description: "A synthetic SYN-rate anomaly exceeds the customer baseline and the modeled circuit is approaching saturation.",
      severity: "Critical",
      severityClass: "severity-high",
      bgp: "8 / 8",
      ospf: "12 / 12",
      lsp: "Healthy",
      sites: "2 / 3",
      utilization: "98%",
      syn: "12,844 pps",
      critical: "1",
      siem: "Healthy",
      eventId: "IR-01 / SYN-FLOOD",
      eventName: "Customer circuit saturation risk",
      eventDetail: "Firewall controls can protect session state, but upstream filtering or scrubbing is required if malicious demand consumes the provider-facing circuit.",
      path: ["SIEM alert", "Flow spike", "PCAP flags", "NGFW counters", "Upstream action"]
    },
    compromise: {
      title: "Compromised Customer Web Server",
      description: "Endpoint, DNS, and firewall events correlate into a probable command-and-control sequence on CUST-A-WEB01.",
      severity: "High",
      severityClass: "severity-high",
      bgp: "8 / 8",
      ospf: "12 / 12",
      lsp: "Healthy",
      sites: "3 / 3",
      utilization: "42%",
      syn: "230 pps",
      critical: "1",
      siem: "Healthy",
      eventId: "IR-02 / C2-DNS",
      eventName: "Rare DNS followed by outbound TLS",
      eventDetail: "Sysmon process ancestry, DNS requests, firewall sessions, and IDS metadata support scoped containment and evidence preservation.",
      path: ["Rare DNS", "PowerShell", "TLS egress", "Persistence", "Contain host"]
    },
    routing: {
      title: "Provider Core Link Failure",
      description: "BFD detects the PE1-to-P1 failure, OSPF reconverges, and labeled traffic shifts to the PE1-to-P2-to-P3 path.",
      severity: "Degraded",
      severityClass: "severity-medium",
      bgp: "8 / 8",
      ospf: "10 / 12",
      lsp: "Rerouted",
      sites: "3 / 3",
      utilization: "61%",
      syn: "205 pps",
      critical: "0",
      siem: "Healthy",
      eventId: "NOC-01 / CORE-LINK",
      eventName: "Redundant path carrying customer traffic",
      eventDetail: "Protocol evidence identifies an availability event rather than an intrusion; repair proceeds without unnecessary security containment.",
      path: ["BFD down", "OSPF SPF", "Alternate LSP", "Service check", "Repair ticket"]
    },
    leak: {
      title: "Unauthorized Customer Route Advertisement",
      description: "CE-A1 attempts to advertise 0.0.0.0/0, but the PE prefix allowlist rejects it before the route enters the customer VRF.",
      severity: "High",
      severityClass: "severity-high",
      bgp: "8 / 8",
      ospf: "12 / 12",
      lsp: "Healthy",
      sites: "3 / 3",
      utilization: "39%",
      syn: "219 pps",
      critical: "1",
      siem: "Healthy",
      eventId: "RSEC-01 / PREFIX-REJECT",
      eventName: "BGP policy prevented route leak",
      eventDetail: "The rejected update is logged, no forwarding change occurs, and the customer session remains available for the authorized prefix.",
      path: ["BGP update", "Prefix reject", "RIB unchanged", "SIEM alert", "Customer review"]
    }
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function updateScenario(name) {
    var scenario = scenarios[name];
    var path = byId("event-path");

    if (!scenario || !path) {
      return;
    }

    byId("current-scenario-title").textContent = scenario.title;
    byId("scenario-description").textContent = scenario.description;
    byId("scenario-severity").textContent = scenario.severity;
    byId("scenario-severity").className = "severity " + scenario.severityClass;
    byId("metric-bgp").textContent = scenario.bgp;
    byId("metric-ospf").textContent = scenario.ospf;
    byId("metric-lsp").textContent = scenario.lsp;
    byId("metric-sites").textContent = scenario.sites;
    byId("metric-utilization").textContent = scenario.utilization;
    byId("metric-syn").textContent = scenario.syn;
    byId("metric-critical").textContent = scenario.critical;
    byId("metric-siem").textContent = scenario.siem;
    byId("event-id").textContent = scenario.eventId;
    byId("event-name").textContent = scenario.eventName;
    byId("event-detail").textContent = scenario.eventDetail;

    path.replaceChildren();
    scenario.path.forEach(function (step) {
      var item = document.createElement("span");
      item.textContent = step;
      path.appendChild(item);
    });

    document.querySelectorAll(".scenario-button").forEach(function (button) {
      var active = button.dataset.scenario === name;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function updateClock() {
    var clock = byId("scenario-clock");

    if (clock) {
      clock.textContent = new Date().toISOString().slice(11, 19) + " UTC";
    }
  }

  function ready() {
    document.querySelectorAll(".scenario-button").forEach(function (button) {
      button.addEventListener("click", function () {
        updateScenario(button.dataset.scenario);
      });
    });

    updateClock();
    window.setInterval(updateClock, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }
})();
