import type { AnalysisContext, NodeName, Symbol } from '@hey-api/codegen-core';
import { applyNaming } from '@hey-api/shared';

import type { py } from '../../../../py-compiler';
import type { MaybePyDsl } from '../../../../py-dsl';
import { $, KwargPyDsl, PyDsl } from '../../../../py-dsl';
import { OptionalMixin } from '../../../../py-dsl/mixins/optional';
import { safeKeywordName } from '../../../../py-dsl/utils/name';
import type { PydanticPlugin } from '../../types';
import type { PydanticConstrainedTypeDsl } from '../expr/constrained-type';
import type { PydanticFieldConstraints } from '../expr/constraints';
import { literalize } from '../utils/literal';

const Mixed = OptionalMixin(PyDsl<py.Statement>);

// Pydantic reserves a leading underscore for a private attribute and raises
// `NameError` while the class body executes, which aborts the import of the
// whole module. The identifier sanitizer prefixes an underscore when a name
// cannot start with its first character, such as a wire name beginning with a
// digit, so a field needs a prefix Pydantic accepts instead.
function safeFieldName(name: string): string {
  const safe = safeKeywordName(name);
  return safe.startsWith('_') ? `field${safe}` : safe;
}

export class PydanticFieldDsl extends Mixed {
  readonly '~dsl' = 'PydanticFieldDsl';

  protected plugin: PydanticPlugin['Instance'];

  private _decision?: { fieldSymbol: Symbol; strategy: 'field' };
  private _fieldArgs?: Array<ReturnType<typeof $.expr | typeof $.kwarg>>;
  private _pythonName: string;
  private _wireName: string;

  private _alias?: string;
  private _default: unknown;
  private _defaultFactory?: string;
  private _deprecated?: boolean;
  private _discriminator?: string;
  private _dsl?: ReturnType<typeof $.field>;
  private _constrainedType?: PydanticConstrainedTypeDsl;
  private _nullable?: boolean;
  private _unionMembers?: Array<PydanticConstrainedTypeDsl>;

  constructor(plugin: PydanticPlugin['Instance'], name: string) {
    super();
    this._wireName = name;
    this.plugin = plugin;

    const snaked = applyNaming(this._wireName, { casing: 'snake_case' });
    this._pythonName = safeFieldName(snaked);
    this.name.set(plugin.symbol(this._pythonName));
  }

  get hasAlias(): boolean {
    const effectiveAlias =
      this._alias ?? (this._pythonName !== this._wireName ? this._wireName : undefined);
    return effectiveAlias !== undefined;
  }

  alias(name: string): this {
    this._alias = name;
    return this;
  }

  default(value: unknown): this {
    this._default = value;
    return this;
  }

  defaultFactory(factory: string): this {
    this._defaultFactory = factory;
    return this;
  }

  deprecated(value: boolean): this {
    this._deprecated = value;
    return this;
  }

  discriminator(field: string): this {
    this._discriminator = field;
    return this;
  }

  metadata(constrainedType: PydanticConstrainedTypeDsl): this {
    this._constrainedType = constrainedType;
    return this;
  }

  nullable(value: boolean): this {
    this._nullable = value;
    return this;
  }

  type(constrainedType: PydanticConstrainedTypeDsl | Array<PydanticConstrainedTypeDsl>): this {
    if (Array.isArray(constrainedType)) {
      this._unionMembers = constrainedType;
    } else {
      this._constrainedType = constrainedType;
    }
    return this;
  }

  private _buildUnionVarType(): ReturnType<typeof $.subscript | typeof $.type.or> | undefined {
    const members = this._unionMembers;
    if (!members?.length) return;

    const { plugin } = this;

    const itemExprs = members.map((ct) => {
      if (!ct.constraints.hasValidationConstraints) {
        return ct.type;
      }

      return $(plugin.imports.typing.Annotated).slice(
        ct.type,
        $(plugin.imports.Field).call(...this._constraintsToKwargs(ct.constraints.values)),
      );
    });

    const unionType = $.type.or(...itemExprs);

    if (this._discriminator) {
      return $(plugin.imports.typing.Annotated).slice(
        unionType,
        $(plugin.imports.Field).call($.kwarg('discriminator', this._discriminator)),
      );
    }

    return unionType;
  }

