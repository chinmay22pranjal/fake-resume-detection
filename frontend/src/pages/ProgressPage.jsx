import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const STEPS = [
  { id: 1, icon: "📤", label: "Uploading Resume", desc: "Securely transferring your file", duration: 1200 },
  { id: 2, icon: "📝", label: "Parsing Content", desc: "Extracting text, skills & experience", duration: 1500 },
  { id: 3, icon: "🔗", label: "Fetching LinkedIn", desc: "Retrieving public profile data", duration: 1800 },
  { id: 4, icon: "🏢", label: "ROC Verification", desc: "Checking company registrations", duration: 1600 },
  { id: 5, icon: "🧠", label: "AI Analysis", desc: "Running deep learning models", duration: 2000 },
  { id: 6, icon: "📊", label: "Generating Report", desc: "Compiling fraud score & findings", duration: 1000 },
];

const INSIGHTS = [
  "🔍 Analyzing 47 data points across 6 employers...",
  "⚡ Checking LinkedIn connections and mutual contacts...",
  "🏢 Verifying 'TechCorp Pvt Ltd' against ROC database...",
  "📅 Cross-referencing employment dates and overlaps...",
  "🎓 Validating educational credentials...",
  "🌐 Scanning for digital footprint consistency...",
  "📊 Computing anomaly scores...",
  "✅ Finalizing verification report...",
];

