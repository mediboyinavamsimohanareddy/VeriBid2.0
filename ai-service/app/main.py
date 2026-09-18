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
    if not os.path.exists(target_folder):
        normalized = case_id.lower()
        if "case_a" in normalized or "consistent" in normalized:
            target_folder = os.path.join(demo_data_dir, "Case_A_Consistent")
        elif "case_b" in normalized or "mismatch" in normalized:
            target_folder = os.path.join(demo_data_dir, "Case_B_Mismatch_Review")
        elif "case_c" in normalized or "incomplete" in normalized:
            target_folder = os.path.join(demo_data_dir, "Case_C_Incomplete")

    if os.path.exists(target_folder) and os.path.isdir(target_folder):
        files = [f for f in sorted(os.listdir(target_folder)) if f.lower().endswith(('.pdf', '.png', '.jpg', '.jpeg'))]
        if files:
            pdf_path = os.path.join(target_folder, files[0])
            media_type = 'application/pdf' if pdf_path.endswith('.pdf') else 'image/jpeg'
            return FileResponse(pdf_path, media_type=media_type)
    raise HTTPException(status_code=404, detail="Demo document not found")

@app.get("/demo-cases/{case_id}/files")
def get_demo_case_files(case_id: str):
    target_folder = os.path.join(demo_data_dir, case_id)
    if not os.path.exists(target_folder):
        normalized = case_id.lower()
        if "case_a" in normalized or "consistent" in normalized:
            target_folder = os.path.join(demo_data_dir, "Case_A_Consistent")
        elif "case_b" in normalized or "mismatch" in normalized:
            target_folder = os.path.join(demo_data_dir, "Case_B_Mismatch_Review")
        elif "case_c" in normalized or "incomplete" in normalized:
            target_folder = os.path.join(demo_data_dir, "Case_C_Incomplete")

    if os.path.exists(target_folder) and os.path.isdir(target_folder):
        files_info = []
        folder_basename = os.path.basename(target_folder)
        for fname in sorted(os.listdir(target_folder)):
            fpath = os.path.join(target_folder, fname)
            if os.path.isfile(fpath):
                ext = os.path.splitext(fname)[1].lower()
                files_info.append({
                    "filename": fname,
                    "url": f"/demo-data-static/{folder_basename}/{fname}",
                    "file_size_kb": round(os.path.getsize(fpath) / 1024, 1),
                    "file_type": "PDF" if ext == ".pdf" else "IMAGE" if ext in ['.png', '.jpg', '.jpeg', '.webp'] else "DOCUMENT"
                })
        return {
            "case_id": case_id,
            "folder_name": folder_basename,
            "total_files": len(files_info),
            "files": files_info
        }
    raise HTTPException(status_code=404, detail="Demo folder not found")

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
@app.post("/analyze-files")
@app.post("/forensic-analysis")
async def analyze_file(
    file: Optional[UploadFile] = File(None),
    files: Optional[List[UploadFile]] = File(None),
    case_id: str = Form("GEM/2024/9/19102"),
    folder_name: Optional[str] = Form(None)
):
    upload_list = []
    if files and len(files) > 0:
        upload_list = files
    elif file is not None:
        upload_list = [file]

    if not upload_list:
        raise HTTPException(status_code=400, detail="No files provided for analysis")

    files_data = []
    for f in upload_list:
        content = await f.read()
        fname = f.filename or "uploaded_bid.pdf"
        ext = os.path.splitext(fname)[1].lower()
        pages_text = []
        ftype = "PDF"

        if ext in [".jpg", ".jpeg", ".png", ".webp", ".tiff", ".bmp"]:
            ftype = "IMAGE"
            try:
                from PIL import Image
                import io
                img = Image.open(io.BytesIO(content))
                pages_text = [f"Image Document: {fname} ({img.width}x{img.height} pixels, format: {img.format})"]
            except Exception:
                pages_text = [f"Image Document: {fname}"]
        else:
            ftype = "PDF"
            try:
                import pypdf, io
                reader = pypdf.PdfReader(io.BytesIO(content))
                pages_text = [page.extract_text() or "" for page in reader.pages]
            except Exception as e:
                print(f"PyPDF extraction note for {fname}: {e}")
                pages_text = [f"Document text from {fname}"]

        files_data.append({
            "filename": fname,
            "content": content,
            "file_type": ftype,
            "pages_text": pages_text
        })

    analysis_res = ComplianceEngine.analyze_file_batch(
        files_list=files_data,
        folder_name=folder_name
    )

    session_id = f"sess-{int(time.time()*1000)}"
    primary_filename = folder_name or files_data[0]["filename"]
    total_size_kb = round(sum(len(fd["content"]) for fd in files_data) / 1024, 1)

    VERIFICATION_SESSIONS[session_id] = {
        "session_id": session_id,
        "case_id": case_id,
        "filename": primary_filename,
        "file_size_kb": total_size_kb,
        "created_at": time.time(),
        "is_folder": analysis_res.get("is_folder", False),
        "document_count": len(files_data),
        "analysis": analysis_res
    }

    return {
        "session_id": session_id,
        "filename": primary_filename,
        "file_size_kb": total_size_kb,
        "is_folder": analysis_res.get("is_folder", False),
        "folder_name": analysis_res.get("folder_name"),
        "document_count": len(files_data),
        "documents_analyzed": analysis_res.get("documents_analyzed", []),
        "status": "Document / Folder Uploaded & Forensic Analysis Completed",
        "bidder_id": analysis_res.get("bidder_id", "BIDDER_ABC_102"),
        "overall_compliance_score": analysis_res.get("overall_compliance_score", 87),
        "risk_level": analysis_res.get("risk_level", "High"),
        "rejection_probability": analysis_res.get("rejection_probability", 0.85),
        "shap_feature_importance": analysis_res.get("shap_feature_importance", []),
        "graph_collusion_flag": analysis_res.get("graph_collusion_flag", {}),
        "forgery_analysis": analysis_res.get("forgery_analysis", {}),
        "findings": analysis_res.get("findings", []),
        "human_review_required": analysis_res.get("human_review_required", True),
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
