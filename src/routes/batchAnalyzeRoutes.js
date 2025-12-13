// src/routes/batchAnalyzeRoutes.js
import express from "express";
import multer from "multer";
import { batchAnalyze } from "../controllers/batchAnalyzeController.js";

const router = express.Router();
const upload = multer({ dest: "temp/uploads/" });

router.post("/analyze/batch", upload.single("file"), batchAnalyze);

export default router;
