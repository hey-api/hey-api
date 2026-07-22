import type { ISymbolMeta } from '../extensions';
import type { INode } from '../nodes/node';
import { Project } from '../project/project';
import { ref } from '../refs/refs';
import type { Symbol } from '../symbols/symbol';
import type { SymbolKind } from '../symbols/types';

/**
 * Creates a mock node for testing.
 */
const createMockNode = (args: {
  dependencies?: Array<Symbol>;
  filePath: string;
  language?: 'typescript' | 'javascript';
  meta?: ISymbolMeta;
  name: string;
  project: Project;
  symbolKind?: SymbolKind;
}): { node: INode; symbol: Symbol } => {
  const {
    dependencies = [],
    filePath,
    language = 'typescript',
    meta,
    name,
    project,
    symbolKind = 'var',
  } = args;

  const symbol = project.symbols.register({
    exported: true,
    getFilePath: () => filePath,
    kind: symbolKind,
    meta,
    name,
  });

  const node: INode = {
    analyze: (ctx) => {
      for (const dep of dependencies) {
        ctx.addDependency(ref(dep));
      }
    },
    clone() {
      return this;
    },
    exported: true,
    language,
    meta: {},
    name: ref(name) as INode['name'],
    scope: 'value',
    symbol,
    toAst: () => ({}),
    '~brand': 'test-node',
  };

  symbol.setNode(node);
  project.nodes.add(node);

  return { node, symbol };
};

describe('Planner imports deduplication', () => {
  it('produces a single value import when there is 1 imported symbol as value', () => {
    const project = new Project({ root: '/root' });

    // Create source file with exported symbol
    const { symbol: sourceSymbol } = createMockNode({
      filePath: 'source',
      name: 'MyValue',
      project,
      symbolKind: 'var',
    });

    // Create consumer file that imports the source symbol as value
    createMockNode({
      dependencies: [sourceSymbol],
      filePath: 'consumer',
      name: 'Consumer',
      project,
    });

    project.plan();

    const consumerFile = [...project.files.registered()].find((f) => f.name === 'consumer');
    expect(consumerFile).toBeDefined();

    const imports = consumerFile!.imports;
    expect(imports).toHaveLength(1);
    expect(imports[0]!.imports).toHaveLength(1);
    expect(imports[0]!.imports[0]!.isTypeOnly).toBe(false);
    expect(imports[0]!.imports[0]!.localName).toBe('MyValue');
  });

  it('produces a single type import when there is 1 imported symbol as type', () => {
    const project = new Project({ root: '/root' });

    // Create source file with exported type symbol
    const { symbol: sourceSymbol } = createMockNode({
      filePath: 'source',
      name: 'MyType',
      project,
      symbolKind: 'type',
    });

    // Create consumer file that imports the source symbol as type
    createMockNode({
      dependencies: [sourceSymbol],
      filePath: 'consumer',
      name: 'Consumer',
      project,
    });

    project.plan();

    const consumerFile = [...project.files.registered()].find((f) => f.name === 'consumer');
    expect(consumerFile).toBeDefined();

    const imports = consumerFile!.imports;
    expect(imports).toHaveLength(1);
    expect(imports[0]!.imports).toHaveLength(1);
    expect(imports[0]!.imports[0]!.isTypeOnly).toBe(true);
    expect(imports[0]!.imports[0]!.localName).toBe('MyType');
  });

  it('produces a single value import when there are 2 imported symbols as values with same name', () => {
    const project = new Project({ root: '/root' });

    // Create source file with exported symbol
    const { symbol: sourceSymbol } = createMockNode({
      filePath: 'source',
      name: 'MyValue',
      project,
      symbolKind: 'var',
    });

    // Create consumer file that imports the source symbol twice as value
    const consumerSymbol = project.symbols.register({
      exported: true,
      getFilePath: () => 'consumer',
      kind: 'var',
      name: 'Consumer',
    });
    const consumerNode: INode = {
      analyze: (ctx) => {
        ctx.addDependency(ref(sourceSymbol));
        ctx.addDependency(ref(sourceSymbol));
      },
      clone() {
        return this;
      },
      exported: true,
      language: 'typescript',
      meta: {},
      name: ref('Consumer') as INode['name'],
      scope: 'value',
      symbol: consumerSymbol,
      toAst: () => ({}),
      '~brand': 'test-node',
    };
    consumerSymbol.setNode(consumerNode);
    project.nodes.add(consumerNode);

    project.plan();

    const consumerFile = [...project.files.registered()].find((f) => f.name === 'consumer');
    expect(consumerFile).toBeDefined();

    const imports = consumerFile!.imports;
    expect(imports).toHaveLength(1);
    expect(imports[0]!.imports).toHaveLength(1);
    expect(imports[0]!.imports[0]!.isTypeOnly).toBe(false);
    expect(imports[0]!.imports[0]!.localName).toBe('MyValue');
  });

  it('produces a single type import when there are 2 imported symbols as types with same name', () => {
    const project = new Project({ root: '/root' });

    // Create source file with exported type symbol
    const { symbol: sourceSymbol } = createMockNode({
      filePath: 'source',
      name: 'MyType',
      project,
      symbolKind: 'type',
    });

    // Create consumer file that imports the source symbol twice as type
    const consumerSymbol = project.symbols.register({
      exported: true,
      getFilePath: () => 'consumer',
      kind: 'var',
      name: 'Consumer',
    });
    const consumerNode: INode = {
      analyze: (ctx) => {
        ctx.addDependency(ref(sourceSymbol));
        ctx.addDependency(ref(sourceSymbol));
      },
      clone() {
        return this;
      },
      exported: true,
      language: 'typescript',
      meta: {},
      name: ref('Consumer') as INode['name'],
      scope: 'value',
      symbol: consumerSymbol,
      toAst: () => ({}),
      '~brand': 'test-node',
    };
    consumerSymbol.setNode(consumerNode);
    project.nodes.add(consumerNode);

    project.plan();

    const consumerFile = [...project.files.registered()].find((f) => f.name === 'consumer');
    expect(consumerFile).toBeDefined();

    const imports = consumerFile!.imports;
    expect(imports).toHaveLength(1);
    expect(imports[0]!.imports).toHaveLength(1);
    expect(imports[0]!.imports[0]!.isTypeOnly).toBe(true);
    expect(imports[0]!.imports[0]!.localName).toBe('MyType');
  });

  it('produces a single value import when there are 2 imported symbols, 1 as type and 1 as value, with same name', () => {
    const project = new Project({ root: '/root' });

    // Create source file with exported type symbol
    const { symbol: typeSymbol } = createMockNode({
      filePath: 'source',
      name: 'MySymbol',
      project,
      symbolKind: 'type',
    });

    // Create source file with exported value symbol with same name
    const { symbol: valueSymbol } = createMockNode({
      filePath: 'source',
      name: 'MySymbol',
      project,
      symbolKind: 'var',
    });

    // Create consumer file that imports both symbols (type and value with same name)
    const consumerSymbol = project.symbols.register({
      exported: true,
      getFilePath: () => 'consumer',
      kind: 'var',
      name: 'Consumer',
    });
    const consumerNode: INode = {
      analyze: (ctx) => {
        ctx.addDependency(ref(typeSymbol));
        ctx.addDependency(ref(valueSymbol));
      },
      clone() {
        return this;
      },
      exported: true,
      language: 'typescript',
      meta: {},
      name: ref('Consumer') as INode['name'],
      scope: 'value',
      symbol: consumerSymbol,
      toAst: () => ({}),
      '~brand': 'test-node',
    };
    consumerSymbol.setNode(consumerNode);
    project.nodes.add(consumerNode);

    project.plan();

    const consumerFile = [...project.files.registered()].find((f) => f.name === 'consumer');
    expect(consumerFile).toBeDefined();

    const imports = consumerFile!.imports;
    expect(imports).toHaveLength(1);
    expect(imports[0]!.imports).toHaveLength(1);
    expect(imports[0]!.imports[0]!.isTypeOnly).toBe(false);
    expect(imports[0]!.imports[0]!.localName).toBe('MySymbol');
  });
});

