export default function ResultsPage({ data, onReset }) {
  if (!data) return null;

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <div className="glass p-6 text-center mb-6">
        <h1 className="text-2xl font-bold">
          {data.analysis.verdict}
        </h1>
        <p>{data.analysis.confidence}% confidence</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">

        <div className="glass p-4">
          <h2>Resume Data</h2>
          <pre>{JSON.stringify(data.resume_data, null, 2)}</pre>
        </div>

        <div className="glass p-4">
          <h2>LinkedIn Data</h2>
          <pre>{JSON.stringify(data.linkedin, null, 2)}</pre>
        </div>

      </div>

      <button
        onClick={onReset}
        className="mt-6 px-4 py-2 bg-blue-600 rounded"
      >
        Try Again
      </button>
    </div>
  );
}
