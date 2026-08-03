import { fromRef, log, ref, type Symbol } from '@hey-api/codegen-core';
import type { IR, NamingOptions, SchemaVisitor, SchemaVisitorContext } from '@hey-api/shared';
import {
  buildSymbolIn,
  createSchemaWalker,
  jsonPointerToPath,
  pathToJsonPointer,
  pathToName,
} from '@hey-api/shared';

import type { ts } from '../../ts-compiler';
import { $, type TsDsl } from '../../ts-dsl';
import { createSchemaComment } from '../shared/utils/schema';
import type { EffectSchemaPlugin } from './types';

type Expression = TsDsl<ts.Expression>;

export type SchemaContext = {
  fileInput?: boolean;
  multipart?: boolean;
  path: ReadonlyArray<string | number>;
  plugin: EffectSchemaPlugin['Instance'];
};

type SchemaWalkerPlugin = {
  fileInput?: boolean;
  instance: EffectSchemaPlugin['Instance'];
  multipart?: boolean;
};

export type EmitSchemaOptions = SchemaContext & {
  meta: {
    resource: 'definition' | 'operation' | 'webhook';
    resourceId: string;
    role?: string;
  };
  name: string;
  naming?: NamingOptions;
  schema: IR.SchemaObject;
  tags?: ReadonlyArray<string>;
};

const effectDefinitionQuery = (resourceId: string) =>
  ({
    artifact: 'effect-schema',
    category: 'schema',
    resource: 'definition',
    resourceId,
  }) as const;

const effectFileInputDefinitionQuery = (resourceId: string) =>
  ({
    ...effectDefinitionQuery(resourceId),
    role: 'fileInput',
  }) as const;

const typeScriptDefinitionQuery = (resourceId: string) =>
  ({
    artifact: 'types',
    category: 'type',
    resource: 'definition',
    resourceId,
  }) as const;

const effectSchemaTypeQuery = {
  artifact: 'effect-schema',
  category: 'utility',
  resource: 'client',
  resourceId: 'schemaType',
} as const;

function schemaMember(plugin: EffectSchemaPlugin['Instance'], name: string) {
  return $(plugin.imports.Schema).attr(name);
}

function callMethod(
  node: Expression,
  name: string,
  ...args: ReadonlyArray<Expression>
): Expression {
  return $.attr(node, name).call(...args);
}

function callSchema(
  plugin: EffectSchemaPlugin['Instance'],
  name: string,
  ...args: ReadonlyArray<Expression>
): Expression {
  return schemaMember(plugin, name).call(...args);
}

function warn(plugin: EffectSchemaPlugin['Instance'], message: string): void {
  log.warn(`[${plugin.name}] ${message}`);
}

const DATE_SOURCE =
  '(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))';
const TIME_SOURCE =
  '(?:[01]\\d|2[0-3]):[0-5]\\d:(?:[0-5]\\d|60)(?:\\.\\d+)?(?:[zZ]|[+-](?:[01]\\d|2[0-3]):[0-5]\\d)';

const FORMAT_PATTERNS: Readonly<Record<string, { expected: string; pattern: RegExp }>> = {
  date: {
    expected: 'an ISO 8601 date',
    pattern: new RegExp(`^${DATE_SOURCE}$`),
  },
  'date-time': {
    expected: 'an RFC 3339 date-time',
    pattern: new RegExp(`^${DATE_SOURCE}[tT]${TIME_SOURCE}$`),
  },
  email: {
    expected: 'an email address',
    pattern:
      /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9-]*\.)+[A-Za-z]{2,}$/,
  },
  hostname: {
    expected: 'a hostname',
    pattern:
      /^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/,
  },
  ipv4: {
    expected: 'an IPv4 address',
    pattern:
      /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
  },
  ipv6: {
    expected: 'an IPv6 address',
    pattern:
      /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/,
  },
  time: {
    expected: 'an RFC 3339 time',
    pattern: new RegExp(`^${TIME_SOURCE}$`),
  },
};

