import { useState } from "react";
import { motion } from "framer-motion";
import { FiUploadCloud, FiMoreVertical } from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import "swiper/css";

export default function App() {
  const [file, setFile] = useState(null);

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-black text-white overflow-x-hidden">

      {/* 🔝 Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 backdrop-blur-lg bg-white/10 sticky top-0 z-50">
        <h1 className="text-xl font-bold">ResumeVerify AI</h1>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition">
            Login
          </button>
          <FiMoreVertical size={22} className="cursor-pointer" />
        </div>
      </nav>

      {/* 🚀 Hero Section */}
      <section className="text-center mt-16 px-6">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
        >
          Fake Resume Detector 🚀
        </motion.h1>

        <p className="mt-4 text-gray-300">
          Upload your resume & verify authenticity with AI + LinkedIn
        </p>

        {/* 📂 Upload Box */}
        <div 
          {...getRootProps()} 
          className="mt-10 mx-auto w-full max-w-xl p-10 border-2 border-dashed border-white/30 rounded-2xl backdrop-blur-xl bg-white/10 hover:scale-105 transition cursor-pointer"
        >
          <input {...getInputProps()} />
          <FiUploadCloud size={50} className="mx-auto mb-3" />
          <p>Drag & Drop Resume</p>

          {file && (
            <p className="mt-3 text-green-400">{file.name}</p>
          )}
        </div>
      </section>

      {/* 📊 Features */}
      <section className="grid md:grid-cols-3 gap-6 px-10 mt-16">
        {["AI Detection", "LinkedIn Verify", "PDF Report"].map((item, i) => (
          <motion.div 
            key={i}
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20"
          >
            <h2 className="text-xl font-semibold">{item}</h2>
            <p className="text-gray-400 mt-2">
              Advanced AI-powered feature
            </p>
          </motion.div>
        ))}
      </section>

      {/* 📈 ATS Score Section */}
      <section className="mt-20 px-10 text-center">
        <h2 className="text-3xl font-bold">ATS Score</h2>
        <div className="mt-6 mx-auto w-64 h-64 rounded-full border-8 border-blue-500 flex items-center justify-center text-4xl font-bold">
          87%
        </div>
        <p className="text-gray-400 mt-4">
          Resume is highly optimized for ATS systems
        </p>
      </section>

      {/* ⭐ Reviews Carousel */}
      <section className="mt-20 px-10">
        <h2 className="text-3xl font-bold text-center">User Reviews</h2>

        <div className="flex gap-6 overflow-x-auto mt-8 pb-4">
          {["Amazing tool!", "Very accurate AI!", "Helped me get job!"].map((review, i) => (
            <div key={i} className="min-w-[300px] p-6 bg-white/10 rounded-2xl backdrop-blur-lg">
              <p>"{review}"</p>
              <p className="mt-3 text-sm text-gray-400">⭐⭐⭐⭐⭐</p>
            </div>
          ))}
        </div>
      </section>

      {/* 📄 PDF Preview Section */}
      <section className="mt-20 px-10 text-center">
        <h2 className="text-3xl font-bold">Uploaded Resume Preview</h2>

        {file ? (
          <iframe
            title="pdf"
            src={URL.createObjectURL(file)}
            className="w-full max-w-3xl h-[500px] mx-auto mt-6 rounded-xl border"
          />
        ) : (
          <p className="text-gray-400 mt-6">Upload a file to preview</p>
        )}
      </section>

      {/* 🧾 Footer */}
      <footer className="mt-20 py-6 text-center text-gray-400">
        © 2026 ResumeVerify AI | Built with ❤️
      </footer>
    </div>
  );
}
