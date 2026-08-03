import type {
  StructureItem,
  StructureNode,
  StructureShell,
  Symbol,
  SymbolMeta,
} from '@hey-api/codegen-core';
import type { IR } from '@hey-api/shared';
import { applyNaming, toCase } from '@hey-api/shared';

import { getTypedConfig } from '../../../../config/utils';
import { $, ctx } from '../../../../ts-dsl';
import { getClientPlugin } from '../../../@hey-api/client-core/utils';
import {
  createOperationComment,
  isOperationOptionsRequired,
} from '../../../shared/utils/operation';
import { createClientClass, createRegistryClass } from '../shared/class';
import { nuxtTypeComposable, nuxtTypeDefault } from '../shared/constants';
import { operationParameters, operationReturnType, operationStatements } from '../shared/operation';
import type { HeyApiSdkPlugin } from '../types';

export interface OperationItem {
  operation: IR.OperationObject;
  path: ReadonlyArray<string | number>;
  tags: ReadonlyArray<string> | undefined;
}

export const source = globalThis.Symbol('@hey-api/sdk');

export function isInstance(plugin: HeyApiSdkPlugin['Instance']): boolean {
  const config = plugin.config.operations;
  return (
    config.container === 'class' && config.methods === 'instance' && config.strategy !== 'flat'
  );
}

function attachComment<T extends ReturnType<typeof $.var | typeof $.method>>(args: {
  node: T;
  operation: IR.OperationObject;
  plugin: HeyApiSdkPlugin['Instance'];
}): T {
  const { node, operation, plugin } = args;
  return node.$if(plugin.config.comments && createOperationComment(operation), (n, v) =>
    n.doc(v),
  ) as T;
}

function createShellMeta(node: StructureNode): SymbolMeta {
  return {
    artifact: 'sdk',
    category: 'utility',
    resource: 'class',
    resourceId: node.getPath().join('.'),
  };
}

function createFnSymbol(
  plugin: HeyApiSdkPlugin['Instance'],
  item: StructureItem & { data: OperationItem },
): Symbol {
  const { operation, path, tags } = item.data;
  const name = item.location[item.location.length - 1]!;
  return plugin.symbol(applyNaming(name, plugin.config.operations.methodName), {
    meta: {
      category: 'sdk',
      path,
      resource: 'operation',
      resourceId: operation.id,
      tags,
    },
  });
}

function childToNode(
  resource: StructureNode,
  plugin: HeyApiSdkPlugin['Instance'],
): ReadonlyArray<ReturnType<typeof $.field | typeof $.getter>> {
  // TODO: contract (self)
  const refChild = plugin.referenceSymbol(createShellMeta(resource));
  const memberNameStr = toCase(
    refChild.name,
    plugin.config.operations.methodName.casing ?? 'camelCase',
  );
  const memberName = plugin.symbol(memberNameStr);
  if (isInstance(plugin)) {
    const privateName = plugin.symbol(`_${memberNameStr}`);
    return [
      $.field(privateName, (f) => f.private().optional().type(refChild)),
      $.getter(memberName, (g) =>
        g.returns(refChild).do(
          $('this')
            .attr(privateName)
            .nullishAssign(
              $.new(refChild).args($.object().prop('client', $('this').attr('client'))),
            )
            .return(),
        ),
      ),
    ];
  }
  // TODO: contract (self)
  if (plugin.isSymbolRegistered(refChild.id)) {
    return [$.field(memberName, (f) => f.static().assign($(refChild)))];
  }
  return [$.getter(memberName, (g) => g.public().static().do($.return(refChild)))];
}

