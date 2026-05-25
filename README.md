# Warchive

> Neon-lit memory vault for humans and machines.
> A cyberpunk archive of knowledge, research, and agent playbooks.

Warchive is built to hold two kinds of signal at once: the knowledge you want to keep, and the procedures machines can execute without drifting off the rails. It is part archive, part field manual, part black-site memory bank for human and synthetic operators.

## What This Repo Is

Warchive is a structured knowledge base for:

- curated reference material that should survive context loss
- working notes that still need synthesis
- raw research and source intake
- reusable playbooks for LLM-based agents
- machine-readable artifacts that support indexing later without forcing it now

The design rule is simple: keep high-trust knowledge separate from noisy intake, and keep repeatable agent behavior separate from prose.

## Signal Flow

```text
inbox -> research -> notes -> canon
                  \-> playbooks -> agent execution
```

If a file is raw, it lives close to the edge.
If it is stable and worth citing, it moves toward `docs/canon/`.
If it describes a repeatable action, it belongs in `agents/playbooks/`.

## Archive Lanes

```text
docs/
  canon/       trusted, stable knowledge
  notes/       synthesis and interpretation
  research/    source-driven intake and rough findings
  maps/        indexes and reading paths
agents/
  prompts/     reusable prompt assets
  playbooks/   executable agent workflows
  personas/    optional role profiles
  evaluations/ tests and review notes
templates/     starter files for consistent entries
data/
  sources/     raw imports and exports
  processed/   normalized or generated artifacts
  manifests/   catalogs and snapshots
scripts/       ingest, index, and validation tooling
visuals/       diagrams and image assets
meta/
  standards/   content model and conventions
  taxonomy/    tag strategy and classification
  glossary/    canonical terms
inbox/         fast capture before triage
```

## Core Doctrine

1. Human readability comes first.
2. Agent usability is designed in, not bolted on.
3. Canon is scarce by design.
4. Research is allowed to be messy.
5. Playbooks should be explicit about trust boundaries, inputs, and outputs.

## Current Focus Domains

- LLM and agent workflows
- software engineering knowledge
- cybersecurity and OPSEC
- research methods and note systems
- creative worldbuilding and lore

These domains can overlap. The archive should encourage cross-links instead of pretending the subjects live in clean silos.

## Metadata Contract

Markdown entries should use frontmatter when practical. The base schema lives in `meta/standards/content-model.md`.

Recommended core fields:

- `title`
- `type`
- `status`
- `tags`
- `updated`
- `source`
- `confidence`

## Start Here

- Read `AGENTS.md` for repository behavior and authoring priorities.
- Use `templates/` when adding new material.
- Keep the high-level index updated in `docs/maps/warchive-map.md`.
- Add new repeatable workflows to `agents/playbooks/`.

## First Mission

1. Capture incoming material quickly.
2. Summarize and classify it.
3. Promote what survives scrutiny.
4. Encode the repeatable parts so agents can run them again.

Warchive is not just a vault. It is memory under discipline.
