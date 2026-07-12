import type { AnalysisContext, NodeName } from '@hey-api/codegen-core';
import { isSymbol } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import type { MaybeTsDsl } from '../base';
import { TsDsl } from '../base';
import { DocMixin } from '../mixins/doc';
import { ConstMixin, ExportMixin } from '../mixins/modifiers';
import { safeRuntimeName } from '../utils/name';
import { EnumMemberTsDsl } from './member';

type Value = string | number | MaybeTsDsl<ts.Expression>;
type ValueFn = Value | ((m: EnumMemberTsDsl) => void);

const Mixed = ConstMixin(DocMixin(ExportMixin(TsDsl<ts.EnumDeclaration>)));

export class EnumTsDsl extends Mixed {
  readonly '~dsl' = 'EnumTsDsl';
  override readonly nameSanitizer = safeRuntimeName;

  private _members: Array<EnumMemberTsDsl> = [];

  constructor(name: NodeName, fn?: (e: EnumTsDsl) => void) {
    super();
    this.name.set(name);
    if (isSymbol(name)) {
      name.setKind('enum');
    }
    fn?.(this);
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    ctx.analyze(this.name);
    ctx.pushScope();
    try {
      for (const member of this._members) {
        ctx.analyze(member);
      }
    } finally {
      ctx.popScope();
    }
  }

  /** Adds an enum member. */
  member(name: string, value?: ValueFn): this {
    const m = new EnumMemberTsDsl(name, value);
    this._members.push(m);
    return this;
  }

  /** Adds multiple enum members. */
  members(...members: ReadonlyArray<EnumMemberTsDsl>): this {
    this._members.push(...members);
    return this;
  }

  override toAst() {
    const node = ts.factory.createEnumDeclaration(
      this.modifiers,
      this.$node(this.name) as ts.Identifier,
      this.$node(this._members) as ReadonlyArray<ts.EnumMember>,
    );
    return this.$docs(node);
  }
}
