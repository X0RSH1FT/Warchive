---
name: refresh-document
description: "Refresh a Markdown document using the appropriate verification workflow."
argument-hint: "[Document path: relative to repo root]"
agent: Coordinator Agent
---

Act as an entry point for refreshing documents.

1. **Resolve the target path**:
   * If the user provided an argument, treat it as a file path relative to the repository root.
   * If no argument is given, assume the current open file (`$CURRENT_FILE`) and use that path.

2. **Verify the file exists**:
   - Fail early if `[ ! -f "${path}" ]`.
   - Return status: `Document not found – abort.`

3. **Classify the document**:
   a) **Research documents** – present in `docs/research/**` with slugified filenames.
      * Route to the existing *research* workflow which re‑runs Web Research and Documentation agents to update the file.

   b) **Task list documents** – contain frontmatter or content indicating a task tracker (e.g., a table of tasks, `- [ ]`, or `# Tasks`).
      * Route to the *next‑task* logic: clean up completed tasks, remove comments marked `**Done**`, and add new tasks if required.  Use the existing task‑management agent.

   c) **Application documentation** – found in `docs/<module>/` or top‑level `README.md`.
      * Route to the application‑validation workflow:
        1. Run a code‑to‑doc comparison using the *Compare Docs* agent.
        2. Apply fixes automatically where differences are traceable; otherwise flag issues for review.

4. **Execute the chosen workflow and capture its status**:
   * On success: echo `✓ Refreshed ${path} – <type> updated.`
   * On failure: echo `✗ Failed to refresh ${path}: <error details>.`

5. **Emit final report and close the command prompt.**
