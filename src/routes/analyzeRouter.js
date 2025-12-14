import express from "express";
import TeamReport from "../models/TeamReport.js";
import {analyzeRepo} from "../controllers/analyzeController.js";

const router =express.Router();

// POST route to analyze a repository
router.post("/", analyzeRepo);

export default router;