import type { DefaultRequestValidatorLayers, IR } from '@hey-api/shared';

import { buildOperationSchema } from '../../shared/utils/operation-schema';

export function getDefaultRequestValidatorLayers(
  operation: IR.OperationObject,
): DefaultRequestValidatorLayers {
  const { schema } = buildOperationSchema(operation);
  return {
    body: {
      as: 'body',
      optional: !schema.required?.includes('body'),
      whenEmpty: 'strict',
    },
    headers: {
      as: 'headers',
      optional: !schema.required?.includes('headers'),
      whenEmpty: 'omit',
    },
    path: {
      as: 'path',
      optional: !schema.required?.includes('path'),
      whenEmpty: 'strict',
    },
    query: {
      as: 'query',
      optional: !schema.required?.includes('query'),
      whenEmpty: 'strict',
    },
  };
}
