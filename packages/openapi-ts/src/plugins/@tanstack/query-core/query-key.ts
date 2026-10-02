import type { Symbol } from '@hey-api/codegen-core';
import type { IR } from '@hey-api/shared';
import { applyNaming, hasOperationDataRequired } from '@hey-api/shared';

import { getTypedConfig } from '../../../config/utils';
import type { TsDsl } from '../../../ts-dsl';
import { $ } from '../../../ts-dsl';
import { getClientBaseUrlKey } from '../../@hey-api/client-core/utils';
import { useTypeData } from './shared/use-type';
import type { PluginInstance } from './types';

const TOptionsType = 'TOptions';

export function createQueryKeyFunction({ plugin }: { plugin: PluginInstance }): void {
  const symbolCreateQueryKey = plugin.symbol(
    applyNaming('createQueryKey', {
      case: plugin.config.case,
    }),
    {
      meta: {
        category: 'utility',
        resource: 'createQueryKey',
      },
    },
  );
  // TODO: contract (self)
  const symbolQueryKeyType = plugin.referenceSymbol({
    artifact: plugin.name,
    category: 'type',
    resource: 'QueryKey',
  });

  const baseUrlKey = getClientBaseUrlKey(getTypedConfig(plugin));

  // TODO: contract (?)
  const symbolClient = plugin.querySymbol({
    category: 'client',
  });
  // TODO: contract (cross)
  const symbolOptions = plugin.referenceSymbol({
    artifact: 'sdk',
    category: 'type',
    resource: 'client-options',
  });

  const returnType = $.type(symbolQueryKeyType).generic(TOptionsType).idx(0);

  const fn = $.const(symbolCreateQueryKey).assign(
    $.func()
      .param('id', (p) => p.type('string'))
      .param('options', (p) => p.optional().type(TOptionsType))
      .param('infinite', (p) => p.optional().type('boolean'))
      .param('tags', (p) => p.optional().type('ReadonlyArray<string>'))
      .generic(TOptionsType, (g) => g.extends(symbolOptions))
      .returns($.type.tuple(returnType))
      .do(
        $.const('params')
          .type(returnType)
          .assign(
            $.object()
              .prop('_id', 'id')
              .prop(
                baseUrlKey,
                $('options')
                  .attr(baseUrlKey)
                  .optional()
                  .or(
                    $('options')
                      .attr('client')
                      .optional()
                      .$if(symbolClient, (a, v) => a.coalesce(v))
                      .attr('getConfig')
                      .call()
                      .attr(baseUrlKey),
                  ),
              )
              .as(returnType),
          ),
        $.if('infinite').do($('params').attr('_infinite').assign('infinite')),
        $.if('tags').do($('params').attr('tags').assign('tags')),
        $.if($('options').attr('body').optional()).do(
          $('params').attr('body').assign($('options').attr('body')),
        ),
        $.if($('options').attr('headers').optional()).do(
          $('params').attr('headers').assign($('options').attr('headers')),
        ),
        $.if($('options').attr('path').optional()).do(
          $('params').attr('path').assign($('options').attr('path')),
        ),
        $.if($('options').attr('query').optional()).do(
          $('params').attr('query').assign($('options').attr('query')),
        ),
        $.return($.array().element($('params'))),
      ),
  );
  plugin.node(fn);
}

function createQueryKeyLiteral({
  id,
  isInfinite,
  operation,
  optionsExpr,
  plugin,
}: {
  id: string;
  isInfinite?: boolean;
  operation: IR.OperationObject;
  optionsExpr: TsDsl<any>;
  plugin: PluginInstance;
}): ReturnType<typeof $.call> {
  const config = isInfinite ? plugin.config.infiniteQueryKeys : plugin.config.queryKeys;
  let tagsArray: ReturnType<typeof $.array> | undefined;
  if (config.tags && operation.tags && operation.tags.length) {
    tagsArray = $.array().elements(...operation.tags);
  }
  // TODO: contract (self)
  const symbolCreateQueryKey = plugin.referenceSymbol({
    artifact: plugin.name,
    category: 'utility',
    resource: 'createQueryKey',
  });
  const createQueryKeyCallExpression = $(symbolCreateQueryKey).call(
    $.literal(id),
    optionsExpr,
    isInfinite || tagsArray ? $.literal(Boolean(isInfinite)) : undefined,
    tagsArray,
  );
  return createQueryKeyCallExpression;
}

export function createQueryKeyType({ plugin }: { plugin: PluginInstance }): void {
  // TODO: contract (cross)
  const symbolOptions = plugin.referenceSymbol({
    artifact: 'sdk',
    category: 'type',
    resource: 'client-options',
  });
  const symbolQueryKeyType = plugin.symbol('QueryKey', {
    meta: {
      category: 'type',
      resource: 'QueryKey',
    },
  });
  const queryKeyType = $.type
    .alias(symbolQueryKeyType)
    .export()
    .generic(TOptionsType, (g) => g.extends(symbolOptions))
    .type(
      $.type.tuple(
        $.type.and(
          $.type(
            `Pick<${TOptionsType}, '${getClientBaseUrlKey(getTypedConfig(plugin))}' | 'body' | 'headers' | 'path' | 'query'>`,
          ),
          $.type
            .object()
            .prop('_id', (p) => p.type('string'))
            .prop('_infinite', (p) => p.optional().type('boolean'))
            .prop('tags', (p) => p.optional().type('ReadonlyArray<string>')),
        ),
      ),
    );
  plugin.node(queryKeyType);
}

export function queryKeyStatement({
  isInfinite,
  operation,
  plugin,
  symbol,
  typeQueryKey,
}: {
  isInfinite: boolean;
  operation: IR.OperationObject;
  plugin: PluginInstance;
  symbol: Symbol;
  typeQueryKey?: ReturnType<typeof $.type>;
}): ReturnType<typeof $.const> {
  const typeData = useTypeData({ operation, plugin });
  const symbolSkipToken = $(plugin.imports.skipToken);
  const symbolUnwrapSkipToken = plugin.referenceSymbol({
    artifact: plugin.name,
    category: 'utility',
    resource: 'unwrapSkipToken',
  });
  const paramType = $.type.or(typeData, $.type.query(symbolSkipToken));
  const statement = $.const(symbol)
    .export()
    .assign(
      $.func()
        .param('options', (p) => p.required(hasOperationDataRequired(operation)).type(paramType))
        .$if(isInfinite && typeQueryKey, (f, v) => f.returns(v))
        .do(
          createQueryKeyLiteral({
            id: operation.id,
            isInfinite,
            operation,
            optionsExpr: $(symbolUnwrapSkipToken).call('options'),
            plugin,
          }).return(),
        ),
    );
  return statement;
}
