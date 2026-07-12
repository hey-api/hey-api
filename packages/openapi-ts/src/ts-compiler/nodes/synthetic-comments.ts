import type { TsNode } from './base';
import type { SyntaxKind } from './syntax-kind';

export function addSyntheticLeadingComment<T extends TsNode>(
  node: T,
  kind: SyntaxKind.SingleLineCommentTrivia | SyntaxKind.MultiLineCommentTrivia,
  text: string,
  _hasTrailingNewLine?: boolean,
): T {
  node.leadingComments = [...(node.leadingComments ?? []), text];
  return node;
}

export function addSyntheticTrailingComment<T extends TsNode>(
  node: T,
  kind: SyntaxKind.SingleLineCommentTrivia | SyntaxKind.MultiLineCommentTrivia,
  text: string,
  _hasTrailingNewLine?: boolean,
): T {
  node.trailingComments = [...(node.trailingComments ?? []), text];
  return node;
}

export function setSyntheticLeadingComments<T extends TsNode>(
  node: T,
  comments: ReadonlyArray<string> | undefined,
): T {
  node.leadingComments = comments;
  return node;
}

export function setSyntheticTrailingComments<T extends TsNode>(
  node: T,
  comments: ReadonlyArray<string> | undefined,
): T {
  node.trailingComments = comments;
  return node;
}