describe('Planner with global symbols', () => {
  it('resolves a global symbol to its name and emits no import', () => {
    const project = new Project({ root: '/root' });

    const globalSymbol = project.symbols.register({
      global: true,
      name: 'Temporal',
    });

    createMockNode({
      dependencies: [globalSymbol],
      filePath: 'consumer',
      name: 'Consumer',
      project,
    });

    project.plan();

    const consumerFile = [...project.files.registered()].find((f) => f.name === 'consumer');
    expect(consumerFile).toBeDefined();

    expect(globalSymbol.finalName).toBe('Temporal');
    expect(globalSymbol.file).toBeUndefined();
    expect(consumerFile!.imports).toHaveLength(0);
  });

  it('reserves the global name so a local symbol cannot shadow it', () => {
    const project = new Project({ root: '/root' });

    const globalSymbol = project.symbols.register({
      global: true,
      name: 'Temporal',
    });

    const { symbol: localSymbol } = createMockNode({
      dependencies: [globalSymbol],
      filePath: 'consumer',
      name: 'Temporal',
      project,
    });

    project.plan();

    const consumerFile = [...project.files.registered()].find((f) => f.name === 'consumer');
    expect(consumerFile).toBeDefined();

    expect(globalSymbol.finalName).toBe('Temporal');
    expect(localSymbol.finalName).not.toBe('Temporal');
    expect(consumerFile!.imports).toHaveLength(0);
  });
});

describe('Planner with stub symbols', () => {
  it('does not throw when a dependency is a canonicalized stub', () => {
    const project = new Project({ root: '/root' });

    const sharedMeta = { key: 'stub-reference' };
    const stub = project.symbols.reference(sharedMeta);

    const { symbol: sourceSymbol } = createMockNode({
      filePath: 'source',
      meta: sharedMeta,
      name: 'Real',
      project,
      symbolKind: 'type',
    });

    expect(stub.canonical).toBe(sourceSymbol);

    createMockNode({
      dependencies: [stub],
      filePath: 'consumer',
      name: 'Consumer',
      project,
      symbolKind: 'type',
    });

    expect(() => project.plan()).not.toThrow();

    const consumerFile = [...project.files.registered()].find((f) => f.name === 'consumer');
    expect(consumerFile).toBeDefined();

    const sourceFile = sourceSymbol.file;
    expect(sourceFile).toBeDefined();
    expect(consumerFile!.imports).toHaveLength(1);
    expect(consumerFile!.imports[0]!.from).toBe(sourceFile);

    // the canonical symbol received the import, not the stub
    expect(sourceSymbol.imports).toHaveLength(1);
    expect(sourceSymbol.imports[0]!.file).toBe(consumerFile);
  });
});
