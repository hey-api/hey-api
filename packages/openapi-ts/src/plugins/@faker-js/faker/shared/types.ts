import type { $ } from '../../../../ts-dsl';

/**
 * Any DSL node or raw TS node that represents an expression.
 * Broad enough to accept ExprTsDsl, CallTsDsl, ObjectTsDsl, LiteralTsDsl, etc.
 */
export type Expression = ReturnType<typeof $.fromValue>;

/**
 * Result from walking a schema node.
 */
export interface FakerResult {
  expression: Expression;
  /** Whether the expression contains a reference to a circular schema. */
  hasCircularRef?: boolean;
  /** Whether the expression produces an object-like value that can be spread. */
  isObjectLike?: boolean;
  /** The type of the result - for special handling */
  resultType?: 'never' | 'unknown';
  /** Whether the expression directly references the local `f` accessor. */
  usesAccessor: boolean;
  /** Whether the expression depends on the `options` parameter (faker accessor or $ref call). */
  usesFaker: boolean;
}

/**
 * Mutable tracking of which helpers are actually referenced in the generated output.
 * Used to conditionally emit helper declarations only when needed.
 */
export interface EmitTracking {
  /**
   * Tracks whether each exported schema function returns an object-like value
   * that can be spread in an intersection. Keyed by JSON pointer (resourceId).
   */
  isObjectByRef: Map<string, boolean>;
  needsMaxCallDepth: boolean;
  needsResolveCondition: boolean;
  /**
   * Tracks whether each exported schema function accepts `options`.
   * Keyed by JSON pointer (resourceId). Populated during processing so that
   * later `$ref` call sites can omit the argument when the target function
   * does not need it (e.g. const-only schemas).
   */
  usesFakerByRef: Map<string, boolean>;
}

/**
 * Context carried through the walker for building faker expressions.
 */
export interface FakerWalkerContext {
  /** Set of JSON pointers that are involved in circular references. */
  circularPointers: Set<string>;
  /**
   * The `f` identifier — a local variable declared in each function body
   * as `const f = options?.faker ?? faker`.
   * All leaf nodes chain `.attr()` / `.call()` on this.
   */
  fakerAccessor: ReturnType<typeof $.expr>;
  /** Whether the current top-level schema being processed is itself circular. */
  isCircularSchema: boolean;
  nameRulesByType: {
    number?: ResolvedNameRules;
    string?: ResolvedNameRules;
  };
  /**
   * The `options` identifier, used when calling referenced factories.
   */
  optionsId: ReturnType<typeof $.expr>;
  /** Shared tracking object for conditional helper emission. */
  tracking: EmitTracking;
}

export interface NameRule {
  /**
   * Default args for the faker method. Schema constraints merge with these:
   * schema values override defaults.
   */
  defaultArgs?: string | Record<string, number | string | boolean>;
  /** Faker method path segments, e.g., ['person', 'firstName']. */
  fakerPath: Readonly<[fakeModule: string, fakeFunction: string]>;
}

/**
 * A map of properties and the desired faker methods.
 *
 * Add `suffixMatch` so the configured rule will be applied as long as
 * the property name ends with the provided key.
 *
 * Supports matching with property ancestor with the pattern
 * `<ancesor>.<property>`.
 *
 * @example
 *
 * ```ts
 * {
 *   // property matching 'country' exactly -> `faker.location.countryCode('alpha-3')`
 *   country: { fakerPath: ['location', 'countryCode'], defaultArgs: 'alpha-3' },
 *   // property ends with 'id' -> `faker.database.mongodbObjectId()`
 *   id: { fakerPath: ['database', 'mongodbObjectId'], suffixMatch: true },
 *   // property name wih role as ancestor -> `faker.person.jobTitle()`
 *   'role.name': { fakerPath: ['person', 'jobTitle'] }
 * }
 * ```
 */
export type NameRulesOverrides = Record<string, NameRule & { suffixMatch?: true }>;

export type ResolvedNameRules = {
  compoundRules?: Record<string, NameRule>;
  exactMatchRules?: Record<string, NameRule>;
  suffixRules?: Array<{ rule: NameRule; suffix: string }>;
};
