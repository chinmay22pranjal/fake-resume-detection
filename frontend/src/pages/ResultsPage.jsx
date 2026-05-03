import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const VERDICT_CONFIG = {
  GENUINE:    { bg: 'bg-green-50',  border: 'border-green-300', text: 'text-green-800',  badge: 'bg-green-500', icon: '✓', label: 'Genuine' },
  SUSPICIOUS: { bg: 'bg-amber-50',  border: 'border-amber-300', text: 'text-amber-800',  badge: 'bg-amber-500', icon: '⚠', label: 'Suspicious' },
  FAKE:       { bg: 'bg-red-50',    border: 'border-red-300',   text: 'text-red-800',    badge: 'bg-red-500',   icon: '✗', label: 'Fake / Manipulated' },
}

const SEVERITY_COLOR = {
  low:    'bg-slate-100 text-slate-600',
  medium: 'bg-amber-100 text-amber-700',
  high:   'bg-red-100 text-red-700',
}

export default function ResultsPage({ results, onReset }) {
  const [downloading, setDownloading] = useState(false)
  const [showRawText, setShowRawText] = useState(false)

  const { analysis, resume_data, linkedin, file_format, raw_text_preview } = results
  const verdict = analysis?.overall_verdict || 'SUSPICIOUS'
  const config = VERDICT_CONFIG[verdict] || VERDICT_CONFIG.SUSPICIOUS
  const confidence = analysis?.confidence_score || 0

  const downloadReport = async () => {
    setDownloading(true)
    try {
      const res = await axios.post('/api/report/download', {
        analysis,
        resume_data,
        linkedin_data: linkedin?.data || {}
      }, { responseType: 'blob' })
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url
      a.download = `resume_report_${resume_data?.full_name?.replace(/ /g, '_') || 'candidate'}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Report downloaded!')
    } catch {
      toast.error('Failed to download report.')
    }
    setDownloading(false)
  }

  return (
    <div className="fade-in space-y-6">
      {/* Verdict Banner */}
      <div className={`rounded-2xl border-2 p-6 ${config.bg} ${config.border}`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 ${config.badge} rounded-full flex items-center justify-center text-white text-2xl font-bold`}>
              {config.icon}
            </div>
            <div>
              <p className={`text-sm font-medium ${config.text} opacity-70`}>Overall Verdict</p>
              <h2 className={`text-3xl font-bold ${config.text}`}>{config.label}</h2>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-5xl font-bold ${config.text}`}>{confidence}%</div>
            <div className={`text-sm ${config.text} opacity-70`}>Confidence Score</div>
          </div>
        </div>
        {analysis?.summary && (
          <p className={`mt-4 text-sm ${config.text} opacity-80 leading-relaxed border-t ${config.border} pt-4`}>
            {analysis.summary}
          </p>
        )}
      </div>

      {/* Meta info row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Candidate', value: resume_data?.full_name || 'Unknown' },
          { label: 'File Format', value: file_format || 'Unknown' },
          { label: 'LinkedIn Found', value: linkedin?.url ? 'Yes' : 'Not Found' },
          { label: 'LinkedIn Source', value: linkedin?.source === 'resume' ? 'In Resume' : 'Auto-Discovered' },
        ].map(item => (
          <div key={item.label} className="bg-white border border-slate-200 rounded-xl p-3">
            <p className="text-xs text-slate-500 mb-1">{item.label}</p>
            <p className="font-semibold text-slate-800 text-sm truncate">{item.value}</p>
          </div>
        ))}
      </div>

      {/* LinkedIn info */}
      {linkedin?.url && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">in</div>
          <div className="flex-1">
            <p className="text-xs text-slate-500">LinkedIn Profile Used</p>
            <a href={linkedin.url} target="_blank" rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm font-medium truncate block">{linkedin.url}</a>
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full
            ${linkedin.confidence === 'high' ? 'bg-green-100 text-green-700' :
              linkedin.confidence === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
            {linkedin.confidence} confidence
          </span>
        </div>
      )}

      {/* Side-by-side comparison */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Resume Data */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-xs">📄</span>
            Resume Claims
          </h3>
          <div className="space-y-2.5 text-sm">
            {[
              ['Title', resume_data?.current_title],
              ['Company', resume_data?.current_company],
              ['Location', resume_data?.location],
              ['Experience', resume_data?.total_years_experience ? `${resume_data.total_years_experience} years` : null],
              ['Education', resume_data?.education?.[0] ? `${resume_data.education[0].degree} — ${resume_data.education[0].institution}` : null],
            ].map(([label, val]) => val ? (
              <div key={label} className="flex gap-2">
                <span className="text-slate-500 w-24 flex-shrink-0">{label}</span>
                <span className="text-slate-800 font-medium">{val}</span>
              </div>
            ) : null)}
            {resume_data?.skills?.length > 0 && (
              <div>
                <span className="text-slate-500 text-xs block mb-1">Skills</span>
                <div className="flex flex-wrap gap-1">
                  {resume_data.skills.slice(0, 10).map(s => (
                    <span key={s} className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* LinkedIn Data */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center text-xs">🔗</span>
            LinkedIn Profile
          </h3>
          {linkedin?.data && Object.keys(linkedin.data).length > 0 ? (
            <div className="space-y-2.5 text-sm">
              {[
                ['Title', linkedin.data.current_title || linkedin.data.headline],
                ['Company', linkedin.data.current_company],
                ['Location', linkedin.data.location],
                ['Connections', linkedin.data.connections ? `${linkedin.data.connections}+` : null],
                ['Education', linkedin.data.education?.[0] ? `${linkedin.data.education[0].degree} — ${linkedin.data.education[0].institution}` : null],
              ].map(([label, val]) => val ? (
                <div key={label} className="flex gap-2">
                  <span className="text-slate-500 w-24 flex-shrink-0">{label}</span>
                  <span className="text-slate-800 font-medium">{val}</span>
                </div>
              ) : null)}
              {linkedin.data.skills?.length > 0 && (
                <div>
                  <span className="text-slate-500 text-xs block mb-1">Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {linkedin.data.skills.slice(0, 10).map(s => (
                      <span key={s} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">{linkedin?.scrape_error || 'LinkedIn data unavailable'}</p>
          )}
        </div>
      </div>

      {/* Field-by-field checks */}
      {analysis?.checks?.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Field Verification Results</h3>
          <div className="space-y-2">
            {analysis.checks.map((check, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-0">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                  ${check.match ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {check.match ? '✓' : '✗'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-slate-800 text-sm">{check.field}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SEVERITY_COLOR[check.severity] || SEVERITY_COLOR.low}`}>
                      {check.severity}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                    <div>Resume: <span className="text-slate-700">{check.resume_value || 'N/A'}</span></div>
                    <div>LinkedIn: <span className="text-slate-700">{check.linkedin_value || 'N/A'}</span></div>
                    {check.note && <div className="text-amber-600 italic">{check.note}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Red Flags & Positive Signals */}
      <div className="grid md:grid-cols-2 gap-4">
        {analysis?.red_flags?.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">🚩 Red Flags</h3>
            <ul className="space-y-1.5">
              {analysis.red_flags.map((flag, i) => (
                <li key={i} className="text-red-700 text-sm flex gap-2">
                  <span className="text-red-400 flex-shrink-0">•</span>{flag}
                </li>
              ))}
            </ul>
          </div>
        )}
        {analysis?.positive_signals?.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">✅ Positive Signals</h3>
            <ul className="space-y-1.5">
              {analysis.positive_signals.map((sig, i) => (
                <li key={i} className="text-green-700 text-sm flex gap-2">
                  <span className="text-green-400 flex-shrink-0">•</span>{sig}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Raw text collapsible */}
      {raw_text_preview && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <button onClick={() => setShowRawText(!showRawText)}
            className="w-full px-5 py-3.5 flex items-center justify-between text-sm font-medium text-slate-700 hover:bg-slate-50">
            <span>Extracted Text Preview</span>
            <span className="text-slate-400">{showRawText ? '▲' : '▼'}</span>
          </button>
          {showRawText && (
            <pre className="px-5 pb-5 text-xs text-slate-600 whitespace-pre-wrap font-mono bg-slate-50 max-h-48 overflow-y-auto">
              {raw_text_preview}
            </pre>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 flex-wrap">
        <button onClick={downloadReport} disabled={downloading}
          className="flex-1 py-3.5 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors disabled:opacity-50">
          {downloading ? 'Downloading...' : '⬇ Download PDF Report'}
        </button>
        <button onClick={onReset}
          className="flex-1 py-3.5 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:border-slate-400 transition-colors">
          🔄 Analyze Another Resume
        </button>
      </div>
    </div>
  )
}
