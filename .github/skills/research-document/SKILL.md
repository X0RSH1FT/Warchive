---
name: research-document
description: Research a topic using the web and consolidate findings into a knowledge-base document under docs/research/.
disable-model-invocation: true
argument-hint: "[Research topic: what to investigate and document]"
---
Perform research and write documentation. As a high level orchestrator, delegate tasks to specialist subagents.

1. Handle the user's request as the research topic — this is the concrete anchor for the research workflow.

2. Delegate to `Web-Researcher`:
   - Prompt them to research the given topic using trusted upstream web sources (official docs, vendor references, standards pages).
   - If local comparison is needed, first obtain relevant local excerpts with `Text-Explorer` and pass them explicitly; do not ask a web-only researcher to search the repository.
   - Ask them to return: the topic investigated, confirmed facts, source URLs consulted, the research date when known, any mismatch with supplied local context, unknowns, and next action.
   - Wait for and rely on `Web-Researcher`'s results.

3. After `Web-Researcher` returns its findings, delegate to `Document-Author`:
   - Pass the research topic and the `Web-Researcher` findings as context.
   - Derive the filename from the research topic as a kebab-case slug (e.g., "machine learning basics" → `machine-learning-basics.md`). Use simple slugification: lowercase, replace spaces with hyphens, remove special characters.
   - Target path: `docs/research/<slug>.md`.
   - If a document already exists at that path, update it with new findings rather than overwriting. Add a "Last updated: YYYY-MM-DD" line to the frontmatter or top of the file.
   - If the document is new, write it with: a title, a short scope/audience line, the consolidated findings with inline source citations, and the date of research.

4. After `Document-Author` finishes, route markdown diagnostics on the touched file under `docs/research/` to a permitted validation tool or `Code-Tester`. `Document-Author` has no execution permission; if no runner is available, mark diagnostics unverified.

5. Synthesize for the user:
   - what topic was researched
   - what document was created or updated
   - key findings
   - source URLs consulted
   - any residual gaps, uncertainties, or suggestions for follow-up research
