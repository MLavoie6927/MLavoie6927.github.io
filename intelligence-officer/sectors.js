document.documentElement.classList.remove("no-js");
document.documentElement.classList.add("js");

function wireFieldbookMenu() {
  const menuToggle = document.getElementById("fieldbook-menu-toggle");
  const navigation = document.getElementById("fieldbook-navigation");
  const mobileNavigation = window.matchMedia("(max-width: 850px)");
  if (!menuToggle || !navigation) return;

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

const sourceCatalog = [
  { id: 1, label: "HUMINT · human sources", best: "Intent, firsthand experience, access to local context, and explanations from people positioned near the event.", caution: "Confirm lawful access, consent where applicable, placement, motive, memory, and whether the account is independent." },
  { id: 2, label: "SIGINT · signals", best: "Communications or electronic activity when collected under explicit legal authority; useful for timing, relationships, and technical activity.", caution: "Never treat availability as permission. Verify authority, attribution, completeness, minimization, and alternative explanations." },
  { id: 3, label: "GEOINT · geospatial", best: "Location, movement, terrain, routes, proximity, service areas, and spatial relationships.", caution: "Check resolution, date, geolocation, coverage, and whether the visible pattern supports the claimed cause." },
  { id: 4, label: "IMINT · imagery", best: "Visible physical condition or change over time, including damage, construction, congestion, and equipment presence.", caution: "Confirm capture time, angle, scale, editing history, and what remains outside the frame." },
  { id: 5, label: "MASINT · measurements/signatures", best: "Calibrated physical or technical signatures such as pressure, emissions, vibration, spectrum, chemistry, or other measurable phenomena.", caution: "Verify sensor calibration, baseline, units, collection environment, and nonmalicious causes that produce the same signature." },
  { id: 6, label: "OSINT · open sources", best: "Public statements, records, media, websites, research, and openly available data that establish claims, narratives, and chronology.", caution: "Trace the original source, publication time, edits, recirculation, coordinated amplification, and manipulation." },
  { id: 7, label: "Official statistics", best: "Baselines and trends in output, population, employment, prices, health, education, and service demand.", caution: "Read definitions, denominator, geography, revisions, uncertainty, sampling limits, and reporting lag." },
  { id: 8, label: "Laws and regulations", best: "Legal authority, obligations, restrictions, jurisdiction, standards, and appeal or enforcement mechanisms.", caution: "Distinguish proposal from enacted text; verify effective date, implementing rule, jurisdiction, and later court action." },
  { id: 9, label: "Budgets and audits", best: "Resourced priorities, planned capacity, actual spending, control weaknesses, and program performance.", caution: "Separate appropriation, obligation, and expenditure; note audit period, scope, materiality, and unresolved findings." },
  { id: 10, label: "Public procurement", best: "Requested capability, suppliers, quantities, delivery windows, contract changes, and replacement activity.", caution: "A solicitation is not an award, an award is not delivery, and delivery is not proven operational capability." },
  { id: 11, label: "Corporate filings", best: "Material risks, revenue exposure, facilities, governance, suppliers, customers, debt, and management's formal disclosures.", caution: "Check reporting period, legal threshold, aggregation, incentives, and events that occurred after filing." },
  { id: 12, label: "Trade and customs data", best: "Cross-border flows, commodity concentration, supplier dependence, rerouting, and import or export pressure.", caution: "Check classification codes, units, value versus volume, transshipment, reporting lag, exemptions, and revisions." },
  { id: 13, label: "Shipping and port notices", best: "Vessel schedules, berth restrictions, port throughput, closures, cargo handling, and maritime chokepoints.", caution: "Confirm local coverage, notice validity, cargo relevance, schedule changes, spoofing risk, and inland follow-through." },
  { id: 14, label: "Rail and road operations", best: "Inland routes, closures, terminal conditions, capacity, detours, and ground transportation chokepoints.", caution: "Verify route scope, direction, operating status, vehicle or commodity relevance, and whether the report is current." },
  { id: 15, label: "Aviation notices", best: "Airspace restrictions, airport conditions, flight constraints, cargo access, and time-bounded operating changes.", caution: "Read the validity window, altitude and geography, affected operations, amendments, and cancellation notices." },
  { id: 16, label: "Weather and climate records", best: "Observed exposure, forecast risk, seasonal baseline, event timing, and environmental conditions affecting operations.", caution: "Separate forecast from observation and event from trend; match station, model, geography, and time horizon." },
  { id: 17, label: "Satellite and map products", best: "Land use, infrastructure, route options, visible damage, flood or fire extent, and geographic context.", caution: "Check imagery date, resolution, cloud cover, map currency, classification method, and ground confirmation." },
  { id: 18, label: "Energy and grid reports", best: "Generation, fuel, demand, reserves, outage scope, restoration estimates, and grid constraints.", caution: "Match service area and outage definition; distinguish transmission, distribution, customer, and communications problems." },
  { id: 19, label: "Water and utility reports", best: "Service continuity, pressure, quality, treatment, storage, upstream inputs, and restoration status.", caution: "Check service zone, testing frequency, sample location, notice status, operator confirmation, and reporting delay." },
  { id: 20, label: "Agricultural reports", best: "Crop and livestock condition, acreage, yield estimates, disease, inventories, inputs, and seasonal production pressure.", caution: "Account for season, survey coverage, estimate uncertainty, local variation, revisions, and lag to retail impact." },
  { id: 21, label: "Food safety notices", best: "Recalls, affected products and lots, hazards, facilities, distribution area, and official consumer action.", caution: "Verify lot, date, geography, updates, withdrawal status, and whether absence from a notice proves safety." },
  { id: 22, label: "Public health surveillance", best: "Disease patterns, severity, care pressure, geography, affected groups, and changes over time.", caution: "Test for changes in access, testing, coding, case definition, reporting behavior, denominator, and privacy limits." },
  { id: 23, label: "Clinical and research papers", best: "Mechanisms, methods, effect estimates, uncertainty, emerging findings, and the state of scientific evidence.", caution: "Assess design, sample, controls, effect size, conflicts, peer review, correction history, and independent replication." },
  { id: 24, label: "Patents and standards", best: "Technical direction, interfaces, safety criteria, interoperability, documented methods, and claimed inventions.", caution: "A filing is not fielded capability; distinguish mandatory standard, voluntary guidance, claim scope, and implementation." },
  { id: 25, label: "Cyber advisories and CVEs", best: "Known vulnerabilities, affected products, exploitation reporting, indicators, patches, and mitigations.", caution: "A CVE does not prove local exposure or exploitation; verify asset inventory, configuration, telemetry, and vendor updates." },
  { id: 26, label: "Authorized system telemetry", best: "Direct, time-stamped evidence of local performance, identity, events, transactions, alarms, changes, and incidents.", caution: "Confirm consent or authority, sensor coverage, clock accuracy, retention, parsing, blind spots, integrity, and baseline." },
  { id: 27, label: "Market and price series", best: "Cost pressure, scarcity signals, demand shifts, spreads, volatility, and the timing of market reactions.", caution: "Price is not cause; control for speculation, currency, taxes, quality, location, contract terms, and baseline." },
  { id: 28, label: "Labor and job postings", best: "Skill demand, staffing pressure, wage signals, location needs, hiring intent, and replacement difficulty.", caution: "Remove duplicates and evergreen listings; distinguish posting, funded vacancy, hiring, retention, and time to competence." },
  { id: 29, label: "Local reporting and community accounts", best: "Early impact, lived conditions, local language, access problems, emerging needs, and contradictions in broad statistics.", caution: "Establish firsthand status, time, place, representativeness, safety, motive, and independent verification." },
  { id: 30, label: "Interviews and subject-matter experts", best: "Workflow explanation, specialist judgment, terminology, hidden dependencies, practical constraints, and collection gaps.", caution: "Record role, access, incentives, assumptions, scope, disagreement, and the evidence that can independently test the explanation." }
];

const sectorInvestigations = {
  logistics: {
    decision: "Should the operations lead reroute freight, reserve alternate capacity, reprioritize critical cargo, or wait for the primary route to recover during the next 72 hours?",
    questions: [
      "Which commodity and shipment IDs are affected, and where do planned and actual timestamps first diverge?",
      "Is the binding constraint berth, terminal labor, customs, warehouse intake, equipment, fuel, route access, or downstream demand?",
      "How much usable inventory is already beyond the disrupted handoff, by location and customer priority?",
      "Which alternate route has confirmed capacity, what new risks does it add, and when does the delay exceed the cost of switching?"
    ],
    sources: [[13, "Confirm berth, vessel, and port operating status."], [14, "Test inland chokepoints, closures, and detour capacity."], [15, "Check whether air cargo is a viable time-critical substitute."], [26, "Compare booked, scanned, departed, and received timestamps."], [30, "Explain handoff realities with dispatchers, terminals, and warehouse leads."]],
    gates: [["Act / reroute", "Two direct operational signals show delay beyond the downstream inventory buffer and alternate capacity is confirmed."], ["Collect next", "A general notice exists but shipment-level status is missing; request milestone timestamps and destination inventory cover."], ["Escalate", "Food, medicine, fuel, or public-safety cargo will breach a defined service threshold before normal recovery."]]
  },
  energy: {
    decision: "Should the incident lead isolate equipment, shed load, activate backup generation, stage crews, or maintain normal operations while monitoring?",
    questions: ["Is the loss at generation, transmission, distribution, fuel supply, protection, communications, or customer equipment?", "Which critical loads are affected, how long can backup systems run, and what fuel or maintenance limits apply?", "What restoration estimate is supported by field damage, spare equipment, crew access, and switching options?", "Do alarms, weather, maintenance, and demand support an equipment failure, external damage, operator action, or malicious-event hypothesis?"],
    sources: [[18, "Define outage scope, reserve conditions, and restoration sequence."], [16, "Test weather exposure against asset location and failure time."], [26, "Correlate authorized alarms, breaker states, load, and change records."], [5, "Validate physical signatures such as voltage, frequency, heat, or vibration."], [30, "Interpret protection events and field constraints with qualified operators."]],
    gates: [["Act / protect load", "Critical service is outside tolerance or redundancy has failed; execute the approved continuity or load-priority plan."], ["Collect next", "The outage map shows impact but not cause; obtain field confirmation, protection sequence, and backup-runtime estimates."], ["Escalate", "Cascading risk, life-safety impact, fuel exhaustion, or evidence of deliberate interference exceeds local authority."]]
  },
  telecommunications: {
    decision: "Should the service owner fail over traffic, dispatch repair teams, conserve backup power, notify emergency partners, or monitor a contained degradation?",
    questions: ["Which carrier, service, geography, subscribers, and network layer fail, and what remains reachable through an independent path?", "Did power, fiber, radio access, backhaul, routing, DNS, cloud dependency, congestion, or customer equipment fail first?", "Are emergency calling, dispatch, payment, health, or utility communications impaired, and for how long?", "Which telemetry should differ if this is physical damage, configuration error, route leak, denial of service, or malicious access?"],
    sources: [[26, "Use authorized network, power, routing, and service telemetry for the local timeline."], [2, "Where explicitly lawful, evaluate relevant electronic activity without exceeding collection authority."], [17, "Map towers, fiber routes, hazards, access roads, and affected service areas."], [25, "Check known vulnerabilities only after confirming the affected asset and version."], [30, "Validate architecture and repair constraints with NOC, RF, fiber, and emergency-communications specialists."]],
    gates: [["Act / fail over", "A measured service failure affects priority users and a tested independent path has adequate capacity."], ["Collect next", "Crowdsourced complaints lead the signal; compare carrier telemetry, independent networks, power, and application status."], ["Escalate", "Emergency communications, multi-carrier interconnection, or suspected unauthorized control is affected."]]
  },
  water: {
    decision: "Should the responsible authority isolate a zone, issue or lift an advisory, change treatment, deploy alternate supply, or continue routine operation?",
    questions: ["Is the concern source water, treatment, storage, pressure, distribution, customer plumbing, collection, or wastewater capacity?", "Which zone, facilities, and populations are exposed, and what sample location and time represent them?", "Do laboratory results, pressure history, treatment records, and field inspections agree on the hazard and its extent?", "How long can storage, chemicals, backup power, operators, and alternate supply sustain safe service?"],
    sources: [[19, "Establish the official service zone, notice status, tests, and restoration information."], [26, "Correlate authorized flow, pressure, tank, pump, treatment, and alarm records."], [5, "Use calibrated chemical, biological, pressure, or flow measurements to test the hazard."], [16, "Assess rainfall, drought, flood, temperature, and watershed timing."], [30, "Interpret treatment and distribution evidence with operators, laboratories, engineers, and public health."]],
    gates: [["Act / protect users", "Validated quality or pressure evidence reaches the authority's action threshold; follow the approved public-health and utility protocol."], ["Collect next", "A customer report or sensor alert is unconfirmed; obtain a representative sample, instrument check, and zone comparison."], ["Escalate", "The affected zone includes critical facilities, backup resources are nearing exhaustion, or the condition crosses jurisdictions."]]
  },
  housing: {
    decision: "Should leaders open temporary shelter, target inspections or assistance, accelerate a specific approval, reserve repair capacity, or adjust a longer-term housing plan?",
    questions: ["How many units are physically available, habitable, affordable, accessible, and connected to utilities—not merely listed?", "Which households face displacement, unsafe occupancy, rent burden, insurance loss, or service barriers?", "Is the bottleneck land, zoning, permit review, finance, labor, material, utility connection, inspection, or insurance?", "What can be delivered in 72 hours, 30 days, one year, and five years, and which action shifts each horizon?"],
    sources: [[7, "Set population, vacancy, construction, affordability, and household baselines."], [8, "Confirm zoning, code, tenant protection, inspection, and emergency authority."], [10, "Track contracted shelter, repair, material, and infrastructure capacity."], [27, "Measure rent, financing, insurance, material, and transaction pressure without mistaking price for supply."], [29, "Identify local habitability, access, displacement, and implementation gaps."]],
    gates: [["Act / stabilize", "Verified habitability or displacement risk exceeds available safe units; activate the approved shelter, inspection, or assistance pathway."], ["Collect next", "Headline vacancy or price data hides unit type and condition; request address-level aggregates, inspections, and affected-household counts."], ["Escalate", "Utility, insurance, finance, or permitting constraints make the housing problem cross-sector or longer than local capacity."]]
  },
  food: {
    decision: "Should the supply lead recall or hold product, shift suppliers or routes, protect cold-chain capacity, ration priority inventory, or issue a public update?",
    questions: ["Which product, lot, origin, facility, route, destination, and usable-life window define the problem?", "Is the constraint production, disease, processing, contamination, storage, transport, price, retail access, or a demand spike?", "How many days of safe inventory remain by location and customer group after spoilage and committed orders?", "Which substitution is actually approved, available, nutritionally suitable, and deliverable inside the decision window?"],
    sources: [[20, "Estimate production, input, disease, and seasonal pressure."], [21, "Confirm official recall scope, hazard, lots, geography, and updates."], [16, "Test weather and seasonal exposure at production and transport points."], [13, "Verify maritime movement and port constraints for imported or coastal supply."], [27, "Use price and spread changes as a signal to investigate, not proof of physical shortage."]],
    gates: [["Act / protect supply", "Official safety criteria are met or verified inventory will fall below demand before replenishment; hold, divert, or source under the approved plan."], ["Collect next", "A viral image or isolated price spike leads the claim; obtain lot, location, inventory, shipment, and sales-rate evidence."], ["Escalate", "The issue threatens vulnerable populations, crosses jurisdictions, or links food safety, transport, power, water, and public health."]]
  },
  health: {
    decision: "Should health leaders activate surge capacity, target testing or prevention, redistribute medicine and staff, change public guidance, or continue surveillance?",
    questions: ["What is the case definition, denominator, severity measure, geography, onset window, and comparison baseline?", "Could testing, coding, access, reporting, awareness, or population movement explain the observed increase?", "Which beds, clinicians, laboratories, medicines, oxygen, transport, and infection-control resources are constrained?", "What intervention is supported now, who benefits or could be harmed, and what evidence would trigger expansion or withdrawal?"],
    sources: [[22, "Measure cases, severity, geography, groups, and care pressure with reporting-bias checks."], [23, "Assess mechanism, intervention evidence, effect size, uncertainty, and replication."], [26, "Use authorized clinical, laboratory, pharmacy, staffing, and capacity summaries with privacy controls."], [21, "Test food-product exposure when a cluster could involve contamination."], [30, "Interpret workflow and clinical meaning with epidemiology, care, laboratory, pharmacy, and supply specialists."]],
    gates: [["Act / protect health", "Validated severity, transmission, exposure, or capacity indicators meet the responsible authority's predefined response threshold."], ["Collect next", "A count rises without a stable denominator or case definition; standardize the measure and compare testing, admissions, and severity."], ["Escalate", "Life-safety capacity is threatened, multiple facilities or jurisdictions are involved, or the recommended action requires higher medical or legal authority."]]
  },
  education: {
    decision: "Should an education or workforce leader adjust operations, recruit or retain staff, fund a training pipeline, change entry requirements, or partner for shared capacity?",
    questions: ["Which role or skill is missing, at what proficiency, location, shift, and date—and what work cannot proceed without it?", "Is the gap enrollment, completion, licensing, wages, retention, schedule, childcare, transportation, hiring practice, or time to competence?", "Which learners or workers are excluded or losing outcomes, and what indicator shows the effect?", "Would short-term reassignment, contracted expertise, apprenticeship, curriculum change, or compensation solve the actual constraint?"],
    sources: [[7, "Set enrollment, completion, vacancy, wage, outcome, and demographic baselines."], [28, "Measure requested skills, location, pay, persistent vacancies, and replacement difficulty."], [9, "Compare funded positions and programs with actual spending, staffing, and results."], [29, "Capture barriers experienced by students, families, educators, trainees, and employers."], [30, "Validate proficiency, workflow, licensing, and time-to-competence with practitioners."]],
    gates: [["Act / bridge the gap", "A verified capability shortage has a defined service impact and a funded intervention can change the constraint in time."], ["Collect next", "Job postings imply demand but hiring and attrition are unknown; deduplicate listings and obtain funded-vacancy and retention evidence."], ["Escalate", "The gap depends on licensing, housing, transport, childcare, immigration, or multi-year training beyond one organization's control."]]
  },
  demographics: {
    decision: "Should planners resize services, relocate capacity, target outreach, revise a forecast, or activate support for temporary or displaced populations?",
    questions: ["Which population, geography, period, definition, and denominator produce the claimed change?", "Is movement permanent, seasonal, circular, voluntary, employment-driven, conflict-related, or disaster displacement?", "Which schools, housing, health, transport, language, labor, and public-safety services experience the change first?", "What evidence distinguishes real population change from delayed registration, double counting, survey error, or changed service use?"],
    sources: [[7, "Establish population, age, household, labor, enrollment, and service baselines."], [29, "Identify recent movement and service conditions not yet visible in lagged statistics."], [17, "Compare settlement, shelter, land-use, route, and hazard geography where appropriate."], [22, "Test population-health and service-demand changes without exposing individuals."], [30, "Reconcile definitions and local conditions with demographers, planners, and service providers."]],
    gates: [["Act / resize service", "Multiple independent indicators show a sustained or urgent population change large enough to cross a service-capacity threshold."], ["Collect next", "One administrative count conflicts with census or local evidence; reconcile definitions, coverage, duplicates, and lag."], ["Escalate", "Displacement creates immediate protection needs or crosses housing, health, education, language, and jurisdictional boundaries."]]
  },
  culture: {
    decision: "Should the team revise a translation, change messenger or channel, pause a communication, consult affected communities, or proceed with a culturally tested version?",
    questions: ["What does the original phrase, image, symbol, or action mean to each relevant audience in its historical and local context?", "Which groups, dialects, generations, institutions, or diaspora communities interpret it differently?", "Who is trusted to explain the issue, who is excluded, and who could face harm if the message is wrong?", "What observed behavior—not just online reaction—shows misunderstanding, rejection, acceptance, or manipulation?"],
    sources: [[6, "Trace original-language content, publication history, narratives, and public context."], [29, "Compare lived interpretation across affected local communities."], [30, "Use qualified translators, historians, anthropologists, educators, and regional experts."], [1, "Where authorized and consensual, obtain firsthand context from people with genuine access."], [7, "Test whether broad claims about a population align with representative data."]],
    gates: [["Act / adapt", "Multiple culturally grounded reviewers identify the same material risk and a revised message preserves the required meaning."], ["Collect next", "One translation or spokesperson represents an entire community; seek independent perspectives and test comprehension."], ["Escalate", "The communication could increase discrimination, violence, exclusion, legal exposure, or distrust in life-safety guidance."]]
  },
  influence: {
    decision: "Should the organization correct a false claim, reduce amplification, harden a vulnerable process, protect affected people, or monitor without giving the narrative more reach?",
    questions: ["What exact claim, audience, channel, behavior, and decision are at risk—and is the content false, misleading, authentic but misframed, or merely unpopular?", "Who first published it, which accounts independently originated it, and which are repeating one source?", "What coordination, targeting, incentives, or platform mechanics are observed, and what remains unproven about attribution?", "Which response would reduce measurable harm without creating unnecessary attention, censorship risk, or retaliation against a suspected source?"],
    sources: [[6, "Build provenance, content, timing, and amplification records from public material."], [29, "Measure local interpretation, behavioral effect, and real-world harm."], [30, "Test psychology, language, platform, organizational, and legal explanations."], [1, "Use authorized, protected firsthand accounts to understand intent or effect without coercion."], [26, "Use authorized platform or service analytics to distinguish reach, automation, and actual behavior."]],
    gates: [["Act / reduce harm", "The claim is demonstrably false or manipulative, reaches the relevant audience, and causes a defined safety or operational effect."], ["Collect next", "High engagement is visible but coordination, audience effect, or origin is unclear; preserve provenance and test alternatives."], ["Escalate", "Threats, coercion, stalking, targeted abuse, compromised accounts, or suspected criminal or foreign activity requires the proper authority."]]
  },
  economics: {
    decision: "Should the decision maker adjust a budget, reserve funds, change procurement timing, target relief, revise a forecast, or maintain the current plan?",
    questions: ["Which indicator, population, sector, geography, price basis, and time horizon define the claimed economic change?", "Is the mechanism supply, demand, policy, credit, labor, expectations, market structure, measurement, or a combination?", "Who gains, who pays, and which household, firm, or public service crosses a real affordability or liquidity threshold?", "Which leading indicator would show improvement or deterioration soon enough to change the decision?"],
    sources: [[7, "Set output, employment, wage, inflation, productivity, and population baselines."], [27, "Track prices, spreads, volatility, and market timing while testing non-scarcity causes."], [9, "Compare fiscal plans, actual spending, reserves, controls, and audited performance."], [11, "Assess company-level exposure, financing, concentration, and disclosed dependencies."], [12, "Measure trade flow, commodity concentration, and cross-border transmission."]],
    gates: [["Act / adjust", "Converging current indicators show a material threshold breach and the proposed action has a clear owner, funding source, and review date."], ["Collect next", "A price or headline indicator moves without mechanism or distributional detail; request volume, inventory, income, and affected-group data."], ["Escalate", "Credit, banking, trade, labor, or public-finance effects create systemic exposure beyond the original decision authority."]]
  },
  banking: {
    decision: "Should the institution fail over a payment rail, expand cash or customer support, tighten a targeted fraud control, preserve liquidity, or communicate a temporary service issue?",
    questions: ["Does failure occur at authentication, authorization, merchant acceptance, clearing, settlement, account access, cash logistics, or customer device?", "Which rail, institution, geography, transaction type, and customer group are affected, and are balances safe but temporarily unavailable?", "Is the pattern consistent with outage, fraud control, credential abuse, liquidity pressure, sanctions screening, telecommunications, or misinformation?", "Which workaround is tested, accessible, reversible, and unlikely to create more fraud or exclude vulnerable users?"],
    sources: [[26, "Analyze authorized transaction, availability, identity, fraud, and settlement telemetry."], [27, "Monitor liquidity and market stress as context, not proof of institutional failure."], [9, "Use audits and regulatory financial evidence to test control or resource claims."], [11, "Review material risk, capital, debt, governance, and formal company disclosures."], [30, "Interpret rail, treasury, fraud, telecom, cybersecurity, and customer-service workflows."]],
    gates: [["Act / preserve access", "A measured service or fraud condition crosses the approved threshold and the alternate rail or control is tested."], ["Collect next", "Screenshots or rumors lead the signal; compare multiple merchants, rails, regions, account states, and official service evidence."], ["Escalate", "Liquidity, solvency, sanctions, widespread fraud, or multi-institution settlement risk requires regulator or executive authority."]]
  },
  manufacturing: {
    decision: "Should the plant change schedule, qualify a substitute, reserve inventory, repair or replace tooling, stop shipment, or prioritize critical customers?",
    questions: ["Which material, part number, process step, tool, facility, batch, and customer requirement define the constraint?", "Is the loss capacity, yield, quality, maintenance, energy, labor, logistics, export control, or a hidden lower-tier supplier?", "How much conforming inventory exists at each tier, and which demand is already committed?", "What substitute is technically qualified, contractually accepted, and available inside the recovery window?"],
    sources: [[12, "Measure input and component flows, geographic concentration, and rerouting."], [11, "Identify disclosed facilities, dependencies, risks, financial pressure, and supplier exposure."], [24, "Check material, interface, quality, safety, and qualification requirements."], [26, "Use authorized production, yield, downtime, maintenance, quality, and inventory records."], [28, "Test whether skill shortages or persistent vacancies constrain recovery."]],
    gates: [["Act / recover production", "Conforming inventory will breach a customer threshold and a qualified repair, schedule, or substitution path is available."], ["Collect next", "A supplier announces disruption without part-level effect; map bill of material, tier, inventory, qualification, and lead time."], ["Escalate", "Safety, counterfeit parts, regulatory quality, export control, or multi-tier dependency prevents local resolution."]]
  },
  science: {
    decision: "Should the analyst rely on a finding, commission replication, narrow the claim, fund further study, change practice, or withhold judgment?",
    questions: ["What was measured, against which control or baseline, with what sample, effect size, uncertainty, and missing data?", "Does the method identify correlation, mechanism, causation, prediction, or only an exploratory association?", "Was the result preregistered, peer reviewed, corrected, replicated, and consistent with the wider evidence?", "What decision changes if the effect is real, smaller than reported, limited to one population, or not reproducible?"],
    sources: [[23, "Evaluate primary method, result, uncertainty, limitations, correction, and replication."], [24, "Compare technical methods, standards, claimed novelty, and implementation requirements."], [6, "Trace how the original research changed through press releases, headlines, and reposting."], [30, "Use domain scientists, statisticians, methodologists, laboratory staff, and librarians."], [7, "Test whether the finding aligns with representative population or operational statistics."]],
    gates: [["Act / use cautiously", "The method and effect fit the decision, limitations are acceptable, and independent evidence converges."], ["Collect next", "A preprint or isolated study drives a broad claim; obtain data, method review, related literature, and replication status."], ["Escalate", "The decision is high consequence, the evidence conflicts, or specialist and ethics review is required before use."]]
  },
  technology: {
    decision: "Should the service owner contain access, isolate an asset, fail over, patch, roll back a change, notify stakeholders, or monitor an uncertain event?",
    questions: ["Which tenant, user, host, service, data, dependency, and time window are affected, and what is the verified impact?", "What telemetry should exist under malicious access, software defect, misconfiguration, capacity failure, user error, or third-party outage?", "Was sensitive data accessed, changed, transferred, encrypted, or merely exposed in theory—and what proves each state?", "Which containment or recovery action preserves evidence and service while avoiding a larger operational failure?"],
    sources: [[25, "Identify applicable vulnerabilities and mitigations only after version and exposure validation."], [26, "Correlate authorized identity, endpoint, network, cloud, application, and change telemetry."], [24, "Check protocol, interface, security, interoperability, and implementation requirements."], [6, "Use vendor notices and public reporting for context while tracing the original claim."], [30, "Test architecture and response options with administrators, developers, responders, privacy, and legal specialists."]],
    gates: [["Act / contain", "Direct evidence confirms active unauthorized behavior or a material service risk and the containment step is authorized and reversible."], ["Collect next", "A vulnerability or alert exists without local exploitation evidence; verify asset, configuration, timeline, behavior, and impact."], ["Escalate", "Sensitive data, privileged access, persistence, safety systems, legal notification, or multi-tenant exposure is involved."]]
  },
  engineering: {
    decision: "Should the asset owner restrict use, inspect, repair, reinforce, replace, redesign, or continue operation with monitoring?",
    questions: ["Which requirement, load, tolerance, interface, material, environment, code, and safety factor govern the observed condition?", "How do the as-designed, as-built, as-maintained, as-operated, and as-observed states differ?", "Is the cause design, construction, material, overload, environment, maintenance, unauthorized change, or sensor error?", "What inspection or test can discriminate among causes without increasing danger or destroying critical evidence?"],
    sources: [[24, "Establish applicable specifications, codes, test methods, interfaces, and tolerances."], [10, "Trace contracted materials, suppliers, change orders, delivery, and acceptance."], [26, "Use authorized operating, load, alarm, maintenance, inspection, and sensor history."], [4, "Document visible change with time, scale, orientation, and comparison views."], [5, "Measure vibration, strain, temperature, chemistry, pressure, or other failure signatures."]],
    gates: [["Act / make safe", "A qualified assessment finds the condition outside an approved limit or uncertainty itself creates unacceptable safety risk."], ["Collect next", "A photo or single sensor suggests damage; preserve the scene and obtain scaled inspection, history, calibration, and load evidence."], ["Escalate", "Public safety, structural integrity, regulated systems, design authority, or specialized destructive testing is implicated."]]
  },
  government: {
    decision: "Should the public decision maker implement, fund, amend, pause, audit, enforce, coordinate, or communicate a policy or service response?",
    questions: ["Which institution has legal authority, funding control, delivery responsibility, oversight, and appeal jurisdiction?", "Is the action a proposal, enacted law, appropriation, regulation, contract, operational directive, court ruling, or public statement?", "Which population and geography receive the service, which implementation step is failing, and what outcome measure proves delivery?", "What lawful option can change the problem before the deadline, and what second-order effect or equity risk follows?"],
    sources: [[8, "Confirm enacted authority, jurisdiction, effective date, obligations, and review."], [9, "Trace appropriation, spending, controls, audit findings, and actual program performance."], [10, "Follow solicitation, award, delivery, acceptance, change, and vendor dependence."], [7, "Measure baseline need, service reach, outcomes, and affected populations."], [30, "Test implementation with administrators, legal counsel, auditors, program staff, contractors, and communities."]],
    gates: [["Act / implement", "Authority, funding, owner, affected population, operational plan, and measurable review point are confirmed."], ["Collect next", "An announcement is treated as implementation; verify enacted text, appropriation, rule, contract, service data, and effective date."], ["Escalate", "Jurisdiction conflict, court action, emergency power, material audit concern, corruption risk, or cross-agency dependency blocks lawful action."]]
  },
  defense: {
    decision: "Should a public-safe assessment revise readiness confidence, identify a sustainment gap, recommend closer monitoring, or brief a potential posture or escalation change?",
    questions: ["What mission and time horizon are assessed, and does the evidence describe capability, readiness, posture, signaling, exercise activity, or intent?", "Which personnel, maintenance, fuel, munitions, transport, communications, command, legal, and alliance constraints limit the observed force?", "How does current activity differ from seasonal, training, exercise, deployment, and deception baselines?", "What observable indicator would distinguish preparation, deterrent signaling, routine readiness, concealment, or actual operational intent?"],
    sources: [[3, "Assess lawful geospatial relationships, movement, terrain, bases, routes, and sustainment nodes."], [4, "Compare visible equipment, damage, construction, dispersal, and activity over time."], [12, "Examine defense-relevant trade, components, fuel, and industrial dependencies at an aggregate level."], [9, "Compare budgets, procurement, sustainment priorities, and audit findings with claimed capability."], [30, "Use regional, logistics, engineering, legal, historical, and doctrine expertise to constrain inference."]],
    gates: [["Act / brief", "Multiple independent indicators depart from baseline and materially change the customer's readiness, protection, or contingency decision."], ["Collect next", "Visible assets are present but readiness and intent remain inferred; test sustainment, tempo, command, and alternative explanations."], ["Escalate", "Indicators suggest imminent harm, major escalation, treaty implications, or information requiring protected channels and proper authority."]]
  },
  emergency: {
    decision: "Should incident command evacuate or shelter, allocate scarce resources, open facilities, issue a warning, request mutual aid, or transition toward recovery?",
    questions: ["What happened, where and when, who is exposed, and which authority currently owns incident command?", "Which life-safety actions cannot wait, and what route, shelter, hospital, responder, communications, and supply capacity remains?", "Which reports are direct, current, geolocated, and independently confirmed, and which are rumor or duplicate reporting?", "What secondary failure—power, water, telecom, transport, health, payment, hazardous material, or displacement—will appear next?"],
    sources: [[16, "Confirm observed and forecast conditions affecting hazard, access, and operations."], [17, "Map hazard extent, routes, facilities, population, damage, and alternate access."], [26, "Use authorized dispatch, utility, facility, traffic, and resource status for the common operating picture."], [29, "Find local impact and unmet needs while controlling for duplication and representativeness."], [30, "Validate priorities with incident command, responders, health, engineering, logistics, and community specialists."]],
    gates: [["Act / protect life", "A credible current hazard intersects exposed people or critical facilities; execute the approved warning, shelter, evacuation, or resource plan."], ["Collect next", "Reports conflict but immediate danger is not established; geolocate, timestamp, deduplicate, and seek field or sensor confirmation."], ["Escalate", "Local capability is exceeded, mutual aid is required, hazardous or criminal conditions exist, or the event crosses jurisdictions."]]
  },
  international: {
    decision: "Should the customer pursue diplomatic engagement, adjust trade or travel planning, prepare a contingency, coordinate allies, or maintain current policy while monitoring?",
    questions: ["Which actors, interests, obligations, domestic constraints, dependencies, and audiences shape the decision?", "Is the observed action symbolic, diplomatic, legal, economic, coercive, cooperative, military, or an implementation gap?", "What do trade, finance, energy, alliance, migration, and public-opinion dependencies make costly for each actor?", "Which indicator would distinguish bargaining, signaling, policy change, preparation, escalation, or de-escalation?"],
    sources: [[6, "Trace original official statements, local-language reporting, chronology, and competing narratives."], [8, "Confirm treaties, sanctions, export controls, domestic authority, and legal obligations."], [12, "Measure cross-border trade, commodity, supplier, and rerouting effects."], [3, "Evaluate lawful spatial evidence about borders, routes, infrastructure, movement, and exposure."], [29, "Compare national claims with local and affected-community conditions."]],
    gates: [["Act / adjust posture", "Observed implementation—not rhetoric alone—changes a material obligation, dependency, access condition, or risk inside the decision horizon."], ["Collect next", "A statement implies major policy change; verify legal action, resource movement, partner behavior, flows, and domestic constraints."], ["Escalate", "Treaty, sanctions, armed conflict, protected intelligence, citizen safety, or multi-government coordination requires higher authority."]]
  },
  environment: {
    decision: "Should leaders warn the public, restrict exposure, deploy mitigation, protect infrastructure, change land or water operations, or invest in long-term adaptation?",
    questions: ["What hazard, exposure, vulnerability, population, geography, baseline, and time horizon define the problem?", "Is the signal a weather event, climate trend, pollution source, land-use change, ecological shift, sensor issue, or interacting causes?", "Which people, ecosystems, assets, and services cross a health, safety, legal, or economic threshold first?", "Which mitigation changes exposure now, and which adaptation reduces repeated risk without shifting harm elsewhere?"],
    sources: [[16, "Separate observed weather, forecast risk, seasonal conditions, and long-term climate evidence."], [17, "Map land use, flood, fire, vegetation, infrastructure, watershed, and visible change."], [5, "Use calibrated air, water, soil, emissions, thermal, and other environmental measurements."], [19, "Assess utility and watershed service conditions, tests, notices, and upstream dependencies."], [7, "Connect exposure to representative health, population, insurance, agriculture, and economic baselines."]],
    gates: [["Act / reduce exposure", "Validated measurements or forecasts meet the responsible authority's threshold and exposed people or assets can be protected in time."], ["Collect next", "A dramatic image or isolated sensor drives the claim; confirm calibration, time, place, baseline, extent, and independent observations."], ["Escalate", "The hazard crosses jurisdictions, creates public-health or critical-infrastructure risk, or requires regulatory enforcement and long-term capital."]]
  }
};

const sourceById = new Map(sourceCatalog.map((source) => [source.id, source]));

function createElement(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderSourceDirectory() {
  const directory = document.getElementById("source-directory");
  if (!directory) return;

  sourceCatalog.forEach((source) => {
    const card = createElement("details", "source-card");
    card.dataset.sourceId = String(source.id).padStart(2, "0");
    const summary = document.createElement("summary");
    summary.append(createElement("b", "", `#${String(source.id).padStart(2, "0")}`), createElement("strong", "", source.label), createElement("small", "", `Best for: ${source.best.split(".")[0].toLowerCase()}.`));
    const body = document.createElement("div");
    const best = createElement("p");
    best.append(createElement("b", "", "Most effective when: "), document.createTextNode(source.best));
    const caution = createElement("p");
    caution.append(createElement("b", "", "Do not overclaim: "), document.createTextNode(source.caution));
    body.append(best, caution);
    card.append(summary, body);
    directory.append(card);
  });
}

function renderSectorInvestigations() {
  Object.entries(sectorInvestigations).forEach(([sectorId, investigation]) => {
    const sector = document.getElementById(sectorId);
    const body = sector?.querySelector(".sector-body");
    const referenceFields = body?.querySelector("dl");
    if (!body || !referenceFields) return;

    const desk = createElement("section", "investigation-desk");
    desk.dataset.investigation = sectorId;
    desk.setAttribute("aria-label", "Decision investigation worksheet");
    const mission = createElement("div", "investigation-mission");
    mission.append(createElement("span", "", "Decision request"), createElement("strong", "", "Name the customer, choice, and clock"), createElement("p", "", investigation.decision));

    const grid = createElement("div", "desk-grid");
    const questionCard = createElement("article", "desk-card");
    questionCard.append(createElement("h4", "", "Four priority questions"));
    const questions = document.createElement("ol");
    investigation.questions.forEach((question) => questions.append(createElement("li", "", question)));
    questionCard.append(questions);

    const sourceCard = createElement("article", "desk-card");
    sourceCard.append(createElement("h4", "", "Best-fit source stack"));
    const sources = createElement("ul", "source-stack");
    investigation.sources.forEach(([sourceId, role]) => {
      const source = sourceById.get(sourceId);
      if (!source) return;
      const item = document.createElement("li");
      const label = createElement("span", "", source.label);
      label.append(createElement("small", "", role));
      item.append(createElement("b", "", `#${String(sourceId).padStart(2, "0")}`), label);
      sources.append(item);
    });
    sourceCard.append(sources);

    const gateCard = createElement("article", "desk-card");
    gateCard.append(createElement("h4", "", "Decision gates"));
    const gates = createElement("ul", "gate-list");
    investigation.gates.forEach(([label, text]) => {
      const item = document.createElement("li");
      item.append(createElement("strong", "", label), createElement("span", "", text));
      gates.append(item);
    });
    gateCard.append(gates);
    grid.append(questionCard, sourceCard, gateCard);
    desk.append(mission, grid);
    referenceFields.insertAdjacentElement("afterend", desk);
  });
}

function openTargetSector() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id) return;
  const target = document.getElementById(id);
  if (target?.matches("details.sector-brief")) target.open = true;
}

