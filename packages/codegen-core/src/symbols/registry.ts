import type { ISymbolMeta } from '../extensions';
import { Symbol } from './symbol';
import type { ISymbolIdentifier, ISymbolIn, ISymbolRegistry, RegistryDumpEntry } from './types';

type IndexEntry = readonly [key: string, value: unknown, serialized: string];
type IndexKeySpace = ReadonlyArray<IndexEntry>;
type QueryCacheKey = string;
type SymbolId = number;

export class SymbolRegistry implements ISymbolRegistry {
  /** Forward index: cache key → index key space it was registered with. */
  private _cacheDependencies: Map<QueryCacheKey, IndexKeySpace> = new Map();
  /** Reverse index: serialized index entry → set of cache keys that depend on it. */
  private _dependencyToCache: Map<string, Set<QueryCacheKey>> = new Map();
  private _id: SymbolId = 0;
  private _indices: Map<IndexEntry[0], Map<IndexEntry[1], Set<SymbolId>>> = new Map();
  private _queryCache: Map<QueryCacheKey, ReadonlyArray<Symbol>> = new Map();
  private _registered: Set<SymbolId> = new Set();
  private _stubs: Set<SymbolId> = new Set();
  private _stubCache: Map<QueryCacheKey, SymbolId> = new Map();
  /**
   * Precomputed index key space for each live stub, keyed by symbol id. Since
   * a stub's meta never changes after `reference()` creates it, its key space
   * is computed once here and reused for the lifetime of the stub.
   */
  private _stubKeySpaces: Map<SymbolId, IndexKeySpace> = new Map();
  private _values: Map<SymbolId, Symbol> = new Map();

  dump(): ReadonlyArray<RegistryDumpEntry> {
    return Array.from(
      this._values,
      ([id, symbol]): RegistryDumpEntry => ({
        ...symbol.toDump(),
        status: this._registered.has(id) ? 'registered' : 'stub',
      }),
    );
  }

  get(identifier: ISymbolIdentifier): Symbol | undefined {
    return typeof identifier === 'number'
      ? this._values.get(identifier)
      : this.query(identifier)[0];
  }

  isRegistered(identifier: ISymbolIdentifier): boolean {
    const symbol = this.get(identifier);
    return symbol ? this._registered.has(symbol.id) : false;
  }

  get nextId(): SymbolId {
    return this._id++;
  }

  query(filter: ISymbolMeta): ReadonlyArray<Symbol> {
    const indexKeySpace = this.buildIndexKeySpace(filter);
    const cacheKey = this.cacheKeyFromKeySpace(indexKeySpace);
    return this.queryByKeySpace(indexKeySpace, cacheKey);
  }

  reference(meta: ISymbolMeta): Symbol {
    const indexKeySpace = this.buildIndexKeySpace(meta);
    const cacheKey = this.cacheKeyFromKeySpace(indexKeySpace);
    const [registered] = this.queryByKeySpace(indexKeySpace, cacheKey);
    if (registered) return registered;

    const cachedId = this._stubCache.get(cacheKey);
    if (cachedId !== undefined) return this._values.get(cachedId)!;

    const stub = new Symbol({ meta, name: '' }, this.nextId);

    this._values.set(stub.id, stub);
    this._stubs.add(stub.id);
    this._stubCache.set(cacheKey, stub.id);
    this._stubKeySpaces.set(stub.id, indexKeySpace);
    return stub;
  }

  register(symbol: ISymbolIn): Symbol {
    const result = new Symbol(symbol, this.nextId);

    this._values.set(result.id, result);
    this._registered.add(result.id);

    if (result.meta) {
      const indexKeySpace = this.buildIndexKeySpace(result.meta);
      this.indexSymbol(result.id, indexKeySpace);
      this.invalidateCache(indexKeySpace);
      this.replaceStubs(result, indexKeySpace);
    }

    return result;
  }

  *registered(): IterableIterator<Symbol> {
    for (const id of this._registered.values()) {
      yield this._values.get(id)!;
    }
  }

