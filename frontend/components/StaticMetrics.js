export default function StaticMetrics({ metrics }) {
  return (
    <div className="bg-white p-4 rounded mb-4 shadow">
      <h3 className="text-lg font-semibold mb-2">Code Health</h3>
      <ul className="text-sm space-y-1">
        <li>Total Files: {metrics.totalFiles}</li>
        <li>Total LOC: {metrics.totalLinesOfCode}</li>
        <li>Async Functions: {metrics.asyncFunctionCount}</li>
        <li>Auth Used: {metrics.usesAuth ? "Yes" : "No"}</li>
        <li>DB Used: {metrics.usesDatabase ? "Yes" : "No"}</li>
        <li>Await w/o Try: {metrics.awaitWithoutTryCount}</li>
      </ul>
    </div>
  );
}
