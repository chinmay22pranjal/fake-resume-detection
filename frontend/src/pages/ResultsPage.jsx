import { motion } from "framer-motion";

export default function ResultsPage({ data, onReset }) {
  const verdict = data?.analysis?.overall_verdict;

  const color =
    verdict === "GENUINE"
      ? "bg-green-500"
      : verdict === "SUSPICIOUS"
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="p-10">

      {/* VERDICT */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className={`${color} p-6 rounded-2xl text-center text-2xl font-bold`}
      >
        {verdict} ({data?.analysis?.confidence_score}%)
      </motion.div>

      {/* DATA CARDS */}
      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <div className="card">
          <h3>Resume</h3>
          <p>{data?.resume_data?.full_name}</p>
        </div>

        <div className="card">
          <h3>LinkedIn</h3>
          <p>{data?.linkedin?.data?.full_name}</p>
        </div>
      </div>

      {/* FLAGS */}
      <div className="mt-10">
        <h3 className="text-red-400">Red Flags</h3>
        <ul>
          {data?.analysis?.red_flags?.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </div>

      {/* ACTIONS */}
      <div className="mt-10 flex gap-4">
        <button className="btn-primary">Download PDF</button>
        <button onClick={onReset} className="bg-gray-700 px-4 py-2 rounded">
          Analyze Again
        </button>
      </div>
    </div>
  );
}
