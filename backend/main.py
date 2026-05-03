from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend Running"}

@app.get("/health")
def health():
    return {"status": "ok"}

# 🔥 THIS IS THE IMPORTANT API
@app.post("/api/resume/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    return {
        "success": True,
        "filename": file.filename,
        "message": "Analysis working!"
    }
