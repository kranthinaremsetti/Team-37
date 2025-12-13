import { getRepoMetadata } from "../services/githubService.js";
import { fetchRepoToTemp } from "../services/repoFetcherService.js";

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
        return res.json({ success: true, metadata, repoPath });

    }catch(error) {
        console.error("Error analyzing repository:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

// repoPath → "temp/job-xxxxx/repo"
