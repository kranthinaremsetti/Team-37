export default function ContributorsList({ contributors }) {
  if (!contributors) return null;

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-2">Contributors</h2>
      <ul className="list-disc ml-6">
        {contributors.map((c, i) => (
          <li key={i}>
            {c.login} — {c.contributions} commits
          </li>
        ))}
      </ul>
    </div>
  );
}
