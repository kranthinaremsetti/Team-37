from llm import call_llm

async def generate_codebase_structure(worker):
    prompt = f"""
    You must follow these rules strictly:
1. Use ONLY the data provided below. Do NOT guess folder structure or modules that are not explicitly visible.
2. If a detail is not present in the JSON, do not infer it.
3. Tone must be concise, professional, and judge-friendly.
4. Output ONLY a 4–6 sentence descriptive Codebase Structure overview (no headings, no lists).

DATA:
Total Files: {{worker.staticMetrics.totalFiles}}
Lines of Code: {{worker.staticMetrics.totalLinesOfCode}}
Languages: {{worker.metadata.languages}}
Entry Files: {{worker.staticMetrics.entryFiles}}
Has README: {{worker.staticMetrics.hasReadme}}
Has Tests: {{worker.staticMetrics.hasTests}}
Snippets: {{worker.snippets}}

TASK:
Write a short paragraph describing the structure of the codebase, focusing on:
- size and complexity
- languages used
- presence/absence of documentation and tests
- visible entry points
- any major directories inferable from snippet file paths

Do not assume any functionality or architecture that is not directly supported by the data.

 
    """
    return await call_llm(prompt)
