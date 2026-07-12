import type { IR } from '@hey-api/shared';
import { buildSymbolIn, deduplicateSchema, operationResponsesMap } from '@hey-api/shared';

import { $ } from '../../../../ts-dsl';
import type { HeyApiTypeScriptPlugin } from '../types';
import type { ProcessorResult } from './processor';

const irParametersToIrSchema = ({
  parameters,
}: {
  parameters: Record<string, IR.ParameterObject>;
}): IR.SchemaObject => {
  const irSchema: IR.SchemaObject = {
    type: 'object',
  };

  if (parameters) {
    const properties: Record<string, IR.SchemaObject> = {};
    const required: Array<string> = [];

    for (const key in parameters) {
      const parameter = parameters[key]!;

      properties[parameter.name] = deduplicateSchema({
        detectFormat: false,
        schema: parameter.schema,
      });

      if (parameter.required) {
        required.push(parameter.name);
      }
    }

    irSchema.properties = properties;

    if (required.length) {
      irSchema.required = required;
    }
  }

  return irSchema;
};

export const operationToType = ({
  operation,
  path,
  plugin,
  processor,
  tags,
}: {
  operation: IR.OperationObject;
  path: ReadonlyArray<string | number>;
  plugin: HeyApiTypeScriptPlugin['Instance'];
  processor: ProcessorResult;
  tags?: ReadonlyArray<string>;
}): void => {
  const data: IR.SchemaObject = {
    properties: {
      body: operation.body?.schema ?? { type: 'never' },
      ...(operation.parameters?.header
        ? {
            headers: irParametersToIrSchema({
              parameters: operation.parameters.header,
            }),
          }
        : {}),
      path: operation.parameters?.path
        ? irParametersToIrSchema({ parameters: operation.parameters.path })
        : { type: 'never' },
      query: operation.parameters?.query
        ? irParametersToIrSchema({ parameters: operation.parameters.query })
        : { type: 'never' },
      url: {
        const: operation.path,
        type: 'string',
      },
    },
    type: 'object',
  };

  const dataRequired: Array<string> = [];

  if (operation.body?.required) {
    dataRequired.push('body');
  }

  // do not set headers to never so we can always pass arbitrary values
  if (data.properties!.headers?.required) {
    dataRequired.push('headers');
  }

  if (data.properties!.path!.required) {
    dataRequired.push('path');
  }

  if (data.properties!.query!.required) {
    dataRequired.push('query');
  }

  dataRequired.push('url');

  if (dataRequired.length) {
    data.required = dataRequired;
  }

  const dataResult = processor.process({
    export: false,
    meta: {
      resource: 'operation',
      resourceId: operation.id,
    },
    naming: plugin.config.definitions,
    path: [...path, operation.id, 'data'],
    plugin,
    schema: data,
  });

  const dataSymbol = plugin.symbol(
    buildSymbolIn({
      meta: {
        category: 'type',
        path,
        resource: 'operation',
        resourceId: operation.id,
        role: 'data',
        tags,
      },
      name: operation.id,
      naming: plugin.config.requests,
      operation,
      path,
      plugin,
    }),
  );
  const dataNode = $.type
    .alias(dataSymbol)
    .export()
    .type(dataResult?.type ?? $.type('never'));
  plugin.node(dataNode);

  const { error, errors, response, responses } = operationResponsesMap(operation);

  if (errors) {
    const errorsResult = processor.process({
      export: false,
      meta: {
        resource: 'operation',
        resourceId: operation.id,
      },
      naming: plugin.config.definitions,
      path: [...path, operation.id, 'errors'],
      plugin,
      schema: errors,
    });

    const errorsSymbol = plugin.symbol(
      buildSymbolIn({
        meta: {
          category: 'type',
          path,
          resource: 'operation',
          resourceId: operation.id,
          role: 'errors',
          tags,
        },
        name: operation.id,
        naming: plugin.config.errors,
        operation,
        path,
        plugin,
      }),
    );
    const errorsNode = $.type
      .alias(errorsSymbol)
      .export()
      .type(errorsResult?.type ?? $.type('never'));
    plugin.node(errorsNode);

    if (error) {
      const errorSymbol = plugin.symbol(
        buildSymbolIn({
          meta: {
            category: 'type',
            path,
            resource: 'operation',
            resourceId: operation.id,
            role: 'error',
            tags,
          },
          name: operation.id,
          naming: {
            case: plugin.config.errors.case,
            name: plugin.config.errors.error,
          },
          operation,
          path,
          plugin,
        }),
      );
      const errorNode = $.type
        .alias(errorSymbol)
        .export()
        .type($.type(errorsSymbol).idx($.type(errorsSymbol).keyof()));
      plugin.node(errorNode);
    }
  }

  if (responses) {
    const responsesResult = processor.process({
      export: false,
      meta: {
        resource: 'operation',
        resourceId: operation.id,
      },
      naming: plugin.config.definitions,
      path: [...path, operation.id, 'responses'],
      plugin,
      schema: responses,
    });

    const responsesSymbol = plugin.symbol(
      buildSymbolIn({
        meta: {
          category: 'type',
          path,
          resource: 'operation',
          resourceId: operation.id,
          role: 'responses',
          tags,
        },
        name: operation.id,
        naming: plugin.config.responses,
        operation,
        path,
        plugin,
      }),
    );
    const responsesNode = $.type
      .alias(responsesSymbol)
      .export()
      .type(responsesResult?.type ?? $.type('never'));
    plugin.node(responsesNode);

    if (response) {
      const responseSymbol = plugin.symbol(
        buildSymbolIn({
          meta: {
            category: 'type',
            path,
            resource: 'operation',
            resourceId: operation.id,
            role: 'response',
            tags,
          },
          name: operation.id,
          naming: {
            case: plugin.config.responses.case,
            name: plugin.config.responses.response,
          },
          operation,
          path,
          plugin,
        }),
      );
      const responseNode = $.type
        .alias(responseSymbol)
        .export()
        .type($.type(responsesSymbol).idx($.type(responsesSymbol).keyof()));
      plugin.node(responseNode);
    }
  }
};
