/* Operation Harbor Lantern: local-only synthetic exercise. No network calls. */
(() => {
  const feedback = {
    initial: {
      breach: 'Too strong. A rule exists, but the packet has no confirmed message delivery or content scope. Keep exposure unconfirmed.',
      misuse: 'Best working judgment: suspected unauthorized account use, at moderate confidence. Preserve the distinction between observed events and assessed intent.',
      benign: 'Too strong. An approved change and independent owner confirmation have not been supplied. Authorized automation remains a hypothesis.'
    },
    collect: {
      geo: 'Geolocation can help scope a sign-in, but it cannot prove a message left. VPNs and mobile networks can also mislead.',
      trace: 'Best choice. Rule history defines when and how the rule operated; message trace tests whether matching mail was sent or delivered. Verify coverage and retention.',
      actor: 'An actor label cannot resolve delivery and is not supported by these records. Establish the actual event chain first.'
    }
  };
  const branches = {
    none: {
      title: 'A · No delivery found in a complete search',
      record: 'HL-TR-A | 08:51–09:06 UTC | rule=R-42 | matched_messages=0 | trace_coverage=complete',
      judgment: 'Attempted collection is supported; this packet does not show successful forwarding during the checked window. Unauthorized use still needs owner and device corroboration.',
      action: 'Preserve the negative query, exact time range, rule conditions, retention and trace coverage. Continue the access investigation.'
    },
    delivery: {
      title: 'B · External delivery confirmed',
      record: 'HL-TR-B | 08:58:22 UTC | rule=R-42 | message=M-204 | recipient=review@example.test | status=delivered',
      judgment: 'The follow-up packet supports one external delivery. It does not yet prove the recipient read it or that more than one message was affected.',
      action: 'Preserve message and trace IDs; scope content, recipients, and any additional matching messages. Escalate through incident, privacy, legal, and business processes as applicable.'
    },
    authorized: {
      title: 'C · Authorized workflow corroborated',
      record: 'HL-CH-C | approved_change=CH-81 | owner=confirmed | device=managed | destination=approved',
      judgment: 'Independent approval, owner confirmation, and matching device evidence favor an authorized change. The earlier unfamiliar-client clue is explained.',
      action: 'Close or reclassify the incident with cited evidence; review whether the external forwarding exception still meets policy.'
    }
  };
  function select(group, choice) {
    document.querySelectorAll(`[data-${group}]`).forEach(button => button.setAttribute('aria-pressed', String(button.dataset[group] === choice)));
  }
  document.querySelectorAll('[data-initial], [data-collect]').forEach(button => button.addEventListener('click', () => {
    const group = button.hasAttribute('data-initial') ? 'initial' : 'collect';
    const choice = button.dataset[group];
    select(group, choice);
    document.getElementById(`${group}-feedback`).textContent = feedback[group][choice];
  }));
  document.querySelectorAll('[data-branch]').forEach(button => button.addEventListener('click', () => {
    const choice = button.dataset.branch;
    const branch = branches[choice];
    select('branch', choice);
    const output = document.getElementById('branch-output');
    output.replaceChildren();
    for (const [tag, value] of [['h3', branch.title], ['code', branch.record], ['p', `Revised assessment: ${branch.judgment}`], ['p', `Next action: ${branch.action}`]]) {
      const element = document.createElement(tag);
      element.textContent = value;
      output.append(element);
    }
  }));
})();
