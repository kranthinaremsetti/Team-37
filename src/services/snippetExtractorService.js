import fs from "fs";
import path from "path";

/* ================= CONFIG ================= */

const IGNORE_DIRS = new Set([
  "node_modules", ".git", ".parcel-cache",
  "dist", "build", ".next", "coverage", "__pycache__"
]);

const ALLOWED_EXT = new Set([
  ".js", ".jsx", ".ts", ".tsx", ".py"
]);

const IMPORTANT_DIRS = [
  "frontend", "backend", "api", "routes",
  "controllers", "services", "processors",
  "modules", "utils", "core", "logic"
];

const ENTRY_FILES = new Set([
  "index.js", "app.js", "server.js",
  "main.py", "api.py"
]);

const MAX_SNIPPETS = 40;
const MAX_PER_FILE = 8;
const MIN_LINES = 6;

/* ================= HELPERS ================= */

function walkDir(dir, files = []) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      if (!IGNORE_DIRS.has(item)) walkDir(full, files);
    } else {
      files.push(full);
    }
  }
  return files;
}

function isImportantPath(filePath) {
  const lower = filePath.toLowerCase();
  return IMPORTANT_DIRS.some(d => lower.includes(d));
}

function detectReasons(filePath, code) {
  const reasons = [];

  if (ENTRY_FILES.has(path.basename(filePath)))
    reasons.push("architecture_entry_point");

  if (isImportantPath(filePath))
    reasons.push("architecture_core_layer");

  if (/async |await |Promise/.test(code))
    reasons.push("concept_async_programming");

  if (/fetch\(|axios|http/.test(code))
    reasons.push("concept_api_usage");

  if (/sql|mongo|prisma|psycopg/.test(code))
    reasons.push("concept_database_usage");

  if (/class\s+\w+/.test(code))
    reasons.push("concept_oop_design");

  if (!/try\s*{/.test(code) && /await/.test(code))
    reasons.push("risk_missing_error_handling");

  return reasons;
}

/* ================= EXTRACTION ================= */

export function extractSnippets(repoPath) {
  const files = walkDir(repoPath);
  const snippets = [];

  for (const filePath of files) {
    const ext = path.extname(filePath);
    if (!ALLOWED_EXT.has(ext)) continue;

    const rel = filePath.replace(repoPath, "");
    const lines = fs.readFileSync(filePath, "utf8").split("\n");

    let collected = 0;

    /* -------- ENTRY FILE SNAPSHOT -------- */
    if (ENTRY_FILES.has(path.basename(filePath))) {
      snippets.push({
        file: rel,
        startLine: 1,
        endLine: Math.min(200, lines.length),
        reasons: ["architecture_overview"],
        code: lines.slice(0, 200).join("\n")
      });
    }

    /* -------- JAVASCRIPT / TS -------- */
    if (ext !== ".py") {
      let braceCount = 0;
      let start = null;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (
          /function\s+\w+/.test(line) ||
          /=>\s*{/.test(line) ||
          /async\s+/.test(line) ||
          /class\s+\w+/.test(line)
        ) {
          start = i;
          braceCount = 0;
        }

        if (start !== null) {
          braceCount += (line.match(/{/g) || []).length;
          braceCount -= (line.match(/}/g) || []).length;

          if (braceCount === 0 && i > start + MIN_LINES) {
            const code = lines.slice(start, i + 1).join("\n");
            const reasons = detectReasons(filePath, code);

            if (reasons.length) {
              snippets.push({
                file: rel,
                startLine: start + 1,
                endLine: i + 1,
                reasons,
                code
              });
              collected++;
            }
            start = null;
          }
        }

        if (collected >= MAX_PER_FILE) break;
      }
    }

    /* -------- PYTHON -------- */
    if (ext === ".py") {
      for (let i = 0; i < lines.length; i++) {
        if (/^(async\s+)?def |^class /.test(lines[i])) {
          const indent = lines[i].match(/^\s*/)[0].length;
          let end = i + 1;

          while (
            end < lines.length &&
            (lines[end].match(/^\s*/)[0].length > indent || lines[end].trim() === "")
          ) {
            end++;
          }

          if (end - i >= MIN_LINES) {
            const code = lines.slice(i, end).join("\n");
            const reasons = detectReasons(filePath, code);

            if (reasons.length) {
              snippets.push({
                file: rel,
                startLine: i + 1,
                endLine: end,
                reasons,
                code
              });
              collected++;
            }
          }
        }

        if (collected >= MAX_PER_FILE) break;
      }
    }
  }

  /* -------- DEDUPE + LIMIT -------- */
  return snippets
    .filter(
      (s, i, arr) =>
        arr.findIndex(
          x =>
            x.file === s.file &&
            x.startLine === s.startLine &&
            x.endLine === s.endLine
        ) === i
    )
    .slice(0, MAX_SNIPPETS);
}
