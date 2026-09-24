import type { OpenAPIV3_1 } from '@hey-api/spec-types';

import type { Context } from '../../../../ir/context';
import { schemaToIrSchema } from '../schema';

describe('schemaToIrSchema', () => {
  const context = {} as unknown as Context;

  const things: OpenAPIV3_1.SchemaObject = {
    properties: {
      totalCount: {
        type: 'integer',
      },
    },
    type: 'object',
  };

  it('lifts the annotations of an annotation-only allOf member', () => {
    const irSchema = schemaToIrSchema({
      context,
      schema: {
        allOf: [things, { description: 'member', title: 'Member' }],
      },
      state: undefined,
    });

    expect(irSchema.description).toBe('member');
    expect(irSchema.title).toBe('Member');
  });

  it('keeps the composition annotations over the member ones', () => {
    const irSchema = schemaToIrSchema({
      context,
      schema: {
        allOf: [things, { description: 'member', title: 'Member' }],
        description: 'composition',
      },
      state: undefined,
    });

    expect(irSchema.description).toBe('composition');
    expect(irSchema.title).toBe('Member');
  });
});
