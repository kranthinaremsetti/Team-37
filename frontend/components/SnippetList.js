import SnippetCard from "./SnippetCard";

export default function SnippetList({ snippets }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Key Code Snippets</h3>
      <div className="space-y-4">
        {snippets.map((s, i) => (
          <SnippetCard key={i} snippet={s} />
        ))}
      </div>
    </div>
  );
}
