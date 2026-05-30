# Sprint Note: Local Ollama Usage Metrics on Windows

**Audience:** maintainers or solo Windows users who want practical local visibility into Ollama usage without assuming Ollama ships built-in analytics.

**Scope:** compare three implementation paths for collecting local Ollama usage metrics on Windows, define what each path can and cannot prove, and provide enough implementation detail to choose one and build it during an active sprint.

## Source Anchors

- [Documentation Writing Guidance](../../.github/instructions/docs.instructions.md) assigns `docs/sprint/` to checklist-style planning notes, implementation notes, and other in-flight work tracking.
- [Sprint Plan: Inbox Route And Source Ingest](./skill-planning.md) establishes the current sprint-note shape used in this repo.
- [scripts/ollama-install.ps1](../../scripts/ollama-install.ps1) confirms Ollama is already a repo-relevant Windows tool.
- [docs/research/completion-format-prompting.md](../research/completion-format-prompting.md) already references Ollama's documented `/api/chat` and `/api/generate` endpoints.
- Official Ollama docs for the API and streaming behavior: <https://docs.ollama.com/api/usage>, <https://docs.ollama.com/api/streaming>, <https://docs.ollama.com/api/chat>, <https://docs.ollama.com/api/generate>, and <https://docs.ollama.com/api/ps>.

## Working Constraints

1. Ollama does not currently document a first-class local analytics dashboard, historical usage ledger, or Prometheus-style metrics endpoint.
2. Useful per-request fields include `prompt_eval_count`, `eval_count`, `total_duration`, `load_duration`, `prompt_eval_duration`, and `eval_duration`.
3. For streaming endpoints, the authoritative usage and duration fields arrive in the final chunk rather than the earlier partial chunks.
4. `/api/ps` reports loaded model state, not a historical request ledger.
5. Local logs are more useful for troubleshooting than for structured analytics.

## Recommended Decisions

| Topic | Recommendation | Why |
|---|---|---|
| Primary truth source | Capture metrics from the Ollama API response, especially the final streaming chunk | This is the only source in scope that carries request-level token and duration fields. |
| Default storage | Write JSONL first, export CSV only for ad hoc spreadsheet analysis | JSONL handles evolving schemas and streaming-oriented event capture more cleanly. |
| Correlation key | Generate a local `request_id` and store a UTC timestamp for every request | Required to join request metrics with host telemetry later. |
| Prompt retention | Store a prompt hash, length, and optional short preview instead of full prompts by default | Reduces privacy and retention risk while still supporting debugging. |
| Windows telemetry | Treat CPU and RAM samples as supporting context, not as token truth | Process telemetry explains load and contention but cannot replace request-level metrics. |
| Solo Windows default | Start with the PowerShell logger | Lowest complexity and fastest time to usable data. |

## Shared Caveats

1. Ollama does not currently expose a documented built-in analytics dashboard or a first-class metrics endpoint for local usage history.
2. For streaming calls, the authoritative usage fields arrive in the final chunk. If the collector misses that chunk, token and duration metrics will be incomplete.
3. `/api/ps` is useful for loaded-model state and residency checks, but it does not replace per-request capture.
4. CPU and RAM sampling can show pressure, contention, and residency, but process telemetry alone does not tell the truth about prompt tokens, generated tokens, or request boundaries.
5. Any approach that depends on a wrapper or proxy only sees traffic that actually goes through that wrapper or proxy.

## Comparison Table

| Approach | Complexity | Coverage | Token Accuracy | Operational Overhead | Best-Fit Use Case |
|---|---|---|---|---|---|
| PowerShell logger to CSV or JSONL | Low | Only requests sent through the logger wrapper | High if the final chunk is captured correctly | Low | One user, one machine, fast implementation, mostly manual or script-driven local calls |
| Small local Python proxy service | Medium | All clients explicitly pointed at the proxy | High if the proxy transparently relays and logs the final chunk | Medium | Multiple local clients, longer-lived collection, central storage, future reporting |
| Windows monitoring setup with API metrics plus CPU/RAM sampling | Medium to high | Request metrics plus host-level context, but still limited by what is routed and sampled | Medium overall; high for correlated troubleshooting, not for standalone token truth | Medium to high | Performance tuning, saturation analysis, and "why was this request slow?" investigations |

