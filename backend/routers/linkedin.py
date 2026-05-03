"""routers/linkedin.py — Manual LinkedIn lookup endpoint"""
from fastapi import APIRouter
from pydantic import BaseModel
from services.linkedin_service import find_linkedin_url, scrape_linkedin_profile

router = APIRouter()

class SearchRequest(BaseModel):
    full_name: str
    company: str = ""
    title: str = ""

class ScrapeRequest(BaseModel):
    linkedin_url: str

@router.post("/find")
def find_profile(req: SearchRequest):
    return find_linkedin_url(req.full_name, req.company, req.title)

@router.post("/scrape")
def scrape_profile(req: ScrapeRequest):
    return scrape_linkedin_profile(req.linkedin_url)
