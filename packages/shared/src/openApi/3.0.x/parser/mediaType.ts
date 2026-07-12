import type { OpenAPIV3 } from '@hey-api/spec-types';

import type { IRMediaType } from '../../../ir/mediaType';
import { isMediaTypeFileLike, mediaTypeToIrMediaType } from '../../../ir/mediaType';

interface Content {
  mediaType: string;
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined;
  type: IRMediaType | undefined;
}

export function contentToSchema({
  content,
}: {
  content: Content;
}): OpenAPIV3.SchemaObject | undefined {
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
  content,
}: {
  content: Record<string, OpenAPIV3.MediaTypeObject> | undefined;
}): ReadonlyArray<Content> {
  const objects: Array<Content> = [];

  for (const mediaType in content) {
    objects.push({
      mediaType,
      schema: content[mediaType]!.schema,
      type: mediaTypeToIrMediaType({ mediaType }),
    });
  }

  return objects;
}
