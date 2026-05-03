export default function Navbar() {
  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div>
          <span className="font-semibold text-slate-800 text-lg">ResumeVerify</span>
          <span className="ml-2 text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full font-medium">AI + LinkedIn</span>
        </div>
        <div className="ml-auto text-sm text-slate-500">Fake Resume Detection System</div>
      </div>
    </nav>
  )
}
