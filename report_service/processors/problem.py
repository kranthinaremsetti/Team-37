from llm import call_llm

async def generate_problem_statement(worker):
    prompt = f"""
            You must follow these rules strictly:
        1. Base your analysis ONLY on the provided JSON fields below.
        2. Do NOT assume or imagine features that are not present.
        3. If the README and description are missing or empty, and commits/snippets do not clearly show intent, respond:
        "Not enough information to determine the problem statement."
        4. Keep tone judge-friendly, concise, and professional.
        5. Output ONLY the final problem statement paragraph (no headings, no bullets, no extra text).

        DATA:
        README Content: {worker.metadata.readme}
        Project Description: {worker.metadata.description}
        Commit Messages: {[c.message for c in worker.metadata.commits]}
        Code Snippets: {worker.snippets}

        TASK:
        Extract a clear 2–3 sentence problem statement that describes the problem the project aims to solve, grounded ONLY in the above data.
        If the project intent cannot be reliably determined, output the fallback message above.

    """
    return await call_llm(prompt)
