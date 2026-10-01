import type { IR } from '@hey-api/shared';

import { getSignatureParameters } from './signature';

describe('multipart signatures', () => {
  const schemas = [
    { format: 'binary', type: 'string' },
    { items: [{ type: 'string' }], type: 'array' },
  ] satisfies Array<IR.SchemaObject>;

  it.each(schemas)('rejects a top-level $type body', (schema) => {
    expect(() =>
      getSignatureParameters({
        operation: {
          body: { mediaType: 'multipart/form-data', schema, type: 'form-data' },
          id: 'upload',
          method: 'post',
          path: '/upload',
        },
        resolveSchema: (value) => value,
      }),
    ).toThrow(
      'Unsupported multipart body for POST /upload: expected an object schema with properties.',
    );
  });
});
