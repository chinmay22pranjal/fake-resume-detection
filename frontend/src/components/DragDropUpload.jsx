import React, { useState } from "react";
import axios from "axios";

const DragDropUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    uploadFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    uploadFile(file);
  };

  const uploadFile = async (file) => {
    setFileName(file.name);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:8000/analyze", formData);
      window.location.href = "/progress";
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
    <div className="flex justify-center mt-16 px-6">
      <div
        className={`w-full max-w-xl p-10 rounded-2xl text-center border-2 border-dashed transition-all duration-300 ${
          dragActive
            ? "border-blue-500 bg-blue-50 scale-105"
            : "border-gray-300 bg-white"
        } shadow-xl`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <h2 className="text-2xl font-bold mb-4">Upload Resume</h2>

        <p className="text-gray-500 mb-4">
          Drag & drop your resume here or click below
        </p>

        <input
          type="file"
          onChange={handleFileSelect}
          className="block mx-auto"
        />

        {fileName && (
          <p className="mt-4 text-green-600">
            Uploaded: {fileName}
          </p>
        )}
      </div>
    </div>
  );
};

export default DragDropUpload;
