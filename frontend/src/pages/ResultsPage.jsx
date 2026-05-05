import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/* =========================
   🔵 ATS CIRCLE COMPONENT
========================= */
const CircularProgress = ({ value }) => {
  const radius = 90;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (value / 100) * circumference;

  return (
    <div className="relative w-[220px] h-[220px]">
      <svg height="220" width="220">
        <circle
          stroke="rgba(255,255,255,0.1)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx="110"
          cy="110"
        />
        <motion.circle
          stroke="url(#gradient)"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          r={normalizedRadius}
          cx="110"
          cy="110"
          strokeDasharray={circumference + " " + circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5 }}
        />
        <defs>
          <linearGradient id="gradient">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
        {value}%
      </div>
    </div>
  );
};

/* =========================
   📊 SCORE CARD
========================= */
const ScoreCard = ({ title, value }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20"
  >
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-3xl mt-2 text-blue-400">{value}%</p>
  </motion.div>
);

/* =========================
   🚀 MAIN PAGE
========================= */
export default function ResultsPage() {
  const [score, setScore] = useState(0);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setScore(i);
      if (i >= 87) clearInterval(interval);
    }, 15);
  }, []);

  const breakdown = [
    { title: "Content Quality", value: 85 },
    { title: "Keyword Match", value: 78 },
    { title: "Formatting", value: 90 },
    { title: "Readability", value: 82 },
  ];

  const skills = [
    { name: "React", value: 85 },
    { name: "Node.js", value: 75 },
    { name: "MongoDB", value: 70 },
    { name: "Communication", value: 80 },
  ];

  const keywords = [
    "React",
    "Node.js",
    "API",
    "Teamwork",
    "Leadership",
    "Problem Solving",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e3a8a] text-white px-6 py-10">

      {/* 🔝 TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-extrabold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
      >
        Resume Analysis Results ✨
      </motion.h1>

      {/* 🎯 ATS SCORE */}
      <div className="flex flex-col items-center mt-12">
        <CircularProgress value={score} />
        <p className="mt-4 text-gray-400">
          Your resume ATS performance score
        </p>
      </div>

      {/* 📊 BREAKDOWN */}
      <div className="grid md:grid-cols-4 gap-6 mt-16">
        {breakdown.map((item, i) => (
          <ScoreCard key={i} {...item} />
        ))}
      </div>

      {/* 💡 SKILLS */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Skill Strength</h2>

        {skills.map((skill, i) => (
          <div key={i} className="mb-4">
            <div className="flex justify-between mb-1">
              <span>{skill.name}</span>
              <span>{skill.value}%</span>
            </div>

            <div className="w-full bg-white/10 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.value}%` }}
                transition={{ duration: 1 }}
                className="h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
              />
            </div>
          </div>
        ))}
      </div>

      {/* 🔍 KEYWORDS */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-6">Matched Keywords</h2>

        <div className="flex flex-wrap justify-center gap-4">
          {keywords.map((k, i) => (
            <motion.span
              key={i}
              whileHover={{ scale: 1.1 }}
              className="px-4 py-2 bg-white/10 rounded-xl border border-white/20"
            >
              {k}
            </motion.span>
          ))}
        </div>
      </div>

      {/* 🚨 DETECTION */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Authenticity Check</h2>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="p-6 bg-white/10 rounded-2xl border border-white/20 inline-block"
        >
          <p className="text-green-400 text-xl font-semibold">
            ✔ Genuine Resume Detected
          </p>
        </motion.div>
      </div>

      {/* 📈 TIMELINE */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Analysis Timeline</h2>

        <div className="space-y-6">
          {["Parsing Resume", "Analyzing Skills", "Matching Keywords", "Final Score"].map((step, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 📄 DOWNLOAD */}
      <div className="mt-16 text-center">
        <button className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl hover:scale-105 transition">
          Download Report 📄
        </button>
      </div>

      {/* 🔘 FLOATING ACTION */}
      <button className="fixed bottom-6 right-6 bg-blue-500 p-4 rounded-full shadow-lg hover:scale-110 transition">
        ↑
      </button>

      {/* 🧾 FOOTER */}
      <footer className="mt-20 text-center text-gray-400">
        © 2026 ResumeVerify AI
      </footer>
    </div>
  );
}
