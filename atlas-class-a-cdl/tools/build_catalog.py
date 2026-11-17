"""Deterministic, dependency-free Class A CDL training catalog compiler.
Author: Marc Lavoie — 2026-11-17. Data is illustrative; never a live routing feed.
Regulatory links are context, not an assertion that each specific incident violates that rule.
"""
import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
CATEGORIES = [
('R','Routing & GPS','routing','49 CFR § 392.2','https://www.ecfr.gov/current/title-49/section-392.2', '''
GPS directs a 13 ft 6 in rig toward a 12 ft 6 in bridge|Stop before the clearance; use an independently verified truck route|critical
Truck GPS proposes a road posted NO TRUCKS|Obey the sign; confirm whether a lawful local-access exception exists|critical
Posted bridge weight is below actual combination weight|Do not cross; verify route and bridge rating with the road authority|critical
Residential corner lacks turning radius for 53 ft trailer|Approach from a viable truck entrance or arrange a safe alternate|high
GPS directs combination vehicle onto a restricted parkway|Verify commercial vehicle restriction and bypass the parkway|critical
Intersection turn would sweep a sidewalk or pedestrian area|Do not attempt unsafe off-tracking; select a different turn|critical
Mountain switchback cannot accommodate combination length|Check vehicle length limits and choose an approved highway|critical
Local bridge has an axle restriction|Confirm actual axle weights and avoid incompatible structures|critical
Construction creates temporary overhead obstruction|Observe temporary signs and reroute before the work zone|high
Truck is directed through a tunnel with cargo restrictions|Check tunnel rules for vehicle class and cargo before entry|critical
Railroad hump crossing may high-center low trailer|Inspect approach geometry from a safe position; find a suitable crossing|critical
GPS route requires prohibited U-turn|Find a legal truck-scale turnaround instead of reversing in traffic|high
Designated truck route is temporarily closed|Use the road authority's commercial-vehicle detour|high
Bridge clearance sign conflicts with navigation data|Treat posted restriction as controlling; stop and verify|critical
Narrow shoulder is unsuitable for loaded trailer|Stay off unsupported shoulder and seek a safe stopping point|high
Dead-end road has no combination-vehicle turnaround|Confirm exit feasibility before entering|high
Truck-profile height was entered incorrectly in GPS|Correct actual measured vehicle height and replan|high
Mapping app uses outdated truck restrictions|Check current DOT sources and submit a data correction|medium
Navigation sends a Class A truck onto a passenger-car-only ferry|Verify ferry weight, height, reservation and vehicle-category rules|high
Exit ramp radius cannot accommodate longer combination|Use designated oversize/truck approach and verify permitted geometry|high
Road has temporary one-lane width reduction|Check physical width, mirrors, escorts, and official restrictions|high
Navigation uses unpaved farm lane unsuitable for loaded semi|Avoid the unverified road and seek a rated paved approach|high
GPS suggests a road with a seasonal commercial vehicle ban|Confirm date-effective restrictions and reroute as required|high
Freeway interchange closure routes semi through residential area|Use official signed commercial detour and obtain road authority guidance|high
A narrow canopy blocks tractor or trailer clearance|Verify structure height and do not enter without assured clearance|critical
Express lane has a commercial vehicle exclusion|Follow posted lane restrictions and use authorized lanes|high
Navigation omits a truck-specific toll or permit gate|Confirm classification, payment, and routing rules before entry|medium
Trailer rear overhang conflicts with posted turn geometry|Find an alternate approach accommodating effective swept path|high
Conflicting truck route signs create uncertainty|Pull off legally; obtain confirmation from local road authority|high
Restricted city bridge is the shortest GPS path|Prioritize legal permitted truck bridge over shortest travel distance|critical
'''),
('P','Pickup & yard access','pickup','Operational safe-access practice','https://www.fmcsa.dot.gov/ourroads/tips-truck-and-bus-drivers', '''
Pickup address points to wrong warehouse building|Verify location, dock number and shipping reference before arrival|medium
GPS selects the employee-car gate instead of truck gate|Request receiving-gate instructions and reapproach legally|high
Warehouse is reachable only via signed truck-restricted segment|Verify any authorized local-delivery exception with road authority|high
Assigned dock is too short for 53 ft trailer|Request a compatible dock or approved alternate loading method|high
Yard lacks clearance for blind-side backing|Stop; coordinate a safer setup or a trained spotter|high
Dock approach requires backing across live street|Obtain authorized traffic control and yard supervision|critical
Gate width appears narrower than truck and mirrors|Verify real clearance before entering|high
Utility wiring over truck entrance hangs low|Stop outside area and seek facility safety personnel|critical
Dock worker directs driver past a posted safety barricade|Refuse unsafe maneuver and escalate to yard management|high
Gate appointment is outside open hours|Document arrival and contact dispatch/receiving|low
Assigned door is blocked by staged trailers|Wait in safe staging area and ask for reassignment|medium
Loading ramp is cracked or unstable|Stop and request a structural safety assessment|critical
Receiver insists on unsafe jackknife angle|Request alternate staging or a different dock|high
Facility has no marked truck circulation pattern|Call shipping office for route-specific instructions|medium
Site has no safe exit after truck check-in|Verify maneuver and egress before entering|high
Security guard refuses entry despite correct load details|Secure arrival evidence and coordinate authorization|medium
Truck queue blocks emergency access lane|Do not stage there; seek authorized overflow parking|high
Truck check-in requires stopping on interstate shoulder|Do not wait on highway shoulder unless legally necessary; find a suitable staging lot|critical
Yard speed and forklift separation rules are unclear|Request site briefing and maintain separation|medium
Uneven gravel lot creates jackknife or rollover risk|Assess traction and ground conditions before entering|high
Pickup gate instructions omit turn-by-turn access|Validate entrance with carrier and facility before last-mile approach|medium
Yard entrance is blocked by roadwork at shift change|Do not force entry; contact facility for alternate commercial gate|high
'''),
('L','Loading & securement','loading','49 CFR § 392.9; Part 393 Subpart I','https://www.fmcsa.dot.gov/regulations/cargo-securement/cargo-securement-rules', '''
Gross weight exceeds applicable legal limit|Obtain compliant load adjustment and verify with a scale|critical
Drive or trailer axle is overweight despite legal gross|Adjust loading or axle position when permitted; reweigh|critical
Pallet weight is concentrated on one side|Request redistribution to manage axle loads and stability|high
Flatbed load has inadequate tiedowns|Stop departure and satisfy cargo-specific securement rules|critical
Pallet stack is leaning or damaged|Require restacking and confirm load stability|high
Bill of lading weight differs from scale ticket|Resolve discrepancy and retain records before departure|high
Forklift load exceeds trailer-floor rating|Confirm trailer design capacities and stop unsafe loading|critical
Sealed trailer is unexpectedly overweight|Resolve with shipper while preserving seal and accountability|high
Sliding tandems change bridge/axle or overall length compliance|Recheck jurisdiction rules and reweigh before departing|high
Freight shifts after sudden braking|Stop safely and inspect/resecure before continuing|critical
Hazmat package is leaking at pickup|Do not load or transport leaking package; isolate area and summon qualified responders|critical
Reefer unit temperature deviates from shipment requirements|Record readings, troubleshoot, and contact shipper|high
Trailer suspension sags unevenly after loading|Check weight distribution and suspension condition before moving|high
Dunnage is missing for rounded machinery|Use cargo-specific blocking and bracing under applicable rules|high
Stacked material may contact trailer roof|Stop loading and verify internal clearance and stacking limits|medium
Shipper requests driver sign for uninspected cargo|Record limitations accurately; do not certify unverified facts|medium
Cargo extends beyond permitted trailer envelope|Verify permits and marking/lighting requirements before departure|critical
Straps are frayed or ratchets are damaged|Remove defective securement equipment from service|critical
Load bars are insufficient for freestanding freight|Use validated restraint method for product and trailer|high
Scheduled cargo reinspection was skipped|Complete inspection when safe and where required by 49 CFR § 392.9|high
'''),
('D','Delivery & unloading','delivery','Operational safe-access practice','https://www.osha.gov/trucking-industry/loading-unloading', '''
Delivery route ends at downtown curb with no truck access|Coordinate lawful unloading access in advance|high
Customer requests unloading in a no-parking truck zone|Find an authorized dock or obtain applicable approval|high
Receiver expects trailer to block active traffic lane|Request a traffic-control plan or alternate location|critical
Dock plate is not compatible with trailer floor height|Verify load capacity, placement and safe operating conditions|high
Facility is closed at scheduled arrival|Record arrival, contact dispatch and reschedule|low
Receiver refuses visibly damaged cargo|Photograph condition, preserve paperwork, and get instructions|medium
Unloading shifts trailer weight dangerously|Stop movement and coordinate proper unloading sequence|critical
Dock restraint has not been engaged|Confirm restraint/chocks and communication before unloading|critical
Receiver requests trailer drop without authorization|Verify carrier, site and equipment security requirements|medium
Proof of delivery lacks signature or exception detail|Resolve records promptly without falsifying them|medium
Backing from dock requires crossing a pedestrian path|Get site assistance and ensure path is clear|high
Liftgate or portable ramp is undersized for freight|Do not overload equipment; arrange rated handling method|critical
Trailer is still being loaded when driver is told to depart|Confirm release from dock personnel before moving|critical
Receiver requires illegal sidewalk maneuver|Request compliant alternate unloading plan|high
Drop yard has no suitable landing-gear surface|Find stable approved ground or arrange support|high
Local delivery exception is uncertain|Verify legal eligibility for route segment before entering|high
Receiver changes destination while driver is en route|Authenticate instructions and revalidate routing|medium
Customer demands unloading during lightning or violent wind|Suspend exposed operations when unsafe|high
'''),
('C','DOT, HOS & paperwork','compliance','49 CFR Parts 392 and 395','https://www.fmcsa.dot.gov/regulations/hours-service/summary-hours-service-regulations', '''
Dispatcher schedules travel beyond available HOS driving time|Replan using actual ELD clock and notify dispatch|critical
Late shipper loading consumes the duty window|Update ETA and plan lawful rest rather than rush|high
Dispatch asks driver to ignore a bridge restriction|Do not violate restriction; request legal route and document change|critical
Qualifying driving break has not been taken|Stop safely for applicable 30-minute non-driving period when required|high
ELD malfunctions during active trip|Follow malfunction reporting and backup record rules|high
Driver is pressured to falsify duty status|Maintain truthful records and escalate to safety/compliance|critical
Roadside inspector places vehicle out of service|Do not operate until requirements for return to service are met|critical
Dispatch orders movement with an unsafe brake defect|Hold vehicle and request authorized repair|critical
Hazmat load route conflicts with restricted highway|Verify Part 397 and state routing before driving|critical
Pickup times collide with required rest|Renegotiate appointment and plan safe parking|high
Oversize permit has wrong route or date|Correct permit conditions before trip|critical
Rail crossing requires a stop under applicable rule|Use required stopping and clearance procedures|high
Driver's medical certification status is unclear|Verify current qualification before dispatching|high
Class A driver lacks required endorsement for configuration|Confirm endorsements/restrictions before operating|critical
International trip documents are incomplete|Check carrier/customs requirements before border approach|medium
Pre-trip identifies defective required lighting|Ensure vehicle is safe and legal before driving|high
False arrival or departure timestamp requested|Record factual times and preserve evidence|medium
Driver unsure whether short-haul exception applies|Validate eligibility against current regulation and carrier policies|high
'''),
('M','Mechanical & coupling','equipment','49 CFR § 392.7; Part 393','https://csa.fmcsa.dot.gov/SafetyPlanner/MyFiles/SubSections.aspx?ch=23&eta=41898&sec=68&sub=166', '''
Air pressure cannot reach safe operating range|Do not move; diagnose brake/air system|critical
Steer-axle tire shows exposed cord|Remove vehicle from service and repair tire|critical
Trailer turn signals fail during pre-trip|Repair lighting before operating as required|high
Fifth-wheel jaws may not fully engage kingpin|Secure rig and conduct proper coupling verification|critical
Gladhand air connection leaks after coupling|Correct air leak and retest brake function|critical
Engine overheats while climbing steep grade|Use a suitable stopping location and follow service guidance|high
Powertrain unexpectedly loses propulsion in traffic|Safely secure truck and request roadside service|critical
Landing gear foot is bent on unsupported surface|Stabilize trailer and arrange qualified support|high
ABS fault indicator appears on trailer|Inspect system and determine legal roadworthiness|high
Trailer door latch will not hold closed|Repair or secure door correctly before departure|high
Service brakes pull sharply during a controlled test|Stop and request inspection and repair|critical
Brake chamber or hose is visibly damaged|Remove from operation pending qualified repair|critical
Suspension airbag is leaking near highway shoulder|Move only as legally and physically safe; arrange service|high
Trailer wheels appear misaligned after curb contact|Inspect running gear and suspension before resuming|high
Kingpin height causes high-hook risk|Reset fifth-wheel approach and verify proper coupling|critical
Trailer brake release unexpectedly sticks|Do not drag brakes; troubleshoot safely|high
Tire heat or smoke observed in mirror|Stop at safe location and manage fire risk|critical
Reefer fuel or power loss threatens refrigerated shipment|Secure product, troubleshoot, and notify carrier|high
'''),
('W','Weather & emergencies','weather','49 CFR § 392.14','https://www.ecfr.gov/current/title-49/section-392.14', '''
Black ice develops before mountain descent|Reduce speed and suspend travel if no safe control margin|critical
High crosswinds threaten empty trailer rollover|Follow restrictions and stop in a safe sheltered place|critical
Dense fog makes stopping sight distance inadequate|Reduce speed and discontinue operation when unsafe|critical
Snowstorm causes chain-control requirements|Use compliant traction devices where required or wait|high
Floodwater covers rural truck route|Never enter uncertain floodwater; reroute|critical
Shoulder collapses after repeated heavy rain|Avoid shoulder and report hazard to road authority|critical
Wildfire closure blocks planned corridor|Obey incident command and closure directions|high
Crash scene has no safe passage for a tractor-trailer|Follow lawful traffic control and plan a safe detour|high
Truck is disabled on a limited-access highway|Activate required warnings and request assistance from safe position|critical
Blizzard closes truck stop and next parking site|Plan lawful shelter and coordinate HOS impacts|high
Grade is iced over with limited runaway options|Do not begin descent without suitable traction and route conditions|critical
Lightning threatens open flatbed securement work|Suspend exposed work and move to safety|high
Extreme heat causes tire and cooling-system risks|Increase inspections and follow equipment guidance|medium
Storm damages overhead signals and powerlines|Do not approach fallen wires; contact emergency services|critical
'''),
('S','Security & cargo fraud','security','Carrier security practice','https://www.fmcsa.dot.gov/ourroads/tips-truck-and-bus-drivers', '''
All truck stops near HOS limit are full|Plan authorized parking early and contact dispatch|high
Fuel stop has low canopy and passenger-car pumps|Use verified commercial truck fuel island|high
Unknown people appear to surveil trailer at rest area|Avoid confrontation and relocate or call authorities when appropriate|high
Trailer seal appears altered during stop|Document, protect cargo and report chain-of-custody concern|high
Caller redirects high-value cargo to new warehouse|Authenticate with known dispatcher and shipper contacts|critical
Unverified text message changes delivery address|Confirm using established independently known contact|critical
Crowded truck stop requires high-risk backing maneuver|Use safer stall or trained assistance rather than forcing it|high
Forklifts and pedestrians share busy unloading lane|Maintain separation and coordinate with site supervisor|high
Driver loses cellular service on remote trip|Use planned check-ins and available emergency communications|medium
Trailer is struck overnight in parking lot|Preserve photos, report damage, verify roadworthiness|medium
Driver is offered cash to break seal early|Decline unauthorized handling and notify carrier|high
Suspicious request to share ELD or carrier credentials|Do not disclose; verify identity through known channels|high
Roadside individual impersonates dispatch|Authenticate request through official company channels|high
Driver is followed after leaving high-value pickup|Use safe public location and contact law enforcement when warranted|high
A purported broker changes payment and consignee terms|Seek independent authorization and record revision|high
Preloaded trailer's ID mismatches dispatch paperwork|Stop transfer; verify trailer and shipment identity|high
'''),
('H','Hazmat & specialized cargo','hazmat','49 CFR Parts 171–180 and 397','https://www.ecfr.gov/current/title-49/subtitle-B/chapter-III/subchapter-B/part-397', '''
Hazmat tunnel prohibits shipment classification|Review approved route and avoid prohibited facility|critical
Placards are missing for a placardable shipment|Do not depart until requirements are satisfied|critical
Shipping papers do not match packaged hazardous material|Verify classification and documentation with shipper|critical
Emergency response information is unavailable|Obtain required transport documents before moving|critical
Cargo leakage or odor is detected in trailer|Secure area without exposure and contact emergency responders|critical
Hazmat route crosses restricted urban corridor|Validate state/local designation and permitted approach|critical
Driver lacks required hazardous materials endorsement|Do not operate covered shipment until qualified|critical
Incompatible hazardous materials are loaded together|Request qualified compliance review and correct segregation|critical
Tanker surge affects braking distance|Allow appropriate speed and following distance based on load|high
High center of gravity tanker approaches off-ramp curve|Reduce speed and manage rollover risk before curve|high
Temperature-sensitive dangerous goods overheat|Follow shipping and emergency response procedures|critical
Hazmat parking location may violate attendance restrictions|Verify Part 397 requirements before stopping|high
Radioactive shipment requires route or security control|Follow applicable shipment-specific instructions and law|critical
Hazmat incident is reported through unverified contact|Use required emergency/incident reporting channels promptly|high
'''),
('O','Oversize & overweight','oversize','State permits and 23 CFR Part 658','https://ops.fhwa.dot.gov/freight/sw/faqs/qa.cfm', '''
Permit route includes bridge outside approved axle grouping|Do not travel until permit and route are corrected|critical
Escort vehicle is absent where permit requires it|Hold movement until conditions are met|critical
Load exceeds width permitted on local street|Use correct permit/authorized route|critical
Daylight-only oversize move is scheduled at night|Follow permit time limitations and reschedule|high
Temporary bridge closure invalidates approved itinerary|Obtain amended route approval before proceeding|critical
Pilot car communication fails during permitted movement|Stop at safe location and restore coordination|high
Overheight load meets overhead utility line|Do not proceed without required utility coordination|critical
Permit specifies different axle spacing than actual rig|Correct permit before operation|critical
Traffic control for wide-load turn is not available|Arrange required authorized controls before move|high
Weight station directs oversize rig to special inspection bay|Follow designated instructions and permit documents|medium
Different states impose different load marking rules|Confirm route-specific flags, signs and lighting|high
Multi-axle trailer steering fails before tight intersection|Secure movement and obtain qualified service|critical
'''),
('X','Railroad & grade crossing','rail','49 CFR §§ 392.10–392.11','https://www.ecfr.gov/current/title-49/section-392.10', '''
Lowboy trailer may high-center at raised rails|Find alternative crossing before entering|critical
Crossing signal activates while tractor approaches|Stop safely and obey signals; never try to beat train|critical
Stopped traffic leaves no room for full combination past rails|Do not enter until the entire vehicle can clear|critical
Truck stalls on railroad crossing|Get everyone clear and contact railroad emergency number and 911|critical
GPS directs truck around closed crossing gates|Never bypass gates; find another lawful route|critical
Poor sightlines at private industrial rail crossing|Use proper safe-crossing procedures and facility controls|high
Crossing is under construction with temporary grade change|Check advisories and use approved detour|high
Rail crossing angle causes trailer tires to track off pavement|Find approved approach with adequate geometry|high
Hazmat vehicle must stop at covered railroad crossing|Comply with applicable required stop procedures|high
Driver misses posted crossing emergency notification sign|Locate crossing ID and report hazard to railroad authority|medium
'''),
('K','Parking, fuel & rest','parking','Operational trip-planning practice','https://www.fmcsa.dot.gov/ourroads/tips-truck-and-bus-drivers', '''
Trip plan assumes parking availability at end of duty window|Identify earlier backup parking and legal rest options|high
Fuel station entrance has insufficient radius|Choose verified truck fuel facility|high
Truck stop exit is blocked by improper parking|Request facility assistance instead of dangerous maneuver|medium
Rest area limits commercial vehicles overnight|Confirm posted parking rules and relocate legally|medium
Truck stop canopy has unverified height clearance|Do not enter until clearance is confirmed|critical
Unsecured drop trailer is vulnerable to theft|Use approved drop zone and follow locking/seal policy|high
Driver needs parking before an urban restricted corridor|Stage at verified legal location outside restricted area|high
Rest stop is full during winter storm|Coordinate safe alternative parking and delay|high
Driver is instructed to park on entrance ramp|Reject unlawful/dangerous parking and find safe alternative|critical
Fuel plan ignores vehicle weight and grade conditions|Add appropriate reserves and truck-capable fueling options|medium
'''),
('I','Intermodal, doubles & specialty trailers','intermodal','Configuration-specific rules and carrier practice','https://www.fmcsa.dot.gov/faq/what-drivers-responsibility-when-transporting-intermodal-equipment-ime', '''
Intermodal chassis twist locks are not fully engaged|Stop and verify container securement and chassis condition|critical
Container gross weight conflicts with paperwork|Resolve certified weights and axle distribution before moving|high
Doubles combination lacks endorsement authorization|Do not operate without required qualification|critical
Converter dolly connections require verification|Complete air, electrical, coupling and safety checks|critical
Two-trailer combination is sent through length-restricted downtown street|Use suitable routes for total combination configuration|critical
Lowboy deck has minimal breakover clearance|Assess grade changes and rail crossings before route|critical
Flatbed tarping requires working at height in high wind|Suspend unsafe tarp work and use suitable fall protections|high
Tanker unload site lacks suitable containment|Verify qualified unloading arrangements before transfer|high
Specialty trailer brake controls are unfamiliar|Obtain proper equipment training before movement|high
Intermodal terminal requires restricted queue appointment|Verify terminal booking and commercial lane procedures|medium
'''),
('Q','Dispatch, claims & communication','communications','Operational records and safety practice','https://www.fmcsa.dot.gov/ourroads/tips-truck-and-bus-drivers', '''
Dispatcher gives instructions that contradict posted signs|Treat signs/legal requirements as controlling; report discrepancy|critical
Shipper changes pickup window without notifying carrier|Document changes and request amended dispatch|medium
Broker sends incompatible appointment references|Verify through recognized shipment contacts|medium
Customer demands delivery before legally possible ETA|Communicate lawful revised ETA and rest plan|high
Carrier and receiver disagree about detention timing|Record timestamps and coordinate contract handling|medium
Driver reports a road hazard but cannot provide exact location|Record nearest intersection, route direction and mile marker|medium
Wrong gate information keeps reappearing in driver notes|Request correction to facility master-data record|medium
Mapping hazard report has no evidence or authority source|Mark as unverified and request corroboration|medium
Driver thinks local road is legal because another truck used it|Verify actual current restrictions; other traffic is not proof|high
Fleet system treats one driver's observation as official road closure|Keep unverified reports separate from authoritative restrictions|high
'''),
]

