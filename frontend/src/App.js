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

export default function App() {
  const [url, setUrl] = useState("");
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

  return (
    /* 🔥 GRADIENT BACKGROUND APPLIED HERE */
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a] text-white">
      
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Input Card */}
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
      </div>
    </div>
  );
}
