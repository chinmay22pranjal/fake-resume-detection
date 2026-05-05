export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],

  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        secondary: "#8b5cf6",
        neon: "#00f7ff",
        glass: "rgba(255,255,255,0.1)",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },

      boxShadow: {
        glow: "0 0 20px rgba(99,102,241,0.5)",
      },

      backdropBlur: {
        xs: "2px",
      },

      animation: {
        float: "float 3s ease-in-out infinite",
        fadeIn: "fadeIn 0.5s ease-in-out",
      },

      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },

        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },

  plugins: [],
};
