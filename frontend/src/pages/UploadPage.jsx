import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const HERO_IMG = "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80";
const BRAIN_IMG = "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80";
const VERIFY_IMG = "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&q=80";
const LINKEDIN_IMG = "https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=600&q=80";

const stats = [
  { value: "98.7%", label: "Detection Accuracy", icon: "🎯" },
  { value: "50K+", label: "Resumes Scanned", icon: "📄" },
  { value: "< 30s", label: "Avg. Scan Time", icon: "⚡" },
  { value: "12K+", label: "Frauds Caught", icon: "🚨" },
];

const features = [
  {
    icon: "🔗",
    title: "LinkedIn Cross-Verification",
    desc: "Automatically cross-checks resume claims against live LinkedIn profile data including job titles, companies, and tenure.",
    color: "#0077b5",
  },
  {
    icon: "🏢",
    title: "ROC Company Validation",
    desc: "Verifies employer existence through official Registrar of Companies database integration.",
    color: "#00f5d4",
  },
  {
    icon: "🧠",
    title: "AI Inconsistency Detection",
    desc: "Deep learning models detect subtle date gaps, skill exaggerations, and fabricated achievements.",
    color: "#7c3aed",
  },
  {
    icon: "📊",
    title: "Detailed Fraud Report",
    desc: "Comprehensive scoring with per-section breakdown, risk level, and actionable recommendations.",
    color: "#ff6b6b",
  },
  {
    icon: "⚡",
    title: "Instant Analysis",
    desc: "Get full verification results in under 30 seconds with real-time progress tracking.",
    color: "#ffd166",
  },
  {
    icon: "🔒",
    title: "Privacy First",
    desc: "All resume data is encrypted, processed in isolation, and never stored beyond session.",
    color: "#06d6a0",
  },
];

const acceptedFormats = ["PDF", "DOC", "DOCX", "TXT"];

