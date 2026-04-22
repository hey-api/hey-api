import type { Context } from '../../../../ir/context';
import { toCase } from '../../../../utils/naming/naming';
import { operationBaseName, operationToId, sanitizeNamespaceIdentifier } from '../operation';

describe('operationBaseName', () => {
  const operationId = 'RequestOperations_describeHTTPRequest';

  it.each(['camelCase', 'PascalCase', 'snake_case', 'SCREAMING_SNAKE_CASE', 'preserve'] as const)(
    'returns raw operationId when operation.id was built with output.case=%s',
    (casing) => {
      const id = toCase(sanitizeNamespaceIdentifier(operationId), casing);
      expect(operationBaseName({ id, operationId })).toBe(operationId);
    },
  );

  it('falls back to operation.id when operationId is missing', () => {
    expect(operationBaseName({ id: 'postFoo' })).toBe('postFoo');
  });

  it('falls back to operation.id when a disambiguation suffix was appended', () => {
    // operationToId appends a numeric suffix when the sanitized operationId
    // collides with another operation. The suffix only lives on operation.id
    // and must be preserved.
    expect(operationBaseName({ id: 'create2', operationId: 'create_' })).toBe('create2');
    expect(operationBaseName({ id: 'create3', operationId: 'create__' })).toBe('create3');
  });
});

describe('operationToId', () => {
  const scenarios: Array<{
    id?: string;
    method: string;
    output: string;
    path: string;
  }> = [
    {
      method: 'post',
      output: 'postFoo',
      path: '/foo',
    },
    {
      id: 'Post-foo',
      method: 'post',
      output: 'postFoo',
      path: '/foo',
    },
    {
      method: 'post',
      output: 'postFooByFooId',
      path: '/foo/{foo_id}',
    },
    {
      method: 'post',
      output: 'postFooByFooIdBarBazQux',
      path: '/foo/{foo_id}/bar+baz:qux',
    },
  ];

  it.each(scenarios)(
    'transforms $method $path ($id) -> $output',
    async ({ id, method, output, path }) => {
      const context: Partial<Context> = {
        config: {
          plugins: {
            '@hey-api/sdk': {
              config: {
                // @ts-expect-error
                operationId: true,
              },
              name: '@hey-api/sdk',
            },
          },
        },
      };
      expect(
        operationToId({
          context: context as Context,
          id,
          method,
          path,
          state: {
            ids: new Map(),
          },
        }),
      ).toEqual(output);
    },
  );
});
