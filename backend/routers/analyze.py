from fastapi import APIRouter, UploadFile
from services.resume_extractor import extract_text
from services.ai_parser import parse_resume, verify_resume
from services.linkedin_service import find_linkedin, scrape_linkedin

router = APIRouter()

@router.post("/")
async def analyze(file: UploadFile):
    extracted = await extract_text(file)

    if not extracted["success"]:
        return {"error": extracted.get("error", "Extraction failed")}

    resume_data = parse_resume(extracted["text"])

    linkedin_info = find_linkedin(resume_data.get("name", "user"))
    linkedin_data = scrape_linkedin(linkedin_info["url"])

    analysis = verify_resume(resume_data, linkedin_data)

    return {
        "resume_data": resume_data,
        "linkedin": {
            "url": linkedin_info["url"],
            "confidence": linkedin_info["confidence"],
            "data": linkedin_data
        },
        "analysis": analysis
    }
