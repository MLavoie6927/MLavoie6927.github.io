(function () {
  'use strict';

  var toggle = document.getElementById('atlas-menu-toggle');
  var menu = document.getElementById('atlas-menu');

  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open GIT and motherboard navigation');
    menu.classList.remove('is-open');
  }

  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    toggle.setAttribute('aria-label', open ? 'Open GIT and motherboard navigation' : 'Close GIT and motherboard navigation');
    menu.classList.toggle('is-open', !open);
  });

  menu.addEventListener('click', function (event) {
    var shortcut = event.target.closest('[data-atlas-view]');
    if (shortcut) {
      event.preventDefault();
      var view = shortcut.getAttribute('data-atlas-view');
      var target = document.querySelector('#hardware-atlas [data-hwat-view="' + view + '"]');
      if (target) target.click();
      document.getElementById('hardware-atlas').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('click', function (event) {
    var binaryShortcut = event.target.closest('[data-atlas-binary]');
    if (!binaryShortcut) return;
    event.preventDefault();
    var binaryTab = document.querySelector('#hardware-atlas [data-hwat-binary-tab]');
    if (binaryTab) binaryTab.click();
    document.getElementById('hardware-atlas').scrollIntoView({ behavior: 'smooth', block: 'start' });
    closeMenu();
  });

  document.addEventListener('click', function (event) {
    if (!menu.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeMenu();
  });
}());
