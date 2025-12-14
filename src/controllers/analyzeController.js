import { getRepoMetadata } from "../services/githubService.js";
import { fetchRepoToTemp } from "../services/repoFetcherService.js";
import { extractSnippets } from "../services/snippetExtractorService.js";
import { runStaticCheck } from "../services/staticCheck.js";
import { sendToFriendBackend } from "../services/friendBackendService.js";
import { generateAsciiTree } from "../services/asciiTreeService.js";

export async function analyzeRepo(req, res) {
  try {
    const repoUrl = req.body.repoUrl || req.body.url;
    if (!repoUrl) {
      return res.status(400).json({ error: "repoUrl required" });
    }

    // 1️⃣ Fetch metadata
    const metadata = await getRepoMetadata(repoUrl);

    // 2️⃣ Fetch repo locally
    const repoPath = await fetchRepoToTemp({
      owner: metadata.owner.login,
      repo: metadata.name,
      branch: metadata.default_branch
    });

    const commitCount = metadata.commits ? metadata.commits.length : 0;
    const contributorCount = metadata.contributors ? metadata.contributors.length : 0;

    const contributorsList = (metadata.contributors || []).map(c => ({
      login: c.login,
      contributions: c.contributions
    }));

    // 3️⃣ Static analysis
    const snippets = extractSnippets(repoPath);
    const staticMetrics = runStaticCheck(repoPath);
    const asciiTree = generateAsciiTree(repoPath);

    // 4️⃣ NORMALIZED worker_json (IMPORTANT)
    const workerJson = {
      success: true,
      metadata: {
        name: metadata.name,
        full_name: metadata.full_name,
        description: metadata.description,
        owner: {
          login: metadata.owner.login
        },
        html_url: metadata.html_url,
        languages: metadata.languages || {},
        readme: metadata.readme ? { exists: true } : {},
        commits: (metadata.commits || []).slice(0, 5).map(c => ({
          sha: c.sha,
          message: c.message,
          date: c.date,
          author: {
            name: c.author?.name || "unknown"
          }
        })),
        contributors: (metadata.contributors || []).map(c => ({
          login: c.login
        }))
      },
      repoPath,
      snippets,
      staticMetrics,
      structure: {
      ascii_tree: asciiTree
      }
    };
    console.log(workerJson);

    // 5️⃣ Send to FastAPI
    const friendReport = await sendToFriendBackend(workerJson);

        // 6️⃣ Final response
        return res.json({
            languages: metadata.languages || {},
             structure: {
              ascii_tree: asciiTree
            },
            stats: {
              commitCount,
              contributorCount
            },
            contributors: contributorsList,
            workerjson: workerJson,
            friend_report: friendReport
        });


  } catch (err) {
    console.error("Analyze error:", err.message || err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}