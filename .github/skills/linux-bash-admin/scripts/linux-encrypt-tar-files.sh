#!/usr/bin/env bash
set -euo pipefail

SOURCE_PATH="${1:-}"
TARGET_PATH="${2:-}"
MODE="${3:-dry-run}"
OVERWRITE="${OVERWRITE:-false}"
PASSPHRASE="${OPENSSL_PASSPHRASE:-}"

if [[ -z "$SOURCE_PATH" || -z "$TARGET_PATH" ]]; then
  echo "Usage: $0 <source-path> <target-path> [dry-run|apply]" >&2
  echo "Passphrase: set OPENSSL_PASSPHRASE in environment." >&2
  exit 1
fi

if [[ "$MODE" != "dry-run" && "$MODE" != "apply" ]]; then
  echo "Mode must be dry-run or apply." >&2
  exit 1
fi

if [[ ! -d "$SOURCE_PATH" ]]; then
  echo "Source path is not a directory: $SOURCE_PATH" >&2
  exit 1
fi

if ! command -v openssl >/dev/null 2>&1; then
  echo "OpenSSL is not available in PATH." >&2
  exit 1
fi

if [[ -z "$PASSPHRASE" ]]; then
  echo "Set OPENSSL_PASSPHRASE before running." >&2
  exit 1
fi

mkdir -p "$TARGET_PATH"

mapfile -d '' files < <(find "$SOURCE_PATH" -maxdepth 1 -type f -name '*.tar' -print0)

total=${#files[@]}
success=0
failed=0
total_source_bytes=0
total_output_bytes=0

if (( total == 0 )); then
  echo "No .tar files found under source path." >&2
fi

for i in "${!files[@]}"; do
  file="${files[$i]}"
  base="$(basename "$file")"
  output="$TARGET_PATH/$base.enc"

  printf '[%d/%d] %s\n' "$((i + 1))" "$total" "$base"

  source_bytes=$(wc -c < "$file")
  total_source_bytes=$((total_source_bytes + source_bytes))

  if [[ -f "$output" && "$OVERWRITE" != "true" ]]; then
    echo "  skip: output exists (set OVERWRITE=true to replace): $output" >&2
    failed=$((failed + 1))
    continue
  fi

  if [[ "$MODE" == "dry-run" ]]; then
    echo "  dry-run: would encrypt $file -> $output"
    success=$((success + 1))
    continue
  fi

  rm -f "$output"

  if openssl enc -aes-256-cbc -pbkdf2 -salt -in "$file" -out "$output" -pass "pass:$PASSPHRASE"; then
    output_bytes=$(wc -c < "$output")
    total_output_bytes=$((total_output_bytes + output_bytes))
    echo "  ok: source-bytes=$source_bytes output-bytes=$output_bytes"
    success=$((success + 1))
  else
    echo "  fail: could not encrypt $file" >&2
    failed=$((failed + 1))
  fi

done

echo
echo "Summary"
echo "  Source path: $SOURCE_PATH"
echo "  Target path: $TARGET_PATH"
echo "  Total tar files: $total"
echo "  Success: $success"
echo "  Failed: $failed"
echo "  Total source bytes: $total_source_bytes"
echo "  Total output bytes: $total_output_bytes"
echo "  Mode: $MODE"
