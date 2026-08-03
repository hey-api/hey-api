import type { IR } from '@hey-api/shared';
import { statusCodeToGroup } from '@hey-api/shared';

import { getTypedConfig } from '../../../../config/utils';
import { $ } from '../../../../ts-dsl';
import { getClientPlugin } from '../../../@hey-api/client-core/utils';
import { hasOperationSse } from '../../../shared/utils/operation';
import type { Field, Fields } from '../../client-core/bundle/params';
import type { HeyApiSdkPlugin } from '../types';
import { isInstance } from '../v1/node';
import { operationAuth } from './auth';
import { nuxtTypeComposable, nuxtTypeDefault } from './constants';
import { createResponseHandlers } from './handlers';
import { getSignatureParameters } from './signature';
import { createRequestValidator } from './validator';

/** TODO: needs complete refactor */
export function operationOptionsType({
  isDataAllowed = true,
  operation,
  plugin,
  throwOnError,
}: {
  isDataAllowed?: boolean;
  operation: IR.OperationObject;
  plugin: HeyApiSdkPlugin['Instance'];
  throwOnError?: string;
}): ReturnType<typeof $.type> {
  const client = getClientPlugin(getTypedConfig(plugin));
  const isNuxtClient = client.name === '@hey-api/client-nuxt';
  const isEffectClient = client.name === '@hey-api/client-effect';

  // TODO: contract (cross)
  const symbolDataType = isDataAllowed
    ? plugin.querySymbol({
        artifact: 'types',
        category: 'type',
        resource: 'operation',
        resourceId: operation.id,
        role: 'data',
      })
    : undefined;
  // TODO: contract (self)
  const symbolOptions = plugin.referenceSymbol({
    artifact: 'sdk',
    category: 'type',
    resource: 'client-options',
  });

  if (isNuxtClient) {
    // TODO: contract (?)
    const symbolResponseType = plugin.querySymbol({
      category: 'type',
      resource: 'operation',
      resourceId: operation.id,
      role: 'response',
    });
    return $.type(symbolOptions)
      .generic(nuxtTypeComposable)
      .generic(isDataAllowed ? (symbolDataType ?? 'unknown') : 'never')
      .generic(symbolResponseType ?? 'unknown')
      .generic(nuxtTypeDefault);
  }

  const isSse = hasOperationSse({ operation });

  if (isEffectClient) {
    if (isSse) {
      const symbolResponseType = plugin.querySymbol({
        category: 'type',
        resource: 'operation',
        resourceId: operation.id,
        role: 'response',
      });
      return $.type(symbolOptions)
        .generic(isDataAllowed ? (symbolDataType ?? 'unknown') : 'never')
        .generic(symbolResponseType ?? 'unknown');
    }
    return $.type(symbolOptions).$if(!isDataAllowed || symbolDataType, (t) =>
      t.generic(isDataAllowed ? symbolDataType! : 'never'),
    );
  }

  if (isSse) {
    // TODO: contract (?)
    const symbolResponseType = plugin.querySymbol({
      category: 'type',
      resource: 'operation',
      resourceId: operation.id,
      role: 'response',
    });

    return $.type(symbolOptions)
      .generic(isDataAllowed ? (symbolDataType ?? 'unknown') : 'never')
      .generic(throwOnError !== undefined ? throwOnError : 'boolean')
      .generic(symbolResponseType ?? 'unknown');
  }

  // TODO: refactor this to be more generic, works for now
  if (throwOnError) {
    return $.type(symbolOptions)
      .generic(isDataAllowed ? (symbolDataType ?? 'unknown') : 'never')
      .generic(throwOnError);
  }
  return $.type(symbolOptions).$if(!isDataAllowed || symbolDataType, (t) =>
    t.generic(isDataAllowed ? symbolDataType! : 'never'),
  );
}

type OperationParameters = {
  argNames: Array<string>;
  fields: Array<Field | Fields>;
  parameters: Array<ReturnType<typeof $.param>>;
};

