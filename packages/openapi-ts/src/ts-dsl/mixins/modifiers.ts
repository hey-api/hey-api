import type { AnalysisContext } from '@hey-api/codegen-core';

import { ts } from '../../ts-compiler';
import type { BaseCtor, MixinCtor } from './types';

export type Modifiers = {
  /**
   * Checks if the specified modifier is present.
   *
   * @param modifier - The modifier to check.
   * @returns True if the modifier is present, false otherwise.
   */
  hasModifier(modifier: Modifier): boolean;
  modifiers: Array<ts.Modifier>;
};

type Modifier =
  | 'abstract'
  | 'async'
  | 'const'
  | 'declare'
  | 'default'
  | 'export'
  | 'override'
  | 'private'
  | 'protected'
  | 'public'
  | 'readonly'
  | 'static';

export interface ModifierMethods extends Modifiers {
  /**
   * Adds a modifier of the specified kind to the modifiers list if the condition is true.
   *
   * @param modifier - The modifier to add.
   * @param condition - Whether to add the modifier.
   * @returns The parent node for chaining.
   */
  _m(modifier: Modifier, condition: boolean): this;
}

function modifierToKind(modifier: Modifier): ts.ModifierSyntaxKind {
  switch (modifier) {
    case 'abstract':
      return ts.SyntaxKind.AbstractKeyword;
    case 'async':
      return ts.SyntaxKind.AsyncKeyword;
    case 'const':
      return ts.SyntaxKind.ConstKeyword;
    case 'declare':
      return ts.SyntaxKind.DeclareKeyword;
    case 'default':
      return ts.SyntaxKind.DefaultKeyword;
    case 'export':
      return ts.SyntaxKind.ExportKeyword;
    case 'override':
      return ts.SyntaxKind.OverrideKeyword;
    case 'private':
      return ts.SyntaxKind.PrivateKeyword;
    case 'protected':
      return ts.SyntaxKind.ProtectedKeyword;
    case 'public':
      return ts.SyntaxKind.PublicKeyword;
    case 'readonly':
      return ts.SyntaxKind.ReadonlyKeyword;
    case 'static':
      return ts.SyntaxKind.StaticKeyword;
  }
}

function ModifiersMixin<T extends ts.Node, TBase extends BaseCtor<T>>(Base: TBase) {
  abstract class Modifiers extends Base {
    protected modifiers: Array<ts.Modifier> = [];

    override analyze(ctx: AnalysisContext): void {
      super.analyze(ctx);
    }

    protected hasModifier(modifier: Modifier): boolean {
      const kind = modifierToKind(modifier);
      return Boolean(this.modifiers.find((mod) => mod.syntaxKind === kind));
    }

    protected _m(modifier: Modifier, condition: boolean): this {
      if (condition) {
        const kind = modifierToKind(modifier);
        this.modifiers.push(ts.factory.createModifier(kind));
      }
      return this;
    }
  }

  return Modifiers as unknown as MixinCtor<TBase, ModifierMethods>;
}

export interface AbstractMethods extends Modifiers {
  /**
   * Adds the `abstract` keyword modifier if the condition is true.
   *
   * @param condition - Whether to add the modifier (default: true).
   * @returns The target object for chaining.
   */
  abstract(condition?: boolean): this;
}

/**
 * Mixin that adds an `abstract` modifier to a node.
 */
export function AbstractMixin<T extends ts.Node, TBase extends BaseCtor<T>>(Base: TBase) {
  const Mixed = ModifiersMixin(Base as BaseCtor<T>);

  abstract class Abstract extends Mixed {
    protected abstract(condition?: boolean): this {
      const cond = !arguments.length ? true : Boolean(condition);
      return this._m('abstract', cond);
    }
  }

  return Abstract as unknown as MixinCtor<TBase, AbstractMethods>;
}

export interface AsyncMethods extends Modifiers {
  /**
   * Adds the `async` keyword modifier if the condition is true.
   *
   * @param condition - Whether to add the modifier (default: true).
   * @returns The target object for chaining.
   */
  async(condition?: boolean): this;
}

/**
 * Mixin that adds an `async` modifier to a node.
 */
