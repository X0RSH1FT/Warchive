# Ollama Troubleshooting Reference For Windows Local Setups

**Audience:** maintainers and agents diagnosing local Ollama performance, reliability, and configuration pressure on Windows.

**Scope:** practical troubleshooting for latency, throughput, model load churn, memory pressure, and host contention in local Ollama workflows.

**Last reviewed:** 2026-05-30

## Purpose

Use this page when a user reports symptoms such as:

- slow first response or long idle wake-up times
- low generation throughput (tokens per second)
- intermittent stalls or queueing under concurrent requests
- model unload/reload churn after short idle periods
- suspected CPU, GPU, RAM, or VRAM saturation caused by settings

This document focuses on source-backed troubleshooting and version-aware recommendations. When behavior is unclear or appears to drift, validate against upstream Ollama docs before changing local rules.

## Core Measurements

Ollama responses expose timing and token fields that should drive diagnosis:

| Field | What it represents | Why it matters |
|---|---|---|
| `load_duration` | Time spent loading model weights | High values indicate cold loads or unload/reload churn |
| `prompt_eval_duration` | Prompt processing duration | High values point to prompt/context cost |
| `eval_duration` | Token generation duration | High values indicate throughput bottleneck |
| `prompt_eval_count` | Prompt tokens evaluated | Helps normalize prompt processing cost |
| `eval_count` | Output tokens generated | Required for generation throughput calculations |
| `total_duration` | End-to-end request time | Use as top-level latency measurement |

For non-streaming requests, these fields are present in the response body. For streaming requests, authoritative usage fields arrive in the final `done=true` chunk.

Throughput reference:

$$
\text{tokens/sec} = \frac{\text{eval\_count}}{\text{eval\_duration}} \times 10^9
$$

## Windows-First Diagnostic Sequence

1. Verify local server and model path health.
2. Capture one baseline non-stream request and record timing fields.
3. Inspect loaded model residency and processor placement.
4. Classify dominant latency bucket: load, prompt eval, or generation.
5. Apply one low-risk tuning change and rerun the same probe.
6. Escalate to host-level diagnostics only if bottleneck persists.

### Step 1: Basic Health

```powershell
Invoke-RestMethod http://localhost:11434/api/version
ollama ps
```

### Step 2: Baseline Probe (Non-Streaming)

```powershell
$body = @{
  model = 'llama3.2'
  prompt = 'ping'
  stream = $false
} | ConvertTo-Json

Invoke-RestMethod http://localhost:11434/api/generate -Method Post -ContentType 'application/json' -Body $body
```

Capture: `total_duration`, `load_duration`, `prompt_eval_duration`, `eval_duration`, `prompt_eval_count`, `eval_count`.

### Step 3: Residency And Placement

```powershell
Invoke-RestMethod http://localhost:11434/api/ps
ollama ps
```

Use these to confirm whether models are staying loaded and whether execution is CPU or GPU weighted.

## Symptom-To-Cause Map

| Symptom | First measurement to inspect | Likely causes |
|---|---|---|
| High first response after idle | `load_duration` | model unloading, large model reload overhead, insufficient memory for residency |
| Slow with long prompts | `prompt_eval_duration`, `prompt_eval_count` | high context length, oversized prompt/history |
| Slow generation on short prompts | `eval_duration`, `eval_count` | compute-limited generation, backend/device mismatch, thermal throttle |
| Fast initially then degraded throughput | repeated probes + host telemetry | thermal limits, background contention, memory pressure growth |
| Errors or long waits under bursts | queue depth behavior and request concurrency | parallelism too high for available memory, queue saturation |

## High-Value Tuning Levers

Apply one change at a time.

| Setting | Expected effect | Main risk |
|---|---|---|
| `keep_alive` / `OLLAMA_KEEP_ALIVE` | Reduces cold-load latency by keeping models resident | Pins RAM/VRAM and can starve other workloads |
| `OLLAMA_NUM_PARALLEL` | Increases per-model concurrency | Higher memory usage and possible queueing/OOM |
| `OLLAMA_CONTEXT_LENGTH` or request `num_ctx` | Supports longer context windows | Higher memory and prompt-eval cost |
| `OLLAMA_MAX_LOADED_MODELS` | Allows more models to remain loaded | Eviction churn or memory pressure if set too high |
| `OLLAMA_MAX_QUEUE` | Handles larger bursts before immediate reject | Increased tail latency under sustained overload |
| `OLLAMA_FLASH_ATTENTION` | Can improve memory use and throughput for larger contexts | Compatibility and model-specific behavior differences |
| `OLLAMA_KV_CACHE_TYPE` (`f16`, `q8_0`, `q4_0`) | Reduces KV memory footprint | Possible quality degradation on some tasks/models |
| Device visibility vars (`CUDA_VISIBLE_DEVICES`, `ROCR_VISIBLE_DEVICES`, `GGML_VK_VISIBLE_DEVICES`) | Forces device selection | Misconfiguration can push slower path or fallback |

