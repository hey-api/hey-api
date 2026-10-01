import type { AnalysisContext } from '@hey-api/codegen-core';
import ts from 'typescript';

import { $ } from '../../../../ts-dsl';
import type { MaybeTsDsl, TypeTsDsl } from '../../../../ts-dsl/base';
import { TsDsl } from '../../../../ts-dsl/base';
import type { PluginInstance } from '../types';

const RESPONSE_RESULT = 'ResponseResult';
const RESPONSE_ERROR = 'ResponseError';
const ERROR_RESULT = 'ErrorResult';
const STYLE_PARAM = 'TStyle';

/**
 * Escape hatch DSL for conditional types, which the DSL doesn't natively
 * support. Renders `TStyle extends 'fields' ? trueType : falseType`. The
 * branch types are kept as DSL values and only lowered to AST at render
 * time so that symbol references inside them resolve correctly.
 */
class ConditionalOnFieldsTsDsl extends TsDsl<ts.TypeNode> {
  readonly '~dsl' = 'ConditionalOnFieldsTsDsl';

  constructor(
    private readonly _trueType: MaybeTsDsl<ts.TypeNode>,
    private readonly _falseType: MaybeTsDsl<ts.TypeNode>,
  ) {
    super();
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    ctx.analyze(this._trueType);
    ctx.analyze(this._falseType);
  }

  override toAst() {
    return ts.factory.createConditionalTypeNode(
      ts.factory.createTypeReferenceNode(STYLE_PARAM),
      ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral('fields')),
      this.$node(this._trueType) as ts.TypeNode,
      this.$node(this._falseType) as ts.TypeNode,
    );
  }
}

/**
 * Builds a conditional type node:
 * `TStyle extends 'fields' ? trueType : falseType`.
 */
const conditionalOnFields = (
  trueType: MaybeTsDsl<ts.TypeNode>,
  falseType: MaybeTsDsl<ts.TypeNode>,
): ConditionalOnFieldsTsDsl => new ConditionalOnFieldsTsDsl(trueType, falseType);

const styleUnion = () => $.type.or($.type.literal('data'), $.type.literal('fields'));

const ensureSymbol = (
  plugin: PluginInstance,
  name: typeof RESPONSE_RESULT | typeof RESPONSE_ERROR | typeof ERROR_RESULT,
) => {
  const existing = plugin.querySymbol({
    category: 'type',
    resource: name,
    tool: plugin.name,
  });
  if (existing) return existing;

  const symbol = plugin.symbol(name, {
    meta: {
      category: 'type',
      resource: name,
      tool: plugin.name,
    },
  });

  if (name === RESPONSE_RESULT) {
    // type ResponseResult<T, TStyle extends 'data' | 'fields'> =
    //   TStyle extends 'fields'
    //     ? { data: T; request: Request; response: Response }
    //     : T;
    plugin.node(
      $.type
        .alias(symbol)
        .export()
        .generic('T')
        .generic(STYLE_PARAM, (g) => g.extends(styleUnion()))
        .type(
          conditionalOnFields(
            $.type
              .object()
              .prop('data', (p) => p.type('T'))
              .prop('request', (p) => p.type('Request'))
              .prop('response', (p) => p.type('Response')),
            $.type('T'),
          ),
        ),
    );
  } else if (name === RESPONSE_ERROR) {
    // class ResponseError<E> extends Error {
    //   readonly error: E;
    //   // request/response may be undefined when the error came from
    //   // building the request object or from a network failure
    //   readonly request?: Request;
    //   readonly response?: Response;
    //   constructor(error: E, request?: Request, response?: Response) { ... }
    // }
    plugin.node(
      $.class(symbol)
        .export()
        .generic('E')
        .extends('Error')
        .field('error', (f) => f.readonly().type('E'))
        .field('request', (f) => f.readonly().optional().type('Request'))
        .field('response', (f) => f.readonly().optional().type('Response'))
        .init((i) =>
          i
            .param('error', (p) => p.type('E'))
            .param('request', (p) => p.optional().type('Request'))
            .param('response', (p) => p.optional().type('Response'))
            .do(
              $('super').call(
                $.ternary($('response'))
                  .do(
                    $.template('Request failed with status ')
                      .add($('response').attr('status'))
                      .add(': ')
                      .add($('response').attr('statusText')),
                  )
                  .otherwise($.literal('Request failed')),
              ),
              $('this').attr('name').assign($.literal(RESPONSE_ERROR)),
              $('this').attr('error').assign($('error')),
              $('this').attr('request').assign($('request')),
              $('this').attr('response').assign($('response')),
            ),
        ),
    );
  } else {
    // type ErrorResult<E, TStyle extends 'data' | 'fields'> =
    //   TStyle extends 'fields' ? ResponseError<E> : E;
    const symbolResponseError = ensureSymbol(plugin, RESPONSE_ERROR);
    plugin.node(
      $.type
        .alias(symbol)
        .export()
        .generic('E')
        .generic(STYLE_PARAM, (g) => g.extends(styleUnion()))
        .type(conditionalOnFields($.type(symbolResponseError).generic($.type('E')), $.type('E'))),
    );
  }

  return symbol;
};

