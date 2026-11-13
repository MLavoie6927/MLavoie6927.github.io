(function () {
  "use strict";

  var PDF_PATH = "five-thousand-years-of-humanity-expanded-2026.pdf";
  var ARTIFACT_HASH = "A3BBEDA9EF35BFC28DE244B0CDFAF8633D23747C62103732CA5E3106F46D9822";
  var atlas = window.HISTORY_ATLAS || { records: [] };
  var records = Array.isArray(atlas.records) ? atlas.records : [];
  var PAGE_SIZE = 24;
  var selectedKind = "all";
  var searchValue = "";
  var visibleLimit = PAGE_SIZE;

  var menuToggle = document.querySelector("#history-menu-toggle");
  var menu = document.querySelector("#history-menu");
  var searchInput = document.querySelector("#history-search");
  var recordGrid = document.querySelector("#history-grid");
  var summary = document.querySelector("#history-summary");
  var progress = document.querySelector("#history-progress");
  var loadMore = document.querySelector("#history-load-more");
  var pdfFrame = document.querySelector("#history-pdf-frame");
  var pageForm = document.querySelector("#history-page-form");
  var pageInput = document.querySelector("#history-page-number");
  var readerStatus = document.querySelector("#history-reader-status");
  var copyHashButton = document.querySelector("#copy-history-hash");

  function setMenu(open) {
    if (!menuToggle || !menu) return;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close history navigation" : "Open history navigation");
    menu.classList.toggle("is-open", open);
  }

  function normalized(value) {
    return String(value || "").toLocaleLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").trim();
  }

  function padded(value, size) {
    return String(value).padStart(size || 2, "0");
  }

  function kindLabel(record) {
    if (record.kind === "generation") return "Generation " + padded(record.number, 3);
    if (record.kind === "study") return "Deep study " + padded(record.number, 2);
    if (record.kind === "dossier") return "Dossier " + padded(record.number, 3);
    return "2026 coda";
  }

  function recordMatches(record) {
    var kindMatches = selectedKind === "all" || record.kind === selectedKind;
    var haystack = normalized([
      record.kind,
      record.number,
      record.title,
      record.period,
      record.lens,
      record.page,
      kindLabel(record)
    ].join(" "));
    return kindMatches && (!searchValue || haystack.indexOf(searchValue) !== -1);
  }

  function createRecordCard(record) {
    var article = document.createElement("article");
    var meta = document.createElement("div");
    var type = document.createElement("span");
    var page = document.createElement("span");
    var heading = document.createElement("h3");
    var period = document.createElement("p");
    var lens = document.createElement("p");
    var openButton = document.createElement("button");

    article.className = "record-card";
    article.dataset.kind = record.kind;
    meta.className = "record-meta";
    type.textContent = kindLabel(record);
    page.textContent = "PDF " + record.page;
    heading.textContent = record.title;
    period.className = "record-period";
    period.textContent = record.period;
    lens.className = "record-lens";
    lens.textContent = record.lens;
    openButton.type = "button";
    openButton.textContent = "Open in the 530-page reader →";
    openButton.dataset.readerPage = String(record.page);
    openButton.dataset.readerLabel = kindLabel(record) + ": " + record.title;
    meta.append(type, page);
    article.append(meta, heading, period, lens, openButton);
    return article;
  }

  function renderRecords() {
    if (!recordGrid || !summary) return;
    var matches = records.filter(recordMatches);
    var shown = matches.slice(0, visibleLimit);
    recordGrid.replaceChildren();
    shown.forEach(function (record) {
      recordGrid.appendChild(createRecordCard(record));
    });

    if (!matches.length) {
      var empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "No matching entry point. Try a broader date, person, place, lens, or show all records.";
      recordGrid.appendChild(empty);
    }

    var querySuffix = searchValue && searchInput ? " for “" + searchInput.value.trim() + "”" : "";
    summary.textContent = "Showing " + shown.length + " of " + matches.length + " matching entry points" + querySuffix + ".";
    if (progress) {
      var percent = matches.length ? Math.max(2, (shown.length / matches.length) * 100) : 0;
      progress.style.setProperty("--history-progress", percent + "%");
    }
    if (loadMore) {
      loadMore.hidden = shown.length >= matches.length;
      var remaining = Math.max(0, matches.length - shown.length);
      loadMore.textContent = "Show " + Math.min(PAGE_SIZE, remaining) + " more entries";
    }
  }

  function getPageLabel(page) {
    if (page === 1) return "Cover";
    if (page === 2) return "Editorial attribution and scope";
    if (page === 3) return "How to use the influence dossiers";
    if (page === 352) return "Deep studies introduction";
    if (page === 529) return "Traceable source guide";
    var exact = records.find(function (record) { return Number(record.page) === page; });
    if (exact) return kindLabel(exact) + ": " + exact.title;
    if (page >= 4 && page <= 351) return "Preserved chronology and source guides";
    if (page >= 353 && page <= 369) return "Deep influence study";
    if (page >= 370 && page <= 528) return "Historical influence dossier";
    if (page >= 529) return "Bibliography";
    return "Expanded research edition";
  }

  function openReaderPage(rawPage, label, shouldScroll) {
    var page = Number(rawPage);
    if (!Number.isFinite(page)) page = 1;
    page = Math.max(1, Math.min(530, Math.round(page)));
    if (pageInput) pageInput.value = String(page);
    if (pdfFrame) pdfFrame.src = PDF_PATH + "#page=" + page + "&view=FitH";
    if (readerStatus) readerStatus.textContent = "Reader positioned at page " + page + ": " + (label || getPageLabel(page)) + ".";
    if (shouldScroll) {
      var reader = document.querySelector("#reader");
      if (reader) {
        var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        reader.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      }
    }
  }

  async function copyHash() {
    if (!copyHashButton) return;
    var original = copyHashButton.textContent;
    try {
      await navigator.clipboard.writeText(ARTIFACT_HASH);
      copyHashButton.textContent = "SHA-256 copied";
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
    if (pageButton) openReaderPage(pageButton.dataset.readerPage, pageButton.dataset.readerLabel || "", true);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setMenu(false);
  });

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      searchValue = normalized(searchInput.value);
      visibleLimit = PAGE_SIZE;
      renderRecords();
    });
  }

  document.querySelectorAll("[data-kind]").forEach(function (button) {
    button.addEventListener("click", function () {
      selectedKind = button.dataset.kind || "all";
      visibleLimit = PAGE_SIZE;
      document.querySelectorAll("[data-kind]").forEach(function (item) {
        var active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      renderRecords();
    });
  });

  if (loadMore) {
    loadMore.addEventListener("click", function () {
      visibleLimit += PAGE_SIZE;
      renderRecords();
    });
  }

  if (pageForm) {
    pageForm.addEventListener("submit", function (event) {
      event.preventDefault();
      openReaderPage(pageInput ? pageInput.value : 1, "", false);
    });
  }

  if (copyHashButton) copyHashButton.addEventListener("click", copyHash);

  renderRecords();
}());
