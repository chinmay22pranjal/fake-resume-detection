import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

export default function UploadPage({ onFileReady }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ File drop handler
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      toast.error("Invalid file type");
      return;
    }

    const file = acceptedFiles[0];

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large (Max 10MB)");
      return;
    }

    setSelectedFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  // ✅ MAIN ANALYZE FUNCTION
  const handleAnalyze = async () => {
    try {
      if (!selectedFile) return;

      setLoading(true);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch(
        "https://fake-resume-detection-4.onrender.com/api/resume/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      // 🔥 ERROR HANDLING
      if (!res.ok) {
        const errorText = await res.text();
        console.log("Backend Error:", errorText);
        toast.error("Backend Error!");
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log("SUCCESS:", data);

      toast.success("Analysis Completed!");
      onFileReady(data);

    } catch (err) {
      console.error("ERROR:", err);
      toast.error("Server not responding!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">

      {/* 🔹 Drop Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 w-full max-w-lg text-center cursor-pointer transition ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-lg">
          {isDragActive
            ? "Drop your file here"
            : "Drag & drop resume or click to upload"}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          PDF, DOCX, TXT (Max 10MB)
        </p>
      </div>

      {/* 🔹 Selected File */}
      {selectedFile && (
        <div className="text-sm text-gray-700">
          Selected: <b>{selectedFile.name}</b>
        </div>
      )}

      {/* 🔹 Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={!selectedFile || loading}
        className={`px-6 py-3 rounded-xl font-semibold text-white transition ${
          selectedFile
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>
    </div>
  );
}
