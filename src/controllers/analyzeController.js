import { getRepoMetadata } from "../services/githubService.js";
import { fetchRepoToTemp } from "../services/repoFetcherService.js";
import { extractSnippets } from "../services/snippetExtractorService.js";

export async function analyzeRepo(req, res) {
    try{
        const repoUrl = req.body.repoUrl || req.body.url;
        if (!repoUrl) {
            return res.status(400).json({ error: "Repository URL is required in body as `repoUrl` or `url`" });
        }
        const metadata = await getRepoMetadata(repoUrl);

        const repoPath = await fetchRepoToTemp({
        owner: metadata.owner.login,
        repo: metadata.name,
        branch: metadata.default_branch
        });

        const snippets = extractSnippets(repoPath);

        return res.json({ success: true, metadata, repoPath,snippets });

    }catch(error) {
        console.error("Error analyzing repository:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

// repoPath → "temp/job-xxxxx/repo"
