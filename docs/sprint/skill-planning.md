## Sprint Plan: Inbox Route And Source Ingest

**Audience:** maintainers shaping the next customization sprint.

**Scope:** define the workflow currently described as "inbox promote," separate it from source ingest, record why "diagram from workflow" belongs in a prompt file, and capture other skill-shaped ideas worth pursuing.

## Source Anchors

- [README.md](../../README.md) defines `inbox/` as temporary capture and `scripts/` as the home for ingestion and validation tooling.
- [inbox/README.md](../../inbox/README.md) says inbox material should be reviewed regularly and moved into a durable documentation home.
- [scripts/README.md](../../scripts/README.md) places ingestion, indexing, and validation tooling under `scripts/`.
- [docs/research/vscode-copilot-agent-customization-reference.md](../research/vscode-copilot-agent-customization-reference.md) says prompt files fit lightweight user-invoked workflows, while skills fit reusable capabilities that need scripts, templates, examples, or other bundled assets.

## Recommended Decisions

| Topic | Recommendation | Why |
|---|---|---|
| Rename `inbox promote` | `Inbox Route` | Clear boundary: route already captured material into the right durable home. |
| Adjacent workflow | `Source Ingest` | Distinct concern: normalize external or raw material before it is ready for inbox routing. |
| `diagram from workflow` | Prompt file | This is a lightweight user-invoked transformation unless it later needs bundled templates, rendering helpers, and validation assets. |

## Name Options

| Name | Fit | Notes |
|---|---|---|
| `Inbox Route` | Best default | Explicit, low ambiguity, and consistent with the temporary-to-durable flow already implied by the repo. |
| `Archive Triage` | Strong alternative | Emphasizes classification and destination choice, but sounds slightly more evaluative than operational. |
| `Capture Route` | Good | Broader than inbox, but still clearly about routing captured material rather than ingesting sources. |
| `Signal Route` | Good with flavor | Keeps the meaning understandable while leaning into a more distinctive voice. |
| `Inbox Relay` | Acceptable | Memorable, but less explicit about the routing decision than `Inbox Route`. |

## Scope Boundary

| Workflow | Starts With | Ends With | Excludes |
|---|---|---|---|
| `Inbox Route` | Material that already exists in the workspace, usually under `inbox/` | A durable documentation update or creation, plus a routing summary and inbox disposition | External fetching, OCR, transcript cleanup, and raw-source normalization |
| `Source Ingest` | External or raw material that is not yet ready for durable docs | A normalized inbox-ready packet with provenance and basic structure | Final durable document placement, canon decisions, and deep merge decisions |

## Inbox Route Workflow

1. Accept a target inbox file or folder, plus any user preference about destination or document type.
2. Check whether the material is normalized enough to classify.
3. If the material is still raw, stop and hand off to `Source Ingest`.
4. Classify the durable destination.
5. Decide whether to merge into an existing document or create a new one.
6. Rewrite the material into the destination document shape.
7. Record provenance, file movement, and any follow-up gaps.
8. Validate the destination choice, structure, and local cross-links before closing the workflow.

### Inputs

- Inbox file or folder path
- Optional preferred destination
- Optional document intent such as research note, working note, or canon draft
- Any provenance already attached to the material

### Outputs

- One durable document update or creation
- A short routing summary explaining destination and merge-vs-create choice
- Clear disposition for the inbox item
- Any follow-up work that should move to a separate workflow

### Decision Points

- Is the input readable and normalized enough to classify?
- Does the material belong in research, working notes, or canon?
- Should this content merge into an existing owner document?
- Is a separate derived artifact requested after the text is stabilized?

### Validation Boundary

`Inbox Route` should validate only repo-local documentation outcomes: destination choice, document structure, provenance presence, and local cross-link sanity. It should not absorb external retrieval, media processing, or diagram generation.

## Minimum Skill Assets

The workflow is only worth packaging as a skill if it ships with assets that a prompt file would not carry well.

| Asset | Purpose |
|---|---|
| Routing matrix | Distinguishes research, notes, and canon with concrete acceptance criteria and merge-vs-create rules. |
| Worked examples | Show at least one merge case and one create-new case from inbox input to durable output. |
| Promotion checklist | Covers provenance, destination choice, file naming, cross-links, and inbox cleanup. |
| Output templates | Provide minimal skeletons for each allowed destination document class. |
| Optional validator hook | Adds a repeatable check from `scripts/` if the workflow matures enough to justify automation. |

## Sprint Deliverables

1. Final naming decision for `Inbox Route` and `Source Ingest`.
2. A scoped workflow note that makes the boundary between the two explicit.
3. A skill asset checklist for `Inbox Route`.
4. A prompt-file note for `diagram from workflow`.
5. A terminology cleanup pass for any nearby docs that still blur routing, ingest, and durable-document placement.

## Sequence

1. Confirm the names and the handoff boundary.
2. Write the routing matrix and destination rules.
3. Draft the worked examples and checklist assets.
4. Decide whether the repo needs a validator hook in `scripts/` now or later.
5. Draft the skill only after the asset bundle is concrete.
6. Implement `diagram from workflow` separately as a prompt file if it is still wanted after the terminology is stable.

## Open Questions

- Should `Inbox Route` physically move inbox files, or only synthesize content into a durable destination?
- Are `docs/notes/` and `docs/canon/` intended future homes, or should the destination model be revised to match the current tree first?
- What provenance fields should be required before content is eligible for a canon destination?
- Should `Source Ingest` be a user-facing skill immediately, or stay a smaller internal capability until the inbox boundary is stable?

## Risks

- Scope overlap will return if `Source Ingest` starts making durable-document placement decisions.
- The destination model stays fuzzy until the repo either creates or revises the `docs/notes/` and `docs/canon/` paths named in [inbox/README.md](../../inbox/README.md).
- `diagram from workflow` may creep back into skill territory if it accumulates templates and helper assets without an explicit decision.

## Other Skill Candidates

These ideas are intentionally skill-shaped rather than simple prompt-shaped. Each one assumes bundled examples, checklists, or scripts.

| Name | Core capability | Why it fits a skill |
|---|---|---|
| `canon-drift-radar` | Detect conflicts between settled guidance and newer research or notes | Needs heuristics, comparison rules, and validation examples rather than a one-shot prompt body. |
| `evidence-trace` | Map claims in durable docs back to source notes and provenance | Benefits from trace templates, evidence tables, and worked examples. |
| `provenance-stamp` | Audit and backfill source, date, and status metadata across docs | Strong fit for a repeatable checklist plus optional validation scripts. |
| `signal-indexer` | Build topic indexes, folder summaries, or navigation tables from clustered docs and visuals | Needs reusable templates and indexing patterns. |
| `link-grid-sweep` | Run a repo-wide internal link and local README integrity pass | Better as a skill when paired with fix heuristics and script-backed validation. |
| `prompt-eval-rig` | Package fixtures, expected outcomes, and scoring guidance for prompt and skill evaluation | Clearly asset-heavy and reusable across multiple customization passes. |
| `ghost-branch-brief` | Generate compact intelligence briefs for a folder, topic, or customization surface before a planning session | Works if bundled with brief templates, comparison rubrics, and examples. |
| `neon-glossary` | Maintain a controlled vocabulary for recurring repo concepts and flag term drift | Needs normalization rules, examples, and a living term map. |

## Near-Term Recommendation

Use this sprint to settle the `Inbox Route` versus `Source Ingest` boundary first. Without that split, every related idea will keep collapsing into the same fuzzy workflow.