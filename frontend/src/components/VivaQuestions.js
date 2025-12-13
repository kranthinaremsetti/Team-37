export default function VivaQuestions({ questions }) {
  if (!questions) return null;

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-2">Viva / Interview Questions</h2>
      <ol className="list-decimal ml-6">
        {questions.map((q, i) => (
          <li key={i} className="mb-2">{q}</li>
        ))}
      </ol>
    </div>
  );
}
