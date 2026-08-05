import type { NodeName } from '@hey-api/codegen-core';

import type { ts } from '../ts-compiler';
import { ClassTsDsl } from './decl/class';
import { DecoratorTsDsl } from './decl/decorator';
import { EnumTsDsl } from './decl/enum';
import { FieldTsDsl } from './decl/field';
import { FuncTsDsl } from './decl/func';
import { GetterTsDsl } from './decl/getter';
import { InitTsDsl } from './decl/init';
import { EnumMemberTsDsl } from './decl/member';
import { MethodTsDsl } from './decl/method';
import { ParamTsDsl } from './decl/param';
import { PatternTsDsl } from './decl/pattern';
import { SetterTsDsl } from './decl/setter';
import { ArrayTsDsl } from './expr/array';
import { AsTsDsl } from './expr/as';
import { AttrTsDsl } from './expr/attr';
import { AwaitTsDsl } from './expr/await';
import { BinaryTsDsl } from './expr/binary';
import { CallTsDsl } from './expr/call';
import { ExprTsDsl } from './expr/expr';
import { fromValue as exprValue } from './expr/from-value';
import { IdTsDsl } from './expr/id';
import { LiteralTsDsl } from './expr/literal';
import { NewTsDsl } from './expr/new';
import { ObjectTsDsl } from './expr/object';
import { PostfixTsDsl } from './expr/postfix';
import { PrefixTsDsl } from './expr/prefix';
import { ObjectPropTsDsl } from './expr/prop';
import { RegExpTsDsl } from './expr/regexp';
import { SpreadTsDsl } from './expr/spread';
import { TemplateTsDsl } from './expr/template';
import { TernaryTsDsl } from './expr/ternary';
import { TypeOfExprTsDsl } from './expr/typeof';
import { DocTsDsl } from './layout/doc';
import { HintTsDsl } from './layout/hint';
import { NewlineTsDsl } from './layout/newline';
import { NoteTsDsl } from './layout/note';
import { BlockTsDsl } from './stmt/block';
import type { ForCondition, ForIterable, ForMode } from './stmt/for';
import { ForTsDsl } from './stmt/for';
import { IfTsDsl } from './stmt/if';
import { ReturnTsDsl } from './stmt/return';
import { StmtTsDsl } from './stmt/stmt';
import { ThrowTsDsl } from './stmt/throw';
import { TryTsDsl } from './stmt/try';
import { VarTsDsl } from './stmt/var';
import { TokenTsDsl } from './token';
import { TypeAliasTsDsl } from './type/alias';
import { TypeAndTsDsl } from './type/and';
import { TypeAttrTsDsl } from './type/attr';
import { TypeExprTsDsl } from './type/expr';
import { fromValue as typeValue } from './type/from-value';
import { TypeFuncTsDsl } from './type/func';
import { TypeIdxTsDsl } from './type/idx';
import { TypeLiteralTsDsl } from './type/literal';
import { TypeMappedTsDsl } from './type/mapped';
import { TypeObjectTsDsl } from './type/object';
import { TypeOperatorTsDsl } from './type/operator';
import { TypeOrTsDsl } from './type/or';
import { TypeParamTsDsl } from './type/param';
import { TypeQueryTsDsl } from './type/query';
import { TypeTemplateTsDsl } from './type/template';
import { TypeTernaryTsDsl } from './type/ternary';
import { TypeTupleTsDsl } from './type/tuple';
import { TypeTupleMemberTsDsl } from './type/tuple-member';
import { LazyTsDsl } from './utils/lazy';

