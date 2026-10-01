import type { AnalysisContext, NodeName } from '@hey-api/codegen-core';

import type { py } from '../../../../py-compiler';
import { KwargPyDsl, PyDsl } from '../../../../py-dsl';
import { $ } from '../../../../py-dsl';
import { DocMixin } from '../../../../py-dsl/mixins/doc';
import { resolveBaseModelConfig } from '../../shared/base-model';
import type { PydanticModelConfig } from '../../shared/types';
import type { PydanticPlugin } from '../../types';
import { identifiers } from '../../v2/constants';
import type { PydanticFieldDsl } from './field';

const Mixed = DocMixin(PyDsl<py.ClassDeclaration>);

export class PydanticModelDsl extends Mixed {
  readonly '~dsl' = 'PydanticModelDsl';

  protected plugin: PydanticPlugin['Instance'];

  private _bases: Array<NodeName> = [];
  private _configKwargs: Array<[string, string | number | boolean]> = [];
  private _dsl?: ReturnType<typeof $.class>;
  private _fields: Array<PydanticFieldDsl> = [];

  constructor(plugin: PydanticPlugin['Instance'], name: NodeName) {
    super();
    this.plugin = plugin;
    this.name.set(name);
  }

  config(options: PydanticModelConfig): this {
    for (const [key, value] of Object.entries(options)) {
      this._configKwargs.push([key, value]);
    }
    return this;
  }

  extends(base: NodeName): this {
    this._bases.push(base);
    return this;
  }

  fields(...fields: ReadonlyArray<PydanticFieldDsl>): this {
    this._fields.push(...fields);
    return this;
  }

  _build(): ReturnType<typeof $.class> {
    if (this._dsl) return this._dsl;

    const { plugin } = this;

    if (plugin.config.modelType === 'dataclass') {
      const cls = $.class(this.name)
        .decorator(plugin.imports.dataclass)
        .do(...this._fields);
      this._dsl = cls;
      return cls;
    }

    const hasAnyAlias = this._fields.some((f) => f.hasAlias);
    const modelKeys = new Set(this._configKwargs.map(([k]) => k));
    const baseKwargs = resolveBaseModelConfig({ populateByName: hasAnyAlias }).filter(
      (kw) => kw instanceof KwargPyDsl && !modelKeys.has(kw.key),
    );
    const mergedKwargs = [...baseKwargs, ...this._configKwargs.map(([k, v]) => $.kwarg(k, v))];

    const cls = $.class(this.name)
      // plugin.querySymbol(BASE_MODEL_META)!
      .extends(plugin.imports.BaseModel, ...this._bases)
      .$if(this.$docs(), (c, v) => c.doc(v))
      // Every kwarg, not only the explicitly configured ones. `populate_by_name`
      // is derived from the fields, so gating on `_configKwargs` dropped it
      // from any aliased model that had no other config.
      .$if(mergedKwargs.length, (c) =>
        c.do(
          $.field(identifiers.model_config).assign(
            $(plugin.imports.ConfigDict).call(...mergedKwargs),
          ),
        ),
      )
      .do(...this._fields);

    this._dsl = cls;
    return cls;
  }

  override analyze(ctx: AnalysisContext): void {
    this._build();
    ctx.analyze(this._dsl!);
    super.analyze(ctx);
  }

  override toAst() {
    this._build();
    return this._dsl!.toAst();
  }
}