## Recommendation Ranking For A Solo Local Windows Setup

| Rank | Option | Reason |
|---|---|---|
| 1 | PowerShell logger | Smallest moving surface, fastest to implement, easiest to reason about, enough for a single operator using local scripts or repeatable commands. |
| 2 | Python proxy | Better long-term shape if more than one local tool or client should be measured consistently. |
| 3 | Windows telemetry overlay | Useful after one of the first two exists, but not the right first move if the primary question is request or token usage. |

Use the Python proxy as the first choice only if the real requirement is "capture all locally configured clients through one surface" rather than "get visibility quickly on one Windows box."

## Approach 1: PowerShell Logger That Records Ollama Request Metrics To CSV Or JSONL

### What It Captures

This approach captures request-level usage and duration fields returned by Ollama for calls that are sent through a PowerShell wrapper function or script. It is strongest when the operator already uses PowerShell for local workflows or can tolerate routing all local test calls through one script entry point.

### Architecture Sketch In Prose

A PowerShell wrapper becomes the supported local entry point for Ollama requests during the sprint. The wrapper sends the request to `http://localhost:11434/api/chat` or `http://localhost:11434/api/generate`, relays output back to the caller, waits for the final response object when streaming is enabled, extracts the usage fields from that final object, and appends one structured record per request to disk. JSONL is the safer primary format; CSV can be produced as a downstream export.

### Implementation Outline

1. Create a PowerShell function for each supported endpoint or one generic function with an `endpoint` parameter.
2. Generate a `request_id` and `ts_utc` before the call is sent.
3. Use a streaming-capable HTTP client path for `stream=true` requests so the script can see intermediate chunks and still preserve the final chunk.
4. Extract the usage and duration fields only from the complete non-stream response or the final streaming chunk.
5. Append one event per completed request to a JSONL file such as `metrics/ollama-usage.jsonl`.
6. Optionally export a daily CSV summary for spreadsheet review.
7. Rotate files by day or size so long-running local use does not create one large append-only log.

### Concrete Data Fields To Store

| Category | Fields |
|---|---|
| Identity | `request_id`, `ts_utc`, `hostname`, `username`, `caller_name` |
| Request shape | `endpoint`, `stream`, `model`, `message_count`, `prompt_chars`, `prompt_hash`, `options_hash` |
| Ollama metrics | `prompt_eval_count`, `eval_count`, `total_duration`, `load_duration`, `prompt_eval_duration`, `eval_duration` |
| Derived metrics | `wall_clock_ms_local`, `response_tokens_per_second`, `prompt_tokens_per_second`, `total_tokens` |
| Result | `http_status`, `success`, `error_text`, `final_chunk_seen` |

Keep the raw Ollama duration fields exactly as returned. Add normalized millisecond or second values as separate derived columns rather than replacing the originals.

### Pros

- Lowest setup cost on Windows.
- No additional runtime beyond PowerShell and Ollama.
- Easy to store either JSONL or CSV.
- Good fit for ad hoc prompts, local scripts, and controlled experiments.
- Easy to add small rollup scripts later.

### Cons

- Only captures requests that actually pass through the wrapper.
- Third-party tools that call Ollama directly will bypass it.
- Streaming support is slightly more involved than simple `Invoke-RestMethod`.
- File-based storage is fine for one operator, but weak for multi-client aggregation.

### Validation Boundary

This approach can validate that wrapped requests are being logged correctly and that the final streaming chunk is producing the expected token and duration fields. It cannot prove full-machine coverage if some apps still call Ollama directly.

### Likely Follow-Up Tasks

- Add daily rollups by model and endpoint.
- Export a CSV summary for quick spreadsheet inspection.
- Add retention rules or file rotation.
- Add a simple "top models by tokens" report.
- Promote to a proxy if more than one client needs centralized capture.

## Approach 2: Small Local Python Service That Proxies Ollama And Stores Usage Metrics

### What It Captures

This approach captures request metrics for any local client that points to the proxy instead of talking directly to Ollama. It is the cleanest path when multiple local apps, scripts, or tools should share one collection surface and one storage layer.

