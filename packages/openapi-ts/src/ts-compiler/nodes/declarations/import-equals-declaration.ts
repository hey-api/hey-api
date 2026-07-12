import type { TsNode, TsNodeBase } from '../base';
import type { TsIdentifier } from '../expressions/identifier';
import { TsNodeKind } from '../kinds';
import { SyntaxKind } from '../syntax-kind';
import { createToken, type TsToken } from '../token';

export interface TsImportEqualsDeclaration extends TsNodeBase {
  kind: TsNodeKind.ImportEqualsDeclaration;
  modifiers?: ReadonlyArray<TsNode>;
  moduleReference: TsNode;
  name: TsIdentifier;
  typeOnlyToken?: TsToken;
}

export function createImportEqualsDeclaration(
  modifiers: ReadonlyArray<TsNode> | undefined,
  isTypeOnly: boolean,
  name: TsIdentifier,
  moduleReference: TsNode,
): TsImportEqualsDeclaration {
  return {
    kind: TsNodeKind.ImportEqualsDeclaration,
    modifiers,
    moduleReference,
    name,
    typeOnlyToken: isTypeOnly ? createToken(SyntaxKind.TypeKeyword) : undefined,
  };
}
