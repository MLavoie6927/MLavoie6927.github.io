/*
 * ATLAS / CLASS 8 | Training scenarios and blueprint data
 * 2026-11-14 | Author: Marc Lavoie | Engineering lab v2.0
 * Original educational content. Not an OEM service manual.
 */
'use strict';
window.ATLAS_TRAINING = (() => {
  const SYSTEMS = {
    power: {
      label:'01 / ENERGY CONVERSION', name:'Diesel powertrain: chemical energy to wheel torque',
      summary:'The turbocharged diesel engine generates torque; the clutch and transmission adapt that torque, then the propeller shaft and tandem differentials send it to the driven tires. This conceptual schematic omits many components and controls.',
      nodes:[
        ['fuel','DIESEL FUEL','Metered supply','diesel-tanks','Fuel is delivered through filters and high-pressure injection controls.'],
        ['turbo','TURBOCHARGER','Air mass','turbocharger','Exhaust energy drives a compressor to increase intake-air density.'],
        ['engine','INLINE-6 ENGINE','Combustion / torque','engine-block','Combustion produces shaft torque; oil and coolant protect the mechanism.'],
        ['gear','TRANSMISSION','Ratios / clutch','transmission','Gears trade rotational speed against torque for launch and cruising.'],
        ['shaft','DRIVESHAFT','Torque transfer','driveshaft','A rotating shaft conveys output torque to the first drive axle.'],
        ['axle','DRIVE AXLES','Final drive','drive-differential','Differentials and axle shafts transmit torque to tractor drive tires.']
      ], connections:[[0,2],[1,2],[2,3],[3,4],[4,5]]
    },
    brakes: {
      label:'02 / COMPRESSED-AIR CONTROL', name:'Dual-circuit service brakes and trailer supply',
      summary:'Compressed air is stored, regulated and distributed to service-brake control circuits. The supply and service air paths have different jobs. Spring brakes provide parking/emergency function and must not be disassembled under spring load.',
      nodes:[
        ['compressor','COMPRESSOR','Pressurizes','air-compressor','Engine-driven compressor produces system air.'],
        ['dryer','AIR DRYER','Removes moisture','air-dryer','Filters moisture to protect valves, reservoirs and pneumatic components.'],
        ['reservoir','AIR TANKS','Stores pressure','air-tanks','Reservoirs store compressed air; actual primary/secondary plumbing varies.'],
        ['pedal','FOOT VALVE','Driver demand','foot-valve','Driver pedal controls service-braking requests.'],
        ['chambers','BRAKE CHAMBERS','Force at wheels','brake-chambers','Pressure actuates chambers and foundation brakes.'],
        ['trailer','TRAILER RELAY','Trailer service','trailer-relay','Trailer service circuit uses relays/chambers supplied from trailer air storage.']
      ], connections:[[0,1],[1,2],[2,3],[3,4],[2,5],[3,5]]
    },
    electrical: {
      label:'03 / POWER & COMMUNICATION', name:'Charging, control modules and 7-way trailer wiring',
      summary:'Batteries support cranking and loads, the alternator supplies running charge, ECUs supervise powertrain, and dedicated circuits connect lighting and diagnostic networks. This is a functional block diagram, not an electrical schematic for repair.',
      nodes:[
        ['battery','BATTERIES','DC storage','truck-batteries','Store electrical energy for engine starting and standby loads.'],
        ['alternator','ALTERNATOR','Charging','alternator','Converts shaft work to electrical power during engine operation.'],
        ['ecu','ECU / HARNESS','Powertrain data','vehicle-ecu','Computers process sensor measurements and control outputs.'],
        ['abs','ABS CONTROL','Wheel speed / modulate','abs-module','Coordinates anti-lock brake control at equipped axles.'],
        ['sevenway','7-WAY CABLE','Trailer power','tractor-pigtail','Electrical connector passes required trailer circuits.'],
        ['lamps','REAR LIGHTS','Visible signals','rear-lights','Turn, stop, marker and related lamps support vehicle visibility.']
      ], connections:[[0,1],[1,2],[2,3],[0,4],[4,5]]
    },
    coupling: {
      label:'04 / MECHANICAL CONNECTION', name:'Fifth wheel, kingpin and trailer connections',
      summary:'The fifth-wheel jaws capture the trailer kingpin; air and electrical connections support trailer braking and signaling. Landing gear is the trailer support when parked and uncoupled. Check every required connection before movement.',
      nodes:[
        ['fifth','FIFTH WHEEL','Load transfer','fifth-wheel','Transfers trailer vertical load through the tractor frame.'],
        ['lock','LOCKING MECHANISM','Kingpin capture','fifth-release','Locks coupling around the kingpin; inspect engagement by approved methods.'],
        ['air','GLAD HANDS','Air lines','gladhands','Connect trailer supply/emergency and service air circuits.'],
        ['cable','7-WAY PIGTAIL','Electrical','tractor-pigtail','Connects tractor and trailer lighting and other supported circuits.'],
        ['gear','LANDING GEAR','Parked support','landing-gear','Supports trailer nose before connecting or after uncoupling.'],
        ['frame','TRAILER CHASSIS','Cargo support','floor-crossmembers','Distributes cargo and running-gear loads.']
      ], connections:[[0,1],[1,5],[2,5],[3,5],[4,5]]
    },
    cargo: {
      label:'05 / LOAD PATH & RETENTION', name:'Dry van structure, restraints and running gear',
      summary:'A trailer floor routes forklift/cargo loads through crossmembers to its running gear and tractor connection. Restraints control cargo motion; tandem position affects axle loading. Roof and sidewalls are not substitutes for approved securement.',
      nodes:[
        ['cargo','CARGO / PALLETS','Loaded mass','cargo-straps','Distributed weight and the center of gravity drive handling and axle loads.'],
        ['restraints','E-TRACK','Restraint interface','e-track','Rated anchors and straps limit movement when used correctly.'],
        ['floor','FLOOR DECK','Load carrying','floor-deck','Deck strength and concentrated forklift loads depend on trailer rating.'],
        ['frame','CROSSMEMBERS','Structural path','floor-crossmembers','Transfer distributed and point forces into the chassis.'],
        ['tandem','TANDEM SLIDER','Axle placement','tandem-slider','Movement changes effective support geometry and load distribution.'],
        ['tires','TRAILER TIRES','Road contact','trailer-tire','Tire ratings and condition constrain safe load capacity.']
      ], connections:[[0,1],[0,2],[2,3],[3,4],[4,5]]
    }
  };
  const SCENARIOS = [
    {id:'air-leak',title:'Air pressure drops while parked',system:'Air brakes',severity:'CRITICAL',symptoms:['Pressure loss reported after service brakes are applied','Hissing near rear drive-axle brake circuit','Low-pressure warning is not yet active'],question:'What is the safest next action?',choices:['Keep driving; pressure will recover at highway speed.','Remove the brake chamber clamp and inspect the spring.','Take vehicle out of service for proper leak localization and qualified repair.'],answer:2,why:'A service-brake leak can compromise braking. Stop, document the issue and repair it. Spring brake chambers contain stored energy and must not be disassembled casually.',part:'tractor-airlines'},
    {id:'coolant-loss',title:'Rising temperature and low coolant',system:'Cooling',severity:'HIGH',symptoms:['Engine temperature trends upward','Coolant level is lower than normal','Wet residue appears along the radiator side tank'],question:'Which response addresses both safety and evidence?',choices:['Pull over safely, allow cooling, inspect for leaks under approved procedures; repair before service.','Open the expansion tank cap immediately while hot.','Ignore the temperature until the check-engine lamp illuminates.'],answer:0,why:'Overheating can cause serious damage. Never remove a hot pressurized cap. Investigate and correct coolant loss.',part:'radiator'},
    {id:'tire-cord',title:'Trailer tire shows exposed cords',system:'Tires',severity:'CRITICAL',symptoms:['One trailer tire has severe localized wear','Casing cord is exposed at the shoulder','Same wheel appears out of alignment'],question:'What is the best judgment?',choices:['Reduce speed and use the tire to finish the shift.','Do not dispatch; replace the unsafe tire and investigate alignment/suspension cause.','Add pressure above the tire sidewall specification to compensate.'],answer:1,why:'Exposed structural material is a safety defect. Correct the tire and underlying condition before operating.',part:'trailer-tire'},
    {id:'low-boost',title:'Loss of power with intake hiss',system:'Powertrain',severity:'MEDIUM',symptoms:['Engine feels weak under load','Hissing increases as boost demand rises','Oil film is visible at a charge-air hose clamp'],question:'Which check should come before replacing a turbocharger?',choices:['Replace all injectors immediately.','Disable emissions controls to remove derate.','Inspect and pressure-test charge-air hoses and connections as specified by the OEM.'],answer:2,why:'Boost leaks may mimic turbocharger failure. Confirm the fault through inspection and approved testing before parts replacement.',part:'intake-hoses'},
    {id:'brake-heat',title:'One wheel end is unusually hot',system:'Foundation brakes',severity:'CRITICAL',symptoms:['Heat odor after a relatively short drive','One brake/wheel-end is much hotter than its peers','Possible brake drag or bearing issue'],question:'What should you do?',choices:['Stop safely, isolate the vehicle from service and have the wheel end inspected by qualified personnel.','Spray water directly onto the hot drum to cool it.','Keep driving to polish the brake shoes.'],answer:0,why:'Localized excess heat may signal dragging brakes or wheel-end failure. Extreme heat can precede fire or seizure.',part:'tractor-drums'},
    {id:'coupler',title:'Fifth wheel appears incompletely locked',system:'Coupling',severity:'CRITICAL',symptoms:['Visual gap at fifth wheel/top plate seems abnormal','Lock indicator cannot be confirmed','Trailer is parked with landing gear lowered'],question:'Which action is appropriate before departure?',choices:['Raise landing gear and pull onto the road to test it.','Keep the trailer secured and repeat manufacturer-approved coupling/inspection checks; do not move until verified.','Insert a temporary pin or wire as a substitute for locking jaws.'],answer:1,why:'An insecure coupling can cause trailer separation. Inspect locking engagement and complete the approved tug/visual checks before movement.',part:'fifth-wheel'},
    {id:'electrical',title:'Trailer lamps flicker with movement',system:'Electrical',severity:'HIGH',symptoms:['Turn signals intermittently fail','Pigtail wiring is chafed near the connection','Connector shows green corrosion'],question:'Where should diagnosis begin?',choices:['Replace every trailer lighting module without tests.','Bypass fuse protection with heavier wire.','Inspect 7-way connector contacts, wiring, grounding and harness support; repair properly.'],answer:2,why:'Connections and grounds are a common root cause. Unsafe wiring changes introduce fire and lighting hazards.',part:'trailer-7way'},
    {id:'weight',title:'Scale ticket shows 35,400 lb on trailer tandems',system:'Payload',severity:'HIGH',symptoms:['Gross load is below 80,000 lb','Trailer tandem reads 35,400 lb','Route is a normal Interstate route without special permit'],question:'What is the best next step?',choices:['Rework the axle distribution and verify all limits on a new scale ticket before departure.','Assume 80,000 lb gross means every axle is legal.','Reduce tire pressure to increase tire contact area.'],answer:0,why:'A combination can be under the gross cap and still exceed a 34,000 lb federal tandem limit or lower equipment/route restrictions.',part:'tandem-slider'}
  ];
  const INSPECTION_STATIONS = [
    ['engine','Tractor','Engine oil & visible leaks','Check engine oil per OEM method, leaks, breather and oil-cap security.'],
    ['cooling','Tractor','Cooling system','Coolant level when safe, hose condition, radiator leaks and secure fan guards.'],
    ['belts','Tractor','Belts, hoses and clamps','Inspect cracking, abrasion, leaking connectors and loose supports.'],
    ['steering','Tractor','Steering gear and linkage','Check mounts, leaks, tie rods and steering system condition.'],
    ['steer-tire','Tractor','Steer tires and wheels','Tread, inflation/condition, sidewalls, fasteners and wheel integrity.'],
    ['front-brakes','Tractor','Front service brakes','Check hoses, chambers and foundation brakes for visible defects.'],
    ['cab','Tractor','Cab instruments / warning lamps','Check warning devices, ABS indications, seat belts and emergency equipment.'],
    ['mirrors','Tractor','Mirrors, windshield and wipers','Confirm visibility and required equipment condition.'],
    ['air','Tractor','Air system functional checks','Complete proper pressure, loss, alarm and braking-function checks.'],
    ['drives','Tractor','Drive-axle group','Inspect suspension, tires, hub leaks, wheel ends and fasteners.'],
    ['shaft','Tractor','Driveshaft and chassis','Look for damage, loose connections, frame defects and unsafe routing.'],
    ['fifth','Tractor','Fifth wheel and kingpin connection','Check coupled engagement, mounting, release mechanism and clearance.'],
    ['lines','Connection','Air lines and 7-way cable','Inspect glad hands, routing, connectors, abrasion and secure attachment.'],
    ['landing','Trailer','Landing gear','Confirm raised/stowed position when coupled; inspect damage and mounting.'],
    ['body','Trailer','Dry van body / frame','Check roof, floor, sidewalls, rear posts, cracks and structural defects.'],
    ['cargo','Trailer','Cargo restraints and distribution','Check cargo secured with correctly rated equipment.'],
    ['tandem','Trailer','Trailer suspension and tandems','Check slider locks, axle suspension, wheel bearings, tires and brakes.'],
    ['lights','Connection','Lights, doors and underride guard','Check all lamps, door latches, conspicuity and rear protection.']
  ].map(([id,vehicle,name,instructions])=>({id,vehicle,name,instructions}));
  const SERVICE_ITEMS = [
    ['oil','Engine oil / filter',25000,250000,'Sample interval only; varies strongly with OEM duty cycle and oil specification.'],
    ['fuel','Fuel filters / water separator',25000,250000,'Follow differential-pressure, contamination and OEM interval guidance.'],
    ['air-dryer','Air dryer cartridge',100000,200000,'Actual time, miles and duty cycle govern replacement.'],
    ['air-filter','Engine intake filter',50000,250000,'Restriction or damaged seals can override any mileage estimate.'],
    ['trans','Transmission lubricant',150000,150000,'Transmission model and fluid grade determine real interval.'],
    ['axle','Drive axle gear lubricant',100000,200000,'Axle make, lubricant and duty cycle determine interval.'],
    ['coolant','Cooling system condition test',25000,250000,'Fluid chemistry testing can trigger earlier service.'],
    ['brake','Foundation brake wear inspection',15000,270000,'Safety checks are needed before each trip; this is not the daily inspection schedule.'],
    ['wheel','Hub seals / wheel-end inspection',25000,250000,'Inspect for leaks, heat, bearing free play and lubricant condition.'],
    ['susp','Suspension and torque rods',25000,250000,'Visual inspection required more often based on duty.'],
    ['trailer','Trailer tandem slider / hardware',25000,250000,'Check locking pins and structural condition before dispatch.'],
    ['electrical','Battery / charging health',25000,250000,'Condition-based test; service sooner if symptoms are present.']
  ].map(([id,name,interval,last,note])=>({id,name,interval,last,note}));
  const QUIZ = [
    ['Which component captures the trailer kingpin?',['Alternator','Fifth wheel locking jaws','Trailer ABS module','Air dryer'],1,'The fifth wheel mechanically retains the trailer kingpin.','Coupling'],
    ['What does the air dryer remove from compressed air?',['Moisture','Diesel soot','Engine oil from the crankcase','Exhaust gases'],0,'The air dryer reduces water contamination in the pneumatic brake supply.','Air brakes'],
    ['What does a gross combination weight of 79,000 lb prove?',['Every axle is legal','The tires can carry 80,000 lb','Gross is below 80k, but axle and bridge limits still must be checked','The cargo must be exactly 46,000 lb'],2,'Gross weight alone does not establish compliance with tandem, bridge, tire or vehicle ratings.','Weights'],
    ['What is the primary role of the transmission?',['Cool exhaust','Store fuel','Control steering play','Adapt torque and rotational speed via gear ratios'],3,'Gear ratio changes how output torque and speed relate to engine speed.','Powertrain'],
    ['A trailer brake chamber has visible damage. What is safest?',['Ask qualified maintenance to assess; keep unsafe equipment out of service','Remove the spring brake clamp with hand tools','Ignore it if tires look good','Pump the brake pedal until it is fixed'],0,'Brake chambers are safety-critical and may contain hazardous stored spring energy.','Air brakes'],
    ['What is the purpose of the trailer landing gear?',['Replace the tractor suspension','Provide support when the trailer is uncoupled','Steer the rear wheels','Connect electrical lights'],1,'Landing gear supports the nose of an uncoupled trailer.','Coupling'],
    ['What is the name for the trailer rear wheels tracking inside the tractor path on turns?',['Hydroplaning','Brake fade','Off-tracking','Engine braking'],2,'The trailer follows a smaller turn radius, requiring careful clearance.','Trailer'],
    ['Which fluid does a conventional pneumatic air-brake tank use for braking?',['DOT 3 fluid','ATF','Hydraulic oil','Compressed air'],3,'These systems use compressed air; do not introduce hydraulic brake fluid into air tanks.','Air brakes'],
    ['Which value is published for specified DD15 oil-and-filter service fills?',['43 liters','5 liters','120 liters','300 liters'],0,'For specified Detroit DD15 versions, published oil-and-filter service fill is 43 L.','Fluids'],
    ['How should worn cargo straps be handled?',['Retighten indefinitely','Remove from service if damaged/unrated','Spray lubricant on webbing','Double the speed to limit movement'],1,'Damaged restraints cannot be assumed to meet their working load limits.','Trailer'],
    ['What do trailer relay valves accomplish?',['Generate electricity','Raise engine torque','Control service brake pressure using trailer air supply','Clean DPF soot'],2,'Relay valves help apply trailer service brakes.','Air brakes'],
    ['What should you do if wheel-end heat and smoke appear?',['Drive until smoke disappears','Spray cold water on hot drum','Increase following distance only','Stop safely and remove vehicle from service for evaluation'],3,'Excessive wheel-end temperature is an immediate safety concern.','Inspections'],
    ['What is a better first step for low boost and a split charge-air boot?',['Inspect/repair charge-air plumbing with proper diagnostics','Replace the turbo immediately','Replace clutch','Drain coolant'],0,'Symptoms can result from a pressure leak rather than turbocharger failure.','Diagnostics'],
    ['What does a tandem axle group commonly max out at under federal Interstate baseline rules?',['18,000 lb','34,000 lb','52,000 lb','80,000 lb'],1,'The federal baseline tandem limit is 34,000 lb, subject to exceptions and other constraints.','Weights'],
    ['How should an educational repair cost range be treated?',['As a binding dealer quote','As a manufacturer warranty','As an initial planning range to verify with actual part fitment and shop labor','As a fixed national price'],2,'Part costs and labor hours require specific vehicle, part, shop and work-scope validation.','Maintenance']
  ].map(([q,options,answer,why,topic])=>({q,options,answer,why,topic}));
  const SOURCES = [
    {name:'Federal weight limitations — 23 CFR § 658.17',type:'Regulation',description:'80,000 lb gross; 20,000 lb single; 34,000 lb tandem; bridge formula and exceptions.',url:'https://www.ecfr.gov/current/title-23/chapter-I/subchapter-G/part-658/section-658.17'},
    {name:'FHWA Bridge Formula Weights',type:'US DOT / FHWA',description:'Bridge formula explanation, group calculations and axle spacing illustrations.',url:'https://ops.fhwa.dot.gov/freight/publications/brdg_frm_wghts/index.htm'},
    {name:'FMCSA CDL Manual & testing guidance',type:'US DOT / FMCSA',description:'Knowledge test topics and official driver operating practices.',url:'https://www.fmcsa.dot.gov/registration/commercial-drivers-license'},
    {name:'Detroit DD15 Gen 5 oil-fill specifications',type:'OEM source',description:'Published 43-liter DD15 oil + filter service fill for specified models.',url:'https://www.dtnatechlit.com/portal-public/0000009834-dd-platform-gen-5-operator-manual/0000009834.xml/%24/0000008912'},
    {name:'49 CFR §393.75 — Tires',type:'Regulation',description:'Tire construction, tread depth and other minimum in-service rules.',url:'https://www.ecfr.gov/current/title-49/chapter-III/subchapter-B/part-393/subpart-G/section-393.75'},
    {name:'49 CFR §396.13 — Driver inspection',type:'Regulation',description:'Driver duties regarding safe condition and prior inspection record.',url:'https://www.ecfr.gov/current/title-49/chapter-III/subchapter-B/part-396/section-396.13'},
    {name:'Fullbay / ATA TMC 2026 State of Heavy-Duty Repair',type:'Industry survey',description:'Labor rate context: 2024 $135/h, 2025 $145/h, 2026 $149/h median survey figures.',url:'https://tmc.trucking.org/sites/default/files/Fullbay%27s%20State%20of%20Heavy-Duty%20Repair%20Report%202026.pdf'}
  ];
  return {SYSTEMS,SCENARIOS,INSPECTION_STATIONS,SERVICE_ITEMS,QUIZ,SOURCES};
})();
