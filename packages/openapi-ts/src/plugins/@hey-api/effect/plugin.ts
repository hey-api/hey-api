import { log } from '@hey-api/codegen-core';
import type { IR } from '@hey-api/shared';
import { toCase } from '@hey-api/shared';

import type { ts } from '../../../ts-compiler';
import { $, type TsDsl } from '../../../ts-dsl';
import type { EffectPlugin } from './types';

type Expression = TsDsl<ts.Expression>;

type OperationEvent = {
  operation: IR.OperationObject;
  path: ReadonlyArray<string | number>;
  tags?: ReadonlyArray<string>;
};

type Group = {
  identifier: string;
  operations: Array<OperationEvent>;
  untagged: boolean;
};

type Diagnostics = {
  cookieParameters: number;
  security: number;
};

function callMethod(
  node: Expression,
  name: string,
  ...args: ReadonlyArray<Expression>
): Expression {
  return $.attr(node, name).call(...args);
}

function httpApiSchemaMember(plugin: EffectPlugin['Instance'], name: string) {
  return $(plugin.imports.HttpApiSchema).attr(name);
}

function schemaMember(plugin: EffectPlugin['Instance'], name: string) {
  return $(plugin.imports.Schema).attr(name);
}

function warn(plugin: EffectPlugin['Instance'], message: string): void {
  log.warn(`[${plugin.name}] ${message}`);
}

function safeClientIdentifier(value: string, fallback: string): string {
  let identifier = /^[A-Za-z_$][\w$]*$/.test(value) ? value : toCase(value, 'camelCase');
  identifier ||= fallback;
  if (identifier === 'then' || identifier in Object.prototype) {
    identifier = `${identifier}_`;
  }
  return identifier;
}

function uniqueClientIdentifier(value: string, fallback: string, used: Set<string>): string {
  const base = safeClientIdentifier(value, fallback);
  let identifier = base;
  let suffix = 2;
  while (used.has(identifier)) {
    identifier = `${base}_${suffix++}`;
  }
  used.add(identifier);
  return identifier;
}

function pathParameterNames(path: string): ReadonlyMap<string, string> {
  const names = new Map<string, string>();
  const used = new Set<string>();
  for (const match of path.matchAll(/{([^}]+)}/g)) {
    const source = match[1];
    if (source === undefined) continue;
    if (names.has(source)) continue;
    const base = source.replace(/\W/g, '_') || `path_${names.size + 1}`;
    let name = base;
    let suffix = 2;
    while (used.has(name)) {
      name = `${base}_${suffix++}`;
    }
    names.set(source, name);
    used.add(name);
  }
  return names;
}

function effectPath(path: string, names: ReadonlyMap<string, string>): string {
  return path.replace(/{([^}]+)}|:/g, (_, name: string | undefined) =>
    name === undefined ? '%3a' : `:${names.get(name) ?? name}`,
  );
}

function hasLiteralColon(path: string): boolean {
  return path.replace(/{[^}]+}/g, '').includes(':');
}

function operationSchemaName(operation: IR.OperationObject, suffix: string): string {
  return `${toCase(operation.id, 'PascalCase')}${suffix}`;
}

function parameterSchema(
  parameters: Record<string, IR.ParameterObject>,
  names?: ReadonlyMap<string, string>,
): IR.SchemaObject {
  const properties: Record<string, IR.SchemaObject> = {};
  const required: Array<string> = [];
  for (const parameter of Object.values(parameters)) {
    const name = names?.get(parameter.name) ?? parameter.name;
    properties[name] = parameter.schema;
    if (parameter.required) {
      required.push(name);
    }
  }
  return {
    additionalProperties: false,
    properties,
    required,
    type: 'object',
  };
}

function emitOperationSchema({
  multipart,
  name,
  operation,
  path,
  plugin,
  role,
  schema,
  tags,
}: {
  multipart?: boolean;
  name: string;
  operation: IR.OperationObject;
  path: ReadonlyArray<string | number>;
  plugin: EffectPlugin['Instance'];
  role: string;
  schema: IR.SchemaObject;
  tags?: ReadonlyArray<string>;
}) {
  const schemas = plugin.getPluginOrThrow('effect-schema');
  return schemas.api.emitSchema({
    meta: {
      resource: 'operation',
      resourceId: operation.id,
      role,
    },
    multipart,
    name,
    path,
    plugin: schemas,
    schema,
    tags,
  });
}

