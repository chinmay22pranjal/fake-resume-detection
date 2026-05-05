import { useState } from "react";
import UploadPage from "./pages/UploadPage";
import ProgressPage from "./pages/ProgressPage";
import ResultsPage from "./pages/ResultsPage";
import { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [step, setStep] = useState("upload");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const pageVariants = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-900 to-purple-900 text-white overflow-hidden">
      
      {/* Global Toaster */}
      <Toaster position="top-right" />

      {/* Background Glow Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 blur-3xl opacity-20"></div>

      <AnimatePresence mode="wait">

        {step === "upload" && (
          <motion.div
            key="upload"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <UploadPage
              onUpload={(f) => {
                setFile(f);
                setStep("analyzing");
              }}
            />
          </motion.div>
        )}

        {step === "analyzing" && (
          <motion.div key="progress" variants={pageVariants} initial="initial" animate="animate">
            <ProgressPage
              file={file}
              onComplete={(data) => {
                setResult(data);
                setStep("results");
              }}
              onError={() => setStep("upload")}
            />
          </motion.div>
        )}

        {step === "results" && (
          <motion.div key="results" variants={pageVariants} initial="initial" animate="animate">
            <ResultsPage
              data={result}
              onReset={() => setStep("upload")}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
