export async function analyzeRepo(repoUrl) {
  const response = await fetch("http://localhost:3000/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      repoUrl // MUST match backend
    })
  });

  // 🔴 important: read error body if not ok
  if (!response.ok) {
    const errText = await response.text();
    console.error("Backend error:", errText);
    throw new Error("Failed to analyze repo");
  }

  return response.json();
}
