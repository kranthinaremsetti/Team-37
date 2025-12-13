export default function RepoSummary({ metadata }) {
  return (
    <div className="bg-white p-4 rounded mb-4 shadow">
      <h2 className="text-xl font-semibold mb-2">
        {metadata.full_name}
      </h2>
      <p>Commits: {metadata.commits.length}</p>
      <p>Contributors: {metadata.contributors.length}</p>
      <p>Last Updated: {metadata.updated_at}</p>
    </div>
  );
}