function schemaEncodesText(schema: IR.SchemaObject, plugin: EffectPlugin['Instance']): boolean {
  let current = schema;
  const visited = new Set<string>();
  while (current.$ref && !visited.has(current.$ref)) {
    visited.add(current.$ref);
    current = plugin.context.resolveIrRef<IR.SchemaObject>(current.$ref);
  }

  const items = current.items;
  return (
    current.type === 'string' ||
    typeof current.const === 'string' ||
    (current.type === 'enum' &&
      Boolean(items?.length) &&
      items !== undefined &&
      items.every((item) => typeof item.const === 'string'))
  );
}

function mediaEncoding(
  node: () => Expression,
  mediaType: string | undefined,
  plugin: EffectPlugin['Instance'],
  schema: IR.SchemaObject,
  source: string,
  direction: 'request' | 'response',
): Expression {
  if (!mediaType) return node();

  const normalized = (mediaType.split(';', 1)[0] ?? '').trim().toLowerCase();
  const options = $.object().prop('contentType', $.literal(mediaType));
  if (normalized === 'application/json' || normalized.endsWith('+json')) {
    return mediaType === 'application/json'
      ? node()
      : callMethod(node(), 'pipe', $(plugin.imports.HttpApiSchema).attr('asJson').call(options));
  }
  if (normalized === 'multipart/form-data') {
    if (direction === 'request') {
      return callMethod(node(), 'pipe', $(plugin.imports.HttpApiSchema).attr('asMultipart').call());
    }
    warn(plugin, `${source} uses multipart/form-data; it will be transported as Uint8Array`);
    return callMethod(
      schemaMember(plugin, 'Uint8Array'),
      'pipe',
      $(plugin.imports.HttpApiSchema).attr('asUint8Array').call(options),
    );
  }
  if (normalized === 'application/x-www-form-urlencoded' && schema.format !== 'binary') {
    return callMethod(
      node(),
      'pipe',
      $(plugin.imports.HttpApiSchema).attr('asFormUrlEncoded').call(),
    );
  }
  if (
    schema.format === 'binary' ||
    normalized === 'application/octet-stream' ||
    normalized.startsWith('audio/') ||
    normalized.startsWith('image/') ||
    normalized.startsWith('video/')
  ) {
    return callMethod(
      schema.format === 'binary' ? node() : schemaMember(plugin, 'Uint8Array'),
      'pipe',
      $(plugin.imports.HttpApiSchema)
        .attr('asUint8Array')
        .call(normalized === 'application/octet-stream' ? undefined : options),
    );
  }
  if (normalized === 'text/event-stream') {
    warn(
      plugin,
      `${source} uses text/event-stream; server-sent events are not supported and will be buffered as string`,
    );
    return callMethod(
      schemaMember(plugin, 'String'),
      'pipe',
      $(plugin.imports.HttpApiSchema).attr('asText').call(options),
    );
  }
  if (normalized.startsWith('text/')) {
    const encodedAsText = schemaEncodesText(schema, plugin);
    if (!encodedAsText) {
      warn(plugin, `${source} does not define a string schema; it will be transported as string`);
    }
    return callMethod(
      encodedAsText ? node() : schemaMember(plugin, 'String'),
      'pipe',
      $(plugin.imports.HttpApiSchema)
        .attr('asText')
        .call(mediaType === 'text/plain' ? undefined : options),
    );
  }
  warn(plugin, `${source} uses ${mediaType}; it will be transported as Uint8Array`);
  return callMethod(
    schemaMember(plugin, 'Uint8Array'),
    'pipe',
    $(plugin.imports.HttpApiSchema).attr('asUint8Array').call(options),
  );
}

