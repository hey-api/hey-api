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
import { $ } from '../../../../ts-dsl';
import { getClientPlugin } from '../../../@hey-api/client-core/utils';
import {
  createOperationComment,
  isOperationOptionsRequired,
} from '../../../shared/utils/operation';
import type { AngularCommonPlugin } from '../types';

export interface OperationItem {
  operation: IR.OperationObject;
}

export const source = globalThis.Symbol('@angular/common');

function attachComment<T extends ReturnType<typeof $.var | typeof $.method>>(args: {
  node: T;
  operation: IR.OperationObject;
  plugin: AngularCommonPlugin['Instance'];
}): T {
  const { node, operation, plugin } = args;
  return node.$if(plugin.config.comments && createOperationComment(operation), (n, v) =>
    n.styledDoc(v, plugin.config.commentsStyle),
  ) as T;
}

function createHttpRequestFnMeta(operation: IR.OperationObject): SymbolMeta {
  return {
    artifact: '@angular/common',
    category: 'utility',
    resource: 'operation',
    resourceId: operation.id,
    role: 'request',
  };
}

function createHttpRequestShellMeta(node: StructureNode): SymbolMeta {
  return {
    artifact: '@angular/common',
    category: 'utility',
    resource: 'shell',
    resourceId: node.getPath().join('.'),
    role: 'request',
  };
}

function createHttpResourceFnMeta(operation: IR.OperationObject): SymbolMeta {
  return {
    artifact: '@angular/common',
    category: 'utility',
    resource: 'operation',
    resourceId: operation.id,
    role: 'resource',
  };
}

function createHttpResourceShellMeta(node: StructureNode): SymbolMeta {
  return {
    artifact: '@angular/common',
    category: 'utility',
    resource: 'shell',
    resourceId: node.getPath().join('.'),
    role: 'resource',
  };
}

function createHttpRequestFnSymbol(
  plugin: AngularCommonPlugin['Instance'],
  item: StructureItem & { data: OperationItem },
): Symbol {
  const { operation } = item.data;
  const name = item.location[item.location.length - 1]!;
  return plugin.symbol(applyNaming(name, plugin.config.httpRequests.methodName), {
    meta: createHttpRequestFnMeta(operation),
  });
}

function createHttpResourceFnSymbol(
  plugin: AngularCommonPlugin['Instance'],
  item: StructureItem & { data: OperationItem },
): Symbol {
  const { operation } = item.data;
  const name = item.location[item.location.length - 1]!;
  return plugin.symbol(applyNaming(name, plugin.config.httpResources.methodName), {
    meta: createHttpResourceFnMeta(operation),
  });
}

function childToHttpRequestNode(
  resource: StructureNode,
  plugin: AngularCommonPlugin['Instance'],
): ReadonlyArray<ReturnType<typeof $.field | typeof $.getter>> {
  // TODO: contract (self)
  const refChild = plugin.referenceSymbol(createHttpRequestShellMeta(resource));
  const memberNameStr = toCase(refChild.name, 'camelCase');
  const memberName = plugin.symbol(memberNameStr);
  const privateName = plugin.symbol(`_${memberNameStr}`);
  return [
    $.field(privateName, (f) => f.private().optional().type(refChild)),
    $.getter(memberName, (g) =>
      g
        .returns(refChild)
        .do($('this').attr(privateName).nullishAssign($.new(refChild).args()).return()),
    ),
  ];
}

function childToHttpResourceNode(
  resource: StructureNode,
  plugin: AngularCommonPlugin['Instance'],
): ReadonlyArray<ReturnType<typeof $.field | typeof $.getter>> {
  // TODO: contract (self)
  const refChild = plugin.referenceSymbol(createHttpResourceShellMeta(resource));
  const memberNameStr = toCase(refChild.name, 'camelCase');
  const memberName = plugin.symbol(memberNameStr);
  const privateName = plugin.symbol(`_${memberNameStr}`);
  return [
    $.field(privateName, (f) => f.private().optional().type(refChild)),
    $.getter(memberName, (g) =>
      g
        .returns(refChild)
        .do($('this').attr(privateName).nullishAssign($.new(refChild).args()).return()),
    ),
  ];
}

