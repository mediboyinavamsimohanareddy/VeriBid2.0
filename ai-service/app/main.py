import os
import time
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from app.extraction_service import ExtractionService
from app.clause_service import LLMService
from app.compliance_engine import ComplianceEngine
from app.email_service import EmailService
from app.demo_service import DemoCaseProcessor
from app.models import ExtractionRequest, ClauseModel, MatchRequest, MatchResponse, ClauseExtractionRequest
from typing import List, Dict, Any, Optional

from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(
    title="GeM Forensic Verification AI Service",
    description="OCR, Vision Document Forensics, Semantic RAG, Cartel Collusion Engine & SIH Demo Processor",
    version="2.0.0"
)

# Serve demo PDF data
demo_data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "demo-data"))
if os.path.exists(demo_data_dir):
    app.mount("/demo-data-static", StaticFiles(directory=demo_data_dir), name="demo-data-static")

@app.get("/demo-data/{case_id}")
def get_demo_pdf(case_id: str):
    from fastapi.responses import FileResponse
    target_folder = os.path.join(demo_data_dir, case_id)
    if os.path.exists(target_folder):
        files = [f for f in os.listdir(target_folder) if f.endswith('.pdf')]
        if files:
            pdf_path = os.path.join(target_folder, files[0])
            return FileResponse(pdf_path, media_type='application/pdf')
    raise HTTPException(status_code=404, detail="Demo PDF not found")

# Load .env variables if present
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# CORS Configuration
allowed_origins_env = os.environ.get("ALLOWED_ORIGINS", "*")
origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if len(origins) > 0 else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

extraction_service = ExtractionService()
llm_service = LLMService()

VERIFICATION_SESSIONS: Dict[str, Dict[str, Any]] = {}

@app.get("/")
@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": "GeM Forensic AI Service (VeriBid Engine v2.0)",
        "smtp_configured": bool(os.environ.get("SMTP_USER") and os.environ.get("SMTP_PASSWORD")),
        "ml_features": [
            "Document Forgery & ELA Image Tampering Detection",
            "Cartel & Collusion Graph Neural Analysis",
            "Semantic Vector RAG & SLM Extractor",
            "Cross-Document Entity Consistency Matrix",
            "Predictive Bidder Risk Scoring & SHAP XAI",
            "SIH 2026 Jury Demo Case Processor"
        ]
    }

@app.get("/demo-cases")
def get_demo_cases():
    """
    Returns available synthetic demo cases for SIH 2026 Jury evaluation.
    """
    return DemoCaseProcessor.get_available_cases()

@app.get("/demo-cases/{case_id}")
@app.post("/demo-cases/{case_id}/process")
def process_demo_case(case_id: str):
    """
    Loads synthetic PDFs from ./demo-data for the requested case
    and executes full verification analysis.
    """
    res = DemoCaseProcessor.process_demo_case(case_id)
    session_id = f"demo-sess-{case_id}-{int(time.time())}"
    
    VERIFICATION_SESSIONS[session_id] = {
        "session_id": session_id,
        "case_id": res.get("caseId"),
        "created_at": time.time(),
        "analysis": res
    }

    return {
        "session_id": session_id,
        "status": "Demo Case Processed",
        "bidder_id": res.get("bidder_id"),
        "bidderName": res.get("bidderName"),
        "overall_compliance_score": res.get("overall_compliance_score"),
        "risk_level": res.get("risk_level"),
        "rejection_probability": res.get("rejection_probability"),
        "shap_feature_importance": res.get("shap_feature_importance", []),
        "graph_collusion_flag": res.get("graph_collusion_flag", {}),
        "forgery_analysis": res.get("forgery_analysis", {}),
        "findings": res.get("findings", []),
        "human_review_required": res.get("human_review_required", True),
        "is_demo_data": True,
        "demo_notice": res.get("demo_notice"),
        "analysis": res
    }

@app.post("/send-email")
async def send_email_report(payload: Dict[str, Any] = Body(...)):
    recipient = payload.get("email", "kvamsi.nellore@gmail.com")
    case_id = payload.get("case_id", "GEM/2024/9/19102")
    bidder_name = payload.get("bidder_name", "ABC Infra Private Limited")
    
    try:
        res = EmailService.send_smtp_report(
            recipient=recipient,
            case_id=case_id,
            bidder_name=bidder_name,
            compliance_score=payload.get("overallCompliance", 68),
            passed_count=payload.get("passedCount", 12),
            issues_count=payload.get("issuesCount", 4),
            review_count=payload.get("reviewCount", 3)
        )
        return res
    except Exception as e:
        print("SMTP Dispatch error:", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-file")
@app.post("/forensic-analysis")
async def analyze_file(file: UploadFile = File(...), case_id: str = Form("GEM/2024/9/19102")):
    content = await file.read()
    pages_text = []
    try:
        import pypdf
        import io
        reader = pypdf.PdfReader(io.BytesIO(content))
        pages_text = [page.extract_text() or "" for page in reader.pages]
    except Exception as e:
        print("PyPDF extraction note:", e)

    analysis_res = ComplianceEngine.analyze_pages(
        pages_text=pages_text,
        filename=file.filename or "uploaded_bid.pdf",
        file_bytes=content
    )

    session_id = f"sess-{int(time.time()*1000)}"
    VERIFICATION_SESSIONS[session_id] = {
        "session_id": session_id,
        "case_id": case_id,
        "filename": file.filename,
        "file_size_kb": round(len(content)/1024, 1),
        "created_at": time.time(),
        "analysis": analysis_res
    }

    # Converged standardized JSON response payload format
    return {
        "session_id": session_id,
        "filename": file.filename,
        "file_size_kb": round(len(content)/1024, 1),
        "status": "Document Uploaded & Forensic Analysis Completed",
        
        # Standardized ML output fields matching user specification
        "bidder_id": analysis_res.get("bidder_id", "BIDDER_ABC_102"),
        "overall_compliance_score": analysis_res.get("overall_compliance_score", 87),
        "risk_level": analysis_res.get("risk_level", "High"),
        "rejection_probability": analysis_res.get("rejection_probability", 0.85),
        "shap_feature_importance": analysis_res.get("shap_feature_importance", []),
        "graph_collusion_flag": analysis_res.get("graph_collusion_flag", {}),
        "forgery_analysis": analysis_res.get("forgery_analysis", {}),
        "findings": analysis_res.get("findings", []),
        "human_review_required": analysis_res.get("human_review_required", True),

        # Preserved legacy analysis payload for UI backwards compatibility
        "analysis": analysis_res
    }

@app.get("/verification/{session_id}")
def get_verification_session(session_id: str):
    if session_id not in VERIFICATION_SESSIONS:
        raise HTTPException(status_code=404, detail="Verification session not found")
    return VERIFICATION_SESSIONS[session_id]

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)
