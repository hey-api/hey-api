import path from 'node:path';

import type { ExportModule, ImportModule } from '../bindings';
import type { File } from '../files/file';
import type { INode } from '../nodes/node';
import { canDeclarationsShareIdentifier } from '../project/namespace';
import type { IProject } from '../project/types';
import { fromRef } from '../refs/refs';
import type { RenderContext } from '../renderer';
import type { Symbol } from '../symbols/symbol';
import type { SymbolKind } from '../symbols/types';
import type { AnalysisContext } from './analyzer';
import { Analyzer } from './analyzer';
import type { AssignOptions, Scope } from './scope';
import { createScope, registerName } from './scope';

const isTypeOnlyKind = (kind: SymbolKind) => kind === 'type' || kind === 'interface';

export class Planner {
  private static readonly MAX_ALLOCATION_ROUNDS = 100;

  private readonly analyzer: Analyzer;
  private readonly cacheResolvedNames = new Set<number>();
  private readonly project: IProject;

  constructor(project: IProject) {
    this.analyzer = new Analyzer(project.meta);
    this.project = project;
  }

  /**
   * Executes the planning phase for the project.
   */
  plan() {
    this.cacheResolvedNames.clear();

    let rounds = 0;
    while (this.allocateFiles()) {
      this.assignLocalNames();
      if (++rounds > Planner.MAX_ALLOCATION_ROUNDS) {
        throw new Error(
          `File allocation failed to converge after ${Planner.MAX_ALLOCATION_ROUNDS} rounds`,
        );
      }
    }

    this.resolveFilePaths();
    this.planExports();
    this.planImports();
  }

  /**
   * Creates and assigns a file to every node, re-export,
   * and external dependency.
   */
  private allocateFiles(): number {
    let allocated = 0;
    this.analyzer.analyze(this.project.nodes.all(), (ctx, node) => {
      const symbol = node.symbol;
      if (!symbol) return;

      if (!symbol.file) {
        const file = this.project.files.register({
          external: false,
          language: node.language,
          logicalFilePath: symbol.getFilePath?.(symbol) || this.project.defaultFileName,
        });
        file.addNode(node);
        symbol.setFile(file);
        allocated++;
        for (const logicalFilePath of symbol.getExportFromFilePath?.(symbol) ?? []) {
          this.project.files.register({
            external: false,
            language: file.language,
            logicalFilePath,
          });
        }
      }

      ctx.walkScopes((dependency) => {
        const dep = fromRef(dependency).canonical;
        if (dep.external && !dep.file) {
          const file = this.project.files.register({
            external: true,
            language: dep.node?.language,
            logicalFilePath: dep.external,
          });
          dep.setFile(file);
          allocated++;
        }
      });
    });
    return allocated;
  }

  /**
   * Assigns final names to all symbols.
   *
   * First assigns top-level (file-scoped) symbol names, then local symbols.
   */
  private assignLocalNames(): void {
    const sorted = [...this.project.nodes.all()].sort((a, b) => {
      const pa = a.symbol?.priority ?? 0;
      const pb = b.symbol?.priority ?? 0;
      return pb - pa;
    });

    this.analyzer.analyze(sorted, (ctx, node) => {
      const symbol = node.symbol;
      if (!symbol) return;
      this.assignTopLevelName({ ctx, node, symbol });
    });

    this.analyzer.analyze(this.project.nodes.all(), (ctx, node) => {
      const file = node.file;
      if (!file) return;
      ctx.walkScopes((dependency) => {
        const dep = fromRef(dependency).canonical;
        // top-level or external symbol
        if (dep.file || dep.external) return;
        // TODO: pass node
        this.assignLocalName({
          ctx,
          file,
          scopesToUpdate: [createScope({ localNames: file.allNames })],
          symbol: dep,
        });
      });
    });
  }

  /**
   * Resolves and sets final file paths for all non-external files. Attaches renderers.
   *
   * Uses the project's fileName function if provided, otherwise uses the file's current name.
   *
   * Resolves final paths relative to the project's root directory.
   */
  private resolveFilePaths(): void {
    for (const file of this.project.files.registered()) {
      if (file.external) {
        file.setFinalPath(file.logicalFilePath);
        continue;
      }
      const finalName = this.project.fileName?.(file.name) || file.name;
      file.setName(finalName);
      const finalPath = file.finalPath;
      if (finalPath) {
        file.setFinalPath(path.resolve(this.project.root, finalPath));
      }
      const ctx: RenderContext = { file, project: this.project };
      const renderer = this.project.renderers.find((r) => r.supports(ctx));
      if (renderer) file.setRenderer(renderer);
    }
  }

