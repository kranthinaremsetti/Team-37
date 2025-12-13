export async function analyzeRepo(repoUrl) {
  const res = await fetch("http://localhost:3000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repoUrl })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Failed to analyze repository");
  }

  return res.json();
}
