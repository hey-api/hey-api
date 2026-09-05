import type {
  StructureItem,
  StructureNode,
  StructureShell,
  Symbol,
  SymbolMeta,
} from '@hey-api/codegen-core';
import type { IR } from '@hey-api/shared';
import { applyNaming, toCase } from '@hey-api/shared';

import { $ } from '../../../../py-dsl';
import { createOperationComment } from '../../../shared/utils/operation';
import { operationParameters } from '../shared/operation';
import type { HeyApiSdkPlugin } from '../types';

export interface OperationItem {
  operation: IR.OperationObject;
  path: ReadonlyArray<string | number>;
  tags: ReadonlyArray<string> | undefined;
}

export const source = globalThis.Symbol('@hey-api/python-sdk');

function attachComment<T extends ReturnType<typeof $.method>>(args: {
  node: T;
  operation: IR.OperationObject;
  plugin: HeyApiSdkPlugin['Instance'];
}): T {
  const { node, operation, plugin } = args;
  return node.$if(plugin.config.comments && createOperationComment(operation), (n, v) =>
    n.doc(v),
  ) as T;
}

/** Prefixes a resolved container/segment/method name with `Async`. */
function asyncName(name: string): string {
  return `Async${name}`;
}

function createShellMeta(node: StructureNode, isAsync: boolean): SymbolMeta {
  return {
    artifact: 'sdk',
    category: 'utility',
    resource: 'class',
    resourceId: node.getPath().join('.'),
    ...(isAsync ? { variant: 'async' } : {}),
  };
}

function createFnSymbol(
  plugin: HeyApiSdkPlugin['Instance'],
  item: StructureItem & { data: OperationItem },
  isAsync: boolean,
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
      ...(isAsync ? { variant: 'async' } : {}),
    },
  });
}

function childToNode(
  resource: StructureNode,
  plugin: HeyApiSdkPlugin['Instance'],
  isAsync: boolean,
): ReadonlyArray<ReturnType<typeof $.method>> {
  // TODO: contract (self)
  const refChild = plugin.referenceSymbol(createShellMeta(resource, isAsync));
  // Derived from the un-prefixed segment name (not `refChild.name`, which
  // carries the `Async` prefix in the async tree) so the accessor is named
  // identically on both the sync and async trees, e.g. `self.widgets` on
  // both `Sdk` and `AsyncSdk`.
  const baseName = applyNaming(resource.name, plugin.config.operations.segmentName);
  const memberNameStr = toCase(baseName, plugin.config.operations.methodName.casing ?? 'camelCase');
  const memberName = plugin.symbol(memberNameStr);

  return [
    $.method(memberName)
      .decorator(plugin.imports.funcTools.cachedProperty)
      .param('self')
      .returns(refChild)
      .do(
        $(refChild)
          .call($.kwarg('client', $('self').attr('client')))
          .return(),
      ),
  ];
}

/**
 * Creates the shell used to build one SDK class tree. When `isAsync` is
 * true, the shell's classes are named with an `Async` prefix and extend the
 * async client instead of the sync one; every other aspect (naming
 * strategy, method names, fields) is identical to the sync tree.
 */
export function createShell(plugin: HeyApiSdkPlugin['Instance'], isAsync = false): StructureShell {
  return {
    define: (node) => {
      const baseName = applyNaming(
        node.name,
        node.isRoot ? plugin.config.operations.containerName : plugin.config.operations.segmentName,
      );

      const symbol = plugin.symbol(isAsync ? asyncName(baseName) : baseName, {
        meta: createShellMeta(node, isAsync),
      });

      const c = $.class(symbol)
        .export()
        .extends(isAsync ? plugin.imports.AsyncClient : plugin.imports.Client);

      const dependencies: Array<ReturnType<typeof $.class>> = [];

      return { dependencies, node: c };
    },
  };
}

function implementFn<T extends ReturnType<typeof $.method>>(args: {
  isAsync: boolean;
  node: T;
  operation: IR.OperationObject;
  plugin: HeyApiSdkPlugin['Instance'];
}): T {
  const { isAsync, node, operation, plugin } = args;
  const method = operation.method.toLowerCase();
  const opParameters = operationParameters({ operation, plugin });

  node.async(isAsync);

  if (plugin.config.paramsStructure === 'flat' && opParameters.fields.length) {
    const paramNames = opParameters.parameters.map((parameter) => parameter.name.toString());

    const fieldsList = $.list();
    for (const field of opParameters.fields) {
      const fieldDict = $.dict();
      fieldDict.entry($.literal('in'), $.literal(field.in));
      fieldDict.entry($.literal('key'), $.literal(field.key));
      if (field.map) {
        fieldDict.entry($.literal('map'), $.literal(field.map));
      }
      fieldsList.element(fieldDict);
    }

    const requestCall = $('self')
      .attr('request_options')
      .call($.literal(method), $.literal(operation.path), $('params'));

    return (
      node
        .params(...opParameters.parameters)
        // TODO: extract operation statements into a separate function
        .do(
          $.var('params').assign(
            $(plugin.imports.buildClientParams).call(
              fieldsList,
              ...paramNames.map((name) => $.kwarg(name, $(name))),
            ),
          ),
        )
        .do((isAsync ? $.await(requestCall) : requestCall).return()) as T
    );
  }

  const clientCall = $('self').attr('client').attr(method).call($.literal(operation.path));

  return node
    .params(...opParameters.parameters)
    .do((isAsync ? $.await(clientCall) : clientCall).return()) as T;
}

export function toNode(
  model: StructureNode,
  plugin: HeyApiSdkPlugin['Instance'],
  isAsync = false,
): {
  dependencies?: Array<ReturnType<typeof $.class | typeof $.func>>;
  nodes: ReadonlyArray<ReturnType<typeof $.class | typeof $.func>>;
} {
  if (model.virtual) {
    const nodes: Array<ReturnType<typeof $.func>> = [];
    for (const item of model.itemsFrom<OperationItem>(source)) {
      const fnName = applyNaming(
        String(item.location[item.location.length - 1]),
        plugin.config.operations.methodName,
      );
      const node = $.func(fnName).export().async(isAsync).do($('None').return());
      nodes.push(node);
    }
    return { nodes };
  }

  if (!model.shell) {
    return { nodes: [] };
  }

  const nodes: Array<ReturnType<typeof $.class | typeof $.func>> = [];
  const shell = model.shell.define(model);
  const node = shell.node as ReturnType<typeof $.class | typeof $.func>;

  let index = 0;
  for (const item of model.itemsFrom<OperationItem>(source)) {
    const { operation } = item.data;
    if (node['~dsl'] === 'FuncPyDsl') {
      // TODO: function?
    } else {
      if (index > 0 || node.hasBody) node.newline();
      const method = implementFn({
        isAsync,
        node: $.method(createFnSymbol(plugin, item, isAsync), (m) =>
          attachComment({
            node: m,
            operation,
            plugin,
          }),
        ).param('self'),
        operation,
        plugin,
      });
      node.do(method);
      // exampleIntent(method, operation, plugin);
    }
    index += 1;
  }

  for (const child of model.children.values()) {
    if (node['~dsl'] === 'FuncPyDsl') {
      // TODO: function?
    } else {
      if (node.hasBody) node.newline();
      node.do(...childToNode(child, plugin, isAsync));
    }
  }

  nodes.push(node);

  return {
    dependencies: shell.dependencies as Array<ReturnType<typeof $.class | typeof $.func>>,
    nodes,
  };
}
