#!/usr/bin/env node

// Computes a PEP 440-compliant dev release version for PyPI snapshot
// publishes. Combines the base major.minor.patch from the currently
// committed package.json (the last stable release) with a timestamp
// shared across the npm and PyPI snapshot jobs, so a given snapshot
// can be correlated across both registries by its version string
// (e.g. npm `0.0.0-next-20260702002834` <-> PyPI `0.5.2.dev20260702002834`).
//
// The timestamp is computed once in the `release` job and passed in
// via HEY_API_SNAPSHOT_TIMESTAMP rather than generated here, since two
// independent Date.now() calls in separate CI jobs would drift.

import pkg from '../packages/openapi-python/package.json' with { type: 'json' };

const timestamp = process.env.HEY_API_SNAPSHOT_TIMESTAMP;
if (!timestamp) {
  throw new Error('HEY_API_SNAPSHOT_TIMESTAMP is not set');
}

const match = pkg.version.match(/^(\d+\.\d+\.\d+)/);
if (!match) {
  throw new Error(`Cannot parse base version from "${pkg.version}"`);
}
const [, base] = match;

process.stdout.write(`${base}.dev${timestamp}\n`);
