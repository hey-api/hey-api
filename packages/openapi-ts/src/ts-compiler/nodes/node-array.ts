import type { TsNode } from './base';

export function createNodeArray<T extends TsNode>(
  elements?: ReadonlyArray<T>,
  _hasTrailingComma?: boolean,
): ReadonlyArray<T> {
  return elements ?? [];
}
