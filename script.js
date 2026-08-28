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


/* =========================================================
   INTERACTIVE DETECTION ENGINEERING LAB
   Add <script src="detection-rules.js" defer>


/* =========================================================
   INTERACTIVE DETECTION ENGINEERING LAB
   Integrated into the portfolio's existing script.js.
   ========================================================= */

(() => {
  "use strict";

  const lab = document.querySelector("[data-detection-lab]");
  if (!lab) return;

  const platforms = [
    "sentinel",
    "crowdstrike",
    "qradar",
    "chronicle",
    "splunk",
    "elastic",
    "wazuh",
    "sigma"
  ];

  const platformMeta = {
    sentinel: {
      name: "Microsoft Sentinel",
      language: "KQL",
      ext: "kql",
      visual: "assets/detection-rules/microsoft-sentinel-detection-rule.svg",
      schema:
        "Uses Microsoft Defender XDR / Microsoft 365-style tables. Confirm connector names, advanced-hunting table availability, and tenant field mappings before deployment."
    },
    crowdstrike: {
      name: "CrowdStrike Falcon Next-Gen SIEM",
      language: "LogScale / CQL-style",
      ext: "cql",
      visual: "assets/detection-rules/crowdstrike-detection-rule.svg",
      schema:
        "Endpoint examples use Falcon event concepts such as ProcessRollup2 and NetworkConnectIP4. Cross-source fields depend on the data routed into Falcon Next-Gen SIEM."
    },
    qradar: {
      name: "IBM QRadar",
      language: "AQL / CRE",
      ext: "aql",
      visual: "assets/detection-rules/ibm-qradar-detection-rule.svg",
      schema:
        "AQL fields, custom properties, QIDs, reference sets, and building blocks vary by DSM and deployment. Treat the query as a portable correlation design."
    },
    chronicle: {
      name: "Google SecOps / Chronicle",
      language: "YARA-L 2.0",
      ext: "yaral",
      visual: "assets/detection-rules/google-chronicle-detection-rule.svg",
      schema:
        "UDM field population depends on the parser and source. Validate principal, target, security_result, process, network, and email mappings before enabling."
    },
    splunk: {
      name: "Splunk Enterprise Security",
      language: "SPL",
      ext: "spl",
      visual: null,
      schema:
        "Indexes, sourcetypes, CIM acceleration, data models, macros, and field aliases differ by environment. Convert to tstats/CIM where appropriate in production."
    },
    elastic: {
      name: "Elastic Security",
      language: "EQL",
      ext: "eql",
      visual: null,
      schema:
        "Examples assume ECS-normalized fields. Validate data stream, event.category/type, process, user, email, and network mappings before promotion."
    },
    wazuh: {
      name: "Wazuh",
      language: "XML Rules",
      ext: "xml",
      visual: null,
      schema:
        "Decoder names and normalized fields are deployment-specific. Parent-child correlation may require custom decoders, rule groups, and frequency/timeframe logic."
    },
    sigma: {
      name: "Sigma",
      language: "Sigma YAML",
      ext: "yml",
      visual: null,
      schema:
        "Sigma expresses portable detection intent. Backend conversion, correlation support, field mapping, and rule semantics must be validated in the target SIEM."
    }
  };

  const detections = {
    phishing: {
      title: "Phishing Delivery Followed by Suspicious PowerShell",
      slug: "phishing-powershell",
      severity: "High",
      attack: "T1566.001 · T1059.001",
      window: "15 minutes",
      entities: "User · Host · Process",
      objective: "Correlate delivery with execution",
      logic:
        "Correlates a delivered email attachment with suspicious PowerShell execution associated with the same user or endpoint inside a short investigation window.",
      telemetry: [
        "Email delivery / attachment telemetry",
        "Endpoint process creation telemetry",
        "User or mailbox identity",
        "Parent / child process relationship",
        "Command-line or script execution detail"
      ],
      triage: [
        "Confirm the message was delivered and identify sender, recipient, attachment, and delivery action.",
        "Validate the endpoint process tree and determine whether Office, archive, browser, or another user-facing process preceded PowerShell.",
        "Inspect PowerShell command line, encoded content, downloads, child processes, file writes, DNS, and network connections.",
        "Scope the sender, attachment hash, recipient, URL, process indicators, and related endpoints before containment."
      ],
      tuning:
        "Common benign sources include sanctioned administration, software deployment, help-desk automation, and approved scripts. Tune with signer, parent process, script path, management tool, user role, and known automation context rather than broad PowerShell exclusions.",
      validation:
        "Test a known-benign administrative PowerShell workflow and a controlled phishing-to-script simulation. The rule should preserve the malicious correlation while suppressing only explicitly approved administrative patterns.",
      code: {
        sentinel: `let DeliveredMail =
EmailEvents
| where Timestamp > ago(1h)
| where DeliveryAction == "Delivered"
| where ThreatTypes has_any ("Phish", "Malware")
| project MailTime=Timestamp, RecipientEmailAddress, NetworkMessageId, Subject;

let Attachment =
EmailAttachmentInfo
| where Timestamp > ago(1h)
| project NetworkMessageId, FileName, SHA256;

DeliveredMail
| join kind=inner Attachment on NetworkMessageId
| join kind=inner (
    DeviceProcessEvents
    | where Timestamp > ago(1h)
    | where FileName =~ "powershell.exe"
    | where ProcessCommandLine has_any (
        "-enc",
        "-encodedcommand",
        "downloadstring",
        "invoke-webrequest",
        "frombase64string"
    )
    | project
        ProcTime=Timestamp,
        AccountUpn,
        DeviceName,
        FileName,
        ProcessCommandLine,
        InitiatingProcessFileName,
        InitiatingProcessCommandLine
) on $left.RecipientEmailAddress == $right.AccountUpn
| where ProcTime between (MailTime .. MailTime + 15m)
| project
    MailTime,
    ProcTime,
    RecipientEmailAddress,
    DeviceName,
    Subject,
    FileName1,
    SHA256,
    InitiatingProcessFileName,
    ProcessCommandLine
| order by ProcTime desc`,
        crowdstrike: `// Falcon Next-Gen SIEM / LogScale-style correlation example
// Assumes mail-security telemetry is also routed into the SIEM.

mail_security event.action="delivered"
| threat.type=/phish|malware/i
| rename(field="recipient", as="UserName")
| join(
    query={
        #event_simpleName=ProcessRollup2
        ImageFileName=/\\\\powershell\\.exe$/i
        CommandLine=/-enc|-encodedcommand|downloadstring|invoke-webrequest|frombase64string/i
        | rename(field="UserName", as="EndpointUser")
    },
    field=UserName,
    key=EndpointUser,
    include=[aid, ComputerName, ImageFileName, CommandLine, ParentBaseFileName]
)
| where(_time - @timestamp <= 900000)
| select([
    @timestamp,
    UserName,
    ComputerName,
    subject,
    attachment_name,
    attachment_sha256,
    ParentBaseFileName,
    ImageFileName,
    CommandLine
])`,
        qradar: `-- QRadar AQL hunting view.
-- In CRE, implement the 15-minute relationship as a rule sequence
-- using DSM-normalized mail + endpoint custom properties.

SELECT
  username,
  sourceip,
  destinationip,
  QIDNAME(qid) AS event_name,
  "Process Name",
  "Parent Process",
  "Command Line",
  "Email Subject",
  "Attachment Name"
FROM events
WHERE
  (
    LOWER(QIDNAME(qid)) LIKE '%phish%'
    OR LOWER("Email Threat Type") IN ('phish','malware')
  )
  OR
  (
    LOWER("Process Name") LIKE '%powershell.exe'
    AND (
      LOWER("Command Line") LIKE '%-enc%'
      OR LOWER("Command Line") LIKE '%-encodedcommand%'
      OR LOWER("Command Line") LIKE '%downloadstring%'
      OR LOWER("Command Line") LIKE '%invoke-webrequest%'
    )
  )
LAST 1 HOURS

-- CRE correlation:
-- 1. Mail threat delivered to USER
-- 2. Within 15 minutes
-- 3. Same USER executes suspicious PowerShell
-- 4. Raise offense only when both building blocks are true.`,
        chronicle: `rule phishing_followed_by_suspicious_powershell {
  meta:
    author = "Marc Lavoie"
    severity = "HIGH"
    mitre_attack = "T1566.001,T1059.001"

  events:
    $mail.metadata.event_type = "EMAIL_TRANSACTION"
    $mail.security_result.category = "MAIL_PHISHING"
    $mail.security_result.action = "ALLOW"
    $user = $mail.target.user.email_addresses

    $proc.metadata.event_type = "PROCESS_LAUNCH"
    $proc.target.process.file.full_path = /powershell\\.exe$/ nocase
    $proc.target.process.command_line = /-enc|-encodedcommand|downloadstring|invoke-webrequest|frombase64string/ nocase
    $user = $proc.principal.user.email_addresses

  match:
    $user over 15m

  condition:
    $mail and $proc
}`,
        splunk: `(
  index=o365 earliest=-1h
  (ThreatTypes="Phish" OR ThreatTypes="Malware")
  DeliveryAction="Delivered"
)
| rename RecipientEmailAddress AS user
| fields _time user NetworkMessageId Subject
| join type=inner NetworkMessageId [
    search index=o365 sourcetype="o365:email:attachment" earliest=-1h
    | fields NetworkMessageId FileName SHA256
]
| join type=inner user [
    search index=endpoint earliest=-1h
      process_name="powershell.exe"
      (
        process_command_line="*-enc*"
        OR process_command_line="*-encodedcommand*"
        OR process_command_line="*downloadstring*"
        OR process_command_line="*invoke-webrequest*"
      )
    | rename _time AS process_time
    | fields user host process_time parent_process_name process_name process_command_line
]
| where process_time >= _time AND process_time <= _time + 900
| table _time process_time user host Subject FileName SHA256 parent_process_name process_command_line`,
        elastic: `sequence by user.email with maxspan=15m
  [any where
    event.category == "email" and
    email.delivery.action == "delivered" and
    email.threat.type in ("phish", "malware")
  ]
  [process where
    process.name : "powershell.exe" and
    process.command_line : (
      "*-enc*",
      "*-encodedcommand*",
      "*downloadstring*",
      "*invoke-webrequest*",
      "*frombase64string*"
    )
  ]`,
        wazuh: `<group name="phishing,powershell,correlation,">
  <!-- Decoder/field names are illustrative. -->

  <rule id="120100" level="8">
    <field name="email.delivery_action">Delivered</field>
    <field name="email.threat_type" type="pcre2">(?i)phish|malware</field>
    <description>Delivered phishing or malware email</description>
    <group>mail_threat_delivered,</group>
  </rule>

  <rule id="120110" level="10">
    <field name="win.eventdata.image" type="pcre2">(?i)\\\\powershell\\.exe$</field>
    <field name="win.eventdata.commandLine" type="pcre2">(?i)-enc|-encodedcommand|downloadstring|invoke-webrequest|frombase64string</field>
    <description>Suspicious PowerShell execution</description>
    <group>suspicious_powershell,</group>
  </rule>

  <!-- Cross-source user correlation normally requires
       enrichment/correlation outside a single local rule. -->
  <rule id="120120" level="12" frequency="1" timeframe="900">
    <if_group>mail_threat_delivered,suspicious_powershell</if_group>
    <description>Phishing delivery followed by suspicious PowerShell</description>
    <mitre>
      <id>T1566.001</id>
      <id>T1059.001</id>
    </mitre>
  </rule>
</group>`,
        sigma: `title: Suspicious PowerShell Following User-Facing File Delivery
id: 9872c52a-94bb-4df6-9f45-ae31af8c7011
status: experimental
description: >
  Portable endpoint component for a larger phishing correlation.
  Correlate with mail telemetry in the target SIEM.
author: Marc Lavoie
date: 2026-08-28
logsource:
  product: windows
  category: process_creation
detection:
  selection_image:
    Image|endswith: '\\powershell.exe'
  selection_cli:
    CommandLine|contains:
      - '-enc'
      - '-encodedcommand'
      - 'downloadstring'
      - 'invoke-webrequest'
      - 'frombase64string'
  selection_parent:
    ParentImage|endswith:
      - '\\winword.exe'
      - '\\excel.exe'
      - '\\powerpnt.exe'
      - '\\outlook.exe'
      - '\\7zFM.exe'
      - '\\winrar.exe'
  condition: selection_image and selection_cli and selection_parent
falsepositives:
  - Approved administrative automation
  - Software deployment tooling
level: high
tags:
  - attack.initial-access
  - attack.t1566.001
  - attack.execution
  - attack.t1059.001`
      }
    },

    beaconing: {
      title: "Periodic Outbound C2 Beaconing with Endpoint Corroboration",
      slug: "periodic-c2-beaconing",
      severity: "High",
      attack: "T1071.001 · T1105",
      window: "30 minutes",
      entities: "Host · Process · Remote IP",
      objective: "Correlate periodicity with process",
      logic:
        "Identifies repeated outbound connections with low timing variance, then attributes the network pattern to an endpoint process so the alert is not based on periodicity alone.",
      telemetry: [
        "Endpoint network connections",
        "Process identity / process lineage",
        "Remote IP and destination port",
        "Connection timestamps",
        "Optional DNS, proxy, firewall, or packet evidence"
      ],
      triage: [
        "Validate direction, disposition, session bytes, destination, and whether a real connection was established.",
        "Attribute the connection to a process and review signer, hash, parent process, command line, and file path.",
        "Compare callback cadence with known update agents, monitoring software, browsers, VPN clients, and enterprise management tools.",
        "Corroborate with DNS, firewall, proxy, IDS, packet capture, and peer-host activity before declaring C2."
      ],
      tuning:
        "Periodic traffic is common. Suppress only after confirming legitimate software identity, destination ownership, expected cadence, signer, asset role, and change history. Avoid using timing periodicity as the sole malicious criterion.",
      validation:
        "Replay controlled periodic connections from both an approved updater and a lab beacon simulator. The analytic should retain the suspicious process/destination combination while excluding the documented approved agent.",
      code: {
        sentinel: `DeviceNetworkEvents
| where Timestamp > ago(1h)
| where ActionType == "ConnectionSuccess"
| where RemotePort in (80, 443, 8080, 8443)
| where RemoteIPType == "Public"
| sort by DeviceId asc, InitiatingProcessId asc, RemoteIP asc, Timestamp asc
| serialize
| extend PrevTime = prev(Timestamp),
         PrevDevice = prev(DeviceId),
         PrevPid = prev(InitiatingProcessId),
         PrevRemote = prev(RemoteIP)
| extend IntervalSec =
    iff(
      DeviceId == PrevDevice
      and InitiatingProcessId == PrevPid
      and RemoteIP == PrevRemote,
      datetime_diff("second", Timestamp, PrevTime),
      long(null)
    )
| where isnotnull(IntervalSec) and IntervalSec between (20 .. 600)
| summarize
    Connections=count(),
    AvgInterval=avg(IntervalSec),
    StdDevInterval=stdev(IntervalSec),
    FirstSeen=min(Timestamp),
    LastSeen=max(Timestamp),
    any(InitiatingProcessFileName),
    any(InitiatingProcessCommandLine)
  by DeviceId, DeviceName, InitiatingProcessId, RemoteIP, RemotePort
| where Connections >= 6
| where StdDevInterval < 20
| project
    DeviceName,
    RemoteIP,
    RemotePort,
    Connections,
    AvgInterval,
    StdDevInterval,
    FirstSeen,
    LastSeen,
    Process=any_InitiatingProcessFileName,
    CommandLine=any_InitiatingProcessCommandLine
| order by StdDevInterval asc`,
        crowdstrike: `#event_simpleName=NetworkConnectIP4
| RemotePort_decimal=80 OR RemotePort_decimal=443 OR RemotePort_decimal=8080 OR RemotePort_decimal=8443
| groupBy(
    [aid, ContextProcessId_decimal, RemoteAddressIP4, RemotePort_decimal],
    function=[
      count(as=Connections),
      min(@timestamp, as=FirstSeen),
      max(@timestamp, as=LastSeen),
      collect([ComputerName, ContextBaseFileName], limit=5)
    ]
  )
| Connections >= 6
| span := LastSeen - FirstSeen
| avg_interval_ms := span / (Connections - 1)
| avg_interval_ms >= 20000 AND avg_interval_ms <= 600000
| join(
    query={
      #event_simpleName=ProcessRollup2
      | select([aid, TargetProcessId_decimal, ImageFileName, CommandLine, SHA256HashData])
    },
    field=[aid, ContextProcessId_decimal],
    key=[aid, TargetProcessId_decimal],
    include=[ImageFileName, CommandLine, SHA256HashData]
  )
| select([
    ComputerName,
    RemoteAddressIP4,
    RemotePort_decimal,
    Connections,
    avg_interval_ms,
    ImageFileName,
    CommandLine,
    SHA256HashData
  ])`,
        qradar: `SELECT
  sourceip,
  destinationip,
  destinationport,
  username,
  "Process Name",
  COUNT(*) AS connections,
  MIN(starttime) AS first_seen,
  MAX(starttime) AS last_seen
FROM events
WHERE
  destinationport IN (80,443,8080,8443)
  AND "Direction" = 'Outbound'
  AND "Action" IN ('Allowed','Success')
GROUP BY
  sourceip,
  destinationip,
  destinationport,
  username,
  "Process Name"
HAVING COUNT(*) >= 6
LAST 30 MINUTES

-- CRE enhancement:
-- Add a reference-set exclusion for approved update endpoints.
-- Require endpoint process identity or EDR corroboration before
-- promoting periodic traffic to a high-confidence offense.`,
        chronicle: `rule periodic_outbound_connection_with_process {
  meta:
    author = "Marc Lavoie"
    severity = "HIGH"
    mitre_attack = "T1071.001,T1105"

  events:
    $net.metadata.event_type = "NETWORK_CONNECTION"
    $net.network.direction = "OUTBOUND"
    $net.security_result.action = "ALLOW"
    $net.target.port in [80, 443, 8080, 8443]
    $host = $net.principal.hostname
    $proc = $net.principal.process.file.full_path
    $dst = $net.target.ip

  match:
    $host, $proc, $dst over 30m

  outcome:
    $connection_count = count($net.metadata.id)
    $first_seen = min($net.metadata.event_timestamp.seconds)
    $last_seen = max($net.metadata.event_timestamp.seconds)

  condition:
    #net >= 6
}`,
        splunk: `index=endpoint earliest=-30m
  event_type="network_connection"
  direction="outbound"
  action IN ("allowed","success")
  dest_port IN (80,443,8080,8443)
| sort 0 host process_id dest_ip dest_port _time
| streamstats current=f last(_time) AS previous_time
    BY host process_id dest_ip dest_port
| eval interval_sec=_time-previous_time
| where interval_sec>=20 AND interval_sec<=600
| stats
    count AS connections
    avg(interval_sec) AS avg_interval
    stdev(interval_sec) AS interval_stdev
    values(process_name) AS process_name
    values(process_command_line) AS process_command_line
    min(_time) AS first_seen
    max(_time) AS last_seen
  BY host process_id dest_ip dest_port
| where connections>=6 AND interval_stdev<20
| convert ctime(first_seen) ctime(last_seen)
| sort interval_stdev`,
        elastic: `sequence by host.id, process.entity_id, destination.ip
  with maxspan=30m
  [network where
    network.direction == "egress" and
    event.outcome == "success" and
    destination.port in (80, 443, 8080, 8443)
  ]
  [network where
    network.direction == "egress" and
    event.outcome == "success"
  ]
  [network where
    network.direction == "egress" and
    event.outcome == "success"
  ]
  [network where
    network.direction == "egress" and
    event.outcome == "success"
  ]
  [network where
    network.direction == "egress" and
    event.outcome == "success"
  ]
  [network where
    network.direction == "egress" and
    event.outcome == "success"
  ]

/*
Use an Elastic threshold/new-terms rule or transform to calculate
interval variance and approved-destination exclusions. EQL provides
the process-scoped repeated-connection sequence.
*/`,
        wazuh: `<group name="network,beaconing,correlation,">
  <rule id="120200" level="5">
    <field name="network.direction">outbound</field>
    <field name="event.action" type="pcre2">(?i)allow|success</field>
    <field name="destination.port" type="pcre2">^(80|443|8080|8443)$</field>
    <description>Outbound web connection observed</description>
    <group>outbound_web_connection,</group>
  </rule>

  <rule id="120210" level="10" frequency="6" timeframe="1800">
    <if_matched_group>outbound_web_connection</if_matched_group>
    <same_field>agent.id</same_field>
    <same_field>process.id</same_field>
    <same_field>destination.ip</same_field>
    <description>Repeated outbound connections from the same process to the same destination</description>
    <mitre>
      <id>T1071.001</id>
    </mitre>
  </rule>
</group>

<!--
Wazuh frequency/timeframe detects repetition, not true periodicity.
Use SIEM-side interval analysis or a custom integration to calculate
timing variance before classifying the pattern as beaconing.
-->`,
        sigma: `title: Repeated Outbound Connections from a Single Process
id: 84cfa676-42d8-43ad-926f-85853ec33e41
status: experimental
description: >
  Portable network/process component for a beaconing analytic.
  The backend must provide threshold/correlation support.
author: Marc Lavoie
date: 2026-08-28
logsource:
  category: network_connection
  product: windows
detection:
  selection:
    Initiated: 'true'
    DestinationPort:
      - 80
      - 443
      - 8080
      - 8443
  filter_known_tools:
    Image|endswith:
      - '\\OneDrive.exe'
      - '\\Teams.exe'
  condition: selection and not filter_known_tools
falsepositives:
  - Software updaters
  - Monitoring agents
  - Collaboration clients
level: medium
tags:
  - attack.command-and-control
  - attack.t1071.001

# Correlation layer:
# Group by Computer + ProcessId + DestinationIp for 30 minutes.
# Require >= 6 connections and low inter-arrival-time variance.
# Promote severity only when endpoint/process evidence is suspicious.`
      }
    },

    credential: {
      title: "Credential Dumping / Suspicious LSASS Access",
      slug: "credential-dumping-lsass",
      severity: "Critical",
      attack: "T1003.001",
      window: "10 minutes",
      entities: "Host · Process · User",
      objective: "Detect abnormal LSASS interaction",
      logic:
        "Detects command lines, process behavior, or protected-process access patterns associated with attempts to dump credentials from LSASS while preserving context for authorized diagnostic tooling.",
      telemetry: [
        "Process creation telemetry",
        "Process access / handle telemetry where available",
        "Command line and parent process",
        "File signer / hash / path",
        "Privileged user and host context"
      ],
      triage: [
        "Identify the process accessing or targeting LSASS and verify signer, hash, path, parent, user, and integrity level.",
        "Determine whether the activity matches approved EDR, debugging, backup, crash-dump, or security tooling.",
        "Review adjacent process, file, registry, service, authentication, and lateral-movement events.",
        "If unauthorized, isolate scope, preserve volatile evidence where required, reset exposed credentials, and hunt for reuse."
      ],
      tuning:
        "Legitimate EDR, AV, crash-dump, debugging, and administrative tooling can interact with LSASS. Tune with exact signer, image path, hash, approved tool identity, maintenance window, and device role rather than globally suppressing LSASS access.",
      validation:
        "Use a benign signed diagnostic baseline and an authorized lab simulation that attempts an LSASS dump. Confirm that trusted tooling is excluded narrowly while suspicious command-line or access behavior remains visible.",
      code: {
        sentinel: `let SuspiciousDumpCommands =
DeviceProcessEvents
| where Timestamp > ago(1h)
| where
    (
      FileName in~ ("procdump.exe", "procdump64.exe")
      and ProcessCommandLine has "lsass"
    )
    or
    (
      FileName =~ "rundll32.exe"
      and ProcessCommandLine has_all ("comsvcs.dll", "MiniDump")
    )
    or
    (
      ProcessCommandLine has_any ("sekurlsa::logonpasswords", "lsass.dmp")
    )
| project
    Timestamp,
    DeviceId,
    DeviceName,
    AccountName,
    FileName,
    ProcessCommandLine,
    InitiatingProcessFileName,
    SHA256;

SuspiciousDumpCommands
| join kind=leftouter (
    DeviceEvents
    | where Timestamp > ago(1h)
    | where ActionType has_any ("OpenProcessApiCall", "LsassCredentialDumping")
    | project
        DeviceId,
        DeviceEventTime=Timestamp,
        ActionType,
        AdditionalFields
) on DeviceId
| where isnull(DeviceEventTime)
    or DeviceEventTime between (Timestamp - 5m .. Timestamp + 5m)
| project
    Timestamp,
    DeviceName,
    AccountName,
    FileName,
    ProcessCommandLine,
    InitiatingProcessFileName,
    SHA256,
    ActionType,
    AdditionalFields
| order by Timestamp desc`,
        crowdstrike: `(
  #event_simpleName=ProcessRollup2
  (
    (FileName=/procdump(64)?\\.exe/i CommandLine=/lsass/i)
    OR
    (FileName=/rundll32\\.exe/i CommandLine=/comsvcs\\.dll/i CommandLine=/MiniDump/i)
    OR
    CommandLine=/sekurlsa::logonpasswords|lsass\\.dmp/i
  )
)
| join(
    query={
      #event_simpleName=/ProcessAccess|LsassHandleFromUnsignedModule|CredDump/i
      | select([aid, TargetProcessId_decimal, SourceProcessId_decimal, CallStackModuleNames])
    },
    field=aid,
    key=aid,
    include=[TargetProcessId_decimal, SourceProcessId_decimal, CallStackModuleNames]
  )
| select([
    @timestamp,
    aid,
    ComputerName,
    UserName,
    ImageFileName,
    ParentBaseFileName,
    CommandLine,
    SHA256HashData,
    CallStackModuleNames
  ])`,
        qradar: `SELECT
  sourceip,
  username,
  "Process Name",
  "Parent Process",
  "Command Line",
  "File Hash",
  QIDNAME(qid) AS event_name
FROM events
WHERE
  (
    LOWER("Process Name") LIKE '%procdump%'
    AND LOWER("Command Line") LIKE '%lsass%'
  )
  OR
  (
    LOWER("Process Name") LIKE '%rundll32.exe%'
    AND LOWER("Command Line") LIKE '%comsvcs.dll%'
    AND LOWER("Command Line") LIKE '%minidump%'
  )
  OR
  LOWER("Command Line") LIKE '%sekurlsa::logonpasswords%'
  OR LOWER(QIDNAME(qid)) LIKE '%credential dump%'
LAST 1 HOURS

-- CRE:
-- Increase magnitude when the process is unsigned/untrusted,
-- the user is privileged, or the host is a domain controller.
-- Add a narrow building-block exclusion for approved security tools.`,
        chronicle: `rule suspicious_lsass_credential_dumping {
  meta:
    author = "Marc Lavoie"
    severity = "CRITICAL"
    mitre_attack = "T1003.001"

  events:
    $p.metadata.event_type = "PROCESS_LAUNCH"

    (
      re.regex($p.target.process.file.full_path, \`(?i)procdump(64)?\\.exe$\`)
      and re.regex($p.target.process.command_line, \`(?i)lsass\`)
    )
    or
    (
      re.regex($p.target.process.file.full_path, \`(?i)rundll32\\.exe$\`)
      and re.regex($p.target.process.command_line, \`(?i)comsvcs\\.dll.*MiniDump\`)
    )
    or
    re.regex($p.target.process.command_line, \`(?i)sekurlsa::logonpasswords|lsass\\.dmp\`)

  condition:
    $p
}`,
        splunk: `index=endpoint earliest=-1h
(
  (
    process_name IN ("procdump.exe","procdump64.exe")
    process_command_line="*lsass*"
  )
  OR
  (
    process_name="rundll32.exe"
    process_command_line="*comsvcs.dll*"
    process_command_line="*MiniDump*"
  )
  OR process_command_line="*sekurlsa::logonpasswords*"
  OR process_command_line="*lsass.dmp*"
)
| eval privileged_host=if(match(host,"(?i)dc|domain-controller"),1,0)
| stats
    earliest(_time) AS first_seen
    latest(_time) AS last_seen
    values(user) AS user
    values(parent_process_name) AS parent
    values(process_name) AS process
    values(process_command_line) AS command_line
    values(file_hash) AS hash
    max(privileged_host) AS privileged_host
  BY host process_id
| convert ctime(first_seen) ctime(last_seen)
| sort - privileged_host`,
        elastic: `process where
  (
    process.name in ("procdump.exe", "procdump64.exe") and
    process.command_line : "*lsass*"
  )
  or
  (
    process.name == "rundll32.exe" and
    process.command_line : "*comsvcs.dll*" and
    process.command_line : "*MiniDump*"
  )
  or
  process.command_line : (
    "*sekurlsa::logonpasswords*",
    "*lsass.dmp*"
  )`,
        wazuh: `<group name="windows,credential_access,lsass,">
  <rule id="120300" level="13">
    <field name="win.eventdata.image" type="pcre2">(?i)\\\\procdump(64)?\\.exe$</field>
    <field name="win.eventdata.commandLine" type="pcre2">(?i)lsass</field>
    <description>ProcDump targeting LSASS</description>
    <mitre>
      <id>T1003.001</id>
    </mitre>
  </rule>

  <rule id="120310" level="14">
    <field name="win.eventdata.image" type="pcre2">(?i)\\\\rundll32\\.exe$</field>
    <field name="win.eventdata.commandLine" type="pcre2">(?i)comsvcs\\.dll.*MiniDump</field>
    <description>Rundll32/comsvcs MiniDump targeting LSASS</description>
    <mitre>
      <id>T1003.001</id>
    </mitre>
  </rule>

  <rule id="120320" level="15">
    <field name="win.eventdata.commandLine" type="pcre2">(?i)sekurlsa::logonpasswords|lsass\\.dmp</field>
    <description>Credential-dumping command line detected</description>
    <mitre>
      <id>T1003.001</id>
    </mitre>
  </rule>
</group>`,
        sigma: `title: Suspicious LSASS Credential Dumping Command
id: 70e8a3d3-6dd5-4d80-8d61-7db2c5a31fd0
status: experimental
author: Marc Lavoie
date: 2026-08-28
logsource:
  product: windows
  category: process_creation
detection:
  procdump:
    Image|endswith:
      - '\\procdump.exe'
      - '\\procdump64.exe'
    CommandLine|contains: 'lsass'
  comsvcs:
    Image|endswith: '\\rundll32.exe'
    CommandLine|contains|all:
      - 'comsvcs.dll'
      - 'MiniDump'
  credential_terms:
    CommandLine|contains:
      - 'sekurlsa::logonpasswords'
      - 'lsass.dmp'
  condition: 1 of procdump, comsvcs, credential_terms
falsepositives:
  - Approved crash-dump or debugging activity
  - Authorized security tooling
level: critical
tags:
  - attack.credential-access
  - attack.t1003.001`
      }
    }
  };

  const tabs = [...lab.querySelectorAll("[data-platform]")];
  const scenarioSelect = lab.querySelector("[data-detection-scenario]");
  const panel = lab.querySelector("[data-detection-panel]");

  const ui = {
    platformName: lab.querySelector("[data-platform-name]"),
    ruleTitle: lab.querySelector("[data-rule-title]"),
    severity: lab.querySelector("[data-severity]"),
    language: lab.querySelector("[data-language]"),
    attack: lab.querySelector("[data-attack]"),
    window: lab.querySelector("[data-window]"),
    entities: lab.querySelector("[data-entities]"),
    objective: lab.querySelector("[data-objective]"),
    filename: lab.querySelector("[data-filename]"),
    code: lab.querySelector("[data-rule-code]"),
    schemaNote: lab.querySelector("[data-schema-note]"),
    logic: lab.querySelector("[data-logic]"),
    telemetry: lab.querySelector("[data-telemetry]"),
    triage: lab.querySelector("[data-triage]"),
    tuning: lab.querySelector("[data-tuning]"),
    validation: lab.querySelector("[data-validation]"),
    copyButton: lab.querySelector("[data-copy-rule]"),
    downloadButton: lab.querySelector("[data-download-rule]"),
    visualLink: lab.querySelector("[data-visual-rule]"),
    announcer: lab.querySelector("[data-detection-announcer]"),
    copyStatus: lab.querySelector("[data-copy-status]"),
    prev: lab.querySelector("[data-prev-platform]"),
    next: lab.querySelector("[data-next-platform]")
  };

  let currentPlatform = "sentinel";
  let currentScenario = scenarioSelect.value || "phishing";

  function listInto(element, values) {
    element.replaceChildren(
      ...values.map((value) => {
        const li = document.createElement("li");
        li.textContent = value;
        return li;
      })
    );
  }

  function render(announce = false) {
    const detection = detections[currentScenario];
    const meta = platformMeta[currentPlatform];
    const activeTab = tabs.find(
      (tab) => tab.dataset.platform === currentPlatform
    );

    ui.platformName.textContent = meta.name;
    ui.ruleTitle.textContent = detection.title;
    ui.severity.textContent = detection.severity;
    ui.severity.dataset.level = detection.severity.toLowerCase();
    ui.language.textContent = meta.language;
    ui.attack.textContent = detection.attack;
    ui.window.textContent = detection.window;
    ui.entities.textContent = detection.entities;
    ui.objective.textContent = detection.objective;
    ui.filename.textContent =
      `${currentPlatform}-${detection.slug}.${meta.ext}`;
    ui.code.textContent = detection.code[currentPlatform];
    ui.schemaNote.textContent = meta.schema;
    ui.logic.textContent = detection.logic;
    ui.tuning.textContent = detection.tuning;
    ui.validation.textContent = detection.validation;

    if (meta.visual) {
      ui.visualLink.href = meta.visual;
      ui.visualLink.hidden = false;
      ui.visualLink.setAttribute(
        "aria-label",
        `View the full ${meta.name} visual rule example`
      );
    } else {
      ui.visualLink.hidden = true;
      ui.visualLink.removeAttribute("href");
      ui.visualLink.removeAttribute("aria-label");
    }

    listInto(ui.telemetry, detection.telemetry);
    listInto(ui.triage, detection.triage);

    tabs.forEach((tab) => {
      const active = tab.dataset.platform === currentPlatform;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });

    if (activeTab) {
      panel.setAttribute("aria-labelledby", activeTab.id);
    }

    ui.copyStatus.textContent = "";

    if (announce) {
      ui.announcer.textContent = `${meta.name}: ${detection.title}. ${meta.language} rule loaded.`;
    }
  }

  function changePlatform(platform, focusTab = false) {
    if (!platforms.includes(platform)) return;
    currentPlatform = platform;
    render(true);

    if (focusTab) {
      const activeTab = tabs.find(
        (tab) => tab.dataset.platform === currentPlatform
      );
      activeTab?.focus();
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      changePlatform(tab.dataset.platform);
    });

    tab.addEventListener("keydown", (event) => {
      const currentIndex = platforms.indexOf(currentPlatform);
      let nextIndex = null;

      if (event.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % platforms.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex =
          (currentIndex - 1 + platforms.length) % platforms.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = platforms.length - 1;
      }

      if (nextIndex !== null) {
        event.preventDefault();
        changePlatform(platforms[nextIndex], true);
      }
    });
  });

  scenarioSelect.addEventListener("change", () => {
    currentScenario = scenarioSelect.value;
    render(true);
  });

  ui.prev.addEventListener("click", () => {
    const index = platforms.indexOf(currentPlatform);
    changePlatform(
      platforms[(index - 1 + platforms.length) % platforms.length]
    );
  });

  ui.next.addEventListener("click", () => {
    const index = platforms.indexOf(currentPlatform);
    changePlatform(
      platforms[(index + 1) % platforms.length]
    );
  });

  ui.copyButton.addEventListener("click", async () => {
    const text = ui.code.textContent;

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API unavailable");
      }
      await navigator.clipboard.writeText(text);
      ui.copyStatus.textContent = "Copied";
      ui.copyButton.textContent = "Copied";
    } catch {
      const range = document.createRange();
      range.selectNodeContents(ui.code);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      ui.copyStatus.textContent = "Rule selected — press Ctrl/Cmd+C";
    }

    window.setTimeout(() => {
      ui.copyButton.textContent = "Copy Rule";
      ui.copyStatus.textContent = "";
    }, 1800);
  });

  ui.downloadButton.addEventListener("click", () => {
    const filename = ui.filename.textContent;
    const blob = new Blob([ui.code.textContent], {
      type: "text/plain;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    ui.copyStatus.textContent = `Downloaded ${filename}`;
    ui.announcer.textContent = `Downloaded ${filename}`;
    window.setTimeout(() => {
      ui.copyStatus.textContent = "";
    }, 2200);
  });

  render();
})();