function responseSet({
  operation,
  path,
  plugin,
  success,
  tags,
}: OperationEvent & {
  plugin: EffectPlugin['Instance'];
  success: boolean;
}): Expression | undefined {
  const schemas: Array<Expression> = [];

  for (const [statusCode, response] of Object.entries(operation.responses ?? {})) {
    if (!response) continue;
    if (statusCode === 'default') continue;
    if (!/^\d{3}$/.test(statusCode)) {
      warn(
        plugin,
        `${operation.id} declares response "${statusCode}", which Effect HttpApi cannot represent exactly; it will remain an unexpected-status failure`,
      );
      continue;
    }

    const status = Number(statusCode);
    const isSuccess = status >= 200 && status < 300;
    if (isSuccess !== success) continue;

    if (response.schema.type === 'void' || responseHasNoBody(operation, status)) {
      schemas.push(httpApiSchemaMember(plugin, 'Empty').call($.literal(status)));
      continue;
    }

    let node = mediaEncoding(
      () =>
        $(
          emitOperationSchema({
            name: operationSchemaName(operation, `Response${statusCode}`),
            operation,
            path: [...path, 'responses', statusCode],
            plugin,
            role: success ? 'response' : 'error',
            schema: response.schema,
            tags,
          }),
        ),
      response.mediaType,
      plugin,
      response.schema,
      `${operation.id} response ${statusCode}`,
      'response',
    );
    node = callMethod(node, 'pipe', httpApiSchemaMember(plugin, 'status').call($.literal(status)));
    schemas.push(node);
  }

  if (!schemas.length) return;
  return schemas.length === 1 ? schemas[0] : $.array(...schemas);
}

function methodSupportsBody(method: IR.OperationObject['method']): boolean {
  return method !== 'get' && method !== 'head' && method !== 'options' && method !== 'trace';
}

function responseHasNoBody(operation: IR.OperationObject, status: number): boolean {
  return (
    operation.method === 'head' ||
    (status >= 100 && status < 200) ||
    status === 204 ||
    status === 205 ||
    status === 304
  );
}

function parameterShape(
  schema: IR.SchemaObject,
  plugin: EffectPlugin['Instance'],
  visited = new Set<string>(),
): { array: boolean; object: boolean } {
  let array = schema.type === 'array' || schema.type === 'tuple';
  let object = schema.type === 'object';

  if (schema.$ref && !visited.has(schema.$ref)) {
    visited.add(schema.$ref);
    const shape = parameterShape(
      plugin.context.resolveIrRef<IR.SchemaObject>(schema.$ref),
      plugin,
      visited,
    );
    array ||= shape.array;
    object ||= shape.object;
  }
  for (const item of schema.items ?? []) {
    const shape = parameterShape(item, plugin, visited);
    array ||= shape.array;
    object ||= shape.object;
  }

  return { array, object };
}

function usesUnsupportedParameterSerialization(
  parameter: IR.ParameterObject,
  plugin: EffectPlugin['Instance'],
): boolean {
  const shape = parameterShape(parameter.schema, plugin);
  if (shape.object || (parameter.location === 'path' && shape.array)) {
    return true;
  }

  const defaultStyle =
    parameter.location === 'query' || parameter.location === 'cookie' ? 'form' : 'simple';
  if (parameter.style !== defaultStyle || parameter.allowReserved === true) {
    return true;
  }

  const defaultExplode = parameter.location === 'query' || parameter.location === 'cookie';
  return shape.array && parameter.explode !== defaultExplode;
}

