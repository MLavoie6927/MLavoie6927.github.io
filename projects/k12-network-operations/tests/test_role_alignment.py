from pathlib import Path
import unittest

ROOT=Path(__file__).resolve().parents[1]

class RoleAlignmentTests(unittest.TestCase):
    def test_requirement_matrix_mentions_core_role_domains(self):
        text=(ROOT/'docs/JOB_REQUIREMENT_MAPPING.md').read_text(encoding='utf-8').lower()
        for term in ['windows','linux','chromeos','active directory','entra','intune','google workspace','firewall','internet filter','mdf / idf','snmp','powershell','35-district']:
            self.assertIn(term,text)

    def test_featured_wan_case_has_escalation(self):
        text=(ROOT/'case-studies/INC-WAN-01/escalation.md').read_text(encoding='utf-8').lower()
        for term in ['circuit','traceroute','provider','request']:
            self.assertIn(term,text)

if __name__=='__main__': unittest.main()