function formatCheck(
  format: string | undefined,
  plugin: EffectSchemaPlugin['Instance'],
): Expression | undefined {
  if (format === 'uuid') {
    return callSchema(plugin, 'isUUID');
  }
  if (format === 'guid') {
    return callSchema(plugin, 'isGUID');
  }
  if (format === 'uri' || format === 'url') {
    return callSchema(
      plugin,
      'makeFilter',
      $.func().param('value').do($.attr('URL', 'canParse').call('value').return()),
      $.object().prop('expected', $.literal('a valid URL')),
    );
  }
  const entry = format ? FORMAT_PATTERNS[format] : undefined;
  if (!entry) return;
  if (format === 'date-time' || format === 'time') {
    const normalized = callMethod($('value'), 'replace', $.literal(':60'), $.literal(':59'));
    const parsed = $.new(
      $.attr('globalThis', 'Date'),
      format === 'time' ? $.binary($.literal('2000-01-01T')).plus(normalized) : normalized,
    );
    const invalidTime = $.binary(
      $.binary(callMethod($('parsed'), 'getUTCHours')).neq($.literal(23)),
    ).or($.binary(callMethod($('parsed'), 'getUTCMinutes')).neq($.literal(59)));
    const validDate = $.binary(
      $.binary($.binary(callMethod($('parsed'), 'getUTCMonth')).eq($.literal(5))).and(
        $.binary(callMethod($('parsed'), 'getUTCDate')).eq($.literal(30)),
      ),
    ).or(
      $.binary($.binary(callMethod($('parsed'), 'getUTCMonth')).eq($.literal(11))).and(
        $.binary(callMethod($('parsed'), 'getUTCDate')).eq($.literal(31)),
      ),
    );
    return callSchema(
      plugin,
      'makeFilter',
      $.func()
        .param('value')
        .do(
          $.if($.not(callMethod($.regexp(entry.pattern.source), 'test', $('value')))).do(
            $.return($.literal(false)),
          ),
          $.if($.not(callMethod($('value'), 'includes', $.literal(':60')))).do(
            $.return($.literal(true)),
          ),
          $.const('parsed').assign(parsed),
          $.if(invalidTime).do($.return($.literal(false))),
          $.return(format === 'date-time' ? validDate : $.literal(true)),
        ),
      $.object().prop('expected', $.literal(entry.expected)),
    );
  }
  return callSchema(
    plugin,
    'isPattern',
    $.regexp(entry.pattern.source),
    $.object().prop('expected', $.literal(entry.expected)),
  );
}

function forbidsAdditionalProperties(schema: IR.SchemaObject): boolean {
  return schema.additionalProperties === false || schema.additionalProperties?.type === 'never';
}

function additionalPropertiesKey(
  schema: IR.SchemaObject,
  plugin: EffectSchemaPlugin['Instance'],
): Expression {
  const checks: Array<string> = [];
  const properties = Object.keys(schema.properties ?? {});
  if (properties.length) {
    const names = properties.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    checks.push(`(?!(?:${names})$)`);
  }
  for (const pattern of Object.keys(schema.patternProperties ?? {})) {
    checks.push(`(?![\\s\\S]*(?:${pattern}))`);
  }
  if (!checks.length) {
    return schemaMember(plugin, 'String');
  }

  return applyChecks(
    schemaMember(plugin, 'String'),
    {
      pattern: `^${checks.join('')}[\\s\\S]*$`,
      type: 'string',
    },
    plugin,
  );
}

function literalSchema(value: unknown, ctx: SchemaContext): Expression {
  const { plugin } = ctx;
  if (value === null) {
    return schemaMember(plugin, 'Null');
  }
  if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
    return callSchema(plugin, 'Literal', $.fromValue(value));
  }
  if (Array.isArray(value)) {
    return callSchema(plugin, 'Tuple', $.array(...value.map((item) => literalSchema(item, ctx))));
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value);
    return objectToExpression(
      {
        additionalProperties: false,
        properties: Object.fromEntries(
          entries.map(([name, item]) => [name, { const: item } satisfies IR.SchemaObject]),
        ),
        required: entries.map(([name]) => name),
        type: 'object',
      },
      ctx,
    );
  }
  return schemaMember(plugin, 'Never');
}

