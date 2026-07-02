import type { OpenAPIV3 } from '@hey-api/spec-types';

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

    const oauth2: OpenAPIV3.SecuritySchemeObject = {
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
    const securitySchemesMap = new Map<string, OpenAPIV3.SecuritySchemeObject>([
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

  it('omits security when an empty requirement allows anonymous access', () => {
    const localContext = {
      config: { plugins: {} },
      ir: { paths: {}, servers: [] },
    } as unknown as Context;
    const securitySchemesMap = new Map<string, OpenAPIV3.SecuritySchemeObject>([
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