  private _constraintsToKwargs(
    cv: Readonly<PydanticFieldConstraints>,
  ): Array<ReturnType<typeof $.kwarg>> {
    const args: Array<ReturnType<typeof $.kwarg>> = [];
    if (cv.gt !== undefined) args.push($.kwarg('gt', cv.gt));
    if (cv.ge !== undefined) args.push($.kwarg('ge', cv.ge));
    if (cv.lt !== undefined) args.push($.kwarg('lt', cv.lt));
    if (cv.le !== undefined) args.push($.kwarg('le', cv.le));
    if (cv.multiple_of !== undefined) args.push($.kwarg('multiple_of', cv.multiple_of));
    if (cv.min_length !== undefined) args.push($.kwarg('min_length', cv.min_length));
    if (cv.max_length !== undefined) args.push($.kwarg('max_length', cv.max_length));
    if (cv.pattern !== undefined) args.push($.kwarg('pattern', cv.pattern));
    return args;
  }

  _build(): ReturnType<typeof $.field> {
    if (this._dsl) return this._dsl;

    const { plugin } = this;

    const isUnion = Boolean(this._unionMembers?.length);

    const cv = this._constrainedType?.constraints.values ?? {};
    const hasValidationConstraints = this._constrainedType
      ? this._constrainedType.constraints.hasValidationConstraints
      : false;

    const hasDefault = this._default !== undefined;

    let varType:
      | ReturnType<typeof $.expr | typeof $.field | typeof $.type.or>
      | NodeName
      | MaybePyDsl<py.Expression>
      | undefined;

    if (isUnion) {
      varType = this._buildUnionVarType();
      if (this._discriminator) this._discriminator = undefined;
    } else {
      varType = this._constrainedType?.type;
      if (hasValidationConstraints && varType) {
        varType = $(plugin.imports.typing.Annotated).slice(
          varType,
          $(plugin.imports.Field).call(...this._constraintsToKwargs(cv)),
        );
      }
    }

    if ((this._nullable || this._optional) && varType) {
      varType = $.type.or(varType, 'None');
    }

    const effectiveAlias =
      this._alias ?? (this._pythonName !== this._wireName ? this._wireName : undefined);

    const stmt = $.field(this.name).$if(varType, (v, t) => v.type(t));

    const needsField =
      this._defaultFactory !== undefined ||
      effectiveAlias !== undefined ||
      this._discriminator !== undefined ||
      cv.title !== undefined ||
      cv.description !== undefined ||
      this._deprecated !== undefined;

    const args: Array<ReturnType<typeof $.expr | typeof $.kwarg>> = [];

    const isRequired = !this._nullable && !this._optional && !hasDefault && !this._defaultFactory;
    if (isRequired) {
      args.push($('...'));
    } else if (hasDefault) {
      args.push($.kwarg('default', literalize(this._default)));
    } else if (this._nullable || this._optional) {
      args.push($.kwarg('default', literalize(null)));
    }
    this._fieldArgs = args;

    if (needsField) {
      if (this._defaultFactory) args.push($.kwarg('default_factory', this._defaultFactory));
      if (effectiveAlias !== undefined) args.push($.kwarg('alias', effectiveAlias));
      if (cv.title !== undefined) args.push($.kwarg('title', cv.title));
      if (cv.description !== undefined) args.push($.kwarg('description', cv.description));
      if (this._deprecated !== undefined) args.push($.kwarg('deprecated', this._deprecated));
      if (this._discriminator !== undefined) {
        args.push($.kwarg('discriminator', this._discriminator));
      }

      this._fieldArgs = args;
      stmt.assign($(plugin.imports.Field).call(...args));
    } else if (hasDefault) {
      stmt.assign(literalize(this._default));
    } else if (this._nullable || this._optional) {
      stmt.assign(literalize(null));
    }

    this._dsl = stmt;
    return this._dsl;
  }

  override analyze(ctx: AnalysisContext): void {
    this._build();
    ctx.analyze(this._dsl!);
    this.name.symbol?.on('finalName', ({ symbol }) => {
      if (!symbol.isRenamed) return;
      const fieldSymbol = this.plugin.imports.Field;
      const targetFile = ctx.symbol?.file;
      fieldSymbol.on('import', ({ symbol: importSymbol }) => {
        if (targetFile && importSymbol.file?.id === targetFile.id) {
          this._decision = { fieldSymbol: importSymbol, strategy: 'field' };
        }
      });
      ctx.analyze(fieldSymbol);
    });
    super.analyze(ctx);
  }

  override toAst() {
    this._build();
    if (this._decision?.strategy === 'field') {
      const args = this._fieldArgs ?? [];
      if (!args.some((a) => a instanceof KwargPyDsl && a.key === 'alias')) {
        args.push($.kwarg('alias', this._wireName));
      }
      this._dsl!.assign($(this._decision.fieldSymbol).call(...args));
    }
    return this._dsl!.toAst();
  }
}
