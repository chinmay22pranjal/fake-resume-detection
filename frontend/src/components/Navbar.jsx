import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiBell,
  FiSearch,
  FiUser,
  FiSun,
  FiMoon,
  FiChevronDown,
} from "react-icons/fi";

/* =========================
   🔔 NOTIFICATIONS DATA
========================= */
const dummyNotifications = [
  "Resume analyzed successfully",
  "ATS score improved",
  "New feature added 🚀",
];

/* =========================
   🧠 NAV LINKS
========================= */
const navLinks = [
  { name: "Dashboard" },
  { name: "Upload" },
  { name: "Results" },
  { name: "Pricing" },
];

/* =========================
   🎯 NAVBAR COMPONENT
========================= */
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [scrolled, setScrolled] = useState(false);

  /* 🔄 SCROLL EFFECT */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* 🌙 THEME TOGGLE */
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    document.documentElement.classList.toggle("dark");
  };

  return (
    <>
      {/* 🔝 MAIN NAVBAR */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/10 backdrop-blur-xl shadow-lg border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="flex justify-between items-center px-6 py-4">

          {/* 🧠 LOGO */}
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            ResumeVerify AI
          </h1>

          {/* 📌 DESKTOP LINKS */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link, i) => (
              <motion.a
                key={i}
                whileHover={{ scale: 1.1 }}
                className="cursor-pointer text-gray-300 hover:text-white transition"
              >
                {link.name}
              </motion.a>
            ))}
          </div>

          {/* 🔍 SEARCH */}
          <div className="hidden md:flex items-center bg-white/10 px-3 py-2 rounded-xl backdrop-blur-xl">
            <FiSearch />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent ml-2 outline-none text-sm"
            />
          </div>

          {/* 🔔 ICONS */}
          <div className="flex items-center gap-4">

            {/* THEME */}
            <button onClick={toggleTheme}>
              {theme === "dark" ? <FiSun /> : <FiMoon />}
            </button>

            {/* NOTIFICATION */}
            <div className="relative">
              <FiBell
                className="cursor-pointer"
                onClick={() => setNotifOpen(!notifOpen)}
              />

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-0 mt-3 w-64 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4"
                  >
                    {dummyNotifications.map((n, i) => (
                      <p key={i} className="text-sm mb-2">
                        {n}
                      </p>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* PROFILE */}
            <div className="relative">
              <div
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <FiUser />
                </div>
                <FiChevronDown size={14} />
              </div>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-0 mt-3 w-40 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20"
                  >
                    <p className="px-4 py-2 hover:bg-white/20 cursor-pointer">
                      Profile
                    </p>
                    <p className="px-4 py-2 hover:bg-white/20 cursor-pointer">
                      Settings
                    </p>
                    <p className="px-4 py-2 text-red-400 hover:bg-white/20 cursor-pointer">
                      Logout
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 📱 MOBILE MENU */}
            <button
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* 📱 MOBILE DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed top-0 right-0 w-64 h-full bg-[#020617] p-6 z-50"
          >
            <h2 className="text-lg font-bold mb-6">Menu</h2>

            {navLinks.map((link, i) => (
              <p
                key={i}
                className="mb-4 text-gray-300 hover:text-white cursor-pointer"
              >
                {link.name}
              </p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
