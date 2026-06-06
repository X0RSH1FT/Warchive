# Ollama Top Models — Research Reference

**Research Date:** June 6, 2026
**Sources:** ollama.com/library (sorted by popularity), individual model pages

## Top Models by Popularity (All-Time Pulls)

| Rank | Model | Pulls | Sizes Available |
|------|-------|-------|-----------------|
| 1 | llama3.1 | 115.5M | 8B, 70B, 405B |
| 2 | deepseek-r1 | 87.0M | 1.5B, 7B, 8B, 14B, 32B, 70B, 671B |
| 3 | nomic-embed-text | 73.2M | 137M (embedding) |
| 4 | llama3.2 | 71.7M | 1B, 3B |
| 5 | gemma3 | 37.5M | 270M, 1B, 4B, 12B, 27B |
| 6 | qwen2.5 | 32.0M | 0.5B, 1.5B, 3B, 7B, 14B, 32B, 72B |
| 7 | qwen3 | 30.4M | 0.6B, 1.7B, 4B, 8B, 14B, 30B, 32B, 235B |
| 8 | mistral | 29.9M | 7B |
| 9 | gemma2 | 24.8M | 2B, 9B, 27B |
| 10 | llama3 | 24.2M | 8B, 70B |
| 11 | phi3 | 17.6M | 3.8B, 14B |
| 12 | qwen2.5-coder | 16.4M | 0.5B, 1.5B, 3B, 7B, 14B, 32B |
| 13 | llava | 14.1M | 7B, 13B, 34B |
| 14 | qwen3.5 | 13.1M | 0.8B, 2B, 4B, 9B, 27B, 35B, 122B |
| 15 | gemma4 | 12.2M | e2B, e4B, 12B, 26B, 31B |
| 16 | mxbai-embed-large | 11.3M | 335M (embedding) |
| 17 | phi4 | 7.5M | 14B |
| 18 | codellama | 5.6M | 7B, 13B, 34B, 70B |
| 19 | tinyllama | 5.0M | 1.1B |
| 20 | mistral-nemo | 4.8M | 12B |

---

## General Purpose / Chat Models

### Llama 3.1 — Best general-purpose default
- **Pull:** `ollama pull llama3.1` (defaults to 8B)
- **Tags:** `:8b` (4.9GB), `:70b` (43GB), `:405b` (243GB)
- **Context:** 128K, tool-use capable
- **Best for:** Universal safe default. 8B runs on 6GB VRAM.
- **Source:** https://ollama.com/library/llama3.1

### Llama 3.2 — Small / edge
- **Pull:** `ollama pull llama3.2` (defaults to 3B)
- **Tags:** `:1b` (1.3GB), `:3b` (2.0GB)
- **Context:** 128K
- **Best for:** On-device, edge, mobile, lightweight chat.
- **Source:** https://ollama.com/library/llama3.2

### Llama 3.3 — Best 70B-class general model
- **Pull:** `ollama pull llama3.3` (70B, 43GB)
- **Context:** 128K, tool-use capable
- **Best for:** Approaches Llama 3.1 405B quality at 70B size. Needs ~40GB VRAM.
- **Source:** https://ollama.com/library/llama3.3

### Llama 4 — Frontier MoE multimodal
- **Pull:** `ollama pull llama4`
- **Variants:** `:scout` (109B total, 17B active, 67GB, 10M context), `:maverick` (400B total, 17B active, 245GB, 1M context)
- **Best for:** Frontier multimodal when VRAM is abundant.
- **Source:** https://ollama.com/library/llama4

### Qwen 2.5 — Best multilingual general model
- **Pull:** `ollama pull qwen2.5` (defaults to 7B)
- **Tags:** `:0.5b` (398MB), `:1.5b` (986MB), `:3b` (1.9GB), `:7b` (4.7GB), `:14b` (9.0GB), `:32b` (20GB), `:72b` (43GB)
- **Context:** Up to 128K
- **Best for:** Strong multilingual (CN, JP, KR) + reasoning. Best value at 32B.
- **Source:** https://ollama.com/library/qwen2.5

### Qwen 3 — Latest generation
- **Pull:** `ollama pull qwen3` (defaults to 8B)
- **Tags:** `:0.6b`, `:1.7b`, `:4b`, `:8b`, `:14b`, `:30b`, `:32b`, `:235b` (MoE, 22B active)
- **Feature:** Thinking mode (mixed reasoning).
- **Source:** https://ollama.com/library/qwen3

### Gemma 3 — Multilingual + vision capable
- **Pull:** `ollama pull gemma3` (defaults to 4B)
- **Tags:** `:270m` (292MB), `:1b` (815MB), `:4b` (3.3GB, vision), `:12b` (8.1GB, vision), `:27b` (17GB, vision)
- **Context:** 128K on 4B+
- **Best for:** 140+ language coverage; vision on 4B+. Needs Ollama 0.6+.
- **Source:** https://ollama.com/library/gemma3

