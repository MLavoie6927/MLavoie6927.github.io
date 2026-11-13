(function () {
  "use strict";

  var PDF_FILE = "general-science-reference-2026-expanded-edition.pdf";
  var disciplines = [
    {n:1,page:5,domain:"foundations",title:"Scientific Inquiry and Evidence",topics:["Observations and Inferences","Research Questions","Hypotheses and Predictions"]},
    {n:2,page:46,domain:"foundations",title:"Measurement, Units and Scale",topics:["International System of Units","Length and Distance","Mass and Amount of Substance"]},
    {n:3,page:87,domain:"foundations",title:"Mathematics for Science",topics:["Functions and Graphs","Linear Relationships","Quadratic Relationships"]},
    {n:4,page:128,domain:"foundations",title:"Statistics and Data Science",topics:["Populations and Samples","Sampling Bias","Means and Medians"]},
    {n:5,page:169,domain:"physical",title:"Classical Mechanics",topics:["Position and Displacement","Speed and Velocity","Acceleration"]},
    {n:6,page:210,domain:"physical",title:"Fluid Mechanics and Thermodynamics",topics:["Density","Pressure","Buoyancy"]},
    {n:7,page:251,domain:"physical",title:"Waves, Sound and Optics",topics:["Wave Amplitude","Wavelength and Frequency","Superposition"]},
    {n:8,page:292,domain:"physical",title:"Electricity and Magnetism",topics:["Electric Charge","Coulomb Law","Electric Field"]},
    {n:9,page:333,domain:"physical",title:"Modern Physics and Relativity",topics:["Inertial Frames","Speed of Light","Time Dilation"]},
    {n:10,page:374,domain:"physical",title:"Atomic, Nuclear and Particle Physics",topics:["Atomic Structure","Atomic Orbitals","Electron Spin"]},
    {n:11,page:415,domain:"life",title:"Inorganic and General Chemistry",topics:["Elements and Compounds","Periodic Table","Valence Electrons"]},
    {n:12,page:456,domain:"life",title:"Organic Chemistry and Materials",topics:["Carbon Bonding","Hydrocarbons","Alkanes"]},
    {n:13,page:497,domain:"life",title:"Biochemistry and Molecular Biology",topics:["Water in Biology","Biological Macromolecules","Amino Acids"]},
    {n:14,page:538,domain:"life",title:"Cell Biology",topics:["Cell Theory","Prokaryotes and Eukaryotes","Plasma Membrane Transport"]},
    {n:15,page:579,domain:"life",title:"Genetics, Evolution and Biodiversity",topics:["Genes","Chromosomes","DNA Replication"]},
    {n:16,page:620,domain:"life",title:"Microbiology and Virology",topics:["Microbial Diversity","Bacterial Cell Structure","Archaea"]},
    {n:17,page:661,domain:"life",title:"Human Anatomy and Physiology",topics:["Anatomical Organization","Epithelial Tissue","Connective Tissue"]},
    {n:18,page:702,domain:"life",title:"Immunology, Medicine and Health",topics:["Innate Immunity","Adaptive Immunity","Antibodies"]},
    {n:19,page:743,domain:"life",title:"Neuroscience and Cognitive Science",topics:["Neurons","Resting Membrane Potential","Action Potentials"]},
    {n:20,page:784,domain:"life",title:"Ecology and Conservation Biology",topics:["Levels of Ecological Organization","Population Growth","Carrying Capacity"]},
    {n:21,page:825,domain:"earth",title:"Geology and the Solid Earth",topics:["Earth Interior","Plate Tectonics","Continental Drift"]},
    {n:22,page:866,domain:"earth",title:"Atmosphere, Weather and Climate",topics:["Atmospheric Composition","Atmospheric Pressure","Troposphere and Stratosphere"]},
    {n:23,page:907,domain:"earth",title:"Oceanography and Water Science",topics:["Global Water Cycle","Watersheds","River Discharge"]},
    {n:24,page:948,domain:"earth",title:"Planetary Science and Solar System",topics:["Solar Nebula Hypothesis","The Sun","Mercury"]},
    {n:25,page:989,domain:"earth",title:"Stars, Galaxies and Cosmology",topics:["Star Formation","Stellar Equilibrium","Stellar Spectra"]},
    {n:26,page:1030,domain:"systems",title:"Computer and Information Science",topics:["Binary Representation","Boolean Logic","Algorithms"]},
    {n:27,page:1071,domain:"systems",title:"Engineering, Energy and Technology",topics:["Engineering Design","Systems Engineering","Safety Factors"]},
    {n:28,page:1112,domain:"systems",title:"Behavioral, Social and Public Health Sciences",topics:["Scientific Psychology","Psychophysics","Behavioral Conditioning"]}
  ];

  var domainNames = {
    foundations:"Foundations & data",
    physical:"Physical sciences",
    life:"Chemical & life",
    earth:"Earth & space",
    systems:"Computing, engineering & society"
  };
  var domainColors = {foundations:"#46d9ef",physical:"#a58bff",life:"#43e3b1",earth:"#ffc45a",systems:"#ff7e9e"};

  var investigations = {
    cooling:{title:"Cooling across container materials",question:"When equal volumes of warm water begin at the same temperature, how does container material relate to the rate of cooling under the same room conditions?",hypothesis:"A container that transfers heat more readily will show a steeper temperature decrease over the same interval.",independent:"Container material; keep shape and capacity as similar as practical.",dependent:"Water temperature recorded at fixed time intervals, plus calculated temperature change per minute.",controls:"Starting volume, starting temperature, room location, lid condition, thermometer, timing, and airflow.",confounder:"Different container thickness, shape, surface area, or thermometer placement could be mistaken for a material effect.",analysis:"Plot temperature against time for repeated trials; compare slopes and variation, not just the final reading.",trigger:"Overlapping repeated-trial ranges, a reversed pattern, or a stronger relationship with shape or thickness would weaken the material explanation."},
    pendulum:{title:"Pendulum length and period",question:"For small swings, how does the length of a simple pendulum relate to the time required for one complete cycle?",hypothesis:"A longer pendulum will have a longer period when release angle and local conditions are held similar.",independent:"Distance from the pivot to the center of the suspended mass.",dependent:"Average period calculated from the time for multiple complete cycles.",controls:"Mass, release angle, pivot, string type, timing method, and number of cycles.",confounder:"Changing the release angle, measuring the wrong length, or timing a single cycle can hide the relationship.",analysis:"Repeat each length, average multi-cycle measurements, graph period against length, and inspect whether the pattern is linear or curved.",trigger:"No repeatable increase, inconsistent timing beyond the apparent effect, or a systematic change in release angle would require redesign."},
    germination:{title:"Light exposure and early germination",question:"Under the same moisture and temperature conditions, is early germination different between seeds kept in light and seeds kept in darkness?",hypothesis:"If light exposure influences early germination for the selected seed, the proportion germinated over time will differ between the two conditions.",independent:"Light condition: exposed or covered, using the same seed type and batch.",dependent:"Proportion of seeds meeting a defined germination criterion at the same observation times.",controls:"Seed batch, count, container, moisture, temperature, depth, observation schedule, and germination definition.",confounder:"A covered container may also change temperature or moisture, so an apparent light effect may have another cause.",analysis:"Use multiple containers per condition, graph cumulative germination proportions, and report counts and variability.",trigger:"A difference that disappears across replicates, follows temperature instead of light, or is smaller than counting uncertainty would lower confidence."},
    friction:{title:"Surface material and sliding distance",question:"When the same object is released consistently, how does surface material relate to the distance traveled before stopping?",hypothesis:"Surfaces producing greater opposing friction will be associated with shorter stopping distances.",independent:"Surface material along an otherwise consistent track.",dependent:"Distance from a fixed release point to the object's final position.",controls:"Object, starting point, release method, track angle, path length, surface condition, and measurement tool.",confounder:"A push at release, uneven surface, changing slope, or debris may overwhelm the surface effect.",analysis:"Use repeated releases, compare distributions and averages, and flag outliers caused by visible release errors.",trigger:"No stable ordering across repeated trials, overlap larger than the observed differences, or altered slope would prevent a confident conclusion."}
  };

  var grid = document.getElementById("discipline-grid");
  var search = document.getElementById("discipline-search");
  var filters = document.getElementById("discipline-filters");
  var count = document.getElementById("discipline-count");
  var empty = document.getElementById("discipline-empty");
  var activeFilter = "all";

  function escapeText(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[character];
    });
  }

  function renderDisciplines() {
    var query = (search.value || "").trim().toLowerCase();
    var visible = disciplines.filter(function (item) {
      var matchesDomain = activeFilter === "all" || item.domain === activeFilter;
      var searchable = [item.title].concat(item.topics).join(" ").toLowerCase();
      return matchesDomain && (!query || searchable.indexOf(query) !== -1);
    });
    grid.innerHTML = visible.map(function (item) {
      var number = String(item.n).padStart(2,"0");
      var tags = item.topics.map(function (topic) { return "<span>" + escapeText(topic) + "</span>"; }).join("");
      return '<article class="discipline-card" style="--domain-color:' + domainColors[item.domain] + '">' +
        '<div class="discipline-meta"><span>Field ' + number + '</span><span>Starts p. ' + item.page + '</span></div>' +
        '<h3>' + escapeText(item.title) + '</h3>' +
        '<p>' + escapeText(domainNames[item.domain]) + ' · 20 paired topics</p>' +
        '<div class="topic-list" aria-label="Sample topics">' + tags + '</div>' +
        '<button type="button" data-open-page="' + item.page + '" aria-label="Open ' + escapeText(item.title) + ' at page ' + item.page + '">Open field in reader →</button>' +
      '</article>';
    }).join("");
    count.textContent = visible.length + (visible.length === 1 ? " discipline" : " disciplines");
    empty.hidden = visible.length !== 0;
  }

  function openReaderPage(page, scroll) {
    var bounded = Math.max(1,Math.min(1195,Number(page) || 1));
    document.getElementById("reader-page").value = bounded;
    document.getElementById("reader-current").textContent = bounded;
    document.getElementById("pdf-frame").src = PDF_FILE + "#page=" + bounded + "&view=FitH";
    if (scroll) document.getElementById("reader").scrollIntoView({behavior:"smooth",block:"start"});
  }

  search.addEventListener("input",renderDisciplines);
  filters.addEventListener("click",function (event) {
    var button = event.target.closest("[data-filter]");
    if (!button) return;
    activeFilter = button.getAttribute("data-filter");
    filters.querySelectorAll("[data-filter]").forEach(function (candidate) {
      var active = candidate === button;
      candidate.classList.toggle("is-active",active);
      candidate.setAttribute("aria-pressed",String(active));
    });
    renderDisciplines();
  });
  grid.addEventListener("click",function (event) {
    var button = event.target.closest("[data-open-page]");
    if (button) openReaderPage(button.getAttribute("data-open-page"),true);
  });

  document.querySelectorAll("[data-reader-page]").forEach(function (button) {
    button.addEventListener("click",function () { openReaderPage(button.getAttribute("data-reader-page"),false); });
  });
  document.getElementById("reader-form").addEventListener("submit",function (event) {
    event.preventDefault();
    openReaderPage(document.getElementById("reader-page").value,false);
  });

  var investigationSelect = document.getElementById("investigation-select");
  function renderInvestigation() {
    var item = investigations[investigationSelect.value] || investigations.cooling;
    ["title","question","hypothesis","independent","dependent","controls","confounder","analysis","trigger"].forEach(function (field) {
      document.getElementById("investigation-" + field).textContent = item[field];
    });
  }
  investigationSelect.addEventListener("change",renderInvestigation);

  var toggle = document.getElementById("science-menu-toggle");
  var menu = document.getElementById("science-menu");
  function closeMenu() {
    toggle.setAttribute("aria-expanded","false");
    toggle.setAttribute("aria-label","Open science navigation");
    menu.classList.remove("is-open");
  }
  toggle.addEventListener("click",function () {
    var open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded",String(!open));
    toggle.setAttribute("aria-label",open ? "Open science navigation" : "Close science navigation");
    menu.classList.toggle("is-open",!open);
  });
  menu.addEventListener("click",function (event) { if (event.target.closest("a")) closeMenu(); });
  document.addEventListener("keydown",function (event) { if (event.key === "Escape") closeMenu(); });
  document.addEventListener("click",function (event) {
    if (!menu.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });

  renderDisciplines();
  renderInvestigation();
}());
