import { getRepoMetadata } from "./githubService.js";
import { fetchRepoToTemp } from "./repoFetcherService.js";
import { extractSnippets } from "./snippetExtractorService.js";
import { runStaticCheck } from "./staticCheck.js";
import { generateAsciiTree } from "./asciiTreeService.js";
import { sendToFriendBackend } from "./friendBackendService.js";

export async function analyzeRepository(repoUrl) {
  if (!repoUrl) {
    throw new Error("repoUrl is required");
  }

  console.log("🔍 Analyzing repository:", repoUrl);

  // 1️⃣ Fetch metadata from GitHub
  const metadata = await getRepoMetadata(repoUrl);

  // 2️⃣ Clone repo to temp folder
  const repoPath = await fetchRepoToTemp({
    owner: metadata.owner.login,
    repo: metadata.name,
    branch: metadata.default_branch
  });

  // 3️⃣ Extract stats
  const commitCount = metadata.commits?.length || 0;
  const contributorCount = metadata.contributors?.length || 0;

  const contributorsList = (metadata.contributors || []).map(c => ({
    login: c.login,
    contributions: c.contributions
  }));

  // 4️⃣ Perform static analysis
  const snippets = extractSnippets(repoPath);
  const staticMetrics = runStaticCheck(repoPath);
  const asciiTree = generateAsciiTree(repoPath);

  // 5️⃣ Prepare worker_json for FastAPI
  const workerJson = {
    success: true,
    metadata: {
      name: metadata.name,
      full_name: metadata.full_name,
      description: metadata.description,
      owner: { login: metadata.owner.login },
      html_url: metadata.html_url,
      languages: metadata.languages || {},
      readme: metadata.readme ? { exists: true } : {},
      commits: (metadata.commits || []).slice(0, 5).map(c => ({
        sha: c.sha,
        message: c.message,
        date: c.date,
        author: { name: c.author?.name || "unknown" }
      })),
      contributors: (metadata.contributors || []).map(c => ({
        login: c.login
      }))
    },
    repoPath,
    snippets,
    staticMetrics,
    structure: { ascii_tree: asciiTree }
  };

  // 6️⃣ Try to send to FastAPI (optional - continue if it fails)
  let friendReport = null;
  try {
    console.log("📤 Sending workerJson to FastAPI...");
    friendReport = await sendToFriendBackend(workerJson);
    console.log("✅ FastAPI responded successfully.");
  } catch (error) {
    console.warn("⚠️  FastAPI unavailable, continuing without report:", error.message);
  }

  // 7️⃣ Return final object to controller
  return {
    languages: metadata.languages || {},
    structure: { ascii_tree: asciiTree },
    stats: {
      commitCount,
      contributorCount
    },
    contributors: contributorsList,
    friend_report: friendReport,
    worker_json: workerJson
  };
}
