import type { PyNode } from './nodes/base';
import { PyNodeKind } from './nodes/kinds';

export type QuoteStyle = 'single' | 'double';
export type QuoteFallback = 'avoid-escape' | 'escape';

export type PyPrinterOptions = {
  /**
   * Number of spaces per indentation level.
   *
   * @default 4
   */
  indentSize?: number;
  /**
   * How to handle strings that contain the preferred quote character.
   * - `'avoid-escape'`: switch to the alternative quote style to avoid
   *   escaping, unless the string contains both quote characters
   * - `'escape'`: always use the preferred quote style, escaping conflicts
   *   with a backslash
   *
   * @default 'avoid-escape'
   */
  quoteConflict?: QuoteFallback;
  /**
   * Preferred string quote character.
   *
   * @default 'double'
   */
  quoteStyle?: QuoteStyle;
};

export type PyPrinter = {
  format: (node: PyNode) => string;
  formatNode: (node: PyNode) => string;
};

const DEFAULT_INDENT_SIZE = 4;
const DEFAULT_QUOTE_STYLE: QuoteStyle = 'double';
const DEFAULT_QUOTE_CONFLICT: QuoteFallback = 'avoid-escape';
const PARAMS_MULTILINE_THRESHOLD = 3;

const backslashEscapeNeeded = /\\/;

function escapeBackslashes(value: string): string {
  const match = backslashEscapeNeeded.exec(value);
  if (match === null) return value;

  let result = value.slice(0, match.index);
  let runStart = match.index;

  for (let i = match.index, len = value.length; i < len; i++) {
    if (value.charCodeAt(i) !== 92) continue; // \
    if (runStart !== i) result += value.slice(runStart, i);
    result += '\\\\';
    runStart = i + 1;
  }

  if (runStart !== value.length) result += value.slice(runStart);
  return result;
}

