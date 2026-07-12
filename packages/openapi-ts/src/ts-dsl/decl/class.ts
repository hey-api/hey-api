import type { AnalysisContext, NodeName, Ref } from '@hey-api/codegen-core';
import { isSymbol, ref } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import type { MaybeTsDsl } from '../base';
import { TsDsl } from '../base';
import { NewlineTsDsl } from '../layout/newline';
import { DecoratorMixin } from '../mixins/decorator';
import { DocMixin } from '../mixins/doc';
import { AbstractMixin, DefaultMixin, ExportMixin } from '../mixins/modifiers';
import { TypeParamsMixin } from '../mixins/type-params';
import { safeRuntimeName } from '../utils/name';
import { FieldTsDsl } from './field';
import { InitTsDsl } from './init';
import { MethodTsDsl } from './method';

type Body = Array<MaybeTsDsl<ts.ClassElement | ts.Node>>;

const Mixed = AbstractMixin(
  DecoratorMixin(DefaultMixin(DocMixin(ExportMixin(TypeParamsMixin(TsDsl<ts.ClassDeclaration>))))),
);

export class ClassTsDsl extends Mixed {
  readonly '~dsl' = 'ClassTsDsl';
  override readonly nameSanitizer = safeRuntimeName;

  protected baseClass?: Ref<NodeName>;
  protected body: Body = [];

  constructor(name: NodeName) {
    super();
    this.name.set(name);
    if (isSymbol(name)) {
      name.setKind('class');
    }
  }

  override analyze(ctx: AnalysisContext): void {
    super.analyze(ctx);
    ctx.analyze(this.baseClass);
    ctx.analyze(this.name);
    ctx.pushScope();
    try {
      if (this.baseClass) {
        ctx.injectChildren(this.baseClass);
      }
      for (const item of this.body) {
        ctx.analyze(item);
      }
    } finally {
      ctx.popScope();
    }
  }

  /** Returns true if the class has any members. */
  get hasBody(): boolean {
    return Boolean(this.body.length);
  }

  /** Adds one or more class members (fields, methods, etc.). */
  do(...items: Body): this {
    this.body.push(...items);
    return this;
  }

  /** Records a base class to extend from. */
  extends(base?: NodeName): this {
    this.baseClass = base ? ref(base) : undefined;
    return this;
  }

  /** Adds a class field. */
  field(name: NodeName, fn?: (f: FieldTsDsl) => void): this {
    const f = new FieldTsDsl(name, fn);
    this.body.push(f);
    return this;
  }

  /** Adds a class constructor. */
  init(fn?: InitTsDsl | ((i: InitTsDsl) => void)): this {
    const i = typeof fn === 'function' ? new InitTsDsl(fn) : fn || new InitTsDsl();
    this.body.push(i);
    return this;
  }

  /** Adds a class method. */
  method(name: NodeName, fn?: (m: MethodTsDsl) => void): this {
    const m = new MethodTsDsl(name, fn);
    this.body.push(m);
    return this;
  }

  /** Inserts an empty line between members for formatting. */
  newline(): this {
    this.body.push(new NewlineTsDsl());
    return this;
  }

  override toAst() {
    const body = this.$node(this.body) as ReadonlyArray<ts.ClassElement>;
    const node = ts.factory.createClassDeclaration(
      [...this.$decorators(), ...this.modifiers],
      this.$node(this.name) as ts.Identifier,
      this.$generics(),
      this._heritage(),
      body,
    );
    return this.$docs(node);
  }

  /** Builds heritage clauses (extends). */
  private _heritage(): ReadonlyArray<ts.HeritageClause> {
    const node = this.$node(this.baseClass);
    if (!node) return [];
    return [
      ts.factory.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
        ts.factory.createExpressionWithTypeArguments(node, undefined),
      ]),
    ];
  }
}
