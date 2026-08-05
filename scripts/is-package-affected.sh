#!/usr/bin/env bash

# Determines whether <package-name> or anything in its dependency graph changed
# since <git-ref>, using turbo's dependency graph. Emits `affected=true|false`
# to $GITHUB_OUTPUT.
# Usage: is-package-affected.sh <package-name> <git-ref>

set -euo pipefail

PACKAGE_NAME="$1"
GIT_REF="$2"

AFFECTED_PACKAGES=$(pnpm turbo run build --filter="...[${GIT_REF}]" --dry=json | jq -r '.packages[]')

if echo "$AFFECTED_PACKAGES" | grep -Fxq "$PACKAGE_NAME"; then
  echo "affected=true" >> "$GITHUB_OUTPUT"
  echo "${PACKAGE_NAME} is affected"
else
  echo "affected=false" >> "$GITHUB_OUTPUT"
  echo "${PACKAGE_NAME} is not affected — skipping"
fi
