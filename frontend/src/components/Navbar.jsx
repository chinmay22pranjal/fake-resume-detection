import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("bg-white");
    document.body.classList.toggle("text-black");
  };

  const navItems = [
    { name: "Home", href: "#" },
    { name: "Features", href: "#" },
    { name: "Dashboard", href: "#" },
    { name: "Contact", href: "#" },
  ];

  return (
    <>
      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/70 backdrop-blur-xl shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* LOGO */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            <h1 className="text-xl font-bold tracking-wide text-white">
              ResumeVerify
            </h1>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex gap-8 items-center">
            {navItems.map((item, i) => (
              <a
                key={i}
                href={item.href}
                className="relative text-gray-300 hover:text-white transition"
              >
                {item.name}

                {/* underline animation */}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-500 transition-all duration-300 hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-4">

            {/* THEME TOGGLE */}
            <button
              onClick={toggleTheme}
              className="px-3 py-1 bg-white/10 rounded-lg hover:bg-white/20 transition"
            >
              {darkMode ? "🌙" : "☀️"}
            </button>

            {/* CTA BUTTON */}
            <button className="hidden md:block px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg hover:scale-105 transition">
              Get Started
            </button>

            {/* MOBILE MENU BUTTON */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              ☰
            </button>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 w-full bg-black/90 backdrop-blur-xl p-6 z-40"
          >
            <div className="flex flex-col gap-6 text-center">
              {navItems.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="text-lg text-gray-300 hover:text-white transition"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              ))}

              <button className="mt-4 px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SPACER */}
      <div className="h-20"></div>
    </>
  );
}
