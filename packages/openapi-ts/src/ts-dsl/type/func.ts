import type { AnalysisContext, NodeScope } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import { TsDsl } from '../base';
import { DocMixin } from '../mixins/doc';
import { ParamMixin } from '../mixins/param';
import { TypeParamsMixin } from '../mixins/type-params';
import { TypeReturnsMixin } from '../mixins/type-returns';

const Mixed = DocMixin(ParamMixin(TypeParamsMixin(TypeReturnsMixin(TsDsl<ts.FunctionTypeNode>))));

export class TypeFuncTsDsl extends Mixed {
  readonly '~dsl' = 'TypeFuncTsDsl';
  override scope: NodeScope = 'type';

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
  }

  /** Returns true when all required builder calls are present. */
  get isValid(): boolean {
    return !this.missingRequiredCalls().length;
  }

  override toAst() {
    this.$validate();
    const node = ts.factory.createFunctionTypeNode(
      this.$generics(),
      this.$params(),
      this.$returns()!,
    );
    return this.$docs(node);
  }

  $validate(): asserts this {
    const missing = this.missingRequiredCalls();
    if (!missing.length) return;
    throw new Error(`Function type missing ${missing.join(' and ')}`);
  }

  private missingRequiredCalls(): ReadonlyArray<string> {
    const missing: Array<string> = [];
    if (this.$returns() === undefined) missing.push('.returns()');
    return missing;
  }
}