  /**
   * Plans exports by analyzing all exported symbols.
   *
   * Registers re-export targets as files and creates new exported symbols for them.
   *
   * Assigns names to re-exported symbols and collects re-export metadata,
   * distinguishing type-only exports based on symbol kinds.
   */
  private planExports(): void {
    const seenByFile = new Map<File, Map<string, { kinds: Set<SymbolKind>; symbol: Symbol }>>();
    const sourceFile = new Map<number, File>();

    this.analyzer.analyze(this.project.nodes.all(), (ctx, node) => {
      if (!node.exported) return;

      const symbol = node.symbol;
      if (!symbol) return;

      const file = node.file;
      if (!file) return;

      for (const logicalFilePath of symbol.getExportFromFilePath?.(symbol) ?? []) {
        const target = this.project.files.register({
          external: false,
          language: node.language,
          logicalFilePath,
        });
        if (target.id === file.id) continue;

        let fileMap = seenByFile.get(target);
        if (!fileMap) {
          fileMap = new Map();
          seenByFile.set(target, fileMap);
        }

        const exp = this.project.symbols.register({
          exported: true,
          external: symbol.external,
          importKind: symbol.importKind,
          kind: symbol.kind,
          name: symbol.finalName,
          origin: 'planner:export',
        });
        exp.setFile(target);
        sourceFile.set(exp.id, file);
        // TODO: pass node
        this.assignTopLevelName({ ctx, symbol: exp });

        let entry = fileMap.get(exp.finalName);
        if (!entry) {
          entry = { kinds: new Set(), symbol: exp };
          fileMap.set(exp.finalName, entry);
        }
        entry.kinds.add(exp.kind);
      }
    });

    for (const [file, fileMap] of seenByFile) {
      const exports = new Map<File, ExportModule>();
      for (const [, entry] of fileMap) {
        const source = sourceFile.get(entry.symbol.id)!;
        let exp = exports.get(source);
        if (!exp) {
          exp = {
            canExportAll: true,
            exports: [],
            from: source,
            isTypeOnly: true,
          };
        }
        const isTypeOnly = [...entry.kinds].every((kind) => isTypeOnlyKind(kind));
        const exportedName = entry.symbol.finalName;
        exp.exports.push({
          exportedName,
          isTypeOnly,
          kind: entry.symbol.importKind,
          sourceName: entry.symbol.name,
        });
        if (entry.symbol.name !== entry.symbol.finalName) {
          exp.canExportAll = false;
        }
        if (!isTypeOnly) {
          exp.isTypeOnly = false;
        }
        exports.set(source, exp);
      }
      for (const [, exp] of exports) {
        file.addExport(exp);
      }
    }
  }

  /**
   * Plans imports by analyzing symbol dependencies across files.
   *
   * For external dependencies, assigns top-level names.
   *
   * Creates or reuses import symbols for dependencies from other files,
   * assigning names and updating import metadata including type-only flags.
   */
  private planImports(): void {
    const seenByFile = new Map<
      File,
      Map<
        string,
        {
          dep: Symbol;
          kinds: Set<SymbolKind>;
          symbol: Symbol;
        }
      >
    >();

    this.analyzer.analyze(this.project.nodes.all(), (ctx) => {
      const symbol = ctx.symbol;
      if (!symbol) return;

      const file = symbol.file;
      if (!file) return;

      let fileMap = seenByFile.get(file);
      if (!fileMap) {
        fileMap = new Map();
        seenByFile.set(file, fileMap);
      }

      ctx.walkScopes((dependency) => {
        const dep = fromRef(dependency).canonical;
        if (!dep.file || dep.file.id === file.id) return;

        if (dep.external) {
          // TODO: pass node
          this.assignTopLevelName({ ctx, symbol: dep });
        }

        const fromFileId = dep.file.id;
        const importedName = dep.finalName;
        const kind = dep.importKind;
        const key = `${fromFileId}|${importedName}|${kind}`;

        let entry = fileMap.get(key);
        if (!entry) {
          const imp = this.project.symbols.register({
            exported: dep.exported,
            external: dep.external,
            importKind: dep.importKind,
            kind: dep.kind,
            name: dep.finalName,
            origin: 'planner:import',
          });
          imp.setFile(file);
          // TODO: pass node
          this.assignTopLevelName({
            ctx,
            scope: createScope({ localNames: imp.file!.allNames }),
            symbol: imp,
          });
          entry = {
            dep,
            kinds: new Set(),
            symbol: imp,
          };
          fileMap.set(key, entry);
          dep.addImport(imp);
        }
        entry.kinds.add(dep.kind);

        dependency['~ref'] = entry.symbol;
      });
    });

    for (const [file, fileMap] of seenByFile) {
      const imports = new Map<File, ImportModule>();
      for (const [, entry] of fileMap) {
        const source = entry.dep.file!;
        let imp = imports.get(source);
        if (!imp) {
          imp = {
            from: source,
            imports: [],
            isTypeOnly: true,
            kind: 'named',
          };
        }
        const isTypeOnly = [...entry.kinds].every((kind) => isTypeOnlyKind(kind));
        if (entry.symbol.importKind === 'namespace') {
          imp.imports = [];
          imp.kind = 'namespace';
          imp.localName = entry.symbol.finalName;
        } else if (entry.symbol.importKind === 'default') {
          imp.kind = 'default';
          imp.localName = entry.symbol.finalName;
        } else {
          imp.imports.push({
            isTypeOnly,
            localName: entry.symbol.finalName,
            sourceName: entry.dep.finalName,
          });
        }
        if (!isTypeOnly) {
          imp.isTypeOnly = false;
        }
        imports.set(source, imp);
      }
      for (const [, imp] of imports) {
        file.addImport(imp);
      }
    }
  }