### Gemma 4 — Native function calling
- **Pull:** `ollama pull gemma4`
- **Tags:** e2B, e4B, 12B, 26B (MoE, 4B active), 31B
- **Best for:** Native function calling, JSON output, tool use. Apache 2.0 license.
- **Source:** https://ollama.com/library/gemma4

### Mistral — Classic 7B
- **Pull:** `ollama pull mistral` (7B, 4.1GB, 32K context)
- **Best for:** Apache 2.0 license requirement, legacy compatibility.
- **Source:** https://ollama.com/library/mistral

### Mistral Nemo — Upgraded 7B-class
- **Pull:** `ollama pull mistral-nemo` (12B, 7.1GB, 128K context, tool-use)
- **Best for:** Upgrade from Mistral 7B; multilingual.
- **Source:** https://ollama.com/library/mistral-nemo

### Phi-4 — STEM reasoning
- **Pull:** `ollama pull phi4` (14B, 9.1GB, 16K context)
- **Best for:** Dense knowledge/param ratio, strong STEM reasoning. Avoid for tool-use agents.
- **Source:** https://ollama.com/library/phi4

---

## Coding-Specialized Models

### Qwen 2.5 Coder — Local coding king
- **Pull:** `ollama pull qwen2.5-coder` (defaults to 7B)
- **Tags:** `:0.5b` (398MB), `:1.5b` (986MB), `:3b` (1.9GB), `:7b` (4.7GB, 32K ctx), `:14b` (9.0GB), `:32b` (20GB)
- **Best for:** Default local coding choice. 32B approaches GPT-4o on Aider.
- **Source:** https://ollama.com/library/qwen2.5-coder

### Qwen 3 Coder — Agentic coding
- **Pull:** `ollama pull qwen3-coder` (defaults to 30B MoE)
- **Tags:** `:30b` (19GB, 3.3B active), `:480b` (290GB), `:480b-cloud`
- **Context:** 256K
- **Best for:** RL-trained on SWE-Bench, native tool calling.
- **Source:** https://ollama.com/library/qwen3-coder

### DeepSeek Coder V2 — Budget GPU coding
- **Pull:** `ollama pull deepseek-coder-v2` (defaults to 16B)
- **Tags:** `:16b` (8.9GB, MoE, 160K ctx), `:236b` (133GB)
- **Best for:** Coding on budget GPUs (10-12GB VRAM). Good for long-file refactoring.
- **Source:** https://ollama.com/library/deepseek-coder-v2

### CodeLlama — Legacy workhorse
- **Pull:** `ollama pull codellama` (defaults to 7B)
- **Tags:** `:7b`, `:13b`, `:34b`, `:70b`
- **Best for:** Legacy projects. Superseded by Qwen 2.5 Coder.
- **Source:** https://ollama.com/library/codellama

---

## Math / Reasoning Models

### DeepSeek R1 — Local reasoning king
- **Pull:** `ollama pull deepseek-r1` (defaults to 8B — DeepSeek-R1-0528)
- **Tags:** `:1.5b` (1.1GB), `:7b` (4.7GB), `:8b` (5.2GB), `:14b` (9.0GB), `:32b` (20GB), `:70b` (43GB), `:671b` (404GB, 160K ctx)
- **Best for:** Chain-of-thought reasoning, math, logic, multi-step planning. MIT license.
- **Source:** https://ollama.com/library/deepseek-r1

---

## Embedding Models

| Model | Pull Command | Size | Dimensions | Context | Best For |
|-------|-------------|------|-----------|---------|----------|
| Nomic Embed Text | `ollama pull nomic-embed-text` | 274MB | 768 | 2K | Default RAG embedding |
| MXBAI Embed Large | `ollama pull mxbai-embed-large` | 670MB | 1024 | 512 | Higher recall, English-focused |
| BGE-M3 | `ollama pull bge-m3` | 1.2GB | 1024 | 8K | Multilingual + long-doc RAG |

Sources: https://ollama.com/library/nomic-embed-text, https://ollama.com/library/mxbai-embed-large, https://ollama.com/library/bge-m3

---

## Vision / Multimodal Models

### Llama 3.2 Vision — Strongest open-source VLM
- **Pull:** `ollama pull llama3.2-vision` (defaults to 11B, 7.8GB)
- **Tags:** `:11b` (7.8GB, 128K ctx), `:90b` (55GB, 128K ctx)
- **Best for:** Image understanding, OCR, charts, screenshot analysis. Tool-use capable.
- **Source:** https://ollama.com/library/llama3.2-vision

### Gemma 3 (multimodal variants)
- 4B+, 12B, 27B versions support vision input
- **Best for:** Document/chart OCR.
- **Source:** https://ollama.com/library/gemma3

---

## Small / Fast Models (Limited Hardware)