export function createShell(plugin: HeyApiSdkPlugin['Instance']): StructureShell {
  const client = getClientPlugin(getTypedConfig(plugin));
  const isAngularClient = client.name === '@hey-api/client-angular';
  return {
    define: (node) => {
      const symbol = plugin.symbol(
        applyNaming(
          node.name,
          node.isRoot
            ? plugin.config.operations.containerName
            : plugin.config.operations.segmentName,
        ),
        {
          meta: createShellMeta(node),
        },
      );

      // if (plugin.config.operations.container === 'object') {
      //   const o = $.const(symbol).export().assign($.object());
      //   return { dependencies: [], node: o };
      // }

      const c = $.class(symbol)
        .export()
        .$if(isInstance(plugin), (c) =>
          c.extends(
            // TODO: contract (self)
            plugin.referenceSymbol({
              artifact: 'sdk',
              category: 'utility',
              resource: 'class',
              resourceId: 'HeyApiClient',
            }),
          ),
        )
        .$if(isAngularClient && node.isRoot, (c) =>
          c.decorator(
            plugin.imports.angular.Injectable,
            $.object().prop('providedIn', $.literal('root')),
          ),
        );

      const dependencies: Array<ReturnType<typeof $.class>> = [];

      if (node.isRoot && isInstance(plugin)) {
        enrichRootClass({
          dependencies,
          node: c,
          plugin,
          symbol,
        });
      }

      return { dependencies, node: c };
    },
  };
}

function enrichRootClass(args: {
  dependencies: Array<ReturnType<typeof $.class>>;
  node: ReturnType<typeof $.class>;
  plugin: HeyApiSdkPlugin['Instance'];
  symbol: Symbol;
}): void {
  const { dependencies, node, plugin, symbol } = args;
  const symbolClient = plugin.symbol('HeyApiClient', {
    meta: {
      category: 'utility',
      resource: 'class',
      resourceId: 'HeyApiClient',
    },
  });
  dependencies.push(createClientClass({ plugin, symbol: symbolClient }));
  const symbolRegistry = plugin.symbol('HeyApiRegistry', {
    meta: {
      category: 'utility',
      resource: 'class',
      resourceId: 'HeyApiRegistry',
    },
  });
  dependencies.push(
    createRegistryClass({
      plugin,
      sdkSymbol: symbol,
      symbol: symbolRegistry,
    }),
  );
  // TODO: contract (?)
  const isClientRequired = !plugin.config.client || !plugin.querySymbol({ category: 'client' });
  const registry = plugin.symbol('__registry');
  node.toAccessNode = (node, options) => {
    if (options.context) return;
    return $(node.name).attr(registry).attr('get').call();
  };
  node.do(
    $.field(registry, (f) =>
      f
        .public()
        .static()
        .readonly()
        .type($.type(symbolRegistry).generic(symbol))
        .assign($.new(symbolRegistry).generic(symbol)),
    ),
    $.newline(),
    $.init((i) =>
      i
        .param('args', (p) =>
          p.required(isClientRequired).type(
            $.type
              .object()
              .prop('client', (p) => p.required(isClientRequired).type(plugin.imports.Client))
              .prop('key', (p) => p.optional().type('string')),
          ),
        )
        .do(
          $('super').call('args'),
          $(symbol)
            .attr(registry)
            .attr('set')
            .call('this', $('args').attr('key').required(isClientRequired)),
        ),
    ),
  );
}

function exampleIntent(
  node: ReturnType<typeof $.method | typeof $.var>,
  operation: IR.OperationObject,
  plugin: HeyApiSdkPlugin['Instance'],
): void {
  const config = plugin.config.examples;
  if (!config.enabled) return;
  plugin.intent({
    async run(context) {
      const { payload } = config;
      let example = ctx.example(node, {
        ...config,
        payload: (ctx) => (typeof payload === 'function' ? payload(operation, ctx) : payload),
      });
      if (config.transform) {
        example = await config.transform(example, operation);
      }
      if (example) {
        context.setExample(operation, {
          lang: config.language,
          source: example,
        });
      }
    },
  });
}

