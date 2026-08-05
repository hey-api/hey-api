import type { TsNode } from './nodes/base';
import { TsNodeKind } from './nodes/kinds';
import { TsNodeFlags } from './nodes/node-flags';
import { SyntaxKind } from './nodes/syntax-kind';

export type TsPrinterOptions = {
  /**
   * Number of spaces per indentation level.
   *
   * @default 2
   */
  indentSize?: number;
  /**
   * Whether to add trailing semicolons to statements.
   *
   * @default true
   */
  semicolons?: boolean;
};

export type TsPrinter = {
  format: (node: TsNode) => string;
  formatNode: (node: TsNode) => string;
};

const DEFAULT_INDENT_SIZE = 2;
const DEFAULT_SEMICOLONS = true;

const TOKEN_TEXT: Record<SyntaxKind, string> = {
  [SyntaxKind.AmpersandAmpersandToken]: '&&',
  [SyntaxKind.AmpersandToken]: '&',
  [SyntaxKind.AsteriskAsteriskToken]: '**',
  [SyntaxKind.AsteriskToken]: '*',
  [SyntaxKind.BarBarToken]: '||',
  [SyntaxKind.BarToken]: '|',
  [SyntaxKind.CaretToken]: '^',
  [SyntaxKind.ColonToken]: ':',
  [SyntaxKind.DotDotDotToken]: '...',
  [SyntaxKind.EqualsEqualsEqualsToken]: '===',
  [SyntaxKind.EqualsEqualsToken]: '==',
  [SyntaxKind.EqualsGreaterThanToken]: '=>',
  [SyntaxKind.EqualsToken]: '=',
  [SyntaxKind.ExclamationEqualsEqualsToken]: '!==',
  [SyntaxKind.ExclamationEqualsToken]: '!=',
  [SyntaxKind.ExclamationToken]: '!',
  [SyntaxKind.GreaterThanEqualsToken]: '>=',
  [SyntaxKind.GreaterThanToken]: '>',
  [SyntaxKind.LessThanEqualsToken]: '<=',
  [SyntaxKind.LessThanToken]: '<',
  [SyntaxKind.MinusMinusToken]: '--',
  [SyntaxKind.MinusToken]: '-',
  [SyntaxKind.PercentToken]: '%',
  [SyntaxKind.PlusPlusToken]: '++',
  [SyntaxKind.PlusToken]: '+',
  [SyntaxKind.QuestionDotToken]: '?.',
  [SyntaxKind.QuestionQuestionEqualsToken]: '??=',
  [SyntaxKind.QuestionQuestionToken]: '??',
  [SyntaxKind.QuestionToken]: '?',
  [SyntaxKind.SlashToken]: '/',
  [SyntaxKind.TildeToken]: '~',
  [SyntaxKind.AbstractKeyword]: 'abstract',
  [SyntaxKind.AccessorKeyword]: 'accessor',
  [SyntaxKind.AsyncKeyword]: 'async',
  [SyntaxKind.AwaitKeyword]: 'await',
  [SyntaxKind.ConstKeyword]: 'const',
  [SyntaxKind.DeclareKeyword]: 'declare',
  [SyntaxKind.DefaultKeyword]: 'default',
  [SyntaxKind.ExportKeyword]: 'export',
  [SyntaxKind.InKeyword]: 'in',
  [SyntaxKind.OutKeyword]: 'out',
  [SyntaxKind.OverrideKeyword]: 'override',
  [SyntaxKind.PrivateKeyword]: 'private',
  [SyntaxKind.ProtectedKeyword]: 'protected',
  [SyntaxKind.PublicKeyword]: 'public',
  [SyntaxKind.ReadonlyKeyword]: 'readonly',
  [SyntaxKind.StaticKeyword]: 'static',
  [SyntaxKind.ExtendsKeyword]: 'extends',
  [SyntaxKind.ImplementsKeyword]: 'implements',
  [SyntaxKind.ImportKeyword]: 'import',
  [SyntaxKind.KeyOfKeyword]: 'keyof',
  [SyntaxKind.NewKeyword]: 'new',
  [SyntaxKind.UniqueKeyword]: 'unique',
  [SyntaxKind.AnyKeyword]: 'any',
  [SyntaxKind.AssertsKeyword]: 'asserts',
  [SyntaxKind.BigIntKeyword]: 'bigint',
  [SyntaxKind.BooleanKeyword]: 'boolean',
  [SyntaxKind.FalseKeyword]: 'false',
  [SyntaxKind.NeverKeyword]: 'never',
  [SyntaxKind.NullKeyword]: 'null',
  [SyntaxKind.NumberKeyword]: 'number',
  [SyntaxKind.ObjectKeyword]: 'object',
  [SyntaxKind.StringKeyword]: 'string',
  [SyntaxKind.SymbolKeyword]: 'symbol',
  [SyntaxKind.TrueKeyword]: 'true',
  [SyntaxKind.TypeKeyword]: 'type',
  [SyntaxKind.UndefinedKeyword]: 'undefined',
  [SyntaxKind.UnknownKeyword]: 'unknown',
  [SyntaxKind.VoidKeyword]: 'void',
  [SyntaxKind.MultiLineCommentTrivia]: '',
  [SyntaxKind.SingleLineCommentTrivia]: '',
};

const stringLiteralEscapeNeeded = /['\\\n\r\t]/;

/**
 * Core idea: instead of chaining five separate `.replace`/`.replaceAll`
 * passes (each a full scan of the string, building an intermediate string
 * every time), first find the index of the earliest character that needs
 * escaping. If none is found, the string is returned untouched. Otherwise,
 * only walk from that index once, switching on `charCodeAt` per character —
 * unescaped runs are copied in bulk via `slice` (using a pending start
 * index) rather than character by character, and only characters that
 * actually need escaping pay any extra cost.
 */
function formatStringLiteral(text: string): string {
  const match = stringLiteralEscapeNeeded.exec(text);
  if (match === null) return `'${text}'`;

  let result = text.slice(0, match.index);
  let runStart = match.index;

  for (let i = match.index, len = text.length; i < len; i++) {
    let escape: string;
    switch (text.charCodeAt(i)) {
      case 39: // '
        escape = "\\'";
        break;
      case 92: // \
        escape = '\\\\';
        break;
      case 10: // \n
        escape = '\\n';
        break;
      case 13: // \r
        escape = '\\r';
        break;
      case 9: // \t
        escape = '\\t';
        break;
      default:
        continue;
    }
    if (runStart !== i) result += text.slice(runStart, i);
    result += escape;
    runStart = i + 1;
  }

  if (runStart !== text.length) result += text.slice(runStart);
  return `'${result}'`;
}

const templateTextEscapeNeeded = /[\\`]|\$\{/;

/** Core idea as `formatStringLiteral` above, applied to template-literal text. */
function formatTemplateText(text: string): string {
  const match = templateTextEscapeNeeded.exec(text);
  if (match === null) return text;

  let result = text.slice(0, match.index);
  let runStart = match.index;

  for (let i = match.index, len = text.length; i < len; i++) {
    let escape: string;
    let skip = 0;
    switch (text.charCodeAt(i)) {
      case 92: // \
        escape = '\\\\';
        break;
      case 96: // `
        escape = '\\`';
        break;
      case 36: // $
        // Only `${` needs escaping — a lone `$` is not special.
        if (text.charCodeAt(i + 1) !== 123) continue;
        escape = '\\${';
        skip = 1;
        break;
      default:
        continue;
    }
    if (runStart !== i) result += text.slice(runStart, i);
    result += escape;
    i += skip;
    runStart = i + 1;
  }

  if (runStart !== text.length) result += text.slice(runStart);
  return result;
}

