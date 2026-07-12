import type { AnalysisContext, NodeName, NodeScope } from '@hey-api/codegen-core';
import { isSymbol } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import type { MaybeTsDsl } from '../base';
import { TsDsl } from '../base';
import { DocMixin } from '../mixins/doc';
import { ExportMixin } from '../mixins/modifiers';
import { TypeParamsMixin } from '../mixins/type-params';
import { safeTypeName } from '../utils/name';

type Value = MaybeTsDsl<ts.TypeNode>;

const Mixed = DocMixin(ExportMixin(TypeParamsMixin(TsDsl<ts.TypeAliasDeclaration>)));

export class TypeAliasTsDsl extends Mixed {
  readonly '~dsl' = 'TypeAliasTsDsl';
  override readonly nameSanitizer = safeTypeName;
  override scope: NodeScope = 'type';

  protected value?: Value;

  constructor(name: NodeName, fn?: (t: TypeAliasTsDsl) => void) {
    super();
    this.name.set(name);
    if (isSymbol(name)) {
      name.setKind('type');
    }
    fn?.(this);
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    ctx.analyze(this.name);
    ctx.analyze(this.value);
  }

  /** Returns true when all required builder calls are present. */
  get isValid(): boolean {
    return !this.missingRequiredCalls().length;
  }

  /** Sets the type expression on the right-hand side of `= ...`. */
  type(node: Value): this {
    this.value = node;
    return this;
  }

  override toAst() {
    this.$validate();
    const node = ts.factory.createTypeAliasDeclaration(
      this.modifiers,
      this.$node(this.name) as ts.Identifier,
      this.$generics(),
      this.$type(this.value),
    );
    return this.$docs(node);
  }

  $validate(): asserts this is this & {
    value: Value;
  } {
    const missing = this.missingRequiredCalls();
    if (!missing.length) return;
    const name = this.name.toString();
    throw new Error(`Type alias${name ? ` "${name}"` : ''} missing ${missing.join(' and ')}`);
  }

  private missingRequiredCalls(): ReadonlyArray<string> {
    const missing: Array<string> = [];
    if (!this.value) missing.push('.\u200Btype()');
    return missing;
  }
}
