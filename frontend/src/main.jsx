import React, { createContext, useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { motion, AnimatePresence } from "framer-motion";

/* =========================
   🌍 GLOBAL CONTEXT
========================= */
const AppContext = createContext();

export const useApp = () => useContext(AppContext);

const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  /* 🌙 THEME TOGGLE */
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  /* 🔔 ADD NOTIFICATION */
  const addNotification = (message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  /* ⏳ FAKE LOADING SCREEN */
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        loading,
        setLoading,
        notifications,
        addNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

/* =========================
   ⛔ ERROR BOUNDARY
========================= */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center text-white">
          <h1>Something went wrong 🚨</h1>
        </div>
      );
    }
    return this.props.children;
  }
}

/* =========================
   ⏳ GLOBAL LOADER
========================= */
const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
      />
    </div>
  );
};

/* =========================
   🔔 NOTIFICATIONS
========================= */
const Notifications = () => {
  const { notifications } = useApp();

  return (
    <div className="fixed top-5 right-5 space-y-3 z-50">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="bg-blue-500 px-4 py-2 rounded-xl shadow-lg"
          >
            {n.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

/* =========================
   🌊 SCROLL TO TOP BUTTON
========================= */
const ScrollTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggle = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", toggle);
    return () => window.removeEventListener("scroll", toggle);
  }, []);

  return (
    visible && (
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-blue-500 p-3 rounded-full shadow-lg hover:scale-110 transition"
      >
        ↑
      </button>
    )
  );
};

/* =========================
   🎨 APP WRAPPER
========================= */
const AppWrapper = () => {
  const { loading, theme } = useApp();

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      {loading && <Loader />}
      <Notifications />
      <ScrollTop />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen"
      >
        <App />
      </motion.div>
    </div>
  );
};

/* =========================
   🚀 ROOT RENDER
========================= */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <AppWrapper />
      </AppProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
