import type { OpenAPIV3_1 } from '@hey-api/spec-types';

import type { Context } from '../../../ir/context';
import type { IR } from '../../../ir/types';
import { selectContent } from '../../../openApi/shared/utils/content';
import { refToName } from '../../../utils/ref';
import { mediaTypeObjects } from './mediaType';
import { schemaToIrSchema } from './schema';

function requestBodyToIrRequestBody({
  $ref,
  context,
  requestBody,
}: {
  $ref: string;
  context: Context;
  requestBody: OpenAPIV3_1.RequestBodyObject;
}): IR.RequestBodyObject {
  // TODO: parser - fix
  const contents = mediaTypeObjects({ content: requestBody.content });
  const content = selectContent({
    contents,
    preferred: context.config.parser.content.preferred.requests,
  });
  const schema = content ? content.schema : undefined;

  const finalSchema: OpenAPIV3_1.SchemaObject = {
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
}

export function parseRequestBody({
  $ref,
  context,
  requestBody,
}: {
  $ref: string;
  context: Context;
  requestBody: OpenAPIV3_1.RequestBodyObject;
}) {
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
