import colors from 'ansi-colors';

import type { Context } from '../../../ir/context';

export interface ValidatorIssue {
  /**
   * Machine-readable issue code
   *
   * @example
   * 'invalid_type'
   */
  code: 'duplicate_key' | 'invalid_type' | 'missing_required_field';
  /**
   * Optional additional data.
   *
   * @example
   * 'expectedType'
   */
  context?: Record<string, any>;
  /**
   * Human-readable issue summary.
   */
  message: string;
  /**
   * JSONPath-like array to issue location.
   */
  path: ReadonlyArray<string | number>;
  /**
   * Error severity.
   */
  severity: 'error' | 'warning';
}

export interface ValidatorResult {
  issues: ReadonlyArray<ValidatorIssue>;
  valid: boolean;
}

const isSimpleKey = (key: string) => /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key);

const formatPath = (path: ReadonlyArray<string | number>): string =>
  path
    .map((segment, i) => {
      if (typeof segment === 'number') {
        return `[${segment}]`;
      }

      if (i === 0) {
        // first segment no dot or brackets
        return segment;
      }

      return isSimpleKey(segment) ? `.${segment}` : `['${segment.replace(/"/g, "\\'")}']`;
    })
    .join('');

const formatValidatorIssue = (issue: ValidatorIssue): string => {
  const pathStr = formatPath(issue.path);
  const level = issue.severity === 'error' ? colors.bold.red : colors.bold.yellow;

  const highlightedMessage = issue.message.replace(/`([^`]+)`/g, (_, code) =>
    colors.yellow(`\`${code}\``),
  );

  return `${level(`[${issue.severity.toUpperCase()}]`)} ${colors.cyan(pathStr)}: ${highlightedMessage}`;
};

const shouldPrint = ({ context, issue }: { context: Context; issue: ValidatorIssue }) => {
  if (context.config.logs.level === 'silent') {
    return false;
  }

  if (issue.severity === 'error') {
    return context.config.logs.level !== 'warn';
  }

  return true;
};

export function handleValidatorResult({
  context,
  result,
}: {
  context: Context;
  result: ValidatorResult;
}) {
  for (const issue of result.issues) {
    if (shouldPrint({ context, issue })) {
      console.log(formatValidatorIssue(issue));
    }
  }

  if (!result.valid) {
    process.exit(1);
  }
}
