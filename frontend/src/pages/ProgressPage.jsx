import { useEffect } from "react";
import axios from "axios";

export default function ProgressPage({ file, onDone }) {
  useEffect(() => {
    const formData = new FormData();
    formData.append("file", file);

    axios.post("http://localhost:8000/api/resume/", formData)
      .then(res => onDone(res.data));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-xl animate-pulse">Analyzing Resume...</h2>
    </div>
  );
}
