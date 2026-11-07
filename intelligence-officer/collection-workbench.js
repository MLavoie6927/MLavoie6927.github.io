/* Browser-only simulation. Static GitHub Pages safe: no network or storage access. */
(() => {
  'use strict';

  const filters = Array.from(document.querySelectorAll('.evidence-filter'));
  const evidenceCards = Array.from(document.querySelectorAll('.evidence-card'));
  const form = document.querySelector('#assessment-builder');
  const output = document.querySelector('#brief-output');
  const buildButton = document.querySelector('#build-brief');
  const modelButton = document.querySelector('#load-model');
  const evidenceCount = document.querySelector('#evidence-count');

  if (!form || !output || !buildButton || !modelButton || !evidenceCount) return;

  filters.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter || 'all';
      filters.forEach((item) => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      evidenceCards.forEach((card) => {
        const sectors = (card.dataset.sector || '').split(/\s+/);
        card.hidden = filter !== 'all' && !sectors.includes(filter);
      });
    });
  });

  const hypotheses = {
    h1: {
      title: 'Physical distribution damage is the primary driver.',
      limit: 'Telecommunications loss and supply constraints may still explain visibility gaps and the pace of recovery.',
      collect: 'Confirm field damage locations, crew access, repair type, and restoration milestones.'
    },
    h2: {
      title: 'Telecommunications loss is exaggerating the apparent scope.',
      limit: 'Confirmed feeder lockouts show that at least part of the disruption is physical, not merely missing telemetry.',
      collect: 'Compare local device state, field inspections, customer reports, and restored telemetry.'
    },
    h3: {
      title: 'Fuel and logistics constraints are now the dominant recovery risk.',
      limit: 'Supply constraints can amplify consequences without explaining the original outage.',
      collect: 'Verify measured endurance, tanker departure and location, route access, receiving readiness, and completed delivery.'
    }
  };

  const selectedEvidence = () => Array.from(form.querySelectorAll('input[name="evidence"]:checked')).map((input) => input.value);

  const updateCount = () => {
    const count = selectedEvidence().length;
    evidenceCount.textContent = `${count} selected`;
  };

  form.querySelectorAll('input[name="evidence"]').forEach((input) => input.addEventListener('change', updateCount));

  const replaceOutput = (title, paragraphs, fields = []) => {
    output.replaceChildren();
    const label = document.createElement('span');
    label.className = 'card-label';
    label.textContent = 'Assessment workspace';
    const heading = document.createElement('h3');
    heading.textContent = title;
    output.append(label, heading);
    paragraphs.forEach((copy) => {
      const paragraph = document.createElement('p');
      paragraph.textContent = copy;
      output.append(paragraph);
    });
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

  const buildAssessment = () => {
    const hypothesisInput = form.querySelector('input[name="hypothesis"]:checked');
    const confidence = form.querySelector('#confidence').value;
    const evidence = selectedEvidence();
    if (!hypothesisInput || !confidence || evidence.length < 2) {
      replaceOutput('The draft needs more structure', [
        'Select one lead explanation, a confidence level, and at least two evidence records. Then test whether one of the selected records is inconsistent with the preferred explanation.'
      ]);
      output.querySelector('p').className = 'lab-warning';
      return;
    }
    const hypothesis = hypotheses[hypothesisInput.value];
    const confidenceLabel = confidence.charAt(0).toUpperCase() + confidence.slice(1);
    replaceOutput('Draft first assessment', [
      hypothesis.title,
      `This is a ${confidenceLabel.toLowerCase()}-confidence synthetic assessment based on ${evidence.length} selected records. ${hypothesis.limit}`
    ], [
      ['Evidence cited', evidence.join(', ')],
      ['Next collection', hypothesis.collect],
      ['Decision use', 'Prioritize continuity resources by consequence, time to threshold, and verified compatibility.'],
      ['Review trigger', 'Reassess at 11:30 fictional time or when restoration, pressure, communications, fuel, or route status materially changes.']
    ]);
  };

  buildButton.addEventListener('click', buildAssessment);

  modelButton.addEventListener('click', () => {
    const h1 = form.querySelector('input[name="hypothesis"][value="h1"]');
    h1.checked = true;
    form.querySelector('#confidence').value = 'moderate';
    const modelEvidence = new Set(['EV-01', 'EV-03', 'EV-04', 'EV-05', 'EV-06', 'EV-07', 'EV-11', 'EV-12']);
    form.querySelectorAll('input[name="evidence"]').forEach((input) => {
      input.checked = modelEvidence.has(input.value);
    });
    updateCount();
    buildAssessment();
  });

  form.addEventListener('reset', () => {
    window.setTimeout(() => {
      updateCount();
      replaceOutput('Your draft will appear here', [
        'Choose a lead explanation, a confidence level, and at least two evidence records. Strong assessments also acknowledge inconsistent evidence and define the next collection trigger.'
      ]);
    }, 0);
  });
})();
