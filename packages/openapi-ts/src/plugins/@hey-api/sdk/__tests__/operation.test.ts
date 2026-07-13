import { describe, expect, it } from 'vitest';

import { createClient } from '../../../../index';
import type { UserConfig as SdkUserConfig } from '../types';

// Generates an SDK for a single operation whose parameters are all optional (an optional request
// body, no required parameters) and returns the generated `sdk.gen.ts` content.
async function generateSdk(sdk: SdkUserConfig): Promise<string | undefined> {
  const [context] = await createClient({
    dryRun: true,
    input: {
      info: { title: 'flat-params', version: '1.0.0' },
      openapi: '3.1.0',
      paths: {
        '/things': {
          post: {
            operationId: 'createThing',
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    properties: { name: { type: 'string' } },
                    type: 'object',
                  },
                },
              },
              required: false,
            },
            responses: { 200: { description: 'ok' } },
          },
        },
      },
    },
    logs: { level: 'silent' },
    output: 'out',
    plugins: ['@hey-api/typescript', '@hey-api/client-fetch', sdk],
  });

  return Array.from(context!.gen.render()).find((file) => file.path.includes('sdk'))?.content;
}

describe('sdk flat params', () => {
  // `client: false` makes `options` required. Since `parameters` is emitted before `options`, it
  // must also be required — otherwise a required parameter follows an optional one and TypeScript
  // rejects the signature (TS1016). Callers can still pass `{}`.
  it('requires `parameters` when `options` is required (client: false)', async () => {
    const sdk = await generateSdk({
      client: false,
      name: '@hey-api/sdk',
      paramsStructure: 'flat',
    });

    expect(sdk).toContain('export const createThing');
    expect(sdk).not.toContain('parameters?:');
  });

  // Default case: `options` is optional, so all-optional `parameters` must stay optional — the fix
  // above must not over-require it.
  it('keeps `parameters` optional when `options` is optional', async () => {
    const sdk = await generateSdk({
      name: '@hey-api/sdk',
      paramsStructure: 'flat',
    });

    expect(sdk).toContain('export const createThing');
    expect(sdk).toContain('parameters?:');
  });
});
