import { isSymbol } from '@hey-api/codegen-core';

import { $ } from '../../../../py-dsl';
import { $ as $$ } from '../../dsl';
import type { IntersectionResolverContext } from '../../resolvers';
import type { PydanticResult, PydanticType } from '../../shared/types';

function isReferenceResult(result: PydanticResult): boolean {
  // A reference result carries a rootModel node wrapping a Symbol type
  // (set by the visitor's reference() handler via plugin.referenceSymbol()).
  return (
    result.node?.kind === 'rootModel' && result.type !== undefined && isSymbol(result.type.type)
  );
}

interface Composition {
  baseClasses: Array<ReturnType<typeof $$.constrainedType>>;
  mergedFields: Array<ReturnType<typeof $$.field>>;
}

function collectComposition(
  childResults: ReadonlyArray<PydanticResult>,
  applyModifiers: IntersectionResolverContext['applyModifiers'],
): Composition {
  const baseClasses: Array<ReturnType<typeof $$.constrainedType>> = [];
  const mergedFields: Array<ReturnType<typeof $$.field>> = [];
  const seenFieldNames = new Set<object>();

  // `allOf` members later in the list narrow/override earlier ones, but a
  // Python base class list gives priority to the *first* entry (pydantic
  // resolves same-named fields the same way), so walk members back to front.
  for (const result of [...childResults].reverse()) {
    if (isReferenceResult(result)) {
      const t = result.type!;
      if (!baseClasses.includes(t)) baseClasses.push(t);
      continue;
    }

    const finalResult = applyModifiers(result);

    if (finalResult.node?.kind === 'model') {
      for (const field of finalResult.node.fields) {
        if (!seenFieldNames.has(field.name as object)) {
          seenFieldNames.add(field.name as object);
          mergedFields.push(field);
        }
      }
    }
  }

  return { baseClasses, mergedFields };
}

function baseNode(ctx: IntersectionResolverContext): PydanticType {
  const { applyModifiers, childResults, plugin } = ctx;

  if (!childResults.length) {
    return { type: $$.constrainedType(plugin.imports.typing.Any) };
  }

  if (childResults.length === 1) {
    return applyModifiers(childResults[0]!);
  }

  const { baseClasses, mergedFields } = collectComposition(childResults, applyModifiers);

  // At least one member is a $ref: emit a model that inherits from every
  // referenced member and carries any fields contributed by inline members.
  if (baseClasses.length) {
    return {
      node: { baseClasses, fields: mergedFields, kind: 'model' },
      type: baseClasses[0]!,
    };
  }

  // No $ref members: fall back to merging inline object fields into a plain model.
  if (mergedFields.length) {
    return { node: { fields: mergedFields, kind: 'model' } };
  }

  return { type: $$.constrainedType(plugin.imports.typing.Any) };
}

function intersectionResolver(ctx: IntersectionResolverContext): PydanticType {
  return ctx.nodes.base(ctx);
}

export interface IntersectionToTypeResult extends PydanticType {
  baseClasses?: Array<ReturnType<typeof $$.constrainedType>>;
  childResults: Array<PydanticResult>;
  mergedFields?: Array<ReturnType<typeof $$.field>>;
}

export function intersectionToType({
  applyModifiers,
  childResults,
  parentSchema,
  path,
  plugin,
}: Pick<
  IntersectionResolverContext,
  'applyModifiers' | 'childResults' | 'parentSchema' | 'path' | 'plugin'
>): IntersectionToTypeResult {
  const resolverCtx: IntersectionResolverContext = {
    $,
    applyModifiers,
    childResults,
    nodes: { base: baseNode },
    parentSchema,
    path,
    plugin,
    schema: parentSchema,
  };

  const resolver =
    plugin.config.$resolvers?.intersection ?? plugin.config['~resolvers']?.intersection;
  let resolved = resolver?.(resolverCtx) ?? intersectionResolver(resolverCtx);

  if (parentSchema.description !== undefined && resolved.type) {
    resolved = {
      ...resolved,
      type: resolved.type.mergeConstraints($$.constraints().description(parentSchema.description)),
    };
  }

  const { baseClasses, mergedFields } = collectComposition(childResults, applyModifiers);

  return {
    ...resolved,
    baseClasses: baseClasses.length ? baseClasses : undefined,
    childResults,
    mergedFields: mergedFields.length ? mergedFields : undefined,
  };
}
