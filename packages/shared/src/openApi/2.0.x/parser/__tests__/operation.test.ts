import type { OpenAPIV2 } from '@hey-api/spec-types';

import type { Context } from '../../../../ir/context';
import { parsePathOperation } from '../operation';

type ParseOperationProps = Parameters<typeof parsePathOperation>[0];

const createContext = () =>
  ({
    config: {
      parser: {
        content: { preferred: {} },
        pagination: {
          keywords: ['after', 'before', 'cursor', 'offset', 'page', 'start'],
        },
      },
      plugins: {},
    },
    dereference: <T>(obj: any): T => obj as T,
    ir: {
      components: {
        schemas: {},
      },
      paths: {},
      servers: [],
    },
    resolveRef: () =>
      // Mock implementation
      undefined,
  }) as unknown as Context;

describe('operation', () => {
  const context = createContext();

  it('should parse operation correctly', () => {
    const method = 'get';
    const operation: ParseOperationProps['operation'] = {
      operationId: 'testOperation',
      responses: {},
      security: [
        {
          apiKeyAuth: [],
          basicAuthRule: [],
        },
        {
          apiKeyAuth: [],
          oauthRule: [],
        },
      ],
      summary: 'Test Operation',
    };
    const path = '/test';
    const securitySchemesMap = new Map<string, OpenAPIV2.SecuritySchemeObject>([
      ['apiKeyAuth', { in: 'header', name: 'Auth', type: 'apiKey' }],
      ['basicAuthRule', { description: 'Basic Auth', type: 'basic' }],
      [
        'oauthRule',
        {
          description: 'OAuth2',
          flow: 'password',
          scopes: {
            read: 'Grants read access',
            write: 'Grants write access',
          },
          tokenUrl: 'https://example.com/oauth/token',
          type: 'oauth2',
        },
      ],
    ]);
    const state: ParseOperationProps['state'] = {
      ids: new Map<string, string>(),
    };

    parsePathOperation({
      ambiguousSecurityKeys: new Set(),
      context,
      method,
      operation,
      path,
      securitySchemesMap,
      state,
    });

    expect(context.ir.paths?.[path]?.[method]).toEqual({
      id: 'testOperation',
      method,
      operationId: 'testOperation',
      path,
      security: [
        { in: 'header', name: 'Auth', type: 'apiKey' },
        { description: 'Basic Auth', scheme: 'basic', type: 'http' },
        {
          description: 'OAuth2',
          flows: {
            password: {
              scopes: {
                read: 'Grants read access',
                write: 'Grants write access',
              },
              tokenUrl: 'https://example.com/oauth/token',
            },
          },
          type: 'oauth2',
        },
      ],
      summary: 'Test Operation',
    });
  });

  it('should parse body parameter when consumes is undefined', () => {
    const context = createContext();
    const method = 'post';
    const bodyParam: OpenAPIV2.ParameterObject = {
      description: 'Request body',
      in: 'body',
      name: 'body',
      required: true,
      schema: {
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
        },
        required: ['id'],
        type: 'object',
      },
    };
    const operation: ParseOperationProps['operation'] = {
      operationId: 'createItem',
      requestBody: [bodyParam],
      responses: {
        '201': {
          description: 'Created',
        },
      },
      summary: 'Create an item',
    };
    const path = '/items';
    const securitySchemesMap = new Map<string, OpenAPIV2.SecuritySchemeObject>();
    const state: ParseOperationProps['state'] = {
      ids: new Map<string, string>(),
    };

    parsePathOperation({
      ambiguousSecurityKeys: new Set(),
      context,
      method,
      operation,
      path,
      securitySchemesMap,
      state,
    });

    const result = context.ir.paths?.[path]?.[method];
    expect(result).toBeDefined();
    expect(result?.body).toBeDefined();
    expect(result?.body?.mediaType).toBe('application/json');
    expect(result?.body?.required).toBe(true);
    expect(result?.body?.schema.type).toBe('object');
  });

  it('should parse body parameter with array schema', () => {
    const context = createContext();
    const method = 'post';
    const bodyParam: OpenAPIV2.ParameterObject = {
      description: 'add items',
      in: 'body',
      name: 'request',
      required: true,
      schema: {
        items: {
          properties: {
            count: { type: 'number' },
            id: { type: 'integer' },
          },
          type: 'object',
        },
        type: 'array',
      },
    };
    const operation: ParseOperationProps['operation'] = {
      operationId: 'addItems',
      requestBody: [bodyParam],
      responses: {
        '201': {
          description: 'Created',
        },
      },
    };
    const path = '/api/v1/items';
    const securitySchemesMap = new Map<string, OpenAPIV2.SecuritySchemeObject>();
    const state: ParseOperationProps['state'] = {
      ids: new Map<string, string>(),
    };

    parsePathOperation({
      ambiguousSecurityKeys: new Set(),
      context,
      method,
      operation,
      path,
      securitySchemesMap,
      state,
    });

    const result = context.ir.paths?.[path]?.[method];
    expect(result).toBeDefined();
    expect(result?.body).toBeDefined();
    expect(result?.body?.mediaType).toBe('application/json');
    expect(result?.body?.required).toBe(true);
    expect(result?.body?.schema.type).toBe('array');
  });

  it('should use consumes when specified', () => {
    const context = createContext();
    const method = 'post';
    const bodyParam: OpenAPIV2.ParameterObject = {
      description: 'XML body',
      in: 'body',
      name: 'body',
      required: true,
      schema: {
        type: 'object',
      },
    };
    const operation: ParseOperationProps['operation'] = {
      consumes: ['application/xml'],
      operationId: 'createXml',
      requestBody: [bodyParam],
      responses: {
        '201': {
          description: 'Created',
        },
      },
    };
    const path = '/items';
    const securitySchemesMap = new Map<string, OpenAPIV2.SecuritySchemeObject>();
    const state: ParseOperationProps['state'] = {
      ids: new Map<string, string>(),
    };

    parsePathOperation({
      ambiguousSecurityKeys: new Set(),
      context,
      method,
      operation,
      path,
      securitySchemesMap,
      state,
    });

    const result = context.ir.paths?.[path]?.[method];
    expect(result).toBeDefined();
    expect(result?.body).toBeDefined();
    expect(result?.body?.mediaType).toBe('application/xml');
  });
});
