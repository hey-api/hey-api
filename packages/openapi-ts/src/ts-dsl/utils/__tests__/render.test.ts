import type { RenderContext } from '@hey-api/codegen-core';
import { Project } from '@hey-api/codegen-core';

import { ts } from '../../../ts-compiler';
import type { TsDsl } from '../../../ts-dsl';
import { TypeScriptRenderer } from '../render';
import type { ModuleExport, ModuleImport } from '../render-utils';

describe('TypeScriptRenderer', () => {
  const renderer = new TypeScriptRenderer();

  const mockFile = (overrides: any = {}) => ({
    exports: [],
    imports: [],
    language: 'typescript',
    nodes: [],
    ...overrides,
  });

  const mockCtx = (fileOverrides = {}, projectOverrides = {}): RenderContext<TsDsl> => ({
    file: mockFile(fileOverrides),
    project: new Project({
      root: '/root',
      ...projectOverrides,
    }),
  });

  it('supports() returns true only for typescript files', () => {
    expect(renderer.supports(mockCtx({ language: 'typescript' }))).toBe(true);
    expect(renderer.supports(mockCtx({ language: 'javascript' }))).toBe(false);
  });

  it('renderImport() generates named and namespace imports correctly', () => {
    const group: ModuleImport = {
      imports: [
        {
          isTypeOnly: false,
          localName: 'A',
          sourceName: 'A',
        },
      ],
      isTypeOnly: false,
      kind: 'named',
      localName: undefined,
      modulePath: 'foo',
    };
    const node = TypeScriptRenderer.toImportAst(group);
    expect(ts.isImportDeclaration(node)).toBe(true);
  });

  it('renderExport() generates named and namespace exports correctly', () => {
    const group: ModuleExport = {
      canExportAll: false,
      exports: [
        {
          exportedName: 'B',
          isTypeOnly: false,
          kind: 'named',
          sourceName: 'B',
        },
      ],
      isTypeOnly: false,
      modulePath: 'bar',
      namespaceExport: undefined,
    };
    const node = TypeScriptRenderer.toExportAst(group);
    expect(ts.isExportDeclaration(node)).toBe(true);
  });
});
