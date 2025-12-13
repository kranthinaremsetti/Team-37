from llm import call_llm

async def generate_problem_statement(worker):
    prompt = f"""
    Extract or infer a clear Problem Statement.

    README: {worker.metadata.readme}
    Description: {worker.metadata.description}
    Commits: {[c.message for c in worker.metadata.commits]}
    Snippets: {worker.snippets}

    If no real documentation exists, infer the problem from code structure.

    Output ONLY the problem statement paragraph.
    """
    return await call_llm(prompt)
