import type { IR } from '@hey-api/shared';

import { getTypedConfig } from '../../../config/utils';
import { $ } from '../../../ts-dsl';
import { getClientPlugin } from '../../@hey-api/client-core/utils';
import { operationOptionsType } from '../../@hey-api/sdk/shared/operation';
import { operationResponseType } from '../../@hey-api/sdk/shared/response-type';
import type { PiniaColadaPlugin } from './types';

export const useTypeData = ({
  operation,
  plugin,
}: {
  operation: IR.OperationObject;
  plugin: PiniaColadaPlugin['Instance'];
}): ReturnType<typeof $.type> => {
  const pluginSdk = plugin.getPluginOrThrow('@hey-api/sdk');
  return operationOptionsType({ operation, plugin: pluginSdk });
};

export const useTypeError = ({
  operation,
  plugin,
}: {
  operation: IR.OperationObject;
  plugin: PiniaColadaPlugin['Instance'];
}): ReturnType<typeof $.type> => {
  const client = getClientPlugin(getTypedConfig(plugin));
  // TODO: contract (?)
  const symbolErrorType = plugin.querySymbol({
    category: 'type',
    resource: 'operation',
    resourceId: operation.id,
    role: 'error',
  });
  const symbolError = symbolErrorType || 'Error';
  if (client.name === '@hey-api/client-axios') {
    const symbol = plugin.imports.axios.AxiosError;
    return $.type(symbol).generic(symbolError);
  }
  return $.type(symbolError);
};

export const useTypeResponse = ({
  operation,
  plugin,
}: {
  operation: IR.OperationObject;
  plugin: PiniaColadaPlugin['Instance'];
}): ReturnType<typeof $.type> => {
  const symbolResponseType = operationResponseType({ operation, plugin, role: 'response' });
  return $.type(symbolResponseType ?? 'unknown');
};