### Architecture Sketch In Prose

A small Python service listens on a loopback port such as `127.0.0.1:11435`. Local clients send their Ollama-compatible requests to the proxy. The proxy forwards them to Ollama on `127.0.0.1:11434`, relays the response back to the client, and persists one structured usage record per request. For streamed responses, the proxy forwards each chunk immediately but holds enough state to extract metrics from the final chunk before finalizing the record. Storage should start with SQLite or JSONL; SQLite becomes more useful once filtering, joins, or reporting matter.

### Implementation Outline

1. Build a minimal local service with FastAPI or another small Python web framework.
2. Mirror the request paths that need coverage, usually `/api/chat` and `/api/generate`.
3. Use an HTTP client that supports transparent streaming passthrough.
4. Generate a local `request_id`, record request metadata, and forward the request to Ollama.
5. For `stream=true`, relay chunks as they arrive while caching the last complete chunk for metric extraction.
6. Persist a record after completion or error.
7. Add a small read-only endpoint such as `/usage/recent` or `/usage/summary` for local inspection.
8. Bind the proxy to loopback only unless there is a deliberate reason to expose it further.

### Concrete Data Fields To Store

| Category | Fields |
|---|---|
| Identity | `request_id`, `ts_utc`, `client_name`, `remote_addr`, `user_agent` |
| Request shape | `endpoint`, `stream`, `model`, `message_count`, `prompt_chars`, `prompt_hash`, `request_bytes` |
| Ollama metrics | `prompt_eval_count`, `eval_count`, `total_duration`, `load_duration`, `prompt_eval_duration`, `eval_duration` |
| Derived metrics | `proxy_latency_ms`, `response_tokens_per_second`, `prompt_tokens_per_second`, `total_tokens` |
| Result | `http_status`, `success`, `error_text`, `final_chunk_seen`, `response_bytes` |

If client identity matters, add a required local header such as `X-Client-Name` so the proxy can distinguish CLI use from editor integrations or scripts.

### Pros

- Centralizes collection across multiple local clients.
- Easier to extend into reports, summaries, or a local dashboard later.
- SQLite is a better long-term store than many CSV files.
- Transparent enough to preserve existing client behavior if the proxy matches Ollama closely.
- Strongest foundation for future analytics work.

### Cons

- More moving parts than a simple wrapper.
- Every participating client must be pointed at the proxy.
- Compatibility issues can appear if the proxy does not stream or forward headers correctly.
- Another always-on local service must be managed.
- Debugging proxy behavior is a separate operational surface.

### Validation Boundary

This approach can validate complete coverage for every client that has been reconfigured to use the proxy. It does not capture direct calls to Ollama that bypass the proxy, and it is only as accurate as its streaming passthrough and final-chunk handling.

### Likely Follow-Up Tasks

- Package the proxy as a Windows service or a Task Scheduler job.
- Add a local HTML summary or a small chart endpoint.
- Add per-client and per-model rollups.
- Add retention and backup rules for SQLite.
- Add schema migrations if the stored record shape evolves.

## Approach 3: Windows-Only Monitoring Setup That Combines Ollama API Metrics With CPU/RAM Sampling

### What It Captures

This approach captures host-level load context alongside request-level metrics. It is best for performance analysis rather than pure token accounting. The request metrics still need to come from API responses; CPU and RAM samples are the correlation layer that helps explain slowdowns, memory pressure, and model residency.

### Architecture Sketch In Prose

A Windows monitor samples the `ollama.exe` process on a fixed interval and records CPU and RAM usage over time. In parallel, a thin request capture layer records the same API usage fields used by the other two approaches. A join step correlates request records and host samples by `request_id`, timestamp window, model, or all three. The result is a combined timeline that answers questions like "did slow requests line up with model load events, high memory pressure, or overlapping local activity?"

This is not a substitute for request logging. It is an overlay that adds machine-level context to request-level truth.

### Implementation Outline

1. Create a Windows sampler using PowerShell, a small service, or another local collector that records `ollama.exe` process metrics every one or two seconds.
2. Record loaded-model state from `/api/ps` on a slower interval or on detected changes.
3. Capture request-level API metrics through a minimal wrapper or proxy path.
4. Store host samples and request records in a join-friendly format such as SQLite.
5. Correlate request windows with nearby host samples using `request_id`, timestamps, and model name.
6. Produce a local report that shows request latency beside CPU, RAM, and model residency.

