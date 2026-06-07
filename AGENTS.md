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
