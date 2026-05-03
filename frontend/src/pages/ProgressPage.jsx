import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const STEPS = [
  { id: 1, label: 'Extracting resume content...', sublabel: 'Parsing text from your file' },
  { id: 2, label: 'Parsing fields with AI...', sublabel: 'GPT-4 identifying name, skills, experience' },
  { id: 3, label: 'Finding LinkedIn profile...', sublabel: 'Searching and auto-discovering profile' },
  { id: 4, label: 'Cross-verifying data...', sublabel: 'Comparing resume vs LinkedIn with AI' },
]

export default function ProgressPage({ file, onComplete, onError }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState(null)

  useEffect(() => {
    let stepTimer
    const runAnalysis = async () => {
      // Animate steps visually
      for (let i = 0; i < STEPS.length; i++) {
        await new Promise(r => setTimeout(r, 1200))
        setCurrentStep(i + 1)
      }

      // Send to backend
      const formData = new FormData()
      formData.append('file', file)

      try {
        const res = await axios.post('/api/resume/analyze', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 120000, // 2 min timeout for AI + scraping
        })
        onComplete(res.data)
      } catch (err) {
        const msg = err.response?.data?.detail?.error || err.response?.data?.detail || 'Analysis failed. Please try again.'
        toast.error(msg)
        setError(msg)
      }
    }

    runAnalysis()
    return () => clearTimeout(stepTimer)
  }, [file])

  if (error) {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center fade-in">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Analysis Failed</h2>
        <p className="text-slate-500 mb-6 text-sm">{error}</p>
        <button onClick={onError} className="bg-sky-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-sky-600">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto mt-16 fade-in">
      <div className="text-center mb-10">
        <div className="w-20 h-20 rounded-full border-4 border-sky-200 border-t-sky-500 spin mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyzing Resume...</h2>
        <p className="text-slate-500">Please wait while our AI verifies the authenticity</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        {STEPS.map((step, i) => {
          const done = currentStep > step.id
          const active = currentStep === step.id
          const pending = currentStep < step.id

          return (
            <div key={step.id} className={`flex items-start gap-4 transition-all duration-300 ${pending ? 'opacity-40' : ''}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                ${done ? 'bg-green-500' : active ? 'bg-sky-500' : 'bg-slate-200'}`}>
                {done ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                ) : active ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent spin"></div>
                ) : (
                  <span className="text-slate-400 text-sm font-medium">{i + 1}</span>
                )}
              </div>
              <div>
                <p className={`font-medium text-sm ${done ? 'text-green-700' : active ? 'text-sky-700' : 'text-slate-500'}`}>
                  {step.label}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{step.sublabel}</p>
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-center text-xs text-slate-400 mt-4">
        This may take 20–60 seconds depending on file complexity
      </p>
    </div>
  )
}