export function operationParameters({
  isRequiredOptions,
  operation,
  plugin,
}: {
  isRequiredOptions: boolean;
  operation: IR.OperationObject;
  plugin: HeyApiSdkPlugin['Instance'];
}): OperationParameters {
  const result: OperationParameters = {
    argNames: [],
    fields: [],
    parameters: [],
  };

  const pluginTypeScript = plugin.getPluginOrThrow('@hey-api/typescript');
  const client = getClientPlugin(getTypedConfig(plugin));
  const isNuxtClient = client.name === '@hey-api/client-nuxt';
  const isEffectClient = client.name === '@hey-api/client-effect';

  if (plugin.config.paramsStructure === 'flat') {
    const signature = getSignatureParameters({ operation, plugin });
    const flatParams = $.type.object();

    if (signature) {
      let isParametersRequired = false;

      for (const key in signature.parameters) {
        const parameter = signature.parameters[key]!;
        if (parameter.isRequired) {
          isParametersRequired = true;
        }
        flatParams.prop(parameter.name, (p) =>
          p
            .required(parameter.isRequired)
            .type(pluginTypeScript.api.schemaToType(pluginTypeScript, parameter.schema)),
        );
      }

      result.argNames.push('parameters');
      for (const field of signature.fields) {
        result.fields.push(field);
      }

      result.parameters.push(
        $.param('parameters', (p) => p.required(isParametersRequired).type(flatParams)),
      );
    }
  }

  result.parameters.push(
    $.param('options', (p) =>
      p.required(isRequiredOptions).type(
        operationOptionsType({
          isDataAllowed: plugin.config.paramsStructure === 'grouped',
          operation,
          plugin,
          throwOnError: isNuxtClient || isEffectClient ? undefined : 'ThrowOnError',
        }),
      ),
    ),
  );

  return result;
}

/**
 * Infers `responseType` value from provided response content type. This is
 * an adapted version of `getParseAs()` from the Fetch API client.
 *
 * From Axios documentation:
 * `responseType` indicates the type of data that the server will respond with
 * options are: 'arraybuffer', 'document', 'json', 'text', 'stream'
 * browser only: 'blob'
 */
function getResponseType(
  contentType: string | null | undefined,
): 'arraybuffer' | 'blob' | 'document' | 'json' | 'stream' | 'text' | undefined {
  if (!contentType) {
    return;
  }

  const cleanContent = contentType.split(';')[0]?.trim();

  if (!cleanContent) {
    return;
  }

  if (cleanContent.startsWith('application/json') || cleanContent.endsWith('+json')) {
    return 'json';
  }

  // Axios does not handle form data out of the box
  // if (cleanContent === 'multipart/form-data') {
  //   return 'formData';
  // }

  if (
    ['application/', 'audio/', 'image/', 'video/'].some((type) => cleanContent.startsWith(type))
  ) {
    return 'blob';
  }

  if (cleanContent.startsWith('text/')) {
    return 'text';
  }

  return;
}

