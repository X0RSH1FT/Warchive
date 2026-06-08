---
name: research-document
description: "Warchive - Research a topic using the web and consolidate findings into a knowledge-base document under docs/research/."
argument-hint: "[Research topic: what to investigate and document]"
agent: Coordinator Agent
---

Perform research and write documentation. As a high level orchestrator, delegate tasks to specialist subagents.

1. Handle the user's request as the research topic — this is the concrete anchor for the research workflow.

2. Delegate to `Web Research Agent`:
   - Prompt them to research the given topic using trusted upstream web sources (official docs, vendor references, standards pages).
   - Ask them to return: the topic investigated, confirmed facts, source URLs consulted, the fetch date, any mismatch with local context.
   - Wait for and rely on Web Research Agent's results.

3. After the Web Research Agent returns its findings, delegate to `Documentation Agent`:
   - Pass the research topic and the Web Research Agent's findings as context.
   - Derive the filename from the research topic as a kebab-case slug (e.g., "machine learning basics" → `machine-learning-basics.md`). Use simple slugification: lowercase, replace spaces with hyphens, remove special characters.
   - Target path: `docs/research/<slug>.md`.
   - If a document already exists at that path, update it with new findings rather than overwriting. Add a "Last updated: YYYY-MM-DD" line to the frontmatter or top of the file.
   - If the document is new, write it with: a title, a short scope/audience line, the consolidated findings with inline source citations, and the date of research.

4. After the Documentation Agent finishes, run markdown diagnostics on the touched file under `docs/research/`.

5. Synthesize for the user:
   - what topic was researched
   - what document was created or updated
   - key findings
   - source URLs consulted
   - any residual gaps, uncertainties, or suggestions for follow-up research
