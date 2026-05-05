import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ProgressPage() {
  const [score, setScore] = useState(0);

  // Animate ATS score
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setScore(i);
      if (i >= 87) clearInterval(interval);
    }, 20);
  }, []);

  const skills = [
    { name: "JavaScript", value: 90 },
    { name: "React", value: 85 },
    { name: "Node.js", value: 70 },
    { name: "MongoDB", value: 75 },
    { name: "Communication", value: 80 },
  ];

  const keywords = [
    "React",
    "Node.js",
    "MongoDB",
    "REST API",
    "Problem Solving",
    "Team Work",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e3a8a] text-white px-6 py-10">

      {/* 🔝 HEADER */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
      >
        Resume Analysis Dashboard 🚀
      </motion.h1>

      {/* 🎯 ATS SCORE */}
      <div className="flex flex-col items-center mt-12">
        <div className="relative w-48 h-48">
          <div className="absolute inset-0 border-8 border-blue-500 rounded-full animate-pulse"></div>

          <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
            {score}%
          </div>
        </div>

        <p className="mt-4 text-gray-400">
          Your resume is highly optimized for ATS systems
        </p>
      </div>

      {/* 📊 SKILL MATCH */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Skill Match Analysis</h2>

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
              ></motion.div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔍 KEYWORD SECTION */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-6">Keyword Optimization</h2>

        <div className="flex flex-wrap justify-center gap-4">
          {keywords.map((word, i) => (
            <motion.span
              key={i}
              whileHover={{ scale: 1.1 }}
              className="px-4 py-2 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20"
            >
              {word}
            </motion.span>
          ))}
        </div>
      </div>

      {/* 🚨 FAKE DETECTION */}
      <div className="mt-16 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Fake Detection Result</h2>

        <div className="p-6 bg-white/10 rounded-2xl backdrop-blur-lg border border-white/20">
          <p className="text-green-400 text-xl font-semibold">
            ✔ Resume appears authentic
          </p>
          <p className="text-gray-400 mt-3">
            No suspicious inconsistencies found in experience or skills.
          </p>
        </div>
      </div>

      {/* 📈 IMPROVEMENT TIPS */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Improvement Tips</h2>

        <ul className="space-y-4">
          <li className="p-4 bg-white/10 rounded-xl">
            Add more quantified achievements
          </li>
          <li className="p-4 bg-white/10 rounded-xl">
            Improve keyword density for ATS
          </li>
          <li className="p-4 bg-white/10 rounded-xl">
            Highlight leadership experience
          </li>
        </ul>
      </div>

      {/* 📄 DOWNLOAD REPORT */}
      <div className="mt-16 text-center">
        <button className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl hover:scale-105 transition">
          Download Full Report 📄
        </button>
      </div>

      {/* 🧾 FOOTER */}
      <footer className="mt-20 text-center text-gray-400">
        © 2026 ResumeVerify AI
      </footer>
    </div>
  );
}
