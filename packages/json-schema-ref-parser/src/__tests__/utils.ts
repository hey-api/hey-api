import path from 'node:path';

export function getSpecsPath(): string {
  return path.join(import.meta.dirname, '..', '..', '..', '..', 'specs');
}