function operationToEndpoint(
  event: OperationEvent,
  plugin: EffectPlugin['Instance'],
  diagnostics: Diagnostics,
  identifier = event.operation.id,
): Expression {
  const { operation, path, tags } = event;
  const options = $.object().pretty();
  const parameters = operation.parameters;
  const pathNames = pathParameterNames(operation.path);

  if (
    parameters &&
    [
      ...Object.values(parameters.header ?? {}),
      ...Object.values(parameters.path ?? {}),
      ...Object.values(parameters.query ?? {}),
    ].some((parameter) => usesUnsupportedParameterSerialization(parameter, plugin))
  ) {
    warn(
      plugin,
      `${operation.id} has parameter serialization that Effect HttpApi cannot represent exactly`,
    );
  }

  if (operation.parameters?.path) {
    for (const [source, name] of pathNames) {
      if (source !== name) {
        warn(
          plugin,
          `${operation.id} path parameter "${source}" is exposed as "${name}" because Effect requires word-character parameter names`,
        );
      }
    }
    const symbol = emitOperationSchema({
      name: operationSchemaName(operation, 'PathParams'),
      operation,
      path: [...path, 'path'],
      plugin,
      role: 'request-path',
      schema: parameterSchema(operation.parameters.path, pathNames),
      tags,
    });
    options.prop('params', $(symbol));
  }

  if (operation.parameters?.query) {
    const symbol = emitOperationSchema({
      name: operationSchemaName(operation, 'Query'),
      operation,
      path: [...path, 'query'],
      plugin,
      role: 'request-query',
      schema: parameterSchema(operation.parameters.query),
      tags,
    });
    options.prop('query', $(symbol));
  }

  if (operation.parameters?.header) {
    const symbol = emitOperationSchema({
      name: operationSchemaName(operation, 'Headers'),
      operation,
      path: [...path, 'headers'],
      plugin,
      role: 'request-headers',
      schema: parameterSchema(operation.parameters.header),
      tags,
    });
    options.prop('headers', $(symbol));
  }

  if (operation.parameters?.cookie) {
    diagnostics.cookieParameters++;
  }

  if (operation.body) {
    if (!methodSupportsBody(operation.method)) {
      warn(plugin, `${operation.id} declares a request body on ${operation.method.toUpperCase()}`);
    } else {
      const multipart = operation.body.mediaType === 'multipart/form-data';
      const payload = mediaEncoding(
        () =>
          $(
            emitOperationSchema({
              multipart,
              name: operationSchemaName(operation, 'Payload'),
              operation,
              path: [...path, 'body'],
              plugin,
              role: 'request-body',
              schema: operation.body!.schema,
              tags,
            }),
          ),
        operation.body.mediaType,
        plugin,
        operation.body.schema,
        `${operation.id} request body`,
        'request',
      );
      options.prop(
        'payload',
        operation.body.required
          ? payload
          : $.array(httpApiSchemaMember(plugin, 'NoContent'), payload),
      );
    }
  }

  const success = responseSet({ ...event, plugin, success: true });
  if (success) {
    options.prop('success', success);
  }
  const error = responseSet({ ...event, plugin, success: false });
  if (error) {
    options.prop('error', error);
  }
  if (operation.responses?.default) {
    warn(plugin, `${operation.id} declares a default response that Effect HttpApi cannot model`);
  }

  if (operation.security?.length) {
    diagnostics.security++;
  }

  const endpointFactory =
    operation.method === 'trace'
      ? $(plugin.imports.HttpApiEndpoint).attr('make').call($.literal('TRACE'))
      : $(plugin.imports.HttpApiEndpoint).attr(operation.method);
  const endpoint = endpointFactory.call(
    $.literal(identifier),
    $.literal(effectPath(operation.path, pathNames)),
    options.isEmpty ? undefined : options,
  );
  return endpoint;
}

function emitGroup(group: Group, plugin: EffectPlugin['Instance'], diagnostics: Diagnostics) {
  const groupName = `${toCase(group.identifier, 'PascalCase') || 'Default'}Group`;
  const groupSymbol = plugin.symbol(groupName, {
    meta: {
      category: 'utility',
      resource: 'client',
    },
  });
  let expression: Expression = $(plugin.imports.HttpApiGroup)
    .attr('make')
    .call($.literal(group.identifier));
  const identifiers = new Set<string>();
  const endpoints = group.operations.map((operation) => {
    const identifier = uniqueClientIdentifier(
      operation.operation.id,
      `operation${identifiers.size + 1}`,
      identifiers,
    );
    if (identifier !== operation.operation.id) {
      warn(
        plugin,
        `${operation.operation.id} is exposed as "${identifier}" to provide safe client property access`,
      );
    }
    return operationToEndpoint(operation, plugin, diagnostics, identifier);
  });
  if (endpoints.length) {
    expression = callMethod(expression, 'add', ...endpoints);
  }
  plugin.node($.const(groupSymbol).assign(expression));
  return groupSymbol;
}

