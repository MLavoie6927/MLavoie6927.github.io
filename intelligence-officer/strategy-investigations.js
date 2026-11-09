/* Public-safe, browser-only educational exercise. No network or storage access. */
(() => {
  "use strict";

  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  const menuToggle = document.querySelector("#strategy-menu-toggle");
  const navigation = document.querySelector("#strategy-navigation");
  const mobileNavigation = window.matchMedia("(max-width: 850px)");

  if (menuToggle && navigation) {
    const setMenu = (open) => {
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
      navigation.classList.toggle("is-open", open);
    };
    menuToggle.addEventListener("click", () => setMenu(menuToggle.getAttribute("aria-expanded") !== "true"));
    navigation.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (!mobileNavigation.matches || !link) return;
      const destination = link.getAttribute("href");
      if (destination && destination.startsWith("#")) {
        const section = document.querySelector(destination);
        if (section) {
          event.preventDefault();
          setMenu(false);
          window.requestAnimationFrame(() => {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
            window.history.pushState(null, "", destination);
          });
          return;
        }
      }
      setMenu(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        menuToggle.focus();
      }
    });
    const handleWidth = () => { if (!mobileNavigation.matches) setMenu(false); };
    if (typeof mobileNavigation.addEventListener === "function") mobileNavigation.addEventListener("change", handleWidth);
    else mobileNavigation.addListener(handleWidth);
    setMenu(false);
  }

  const sourceLabels = {
    6: "06 · OSINT / open sources",
    7: "07 · Official statistics",
    8: "08 · Laws and regulations",
    9: "09 · Budgets and audits",
    10: "10 · Public procurement",
    14: "14 · Rail and road operations",
    18: "18 · Energy and grid reports",
    19: "19 · Water and utility reports",
    24: "24 · Patents and standards",
    26: "26 · Authorized system telemetry",
    28: "28 · Labor and job postings",
    29: "29 · Local reporting and community accounts",
    30: "30 · Interviews and subject-matter experts"
  };

  const strategyCases = {
    "long-ledger": {
      label: "Fictional case 01 · Program strategy",
      title: "Operation Long Ledger",
      summary: "A regional public-infrastructure modernization program is eighteen months late and 28% over its original estimate. Leaders must decide whether to continue, restructure, pause, or audit before the next funding vote.",
      customer: "Regional oversight committee",
      decision: "Continue, restructure, pause, or audit",
      deadline: "Next funding vote in 10 days",
      sources: [8, 9, 10, 14, 28, 30],
      hypotheses: [
        { id: "h1", title: "H1 · Temporary delivery disruption", detail: "The plan remains sound; late materials and a short labor gap explain most delay." },
        { id: "h2", title: "H2 · Structural program failure", detail: "Scope, governance, vendor dependency, and estimates make the current plan unsustainable." },
        { id: "h3", title: "H3 · Strategic redesign is underway", detail: "Delay partly reflects an authorized transition that produces long-term value not captured by the original baseline." },
        { id: "h4", title: "H4 · Reporting distortion", detail: "Headline schedule and cost figures combine unlike phases and conceal completed value or separate overruns." }
      ],
      evidence: [
        { id: "e1", title: "Baseline and change-control ledger", detail: "Original scope, approved changes, owner, date, cost, schedule, and benefit." },
        { id: "e2", title: "Independent milestone evidence", detail: "Accepted deliverables, defects, rework, dependencies, and operational readiness." },
        { id: "e3", title: "Procurement and supplier map", detail: "Awards, deliveries, substitutions, sole sources, disputes, and lead times." },
        { id: "e4", title: "Workforce and productivity records", detail: "Authorized staffing, vacancy, turnover, hours, output, and time to competence." },
        { id: "e5", title: "Benefits and user-impact measures", detail: "Service reliability, access, safety, throughput, and who receives value." },
        { id: "e6", title: "Governance and audit trail", detail: "Decision rights, risk acceptance, exceptions, oversight findings, and corrective actions." }
      ],
      required: ["e1", "e2", "e3", "e6"],
      leading: "h2",
      judgment: "The evidence best supports structural program weakness rather than a single temporary delay. Repeated scope changes, concentrated supplier dependency, and unclear acceptance authority make the current baseline unreliable.",
      action: "Condition the next funding tranche on a 30-day independent rebaseline, named acceptance authority, supplier-contingency plan, and a stop/go review. Preserve critical maintenance while the review runs.",
      observed: "Schedule and estimate variance are reported; approved scope changes, accepted value, and dependency-level causes have not yet been reconciled.",
      unproven: "Fraud, deliberate concealment, total program failure, and the claim that more funding alone will restore the plan remain unproven.",
      trigger: "Change the judgment if reconciled milestones show verified benefits on the revised critical path and supplier risk is demonstrably bounded."
    },
    "broken-compass": {
      label: "Fictional case 02 · Ambiguous disengagement",
      title: "Operation Broken Compass",
      summary: "A coordinated online pressure campaign against a public agency abruptly goes quiet after the agency announces an investigation. Leaders must decide whether to pursue attribution, hold, monitor, or redirect resources.",
      customer: "Agency incident and communications leads",
      decision: "Pursue, hold, monitor, or redirect",
      deadline: "Protective posture due in 6 hours",
      sources: [6, 26, 29, 30],
      hypotheses: [
        { id: "h1", title: "H1 · Genuine de-escalation", detail: "Interest fell after new information reduced the grievance or attention cycle." },
        { id: "h2", title: "H2 · Feigned withdrawal", detail: "Visible activity paused to draw an overconfident response or shift to another channel." },
        { id: "h3", title: "H3 · Resource constraint", detail: "Accounts lost access, funding, coordination, infrastructure, or operator availability." },
        { id: "h4", title: "H4 · Collection artifact", detail: "Monitoring coverage changed; the activity may continue outside observed channels." }
      ],
      evidence: [
        { id: "e1", title: "Sensor and coverage change log", detail: "Collection uptime, query changes, platform visibility, clock, retention, and blind spots." },
        { id: "e2", title: "First-known and last-known timeline", detail: "Original posts, repost lineage, deletions, channel migration, and synchronized timestamps." },
        { id: "e3", title: "Shared-control evidence", detail: "Lawfully obtained infrastructure, access, scheduling, or administrative links." },
        { id: "e4", title: "Behavioral effect", detail: "Verified service disruption, threat reports, public action, or no measurable effect." },
        { id: "e5", title: "Independent community reporting", detail: "Consent-based observations from differently placed groups and trusted messengers." },
        { id: "e6", title: "Official action chronology", detail: "Announcement time, platform action, legal notices, mitigations, and external events." }
      ],
      required: ["e1", "e2", "e4", "e6"],
      leading: "h4",
      judgment: "A collection artifact is the leading explanation because monitoring coverage changed during the same window. A feigned withdrawal remains possible but is not established by silence alone.",
      action: "Hold public attribution, restore and document coverage, preserve current controls, and monitor predefined indicators across authorized channels. Do not pursue the apparent retreat into unverified spaces.",
      observed: "Visible volume fell after an announcement, but collection coverage and platform access also changed.",
      unproven: "A handler, coordinated withdrawal, specific actor, intent to lure, and migration to a named channel remain unproven.",
      trigger: "Escalate if authenticated shared control, synchronized cross-channel migration, or a verified follow-on action appears."
    },
    "civic-bridge": {
      label: "Fictional case 03 · Trust and public service",
      title: "Operation Civic Bridge",
      summary: "Residents stop using a city assistance program after contradictory eligibility notices circulate through official and community channels. The city must decide how to restore access without dismissing legitimate distrust.",
      customer: "City service director and community partners",
      decision: "Correct, redesign, independently review, or pause",
      deadline: "Public update due tomorrow at noon",
      sources: [6, 7, 8, 29, 30],
      hypotheses: [
        { id: "h1", title: "H1 · Policy ambiguity", detail: "The eligibility rule itself is inconsistent or changed without a stable implementation rule." },
        { id: "h2", title: "H2 · Communication failure", detail: "The rule is stable, but versions, translations, channels, and staff scripts conflict." },
        { id: "h3", title: "H3 · Deliberate manipulation", detail: "A person or network knowingly altered guidance to reduce participation or redirect applicants." },
        { id: "h4", title: "H4 · Relationship breakdown", detail: "Past service failures make even accurate notices untrusted; messenger and process matter as much as wording." }
      ],
      evidence: [
        { id: "e1", title: "Authoritative rule history", detail: "Enacted policy, effective dates, amendments, eligibility tests, appeals, and owner." },
        { id: "e2", title: "Message version control", detail: "Every official version, translation, timestamp, approver, channel, and removal history." },
        { id: "e3", title: "Applicant journey data", detail: "Calls, starts, denials, abandoned applications, appeals, wait times, and subgroup access." },
        { id: "e4", title: "Community listening sessions", detail: "Consent-based accounts from applicants, navigators, advocates, and frontline staff." },
        { id: "e5", title: "Provenance of disputed notices", detail: "Earliest copy, source URL, archive history, edits, and relationship to official material." },
        { id: "e6", title: "Prior service commitments", detail: "Published promises, unresolved complaints, correction history, and follow-through." }
      ],
      required: ["e1", "e2", "e3", "e4"],
      leading: "h2",
      judgment: "Communication failure is directly supported: two city-approved versions conflict and frontline scripts lag the latest rule. Prior relationship damage likely magnifies the effect; deliberate manipulation is not established.",
      action: "Publish one dated source of truth, pause adverse decisions tied to the conflict, notify affected applicants, equip trusted partners with the same version, and commission a short independent access review.",
      observed: "Contradictory approved notices and falling application completion are documented.",
      unproven: "A coordinated influence campaign, community hostility, applicant indifference, and deliberate sabotage remain unproven.",
      trigger: "Reassess if corrected guidance does not restore completion or if authenticated alteration before official distribution is found."
    },
    "narrow-gate": {
      label: "Fictional case 04 · Infrastructure resilience",
      title: "Operation Narrow Gate",
      summary: "A water utility's primary pump, backup power, and remote monitoring fail within forty minutes during a storm. Leaders must decide whether the system experienced independent faults, a common-cause failure, or a control bypass.",
      customer: "Utility incident commander and regulator",
      decision: "Isolate, fail over, stage resources, or escalate",
      deadline: "Safe-service decision due in 90 minutes",
      sources: [9, 18, 19, 24, 26, 30],
      hypotheses: [
        { id: "h1", title: "H1 · Independent storm faults", detail: "Separate weather-driven equipment failures happened close together by chance." },
        { id: "h2", title: "H2 · Common-cause dependency", detail: "Power, communications, monitoring, and backup share an overlooked component or location." },
        { id: "h3", title: "H3 · Maintenance debt", detail: "Known defects, deferred testing, expired fuel, or uncorrected alarms collapsed multiple layers." },
        { id: "h4", title: "H4 · Deliberate control bypass", detail: "Unauthorized access or change disabled protective layers." }
      ],
      evidence: [
        { id: "e1", title: "Synchronized event timeline", detail: "Pump, power, controller, network, alarm, weather, and operator timestamps." },
        { id: "e2", title: "Dependency and single-point map", detail: "Power feeds, network paths, rooms, credentials, sensors, vendors, and failover." },
        { id: "e3", title: "Maintenance and test history", detail: "Open defects, generator tests, fuel, batteries, inspections, overrides, and recurrence." },
        { id: "e4", title: "Authorized access and change logs", detail: "Identity, configuration, remote sessions, work orders, and chain of custody." },
        { id: "e5", title: "Independent field measurements", detail: "Pressure, tank level, flow, water quality, generator output, and physical inspection." },
        { id: "e6", title: "Continuity and public-impact status", detail: "Storage cover, critical customers, alternate supply, notices, crews, and restoration time." }
      ],
      required: ["e1", "e2", "e5", "e6"],
      leading: "h2",
      judgment: "A common-cause dependency is most consistent with the sequence: the primary and backup layers shared one flooded communications and control enclosure. Maintenance debt may have increased exposure; deliberate bypass is not supported.",
      action: "Operate locally under safe manual procedures, isolate the affected enclosure, protect water quality and critical customers, activate alternate supply, and begin regulator-notified restoration with preserved logs.",
      observed: "Three layers failed in one time window and one shared enclosure is physically affected.",
      unproven: "Cyberattack, insider action, total system compromise, and fully independent failures remain unproven.",
      trigger: "Escalate the deliberate-bypass hypothesis only if authenticated access or change records conflict with authorized work and physical timing."
    }
  };

  const tabs = Array.from(document.querySelectorAll("[data-case]"));
  const workspace = document.querySelector("#case-workspace");
  const form = document.querySelector("#strategy-lab");
  const hypothesisOptions = document.querySelector("#hypothesis-options");
  const evidenceOptions = document.querySelector("#evidence-options");
  const evidenceCount = document.querySelector("#evidence-count");
  const output = document.querySelector("#assessment-output");
  const sourceStack = document.querySelector("#source-stack-list");
  const buildButton = document.querySelector("#build-assessment");
  const revealButton = document.querySelector("#reveal-assessment");
  if (!tabs.length || !workspace || !form || !hypothesisOptions || !evidenceOptions || !output || !sourceStack || !buildButton || !revealButton) return;

  let activeCase = "long-ledger";

  const setText = (selector, value) => {
    const node = document.querySelector(selector);
    if (node) node.textContent = value;
  };

  const replaceOutput = (label, title, summary, fields, warning = "") => {
    output.replaceChildren();
    const eyebrow = document.createElement("span");
    const heading = document.createElement("h3");
    const paragraph = document.createElement("p");
    eyebrow.textContent = label;
    heading.textContent = title;
    paragraph.textContent = summary;
    output.append(eyebrow, heading, paragraph);
    if (warning) {
      const caution = document.createElement("p");
      caution.className = "assessment-warning";
      caution.textContent = warning;
      output.append(caution);
    }
    const list = document.createElement("dl");
    fields.forEach(([term, description]) => {
      const row = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = term;
      dd.textContent = description;
      row.append(dt, dd);
      list.append(row);
    });
    output.append(list);
  };

  const updateEvidenceCount = () => {
    const selected = evidenceOptions.querySelectorAll("input:checked").length;
    evidenceCount.textContent = `${selected} selected`;
  };

  const renderCase = (caseId, focusTab = false) => {
    const scenario = strategyCases[caseId];
    if (!scenario) return;
    activeCase = caseId;
    tabs.forEach((tab) => {
      const selected = tab.dataset.case === caseId;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected) workspace.setAttribute("aria-labelledby", tab.id);
    });
    setText("#case-label", scenario.label);
    setText("#case-title", scenario.title);
    setText("#case-summary", scenario.summary);
    setText("#case-customer", scenario.customer);
    setText("#case-decision", scenario.decision);
    setText("#case-deadline", scenario.deadline);

    hypothesisOptions.replaceChildren();
    scenario.hypotheses.forEach((hypothesis) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      const copy = document.createElement("span");
      const title = document.createElement("strong");
      const detail = document.createElement("small");
      input.type = "radio";
      input.name = "hypothesis";
      input.value = hypothesis.id;
      title.textContent = hypothesis.title;
      detail.textContent = hypothesis.detail;
      copy.append(title, detail);
      label.append(input, copy);
      hypothesisOptions.append(label);
    });

    evidenceOptions.replaceChildren();
    scenario.evidence.forEach((evidence) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      const copy = document.createElement("span");
      const title = document.createElement("strong");
      const detail = document.createElement("small");
      input.type = "checkbox";
      input.name = "evidence";
      input.value = evidence.id;
      title.textContent = evidence.title;
      detail.textContent = evidence.detail;
      copy.append(title, detail);
      label.append(input, copy);
      evidenceOptions.append(label);
    });
    evidenceOptions.querySelectorAll("input").forEach((input) => input.addEventListener("change", updateEvidenceCount));
    updateEvidenceCount();

    sourceStack.replaceChildren();
    scenario.sources.forEach((sourceId) => {
      const chip = document.createElement("span");
      chip.textContent = sourceLabels[sourceId];
      sourceStack.append(chip);
    });

    replaceOutput(
      "Analyst workspace",
      "Choose a hypothesis and evidence",
      "Good analysis does not reward guessing the hidden answer. It rewards collecting evidence that can separate credible alternatives before the customer's deadline.",
      [["Required boundary", "State what is observed, what is assessed, and what remains unproven."], ["Decision rule", "Recommend the smallest reversible action that protects the objective while closing the most important gap."]]
    );
    if (focusTab) tabs.find((tab) => tab.dataset.case === caseId)?.focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => renderCase(tab.dataset.case));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      renderCase(tabs[next].dataset.case, true);
    });
  });

  buildButton.addEventListener("click", () => {
    const scenario = strategyCases[activeCase];
    const selectedHypothesis = form.querySelector('input[name="hypothesis"]:checked');
    const selectedEvidence = Array.from(form.querySelectorAll('input[name="evidence"]:checked')).map((input) => input.value);
    if (!selectedHypothesis) {
      replaceOutput("Collection check", "No hypothesis selected", "Choose the explanation you would test first. A first hypothesis organizes collection; it is not a conclusion.", [["Next step", "Select one hypothesis, then choose evidence that could both support and weaken it."]], "Do not collect a pile of confirming facts without naming a competing explanation.");
      return;
    }
    const hypothesis = scenario.hypotheses.find((item) => item.id === selectedHypothesis.value);
    const covered = scenario.required.filter((item) => selectedEvidence.includes(item));
    const missing = scenario.required.filter((item) => !selectedEvidence.includes(item));
    const readiness = missing.length === 0 ? "Decision threshold met" : covered.length >= 2 ? "Partial decision support" : "Collection is too narrow";
    const missingNames = scenario.evidence.filter((item) => missing.includes(item.id)).map((item) => item.title);
    replaceOutput(
      "Provisional brief",
      readiness,
      `You are testing ${hypothesis.title}. You selected ${selectedEvidence.length} of ${scenario.evidence.length} evidence records and covered ${covered.length} of ${scenario.required.length} discriminating requirements.`,
      [
        ["Observed", "Only the fictional case statement and the evidence you selected may be treated as available observations."],
        ["Assessed", missing.length ? "The chosen hypothesis remains provisional because key alternatives are not yet separated." : "The collection set is broad enough to support a time-bounded, qualified judgment; it does not guarantee the hypothesis is correct."],
        ["Unproven", "Actor, intent, coordination, cause, and future outcome remain unproven unless a selected authenticated record directly supports them."],
        ["Missing collection", missingNames.length ? missingNames.join("; ") : "No required category is missing. Check independence, provenance, authority, and recency."],
        ["Decision posture", missing.length ? "Use a reversible protection step and continue targeted collection." : "Brief the customer now, state confidence, and set a review trigger."]
      ],
      missing.length ? "More evidence is not automatically better; collect the missing record most likely to change the decision." : "Threshold met does not erase uncertainty. Preserve the alternatives and review trigger."
    );
  });

  revealButton.addEventListener("click", () => {
    const scenario = strategyCases[activeCase];
    const leading = scenario.hypotheses.find((item) => item.id === scenario.leading);
    replaceOutput(
      "Synthetic case assessment",
      leading.title,
      scenario.judgment,
      [["Observed", scenario.observed], ["Assessed action", scenario.action], ["Unproven", scenario.unproven], ["Review trigger", scenario.trigger]],
      "This is one defensible answer to a fictional evidence set, not a claim about a real person, agency, event, or operation."
    );
  });

  form.addEventListener("reset", () => {
    window.setTimeout(() => {
      updateEvidenceCount();
      replaceOutput("Analyst workspace", "Case reset", "Select a hypothesis and request only the evidence that helps the customer decide.", [["Standard", "Observed, assessed, unproven, action, and review trigger must remain distinct."]]);
    });
  });

  renderCase(activeCase);
})();
