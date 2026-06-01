#!/usr/bin/env bash
set -euo pipefail

TARGET_PATH="${1:-}"
TOP="${2:-20}"

if [[ -z "$TARGET_PATH" ]]; then
  echo "Usage: $0 <target-path> [top-n]" >&2
  exit 1
fi

if [[ ! -e "$TARGET_PATH" ]]; then
  echo "Target path not found: $TARGET_PATH" >&2
  exit 1
fi

echo "Target: $TARGET_PATH"
echo "Filesystem usage:"
df -h "$TARGET_PATH"

echo
echo "Top ${TOP} files by size under target:"
find "$TARGET_PATH" -type f -print0 | xargs -0 du -b 2>/dev/null | sort -nr | head -n "$TOP"
