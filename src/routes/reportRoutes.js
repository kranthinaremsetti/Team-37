import express from "express";
import TeamReport from "../models/TeamReport.js";

const router = express.Router();

// GET team report by team_name
router.get("/teams/:team_name", async (req, res) => {
  try {
    const teamName = decodeURIComponent(req.params.team_name);
    console.log("🔍 Searching for team:", teamName);
    
    const team = await TeamReport.findOne({ team_name: teamName });

    if (!team) {
      return res.status(404).json({ 
        error: "Team not found",
        searched_for: teamName 
      });
    }

    console.log("✅ Found team:", team.team_name);
    res.json(team);
  } catch (err) {
    console.error("❌ Error fetching team:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

export default router;
