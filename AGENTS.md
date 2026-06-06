Primary instruction file: `.github/copilot-instructions.md`. Always check this file before executing any repository-specific agent workflows.

Do not rely on README.md for agent behavior details — use `.github/copilot-instructions.md` for all agent-specific configuration and usage guidance.

## Tool Invocation Guidance

Compact reference for calling OpenCode's built-in tools correctly. Universal rules first, then tool-by-tool.

### Universal Rules

1. **All required parameters must be present.** Omitting a required parameter produces a `SchemaError`.
2. **Use exact parameter names.** No aliases — e.g. `subagent_type`, not `agent_type` or `agent`.
3. **Omit optional string fields entirely.** Never send `"undefined"`, `"null"`, or empty string.
4. **Use absolute paths** for `read`, `edit`, `write`, `glob`, `grep`.
5. **`grep` patterns are regex.** Escape special chars (`.*+?^${}()[]`).
6. **`bash` description is required.** Provide 5–10 words explaining the command.

### Quick-Reference Table

| Tool | Required Params | Common Mistakes |
|------|----------------|-----------------|
| `task` | `description`, `prompt`, `subagent_type` | Using `agent_type` instead of `subagent_type`; omitting `description` |
| `bash` | `command`, `description` | Omitting `description`; using `cd`+`&&` instead of `workdir` |
| `read` | `filePath` | Relative path; forgetting `limit` causes truncation with `"(Showing lines X-Y of Z)"` message |
| `edit` | `filePath`, `oldString`, `newString` | Whitespace mismatch in `oldString` |
| `write` | `filePath`, `content` | Relative path |
| `grep` | `pattern` | Not escaping regex metacharacters; sending `path: null` |
| `glob` | `pattern` | Sending `path: null` instead of omitting |
| `question` | `questions` (array) | Omitting `header`; options without `description` |
| `todowrite` | `todos` (array) | Using `description` instead of `content`; omitting `priority` or `status` |
| `webfetch` | `url` | Omitting `http://` or `https://` prefix |

### Tool Details

#### 1. `task` — Subagent Delegation
- **Required:** `description` (string, 3–5 words), `prompt` (string, full task), `subagent_type` (string, agent name)
- **Optional:** `task_id` (string, resume session), `command` (string), `background` (boolean)
- **⚠️ Common mistakes:** Sending `agent` or `agent_type` instead of `subagent_type`; omitting `description` (causes `SchemaError(Missing key at ["description"])`); sending `undefined`/`null` for optional string params

#### 2. `bash` — Shell Execution
- **Required:** `command` (string), `description` (string, 5–10 words explaining what the command does)
- **Optional:** `timeout` (PositiveInt, milliseconds), `workdir` (string — use instead of `cd`)
- **⚠️ Common mistakes:** Omitting `description`; using `cd` + `&&` instead of `workdir`; sending `timeout` as string

#### 3. `read` — File Reading
- **Required:** `filePath` (string, absolute path)
- **Optional:** `offset` (NonNegativeInt, 1-indexed), `limit` (NonNegativeInt, default 2000 lines)
- **⚠️ Common mistakes:** Sending relative path instead of absolute; setting `limit` too small without realizing the tool returns a truncation message `(Showing lines X-Y of Z. Use offset=N to continue.)` — the file still has more content past the limit

#### 4. `edit` — File Editing
- **Required:** `filePath` (string), `oldString` (string, must match exactly), `newString` (string, must differ from oldString)
- **Optional:** `replaceAll` (boolean)
- **⚠️ Common mistakes:** Whitespace mismatch in `oldString` — the most common cause of edit failures

#### 5. `write` — File Creation
- **Required:** `filePath` (string, must be absolute), `content` (string)
- **⚠️ Common mistakes:** Sending relative path

#### 6. `grep` — Regex Search
- **Required:** `pattern` (string, regex — escape special chars like `.*+?^${}()[]`)
- **Optional:** `path` (string, omit to default to CWD — do **not** send `"undefined"` or `null`), `include` (string, file pattern)
- **⚠️ Common mistakes:** Not escaping regex metacharacters; sending `path: null` instead of omitting

