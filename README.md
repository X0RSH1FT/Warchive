# Warchive

Neon-lit memory vault for humans and machines: a cyberpunk archive of knowledge, research, and agent playbooks.

## Purpose

Warchive is a personal knowledge repository designed for two readers:

- humans who need a clear, browsable archive
- LLM-based agents that need predictable structure, metadata, and task playbooks

The repository keeps curated knowledge separate from raw intake so the archive can grow without turning into noise.

## Layout

```text
docs/
  canon/      trusted, curated knowledge
  notes/      synthesis, essays, and working thoughts
  research/   raw findings, source summaries, and intake
  maps/       topic indexes and reading paths
agents/
  prompts/    reusable prompt assets
  playbooks/  task-oriented workflows for agents
  personas/   optional specialized operating modes
  evaluations/ prompt tests and expected outcomes
templates/    starter files for consistent entries
data/
  sources/    raw machine-readable imports
  processed/  normalized or generated artifacts
  manifests/  indexes, catalogs, and snapshots
scripts/      ingestion, indexing, and validation tooling
visuals/      diagrams and images
meta/
  standards/  content conventions and schemas
  taxonomy/   tags and classification rules
  glossary/   canonical terms
inbox/        quick capture before triage
```

## Operating Model

1. Capture fast in `inbox/` or `docs/research/`.
2. Synthesize into `docs/notes/`.
3. Promote stable knowledge into `docs/canon/`.
4. Record repeatable agent work in `agents/playbooks/`.
5. Keep metadata consistent using the files in `templates/` and `meta/standards/`.

## Metadata

Markdown entries should use frontmatter when practical. The base schema is documented in `meta/standards/content-model.md`.

Recommended core fields:

- `title`
- `type`
- `status`
- `tags`
- `updated`
- `source`
- `confidence`

## First Steps

1. Add your first working note from `templates/note.md`.
2. Write your first repeatable agent workflow from `templates/playbook.md`.
3. Update `docs/maps/warchive-map.md` as major topics emerge.
