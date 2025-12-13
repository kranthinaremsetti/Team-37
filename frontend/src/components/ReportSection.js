export default function ReportSection({ title, children }) {
  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className="text-gray-800">{children}</div>
    </div>
  );
}
