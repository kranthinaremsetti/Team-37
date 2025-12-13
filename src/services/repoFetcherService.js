// src/services/repoFetcherService.js
import fs from "fs";
import path from "path";
import axios from "axios";
import unzipper from "unzipper";

/**
 * Fetch GitHub repo as ZIP and extract to temp/job-<id>/repo
 * @param {object} params
 * @param {string} params.owner
 * @param {string} params.repo
 * @param {string} params.branch
 * @returns {string} local path to extracted repo
 */
export async function fetchRepoToTemp({ owner, repo, branch }) {
  // 1. Create job folder
  const jobId = `job-${Date.now()}`;
  const projectRoot = process.cwd();
  const jobDir = path.join(projectRoot, "temp", jobId);
  const zipPath = path.join(jobDir, "repo.zip");

  fs.mkdirSync(jobDir, { recursive: true });

  // 2. Build GitHub ZIP URL
  const zipUrl = `https://github.com/${owner}/${repo}/archive/refs/heads/${branch}.zip`;

  // 3. Download ZIP
  const response = await axios({
    url: zipUrl,
    method: "GET",
    responseType: "stream"
  });

  await new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(zipPath);
    response.data.pipe(stream);
    stream.on("finish", resolve);
    stream.on("error", reject);
  });

  // 4. Extract ZIP
  await fs
    .createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: jobDir }))
    .promise();

  // 5. Normalize extracted folder
  const extractedFolderName = `${repo}-${branch}`;
  const extractedPath = path.join(jobDir, extractedFolderName);
  const finalRepoPath = path.join(jobDir, "repo");

  fs.renameSync(extractedPath, finalRepoPath);

  return finalRepoPath;
}
