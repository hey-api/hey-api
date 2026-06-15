import { applyNaming } from '@hey-api/shared';

import { $ } from '../../../../ts-dsl';
import type { PluginInstance } from '../types';

export const createUnwrapSkipTokenFunction = ({ plugin }: { plugin: PluginInstance }): void => {
  const symbolSkipToken = $(plugin.imports.skipToken);
  const TGeneric = 'T';

  const symbolUnwrapSkipToken = plugin.symbol(
    applyNaming('unwrapSkipToken', {
      case: plugin.config.case,
    }),
    {
      meta: {
        category: 'utility',
        resource: 'unwrapSkipToken',
      },
    },
  );

  const fn = $.const(symbolUnwrapSkipToken).assign(
    $.func()
      .generic(TGeneric)
      .param('options', (p) => p.type($.type.or(TGeneric, $.type.query(symbolSkipToken))))
      .returns($.type.or(TGeneric, $.type('undefined')))
      .do(
        $.return(
          $.ternary($('options').neq(symbolSkipToken)).do($('options')).otherwise($('undefined')),
        ),
      ),
  );
  plugin.node(fn);
};
