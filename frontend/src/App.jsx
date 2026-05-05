import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiUploadCloud, FiMoreVertical } from "react-icons/fi";
import { useDropzone } from "react-dropzone";

export default function App() {
  const [file, setFile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [score, setScore] = useState(0);

  // Fake ATS animation
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setScore(i);
      if (i >= 87) clearInterval(interval);
    }, 20);
  }, []);

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-black text-white">

      {/* 🔝 NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-4 backdrop-blur-xl bg-white/10 sticky top-0 z-50 border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-wide">
          ResumeVerify <span className="text-blue-400">AI</span>
        </h1>

        <div className="flex items-center gap-6 relative">
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl transition">
            Dashboard
          </button>

          {/* 3 DOT MENU */}
          <div className="relative">
            <FiMoreVertical
              size={22}
              onClick={() => setMenuOpen(!menuOpen)}
              className="cursor-pointer"
            />

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-40 bg-white/10 backdrop-blur-xl rounded-xl shadow-lg border border-white/20">
                <p className="px-4 py-2 hover:bg-white/20 cursor-pointer">Profile</p>
                <p className="px-4 py-2 hover:bg-white/20 cursor-pointer">Settings</p>
                <p className="px-4 py-2 hover:bg-white/20 cursor-pointer text-red-400">Logout</p>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 🚀 HERO */}
      <section className="text-center mt-16 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
        >
          Fake Resume Detector 🚀
        </motion.h1>

        <p className="mt-4 text-gray-300 text-lg">
          Upload your resume & verify authenticity with AI + LinkedIn
        </p>

        {/* 📂 UPLOAD BOX */}
        <motion.div
          {...getRootProps()}
          whileHover={{ scale: 1.05 }}
          className="mt-12 mx-auto w-full max-w-xl p-12 border-2 border-dashed border-white/20 rounded-3xl backdrop-blur-xl bg-white/10 cursor-pointer"
        >
          <input {...getInputProps()} />
          <FiUploadCloud size={60} className="mx-auto mb-4 text-blue-400" />
          <p className="text-lg">Drag & Drop Resume</p>

          {file && (
            <p className="mt-4 text-green-400 font-semibold">{file.name}</p>
          )}
        </motion.div>
      </section>

      {/* ⚡ FEATURES */}
      <section className="grid md:grid-cols-3 gap-8 px-10 mt-20">
        {[
          "AI Detection",
          "LinkedIn Verification",
          "PDF Report Generation"
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.07 }}
            className="p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg"
          >
            <h2 className="text-xl font-bold">{item}</h2>
            <p className="text-gray-400 mt-3">
              Advanced AI-powered feature for smart resume validation.
            </p>
          </motion.div>
        ))}
      </section>

      {/* 📊 ATS SCORE */}
      <section className="mt-24 text-center">
        <h2 className="text-3xl font-bold">ATS Score</h2>

        <div className="relative w-64 h-64 mx-auto mt-10">
          <div className="absolute inset-0 rounded-full border-8 border-blue-500 animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold">
            {score}%
          </div>
        </div>

        <p className="text-gray-400 mt-6">
          Resume is highly optimized for Applicant Tracking Systems
        </p>
      </section>

      {/* ⭐ REVIEWS */}
      <section className="mt-24 px-10">
        <h2 className="text-3xl font-bold text-center">User Reviews</h2>

        <div className="flex gap-6 overflow-x-auto mt-10 pb-4">
          {[
            "This AI is insanely accurate!",
            "Helped me land my dream job!",
            "Best resume tool ever!",
            "LinkedIn verification is amazing!"
          ].map((review, i) => (
            <div
              key={i}
              className="min-w-[300px] p-6 bg-white/10 rounded-2xl backdrop-blur-lg border border-white/20"
            >
              <p>"{review}"</p>
              <p className="mt-3 text-yellow-400">⭐⭐⭐⭐⭐</p>
            </div>
          ))}
        </div>
      </section>

      {/* 📄 PDF PREVIEW */}
      <section className="mt-24 px-10 text-center">
        <h2 className="text-3xl font-bold">Resume Preview</h2>

        {file ? (
          <iframe
            title="pdf"
            src={URL.createObjectURL(file)}
            className="w-full max-w-4xl h-[500px] mx-auto mt-8 rounded-2xl border border-white/20"
          />
        ) : (
          <p className="text-gray-400 mt-6">Upload a file to preview</p>
        )}
      </section>

      {/* 🧾 FOOTER */}
      <footer className="mt-24 py-6 text-center text-gray-400 border-t border-white/10">
        © 2026 ResumeVerify AI | All Rights Reserved
      </footer>
    </div>
  );
}
