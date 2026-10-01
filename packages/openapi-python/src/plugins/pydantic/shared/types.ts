import type { EnumMember } from '../../../py-dsl';
import type { $ } from '../dsl';

/** Return type for toType converters. */
export interface PydanticType {
  /** Discriminator property name, present when this type is a discriminated union. */
  discriminator?: string;
  /** Pre-resolved node. */
  node?: PydanticNode;
  type?: ReturnType<typeof $.constrainedType>;
  /** Per-member constrained types for union fields. Present only on union results. */
  unionMembers?: Array<ReturnType<typeof $.constrainedType>>;
}

/** Metadata that flows through schema walking. */
export interface PydanticMeta {
  /** Default value from schema. */
  default?: unknown;
  /** Whether this or any child contains a forward reference. */
  hasForwardReference: boolean;
  /** Does this schema explicitly allow null? */
  nullable: boolean;
  /** Is this schema read-only? */
  readonly: boolean;
}

/** Result from walking a schema node. */
export interface PydanticResult extends PydanticType {
  meta: PydanticMeta;
}

export interface PydanticModelConfig {
  extra?: 'allow' | 'forbid' | 'ignore';
  populate_by_name?: boolean;
}

/** Discriminated union of all finalized schema outputs. */
export type PydanticNode =
  | { kind: 'alias'; type: ReturnType<typeof $.constrainedType> }
  | { kind: 'enum'; members: Array<EnumMember> }
  | {
      /** Additional base classes to inherit from (e.g. from a composed `allOf` member). */
      baseClasses?: Array<ReturnType<typeof $.constrainedType>>;
      config?: PydanticModelConfig;
      fields: Array<ReturnType<typeof $.field>>;
      kind: 'model';
    }
  | { discriminator?: string; kind: 'rootModel'; type: ReturnType<typeof $.constrainedType> };
