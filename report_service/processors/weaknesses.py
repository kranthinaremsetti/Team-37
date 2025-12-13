from llm import call_llm

async def generate_weaknesses(worker):
    prompt = f"""
    You must follow these rules strictly:
1. Identify weaknesses ONLY from observable evidence:
   - missing README
   - missing tests
   - large LOC count
   - unclear architecture based on snippets
   - missing documentation in general
2. Do NOT assume additional weaknesses not supported by evidence.
3. If the data does not support any weaknesses, output:
   ["Not enough information to identify weaknesses."]
4. Tone must be concise and professional.
5. Output ONLY a bullet list.

DATA:
Has README: {worker.staticMetrics.hasReadme}
Has Tests: {worker.staticMetrics.hasTests}
Lines of Code: {worker.staticMetrics.totalLinesOfCode}
Snippets: {worker.snippets}
Entry Files: {worker.staticMetrics.entryFiles}

TASK:
List up to 5 weaknesses, grounded exclusively in the provided data.

    """
    raw = await call_llm(prompt)
    return [w.strip("-• ") for w in raw.split("\n") if w.strip()]
