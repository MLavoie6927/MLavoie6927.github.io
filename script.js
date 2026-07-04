(function () {
  "use strict";

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var MOBILE_BREAKPOINT = 1080;

    var navToggle = document.querySelector(".nav-toggle");
    var navLinks = document.querySelector("#primary-menu");
    var navItems = Array.prototype.slice.call(document.querySelectorAll("#primary-menu a"));
    var siteHeader = document.querySelector(".site-header");
    var currentYear = document.querySelector("#current-year");

    if (currentYear) {
      currentYear.textContent = new Date().getFullYear().toString();
    }

    function isMobileView() {
      return window.innerWidth <= MOBILE_BREAKPOINT;
    }

    function closeMenu() {
      if (!navToggle || !navLinks) {
        return;
      }

      navToggle.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("is-open");
      document.body.classList.remove("nav-open");
    }

    function openMenu() {
      if (!navToggle || !navLinks) {
        return;
      }

      navToggle.setAttribute("aria-expanded", "true");
      navLinks.classList.add("is-open");
      document.body.classList.add("nav-open");
    }

    function toggleMenu() {
      if (!navToggle || !navLinks) {
        return;
      }

      var expanded = navToggle.getAttribute("aria-expanded") === "true";

      if (expanded) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    if (navToggle && navLinks) {
      navToggle.setAttribute("aria-expanded", "false");

      navToggle.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        toggleMenu();
      });
    }

    navItems.forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu();
      });
    });

    document.addEventListener("click", function (event) {
      if (!isMobileView()) {
        return;
      }

      if (!document.body.classList.contains("nav-open")) {
        return;
      }

      if (siteHeader && siteHeader.contains(event.target)) {
        return;
      }

      closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    function getPageSections() {
      return navItems
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
    }

    function updateActiveLink() {
      var sections = getPageSections();

      if (!sections.length) {
        return;
      }

      var headerHeight = siteHeader ? siteHeader.offsetHeight : 76;
      var scrollPosition = window.scrollY + headerHeight + 40;
      var activeSection = sections[0];

      sections.forEach(function (section) {
        if (section.offsetTop <= scrollPosition) {
          activeSection = section;
        }
      });

      navItems.forEach(function (link) {
        var href = link.getAttribute("href");
        var active = activeSection && href === "#" + activeSection.id;

        if (active) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    }

    var ticking = false;

    function requestActiveLinkUpdate() {
      if (ticking) {
        return;
      }

      ticking = true;

      window.requestAnimationFrame(function () {
        updateActiveLink();
        ticking = false;
      });
    }

    function handleResize() {
      if (!isMobileView()) {
        closeMenu();
      }

      requestActiveLinkUpdate();
    }

    updateActiveLink();

    window.addEventListener("scroll", requestActiveLinkUpdate, { passive: true });
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", function () {
      window.setTimeout(handleResize, 250);
    });
  });
})();
