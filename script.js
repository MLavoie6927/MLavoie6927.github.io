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
    var mobileQuery = window.matchMedia("(max-width: 1460px)");
    var navToggle = document.querySelector(".nav-toggle");
    var navMenu = document.querySelector("#primary-menu");
    var navItems = Array.prototype.slice.call(document.querySelectorAll("#primary-menu a"));
    var siteHeader = document.querySelector(".site-header");
    var currentYear = document.querySelector("#current-year");
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

    if (typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener("change", handleBreakpointChange);
    } else {
      mobileQuery.addListener(handleBreakpointChange);
    }

    window.addEventListener("scroll", queueActiveLinkUpdate, { passive: true });
    window.addEventListener("resize", queueActiveLinkUpdate);
    window.addEventListener("orientationchange", handleBreakpointChange);
    window.addEventListener("hashchange", queueActiveLinkUpdate);

    updateActiveLink();
  });
})();