function applyChecks(
  node: Expression,
  schema: IR.SchemaObject,
  plugin: EffectSchemaPlugin['Instance'],
): Expression {
  const checks: Array<Expression> = [];
  const type = constraintType(schema, plugin);

  if (type === 'integer') {
    checks.push(callSchema(plugin, 'isInt'));
  } else if (type === 'number') {
    checks.push(callSchema(plugin, 'isFinite'));
  }

  if (type === 'array' || type === 'string' || type === 'tuple') {
    const minimum = type === 'string' ? schema.minLength : schema.minItems;
    const maximum = type === 'string' ? schema.maxLength : schema.maxItems;
    if (minimum !== undefined) {
      checks.push(callSchema(plugin, 'isMinLength', $.literal(minimum)));
    }
    if (maximum !== undefined) {
      checks.push(callSchema(plugin, 'isMaxLength', $.literal(maximum)));
    }
  }

  if (type === 'string' && schema.pattern) {
    checks.push(callSchema(plugin, 'isPattern', $.new('RegExp', $.literal(schema.pattern))));
  }
  if (type === 'string') {
    const check = formatCheck(schema.format, plugin);
    if (check) checks.push(check);
  }

  if (type === 'integer' || type === 'number') {
    if (schema.minimum !== undefined) {
      checks.push(callSchema(plugin, 'isGreaterThanOrEqualTo', $.literal(schema.minimum)));
    }
    if (schema.maximum !== undefined) {
      checks.push(callSchema(plugin, 'isLessThanOrEqualTo', $.literal(schema.maximum)));
    }
    if (typeof schema.exclusiveMinimum === 'number') {
      checks.push(callSchema(plugin, 'isGreaterThan', $.literal(schema.exclusiveMinimum)));
    }
    if (typeof schema.exclusiveMaximum === 'number') {
      checks.push(callSchema(plugin, 'isLessThan', $.literal(schema.exclusiveMaximum)));
    }
  }

  return checks.length ? callMethod(node, 'check', ...checks) : node;
}

function constraintType(
  schema: IR.SchemaObject,
  plugin: EffectSchemaPlugin['Instance'],
  seen = new Set<string>(),
): IR.SchemaObject['type'] {
  if (schema.const !== undefined) {
    if (typeof schema.const === 'string') return 'string';
    if (typeof schema.const === 'number') {
      return schema.type === 'number' || !Number.isInteger(schema.const) ? 'number' : 'integer';
    }
    if (typeof schema.const === 'boolean') return 'boolean';
    if (schema.const === null) return 'null';
  }
  if (schema.type && schema.type !== 'enum') {
    return schema.type;
  }
  if (schema.$ref && !seen.has(schema.$ref)) {
    seen.add(schema.$ref);
    return constraintType(plugin.context.resolveIrRef<IR.SchemaObject>(schema.$ref), plugin, seen);
  }
  if (!schema.items?.length) {
    return;
  }
  const types = schema.items.map((item) => constraintType(item, plugin, seen));
  if (types.some((type) => type === undefined)) {
    return;
  }
  const unique = new Set(types);
  if (unique.size === 1) {
    return types[0];
  }
  if ([...unique].every((type) => type === 'integer' || type === 'number')) {
    return 'number';
  }
}

function applyAnnotations(node: Expression, schema: IR.SchemaObject): Expression {
  const annotations = $.object();
  if (schema.title) {
    annotations.prop('title', $.literal(schema.title));
  }
  if (schema.description) {
    annotations.prop('description', $.literal(schema.description));
  }
  if (schema.format && schema.format !== 'binary') {
    annotations.prop('format', $.literal(schema.format));
  }
  return annotations.isEmpty ? node : callMethod(node, 'annotate', annotations);
}

function dereferenceWithOmit(
  schema: IR.SchemaObject,
  plugin: EffectSchemaPlugin['Instance'],
): IR.SchemaObject {
  const resourceId = schema.$ref;
  if (resourceId === undefined) {
    warn(plugin, 'cannot dereference a schema without $ref; using Schema.Unknown');
    return { type: 'unknown' };
  }
  const resolved = plugin.context.resolveIrRef<IR.SchemaObject>(resourceId);
  const { $ref: _ref, omit, ...siblings } = schema;
  const properties = {
    ...resolved.properties,
    ...siblings.properties,
  };
  for (const property of omit ?? []) {
    delete properties[property];
  }
  return {
    ...resolved,
    ...siblings,
    ...(Object.keys(properties).length ? { properties } : {}),
  };
}

