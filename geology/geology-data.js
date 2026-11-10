(function () {
  "use strict";

  window.GEOLOGY_DATA = {
    groups: ["All", "Foundations", "Materials", "History", "Dynamics", "Surface & Water", "Methods", "Applied", "Planetary"],
    domains: [
      {
        id: "earth-system",
        group: "Foundations",
        title: "Earth system & interior",
        summary: "How a differentiated planet transfers heat and exchanges matter among its rocky, watery, atmospheric, icy, and living systems.",
        question: "Which reservoir, energy source, transport process, and time scale control the change being observed?",
        evidence: ["Seismic-wave paths and density models", "Heat flow, gravity, and magnetic measurements", "Rock chemistry, meteorites, and high-pressure experiments"],
        tools: ["Seismometer networks", "Gravity and magnetic surveys", "Thermodynamic and numerical models"],
        decisions: ["Choose the physical model that fits several independent datasets", "Separate direct samples from indirect inferences about the deep Earth"],
        example: "A seismic-velocity boundary is interpreted as a change in material or phase only after checking wave type, depth, geometry, and alternative temperature or composition effects.",
        subtopics: [
          { name: "Planet formation & differentiation", concept: "Accretion, melting, gravity, and density separated Earth into core, mantle, and crust while volatiles formed atmosphere and oceans.", ask: "Which evidence constrains when separation occurred?", data: "Meteorite ages, isotope ratios, experimental partitioning, planetary density." },
          { name: "Crust, mantle & core", concept: "Compositional layers differ from mechanical layers such as lithosphere and asthenosphere.", ask: "Is the boundary chemical, physical, thermal, or rheological?", data: "P- and S-wave velocity, density, mineral physics, xenoliths." },
          { name: "Heat budget & mantle flow", concept: "Primordial heat, radioactive decay, conduction, convection, and advection govern interior cooling.", ask: "What carries heat at this scale?", data: "Surface heat flow, radiogenic elements, seismic tomography, plume/ridge observations." },
          { name: "Geodynamo & magnetic field", concept: "Motion in the electrically conducting liquid outer core generates a changing magnetic field.", ask: "Is a magnetic signal modern, remanent, local, or global?", data: "Observatories, satellites, paleomagnetism, reversal chronology." },
          { name: "Coupled Earth systems", concept: "Rock, water, air, ice, and life exchange carbon, nutrients, sediment, and energy through feedbacks.", ask: "Where are the reservoirs, fluxes, and feedbacks?", data: "Mass balances, climate proxies, weathering rates, ocean and atmospheric chemistry." }
        ],
        investigation: {
          scenario: "A broad region shows unusually high heat flow and low seismic velocities in the upper mantle.",
          question: "Does the evidence support hotter mantle, partial melt, unusual composition, or a measurement artifact?",
          collect: ["Station geometry and velocity uncertainty", "Heat-flow measurements and corrections", "Gravity, volcanism, and rock-chemistry context"],
          analyze: ["Test whether temperature alone explains the velocity change", "Compare independent datasets at the same spatial scale", "Map observations that contradict a plume or rift model"],
          decision: "Rank the competing interior models, state confidence, and identify the next survey that most reduces uncertainty."
        }
      },
      {
        id: "plate-tectonics",
        group: "Foundations",
        title: "Plate tectonics",
        summary: "The framework connecting lithospheric motion to ocean basins, continents, earthquakes, volcanoes, mountain belts, and long-term material cycling.",
        question: "What relative motion, crustal type, boundary geometry, and geological record best explain the observed pattern?",
        evidence: ["Earthquake locations, depths, and mechanisms", "GPS velocity, ocean-floor age, and magnetic stripes", "Volcanic arcs, trenches, ridges, faults, and mountain belts"],
        tools: ["GNSS geodesy", "Seismic networks and bathymetry", "Paleomagnetic and geochronologic analysis"],
        decisions: ["Classify a setting without forcing complex deformation into a simple boundary label", "Connect tectonic interpretation to hazards and resource context"],
        example: "A trench, landward volcanic arc, and dipping zone of earthquakes together support oceanic-continental subduction more strongly than any clue alone.",
        subtopics: [
          { name: "Lithosphere & asthenosphere", concept: "Rigid plates include crust and uppermost mantle and move over weaker, deformable upper mantle.", ask: "Where does strength change with depth and temperature?", data: "Seismic velocity, flexure, heat flow, mantle rheology." },
          { name: "Divergent & rift systems", concept: "Extension thins lithosphere; seafloor spreading creates basaltic crust along mid-ocean ridges.", ask: "Is rifting active, failed, or mature?", data: "Normal faults, volcanic rocks, magnetic anomalies, crustal thickness, GPS extension." },
          { name: "Subduction & convergence", concept: "Dense oceanic lithosphere can sink, generating trenches, earthquake zones, fluid-driven melting, arcs, and accretionary deformation.", ask: "Which plate descends, at what angle, and how is strain partitioned?", data: "Hypocenters, focal mechanisms, slab tomography, arc chemistry, uplift." },
          { name: "Collision, transform & diffuse boundaries", concept: "Continental collision thickens crust; transform motion shears it; some boundaries spread deformation across broad zones.", ask: "Is motion localized or distributed?", data: "Fault slip, folds, metamorphic belts, GPS vectors, seismicity." },
          { name: "Hotspots, Wilson cycles & plate reconstructions", concept: "Intraplate volcanism and repeated opening and closing of ocean basins help reconstruct plate histories.", ask: "Does age progression record plate motion, plume motion, or both?", data: "Volcanic-chain ages, paleomagnetism, sutures, passive margins, reconstruction fits." }
        ],
        investigation: {
          scenario: "An island chain becomes progressively older away from one active volcano, but nearby faults show regional extension.",
          question: "Is volcanism caused by a relatively fixed hotspot, lithospheric extension, plate-boundary interaction, or a combination?",
          collect: ["High-quality eruption and crystallization ages", "Lava chemistry and mantle-source indicators", "Plate-motion vectors, fault kinematics, and bathymetry"],
          analyze: ["Compare age progression with plate speed and direction", "Test whether chemistry varies with extension or source depth", "Seek discontinuities that challenge a single-track model"],
          decision: "Select the best-supported tectonic model and state which observation would distinguish hotspot motion from plate motion."
        }
      },
      {
        id: "mineralogy",
        group: "Materials",
        title: "Mineralogy & crystallography",
        summary: "How atomic arrangement and chemistry produce minerals whose properties record formation conditions and control rock behavior.",
        question: "What mineral is present, how certain is the identification, and what does its composition or structure reveal?",
        evidence: ["Crystal form, cleavage, hardness, streak, luster, density", "Optical behavior and X-ray diffraction", "Major, minor, and trace-element composition"],
        tools: ["Hand lens and petrographic microscope", "X-ray diffraction and spectroscopy", "Electron microprobe and scanning electron microscope"],
        decisions: ["Identify minerals using converging properties rather than color alone", "Choose tests appropriate to grain size and required certainty"],
        example: "A white mineral that scratches glass is not automatically quartz; cleavage, crystal habit, optical properties, and X-ray data can separate quartz from feldspar.",
        subtopics: [
          { name: "Crystal structure & symmetry", concept: "Periodic atomic arrangements define unit cells, crystal systems, and symmetry operations.", ask: "Which structure explains the observed form or diffraction pattern?", data: "Crystal faces, lattice dimensions, X-ray peaks." },
          { name: "Mineral chemistry & solid solution", concept: "Elements substitute according to size, charge, and temperature, creating compositional series.", ask: "Is variation primary, zoned, altered, or exsolved?", data: "Microprobe traverses, phase diagrams, element maps." },
          { name: "Physical & optical properties", concept: "Bonding and structure control hardness, cleavage, density, birefringence, and other diagnostic traits.", ask: "Which combination is diagnostic?", data: "Scratch tests, streak, cleavage angles, refractive indices, interference colors." },
          { name: "Silicates & major mineral groups", concept: "Silicate tetrahedra link into isolated, chain, sheet, and framework structures; carbonates, oxides, sulfides, and others follow different chemistries.", ask: "Which group fits structure and composition?", data: "Formula, crystal habit, reaction tests, diffraction." },
          { name: "Clay, alteration & biominerals", concept: "Fine-grained minerals form through weathering, hydrothermal change, and biological activity and strongly affect soils, water, and engineering behavior.", ask: "Is the mineral inherited or newly formed?", data: "Oriented XRD, cation exchange, infrared spectra, textures." }
        ],
        investigation: {
          scenario: "A slope material swells after rain and damages foundations.",
          question: "Which clay minerals are present, and do they explain the volume change?",
          collect: ["Undisturbed and representative soil samples", "Moisture, plasticity, and expansion measurements", "Oriented clay X-ray diffraction"],
          analyze: ["Compare mineral abundance with swell tests", "Map spatial variability and drainage", "Separate clay effects from fill, leakage, or structural causes"],
          decision: "Define the mineralogical contribution and refer design or remediation choices to qualified geotechnical professionals."
        }
      },
      {
        id: "igneous-petrology",
        group: "Materials",
        title: "Igneous petrology",
        summary: "How melting, magma transport, crystallization, mixing, and differentiation create intrusive and extrusive rocks.",
        question: "What source, pressure-temperature path, water content, and crystallization history produced this rock?",
        evidence: ["Mineral assemblage, grain size, and texture", "Whole-rock and mineral chemistry", "Cross-cutting relations, contacts, and crystallization ages"],
        tools: ["Petrographic microscopy", "Geochemical and isotopic analysis", "Phase diagrams and thermobarometry"],
        decisions: ["Classify the rock and distinguish texture from composition", "Test source melting against crystallization and alteration effects"],
        example: "Coarse granite and fine rhyolite can share felsic chemistry while recording different cooling environments.",
        subtopics: [
          { name: "Melting mechanisms", concept: "Decompression, volatile addition, and heating lower the effective melting threshold in different settings.", ask: "What caused melt generation here?", data: "Tectonic context, volatile-sensitive minerals, trace elements, experimental phase relations." },
          { name: "Magma composition & classification", concept: "Silica, alkalis, iron, magnesium, and mineral content distinguish felsic through ultramafic compositions.", ask: "Is classification based on modes or chemistry?", data: "Point counts, normalized chemistry, TAS or QAPF fields." },
          { name: "Crystallization & differentiation", concept: "Fractional crystallization, assimilation, and liquid evolution change magma composition.", ask: "Which minerals left or joined the melt?", data: "Zoning, cumulates, element trends, mass balance." },
          { name: "Intrusions & plutonic architecture", concept: "Dikes, sills, stocks, batholiths, and layered intrusions record emplacement and chamber processes.", ask: "Did the body inflate, intrude in pulses, or deform during emplacement?", data: "Contact geometry, chilled margins, fabrics, ages, gravity data." },
          { name: "Textures & magma timescales", concept: "Crystal size, glass, vesicles, porphyritic texture, and disequilibrium record cooling and transport histories.", ask: "What sequence of storage, ascent, and cooling is preserved?", data: "Crystal zoning, diffusion profiles, inclusions, textures." }
        ],
        investigation: {
          scenario: "A dark dike cuts lighter crystalline rock and contains chilled margins and mixed crystals.",
          question: "When did the dike intrude, and did it mix with or merely cut the host magma system?",
          collect: ["Contact relationships and orientation", "Host, center, and margin samples", "Mineral zoning, chemistry, and ages"],
          analyze: ["Use cross-cutting relations to order events", "Compare chilled margins with interior texture", "Test mixing, assimilation, and inherited-crystal alternatives"],
          decision: "Build an event sequence and state which parts are directly observed versus inferred from chemistry."
        }
      },
      {
        id: "volcanology",
        group: "Dynamics",
        title: "Volcanology",
        summary: "How magma, gas, water, topography, and crustal pathways control eruptions, volcanic landforms, deposits, and hazards.",
        question: "What is the volcano doing now, what has it done before, and which processes could affect people or infrastructure next?",
        evidence: ["Eruption deposits, stratigraphy, and ages", "Seismicity, deformation, gas, and thermal change", "Magma composition, viscosity, crystals, and volatiles"],
        tools: ["Seismic, GNSS, tilt, gas, and thermal monitoring", "Deposit mapping and laboratory analysis", "Satellite radar and multispectral imagery"],
        decisions: ["Use multiple monitoring streams; no single signal guarantees an eruption", "Map hazard scenarios separately from short-term forecasts"],
        example: "Increasing earthquakes may indicate magma movement, hydrothermal change, fault slip, or noise; deformation and gas trends help test the alternatives.",
        subtopics: [
          { name: "Magma ascent & eruption triggers", concept: "Buoyancy, gas exsolution, recharge, pressure, and fractures move magma toward the surface.", ask: "Which observations indicate movement rather than background activity?", data: "Hypocenter migration, deformation, gas ratios, petrology." },
          { name: "Eruption styles & products", concept: "Effusive lava, explosive columns, pyroclastic density currents, ash, and lahars reflect magma and environment.", ask: "Which process deposited each unit?", data: "Grain size, sorting, componentry, welding, flow structures." },
          { name: "Volcano morphology", concept: "Shield volcanoes, stratovolcanoes, calderas, domes, cones, and fissures grow through different eruptive histories.", ask: "Is shape controlled by eruption style, erosion, collapse, or all three?", data: "Topography, stratigraphy, vents, ages, geophysics." },
          { name: "Monitoring & unrest", concept: "Seismic, deformation, gas, thermal, hydrologic, and visual data track changes from baseline.", ask: "Which change is statistically and physically meaningful?", data: "Time series, station health, weather, background rates." },
          { name: "Volcanic hazards & communication", concept: "Hazard zones depend on process, magnitude, topography, wind, water, exposure, and uncertainty.", ask: "Who needs which warning, for what area and time window?", data: "Deposit extents, flow models, wind forecasts, population and infrastructure." }
        ],
        investigation: {
          scenario: "A stratovolcano shows shallow earthquakes, slight inflation, and a changing gas ratio after years of quiet.",
          question: "Does the combined evidence indicate magmatic unrest, a hydrothermal disturbance, or instrument/environmental effects?",
          collect: ["Validated multi-station seismic and deformation records", "Repeated gas measurements with weather corrections", "Thermal, hydrologic, satellite, and historical baseline data"],
          analyze: ["Check instrument health and common-mode noise", "Compare signal timing and spatial migration", "Evaluate several unrest scenarios and consequence zones"],
          decision: "Provide the observatory with a confidence-ranked assessment and explicit triggers for changing alert or monitoring posture."
        }
      },
      {
        id: "sedimentology",
        group: "Materials",
        title: "Sedimentology",
        summary: "How particles and dissolved material are weathered, transported, deposited, buried, and transformed into sedimentary rock.",
        question: "Which process moved and deposited the material, in what environment, and how was the record modified afterward?",
        evidence: ["Grain size, shape, sorting, composition, and fabric", "Beds, ripples, dunes, channels, mud cracks, and fossils", "Facies changes, paleocurrents, and basin geometry"],
        tools: ["Measured sections and grain-size analysis", "Microscopy, core logging, and geochemistry", "Ground-penetrating radar and seismic stratigraphy"],
        decisions: ["Infer process from multiple sedimentary structures and context", "Distinguish depositional features from later deformation or weathering"],
        example: "Cross-bedding can record current direction, but the correct interpretation depends on bed geometry, scale, grain size, and whether the structure is overturned.",
        subtopics: [
          { name: "Weathering, erosion & provenance", concept: "Physical and chemical breakdown creates sediment whose minerals and ages can identify source terrains.", ask: "Where did the sediment come from and how was it altered?", data: "Heavy minerals, detrital zircons, clast types, chemistry, drainage patterns." },
          { name: "Transport mechanics", concept: "Water, wind, ice, and gravity move grains as dissolved, suspended, saltating, rolling, or mass-flow loads.", ask: "Which transport mode fits grain and flow evidence?", data: "Grain size, bedforms, flow competence, fabric, experimental relationships." },
          { name: "Depositional environments", concept: "Rivers, deserts, lakes, deltas, reefs, shelves, slopes, and deep oceans produce characteristic facies associations.", ask: "Which facies occur together and how do they shift?", data: "Logs, fossils, structures, geometry, geochemistry." },
          { name: "Carbonates & chemical sediments", concept: "Biology, water chemistry, temperature, and circulation create limestones, evaporites, chert, and iron formations.", ask: "Was material precipitated, biologically built, transported, or replaced?", data: "Textures, fossils, isotopes, mineralogy, basin setting." },
          { name: "Diagenesis & lithification", concept: "Compaction, cementation, dissolution, recrystallization, and fluid flow alter sediment after deposition.", ask: "Which pore and mineral changes are depositional versus diagenetic?", data: "Cements, porosity, fluid inclusions, burial history, cross-cutting textures." }
        ],
        investigation: {
          scenario: "A core alternates sand, mud, roots, and marine shells beneath a modern delta plain.",
          question: "Does the sequence record river-channel migration, sea-level change, subsidence, storms, or several processes?",
          collect: ["Continuous facies and contact log", "Fossils, sedimentary structures, ages, and grain-size trends", "Regional cores, elevation control, and modern process analogs"],
          analyze: ["Build facies associations before naming environments", "Test vertical trends against lateral correlation", "Separate local channel shifts from regional base-level change"],
          decision: "Produce a depositional model with alternative explanations and identify implications for flooding, groundwater, or subsidence."
        }
      },
      {
        id: "stratigraphy-geochronology",
        group: "History",
        title: "Stratigraphy & geochronology",
        summary: "How rock layers and numerical clocks establish the order, duration, correlation, and rates of events in Earth history.",
        question: "What happened first, what is missing, how can units be correlated, and which age actually dates the event of interest?",
        evidence: ["Contacts, superposition, cross-cutting, and unconformities", "Fossil, magnetic, chemical, and sequence markers", "Mineral ages with analytical and geological uncertainty"],
        tools: ["Measured sections and correlation panels", "Mass spectrometry and isotope dilution", "Magnetostratigraphy and age-depth modeling"],
        decisions: ["Match the dating method to the material and event", "Keep analytical precision separate from interpretation uncertainty"],
        example: "A zircon age may date crystallization of volcanic ash, inheritance from an older source, or later growth; textures and field context decide which.",
        subtopics: [
          { name: "Relative dating principles", concept: "Superposition, original horizontality, lateral continuity, inclusions, and cross-cutting relations order events.", ask: "Has the sequence been overturned, faulted, intruded, or reworked?", data: "Way-up structures, contacts, clasts, faults, folds." },
          { name: "Unconformities & missing time", concept: "Erosion or nondeposition creates gaps between rock packages.", ask: "How much time is missing and why?", data: "Paleosols, weathering surfaces, truncation, age differences, regional correlation." },
          { name: "Litho-, bio-, chemo- & magnetostratigraphy", concept: "Physical units, fossils, chemical excursions, and magnetic polarity provide complementary correlation tools.", ask: "Is the marker time-equivalent or environmentally controlled?", data: "Logs, fossil ranges, isotope curves, polarity zones." },
          { name: "Radiometric dating", concept: "Parent-daughter isotope systems provide numerical ages when closure, initial conditions, and alteration are understood.", ask: "Which mineral and isotope system date the target event?", data: "Isochron relations, concordance, standards, closure temperatures." },
          { name: "Rates, duration & age models", concept: "Depositional rates vary; age-depth models integrate dates, order, and hiatuses with uncertainty.", ask: "Is an assumed constant rate defensible?", data: "Multiple dates, varves, cyclostratigraphy, sedimentation breaks." }
        ],
        investigation: {
          scenario: "Two separated basins contain similar ash beds, fossils, and magnetic reversals but different sediment thicknesses.",
          question: "Which layers are truly time-equivalent, and how did accumulation rates differ?",
          collect: ["Ash mineral chemistry and radiometric ages", "Fossil ranges and polarity logs", "Measured sections, unconformities, and age uncertainties"],
          analyze: ["Correlate independent markers", "Model variable accumulation and missing time", "Test reworking or diachronous facies as alternatives"],
          decision: "Build a correlation and age model that preserves uncertainty and identifies where additional dates have highest value."
        }
      },
      {
        id: "paleontology-paleoclimate",
        group: "History",
        title: "Paleontology & paleoclimate",
        summary: "How fossils and physical or chemical proxies reconstruct ancient life, environments, ecosystems, climate, and extinction.",
        question: "What did the organism or proxy record, how was it preserved, and what biases stand between the sample and the past?",
        evidence: ["Body fossils, trace fossils, assemblages, and taphonomy", "Stable isotopes, biomarkers, pollen, ice, and sediments", "Facies, age control, and ecological context"],
        tools: ["Microscopy and comparative anatomy", "Mass spectrometry and biomarker analysis", "Statistical ecology and climate-proxy calibration"],
        decisions: ["Use assemblages and context rather than a single fossil", "Separate local ecological change from regional or global climate change"],
        example: "A fossil disappearance may mark extinction, migration, erosion, poor preservation, or incomplete sampling; regional sections and age control test the options.",
        subtopics: [
          { name: "Fossilization & taphonomy", concept: "Decay, transport, burial, mineralization, and collection bias shape the fossil record.", ask: "What happened between life and discovery?", data: "Articulation, breakage, orientation, sediment, geochemistry, preservation mode." },
          { name: "Systematics, evolution & phylogeny", concept: "Morphology and increasingly molecular or chemical evidence test relationships and evolutionary change.", ask: "Which traits are homologous, variable, or convergent?", data: "Character matrices, stratigraphic ranges, ancient molecules where preserved." },
          { name: "Paleoecology & trace fossils", concept: "Communities, burrows, tracks, feeding traces, and functional form reveal behavior and environment.", ask: "Is the assemblage living, transported, mixed, or time-averaged?", data: "Diversity, abundance, tiering, trace associations, facies." },
          { name: "Paleoclimate proxies", concept: "Isotopes, pollen, leaf form, biomarkers, ice, and sediments indirectly record temperature, rainfall, ice, and circulation.", ask: "What else besides climate controls the proxy?", data: "Modern calibration, multiple proxies, age models, diagenetic screening." },
          { name: "Mass extinctions & recovery", concept: "Abrupt biodiversity losses and uneven recoveries reflect interacting environmental stresses and ecological structure.", ask: "What is the timing, selectivity, mechanism, and recovery path?", data: "High-resolution ranges, geochemistry, impact or volcanic markers, sedimentology." }
        ],
        investigation: {
          scenario: "A lake core shows a pollen shift, charcoal increase, lower lake level, and human artifacts over the same interval.",
          question: "Did climate change, land use, fire, or their interaction reorganize the ecosystem?",
          collect: ["Dated pollen, charcoal, sediment, and geochemical records", "Independent temperature or moisture proxies", "Archaeological and regional lake records"],
          analyze: ["Compare lead-lag timing and proxy sensitivity", "Screen for reworking and age-model uncertainty", "Test climate-only, land-use-only, and interaction hypotheses"],
          decision: "Report the best-supported drivers without assigning a single cause where evidence supports coupled effects."
        }
      },
      {
        id: "structural-geology",
        group: "Dynamics",
        title: "Structural geology & tectonics",
        summary: "How rocks deform through brittle fracture and ductile flow, recording stress, strain, displacement, and tectonic history.",
        question: "What geometry and kinematics are observed, what stress or rheology may explain them, and in what sequence did deformation occur?",
        evidence: ["Faults, folds, joints, fabrics, lineations, and shear zones", "Offset markers and balanced cross sections", "Microstructures, metamorphic conditions, and geochronology"],
        tools: ["Compass-clinometer and stereonet", "Geologic mapping and cross-section restoration", "Microscopy, geodesy, and numerical modeling"],
        decisions: ["Describe geometry before inferring stress", "Distinguish displacement on a structure from total regional strain"],
        example: "A fault surface orientation does not by itself prove motion; slickenlines, offset markers, drag, and regional relations constrain slip direction and sense.",
        subtopics: [
          { name: "Stress, strain & rheology", concept: "Stress drives strain, while temperature, pressure, fluids, composition, grain size, and rate control response.", ask: "Why did the rock fracture here but flow elsewhere?", data: "Rock properties, microstructures, depth indicators, strain markers." },
          { name: "Faults, fractures & earthquakes", concept: "Normal, reverse, thrust, strike-slip, and oblique faults accommodate displacement across scales.", ask: "What are slip direction, amount, segmentation, and timing?", data: "Offsets, slickensides, fault rocks, scarps, seismicity." },
          { name: "Folds & cleavage", concept: "Layer shortening, buckling, shear, and flow create folds and axial fabrics.", ask: "What are fold geometry, facing, mechanism, and relationship to cleavage?", data: "Bedding attitudes, hinge lines, axial planes, thickness variation." },
          { name: "Ductile shear zones & microstructures", concept: "Mineral fabrics and recrystallization record deformation at elevated temperature and pressure.", ask: "What sense of shear and deformation conditions are recorded?", data: "S-C fabrics, porphyroclasts, grain size, crystallographic orientation." },
          { name: "Tectonic reconstruction", concept: "Restored sections and time constraints test how basins, mountains, and plate margins evolved.", ask: "Is the reconstruction geometrically possible and materially balanced?", data: "Maps, seismic profiles, stratigraphy, thermochronology, provenance." }
        ],
        investigation: {
          scenario: "A proposed infrastructure corridor crosses several mapped faults near a folded mountain front.",
          question: "Which structures are active or potentially significant, and where is deformation distributed?",
          collect: ["Detailed structural and geomorphic mapping", "Subsurface profiles, trench data where authorized, and ages", "Regional seismicity, geodesy, and historical records"],
          analyze: ["Separate bedrock faults from superficial lineaments", "Evaluate recency, slip style, segmentation, and uncertainty", "Test alternative corridor alignments against the evidence"],
          decision: "Provide a traceable structural model and hazard inputs for licensed engineering and regulatory evaluation."
        }
      },
      {
        id: "metamorphic-geology",
        group: "Materials",
        title: "Metamorphic geology",
        summary: "How heat, pressure, stress, fluids, and time transform rocks without wholesale melting and record burial, collision, and exhumation.",
        question: "What protolith changed, under what pressure-temperature-fluid path, and how was the rock returned toward the surface?",
        evidence: ["Mineral assemblages, reactions, textures, and fabrics", "Mineral chemistry and inclusion relationships", "Pressure-temperature estimates and growth ages"],
        tools: ["Petrographic and electron microscopy", "Thermobarometry and phase-equilibrium modeling", "Geochronology and diffusion modeling"],
        decisions: ["Identify equilibrium domains before calculating conditions", "Distinguish peak conditions from the complete pressure-temperature-time path"],
        example: "Garnet zoning and mineral inclusions can preserve earlier stages of burial even when the matrix records later heating or decompression.",
        subtopics: [
          { name: "Metamorphic grade & facies", concept: "Diagnostic mineral assemblages group pressure-temperature conditions into facies.", ask: "Which minerals coexist in equilibrium for this bulk composition?", data: "Assemblages, mineral chemistry, phase diagrams." },
          { name: "Protoliths & reaction textures", concept: "Metamorphic rocks inherit composition from igneous or sedimentary precursors and develop reaction rims and replacement textures.", ask: "Which features are inherited and which formed during metamorphism?", data: "Relict minerals, whole-rock chemistry, textures, isotopes." },
          { name: "Regional, contact & hydrothermal metamorphism", concept: "Burial and deformation, intrusion heating, and reactive fluids produce different spatial and mineral patterns.", ask: "What supplied heat and fluid, and over what scale?", data: "Isograds, aureoles, veins, alteration halos, fluid inclusions." },
          { name: "Foliation, lineation & deformation", concept: "Preferred mineral orientation records strain, flow, and recrystallization during metamorphism.", ask: "Did fabric grow before, during, or after folding?", data: "Porphyroblast relations, cleavage intersections, microstructures." },
          { name: "P-T-t paths & exhumation", concept: "Minerals and ages reconstruct pressure-temperature-time histories through burial and return.", ask: "Which process exhumed the rock and how fast?", data: "Thermobarometry, growth ages, cooling ages, diffusion profiles." }
        ],
        investigation: {
          scenario: "A mountain belt contains high-pressure minerals beside lower-grade rocks across a major shear zone.",
          question: "Did the high-pressure block follow a subduction-and-exhumation path, and how was it juxtaposed with shallow crust?",
          collect: ["Mineral assemblages and mapped structural relations", "Pressure-temperature estimates by domain", "Growth, deformation, and cooling ages"],
          analyze: ["Construct separate P-T-t paths", "Test fault, channel-flow, and erosion/exhumation models", "Check whether minerals are relict, retrogressed, or in equilibrium"],
          decision: "Choose the tectono-metamorphic history that satisfies timing, geometry, and mineral evidence, with unresolved steps labeled."
        }
      },
      {
        id: "geomorphology-soils",
        group: "Surface & Water",
        title: "Geomorphology & soils",
        summary: "How weathering, rivers, slopes, wind, biology, tectonics, and climate shape landscapes and produce soils.",
        question: "Which process controls the landform now, what inherited conditions matter, and how fast is change occurring?",
        evidence: ["Topography, drainage, terraces, slopes, and sediment", "Soil horizons, weathering profiles, and vegetation", "Historical imagery, dates, and process measurements"],
        tools: ["Field surveying and digital elevation models", "Soil description and sediment analysis", "Repeat imagery, lidar, and cosmogenic dating"],
        decisions: ["Separate present activity from inherited landforms", "Evaluate process rate, threshold, connectivity, and uncertainty"],
        example: "A river terrace indicates an abandoned floodplain, but uplift, climate, sediment supply, or base-level change may explain abandonment.",
        subtopics: [
          { name: "Weathering & regolith", concept: "Physical breakup, chemical reaction, and biology turn bedrock into mobile regolith and dissolved loads.", ask: "Is weathering limited by reaction, transport, climate, or fresh-rock supply?", data: "Profiles, mineral alteration, solute flux, fractures, erosion rates." },
          { name: "Hillslopes & mass movement", concept: "Creep, falls, slides, flows, and avalanches move material when driving forces exceed strength.", ask: "What changed water, loading, geometry, or strength?", data: "Scarps, displacement, rainfall, pore pressure, material properties." },
          { name: "Fluvial systems", concept: "Rivers erode, transport, store, and deposit sediment while channels adjust to flow, slope, sediment, vegetation, and boundaries.", ask: "Is the reach transport- or supply-limited?", data: "Discharge, grain size, profiles, channel migration, floodplain stratigraphy." },
          { name: "Arid & aeolian landscapes", concept: "Wind transport, sparse vegetation, episodic runoff, salt, and thermal stress shape dunes, playas, and desert surfaces.", ask: "Which process is active versus relict?", data: "Dune migration, grain texture, varnish, pavement, runoff deposits." },
          { name: "Soil formation & classification", concept: "Parent material, climate, organisms, relief, and time create horizons that affect ecosystems, agriculture, water, and construction.", ask: "Which factor controls the observed horizon sequence?", data: "Profiles, texture, chemistry, color, structure, drainage." }
        ],
        investigation: {
          scenario: "A river is eroding one bank rapidly after a flood and threatens a road.",
          question: "Is erosion a short-lived adjustment, a continuing channel shift, or a symptom of upstream/downstream change?",
          collect: ["Repeat channel and bank surveys", "Flow history, sediment caliber, vegetation, and bank material", "Historical aerial imagery and infrastructure changes"],
          analyze: ["Measure migration rate and hydraulic controls", "Check sediment and flow connectivity", "Compare no-action and intervention consequences"],
          decision: "Identify the likely trajectory and monitoring thresholds for engineers, landowners, and river managers."
        }
      },
      {
        id: "quaternary-glacial",
        group: "Surface & Water",
        title: "Quaternary & glacial geology",
        summary: "The recent geological past: ice sheets, glaciers, abrupt climate change, young deposits, sea-level shifts, and landscapes used by people.",
        question: "Which event produced the young deposit or landform, when did it occur, and what does it imply about recent environmental change?",
        evidence: ["Moraines, tills, outwash, lake and loess deposits", "Ice cores, marine cores, pollen, and isotopes", "Exposure ages, radiocarbon ages, varves, and luminescence"],
        tools: ["Geomorphic mapping and lidar", "Core analysis and proxy laboratories", "Quaternary geochronology"],
        decisions: ["Match dating method to age range and material", "Account for reworking, inheritance, reservoir effects, and incomplete preservation"],
        example: "A boulder exposure age can date deglaciation only if inherited nuclides, shielding, erosion, and post-depositional movement are evaluated.",
        subtopics: [
          { name: "Glacier mechanics & mass balance", concept: "Accumulation, melt, flow, sliding, and ice dynamics control glacier advance, retreat, and sea-level contribution.", ask: "Is change driven by climate, geometry, ocean contact, or dynamics?", data: "Velocity, thickness, mass balance, temperature, terminus position." },
          { name: "Glacial erosion & deposition", concept: "Ice scours valleys and deposits till, moraines, outwash, erratics, and glaciolacustrine sediment.", ask: "Was material deposited directly by ice, meltwater, lakes, or slope processes?", data: "Sorting, fabric, landform geometry, stratigraphy." },
          { name: "Pleistocene climate cycles", concept: "Orbital forcing, greenhouse gases, ocean circulation, ice feedbacks, and internal variability paced glacial-interglacial change.", ask: "Which forcing and feedback fit the timing?", data: "Ice and marine cores, isotopes, dust, greenhouse gases, chronology." },
          { name: "Holocene environmental change", concept: "The current interglacial contains shifting climate, sea level, ecosystems, fire, and growing human influence.", ask: "What is natural variability, human influence, or interaction?", data: "High-resolution cores, tree rings, historical records, land-use evidence." },
          { name: "Quaternary dating methods", concept: "Radiocarbon, luminescence, cosmogenic nuclides, tephra, dendrochronology, and varves date different materials and events.", ask: "Does the measured clock start at the target event?", data: "Material context, calibration, blanks, dose rates, inheritance tests." }
        ],
        investigation: {
          scenario: "A town sits on layered sand and silt below a moraine-dammed lake basin.",
          question: "What is the glacial history, and could buried channels or weak lake deposits affect water and infrastructure?",
          collect: ["Landform and surficial-geology mapping", "Boreholes, geophysics, sediment logs, and groundwater levels", "Ages from appropriate materials and regional correlations"],
          analyze: ["Reconstruct ice-margin and lake stages", "Map buried channels and compressible units", "Test alternative depositional models against subsurface continuity"],
          decision: "Deliver a Quaternary framework for hydrogeologic and geotechnical specialists, including data gaps."
        }
      },
      {
        id: "hydrogeology",
        group: "Surface & Water",
        title: "Hydrogeology",
        summary: "How groundwater is stored, moves, interacts with surface water, transports dissolved material, and responds to pumping or contamination.",
        question: "Where does the water come from, how and how fast does it move, what changes its quality, and who or what depends on it?",
        evidence: ["Hydraulic head, gradients, discharge, and aquifer tests", "Porosity, permeability, fractures, and stratigraphy", "Major ions, isotopes, tracers, and contaminant distributions"],
        tools: ["Monitoring wells and pressure transducers", "Pumping, slug, and tracer tests", "Groundwater-flow and transport models"],
        decisions: ["Build a conceptual model before a numerical model", "Treat model calibration as consistency, not unique proof"],
        example: "A contaminant plume does not necessarily move at the same speed as groundwater because sorption, decay, diffusion, density, and reactions can alter transport.",
        subtopics: [
          { name: "Aquifers, aquitards & storage", concept: "Pores, fractures, and dissolution openings store and transmit water; confining units restrict flow.", ask: "Which units transmit water at the scale of interest?", data: "Logs, cores, tests, head response, fracture mapping." },
          { name: "Darcy flow & hydraulic properties", concept: "Flow responds to hydraulic gradient and conductivity, while storage controls transient response.", ask: "Are assumptions of continuum, saturation, and representative scale valid?", data: "Heads, conductivity, transmissivity, storativity, boundary conditions." },
          { name: "Recharge, discharge & surface-water exchange", concept: "Precipitation, irrigation, streams, wetlands, and pumping connect groundwater to the surface.", ask: "Where and when does water enter and leave?", data: "Water budgets, seepage, temperature, isotopes, hydrographs." },
          { name: "Groundwater chemistry & contamination", concept: "Water-rock reaction, redox, microbes, mixing, and human inputs shape quality and contaminant fate.", ask: "Which process, source, and pathway explain the chemistry?", data: "Spatial samples, speciation, isotopes, redox indicators, land use." },
          { name: "Karst & fractured-rock flow", concept: "Conduits and connected fractures can produce rapid, directional flow that simple porous-media models miss.", ask: "Where are connected pathways and vulnerabilities?", data: "Tracer tests, springs, caves, fracture networks, storm response." }
        ],
        investigation: {
          scenario: "A municipal well shows rising nitrate while nearby streams and shallow wells vary seasonally.",
          question: "What are the source, travel path, age, and capture zone of the affected groundwater?",
          collect: ["Well construction, pumping, heads, and stratigraphy", "Time-series chemistry, nitrate isotopes, and groundwater age tracers", "Land use, recharge, stream exchange, and potential sources"],
          analyze: ["Build and test the conceptual flow model", "Distinguish source signatures and mixing", "Evaluate capture under seasonal and pumping scenarios"],
          decision: "Prioritize confirmation, source control, monitoring, and qualified water-management response without overstating plume certainty."
        }
      },
      {
        id: "marine-coastal",
        group: "Surface & Water",
        title: "Marine & coastal geology",
        summary: "How ocean basins, currents, waves, sediment, reefs, slopes, and sea level shape the seafloor and changing shorelines.",
        question: "Which sediment source, transport pathway, water process, and sea-level or land-motion trend control this coast or basin?",
        evidence: ["Bathymetry, sonar, seismic profiles, and cores", "Waves, tides, currents, sediment budgets, and shoreline change", "Microfossils, geochemistry, and sea-level indicators"],
        tools: ["Multibeam sonar and sub-bottom profiling", "Sediment coring and coastal surveying", "Satellite imagery, lidar, and ocean observations"],
        decisions: ["Use sediment budgets and process zones, not a single shoreline position", "Separate relative sea level into ocean-volume and vertical-land-motion components"],
        example: "Beach erosion after a storm may partially recover; long-term retreat requires multiple dates and knowledge of sediment supply, structures, storms, and sea-level change.",
        subtopics: [
          { name: "Ocean-basin architecture", concept: "Margins, shelves, slopes, abyssal plains, ridges, trenches, and seamounts reflect tectonics and sedimentation.", ask: "Which features are constructional, erosional, depositional, or tectonic?", data: "Bathymetry, gravity, seismic reflection, samples." },
          { name: "Waves, tides & coastal transport", concept: "Water motion moves sediment alongshore and cross-shore, building beaches, spits, barriers, and tidal inlets.", ask: "What are direction, magnitude, seasonality, and sediment availability?", data: "Wave/current records, grain tracers, profiles, shoreline imagery." },
          { name: "Deltas, estuaries & continental margins", concept: "River sediment, marine reworking, subsidence, and accommodation shape coastal deposits.", ask: "Is the system sediment-rich, sediment-starved, rising, or subsiding?", data: "Discharge, sediment load, cores, elevation change, stratigraphy." },
          { name: "Submarine slopes & geohazards", concept: "Mass failures, turbidity currents, gas, faults, and earthquakes reshape slopes and can threaten cables or coasts.", ask: "What preconditions and trigger evidence exist?", data: "Seafloor morphology, cores, pore pressure, seismicity, repeat surveys." },
          { name: "Sea level, reefs & coastal records", concept: "Reefs, marshes, terraces, and sediments record relative sea level when ecology, compaction, and land motion are understood.", ask: "What elevation did the indicator originally represent?", data: "Indicator ecology, ages, precise elevations, land-motion estimates." }
        ],
        investigation: {
          scenario: "A barrier-island community experiences inlet migration, storm overwash, and chronic shoreline retreat.",
          question: "Which processes dominate at event, decadal, and longer time scales, and how does sediment move through the system?",
          collect: ["Repeat topo-bathymetric surveys and shoreline positions", "Wave, storm, inlet, sediment, and nourishment records", "Subsidence and relative sea-level measurements"],
          analyze: ["Construct a sediment budget", "Separate storm response from trend", "Compare adaptation options under multiple process scenarios"],
          decision: "Provide process-based evidence to coastal planners while leaving policy tradeoffs and engineering design to responsible authorities."
        }
      },
      {
        id: "geochemistry-isotopes",
        group: "Methods",
        title: "Geochemistry & isotope geology",
        summary: "How elements and isotopes move among minerals, melts, fluids, organisms, and reservoirs—and how chemical signatures test geological processes.",
        question: "Which source, reaction, fractionation, mixing, or alteration process produced the measured composition?",
        evidence: ["Major, trace, and rare-earth element patterns", "Stable and radiogenic isotope ratios", "Mineral zoning, fluid chemistry, and mass balance"],
        tools: ["Mass spectrometry and chromatography", "Microbeam and spectroscopic analysis", "Thermodynamic, speciation, and mixing models"],
        decisions: ["Use standards, blanks, replicates, and detection limits", "Test non-unique chemical explanations with field and mineral context"],
        example: "Two sources can mix to mimic a reaction trend; multiple elements, isotopes, and geological relations are needed to distinguish them.",
        subtopics: [
          { name: "Element partitioning", concept: "Elements favor particular minerals, melts, fluids, or gases according to structure and conditions.", ask: "What phases controlled the element pattern?", data: "Partition coefficients, mineral modes, temperatures, trace-element ratios." },
          { name: "Stable-isotope fractionation", concept: "Mass-dependent fractionation during reactions, phase changes, and biology records temperature and process.", ask: "Was the system at equilibrium, kinetic, open, or altered?", data: "Paired isotopes, mineral context, calibration, fluid composition." },
          { name: "Radiogenic isotopes & reservoirs", concept: "Parent decay and source histories create isotope signatures used for ages and provenance.", ask: "Does the ratio date an event or trace a source?", data: "Parent/daughter ratios, isochrons, standards, reservoir models." },
          { name: "Aqueous & environmental geochemistry", concept: "Acid-base, redox, complexation, sorption, precipitation, and microbes control dissolved species.", ask: "Which reaction limits mobility or toxicity?", data: "pH, Eh, alkalinity, speciation, minerals, microbial indicators." },
          { name: "Organic & biogeochemistry", concept: "Organic molecules and carbon cycling link life, sediments, fuels, climate, and preservation.", ask: "Is the compound indigenous, transported, mature, or contaminated?", data: "Biomarkers, carbon isotopes, maturity indicators, blanks." }
        ],
        investigation: {
          scenario: "A stream below an old mine turns acidic and carries dissolved metals after storms.",
          question: "Which minerals and reactions generate acidity and metal release, and where could attenuation occur?",
          collect: ["Upstream-to-downstream water chemistry across flow conditions", "Mineralogy of waste, bedrock, precipitates, and sediment", "Flow, pH, redox, alkalinity, and microbial context"],
          analyze: ["Balance acidity, sulfate, and metals", "Model oxidation, neutralization, sorption, and precipitation", "Distinguish mine sources from regional background"],
          decision: "Map reaction zones and monitoring priorities for qualified environmental, regulatory, and remediation teams."
        }
      },
      {
        id: "geophysics-seismology",
        group: "Methods",
        title: "Geophysics & seismology",
        summary: "How seismic waves, gravity, magnetism, electricity, heat, and deformation image structures that cannot be observed directly.",
        question: "Which physical property creates the anomaly, how unique is the model, and what independent evidence constrains it?",
        evidence: ["Wave travel times, amplitudes, frequencies, and focal mechanisms", "Gravity, magnetic, electrical, radar, and heat-flow anomalies", "Instrument geometry, noise, resolution, and calibration"],
        tools: ["Seismometers, gravimeters, magnetometers, and resistivity systems", "Ground-penetrating radar and electromagnetic surveys", "Inverse modeling and uncertainty analysis"],
        decisions: ["Treat inversion as a family of models, not a photograph", "Match survey spacing and method to target scale and property contrast"],
        example: "A gravity low may indicate low-density sediment, voids, hot rock, or geometry; seismic or borehole constraints reduce ambiguity.",
        subtopics: [
          { name: "Seismic waves & Earth structure", concept: "P, S, surface, reflected, and refracted waves respond to elastic properties and boundaries.", ask: "Which phase was recorded and along what path?", data: "Arrival times, waveforms, station locations, velocity models." },
          { name: "Earthquake source physics", concept: "Fault rupture releases seismic energy described by location, mechanism, moment, magnitude, and source time.", ask: "What slipped, how much, in which direction, and with what uncertainty?", data: "Waveforms, focal mechanisms, finite-fault models, geodesy." },
          { name: "Gravity & magnetic methods", concept: "Density and magnetization contrasts reveal buried bodies and regional structure.", ask: "Which source geometry and regional correction fit the anomaly?", data: "Survey grids, elevations, susceptibility, density, geology." },
          { name: "Electrical, electromagnetic & radar methods", concept: "Conductivity, chargeability, dielectric properties, and reflections image water, clay, mineralization, utilities, and layers.", ask: "What property contrast exists and what interferes?", data: "Apparent resistivity, decay, radargrams, frequency response, ground truth." },
          { name: "Geodesy, heat flow & integrated inversion", concept: "GNSS, InSAR, leveling, thermal data, and joint inversion track deformation and constrain processes.", ask: "Do datasets share scale, timing, and assumptions?", data: "Displacement time series, atmospheric corrections, thermal gradients, priors." }
        ],
        investigation: {
          scenario: "A construction site may overlie a buried bedrock valley filled with variable sediment.",
          question: "What is the valley geometry, and where are method resolution or interpretation uncertain?",
          collect: ["Existing wells, maps, and elevation control", "Seismic, resistivity, and gravity profiles chosen for target contrast", "Targeted confirmation borings by authorized specialists"],
          analyze: ["Process and quality-control each dataset", "Compare independent models and sensitivity", "Use borings to constrain rather than merely decorate the inversion"],
          decision: "Deliver a bounded subsurface model with uncertainty zones for engineering investigation—not an unsupported exact surface."
        }
      },
      {
        id: "economic-resources",
        group: "Applied",
        title: "Economic geology & energy resources",
        summary: "How geological systems concentrate minerals, groundwater, hydrocarbons, geothermal heat, and materials—and how resources are characterized responsibly.",
        question: "What geological process created the concentration, how continuous and recoverable is it, and what environmental, social, legal, and economic constraints apply?",
        evidence: ["Host rocks, alteration, structures, grade, thickness, and continuity", "Geochemistry, geophysics, drilling, sampling, and resource models", "Hydrology, waste, energy, land, community, and closure context"],
        tools: ["Mapping, core logging, assays, and geostatistics", "Geophysical and remote-sensing surveys", "Hydrogeologic, geomechanical, and lifecycle studies"],
        decisions: ["Distinguish an occurrence, exploration target, resource, and reserve", "Preserve sampling QA/QC and acknowledge modifying factors"],
        example: "A high-grade sample is not a deposit; continuity, representative sampling, geometry, processing, access, impacts, and economics determine significance.",
        subtopics: [
          { name: "Ore-forming systems", concept: "Magmatic, hydrothermal, sedimentary, weathering, and metamorphic processes concentrate valuable elements.", ask: "What source, transport fluid, pathway, trap, and preservation history operated?", data: "Alteration, veins, mineral paragenesis, isotopes, fluid inclusions." },
          { name: "Exploration & resource estimation", concept: "Progressive mapping, sampling, geophysics, drilling, and modeling test size, grade, continuity, and uncertainty.", ask: "Is sampling representative and spacing sufficient?", data: "QA/QC assays, geological domains, variograms, density, recovery." },
          { name: "Petroleum systems & sedimentary energy", concept: "Source, maturation, migration, reservoir, seal, trap, timing, and preservation control accumulations.", ask: "Are all system elements present and correctly timed?", data: "Basin history, seismic, logs, cores, geochemistry, pressure." },
          { name: "Geothermal & geologic energy storage", concept: "Heat, permeability, fluids, caprock, induced seismicity, and reservoir management govern geothermal and subsurface storage.", ask: "Can fluid circulate or remain contained without unacceptable effects?", data: "Temperature, stress, fractures, injectivity, monitoring, geochemistry." },
          { name: "Construction materials & critical minerals", concept: "Aggregates, stone, clay, industrial minerals, and critical commodities require fit-for-purpose properties and responsible supply.", ask: "Does material meet performance, durability, and sourcing requirements?", data: "Petrography, strength, abrasion, chemistry, supply-chain and environmental data." }
        ],
        investigation: {
          scenario: "An exploration team finds geochemical anomalies and alteration around a faulted volcanic center.",
          question: "Do the anomalies define a coherent mineral system or reflect transported cover, contamination, or isolated veins?",
          collect: ["Controlled mapping and representative sampling with QA/QC", "Alteration mineralogy, structures, geophysics, and depth information", "Background, transport direction, ownership, water, and environmental baseline"],
          analyze: ["Build source-pathway-trap-preservation hypotheses", "Test spatial continuity and sampling bias", "Rank targets by evidence and information gain"],
          decision: "Recommend whether, where, and why further authorized work is justified while keeping occurrence and economic resource claims distinct."
        }
      },
      {
        id: "engineering-environmental-hazards",
        group: "Applied",
        title: "Engineering, environmental & hazard geology",
        summary: "Applying geological understanding to sites, infrastructure, waste, contamination, land use, resilience, and natural hazards.",
        question: "Which ground or process conditions could affect the decision, who is exposed, and what investigation reduces risk without pretending uncertainty is zero?",
        evidence: ["Site geology, materials, groundwater, structures, and process history", "Hazard frequency, magnitude, runout, susceptibility, and exposure", "Monitoring, laboratory, subsurface, and historical records"],
        tools: ["Site mapping, borings, tests, and instrumentation", "Hazard maps, models, and scenario analysis", "Environmental sampling and conceptual site models"],
        decisions: ["Geologists characterize conditions; licensed authorities own design and regulation", "Separate hazard from risk: probability/process differs from people and assets exposed"],
        example: "A landslide susceptibility map identifies conditions favorable to failure; it does not predict the exact time a slope will move.",
        subtopics: [
          { name: "Site characterization & geotechnical context", concept: "Rock, soil, fill, weathering, structures, groundwater, and history define ground behavior.", ask: "What variability or hidden feature could control performance?", data: "Maps, borings, lab tests, geophysics, monitoring." },
          { name: "Earthquake, fault & ground-failure hazards", concept: "Shaking, rupture, liquefaction, settlement, and lateral spreading depend on source, path, and site.", ask: "Which scenario and site response matter?", data: "Hazard maps, paleoseismology, shear-wave velocity, groundwater, density." },
          { name: "Landslides, subsidence & sinkholes", concept: "Material strength, slope, water, excavation, dissolution, withdrawal, and loading can destabilize ground.", ask: "What mechanism and trigger are supported?", data: "Movement, rainfall, pore pressure, geology, cavities, extraction history." },
          { name: "Contaminated sites & waste isolation", concept: "Source, release, pathway, receptor, reactions, and long-term geology govern contaminant risk and containment.", ask: "What is the conceptual site model and how could it fail?", data: "Samples, hydrogeology, geochemistry, waste inventory, monitoring." },
          { name: "Risk, resilience & communication", concept: "Scenario, likelihood, consequence, vulnerability, uncertainty, and values inform preparedness and land-use decisions.", ask: "Who decides, what threshold matters, and how should uncertainty be communicated?", data: "Hazard scenarios, exposure, fragility, warning time, stakeholder constraints." }
        ],
        investigation: {
          scenario: "Cracks appear in roads and homes above soluble bedrock after a wet season and nearby pumping changes.",
          question: "Are the features caused by sinkhole development, shrink-swell soil, settlement, construction, leakage, or another process?",
          collect: ["Damage chronology, drainage, utilities, pumping, and rainfall", "Detailed mapping, elevations, subsurface methods, and qualified borings", "Bedrock, soil, groundwater, and historical imagery"],
          analyze: ["Test competing mechanisms against spatial and temporal patterns", "Identify immediate life-safety indicators", "Define what evidence is insufficient or ambiguous"],
          decision: "Escalate urgent hazards, establish monitoring and investigation priorities, and support licensed engineering and public-safety decisions."
        }
      },
      {
        id: "planetary-geology",
        group: "Planetary",
        title: "Planetary geology",
        summary: "Using landforms, rocks, spectra, gravity, craters, and missions to understand the Moon, Mars, asteroids, icy worlds, and planetary evolution.",
        question: "Which process shaped the surface, when did it operate, and how do gravity, atmosphere, temperature, and available materials change the Earth analogy?",
        evidence: ["Images, topography, spectra, radar, gravity, and magnetic data", "Meteorites, returned samples, rover analyses, and experiments", "Crater populations, stratigraphy, and geologic maps"],
        tools: ["Orbital remote sensing and photogrammetry", "Landers, rovers, seismometers, and sample return", "Crater statistics and thermal/physical models"],
        decisions: ["Use Earth analogs as hypotheses, not automatic equivalence", "Separate observation from mission/model-dependent interpretation"],
        example: "A channel-like form on Mars suggests flowing material, but morphology, mineralogy, slope, age, and climate context test water, lava, ice, or mass-flow origins.",
        subtopics: [
          { name: "Impact cratering & chronology", concept: "Impact energy excavates, melts, faults, and deposits material; crater density helps estimate relative surface age.", ask: "Is the feature primary, modified, buried, or secondary?", data: "Morphology, ejecta, melt, superposition, crater counts, sample ages." },
          { name: "Planetary volcanism & tectonism", concept: "Lava plains, shields, rifts, scarps, and cryovolcanic candidates reflect heat and lithospheric evolution.", ask: "Which material and stress process produced the form?", data: "Topography, spectra, gravity, structural patterns, thermal models." },
          { name: "Mars water & climate record", concept: "Valleys, deltas, lake beds, minerals, ice, and atmosphere preserve evidence of changing water environments.", ask: "Was water persistent, episodic, surface, groundwater, ice, or brine?", data: "Sedimentary geometry, mineralogy, isotopes, ground ice, climate models." },
          { name: "Icy worlds & ocean worlds", concept: "Ice tectonics, plumes, induced magnetic fields, gravity, and chemistry may indicate subsurface oceans and exchange.", ask: "What evidence distinguishes liquid water, ice flow, and other materials?", data: "Surface fractures, plume particles, radar, gravity, magnetics, thermal data." },
          { name: "Asteroids, meteorites & sample return", concept: "Primitive and differentiated bodies preserve solar-system materials, collisions, alteration, and resource context.", ask: "Does a sample represent surface, interior, parent body, or contamination?", data: "Petrography, isotopes, organics, spectra, mission context." }
        ],
        investigation: {
          scenario: "Orbital images show layered deposits inside a Martian crater with a fan-shaped body and hydrated minerals.",
          question: "Does the site record a persistent lake and delta, short floods, groundwater deposition, wind reworking, or multiple episodes?",
          collect: ["Layer geometry, slopes, superposition, and crater context", "Mineral spectra, grain-scale rover data where available, and ages", "Regional channels, climate constraints, and Earth analog limits"],
          analyze: ["Compare facies predictions for each model", "Map evidence of reworking and unconformities", "Keep habitability separate from evidence of life"],
          decision: "Rank depositional histories and identify the safest, highest-information observations or samples for a mission."
        }
      },
      {
        id: "field-mapping-remote",
        group: "Methods",
        title: "Field geology, mapping, GIS & remote sensing",
        summary: "The integrated practice of observing, locating, recording, sampling, visualizing, and communicating geological relationships from outcrop to planet.",
        question: "What can be directly observed, what is interpolated, how was each datum produced, and can another geologist reproduce the reasoning?",
        evidence: ["Field notes, sketches, photographs, coordinates, attitudes, and samples", "Maps, cross sections, imagery, elevation, and metadata", "Quality controls, provenance, uncertainty, and revision history"],
        tools: ["Compass-clinometer, hand lens, GPS/GNSS, and field notebook", "GIS, remote sensing, drones where lawful, and photogrammetry", "Databases, scripting, visualization, and reproducible workflows"],
        decisions: ["Design observations around the question, not around available gadgets", "Map certainty and contacts honestly; do not hide interpolation"],
        example: "A dashed contact communicates an inferred boundary; the map should preserve why it was inferred and which observations constrain it.",
        subtopics: [
          { name: "Field observation & notebooks", concept: "Contemporaneous descriptions, sketches, scales, orientations, locations, hypotheses, and sample links preserve evidence.", ask: "Could another person reconstruct the observation and distinguish it from interpretation?", data: "Dated entries, station IDs, coordinates, photos, measurements." },
          { name: "Geologic maps & cross sections", concept: "Maps show surface distribution and structures; sections test three-dimensional consistency and event history.", ask: "Are contacts located, inferred, concealed, or uncertain?", data: "Outcrops, attitudes, topography, wells, geophysics, projections." },
          { name: "Sampling design & QA/QC", concept: "Representative, uncontaminated, documented samples and controls are essential for defensible laboratory results.", ask: "What population does the sample represent?", data: "Sampling frame, duplicates, blanks, standards, chain of custody, preservation." },
          { name: "GIS, lidar & remote sensing", concept: "Spatial data and electromagnetic responses reveal patterns across scales but require resolution, correction, and ground truth.", ask: "What exactly does the sensor measure and what is below resolution?", data: "Metadata, calibration, bands, point density, projections, field checks." },
          { name: "Models, uncertainty, ethics & communication", concept: "Models simplify reality; reproducibility, land access, cultural respect, data stewardship, and honest limits sustain trust.", ask: "What assumption drives the result, who could be affected, and what would change the decision?", data: "Sensitivity tests, versioned inputs, permissions, uncertainty ranges, peer review." }
        ],
        investigation: {
          scenario: "A county needs a new geological map for water, construction, hazards, conservation, and public planning.",
          question: "Which map scale, observations, products, and uncertainty classes can support several decisions without implying false precision?",
          collect: ["Stakeholder questions, existing maps, wells, imagery, lidar, and data gaps", "Systematic field stations, structures, units, samples, and metadata", "Permissions, safety, cultural constraints, and QA/QC records"],
          analyze: ["Develop and revise a unit/structure model", "Construct balanced maps and sections with confidence classes", "Validate against withheld observations and peer review"],
          decision: "Publish accessible map layers, explanations, limitations, and update paths tailored to each use case."
        }
      }
    ],
    settings: [
      {
        id: "divergent",
        label: "Divergent ridge",
        className: "setting-divergent",
        diagram: ["plate left", "plate right", "motion-arrow arrow-left", "motion-arrow arrow-right", "ridge"],
        title: "Plates move apart; new oceanic crust forms.",
        process: "Upwelling and decompression melting feed basaltic crust while normal faults and axial valleys accommodate extension.",
        landforms: "Mid-ocean ridge, rift valley, fissures, hydrothermal vents.",
        hazards: "Mostly shallow earthquakes; volcanism; localized submarine or rift hazards.",
        evidence: "Symmetric magnetic anomalies, youngest seafloor at the axis, high heat flow, GPS extension."
      },
      {
        id: "ocean-continent",
        label: "Ocean–continent",
        className: "setting-subduction",
        diagram: ["plate left", "plate right", "motion-arrow arrow-left", "motion-arrow arrow-right", "trench", "arc"],
        title: "Dense oceanic lithosphere descends beneath a continent.",
        process: "A dipping slab carries water-bearing material downward; fluids promote mantle melting and magma feeds a continental volcanic arc.",
        landforms: "Trench, accretionary wedge, forearc, volcanic arc, mountains.",
        hazards: "Shallow-to-deep earthquakes, megathrusts, tsunamis, explosive eruptions, landslides.",
        evidence: "Dipping earthquake zone, trench, arc chemistry, deformation, geodesy, slab tomography."
      },
      {
        id: "ocean-ocean",
        label: "Ocean–ocean",
        className: "setting-subduction",
        diagram: ["plate left", "plate right", "motion-arrow arrow-left", "motion-arrow arrow-right", "trench", "arc"],
        title: "One oceanic plate subducts and an island arc grows.",
        process: "The older or denser oceanic plate commonly descends, forming a trench and magma system beneath a chain of volcanic islands.",
        landforms: "Deep trench, island arc, forearc and back-arc basins.",
        hazards: "Large earthquakes, tsunamis, explosive or effusive eruptions, slope failures.",
        evidence: "Arc-trench geometry, depth-progressive earthquakes, volcanic chemistry, gravity and bathymetry."
      },
      {
        id: "collision",
        label: "Continent collision",
        className: "setting-collision",
        diagram: ["plate left", "plate right", "motion-arrow arrow-left", "motion-arrow arrow-right", "mountain"],
        title: "Buoyant continents collide and thicken the crust.",
        process: "Subduction closes an ocean; collision stacks, folds, faults, metamorphoses, and uplifts continental crust across a wide belt.",
        landforms: "High mountain range, plateau, fold-thrust belt, suture zone.",
        hazards: "Powerful earthquakes, landslides, glacial and river hazards; limited arc volcanism after collision.",
        evidence: "Sutures and ophiolites, crustal thickening, thrusts, metamorphic belts, GPS shortening."
      },
      {
        id: "transform",
        label: "Transform",
        className: "setting-transform",
        diagram: ["plate left", "plate right", "motion-arrow arrow-left", "motion-arrow arrow-right", "fault"],
        title: "Plates slide laterally past one another.",
        process: "Shear is concentrated on strike-slip fault systems, though bends and stepovers create local compression or extension.",
        landforms: "Linear valleys, offset streams, sag ponds, pressure ridges, fault scarps.",
        hazards: "Predominantly shallow earthquakes and surface rupture; secondary landslides and liquefaction.",
        evidence: "Lateral offsets, aligned seismicity, strike-slip mechanisms, GPS shear, fault-zone rocks."
      },
      {
        id: "hotspot",
        label: "Intraplate hotspot",
        className: "setting-hotspot",
        diagram: ["plate left", "motion-arrow arrow-right", "plume", "island"],
        title: "Volcanism occurs within a moving plate.",
        process: "Localized mantle melting or lithospheric processes feed volcanoes away from a plate edge; the plate may carry older volcanoes away.",
        landforms: "Shield volcano, seamount chain, caldera, volcanic plateau depending on setting.",
        hazards: "Lava, gas, ash, earthquakes, flank instability; style varies strongly with magma and water.",
        evidence: "Age progression, geochemistry, swell/topography, seismic imaging, plate-motion comparison."
      }
    ]
  };
}());
