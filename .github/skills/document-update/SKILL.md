---
name: document-update
description: Coordinate a documentation task for this repository, whether a single page, targeted rewrite, customization update, or broader refresh across README.md, docs/knowledge/, docs/research/, and .github.
disable-model-invocation: true
argument-hint: "[Target doc path, topic, or refresh scope. Optional: audience, related docs, docs to skip, or whether this is durable knowledge, active planning, or a customization doc update.]"
---
1. Decide whether the request is for a single document, a small multi-doc update, or a broader documentation refresh.
2. Retrieve only enough source and documentation context to identify the owning doc surface and the first validation step. If the source facts are broad or unclear, use `Text-Explorer` first instead of drafting from assumptions.
3. If the scope is unclear, use `#askQuestions` to summarize the requested documentation pass first, then confirm the target docs, intended audience, and whether stale docs may be merged or removed. Explain what each candidate document currently owns, why the decision matters, and keep freeform input enabled for follow-up questions.
4. For broad refreshes, audit only the relevant `README.md`, `docs/knowledge/`, `docs/research/`, and `.github/` docs first and classify each candidate as keep / rewrite / merge / delete before drafting begins.
5. Route the writing work to `Document-Author` once the target scope is clear.
6. When the task spans multiple docs, keep a catalog of keep / rewrite / merge / delete candidates and confirm any deletes with the user before removal.
7. If the user names a specific path under `.github/` or another docs-adjacent surface, honor that path instead of forcing relocation into the main docs tree.
8. If the user names only a topic and no path, use the relevant `docs/knowledge/` area for general durable references and `docs/research/` for exploratory work. For a portable reference genuinely shared by installed agents, use `agent-package/.apm/skills/warchive-agent-knowledge/resources/`; keep a skill-specific asset with that skill. Ask when ownership is still ambiguous.
9. Keep repository doc ownership consistent:
	- `README.md` owns the user-facing overview and top-level command index
	- `docs/knowledge/` owns general durable references; `docs/research/` owns exploratory material
	- the package knowledge skill owns shared portable agent references; individual skills own their specialized assets
10. Require source-anchored documentation updates rather than prose written from plan language alone.
11. For single-page work, verify cited symbols, file paths, commands, config keys, and links before concluding.
12. When a doc refresh changes indexes or ownership boundaries, update sibling links in the same pass and keep `README.md` and `.github/copilot-instructions.md` aligned where relevant.
13. Prefer targeted read/search checks for the `Document-Author`. Route execution-based diagnostics or commands to a permitted validation tool or `Code-Tester`; if unavailable, mark them unverified instead of attributing them to the author.
14. If the documentation pass discovers that the missing fact is still undecided in source, reroute to the appropriate coder or `Task-Orchestrator` instead of hardening an assumption into prose.
15. After the documentation pass, summarize what changed, what was verified, whether plan-derived documentation work is exhausted, and which plan-derived follow-up pass is next when it is not. Label any extra idea as a suggestion outside the plan.
16. Provide a concise, imperative commit message scoped to the changed files.

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
- `Text-Explorer` verified the surrounding customization docs.
- `Document-Author` updated the instructions and aligned related links.
Validation:
- Markdown diagnostics clean for the touched files.
```