### Concrete Data Fields To Store

| Category | Fields |
|---|---|
| Host sample | `sample_ts_utc`, `ollama_pid`, `cpu_percent`, `working_set_mb`, `private_memory_mb`, `commit_mb`, `thread_count`, `handle_count` |
| Model state | `ps_ts_utc`, `loaded_models`, `model_count`, `model_state_hash` |
| Request link | `request_id`, `request_ts_utc`, `endpoint`, `model`, `stream` |
| Ollama metrics | `prompt_eval_count`, `eval_count`, `total_duration`, `load_duration`, `prompt_eval_duration`, `eval_duration` |
| Correlated output | `request_window_cpu_avg`, `request_window_cpu_peak`, `request_window_ram_peak_mb`, `possible_model_reload`, `overlap_request_count` |

If the data store stays file-based instead of SQLite, keep request and host records separate and generate a derived joined file during rollup rather than trying to update rows in place.

### Pros

- Best path for diagnosing performance, memory pressure, and model load effects.
- Shows whether slow requests line up with reloads or local system contention.
- Adds operational context that request metrics alone do not provide.
- Useful for capacity tuning on one Windows machine.

### Cons

- Most complex option to implement correctly.
- Process telemetry is not a substitute for request or token truth.
- Concurrent requests make attribution harder.
- Sampling intervals can miss short spikes or blur exact boundaries.
- Windows-specific and less portable than the first two approaches.

### Validation Boundary

This approach can validate correlations between request timing and machine load. It cannot, by itself, validate true prompt or generation token counts. Those still come from the request-level API metrics. Treat it as a troubleshooting and tuning layer, not as a standalone usage-accounting system.

### Likely Follow-Up Tasks

- Add charts for request latency against CPU and RAM peaks.
- Add a "possible cold load" heuristic when `load_duration` and memory growth align.
- Tune sample intervals for local hardware.
- Add GPU telemetry later if that becomes part of the performance question.
- Fold the joined data into a local summary notebook or dashboard.

## Practical Selection Guidance

Choose the PowerShell logger when all of these are true:

- One person is running the workload.
- Most calls already originate in scripts or a controllable shell.
- The immediate need is "what did this machine ask Ollama to do and how expensive was it?"

Choose the Python proxy when all of these are true:

- More than one local client should be measured consistently.
- A longer-lived local collector is acceptable.
- Central storage and future reporting matter more than minimum setup time.

Choose the Windows telemetry overlay when all of these are true:

- The problem is not only usage volume but also performance behavior.
- CPU and RAM pressure are part of the diagnosis.
- There is already a request-level capture path or there is willingness to build one.

## Sequence

1. Lock the schema first: request identity, Ollama fields, derived metrics, and retention choices.
2. Implement the PowerShell logger first unless the requirement already demands multi-client coverage.
3. Move to the Python proxy when local tool count or reporting needs outgrow script-based logging.
4. Add the Windows telemetry overlay only when performance explanation becomes part of the goal.
5. Keep the raw Ollama response metrics and any normalized derived values side by side so later analysis does not lose the original fields.

## Risks

- Missing the final streaming chunk will undercount or lose the most important metrics.
- Storing full prompts or full responses can create avoidable privacy and retention risk.
- Mixed direct and proxied traffic creates false confidence about coverage.
- `/api/ps` can confirm loaded state but cannot reconstruct historical request usage.
- Host telemetry can be misread as request truth if the note's boundaries are not respected.
- Long-running local collectors need retention and rotation rules early, not after logs grow.

## Near-Term Recommendation

For a solo local Windows setup, implement the PowerShell logger first and make JSONL the system of record. It is the shortest path to real request metrics, it keeps the source of truth aligned with Ollama's response fields, and it avoids building a service before the schema and reporting questions are stable.

Promote the work to the Python proxy when more than one local client needs coverage or when centralized querying matters. Add the Windows telemetry layer only after request capture already exists and the next question is performance explanation rather than basic usage accounting.