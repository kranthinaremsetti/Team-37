// src/services/githubService.js
import axios from "../config/axiosClient.js";
import parseRepoUrl from "../utils/parseRepoUrl.js";

/**
 * Fetch repository metadata, latest commits, contributors, and code frequency.
 * @param {string} repoUrl - GitHub repo URL (https or ssh)
 * @param {object} options - optional { commitsPerPage: number, contributorsPerPage: number }
 */
export async function getRepoMetadata(repoUrl, options = {}) {
  const parsed = parseRepoUrl(repoUrl);
  if (!parsed) {
    const e = new Error("Invalid GitHub repo URL");
    e.status = 400;
    throw e;
  }
  const { owner, repo } = parsed;
  const commitsPerPage = options.commitsPerPage || 10;
  const contributorsPerPage = options.contributorsPerPage || 30;

  // 1) Main repo info
  const repoResp = await axios.get(`/repos/${owner}/${repo}`);
  const repoData = repoResp.data;

  // 2) Parallel: readme, languages
  const [readmeSettled, languagesSettled] = await Promise.allSettled([
    axios.get(`/repos/${owner}/${repo}/readme`),
    axios.get(`/repos/${owner}/${repo}/languages`)
  ]);

  // 3) Commits (latest N) (defensive)
  let commits = null;
  try {
    const commitsResp = await axios.get(`/repos/${owner}/${repo}/commits`, {
      params: { per_page: commitsPerPage }
    });
    commits = commitsResp.data.map((c) => ({
      sha: c.sha,
      message: c.commit?.message || null,
      author: {
        name: c.commit?.author?.name || null,
        email: c.commit?.author?.email || null,
        username: c.author?.login || null
      },
      date: c.commit?.author?.date || null,
      url: c.html_url || null,
      parents: Array.isArray(c.parents) ? c.parents.map((p) => p.sha) : []
    }));
  } catch (err) {
    console.error(`Failed to fetch commits for ${owner}/${repo}:`, err.message || err);
    commits = null;
  }

  // 4) Contributors
  let contributors = null;
  try {
    // You can paginate using page/per_page if you want more
    const contribResp = await axios.get(`/repos/${owner}/${repo}/contributors`, {
      params: { per_page: contributorsPerPage }
    });
    contributors = contribResp.data.map((c) => ({
      login: c.login,
      id: c.id,
      contributions: c.contributions,
      url: c.url,
      html_url: c.html_url,
      avatar_url: c.avatar_url
    }));
  } catch (err) {
    console.error(`Failed to fetch contributors for ${owner}/${repo}:`, err.message || err);
    contributors = null;
  }

  
  // Build result object
  const result = {
    name: repoData.name,
    full_name: repoData.full_name,
    description: repoData.description,
    owner: {
      login: repoData.owner.login,
      url: repoData.owner.html_url
    },
    html_url: repoData.html_url,
    stargazers_count: repoData.stargazers_count,
    watchers_count: repoData.watchers_count,
    forks_count: repoData.forks_count,
    open_issues_count: repoData.open_issues_count,
    default_branch: repoData.default_branch,
    license: repoData.license ? repoData.license.spdx_id || repoData.license.name : null,
    languages: languagesSettled.status === "fulfilled" ? languagesSettled.value.data : null,
    readme: readmeSettled.status === "fulfilled" ? readmeSettled.value.data : null,
    pushed_at: repoData.pushed_at,
    created_at: repoData.created_at,
    updated_at: repoData.updated_at,
    // New fields:
    commits,        // latest commits (or null)
    contributors,   // contributors list (or null)
  };

  return result;
}
