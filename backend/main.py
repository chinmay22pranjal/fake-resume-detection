from fastapi import FastAPI
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
from fastapi import UploadFile, File

@app.post("/api/resume/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    content = await file.read()

    return {
        "filename": file.filename,
        "size": len(content),
        "message": "File received successfully",
        "status": "ok"
    }
