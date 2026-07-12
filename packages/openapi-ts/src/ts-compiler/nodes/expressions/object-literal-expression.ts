import type { TsNodeBase } from '../base';
import { TsNodeKind } from '../kinds';
import type { TsObjectLiteralElementLike } from './object-literal-element-like';

export interface TsObjectLiteralExpression extends TsNodeBase {
  kind: TsNodeKind.ObjectLiteralExpression;
  multiLine?: boolean;
  properties: ReadonlyArray<TsObjectLiteralElementLike>;
}

export function createObjectLiteralExpression(
  properties?: ReadonlyArray<TsObjectLiteralElementLike>,
  multiLine?: boolean,
): TsObjectLiteralExpression {
  return {
    kind: TsNodeKind.ObjectLiteralExpression,
    multiLine,
    properties: properties ?? [],
  };
}
