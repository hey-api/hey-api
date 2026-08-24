# @hey-api/json-schema-ref-parser

## 1.4.5

### Patch Changes

- **bundler**: fix: merge multiple Swagger 2.0 definitions ([#4230](https://github.com/hey-api/hey-api/pull/4230)) ([`28b702f`](https://github.com/hey-api/hey-api/commit/28b702f4cac19590197a07f318a08370c8243486)) by [@pullfrog](https://github.com/apps/pullfrog)

- **merge**: fix: use synthetic root path ([#4147](https://github.com/hey-api/hey-api/pull/4147)) ([`2953324`](https://github.com/hey-api/hey-api/commit/2953324c30830a424022da7ff7d2e5bd73d9a9c5)) by [@pullfrog](https://github.com/apps/pullfrog)

## 1.4.4

### Patch Changes

- **package**: remove `cjs` from files array ([`3b4ee7a`](https://github.com/hey-api/hey-api/commit/3b4ee7a5d3fd454aa8416ad1ed4a565119632be1)) by [@mrlubos](https://github.com/mrlubos)

- \*_parser_: fix: delete unresolvable `$ref` keywords ([#4087](https://github.com/hey-api/hey-api/pull/4087)) ([`6c21d81`](https://github.com/hey-api/hey-api/commit/6c21d818f95d5ecf324d35fd96a4b18941e26546)) by [@pullfrog](https://github.com/apps/pullfrog)

## 1.4.3

### Patch Changes

- **bundle**: fix: name whole-file `$ref`s after the source filename ([#3936](https://github.com/hey-api/hey-api/pull/3936)) ([`4219ae5`](https://github.com/hey-api/hey-api/commit/4219ae5a8e4a2135afc09dab23e9bc401c7b9628)) by [@matthewjamesadam](https://github.com/matthewjamesadam)

## 1.4.2

### Patch Changes

- **yaml**: swap `yaml` back to `js-yaml` ([#3843](https://github.com/hey-api/hey-api/pull/3843)) ([`c1b6ac1`](https://github.com/hey-api/hey-api/commit/c1b6ac1d03e0d6010fc834cfeabf7abe491de9a2)) by [@pullfrog](https://github.com/apps/pullfrog)

## 1.4.1

### Patch Changes

- **parser**: fix: avoid encoding url unsafe characters ([#3782](https://github.com/hey-api/hey-api/pull/3782)) ([`290c14f`](https://github.com/hey-api/hey-api/commit/290c14fba3c104a6e820eaa981b29c3b6a378e16)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

## 1.4.0

### Minor Changes

- **BREAKING**: This release bumps the minimum required Node version to 22.13. ([#3694](https://github.com/hey-api/hey-api/pull/3694)) ([`e930278`](https://github.com/hey-api/hey-api/commit/e930278d5fcd74545b0fc5d600b524e895d4fe6a)) by [@mrlubos](https://github.com/mrlubos)

### Patch Changes

- **internal**: export errors ([#3679](https://github.com/hey-api/hey-api/pull/3679)) ([`b643d7d`](https://github.com/hey-api/hey-api/commit/b643d7d400492489a24918534991dfb3f1443abc)) by [@mrlubos](https://github.com/mrlubos)

## 1.3.1

### Patch Changes

- **parser**: prefer unprefixed schema names from external files ([#3417](https://github.com/hey-api/hey-api/pull/3417)) ([`f3a264b`](https://github.com/hey-api/hey-api/commit/f3a264b2c5d7af06bb44fa0350ef613bde3aff87)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **parser**: fix: resolve sibling schemas from external files during bundling ([#3422](https://github.com/hey-api/hey-api/pull/3422)) ([`19fd80a`](https://github.com/hey-api/hey-api/commit/19fd80aff26b1198d6838d48357702c39ad05501)) by [@j-westover](https://github.com/j-westover)

- **input**: fix: avoid prefixing sources if paths do not collide on operations ([#3436](https://github.com/hey-api/hey-api/pull/3436)) ([`b1a419a`](https://github.com/hey-api/hey-api/commit/b1a419a835c312a1f8bf36a5b781109368041220)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

## 1.3.0

### Minor Changes

- **feat**: clean up dependencies ([#3386](https://github.com/hey-api/hey-api/pull/3386)) ([`e979b78`](https://github.com/hey-api/hey-api/commit/e979b789a052f7bbcfe4474ff8db2f733e23f2bb)) by [@mrlubos](https://github.com/mrlubos)

### Patch Changes

- **fix**: pass seen references through crawl stack ([#3387](https://github.com/hey-api/hey-api/pull/3387)) ([`072a9ae`](https://github.com/hey-api/hey-api/commit/072a9ae7f336d5c3e5d70085ded21366eeed186d)) by [@mrlubos](https://github.com/mrlubos)
