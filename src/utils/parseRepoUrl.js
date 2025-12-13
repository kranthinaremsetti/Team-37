export default function parseRepoUrl(url) {
  try {
    // Accepts URLs like https://github.com/owner/repo(.git)? and git@github.com:owner/repo.git
    // Normalize
    if (!url) return null;
    let owner, repo;
    // ssh form
    if (url.startsWith("git@")) {
      // git@github.com:owner/repo.git
      const parts = url.split(":")[1];
      if (!parts) return null;
      [owner, repo] = parts.replace(/\.git$/, "").split("/");
    } else {
      // http/https
      const u = new URL(url);
      const segs = u.pathname.replace(/^\//, "").replace(/\.git$/, "").split("/");
      if (segs.length < 2) return null;
      owner = segs[0];
      repo = segs[1];
    }
    if (!owner || !repo) return null;
    return { owner, repo };
  } catch (e) {
    return null;
  }
}
