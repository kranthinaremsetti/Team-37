import express from "express";
import {analyzeRepo} from "../controllers/analyzeController.js";

const router =express.Router();

// POST route to analyze a repository
// The router is mounted at `/analyze` in server.js, so use the root path here.
router.post("/", analyzeRepo);

export default router;