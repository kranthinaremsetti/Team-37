// src/services/spreadsheetParserService.js
import fs from "fs";
import csv from "csv-parser";

export function parseSpreadsheet(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        if (data.team_name && data.github_url) {
          rows.push({
            teamName: data.team_name.trim(),
            repoUrl: data.github_url.trim()
          });
        }
      })
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}
