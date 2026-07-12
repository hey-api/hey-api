import { toCase } from '@hey-api/shared';

import { $ } from '../../../ts-dsl';
import type { HeyApiExamplesPlugin } from './types';

export const handler: HeyApiExamplesPlugin['Handler'] = ({ plugin }) => {
  const spec = plugin.context.spec as {
    components?: {
      examples?: Record<string, { value?: unknown }>;
      schemas?: Record<string, { example?: unknown; examples?: Record<string, unknown> }>;
    };
    paths?: Record<
      string,
      Record<
        string,
        {
          operationId?: string;
          responses?: Record<
            string,
            {
              content?: Record<string, { example?: unknown; examples?: Record<string, unknown> }>;
            }
          >;
        }
      >
    >;
  };

  if (!spec.components?.schemas) {
    return;
  }

  const schemas = spec.components.schemas;
  const examplesComponent = spec.components.examples;

  for (const [name, schema] of Object.entries(schemas)) {
    const schemaExample = resolveSchemaExample(schema, examplesComponent);
    if (!schemaExample) {
      continue;
    }

    const hasPluralExamples = schema.examples && Object.keys(schema.examples).length > 0;
    const functionName = `${toCase(name, 'camelCase')}Example`;

    if (hasPluralExamples) {
      generatePluralSchemaFactory({
        functionName,
        name,
        plugin,
        schemaExample: schemaExample as Record<string, unknown>,
      });
    } else {
      generateSingularSchemaFactory({
        functionName,
        name,
        plugin,
        schemaExample,
      });
    }
  }

  if (!spec.paths) {
    return;
  }

  for (const [, pathItem] of Object.entries(spec.paths)) {
    for (const [key, operation] of Object.entries(pathItem)) {
      if (key.startsWith('x-')) {
        continue;
      }
      if ('parameters' in operation || 'summary' in operation || 'description' in operation) {
        continue;
      }

      if (!('responses' in operation) || !operation.responses) {
        continue;
      }

      const operationExamples = collectOperationExamples(
        operation.responses as Record<
          string,
          {
            content?: Record<string, { example?: unknown; examples?: Record<string, unknown> }>;
          }
        >,
        examplesComponent,
      );
      if (operationExamples.statusCodes.size === 0) {
        continue;
      }

      generateOperationFactory({
        examples: operationExamples,
        functionName: `${toCase(operation.operationId ?? '', 'camelCase')}Example`,
        plugin,
      });
    }
  }
};

interface ResolvedExample {
  example?: unknown;
  examples?: Record<string, unknown>;
}

function resolveSchemaExample(
  schema: ResolvedExample,
  examplesComponent?: Record<string, { value?: unknown }>,
): unknown | Record<string, unknown> | null {
  if (schema.example !== undefined) {
    if (typeof schema.example === 'object' && schema.example !== null && '$ref' in schema.example) {
      return resolveRefExample(schema.example.$ref as string, examplesComponent);
    }
    return schema.example;
  }

  if (schema.examples && Object.keys(schema.examples).length > 0) {
    const resolved: Record<string, unknown> = {};
    for (const [key, exampleRef] of Object.entries(schema.examples)) {
      if (typeof exampleRef === 'object' && exampleRef !== null && '$ref' in exampleRef) {
        const resolvedValue = resolveRefExample(exampleRef.$ref as string, examplesComponent);
        if (resolvedValue !== undefined) {
          resolved[key] = resolvedValue;
        }
      } else if (typeof exampleRef === 'object' && exampleRef !== null && 'value' in exampleRef) {
        resolved[key] = exampleRef.value;
      } else {
        resolved[key] = exampleRef;
      }
    }
    return resolved;
  }

  return null;
}

function resolveRefExample($ref: string, examples?: Record<string, { value?: unknown }>): unknown {
  if (!examples) {
    return undefined;
  }

  const refPath = $ref.split('/');
  const exampleName = refPath[refPath.length - 1]!;
  const example = examples[exampleName];

  if (!example) {
    return undefined;
  }

  return example.value;
}

function getJsonExample(
  content?: Record<string, { example?: unknown; examples?: Record<string, unknown> }>,
): unknown | Record<string, unknown> | null {
  if (!content) {
    return null;
  }

  const jsonContent = content['application/json'];
  if (!jsonContent) {
    return null;
  }

  if (jsonContent.example !== undefined) {
    return jsonContent.example;
  }

  if (jsonContent.examples && Object.keys(jsonContent.examples).length > 0) {
    const resolved: Record<string, unknown> = {};
    for (const [key, exampleRef] of Object.entries(jsonContent.examples)) {
      if (typeof exampleRef === 'object' && exampleRef !== null && 'value' in exampleRef) {
        resolved[key] = exampleRef.value;
      } else {
        resolved[key] = exampleRef;
      }
    }
    return resolved;
  }

  return null;
}

