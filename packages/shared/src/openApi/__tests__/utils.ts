import fs from 'node:fs';
import path from 'node:path';

import { load } from 'js-yaml';

export function getSpecsPath(): string {
  return path.join(import.meta.dirname, '..', '..', '..', '..', '..', 'specs');
}

export function specFileToJson(file: string) {
  const raw = fs.readFileSync(file, 'utf8');
  const ext = path.extname(file).toLowerCase();
  return ext === '.json' ? JSON.parse(raw) : load(raw);
}
