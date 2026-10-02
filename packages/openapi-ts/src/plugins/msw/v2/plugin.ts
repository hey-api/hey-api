import { getBaseUrl } from '@hey-api/shared';

import { $ } from '../../../ts-dsl';
import { getHandler } from '../shared/handler';
import { getOperationComment } from '../shared/operation';
import { type HandlerInfo, sortHandlers } from '../shared/sort';
import { createRequestHandlerOptions } from '../shared/types';
import type { MswPlugin } from '../types';

export const handlerV2: MswPlugin['Handler'] = ({ plugin }) => {
  const baseUrl = getBaseUrl(plugin.config.baseUrl, plugin.context.ir);

  const symbolRequestHandlerOptions = createRequestHandlerOptions(plugin);

  const symbolAll = plugin.symbol('all');
  const symbolFactory = plugin.symbol('createMswHandlers');
  const symbolHandler = plugin.symbol('Handler');
  const symbolInvoke = plugin.symbol('invoke');
  const symbolPick = plugin.symbol('pick');
  const symbolOverrideValue = plugin.symbol('OverrideValue');
  const symbolWrap = plugin.symbol('wrap');

  const pickObject = $.object().pretty();
  const pickType = $.type.object();
  const handlerInfo: Array<HandlerInfo> = [];

  plugin.forEach(
    'operation',
    ({ operation }) => {
      const symbolHandler = getHandler({ baseUrl, operation, plugin });

      const name = operation.id;
      pickType.prop(name, (p) =>
        p
          .type($(symbolHandler).typeofType())
          .$if(plugin.config.comments && getOperationComment(operation), (f, v) =>
            f.styledDoc(v, plugin.config.commentsStyle),
          ),
      );
      pickObject.prop(name, $(symbolWrap).call(symbolHandler));
      handlerInfo.push({ name, path: operation.path });
    },
    {
      order: 'declarations',
    },
  );

  const symbolHandlerFactoriesType = plugin.symbol('MswHandlerFactories');
  const handlerFactoriesType = $.type.alias(symbolHandlerFactoriesType).export().type(pickType);
  plugin.node(handlerFactoriesType);

  const factoryResultAll = 'all';
  const factoryResultPick = 'pick';

  const symbolFactoryReturnType = plugin.symbol('CreateMswHandlersResult');
  const factoryReturnType = $.type
    .alias(symbolFactoryReturnType)
    .export()
    .type(
      $.type
        .object()
        .prop(factoryResultAll, (p) =>
          p.type(
            $.type
              .func()
              .param('options', (p) =>
                p.optional().type(
                  $.type.object().prop(factoryResultPick, (p) =>
                    p.optional().type(
                      $.type
                        .mapped('K')
                        .key($.type.operator().keyof($.type(symbolHandlerFactoriesType)))
                        .optional()
                        .type(
                          $.type.or(
                            $.type('Parameters')
                              .generic($.type(symbolHandlerFactoriesType).idx('K'))
                              .idx($.type.literal(0)),
                            $.type('Parameters').generic(
                              $.type(symbolHandlerFactoriesType).idx('K'),
                            ),
                          ),
                        ),
                    ),
                  ),
                ),
              )
              .returns($.type('ReadonlyArray').generic(plugin.imports.HttpHandler)),
          ),
        )
        .prop(factoryResultPick, (p) => p.type(symbolHandlerFactoriesType)),
    );
  plugin.node(factoryReturnType);

  const factoryFn = $.func(symbolFactory)
    .export()
    .param('config', (p) => p.type(symbolRequestHandlerOptions).assign($.object()))
    .returns(symbolFactoryReturnType)
    .do(
      $.type
        .alias(symbolHandler)
        .generic('R')
        .type(
          $.type
            .func()
            .param('response', (p) => p.optional().type('R'))
            .param('options', (p) => p.optional().type(symbolRequestHandlerOptions))
            .returns(plugin.imports.HttpHandler),
        ),
      $.func(symbolWrap)
        .generic('R')
        .param('handler', (p) => p.type($.type(symbolHandler).generic('R')))
        .returns($.type(symbolHandler).generic('R'))
        .do(
          $.return(
            $.func()
              .param('response')
              .param('options')
              .do(
                $.return(
                  $('handler').call('response', $.object().spread('config').spread('options')),
                ),
              ),
          ),
        ),
      $.const(symbolPick)
        .type($.type(symbolFactoryReturnType).idx($.type.literal(factoryResultPick)))
        .assign(pickObject),
      $.const(symbolAll)
        .type($.type(symbolFactoryReturnType).idx($.type.literal(factoryResultAll)))
        .assign(
          $.func()
            .param('options', (p) => p.assign($.object()))
            .do(
              $.type
                .alias(symbolOverrideValue)
                .generic('R')
                .type(
                  $.type.or(
                    $.type('R'),
                    $.type.tuple(
                      $.type.tupleMember('response').optional().type('R'),
                      $.type.tupleMember('options').optional().type(symbolRequestHandlerOptions),
                    ),
                  ),
                ),
              $.func(symbolInvoke)
                .generic('R')
                .param('fn', (p) => p.type($.type(symbolHandler).generic('R')))
                .param('override', (p) =>
                  p.optional().type($.type(symbolOverrideValue).generic('R')),
                )
                .returns(plugin.imports.HttpHandler)
                .do(
                  $.return(
                    $.ternary($('Array').attr('isArray').call('override'))
                      .do($('fn').call($.spread('override')))
                      .otherwise($('fn').call('override')),
                  ),
                ),
              $.const('overrides').assign(
                $('options').attr(factoryResultPick).coalesce($.object()),
              ),
              $.array(
                ...sortHandlers(handlerInfo).map((info) =>
                  $(symbolInvoke).call(
                    $(symbolPick).attr(info.name),
                    $('overrides').attr(info.name),
                  ),
                ),
              ).return(),
            ),
        ),
      $.object().prop(factoryResultAll, symbolAll).prop(factoryResultPick, symbolPick).return(),
    );
  plugin.node(factoryFn);
};
