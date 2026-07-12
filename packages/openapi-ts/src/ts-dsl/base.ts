// TODO: symbol should be protected, but needs to be public to satisfy types
import type {
  AnalysisContext,
  File,
  FromRef,
  Language,
  Node,
  NodeName,
  NodeNameSanitizer,
  NodeRelationship,
  NodeScope,
  ProjectMeta,
  Ref,
  Symbol,
} from '@hey-api/codegen-core';
import { fromRef, isNode, isRef, isSymbol, nodeBrand, ref } from '@hey-api/codegen-core';
import type { AnyString } from '@hey-api/types';

import { ts } from '../ts-compiler';
import type { AccessOptions } from './utils/context';

export abstract class TsDsl<
  T extends ts.Node = ts.Node,
  L extends Language = 'typescript',
> implements Node<T> {
  analyze(_: AnalysisContext): void {}
  clone(): this {
    const cloned = Object.create(Object.getPrototypeOf(this));
    Object.assign(cloned, this);
    return cloned;
  }
  exported?: boolean;
  file?: File;
  get name(): Node['name'] {
    const nameRef = this._name;
    const nameValue = nameRef ? fromRef(nameRef) : undefined;
    const symbolValue = isSymbol(nameValue) ? nameValue : undefined;
    return {
      ...nameRef,
      set: (value) => {
        this._name = ref(value);
        if (isSymbol(value)) {
          value.setNode(this);
        }
      },
      symbol: symbolValue,
      toString: () => (nameRef ? this.$name(nameRef) : ''),
    } as Node['name'];
  }
  readonly nameSanitizer?: NodeNameSanitizer;
  language: L = 'typescript' as L;
  meta: Required<ProjectMeta>[L] = {} as Required<ProjectMeta>[L];
  parent?: Node;
  root: boolean = false;
  scope?: NodeScope = 'value';
  structuralChildren?: Map<TsDsl, NodeRelationship>;
  structuralParents?: Map<TsDsl, NodeRelationship>;
  symbol?: Symbol;
  toAst(): T {
    return undefined as unknown as T;
  }
  readonly '~brand' = nodeBrand;

  /** Branding property to identify the DSL class at runtime. */
  abstract readonly '~dsl': AnyString;

  /** Conditionally applies a callback to this builder. */
  $if<T extends TsDsl, V, R extends TsDsl = T>(
    this: T,
    value: V,
    ifTrue: (self: T, v: Exclude<V, false | null | undefined>) => R | void,
    ifFalse?: (self: T, v: Extract<V, false | null | undefined>) => R | void,
  ): R | T;
  $if<T extends TsDsl, V, R extends TsDsl = T>(
    this: T,
    value: V,
    ifTrue: (v: Exclude<V, false | null | undefined>) => R | void,
    ifFalse?: (v: Extract<V, false | null | undefined>) => R | void,
  ): R | T;
  $if<T extends TsDsl, V, R extends TsDsl = T>(
    this: T,
    value: V,
    ifTrue: () => R | void,
    ifFalse?: () => R | void,
  ): R | T;
  $if<T extends TsDsl, V, R extends TsDsl = T>(
    this: T,
    value: V,
    ifTrue: any,
    ifFalse?: any,
  ): R | T {
    if (value) {
      // Try calling with (self, value), then (value), then ()
      let result: R | void | undefined;
      try {
        result = ifTrue?.(this, value as Exclude<V, false | null | undefined>);
      } catch {
        // ignore and try other signatures
      }
      if (result === undefined) {
        try {
          result = ifTrue?.(value as Exclude<V, false | null | undefined>);
        } catch {
          // ignore and try zero-arg
        }
      }
      if (result === undefined) {
        try {
          result = ifTrue?.();
        } catch {
          // swallow
        }
      }
      return (result ?? this) as R | T;
    }
    if (ifFalse) {
      let result: R | void | undefined;
      try {
        result = ifFalse?.(this, value as Extract<V, false | null | undefined>);
      } catch {
        // ignore
      }
      if (result === undefined) {
        try {
          result = ifFalse?.(value as Extract<V, false | null | undefined>);
        } catch {
          // ignore
        }
      }
      if (result === undefined) {
        try {
          result = ifFalse?.();
        } catch {
          // ignore
        }
      }
      return (result ?? this) as R | T;
    }
    return this;
  }

  /** Access patterns for this node. */
  toAccessNode?(
    node: this,
    options: AccessOptions,
    ctx: {
      /** The full chain. */
      chain: ReadonlyArray<TsDsl>;
      /** Position in the chain (0 = root). */
      index: number;
      /** Is this the leaf node? */
      isLeaf: boolean;
      /** Is this the root node? */
      isRoot: boolean;
      /** Total length of the chain. */
      length: number;
    },
  ): TsDsl | undefined;

  protected $maybeId<T extends string | ts.Expression>(
    expr: T,
  ): T extends string ? ts.Identifier : T {
    return (typeof expr === 'string' ? ts.factory.createIdentifier(expr) : expr) as T extends string
      ? ts.Identifier
      : T;
  }

  protected $name(name: Ref<NodeName>): string {
    const value = fromRef(name);
    if (isSymbol(value)) {
      try {
        return value.finalName;
      } catch {
        return value.name;
      }
    }
    return String(value);
  }

  protected $node<I>(value: I): NodeOfMaybe<I> {
    if (value === undefined) {
      return undefined as NodeOfMaybe<I>;
    }
    // @ts-expect-error
    if (isRef(value)) value = fromRef(value);
    if (isSymbol(value)) {
      return this.$maybeId(value.finalName) as NodeOfMaybe<I>;
    }
    if (typeof value === 'string') {
      return this.$maybeId(value) as NodeOfMaybe<I>;
    }
    if (value instanceof Array) {
      return value.map((item) => {
        if (isRef(item)) item = fromRef(item);
        return this.unwrap(item);
      }) as NodeOfMaybe<I>;
    }
    return this.unwrap(value as any) as NodeOfMaybe<I>;
  }

  protected $type<I>(value: I, args?: ReadonlyArray<ts.TypeNode>): TypeOfMaybe<I> {
    if (value === undefined) {
      return undefined as TypeOfMaybe<I>;
    }
    // @ts-expect-error
    if (isRef(value)) value = fromRef(value);
    if (isSymbol(value)) {
      return ts.factory.createTypeReferenceNode(value.finalName, args) as TypeOfMaybe<I>;
    }
    if (typeof value === 'string') {
      return ts.factory.createTypeReferenceNode(value, args) as TypeOfMaybe<I>;
    }
    if (typeof value === 'boolean') {
      const literal = value ? ts.factory.createTrue() : ts.factory.createFalse();
      return ts.factory.createLiteralTypeNode(literal) as TypeOfMaybe<I>;
    }
    if (typeof value === 'number') {
      return ts.factory.createLiteralTypeNode(
        ts.factory.createNumericLiteral(value),
      ) as TypeOfMaybe<I>;
    }
    if (value instanceof Array) {
      return value.map((item) => this.$type(item, args)) as TypeOfMaybe<I>;
    }
    return this.unwrap(value as any) as TypeOfMaybe<I>;
  }

  private _name?: Ref<NodeName>;

  /** Unwraps nested nodes into raw TypeScript AST. */
  private unwrap<I>(value: I): I extends TsDsl<infer N> ? N : I {
    return (isNode(value) ? value.toAst() : value) as I extends TsDsl<infer N> ? N : I;
  }
}

