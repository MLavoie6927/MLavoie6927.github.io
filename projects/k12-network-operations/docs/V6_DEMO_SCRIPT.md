# v6 Five-Minute Portfolio Walkthrough

## 0:00–0:30 — Establish the project

Open `index.html`.

> This is a static regional K–12 operations engineering simulation. The 35 districts and telemetry are synthetic, but the troubleshooting workflow, evidence structure, scripts, configuration examples, validation logic, and escalation process are implemented artifacts.

Switch the hero from **Normal** to **WAN** or **Security** so the interviewer sees that the page is an operational simulation, not a screenshot.

## 0:30–1:15 — Show the regional digital twin

Open **Operations Center → Digital Twin**.

Click an affected district.

Explain:

- district/site scope;
- VLAN/service context;
- current ticket state;
- why scope is established before making a network change.

## 1:15–2:30 — Run one evidence-first investigation

Open **Incidents** and select `INC-WAN-01`.

Advance the diagnostics one at a time.

Emphasize the decision chain:

```text
multiple VLANs affected
→ local services reachable
→ gateways reachable
→ edge interface up/up
→ default route present
→ path fails after provider handoff
→ WAN/provider fault domain
```

Then open **Evidence Vault** and show the raw traceroute/interface/SNMP artifacts.

## 2:30–3:20 — Demonstrate engineering controls

Open **Assurance** and show intentional configuration drift.

Then open **Changes** and explain that a technically correct fix still requires:

- bounded scope;
- approval;
- rollback;
- positive validation;
- negative/security validation.

For the segmentation case, highlight that STUDENT → MGMT must fail after remediation while legitimate student DNS/HTTPS continues to work.

## 3:20–4:10 — Show proactive operations

Open **Capacity** and select a district with rising P95 utilization.

Explain the transparent forecast and why capacity work should happen before congestion becomes a ticket.

Open **Services** and demonstrate blast-radius analysis for DNS or identity.

## 4:10–4:45 — Use the terminal

Open **Terminal** and run:

```text
status
incidents
district DIST-07
trace INC-WAN-01
evidence INC-WAN-01
drift
sla
changes
```

Explain that the terminal is deterministic and safe; it queries the same static datasets as the graphical console.

## 4:45–5:00 — Close with proof

Return to the landing page's **Proof** section.

> I wanted the project to demonstrate not only that I know the technologies, but how I make an operational decision: establish scope, prove the fault boundary, preserve evidence, make the smallest justified change or escalation, verify service restoration, verify that security controls still work, and document the outcome.
