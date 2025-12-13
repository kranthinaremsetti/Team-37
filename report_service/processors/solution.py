from llm import call_llm

async def generate_solution_overview(worker):
    prompt = f"""
    You must follow these rules strictly:
        1. Base your explanation ONLY on the backend entry file, frontend entry file, snippets, and commit messages provided below.
        2. Do NOT infer or imagine features, endpoints, behavior, or architecture that is not explicitly visible in the data.
        3. If the snippets do not reveal enough functionality to describe how the system works, say:
        "Not enough information to determine the solution overview."
        4. Tone must be concise, judge-friendly, and professional.
        5. Output ONLY a 3–4 sentence solution overview (no headings, no extra commentary).

        DATA:
        Backend / Entry Files: {{worker.staticMetrics.entryFiles}}
        Snippets: {{worker.snippets}}
        Commit Messages: {{[c.message for c in worker.metadata.commits]}}

        TASK:
        Summarize how the system technically works based strictly on the visible code structure, entry points, routes referenced in snippets, and commit patterns. Focus on what can be confidently observed (e.g., frameworks used, API mounting, frontend initialization).
        If evidence is insufficient, return the fallback message.
    """
    return await call_llm(prompt)
