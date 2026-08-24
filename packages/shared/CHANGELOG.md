# @hey-api/shared

## 0.5.1

### Patch Changes

- **perf**: speed up on large specs ([#4189](https://github.com/hey-api/hey-api/pull/4189)) ([`7d60829`](https://github.com/hey-api/hey-api/commit/7d608292d24284211f9221bf3e9a71dae4dfc8be)) by [@SukkaW](https://github.com/SukkaW)

- **dependencies**: remove ansi-colors ([#4291](https://github.com/hey-api/hey-api/pull/4291)) ([`88c346f`](https://github.com/hey-api/hey-api/commit/88c346fc7de4a5f9b6d22481018c8082e6dc2fad)) by [@Norbiros](https://github.com/Norbiros)

- **symbol**: support globals ([#4282](https://github.com/hey-api/hey-api/pull/4282)) ([`2a24c8d`](https://github.com/hey-api/hey-api/commit/2a24c8d3445fd861f93f0c168c4b35c856cea4df)) by [@mrlubos](https://github.com/mrlubos)

- **utils**: preserve whitespace in comment lines ([#4286](https://github.com/hey-api/hey-api/pull/4286)) ([`6af94a3`](https://github.com/hey-api/hey-api/commit/6af94a3bb6da43b6be1dfd4b88a2613913750abe)) by [@mrlubos](https://github.com/mrlubos)

- **dependencies**: replace semver with verkit ([#4293](https://github.com/hey-api/hey-api/pull/4293)) ([`181eb78`](https://github.com/hey-api/hey-api/commit/181eb78241680163e44c46079ec57d5c51367ebd)) by [@Norbiros](https://github.com/Norbiros)

### Updated Dependencies:

- @hey-api/json-schema-ref-parser@1.4.5
- @hey-api/codegen-core@0.9.2
- @hey-api/spec-types@0.2.1

## 0.5.0

### Minor Changes

- **plugin**: remove `.querySymbols()` method ([#4067](https://github.com/hey-api/hey-api/pull/4067)) ([`4d49551`](https://github.com/hey-api/hey-api/commit/4d495516bbace683fc22afd53743eaf642fc3be1)) by [@mrlubos](https://github.com/mrlubos)

- **plugin**: rename `symbols` to `imports` ([#4052](https://github.com/hey-api/hey-api/pull/4052)) ([`57fac5e`](https://github.com/hey-api/hey-api/commit/57fac5ef22bca2b4ac47c8df136270f967f85ed1)) by [@mrlubos](https://github.com/mrlubos)

- **BREAKING** **plugin**: remove `registerSymbol()` function ([#4078](https://github.com/hey-api/hey-api/pull/4078)) ([`4ee65d5`](https://github.com/hey-api/hey-api/commit/4ee65d52f31176b7a2bae87a27ed4e478c2eb447)) by [@mrlubos](https://github.com/mrlubos)

### Removed `plugin.registerSymbol()` function

This function was an alias for `plugin.symbol()` accepting a single argument. It has been removed in favor of `plugin.symbol()` which can now also accept a single argument.

- **parser**: improve discriminator handling ([`680b947`](https://github.com/hey-api/hey-api/commit/680b94766855232fdfe8cf34029224c3900821f8)) by [@mrlubos](https://github.com/mrlubos)

- **BREAKING** **utils**: remove `warnOnConflictingDuplicatePlugins` export ([`089ed2e`](https://github.com/hey-api/hey-api/commit/089ed2ed065ff92accb7d98cdeb95c66cf88f2f6)) by [@mrlubos](https://github.com/mrlubos)

- **BREAKING** **plugin**: remove `.external()` method ([#4052](https://github.com/hey-api/hey-api/pull/4052)) ([`57fac5e`](https://github.com/hey-api/hey-api/commit/57fac5ef22bca2b4ac47c8df136270f967f85ed1)) by [@mrlubos](https://github.com/mrlubos)

- **BREAKING** **plugin**: rename `.symbols` to `.imports` ([#4052](https://github.com/hey-api/hey-api/pull/4052)) ([`57fac5e`](https://github.com/hey-api/hey-api/commit/57fac5ef22bca2b4ac47c8df136270f967f85ed1)) by [@mrlubos](https://github.com/mrlubos)

### Patch Changes

- **config**: handle array values in `$dependencies` ([#4114](https://github.com/hey-api/hey-api/pull/4114)) ([`835c230`](https://github.com/hey-api/hey-api/commit/835c2304843be396e1e799b260868af56239d5ba)) by [@mrlubos](https://github.com/mrlubos)

- **config**: add Presets API ([`3b4ee7a`](https://github.com/hey-api/hey-api/commit/3b4ee7a5d3fd454aa8416ad1ed4a565119632be1)) by [@mrlubos](https://github.com/mrlubos)

- **utils**: export `deepMerge`, `resolvePlugins` methods, `PluginResolutionInput`, `PluginResolutionResult` types ([`089ed2e`](https://github.com/hey-api/hey-api/commit/089ed2ed065ff92accb7d98cdeb95c66cf88f2f6)) by [@mrlubos](https://github.com/mrlubos)

- **plugin**: add `outerOptional` option to `RequestSchemaContext` ([`11315c7`](https://github.com/hey-api/hey-api/commit/11315c763a6a8ba9f7b2396466bfaf5a9e257fee)) by [@mrlubos](https://github.com/mrlubos)

- **utils**: export `getBaseUrl()` function ([#3772](https://github.com/hey-api/hey-api/pull/3772)) ([`4026955`](https://github.com/hey-api/hey-api/commit/4026955318aed9282b46464b15a75ab1cdc7243a)) by [@mrlubos](https://github.com/mrlubos)

- **symbol**: add implicit priority ([`7dbfe4e`](https://github.com/hey-api/hey-api/commit/7dbfe4e7d4a958389c63167c7dbbfa7254a787d1)) by [@mrlubos](https://github.com/mrlubos)

- **utils**: export discriminator utilities ([`680b947`](https://github.com/hey-api/hey-api/commit/680b94766855232fdfe8cf34029224c3900821f8)) by [@mrlubos](https://github.com/mrlubos)

- **plugin**: add `symbolMeta` field ([#4051](https://github.com/hey-api/hey-api/pull/4051)) ([`51818a7`](https://github.com/hey-api/hey-api/commit/51818a70af3a8d3641e2c7a958c5d23cab42f45a)) by [@mrlubos](https://github.com/mrlubos)

- **api**: replace `~` fields with `$` ([#4086](https://github.com/hey-api/hey-api/pull/4086)) ([`d5ca286`](https://github.com/hey-api/hey-api/commit/d5ca286729e8b881387d5a7ac9234512af58dcd4)) by [@mrlubos](https://github.com/mrlubos)

- **utils**: export `pluginHelper()` function ([#4076](https://github.com/hey-api/hey-api/pull/4076)) ([`93129b7`](https://github.com/hey-api/hey-api/commit/93129b7f5d9d2d45c46161f22b7d7945f95b7a58)) by [@mrlubos](https://github.com/mrlubos)

### Updated Dependencies:

- @hey-api/json-schema-ref-parser@1.4.4
- @hey-api/codegen-core@0.9.1

## 0.4.8

### Patch Changes

- **types**: update project meta types ([#3984](https://github.com/hey-api/hey-api/pull/3984)) ([`f4a0a12`](https://github.com/hey-api/hey-api/commit/f4a0a12a3c61b3b0dc8f4b0819fcbc42d20c1c0f)) by [@mrlubos](https://github.com/mrlubos)

- **utils**: expose `SymbolFactory` ([#3991](https://github.com/hey-api/hey-api/pull/3991)) ([`e870070`](https://github.com/hey-api/hey-api/commit/e8700705c2d613a10c8fb551d95bea826e3a5158)) by [@mrlubos](https://github.com/mrlubos)

### Updated Dependencies:

- @hey-api/codegen-core@0.9.0

## 0.4.7

### Patch Changes

- **plugin**: add generics support to `querySymbol()` and `querySymbols()` ([#3982](https://github.com/hey-api/hey-api/pull/3982)) ([`11f9324`](https://github.com/hey-api/hey-api/commit/11f9324a729a2db2f37c9f36a19c10b0d695e574)) by [@mrlubos](https://github.com/mrlubos)

### Updated Dependencies:

- @hey-api/codegen-core@0.8.4

## 0.4.6

### Patch Changes

- **parser**: fix: preserve sort order when filtering input ([#3953](https://github.com/hey-api/hey-api/pull/3953)) ([`f6e8496`](https://github.com/hey-api/hey-api/commit/f6e8496626b007341a1c6653dba1d6452ae038ec)) by [@pullfrog](https://github.com/apps/pullfrog)

- **plugin**: do not stamp external symbols ([#3942](https://github.com/hey-api/hey-api/pull/3942)) ([`6448780`](https://github.com/hey-api/hey-api/commit/6448780847d7e0748d7894fec7f918e090f470db)) by [@mrlubos](https://github.com/mrlubos)

- **parser**: fix: expose `key` on security schemes when their signatures collide ([#3935](https://github.com/hey-api/hey-api/pull/3935)) ([`b74539e`](https://github.com/hey-api/hey-api/commit/b74539ea0a7e81b40e0c27da68a0f7db6baf449d)) by [@matthewjamesadam](https://github.com/matthewjamesadam)

- **plugin**: export `coerce`, `defineConfig`, `Coercer`, `CoercerMap`, `ConfigTable`, `PluginSymbols`, `PluginTag`, `TableDirectives`, and `WithCoercers` ([#3927](https://github.com/hey-api/hey-api/pull/3927)) ([`d93e1ef`](https://github.com/hey-api/hey-api/commit/d93e1efe58ae14ce8e224e8d7c3c0bd716fef181)) by [@mrlubos](https://github.com/mrlubos)

- **config**: `valueToObject` is recursive ([#3927](https://github.com/hey-api/hey-api/pull/3927)) ([`d93e1ef`](https://github.com/hey-api/hey-api/commit/d93e1efe58ae14ce8e224e8d7c3c0bd716fef181)) by [@mrlubos](https://github.com/mrlubos)

- **plugin**: add `symbols` property ([#3942](https://github.com/hey-api/hey-api/pull/3942)) ([`6448780`](https://github.com/hey-api/hey-api/commit/6448780847d7e0748d7894fec7f918e090f470db)) by [@mrlubos](https://github.com/mrlubos)

### Updated Dependencies:

- @hey-api/codegen-core@0.8.3
- @hey-api/json-schema-ref-parser@1.4.3

## 0.4.5

### Patch Changes

- **types**: export `ResolverNodes` type on `Plugin` ([#3907](https://github.com/hey-api/hey-api/pull/3907)) ([`3aabff2`](https://github.com/hey-api/hey-api/commit/3aabff24719d7e5ed82ce9b0ba64a9d8050e94c2)) by [@mrlubos](https://github.com/mrlubos)

- **plugin**: expose getHooks method ([#3913](https://github.com/hey-api/hey-api/pull/3913)) ([`7c330bc`](https://github.com/hey-api/hey-api/commit/7c330bcc6bc1849aba979e1028a7d5e9dd97e0dd)) by [@mrlubos](https://github.com/mrlubos)

- **fix**: various performance improvements ([#3917](https://github.com/hey-api/hey-api/pull/3917)) ([`ec2bdba`](https://github.com/hey-api/hey-api/commit/ec2bdba19e0afee59e9fb8bcbfeff837ee2535b1)) by [@SukkaW](https://github.com/SukkaW)

- **utils**: turn on `enabled` flag in `mappers` ([#3827](https://github.com/hey-api/hey-api/pull/3827)) ([`1aa4785`](https://github.com/hey-api/hey-api/commit/1aa47851422dece48d103ad018759fea8151cb38)) by [@inas-sirhan](https://github.com/inas-sirhan)

- **parser**: fix: encode special characters in JSON Pointer ([#3903](https://github.com/hey-api/hey-api/pull/3903)) ([`e6c66b0`](https://github.com/hey-api/hey-api/commit/e6c66b0d009d38a4c68ec5724c23bef8ae836fb4)) by [@aqeelat](https://github.com/aqeelat)

### Updated Dependencies:

- @hey-api/codegen-core@0.8.2

## 0.4.4

### Patch Changes

- **plugin**: add `querySymbols()` function ([#3884](https://github.com/hey-api/hey-api/pull/3884)) ([`abc8ceb`](https://github.com/hey-api/hey-api/commit/abc8ceb43f37e7c9739fe010d3fcdb3be0bb5290)) by [@mrlubos](https://github.com/mrlubos)

## 0.4.3

### Patch Changes

### Updated Dependencies:

- @hey-api/json-schema-ref-parser@1.4.2

## 0.4.2

### Patch Changes

- **utils**: speed up deep equality check ([#3823](https://github.com/hey-api/hey-api/pull/3823)) ([`b05bfd7`](https://github.com/hey-api/hey-api/commit/b05bfd7442203d768b831fccac5dfdeb4112ea6c)) by [@SukkaW](https://github.com/SukkaW)

- **graph**: speed up graph builder ([#3823](https://github.com/hey-api/hey-api/pull/3823)) ([`b05bfd7`](https://github.com/hey-api/hey-api/commit/b05bfd7442203d768b831fccac5dfdeb4112ea6c)) by [@SukkaW](https://github.com/SukkaW)

### Updated Dependencies:

- @hey-api/codegen-core@0.8.1

## 0.4.1

### Patch Changes

- **parser**: fix: re-add implicitly-filtered schemas in collectOperations ([#3791](https://github.com/hey-api/hey-api/pull/3791)) ([`0d3cb9f`](https://github.com/hey-api/hey-api/commit/0d3cb9f49b9f1d9fa5b47b73a2c85141c0cd78b6)) by [@sbs44](https://github.com/sbs44)

- **parser**: fix: avoid encoding url unsafe characters ([#3782](https://github.com/hey-api/hey-api/pull/3782)) ([`290c14f`](https://github.com/hey-api/hey-api/commit/290c14fba3c104a6e820eaa981b29c3b6a378e16)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **output**: fix: surface postprocess errors ([#3683](https://github.com/hey-api/hey-api/pull/3683)) ([`e69d79f`](https://github.com/hey-api/hey-api/commit/e69d79f0d7de8a0a2f955457a522b88f505ae80d)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **config**: warn on duplicated plugin configurations ([#3753](https://github.com/hey-api/hey-api/pull/3753)) ([`e78ce75`](https://github.com/hey-api/hey-api/commit/e78ce75bcc63374cd9ec4178bfe18a2e09ca128d)) by [@inas-sirhan](https://github.com/inas-sirhan)

### Updated Dependencies:

- @hey-api/json-schema-ref-parser@1.4.1

## 0.4.0

### Minor Changes

- **BREAKING**: This release bumps the minimum required Node version to 22.13. ([#3694](https://github.com/hey-api/hey-api/pull/3694)) ([`e930278`](https://github.com/hey-api/hey-api/commit/e930278d5fcd74545b0fc5d600b524e895d4fe6a)) by [@mrlubos](https://github.com/mrlubos)

### Patch Changes

- **parser**: fix: keep orphans when explicitly included in filters ([#3714](https://github.com/hey-api/hey-api/pull/3714)) ([`8e2c4b1`](https://github.com/hey-api/hey-api/commit/8e2c4b1f2a1624f27d5da74a4816cdc10435e4b1)) by [@mrlubos](https://github.com/mrlubos)

- **error**: handle InputError ([#3679](https://github.com/hey-api/hey-api/pull/3679)) ([`b643d7d`](https://github.com/hey-api/hey-api/commit/b643d7d400492489a24918534991dfb3f1443abc)) by [@mrlubos](https://github.com/mrlubos)

- **parser**: fix: process enum metadata ([#3727](https://github.com/hey-api/hey-api/pull/3727)) ([`397b63f`](https://github.com/hey-api/hey-api/commit/397b63fe6e1093181f7f4a0b99d3cf0db9daab93)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

### Updated Dependencies:

- @hey-api/spec-types@0.2.0
- @hey-api/json-schema-ref-parser@1.4.0
- @hey-api/codegen-core@0.8.0

## 0.3.0

### Minor Changes

- **internal**: remove `plugin.getSymbol()` function ([#3671](https://github.com/hey-api/hey-api/pull/3671)) ([`96f60ad`](https://github.com/hey-api/hey-api/commit/96f60adb6af144e39133884e97e74a6693b6c059)) by [@mrlubos](https://github.com/mrlubos)

### Removed `plugin.getSymbol()` function

This function has been removed. You can use `plugin.querySymbol()` instead. It accepts the same arguments and returns the same result.

### Patch Changes

- **plugins**: add request validator helpers ([#3671](https://github.com/hey-api/hey-api/pull/3671)) ([`96f60ad`](https://github.com/hey-api/hey-api/commit/96f60adb6af144e39133884e97e74a6693b6c059)) by [@mrlubos](https://github.com/mrlubos)

## 0.2.6

### Patch Changes

- **plugin**: fix: `symbolOnce()` method correctly handles multiple symbols with the same metadata ([#3635](https://github.com/hey-api/hey-api/pull/3635)) ([`6c1120c`](https://github.com/hey-api/hey-api/commit/6c1120cca981880718171327c4c0ae6c295c0638)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **internal**: add `@hey-api/spec-types` dependency ([#3652](https://github.com/hey-api/hey-api/pull/3652)) ([`4852795`](https://github.com/hey-api/hey-api/commit/485279556f4c73d187a9a2172010b51b2b6ef902)) by [@mrlubos](https://github.com/mrlubos)

### Updated Dependencies:

- @hey-api/spec-types@0.1.0

## 0.2.5

### Patch Changes

- **output**: pass context as second argument in `module.resolve()` function ([#3615](https://github.com/hey-api/hey-api/pull/3615)) ([`b6a65d6`](https://github.com/hey-api/hey-api/commit/b6a65d6bb3ff1895f2189af858e3424733154bdf)) by [@mrlubos](https://github.com/mrlubos)

- **parser**: fix: self-referencing discriminator ([#3601](https://github.com/hey-api/hey-api/pull/3601)) ([`857eb19`](https://github.com/hey-api/hey-api/commit/857eb1983fa1ab0f048d426a31835ede563a2c00)) by [@pgraug](https://github.com/pgraug)

- **output**: add `module` option ([#3616](https://github.com/hey-api/hey-api/pull/3616)) ([`e4eea23`](https://github.com/hey-api/hey-api/commit/e4eea23ab23fb704dfdb9aaad63989be34d5093c)) by [@mrlubos](https://github.com/mrlubos)

### Updated Dependencies:

- @hey-api/codegen-core@0.7.4

## 0.2.4

### Patch Changes

- **utils**: `outputHeaderToPrefix()` function signature change ([#3585](https://github.com/hey-api/hey-api/pull/3585)) ([`c076e4d`](https://github.com/hey-api/hey-api/commit/c076e4d3e9697d8bbc72db13a31d44627c814c2d)) by [@mrlubos](https://github.com/mrlubos)

- **internal**: remove TypeScript from peer dependencies ([#3566](https://github.com/hey-api/hey-api/pull/3566)) ([`b5f1e4b`](https://github.com/hey-api/hey-api/commit/b5f1e4b5f64cbf0bad2eff888177ac9c1881ba3e)) by [@mrlubos](https://github.com/mrlubos)

### Updated Dependencies:

- @hey-api/codegen-core@0.7.3
- @hey-api/types@0.1.4

## 0.2.3

### Patch Changes

- **cli**: export isEnvironment function ([#3546](https://github.com/hey-api/hey-api/pull/3546)) ([`571bc8a`](https://github.com/hey-api/hey-api/commit/571bc8a32b55647083bb506d4a5b575c4736cb94)) by [@mrlubos](https://github.com/mrlubos)

- **internal**: export more IR types ([#3513](https://github.com/hey-api/hey-api/pull/3513)) ([`ffe68cd`](https://github.com/hey-api/hey-api/commit/ffe68cd4303c39e71152f36c2057165468e64308)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **parser**: add `getName()` symbol hook ([#3556](https://github.com/hey-api/hey-api/pull/3556)) ([`68c750a`](https://github.com/hey-api/hey-api/commit/68c750ab7ad37c71c4f9b267ddc9e1c90c89924a)) by [@mrlubos](https://github.com/mrlubos)

### Updated Dependencies:

- @hey-api/codegen-core@0.7.2

## 0.2.2

### Patch Changes

- **output**: context file is optional ([#3486](https://github.com/hey-api/hey-api/pull/3486)) ([`942913a`](https://github.com/hey-api/hey-api/commit/942913af15ae10c5fc3c5e456800829b7dd9c10a)) by [@mrlubos](https://github.com/mrlubos)

- **parser**: fix: explicit discriminator mapping wins over fallback in nested `allOf` ([#3490](https://github.com/hey-api/hey-api/pull/3490)) ([`a67d589`](https://github.com/hey-api/hey-api/commit/a67d589e1f8e5860bd05d5caff134dd6a7eed6e2)) by [@pgraug](https://github.com/pgraug)

### Updated Dependencies:

- @hey-api/codegen-core@0.7.1

## 0.2.1

### Patch Changes

- **internal**: export schema walker interfaces ([#3396](https://github.com/hey-api/hey-api/pull/3396)) ([`ea6f386`](https://github.com/hey-api/hey-api/commit/ea6f3865c8e381b3160e1526435c4522f0dc6aa4)) by [@mrlubos](https://github.com/mrlubos)

- **parser(patch)**: support callback for `patch.schemas` ([#3415](https://github.com/hey-api/hey-api/pull/3415)) ([`e494f4d`](https://github.com/hey-api/hey-api/commit/e494f4dd828167a0096a0a488b222a013f911055)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **parser**: handle OpenAPI 3.1 `contentMediaType` keyword as binary format when file-like ([#3431](https://github.com/hey-api/hey-api/pull/3431)) ([`d6a8538`](https://github.com/hey-api/hey-api/commit/d6a85381e3c52b4fd1c4af43ee57506459db7a45)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **input**: fix: improve returned status code when spec fetch fails ([#3427](https://github.com/hey-api/hey-api/pull/3427)) ([`37dd92c`](https://github.com/hey-api/hey-api/commit/37dd92c6629511860ae434c64ac8af9154ed6aed)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **parser**: add `patch.input` and shorthand `patch()` option for full specification transformations ([#3411](https://github.com/hey-api/hey-api/pull/3411)) ([`ba9f893`](https://github.com/hey-api/hey-api/commit/ba9f893d71b959721e177717ae85fce34d697002)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **parser**: fix: preserve `unevaluatedProperties` keyword in transforms ([#3435](https://github.com/hey-api/hey-api/pull/3435)) ([`f659b38`](https://github.com/hey-api/hey-api/commit/f659b38701795d2c2b61c8d3f5c43af93893481a)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **parser(transforms)**: add `schemaName` transform ([#3416](https://github.com/hey-api/hey-api/pull/3416)) ([`4b9d032`](https://github.com/hey-api/hey-api/commit/4b9d032c6a144fa79cedc28e077782b9d67803a3)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **parser(patch)**: support callback for `patch.operations` ([#3420](https://github.com/hey-api/hey-api/pull/3420)) ([`e1cd970`](https://github.com/hey-api/hey-api/commit/e1cd970e4f3028b29ace44a58b2d2cae18a6c45f)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **parser**: add support for non-string discriminator property types ([#3385](https://github.com/hey-api/hey-api/pull/3385)) ([`dd0be9c`](https://github.com/hey-api/hey-api/commit/dd0be9c6ca93552c3367ca8e8ba785381295a112)) by [@SipanP](https://github.com/SipanP)

### Updated Dependencies:

- @hey-api/json-schema-ref-parser@1.3.1

## 0.2.0

### Minor Changes

- **utils**: rename `isTopLevelComponentRef` to `isTopLevelComponent` ([#3370](https://github.com/hey-api/hey-api/pull/3370)) ([`27cd91f`](https://github.com/hey-api/hey-api/commit/27cd91f530bd77da6ea95df1704b2947917b4626)) by [@mrlubos](https://github.com/mrlubos)

### Patch Changes

### Updated Dependencies:

- @hey-api/json-schema-ref-parser@1.3.0

## 0.1.2

### Patch Changes

- **parser**: add `getExportFromFilePath()` hook ([#3322](https://github.com/hey-api/hey-api/pull/3322)) ([`bfd43ec`](https://github.com/hey-api/hey-api/commit/bfd43ec6d638bfc97b6905dd9dee2c911ccea3e0)) by [@mrlubos](https://github.com/mrlubos)

- **config**: `includeInEntry` accepts function in addition to primitive value ([#3322](https://github.com/hey-api/hey-api/pull/3322)) ([`bfd43ec`](https://github.com/hey-api/hey-api/commit/bfd43ec6d638bfc97b6905dd9dee2c911ccea3e0)) by [@mrlubos](https://github.com/mrlubos)

- **transform(read-write)**: improve discriminated schemas split ([#3322](https://github.com/hey-api/hey-api/pull/3322)) ([`bfd43ec`](https://github.com/hey-api/hey-api/commit/bfd43ec6d638bfc97b6905dd9dee2c911ccea3e0)) by [@mrlubos](https://github.com/mrlubos)

### Updated Dependencies:

- @hey-api/codegen-core@0.7.0

## 0.1.1

### Patch Changes

### Updated Dependencies:

- @hey-api/codegen-core@0.6.1

## 0.1.0

### Minor Changes

- **feat**: initial release ([#3251](https://github.com/hey-api/hey-api/pull/3251)) ([`7f19d59`](https://github.com/hey-api/hey-api/commit/7f19d5921dadfa96ecae84a5298b7aee1daee56d)) by [@mrlubos](https://github.com/mrlubos)

### Patch Changes

### Updated Dependencies:

- @hey-api/codegen-core@0.6.0
- @hey-api/types@0.1.3