#### 7. `glob` — File Pattern Search
- **Required:** `pattern` (string, glob e.g. `**/*.js`)
- **Optional:** `path` (string, same omit rule as grep)
- **⚠️ Common mistakes:** Same as grep — omit `path` entirely rather than sending null

#### 8. `question` — Ask the User
- **Required:** `questions` (array of objects, each with `question` (string), `header` (string, ≤30 chars), `options` (array of `{label, description}`), `multiple` (boolean))
- **⚠️ Common mistakes:** Omitting `header`; providing options without `description`

#### 9. `todowrite` — Todo List
- **Required:** `todos` (array of objects, each with `content` (string), `status` (one of `pending`/`in_progress`/`completed`/`cancelled`), `priority` (one of `high`/`medium`/`low`))
- **⚠️ Common mistakes:**
  - Using `description` instead of `content` (the `task` tool uses `description`, so this is a very common slip) → `SchemaError(Missing key at ["todos"][0]["content"])`
  - Omitting `priority` → `SchemaError(Missing key at ["todos"][0]["priority"])`
  - Omitting `status` → `SchemaError(Missing key at ["todos"][0]["status"])`

#### 10. `webfetch` — Web Fetching
- **Required:** `url` (string, must start with `http://` or `https://`)
- **Optional:** `format` (`"text"`, `"markdown"`, or `"html"`)
- **⚠️ Common mistakes:** Omitting protocol prefix

### Syntax Examples

Complete, real-world invocation examples for every tool. Each block shows the exact JSON/parameter shape you would write inside a `<｜｜DSML｜｜tool_calls>` block.

#### 1. `task` — Subagent Delegation

**Fresh task:**

```json
{
  "name": "task",
  "parameters": {
    "description": "Research agentic coding patterns",
    "prompt": "Read docs/research/agentic-coding.md and summarize the three main agent workflow patterns described there.",
    "subagent_type": "research"
  }
}
```

**Resume an existing session (using `task_id`):**

```json
{
  "name": "task",
  "parameters": {
    "description": "Continue research summarization",
    "prompt": "Continue from where you left off. Extract the recommended tooling choices from the remaining sections.",
    "subagent_type": "research",
    "task_id": "session_abc123"
  }
}
```

<details>
<summary>Common pitfalls</summary>

- Using `"agent_type": "research"` — must be `subagent_type`.
- Omitting `description` (3–5 words required).
- Sending `"task_id": null` instead of omitting the key entirely.
</details>

---

#### 2. `bash` — Shell Execution

**Run a diagnostic search with `workdir` (not `cd`):**

```json
{
  "name": "bash",
  "parameters": {
    "command": "rg -l 'TODO|FIXME' --type md",
    "description": "Find markdown files with outstanding TODOs",
    "workdir": "/mnt/i/AkashicRecords/Warchive"
  }
}
```

**Lint a file (with timeout):**

```json
{
  "name": "bash",
  "parameters": {
    "command": "npx markdownlint-cli AGENTS.md",
    "description": "Lint the AGENTS.md file for formatting issues",
    "timeout": 30000
  }
}
```

<details>
<summary>Common pitfalls</summary>

- Omitting `description` (the most common `bash` mistake).
- Using `"command": "cd docs && ls"` instead of setting `workdir: "/mnt/i/AkashicRecords/Warchive/docs"`.
- Sending `"timeout": "30000"` (string) instead of `30000` (integer).
</details>

---

#### 3. `read` — File Reading

**Read from the start:**

```json
{
  "name": "read",
  "parameters": {
    "filePath": "/mnt/i/AkashicRecords/Warchive/.github/copilot-instructions.md"
  }
}
```

**Read a specific window:**

```json
{
  "name": "read",
  "parameters": {
    "filePath": "/mnt/i/AkashicRecords/Warchive/AGENTS.md",
    "offset": 35,
    "limit": 50
  }
}
```

