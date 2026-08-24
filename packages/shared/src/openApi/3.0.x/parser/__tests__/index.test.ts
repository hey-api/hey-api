import { Logger } from '@hey-api/codegen-core';
import type { OpenAPIV3 } from '@hey-api/spec-types';

import { Context } from '../../../../ir/context';
import { parseV3_0_X } from '../index';

type CompositionKeyword = 'anyOf' | 'oneOf';

function createContext(spec: OpenAPIV3.Document) {
  return new Context({
    config: {
      input: [],
      logs: {},
      // @ts-expect-error
      output: {
        case: undefined,
        entryFile: false,
        path: '',
      },
      // @ts-expect-error - partial config for testing
      parser: {
        pagination: { keywords: [] },
        transforms: {
          enums: { case: 'PascalCase', enabled: false, mode: 'root', name: '{{name}}Enum' },
          propertiesRequiredByDefault: false,
          readWrite: {
            enabled: false,
            requests: { case: 'preserve', name: '{{name}}Writable' },
            responses: { case: 'preserve', name: '{{name}}' },
          },
        },
      },
      pluginOrder: [],
      plugins: {},
    },
    dependencies: {},
    logger: new Logger(),
    spec,
  });
}

function createDiscriminatorCompositionSpec({
  compositionKeyword,
  mapping,
}: {
  compositionKeyword: CompositionKeyword;
  mapping?: OpenAPIV3.DiscriminatorObject['mapping'];
}): OpenAPIV3.Document {
  const mockItem = {
    [compositionKeyword]: [
      {
        $ref: '#/components/schemas/FooItem',
      },
      {
        $ref: '#/components/schemas/BarItem',
      },
    ],
    discriminator: {
      ...(mapping && { mapping }),
      propertyName: 'kind',
    },
    properties: {
      id: {
        type: 'string',
      },
      kind: {
        type: 'string',
      },
    },
    required: ['kind', 'id'],
    type: 'object',
  } as OpenAPIV3.SchemaObject;

  return {
    components: {
      schemas: {
        BarItem: {
          properties: {
            barValue: {
              format: 'int32',
              type: 'integer',
            },
          },
          required: ['barValue'],
          type: 'object',
        },
        FooItem: {
          properties: {
            fooValue: {
              type: 'string',
            },
          },
          required: ['fooValue'],
          type: 'object',
        },
        MockItem: mockItem,
      },
    },
    info: { title: 'Test', version: '1' },
    openapi: '3.0.3',
    paths: {},
  };
}

describe('parseV3_0_X', () => {
  it('encodes $ref for schema name containing /', () => {
    const spec: OpenAPIV3.Document = {
      components: {
        schemas: {
          'node/type': {
            properties: {
              id: { type: 'string' },
            },
            type: 'object',
          },
        },
      },
      info: { title: 'Test', version: '1' },
      openapi: '3.0.3',
      paths: {},
    };
    const context = createContext(spec);
    parseV3_0_X(context);
    expect(context.ir.components?.schemas?.['node/type']).toBeDefined();
  });

  it('encodes $ref for schema name containing ~', () => {
    const spec: OpenAPIV3.Document = {
      components: {
        schemas: {
          'type~special': {
            properties: {
              id: { type: 'string' },
            },
            type: 'object',
          },
        },
      },
      info: { title: 'Test', version: '1' },
      openapi: '3.0.3',
      paths: {},
    };
    const context = createContext(spec);
    parseV3_0_X(context);
    expect(context.ir.components?.schemas?.['type~special']).toBeDefined();
  });

  it('encodes $ref for schema name containing / and ~', () => {
    const spec: OpenAPIV3.Document = {
      components: {
        schemas: {
          'node/type~special': {
            properties: {
              id: { type: 'string' },
            },
            type: 'object',
          },
        },
      },
      info: { title: 'Test', version: '1' },
      openapi: '3.0.3',
      paths: {},
    };
    const context = createContext(spec);
    parseV3_0_X(context);
    expect(context.ir.components?.schemas?.['node/type~special']).toBeDefined();
  });

  it('encodes $ref for parameter name containing special characters', () => {
    const spec: OpenAPIV3.Document = {
      components: {
        parameters: {
          'param/special~name': {
            in: 'query' as const,
            name: 'special',
            schema: { type: 'string' },
          },
        },
      },
      info: { title: 'Test', version: '1' },
      openapi: '3.0.3',
      paths: {},
    };
    const context = createContext(spec);
    parseV3_0_X(context);
    expect(context.ir.components?.parameters?.['param/special~name']).toBeDefined();
  });

  it('encodes $ref for requestBody name containing special characters', () => {
    const spec: OpenAPIV3.Document = {
      components: {
        requestBodies: {
          'body/special~name': {
            content: {
              'application/json': {
                schema: { type: 'object' },
              },
            },
          },
        },
      },
      info: { title: 'Test', version: '1' },
      openapi: '3.0.3',
      paths: {},
    };
    const context = createContext(spec);
    parseV3_0_X(context);
    expect(context.ir.components?.requestBodies?.['body/special~name']).toBeDefined();
  });

  it.each([
    {
      compositionKeyword: 'anyOf' as const,
      mapping: {
        BAR: '#/components/schemas/BarItem',
        FOO: '#/components/schemas/FooItem',
      },
    },
    {
      compositionKeyword: 'oneOf' as const,
      mapping: {
        BAR: '#/components/schemas/BarItem',
        FOO: '#/components/schemas/FooItem',
      },
    },
    {
      compositionKeyword: 'anyOf' as const,
      mapping: undefined,
    },
    {
      compositionKeyword: 'oneOf' as const,
      mapping: undefined,
    },
  ])(
    'preserves discriminator metadata before wrapping object $compositionKeyword composition',
    ({ compositionKeyword, mapping }) => {
      const context = createContext(
        createDiscriminatorCompositionSpec({ compositionKeyword, mapping }),
      );

      parseV3_0_X(context);

      const mockItem = context.ir.components?.schemas?.MockItem;
      const unionSchema = mockItem?.items?.[0];
      expect(mockItem?.logicalOperator).toBe('and');
      expect(unionSchema).toMatchObject({
        discriminator: {
          ...(mapping && { mapping }),
          propertyName: 'kind',
        },
        logicalOperator: 'or',
      });
    },
  );
});
