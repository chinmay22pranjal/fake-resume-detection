import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const MOCK_RESULTS = {
  overallScore: 34,
  riskLevel: "High Risk",
  riskColor: "#ff6b6b",
  candidateName: "Rajesh Kumar",
  position: "Senior Software Engineer",
  scanDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),

  sections: [
    {
      id: "linkedin",
      icon: "🔗",
      title: "LinkedIn Verification",
      score: 28,
      status: "fail",
      color: "#ff6b6b",
      findings: [
        { type: "error", label: "Job Title Mismatch", detail: "Resume: 'Senior Dev Manager' | LinkedIn: 'Junior Developer'" },
        { type: "error", label: "Employment Gap", detail: "18-month gap (Jan 2021 – Jun 2022) not on resume" },
        { type: "warning", label: "Connection Count", detail: "Only 12 LinkedIn connections for claimed 8yr experience" },
        { type: "success", label: "Education Match", detail: "B.Tech from IIT Delhi — verified ✓" },
      ],
    },
    {
      id: "roc",
      icon: "🏢",
      title: "ROC Company Verification",
      score: 15,
      status: "fail",
      color: "#ff6b6b",
      findings: [
        { type: "error", label: "Company Not Found", detail: "'TechNova Solutions' — not registered in MCA database" },
        { type: "error", label: "Dissolved Company", detail: "'CloudPeak Pvt Ltd' — dissolved in 2019, claimed 2020–2022" },
        { type: "success", label: "Infosys Verified", detail: "Employment at Infosys 2018–2019 — confirmed ✓" },
      ],
    },
    {
      id: "dates",
      icon: "📅",
      title: "Date & Timeline Analysis",
      score: 60,
      status: "warning",
      color: "#ffd166",
      findings: [
        { type: "warning", label: "Overlapping Roles", detail: "2 simultaneous full-time positions claimed (Jul–Dec 2020)" },
        { type: "success", label: "Recent Role Valid", detail: "Current role at Wipro — dates consistent" },
        { type: "success", label: "Education Timeline OK", detail: "No anomalies detected" },
      ],
    },
    {
      id: "skills",
      icon: "🎯",
      title: "Skills & Credentials",
      score: 72,
      status: "warning",
      color: "#ffd166",
      findings: [
        { type: "warning", label: "Skill Exaggeration", detail: "'10 years React experience' but React released 2013 (11yr max)" },
        { type: "success", label: "Certifications Valid", detail: "AWS Certified — verified via credential ID" },
        { type: "success", label: "Programming Languages", detail: "GitHub activity confirms Python, JavaScript usage" },
      ],
    },
    {
      id: "digital",
      icon: "🌐",
      title: "Digital Footprint",
      score: 55,
      status: "warning",
      color: "#ffd166",
      findings: [
        { type: "success", label: "GitHub Activity", detail: "Active repo, consistent with claimed skills" },
        { type: "warning", label: "Low Online Presence", detail: "No portfolio, blog, or conference talks for 'Senior' role" },
        { type: "success", label: "Email Domain Valid", detail: "Professional email verified" },
      ],
    },
    {
      id: "ai",
      icon: "🧠",
      title: "AI Language Analysis",
      score: 88,
      status: "pass",
      color: "#06d6a0",
      findings: [
        { type: "success", label: "Authentic Writing Style", detail: "Resume shows genuine personal voice, not AI-generated" },
        { type: "success", label: "No Template Fraud", detail: "Document is original, not a copy of known fake templates" },
        { type: "warning", label: "Minor Inconsistency", detail: "Formatting inconsistency in 2017–2018 section" },
      ],
    },
  ],

  redFlags: [
    "Company 'TechNova Solutions' does not exist in any registry",
    "Resume shows 18-month gap deliberately hidden",
    "Simultaneous full-time employment claimed for 6 months",
    "LinkedIn title contradicts resume title significantly",
  ],
  greenFlags: [
    "Education credentials independently verified",
    "AWS certification number is valid",
    "GitHub activity matches claimed technical skills",
    "Latest employer (Wipro) is legitimate and employment dates match",
  ],
};

