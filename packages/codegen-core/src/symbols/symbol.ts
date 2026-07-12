import { symbolBrand } from '../brands';
import type { ISymbolMeta } from '../extensions';
import type { File } from '../files/file';
import { log } from '../log';
import type { INode } from '../nodes/node';
import type {
  BindingKind,
  ISymbolChild,
  ISymbolIn,
  SymbolDump,
  SymbolEventMap,
  SymbolKind,
  SymbolOrigin,
} from './types';

export class Symbol<Node extends INode = INode> {
  /**
   * Canonical symbol this stub resolves to, if any.
   *
   * Stubs created during DSL construction may later be associated
   * with a fully registered symbol. Once set, all property lookups
   * should defer to the canonical symbol.
   */
  private _canonical?: Symbol;
  /**
   * Child symbol bindings scoped under this symbol.
   *
   * @default []
   */
  private _children: Array<ISymbolChild>;
  /**
   * True if this symbol is exported from its defining file.
   *
   * @default false
   */
  private _exported: boolean;
  /**
   * External module name if this symbol is imported from a module not managed
   * by the project (e.g., "zod", "lodash").
   *
   * @default undefined
   */
  private _external?: string;
  /**
   * The file this symbol is ultimately emitted into.
   *
   * Only top-level symbols have an assigned file.
   */
  private _file?: File;
  /**
   * The alias-resolved, conflict-free emitted name.
   */
  private _finalName?: string;
  /**
   * Custom strategy to determine from which file path(s) this symbol is re-exported.
   *
   * @returns The file path(s) that re-export this symbol, or undefined if none.
   */
  private _getExportFromFilePath?: (symbol: Symbol) => ReadonlyArray<string> | undefined;
  /**
   * Custom strategy to determine file output path.
   *
   * @returns The file path to output the symbol to, or undefined to fallback to default behavior.
   */
  private _getFilePath?: (symbol: Symbol) => string | undefined;
  /**
   * How this symbol should be imported (namespace/default/named).
   *
   * @default 'named'
   */
  private _importKind: BindingKind;
  /**
   * Per-file imported instances of this symbol.
   *
   * @default []
   */
  private _imports: Array<Symbol> = [];
  /**
   * Kind of symbol (class, type, alias, etc.).
   *
   * @default 'var'
   */
  private _kind: SymbolKind;
  /**
   * Registered event listeners keyed by event name.
   *
   * @default {}
   */
  private _listeners: {
    [K in keyof SymbolEventMap]?: Array<SymbolEventMap[K]>;
  } = {};
  /**
   * Arbitrary user metadata.
   *
   * @default undefined
   */
  private _meta?: ISymbolMeta;
  /**
   * Intended user-facing name before conflict resolution.
   *
   * @example "UserModel"
   */
  private _name: string;
  /**
   * Node that defines this symbol.
   */
  private _node?: Node;
  /**
   * Provenance tag indicating which pipeline phase created this symbol.
   *
   * @default undefined
   */
  private _origin?: SymbolOrigin;
  /**
   * Indicates whether this symbol overrides another declaration.
   *
   * @default false
   */
  private _override: boolean;
  /**
   * Naming priority. Higher value wins the canonical name when
   * multiple symbols in the same file compete for the same identifier.
   *
   * @default 0
   */
  private _priority: number;

  /** Brand used for identifying symbols. */
  readonly '~brand' = symbolBrand;
  /** Globally unique, stable symbol ID. */
  readonly id: number;

  constructor(input: ISymbolIn, id: number) {
    this._children = input.children ?? [];
    this._exported = input.exported ?? false;
    this._external = input.external;
    this._getExportFromFilePath = input.getExportFromFilePath;
    this._getFilePath = input.getFilePath;
    this.id = id;
    this._importKind = input.importKind ?? 'named';
    this._kind = input.kind ?? 'var';
    this._meta = input.meta;
    this._name = input.name;
    this._origin = input.origin;
    this._override = input.override ?? false;
    this._priority = input.priority ?? 0;
  }

  /**
   * Returns the canonical symbol for this instance.
   *
   * If this symbol was created as a stub, this getter returns
   * the fully registered canonical symbol. Otherwise, it returns
   * the symbol itself.
   */
  get canonical(): Symbol {
    return this._canonical ?? this;
  }

  /**
   * Read-only accessor for child symbol bindings.
   */
  get children(): ReadonlyArray<ISymbolChild> {
    return this.canonical._children;
  }

  /**
   * Indicates whether this symbol is exported from its defining file.
   */
  get exported(): boolean {
    return this.canonical._exported;
  }

