import { useState } from "react";
import UploadPage from "./pages/UploadPage";
import ProgressPage from "./pages/ProgressPage";
import ResultsPage from "./pages/ResultsPage";

export default function App() {
  const [page, setPage] = useState("upload");
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);

  return (
    <>
      {page === "upload" && (
        <UploadPage onNext={(f) => { setFile(f); setPage("progress"); }} />
      )}

      {page === "progress" && (
        <ProgressPage
          file={file}
          onDone={(d) => { setData(d); setPage("results"); }}
        />
      )}

      {page === "results" && (
        <ResultsPage data={data} onReset={() => setPage("upload")} />
      )}
    </>
  );
}
