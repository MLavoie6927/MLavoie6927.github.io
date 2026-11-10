(function () {
  "use strict";

  var data = window.GEOLOGY_DATA;
  if (!data) return;

  var activeGroup = "All";
  var searchTerm = "";
  var activeSetting = data.settings[0].id;
  var menuButton = document.querySelector(".menu-toggle");
  var menu = document.getElementById("geology-menu");
  var filterHost = document.getElementById("topic-filters");
  var topicGrid = document.getElementById("topic-grid");
  var resultCount = document.getElementById("topic-result-count");
  var emptyState = document.getElementById("topic-empty");
  var searchInput = document.getElementById("topic-search");
  var plateSelector = document.getElementById("plate-selector");
  var plateModel = document.getElementById("plate-model");
  var plateReadout = document.getElementById("plate-readout");
  var investigationSelect = document.getElementById("investigation-select");
  var investigationCard = document.getElementById("investigation-card");

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function listMarkup(items) {
    return "<ul>" + items.map(function (item) {
      return "<li>" + escapeHTML(item) + "</li>";
    }).join("") + "</ul>";
  }

  function closeMenu() {
    if (!menuButton || !menu) return;
    menu.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open geology navigation");
  }

  if (menuButton && menu) {
    menuButton.addEventListener("click", function () {
      var shouldOpen = menuButton.getAttribute("aria-expanded") !== "true";
      menu.classList.toggle("is-open", shouldOpen);
      menuButton.setAttribute("aria-expanded", String(shouldOpen));
      menuButton.setAttribute("aria-label", shouldOpen ? "Close geology navigation" : "Open geology navigation");
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  function renderFilters() {
    filterHost.innerHTML = data.groups.map(function (group) {
      var active = group === activeGroup;
      return '<button class="filter-button' + (active ? " is-active" : "") + '" type="button" data-group="' + escapeHTML(group) + '" aria-pressed="' + String(active) + '">' + escapeHTML(group) + "</button>";
    }).join("");

    filterHost.querySelectorAll("button").forEach(function (button) {
      button.addEventListener("click", function () {
        activeGroup = button.getAttribute("data-group") || "All";
        renderFilters();
        renderTopics();
      });
    });
  }

  function searchableDomain(domain) {
    return [
      domain.title,
      domain.group,
      domain.summary,
      domain.question,
      domain.example,
      domain.evidence.join(" "),
      domain.tools.join(" "),
      domain.decisions.join(" "),
      domain.subtopics.map(function (item) { return [item.name, item.concept, item.ask, item.data].join(" "); }).join(" ")
    ].join(" ").toLowerCase();
  }

  function topicMarkup(domain, index) {
    var subtopics = domain.subtopics.map(function (item) {
      return '<article class="subtopic"><h4>' + escapeHTML(item.name) + '</h4><p>' + escapeHTML(item.concept) + '</p><p><strong>Ask:</strong> ' + escapeHTML(item.ask) + '</p><p><strong>Data:</strong> ' + escapeHTML(item.data) + "</p></article>";
    }).join("");

    return '<details class="topic-card" id="domain-' + escapeHTML(domain.id) + '">' +
      '<summary><span class="domain-number">DOMAIN ' + String(index + 1).padStart(2, "0") + '</span><span class="domain-group">' + escapeHTML(domain.group) + '</span><h3>' + escapeHTML(domain.title) + '</h3><p>' + escapeHTML(domain.summary) + "</p></summary>" +
      '<div class="topic-content"><p class="domain-question"><strong>Core question:</strong> ' + escapeHTML(domain.question) + '</p><div class="subtopic-list">' + subtopics + "</div>" +
      '<div class="domain-grid"><div><h4>Evidence</h4>' + listMarkup(domain.evidence) + '</div><div><h4>Tools</h4>' + listMarkup(domain.tools) + '</div><div><h4>Decision discipline</h4>' + listMarkup(domain.decisions) + "</div></div>" +
      '<p class="domain-example"><strong>Reasoning example:</strong> ' + escapeHTML(domain.example) + "</p></div></details>";
  }

  function renderTopics() {
    var visible = data.domains.filter(function (domain) {
      var groupMatches = activeGroup === "All" || domain.group === activeGroup;
      var searchMatches = !searchTerm || searchableDomain(domain).indexOf(searchTerm) !== -1;
      return groupMatches && searchMatches;
    });

    topicGrid.innerHTML = visible.map(function (domain) {
      return topicMarkup(domain, data.domains.indexOf(domain));
    }).join("");

    resultCount.textContent = "Showing " + visible.length + " of " + data.domains.length + " domains · " + (visible.length * 5) + " subtopics visible";
    emptyState.hidden = visible.length !== 0;

    var requested = window.location.hash.replace("#domain-", "");
    if (requested) {
      var target = document.getElementById("domain-" + requested);
      if (target) target.open = true;
    }
  }

  searchInput.addEventListener("input", function () {
    searchTerm = searchInput.value.trim().toLowerCase();
    renderTopics();
  });

  document.getElementById("clear-search").addEventListener("click", function () {
    searchInput.value = "";
    searchTerm = "";
    activeGroup = "All";
    renderFilters();
    renderTopics();
    searchInput.focus();
  });

  function renderPlateTabs() {
    plateSelector.innerHTML = data.settings.map(function (setting) {
      var selected = setting.id === activeSetting;
      return '<button class="plate-tab" type="button" role="tab" id="plate-tab-' + escapeHTML(setting.id) + '" aria-controls="plate-model" aria-selected="' + String(selected) + '" data-setting="' + escapeHTML(setting.id) + '">' + escapeHTML(setting.label) + "</button>";
    }).join("");

    plateSelector.querySelectorAll("button").forEach(function (button, index) {
      button.addEventListener("click", function () {
        activeSetting = button.getAttribute("data-setting");
        renderPlateTabs();
        renderPlateSetting();
      });
      button.addEventListener("keydown", function (event) {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
        event.preventDefault();
        var direction = event.key === "ArrowRight" ? 1 : -1;
        var next = (index + direction + data.settings.length) % data.settings.length;
        activeSetting = data.settings[next].id;
        renderPlateTabs();
        renderPlateSetting();
        document.getElementById("plate-tab-" + activeSetting).focus();
      });
    });
  }

  function renderPlateSetting() {
    var setting = data.settings.find(function (item) { return item.id === activeSetting; }) || data.settings[0];
    plateModel.className = "plate-model " + setting.className;
    plateModel.innerHTML = setting.diagram.map(function (className) {
      var arrow = className.indexOf("motion-arrow") !== -1 ? "→" : "";
      return '<span class="' + escapeHTML(className) + '" aria-hidden="true">' + arrow + "</span>";
    }).join("");
    plateModel.setAttribute("aria-label", setting.label + ": " + setting.title);
    plateReadout.innerHTML = '<div><h3>' + escapeHTML(setting.title) + '</h3><p>' + escapeHTML(setting.process) + '</p></div><div><h4>Landforms</h4><p>' + escapeHTML(setting.landforms) + '</p></div><div><h4>Hazards</h4><p>' + escapeHTML(setting.hazards) + '</p></div><div><h4>Evidence to test it</h4><p>' + escapeHTML(setting.evidence) + "</p></div>";
  }

  function renderInvestigationOptions() {
    investigationSelect.innerHTML = data.domains.map(function (domain, index) {
      return '<option value="' + escapeHTML(domain.id) + '">' + String(index + 1).padStart(2, "0") + " · " + escapeHTML(domain.title) + "</option>";
    }).join("");
  }

  function renderInvestigation(id) {
    var index = data.domains.findIndex(function (domain) { return domain.id === id; });
    if (index < 0) index = 0;
    var domain = data.domains[index];
    var item = domain.investigation;
    investigationCard.innerHTML = '<div class="investigation-overview"><span class="case-number">INVESTIGATION ' + String(index + 1).padStart(2, "0") + ' · ' + escapeHTML(domain.group.toUpperCase()) + '</span><h3>' + escapeHTML(item.scenario) + '</h3><p><strong>Decision question:</strong> ' + escapeHTML(item.question) + "</p></div>" +
      '<div class="investigation-detail"><section><h4>Collect</h4>' + listMarkup(item.collect) + '</section><section><h4>Analyze</h4>' + listMarkup(item.analyze) + '</section><section class="decision-box"><h4>Decision product</h4><p>' + escapeHTML(item.decision) + "</p></section></div>";
  }

  investigationSelect.addEventListener("change", function () {
    renderInvestigation(investigationSelect.value);
  });

  renderFilters();
  renderTopics();
  renderPlateTabs();
  renderPlateSetting();
  renderInvestigationOptions();
  renderInvestigation(data.domains[0].id);
}());
