import fs from 'node:fs';
import path from 'node:path';

import { createClient } from '@hey-api/openapi-ts';
import * as z from 'zod';

import { getSpecsPath } from '../../../utils';
import { tmpDir } from './constants';

const versions = ['3.0.x', '3.1.x'] as const;

const cases = [
  {
    description: 'rejects an object below minProperties',
    options: {},
    success: false,
  },
  {
    description: 'accepts an object at the minProperties boundary',
    options: { optionA: true },
    success: true,
  },
  {
    description: 'accepts an object within the property-count range',
    options: { optionA: true, optionB: false },
    success: true,
  },
  {
    description: 'accepts an object at the maxProperties boundary',
    options: { optionA: true, optionB: false, optionC: true },
    success: true,
  },
  {
    description: 'rejects an object above maxProperties',
    options: { optionA: true, optionB: false, optionC: true, optionD: false },
    success: false,
  },
] as const;

type Schema = Pick<z.ZodType, 'safeParse'>;

function loadSchema(generatedPath: string): Schema {
  const generatedCode = fs.readFileSync(generatedPath, 'utf-8');
  const exportMatches = generatedCode.match(/export const (\w+)/g);
  if (!exportMatches) {
    throw new Error(`No exported schemas found in ${generatedPath}`);
  }

  const schemaNames = exportMatches.map((match) => match.replace('export const ', ''));
  const evalCode =
    generatedCode
      .replace(/^import .* from ['"]zod['"];\r?\n?/gm, '')
      .replace(/export const /g, 'exports.') + `\nreturn exports;`;
  const moduleExports: Record<string, unknown> = {};
  const schemaFunction = new Function('z', 'exports', evalCode);
  schemaFunction(z, moduleExports);

  return moduleExports[schemaNames[0]!] as Schema;
}

for (const version of versions) {
  describe(`OpenAPI ${version} minProperties and maxProperties`, () => {
    let schema: Schema;

    beforeAll(async () => {
      const outputDir = path.join(tmpDir, 'runtime', version);
      await createClient({
        input: path.join(getSpecsPath(), version, 'min-properties.yaml'),
        logs: { level: 'silent' },
        output: outputDir,
        plugins: [{ compatibilityVersion: 3, name: 'zod' }],
      });
      schema = loadSchema(path.join(outputDir, 'zod.gen.ts'));
    });

    it.each(cases)('$description', ({ options, success }) => {
      const result = schema.safeParse({ options });
      expect(result.success).toBe(success);
    });
  });
}
