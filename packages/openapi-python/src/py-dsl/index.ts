import type { NodeName } from '@hey-api/codegen-core';

import type { py } from '../py-compiler';
import { ClassPyDsl } from './decl/class';
import { EnumPyDsl } from './decl/enum';
// import { DecoratorPyDsl } from './decl/decorator';
import { FieldPyDsl } from './decl/field';
import { FuncPyDsl } from './decl/func';
// import { GetterPyDsl } from './decl/getter';
// import { InitPyDsl } from './decl/init';
// import { EnumMemberPyDsl } from './decl/member';
import { MethodPyDsl } from './decl/method';
import { ParamPyDsl } from './decl/param';
// import { PatternPyDsl } from './decl/pattern';
// import { SetterPyDsl } from './decl/setter';
// import { ArrayPyDsl } from './expr/array';
// import { AsPyDsl } from './expr/as';
import { AttrPyDsl } from './expr/attr';
// import { AwaitPyDsl } from './expr/await';
import { BinaryPyDsl } from './expr/binary';
import { CallPyDsl } from './expr/call';
import { DictPyDsl } from './expr/dict';
import { ExprPyDsl } from './expr/expr';
// import { fromValue as exprValue } from './expr/from-value';
import { IdPyDsl } from './expr/identifier';
import { KwargPyDsl } from './expr/kwarg';
import { ListPyDsl } from './expr/list';
import { LiteralPyDsl } from './expr/literal';
// import { NewPyDsl } from './expr/new';
// import { ObjectPyDsl } from './expr/object';
// import { PrefixPyDsl } from './expr/prefix';
// import { ObjectPropPyDsl } from './expr/prop';
// import { RegExpPyDsl } from './expr/regexp';
import { SetPyDsl } from './expr/set';
import { SubscriptPyDsl } from './expr/subscript';
// import { TemplatePyDsl } from './expr/template';
// import { TernaryPyDsl } from './expr/ternary';
import { TuplePyDsl } from './expr/tuple';
// import { TypeOfExprPyDsl } from './expr/typeof';
import { DocPyDsl } from './layout/doc';
import { HintPyDsl } from './layout/hint';
import { NewlinePyDsl } from './layout/newline';
import { BlockPyDsl } from './stmt/block';
import { BreakPyDsl } from './stmt/break';
import { ContinuePyDsl } from './stmt/continue';
import { ForPyDsl } from './stmt/for';
import { IfPyDsl } from './stmt/if';
import { ImportPyDsl } from './stmt/import';
import { RaisePyDsl } from './stmt/raise';
import { ReturnPyDsl } from './stmt/return';
import { StmtPyDsl } from './stmt/stmt';
import { TryPyDsl } from './stmt/try';
import { VarPyDsl } from './stmt/var';
import { WhilePyDsl } from './stmt/while';
import { WithPyDsl } from './stmt/with';
import { TypeOrPyDsl } from './type/or';
import { TypeTuplePyDsl } from './type/tuple';
// import { TokenPyDsl } from './token';
// import { TypeAliasPyDsl } from './type/alias';
// import { TypeAndPyDsl } from './type/and';
// import { TypeAttrPyDsl } from './type/attr';
// import { TypeExprPyDsl } from './type/expr';
// import { fromValue as typeValue } from './type/from-value';
// import { TypeFuncPyDsl } from './type/func';
// import { TypeIdxPyDsl } from './type/idx';
// import { TypeLiteralPyDsl } from './type/literal';
// import { TypeMappedPyDsl } from './type/mapped';
// import { TypeObjectPyDsl } from './type/object';
// import { TypeOperatorPyDsl } from './type/operator';
// import { TypeOrPyDsl } from './type/or';
// import { TypeParamPyDsl } from './type/param';
// import { TypeQueryPyDsl } from './type/query';
// import { TypeTemplatePyDsl } from './type/template';
import { LazyPyDsl } from './utils/lazy';