SOURCES=[
 ('FMCSA GPS recommendations','https://www.fmcsa.dot.gov/faq/what-tips-fmcsa-providing-safe-use-gps-navigation-systems','Guidance','Truck GPS and obeying signs'),
 ('FMCSA GPS Selection Guide','https://www.fmcsa.dot.gov/sites/fmcsa.dot.gov/files/docs/GPS_Visor_Card_508CLN.pdf','Guidance','Commercial navigation setup'),
 ('FMCSA HOS summary','https://www.fmcsa.dot.gov/regulations/hours-service/summary-hours-service-regulations','Federal','Property-carrying hours of service'),
 ('FMCSA cargo securement','https://www.fmcsa.dot.gov/regulations/cargo-securement/cargo-securement-rules','Federal','General and commodity-specific requirements'),
 ('49 CFR § 392.2','https://www.ecfr.gov/current/title-49/section-392.2','Federal','Compliance with operating laws'),
 ('49 CFR § 392.9','https://www.ecfr.gov/current/title-49/section-392.9','Federal','Cargo inspection and securement'),
 ('49 CFR § 392.14','https://www.ecfr.gov/current/title-49/section-392.14','Federal','Hazardous road conditions'),
 ('49 CFR Part 397','https://www.ecfr.gov/current/title-49/subtitle-B/chapter-III/subchapter-B/part-397','Federal','Hazardous-material routing / parking'),
 ('FHWA CMV size FAQ','https://ops.fhwa.dot.gov/freight/sw/faqs/qa.cfm','Federal','Height limits and state rules'),
 ('NYC DOT trucks and routes','https://www.nyc.gov/html/dot/html/motorist/trucks.shtml','Local','New York City commercial restrictions'),
 ('NYC DOT size and weight','https://www.nyc.gov/html/dot/html/motorist/sizewt.shtml','Local','NYC dimension and 53-foot trailer rules'),
 ('CT DOT parkway restrictions','https://portal.ct.gov/dot/home/travel-gateway/roads-and-highways/parkway-restrictions','State','Connecticut restricted parkways'),
 ('Colorado DOT Independence Pass','https://www.codot.gov/travel/independencepass','State','35-foot vehicle-length restriction'),
 ('OSHA loading and unloading','https://www.osha.gov/trucking-industry/loading-unloading','Workplace','Loading-dock safety'),
 ('FMCSA CDL driver / endorsements','https://www.fmcsa.dot.gov/registration/commercial-drivers-license/drivers','Federal','Doubles/triples and other endorsements'),
 ('FMCSA intermodal equipment','https://www.fmcsa.dot.gov/faq/what-drivers-responsibility-when-transporting-intermodal-equipment-ime','Federal','IME driver inspections'),
]
CONTEXT={
'routing':('A truck-compatible navigation path is proposed, but an actual physical or legal restriction may conflict with it.','Driver: stop safely before the obstacle, check posted controls and current road-authority information.','Dispatch: validate a truck-legal alternate route and communicate gate-specific instructions.'),
'pickup':('A Class A combination approaches a shipper, commercial gate or loading yard with access uncertainty.','Driver: assess entrance, backing envelope and vehicle clearance without blocking live traffic.','Facility: confirm authorized truck entrance, safe staging and suitable dock.'),
'loading':('The trailer is being loaded or prepared for movement and weight or restraint is uncertain.','Driver: inspect and confirm proper load distribution, weight and applicable cargo securement.','Shipper: correct the loading condition and provide accurate shipping details.'),
'delivery':('A combination vehicle arrives at a receiver where unloading conditions are uncertain.','Driver: secure equipment, confirm dock conditions and avoid premature movement.','Receiver: provide safe access, controls and authorized unloading arrangements.'),
'compliance':('A trip instruction creates tension with operating requirements, documents or driver qualification.','Driver: follow current applicable law and keep accurate records.','Safety/dispatch: revise trip plan and resolve compliance concerns.'),
'equipment':('A pre-trip or in-service observation suggests a tractor, trailer or coupling defect.','Driver: stop or hold departure where operation is unsafe, inspect and document.','Maintenance: determine serviceability and perform qualified repair.'),
'weather':('Adverse conditions change the safety of the originally planned truck route.','Driver: reduce risk, stop when conditions become sufficiently dangerous and seek safe shelter.','Dispatch: replan ETA, rest and route without pressuring unsafe movement.'),
'security':('An operational event involves cargo identity, potential theft, driver security or unauthorized instructions.','Driver: prioritize personal safety, preserve evidence and independently authenticate changes.','Carrier security: verify contacts, safeguard cargo and escalate when warranted.'),
'hazmat':('Hazardous or specialized cargo has requirements in addition to ordinary truck routing.','Driver: verify shipment classification, paperwork, endorsement and applicable route.','Qualified hazmat staff: resolve classification, segregation, response and routing issues.'),
'oversize':('A permitted vehicle or nondivisible load has dimensions/weights beyond ordinary operating limits.','Driver: comply with permit route, escort and time restrictions.','Permit coordinator: obtain amendments for route or configuration changes.'),
'rail':('A Class A combination approaches or occupies a rail-highway grade crossing.','Driver: do not enter unless able to clear tracks and obey warning systems.','Rail authority / dispatch: assist with a safe crossing option or emergencies.'),
'parking':('Parking or fueling access has not been verified for the actual combination dimensions.','Driver: choose suitable legal truck facilities before reaching a critical HOS window.','Dispatch: help identify verified alternatives and allow lawful rest.'),
'intermodal':('A Class A vehicle tows a container chassis, doubles or specialty trailer with distinct handling characteristics.','Driver: confirm training, qualification, coupling and route compatibility.','Fleet maintenance/terminal: address equipment and access conditions.'),
'communications':('Dispatch or shipper records conflict with operating conditions or official restrictions.','Driver: document the facts and verify changes using established channels.','Dispatch: correct master data and update the lawful plan.'),
}

