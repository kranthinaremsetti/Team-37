from llm import call_llm

async def generate_strengths(worker):
    prompt = f"""
    You must follow these rules strictly:
1. Identify strengths ONLY from observable evidence:
   - snippet structure
   - file/entry organization
   - visible languages and frameworks
   - commit message patterns
   - presence/absence of documentation/tests
2. Do NOT assume architectural qualities, performance traits, or design decisions not visible.
3. If fewer than 5 defensible strengths exist, list only the valid ones.
4. If no strengths are clearly supported, output:
   ["Not enough information to identify concrete strengths."]
5. Tone must be concise and professional.
6. Output ONLY a bullet list.

DATA:
Snippets: {worker.snippets}
Commit Messages: {[c.message for c in worker.metadata.commits]}
Languages: {worker.metadata.languages}
Entry Files: {worker.staticMetrics.entryFiles}
Has README: {worker.staticMetrics.hasReadme}
Has Tests: {worker.staticMetrics.hasTests}

TASK:
Produce up to 5 strengths grounded strictly in observable facts from the data above.

    """
    raw = await call_llm(prompt)
    return [s.strip("-• ") for s in raw.split("\n") if s.strip()]