## Windows Operational Notes

- Ollama logs are typically under `%LOCALAPPDATA%\Ollama`.
- Model and local config files are typically under `%HOMEPATH%\.ollama`.
- Environment variable changes require restarting the Ollama app process to take effect.
- Antivirus real-time scanning can cause measurable disk and CPU interference during model load and cache activity.

## Finding And Viewing Ollama Logs On Windows

Use logs as a first-class troubleshooting input, especially for intermittent stalls, load churn, and backend initialization problems.

### Default Locations

| Path | Typical contents |
|---|---|
| `%LOCALAPPDATA%\Ollama\server.log` | runtime request handling, model load/unload, backend and execution warnings/errors |
| `%LOCALAPPDATA%\Ollama\app.log` | app startup/lifecycle behavior and host integration messages |
| `%LOCALAPPDATA%\Ollama\upgrade.log` | update or migration events and related failures |

### Practical PowerShell Commands

List available files:

```powershell
Get-ChildItem "$env:LOCALAPPDATA\Ollama"
```

Open the folder in Explorer:

```powershell
explorer "$env:LOCALAPPDATA\Ollama"
```

Inspect recent entries:

```powershell
Get-Content "$env:LOCALAPPDATA\Ollama\server.log" -Tail 200
Get-Content "$env:LOCALAPPDATA\Ollama\app.log" -Tail 200
Get-Content "$env:LOCALAPPDATA\Ollama\upgrade.log" -Tail 200
```

Live-tail during a repro run:

```powershell
Get-Content "$env:LOCALAPPDATA\Ollama\server.log" -Wait
```

### When To Check Which Log

| Scenario | First log to inspect | What to look for |
|---|---|---|
| Slow first response after idle | `server.log` | repeated model unload/load cycles, load warnings, backend handoff delays |
| Sudden errors after updating Ollama | `upgrade.log`, then `app.log` | migration/update failures and startup side effects |
| Service starts but performance is inconsistent | `app.log`, then `server.log` | startup anomalies, backend fallback hints, recurrent warnings around execution |
| Bursty workload stalls or request failures | `server.log` | queueing indicators, load timeout messages, memory-pressure-related warnings |

## Escalation Checks

Use when baseline tuning did not resolve the issue:

1. Enable debug logging (`OLLAMA_DEBUG=1`) and capture server logs.
2. Correlate repeated probes with host telemetry (CPU, memory, GPU utilization, thermals).
3. Check for repeated unload/reload patterns indicating residency churn.
4. Re-test with reduced context length and lower parallelism to confirm pressure sensitivity.

## Version-Sensitive Caveats

- Some defaults are version-dependent, especially around context-length behavior and backend support.
- GPU backend behavior and platform notes can shift with driver and runtime updates.
- If local observations disagree with this document, treat this page as stale and run a targeted upstream fact check.

## Sources

- Ollama API and usage fields: <https://raw.githubusercontent.com/ollama/ollama/main/docs/api.md>
- Ollama usage docs: <https://raw.githubusercontent.com/ollama/ollama/main/docs/api/usage.mdx>
- Ollama streaming behavior: <https://raw.githubusercontent.com/ollama/ollama/main/docs/api/streaming.mdx>
- Ollama FAQ and performance/concurrency notes: <https://raw.githubusercontent.com/ollama/ollama/main/docs/faq.mdx>
- Ollama troubleshooting: <https://raw.githubusercontent.com/ollama/ollama/main/docs/troubleshooting.mdx>
- Ollama Windows notes: <https://raw.githubusercontent.com/ollama/ollama/main/docs/windows.mdx>
- Ollama GPU notes: <https://raw.githubusercontent.com/ollama/ollama/main/docs/gpu.mdx>
- Environment config keys: <https://raw.githubusercontent.com/ollama/ollama/main/envconfig/config.go>
- Microsoft Defender performance troubleshooting: <https://learn.microsoft.com/en-us/defender-endpoint/troubleshoot-performance-issues>
- NVIDIA SMI reference: <https://docs.nvidia.com/deploy/nvidia-smi/index.html>