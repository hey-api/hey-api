import fs from 'node:fs';
import path from 'node:path';

import { createClient } from '@hey-api/openapi-ts';
import * as z from 'zod';
import * as zMini from 'zod/mini';

import { getSpecsPath } from '../../../utils';
import { tmpDir } from './constants';

const versions = ['2.0.x', '3.0.x', '3.1.x'] as const;
const compatibilityVersions = [4, 'mini'] as const;

type PropertyCountCase = {
  description: string;
  message?: string;
  options: unknown;
  success: boolean;
};

const cases: ReadonlyArray<PropertyCountCase> = [
  {
    description: 'rejects a non-object value',
    options: null,
    success: false,
  },
  {
    description: 'rejects an object below minProperties',
    message: 'Expected at least 1 property',
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
    message: 'Expected at most 3 properties',
    options: { optionA: true, optionB: false, optionC: true, optionD: false },
    success: false,
  },
  {
    description: 'counts an unknown property at the minProperties boundary',
    options: { unknown: true },
    success: true,
  },
  {
    description: 'counts unknown properties above maxProperties',
    options: { optionA: true, optionB: false, optionC: true, unknown: false },
    success: false,
  },
];

type Schema = Pick<z.ZodType, 'safeParse'>;

function loadSchema(generatedPath: string, zodModule: object, schemaName?: string): Schema {
  const generatedCode = fs.readFileSync(generatedPath, 'utf-8');
  const exportMatches = generatedCode.match(/export const (\w+)/g);
  if (!exportMatches) {
    throw new Error(`No exported schemas found in ${generatedPath}`);
  }

  const schemaNames = exportMatches.map((match) => match.replace('export const ', ''));
  const evalCode =
    generatedCode
      .replace(/^import .* from ['"]zod(?:\/mini)?['"];\r?\n?/gm, '')
      .replace(/export const (\w+) =/g, 'const $1 = exports.$1 =') + `\nreturn exports;`;
  const moduleExports: Record<string, unknown> = {};
  const schemaFunction = new Function('z', 'exports', evalCode);
  schemaFunction(zodModule, moduleExports);

  return moduleExports[schemaName ?? schemaNames[0]!] as Schema;
}

for (const version of versions) {
  for (const compatibilityVersion of compatibilityVersions) {
    describe(`OpenAPI ${version} minProperties and maxProperties (${compatibilityVersion})`, () => {
      let schema: Schema;
      let discriminatorSchema: Schema | undefined;

      beforeAll(async () => {
        const folder = compatibilityVersion === 'mini' ? 'mini' : 'v4';
        const outputDir = path.join(tmpDir, 'runtime', version, folder);
        await createClient({
          input: path.join(getSpecsPath(), version, 'property-count.yaml'),
          logs: { level: 'silent' },
          output: outputDir,
          plugins: [{ compatibilityVersion, name: 'zod' }],
        });
        const generatedPath = path.join(outputDir, 'zod.gen.ts');
        const zodModule = compatibilityVersion === 'mini' ? zMini : z;
        schema = loadSchema(generatedPath, zodModule);
        if (version === '3.1.x') {
          discriminatorSchema = loadSchema(generatedPath, zodModule, 'zPropertyCountUnion');
        }
      });

      it.each(cases)('$description', ({ message, options, success }) => {
        const result = schema.safeParse({ options });
        expect(result.success).toBe(success);
        if (!result.success && message) {
          expect(result.error.issues[0]?.message).toBe(message);
        }
      });

      it('validates property counts for record-based objects', () => {
        const base = { options: { optionA: true } };
        expect(schema.safeParse({ ...base, recordOptions: {} }).success).toBe(false);
        expect(schema.safeParse({ ...base, recordOptions: { optionA: true } }).success).toBe(true);
        expect(
          schema.safeParse({
            ...base,
            recordOptions: { optionA: true, optionB: false, optionC: true },
          }).success,
        ).toBe(false);
      });

      it('validates property counts for strict objects', () => {
        const base = { options: { optionA: true } };
        expect(schema.safeParse({ ...base, strictOptions: {} }).success).toBe(false);
        expect(schema.safeParse({ ...base, strictOptions: { optionA: true } }).success).toBe(true);
        expect(
          schema.safeParse({
            ...base,
            strictOptions: { optionA: true, optionB: false, unknown: true },
          }).success,
        ).toBe(false);
      });

      if (version === '3.1.x') {
        it('supports constrained schemas as discriminator members', () => {
          expect(discriminatorSchema?.safeParse({ type: 'one' }).success).toBe(true);
          expect(discriminatorSchema?.safeParse({ id: 'one', type: 'one' }).success).toBe(true);
          expect(discriminatorSchema?.safeParse({ id: 'two', type: 'two' }).success).toBe(true);
          expect(
            discriminatorSchema?.safeParse({ extra: 'too-many', id: 'one', type: 'one' }).success,
          ).toBe(false);
          expect(discriminatorSchema?.safeParse({ id: 'unknown', type: 'unknown' }).success).toBe(
            false,
          );
        });
      }
    });
  }
}