export function createHttpRequestShell(plugin: AngularCommonPlugin['Instance']): StructureShell {
  const client = getClientPlugin(getTypedConfig(plugin));
  const isAngularClient = client.name === '@hey-api/client-angular';

  return {
    define: (node) => {
      const symbol = plugin.symbol(
        applyNaming(
          node.name,
          node.isRoot
            ? plugin.config.httpRequests.containerName
            : plugin.config.httpRequests.segmentName,
        ),
        {
          meta: createHttpRequestShellMeta(node),
        },
      );

      const c = $.class(symbol)
        .export()
        .$if(isAngularClient && node.isRoot, (c) =>
          c.decorator(plugin.imports.Injectable, $.object().prop('providedIn', $.literal('root'))),
        );

      return { dependencies: [], node: c };
    },
  };
}

export function createHttpResourceShell(plugin: AngularCommonPlugin['Instance']): StructureShell {
  const client = getClientPlugin(getTypedConfig(plugin));
  const isAngularClient = client.name === '@hey-api/client-angular';

  return {
    define: (node) => {
      const symbol = plugin.symbol(
        applyNaming(
          node.name,
          node.isRoot
            ? plugin.config.httpResources.containerName
            : plugin.config.httpResources.segmentName,
        ),
        {
          meta: createHttpResourceShellMeta(node),
        },
      );

      const c = $.class(symbol)
        .export()
        .$if(isAngularClient && node.isRoot, (c) =>
          c.decorator(plugin.imports.Injectable, $.object().prop('providedIn', $.literal('root'))),
        );

      return { dependencies: [], node: c };
    },
  };
}

function implementHttpRequestFn<T extends ReturnType<typeof $.func | typeof $.method>>(args: {
  node: T;
  operation: IR.OperationObject;
  plugin: AngularCommonPlugin['Instance'];
}): T {
  const { node, operation, plugin } = args;
  const isRequiredOptions = isOperationOptionsRequired({
    context: plugin.context,
    operation,
  });

  // TODO: contract (?)
  const symbolClient = plugin.querySymbol({ category: 'client' });
  // TODO: contract (cross)
  const symbolOptions = plugin.referenceSymbol({
    artifact: 'sdk',
    category: 'type',
    resource: 'client-options',
  });
  // TODO: contract (cross)
  const symbolDataType = plugin.querySymbol({
    artifact: 'types',
    category: 'type',
    resource: 'operation',
    resourceId: operation.id,
    role: 'data',
  });
  // TODO: contract (?)
  const symbolResponseType = plugin.querySymbol({
    category: 'type',
    resource: 'operation',
    resourceId: operation.id,
    role: 'response',
  });

  return node
    .param('options', (p) =>
      p.required(isRequiredOptions).type(
        $.type(symbolOptions)
          .generic(symbolDataType ?? 'unknown')
          .generic('ThrowOnError'),
      ),
    )
    .generic('ThrowOnError', (g) => g.extends('boolean').default(false))
    .returns($.type(plugin.imports.HttpRequest).generic(symbolResponseType ?? 'unknown'))
    .do(
      $.return(
        $('options')
          .attr('client')
          .optional()
          .$if(symbolClient, (c, s) => c.coalesce(s))
          .attr('requestOptions')
          .call(
            $.object()
              .prop('responseStyle', $.literal('data'))
              .prop('method', $.literal(operation.method.toUpperCase()))
              .prop('url', $.literal(operation.path))
              .spread('options'),
          )
          .generic(symbolResponseType ?? 'unknown')
          .generic('ThrowOnError'),
      ),
    ) as T;
}

function implementHttpResourceFn<T extends ReturnType<typeof $.func | typeof $.method>>(args: {
  node: T;
  operation: IR.OperationObject;
  plugin: AngularCommonPlugin['Instance'];
}): T {
  const { node, operation, plugin } = args;
  const isRequiredOptions = isOperationOptionsRequired({
    context: plugin.context,
    operation,
  });

  // TODO: contract (cross)
  const symbolOptions = plugin.referenceSymbol({
    artifact: 'sdk',
    category: 'type',
    resource: 'client-options',
  });
  // TODO: contract (cross)
  const symbolDataType = plugin.querySymbol({
    artifact: 'types',
    category: 'type',
    resource: 'operation',
    resourceId: operation.id,
    role: 'data',
  });
  // TODO: contract (?)
  const symbolResponseType = plugin.querySymbol({
    category: 'type',
    resource: 'operation',
    resourceId: operation.id,
    role: 'response',
  });

  return node
    .param('options', (p) =>
      p.required(isRequiredOptions).type(
        $.type.func().returns(
          $.type.or(
            $.type(symbolOptions)
              .generic(symbolDataType ?? 'unknown')
              .generic('ThrowOnError'),
            $.type('undefined'),
          ),
        ),
      ),
    )
    .generic('ThrowOnError', (g) => g.extends('boolean').default(false))
    .do(
      $.return(
        $(plugin.imports.httpResource)
          .call(
            $.func().do(
              $.const('opts').assign(
                $.ternary('options').do($('options').call()).otherwise($.id('undefined')),
              ),
              $.return(
                $.ternary('opts')
                  .do(
                    $.lazy((ctx) =>
                      ctx
                        // TODO: contract (self)
                        .access(plugin.referenceSymbol(createHttpRequestFnMeta(operation)), {
                          transform: (node, index) =>
                            index === 0
                              ? node['~dsl'] === 'ClassTsDsl'
                                ? $(plugin.imports.inject).call($(node.name))
                                : $(node.name)
                              : node,
                        })
                        .call('opts'),
                    ),
                  )
                  .otherwise($.id('undefined')),
              ),
            ),
          )
          .generic(symbolResponseType ?? 'unknown'),
      ),
    ) as T;
}

