export default function ScoreCircle({ score }) {
  const color =
    score >= 70 ? "text-green-600" :
    score >= 40 ? "text-yellow-600" :
    "text-red-600";

  return (
    <div className="bg-white p-6 rounded shadow mb-6 flex justify-center">
      <div className="relative w-40 h-40 rounded-full border-8 border-gray-200 flex items-center justify-center">
        <div className={`text-4xl font-bold ${color}`}>
          {score}
        </div>
        <div className="absolute bottom-4 text-sm text-gray-500">
          Final Score
        </div>
      </div>
    </div>
  );
}