interface OperationExamples {
  defaultStatusCode?: string;
  statusCodes: Map<
    string,
    {
      examples: Record<string, unknown>;
      isPlural: boolean;
    }
  >;
}

function collectOperationExamples(
  responses: Record<
    string,
    {
      content?: Record<string, { example?: unknown; examples?: Record<string, unknown> }>;
    }
  >,
  examplesComponent?: Record<string, { value?: unknown }>,
): OperationExamples {
  const result: OperationExamples = {
    statusCodes: new Map(),
  };

  for (const [statusCode, response] of Object.entries(responses)) {
    const jsonExample = getJsonExample(response.content);
    if (!jsonExample) {
      continue;
    }

    const isPlural =
      typeof jsonExample === 'object' && jsonExample !== null && !Array.isArray(jsonExample);

    let resolvedExamples: Record<string, unknown>;

    if (isPlural && typeof jsonExample === 'object') {
      const resolved: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(jsonExample)) {
        if (typeof value === 'object' && value !== null && '$ref' in value) {
          const refResolved = resolveRefExample(value.$ref as string, examplesComponent);
          if (refResolved !== undefined) {
            resolved[key] = refResolved;
          }
        } else {
          resolved[key] = value;
        }
      }
      resolvedExamples = resolved;
    } else {
      resolvedExamples = { basic: jsonExample as unknown };
    }

    if (Object.keys(resolvedExamples).length === 0) {
      continue;
    }

    result.statusCodes.set(statusCode, {
      examples: resolvedExamples,
      isPlural,
    });

    if (!result.defaultStatusCode) {
      const codeNum = parseInt(statusCode.replace('X', '0').replace('default', '999'));
      const defaultNum = result.defaultStatusCode
        ? parseInt(result.defaultStatusCode.replace('X', '0').replace('default', '999'))
        : 999;

      if (statusCode.startsWith('2') && !result.defaultStatusCode) {
        result.defaultStatusCode = statusCode;
      } else if (codeNum < defaultNum && statusCode !== 'default') {
        result.defaultStatusCode = statusCode;
      }
    }
  }

  if (!result.defaultStatusCode && result.statusCodes.size > 0) {
    result.defaultStatusCode = Array.from(result.statusCodes.keys())[0]!;
  }

  return result;
}

function generateSingularSchemaFactory({
  functionName,
  name,
  plugin,
  schemaExample,
}: {
  functionName: string;
  name: string;
  plugin: HeyApiExamplesPlugin['Instance'];
  schemaExample: unknown;
}): void {
  const symbol = plugin.symbol(functionName, {
    meta: {
      category: 'example',
      resource: 'schema',
      resourceId: name,
    },
  });

  const func = $.func(symbol)
    .decl()
    .export()
    .do($.return($.fromValue(schemaExample, { layout: 'pretty' })));

  plugin.node(func);
}

function generatePluralSchemaFactory({
  functionName,
  name,
  plugin,
  schemaExample,
}: {
  functionName: string;
  name: string;
  plugin: HeyApiExamplesPlugin['Instance'];
  schemaExample: Record<string, unknown>;
}): void {
  const exampleKeys = Object.keys(schemaExample);
  const firstKey = exampleKeys[0]!;

  const symbol = plugin.symbol(functionName, {
    meta: {
      category: 'example',
      resource: 'schema',
      resourceId: name,
    },
  });

  const func = $.func(symbol)
    .decl()
    .export()
    // .param('options')
    .do($.return($.fromValue(schemaExample[firstKey]!, { layout: 'pretty' })));

  plugin.node(func);
}

function generateOperationFactory({
  examples: operationExamples,
  functionName,
  plugin,
}: {
  examples: OperationExamples;
  functionName: string;
  plugin: HeyApiExamplesPlugin['Instance'];
}): void {
  const statusCodes = Array.from(operationExamples.statusCodes.entries());

  const defaultStatusCode = operationExamples.defaultStatusCode || statusCodes[0]?.[0];
  const _defaultCodeNum = defaultStatusCode ? parseInt(defaultStatusCode.replace('X', '0')) : 200;

  const symbol = plugin.symbol(functionName, {
    meta: {
      category: 'example',
      resource: 'operation',
      resourceId: functionName.replace('Example', ''),
    },
  });

  const func = $.func(symbol)
    .decl()
    .export()
    // .param('options')
    .do(
      $.return(
        $.fromValue(
          statusCodes[0]?.[1]?.examples.basic ??
            statusCodes[0]?.[1]?.examples[Object.keys(statusCodes[0]?.[1]?.examples ?? {})[0]!]!,
          { layout: 'pretty' },
        ),
      ),
    );

  plugin.node(func);
}