export function operationStatements({
  isRequiredOptions,
  opParameters,
  operation,
  plugin,
}: {
  isRequiredOptions: boolean;
  opParameters: OperationParameters;
  operation: IR.OperationObject;
  plugin: HeyApiSdkPlugin['Instance'];
}): Array<ReturnType<typeof $.return | typeof $.const>> {
  const client = getClientPlugin(getTypedConfig(plugin));
  const isNuxtClient = client.name === '@hey-api/client-nuxt';
  const isEffectClient = client.name === '@hey-api/client-effect';

  // TODO: contract (?)
  const symbolResponseType = plugin.querySymbol({
    category: 'type',
    resource: 'operation',
    resourceId: operation.id,
    role: isNuxtClient ? 'response' : 'responses',
  });
  // TODO: contract (?)
  const symbolErrorType = plugin.querySymbol({
    category: 'type',
    resource: 'operation',
    resourceId: operation.id,
    role: isNuxtClient ? 'error' : 'errors',
  });

  // TODO: transform parameters
  // const query = {
  //   BarBaz: options.query.bar_baz,
  //   qux_quux: options.query.qux_quux,
  //   fooBar: options.query.foo_bar,
  // };

  // if (operation.parameters) {
  //   for (const name in operation.parameters.query) {
  //     const parameter = operation.parameters.query[name]
  //     if (parameter.name !== fieldName({ context, name: parameter.name })) {
  //       console.warn(parameter.name)
  //     }
  //   }
  // }

  const reqOptions = $.object();

  if (operation.body) {
    // Check if body has binary format - if so, don't use JSON serializer
    const isBinaryFormat = operation.body.schema?.format === 'binary';

    switch (operation.body.type) {
      case 'form-data': {
        const symbol = plugin.imports.formDataBodySerializer;
        reqOptions.spread(symbol);
        break;
      }
      case 'json':
        // jsonBodySerializer is the default, no need to specify
        // unless the schema has binary format
        if (isBinaryFormat) {
          reqOptions.prop('bodySerializer', $.literal(null));
        }
        break;
      case 'text':
      case 'octet-stream':
        // ensure we don't use any serializer by default
        reqOptions.prop('bodySerializer', $.literal(null));
        break;
      case 'url-search-params': {
        const symbol = plugin.imports.urlSearchParamsBodySerializer;
        reqOptions.spread(symbol);
        break;
      }
      default:
        // For unrecognized media types with binary format, don't use JSON serializer
        if (isBinaryFormat) {
          reqOptions.prop('bodySerializer', $.literal(null));
        }
        break;
    }
  }

  // TODO: parser - set parseAs to skip inference if every response has the same
  // content type. currently impossible because successes do not contain
  // header information

  const paramSerializers = $.object();

  for (const name in operation.parameters?.query) {
    const parameter = operation.parameters.query[name]!;

    if (parameter.schema.type === 'array' || parameter.schema.type === 'tuple') {
      if (parameter.style !== 'form' || !parameter.explode) {
        // override the default settings for array serialization
        paramSerializers.prop(
          parameter.name,
          $.object().prop(
            'array',
            $.object()
              .$if(parameter.explode === false, (o) =>
                o.prop('explode', $.literal(parameter.explode)),
              )
              .$if(parameter.style !== 'form', (o) => o.prop('style', $.literal(parameter.style))),
          ),
        );
      }
    } else if (parameter.schema.type === 'object') {
      if (parameter.style !== 'deepObject' || !parameter.explode) {
        // override the default settings for object serialization
        paramSerializers.prop(
          parameter.name,
          $.object().prop(
            'object',
            $.object()
              .$if(parameter.explode === false, (o) =>
                o.prop('explode', $.literal(parameter.explode)),
              )
              .$if(parameter.style !== 'deepObject', (o) =>
                o.prop('style', $.literal(parameter.style)),
              ),
          ),
        );
      }
    }
  }

  if (paramSerializers.hasProps()) {
    // TODO: if all parameters have the same serialization,
    // apply it globally to reduce output size
    reqOptions.prop('querySerializer', $.object().prop('parameters', paramSerializers));
  }

  const requestValidator = createRequestValidator({ operation, plugin });
  const responseHandlers = createResponseHandlers({ operation, plugin });

  if (requestValidator) {
    reqOptions.prop('requestValidator', requestValidator);
  }

  if (responseHandlers.transformer) {
    reqOptions.prop('responseTransformer', responseHandlers.transformer);
  }

  const isSse = hasOperationSse({ operation });
  let responseTypeValue: ReturnType<typeof getResponseType> | undefined;

  for (const statusCode in operation.responses) {
    const response = operation.responses[statusCode]!;

    // try to infer `responseType` option for Axios. We don't need this in
    // Fetch API client because it automatically detects the correct response
    // during runtime.
    if (!responseTypeValue && client.name === '@hey-api/client-axios') {
      // this doesn't handle default status code for now
      if (statusCodeToGroup({ statusCode }) === '2XX') {
        responseTypeValue = getResponseType(response.mediaType);
        if (responseTypeValue) {
          reqOptions.prop('responseType', $.literal(responseTypeValue));
        }
      }
    }
  }

  if (responseHandlers.validator) {
    reqOptions.prop('responseValidator', responseHandlers.validator);
  }

  if (plugin.config.responseStyle === 'data') {
    reqOptions.prop('responseStyle', $.literal(plugin.config.responseStyle));
  }

  const auth = operationAuth({ context: plugin.context, operation, plugin });
  if (auth.length) {
    reqOptions.prop('security', $.fromValue(auth));
  }

  reqOptions.prop('url', $.literal(operation.path));

  // options must go last to allow overriding parameters above
  reqOptions.spread('options');

  const statements: Array<ReturnType<typeof $.return | typeof $.const>> = [];
  const hasParams = opParameters.argNames.length;

  if (hasParams) {
    const args: Array<ReturnType<typeof $.expr>> = [];
    const config: Array<ReturnType<typeof $.object>> = [];
    for (const argName of opParameters.argNames) {
      args.push($(argName));
    }
    for (const field of opParameters.fields) {
      const shape = $.object();
      if ('in' in field) {
        shape.prop('in', $.literal(field.in));
      }
      if ('key' in field) {
        if (field.key) {
          shape.prop('key', $.literal(field.key));
        }
        if (field.map) {
          shape.prop('map', $.literal(field.map));
        }
      }
      config.push(shape);
    }
    statements.push(
      $.const('params').assign(
        $(plugin.imports.buildClientParams).call(
          $.array(...args),
          $.array($.object().prop('args', $.array(...config))),
        ),
      ),
    );
    reqOptions.spread('params');
  }

  if (operation.body) {
    const parameterContentType = operation.parameters?.header?.['content-type'];
    const hasRequiredContentType = Boolean(parameterContentType?.required);
    // spreading required Content-Type on generated header would throw a TypeScript error
    if (!hasRequiredContentType) {
      const headers = $.object()
        .pretty()
        // form-data does not need Content-Type header, browser will set it automatically
        .prop(
          parameterContentType?.name ?? 'Content-Type',
          $.literal(operation.body.type === 'form-data' ? null : operation.body.mediaType),
        )
        .spread($('options').attr('headers').required(isRequiredOptions));
      if (hasParams) {
        headers.spread($('params').attr('headers'));
      }
      reqOptions.prop('headers', headers);
    }
  }

  // TODO: contract (?)
  const symbolClient = plugin.config.client
    ? plugin.querySymbol({
        category: 'client',
      })
    : undefined;

  let clientExpression: ReturnType<typeof $.attr | typeof $.binary>;
  const optionsClient = $('options').attr('client').required(isRequiredOptions);
  if (isInstance(plugin)) {
    clientExpression = optionsClient.coalesce($('this').attr('client'));
  } else if (symbolClient) {
    clientExpression = optionsClient.coalesce(symbolClient);
  } else {
    clientExpression = optionsClient;
  }

  let functionName = isSse ? clientExpression.attr('sse') : clientExpression;
  functionName = functionName.attr(operation.method);

  const call = functionName.call(reqOptions);
  if (isNuxtClient) {
    call
      .generic(nuxtTypeComposable)
      .generic($.type.or(symbolResponseType ?? 'unknown', nuxtTypeDefault))
      .generic(symbolErrorType ?? 'unknown')
      .generic(nuxtTypeDefault);
  } else {
    call.generic(symbolResponseType ?? 'unknown').generic(symbolErrorType ?? 'unknown');
    if (!isEffectClient) {
      call.generic('ThrowOnError');
    }
  }
  if (plugin.config.responseStyle === 'data' && !(isEffectClient && isSse)) {
    call.generic($.type.literal(plugin.config.responseStyle));
  }
  statements.push($.return(call));

  return statements;
}

