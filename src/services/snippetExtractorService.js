import fs from "fs";
import path from "path";

/* ================= CONFIG ================= */

const IGNORE_DIRS = [
  "node_modules", ".git", "dist", "build", ".next", "coverage"
];

const ALLOWED_EXT = [".js", ".ts", ".jsx", ".tsx", ".py"];

const ENTRY_FILES = [
  "index.js", "app.js", "server.js", "main.py"
];

const ARCH_DIR_KEYWORDS = [
  "routes", "controllers", "services", "api",
  "backend", "model", "logic", "core"
];

const DOMAIN_KEYWORDS = [
  "auth", "optimize", "predict", "train",
  "forecast", "rebalance", "queue", "payment"
];

const MIN_FUNCTION_LINES = 12;
const MAX_SNIPPETS = 20;

/* ================= HELPERS ================= */

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

function fileLooksImportant(filePath) {
  const lower = filePath.toLowerCase();
  return (
    ARCH_DIR_KEYWORDS.some(k => lower.includes(k)) ||
    DOMAIN_KEYWORDS.some(k => lower.includes(k))
  );
}

function detectReasons({ filePath, code, lineCount }) {
  const reasons = [];

  if (ENTRY_FILES.includes(path.basename(filePath))) {
    reasons.push("architecture_entry_point");
  }

  if (fileLooksImportant(filePath)) {
    reasons.push("architecture_core_layer");
  }

  if (lineCount >= 30) {
    reasons.push("complex_business_logic");
  }

  if (/async |await |Promise/.test(code)) {
    reasons.push("concept_async_programming");
  }

  if (/axios|fetch\(|http/.test(code)) {
    reasons.push("concept_api_usage");
  }

  if (/mongoose|sequelize|sql|prisma/.test(code)) {
    reasons.push("concept_database_usage");
  }

  if (/for |while |map\(|reduce\(/.test(code)) {
    reasons.push("concept_algorithmic_logic");
  }

  if (!/try\s*{/.test(code) && /await/.test(code)) {
    reasons.push("risk_missing_error_handling");
  }

  if (/TODO|FIXME/.test(code)) {
    reasons.push("risk_incomplete_logic");
  }

  return reasons;
}

/* ================= MAIN ================= */

export function extractSnippets(repoPath) {
  const allFiles = walkDir(repoPath);
  const snippets = [];
  const fileSizes = [];

  /* ---- Pass 1: Collect file sizes ---- */
  for (const filePath of allFiles) {
    const ext = path.extname(filePath);
    if (!ALLOWED_EXT.includes(ext)) continue;

    const lines = fs.readFileSync(filePath, "utf-8").split("\n");
    fileSizes.push({ filePath, lines });
  }

  /* ---- Pass 2: Entry + Architecture files ---- */
  for (const { filePath, lines } of fileSizes) {
    const fileName = path.basename(filePath);
    if (ENTRY_FILES.includes(fileName) || fileLooksImportant(filePath)) {
      snippets.push({
        file: filePath.replace(repoPath, ""),
        startLine: 1,
        endLine: lines.length,
        reasons: ["architecture_overview"],
        code: lines.slice(0, 300).join("\n")
      });
    }
  }

  /* ---- Pass 3: Function-level extraction ---- */
  for (const { filePath, lines } of fileSizes) {
    let start = null;

    for (let i = 0; i < lines.length; i++) {
      if (/function |=>|async /.test(lines[i])) {
        start = i;
      }

      if (start !== null && lines[i].includes("}")) {
        const end = i;
        const length = end - start;

        if (length >= MIN_FUNCTION_LINES) {
          const codeBlock = lines.slice(start, end + 1).join("\n");
          const reasons = detectReasons({
            filePath,
            code: codeBlock,
            lineCount: length
          });

          if (reasons.length) {
            snippets.push({
              file: filePath.replace(repoPath, ""),
              startLine: start + 1,
              endLine: end + 1,
              reasons,
              code: codeBlock
            });
          }
        }
        start = null;
      }
    }
  }

  /* ---- Pass 4: Density-based fallback (top 10%) ---- */
  fileSizes
    .sort((a, b) => b.lines.length - a.lines.length)
    .slice(0, Math.ceil(fileSizes.length * 0.1))
    .forEach(({ filePath, lines }) => {
      snippets.push({
        file: filePath.replace(repoPath, ""),
        startLine: 1,
        endLine: lines.length,
        reasons: ["high_effort_file"],
        code: lines.slice(0, 300).join("\n")
      });
    });

  /* ---- Deduplicate + cap ---- */
  return snippets
    .filter(
      (s, i, arr) =>
        arr.findIndex(
          x => x.file === s.file && x.startLine === s.startLine
        ) === i
    )
    .slice(0, MAX_SNIPPETS);
}