const tsDsl = {
  /** Creates an array literal expression (e.g., `[1, 2, 3]`). */
  array: (...args: ConstructorParameters<typeof ArrayTsDsl>) => new ArrayTsDsl(...args),

  /** Creates an `as` type assertion expression (e.g., `value as Type`). */
  as: (...args: ConstructorParameters<typeof AsTsDsl>) => new AsTsDsl(...args),

  /** Creates a property access expression (e.g., `obj.foo`). */
  attr: (...args: ConstructorParameters<typeof AttrTsDsl>) => new AttrTsDsl(...args),

  /** Creates an await expression (e.g., `await promise`). */
  await: (...args: ConstructorParameters<typeof AwaitTsDsl>) => new AwaitTsDsl(...args),

  /** Creates a binary expression (e.g., `a + b`). */
  binary: (...args: ConstructorParameters<typeof BinaryTsDsl>) => new BinaryTsDsl(...args),

  /** Creates a statement block (`{ ... }`). */
  block: (...args: ConstructorParameters<typeof BlockTsDsl>) => new BlockTsDsl(...args),

  /** Creates a function or method call expression (e.g., `fn(arg)`). */
  call: (...args: ConstructorParameters<typeof CallTsDsl>) => new CallTsDsl(...args),

  /** Creates a class declaration or expression. */
  class: (...args: ConstructorParameters<typeof ClassTsDsl>) => new ClassTsDsl(...args),

  /** Creates a constant variable declaration (`const`). */
  const: (...args: ConstructorParameters<typeof VarTsDsl>) => new VarTsDsl(...args).const(),

  /** Creates a postfix decrement expression (`i--`). */
  dec: (...args: ConstructorParameters<typeof PostfixTsDsl>) => new PostfixTsDsl(...args).dec(),

  /** Creates a decorator expression (e.g., `@decorator`). */
  decorator: (...args: ConstructorParameters<typeof DecoratorTsDsl>) => new DecoratorTsDsl(...args),

  /** Creates a JSDoc documentation block. */
  doc: (...args: ConstructorParameters<typeof DocTsDsl>) => new DocTsDsl(...args),

  /** Creates an enum declaration. */
  enum: (...args: ConstructorParameters<typeof EnumTsDsl>) => new EnumTsDsl(...args),

  /** Creates a general expression node. */
  expr: (...args: ConstructorParameters<typeof ExprTsDsl>) => new ExprTsDsl(...args),

  /** Creates a field declaration in a class or object. */
  field: (...args: ConstructorParameters<typeof FieldTsDsl>) => new FieldTsDsl(...args),

  /** Creates a for loop (for, for...of, for...in, or for await...of). */
  for: ((...args: ReadonlyArray<any>) => new ForTsDsl(...args)) as {
    (variableOrInit?: VarTsDsl): ForTsDsl<ForMode>;
    (
      variableOrInit: VarTsDsl,
      condition: ForCondition,
      iterableOrUpdate?: ForIterable,
    ): ForTsDsl<'for'>;
    <T extends ForMode>(
      variableOrInit: VarTsDsl,
      mode: T,
      iterableOrUpdate?: ForIterable,
    ): ForTsDsl<T>;
  },

  /** Converts a runtime value into a corresponding expression node. */
  fromValue: (...args: Parameters<typeof exprValue>) => exprValue(...args),

  /** Creates a function expression or declaration. */
  func: ((nameOrFn?: any, fn?: any) => {
    if (nameOrFn === undefined) return new FuncTsDsl();
    if (typeof nameOrFn !== 'string' || fn === undefined) return new FuncTsDsl(nameOrFn);
    return new FuncTsDsl(nameOrFn, fn);
  }) as {
    (): FuncTsDsl<'arrow'>;
    (fn: (f: FuncTsDsl<'arrow'>) => void): FuncTsDsl<'arrow'>;
    (name: NodeName): FuncTsDsl<'decl'>;
    (name: NodeName, fn: (f: FuncTsDsl<'decl'>) => void): FuncTsDsl<'decl'>;
    (name?: NodeName, fn?: (f: FuncTsDsl<'decl'>) => void): FuncTsDsl<'arrow'> | FuncTsDsl<'decl'>;
  },

  /** Creates a getter method declaration. */
  getter: (...args: ConstructorParameters<typeof GetterTsDsl>) => new GetterTsDsl(...args),

  /** Creates a single-line comment (//). */
  hint: (...args: ConstructorParameters<typeof HintTsDsl>) => new HintTsDsl(...args),

  /** Creates an identifier (e.g., `foo`). */
  id: (...args: ConstructorParameters<typeof IdTsDsl>) => new IdTsDsl(...args),

  /** Creates an if statement. */
  if: (...args: ConstructorParameters<typeof IfTsDsl>) => new IfTsDsl(...args),

  /** Creates a postfix increment expression (`i++`). */
  inc: (...args: ConstructorParameters<typeof PostfixTsDsl>) => new PostfixTsDsl(...args).inc(),

  /** Creates an initialization block or statement. */
  init: (...args: ConstructorParameters<typeof InitTsDsl>) => new InitTsDsl(...args),

  /** Creates a lazy, context-aware node with deferred evaluation. */
  lazy: <T extends ts.Node>(...args: ConstructorParameters<typeof LazyTsDsl<T>>) =>
    new LazyTsDsl<T>(...args),

  /** Creates a let variable declaration (`let`). */
  let: (...args: ConstructorParameters<typeof VarTsDsl>) => new VarTsDsl(...args).let(),

  /** Creates a literal value (e.g., string, number, boolean). */
  literal: (...args: ConstructorParameters<typeof LiteralTsDsl>) => new LiteralTsDsl(...args),

  /** Creates an enum member declaration. */
  member: (...args: ConstructorParameters<typeof EnumMemberTsDsl>) => new EnumMemberTsDsl(...args),

  /** Creates a method declaration inside a class or object. */
  method: (...args: ConstructorParameters<typeof MethodTsDsl>) => new MethodTsDsl(...args),

  /** Creates a negation expression (`-x`). */
  neg: (...args: ConstructorParameters<typeof PrefixTsDsl>) => new PrefixTsDsl(...args).neg(),

  /** Creates a new expression (e.g., `new ClassName()`). */
  new: (...args: ConstructorParameters<typeof NewTsDsl>) => new NewTsDsl(...args),

  /** Creates a newline (for formatting purposes). */
  newline: (...args: ConstructorParameters<typeof NewlineTsDsl>) => new NewlineTsDsl(...args),

  /** Creates a logical NOT expression (`!x`). */
  not: (...args: ConstructorParameters<typeof PrefixTsDsl>) => new PrefixTsDsl(...args).not(),

  /** Creates a block comment (/* ... *\/). */
  note: (...args: ConstructorParameters<typeof NoteTsDsl>) => new NoteTsDsl(...args),

  /** Creates an object literal expression. */
  object: (...args: ConstructorParameters<typeof ObjectTsDsl>) => new ObjectTsDsl(...args),

  /** Creates a parameter declaration for functions or methods. */
  param: (...args: ConstructorParameters<typeof ParamTsDsl>) => new ParamTsDsl(...args),

  /** Creates a pattern for destructuring or matching. */
  pattern: (...args: ConstructorParameters<typeof PatternTsDsl>) => new PatternTsDsl(...args),

  /** Creates a prefix unary expression (e.g., `-x`, `!x`, `~x`). */
  prefix: (...args: ConstructorParameters<typeof PrefixTsDsl>) => new PrefixTsDsl(...args),

  /** Creates an object literal property (e.g., `{ foo: bar }`). */
  prop: (...args: ConstructorParameters<typeof ObjectPropTsDsl>) => new ObjectPropTsDsl(...args),

  /** Creates a regular expression literal (e.g., `/foo/gi`). */
  regexp: (...args: ConstructorParameters<typeof RegExpTsDsl>) => new RegExpTsDsl(...args),

  /** Creates a return statement. */
  return: (...args: ConstructorParameters<typeof ReturnTsDsl>) => new ReturnTsDsl(...args),

  /** Creates a setter method declaration. */
  setter: (...args: ConstructorParameters<typeof SetterTsDsl>) => new SetterTsDsl(...args),

  /** Creates a spread element from an expression (e.g., `...expr`). */
  spread: (...args: ConstructorParameters<typeof SpreadTsDsl>) => new SpreadTsDsl(...args),

  /** Wraps an expression or statement-like value into a `StmtTsDsl`. */
  stmt: (...args: ConstructorParameters<typeof StmtTsDsl>) => new StmtTsDsl(...args),

  /** Creates a template literal expression. */
  template: (...args: ConstructorParameters<typeof TemplateTsDsl>) => new TemplateTsDsl(...args),

  /** Creates a ternary conditional expression (if ? then : else). */
  ternary: (...args: ConstructorParameters<typeof TernaryTsDsl>) => new TernaryTsDsl(...args),

  /** Creates a throw statement. */
  throw: (...args: ConstructorParameters<typeof ThrowTsDsl>) => new ThrowTsDsl(...args),

  /** Creates a syntax token (e.g., `?`, `readonly`, `+`, `-`). */
  token: (...args: ConstructorParameters<typeof TokenTsDsl>) => new TokenTsDsl(...args),

  /** Creates a try/catch/finally statement. */
  try: (...args: ConstructorParameters<typeof TryTsDsl>) => new TryTsDsl(...args),

  /** Creates a basic type reference or type expression (e.g., Foo or Foo<T>). */
  type: Object.assign(
    (...args: ConstructorParameters<typeof TypeExprTsDsl>) => new TypeExprTsDsl(...args),
    {
      /** Creates a type alias declaration (e.g., `type Foo = Bar`). */
      alias: (...args: ConstructorParameters<typeof TypeAliasTsDsl>) => new TypeAliasTsDsl(...args),

      /** Creates an intersection type (e.g., `A & B`). */
      and: (...args: ConstructorParameters<typeof TypeAndTsDsl>) => new TypeAndTsDsl(...args),

      /** Creates a qualified type reference (e.g., Foo.Bar). */
      attr: (...args: ConstructorParameters<typeof TypeAttrTsDsl>) => new TypeAttrTsDsl(...args),

      /** Creates a basic type reference or type expression (e.g., Foo or Foo<T>). */
      expr: (...args: ConstructorParameters<typeof TypeExprTsDsl>) => new TypeExprTsDsl(...args),

      /** Converts a runtime value into a corresponding type expression node. */
      fromValue: (...args: Parameters<typeof typeValue>) => typeValue(...args),

      /** Creates a function type node (e.g., `(a: string) => number`). */
      func: (...args: ConstructorParameters<typeof TypeFuncTsDsl>) => new TypeFuncTsDsl(...args),

      /** Creates an indexed-access type (e.g., `Foo<T>[K]`). */
      idx: (...args: ConstructorParameters<typeof TypeIdxTsDsl>) => new TypeIdxTsDsl(...args),

      /** Creates a literal type node (e.g., 'foo', 42, or true). */
      literal: (...args: ConstructorParameters<typeof TypeLiteralTsDsl>) =>
        new TypeLiteralTsDsl(...args),

      /** Creates a mapped type (e.g., `{ [K in keyof T]: U }`). */
      mapped: (...args: ConstructorParameters<typeof TypeMappedTsDsl>) =>
        new TypeMappedTsDsl(...args),

      /** Creates a type literal node (e.g., { foo: string }). */
      object: (...args: ConstructorParameters<typeof TypeObjectTsDsl>) =>
        new TypeObjectTsDsl(...args),

      /** Creates a type operator node (e.g., `readonly T`, `keyof T`, `unique T`). */
      operator: (...args: ConstructorParameters<typeof TypeOperatorTsDsl>) =>
        new TypeOperatorTsDsl(...args),

      /** Represents a union type (e.g., `A | B | C`). */
      or: (...args: ConstructorParameters<typeof TypeOrTsDsl>) => new TypeOrTsDsl(...args),

      /** Creates a type parameter (e.g., `<T>`). */
      param: (...args: ConstructorParameters<typeof TypeParamTsDsl>) => new TypeParamTsDsl(...args),

      /** Creates a type query node (e.g., `typeof Foo`). */
      query: (...args: ConstructorParameters<typeof TypeQueryTsDsl>) => new TypeQueryTsDsl(...args),

      /** Builds a TypeScript template literal *type* (e.g., `${Foo}-${Bar}` as a type). */
      template: (...args: ConstructorParameters<typeof TypeTemplateTsDsl>) =>
        new TypeTemplateTsDsl(...args),

      /** Creates a ternary conditional type (e.g., `T extends U ? X : Y`). */
      ternary: (...args: ConstructorParameters<typeof TypeTernaryTsDsl>) =>
        new TypeTernaryTsDsl(...args),

      /** Creates a tuple type (e.g., [A, B, C]). */
      tuple: (...args: ConstructorParameters<typeof TypeTupleTsDsl>) => new TypeTupleTsDsl(...args),

      /** Creates a named tuple element (e.g., `[resolver?: R]`). */
      tupleMember: (...args: ConstructorParameters<typeof TypeTupleMemberTsDsl>) =>
        new TypeTupleMemberTsDsl(...args),
    },
  ),

  /** Creates a `typeof` expression (e.g., `typeof value`). */
  typeofExpr: (...args: ConstructorParameters<typeof TypeOfExprTsDsl>) =>
    new TypeOfExprTsDsl(...args),

  /** Creates a variable declaration (`var`). */
  var: (...args: ConstructorParameters<typeof VarTsDsl>) => new VarTsDsl(...args),
};

export const $ = Object.assign(
  (...args: ConstructorParameters<typeof ExprTsDsl>) => new ExprTsDsl(...args),
  tsDsl,
);

export type DollarTsDsl = {
  /**
   * Entry point to the TypeScript DSL.
   *
   * `$` creates a general expression node by default, but also exposes
   * builders for all other constructs such as `.type()`, `.call()`,
   * `.object()`, `.func()`, etc.
   *
   * Example:
   * ```ts
   * const node = $('console').attr('log').call($.literal('Hello'));
   * ```
   *
   * Returns:
   * - A new `ExprTsDsl` instance when called directly.
   * - The `tsDsl` object for constructing more specific nodes.
   */
  $: typeof $;
};

export type { MaybeTsDsl, TypeTsDsl } from './base';
export { TsDsl } from './base';
export type { CallArgs } from './expr/call';
export type { ExampleOptions } from './utils/context';
export { ctx, TsDslContext } from './utils/context';
export { keywords } from './utils/keywords';
export { regexp } from './utils/regexp';
export type { UserPrinter } from './utils/render';
export { TypeScriptRenderer } from './utils/render';
export { reserved } from './utils/reserved';
