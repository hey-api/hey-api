import type { OpenAPIV3_1 } from '@hey-api/spec-types';

import type { Context } from '../../../../ir/context';
import { parsePathOperation } from '../operation';

type ParseOperationProps = Parameters<typeof parsePathOperation>[0];

describe('operation', () => {
  const context = {
    config: {
      plugins: {},
    },
    ir: {
      paths: {},
      servers: [],
    },
  } as unknown as Context;

  it('should parse operation correctly', () => {
    const method = 'get';
    const operation: ParseOperationProps['operation'] = {
      operationId: 'testOperation',
      responses: {},
      security: [
        {
          apiKeyAuth: [],
        },
        {
          apiKeyAuth: [],
        },
        {
          oauthRule: ['read'],
        },
        {
          oauthRule: ['write'],
        },
      ],
      summary: 'Test Operation',
    };
    const path = '/test';

    const oauth2: OpenAPIV3_1.SecuritySchemeObject = {
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
    };
    const securitySchemesMap = new Map<string, OpenAPIV3_1.SecuritySchemeObject>([
      ['apiKeyAuth', { in: 'header', name: 'Auth', type: 'apiKey' }],
      ['basicAuthRule', { description: 'Basic Auth', scheme: 'basic', type: 'http' }],
      ['oauthRule', oauth2],
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
      security: [{ in: 'header', name: 'Auth', type: 'apiKey' }, oauth2],
      summary: 'Test Operation',
    });
  });

  it('attaches `key` only to schemes with colliding signatures', () => {
    const localContext = {
      config: { plugins: {} },
      ir: { paths: {}, servers: [] },
    } as unknown as Context;

    const bearerAuth: OpenAPIV3_1.SecuritySchemeObject = {
      scheme: 'bearer',
      type: 'http',
    };
    const refreshAuth: OpenAPIV3_1.SecuritySchemeObject = {
      scheme: 'bearer',
      type: 'http',
    };
    const basicAuth: OpenAPIV3_1.SecuritySchemeObject = {
      scheme: 'basic',
      type: 'http',
    };
    const securitySchemesMap = new Map<string, OpenAPIV3_1.SecuritySchemeObject>([
      ['bearerAuth', bearerAuth],
      ['refreshAuth', refreshAuth],
      ['basicAuth', basicAuth],
    ]);
    const ambiguousSecurityKeys = new Set(['bearerAuth', 'refreshAuth']);
    const state: ParseOperationProps['state'] = {
      ids: new Map<string, string>(),
    };

    parsePathOperation({
      ambiguousSecurityKeys,
      context: localContext,
      method: 'get',
      operation: {
        operationId: 'getData',
        responses: {},
        security: [{ bearerAuth: [] }],
      },
      path: '/data',
      securitySchemesMap,
      state,
    });
    parsePathOperation({
      ambiguousSecurityKeys,
      context: localContext,
      method: 'get',
      operation: {
        operationId: 'getUnique',
        responses: {},
        security: [{ basicAuth: [] }],
      },
      path: '/unique',
      securitySchemesMap,
      state,
    });

    expect(localContext.ir.paths?.['/data']?.get?.security).toEqual([
      { key: 'bearerAuth', scheme: 'bearer', type: 'http' },
    ]);
    expect(localContext.ir.paths?.['/unique']?.get?.security).toEqual([
      { scheme: 'basic', type: 'http' },
    ]);
  });

  it('omits security when an empty requirement allows anonymous access', () => {
    const localContext = {
      config: { plugins: {} },
      ir: { paths: {}, servers: [] },
    } as unknown as Context;
    const securitySchemesMap = new Map<string, OpenAPIV3_1.SecuritySchemeObject>([
      ['apiKeyAuth', { in: 'header', name: 'Auth', type: 'apiKey' }],
    ]);

    parsePathOperation({
      ambiguousSecurityKeys: new Set(),
      context: localContext,
      method: 'get',
      operation: {
        operationId: 'getPublicData',
        responses: {},
        security: [{ apiKeyAuth: [] }, {}],
      },
      path: '/public-data',
      securitySchemesMap,
      state: { ids: new Map<string, string>() },
    });

    expect(localContext.ir.paths?.['/public-data']?.get?.security).toBeUndefined();
  });
});
