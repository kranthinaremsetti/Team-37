export default function ContributorsChart({ contributors }) {
  if (!contributors) return null;

  const max = Math.max(...contributors.map(c => c.contributions));

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">
        Contributors vs Commits
      </h2>

      <div className="space-y-3">
        {contributors.map((c, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-1">
              <span>{c.login}</span>
              <span>{c.contributions}</span>
            </div>
            <div className="w-full bg-gray-200 rounded h-3">
              <div
                className="bg-blue-600 h-3 rounded"
                style={{
                  width: `${(c.contributions / max) * 100}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