  /**
   * External module from which this symbol originates, if any.
   */
  get external(): string | undefined {
    return this.canonical._external;
  }

  /**
   * Read‑only accessor for the assigned output file.
   *
   * Only top-level symbols have an assigned file.
   */
  get file(): File | undefined {
    return this.canonical._file;
  }

  /**
   * Read‑only accessor for the resolved final emitted name.
   */
  get finalName(): string {
    if (!this.canonical._finalName) {
      const message = `Symbol finalName has not been resolved yet for ${this.canonical.toString()}`;
      log.debug(message, 'symbol');
      throw new Error(message);
    }
    return this.canonical._finalName;
  }

  /**
   * Custom re-export file path resolver, if provided.
   */
  get getExportFromFilePath(): ((symbol: Symbol) => ReadonlyArray<string> | undefined) | undefined {
    return this.canonical._getExportFromFilePath;
  }

  /**
   * Custom file path resolver, if provided.
   */
  get getFilePath(): ((symbol: Symbol) => string | undefined) | undefined {
    return this.canonical._getFilePath;
  }

  /**
   * How this symbol should be imported (named/default/namespace).
   */
  get importKind(): BindingKind {
    return this.canonical._importKind;
  }

  /**
   * Read-only accessor for the per-file imported instances of this symbol.
   */
  get imports(): ReadonlyArray<Symbol> {
    return this.canonical._imports;
  }

  /**
   * Indicates whether this is a canonical symbol (not a stub).
   */
  get isCanonical(): boolean {
    return !this._canonical || this._canonical === this;
  }

  /**
   * Indicates whether this symbol was renamed during conflict resolution.
   */
  get isRenamed(): boolean {
    return Boolean(this.canonical._finalName) && this.canonical._finalName !== this.canonical._name;
  }

  /**
   * The symbol's kind (class, type, alias, variable, etc.).
   */
  get kind(): SymbolKind {
    return this.canonical._kind;
  }

  /**
   * Arbitrary user‑provided metadata associated with this symbol.
   */
  get meta(): ISymbolMeta | undefined {
    return this.canonical._meta;
  }

  /**
   * User-intended name before aliasing or conflict resolution.
   */
  get name(): string {
    return this.canonical._name;
  }

  /**
   * Read‑only accessor for the defining node.
   */
  get node(): Node | undefined {
    return this.canonical._node as Node | undefined;
  }

  /**
   * Provenance tag indicating which pipeline phase created this symbol.
   */
  get origin(): SymbolOrigin | undefined {
    return this.canonical._origin;
  }

  /**
   * Indicates whether this symbol is marked as an override.
   */
  get override(): boolean {
    return this.canonical._override;
  }

  /**
   * Naming priority. Higher value wins the canonical name when
   * multiple symbols in the same file compete for the same identifier.
   */
  get priority(): number {
    return this.canonical._priority;
  }

  /**
   * Registers a per-file imported instance of this symbol.
   *
   * @param symbol The imported instance to register.
   */
  addImport(symbol: Symbol): void {
    this.assertCanonical();
    this._imports.push(symbol);
    this.emit('import', { symbol });
  }

  /**
   * Registers a listener for the given symbol lifecycle event.
   *
   * @param event The event to subscribe to.
   * @param listener Callback invoked when the event is emitted.
   * @returns `this` for chaining.
   */
  on<K extends keyof SymbolEventMap>(event: K, listener: SymbolEventMap[K]): this {
    (this.canonical._listeners[event] ??= [] as NonNullable<
      (typeof this.canonical._listeners)[K]
    >).push(listener);
    return this;
  }

  /**
   * Marks this symbol as a stub and assigns its canonical symbol.
   *
   * After calling this, all semantic queries (name, kind, file,
   * meta, etc.) should reflect the canonical symbol's values.
   *
   * @param symbol The canonical symbol this stub should resolve to.
   */
  setCanonical(symbol: Symbol): void {
    this._canonical = symbol;
  }

  /**
   * Assigns the child symbol bindings associated with this symbol.
   *
   * @param children Child bindings to associate with the symbol.
   */
  setChildren(children: Array<ISymbolChild>): void {
    this.assertCanonical();
    this._children = children;
  }

  /**
   * Marks the symbol as exported from its file.
   *
   * @param exported Whether the symbol is exported.
   */
  setExported(exported: boolean): void {
    this.assertCanonical();
    this._exported = exported;
  }

  /**
   * Assigns the output file this symbol will be emitted into.
   *
   * This may only be set once.
   */
  setFile(file: File): void {
    this.assertCanonical();
    if (this._file && this._file !== file) {
      const message = `Symbol ${this.canonical.toString()} is already assigned to a different file.`;
      log.debug(message, 'symbol');
      throw new Error(message);
    }
    this._file = file;
    this.emit('file', { file, symbol: this });
  }