function referenceToExpression(schema: IR.SchemaObject, ctx: SchemaContext): Expression {
  const { plugin } = ctx;
  const resourceId = schema.$ref;
  if (resourceId === undefined) {
    warn(plugin, `expected $ref at ${ctx.path.join('.')}; using Schema.Unknown`);
    return schemaMember(plugin, 'Unknown');
  }

  const resolved = plugin.context.resolveIrRef<IR.SchemaObject>(resourceId);
  if (ctx.fileInput && resolved.format === 'binary') {
    return callSchema(plugin, 'instanceOf', $.attr('globalThis', 'Blob'));
  }

  if (schema.omit?.length) {
    return schemaToExpression(dereferenceWithOmit(schema, plugin), ctx);
  }

  if (ctx.fileInput && schemaContainsBinary(resolved, plugin)) {
    const query = effectFileInputDefinitionQuery(resourceId);
    const symbol = plugin.referenceSymbol(query);
    if (plugin.isSymbolRegistered(query)) {
      const typeSymbol = plugin.querySymbol(typeScriptDefinitionQuery(resourceId));
      const type = typeSymbol ? $.type(typeSymbol) : $.type('unknown');
      const codecType = $.type(plugin.imports.Schema).attr('Codec').generic(type);
      return callSchema(plugin, 'suspend', $.func().returns(codecType).do($(symbol).return()));
    }

    const definitionPath = jsonPointerToPath(resourceId);
    const path = [...definitionPath, 'fileInput'];
    const registered = plugin.symbol(
      buildSymbolIn({
        meta: {
          category: 'schema',
          path,
          resource: 'definition',
          resourceId,
          role: 'fileInput',
        },
        name: `${pathToName(definitionPath)}FileInput`,
        naming: plugin.config.definitions,
        path,
        plugin,
        schema: resolved,
      }),
    );
    plugin.node($.const(registered).assign(schemaToExpression(resolved, { ...ctx, path })));
    return $(registered);
  }

  const query = effectDefinitionQuery(resourceId);
  const symbol = plugin.referenceSymbol(query);
  if (plugin.isSymbolRegistered(query)) {
    return $(symbol);
  }

  const typeSymbol = plugin.querySymbol(typeScriptDefinitionQuery(resourceId));
  const type =
    typeSymbol && schemaContainsBinary(resolved, plugin)
      ? $.type(effectSchemaType(plugin)).generic($.type(typeSymbol))
      : typeSymbol
        ? $.type(typeSymbol)
        : $.type('unknown');
  const codecType = $.type(plugin.imports.Schema).attr('Codec').generic(type);
  const thunk = $.func().returns(codecType).do($(symbol).return());
  return callSchema(plugin, 'suspend', thunk);
}

function effectSchemaType(plugin: EffectSchemaPlugin['Instance']): Symbol {
  if (plugin.isSymbolRegistered(effectSchemaTypeQuery)) {
    return plugin.referenceSymbol(effectSchemaTypeQuery);
  }

  const symbol = plugin.symbol('EffectSchemaType', {
    meta: {
      category: 'utility',
      resource: 'client',
      resourceId: effectSchemaTypeQuery.resourceId,
    },
  });
  const mapped = $.type
    .mapped('Key')
    .key($.type.operator().keyof('Value'))
    .type($.type(symbol).generic($.type.idx('Value', 'Key')));
  const mappable = $.type.or(
    $.type('ReadonlyArray').generics('unknown'),
    $.type('Record').generics('string', 'unknown'),
  );
  const type = $.type
    .ternary('Value')
    .extends('Blob')
    .do('Uint8Array')
    .otherwise($.type.ternary('Value').extends(mappable).do(mapped).otherwise('Value'));
  plugin.node($.type.alias(symbol).generic('Value').type(type));
  return symbol;
}

