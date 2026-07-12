import type { AnalysisContext, NodeName, NodeScope, Ref } from '@hey-api/codegen-core';
import { ref } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import type { TypeTsDsl as TypeTsDslType } from '../base';
import { TsDsl } from '../base';
import { OptionalMixin } from '../mixins/optional';
import { f } from '../utils/factories';

export type TypeTupleMemberCtor = (name: NodeName) => TypeTupleMemberTsDsl;

const Mixed = OptionalMixin(TsDsl<ts.NamedTupleMember>);

export class TypeTupleMemberTsDsl extends Mixed {
  readonly '~dsl' = 'TypeTupleMemberTsDsl';
  override scope: NodeScope = 'type';

  protected _type?: Ref<NodeName | TypeTsDslType>;

  constructor(name: NodeName) {
    super();
    this.name.set(name);
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

  type(node: NodeName | TypeTsDslType): this {
    this._type = ref(node);
    return this;
  }

  override toAst() {
    this.$validate();
    return ts.factory.createNamedTupleMember(
      undefined,
      this.$node(this.name) as ts.Identifier,
      this._optional ? ts.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
      this.$type(this._type!),
    );
  }

  $validate(): asserts this {
    const missing = this.missingRequiredCalls();
    if (!missing.length) return;
    throw new Error(`Tuple member missing ${missing.join(' and ')}`);
  }

  private missingRequiredCalls(): Array<string> {
    const missing: Array<string> = [];
    if (!this._type) missing.push('.\u200Btype()');
    return missing;
  }
}

f.type.tupleMember.set((name) => new TypeTupleMemberTsDsl(name));
