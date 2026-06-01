#!/usr/bin/env bash
set -euo pipefail

SOURCE_PATH="${1:-}"
TARGET_PATH="${2:-}"
MODE="${3:-dry-run}"
OVERWRITE="${OVERWRITE:-false}"

if [[ -z "$SOURCE_PATH" || -z "$TARGET_PATH" ]]; then
  echo "Usage: $0 <source-path> <target-path> [dry-run|apply]" >&2
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

if ! command -v tar >/dev/null 2>&1; then
  echo "tar is not available in PATH." >&2
  exit 1
fi

mkdir -p "$TARGET_PATH"

mapfile -d '' dirs < <(find "$SOURCE_PATH" -mindepth 1 -maxdepth 1 -type d -print0)

total=${#dirs[@]}
success=0
failed=0
total_source_bytes=0
total_archive_bytes=0

if (( total == 0 )); then
  echo "No subdirectories found under source path." >&2
fi

for i in "${!dirs[@]}"; do
  dir="${dirs[$i]}"
  name="$(basename "$dir")"
  archive_path="$TARGET_PATH/$name.tar"

  printf '[%d/%d] %s\n' "$((i + 1))" "$total" "$name"

  source_bytes=$(find "$dir" -type f -printf '%s\n' 2>/dev/null | awk '{s+=$1} END {print s+0}')
  total_source_bytes=$((total_source_bytes + source_bytes))

  if [[ -f "$archive_path" && "$OVERWRITE" != "true" ]]; then
    echo "  skip: archive exists (set OVERWRITE=true to replace): $archive_path" >&2
    failed=$((failed + 1))
    continue
  fi

  if [[ "$MODE" == "dry-run" ]]; then
    echo "  dry-run: would archive $dir -> $archive_path"
    success=$((success + 1))
    continue
  fi

  if [[ -f "$archive_path" ]]; then
    rm -f "$archive_path"
  fi

  if tar -C "$SOURCE_PATH" -cf "$archive_path" "$name"; then
    archive_bytes=$(wc -c < "$archive_path")
    total_archive_bytes=$((total_archive_bytes + archive_bytes))
    echo "  ok: source-bytes=$source_bytes archive-bytes=$archive_bytes"
    success=$((success + 1))
  else
    echo "  fail: could not archive $dir" >&2
    failed=$((failed + 1))
  fi

done

echo
echo "Summary"
echo "  Source path: $SOURCE_PATH"
echo "  Target path: $TARGET_PATH"
echo "  Total dirs: $total"
echo "  Success: $success"
echo "  Failed: $failed"
echo "  Total source bytes: $total_source_bytes"
echo "  Total archive bytes: $total_archive_bytes"
echo "  Mode: $MODE"
