import { createClient } from '../../../index';

const compatibilityVersions = [
  { compatibilityVersion: 3 },
  { compatibilityVersion: 4 },
  { compatibilityVersion: 'mini' },
] as const;

describe('additionalProperties', () => {
  it.each(compatibilityVersions)(
    'generates strict objects with Zod $compatibilityVersion',
    async ({ compatibilityVersion }) => {
      const [context] = await createClient({
        dryRun: true,
        input: {
          components: {
            schemas: {
              Foo: {
                additionalProperties: false,
                properties: {
                  foo: {
                    type: 'string',
                  },
                },
                required: ['foo'],
                type: 'object',
              },
            },
          },
          info: {
            title: 'additional-properties-false',
            version: '1.0.0',
          },
          openapi: '3.1.0',
        },
        logs: {
          level: 'silent',
        },
        output: 'output',
        plugins: [
          {
            compatibilityVersion,
            name: 'zod',
          },
        ],
      });

      const zod = context?.gen.render().find((file) => file.path.endsWith('zod.gen.ts'));

      expect(zod?.content).toContain('export const zFoo = z.strictObject({');
    },
  );
});
