import fs from 'node:fs';

import { tmpDir } from './constants';

export function teardown() {
  fs.rmSync(tmpDir, { force: true, recursive: true });
}
