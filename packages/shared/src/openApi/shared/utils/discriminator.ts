import type { IR } from '../../../ir/types';
import { refToName } from '../../../utils/ref';

/**
 * Supported types for discriminator properties.
 */
export type DiscriminatorPropertyType = 'boolean' | 'integer' | 'number' | 'string';

/**
 * Converts a string discriminator mapping value to the appropriate type based on
 * the actual property type in the schema.
 *
 * OpenAPI discriminator mappings always use string keys, but the actual discriminator
 * property may be a boolean, number, or integer. This function converts the string
 * key to the correct runtime value and IR type.
 */
export function convertDiscriminatorValue(
  value: string,
  propertyType: DiscriminatorPropertyType,
): { const: IR.SchemaObject['const']; type: IR.SchemaObject['type'] } {
  switch (propertyType) {
    case 'boolean': {
      const lowerValue = value.toLowerCase();
      if (lowerValue !== 'true' && lowerValue !== 'false') {
        console.warn(
          '🚨',
          `non-boolean discriminator mapping value "${value}" for boolean property, falling back to string`,
        );
        return {
          const: value,
          type: 'string',
        };
      }
      return {
        const: lowerValue === 'true',
        type: 'boolean',
      };
    }
    case 'integer': {
      const parsed = Number.parseInt(value, 10);
      if (Number.isNaN(parsed)) {
        console.warn(
          '🚨',
          `non-numeric discriminator mapping value "${value}" for integer property, falling back to string`,
        );
        return {
          const: value,
          type: 'string',
        };
      }
      return {
        const: parsed,
        type: 'integer',
      };
    }
    case 'number': {
      const parsed = parseFloat(value);
      if (Number.isNaN(parsed)) {
        console.warn(
          '🚨',
          `non-numeric discriminator mapping value "${value}" for number property, falling back to string`,
        );
        return {
          const: value,
          type: 'string',
        };
      }
      return {
        const: parsed,
        type: 'number',
      };
    }
    default:
      return {
        const: value,
        type: 'string',
      };
  }
}

export function discriminatorValues(
  $ref: string,
  mapping?: Record<string, string>,
  shouldUseRefAsValue?: () => boolean,
): ReadonlyArray<string> {
  const values: Array<string> = [];

  for (const name in mapping) {
    if (mapping[name] === $ref) {
      values.push(name);
    }
  }

  if (!values.length && (!shouldUseRefAsValue || shouldUseRefAsValue())) {
    return [refToName($ref)];
  }

  return values;
}

function discriminatorNeedsExtend(
  effective: IR.SchemaObject,
  discriminatorKey: string,
  discriminatorProp: IR.SchemaObject | undefined,
): boolean {
  if (discriminatorProp?.const === undefined) {
    return true;
  }
  if (discriminatorProp.default !== undefined) {
    return true;
  }
  if (!effective.required?.includes(discriminatorKey)) {
    return true;
  }
  return false;
}

export interface DiscriminatedUnionMember {
  /** The discriminator value for this member. */
  discriminatedValue: unknown;
  /**
   * True when the referenced schema does not already define the discriminator
   * property as a required const/literal. The plugin must inject it explicitly
   * when the property is missing, optional, or has a default (e.g. Pydantic).
   */
  needsExtend: boolean;
  /** The resolved $ref string for this member. */
  ref: string;
}

export interface DiscriminatedUnionData {
  discriminatorKey: string;
  members: Array<DiscriminatedUnionMember>;
}

export function buildDiscriminatedUnion({
  parentSchema,
  resolveIrRef,
  schemas,
}: {
  parentSchema: IR.SchemaObject;
  resolveIrRef: (ref: string) => IR.SchemaObject | undefined;
  schemas: ReadonlyArray<IR.SchemaObject>;
}): DiscriminatedUnionData | null {
  const discriminatorKey = parentSchema.discriminator?.propertyName;
  if (!discriminatorKey) return null;

  const members: Array<DiscriminatedUnionMember> = [];

  for (const schema of schemas) {
    if (schema.type === 'null' || schema.const === null) continue;

    const ref = schema.$ref;
    if (!ref) return null;

    let resolved: IR.SchemaObject | undefined;
    try {
      resolved = resolveIrRef(ref);
    } catch {
      return null;
    }
    if (!resolved) return null;

    let effective = resolved;
    while (effective.$ref && !effective.type && !effective.properties && !effective.items) {
      try {
        const next = resolveIrRef(effective.$ref);
        if (!next) break;
        effective = next;
      } catch {
        break;
      }
    }

    const discriminatorProp = effective.properties?.[discriminatorKey];
    const needsExtend = discriminatorNeedsExtend(effective, discriminatorKey, discriminatorProp);
    const isObjectLike = effective.type === 'object' || effective.logicalOperator === 'and';
    if (needsExtend && !isObjectLike) return null;

    const values = discriminatorValues(ref, parentSchema.discriminator!.mapping);
    if (!values.length) return null;

    const propType = discriminatorProp?.type as DiscriminatorPropertyType | undefined;

    for (const value of values) {
      const discriminatedValue =
        propType && propType !== 'string'
          ? convertDiscriminatorValue(value, propType).const
          : value;

      members.push({
        discriminatedValue,
        needsExtend,
        ref,
      });
    }
  }

  if (!members.length) return null;

  return { discriminatorKey, members };
}