| Model | Pull Command | Size | VRAM | Best For |
|-------|-------------|------|------|----------|
| TinyLlama | `ollama pull tinyllama` | 1.1B (638MB) | ~1GB | Ultra-low resource |
| Llama 3.2 1B | `ollama pull llama3.2:1b` | 1.3GB | ~1GB | On-device, mobile |
| Llama 3.2 3B | `ollama pull llama3.2:3b` | 2.0GB | ~2GB | Entry-level chat |
| Gemma 3 270M | `ollama pull gemma3:270m` | 292MB | ~512MB | Runs on anything |
| Qwen 2.5 0.5B | `ollama pull qwen2.5:0.5b` | 398MB | ~512MB | Ultra-lightweight |
| Phi-4 Mini | `ollama pull phi4-mini` | ~3GB | ~3GB | Best small STEM model |

---

## DeepSeek V4 Availability on Ollama

### Is there a `deepseek-v4` on Ollama?

No bare `deepseek-v4` model exists. The V4 series is available under two names:

| Model | Pull Command | Architecture | Context | Status |
|-------|-------------|-------------|---------|--------|
| **DeepSeek V4 Flash** | `ollama pull deepseek-v4-flash:cloud` | 284B total, 13B active, MoE | 1M tokens | ☁️ **Cloud-only** |
| **DeepSeek V4 Pro** | `ollama pull deepseek-v4-pro:cloud` | 1.6T total, 49B active, MoE | 1M tokens | ☁️ **Cloud-only** |

**Key detail:** Both use the `:cloud` tag. Inference runs on Ollama Cloud servers, not locally. Requires Ollama Cloud account (free tier available with limits). Weights are available on HuggingFace (`deepseek-ai/DeepSeek-V4-Flash`, `deepseek-ai/DeepSeek-V4-Pro`) for self-hosting, but V4 Pro requires multi-GPU server hardware.

### All DeepSeek Models on Ollama

| Library Name | Pull Command | Size | Type | Local? |
|-------------|-------------|------|------|--------|
| deepseek-r1 | `ollama pull deepseek-r1` | 1.5B–671B | Reasoning / distilled | ✅ Yes |
| deepseek-v3 | `ollama pull deepseek-v3` | 671B (404GB) | MoE base | ✅ Yes |
| deepseek-v3.1 | `ollama pull deepseek-v3.1` | 671B | MoE v3.1 | ✅ Yes |
| deepseek-v3.2 | `ollama pull deepseek-v3.2` | 671B | MoE v3.2 | ☁️ Cloud |
| deepseek-v4-flash | `ollama pull deepseek-v4-flash:cloud` | 284B (13B active) | MoE V4 | ☁️ Cloud only |
| deepseek-v4-pro | `ollama pull deepseek-v4-pro:cloud` | 1.6T (49B active) | MoE V4 flagship | ☁️ Cloud only |
| deepseek-coder | `ollama pull deepseek-coder` | 1.3B, 6.7B, 33B | Coding | ✅ Yes |
| deepseek-coder-v2 | `ollama pull deepseek-coder-v2` | 16B, 236B | Coding MoE | ✅ Yes |
| deepseek-llm | `ollama pull deepseek-llm` | 7B, 67B | Base LLM | ✅ Yes |
| deepseek-v2 | `ollama pull deepseek-v2` | 16B, 236B | MoE v2 | ✅ Yes |
| deepseek-ocr | `ollama pull deepseek-ocr` | multimodal | OCR | ✅ Yes |

### If You Want V4-Level Quality Locally

These are the closest local alternatives, ordered by capability:

1. **DeepSeek R1 32B** — `ollama pull deepseek-r1:32b` (20GB, best for 24GB GPU)
2. **DeepSeek R1 70B** — `ollama pull deepseek-r1:70b` (43GB, needs 48GB+)
3. **DeepSeek V3** — `ollama pull deepseek-v3` (404GB, full MoE, needs multi-GPU)
4. **DeepSeek Coder V2 16B** — `ollama pull deepseek-coder-v2` (8.9GB, budget GPU coding)

### Sources
- deepseek-v4-flash: https://ollama.com/library/deepseek-v4-flash
- deepseek-v4-pro: https://ollama.com/library/deepseek-v4-pro
- deepseek-r1: https://ollama.com/library/deepseek-r1
- deepseek-coder-v2: https://ollama.com/library/deepseek-coder-v2

---

## VRAM-Based Quick Picks

| VRAM | Best Coding | Best General | Best Reasoning |
|------|------------|-------------|----------------|
| 8GB | qwen2.5-coder:7b | llama3.1:8b | deepseek-r1:7b |
| 12GB | deepseek-coder-v2:16b | gemma3:12b | deepseek-r1:14b |
| 16GB | qwen2.5-coder:14b | gemma4 (26B MoE) | deepseek-r1:14b |
| 24GB | qwen2.5-coder:32b | qwen3:32b | deepseek-r1:32b |
| 48GB+ | qwen3-coder:480b (quantized) | llama3.3:70b | deepseek-r1:70b |
| Any (cloud) | deepseek-v4-flash:cloud | deepseek-v4-pro:cloud | deepseek-v4-flash:cloud |
