import fs from "fs";
import csv from "csv-parser";

/**
 * Parse a CSV file and extract teamName and repoUrl columns
 * @param {string} filePath - Path to the CSV file
 * @returns {Promise<Array<{teamName: string, repoUrl: string}>>}
 */
export function parseSpreadsheet(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        console.log("ROW:", row);
        results.push({
          teamName: row.teamName?.trim(),
          repoUrl: row.repoUrl?.trim()
        });
      })
      .on("end", () => {
        console.log("Parsed rows:", results);
        resolve(results);
      })
      .on("error", reject);
  });
}
