from llm import call_llm

async def generate_concept_mastery(worker):
    prompt = f"""
    Analyze Concept Mastery based on:

    Snippets: {worker.snippets}
    Routes & architecture
    Commit messages
    Languages used

    Evaluate:
    - architecture understanding
    - algorithm usage
    - API logic
    - reasoning depth

    Output a compact insight summary.
    """
    return await call_llm(prompt)
