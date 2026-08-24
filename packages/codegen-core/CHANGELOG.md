# @hey-api/codegen-core

## 0.9.2

### Patch Changes

- **symbols**: add `.dump()` method to registry ([#4161](https://github.com/hey-api/hey-api/pull/4161)) ([`6eb002b`](https://github.com/hey-api/hey-api/commit/6eb002b33275481acb011ab51e488378717b6b31)) by [@mrlubos](https://github.com/mrlubos)

- **perf**: speed up on large specs ([#4189](https://github.com/hey-api/hey-api/pull/4189)) ([`7d60829`](https://github.com/hey-api/hey-api/commit/7d608292d24284211f9221bf3e9a71dae4dfc8be)) by [@SukkaW](https://github.com/SukkaW)

- **dependencies**: remove ansi-colors and color-support ([#4291](https://github.com/hey-api/hey-api/pull/4291)) ([`88c346f`](https://github.com/hey-api/hey-api/commit/88c346fc7de4a5f9b6d22481018c8082e6dc2fad)) by [@Norbiros](https://github.com/Norbiros)

- **symbol**: support globals ([#4282](https://github.com/hey-api/hey-api/pull/4282)) ([`2a24c8d`](https://github.com/hey-api/hey-api/commit/2a24c8d3445fd861f93f0c168c4b35c856cea4df)) by [@mrlubos](https://github.com/mrlubos)

- **planner**: fix: use canonical symbols for dependencies ([#4154](https://github.com/hey-api/hey-api/pull/4154)) ([`fa7b039`](https://github.com/hey-api/hey-api/commit/fa7b039388b811facee8abff9d447e074f7aa789)) by [@pullfrog](https://github.com/apps/pullfrog)

## 0.9.1

### Patch Changes

- **utils**: tighten up object identity check ([`089ed2e`](https://github.com/hey-api/hey-api/commit/089ed2ed065ff92accb7d98cdeb95c66cf88f2f6)) by [@mrlubos](https://github.com/mrlubos)

- **symbol**: add priority field ([`7dbfe4e`](https://github.com/hey-api/hey-api/commit/7dbfe4e7d4a958389c63167c7dbbfa7254a787d1)) by [@mrlubos](https://github.com/mrlubos)

## 0.9.0

### Minor Changes

- **types**: rename `ProjectRenderMeta` to `ProjectMeta` and key it by language ([#3984](https://github.com/hey-api/hey-api/pull/3984)) ([`f4a0a12`](https://github.com/hey-api/hey-api/commit/f4a0a12a3c61b3b0dc8f4b0819fcbc42d20c1c0f)) by [@mrlubos](https://github.com/mrlubos)

### Patch Changes

- **symbol**: add event listeners ([#3998](https://github.com/hey-api/hey-api/pull/3998)) ([`88f7e9c`](https://github.com/hey-api/hey-api/commit/88f7e9c116397f0e76648d9a26bfc63003f01fc1)) by [@mrlubos](https://github.com/mrlubos)

- **utils**: expose `Version` class ([#3991](https://github.com/hey-api/hey-api/pull/3991)) ([`e870070`](https://github.com/hey-api/hey-api/commit/e8700705c2d613a10c8fb551d95bea826e3a5158)) by [@mrlubos](https://github.com/mrlubos)

## 0.8.4

### Patch Changes

- **node**: add `~dsl` property ([#3982](https://github.com/hey-api/hey-api/pull/3982)) ([`11f9324`](https://github.com/hey-api/hey-api/commit/11f9324a729a2db2f37c9f36a19c10b0d695e574)) by [@mrlubos](https://github.com/mrlubos)

## 0.8.3

### Patch Changes

- **symbol**: add `children` and `override` property ([#3945](https://github.com/hey-api/hey-api/pull/3945)) ([`13c3d7d`](https://github.com/hey-api/hey-api/commit/13c3d7d2be7a18ea72dff14e951841c843e3ea9a)) by [@mrlubos](https://github.com/mrlubos)

- **symbols**: export `pythonNameConflictResolver`, `SymbolChild`, `SymbolKind`, and `SymbolRegistry` ([#3945](https://github.com/hey-api/hey-api/pull/3945)) ([`13c3d7d`](https://github.com/hey-api/hey-api/commit/13c3d7d2be7a18ea72dff14e951841c843e3ea9a)) by [@mrlubos](https://github.com/mrlubos)

## 0.8.2

### Patch Changes

- **symbols**: fix: prefer recursive over top-level merging in registry ([#3917](https://github.com/hey-api/hey-api/pull/3917)) ([`ec2bdba`](https://github.com/hey-api/hey-api/commit/ec2bdba19e0afee59e9fb8bcbfeff837ee2535b1)) by [@SukkaW](https://github.com/SukkaW)

## 0.8.1

### Patch Changes

- **symbol**: speed up symbol registry cache ([#3823](https://github.com/hey-api/hey-api/pull/3823)) ([`b05bfd7`](https://github.com/hey-api/hey-api/commit/b05bfd7442203d768b831fccac5dfdeb4112ea6c)) by [@SukkaW](https://github.com/SukkaW)

- **planner**: speed up identifier conflict detector ([#3823](https://github.com/hey-api/hey-api/pull/3823)) ([`b05bfd7`](https://github.com/hey-api/hey-api/commit/b05bfd7442203d768b831fccac5dfdeb4112ea6c)) by [@SukkaW](https://github.com/SukkaW)

## 0.8.0

### Minor Changes

- **BREAKING**: This release bumps the minimum required Node version to 22.13. ([#3694](https://github.com/hey-api/hey-api/pull/3694)) ([`e930278`](https://github.com/hey-api/hey-api/commit/e930278d5fcd74545b0fc5d600b524e895d4fe6a)) by [@mrlubos](https://github.com/mrlubos)

## 0.7.4

### Patch Changes

- **planner**: language-aware declaration sharing check ([#3606](https://github.com/hey-api/hey-api/pull/3606)) ([`86c7115`](https://github.com/hey-api/hey-api/commit/86c71151671b00821746659fa3be715224a28894)) by [@mrlubos](https://github.com/mrlubos)

## 0.7.3

### Patch Changes

- **internal**: remove TypeScript from peer dependencies ([#3566](https://github.com/hey-api/hey-api/pull/3566)) ([`b5f1e4b`](https://github.com/hey-api/hey-api/commit/b5f1e4b5f64cbf0bad2eff888177ac9c1881ba3e)) by [@mrlubos](https://github.com/mrlubos)

### Updated Dependencies:

- @hey-api/types@0.1.4

## 0.7.2

### Patch Changes

- **log**: make group optional in warn method ([#3540](https://github.com/hey-api/hey-api/pull/3540)) ([`0512650`](https://github.com/hey-api/hey-api/commit/0512650988ce3c411492172e6bbe300f5440408f)) by [@mrlubos](https://github.com/mrlubos)

## 0.7.1

### Patch Changes

- **internal**: log symbol meta if name is falsy ([#3448](https://github.com/hey-api/hey-api/pull/3448)) ([`c50f7bc`](https://github.com/hey-api/hey-api/commit/c50f7bcf5676f2783a412288d243aeaeabd9f8bd)) by [@mrlubos](https://github.com/mrlubos)

## 0.7.0

### Minor Changes

- **BREAKING:** **symbol**: replace `exportFrom` array with `getExportFromFilePath()` function ([#3322](https://github.com/hey-api/hey-api/pull/3322)) ([`bfd43ec`](https://github.com/hey-api/hey-api/commit/bfd43ec6d638bfc97b6905dd9dee2c911ccea3e0)) by [@mrlubos](https://github.com/mrlubos)

### Updated Symbol interface

The `exportFrom` property has been replaced with the `getExportFromFilePath()` function. This allows you to dynamically determine export paths based on symbol properties. This is a low-level feature, so you're most likely unaffected.

## 0.6.1

### Patch Changes

- **planner**: fix duplicate import when same symbol is imported as both type and value ([#3291](https://github.com/hey-api/hey-api/pull/3291)) ([`3c08e38`](https://github.com/hey-api/hey-api/commit/3c08e38b4daa5c1f4829bdfb7f088d73b0e0f1f1)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

## 0.6.0

### Minor Changes

- **BREAKING**: Drop CommonJS (CJS) support. This package is now **ESM-only**. ([#3251](https://github.com/hey-api/hey-api/pull/3251)) ([`7f19d59`](https://github.com/hey-api/hey-api/commit/7f19d5921dadfa96ecae84a5298b7aee1daee56d)) by [@mrlubos](https://github.com/mrlubos)

### Removed CommonJS (CJS) support

`@hey-api/codegen-core` is now ESM-only. This change simplifies the codebase, improves tree-shaking, and enables better integration with modern bundlers and TypeScript tooling.

CommonJS entry points (`require()`, `module.exports`) are no longer supported. If you are in a CJS environment, you can still load the package dynamically using `import()` like:

```js
const { Project } = await import("@hey-api/codegen-core");
```

If you have previously written:

```js
const { Project } = require("@hey-api/codegen-core");
```

Migrate by updating your static imports:

```js
import { Project } from "@hey-api/codegen-core";
```

If your environment cannot use ESM, pin to a previous version.

### Patch Changes

### Updated Dependencies:

- @hey-api/types@0.1.3

## 0.5.5

### Patch Changes

- **config**: export `loadConfigFile` function (moved from `@hey-api/openapi-ts`) ([#3244](https://github.com/hey-api/hey-api/pull/3244)) ([`4f52bce`](https://github.com/hey-api/hey-api/commit/4f52bce79d8ac6573472f32a05b7f70913b90605)) by [@mrlubos](https://github.com/mrlubos)

### Updated Dependencies:

- @hey-api/types@0.1.2

## 0.5.4

### Patch Changes

- **internal**: move logger to codegen-core ([#3235](https://github.com/hey-api/hey-api/pull/3235)) ([`88532f0`](https://github.com/hey-api/hey-api/commit/88532f01200e1111818e82a4af7bd5cf8cf26e3b)) by [@mrlubos](https://github.com/mrlubos)

## 0.5.3

### Patch Changes

- **deps**: move @hey-api/types to dependencies to fix broken types ([#3232](https://github.com/hey-api/hey-api/pull/3232)) ([`edfce48`](https://github.com/hey-api/hey-api/commit/edfce4875cb9279d3ab8bfd438ff177e8ba7845c)) by [@mrlubos](https://github.com/mrlubos)

## 0.5.2

### Patch Changes

- **build**: do not minify bundles for better code readability and debugging ([#3186](https://github.com/hey-api/hey-api/pull/3186)) ([`4d46130`](https://github.com/hey-api/hey-api/commit/4d46130b53d9d8d5d3c178343a1b4fc3645b2628)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

## 0.5.1

### Patch Changes

- **project**: expose `.plan()` method ([#3175](https://github.com/hey-api/hey-api/pull/3175)) ([`b985053`](https://github.com/hey-api/hey-api/commit/b985053ffa64accc4ff01b7c0f301bb5cd84ff48)) by [@mrlubos](https://github.com/mrlubos)

## 0.5.0

### Minor Changes

- **core**: Structure API ([#3109](https://github.com/hey-api/hey-api/pull/3109)) ([`815a3de`](https://github.com/hey-api/hey-api/commit/815a3de0af434c28ac6d13ff92b85ce1fc146999)) by [@mrlubos](https://github.com/mrlubos)

### Patch Changes

- **types**: document default values for `importKind` and `kind` ([#3147](https://github.com/hey-api/hey-api/pull/3147)) ([`ab80a4b`](https://github.com/hey-api/hey-api/commit/ab80a4b2c37423c522aa864afbcb688db76615ba)) by [@mrlubos](https://github.com/mrlubos)

- **fix**: simplify symbol merging logic ([#3169](https://github.com/hey-api/hey-api/pull/3169)) ([`77bf81a`](https://github.com/hey-api/hey-api/commit/77bf81a13e49a13b6d052ef81e663df0f3b60b5a)) by [@mrlubos](https://github.com/mrlubos)

## 0.4.0

### Minor Changes

- **symbols**: remove `placeholder` property ([#2990](https://github.com/hey-api/hey-api/pull/2990)) ([`c3a81e8`](https://github.com/hey-api/hey-api/commit/c3a81e89ba5ed3f373409582c5f814e1d10cae06)) by [@mrlubos](https://github.com/mrlubos)

## 0.3.3

### Patch Changes

- fix: remove most of readonly properties to allow mutating in place ([#2919](https://github.com/hey-api/hey-api/pull/2919)) ([`34ee973`](https://github.com/hey-api/hey-api/commit/34ee973be30a9cbc66fd8463fe6f5961db0f3d37)) by [@mrlubos](https://github.com/mrlubos)

- fix: update types ([#2909](https://github.com/hey-api/hey-api/pull/2909)) ([`d9dd389`](https://github.com/hey-api/hey-api/commit/d9dd38927ce5c7901ce46bfe439454935b2053fa)) by [@mrlubos](https://github.com/mrlubos)

## 0.3.2

### Patch Changes

- feat: add `.query()` method to symbol registry ([#2873](https://github.com/hey-api/hey-api/pull/2873)) ([`1cfc8f2`](https://github.com/hey-api/hey-api/commit/1cfc8f2b4673b53e0b1fff43f3d2078dcd595ca2)) by [@mrlubos](https://github.com/mrlubos)

## 0.3.1

### Patch Changes

- feat: add `isRegistered()` method to file and symbol registry ([#2812](https://github.com/hey-api/hey-api/pull/2812)) ([`022f7dd`](https://github.com/hey-api/hey-api/commit/022f7dd0bcb74d2da855f393e2175645aa670351)) by [@mrlubos](https://github.com/mrlubos)

## 0.3.0

### Minor Changes

- feat: bump minimum Node version to 20.19.0 ([#2775](https://github.com/hey-api/hey-api/pull/2775)) ([`7c7702a`](https://github.com/hey-api/hey-api/commit/7c7702a9ed3bda0d75ef28d35d4284e3b6318b26)) by [@mrlubos](https://github.com/mrlubos)

## 0.2.0

### Minor Changes

- feat: Symbol API ([#2664](https://github.com/hey-api/hey-api/pull/2664)) ([`e1ede9c`](https://github.com/hey-api/hey-api/commit/e1ede9cabf52b5bbcb9195570deff58db8f43dbb)) by [@mrlubos](https://github.com/mrlubos)

## 0.1.0

### Minor Changes

- feat: expand Symbol API ([#2582](https://github.com/hey-api/hey-api/pull/2582)) ([`10aea89`](https://github.com/hey-api/hey-api/commit/10aea8910771ff72ef9b08d4eacdd6b028833c4c)) by [@mrlubos](https://github.com/mrlubos)

## 0.0.1

### Patch Changes

- feat: initial release
