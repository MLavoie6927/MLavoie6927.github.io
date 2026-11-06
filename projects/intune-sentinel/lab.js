/* All case records are synthetic. This script has no network calls. */
(() => {
  const cases = {
    stale: { title:'One device has no fresh result', summary:'At 10:05 UTC, 19 pilot devices have current evaluations. The twentieth is Not evaluated with an old sync time.', intune:'19/20 fresh', entra:'Report-only tests match', sentinel:'Coverage gap', gate:'HOLD', flowIntune:'1 stale', flowEntra:'Report-only', flowSentinel:'Review gap', state:'Pilot gate · incomplete', answer:'hold', reason:'Hold the +80 wave. Check the device ID, enrollment, ownership, assignment and last sync. Obtain a fresh per-setting result, then rerun the full gate and independent approval.' },
    expected: { title:'A test sign-in predicts denial', summary:'The deliberately noncompliant test device shows a failed compliant-device grant in Report-only. The compliant test device shows a passing result.', intune:'Test states known', entra:'Expected pass / fail', sentinel:'Triage lead', gate:'HOLD', flowIntune:'2 test devices', flowEntra:'Report-only', flowSentinel:'Verify policy ID', state:'Access test · expected', answer:'hold', reason:'Do not call this a production block. Report-only predicts the grant result. Keep the wave held until all 20 devices are fresh and the applied policy ID is confirmed on each test sign-in.' },
    scope: { title:'An unintended device appears in scope', summary:'A filter preview reveals a shared Windows station in the pilot target list. That device class was explicitly excluded from this change.', intune:'21 matched / 20 approved', entra:'Impact untested', sentinel:'Change alert', gate:'STOP', flowIntune:'Wrong target', flowEntra:'Report-only', flowSentinel:'Escalate scope', state:'Target gate · failed', answer:'hold', reason:'Stop expansion. Correct the group, assignment or ownership filter; export a new target list and test cross-device sign-ins before requesting fresh approval.' }
  };
  let current = 'stale';
  const byId = id => document.getElementById(id);
  const setText = (id, value) => { byId(id).textContent = value; };
  function render(key) {
    current = key;
    const c = cases[key];
    for (const [id, value] of Object.entries({ 'case-title':c.title, 'case-summary':c.summary, 'signal-intune':c.intune, 'signal-entra':c.entra, 'signal-sentinel':c.sentinel, 'signal-gate':c.gate, 'flow-intune':c.flowIntune, 'flow-entra':c.flowEntra, 'flow-sentinel':c.flowSentinel, 'visual-state':c.state })) setText(id,value);
    document.querySelectorAll('[data-case]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.case === key)));
    document.querySelectorAll('[data-answer]').forEach(button => button.setAttribute('aria-pressed','false'));
    const feedback = byId('decision-feedback');
    feedback.textContent = 'Select a decision to reveal the reason and next evidence.';
    feedback.className = 'feedback';
  }
  document.querySelectorAll('[data-case]').forEach(button => button.addEventListener('click',() => render(button.dataset.case)));
  document.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click',() => {
    const correct = button.dataset.answer === cases[current].answer;
    document.querySelectorAll('[data-answer]').forEach(item => item.setAttribute('aria-pressed',String(item === button)));
    const feedback = byId('decision-feedback');
    feedback.className = `feedback ${correct ? 'good' : 'bad'}`;
    feedback.textContent = `${correct ? 'Defensible decision.' : 'That action is not supported by this packet.'} ${cases[current].reason}`;
  }));
})();
