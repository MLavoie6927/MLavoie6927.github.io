(function () {
  "use strict";

  var bank = Array.isArray(window.INTERVIEW_QUESTION_BANK) ? window.INTERVIEW_QUESTION_BANK : [];
  var categories = ["general", "cyber", "network", "portfolio"];
  var categoryCopy = {
    general: {
      label: "General",
      title: "Professional communication and work habits"
    },
    cyber: {
      label: "Cybersecurity",
      title: "Security operations, investigations, and engineering"
    },
    network: {
      label: "Networking",
      title: "NOC troubleshooting, routing, switching, and firewalls"
    },
    portfolio: {
      label: "Portfolio",
      title: "Project evidence, validation, and technical walkthroughs"
    }
  };

  var state = {
    category: getInitialCategory(),
    query: ""
  };

  var tabList = document.querySelector(".category-tabs");
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".category-tab"));
  var search = document.querySelector("#question-search");
  var list = document.querySelector("#question-list");
  var emptyState = document.querySelector("#empty-state");
  var clearSearch = document.querySelector("#clear-search");
  var resultCount = document.querySelector("#result-count");
  var categoryLabel = document.querySelector("#active-category-label");
  var resultsTitle = document.querySelector("#results-title");
  var randomButton = document.querySelector("#random-question");
  var expandButton = document.querySelector("#expand-visible");
  var collapseButton = document.querySelector("#collapse-all");

  function getInitialCategory() {
    var hash = window.location.hash.replace("#", "").toLowerCase();
    return categories.indexOf(hash) >= 0 ? hash : "general";
  }

  function scrollBehavior() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  }

  function normalize(value) {
    return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function getVisibleEntries() {
    var query = normalize(state.query);
    return bank.filter(function (entry) {
      if (entry.category !== state.category) {
        return false;
      }
      if (!query) {
        return true;
      }
      return normalize([entry.question, entry.answer, entry.topic].join(" ")).indexOf(query) >= 0;
    });
  }

  function makeElement(tagName, className, textValue) {
    var element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    if (typeof textValue === "string") {
      element.textContent = textValue;
    }
    return element;
  }

  function makeQuestionCard(entry, visibleIndex) {
    var details = makeElement("details", "question-card");
    details.id = entry.id;

    var summary = makeElement("summary");
    var summaryCopy = makeElement("span", "question-summary-copy");
    summaryCopy.appendChild(makeElement("span", "question-number", String(visibleIndex + 1).padStart(2, "0")));
    summaryCopy.appendChild(makeElement("span", "question-title", entry.question));
    summary.appendChild(summaryCopy);
    var toggle = makeElement("span", "question-toggle");
    toggle.setAttribute("aria-hidden", "true");
    summary.appendChild(toggle);
    details.appendChild(summary);

    var body = makeElement("div", "question-body");
    body.appendChild(makeElement("p", "answer-label", "Interview-ready answer"));
    body.appendChild(makeElement("p", "answer-text", entry.answer));

    var meta = makeElement("div", "question-meta");
    meta.appendChild(makeElement("span", "topic-pill", entry.topic));
    meta.appendChild(makeElement("span", "source-note", entry.source));
    body.appendChild(meta);

    if (Array.isArray(entry.evidence) && entry.evidence.length) {
      var evidence = makeElement("div", "evidence-links");
      evidence.appendChild(makeElement("strong", "", "Supporting evidence"));
      entry.evidence.forEach(function (item) {
        var link = makeElement("a", "", item.label);
        link.href = item.href;
        evidence.appendChild(link);
      });
      body.appendChild(evidence);
    }

    details.appendChild(body);
    return details;
  }

  function updateTabs() {
    tabs.forEach(function (tab) {
      var isActive = tab.dataset.category === state.category;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
      tab.tabIndex = isActive ? 0 : -1;
    });
    list.setAttribute("aria-labelledby", "tab-" + state.category);
  }

  function render() {
    var entries = getVisibleEntries();
    var fragment = document.createDocumentFragment();

    entries.forEach(function (entry, index) {
      fragment.appendChild(makeQuestionCard(entry, index));
    });

    list.replaceChildren(fragment);
    list.hidden = entries.length === 0;
    emptyState.hidden = entries.length !== 0;

    var copy = categoryCopy[state.category];
    categoryLabel.textContent = copy.label;
    resultsTitle.textContent = copy.title;
    resultCount.textContent = entries.length + (entries.length === 1 ? " question" : " questions");
    updateTabs();
  }

  function selectCategory(category, updateHash) {
    if (categories.indexOf(category) < 0) {
      return;
    }
    state.category = category;
    state.query = "";
    search.value = "";
    if (updateHash) {
      window.history.replaceState(null, "", "#" + category);
    }
    render();
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      selectCategory(tab.dataset.category, true);
    });
  });

  if (tabList) {
    tabList.addEventListener("keydown", function (event) {
      if (["ArrowLeft", "ArrowRight", "Home", "End"].indexOf(event.key) < 0) {
        return;
      }
      event.preventDefault();
      var currentIndex = categories.indexOf(state.category);
      var nextIndex = currentIndex;
      if (event.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + categories.length) % categories.length;
      } else if (event.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % categories.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = categories.length - 1;
      }
      selectCategory(categories[nextIndex], true);
      document.querySelector("#tab-" + categories[nextIndex]).focus();
    });
  }

  search.addEventListener("input", function () {
    state.query = search.value;
    render();
  });

  clearSearch.addEventListener("click", function () {
    state.query = "";
    search.value = "";
    render();
    search.focus();
  });

  expandButton.addEventListener("click", function () {
    Array.prototype.forEach.call(list.querySelectorAll("details"), function (details) {
      details.open = true;
    });
  });

  collapseButton.addEventListener("click", function () {
    Array.prototype.forEach.call(list.querySelectorAll("details"), function (details) {
      details.open = false;
    });
  });

  randomButton.addEventListener("click", function () {
    var entries = getVisibleEntries();
    if (!entries.length) {
      emptyState.scrollIntoView({ behavior: scrollBehavior(), block: "center" });
      return;
    }
    var chosen = entries[Math.floor(Math.random() * entries.length)];
    var target = document.getElementById(chosen.id);
    if (target) {
      target.open = true;
      target.scrollIntoView({ behavior: scrollBehavior(), block: "center" });
      target.querySelector("summary").focus();
    }
  });

  window.addEventListener("hashchange", function () {
    var category = getInitialCategory();
    if (category !== state.category) {
      selectCategory(category, false);
    }
  });

  if (bank.length !== 200) {
    resultCount.textContent = "Question data unavailable";
  }
  render();
}());
