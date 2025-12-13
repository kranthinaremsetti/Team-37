import { useState } from "react";
import { analyzeRepo } from "./api/analyze";

import Header from "./components/Header";
import RepoOverview from "./components/RepoOverview";
import StructureTree from "./components/StructureTree";
import ReportSection from "./components/ReportSection";
import CodeSnippets from "./components/CodeSnippets";
import EvaluationTable from "./components/EvaluationTable";
import ContributorsList from "./components/ContributorsList";
import LanguagesBar from "./components/LanguagesBar";
import VivaQuestions from "./components/VivaQuestions";

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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="max-w-6xl mx-auto p-6">
        {/* Input */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <input
            className="border p-2 w-3/4 rounded"
            placeholder="Enter GitHub repository URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={handleAnalyze}
            className="ml-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Analyze
          </button>
        </div>

        {loading && <p className="text-center">Analyzing…</p>}
        {error && <p className="text-red-600">{error}</p>}

        {data && (
          <>
            <RepoOverview data={data} />
            <LanguagesBar languages={data.languages} />
            <ContributorsList contributors={data.contributors} />
            <StructureTree tree={data.structure?.ascii_tree} />

            <ReportSection title="Problem Statement">
              {data.friend_report.problem_statement}
            </ReportSection>

            <ReportSection title="Solution Overview">
              {data.friend_report.solution_overview}
            </ReportSection>

            <ReportSection title="Relevance">
              <pre className="bg-gray-900 text-green-300 p-4 rounded text-sm overflow-auto">
                {data.friend_report.relevance}
              </pre>
            </ReportSection>

            <ReportSection title="Concept Mastery">
              {data.friend_report.concept_mastery}
            </ReportSection>

            <ReportSection title="Strengths">
              <ul className="list-disc ml-6">
                {data.friend_report.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </ReportSection>

            <ReportSection title="Weaknesses">
              <ul className="list-disc ml-6">
                {data.friend_report.weaknesses.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </ReportSection>

            <EvaluationTable evaluation={data.friend_report.evaluation} />

            <ReportSection title="Final Score">
              <div className="text-3xl font-bold text-blue-600">
                {data.friend_report.final_weighted_score} / 100
              </div>
            </ReportSection>

            <VivaQuestions questions={data.friend_report.viva_questions} />

            <CodeSnippets snippets={data.codeSnippets || []} />
          </>
        )}
      </div>
    </div>
  );
}
