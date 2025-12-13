from llm import call_llm
from utils.json_tools import extract_json
from models import EvaluationItem

async def generate_evaluation(worker, rubric, strengths, weaknesses):

    prompt = f"""You must follow these rules strictly:
1. Base all scores and observations ONLY on the provided strengths, weaknesses, and observable evidence from the project.
2. Do NOT assume or imagine features or qualities not supported by the data.
3. If a criterion cannot be evaluated due to insufficient evidence, assign:
   "score": 50
   "observations": "Not enough information to fully evaluate this criterion."
4. AI Utilization must score low if there is no visible AI-related code.
5. Output MUST be a valid JSON list matching the exact schema shown.
6. Tone must remain concise, professional, and judge-friendly.

DATA:
Rubric: {rubric.dict()}
Strengths: {strengths}
Weaknesses: {weaknesses}

TASK:
For EACH criterion in the rubric, produce an object:

{{
  "criterion": "<name>",
  "weight": <weight>,
  "score": <0-100>,
  "observations": "<2–3 sentences>",
  "strengths": "<specific strengths for this criterion>",
  "weaknesses": "<specific weaknesses for this criterion>"
}}

Scoring must be strictly grounded in strengths and weaknesses. No hallucinations.

OUTPUT:
A JSON list ONLY. No extra text.
    """
    raw = await call_llm(prompt)
    evaluation_list = extract_json(raw)

    final_score = 0
    for e in evaluation_list:
        final_score += e["score"] * (e["weight"] / 100)

    evaluation_items = [EvaluationItem(**e) for e in evaluation_list]

    return evaluation_items, final_score
