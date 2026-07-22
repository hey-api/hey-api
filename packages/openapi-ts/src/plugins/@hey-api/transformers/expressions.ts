import { TEMPORAL } from '../../../symbols';
import { $ } from '../../../ts-dsl';
import { resolveDates } from './dates';
import type { ExpressionTransformer } from './types';

export const bigIntExpressions: ExpressionTransformer = ({ dataExpression, schema }) => {
  if (schema.type !== 'integer' || schema.format !== 'int64') {
    return;
  }

  const bigIntCallExpression =
    dataExpression !== undefined
      ? $('BigInt').call($(dataExpression).attr('toString').call())
      : undefined;

  if (bigIntCallExpression) {
    if (typeof dataExpression === 'string') {
      return [$.return(bigIntCallExpression)];
    }

    if (dataExpression) {
      return [$(dataExpression).assign(bigIntCallExpression)];
    }
  }

  return;
};

export const dateExpressions: ExpressionTransformer = ({ dataExpression, schema }) => {
  if (schema.type !== 'string' || !(schema.format === 'date' || schema.format === 'date-time')) {
    return;
  }

  if (typeof dataExpression === 'string') {
    return [$.return($.new('Date').arg(dataExpression))];
  }

  if (dataExpression) {
    return [$(dataExpression).assign($.new('Date').arg(dataExpression))];
  }

  return;
};

export const temporalExpressions: ExpressionTransformer = ({ dataExpression, plugin, schema }) => {
  if (schema.type !== 'string' || !(schema.format === 'date' || schema.format === 'date-time')) {
    return;
  }

  const { polyfill } = resolveDates(plugin.config.dates);
  const temporal = TEMPORAL(plugin.symbolFactory, { polyfill }).Temporal;
  const memberName = schema.format === 'date' ? 'PlainDate' : 'Instant';

  if (typeof dataExpression === 'string') {
    return [$.return($(temporal).attr(memberName).attr('from').call(dataExpression))];
  }

  if (dataExpression) {
    return [
      $(dataExpression).assign($(temporal).attr(memberName).attr('from').call(dataExpression)),
    ];
  }

  return;
};
