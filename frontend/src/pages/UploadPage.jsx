import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { useState } from "react";

export default function UploadPage({ onUpload }) {
  const [fileInfo, setFileInfo] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (files) => {
      const file = files[0];
      setFileInfo({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
      });
    },
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">

      {/* HERO */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-5xl font-bold mb-4 text-center text-gradient"
      >
        Fake Resume Detector
      </motion.h1>

      <p className="text-gray-300 text-center max-w-xl mb-10">
        Upload your resume and let AI verify authenticity using LinkedIn data.
      </p>

      {/* DROP ZONE */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        {...getRootProps()}
        className="w-full max-w-xl p-12 border border-white/20 rounded-3xl glass text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        <p className="text-lg">Drag & Drop Resume</p>
      </motion.div>

      {/* FILE INFO */}
      {fileInfo && (
        <div className="mt-6 text-center">
          <p>{fileInfo.name}</p>
          <p className="text-sm text-gray-400">{fileInfo.size}</p>

          <button
            onClick={() => onUpload(fileInfo)}
            className="btn-primary mt-4"
          >
            Analyze Resume
          </button>
        </div>
      )}

      {/* FEATURES */}
      <div className="grid md:grid-cols-3 gap-6 mt-16">
        {["AI Detection", "LinkedIn Verify", "PDF Report"].map((item, i) => (
          <div key={i} className="card">
            <h3 className="font-bold">{item}</h3>
            <p className="text-sm text-gray-400 mt-2">
              Advanced system feature
            </p>
          </div>
        ))}
      </div>

      {/* CREDITS */}
      <div className="mt-16 text-center text-gray-400">
        Chinmay Pranjal • Prince Raj • Shruti Kumari
      </div>
    </div>
  );
}
