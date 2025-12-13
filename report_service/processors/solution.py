from llm import call_llm

async def generate_solution_overview(worker):
    prompt = f"""
    Summarize the technical Solution Overview based on:

    - backend routes & server.js
    - frontend entry file
    - code snippets
    - commit history

    Output a clear explanation of how the system works.
    """
    return await call_llm(prompt)