const pyDsl = {
  /** Creates an array literal expression (e.g., `[1, 2, 3]`). */
  // array: (...args: ConstructorParameters<typeof ArrayTsDsl>) => new ArrayTsDsl(...args),
  /** Creates an `as` type assertion expression (e.g., `value as Type`). */
  // as: (...args: ConstructorParameters<typeof AsTsDsl>) => new AsTsDsl(...args),

  /** Creates a property access expression (e.g., `obj.foo`). */
  attr: (...args: ConstructorParameters<typeof AttrPyDsl>) => new AttrPyDsl(...args),

  /** Creates an await expression (e.g., `await promise`). */
  // await: (...args: ConstructorParameters<typeof AwaitTsDsl>) => new AwaitTsDsl(...args),

  /** Creates a binary expression (e.g., `a + b`). */
  binary: (...args: ConstructorParameters<typeof BinaryPyDsl>) => new BinaryPyDsl(...args),

  /** Creates a statement block. */
  block: (...args: ConstructorParameters<typeof BlockPyDsl>) => new BlockPyDsl(...args),

  /** Creates a break statement. */
  break: (...args: ConstructorParameters<typeof BreakPyDsl>) => new BreakPyDsl(...args),

  /** Creates a function or method call expression (e.g., `fn(arg)`). */
  call: (...args: ConstructorParameters<typeof CallPyDsl>) => new CallPyDsl(...args),

  /** Creates a class declaration or expression. */
  class: (...args: ConstructorParameters<typeof ClassPyDsl>) => new ClassPyDsl(...args),

  /** Creates a continue statement. */
  continue: (...args: ConstructorParameters<typeof ContinuePyDsl>) => new ContinuePyDsl(...args),

  /** Creates a decorator expression (e.g., `@decorator`). */
  // decorator: (...args: ConstructorParameters<typeof DecoratorTsDsl>) => new DecoratorTsDsl(...args),

  /** Creates a dictionary expression (e.g., `{ 'a': 1 }`). */
  dict: (...args: ConstructorParameters<typeof DictPyDsl>) => new DictPyDsl(...args),

  /** Creates a Python docstring (`"""..."""`). */
  doc: (...args: ConstructorParameters<typeof DocPyDsl>) => new DocPyDsl(...args),

  /** Creates an enum declaration. */
  enum: (...args: ConstructorParameters<typeof EnumPyDsl>) => new EnumPyDsl(...args),

  /** Creates a general expression node. */
  expr: (...args: ConstructorParameters<typeof ExprPyDsl>) => new ExprPyDsl(...args),

  /** Creates a field declaration in a class body. */
  field: (...args: ConstructorParameters<typeof FieldPyDsl>) => new FieldPyDsl(...args),

  /** Creates a for statement (e.g., `for x in items:`). */
  for: (...args: ConstructorParameters<typeof ForPyDsl>) => new ForPyDsl(...args),

  /** Converts a runtime value into a corresponding expression node. */
  // fromValue: (...args: Parameters<typeof exprValue>) => exprValue(...args),

  /** Creates a function declaration. */
  func: ((name: NodeName, fn?: (f: FuncPyDsl) => void) => new FuncPyDsl(name, fn)) as {
    (name: NodeName): FuncPyDsl;
    (name: NodeName, fn: (f: FuncPyDsl) => void): FuncPyDsl;
  },

  /** Creates a getter method declaration. */
  // getter: (...args: ConstructorParameters<typeof GetterTsDsl>) => new GetterTsDsl(...args),

  /** Creates a Python comment (`# ...`). */
  hint: (...args: ConstructorParameters<typeof HintPyDsl>) => new HintPyDsl(...args),

  /** Creates an identifier (e.g., `foo`). */
  id: (...args: ConstructorParameters<typeof IdPyDsl>) => new IdPyDsl(...args),

  /** Creates an if statement. */
  if: (...args: ConstructorParameters<typeof IfPyDsl>) => new IfPyDsl(...args),

  /** Creates an import statement. */
  import: (...args: ConstructorParameters<typeof ImportPyDsl>) => new ImportPyDsl(...args),

  /** Creates an initialization block or statement. */
  // init: (...args: ConstructorParameters<typeof InitTsDsl>) => new InitTsDsl(...args),

  /** Creates a keyword argument expression (e.g., `name=value`). */
  kwarg: (...args: ConstructorParameters<typeof KwargPyDsl>) => new KwargPyDsl(...args),

  /** Creates a lazy, context-aware node with deferred evaluation. */
  lazy: <T extends py.Node>(...args: ConstructorParameters<typeof LazyPyDsl<T>>) =>
    new LazyPyDsl<T>(...args),

  /** Creates a list expression (e.g., `[1, 2, 3]`). */
  list: (...args: ConstructorParameters<typeof ListPyDsl>) => new ListPyDsl(...args),

  /** Creates a literal value (e.g., string, number, boolean). */
  literal: (...args: ConstructorParameters<typeof LiteralPyDsl>) => new LiteralPyDsl(...args),

  /** Creates an enum member declaration. */
  // member: (...args: ConstructorParameters<typeof EnumMemberTsDsl>) => new EnumMemberTsDsl(...args),

  /** Creates a method declaration in a class body. */
  method: ((name: NodeName, fn?: (f: MethodPyDsl) => void) => new MethodPyDsl(name, fn)) as {
    (name: NodeName): MethodPyDsl;
    (name: NodeName, fn: (f: MethodPyDsl) => void): MethodPyDsl;
  },

  /** Creates a negation expression (`-x`). */
  // neg: (...args: ConstructorParameters<typeof PrefixTsDsl>) => new PrefixTsDsl(...args).neg(),

  /** Creates a new expression (e.g., `new ClassName()`). */
  // new: (...args: ConstructorParameters<typeof NewTsDsl>) => new NewTsDsl(...args),

  /** Creates a newline (for formatting purposes). */
  newline: (...args: ConstructorParameters<typeof NewlinePyDsl>) => new NewlinePyDsl(...args),

  /** Creates a logical NOT expression (`!x`). */
  // not: (...args: ConstructorParameters<typeof PrefixTsDsl>) => new PrefixTsDsl(...args).not(),

  /** Creates an object literal expression. */
  // object: (...args: ConstructorParameters<typeof ObjectTsDsl>) => new ObjectTsDsl(...args),

  /** Creates a parameter declaration for functions or methods. */
  param: (...args: ConstructorParameters<typeof ParamPyDsl>) => new ParamPyDsl(...args),

  /** Creates a pattern for destructuring or matching. */
  // pattern: (...args: ConstructorParameters<typeof PatternTsDsl>) => new PatternTsDsl(...args),

  /** Creates a prefix unary expression (e.g., `-x`, `!x`, `~x`). */
  // prefix: (...args: ConstructorParameters<typeof PrefixTsDsl>) => new PrefixTsDsl(...args),

  /** Creates an object literal property (e.g., `{ foo: bar }`). */
  // prop: (...args: ConstructorParameters<typeof ObjectPropTsDsl>) => new ObjectPropTsDsl(...args),

  /** Creates a raise statement. */
  raise: (...args: ConstructorParameters<typeof RaisePyDsl>) => new RaisePyDsl(...args),

  /** Creates a regular expression literal (e.g., `/foo/gi`). */
  // regexp: (...args: ConstructorParameters<typeof RegExpTsDsl>) => new RegExpTsDsl(...args),

  /** Creates a return statement. */
  return: (...args: ConstructorParameters<typeof ReturnPyDsl>) => new ReturnPyDsl(...args),

  /** Creates a set expression (e.g., `{1, 2, 3}`). */
  set: (...args: ConstructorParameters<typeof SetPyDsl>) => new SetPyDsl(...args),

  /** Creates a setter method declaration. */
  // setter: (...args: ConstructorParameters<typeof SetterTsDsl>) => new SetterTsDsl(...args),

  /** Wraps an expression or statement-like value into a `StmtPyDsl`. */
  stmt: (...args: ConstructorParameters<typeof StmtPyDsl>) => new StmtPyDsl(...args),

  /** Creates a subscript expression (e.g., `obj[index]` or `Type[Param]`). */
  subscript: (...args: ConstructorParameters<typeof SubscriptPyDsl>) => new SubscriptPyDsl(...args),

  /** Creates a template literal expression. */
  // template: (...args: ConstructorParameters<typeof TemplateTsDsl>) => new TemplateTsDsl(...args),

  /** Creates a ternary conditional expression (if ? then : else). */
  // ternary: (...args: ConstructorParameters<typeof TernaryTsDsl>) => new TernaryTsDsl(...args),

  // /** Creates a throw statement. */
  // throw: (...args: ConstructorParameters<typeof ThrowTsDsl>) => new ThrowTsDsl(...args),

  /** Creates a syntax token (e.g., `?`, `readonly`, `+`, `-`). */
  // token: (...args: ConstructorParameters<typeof TokenTsDsl>) => new TokenTsDsl(...args),

  /** Creates a try/except/finally statement. */
  try: (...args: ConstructorParameters<typeof TryPyDsl>) => new TryPyDsl(...args),

  /** Creates a tuple expression (e.g., `(1, 2, 3)`). */
  tuple: (...args: ConstructorParameters<typeof TuplePyDsl>) => new TuplePyDsl(...args),

  /** Creates a basic type reference or type expression (e.g., Foo or Foo<T>). */
  type: {
    // type: Object.assign(
    //   (...args: ConstructorParameters<typeof TypeExprTsDsl>) => new TypeExprTsDsl(...args),
    //   {
    /** Creates a type alias declaration (e.g., `type Foo = Bar`). */
    // alias: (...args: ConstructorParameters<typeof TypeAliasTsDsl>) => new TypeAliasTsDsl(...args),
    /** Creates an intersection type (e.g., `A & B`). */
    // and: (...args: ConstructorParameters<typeof TypeAndTsDsl>) => new TypeAndTsDsl(...args),
    /** Creates a qualified type reference (e.g., Foo.Bar). */
    // attr: (...args: ConstructorParameters<typeof TypeAttrTsDsl>) => new TypeAttrTsDsl(...args),
    /** Creates a basic type reference or type expression (e.g., Foo or Foo<T>). */
    // expr: (...args: ConstructorParameters<typeof TypeExprTsDsl>) => new TypeExprTsDsl(...args),
    /** Converts a runtime value into a corresponding type expression node. */
    // fromValue: (...args: Parameters<typeof typeValue>) => typeValue(...args),
    /** Creates a function type node (e.g., `(a: string) => number`). */
    // func: (...args: ConstructorParameters<typeof TypeFuncTsDsl>) => new TypeFuncTsDsl(...args),
    /** Creates an indexed-access type (e.g., `Foo<T>[K]`). */
    // idx: (...args: ConstructorParameters<typeof TypeIdxTsDsl>) => new TypeIdxTsDsl(...args),
    /** Creates a literal type node (e.g., 'foo', 42, or true). */
    // literal: (...args: ConstructorParameters<typeof TypeLiteralTsDsl>) =>
    //   new TypeLiteralTsDsl(...args),
    /** Creates a mapped type (e.g., `{ [K in keyof T]: U }`). */
    // mapped: (...args: ConstructorParameters<typeof TypeMappedTsDsl>) =>
    //   new TypeMappedTsDsl(...args),
    /** Creates a type literal node (e.g., { foo: string }). */
    // object: (...args: ConstructorParameters<typeof TypeObjectTsDsl>) =>
    //   new TypeObjectTsDsl(...args),
    /** Creates a type operator node (e.g., `readonly T`, `keyof T`, `unique T`). */
    // operator: (...args: ConstructorParameters<typeof TypeOperatorTsDsl>) =>
    //   new TypeOperatorTsDsl(...args),

    /** Creates a union type (e.g., `A | B | C`). */
    or: (...args: ConstructorParameters<typeof TypeOrPyDsl>) => new TypeOrPyDsl(...args),

    /** Creates a type parameter (e.g., `<T>`). */
    // param: (...args: ConstructorParameters<typeof TypeParamTsDsl>) => new TypeParamTsDsl(...args),
    /** Creates a type query node (e.g., `typeof Foo`). */
    // query: (...args: ConstructorParameters<typeof TypeQueryTsDsl>) => new TypeQueryTsDsl(...args),
    /** Builds a TypeScript template literal *type* (e.g., `${Foo}-${Bar}` as a type). */
    // template: (...args: ConstructorParameters<typeof TypeTemplateTsDsl>) =>
    //   new TypeTemplateTsDsl(...args),

    /** Creates a tuple type (e.g., [A, B, C]). */
    tuple: (...args: ConstructorParameters<typeof TypeTuplePyDsl>) => new TypeTuplePyDsl(...args),
  },
  // ),
  /** Creates a `typeof` expression (e.g., `typeof value`). */
  // typeofExpr: (...args: ConstructorParameters<typeof TypeOfExprTsDsl>) =>
  //   new TypeOfExprTsDsl(...args),

  /** Creates a variable assignment. */
  var: (...args: ConstructorParameters<typeof VarPyDsl>) => new VarPyDsl(...args),

  /** Creates a while statement (e.g., `while x:`). */
  while: (...args: ConstructorParameters<typeof WhilePyDsl>) => new WhilePyDsl(...args),

  /** Creates a with statement (e.g., `with open(f) as file:`). */
  with: (...args: ConstructorParameters<typeof WithPyDsl>) => new WithPyDsl(...args),
};

export const $ = Object.assign(
  (...args: ConstructorParameters<typeof ExprPyDsl>) => new ExprPyDsl(...args),
  pyDsl,
);

export type DollarPyDsl = {
  /**
   * Entry point to the Python DSL.
   *
   * `$` creates a general expression node by default, but also exposes
   * builders for all other constructs.
   *
   * Example:
   * ```ts
   * const node = $('console').attr('log').call($.literal('Hello'));
   * ```
   *
   * Returns:
   * - A new `ExprPyDsl` instance when called directly.
   * - The `pyDsl` object for constructing more specific nodes.
   */
  $: typeof $;
};

export type { MaybePyDsl } from './base';
export { PyDsl } from './base';
export type { EnumMember } from './decl/enum';
export type { CallArgs } from './expr/call';
export { KwargPyDsl } from './expr/kwarg';
export type { ExampleOptions } from './utils/context';
export { ctx, PyDslContext } from './utils/context';
export { keywords } from './utils/keywords';
export { regexp } from './utils/regexp';
export type { UserPrinter } from './utils/render';
export { PythonRenderer } from './utils/render';
export { reserved } from './utils/reserved';
