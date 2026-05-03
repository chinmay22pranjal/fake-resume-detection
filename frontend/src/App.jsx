import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import UploadPage from './pages/UploadPage.jsx'
import ProgressPage from './pages/ProgressPage.jsx'
import ResultsPage from './pages/ResultsPage.jsx'
import Navbar from './components/Navbar.jsx'

// App states: 'upload' → 'analyzing' → 'results'
export default function App() {
  const [page, setPage] = useState('upload')
  const [file, setFile] = useState(null)
  const [results, setResults] = useState(null)

  const handleFileReady = (selectedFile) => {
    setFile(selectedFile)
    setPage('analyzing')
  }

  const handleAnalysisComplete = (data) => {
    setResults(data)
    setPage('results')
  }

  const handleReset = () => {
    setFile(null)
    setResults(null)
    setPage('upload')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-right" />
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {page === 'upload' && (
          <UploadPage onFileReady={handleFileReady} />
        )}
        {page === 'analyzing' && (
          <ProgressPage
            file={file}
            onComplete={handleAnalysisComplete}
            onError={handleReset}
          />
        )}
        {page === 'results' && results && (
          <ResultsPage results={results} onReset={handleReset} />
        )}
      </main>
    </div>
  )
}
