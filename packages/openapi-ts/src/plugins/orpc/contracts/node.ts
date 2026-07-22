import type {
  StructureItem,
  StructureNode,
  StructureShell,
  Symbol,
  SymbolMeta,
} from '@hey-api/codegen-core';
import type { IR } from '@hey-api/shared';
import { applyNaming } from '@hey-api/shared';

import { $ } from '../../../ts-dsl';
import { createOperationComment } from '../../shared/utils/operation';
import { getSuccessResponse, getTags, hasInput } from '../shared/operation';
import type { OrpcPlugin } from '../types';

export interface ContractItem {
  operation: IR.OperationObject;
  path: ReadonlyArray<string | number>;
  tags: ReadonlyArray<string> | undefined;
}

export const source = globalThis.Symbol('orpc');

type QueryStyle =
  | 'array'
  | 'comma-delimited-array'
  | 'comma-delimited-object'
  | 'json'
  | 'pipe-delimited-array'
  | 'pipe-delimited-object'
  | 'primitive'
  | 'space-delimited-array'
  | 'space-delimited-object';

function createShellMeta(node: StructureNode): SymbolMeta {
  return {
    category: 'contract',
    resource: 'container',
    resourceId: node.getPath().join('.'),
  };
}

function createContractSymbol(
  plugin: OrpcPlugin['Instance'],
  item: StructureItem & { data: ContractItem },
): Symbol {
  const { operation, path, tags } = item.data;
  const name = item.location[item.location.length - 1]!;
  return plugin.symbol(applyNaming(name, plugin.config.contracts.contractName), {
    meta: {
      category: 'contract',
      path,
      resource: 'operation',
      resourceId: operation.id,
      role: 'contract',
      tags,
    },
  });
}

function resolveSchema(plugin: OrpcPlugin['Instance'], schema: IR.SchemaObject): IR.SchemaObject {
  let resolved = schema;
  const visited = new Set<string>();

  while (resolved.$ref && !visited.has(resolved.$ref)) {
    visited.add(resolved.$ref);
    resolved = plugin.context.resolveIrRef<IR.SchemaObject>(resolved.$ref);
  }

  return resolved;
}

function getQueryStyle(
  plugin: OrpcPlugin['Instance'],
  parameter: IR.ParameterObject,
): QueryStyle | undefined {
  const schema = resolveSchema(plugin, parameter.schema);

  if (schema.type === 'array' || schema.type === 'tuple') {
    if (parameter.style === 'form') {
      return parameter.explode ? 'array' : 'comma-delimited-array';
    }

    if (parameter.style === 'pipeDelimited') {
      return 'pipe-delimited-array';
    }

    if (parameter.style === 'spaceDelimited') {
      return 'space-delimited-array';
    }
  }

  if (schema.type === 'object') {
    // oRPC does not currently expose a queryStyles value for form-exploded
    // objects, so leave those on its bracket-notation default.
    if (parameter.style === 'form' && parameter.explode) {
      return;
    }

    if (parameter.style === 'form' && !parameter.explode) {
      return 'comma-delimited-object';
    }

    if (parameter.style === 'pipeDelimited') {
      return 'pipe-delimited-object';
    }

    if (parameter.style === 'spaceDelimited') {
      return 'space-delimited-object';
    }
  }

  if (parameter.style === 'form' && !parameter.explode) {
    return 'primitive';
  }
}

function createQueryStylesObject(
  plugin: OrpcPlugin['Instance'],
  operation: IR.OperationObject,
): ReturnType<typeof $.object> | undefined {
  const parameters = Object.values(operation.parameters?.query ?? {}).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const queryStyles = $.object();

  for (const parameter of parameters) {
    const style = getQueryStyle(plugin, parameter);
    if (style) {
      queryStyles.prop(parameter.name, $.literal(style));
    }
  }

  return queryStyles.hasProps() ? queryStyles : undefined;
}

function createRouteMetadataObject(
  plugin: OrpcPlugin['Instance'],
  operation: IR.OperationObject,
): ReturnType<typeof $.object> {
  const successResponse = getSuccessResponse(operation);
  const tags = getTags(operation, plugin.config.contracts.strategyDefaultTag);
  const metadata = $.object()
    .$if(operation.deprecated, (o, v) => o.prop('deprecated', $.literal(v)))
    .$if(operation.description, (o, v) => o.prop('description', $.literal(v)))
    .prop('inputStructure', $.literal('detailed'))
    .prop('method', $.literal(operation.method.toUpperCase()))
    .$if(operation.operationId, (o, v) => o.prop('operationId', $.literal(v)))
    .prop('path', $.literal(operation.path))
    .$if(plugin.config.inferQueryStyles && plugin.config.compatibilityVersion === '2', (o) => {
      const queryStyles = createQueryStylesObject(plugin, operation);
      return queryStyles ? o.prop('queryStyles', queryStyles) : o;
    })
    .$if(successResponse.statusCode !== 200 && successResponse.statusCode, (o, v) =>
      o.prop('successStatus', $.literal(v)),
    )
    .$if(operation.summary, (o, v) => o.prop('summary', $.literal(v)))
    .$if(Boolean(tags.length) && tags, (o, v) => o.prop('tags', $.fromValue(v)));

  return metadata;
}

