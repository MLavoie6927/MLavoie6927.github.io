import json, tempfile, unittest
from pathlib import Path
from k12ops.dependencies import dependency_chain, blast_radius
from k12ops.drift import analyze_drift
from k12ops.capacity import linear_forecast, regional_forecast
from k12ops.sla import analyze_sla
from k12ops.changes import score_change
from k12ops.telemetry import summarize_telemetry
from k12ops.evidence import build_evidence_bundle
ROOT=Path(__file__).resolve().parents[1]
class EnterpriseOpsTests(unittest.TestCase):
    def test_dependency_chain_and_blast_radius(self):
        d=json.loads((ROOT/'data/services.json').read_text(encoding='utf-8'))
        chain=dependency_chain(d,'svc-instructional')
        self.assertIn('svc-dns',chain); self.assertEqual(chain[-1],'svc-instructional')
        self.assertIn('svc-instructional',blast_radius(d,'svc-dns'))
    def test_drift_finds_expected_deviations(self):
        b=json.loads((ROOT/'configs/compliance/baseline.json').read_text(encoding='utf-8')); s=json.loads((ROOT/'data/config_snapshots.json').read_text(encoding='utf-8'))
        r=analyze_drift(b,s); self.assertLess(r['score'],100); self.assertGreaterEqual(len(r['findings']),3)
    def test_capacity_forecast(self):
        self.assertEqual(len(linear_forecast([10,20,30],3)),3)
        d=json.loads((ROOT/'data/capacity_history.json').read_text(encoding='utf-8')); self.assertEqual(len(regional_forecast(d)),35)
    def test_sla(self):
        t=json.loads((ROOT/'data/tickets.json').read_text(encoding='utf-8')); r=analyze_sla(t); self.assertEqual(r['tickets'],20); self.assertGreater(r['response_attainment_pct'],0)
    def test_change_risk_requires_controls(self):
        self.assertFalse(score_change({'id':'x','risk':'High','validation':[],'approvals':[],'rollback':''})['ready'])
    def test_telemetry_detects_injected_loss(self):
        d=json.loads((ROOT/'data/telemetry.json').read_text(encoding='utf-8')); r=summarize_telemetry(d); self.assertEqual(r['samples'],288); self.assertGreater(r['max_packet_loss_pct'],10)
    def test_evidence_bundle(self):
        with tempfile.TemporaryDirectory() as td:
            m=build_evidence_bundle(ROOT/'case-studies/INC-DNS-01',Path(td)/'bundle'); self.assertTrue(m['synthetic']); self.assertIn('README.md',m['files'])
if __name__=='__main__': unittest.main()
