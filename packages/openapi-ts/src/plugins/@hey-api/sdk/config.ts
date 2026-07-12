import { log } from '@hey-api/codegen-core';
import type { PluginContext } from '@hey-api/shared';
import { coerce, definePluginConfig } from '@hey-api/shared';

import { sdkImports } from './imports';
import type { UserOperationsConfig } from './operations';
import { mapLegacyToConfig } from './operations/config';
import { handler } from './plugin';
import type { Config, HeyApiSdkPlugin } from './types';

const transformerInferWarn =
  'You set `transformer: true` but no transformer plugin was found in your plugins. Add a transformer plugin like `@hey-api/transformers` to enable this feature. The transformer option has been disabled.';
const validatorInferWarn =
  'You set `validator: true` but no validator plugin was found in your plugins. Add a validator plugin like `zod` to enable this feature. The validator option has been disabled.';

export const defaultConfig: HeyApiSdkPlugin['Config'] = {
  // oxlint-disable-next-line sort-keys
  config: {
    $dependencies: ['client'],
    $finalize(config, input) {
      if (input.asClass !== undefined) {
        log.warnDeprecated({
          context: '@hey-api/sdk',
          field: 'asClass',
          replacement: ['operations: { strategy: "byTags" }', 'operations: { strategy: "single" }'],
        });
      }

      if (input.classNameBuilder !== undefined) {
        log.warnDeprecated({
          context: '@hey-api/sdk',
          field: 'classNameBuilder',
          replacement: 'operations: { containerName: "..." }',
        });
      }

      if (input.classStructure !== undefined) {
        log.warnDeprecated({
          context: '@hey-api/sdk',
          field: 'classStructure',
          replacement: ['operations: { nesting: "operationId" }', 'operations: { nesting: "id" }'],
        });
      }

      if (input.instance !== undefined) {
        log.warnDeprecated({
          context: '@hey-api/sdk',
          field: 'instance',
          replacement: `operations: { strategy: "single", containerName: "${input.instance || 'Name'}", methods: "instance" }`,
        });
      }

      if (input.methodNameBuilder !== undefined) {
        log.warnDeprecated({
          context: '@hey-api/sdk',
          field: 'methodNameBuilder',
          replacement: 'operations: { methodName: "..." }',
        });
      }

      if (input.operationId !== undefined) {
        log.warnDeprecated({
          context: '@hey-api/sdk',
          field: 'operationId',
          replacement: ['operations: { nesting: "operationId" }', 'operations: { nesting: "id" }'],
        });
      }

      const legacy = mapLegacyToConfig(input);
      for (const key of Object.keys(legacy)) {
        const value = legacy[key as keyof typeof legacy];
        if (value !== undefined) {
          (config.operations as unknown as Record<string, unknown>)[key] = value;
        }
      }
    },
    auth: true,
    client: coerce((value, context) => {
      if (value === true || value === undefined) {
        return (context as PluginContext).resolveTag('client', {
          defaultPlugin: '@hey-api/client-fetch',
        });
      }
      return value;
    }),
    comments: true,
    examples: {
      $coerceAny: ({ value }) => ({ enabled: Boolean(value) }),
      enabled: false,
      language: 'JavaScript',
    },
    includeInEntry: true,
    operations: {
      $cascade: ['strategy'],
      $coerceAny: ({ type, value }) => ({
        ...(type === 'string' || type === 'function'
          ? { strategy: value as UserOperationsConfig['strategy'] }
          : {}),
      }),
      container: 'class',
      containerName: {
        $coerce: {
          function: (v) => ({ name: v }),
          string: (v) => ({ name: v }),
        },
        casing: 'PascalCase',
        name: coerce((value, context) =>
          value !== undefined
            ? value
            : (context as UserOperationsConfig).strategy === 'single'
              ? 'Sdk'
              : '',
        ),
      },
      methodName: {
        $coerce: {
          function: (v) => ({ name: v }),
          string: (v) => ({ name: v }),
        },
        casing: 'camelCase',
        name: '',
      },
      methods: coerce((value, context) =>
        value !== undefined
          ? value
          : (context as UserOperationsConfig).strategy === 'single'
            ? 'instance'
            : 'static',
      ),
      nesting: 'operationId',
      nestingDelimiters: /[./]/,
      segmentName: {
        $coerce: {
          function: (v) => ({ name: v }),
          string: (v) => ({ name: v }),
        },
        casing: 'PascalCase',
        name: '',
      },
      strategy: 'flat',
      strategyDefaultTag: 'default',
    },
    paramsStructure: 'grouped',
    responseStyle: 'fields',
    transformer: {
      $coerceAny: ({ type, value }) => ({
        ...(type === 'boolean' || type === 'string'
          ? { response: value as Config['transformer']['response'] }
          : {}),
      }),
      $dependencies: ['response'],
      response: coerce((value, context) => {
        if (value === true) {
          return (context as PluginContext).resolveTag('transformer', {
            warn: transformerInferWarn,
          });
        }
        return value ?? false;
      }),
    },
    validator: {
      $coerceAny: ({ type, value }) => ({
        ...(type === 'boolean' || type === 'string'
          ? {
              request: value as Config['validator']['request'],
              response: value as Config['validator']['response'],
            }
          : {}),
      }),
      $dependencies: ['request', 'response'],
      request: coerce((value, context) => {
        if (value === true) {
          return (context as PluginContext).resolveTag('validator', { warn: validatorInferWarn });
        }
        return value ?? false;
      }),
      response: coerce((value, context) => {
        if (value === true) {
          return (context as PluginContext).resolveTag('validator', { warn: validatorInferWarn });
        }
        return value ?? false;
      }),
    },

    // Deprecated - kept for backward compatibility
    response: 'body',
  },
  dependencies: ['@hey-api/typescript'],
  handler,
  imports: sdkImports,
  name: '@hey-api/sdk',
  symbolMeta() {
    return {
      artifact: 'sdk',
    };
  },
};

/**
 * Type helper for `@hey-api/sdk` plugin, returns {@link Plugin.Config} object
 */
export const defineConfig = definePluginConfig(defaultConfig);
