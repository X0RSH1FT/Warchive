---
name: document
description: Coordinate a documentation task for this repository, whether that is a single page, a targeted rewrite, a customization doc update, or a broader refresh across `README.md` and the repository's existing documentation surfaces.
argument-hint: "[Target doc path, topic, or refresh scope. Optional: audience, related docs, docs to skip, or whether this is a durable reference, research note, planning note, or a customization doc update.]"
agent: Coordinator Agent
---

1. Decide whether the request is for a single document, a small multi-doc update, or a broader documentation refresh.
2. Retrieve only enough source and documentation context to identify the owning doc surface and the first validation step. If the source facts are broad or unclear, use `Explorer Agent` first instead of drafting from assumptions.
3. If the scope is unclear, use `#askQuestions` to summarize the requested documentation pass first, then confirm the target docs, intended audience, and whether stale docs may be merged or removed. Explain what each candidate document currently owns, why the decision matters, and keep freeform input enabled for follow-up questions.
4. For broad refreshes, audit `README.md` plus the repository's existing docs directories first and classify each relevant doc as keep / rewrite / merge / delete before drafting begins.
5. Route the writing work to `Documentation Agent` once the target scope is clear.
6. When the task spans multiple docs, keep a catalog of keep / rewrite / merge / delete candidates and confirm any deletes with the user before removal.
7. If the user names a specific path under `.github/` or another docs-adjacent surface, honor that path instead of forcing relocation into the main docs tree.
8. If the user names only a topic and no path, default to:
   - `README.md` for top-level overview and navigation when the document is repo-facing
   - `docs/research/<slug>.md` for durable research, customization, or reference notes when that surface exists
   - an existing planning-notes surface for active planning or deferred work
   Use `#askQuestions` when the intended home is still ambiguous, when the repository does not already have the needed docs bucket, or when a new directory would need to be introduced.
9. Keep repository doc ownership consistent:
   - `README.md` owns the user-facing overview and top-level navigation when it already serves that role
   - the existing durable docs surface owns stable reference material
   - the existing research or knowledge-notes surface such as `docs/research/` owns repo-level process, customization, and research notes
   - the existing planning-notes surface owns active planning and deferred work; if no such surface exists, ask before creating one
10. Require source-anchored documentation updates rather than prose written from plan language alone.
11. For single-page work, verify cited symbols, file paths, commands, config keys, and links before concluding.
12. When a doc refresh changes indexes or ownership boundaries, update sibling links in the same pass and keep any owning overview or index documents aligned when they currently index that suite.
13. Prefer diagnostics, targeted search, and focused command checks as the first validation path for doc changes.
14. If the documentation pass discovers that the missing fact is still undecided in source, reroute to `Implementation Agent` or back to `Coordinator Agent` instead of hardening an assumption into prose.
15. After the documentation pass, summarize what changed, what was verified, whether plan-derived documentation work is exhausted, and which plan-derived follow-up pass is next when it is not. Label any extra idea as a suggestion outside the plan.
16. Provide a concise, imperative commit message scoped to the changed files.

Example response shape:
- Scope: update `README.md` and `docs/research/example.md` for the same workflow change.
- Ownership: `README.md` keeps overview text; `docs/research/example.md` keeps durable reference detail.
- Validation: links checked, paths confirmed, and Markdown diagnostics clean.
- Follow-up: review pass only if the rewrite changes doc ownership or deletes stale pages.
- Commit message: Update README and research note for workflow change.
