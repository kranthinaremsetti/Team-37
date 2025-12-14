import fs from "fs";
import { parseSpreadsheet } from "../services/spreadsheetParserService.js";
import { analyzeRepository } from "../services/analyseRepositoryService.js";
import TeamReport from "../models/TeamReport.js";


/**
 * Batch analyze multiple repositories from a CSV file
 * @param {Request} req - Express request object with uploaded file
 * @param {Response} res - Express response object
 */
export async function batchAnalyze(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "CSV file missing" });
    }

    const rows = await parseSpreadsheet(req.file.path);
    console.log("ROWS RECEIVED:", rows);

    const batchId = "batch-" + Date.now();
    const results = [];

    for (const row of rows) {
      try {
        console.log(`Analyzing repo: ${row.repoUrl}`);

        const workerJson = await analyzeRepository(row.repoUrl);

        // Save to MongoDB
        const teamReport = new TeamReport({
          batch_id: batchId,
          team_name: row.teamName,
          languages: workerJson.languages,
          structure: workerJson.structure,
          stats: workerJson.stats,
          contributors: workerJson.contributors,
          friend_report: workerJson.friend_report
        });

        await teamReport.save();
        console.log(`✅ Saved ${row.teamName} to MongoDB`);

        results.push({
          team_name: row.teamName,
          status: "success",
          saved_to_db: true
        });
      } catch (err) {
        console.error(`❌ Error analyzing ${row.teamName}:`, err.message);
        results.push({
          team_name: row.teamName,
          status: "error",
          error: err.message || "Analysis failed"
        });
      }
    }

    fs.unlinkSync(req.file.path); // delete uploaded file

    return res.json({
      batch_id: batchId,
      total_teams: results.length,
      results,
    });

  } catch (error) {
    console.error("Batch error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
