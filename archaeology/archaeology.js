(function () {
  "use strict";

  var PDF_PATH = "global-archaeological-record-1000-page-reference-edition.pdf";
  var ARTIFACT_HASH = "0468b3acda34f21c685fdbdf88df0a78f74c46a29de995160eff0ca99f21c6cb";

  var chapters = [
    "What archaeologists can and cannot know",
    "History of archaeological practice",
    "The global timeline: deep time to recent past",
    "Human evolution and fossil evidence",
    "Stone technology and technological learning",
    "Fire, shelter, and early domestic life",
    "Ancient DNA, proteins, and migration",
    "Peopling of the Americas",
    "The first agricultural societies",
    "Monuments before states",
    "Ceramics and changing domestic economies",
    "Urban origins and settlement scale",
    "States, institutions, and political authority",
    "Writing, archives, and accounting",
    "Trade networks and the movement of objects",
    "Metallurgy, mining, and craft specialization",
    "Water management and environmental engineering",
    "The archaeology of household life",
    "Burials, commemoration, and ancient societies",
    "Foodways, farming, and climate",
    "Rock art, imagery, and symbolic behavior",
    "Gender, age, labor, and inequality",
    "War, fortifications, and conflict",
    "Religion, ritual, and sacred landscapes",
    "Cities after imperial collapse",
    "Colonial archaeology and connected worlds",
    "Maritime and underwater archaeology",
    "Survey, mapping, GIS, and satellite data",
    "LiDAR, photogrammetry, and 3D recording",
    "Excavation recording and stratigraphic reasoning",
    "Radiocarbon dating and chronological modelling",
    "Other chronometric methods",
    "Experimental archaeology and use-wear",
    "Bioarchaeology and health",
    "Heritage ethics and descendant communities",
    "Illicit antiquities, restitution, and provenance",
    "Conservation, climate, and disaster risks",
    "Research archives, open data, and reproducibility",
    "How to evaluate a contested claim"
  ].map(function (title, index) {
    return { kind: "chapter", number: index + 1, title: title, page: 4 + (index * 3) };
  });

  var regionNames = [
    "East African Human Origins",
    "Southern Africa and Deep Prehistory",
    "Nile Valley and Sudan",
    "North Africa and Sahara",
    "West and Central African Archaeology",
    "Levant and Arabia",
    "Mesopotamia and Iranian Plateau",
    "Anatolia, Cyprus, and Caucasian Fringe",
    "Aegean and Ancient Greece",
    "Classical Rome and Mediterranean",
    "Atlantic and Northern European Prehistory",
    "European Iron Age, Medieval, and Eastern Europe",
    "South Asia: Indus and Deep History",
    "South Asia: Buddhist and Imperial Centers",
    "East Asia: China, Korea, Japan",
    "Southeast Asia",
    "Inner Asia, Steppe, and Siberia",
    "North America",
    "Mesoamerica",
    "South America",
    "Amazonia, Andes, Caribbean",
    "Oceania and Pacific"
  ];

  var regions = regionNames.map(function (title, index) {
    return { kind: "region", number: index + 1, title: title, page: 121 + (index * 40) };
  });

  var records = chapters.concat(regions);
  var selectedKind = "all";
  var searchValue = "";

  var menuToggle = document.querySelector("#archaeology-menu-toggle");
  var menu = document.querySelector("#archaeology-menu");
  var searchInput = document.querySelector("#record-search");
  var recordGrid = document.querySelector("#record-grid");
  var summary = document.querySelector("#record-summary");
  var pdfFrame = document.querySelector("#pdf-frame");
  var pageForm = document.querySelector("#page-jump-form");
  var pageInput = document.querySelector("#page-number");
  var readerStatus = document.querySelector("#reader-status");
  var copyHashButton = document.querySelector("#copy-hash");

  function setMenu(open) {
    if (!menuToggle || !menu) return;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close archaeology navigation" : "Open archaeology navigation");
    menu.classList.toggle("is-open", open);
  }

  function normalized(value) {
    return String(value || "").toLocaleLowerCase().trim();
  }

  function padded(value) {
    return String(value).padStart(2, "0");
  }

  function recordMatches(record) {
    var kindMatches = selectedKind === "all" || record.kind === selectedKind;
    var haystack = normalized(record.title + " " + record.kind + " " + record.page);
    return kindMatches && (!searchValue || haystack.indexOf(searchValue) !== -1);
  }

  function createRecordCard(record) {
    var article = document.createElement("article");
    var meta = document.createElement("div");
    var kind = document.createElement("span");
    var page = document.createElement("span");
    var heading = document.createElement("h3");
    var openButton = document.createElement("button");

    article.className = "record-card";
    article.dataset.kind = record.kind;
    meta.className = "record-card-meta";
    kind.textContent = record.kind === "chapter" ? "Research chapter " + padded(record.number) : "Atlas region " + padded(record.number);
    page.textContent = "Page " + record.page;
    heading.textContent = record.title;
    openButton.type = "button";
    openButton.textContent = "Open in reader →";
    openButton.dataset.readerPage = String(record.page);
    openButton.dataset.readerLabel = record.title;
    meta.append(kind, page);
    article.append(meta, heading, openButton);
    return article;
  }

  function renderRecords() {
    if (!recordGrid || !summary) return;
    var visibleRecords = records.filter(recordMatches);
    recordGrid.replaceChildren();
    visibleRecords.forEach(function (record) {
      recordGrid.appendChild(createRecordCard(record));
    });
    if (!visibleRecords.length) {
      var empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "No matching entry point. Try a broader subject or show all records.";
      recordGrid.appendChild(empty);
    }
    var typeLabel = selectedKind === "all"
      ? (visibleRecords.length === 1 ? "entry point" : "entry points")
      : selectedKind + (visibleRecords.length === 1 ? "" : "s");
    summary.textContent = "Showing " + visibleRecords.length + " " + typeLabel + (searchValue ? " for “" + searchInput.value.trim() + "”." : ".");
  }

  function getPageLabel(page) {
    if (page === 1) return "Cover";
    if (page === 2) return "Regional atlas directory";
    if (page === 3) return "Reader guide";
    var exact = records.find(function (record) { return record.page === page; });
    if (exact) return exact.title;
    if (page >= 4 && page <= 120) return "Research handbook";
    if (page >= 121) return "Site atlas dossier";
    return "Reference edition";
  }

  function openReaderPage(rawPage, label, shouldScroll) {
    var page = Number(rawPage);
    if (!Number.isFinite(page)) page = 1;
    page = Math.max(1, Math.min(1000, Math.round(page)));
    if (pageInput) pageInput.value = String(page);
    if (pdfFrame) pdfFrame.src = PDF_PATH + "#page=" + page + "&view=FitH";
    if (readerStatus) readerStatus.textContent = "Reader positioned at page " + page + ": " + (label || getPageLabel(page)) + ".";
    if (shouldScroll) {
      var reader = document.querySelector("#reader");
      if (reader) reader.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }
  }

  async function copyHash() {
    if (!copyHashButton) return;
    var original = copyHashButton.textContent;
    try {
      await navigator.clipboard.writeText(ARTIFACT_HASH);
      copyHashButton.textContent = "Hash copied";
    } catch (error) {
      copyHashButton.textContent = "Copy unavailable";
    }
    window.setTimeout(function () { copyHashButton.textContent = original; }, 1800);
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
    });
  }

  if (menu) {
    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });
  }

  document.addEventListener("click", function (event) {
    if (menu && menuToggle && !menu.contains(event.target) && !menuToggle.contains(event.target)) setMenu(false);
    var pageButton = event.target.closest("[data-reader-page]");
    if (pageButton) {
      openReaderPage(pageButton.dataset.readerPage, pageButton.dataset.readerLabel || "", true);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setMenu(false);
  });

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      searchValue = normalized(searchInput.value);
      renderRecords();
    });
  }

  document.querySelectorAll("[data-kind]").forEach(function (button) {
    button.addEventListener("click", function () {
      selectedKind = button.dataset.kind || "all";
      document.querySelectorAll("[data-kind]").forEach(function (item) {
        var active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      renderRecords();
    });
  });

  if (pageForm) {
    pageForm.addEventListener("submit", function (event) {
      event.preventDefault();
      openReaderPage(pageInput ? pageInput.value : 1, "", false);
    });
  }

  if (copyHashButton) copyHashButton.addEventListener("click", copyHash);

  renderRecords();
}());
