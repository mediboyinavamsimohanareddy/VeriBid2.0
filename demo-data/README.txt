VERIBID - SIH 2026 NATIONAL JURY DEMO DATASET v2
================================================

This package contains synthetic procurement documents intended for demonstrating the VeriBid forensic-verification prototype.

IMPORTANT
---------
Every company, person, registration number, amount, address, tender reference and certificate in this package is fabricated for software testing. The documents are not issued by any government authority, company, bank, tax department or procurement portal.

The package deliberately uses realistic procurement language, date formats, document structures and Indian-numbering/registration formats so that the prototype can demonstrate OCR, entity matching, threshold extraction, document classification, evidence highlighting and audit logging.

Cases
-----
1. Case_A_Consistent
   A complete synthetic package with matching bidder identity data, turnover above the tender threshold and three similar experience certificates.

2. Case_B_Mismatch_Review
   A synthetic package with an intentional GST legal-name variation, turnover below the tender threshold and only two experience certificates. It is designed to produce evidence and a review flag. It should not automatically cancel or disqualify the bid.

3. Case_C_Incomplete
   A synthetic package where several supporting documents are intentionally absent. It is designed to demonstrate missing-document detection.

Recommended application UI
---------------------------
[ Upload Documents ]    [ Try with Demo Documents ]

When the jury chooses Try with Demo Documents, present the three cases as selectable scenarios and feed the selected PDFs through the same verification pipeline used for live uploads.

Recommended review behavior
---------------------------
Automated checks should identify evidence and flags. A final bid decision should remain with the designated officer workflow.

Synthetic data note
--------------------
The realistic-looking numbers are for OCR and rule-engine testing only. No attempt has been made to represent a real bidder or real procurement event.
