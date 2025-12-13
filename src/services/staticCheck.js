import fs from "fs";
import path from "path";

const IGNORE_DIRS = ["node_modules", ".git", "dist", "build"];
const ARCH_LAYERS = ["controllers", "services", "routes", "models", "middlewares"];

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
    /* Existing */
    totalFiles: files.length,
    filesByExtension: {},
    totalLinesOfCode: 0,
    hasReadme: false,
    hasTests: false,
    entryFiles: [],
    todoCount: 0,
    consoleLogCount: 0,

    /* Step 1: Function & async metrics */
    totalFunctions: 0,
    totalFunctionLines: 0,
    avgFunctionLength: 0,
    asyncFunctionCount: 0,

    /* Step 2: Framework & library detection */
    usesExpress: false,
    usesReact: false,
    usesDatabase: false,
    usesAuth: false,

    /* Step 3: Error-handling hygiene */
    tryCatchCount: 0,
    awaitWithoutTryCount: 0,

    /* Step 4: Architecture layout */
    layerCounts: {},
    hasModularStructure: false
  };

  for (const layer of ARCH_LAYERS) {
    metrics.layerCounts[layer] = 0;
  }

  for (const filePath of files) {
    const ext = path.extname(filePath);
    metrics.filesByExtension[ext] =
      (metrics.filesByExtension[ext] || 0) + 1;

    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    const fileName = path.basename(filePath);
    const lowerContent = content.toLowerCase();

    metrics.totalLinesOfCode += lines.length;

    /* README */
    if (fileName.toLowerCase() === "readme.md") {
      metrics.hasReadme = true;
    }

    /* Entry files */
    if (["app.js", "index.js", "server.js"].includes(fileName)) {
      metrics.entryFiles.push(fileName);
    }

    /* Tests */
    if (filePath.includes("test") || filePath.includes("__tests__")) {
      metrics.hasTests = true;
    }

    /* TODO / console.log */
    metrics.todoCount += lines.filter(l => l.includes("TODO")).length;
    metrics.consoleLogCount += lines.filter(l => l.includes("console.log")).length;

    /* ---------------- Step 1: Functions & async ---------------- */
    lines.forEach((line, idx) => {
      if (
        line.includes("function ") ||
        line.includes("=>") ||
        line.includes("async ")
      ) {
        metrics.totalFunctions++;

        // crude function length heuristic
        let length = 0;
        for (let i = idx; i < lines.length; i++) {
          length++;
          if (lines[i].includes("}")) break;
        }
        metrics.totalFunctionLines += length;
      }

      if (line.includes("async ")) {
        metrics.asyncFunctionCount++;
      }
    });

    /* ---------------- Step 2: Framework detection ---------------- */
    if (lowerContent.includes("express")) metrics.usesExpress = true;
    if (lowerContent.includes("react")) metrics.usesReact = true;
    if (
      lowerContent.includes("mongoose") ||
      lowerContent.includes("sequelize") ||
      lowerContent.includes("prisma") ||
      lowerContent.includes("sql")
    ) {
      metrics.usesDatabase = true;
    }
    if (
      lowerContent.includes("jwt") ||
      lowerContent.includes("passport") ||
      lowerContent.includes("bcrypt") ||
      lowerContent.includes("auth")
    ) {
      metrics.usesAuth = true;
    }

    /* ---------------- Step 3: Error handling ---------------- */
    metrics.tryCatchCount += lines.filter(l => l.includes("try {")).length;

    lines.forEach((line, idx) => {
      if (line.includes("await ")) {
        const window = lines.slice(Math.max(0, idx - 5), idx + 1).join(" ");
        if (!window.includes("try")) {
          metrics.awaitWithoutTryCount++;
        }
      }
    });

    /* ---------------- Step 4: Architecture layout ---------------- */
    for (const layer of ARCH_LAYERS) {
      if (filePath.includes(path.sep + layer + path.sep)) {
        metrics.layerCounts[layer]++;
      }
    }
  }

  /* Derived metrics */
  if (metrics.totalFunctions > 0) {
    metrics.avgFunctionLength =
      Math.round(metrics.totalFunctionLines / metrics.totalFunctions);
  }

  metrics.hasModularStructure =
    Object.values(metrics.layerCounts).filter(v => v > 0).length >= 2;

  return metrics;
<<<<<<< HEAD
};
=======
};
>>>>>>> 13a94a6e413bd59e20c1eec07b1be97b95f259c9