function schemaContainsBinary(
  schema: IR.SchemaObject,
  plugin: EffectSchemaPlugin['Instance'],
  seen = new Set<string>(),
): boolean {
  if (schema.format === 'binary') {
    return true;
  }
  if (schema.$ref && !seen.has(schema.$ref)) {
    seen.add(schema.$ref);
    if (
      schemaContainsBinary(plugin.context.resolveIrRef<IR.SchemaObject>(schema.$ref), plugin, seen)
    ) {
      return true;
    }
  }
  const children = [
    ...(schema.items ?? []),
    ...Object.values(schema.properties ?? {}),
    ...Object.values(schema.patternProperties ?? {}),
    ...(schema.additionalProperties ? [schema.additionalProperties] : []),
    ...(schema.propertyNames ? [schema.propertyNames] : []),
  ];
  return children.some((child) => schemaContainsBinary(child, plugin, seen));
}

function mergeObjectIntersection(schema: IR.SchemaObject, ctx: SchemaContext): IR.SchemaObject {
  const candidates = [...(schema.items ?? [])];
  if (schema.properties || schema.patternProperties || schema.additionalProperties !== undefined) {
    const { items: _items, logicalOperator: _logicalOperator, ...self } = schema;
    candidates.push(self);
  }

  const resolved: Array<IR.SchemaObject> = [];
  for (const candidate of candidates) {
    let current = candidate;
    if (current.$ref) {
      current = current.omit?.length
        ? dereferenceWithOmit(current, ctx.plugin)
        : ctx.plugin.context.resolveIrRef<IR.SchemaObject>(current.$ref);
    }
    if (current.logicalOperator === 'and') {
      current = mergeObjectIntersection(current, ctx);
    }
    if (current.type !== 'object' && !current.properties) {
      warn(
        ctx.plugin,
        `cannot merge non-object allOf member at ${ctx.path.join('.')}; using Schema.Unknown`,
      );
      return { type: 'unknown' };
    }
    resolved.push(current);
  }

  const properties: Record<string, IR.SchemaObject> = {};
  const patternProperties: Record<string, IR.SchemaObject> = {};
  const required = new Set<string>();
  let additionalProperties: IR.SchemaObject | false | undefined;

  for (const item of resolved) {
    for (const [name, property] of Object.entries(item.properties ?? {})) {
      const existing = properties[name];
      if (existing && JSON.stringify(existing) !== JSON.stringify(property)) {
        if (
          (existing.type === 'object' || existing.properties) &&
          (property.type === 'object' || property.properties)
        ) {
          properties[name] = mergeObjectIntersection(
            {
              items: [existing, property],
              logicalOperator: 'and',
            },
            ctx,
          );
        } else if (
          existing.type &&
          property.type &&
          existing.type !== property.type &&
          !(
            (existing.type === 'integer' && property.type === 'number') ||
            (existing.type === 'number' && property.type === 'integer')
          )
        ) {
          properties[name] = { type: 'never' };
        } else {
          properties[name] = {
            items: [existing, property],
            logicalOperator: 'and',
          };
        }
      } else {
        properties[name] = property;
      }
    }
    for (const [pattern, property] of Object.entries(item.patternProperties ?? {})) {
      const existing = patternProperties[pattern];
      patternProperties[pattern] =
        existing && JSON.stringify(existing) !== JSON.stringify(property)
          ? {
              items: [existing, property],
              logicalOperator: 'and',
            }
          : property;
    }
    for (const name of item.required ?? []) {
      required.add(name);
    }
    if (item.additionalProperties === false) {
      additionalProperties = false;
    } else if (additionalProperties !== false && item.additionalProperties) {
      additionalProperties =
        additionalProperties &&
        JSON.stringify(additionalProperties) !== JSON.stringify(item.additionalProperties)
          ? {
              items: [additionalProperties, item.additionalProperties],
              logicalOperator: 'and',
            }
          : item.additionalProperties;
    }
  }

  return {
    ...(additionalProperties !== undefined ? { additionalProperties } : {}),
    ...(Object.keys(patternProperties).length ? { patternProperties } : {}),
    ...(Object.keys(properties).length ? { properties } : {}),
    ...(required.size ? { required: [...required] } : {}),
    type: 'object',
  };
}

