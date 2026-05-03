from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import router
from routers.analyze import router as analyze_router

# Create app
app = FastAPI(title="Fake Resume Detection API")

# Enable CORS (VERY IMPORTANT for frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Allow all (you can restrict later)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(analyze_router)

# Root endpoint
@app.get("/")
def root():
    return {
        "message": "Backend Running Successfully 🚀"
    }

# Health check (for Render)
@app.get("/health")
def health():
    return {
        "status": "ok"
    }
