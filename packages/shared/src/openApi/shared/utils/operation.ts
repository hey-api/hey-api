import type { Context } from '../../../ir/context';
import { createOperationKey } from '../../../ir/operation';
import { toCase } from '../../../utils/naming/naming';
import type { State } from '../types/state';

export const httpMethods = [
  'delete',
  'get',
  'head',
  'options',
  'patch',
  'post',
  'put',
  'trace',
] as const;

/**
 * Sanitizes namespace identifiers so they are valid TypeScript identifiers of a certain form.
 *
 * 1: Remove any leading characters that are illegal as starting character of a typescript identifier.
 * 2: Replace illegal characters in remaining part of type name with hyphen (-).
 *
 * Step 1 should perhaps instead also replace illegal characters with underscore, or prefix with it, like sanitizeEnumName
 * does. The way this is now one could perhaps end up removing all characters, if all are illegal start characters. It
 * would be sort of a breaking change to do so, though, previously generated code might change then.
 *
 * JavaScript identifier regexp pattern retrieved from https://developer.mozilla.org/docs/Web/JavaScript/Reference/Lexical_grammar#identifiers
 *
 * The output of this is expected to be converted to PascalCase
 *
 * @deprecated
 */
export function sanitizeNamespaceIdentifier(name: string) {
  return name
    .replace(/^[^\p{ID_Start}]+/u, '')
    .replace(/[^$\u200c\u200d\p{ID_Continue}]/gu, '-')
    .replace(/[$+]/g, '-');
}

/**
 * Returns an operation ID to use across the application. By default, we try
 * to use the provided ID. If it's not provided or the SDK is configured
 * to exclude it, we generate operation ID from its location.
 *
 * @deprecated
 */
export function operationToId({
  context,
  count = 1,
  id,
  method,
  path,
  state,
}: {
  context: Context;
  count?: number;
  id: string | undefined;
  method: string;
  path: string;
  state: Pick<State, 'ids'>;
}): string {
  let result: string;

  const { output } = context.config;
  const targetCase =
    (output !== undefined && typeof output === 'object' && 'case' in output
      ? output.case
      : undefined) ?? 'camelCase';

  if (
    id &&
    (!context.config.plugins['@hey-api/sdk'] ||
      // TODO: needs to be refactored...
      // @ts-expect-error
      (context.config.plugins['@hey-api/sdk'].config.operations &&
        // @ts-expect-error
        typeof context.config.plugins['@hey-api/sdk'].config.operations !== 'function' &&
        // @ts-expect-error
        typeof context.config.plugins['@hey-api/sdk'].config.operations === 'object' &&
        // @ts-expect-error
        context.config.plugins['@hey-api/sdk'].config.operations.nesting === 'operationId'))
  ) {
    result = toCase(sanitizeNamespaceIdentifier(id), targetCase);
  } else {
    const pathWithoutPlaceholders = path
      .replace(/{(.*?)}/g, 'by-$1')
      // replace slashes with hyphens for camelcase method at the end
      .replace(/[/:+]/g, '-');

    result = toCase(`${method}-${pathWithoutPlaceholders}`, targetCase);
  }

  if (count > 1) {
    result = `${result}${count}`;
  }

  if (state.ids.has(result)) {
    return operationToId({
      context,
      count: count + 1,
      id,
      method,
      path,
      state,
    });
  }

  state.ids.set(result, createOperationKey({ method, path }));

  return result;
}
