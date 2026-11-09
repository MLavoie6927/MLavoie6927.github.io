/* Browser-only General IT Field Desk. No network or storage access. */
(function initializeGeneralItFieldDesk() {
  "use strict";

  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  const data = window.GENERAL_IT_DATA;
  if (!data) throw new Error("General IT data failed to load");

  const element = (tag, className = "", text = "") => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };

  const menuToggle = document.getElementById("it-menu-toggle");
  const navigation = document.getElementById("it-navigation");
  const mobileNavigation = window.matchMedia("(max-width: 850px)");
  if (menuToggle && navigation) {
    const setMenu = (open) => {
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
      navigation.classList.toggle("is-open", open);
    };
    menuToggle.addEventListener("click", () => setMenu(menuToggle.getAttribute("aria-expanded") !== "true"));
    navigation.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (!mobileNavigation.matches || !link) return;
      setMenu(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        menuToggle.focus();
      }
    });
    const handleWidth = () => { if (!mobileNavigation.matches) setMenu(false); };
    if (typeof mobileNavigation.addEventListener === "function") mobileNavigation.addEventListener("change", handleWidth);
    else mobileNavigation.addListener(handleWidth);
    setMenu(false);
  }

  const problemTab = document.getElementById("problem-tab");
  const interviewTab = document.getElementById("interview-tab");
  const problemView = document.getElementById("problem-view");
  const interviewView = document.getElementById("interview-view");
  const tabs = [problemTab, interviewTab];

  const setLibraryView = (view, updateHash = false) => {
    const interviewSelected = view === "interview";
    problemTab.setAttribute("aria-selected", String(!interviewSelected));
    interviewTab.setAttribute("aria-selected", String(interviewSelected));
    problemTab.tabIndex = interviewSelected ? -1 : 0;
    interviewTab.tabIndex = interviewSelected ? 0 : -1;
    problemView.hidden = interviewSelected;
    interviewView.hidden = !interviewSelected;
    if (updateHash) window.history.replaceState(null, "", interviewSelected ? "#interview" : "#problems");
  };

  problemTab.addEventListener("click", () => setLibraryView("problems", true));
  interviewTab.addEventListener("click", () => setLibraryView("interview", true));
  tabs.forEach((tab, index) => {
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      tabs[next].click();
      tabs[next].focus();
    });
  });

  document.querySelectorAll('a[href="#interview"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      setLibraryView("interview", true);
      document.getElementById("problems").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  document.querySelectorAll('a[href="#problems"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      setLibraryView("problems", true);
      document.getElementById("problems").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const problemSearch = document.getElementById("problem-search");
  const problemCategory = document.getElementById("problem-category");
  const problemContext = document.getElementById("problem-context");
  const problemPattern = document.getElementById("problem-pattern");
  const problemPageSize = document.getElementById("problem-page-size");
  const problemList = document.getElementById("problem-list");
  const problemSummary = document.getElementById("problem-summary");
  const problemPageStatus = document.getElementById("problem-page-status");
  const problemPrev = document.getElementById("problem-prev");
  const problemNext = document.getElementById("problem-next");
  const problemFilters = document.getElementById("problem-filters");

  const interviewSearch = document.getElementById("interview-search");
  const interviewCategory = document.getElementById("interview-category");
  const interviewTopic = document.getElementById("interview-topic");
  const interviewList = document.getElementById("interview-list");
  const interviewSummary = document.getElementById("interview-summary");
  const interviewPageStatus = document.getElementById("interview-page-status");
  const interviewPrev = document.getElementById("interview-prev");
  const interviewNext = document.getElementById("interview-next");
  const interviewFilters = document.getElementById("interview-filters");
  const randomQuestion = document.getElementById("random-question");

  const appendOption = (select, value, label) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    select.append(option);
  };

  data.categories.forEach((category) => {
    appendOption(problemCategory, category.id, category.name);
    appendOption(interviewCategory, category.id, category.name);
  });
  data.contexts.forEach((context) => appendOption(problemContext, context.id, context.label));
  data.issuePatterns.forEach((pattern) => appendOption(problemPattern, pattern.id, pattern.title));
  [...new Set(data.interviews.map((item) => item.topic))].forEach((topic) => appendOption(interviewTopic, topic, topic));

  const problemState = { page: 1, pageSize: 20 };
  const interviewState = { page: 1, pageSize: 10 };

  const searchableProblemText = (record) => [
    record.id,
    record.title,
    record.category,
    record.context,
    record.symptom,
    record.likelyCauses.join(" "),
    record.fixSteps.join(" "),
    record.verification,
    record.escalation,
    record.tools.join(" ")
  ].join(" ").toLowerCase();

  const filteredProblems = () => {
    const query = problemSearch.value.trim().toLowerCase();
    return data.problems.filter((record) => {
      if (problemCategory.value !== "all" && record.categoryId !== problemCategory.value) return false;
      if (problemContext.value !== "all" && record.contextId !== problemContext.value) return false;
      if (problemPattern.value !== "all" && record.patternId !== problemPattern.value) return false;
      return !query || searchableProblemText(record).includes(query);
    });
  };

  const createProblemCard = (record) => {
    const card = element("details", "problem-card");
    card.id = record.id;
    const summary = document.createElement("summary");
    const number = element("span", "record-number", `#${String(record.number).padStart(4, "0")}`);
    const title = element("span", "problem-title");
    title.append(element("strong", "", record.title), element("span", "", `${record.category} · ${record.context}`));
    summary.append(number, title);

    const body = element("div", "problem-body");
    const left = document.createElement("div");
    const symptom = element("section", "record-section");
    symptom.append(element("h4", "", "Reported symptom"), element("p", "", record.symptom));
    const causes = element("section", "record-section");
    causes.append(element("h4", "", "Likely causes"));
    const causeList = document.createElement("ul");
    record.likelyCauses.forEach((cause) => causeList.append(element("li", "", cause)));
    causes.append(causeList);
    const tools = element("section", "record-section");
    tools.append(element("h4", "", "Useful evidence and tools"));
    const toolRow = element("div", "tools-row");
    record.tools.forEach((tool) => toolRow.append(element("span", "", tool)));
    tools.append(toolRow);
    left.append(symptom, causes, tools);

    const right = document.createElement("div");
    const fix = element("section", "record-section");
    fix.append(element("h4", "", "Safe fix sequence"));
    const fixList = document.createElement("ol");
    record.fixSteps.forEach((step) => fixList.append(element("li", "", step)));
    fix.append(fixList);
    const verify = element("section", "record-section");
    verify.append(element("h4", "", "Verification"), element("p", "verify", record.verification));
    const escalate = element("section", "record-section");
    escalate.append(element("h4", "", "Escalate when"), element("p", "escalate", record.escalation));
    right.append(fix, verify, escalate);
    body.append(left, right);
    card.append(summary, body);
    return card;
  };

  const renderProblems = () => {
    const matches = filteredProblems();
    problemState.pageSize = Number(problemPageSize.value);
    const pages = Math.max(1, Math.ceil(matches.length / problemState.pageSize));
    problemState.page = Math.min(Math.max(1, problemState.page), pages);
    const start = (problemState.page - 1) * problemState.pageSize;
    const visible = matches.slice(start, start + problemState.pageSize);
    problemList.replaceChildren();
    if (!visible.length) problemList.append(element("div", "empty-state", "No records match those filters. Try a broader search or reset the library."));
    else visible.forEach((record) => problemList.append(createProblemCard(record)));
    const first = matches.length ? start + 1 : 0;
    const last = Math.min(start + problemState.pageSize, matches.length);
    problemSummary.textContent = `Showing ${first.toLocaleString()}–${last.toLocaleString()} of ${matches.length.toLocaleString()} matching records · ${data.problems.length.toLocaleString()} total`;
    problemPageStatus.textContent = `Page ${problemState.page} of ${pages}`;
    problemPrev.disabled = problemState.page <= 1;
    problemNext.disabled = problemState.page >= pages;
  };

  [problemSearch, problemCategory, problemContext, problemPattern, problemPageSize].forEach((control) => {
    control.addEventListener(control === problemSearch ? "input" : "change", () => {
      problemState.page = 1;
      renderProblems();
    });
  });
  problemFilters.addEventListener("reset", () => window.setTimeout(() => { problemState.page = 1; renderProblems(); }));
  problemPrev.addEventListener("click", () => { problemState.page -= 1; renderProblems(); problemList.scrollIntoView({ behavior: "smooth", block: "start" }); });
  problemNext.addEventListener("click", () => { problemState.page += 1; renderProblems(); problemList.scrollIntoView({ behavior: "smooth", block: "start" }); });

  const searchableInterviewText = (record) => [record.id, record.category, record.topic, record.question, record.answer, record.answerShape].join(" ").toLowerCase();
  const filteredInterviews = () => {
    const query = interviewSearch.value.trim().toLowerCase();
    return data.interviews.filter((record) => {
      if (interviewCategory.value !== "all" && record.categoryId !== interviewCategory.value) return false;
      if (interviewTopic.value !== "all" && record.topic !== interviewTopic.value) return false;
      return !query || searchableInterviewText(record).includes(query);
    });
  };

  const createInterviewCard = (record) => {
    const card = element("details", "interview-card");
    card.id = record.id;
    const summary = document.createElement("summary");
    const number = element("span", "record-number", `Q${String(record.number).padStart(3, "0")}`);
    const title = element("span", "interview-title");
    title.append(element("strong", "", record.question), element("span", "", `${record.category} · ${record.topic}`));
    summary.append(number, title);
    const body = element("div", "interview-body");
    const answer = document.createElement("div");
    answer.append(element("h4", "", "Model answer"), element("p", "", record.answer));
    const shape = element("aside", "answer-shape");
    shape.append(element("strong", "", "Strong answer structure"), element("span", "", record.answerShape));
    body.append(answer, shape);
    card.append(summary, body);
    return card;
  };

  const renderInterviews = (highlightId = "") => {
    const matches = filteredInterviews();
    const pages = Math.max(1, Math.ceil(matches.length / interviewState.pageSize));
    interviewState.page = Math.min(Math.max(1, interviewState.page), pages);
    const start = (interviewState.page - 1) * interviewState.pageSize;
    const visible = matches.slice(start, start + interviewState.pageSize);
    interviewList.replaceChildren();
    if (!visible.length) interviewList.append(element("div", "empty-state", "No interview questions match those filters."));
    else visible.forEach((record) => {
      const card = createInterviewCard(record);
      if (record.id === highlightId) {
        card.open = true;
        card.classList.add("random-highlight");
      }
      interviewList.append(card);
    });
    const first = matches.length ? start + 1 : 0;
    const last = Math.min(start + interviewState.pageSize, matches.length);
    interviewSummary.textContent = `Showing ${first}–${last} of ${matches.length} matching questions · ${data.interviews.length} total`;
    interviewPageStatus.textContent = `Page ${interviewState.page} of ${pages}`;
    interviewPrev.disabled = interviewState.page <= 1;
    interviewNext.disabled = interviewState.page >= pages;
  };

  [interviewSearch, interviewCategory, interviewTopic].forEach((control) => {
    control.addEventListener(control === interviewSearch ? "input" : "change", () => {
      interviewState.page = 1;
      renderInterviews();
    });
  });
  interviewFilters.addEventListener("reset", () => window.setTimeout(() => { interviewState.page = 1; renderInterviews(); }));
  interviewPrev.addEventListener("click", () => { interviewState.page -= 1; renderInterviews(); interviewList.scrollIntoView({ behavior: "smooth", block: "start" }); });
  interviewNext.addEventListener("click", () => { interviewState.page += 1; renderInterviews(); interviewList.scrollIntoView({ behavior: "smooth", block: "start" }); });
  randomQuestion.addEventListener("click", () => {
    const matches = filteredInterviews();
    if (!matches.length) return;
    const selected = matches[Math.floor(Math.random() * matches.length)];
    const index = matches.findIndex((item) => item.id === selected.id);
    interviewState.page = Math.floor(index / interviewState.pageSize) + 1;
    renderInterviews(selected.id);
    const card = document.getElementById(selected.id);
    if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  document.getElementById("hero-problem-count").textContent = data.problems.length.toLocaleString();
  document.getElementById("hero-interview-count").textContent = data.interviews.length.toLocaleString();
  renderProblems();
  renderInterviews();
  setLibraryView(window.location.hash === "#interview" ? "interview" : "problems");
})();
