import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/msword': ['.doc'],
  'text/plain': ['.txt'],
  'text/rtf': ['.rtf'],
  'application/rtf': ['.rtf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/bmp': ['.bmp'],
  'image/tiff': ['.tiff', '.tif'],
}

const FORMAT_ICONS = [
  { ext: 'PDF', color: 'bg-red-100 text-red-700' },
  { ext: 'DOCX', color: 'bg-blue-100 text-blue-700' },
  { ext: 'DOC', color: 'bg-blue-100 text-blue-700' },
  { ext: 'JPG', color: 'bg-yellow-100 text-yellow-700' },
  { ext: 'PNG', color: 'bg-green-100 text-green-700' },
  { ext: 'TXT', color: 'bg-slate-100 text-slate-700' },
  { ext: 'RTF', color: 'bg-purple-100 text-purple-700' },
  { ext: 'WEBP', color: 'bg-orange-100 text-orange-700' },
]

export default function UploadPage({ onFileReady }) {
  const [selectedFile, setSelectedFile] = useState(null)

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) {
      toast.error('File type not supported. Please upload PDF, DOCX, DOC, JPG, PNG, TXT, RTF, or WEBP.')
      return
    }
    if (accepted.length > 0) {
      const file = accepted[0]
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File too large. Maximum size is 10 MB.')
        return
      }
      setSelectedFile(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    multiple: false,
  })

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="fade-in">
      {/* Hero */}
      <div className="text-center mb-10 mt-4">
        <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-200 rounded-full px-4 py-1.5 text-sky-700 text-sm font-medium mb-5">
          <span className="w-2 h-2 bg-sky-500 rounded-full pulse-ring inline-block"></span>
          Powered by GPT-4 + LinkedIn Verification
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-3">Detect Fake Resumes Instantly</h1>
        <p className="text-slate-500 text-lg max-w-xl mx-auto">
          Upload any resume format. Our AI automatically finds the LinkedIn profile, cross-verifies every detail, and flags manipulation.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="max-w-2xl mx-auto">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200
            ${isDragActive
              ? 'border-sky-400 bg-sky-50'
              : 'border-slate-300 bg-white hover:border-sky-400 hover:bg-sky-50'
            }`}
        >
          <input {...getInputProps()} />
          <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
            </svg>
          </div>
          {isDragActive ? (
            <p className="text-sky-600 font-semibold text-lg">Drop it here!</p>
          ) : (
            <>
              <p className="text-slate-700 font-semibold text-lg mb-1">Drag & drop your resume here</p>
              <p className="text-slate-400 text-sm mb-4">or click to browse files</p>
            </>
          )}
          <div className="flex flex-wrap gap-2 justify-center">
            {FORMAT_ICONS.map(f => (
              <span key={f.ext} className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${f.color}`}>{f.ext}</span>
            ))}
          </div>
          <p className="text-slate-400 text-xs mt-3">Max file size: 10 MB</p>
        </div>

        {/* Selected File Preview */}
        {selectedFile && (
          <div className="mt-4 bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 fade-in">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-600">
              {selectedFile.name.split('.').pop().toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-800 truncate">{selectedFile.name}</p>
              <p className="text-sm text-slate-500">{formatSize(selectedFile.size)}</p>
            </div>
            <button onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-slate-600 p-1">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        )}

        {/* Analyze Button */}
        <button
          onClick={() => selectedFile && onFileReady(selectedFile)}
          disabled={!selectedFile}
          className={`w-full mt-5 py-4 rounded-xl font-semibold text-lg transition-all duration-200
            ${selectedFile
              ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-200 hover:shadow-sky-300 hover:-translate-y-0.5'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
        >
          {selectedFile ? '🔍 Analyze Resume' : 'Select a file to continue'}
        </button>
      </div>

      {/* How it works */}
      <div className="max-w-2xl mx-auto mt-12 grid grid-cols-3 gap-4">
        {[
          { icon: '📄', title: 'Upload', desc: 'Any resume format — PDF, DOCX, image, TXT' },
          { icon: '🔗', title: 'Auto-Verify', desc: 'AI finds LinkedIn profile automatically' },
          { icon: '🛡️', title: 'AI Report', desc: 'Genuine / Suspicious / Fake verdict' },
        ].map((step, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">{step.icon}</div>
            <div className="font-semibold text-slate-800 text-sm mb-1">{step.title}</div>
            <div className="text-slate-500 text-xs">{step.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
