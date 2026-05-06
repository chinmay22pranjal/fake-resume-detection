import { useState, useEffect, useRef, useCallback } from "react";
import "./index.css";

// ============================================================
// DATA CONSTANTS
// ============================================================
const TEAM = [
  { name: "Chinmay Pranjal", role: "ML Engineer & Backend Lead", avatar: "CP", gradient: "linear-gradient(135deg,#0a84ff,#bf5af2)", linkedin: "#" },
  { name: "Prince Raj", role: "Full Stack Developer", avatar: "PR", gradient: "linear-gradient(135deg,#30d158,#64d2ff)", linkedin: "#" },
  { name: "Shruti Kumari", role: "Data Scientist & AI Researcher", avatar: "SK", gradient: "linear-gradient(135deg,#ff6b6b,#ffd60a)", linkedin: "#" },
];

const NAV_LINKS = [
  { label: "Dashboard", icon: "📊", href: "#dashboard" },
  {
    label: "Features", icon: "✨", href: "#features", dropdown: [
      { label: "Profile Scanner", icon: "🔍", desc: "Deep LinkedIn analysis", color: "#0a84ff" },
      { label: "AI Verification", icon: "🤖", desc: "GPT-powered checks", color: "#30d158" },
      { label: "Risk Assessment", icon: "⚠️", desc: "Fraud scoring engine", color: "#ffd60a" },
      { label: "Batch Analysis", icon: "📦", desc: "Process multiple profiles", color: "#bf5af2" },
    ]
  },
  { label: "How It Works", icon: "🔄", href: "#how-it-works" },
  { label: "Team", icon: "👥", href: "#team" },
  { label: "Pricing", icon: "💎", href: "#pricing", dropdown: [
    { label: "Free Tier", icon: "🆓", desc: "5 scans/month", color: "#30d158" },
    { label: "Pro Plan", icon: "⚡", desc: "Unlimited scans", color: "#0a84ff" },
    { label: "Enterprise", icon: "🏢", desc: "Custom solutions", color: "#bf5af2" },
  ]},
];

const NOTIFICATIONS = [
  { id: 1, icon: "🚨", iconBg: "rgba(255,69,58,0.15)", title: "High Risk Profile Detected", desc: "John Doe's profile flagged — 87% fraud score", time: "2 min ago", unread: true },
  { id: 2, icon: "✅", iconBg: "rgba(48,209,88,0.15)", title: "Verification Complete", desc: "Sarah Chen verified — Authentic profile", time: "14 min ago", unread: true },
  { id: 3, icon: "📊", iconBg: "rgba(10,132,255,0.15)", title: "Batch Analysis Done", desc: "125 profiles processed successfully", time: "1 hr ago", unread: false },
  { id: 4, icon: "🔔", iconBg: "rgba(255,214,10,0.15)", title: "Weekly Report Ready", desc: "May 6 — 340 scans, 28 flagged", time: "3 hr ago", unread: false },
  { id: 5, icon: "🤖", iconBg: "rgba(191,90,242,0.15)", title: "AI Model Updated", desc: "Detection accuracy improved to 98.2%", time: "Yesterday", unread: false },
];

const STATS = [
  { value: "2.4M+", label: "Profiles Scanned", icon: "🔍", color: "#0a84ff", bg: "rgba(10,132,255,0.12)", change: "+12%", up: true },
  { value: "98.2%", label: "Detection Accuracy", icon: "🎯", color: "#30d158", bg: "rgba(48,209,88,0.12)", change: "+0.8%", up: true },
  { value: "47K", label: "Frauds Caught", icon: "🚨", color: "#ff453a", bg: "rgba(255,69,58,0.12)", change: "+340", up: true },
  { value: "< 2s", label: "Avg Scan Time", icon: "⚡", color: "#bf5af2", bg: "rgba(191,90,242,0.12)", change: "-0.3s", up: true },
];

const FEATURES = [
  { icon: "🔗", title: "LinkedIn Profile Analysis", desc: "Deep crawl and semantic analysis of LinkedIn profiles — employment history, endorsements, connections, and activity patterns.", color: "#0a84ff", bg: "rgba(10,132,255,0.12)" },
  { icon: "🤖", title: "AI-Powered Verification", desc: "Our fine-tuned LLM cross-references profile claims against public databases, certifications portals, and company registries.", color: "#30d158", bg: "rgba(48,209,88,0.12)" },
  { icon: "📊", title: "Fraud Score Engine", desc: "Proprietary scoring model evaluates 200+ signals to produce a comprehensive risk score with explainable reasoning.", color: "#ffd60a", bg: "rgba(255,214,10,0.12)" },
  { icon: "🕵️", title: "Ghost Company Detection", desc: "Identifies fake employers, shell companies, and fabricated tenures using business registry verification.", color: "#ff453a", bg: "rgba(255,69,58,0.12)" },
  { icon: "🎓", title: "Education Verification", desc: "Validates degrees, certifications, and educational claims against university databases and issuing institutions.", color: "#bf5af2", bg: "rgba(191,90,242,0.12)" },
  { icon: "⚡", title: "Real-Time Monitoring", desc: "Continuous surveillance on tracked profiles alerts you to suspicious edits or anomalous activity in real time.", color: "#64d2ff", bg: "rgba(100,210,255,0.12)" },
];

