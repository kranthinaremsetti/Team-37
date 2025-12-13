from fastapi import FastAPI
from models import ReportRequest, FinalReport
from processors.problem import generate_problem_statement
from processors.solution import generate_solution_overview
from processors.relevance import generate_relevance
from processors.structure import generate_codebase_structure
from processors.mastery import generate_concept_mastery
from processors.strengths import generate_strengths
from processors.weaknesses import generate_weaknesses
from processors.scoring import generate_evaluation
from processors.viva import generate_viva_questions
from processors.verdict import generate_verdict
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

@app.post("/generate-report", response_model=FinalReport)
async def generate_report(payload: ReportRequest):

    worker_json = payload.worker_json
    rubric = payload.jury_rubric

    # 1. Generate each section independently
    problem_statement = await generate_problem_statement(worker_json)
    solution_overview = await generate_solution_overview(worker_json)
    relevance = await generate_relevance(worker_json)
    codebase_structure = await generate_codebase_structure(worker_json)
    concept_mastery = await generate_concept_mastery(worker_json)
    strengths = await generate_strengths(worker_json)
    weaknesses = await generate_weaknesses(worker_json)

    evaluation, final_score = await generate_evaluation(
        worker_json, rubric, strengths, weaknesses
    )

    viva_questions = await generate_viva_questions(worker_json)
    final_verdict = await generate_verdict(final_score, strengths, weaknesses)

    # 2. Return final structured report
    return FinalReport(
        problem_statement=problem_statement,
        solution_overview=solution_overview,
        relevance=relevance,
        codebase_structure=codebase_structure,
        concept_mastery=concept_mastery,
        strengths=strengths,
        weaknesses=weaknesses,
        evaluation=evaluation,
        final_weighted_score=final_score,
        viva_questions=viva_questions,
        final_verdict=final_verdict
    )
