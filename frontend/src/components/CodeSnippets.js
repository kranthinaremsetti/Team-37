export default function CodeSnippets({ snippets }) {
  if (!snippets.length) return null;

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Important Code Snippets</h2>

      {snippets.map((s, i) => (
        <div key={i} className="mb-4">
          <p className="text-sm font-semibold text-gray-700">{s.file}</p>
          <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-auto">
            {s.code}
          </pre>
        </div>
      ))}
    </div>
  );
}
