import fs from "fs";
import path from "path";

const IGNORE_DIRS = ["node_modules", ".git", "dist", "build", "__pycache__"];

export function generateAsciiTree(
  dir,
  prefix = "",
  depth = 0,
  maxDepth = 3
) {
  if (depth > maxDepth) return "";

  let output = "";
  const items = fs.readdirSync(dir);

  items.forEach((item, index) => {
    if (IGNORE_DIRS.includes(item)) return;

    const fullPath = path.join(dir, item);
    const isLast = index === items.length - 1;
    const connector = isLast ? "└── " : "├── ";

    output += `${prefix}${connector}${item}\n`;

    if (fs.statSync(fullPath).isDirectory()) {
      const newPrefix = prefix + (isLast ? "    " : "│   ");
      output += generateAsciiTree(
        fullPath,
        newPrefix,
        depth + 1,
        maxDepth
      );
    }
  });

  return output;
}
