import type { OpenAPIV3 } from '@hey-api/spec-types';

import type { Context } from '../../../ir/context';
import { getPaginationKeywordsRegExp } from '../../../ir/pagination';
import type { SchemaType } from '../../../openApi/shared/types/schema';
import { mediaTypeObjects } from './mediaType';
import { getSchemaType } from './schema';

function isPaginationType(schemaType: SchemaType<OpenAPIV3.SchemaObject> | undefined): boolean {
  return (
    schemaType === 'boolean' ||
    schemaType === 'integer' ||
    schemaType === 'number' ||
    schemaType === 'string'
  );
}

// We handle only simple values for now, up to 1 nested field
export function paginationField({
  context,
  name,
  schema,
}: {
  context: Context;
  name: string;
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
}): boolean | string {
  const paginationRegExp = getPaginationKeywordsRegExp(context.config.parser.pagination);
  if (paginationRegExp.test(name)) {
    return true;
  }

  if ('$ref' in schema) {
    const ref = context.resolveRef<
      OpenAPIV3.ParameterObject | OpenAPIV3.RequestBodyObject | OpenAPIV3.SchemaObject
    >(schema.$ref);

    if ('content' in ref || 'in' in ref) {
      let refSchema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined;

      if ('in' in ref) {
        refSchema = ref.schema;
      }

      if (!refSchema) {
        // parameter or body
        const contents = mediaTypeObjects({ content: ref.content });
        // TODO: add support for multiple content types, for now prefer JSON
        const content = contents.find((content) => content.type === 'json') || contents[0];
        if (content?.schema) {
          refSchema = content.schema;
        }
      }

      if (!refSchema) {
        return false;
      }

      return paginationField({
        context,
        name,
        schema: refSchema,
      });
    }

    return paginationField({
      context,
      name,
      schema: ref,
    });
  }

  for (const name in schema.properties) {
    const paginationRegExp = getPaginationKeywordsRegExp(context.config.parser.pagination);

    if (paginationRegExp.test(name)) {
      const property = schema.properties[name]!;

      if (typeof property !== 'boolean' && !('$ref' in property)) {
        const schemaType = getSchemaType(property);
        // TODO: resolve deeper references

        if (isPaginationType(schemaType)) {
          return name;
        }
      }
    }
  }

  for (const allOf of schema.allOf ?? []) {
    const pagination = paginationField({
      context,
      name,
      schema: allOf,
    });
    if (pagination) {
      return pagination;
    }
  }

  return false;
}
