# Five-Minute Portfolio Presentation

## 0:00–1:00 — Frame the Problem

Open `index.html` and explain:

> A K–12 support ticket usually starts as a symptom, not a diagnosis. I built this project around determining exactly where known-good behavior stops across endpoint, identity, campus LAN, security controls, WAN, and cloud services.

Show the **end-to-end architecture** visual.

## 1:00–2:15 — Walk a Real Case

Open `INC-WAN-01` in the interactive console.

Demonstrate:

1. two VLANs affected,
2. local AD/DNS and gateway healthy,
3. district WAN interface healthy,
4. path stops at provider handoff,
5. no local change is justified,
6. evidence-quality upstream escalation is prepared.

The important interview point is the reasoning chain, not the traceroute command itself.

## 2:15–3:15 — Show Automation

Open the Tooling section and show:

- PowerShell endpoint/domain/Intune collection,
- Python inventory/triage/report CLI,
- Bash network collector,
- network configuration references.

Explain that diagnostics are read-only first so evidence is preserved before remediation.

## 3:15–4:10 — Show Security & Change Control

Open the segmentation case.

Explain why the post-change test includes:

- a negative control: STUDENT → MGMT must fail,
- a positive control: authorized MGMT administration must still work,
- a user-path control: student DNS/HTTPS still works.

This proves the fix did not create a different outage.

## 4:10–5:00 — Close With Proof

Show:

- automated tests,
- portfolio validator,
- 35-district inventory,
- case-study raw artifacts,
- safe-lab / synthetic labeling.

Close with:

> The fictional scale is a simulation. What I am demonstrating is the operating method: isolate the fault domain, collect defensible evidence, make the smallest justified change or escalation, verify the user path and security controls, and leave a useful record for the next engineer.
