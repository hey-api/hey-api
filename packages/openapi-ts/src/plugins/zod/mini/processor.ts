import { ref } from '@hey-api/codegen-core';
import type { SchemaExtractor } from '@hey-api/shared';
import { createSchemaProcessor, createSchemaWalker, pathToJsonPointer } from '@hey-api/shared';

import { exportAst } from '../shared/export';
import type { ProcessorContext, ProcessorResult } from '../shared/processor';
import type { ZodFinal } from '../shared/types';
import type { ZodPlugin } from '../types';
import { createVisitor } from './visitor';

export function createProcessor(plugin: ZodPlugin['Instance']): ProcessorResult {
  const processor = createSchemaProcessor();

  const extractorHooks = plugin.getHooks((hooks) => hooks.schemas?.shouldExtract);

  const schemaExtractor: SchemaExtractor<ProcessorContext> = (ctx) => {
    if (processor.hasEmitted(ctx.path)) {
      return ctx.schema;
    }

    for (const hook of extractorHooks) {
      const result = typeof hook === 'boolean' ? hook : hook(ctx);
      if (result) {
        process({
          namingAnchor: processor.context.anchor,
          tags: processor.context.tags,
          ...ctx,
        });
        return { $ref: pathToJsonPointer(ctx.path) };
      }
    }

    return ctx.schema;
  };

  const visitor = createVisitor({ plugin, schemaExtractor });
  const walk = createSchemaWalker(visitor);

  function process(ctx: ProcessorContext): ZodFinal | void {
    if (!processor.markEmitted(ctx.path)) return;

    const shouldExport = ctx.export !== false;

    return processor.withContext({ anchor: ctx.namingAnchor, tags: ctx.tags }, () => {
      const result = walk(ctx.schema, {
        path: ref(ctx.path),
        plugin,
      });

      const final = visitor.applyModifiers(result, {
        path: ref(ctx.path),
        plugin,
      }) as ZodFinal;

      if (shouldExport) {
        exportAst({
          ...ctx,
          final,
          meta: result.meta.isIntersection ? { ...ctx.meta, isIntersection: true } : ctx.meta,
          plugin,
        });
        return;
      }

      return final;
    });
  }

  return { process };
}
