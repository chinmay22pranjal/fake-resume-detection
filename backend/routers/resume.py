"""
routers/resume.py
Main endpoint: upload resume → extract → find LinkedIn → verify → return report
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from services.resume_extractor import extract_text_from_file
from services.ai_parser import extract_resume_fields, verify_resume_vs_linkedin
from services.linkedin_service import find_linkedin_url, scrape_linkedin_profile

router = APIRouter()


@router.post("/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    """
    Full pipeline:
    1. Extract text from uploaded file (any format)
    2. Parse fields using GPT-4
    3. Auto-discover LinkedIn URL
    4. Scrape LinkedIn profile
    5. Cross-verify with AI
    6. Return structured analysis report
    """

    # ── Step 1: Extract text from file ──────────────────────────────────────
    extraction = await extract_text_from_file(file)
    if not extraction["success"]:
        raise HTTPException(status_code=422, detail={
            "step": "extraction",
            "error": extraction["error"],
            "format": extraction["format_detected"]
        })

    raw_text = extraction["text"]
    file_format = extraction["format_detected"]

    # ── Step 2: AI field extraction ─────────────────────────────────────────
    resume_data = extract_resume_fields(raw_text)
    if "error" in resume_data:
        raise HTTPException(status_code=500, detail={
            "step": "ai_extraction",
            "error": resume_data["error"]
        })

    # ── Step 3: Find LinkedIn URL ────────────────────────────────────────────
    linkedin_url = resume_data.get("linkedin_url")
    linkedin_source = "resume"
    linkedin_confidence = "high" if linkedin_url else None

    if not linkedin_url:
        linkedin_search = find_linkedin_url(
            full_name=resume_data.get("full_name", ""),
            company=resume_data.get("current_company", ""),
            title=resume_data.get("current_title", "")
        )
        linkedin_url = linkedin_search.get("url")
        linkedin_source = "auto_discovered"
        linkedin_confidence = linkedin_search.get("confidence", "low")

    # ── Step 4: Scrape LinkedIn ──────────────────────────────────────────────
    linkedin_result = {"success": False, "data": {}, "error": "No LinkedIn URL found"}
    if linkedin_url:
        linkedin_result = scrape_linkedin_profile(linkedin_url)

    linkedin_data = linkedin_result.get("data", {})

    # ── Step 5: AI cross-verification ────────────────────────────────────────
    if linkedin_data:
        analysis = verify_resume_vs_linkedin(resume_data, linkedin_data)
    else:
        # Can't verify — no LinkedIn data available
        analysis = {
            "overall_verdict": "SUSPICIOUS",
            "confidence_score": 40,
            "authenticity_percentage": 40,
            "checks": [],
            "red_flags": ["LinkedIn profile could not be found or scraped"],
            "positive_signals": [],
            "manipulation_indicators": [],
            "employment_gaps": [],
            "summary": "Could not retrieve LinkedIn data for verification. Manual review recommended."
        }

    # ── Step 6: Return full report ───────────────────────────────────────────
    return JSONResponse(content={
        "file_format": file_format,
        "resume_data": resume_data,
        "linkedin": {
            "url": linkedin_url,
            "source": linkedin_source,
            "confidence": linkedin_confidence,
            "data": linkedin_data,
            "scrape_success": linkedin_result.get("success", False),
            "scrape_error": linkedin_result.get("error")
        },
        "analysis": analysis,
        "raw_text_preview": raw_text[:500] + "..." if len(raw_text) > 500 else raw_text
    })


@router.post("/extract-only")
async def extract_only(file: UploadFile = File(...)):
    """Extract text and parse fields only — no LinkedIn verification."""
    extraction = await extract_text_from_file(file)
    if not extraction["success"]:
        raise HTTPException(status_code=422, detail=extraction["error"])

    resume_data = extract_resume_fields(extraction["text"])
    return {"file_format": extraction["format_detected"], "resume_data": resume_data}
