import type { OpenAPIV2 } from '@hey-api/spec-types';

import type { IRMediaType } from '../../../ir/mediaType';
import { isMediaTypeFileLike, mediaTypeToIrMediaType } from '../../../ir/mediaType';

interface Content {
  mediaType: string;
  schema: OpenAPIV2.SchemaObject | OpenAPIV2.ReferenceObject | undefined;
  type: IRMediaType | undefined;
}

export function contentToSchema({
  content,
}: {
  content: Content;
}): OpenAPIV2.SchemaObject | undefined {
  const { mediaType, schema } = content;

  if (schema && '$ref' in schema) {
    return {
      allOf: [{ ...schema }],
    };
  }

  if (!schema) {
    if (isMediaTypeFileLike({ mediaType })) {
      return {
        format: 'binary',
        type: 'string',
      };
    }
    return;
  }

  if (schema.type === 'string' && !schema.format && isMediaTypeFileLike({ mediaType })) {
    return {
      ...schema,
      format: 'binary',
    };
  }

  return schema;
}

export function mediaTypeObjects({
  mimeTypes,
  response,
}: {
  mimeTypes: ReadonlyArray<string> | undefined;
  response: Pick<OpenAPIV2.ResponseObject, 'schema'>;
}): ReadonlyArray<Content> {
  const objects: Array<Content> = [];

  for (const mediaType of mimeTypes ?? []) {
    objects.push({
      mediaType,
      schema: response.schema,
      type: mediaTypeToIrMediaType({ mediaType }),
    });
  }

  return objects;
}
