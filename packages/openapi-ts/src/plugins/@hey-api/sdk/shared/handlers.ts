import { registerResponseTransformer } from './response-type';
import { createResponseTransformer } from './transformer';
import type { ResponseHandlers, ValidatorArgs } from './types';
import { createResponseValidator } from './validator';

export function createResponseHandlers({ operation, plugin }: ValidatorArgs): ResponseHandlers {
  let handlers: ResponseHandlers | undefined;
  const responseTransformer = plugin.config.transformer.response;
  const useResponseHandlers =
    responseTransformer && responseTransformer === plugin.config.validator.response;
  if (useResponseHandlers) {
    const handler = plugin.getPluginOrThrow(responseTransformer);
    if (handler.api?.createResponseHandlers) {
      handlers = handler.api.createResponseHandlers({
        operation,
        // @ts-expect-error
        plugin: handler,
      });
    }
  }
  if (!handlers) {
    handlers = {
      transformer: createResponseTransformer({ operation, plugin }),
      validator: createResponseValidator({ operation, plugin }),
    };
  }
  registerResponseTransformer({ operation, plugin }, handlers);
  return handlers;
}
