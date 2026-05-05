import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function ProgressPage({ file, onComplete, onError }) {
  const steps = [
    "Extracting Resume",
    "Parsing with AI",
    "Finding LinkedIn",
    "Cross Verifying",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1200);

    const upload = async () => {
      try {
        const form = new FormData();
        form.append("file", file);

        const res = await axios.post(
          "http://localhost:8000/api/resume/analyze",
          form
        );

        onComplete(res.data);
      } catch (e) {
        onError();
      }
    };

    upload();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center">

      {/* LOADER */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1 }}
        className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full mb-10"
      />

      {/* STEPS */}
      {steps.map((step, i) => (
        <div
          key={i}
          className={`mb-3 ${
            i === current ? "text-blue-400" : "text-gray-500"
          }`}
        >
          {i < current ? "✅" : i === current ? "🔄" : "⏳"} {step}
        </div>
      ))}
    </div>
  );
}
