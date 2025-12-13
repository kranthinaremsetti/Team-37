export default function EvaluationTable({ evaluation }) {
  if (!evaluation) return null;

  return (
    <div className="bg-white p-4 rounded shadow mb-6 overflow-auto">
      <h2 className="text-xl font-semibold mb-4">Evaluation Breakdown</h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Criterion</th>
            <th className="border p-2">Weight</th>
            <th className="border p-2">Score</th>
            <th className="border p-2">Observations</th>
          </tr>
        </thead>
        <tbody>
          {evaluation.map((e, i) => (
            <tr key={i}>
              <td className="border p-2">{e.criterion}</td>
              <td className="border p-2">{e.weight}</td>
              <td className="border p-2">{e.score}</td>
              <td className="border p-2">{e.observations}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
