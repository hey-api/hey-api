import type { AnalysisContext, NodeName } from '@hey-api/codegen-core';
import { isSymbol } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import { TsDsl, TypeTsDsl } from '../base';
import { DocMixin } from '../mixins/doc';
import { HintMixin } from '../mixins/hint';
import { DefaultMixin, ExportMixin } from '../mixins/modifiers';
import { PatternMixin } from '../mixins/pattern';
import { ValueMixin } from '../mixins/value';
import { TypeExprTsDsl } from '../type/expr';
import { safeRuntimeName } from '../utils/name';

const Mixed = DefaultMixin(
  DocMixin(ExportMixin(HintMixin(PatternMixin(ValueMixin(TsDsl<ts.VariableStatement>))))),
);

export class VarTsDsl extends Mixed {
  readonly '~dsl' = 'VarTsDsl';
  override readonly nameSanitizer = safeRuntimeName;

  protected kind: ts.NodeFlags = ts.NodeFlags.None;
  protected _type?: TypeTsDsl;

  constructor(name?: NodeName) {
    super();
    if (name) this.name.set(name);
    if (isSymbol(name)) {
      name.setKind('var');
    }
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    ctx.analyze(this.name);
    ctx.analyze(this._type);
  }

  /** Returns true when all required builder calls are present. */
  get isValid(): boolean {
    return !this.missingRequiredCalls().length;
  }

  const(): this {
    this.kind = ts.NodeFlags.Const;
    return this;
  }

  let(): this {
    this.kind = ts.NodeFlags.Let;
    return this;
  }

  /** Sets the variable type. */
  type(node: NodeName | TypeTsDsl): this {
    this._type = node instanceof TypeTsDsl ? node : new TypeExprTsDsl(node);
    return this;
  }

  var(): this {
    this.kind = ts.NodeFlags.None;
    return this;
  }

  override toAst() {
    this.$validate();
    const node = ts.factory.createVariableStatement(
      this.modifiers,
      ts.factory.createVariableDeclarationList(
        [
          ts.factory.createVariableDeclaration(
            this.$pattern() ?? (this.$node(this.name) as ts.BindingName),
            undefined,
            this.$type(this._type),
            this.$value(),
          ),
        ],
        this.kind,
      ),
    );
    return this.$docs(this.$hint(node));
  }

  $validate(): asserts this {
    const missing = this.missingRequiredCalls();
    if (!missing.length) return;
    throw new Error(`Variable declaration missing ${missing.join(' and ')}`);
  }

  private missingRequiredCalls(): ReadonlyArray<string> {
    const missing: Array<string> = [];
    if (!this.$pattern() && !this.name.toString())
      missing.push('name or pattern (.array()/.object())');
    return missing;
  }
}
