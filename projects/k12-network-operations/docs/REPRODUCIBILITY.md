# Reproducibility

The v5 project is designed so the displayed portfolio state can be regenerated from repository data instead of manually editing metrics in several places.

## Validate everything

```bash
make check
```

Equivalent commands are available individually if `make` is not installed.

## Regenerate the operations report

```bash
python tools/generate_enterprise_report.py
```

## Synchronize browser data

After changing district, ticket, scenario, service, change, telemetry, capacity, or configuration-snapshot data:

```bash
python tools/export_static_data.py
```

This refreshes the static JavaScript dataset used by the GitHub Pages-compatible console.

## Design objective

A portfolio demonstration should be internally consistent. The browser should not claim a different ticket count, SLA percentage, or service state than the command-line tools and generated report.
