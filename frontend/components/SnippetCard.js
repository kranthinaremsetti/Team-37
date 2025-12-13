export default function SnippetCard({ snippet }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p className="text-sm text-gray-600 mb-1">{snippet.file}</p>
      <p className="text-xs mb-2">
        Reasons: {snippet.reasons.join(", ")}
      </p>
      <pre className="bg-gray-900 text-green-300 text-xs p-3 overflow-auto rounded">
        {snippet.code.slice(0, 1200)}
      </pre>
    </div>
  );
}
