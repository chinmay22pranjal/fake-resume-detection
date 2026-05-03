"""routers/report.py — PDF report download endpoint"""
from fastapi import APIRouter
from fastapi.responses import Response
from pydantic import BaseModel
from services.report_generator import generate_pdf_report

router = APIRouter()

class ReportRequest(BaseModel):
    analysis: dict
    resume_data: dict
    linkedin_data: dict

@router.post("/download")
def download_report(req: ReportRequest):
    pdf_bytes = generate_pdf_report(req.analysis, req.resume_data, req.linkedin_data)
    candidate_name = req.resume_data.get("full_name", "candidate").replace(" ", "_")
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=resume_report_{candidate_name}.pdf"}
    )
