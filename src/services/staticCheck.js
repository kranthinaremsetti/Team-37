import fs from "fs";
import path from "path";

const IGNORE_DIRS = ["node_modules", ".git", "dist", "build"];

function walkDir(dir, files = []) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!IGNORE_DIRS.includes(file)) {
        walkDir(fullPath, files);
      }
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

export const runStaticCheck = (repoPath) => {
  const files = walkDir(repoPath);

  const metrics = {
    totalFiles: files.length,
    filesByExtension: {},
    totalLinesOfCode: 0,
    hasReadme: false,
    hasTests: false,
    entryFiles: [],
    todoCount: 0,
    consoleLogCount: 0
  };

  for (const filePath of files) {
    const ext = path.extname(filePath);
    metrics.filesByExtension[ext] =
      (metrics.filesByExtension[ext] || 0) + 1;

    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    metrics.totalLinesOfCode += lines.length;

    if (path.basename(filePath).toLowerCase() === "readme.md") {
      metrics.hasReadme = true;
    }

    if (
      ["app.js", "index.js", "server.js"].includes(
        path.basename(filePath)
      )
    ) {
      metrics.entryFiles.push(path.basename(filePath));
    }

    metrics.todoCount += lines.filter(l => l.includes("TODO")).length;
    metrics.consoleLogCount += lines.filter(l => l.includes("console.log")).length;

    if (filePath.includes("test") || filePath.includes("__tests__")) {
      metrics.hasTests = true;
    }
  }

  return metrics;
}