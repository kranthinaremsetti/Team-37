import mongoose from "mongoose";

const ContributorSchema = new mongoose.Schema({
  login: String,
  contributions: Number
});

const EvaluationItemSchema = new mongoose.Schema({
  criterion: String,
  weight: Number,
  score: Number,
  observations: String,
  strengths: String,
  weaknesses: String
});

const FriendReportSchema = new mongoose.Schema({
  problem_statement: String,
  solution_overview: String,
  relevance: String,
  concept_mastery: String,
  strengths: [String],
  weaknesses: [String],
  evaluation: [EvaluationItemSchema],
  final_weighted_score: Number,
  viva_questions: [String],
  final_verdict: String
});

const TeamReportSchema = new mongoose.Schema({
  batch_id: String,
  team_name: String,

  languages: Object,
  structure: {
    ascii_tree: String
  },
  stats: {
    commitCount: Number,
    contributorCount: Number
  },
  contributors: [ContributorSchema],

  friend_report: FriendReportSchema,

  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("TeamReport", TeamReportSchema);
