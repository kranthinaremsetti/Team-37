from llm import call_llm

async def generate_relevance(worker, problem_statement):
    prompt = f"""
    You must follow these rules strictly:
1. Base your evaluation ONLY on the problem statement and the observable evidence provided below.
2. Do NOT assume or imagine features, goals, or functionality not clearly supported by the data.
3. If the problem statement is "Not enough information to determine the problem statement.", then output:
   {
     "relevance_score": 50,
     "explanation": "Not enough information to determine relevance."
   }
4. Tone must be concise, professional, and judge-friendly.
5. Output MUST be valid JSON with exactly these two fields:
   {
     "relevance_score": <0–100>,
     "explanation": "<2–3 sentences>"
   }

DATA:
Problem Statement: {{problem_statement}}
Commit Messages: {{[c.message for c in worker.metadata.commits]}}
Snippets: {{worker.snippets}}
Entry Files: {{worker.staticMetrics.entryFiles}}
Has README: {{worker.staticMetrics.hasReadme}}

TASK:
Evaluate how well the implementation aligns with the inferred problem based strictly on:
- visible architecture
- routes or entry points referenced in snippets
- commit intent
- presence or absence of documentation

Assign a relevance score either High,Medium or Low mapped to 0–100 scale:
- High Relevance: 80–100
- Medium Relevance: 50–79
- Low Relevance: 0–49s
Write a short 2–3 sentence explanation of the reasoning behind the score.

    """
    return await call_llm(prompt)
