#!/usr/bin/env bash

# Generate client code for all examples that have openapi-ts script
# This script is used to ensure examples are up-to-date with the latest code

set -e

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "⏳ Generating client code for all examples..."

# Find all examples with openapi-ts script and generate code in parallel
# Concurrency control: adjust this number depending on CI machine resources
CONCURRENCY=${CONCURRENCY:-4}
tmpdir=$(mktemp -d)
# Use a simple space-separated list of pids and per-pid files for metadata
PIDS=""

wait_for_slot() {
  # Wait until number of background jobs is less than CONCURRENCY
  while [ "$(jobs -rp | wc -l)" -ge "$CONCURRENCY" ]; do
    sleep 0.2
  done
}

for dir in "$ROOT_DIR"/examples/*/; do
  package_json="$dir/package.json"
  if [ ! -f "$package_json" ]; then
    continue
  fi

  if ! grep -q "\"openapi-ts\":" "$package_json"; then
    continue
  fi

  example_name=$(basename "$dir")
  echo "📦 Scheduling: $example_name"

  wait_for_slot

  log="$tmpdir/${example_name}.log"
  (
    echo "Generating: $example_name"
    set -e
    cd "$dir"
    echo "-> Running openapi-ts"
    pnpm run openapi-ts

    # Format generated files in this example only to keep the step fast
    if command -v pnpm >/dev/null 2>&1 && pnpm -w -s --version >/dev/null 2>&1; then
      pnpm -s exec oxfmt "src/**/*.{ts,tsx,js,jsx}" || true
      pnpm -s exec oxlint --fix "src/**/*.{ts,tsx,js,jsx}" || true
    else
      if [ -x "node_modules/.bin/oxfmt" ]; then
        ./node_modules/.bin/oxfmt "src/**/*.{ts,tsx,js,jsx}" || true
      fi
      if [ -x "node_modules/.bin/oxlint" ]; then
        ./node_modules/.bin/oxlint --fix "src/**/*.{ts,tsx,js,jsx}" || true
      fi
    fi

    echo "Completed: $example_name"
  ) >"$log" 2>&1 &

  pid=$!
  PIDS="$PIDS $pid"
  printf '%s' "$example_name" >"$tmpdir/$pid.name"
  printf '%s' "$log" >"$tmpdir/$pid.log"
done

failed=0
for pid in $PIDS; do
  if wait "$pid"; then
    name=$(cat "$tmpdir/$pid.name" 2>/dev/null || echo "$pid")
    echo "✅ $name succeeded"
  else
    name=$(cat "$tmpdir/$pid.name" 2>/dev/null || echo "$pid")
    # Read the metadata file which contains the path to the real log
    logpath=$(cat "$tmpdir/$pid.log" 2>/dev/null || echo "")
    if [ -n "$logpath" ] && [ -f "$logpath" ]; then
      echo "❌ $name failed — showing full log ($logpath):"
      echo "---- full log start ----"
      cat "$logpath" || true
      echo "---- full log end ----"
    else
      echo "❌ $name failed — no log found (metadata: $tmpdir/$pid.log)"
    fi
    failed=1
  fi
done

if [ "$failed" -ne 0 ]; then
  echo "One or more examples failed to generate. Logs are in: $tmpdir"
  exit 1
fi

echo "✨ All examples generated successfully!"
