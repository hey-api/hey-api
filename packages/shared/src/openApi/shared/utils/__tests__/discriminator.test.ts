import type { IR } from '../../../../ir/types';
import { buildDiscriminatedUnion } from '../discriminator';

describe('buildDiscriminatedUnion', () => {
  const discriminatorKey = 'type';
  const ref = '#/components/schemas/Member';

  const scenarios: Array<{
    discriminatorProp: IR.SchemaObject | undefined;
    name: string;
    needsExtend: boolean;
    required?: Array<string>;
  }> = [
    {
      discriminatorProp: undefined,
      name: 'no discriminator property',
      needsExtend: true,
    },
    {
      discriminatorProp: { const: 'foo', type: 'string' },
      name: 'const in required, no default',
      needsExtend: false,
      required: ['type'],
    },
    {
      discriminatorProp: {
        const: 'foo',
        default: 'foo',
        type: 'string',
      },
      name: 'const and default, not in required',
      needsExtend: true,
    },
    {
      discriminatorProp: { const: 'foo', type: 'string' },
      name: 'const not in required, no default',
      needsExtend: true,
    },
  ];

  it.each(scenarios)(
    '$name -> needsExtend=$needsExtend',
    ({ discriminatorProp, needsExtend, required }) => {
      const memberSchema: IR.SchemaObject = {
        properties: discriminatorProp ? { [discriminatorKey]: discriminatorProp } : {},
        required,
        type: 'object',
      };

      const parentSchema: IR.SchemaObject = {
        discriminator: {
          mapping: { foo: ref },
          propertyName: discriminatorKey,
        },
      };

      const result = buildDiscriminatedUnion({
        parentSchema,
        resolveIrRef: (resolvedRef) => (resolvedRef === ref ? memberSchema : undefined),
        schemas: [{ $ref: ref }],
      });

      expect(result).not.toBeNull();
      expect(result!.members).toHaveLength(1);
      expect(result!.members[0]!.needsExtend).toBe(needsExtend);
    },
  );
});
