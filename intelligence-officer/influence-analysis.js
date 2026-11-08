/* Defensive, browser-only educational exercise. No network or storage access. */
(() => {
  'use strict';

  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  const menuToggle = document.querySelector('#influence-menu-toggle');
  const navigation = document.querySelector('#influence-navigation');
  const mobileNavigation = window.matchMedia('(max-width: 850px)');

  if (menuToggle && navigation) {
    const setMenu = (open) => {
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      navigation.classList.toggle('is-open', open);
    };

    menuToggle.addEventListener('click', () => {
      setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
    });

    navigation.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (!mobileNavigation.matches || !link) return;
      const destination = link.getAttribute('href');
      if (destination && destination.startsWith('#')) {
        const section = document.querySelector(destination);
        if (section) {
          event.preventDefault();
          setMenu(false);
          window.requestAnimationFrame(() => {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            window.history.pushState(null, '', destination);
          });
          return;
        }
      }
      setMenu(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menuToggle.focus();
      }
    });

    const handleNavigationWidth = () => {
      if (!mobileNavigation.matches) setMenu(false);
    };
    if (typeof mobileNavigation.addEventListener === 'function') {
      mobileNavigation.addEventListener('change', handleNavigationWidth);
    } else {
      mobileNavigation.addListener(handleNavigationWidth);
    }
    setMenu(false);
  }

  const form = document.querySelector('#influence-lab');
  const vectorButtons = Array.from(document.querySelectorAll('.vector-toggle'));
  const indicators = Array.from(document.querySelectorAll('.indicator-check'));
  const vectorCount = document.querySelector('#vector-count');
  const indicatorCount = document.querySelector('#indicator-count');
  const assessButton = document.querySelector('#assess-influence');
  const loadButton = document.querySelector('#load-influence-case');
  const output = document.querySelector('#influence-output');

  if (!form || !vectorCount || !indicatorCount || !assessButton || !loadButton || !output) return;

  const selectedVectors = () => vectorButtons.filter((button) => button.getAttribute('aria-pressed') === 'true');
  const selectedIndicators = () => indicators.filter((input) => input.checked);

  const updateCounts = () => {
    vectorCount.textContent = `${selectedVectors().length} of 6`;
    indicatorCount.textContent = `${selectedIndicators().length} selected`;
  };

  vectorButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const pressed = button.getAttribute('aria-pressed') === 'true';
      button.setAttribute('aria-pressed', String(!pressed));
      button.classList.toggle('active', !pressed);
      updateCounts();
    });
  });

  indicators.forEach((input) => input.addEventListener('change', updateCounts));

  const replaceOutput = (title, copy, fields = [], warning = '') => {
    output.replaceChildren();
    const label = document.createElement('span');
    label.textContent = 'Defensive assessment workspace';
    const heading = document.createElement('h3');
    heading.textContent = title;
    const paragraph = document.createElement('p');
    paragraph.textContent = copy;
    output.append(label, heading, paragraph);
    if (warning) {
      const caution = document.createElement('p');
      caution.className = 'warning';
      caution.textContent = warning;
      output.append(caution);
    }
    if (fields.length) {
      const list = document.createElement('dl');
      fields.forEach(([term, description]) => {
        const row = document.createElement('div');
        const dt = document.createElement('dt');
        const dd = document.createElement('dd');
        dt.textContent = term;
        dd.textContent = description;
        row.append(dt, dd);
        list.append(row);
      });
      output.append(list);
    }
  };

  const assess = () => {
    const vectors = selectedVectors();
    const signals = selectedIndicators();
    if (!vectors.length && !signals.length) {
      replaceOutput(
        'No observations selected',
        'Select only directions and indicators supported by evidence. Do not fill the matrix to make a preferred attribution look stronger.',
        [],
        'The absence of selected indicators means the exercise cannot support a coordination assessment.'
      );
      return;
    }

    const vectorTotal = vectors.length;
    const signalTotal = signals.length;
    const direct = signals.some((input) => input.dataset.kind === 'direct');
    const controlLinks = signals.filter((input) => ['infrastructure', 'control', 'access'].includes(input.dataset.kind)).length;
    const exposure = vectorTotal >= 4 ? 'High exposure convergence' : vectorTotal >= 2 ? 'Multi-direction exposure' : 'Limited observed exposure';
    let coordination = 'Coordination is not established.';
    if (direct) coordination = 'Direct coordination evidence is claimed; authenticate it and obtain qualified legal and analytic review.';
    else if (controlLinks >= 2 && signalTotal >= 4) coordination = 'Coordination is plausible enough to prioritize provenance and control-link collection.';
    else if (signalTotal >= 4) coordination = 'The pattern warrants continued collection, but common-source copying and organic alignment remain viable.';
    else if (signalTotal >= 2) coordination = 'Several leads exist, but they are insufficient for a handler or sponsor judgment.';

    replaceOutput(
      exposure,
      `${vectorTotal} of 6 exposure directions and ${signalTotal} coordination indicators are selected. ${coordination}`,
      [
        ['Directions observed', vectors.length ? vectors.map((button) => button.dataset.vector).join('; ') : 'None selected'],
        ['Indicators cited', signals.length ? signals.map((input) => input.value).join(', ') : 'None selected'],
        ['Competing explanations', 'Organic concern; common-source copying; algorithmic clustering; legitimate advocacy; stale information; coordinated influence.'],
        ['Immediate protection', 'Verify the practical claim, publish current provenance and time, preserve artifacts, and avoid unsupported public attribution.'],
        ['Next collection', direct ? 'Authenticate the claimed tasking and establish scope, authorization, and chain of custody.' : 'Trace first-known origins, independence, shared control, and measurable behavioral effect.']
      ],
      'Convergence is not control. Similar content is not attribution. Exposure does not prove belief, and belief does not prove behavior.'
    );
  };

  assessButton.addEventListener('click', assess);

  loadButton.addEventListener('click', () => {
    vectorButtons.forEach((button) => {
      button.setAttribute('aria-pressed', 'true');
      button.classList.add('active');
    });
    const caseSignals = new Set(['I-01', 'I-02', 'I-03', 'I-05', 'I-07', 'I-09']);
    indicators.forEach((input) => {
      input.checked = caseSignals.has(input.value);
    });
    updateCounts();
    assess();
  });

  form.addEventListener('reset', () => {
    window.setTimeout(() => {
      vectorButtons.forEach((button) => {
        button.setAttribute('aria-pressed', 'false');
        button.classList.remove('active');
      });
      updateCounts();
      replaceOutput(
        'Select observed directions and supported indicators',
        'Exposure convergence and coordination evidence are evaluated separately. A high number of directions can still result from organic copying or one legitimate common source.'
      );
    }, 0);
  });
})();