const STEPS = [
  { num: "01", title: "Paste LinkedIn URL", desc: "Submit a LinkedIn profile URL or upload a PDF resume for instant analysis.", icon: "🔗", gradient: "linear-gradient(135deg,#0a84ff,#64d2ff)" },
  { num: "02", title: "AI Deep Scan", desc: "Our engine runs 200+ verification checks across multiple trusted data sources simultaneously.", icon: "🤖", gradient: "linear-gradient(135deg,#bf5af2,#0a84ff)" },
  { num: "03", title: "Risk Scored", desc: "Receive a detailed fraud score with confidence intervals and red-flag annotations.", icon: "📊", gradient: "linear-gradient(135deg,#ffd60a,#ff453a)" },
  { num: "04", title: "Act on Insights", desc: "Export reports, share with teams, or integrate results into your existing HR workflows.", icon: "✅", gradient: "linear-gradient(135deg,#30d158,#64d2ff)" },
];

const RECENT_SCANS = [
  { name: "Alex Johnson", role: "Senior Developer", company: "TechCorp Inc.", score: 23, risk: "low", status: "Authentic", time: "2 min ago", avatar: "AJ" },
  { name: "Maria Chen", role: "Product Manager", company: "StartupXYZ", score: 87, risk: "high", status: "Suspicious", time: "18 min ago", avatar: "MC" },
  { name: "Raj Patel", role: "Data Scientist", company: "Analytics Co.", score: 45, risk: "medium", status: "Needs Review", time: "1 hr ago", avatar: "RP" },
  { name: "Emma Wilson", role: "UX Designer", company: "DesignHub", score: 12, risk: "low", status: "Authentic", time: "2 hr ago", avatar: "EW" },
  { name: "James Lee", role: "CEO", company: "VentureLLC", score: 93, risk: "critical", status: "Flagged", time: "3 hr ago", avatar: "JL" },
];

const TESTIMONIALS = [
  { quote: "ResumeGuard cut our hiring fraud incidents by 92%. It caught 3 fake executives before they joined — saving us from potential disasters.", name: "Priya Sharma", role: "Head of Talent, FinTech Giants", avatar: "PS", gradient: "linear-gradient(135deg,#0a84ff,#bf5af2)" },
  { quote: "The detection accuracy is unreal. We processed 5,000 applications and the false positive rate was nearly zero. Game changer for enterprise hiring.", name: "David Kim", role: "VP Engineering, TechUnicorn", avatar: "DK", gradient: "linear-gradient(135deg,#30d158,#64d2ff)" },
  { quote: "What took our team 4 hours now takes 2 seconds. ResumeGuard's AI doesn't just flag — it explains exactly why a profile is suspicious.", name: "Anita Nair", role: "CHRO, Global Consulting Firm", avatar: "AN", gradient: "linear-gradient(135deg,#ffd60a,#ff453a)" },
];

const PRICING = [
  {
    name: "Starter", price: "Free", period: "", desc: "Perfect for individual recruiters",
    features: ["5 scans / month", "Basic risk score", "PDF export", "Email support"],
    cta: "Get Started", gradient: "var(--bg-surface)", accent: "#0a84ff", popular: false
  },
  {
    name: "Pro", price: "$49", period: "/month", desc: "For growing recruiting teams",
    features: ["Unlimited scans", "AI deep analysis", "Team dashboard", "API access", "Real-time alerts", "Priority support"],
    cta: "Start Free Trial", gradient: "var(--gradient-brand)", accent: "#ffffff", popular: true
  },
  {
    name: "Enterprise", price: "Custom", period: "", desc: "Tailored for large organizations",
    features: ["White-label solution", "Custom AI model", "SSO & compliance", "Dedicated CSM", "SLA guarantees", "On-premise option"],
    cta: "Contact Sales", gradient: "var(--bg-surface)", accent: "#0a84ff", popular: false
  }
];

// ============================================================
// HOOKS
// ============================================================
function useScrolled(threshold = 20) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);
  return scrolled;
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem("rg-theme") || "dark");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("rg-theme", theme);
  }, [theme]);
  const toggle = useCallback(() => setTheme(t => t === "dark" ? "light" : "dark"), []);
  return [theme, toggle];
}

function useCountUp(target, duration = 2000, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    const num = parseFloat(target.replace(/[^0-9.]/g, ""));
    if (isNaN(num)) return;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(+(num * eased).toFixed(1));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [start, target, duration]);
  return value;
}

// ============================================================
// COMPONENTS
// ============================================================

// ---- Score Ring ----
function ScoreRing({ score, color, size = 140 }) {
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const strokeColor = score < 40 ? "#30d158" : score < 70 ? "#ffd60a" : "#ff453a";
  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 120 120">
        <circle className="score-ring-track" cx="60" cy="60" r={radius} />
        <circle
          className="score-ring-fill"
          cx="60" cy="60" r={radius}
          stroke={strokeColor}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="score-ring-label">
        <span className="score-ring-value" style={{ color: strokeColor }}>{score}</span>
        <span className="score-ring-sub">Risk Score</span>
      </div>
    </div>
  );
}

// ---- Risk Badge ----
function RiskBadge({ level }) {
  const map = {
    low: { cls: "risk-low", label: "✅ Low Risk" },
    medium: { cls: "risk-medium", label: "⚠️ Medium" },
    high: { cls: "risk-high", label: "🚨 High Risk" },
    critical: { cls: "risk-critical", label: "💀 Critical" },
  };
  const { cls, label } = map[level] || map.low;
  return <span className={`risk-badge ${cls}`}>{label}</span>;
}

