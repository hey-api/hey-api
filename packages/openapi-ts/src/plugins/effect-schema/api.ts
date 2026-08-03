import type { Symbol } from '@hey-api/codegen-core';
import type { IR, RequestSchemaContext } from '@hey-api/shared';

import { $ } from '../../ts-dsl';
import { emitNamedSchema, type EmitSchemaOptions } from './schema';
import type { EffectSchemaPlugin } from './types';

type ArrowFunc = Extract<ReturnType<typeof $.func>, { '~mode': 'arrow' }>;
type ValidatorArgs = {
  operation: IR.OperationObject;
  plugin: EffectSchemaPlugin['Instance'];
};

const operationSchema = (
  plugin: EffectSchemaPlugin['Instance'],
  operationId: string,
  role: 'data' | 'responses',
): Symbol | undefined =>
  plugin.querySymbol({
    artifact: 'effect-schema',
    category: 'schema',
    resource: 'operation',
    resourceId: operationId,
    role,
  });

const decoder = (
  plugin: EffectSchemaPlugin['Instance'],
  symbol: Symbol | undefined,
): ArrowFunc | undefined => {
  if (!symbol) return;
  return $.func()
    .async()
    .param('data')
    .do(
      $(plugin.imports.Schema).attr('decodeUnknownPromise').call($(symbol)).call('data').return(),
    );
};

export type IApi = {
  createRequestSchema: (
    ctx: RequestSchemaContext<EffectSchemaPlugin['Instance']>,
  ) => Symbol | undefined;
  createRequestValidator: (
    ctx: RequestSchemaContext<EffectSchemaPlugin['Instance']>,
  ) => ArrowFunc | undefined;
  createResponseHandlers: (ctx: ValidatorArgs) => {
    transformer: ArrowFunc | undefined;
    validator: ArrowFunc | undefined;
  };
  createResponseTransformer: (ctx: ValidatorArgs) => ArrowFunc | undefined;
  createResponseValidator: (ctx: ValidatorArgs) => ArrowFunc | undefined;
  emitSchema: (options: EmitSchemaOptions) => Symbol;
};

export class Api implements IApi {
  createRequestSchema({
    operation,
    plugin,
  }: RequestSchemaContext<EffectSchemaPlugin['Instance']>): Symbol | undefined {
    if (!plugin.config.requests.enabled) return;
    return operationSchema(plugin, operation.id, 'data');
  }

  createRequestValidator(
    ctx: RequestSchemaContext<EffectSchemaPlugin['Instance']>,
  ): ArrowFunc | undefined {
    return decoder(ctx.plugin, this.createRequestSchema(ctx));
  }

  createResponseHandlers(ctx: ValidatorArgs): ReturnType<IApi['createResponseHandlers']> {
    return {
      transformer: this.createResponseTransformer(ctx),
      validator: undefined,
    };
  }

  createResponseTransformer({ operation, plugin }: ValidatorArgs): ArrowFunc | undefined {
    if (!plugin.config.responses.enabled) return;
    return decoder(plugin, operationSchema(plugin, operation.id, 'responses'));
  }

  createResponseValidator(ctx: ValidatorArgs): ArrowFunc | undefined {
    return this.createResponseTransformer(ctx);
  }

  emitSchema(options: EmitSchemaOptions): Symbol {
    return emitNamedSchema(options);
  }
}
