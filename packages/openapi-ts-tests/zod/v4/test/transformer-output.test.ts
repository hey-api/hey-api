import { postFoo as postFooMini } from '../__snapshots__/3.1.x/mini/transformer/sdk.gen';
import { postFoo as postFooV3 } from '../__snapshots__/3.1.x/v3/transformer/sdk.gen';
import { postFoo as postFooV4 } from '../__snapshots__/3.1.x/v4/transformer/sdk.gen';
import {
  deleteRecords as deleteCustomRecords,
  getRecords as getCustomRecords,
  getStatus as getCustomStatus,
} from '../__snapshots__/3.1.x/v4/transformer-custom-output/sdk.gen';
import { getRecords } from '../__snapshots__/3.1.x/v4/transformer-output/sdk.gen';
import { getRecords as getValidatedRecords } from '../__snapshots__/3.1.x/v4/validator-output/sdk.gen';

describe('Zod response transformer output', () => {
  it.each([postFooV3, postFooV4, postFooMini])(
    'returns the parsed default with its output type',
    async (postFoo) => {
      const { data } = await postFoo({
        baseUrl: 'https://example.com',
        fetch: async () => Response.json({ id: 'sample' }),
        throwOnError: true,
      });

      expect(data.foo).toBe(0n);
      expectTypeOf(data.foo).toEqualTypeOf<bigint>();
    },
  );

  it.each([
    { kind: 'existing', status: 200 },
    { kind: 'created', status: 201 },
  ])('returns defaults for HTTP $status with their output types', async ({ kind, status }) => {
    const { data } = await getRecords({
      baseUrl: 'https://example.com',
      fetch: async () => Response.json({ extra: true, kind }, { status }),
      throwOnError: true,
    });

    expect(data).toEqual({ items: [], kind, name: 'anonymous' });
    expectTypeOf(data.name).toEqualTypeOf<string>();
    expectTypeOf(data.items).toEqualTypeOf<Array<string>>();
    expectTypeOf(data.kind).toEqualTypeOf<'created' | 'existing'>();
  });

  it('preserves the original response when only validation is enabled', async () => {
    const { data } = await getValidatedRecords({
      baseUrl: 'https://example.com',
      fetch: async () => Response.json({ extra: true, kind: 'existing' }),
      throwOnError: true,
    });

    expect(data).toEqual({ extra: true, kind: 'existing' });
    expectTypeOf(data.name).toEqualTypeOf<string | undefined>();
    expectTypeOf(data.items).toEqualTypeOf<Array<string> | undefined>();
  });

  it('preserves HTTP error data and its optional fields', async () => {
    const { data, error } = await getRecords({
      baseUrl: 'https://example.com',
      fetch: async () => Response.json({ message: 'invalid' }, { status: 400 }),
    });

    expect(data).toBeUndefined();
    expect(error).toEqual({ message: 'invalid' });
    expectTypeOf(error).toEqualTypeOf<{ code?: string; message: string } | undefined>();
  });

  it('uses the custom resolver output rather than the schema output type', async () => {
    const { data } = await getCustomRecords({
      baseUrl: 'https://example.com',
      fetch: async () => Response.json({ kind: 'existing' }),
      throwOnError: true,
    });

    expect(data).toBe(15);
    expectTypeOf(data).toEqualTypeOf<number>();
  });

  it('preserves text responses when a custom transformer returns a different type', async () => {
    const { data } = await getCustomStatus({
      baseUrl: 'https://example.com',
      fetch: async () => new Response('ready', { headers: { 'Content-Type': 'text/plain' } }),
      throwOnError: true,
    });

    expect(data).toBe('ready');
    expectTypeOf(data).toEqualTypeOf<string>();
  });

  it('preserves the empty response behavior and type for HTTP 204', async () => {
    const { data } = await deleteCustomRecords({
      baseUrl: 'https://example.com',
      fetch: async () => new Response(null, { status: 204 }),
      throwOnError: true,
    });

    expect(data).toBeNull();
    expectTypeOf(data).toEqualTypeOf<void>();
  });
});
