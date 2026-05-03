from fastapi import APIRouter, UploadFile, File

router = APIRouter()

@router.post("/api/resume/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    return {
        "status": "success",
        "message": "Resume analyzed successfully",
        "filename": file.filename
    }