  /**
   * Assigns the conflict‑resolved final local name for this symbol.
   *
   * This may only be set once.
   */
  setFinalName(name: string): void {
    this.assertCanonical();
    if (this._finalName && this._finalName !== name) {
      const message = `Symbol finalName has already been resolved for ${this.canonical.toString()}.`;
      log.debug(message, 'symbol');
      throw new Error(message);
    }
    this._finalName = name;
    this.emit('finalName', { finalName: name, symbol: this });
  }

  /**
   * Sets how this symbol should be imported.
   *
   * @param kind The import strategy (named/default/namespace).
   */
  setImportKind(kind: BindingKind): void {
    this.assertCanonical();
    this._importKind = kind;
  }

  /**
   * Sets the symbol's kind (class, type, alias, variable, etc.).
   *
   * @param kind The new symbol kind.
   */
  setKind(kind: SymbolKind): void {
    this.assertCanonical();
    this._kind = kind;
  }

  /**
   * Updates the intended user‑facing name for this symbol.
   *
   * @param name The new name.
   */
  setName(name: string): void {
    this.assertCanonical();
    this._name = name;
  }

  /**
   * Binds the node that defines this symbol.
   *
   * This may only be set once.
   */
  setNode(node: Node): void {
    this.assertCanonical();
    if (this._node && this._node !== node) {
      const message = `Symbol ${this.canonical.toString()} is already bound to a different node.`;
      log.debug(message, 'symbol');
      // TODO: symbol <> node relationship needs to be refactor to 1:many
      // disabled in the meantime or it would throw
      // throw new Error(message);
    }
    this._node = node;
    node.symbol = this;
  }

  /**
   * Marks whether this symbol should be treated as an override.
   *
   * @param override Override marker value.
   */
  setOverride(override: boolean): void {
    this.assertCanonical();
    this._override = override;
  }

  toDump(): SymbolDump {
    return {
      canonicalId: this.isCanonical ? undefined : this.canonical.id,
      exported: this.exported,
      external: this.external,
      finalName: this.canonical._finalName,
      id: this.canonical.id,
      importIds: this.imports.map((imp) => imp.id).join(', '),
      importKind: this.importKind,
      isCanonical: this.isCanonical,
      isRenamed: this.isRenamed,
      kind: this.kind,
      logicalFilePath: this.file?.logicalFilePath,
      meta: this.meta ? this.flattenMetaArrayValues(this.meta) : undefined,
      name: this.name,
      origin: this.origin,
      override: this.override,
      priority: this.priority,
    };
  }

  /**
   * Returns a debug‑friendly string representation identifying the symbol.
   */
  toString(): string {
    const c = this.canonical;
    const status = `${this._finalName ? '✓' : '~'} `;
    let renamed = '';
    let file = '';
    if (c._finalName) {
      renamed = c._finalName !== c._name ? ` → "${c._finalName}"` : '';
      file = c._file ? ` ${c._file.logicalFilePath}` : '';
    }
    return `${status}Symbol#${c.id} "${c._name}"${renamed}${file}`;
  }

  /**
   * Ensures this symbol is canonical before allowing mutation.
   *
   * A symbol that has been marked as a stub (i.e., its `_canonical` points
   * to a different symbol) may not be mutated. This guard throws an error
   * if any setter attempts to modify a stub, preventing accidental writes
   * to non‑canonical instances.
   *
   * @throws {Error} If the symbol is a stub and is being mutated.
   */
  private assertCanonical(): void {
    if (this._canonical && this._canonical !== this) {
      const message = `Illegal mutation of stub symbol ${this.toString()} → canonical: ${this._canonical.toString()}`;
      log.debug(message, 'symbol');
      throw new Error(message);
    }
  }

  /**
   * Invokes all registered listeners for the given event.
   *
   * @param event The event to emit.
   * @param args Arguments forwarded to each listener.
   */
  private emit<K extends keyof SymbolEventMap>(
    event: K,
    ...args: Parameters<SymbolEventMap[K]>
  ): void {
    const listeners = this._listeners[event];
    if (!listeners) return;
    for (const listener of listeners) {
      (listener as (...args: Parameters<SymbolEventMap[K]>) => void)(...args);
    }
  }

  private flattenMetaArrayValues(obj: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (Array.isArray(value)) {
        result[key] = value.join('/');
      } else if (value && typeof value === 'object') {
        result[key] = this.flattenMetaArrayValues(value as Record<string, unknown>);
      } else {
        result[key] = value;
      }
    }
    return result;
  }
}