function isObjectIntersectionMember(schema: IR.SchemaObject, ctx: SchemaContext): boolean {
  let current = schema;
  if (current.$ref) {
    current = current.omit?.length
      ? dereferenceWithOmit(current, ctx.plugin)
      : ctx.plugin.context.resolveIrRef<IR.SchemaObject>(current.$ref);
  }
  if (current.logicalOperator === 'and') {
    const items = current.items;
    return (
      items !== undefined &&
      items.length > 0 &&
      items.every((item) => isObjectIntersectionMember(item, ctx))
    );
  }
  return current.type === 'object' || Boolean(current.properties);
}

function objectToExpression(schema: IR.SchemaObject, ctx: SchemaContext): Expression {
  const { plugin } = ctx;
  const shape = $.object().pretty();
  const required = new Set(schema.required ?? []);
  const hasProperties = Boolean(Object.keys(schema.properties ?? {}).length);
  const dictionaryValue = forbidsAdditionalProperties(schema)
    ? undefined
    : schema.additionalProperties;

  for (const [name, property] of Object.entries(schema.properties ?? {})) {
    let propertyNode = schemaToExpression(property, {
      ...ctx,
      path: [...ctx.path, 'properties', name],
    });
    if (!required.has(name)) {
      propertyNode = callSchema(plugin, 'optionalKey', propertyNode);
    }
    shape.prop(name, propertyNode);
  }

  const struct = callSchema(plugin, 'Struct', shape);
  const rest: Array<Expression> = [];

  for (const [pattern, property] of Object.entries(schema.patternProperties ?? {})) {
    const key = applyChecks(schemaMember(plugin, 'String'), { pattern, type: 'string' }, plugin);
    rest.push(
      callSchema(
        plugin,
        'Record',
        key,
        schemaToExpression(property, {
          ...ctx,
          path: [...ctx.path, 'patternProperties', pattern],
        }),
      ),
    );
  }

  if (dictionaryValue) {
    rest.push(
      callSchema(
        plugin,
        'Record',
        additionalPropertiesKey(schema, plugin),
        schemaToExpression(dictionaryValue, {
          ...ctx,
          path: [...ctx.path, 'additionalProperties'],
        }),
      ),
    );
  }

  let node =
    !hasProperties && rest.length === 1
      ? rest[0]!
      : rest.length
        ? callSchema(plugin, 'StructWithRest', struct, $.array(...rest))
        : struct;

  if (schema.propertyNames) {
    node = callMethod(
      node,
      'check',
      callSchema(
        plugin,
        'isPropertyNames',
        schemaToExpression(schema.propertyNames, {
          ...ctx,
          path: [...ctx.path, 'propertyNames'],
        }),
      ),
    );
  }
  return node;
}

function unionToExpression(schema: IR.SchemaObject, ctx: SchemaContext): Expression {
  const items = (schema.items ?? []).map((item, index) =>
    schemaToExpression(item, {
      ...ctx,
      path: [...ctx.path, 'items', index],
    }),
  );
  return unionExpressions(items, ctx.plugin);
}

function unionExpressions(
  items: ReadonlyArray<Expression>,
  plugin: EffectSchemaPlugin['Instance'],
): Expression {
  const [first, ...rest] = items;
  if (!first) {
    return schemaMember(plugin, 'Never');
  }
  return rest.length ? callSchema(plugin, 'Union', $.array(...items)) : first;
}

