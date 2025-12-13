export default function RepoOverview({ data }) {
  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-2">Repository Overview</h2>
      <p><strong>Commits:</strong> {data.stats.commitCount}</p>
      <p><strong>Contributors:</strong> {data.stats.contributorCount}</p>
    </div>
  );
}
