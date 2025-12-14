import { useState } from "react";
import { analyzeRepo } from "./api/analyze";

import Header from "./components/Header";
import ReportSection from "./components/ReportSection";
import StructureTree from "./components/StructureTree";
import EvaluationTable from "./components/EvaluationTable";
import ContributorsChart from "./components/ContributorsChart";
import LanguagesBar from "./components/LanguagesBar";
import VivaQuestions from "./components/VivaQuestions";
import Gauge from "./components/Gauge";
import BatchUpload from "./components/BatchUpload";

export default function App() {
  const [activeTab, setActiveTab] = useState("single"); // 'single', 'batch', or 'view'
  const [url, setUrl] = useState("");
  const [teamName, setTeamName] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await analyzeRepo(url);
      setData(res);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchTeamReport = async () => {
    if (!teamName.trim()) {
      setError("Please enter a team name");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`http://localhost:3000/api/teams/${encodeURIComponent(teamName)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Team not found");
      }

      const teamData = await response.json();
      setData(teamData);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* 🔥 GRADIENT BACKGROUND APPLIED HERE */
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a] text-white">
      
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setActiveTab("single"); setData(null); setError(null); }}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === "single"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            Single Repository
          </button>
          <button
            onClick={() => { setActiveTab("batch"); setData(null); setError(null); }}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === "batch"
                ? "bg-green-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            Batch Upload (CSV)
          </button>
          <button
            onClick={() => { setActiveTab("view"); setData(null); setError(null); }}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === "view"
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            View Team Report
          </button>
        </div>

        {/* Single Repository Analysis */}
        {activeTab === "single" && (
          <>
            <div className="bg-[#020617]/80 border border-white/10 p-5 rounded-xl shadow mb-8">
              <div className="flex gap-4">
                <input
                  className="flex-1 bg-transparent border border-white/20 px-4 py-2 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="Enter GitHub repository URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <button
                  onClick={handleAnalyze}
                  className="bg-blue-600 hover:bg-blue-500 transition px-6 py-2 rounded font-semibold"
                >
                  Analyze
                </button>
              </div>
            </div>

            {loading && (
              <p className="text-center text-gray-300">Analyzing repository…</p>
            )}

            {error && (
              <p className="text-center text-red-400">{error}</p>
            )}

            {data && (
              <>
                {/* Meta Sections */}
                <ReportSection title="Languages Used">
                  <LanguagesBar languages={data.languages} />
                </ReportSection>

                <ReportSection title="Contributors vs Commits">
                  <ContributorsChart contributors={data.contributors} />
                </ReportSection>

                <ReportSection title="Project Structure">
                  <StructureTree tree={data.structure?.ascii_tree} />
                </ReportSection>

                {/* AI Generated Report */}
                <ReportSection title="Problem Statement">
                  {data.friend_report.problem_statement}
                </ReportSection>

                <ReportSection title="Solution Overview">
                  {data.friend_report.solution_overview}
                </ReportSection>

                <ReportSection title="Relevance">
                  <Gauge
                    label="Relevance"
                    level="high"
                    description="Strong alignment between the problem statement and system architecture."
                  />
                </ReportSection>

                <ReportSection title="Concept Mastery">
                  <Gauge
                    label="Concept Mastery"
                    level="medium"
                    description={data.friend_report.concept_mastery}
                  />
                </ReportSection>

                <ReportSection title="Strengths">
                  <ul className="list-disc ml-5 space-y-1">
                    {data.friend_report.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </ReportSection>

                <ReportSection title="Weaknesses">
                  <ul className="list-disc ml-5 space-y-1">
                    {data.friend_report.weaknesses.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </ReportSection>

                <ReportSection title="Evaluation">
                  <EvaluationTable evaluation={data.friend_report.evaluation} />
                </ReportSection>

                <ReportSection title="Final Score">
                  <div className="text-4xl font-bold text-blue-400 text-center">
                    {data.friend_report.final_weighted_score} / 100
                  </div>
                </ReportSection>

                <ReportSection title="Viva Questions">
                  <VivaQuestions questions={data.friend_report.viva_questions} />
                </ReportSection>
              </>
            )}
          </>
        )}

        {/* Batch Upload Tab */}
        {activeTab === "batch" && <BatchUpload />}

        {/* View Team Report Tab */}
        {activeTab === "view" && (
          <>
            <div className="bg-[#020617]/80 border border-white/10 p-5 rounded-xl shadow mb-8">
              <div className="flex gap-4">
                <input
                  className="flex-1 bg-transparent border border-white/20 px-4 py-2 rounded text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  placeholder="Enter team name (e.g., Team Alpha)"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleFetchTeamReport()}
                />
                <button
                  onClick={handleFetchTeamReport}
                  className="bg-purple-600 hover:bg-purple-500 transition px-6 py-2 rounded font-semibold"
                >
                  Fetch Report
                </button>
              </div>
            </div>

            {loading && (
              <p className="text-center text-gray-300">Fetching team report…</p>
            )}

            {error && (
              <div className="text-center p-4 bg-red-900/20 border border-red-500/30 rounded text-red-400">
                {error}
              </div>
            )}

            {data && (
              <>
                {/* Team Info Header */}
                <div className="bg-[#020617]/80 border border-white/10 p-5 rounded-xl shadow mb-6">
                  <h2 className="text-2xl font-bold text-purple-400 mb-2">{data.team_name}</h2>
                  <p className="text-gray-400 text-sm">Batch ID: {data.batch_id}</p>
                  <p className="text-gray-400 text-sm">Analyzed: {new Date(data.created_at).toLocaleString()}</p>
                </div>

                {/* Meta Sections */}
                <ReportSection title="Languages Used">
                  <LanguagesBar languages={data.languages} />
                </ReportSection>

                <ReportSection title="Contributors vs Commits">
                  <ContributorsChart contributors={data.contributors} />
                </ReportSection>

                <ReportSection title="Project Structure">
                  <StructureTree tree={data.structure?.ascii_tree} />
                </ReportSection>

                {/* AI Generated Report - Check if friend_report exists */}
                {data.friend_report && (
                  <>
                    <ReportSection title="Problem Statement">
                      {data.friend_report.problem_statement}
                    </ReportSection>

                    <ReportSection title="Solution Overview">
                      {data.friend_report.solution_overview}
                    </ReportSection>

                    <ReportSection title="Relevance">
                      <Gauge
                        label="Relevance"
                        level="high"
                        description={data.friend_report.relevance}
                      />
                    </ReportSection>

                    <ReportSection title="Concept Mastery">
                      <Gauge
                        label="Concept Mastery"
                        level="medium"
                        description={data.friend_report.concept_mastery}
                      />
                    </ReportSection>

                    <ReportSection title="Strengths">
                      <ul className="list-disc ml-5 space-y-1">
                        {data.friend_report.strengths?.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </ReportSection>

                    <ReportSection title="Weaknesses">
                      <ul className="list-disc ml-5 space-y-1">
                        {data.friend_report.weaknesses?.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </ReportSection>

                    <ReportSection title="Evaluation">
                      <EvaluationTable evaluation={data.friend_report.evaluation} />
                    </ReportSection>

                    <ReportSection title="Final Score">
                      <div className="text-4xl font-bold text-purple-400 text-center">
                        {data.friend_report.final_weighted_score} / 100
                      </div>
                    </ReportSection>

                    <ReportSection title="Viva Questions">
                      <VivaQuestions questions={data.friend_report.viva_questions} />
                    </ReportSection>
                  </>
                )}

                {!data.friend_report && (
                  <div className="text-center p-4 bg-yellow-900/20 border border-yellow-500/30 rounded text-yellow-400">
                    ⚠️ AI report not available for this team
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