export function createPrinter(options?: PyPrinterOptions): PyPrinter {
  const indentUnit = ' '.repeat(options?.indentSize ?? DEFAULT_INDENT_SIZE);
  const quoteStyle = options?.quoteStyle ?? DEFAULT_QUOTE_STYLE;
  const quoteConflict = options?.quoteConflict ?? DEFAULT_QUOTE_CONFLICT;
  let indentLevel = 0;

  function selectQuote(value: string): { conflict: boolean; quote: string } {
    const preferred = quoteStyle === 'double' ? '"' : "'";
    const alternative = quoteStyle === 'double' ? "'" : '"';

    const hasPreferred = value.includes(preferred);
    const hasAlternative = value.includes(alternative);

    if (quoteConflict === 'escape' || (hasPreferred && hasAlternative)) {
      return { conflict: true, quote: preferred };
    }

    return { conflict: false, quote: hasPreferred ? alternative : preferred };
  }

  function createStringLiteral(value: string): string {
    const result = selectQuote(value);
    if (result.conflict) {
      // `selectQuote` already confirmed `result.quote` occurs in `value` (via
      // `.includes`), so unlike a general-purpose escaper there's no need to
      // scan for a first-match index — go straight to the char-by-char pass,
      // copying unescaped runs in bulk (via `runStart`) and only paying extra
      // for the quote character itself.
      const quoteCode = result.quote.charCodeAt(0);
      const escape = `\\${result.quote}`;
      let escaped = '';
      let runStart = 0;
      for (let i = 0, len = value.length; i < len; i++) {
        if (value.charCodeAt(i) !== quoteCode) continue;
        if (runStart !== i) escaped += value.slice(runStart, i);
        escaped += escape;
        runStart = i + 1;
      }
      if (runStart !== value.length) escaped += value.slice(runStart);
      return `${result.quote}${escaped}${result.quote}`;
    }
    return `${result.quote}${value}${result.quote}`;
  }

  function printComments(
    parts: Array<string>,
    lines: ReadonlyArray<string>,
    indent?: boolean,
  ): void {
    if (indent) indentLevel += 1;
    parts.push(...lines.map((line) => printLine(`# ${line}`)));
    if (indent) indentLevel -= 1;
  }

  function printDocstring(docstring: string): Array<string> {
    const lines = docstring.split('\n');
    const parts: Array<string> = [];
    if (lines.length === 1) {
      parts.push(printLine(`"""${lines[0]}"""`), '');
    } else {
      parts.push(printLine(`"""${lines[0]}`));
      parts.push(...lines.slice(1).map((line) => printLine(line)));
      parts.push(printLine(`"""`), '');
    }
    return parts;
  }

  function printLine(line: string): string {
    if (line === '') return '';
    return indentUnit.repeat(indentLevel) + line;
  }

  function formatNode(node: PyNode): string {
    const parts: Array<string> = [];

    if (node.leadingComments) {
      printComments(parts, node.leadingComments);
    }

    let indentTrailingComments = false;

    switch (node.kind) {
      case PyNodeKind.Assignment: {
        const target = formatNode(node.target);
        if (node.type) {
          const type = formatNode(node.type);
          if (node.value) {
            parts.push(printLine(`${target}: ${type} = ${formatNode(node.value)}`));
          } else {
            parts.push(printLine(`${target}: ${type}`));
          }
        } else {
          parts.push(printLine(`${target} = ${formatNode(node.value!)}`));
        }
        break;
      }

      case PyNodeKind.AsyncExpression:
        parts.push(`async ${formatNode(node.expression)}`);
        break;

      case PyNodeKind.AugmentedAssignment:
        parts.push(
          printLine(`${formatNode(node.target)} ${node.operator} ${formatNode(node.value)}`),
        );
        break;

      case PyNodeKind.AwaitExpression:
        parts.push(`await ${formatNode(node.expression)}`);
        break;

      case PyNodeKind.BinaryExpression:
        parts.push(`${formatNode(node.left)} ${node.operator} ${formatNode(node.right)}`);
        break;

      case PyNodeKind.Block:
        indentLevel += 1;
        if (node.statements.length) {
          parts.push(...node.statements.map(formatNode));
        } else {
          parts.push(printLine('pass'));
        }
        indentLevel -= 1;
        break;

      case PyNodeKind.BreakStatement:
        parts.push(printLine('break'));
        break;

      case PyNodeKind.CallExpression:
        parts.push(`${formatNode(node.callee)}(${node.args.map(formatNode).join(', ')})`);
        break;

      case PyNodeKind.ClassDeclaration: {
        indentTrailingComments = true;
        if (node.decorators) {
          parts.push(...node.decorators.map((decorator) => printLine(`@${formatNode(decorator)}`)));
        }
        const bases = node.baseClasses?.length
          ? `(${node.baseClasses.map(formatNode).join(', ')})`
          : '';
        parts.push(printLine(`class ${node.name}${bases}:`));
        if (node.docstring) {
          indentLevel += 1;
          parts.push(...printDocstring(node.docstring));
          indentLevel -= 1;
        }
        parts.push(formatNode(node.body));
        break;
      }

      case PyNodeKind.Comment:
        parts.push(printLine(`# ${node.text}`));
        break;

      case PyNodeKind.ContinueStatement:
        parts.push(printLine('continue'));
        break;

      case PyNodeKind.DictComprehension: {
        const asyncPrefix = node.isAsync ? 'async ' : '';
        const children: Array<string> = [
          `${formatNode(node.key)}: ${formatNode(node.value)} ${asyncPrefix}for ${formatNode(node.target)} in ${formatNode(node.iterable)}`,
        ];
        if (node.ifs) {
          for (const condition of node.ifs) {
            children.push(`if ${formatNode(condition)}`);
          }
        }
        parts.push(`{${children.join(' ')}}`);
        break;
      }

      case PyNodeKind.DictExpression: {
        const entries = node.entries
          .map(({ key, value }) => `${formatNode(key)}: ${formatNode(value)}`)
          .join(', ');
        parts.push(`{${entries}}`);
        break;
      }

      case PyNodeKind.EmptyStatement:
        parts.push('');
        break;

      case PyNodeKind.ExpressionStatement:
        parts.push(printLine(formatNode(node.expression)));
        break;

      case PyNodeKind.ForStatement:
        parts.push(printLine(`for ${formatNode(node.target)} in ${formatNode(node.iterable)}:`));
        parts.push(formatNode(node.body));
        if (node.elseBlock) {
          parts.push(`${printLine('else:')}`);
          parts.push(`${formatNode(node.elseBlock)}`);
        }
        break;

      case PyNodeKind.FStringExpression: {
        const children = node.parts.map((part) =>
          typeof part === 'string' ? part : `{${formatNode(part)}}`,
        );
        parts.push(`f${createStringLiteral(children.join(''))}`);
        break;
      }

      case PyNodeKind.FunctionDeclaration: {
        if (node.decorators) {
          parts.push(...node.decorators.map((decorator) => printLine(`@${formatNode(decorator)}`)));
        }
        const modifiers = node.modifiers?.map(formatNode).join(' ') ?? '';
        const defPrefix = modifiers ? `${modifiers} def` : 'def';
        const formatParameter = (parameter: (typeof node.parameters)[number]): string => {
          const children: Array<string> = [parameter.name];
          if (parameter.type) children.push(`: ${formatNode(parameter.type)}`);
          if (parameter.defaultValue) children.push(` = ${formatNode(parameter.defaultValue)}`);
          return children.join('');
        };
        const returnAnnotation = node.returnType ? ` -> ${formatNode(node.returnType)}` : '';
        const preParams = `${defPrefix} ${node.name}(`;
        const postParams = `)${returnAnnotation}:`;

        if (node.parameters.length > PARAMS_MULTILINE_THRESHOLD) {
          parts.push(printLine(preParams));
          indentLevel += 1;
          const params = node.parameters.map((parameter) =>
            printLine(`${formatParameter(parameter)},`),
          );
          parts.push(...params);
          indentLevel -= 1;
          parts.push(printLine(postParams));
        } else {
          const parameters = node.parameters.map((parameter) => formatParameter(parameter));
          const params = parameters.join(', ');
          parts.push(printLine(`${preParams}${params}${postParams}`));
        }

        if (node.docstring) {
          indentLevel += 1;
          parts.push(...printDocstring(node.docstring));
          indentLevel -= 1;
        }
        parts.push(formatNode(node.body));
        break;
      }

      case PyNodeKind.GeneratorExpression: {
        const asyncPrefix = node.isAsync ? 'async ' : '';
        const children: Array<string> = [
          `${formatNode(node.element)} ${asyncPrefix}for ${formatNode(node.target)} in ${formatNode(node.iterable)}`,
        ];
        if (node.ifs) {
          for (const condition of node.ifs) {
            children.push(`if ${formatNode(condition)}`);
          }
        }
        parts.push(`(${children.join(' ')})`);
        break;
      }

      case PyNodeKind.Identifier:
        parts.push(node.name);
        break;

      case PyNodeKind.IfStatement:
        parts.push(printLine(`if ${formatNode(node.condition)}:`));
        parts.push(`${formatNode(node.thenBlock)}`);
        if (node.elseBlock) {
          parts.push(`${printLine('else:')}`);
          parts.push(`${formatNode(node.elseBlock)}`);
        }
        break;

      case PyNodeKind.KeywordArgument:
        parts.push(`${node.name}=${formatNode(node.value)}`);
        break;

      case PyNodeKind.ImportStatement: {
        const fromPrefix = node.isFrom ? `from ${node.module} ` : '';
        if (fromPrefix) {
          if (node.names && node.names.length) {
            const imports = node.names
              .map(({ alias, name }) => (alias ? `${name} as ${alias}` : name))
              .join(', ');
            parts.push(printLine(`${fromPrefix}import ${imports}`));
          } else {
            parts.push(printLine(`${fromPrefix}import *`));
          }
        } else {
          if (node.names && node.names.length) {
            const imports = node.names
              .map(({ alias, name }) => (alias ? `${name} as ${alias}` : name))
              .join(', ');
            parts.push(printLine(`import ${imports}`));
          } else {
            parts.push(printLine(`import ${node.module}`));
          }
        }
        break;
      }

      case PyNodeKind.LambdaExpression: {
        const parameters = node.parameters.map((parameter) => {
          const children: Array<string> = [parameter.name];
          if (parameter.type) children.push(`: ${formatNode(parameter.type)}`);
          if (parameter.defaultValue) children.push(` = ${formatNode(parameter.defaultValue)}`);
          return children.join('');
        });
        parts.push(`lambda ${parameters.join(', ')}: ${formatNode(node.expression)}`);
        break;
      }

      case PyNodeKind.ListComprehension: {
        const asyncPrefix = node.isAsync ? 'async ' : '';
        const children: Array<string> = [
          `${formatNode(node.element)} ${asyncPrefix}for ${formatNode(node.target)} in ${formatNode(node.iterable)}`,
        ];
        if (node.ifs) {
          for (const condition of node.ifs) {
            children.push(`if ${formatNode(condition)}`);
          }
        }
        parts.push(`[${children.join(' ')}]`);
        break;
      }

      case PyNodeKind.ListExpression:
        parts.push(`[${node.elements.map(formatNode).join(', ')}]`);
        break;

      case PyNodeKind.Literal:
        if (typeof node.value === 'string') {
          if (node.value.includes('\n')) {
            const { quote } = selectQuote(node.value);
            const tripleQuote = quote.repeat(3);
            const escaped = escapeBackslashes(node.value).replaceAll(
              tripleQuote,
              `\\${quote}${quote}${quote}`,
            );
            parts.push(`${tripleQuote}${escaped}${tripleQuote}`);
          } else {
            parts.push(createStringLiteral(node.value));
          }
        } else if (typeof node.value === 'boolean') {
          parts.push(node.value ? 'True' : 'False');
        } else if (node.value === null) {
          parts.push('None');
        } else {
          parts.push(String(node.value));
        }
        break;

      case PyNodeKind.MemberExpression:
        parts.push(`${formatNode(node.object)}.${formatNode(node.member)}`);
        break;

      case PyNodeKind.RaiseStatement:
        if (node.expression) {
          parts.push(printLine(`raise ${formatNode(node.expression)}`));
        } else {
          parts.push(printLine('raise'));
        }
        break;

      case PyNodeKind.RStringExpression: {
        const trailingBackslashes = node.value.match(/\\+$/);
        const endsWithOddBackslashes =
          trailingBackslashes !== null &&
          trailingBackslashes !== undefined &&
          trailingBackslashes[0].length % 2 !== 0;
        if (endsWithOddBackslashes) {
          parts.push(createStringLiteral(escapeBackslashes(node.value)));
          break;
        }
        const result = selectQuote(node.value);
        if (result.conflict) {
          const tripleQuote = result.quote.repeat(3);
          if (node.value.includes(tripleQuote)) {
            parts.push(createStringLiteral(escapeBackslashes(node.value)));
          } else {
            parts.push(`r${tripleQuote}${node.value}${tripleQuote}`);
          }
        } else {
          parts.push(`r${result.quote}${node.value}${result.quote}`);
        }
        break;
      }

      case PyNodeKind.ReturnStatement:
        if (node.expression) {
          parts.push(printLine(`return ${formatNode(node.expression)}`));
        } else {
          parts.push(printLine('return'));
        }
        break;

      case PyNodeKind.SetComprehension: {
        const asyncPrefix = node.isAsync ? 'async ' : '';
        const children: Array<string> = [
          `${formatNode(node.element)} ${asyncPrefix}for ${formatNode(node.target)} in ${formatNode(node.iterable)}`,
        ];
        if (node.ifs) {
          for (const condition of node.ifs) {
            children.push(`if ${formatNode(condition)}`);
          }
        }
        parts.push(`{${children.join(' ')}}`);
        break;
      }

      case PyNodeKind.SetExpression: {
        if (!node.elements.length) {
          parts.push('set()');
        } else {
          parts.push(`{${node.elements.map(formatNode).join(', ')}}`);
        }
        break;
      }

      case PyNodeKind.SourceFile:
        if (node.docstring) {
          parts.push(...printDocstring(node.docstring));
        }
        parts.push(...node.statements.map(formatNode));
        break;

      case PyNodeKind.SubscriptExpression:
        parts.push(`${formatNode(node.value)}[${formatNode(node.slice)}]`);
        break;

      case PyNodeKind.SubscriptSlice:
        parts.push(node.elements.map(formatNode).join(', '));
        break;

      case PyNodeKind.TryStatement: {
        parts.push(printLine('try:'), formatNode(node.tryBlock));
        if (node.exceptClauses) {
          for (const clause of node.exceptClauses) {
            const type = clause.exceptionType ? ` ${formatNode(clause.exceptionType)}` : '';
            const name = clause.exceptionName ? ` as ${formatNode(clause.exceptionName)}` : '';
            parts.push(printLine(`except${type}${name}:`), formatNode(clause.block));
          }
        }
        if (node.elseBlock) {
          parts.push(printLine(`else:`), formatNode(node.elseBlock));
        }
        if (node.finallyBlock) {
          parts.push(printLine(`finally:`), formatNode(node.finallyBlock));
        }
        break;
      }

      case PyNodeKind.TupleExpression: {
        // Single-element tuple needs trailing comma
        const trailingComma = node.elements.length === 1 ? ',' : '';
        parts.push(`(${node.elements.map(formatNode).join(', ')}${trailingComma})`);
        break;
      }

      case PyNodeKind.WhileStatement: {
        parts.push(printLine(`while ${formatNode(node.condition)}:`));
        parts.push(formatNode(node.body));
        if (node.elseBlock) {
          parts.push(`${printLine('else:')}`);
          parts.push(`${formatNode(node.elseBlock)}`);
        }
        break;
      }

      case PyNodeKind.WithStatement: {
        const modifiers = node.modifiers?.map(formatNode).join(' ') ?? '';
        const withPrefix = modifiers ? `${modifiers} with` : 'with';
        const items = node.items
          .map((item) =>
            item.alias
              ? `${formatNode(item.contextExpr)} as ${formatNode(item.alias)}`
              : formatNode(item.contextExpr),
          )
          .join(', ');
        parts.push(printLine(`${withPrefix} ${items}:`));
        parts.push(formatNode(node.body));
        break;
      }

      case PyNodeKind.YieldExpression:
        if (node.value) {
          parts.push(`yield ${formatNode(node.value)}`);
        } else {
          parts.push('yield');
        }
        break;

      case PyNodeKind.YieldFromExpression:
        parts.push(`yield from ${formatNode(node.expression)}`);
        break;

      default:
        throw new Error(`Unsupported node kind: ${(node as { kind: string }).kind}`);
    }

    if (node.trailingComments) {
      printComments(parts, node.trailingComments, indentTrailingComments);
    }

    return parts.join('\n');
  }

  function format(node: PyNode): string {
    const text = formatNode(node);
    return text === '' ? '' : `${text}\n`;
  }

  return {
    format,
    formatNode,
  };
}
