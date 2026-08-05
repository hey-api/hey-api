#!/usr/bin/env bash

# Builds a package's dependency graph, then runs vitest against just that
# package's project.
# Usage: ./scripts/turbo-test-scoped.sh <run|watch> [--dry] [vitest flags...] <package-name>

set -euo pipefail

mode="$1"
shift

pkg="${!#}"
raw_flags=()
if [ "$#" -gt 1 ]; then
  raw_flags=("${@:1:$#-1}")
fi

dry=false
flags=()
for arg in "${raw_flags[@]:-}"; do
  [ -z "$arg" ] && continue
  if [ "$arg" = "--dry" ]; then
    dry=true
  else
    flags+=("$arg")
  fi
done

if [ "$dry" = true ]; then
  exec pnpm turbo run build --filter="${pkg}..." --dry=json
fi

pnpm turbo run build --filter="${pkg}..."

if [ "${#flags[@]}" -gt 0 ]; then
  exec pnpm vitest "$mode" "${flags[@]}" --project "$pkg"
else
  exec pnpm vitest "$mode" --project "$pkg"
fi
