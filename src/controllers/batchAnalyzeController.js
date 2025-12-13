// src/controllers/batchAnalyzeController.js
import fs from "fs";
import { parseSpreadsheet } from "../services/spreadsheetParserService.js";
import { analyzeRepository } from "../services/analyseRepositoryService.js";

export async function batchAnalyze(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Spreadsheet file is required" });
    }

    const rows = await parseSpreadsheet(req.file.path);
    const results = [];

    for (const row of rows) {
      try {
        const workerJson = await analyzeRepository(row.repoUrl);
        results.push({
          team_name: row.teamName,
          worker_json: workerJson
        });
      } catch (err) {
        results.push({
          team_name: row.teamName,
          error: err.message || "Analysis failed"
        });
      }
    }

    // Optional cleanup
    fs.unlinkSync(req.file.path);

    return res.json({
      batch_id: `batch-${Date.now()}`,
      results,
      jury_rubric: {
        criteria: [
          { name: "Innovation", weight: 25 },
          { name: "Technical Implementation", weight: 25 },
          { name: "AI Utilization", weight: 25 },
          { name: "Impact & Expandability", weight: 15 },
          { name: "Presentation", weight: 10 }
        ]
      }
    });

  } catch (error) {
    console.error("Batch analysis error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