/**
 * Builds the return type annotation for an SDK operation function.
 */
export function operationReturnType({
  operation,
  plugin,
}: {
  operation: IR.OperationObject;
  plugin: HeyApiSdkPlugin['Instance'];
}): ReturnType<typeof $.type> {
  const client = getClientPlugin(getTypedConfig(plugin));
  const isNuxt = client.name === '@hey-api/client-nuxt';
  const isEffect = client.name === '@hey-api/client-effect';
  const isSse = hasOperationSse({ operation });

  // TODO: contract (?)
  const queryType = (role: 'response' | 'responses' | 'error' | 'errors') =>
    plugin.querySymbol({
      category: 'type',
      resource: 'operation',
      resourceId: operation.id,
      role,
    }) ?? 'unknown';

  const requestResult = $.type(plugin.imports.RequestResult);
  const sseResult = $.type(plugin.imports.ServerSentEventsResult);

  if (isNuxt) {
    const inner = requestResult
      .generic(nuxtTypeComposable)
      .generic($.type.or(queryType('response'), nuxtTypeDefault));
    return isSse
      ? $.type('Promise').generic(sseResult.generic(inner.generic('unknown')))
      : inner.generic(nuxtTypeDefault);
  }

  if (isEffect) {
    if (isSse) {
      return sseResult.generic(queryType('responses')).generic(queryType('errors'));
    }
    return requestResult
      .generic(queryType('responses'))
      .generic(queryType('errors'))
      .$if(plugin.config.responseStyle === 'data', (t) =>
        t.generic($.type.literal(plugin.config.responseStyle)),
      );
  }

  if (isSse) {
    return $.type('Promise').generic(sseResult.generic(queryType('responses')));
  }

  return requestResult
    .generic(queryType('responses'))
    .generic(queryType('errors'))
    .generic('ThrowOnError')
    .$if(plugin.config.responseStyle === 'data', (t) =>
      t.generic($.type.literal(plugin.config.responseStyle)),
    );
}
