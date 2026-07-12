# CLAUDE.md

OpenAPI TypeScript is a CLI tool and library for generating TypeScript clients, SDKs, validators, and schemas from OpenAPI specifications. This is a monorepo built with pnpm workspaces, Turbo build orchestration, and TypeScript.

## Quick Reference

```bash
pnpm install                          # Install dependencies
pnpm build --filter="@hey-api/**"     # Build packages only
pnpm build                            # Build everything (packages + examples + docs)
pnpm test                             # Run all tests
pnpm typecheck                        # Type check all packages
pnpm lint                             # Check formatting (oxfmt) + linting (oxlint)
pnpm lint:fix                         # Auto-fix formatting and linting
pnpm format                           # Format with oxfmt
```

### Shortcuts

```bash
pnpm tt -- @hey-api/openapi-ts        # Test specific package
pnpm tw -- @hey-api/openapi-ts        # Test watch specific package
pnpm tu -- @hey-api/openapi-ts        # Update test snapshots
pnpm tb -- @hey-api/openapi-ts        # Build specific package
pnpm ty -- @hey-api/openapi-ts        # Typecheck specific package
```

### Development

```bash
pnpm dev:ts                           # Watch mode for openapi-ts (runs from dev/)
pnpm dev:py                           # Watch mode for openapi-python (runs from dev/)
```

## Build Timing

**Do not cancel build commands** - they take significant time:

- `pnpm install`: ~1m 20s
- `pnpm build --filter="@hey-api/**"`: ~2m 15s
- `pnpm build` (full): ~5+ minutes
- `pnpm test`: ~1m 5s
- `pnpm typecheck`: ~1m 20s
- `pnpm lint`: ~35s

Set timeouts accordingly (180s+ for builds, 120s+ for tests/typecheck).

## Repository Structure

```
packages/
  openapi-ts/          # Main CLI tool and library
  openapi-python/      # Python DSL generation
  codegen-core/        # Core code generation utilities
  shared/              # Cross-package utilities (migrating out)
  types/               # Shared type definitions
  custom-client/       # Custom HTTP client implementations
  nuxt/                # Nuxt.js integration
  vite-plugin/         # Vite plugin
  config-vite-base/    # Shared Vite base configuration
  openapi-ts-tests/    # Test utilities and snapshots
examples/              # 16+ framework-specific examples
dev/                   # Development environment (CLI testing configs)
specs/                 # OpenAPI test specifications
scripts/               # Build and test scripts
web/                   # Astro website
```

## Tooling

- **Package manager**: pnpm 10.28.2 (strict engine, exact versions)
- **Node**: >=22.18.0 (see .nvmrc for exact version)
- **Build**: Turbo 2.8.0 + tsdown + Rollup
- **Language**: TypeScript 5.9.3, ESM only
- **Formatter**: oxfmt 0.27.0 (single quotes via .oxfmtrc.json)
- **Linter**: Oxlint with eslint, typescript, and oxc plugins; simple-import-sort, sort-destructure-keys, and typescript-sort-keys loaded as JS plugins
- **Tests**: Vitest 3.2.4
- **Pre-commit**: Husky + lint-staged (runs `pnpm format` + `pnpm lint:fix`)
- **Python** (for openapi-python): Python >=3.10, mypy, ruff, line length 120
- **Releases**: Changesets

## Code Conventions

- ESM modules only (`.mts`/`.mjs` extensions in builds)
- UTF-8, LF line endings, 2-space indentation
- Single quotes (enforced by oxfmt)
- Imports sorted by eslint-plugin-simple-import-sort (via Oxlint `jsPlugins`)
- Object/interface keys sorted alphabetically
- Destructured keys sorted alphabetically

## Refactoring Guidelines

When refactoring existing code:

- **Preserve all JSDoc comments** - Read the original file first and keep all existing documentation
- **Match existing code patterns** - Look at similar files in the codebase for conventions
- **Prefer `edit` over `write`** - Making targeted edits preserves comments better than rewriting files
- **Check reference implementations** - For plugin work, use Valibot as a reference for proper patterns

## Pre-commit Checklist

Run before committing (Husky runs format + lint automatically, but also verify):

```bash
pnpm lint:fix       # Auto-fix formatting and linting
pnpm typecheck      # Type check
pnpm test           # Run tests
```

Some linting warnings in `.gen/snapshots/` directories are expected for generated code.

## Git Conventions

- **Branch naming**: `feat/`, `fix/`, `chore/`, `refactor/`, `docs/` prefixes
- **Commit messages**: Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `ci:`, `docs:`)
- **Releases**: Changesets-based, auto-publish on merge to main

## Known Issues

- Some tests may fail in sandboxed environments due to network restrictions (OpenAPI spec downloads)
- Generated test files in `packages/openapi-ts-tests/` may have expected linting warnings
