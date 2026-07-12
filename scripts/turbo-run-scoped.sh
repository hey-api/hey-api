#!/usr/bin/env bash

# Runs a turbo task only in packages that define it.
# Usage: ./scripts/turbo-run-scoped.sh <task> [extra turbo flags...]

set -euo pipefail

task="$1"
shift

filters=()
for pkg_json in packages/*/package.json; do
  if node -e "process.exit(require('./${pkg_json}').scripts?.['${task}'] ? 0 : 1)" 2>/dev/null; then
    name=$(node -p "require('./${pkg_json}').name")
    filters+=("--filter=${name}")
  fi
done

if [ ${#filters[@]} -eq 0 ]; then
  echo "No packages define task '${task}'"
  exit 0
fi

exec pnpm turbo run "$task" "${filters[@]}" "$@"
