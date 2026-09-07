.PHONY: test validate report sync check compile

test:
	python -m unittest discover -s tests -v

validate:
	python -m k12ops.cli validate --inventory data/districts.json
	python tools/validate_portfolio.py
	python tools/validate_v6_experience.py
	node --check portfolio/v6.js
	node --check dashboard/v6.js

compile:
	python -m compileall -q k12ops scripts/network tools tests

report:
	python tools/generate_enterprise_report.py

sync:
	python tools/export_static_data.py
	python tools/export_v6_experience.py

check: test validate compile
	python tools/export_static_data.py --check
	python tools/export_v6_experience.py --check
	python tools/generate_enterprise_report.py --check
