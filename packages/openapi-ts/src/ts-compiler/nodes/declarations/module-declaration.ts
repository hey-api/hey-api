import type { TsNode, TsNodeBase } from '../base';
import type { TsIdentifier } from '../expressions/identifier';
import type { TsQualifiedName } from '../expressions/qualified-name';
import type { TsStringLiteral } from '../expressions/string-literal';
import { TsNodeKind } from '../kinds';
import type { TsModuleBlock } from './module-block';

export interface TsModuleDeclaration extends TsNodeBase {
  body?: TsModuleBlock;
  kind: TsNodeKind.ModuleDeclaration;
  modifiers?: ReadonlyArray<TsNode>;
  name: TsIdentifier | TsQualifiedName | TsStringLiteral;
}

export function createModuleDeclaration(
  modifiers: ReadonlyArray<TsNode> | undefined,
  name: TsIdentifier | TsQualifiedName | TsStringLiteral,
  body?: TsModuleBlock,
): TsModuleDeclaration {
  return {
    body,
    kind: TsNodeKind.ModuleDeclaration,
    modifiers,
    name,
  };
}