function setSectorFilter() {
  const search = document.getElementById("sector-search");
  const status = document.getElementById("sector-status");
  const query = search?.value.trim().toLowerCase() || "";
  const sectors = [...document.querySelectorAll("details.sector-brief")];
  let visible = 0;
  sectors.forEach((sector) => {
    const matches = !query || sector.textContent.toLowerCase().includes(query);
    sector.hidden = !matches;
    if (matches) visible += 1;
  });
  document.querySelectorAll("section.sector-group").forEach((group) => {
    group.hidden = ![...group.querySelectorAll("details.sector-brief")].some((sector) => !sector.hidden);
  });
  if (status) status.textContent = query ? `Showing ${visible} of ${sectors.length} sectors for “${search.value.trim()}”.` : `Showing all ${sectors.length} sectors.`;
}

function wireFieldbookControls() {
  const search = document.getElementById("sector-search");
  const expand = document.getElementById("expand-all");
  const collapse = document.getElementById("collapse-all");
  search?.addEventListener("input", setSectorFilter);
  expand?.addEventListener("click", () => { document.querySelectorAll("details.sector-brief:not([hidden])").forEach((sector) => { sector.open = true; }); });
  collapse?.addEventListener("click", () => { document.querySelectorAll("details.sector-brief").forEach((sector) => { sector.open = false; }); });
}

window.addEventListener("DOMContentLoaded", () => {
  wireFieldbookMenu();
  renderSourceDirectory();
  renderSectorInvestigations();
  wireFieldbookControls();
  setSectorFilter();
  openTargetSector();
});

window.addEventListener("hashchange", openTargetSector);
