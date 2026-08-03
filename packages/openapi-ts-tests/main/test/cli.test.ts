import path from 'node:path';

import { xSync } from 'tinyexec';

import { getSpecsPath } from '../../utils';

const specs = getSpecsPath();

describe('bin', () => {
  it('openapi-ts works', () => {
    const result = xSync('openapi-ts', [
      '--input',
      path.resolve(specs, '3.1.x', 'full.yaml'),
      '--output',
      path.resolve(import.meta.dirname, '.gen'),
      '--dry-run',
    ]);
    expect(result.exitCode).toBe(0);
  });
});