  private buildIndexKeySpace(
    meta: ISymbolMeta,
    prefix = '',
    entries: Array<IndexEntry> = [],
  ): IndexKeySpace {
    for (const key in meta) {
      const value = meta[key];
      const path = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        this.buildIndexKeySpace(value as ISymbolMeta, path, entries);
      } else {
        entries.push([path, value, `${path}:${JSON.stringify(value)}`]);
      }
    }
    return entries;
  }

  /**
   * Derives a stable, order-insensitive cache key from a pre-built key space.
   * Avoids rebuilding the key space when it's already available.
   */
  private cacheKeyFromKeySpace(indexKeySpace: IndexKeySpace): QueryCacheKey {
    const serialized: Array<string> = [];
    for (let i = 0, len = indexKeySpace.length; i < len; i++) {
      serialized.push(indexKeySpace[i]![2]);
    }
    return serialized.sort().join('|');
  }

  private indexSymbol(symbolId: SymbolId, indexKeySpace: IndexKeySpace): void {
    for (const [key, value] of indexKeySpace) {
      if (!this._indices.has(key)) this._indices.set(key, new Map());
      const values = this._indices.get(key)!;
      const set = values.get(value) ?? new Set();
      set.add(symbolId);
      values.set(value, set);
    }
  }

  private invalidateCache(indexKeySpace: IndexKeySpace): void {
    for (const indexEntry of indexKeySpace) {
      const serialized = indexEntry[2];
      const cacheKeys = this._dependencyToCache.get(serialized);
      if (!cacheKeys) continue;
      for (const cacheKey of cacheKeys) {
        this._queryCache.delete(cacheKey);
        // Clean up stale reverse-index references so _dependencyToCache doesn't
        // accumulate orphaned entries for evicted cache keys.
        const deps = this._cacheDependencies.get(cacheKey);
        if (deps) {
          for (const dep of deps) {
            if (dep[2] !== serialized) {
              this._dependencyToCache.get(dep[2])?.delete(cacheKey);
            }
          }
          this._cacheDependencies.delete(cacheKey);
        }
      }
      this._dependencyToCache.delete(serialized);
    }
  }

  private isSubset(sub: IndexKeySpace, supMap: Map<IndexEntry[0], IndexEntry[1]>): boolean {
    for (const [key, value] of sub) {
      if (!supMap.has(key) || supMap.get(key) !== value) {
        return false;
      }
    }
    return true;
  }

  private queryByKeySpace(
    indexKeySpace: IndexKeySpace,
    cacheKey: QueryCacheKey,
  ): ReadonlyArray<Symbol> {
    const cached = this._queryCache.get(cacheKey);
    if (cached) {
      return cached;
    }
    const sets: Array<Set<SymbolId>> = [];
    let missed = false;

    // Build index sets and register cache dependencies inline within a single pass.
    for (const indexEntry of indexKeySpace) {
      const serialized = indexEntry[2];
      let cacheKeys: Set<string>;

      if (this._dependencyToCache.has(serialized)) {
        cacheKeys = this._dependencyToCache.get(serialized)!;
      } else {
        cacheKeys = new Set();
        this._dependencyToCache.set(serialized, cacheKeys);
      }

      cacheKeys.add(cacheKey);

      if (!missed) {
        const values = this._indices.get(indexEntry[0]);
        if (!values) {
          missed = true;
          continue;
        }
        const set = values.get(indexEntry[1]);
        if (!set) {
          missed = true;
          continue;
        }
        sets.push(set);
      }
    }

    this._cacheDependencies.set(cacheKey, indexKeySpace);

    if (missed || !sets.length) {
      this._queryCache.set(cacheKey, []);
      return [];
    }

    // We want to do a Set intersection, but large inputs may contain a few very
    // large sets. The profiling showed that Set operations became a huge bottleneck
    // on such inputs.
    //
    // To avoid iterating over large sets multiple times, we sort the sets by size
    // and use the smallest set as the base to minimize iterations and deletions.
    sets.sort((a, b) => a.size - b.size);
    const result = new Set(sets[0]);
    for (let i = 1; i < sets.length; i++) {
      const set = sets[i]!;
      for (const symbolId of result) {
        if (!set.has(symbolId)) result.delete(symbolId);
      }
    }

    const symbols = Array.from(result, (symbolId) => this._values.get(symbolId)!);
    this._queryCache.set(cacheKey, symbols);
    return symbols;
  }

  private replaceStubs(symbol: Symbol, indexKeySpace: IndexKeySpace): void {
    if (!this._stubs.size) return;
    const supMap = new Map(indexKeySpace.map((e) => [e[0], e[1]] as const));
    for (const stubId of this._stubs.values()) {
      const stub = this._values.get(stubId);
      if (stub?.meta) {
        const stubKeySpace = this._stubKeySpaces.get(stubId) ?? this.buildIndexKeySpace(stub.meta);
        if (this.isSubset(stubKeySpace, supMap)) {
          const cacheKey = this.cacheKeyFromKeySpace(stubKeySpace);
          this._stubCache.delete(cacheKey);
          this._stubs.delete(stubId);
          this._stubKeySpaces.delete(stubId);
          stub.setCanonical(symbol);
        }
      }
    }
  }
}
