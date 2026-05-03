"""
linkedin_service.py
Step 1: Auto-discover LinkedIn profile URL from resume data using SerpAPI
Step 2: Scrape LinkedIn profile data using Proxycurl API
"""

import os
import requests


SERPAPI_KEY = os.getenv("SERPAPI_KEY", "")
PROXYCURL_API_KEY = os.getenv("PROXYCURL_API_KEY", "")


# ── AUTO-DISCOVER LINKEDIN URL ────────────────────────────────────────────────
def find_linkedin_url(full_name: str, company: str = "", title: str = "") -> dict:
    """
    Search Google via SerpAPI to find the most likely LinkedIn profile URL.
    Returns { url, confidence, all_results }
    """
    if not SERPAPI_KEY:
        return {
            "url": None,
            "confidence": "none",
            "error": "SERPAPI_KEY not configured. Set it in your .env file.",
            "all_results": []
        }

    query_parts = [full_name]
    if title:
        query_parts.append(title)
    if company:
        query_parts.append(company)
    query_parts.append("site:linkedin.com/in")
    query = " ".join(query_parts)

    try:
        resp = requests.get(
            "https://serpapi.com/search",
            params={
                "engine": "google",
                "q": query,
                "api_key": SERPAPI_KEY,
                "num": 5
            },
            timeout=15
        )
        resp.raise_for_status()
        data = resp.json()

        results = []
        for item in data.get("organic_results", []):
            link = item.get("link", "")
            if "linkedin.com/in/" in link:
                results.append({
                    "url": link,
                    "title": item.get("title", ""),
                    "snippet": item.get("snippet", "")
                })

        if not results:
            return {"url": None, "confidence": "none", "error": "No LinkedIn profile found in search results.", "all_results": []}

        # Score the top result
        top = results[0]
        name_lower = full_name.lower()
        slug = top["url"].split("/in/")[-1].replace("-", " ").lower().strip("/")
        name_parts = name_lower.split()
        match_count = sum(1 for part in name_parts if part in slug)
        confidence = "high" if match_count >= 2 else ("medium" if match_count == 1 else "low")

        return {
            "url": top["url"],
            "confidence": confidence,
            "all_results": results,
            "error": None
        }

    except requests.RequestException as e:
        return {"url": None, "confidence": "none", "error": str(e), "all_results": []}


# ── SCRAPE LINKEDIN PROFILE ───────────────────────────────────────────────────
def scrape_linkedin_profile(linkedin_url: str) -> dict:
    """
    Fetch LinkedIn profile data using Proxycurl API.
    Returns structured profile dict or error.
    """
    if not PROXYCURL_API_KEY:
        return {
            "success": False,
            "error": "PROXYCURL_API_KEY not configured. Set it in your .env file.",
            "data": mock_linkedin_fallback(linkedin_url)
        }

    try:
        resp = requests.get(
            "https://nubela.co/proxycurl/api/v2/linkedin",
            params={"url": linkedin_url, "use_cache": "if-recent"},
            headers={"Authorization": f"Bearer {PROXYCURL_API_KEY}"},
            timeout=20
        )

        if resp.status_code == 404:
            return {"success": False, "error": "LinkedIn profile not found or private.", "data": {}}
        if resp.status_code == 403:
            return {"success": False, "error": "Proxycurl quota exceeded or invalid key.", "data": {}}

        resp.raise_for_status()
        raw = resp.json()

        # Normalize to our internal schema
        profile = {
            "full_name": raw.get("full_name", ""),
            "headline": raw.get("headline", ""),
            "location": raw.get("city", "") + (", " + raw.get("country_full_name", "") if raw.get("country_full_name") else ""),
            "summary": raw.get("summary", ""),
            "profile_pic_url": raw.get("profile_pic_url", ""),
            "connections": raw.get("connections", 0),
            "current_company": raw.get("experiences", [{}])[0].get("company", "") if raw.get("experiences") else "",
            "current_title": raw.get("experiences", [{}])[0].get("title", "") if raw.get("experiences") else "",
            "skills": [s.get("name", "") for s in raw.get("skills", [])],
            "education": [
                {
                    "degree": e.get("degree_name", ""),
                    "field": e.get("field_of_study", ""),
                    "institution": e.get("school", ""),
                    "start_year": str(e.get("starts_at", {}).get("year", "")) if e.get("starts_at") else "",
                    "end_year": str(e.get("ends_at", {}).get("year", "")) if e.get("ends_at") else "Present"
                }
                for e in raw.get("education", [])
            ],
            "experience": [
                {
                    "title": exp.get("title", ""),
                    "company": exp.get("company", ""),
                    "start_date": f"{exp.get('starts_at', {}).get('month', '')}/{exp.get('starts_at', {}).get('year', '')}" if exp.get("starts_at") else "",
                    "end_date": f"{exp.get('ends_at', {}).get('month', '')}/{exp.get('ends_at', {}).get('year', '')}" if exp.get("ends_at") else "Present",
                    "description": exp.get("description", "")
                }
                for exp in raw.get("experiences", [])
            ],
            "certifications": [c.get("name", "") for c in raw.get("certifications", [])],
            "languages": [lang.get("name", "") for lang in raw.get("languages", [])],
        }
        return {"success": True, "data": profile, "error": None}

    except requests.RequestException as e:
        return {"success": False, "error": str(e), "data": {}}


def mock_linkedin_fallback(url: str) -> dict:
    """
    Returns a mock LinkedIn profile for local testing when API keys are missing.
    Remove this in production.
    """
    return {
        "full_name": "Demo User",
        "headline": "Software Engineer at Demo Corp",
        "current_title": "Software Engineer",
        "current_company": "Demo Corp",
        "location": "Bangalore, India",
        "skills": ["Python", "JavaScript", "React", "SQL"],
        "education": [{"degree": "B.Tech", "institution": "IIT Delhi", "field": "Computer Science", "end_year": "2018"}],
        "experience": [
            {"title": "Software Engineer", "company": "Demo Corp", "start_date": "1/2020", "end_date": "Present"},
            {"title": "Junior Developer", "company": "StartupXYZ", "start_date": "6/2018", "end_date": "12/2019"}
        ],
        "certifications": [],
        "connections": 312,
        "_note": "This is mock data. Configure PROXYCURL_API_KEY for real LinkedIn scraping."
    }
