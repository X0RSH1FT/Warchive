#!/usr/bin/env bash
set -euo pipefail

TARGET_PATH="${1:-}"
MODE="${2:-dry-run}"

if [[ -z "$TARGET_PATH" ]]; then
  echo "Usage: $0 <target-path> [dry-run|apply]" >&2
  exit 1
fi

if [[ ! -d "$TARGET_PATH" ]]; then
  echo "Target path is not a directory: $TARGET_PATH" >&2
  exit 1
fi

if [[ "$TARGET_PATH" != *"/tmp"* && "$TARGET_PATH" != *"/cache"* ]]; then
  echo "Refusing cleanup: target does not look like temp or cache path: $TARGET_PATH" >&2
  exit 1
fi

before_bytes=$(du -sb "$TARGET_PATH" | awk '{print $1}')

echo "Target: $TARGET_PATH"
echo "Before bytes: $before_bytes"

if [[ "$MODE" == "apply" ]]; then
  find "$TARGET_PATH" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
  echo "Cleanup applied."
else
  echo "Dry run only. No files removed."
fi

after_bytes=$(du -sb "$TARGET_PATH" | awk '{print $1}')
freed_bytes=$((before_bytes - after_bytes))

echo "After bytes: $after_bytes"
echo "Freed bytes: $freed_bytes"
