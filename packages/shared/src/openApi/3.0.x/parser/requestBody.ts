import type { OpenAPIV3 } from '@hey-api/spec-types';

import type { Context } from '../../../ir/context';
import type { IR } from '../../../ir/types';
import { refToName } from '../../../utils/ref';
import { mediaTypeObjects } from './mediaType';
import { schemaToIrSchema } from './schema';

const requestBodyToIrRequestBody = ({
  $ref,
  context,
  requestBody,
}: {
  $ref: string;
  context: Context;
  requestBody: OpenAPIV3.RequestBodyObject;
}): IR.RequestBodyObject => {
  // TODO: parser - fix
  const contents = mediaTypeObjects({ content: requestBody.content });
  // TODO: add support for multiple content types, for now prefer JSON
  const content = contents.find((content) => content.type === 'json') || contents[0];
  const schema = content ? content.schema : undefined;

  const finalSchema: OpenAPIV3.SchemaObject = {
    description: requestBody.description,
    ...schema,
  };

  const irRequestBody: IR.RequestBodyObject = {
    schema: schemaToIrSchema({
      context,
      schema: finalSchema,
      state: {
        $ref,
        circularReferenceTracker: new Set(),
      },
    }),
  };

  if (requestBody.description) {
    irRequestBody.description = requestBody.description;
  }

  if (requestBody.required) {
    irRequestBody.required = requestBody.required;
  }

  return irRequestBody;
};

export function parseRequestBody({
  $ref,
  context,
  requestBody,
}: {
  $ref: string;
  context: Context;
  requestBody: OpenAPIV3.RequestBodyObject;
}): void {
  if (!context.ir.components) {
    context.ir.components = {};
  }

  if (!context.ir.components.requestBodies) {
    context.ir.components.requestBodies = {};
  }

  context.ir.components.requestBodies[refToName($ref)] = requestBodyToIrRequestBody({
    $ref,
    context,
    requestBody,
  });
}
