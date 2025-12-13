from llm import call_llm

async def generate_viva_questions(worker):
    prompt = f"""
    Generate exactly 8 viva questions based on:

    - architecture entry points
    - backend routes
    - snippets
    - missing README
    - possible financial algorithms

    Output one question per line.
    """

    raw = await call_llm(prompt)
    qs = [q.strip("-• ") for q in raw.split("\n") if q.strip()]
    return qs[:8]