export function AsyncMixin<T extends ts.Node, TBase extends BaseCtor<T>>(Base: TBase) {
  const Mixed = ModifiersMixin(Base as BaseCtor<T>);

  abstract class Async extends Mixed {
    protected async(condition?: boolean): this {
      const cond = !arguments.length ? true : Boolean(condition);
      return this._m('async', cond);
    }
  }

  return Async as unknown as MixinCtor<TBase, AsyncMethods>;
}

export interface ConstMethods extends Modifiers {
  /**
   * Adds the `const` keyword modifier if the condition is true.
   *
   * @param condition - Whether to add the modifier (default: true).
   * @returns The target object for chaining.
   */
  const(condition?: boolean): this;
}

/**
 * Mixin that adds a `const` modifier to a node.
 */
export function ConstMixin<T extends ts.Node, TBase extends BaseCtor<T>>(Base: TBase) {
  const Mixed = ModifiersMixin(Base as BaseCtor<T>);

  abstract class Const extends Mixed {
    protected const(condition?: boolean): this {
      const cond = !arguments.length ? true : Boolean(condition);
      return this._m('const', cond);
    }
  }

  return Const as unknown as MixinCtor<TBase, ConstMethods>;
}

export interface DeclareMethods extends Modifiers {
  /**
   * Adds the `declare` keyword modifier if the condition is true.
   *
   * @param condition - Whether to add the modifier (default: true).
   * @returns The target object for chaining.
   */
  declare(condition?: boolean): this;
}

/**
 * Mixin that adds a `declare` modifier to a node.
 */
export function DeclareMixin<T extends ts.Node, TBase extends BaseCtor<T>>(Base: TBase) {
  const Mixed = ModifiersMixin(Base as BaseCtor<T>);

  abstract class Declare extends Mixed {
    protected declare(condition?: boolean): this {
      const cond = !arguments.length ? true : Boolean(condition);
      return this._m('declare', cond);
    }
  }

  return Declare as unknown as MixinCtor<TBase, DeclareMethods>;
}

export interface DefaultMethods extends Modifiers {
  /**
   * Adds the `default` keyword modifier if the condition is true.
   *
   * @param condition - Whether to add the modifier (default: true).
   * @returns The target object for chaining.
   */
  default(condition?: boolean): this;
}

/**
 * Mixin that adds a `default` modifier to a node.
 */
export function DefaultMixin<T extends ts.Node, TBase extends BaseCtor<T>>(Base: TBase) {
  const Mixed = ModifiersMixin(Base as BaseCtor<T>);

  abstract class Default extends Mixed {
    /**
     * Adds the `default` keyword modifier if the condition is true.
     *
     * @param condition - Whether to add the modifier (default: true).
     * @returns The target object for chaining.
     */
    protected default(condition?: boolean): this {
      const cond = !arguments.length ? true : Boolean(condition);
      return this._m('default', cond);
    }
  }

  return Default as unknown as MixinCtor<TBase, DefaultMethods>;
}

export interface ExportMethods extends Modifiers {
  /**
   * Adds the `export` keyword modifier if the condition is true.
   *
   * @param condition - Whether to add the modifier (default: true).
   * @returns The target object for chaining.
   */
  export(condition?: boolean): this;
}

/**
 * Mixin that adds an `export` modifier to a node.
 */
export function ExportMixin<T extends ts.Node, TBase extends BaseCtor<T>>(Base: TBase) {
  const Mixed = ModifiersMixin(Base as BaseCtor<T>);

  abstract class Export extends Mixed {
    /**
     * Adds the `export` keyword modifier if the condition is true.
     *
     * @param condition - Whether to add the modifier (default: true).
     * @returns The target object for chaining.
     */
    protected export(condition?: boolean): this {
      const cond = !arguments.length ? true : Boolean(condition);
      this.exported = cond;
      // TODO: remove this side-effect once planner handles exported flag
      if (this.symbol) this.symbol.setExported(cond);
      return this._m('export', cond);
    }
  }

  return Export as unknown as MixinCtor<TBase, ExportMethods>;
}

export interface OverrideMethods extends Modifiers {
  /**
   * Adds the `override` keyword modifier if the condition is true.
   *
   * @param condition - Whether to add the modifier (default: true).
   * @returns The target object for chaining.
   */
  override(condition?: boolean): this;
}

/**
 * Mixin that adds an `override` modifier to a node.
 */
