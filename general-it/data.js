/* General IT knowledge base. Original, vendor-neutral educational content. */
(function initializeGeneralItData(root) {
  "use strict";

  const categories = [
    {
      id: "windows",
      name: "Windows workstations",
      asset: "Windows workstation",
      scope: "startup, sign-in, drivers, services, profiles, updates, and local applications",
      tools: ["Get Help diagnostics", "Task Manager", "Event Viewer", "Device Manager"],
      causes: ["a pending restart or update", "a damaged profile or system component", "a driver or service conflict"],
      diagnostics: "Check uptime, recent updates, available storage, Device Manager, relevant Event Viewer entries, and whether the issue follows the user or the device.",
      safeAction: "Use the least disruptive supported repair first: restart the affected process or device, run the matching built-in troubleshooter, apply an approved update, or test with a known-good profile. Preserve user data before recovery work.",
      verify: "Reproduce the original task after a clean sign-in and confirm the error does not return after restart.",
      escalate: "Escalate repeated stop errors, boot failure, suspected disk damage, BitLocker recovery uncertainty, or any repair that could remove data.",
      interviewScenario: "a Windows user cannot complete a normal business task after signing in",
      communicate: "I would explain what is affected, what remains available, the next low-risk check, and when I will provide the next update."
    },
    {
      id: "macos",
      name: "macOS workstations",
      asset: "Mac workstation",
      scope: "startup, accounts, permissions, updates, storage, peripherals, and managed settings",
      tools: ["System Settings", "Activity Monitor", "Console", "Disk Utility or Apple Diagnostics when authorized"],
      causes: ["an incomplete update or restart", "low storage or a damaged preference", "a peripheral, login item, or managed-profile conflict"],
      diagnostics: "Confirm the Mac model and macOS version, inspect free storage and Activity Monitor, review recent changes, disconnect nonessential peripherals, and compare the result in another approved user context.",
      safeAction: "Quit and relaunch the affected app, restart the Mac, verify date and time, apply approved updates, and use vendor-supported diagnostics. Back up important data before Recovery, disk repair, reinstall, or erase operations.",
      verify: "Repeat the user workflow, restart once, and confirm managed settings and required applications remain intact.",
      escalate: "Escalate startup failure, repeated kernel panic, liquid or battery damage, FileVault recovery uncertainty, or any Recovery operation outside the technician's authorization.",
      interviewScenario: "a managed Mac behaves differently from other Macs after a change",
      communicate: "I would distinguish an application issue from an operating-system, hardware, account, or management-profile issue and give the user a clear checkpoint."
    },
    {
      id: "identity",
      name: "Identity and account access",
      asset: "user account",
      scope: "directory identity, account state, group membership, role assignment, licensing, and lifecycle",
      tools: ["identity portal", "directory audit log", "sign-in log", "approved identity verification procedure"],
      causes: ["a disabled, locked, expired, or unlicensed account", "incorrect group or role membership", "stale replication, token, or lifecycle data"],
      diagnostics: "Verify the person's identity through the approved process, confirm the exact account and resource, check account state, entitlement, group and role changes, sign-in evidence, and whether access works for comparable users.",
      safeAction: "Correct only the minimum approved entitlement, unlock or restore the account through the documented workflow, revoke stale sessions when required, and never borrow another user's account to test.",
      verify: "Have the user sign in through the normal path and confirm both successful access and the absence of unintended privileges.",
      escalate: "Escalate privileged accounts, suspected takeover, unexplained role changes, failed identity verification, separation-of-duties conflicts, or access outside the approved request.",
      interviewScenario: "a verified employee cannot access a resource they are expected to use",
      communicate: "I would protect the user's identity, explain that access is being checked against the approved entitlement, and avoid promising a permission that has not been authorized."
    },
    {
      id: "mfa-sso",
      name: "Passwords, MFA, and SSO",
      asset: "authentication flow",
      scope: "passwords, multifactor authentication, passkeys, federation, conditional access, and tokens",
      tools: ["sign-in logs", "MFA registration view", "SSO status", "approved recovery workflow"],
      causes: ["an expired password or token", "incorrect time, device, or MFA registration", "a conditional-access, federation, or risk-policy decision"],
      diagnostics: "Identify the failing step, capture the timestamp and correlation details, verify the account and device, inspect the sign-in result and policy, and compare browser, network, and known-good application behavior.",
      safeAction: "Use approved password or MFA recovery, correct device time, refresh the legitimate session, and remediate the stated policy requirement. Never disable MFA, conditional access, certificate validation, or risk controls just to make the sign-in succeed.",
      verify: "Complete a fresh sign-in, confirm the expected MFA method and policy result, and verify that old or suspicious sessions are handled according to procedure.",
      escalate: "Escalate impossible-travel or risky sign-ins, MFA fatigue, unrecognized registration, federation outage, privileged access, or repeated failure without a clear policy result.",
      interviewScenario: "a user passes a password check but cannot complete MFA or SSO",
      communicate: "I would explain which authentication stage failed without exposing security logic and give the user an approved recovery path."
    },
    {
      id: "ethernet",
      name: "Wired networking",
      asset: "wired network connection",
      scope: "cabling, switch ports, VLANs, link negotiation, addressing, routing, and local firewalls",
      tools: ["link indicators", "interface status", "IP configuration", "switch-port and network monitoring data"],
      causes: ["a cable, dock, adapter, or switch-port fault", "an incorrect VLAN, speed, or addressing configuration", "a route, firewall, or upstream outage"],
      diagnostics: "Check physical link, cable and dock, interface state, address, gateway, DNS, route, scope, and a known-good device on the same approved port. Separate local link, local network, and upstream service failure.",
      safeAction: "Reseat or replace a known-bad approved cable, renew addressing through the supported process, restore the documented interface or VLAN configuration, and avoid moving a device to an unauthorized network.",
      verify: "Confirm stable link, expected IP settings, gateway reachability, name resolution, required application access, and no packet loss during an appropriate observation window.",
      escalate: "Escalate switch loops, widespread packet loss, unauthorized devices, port-security events, suspected cable-plant damage, or routing and firewall changes outside help-desk authority.",
      interviewScenario: "a desktop connected by cable reports no network access",
      communicate: "I would tell the user whether the issue is at the device, local network, or upstream service and provide an honest restoration estimate when available."
    },
    {
      id: "wifi",
      name: "Wi-Fi",
      asset: "Wi-Fi connection",
      scope: "radio state, SSIDs, authentication, signal, roaming, interference, captive portals, and drivers",
      tools: ["wireless status", "signal and channel data", "network diagnostics", "approved controller or access-point view"],
      causes: ["weak signal, interference, or roaming behavior", "a stale profile, driver, or certificate", "an authentication, DHCP, DNS, or access-point problem"],
      diagnostics: "Confirm airplane and radio state, correct SSID, signal, location, authentication result, IP configuration, driver, and whether other devices fail at the same place and time.",
      safeAction: "Reconnect to the approved SSID, remove and re-create only the known network profile when authorized, update an approved driver, or move to a known-good coverage area. Do not bypass enterprise authentication with an unapproved hotspot.",
      verify: "Confirm stable association, expected address and DNS, required application access, roaming if relevant, and acceptable loss and latency over time.",
      escalate: "Escalate multiple-user or location-wide failures, certificate or RADIUS errors, suspected rogue access points, controller alarms, or persistent interference requiring wireless engineering.",
      interviewScenario: "a user can see Wi-Fi but cannot maintain a reliable connection",
      communicate: "I would explain whether the signal, authentication, addressing, or upstream service is the current failure point."
    },
    {
      id: "dns-dhcp",
      name: "DNS, DHCP, and IP addressing",
      asset: "name and address configuration",
      scope: "leases, scopes, reservations, gateways, routes, DNS records, resolvers, and caches",
      tools: ["IP configuration", "lease or scope view", "DNS query tools", "approved server logs"],
      causes: ["an exhausted or incorrect address scope", "a stale, missing, or wrong DNS record", "an incorrect gateway, resolver, reservation, or local cache"],
      diagnostics: "Capture the address, prefix, gateway, resolver, lease time, query result, record type, authoritative answer, and whether access by IP differs from access by name.",
      safeAction: "Renew the lease or clear only the appropriate local cache, correct an approved record or reservation through change control, and avoid hard-coded addresses or public resolvers that bypass organizational policy.",
      verify: "Confirm the expected lease and resolver, test forward and reverse lookup where relevant, and verify the application reaches the intended host rather than a cached or alternate destination.",
      escalate: "Escalate scope exhaustion, duplicate addressing, authoritative DNS errors, widespread resolution failure, suspicious DNS changes, or server modifications outside the runbook.",
      interviewScenario: "a device has network link but names or addresses are not working correctly",
      communicate: "I would translate the difference between connection, addressing, name resolution, and application availability into plain language."
    },
    {
      id: "vpn-remote",
      name: "VPN and remote access",
      asset: "remote-access connection",
      scope: "VPN clients, remote desktop, gateways, certificates, split tunneling, policy, and home-network dependencies",
      tools: ["client status and logs", "gateway status", "sign-in evidence", "route and DNS configuration"],
      causes: ["an expired certificate, token, or client version", "a home-network, route, DNS, or captive-portal conflict", "a gateway, policy, or remote-host availability problem"],
      diagnostics: "Confirm ordinary internet access first, capture the client stage and error, verify date and time, account, MFA, certificate, client version, assigned routes and DNS, gateway status, and whether the destination is online.",
      safeAction: "Use the approved client and profile, reconnect after clearing a stale legitimate session, complete required updates, and correct only documented route or DNS settings. Never disable endpoint protection or firewall controls to force access.",
      verify: "Confirm a fresh protected session, expected assigned network settings, access only to authorized resources, and stable reconnection after a normal disconnect.",
      escalate: "Escalate widespread gateway failure, certificate-chain issues, privileged remote access, suspected compromise, policy denial, or exposure of a remote service to the public internet.",
      interviewScenario: "a remote employee has internet access but cannot reach an internal service",
      communicate: "I would separate the user's home connection, VPN authentication, tunnel, internal DNS and route, and destination service so the user knows what is being tested."
    },
    {
      id: "email",
      name: "Email and Outlook",
      asset: "email service",
      scope: "mail clients, profiles, delivery, folders, quotas, rules, search, calendars, and message security",
      tools: ["service health", "message trace", "client connection status", "mailbox and rule audit data"],
      causes: ["a client profile, cache, add-in, or connectivity problem", "a quota, rule, permission, or folder issue", "delivery filtering, service health, or sender-side failure"],
      diagnostics: "Determine whether the issue affects send, receive, search, calendar, one message, one client, or the web client; capture timestamps, addresses, subject or message ID safely, service health, quota, rules, and trace evidence.",
      safeAction: "Test the supported web client, restart or repair the approved profile, disable only a confirmed problematic add-in, correct an authorized rule or permission, and never release suspicious content without security review.",
      verify: "Send and receive a controlled test, confirm delivery or trace status, verify calendar and folder behavior, and ensure no legitimate rules or shared-mailbox access were lost.",
      escalate: "Escalate suspected phishing or account takeover, unexplained forwarding rules, sensitive-message exposure, service-wide delay, legal hold, or trace results requiring mail administration.",
      interviewScenario: "a user says an expected email is missing or the mail client is not updating",
      communicate: "I would avoid promising that a message was delivered until trace or mailbox evidence supports it and would give the user a safe interim path."
    },
    {
      id: "m365",
      name: "Microsoft 365, Teams, and OneDrive",
      asset: "Microsoft 365 collaboration workflow",
      scope: "licensing, Teams, OneDrive, SharePoint, Office activation, meetings, presence, sync, and sharing",
      tools: ["service health", "license and account view", "sync status", "client and sign-in logs"],
      causes: ["a licensing, account, or conditional-access issue", "a client cache, sync conflict, or stale token", "a service-health, permission, or sharing-policy problem"],
      diagnostics: "Identify the exact workload, account, tenant, client, file or meeting, error and timestamp; compare web and desktop behavior, service health, license, sign-in, sync state, permissions, and path or file constraints.",
      safeAction: "Refresh the approved session, restart the affected client, resolve a documented sync conflict without overwriting the only copy, correct authorized sharing or licensing, and preserve version history.",
      verify: "Repeat the workflow in the intended client, confirm sync or meeting state across two views, and verify permissions with the actual owner or approved test account.",
      escalate: "Escalate tenant-wide health issues, data loss or oversharing, retention concerns, unexplained external access, persistent activation failure, or policy changes outside support authority.",
      interviewScenario: "Teams, OneDrive, or Office works in one place but not another",
      communicate: "I would name the affected workload and client, protect file versions, and explain whether the problem is local, account-based, policy-based, or service-wide."
    },
    {
      id: "browser",
      name: "Browsers and web applications",
      asset: "browser or web application",
      scope: "profiles, cache, cookies, extensions, certificates, proxies, rendering, sessions, and site compatibility",
      tools: ["browser diagnostics", "developer console when appropriate", "certificate details", "service status"],
      causes: ["a stale session, cache, cookie, or profile", "an extension, proxy, certificate, or compatibility conflict", "a site-side outage, authorization problem, or blocked request"],
      diagnostics: "Capture the URL domain without exposing secrets, exact error and time, browser and version, profile, extension and proxy state, certificate warning, and whether the issue reproduces in another supported browser or clean approved profile.",
      safeAction: "Refresh the legitimate session, clear only site-specific data when possible, disable a confirmed problematic extension, update the supported browser, and never bypass certificate or browser security warnings.",
      verify: "Complete the original transaction, confirm the correct secure domain and certificate, restart the browser, and make sure required extensions and accessibility settings still work.",
      escalate: "Escalate certificate warnings, suspected malicious redirects, data exposure, authentication loops across supported browsers, or site-side errors affecting multiple users.",
      interviewScenario: "a web application fails in one browser or profile",
      communicate: "I would tell the user what local browser state is safe to change and what information, sessions, or security controls will be preserved."
    },
    {
      id: "printing",
      name: "Printers and scanners",
      asset: "printer or scanner",
      scope: "power, network, queues, spoolers, drivers, paper, consumables, scan destinations, and permissions",
      tools: ["device panel", "print queue", "printer settings", "approved print-server or device status"],
      causes: ["an offline device, jam, consumable, or hardware condition", "a stuck queue, spooler, port, or driver", "a network, permission, format, or scan-destination problem"],
      diagnostics: "Check device power and panel status, paper and consumables, network or USB connection, queue and selected device, one controlled test page, driver and port, and whether other users or functions are affected.",
      safeAction: "Clear only the affected user's safe test jobs, restart the approved queue or device, reseat paper or connection, install the supported driver, and protect confidential output from unattended trays.",
      verify: "Print or scan a controlled non-sensitive test, confirm output quality and destination, and verify the queue returns to ready for another user.",
      escalate: "Escalate mechanical damage, repeated jams, firmware, secure-print failure, confidential exposure, print-server outage, or repairs requiring a vendor.",
      interviewScenario: "a printer appears online but jobs do not complete",
      communicate: "I would give the user a safe alternate printer when allowed and explain whether the blockage is the document, queue, server, connection, or hardware."
    },
    {
      id: "hardware",
      name: "Hardware and peripherals",
      asset: "computer hardware or peripheral",
      scope: "power, displays, docks, keyboards, mice, cameras, audio, Bluetooth, USB, batteries, and thermals",
      tools: ["power and connection checks", "device inventory", "hardware diagnostics", "driver and firmware status"],
      causes: ["a loose, damaged, incompatible, or underpowered connection", "a driver, firmware, pairing, or selected-device problem", "battery, thermal, display, storage, memory, or component failure"],
      diagnostics: "Record the model and asset, physical condition, power, cables and ports, selected device, battery and temperature symptoms, driver state, and a known-good swap that does not risk data or warranty.",
      safeAction: "Reseat approved connections, power-cycle correctly, select the intended device, pair again through the supported process, update approved drivers or firmware, and stop if there is heat, swelling, smoke, liquid, or electrical damage.",
      verify: "Repeat the original function on the normal port and after restart, confirm stable detection and power, and check that the known-good test did not move the fault elsewhere.",
      escalate: "Immediately escalate swollen batteries, burning smell, liquid damage, exposed conductors, repeated thermal shutdown, warranty-sensitive repair, or hardware replacement requiring asset control.",
      interviewScenario: "a dock, monitor, camera, headset, or other peripheral is not working",
      communicate: "I would explain the safe physical checks, avoid blaming the user, and stop testing if the device presents a safety or damage risk."
    },
    {
      id: "storage-backup",
      name: "Files, storage, and backup",
      asset: "file, storage, or backup workflow",
      scope: "local disks, shared drives, cloud files, permissions, quotas, versions, backup jobs, restores, and retention",
      tools: ["storage and quota reports", "file metadata and permissions", "backup status", "version or restore history"],
      causes: ["low capacity, quota, or an unavailable path", "permissions, locking, naming, or sync conflict", "failed backup, retention, corruption, deletion, or device damage"],
      diagnostics: "Identify the exact path, owner, device or service, time, last known-good version, permissions, available capacity, lock or sync state, backup status, retention window, and whether another copy exists.",
      safeAction: "Preserve existing copies, stop writes when corruption is suspected, free approved temporary space, correct minimum permissions, resolve conflicts without overwriting, and restore only through the authorized process.",
      verify: "Open and save a controlled file, confirm ownership and access, check version or backup completion, and perform a documented restore test when the procedure permits.",
      escalate: "Escalate suspected data loss, ransomware, disk failure, legal or retention concerns, mass deletion, backup-chain failure, or any destructive recovery operation.",
      interviewScenario: "a user cannot find, open, save, sync, or restore an important file",
      communicate: "I would tell the user to stop creating competing copies, preserve evidence, and clearly distinguish confirmed backup from assumed backup."
    },
    {
      id: "mobile-mdm",
      name: "Mobile devices and MDM",
      asset: "managed mobile device",
      scope: "enrollment, compliance, work profiles, applications, certificates, email, connectivity, and remote actions",
      tools: ["device settings", "management or compliance status", "enrollment logs", "approved MDM console"],
      causes: ["incomplete enrollment, stale check-in, or unsupported version", "a missing profile, certificate, application, or license", "a compliance, ownership, privacy, or network condition"],
      diagnostics: "Confirm device ownership, platform and version, enrollment and last check-in, compliance reason, required profiles and applications, certificate state, network, storage, date and time, and recent user or policy changes.",
      safeAction: "Trigger an approved sync, complete required updates, reinstall only the managed application or profile through the supported channel, and never wipe, retire, or remove management without explicit authorization.",
      verify: "Confirm successful check-in, compliant state, required work application access, and separation of organizational and personal data according to policy.",
      escalate: "Escalate lost or stolen devices, wipe or retire requests, privacy disputes, jailbreak or root indicators, certificate failures, or compliance policy that affects many devices.",
      interviewScenario: "a managed phone cannot access a work application after enrollment",
      communicate: "I would explain what the organization can manage, what personal data remains outside scope, and obtain authorization before any destructive remote action."
    },
    {
      id: "voice-video",
      name: "Voice, video, and meetings",
      asset: "voice or video meeting",
      scope: "microphones, speakers, cameras, permissions, codecs, bandwidth, meeting policy, rooms, and calling",
      tools: ["device selection and test", "meeting diagnostics", "network quality data", "service health"],
      causes: ["the wrong device, mute state, permission, or exclusive use", "a driver, dock, browser, room, or client problem", "bandwidth, latency, packet loss, service health, or meeting policy"],
      diagnostics: "Check the selected input and output, mute and privacy controls, application permission, local test, another supported client, network quality, meeting policy, service health, and whether the issue affects one participant or everyone.",
      safeAction: "Select and test the intended device, reconnect it, close conflicting applications, update the supported client or driver, join by an approved alternate method, and protect meeting privacy.",
      verify: "Run a test call or controlled meeting, confirm both directions of audio and video, screen sharing if required, and stable quality for several minutes.",
      escalate: "Escalate meeting-wide service failure, emergency-calling concerns, room-system hardware, persistent packet loss, unauthorized recording, or policy changes outside support scope.",
      interviewScenario: "a participant cannot hear, speak, see video, or remain connected in a meeting",
      communicate: "I would provide a quick approved workaround for the meeting while continuing to isolate device, client, network, and service causes."
    },
    {
      id: "applications",
      name: "Applications and deployment",
      asset: "business application",
      scope: "installation, launch, compatibility, dependencies, configuration, licensing, updates, and software deployment",
      tools: ["application logs", "software inventory", "deployment status", "vendor support information"],
      causes: ["a missing dependency, license, permission, or supported version", "a damaged package, cache, configuration, or user profile", "a deployment, compatibility, endpoint-control, or service-side issue"],
      diagnostics: "Record application and version, device and user, exact action and error, installation source, license, prerequisites, free space, recent updates, logs, and whether the web or known-good version behaves differently.",
      safeAction: "Use the approved installer and source, repair or reinstall through software management, restore known-good configuration, and avoid downloading unofficial packages or granting unnecessary administrator rights.",
      verify: "Launch the application, complete a representative user task, restart if required, and confirm licensing, updates, data, integrations, and security controls remain healthy.",
      escalate: "Escalate line-of-business outages, data corruption, unsigned or suspicious packages, licensing disputes, widespread deployment failure, or vendor defects requiring engineering.",
      interviewScenario: "an approved application will not install, launch, activate, or complete a task",
      communicate: "I would explain whether the blocker is device readiness, entitlement, deployment, compatibility, application configuration, or the service behind it."
    },
    {
      id: "performance",
      name: "Performance and startup",
      asset: "device performance",
      scope: "startup, CPU, memory, storage, temperature, processes, services, applications, and user experience",
      tools: ["resource monitor", "startup and process view", "event or performance logs", "hardware health data"],
      causes: ["resource pressure from a process, startup item, or workload", "low storage, thermal throttling, or failing hardware", "an update, driver, malware, profile, or service problem"],
      diagnostics: "Define what slow means and when it began, capture startup and task timing, CPU, memory, disk, network, temperature, top processes, free space, updates, and compare another user or device with the same workload.",
      safeAction: "Close or restart a confirmed stuck process, remove only approved unnecessary startup work, free safe temporary space, apply approved updates, and scan through managed security tools. Avoid registry cleaners and unapproved tuning utilities.",
      verify: "Repeat the measured task, compare before and after timing and resource use, restart once, and confirm the improvement persists without disabling required protections.",
      escalate: "Escalate suspected malware, disk or memory errors, sustained thermal problems, repeated crashes, business-wide latency, or performance that requires hardware or platform engineering.",
      interviewScenario: "a user reports that a device or application is slow",
      communicate: "I would replace the word slow with measurable tasks, times, baselines, and scope so the user sees progress rather than vague experimentation."
    },
    {
      id: "endpoint-security",
      name: "Endpoint security and alerts",
      asset: "endpoint security control",
      scope: "antivirus, EDR, firewall, encryption, patching, web protection, detections, quarantine, and device health",
      tools: ["approved security console", "endpoint health", "alert timeline", "change and exception records"],
      causes: ["a true security event or policy enforcement", "an outdated, unhealthy, or disconnected sensor", "a false positive, conflicting control, or unapproved application"],
      diagnostics: "Preserve the alert, device, user, timestamp, process, path, hash or URL where appropriate, sensor health, policy, recent change, scope, and related identity and network evidence. Do not execute suspicious content to test it.",
      safeAction: "Follow the incident or support runbook, isolate only with authority, restore sensor health, update signatures and platform, and request a narrow reviewed exception only after validating business need and risk.",
      verify: "Confirm the control is healthy, the detection or block status is understood, the business task is tested safely, and no unauthorized exception or persistence remains.",
      escalate: "Immediately escalate suspected compromise, credential theft, ransomware, lateral movement, disabled protection, repeated high-confidence detections, or any containment decision beyond help-desk authority.",
      interviewScenario: "a legitimate-looking task is blocked by endpoint protection or an alert appears",
      communicate: "I would tell the user not to retry or bypass the block, preserve the evidence, and explain that security review protects both their work and the organization."
    },
    {
      id: "helpdesk-ops",
      name: "Help-desk operations",
      asset: "support request",
      scope: "intake, triage, prioritization, ownership, knowledge, service levels, communication, escalation, and closure",
      tools: ["ticket system", "knowledge base", "asset and user records", "service and incident dashboards"],
      causes: ["an incomplete or incorrectly categorized request", "unclear ownership, priority, dependency, or service level", "missing documentation, duplicate work, or poor handoff"],
      diagnostics: "Confirm requester, contact method, affected service and asset, exact symptom, impact, urgency, scope, start time, recent change, evidence, attempted steps, security or safety concern, and required decision.",
      safeAction: "Set evidence-based priority, assign an owner, give the next update time, follow the runbook, link duplicates to the parent incident, document every material action, and close only after verification or an agreed disposition.",
      verify: "Confirm service restoration with the requester or monitoring, record the resolution and evidence, remove temporary workarounds when appropriate, and capture a reusable knowledge improvement.",
      escalate: "Escalate safety, security, executive, regulatory, widespread, repeated, or service-level risks and any request requiring authority the current queue does not have.",
      interviewScenario: "several tickets arrive at once with different impact and urgency",
      communicate: "I would set expectations with an owner, priority rationale, current status, workaround, and next update rather than leaving users to guess."
    }
  ];

  const issuePatterns = [
    { id: "unavailable", title: "Cannot connect or unavailable", symptom: "is unavailable or cannot be reached", causes: ["service or device unavailability", "connection or dependency failure"], action: "Test the smallest known-good path from the user toward the dependency, restore the first failed supported component, and do not make unrelated changes.", verify: "Confirm availability from the normal user path and one independent health signal." },
    { id: "slow", title: "Slow response or performance", symptom: "responds too slowly for the expected task", causes: ["resource pressure or congestion", "a degraded dependency or unusually heavy workload"], action: "Measure the affected task and compare it with a baseline before changing configuration; remove only the confirmed bottleneck through an approved action.", verify: "Repeat the same timed task and compare the before-and-after result." },
    { id: "intermittent", title: "Intermittent disconnect or failure", symptom: "works sometimes and fails at other times", causes: ["unstable connectivity or hardware", "timing, load, roaming, token, or race conditions"], action: "Correlate exact failure times across user, device, service, and network evidence; avoid declaring success after one good attempt.", verify: "Observe repeated successful use across the original failure window or trigger." },
    { id: "after-change", title: "Failure after an update or change", symptom: "stopped working after a reported update, move, install, or policy change", causes: ["an incompatible or incomplete change", "a changed dependency, policy, default, or restart requirement"], action: "Confirm the change and owner, compare the before-and-after state, complete documented prerequisites, and use an approved rollback only when its impact is understood.", verify: "Confirm the restored function and that the change or rollback state is consistent after restart or recheck." },
    { id: "access-denied", title: "Access denied or permission error", symptom: "returns an access-denied, forbidden, or insufficient-permission result", causes: ["missing or excessive entitlement", "wrong account, ownership, token, policy, or resource scope"], action: "Verify identity and the approved entitlement, compare effective access with a known-good peer, and grant only the minimum authorized permission.", verify: "Confirm the intended action succeeds while an unauthorized action remains blocked." },
    { id: "configuration", title: "Wrong or missing configuration", symptom: "has a missing, stale, or incorrect setting", causes: ["configuration drift or a failed policy", "wrong default, profile, environment, or management assignment"], action: "Compare with the documented baseline, export or record the current state, correct the narrow setting through the supported management path, and keep a rollback point.", verify: "Re-read the effective configuration and complete the task that depends on it." },
    { id: "sync", title: "Sync, replication, or update lag", symptom: "shows different state in two clients, devices, directories, or services", causes: ["queue, connectivity, conflict, or stale cache", "replication, token, ownership, or version mismatch"], action: "Identify the source of truth, last successful sync, pending queue and conflict; preserve all unique data before retrying or resolving the conflict.", verify: "Confirm the same expected state and timestamp in both authoritative and consuming views." },
    { id: "capacity", title: "Capacity, quota, or resource exhausted", symptom: "cannot continue because a capacity, quota, memory, storage, session, or license limit is reached", causes: ["real resource exhaustion", "a leak, abandoned session, unexpected growth, or incorrect allocation"], action: "Measure actual use and growth, remove only approved temporary or duplicate consumption, stop a confirmed leak, and request capacity through the documented owner.", verify: "Confirm safe headroom, normal new work, and no loss of required data or sessions." },
    { id: "install-update", title: "Install, update, or deployment failure", symptom: "cannot complete an approved installation, update, enrollment, or deployment", causes: ["missing prerequisite, space, permission, or restart", "package, network, signature, compatibility, or deployment-state failure"], action: "Capture the package and error, verify source, signature, prerequisites, space and policy, clear only documented temporary state, and retry once through the approved channel.", verify: "Confirm the intended version and function, inventory or management status, and a clean restart when required." },
    { id: "security-block", title: "Security policy or protection block", symptom: "is blocked by a security, compliance, encryption, browser, firewall, or endpoint control", causes: ["intended policy enforcement", "an unhealthy control, false positive, wrong classification, or missing prerequisite"], action: "Preserve the block and evidence, verify the business need and control health, follow the security runbook, and never disable the control or create a broad exception to make the symptom disappear.", verify: "Confirm the approved task works through the authorized path and that the protection remains effective." }
  ];

  const contexts = [
    { id: "single-user", label: "Single user", qualifier: "One user reports the problem while comparable users appear unaffected.", triage: "Confirm the exact user, device, account, location, action, error, start time, impact, and whether another approved user or device behaves differently." },
    { id: "multi-user", label: "Multiple users", qualifier: "Several users, devices, or locations report the same symptom.", triage: "Treat this as a potential incident: establish scope, common dependency, first report, business impact, parent ticket, service owner, and next communication time." },
    { id: "recent-change", label: "After a recent change", qualifier: "The symptom began after an update, move, installation, policy, account, or infrastructure change.", triage: "Record the change, owner, approval, exact completion time, expected result, rollback plan, and evidence showing whether the symptom started before or after it." },
    { id: "intermittent-context", label: "Intermittent", qualifier: "The problem cannot be reproduced on every attempt.", triage: "Capture precise successful and failed timestamps, location, workload, connection, user action, resource state, and logs across a long enough window to avoid guessing." },
    { id: "new-setup", label: "New device or setup", qualifier: "The workflow has not yet worked on this device, account, location, or configuration.", triage: "Validate prerequisites, ownership, supported model and version, enrollment, network, time, license, entitlement, policy, dependencies, and the documented build baseline." }
  ];

  const assetWithArticle = (category) => `${/^[aeiou]/i.test(category.asset) ? "an" : "a"} ${category.asset.toLowerCase()}`;

  const interviewTemplates = [
    {
      id: "troubleshoot",
      topic: "Troubleshooting method",
      question: (category) => `How would you troubleshoot ${category.interviewScenario}?`,
      answer: (category) => `I would start by confirming the user, asset, exact task, error, time, impact, scope, and recent change. I would then use ${category.tools.slice(0, 3).join(", ")} to find the first failed layer instead of making several changes at once. ${category.diagnostics} I would apply the least disruptive authorized fix, ${category.verify.toLowerCase()} I would document the evidence, user confirmation, and any remaining risk.`
    },
    {
      id: "change-safety",
      topic: "Safe change control",
      question: (category) => `What would you check before changing the ${category.asset.toLowerCase()}?`,
      answer: (category) => `Before changing anything, I would record the current state, business impact, owner, recent changes, dependencies, and a rollback point. I would confirm that the proposed action is within my authority and that important data or access can be recovered. ${category.safeAction} I would change one relevant variable, record the exact result, and stop if the risk becomes greater than the original incident.`
    },
    {
      id: "communication",
      topic: "Customer communication",
      question: (category) => `How would you explain ${assetWithArticle(category)} issue to a nontechnical user?`,
      answer: (category) => `${category.communicate} I would avoid jargon and blame, summarize what is confirmed versus still being tested, provide a safe workaround when one exists, and give a specific next-update time. Before closing, I would ask the user to repeat the original task and confirm the result in their own words.`
    },
    {
      id: "escalation",
      topic: "Escalation judgment",
      question: (category) => `When would you escalate ${assetWithArticle(category)} ticket?`,
      answer: (category) => `I would escalate when scope, safety, security, data, authority, time, or specialist depth exceeds the help-desk runbook. For this area, ${category.escalate.toLowerCase()} The escalation would include the customer impact, exact timestamps and errors, affected assets and users, checks already completed, changes made, current workaround, evidence, and the decision or capability I need from the next team.`
    },
    {
      id: "documentation",
      topic: "Documentation and prevention",
      question: (category) => `How would you document and help prevent recurrence of ${assetWithArticle(category)} problem?`,
      answer: (category) => `I would document the requester's words, normalized symptom, affected service and asset, scope, impact, start time, recent change, evidence, hypotheses tested, exact actions, before-and-after result, user verification, and escalation or closure reason. I would link the known error or problem record, remove any temporary workaround, and propose a knowledge-base, monitoring, training, configuration-baseline, or change-control improvement supported by the evidence.`
    }
  ];

  const problems = [];
  let problemNumber = 1;
  categories.forEach((category) => {
    issuePatterns.forEach((pattern) => {
      contexts.forEach((context) => {
        const id = `it-${String(problemNumber).padStart(4, "0")}`;
        problems.push(Object.freeze({
          id,
          number: problemNumber,
          categoryId: category.id,
          category: category.name,
          contextId: context.id,
          context: context.label,
          patternId: pattern.id,
          title: `${category.asset}: ${pattern.title} — ${context.label}`,
          symptom: `${context.qualifier} The ${category.asset.toLowerCase()} ${pattern.symptom}.`,
          likelyCauses: Object.freeze([...pattern.causes, ...category.causes].slice(0, 5)),
          fixSteps: Object.freeze([
            context.triage,
            "Capture the exact wording or code, timestamp, asset, user, location, affected service, and one known-good comparison before changing state.",
            category.diagnostics,
            pattern.action,
            category.safeAction
          ]),
          verification: `${category.verify} ${pattern.verify}`,
          escalation: `${category.escalate} Also escalate when the issue is widespread, repeats after the documented fix, breaches a service target, or requires authority you do not have.`,
          tools: Object.freeze(category.tools),
          tags: Object.freeze([category.id, pattern.id, context.id])
        }));
        problemNumber += 1;
      });
    });
  });

  const interviews = [];
  let interviewNumber = 1;
  categories.forEach((category) => {
    interviewTemplates.forEach((template) => {
      interviews.push(Object.freeze({
        id: `hd-${String(interviewNumber).padStart(3, "0")}`,
        number: interviewNumber,
        categoryId: category.id,
        category: category.name,
        topic: template.topic,
        question: template.question(category),
        answer: template.answer(category),
        answerShape: "Scope → evidence → least-disruptive action → verification → documentation or escalation"
      }));
      interviewNumber += 1;
    });
  });

  const data = Object.freeze({
    categories: Object.freeze(categories),
    issuePatterns: Object.freeze(issuePatterns),
    contexts: Object.freeze(contexts),
    interviewTemplates: Object.freeze(interviewTemplates),
    problems: Object.freeze(problems),
    interviews: Object.freeze(interviews)
  });

  if (problems.length !== 1000) throw new Error(`Expected 1000 IT problems, found ${problems.length}`);
  if (interviews.length !== 100) throw new Error(`Expected 100 help-desk interview questions, found ${interviews.length}`);
  if (new Set(problems.map((item) => item.id)).size !== 1000) throw new Error("IT problem IDs must be unique");
  if (new Set(problems.map((item) => item.title)).size !== 1000) throw new Error("IT problem titles must be unique");
  if (new Set(interviews.map((item) => item.id)).size !== 100) throw new Error("Interview question IDs must be unique");

  root.GENERAL_IT_DATA = data;
  if (typeof module !== "undefined" && module.exports) module.exports = data;
})(typeof window !== "undefined" ? window : globalThis);
