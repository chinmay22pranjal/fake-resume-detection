/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#FFD700",
        dark: "#020617",
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #FFD700, #facc15, #eab308)",
      },
      boxShadow: {
        gold: "0 0 25px rgba(255, 215, 0, 0.6)",
      },
      animation: {
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          from: { boxShadow: "0 0 10px #FFD700" },
          to: { boxShadow: "0 0 30px #facc15" },
        },
      },
    },
  },
  plugins: [],
};
