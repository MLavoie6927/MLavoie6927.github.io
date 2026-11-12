(function () {
  "use strict";

  var menuToggle = document.getElementById("menu-toggle");
  var pageMenu = document.getElementById("page-menu");

  function setMenu(open) {
    if (!menuToggle || !pageMenu) {
      return;
    }
    menuToggle.setAttribute("aria-expanded", String(open));
    pageMenu.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    var label = menuToggle.querySelector("b");
    if (label) {
      label.textContent = open ? "Close navigation menu" : "Open navigation menu";
    }
  }

  if (menuToggle && pageMenu) {
    menuToggle.addEventListener("click", function () {
      setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    pageMenu.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        setMenu(false);
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1120) {
        setMenu(false);
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      setMenu(false);
    }
  });

  var roleTabs = Array.prototype.slice.call(document.querySelectorAll("[data-tier]"));
  var rolePanels = Array.prototype.slice.call(document.querySelectorAll("[data-tier-panel]"));

  function showTier(tier, focusTab) {
    roleTabs.forEach(function (tab) {
      var active = tab.dataset.tier === tier;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focusTab) {
        tab.focus();
      }
    });

    rolePanels.forEach(function (panel) {
      var active = panel.dataset.tierPanel === tier;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
  }

  roleTabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      showTier(tab.dataset.tier, false);
    });

    tab.addEventListener("keydown", function (event) {
      var nextIndex = index;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        nextIndex = (index + 1) % roleTabs.length;
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        nextIndex = (index - 1 + roleTabs.length) % roleTabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = roleTabs.length - 1;
      } else {
        return;
      }
      event.preventDefault();
      showTier(roleTabs[nextIndex].dataset.tier, true);
    });
  });

  var decisions = {
    alert: {
      phase: "08:44 · Triage escalation",
      confidence: "Moderate confidence",
      title: "Escalate with evidence; do not overstate the alert.",
      known: "Word launched hidden encoded PowerShell, followed by a related DNS lookup.",
      unknown: "Whether a payload was delivered, executed, persisted, or communicated externally.",
      action: "Confirm Tier 2 ownership, preserve evidence, maintain queue coverage, and check whether the asset or identity increases urgency.",
      avoid: "Do not call this confirmed malware or trigger disruptive automation from one suspicious process chain alone."
    },
    confirmed: {
      phase: "08:51 · Response coordination",
      confidence: "High confidence",
      title: "Contain the endpoint and open enterprise scoping.",
      known: "The DLL was created and loaded, persistence was written, and rundll32 initiated recurring outbound communication.",
      unknown: "The full command set, number of affected systems, credential exposure, lateral movement, and whether data left the environment.",
      action: "Confirm authorized isolation, preserve volatile and durable evidence, launch behavioral estate hunts, notify the business owner, and consider an incident bridge.",
      avoid: "Do not delay containment for complete reverse engineering, and do not report data theft without supporting evidence."
    },
    contained: {
      phase: "After containment · Recovery and improvement",
      confidence: "Compromise confirmed; scope evolving",
      title: "Prove recovery and convert findings into owned improvements.",
      known: "The affected endpoint is isolated and the observed command channel is interrupted in this synthetic scenario.",
      unknown: "Whether every persistence path is removed, whether other assets are affected, and whether proposed controls will be safe and effective in production.",
      action: "Validate recovery, complete scoping, assign detection and prevention work, require acceptance tests, and track corrective actions to evidence-based closure.",
      avoid: "Do not equate endpoint isolation with incident closure or deploy an untested rule solely because it matches this sample."
    }
  };

  var decisionButtons = Array.prototype.slice.call(document.querySelectorAll("[data-decision]"));
  var decisionFields = {
    phase: document.getElementById("decision-phase"),
    confidence: document.getElementById("decision-confidence"),
    title: document.getElementById("decision-title"),
    known: document.getElementById("decision-known"),
    unknown: document.getElementById("decision-unknown"),
    action: document.getElementById("decision-action"),
    avoid: document.getElementById("decision-avoid")
  };

  function showDecision(key) {
    var decision = decisions[key];
    if (!decision) {
      return;
    }
    decisionButtons.forEach(function (button) {
      button.classList.toggle("is-active", button.dataset.decision === key);
    });
    Object.keys(decisionFields).forEach(function (field) {
      if (decisionFields[field]) {
        decisionFields[field].textContent = decision[field];
      }
    });
  }

  decisionButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      showDecision(button.dataset.decision);
    });
  });

  function setCopyState(button, label) {
    if (!button) {
      return;
    }
    var original = button.textContent;
    button.textContent = label;
    window.setTimeout(function () {
      button.textContent = original;
    }, 1600);
  }

  function copyText(button, text) {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      setCopyState(button, "Select and copy manually");
      return;
    }
    navigator.clipboard.writeText(text).then(function () {
      setCopyState(button, "Copied");
    }).catch(function () {
      setCopyState(button, "Copy unavailable");
    });
  }

  var copyBriefing = document.getElementById("copy-briefing");
  var executiveBriefing = document.getElementById("executive-briefing");
  if (copyBriefing && executiveBriefing) {
    copyBriefing.addEventListener("click", function () {
      copyText(copyBriefing, executiveBriefing.textContent.trim());
    });
  }

  var copyQuery = document.getElementById("copy-query");
  var huntQuery = document.getElementById("hunt-query");
  if (copyQuery && huntQuery) {
    copyQuery.addEventListener("click", function () {
      copyText(copyQuery, huntQuery.textContent.trim());
    });
  }
}());
