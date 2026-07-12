import type { RenderContext, Renderer } from '@hey-api/codegen-core';
import type { BaseOutput } from '@hey-api/shared';
import type { MaybeArray, MaybeFunc } from '@hey-api/types';

import { ts } from '../../ts-compiler';
import type { TsDsl } from '../../ts-dsl';
import { $ } from '../../ts-dsl';
import type { ModuleExport, ModuleImport, SortGroup, SortKey, SortModule } from './render-utils';
import { moduleSortKey } from './render-utils';

type Exports = ReadonlyArray<ReadonlyArray<ModuleExport>>;
type ExportsOptions = {
  preferExportAll?: boolean;
};
type Header = MaybeArray<string> | null | undefined;
type HeaderArg = MaybeFunc<(ctx: RenderContext<TsDsl>) => Header>;
type Imports = ReadonlyArray<ReadonlyArray<ModuleImport>>;
type PrinterOptionsFn = (ctx: RenderContext<TsDsl>) => ts.PrinterOptions | undefined;
export type UserPrinter = MaybeFunc<PrinterOptionsFn>;

function headerToLines(header: Header): ReadonlyArray<string> {
  if (!header) return [];
  const lines: Array<string> = [];
  if (typeof header === 'string') {
    lines.push(...header.split(/\r?\n/));
    return lines;
  }
  for (const line of header) {
    lines.push(...line.split(/\r?\n/));
  }
  return lines;
}

const defaultPrinter = ts.createPrinter();

export class TypeScriptRenderer implements Renderer {
  /**
   * Function to generate a file header.
   *
   * @private
   */
  private _header?: HeaderArg;
  /**
   * Options for module specifier resolution.
   *
   * @private
   */
  private _module?: Partial<BaseOutput>['module'];
  /**
   * Whether `export * from 'module'` should be used when possible instead of named exports.
   *
   * @private
   */
  private _preferExportAll: boolean;
  /**
   * Function to generate printer options.
   *
   * @private
   */
  private _printer: PrinterOptionsFn;

  constructor(
    args: Pick<Partial<BaseOutput>, 'module'> & {
      header?: HeaderArg;
      preferExportAll?: boolean;
      printer?: UserPrinter;
    } = {},
  ) {
    const { printer } = args;
    this._header = args.header;
    this._module = args.module;
    this._preferExportAll = args.preferExportAll ?? false;
    this._printer = typeof printer === 'function' ? printer : () => printer;
  }

  render(ctx: RenderContext<TsDsl>): string {
    const header = typeof this._header === 'function' ? this._header(ctx) : this._header;
    const printerOptions = this._printer(ctx);
    return TypeScriptRenderer.astToString({
      exports: this.getExports(ctx),
      exportsOptions: {
        preferExportAll: this._preferExportAll,
      },
      header,
      imports: this.getImports(ctx),
      nodes: ctx.file.nodes,
      printer: printerOptions ? ts.createPrinter(printerOptions) : undefined,
    });
  }

  supports(ctx: RenderContext): boolean {
    return ctx.file.language === 'typescript';
  }

  static astToString(args: {
    exports?: Exports;
    exportsOptions?: ExportsOptions;
    header?: Header;
    imports?: Imports;
    nodes?: ReadonlyArray<TsDsl>;
    /**
     * Printer instance used to render AST nodes to source text.
     *
     * @default defaultPrinter
     */
    printer?: ts.Printer;
    /**
     * Whether to include a trailing newline at the end of the file.
     *
     * @default true
     */
    trailingNewline?: boolean;
  }): string {
    const printer = args.printer ?? defaultPrinter;

    let text = '';
    for (const header of headerToLines(args.header)) {
      text += `${header}\n`;
    }

    let imports = '';
    for (const group of args.imports ?? []) {
      if (imports) imports += '\n';
      for (const imp of group) {
        imports += printer.format(TypeScriptRenderer.toImportAst(imp));
      }
    }
    text = `${text}${text && imports ? '\n' : ''}${imports}`;

    let nodes = '';
    for (const node of args.nodes ?? []) {
      if (nodes) nodes += '\n';
      nodes += printer.format(node.toAst());
    }
    text = `${text}${text && nodes ? '\n' : ''}${nodes}`;

    let exports = '';
    for (const group of args.exports ?? []) {
      if ((!exports && nodes) || exports) exports += '\n';
      for (const exp of group) {
        exports += printer.format(TypeScriptRenderer.toExportAst(exp, args.exportsOptions));
      }
    }
    text = `${text}${text && exports ? '\n' : ''}${exports}`;

    if (args.trailingNewline === false && text.endsWith('\n')) {
      text = text.slice(0, -1);
    }

    return text;
  }

  static toExportAst(group: ModuleExport, options?: ExportsOptions): ts.ExportDeclaration {
    const specifiers = group.exports.map((exp) => {
      const specifier = ts.factory.createExportSpecifier(
        exp.isTypeOnly,
        exp.sourceName !== exp.exportedName ? $.id(exp.sourceName).toAst() : undefined,
        $.id(exp.exportedName).toAst(),
      );
      return specifier;
    });
    const exportClause = group.namespaceExport
      ? ts.factory.createNamespaceExport($.id(group.namespaceExport).toAst())
      : (!group.canExportAll || !options?.preferExportAll) && specifiers.length
        ? ts.factory.createNamedExports(specifiers)
        : undefined;
    return ts.factory.createExportDeclaration(
      undefined,
      group.isTypeOnly,
      exportClause,
      $.literal(group.modulePath).toAst(),
    );
  }