// Faster than `Array.prototype.join` for plain string arrays.
function fastJoin(parts: ReadonlyArray<string>, separator: string): string {
  const len = parts.length;
  if (len === 0) return '';
  let result = parts[0] as string;
  for (let i = 1; i < len; i++) {
    result += separator;
    result += parts[i] as string;
  }
  return result;
}

export function createPrinter(options?: TsPrinterOptions): TsPrinter {
  const indentUnit = ' '.repeat(options?.indentSize ?? DEFAULT_INDENT_SIZE);
  const semicolons = options?.semicolons ?? DEFAULT_SEMICOLONS;
  let indentLevel = 0;

  function printComments(
    parts: Array<string>,
    lines: ReadonlyArray<string>,
    indent?: boolean,
  ): void {
    if (indent) indentLevel += 1;
    for (let i = 0, len = lines.length; i < len; i++) {
      const comment = lines[i] as string;
      // JSDoc/block trivia carries its own framing across lines; '//' is for single-line trivia.
      if (comment.includes('\n') || comment.startsWith('*')) {
        const block = `/*${comment}*/`;
        const blockLines = block.split('\n');
        for (let j = 0, len = blockLines.length; j < len; j++)
          parts.push(printLine(blockLines[j] as string));
      } else {
        parts.push(printLine(`//${comment}`));
      }
    }
    if (indent) indentLevel -= 1;
  }

  function printLine(line: string): string {
    if (line === '') return '';
    return indentUnit.repeat(indentLevel) + line;
  }

  function terminate(statement: string): string {
    return semicolons ? `${statement};` : statement;
  }

  function printInline(node: TsNode, skipComments?: boolean): string {
    return formatNode(node, true, skipComments);
  }

  // Joins each node's inline text with `separator`, avoiding the intermediate
  // array that `.map(...).join(...)` would allocate.
  function joinInline(nodes: ReadonlyArray<TsNode>, separator: string): string {
    return joinBy(nodes, separator, printInline);
  }

  // Generic version of `joinInline` for call sites that need a custom
  // per-element formatter (e.g. wrapping each entry, or joining tokens).
  // Seeding `result` from index 0 (rather than branching on `i > 0` inside
  // the loop) mirrors the fast string-array-join pattern, which benchmarks
  // faster than `Array.prototype.join` for string arrays.
  function joinBy<T>(
    items: ReadonlyArray<T>,
    separator: string,
    format: (item: T) => string,
  ): string {
    const len = items.length;
    if (len === 0) return '';
    let result = format(items[0] as T);
    for (let i = 1; i < len; i++) {
      result += separator;
      result += format(items[i] as T);
    }
    return result;
  }

  function printEmbeddedStatement(statement: TsNode): string {
    return printInline(statement).replace(/^ +/, '');
  }

  function printBraceBlock(items: ReadonlyArray<TsNode>): string {
    if (items.length === 0) return '{}';
    const lines: Array<string> = ['{'];
    indentLevel += 1;
    for (const item of items) lines.push(formatNode(item));
    indentLevel -= 1;
    lines.push(printLine('}'));
    return lines.join('\n');
  }

  function printModifiers(modifiers: ReadonlyArray<TsNode> | undefined): string {
    if (!modifiers || modifiers.length === 0) return '';
    return `${joinInline(modifiers, ' ')} `;
  }

  function printName(name: string | TsNode): string {
    return typeof name === 'string' ? name : printInline(name);
  }

  function printTypeParameters(typeParameters: ReadonlyArray<TsNode> | undefined): string {
    if (!typeParameters || typeParameters.length === 0) return '';
    return `<${joinInline(typeParameters, ', ')}>`;
  }

  function printAccessTarget(expression: TsNode): string {
    const text = printInline(expression);
    return expression.kind === TsNodeKind.BinaryExpression ||
      expression.kind === TsNodeKind.ConditionalExpression ||
      expression.kind === TsNodeKind.ArrowFunction ||
      expression.kind === TsNodeKind.AwaitExpression ||
      expression.kind === TsNodeKind.FunctionExpression ||
      expression.kind === TsNodeKind.AsExpression ||
      expression.kind === TsNodeKind.SatisfiesExpression ||
      expression.kind === TsNodeKind.TypeOfExpression ||
      expression.kind === TsNodeKind.VoidExpression ||
      expression.kind === TsNodeKind.DeleteExpression
      ? `(${text})`
      : text;
  }

  function printArrayElement(type: TsNode): string {
    const text = printInline(type);
    return type.kind === TsNodeKind.UnionType ||
      type.kind === TsNodeKind.IntersectionType ||
      type.kind === TsNodeKind.FunctionType ||
      type.kind === TsNodeKind.ConstructorType ||
      type.kind === TsNodeKind.ConditionalType ||
      type.kind === TsNodeKind.InferType ||
      type.kind === TsNodeKind.TypeOperator
      ? `(${text})`
      : text;
  }

  function printIntersectionMember(type: TsNode): string {
    const text = printInline(type);
    return type.kind === TsNodeKind.UnionType ||
      type.kind === TsNodeKind.FunctionType ||
      type.kind === TsNodeKind.ConstructorType ||
      type.kind === TsNodeKind.ConditionalType
      ? `(${text})`
      : text;
  }

  function printUnionMember(type: TsNode): string {
    const text = printInline(type);
    return type.kind === TsNodeKind.IntersectionType ||
      type.kind === TsNodeKind.FunctionType ||
      type.kind === TsNodeKind.ConstructorType ||
      type.kind === TsNodeKind.ConditionalType
      ? `(${text})`
      : text;
  }

  // Shared by InterfaceDeclaration and TypeAliasDeclaration, both of which
  // format `<T extends X = Y>`-style type parameter lists identically.
  // Hoisting this (and the formatters below) to named functions means the
  // formatter passed to `joinBy` is allocated once per printer instance
  // instead of once per node visited.
  function printTypeParameterWithConstraint(typeParameter: {
    constraint?: TsNode;
    default?: TsNode;
    name: string | TsNode;
  }): string {
    let text = printName(typeParameter.name);
    if (typeParameter.constraint) text += ` extends ${printInline(typeParameter.constraint)}`;
    if (typeParameter.default) text += ` = ${printInline(typeParameter.default)}`;
    return text;
  }

  function printHeritageClauseSuffix(heritageClause: {
    token: { syntaxKind: SyntaxKind };
    types: ReadonlyArray<TsNode>;
  }): string {
    return ` ${TOKEN_TEXT[heritageClause.token.syntaxKind]} ${joinInline(heritageClause.types, ', ')}`;
  }

  function printClassHeritageSuffix(clause: TsNode): string {
    return ` ${printInline(clause)}`;
  }

  function printIndexParameter(parameter: { name: string | TsNode; type?: TsNode }): string {
    let entry = printName(parameter.name);
    if (parameter.type) entry += `: ${printInline(parameter.type)}`;
    return entry;
  }

  function printTokenWithTrailingSpace(token: { syntaxKind: SyntaxKind }): string {
    return `${TOKEN_TEXT[token.syntaxKind]} `;
  }

  // `formatNode` used to allocate a fresh `push` closure on every call (i.e.
  // once per AST node) purely to manage the `single`/`parts` accumulator
  // below. Since formatNode never runs re-entrantly through this closure
  // (each call fully resolves its own `push` calls before returning), that
  // state can instead live in these two outer-scoped variables, saving one
  // closure allocation per node at the cost of save/restore around recursion.
  let accSingle: string | undefined;
  let accParts: Array<string> | undefined;

  function push(value: string): void {
    if (accParts) {
      accParts.push(value);
    } else if (accSingle === undefined) {
      accSingle = value;
    } else {
      accParts = [accSingle, value];
      accSingle = undefined;
    }
  }

  function formatNode(node: TsNode, inline?: boolean, skipComments?: boolean): string {
    // Most node kinds push exactly one string and carry no comments, so the
    // switch below writes into `parts` lazily: `single` holds that one string
    // without ever allocating an array, and we only spill into a real
    // `Array<string>` once a second entry (comments, or a multi-line case
    // such as Block/ClassDeclaration) shows up. Save/restore the outer
    // accumulator around this call so recursive formatNode calls (which also
    // use `push`) don't clobber this frame's in-progress result.
    const savedSingle = accSingle;
    const savedParts = accParts;
    accSingle = undefined;
    accParts = undefined;

    if (node.leadingComments && !skipComments) {
      const leading: Array<string> = [];
      printComments(leading, node.leadingComments);
      for (let i = 0, len = leading.length; i < len; i++) push(leading[i] as string);
    }

    switch (node.kind) {
      case TsNodeKind.ArrayBindingPattern: {
        const elements = joinInline(node.elements, ', ');
        push(`[${elements}]`);
        break;
      }

      case TsNodeKind.ArrayLiteralExpression: {
        if (node.multiLine && node.elements.length > 0) {
          const lines: Array<string> = ['['];
          indentLevel += 1;
          for (let i = 0, len = node.elements.length; i < len; i++) {
            const text = printLine(printInline(node.elements[i] as TsNode));
            lines.push(i < len - 1 ? `${text},` : text);
          }
          indentLevel -= 1;
          lines.push(printLine(']'));
          push(fastJoin(lines, '\n'));
          break;
        }
        indentLevel += 1;
        // tsc keeps an inline array's leading `{`/`[` on the bracket line, indenting
        // the broken element one extra level (`[{` ... `}]`).
        const arrayElements = joinInline(node.elements, ', ');
        indentLevel -= 1;
        push(`[${arrayElements}]`);
        break;
      }

      case TsNodeKind.ArrayType:
        push(`${printArrayElement(node.elementType)}[]`);
        break;

      case TsNodeKind.ArrowFunction: {
        let text = printModifiers(node.modifiers);
        text += printTypeParameters(node.typeParameters);
        const parameters = joinInline(node.parameters, ', ');
        const onlyParameter = node.parameters.length === 1 ? node.parameters[0] : undefined;
        const bareParameter =
          !node.type &&
          !node.modifiers?.length &&
          !node.typeParameters?.length &&
          onlyParameter !== undefined &&
          !onlyParameter.type &&
          !onlyParameter.questionToken &&
          !onlyParameter.dotDotDotToken &&
          !onlyParameter.initializer &&
          !onlyParameter.modifiers?.length &&
          (typeof onlyParameter.name === 'string' ||
            onlyParameter.name.kind === TsNodeKind.Identifier);
        text += bareParameter ? parameters : `(${parameters})`;
        if (node.type) text += `: ${printInline(node.type)}`;
        const body =
          node.body.kind === TsNodeKind.ObjectLiteralExpression
            ? `(${printInline(node.body)})`
            : printInline(node.body);
        text += ` ${printInline(node.equalsGreaterThanToken)} ${body}`;
        push(text);
        break;
      }

      case TsNodeKind.AsExpression: {
        push(`${printInline(node.expression)} as ${printInline(node.type)}`);
        break;
      }

      case TsNodeKind.AwaitExpression: {
        push(`await ${printInline(node.expression)}`);
        break;
      }

      case TsNodeKind.BigIntLiteral: {
        push(node.text);
        break;
      }

      case TsNodeKind.BinaryExpression: {
        push(
          `${printInline(node.left)} ${printInline(node.operatorToken)} ${printInline(node.right)}`,
        );
        break;
      }

      case TsNodeKind.BindingElement: {
        let text = '';
        if (node.dotDotDotToken) text += printInline(node.dotDotDotToken);
        if (node.propertyName !== undefined) text += `${printInline(node.propertyName)}: `;
        text += typeof node.name === 'string' ? node.name : printInline(node.name);
        if (node.initializer) text += ` = ${printInline(node.initializer)}`;
        push(text);
        break;
      }

      case TsNodeKind.Block: {
        if (node.statements.length === 0) {
          push('{}');
          break;
        }
        const lines: Array<string> = ['{'];
        indentLevel += 1;
        for (const statement of node.statements) {
          lines.push(formatNode(statement));
        }
        indentLevel -= 1;
        lines.push(printLine('}'));
        push(lines.join('\n'));
        break;
      }

      case TsNodeKind.BreakStatement:
        push(
          printLine(
            node.label ? terminate(`break ${printInline(node.label)}`) : terminate('break'),
          ),
        );
        break;

      case TsNodeKind.CallExpression: {
        let text = printAccessTarget(node.expression);
        if (node.typeArguments && node.typeArguments.length > 0)
          text += `<${joinInline(node.typeArguments, ', ')}>`;
        const args = node.arguments;
        const argsLen = args.length;
        let hasCommentedArg = false;
        for (let i = 0; i < argsLen; i++) {
          if ((args[i] as TsNode).leadingComments?.length) {
            hasCommentedArg = true;
            break;
          }
        }
        if (hasCommentedArg) {
          const renderedArguments: Array<string> = new Array(argsLen);
          for (let i = 0; i < argsLen; i++) {
            const argument = args[i] as TsNode;
            const argumentParts: Array<string> = [];
            if (argument.leadingComments) printComments(argumentParts, argument.leadingComments);
            argumentParts.push(printLine(formatNode(argument, false, true)));
            renderedArguments[i] = fastJoin(argumentParts, '\n');
          }
          text += `(\n${fastJoin(renderedArguments, ',\n')})`;
        } else {
          text += `(${joinInline(args, ', ')})`;
        }
        push(text);
        break;
      }

      case TsNodeKind.CaseBlock:
        push(printBraceBlock(node.clauses));
        break;

      case TsNodeKind.CaseClause: {
        const lines: Array<string> = [printLine(`case ${printInline(node.expression)}:`)];
        indentLevel += 1;
        for (const statement of node.statements) {
          lines.push(formatNode(statement));
        }
        indentLevel -= 1;
        push(lines.join('\n'));
        break;
      }

      case TsNodeKind.CatchClause: {
        const binding = node.variableDeclaration
          ? ` (${printInline(node.variableDeclaration)})`
          : '';
        push(`catch${binding} ${printInline(node.block)}`);
        break;
      }

      case TsNodeKind.ClassDeclaration: {
        const decorators =
          node.modifiers?.filter((modifier) => modifier.kind === TsNodeKind.Decorator) ?? [];
        const keywordModifiers = node.modifiers?.filter(
          (modifier) => modifier.kind !== TsNodeKind.Decorator,
        );
        decorators.forEach((decorator) => push(printLine(printInline(decorator))));
        const modifiers = printModifiers(keywordModifiers);
        let heading = `${modifiers}class`;
        if (node.name) heading += ` ${printName(node.name)}`;
        heading += printTypeParameters(node.typeParameters);
        if (node.heritageClauses) {
          heading += joinBy(node.heritageClauses, '', printClassHeritageSuffix);
        }
        if (node.members.length === 0) {
          push(printLine(`${heading} {}`));
          break;
        }
        push(printLine(`${heading} {`));
        indentLevel += 1;
        node.members.forEach((member) => {
          // The DSL marks an explicit blank line between members with a lone-newline identifier.
          const marker = member as TsNode;
          if (marker.kind === TsNodeKind.Identifier && marker.text === '\n') {
            push(printLine(''));
            return;
          }
          push(formatNode(member));
        });
        indentLevel -= 1;
        push(printLine('}'));
        break;
      }

      case TsNodeKind.ClassExpression: {
        const decorators =
          node.modifiers?.filter((modifier) => modifier.kind === TsNodeKind.Decorator) ?? [];
        const keywordModifiers = node.modifiers?.filter(
          (modifier) => modifier.kind !== TsNodeKind.Decorator,
        );
        decorators.forEach((decorator) => push(printLine(printInline(decorator))));
        const modifiers = printModifiers(keywordModifiers);
        let heading = `${modifiers}class`;
        if (node.name) heading += ` ${printInline(node.name)}`;
        heading += printTypeParameters(node.typeParameters);
        if (node.heritageClauses) {
          heading += joinBy(node.heritageClauses, '', printClassHeritageSuffix);
        }
        if (node.members.length === 0) {
          push(`${heading} {}`);
          break;
        }
        push(`${heading} {`);
        indentLevel += 1;
        node.members.forEach((member) => {
          // The DSL marks an explicit blank line between members with a lone-newline identifier.
          const marker = member as TsNode;
          if (marker.kind === TsNodeKind.Identifier && marker.text === '\n') {
            push(printLine(''));
            return;
          }
          push(formatNode(member));
        });
        indentLevel -= 1;
        push(printLine('}'));
        break;
      }

      case TsNodeKind.ClassStaticBlockDeclaration:
        push(printLine(`static ${printInline(node.body)}`));
        break;

      case TsNodeKind.CommaListExpression: {
        push(joinInline(node.elements, ', '));
        break;
      }

      case TsNodeKind.ComputedPropertyName:
        push(`[${printInline(node.expression)}]`);
        break;

      case TsNodeKind.ConditionalExpression: {
        push(
          `${printInline(node.condition)} ${printInline(node.questionToken)} ${printInline(node.whenTrue)} ${printInline(node.colonToken)} ${printInline(node.whenFalse)}`,
        );
        break;
      }

      case TsNodeKind.ConditionalType: {
        push(
          `${printInline(node.checkType)} extends ${printInline(node.extendsType)} ? ${printInline(node.trueType)} : ${printInline(node.falseType)}`,
        );
        break;
      }

      case TsNodeKind.Constructor: {
        const modifiers = printModifiers(node.modifiers);
        const parameters = joinInline(node.parameters, ', ');
        const signature = `${modifiers}constructor(${parameters})`;
        push(
          printLine(node.body ? `${signature} ${printInline(node.body)}` : terminate(signature)),
        );
        break;
      }

      case TsNodeKind.ConstructorType: {
        const typeParameters =
          node.typeParameters && node.typeParameters.length > 0
            ? `<${joinInline(node.typeParameters, ', ')}>`
            : '';
        const parameters = joinInline(node.parameters, ', ');
        push(
          `${printModifiers(node.modifiers)}new ${typeParameters}(${parameters}) => ${printInline(node.type)}`,
        );
        break;
      }

      case TsNodeKind.ContinueStatement:
        push(
          printLine(
            node.label ? terminate(`continue ${printInline(node.label)}`) : terminate('continue'),
          ),
        );
        break;

      case TsNodeKind.DebuggerStatement:
        push(printLine(terminate('debugger')));
        break;

      case TsNodeKind.Decorator:
        push(`@${printInline(node.expression)}`);
        break;

      case TsNodeKind.DefaultClause: {
        const lines: Array<string> = [printLine('default:')];
        indentLevel += 1;
        for (const statement of node.statements) {
          lines.push(formatNode(statement));
        }
        indentLevel -= 1;
        push(lines.join('\n'));
        break;
      }

      case TsNodeKind.DeleteExpression: {
        push(`delete ${printInline(node.expression)}`);
        break;
      }

      case TsNodeKind.DoStatement:
        push(
          printLine(
            terminate(
              `do ${printEmbeddedStatement(node.statement)} while (${printInline(node.expression)})`,
            ),
          ),
        );
        break;

      case TsNodeKind.ElementAccessExpression:
        push(
          `${printAccessTarget(node.expression)}${node.questionDotToken ? '?.' : ''}[${printInline(node.argumentExpression)}]`,
        );
        break;

      case TsNodeKind.EmptyStatement:
        push(printLine(';'));
        break;

      case TsNodeKind.EnumDeclaration: {
        let header = '';
        if (node.modifiers?.length) {
          header += `${joinInline(node.modifiers, ' ')} `;
        }
        header += `enum ${printName(node.name)}`;
        if (node.members.length === 0) {
          push(printLine(`${header} {}`));
          break;
        }
        push(printLine(`${header} {`));
        indentLevel += 1;
        for (let i = 0, len = node.members.length; i < len; i++) {
          const text = formatNode(node.members[i] as TsNode);
          push(i < len - 1 ? `${text},` : text);
        }
        indentLevel -= 1;
        push(printLine('}'));
        break;
      }

      case TsNodeKind.EnumMember: {
        let text = printName(node.name);
        if (node.initializer) text += ` = ${printInline(node.initializer)}`;
        push(printLine(text));
        break;
      }

      case TsNodeKind.ExportAssignment: {
        let text = printModifiers(node.modifiers);
        text += node.isExportEquals ? 'export = ' : 'export default ';
        text += printInline(node.expression);
        push(printLine(terminate(text)));
        break;
      }

      case TsNodeKind.ExportDeclaration: {
        let text = 'export ';
        if (node.typeOnlyToken) text += `${printInline(node.typeOnlyToken)} `;
        text += node.exportClause ? printInline(node.exportClause) : '*';
        if (node.moduleSpecifier) text += ` from ${printInline(node.moduleSpecifier)}`;
        push(printLine(terminate(text)));
        break;
      }

      case TsNodeKind.ExportSpecifier: {
        let text = '';
        if (node.typeOnlyToken) text += `${printInline(node.typeOnlyToken)} `;
        if (node.propertyName) text += `${printInline(node.propertyName)} as `;
        text += printInline(node.name);
        push(text);
        break;
      }

      case TsNodeKind.ExpressionStatement:
        push(printLine(terminate(printInline(node.expression))));
        break;

      case TsNodeKind.ExpressionWithTypeArguments: {
        let text = printInline(node.expression);
        if (node.typeArguments && node.typeArguments.length > 0)
          text += `<${joinInline(node.typeArguments, ', ')}>`;
        push(text);
        break;
      }

      case TsNodeKind.ExternalModuleReference:
        push(`require(${printInline(node.expression)})`);
        break;

      case TsNodeKind.ForInStatement:
        push(
          printLine(
            `for (${printInline(node.initializer)} in ${printInline(node.expression)}) ${printEmbeddedStatement(node.statement)}`,
          ),
        );
        break;

      case TsNodeKind.ForOfStatement: {
        const awaitModifier = node.awaitModifier ? `${printInline(node.awaitModifier)} ` : '';
        push(
          printLine(
            `for ${awaitModifier}(${printInline(node.initializer)} of ${printInline(node.expression)}) ${printEmbeddedStatement(node.statement)}`,
          ),
        );
        break;
      }

      case TsNodeKind.ForStatement: {
        const initializer = node.initializer ? printInline(node.initializer) : '';
        const condition = node.condition ? printInline(node.condition) : '';
        const incrementor = node.incrementor ? printInline(node.incrementor) : '';
        push(
          printLine(
            `for (${initializer}; ${condition}; ${incrementor}) ${printEmbeddedStatement(node.statement)}`,
          ),
        );
        break;
      }

      case TsNodeKind.FunctionDeclaration: {
        const parameters = joinInline(node.parameters, ', ');
        let signature = `${printModifiers(node.modifiers)}function`;
        if (node.asteriskToken) signature += printInline(node.asteriskToken);
        if (node.name) signature += ` ${printInline(node.name)}`;
        signature += printTypeParameters(node.typeParameters);
        signature += `(${parameters})`;
        if (node.type) signature += `: ${printInline(node.type)}`;
        push(
          node.body
            ? `${printLine(signature)} ${printInline(node.body)}`
            : printLine(terminate(signature)),
        );
        break;
      }

      case TsNodeKind.FunctionExpression: {
        let text = printModifiers(node.modifiers);
        text += 'function';
        if (node.asteriskToken) text += printInline(node.asteriskToken);
        if (node.name) text += ` ${printInline(node.name)}`;
        text += printTypeParameters(node.typeParameters);
        const parameters = joinInline(node.parameters, ', ');
        text += `${node.name ? '' : ' '}(${parameters})`;
        if (node.type) text += `: ${printInline(node.type)}`;
        text += ` ${printInline(node.body)}`;
        push(text);
        break;
      }

      case TsNodeKind.FunctionType: {
        const typeParameters =
          node.typeParameters && node.typeParameters.length > 0
            ? `<${joinInline(node.typeParameters, ', ')}>`
            : '';
        const parameters = joinInline(node.parameters, ', ');
        push(`${typeParameters}(${parameters}) => ${printInline(node.type)}`);
        break;
      }

      case TsNodeKind.GetAccessor: {
        const modifiers = printModifiers(node.modifiers);
        const parameters = joinInline(node.parameters, ', ');
        let signature = `${modifiers}get ${printName(node.name)}(${parameters})`;
        if (node.type) signature += `: ${printInline(node.type)}`;
        push(
          printLine(node.body ? `${signature} ${printInline(node.body)}` : terminate(signature)),
        );
        break;
      }

      case TsNodeKind.HeritageClause: {
        const types = joinInline(node.types, ', ');
        push(`${TOKEN_TEXT[node.token.syntaxKind]} ${types}`);
        break;
      }

      case TsNodeKind.Identifier:
        push(node.text);
        break;

      case TsNodeKind.IfStatement: {
        let text = `if (${printInline(node.expression)}) ${printEmbeddedStatement(node.thenStatement)}`;
        if (node.elseStatement) {
          text += ` else ${printEmbeddedStatement(node.elseStatement)}`;
        }
        push(printLine(text));
        break;
      }

      case TsNodeKind.ImportClause: {
        const segments: Array<string> = [];
        if (node.phaseModifier) segments.push(printInline(node.phaseModifier));
        const names: Array<string> = [];
        if (node.name) names.push(printInline(node.name));
        if (node.namedBindings) names.push(printInline(node.namedBindings));
        segments.push(fastJoin(names, ', '));
        push(fastJoin(segments, ' '));
        break;
      }

      case TsNodeKind.ImportDeclaration: {
        let text = 'import ';
        if (node.importClause) text += `${printInline(node.importClause)} from `;
        text += printInline(node.moduleSpecifier);
        push(printLine(terminate(text)));
        break;
      }

      case TsNodeKind.ImportEqualsDeclaration: {
        let text = `${printModifiers(node.modifiers)}import `;
        if (node.typeOnlyToken) text += `${printInline(node.typeOnlyToken)} `;
        text += `${printInline(node.name)} = ${printInline(node.moduleReference)}`;
        push(printLine(terminate(text)));
        break;
      }

      case TsNodeKind.ImportSpecifier: {
        let text = '';
        if (node.typeOnlyToken) text += `${printInline(node.typeOnlyToken)} `;
        if (node.propertyName) text += `${printInline(node.propertyName)} as `;
        text += printInline(node.name);
        push(text);
        break;
      }

      case TsNodeKind.ImportType: {
        let text = `import(${printInline(node.argument)})`;
        if (node.qualifier) text += `.${printInline(node.qualifier)}`;
        if (node.typeArguments && node.typeArguments.length > 0) {
          text += `<${node.typeArguments.map((argument) => printInline(argument)).join(', ')}>`;
        }
        if (node.isTypeOf) text = `typeof ${text}`;
        push(text);
        break;
      }

      case TsNodeKind.IndexSignature: {
        let text = '';
        if (node.modifiers?.length) {
          text += `${joinInline(node.modifiers, ' ')} `;
        }
        const parameters = joinBy(node.parameters, ', ', printIndexParameter);
        text += `[${parameters}]: ${printInline(node.type)}`;
        push(printLine(terminate(text)));
        break;
      }

      case TsNodeKind.IndexedAccessType:
        push(`${printInline(node.objectType)}[${printInline(node.indexType)}]`);
        break;

      case TsNodeKind.InferType:
        push(`infer ${printInline(node.typeParameter)}`);
        break;

      case TsNodeKind.InterfaceDeclaration: {
        let header = '';
        if (node.modifiers?.length) {
          header += `${joinInline(node.modifiers, ' ')} `;
        }
        header += `interface ${node.name}`;
        if (node.typeParameters?.length) {
          header += `<${joinBy(node.typeParameters, ', ', printTypeParameterWithConstraint)}>`;
        }
        if (node.heritageClauses?.length) {
          header += joinBy(node.heritageClauses, '', printHeritageClauseSuffix);
        }
        if (node.members.length === 0) {
          push(printLine(`${header} {}`));
          break;
        }
        push(printLine(`${header} {`));
        indentLevel += 1;
        for (let i = 0, len = node.members.length; i < len; i++)
          push(formatNode(node.members[i] as TsNode));
        indentLevel -= 1;
        push(printLine('}'));
        break;
      }

      case TsNodeKind.IntersectionType:
        push(joinBy(node.types, ' & ', printIntersectionMember));
        break;

      case TsNodeKind.JSDoc: {
        const comment =
          typeof node.comment === 'string'
            ? node.comment
            : node.comment
              ? joinInline(node.comment, '')
              : '';
        const lines: Array<string> = comment ? comment.split('\n') : [];
        if (node.tags) {
          for (let i = 0, len = node.tags.length; i < len; i++)
            lines.push(`@${printInline(node.tags[i] as TsNode)}`);
        }
        if (lines.length === 0) {
          push(printLine('/** */'));
          break;
        }
        if (lines.length === 1) {
          push(printLine(`/** ${lines[0]} */`));
          break;
        }
        push(printLine('/**'));
        for (let i = 0, len = lines.length; i < len; i++) push(printLine(` * ${lines[i]}`));
        push(printLine(' */'));
        break;
      }

      case TsNodeKind.JSDocText:
        push(node.text);
        break;

      case TsNodeKind.JsxAttribute: {
        let text = printInline(node.name);
        if (node.initializer) {
          text +=
            node.initializer.kind === TsNodeKind.StringLiteral
              ? `="${node.initializer.text}"`
              : `=${printInline(node.initializer)}`;
        }
        push(text);
        break;
      }

      case TsNodeKind.JsxAttributes:
        push(node.properties.map((property) => printInline(property)).join(' '));
        break;

      case TsNodeKind.JsxClosingElement:
        push(`</${printInline(node.tagName)}>`);
        break;

      case TsNodeKind.JsxClosingFragment:
        push('</>');
        break;

      case TsNodeKind.JsxElement: {
        const lines: Array<string> = [printInline(node.openingElement)];
        indentLevel += 1;
        for (const child of node.children) lines.push(printLine(printInline(child)));
        indentLevel -= 1;
        lines.push(printLine(printInline(node.closingElement)));
        push(lines.join('\n'));
        break;
      }

      case TsNodeKind.JsxExpression: {
        const dotDotDot = node.dotDotDotToken ? '...' : '';
        const expression = node.expression ? printInline(node.expression) : '';
        push(`{${dotDotDot}${expression}}`);
        break;
      }

      case TsNodeKind.JsxFragment: {
        const lines: Array<string> = [printInline(node.openingFragment)];
        indentLevel += 1;
        for (const child of node.children) lines.push(printLine(printInline(child)));
        indentLevel -= 1;
        lines.push(printLine(printInline(node.closingFragment)));
        push(lines.join('\n'));
        break;
      }

      case TsNodeKind.JsxNamespacedName:
        push(`${printInline(node.namespace)}:${printInline(node.name)}`);
        break;

      case TsNodeKind.JsxOpeningElement: {
        let text = `<${printInline(node.tagName)}`;
        if (node.typeArguments && node.typeArguments.length > 0)
          text += `<${node.typeArguments.map((typeArgument) => printInline(typeArgument)).join(', ')}>`;
        const attributes = printInline(node.attributes);
        if (attributes) text += ` ${attributes}`;
        text += '>';
        push(text);
        break;
      }

      case TsNodeKind.JsxOpeningFragment:
        push('<>');
        break;

      case TsNodeKind.JsxSelfClosingElement: {
        let text = `<${printInline(node.tagName)}`;
        if (node.typeArguments && node.typeArguments.length > 0)
          text += `<${node.typeArguments.map((typeArgument) => printInline(typeArgument)).join(', ')}>`;
        const attributes = printInline(node.attributes);
        if (attributes) text += ` ${attributes}`;
        text += ' />';
        push(text);
        break;
      }

      case TsNodeKind.JsxSpreadAttribute:
        push(`{...${printInline(node.expression)}}`);
        break;

      case TsNodeKind.JsxText:
        push(node.text);
        break;

      case TsNodeKind.KeywordType:
        push(TOKEN_TEXT[node.syntaxKind]);
        break;

      case TsNodeKind.LabeledStatement:
        push(printLine(`${printInline(node.label)}: ${printEmbeddedStatement(node.statement)}`));
        break;

      case TsNodeKind.LiteralType:
        push(printInline(node.literal));
        break;

      case TsNodeKind.MappedType: {
        indentLevel += 1;
        let member = '';
        if (node.readonlyToken) {
          member +=
            node.readonlyToken.syntaxKind === SyntaxKind.ReadonlyKeyword
              ? 'readonly '
              : `${printInline(node.readonlyToken)}readonly `;
        }
        member += `[${printName(node.typeParameter.name)}`;
        if (node.typeParameter.constraint)
          member += ` in ${printInline(node.typeParameter.constraint)}`;
        if (node.nameType) member += ` as ${printInline(node.nameType)}`;
        member += ']';
        if (node.questionToken) {
          member +=
            node.questionToken.syntaxKind === SyntaxKind.QuestionToken
              ? '?'
              : `${printInline(node.questionToken)}?`;
        }
        if (node.type) member += `: ${printInline(node.type)}`;
        const memberLine = printLine(terminate(member));
        indentLevel -= 1;
        push(fastJoin(['{', memberLine, printLine('}')], '\n'));
        break;
      }

      case TsNodeKind.MetaProperty: {
        const keyword = node.keywordToken === SyntaxKind.ImportKeyword ? 'import' : 'new';
        push(`${keyword}.${printInline(node.name)}`);
        break;
      }

      case TsNodeKind.MethodDeclaration: {
        const modifiers = printModifiers(node.modifiers);
        const parameters = joinInline(node.parameters, ', ');
        let signature = modifiers;
        if (node.asteriskToken) signature += printInline(node.asteriskToken);
        signature += printName(node.name);
        if (node.questionToken) signature += printInline(node.questionToken);
        signature += printTypeParameters(node.typeParameters);
        signature += `(${parameters})`;
        if (node.type) signature += `: ${printInline(node.type)}`;
        push(
          printLine(node.body ? `${signature} ${printInline(node.body)}` : terminate(signature)),
        );
        break;
      }

      case TsNodeKind.ModuleBlock:
        push(printBraceBlock(node.statements));
        break;

      case TsNodeKind.ModuleDeclaration: {
        const keyword = node.name.kind === TsNodeKind.StringLiteral ? 'module' : 'namespace';
        let header = `${printModifiers(node.modifiers)}${keyword} ${printInline(node.name)}`;
        if (node.body) header += ` ${printInline(node.body)}`;
        push(printLine(header));
        break;
      }

      case TsNodeKind.NamedExports:
        push(node.elements.length === 0 ? '{}' : `{ ${joinInline(node.elements, ', ')} }`);
        break;

      case TsNodeKind.NamedImports:
        push(node.elements.length === 0 ? '{}' : `{ ${joinInline(node.elements, ', ')} }`);
        break;

      case TsNodeKind.NamedTupleMember: {
        let text = '';
        if (node.dotDotDotToken) text += printInline(node.dotDotDotToken);
        text += printName(node.name);
        if (node.questionToken) text += printInline(node.questionToken);
        text += `: ${printInline(node.type)}`;
        push(text);
        break;
      }

      case TsNodeKind.NamespaceExport:
        push(`* as ${printInline(node.name)}`);
        break;

      case TsNodeKind.NamespaceImport:
        push(`* as ${printInline(node.name)}`);
        break;

      case TsNodeKind.NewExpression: {
        let text = `new ${printAccessTarget(node.expression)}`;
        if (node.typeArguments && node.typeArguments.length > 0)
          text += `<${joinInline(node.typeArguments, ', ')}>`;
        text += `(${joinInline(node.arguments ?? [], ', ')})`;
        push(text);
        break;
      }

      case TsNodeKind.NoSubstitutionTemplateLiteral: {
        push(`\`${formatTemplateText(node.text)}\``);
        break;
      }

      case TsNodeKind.NonNullExpression:
        push(`${printAccessTarget(node.expression)}!`);
        break;

      case TsNodeKind.NumericLiteral:
        push(node.text);
        break;

      case TsNodeKind.ObjectBindingPattern: {
        const elements = joinInline(node.elements, ', ');
        push(`{ ${elements} }`);
        break;
      }

      case TsNodeKind.ObjectLiteralExpression: {
        if (node.properties.length === 0) {
          push('{}');
          break;
        }
        if (node.multiLine) {
          const lines: Array<string> = ['{'];
          indentLevel += 1;
          for (let i = 0, len = node.properties.length; i < len; i++) {
            const text = printLine(printInline(node.properties[i] as TsNode));
            lines.push(i < len - 1 ? `${text},` : text);
          }
          indentLevel -= 1;
          lines.push(printLine('}'));
          push(fastJoin(lines, '\n'));
          break;
        }
        indentLevel += 1;
        const properties = joinInline(node.properties, ', ');
        indentLevel -= 1;
        push(`{ ${properties} }`);
        break;
      }

      case TsNodeKind.OmittedExpression:
        push('');
        break;

      case TsNodeKind.OptionalType:
        push(`${printInline(node.type)}?`);
        break;

      case TsNodeKind.Parameter: {
        let text = printModifiers(node.modifiers);
        if (node.dotDotDotToken) text += printInline(node.dotDotDotToken);
        text += typeof node.name === 'string' ? node.name : printInline(node.name);
        if (node.questionToken) text += printInline(node.questionToken);
        if (node.type) text += `: ${printInline(node.type)}`;
        if (node.initializer) text += ` = ${printInline(node.initializer)}`;
        push(text);
        break;
      }

      case TsNodeKind.ParenthesizedExpression:
        push(`(${printInline(node.expression)})`);
        break;

      case TsNodeKind.ParenthesizedType:
        push(`(${printInline(node.type)})`);
        break;

      case TsNodeKind.PostfixUnaryExpression: {
        push(`${printInline(node.operand)}${TOKEN_TEXT[node.operator]}`);
        break;
      }

      case TsNodeKind.PrefixUnaryExpression: {
        push(`${TOKEN_TEXT[node.operator]}${printInline(node.operand)}`);
        break;
      }

      case TsNodeKind.PrivateIdentifier: {
        push(node.text);
        break;
      }

      case TsNodeKind.PropertyAccessExpression:
        push(
          `${printAccessTarget(node.expression)}${node.questionDotToken ? '?.' : '.'}${printInline(node.name)}`,
        );
        break;

      case TsNodeKind.PropertyAssignment:
        push(`${printInline(node.name)}: ${printInline(node.initializer)}`);
        break;

      case TsNodeKind.PropertyDeclaration: {
        const modifiers = printModifiers(node.modifiers);
        let text = `${modifiers}${printName(node.name)}`;
        if (node.questionToken) text += printInline(node.questionToken);
        if (node.exclamationToken) text += printInline(node.exclamationToken);
        if (node.type) text += `: ${printInline(node.type)}`;
        if (node.initializer) text += ` = ${printInline(node.initializer)}`;
        push(printLine(terminate(text)));
        break;
      }

      case TsNodeKind.PropertySignature: {
        let text = '';
        if (node.modifiers?.length) {
          text += `${joinInline(node.modifiers, ' ')} `;
        }
        text += printName(node.name);
        if (node.questionToken) text += printInline(node.questionToken);
        if (node.type) text += `: ${printInline(node.type)}`;
        push(printLine(terminate(text)));
        break;
      }

      case TsNodeKind.QualifiedName:
        push(`${printInline(node.left)}.${printInline(node.right)}`);
        break;

      case TsNodeKind.RegularExpressionLiteral: {
        push(node.text);
        break;
      }

      case TsNodeKind.RestType:
        push(`...${printInline(node.type)}`);
        break;

      case TsNodeKind.ReturnStatement:
        push(
          printLine(
            node.expression
              ? terminate(`return ${printInline(node.expression)}`)
              : terminate('return'),
          ),
        );
        break;

      case TsNodeKind.SatisfiesExpression: {
        push(`${printInline(node.expression)} satisfies ${printInline(node.type)}`);
        break;
      }

      case TsNodeKind.SetAccessor: {
        const modifiers = printModifiers(node.modifiers);
        const parameters = joinInline(node.parameters, ', ');
        const signature = `${modifiers}set ${printName(node.name)}(${parameters})`;
        push(
          printLine(node.body ? `${signature} ${printInline(node.body)}` : terminate(signature)),
        );
        break;
      }

      case TsNodeKind.ShorthandPropertyAssignment: {
        let text = printInline(node.name);
        if (node.objectAssignmentInitializer) {
          text += ` = ${printInline(node.objectAssignmentInitializer)}`;
        }
        push(text);
        break;
      }

      case TsNodeKind.SourceFile: {
        for (let i = 0, len = node.statements.length; i < len; i++) {
          if (i > 0) push('');
          push(formatNode(node.statements[i] as TsNode));
        }
        break;
      }

      case TsNodeKind.SpreadAssignment:
        push(`...${printInline(node.expression)}`);
        break;

      case TsNodeKind.SpreadElement: {
        push(`...${printInline(node.expression)}`);
        break;
      }

      case TsNodeKind.StringLiteral:
        push(formatStringLiteral(node.text));
        break;

      case TsNodeKind.SwitchStatement: {
        push(printLine(`switch (${printInline(node.expression)}) ${printInline(node.caseBlock)}`));
        break;
      }

      case TsNodeKind.TaggedTemplateExpression: {
        let text = printInline(node.tag);
        if (node.typeArguments && node.typeArguments.length > 0)
          text += `<${joinInline(node.typeArguments, ', ')}>`;
        text += printInline(node.template);
        push(text);
        break;
      }

      case TsNodeKind.TemplateExpression: {
        const spans = joinInline(node.templateSpans, '');
        push(`${printInline(node.head)}${spans}`);
        break;
      }

      case TsNodeKind.TemplateHead:
        push(`\`${formatTemplateText(node.text)}${'${'}`);
        break;

      case TsNodeKind.TemplateLiteralType: {
        let text = `\`${node.head.text}`;
        for (let i = 0, len = node.templateSpans.length; i < len; i++)
          text += printInline(node.templateSpans[i] as TsNode);
        push(`${text}\``);
        break;
      }

      case TsNodeKind.TemplateLiteralTypeSpan:
        push(`\${${printInline(node.type)}}${node.literal.text}`);
        break;

      case TsNodeKind.TemplateMiddle:
        push(`}${formatTemplateText(node.text)}${'${'}`);
        break;

      case TsNodeKind.TemplateSpan:
        push(`${printInline(node.expression)}${printInline(node.literal)}`);
        break;

      case TsNodeKind.TemplateTail:
        push(`}${formatTemplateText(node.text)}\``);
        break;

      case TsNodeKind.ThisType:
        push('this');
        break;

      case TsNodeKind.ThrowStatement:
        push(printLine(terminate(`throw ${printInline(node.expression)}`)));
        break;

      case TsNodeKind.Token:
        push(TOKEN_TEXT[node.syntaxKind]);
        break;

      case TsNodeKind.TryStatement: {
        let text = `try ${printInline(node.tryBlock)}`;
        if (node.catchClause) text += ` ${printInline(node.catchClause)}`;
        if (node.finallyBlock) text += ` finally ${printInline(node.finallyBlock)}`;
        push(printLine(text));
        break;
      }

      case TsNodeKind.TupleType: {
        if (node.elements.length === 0) {
          push('[]');
          break;
        }
        const lines: Array<string> = ['['];
        indentLevel += 1;
        for (let i = 0, len = node.elements.length; i < len; i++) {
          const text = printLine(printInline(node.elements[i] as TsNode));
          lines.push(i < len - 1 ? `${text},` : text);
        }
        indentLevel -= 1;
        lines.push(printLine(']'));
        push(fastJoin(lines, '\n'));
        break;
      }

      case TsNodeKind.TypeAliasDeclaration: {
        let header = '';
        if (node.modifiers?.length) {
          header += `${joinInline(node.modifiers, ' ')} `;
        }
        header += `type ${printName(node.name)}`;
        if (node.typeParameters?.length) {
          header += `<${joinBy(node.typeParameters, ', ', printTypeParameterWithConstraint)}>`;
        }
        push(printLine(terminate(`${header} = ${printInline(node.type)}`)));
        break;
      }

      case TsNodeKind.TypeLiteral: {
        if (node.members.length === 0) {
          push('{}');
          break;
        }
        const lines: Array<string> = ['{'];
        indentLevel += 1;
        for (let i = 0, len = node.members.length; i < len; i++) {
          lines.push(formatNode(node.members[i] as TsNode));
        }
        indentLevel -= 1;
        lines.push(printLine('}'));
        push(fastJoin(lines, '\n'));
        break;
      }

      case TsNodeKind.TypeOfExpression: {
        push(`typeof ${printInline(node.expression)}`);
        break;
      }

      case TsNodeKind.TypeOperator:
        push(`${TOKEN_TEXT[node.operator]} ${printInline(node.type)}`);
        break;

      case TsNodeKind.TypeParameter: {
        const modifiers = node.modifiers
          ? joinBy(node.modifiers, '', printTokenWithTrailingSpace)
          : '';
        let text = `${modifiers}${printName(node.name)}`;
        if (node.constraint) text += ` extends ${printInline(node.constraint)}`;
        if (node.default) text += ` = ${printInline(node.default)}`;
        push(text);
        break;
      }

      case TsNodeKind.TypePredicate: {
        let text = '';
        if (node.assertsModifier) text += 'asserts ';
        text += printName(node.parameterName);
        if (node.type) text += ` is ${printInline(node.type)}`;
        push(text);
        break;
      }

      case TsNodeKind.TypeQuery: {
        let text = `typeof ${typeof node.exprName === 'string' ? node.exprName : printInline(node.exprName)}`;
        if (node.typeArguments && node.typeArguments.length > 0) {
          text += `<${joinInline(node.typeArguments, ', ')}>`;
        }
        push(text);
        break;
      }

      case TsNodeKind.TypeReference: {
        const name = typeof node.typeName === 'string' ? node.typeName : printInline(node.typeName);
        const typeArguments =
          node.typeArguments && node.typeArguments.length > 0
            ? `<${joinInline(node.typeArguments, ', ')}>`
            : '';
        push(`${name}${typeArguments}`);
        break;
      }

      case TsNodeKind.UnionType:
        push(joinBy(node.types, ' | ', printUnionMember));
        break;

      case TsNodeKind.VariableDeclaration: {
        let text = printName(node.name);
        if (node.exclamationToken) text += printInline(node.exclamationToken);
        if (node.type) text += `: ${printInline(node.type)}`;
        if (node.initializer) text += ` = ${printInline(node.initializer)}`;
        push(text);
        break;
      }

      case TsNodeKind.VariableDeclarationList: {
        const keyword =
          node.flags === TsNodeFlags.Const
            ? 'const'
            : node.flags === TsNodeFlags.Let
              ? 'let'
              : 'var';
        const declarations = joinInline(node.declarations, ', ');
        push(`${keyword} ${declarations}`);
        break;
      }

      case TsNodeKind.VariableStatement:
        push(
          printLine(
            terminate(`${printModifiers(node.modifiers)}${printInline(node.declarationList)}`),
          ),
        );
        break;

      case TsNodeKind.VoidExpression: {
        push(`void ${printInline(node.expression)}`);
        break;
      }

      case TsNodeKind.WhileStatement:
        push(
          printLine(
            `while (${printInline(node.expression)}) ${printEmbeddedStatement(node.statement)}`,
          ),
        );
        break;

      case TsNodeKind.WithStatement:
        push(
          printLine(
            `with (${printInline(node.expression)}) ${printEmbeddedStatement(node.statement)}`,
          ),
        );
        break;

      case TsNodeKind.YieldExpression: {
        let text = 'yield';
        if (node.asteriskToken) text += printInline(node.asteriskToken);
        if (node.expression) text += ` ${printInline(node.expression)}`;
        push(text);
        break;
      }

      default:
        // The switch is exhaustive over `TsNodeKind`, so `node` narrows to
        // `never` here; this only fires for a malformed node at runtime.
        throw new Error(`Unsupported node kind: ${(node as TsNode).kind}`);
    }

    if (node.trailingComments) {
      if (!inline) {
        push('');
      }
      if (!accParts) accParts = accSingle === undefined ? [] : [accSingle];
      printComments(accParts, node.trailingComments, false);
    }

    const result = accParts ? fastJoin(accParts, '\n') : (accSingle ?? '');
    accSingle = savedSingle;
    accParts = savedParts;
    return result;
  }

  function format(node: TsNode): string {
    const text = formatNode(node);
    return text === '' ? '' : `${text}\n`;
  }

  return {
    format,
    formatNode,
  };
}
