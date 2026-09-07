import json, unittest
from pathlib import Path
from k12ops.triage import triage_scenario, suggest_fault_domain

ROOT=Path(__file__).resolve().parents[1]
class TriageTests(unittest.TestCase):
    def setUp(self): self.scenarios=json.loads((ROOT/'data/scenarios.json').read_text(encoding='utf-8'))
    def test_wan_scenario(self):
        r=triage_scenario(self.scenarios,'INC-WAN-01')
        self.assertEqual(r.severity,'P2')
        self.assertIn('WAN',r.fault_domain)
    def test_dns_fault_hint(self):
        self.assertEqual(suggest_fault_domain({'link':True,'ip':True,'gateway':True,'dns':False}),'DNS')
    def test_identity_fault_hint(self):
        self.assertEqual(suggest_fault_domain({'link':True,'ip':True,'gateway':True,'dns':True,'tcp':True,'auth':False}),'Identity/Policy')

if __name__=='__main__': unittest.main()
