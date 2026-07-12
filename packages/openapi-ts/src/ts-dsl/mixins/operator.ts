import type { AnalysisContext, Node, NodeName } from '@hey-api/codegen-core';

import type { ts } from '../../ts-compiler';
import type { MaybeTsDsl } from '../base';
import { BinaryTsDsl } from '../expr/binary';
import type { BaseCtor, MixinCtor } from './types';

type Expr = NodeName | MaybeTsDsl<ts.Expression>;

export interface OperatorMethods extends Node {
  /** Logical AND — `this && expr` */
  and(expr: Expr): BinaryTsDsl;
  /** Creates an assignment expression (e.g., `this = expr`). */
  assign(expr: Expr): BinaryTsDsl;
  /** Nullish coalescing — `this ?? expr` */
  coalesce(expr: Expr): BinaryTsDsl;
  /** Division — `this / expr` */
  div(expr: Expr): BinaryTsDsl;
  /** Strict equality — `this === expr` */
  eq(expr: Expr): BinaryTsDsl;
  /** Greater than — `this > expr` */
  gt(expr: Expr): BinaryTsDsl;
  /** Greater than or equal — `this >= expr` */
  gte(expr: Expr): BinaryTsDsl;
  /** Loose equality — `this == expr` */
  looseEq(expr: Expr): BinaryTsDsl;
  /** Loose inequality — `this != expr` */
  looseNeq(expr: Expr): BinaryTsDsl;
  /** Less than — `this < expr` */
  lt(expr: Expr): BinaryTsDsl;
  /** Less than or equal — `this <= expr` */
  lte(expr: Expr): BinaryTsDsl;
  /** Subtraction — `this - expr` */
  minus(expr: Expr): BinaryTsDsl;
  /** Strict inequality — `this !== expr` */
  neq(expr: Expr): BinaryTsDsl;
  /** Nullish assignment — `this ??= expr` */
  nullishAssign(expr: Expr): BinaryTsDsl;
  /** Logical OR — `this || expr` */
  or(expr: Expr): BinaryTsDsl;
  /** Addition — `this + expr` */
  plus(expr: Expr): BinaryTsDsl;
  /** Multiplication — `this * expr` */
  times(expr: Expr): BinaryTsDsl;
}

export function OperatorMixin<T extends ts.Expression, TBase extends BaseCtor<T>>(Base: TBase) {
  abstract class Operator extends Base {
    override analyze(ctx: AnalysisContext): void {
      super.analyze(ctx);
    }

    protected and(expr: Expr): BinaryTsDsl {
      return new BinaryTsDsl(this).and(expr);
    }

    protected assign(expr: Expr): BinaryTsDsl {
      return new BinaryTsDsl(this, '=', expr);
    }

    protected coalesce(expr: Expr): BinaryTsDsl {
      return new BinaryTsDsl(this).coalesce(expr);
    }

    protected div(expr: Expr): BinaryTsDsl {
      return new BinaryTsDsl(this).div(expr);
    }

    protected eq(expr: Expr): BinaryTsDsl {
      return new BinaryTsDsl(this).eq(expr);
    }

    protected gt(expr: Expr): BinaryTsDsl {
      return new BinaryTsDsl(this).gt(expr);
    }

    protected gte(expr: Expr): BinaryTsDsl {
      return new BinaryTsDsl(this).gte(expr);
    }

    protected looseEq(expr: Expr): BinaryTsDsl {
      return new BinaryTsDsl(this).looseEq(expr);
    }

    protected looseNeq(expr: Expr): BinaryTsDsl {
      return new BinaryTsDsl(this).looseNeq(expr);
    }

    protected lt(expr: Expr): BinaryTsDsl {
      return new BinaryTsDsl(this).lt(expr);
    }

    protected lte(expr: Expr): BinaryTsDsl {
      return new BinaryTsDsl(this).lte(expr);
    }

    protected minus(expr: Expr): BinaryTsDsl {
      return new BinaryTsDsl(this).minus(expr);
    }

    protected neq(expr: Expr): BinaryTsDsl {
      return new BinaryTsDsl(this).neq(expr);
    }

    protected nullishAssign(expr: Expr): BinaryTsDsl {
      return new BinaryTsDsl(this).nullishAssign(expr);
    }

    protected or(expr: Expr): BinaryTsDsl {
      return new BinaryTsDsl(this).or(expr);
    }

    protected plus(expr: Expr): BinaryTsDsl {
      return new BinaryTsDsl(this).plus(expr);
    }

    protected times(expr: Expr): BinaryTsDsl {
      return new BinaryTsDsl(this).times(expr);
    }
  }

  return Operator as unknown as MixinCtor<TBase, OperatorMethods>;
}
