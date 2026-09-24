import { deduplicateSchema } from '../schema';
import type { IR } from '../types';

describe('deduplicateSchema', () => {
  const scenarios: ReadonlyArray<{
    description: string;
    detectFormat?: boolean;
    result: IR.SchemaObject;
    schema: IR.SchemaObject;
  }> = [
    {
      description: 'keeps multiple strings if they have different formats',
      result: {
        items: [
          {
            format: 'uuid',
            type: 'string',
          },
          {
            type: 'string',
          },
        ],
        logicalOperator: 'or',
      },
      schema: {
        items: [
          {
            format: 'uuid',
            type: 'string',
          },
          {
            type: 'string',
          },
        ],
        logicalOperator: 'or',
      },
    },
    {
      description:
        'discards duplicate strings if they have different formats and `detectFormat` is `false`',
      detectFormat: false,
      result: {
        format: 'uuid',
        type: 'string',
      },
      schema: {
        items: [
          {
            format: 'uuid',
            type: 'string',
          },
          {
            type: 'string',
          },
        ],
        logicalOperator: 'or',
      },
    },
    {
      description: 'keeps the composition metadata when every member was `unknown`',
      result: {
        description: 'A collection of things.',
      },
      schema: {
        description: 'A collection of things.',
        items: [
          {
            type: 'unknown',
          },
        ],
        logicalOperator: 'and',
      },
    },
    {
      description: 'leaves `unknown` members of a union alone',
      result: {
        items: [
          {
            $ref: '#/components/schemas/things',
          },
          {
            type: 'unknown',
          },
        ],
        logicalOperator: 'or',
      },
      schema: {
        items: [
          {
            $ref: '#/components/schemas/things',
          },
          {
            type: 'unknown',
          },
        ],
        logicalOperator: 'or',
      },
    },
    {
      description: 'keeps `unknown` items of a tuple',
      result: {
        items: [
          {
            type: 'string',
          },
          {
            type: 'unknown',
          },
        ],
        logicalOperator: 'and',
        type: 'tuple',
      },
      schema: {
        items: [
          {
            type: 'string',
          },
          {
            type: 'unknown',
          },
        ],
        logicalOperator: 'and',
        type: 'tuple',
      },
    },
    {
      description: 'drops `unknown` members from an intersection',
      result: {
        $ref: '#/components/schemas/things',
      },
      schema: {
        items: [
          {
            $ref: '#/components/schemas/things',
          },
          {
            description: 'A collection of things.',
            type: 'unknown',
          },
        ],
        logicalOperator: 'and',
      },
    },
  ];

  it.each(scenarios)('$description', ({ detectFormat, result, schema }) => {
    expect(deduplicateSchema({ detectFormat, schema })).toEqual(result);
  });
});