  static toImportAst(group: ModuleImport): ts.ImportDeclaration {
    const specifiers = group.imports.map((imp) => {
      const specifier = ts.factory.createImportSpecifier(
        imp.isTypeOnly,
        imp.sourceName !== imp.localName ? $.id(imp.sourceName).toAst() : undefined,
        $.id(imp.localName).toAst(),
      );
      return specifier;
    });
    const importClause = ts.factory.createImportClause(
      group.isTypeOnly,
      group.kind === 'default' ? $.id(group.localName ?? '').toAst() : undefined,
      group.kind === 'namespace'
        ? ts.factory.createNamespaceImport($.id(group.localName ?? '').toAst())
        : specifiers.length
          ? ts.factory.createNamedImports(specifiers)
          : undefined,
    );
    return ts.factory.createImportDeclaration(
      undefined,
      importClause,
      $.literal(group.modulePath).toAst(),
    );
  }

  private getExports(ctx: RenderContext): Exports {
    type ModuleEntry = {
      group: ModuleExport;
      sortKey: SortKey;
    };

    const groups = new Map<SortGroup, Map<SortModule, ModuleEntry>>();

    for (const exp of ctx.file.exports) {
      const sortKey = moduleSortKey({
        file: ctx.file,
        fromFile: exp.from,
        preferFileExtension: this._module?.extension || '',
        root: ctx.project.root,
      });
      const modulePath = this._module?.resolve?.(sortKey[2], ctx) ?? sortKey[2];
      const [groupIndex] = sortKey;

      if (!groups.has(groupIndex)) groups.set(groupIndex, new Map());
      const moduleMap = groups.get(groupIndex)!;

      if (!moduleMap.has(modulePath)) {
        moduleMap.set(modulePath, {
          group: {
            canExportAll: exp.canExportAll,
            exports: exp.exports,
            isTypeOnly: exp.isTypeOnly,
            modulePath,
            namespaceExport: exp.namespaceExport,
          },
          sortKey,
        });
      }
    }

    const exports: Array<Array<ModuleExport>> = Array.from(groups.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([, moduleMap]) => {
        const entries = Array.from(moduleMap.values());

        entries.sort((a, b) => {
          const d = a.sortKey[1] - b.sortKey[1];
          return d !== 0 ? d : a.group.modulePath.localeCompare(b.group.modulePath);
        });

        return entries.map((e) => {
          const group = e.group;
          if (group.namespaceExport) {
            group.exports = [];
          } else {
            const isTypeOnly = !group.exports.find((exp) => !exp.isTypeOnly);
            if (isTypeOnly) {
              group.isTypeOnly = true;
              for (const exp of group.exports) {
                exp.isTypeOnly = false;
              }
            }
            group.exports.sort((a, b) => a.exportedName.localeCompare(b.exportedName));
          }
          return group;
        });
      });

    return exports;
  }

  private getImports(ctx: RenderContext): Imports {
    type ModuleEntry = {
      group: ModuleImport;
      sortKey: SortKey;
    };

    const groups = new Map<SortGroup, Map<SortModule, ModuleEntry>>();

    for (const imp of ctx.file.imports) {
      const sortKey = moduleSortKey({
        file: ctx.file,
        fromFile: imp.from,
        preferFileExtension: this._module?.extension || '',
        root: ctx.project.root,
      });
      const modulePath = this._module?.resolve?.(sortKey[2], ctx) ?? sortKey[2];
      const [groupIndex] = sortKey;

      if (!groups.has(groupIndex)) groups.set(groupIndex, new Map());
      const moduleMap = groups.get(groupIndex)!;

      if (!moduleMap.has(modulePath)) {
        moduleMap.set(modulePath, {
          group: {
            imports: [],
            isTypeOnly: false,
            kind: imp.kind,
            modulePath,
          },
          sortKey,
        });
      }

      const entry = moduleMap.get(modulePath)!;
      const group = entry.group;

      if (imp.kind !== 'named') {
        group.isTypeOnly = imp.isTypeOnly;
        group.kind = imp.kind;
        group.localName = imp.localName;
      } else {
        group.imports.push(...imp.imports);
      }
    }

    const imports: Array<Array<ModuleImport>> = Array.from(groups.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([, moduleMap]) => {
        const entries = Array.from(moduleMap.values());

        entries.sort((a, b) => {
          const d = a.sortKey[1] - b.sortKey[1];
          return d !== 0 ? d : a.group.modulePath.localeCompare(b.group.modulePath);
        });

        return entries.map((e) => {
          const group = e.group;
          if (group.kind === 'namespace') {
            group.imports = [];
          } else {
            const isTypeOnly = !group.imports.find((imp) => !imp.isTypeOnly);
            if (isTypeOnly) {
              group.isTypeOnly = true;
              for (const imp of group.imports) {
                imp.isTypeOnly = false;
              }
            }
            group.imports.sort((a, b) => a.localName.localeCompare(b.localName));
          }
          return group;
        });
      });

    return imports;
  }
}
