---
name: document-update
description: Warchive - Coordinate a documentation task for this repository, whether that is a single page, a targeted rewrite, a customization doc update, or a broader documentation refresh across README.md, docs/app/, docs/research/, docs/sprint/, docs/prompt/, .opencode, and .github.
argument-hint: "[Target doc path, topic, or refresh scope. Optional: audience, related docs, docs to skip, or whether this is durable knowledge, active planning, or a customization doc update.]"
agent: Coordinator Agent
---

1. Decide whether the request is for a single document, a small multi-doc update, or a broader documentation refresh.
2. Retrieve only enough source and documentation context to identify the owning doc surface and the first validation step. If the source facts are broad or unclear, use `Explorer Agent` first instead of drafting from assumptions.
3. If the scope is unclear, use `#askQuestions` to summarize the requested documentation pass first, then confirm the target docs, intended audience, and whether stale docs may be merged or removed. Explain what each candidate document currently owns, why the decision matters, and keep freeform input enabled for follow-up questions.
4. When the task creates or updates app-reference docs under `docs/app/`, use `#askQuestions` to confirm baseline app-doc coverage for this pass: architecture, configuration and environment, interfaces (CLI, API, or UI), data and persistence, operations and observability, quality gates, deprecations, and security.
	- treat `docs/app/deprecations.md` as part of the baseline set for deprecated features, modules, or processes
	- keep language that encourages expanding `docs/app/` with specialized docs that add value for users or maintainers
5. For broad refreshes, audit `README.md`, `docs/app/`, `docs/research/`, `docs/sprint/`, `docs/prompt/`, and relevant `.github/` docs first and classify each candidate as keep / rewrite / merge / delete before drafting begins.
6. Route the writing work to `Documentation Agent` once the target scope is clear.
7. When the task spans multiple docs, keep a catalog of keep / rewrite / merge / delete candidates and confirm any deletes with the user before removal.
8. If the user names a specific path under `.github/` or another docs-adjacent surface, honor that path instead of forcing relocation into the main docs tree.
9. If the user names only a topic and no path, default to:
	- `docs/app/<slug>.md` for durable reference material
	- `docs/research/<slug>.md` for repo-level process, customization, or research notes
	- `docs/sprint/<slug>.md` for active planning or deferred work
	Use `#askQuestions` when the intended home is still ambiguous, and describe the difference between those doc directories in plain language so the user can choose without prior repo knowledge.
10. Keep repository doc ownership consistent:
	- `README.md` owns the user-facing overview and top-level command index
	- `docs/app/` owns durable reference material
	- `docs/research/` owns repo-level process, quality, customization, and research notes
	- `docs/sprint/` owns active planning and deferred work
11. Require source-anchored documentation updates rather than prose written from plan language alone.
12. For single-page work, verify cited symbols, file paths, commands, config keys, and links before concluding.
13. When a doc refresh changes indexes or ownership boundaries, update sibling links in the same pass and make sure `README.md`, `docs/app/architecture.md`, and `.github/copilot-instructions.md` stay aligned when they own the surrounding suite.
14. Prefer diagnostics, targeted search, and focused command checks as the first validation path for doc changes.
15. If the documentation pass discovers that the missing fact is still undecided in source, reroute to `Implementation Agent` or stay in coordinator flow instead of hardening an assumption into prose.
16. After the documentation pass, summarize what changed, what was verified, whether plan-derived documentation work is exhausted, and which plan-derived follow-up pass is next when it is not. Label any extra idea as a suggestion outside the plan.
17. Provide a concise, imperative commit message scoped to the changed files.

## Output

- End with a short document summary of any keep / rewrite / merge / delete actions, the tasks performed, and the validation run results.

## Example Final Response

```markdown
Target: `.github/copilot-instructions.md`
Actions:
- Keep the small shared workflow unchanged.
- Rewrite the prompt-routing paragraph for clarity.
- Delete no files.
Tasks:
- Explorer Agent verified the surrounding customization docs.
- Documentation Agent updated the instructions and aligned related links.
Validation:
- Markdown diagnostics clean for the touched files.
```
