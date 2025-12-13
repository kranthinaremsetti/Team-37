import { useState } from "react";
import { analyzeRepo } from "./api/analyze";
import RepoSummary from "./components/RepoSummary";
import StaticMetrics from "./components/StaticMetrics";
import SnippetList from "./components/SnippetList";

export default function App() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // ✅ FIX

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await analyzeRepo(url);

      if (!res.success) {
        throw new Error(res.error || "Backend analysis failed");
      }

      setData(res);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">GitHub Repo Analyzer</h1>

      <div className="flex gap-4 mb-6">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste GitHub repo URL"
          className="flex-1 p-3 border rounded"
        />
        <button
          onClick={handleAnalyze}
          className="bg-black text-white px-6 rounded"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {/* ✅ Error UI */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {data && (
        <>
          <RepoSummary metadata={data.metadata} />
          <StaticMetrics metrics={data.staticMetrics} />
          <SnippetList snippets={data.snippets} />
        </>
      )}
    </div>
  );
}
