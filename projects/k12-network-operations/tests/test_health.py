import json, unittest
from pathlib import Path
from k12ops.health import calculate_health
from k12ops.report import operations_report
ROOT=Path(__file__).resolve().parents[1]
class HealthTests(unittest.TestCase):
    def test_health_and_report(self):
        inv=json.loads((ROOT/'data/districts.json').read_text(encoding='utf-8'))
        tickets=json.loads((ROOT/'data/tickets.json').read_text(encoding='utf-8'))
        h=calculate_health(inv,tickets)
        self.assertEqual(h.districts,35)
        self.assertEqual(h.sites,70)
        self.assertGreater(h.devices,0)
        report=operations_report(inv,tickets)
        self.assertIn('Generated K–12 Operations Report',report)

if __name__=='__main__': unittest.main()
