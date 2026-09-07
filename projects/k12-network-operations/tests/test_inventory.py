import json, unittest
from pathlib import Path
from k12ops.validate import validate_inventory

ROOT=Path(__file__).resolve().parents[1]
class InventoryTests(unittest.TestCase):
    def test_inventory_has_35_districts_and_no_errors(self):
        data=json.loads((ROOT/'data/districts.json').read_text(encoding='utf-8'))
        findings=validate_inventory(data)
        self.assertEqual(len(data['districts']),35)
        self.assertFalse([f for f in findings if f.level=='ERROR'])

    def test_each_district_has_two_sites_and_six_vlans(self):
        data=json.loads((ROOT/'data/districts.json').read_text(encoding='utf-8'))
        for d in data['districts']:
            self.assertEqual(len(d['sites']),2)
            self.assertEqual(len(d['vlans']),6)

if __name__=='__main__': unittest.main()
