import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";

export default function UploadPage({ onNext }) {
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone();

  return (
    <div className="flex flex-col items-center justify-center h-screen px-6">

      <h1 className="text-4xl font-bold mb-4">
        Resume AI Detector
      </h1>

      <motion.div
        {...getRootProps()}
        whileHover={{ scale: 1.05 }}
        className="glass p-12 w-full max-w-xl text-center border-dashed border-2 cursor-pointer"
      >
        <input {...getInputProps()} />
        <p>Drag & Drop Resume</p>
      </motion.div>

      {acceptedFiles[0] && (
        <button
          onClick={() => onNext(acceptedFiles[0])}
          className="mt-6 px-6 py-3 bg-blue-600 rounded-xl"
        >
          Analyze Resume
        </button>
      )}
    </div>
  );
}
