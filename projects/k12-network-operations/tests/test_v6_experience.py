import json
import re
from pathlib import Path
import unittest
import struct

ROOT = Path(__file__).resolve().parents[1]
CASES = ['INC-WAN-01','INC-FILTER-01','INC-SEC-01','INC-DNS-01','INC-WIFI-01','INC-INTUNE-01']

class V6ExperienceTests(unittest.TestCase):
    def test_v6_public_entrypoints(self):
        landing=(ROOT/'index.html').read_text(encoding='utf-8')
        dash=(ROOT/'dashboard/index.html').read_text(encoding='utf-8')
        for token in ['portfolio/v6.css','portfolio/v6-data.js','portfolio/v6.js','35-district digital twin','operations center']:
            self.assertIn(token.lower(), landing.lower())
        for token in ['v6.css','v6.js','shift briefing','digital twin','evidence vault','virtual operations terminal']:
            self.assertIn(token.lower(), dash.lower())

    def test_v6_case_export_has_all_featured_evidence(self):
        text=(ROOT/'portfolio/v6-data.js').read_text(encoding='utf-8')
        prefix='window.K12_V6_DATA = '
        self.assertTrue(text.startswith(prefix))
        data=json.loads(text[len(prefix):].rstrip().rstrip(';'))
        self.assertEqual(set(data['cases']), set(CASES))
        for cid in CASES:
            files=data['cases'][cid]['files']
            self.assertGreaterEqual(len(files), 3, cid)
            self.assertIn('README.md', files, cid)

    def test_public_pages_enforce_static_boundary(self):
        for rel in ['index.html','dashboard/index.html']:
            text=(ROOT/rel).read_text(encoding='utf-8').lower()
            self.assertIn("connect-src 'none'",text,rel)
            self.assertNotIn('eval(',text,rel)


    def test_v6_portfolio_integration_pack(self):
        snippet=(ROOT/'integration/project-card.html').read_text(encoding='utf-8')
        self.assertIn('project-card',snippet)
        self.assertIn('projects/k12-network-operations/',snippet)
        expected={
            'assets/previews/k12-ops-v6-card.png':(1600,900),
            'assets/previews/k12-ops-v6-social.png':(1200,630),
        }
        for rel,dims in expected.items():
            raw=(ROOT/rel).read_bytes()
            self.assertEqual(raw[:8],b'\x89PNG\r\n\x1a\n',rel)
            width,height=struct.unpack('>II',raw[16:24])
            self.assertEqual((width,height),dims,rel)
        for rel in ['docs/PORTFOLIO_INTEGRATION.md','docs/V6_DEMO_SCRIPT.md','docs/V6_EXPERIENCE_ARCHITECTURE.md']:
            self.assertTrue((ROOT/rel).exists(),rel)

    def test_dashboard_has_required_operator_views(self):
        text=(ROOT/'dashboard/index.html').read_text(encoding='utf-8')
        ids=set(re.findall(r'id="([^"]+)"', text))
        for view in ['mission','overview','twin','incident','evidence','services','assurance','capacity','changes','terminal','architecture']:
            self.assertIn(view,ids)

if __name__=='__main__': unittest.main()
