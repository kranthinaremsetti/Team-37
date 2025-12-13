import express from "express";
import analyzeRouter from "./src/routes/analyzeRouter.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// 🔥 ADD THIS (CORS)
app.use(
  cors({
    origin: "*", // allow all origins for now (hackathon-safe)
  })
);

app.use(express.json());

// routes
app.use("/analyze", analyzeRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
