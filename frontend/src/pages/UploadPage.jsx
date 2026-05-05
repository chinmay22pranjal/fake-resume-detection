import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { FiUploadCloud, FiFileText, FiCheckCircle, FiMoreVertical } from "react-icons/fi";

/* =========================
   🌟 PARTICLE BACKGROUND
========================= */
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-30"
          initial={{ y: Math.random() * 800, x: Math.random() * 1200 }}
          animate={{ y: [null, -100], opacity: [0.3, 0] }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
};

/* =========================
   📄 FILE CARD
========================= */
const FileCard = ({ file }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-5 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-xl flex items-center gap-4"
  >
    <FiFileText size={30} className="text-blue-400" />
    <div>
      <p className="font-semibold">{file.name}</p>
      <p className="text-gray-400 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
    </div>
  </motion.div>
);

/* =========================
   🚀 MAIN COMPONENT
========================= */
export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
    simulateUpload();
  }, []);

  const simulateUpload = () => {
    setUploading(true);
    let i = 0;

    const interval = setInterval(() => {
      i += 5;
      setProgress(i);
      if (i >= 100) {
        clearInterval(interval);
        setUploading(false);
      }
    }, 100);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e3a8a] text-white px-6 py-10 overflow-hidden">

      {/* 🌟 BACKGROUND */}
      <FloatingParticles />

      {/* 🔝 NAVBAR */}
      <div className="flex justify-between items-center mb-10 relative z-10">
        <h1 className="text-2xl font-bold">
          ResumeVerify <span className="text-blue-400">AI</span>
        </h1>

        <div className="relative">
          <FiMoreVertical
            size={22}
            onClick={() => setMenuOpen(!menuOpen)}
            className="cursor-pointer"
          />

          {menuOpen && (
            <div className="absolute right-0 mt-3 w-40 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
              <p className="px-4 py-2 hover:bg-white/20 cursor-pointer">Profile</p>
              <p className="px-4 py-2 hover:bg-white/20 cursor-pointer">Settings</p>
              <p className="px-4 py-2 hover:bg-white/20 cursor-pointer text-red-400">Logout</p>
            </div>
          )}
        </div>
      </div>

      {/* 🚀 TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-extrabold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
      >
        Upload Your Resume 📄
      </motion.h1>

      <p className="text-center text-gray-400 mt-3">
        Drag & drop your resume to analyze with AI
      </p>

      {/* 📂 DROPZONE */}
      <motion.div
        {...getRootProps()}
        whileHover={{ scale: 1.05 }}
        className="mt-12 mx-auto max-w-xl p-12 border-2 border-dashed border-white/20 rounded-3xl bg-white/10 backdrop-blur-xl cursor-pointer text-center relative z-10"
      >
        <input {...getInputProps()} />
        <FiUploadCloud size={60} className="mx-auto text-blue-400 mb-4" />
        <p className="text-lg">Drop PDF here or click to upload</p>
      </motion.div>

      {/* 📄 FILE PREVIEW */}
      <div className="mt-10 max-w-xl mx-auto relative z-10">
        <AnimatePresence>
          {file && <FileCard file={file} />}
        </AnimatePresence>
      </div>

      {/* ⏳ PROGRESS */}
      {uploading && (
        <div className="mt-8 max-w-xl mx-auto relative z-10">
          <div className="w-full bg-white/10 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
            />
          </div>
          <p className="text-center mt-2 text-gray-400">{progress}% uploading...</p>
        </div>
      )}

      {/* ✅ SUCCESS */}
      {!uploading && progress === 100 && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="mt-8 text-center text-green-400 flex flex-col items-center"
        >
          <FiCheckCircle size={40} />
          <p className="mt-2">Upload Complete!</p>
        </motion.div>
      )}

      {/* 💡 TIPS */}
      <div className="mt-16 max-w-3xl mx-auto grid md:grid-cols-3 gap-6 relative z-10">
        {[
          "Use clear headings",
          "Add measurable achievements",
          "Optimize keywords"
        ].map((tip, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-xl"
          >
            <p>{tip}</p>
          </motion.div>
        ))}
      </div>

      {/* 📄 PREVIEW */}
      {file && (
        <div className="mt-16 max-w-4xl mx-auto relative z-10">
          <iframe
            src={URL.createObjectURL(file)}
            className="w-full h-[500px] rounded-2xl border border-white/20"
            title="PDF Preview"
          />
        </div>
      )}

      {/* 🚀 ANALYZE BUTTON */}
      {file && progress === 100 && (
        <div className="mt-10 text-center relative z-10">
          <button className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl hover:scale-105 transition">
            Analyze Resume 🚀
          </button>
        </div>
      )}

      {/* 🧾 FOOTER */}
      <footer className="mt-20 text-center text-gray-400 relative z-10">
        © 2026 ResumeVerify AI
      </footer>
    </div>
  );
}