export function OverrideMixin<T extends ts.Node, TBase extends BaseCtor<T>>(Base: TBase) {
  const Mixed = ModifiersMixin(Base as BaseCtor<T>);

  abstract class Override extends Mixed {
    protected override(condition?: boolean): this {
      const cond = !arguments.length ? true : Boolean(condition);
      return this._m('override', cond);
    }
  }

  return Override as unknown as MixinCtor<TBase, OverrideMethods>;
}

export interface PrivateMethods extends Modifiers {
  /**
   * Adds the `private` keyword modifier if the condition is true.
   *
   * @param condition - Whether to add the modifier (default: true).
   * @returns The target object for chaining.
   */
  private(condition?: boolean): this;
}

/**
 * Mixin that adds a `private` modifier to a node.
 */
export function PrivateMixin<T extends ts.Node, TBase extends BaseCtor<T>>(Base: TBase) {
  const Mixed = ModifiersMixin(Base as BaseCtor<T>);

  abstract class Private extends Mixed {
    protected private(condition?: boolean): this {
      const cond = !arguments.length ? true : Boolean(condition);
      return this._m('private', cond);
    }
  }

  return Private as unknown as MixinCtor<TBase, PrivateMethods>;
}

export interface ProtectedMethods extends Modifiers {
  /**
   * Adds the `protected` keyword modifier if the condition is true.
   *
   * @param condition - Whether to add the modifier (default: true).
   * @returns The target object for chaining.
   */
  protected(condition?: boolean): this;
}

/**
 * Mixin that adds a `protected` modifier to a node.
 */
export function ProtectedMixin<T extends ts.Node, TBase extends BaseCtor<T>>(Base: TBase) {
  const Mixed = ModifiersMixin(Base as BaseCtor<T>);

  abstract class Protected extends Mixed {
    protected protected(condition?: boolean): this {
      const cond = !arguments.length ? true : Boolean(condition);
      return this._m('protected', cond);
    }
  }

  return Protected as unknown as MixinCtor<TBase, ProtectedMethods>;
}

export interface PublicMethods extends Modifiers {
  /**
   * Adds the `public` keyword modifier if the condition is true.
   *
   * @param condition - Whether to add the modifier (default: true).
   * @returns The target object for chaining.
   */
  public(condition?: boolean): this;
}

/**
 * Mixin that adds a `public` modifier to a node.
 */
export function PublicMixin<T extends ts.Node, TBase extends BaseCtor<T>>(Base: TBase) {
  const Mixed = ModifiersMixin(Base as BaseCtor<T>);

  abstract class Public extends Mixed {
    protected public(condition?: boolean): this {
      const cond = !arguments.length ? true : Boolean(condition);
      return this._m('public', cond);
    }
  }

  return Public as unknown as MixinCtor<TBase, PublicMethods>;
}

export interface ReadonlyMethods extends Modifiers {
  /**
   * Adds the `readonly` keyword modifier if the condition is true.
   *
   * @param condition - Whether to add the modifier (default: true).
   * @returns The target object for chaining.
   */
  readonly(condition?: boolean): this;
}

/**
 * Mixin that adds a `readonly` modifier to a node.
 */
export function ReadonlyMixin<T extends ts.Node, TBase extends BaseCtor<T>>(Base: TBase) {
  const Mixed = ModifiersMixin(Base as BaseCtor<T>);

  abstract class Readonly extends Mixed {
    protected readonly(condition?: boolean): this {
      const cond = !arguments.length ? true : Boolean(condition);
      return this._m('readonly', cond);
    }
  }

  return Readonly as unknown as MixinCtor<TBase, ReadonlyMethods>;
}

export interface StaticMethods extends Modifiers {
  /**
   * Adds the `static` keyword modifier if the condition is true.
   *
   * @param condition - Whether to add the modifier (default: true).
   * @returns The target object for chaining.
   */
  static(condition?: boolean): this;
}

/**
 * Mixin that adds a `static` modifier to a node.
 */
export function StaticMixin<T extends ts.Node, TBase extends BaseCtor<T>>(Base: TBase) {
  const Mixed = ModifiersMixin(Base as BaseCtor<T>);

  abstract class Static extends Mixed {
    protected static(condition?: boolean): this {
      const cond = !arguments.length ? true : Boolean(condition);
      return this._m('static', cond);
    }
  }

  return Static as unknown as MixinCtor<TBase, StaticMethods>;
}