  /**
   * Assigns the final name to a top-level (file-scoped) symbol.
   *
   * Uses the symbol's file top-level names as the default scope,
   * and updates all relevant name scopes including the file's allNames and local scopes.
   *
   * Supports optional overrides for the naming scope and scopes to update.
   */
  private assignTopLevelName(
    args: Partial<AssignOptions> & {
      ctx: AnalysisContext;
      debug?: boolean;
      node?: INode;
      symbol: Symbol;
    },
  ): void {
    if (!args.symbol.file) return;
    this.assignSymbolName({
      ...args,
      file: args.symbol.file,
      scope: args?.scope ?? createScope({ localNames: args.symbol.file.topLevelNames }),
      scopesToUpdate: [
        createScope({ localNames: args.symbol.file.allNames }),
        args.ctx.scopes,
        ...(args?.scopesToUpdate ?? []),
      ],
    });
  }

  /**
   * Assigns the final name to a non-top-level (local) symbol.
   *
   * Uses the provided scope or derives it from the current analysis context's local names.
   *
   * Updates all provided name scopes accordingly.
   */
  private assignLocalName(
    args: Pick<Partial<AssignOptions>, 'scope'> &
      Pick<AssignOptions, 'scopesToUpdate'> & {
        ctx: AnalysisContext;
        debug?: boolean;
        /** The file the symbol belongs to. */
        file: File;
        node?: INode;
        symbol: Symbol;
      },
  ): void {
    this.assignSymbolName({
      ...args,
      scope: args.scope ?? args.ctx.scope,
    });
  }

  /**
   * Assigns the final name to a symbol within the provided name scope.
   *
   * Resolves name conflicts until a unique name is found.
   *
   * Updates all specified name scopes with the assigned final name.
   */
  private assignSymbolName(
    args: AssignOptions & {
      ctx: AnalysisContext;
      debug?: boolean;
      /** The file the symbol belongs to. */
      file: File;
      node?: INode;
      symbol: Symbol;
    },
  ): void {
    const { file, node, scope, scopesToUpdate, symbol } = args;
    if (this.cacheResolvedNames.has(symbol.id)) return;

    const baseName = symbol.name;
    let finalName =
      node?.nameSanitizer?.(baseName) ?? symbol.node?.nameSanitizer?.(baseName) ?? baseName;
    let attempt = 1;

    while (true) {
      const language = node?.language || symbol.node?.language || file.language;

      const ok = this.nameIsAvailable({
        kind: symbol.kind,
        language,
        name: finalName,
        override: symbol.override,
        scope,
      });
      if (ok) break;

      const resolver =
        (language ? this.project.nameConflictResolvers[language] : undefined) ??
        this.project.defaultNameConflictResolver;
      const resolvedName = resolver({ attempt, baseName });
      if (!resolvedName) {
        throw new Error(`Unresolvable name conflict: ${symbol.toString()}`);
      }

      finalName =
        node?.nameSanitizer?.(resolvedName) ??
        symbol.node?.nameSanitizer?.(resolvedName) ??
        resolvedName;
      attempt = attempt + 1;
    }

    symbol.setFinalName(finalName);
    this.cacheResolvedNames.add(symbol.id);
    const updateScopes = [scope, ...scopesToUpdate];
    for (const scope of updateScopes) {
      registerName(scope, symbol.finalName, symbol.kind);
    }
  }

  /**
   * Checks whether `name` can be used for a new symbol of `kind` in `scope`.
   *
   * Walks up the scope chain and verifies that every existing declaration with
   * that name is compatible (i.e., can share the same identifier) with `kind`.
   * This avoids copying the entire accumulated name map on every call.
   */
  private nameIsAvailable({
    kind,
    language,
    name,
    override,
    scope,
  }: {
    kind: SymbolKind;
    language: string | undefined;
    name: string;
    override?: boolean;
    scope: Scope;
  }): boolean {
    function conflicts(kinds: Set<SymbolKind> | undefined): boolean {
      if (!kinds) return false;
      for (const existingKind of kinds) {
        if (!canDeclarationsShareIdentifier(language, kind, existingKind)) {
          return true;
        }
      }
      return false;
    }

    let current: Scope | undefined = scope;
    while (current) {
      if (!override && conflicts(current.childNames.get(name))) {
        return false;
      }
      if (conflicts(current.localNames.get(name))) return false;
      current = current.parent;
    }
    return true;
  }
}
