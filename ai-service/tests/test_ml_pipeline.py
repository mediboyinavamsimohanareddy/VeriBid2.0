import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.forgery_detector import DocumentForgeryDetector
from app.predictive_risk import PredictiveRiskModel
from app.rag_service import RAGSemanticMatcher

class TestAIServiceML(unittest.TestCase):
    def test_forgery_detector_clean_bytes(self):
        clean_bytes = b"%PDF-1.4 Clean Sample PDF File Buffer"
        res = DocumentForgeryDetector.analyze_document_forensics(clean_bytes, filename="clean_doc.pdf")
        self.assertIn("tamper_detected", res)
        self.assertFalse(res["tamper_detected"])
        self.assertEqual(res["confidence"], 0.0)

    def test_predictive_risk_model(self):
        # Test low risk
        low_risk = PredictiveRiskModel.evaluate_risk(
            turnover_shortfall_pct=0.0,
            missing_attachment_ratio=0.0,
            entity_drift_score=0.0,
            forgery_confidence=0.0,
            udin_failed=False,
            gstin_cancelled=False,
            collusion_detected=False
        )
        self.assertIn("overall_compliance_score", low_risk)
        self.assertEqual(low_risk["risk_level"], "Low")

        # Test high risk
        high_risk = PredictiveRiskModel.evaluate_risk(
            turnover_shortfall_pct=50.0,
            missing_attachment_ratio=0.5,
            entity_drift_score=0.5,
            forgery_confidence=0.9,
            udin_failed=True,
            gstin_cancelled=True,
            collusion_detected=True
        )
        self.assertEqual(high_risk["risk_level"], "High")
        self.assertGreaterEqual(high_risk["rejection_probability"], 0.5)

    def test_rag_slm_extraction(self):
        sample_text = "Vendor Name: ABC Infra Private Limited. GSTIN: 07AAAAA0000A1Z5. UDIN: 23123456AAAAAA1234. Turnover: Rs 15.5 Crore in FY 2023-24."
        entities = RAGSemanticMatcher.slm_extract_json(sample_text)
        self.assertEqual(entities["udin"], "23123456AAAAAA1234")
        self.assertEqual(entities["gstin"], "07AAAAA0000A1Z5")
        self.assertEqual(entities["extracted_turnover_cr"], 15.5)

if __name__ == '__main__':
    unittest.main()
