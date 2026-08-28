(function () {
  "use strict";

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }

    callback();
  }

  ready(function () {
    var mobileQuery = window.matchMedia("(max-width: 1880px)");
    var navToggle = document.querySelector(".nav-toggle");
    var navMenu = document.querySelector("#primary-menu");
    var navItems = Array.prototype.slice.call(document.querySelectorAll("#primary-menu a"));
    var siteHeader = document.querySelector(".site-header");
    var currentYear = document.querySelector("#current-year");
    var stackTabs = Array.prototype.slice.call(document.querySelectorAll("[data-stack-tab]"));
    var stackPanels = Array.prototype.slice.call(document.querySelectorAll("[data-stack-panel]"));
    var initialHash = window.location.hash;
    var sections = navItems
      .map(function (link) {
        var href = link.getAttribute("href");

        if (!href || href.charAt(0) !== "#" || href.length < 2) {
          return null;
        }

        return document.querySelector(href);
      })
      .filter(function (section) {
        return section !== null;
      });
    var updateQueued = false;

    if (currentYear) {
      currentYear.textContent = new Date().getFullYear().toString();
    }

    function activateStackTab(tab, moveFocus) {
      var stackName = tab.getAttribute("data-stack-tab");

      stackTabs.forEach(function (candidate) {
        var isActive = candidate === tab;
        candidate.classList.toggle("is-active", isActive);
        candidate.setAttribute("aria-selected", isActive ? "true" : "false");
        candidate.setAttribute("tabindex", isActive ? "0" : "-1");
      });

      stackPanels.forEach(function (panel) {
        panel.hidden = panel.getAttribute("data-stack-panel") !== stackName;
      });

      if (moveFocus) {
        tab.focus();
      }
    }

    stackTabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        activateStackTab(tab, false);
      });

      tab.addEventListener("keydown", function (event) {
        var nextIndex = null;

        if (event.key === "ArrowRight") {
          nextIndex = (index + 1) % stackTabs.length;
        } else if (event.key === "ArrowLeft") {
          nextIndex = (index - 1 + stackTabs.length) % stackTabs.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = stackTabs.length - 1;
        }

        if (nextIndex !== null) {
          event.preventDefault();
          activateStackTab(stackTabs[nextIndex], true);
        }
      });
    });

    function setMenuOpen(open) {
      if (!navToggle || !navMenu) {
        return;
      }

      var shouldOpen = Boolean(open && mobileQuery.matches);
      navToggle.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
      navMenu.classList.toggle("is-open", shouldOpen);
      document.body.classList.toggle("nav-open", shouldOpen);
    }

    function updateActiveLink() {
      if (!sections.length) {
        return;
      }

      var headerHeight = siteHeader ? siteHeader.offsetHeight : 76;
      var marker = window.scrollY + headerHeight + 48;
      var activeSection = sections[0];

      sections.forEach(function (section) {
        if (section.offsetTop <= marker) {
          activeSection = section;
        }
      });

      navItems.forEach(function (link) {
        var active = link.getAttribute("href") === "#" + activeSection.id;
        link.classList.toggle("active", active);

        if (active) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }

    function queueActiveLinkUpdate() {
      if (updateQueued) {
        return;
      }

      updateQueued = true;
      window.requestAnimationFrame(function () {
        updateActiveLink();
        updateQueued = false;
      });
    }

    if (navToggle && navMenu) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        setMenuOpen(navToggle.getAttribute("aria-expanded") !== "true");
      });
    }

    navItems.forEach(function (link) {
      link.addEventListener("click", function () {
        setMenuOpen(false);
        window.setTimeout(queueActiveLinkUpdate, 0);
      });
    });

    document.addEventListener("click", function (event) {
      if (!document.body.classList.contains("nav-open")) {
        return;
      }

      if (!siteHeader || !siteHeader.contains(event.target)) {
        setMenuOpen(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && document.body.classList.contains("nav-open")) {
        setMenuOpen(false);
        navToggle.focus();
      }
    });

    function handleBreakpointChange() {
      setMenuOpen(false);
      queueActiveLinkUpdate();
    }

    function alignInitialHash() {
      if (!initialHash || window.location.hash !== initialHash) {
        return;
      }

      var target = document.getElementById(decodeURIComponent(initialHash.slice(1)));

      if (target) {
        target.scrollIntoView({ block: "start" });
      }
    }

    function scheduleInitialHashAlignment() {
      [0, 250, 750, 1500, 3000].forEach(function (delay) {
        window.setTimeout(alignInitialHash, delay);
      });
    }

    if (typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener("change", handleBreakpointChange);
    } else {
      mobileQuery.addListener(handleBreakpointChange);
    }

    window.addEventListener("scroll", queueActiveLinkUpdate, { passive: true });
    window.addEventListener("resize", queueActiveLinkUpdate);
    window.addEventListener("orientationchange", handleBreakpointChange);
    window.addEventListener("hashchange", queueActiveLinkUpdate);

    if (document.readyState === "complete") {
      scheduleInitialHashAlignment();
    } else {
      window.addEventListener("load", scheduleInitialHashAlignment, { once: true });
    }

    updateActiveLink();
  });
})();
