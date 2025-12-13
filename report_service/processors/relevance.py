from llm import call_llm

async def generate_relevance(worker):
    prompt = f"""
    Evaluate how well the solution fits the inferred problem.

    Consider:
    - commit messages
    - architecture
    - routes
    - missing documentation

    Output a short relevance evaluation.
    """
    return await call_llm(prompt)