function emitClient(
  groups: ReadonlyArray<Group>,
  plugin: EffectPlugin['Instance'],
  diagnostics: Diagnostics,
): void {
  const groupSymbols = groups.map((group) => emitGroup(group, plugin, diagnostics));
  const restoresLiteralColons = groups.some((group) =>
    group.operations.some(({ operation }) => hasLiteralColon(operation.path)),
  );

  const apiSymbol = plugin.symbol(plugin.config.apiName, {
    meta: {
      category: 'utility',
      resource: 'client',
    },
  });
  let api: Expression = $(plugin.imports.HttpApi)
    .attr('make')
    .call($.literal(plugin.config.apiName));
  if (groupSymbols.length) {
    api = callMethod(api, 'add', ...groupSymbols.map((symbol) => $(symbol)));
  }
  plugin.node($.const(apiSymbol).export().assign(api));

  const makeClientSymbol = plugin.symbol('makeClient', {
    meta: {
      category: 'utility',
      resource: 'client',
    },
  });
  const httpClientType = $.type(plugin.imports.HttpClient).attr('HttpClient');
  const effectType = $.type(plugin.imports.Effect)
    .attr('Effect')
    .generics('unknown', 'unknown', 'unknown');
  const optionsType = $.type
    .object()
    .prop('baseUrl', (property) =>
      property
        .readonly()
        .optional()
        .type($.type.or('URL', 'string', 'undefined')),
    )
    .prop('transformClient', (property) =>
      property
        .readonly()
        .optional()
        .type(
          $.type.or(
            $.type
              .func()
              .param('client', (parameter) => parameter.type(httpClientType))
              .returns(httpClientType),
            'undefined',
          ),
        ),
    )
    .prop('transformResponse', (property) =>
      property
        .readonly()
        .optional()
        .type(
          $.type.or(
            $.type
              .func()
              .param('effect', (parameter) => parameter.type(effectType))
              .returns(effectType),
            'undefined',
          ),
        ),
    );
  const options = restoresLiteralColons
    ? $.object()
        .spread('options')
        .prop(
          'transformClient',
          $.func()
            .param('client')
            .do(
              $(plugin.imports.HttpClient)
                .attr('mapRequest')
                .call(
                  $.ternary($('options').attr('transformClient').optional())
                    .do($('options').attr('transformClient').call('client'))
                    .otherwise('client'),
                  $.func()
                    .param('request')
                    .do(
                      $(plugin.imports.HttpClientRequest)
                        .attr('setUrl')
                        .call(
                          'request',
                          $('request')
                            .attr('url')
                            .attr('replaceAll')
                            .call($.literal('%3a'), $.literal(':')),
                        )
                        .return(),
                    ),
                )
                .return(),
            ),
        )
    : $('options');
  const makeClient = $.func(makeClientSymbol)
    .export()
    .param('options', (param) => param.optional().type(optionsType))
    .do($(plugin.imports.HttpApiClient).attr('make').call($(apiSymbol), options).return());
  if (restoresLiteralColons) {
    makeClient.doc(
      'Restores literal colons in generated paths after Effect expands path parameters. Parameter values are encoded before the lowercase `%3a` marker is replaced.',
    );
  }
  plugin.node(makeClient);
}

export const handler: EffectPlugin['Handler'] = ({ plugin }) => {
  const untaggedGroupKey = Symbol();
  const groups = new Map<string | symbol, Group>();
  plugin.forEach(
    'operation',
    ({ _path, operation, tags }) => {
      const identifier = operation.tags?.[0] ?? 'default';
      const groupKey = operation.tags?.length ? identifier : untaggedGroupKey;
      if ((operation.tags?.length ?? 0) > 1) {
        warn(plugin, `${operation.id} has multiple tags; only "${identifier}" controls grouping`);
      }
      const group = groups.get(groupKey) ?? {
        identifier,
        operations: [],
        untagged: !operation.tags?.length,
      };
      group.operations.push({
        operation,
        path: _path,
        tags,
      });
      groups.set(groupKey, group);
    },
    {
      order: 'declarations',
    },
  );

  const orderedGroups = [...groups.values()];
  const groupIdentifiers = new Set<string>();
  for (const group of [...orderedGroups].sort(
    (left, right) => Number(left.untagged) - Number(right.untagged),
  )) {
    const source = group.identifier;
    const normalized = safeClientIdentifier(source, 'default');
    group.identifier = uniqueClientIdentifier(source, 'default', groupIdentifiers);
    if (group.identifier !== normalized && !group.untagged) {
      warn(
        plugin,
        `group "${source}" is exposed as "${group.identifier}" to provide safe client property access`,
      );
    }
  }

  const diagnostics: Diagnostics = {
    cookieParameters: 0,
    security: 0,
  };
  emitClient(orderedGroups, plugin, diagnostics);
  if (diagnostics.cookieParameters) {
    warn(
      plugin,
      `${diagnostics.cookieParameters} operation${diagnostics.cookieParameters === 1 ? '' : 's'} declare cookie parameters; provide them through HttpApiClient.make({ transformClient })`,
    );
  }
  if (diagnostics.security) {
    warn(
      plugin,
      `${diagnostics.security} operation${diagnostics.security === 1 ? '' : 's'} declare security; provide credentials through HttpApiClient.make({ transformClient })`,
    );
  }
};
