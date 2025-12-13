import fs from "fs";
import path from "path";

/**
 * CONFIG — easy to tweak later
 */

const IGNORE_DIRS = ["node_modules", ".git", "dist", "build", ".next"];
const ALLOWED_EXT = [".js", ".ts", ".jsx", ".tsx", ".py"];
const ENTRY_FILES = ["app.js", "index.js", "server.js", "main.py"];
const MIN_FUNCTION_LINES = 30;

/**
 * Recursively walk directory and collect files
 */
function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!IGNORE_DIRS.includes(file)) {
        walkDir(fullPath, fileList);
      }
    } else {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

/**
 * Decide WHY a file/snippet matters
 */
function detectReasons({ filePath, fileName, code, lineCount }) {
  const reasons = [];

  // A. Architectural importance
  if (ENTRY_FILES.includes(fileName)) {
    reasons.push("architecture_entry_point");
  }

  if (
    filePath.includes("routes") ||
    filePath.includes("controller") ||
    filePath.includes("service") ||
    filePath.includes("api")
  ) {
    reasons.push("architecture_core_layer");
  }

  // B. Logical complexity
  if (lineCount >= MIN_FUNCTION_LINES) {
    reasons.push("complex_business_logic");
  }

  // C. Authorship signals
  if (lineCount >= 50 && !code.includes("//")) {
    reasons.push("authorship_signal_minimal_comments");
  }

  // D. Concept demonstration
  if (
    code.includes("async ") ||
    code.includes("await ") ||
    code.includes("Promise")
  ) {
    reasons.push("concept_async_programming");
  }

  if (
    code.includes("axios") ||
    code.includes("fetch(") ||
    code.includes("http")
  ) {
    reasons.push("concept_api_usage");
  }

  if (
    code.includes("mongoose") ||
    code.includes("sequelize") ||
    code.includes("sql")
  ) {
    reasons.push("concept_database_usage");
  }

  // E. Risk / red flags
  if (!code.includes("try") && code.includes("await")) {
    reasons.push("risk_missing_error_handling");
  }

  if (code.includes("TODO") || code.includes("FIXME")) {
    reasons.push("risk_incomplete_logic");
  }

  return reasons;
}

/**
 * Extract important snippets with reasons
 */
export function extractSnippets(repoPath) {
  const allFiles = walkDir(repoPath);
  const snippets = [];

  for (const filePath of allFiles) {
    const ext = path.extname(filePath);
    if (!ALLOWED_EXT.includes(ext)) continue;

    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    const fileName = path.basename(filePath);

    let functionStart = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Very simple function detection (extendable)
      if (
        line.includes("function ") ||
        line.includes("=>") ||
        line.includes("async ")
      ) {
        functionStart = i;
      }

      if (functionStart !== null && line.includes("}")) {
        const functionEnd = i;
        const length = functionEnd - functionStart;

        if (length >= MIN_FUNCTION_LINES) {
          const codeBlock = lines
            .slice(functionStart, functionEnd + 1)
            .join("\n");

          const reasons = detectReasons({
            filePath,
            fileName,
            code: codeBlock,
            lineCount: length,
          });

          // Only include if at least one reason exists
          if (reasons.length > 0) {
            snippets.push({
              file: filePath.replace(repoPath, ""),
              startLine: functionStart + 1,
              endLine: functionEnd + 1,
              reasons,
              code: codeBlock,
            });
          }
        }

        functionStart = null;
      }
    }

    // Entry file full capture (even if no big function)
    if (ENTRY_FILES.includes(fileName)) {
      snippets.push({
        file: filePath.replace(repoPath, ""),
        startLine: 1,
        endLine: lines.length,
        reasons: ["architecture_entry_point"],
        code: content,
      });
    }
  }

  return snippets;
}