import type { OpenAPIV3_1 } from '@hey-api/spec-types';

import type { Context } from '../../../ir/context';
import { getPaginationKeywordsRegExp } from '../../../ir/pagination';
import type { SchemaType } from '../../../openApi/shared/types/schema';
import { mediaTypeObjects } from './mediaType';
import { getSchemaTypes } from './schema';

function isPaginationType(
  schemaTypes: ReadonlyArray<SchemaType<OpenAPIV3_1.SchemaObject>>,
): boolean {
  return (
    schemaTypes.includes('boolean') ||
    schemaTypes.includes('integer') ||
    schemaTypes.includes('number') ||
    schemaTypes.includes('string')
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
  schema: OpenAPIV3_1.SchemaObject;
}): boolean | string {
  const paginationRegExp = getPaginationKeywordsRegExp(context.config.parser.pagination);
  if (paginationRegExp.test(name)) {
    return true;
  }

  if (schema.$ref) {
    const ref = context.resolveRef<
      OpenAPIV3_1.ParameterObject | OpenAPIV3_1.RequestBodyObject | OpenAPIV3_1.SchemaObject
    >(schema.$ref);

    if ('content' in ref || 'in' in ref) {
      let refSchema: OpenAPIV3_1.SchemaObject | undefined;

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

      if (typeof property !== 'boolean') {
        // TODO: resolve deeper references
        const schemaTypes = getSchemaTypes(property);

        if (!schemaTypes.length) {
          const compositionSchemas = property.anyOf ?? property.oneOf;
          const nonNullCompositionSchemas = (compositionSchemas ?? []).filter(
            (schema) => schema.type !== 'null',
          );
          if (nonNullCompositionSchemas.length === 1) {
            const schemaTypes = getSchemaTypes(nonNullCompositionSchemas[0]!);
            if (isPaginationType(schemaTypes)) {
              return name;
            }
          }
        }

        if (isPaginationType(schemaTypes)) {
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
