from llm import call_llm

async def generate_codebase_structure(worker):
    prompt = f"""
    Describe the Codebase Structure using:

    Total Files: {worker.staticMetrics.totalFiles}
    Lines of Code: {worker.staticMetrics.totalLinesOfCode}
    Languages: {worker.metadata.languages}
    Entry Files: {worker.staticMetrics.entryFiles}
    Has README: {worker.staticMetrics.hasReadme}
    Has Tests: {worker.staticMetrics.hasTests}
    Snippets: {worker.snippets}

    Output a descriptive Codebase Structure section.
    """
    return await call_llm(prompt)