// ---- Progress Bar ----
function ProgressBar({ value, color, delay = 0 }) {
  const [width, setWidth] = useState(0);
  const ref = useReveal();
  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), 400 + delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return (
    <div className="progress-bar" ref={ref}>
      <div className="progress-fill" style={{ width: `${width}%`, background: color }} />
    </div>
  );
}

// ---- Navbar ----
function Navbar({ theme, toggleTheme, onMenuOpen }) {
  const scrolled = useScrolled(20);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;

  useEffect(() => {
    const close = () => { setNotifOpen(false); setProfileOpen(false); };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="container">
        <div className="navbar-inner">
          {/* Logo */}
          <a href="#" className="navbar-logo">
            <div className="navbar-logo-icon">🛡️</div>
            <span>Resume<span className="text-gradient">Guard</span></span>
          </a>

          {/* Nav Links */}
          <ul className="navbar-nav">
            {NAV_LINKS.map(link => (
              <li key={link.label} className="nav-item">
                <a href={link.href} className="nav-link">
                  <span>{link.label}</span>
                  {link.dropdown && <span className="nav-link-arrow">▾</span>}
                </a>
                {link.dropdown && (
                  <div className="nav-dropdown">
                    <div className="nav-dropdown-header">{link.label}</div>
                    {link.dropdown.map(item => (
                      <div key={item.label} className="nav-dropdown-item">
                        <div className="nav-dropdown-item-icon" style={{ background: `${item.color}18` }}>
                          {item.icon}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-primary)" }}>{item.label}</div>
                          <div style={{ fontSize: "0.76rem", color: "var(--text-tertiary)" }}>{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Search */}
          <div className="navbar-search">
            <span className="navbar-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search profiles..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="navbar-actions">
            {/* Theme */}
            <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            {/* Notifications */}
            <div style={{ position: "relative" }} onClick={e => { e.stopPropagation(); setNotifOpen(p => !p); setProfileOpen(false); }}>
              <button className="icon-btn">
                🔔
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
              </button>
              <div className={`notifications-panel${notifOpen ? " open" : ""}`} onClick={e => e.stopPropagation()}>
                <div className="notif-header">
                  <span className="notif-title">Notifications</span>
                  <span className="notif-clear">Mark all read</span>
                </div>
                <div className="notif-list">
                  {NOTIFICATIONS.map(n => (
                    <div key={n.id} className={`notif-item${n.unread ? " unread" : ""}`} style={{ position: "relative" }}>
                      <div className="notif-icon" style={{ background: n.iconBg }}>{n.icon}</div>
                      <div className="notif-content">
                        <div className="notif-text"><strong>{n.title}</strong><br />{n.desc}</div>
                        <div className="notif-time">{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile */}
            <div className="profile-menu-wrapper" onClick={e => { e.stopPropagation(); setProfileOpen(p => !p); setNotifOpen(false); }}>
              <div className="profile-avatar">CP</div>
              <div className={`profile-dropdown${profileOpen ? " open" : ""}`} onClick={e => e.stopPropagation()}>
                <div className="profile-header">
                  <div className="profile-avatar" style={{ width: 44, height: 44, fontSize: "1rem" }}>CP</div>
                  <div>
                    <div className="profile-info-name">Chinmay Pranjal</div>
                    <div className="profile-info-email">chinmay@resumeguard.ai</div>
                  </div>
                </div>
                {[
                  { icon: "👤", label: "My Profile" },
                  { icon: "⚙️", label: "Settings" },
                  { icon: "📊", label: "My Reports" },
                  { icon: "💳", label: "Billing" },
                ].map(item => (
                  <div key={item.label} className="profile-menu-item">
                    <span>{item.icon}</span>{item.label}
                  </div>
                ))}
                <div className="profile-menu-divider" />
                <div className="profile-menu-item danger">🚪 Sign Out</div>
              </div>
            </div>

            {/* Mobile */}
            <button className="mobile-menu-btn" onClick={onMenuOpen}>☰</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ---- Mobile Drawer ----
function Drawer({ open, onClose }) {
  return (
    <>
      <div className={`drawer-overlay${open ? " open" : ""}`} onClick={onClose} />
      <div className={`drawer${open ? " open" : ""}`}>
        <div className="drawer-header">
          <div className="navbar-logo">
            <div className="navbar-logo-icon" style={{ width: 32, height: 32, fontSize: "0.9rem" }}>🛡️</div>
            <span style={{ fontSize: "1rem" }}>Resume<span className="text-gradient">Guard</span></span>
          </div>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <div className="drawer-search" style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 28, top: "50%", transform: "translateY(-50%)", fontSize: "1rem" }}>🔍</span>
          <input type="text" placeholder="Search profiles..." />
        </div>
        <div className="drawer-nav">
          <div className="drawer-nav-section">
            <div className="drawer-nav-section-title">Navigation</div>
            {NAV_LINKS.map(link => (
              <a key={link.label} href={link.href} className="drawer-nav-item" onClick={onClose}>
                <span>{link.icon}</span>{link.label}
              </a>
            ))}
          </div>
          <div className="drawer-nav-section">
            <div className="drawer-nav-section-title">Account</div>
            {[["👤","Profile"],["⚙️","Settings"],["📊","Reports"],["🚪","Sign Out"]].map(([icon, label]) => (
              <div key={label} className="drawer-nav-item">
                <span>{icon}</span>{label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ---- Hero Section ----
function Hero() {
  const [scanUrl, setScanUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);

  const handleScan = () => {
    if (!scanUrl.trim()) return;
    setScanning(true);
    setTimeout(() => { setScanning(false); setScanDone(true); }, 2800);
  };

  return (
    <section className="hero" id="home">
      <div className="hero-bg">
        <div className="hero-bg-circle" />
        <div className="hero-bg-circle" />
        <div className="hero-bg-circle" />
      </div>
      <div className="container">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              AI-Powered · Real-time Detection
            </div>
            <h1 className="display-xl hero-title">
              Detect Fake Resumes<br />
              <span className="text-gradient">Using LinkedIn AI</span>
            </h1>
            <p className="hero-subtitle">
              Our advanced AI cross-validates LinkedIn profiles and resumes against 200+ data signals — exposing fabricated work history, fake companies, and fraudulent credentials in under 2 seconds.
            </p>
            <div style={{ marginBottom: 32 }}>
              <div style={{
                display: "flex", gap: 8, background: "var(--bg-glass)",
                border: "1px solid var(--border-default)", borderRadius: "var(--radius-xl)",
                padding: "6px 6px 6px 16px", backdropFilter: "blur(12px)",
                boxShadow: "var(--shadow-md)", flexWrap: "wrap"
              }}>
                <input
                  type="text"
                  placeholder="Paste LinkedIn URL or profile name..."
                  value={scanUrl}
                  onChange={e => setScanUrl(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleScan()}
                  style={{
                    flex: 1, border: "none", background: "transparent", outline: "none",
                    color: "var(--text-primary)", fontSize: "0.92rem", minWidth: 200,
                    padding: "6px 0"
                  }}
                />
                <button
                  className={`btn btn-primary${scanning ? " opacity-0" : ""}`}
                  onClick={handleScan}
                  disabled={scanning}
                  style={{ opacity: scanning ? 0.7 : 1, pointerEvents: scanning ? "none" : "auto" }}
                >
                  {scanning ? "🔄 Scanning..." : "🔍 Scan Now"}
                </button>
              </div>
              {scanDone && (
                <div className="alert alert-success" style={{ marginTop: 12 }}>
                  ✅ Scan complete! <strong>Risk Score: 23 — Authentic Profile</strong>. <a href="#dashboard" style={{ color: "var(--brand-primary)", textDecoration: "underline" }}>View full report →</a>
                </div>
              )}
            </div>
            <div className="hero-actions">
              <a href="#features" className="btn btn-primary btn-lg">Explore Features ✨</a>
              <a href="#how-it-works" className="btn btn-secondary btn-lg">See How It Works →</a>
            </div>
            <div className="hero-stats">
              {[
                { val: "2.4M+", label: "Profiles Analyzed" },
                { val: "98.2%", label: "Accuracy Rate" },
                { val: "47K", label: "Frauds Caught" },
              ].map(s => (
                <div key={s.label}>
                  <div className="hero-stat-value text-gradient">{s.val}</div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <HeroDashboardCard />
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- Hero Dashboard Card (Visual) ----
function HeroDashboardCard() {
  return (
    <div style={{ position: "relative" }}>
      {/* Main Card */}
      <div className="card card-glass" style={{ borderRadius: "var(--radius-2xl)", padding: 28, boxShadow: "var(--shadow-xl)" }}>
        <div className="flex-between mb-20">
          <div>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1.05rem" }}>Fraud Analysis Report</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>LinkedIn Profile Scan</div>
          </div>
          <span className="tag tag-red">🚨 Suspicious</span>
        </div>

        {/* Profile Row */}
        <div className="flex gap-12 mb-20" style={{ alignItems: "center" }}>
          <div style={{
            width: 52, height: 52, borderRadius: "var(--radius-md)", flexShrink: 0,
            background: "linear-gradient(135deg,#ff453a,#ffd60a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 700, fontSize: "1rem"
          }}>JD</div>
          <div>
            <div style={{ fontWeight: 600 }}>John Doe</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>CEO @ VentureStartup Inc.</div>
            <div className="flex gap-4" style={{ marginTop: 4 }}>
              <span className="tag tag-blue" style={{ fontSize: "0.68rem", padding: "2px 6px" }}>🔗 LinkedIn</span>
              <span className="tag tag-red" style={{ fontSize: "0.68rem", padding: "2px 6px" }}>⚠️ Fake Company</span>
            </div>
          </div>
        </div>

        {/* Score */}
        <div className="flex gap-20" style={{ alignItems: "center", marginBottom: 20 }}>
          <ScoreRing score={87} size={120} />
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 12 }}>
              <div className="flex-between" style={{ marginBottom: 6 }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Work History</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#ff453a" }}>78%</span>
              </div>
              <ProgressBar value={78} color="linear-gradient(90deg,#ff453a,#ffd60a)" />
            </div>
            <div style={{ marginBottom: 12 }}>
              <div className="flex-between" style={{ marginBottom: 6 }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Education</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#ffd60a" }}>55%</span>
              </div>
              <ProgressBar value={55} color="linear-gradient(90deg,#ffd60a,#ff6b6b)" delay={100} />
            </div>
            <div>
              <div className="flex-between" style={{ marginBottom: 6 }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Skills Match</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#30d158" }}>34%</span>
              </div>
              <ProgressBar value={34} color="linear-gradient(90deg,#30d158,#64d2ff)" delay={200} />
            </div>
          </div>
        </div>

        {/* Flags */}
        <div style={{ background: "var(--bg-surface-2)", borderRadius: "var(--radius-lg)", padding: 14 }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-tertiary)", marginBottom: 10 }}>Red Flags Detected</div>
          {[
            "Ghost company: VentureStartup Inc. not registered",
            "Education gap: 2018–2020 unexplained",
            "Skill endorsements from bots detected",
          ].map((flag, i) => (
            <div key={i} className="flex gap-8" style={{ alignItems: "flex-start", marginBottom: 7, fontSize: "0.82rem", color: "var(--text-secondary)" }}>
              <span style={{ color: "#ff453a", flexShrink: 0 }}>⚠</span>
              <span>{flag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating mini-cards */}
      <div style={{
        position: "absolute", bottom: -20, right: -20, width: 160,
        background: "var(--bg-surface)", border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-xl)", padding: 14, boxShadow: "var(--shadow-lg)",
        backdropFilter: "blur(12px)"
      }}>
        <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", marginBottom: 8 }}>Today's Stats</div>
        <div style={{ fontFamily: "Syne, sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "#ff453a" }}>23</div>
        <div style={{ fontSize: "0.76rem", color: "var(--text-secondary)" }}>Frauds caught today</div>
      </div>

      <div style={{
        position: "absolute", top: -16, left: -16, width: 140,
        background: "var(--bg-surface)", border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-xl)", padding: 14, boxShadow: "var(--shadow-lg)",
        backdropFilter: "blur(12px)"
      }}>
        <div style={{ fontSize: "1.4rem", marginBottom: 6 }}>🛡️</div>
        <div style={{ fontFamily: "Syne, sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#30d158" }}>98.2%</div>
        <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>Detection accuracy</div>
      </div>
    </div>
  );
}

// ---- Stats Section ----
function StatsSection() {
  const ref = useReveal();
  return (
    <section className="section-sm" id="dashboard" style={{ position: "relative", zIndex: 1 }}>
      <div className="container">
        <div className="grid-4 stagger-children" ref={ref}>
          {STATS.map(stat => (
            <div key={stat.label} className="card stat-card reveal" style={{ "--delay": "0.1s" }}>
              <div className="stat-icon" style={{ background: stat.bg, fontSize: "1.5rem" }}>{stat.icon}</div>
              <div className="stat-value text-gradient" style={{ background: `linear-gradient(135deg,${stat.color},${stat.color}99)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className={`stat-change up`}>↑ {stat.change}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Features Section ----
function FeaturesSection() {
  const ref = useReveal();
  return (
    <section className="section" id="features">
      <div className="container">
        <div className="section-header reveal" ref={useReveal()}>
          <div className="section-eyebrow">Core Capabilities</div>
          <h2 className="display-md section-title">Built for Modern <span className="text-gradient">Talent Security</span></h2>
          <p className="section-desc">From ghost company detection to skill endorsement analysis — our AI uncovers every layer of resume fraud with surgical precision.</p>
        </div>
        <div className="grid-3 stagger-children" ref={ref}>
          {FEATURES.map(f => (
            <div key={f.title} className="card feature-card card-gradient">
              <div className="feature-icon" style={{ background: f.bg }}>{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <p className="feature-desc">{f.desc}</p>
              <div style={{ marginTop: 16 }}>
                <a href="#" style={{ fontSize: "0.82rem", color: f.color, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                  Learn more →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- How It Works ----
function HowItWorks() {
  return (
    <section className="section" id="how-it-works" style={{ background: "var(--bg-surface)", position: "relative", zIndex: 1 }}>
      <div className="container">
        <div className="section-header reveal" ref={useReveal()}>
          <div className="section-eyebrow">Simple Process</div>
          <h2 className="display-md section-title">Fraud Detection in <span className="text-gradient">4 Simple Steps</span></h2>
          <p className="section-desc">From URL submission to actionable risk report — our pipeline runs 200+ checks in under 2 seconds.</p>
        </div>
        <div className="steps-grid stagger-children" ref={useReveal()}>
          {STEPS.map(step => (
            <div key={step.num} className="step-item">
              <div className="step-number" style={{ background: step.gradient, color: "white", boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }}>
                {step.icon}
              </div>
              <div style={{
                position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                fontFamily: "JetBrains Mono, monospace", fontSize: "0.68rem",
                color: "var(--text-tertiary)", letterSpacing: "0.04em", fontWeight: 600
              }}>{step.num}</div>
              <div className="step-title">{step.title}</div>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Live Demo Block */}
        <div className="reveal" ref={useReveal()} style={{ marginTop: 72 }}>
          <div className="card" style={{ padding: 0, overflow: "hidden", boxShadow: "var(--shadow-xl)" }}>
            <div style={{
              background: "var(--gradient-brand)", padding: "14px 24px",
              display: "flex", alignItems: "center", gap: 12
            }}>
              <div className="code-block-dots">
                <div className="code-dot" style={{ background: "#ff5f57" }} />
                <div className="code-dot" style={{ background: "#febc2e" }} />
                <div className="code-dot" style={{ background: "#28c840" }} />
              </div>
              <span style={{ color: "white", fontFamily: "JetBrains Mono, monospace", fontSize: "0.82rem" }}>
                ResumeGuard API — Live Scan Output
              </span>
            </div>
            <div style={{ padding: 24, fontFamily: "JetBrains Mono, monospace", fontSize: "0.82rem", lineHeight: 1.8, color: "var(--text-secondary)", overflowX: "auto" }}>
              <div><span style={{ color: "#64d2ff" }}>POST</span> <span style={{ color: "#30d158" }}>https://api.resumeguard.ai/v2/scan</span></div>
              <div style={{ marginTop: 8 }}><span style={{ color: "#ffd60a" }}>Input:</span> <span style={{ color: "var(--text-tertiary)" }}>linkedin.com/in/john-doe-fake</span></div>
              <br />
              <div><span style={{ color: "#30d158" }}>&#123;</span></div>
              <div>&nbsp;&nbsp;<span style={{ color: "#64d2ff" }}>"fraud_score"</span><span>: </span><span style={{ color: "#ff453a" }}>87</span>,</div>
              <div>&nbsp;&nbsp;<span style={{ color: "#64d2ff" }}>"risk_level"</span><span>: </span><span style={{ color: "#ff453a" }}>"CRITICAL"</span>,</div>
              <div>&nbsp;&nbsp;<span style={{ color: "#64d2ff" }}>"confidence"</span><span>: </span><span style={{ color: "#ffd60a" }}>0.94</span>,</div>
              <div>&nbsp;&nbsp;<span style={{ color: "#64d2ff" }}>"red_flags"</span><span>: [</span></div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#ff453a" }}>"ghost_company_detected"</span>,</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#ff453a" }}>"unverified_education"</span>,</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#ff453a" }}>"bot_endorsements_87pct"</span></div>
              <div>&nbsp;&nbsp;<span>],</span></div>
              <div>&nbsp;&nbsp;<span style={{ color: "#64d2ff" }}>"scan_time_ms"</span><span>: </span><span style={{ color: "#30d158" }}>1843</span></div>
              <div><span style={{ color: "#30d158" }}>&#125;</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- Recent Scans Dashboard ----
function RecentScansSection() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? RECENT_SCANS : RECENT_SCANS.filter(s => s.risk === filter);

  return (
    <section className="section" id="dashboard-table" style={{ position: "relative", zIndex: 1 }}>
      <div className="container">
        <div className="flex-between mb-32" style={{ flexWrap: "wrap", gap: 16 }}>
          <div>
            <h2 className="display-sm">Recent <span className="text-gradient">Scan Results</span></h2>
            <p style={{ color: "var(--text-tertiary)", fontSize: "0.88rem", marginTop: 6 }}>Live feed of the latest profile analyses</p>
          </div>
          <div className="flex gap-8" style={{ flexWrap: "wrap" }}>
            {["all","low","medium","high","critical"].map(f => (
              <button
                key={f}
                className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setFilter(f)}
                style={{ textTransform: "capitalize" }}
              >
                {f === "all" ? "All Results" : f}
              </button>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Role / Company</th>
                  <th>Risk Score</th>
                  <th>Risk Level</th>
                  <th>Status</th>
                  <th>Scanned</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((scan, i) => (
                  <tr key={i}>
                    <td>
                      <div className="flex gap-10" style={{ alignItems: "center" }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: "var(--radius-md)", flexShrink: 0,
                          background: scan.risk === "low" ? "var(--gradient-success)" : scan.risk === "critical" ? "var(--gradient-danger)" : "var(--gradient-brand)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "white", fontWeight: 700, fontSize: "0.8rem"
                        }}>{scan.avatar}</div>
                        <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{scan.name}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: "0.85rem" }}>{scan.role}</div>
                      <div style={{ fontSize: "0.76rem", color: "var(--text-tertiary)" }}>{scan.company}</div>
                    </td>
                    <td>
                      <span style={{
                        fontFamily: "JetBrains Mono, monospace", fontWeight: 700,
                        color: scan.score < 40 ? "#30d158" : scan.score < 70 ? "#ffd60a" : "#ff453a",
                        fontSize: "1rem"
                      }}>{scan.score}</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>/100</span>
                    </td>
                    <td><RiskBadge level={scan.risk} /></td>
                    <td>
                      <span style={{
                        fontSize: "0.82rem", fontWeight: 500,
                        color: scan.status === "Authentic" ? "#1a9e44" : scan.status === "Suspicious" || scan.status === "Flagged" ? "#ff453a" : "#b07b00"
                      }}>{scan.status}</span>
                    </td>
                    <td style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", whiteSpace: "nowrap" }}>{scan.time}</td>
                    <td>
                      <div className="flex gap-6">
                        <button className="btn btn-xs btn-secondary">📄 Report</button>
                        <button className="btn btn-xs btn-ghost">↗</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- Analytics Charts ----
function AnalyticsSection() {
  const bars = [45, 68, 52, 91, 78, 63, 88, 72, 55, 84, 97, 74];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  return (
    <section className="section" style={{ background: "var(--bg-surface-2)", position: "relative", zIndex: 1 }}>
      <div className="container">
        <div className="section-header reveal" ref={useReveal()}>
          <div className="section-eyebrow">Analytics</div>
          <h2 className="display-md section-title">Fraud Detection <span className="text-gradient">Insights</span></h2>
        </div>

        <div className="grid-2 reveal" ref={useReveal()}>
          {/* Bar Chart */}
          <div className="card" style={{ padding: 28 }}>
            <div className="card-header">
              <div>
                <div className="card-title">Monthly Frauds Detected</div>
                <div className="card-subtitle">2025 — Full Year</div>
              </div>
              <span className="tag tag-red">+23% YoY</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 160, marginBottom: 8 }}>
              {bars.map((h, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{
                    width: "100%", height: `${h}%`, borderRadius: "4px 4px 0 0",
                    background: i === 10 ? "var(--gradient-brand)" : "rgba(10,132,255,0.25)",
                    transition: "all 0.6s ease", position: "relative", cursor: "pointer"
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--gradient-brand)"}
                    onMouseLeave={e => { if (i !== 10) e.currentTarget.style.background = "rgba(10,132,255,0.25)"; }}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {months.map(m => (
                <div key={m} style={{ flex: 1, textAlign: "center", fontSize: "0.65rem", color: "var(--text-tertiary)" }}>{m}</div>
              ))}
            </div>
          </div>

          {/* Distribution */}
          <div className="card" style={{ padding: 28 }}>
            <div className="card-header">
              <div>
                <div className="card-title">Risk Distribution</div>
                <div className="card-subtitle">Last 30 days — 8,420 scans</div>
              </div>
            </div>
            {[
              { label: "Authentic (Low Risk)", val: 62, color: "#30d158" },
              { label: "Needs Review (Medium)", val: 21, color: "#ffd60a" },
              { label: "Suspicious (High)", val: 12, color: "#ff453a" },
              { label: "Fraudulent (Critical)", val: 5, color: "#bf5af2" },
            ].map((row, i) => (
              <div key={row.label} style={{ marginBottom: 16 }}>
                <div className="flex-between" style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{row.label}</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: row.color }}>{row.val}%</span>
                </div>
                <ProgressBar value={row.val} color={`linear-gradient(90deg,${row.color}88,${row.color})`} delay={i * 80} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- Team Section ----
function TeamSection() {
  return (
    <section className="section" id="team" style={{ position: "relative", zIndex: 1 }}>
      <div className="container">
        <div className="section-header reveal" ref={useReveal()}>
          <div className="section-eyebrow">The Builders</div>
          <h2 className="display-md section-title">Meet the <span className="text-gradient">Dream Team</span></h2>
          <p className="section-desc">The minds behind ResumeGuard — combining AI research, engineering, and data science to tackle hiring fraud at scale.</p>
        </div>
        <div className="grid-3 stagger-children" ref={useReveal()}>
          {TEAM.map(member => (
            <div key={member.name} className="card" style={{ padding: 32, textAlign: "center" }}>
              <div style={{
                width: 80, height: 80, borderRadius: "var(--radius-xl)",
                background: member.gradient, margin: "0 auto 20px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.4rem",
                color: "white", boxShadow: "0 12px 32px rgba(0,0,0,0.2)"
              }}>{member.avatar}</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: 6 }}>{member.name}</div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-tertiary)", marginBottom: 20 }}>{member.role}</div>
              <div className="flex gap-8" style={{ justifyContent: "center" }}>
                <a href={member.linkedin} className="btn btn-xs btn-secondary">🔗 LinkedIn</a>
                <button className="btn btn-xs btn-ghost">✉️ Email</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Testimonials ----
function TestimonialsSection() {
  return (
    <section className="section" style={{ background: "var(--bg-surface)", position: "relative", zIndex: 1 }}>
      <div className="container">
        <div className="section-header reveal" ref={useReveal()}>
          <div className="section-eyebrow">Customer Stories</div>
          <h2 className="display-md section-title">Trusted by <span className="text-gradient">Top Recruiters</span></h2>
        </div>
        <div className="grid-3 stagger-children" ref={useReveal()}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="card testimonial-card">
              <div className="flex gap-4" style={{ marginBottom: 16 }}>
                {[1,2,3,4,5].map(s => <span key={s} style={{ color: "#ffd60a", fontSize: "0.9rem" }}>★</span>)}
              </div>
              <div className="testimonial-quote">{t.quote}</div>
              <div className="testimonial-author">
                <div className="testimonial-avatar" style={{ background: t.gradient }}>{t.avatar}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Pricing ----
function PricingSection() {
  const [annual, setAnnual] = useState(false);
  return (
    <section className="section" id="pricing" style={{ position: "relative", zIndex: 1 }}>
      <div className="container">
        <div className="section-header reveal" ref={useReveal()}>
          <div className="section-eyebrow">Pricing</div>
          <h2 className="display-md section-title">Simple, <span className="text-gradient">Transparent Pricing</span></h2>
          <p className="section-desc">No hidden fees. Start free and scale as you grow.</p>
          <div className="flex gap-12" style={{ justifyContent: "center", marginTop: 24, alignItems: "center" }}>
            <span style={{ fontSize: "0.88rem", color: annual ? "var(--text-tertiary)" : "var(--text-primary)", fontWeight: 500 }}>Monthly</span>
            <button
              onClick={() => setAnnual(a => !a)}
              style={{
                width: 48, height: 26, borderRadius: 13,
                background: annual ? "var(--brand-primary)" : "var(--bg-surface-3)",
                position: "relative", transition: "background 0.3s ease", flexShrink: 0
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: "50%", background: "white",
                position: "absolute", top: 3, left: annual ? 25 : 3,
                transition: "left 0.3s ease", boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
              }} />
            </button>
            <span style={{ fontSize: "0.88rem", color: annual ? "var(--text-primary)" : "var(--text-tertiary)", fontWeight: 500 }}>
              Annual <span className="tag tag-green" style={{ fontSize: "0.7rem" }}>-25%</span>
            </span>
          </div>
        </div>
        <div className="grid-3 stagger-children" ref={useReveal()}>
          {PRICING.map(plan => (
            <div key={plan.name} className="card" style={{
              padding: 32, position: "relative",
              border: plan.popular ? "2px solid var(--brand-primary)" : undefined,
              transform: plan.popular ? "scale(1.03)" : undefined,
              boxShadow: plan.popular ? "var(--shadow-xl), var(--shadow-glow)" : undefined
            }}>
              {plan.popular && (
                <div style={{
                  position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                  background: "var(--gradient-brand)", color: "white", padding: "4px 16px",
                  borderRadius: "var(--radius-full)", fontSize: "0.76rem", fontWeight: 700,
                  whiteSpace: "nowrap"
                }}>⭐ Most Popular</div>
              )}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1.15rem", marginBottom: 6 }}>{plan.name}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-tertiary)", marginBottom: 16 }}>{plan.desc}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontFamily: "Syne, sans-serif", fontSize: "2.4rem", fontWeight: 800 }}>
                    {annual && plan.price !== "Free" && plan.price !== "Custom"
                      ? `$${Math.round(parseInt(plan.price.replace("$","")) * 0.75)}`
                      : plan.price}
                  </span>
                  <span style={{ color: "var(--text-tertiary)", fontSize: "0.9rem" }}>{plan.period}</span>
                </div>
              </div>
              <div style={{ marginBottom: 28 }}>
                {plan.features.map(f => (
                  <div key={f} className="flex gap-10" style={{ alignItems: "center", marginBottom: 10, fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                    <span style={{ color: "#30d158", flexShrink: 0 }}>✓</span>{f}
                  </div>
                ))}
              </div>
              <button className={`btn btn-full ${plan.popular ? "btn-primary" : "btn-secondary"}`}>{plan.cta}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- CTA Section ----
function CTASection() {
  return (
    <section className="section" style={{ position: "relative", zIndex: 1, overflow: "hidden" }}>
      <div className="container">
        <div className="reveal" ref={useReveal()} style={{
          background: "var(--gradient-brand)", borderRadius: "var(--radius-2xl)",
          padding: "72px 48px", textAlign: "center", position: "relative", overflow: "hidden",
          boxShadow: "var(--shadow-xl), 0 0 80px rgba(10,132,255,0.3)"
        }}>
          <div style={{ position: "absolute", top: "-50%", right: "-10%", width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-30%", left: "-5%", width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>🛡️</div>
          <h2 className="display-md" style={{ color: "white", marginBottom: 16 }}>Stop Hiring Fraud Before It Starts</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.7 }}>
            Join 2,500+ companies that trust ResumeGuard to protect their hiring pipeline. Start your free trial — no credit card required.
          </p>
          <div className="flex gap-12" style={{ justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-lg" style={{ background: "white", color: "#0d1340", fontWeight: 700 }}>
              🚀 Start Free Trial
            </button>
            <button className="btn btn-lg" style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}>
              📞 Book a Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- Footer ----
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="navbar-logo" style={{ fontSize: "1.1rem" }}>
              <div className="navbar-logo-icon">🛡️</div>
              <span>Resume<span className="text-gradient">Guard</span></span>
            </div>
            <p className="footer-brand-desc">
              AI-powered resume fraud detection using LinkedIn intelligence. Protecting companies from hiring fraud since 2024.
            </p>
            <div className="footer-socials">
              {["🐦","💼","🐙","📧"].map((icon, i) => (
                <a key={i} href="#" className="footer-social-btn">{icon}</a>
              ))}
            </div>
          </div>
          {[
            { title: "Product", links: ["Features", "How It Works", "Pricing", "API Docs", "Changelog"] },
            { title: "Company", links: ["About", "Team", "Careers", "Blog", "Press"] },
            { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR", "Security"] },
          ].map(col => (
            <div key={col.title}>
              <div className="footer-col-title">{col.title}</div>
              <div className="footer-links">
                {col.links.map(link => (
                  <a key={link} href="#" className="footer-link">{link}</a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Team Credits */}
        <div className="divider" />
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p style={{ fontSize: "0.85rem", color: "var(--text-tertiary)", marginBottom: 16 }}>
            Built with ❤️ by the ResumeGuard Team
          </p>
          <div className="flex gap-16" style={{ justifyContent: "center", flexWrap: "wrap" }}>
            {TEAM.map(m => (
              <div key={m.name} className="flex gap-8" style={{ alignItems: "center" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "var(--radius-sm)",
                  background: m.gradient, display: "flex", alignItems: "center",
                  justifyContent: "center", color: "white", fontWeight: 700, fontSize: "0.72rem"
                }}>{m.avatar}</div>
                <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 500 }}>{m.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2025 ResumeGuard AI. All rights reserved.</span>
          <span className="flex gap-16">
            <a href="#" className="footer-link">Privacy</a>
            <a href="#" className="footer-link">Terms</a>
            <a href="#" className="footer-link">Cookies</a>
          </span>
          <span>Powered by <strong>Anthropic Claude AI</strong> 🤖</span>
        </div>
      </div>
    </footer>
  );
}

// ---- Scroll-to-top ----
function ScrollTop() {
  const scrolled = useScrolled(400);
  if (!scrolled) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="btn btn-primary btn-icon"
      style={{
        position: "fixed", bottom: 32, right: 32, zIndex: 900,
        width: 48, height: 48, borderRadius: "var(--radius-full)",
        boxShadow: "var(--shadow-lg), var(--shadow-glow)",
        animation: "scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)"
      }}
    >↑</button>
  );
}

// ============================================================
// APP ROOT
// ============================================================
export default function App() {
  const [theme, toggleTheme] = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} onMenuOpen={() => setDrawerOpen(true)} />
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <main>
        <Hero />
        <StatsSection />
        <FeaturesSection />
        <HowItWorks />
        <RecentScansSection />
        <AnalyticsSection />
        <TeamSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </main>

      <Footer />
      <ScrollTop />
    </>
  );
}
