import { getRepoMetadata } from "../services/githubService.js";
import { fetchRepoToTemp } from "../services/repoFetcherService.js";
import { extractSnippets } from "../services/snippetExtractorService.js";
import { runStaticCheck } from "../services/staticCheck.js";

export async function analyzeRepo(req, res) {
  try {
    const repoUrl = req.body.repoUrl || req.body.url;
    if (!repoUrl) {
      return res.status(400).json({
        error: "Repository URL is required in body as `repoUrl` or `url`"
      });
    }

    const metadata = await getRepoMetadata(repoUrl);

    const repoPath = await fetchRepoToTemp({
      owner: metadata.owner.login,
      repo: metadata.name,
      branch: metadata.default_branch
    });

    const snippets = extractSnippets(repoPath);
    const staticMetrics = runStaticCheck(repoPath);

    const workerJson = {
      success: true,
      metadata,
      repoPath,
      snippets,
      staticMetrics
    };

    const juryRubric = {
      criteria: [
        { name: "Innovation", weight: 25 },
        { name: "Technical Implementation", weight: 25 },
        { name: "AI Utilization", weight: 25 },
        { name: "Impact & Expandability", weight: 15 },
        { name: "Presentation", weight: 10 }
      ]
    };

    return res.json({
      worker_json: workerJson,
      jury_rubric: juryRubric
    });

  } catch (error) {
    console.error("Error analyzing repository:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