HIGH_RISK_WORDS=('low bridge','bridge','rail','hazmat','rollover','air pressure','brakes','crash','leaking','unsafe','no trucks','out of service','sign','overhead','permit')
items=[]
category_meta=[]
for pref,label,stage,reg,url,rows in CATEGORIES:
    parsed=[]
    for raw in rows.strip().splitlines():
        parts=[s.strip() for s in raw.split('|')]
        if len(parts)!=3: raise ValueError((label,raw))
        title,action,risk=parts
        if risk not in ('critical','high','medium','low'): raise ValueError((title,risk))
        parsed.append((title,action,risk))
    category_meta.append(dict(id=pref, name=label, stage=stage, count=len(parsed), reference=reg, link=url))
    ctx,driver,other=CONTEXT[stage]
    for i,(title,action,risk) in enumerate(parsed,1):
        items.append(dict(
          id=f'{pref}{i:03d}',category=pref,stage=stage,title=title,severity=risk,
          situation=ctx+' Situation: '+title+'.',action=action,
          driver=driver,coordination=other,
          unsafe='Do not assume a passenger-car GPS instruction, schedule, or verbal assurance overrides posted restrictions or a physical hazard.',
          evidence='Record road or facility name, approach direction, time, relevant signs or measurements, and independently verified source if available.',
          basis=reg,basisType='Regulatory context' if ('49 CFR' in reg or '23 CFR' in reg or 'Part' in reg or 'State permits' in reg) else 'Operational guidance',
          source=url,tag=(['routing','clearance'] if 'bridge' in title.lower() or 'height' in title.lower() else [stage])
        ))
for c in category_meta: print(c['id'],c['count'])
print('TOTAL',len(items))
assert len(items)>=200
ids=[s['id'] for s in items]; assert len(ids)==len(set(ids))
output={'version':'1.0.0','asOf':'2026-11-17','title':'ATLAS Class A CDL Safety & Routing Studio','categories':category_meta,'scenarios':items,'sources':[dict(title=a,url=b,kind=c,note=d) for a,b,c,d in SOURCES]}
(ROOT/'js'/'catalog.js').write_text('/* ATLAS Class A CDL Safety Studio: compiled educational data; not a routing/permit authority. */\nwindow.ATLAS_CDL_DATA = '+json.dumps(output,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
(ROOT/'docs'/'catalog.json').write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
