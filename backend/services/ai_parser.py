"""
ai_parser.py
Uses OpenAI GPT-4 to extract structured data from resume text
and cross-verify with LinkedIn data to detect fake/manipulated resumes.
"""

import json
import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

EXTRACT_PROMPT = """
You are an expert resume parser. Extract all information from the resume text below.
Return ONLY a valid JSON object with no extra text, using this exact schema:

{
  "full_name": "string",
  "email": "string or null",
  "phone": "string or null",
  "location": "string or null",
  "linkedin_url": "string or null (if URL present in resume)",
  "current_title": "string or null",
  "current_company": "string or null",
  "total_years_experience": "number or null",
  "skills": ["list of skills"],
  "education": [
    { "degree": "string", "institution": "string", "year": "string or null", "field": "string or null" }
  ],
  "experience": [
    { "title": "string", "company": "string", "start_date": "string", "end_date": "string", "duration": "string", "description": "string" }
  ],
  "certifications": ["list of certifications"],
  "languages": ["list of languages"],
  "summary": "string or null"
}

Resume text:
"""

VERIFY_PROMPT = """
You are an expert fraud detection AI specializing in resume verification.
You will compare a resume's data with LinkedIn profile data and detect any manipulation, inflation, or falsification.

Analyze every field carefully. Look for:
- Title inflation (e.g., "Junior Developer" → "Senior Engineer")
- Fake companies or companies not on LinkedIn history
- Date manipulation (extended tenure, fake dates)
- Degree fraud (claiming degrees not on LinkedIn)
- Skills padding (listing skills with no LinkedIn evidence)
- Employment gap hiding
- Experience year inconsistencies (graduated 2020 but claims 10 years experience)
- Statistical anomalies in career progression

Return ONLY a valid JSON object with this exact schema:

{
  "overall_verdict": "GENUINE | SUSPICIOUS | FAKE",
  "confidence_score": 0-100,
  "authenticity_percentage": 0-100,
  "checks": [
    {
      "field": "field name",
      "resume_value": "what resume says",
      "linkedin_value": "what LinkedIn shows",
      "match": true/false,
      "severity": "low | medium | high",
      "note": "explanation"
    }
  ],
  "red_flags": ["list of specific red flags found"],
  "positive_signals": ["list of things that check out"],
  "manipulation_indicators": ["specific signs of manipulation"],
  "employment_gaps": ["any gaps detected"],
  "summary": "2-3 sentence overall assessment"
}

Verdict rules:
- 85-100 confidence → GENUINE
- 60-84 confidence → SUSPICIOUS  
- 0-59 confidence → FAKE

Resume Data (JSON):
{resume_data}

LinkedIn Data (JSON):
{linkedin_data}
"""


def extract_resume_fields(raw_text: str) -> dict:
    """Use GPT-4 to extract structured fields from raw resume text."""
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a precise resume parser. Always return valid JSON only."},
                {"role": "user", "content": EXTRACT_PROMPT + raw_text}
            ],
            temperature=0.1,
            max_tokens=2000
        )
        raw_json = response.choices[0].message.content.strip()
        # Clean markdown fences if present
        raw_json = raw_json.replace("```json", "").replace("```", "").strip()
        return json.loads(raw_json)
    except json.JSONDecodeError as e:
        return {"error": f"JSON parse error: {str(e)}", "raw": raw_json}
    except Exception as e:
        return {"error": str(e)}


def verify_resume_vs_linkedin(resume_data: dict, linkedin_data: dict) -> dict:
    """Cross-verify resume data against LinkedIn data using GPT-4."""
    try:
        prompt = VERIFY_PROMPT.replace(
            "{resume_data}", json.dumps(resume_data, indent=2)
        ).replace(
            "{linkedin_data}", json.dumps(linkedin_data, indent=2)
        )

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a fraud detection expert. Return valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
            max_tokens=3000
        )
        raw_json = response.choices[0].message.content.strip()
        raw_json = raw_json.replace("```json", "").replace("```", "").strip()
        return json.loads(raw_json)
    except json.JSONDecodeError as e:
        return {"error": f"JSON parse error: {str(e)}"}
    except Exception as e:
        return {"error": str(e)}
