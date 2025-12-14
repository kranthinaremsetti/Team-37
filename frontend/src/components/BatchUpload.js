import { useState } from "react";

export default function BatchUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a CSV file");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:3000/api/analyze/batch", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#020617]/80 border border-white/10 p-6 rounded-xl shadow mb-8">
      <h3 className="text-xl font-semibold mb-4 text-blue-400">Batch Analysis</h3>
      <p className="text-gray-400 text-sm mb-4">
        Upload a CSV file with columns: <code className="bg-gray-800 px-2 py-1 rounded">teamName</code> and <code className="bg-gray-800 px-2 py-1 rounded">repoUrl</code>
      </p>

      <div className="flex gap-4 items-center">
        <label className="flex-1 cursor-pointer">
          <div className="bg-transparent border border-white/20 px-4 py-2 rounded text-gray-400 hover:border-blue-500 transition">
            {file ? file.name : "Choose CSV file..."}
          </div>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="bg-green-600 hover:bg-green-500 transition px-6 py-2 rounded font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {loading ? "Uploading..." : "Upload & Analyze"}
        </button>
      </div>

      {loading && (
        <div className="mt-4 text-center">
          <p className="text-blue-400">⏳ Processing batch analysis...</p>
          <p className="text-gray-500 text-sm mt-2">This may take a few minutes</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded text-red-400">
          ❌ {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-900/20 border border-green-500/30 rounded">
          <h4 className="text-green-400 font-semibold mb-2">✅ Batch Analysis Complete!</h4>
          <p className="text-gray-300 mb-2">
            <strong>Batch ID:</strong> <code className="bg-gray-800 px-2 py-1 rounded">{result.batch_id}</code>
          </p>
          <p className="text-gray-300 mb-3">
            <strong>Teams Processed:</strong> {result.total_teams}
          </p>
          
          <div className="space-y-2">
            {result.results?.map((team, idx) => (
              <div
                key={idx}
                className={`p-2 rounded ${
                  team.status === "success"
                    ? "bg-green-800/30 border border-green-600/30"
                    : "bg-red-800/30 border border-red-600/30"
                }`}
              >
                <span className="font-medium">{team.team_name}</span>
                {team.status === "success" ? (
                  <span className="ml-2 text-green-400">✓ Saved to database</span>
                ) : (
                  <span className="ml-2 text-red-400">✗ {team.error}</span>
                )}
              </div>
            ))}
          </div>

          <p className="text-gray-400 text-sm mt-4">
            You can now query individual team reports using the batch ID or team name.
          </p>
        </div>
      )}
    </div>
  );
}
