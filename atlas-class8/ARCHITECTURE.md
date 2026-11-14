# ATLAS Class 8 — Engineering architecture v3.0

Marc Lavoie · 2026-11-14

## Runtime composition

```text
Standalone /atlas-class8/index.html             Existing-site tab
           |                                            |
           |                                  integration/atlas-embed.js
           |                                      same-origin iframe
           +-------------------+------------------------+
                               |
                 Isolated ATLAS application
                 index.html + assets/styles.css + assets/v3.css
                               |
                  js/catalog.js (117 mechanical parts)
                  js/training-data.js (v2 lessons/data)
                  js/blueprints.js + js/component-art.js (v2 SVG)
                  js/simulations.js (pure v3 math / data)
                  js/app.js (v2 state, navigation, public host bridge)
                  js/v3-labs.js (x-ray, drivetrain, tire, cargo UI)
                  js/embed-frame.js (optional height messages)
                               |
                        Browser localStorage
                    (v2 key preserved, new v3 tire key)
```

## Upgrade and compatibility strategy

The original v2 controller and its 117-component catalog are retained. Instead of duplicating or redefining old components, `v3-labs.js` cross-links existing part IDs from `catalog.js`, while `ATLAS_HOST` (public wrapper in `app.js`) exposes exactly two use cases: navigating to a known part and transferring a computed axle array into the legacy bridge worksheet. The old `atlas-class8-2026-v2` storage key is intentionally maintained so upgrade does not erase service-planner/inspection/work-order state. New tire inspection values are saved under `atlas-class8-v3-inspections:tires`.

## Calculations: precision, assumptions, limits

### Drivetrain

```text
Overall ratio = gear ratio × drive-axle final-drive ratio
Wheel torque (lb-ft) = engine torque (lb-ft) × overall ratio × efficiency_fraction
Tire effective radius (ft) = outside_diameter_inches / 24
Nominal tractive force (lbf) = wheel torque / effective_radius
Ideal speed (mph) = rpm × π × tire_diameter_in / (overall ratio × 1056)
Grade resistance (lbf approx.) = gross_weight_lb × grade_percent / 100
```

The model treats tire outside diameter as rolling diameter, holds engine torque constant and assumes static efficiency: it neglects force vs adhesion, slip, torque curves, rolling resistance, aerodynamics, torque converter losses, differential path differences and real-world gearing limitations. Never use it for hill-climb or braking authorization.

### Trailer load distribution

The model replaces the real trailer by a **statically determinate simple beam** with two vertical supports: kingpin at 3 ft and tandem center at 43 ft from the trailer front. Cargo is treated as a concentrated vertical point load within those supports.

```text
Cargo moment about pin: rear_cargo_reaction = cargo_weight × (x - 3) / (43 - 3)
Cargo kingpin reaction = cargo_weight - rear_cargo_reaction
Total kingpin load = empty_trailer_weight × entered_pin_share + cargo_kingpin_reaction
Trailer tandem load = empty_trailer_weight × (1 - entered_pin_share) + rear_cargo_reaction
Steer load = entered_empty_steer_weight + kingpin_load × entered_steer_fraction
Drive tandem = empty_tractor_weight - entered_empty_steer + kingpin_load × (1 - entered_steer_fraction)
```

It divides drive/tandem weights equally between paired axles and checks only coarse 80k/12k/34k example warnings. The result is transferred to the v2 contiguous 15-group bridge screen for more comparisons. **It is not a full load-engineering model** and cannot capture lateral mass, actual kingpin offset, structural reaction, GAWR/GVWR, tire ratings, weight distribution within the tractor, suspension load shares, state routes, special permits or securement rules.

### Tires

An 18-position record models 2 steer tires, 8 tandem drive tires and 8 trailer tandem tires. Published federal reference under 49 CFR 393.75: front steer tire tread ≥4/32 inch; other tires ≥2/32 inch in major grooves (subject to measurement details and other requirements). Reported ply exposure, tread/sidewall separation and audible leakage flags a condition failure. Pressure warnings compare measured input to a **user-supplied** cold recommended pressure from the actual load chart; this is a caution flag, not a DOT pressure compliance test. No universal tire inflation number is assumed.

### Legacy models

The v2 air-brake decay teaching model and bridge formula remain unchanged. Their v2 limitations and corrections are explained in the original architecture and on-screen notes.

## Security and integration

- DOM content from existing local catalog is HTML-escaped before dynamic insertion.
- No external JS, CDN, Google fonts, application credentials, tracking or network fetches.
- Host adapter only accepts resize messages from the **exact mounted iframe window**; it validates finite height bounds. Message has no sensitive content.
- Intended use is same-origin within the user's website. Frame embedding gives CSS and JavaScript namespace isolation by default.
- Interactive callouts have keyboard Enter/Space activation; controls use native inputs and labels where possible.
- Users should preserve the existing site's CSP/sandbox policies; do not disable them broadly to force the embed to run.

## Codebase roadmap (future, not claimed implemented)

- OEM/VIN/engine-serial profile packs, traceable service bulletins and live/verified price catalogs.
- Structured YAML/JSON course framework, SRS/lesson plans and question randomization.
- 3-D exploded models (only with properly licensed meshes and part metadata).
- Brake test measurement protocol branching by state manual, supervised service exercises.
- Cargo distributed-load solver, adjustable fifth-wheel/tandem positions and calibrated GAWR/TWR/tire limits.
- Automated axe accessibility auditing and actual site integration tests against the owner's repository.
