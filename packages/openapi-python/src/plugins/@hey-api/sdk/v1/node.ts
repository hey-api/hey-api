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
import type { OperationResponse } from '../shared/operation';
import { operationParameters, operationResponse } from '../shared/operation';
import type { OperationPagination } from '../shared/pagination';
import { operationPaginationInfo } from '../shared/pagination';
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
): ReadonlyArray<ReturnType<typeof $.method>> {
  // TODO: contract (self)
  const refChild = plugin.referenceSymbol(createShellMeta(resource));
  const memberNameStr = toCase(
    refChild.name,
    plugin.config.operations.methodName.casing ?? 'camelCase',
  );
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

export function createShell(plugin: HeyApiSdkPlugin['Instance']): StructureShell {
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

      const c = $.class(symbol).export().extends(plugin.imports.Client);

      const dependencies: Array<ReturnType<typeof $.class>> = [];

      return { dependencies, node: c };
    },
  };
}

// A parameter can be called `response`, so the local gets a suffix instead.
function localName(preferred: string, taken: ReadonlySet<string>): string {
  let name = preferred;
  while (taken.has(name)) {
    name = `${name}_`;
  }
  return name;
}

/**
 * Returns a page, built from the parsed response and the method itself, so the
 * page can ask for the one after it.
 */
function returnPage<T extends ReturnType<typeof $.method>>(args: {
  methodName: string;
  node: T;
  pageVar: string;
  pagination: OperationPagination;
  paramNames: ReadonlyArray<string>;
  plugin: HeyApiSdkPlugin['Instance'];
}): T {
  const { methodName, node, pageVar, pagination, paramNames, plugin } = args;

  const kwargs = $.dict();
  for (const name of paramNames) {
    if (name === pagination.parameter) continue;
    kwargs.entry($.literal(name), $(name));
  }

  const value = $(pageVar).attr(pagination.next);
  const nextParams = $.dict();
  nextParams.entry(
    $.literal(pagination.parameter),
    // A page number counts up. `or 0` keeps a response that omits the field
    // from raising here; the page it then asks for repeats, which the page
    // reports rather than looping.
    pagination.style === 'pageNumber'
      ? $.binary($.binary(value, 'or', $.literal(0)), '+', $.literal(1))
      : value,
  );

  return node.returns($.subscript(plugin.imports.Page, pagination.itemSymbol) as never).do(
    $(plugin.imports.Page)
      .call(
        $.kwarg('items', $.binary($(pageVar).attr(pagination.items), 'or', $.list())),
        $.kwarg('has_more', $(pageVar).attr(pagination.hasMore)),
        $.kwarg('fetch', $('self').attr(methodName)),
        $.kwarg('kwargs', kwargs),
        $.kwarg('next_params', nextParams),
      )
      .return(),
  ) as T;
}

function implementResponse<T extends ReturnType<typeof $.method>>(args: {
  methodName: string;
  node: T;
  pagination: OperationPagination | undefined;
  paramNames: ReadonlyArray<string>;
  plugin: HeyApiSdkPlugin['Instance'];
  requestCall: ReturnType<typeof $.call>;
  response: OperationResponse;
}): T {
  const { methodName, node, pagination, paramNames, plugin, requestCall, response } = args;
  const taken = new Set(paramNames);

  if (response.kind === 'model') {
    const responseVar = localName('response', taken);
    const body =
      response.parseAs === 'json'
        ? $(responseVar).attr('json').call()
        : response.parseAs === 'text'
          ? $(responseVar).attr('text')
          : $(responseVar).attr('content');

    if (pagination) {
      const pageVar = localName('page', taken);
      node
        .do($.var(responseVar).assign(requestCall))
        .do($.var(pageVar).assign($(response.symbol).attr('model_validate').call(body)));
      return returnPage({ methodName, node, pageVar, pagination, paramNames, plugin });
    }

    return node
      .returns(response.symbol)
      .do($.var(responseVar).assign(requestCall))
      .do($(response.symbol).attr('model_validate').call(body).return()) as T;
  }

  if (response.kind === 'none') {
    return node.returns('None').do(requestCall).do($('None').return()) as T;
  }

  return node.do(requestCall.return()) as T;
}

function implementFn<T extends ReturnType<typeof $.method>>(args: {
  methodName: string;
  node: T;
  operation: IR.OperationObject;
  plugin: HeyApiSdkPlugin['Instance'];
}): T {
  const { methodName, node, operation, plugin } = args;
  const method = operation.method.toLowerCase();
  const opParameters = operationParameters({ operation, plugin });
  const response = operationResponse({ operation, plugin });
  const pagination = operationPaginationInfo({ operation, plugin });

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

    node
      .params(...opParameters.parameters)
      // TODO: extract operation statements into a separate function
      .do(
        $.var('params').assign(
          $(plugin.imports.buildClientParams).call(
            fieldsList,
            ...paramNames.map((name) => $.kwarg(name, name)),
          ),
        ),
      );

    return implementResponse({
      methodName,
      node,
      pagination,
      paramNames,
      plugin,
      requestCall: $('self')
        .attr('client')
        .attr(method)
        .call($.literal(operation.path), $.kwarg('params', $('params') as never)),
      response,
    });
  }

  node.params(...opParameters.parameters);

  return implementResponse({
    methodName,
    node,
    pagination,
    paramNames: opParameters.parameters.map((parameter) => parameter.name.toString()),
    plugin,
    requestCall: $('self').attr('client').attr(method).call($.literal(operation.path)),
    response,
  });
}

export function toNode(
  model: StructureNode,
  plugin: HeyApiSdkPlugin['Instance'],
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
      const node = $.func(fnName).export().do($('None').return());
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
      const fnSymbol = createFnSymbol(plugin, item);
      const method = implementFn({
        methodName: fnSymbol.name,
        node: $.method(fnSymbol, (m) =>
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
      node.do(...childToNode(child, plugin));
    }
  }

  nodes.push(node);

  return {
    dependencies: shell.dependencies as Array<ReturnType<typeof $.class | typeof $.func>>,
    nodes,
  };
}