/**
 * Ensures that the shared `ResponseResult<T, TStyle>` and
 * `ErrorResult<E, TStyle>` type aliases plus the `ResponseError` error class
 * are emitted exactly once in the generated tanstack file. Returns the
 * symbols so callers can build typed references.
 */
export const ensureFieldsResponseTypes = (plugin: PluginInstance) => ({
  symbolErrorResult: ensureSymbol(plugin, ERROR_RESULT),
  symbolResponseError: ensureSymbol(plugin, RESPONSE_ERROR),
  symbolResponseResult: ensureSymbol(plugin, RESPONSE_RESULT),
});

/**
 * Wraps a DSL expression in parentheses (`(expr)`). Useful when an `as`
 * cast would otherwise bind tighter than the inner expression — e.g. a
 * ternary cast like `(a ? b : c) as T`.
 */
class ParenExprTsDsl extends TsDsl<ts.Expression> {
  readonly '~dsl' = 'ParenExprTsDsl';

  constructor(private readonly _inner: TsDsl<ts.Expression>) {
    super();
  }

  override toAst(): ts.Expression {
    return ts.factory.createParenthesizedExpression(this._inner.toAst());
  }
}

const parenExpr = (inner: TsDsl<ts.Expression>): ParenExprTsDsl => new ParenExprTsDsl(inner);

/**
 * Builds the shared queryFn/mutationFn body statements used when the plugin
 * is configured with `responseStyle: 'fields'`: awaits the SDK call, throws a
 * `ResponseError` instance when the per-call style resolves to `'fields'`,
 * and returns either the enriched `{ data, request, response }` object or
 * the bare data.
 */
export const fieldsResultStatements = ({
  awaitSdkFn,
  fieldsTypes,
  optionsName,
  wrappedError,
  wrappedResponse,
}: {
  awaitSdkFn: TsDsl<any>;
  fieldsTypes: ReturnType<typeof ensureFieldsResponseTypes>;
  optionsName: string;
  wrappedError: TypeTsDsl;
  wrappedResponse: TypeTsDsl;
}): Array<TsDsl<any>> => {
  // The per-call style defaults to 'fields', mirroring the `TStyle = 'fields'`
  // type-level default — only an explicit 'data' opts out.
  const isFieldsCall = $(optionsName).attr('responseStyle').optional().neq($.literal('data'));
  const errorInstance = $.new(
    fieldsTypes.symbolResponseError,
    $('result').attr('error'),
    $('result').attr('request'),
    $('result').attr('response'),
  );
  const dataFieldsObject = $.object()
    .pretty()
    .prop('data', $('result').attr('data'))
    .prop('request', $('result').attr('request'))
    .prop('response', $('result').attr('response'));
  return [
    $.const('result').assign(awaitSdkFn),
    $.if($('result').attr('error').neq($('undefined'))).do(
      $.throw(
        $.as(
          parenExpr($.ternary(isFieldsCall).do(errorInstance).otherwise($('result').attr('error'))),
          wrappedError,
        ),
        false,
      ),
    ),
    $.return(
      $.as(
        parenExpr($.ternary(isFieldsCall).do(dataFieldsObject).otherwise($('result').attr('data'))),
        wrappedResponse,
      ),
    ),
  ];
};

/**
 * Name of the per-call style generic parameter exposed on helper functions
 * (queryOptions / mutationOptions / infiniteQueryOptions) when the plugin is
 * configured with `responseStyle: 'fields'`.
 */
export const fieldsStyleParamName = STYLE_PARAM;

/**
 * Builds the union literal `'data' | 'fields'` used as the constraint for the
 * `TStyle` generic on helper functions.
 */
export const fieldsStyleUnion = styleUnion;
