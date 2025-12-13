export default function LanguagesBar({ languages }) {
  if (!languages) return null;

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-2">Languages Used</h2>
      <div className="flex flex-wrap gap-3">
        {Object.entries(languages).map(([lang, loc]) => (
          <span
            key={lang}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded"
          >
            {lang}
          </span>
        ))}
      </div>
    </div>
  );
}