export function toHttpRequestNode(
  model: StructureNode,
  plugin: AngularCommonPlugin['Instance'],
): {
  dependencies?: Array<ReturnType<typeof $.class | typeof $.var>>;
  nodes: ReadonlyArray<ReturnType<typeof $.class | typeof $.var>>;
} {
  if (model.virtual) {
    const nodes: Array<ReturnType<typeof $.var>> = [];
    for (const item of model.itemsFrom<OperationItem>(source)) {
      const { operation } = item.data;
      let node = $.const(createHttpRequestFnSymbol(plugin, item))
        .export()
        .assign(
          implementHttpRequestFn({
            node: $.func(),
            operation,
            plugin,
          }),
        );
      node = attachComment({ node, operation, plugin });
      nodes.push(node);
    }
    return { nodes };
  }

  if (!model.shell) {
    return { nodes: [] };
  }

  const nodes: Array<ReturnType<typeof $.class>> = [];

  const shell = model.shell.define(model);
  const node = shell.node as ReturnType<typeof $.class>;

  let index = 0;
  for (const item of model.itemsFrom<OperationItem>(source)) {
    const { operation } = item.data;
    if (index > 0 || node.hasBody) node.newline();
    node.do(
      implementHttpRequestFn({
        node: $.method(createHttpRequestFnSymbol(plugin, item), (m) =>
          attachComment({
            node: m,
            operation,
            plugin,
          }).public(),
        ),
        operation,
        plugin,
      }),
    );
    index += 1;
  }

  for (const child of model.children.values()) {
    if (node.hasBody) node.newline();
    node.do(...childToHttpRequestNode(child, plugin));
  }

  nodes.push(node);

  return {
    dependencies: shell.dependencies as Array<ReturnType<typeof $.class>>,
    nodes,
  };
}

export function toHttpResourceNode(
  model: StructureNode,
  plugin: AngularCommonPlugin['Instance'],
): {
  dependencies?: Array<ReturnType<typeof $.class | typeof $.var>>;
  nodes: ReadonlyArray<ReturnType<typeof $.class | typeof $.var>>;
} {
  if (model.virtual) {
    const nodes: Array<ReturnType<typeof $.var>> = [];
    for (const item of model.itemsFrom<OperationItem>(source)) {
      const { operation } = item.data;
      let node = $.const(createHttpResourceFnSymbol(plugin, item))
        .export()
        .assign(
          implementHttpResourceFn({
            node: $.func(),
            operation,
            plugin,
          }),
        );
      node = attachComment({ node, operation, plugin });
      nodes.push(node);
    }
    return { nodes };
  }

  if (!model.shell) {
    return { nodes: [] };
  }

  const nodes: Array<ReturnType<typeof $.class>> = [];

  const shell = model.shell.define(model);
  const node = shell.node as ReturnType<typeof $.class>;

  let index = 0;
  for (const item of model.itemsFrom<OperationItem>(source)) {
    const { operation } = item.data;
    if (index > 0 || node.hasBody) node.newline();
    node.do(
      implementHttpResourceFn({
        node: $.method(createHttpResourceFnSymbol(plugin, item), (m) =>
          attachComment({
            node: m,
            operation,
            plugin,
          }).public(),
        ),
        operation,
        plugin,
      }),
    );
    index += 1;
  }

  for (const child of model.children.values()) {
    if (node.hasBody) node.newline();
    node.do(...childToHttpResourceNode(child, plugin));
  }

  nodes.push(node);

  return {
    dependencies: shell.dependencies as Array<ReturnType<typeof $.class>>,
    nodes,
  };
}