function ScoreRing({ score, color, size = 140 }) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = () => {
      start += 2;
      if (start <= score) {
        setAnimated(start);
        requestAnimationFrame(step);
      } else {
        setAnimated(score);
      }
    };
    const timer = setTimeout(() => requestAnimationFrame(step), 500);
    return () => clearTimeout(timer);
  }, [score]);

  const offset = circumference * (1 - animated / 100);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`Score: ${score} out of 100`}>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
      <circle
        cx={size/2} cy={size/2} r={radius}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: "none", filter: `drop-shadow(0 0 8px ${color}60)` }}
      />
      <text x={size/2} y={size/2 - 6} textAnchor="middle" fill={color} fontSize="26" fontWeight="800" fontFamily="Sora, sans-serif">
        {animated}
      </text>
      <text x={size/2} y={size/2 + 16} textAnchor="middle" fill="currentColor" fontSize="11" opacity="0.5" fontFamily="DM Sans, sans-serif">
        Trust Score
      </text>
    </svg>
  );
}

export default function ResultsPage({ theme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { fileName = "Resume.pdf" } = location.state || {};
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSection, setExpandedSection] = useState(null);
  const [copied, setCopied] = useState(false);
  const isDark = theme === "dark";
  const r = MOCK_RESULTS;

  const handleCopyReport = () => {
    const summary = `Resume Fraud Detection Report\nCandidate: ${r.candidateName}\nTrust Score: ${r.overallScore}/100\nRisk Level: ${r.riskLevel}\nDate: ${r.scanDate}`;
    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => window.print();

  return (
    <div className={`rp-page ${isDark ? "dark" : "light"}`}>
      {/* BG */}
      <div className="rp-bg" aria-hidden="true">
        <div className="rp-bg__orb rp-bg__orb--1" style={{ background: r.riskColor }} />
        <div className="rp-bg__orb rp-bg__orb--2" />
        <div className="rp-bg__grid" />
      </div>

      <div className="rp-container">

        {/* ===== TOP BAR ===== */}
        <div className="rp-topbar">
          <button className="rp-back-btn" onClick={() => navigate("/")} aria-label="Analyze another resume">
            ← Analyze Another
          </button>
          <div className="rp-topbar__actions">
            <button className="rp-action-btn" onClick={handleCopyReport} aria-label="Copy report summary">
              {copied ? "✓ Copied!" : "📋 Copy"}
            </button>
            <button className="rp-action-btn" onClick={handlePrint} aria-label="Print report">
              🖨️ Print
            </button>
            <button className="rp-action-btn rp-action-btn--primary" aria-label="Download full PDF report">
              ⬇ Download PDF
            </button>
          </div>
        </div>

        {/* ===== HERO SCORE ===== */}
        <section className="rp-hero" aria-labelledby="results-heading">
          <div className="rp-hero__score">
            <div className={`rp-risk-badge rp-risk-badge--${r.riskLevel.split(" ")[0].toLowerCase()}`} role="status" aria-label={`Risk level: ${r.riskLevel}`}>
              {r.riskLevel === "High Risk" ? "🚨" : r.riskLevel === "Medium Risk" ? "⚠️" : "✅"} {r.riskLevel}
            </div>
            <ScoreRing score={r.overallScore} color={r.riskColor} size={160} />
            <div className="rp-hero__score-label">
              This resume shows <strong style={{ color: r.riskColor }}>significant red flags</strong>
            </div>
          </div>

          <div className="rp-hero__info">
            <div className="rp-hero__meta">
              <div className="rp-meta-row">
                <span className="rp-meta-label">Candidate</span>
                <span className="rp-meta-value">{r.candidateName}</span>
              </div>
              <div className="rp-meta-row">
                <span className="rp-meta-label">Applied For</span>
                <span className="rp-meta-value">{r.position}</span>
              </div>
              <div className="rp-meta-row">
                <span className="rp-meta-label">File Scanned</span>
                <span className="rp-meta-value">📄 {fileName}</span>
              </div>
              <div className="rp-meta-row">
                <span className="rp-meta-label">Scan Date</span>
                <span className="rp-meta-value">{r.scanDate}</span>
              </div>
            </div>

            {/* Section score bars */}
            <div className="rp-section-bars" aria-label="Section scores">
              {r.sections.map((sec) => (
                <div key={sec.id} className="rp-sec-bar" aria-label={`${sec.title}: ${sec.score}%`}>
                  <div className="rp-sec-bar__top">
                    <span>{sec.icon} {sec.title}</span>
                    <span style={{ color: sec.color, fontWeight: 700 }}>{sec.score}%</span>
                  </div>
                  <div className="rp-sec-bar__track">
                    <div className="rp-sec-bar__fill" style={{ width: `${sec.score}%`, background: sec.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== VERDICT BOXES ===== */}
        <div className="rp-verdict-grid">
          <div className="rp-verdict rp-verdict--red" role="alert" aria-label="Red flags detected">
            <div className="rp-verdict__header">
              <span>🚨</span>
              <h3>Red Flags ({r.redFlags.length})</h3>
            </div>
            <ul className="rp-verdict__list" role="list">
              {r.redFlags.map((flag, i) => (
                <li key={i} className="rp-verdict__item" role="listitem">
                  <span className="rp-verdict__dot rp-verdict__dot--red" aria-hidden="true" />
                  {flag}
                </li>
              ))}
            </ul>
          </div>
          <div className="rp-verdict rp-verdict--green" aria-label="Verified items">
            <div className="rp-verdict__header">
              <span>✅</span>
              <h3>Verified ({r.greenFlags.length})</h3>
            </div>
            <ul className="rp-verdict__list" role="list">
              {r.greenFlags.map((flag, i) => (
                <li key={i} className="rp-verdict__item" role="listitem">
                  <span className="rp-verdict__dot rp-verdict__dot--green" aria-hidden="true" />
                  {flag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ===== TABS ===== */}
        <div className="rp-tabs" role="tablist" aria-label="Report sections">
          {["overview", "details", "recommendation"].map((tab) => (
            <button
              key={tab}
              className={`rp-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`panel-${tab}`}
            >
              {tab === "overview" ? "📊 Overview" : tab === "details" ? "🔍 Detailed Findings" : "💡 Recommendation"}
            </button>
          ))}
        </div>

        {/* ===== TAB PANELS ===== */}
        <div id={`panel-${activeTab}`} role="tabpanel" aria-label={`${activeTab} panel`} className="rp-panel">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="rp-overview">
              <div className="rp-overview__summary">
                <div className="rp-summary-card rp-summary-card--alert">
                  <div className="rp-summary-icon">🚨</div>
                  <div>
                    <div className="rp-summary-title">Do NOT Proceed</div>
                    <div className="rp-summary-desc">This resume contains multiple fabrications. We strongly recommend rejection pending further investigation.</div>
                  </div>
                </div>
              </div>
              <div className="rp-overview__grid">
                {[
                  { label: "Sections Failed", val: r.sections.filter(s=>s.status==="fail").length, icon: "❌", color: "#ff6b6b" },
                  { label: "Warnings", val: r.sections.filter(s=>s.status==="warning").length, icon: "⚠️", color: "#ffd166" },
                  { label: "Passed", val: r.sections.filter(s=>s.status==="pass").length, icon: "✅", color: "#06d6a0" },
                  { label: "Total Checks", val: r.sections.reduce((a,s)=>a+s.findings.length, 0), icon: "🔍", color: "#00f5d4" },
                ].map((m) => (
                  <div key={m.label} className="rp-overview__metric" style={{ borderColor: `${m.color}30` }}>
                    <span className="rp-overview__metric-icon" style={{ color: m.color }}>{m.icon}</span>
                    <span className="rp-overview__metric-val" style={{ color: m.color }}>{m.val}</span>
                    <span className="rp-overview__metric-label">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DETAILS */}
          {activeTab === "details" && (
            <div className="rp-details">
              {r.sections.map((sec) => (
                <div key={sec.id} className="rp-section">
                  <button
                    className="rp-section__header"
                    onClick={() => setExpandedSection(expandedSection === sec.id ? null : sec.id)}
                    aria-expanded={expandedSection === sec.id}
                    aria-controls={`sec-${sec.id}`}
                  >
                    <div className="rp-section__left">
                      <span className="rp-section__icon" aria-hidden="true">{sec.icon}</span>
                      <span className="rp-section__title">{sec.title}</span>
                      <span className={`rp-section__status rp-section__status--${sec.status}`} aria-label={`Status: ${sec.status}`}>
                        {sec.status === "pass" ? "✅ Pass" : sec.status === "warning" ? "⚠️ Warning" : "❌ Fail"}
                      </span>
                    </div>
                    <div className="rp-section__right">
                      <span className="rp-section__score" style={{ color: sec.color }}>{sec.score}%</span>
                      <svg className={`rp-section__chevron ${expandedSection === sec.id ? "rotated" : ""}`} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  </button>

                  {expandedSection === sec.id && (
                    <div className="rp-section__body" id={`sec-${sec.id}`} role="region">
                      {sec.findings.map((finding, i) => (
                        <div key={i} className={`rp-finding rp-finding--${finding.type}`} role="listitem">
                          <div className="rp-finding__icon" aria-hidden="true">
                            {finding.type === "error" ? "❌" : finding.type === "warning" ? "⚠️" : "✅"}
                          </div>
                          <div>
                            <div className="rp-finding__label">{finding.label}</div>
                            <div className="rp-finding__detail">{finding.detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* RECOMMENDATION */}
          {activeTab === "recommendation" && (
            <div className="rp-rec">
              <div className="rp-rec__verdict">
                <div className="rp-rec__verdict-icon">🚫</div>
                <div className="rp-rec__verdict-text">
                  <h3>Recommendation: Reject Application</h3>
                  <p>Based on our analysis, this resume contains material falsehoods across multiple sections. The trust score of <strong style={{ color: "#ff6b6b" }}>{r.overallScore}/100</strong> places this in the <strong>High Risk</strong> category.</p>
                </div>
              </div>

              <div className="rp-rec__steps">
                <h4>Suggested Next Steps</h4>
                {[
                  { num: "01", title: "Do Not Advance", desc: "Do not schedule interviews until discrepancies are resolved.", icon: "🛑" },
                  { num: "02", title: "Request Explanation", desc: "Ask the candidate to explain the employment gap and company name discrepancies.", icon: "💬" },
                  { num: "03", title: "Contact References", desc: "Independently verify references from Infosys (only confirmed employer).", icon: "📞" },
                  { num: "04", title: "Document Verification", desc: "Request original offer letters, payslips, and relieving letters.", icon: "📋" },
                  { num: "05", title: "Flag in System", desc: "Mark this candidate profile for future reference to prevent re-application.", icon: "🚩" },
                ].map((step) => (
                  <div key={step.num} className="rp-rec__step">
                    <div className="rp-rec__step-num">{step.num}</div>
                    <div className="rp-rec__step-icon">{step.icon}</div>
                    <div>
                      <div className="rp-rec__step-title">{step.title}</div>
                      <div className="rp-rec__step-desc">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rp-rec__disclaimer">
                ⚠️ This report is AI-generated and should be used as a screening tool only. Final hiring decisions should involve human judgment and official background verification processes.
              </div>
            </div>
          )}
        </div>

        {/* ===== RESCAN FOOTER ===== */}
        <div className="rp-footer">
          <button className="rp-footer__btn" onClick={() => navigate("/")} aria-label="Scan another resume">
            🔍 Scan Another Resume
          </button>
          <span className="rp-footer__tagline">Powered by ResumeVerify AI — Protecting Hiring Integrity</span>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .rp-page {
          min-height: 100vh;
          font-family: 'DM Sans', 'Segoe UI', sans-serif;
          padding-top: 73px;
          position: relative;
        }
        .rp-page.dark { background: #080815; color: #e2e8f0; }
        .rp-page.light { background: #f0f4f8; color: #1a1a2e; }

        /* BG */
        .rp-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .rp-bg__grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(255,107,107,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,107,107,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .rp-bg__orb {
          position: absolute; border-radius: 50%;
          filter: blur(100px); opacity: 0.08;
        }
        .rp-bg__orb--1 { width: 600px; height: 600px; top: 0; right: -100px; }
        .rp-bg__orb--2 { width: 400px; height: 400px; background: #7c3aed; bottom: 0; left: -100px; }

        .rp-container {
          max-width: 1100px; margin: 0 auto;
          padding: 32px 24px 80px;
          position: relative; z-index: 1;
          display: flex; flex-direction: column; gap: 32px;
        }

        /* TOPBAR */
        .rp-topbar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .rp-back-btn {
          background: none; border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 10px; padding: 8px 16px;
          font-size: 0.85rem; font-weight: 600; color: inherit;
          cursor: pointer; transition: all 0.2s;
        }
        .rp-page.light .rp-back-btn { border-color: rgba(0,0,0,0.1); }
        .rp-back-btn:hover { border-color: #00f5d4; color: #00f5d4; }
        .rp-topbar__actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .rp-action-btn {
          padding: 8px 14px; border-radius: 10px;
          font-size: 0.82rem; font-weight: 600; cursor: pointer;
          border: 1.5px solid rgba(255,255,255,0.1);
          background: none; color: inherit; transition: all 0.2s;
        }
        .rp-page.light .rp-action-btn { border-color: rgba(0,0,0,0.1); }
        .rp-action-btn:hover { border-color: #00f5d4; color: #00f5d4; }
        .rp-action-btn--primary {
          background: linear-gradient(135deg, #00f5d4, #7c3aed);
          border: none; color: #fff;
          box-shadow: 0 2px 12px rgba(0,245,212,0.3);
        }
        .rp-action-btn--primary:hover { transform: translateY(-1px); color: #fff; }

        /* HERO SCORE */
        .rp-hero {
          display: grid; grid-template-columns: auto 1fr;
          gap: 40px; align-items: start;
          padding: 36px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
        }
        .rp-page.light .rp-hero { background: #fff; border-color: rgba(0,0,0,0.06); box-shadow: 0 4px 24px rgba(0,0,0,0.05); }
        .rp-hero__score { display: flex; flex-direction: column; align-items: center; gap: 14px; min-width: 180px; }
        .rp-risk-badge {
          padding: 6px 14px; border-radius: 100px;
          font-size: 0.78rem; font-weight: 700;
          letter-spacing: 0.3px;
        }
        .rp-risk-badge--high {
          background: rgba(255,107,107,0.12);
          border: 1px solid rgba(255,107,107,0.3);
          color: #ff6b6b;
        }
        .rp-risk-badge--medium {
          background: rgba(255,209,102,0.12);
          border: 1px solid rgba(255,209,102,0.3);
          color: #ffd166;
        }
        .rp-risk-badge--low {
          background: rgba(6,214,160,0.12);
          border: 1px solid rgba(6,214,160,0.3);
          color: #06d6a0;
        }
        .rp-hero__score-label { font-size: 0.8rem; text-align: center; opacity: 0.7; max-width: 160px; line-height: 1.5; }

        .rp-hero__info { display: flex; flex-direction: column; gap: 24px; }
        .rp-hero__meta { display: flex; flex-direction: column; gap: 10px; }
        .rp-meta-row { display: flex; align-items: center; gap: 12px; }
        .rp-meta-label { font-size: 0.75rem; opacity: 0.5; width: 90px; flex-shrink: 0; }
        .rp-meta-value { font-size: 0.9rem; font-weight: 600; }

        .rp-section-bars { display: flex; flex-direction: column; gap: 10px; }
        .rp-sec-bar { display: flex; flex-direction: column; gap: 4px; }
        .rp-sec-bar__top { display: flex; justify-content: space-between; font-size: 0.75rem; opacity: 0.7; }
        .rp-sec-bar__track { height: 5px; border-radius: 3px; background: rgba(255,255,255,0.06); overflow: hidden; }
        .rp-page.light .rp-sec-bar__track { background: rgba(0,0,0,0.06); }
        .rp-sec-bar__fill { height: 100%; border-radius: 3px; transition: width 1s ease; }

        /* VERDICT GRID */
        .rp-verdict-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .rp-verdict { padding: 24px; border-radius: 20px; }
        .rp-verdict--red {
          background: rgba(255,107,107,0.06);
          border: 1px solid rgba(255,107,107,0.2);
        }
        .rp-verdict--green {
          background: rgba(6,214,160,0.06);
          border: 1px solid rgba(6,214,160,0.2);
        }
        .rp-verdict__header { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
        .rp-verdict__header h3 { font-family: 'Sora', sans-serif; font-size: 0.95rem; font-weight: 700; }
        .rp-verdict__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .rp-verdict__item { display: flex; align-items: flex-start; gap: 10px; font-size: 0.82rem; line-height: 1.5; opacity: 0.85; }
        .rp-verdict__dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; margin-top: 6px; }
        .rp-verdict__dot--red { background: #ff6b6b; }
        .rp-verdict__dot--green { background: #06d6a0; }

        /* TABS */
        .rp-tabs {
          display: flex; gap: 4px;
          padding: 6px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          width: fit-content;
        }
        .rp-page.light .rp-tabs { background: rgba(0,0,0,0.03); border-color: rgba(0,0,0,0.06); }
        .rp-tab {
          padding: 10px 20px; border-radius: 10px;
          font-size: 0.85rem; font-weight: 600;
          border: none; background: none; color: inherit;
          cursor: pointer; transition: all 0.2s; opacity: 0.6;
        }
        .rp-tab.active {
          background: linear-gradient(135deg, #00f5d4, #7c3aed);
          color: #fff; opacity: 1;
          box-shadow: 0 2px 12px rgba(0,245,212,0.25);
        }
        .rp-tab:hover:not(.active) { opacity: 1; background: rgba(0,245,212,0.06); }

        /* PANEL */
        .rp-panel { animation: panelIn 0.3s ease both; }
        @keyframes panelIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        /* OVERVIEW */
        .rp-overview { display: flex; flex-direction: column; gap: 24px; }
        .rp-summary-card {
          display: flex; align-items: flex-start; gap: 16px;
          padding: 20px 24px; border-radius: 16px;
        }
        .rp-summary-card--alert {
          background: rgba(255,107,107,0.06);
          border: 1px solid rgba(255,107,107,0.2);
        }
        .rp-summary-icon { font-size: 2rem; flex-shrink: 0; }
        .rp-summary-title { font-family: 'Sora', sans-serif; font-size: 1rem; font-weight: 700; margin-bottom: 6px; }
        .rp-summary-desc { font-size: 0.85rem; opacity: 0.75; line-height: 1.6; }
        .rp-overview__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .rp-overview__metric {
          display: flex; flex-direction: column; align-items: center;
          padding: 20px; border-radius: 14px;
          border: 1px solid; gap: 6px;
          background: rgba(255,255,255,0.02);
          transition: transform 0.2s;
        }
        .rp-overview__metric:hover { transform: translateY(-2px); }
        .rp-overview__metric-icon { font-size: 1.5rem; }
        .rp-overview__metric-val { font-family: 'Sora', sans-serif; font-size: 2rem; font-weight: 800; }
        .rp-overview__metric-label { font-size: 0.72rem; opacity: 0.55; text-align: center; }

        /* DETAILS */
        .rp-details { display: flex; flex-direction: column; gap: 8px; }
        .rp-section {
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.07);
          overflow: hidden;
        }
        .rp-page.light .rp-section { border-color: rgba(0,0,0,0.06); background: #fff; }
        .rp-section__header {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px;
          background: none; border: none; color: inherit; cursor: pointer;
          transition: background 0.15s; text-align: left;
          gap: 12px;
        }
        .rp-section__header:hover { background: rgba(0,245,212,0.04); }
        .rp-section__left { display: flex; align-items: center; gap: 10px; flex: 1; flex-wrap: wrap; }
        .rp-section__icon { font-size: 1.2rem; }
        .rp-section__title { font-weight: 700; font-size: 0.9rem; }
        .rp-section__status { padding: 2px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 700; }
        .rp-section__status--pass { background: rgba(6,214,160,0.12); border: 1px solid rgba(6,214,160,0.3); color: #06d6a0; }
        .rp-section__status--warning { background: rgba(255,209,102,0.12); border: 1px solid rgba(255,209,102,0.3); color: #ffd166; }
        .rp-section__status--fail { background: rgba(255,107,107,0.12); border: 1px solid rgba(255,107,107,0.3); color: #ff6b6b; }
        .rp-section__right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .rp-section__score { font-family: 'Sora', sans-serif; font-weight: 800; font-size: 1rem; }
        .rp-section__chevron { transition: transform 0.2s; opacity: 0.5; }
        .rp-section__chevron.rotated { transform: rotate(180deg); }

        .rp-section__body {
          padding: 0 20px 16px;
          display: flex; flex-direction: column; gap: 8px;
          border-top: 1px solid rgba(255,255,255,0.06);
          animation: panelIn 0.2s ease both;
        }
        .rp-page.light .rp-section__body { border-color: rgba(0,0,0,0.05); }
        .rp-finding {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 12px; border-radius: 10px;
          font-size: 0.82rem;
        }
        .rp-finding--error { background: rgba(255,107,107,0.05); border: 1px solid rgba(255,107,107,0.12); }
        .rp-finding--warning { background: rgba(255,209,102,0.05); border: 1px solid rgba(255,209,102,0.12); }
        .rp-finding--success { background: rgba(6,214,160,0.05); border: 1px solid rgba(6,214,160,0.12); }
        .rp-finding__icon { font-size: 1rem; flex-shrink: 0; margin-top: 1px; }
        .rp-finding__label { font-weight: 700; margin-bottom: 2px; }
        .rp-finding__detail { opacity: 0.65; line-height: 1.5; }

        /* RECOMMENDATION */
        .rp-rec { display: flex; flex-direction: column; gap: 24px; }
        .rp-rec__verdict {
          display: flex; align-items: flex-start; gap: 20px;
          padding: 24px; border-radius: 16px;
          background: rgba(255,107,107,0.06);
          border: 1px solid rgba(255,107,107,0.2);
        }
        .rp-rec__verdict-icon { font-size: 2.5rem; flex-shrink: 0; }
        .rp-rec__verdict-text h3 { font-family: 'Sora', sans-serif; font-size: 1rem; font-weight: 700; margin-bottom: 8px; }
        .rp-rec__verdict-text p { font-size: 0.85rem; opacity: 0.75; line-height: 1.6; }

        .rp-rec__steps h4 { font-family: 'Sora', sans-serif; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.5; margin-bottom: 16px; }
        .rp-rec__step {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 16px; border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.06); margin-bottom: 8px;
          transition: all 0.2s;
        }
        .rp-page.light .rp-rec__step { border-color: rgba(0,0,0,0.06); background: #fff; }
        .rp-rec__step:hover { border-color: rgba(0,245,212,0.2); background: rgba(0,245,212,0.02); }
        .rp-rec__step-num { font-family: 'Sora', sans-serif; font-size: 0.7rem; font-weight: 800; color: #00f5d4; opacity: 0.7; width: 24px; flex-shrink: 0; }
        .rp-rec__step-icon { font-size: 1.4rem; flex-shrink: 0; }
        .rp-rec__step-title { font-weight: 700; font-size: 0.88rem; margin-bottom: 4px; }
        .rp-rec__step-desc { font-size: 0.8rem; opacity: 0.6; line-height: 1.5; }

        .rp-rec__disclaimer {
          padding: 16px 20px; border-radius: 12px;
          background: rgba(255,209,102,0.05);
          border: 1px solid rgba(255,209,102,0.15);
          font-size: 0.78rem; opacity: 0.7; line-height: 1.6;
        }

        /* FOOTER */
        .rp-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.06);
          flex-wrap: wrap; gap: 12px;
        }
        .rp-page.light .rp-footer { border-color: rgba(0,0,0,0.06); }
        .rp-footer__btn {
          padding: 12px 24px; border-radius: 12px;
          background: linear-gradient(135deg, #00f5d4, #7c3aed);
          color: #fff; border: none;
          font-size: 0.9rem; font-weight: 700; cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 16px rgba(0,245,212,0.25);
        }
        .rp-footer__btn:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(0,245,212,0.4); }
        .rp-footer__tagline { font-size: 0.75rem; opacity: 0.4; }

        @media (max-width: 900px) {
          .rp-hero { grid-template-columns: 1fr; }
          .rp-hero__score { flex-direction: row; justify-content: center; }
          .rp-verdict-grid { grid-template-columns: 1fr; }
          .rp-overview__grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .rp-tabs { flex-direction: column; width: 100%; }
          .rp-overview__grid { grid-template-columns: repeat(2, 1fr); }
          .rp-hero__score { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
