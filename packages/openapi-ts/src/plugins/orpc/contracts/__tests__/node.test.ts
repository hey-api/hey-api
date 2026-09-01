import { createClient } from '../../../../index';

const input = {
  components: {
    schemas: {
      InvalidRequest: {
        properties: { reason: { type: 'string' } },
        required: ['reason'],
        type: 'object',
      },
      PaymentRequired: {
        properties: { balance: { type: 'number' } },
        required: ['balance'],
        type: 'object',
      },
    },
  },
  info: { title: 'error responses', version: '1.0.0' },
  openapi: '3.1.0',
  paths: {
    '/items': {
      get: {
        operationId: 'listItems',
        responses: {
          200: { description: 'Success' },
          400: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/InvalidRequest' },
              },
            },
            description: 'Invalid request',
          },
          402: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaymentRequired' },
              },
            },
            description: 'Payment required',
          },
          default: { description: 'Unexpected error' },
        },
      },
    },
  },
} as const;

describe('oRPC error responses', () => {
  it.each([
    { compatibilityVersion: '1', hasPaymentRequired: false },
    { compatibilityVersion: '2', hasPaymentRequired: true },
  ] as const)(
    'generates supported errors for compatibility version $compatibilityVersion',
    async ({ compatibilityVersion, hasPaymentRequired }) => {
      const [context] = await createClient({
        dryRun: true,
        input,
        logs: { level: 'silent' },
        output: 'out',
        plugins: [{ name: 'zod' }, { compatibilityVersion, name: 'orpc' }],
      });
      const output = context!.gen
        .render()
        .map((file) => file.content)
        .join('\n');

      expect(output).toContain(
        "BAD_REQUEST: { data: zInvalidRequest, message: 'Invalid request' }",
      );
      expect(output.includes('PAYMENT_REQUIRED')).toBe(hasPaymentRequired);
      expect(output).not.toContain('Unexpected error');
    },
  );
});