<details>
<summary>Common pitfalls</summary>

- Using a relative path like `AGENTS.md` instead of the absolute `/mnt/i/AkashicRecords/Warchive/AGENTS.md`.
- Setting `limit` too small (e.g. `30`) and missing the `(Showing lines X-Y of Z. Use offset=N to continue.)` truncation hint.
</details>

---

#### 4. `edit` — Exact String Replacement

**Fix a typo — whitespace must match exactly:**

```json
{
  "name": "edit",
  "parameters": {
    "filePath": "/mnt/i/AkashicRecords/Warchive/docs/research/agentic-coding.md",
    "oldString": "definately not recommended",
    "newString": "definitely not recommended"
  }
}
```

**Replace a larger block (more context avoids ambiguous matches):**

```json
{
  "name": "edit",
  "parameters": {
    "filePath": "/mnt/i/AkashicRecords/Warchive/AGENTS.md",
    "oldString": "| `question` | `questions` (array) | Omitting `header`; options without `description` |\n| `todowrite` | `todos` (array) | Using `description` instead of `content`",
    "newString": "| `question` | `questions` (array) | Omitting `header`; options without `description` |\n| `todowrite` | `todos` (array) | Using `content`, NOT `description`"
  }
}
```

<details>
<summary>Common pitfalls</summary>

- **Whitespace mismatch** — if the file uses tabs and your `oldString` has spaces (or vice versa), the edit silently fails with `"oldString not found in content"`.
- Ambiguous `oldString` that appears more than once — add surrounding lines to disambiguate, or use `replaceAll: true` when the intent _is_ to replace every occurrence.
</details>

---

#### 5. `write` — File Creation

**Create a new research note:**

```json
{
  "name": "write",
  "parameters": {
    "filePath": "/mnt/i/AkashicRecords/Warchive/docs/research/opencode-tool-examples.md",
    "content": "# OpenCode Tool Examples\n\nReference invocations for quick copy-paste.\n"
  }
}
```

<details>
<summary>Common pitfalls</summary>

- Relative path like `docs/research/note.md` — use the full `/mnt/i/AkashicRecords/Warchive/...` path.
- Failing to `read` the file first if it already exists — `write` will fail with `"use read first"`.
</details>

---

#### 6. `grep` — Regex Search

**Search for a literal pattern (escape regex metacharacters):**

```json
{
  "name": "grep",
  "pattern": "subagent_type"
}
```
This searches the current working directory for the literal string `subagent_type`. No special chars to escape here.

**Search within a specific directory with a regex that needs escaping:**

```json
{
  "name": "grep",
  "pattern": "SchemaError\\(Missing key",
  "path": "/mnt/i/AkashicRecords/Warchive"
}
```

<details>
<summary>Common pitfalls</summary>

- **Not escaping regex metacharacters.** `SchemaError(Missing key` must be written as `SchemaError\\(Missing key` because `(` and `)` are regex group operators.
- Sending `"path": null` — omit the `path` key entirely instead.
</details>

---

#### 7. `glob` — File Pattern Search

**Find all markdown files in the docs tree:**

```json
{
  "name": "glob",
  "pattern": "docs/**/*.md"
}
```

**Find JSON config files — omit `path` to use the default CWD:**

```json
{
  "name": "glob",
  "pattern": "**/*.json"
}
```

**Explicit directory scope (correct way to set a path):**

```json
{
  "name": "glob",
  "pattern": "**/*.md",
  "path": "/mnt/i/AkashicRecords/Warchive/.github"
}
```

<details>
<summary>Common pitfalls</summary>

- Sending `"path": null` — always omit the key if you don't need it.
- Using a regex pattern like `*.md` instead of the glob pattern `**/*.md`.
</details>

---

#### 8. `question` — Ask the User ⭐

This tool has the most complex shape and the most frequent mistakes. Study these examples carefully.

**Simple single-question ask with options:**

