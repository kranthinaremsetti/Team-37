import express from "express";
import analyzeRouter from "./src/routes/analyzeRouter.js";
import dotenv from "dotenv";
import cors from "cors";
import batchRoutes from "./src/routes/batchAnalyzeRoutes.js";
import mongoose from "mongoose";
import reportRoutes from "./src/routes/reportRoutes.js";  // ✅ correct

dotenv.config();

mongoose
  .connect("mongodb+srv://denny16satyala:Sudenak%4099@cluster0.scmnb70.mongodb.net/hackaton_analyzer")
  .then(() => console.log("📦 MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// order matters
app.use("/api", batchRoutes);
app.use("/api", reportRoutes);     //  ✅ must be AFTER batchRoutes
app.use("/analyze", analyzeRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