function implementFn<T extends ReturnType<typeof $.func | typeof $.method>>(args: {
  node: T;
  operation: IR.OperationObject;
  plugin: HeyApiSdkPlugin['Instance'];
}): T {
  const { node, operation, plugin } = args;
  const client = getClientPlugin(getTypedConfig(plugin));
  const isNuxtClient = client.name === '@hey-api/client-nuxt';
  const isEffectClient = client.name === '@hey-api/client-effect';
  const isRequiredOptions = isOperationOptionsRequired({
    context: plugin.context,
    operation,
  });
  const opParameters = operationParameters({
    isRequiredOptions,
    operation,
    plugin,
  });
  const statements = operationStatements({
    isRequiredOptions,
    opParameters,
    operation,
    plugin,
  });
  const returnType = operationReturnType({ operation, plugin });

  return node
    .$if(
      isNuxtClient,
      (m) =>
        m
          .generic(nuxtTypeComposable, (t) =>
            t.extends(plugin.imports.Composable).default($.type.literal('$fetch')),
          )
          .generic(nuxtTypeDefault, (t) =>
            t.$if(
              // TODO: contract (?)
              plugin.querySymbol({
                category: 'type',
                resource: 'operation',
                resourceId: operation.id,
                role: 'response',
              }),
              (t, s) => t.extends(s).default(s),
              (t) => t.default('undefined'),
            ),
          ),
      (m) =>
        m.$if(!isEffectClient, (m) =>
          m.generic('ThrowOnError', (t) =>
            t
              .extends('boolean')
              .default(
                ('throwOnError' in client.config ? client.config.throwOnError : false) ?? false,
              ),
          ),
        ),
    )
    .params(...opParameters.parameters)
    .returns(returnType)
    .do(...statements) as T;
}

export function toNode(
  model: StructureNode,
  plugin: HeyApiSdkPlugin['Instance'],
): {
  dependencies?: Array<ReturnType<typeof $.class | typeof $.var>>;
  nodes: ReadonlyArray<ReturnType<typeof $.class | typeof $.var>>;
} {
  if (model.virtual) {
    const nodes: Array<ReturnType<typeof $.var>> = [];
    for (const item of model.itemsFrom<OperationItem>(source)) {
      const { operation } = item.data;
      let node = $.const(createFnSymbol(plugin, item))
        .export()
        .assign(
          implementFn({
            node: $.func(),
            operation,
            plugin,
          }),
        );
      node = attachComment({ node, operation, plugin });
      nodes.push(node);
      exampleIntent(node, operation, plugin);
    }
    return { nodes };
  }

  if (!model.shell) {
    return { nodes: [] };
  }

  const nodes: Array<ReturnType<typeof $.class | typeof $.var>> = [];

  const client = getClientPlugin(getTypedConfig(plugin));
  const isAngularClient = client.name === '@hey-api/client-angular';

  const shell = model.shell.define(model);
  const node = shell.node as ReturnType<typeof $.class | typeof $.var>;

  let index = 0;
  for (const item of model.itemsFrom<OperationItem>(source)) {
    const { operation } = item.data;
    if (node['~dsl'] === 'VarTsDsl') {
      // TODO: object
    } else {
      if (index > 0 || node.hasBody) node.newline();
      const method = implementFn({
        node: $.method(createFnSymbol(plugin, item), (m) =>
          attachComment({
            node: m,
            operation,
            plugin,
          })
            .public()
            .static(!isAngularClient && !isInstance(plugin)),
        ),
        operation,
        plugin,
      });
      node.do(method);
      exampleIntent(method, operation, plugin);
    }
    index += 1;
  }

  for (const child of model.children.values()) {
    if (node['~dsl'] === 'VarTsDsl') {
      // TODO: object
    } else {
      if (node.hasBody) node.newline();
      node.do(...childToNode(child, plugin));
    }
  }

  nodes.push(node);

  return {
    dependencies: shell.dependencies as Array<ReturnType<typeof $.class | typeof $.var>>,
    nodes,
  };
}
