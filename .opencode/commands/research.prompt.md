---
name: research
description: "Research a topic using the web and consolidate findings into a durable knowledge-base document under docs/research/."
argument-hint: "[Research topic: what to investigate and document]"
agent: Coordinator Agent
---

Act as the coordinator entry point for research work. Route research and documentation; do not do specialist work inline.

1. Treat the user's `argument` as the research topic — this is the most concrete anchor for the entire workflow.

2. Delegate to `Web Research Agent` using the **Request Web Research** handoff:
   - Prompt them to research the given topic using trusted upstream web sources (official docs, vendor references, standards pages).
   - Ask them to return: the concrete question investigated, confirmed facts, source URLs consulted, the fetch date, any mismatch with local repository guidance, the next owning agent, and whether the plan-derived research work is exhausted.
   - Rely on Web Research Agent's own Output Expectations (concrete question, confirmed facts, source URLs, mismatch with local guidance, next owner).
   - Wait for the Web Research Agent to complete before proceeding.

3. After the Web Research Agent returns its findings, delegate to `Documentation Agent` using the **Update Docs** handoff:
   - Pass the research topic and the Web Research Agent's findings as context.
   - Derive the filename from the research topic as a kebab-case slug (e.g., "machine learning basics" → `machine-learning-basics.md`). Use simple slugification: lowercase, replace spaces with hyphens, remove special characters.
   - Target path: `docs/research/<slug>.md`.
   - If a document already exists at that path, update it with new findings rather than overwriting. Add a "Last updated: YYYY-MM-DD" line to the frontmatter or top of the file.
   - If the document is new, write it with: a title, a short scope/audience line, the consolidated findings with inline source citations, and the date of research.
   - Follow the authoring rules in `.github/instructions/docs.instructions.md` (source-anchored prose, scannable structure, verified commands/paths, no TBD/TODO in published docs).

4. After the Documentation Agent finishes, run markdown diagnostics on the touched file under `docs/research/`.

5. Synthesize for the user:
   - what topic was researched
   - what document was created or updated
   - key findings
   - source URLs consulted
   - any residual gaps, uncertainties, or suggestions for follow-up research

Keep the conversation focused on the active stage. Only one specialist active at a time: Web Research Agent must complete before Documentation Agent starts. If either specialist reveals scope drift, a missing prerequisite, or a different owner, reroute instead of forcing the current specialist forward.
