---
name: document
description: Coordinate a Glyphmancer documentation task, whether that is a single page, a targeted rewrite, a customization doc update, or a broader documentation refresh across README.md, doc/app, doc/knowledge, and doc/plan.
argument-hint: "[Target doc path, topic, or refresh scope. Optional: audience, related docs, docs to skip, or whether this is durable knowledge, active planning, or a customization doc update.]"
agent: Coordinator Agent
---

1. Decide whether the request is for a single document, a small multi-doc update, or a broader documentation refresh.
2. Retrieve only enough source and documentation context to identify the owning doc surface and the first validation step. If the source facts are broad or unclear, use `Explorer Agent` first instead of drafting from assumptions.
3. If the scope is unclear, use `#askQuestions` to confirm the target docs, intended audience, and whether stale docs may be merged or removed. Explain what each candidate document currently owns, why the decision matters, and keep freeform input enabled for follow-up questions.
4. For broad refreshes, audit `README.md`, `doc/app/`, `doc/knowledge/`, and `doc/plan/` first and classify each relevant doc as keep / rewrite / merge / delete before drafting begins.
5. Route the writing work to `Documentation Agent` once the target scope is clear.
6. When the task spans multiple docs, keep a catalog of keep / rewrite / merge / delete candidates and confirm any deletes with the user before removal.
7. If the user names a specific path under `.github/` or another docs-adjacent surface, honor that path instead of forcing relocation into the main docs tree.
8. If the user names only a topic and no path, default to:
	- `doc/app/<slug>.md` for durable application and subsystem references
	- `doc/knowledge/<slug>.md` for repo-level process, customization, or research notes
	- `doc/plan/<slug>.md` for active planning or deferred work
	Use `#askQuestions` when the intended home is still ambiguous, and describe the difference between those doc directories in plain language so the user can choose without prior repo knowledge.
9. Keep Glyphmancer doc ownership consistent:
	- `README.md` owns the user-facing overview and top-level command index
	- `doc/app/` owns durable application and subsystem references
	- `doc/knowledge/` owns repo-level process, quality, customization, and research notes
	- `doc/plan/` owns active planning and deferred work
10. Require source-anchored documentation updates rather than prose written from plan language alone.
11. For single-page work, verify cited symbols, file paths, commands, config keys, and links before concluding.
12. When a doc refresh changes indexes or ownership boundaries, update sibling links in the same pass and make sure `README.md` plus `doc/app/architecture.md` still index the durable docs suite when they own that suite.
13. Prefer diagnostics, targeted search, and focused command checks as the first validation path for doc changes.
14. If the documentation pass discovers that the missing fact is still undecided in source, reroute to `Implementation Agent` or back to `Coordinator Agent` instead of hardening an assumption into prose.
15. After the documentation pass, summarize what changed, what was verified, and whether any follow-up implementation or review pass is still needed.
16. Provide a concise, imperative commit message scoped to the changed files.