type NodeOfMaybe<I> = undefined extends I
  ? NodeOf<NonNullable<FromRef<I>>> | undefined
  : NodeOf<FromRef<I>>;

type NodeOf<I> =
  I extends ReadonlyArray<infer U>
    ? ReadonlyArray<U extends TsDsl<infer N> ? N : U>
    : I extends string
      ? ts.Expression
      : I extends TsDsl<infer N>
        ? N
        : I extends ts.Node
          ? I
          : never;

export type MaybeTsDsl<T> = [T] extends [TsDsl<infer U>]
  ? U | TsDsl<U>
  : [T] extends [ts.Node]
    ? T | TsDsl<T>
    : never;

export abstract class TypeTsDsl<
  T extends
    | ts.LiteralTypeNode
    | ts.QualifiedName
    | ts.TypeElement
    | ts.TypeNode
    | ts.TypeParameterDeclaration = ts.TypeNode,
> extends TsDsl<T> {}

type TypeOfMaybe<I> = undefined extends I
  ? TypeOf<NonNullable<FromRef<I>>> | undefined
  : TypeOf<FromRef<I>>;

type TypeOf<I> =
  I extends ReadonlyArray<infer U>
    ? ReadonlyArray<TypeOf<U>>
    : I extends string
      ? ts.TypeNode
      : I extends boolean
        ? ts.LiteralTypeNode
        : I extends TsDsl<infer N>
          ? N
          : I extends ts.TypeNode
            ? I
            : never;
