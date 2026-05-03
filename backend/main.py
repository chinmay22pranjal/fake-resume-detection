from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import resume, linkedin, report

app = FastAPI(
    title="Fake Resume Detector API",
    description="AI-powered resume authenticity verification system",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router, prefix="/api/resume", tags=["Resume"])
app.include_router(linkedin.router, prefix="/api/linkedin", tags=["LinkedIn"])
app.include_router(report.router, prefix="/api/report", tags=["Report"])

@app.get("/")
def root():
    return {"message": "Fake Resume Detector API is running!", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "healthy"}
