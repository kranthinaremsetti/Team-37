// src/services/analyzeRepositoryService.js
import { getRepoMetadata } from "./githubService.js";
import { fetchRepoToTemp } from "./repoFetcherService.js";
import { extractSnippets } from "./snippetExtractorService.js";
import { runStaticCheck } from "./staticCheck.js";

export async function analyzeRepository(repoUrl) {
  const metadata = await getRepoMetadata(repoUrl);

  const repoPath = await fetchRepoToTemp({
    owner: metadata.owner.login,
    repo: metadata.name,
    branch: metadata.default_branch
  });

  const snippets = extractSnippets(repoPath);
  const staticMetrics = runStaticCheck(repoPath);

  return {
    success: true,
    metadata,
    repoPath,
    snippets,
    staticMetrics
  };
}
