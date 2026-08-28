# Browser OS 1.0 Portfolio Edition

Browser OS is Marc Lavoie's dependency-free, browser-native cybersecurity workstation for GitHub Pages. It models operating-system and SOC workflows with synthetic JavaScript state; it is not a real operating system, shell, network client, EDR agent, or SIEM.

The recommended recruiter path is the six-step Guided Investigation. It correlates one synthetic incident across the SOC queue, process lineage, network sessions, packet evidence, event logs, and endpoint containment. Every evidence window includes a visible return to the guide, while the remaining applications support deeper technical exploration.

## Applications

- Guided Investigation
- Terminal
- Virtual File System
- Network Monitor
- Process Explorer
- Log Viewer
- Packet Analyzer
- Virtual Browser with allowlisted `.local` services
- SOC Console
- Security Center
- System Information

## Security Boundary

Browser OS has no credentials, API keys, backend, repository integration, arbitrary code execution, or external network client. Its Content Security Policy sets `connect-src 'none'`. All changing state is held in memory or in the visitor's own `browserOS.v3.*` browser-storage keys.

The destructive terminal demonstration `rm -rf /` only changes the simulator's `virtualDestroyed` state. The resulting kernel-panic screen can reinstall the simulated environment. It cannot address, edit, deploy, or delete the portfolio or GitHub repository.

All IP addresses use the RFC 5737 documentation ranges `192.0.2.0/24`, `198.51.100.0/24`, and `203.0.113.0/24`.

## Run Locally

Serve the repository root with any static HTTP server and open `/browser-os/`. No installation or build step is required.

```powershell
python -m http.server 4173
```

## Files

- `index.html` - boot manager, desktop, applications, and security-boundary copy
- `styles.css` - responsive operating-system interface
- `script.js` - allowlisted commands, window manager, synthetic telemetry, and virtual state
