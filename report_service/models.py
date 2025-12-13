from pydantic import BaseModel
from typing import List, Dict, Optional, Any

# Jury Rubric Models
class Criterion(BaseModel):
    name: str
    weight: float

class JuryRubric(BaseModel):
    criteria: List[Criterion]

# Worker JSON Models
class Commit(BaseModel):
    sha: str
    message: str
    date: str
    author: Dict[str, Any]

class Snippet(BaseModel):
    file: str
    startLine: int
    endLine: int
    reasons: List[str]
    code: str

class StaticMetrics(BaseModel):
    totalFiles: int
    filesByExtension: Dict[str, int]
    totalLinesOfCode: int
    hasReadme: bool
    hasTests: bool
    entryFiles: List[str]
    todoCount: int
    consoleLogCount: int

class Metadata(BaseModel):
    name: Optional[str]
    full_name: Optional[str]
    description: Optional[str]
    owner: Dict[str, Any]
    html_url: str
    languages: Dict[str, int]
    readme: Optional[Dict[str, Any]]
    commits: List[Commit]
    contributors: List[Dict[str, Any]]

class WorkerInput(BaseModel):
    success: bool
    metadata: Metadata
    repoPath: str
    snippets: List[Snippet]
    staticMetrics: StaticMetrics

# Final Report Models
class EvaluationItem(BaseModel):
    criterion: str
    weight: float
    score: float
    observations: str
    strengths: str
    weaknesses: str

class FinalReport(BaseModel):
    problem_statement: str
    solution_overview: str
    relevance: str
    concept_mastery: str
    strengths: List[str]
    weaknesses: List[str]
    evaluation: List[EvaluationItem]
    final_weighted_score: float
    viva_questions: List[str]
    final_verdict: Optional[str] = None

class ReportRequest(BaseModel):
    worker_json: WorkerInput
    jury_rubric: JuryRubric
