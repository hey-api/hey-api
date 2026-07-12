import type { AnalysisContext, NodeName } from '@hey-api/codegen-core';
import { isSymbol } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import { TsDsl } from '../base';
import { AsMixin } from '../mixins/as';
import { DecoratorMixin } from '../mixins/decorator';
import { DoMixin } from '../mixins/do';
import { DocMixin } from '../mixins/doc';
import {
  AbstractMixin,
  AsyncMixin,
  ExportMixin,
  PrivateMixin,
  ProtectedMixin,
  PublicMixin,
  StaticMixin,
} from '../mixins/modifiers';
import { ParamMixin } from '../mixins/param';
import { TypeParamsMixin } from '../mixins/type-params';
import { TypeReturnsMixin } from '../mixins/type-returns';
import { BlockTsDsl } from '../stmt/block';
import { safeRuntimeName } from '../utils/name';

export type FuncMode = 'arrow' | 'decl' | 'expr';

const Mixed = AbstractMixin(
  AsMixin(
    AsyncMixin(
      DecoratorMixin(
        DoMixin(
          DocMixin(
            ExportMixin(
              ParamMixin(
                PrivateMixin(
                  ProtectedMixin(
                    PublicMixin(
                      StaticMixin(TypeParamsMixin(TypeReturnsMixin(TsDsl<ts.ArrowFunction>))),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  ),
);

class ImplFuncTsDsl<M extends FuncMode = 'arrow'> extends Mixed {
  readonly '~dsl' = 'FuncTsDsl';
  readonly '~mode'!: M; // type-only brand, never assigned at runtime
  override readonly nameSanitizer = safeRuntimeName;

  protected mode?: FuncMode;

  constructor();
  constructor(fn: (f: ImplFuncTsDsl<'arrow'>) => void);
  constructor(name: NodeName);
  constructor(name: NodeName, fn: (f: ImplFuncTsDsl<'decl'>) => void);
  constructor(
    name?: NodeName | ((f: ImplFuncTsDsl<'arrow'>) => void),
    fn?: (f: ImplFuncTsDsl<'decl'>) => void,
  ) {
    super();
    if (typeof name === 'function') {
      this.mode = 'arrow';
      name(this as unknown as FuncTsDsl<'arrow'>);
    } else if (name) {
      this.mode = 'decl';
      this.name.set(name);
      if (isSymbol(name)) {
        name.setKind('function');
      }
      fn?.(this as unknown as FuncTsDsl<'decl'>);
    }
  }

  override analyze(ctx: AnalysisContext): void {
    ctx.pushScope();
    try {
      super.analyze(ctx);
      ctx.analyze(this.name);
    } finally {
      ctx.popScope();
    }
  }

  /** Returns true when all required builder calls are present. */
  get isValid(): boolean {
    return !this.missingRequiredCalls().length;
  }

  /** Switches the function to an arrow function form. */
  arrow(): FuncTsDsl<'arrow'> {
    this.mode = 'arrow';
    return this as unknown as FuncTsDsl<'arrow'>;
  }

  /** Switches the function to a function declaration form. */
  decl(): FuncTsDsl<'decl'> {
    this.mode = 'decl';
    return this as unknown as FuncTsDsl<'decl'>;
  }

  /** Switches the function to a function expression form. */
  expr(): FuncTsDsl<'expr'> {
    this.mode = 'expr';
    return this as unknown as FuncTsDsl<'expr'>;
  }

  // @ts-expect-error --- need to fix types ---
  override toAst(): M extends 'decl'
    ? ts.FunctionDeclaration
    : M extends 'expr'
      ? ts.FunctionExpression
      : ts.ArrowFunction {
    this.$validate();
    const body = this.$node(new BlockTsDsl(...this._do).pretty());

    if (this.mode === 'decl') {
      const node = ts.factory.createFunctionDeclaration(
        [...this.$decorators(), ...this.modifiers],
        undefined,
        this.$node(this.name) as ts.Identifier,
        this.$generics(),
        this.$params(),
        this.$returns(),
        body,
      ) as any;
      return this.$docs(node);
    }

    if (this.mode === 'expr') {
      const node = ts.factory.createFunctionExpression(
        this.modifiers,
        undefined,
        this.$node(this.name) as ts.Identifier,
        this.$generics(),
        this.$params(),
        this.$returns(),
        body,
      ) as any;
      return this.$docs(node);
    }

    const node = ts.factory.createArrowFunction(
      this.modifiers,
      this.$generics(),
      this.$params(),
      this.$returns(),
      undefined,
      body.statements.length === 1 &&
        ts.isReturnStatement(body.statements[0]!) &&
        body.statements[0].expression
        ? body.statements[0].expression
        : body,
    ) as any;
    return this.$docs(node);
  }

  $validate(): asserts this {
    const missing = this.missingRequiredCalls();
    if (!missing.length) return;
    throw new Error(`Function ${this.mode} missing ${missing.join(' and ')}`);
  }

  private missingRequiredCalls(): ReadonlyArray<string> {
    const missing: Array<string> = [];
    if (this.mode === 'decl' && !this.name.toString()) missing.push('name');
    return missing;
  }
}

export const FuncTsDsl = ImplFuncTsDsl as {
  new (): FuncTsDsl<'arrow'>;
  new (fn: (f: FuncTsDsl<'arrow'>) => void): FuncTsDsl<'arrow'>;
  new (name: NodeName): FuncTsDsl<'decl'>;
  new (name: NodeName, fn: (f: FuncTsDsl<'decl'>) => void): FuncTsDsl<'decl'>;
} & typeof ImplFuncTsDsl;
export type FuncTsDsl<M extends FuncMode = 'arrow'> = ImplFuncTsDsl<M>;
