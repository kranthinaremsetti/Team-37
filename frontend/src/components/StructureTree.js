export default function StructureTree({ tree }) {
  if (!tree) return null;

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-2">Project Structure</h2>
      <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto text-sm">
        {tree}
      </pre>
    </div>
  );
}
