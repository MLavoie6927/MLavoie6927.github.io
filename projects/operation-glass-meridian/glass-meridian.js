(() => {
  "use strict";

  const root = document.getElementById("glass-meridian-lab");
  if (!root) return;

  const STORAGE_KEY = "glassMeridianLab.v1";

  const hypotheses = [
    { id: "H1", title: "Coercion Without Intended Military Action", short: "Coercion only", initial: 40,
      text: "Norland intends primarily to frighten Estavia into political concessions and does not presently intend substantial military force." },
    { id: "H2", title: "Coercion Backed by a Genuine Limited Military Option", short: "Coercion + limited option", initial: 30,
      text: "Norland seeks political concessions while preparing a limited operation that could be used if coercion fails." },
    { id: "H3", title: "Large-Scale Invasion", short: "Large invasion", initial: 15,
      text: "Norland is preparing sustained conventional operations to seize substantial territory or replace the Estavian government." },
    { id: "H4", title: "Strategic Deception", short: "Primary deception", initial: 15,
      text: "Norland is manufacturing indicators of imminent military action to manipulate Estavia and allied governments while pursuing another objective." }
  ];

  const reports = [
    {
      id: 1, family: "HUMINT", title: "FALCON-17: Thirty-Day Sustainment",
      source: "Major Leon Dresk, Norland Army Logistics Directorate", reliability: "Historically reliable",
      effect: "H2", diagnostic: "High", deception: "Moderate",
      summary: "A logistics insider reports that western formations shifted from seven-day to thirty-day sustainment requirements.",
      evidence: ["Fuel reserves increased", "Spare components increased", "Food and batteries increased", "Recovery and maintenance capability increased", "No unusually large ammunition distribution observed"],
      note: "Strong evidence of operational capability, not political intent. The ammunition gap modestly constrains H3."
    },
    {
      id: 2, family: "SIGINT", title: "Western Theater Command Centralization",
      source: "Military communications intercepts", reliability: "High technical confidence",
      effect: "mixed", diagnostic: "Moderate", deception: "Moderate",
      summary: "Encrypted traffic increased and several formations shifted reporting directly to Western Joint Operations Headquarters.",
      evidence: ["Traffic volume +37% in five days", "24-hour communications watch", "Alternate communications architecture ordered", "PHASE LARK also linked to scheduled exercise"],
      note: "Command centralization is more significant than volume, but remains compatible with both exercise activity and genuine operations."
    },
    {
      id: 3, family: "GEOINT/IMINT", title: "Expanded Western Staging Areas",
      source: "Commercial and government satellite imagery", reliability: "High",
      effect: "H2", diagnostic: "High", deception: "Low-Moderate",
      summary: "Temporary camps, staging fields, fuel storage, air defenses, and rail unloading areas expanded beyond historical exercise baseline.",
      evidence: ["Camps expanded from 4 to 11", "~190 additional military vehicles", "Mobile air defenses moved west", "Field fuel bladders established", "Current footprint ~55% larger than last year's exercise"],
      note: "Physical preparation exceeds the historical baseline. Strong capability evidence; limited direct insight into leadership intent."
    },
    {
      id: 4, family: "GEOINT/IMINT", title: "Rovan Corridor Bridging Equipment",
      source: "Estavian reconnaissance drone", reliability: "High",
      effect: "H2", diagnostic: "Moderate-High", deception: "Moderate",
      summary: "An engineering formation with tactical bridging systems is positioned near a corridor suited to a limited cross-border push.",
      evidence: ["12 mobile bridge sections", "Heavy engineering tractors", "River-crossing support vehicles", "Positioned 32 km from frontier"],
      note: "Equipment is dual-use, but geography increases its diagnostic value."
    },
    {
      id: 5, family: "MASINT", title: "Fuel-Depot Thermal and Radar Activity",
      source: "Technical sensors and radar collection", reliability: "High",
      effect: "mixed", diagnostic: "Moderate", deception: "Low",
      summary: "Thermal signatures indicate increased fuel-transfer activity while mobile air-defense radars conduct readiness testing.",
      evidence: ["Higher thermal activity at two western fuel depots", "Periodic activation of normally inactive mobile air-defense radars"],
      note: "Independent corroboration of sustainment and readiness. Still compatible with a major exercise."
    },
    {
      id: 6, family: "OSINT/SOCMINT", title: "Defense Procurement Surge",
      source: "Authentic public procurement notices", reliability: "High provenance",
      effect: "mixed", diagnostic: "Moderate", deception: "High",
      summary: "Norland openly purchased trauma dressings, field sleeping systems, vehicle spares, and temporary fuel storage.",
      evidence: ["48,000 trauma dressings", "11,500 cold-weather sleeping systems", "Emergency vehicle spares", "Temporary fuel-storage equipment"],
      note: "Authenticity does not resolve meaning. Public exposure may be routine, accidental, or deliberately visible."
    },
    {
      id: 7, family: "OSINT/SOCMINT", title: "Leave Cancellations and Viral Armor Video",
      source: "Soldier/family social media", reliability: "Mixed",
      effect: "mixed", diagnostic: "Low-Moderate", deception: "High",
      summary: "Six independently verifiable leave-cancellation observations coexist with a viral tank video that proves to be eighteen months old.",
      evidence: ["Six verified leave-cancellation observations", "Two successfully geolocated images", "Three unauthenticated images", "Viral tank video is recycled"],
      note: "Count original observations, not repost volume. SOCMINT can manufacture false corroboration."
    },
    {
      id: 8, family: "CYBINT/DNINT", title: "Pre-Positioned Cyber Access",
      source: "Estavia National Cyber Defense Center", reliability: "High",
      effect: "H2", diagnostic: "High", deception: "Moderate",
      summary: "Norland-linked operators maintain privileged access to rail, power, identity, defense-contractor, and telecom networks.",
      evidence: ["Credential theft", "Privilege escalation", "Persistence", "Network mapping", "No destructive payloads deployed"],
      note: "Persistent access creates future options. Transition from access to destructive effects would be much more diagnostic."
    },
    {
      id: 9, family: "CYBINT/DNINT", title: "Forward Command-and-Logistics Network Integration",
      source: "Digital network analysis", reliability: "High",
      effect: "H2", diagnostic: "High", deception: "Low-Moderate",
      summary: "A low-activity logistics network begins regular communication with theater HQ, transportation command, fuel systems, and field communications.",
      evidence: ["New command/logistics communication pattern", "New encrypted network connects forward headquarters"],
      note: "The relationship architecture is more meaningful than raw traffic volume."
    },
    {
      id: 10, family: "FININT/Economic/Energy", title: "Defense Spending and Strategic Reserve Transfers",
      source: "Financial intelligence", reliability: "High",
      effect: "mixed", diagnostic: "High", deception: "Low",
      summary: "Fuel spending, transportation contracts, logistics payments, and defense funding increase, but broader wartime financial controls are absent.",
      evidence: ["Military fuel spending +41%", "Emergency transport contracts tripled", "Accelerated logistics-company payments", "No capital controls", "No major central-bank reserve movement"],
      note: "Positive readiness evidence and negative evidence against preparation for prolonged large-scale war."
    },
    {
      id: 11, family: "TECHINT", title: "Deployed Systems Support Limited Operations",
      source: "Technical intelligence specialists", reliability: "High",
      effect: "H2", diagnostic: "High", deception: "Low",
      summary: "Observed bridging, EW, air-defense, engineering, and command systems are sufficient for a limited operation, while deeper-campaign air defense remains in garrison.",
      evidence: ["Bridges support primary armored formations", "Short-range air defense deployed", "EW and mobile command posts deployed", "Theater air-defense assets largely remain at permanent installations"],
      note: "Technical capability fits H2 more comfortably than H3."
    },
    {
      id: 12, family: "Counterintelligence/Deception", title: "Unverified Western Liberation Support Plan",
      source: "Anonymous document delivered to journalist", reliability: "Unverified",
      effect: "H4", diagnostic: "High", deception: "Very high",
      summary: "A leaked spreadsheet appears to describe a thirty-day offensive but contains obsolete formatting and unknown provenance.",
      evidence: ["Military terminology mostly correct", "Three obsolete formatting conventions", "Metadata stripped", "Provenance unknown"],
      note: "A perfectly confirming document should receive increased scrutiny, not decreased scrutiny."
    },
    {
      id: 13, family: "Logistics/Transportation/MEDINT", title: "Limited Wartime Medical Capacity",
      source: "MEDINT and imagery", reliability: "High",
      effect: "H2", diagnostic: "Very high", deception: "Low-Moderate",
      summary: "Trauma procurement and two temporary medical facilities support casualty planning but are insufficient for large-scale sustained combat.",
      evidence: ["Blood-storage purchases", "Field surgical kits", "Antibiotics and trauma supplies", "Two temporary medical facilities", "Capacity sufficient for limited operations, not large war"],
      note: "Scale makes this one of the case's most diagnostic reports."
    },
    {
      id: 14, family: "FININT/Economic/Energy", title: "Selective Economic Hedging",
      source: "Economic intelligence", reliability: "High",
      effect: "mixed", diagnostic: "Moderate-High", deception: "Low",
      summary: "Strategic petroleum reserves rise and exports of two defense-relevant chemicals are restricted, while ordinary economic activity remains normal.",
      evidence: ["Strategic petroleum reserves increasing", "Restricted export of two industrial chemicals", "Food markets normal", "Commercial imports normal", "No national-emergency market behavior"],
      note: "More consistent with contingency preparation than comprehensive national mobilization."
    },
    {
      id: 15, family: "Military/ORBAT", title: "Western Force Can Seize Limited Objectives",
      source: "Integrated military order of battle", reliability: "High",
      effect: "H2", diagnostic: "Very high", deception: "Low",
      summary: "Three maneuver brigades plus artillery, engineering, air defense, logistics, and EW could seize eastern transport nodes but not conquer Estavia.",
      evidence: ["Three maneuver brigades", "One artillery brigade", "Engineering/logistics/EW support", "Two additional brigades remain east", "No nationwide reserve activation"],
      note: "Current force posture is tailored more closely to a limited fait accompli than nationwide conquest."
    },
    {
      id: 16, family: "Political/Diplomatic/Leadership", title: "Five-Hour Security Council Meeting",
      source: "Political intelligence and public statements", reliability: "High event confidence",
      effect: "mixed", diagnostic: "Low-Moderate", deception: "High",
      summary: "President Korr uses confrontational language while the foreign minister simultaneously emphasizes diplomacy.",
      evidence: ["Unscheduled five-hour security council meeting", "\"Will not abandon its people\"", "\"Diplomacy remains the only responsible solution\""],
      note: "The meeting is known; its decision is not. Contradictory messaging may reflect disagreement or intentional ambiguity."
    },
    {
      id: 17, family: "Political/Diplomatic/Leadership", title: "Private Diplomatic Warning",
      source: "Ambassadorial reporting", reliability: "High",
      effect: "H2", diagnostic: "Moderate", deception: "Moderate",
      summary: "Norland privately warns that the window for preventing irreversible consequences is closing while keeping embassies staffed and talks scheduled.",
      evidence: ["Private coercive language", "Embassies fully staffed", "Dependents not evacuated", "Negotiations remain scheduled"],
      note: "Preserving diplomatic and military pathways is compatible with H2."
    },
    {
      id: 18, family: "HUMINT", title: "Allied Report Reveals Circular Reporting",
      source: "Caldrian liaison reporting", reliability: "Initially high, lineage compromised",
      effect: "mixed", diagnostic: "High", deception: "Moderate",
      summary: "A seemingly independent allied report ultimately traces back through intermediaries connected to FALCON reporting.",
      evidence: ["Claims Korr authorized offensive action if demands fail", "Source initially withheld", "Later traced to former aide → contractor → Dresk colleague"],
      note: "Multiple intelligence services can repeat one underlying source. Lineage, not source count, determines corroboration."
    },
    {
      id: 19, family: "Counterintelligence/Deception", title: "Long-Term Reconnaissance Cells",
      source: "Law-enforcement and device forensics", reliability: "High",
      effect: "mixed", diagnostic: "Low-Moderate", deception: "Low",
      summary: "Two Norland-linked intelligence operatives surveilled rail, telecom, and electrical infrastructure for at least eight months.",
      evidence: ["Rail switching photography", "Telecom and substation surveillance", "Encrypted contact with military-intelligence-linked individual", "Activity predates current crisis"],
      note: "Supports long-term contingency preparation but is weak evidence of immediate intent."
    },
    {
      id: 20, family: "Logistics/Transportation/MEDINT", title: "Border Crossings Prioritize Military Traffic",
      source: "Border and customs intelligence", reliability: "High",
      effect: "H2", diagnostic: "Moderate", deception: "Low",
      summary: "Civilian access is restricted at three crossings while military vehicles and fuel receive priority; trade and civilian life continue.",
      evidence: ["Three border crossings restricted", "Military/fuel priority", "Commercial trade continues", "No mass civilian evacuation", "No refugee surge"],
      note: "Increasing military control over movement, but no nationwide-war social signature."
    },
    {
      id: 21, family: "Logistics/Transportation/MEDINT", title: "Rail Network Militarization",
      source: "Transportation intelligence", reliability: "High",
      effect: "H2", diagnostic: "High", deception: "Low",
      summary: "Passenger services are cancelled and military freight gains priority, sufficient to sustain the current force but not a much larger army.",
      evidence: ["12 passenger services cancelled", "Heavy-equipment railcars westbound", "Civilian trucking under temporary military contracts", "Capacity matches current western force"],
      note: "Scale is decisive: meaningful operational support without evidence of theater-wide mobilization."
    },
    {
      id: 22, family: "Military/ORBAT", title: "Amphibious Force Remains Inactive",
      source: "Maritime intelligence", reliability: "High",
      effect: "H1", diagnostic: "High", deception: "Low",
      summary: "Amphibious and naval forces capable of threatening Estavia's south remain largely in home port.",
      evidence: ["Amphibious vessels in home port", "Normal naval ammunition loading", "No fleet concentration", "Commercial shipping unrestricted"],
      note: "Negative evidence matters where coverage is good. This is inconsistent with some variants of H3."
    },
    {
      id: 23, family: "Military/ORBAT", title: "Aviation Readiness Without Theater-Wide Surge",
      source: "Aviation intelligence", reliability: "High",
      effect: "mixed", diagnostic: "High", deception: "Low",
      summary: "Reconnaissance, tactical transport, and fighter dispersal rise, but mass airlift, tanker, and national combat-aircraft indicators remain absent.",
      evidence: ["Tactical transport sorties +28%", "Reconnaissance increased", "Some fighter dispersal", "No mass strategic airlift", "No tanker surge"],
      note: "Supports readiness while constraining the large-scale invasion hypothesis."
    },
    {
      id: 24, family: "FININT/Economic/Energy", title: "Fuel Flows Shift West",
      source: "Pipeline and energy intelligence", reliability: "High",
      effect: "H2", diagnostic: "High", deception: "Low",
      summary: "Petroleum flows shift toward western Norland as strategic storage draws down and forward depots gain inventory.",
      evidence: ["Increased westbound petroleum flow", "Strategic depot drawdown", "Forward-depot accumulation", "Volume insufficient for months of nationwide campaigning"],
      note: "Another physical indicator pointing toward limited-war sustainment."
    },
    {
      id: 25, family: "FININT/Economic/Energy", title: "Defense Production Increase Predates Crisis",
      source: "Industrial and defense-production intelligence", reliability: "High",
      effect: "mixed", diagnostic: "Moderate", deception: "Low",
      summary: "Ammunition and defense-component production rose months before the immediate crisis, limiting its value as a near-term warning indicator.",
      evidence: ["Third shift at ammunition factory", "Artillery propellant purchases", "Vehicle parts, batteries, communications equipment", "Increase began four months ago"],
      note: "Industrial production is a slow indicator: useful for strategic preparation, weak for Tuesday-morning intent."
    },
    {
      id: 26, family: "Political/Diplomatic/Leadership", title: "Protection Narrative Exceeds Measurable Conditions",
      source: "Societal data and independent observers", reliability: "Moderate-High",
      effect: "H2", diagnostic: "High", deception: "Moderate",
      summary: "Norland's persecution claims substantially exceed observed violence, displacement, protest scale, and census-based conditions.",
      evidence: ["No mass displacement", "No widespread violence", "Protests in hundreds, not tens of thousands", "Rhetoric far exceeds observed conditions"],
      note: "Raises the likelihood that the ethnic-protection narrative is strategic political preparation."
    },
    {
      id: 27, family: "Political/Diplomatic/Leadership", title: "Treaty of Arden Centennial",
      source: "Cultural and strategic-culture analysis", reliability: "Moderate",
      effect: "mixed", diagnostic: "Low-Moderate", deception: "Moderate",
      summary: "A politically resonant anniversary creates potential timing and narrative value but does not determine leadership decisions.",
      evidence: ["Centennial in three weeks", "Korr repeatedly invokes artificial borders", "Nationalist symbolism is salient"],
      note: "Culture shapes options and timing; it does not create automatic decisions."
    },
    {
      id: 28, family: "Political/Diplomatic/Leadership", title: "Korr's Pattern Favors Limited Force",
      source: "Behavioral leadership analysis", reliability: "Moderate",
      effect: "H2", diagnostic: "Moderate-High", deception: "Moderate",
      summary: "Korr historically uses mobilization, ambiguity, and last-minute negotiation, and has previously authorized a limited incursion after diplomacy failed.",
      evidence: ["Willing to use force", "Prefers limited achievable objectives", "Avoids prolonged occupations", "Mobilized in three previous crises", "One prior limited border incursion"],
      note: "Leadership history informs probability but should never be treated as determinative."
    },
    {
      id: 29, family: "OSINT/SOCMINT", title: "Fabricated Velin Atrocity Narrative",
      source: "Influence analysis and digital forensics", reliability: "High",
      effect: "H2", diagnostic: "Very high", deception: "Very high",
      summary: "A state-linked influence operation fabricates a massacre narrative that Norland television rapidly amplifies as a possible justification for intervention.",
      evidence: ["Manipulated audio", "Inconsistent shadows", "Duplicated individuals", "Upload metadata tied to influence contractor", "State TV amplification within six hours"],
      note: "Strong political indicator of justification preparation, but fabricated crises can support either real force or coercive pressure."
    },
    {
      id: 30, family: "Counterintelligence/Deception", title: "Planted Invasion Plan Attributed to Deception Directorate",
      source: "DOMEX and counterintelligence analysis", reliability: "High",
      effect: "H4", diagnostic: "Very high", deception: "Certain",
      summary: "The leaked invasion spreadsheet is traced to a workstation belonging to Norland's Strategic Deception Directorate.",
      evidence: ["Authoring system identified", "Workstation belongs to deception apparatus", "Likely intended for Estavian discovery", "Physical military indicators remain independently observed"],
      note: "This proves deception activity, not necessarily a deception-only strategy. Real limited operations and perception manipulation can coexist."
    }
  ];

  const achEvidence = [
    "30-day sustainment requirement",
    "Theater C2 centralization",
    "Expanded staging areas",
    "Bridging capability",
    "Limited field hospitals",
    "Persistent privileged cyber access",
    "Military transport priority",
    "No mass reserve activation",
    "No mass ammunition distribution",
    "No nationwide economic preparation",
    "Amphibious force inactive",
    "Continued diplomacy",
    "Manufactured atrocity narrative",
    "Planted invasion document",
    "Force size supports limited incursion"
  ];

  const warningIndicators = {
    "Early Warning": [
      "Defense-production expansion",
      "Strategic fuel reserve adjustments",
      "Protection/atrocity narrative construction",
      "Long-term infrastructure reconnaissance",
      "Expanded procurement of field sustainment supplies"
    ],
    "Operational Warning": [
      "Large live-ammunition distribution",
      "Reserve activation",
      "Expanded wartime medical capacity",
      "Wartime command transition",
      "Operational air dispersal",
      "Expanded rail and heavy-transport requisition"
    ],
    "Confirmation": [
      "Destructive cyber payload activation",
      "Border-crossing assault formations moving forward",
      "Artillery firing positions occupied with combat loads",
      "Diplomatic evacuation combined with force movement",
      "Air-defense and aviation systems transition to wartime posture"
    ]
  };

  const timelineEvents = [
    { period: "Six months ago", title: "Relations deteriorate", family: "Political", text: "Norland intensifies claims that ethnic Norlanders in Estavia face discrimination." },
    { period: "Four months ago", title: "Defense-production increase begins", family: "Industrial", text: "Ammunition and defense-component production begins rising well before the immediate crisis." },
    { period: "Two months ago", title: "Procurement and financial preparation expand", family: "OSINT / FININT", text: "Field sustainment procurement, military fuel spending, transportation contracting, and defense funding accelerate." },
    { period: "Six weeks ago", title: "Western staging areas begin expanding", family: "GEOINT", text: "Temporary encampments, staging fields, fuel storage, and rail unloading areas expand beyond historical baseline." },
    { period: "Thirty days ago", title: "Crisis enters accelerated phase", family: "All-source", text: "Military deployments, cyber activity, propaganda, transportation priority, and diplomatic coercion intensify." },
    { period: "Ten days ago", title: "Rail network increasingly militarized", family: "Transportation", text: "Passenger services are cancelled, heavy equipment moves west, and military freight receives priority." },
    { period: "Five days ago", title: "Western Theater traffic rises 37%", family: "SIGINT", text: "Command relationships centralize and forward formations transition to 24-hour communications watch." },
    { period: "Previous evening", title: "FALCON-17 reports 30-day sustainment", family: "HUMINT", text: "Western formations receive sustainment requirements exceeding the public seven-day exercise plan." },
    { period: "Hours before briefing", title: "Fabricated atrocity narrative amplified", family: "Information Operations", text: "A manipulated massacre narrative is rapidly promoted by state-linked actors and Norland television." },
    { period: "06:41", title: "Planted invasion plan attributed to deception directorate", family: "Counterintelligence", text: "DOMEX identifies the authoring system behind the leaked offensive spreadsheet." },
    { period: "08:00", title: "Presidential Defense Council", family: "Decision", text: "The intelligence assessment must support national-level decision-making under uncertainty." }
  ];

  const defaultState = {
    reviewed: {},
    evidenceClass: {},
    reportNotes: {},
    probabilities: { H1: 40, H2: 30, H3: 15, H4: 15 },
    assessmentHistory: [],
    ach: {},
    indicators: {},
    scratchpad: "",
    brief: {
      assessment: "",
      why: "",
      confidence: "Moderate",
      alternative: "",
      unknowns: "",
      change: ""
    },
    questionResponses: {},
    sourceMatrix: {},
    gaps: [
      {
        id: "gap-1",
        title: "Senior leadership authorization for offensive operations",
        priority: "Critical",
        pir: "Has President Korr or the National Security Council authorized military action against Estavia?",
        sir: "Identify direct or strongly corroborated evidence of an execute order, conditional authorization, or explicit prohibition.",
        int: "HUMINT / SIGINT",
        source: "Senior leadership access, command communications, trusted liaison with independent provenance",
        indicator: "Execute order, conditional authorization, or explicit direction restricting use of force",
        risk: "Very high access and counterintelligence risk",
        deception: "Very high",
        impact: "Could sharply shift probability between coercion-only, limited operation, and invasion hypotheses."
      },
      {
        id: "gap-2",
        title: "Scale of live-ammunition distribution",
        priority: "High",
        pir: "Is Norland distributing combat loads beyond exercise norms?",
        sir: "Determine ammunition quantities, destinations, unit issue rates, and comparison with historical exercises.",
        int: "GEOINT / HUMINT / Logistics Intelligence",
        source: "Ammunition depots, transport nodes, logistics reporting",
        indicator: "Sustained large-scale issue to maneuver, artillery, and air-defense formations",
        risk: "Moderate",
        deception: "Moderate",
        impact: "Large-scale distribution would materially increase H3; continued absence would constrain it."
      }
    ],
    finalAssessment: {
      principal: "",
      support: "",
      alternative: "",
      gap: "",
      warning: "",
      falsification: "",
      implications: ""
    }
  };

  let state = loadState();
  let clockSeconds = 3 * 3600 + 20 * 60;
  let clockTimer = null;

  const qs = (selector, context = root) => context.querySelector(selector);
  const qsa = (selector, context = root) => [...context.querySelectorAll(selector)];

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(defaultState);
      const saved = JSON.parse(raw);
      const merged = structuredClone(defaultState);
      Object.assign(merged, saved);
      merged.probabilities = { ...defaultState.probabilities, ...(saved.probabilities || {}) };
      merged.brief = { ...defaultState.brief, ...(saved.brief || {}) };
      merged.finalAssessment = { ...defaultState.finalAssessment, ...(saved.finalAssessment || {}) };
      merged.questionResponses = saved.questionResponses || {};
      merged.sourceMatrix = saved.sourceMatrix || {};
      merged.gaps = Array.isArray(saved.gaps) ? saved.gaps : structuredClone(defaultState.gaps);
      return merged;
    } catch {
      return structuredClone(defaultState);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      toast("Browser storage is unavailable. Export your work before leaving this page.");
    }
    updateStatus();
    if (window.GlassMeridianV4 && typeof window.GlassMeridianV4.refresh === "function") window.GlassMeridianV4.refresh();
  }

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function toast(message) {
    const el = qs("#gm-toast");
    el.textContent = message;
    el.classList.add("is-visible");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove("is-visible"), 2200);
  }

  function pct(value, total) {
    return total ? Math.round((value / total) * 100) : 0;
  }

  function answeredQuestionCount() {
    return Object.values(state.questionResponses || {}).filter(v => String(v || "").trim().length >= 25).length;
  }

  function assignmentQuestionTotal() {
    return 16;
  }

  function classifiedCount() {
    return Object.keys(state.evidenceClass || {}).filter(k => state.evidenceClass[k]).length;
  }

  function reviewedCount() {
    return Object.values(state.reviewed || {}).filter(Boolean).length;
  }

  function briefingReadinessScore() {
    let score = 0;
    score += Math.min(20, pct(reviewedCount(), reports.length) * .20);
    score += Math.min(15, pct(classifiedCount(), reports.length) * .15);
    score += Math.min(15, pct(answeredQuestionCount(), assignmentQuestionTotal()) * .15);
    const total = hypotheses.reduce((sum, h) => sum + Number(state.probabilities[h.id] || 0), 0);
    if (total === 100 && state.assessmentHistory.length) score += 15;
    const achEntries = Object.values(state.ach || {}).filter(v => v && v !== "—").length;
    if (achEntries >= 30) score += 10;
    const highGaps = (state.gaps || []).filter(g => ["Critical","High"].includes(g.priority)).length;
    if (highGaps >= 2) score += 10;
    const observedIndicators = Object.values(state.indicators || {}).filter(Boolean).length;
    if (observedIndicators >= 3) score += 5;
    const briefWords = Object.values(state.brief || {}).join(" ").trim().split(/\s+/).filter(Boolean).length;
    if (briefWords >= 60 && briefWords <= 500) score += 5;
    const finalWords = Object.values(state.finalAssessment || {}).join(" ").trim().split(/\s+/).filter(Boolean).length;
    if (finalWords >= 80) score += 5;
    return Math.round(Math.min(100, score));
  }

  function sourceKey(reportId, field) {
    return `${reportId}:${field}`;
  }

  function inferDefaultSourceValue(report, field) {
    if (field === "reliability") return report.reliability || "Unknown";
    if (field === "access") {
      if (report.family === "HUMINT") return "Mixed / source-dependent";
      if (["GEOINT/IMINT","MASINT","FININT/Economic/Energy","TECHINT","Military/ORBAT"].includes(report.family)) return "Direct technical observation";
      return "Indirect";
    }
    if (field === "corroboration") {
      if ([3,5,9,13,15,21,24,29,30].includes(report.id)) return "Strong";
      if ([7,12,18].includes(report.id)) return "Weak / compromised";
      return "Moderate";
    }
    if (field === "lineage") {
      if (report.id === 18) return "Circular / related";
      if (report.id === 12) return "Unknown";
      return "Independent / no known issue";
    }
    if (field === "timeliness") {
      if ([19,25].includes(report.id)) return "Older / strategic";
      return "Current";
    }
    return "";
  }

  function renderFamilies() {
    const families = [...new Set(reports.map(r => r.family))].sort();
    const select = qs("#gm-family-filter");
    families.forEach(family => {
      const option = document.createElement("option");
      option.value = family;
      option.textContent = family;
      select.appendChild(option);
    });
  }

  function renderReports() {
    const search = qs("#gm-search").value.trim().toLowerCase();
    const family = qs("#gm-family-filter").value;
    const effect = qs("#gm-effect-filter").value;
    const grid = qs("#gm-report-grid");

    const filtered = reports.filter(report => {
      const haystack = `${report.title} ${report.summary} ${report.family} ${report.source} ${report.evidence.join(" ")}`.toLowerCase();
      const matchesSearch = !search || haystack.includes(search);
      const matchesFamily = family === "all" || report.family === family;
      const matchesEffect = effect === "all" || report.effect === effect;
      return matchesSearch && matchesFamily && matchesEffect;
    });

    grid.innerHTML = filtered.map(report => `
      <article class="gm-report-card ${state.reviewed[report.id] ? "is-reviewed" : ""}">
        <div class="gm-card-top">
          <span class="gm-file-number">FILE ${String(report.id).padStart(2, "0")}</span>
          <span class="gm-chip">${escapeHtml(report.family)}</span>
        </div>
        <h4>${escapeHtml(report.title)}</h4>
        <p>${escapeHtml(report.summary)}</p>
        <div class="gm-chip-row">
          <span class="gm-chip ${report.diagnostic.includes("Very") || report.diagnostic === "High" ? "gm-strong" : ""}">Diagnostic: ${escapeHtml(report.diagnostic)}</span>
          <span class="gm-chip ${report.deception === "Very high" || report.deception === "Certain" ? "gm-danger" : ""}">Deception: ${escapeHtml(report.deception)}</span>
        </div>
        <div class="gm-card-footer">
          <span class="gm-chip">${state.evidenceClass[report.id] ? escapeHtml(state.evidenceClass[report.id]) : "Unclassified"}</span>
          <button class="gm-btn gm-open-report" type="button" data-report-id="${report.id}">Open Intelligence File</button>
        </div>
      </article>
    `).join("");

    if (!filtered.length) {
      grid.innerHTML = `<div class="gm-panel"><p>No intelligence files match the current filters.</p></div>`;
    }
  }

  function openReport(id) {
    const report = reports.find(r => r.id === Number(id));
    if (!report) return;

    const modal = qs("#gm-report-modal");
    const content = qs("#gm-modal-content");
    const currentClass = state.evidenceClass[report.id] || "Uncertain";
    const reportNote = state.reportNotes[report.id] || "";

    content.innerHTML = `
      <header class="gm-modal-header">
        <span class="gm-label">Intelligence File ${String(report.id).padStart(2, "0")} · ${escapeHtml(report.family)}</span>
        <h3 id="gm-modal-title">${escapeHtml(report.title)}</h3>
        <p class="gm-modal-summary">${escapeHtml(report.summary)}</p>
      </header>

      <div class="gm-chip-row">
        <span class="gm-chip">Source: ${escapeHtml(report.source)}</span>
        <span class="gm-chip">Reliability: ${escapeHtml(report.reliability)}</span>
        <span class="gm-chip">Primary effect: ${escapeHtml(report.effect)}</span>
      </div>

      <h4>Key Evidence</h4>
      <ul class="gm-evidence-list">
        ${report.evidence.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>

      <div class="gm-analyst-note"><strong>Senior Analyst Note:</strong><br>${escapeHtml(report.note)}</div>

      <div class="gm-modal-grid">
        <label class="gm-modal-field">
          <span>Evidence classification</span>
          <select id="gm-modal-classification">
            ${["Known","Assessed","Assumed","Uncertain","Unknown / Unknowable"].map(v => `<option ${v === currentClass ? "selected" : ""}>${v}</option>`).join("")}
          </select>
        </label>
        <label class="gm-modal-field">
          <span>Diagnostic value</span>
          <input value="${escapeHtml(report.diagnostic)}" disabled>
        </label>
      </div>

      <label class="gm-modal-field" style="margin-top:1rem">
        <span>Your analytic note</span>
        <textarea id="gm-modal-note" rows="6" placeholder="Why does this matter? What does it contradict? Could it be manipulated?">${escapeHtml(reportNote)}</textarea>
      </label>

      <div class="gm-modal-actions">
        <button class="gm-btn gm-btn-primary" id="gm-save-report" type="button" data-report-id="${report.id}">Save Evaluation</button>
        <button class="gm-btn" id="gm-mark-reviewed" type="button" data-report-id="${report.id}">
          ${state.reviewed[report.id] ? "Mark Unreviewed" : "Mark Reviewed"}
        </button>
      </div>
    `;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    const modal = qs("#gm-report-modal");
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function renderMiniHypotheses() {
    const wrap = qs("#gm-mini-hypotheses");
    wrap.innerHTML = hypotheses.map(h => {
      const value = Number(state.probabilities[h.id] || 0);
      return `
        <div class="gm-mini-hypothesis">
          <div class="gm-mini-hypothesis-row"><span>${h.id} · ${escapeHtml(h.short)}</span><strong>${value}%</strong></div>
          <div class="gm-meter"><span style="width:${Math.max(0, Math.min(100, value))}%"></span></div>
        </div>`;
    }).join("");
  }

  function renderHypothesisEditor() {
    const wrap = qs("#gm-hypothesis-editor");
    wrap.innerHTML = hypotheses.map(h => `
      <article class="gm-hypothesis-card">
        <h4>${h.id} — ${escapeHtml(h.title)}</h4>
        <p>${escapeHtml(h.text)}</p>
        <div class="gm-range-row">
          <input type="range" min="0" max="100" step="1" value="${state.probabilities[h.id]}" data-prob="${h.id}" aria-label="${h.id} probability">
          <div class="gm-range-value"><span data-prob-value="${h.id}">${state.probabilities[h.id]}</span>%</div>
        </div>
      </article>
    `).join("");
    renderHistory();
    updateProbabilityTotal();
  }

  function updateProbabilityTotal() {
    const total = hypotheses.reduce((sum, h) => sum + Number(state.probabilities[h.id] || 0), 0);
    qs("#gm-prob-total").textContent = total;
    qs(".gm-total-row").classList.toggle("is-invalid", total !== 100);
    renderMiniHypotheses();
  }

  function renderHistory() {
    const wrap = qs("#gm-assessment-history");
    if (!state.assessmentHistory.length) {
      wrap.innerHTML = `<div class="gm-history-item">No assessment checkpoints locked yet.</div>`;
      return;
    }
    wrap.innerHTML = [...state.assessmentHistory].reverse().map(item => `
      <div class="gm-history-item">
        <strong>${escapeHtml(item.time)}</strong> ·
        H1 ${item.probabilities.H1}% · H2 ${item.probabilities.H2}% ·
        H3 ${item.probabilities.H3}% · H4 ${item.probabilities.H4}%
      </div>
    `).join("");
  }

  function renderAch() {
    const body = qs("#gm-ach-body");
    const options = ["—", "Consistent", "Strongly consistent", "Inconsistent", "Strongly inconsistent", "Not diagnostic"];
    body.innerHTML = achEvidence.map((evidence, rowIndex) => `
      <tr>
        <td><strong>${escapeHtml(evidence)}</strong></td>
        ${hypotheses.map(h => {
          const key = `${rowIndex}:${h.id}`;
          const selected = state.ach[key] || "—";
          return `<td><select data-ach="${key}" aria-label="${escapeHtml(evidence)} ${h.id}">
            ${options.map(o => `<option ${o === selected ? "selected" : ""}>${o}</option>`).join("")}
          </select></td>`;
        }).join("")}
      </tr>
    `).join("");
  }

  function renderWarnings() {
    const board = qs("#gm-warning-board");
    board.innerHTML = Object.entries(warningIndicators).map(([group, indicators]) => `
      <article class="gm-warning-group">
        <h4>${escapeHtml(group)}</h4>
        ${indicators.map((indicator, index) => {
          const key = `${group}:${index}`;
          return `
            <label class="gm-warning-item">
              <input type="checkbox" data-indicator="${escapeHtml(key)}" ${state.indicators[key] ? "checked" : ""}>
              <span>${escapeHtml(indicator)}</span>
            </label>`;
        }).join("")}
      </article>
    `).join("");
  }

  function renderDashboard() {
    const reviewed = reviewedCount();
    const classified = classifiedCount();
    const qPct = pct(answeredQuestionCount(), assignmentQuestionTotal());
    const readiness = briefingReadinessScore();

    const setText = (id, text) => { const el = qs(id); if (el) el.textContent = text; };
    const setWidth = (id, value) => { const el = qs(id); if (el) el.style.width = `${Math.max(0, Math.min(100, value))}%`; };

    setText("#gm-kpi-reviewed", `${reviewed} / ${reports.length}`);
    setText("#gm-kpi-classified", `${classified} / ${reports.length}`);
    setText("#gm-kpi-questions", `${qPct}%`);
    setText("#gm-kpi-readiness", `${readiness} / 100`);
    setWidth("#gm-kpi-reviewed-bar", pct(reviewed, reports.length));
    setWidth("#gm-kpi-classified-bar", pct(classified, reports.length));
    setWidth("#gm-kpi-questions-bar", qPct);
    setWidth("#gm-kpi-readiness-bar", readiness);

    const dashHyp = qs("#gm-dashboard-hypotheses");
    if (dashHyp) {
      dashHyp.innerHTML = [...hypotheses]
        .sort((a,b) => Number(state.probabilities[b.id]) - Number(state.probabilities[a.id]))
        .map(h => `
          <div class="gm-mini-hypothesis">
            <div class="gm-mini-hypothesis-row"><span>${h.id} · ${escapeHtml(h.short)}</span><strong>${state.probabilities[h.id]}%</strong></div>
            <div class="gm-meter"><span style="width:${state.probabilities[h.id]}%"></span></div>
          </div>`).join("");
    }

    const health = [
      { done: reviewed >= 24, text: "Review at least 24 of 30 intelligence files" },
      { done: classified >= 20, text: "Classify at least 20 evidence items" },
      { done: Object.values(state.ach || {}).filter(v => v && v !== "—").length >= 30, text: "Populate the ACH matrix with meaningful consistency judgments" },
      { done: state.assessmentHistory.length > 0, text: "Lock at least one probability assessment checkpoint" },
      { done: (state.gaps || []).filter(g => ["Critical","High"].includes(g.priority)).length >= 2, text: "Identify at least two critical/high intelligence gaps" },
      { done: qPct >= 60, text: "Develop substantial responses to most AI-501 analytic questions" },
      { done: Object.values(state.finalAssessment || {}).join("").trim().length > 250, text: "Draft the final finished-intelligence assessment" }
    ];

    const healthList = qs("#gm-health-checklist");
    if (healthList) {
      healthList.innerHTML = health.map(item => `
        <li class="${item.done ? "is-done" : ""}">
          <span class="gm-health-icon">${item.done ? "✓" : "○"}</span>
          <span>${escapeHtml(item.text)}</span>
        </li>`).join("");
    }

    const gapWrap = qs("#gm-dashboard-gaps");
    if (gapWrap) {
      const gaps = [...(state.gaps || [])]
        .sort((a,b) => ["Critical","High","Moderate","Low"].indexOf(a.priority) - ["Critical","High","Moderate","Low"].indexOf(b.priority))
        .slice(0,4);
      gapWrap.innerHTML = gaps.length ? gaps.map(g => `
        <div class="gm-dashboard-gap"><strong>${escapeHtml(g.priority)}:</strong> ${escapeHtml(g.title || g.pir || "Untitled intelligence gap")}</div>
      `).join("") : `<div class="gm-dashboard-gap">No intelligence gaps recorded yet.</div>`;
    }

    const warningWrap = qs("#gm-dashboard-warning");
    if (warningWrap) {
      const observed = [];
      Object.entries(warningIndicators).forEach(([group, indicators]) => {
        indicators.forEach((indicator, index) => {
          if (state.indicators[`${group}:${index}`]) observed.push({group, indicator});
        });
      });
      warningWrap.innerHTML = observed.length ? observed.slice(0,8).map(o => `
        <div class="gm-warning-pill"><strong>${escapeHtml(o.group)}:</strong> ${escapeHtml(o.indicator)}</div>
      `).join("") : `<div class="gm-warning-pill">No warning indicators marked as observed.</div>`;
    }
  }

  function renderSourceMatrix() {
    const body = qs("#gm-source-body");
    if (!body) return;
    const fields = {
      reliability: ["Unknown","Low","Moderate","High","Historically reliable","High technical confidence"],
      access: ["Unknown","Direct","Indirect","Mixed / source-dependent","Direct technical observation"],
      corroboration: ["None","Weak / compromised","Moderate","Strong"],
      lineage: ["Unknown","Independent / no known issue","Related source","Circular / related"],
      timeliness: ["Current","Recent","Older / strategic","Stale"],
      deception: ["Low","Moderate","High","Very high","Certain"],
      diagnostic: ["Low","Low-Moderate","Moderate","Moderate-High","High","Very high"]
    };

    body.innerHTML = reports.map(report => {
      const getVal = field => state.sourceMatrix[sourceKey(report.id, field)] || inferDefaultSourceValue(report, field) ||
        (field === "deception" ? report.deception : field === "diagnostic" ? report.diagnostic : "");
      const select = (field) => `<select data-source="${report.id}:${field}">${
        fields[field].map(v => `<option ${v === getVal(field) ? "selected" : ""}>${escapeHtml(v)}</option>`).join("")
      }</select>`;
      return `<tr>
        <td><button class="gm-btn gm-source-open" type="button" data-source-report="${report.id}">File ${String(report.id).padStart(2,"0")}</button></td>
        <td>${escapeHtml(report.family)}</td>
        <td>${select("reliability")}</td>
        <td>${select("access")}</td>
        <td>${select("corroboration")}</td>
        <td>${select("lineage")}</td>
        <td>${select("timeliness")}</td>
        <td>${select("deception")}</td>
        <td>${select("diagnostic")}</td>
      </tr>`;
    }).join("");
  }

  function renderTimeline() {
    const wrap = qs("#gm-timeline-list");
    if (!wrap) return;
    wrap.innerHTML = timelineEvents.map(event => `
      <div class="gm-timeline-item">
        <span class="gm-timeline-dot"></span>
        <article class="gm-timeline-card">
          <span class="gm-label">${escapeHtml(event.period)} · ${escapeHtml(event.family)}</span>
          <h4>${escapeHtml(event.title)}</h4>
          <p>${escapeHtml(event.text)}</p>
        </article>
      </div>`).join("");
  }

  function gapTemplate(gap, index) {
    const priorities = ["Critical","High","Moderate","Low"];
    const ints = ["HUMINT","SIGINT","GEOINT/IMINT","MASINT","OSINT/SOCMINT","CYBINT/DNINT","FININT/Economic/Energy","TECHINT","Military/ORBAT","Diplomatic/Political","MEDINT/Logistics","Multi-INT"];
    return `
      <article class="gm-gap-card" data-gap-card="${escapeHtml(gap.id)}">
        <div class="gm-gap-head">
          <div>
            <span class="gm-label">Collection Priority ${index + 1}</span>
            <strong>${escapeHtml(gap.title || "Untitled intelligence gap")}</strong>
          </div>
          <button class="gm-btn" type="button" data-delete-gap="${escapeHtml(gap.id)}">Remove</button>
        </div>
        <div class="gm-gap-fields">
          <label class="gm-gap-span-2"><span>Gap title</span><input data-gap-field="title" value="${escapeHtml(gap.title || "")}"></label>
          <label><span>Priority</span><select data-gap-field="priority">${
            priorities.map(p => `<option ${p === gap.priority ? "selected" : ""}>${p}</option>`).join("")
          }</select></label>

          <label class="gm-gap-span-3"><span>Priority Intelligence Requirement</span><textarea rows="3" data-gap-field="pir">${escapeHtml(gap.pir || "")}</textarea></label>
          <label class="gm-gap-span-3"><span>Specific Information Requirement</span><textarea rows="3" data-gap-field="sir">${escapeHtml(gap.sir || "")}</textarea></label>

          <label><span>Primary INT</span><select data-gap-field="int">${
            ints.map(i => `<option ${i === gap.int ? "selected" : ""}>${i}</option>`).join("")
          }</select></label>
          <label class="gm-gap-span-2"><span>Potential collection source</span><input data-gap-field="source" value="${escapeHtml(gap.source || "")}"></label>

          <label class="gm-gap-span-3"><span>Expected indicator</span><textarea rows="3" data-gap-field="indicator">${escapeHtml(gap.indicator || "")}</textarea></label>
          <label><span>Collection risk</span><input data-gap-field="risk" value="${escapeHtml(gap.risk || "")}"></label>
          <label><span>Deception risk</span><input data-gap-field="deception" value="${escapeHtml(gap.deception || "")}"></label>
          <label><span>Decision impact</span><textarea rows="3" data-gap-field="impact">${escapeHtml(gap.impact || "")}</textarea></label>
        </div>
      </article>`;
  }

  function renderGaps() {
    const wrap = qs("#gm-gap-list");
    if (!wrap) return;
    wrap.innerHTML = (state.gaps || []).map(gapTemplate).join("") ||
      `<div class="gm-panel"><p>No intelligence gaps recorded. Add one to begin collection planning.</p></div>`;
  }

  function renderQuestionResponses() {
    qsa("[data-question-response]").forEach(field => {
      field.value = state.questionResponses[field.dataset.questionResponse] || "";
    });
    updateAssignmentProgress();
  }

  function updateAssignmentProgress() {
    const done = answeredQuestionCount();
    const total = assignmentQuestionTotal();
    const percent = pct(done, total);
    const text = qs("#gm-assignment-completion-text");
    const bar = qs("#gm-assignment-completion-bar");
    if (text) text.textContent = `${percent}% complete · ${done}/${total} substantial responses`;
    if (bar) bar.style.width = `${percent}%`;
  }

  function renderFinalAssessment() {
    qsa("[data-final]").forEach(field => {
      field.value = state.finalAssessment[field.dataset.final] || "";
    });
  }

  function buildFinalAssessmentText() {
    return [
      `PRINCIPAL JUDGMENT\n${state.finalAssessment.principal || ""}`,
      `SUPPORTING JUDGMENTS\n${state.finalAssessment.support || ""}`,
      `STRONGEST ALTERNATIVE\n${state.finalAssessment.alternative || ""}`,
      `MOST IMPORTANT INTELLIGENCE GAP\n${state.finalAssessment.gap || ""}`,
      `WARNING INDICATORS\n${state.finalAssessment.warning || ""}`,
      `FALSIFICATION CONDITIONS\n${state.finalAssessment.falsification || ""}`,
      `IMPLICATIONS FOR POLICYMAKERS\n${state.finalAssessment.implications || ""}`
    ].join("\\n\\n");
  }

  function exportWork() {
    const exportPayload = {
      project: "Operation Glass Meridian",
      version: 3,
      exportedAt: new Date().toISOString(),
      state
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `operation-glass-meridian-analysis-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast("Analysis workspace exported as JSON.");
  }

  function updateStatus() {
    const reviewed = reviewedCount();
    const classified = classifiedCount();
    const questionPct = pct(answeredQuestionCount(), assignmentQuestionTotal());
    const gapCount = (state.gaps || []).filter(g => ["Critical","High"].includes(g.priority)).length;
    const readiness = briefingReadinessScore();

    const set = (selector, value) => { const el = qs(selector); if (el) el.textContent = value; };
    set("#gm-reviewed-count", reviewed);
    set("#gm-classified-count", classified);
    set("#gm-question-progress", `${questionPct}%`);
    set("#gm-gap-count", gapCount);
    set("#gm-confidence", state.brief.confidence || "Moderate");
    set("#gm-readiness-score", readiness);
    renderDashboard();
  }

  function showView(name) {
    const target = qs(`[data-gm-view-panel="${name}"]`);
    if (!target) return;
    qsa("[data-gm-view-panel]").forEach(panel => {
      const active = panel === target;
      panel.classList.toggle("is-active", active);
      panel.setAttribute("aria-hidden", active ? "false" : "true");
    });
    qsa("[data-gm-view]").forEach(btn => {
      const active = btn.dataset.gmView === name;
      btn.classList.toggle("gm-btn-primary", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
    target.setAttribute("tabindex", "-1");
  }

  function renderBrief() {
    qsa("[data-brief]").forEach(field => {
      const key = field.dataset.brief;
      field.value = state.brief[key] || "";
    });
    updateWordCount();
  }

  function updateWordCount() {
    const fields = qsa("[data-brief]").filter(el => el.tagName === "TEXTAREA");
    const words = fields.map(el => el.value.trim()).join(" ").trim().split(/\s+/).filter(Boolean).length;
    const label = qs("#gm-word-count");
    label.textContent = `${words} / 500 words`;
    label.classList.toggle("is-over", words > 500);
  }

  function buildBriefText() {
    return [
      `WHAT WE ASSESS\n${state.brief.assessment}`,
      `WHY\n${state.brief.why}`,
      `CONFIDENCE\n${state.brief.confidence}`,
      `STRONGEST ALTERNATIVE\n${state.brief.alternative}`,
      `WHAT WE DO NOT KNOW\n${state.brief.unknowns}`,
      `WHAT WOULD CHANGE THE JUDGMENT\n${state.brief.change}`
    ].join("\n\n");
  }

  function updateClock() {
    const h = Math.floor(clockSeconds / 3600);
    const m = Math.floor((clockSeconds % 3600) / 60);
    const s = clockSeconds % 60;
    qs("#gm-clock").textContent = [h,m,s].map(v => String(v).padStart(2,"0")).join(":");
    if (clockSeconds <= 0 && clockTimer) {
      clearInterval(clockTimer);
      clockTimer = null;
      qs("#gm-toggle-clock").textContent = "Simulation Complete";
      toast("The 08:00 presidential briefing has begun.");
    }
  }

  function toggleClock() {
    const button = qs("#gm-toggle-clock");
    if (clockTimer) {
      clearInterval(clockTimer);
      clockTimer = null;
      button.textContent = "Resume Simulation Clock";
      return;
    }
    if (clockSeconds <= 0) return;
    button.textContent = "Pause Simulation Clock";
    clockTimer = setInterval(() => {
      clockSeconds--;
      updateClock();
    }, 1000);
  }

  root.addEventListener("click", event => {
    const viewButton = event.target.closest("[data-gm-view]");
    if (viewButton) {
      showView(viewButton.dataset.gmView);
      if (viewButton.closest(".gm-welcome")) {
        qs(".gm-shell").scrollIntoView({ block: "start", behavior: "smooth" });
      }
    }

    const reportButton = event.target.closest("[data-report-id].gm-open-report");
    if (reportButton) openReport(reportButton.dataset.reportId);

    if (event.target.closest("[data-gm-close-modal]")) closeModal();

    const sourceOpen = event.target.closest("[data-source-report]");
    if (sourceOpen) openReport(sourceOpen.dataset.sourceReport);

    const deleteGap = event.target.closest("[data-delete-gap]");
    if (deleteGap) {
      state.gaps = (state.gaps || []).filter(g => g.id !== deleteGap.dataset.deleteGap);
      saveState();
      renderGaps();
      toast("Intelligence gap removed.");
    }

    const saveButton = event.target.closest("#gm-save-report");
    if (saveButton) {
      const id = saveButton.dataset.reportId;
      state.evidenceClass[id] = qs("#gm-modal-classification").value;
      state.reportNotes[id] = qs("#gm-modal-note").value;
      saveState();
      renderReports();
      toast(`Intelligence File ${String(id).padStart(2,"0")} evaluation saved.`);
    }

    const reviewedButton = event.target.closest("#gm-mark-reviewed");
    if (reviewedButton) {
      const id = reviewedButton.dataset.reportId;
      state.reviewed[id] = !state.reviewed[id];
      saveState();
      renderReports();
      openReport(id);
    }
  });

  qs("#gm-search").addEventListener("input", renderReports);
  qs("#gm-family-filter").addEventListener("change", renderReports);
  qs("#gm-effect-filter").addEventListener("change", renderReports);

  qs("#gm-scratchpad").value = state.scratchpad || "";
  qs("#gm-scratchpad").addEventListener("input", event => {
    state.scratchpad = event.target.value;
    saveState();
  });

  root.addEventListener("input", event => {
    if (event.target.matches("[data-prob]")) {
      const id = event.target.dataset.prob;
      state.probabilities[id] = Number(event.target.value);
      const label = qs(`[data-prob-value="${id}"]`);
      if (label) label.textContent = event.target.value;
      saveState();
      updateProbabilityTotal();
    }

    if (event.target.matches("[data-brief]")) {
      const key = event.target.dataset.brief;
      state.brief[key] = event.target.value;
      saveState();
      updateWordCount();
    }

    if (event.target.matches("[data-question-response]")) {
      state.questionResponses[event.target.dataset.questionResponse] = event.target.value;
      saveState();
      updateAssignmentProgress();
    }

    if (event.target.matches("[data-final]")) {
      state.finalAssessment[event.target.dataset.final] = event.target.value;
      saveState();
    }

    if (event.target.matches("[data-gap-field]")) {
      const card = event.target.closest("[data-gap-card]");
      if (card) {
        const gap = (state.gaps || []).find(g => g.id === card.dataset.gapCard);
        if (gap) {
          gap[event.target.dataset.gapField] = event.target.value;
          saveState();
          if (event.target.dataset.gapField === "title" || event.target.dataset.gapField === "priority") renderDashboard();
        }
      }
    }
  });

  root.addEventListener("change", event => {
    if (event.target.matches("[data-ach]")) {
      state.ach[event.target.dataset.ach] = event.target.value;
      saveState();
    }
    if (event.target.matches("[data-indicator]")) {
      state.indicators[event.target.dataset.indicator] = event.target.checked;
      saveState();
    }
    if (event.target.matches("[data-source]")) {
      state.sourceMatrix[event.target.dataset.source] = event.target.value;
      saveState();
    }
    if (event.target.matches("[data-gap-field]")) {
      const card = event.target.closest("[data-gap-card]");
      if (card) {
        const gap = (state.gaps || []).find(g => g.id === card.dataset.gapCard);
        if (gap) {
          gap[event.target.dataset.gapField] = event.target.value;
          saveState();
          renderDashboard();
        }
      }
    }
  });

  qs("#gm-lock-assessment").addEventListener("click", () => {
    const total = hypotheses.reduce((sum, h) => sum + Number(state.probabilities[h.id] || 0), 0);
    if (total !== 100) {
      toast("Probabilities must total exactly 100%.");
      return;
    }
    state.assessmentHistory.push({
      time: new Date().toLocaleString(),
      probabilities: { ...state.probabilities }
    });
    saveState();
    renderHistory();
    toast("Assessment checkpoint locked.");
  });

  qs("#gm-copy-brief").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(buildBriefText());
      toast("Executive brief copied.");
    } catch {
      toast("Clipboard access was blocked by the browser.");
    }
  });

  qs("#gm-toggle-clock").addEventListener("click", toggleClock);

  const addGapButton = qs("#gm-add-gap");
  if (addGapButton) addGapButton.addEventListener("click", () => {
    const id = `gap-${Date.now()}`;
    state.gaps.push({
      id,
      title: "New intelligence gap",
      priority: "High",
      pir: "",
      sir: "",
      int: "Multi-INT",
      source: "",
      indicator: "",
      risk: "",
      deception: "",
      impact: ""
    });
    saveState();
    renderGaps();
    toast("New collection requirement added.");
  });

  const exportButton = qs("#gm-export");
  if (exportButton) exportButton.addEventListener("click", exportWork);

  const copyFinal = qs("#gm-copy-final");
  if (copyFinal) copyFinal.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(buildFinalAssessmentText());
      toast("Final assessment copied.");
    } catch {
      toast("Clipboard access was blocked by the browser.");
    }
  });

  const fillFromBrief = qs("#gm-fill-from-brief");
  if (fillFromBrief) fillFromBrief.addEventListener("click", () => {
    state.finalAssessment.principal = state.brief.assessment || state.finalAssessment.principal;
    state.finalAssessment.support = state.brief.why || state.finalAssessment.support;
    state.finalAssessment.alternative = state.brief.alternative || state.finalAssessment.alternative;
    state.finalAssessment.gap = state.brief.unknowns || state.finalAssessment.gap;
    state.finalAssessment.falsification = state.brief.change || state.finalAssessment.falsification;
    saveState();
    renderFinalAssessment();
    toast("Executive brief copied into the final-assessment builder.");
  });

  qs("#gm-reset").addEventListener("click", () => {
    const confirmed = window.confirm("Reset all Operation Glass Meridian progress saved in this browser?");
    if (!confirmed) return;
    localStorage.removeItem(STORAGE_KEY);
    state = structuredClone(defaultState);
    clockSeconds = 3 * 3600 + 20 * 60;
    if (clockTimer) clearInterval(clockTimer);
    clockTimer = null;
    qs("#gm-toggle-clock").textContent = "Start Simulation Clock";
    qs("#gm-scratchpad").value = "";
    renderAll();
    showView("dashboard");
    toast("Lab reset.");
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeModal();
  });

  function renderAll() {
    renderReports();
    renderMiniHypotheses();
    renderHypothesisEditor();
    renderAch();
    renderWarnings();
    renderBrief();
    renderSourceMatrix();
    renderTimeline();
    renderGaps();
    renderQuestionResponses();
    renderFinalAssessment();
    updateStatus();
    updateClock();
  }

  renderFamilies();
  renderAll();
  showView("dashboard");

  window.GlassMeridianBase = {
    getState: () => state,
    saveState,
    renderAll,
    showView,
    openReport,
    toast,
    reports,
    hypotheses,
    achEvidence,
    warningIndicators
  };
})();
