import { createClient } from '@hey-api/openapi-ts';
import { describe, expect, it } from 'vitest';

describe('x-enum-varnames JSDoc', () => {
  it('does not emit redundant per-member JSDoc comments from x-enum-varnames', async () => {
    const results = await createClient({
      dryRun: false,
      input: {
        components: {
          schemas: {
            VerificationActivityKind: {
              description: ' * `10` - Primary verification\n * `20` - Delayed verification',
              enum: [10, 20],
              type: 'integer',
              'x-enum-varnames': ['BASE', 'DELAYED'],
            },
          },
        },
        info: { title: 'Enum reproduction', version: '1.0.0' },
        openapi: '3.0.3',
        paths: {},
      },
      logs: { level: 'silent' },
      output: 'output',
      plugins: [
        {
          enums: 'typescript',
          name: '@hey-api/typescript',
        },
      ],
    });

    // createClient returns an array of results (one per output).
    const out = results[0];

    // Generated files are exposed in `files`.
    const enumFile = out.files.find((f: { path: string }) =>
      f.path.endsWith('VerificationActivityKindEnum.ts'),
    );

    expect(enumFile).toBeTruthy();
    const source = enumFile!.content;

    // Ensure schema description is preserved.
    expect(source).toContain('`10` - Primary verification');
    expect(source).toContain('`20` - Delayed verification');

    // Ensure per-member JSDoc is not emitted from x-enum-varnames.
    // The enum members should be: BASE = 10, DELAYED = 20 without /** ... */ wrapping each.
    expect(source).toContain('BASE = 10');
    expect(source).toContain('DELAYED = 20');

    // There should be no member-level JSDoc (just the top-level enum JSDoc).
    const memberJSDocPattern = /\/\*\*[\s\S]*?\*\/\s*\n\s*(BASE|DELAYED)\s*=/;
    expect(source).not.toMatch(memberJSDocPattern);
  });
});