function intersectionToExpression(
  schema: IR.SchemaObject,
  ctx: SchemaContext,
  expressions?: ReadonlyArray<Expression>,
): Expression {
  const items = schema.items ?? [];
  const resolved = items.map((item) =>
    item.$ref ? ctx.plugin.context.resolveIrRef<IR.SchemaObject>(item.$ref) : item,
  );
  const isObjectIntersection =
    items.length > 0 && items.every((item) => isObjectIntersectionMember(item, ctx));

  if (isObjectIntersection) {
    return schemaToExpression(mergeObjectIntersection(schema, ctx), ctx);
  }

  const types = new Set(
    resolved
      .map((item) => item.type)
      .filter((type): type is NonNullable<typeof type> => Boolean(type))
      .map((type) => (type === 'integer' ? 'number' : type)),
  );
  if (types.size > 1) {
    return schemaMember(ctx.plugin, 'Never');
  }

  let node =
    expressions?.[0] ??
    (items[0]
      ? schemaToExpression(items[0], {
          ...ctx,
          path: [...ctx.path, 'items', 0],
        })
      : schemaMember(ctx.plugin, 'Unknown'));

  for (const [offset, item] of items.slice(1).entries()) {
    const index = offset + 1;
    const member =
      expressions?.[index] ??
      schemaToExpression(item, {
        ...ctx,
        path: [...ctx.path, 'items', index],
      });
    const filter = callSchema(
      ctx.plugin,
      'makeFilter',
      callSchema(ctx.plugin, 'is', member),
      $.object().prop('expected', $.literal('a value matching this allOf member')),
    );
    node = callMethod(node, 'check', filter);
  }

  return node;
}

function fromWalkerContext(ctx: SchemaVisitorContext<SchemaWalkerPlugin>): SchemaContext {
  return {
    ...(ctx.plugin.fileInput !== undefined ? { fileInput: ctx.plugin.fileInput } : {}),
    ...(ctx.plugin.multipart !== undefined ? { multipart: ctx.plugin.multipart } : {}),
    path: fromRef(ctx.path),
    plugin: ctx.plugin.instance,
  };
}

const schemaVisitor: SchemaVisitor<Expression, SchemaWalkerPlugin> = {
  applyModifiers(result) {
    return result;
  },
  array(schema, walkerCtx) {
    const ctx = fromWalkerContext(walkerCtx);
    const { plugin } = ctx;
    const item = schema.items?.[0];
    if (ctx.multipart && item?.format === 'binary') {
      return $(plugin.imports.Multipart).attr('FilesSchema');
    }
    return callSchema(
      plugin,
      'Array',
      item
        ? schemaToExpression(item, {
            ...ctx,
            path: [...ctx.path, 'items', 0],
          })
        : schemaMember(plugin, 'Unknown'),
    );
  },
  boolean(_schema, walkerCtx) {
    return schemaMember(walkerCtx.plugin.instance, 'Boolean');
  },
  enum(schema, walkerCtx) {
    return unionToExpression(schema, fromWalkerContext(walkerCtx));
  },
  integer(_schema, walkerCtx) {
    return schemaMember(walkerCtx.plugin.instance, 'Number');
  },
  intercept(schema, walkerCtx) {
    const ctx = fromWalkerContext(walkerCtx);
    if (schema.symbolRef) {
      return $(schema.symbolRef);
    }
    if (schema.const !== undefined) {
      return applyAnnotations(
        applyChecks(literalSchema(schema.const, ctx), schema, ctx.plugin),
        schema,
      );
    }
    if (!schema.$ref && !schema.type && !schema.items) {
      return applyAnnotations(schemaMember(ctx.plugin, 'Unknown'), schema);
    }
  },
  intersection(expressions, schemas, parentSchema, walkerCtx) {
    const ctx = fromWalkerContext(walkerCtx);
    return applyAnnotations(
      applyChecks(
        intersectionToExpression(
          {
            ...parentSchema,
            items: schemas,
          },
          ctx,
          expressions,
        ),
        parentSchema,
        ctx.plugin,
      ),
      parentSchema,
    );
  },
  never(_schema, walkerCtx) {
    return schemaMember(walkerCtx.plugin.instance, 'Never');
  },
  null(_schema, walkerCtx) {
    return schemaMember(walkerCtx.plugin.instance, 'Null');
  },
  number(_schema, walkerCtx) {
    return schemaMember(walkerCtx.plugin.instance, 'Number');
  },
  object(schema, walkerCtx) {
    return objectToExpression(schema, fromWalkerContext(walkerCtx));
  },
  postProcess(result, schema, walkerCtx) {
    const { instance } = walkerCtx.plugin;
    return applyAnnotations(applyChecks(result, schema, instance), schema);
  },
  reference(_ref, schema, walkerCtx) {
    const ctx = fromWalkerContext(walkerCtx);
    const resourceId = schema.$ref;
    const resolved =
      resourceId === undefined
        ? undefined
        : ctx.plugin.context.resolveIrRef<IR.SchemaObject>(resourceId);
    const type = schema.type ?? resolved?.type;
    const constraintSchema = type ? { ...schema, type } : schema;
    return applyAnnotations(
      applyChecks(referenceToExpression(schema, ctx), constraintSchema, ctx.plugin),
      schema,
    );
  },
  string(schema, walkerCtx) {
    const { fileInput, instance, multipart } = walkerCtx.plugin;
    return schema.format === 'binary'
      ? multipart
        ? $(instance.imports.Multipart).attr('SingleFileSchema')
        : fileInput
          ? callSchema(instance, 'instanceOf', $.attr('globalThis', 'Blob'))
          : schemaMember(instance, 'Uint8Array')
      : schemaMember(instance, 'String');
  },
  tuple(schema, walkerCtx) {
    const ctx = fromWalkerContext(walkerCtx);
    return callSchema(
      ctx.plugin,
      'Tuple',
      $.array(
        ...(schema.items ?? []).map((item, index) =>
          schemaToExpression(item, {
            ...ctx,
            path: [...ctx.path, 'items', index],
          }),
        ),
      ),
    );
  },
  undefined(_schema, walkerCtx) {
    return schemaMember(walkerCtx.plugin.instance, 'Undefined');
  },
  union(expressions, _schemas, parentSchema, walkerCtx) {
    const { instance } = walkerCtx.plugin;
    return applyAnnotations(
      applyChecks(unionExpressions(expressions, instance), parentSchema, instance),
      parentSchema,
    );
  },
  unknown(_schema, walkerCtx) {
    return schemaMember(walkerCtx.plugin.instance, 'Unknown');
  },
  void(_schema, walkerCtx) {
    return schemaMember(walkerCtx.plugin.instance, 'Void');
  },
};

