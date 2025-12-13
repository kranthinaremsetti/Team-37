from llm import call_llm

async def generate_relevance(worker, problem_statement):
    prompt = f"""
    You must follow these rules strictly:
    1. Base your evaluation ONLY on the problem statement (already generated) and the evidence below.
    2. Use ONLY observable data: commit messages, available snippets, visible architecture, and documentation presence.
    3. Do NOT assume or imagine any features or intended goals that are not clearly indicated.
    4. If the earlier problem statement was "Not enough information to determine the problem statement.", then simply output:
    "Not enough information to determine relevance."
    5. Tone must be concise, professional, and judge-friendly.
    6. Output ONLY a 2–3 sentence relevance evaluation.

    DATA:
    Problem Statement: {problem_statement}
    Commit Messages: {[c.message for c in worker.metadata.commits]}
    Snippets: {worker.snippets}
    Entry Files: {worker.staticMetrics.entryFiles}
    Has README: {worker.staticMetrics.hasReadme}

    TASK:
    Evaluate how well the implementation aligns with the inferred problem, based strictly on observable structure, routes, commits, and documentation. If alignment cannot be determined, use the fallback rule.

    """
    return await call_llm(prompt)