```json
{
  "name": "question",
  "parameters": {
    "questions": [
      {
        "question": "Which research doc should I summarize first?",
        "header": "Pick a doc to summarize",
        "options": [
          {
            "label": "agentic-coding.md",
            "description": "Agent workflow patterns and tooling recommendations"
          },
          {
            "label": "opencode-agent-configuration-reference.md",
            "description": "Reference for configuring OpenCode agents"
          }
        ]
      }
    ]
  }
}
```

**Multi-question ask (two questions in one call):**

```json
{
  "name": "question",
  "parameters": {
    "questions": [
      {
        "question": "Which output format do you prefer?",
        "header": "Output format",
        "options": [
          { "label": "Markdown", "description": "Formatted with headings and code blocks" },
          { "label": "Plain text", "description": "Minimal formatting, easy to copy" }
        ]
      },
      {
        "question": "Should the summary include a table of contents?",
        "header": "Include TOC?",
        "options": [
          { "label": "Yes", "description": "Generate a linked table of contents" },
          { "label": "No", "description": "Skip the table of contents" }
        ]
      }
    ]
  }
}
```

**Question with `multiple: true` (user can pick several options):**

```json
{
  "name": "question",
  "parameters": {
    "questions": [
      {
        "question": "Which agent types should I use for this task? (select all that apply)",
        "header": "Select agents",
        "multiple": true,
        "options": [
          { "label": "research", "description": "Handles reading and summarizing documentation" },
          { "label": "tech", "description": "Handles code changes and implementation" },
          { "label": "coordinator", "description": "Routes work between specialist agents" }
        ]
      }
    ]
  }
}
```

<details>
<summary>⚠️ Most common mistakes with <code>question</code></summary>

1. **Omitting `header`** — every question object must have `"header": "..."` (max 30 chars).
2. **Options without `description`** — every option must have both `label` and `description`.
3. **Forgetting `multiple: true`** when you intend to allow multiple selections (default is single-select).
4. **Using `"option"` or `"choices"` instead of `"options"`** — the array key is always `options`.
5. **Sending a single object instead of an array** — `questions` must be an array, even with one question: `[{...}]`.
</details>

---

#### 9. `todowrite` — Create Todo Items

**Correct shape — note `content` (NOT `description`):**

```json
{
  "name": "todowrite",
  "parameters": {
    "todos": [
      {
        "content": "Add syntax examples for all 10 tools in AGENTS.md",
        "status": "completed",
        "priority": "high"
      },
      {
        "content": "Verify examples with read-back check",
        "status": "in_progress",
        "priority": "high"
      },
      {
        "content": "Add cross-reference links between sections",
        "status": "pending",
        "priority": "low"
      }
    ]
  }
}
```

<details>
<summary>⚠️ Most common mistake with <code>todowrite</code></summary>

The `task` tool uses `description`, so it is very easy to accidentally write this:

```json
// ❌ WRONG — SchemaError!
{ "description": "Verify examples", "status": "pending", "priority": "high" }
```

The parameter is **`content`**, not `description`:

```json
// ✅ CORRECT
{ "content": "Verify examples", "status": "pending", "priority": "high" }
```

Also, `status` must be one of `pending`, `in_progress`, `completed`, or `cancelled` (all lowercase), and `priority` must be one of `high`, `medium`, or `low`.
</details>

---

#### 10. `webfetch` — Web Fetching

**Fetch a URL and convert to markdown (default format):**

```json
{
  "name": "webfetch",
  "url": "https://raw.githubusercontent.com/opencode-ai/docs/main/agent-configuration.md"
}
```

**Fetch with explicit format:**

```json
{
  "name": "webfetch",
  "parameters": {
    "url": "https://docs.astral.sh/uv/cli/",
    "format": "markdown"
  }
}
```

<details>
<summary>Common pitfalls</summary>

- Omitting `https://` or `http://` prefix — `"url": "docs.astral.sh/uv/cli/"` will fail.
- Using `path` or `source` instead of `url`.
</details>

---

*End of Syntax Examples section. Refer back to the Quick-Reference Table and Tool Details above for parameter requirements.*