const walkSchema = createSchemaWalker(schemaVisitor);

export function schemaToExpression(schema: IR.SchemaObject, ctx: SchemaContext): Expression {
  return walkSchema(schema, {
    path: ref(ctx.path),
    plugin: {
      ...(ctx.fileInput !== undefined ? { fileInput: ctx.fileInput } : {}),
      instance: ctx.plugin,
      ...(ctx.multipart !== undefined ? { multipart: ctx.multipart } : {}),
    },
  });
}

export function emitNamedSchema(options: EmitSchemaOptions): Symbol {
  const { meta, name, plugin, schema, tags } = options;
  const expression = schemaToExpression(schema, options);
  const symbol = plugin.symbol(
    buildSymbolIn({
      meta: {
        category: 'schema',
        path: options.path,
        tags,
        ...meta,
      },
      name,
      naming: options.naming ?? plugin.config.definitions,
      path: options.path,
      plugin,
      schema,
    }),
  );
  const statement = $.const(symbol)
    .export()
    .$if(plugin.config.comments && createSchemaComment(schema), (node, comment) =>
      node.doc(comment),
    )
    .assign(expression);
  plugin.node(statement);
  return symbol;
}

export function emitDefinitionSchema({
  path,
  plugin,
  schema,
  tags,
}: Pick<SchemaContext, 'path' | 'plugin'> & {
  schema: IR.SchemaObject;
  tags?: ReadonlyArray<string>;
}): Symbol {
  const name = pathToName(path);
  const resourceId = pathToJsonPointer(path);
  const expression = schemaToExpression(schema, { path, plugin });
  const symbol = plugin.symbol(
    buildSymbolIn({
      meta: {
        category: 'schema',
        path,
        resource: 'definition',
        resourceId,
        tags,
      },
      name,
      naming: plugin.config.definitions,
      path,
      plugin,
      schema,
    }),
  );
  const statement = $.const(symbol)
    .export()
    .$if(plugin.config.comments && createSchemaComment(schema), (node, comment) =>
      node.doc(comment),
    )
    .assign(expression);
  plugin.node(statement);
  return symbol;
}
