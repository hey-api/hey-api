import { Logger } from '@hey-api/codegen-core';
import type { OpenAPIV3_1 } from '@hey-api/spec-types';

import { Context } from '../../../../ir/context';
import { parseV3_1_X } from '../index';

function createContext(spec: OpenAPIV3_1.Document) {
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

describe('parseV3_1_X', () => {
  it('encodes $ref for schema name containing /', () => {
    const spec: OpenAPIV3_1.Document = {
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
      openapi: '3.1.0',
    };
    const context = createContext(spec);
    parseV3_1_X(context);
    expect(context.ir.components?.schemas?.['node/type']).toBeDefined();
  });

  it('encodes $ref for schema name containing ~', () => {
    const spec: OpenAPIV3_1.Document = {
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
      openapi: '3.1.0',
    };
    const context = createContext(spec);
    parseV3_1_X(context);
    expect(context.ir.components?.schemas?.['type~special']).toBeDefined();
  });

  it('encodes $ref for schema name containing / and ~', () => {
    const spec: OpenAPIV3_1.Document = {
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
      openapi: '3.1.0',
    };
    const context = createContext(spec);
    parseV3_1_X(context);
    expect(context.ir.components?.schemas?.['node/type~special']).toBeDefined();
  });

  it('encodes $ref for parameter name containing special characters', () => {
    const spec: OpenAPIV3_1.Document = {
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
      openapi: '3.1.0',
    };
    const context = createContext(spec);
    parseV3_1_X(context);
    expect(context.ir.components?.parameters?.['param/special~name']).toBeDefined();
  });

  it('encodes $ref for requestBody name containing special characters', () => {
    const spec: OpenAPIV3_1.Document = {
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
      openapi: '3.1.0',
    };
    const context = createContext(spec);
    parseV3_1_X(context);
    expect(context.ir.components?.requestBodies?.['body/special~name']).toBeDefined();
  });

  it('does not error when filtering drops every operation on a path that has path-level parameters', () => {
    const spec: OpenAPIV3_1.Document = {
      components: {
        parameters: {
          SharedParam: {
            in: 'query',
            name: 'shared',
            schema: { type: 'string' },
          },
        },
      },
      info: { title: 'Test', version: '1' },
      openapi: '3.1.0',
      paths: {
        '/v1/bar': {
          get: {
            responses: { '200': { description: 'ok' } },
          },
          parameters: [{ $ref: '#/components/parameters/SharedParam' }],
        },
        '/v1/foo': {
          get: {
            responses: { '200': { description: 'ok' } },
          },
        },
      },
    };
    const context = createContext(spec);
    context.config.parser.filters = {
      operations: {
        include: ['GET /v1/foo'],
      },
    };

    expect(() => parseV3_1_X(context)).not.toThrow();
    expect(context.spec.paths?.['/v1/bar']).toBeUndefined();
    expect(context.spec.paths?.['/v1/foo']).toBeDefined();
  });

  it('keeps a component parameter used only by a webhook operation when dropping orphans', () => {
    const spec: OpenAPIV3_1.Document = {
      components: {
        parameters: {
          SharedParam: {
            in: 'query',
            name: 'shared',
            schema: { type: 'string' },
          },
        },
      },
      info: { title: 'Test', version: '1' },
      openapi: '3.1.0',
      paths: {},
      webhooks: {
        newPet: {
          parameters: [{ $ref: '#/components/parameters/SharedParam' }],
          post: {
            responses: { '200': { description: 'ok' } },
          },
        },
      },
    };
    const context = createContext(spec);
    context.config.parser.filters = { orphans: false };

    expect(() => parseV3_1_X(context)).not.toThrow();
    expect(context.spec.webhooks?.newPet).toBeDefined();
    expect(context.spec.components?.parameters?.SharedParam).toBeDefined();
  });

  it('does not error when filtering excludes a webhook operation, and removes the empty webhook', () => {
    const spec: OpenAPIV3_1.Document = {
      info: { title: 'Test', version: '1' },
      openapi: '3.1.0',
      paths: {
        '/v1/foo': {
          get: {
            responses: { '200': { description: 'ok' } },
          },
        },
      },
      webhooks: {
        newPet: {
          post: {
            responses: { '200': { description: 'ok' } },
          },
        },
      },
    };
    const context = createContext(spec);
    context.config.parser.filters = {
      operations: {
        include: ['GET /v1/foo'],
      },
    };

    expect(() => parseV3_1_X(context)).not.toThrow();
    expect(context.spec.webhooks?.newPet).toBeUndefined();
    expect(context.spec.paths?.['/v1/foo']).toBeDefined();
  });
});