export default function ProgressPage({ theme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { fileName = "Resume.pdf", linkedinUrl = "https://linkedin.com/in/sample" } = location.state || {};

  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [insightIdx, setInsightIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [stepStartTimes, setStepStartTimes] = useState([]);

  const isDark = theme === "dark";

  useEffect(() => {
    let totalElapsed = 0;
    const timers = [];

    STEPS.forEach((step, i) => {
      const t = setTimeout(() => {
        setCurrentStep(i);
      }, totalElapsed);
      timers.push(t);
      totalElapsed += step.duration;
    });

    const doneTimer = setTimeout(() => {
      setDone(true);
      setProgress(100);
    }, totalElapsed);
    timers.push(doneTimer);

    const redirectTimer = setTimeout(() => {
      navigate("/results", { state: { fileName, linkedinUrl } });
    }, totalElapsed + 1200);
    timers.push(redirectTimer);

    return () => timers.forEach(clearTimeout);
  }, [navigate, fileName, linkedinUrl]);

  // Smooth progress
  useEffect(() => {
    const total = STEPS.reduce((a, s) => a + s.duration, 0);
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / total) * 100, 99);
      setProgress(pct);
      if (pct >= 99) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Insights cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setInsightIdx((i) => (i + 1) % INSIGHTS.length);
    }, 1100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`pp-page ${isDark ? "dark" : "light"}`}>
      {/* Animated background */}
      <div className="pp-bg" aria-hidden="true">
        <div className="pp-bg__grid" />
        <div className="pp-bg__orb pp-bg__orb--1" />
        <div className="pp-bg__orb pp-bg__orb--2" />
        <div className="pp-bg__particles">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="pp-particle" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 4}s`, animationDuration: `${3 + Math.random() * 4}s` }} />
          ))}
        </div>
      </div>

      <main className="pp-main" role="main" aria-live="polite" aria-label="Resume verification progress">
        {/* Header */}
        <div className="pp-header">
          <div className="pp-header__logo">
            <div className="pp-logo-ring">
              <svg className="pp-logo-svg" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="36" stroke="rgba(0,245,212,0.15)" strokeWidth="2" />
                <circle
                  cx="40" cy="40" r="36"
                  stroke="url(#progressGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
                  transform="rotate(-90 40 40)"
                  style={{ transition: "stroke-dashoffset 0.3s ease" }}
                />
                <defs>
                  <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00f5d4" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="pp-logo-inner">
                <span className="pp-logo-pct">{done ? "✓" : `${Math.round(progress)}%`}</span>
              </div>
            </div>
          </div>

          <h1 className="pp-title">
            {done ? "Analysis Complete!" : "Analyzing Resume..."}
          </h1>
          <p className="pp-subtitle">
            {done ? "Redirecting to your results..." : "Our AI is cross-verifying every claim in real time"}
          </p>

          {/* File badge */}
          <div className="pp-file-badge">
            <span>📄</span>
            <span className="pp-file-name">{fileName}</span>
            <span className="pp-file-sep">•</span>
            <span className="pp-file-linked">🔗 {linkedinUrl.replace("https://", "").substring(0, 30)}...</span>
          </div>
        </div>

        {/* Main progress bar */}
        <div className="pp-bar-wrap">
          <div
            className="pp-bar"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Overall verification progress"
          >
            <div className="pp-bar__fill" style={{ width: `${progress}%` }}>
              <div className="pp-bar__shimmer" aria-hidden="true" />
            </div>
          </div>
          <div className="pp-bar__labels">
            <span>{done ? "Complete" : "Verifying..."}</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Steps */}
        <div className="pp-steps" role="list">
          {STEPS.map((step, i) => {
            const status = i < currentStep ? "done" : i === currentStep ? "active" : "pending";
            return (
              <div key={step.id} className={`pp-step pp-step--${status}`} role="listitem" aria-label={`${step.label}: ${status}`}>
                <div className="pp-step__indicator">
                  {status === "done" ? (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                      <circle cx="9" cy="9" r="9" fill="#06d6a0" />
                      <path d="M5 9l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : status === "active" ? (
                    <div className="pp-step__spinner" aria-hidden="true" />
                  ) : (
                    <div className="pp-step__dot" aria-hidden="true" />
                  )}
                </div>
                <div className="pp-step__content">
                  <div className="pp-step__header">
                    <span className="pp-step__icon" aria-hidden="true">{step.icon}</span>
                    <span className="pp-step__label">{step.label}</span>
                    {status === "active" && (
                      <span className="pp-step__badge" aria-label="In progress">In Progress</span>
                    )}
                    {status === "done" && (
                      <span className="pp-step__badge pp-step__badge--done" aria-label="Done">Done</span>
                    )}
                  </div>
                  <div className="pp-step__desc">{step.desc}</div>
                  {status === "active" && (
                    <div className="pp-step__active-bar" aria-hidden="true">
                      <div className="pp-step__active-fill" />
                    </div>
                  )}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`pp-step__connector ${status === "done" ? "done" : ""}`} aria-hidden="true" />
                )}
              </div>
            );
          })}
        </div>

        {/* Live Insight */}
        <div className="pp-insight" role="status" aria-live="polite" aria-label="Live analysis status">
          <div className="pp-insight__dot" aria-hidden="true" />
          <span className="pp-insight__text" key={insightIdx}>{INSIGHTS[insightIdx]}</span>
        </div>

        {/* Data visualization panel */}
        <div className="pp-scan-panel" aria-label="Scan metrics" role="region">
          <div className="pp-scan-title">Live Scan Metrics</div>
          <div className="pp-scan-grid">
            {[
              { label: "Data Points", val: Math.round(progress * 0.47), max: 47, icon: "📍" },
              { label: "Employers Checked", val: Math.round(progress * 0.06), max: 6, icon: "🏢" },
              { label: "Skills Validated", val: Math.round(progress * 0.23), max: 23, icon: "🎯" },
              { label: "AI Confidence", val: `${Math.min(Math.round(progress * 0.987), 98)}%`, icon: "🧠", raw: true },
            ].map((m) => (
              <div key={m.label} className="pp-scan-metric">
                <div className="pp-scan-metric__top">
                  <span className="pp-scan-metric__icon" aria-hidden="true">{m.icon}</span>
                  <span className="pp-scan-metric__label">{m.label}</span>
                </div>
                <div className="pp-scan-metric__value">
                  {m.raw ? m.val : `${m.val}${m.max ? ` / ${m.max}` : ""}`}
                </div>
                {!m.raw && (
                  <div className="pp-scan-metric__bar" aria-hidden="true">
                    <div className="pp-scan-metric__fill" style={{ width: `${(m.val / m.max) * 100}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Security note */}
        <div className="pp-security">
          <span aria-hidden="true">🔒</span>
          <span>All analysis happens in an isolated, encrypted environment. Data is never retained.</span>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .pp-page {
          min-height: 100vh;
          font-family: 'DM Sans', 'Segoe UI', sans-serif;
          display: flex; align-items: center; justify-content: center;
          padding: 90px 24px 40px;
          position: relative; overflow: hidden;
        }
        .pp-page.dark { background: #080815; color: #e2e8f0; }
        .pp-page.light { background: #f0f4f8; color: #1a1a2e; }

        /* BG */
        .pp-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .pp-bg__grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(0,245,212,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,212,0.03) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        .pp-bg__orb {
          position: absolute; border-radius: 50%;
          filter: blur(100px); opacity: 0.12;
          animation: orbFloat 6s ease-in-out infinite;
        }
        .pp-bg__orb--1 { width: 500px; height: 500px; background: #7c3aed; top: 0; right: 0; }
        .pp-bg__orb--2 { width: 400px; height: 400px; background: #00f5d4; bottom: 0; left: 0; animation-delay: -3s; }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .pp-bg__particles { position: absolute; inset: 0; }
        .pp-particle {
          position: absolute;
          width: 3px; height: 3px; border-radius: 50%;
          background: linear-gradient(135deg, #00f5d4, #7c3aed);
          opacity: 0;
          animation: particleRise linear infinite;
        }
        @keyframes particleRise {
          0% { bottom: 0; opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.3; }
          100% { bottom: 100vh; opacity: 0; }
        }

        /* MAIN */
        .pp-main {
          width: 100%; max-width: 680px;
          display: flex; flex-direction: column; gap: 32px;
          position: relative; z-index: 1;
        }

        /* HEADER */
        .pp-header { display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center; }
        .pp-header__logo { position: relative; }
        .pp-logo-ring { position: relative; width: 100px; height: 100px; }
        .pp-logo-svg { width: 100%; height: 100%; }
        .pp-logo-inner {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .pp-logo-pct {
          font-family: 'Sora', sans-serif;
          font-size: 1.1rem; font-weight: 800;
          background: linear-gradient(135deg, #00f5d4, #7c3aed);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .pp-title {
          font-family: 'Sora', sans-serif;
          font-size: 1.8rem; font-weight: 800;
          letter-spacing: -0.5px;
        }
        .pp-subtitle { opacity: 0.6; font-size: 0.9rem; }
        .pp-file-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 16px; border-radius: 100px;
          background: rgba(0,245,212,0.08);
          border: 1px solid rgba(0,245,212,0.2);
          font-size: 0.78rem; font-weight: 500;
        }
        .pp-file-name { font-weight: 700; }
        .pp-file-sep { opacity: 0.4; }
        .pp-file-linked { opacity: 0.7; }

        /* MAIN BAR */
        .pp-bar-wrap { display: flex; flex-direction: column; gap: 8px; }
        .pp-bar {
          height: 12px; border-radius: 6px;
          background: rgba(255,255,255,0.06);
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .pp-page.light .pp-bar { background: rgba(0,0,0,0.06); }
        .pp-bar__fill {
          height: 100%;
          background: linear-gradient(90deg, #00f5d4, #7c3aed, #ff6b6b);
          background-size: 200% 100%;
          border-radius: 6px;
          transition: width 0.3s ease;
          position: relative;
          animation: barShift 3s linear infinite;
        }
        @keyframes barShift { 0% { background-position: 0% 0%; } 100% { background-position: 200% 0%; } }
        .pp-bar__shimmer {
          position: absolute; top: 0; left: -100%; right: 0; bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shimmer 1.5s ease-in-out infinite;
        }
        @keyframes shimmer { 0% { left: -100%; } 100% { left: 200%; } }
        .pp-bar__labels { display: flex; justify-content: space-between; font-size: 0.78rem; opacity: 0.6; }

        /* STEPS */
        .pp-steps { display: flex; flex-direction: column; gap: 0; }
        .pp-step {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          position: relative; opacity: 0.4;
          transition: opacity 0.3s;
        }
        .pp-page.light .pp-step { border-color: rgba(0,0,0,0.05); }
        .pp-step--done, .pp-step--active { opacity: 1; }
        .pp-step__indicator { flex-shrink: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; margin-top: 2px; }
        .pp-step__spinner {
          width: 20px; height: 20px; border-radius: 50%;
          border: 2px solid rgba(0,245,212,0.2);
          border-top-color: #00f5d4;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .pp-step__dot {
          width: 10px; height: 10px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.15);
          margin: 5px;
        }
        .pp-page.light .pp-step__dot { border-color: rgba(0,0,0,0.15); }
        .pp-step__content { flex: 1; }
        .pp-step__header { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .pp-step__icon { font-size: 1.1rem; }
        .pp-step__label { font-weight: 700; font-size: 0.9rem; }
        .pp-step__badge {
          padding: 2px 8px; border-radius: 20px;
          font-size: 0.68rem; font-weight: 700;
          background: rgba(0,245,212,0.15);
          border: 1px solid rgba(0,245,212,0.3);
          color: #00f5d4;
          animation: badgePulse 1s ease-in-out infinite;
        }
        .pp-step__badge--done {
          background: rgba(6,214,160,0.12);
          border-color: rgba(6,214,160,0.3);
          color: #06d6a0;
          animation: none;
        }
        @keyframes badgePulse { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; } }
        .pp-step__desc { font-size: 0.78rem; opacity: 0.55; margin-top: 4px; }
        .pp-step__active-bar {
          height: 3px; border-radius: 2px;
          background: rgba(0,245,212,0.1);
          margin-top: 8px; overflow: hidden;
        }
        .pp-step__active-fill {
          height: 100%;
          background: linear-gradient(90deg, #00f5d4, #7c3aed);
          animation: activeBar 1.5s ease-in-out infinite;
        }
        @keyframes activeBar {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 60%; margin-left: 20%; }
          100% { width: 0%; margin-left: 100%; }
        }
        .pp-step__connector {
          position: absolute; left: 11px; top: 56px;
          width: 2px; height: 14px;
          background: rgba(255,255,255,0.08);
          transition: background 0.3s;
        }
        .pp-page.light .pp-step__connector { background: rgba(0,0,0,0.08); }
        .pp-step__connector.done { background: rgba(6,214,160,0.4); }

        /* INSIGHT */
        .pp-insight {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 20px; border-radius: 12px;
          background: rgba(0,245,212,0.05);
          border: 1px solid rgba(0,245,212,0.15);
          min-height: 48px;
        }
        .pp-insight__dot {
          width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
          background: #00f5d4;
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.6; } }
        .pp-insight__text {
          font-size: 0.83rem; opacity: 0.8;
          animation: insightFade 0.4s ease both;
        }
        @keyframes insightFade { from { opacity: 0; transform: translateY(4px); } to { opacity: 0.8; transform: translateY(0); } }

        /* SCAN PANEL */
        .pp-scan-panel {
          padding: 24px;
          border-radius: 20px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
        }
        .pp-page.light .pp-scan-panel { background: #fff; border-color: rgba(0,0,0,0.06); box-shadow: 0 2px 16px rgba(0,0,0,0.04); }
        .pp-scan-title { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #00f5d4; margin-bottom: 20px; }
        .pp-scan-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .pp-scan-metric { display: flex; flex-direction: column; gap: 6px; }
        .pp-scan-metric__top { display: flex; align-items: center; gap: 6px; }
        .pp-scan-metric__icon { font-size: 1rem; }
        .pp-scan-metric__label { font-size: 0.75rem; opacity: 0.55; }
        .pp-scan-metric__value { font-family: 'Sora', sans-serif; font-size: 1.3rem; font-weight: 800; }
        .pp-scan-metric__bar {
          height: 4px; border-radius: 2px;
          background: rgba(255,255,255,0.06);
          overflow: hidden;
        }
        .pp-page.light .pp-scan-metric__bar { background: rgba(0,0,0,0.06); }
        .pp-scan-metric__fill {
          height: 100%;
          background: linear-gradient(90deg, #00f5d4, #7c3aed);
          border-radius: 2px;
          transition: width 0.5s ease;
        }

        /* SECURITY */
        .pp-security {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-size: 0.75rem; opacity: 0.45; text-align: center;
        }

        @media (max-width: 640px) {
          .pp-scan-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
