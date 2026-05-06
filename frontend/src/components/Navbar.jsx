import { useState, useEffect, useRef } from "react";

const Navbar = ({ theme, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [notifCount, setNotifCount] = useState(3);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const toolsRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (toolsRef.current && !toolsRef.current.contains(e.target)) setToolsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const notifications = [
    { id: 1, icon: "🔍", title: "Resume Scanned", msg: "John_CV.pdf analysis complete", time: "2 min ago", read: false, color: "#00f5d4" },
    { id: 2, icon: "⚠️", title: "Suspicious Activity", msg: "LinkedIn profile mismatch detected", time: "1 hr ago", read: false, color: "#ff6b6b" },
    { id: 3, icon: "✅", title: "Verified Resume", msg: "Sarah_Resume.pdf passed all checks", time: "3 hr ago", read: false, color: "#06d6a0" },
    { id: 4, icon: "📊", title: "Report Ready", msg: "Monthly fraud report available", time: "1 day ago", read: true, color: "#a78bfa" },
    { id: 5, icon: "🔗", title: "LinkedIn Connected", msg: "API sync successful", time: "2 days ago", read: true, color: "#ffd166" },
  ];

  const tools = [
    { icon: "📄", label: "Resume Scanner", desc: "Upload & analyze PDF/DOC" },
    { icon: "🔗", label: "LinkedIn Verify", desc: "Cross-check profile data" },
    { icon: "🧠", label: "AI Analysis", desc: "Deep learning detection" },
    { icon: "📊", label: "Reports", desc: "Fraud analytics dashboard" },
    { icon: "🏢", label: "ROC Checker", desc: "Company verification tool" },
    { icon: "🌐", label: "Bulk Scan", desc: "Process multiple resumes" },
  ];

  const navLinks = ["Home", "Detect", "Dashboard", "About"];

  return (
    <>
      <nav
        className={`navbar ${scrolled ? "navbar--scrolled" : ""} ${theme === "dark" ? "navbar--dark" : "navbar--light"}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Animated background glow */}
        <div className="navbar__glow" aria-hidden="true" />

        <div className="navbar__inner">
          {/* Logo */}
          <a href="/" className="navbar__logo" aria-label="ResumeVerify Home">
            <div className="navbar__logo-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="url(#logoGrad)" />
                <path d="M8 10h10M8 14h8M8 18h6M8 22h4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <circle cx="23" cy="20" r="6" fill="none" stroke="#00f5d4" strokeWidth="2" />
                <path d="M20.5 20l1.5 1.5 3-3" stroke="#00f5d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1a1a2e" />
                    <stop offset="1" stopColor="#16213e" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="navbar__logo-text">
              <span className="navbar__logo-primary">Resume</span>
              <span className="navbar__logo-accent">Verify</span>
              <span className="navbar__logo-badge">AI</span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <ul className="navbar__links" role="list">
            {navLinks.map((link) => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase()}`}
                  className="navbar__link"
                  aria-label={`Navigate to ${link}`}
                >
                  {link}
                  <span className="navbar__link-underline" aria-hidden="true" />
                </a>
              </li>
            ))}

            {/* Tools Dropdown */}
            <li ref={toolsRef} className="navbar__dropdown-wrapper">
              <button
                className={`navbar__link navbar__link--dropdown ${toolsOpen ? "active" : ""}`}
                onClick={() => { setToolsOpen(!toolsOpen); setNotifOpen(false); setProfileOpen(false); }}
                aria-expanded={toolsOpen}
                aria-haspopup="true"
              >
                Tools
                <svg className={`navbar__chevron ${toolsOpen ? "rotated" : ""}`} width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="navbar__link-underline" aria-hidden="true" />
              </button>
              {toolsOpen && (
                <div className="navbar__dropdown navbar__dropdown--tools" role="menu">
                  <div className="navbar__dropdown-header">
                    <span>🛠️ Detection Tools</span>
                  </div>
                  <div className="navbar__tools-grid">
                    {tools.map((t) => (
                      <a key={t.label} href="#" className="navbar__tool-item" role="menuitem">
                        <span className="navbar__tool-icon">{t.icon}</span>
                        <div>
                          <div className="navbar__tool-label">{t.label}</div>
                          <div className="navbar__tool-desc">{t.desc}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                  <div className="navbar__dropdown-footer">
                    <a href="#" className="navbar__dropdown-cta">View All Tools →</a>
                  </div>
                </div>
              )}
            </li>
          </ul>

          {/* Right Controls */}
          <div className="navbar__controls">
            {/* Search */}
            <div className={`navbar__search ${searchFocused ? "navbar__search--focused" : ""}`}>
              <svg className="navbar__search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                placeholder="Search resumes..."
                className="navbar__search-input"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                aria-label="Search resumes"
              />
              {searchVal && (
                <button className="navbar__search-clear" onClick={() => setSearchVal("")} aria-label="Clear search">✕</button>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              className="navbar__icon-btn navbar__theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              <div className={`navbar__theme-track ${theme === "dark" ? "dark" : ""}`}>
                <div className="navbar__theme-thumb">
                  {theme === "dark" ? "🌙" : "☀️"}
                </div>
              </div>
            </button>

            {/* Notifications */}
            <div ref={notifRef} className="navbar__dropdown-wrapper">
              <button
                className="navbar__icon-btn"
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); setToolsOpen(false); }}
                aria-label={`Notifications — ${notifCount} unread`}
                aria-expanded={notifOpen}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2a6 6 0 00-6 6v3l-1.5 2.5h15L16 11V8a6 6 0 00-6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M8 15.5a2 2 0 004 0" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                {notifCount > 0 && (
                  <span className="navbar__badge" aria-label={`${notifCount} unread notifications`}>{notifCount}</span>
                )}
              </button>
              {notifOpen && (
                <div className="navbar__dropdown navbar__dropdown--notif" role="dialog" aria-label="Notifications">
                  <div className="navbar__dropdown-header">
                    <span>🔔 Notifications</span>
                    <button className="navbar__notif-clear" onClick={() => setNotifCount(0)}>Mark all read</button>
                  </div>
                  <div className="navbar__notif-list">
                    {notifications.map((n) => (
                      <div key={n.id} className={`navbar__notif-item ${n.read ? "read" : ""}`} role="listitem">
                        <div className="navbar__notif-dot" style={{ background: n.color }} />
                        <span className="navbar__notif-emoji">{n.icon}</span>
                        <div className="navbar__notif-content">
                          <div className="navbar__notif-title">{n.title}</div>
                          <div className="navbar__notif-msg">{n.msg}</div>
                          <div className="navbar__notif-time">{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="navbar__dropdown-footer">
                    <a href="#" className="navbar__dropdown-cta">View All Notifications →</a>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div ref={profileRef} className="navbar__dropdown-wrapper">
              <button
                className="navbar__profile-btn"
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); setToolsOpen(false); }}
                aria-expanded={profileOpen}
                aria-label="User profile menu"
              >
                <div className="navbar__avatar">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="6" r="3.5" stroke="#fff" strokeWidth="1.5" />
                    <path d="M2 16c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="navbar__profile-info">
                  <span className="navbar__profile-name">Recruiter</span>
                  <span className="navbar__profile-role">Admin</span>
                </div>
                <svg className={`navbar__chevron ${profileOpen ? "rotated" : ""}`} width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              {profileOpen && (
                <div className="navbar__dropdown navbar__dropdown--profile" role="menu">
                  <div className="navbar__profile-header">
                    <div className="navbar__profile-avatar-lg">👤</div>
                    <div>
                      <div className="navbar__profile-fullname">Recruiter Admin</div>
                      <div className="navbar__profile-email">admin@resumeverify.ai</div>
                      <span className="navbar__profile-plan">Pro Plan ✨</span>
                    </div>
                  </div>
                  {[
                    { icon: "👤", label: "My Profile" },
                    { icon: "⚙️", label: "Settings" },
                    { icon: "📊", label: "My Reports" },
                    { icon: "🔑", label: "API Keys" },
                    { icon: "💳", label: "Billing" },
                    { icon: "❓", label: "Help Center" },
                  ].map((item) => (
                    <a key={item.label} href="#" className="navbar__profile-item" role="menuitem">
                      <span>{item.icon}</span> {item.label}
                    </a>
                  ))}
                  <div className="navbar__profile-divider" />
                  <a href="#" className="navbar__profile-item navbar__profile-item--danger" role="menuitem">
                    <span>🚪</span> Sign Out
                  </a>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className={`navbar__hamburger ${mobileOpen ? "open" : ""}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <div className={`navbar__mobile-drawer ${mobileOpen ? "open" : ""}`} role="dialog" aria-label="Mobile navigation">
          <div className="navbar__mobile-search">
            <input
              type="search"
              placeholder="Search resumes, tools..."
              className="navbar__mobile-search-input"
              aria-label="Mobile search"
            />
          </div>
          <ul className="navbar__mobile-links" role="list">
            {[...navLinks, "Tools"].map((link) => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase()}`}
                  className="navbar__mobile-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
          <div className="navbar__mobile-footer">
            <button className="navbar__mobile-cta" onClick={() => { setMobileOpen(false); }}>
              🚀 Start Detecting
            </button>
          </div>
        </div>
      </nav>

      {/* Scroll progress indicator */}
      <div className="navbar__scroll-progress" aria-hidden="true">
        <div className="navbar__scroll-bar" id="scrollBar" />
      </div>

      <style>{`
        /* ======= NAVBAR CORE ======= */
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 9999;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: 'Sora', 'Segoe UI', sans-serif;
        }
        .navbar--light {
          background: rgba(255,255,255,0.85);
          color: #1a1a2e;
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        .navbar--dark {
          background: rgba(10, 10, 25, 0.85);
          color: #e2e8f0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .navbar--scrolled {
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
        }
        .navbar__glow {
          position: absolute;
          top: 0; left: 50%; transform: translateX(-50%);
          width: 600px; height: 2px;
          background: linear-gradient(90deg, transparent, #00f5d4, #7c3aed, #00f5d4, transparent);
          opacity: 0.6;
          animation: glowPulse 3s ease-in-out infinite;
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.9; }
        }

        .navbar__inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
          height: 70px;
          display: flex;
          align-items: center;
          gap: 24px;
          position: relative;
        }

        /* ======= LOGO ======= */
        .navbar__logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
          transition: transform 0.2s;
        }
        .navbar__logo:hover { transform: scale(1.03); }
        .navbar__logo-icon { flex-shrink: 0; }
        .navbar__logo-text { display: flex; align-items: baseline; gap: 2px; }
        .navbar__logo-primary {
          font-size: 1.25rem; font-weight: 800;
          color: #1a1a2e;
          letter-spacing: -0.5px;
        }
        .navbar--dark .navbar__logo-primary { color: #e2e8f0; }
        .navbar__logo-accent {
          font-size: 1.25rem; font-weight: 800;
          background: linear-gradient(135deg, #00f5d4, #7c3aed);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .navbar__logo-badge {
          font-size: 0.6rem; font-weight: 700;
          background: linear-gradient(135deg, #00f5d4, #7c3aed);
          color: white; padding: 1px 5px;
          border-radius: 4px; margin-left: 4px;
          letter-spacing: 0.5px;
          -webkit-text-fill-color: white;
        }

        /* ======= NAV LINKS ======= */
        .navbar__links {
          display: flex; align-items: center; gap: 4px;
          list-style: none; margin: 0; padding: 0;
          flex: 1;
        }
        .navbar__link {
          position: relative;
          padding: 8px 14px;
          font-size: 0.875rem; font-weight: 600;
          text-decoration: none;
          color: inherit;
          border-radius: 8px;
          transition: all 0.2s;
          display: flex; align-items: center; gap: 4px;
          background: none; border: none; cursor: pointer;
          letter-spacing: 0.2px;
        }
        .navbar__link:hover, .navbar__link.active {
          background: rgba(0, 245, 212, 0.1);
          color: #00f5d4;
        }
        .navbar__link-underline {
          position: absolute;
          bottom: 2px; left: 14px; right: 14px;
          height: 2px;
          background: linear-gradient(90deg, #00f5d4, #7c3aed);
          border-radius: 2px;
          transform: scaleX(0);
          transition: transform 0.25s;
        }
        .navbar__link:hover .navbar__link-underline { transform: scaleX(1); }

        .navbar__chevron {
          transition: transform 0.25s;
          opacity: 0.6;
        }
        .navbar__chevron.rotated { transform: rotate(180deg); }

        /* ======= DROPDOWN ======= */
        .navbar__dropdown-wrapper { position: relative; }
        .navbar__dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 16px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,245,212,0.08);
          animation: dropIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          overflow: hidden;
          z-index: 100;
        }
        .navbar--dark .navbar__dropdown {
          background: #0f0f23;
          border-color: rgba(255,255,255,0.08);
          box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,245,212,0.1);
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .navbar__dropdown-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 18px 10px;
          font-size: 0.75rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.8px;
          color: #00f5d4;
          border-bottom: 1px solid rgba(0,245,212,0.1);
        }
        .navbar__dropdown-footer {
          padding: 10px 18px;
          border-top: 1px solid rgba(0,0,0,0.06);
        }
        .navbar--dark .navbar__dropdown-footer { border-color: rgba(255,255,255,0.06); }
        .navbar__dropdown-cta {
          font-size: 0.8rem; font-weight: 600;
          color: #7c3aed; text-decoration: none;
          transition: color 0.2s;
        }
        .navbar__dropdown-cta:hover { color: #00f5d4; }

        /* Tools grid dropdown */
        .navbar__dropdown--tools { width: 380px; left: -80px; right: auto; }
        .navbar__tools-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 4px; padding: 10px;
        }
        .navbar__tool-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 10px;
          text-decoration: none; color: inherit;
          transition: all 0.18s;
        }
        .navbar__tool-item:hover {
          background: rgba(0,245,212,0.08);
          transform: translateX(2px);
        }
        .navbar__tool-icon { font-size: 1.4rem; }
        .navbar__tool-label { font-size: 0.82rem; font-weight: 700; }
        .navbar__tool-desc { font-size: 0.72rem; opacity: 0.55; margin-top: 1px; }

        /* Notifications dropdown */
        .navbar__dropdown--notif { width: 340px; }
        .navbar__notif-list { max-height: 320px; overflow-y: auto; }
        .navbar__notif-item {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 12px 18px;
          border-bottom: 1px solid rgba(0,0,0,0.04);
          transition: background 0.15s;
          position: relative;
        }
        .navbar--dark .navbar__notif-item { border-color: rgba(255,255,255,0.04); }
        .navbar__notif-item:hover { background: rgba(0,245,212,0.04); }
        .navbar__notif-item.read { opacity: 0.6; }
        .navbar__notif-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          flex-shrink: 0; margin-top: 6px;
        }
        .navbar__notif-emoji { font-size: 1.3rem; flex-shrink: 0; }
        .navbar__notif-title { font-size: 0.82rem; font-weight: 700; }
        .navbar__notif-msg { font-size: 0.76rem; opacity: 0.7; margin-top: 1px; }
        .navbar__notif-time { font-size: 0.7rem; opacity: 0.45; margin-top: 3px; }
        .navbar__notif-clear {
          font-size: 0.72rem; font-weight: 600; color: #7c3aed;
          background: none; border: none; cursor: pointer;
          transition: color 0.2s;
        }
        .navbar__notif-clear:hover { color: #00f5d4; }

        /* Profile dropdown */
        .navbar__dropdown--profile { width: 260px; }
        .navbar__profile-header {
          display: flex; align-items: center; gap: 12px;
          padding: 16px 18px;
          background: linear-gradient(135deg, rgba(0,245,212,0.06), rgba(124,58,237,0.06));
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        .navbar--dark .navbar__profile-header { border-color: rgba(255,255,255,0.06); }
        .navbar__profile-avatar-lg { font-size: 2.2rem; }
        .navbar__profile-fullname { font-size: 0.9rem; font-weight: 700; }
        .navbar__profile-email { font-size: 0.72rem; opacity: 0.55; margin-top: 1px; }
        .navbar__profile-plan {
          font-size: 0.65rem; font-weight: 700;
          background: linear-gradient(90deg, #00f5d4, #7c3aed);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .navbar__profile-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 18px;
          text-decoration: none; color: inherit;
          font-size: 0.83rem; font-weight: 500;
          transition: all 0.15s;
        }
        .navbar__profile-item:hover {
          background: rgba(0,245,212,0.06);
          padding-left: 22px;
        }
        .navbar__profile-item--danger { color: #ff6b6b; }
        .navbar__profile-item--danger:hover { background: rgba(255,107,107,0.06); }
        .navbar__profile-divider {
          height: 1px;
          background: rgba(0,0,0,0.06);
          margin: 4px 0;
        }
        .navbar--dark .navbar__profile-divider { background: rgba(255,255,255,0.06); }

        /* ======= CONTROLS ======= */
        .navbar__controls {
          display: flex; align-items: center; gap: 8px;
          margin-left: auto;
        }
        .navbar__icon-btn {
          position: relative;
          width: 40px; height: 40px;
          border-radius: 10px;
          background: rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.06);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s;
          color: inherit;
        }
        .navbar--dark .navbar__icon-btn {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.08);
        }
        .navbar__icon-btn:hover {
          background: rgba(0,245,212,0.1);
          border-color: rgba(0,245,212,0.3);
          transform: translateY(-1px);
        }
        .navbar__badge {
          position: absolute; top: 4px; right: 4px;
          width: 16px; height: 16px;
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          border-radius: 50%;
          font-size: 0.6rem; font-weight: 800; color: #fff;
          display: flex; align-items: center; justify-content: center;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        /* Theme Toggle */
        .navbar__theme-toggle {
          width: auto; padding: 4px;
          background: none; border: none;
        }
        .navbar__theme-track {
          width: 52px; height: 28px;
          border-radius: 14px;
          background: rgba(0,0,0,0.08);
          border: 1.5px solid rgba(0,0,0,0.1);
          position: relative;
          transition: all 0.3s;
          cursor: pointer;
        }
        .navbar--dark .navbar__theme-track {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.12);
        }
        .navbar__theme-track.dark {
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          border-color: rgba(0,245,212,0.3);
        }
        .navbar__theme-thumb {
          position: absolute;
          top: 2px; left: 2px;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .dark .navbar__theme-thumb { transform: translateX(24px); }

        /* Search */
        .navbar__search {
          display: flex; align-items: center;
          background: rgba(0,0,0,0.04);
          border: 1.5px solid rgba(0,0,0,0.06);
          border-radius: 10px;
          padding: 0 12px;
          height: 40px; gap: 8px;
          transition: all 0.2s;
          min-width: 160px;
        }
        .navbar--dark .navbar__search {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.08);
        }
        .navbar__search--focused {
          border-color: #00f5d4;
          box-shadow: 0 0 0 3px rgba(0,245,212,0.15);
          min-width: 220px;
        }
        .navbar__search-icon { opacity: 0.4; flex-shrink: 0; }
        .navbar__search-input {
          border: none; background: none; outline: none;
          font-size: 0.82rem; color: inherit;
          width: 100%;
          font-family: inherit;
        }
        .navbar__search-input::placeholder { opacity: 0.4; }
        .navbar__search-clear {
          background: none; border: none; cursor: pointer;
          opacity: 0.4; font-size: 0.75rem; color: inherit;
          transition: opacity 0.2s;
        }
        .navbar__search-clear:hover { opacity: 1; }

        /* Profile Button */
        .navbar__profile-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 4px 10px 4px 4px;
          background: rgba(0,0,0,0.04);
          border: 1.5px solid rgba(0,0,0,0.06);
          border-radius: 12px;
          cursor: pointer; color: inherit;
          transition: all 0.2s;
        }
        .navbar--dark .navbar__profile-btn {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.08);
        }
        .navbar__profile-btn:hover {
          border-color: rgba(0,245,212,0.3);
          background: rgba(0,245,212,0.06);
        }
        .navbar__avatar {
          width: 32px; height: 32px; border-radius: 8px;
          background: linear-gradient(135deg, #00f5d4, #7c3aed);
          display: flex; align-items: center; justify-content: center;
        }
        .navbar__profile-info { text-align: left; line-height: 1; }
        .navbar__profile-name { font-size: 0.8rem; font-weight: 700; display: block; }
        .navbar__profile-role { font-size: 0.68rem; opacity: 0.5; display: block; margin-top: 1px; }

        /* Hamburger */
        .navbar__hamburger {
          display: none; flex-direction: column; gap: 5px;
          width: 40px; height: 40px;
          background: rgba(0,0,0,0.04);
          border: 1.5px solid rgba(0,0,0,0.06);
          border-radius: 10px;
          align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s;
        }
        .navbar--dark .navbar__hamburger {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.08);
        }
        .navbar__hamburger span {
          width: 18px; height: 2px;
          background: currentColor;
          border-radius: 2px;
          transition: all 0.3s;
          display: block;
        }
        .navbar__hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .navbar__hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .navbar__hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* Mobile Drawer */
        .navbar__mobile-drawer {
          display: none;
          position: fixed;
          top: 70px; left: 0; right: 0; bottom: 0;
          background: rgba(10, 10, 25, 0.97);
          backdrop-filter: blur(24px);
          padding: 24px;
          flex-direction: column;
          gap: 8px;
          transform: translateX(-100%);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 9998;
        }
        .navbar__mobile-drawer.open { transform: translateX(0); }
        .navbar__mobile-search { margin-bottom: 16px; }
        .navbar__mobile-search-input {
          width: 100%; padding: 12px 16px;
          background: rgba(255,255,255,0.08);
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 12px; color: #fff;
          font-size: 0.9rem; outline: none;
          font-family: inherit;
        }
        .navbar__mobile-links { list-style: none; margin: 0; padding: 0; }
        .navbar__mobile-link {
          display: block; padding: 14px 4px;
          font-size: 1.1rem; font-weight: 700;
          color: #e2e8f0; text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          transition: all 0.2s;
          letter-spacing: 0.2px;
        }
        .navbar__mobile-link:hover { color: #00f5d4; padding-left: 8px; }
        .navbar__mobile-footer { margin-top: auto; }
        .navbar__mobile-cta {
          width: 100%; padding: 16px;
          background: linear-gradient(135deg, #00f5d4, #7c3aed);
          color: #fff; border: none; border-radius: 14px;
          font-size: 1rem; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
          letter-spacing: 0.5px;
        }
        .navbar__mobile-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,245,212,0.3); }

        /* Scroll Progress */
        .navbar__scroll-progress {
          position: fixed; top: 70px; left: 0; right: 0;
          height: 3px; z-index: 9998; background: rgba(0,0,0,0.05);
        }
        .navbar__scroll-bar {
          height: 100%;
          background: linear-gradient(90deg, #00f5d4, #7c3aed, #ff6b6b);
          width: 0%;
          transition: width 0.1s;
        }

        @media (max-width: 1024px) {
          .navbar__links, .navbar__search { display: none; }
          .navbar__hamburger { display: flex; }
          .navbar__mobile-drawer { display: flex; }
          .navbar__profile-info { display: none; }
        }
        @media (max-width: 640px) {
          .navbar__inner { padding: 0 16px; }
          .navbar__logo-text { gap: 0; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
