import type * as Shared from '@hey-api/shared';

import { ts } from '../../../../../ts-compiler';

const printer = ts.createPrinter();
const astToString = (node: Parameters<typeof printer.format>[0]) => printer.format(node).trimEnd();

vi.mock('@hey-api/shared', async (importOriginal) => {
  const actual = await importOriginal<typeof Shared>();
  return {
    ...actual,
    applyNaming: (id: string) => `use${id.charAt(0).toUpperCase()}${id.slice(1)}Query`,
  };
});

vi.mock('../../../../shared/utils/operation', () => ({
  createOperationComment: () => null,
  hasOperationSse: () => false,
  isOperationOptionsRequired: () => false,
}));

const { createUseQuery } = await import('../use-query');

const buildPlugin = () => {
  const captured: Array<{ toAst: () => never }> = [];
  let useQueryParamsRegistered = false;
  const plugin = {
    config: {
      comments: false,
      useQuery: { case: 'camelCase', enabled: true, name: 'use{{name}}Query' },
    },
    context: {},
    imports: { useQuery: 'useQuery' },
    name: '@tanstack/react-query' as const,
    node: (statement: { toAst: () => never }) => {
      captured.push(statement);
    },
    querySymbol: ({ resource }: { resource: string }) =>
      resource === 'UseQueryParams' && useQueryParamsRegistered ? 'UseQueryParams' : undefined,
    referenceSymbol: ({ resource }: { resource: string }) =>
      resource === 'UseQueryParams' ? 'UseQueryParams' : 'fooOptions',
    symbol: (name: string) => {
      if (name === 'UseQueryParams') {
        useQueryParamsRegistered = true;
      }
      return name;
    },
  };
  return { captured, plugin };
};

describe('createUseQuery', () => {
  it('emits a UseQueryParams type alias and a hook that references it', () => {
    const { captured, plugin } = buildPlugin();
    createUseQuery({
      operation: { id: 'foo' } as never,
      plugin: plugin as never,
    });
    expect(captured).toHaveLength(2);
    const [alias, hook] = captured;
    const aliasText = astToString(alias!.toAst());
    expect(aliasText).toContain('type UseQueryParams');
    expect(aliasText).toContain('NonNullable<Parameters<TFactory>[0]>');
    expect(aliasText).toContain("Partial<Omit<ReturnType<TFactory>, 'queryKey' | 'queryFn'>>");

    const hookText = astToString(hook!.toAst());
    expect(hookText).toContain('useFooQuery');
    expect(hookText).toContain('UseQueryParams<typeof fooOptions>');
    expect(hookText).toContain('const { queryOptions, ...sdkOptions } = options ?? {};');
    expect(hookText).toContain('return useQuery({ ...fooOptions(sdkOptions), ...queryOptions });');
  });

  it('returns without emitting when useQuery is not in the plugin config', () => {
    const { captured, plugin } = buildPlugin();
    const pluginNoUseQuery = { ...plugin, config: { comments: false } };
    createUseQuery({
      operation: { id: 'foo' } as never,
      plugin: pluginNoUseQuery as never,
    });
    expect(captured).toHaveLength(0);
  });
});