/* Accessible Cybrary and INE certificate tabs */
(() => {
  "use strict";

  const root = document.querySelector("[data-certificate-tabs]");
  if (!root) return;

  const tabs = Array.from(root.querySelectorAll("[data-certificate-tab]"));
  const panels = Array.from(root.querySelectorAll("[data-certificate-panel]"));
  const platformForHash = {
    "#cybrary-certificates": "cybrary",
    "#ine-certificates": "ine"
  };

  if (tabs.length !== 2 || panels.length !== 2) return;

  function activate(platform, focusTab) {
    const activeTab = tabs.find((tab) => tab.dataset.certificateTab === platform);
    const activePanel = panels.find((panel) => panel.dataset.certificatePanel === platform);

    if (!activeTab || !activePanel) return;

    tabs.forEach((tab) => {
      const isActive = tab === activeTab;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });

    panels.forEach((panel) => {
      panel.hidden = panel !== activePanel;
    });

    if (focusTab) activeTab.focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activate(tab.dataset.certificateTab, false));
    tab.addEventListener("keydown", (event) => {
      let nextIndex = null;

      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;

      if (nextIndex === null) return;
      event.preventDefault();
      activate(tabs[nextIndex].dataset.certificateTab, true);
    });
  });

  function activateLegacyHash() {
    const platform = platformForHash[window.location.hash];
    if (!platform) return;

    activate(platform, false);
    window.requestAnimationFrame(() => {
      document.querySelector("#certificates")?.scrollIntoView({ block: "start" });
    });
  }

  window.addEventListener("hashchange", activateLegacyHash);
  if (platformForHash[window.location.hash]) {
    activateLegacyHash();
  } else {
    activate("cybrary", false);
  }
})();
