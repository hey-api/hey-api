import type { AnalysisContext, NodeName, Ref } from '@hey-api/codegen-core';
import { fromRef, isSymbol, ref } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import type { MaybeTsDsl } from '../base';
import { TsDsl } from '../base';

export type TemplatePart = NodeName | MaybeTsDsl<ts.Expression>;

const Mixed = TsDsl<ts.TemplateExpression | ts.NoSubstitutionTemplateLiteral>;

export class TemplateTsDsl extends Mixed {
  readonly '~dsl' = 'TemplateTsDsl';

  protected parts: Array<Ref<TemplatePart>> = [];

  constructor(value?: TemplatePart) {
    super();
    if (value !== undefined) this.add(value);
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    for (const part of this.parts) {
      ctx.analyze(part);
    }
  }

  add(value: TemplatePart): this {
    this.parts.push(ref(value));
    return this;
  }

  override toAst() {
    const parts = this.$node(
      this.parts.map((p) => {
        const part = fromRef(p);
        return isSymbol(part) ? part.finalName : part;
      }),
    );

    const normalized: Array<string | ts.Expression> = [];
    // merge consecutive string parts
    for (let index = 0; index < parts.length; index++) {
      const current = parts[index]!;
      if (typeof current === 'string') {
        let merged = current;
        while (index + 1 < parts.length && typeof parts[index + 1] === 'string') {
          merged += parts[index + 1];
          index++;
        }
        normalized.push(merged);
      } else if (typeof current === 'number') {
        normalized.push(String(current));
      } else {
        normalized.push(current);
      }
    }

    if (!normalized.length || typeof normalized[0] !== 'string') {
      normalized.unshift('');
    }

    if (normalized.length === 1 && typeof normalized[0] === 'string') {
      return ts.factory.createNoSubstitutionTemplateLiteral(normalized[0]);
    }

    if (
      normalized.length === 2 &&
      typeof normalized[0] === 'string' &&
      typeof normalized[1] !== 'string'
    ) {
      return ts.factory.createTemplateExpression(ts.factory.createTemplateHead(normalized[0]), [
        ts.factory.createTemplateSpan(normalized[1]!, ts.factory.createTemplateTail('')),
      ]);
    }

    const head = ts.factory.createTemplateHead(normalized.shift() as string);
    const spans: Array<ts.TemplateSpan> = [];

    while (normalized.length) {
      const expr = normalized.shift() as ts.Expression;
      const next = typeof normalized[0] === 'string' ? (normalized.shift() as string) : '';
      const isLast = !normalized.length;
      spans.push(
        ts.factory.createTemplateSpan(
          expr,
          isLast ? ts.factory.createTemplateTail(next) : ts.factory.createTemplateMiddle(next),
        ),
      );
    }

    return ts.factory.createTemplateExpression(head, spans);
  }
}
