# Project Validation

## Automated

```bash
python -m unittest discover -s tests -v
python -m k12ops.cli validate --inventory data/districts.json
```

## Manual

- Open `dashboard/index.html` and load each incident.
- Run PowerShell scripts in an authorized Windows lab.
- Run Bash scripts on a Linux lab host.
- Review network configuration examples for syntax before adapting them to a real vendor/platform.

## Acceptance Criteria

- all 35 districts have unique IDs and address spaces,
- every site references an existing district,
- every scenario has a severity, scope, fault domain, evidence list, and resolution/escalation path,
- tests pass without external Python packages,
- no repository file contains real credentials.
