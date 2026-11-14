/*
 * Class 8 Tractor–Trailer Systems Lab | Educational component catalog
 * Generated: 2026-11-14 | Original implementation
 * Illustrative part and labor estimates, NOT live retail quotes or OEM procedures.
 */
'use strict';

window.LAB_DATA = (() => {
  const ZONES = [
    ['engine','Engine & lubrication','Tractor','Powertrain'],
    ['cooling','Radiator & cooling','Tractor','Powertrain'],
    ['intake','Air intake & turbo','Tractor','Powertrain'],
    ['emissions','Exhaust & emissions','Tractor','Powertrain'],
    ['fuel','Fuel & DEF supply','Tractor','Fluids'],
    ['transmission','Transmission & clutch','Tractor','Powertrain'],
    ['driveline','Driveshaft & differentials','Tractor','Powertrain'],
    ['cab','Cab, controls & HVAC','Tractor','Body & safety'],
    ['steering','Steering system','Tractor','Steering & tires'],
    ['front-suspension','Steer axle & suspension','Tractor','Steering & tires'],
    ['steer-tires','Steer tires & wheels','Tractor','Steering & tires'],
    ['drive-axles','Drive axle & suspension','Tractor','Steering & tires'],
    ['drive-tires','Drive tires & wheels','Tractor','Steering & tires'],
    ['air-brakes','Tractor air brakes','Tractor','Brakes & air'],
    ['fifth-wheel','Fifth wheel & kingpin interface','Tractor','Coupling'],
    ['electrical','Tractor electrical','Tractor','Electrical'],
    ['chassis','Frame & chassis','Tractor','Body & safety'],
    ['trailer-body','Trailer sidewalls & nose','Trailer','Structure & cargo'],
    ['trailer-roof','Trailer roof','Trailer','Structure & cargo'],
    ['trailer-floor','Trailer floor & crossmembers','Trailer','Structure & cargo'],
    ['trailer-cargo','Cargo restraint & interior','Trailer','Structure & cargo'],
    ['trailer-landing','Landing gear & support','Trailer','Coupling'],
    ['trailer-tandem','Trailer tandem & suspension','Trailer','Steering & tires'],
    ['trailer-tires','Trailer tires & wheels','Trailer','Steering & tires'],
    ['trailer-brakes','Trailer brakes & ABS','Trailer','Brakes & air'],
    ['trailer-air','Trailer air supply','Trailer','Brakes & air'],
    ['trailer-electrical','Trailer wiring & connector','Trailer','Electrical'],
    ['trailer-lights','Trailer lighting & reflectors','Trailer','Electrical'],
    ['trailer-rear','Rear doors & underride guard','Trailer','Structure & cargo'],
  ].map(([id,name,vehicle,system]) => ({id,name,vehicle,system}));

  // Compact raw schema: id | label | zone | function | inspect | warning signs | replacement trigger | part cost min,max | typical labor hr min,max | severity
  const rows = [
  // ENGINE & LUBRICATION
  ['engine-block','Engine block','engine','Structural housing for cylinders, oil passages and coolant jackets.','Look for coolant/oil seepage, cracks and unusual vibration.','Coolant in oil, block cracks, severe knock.','Diagnose and repair; replace only if cracked or irreparably damaged.',4500,18000,25,70,'high'],
  ['pistons-rings','Pistons and rings','engine','Seal combustion pressure and transfer combustion force to the crankshaft.','Review compression, blow-by and oil-consumption results.','Heavy blow-by, excessive oil consumption, poor compression.','Replace during validated internal engine overhaul.',900,3200,20,55,'high'],
  ['crankshaft','Crankshaft and main bearings','engine','Convert reciprocating piston motion into rotary torque.','Listen for lower-end knock; review oil pressure and oil analysis.','Metal in oil, low oil pressure, deep knocking.','Repair or replace after internal dimensional inspection.',1200,5500,25,60,'high'],
  ['cylinder-head','Cylinder head and valve train','engine','Encloses combustion chambers and controls intake/exhaust flow.','Check for coolant contamination, misfires and valve-train noise.','Compression loss, coolant loss, head-gasket seepage.','Repair after pressure testing and OEM measurement.',1800,6500,16,35,'high'],
  ['engine-oil','Engine oil (DD15 example)','engine','Lubricates engine bearings, rings, camshaft and turbocharger.','Check level, leaks, oil pressure, condition and service history.','Dilution, high soot, contamination, low pressure.','Change at OEM duty-cycle interval or earlier on validated oil analysis.',180,420,1.5,3,'medium'],
  ['oil-filter','Engine oil filter','engine','Removes particulates from circulating engine oil.','Inspect housing seals and filter-service records.','Leaks, blocked element, low oil pressure.','Replace with each scheduled oil service.',35,100,0.4,1,'medium'],
  ['oil-pan','Oil pan and drain plug','engine','Stores engine lubricating oil and provides drain access.','Look for cracks, impact damage, plug leakage and loose fasteners.','Oil drips, damaged sump, stripped drain threads.','Replace damaged pan or sealing hardware immediately.',250,1200,3,9,'medium'],
  ['oil-pump','Engine oil pump','engine','Supplies pressurized lubricating oil to rotating components.','Confirm indicated pressure and inspect for abnormal engine noise.','Persistent low pressure despite proper oil level.','Replace after mechanical pressure test and root-cause diagnosis.',450,1800,8,20,'high'],
  ['engine-mounts','Engine mounts','engine','Isolate engine vibration and support the power unit.','Check rubber for tears and brackets for cracks.','Excessive vibration, clunks, misalignment.','Replace separated or structurally compromised mounts.',120,600,2,6,'medium'],
  // COOLING
  ['radiator','Radiator','cooling','Transfers coolant heat to ambient air.','Check fins, hose joints, coolant level and leaks when cool.','Overheating, pinhole leaks, damaged fins.','Replace leaking or irreparably blocked radiator.',450,1800,4,10,'high'],
  ['coolant','Engine coolant / antifreeze','cooling','Transfers heat and provides corrosion/freeze protection.','Test concentration and chemistry according to OEM recommendations.','Contamination, poor inhibitor condition, unexplained loss.','Flush/replace based on approved coolant chemistry and OEM interval.',120,400,2,5,'medium'],
  ['water-pump','Coolant water pump','cooling','Circulates coolant through the engine and radiator.','Inspect housing/weep hole and listen for bearing noise.','Coolant leak, overheating, pump shaft play.','Replace when leaking, binding or not circulating properly.',300,1050,4,9,'high'],
  ['thermostat','Engine thermostat','cooling','Controls coolant flow to reach operating temperature.','Review warm-up behavior and overheating faults.','Overheating or persistent under-temperature operation.','Replace when stuck or fails OEM temperature test.',80,260,2,5,'medium'],
  ['fan-clutch','Engine cooling fan clutch','cooling','Engages engine cooling fan when heat rejection is needed.','Listen for incorrect engagement and assess cooling performance.','Overheating, constant roaring or no fan engagement.','Replace after fan-control diagnosis confirms fault.',350,1100,3,7,'high'],
  ['coolant-hoses','Coolant hoses and clamps','cooling','Carry pressurized coolant between engine and heat exchangers.','Inspect when cool for soft spots, bulges, chafing and seepage.','Swelling, visible cracking, leaks and rubbing.','Replace any compromised hose or clamp; never open a hot system.',25,250,0.5,3,'high'],
  ['expansion-tank','Coolant expansion tank and cap','cooling','Accommodates thermal expansion and maintains system pressure.','Check level through tank and inspect cap gasket and shell.','Cracked tank, coolant residue, failed cap.','Replace on leakage or failed pressure testing.',70,350,1,3,'medium'],
  // AIR INTAKE
  ['air-filter','Engine intake air filter','intake','Removes dust and abrasive particles before air enters the engine.','Monitor restriction indicator and air-filter housing seal.','High restriction, damaged element, dirt downstream.','Replace per restriction/OEM schedule; never operate unfiltered.',55,180,0.3,1,'medium'],
  ['turbocharger','Turbocharger','intake','Uses exhaust energy to pressurize intake air.','Inspect for boost faults, oil leaks and abnormal whine.','Power loss, excessive smoke, shaft failure symptoms.','Replace only after oil/charge-air/exhaust diagnostic checks.',1200,3500,6,14,'high'],
  ['charge-air-cooler','Charge air cooler','intake','Cools compressed air before it enters the engine.','Check for leaking cores, hoses and loose clamps.','Low boost, air hiss, oil tracks around couplers.','Replace failed core or leaking connections.',500,1700,4,10,'medium'],
  ['intake-hoses','Air intake/boost pipes','intake','Route filtered and compressed air to the intake manifold.','Inspect rubber boots, pipe mounts and clamp torque.','Split boot, boost leak, collapsing hose.','Replace torn/softened pieces and repair clamps.',45,400,1,4,'medium'],
  // EMISSIONS
  ['dpf','Diesel particulate filter (DPF)','emissions','Captures diesel particulate matter; regeneration burns accumulated soot.','Monitor DPF differential-pressure faults and regeneration history.','Persistent high restriction, repeated failed regens.','Clean or replace only on diagnostic/service criteria.',1200,4800,4,10,'high'],
  ['scr-catalyst','SCR catalyst','emissions','Uses ammonia from DEF to reduce engine-out nitrogen oxides.','Review NOx/DEF diagnostic trouble codes and leaks.','Persistent emissions faults and conversion inefficiency.','Replace after verifying dosing, sensors and catalyst efficiency.',1800,6500,5,12,'high'],
  ['def-doser','DEF doser and pump','emissions','Meters diesel exhaust fluid into aftertreatment.','Inspect DEF line leaks, crystallization and fault codes.','DEF deposits, dosing faults, derate.','Replace failed component after flow and electrical testing.',200,1600,2,7,'high'],
  ['nox-sensors','NOx sensors','emissions','Measure nitrogen-oxide concentration to support emissions control.','Scan for sensor heater/communication and plausibility errors.','Persistent NOx faults and emissions derates.','Replace sensor after wiring and exhaust faults are excluded.',300,850,1,3,'medium'],
  ['exhaust-piping','Exhaust piping and heat shields','emissions','Carries hot exhaust away and shields nearby components.','Check brackets, exhaust leaks, holes and shield security.','Soot stains, loud leaks, loose heat shield.','Replace leaking piping; secure loose or missing shields.',100,900,1.5,5,'high'],
  // FUEL/DEF
  ['diesel-tanks','Diesel fuel tanks','fuel','Store diesel fuel; dual saddle tanks are common.','Inspect straps, cap, seals, drains and venting.','Leaks, corrosion, damaged mounts and cap seals.','Replace compromised tank and repair any fuel leak.',600,2300,3,9,'high'],
  ['fuel-filter','Fuel-water separator and filters','fuel','Remove particles and water from diesel supply.','Check service indicators, leaks and water collection.','Restricted supply, water warning, hard start.','Service at OEM interval or sooner if contamination detected.',65,220,0.8,2,'medium'],
  ['fuel-injectors','Common-rail injectors','fuel','Precisely meter atomized fuel into each cylinder.','Investigate misfire, correction values and return-flow data.','Misfire, smoke, rough idle, fuel dilution.','Replace failing injectors only after proper tests.',450,1000,2,6,'high'],
  ['high-pressure-pump','High-pressure fuel pump','fuel','Pressurizes fuel for the common-rail system.','Diagnose rail-pressure abnormalities and contamination.','No start, pressure faults, metal debris.','Replace after contamination assessment and OEM fuel-service procedure.',950,2800,5,12,'high'],
  ['def-tank','DEF tank','fuel','Stores diesel exhaust fluid for SCR aftertreatment.','Check fill level, contamination, heater and tank leaks.','Cracked tank, DEF contamination, heater faults.','Replace leaking tank; use only certified DEF.',350,1700,3,8,'medium'],
  ['def-filter','DEF supply filter','fuel','Protects DEF pump and injector from solids.','Check service interval, contamination and DEF pressure faults.','Flow restriction, crystalline debris, dosing failures.','Replace at scheduled manufacturer interval.',25,110,0.5,1.5,'medium'],
  // TRANSMISSION
  ['transmission','Automated/manual transmission','transmission','Provides selectable ratios from engine to drive axles.','Check case leaks, diagnostic faults and shift quality.','Gear grinding, erratic shifts, metal debris.','Rebuild/replace only following OEM diagnostics.',4000,14000,12,28,'high'],
  ['trans-fluid','Transmission lubricant','transmission','Lubricates gears, shafts and bearings.','Verify correct fluid grade and level per transmission model.','Low level, burnt smell, metallic contamination.','Change at exact OEM duty-cycle interval or on condition.',100,330,1.5,4,'medium'],
  ['clutch','Clutch assembly / actuator','transmission','Engages and disconnects engine torque at transmission input.','Check slip, engagement calibration and abnormal chatter.','Slip, judder, release failure, overheating.','Replace worn clutch or failed actuator after diagnosis.',700,2800,8,18,'high'],
  ['trans-mount','Transmission mounts','transmission','Support transmission and control driveline alignment.','Inspect rubber, fasteners and mounting brackets.','Clunks, vibration, torn rubber.','Replace cracked or separated mounts.',80,350,2,5,'medium'],
  // DRIVELINE
  ['driveshaft','Propeller / drive shaft','driveline','Transfers rotation between transmission and differentials.','Inspect shaft damage, balance weights and guard clearance.','Vibration, bent tube, loose fasteners.','Replace bent or structurally damaged shaft.',350,1450,2,5,'high'],
  ['u-joints','Universal joints and slip yokes','driveline','Accommodate suspension movement and driveline angles.','Check play, lubrication, seals and rust-colored dust.','Clicking, binding, free play, vibration.','Replace worn joints before they fail.',60,300,1.5,5,'high'],
  ['drive-differential','Drive axle differentials','driveline','Provide final-drive gear reduction and distribute torque.','Inspect seals, gear-oil condition and bearing noise.','Whine, oil leaks, excessive heat, metal debris.','Repair bearings/gears or replace assembly after inspection.',1000,4500,7,18,'high'],
  ['axle-lube','Drive axle gear lubricant','driveline','Lubricates gears and bearings in differential housings.','Check fill and leaks; use correct axle-specific lubricant.','Low level, contamination, overheating.','Change by manufacturer duty cycle or after contamination.',100,340,1.5,4,'medium'],
  ['axle-shafts','Drive axle shafts','driveline','Carry torque from differentials to wheel hubs.','Check flange bolts, seals and unusual drive noises.','Cracked shaft, slipping drive, flange leak.','Replace damaged shafts; diagnose bearing/seal root cause.',180,950,2,7,'high'],
  // CAB
  ['cab-shell','Cab shell and mounting','cab','Provides protected operator environment and supports controls.','Inspect hinges, cab mounts, latches and cab structural damage.','Loose latch, damaged mounting, water ingress.','Repair compromised structure and restraint systems.',500,6000,4,30,'high'],
  ['seat-belt','Driver seat belt and anchor','cab','Restrains the driver during sudden stops and collisions.','Check retractors, latch, webbing and anchor security.','Frayed webbing, failed lock or buckle.','Replace damaged/defective belt system before use.',90,400,1,3,'high'],
  ['mirrors','Mirrors and mounting arms','cab','Provide side and rearward visibility for maneuvers.','Check glass, adjustment, heating and mounting stiffness.','Shaking, broken glass, obstructed view.','Replace cracked glass or loose damaged supports.',60,650,0.5,3,'high'],
  ['windshield','Windshield and wipers','cab','Provide forward visibility and clear water/debris.','Inspect chips/cracks, wiper condition and wash pattern.','Vision-obscuring crack, streaking, failed washer.','Replace damage that impairs visibility or violates standards.',25,1200,0.3,4,'high'],
  ['hvac','HVAC blower and air conditioning','cab','Controls cabin heating, defogging and cooling.','Check airflow, condensate, hoses and electrical operation.','Weak defrost, no cooling, odors, water intrusion.','Repair affected system after diagnosis.',80,1500,1.5,8,'medium'],
  ['dashboard','Instrument cluster and warning indicators','cab','Display speed, pressure, engine status and faults.','Confirm self-test lights, gauge operation and diagnostic codes.','Dead gauges, missing alarms, intermittent power.','Repair or replace faulty gauge/module after wiring tests.',180,1800,2,6,'high'],
  ['cab-doors','Cab doors, locks and steps','cab','Provide safe entry and egress and secure compartment.','Inspect handholds, door seals, hinges and anti-slip steps.','Loose steps, missing handhold, failed latch.','Repair before safe access is compromised.',45,550,1,5,'medium'],
  // STEERING / FRONT
  ['steering-gear','Steering gear box','steering','Converts steering input into linkage movement.','Inspect mounting, free play and fluid leaks where applicable.','Excessive play, binding, hydraulic leakage.','Replace/repair per steering-system inspection criteria.',500,2100,4,10,'high'],
  ['tie-rods','Tie-rod ends and drag link','steering','Connect steering gear to knuckles and coordinate wheel direction.','Check joints, cotter pins, boots and free play.','Loose joint, torn boot, wander.','Replace any unsafe joint and align afterward.',90,550,2,6,'high'],
  ['power-steer','Power-steering pump and fluid','steering','Assists steering effort hydraulically on equipped designs.','Check correct fluid level, belt and hose leaks.','Steering noise, heavy effort, leaks.','Fix leakage or failed pump; use specified fluid only.',180,900,2,7,'high'],
  ['front-axle','Steer axle beam and kingpins','front-suspension','Supports the steer-wheel load and pivots wheels.','Inspect axle cracks, pins, bushings and steering movement.','Kingpin play, uneven tire wear, wander.','Replace out-of-spec pins/bushings or damaged axle.',250,2600,5,15,'high'],
  ['front-leaf','Front springs, shackles and bushings','front-suspension','Support steer axle load and maintain axle positioning.','Look for broken leaves, cracked shackles and loose U-bolts.','Sagging, uneven ride height, clunks.','Replace broken/deformed suspension parts.',120,850,3,8,'high'],
  ['front-shocks','Steer-axle shock absorbers','front-suspension','Dampen spring oscillation and help tire contact.','Inspect leaks, mounts and tire-cupping symptoms.','Oil leak, poor damping, excessive bounce.','Replace failed dampers, commonly as an axle pair.',80,260,1,3,'medium'],
  ['steer-tire','Steer axle tires','steer-tires','Carry front load and deliver steering traction.','Check pressure cold, tread, bulges, cuts and age.','Exposed cord, separation, severe uneven wear.','Replace at legal/approved limit or immediately for unsafe damage.',250,750,0.5,1.5,'high'],
  ['steer-wheel','Steer wheels, hubs and bearings','steer-tires','Mount tire assemblies and allow low-friction wheel rotation.','Inspect lug nuts, cracks, seals, wheel-bearing play.','Hot hub, cracked rim, oil leak, looseness.','Repair/replace failed hub/bearing/rim; verify torque procedure.',120,1000,2,8,'high'],
  // DRIVE AXLES
  ['rear-suspension','Rear air springs / air bags','drive-axles','Support rear of tractor and help manage ride height.','Check leaks, abrasion, mounts and ride height.','Hissing, sagging, chafed bellows.','Replace leaking or torn air springs.',100,400,1.5,4,'high'],
  ['rear-shocks','Drive-axle shocks','drive-axles','Dampen rear suspension oscillation.','Inspect oil leakage, bushings and broken mounts.','Bounce, leaking shocks, wheel hop.','Replace failed unit and inspect axle mate.',90,280,1,3,'medium'],
  ['torque-rods','Torque rods and bushings','drive-axles','Locate axles and react acceleration/braking forces.','Inspect bushings, fasteners and rod cracks.','Clunks, axle shift, uneven driveline angles.','Replace cracked or excessively worn rods/bushings.',95,450,2,6,'high'],
  ['height-valve','Ride-height control valve','drive-axles','Maintains specified suspension ride height.','Measure ride height; listen for continuous air leak.','Sagging or uneven height, air leakage.','Replace failed control valve and recalibrate.',70,330,1,3,'medium'],
  ['drive-tire','Drive tires','drive-tires','Deliver propulsion and braking traction under load.','Check pressure, legal tread, dual spacing and damage.','Cuts, separation, irregular wear, low tread.','Replace when below minimum or otherwise unsafe.',230,650,0.5,1.5,'high'],
  ['drive-rims','Drive wheels and lug hardware','drive-tires','Secure wheels to hub and transfer drive/brake loads.','Check cracks, missing nuts and rust trails at studs.','Loose studs, elongated holes, cracks.','Replace damaged hardware and torque with approved pattern.',60,550,1,3,'high'],
  // TRACTOR BRAKES
  ['air-compressor','Air compressor and governor','air-brakes','Generate and regulate compressed air for braking and accessories.','Observe pressure build and governor cut-in/cut-out behavior.','Slow build, oil carryover, abnormal pressure.','Repair before operation if pressure-system test fails.',450,1600,4,10,'high'],
  ['air-dryer','Air dryer / desiccant cartridge','air-brakes','Removes moisture and contaminants from compressed air.','Inspect purge action and moisture in reservoirs.','Water in tanks, failed purge, icy valves.','Service cartridge/system to manufacturer’s schedule.',80,650,1.5,4,'high'],
  ['air-tanks','Air reservoirs and drains','air-brakes','Store brake-system compressed air.','Inspect corrosion, mounting, leaks and drain operation.','Air loss, rust, damaged mounting.','Replace corroded/damaged tanks and leaking fittings.',100,500,2,5,'high'],
  ['brake-chambers','Service and spring brake chambers','air-brakes','Translate air pressure into mechanical braking force; spring units provide parking braking.','Check leaks, mounts, pushrod travel and corrosion.','Air leak, cracked chamber, excessive travel.','Replace defective chambers; never disassemble a caged spring-brake assembly unsafely.',70,340,1.5,4,'high'],
  ['slack-adjusters','Automatic slack adjusters','air-brakes','Maintain proper actuator-to-brake geometry within design range.','Check stroke limits and mechanical condition per OEM procedure.','Excessive pushrod travel, worn joints, misalignment.','Repair root cause; replace defective adjusters. Do not mask defects by readjusting.',75,280,2,5,'high'],
  ['tractor-drums','Tractor drums / rotors and friction','air-brakes','Create friction to slow the tractor.','Inspect thickness, cracks, heat marks, lining wear and contamination.','Cracked drum, worn lining, dragging or fade.','Replace at wear limit or on safety-critical defect.',180,700,3,7,'high'],
  ['abs-module','Tractor ABS ECU and wheel sensors','air-brakes','Detect wheel deceleration and manage anti-lock braking.','Observe ABS lamp self-test and scan active faults.','Persistent ABS warning, sensor faults.','Repair sensors/wiring/modulator after diagnosis.',45,1000,1,6,'high'],
  ['foot-valve','Foot/treadle brake valve','air-brakes','Meters service-brake air pressure in response to pedal input.','Inspect for leaks, sticking and abnormal response.','Continuous exhaust leak, delayed application.','Replace defective valve after brake-system tests.',130,600,2,5,'high'],
  // FIFTH WHEEL
  ['fifth-wheel','Fifth-wheel plate and locking jaws','fifth-wheel','Supports trailer kingpin load and locks tractor to trailer.','Inspect locking engagement, plate cracks, grease and mounting.','Lock fails, cracked plate, excessive play.','Repair or replace per manufacturer criteria; never travel with improper lock.',650,2600,4,10,'high'],
  ['fifth-release','Fifth-wheel release handle','fifth-wheel','Operates kingpin-locking mechanism for uncoupling.','Check damage, positive return and secure locking.','Bent handle, incomplete latch.','Replace/repair any failed locking control.',40,250,1,4,'high'],
  ['gladhands','Gladhand couplers and seals','fifth-wheel','Connect tractor air service and supply circuits to trailer.','Check gaskets, cracked housings and connector security.','Audible leakage, damaged seal, misconnection.','Replace worn seal/coupling immediately.',8,95,0.2,1.5,'high'],
  ['tractor-pigtail','Tractor-to-trailer electrical cord','fifth-wheel','Carries trailer lighting/ABS power and signals.','Inspect jacket, strain relief, terminals and socket.','Exposed conductor, failed trailer lamps.','Replace damaged cord or connectors.',60,240,0.4,2,'high'],
  // ELECTRICAL / CHASSIS
  ['truck-batteries','Starting batteries','electrical','Supply starting power and support electrical loads.','Check terminal corrosion, hold-down and state of health.','Slow crank, swollen case, low capacity.','Replace failing batteries after charging-system test.',150,450,0.5,2,'medium'],
  ['alternator','Alternator / charging system','electrical','Replenishes battery charge while engine runs.','Measure output, inspect wiring and pulley/belt.','Charging alarm, over/undervoltage.','Replace defective unit after belt and wiring checks.',280,950,2,6,'medium'],
  ['starter','Starter motor / solenoid','electrical','Turns the engine for starting.','Check cables, starter performance and mounting.','Click/no crank, slow crank with healthy batteries.','Replace after verifying supply and ground.',250,950,3,7,'medium'],
  ['vehicle-ecu','Engine/chassis ECUs and harnesses','electrical','Control powertrain, body, diagnostics and safety functions.','Scan faults and check grounds, connectors and harness chafing.','Intermittent communication, derate, electrical faults.','Repair wiring first; replace ECU only after confirmed failure.',80,2200,1,8,'high'],
  ['headlamps','Headlights and front markers','electrical','Illuminate roadway and communicate vehicle presence.','Test high/low beams, indicators and lens condition.','Inoperative lamp, water intrusion, cracked housing.','Replace failed bulbs/assemblies promptly.',20,400,0.3,2,'high'],
  ['frame-rails','Tractor frame rails and crossmembers','chassis','Support engine, suspension, cab and coupling load.','Inspect cracks, deformation, rust and bolt integrity.','Flange cracks, severe corrosion, loose crossmember.','Require engineered repair/replacement for structural defects.',180,3500,4,25,'high'],
  ['mudflaps','Tractor mud flaps and guards','chassis','Limit spray, rocks and debris from rear tires.','Check torn flap and mounting bracket security.','Missing or dragging flap.','Replace when damaged or missing.',20,140,0.5,2,'medium'],
  ['tractor-airlines','Tractor air tubing and fittings','chassis','Route compressed air to valves, tanks and wheel ends.','Check abrasion, air leaks, routing and support clips.','Hissing, chafing, pressure loss.','Replace unsafe hose/line with approved fitting.',20,240,1,4,'high'],
  // TRAILER BODY
  ['nose-panel','Trailer front wall and corner posts','trailer-body','Resist forward cargo force and enclose the front of the trailer.','Check punctures, loose rivets and structural distortion.','Bulging wall, cracked corner member, water ingress.','Replace structurally compromised panels or posts.',120,1600,3,12,'high'],
  ['side-panels','Dry-van side panels','trailer-body','Enclose cargo and transfer lateral forces into structure.','Look for tears, popped rivets, corrosion and dents.','Cracked seams, daylight, water leaks.','Repair holes and structural damage using OEM method.',100,1800,2,14,'medium'],
  ['rub-rail','Trailer rub rail and side posts','trailer-body','Reinforce trailer sides and protect lower body.','Inspect welds, rivets and crush damage.','Separated rail or torn post.','Replace failed sections after structural assessment.',120,1200,3,10,'medium'],
  ['roof-panel','Trailer roof sheet / membrane','trailer-roof','Keeps precipitation out and stabilizes upper structure.','Inspect seams, punctures, bows and water stains.','Leaking roof, puncture, loose seams.','Seal approved minor leaks; replace damaged roof sections.',160,2500,3,20,'medium'],
  ['roof-bows','Roof bows and top rails','trailer-roof','Support roof and connect trailer sidewalls.','Inspect sagging, buckling, cracked joints and rust.','Loose bow, roof sag, cracked top rail.','Repair or replace structural members before loading.',140,1200,3,12,'high'],
  ['floor-deck','Trailer wood/composite floor','trailer-floor','Carries cargo and forklift point loads into crossmembers.','Check soft spots, broken boards and fastener protrusions.','Deflection, rot, puncture, damaged boards.','Replace damaged flooring to maintain load rating.',120,2200,4,20,'high'],
  ['floor-crossmembers','Crossmembers and lower rails','trailer-floor','Transfer cargo load to trailer beams and running gear.','Inspect cracks, severe corrosion and bent beams.','Buckled frame, fatigue crack, loose crossmember.','Repair under engineered/OEM procedures.',200,2400,4,18,'high'],
  ['cargo-straps','Cargo straps and ratchets','trailer-cargo','Restrain cargo against movement during driving and braking.','Check working load limits, tags, cuts and worn hardware.','Frayed strap, unreadable rating, bent hook.','Discard damaged or unrated restraints.',15,95,0,0,'high'],
  ['e-track','E-track, logistics posts and anchors','trailer-cargo','Provide rated tie-down points in the cargo area.','Inspect track deformation and fastener integrity.','Bent track, torn fasteners, cracks.','Replace weakened restraint anchors before use.',25,300,1,5,'high'],
  ['load-bars','Load bars / decking beams','trailer-cargo','Support or separate palletized cargo when approved for load.','Check ratings, locks, bent tubes and end caps.','Bent beam, weak locking end, missing label.','Remove defective equipment from service.',60,350,0,0,'high'],
  // LANDING GEAR
  ['landing-gear','Trailer landing gear assemblies','trailer-landing','Support trailer front when uncoupled from tractor.','Check leg tubes, gearbox, attachment welds and base plates.','Bent leg, jammed gearbox, cracked mount.','Repair or replace bent/failed supports before uncoupling.',400,1700,4,10,'high'],
  ['landing-crank','Landing-gear crank and gearbox','trailer-landing','Raise and lower trailer supports in high/low gear.','Inspect crank attachment, gears and smooth operation.','Skipped gears, excessive binding.','Replace damaged mechanism before it fails.',40,450,1,5,'medium'],
  ['landing-feet','Landing-gear sand shoes / feet','trailer-landing','Distribute load onto suitable firm ground.','Check flatness, cracks and contact with ground.','Bent shoe, split weld, sinking foundation.','Replace cracked feet; always use suitable supporting surface.',60,300,2,6,'high'],
  // TANDEM
  ['trailer-axles','Trailer axle beams and spindles','trailer-tandem','Carry trailer loads and transmit braking forces to frame.','Check bends, cracks, leaks and axle alignment.','Uneven tires, bent axle, hub overheating.','Repair or replace failed structural axle equipment.',850,2600,5,14,'high'],
  ['trailer-air-bags','Trailer air suspension springs','trailer-tandem','Carry trailer load and preserve designed ride height.','Check leak, rubbing, bellows cracks and valve operation.','Sagging, hissing, uneven ride height.','Replace leaking/damaged air bags.',95,350,1.5,4,'high'],
  ['trailer-hangers','Hangers, equalizers and torque arms','trailer-tandem','Locate trailer axles and maintain suspension geometry.','Inspect cracks, bushings and loosened connections.','Cracked hanger, dog tracking, clunks.','Replace failed components and verify alignment.',100,850,2,8,'high'],
  ['tandem-slider','Sliding tandem rail and lock pins','trailer-tandem','Allows axle group adjustment for correct load distribution.','Confirm every locking pin engaged and rails undamaged.','Pin not seated, damaged hole, slider creep.','Repair before travel if locking mechanism fails.',160,1900,3,12,'high'],
  ['trailer-hubs','Trailer hubs, bearings and seals','trailer-tandem','Support trailer wheels and maintain lubrication at axle ends.','Look for hot hubs, seal leaks, bearing play and cracked caps.','Hot hub, visible oil/grease leak, wheel play.','Service immediately if bearing/seal condition is unsafe.',80,650,2,7,'high'],
  // TIRES
  ['trailer-tire','Trailer tires','trailer-tires','Support trailer load and provide braking traction.','Check pressure cold, tread, cuts and dual spacing.','Sidewall bulge, separations, exposed cord, underinflation.','Replace unsafe tires or when at applicable wear limit.',225,620,0.5,1.5,'high'],
  ['trailer-wheels','Trailer rims and wheel studs','trailer-tires','Attach trailer tires to hubs and transfer loads.','Inspect loose/missing nuts, damaged rims and bolt holes.','Cracked rim, rust streaks, elongation.','Replace damaged wheel/hardware and use correct torque.',75,550,1,3,'high'],
  // TRAILER BRAKES & AIR
  ['trailer-drum','Trailer brakes / drums / pads','trailer-brakes','Generate stopping force at trailer wheels.','Check lining thickness, drum/rotor condition and pushrod travel.','Cracked drums, contaminated lining, dragging.','Replace at manufacturer’s wear limits or critical defect.',150,650,3,7,'high'],
  ['trailer-chamber','Trailer service/spring brake chambers','trailer-brakes','Apply trailer service braking and parking spring braking.','Check chamber mounts, leaks, travel and corroded housings.','Air leaks, damaged chamber, excessive stroke.','Replace defective units by trained personnel.',65,320,1.5,4,'high'],
  ['trailer-abs','Trailer ABS ECU and wheel sensors','trailer-brakes','Detect lockup and regulate trailer braking on equipped axles.','Check ABS indicator, wiring and diagnostic trouble codes.','Persistent ABS light, wheel sensor faults.','Repair confirmed wiring, modulator or sensor fault.',40,750,1,5,'high'],
  ['trailer-slacks','Trailer slack adjusters / S-cams','trailer-brakes','Convert chamber motion into foundation-brake action.','Inspect stroke, lubrication, cam play and brackets.','Excess travel, seized cam, worn clevis.','Correct underlying fault; replace worn components.',75,330,2,6,'high'],
  ['trailer-reservoir','Trailer air reservoirs','trailer-air','Store compressed air for service and emergency systems.','Check support straps, corrosion, drains and leakage.','Pressure loss, rust, cracks.','Replace defective reservoir and fittings.',100,550,2,6,'high'],
  ['trailer-relay','Trailer relay / emergency valves','trailer-air','Control service and emergency brake application.','Check correct air response and listen for leakage.','Brake delay, leak, uneven applications.','Replace confirmed failed valve.',90,520,2,6,'high'],
  ['trailer-airhoses','Trailer air hoses and couplings','trailer-air','Distribute air between front couplings, reservoirs and axles.','Check chafe, kinks, cracked fittings and leaks.','Hiss, supply loss, damaged hoses.','Replace compromised air lines with approved fittings.',15,300,1,5,'high'],
  // TRAILER ELECTRICAL & LIGHTS
  ['trailer-7way','Seven-way electrical receptacle','trailer-electrical','Interfaces tractor electrical supply to trailer lighting circuits.','Check corrosion, pin security, retaining latch and terminals.','Intermittent lights, arcing, damaged pins.','Replace burned/corroded connector.',35,180,1,3,'high'],
  ['trailer-harness','Trailer wiring harness','trailer-electrical','Distributes power to trailer marker, stop and turn circuits.','Inspect fraying, junction box seals and ground continuity.','Lights intermittently fail, exposed wire.','Replace damaged wiring and restore sealed routing.',60,750,1.5,9,'high'],
  ['rear-lights','Trailer tail / stop / turn lamps','trailer-lights','Show braking, turning and rear vehicle position.','Verify every lamp works and lens is intact.','Dead LED, cracked lens, water entry.','Replace before operation if required lamps fail.',20,180,0.3,2,'high'],
  ['side-markers','Trailer side markers and clearance lights','trailer-lights','Mark long vehicle sides and extreme dimensions.','Check illumination, seals and correct color/location.','Inoperative lamp, damaged lens.','Restore required lighting.',12,95,0.3,1.5,'high'],
  ['reflective-tape','Conspicuity tape and reflectors','trailer-lights','Improve visibility of trailer outline at night.','Inspect for missing, damaged or obscured reflective surfaces.','Peeling or missing retroreflective marking.','Replace insufficient retroreflective material.',20,220,0.5,3,'medium'],
  // REAR
  ['rear-doors','Rear cargo doors and hinges','trailer-rear','Provide access while keeping cargo enclosed.','Check door seals, structural cracks, hinges and frame.','Sagging door, broken hinge, water leak.','Repair failed door/hardware before transport.',120,1700,2,12,'high'],
  ['rear-latches','Rear door locking bars and cams','trailer-rear','Secure doors against opening during transit.','Check bar engagement, handle catches and hardware cracks.','Door will not latch, bent cam or missing keeper.','Replace defective latching hardware.',50,550,2,6,'high'],
  ['underride-guard','Rear impact / underride guard','trailer-rear','Helps mitigate underride in certain rear impacts.','Inspect deformation, corrosion, attachments and cracks.','Bent guard, failed weld or missing fasteners.','Replace/repair failed guard to applicable safety standards.',350,1900,3,9,'high'],
  ['trailer-mudflaps','Trailer mud flaps and supports','trailer-rear','Reduce water spray and debris behind rear tires.','Check tears, hang height and fastener security.','Missing or split flaps.','Replace damaged/missing flaps.',20,150,0.5,2,'medium'],
  ];

  // Inspection cycles are broad training prompts, not substitute OEM replacement schedules.
  const INTERVALS = {
    'Powertrain':'Before operation: check visible leaks, abnormal noise and warnings. At each OEM preventive-maintenance service: inspect related components and record findings.',
    'Fluids':'Before operation: check levels, caps and visible leaks as specified. Change/replace by exact engine and vehicle duty-cycle schedule; investigate contamination immediately.',
    'Steering & tires':'Before every trip: inspect tires, wheel hardware, suspension, steering condition and leaks. Schedule professional wear/alignment checks; remove unsafe components from service.',
    'Brakes & air':'Before every trip: perform applicable air-pressure/brake-system checks and inspect visible damage. Have a qualified shop measure wear/stroke during PM and annual inspection.',
    'Body & safety':'Before every trip: verify visibility, security, restraints and structural safety. Repair safety defects before operation; evaluate remaining items during fleet PM.',
    'Coupling':'Every coupling/uncoupling: inspect lock engagement, mounting, connectors and support surfaces. Lubricate/service to fifth-wheel or landing-gear manufacturer instructions.',
    'Electrical':'Before each trip: test mandatory lights and warning indicators. Check connectors and wiring condition during PM; diagnose persistent faults promptly.',
    'Structure & cargo':'Before each load/trip: inspect doors, body, load support and restraint equipment. Perform periodic structural review and the required annual inspection.'
  };
  const SPECIAL_INTERVALS = {
    'engine-oil':'Check level as specified before driving. Change engine oil plus filter at the OEM interval for the engine serial number, oil specification, fuel use and duty cycle; oil analysis may justify shortening an interval.',
    'oil-filter':'Replace at the same OEM service as the engine oil; inspect filter housing seals on each service.',
    'coolant':'Inspect level/leaks before driving when appropriate. Test freeze and inhibitor protection per coolant chemistry; replace/extend only as permitted by manufacturer.',
    'fuel-filter':'Inspect for water/restriction and leaks before operation where accessible. Replace filters at the OEM fuel-system maintenance interval or when contaminated.',
    'air-filter':'Inspect housing at PM; replace using air-intake restriction guidance or OEM interval, not appearance alone.',
    'air-dryer':'Monitor dryer purge and reservoir moisture in inspections. Service desiccant cartridge at the air-system manufacturer interval, adjusted for duty cycle.',
    'steer-tire':'Inspect before each trip. Under 49 CFR 393.75, front tires require at least 4/32 inch tread in a major groove; remove damaged/underinflated tires from service regardless of tread.',
    'drive-tire':'Inspect before each trip. Under 49 CFR 393.75, most non-front tires require at least 2/32 inch tread in a major groove; check dual spacing and tire load rating.',
    'trailer-tire':'Inspect before each trip. Under 49 CFR 393.75, trailer tires generally require at least 2/32 inch tread in a major groove; replace unsafe separations, exposed cord or leaks.',
    'tractor-drums':'Every pre-trip: check visible faults and braking operation. Have a technician measure lining, rotor/drum and pushrod travel at maintenance inspections.',
    'trailer-drum':'Every pre-trip: check braking faults. Have a technician measure lining, drum/rotor condition and brake adjustment at scheduled shop inspections.',
    'landing-gear':'Inspect support position and structural soundness whenever coupling/uncoupling; service gears and leg lubrication to manufacturer instructions.',
    'cargo-straps':'Inspect every strap before every securement use; immediately retire damaged/rating-illegible restraint devices.',
    'rear-lights':'Verify all required lights before every trip and after coupling; replace failed bulbs/assemblies before service.'
  };
  const zonesById = Object.fromEntries(ZONES.map(z=>[z.id,z]));
  const PARTS = rows.map(([id,name,zone,description,inspection,wear,replace,min,max,hrsMin,hrsMax,priority]) => ({
    id,name,zone,description,inspection,wear,replace,partsMin:min,partsMax:max,hoursMin:hrsMin,hoursMax:hrsMax,
    priority, vehicle: zonesById[zone].vehicle, system: zonesById[zone].system,
    interval: SPECIAL_INTERVALS[id] || INTERVALS[zonesById[zone].system] || 'Inspect before operation and service using the exact OEM manual.'
  }));

  const FLUIDS = [
    {id:'oil',name:'Engine oil + filter service',system:'Engine',min:43,max:43,unit:'L',type:'Published example',note:'43 L applies to specific Detroit DD15 EPA07–GHG17 truck engines per Detroit operator manual. Verify your engine model/year, sump and dipstick.',source:'https://dtnacontent-dtna.prd.freightliner.com/content/dam/public/dtna-servicelit/ddc/pdfs/OperatorsManual/DDPlatform/DDC-SVC-MAN-0189_2025.pdf'},
    {id:'coolant',name:'Engine coolant (total system)',system:'Cooling',min:40,max:65,unit:'L',type:'Illustrative range',note:'Varies by truck, radiator, heater circuit and engine. Never remove a hot pressure cap. Use OEM-approved coolant chemistry.'},
    {id:'fuel',name:'Diesel fuel (two 150 US-gal tanks)',system:'Fuel',min:1135.6,max:1135.6,unit:'L',type:'Illustrative configuration',note:'2 × 150 US gal × 3.785411784 = 1,135.6 L; actual usable volume may be lower and equipment varies.'},
    {id:'def',name:'DEF tank (20 US gallons)',system:'Aftertreatment',min:75.7,max:75.7,unit:'L',type:'Illustrative configuration',note:'20 US gal ≈ 75.7 L. DEF is not diesel fuel; use ISO 22241-compatible fluid only.'},
    {id:'trans',name:'Transmission lubricant',system:'Transmission',min:12,max:18,unit:'L',type:'Illustrative range',note:'Manual and automated transmissions have materially different fluid specifications/fill levels. Follow transmission tag and service instructions.'},
    {id:'axle1',name:'Drive axle differential #1',system:'Axles',min:12,max:20,unit:'L',type:'Illustrative range',note:'Per axle: depends on housing, hub arrangements and axle model; verify fill-plug level and approved viscosity.'},
    {id:'axle2',name:'Drive axle differential #2',system:'Axles',min:12,max:20,unit:'L',type:'Illustrative range',note:'Per axle: do not double count hub fill or assume a universal service volume.'},
    {id:'steer',name:'Hydraulic steering fluid (if equipped)',system:'Steering',min:3,max:6,unit:'L',type:'Illustrative range',note:'Some designs differ; use specified fluid and reservoir fill procedure.'},
    {id:'wash',name:'Windshield washer fluid',system:'Cab',min:4,max:8,unit:'L',type:'Illustrative range',note:'Reservoir size varies; use suitable seasonal washer solution.'},
    {id:'air',name:'Air-brake hydraulic fluid',system:'Braking',min:0,max:0,unit:'L',type:'Not applicable',note:'Pneumatic tractor/trailer air brakes use compressed air, not hydraulic brake fluid. Never pour hydraulic fluid into an air reservoir.'}
  ];
  const CHECKLIST = [
    ['approach','Walkaround / exterior','Verify vehicle stance, leaks underneath, unsecured objects and general damage.'],
    ['hood','Engine compartment','Check oil/coolant levels per OEM, leaks, belts, hoses, wiring, mounts and fluid caps.'],
    ['cab','Inside cab','Confirm seat belt, warning lamps, mirrors, windshield, gauges and emergency equipment.'],
    ['air','Air brake system','Perform applicable air pressure, leakage, warning-device and service-brake tests using your state/OEM method.'],
    ['steer','Steering axle and tires','Check tire condition, tread, wheel fasteners, hubs, steering play and suspension.'],
    ['drive','Drive axle group','Check dual tires, axle seals, suspension, brake hardware, air lines and frame attachments.'],
    ['couple','Fifth wheel and couplings','Verify locking engagement, kingpin area, mounts, glad hands, 7-way cord and landing gear.'],
    ['trailer','Trailer frame and cargo','Inspect trailer body, floor, securement, door hardware, tandem slider and load distribution.'],
    ['trailerbrakes','Trailer running gear','Inspect tires, hubs, suspension, brake chambers, air lines and trailer ABS indication.'],
    ['lights','Lights and conspicuity','Test required vehicle and trailer lamps, reflectors and retroreflective tape.'],
    ['final','Final walkaround','Check doors locked, landing gear fully raised, cargo secured and no visible hazards.']
  ];
  const SOURCES = [
    {name:'FHWA federal axle and gross limits / bridge formula',url:'https://ops.fhwa.dot.gov/freight/sw/faqs/qa.cfm'},
    {name:'Federal 23 CFR 658.17 weight regulation',url:'https://www.ecfr.gov/current/title-23/chapter-I/subchapter-G/part-658/section-658.17'},
    {name:'Detroit DD platform operators manual / DD15 service oil volume',url:'https://dtnacontent-dtna.prd.freightliner.com/content/dam/public/dtna-servicelit/ddc/pdfs/OperatorsManual/DDPlatform/DDC-SVC-MAN-0189_2025.pdf'},
    {name:'Heavy-duty repair industry labor survey (2025 median)',url:'https://www.fleetmaintenance.com/shop-operations/data-and-telematics/article/55366419/fullbay-fullbay-state-of-heavy-duty-repair-insights-into-labor-rates-and-technican-hiring'},
    {name:'Illustrative commercial tire retail listings',url:'https://libertytrucktires.com/how-much-do-semi-truck-tires-cost/'},
    {name:'FHWA bridge formula guidance',url:'https://ops.fhwa.dot.gov/freight/publications/brdg_frm_wghts/index.htm'},
    {name:'49 CFR 393.75 commercial vehicle tire rules',url:'https://www.ecfr.gov/current/title-49/chapter-III/subchapter-B/part-393/subpart-G/section-393.75'},
    {name:'49 CFR 396.13 driver inspection requirements',url:'https://www.ecfr.gov/current/title-49/chapter-III/subchapter-B/part-396/section-396.13'},
  ];
  return {ZONES,PARTS,FLUIDS,CHECKLIST,SOURCES};
})();