export default function UploadPage({ theme }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const isDark = theme === "dark";

  const validateFile = (f) => {
    const ext = f.name.split(".").pop().toUpperCase();
    if (!acceptedFormats.includes(ext)) return `Only ${acceptedFormats.join(", ")} supported`;
    if (f.size > 10 * 1024 * 1024) return "File too large (max 10MB)";
    return null;
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files[0];
    if (!f) return;
    const err = validateFile(f);
    if (err) { alert(err); return; }
    setFile(f);
  }, []);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const err = validateFile(f);
    if (err) { alert(err); return; }
    setFile(f);
  };

  const validateLinkedIn = (url) => {
    if (!url) return "LinkedIn URL is required";
    if (!url.match(/linkedin\.com\/in\//)) return "Must be a valid LinkedIn profile URL";
    return "";
  };

  const handleSubmit = async () => {
    const err = validateLinkedIn(linkedinUrl);
    setUrlError(err);
    if (err || !file) return;

    setUploading(true);
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 18;
      if (prog >= 100) { prog = 100; clearInterval(interval); }
      setUploadProgress(Math.min(prog, 100));
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setTimeout(() => navigate("/progress", { state: { fileName: file.name, linkedinUrl } }), 400);
    }, 2800);
  };

  return (
    <div className={`up-page ${isDark ? "dark" : "light"}`}>
      {/* Background */}
      <div className="up-bg" aria-hidden="true">
        <div className="up-bg__grid" />
        <div className="up-bg__orb up-bg__orb--1" />
        <div className="up-bg__orb up-bg__orb--2" />
        <div className="up-bg__orb up-bg__orb--3" />
      </div>

      {/* ===== HERO SECTION ===== */}
      <section className="up-hero" aria-labelledby="hero-heading">
        <div className="up-hero__content">
          <div className="up-hero__badge">
            <span className="up-hero__badge-dot" aria-hidden="true" />
            AI-Powered Resume Verification
          </div>
          <h1 className="up-hero__title" id="hero-heading">
            Detect <span className="up-hero__accent">Fake Resumes</span>
            <br />Before They Fool You
          </h1>
          <p className="up-hero__subtitle">
            Upload any resume and provide a LinkedIn URL. Our AI cross-checks every claim — companies, roles, dates, skills — against real-world data sources including LinkedIn and the ROC database.
          </p>
          <div className="up-hero__actions">
            <button className="up-hero__cta-primary" onClick={() => document.getElementById("upload-zone").scrollIntoView({ behavior: "smooth" })}>
              Start Verification ↓
            </button>
            <a href="#how-it-works" className="up-hero__cta-secondary">See How It Works</a>
          </div>

          {/* Stats Row */}
          <div className="up-stats" role="list">
            {stats.map((s) => (
              <div key={s.label} className="up-stat" role="listitem">
                <span className="up-stat__icon" aria-hidden="true">{s.icon}</span>
                <span className="up-stat__value">{s.value}</span>
                <span className="up-stat__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Visual */}
        <div className="up-hero__visual" aria-hidden="true">
          <div className="up-hero__img-frame">
            <img src={HERO_IMG} alt="Resume verification" className="up-hero__img" loading="eager" />
            <div className="up-hero__img-overlay" />
            {/* Floating cards */}
            <div className="up-hero__float up-hero__float--1">
              <span>✅</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.8rem" }}>Verified</div>
                <div style={{ opacity: 0.6, fontSize: "0.7rem" }}>LinkedIn matches</div>
              </div>
            </div>
            <div className="up-hero__float up-hero__float--2">
              <span>⚠️</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.8rem", color: "#ff6b6b" }}>Mismatch</div>
                <div style={{ opacity: 0.6, fontSize: "0.7rem" }}>Company not in ROC</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== UPLOAD SECTION ===== */}
      <section className="up-upload-section" id="upload-zone" aria-labelledby="upload-heading">
        <div className="up-upload-container">
          <div className="up-upload-header">
            <h2 className="up-section-title" id="upload-heading">Upload Resume</h2>
            <p className="up-section-sub">Supports PDF, DOC, DOCX files up to 10MB</p>
          </div>

          <div className="up-upload-grid">
            {/* Drop Zone */}
            <div
              className={`up-dropzone ${dragActive ? "active" : ""} ${file ? "has-file" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => !file && fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Upload resume file"
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                style={{ display: "none" }}
                aria-hidden="true"
              />
              {file ? (
                <div className="up-dropzone__file">
                  <div className="up-dropzone__file-icon">
                    {file.name.endsWith(".pdf") ? "📄" : "📝"}
                  </div>
                  <div className="up-dropzone__file-info">
                    <div className="up-dropzone__file-name">{file.name}</div>
                    <div className="up-dropzone__file-size">
                      {(file.size / 1024).toFixed(0)} KB • {file.name.split(".").pop().toUpperCase()}
                    </div>
                  </div>
                  <button
                    className="up-dropzone__remove"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    aria-label="Remove file"
                  >✕</button>
                </div>
              ) : (
                <>
                  <div className="up-dropzone__icon" aria-hidden="true">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <rect width="48" height="48" rx="12" fill="rgba(0,245,212,0.1)" />
                      <path d="M24 14v16M17 21l7-7 7 7" stroke="#00f5d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      <rect x="12" y="34" width="24" height="4" rx="2" fill="rgba(0,245,212,0.2)" />
                      <path d="M12 34h24" stroke="#00f5d4" strokeWidth="1.5" />
                    </svg>
                  </div>
                  <div className="up-dropzone__text">
                    <span className="up-dropzone__cta">Click to upload</span> or drag & drop
                  </div>
                  <div className="up-dropzone__formats">
                    {acceptedFormats.map((f) => (
                      <span key={f} className="up-dropzone__badge">{f}</span>
                    ))}
                  </div>
                </>
              )}
              <div className="up-dropzone__pulse" aria-hidden="true" />
            </div>

            {/* LinkedIn + Submit */}
            <div className="up-form-panel">
              <div className="up-form-group">
                <label className="up-form-label" htmlFor="linkedin-url">
                  <span>🔗</span> LinkedIn Profile URL
                </label>
                <div className={`up-form-input-wrap ${urlError ? "error" : ""} ${linkedinUrl && !urlError ? "valid" : ""}`}>
                  <span className="up-form-prefix">linkedin.com/in/</span>
                  <input
                    id="linkedin-url"
                    type="url"
                    className="up-form-input"
                    placeholder="username"
                    value={linkedinUrl}
                    onChange={(e) => { setLinkedinUrl(e.target.value); setUrlError(""); }}
                    onBlur={() => setUrlError(validateLinkedIn(linkedinUrl))}
                    aria-describedby={urlError ? "url-error" : undefined}
                    aria-invalid={!!urlError}
                  />
                  {linkedinUrl && !urlError && <span className="up-form-valid" aria-label="Valid URL">✓</span>}
                </div>
                {urlError && <span className="up-form-error" id="url-error" role="alert">{urlError}</span>}
                <p className="up-form-hint">We'll cross-verify the resume against this LinkedIn profile</p>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="up-progress-bar" role="progressbar" aria-valuenow={Math.round(uploadProgress)} aria-valuemin={0} aria-valuemax={100} aria-label="Upload progress">
                  <div className="up-progress-bar__track">
                    <div className="up-progress-bar__fill" style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <div className="up-progress-bar__labels">
                    <span>Uploading...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                </div>
              )}

              <button
                className={`up-submit-btn ${(!file || uploading) ? "disabled" : ""}`}
                onClick={handleSubmit}
                disabled={!file || uploading}
                aria-busy={uploading}
              >
                {uploading ? (
                  <>
                    <span className="up-submit-spinner" aria-hidden="true" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <span>🔍</span> Verify Resume Now
                  </>
                )}
              </button>

              <p className="up-form-privacy">
                🔒 Your data is encrypted and never stored beyond this session
              </p>

              {/* Sample badges */}
              <div className="up-trust-badges">
                {["GDPR Safe", "256-bit SSL", "No Storage", "Instant Delete"].map((b) => (
                  <span key={b} className="up-trust-badge">✓ {b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="up-how" id="how-it-works" aria-labelledby="how-heading">
        <div className="up-container">
          <h2 className="up-section-title" id="how-heading">How It Works</h2>
          <p className="up-section-sub">Four steps from upload to verified result</p>

          <div className="up-steps">
            {[
              { step: "01", icon: "📤", title: "Upload Resume", desc: "Drop your PDF/DOC resume — our parser extracts all candidate data.", color: "#00f5d4" },
              { step: "02", icon: "🔗", title: "LinkedIn Match", desc: "AI compares every role, company, and date against the LinkedIn profile.", color: "#7c3aed" },
              { step: "03", icon: "🏢", title: "ROC Verification", desc: "Employer names are checked against the official company registry.", color: "#ff6b6b" },
              { step: "04", icon: "📊", title: "Fraud Score", desc: "Receive a detailed report with trust score and red flag breakdown.", color: "#ffd166" },
            ].map((s, i) => (
              <div key={s.step} className="up-step">
                <div className="up-step__num" style={{ color: s.color }}>{s.step}</div>
                <div className="up-step__icon-wrap" style={{ background: `${s.color}15`, border: `1.5px solid ${s.color}40` }}>
                  <span className="up-step__icon">{s.icon}</span>
                </div>
                <h3 className="up-step__title">{s.title}</h3>
                <p className="up-step__desc">{s.desc}</p>
                {i < 3 && <div className="up-step__arrow" aria-hidden="true">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== IMAGE SHOWCASE ===== */}
      <section className="up-showcase" aria-labelledby="showcase-heading">
        <div className="up-container">
          <h2 className="up-section-title" id="showcase-heading">Powered by Intelligence</h2>
          <p className="up-section-sub">State-of-the-art AI meets real-world verification data</p>
          <div className="up-showcase-grid">
            <div className="up-showcase-card up-showcase-card--large">
              <img src={BRAIN_IMG} alt="AI brain analyzing resume" className="up-showcase-img" loading="lazy" />
              <div className="up-showcase-overlay">
                <span className="up-showcase-tag">🧠 Deep Learning</span>
                <h3>Neural Resume Analysis</h3>
                <p>Our transformer-based model reads resumes the way expert HR analysts do — detecting patterns humans miss.</p>
              </div>
            </div>
            <div className="up-showcase-right">
              <div className="up-showcase-card">
                <img src={LINKEDIN_IMG} alt="LinkedIn verification" className="up-showcase-img" loading="lazy" />
                <div className="up-showcase-overlay">
                  <span className="up-showcase-tag">🔗 LinkedIn API</span>
                  <h3>Live Profile Sync</h3>
                  <p>Cross-verification with real LinkedIn data in real time.</p>
                </div>
              </div>
              <div className="up-showcase-card">
                <img src={VERIFY_IMG} alt="Document verification" className="up-showcase-img" loading="lazy" />
                <div className="up-showcase-overlay">
                  <span className="up-showcase-tag">✅ ROC Database</span>
                  <h3>Company Registry Check</h3>
                  <p>Every employer validated against official government records.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="up-features" id="features" aria-labelledby="features-heading">
        <div className="up-container">
          <h2 className="up-section-title" id="features-heading">Detection Capabilities</h2>
          <p className="up-section-sub">Everything you need to verify a resume end-to-end</p>
          <div className="up-features-grid" role="list">
            {features.map((f) => (
              <article key={f.title} className="up-feature-card" role="listitem" tabIndex={0}>
                <div className="up-feature-icon-wrap" style={{ background: `${f.color}15`, border: `1.5px solid ${f.color}40` }}>
                  <span className="up-feature-icon" aria-hidden="true">{f.icon}</span>
                </div>
                <h3 className="up-feature-title">{f.title}</h3>
                <p className="up-feature-desc">{f.desc}</p>
                <div className="up-feature-bar" style={{ background: `linear-gradient(90deg, ${f.color}, transparent)` }} aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="up-cta-banner" aria-labelledby="cta-heading">
        <div className="up-cta-banner__inner">
          <div className="up-cta-banner__content">
            <h2 id="cta-heading">Ready to Stop Resume Fraud?</h2>
            <p>Join thousands of HR professionals who trust ResumeVerify AI</p>
          </div>
          <button className="up-cta-banner__btn" onClick={() => document.getElementById("upload-zone").scrollIntoView({ behavior: "smooth" })}>
            Verify a Resume Free →
          </button>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .up-page {
          min-height: 100vh;
          font-family: 'DM Sans', 'Segoe UI', sans-serif;
          position: relative;
          overflow-x: hidden;
          padding-top: 73px;
          scroll-behavior: smooth;
        }
        .up-page.light { background: #f8fafb; color: #1a1a2e; }
        .up-page.dark { background: #080815; color: #e2e8f0; }

        /* BG */
        .up-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .up-bg__grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(0,245,212,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,212,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .up-bg__orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); opacity: 0.15;
          animation: orbFloat 8s ease-in-out infinite;
        }
        .up-bg__orb--1 { width: 600px; height: 600px; background: #7c3aed; top: -200px; right: -100px; }
        .up-bg__orb--2 { width: 400px; height: 400px; background: #00f5d4; bottom: 200px; left: -100px; animation-delay: -3s; }
        .up-bg__orb--3 { width: 300px; height: 300px; background: #ff6b6b; top: 50%; left: 50%; animation-delay: -5s; }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }

        /* CONTAINER */
        .up-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; position: relative; z-index: 1; }
        section { position: relative; z-index: 1; }

        /* HERO */
        .up-hero {
          min-height: 90vh;
          display: grid; grid-template-columns: 1fr 1fr;
          align-items: center; gap: 60px;
          max-width: 1200px; margin: 0 auto;
          padding: 80px 24px 60px;
        }
        .up-hero__badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 16px; border-radius: 100px;
          background: rgba(0,245,212,0.1);
          border: 1px solid rgba(0,245,212,0.3);
          font-size: 0.82rem; font-weight: 600; color: #00f5d4;
          margin-bottom: 24px;
          animation: fadeUp 0.6s ease both;
        }
        .up-hero__badge-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #00f5d4;
          animation: pulse 2s infinite;
        }
        .up-hero__title {
          font-family: 'Sora', sans-serif;
          font-size: clamp(2.2rem, 4vw, 3.5rem);
          font-weight: 800; line-height: 1.12;
          letter-spacing: -1px;
          animation: fadeUp 0.7s 0.1s ease both;
        }
        .up-hero__accent {
          background: linear-gradient(135deg, #00f5d4, #7c3aed);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .up-hero__subtitle {
          font-size: 1.05rem; line-height: 1.7;
          opacity: 0.7; max-width: 480px;
          margin-top: 20px;
          animation: fadeUp 0.7s 0.2s ease both;
        }
        .up-hero__actions {
          display: flex; align-items: center; gap: 16px;
          margin-top: 32px;
          animation: fadeUp 0.7s 0.3s ease both;
          flex-wrap: wrap;
        }
        .up-hero__cta-primary {
          padding: 14px 28px;
          background: linear-gradient(135deg, #00f5d4, #7c3aed);
          color: #fff; border: none; border-radius: 12px;
          font-size: 0.95rem; font-weight: 700; cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 4px 20px rgba(0,245,212,0.35);
          letter-spacing: 0.3px;
        }
        .up-hero__cta-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(0,245,212,0.45); }
        .up-hero__cta-secondary {
          padding: 14px 24px;
          background: none;
          border: 1.5px solid rgba(0,245,212,0.3);
          border-radius: 12px;
          font-size: 0.95rem; font-weight: 600;
          color: inherit; text-decoration: none;
          transition: all 0.25s;
        }
        .up-hero__cta-secondary:hover {
          border-color: #00f5d4; color: #00f5d4;
          background: rgba(0,245,212,0.06);
        }

        /* Stats */
        .up-stats {
          display: flex; gap: 24px;
          margin-top: 48px;
          animation: fadeUp 0.7s 0.4s ease both;
          flex-wrap: wrap;
        }
        .up-stat {
          display: flex; flex-direction: column; align-items: flex-start;
          padding: 16px; border-radius: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
          transition: transform 0.2s;
          min-width: 100px;
        }
        .up-page.light .up-stat { background: rgba(0,0,0,0.03); border-color: rgba(0,0,0,0.06); }
        .up-stat:hover { transform: translateY(-2px); }
        .up-stat__icon { font-size: 1.4rem; margin-bottom: 4px; }
        .up-stat__value {
          font-family: 'Sora', sans-serif;
          font-size: 1.4rem; font-weight: 800;
          background: linear-gradient(135deg, #00f5d4, #7c3aed);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .up-stat__label { font-size: 0.72rem; opacity: 0.55; margin-top: 2px; }

        /* Hero Visual */
        .up-hero__visual { position: relative; animation: fadeUp 0.8s 0.2s ease both; }
        .up-hero__img-frame {
          position: relative; border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 40px 80px rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .up-hero__img { width: 100%; height: 420px; object-fit: cover; display: block; }
        .up-hero__img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(10,10,30,0.4), rgba(124,58,237,0.2));
        }
        .up-hero__float {
          position: absolute;
          display: flex; align-items: center; gap: 10px;
          background: rgba(10,10,25,0.92);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px; padding: 10px 14px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          font-family: 'Sora', sans-serif;
          animation: floatAnim 3s ease-in-out infinite;
          color: #e2e8f0;
        }
        .up-hero__float span { font-size: 1.5rem; }
        .up-hero__float--1 { top: 20px; left: -30px; animation-delay: 0s; }
        .up-hero__float--2 { bottom: 30px; right: -20px; animation-delay: -1.5s; }
        @keyframes floatAnim {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        /* UPLOAD SECTION */
        .up-upload-section { padding: 80px 0; }
        .up-upload-container { max-width: 1000px; margin: 0 auto; padding: 0 24px; }
        .up-upload-header { text-align: center; margin-bottom: 40px; }
        .up-upload-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 32px; align-items: start;
        }

        /* Dropzone */
        .up-dropzone {
          border: 2px dashed rgba(0,245,212,0.3);
          border-radius: 20px;
          padding: 48px 32px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; gap: 16px;
          cursor: pointer;
          transition: all 0.3s;
          position: relative; overflow: hidden;
          background: rgba(0,245,212,0.02);
          min-height: 260px;
        }
        .up-dropzone:hover, .up-dropzone.active {
          border-color: #00f5d4;
          background: rgba(0,245,212,0.06);
          transform: scale(1.01);
        }
        .up-dropzone.has-file { border-style: solid; border-color: rgba(0,245,212,0.5); cursor: default; }
        .up-dropzone__pulse {
          position: absolute; inset: 0;
          border-radius: inherit;
          border: 2px solid #00f5d4;
          opacity: 0;
          animation: dropzonePulse 2s ease-in-out infinite;
        }
        @keyframes dropzonePulse {
          0% { transform: scale(0.97); opacity: 0.3; }
          100% { transform: scale(1.04); opacity: 0; }
        }
        .up-dropzone__icon { margin-bottom: 8px; }
        .up-dropzone__text { font-size: 0.95rem; opacity: 0.7; }
        .up-dropzone__cta { color: #00f5d4; font-weight: 700; }
        .up-dropzone__formats { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
        .up-dropzone__badge {
          padding: 3px 10px; border-radius: 6px;
          background: rgba(0,245,212,0.1); border: 1px solid rgba(0,245,212,0.2);
          font-size: 0.72rem; font-weight: 700; color: #00f5d4;
        }
        .up-dropzone__file {
          display: flex; align-items: center; gap: 14px; width: 100%;
          padding: 8px; text-align: left;
        }
        .up-dropzone__file-icon { font-size: 2.5rem; }
        .up-dropzone__file-info { flex: 1; min-width: 0; }
        .up-dropzone__file-name { font-weight: 700; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .up-dropzone__file-size { font-size: 0.75rem; opacity: 0.55; margin-top: 3px; }
        .up-dropzone__remove {
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(255,107,107,0.15); border: 1px solid rgba(255,107,107,0.3);
          color: #ff6b6b; cursor: pointer; font-size: 0.75rem;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; flex-shrink: 0;
        }
        .up-dropzone__remove:hover { background: rgba(255,107,107,0.3); transform: scale(1.1); }

        /* Form Panel */
        .up-form-panel {
          display: flex; flex-direction: column; gap: 20px;
          padding: 32px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }
        .up-page.light .up-form-panel { background: rgba(255,255,255,0.8); border-color: rgba(0,0,0,0.06); }
        .up-form-group { display: flex; flex-direction: column; gap: 8px; }
        .up-form-label {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.85rem; font-weight: 700;
          letter-spacing: 0.3px;
        }
        .up-form-input-wrap {
          display: flex; align-items: center;
          border: 1.5px solid rgba(0,0,0,0.1);
          border-radius: 12px; overflow: hidden;
          transition: all 0.2s;
        }
        .up-page.dark .up-form-input-wrap { border-color: rgba(255,255,255,0.1); }
        .up-form-input-wrap:focus-within, .up-form-input-wrap.valid { border-color: #00f5d4; box-shadow: 0 0 0 3px rgba(0,245,212,0.12); }
        .up-form-input-wrap.error { border-color: #ff6b6b; box-shadow: 0 0 0 3px rgba(255,107,107,0.12); }
        .up-form-prefix {
          padding: 0 12px; font-size: 0.78rem; opacity: 0.5;
          background: rgba(0,0,0,0.04); border-right: 1px solid rgba(0,0,0,0.06);
          height: 44px; display: flex; align-items: center;
          white-space: nowrap; flex-shrink: 0;
        }
        .up-page.dark .up-form-prefix { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.06); }
        .up-form-input {
          flex: 1; height: 44px; padding: 0 12px;
          background: none; border: none; outline: none;
          font-size: 0.88rem; color: inherit;
          font-family: inherit;
        }
        .up-form-valid { padding-right: 12px; color: #06d6a0; font-weight: 700; }
        .up-form-error { font-size: 0.78rem; color: #ff6b6b; display: flex; align-items: center; gap: 4px; }
        .up-form-hint { font-size: 0.75rem; opacity: 0.45; }

        /* Progress bar */
        .up-progress-bar { display: flex; flex-direction: column; gap: 6px; }
        .up-progress-bar__track {
          height: 6px; border-radius: 3px;
          background: rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .up-page.dark .up-progress-bar__track { background: rgba(255,255,255,0.1); }
        .up-progress-bar__fill {
          height: 100%;
          background: linear-gradient(90deg, #00f5d4, #7c3aed);
          border-radius: 3px; transition: width 0.2s ease;
        }
        .up-progress-bar__labels {
          display: flex; justify-content: space-between;
          font-size: 0.75rem; opacity: 0.6;
        }

        /* Submit Button */
        .up-submit-btn {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          height: 52px; border-radius: 14px;
          background: linear-gradient(135deg, #00f5d4, #7c3aed);
          color: #fff; border: none;
          font-size: 1rem; font-weight: 700; cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 4px 20px rgba(0,245,212,0.3);
          letter-spacing: 0.3px;
        }
        .up-submit-btn:hover:not(.disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,245,212,0.4); }
        .up-submit-btn.disabled { opacity: 0.5; cursor: not-allowed; }
        .up-submit-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .up-form-privacy { font-size: 0.75rem; opacity: 0.5; text-align: center; }
        .up-trust-badges { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; }
        .up-trust-badge {
          font-size: 0.68rem; font-weight: 600;
          padding: 3px 8px; border-radius: 6px;
          background: rgba(6,214,160,0.1);
          border: 1px solid rgba(6,214,160,0.2);
          color: #06d6a0;
        }

        /* HOW IT WORKS */
        .up-how { padding: 100px 0; }
        .up-steps {
          display: flex; align-items: flex-start; gap: 0;
          justify-content: center; margin-top: 60px;
          flex-wrap: wrap; gap: 32px;
          position: relative;
        }
        .up-step {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; max-width: 240px;
          position: relative;
          animation: fadeUp 0.6s ease both;
        }
        .up-step__num {
          font-family: 'Sora', sans-serif;
          font-size: 0.75rem; font-weight: 800;
          letter-spacing: 2px; margin-bottom: 16px;
          opacity: 0.8;
        }
        .up-step__icon-wrap {
          width: 64px; height: 64px; border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
        }
        .up-step__icon { font-size: 1.8rem; }
        .up-step__title { font-family: 'Sora', sans-serif; font-size: 0.95rem; font-weight: 700; margin-bottom: 8px; }
        .up-step__desc { font-size: 0.82rem; opacity: 0.6; line-height: 1.6; }
        .up-step__arrow {
          position: absolute; top: 48px; right: -24px;
          font-size: 1.5rem; opacity: 0.3;
        }

        /* SHOWCASE */
        .up-showcase { padding: 80px 0; }
        .up-showcase-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 48px; }
        .up-showcase-right { display: flex; flex-direction: column; gap: 20px; }
        .up-showcase-card {
          position: relative; border-radius: 20px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          transition: transform 0.3s;
        }
        .up-page.light .up-showcase-card { border-color: rgba(0,0,0,0.06); }
        .up-showcase-card:hover { transform: translateY(-4px); }
        .up-showcase-card--large { grid-row: span 2; }
        .up-showcase-img {
          width: 100%; height: 100%; min-height: 200px;
          object-fit: cover; display: block;
          transition: transform 0.5s;
        }
        .up-showcase-card--large .up-showcase-img { min-height: 420px; }
        .up-showcase-card:hover .up-showcase-img { transform: scale(1.05); }
        .up-showcase-overlay {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 20px;
          background: linear-gradient(to top, rgba(8,8,21,0.96), transparent);
          color: #fff;
        }
        .up-showcase-tag {
          font-size: 0.7rem; font-weight: 700;
          padding: 4px 10px; border-radius: 20px;
          background: rgba(0,245,212,0.2); color: #00f5d4;
          border: 1px solid rgba(0,245,212,0.3);
          display: inline-block; margin-bottom: 8px;
        }
        .up-showcase-overlay h3 { font-size: 1rem; font-weight: 700; margin-bottom: 4px; }
        .up-showcase-overlay p { font-size: 0.8rem; opacity: 0.7; line-height: 1.5; }

        /* FEATURES */
        .up-features { padding: 100px 0; }
        .up-features-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 24px; margin-top: 48px;
        }
        .up-feature-card {
          padding: 28px; border-radius: 20px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          position: relative; overflow: hidden;
          transition: all 0.3s; cursor: default;
        }
        .up-page.light .up-feature-card { background: #fff; border-color: rgba(0,0,0,0.06); box-shadow: 0 2px 16px rgba(0,0,0,0.04); }
        .up-feature-card:hover {
          transform: translateY(-4px);
          border-color: rgba(0,245,212,0.2);
          box-shadow: 0 12px 40px rgba(0,0,0,0.15);
        }
        .up-feature-icon-wrap {
          width: 52px; height: 52px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
        }
        .up-feature-icon { font-size: 1.6rem; }
        .up-feature-title { font-family: 'Sora', sans-serif; font-size: 0.95rem; font-weight: 700; margin-bottom: 10px; }
        .up-feature-desc { font-size: 0.82rem; line-height: 1.65; opacity: 0.65; }
        .up-feature-bar {
          position: absolute; bottom: 0; left: 0;
          height: 3px; width: 100%; opacity: 0;
          transition: opacity 0.3s;
        }
        .up-feature-card:hover .up-feature-bar { opacity: 1; }

        /* CTA Banner */
        .up-cta-banner {
          padding: 80px 24px; text-align: center;
          background: linear-gradient(135deg, rgba(0,245,212,0.06), rgba(124,58,237,0.08));
          border-top: 1px solid rgba(0,245,212,0.1);
          border-bottom: 1px solid rgba(0,245,212,0.1);
        }
        .up-cta-banner__inner {
          max-width: 700px; margin: 0 auto;
          display: flex; flex-direction: column; align-items: center; gap: 24px;
        }
        .up-cta-banner h2 {
          font-family: 'Sora', sans-serif;
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          font-weight: 800; letter-spacing: -0.5px;
        }
        .up-cta-banner p { opacity: 0.65; font-size: 1rem; }
        .up-cta-banner__btn {
          padding: 16px 36px;
          background: linear-gradient(135deg, #00f5d4, #7c3aed);
          color: #fff; border: none; border-radius: 14px;
          font-size: 1rem; font-weight: 700; cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 4px 24px rgba(0,245,212,0.35);
        }
        .up-cta-banner__btn:hover { transform: translateY(-3px); box-shadow: 0 10px 36px rgba(0,245,212,0.5); }

        /* Section headings */
        .up-section-title {
          font-family: 'Sora', sans-serif;
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          font-weight: 800; letter-spacing: -0.5px;
          text-align: center;
        }
        .up-section-sub {
          text-align: center; opacity: 0.55;
          font-size: 0.95rem; margin-top: 10px;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1024px) {
          .up-features-grid { grid-template-columns: repeat(2, 1fr); }
          .up-hero { grid-template-columns: 1fr; min-height: auto; }
          .up-hero__visual { display: none; }
        }
        @media (max-width: 768px) {
          .up-upload-grid { grid-template-columns: 1fr; }
          .up-showcase-grid { grid-template-columns: 1fr; }
          .up-showcase-card--large { grid-row: span 1; }
          .up-features-grid { grid-template-columns: 1fr; }
          .up-steps { flex-direction: column; align-items: center; }
          .up-step__arrow { display: none; }
        }
      `}</style>
    </div>
  );
}
