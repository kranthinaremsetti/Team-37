from llm import call_llm
from utils.json_tools import extract_json
from models import EvaluationItem

async def generate_evaluation(worker, rubric, strengths, weaknesses):

    prompt = f"""
    Evaluate the project using this rubric:

    {rubric.dict()}

    For each criterion:
    - observations
    - strengths
    - weaknesses
    - score (0–100)

    Output ONLY JSON list.

    Example:
    [
      {{
        "criterion": "Innovation",
        "weight": 25,
        "score": 80,
        "observations": "text",
        "strengths": "text",
        "weaknesses": "text"
      }}
    ]

    Use context:
    Strengths: {strengths}
    Weaknesses: {weaknesses}
    """
    raw = await call_llm(prompt)
    evaluation_list = extract_json(raw)

    final_score = 0
    for e in evaluation_list:
        final_score += e["score"] * (e["weight"] / 100)

    evaluation_items = [EvaluationItem(**e) for e in evaluation_list]

    return evaluation_items, final_score