function createContractExpression(
  plugin: OrpcPlugin['Instance'],
  operation: IR.OperationObject,
): ReturnType<typeof $.call> {
  const successResponse = getSuccessResponse(operation);
  const routeMetadata = createRouteMetadataObject(plugin, operation);

  let expression =
    plugin.config.compatibilityVersion === '2'
      ? $(plugin.imports.contract.oc)
          .attr('meta')
          .call($(plugin.imports.contract.openapi).call(routeMetadata))
      : $(plugin.imports.contract.oc).attr('route').call(routeMetadata);

  if (hasInput(operation) && plugin.config.validator.input) {
    const validator = plugin.getPluginOrThrow(plugin.config.validator.input);
    if ('createRequestSchema' in validator.api) {
      const requestSchema = validator.api.createRequestSchema({
        layers: {
          body: { whenEmpty: 'omit' },
          headers: { whenEmpty: 'omit' },
          path: { as: 'params', whenEmpty: 'omit' },
          query: { whenEmpty: 'omit' },
        },
        operation,
        outerOptional: true,
        // @ts-expect-error
        plugin: validator,
      });
      if (requestSchema) {
        expression = expression.attr('input').call(requestSchema);
      }
    }
  }

  if (successResponse.hasOutput && plugin.config.validator.output) {
    expression = expression.attr('output').call(
      // TODO: contract (cross)
      plugin.referenceSymbol({
        artifact: plugin.config.validator.output,
        category: 'schema',
        resource: 'operation',
        resourceId: operation.id,
        role: 'responses',
      }),
    );
  }

  return expression;
}

function buildContainerObject(
  node: StructureNode,
  plugin: OrpcPlugin['Instance'],
  symbols: Map<string, Symbol>,
): ReturnType<typeof $.object> {
  const obj = $.object();

  for (const item of node.itemsFrom<ContractItem>(source)) {
    const { operation } = item.data;
    const contractSymbol = symbols.get(operation.id)!;
    const name = item.location[item.location.length - 1]!;
    const propName = applyNaming(name, plugin.config.contracts.contractName);
    obj.prop(propName, contractSymbol);
  }

  for (const child of node.children.values()) {
    if (child.shell) {
      const childShell = child.shell.define(child);
      const childNode = childShell.node as ReturnType<typeof $.const>;
      const childSymbol = childNode.symbol;
      if (childSymbol) {
        const propName = applyNaming(child.name, plugin.config.contracts.segmentName);
        obj.prop(propName, childSymbol);
      }
    }
  }

  return obj;
}

export function createShell(plugin: OrpcPlugin['Instance']): StructureShell {
  const cache = new Map<string | number, ReturnType<typeof $.const>>();

  return {
    define: (node) => {
      const resourceId = node.getPath().join('.');
      const cached = cache.get(resourceId);
      if (cached) {
        return { dependencies: [], node: cached };
      }
      const symbol = plugin.symbol(
        applyNaming(
          node.name,
          node.isRoot ? plugin.config.contracts.containerName : plugin.config.contracts.segmentName,
        ),
        {
          meta: createShellMeta(node),
        },
      );

      const o = $.const(symbol).export().assign($.object());
      cache.set(resourceId, o);

      return { dependencies: [], node: o };
    },
  };
}

export function toNode(
  model: StructureNode,
  plugin: OrpcPlugin['Instance'],
): {
  nodes: ReadonlyArray<ReturnType<typeof $.const>>;
  symbols?: Map<string, Symbol>;
} {
  if (model.virtual) {
    const nodes: Array<ReturnType<typeof $.const>> = [];
    const symbols = new Map<string, Symbol>();

    for (const item of model.itemsFrom<ContractItem>(source)) {
      const { operation } = item.data;
      const contractSymbol = createContractSymbol(plugin, item);
      const expression = createContractExpression(plugin, operation);

      const node = $.const(contractSymbol)
        .export()
        .$if(createOperationComment(operation), (n, v) => n.doc(v))
        .assign(expression);
      nodes.push(node);
      symbols.set(operation.id, contractSymbol);
    }
    return { nodes, symbols };
  }

  if (!model.shell) {
    return { nodes: [] };
  }

  const nodes: Array<ReturnType<typeof $.const>> = [];
  const symbols = new Map<string, Symbol>();

  for (const item of model.itemsFrom<ContractItem>(source)) {
    const { operation } = item.data;
    const contractSymbol = createContractSymbol(plugin, item);
    const expression = createContractExpression(plugin, operation);

    const node = $.const(contractSymbol)
      .export()
      .$if(createOperationComment(operation), (n, v) => n.doc(v))
      .assign(expression);
    nodes.push(node);
    symbols.set(operation.id, contractSymbol);
  }

  const shell = model.shell.define(model);
  const containerSymbol = shell.node.symbol!;
  const obj = buildContainerObject(model, plugin, symbols);
  const containerNode = $.const(containerSymbol).export().assign(obj.pretty());
  nodes.push(containerNode);

  return { nodes, symbols };
}
