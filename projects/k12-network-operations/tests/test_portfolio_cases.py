import json
from pathlib import Path
import unittest

ROOT=Path(__file__).resolve().parents[1]

class PortfolioCaseTests(unittest.TestCase):
    def test_featured_cases_have_raw_evidence(self):
        for case in ['INC-WAN-01','INC-FILTER-01','INC-SEC-01']:
            root=ROOT/'case-studies'/case
            self.assertTrue((root/'README.md').exists())
            evidence=list((root/'evidence').glob('*'))
            self.assertGreaterEqual(len(evidence),3)

    def test_json_evidence_is_explicitly_synthetic(self):
        for p in (ROOT/'case-studies').glob('*/evidence/*.json'):
            data=json.loads(p.read_text(encoding='utf-8'))
            self.assertIs(data.get('synthetic'),True,p)

    def test_portfolio_entrypoint_exists(self):
        text=(ROOT/'index.html').read_text(encoding='utf-8').lower()
        self.assertTrue('portfolio/v6.css' in text or 'portfolio/styles.css' in text)
        self.assertIn('synthetic',text)

if __name__=='__main__': unittest.main()
