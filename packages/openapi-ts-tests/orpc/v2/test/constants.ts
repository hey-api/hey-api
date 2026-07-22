import path from 'node:path';

export const snapshotsDir = path.join(import.meta.dirname, '..', '__snapshots__');
export const tmpDir = path.join(import.meta.dirname, '..', '.tmp');
