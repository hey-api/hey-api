# @hey-api/openapi-ts

## 0.100.0

### Minor Changes

- **BREAKING** **compiler**: custom compiler implementation ([#4163](https://github.com/hey-api/hey-api/pull/4163)) ([`03e9979`](https://github.com/hey-api/hey-api/commit/03e997919ef76e3bee2f460b1b6dd1edab982a44)) by [@ahmedrowaihi](https://github.com/ahmedrowaihi)

- **BREAKING** **plugin(@hey-api/transformers)**: no longer accept TypeScript nodes directly for stricter types ([#4162](https://github.com/hey-api/hey-api/pull/4162)) ([`ad5fb33`](https://github.com/hey-api/hey-api/commit/ad5fb335a0a939ff2d79eaafe43ec9e3449113de)) by [@mrlubos](https://github.com/mrlubos)

- **BREAKING** **plugin(zod)**: no longer accept TypeScript nodes directly for stricter types ([#4162](https://github.com/hey-api/hey-api/pull/4162)) ([`ad5fb33`](https://github.com/hey-api/hey-api/commit/ad5fb335a0a939ff2d79eaafe43ec9e3449113de)) by [@mrlubos](https://github.com/mrlubos)

- **BREAKING** **plugin(valibot)**: no longer accept TypeScript nodes directly for stricter types ([#4162](https://github.com/hey-api/hey-api/pull/4162)) ([`ad5fb33`](https://github.com/hey-api/hey-api/commit/ad5fb335a0a939ff2d79eaafe43ec9e3449113de)) by [@mrlubos](https://github.com/mrlubos)

- **BREAKING** **cli**: multiple values must be comma-separated ([#4148](https://github.com/hey-api/hey-api/pull/4148)) ([`55fca63`](https://github.com/hey-api/hey-api/commit/55fca632144872bcf864e837a9e851cf7a48cf16)) by [@mrlubos](https://github.com/mrlubos)

### Patch Changes

- **plugin(orpc)**: oRPC v2 support ([#4195](https://github.com/hey-api/hey-api/pull/4195)) ([`7fe892d`](https://github.com/hey-api/hey-api/commit/7fe892d524cf57dbf739bcdced249e2d0b080396)) by [@hyoban](https://github.com/hyoban)

- **dependencies**: remove ansi-colors and color-support ([#4291](https://github.com/hey-api/hey-api/pull/4291)) ([`88c346f`](https://github.com/hey-api/hey-api/commit/88c346fc7de4a5f9b6d22481018c8082e6dc2fad)) by [@Norbiros](https://github.com/Norbiros)

- **plugin(@hey-api/client-angular)**: fix: accept `context` field ([#4269](https://github.com/hey-api/hey-api/pull/4269)) ([`eab872c`](https://github.com/hey-api/hey-api/commit/eab872c4cd9de7e0a8f85abd409ff73d5519e1d5)) by [@joshkaplinsky](https://github.com/joshkaplinsky)

- **plugin(@hey-api/transformers)**: support global Temporal API in `dates` ([#4282](https://github.com/hey-api/hey-api/pull/4282)) ([`2a24c8d`](https://github.com/hey-api/hey-api/commit/2a24c8d3445fd861f93f0c168c4b35c856cea4df)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(orpc)**: fix generation for responses without validator schemas ([#4298](https://github.com/hey-api/hey-api/pull/4298)) ([`6b5b4b4`](https://github.com/hey-api/hey-api/commit/6b5b4b452c6efc3447e0aca99c9f099e701fdbd1)) by [@avendiart](https://github.com/avendiart)

- **dependencies**: remove `typescript` from peer dependencies ([#4163](https://github.com/hey-api/hey-api/pull/4163)) ([`b7a39cc`](https://github.com/hey-api/hey-api/commit/b7a39cce7e7757dd5877cfd288550b1945e8a570)) by [@ahmedrowaihi](https://github.com/ahmedrowaihi)

- **config**: expose `output.printer` options ([#4192](https://github.com/hey-api/hey-api/pull/4192)) ([`cb7e283`](https://github.com/hey-api/hey-api/commit/cb7e283a1c87f32e16639e1d295ed4e7aa1df1a2)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(zod)**: honor `additionalProperties: false` for object schemas with properties ([#4308](https://github.com/hey-api/hey-api/pull/4308)) ([`c7d55ed`](https://github.com/hey-api/hey-api/commit/c7d55ed383e8387d97fbd45b73050a1afa1b7040)) by [@fuchengwarrenzhu](https://github.com/fuchengwarrenzhu)

- **printer**: change default indent to 2 spaces ([#4193](https://github.com/hey-api/hey-api/pull/4193)) ([`1a27afa`](https://github.com/hey-api/hey-api/commit/1a27afa4076e124a636c9dd4051f21211945cd97)) by [@mrlubos](https://github.com/mrlubos)

### Updated Dependencies:

- @hey-api/codegen-cli@0.1.0
- @hey-api/json-schema-ref-parser@1.4.5
- @hey-api/codegen-core@0.9.2
- @hey-api/shared@0.5.1
- @hey-api/spec-types@0.2.1

## 0.99.0

### Minor Changes

- **BREAKING** **plugin**: rename `.symbols` to `.imports` ([#4052](https://github.com/hey-api/hey-api/pull/4052)) ([`57fac5e`](https://github.com/hey-api/hey-api/commit/57fac5ef22bca2b4ac47c8df136270f967f85ed1)) by [@mrlubos](https://github.com/mrlubos)

To better represent its functionality, the `plugin.symbols` property has been renamed to `plugin.imports`.

- **BREAKING** **config**: merge duplicate plugin configurations ([`089ed2e`](https://github.com/hey-api/hey-api/commit/089ed2ed065ff92accb7d98cdeb95c66cf88f2f6)) by [@mrlubos](https://github.com/mrlubos)

### Plugin duplicates behavior

If you specified the same plugin multiple times, only the last instance would be used. We eventually added a warning for this behavior, but that didn't treat the root issue. This release changes that by merging duplicate plugin configurations.

- **BREAKING** **plugin(@hey-api/schemas)**: widen `schema` type in `nameBuilder` to unknown ([#4076](https://github.com/hey-api/hey-api/pull/4076)) ([`98ce35e`](https://github.com/hey-api/hey-api/commit/98ce35e3b51bd4d4fd58ebe9b81b6632ca654416)) by [@mrlubos](https://github.com/mrlubos)

- **BREAKING** **plugin**: remove `.external()` method ([#4052](https://github.com/hey-api/hey-api/pull/4052)) ([`57fac5e`](https://github.com/hey-api/hey-api/commit/57fac5ef22bca2b4ac47c8df136270f967f85ed1)) by [@mrlubos](https://github.com/mrlubos)

### Removed `plugin.external()` function

This function was used to reference external symbols. All plugins now use the Imports API, which allows you to reference external symbols in a type-safe way through `plugin.imports`.

### Patch Changes

- **api**: replace `~` fields with `$` ([#4086](https://github.com/hey-api/hey-api/pull/4086)) ([`d5ca286`](https://github.com/hey-api/hey-api/commit/d5ca286729e8b881387d5a7ac9234512af58dcd4)) by [@mrlubos](https://github.com/mrlubos)

- **config**: add Presets API ([`3b4ee7a`](https://github.com/hey-api/hey-api/commit/3b4ee7a5d3fd454aa8416ad1ed4a565119632be1)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/client-angular)**: fix: send an empty object request body when explicitly provided in flat parameters mode ([#4070](https://github.com/hey-api/hey-api/pull/4070)) ([`ab522ef`](https://github.com/hey-api/hey-api/commit/ab522ef77953ccb2c55cbdcc369a27eed90de3d3)) by [@matthewjamesadam](https://github.com/matthewjamesadam)

- **client**: use `getBaseUrl()` function to determine default value ([#3772](https://github.com/hey-api/hey-api/pull/3772)) ([`4026955`](https://github.com/hey-api/hey-api/commit/4026955318aed9282b46464b15a75ab1cdc7243a)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(zod)**: improve discriminator handling ([`680b947`](https://github.com/hey-api/hey-api/commit/680b94766855232fdfe8cf34029224c3900821f8)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@tanstack/preact-query)**: fix: strip `initialData` from the inferred result types for infinite query options ([`7a4b0cf`](https://github.com/hey-api/hey-api/commit/7a4b0cf9687adc6ad80531b4eadf90825d4366e7)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@tanstack/solid-query)**: fix: strip `initialData` from the inferred result types for infinite query options ([`7a4b0cf`](https://github.com/hey-api/hey-api/commit/7a4b0cf9687adc6ad80531b4eadf90825d4366e7)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(valibot)**: support custom regular expression error messages with `x-pattern-message` ([#4117](https://github.com/hey-api/hey-api/pull/4117)) ([`3ed3afb`](https://github.com/hey-api/hey-api/commit/3ed3afbe785d9a79f9eec02ab6240d2041d4f49a)) by [@pullfrog](https://github.com/apps/pullfrog)

- **plugin(@hey-api/client-next)**: fix: send an empty object request body when explicitly provided in flat parameters mode ([#4070](https://github.com/hey-api/hey-api/pull/4070)) ([`f6d4512`](https://github.com/hey-api/hey-api/commit/f6d45122223ac91996907a0e7e188712bfea741c)) by [@matthewjamesadam](https://github.com/matthewjamesadam)

- **plugin(@hey-api/client-axios)**: fix: send an empty object request body when explicitly provided in flat parameters mode ([#4070](https://github.com/hey-api/hey-api/pull/4070)) ([`f6d4512`](https://github.com/hey-api/hey-api/commit/f6d45122223ac91996907a0e7e188712bfea741c)) by [@matthewjamesadam](https://github.com/matthewjamesadam)

- **plugin(zod)**: support creating optional request schemas ([`11315c7`](https://github.com/hey-api/hey-api/commit/11315c763a6a8ba9f7b2396466bfaf5a9e257fee)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@tanstack/react-query)**: fix: strip `initialData` from the inferred result types for infinite query options ([`7a4b0cf`](https://github.com/hey-api/hey-api/commit/7a4b0cf9687adc6ad80531b4eadf90825d4366e7)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/client-ky)**: fix: send an empty object request body when explicitly provided in flat parameters mode ([#4070](https://github.com/hey-api/hey-api/pull/4070)) ([`f6d4512`](https://github.com/hey-api/hey-api/commit/f6d45122223ac91996907a0e7e188712bfea741c)) by [@matthewjamesadam](https://github.com/matthewjamesadam)

- **plugin(valibot)**: support creating optional request schemas ([`11315c7`](https://github.com/hey-api/hey-api/commit/11315c763a6a8ba9f7b2396466bfaf5a9e257fee)) by [@mrlubos](https://github.com/mrlubos)

- **exports**: add `/plugins` exported module ([#4076](https://github.com/hey-api/hey-api/pull/4076)) ([`93129b7`](https://github.com/hey-api/hey-api/commit/93129b7f5d9d2d45c46161f22b7d7945f95b7a58)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@tanstack/svelte-query)**: fix: strip `initialData` from the inferred result types for infinite query options ([`7a4b0cf`](https://github.com/hey-api/hey-api/commit/7a4b0cf9687adc6ad80531b4eadf90825d4366e7)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/client-nuxt)**: fix: send an empty object request body when explicitly provided in flat parameters mode ([#4070](https://github.com/hey-api/hey-api/pull/4070)) ([`f6d4512`](https://github.com/hey-api/hey-api/commit/f6d45122223ac91996907a0e7e188712bfea741c)) by [@matthewjamesadam](https://github.com/matthewjamesadam)

- **plugin(zod)**: support custom regular expression error messages with `x-pattern-message` ([#4117](https://github.com/hey-api/hey-api/pull/4117)) ([`3ed3afb`](https://github.com/hey-api/hey-api/commit/3ed3afbe785d9a79f9eec02ab6240d2041d4f49a)) by [@pullfrog](https://github.com/apps/pullfrog)

- **plugin(@tanstack/angular-query-experimental)**: fix: strip `initialData` from the inferred result types for infinite query options ([`7a4b0cf`](https://github.com/hey-api/hey-api/commit/7a4b0cf9687adc6ad80531b4eadf90825d4366e7)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/client-ofetch)**: fix: send an empty object request body when explicitly provided in flat parameters mode ([#4070](https://github.com/hey-api/hey-api/pull/4070)) ([`f6d4512`](https://github.com/hey-api/hey-api/commit/f6d45122223ac91996907a0e7e188712bfea741c)) by [@matthewjamesadam](https://github.com/matthewjamesadam)

- **plugin(@hey-api/client-fetch)**: fix: send an empty object request body when explicitly provided in flat parameters mode ([#4070](https://github.com/hey-api/hey-api/pull/4070)) ([`f6d4512`](https://github.com/hey-api/hey-api/commit/f6d45122223ac91996907a0e7e188712bfea741c)) by [@matthewjamesadam](https://github.com/matthewjamesadam)

- **plugin(@hey-api/typescript)**: improve discriminator handling ([`680b947`](https://github.com/hey-api/hey-api/commit/680b94766855232fdfe8cf34029224c3900821f8)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(orpc)**: make `.input()` optional if all layers are optional ([`11315c7`](https://github.com/hey-api/hey-api/commit/11315c763a6a8ba9f7b2396466bfaf5a9e257fee)) by [@mrlubos](https://github.com/mrlubos)

- \*_parser_: fix: delete unresolvable `$ref` keywords ([#4087](https://github.com/hey-api/hey-api/pull/4087)) ([`6c21d81`](https://github.com/hey-api/hey-api/commit/6c21d818f95d5ecf324d35fd96a4b18941e26546)) by [@pullfrog](https://github.com/apps/pullfrog)

- **plugin(@tanstack/vue-query)**: fix: strip `initialData` from the inferred result types for infinite query options ([`8d91bd5`](https://github.com/hey-api/hey-api/commit/8d91bd5dfb70f4cf1db1d7b1277f49f57066b831)) by [@magicismight](https://github.com/magicismight)

- **plugin(valibot)**: improve discriminator handling ([`680b947`](https://github.com/hey-api/hey-api/commit/680b94766855232fdfe8cf34029224c3900821f8)) by [@mrlubos](https://github.com/mrlubos)

- **exports**: export `plugins` type helpers ([#4076](https://github.com/hey-api/hey-api/pull/4076)) ([`93129b7`](https://github.com/hey-api/hey-api/commit/93129b7f5d9d2d45c46161f22b7d7945f95b7a58)) by [@mrlubos](https://github.com/mrlubos)

### Updated Dependencies:

- @hey-api/shared@0.5.0
- @hey-api/json-schema-ref-parser@1.4.4
- @hey-api/codegen-core@0.9.1

## 0.98.2

### Patch Changes

- **plugin(@hey-api/client-ofetch)**: export augmentable `ClientMeta` interface ([#3996](https://github.com/hey-api/hey-api/pull/3996)) ([`f02246b`](https://github.com/hey-api/hey-api/commit/f02246bad34f9c46b2fb099edb98eca8dd16c5a5)) by [@matthewjamesadam](https://github.com/matthewjamesadam)

- **plugin(@hey-api/sdk)**: fix: don't expose SSE errors as iterator return types ([#3989](https://github.com/hey-api/hey-api/pull/3989)) ([`ffbd82e`](https://github.com/hey-api/hey-api/commit/ffbd82e898f239956324938ad6563b5c266c6dec)) by [@frastefanini](https://github.com/frastefanini)

- **plugin(@hey-api/client-next)**: export augmentable `ClientMeta` interface ([#3996](https://github.com/hey-api/hey-api/pull/3996)) ([`f02246b`](https://github.com/hey-api/hey-api/commit/f02246bad34f9c46b2fb099edb98eca8dd16c5a5)) by [@matthewjamesadam](https://github.com/matthewjamesadam)

- **plugin(@hey-api/client-ky)**: export augmentable `ClientMeta` interface ([#3996](https://github.com/hey-api/hey-api/pull/3996)) ([`f02246b`](https://github.com/hey-api/hey-api/commit/f02246bad34f9c46b2fb099edb98eca8dd16c5a5)) by [@matthewjamesadam](https://github.com/matthewjamesadam)

- **plugin(@hey-api/client-fetch)**: export augmentable `ClientMeta` interface ([#3996](https://github.com/hey-api/hey-api/pull/3996)) ([`f02246b`](https://github.com/hey-api/hey-api/commit/f02246bad34f9c46b2fb099edb98eca8dd16c5a5)) by [@matthewjamesadam](https://github.com/matthewjamesadam)

- **plugin(@hey-api/client-nuxt)**: export augmentable `ClientMeta` interface ([#3996](https://github.com/hey-api/hey-api/pull/3996)) ([`f02246b`](https://github.com/hey-api/hey-api/commit/f02246bad34f9c46b2fb099edb98eca8dd16c5a5)) by [@matthewjamesadam](https://github.com/matthewjamesadam)

- **plugin(@hey-api/client-angular)**: fix: reassign the result of `HttpHeaders.delete()` back to `opts.headers` ([#3988](https://github.com/hey-api/hey-api/pull/3988)) ([`b9390d7`](https://github.com/hey-api/hey-api/commit/b9390d74071c07cbc65e8e8055fe7e4b4e350ca3)) by [@joshkaplinsky](https://github.com/joshkaplinsky)

- **plugin(@hey-api/client-angular)**: export augmentable `ClientMeta` interface ([#3996](https://github.com/hey-api/hey-api/pull/3996)) ([`f02246b`](https://github.com/hey-api/hey-api/commit/f02246bad34f9c46b2fb099edb98eca8dd16c5a5)) by [@matthewjamesadam](https://github.com/matthewjamesadam)

- **plugin(@hey-api/client-axios)**: export augmentable `ClientMeta` interface ([#3996](https://github.com/hey-api/hey-api/pull/3996)) ([`f02246b`](https://github.com/hey-api/hey-api/commit/f02246bad34f9c46b2fb099edb98eca8dd16c5a5)) by [@matthewjamesadam](https://github.com/matthewjamesadam)

- **plugin(@hey-api/sdk)**: support type-safe `meta` option via augmentable `ClientMeta` interface ([#3996](https://github.com/hey-api/hey-api/pull/3996)) ([`b7ee3fd`](https://github.com/hey-api/hey-api/commit/b7ee3fda897398817abff7f16388c62a5ead7a8c)) by [@matthewjamesadam](https://github.com/matthewjamesadam)

### Updated Dependencies:

- @hey-api/shared@0.4.8
- @hey-api/codegen-core@0.9.0

## 0.98.1

### Patch Changes

- **cli**: simplify generate command messages ([#3982](https://github.com/hey-api/hey-api/pull/3982)) ([`11f9324`](https://github.com/hey-api/hey-api/commit/11f9324a729a2db2f37c9f36a19c10b0d695e574)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(valibot)**: fix: revert referencing TypeScript enums ([#3982](https://github.com/hey-api/hey-api/pull/3982)) ([`11f9324`](https://github.com/hey-api/hey-api/commit/11f9324a729a2db2f37c9f36a19c10b0d695e574)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(zod)**: fix: revert referencing TypeScript enums ([#3982](https://github.com/hey-api/hey-api/pull/3982)) ([`11f9324`](https://github.com/hey-api/hey-api/commit/11f9324a729a2db2f37c9f36a19c10b0d695e574)) by [@mrlubos](https://github.com/mrlubos)

### Updated Dependencies:

- @hey-api/codegen-core@0.8.4
- @hey-api/shared@0.4.7

## 0.98.0

### Minor Changes

- **BREAKING** **config**: declarative configuration ([#3950](https://github.com/hey-api/hey-api/pull/3950)) ([`9b79a56`](https://github.com/hey-api/hey-api/commit/9b79a56cf02ad8d6acae15139a9917fe644f1df4)) by [@mrlubos](https://github.com/mrlubos)

This is an internal change that simplifies the configuration and plugin APIs. The generated output should be unaffected, please [open an issue](https://github.com/hey-api/hey-api/issues) if that's not the case. If you have custom plugins, refer to the [custom plugin guide](https://heyapi.dev/docs/openapi/typescript/plugins/custom) for the latest instructions.

### Patch Changes

- **parser**: fix: preserve sort order when filtering input ([#3953](https://github.com/hey-api/hey-api/pull/3953)) ([`f6e8496`](https://github.com/hey-api/hey-api/commit/f6e8496626b007341a1c6653dba1d6452ae038ec)) by [@pullfrog](https://github.com/apps/pullfrog)

- **plugin(valibot)**: fix: improve boolean enum handling ([#3974](https://github.com/hey-api/hey-api/pull/3974)) ([`d3e9f13`](https://github.com/hey-api/hey-api/commit/d3e9f132588ee33aff90b03b182fc4a4815b36f2)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/client-ky)**: fix: use `Object.create()` to avoid prototype chain substitution. Reported by @programsurf, @daeungdaeung, @yoonsh, and @lubroai (GHSA-hhx9-57xq-r5rw) ([#3973](https://github.com/hey-api/hey-api/pull/3973)) ([`9f2f0d2`](https://github.com/hey-api/hey-api/commit/9f2f0d2b65f9b0664b2dd4be32dc08102eed5b43)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/client-ofetch)**: fix: use `Object.create()` to avoid prototype chain substitution. Reported by @programsurf, @daeungdaeung, @yoonsh, and @lubroai (GHSA-hhx9-57xq-r5rw) ([#3973](https://github.com/hey-api/hey-api/pull/3973)) ([`9f2f0d2`](https://github.com/hey-api/hey-api/commit/9f2f0d2b65f9b0664b2dd4be32dc08102eed5b43)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/client-axios)**: add explicit return types ([#3880](https://github.com/hey-api/hey-api/pull/3880)) ([`9c78271`](https://github.com/hey-api/hey-api/commit/9c782713a6619cbec2155dff093d7517b606c549)) by [@tompuric](https://github.com/tompuric)

- **plugin(@hey-api/client-axios)**: fix: use `Object.create()` to avoid prototype chain substitution. Reported by @programsurf, @daeungdaeung, @yoonsh, and @lubroai (GHSA-hhx9-57xq-r5rw) ([#3973](https://github.com/hey-api/hey-api/pull/3973)) ([`9f2f0d2`](https://github.com/hey-api/hey-api/commit/9f2f0d2b65f9b0664b2dd4be32dc08102eed5b43)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/client-next)**: fix: improve params helper type ([#3946](https://github.com/hey-api/hey-api/pull/3946)) ([`bebb225`](https://github.com/hey-api/hey-api/commit/bebb225b87eb58d6f27985a8c63cab0b3ee7bee2)) by [@pullfrog](https://github.com/apps/pullfrog)

- **plugin(@hey-api/client-fetch)**: fix: use `Object.create()` to avoid prototype chain substitution. Reported by @programsurf, @daeungdaeung, @yoonsh, and @lubroai (GHSA-hhx9-57xq-r5rw) ([#3973](https://github.com/hey-api/hey-api/pull/3973)) ([`9f2f0d2`](https://github.com/hey-api/hey-api/commit/9f2f0d2b65f9b0664b2dd4be32dc08102eed5b43)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/client-ofetch)**: fix: improve params helper type ([#3946](https://github.com/hey-api/hey-api/pull/3946)) ([`bebb225`](https://github.com/hey-api/hey-api/commit/bebb225b87eb58d6f27985a8c63cab0b3ee7bee2)) by [@pullfrog](https://github.com/apps/pullfrog)

- **plugin(@hey-api/client-nuxt)**: add explicit return types ([#3880](https://github.com/hey-api/hey-api/pull/3880)) ([`9c78271`](https://github.com/hey-api/hey-api/commit/9c782713a6619cbec2155dff093d7517b606c549)) by [@tompuric](https://github.com/tompuric)

- **dsl**: track extended class symbols ([#3945](https://github.com/hey-api/hey-api/pull/3945)) ([`13c3d7d`](https://github.com/hey-api/hey-api/commit/13c3d7d2be7a18ea72dff14e951841c843e3ea9a)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/client-angular)**: fix: use `Object.create()` to avoid prototype chain substitution. Reported by @programsurf, @daeungdaeung, @yoonsh, and @lubroai (GHSA-hhx9-57xq-r5rw) ([#3973](https://github.com/hey-api/hey-api/pull/3973)) ([`9f2f0d2`](https://github.com/hey-api/hey-api/commit/9f2f0d2b65f9b0664b2dd4be32dc08102eed5b43)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(orpc)**: fix: handle no-content success responses ([#3948](https://github.com/hey-api/hey-api/pull/3948)) ([`44672f0`](https://github.com/hey-api/hey-api/commit/44672f0eb4382ded975e4119e22d02eaf9d9c4de)) by [@lyzno1](https://github.com/lyzno1)

- **plugin(@hey-api/sdk)**: add explicit return types ([#3880](https://github.com/hey-api/hey-api/pull/3880)) ([`9c78271`](https://github.com/hey-api/hey-api/commit/9c782713a6619cbec2155dff093d7517b606c549)) by [@tompuric](https://github.com/tompuric)

- **plugin(@hey-api/client-nuxt)**: fix: use `Object.create()` to avoid prototype chain substitution. Reported by @programsurf, @daeungdaeung, @yoonsh, and @lubroai (GHSA-hhx9-57xq-r5rw) ([#3973](https://github.com/hey-api/hey-api/pull/3973)) ([`9f2f0d2`](https://github.com/hey-api/hey-api/commit/9f2f0d2b65f9b0664b2dd4be32dc08102eed5b43)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/client-ky)**: fix: improve params helper type ([#3946](https://github.com/hey-api/hey-api/pull/3946)) ([`bebb225`](https://github.com/hey-api/hey-api/commit/bebb225b87eb58d6f27985a8c63cab0b3ee7bee2)) by [@pullfrog](https://github.com/apps/pullfrog)

- **plugin(@hey-api/client-angular)**: add explicit return types ([#3880](https://github.com/hey-api/hey-api/pull/3880)) ([`9c78271`](https://github.com/hey-api/hey-api/commit/9c782713a6619cbec2155dff093d7517b606c549)) by [@tompuric](https://github.com/tompuric)

- **plugin(@hey-api/client-nuxt)**: fix: improve params helper type ([#3946](https://github.com/hey-api/hey-api/pull/3946)) ([`bebb225`](https://github.com/hey-api/hey-api/commit/bebb225b87eb58d6f27985a8c63cab0b3ee7bee2)) by [@pullfrog](https://github.com/apps/pullfrog)

- **plugin(@hey-api/client-angular)**: fix: improve params helper type ([#3946](https://github.com/hey-api/hey-api/pull/3946)) ([`bebb225`](https://github.com/hey-api/hey-api/commit/bebb225b87eb58d6f27985a8c63cab0b3ee7bee2)) by [@pullfrog](https://github.com/apps/pullfrog)

- **plugin(@hey-api/sdk)**: fix: expose `key` on security schemes when their signatures collide ([#3935](https://github.com/hey-api/hey-api/pull/3935)) ([`23d908a`](https://github.com/hey-api/hey-api/commit/23d908a2882dd1601072a1cf7ac277802fd06c6d)) by [@matthewjamesadam](https://github.com/matthewjamesadam)

- **plugin(@hey-api/client-fetch)**: fix: improve params helper type ([#3946](https://github.com/hey-api/hey-api/pull/3946)) ([`bebb225`](https://github.com/hey-api/hey-api/commit/bebb225b87eb58d6f27985a8c63cab0b3ee7bee2)) by [@pullfrog](https://github.com/apps/pullfrog)

- **plugin(@hey-api/client-ky)**: add explicit return types ([#3880](https://github.com/hey-api/hey-api/pull/3880)) ([`9c78271`](https://github.com/hey-api/hey-api/commit/9c782713a6619cbec2155dff093d7517b606c549)) by [@tompuric](https://github.com/tompuric)

- **plugin(@hey-api/client-axios)**: fix: improve params helper type ([#3946](https://github.com/hey-api/hey-api/pull/3946)) ([`bebb225`](https://github.com/hey-api/hey-api/commit/bebb225b87eb58d6f27985a8c63cab0b3ee7bee2)) by [@pullfrog](https://github.com/apps/pullfrog)

- **plugin(@hey-api/client-fetch)**: add explicit return types ([#3880](https://github.com/hey-api/hey-api/pull/3880)) ([`9c78271`](https://github.com/hey-api/hey-api/commit/9c782713a6619cbec2155dff093d7517b606c549)) by [@tompuric](https://github.com/tompuric)

- **plugin(@hey-api/client-next)**: fix: use `Object.create()` to avoid prototype chain substitution. Reported by @programsurf, @daeungdaeung, @yoonsh, and @lubroai (GHSA-hhx9-57xq-r5rw) ([#3973](https://github.com/hey-api/hey-api/pull/3973)) ([`9f2f0d2`](https://github.com/hey-api/hey-api/commit/9f2f0d2b65f9b0664b2dd4be32dc08102eed5b43)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/client-ofetch)**: add explicit return types ([#3880](https://github.com/hey-api/hey-api/pull/3880)) ([`9c78271`](https://github.com/hey-api/hey-api/commit/9c782713a6619cbec2155dff093d7517b606c549)) by [@tompuric](https://github.com/tompuric)

- **plugin(@hey-api/client-next)**: add explicit return types ([#3880](https://github.com/hey-api/hey-api/pull/3880)) ([`9c78271`](https://github.com/hey-api/hey-api/commit/9c782713a6619cbec2155dff093d7517b606c549)) by [@tompuric](https://github.com/tompuric)

### Updated Dependencies:

- @hey-api/shared@0.4.6
- @hey-api/codegen-core@0.8.3
- @hey-api/json-schema-ref-parser@1.4.3

## 0.97.3

### Patch Changes

- **plugin(@hey-api/client-axios)**: fix: correct return type in SSE ([#3919](https://github.com/hey-api/hey-api/pull/3919)) ([`a19b3a4`](https://github.com/hey-api/hey-api/commit/a19b3a472f2480592f3cbe518ea5e7f02fe4a550)) by [@kitlangton](https://github.com/kitlangton)

- **plugin(@tanstack/preact-query)**: add `getQueryData` option ([#3827](https://github.com/hey-api/hey-api/pull/3827)) ([`1aa4785`](https://github.com/hey-api/hey-api/commit/1aa47851422dece48d103ad018759fea8151cb38)) by [@inas-sirhan](https://github.com/inas-sirhan)

- **plugin(@hey-api/client-ofetch)**: fix: correct return type in SSE ([#3919](https://github.com/hey-api/hey-api/pull/3919)) ([`a19b3a4`](https://github.com/hey-api/hey-api/commit/a19b3a472f2480592f3cbe518ea5e7f02fe4a550)) by [@kitlangton](https://github.com/kitlangton)

- **plugin(@tanstack/svelte-query)**: add `getQueryData` option ([#3827](https://github.com/hey-api/hey-api/pull/3827)) ([`1aa4785`](https://github.com/hey-api/hey-api/commit/1aa47851422dece48d103ad018759fea8151cb38)) by [@inas-sirhan](https://github.com/inas-sirhan)

- **plugin(@tanstack/angular-query-experimental)**: add `getQueryData` option ([#3827](https://github.com/hey-api/hey-api/pull/3827)) ([`1aa4785`](https://github.com/hey-api/hey-api/commit/1aa47851422dece48d103ad018759fea8151cb38)) by [@inas-sirhan](https://github.com/inas-sirhan)

- **plugin(@tanstack/react-query)**: add `getQueryData` option ([#3827](https://github.com/hey-api/hey-api/pull/3827)) ([`1aa4785`](https://github.com/hey-api/hey-api/commit/1aa47851422dece48d103ad018759fea8151cb38)) by [@inas-sirhan](https://github.com/inas-sirhan)

- **plugin(@hey-api/client-fetch)**: fix: correct return type in SSE ([#3919](https://github.com/hey-api/hey-api/pull/3919)) ([`a19b3a4`](https://github.com/hey-api/hey-api/commit/a19b3a472f2480592f3cbe518ea5e7f02fe4a550)) by [@kitlangton](https://github.com/kitlangton)

- **plugin(@tanstack/react-query)**: add `useGetQueryData` option ([#3827](https://github.com/hey-api/hey-api/pull/3827)) ([`1aa4785`](https://github.com/hey-api/hey-api/commit/1aa47851422dece48d103ad018759fea8151cb38)) by [@inas-sirhan](https://github.com/inas-sirhan)

- **plugin(@hey-api/client-ky)**: fix: correct return type in SSE ([#3919](https://github.com/hey-api/hey-api/pull/3919)) ([`a19b3a4`](https://github.com/hey-api/hey-api/commit/a19b3a472f2480592f3cbe518ea5e7f02fe4a550)) by [@kitlangton](https://github.com/kitlangton)

- **plugin(@tanstack/solid-query)**: add `getQueryData` option ([#3827](https://github.com/hey-api/hey-api/pull/3827)) ([`1aa4785`](https://github.com/hey-api/hey-api/commit/1aa47851422dece48d103ad018759fea8151cb38)) by [@inas-sirhan](https://github.com/inas-sirhan)

- **plugin(@hey-api/client-next)**: fix: correct return type in SSE ([#3919](https://github.com/hey-api/hey-api/pull/3919)) ([`a19b3a4`](https://github.com/hey-api/hey-api/commit/a19b3a472f2480592f3cbe518ea5e7f02fe4a550)) by [@kitlangton](https://github.com/kitlangton)

- **plugin(@tanstack/preact-query)**: add `useGetQueryData` option ([#3827](https://github.com/hey-api/hey-api/pull/3827)) ([`1aa4785`](https://github.com/hey-api/hey-api/commit/1aa47851422dece48d103ad018759fea8151cb38)) by [@inas-sirhan](https://github.com/inas-sirhan)

- **plugin(@hey-api/client-angular)**: fix: correct return type in SSE ([#3919](https://github.com/hey-api/hey-api/pull/3919)) ([`58962a0`](https://github.com/hey-api/hey-api/commit/58962a055b19c61ea5721d01f7ba2589bbbcb1ad)) by [@kitlangton](https://github.com/kitlangton)

- **plugin(@hey-api/transformers)**: add support for Temporal API via [temporal-polyfill](https://github.com/fullcalendar/temporal-polyfill) in `dates` ([#3916](https://github.com/hey-api/hey-api/pull/3916)) ([`bfa457a`](https://github.com/hey-api/hey-api/commit/bfa457a3da2bebad46f6c621cfd8a0f22aa6b9d8)) by [@OptoCloud](https://github.com/OptoCloud)

- **plugin(@tanstack/vue-query)**: add `getQueryData` option ([#3827](https://github.com/hey-api/hey-api/pull/3827)) ([`1aa4785`](https://github.com/hey-api/hey-api/commit/1aa47851422dece48d103ad018759fea8151cb38)) by [@inas-sirhan](https://github.com/inas-sirhan)

- **plugin(zod)**: fix: avoid invalid `.extend()` on `z.record()` when a discriminated union member is an empty object ([#3915](https://github.com/hey-api/hey-api/pull/3915)) ([`8fa9f3a`](https://github.com/hey-api/hey-api/commit/8fa9f3ae0932401c097ccdd542d08b092f13873c)) by [@pullfrog](https://github.com/apps/pullfrog)

### Updated Dependencies:

- @hey-api/shared@0.4.5
- @hey-api/codegen-core@0.8.2

## 0.97.2

### Patch Changes

- **plugin(zod)**: use enums from TypeScript if available ([#3884](https://github.com/hey-api/hey-api/pull/3884)) ([`abc8ceb`](https://github.com/hey-api/hey-api/commit/abc8ceb43f37e7c9739fe010d3fcdb3be0bb5290)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/client-next)**: fix: preserve query auth when when there are no other query parameters ([#3853](https://github.com/hey-api/hey-api/pull/3853)) ([`a6ee7eb`](https://github.com/hey-api/hey-api/commit/a6ee7eb11cc6e8f1d5093d2c211d77874f337bbe)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(@hey-api/sdk)**: support `valibot` as response transformer ([#3847](https://github.com/hey-api/hey-api/pull/3847)) ([`6770f78`](https://github.com/hey-api/hey-api/commit/6770f78dec53b1bf8f37c361c7b9c2e2eb4157fa)) by [@SukkaW](https://github.com/SukkaW)

- **plugin(@tanstack/vue-query)**: add `mutationKeys` option ([#3858](https://github.com/hey-api/hey-api/pull/3858)) ([`d86680a`](https://github.com/hey-api/hey-api/commit/d86680a8e94995032d315ac884d8de83ef8aa1a3)) by [@slmnsh](https://github.com/slmnsh)

- **plugin(@hey-api/client-nuxt)**: fix: preserve query auth when when there are no other query parameters ([#3853](https://github.com/hey-api/hey-api/pull/3853)) ([`a6ee7eb`](https://github.com/hey-api/hey-api/commit/a6ee7eb11cc6e8f1d5093d2c211d77874f337bbe)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(@tanstack/svelte-query)**: add `mutationKeys` option ([#3858](https://github.com/hey-api/hey-api/pull/3858)) ([`d86680a`](https://github.com/hey-api/hey-api/commit/d86680a8e94995032d315ac884d8de83ef8aa1a3)) by [@slmnsh](https://github.com/slmnsh)

- **plugin(@hey-api/sdk)**: support `zod` as response transformer ([#3847](https://github.com/hey-api/hey-api/pull/3847)) ([`6770f78`](https://github.com/hey-api/hey-api/commit/6770f78dec53b1bf8f37c361c7b9c2e2eb4157fa)) by [@SukkaW](https://github.com/SukkaW)

- **plugin(@hey-api/client-angular)**: fix: preserve query auth when when there are no other query parameters ([#3853](https://github.com/hey-api/hey-api/pull/3853)) ([`a6ee7eb`](https://github.com/hey-api/hey-api/commit/a6ee7eb11cc6e8f1d5093d2c211d77874f337bbe)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(@hey-api/client-fetch)**: fix: preserve query auth when when there are no other query parameters ([#3853](https://github.com/hey-api/hey-api/pull/3853)) ([`a6ee7eb`](https://github.com/hey-api/hey-api/commit/a6ee7eb11cc6e8f1d5093d2c211d77874f337bbe)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(@hey-api/client-axios)**: fix: preserve query auth when when there are no other query parameters ([#3853](https://github.com/hey-api/hey-api/pull/3853)) ([`a6ee7eb`](https://github.com/hey-api/hey-api/commit/a6ee7eb11cc6e8f1d5093d2c211d77874f337bbe)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(valibot)**: use enums from TypeScript if available ([#3884](https://github.com/hey-api/hey-api/pull/3884)) ([`abc8ceb`](https://github.com/hey-api/hey-api/commit/abc8ceb43f37e7c9739fe010d3fcdb3be0bb5290)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@tanstack/react-query)**: add `mutationKeys` option ([#3858](https://github.com/hey-api/hey-api/pull/3858)) ([`d86680a`](https://github.com/hey-api/hey-api/commit/d86680a8e94995032d315ac884d8de83ef8aa1a3)) by [@slmnsh](https://github.com/slmnsh)

- **plugin(@tanstack/solid-query)**: add `mutationKeys` option ([#3858](https://github.com/hey-api/hey-api/pull/3858)) ([`d86680a`](https://github.com/hey-api/hey-api/commit/d86680a8e94995032d315ac884d8de83ef8aa1a3)) by [@slmnsh](https://github.com/slmnsh)

- **plugin(@hey-api/client-ofetch)**: fix: preserve query auth when when there are no other query parameters ([#3853](https://github.com/hey-api/hey-api/pull/3853)) ([`a6ee7eb`](https://github.com/hey-api/hey-api/commit/a6ee7eb11cc6e8f1d5093d2c211d77874f337bbe)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(@hey-api/client-ky)**: fix: preserve query auth when when there are no other query parameters ([#3853](https://github.com/hey-api/hey-api/pull/3853)) ([`a6ee7eb`](https://github.com/hey-api/hey-api/commit/a6ee7eb11cc6e8f1d5093d2c211d77874f337bbe)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(@tanstack/preact-query)**: add `mutationKeys` option ([#3858](https://github.com/hey-api/hey-api/pull/3858)) ([`d86680a`](https://github.com/hey-api/hey-api/commit/d86680a8e94995032d315ac884d8de83ef8aa1a3)) by [@slmnsh](https://github.com/slmnsh)

- **dsl**: fix: cache lazy node result ([#3855](https://github.com/hey-api/hey-api/pull/3855)) ([`7dee3c2`](https://github.com/hey-api/hey-api/commit/7dee3c25d2d7150aa6cbc1e9d4dba0d9de1e64b2)) by [@awdr74100](https://github.com/awdr74100)

- **plugin(@tanstack/angular-query-experimental)**: add `mutationKeys` option ([#3858](https://github.com/hey-api/hey-api/pull/3858)) ([`d86680a`](https://github.com/hey-api/hey-api/commit/d86680a8e94995032d315ac884d8de83ef8aa1a3)) by [@slmnsh](https://github.com/slmnsh)

### Updated Dependencies:

- @hey-api/shared@0.4.4

## 0.97.1

### Patch Changes

- **plugin(@hey-api/transformers)**: fix: use symbols for `additionalProperties` key variables ([#3841](https://github.com/hey-api/hey-api/pull/3841)) ([`d880caa`](https://github.com/hey-api/hey-api/commit/d880caabb46a712b1fc0087615b8f9ee4b88c227)) by [@pullfrog](https://github.com/apps/pullfrog)

### Updated Dependencies:

- @hey-api/json-schema-ref-parser@1.4.2
- @hey-api/shared@0.4.3

## 0.97.0

### Minor Changes

- **BREAKING** **plugin(@hey-api/client-ky)**: fix: pass previous result to error interceptors ([#3814](https://github.com/hey-api/hey-api/pull/3814)) ([`0d388de`](https://github.com/hey-api/hey-api/commit/0d388de3b85748a6827bcd6407e1e1400f39c3a3)) by [@SukkaW](https://github.com/SukkaW)

- **BREAKING** **client**: resolve `runtimeConfigPath` relative to the output folder ([#3770](https://github.com/hey-api/hey-api/pull/3770)) ([`296da55`](https://github.com/hey-api/hey-api/commit/296da551f83c6d1ea2a24153b072a4a86617a9e0)) by [@inas-sirhan](https://github.com/inas-sirhan)

### Changed `runtimeConfigPath` behavior

This was a known, long-standing issue confusing first-time users. Before, defining client `runtimeConfigPath` value would paste it verbatim to the generated output. This release changes the behavior to resolve relative to the current working directory the same way output path works.

- **BREAKING** **plugin(@hey-api/client-angular)**: `request` and `response` objects might be undefined ([#3814](https://github.com/hey-api/hey-api/pull/3814)) ([`0d388de`](https://github.com/hey-api/hey-api/commit/0d388de3b85748a6827bcd6407e1e1400f39c3a3)) by [@SukkaW](https://github.com/SukkaW)

- **BREAKING** **plugin(@hey-api/client-angular)**: fix: respect `throwOnError` when request validation fails ([#3814](https://github.com/hey-api/hey-api/pull/3814)) ([`0d388de`](https://github.com/hey-api/hey-api/commit/0d388de3b85748a6827bcd6407e1e1400f39c3a3)) by [@SukkaW](https://github.com/SukkaW)

- **BREAKING** **plugin(@hey-api/client-next)**: `request` and `response` objects might be undefined ([#3814](https://github.com/hey-api/hey-api/pull/3814)) ([`0d388de`](https://github.com/hey-api/hey-api/commit/0d388de3b85748a6827bcd6407e1e1400f39c3a3)) by [@SukkaW](https://github.com/SukkaW)

- **BREAKING** **plugin(@hey-api/client-fetch)**: fix: pass previous result to error interceptors ([#3814](https://github.com/hey-api/hey-api/pull/3814)) ([`0d388de`](https://github.com/hey-api/hey-api/commit/0d388de3b85748a6827bcd6407e1e1400f39c3a3)) by [@SukkaW](https://github.com/SukkaW)

- **BREAKING** **plugin(@hey-api/client-ky)**: `request` and `response` objects might be undefined ([#3814](https://github.com/hey-api/hey-api/pull/3814)) ([`0d388de`](https://github.com/hey-api/hey-api/commit/0d388de3b85748a6827bcd6407e1e1400f39c3a3)) by [@SukkaW](https://github.com/SukkaW)

- **BREAKING** **plugin(@hey-api/client-fetch)**: `request` and `response` objects might be undefined ([#3814](https://github.com/hey-api/hey-api/pull/3814)) ([`0d388de`](https://github.com/hey-api/hey-api/commit/0d388de3b85748a6827bcd6407e1e1400f39c3a3)) by [@SukkaW](https://github.com/SukkaW)

- **BREAKING** **plugin(@hey-api/client-ofetch)**: `request` and `response` objects might be undefined ([#3814](https://github.com/hey-api/hey-api/pull/3814)) ([`0d388de`](https://github.com/hey-api/hey-api/commit/0d388de3b85748a6827bcd6407e1e1400f39c3a3)) by [@SukkaW](https://github.com/SukkaW)

- **BREAKING** **plugin(@hey-api/client-ky)**: fix: respect `throwOnError` when request validation fails ([#3814](https://github.com/hey-api/hey-api/pull/3814)) ([`0d388de`](https://github.com/hey-api/hey-api/commit/0d388de3b85748a6827bcd6407e1e1400f39c3a3)) by [@SukkaW](https://github.com/SukkaW)

- **BREAKING** **plugin(@hey-api/client-fetch)**: fix: respect `throwOnError` when request validation fails ([#3814](https://github.com/hey-api/hey-api/pull/3814)) ([`0d388de`](https://github.com/hey-api/hey-api/commit/0d388de3b85748a6827bcd6407e1e1400f39c3a3)) by [@SukkaW](https://github.com/SukkaW)

- **BREAKING** **plugin(@hey-api/client-next)**: fix: pass previous result to error interceptors ([#3814](https://github.com/hey-api/hey-api/pull/3814)) ([`0d388de`](https://github.com/hey-api/hey-api/commit/0d388de3b85748a6827bcd6407e1e1400f39c3a3)) by [@SukkaW](https://github.com/SukkaW)

- **BREAKING** **plugin(@hey-api/client-ky)**: respect ky instance defaults ([#3806](https://github.com/hey-api/hey-api/pull/3806)) ([`d16cf1c`](https://github.com/hey-api/hey-api/commit/d16cf1c1413849bc491a758b096222caa5a82d25)) by [@SukkaW](https://github.com/SukkaW)

### Changed Ky client behavior

The Ky client was updated to be more intuitive. Some Ky options now need to be passed via the `kyOptions` field and you need to pass `undefined` to unset an option.

- **BREAKING** **plugin(@hey-api/client-ofetch)**: fix: respect `throwOnError` when request validation fails ([#3814](https://github.com/hey-api/hey-api/pull/3814)) ([`0d388de`](https://github.com/hey-api/hey-api/commit/0d388de3b85748a6827bcd6407e1e1400f39c3a3)) by [@SukkaW](https://github.com/SukkaW)

- **BREAKING** **plugin(@hey-api/client-next)**: fix: respect `throwOnError` when request validation fails ([#3814](https://github.com/hey-api/hey-api/pull/3814)) ([`0d388de`](https://github.com/hey-api/hey-api/commit/0d388de3b85748a6827bcd6407e1e1400f39c3a3)) by [@SukkaW](https://github.com/SukkaW)

### Patch Changes

- **plugin(@tanstack/vue-query)**: add `setQueryData` option ([#3824](https://github.com/hey-api/hey-api/pull/3824)) ([`1ef4af0`](https://github.com/hey-api/hey-api/commit/1ef4af06d817506134b9077c7c3f034831f4457a)) by [@inas-sirhan](https://github.com/inas-sirhan)

- **plugin(@tanstack/react-query)**: add `useSetQueryData` option ([#3824](https://github.com/hey-api/hey-api/pull/3824)) ([`1ef4af0`](https://github.com/hey-api/hey-api/commit/1ef4af06d817506134b9077c7c3f034831f4457a)) by [@inas-sirhan](https://github.com/inas-sirhan)

- **cli**: print file count and generator speed ([#3828](https://github.com/hey-api/hey-api/pull/3828)) ([`6e5249f`](https://github.com/hey-api/hey-api/commit/6e5249ff3bb10b142e5911697601ad7d2c7d9dbc)) by [@SukkaW](https://github.com/SukkaW)

- **plugin(@tanstack/preact-query)**: add `useSetQueryData` option ([#3824](https://github.com/hey-api/hey-api/pull/3824)) ([`1ef4af0`](https://github.com/hey-api/hey-api/commit/1ef4af06d817506134b9077c7c3f034831f4457a)) by [@inas-sirhan](https://github.com/inas-sirhan)

- **plugin(@tanstack/svelte-query)**: add `setQueryData` option ([#3824](https://github.com/hey-api/hey-api/pull/3824)) ([`1ef4af0`](https://github.com/hey-api/hey-api/commit/1ef4af06d817506134b9077c7c3f034831f4457a)) by [@inas-sirhan](https://github.com/inas-sirhan)

- **plugin(zod)**: fix: fallback `.discriminatedUnion` to `.union` if members contain intersection ([#3813](https://github.com/hey-api/hey-api/pull/3813)) ([`b88e8b5`](https://github.com/hey-api/hey-api/commit/b88e8b5139d62d8d3710aea9d86f15efa3612eb9)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **config**: fix: remove `--apply` flag from Biome post-processor commands ([#3812](https://github.com/hey-api/hey-api/pull/3812)) ([`084de63`](https://github.com/hey-api/hey-api/commit/084de63aa35b09df735e05eb739df3bda508a08f)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(@tanstack/react-query)**: add `setQueryData` option ([#3824](https://github.com/hey-api/hey-api/pull/3824)) ([`1ef4af0`](https://github.com/hey-api/hey-api/commit/1ef4af06d817506134b9077c7c3f034831f4457a)) by [@inas-sirhan](https://github.com/inas-sirhan)

- **plugin(@tanstack/solid-query)**: add `setQueryData` option ([#3824](https://github.com/hey-api/hey-api/pull/3824)) ([`1ef4af0`](https://github.com/hey-api/hey-api/commit/1ef4af06d817506134b9077c7c3f034831f4457a)) by [@inas-sirhan](https://github.com/inas-sirhan)

- **plugin(@tanstack/preact-query)**: add `setQueryData` option ([#3824](https://github.com/hey-api/hey-api/pull/3824)) ([`1ef4af0`](https://github.com/hey-api/hey-api/commit/1ef4af06d817506134b9077c7c3f034831f4457a)) by [@inas-sirhan](https://github.com/inas-sirhan)

- **plugin(@tanstack/angular-query-experimental)**: add `setQueryData` option ([#3824](https://github.com/hey-api/hey-api/pull/3824)) ([`1ef4af0`](https://github.com/hey-api/hey-api/commit/1ef4af06d817506134b9077c7c3f034831f4457a)) by [@inas-sirhan](https://github.com/inas-sirhan)

### Updated Dependencies:

- @hey-api/codegen-core@0.8.1
- @hey-api/shared@0.4.2

## 0.96.1

### Patch Changes

- **parser**: fix: re-add implicitly-filtered schemas in collectOperations ([#3791](https://github.com/hey-api/hey-api/pull/3791)) ([`0d3cb9f`](https://github.com/hey-api/hey-api/commit/0d3cb9f49b9f1d9fa5b47b73a2c85141c0cd78b6)) by [@sbs44](https://github.com/sbs44)

- **plugin(@hey-api/client-fetch)**: fix: narrow `headers` to `Headers` in `ResolvedRequestOptions` ([#3757](https://github.com/hey-api/hey-api/pull/3757)) ([`f69b192`](https://github.com/hey-api/hey-api/commit/f69b192eb1afc16c85c547a25287905f9f38b2cb)) by [@inas-sirhan](https://github.com/inas-sirhan)

- **plugin(zod)**: add support for `.discriminatedUnion()` ([#3780](https://github.com/hey-api/hey-api/pull/3780)) ([`3d8db90`](https://github.com/hey-api/hey-api/commit/3d8db9030fcc5c4a3b26d9da19c79eb1dd96989f)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **parser**: fix: avoid encoding url unsafe characters ([#3782](https://github.com/hey-api/hey-api/pull/3782)) ([`290c14f`](https://github.com/hey-api/hey-api/commit/290c14fba3c104a6e820eaa981b29c3b6a378e16)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(@hey-api/client-next)**: fix: narrow `headers` to `Headers` in `ResolvedRequestOptions` ([#3757](https://github.com/hey-api/hey-api/pull/3757)) ([`aa75345`](https://github.com/hey-api/hey-api/commit/aa753455f827f0a558de7f3bf5856e521b2df7bb)) by [@inas-sirhan](https://github.com/inas-sirhan)

- **plugin(valibot)**: add support for `.variant()` ([#3780](https://github.com/hey-api/hey-api/pull/3780)) ([`3d8db90`](https://github.com/hey-api/hey-api/commit/3d8db9030fcc5c4a3b26d9da19c79eb1dd96989f)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(zod)**: support generating `z.input` and `z.output` types ([#3759](https://github.com/hey-api/hey-api/pull/3759)) ([`cda5297`](https://github.com/hey-api/hey-api/commit/cda5297d1e0ff0a603cb49f55d88668931aa4afe)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/client-ky)**: fix: narrow `headers` to `Headers` in `ResolvedRequestOptions` ([#3757](https://github.com/hey-api/hey-api/pull/3757)) ([`ab2b315`](https://github.com/hey-api/hey-api/commit/ab2b315f4ab848d886b81cb374ea2e3490a39dff)) by [@inas-sirhan](https://github.com/inas-sirhan)

- **output**: fix: surface postprocess errors ([#3683](https://github.com/hey-api/hey-api/pull/3683)) ([`e69d79f`](https://github.com/hey-api/hey-api/commit/e69d79f0d7de8a0a2f955457a522b88f505ae80d)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(@hey-api/client-angular)**: fix: narrow `headers` to `Headers` in `ResolvedRequestOptions` ([#3757](https://github.com/hey-api/hey-api/pull/3757)) ([`4ee9bd3`](https://github.com/hey-api/hey-api/commit/4ee9bd303855162ade829ba16d8259dea0e73514)) by [@inas-sirhan](https://github.com/inas-sirhan)

- **plugin(@hey-api/client-ofetch)**: fix: narrow `headers` to `Headers` in `ResolvedRequestOptions` ([#3757](https://github.com/hey-api/hey-api/pull/3757)) ([`4f5afb9`](https://github.com/hey-api/hey-api/commit/4f5afb98355784765a7dfc4d905d3893ea5799a0)) by [@inas-sirhan](https://github.com/inas-sirhan)

- **config**: warn on duplicated plugin configurations ([#3753](https://github.com/hey-api/hey-api/pull/3753)) ([`e78ce75`](https://github.com/hey-api/hey-api/commit/e78ce75bcc63374cd9ec4178bfe18a2e09ca128d)) by [@inas-sirhan](https://github.com/inas-sirhan)

### Updated Dependencies:

- @hey-api/shared@0.4.1
- @hey-api/json-schema-ref-parser@1.4.1

## 0.96.0

### Minor Changes

- **BREAKING**: This release bumps the minimum required Node version to 22.13. ([#3694](https://github.com/hey-api/hey-api/pull/3694)) ([`e930278`](https://github.com/hey-api/hey-api/commit/e930278d5fcd74545b0fc5d600b524e895d4fe6a)) by [@mrlubos](https://github.com/mrlubos)

### Patch Changes

- **plugin(@hey-api/client-axios)**: simplify SSE line endings normalization ([#3686](https://github.com/hey-api/hey-api/pull/3686)) ([`c9c1d44`](https://github.com/hey-api/hey-api/commit/c9c1d44132f0eb44273fbf3b878a832bae3ee968)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/client-fetch)**: simplify SSE line endings normalization ([#3686](https://github.com/hey-api/hey-api/pull/3686)) ([`c9c1d44`](https://github.com/hey-api/hey-api/commit/c9c1d44132f0eb44273fbf3b878a832bae3ee968)) by [@mrlubos](https://github.com/mrlubos)

- **parser**: fix: keep orphans when explicitly included in filters ([#3714](https://github.com/hey-api/hey-api/pull/3714)) ([`8e2c4b1`](https://github.com/hey-api/hey-api/commit/8e2c4b1f2a1624f27d5da74a4816cdc10435e4b1)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/client-next)**: simplify SSE line endings normalization ([#3686](https://github.com/hey-api/hey-api/pull/3686)) ([`c9c1d44`](https://github.com/hey-api/hey-api/commit/c9c1d44132f0eb44273fbf3b878a832bae3ee968)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/client-nuxt)**: simplify SSE line endings normalization ([#3686](https://github.com/hey-api/hey-api/pull/3686)) ([`c9c1d44`](https://github.com/hey-api/hey-api/commit/c9c1d44132f0eb44273fbf3b878a832bae3ee968)) by [@mrlubos](https://github.com/mrlubos)

- **cli**: improve error message on invalid input ([#3679](https://github.com/hey-api/hey-api/pull/3679)) ([`b643d7d`](https://github.com/hey-api/hey-api/commit/b643d7d400492489a24918534991dfb3f1443abc)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@angular/common)**: fix: requests and resources broken default configuration ([#3678](https://github.com/hey-api/hey-api/pull/3678)) ([`7ad5a2c`](https://github.com/hey-api/hey-api/commit/7ad5a2c26e0c009e0cf32a6b526b83f505258fe4)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(@hey-api/client-ky)**: simplify SSE line endings normalization ([#3686](https://github.com/hey-api/hey-api/pull/3686)) ([`c9c1d44`](https://github.com/hey-api/hey-api/commit/c9c1d44132f0eb44273fbf3b878a832bae3ee968)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/transformers)**: fix: return value for primitive array entries ([#3733](https://github.com/hey-api/hey-api/pull/3733)) ([`43ff064`](https://github.com/hey-api/hey-api/commit/43ff06437e6c9230bfcca324f28f337959201697)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(@hey-api/client-angular)**: simplify SSE line endings normalization ([#3686](https://github.com/hey-api/hey-api/pull/3686)) ([`c9c1d44`](https://github.com/hey-api/hey-api/commit/c9c1d44132f0eb44273fbf3b878a832bae3ee968)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/client-ofetch)**: simplify SSE line endings normalization ([#3686](https://github.com/hey-api/hey-api/pull/3686)) ([`c9c1d44`](https://github.com/hey-api/hey-api/commit/c9c1d44132f0eb44273fbf3b878a832bae3ee968)) by [@mrlubos](https://github.com/mrlubos)

- **parser**: fix: process enum metadata ([#3727](https://github.com/hey-api/hey-api/pull/3727)) ([`397b63f`](https://github.com/hey-api/hey-api/commit/397b63fe6e1093181f7f4a0b99d3cf0db9daab93)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

### Updated Dependencies:

- @hey-api/shared@0.4.0
- @hey-api/spec-types@0.2.0
- @hey-api/json-schema-ref-parser@1.4.0
- @hey-api/codegen-core@0.8.0

## 0.95.0

### Minor Changes

- **plugin(valibot)**: remove request data schema ([#3671](https://github.com/hey-api/hey-api/pull/3671)) ([`96f60ad`](https://github.com/hey-api/hey-api/commit/96f60adb6af144e39133884e97e74a6693b6c059)) by [@mrlubos](https://github.com/mrlubos)

### Validator request schemas

Valibot plugin no longer exports composite request `Data` schemas. Instead, each layer is exported as a separate schema. If you're using validators with SDKs, you can preserve the composite schema with `shouldExtract`:

```js
export default {
  input: "hey-api/backend", // sign up at app.heyapi.dev
  output: "src/client",
  plugins: [
    // ...other plugins
    {
      name: "sdk",
      validator: "valibot",
    },
    {
      name: "valibot",
      requests: {
        shouldExtract: true,
      },
    },
  ],
};
```

- **internal**: remove `plugin.getSymbol()` function ([#3671](https://github.com/hey-api/hey-api/pull/3671)) ([`96f60ad`](https://github.com/hey-api/hey-api/commit/96f60adb6af144e39133884e97e74a6693b6c059)) by [@mrlubos](https://github.com/mrlubos)

### Removed `plugin.getSymbol()` function

This function has been removed. You can use `plugin.querySymbol()` instead. It accepts the same arguments and returns the same result.

- **plugin(zod)**: remove request data schema ([#3671](https://github.com/hey-api/hey-api/pull/3671)) ([`96f60ad`](https://github.com/hey-api/hey-api/commit/96f60adb6af144e39133884e97e74a6693b6c059)) by [@mrlubos](https://github.com/mrlubos)

### Validator request schemas

Zod plugin no longer exports composite request `Data` schemas. Instead, each layer is exported as a separate schema. If you're using validators with SDKs, you can preserve the composite schema with `shouldExtract`:

```js
export default {
  input: "hey-api/backend", // sign up at app.heyapi.dev
  output: "src/client",
  plugins: [
    // ...other plugins
    {
      name: "sdk",
      validator: "zod",
    },
    {
      name: "zod",
      requests: {
        shouldExtract: true,
      },
    },
  ],
};
```

### Patch Changes

- **plugin(@hey-api/client-axios)**: fix: improve `beforeRequest` typing ([#3660](https://github.com/hey-api/hey-api/pull/3660)) ([`f3f887e`](https://github.com/hey-api/hey-api/commit/f3f887e41931f11757ab9f1b90c4d04e0b023b6a)) by [@tomvdv](https://github.com/tomvdv)

- **plugin(zod)**: export request body, path, query, and headers schemas ([#3671](https://github.com/hey-api/hey-api/pull/3671)) ([`96f60ad`](https://github.com/hey-api/hey-api/commit/96f60adb6af144e39133884e97e74a6693b6c059)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/client-ky)**: fix: improve `beforeRequest` typing ([#3660](https://github.com/hey-api/hey-api/pull/3660)) ([`d65b5c7`](https://github.com/hey-api/hey-api/commit/d65b5c72335592244c833d1b6b95003de60428fe)) by [@tomvdv](https://github.com/tomvdv)

- **plugin(@hey-api/client-next)**: fix: improve `beforeRequest` typing ([#3660](https://github.com/hey-api/hey-api/pull/3660)) ([`a4b13d4`](https://github.com/hey-api/hey-api/commit/a4b13d456ae5d2b6c66a9ddca84a25a60bc3cc6e)) by [@tomvdv](https://github.com/tomvdv)

- **plugin(@hey-api/client-angular)**: fix: improve `beforeRequest` typing ([#3660](https://github.com/hey-api/hey-api/pull/3660)) ([`9ecc562`](https://github.com/hey-api/hey-api/commit/9ecc56250de985b372704c5ea80889342ddc4659)) by [@tomvdv](https://github.com/tomvdv)

- **plugin(orpc)**: fix: adjust input shape ([#3671](https://github.com/hey-api/hey-api/pull/3671)) ([`96f60ad`](https://github.com/hey-api/hey-api/commit/96f60adb6af144e39133884e97e74a6693b6c059)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/client-fetch)**: fix: improve `beforeRequest` typing ([#3660](https://github.com/hey-api/hey-api/pull/3660)) ([`11be579`](https://github.com/hey-api/hey-api/commit/11be579c46d5add69ed733f1f8a33f31794ec6c5)) by [@tomvdv](https://github.com/tomvdv)

- **plugin(valibot)**: export request body, path, query, and headers schemas ([#3671](https://github.com/hey-api/hey-api/pull/3671)) ([`96f60ad`](https://github.com/hey-api/hey-api/commit/96f60adb6af144e39133884e97e74a6693b6c059)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/sdk)**: improve types for SSE events ([#3466](https://github.com/hey-api/hey-api/pull/3466)) ([`51ff11a`](https://github.com/hey-api/hey-api/commit/51ff11ace8719085868aede8bc45cbf3356ad327)) by [@bilby91](https://github.com/bilby91)

### Updated Dependencies:

- @hey-api/shared@0.3.0

## 0.94.5

### Patch Changes

- **plugin(orpc)**: remove `base` export ([#3638](https://github.com/hey-api/hey-api/pull/3638)) ([`c510098`](https://github.com/hey-api/hey-api/commit/c5100983cbdfa3f84aa41d30368d87eb4a807087)) by [@mrlubos](https://github.com/mrlubos)

- **internal**: expand TypeScript peer dependency range ([#3640](https://github.com/hey-api/hey-api/pull/3640)) ([`5d3b8f9`](https://github.com/hey-api/hey-api/commit/5d3b8f9d9fee999a4ac55c3c678542552aea9811)) by [@mrlubos](https://github.com/mrlubos)

- **plugin**: fix: `symbolOnce()` method correctly handles multiple symbols with the same metadata ([#3635](https://github.com/hey-api/hey-api/pull/3635)) ([`6c1120c`](https://github.com/hey-api/hey-api/commit/6c1120cca981880718171327c4c0ae6c295c0638)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(@hey-api/transformers)**: fix: handle additional properties ([#3409](https://github.com/hey-api/hey-api/pull/3409)) ([`4de44fc`](https://github.com/hey-api/hey-api/commit/4de44fc8eefdb0c007de23c2e8d1eb3de6a6c32a)) by [@codercms](https://github.com/codercms)

- **internal**: add `@hey-api/spec-types` dependency ([#3652](https://github.com/hey-api/hey-api/pull/3652)) ([`4852795`](https://github.com/hey-api/hey-api/commit/485279556f4c73d187a9a2172010b51b2b6ef902)) by [@mrlubos](https://github.com/mrlubos)

### Updated Dependencies:

- @hey-api/spec-types@0.1.0
- @hey-api/shared@0.2.6

## 0.94.4

### Patch Changes

- **plugin(orpc)**: initial release ([#3264](https://github.com/hey-api/hey-api/pull/3264)) ([`8e1e62d`](https://github.com/hey-api/hey-api/commit/8e1e62dbf88590542ac8bdf3584f9be881ea25fc)) by [@hyoban](https://github.com/hyoban)

## 0.94.3

### Patch Changes

- **output**: pass context as second argument in `module.resolve()` function ([#3615](https://github.com/hey-api/hey-api/pull/3615)) ([`b6a65d6`](https://github.com/hey-api/hey-api/commit/b6a65d6bb3ff1895f2189af858e3424733154bdf)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/client-nuxt)**: preserve AbortSignal, FormData, and ReadableStream in unwrapRefs ([#3614](https://github.com/hey-api/hey-api/pull/3614)) ([`129afa0`](https://github.com/hey-api/hey-api/commit/129afa052b61d71fe4d0d7f5568b4ea38dead44c)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **parser**: fix: self-referencing discriminator ([#3601](https://github.com/hey-api/hey-api/pull/3601)) ([`857eb19`](https://github.com/hey-api/hey-api/commit/857eb1983fa1ab0f048d426a31835ede563a2c00)) by [@pgraug](https://github.com/pgraug)

- **output**: add `module` option ([#3616](https://github.com/hey-api/hey-api/pull/3616)) ([`e4eea23`](https://github.com/hey-api/hey-api/commit/e4eea23ab23fb704dfdb9aaad63989be34d5093c)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/transformers)**: expose `plugin` and `$` in transformer function context ([#3610](https://github.com/hey-api/hey-api/pull/3610)) ([`18ccc81`](https://github.com/hey-api/hey-api/commit/18ccc81ae75718157949c9724d86d6225f0c0eb0)) by [@mrlubos](https://github.com/mrlubos)

### Updated Dependencies:

- @hey-api/shared@0.2.5
- @hey-api/codegen-core@0.7.4

## 0.94.2

### Patch Changes

- **internal**: export Plugins namespace ([#3586](https://github.com/hey-api/hey-api/pull/3586)) ([`12827e3`](https://github.com/hey-api/hey-api/commit/12827e333b9c1b810607c8a948ab3a909a920678)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(nestjs)**: initial release ([#3573](https://github.com/hey-api/hey-api/pull/3573)) ([`e596edb`](https://github.com/hey-api/hey-api/commit/e596edbe799e51c21783239bfb524c7342df365b)) by [@mikhin](https://github.com/mikhin)

- **internal**: expand TypeScript peer dependency range ([#3588](https://github.com/hey-api/hey-api/pull/3588)) ([`ae5ecc9`](https://github.com/hey-api/hey-api/commit/ae5ecc943f41c19bdc77a477c00b68ceb8ab3d52)) by [@mrlubos](https://github.com/mrlubos)

- **output**: pass default value to `header` function ([#3585](https://github.com/hey-api/hey-api/pull/3585)) ([`c076e4d`](https://github.com/hey-api/hey-api/commit/c076e4d3e9697d8bbc72db13a31d44627c814c2d)) by [@mrlubos](https://github.com/mrlubos)

### Updated Dependencies:

- @hey-api/shared@0.2.4
- @hey-api/codegen-core@0.7.3
- @hey-api/types@0.1.4

## 0.94.1

### Patch Changes

- **plugin(@hey-api/typescript)**: add Resolvers API ([#3531](https://github.com/hey-api/hey-api/pull/3531)) ([`0e47fcb`](https://github.com/hey-api/hey-api/commit/0e47fcbf87560f1d59b74d01c704a0e42648febb)) by [@mrlubos](https://github.com/mrlubos)

- **dsl**: expand list of JavaScript globals ([#3508](https://github.com/hey-api/hey-api/pull/3508)) ([`1e00a69`](https://github.com/hey-api/hey-api/commit/1e00a6983eaa56acaf98663310fb9e3122d1d575)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(valibot)**: provide more resolvers ([#3547](https://github.com/hey-api/hey-api/pull/3547)) ([`854ee1c`](https://github.com/hey-api/hey-api/commit/854ee1cbdf322f7c3f02441d02eeb4b0dbe747aa)) by [@mrlubos](https://github.com/mrlubos)

- **cli**: show environment value in development ([#3546](https://github.com/hey-api/hey-api/pull/3546)) ([`571bc8a`](https://github.com/hey-api/hey-api/commit/571bc8a32b55647083bb506d4a5b575c4736cb94)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(zod)**: handle `guid` string format ([#3552](https://github.com/hey-api/hey-api/pull/3552)) ([`7acb228`](https://github.com/hey-api/hey-api/commit/7acb228c7c4e1dd5d7b70ee576a007ee1c9682cd)) by [@erikwski](https://github.com/erikwski)

- **plugin(@hey-api/typescript)**: implement `getName()` symbol hook ([#3556](https://github.com/hey-api/hey-api/pull/3556)) ([`68c750a`](https://github.com/hey-api/hey-api/commit/68c750ab7ad37c71c4f9b267ddc9e1c90c89924a)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(zod)**: implement `getName()` symbol hook ([#3556](https://github.com/hey-api/hey-api/pull/3556)) ([`68c750a`](https://github.com/hey-api/hey-api/commit/68c750ab7ad37c71c4f9b267ddc9e1c90c89924a)) by [@mrlubos](https://github.com/mrlubos)

- **config(plugins)**: show warning when plugin infer fails ([#3540](https://github.com/hey-api/hey-api/pull/3540)) ([`0512650`](https://github.com/hey-api/hey-api/commit/0512650988ce3c411492172e6bbe300f5440408f)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(valibot)**: implement `getName()` symbol hook ([#3556](https://github.com/hey-api/hey-api/pull/3556)) ([`68c750a`](https://github.com/hey-api/hey-api/commit/68c750ab7ad37c71c4f9b267ddc9e1c90c89924a)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/transformers)**: fix: support `anyOf` schema with null ([#3504](https://github.com/hey-api/hey-api/pull/3504)) ([`4b6b398`](https://github.com/hey-api/hey-api/commit/4b6b398c59746167b93857f6ab475a7a88ddbcd4)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(zod)**: provide more resolvers ([#3554](https://github.com/hey-api/hey-api/pull/3554)) ([`bfa255c`](https://github.com/hey-api/hey-api/commit/bfa255c0db03a869dd99cd16736acef6abe39987)) by [@mrlubos](https://github.com/mrlubos)

### Updated Dependencies:

- @hey-api/codegen-core@0.7.2
- @hey-api/shared@0.2.3

## 0.94.0

### Minor Changes

- **BREAKING** **client**: `buildUrl()` function includes `baseUrl` from config by default ([#3491](https://github.com/hey-api/hey-api/pull/3491)) ([`c0cbffb`](https://github.com/hey-api/hey-api/commit/c0cbffb9413c6f1cc12b41069af6ddb031401742)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

### Patch Changes

- **dsl(reserved)**: expand reserved keywords with more globals ([#3487](https://github.com/hey-api/hey-api/pull/3487)) ([`89a9151`](https://github.com/hey-api/hey-api/commit/89a9151b8d456796aa861c2a015af9bc1a300eb2)) by [@mrlubos](https://github.com/mrlubos)

- **parser**: fix: explicit discriminator mapping wins over fallback in nested `allOf` ([#3490](https://github.com/hey-api/hey-api/pull/3490)) ([`a67d589`](https://github.com/hey-api/hey-api/commit/a67d589e1f8e5860bd05d5caff134dd6a7eed6e2)) by [@pgraug](https://github.com/pgraug)

- **plugin(@pinia/colada)**: fix: pass error type generic to `defineQueryOptions` ([#3483](https://github.com/hey-api/hey-api/pull/3483)) ([`8e5a578`](https://github.com/hey-api/hey-api/commit/8e5a57855c03a2a49f9c62398f5bdf1fa989f4de)) by [@lukaspodmelle](https://github.com/lukaspodmelle)

- **plugin(@tanstack/react-query)**: support generating `useMutation` hooks ([#3432](https://github.com/hey-api/hey-api/pull/3432)) ([`12d7660`](https://github.com/hey-api/hey-api/commit/12d76605e3dfb4204f9971dff7254be69c0a7359)) by [@nmokkenstorm](https://github.com/nmokkenstorm)

- **plugin(typescript)**: fix: reference enum object when creating enum types ([#3500](https://github.com/hey-api/hey-api/pull/3500)) ([`127e67b`](https://github.com/hey-api/hey-api/commit/127e67b9b761889751e25d95fe5900508e6fd151)) by [@mrlubos](https://github.com/mrlubos)

- **output(header)**: fix: support function signature in client and core files ([#3486](https://github.com/hey-api/hey-api/pull/3486)) ([`942913a`](https://github.com/hey-api/hey-api/commit/942913af15ae10c5fc3c5e456800829b7dd9c10a)) by [@mrlubos](https://github.com/mrlubos)

- **output**: fix: avoid double sanitizing leading character ([#3448](https://github.com/hey-api/hey-api/pull/3448)) ([`c50f7bc`](https://github.com/hey-api/hey-api/commit/c50f7bcf5676f2783a412288d243aeaeabd9f8bd)) by [@mrlubos](https://github.com/mrlubos)

- **internal**: fix: simplify dev mode check ([#3498](https://github.com/hey-api/hey-api/pull/3498)) ([`ea2538b`](https://github.com/hey-api/hey-api/commit/ea2538b221605ee1ba900d173394cd4f0aab8b12)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(zod)**: support function in `metadata` option ([#3497](https://github.com/hey-api/hey-api/pull/3497)) ([`1ed39bc`](https://github.com/hey-api/hey-api/commit/1ed39bc3ed713edd7ecdcc997fac1c7487b07105)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(valibot)**: support function in `metadata` option ([#3497](https://github.com/hey-api/hey-api/pull/3497)) ([`202cc05`](https://github.com/hey-api/hey-api/commit/202cc054a7221d8ea7b63881785d314104ab01d2)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **internal**: log symbol meta if name is falsy ([#3448](https://github.com/hey-api/hey-api/pull/3448)) ([`c50f7bc`](https://github.com/hey-api/hey-api/commit/c50f7bcf5676f2783a412288d243aeaeabd9f8bd)) by [@mrlubos](https://github.com/mrlubos)

- **client**: fix: change serializer types from `any` to `unknown` ([#3471](https://github.com/hey-api/hey-api/pull/3471)) ([`ad11be2`](https://github.com/hey-api/hey-api/commit/ad11be241c494d23930ce8f76e57eb7afa631c67)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(@tanstack/preact-query)**: initial release ([#3499](https://github.com/hey-api/hey-api/pull/3499)) ([`873839e`](https://github.com/hey-api/hey-api/commit/873839e065a7919fcf736348c15238bd3b6c3d15)) by [@mrlubos](https://github.com/mrlubos)

### Updated Dependencies:

- @hey-api/shared@0.2.2
- @hey-api/codegen-core@0.7.1

## 0.93.1

### Patch Changes

- **plugin(@tanstack/query)**: fix: skip mutation queries for SSE endpoints ([#3470](https://github.com/hey-api/hey-api/pull/3470)) ([`3ca4f31`](https://github.com/hey-api/hey-api/commit/3ca4f317e422bb58345cb794faf979e26f10d127)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **client**: fix: avoid removing empty arrays from flat arguments ([#3451](https://github.com/hey-api/hey-api/pull/3451)) ([`1518fda`](https://github.com/hey-api/hey-api/commit/1518fda8372b5fb27085f4b296a77b922c340885)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(zod)**: fix: apply nullable modifier to `additionalProperties` schema ([#3452](https://github.com/hey-api/hey-api/pull/3452)) ([`2e903af`](https://github.com/hey-api/hey-api/commit/2e903af5d09881949b042bbd9aba516f3237764d)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **cli**: fix: do not set `logs.file` to `true` by default ([#3469](https://github.com/hey-api/hey-api/pull/3469)) ([`9e3d347`](https://github.com/hey-api/hey-api/commit/9e3d347d4b7a36c9d04b2f9c2d4988ece03677d8)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(@hey-api/sdk)**: fix: correctly set required flat parameters ([#3458](https://github.com/hey-api/hey-api/pull/3458)) ([`bf50a55`](https://github.com/hey-api/hey-api/commit/bf50a559670311a866ff8b104c169ef7619fb202)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(zod)**: add `u` flag on regex patterns with unicode property escapes ([#3468](https://github.com/hey-api/hey-api/pull/3468)) ([`67ad86a`](https://github.com/hey-api/hey-api/commit/67ad86a7e37a16125fc5a26eaad5859de43ccac3)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(valibot)**: add `u` flag on regex patterns with unicode property escapes ([#3468](https://github.com/hey-api/hey-api/pull/3468)) ([`003d914`](https://github.com/hey-api/hey-api/commit/003d91422cc831de782015c640b9bcbce9f17dd9)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(@hey-api/typescript)**: simplify union types if a member is `unknown` ([#3454](https://github.com/hey-api/hey-api/pull/3454)) ([`96d87df`](https://github.com/hey-api/hey-api/commit/96d87df7cf49bd1e8ce2dc196fcacc57270e4954)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **client(@hey-api/nuxt)**: fix: do not unwrap blob values ([#3459](https://github.com/hey-api/hey-api/pull/3459)) ([`b7233d1`](https://github.com/hey-api/hey-api/commit/b7233d1d3cc5de84b02c9dc8a27c3cb84235d752)) by [@LeiCraft](https://github.com/LeiCraft)

- **client**: support async `createClientConfig` ([#3445](https://github.com/hey-api/hey-api/pull/3445)) ([`cd33d86`](https://github.com/hey-api/hey-api/commit/cd33d867857fbe9b4daf3c164f892d89946c4beb)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

## 0.93.0

### Minor Changes

- **plugin(valibot)**: remove `enum.nodes.nullable` resolver node ([#3396](https://github.com/hey-api/hey-api/pull/3396)) ([`ea6f386`](https://github.com/hey-api/hey-api/commit/ea6f3865c8e381b3160e1526435c4522f0dc6aa4)) by [@mrlubos](https://github.com/mrlubos)

### Removed resolver node

Valibot plugin no longer exposes the `enum.nodes.nullable` node. It was refactored so that nullable values are handled outside of resolvers.

- **plugin(zod)**: remove `enum.nodes.nullable` resolver node ([#3398](https://github.com/hey-api/hey-api/pull/3398)) ([`737730c`](https://github.com/hey-api/hey-api/commit/737730c9c6450c60a81a8949259336e790e9b4f4)) by [@mrlubos](https://github.com/mrlubos)

### Removed resolver node

Zod plugin no longer exposes the `enum.nodes.nullable` node. It was refactored so that nullable values are handled outside of resolvers.

### Patch Changes

- **parser**: prefer unprefixed schema names from external files ([#3417](https://github.com/hey-api/hey-api/pull/3417)) ([`f3a264b`](https://github.com/hey-api/hey-api/commit/f3a264b2c5d7af06bb44fa0350ef613bde3aff87)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **parser(patch)**: support callback for `patch.schemas` ([#3415](https://github.com/hey-api/hey-api/pull/3415)) ([`e494f4d`](https://github.com/hey-api/hey-api/commit/e494f4dd828167a0096a0a488b222a013f911055)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **output**: fix: apply `output.header` to bundled files ([#3438](https://github.com/hey-api/hey-api/pull/3438)) ([`bcd0a87`](https://github.com/hey-api/hey-api/commit/bcd0a87cdd366cef572eb920b59c115ae65f67bb)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **parser**: handle OpenAPI 3.1 `contentMediaType` keyword as binary format when file-like ([#3431](https://github.com/hey-api/hey-api/pull/3431)) ([`d6a8538`](https://github.com/hey-api/hey-api/commit/d6a85381e3c52b4fd1c4af43ee57506459db7a45)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **input**: fix: improve returned status code when spec fetch fails ([#3427](https://github.com/hey-api/hey-api/pull/3427)) ([`37dd92c`](https://github.com/hey-api/hey-api/commit/37dd92c6629511860ae434c64ac8af9154ed6aed)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **client**: expose `onRequest` in RequestOptions for SSE request interception ([#3392](https://github.com/hey-api/hey-api/pull/3392)) ([`8fc4681`](https://github.com/hey-api/hey-api/commit/8fc46819d5df1d4a353be5ae7cd45a8c669a5d7e)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **parser**: add `patch.input` and shorthand `patch()` option for full specification transformations ([#3411](https://github.com/hey-api/hey-api/pull/3411)) ([`ba9f893`](https://github.com/hey-api/hey-api/commit/ba9f893d71b959721e177717ae85fce34d697002)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **parser**: fix: preserve `unevaluatedProperties` keyword in transforms ([#3435](https://github.com/hey-api/hey-api/pull/3435)) ([`f659b38`](https://github.com/hey-api/hey-api/commit/f659b38701795d2c2b61c8d3f5c43af93893481a)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(zod)**: use `.nullable()` and `.nullish()` methods ([#3398](https://github.com/hey-api/hey-api/pull/3398)) ([`737730c`](https://github.com/hey-api/hey-api/commit/737730c9c6450c60a81a8949259336e790e9b4f4)) by [@mrlubos](https://github.com/mrlubos)

- **parser**: fix: resolve sibling schemas from external files during bundling ([#3422](https://github.com/hey-api/hey-api/pull/3422)) ([`19fd80a`](https://github.com/hey-api/hey-api/commit/19fd80aff26b1198d6838d48357702c39ad05501)) by [@j-westover](https://github.com/j-westover)

- **parser(transforms)**: add `schemaName` transform ([#3416](https://github.com/hey-api/hey-api/pull/3416)) ([`4b9d032`](https://github.com/hey-api/hey-api/commit/4b9d032c6a144fa79cedc28e077782b9d67803a3)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(valibot)**: use `.nullable()` and `.nullish()` methods ([#3396](https://github.com/hey-api/hey-api/pull/3396)) ([`ea6f386`](https://github.com/hey-api/hey-api/commit/ea6f3865c8e381b3160e1526435c4522f0dc6aa4)) by [@mrlubos](https://github.com/mrlubos)

- **input**: fix: avoid prefixing sources if paths do not collide on operations ([#3436](https://github.com/hey-api/hey-api/pull/3436)) ([`b1a419a`](https://github.com/hey-api/hey-api/commit/b1a419a835c312a1f8bf36a5b781109368041220)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **parser(patch)**: support callback for `patch.operations` ([#3420](https://github.com/hey-api/hey-api/pull/3420)) ([`e1cd970`](https://github.com/hey-api/hey-api/commit/e1cd970e4f3028b29ace44a58b2d2cae18a6c45f)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **parser**: add support for non-string discriminator property types ([#3385](https://github.com/hey-api/hey-api/pull/3385)) ([`dd0be9c`](https://github.com/hey-api/hey-api/commit/dd0be9c6ca93552c3367ca8e8ba785381295a112)) by [@SipanP](https://github.com/SipanP)

### Updated Dependencies:

- @hey-api/shared@0.2.1
- @hey-api/json-schema-ref-parser@1.3.1

## 0.92.4

### Patch Changes

- **plugin(@hey-api/transformers)**: fix: false positive warning for discriminated `oneOf` schemas ([#3379](https://github.com/hey-api/hey-api/pull/3379)) ([`1f7c262`](https://github.com/hey-api/hey-api/commit/1f7c262f17b45093ae19d060ae26270c91b3ad41)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(@hey-api/client-nuxt)**: fix: forward `asyncDataOptions` to `useFetch` and `useLazyFetch` ([#3382](https://github.com/hey-api/hey-api/pull/3382)) ([`a4b7399`](https://github.com/hey-api/hey-api/commit/a4b73998e1985f236aee1bbe76611e8d3413f4c6)) by [@rigtigeEmil](https://github.com/rigtigeEmil)

- **output**: detect `importFileExtension` from tsconfig `module` option ([#3380](https://github.com/hey-api/hey-api/pull/3380)) ([`4cbc307`](https://github.com/hey-api/hey-api/commit/4cbc307862e4357a42afe8fb595036f86279babd)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(@hey-api/typescript)**: fix: deduplicate enum keys to avoid name collision ([#3376](https://github.com/hey-api/hey-api/pull/3376)) ([`54138b6`](https://github.com/hey-api/hey-api/commit/54138b6771618d464f3b930fdf7af23290c00076)) by [@spikesagal](https://github.com/spikesagal)

- **plugin(@hey-api/client-nuxt)**: unwrap `ComputedRef` body before initial serialization ([#3361](https://github.com/hey-api/hey-api/pull/3361)) ([`ca52649`](https://github.com/hey-api/hey-api/commit/ca52649a2f479478cc2842677c21c1bcfac69160)) by [@rigtigeEmil](https://github.com/rigtigeEmil)

- **plugin(@angular/common)**: use generics for HttpRequests ([#3384](https://github.com/hey-api/hey-api/pull/3384)) ([`a94f50f`](https://github.com/hey-api/hey-api/commit/a94f50fef84f2387b9ca686ff47370030007e7a2)) by [@quartepie](https://github.com/quartepie)

- **plugin(@hey-api/transformers)**: fix: handle `$ref` keywords in `allOf` compositions ([#3374](https://github.com/hey-api/hey-api/pull/3374)) ([`4b781aa`](https://github.com/hey-api/hey-api/commit/4b781aa18bc9f5bfde302c0359bfe9f3ad3effa7)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **internal**: use shared schema processor ([#3370](https://github.com/hey-api/hey-api/pull/3370)) ([`27cd91f`](https://github.com/hey-api/hey-api/commit/27cd91f530bd77da6ea95df1704b2947917b4626)) by [@mrlubos](https://github.com/mrlubos)

### Updated Dependencies:

- @hey-api/shared@0.2.0
- @hey-api/json-schema-ref-parser@1.3.0

## 0.92.3

### Patch Changes

- **plugin(zod)**: use namespace import for zod v4 ([#3325](https://github.com/hey-api/hey-api/pull/3325)) ([`e54db3e`](https://github.com/hey-api/hey-api/commit/e54db3e7e34e86c17d5c1fba90d9df9778c4b32d)) by [@mrlubos](https://github.com/mrlubos)

## 0.92.2

### Patch Changes

### Updated Dependencies:

- @hey-api/shared@0.1.2
- @hey-api/codegen-core@0.7.0

## 0.92.1

### Patch Changes

### Updated Dependencies:

- @hey-api/shared@0.1.2
- @hey-api/codegen-core@0.7.0

## 0.92.0

### Minor Changes

- **BREAKING:** **symbol**: replace `exportFrom` array with `getExportFromFilePath()` function ([#3318](https://github.com/hey-api/hey-api/pull/3318)) ([`fefa70e`](https://github.com/hey-api/hey-api/commit/fefa70e6810a539607441535289e98c69a604c0d)) by [@mrlubos](https://github.com/mrlubos)

### Updated Symbol interface

The `exportFrom` property has been replaced with the `getExportFromFilePath()` function. This allows you to dynamically determine export paths based on symbol properties. This is a low-level feature, so you're most likely unaffected.

### Patch Changes

- **config**: rename `exportFromIndex` option to `includeInEntry` ([#3318](https://github.com/hey-api/hey-api/pull/3318)) ([`fefa70e`](https://github.com/hey-api/hey-api/commit/fefa70e6810a539607441535289e98c69a604c0d)) by [@mrlubos](https://github.com/mrlubos)

- **config**: `includeInEntry` accepts function in addition to primitive value ([#3318](https://github.com/hey-api/hey-api/pull/3318)) ([`fefa70e`](https://github.com/hey-api/hey-api/commit/fefa70e6810a539607441535289e98c69a604c0d)) by [@mrlubos](https://github.com/mrlubos)

- **parser**: add `getExportFromFilePath()` hook ([#3318](https://github.com/hey-api/hey-api/pull/3318)) ([`fefa70e`](https://github.com/hey-api/hey-api/commit/fefa70e6810a539607441535289e98c69a604c0d)) by [@mrlubos](https://github.com/mrlubos)

- **plugin**: add `comments` option to all plugins ([#3318](https://github.com/hey-api/hey-api/pull/3318)) ([`fefa70e`](https://github.com/hey-api/hey-api/commit/fefa70e6810a539607441535289e98c69a604c0d)) by [@mrlubos](https://github.com/mrlubos)

- **types**: improve `defineConfig()` types ([#3318](https://github.com/hey-api/hey-api/pull/3318)) ([`fefa70e`](https://github.com/hey-api/hey-api/commit/fefa70e6810a539607441535289e98c69a604c0d)) by [@mrlubos](https://github.com/mrlubos)

- **config**: rename `output.indexFile` to `output.entryFile` ([#3318](https://github.com/hey-api/hey-api/pull/3318)) ([`fefa70e`](https://github.com/hey-api/hey-api/commit/fefa70e6810a539607441535289e98c69a604c0d)) by [@mrlubos](https://github.com/mrlubos)

- **fix**: improve dev mode detection causing builds to fail ([#3318](https://github.com/hey-api/hey-api/pull/3318)) ([`fefa70e`](https://github.com/hey-api/hey-api/commit/fefa70e6810a539607441535289e98c69a604c0d)) by [@mrlubos](https://github.com/mrlubos)

### Updated Dependencies:

- @hey-api/shared@0.1.2
- @hey-api/codegen-core@0.7.0

## 0.91.1

### Patch Changes

### Updated Dependencies:

- @hey-api/codegen-core@0.6.1
- @hey-api/shared@0.1.1

## 0.91.0

### Minor Changes

- **BREAKING**: Drop CommonJS (CJS) support. This package is now **ESM-only**. ([#3251](https://github.com/hey-api/hey-api/pull/3251)) ([`7f19d59`](https://github.com/hey-api/hey-api/commit/7f19d5921dadfa96ecae84a5298b7aee1daee56d)) by [@mrlubos](https://github.com/mrlubos)

### Removed CommonJS (CJS) support

`@hey-api/openapi-ts` is now ESM-only. This change simplifies the codebase, improves tree-shaking, and enables better integration with modern bundlers and TypeScript tooling.

CommonJS entry points (`require()`, `module.exports`) are no longer supported. If you are in a CJS environment, you can still load the package dynamically using `import()` like:

```js
const { defineConfig } = await import("@hey-api/openapi-ts");
```

If you have previously written:

```js
const { defineConfig } = require("@hey-api/openapi-ts");
```

Migrate by updating your static imports:

```js
import { defineConfig } from "@hey-api/openapi-ts";
```

If your environment cannot use ESM, pin to a previous version.

### Patch Changes

### Updated Dependencies:

- @hey-api/shared@0.1.0
- @hey-api/codegen-core@0.6.0
- @hey-api/types@0.1.3

## 0.90.10

### Patch Changes

- **plugin(@tanstack/solid-query)**: index mutation options symbol ([#3253](https://github.com/hey-api/hey-api/pull/3253)) ([`c5f379e`](https://github.com/hey-api/hey-api/commit/c5f379ea5534272d63a423c671427ff1ef13197a)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@tanstack/svelte-query)**: index mutation options symbol ([#3253](https://github.com/hey-api/hey-api/pull/3253)) ([`c5f379e`](https://github.com/hey-api/hey-api/commit/c5f379ea5534272d63a423c671427ff1ef13197a)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@tanstack/vue-query)**: index mutation options symbol ([#3253](https://github.com/hey-api/hey-api/pull/3253)) ([`c5f379e`](https://github.com/hey-api/hey-api/commit/c5f379ea5534272d63a423c671427ff1ef13197a)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@tanstack/react-query)**: index mutation options symbol ([#3253](https://github.com/hey-api/hey-api/pull/3253)) ([`c5f379e`](https://github.com/hey-api/hey-api/commit/c5f379ea5534272d63a423c671427ff1ef13197a)) by [@mrlubos](https://github.com/mrlubos)

- **parser**: inline deep path `$ref` references ([#3242](https://github.com/hey-api/hey-api/pull/3242)) ([`00cfaed`](https://github.com/hey-api/hey-api/commit/00cfaed32a3b1d2a7bbd5c4c2a946a9f7be262b2)) by [@chrg1001](https://github.com/chrg1001)

- **plugin(@tanstack/angular-query-experimental)**: index mutation options symbol ([#3249](https://github.com/hey-api/hey-api/pull/3249)) ([`5977f56`](https://github.com/hey-api/hey-api/commit/5977f56362351a9e4f1e9715c141a8e37130a4bb)) by [@j-ibarra](https://github.com/j-ibarra)

- **plugin(@hey-api/sdk)**: correctly map body keys in flat mode ([#3255](https://github.com/hey-api/hey-api/pull/3255)) ([`9ca5471`](https://github.com/hey-api/hey-api/commit/9ca547168c7a89acb0523bd05a5ee24aee7d8638)) by [@jsjames](https://github.com/jsjames)

## 0.90.9

### Patch Changes

- **ts-dsl**: allow removing object properties by passing `null` ([#3247](https://github.com/hey-api/hey-api/pull/3247)) ([`7be1561`](https://github.com/hey-api/hey-api/commit/7be1561a862d2bb217703003d5e6cbc4a6a09586)) by [@mrlubos](https://github.com/mrlubos)

- **cli**: clean up interface ([#3244](https://github.com/hey-api/hey-api/pull/3244)) ([`4f52bce`](https://github.com/hey-api/hey-api/commit/4f52bce79d8ac6573472f32a05b7f70913b90605)) by [@mrlubos](https://github.com/mrlubos)

- **ts-dsl**: override object properties when called multiple times with the same name ([#3247](https://github.com/hey-api/hey-api/pull/3247)) ([`7be1561`](https://github.com/hey-api/hey-api/commit/7be1561a862d2bb217703003d5e6cbc4a6a09586)) by [@mrlubos](https://github.com/mrlubos)

- **config**: move `loadConfigFile` function to `@hey-api/codegen-core` ([#3244](https://github.com/hey-api/hey-api/pull/3244)) ([`4f52bce`](https://github.com/hey-api/hey-api/commit/4f52bce79d8ac6573472f32a05b7f70913b90605)) by [@mrlubos](https://github.com/mrlubos)

### Updated Dependencies:

- @hey-api/types@0.1.2
- @hey-api/codegen-core@0.5.5

## 0.90.8

### Patch Changes

- **internal**: move logger to codegen-core ([#3235](https://github.com/hey-api/hey-api/pull/3235)) ([`88532f0`](https://github.com/hey-api/hey-api/commit/88532f01200e1111818e82a4af7bd5cf8cf26e3b)) by [@mrlubos](https://github.com/mrlubos)

- **cli**: do not show ascii logo on generate command ([#3238](https://github.com/hey-api/hey-api/pull/3238)) ([`72e17f3`](https://github.com/hey-api/hey-api/commit/72e17f39d6e2d00eff24671e7f2b88801443489a)) by [@mrlubos](https://github.com/mrlubos)

### Updated Dependencies:

- @hey-api/codegen-core@0.5.4

## 0.90.7

### Patch Changes

- **deps**: move @hey-api/types to dependencies to fix broken types ([#3232](https://github.com/hey-api/hey-api/pull/3232)) ([`edfce48`](https://github.com/hey-api/hey-api/commit/edfce4875cb9279d3ab8bfd438ff177e8ba7845c)) by [@mrlubos](https://github.com/mrlubos)

### Updated Dependencies:

- @hey-api/codegen-core@0.5.3

## 0.90.6

### Patch Changes

- **plugin(@hey-api/sdk)**: do not warn on mutualTLS security schemes ([#3227](https://github.com/hey-api/hey-api/pull/3227)) ([`384e52f`](https://github.com/hey-api/hey-api/commit/384e52fdc06c99872b4ad5551acf8bcad616e024)) by [@mrlubos](https://github.com/mrlubos)

## 0.90.5

### Patch Changes

- **plugin(@hey-api/sdk)**: do not warn on mutualTLS security schemes ([#3218](https://github.com/hey-api/hey-api/pull/3218)) ([`97c0a2e`](https://github.com/hey-api/hey-api/commit/97c0a2ec60490f135f4ad438108e36a4229d2c35)) by [@mrlubos](https://github.com/mrlubos)

## 0.90.4

### Patch Changes

- **plugin(@hey-api/client-next)**: fix: JSON parsing error on empty response bodies without Content-Length header ([#3201](https://github.com/hey-api/hey-api/pull/3201)) ([`8428ca5`](https://github.com/hey-api/hey-api/commit/8428ca5152c66d393bcfee9570a6c1d7ad1155c7)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(@hey-api/client-fetch)**: fix: JSON parsing error on empty response bodies without Content-Length header ([#3201](https://github.com/hey-api/hey-api/pull/3201)) ([`2af4d9a`](https://github.com/hey-api/hey-api/commit/2af4d9ab56293c042459e6ae31787cd628be6037)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(@hey-api/client-ky)**: fix: JSON parsing error on empty response bodies without Content-Length header ([#3201](https://github.com/hey-api/hey-api/pull/3201)) ([`c0563fb`](https://github.com/hey-api/hey-api/commit/c0563fbd0f0ec66d25e5316bda0274380ac26639)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(valibot)**: add `enum` resolver ([#3209](https://github.com/hey-api/hey-api/pull/3209)) ([`f6723eb`](https://github.com/hey-api/hey-api/commit/f6723eb59cba4b2c2ffbdbddce3fc26d668e2d4a)) by [@thyming](https://github.com/thyming)

- **plugin(zod)**: add `enum` resolver ([#3209](https://github.com/hey-api/hey-api/pull/3209)) ([`57334d8`](https://github.com/hey-api/hey-api/commit/57334d8c9c83169773a626193ca4c661b3957d37)) by [@thyming](https://github.com/thyming)

## 0.90.3

### Patch Changes

- **output**: add `oxfmt` preset ([#3197](https://github.com/hey-api/hey-api/pull/3197)) ([`701a69c`](https://github.com/hey-api/hey-api/commit/701a69cae24d3068235d80561e2cf9d18d7ccac9)) by [@mrlubos](https://github.com/mrlubos)

## 0.90.2

### Patch Changes

- **build**: do not minify bundles for better code readability and debugging ([#3186](https://github.com/hey-api/hey-api/pull/3186)) ([`4d46130`](https://github.com/hey-api/hey-api/commit/4d46130b53d9d8d5d3c178343a1b4fc3645b2628)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(@hey-api/sdk)**: fix: do not use bodySerializer if format is binary ([#3190](https://github.com/hey-api/hey-api/pull/3190)) ([`dc28c4c`](https://github.com/hey-api/hey-api/commit/dc28c4c6504724104bdef01332b9e3eb52ba3333)) by [@mrlubos](https://github.com/mrlubos)

### Updated Dependencies:

- @hey-api/codegen-core@0.5.2

## 0.90.1

### Patch Changes

- **plugin(@hey-api/sdk)**: add `examples` option ([#3175](https://github.com/hey-api/hey-api/pull/3175)) ([`b985053`](https://github.com/hey-api/hey-api/commit/b985053ffa64accc4ff01b7c0f301bb5cd84ff48)) by [@mrlubos](https://github.com/mrlubos)

The SDK plugin can generate ready-to-use code examples for each operation, showing how to call the SDK methods with proper parameters and setup.

Learn how to generate examples on the [SDK plugin](https://heyapi.dev/openapi-ts/plugins/sdk#code-examples) page.

- **output**: add `source` option ([#3175](https://github.com/hey-api/hey-api/pull/3175)) ([`b985053`](https://github.com/hey-api/hey-api/commit/b985053ffa64accc4ff01b7c0f301bb5cd84ff48)) by [@mrlubos](https://github.com/mrlubos)

Source is a copy of the input specification used to generate your output. It can be used to power documentation tools or to persist a stable snapshot alongside your generated files.

Learn how to use the source on the [Output](https://heyapi.dev/openapi-ts/configuration/output#source) page.

### Updated Dependencies:

- @hey-api/codegen-core@0.5.1

## 0.90.0

### Minor Changes

- **plugin(valibot)**: **BREAKING:** standardize `~resolvers` API ([#3147](https://github.com/hey-api/hey-api/pull/3147)) ([`ab80a4b`](https://github.com/hey-api/hey-api/commit/ab80a4b2c37423c522aa864afbcb688db76615ba)) by [@mrlubos](https://github.com/mrlubos)

The [Resolvers API](https://heyapi.dev/openapi-ts/plugins/concepts/resolvers) has been simplified and expanded to provide a more consistent behavior across plugins. You can view a few common examples on the [Resolvers](https://heyapi.dev/openapi-ts/plugins/concepts/resolvers) page.

- **plugin(sdk)**: **BREAKING**: Structure API ([#3109](https://github.com/hey-api/hey-api/pull/3109)) ([`815a3de`](https://github.com/hey-api/hey-api/commit/815a3de0af434c28ac6d13ff92b85ce1fc146999)) by [@mrlubos](https://github.com/mrlubos)

### Structure API

The [SDK plugin](https://heyapi.dev/openapi-ts/plugins/sdk) now implements the Structure API, enabling more complex structures and fixing several known issues.

Some Structure APIs are incompatible with the previous configuration, most notably the `methodNameBuilder` function, which accepted the operation object as an argument. You can read the [SDK Output](https://heyapi.dev/openapi-ts/plugins/sdk#output) section to familiarize yourself with the Structure API.

Please [open an issue](https://github.com/hey-api/hey-api/issues) if you're unable to migrate your configuration to the new syntax.

- **plugin(zod)**: **BREAKING:** standardize `~resolvers` API ([#3147](https://github.com/hey-api/hey-api/pull/3147)) ([`ab80a4b`](https://github.com/hey-api/hey-api/commit/ab80a4b2c37423c522aa864afbcb688db76615ba)) by [@mrlubos](https://github.com/mrlubos)

The [Resolvers API](https://heyapi.dev/openapi-ts/plugins/concepts/resolvers) has been simplified and expanded to provide a more consistent behavior across plugins. You can view a few common examples on the [Resolvers](https://heyapi.dev/openapi-ts/plugins/concepts/resolvers) page.

- **plugin(@angular/common)**: **BREAKING**: Structure API ([#3109](https://github.com/hey-api/hey-api/pull/3109)) ([`815a3de`](https://github.com/hey-api/hey-api/commit/815a3de0af434c28ac6d13ff92b85ce1fc146999)) by [@mrlubos](https://github.com/mrlubos)

### Structure API

The [Angular plugin](https://heyapi.dev/openapi-ts/plugins/angular) now implements the Structure API, enabling more complex structures and fixing several known issues.

Some Structure APIs are incompatible with the previous configuration, most notably the `methodNameBuilder` function, which accepted the operation object as an argument. You can read the [SDK Output](https://heyapi.dev/openapi-ts/plugins/sdk#output) section to familiarize yourself with the Structure API.

Please [open an issue](https://github.com/hey-api/hey-api/issues) if you're unable to migrate your configuration to the new syntax.

### Patch Changes

- **plugin(@hey-api/client-nuxt)**: use serialized body in SSE requests ([#3123](https://github.com/hey-api/hey-api/pull/3123)) ([`6505659`](https://github.com/hey-api/hey-api/commit/6505659a5b776d03e943582e700a718eddcc2912)) by [@bilby91](https://github.com/bilby91)

- **plugin(zod)**: expand support for bigint types ([#3145](https://github.com/hey-api/hey-api/pull/3145)) ([`4a32dcf`](https://github.com/hey-api/hey-api/commit/4a32dcfae503e76db81fa21ca71c71f20ea28c34)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/client-angular)**: use serialized body in SSE requests ([#3171](https://github.com/hey-api/hey-api/pull/3171)) ([`e63f0cf`](https://github.com/hey-api/hey-api/commit/e63f0cf1018e3014c3c125189fe18ed3fa40d078)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/client-next)**: use serialized body in SSE requests ([#3171](https://github.com/hey-api/hey-api/pull/3171)) ([`e63f0cf`](https://github.com/hey-api/hey-api/commit/e63f0cf1018e3014c3c125189fe18ed3fa40d078)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/client-axios)**: use serialized body in SSE requests ([#3171](https://github.com/hey-api/hey-api/pull/3171)) ([`e63f0cf`](https://github.com/hey-api/hey-api/commit/e63f0cf1018e3014c3c125189fe18ed3fa40d078)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/client-fetch)**: use serialized body in SSE requests ([#3171](https://github.com/hey-api/hey-api/pull/3171)) ([`e63f0cf`](https://github.com/hey-api/hey-api/commit/e63f0cf1018e3014c3c125189fe18ed3fa40d078)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/client-nuxt)**: preserve null in `WithRefs` type for nullable fields ([#3131](https://github.com/hey-api/hey-api/pull/3131)) ([`3935034`](https://github.com/hey-api/hey-api/commit/39350343fe77b6a2700c2b57f03c5b838a92f09e)) by [@rigtigeEmil](https://github.com/rigtigeEmil)

- **renderer**: correctly render default import ([#3109](https://github.com/hey-api/hey-api/pull/3109)) ([`815a3de`](https://github.com/hey-api/hey-api/commit/815a3de0af434c28ac6d13ff92b85ce1fc146999)) by [@mrlubos](https://github.com/mrlubos)

- **plugin(@hey-api/client-ky)**: use serialized body in SSE requests ([#3171](https://github.com/hey-api/hey-api/pull/3171)) ([`e63f0cf`](https://github.com/hey-api/hey-api/commit/e63f0cf1018e3014c3c125189fe18ed3fa40d078)) by [@mrlubos](https://github.com/mrlubos)

### Updated Dependencies:

- @hey-api/codegen-core@0.5.0

## 0.89.2

### Patch Changes

- **plugin(@hey-api/typescript)**: improve type narrowing in discriminated types ([#3120](https://github.com/hey-api/hey-api/pull/3120)) ([`6f8a43c`](https://github.com/hey-api/hey-api/commit/6f8a43c7ffcc8685700c3789c6339aabbac07d2b)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(@hey-api/client-axios)**: revert use `query` option when no `paramsSerializer` is provided ([#3125](https://github.com/hey-api/hey-api/pull/3125)) ([`34c9a92`](https://github.com/hey-api/hey-api/commit/34c9a9214008ede461251f46ab750de37da96bbb)) by [@mrlubos](https://github.com/mrlubos)

## 0.89.1

### Patch Changes

- **parser**: expose OpenAPI extension keywords ([#3119](https://github.com/hey-api/hey-api/pull/3119)) ([`c50190b`](https://github.com/hey-api/hey-api/commit/c50190b02ef2a6b77703a2dbf84b826c4432d56e)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **plugin(@hey-api/client-axios)**: use `query` option when no `paramsSerializer` is provided ([#3062](https://github.com/hey-api/hey-api/pull/3062)) ([`4dcc210`](https://github.com/hey-api/hey-api/commit/4dcc2100b7a96799f36cc64833f7ab69f09d1c54)) by [@JanST123GS](https://github.com/JanST123GS)

- **plugin(@hey-api/sdk)**: lazily initialize sub-resources to improve performance ([#3099](https://github.com/hey-api/hey-api/pull/3099)) ([`f481f5c`](https://github.com/hey-api/hey-api/commit/f481f5cb11f9a8a5e0b1a0baee367f07dd327730)) by [@mrlubos](https://github.com/mrlubos)

- **output**: sanitize reserved names with underscore suffix instead of prefix ([#3102](https://github.com/hey-api/hey-api/pull/3102)) ([`9116082`](https://github.com/hey-api/hey-api/commit/91160826f3c1d0b87090395140d163d930399639)) by [@mrlubos](https://github.com/mrlubos)

- **parser**: improve discriminator support in nested `allOf` fields ([#3117](https://github.com/hey-api/hey-api/pull/3117)) ([`ec1224d`](https://github.com/hey-api/hey-api/commit/ec1224d97d2a8f97d66327bdd372dc82fa794955)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **output**: default to `.js` extension when module resolution is set to `node16` ([#3115](https://github.com/hey-api/hey-api/pull/3115)) ([`18d218a`](https://github.com/hey-api/hey-api/commit/18d218a69f7b2b1b899ad29d3f3892374edf2910)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

## 0.89.0

### Minor Changes

- **output**: add `preferExportAll` option ([#2990](https://github.com/hey-api/hey-api/pull/2990)) ([`c3a81e8`](https://github.com/hey-api/hey-api/commit/c3a81e89ba5ed3f373409582c5f814e1d10cae06)) by [@mrlubos](https://github.com/mrlubos)

### Prefer named exports

This release changes the default for `index.ts` to prefer named exports. Named exports may lead to better IDE and bundler performance compared to asterisk (`*`) as your tooling doesn't have to inspect the underlying module to discover exports.

While this change is merely cosmetic, you can set `output.preferExportAll` to `true` if you prefer to use the asterisk.

```js
export default {
  input: "hey-api/backend", // sign up at app.heyapi.dev
  output: {
    path: "src/client",
    preferExportAll: true,
  },
};
```

- **parser**: removed `symbol:setValue:*` events ([#2990](https://github.com/hey-api/hey-api/pull/2990)) ([`c3a81e8`](https://github.com/hey-api/hey-api/commit/c3a81e89ba5ed3f373409582c5f814e1d10cae06)) by [@mrlubos](https://github.com/mrlubos)

### Removed `symbol:setValue:*` events

These events have been removed in favor of `node:set:*` events.

### Patch Changes

- **output**: add `nameConflictResolver` option ([#2990](https://github.com/hey-api/hey-api/pull/2990)) ([`c3a81e8`](https://github.com/hey-api/hey-api/commit/c3a81e89ba5ed3f373409582c5f814e1d10cae06)) by [@mrlubos](https://github.com/mrlubos)

## Name Conflicts

As your project grows, the chances of name conflicts increase. We use a simple conflict resolver that appends numeric suffixes to duplicate identifiers. If you prefer a different strategy, you can provide your own `nameConflictResolver` function.

```js
export default {
  input: "hey-api/backend", // sign up at app.heyapi.dev
  output: {
    nameConflictResolver({ attempt, baseName }) {
      return attempt === 0 ? baseName : `${baseName}_N${attempt + 1}`;
    },
    path: "src/client",
  },
};
```

Example output:

```ts
export type ChatCompletion = string;

export type ChatCompletion_N2 = number;
```

### Updated Dependencies:

- @hey-api/codegen-core@0.4.0

## 0.88.2

### Patch Changes

- **clients**: handle CR and CRLF line endings in SSE ([#3055](https://github.com/hey-api/hey-api/pull/3055)) ([`d663232`](https://github.com/hey-api/hey-api/commit/d663232d8f10cb29744beeba073532e2f6b3b27a)) by [@nachogarcia](https://github.com/nachogarcia)

## 0.88.1

### Patch Changes

- **@hey-api/sdk**: correctly map flat parameters ([#3047](https://github.com/hey-api/hey-api/pull/3047)) ([`55ef279`](https://github.com/hey-api/hey-api/commit/55ef27994740ba0af0bc8db17b3e71bfb5c11714)) by [@mrlubos](https://github.com/mrlubos)

## 0.88.0

### Minor Changes

- **output**: use TypeScript DSL ([#2986](https://github.com/hey-api/hey-api/pull/2986)) ([`37ff4ab`](https://github.com/hey-api/hey-api/commit/37ff4ab6bc89463778bf3709687ab84d3dab0618)) by [@mrlubos](https://github.com/mrlubos)

### Removed `compiler` and `tsc` exports

This release removes the `compiler` utility functions. Instead, it introduces a new TypeScript DSL exposed under the `$` symbol. All plugins now use this interface, so you may notice slight changes in the generated output.

## 0.87.5

### Patch Changes

- **client-ofetch**: fix FormData boundary mismatch ([#2940](https://github.com/hey-api/hey-api/pull/2940)) ([`b290ec9`](https://github.com/hey-api/hey-api/commit/b290ec9a944c4e536d204e481d942f79ac02c5b9)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

## 0.87.4

### Patch Changes

- **valibot**: expose validator resolvers ([#2980](https://github.com/hey-api/hey-api/pull/2980)) ([`6226f6f`](https://github.com/hey-api/hey-api/commit/6226f6fa271369b5ff06853c1f623557a2ebe837)) by [@mrlubos](https://github.com/mrlubos)

- **zod**: expose validator resolvers ([#2980](https://github.com/hey-api/hey-api/pull/2980)) ([`6226f6f`](https://github.com/hey-api/hey-api/commit/6226f6fa271369b5ff06853c1f623557a2ebe837)) by [@mrlubos](https://github.com/mrlubos)

## 0.87.3

### Patch Changes

- **valibot**: allow generating custom pipes with `~resolvers` ([#2975](https://github.com/hey-api/hey-api/pull/2975)) ([`62a4745`](https://github.com/hey-api/hey-api/commit/62a4745c2de331330480d77c9838aa9429e950d7)) by [@mrlubos](https://github.com/mrlubos)

- **zod**: allow generating custom chains with `~resolvers` ([#2975](https://github.com/hey-api/hey-api/pull/2975)) ([`62a4745`](https://github.com/hey-api/hey-api/commit/62a4745c2de331330480d77c9838aa9429e950d7)) by [@mrlubos](https://github.com/mrlubos)

- **@tanstack/query**: add type annotations to `queryOptions()` ([#2964](https://github.com/hey-api/hey-api/pull/2964)) ([`7e1b017`](https://github.com/hey-api/hey-api/commit/7e1b01794911b590febaf821369aae0d4d798301)) by [@NovakAnton](https://github.com/NovakAnton)

- **client-fetch**: intercept AbortError ([#2970](https://github.com/hey-api/hey-api/pull/2970)) ([`9075309`](https://github.com/hey-api/hey-api/commit/90753091a72796f6c6dffb6789ef42ecc4fd4e6b)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **@tanstack/query**: prettier mutation options ([#2972](https://github.com/hey-api/hey-api/pull/2972)) ([`50266bd`](https://github.com/hey-api/hey-api/commit/50266bdb1524aec72e1fdf5e903bad6bebded5e5)) by [@mrlubos](https://github.com/mrlubos)

## 0.87.2

### Patch Changes

- **clients**: add support for Ky client ([#2958](https://github.com/hey-api/hey-api/pull/2958)) ([`212fcaf`](https://github.com/hey-api/hey-api/commit/212fcaf5570ce05370dac6ace6e2751eecddb2d4)) by [@SebastiaanWouters](https://github.com/SebastiaanWouters)

- **parser**: merge `default` keyword with `$ref` in OpenAPI 3.1 ([#2946](https://github.com/hey-api/hey-api/pull/2946)) ([`15a178d`](https://github.com/hey-api/hey-api/commit/15a178dd6a998bf88ebd17c64de151922e94765a)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **output**: run lint before format ([#2937](https://github.com/hey-api/hey-api/pull/2937)) ([`eb23ee8`](https://github.com/hey-api/hey-api/commit/eb23ee89fd09368385a07cd2a3885e3e5ce111e6)) by [@FloEdelmann](https://github.com/FloEdelmann)

- **@pinia/colada**: correctly access instantiated SDKs ([#2942](https://github.com/hey-api/hey-api/pull/2942)) ([`c041e96`](https://github.com/hey-api/hey-api/commit/c041e962604765e0f342fda970a2550367aa2142)) by [@mrlubos](https://github.com/mrlubos)

- **valibot**: use `.strictObject()` instead of `.objectWithRest()` when additional properties are not allowed ([#2945](https://github.com/hey-api/hey-api/pull/2945)) ([`3786d2b`](https://github.com/hey-api/hey-api/commit/3786d2b3b2316ddcc00b7d87f7dff15b61e29719)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- **@tanstack/query**: prettier query options ([#2947](https://github.com/hey-api/hey-api/pull/2947)) ([`0b79b89`](https://github.com/hey-api/hey-api/commit/0b79b894bd263b2d28cbbb59dfab3aed4ba6736d)) by [@mrlubos](https://github.com/mrlubos)

## 0.87.1

### Patch Changes

- fix(typescript): remove legacy options ([#2929](https://github.com/hey-api/hey-api/pull/2929)) ([`97c1f0e`](https://github.com/hey-api/hey-api/commit/97c1f0e94f8eb8ca2d74f4f5ebe51a53f347641b)) by [@mrlubos](https://github.com/mrlubos)

- fix(tanstack-query): correctly access instantiated SDKs ([#2939](https://github.com/hey-api/hey-api/pull/2939)) ([`01a1fb4`](https://github.com/hey-api/hey-api/commit/01a1fb48a2e2d4e14a33cf3e81b44b5fad76e72a)) by [@mrlubos](https://github.com/mrlubos)

## 0.87.0

### Minor Changes

- feat: remove legacy clients and plugins ([#2925](https://github.com/hey-api/hey-api/pull/2925)) ([`c9fb65d`](https://github.com/hey-api/hey-api/commit/c9fb65d2f5757f389383f8b9007baf6a5e26f45a)) by [@mrlubos](https://github.com/mrlubos)

### Removed legacy clients

This release removes support for legacy clients and plugins. Please migrate to the new clients if you haven't done so yet. If you're unable to do so due to a missing feature, let us know on [GitHub](https://github.com/hey-api/hey-api/issues).

## 0.86.12

### Patch Changes

- fix(transformers): do not reference undefined transformers ([#2924](https://github.com/hey-api/hey-api/pull/2924)) ([`b3f4f91`](https://github.com/hey-api/hey-api/commit/b3f4f91bbf6ac1db504b7605a73c986b37003880)) by [@mrlubos](https://github.com/mrlubos)

- fix(sdk): add `paramsStructure` option ([#2909](https://github.com/hey-api/hey-api/pull/2909)) ([`d9dd389`](https://github.com/hey-api/hey-api/commit/d9dd38927ce5c7901ce46bfe439454935b2053fa)) by [@mrlubos](https://github.com/mrlubos)

- fix(sdk): handle conflicts between method names and subclasses in class-based SDKs ([#2920](https://github.com/hey-api/hey-api/pull/2920)) ([`48c7fa3`](https://github.com/hey-api/hey-api/commit/48c7fa3db65ef1ee146b6e09e53ae500483d4b22)) by [@mrlubos](https://github.com/mrlubos)

- fix: bundled context types ([#2923](https://github.com/hey-api/hey-api/pull/2923)) ([`f5a91c4`](https://github.com/hey-api/hey-api/commit/f5a91c4e068f64987d8138fadb0e969f1e28081f)) by [@mrlubos](https://github.com/mrlubos)

### Updated Dependencies:

- @hey-api/codegen-core@0.3.3

## 0.86.11

### Patch Changes

- fix(types): use unique generic names in `PluginInstance` to avoid typing issues ([#2897](https://github.com/hey-api/hey-api/pull/2897)) ([`a625980`](https://github.com/hey-api/hey-api/commit/a625980e7bbcba1f4bb91aecae9546ff51942964)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

## 0.86.10

### Patch Changes

- fix(parser): handle OpenAPI 2.0 body as JSON by default if not explicitly defined ([#2893](https://github.com/hey-api/hey-api/pull/2893)) ([`767ad18`](https://github.com/hey-api/hey-api/commit/767ad185d5a2bb5a7344ca1c297e8d2b1c16d638)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

## 0.86.9

### Patch Changes

- fix(valibot): handle `time` string format ([#2889](https://github.com/hey-api/hey-api/pull/2889)) ([`0db5a43`](https://github.com/hey-api/hey-api/commit/0db5a43b868511784cdffabbec8ea234c7841d19)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- refactor: replace plugin references with queries ([#2873](https://github.com/hey-api/hey-api/pull/2873)) ([`1cfc8f2`](https://github.com/hey-api/hey-api/commit/1cfc8f2b4673b53e0b1fff43f3d2078dcd595ca2)) by [@mrlubos](https://github.com/mrlubos)

- fix: gracefully handle errors in debug reports ([#2884](https://github.com/hey-api/hey-api/pull/2884)) ([`d5c0a1c`](https://github.com/hey-api/hey-api/commit/d5c0a1c03edd3cefcd9438cee59d538cf87e9d3f)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

### Updated Dependencies:

- @hey-api/codegen-core@0.3.2

## 0.86.8

### Patch Changes

- fix(valibot): improve handling of additionalProperties type ([#2870](https://github.com/hey-api/hey-api/pull/2870)) ([`da88dd9`](https://github.com/hey-api/hey-api/commit/da88dd9962ff3a619f3d4853d641acc3637406f4)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

## 0.86.7

### Patch Changes

- fix(types): export Operation type ([#2862](https://github.com/hey-api/hey-api/pull/2862)) ([`857c464`](https://github.com/hey-api/hey-api/commit/857c464ac04832c3bf26f33af3c1c90ccf67fda1)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

## 0.86.6

### Patch Changes

- fix(transformers): revert function order to fix infinite cycle regression ([#2855](https://github.com/hey-api/hey-api/pull/2855)) ([`81f91a9`](https://github.com/hey-api/hey-api/commit/81f91a97e8e50427b45f21c80f72fdff7ce1deca)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

## 0.86.5

### Patch Changes

- fix(parser): write-only schema incorrectly used in response schemas ([#2850](https://github.com/hey-api/hey-api/pull/2850)) ([`16cc0e7`](https://github.com/hey-api/hey-api/commit/16cc0e7d50993e36dab6349eda1361421bdf44ac)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- fix(cli): move cli script to typescript ([#2852](https://github.com/hey-api/hey-api/pull/2852)) ([`b677f89`](https://github.com/hey-api/hey-api/commit/b677f893f9dc1848bb54164e736a90e617d1269d)) by [@mrlubos](https://github.com/mrlubos)

## 0.86.4

### Patch Changes

- feat(parser): pass tags to symbol meta ([#2845](https://github.com/hey-api/hey-api/pull/2845)) ([`e157288`](https://github.com/hey-api/hey-api/commit/e1572888aec1e95d23eb0124fb9a5f3383e89def)) by [@mrlubos](https://github.com/mrlubos)

- feat(clients): granular query parameter serialization strategy ([#2837](https://github.com/hey-api/hey-api/pull/2837)) ([`e0e6ab3`](https://github.com/hey-api/hey-api/commit/e0e6ab37888ac9eb88fa9f0d45e0a9123f9f1158)) by [@pixelmord](https://github.com/pixelmord)

## 0.86.3

### Patch Changes

- feat(parser): add `events` hooks ([#2829](https://github.com/hey-api/hey-api/pull/2829)) ([`d5c85fc`](https://github.com/hey-api/hey-api/commit/d5c85fc29e985af0cdc6ce7ac7e8210c60171163)) by [@mrlubos](https://github.com/mrlubos)

- fix(parser): writeOnly schema properties missing from request types in nested schemas ([#2793](https://github.com/hey-api/hey-api/pull/2793)) ([`7d1c475`](https://github.com/hey-api/hey-api/commit/7d1c47592a806c34fb627f21e3ee59e2ec3c015a)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

## 0.86.2

### Patch Changes

- fix(validators): do not reference variables before they are declared ([#2812](https://github.com/hey-api/hey-api/pull/2812)) ([`69783d1`](https://github.com/hey-api/hey-api/commit/69783d19be37014b5116a2ede5bb74adadbb8110)) by [@mrlubos](https://github.com/mrlubos)

- fix(renderer): allow duplicate names when one symbol is a type ([#2812](https://github.com/hey-api/hey-api/pull/2812)) ([`523038e`](https://github.com/hey-api/hey-api/commit/523038e82c949a436a467486a26333d50ce0e7cd)) by [@mrlubos](https://github.com/mrlubos)

### Updated Dependencies:

- @hey-api/codegen-core@0.3.1

## 0.86.1

### Patch Changes

- fix(client-axios): revert return error when axios request fails ([#2804](https://github.com/hey-api/hey-api/pull/2804)) ([`5bba86e`](https://github.com/hey-api/hey-api/commit/5bba86e742c48f575f96f55f7d7ea3d636102ebe)) by [@mrlubos](https://github.com/mrlubos)

## 0.86.0

### Minor Changes

- feat: bump minimum Node version to 20.19.0 ([#2775](https://github.com/hey-api/hey-api/pull/2775)) ([`7c7702a`](https://github.com/hey-api/hey-api/commit/7c7702a9ed3bda0d75ef28d35d4284e3b6318b26)) by [@mrlubos](https://github.com/mrlubos)

### Patch Changes

- fix: do not print error details if logs are set to silent ([#2776](https://github.com/hey-api/hey-api/pull/2776)) ([`2274344`](https://github.com/hey-api/hey-api/commit/227434440bc2d00f9336041d3b083fc9374f3639)) by [@mrlubos](https://github.com/mrlubos)

- fix(client-axios): return error when axios request fails ([#2763](https://github.com/hey-api/hey-api/pull/2763)) ([`122a292`](https://github.com/hey-api/hey-api/commit/122a292e3a0293098e5c5e222e5dcf8e99639ba8)) by [@mauriciabad](https://github.com/mauriciabad)

### Updated Dependencies:

- @hey-api/codegen-core@0.3.0

## 0.85.2

### Patch Changes

- fix: dynamically load c12 to work with cjs modules ([#2755](https://github.com/hey-api/hey-api/pull/2755)) ([`e6472cf`](https://github.com/hey-api/hey-api/commit/e6472cf7f69db5ff2cb2f509c1d61e5c4438871e)) by [@mrlubos](https://github.com/mrlubos)

- fix(cli): detect watch mode with input array ([#2751](https://github.com/hey-api/hey-api/pull/2751)) ([`3293cad`](https://github.com/hey-api/hey-api/commit/3293cada4f089107ac183fbcd03550541d95073a)) by [@warrenseine](https://github.com/warrenseine)

## 0.85.1

### Patch Changes

- fix(zod): allOf in array items being generated as union instead of intersection ([#2736](https://github.com/hey-api/hey-api/pull/2736)) ([`078face`](https://github.com/hey-api/hey-api/commit/078face47b40462033ce557ce0048ccf88246854)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

## 0.85.0

### Minor Changes

- refactor(config): replace 'off' with null to disable options ([#2718](https://github.com/hey-api/hey-api/pull/2718)) ([`fcdd73b`](https://github.com/hey-api/hey-api/commit/fcdd73b816d74babf47e6a1f46032f5b8ebb4b48)) by [@mrlubos](https://github.com/mrlubos)

### Updated `output` options

We made the `output` configuration more consistent by using `null` to represent disabled options. [This change](https://heyapi.dev/openapi-ts/migrating#updated-output-options) does not affect boolean options.

```js
export default {
  input: "hey-api/backend", // sign up at app.heyapi.dev
  output: {
    format: null,
    lint: null,
    path: "src/client",
    tsConfigPath: null,
  },
};
```

### Patch Changes

- feat: support multiple configurations ([#2602](https://github.com/hey-api/hey-api/pull/2602)) ([`c84f10e`](https://github.com/hey-api/hey-api/commit/c84f10e5a1b7c54320e3ef5edfc9d2fffe5183e9)) by [@carson2222](https://github.com/carson2222)

- feat(config): add `output.importFileExtension` option ([#2718](https://github.com/hey-api/hey-api/pull/2718)) ([`fcdd73b`](https://github.com/hey-api/hey-api/commit/fcdd73b816d74babf47e6a1f46032f5b8ebb4b48)) by [@mrlubos](https://github.com/mrlubos)

- feat(pinia-colada): query options use `defineQueryOptions` ([#2610](https://github.com/hey-api/hey-api/pull/2610)) ([`33e6b31`](https://github.com/hey-api/hey-api/commit/33e6b31fa2ab840dd4e6e2e3e0fbc6e207ccdf7e)) by [@brolnickij](https://github.com/brolnickij)

### Updated Pinia Colada query options

Pinia Colada query options now use `defineQueryOptions` to improve reactivity support. Instead of calling the query options function, you can use one of the [following approaches](https://heyapi.dev/openapi-ts/migrating#updated-pinia-colada-query-options).

#### No params

```ts
useQuery(getPetsQuery);
```

#### Constant

```ts
useQuery(getPetByIdQuery, () => ({
  path: {
    petId: 1,
  },
}));
```

#### Reactive

```ts
const petId = ref<number | null>(1);

useQuery(getPetByIdQuery, () => ({
  path: {
    petId: petId.value,
  },
}));
```

#### Properties

```ts
const petId = ref<number | null>(1);

useQuery(() => ({
  ...getPetByIdQuery({
    path: { petId: petId.value as number },
  }),
  enabled: () => petId.value !== null,
}));
```

## 0.84.4

### Patch Changes

- fix(client-ofetch): add missing credentials property support ([#2710](https://github.com/hey-api/hey-api/pull/2710)) ([`ba7e6dc`](https://github.com/hey-api/hey-api/commit/ba7e6dc1af3a8e64082bd101de6c1cd6e0e8fc17)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- fix(config): do not override interactive config from CLI if defined in config file ([#2708](https://github.com/hey-api/hey-api/pull/2708)) ([`21e9fa0`](https://github.com/hey-api/hey-api/commit/21e9fa089d2305714f37c1a16cb3e6f9fedb49b9)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- fix(zod): correct schemas for numeric and boolean enums ([#2704](https://github.com/hey-api/hey-api/pull/2704)) ([`59ea38e`](https://github.com/hey-api/hey-api/commit/59ea38ea9e47b515c54e55d169591fe6188990b4)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

## 0.84.3

### Patch Changes

- fix(validators): escaping slashes in regular expressions ([#2692](https://github.com/hey-api/hey-api/pull/2692)) ([`dba81bc`](https://github.com/hey-api/hey-api/commit/dba81bc23a7cb72696cd1fcf4fe1a17f00027fae)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

## 0.84.2

### Patch Changes

- fix(parser): add `propertiesRequiredByDefault` transform option ([#2678](https://github.com/hey-api/hey-api/pull/2678)) ([`9e59e07`](https://github.com/hey-api/hey-api/commit/9e59e07efa2bafec88e0af2935edac323b4e41dd)) by [@mrlubos](https://github.com/mrlubos)

- fix(typescript): do not mark enums as types ([#2680](https://github.com/hey-api/hey-api/pull/2680)) ([`1cab011`](https://github.com/hey-api/hey-api/commit/1cab0115afa3a201acb4911dd552c1d5dd9ba9ac)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

## 0.84.1

### Patch Changes

- feat: add `ofetch` client available as `@hey-api/client-ofetch` ([#2642](https://github.com/hey-api/hey-api/pull/2642)) ([`da9e05f`](https://github.com/hey-api/hey-api/commit/da9e05f38f8952aaf2868094c2c0bc32c402d55e)) by [@brolnickij](https://github.com/brolnickij)

- fix(renderer): replace default import placeholder ([#2674](https://github.com/hey-api/hey-api/pull/2674)) ([`762b20e`](https://github.com/hey-api/hey-api/commit/762b20e6c8b90d7011ce24a193a66b18e4f74136)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

## 0.84.0

### Minor Changes

- feat: Symbol API

### Symbol API

This release improves the Symbol API, which adds the capability to place symbols in arbitrary files. We preserved the previous output structure for all plugins except Angular.

You can preserve the previous Angular output by writing your own [placement function](https://heyapi.dev/openapi-ts/configuration/parser#hooks-symbols).

### Removed `output` plugin option

Due to the Symbol API release, this option has been removed from the Plugin API. ([#2664](https://github.com/hey-api/hey-api/pull/2664)) ([`e1ede9c`](https://github.com/hey-api/hey-api/commit/e1ede9cabf52b5bbcb9195570deff58db8f43dbb)) by [@mrlubos](https://github.com/mrlubos)

### Patch Changes

- fix(plugin): every plugin extends Plugin.Hooks interface ([#2664](https://github.com/hey-api/hey-api/pull/2664)) ([`e1ede9c`](https://github.com/hey-api/hey-api/commit/e1ede9cabf52b5bbcb9195570deff58db8f43dbb)) by [@mrlubos](https://github.com/mrlubos)

- fix(renderer): group and sort imported modules

### TypeScript renderer

We ship a dedicated TypeScript renderer for `.ts` files. This release improves the renderer's ability to group and sort imported modules, resulting in a more polished output. ([#2664](https://github.com/hey-api/hey-api/pull/2664)) ([`e1ede9c`](https://github.com/hey-api/hey-api/commit/e1ede9cabf52b5bbcb9195570deff58db8f43dbb)) by [@mrlubos](https://github.com/mrlubos)

- fix(parser): expand schema deduplication by including validation constraints in type ID ([#2650](https://github.com/hey-api/hey-api/pull/2650)) ([`31b3933`](https://github.com/hey-api/hey-api/commit/31b3933b2caa1085dbead1ef94695bca4b83d6ac)) by [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)

- fix(parser): bump support for OpenAPI 3.1.2 ([#2667](https://github.com/hey-api/hey-api/pull/2667)) ([`3511fb8`](https://github.com/hey-api/hey-api/commit/3511fb88cbe6b767b631af16336cb6c0722c3ff8)) by [@mrlubos](https://github.com/mrlubos)

- fix(config): add `output.fileName` option ([#2664](https://github.com/hey-api/hey-api/pull/2664)) ([`e1ede9c`](https://github.com/hey-api/hey-api/commit/e1ede9cabf52b5bbcb9195570deff58db8f43dbb)) by [@mrlubos](https://github.com/mrlubos)

## File Name

You can customize the naming and casing pattern for files using the `fileName` option.

```js
export default {
  input: "hey-api/backend", // sign up at app.heyapi.dev
  output: {
    fileName: "{{name}}",
    path: "src/client",
  },
};
```

By default, we append every file name with a `.gen` suffix to highlight it's automatically generated. You can customize or disable this suffix using the `fileName.suffix` option.

```js
export default {
  input: "hey-api/backend", // sign up at app.heyapi.dev
  output: {
    fileName: {
      suffix: ".gen",
    },
    path: "src/client",
  },
};
```

- fix(axios): remove duplicate `baseURL` when using relative values ([#2624](https://github.com/hey-api/hey-api/pull/2624)) ([`8ffceec`](https://github.com/hey-api/hey-api/commit/8ffceec89fe471d4e14df17a172f3d5a254eb819)) by [@Ben-Pfirsich](https://github.com/Ben-Pfirsich)

### Updated Dependencies:

- @hey-api/codegen-core@0.2.0

## 0.83.1

### Patch Changes

- feat(typescript): add `topType` option allowing to choose `any` over `unknown` ([#2629](https://github.com/hey-api/hey-api/pull/2629)) ([`444a49a`](https://github.com/hey-api/hey-api/commit/444a49a3f0855575c3ef1a3350fd102d42553f3e)) by [@mrlubos](https://github.com/mrlubos)

- fix(client): expose all interceptor methods ([#2627](https://github.com/hey-api/hey-api/pull/2627)) ([`5a74da0`](https://github.com/hey-api/hey-api/commit/5a74da055e835b5160cb11e3d2be6921feeb18ad)) by [@mrlubos](https://github.com/mrlubos)

- fix(config): correctly load user-defined hooks ([#2623](https://github.com/hey-api/hey-api/pull/2623)) ([`1193c4d`](https://github.com/hey-api/hey-api/commit/1193c4dce77e0cb02c32b25661f22065a18bd095)) by [@mrlubos](https://github.com/mrlubos)

- fix(typescript): handle string and binary string in composite keywords ([#2630](https://github.com/hey-api/hey-api/pull/2630)) ([`43a0661`](https://github.com/hey-api/hey-api/commit/43a06617448344448375e0c13a156cb91666f3e9)) by [@mrlubos](https://github.com/mrlubos)

## 0.83.0

### Minor Changes

- feat: Symbol API

### Symbol API

This release adds the Symbol API, which significantly reduces the risk of naming collisions. While the generated output should only include formatting changes, this feature introduces breaking changes to the Plugin API that affect custom plugins.

We will update the [custom plugin guide](https://heyapi.dev/openapi-ts/plugins/custom) once the Plugin API becomes more stable. ([#2582](https://github.com/hey-api/hey-api/pull/2582)) ([`10aea89`](https://github.com/hey-api/hey-api/commit/10aea8910771ff72ef9b08d4eacdd6b028833c4c)) by [@mrlubos](https://github.com/mrlubos)

- feat(pinia-colada): remove `groupByTag` option

### Removed `groupByTag` Pinia Colada option

This option has been removed to provide a more consistent API across plugins. We plan to bring it back in a future release. ([#2582](https://github.com/hey-api/hey-api/pull/2582)) ([`10aea89`](https://github.com/hey-api/hey-api/commit/10aea8910771ff72ef9b08d4eacdd6b028833c4c)) by [@mrlubos](https://github.com/mrlubos)

### Patch Changes

### Updated Dependencies:

- @hey-api/codegen-core@0.1.0

## 0.82.5

### Patch Changes

- fix(client): `mergeHeaders` functions use `.forEach()` instead of `.entries()` ([#2585](https://github.com/hey-api/hey-api/pull/2585)) ([`debba72`](https://github.com/hey-api/hey-api/commit/debba72348e450f8dc884223681f10e80da77545)) by [@volesen](https://github.com/volesen)

- fix(client): move `getValidRequestBody()` function to `client-core` ([#2605](https://github.com/hey-api/hey-api/pull/2605)) ([`b180e4e`](https://github.com/hey-api/hey-api/commit/b180e4e105d1d8008e4c92d79857d592080feac7)) by [@franworks](https://github.com/franworks)

## 0.82.4

### Patch Changes

- fix(client): improve handling of plain text, falsy, and unserialized request bodies ([#2564](https://github.com/hey-api/hey-api/pull/2564)) ([`074a459`](https://github.com/hey-api/hey-api/commit/074a4598c050036b161a9e04a4b5acae98d97b82)) by [@franworks](https://github.com/franworks)

- feat(pinia-colada): implicit `$fetch` for `client-nuxt` (hide `composable`) ([#2598](https://github.com/hey-api/hey-api/pull/2598)) ([`7143078`](https://github.com/hey-api/hey-api/commit/7143078fde06b5b2fe00e7a7045317a2f5b40bb7)) by [@brolnickij](https://github.com/brolnickij)

- fix(pinia-colada): optional `options` in mutation factory ([#2593](https://github.com/hey-api/hey-api/pull/2593)) ([`4137445`](https://github.com/hey-api/hey-api/commit/413744572f403f605c0ba6a69f3614da69fc6f15)) by [@brolnickij](https://github.com/brolnickij)

- fix(parser): improve $ref handling ([#2588](https://github.com/hey-api/hey-api/pull/2588)) ([`c97e7a8`](https://github.com/hey-api/hey-api/commit/c97e7a8c8b1d24747356feb9a15840c296a9c1c8)) by [@carson2222](https://github.com/carson2222)

## 0.82.3

### Patch Changes

- fix(angular): allow `httpResource` to skip requests when `undefined` is returned ([#2572](https://github.com/hey-api/hey-api/pull/2572)) ([`ee35b33`](https://github.com/hey-api/hey-api/commit/ee35b337909c2dfa76b8aa915d4b6e185deafa2b)) by [@max-scopp](https://github.com/max-scopp)

## 0.82.2

### Patch Changes

- fix: update peer dependencies to be more permissible ([#2574](https://github.com/hey-api/hey-api/pull/2574)) ([`996021e`](https://github.com/hey-api/hey-api/commit/996021e4ce306ce762dfd55f2a7ec8099be4f24c)) by [@mrlubos](https://github.com/mrlubos)

### Updated Dependencies:

- @hey-api/codegen-core@0.0.1

## 0.82.1

### Patch Changes

- [#2541](https://github.com/hey-api/hey-api/pull/2541) [`ad3c633`](https://github.com/hey-api/hey-api/commit/ad3c633b21d241ba72f27828870c354bfc00bd7e) Thanks [@ixnas](https://github.com/ixnas)! - feat(typescript): add `typescript-const` to `enums.mode` for generating TypeScript enums as constants

- [#2556](https://github.com/hey-api/hey-api/pull/2556) [`74c16f2`](https://github.com/hey-api/hey-api/commit/74c16f219706d22aebbc166e8bbb95412a2a5b6f) Thanks [@carson2222](https://github.com/carson2222)! - fix(parser): prune `required` array after removing properties

- [#2559](https://github.com/hey-api/hey-api/pull/2559) [`5012a72`](https://github.com/hey-api/hey-api/commit/5012a721e7b7064910e5e4056cb4adf3ae63f19b) Thanks [@jgoz](https://github.com/jgoz)! - fix(output): avoid appending `.gen` to file names multiple times when `output.clean` is `false`

## 0.82.0

### Minor Changes

- [#2505](https://github.com/hey-api/hey-api/pull/2505) [`97c57f6`](https://github.com/hey-api/hey-api/commit/97c57f68af1f907f278707fb526289c73b33ea89) Thanks [@SebastiaanWouters](https://github.com/SebastiaanWouters)! - feat(parser): add Hooks API

### Added Hooks API

This release adds the [Hooks API](https://heyapi.dev/openapi-ts/configuration/parser#hooks), giving you granular control over which operations generate queries and mutations. As a result, we tightened the previous behavior and POST operations no longer generate queries by default. To preserve the old behavior, add a custom matcher.

```js
export default {
  input: "hey-api/backend", // sign up at app.heyapi.dev
  output: "src/client",
  parser: {
    hooks: {
      operations: {
        isQuery: (op) => (op.method === "post" ? true : undefined),
      },
    },
  },
};
```

### Patch Changes

- [#2542](https://github.com/hey-api/hey-api/pull/2542) [`c12f7c7`](https://github.com/hey-api/hey-api/commit/c12f7c71287ced429db4036678b254a967da3dea) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(client): pass fetch option to sse client

- [#2505](https://github.com/hey-api/hey-api/pull/2505) [`80dc015`](https://github.com/hey-api/hey-api/commit/80dc01515d67bd335427af3dc9be0d49a417b9e3) Thanks [@SebastiaanWouters](https://github.com/SebastiaanWouters)! - feat(plugin): add `@pinia/colada` plugin

- [#2535](https://github.com/hey-api/hey-api/pull/2535) [`efdeedc`](https://github.com/hey-api/hey-api/commit/efdeedce6765e6b4d3c2e288b0473c1ced6c487f) Thanks [@alexedme](https://github.com/alexedme)! - feat(client): added angular, axios, fetch, next & nuxt client type export for external typing purposes.

- [#2544](https://github.com/hey-api/hey-api/pull/2544) [`d4cd30e`](https://github.com/hey-api/hey-api/commit/d4cd30e3486fef6c459d4c04d3ca3f7ac19f8d83) Thanks [@carson2222](https://github.com/carson2222)! - fix(parser): improve handling multiple references to shared external variable

- [#2519](https://github.com/hey-api/hey-api/pull/2519) [`95f00fa`](https://github.com/hey-api/hey-api/commit/95f00fa28a4c56f8f614649f8b4fd73a08f8b81f) Thanks [@volesen](https://github.com/volesen)! - fix(client): improve empty response body handling

- [#1680](https://github.com/hey-api/hey-api/pull/1680) [`9e4cc3d`](https://github.com/hey-api/hey-api/commit/9e4cc3df784999ead1691848a4db0b7238e45809) Thanks [@josh-hemphill](https://github.com/josh-hemphill)! - feat(plugin): add `@pinia/colada` plugin

- [#2530](https://github.com/hey-api/hey-api/pull/2530) [`8d1cfc4`](https://github.com/hey-api/hey-api/commit/8d1cfc4e415239266760498ea126c465c53f588c) Thanks [@carson2222](https://github.com/carson2222)! - fix(parser): improve `readWrite` transformer splitting logic

- [#2523](https://github.com/hey-api/hey-api/pull/2523) [`7f6de44`](https://github.com/hey-api/hey-api/commit/7f6de44be7f445425c70c82833bc0442db2fcbcd) Thanks [@carson2222](https://github.com/carson2222)! - fix(parser): handle `patternProperties` in OpenAPI 3.1

## 0.81.1

### Patch Changes

- [#2516](https://github.com/hey-api/hey-api/pull/2516) [`c71d5db`](https://github.com/hey-api/hey-api/commit/c71d5dbfc5888f03ab06a7c763ada42c1af6c096) Thanks [@mrlubos](https://github.com/mrlubos)! - feat(typescript): add webhooks configuration options

- [#2515](https://github.com/hey-api/hey-api/pull/2515) [`b81051e`](https://github.com/hey-api/hey-api/commit/b81051e27945e330c0a7c157aff49029bcd6dfda) Thanks [@malcolm-kee](https://github.com/malcolm-kee)! - fix(parser): correctly handle schema extending discriminated schema

- [#2513](https://github.com/hey-api/hey-api/pull/2513) [`34fa59f`](https://github.com/hey-api/hey-api/commit/34fa59fe2f0e6b4ba6578f25a6e64f964c04155c) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(client): move sse functions into their own namespace

- [#2516](https://github.com/hey-api/hey-api/pull/2516) [`c71d5db`](https://github.com/hey-api/hey-api/commit/c71d5dbfc5888f03ab06a7c763ada42c1af6c096) Thanks [@mrlubos](https://github.com/mrlubos)! - feat(validator): add webhooks configuration options

- [#2516](https://github.com/hey-api/hey-api/pull/2516) [`c71d5db`](https://github.com/hey-api/hey-api/commit/c71d5dbfc5888f03ab06a7c763ada42c1af6c096) Thanks [@mrlubos](https://github.com/mrlubos)! - feat(parser): handle webhooks in OpenAPI 3.1

## 0.81.0

### Minor Changes

- [#2510](https://github.com/hey-api/hey-api/pull/2510) [`d43ef3f`](https://github.com/hey-api/hey-api/commit/d43ef3f3bb47bad3f4fafbcf7be86b328543f440) Thanks [@mrlubos](https://github.com/mrlubos)! - feat(client): add support for server-sent events (SSE)

## 0.80.18

### Patch Changes

- [#2502](https://github.com/hey-api/hey-api/pull/2502) [`ac7efbf`](https://github.com/hey-api/hey-api/commit/ac7efbfd96e7a5e530e91655df6ac481c9a5eaa5) Thanks [@malcolm-kee](https://github.com/malcolm-kee)! - fix(parser): OpenAPI 3.1 parser handles multiple `type` values

## 0.80.17

### Patch Changes

- [#2500](https://github.com/hey-api/hey-api/pull/2500) [`98d7bc3`](https://github.com/hey-api/hey-api/commit/98d7bc37387e16c6f38194a111d6df384eee3a82) Thanks [@max-scopp](https://github.com/max-scopp)! - fix(client): Angular client correctly applies default GET method

## 0.80.16

### Patch Changes

- [#2490](https://github.com/hey-api/hey-api/pull/2490) [`03f37ea`](https://github.com/hey-api/hey-api/commit/03f37ea9481a28c7c05dba5f0fddfc2bc225e6a0) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(client): Nuxt client receives raw body in request validators

- [#2479](https://github.com/hey-api/hey-api/pull/2479) [`4038e1c`](https://github.com/hey-api/hey-api/commit/4038e1cef96c031acde97ccf82176a0fedbb3f8c) Thanks [@dracomithril](https://github.com/dracomithril)! - fix(parser): deduplicate security schemas based on name

- [#2489](https://github.com/hey-api/hey-api/pull/2489) [`9bfbb63`](https://github.com/hey-api/hey-api/commit/9bfbb63bff087da4cffc76603f8c9f45f34f430a) Thanks [@mrlubos](https://github.com/mrlubos)! - feat(parser): input supports Hey API Registry shorthand

- [#2485](https://github.com/hey-api/hey-api/pull/2485) [`e074a36`](https://github.com/hey-api/hey-api/commit/e074a3600701badc7f220b283a55188dc85a5572) Thanks [@bombillazo](https://github.com/bombillazo)! - feat(parser): input supports ReadMe API Registry with `readme:` prefix

- [#2491](https://github.com/hey-api/hey-api/pull/2491) [`ce602fe`](https://github.com/hey-api/hey-api/commit/ce602fede185ba622398bdd42e38d3f78323c32c) Thanks [@mrlubos](https://github.com/mrlubos)! - feat(parser): input supports Scalar API Registry with `scalar:` prefix

## 0.80.15

### Patch Changes

- [#2480](https://github.com/hey-api/hey-api/pull/2480) [`d9af1bb`](https://github.com/hey-api/hey-api/commit/d9af1bb3d1abb4c8caa4f8fd6a3fcef50d2187d9) Thanks [@dracomithril](https://github.com/dracomithril)! - fix(client): call `auth()` function for every unique security `name`

- [#2481](https://github.com/hey-api/hey-api/pull/2481) [`7e8264e`](https://github.com/hey-api/hey-api/commit/7e8264eae199f4ce52f1666937bca838626cacc3) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(parser): cache parent to children nodes

## 0.80.14

### Patch Changes

- [#2475](https://github.com/hey-api/hey-api/pull/2475) [`b9204ad`](https://github.com/hey-api/hey-api/commit/b9204ad1603374713d507deaa416ed56d6ce6aea) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(parser): cache visited graph nodes to boost performance

## 0.80.13

### Patch Changes

- [#2471](https://github.com/hey-api/hey-api/pull/2471) [`82af768`](https://github.com/hey-api/hey-api/commit/82af768a102409f981006a4b6f0219f9d86256dc) Thanks [@josstn](https://github.com/josstn)! - fix(parser): handle non-ascii characters in discriminator

## 0.80.12

### Patch Changes

- [#2467](https://github.com/hey-api/hey-api/pull/2467) [`c76a8de`](https://github.com/hey-api/hey-api/commit/c76a8decad12a4a67cab83827bb007b36d794f6a) Thanks [@bjornhenriksson](https://github.com/bjornhenriksson)! - fix(zod): add `dates.local` option to allow unqualified (timezone-less) datetimes

## 0.80.11

### Patch Changes

- [#2452](https://github.com/hey-api/hey-api/pull/2452) [`fb5b621`](https://github.com/hey-api/hey-api/commit/fb5b621f89bfc7acf33b0156ffcdca87646d667f) Thanks [@mrlubos](https://github.com/mrlubos)! - feat(client): add `@hey-api/client-angular` client

- [#2423](https://github.com/hey-api/hey-api/pull/2423) [`554e9a6`](https://github.com/hey-api/hey-api/commit/554e9a6b4513eff4785ef48a927c6fea7a8eb873) Thanks [@max-scopp](https://github.com/max-scopp)! - feat(plugin): add `@angular/common` plugin

## 0.80.10

### Patch Changes

- [#2438](https://github.com/hey-api/hey-api/pull/2438) [`760fd61`](https://github.com/hey-api/hey-api/commit/760fd61701080a890ba8e8efc5eac46699db4bbf) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(client): handle dates in formdata serializer

## 0.80.9

### Patch Changes

- [#2426](https://github.com/hey-api/hey-api/pull/2426) [`7308d9b`](https://github.com/hey-api/hey-api/commit/7308d9b8f5eb96d984dc323b5e6276eafcd30382) Thanks [@flow96](https://github.com/flow96)! - fix(sdk): handle infinite loop in nested operation IDs and tags with duplicate values

## 0.80.8

### Patch Changes

- [#2418](https://github.com/hey-api/hey-api/pull/2418) [`340a6cd`](https://github.com/hey-api/hey-api/commit/340a6cd8f90fac70ff752c11abfa4691180bd34a) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(client): add auto-generated header to client files

- [#2418](https://github.com/hey-api/hey-api/pull/2418) [`969d7cf`](https://github.com/hey-api/hey-api/commit/969d7cfd7ff17705148477e4ce2b0ca3cee81de9) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(client): correctly rename client files with nodenext bundler

- [#2416](https://github.com/hey-api/hey-api/pull/2416) [`9cff8c8`](https://github.com/hey-api/hey-api/commit/9cff8c871e2707b22f9ea521bce95c6ffd532079) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(tanstack-query): set correct name for pagination parameters in infinite query options

## 0.80.7

### Patch Changes

- [#2396](https://github.com/hey-api/hey-api/pull/2396) [`b0958a0`](https://github.com/hey-api/hey-api/commit/b0958a05c308c4fcd8ca17d61d8691b6fb3471fe) Thanks [@Shinigami92](https://github.com/Shinigami92)! - fix(client): add `.gen` to client files

## 0.80.6

### Patch Changes

- [#2399](https://github.com/hey-api/hey-api/pull/2399) [`ef32c27`](https://github.com/hey-api/hey-api/commit/ef32c27a147c85216773ac1fb392363034f23fd1) Thanks [@ahmedrowaihi](https://github.com/ahmedrowaihi)! - feat(tanstack-query): support generating `meta` fields

- [#2406](https://github.com/hey-api/hey-api/pull/2406) [`04fc0f3`](https://github.com/hey-api/hey-api/commit/04fc0f3106b33c1de8a78a401187617c3a788bc5) Thanks [@dovca](https://github.com/dovca)! - feat(clients): pass raw `body` to interceptors, provide serialized body in `serializedBody`

- [#2407](https://github.com/hey-api/hey-api/pull/2407) [`9704055`](https://github.com/hey-api/hey-api/commit/970405534e26ddebaaaed71e2a7a242e005ca44e) Thanks [@flow96](https://github.com/flow96)! - fix(sdk): prevent infinite loop when a schema tag matches operation ID

## 0.80.5

### Patch Changes

- [#2401](https://github.com/hey-api/hey-api/pull/2401) [`42566ef`](https://github.com/hey-api/hey-api/commit/42566ef86fe5af1f4768eaf08f0cafaa84c69044) Thanks [@mrclrchtr](https://github.com/mrclrchtr)! - fix: resolve Yarn PnP compatibility issues with client bundle generation

## 0.80.4

### Patch Changes

- [#2391](https://github.com/hey-api/hey-api/pull/2391) [`ac3456f`](https://github.com/hey-api/hey-api/commit/ac3456f4c793f7f8b8f535766382476d6d410219) Thanks [@ahmedrowaihi](https://github.com/ahmedrowaihi)! - fix(tanstack-query): add `queryKeys.tags` and `infiniteQueryKeys.tags` options

## 0.80.3

### Patch Changes

- [#2287](https://github.com/hey-api/hey-api/pull/2287) [`6df1237`](https://github.com/hey-api/hey-api/commit/6df1237cefcb803da55cb780285fc82be05e019a) Thanks [@MaxwellAt](https://github.com/MaxwellAt)! - fix(zod): improve handling of additional properties

## 0.80.2

### Patch Changes

- [#2383](https://github.com/hey-api/hey-api/pull/2383) [`2ac456f`](https://github.com/hey-api/hey-api/commit/2ac456f0f6247ef51a83a8ddbe9a03d9b2dabae7) Thanks [@j-ibarra](https://github.com/j-ibarra)! - fix(transformers): add `typeTransformers` option allowing passing custom transform functions

- [#2382](https://github.com/hey-api/hey-api/pull/2382) [`3a23362`](https://github.com/hey-api/hey-api/commit/3a2336204fb06b8fa69faa24de976122ad44c16a) Thanks [@idbenami](https://github.com/idbenami)! - fix(client-axios): allow passing `AxiosInstance` into `axios` field

## 0.80.1

### Patch Changes

- [#2344](https://github.com/hey-api/hey-api/pull/2344) [`fb7b724`](https://github.com/hey-api/hey-api/commit/fb7b7243663ca40bf79bd76bd7af7a9376474505) Thanks [@Daschi1](https://github.com/Daschi1)! - fix(valibot): expand support for `format: int64`

## 0.80.0

### Minor Changes

- [#2341](https://github.com/hey-api/hey-api/pull/2341) [`9954bcf`](https://github.com/hey-api/hey-api/commit/9954bcf139efca45f0c0cd0c25e5236dbf5c7121) Thanks [@mrlubos](https://github.com/mrlubos)! - feat(zod): add support for Zod 4 and Zod Mini

  ### Added Zod 4 and Zod Mini

  This release adds support for Zod 4 and Zod Mini. By default, the `zod` plugin will generate output for Zod 4. If you want to preserve the previous output for Zod 3 or use Zod Mini, set `compatibilityVersion` to `3` or `mini`.

  ```js
  export default {
    input: "hey-api/backend", // sign up at app.heyapi.dev
    output: "src/client",
    plugins: [
      // ...other plugins
      {
        name: "zod",
        compatibilityVersion: 3,
      },
    ],
  };
  ```

  ```js
  export default {
    input: "hey-api/backend", // sign up at app.heyapi.dev
    output: "src/client",
    plugins: [
      // ...other plugins
      {
        name: "zod",
        compatibilityVersion: "mini",
      },
    ],
  };
  ```

## 0.79.2

### Patch Changes

- [#2034](https://github.com/hey-api/hey-api/pull/2034) [`257dd07`](https://github.com/hey-api/hey-api/commit/257dd0711f81221c49d26dc57c079f1ae956ca6e) Thanks [@Le0Developer](https://github.com/Le0Developer)! - fix(typescript): add support for TypeID types

- [#2041](https://github.com/hey-api/hey-api/pull/2041) [`2755be9`](https://github.com/hey-api/hey-api/commit/2755be939376227969d2b216f556666cef67f01a) Thanks [@alexvuka1](https://github.com/alexvuka1)! - fix(parser): respect `output.case` when generating operation id

## 0.79.1

### Patch Changes

- [#2336](https://github.com/hey-api/hey-api/pull/2336) [`6302793`](https://github.com/hey-api/hey-api/commit/63027931f85bad817a8111c263579fd018cb39cb) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: respect NO_INTERACTIVE and NO_INTERACTION environment variables

- [#2331](https://github.com/hey-api/hey-api/pull/2331) [`a309fc7`](https://github.com/hey-api/hey-api/commit/a309fc799d4c0899b781e40a721dd1aa834e42f3) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(client): update Axios headers types

- [#2334](https://github.com/hey-api/hey-api/pull/2334) [`298be27`](https://github.com/hey-api/hey-api/commit/298be2715106c840067f54648ee8e94314dfc742) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: improve handlebars types for jsr compliance

- [#2333](https://github.com/hey-api/hey-api/pull/2333) [`566c8e9`](https://github.com/hey-api/hey-api/commit/566c8e99aeaa6142aa65b8af370f2ff7e0f4d219) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(tanstack-query): set query key base url from options if defined

## 0.79.0

### Minor Changes

- [#2284](https://github.com/hey-api/hey-api/pull/2284) [`236550f`](https://github.com/hey-api/hey-api/commit/236550fa56645dffe855f051fc144b8d8342f5fc) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(typescript): removed `typescript+namespace` enums mode

  ### Removed `typescript+namespace` enums mode

  Due to a simpler TypeScript plugin implementation, the `typescript+namespace` enums mode is no longer necessary. This mode was used in the past to group inline enums under the same namespace. With the latest changes, this behavior is no longer supported. You can either choose to ignore inline enums (default), or use the `enums` transform (added in v0.78.0) to convert them into reusable components which will get exported as usual.

## 0.78.3

### Patch Changes

- [#2290](https://github.com/hey-api/hey-api/pull/2290) [`4a77615`](https://github.com/hey-api/hey-api/commit/4a776157d0168f4f5f267581874861c2e84ef544) Thanks [@btmnk](https://github.com/btmnk)! - fix(client): improve types to pass `@total-typescript/ts-reset` rules

## 0.78.2

### Patch Changes

- [#2281](https://github.com/hey-api/hey-api/pull/2281) [`565830b`](https://github.com/hey-api/hey-api/commit/565830b97c34efe632db69b423c2d10b80693b76) Thanks [@j-ibarra](https://github.com/j-ibarra)! - fix(transformers): add `transformers` option allowing passing custom transform functions

## 0.78.1

### Patch Changes

- [#2275](https://github.com/hey-api/hey-api/pull/2275) [`1581b5c`](https://github.com/hey-api/hey-api/commit/1581b5cd9b2ff160d10c19ff8c195063155c66ae) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(valibot): properly handle array minLength and maxLength

- [#2279](https://github.com/hey-api/hey-api/pull/2279) [`f0549f6`](https://github.com/hey-api/hey-api/commit/f0549f62d50da8a92a330bcdc73b22ee6d211be3) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(typescript): handle additionalProperties in propertyNames

- [#2277](https://github.com/hey-api/hey-api/pull/2277) [`25fc54c`](https://github.com/hey-api/hey-api/commit/25fc54cd9088240faa47ff7c9607e17c2e52780d) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(clients): annotate serializer return types

- [#2280](https://github.com/hey-api/hey-api/pull/2280) [`ae9c45a`](https://github.com/hey-api/hey-api/commit/ae9c45a79cac56362552033b49ebf2958e11324c) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(zod): add `dates.offset` option

## 0.78.0

### Minor Changes

- [#2246](https://github.com/hey-api/hey-api/pull/2246) [`a11a8c5`](https://github.com/hey-api/hey-api/commit/a11a8c5d0e3fd3f8564e4b0873babdee0dfea2d3) Thanks [@mrlubos](https://github.com/mrlubos)! - feat(config): add `parser` options

  ### Added `parser` options

  Previously, `@hey-api/typescript` would generate correct types, but the validator plugins would have to re-implement the same logic or generate schemas that didn't match the generated types.

  Since neither option was ideal, this release adds a dedicated place for `parser` options. Parser is responsible for preparing the input so plugins can generate more accurate output with less effort.

  You can learn more about configuring parser on the [Parser](https://heyapi.dev/openapi-ts/configuration/parser) page.

  ### Moved `input` options

  The following options were moved to the new `parser` group.

  - `input.filters` moved to `parser.filters`
  - `input.pagination` moved to `parser.pagination`
  - `input.patch` moved to `parser.patch`
  - `input.validate_EXPERIMENTAL` moved to `parser.validate_EXPERIMENTAL`

  ### Updated `typescript` options

  The following options were renamed.

  - `enumsCase` moved to `enums.case`
  - `enumsConstantsIgnoreNull` moved to `enums.constantsIgnoreNull`

  ### Moved `typescript` options

  The following options were moved to the new `parser` group.

  - `exportInlineEnums` moved to `parser.transforms.enums`
  - `readOnlyWriteOnlyBehavior` moved to `parser.transforms.readWrite.enabled`
  - `readableNameBuilder` moved to `parser.transforms.readWrite.responses.name`
  - `writableNameBuilder` moved to `parser.transforms.readWrite.requests.name`

  ### Updated `readWrite.responses` name

  Additionally, the naming pattern for response schemas has changed from `{name}Readable` to `{name}`. This is to prevent your code from breaking by default when using a schema that gets updated with a write-only field.

### Patch Changes

- [#2246](https://github.com/hey-api/hey-api/pull/2246) [`d901bd5`](https://github.com/hey-api/hey-api/commit/d901bd55e17c9a06abfa5af4d9ac62a06dd6c82e) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(config): add `operations` option to `parser.patch`

## 0.77.0

### Minor Changes

- [#2227](https://github.com/hey-api/hey-api/pull/2227) [`4ea6f24`](https://github.com/hey-api/hey-api/commit/4ea6f24d02d8e8867313073d003f0b573f2054db) Thanks [@mrlubos](https://github.com/mrlubos)! - refactor(plugin): add `DefinePlugin` utility types

  ### Updated Plugin API

  Please refer to the [custom plugin](https://heyapi.dev/openapi-ts/plugins/custom) tutorial for the latest guide.

- [#2227](https://github.com/hey-api/hey-api/pull/2227) [`4ea6f24`](https://github.com/hey-api/hey-api/commit/4ea6f24d02d8e8867313073d003f0b573f2054db) Thanks [@mrlubos](https://github.com/mrlubos)! - feat(sdk): update `validator` option

  ### Updated `sdk.validator` option

  Clients can now validate both request and response data. As a result, passing a boolean or string to `validator` will control both of these options. To preserve the previous behavior, set `validator.request` to `false` and `validator.response` to your previous configuration.

  ```js
  export default {
    input: "hey-api/backend", // sign up at app.heyapi.dev
    output: "src/client",
    plugins: [
      // ...other plugins
      {
        name: "@hey-api/sdk",
        validator: {
          request: false,
          response: true,
        },
      },
    ],
  };
  ```

### Patch Changes

- [#2227](https://github.com/hey-api/hey-api/pull/2227) [`4ea6f24`](https://github.com/hey-api/hey-api/commit/4ea6f24d02d8e8867313073d003f0b573f2054db) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(client): add requestValidator option

## 0.76.0

### Minor Changes

- [#2226](https://github.com/hey-api/hey-api/pull/2226) [`1c66d88`](https://github.com/hey-api/hey-api/commit/1c66d8866fa25dc9cf978ef94eab3bf8ca64d9f3) Thanks [@mrlubos](https://github.com/mrlubos)! - feat(valibot): generate a single schema for requests

  ### Single Valibot schema per request

  Previously, we generated a separate schema for each endpoint parameter and request body. In v0.76.0, a single request schema is generated for the whole endpoint. It may contain a request body, parameters, and headers.

  ```ts
  const vData = v.object({
    body: v.optional(
      v.object({
        foo: v.optional(v.string()),
        bar: v.optional(v.union([v.number(), v.null()])),
      })
    ),
    headers: v.optional(v.never()),
    path: v.object({
      baz: v.string(),
    }),
    query: v.optional(v.never()),
  });
  ```

  If you need to access individual fields, you can do so using the [`.entries`](https://valibot.dev/api/object/) API. For example, we can get the request body schema with `vData.entries.body`.

### Patch Changes

- [#2221](https://github.com/hey-api/hey-api/pull/2221) [`e335e1e`](https://github.com/hey-api/hey-api/commit/e335e1ea31256b3b284b7ef968d566c1315096b3) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(parser): prefer JSON media type

- [#2226](https://github.com/hey-api/hey-api/pull/2226) [`1c66d88`](https://github.com/hey-api/hey-api/commit/1c66d8866fa25dc9cf978ef94eab3bf8ca64d9f3) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(valibot): add `metadata` option to generate additional metadata for documentation, code generation, AI structured outputs, form validation, and other purposes

## 0.75.0

### Minor Changes

- [#2215](https://github.com/hey-api/hey-api/pull/2215) [`82e56e9`](https://github.com/hey-api/hey-api/commit/82e56e926e90d8575302db7fa4843b3663ac3971) Thanks [@mrlubos](https://github.com/mrlubos)! - feat(parser): replace `plugin.subscribe()` with `plugin.forEach()`

  ### Added `plugin.forEach()` method

  This method replaces the `.subscribe()` method. Additionally, `.forEach()` is executed immediately, which means we don't need the `before` and `after` events – simply move your code before and after the `.forEach()` block.

  ```ts
  plugin.forEach("operation", "schema", (event) => {
    // do something with event
  });
  ```

- [#2218](https://github.com/hey-api/hey-api/pull/2218) [`e5ff024`](https://github.com/hey-api/hey-api/commit/e5ff024d4ff2c715276fda88269e7c1668cb929e) Thanks [@mrlubos](https://github.com/mrlubos)! - feat(tanstack-query): add name and case options

  ### Updated TanStack Query options

  The TanStack Query plugin options have been expanded to support more naming and casing patterns. As a result, the following options have been renamed.

  - `queryOptionsNameBuilder` renamed to `queryOptions`
  - `infiniteQueryOptionsNameBuilder` renamed to `infiniteQueryOptions`
  - `mutationOptionsNameBuilder` renamed to `mutationOptions`
  - `queryKeyNameBuilder` renamed to `queryKeys`
  - `infiniteQueryKeyNameBuilder` renamed to `infiniteQueryKeys`

### Patch Changes

- [#2219](https://github.com/hey-api/hey-api/pull/2219) [`4df6fa0`](https://github.com/hey-api/hey-api/commit/4df6fa0540c4e0e0adce485cb813ea57bf97b908) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: make output pass stricter tsconfig configurations"

- [#2213](https://github.com/hey-api/hey-api/pull/2213) [`2ffb612`](https://github.com/hey-api/hey-api/commit/2ffb61253b302d746c4f08beae9daeec345343f6) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(validators): handle additional properties object when no other properties are defined

- [#2216](https://github.com/hey-api/hey-api/pull/2216) [`1456f87`](https://github.com/hey-api/hey-api/commit/1456f878cbe7ad7d2894a3ba8dddcc8b79d04920) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(parser): add `meta` and `version` options to input.patch

- [#2210](https://github.com/hey-api/hey-api/pull/2210) [`5b1362a`](https://github.com/hey-api/hey-api/commit/5b1362ae8bebf9aef846140e1400270131cbe64f) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(cli): correctly detect watch mode

## 0.74.0

### Minor Changes

- [#2201](https://github.com/hey-api/hey-api/pull/2201) [`ab8cede`](https://github.com/hey-api/hey-api/commit/ab8cedefe0ca99492d064dfc191f5445bd8102fb) Thanks [@mrlubos](https://github.com/mrlubos)! - feat(zod): generate a single schema for requests

  ### Single Zod schema per request

  Previously, we generated a separate schema for each endpoint parameter and request body. In v0.74.0, a single request schema is generated for the whole endpoint. It may contain a request body, parameters, and headers.

  ```ts
  const zData = z.object({
    body: z
      .object({
        foo: z.string().optional(),
        bar: z.union([z.number(), z.null()]).optional(),
      })
      .optional(),
    headers: z.never().optional(),
    path: z.object({
      baz: z.string(),
    }),
    query: z.never().optional(),
  });
  ```

  If you need to access individual fields, you can do so using the [`.shape`](https://zod.dev/api?id=shape) API. For example, we can get the request body schema with `zData.shape.body`.

### Patch Changes

- [#2192](https://github.com/hey-api/hey-api/pull/2192) [`7a740ed`](https://github.com/hey-api/hey-api/commit/7a740ed2007b81c0088f4d80dd3401c9af673767) Thanks [@Daschi1](https://github.com/Daschi1)! - fix(valibot): use `isoTimestamp` instead of `isoDateTime` for date-time format

- [#2201](https://github.com/hey-api/hey-api/pull/2201) [`a889c3c`](https://github.com/hey-api/hey-api/commit/a889c3c899b54aec73a3ecffc071a412b44c112a) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(parser): do not mark schemas as duplicate if they have different format

## 0.73.0

### Minor Changes

- [#2172](https://github.com/hey-api/hey-api/pull/2172) [`29605a0`](https://github.com/hey-api/hey-api/commit/29605a0e1b58e986458275833a98a396eede9089) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: bundle `@hey-api/client-*` plugins

  ### Bundle `@hey-api/client-*` plugins

  In previous releases, you had to install a separate client package to generate a fully working output, e.g. `npm install @hey-api/client-fetch`. This created a few challenges: getting started was slower, upgrading was sometimes painful, and bundling too. Beginning with v0.73.0, all Hey API clients are bundled by default and don't require installing any additional dependencies. You can remove any installed client packages and re-run `@hey-api/openapi-ts`.

  ```sh
  npm uninstall @hey-api/client-fetch
  ```

### Patch Changes

- [#2172](https://github.com/hey-api/hey-api/pull/2172) [`9afbf66`](https://github.com/hey-api/hey-api/commit/9afbf666614ecb597f68ec809981f2acc28c66dc) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: respect logs setting if initialization fails

- [#2170](https://github.com/hey-api/hey-api/pull/2170) [`c18dd1e`](https://github.com/hey-api/hey-api/commit/c18dd1e41b1c055306932ca6d3fa905c14ad1dd4) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: export default pagination keywords

## 0.72.2

### Patch Changes

- [#2163](https://github.com/hey-api/hey-api/pull/2163) [`9769998`](https://github.com/hey-api/hey-api/commit/9769998550b1cb77f838827a9617b9dbbfa54537) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(zod): add `metadata` option to generate additional metadata for documentation, code generation, AI structured outputs, form validation, and other purposes

- [#2167](https://github.com/hey-api/hey-api/pull/2167) [`a46259e`](https://github.com/hey-api/hey-api/commit/a46259eb4d2ed1c95908a5ad3d69b0495a8aacb4) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(tanstack-query): add name builder options for all generated artifacts

- [#2166](https://github.com/hey-api/hey-api/pull/2166) [`594f3a6`](https://github.com/hey-api/hey-api/commit/594f3a6c7a154294fd99f5f76f2b0a9589a1e7f3) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(parser): filter orphans only when there are some operations

- [#2166](https://github.com/hey-api/hey-api/pull/2166) [`594f3a6`](https://github.com/hey-api/hey-api/commit/594f3a6c7a154294fd99f5f76f2b0a9589a1e7f3) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(zod): support tuple types

- [#2167](https://github.com/hey-api/hey-api/pull/2167) [`a46259e`](https://github.com/hey-api/hey-api/commit/a46259eb4d2ed1c95908a5ad3d69b0495a8aacb4) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(parser): set correct subscription context for plugins

## 0.72.1

### Patch Changes

- [#2159](https://github.com/hey-api/hey-api/pull/2159) [`87b2d6c`](https://github.com/hey-api/hey-api/commit/87b2d6cf075a3d0466a2e510a2fc89b409d57e3e) Thanks [@Joshua-hypt](https://github.com/Joshua-hypt)! - fix(zod): handle array union types

## 0.72.0

### Minor Changes

- [#2141](https://github.com/hey-api/hey-api/pull/2141) [`557769d`](https://github.com/hey-api/hey-api/commit/557769d10a7b4da55489239a437c9611a3c41a24) Thanks [@mrlubos](https://github.com/mrlubos)! - feat(sdk): add `classStructure` option supporting dot or slash `operationId` notation when generating class-based SDKs

  ### Added `sdk.classStructure` option

  When generating class-based SDKs, we now try to infer the ideal structure using `operationId` keywords. If you'd like to preserve the previous behavior, set `classStructure` to `off`.

  ```js
  export default {
    input: "hey-api/backend", // sign up at app.heyapi.dev
    output: "src/client",
    plugins: [
      // ...other plugins
      {
        classStructure: "off",
        name: "@hey-api/sdk",
      },
    ],
  };
  ```

### Patch Changes

- [#2151](https://github.com/hey-api/hey-api/pull/2151) [`0ea8130`](https://github.com/hey-api/hey-api/commit/0ea8130ff6b2e047dbc4fd6a30d08f54da367d0c) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add crash report prompt

- [#2153](https://github.com/hey-api/hey-api/pull/2153) [`b272bd9`](https://github.com/hey-api/hey-api/commit/b272bd9e4adfb0d87a05b023bc078246e7ee4937) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(parser): handle `propertyNames` keyword

- [#2152](https://github.com/hey-api/hey-api/pull/2152) [`6d5ad37`](https://github.com/hey-api/hey-api/commit/6d5ad37e474ad659efb8ffdc649829ac4e1e1b8a) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(validators): correctly generate default value for `BigInt`

- [#2151](https://github.com/hey-api/hey-api/pull/2151) [`aef80c3`](https://github.com/hey-api/hey-api/commit/aef80c397b254f391543ff11cac417fab8397c8b) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(typescript): handle nested inline objects with write/read only fields

## 0.71.1

### Patch Changes

- [#2139](https://github.com/hey-api/hey-api/pull/2139) [`0c27937`](https://github.com/hey-api/hey-api/commit/0c279378b9be7bf0eaa29586999ecd3b983a26a4) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(parser): skip schema if it's an array or tuple and its items don't have any matching readable or writable scopes

- [#2140](https://github.com/hey-api/hey-api/pull/2140) [`54049fe`](https://github.com/hey-api/hey-api/commit/54049fe262336f5b439a540cbe362478ecbe8317) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(parser): validate operationId keyword

- [#2137](https://github.com/hey-api/hey-api/pull/2137) [`058dbc9`](https://github.com/hey-api/hey-api/commit/058dbc9fa81c95dca02788ad58231915cb1c4de3) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(parser): respect exportFromIndex option when using legacy clients

## 0.71.0

### Minor Changes

- [#2130](https://github.com/hey-api/hey-api/pull/2130) [`dc7535e`](https://github.com/hey-api/hey-api/commit/dc7535e6ed5b01ef722d536b909202e28ab16b46) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(sdk): rename `serviceNameBuilder` to `classNameBuilder`

### Patch Changes

- [#2117](https://github.com/hey-api/hey-api/pull/2117) [`a1435b9`](https://github.com/hey-api/hey-api/commit/a1435b915a272d9ffa599c194ee52c2a33f77fcd) Thanks [@johnny-mh](https://github.com/johnny-mh)! - feat(parser): allow patching specs with `input.patch`

- [#2132](https://github.com/hey-api/hey-api/pull/2132) [`9473613`](https://github.com/hey-api/hey-api/commit/9473613187a72a4ae4ed3047994b076c89285737) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(typescript): better detect enum namespace

- [#2130](https://github.com/hey-api/hey-api/pull/2130) [`dc7535e`](https://github.com/hey-api/hey-api/commit/dc7535e6ed5b01ef722d536b909202e28ab16b46) Thanks [@mrlubos](https://github.com/mrlubos)! - feat(sdk): add `instance` option for instantiable SDKs

## 0.70.0

### Minor Changes

- [#2123](https://github.com/hey-api/hey-api/pull/2123) [`4d8c030`](https://github.com/hey-api/hey-api/commit/4d8c03038979c9a75315cc158789b3c198c62f90) Thanks [@mrlubos](https://github.com/mrlubos)! - feat(sdk): add responseStyle option

  **BREAKING**: Update your client to the latest version.

### Patch Changes

- [#2116](https://github.com/hey-api/hey-api/pull/2116) [`21ddf25`](https://github.com/hey-api/hey-api/commit/21ddf252fd556827240334a8f1f8cf3bae8ff5da) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(typescript): ensure generated enum uses unique namespace to avoid conflicts with non-enum declarations

- [#2116](https://github.com/hey-api/hey-api/pull/2116) [`08f3f89`](https://github.com/hey-api/hey-api/commit/08f3f898a8b5939a9e6eed70f6424d2bc5084da8) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(typescript): handle duplicate inline enum names

## 0.69.2

### Patch Changes

- [#2110](https://github.com/hey-api/hey-api/pull/2110) [`323a966`](https://github.com/hey-api/hey-api/commit/323a9661213e41723af1d7944232064022814d2b) Thanks [@mrlubos](https://github.com/mrlubos)! - feat(parser): add validate_EXPERIMENTAL option

- [#2114](https://github.com/hey-api/hey-api/pull/2114) [`55980f5`](https://github.com/hey-api/hey-api/commit/55980f533812cb33dc32e034f22aee1d58fe6c19) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(validators): do not wrap regular expression in slashes if the pattern is already wrapped

- [#2115](https://github.com/hey-api/hey-api/pull/2115) [`a94d3c0`](https://github.com/hey-api/hey-api/commit/a94d3c0503bbeeff026e9fea362f907a0e5d4cb7) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(tanstack-query): create a shallow copy of queryKey in createInfiniteParams function

## 0.69.1

### Patch Changes

- [#2109](https://github.com/hey-api/hey-api/pull/2109) [`6d6b087`](https://github.com/hey-api/hey-api/commit/6d6b08771e78d184c6b17c97c6baa5a750b84581) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(valibot): use isoDate instead of date for date strings

- [#2108](https://github.com/hey-api/hey-api/pull/2108) [`7e604fa`](https://github.com/hey-api/hey-api/commit/7e604fa03f34bcf621033f3ca633fa2365a79c53) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(typescript): generates union of arrays when items use nested oneOf

- [#2106](https://github.com/hey-api/hey-api/pull/2106) [`b0cb0ab`](https://github.com/hey-api/hey-api/commit/b0cb0abe0f63f144380cde5fe3a2381f61038e5f) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(schema): nameBuilder can be a string

- [#2106](https://github.com/hey-api/hey-api/pull/2106) [`b0cb0ab`](https://github.com/hey-api/hey-api/commit/b0cb0abe0f63f144380cde5fe3a2381f61038e5f) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(sdk): serviceNameBuilder can be a function

## 0.69.0

### Minor Changes

- [#2094](https://github.com/hey-api/hey-api/pull/2094) [`8152aaf`](https://github.com/hey-api/hey-api/commit/8152aaf4892c48b79fd3dc486eb3c0ea333dc3e6) Thanks [@mrlubos](https://github.com/mrlubos)! - feat(sdk): use responses/errors map instead of union

  **BREAKING**: Update your client to the latest version.

### Patch Changes

- [#2100](https://github.com/hey-api/hey-api/pull/2100) [`54757a2`](https://github.com/hey-api/hey-api/commit/54757a2cf266a0ee49277baaa6765e078c95f2a3) Thanks [@mrlubos](https://github.com/mrlubos)! - feat(validators): generate schemas for request parameters

- [#2099](https://github.com/hey-api/hey-api/pull/2099) [`a9484e0`](https://github.com/hey-api/hey-api/commit/a9484e0792dded8ccba280f0f4b55b72d22b3d83) Thanks [@mrlubos](https://github.com/mrlubos)! - feat(validators): generate schemas for request bodies

- [#2097](https://github.com/hey-api/hey-api/pull/2097) [`d95802f`](https://github.com/hey-api/hey-api/commit/d95802f92e504f19130bd2e18a4355ce51e38ce0) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(sdk): skip spreading required headers when there are conflicting Content-Type headers

- [#2096](https://github.com/hey-api/hey-api/pull/2096) [`22e0b3b`](https://github.com/hey-api/hey-api/commit/22e0b3bccf94b49fd82665e96074ab76eb241109) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(pagination): improved schema resolver for parameters

## 0.68.1

### Patch Changes

- [#2086](https://github.com/hey-api/hey-api/pull/2086) [`ae8aacd`](https://github.com/hey-api/hey-api/commit/ae8aacd8bf2a80bb4a2af2cae2b7993e988ee17a) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(parser): add back support for regular expressions in input filters

- [#2086](https://github.com/hey-api/hey-api/pull/2086) [`ae8aacd`](https://github.com/hey-api/hey-api/commit/ae8aacd8bf2a80bb4a2af2cae2b7993e988ee17a) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(parser): extend input filters to handle reusable parameters and responses

## 0.68.0

### Minor Changes

- [#2072](https://github.com/hey-api/hey-api/pull/2072) [`8bea7d2`](https://github.com/hey-api/hey-api/commit/8bea7d23a6280ee8dc843be656da820179140403) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: upgraded input filters

  ### Upgraded input filters

  Input filters now avoid generating invalid output without requiring you to specify every missing schema as in the previous releases. As part of this release, we changed the way filters are configured and removed the support for regular expressions. Let us know if regular expressions are still useful for you and want to bring them back!

  ```js
  export default {
    input: {
      // match only the schema named `foo` and `GET` operation for the `/api/v1/foo` path
      filters: {
        operations: {
          include: ['GET /api/v1/foo'], // [!code ++]
        },
        schemas: {
          include: ['foo'], // [!code ++]
        },
      },
      include: '^(#/components/schemas/foo|#/paths/api/v1/foo/get)
  ```

## 0.67.6

### Patch Changes

- [#2068](https://github.com/hey-api/hey-api/pull/2068) [`93b62fd`](https://github.com/hey-api/hey-api/commit/93b62fd433a09f28c75f58852e1baaa2b6fbd641) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(tanstack-query): require options when sdk client is set to false

- [#2060](https://github.com/hey-api/hey-api/pull/2060) [`373e15a`](https://github.com/hey-api/hey-api/commit/373e15a34fd81ac596a0797ddb133a47aeceee1f) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(valibot): add valibot plugin

## 0.67.5

### Patch Changes

- [#2052](https://github.com/hey-api/hey-api/pull/2052) [`f430eaa`](https://github.com/hey-api/hey-api/commit/f430eaad13d83d2191fff12802d9283099d7a527) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(tanstack-query): add SDK function comments to TanStack Query output

- [#2058](https://github.com/hey-api/hey-api/pull/2058) [`e9fda0b`](https://github.com/hey-api/hey-api/commit/e9fda0bff09c534333691f981363f445dc97129f) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(typescript): exclude $refs in readable/writable schemas when referenced schemas don't contain any readable/writable fields

- [#2059](https://github.com/hey-api/hey-api/pull/2059) [`af2082f`](https://github.com/hey-api/hey-api/commit/af2082f75dd02a52f8196709d7497dc99c5321e5) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(typescript): add enumsConstantsIgnoreNull option to skip nulls from generated JavaScript objects

## 0.67.4

### Patch Changes

- [#2043](https://github.com/hey-api/hey-api/pull/2043) [`e3997c8`](https://github.com/hey-api/hey-api/commit/e3997c8d9a9e8a6da7bc4b417769e751887ff6ac) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle enum keyword with array type

## 0.67.3

### Patch Changes

- [#2020](https://github.com/hey-api/hey-api/pull/2020) [`27cb409`](https://github.com/hey-api/hey-api/commit/27cb4095383aff35f1d78094b8b73fb36f432d33) Thanks [@0xfurai](https://github.com/0xfurai)! - fix: handle references to properties

## 0.67.2

### Patch Changes

- [#2023](https://github.com/hey-api/hey-api/pull/2023) [`c6f01f3`](https://github.com/hey-api/hey-api/commit/c6f01f39493e241f01dd7997ccdb8b6bc3d1519c) Thanks [@kennidenni](https://github.com/kennidenni)! - fix: handle relative paths in client's `baseUrl` field

## 0.67.1

### Patch Changes

- [#2010](https://github.com/hey-api/hey-api/pull/2010) [`13c9577`](https://github.com/hey-api/hey-api/commit/13c9577f122eab7b7fdd92f67ac77cb334cbdcd5) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: do not use named imports from typescript module

## 0.67.0

### Minor Changes

- [#2003](https://github.com/hey-api/hey-api/pull/2003) [`1504a06`](https://github.com/hey-api/hey-api/commit/1504a0642fdb4f856d1650fade2d30988b35b4ff) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: respect `moduleResolution` value in `tsconfig.json`

  ### Respecting `moduleResolution` value in `tsconfig.json`

  This release introduces functionality related to your `tsconfig.json` file. The initial feature properly respects the value of your `moduleResolution` field. If you're using `nodenext`, the relative module paths in your output will be appended with `.js`. To preserve the previous behavior where we never appended `.js` to relative module paths, set `output.tsConfigPath` to `off`.

  ```js
  export default {
    input: "hey-api/backend", // sign up at app.heyapi.dev
    output: {
      path: "src/client",
      tsConfigPath: "off",
    },
  };
  ```

### Patch Changes

- [#2006](https://github.com/hey-api/hey-api/pull/2006) [`aa10522`](https://github.com/hey-api/hey-api/commit/aa10522f2bd018a417d875e5ab12ed0a848d2e49) Thanks [@Liooo](https://github.com/Liooo)! - fix: make discriminator field required when used with `oneOf` keyword

- [#2009](https://github.com/hey-api/hey-api/pull/2009) [`f45ba8e`](https://github.com/hey-api/hey-api/commit/f45ba8e96872a13be71c0d07e134f8c6717458d4) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: avoid including underscore for appended types (e.g. data, error, response) when preserving identifier case

## 0.66.7

### Patch Changes

- [#1981](https://github.com/hey-api/hey-api/pull/1981) [`955b95a`](https://github.com/hey-api/hey-api/commit/955b95ab051401bdbeaa8cfb93a7a7b707cb7529) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle schemas with all write-only or read-only fields

- [#1990](https://github.com/hey-api/hey-api/pull/1990) [`2fb1689`](https://github.com/hey-api/hey-api/commit/2fb1689b6538d32d123235175159d412df988241) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: avoid generating duplicate operation ids when sanitizing input

- [#1991](https://github.com/hey-api/hey-api/pull/1991) [`b6e654a`](https://github.com/hey-api/hey-api/commit/b6e654a6e18698f3c554848f8b8113e30f108fc4) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: Zod schemas use .and() instead of .merge()

- [#1919](https://github.com/hey-api/hey-api/pull/1919) [`ec62470`](https://github.com/hey-api/hey-api/commit/ec624709b1fb07da8d7234fe851561054dc68150) Thanks [@ngalluzzo](https://github.com/ngalluzzo)! - fix: correctly handle numeric property names with signs

- [#1984](https://github.com/hey-api/hey-api/pull/1984) [`0f305e0`](https://github.com/hey-api/hey-api/commit/0f305e06337758ee16c801ad437d9ce0996fc8b0) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: Zod plugin handles nullable enums

- [#1986](https://github.com/hey-api/hey-api/pull/1986) [`dbebff8`](https://github.com/hey-api/hey-api/commit/dbebff8dcba4c93d0c534e6e48e59e2aaaffd540) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle discriminator with multiple mappings to the same schema

- [#1980](https://github.com/hey-api/hey-api/pull/1980) [`0d7bede`](https://github.com/hey-api/hey-api/commit/0d7bede6e40553ae1c4c888770c84e55732b3cae) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: Zod schemas with BigInt and min/max constraints

- [#1987](https://github.com/hey-api/hey-api/pull/1987) [`71e2fd0`](https://github.com/hey-api/hey-api/commit/71e2fd029f2374ed8d2eaa01beecf254757e08d8) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: correct path to nested plugin files when using exportFromIndex

- [#1978](https://github.com/hey-api/hey-api/pull/1978) [`267f4b3`](https://github.com/hey-api/hey-api/commit/267f4b3730f2a477906e4e1593154dcd1723e554) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle extended `$ref` with `type` keyword in OpenAPI 3.1

- [#1982](https://github.com/hey-api/hey-api/pull/1982) [`1e6d74f`](https://github.com/hey-api/hey-api/commit/1e6d74f8321af5c61f86318b835d25db38609b03) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle additionalProperties empty object as unknown instead of preserving an empty interface

## 0.66.6

### Patch Changes

- [#1971](https://github.com/hey-api/hey-api/pull/1971) [`e1fb199`](https://github.com/hey-api/hey-api/commit/e1fb199a22a30653b95d498e6aaca2c59ed2b13b) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle Zod circular reference

## 0.66.5

### Patch Changes

- [#1951](https://github.com/hey-api/hey-api/pull/1951) [`4be46e5`](https://github.com/hey-api/hey-api/commit/4be46e506db1b2c53d1ddbf66e9919b5072f1cc0) Thanks [@devNameAsyraf](https://github.com/devNameAsyraf)! - fix: don't use JSON serializer for `application/octet-stream`

- [#1938](https://github.com/hey-api/hey-api/pull/1938) [`2a03e37`](https://github.com/hey-api/hey-api/commit/2a03e371715b5948ba568009975ad65ccbf7bfd7) Thanks [@sredni](https://github.com/sredni)! - fix: repeat tuple type `maxItems` times

## 0.66.4

### Patch Changes

- [#1936](https://github.com/hey-api/hey-api/pull/1936) [`ba2e5ca`](https://github.com/hey-api/hey-api/commit/ba2e5ca8af1cfe478963d72ff76d7d7ae026c5a5) Thanks [@seriouslag](https://github.com/seriouslag)! - fix: add return type to TanStack Query mutations

- [#1934](https://github.com/hey-api/hey-api/pull/1934) [`d4df550`](https://github.com/hey-api/hey-api/commit/d4df5503369b7aa105c7f6a49e1c7b43e0e50f49) Thanks [@seriouslag](https://github.com/seriouslag)! - fix: export some internal functions

## 0.66.3

### Patch Changes

- [#1917](https://github.com/hey-api/hey-api/pull/1917) [`d7af22c`](https://github.com/hey-api/hey-api/commit/d7af22c771af4bd2dab28acc69430717da390670) Thanks [@Freddis](https://github.com/Freddis)! - fix: handle nullable dates in transformers

## 0.66.2

### Patch Changes

- [#1913](https://github.com/hey-api/hey-api/pull/1913) [`7cfa4a7`](https://github.com/hey-api/hey-api/commit/7cfa4a76b13ca97d49c5f0366ba7264f94753d8b) Thanks [@BogdanMaier](https://github.com/BogdanMaier)! - fix: prevent crash when optional pagination field is missing

## 0.66.1

### Patch Changes

- [#1906](https://github.com/hey-api/hey-api/pull/1906) [`d1928d1`](https://github.com/hey-api/hey-api/commit/d1928d17710240bb42a6aa12da4618a9dd962df2) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: exclude and include expressions can be an array

- [#1906](https://github.com/hey-api/hey-api/pull/1906) [`d1928d1`](https://github.com/hey-api/hey-api/commit/d1928d17710240bb42a6aa12da4618a9dd962df2) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: support excluding deprecated fields with '@deprecated'

## 0.66.0

### Minor Changes

- [#1896](https://github.com/hey-api/hey-api/pull/1896) [`8840ed7`](https://github.com/hey-api/hey-api/commit/8840ed73df5ee718e803aa6e27b66e0c82ec3651) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: support read-only and write-only properties

  ### Read-only and write-only fields

  Starting with v0.66.0, `@hey-api/typescript` will generate separate types for payloads and responses if it detects any read-only or write-only fields. To preserve the previous behavior and generate a single type regardless, set `readOnlyWriteOnlyBehavior` to `off`.

  ```js
  export default {
    input: "hey-api/backend", // sign up at app.heyapi.dev
    output: "src/client",
    plugins: [
      // ...other plugins
      {
        name: "@hey-api/typescript",
        readOnlyWriteOnlyBehavior: "off", // [!code ++]
      },
    ],
  };
  ```

## 0.65.0

### Minor Changes

- [#1889](https://github.com/hey-api/hey-api/pull/1889) [`67c385b`](https://github.com/hey-api/hey-api/commit/67c385bf6289a79726b0cdd85fd81ca501cf2248) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: support custom clients

### Patch Changes

- [#1892](https://github.com/hey-api/hey-api/pull/1892) [`29fa764`](https://github.com/hey-api/hey-api/commit/29fa764986af3d3af842793c74d61681c7e967a1) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: allow passing fetch options to the request resolving a specification

- [#1877](https://github.com/hey-api/hey-api/pull/1877) [`6971f5b`](https://github.com/hey-api/hey-api/commit/6971f5bca4dd17ea65400c504ad0a4ffb083a38b) Thanks [@Matsuuu](https://github.com/Matsuuu)! - feat: ability to disable writing a log file via a `--no-log-file` flag or `logs.file` = `false`

## 0.64.15

### Patch Changes

- [#1850](https://github.com/hey-api/hey-api/pull/1850) [`fe43b88`](https://github.com/hey-api/hey-api/commit/fe43b889c20a2001f56e259f93f64851a1caa1d1) Thanks [@kelnos](https://github.com/kelnos)! - feat: add support for cookies auth

## 0.64.14

### Patch Changes

- [#1827](https://github.com/hey-api/hey-api/pull/1827) [`9dd43db`](https://github.com/hey-api/hey-api/commit/9dd43db54f2b7ebf87c5c7c118fdf149162a533d) Thanks [@john-cremit](https://github.com/john-cremit)! - feat: allow customizing pagination keywords using `input.pagination.keywords`

## 0.64.13

### Patch Changes

- [#1822](https://github.com/hey-api/hey-api/pull/1822) [`c73b0d4`](https://github.com/hey-api/hey-api/commit/c73b0d401c2bfa6f0b0d89d844a6aa09f2685a69) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: bump json-schema-ref-parser package

- [#1826](https://github.com/hey-api/hey-api/pull/1826) [`90886c1`](https://github.com/hey-api/hey-api/commit/90886c1372a999e8cb59d5da218762f6ee6cd459) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: allow config to be a function

## 0.64.12

### Patch Changes

- [#1816](https://github.com/hey-api/hey-api/pull/1816) [`b9e1b4b`](https://github.com/hey-api/hey-api/commit/b9e1b4bec5e1c5d1f2b5b9cfc7fa145274ae604d) Thanks [@shemsiu](https://github.com/shemsiu)! - Allow `scheme` property to be case-insensitive

## 0.64.11

### Patch Changes

- [#1800](https://github.com/hey-api/hey-api/pull/1800) [`a4811bd`](https://github.com/hey-api/hey-api/commit/a4811bdf178ec1a7f1602e0483a32fe7303f4eac) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: support Hey API platform input arguments

- [#1800](https://github.com/hey-api/hey-api/pull/1800) [`a4811bd`](https://github.com/hey-api/hey-api/commit/a4811bdf178ec1a7f1602e0483a32fe7303f4eac) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle raw OpenAPI specification input

## 0.64.10

### Patch Changes

- [#1779](https://github.com/hey-api/hey-api/pull/1779) [`57fcec8`](https://github.com/hey-api/hey-api/commit/57fcec804e339cfe508cfba4afd203c22495bff2) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: don't throw on missing performance marks

- [#1767](https://github.com/hey-api/hey-api/pull/1767) [`2de84ea`](https://github.com/hey-api/hey-api/commit/2de84ea3dbd2cba50150808a872aea8242c33014) Thanks [@Schroedi](https://github.com/Schroedi)! - fix: handle nested dates in transformers

## 0.64.9

### Patch Changes

- [#1774](https://github.com/hey-api/hey-api/pull/1774) [`c0b36b9`](https://github.com/hey-api/hey-api/commit/c0b36b95645d484034c3af145c5554867568979b) Thanks [@mrlubos](https://github.com/mrlubos)! - docs: announce Hey API platform

## 0.64.8

### Patch Changes

- [#1764](https://github.com/hey-api/hey-api/pull/1764) [`b3ecac3`](https://github.com/hey-api/hey-api/commit/b3ecac31d49a269ab400db4dbb84a22f1047e19a) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: reduce minimum Node.js 22 version to 22.10.0

## 0.64.7

### Patch Changes

- [#1755](https://github.com/hey-api/hey-api/pull/1755) [`82f7c14`](https://github.com/hey-api/hey-api/commit/82f7c1425dd903b75d15cf532b88580d180f281a) Thanks [@Matsuuu](https://github.com/Matsuuu)! - fix: Wrap the GET request in watch mode with try-catch to prevent crashes on no-head watch targets

## 0.64.6

### Patch Changes

- [#1748](https://github.com/hey-api/hey-api/pull/1748) [`7326d25`](https://github.com/hey-api/hey-api/commit/7326d2550ae3336fd8f754f8d4a25f1a40c13a2b) Thanks [@Matsuuu](https://github.com/Matsuuu)! - fix: Wrap HEAD request in a try-catch to prevent watch mode crashes on server reloads

## 0.64.5

### Patch Changes

- [#1728](https://github.com/hey-api/hey-api/pull/1728) [`cc8dabb`](https://github.com/hey-api/hey-api/commit/cc8dabbf1cb94879bb08fe66ecb04c4d0801e9cc) Thanks [@georgesmith46](https://github.com/georgesmith46)! - fix: correctly generate zod regex expressions when using patterns

## 0.64.4

### Patch Changes

- [#1710](https://github.com/hey-api/hey-api/pull/1710) [`4afdaa1`](https://github.com/hey-api/hey-api/commit/4afdaa1247b0bf0629817a51c29ca25840569b77) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: use relative path to custom config file if provided when resolving relative paths

## 0.64.3

### Patch Changes

- [#1701](https://github.com/hey-api/hey-api/pull/1701) [`e86629b`](https://github.com/hey-api/hey-api/commit/e86629bfa9ae2a47131d3a9a240a6aa2a4f67911) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: correctly type default value for Nuxt client

## 0.64.2

### Patch Changes

- [#1697](https://github.com/hey-api/hey-api/pull/1697) [`dec3fed`](https://github.com/hey-api/hey-api/commit/dec3fedb5f51aad4711fec15a006c525cb0bf7d8) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add exportFromIndex option to all plugins

- [#1699](https://github.com/hey-api/hey-api/pull/1699) [`8ff188f`](https://github.com/hey-api/hey-api/commit/8ff188fb269cf46321538dbe846e1b9ae3b8de42) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: allow passing arbitrary values to SDK functions via `meta` field

- [#1687](https://github.com/hey-api/hey-api/pull/1687) [`04c7cea`](https://github.com/hey-api/hey-api/commit/04c7ceac940a81cbed6a4070d9244aa5052ba4a2) Thanks [@hunshcn](https://github.com/hunshcn)! - sanitize "+" in uri to avoid plus in function name

## 0.64.1

### Patch Changes

- [#1668](https://github.com/hey-api/hey-api/pull/1668) [`7a03341`](https://github.com/hey-api/hey-api/commit/7a03341301d9d56ae93b4e4e3bd1ca469444f886) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: watch mode handles servers not exposing HEAD method for spec

- [#1668](https://github.com/hey-api/hey-api/pull/1668) [`7a03341`](https://github.com/hey-api/hey-api/commit/7a03341301d9d56ae93b4e4e3bd1ca469444f886) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add watch.timeout option

## 0.64.0

### Minor Changes

- [#1661](https://github.com/hey-api/hey-api/pull/1661) [`ccefe43`](https://github.com/hey-api/hey-api/commit/ccefe434ee83f1202769547ce128e1c134dee25f) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: added `client.baseUrl` option

  ### Added `client.baseUrl` option

  You can use this option to configure the default base URL for the generated client. By default, we will attempt to resolve the first defined server or infer the base URL from the input path. If you'd like to preserve the previous behavior, set `baseUrl` to `false`.

  ```js
  export default {
    input: "path/to/openapi.json",
    output: "src/client",
    plugins: [
      {
        baseUrl: false, // [!code ++]
        name: "@hey-api/client-fetch",
      },
    ],
  };
  ```

- [#1661](https://github.com/hey-api/hey-api/pull/1661) [`bb6d46a`](https://github.com/hey-api/hey-api/commit/bb6d46ae119ce4e7e3a2ab3fded74ac4fb4cdff2) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: make createConfig, CreateClientConfig, and Config accept ClientOptions generic

  ### Added `ClientOptions` interface

  The `Config` interface now accepts an optional generic extending `ClientOptions` instead of `boolean` type `ThrowOnError`.

  ```ts
  type Foo = Config<false>; // [!code --]
  type Foo = Config<{ throwOnError: false }>; // [!code ++]
  ```

## 0.63.2

### Patch Changes

- [#1651](https://github.com/hey-api/hey-api/pull/1651) [`df350f3`](https://github.com/hey-api/hey-api/commit/df350f31dae957d063010ba46c5008ae831b3a32) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: lower Node version requirements

## 0.63.1

### Patch Changes

- [#1637](https://github.com/hey-api/hey-api/pull/1637) [`2dc380e`](https://github.com/hey-api/hey-api/commit/2dc380eabc17c723654beb04ecd7bce6d33d3b49) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: update keywords in package.json

- [#1637](https://github.com/hey-api/hey-api/pull/1637) [`2dc380e`](https://github.com/hey-api/hey-api/commit/2dc380eabc17c723654beb04ecd7bce6d33d3b49) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add Next.js client

- [#1646](https://github.com/hey-api/hey-api/pull/1646) [`2cbffeb`](https://github.com/hey-api/hey-api/commit/2cbffeb2cdd6c6143cd68cac68369584879dda31) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: support required client in SDK using sdk.client = false

- [#1648](https://github.com/hey-api/hey-api/pull/1648) [`66a9e45`](https://github.com/hey-api/hey-api/commit/66a9e4517d2306da8c60750dc3380e6774a7177b) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add support for openIdConnect auth flow

## 0.63.0

### Minor Changes

- [#1626](https://github.com/hey-api/hey-api/pull/1626) [`8eba19d`](https://github.com/hey-api/hey-api/commit/8eba19d4092fc0903572ab9fdadf0b4c26928ba2) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: move clients to plugins

  ### Client plugins

  Clients are now plugins generating their own `client.gen.ts` file. There's no migration needed if you're using CLI. If you're using the configuration file, move `client` options to `plugins`.

  ```js
  export default {
    client: "@hey-api/client-fetch", // [!code --]
    input: "path/to/openapi.json",
    output: "src/client",
    plugins: ["@hey-api/client-fetch"], // [!code ++]
  };
  ```

### Patch Changes

- [#1626](https://github.com/hey-api/hey-api/pull/1626) [`8eba19d`](https://github.com/hey-api/hey-api/commit/8eba19d4092fc0903572ab9fdadf0b4c26928ba2) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: move sdk.throwOnError option to client.throwOnError

  ### Moved `sdk.throwOnError` option

  This SDK configuration option has been moved to the client plugins where applicable. Not every client can be configured to throw on error, so it didn't make sense to expose the option when it didn't have any effect.

  ```js
  export default {
    input: "path/to/openapi.json",
    output: "src/client",
    plugins: [
      {
        name: "@hey-api/client-fetch",
        throwOnError: true, // [!code ++]
      },
      {
        name: "@hey-api/sdk",
        throwOnError: true, // [!code --]
      },
    ],
  };
  ```

- [#1626](https://github.com/hey-api/hey-api/pull/1626) [`8eba19d`](https://github.com/hey-api/hey-api/commit/8eba19d4092fc0903572ab9fdadf0b4c26928ba2) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: sdks import client from client.gen.ts instead of defining it inside the file

  ### Added `client.gen.ts` file

  The internal `client` instance previously located in `sdk.gen.ts` is now defined in `client.gen.ts`. If you're importing it in your code, update the import module.

  ```js
  import { client } from "client/sdk.gen"; // [!code --]
  import { client } from "client/client.gen"; // [!code ++]
  ```

- [#1626](https://github.com/hey-api/hey-api/pull/1626) [`8eba19d`](https://github.com/hey-api/hey-api/commit/8eba19d4092fc0903572ab9fdadf0b4c26928ba2) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: throw if inferred plugin not found

## 0.62.3

### Patch Changes

- [#1600](https://github.com/hey-api/hey-api/pull/1600) [`0432418`](https://github.com/hey-api/hey-api/commit/0432418d72c94ef94865f8216ed2f723ad5191f9) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: bundle clients from compiled index file

- [#1594](https://github.com/hey-api/hey-api/pull/1594) [`bc66cde`](https://github.com/hey-api/hey-api/commit/bc66cde1ebe0e2df08c8d04b3ddc9504e4952cf3) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: generate correct response for text/plain content type

- [#1596](https://github.com/hey-api/hey-api/pull/1596) [`4784727`](https://github.com/hey-api/hey-api/commit/47847276e8bc854045044dd414382080270dd779) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: do not use a body serializer on text/plain sdks

- [#1602](https://github.com/hey-api/hey-api/pull/1602) [`194f941`](https://github.com/hey-api/hey-api/commit/194f94110545f2cae07bde13b863cd0cb5284d8a) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: support all oauth2 flows in sdk auth

- [#1596](https://github.com/hey-api/hey-api/pull/1596) [`4784727`](https://github.com/hey-api/hey-api/commit/47847276e8bc854045044dd414382080270dd779) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add null to valid bodySerializer types

## 0.62.2

### Patch Changes

- [#1519](https://github.com/hey-api/hey-api/pull/1519) [`14d3c4c`](https://github.com/hey-api/hey-api/commit/14d3c4ce0393d543e2d3aaebbfcf8f0cf32483b0) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add support for Nuxt client

## 0.62.1

### Patch Changes

- [#1574](https://github.com/hey-api/hey-api/pull/1574) [`51bf7fc`](https://github.com/hey-api/hey-api/commit/51bf7fc88cb6e9ab392106b85f900a75540e524f) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: generate bigint type instead of BigInt

- [#1572](https://github.com/hey-api/hey-api/pull/1572) [`0e4882a`](https://github.com/hey-api/hey-api/commit/0e4882ae3b0dc048a2d9a2a0b5c39fbdeed6de8d) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add ability to skip generating index file with output.indexFile

## 0.62.0

### Minor Changes

- [#1568](https://github.com/hey-api/hey-api/pull/1568) [`465410c`](https://github.com/hey-api/hey-api/commit/465410c201eb19e737e3143ad53a146e95f80107) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: change the default parser

### Patch Changes

- [#1566](https://github.com/hey-api/hey-api/pull/1566) [`39d558a`](https://github.com/hey-api/hey-api/commit/39d558afc6af97fe8de1a6471b9d1f172ec2960a) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: spread sdk options at the end to allow overriding generated values

## 0.61.3

### Patch Changes

- [#1552](https://github.com/hey-api/hey-api/pull/1552) [`ceb8bd7`](https://github.com/hey-api/hey-api/commit/ceb8bd74207566871e9f179cb28b2d8c440ef2c8) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: use z.coerce before calling z.bigint

## 0.61.2

### Patch Changes

- [#1543](https://github.com/hey-api/hey-api/pull/1543) [`7a2d6dc`](https://github.com/hey-api/hey-api/commit/7a2d6dcd6e30411178ac5c78db3f1dbbcc8d6b27) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: send GET request only on first spec fetch

## 0.61.1

### Patch Changes

- [#1530](https://github.com/hey-api/hey-api/pull/1530) [`67b7295`](https://github.com/hey-api/hey-api/commit/67b72959be499ff59f5f68bfdaa7e5568f5de02f) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: detect pagination in composite schemas with null type

- [#1535](https://github.com/hey-api/hey-api/pull/1535) [`d4cfa05`](https://github.com/hey-api/hey-api/commit/d4cfa05ed425d57f79b28efe76e6a33f1e892ec5) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle primitive constants in Zod and types

## 0.61.0

### Minor Changes

- [#1520](https://github.com/hey-api/hey-api/pull/1520) [`b3c23ba`](https://github.com/hey-api/hey-api/commit/b3c23ba99c361bdca3ab9c44017b6e5c044f40a7) Thanks [@chriswiggins](https://github.com/chriswiggins)! - Add support for HTTP Bearer Authentication Scheme

- [#1525](https://github.com/hey-api/hey-api/pull/1525) [`7b7313e`](https://github.com/hey-api/hey-api/commit/7b7313eeaf9a749fb81465546bc4e4bdce31d5ab) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: add OpenAPI 2.0 support to experimental parser

- [#1511](https://github.com/hey-api/hey-api/pull/1511) [`4e8064d`](https://github.com/hey-api/hey-api/commit/4e8064d9a589e14b42d2b1a329e2436f242884da) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: add watch mode

  ## Watch Mode

  ::: warning
  Watch mode currently supports only remote files via URL.
  :::

  If your schema changes frequently, you may want to automatically regenerate the output during development. To watch your input file for changes, enable `watch` mode in your configuration or pass the `--watch` flag to the CLI.

  ### Config

  ```js
  export default {
    client: "@hey-api/client-fetch",
    input: "path/to/openapi.json",
    output: "src/client",
    watch: true,
  };
  ```

  ### CLI

  ```sh
  npx @hey-api/openapi-ts \
    -c @hey-api/client-fetch \
    -i path/to/openapi.json \
    -o src/client \
    -w
  ```

- **BREAKING**: please update `@hey-api/client-*` packages to the latest version

  feat: add support for basic http auth

### Patch Changes

- [#1529](https://github.com/hey-api/hey-api/pull/1529) [`ccc0bbc`](https://github.com/hey-api/hey-api/commit/ccc0bbcbdeace22bbd8e92caadebdca81e61e393) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add support for long integers

- [#1512](https://github.com/hey-api/hey-api/pull/1512) [`dd0e0a2`](https://github.com/hey-api/hey-api/commit/dd0e0a266153e34448fbc3db6b0f864f75483280) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add `sdk.throwOnError` option

- [#1525](https://github.com/hey-api/hey-api/pull/1525) [`7b7313e`](https://github.com/hey-api/hey-api/commit/7b7313eeaf9a749fb81465546bc4e4bdce31d5ab) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: preserve leading separators in enum keys

## 0.60.1

### Patch Changes

- [#1468](https://github.com/hey-api/hey-api/pull/1468) [`20d7497`](https://github.com/hey-api/hey-api/commit/20d7497acb6c046f6a4206c2d8137414e17b2263) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle indexed access checks

- [#1469](https://github.com/hey-api/hey-api/pull/1469) [`a7608c2`](https://github.com/hey-api/hey-api/commit/a7608c27ced3419dee228f4b0cd96479b3dc2c04) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: zod: generate patterns and improve plain schemas

- [#1471](https://github.com/hey-api/hey-api/pull/1471) [`f86d293`](https://github.com/hey-api/hey-api/commit/f86d293f18f133ef6dd2f4864d037611b81edd26) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add links to the experimental parser callouts

- [#1462](https://github.com/hey-api/hey-api/pull/1462) [`893d6ef`](https://github.com/hey-api/hey-api/commit/893d6ef5677d17b96174f505937f6da686abb2bc) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: update types for custom plugins so defineConfig does not throw

- [#1464](https://github.com/hey-api/hey-api/pull/1464) [`787d59c`](https://github.com/hey-api/hey-api/commit/787d59c307549f5faf9f83314a8e9692bb01eb5d) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: export IR types

- [#1467](https://github.com/hey-api/hey-api/pull/1467) [`3a3f8d7`](https://github.com/hey-api/hey-api/commit/3a3f8d7ea4c993d4372e4bc52f6d9525bf1e45b6) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: export utils

- [#1457](https://github.com/hey-api/hey-api/pull/1457) [`bc03c37`](https://github.com/hey-api/hey-api/commit/bc03c373f4df61d8d715dc13badba2a6c5a3a450) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: allow plugins to explicitly declare whether they should be re-exported from the index file

## 0.60.0

### Minor Changes

- [#1430](https://github.com/hey-api/hey-api/pull/1430) [`9cec9e8`](https://github.com/hey-api/hey-api/commit/9cec9e8582c12a8c041b922d9587e16f6f19782a) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: require sdk.transformer to use generated transformers

  ### Added `sdk.transformer` option

  When generating SDKs, you now have to specify `transformer` in order to modify response data. By default, adding `@hey-api/transformers` to your plugins will only produce additional output. To preserve the previous functionality, set `sdk.transformer` to `true`.

  ```js
  import { defaultPlugins } from "@hey-api/openapi-ts";

  export default {
    client: "@hey-api/client-fetch",
    input: "path/to/openapi.json",
    output: "src/client",
    plugins: [
      ...defaultPlugins,
      {
        dates: true,
        name: "@hey-api/transformers",
      },
      {
        name: "@hey-api/sdk",
        transformer: true, // [!code ++]
      },
    ],
  };
  ```

- [#1447](https://github.com/hey-api/hey-api/pull/1447) [`200821b`](https://github.com/hey-api/hey-api/commit/200821b3ceea8ffca7656fe3f6e2ef98b7110a2a) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: revert license to MIT

### Patch Changes

- [#1430](https://github.com/hey-api/hey-api/pull/1430) [`9cec9e8`](https://github.com/hey-api/hey-api/commit/9cec9e8582c12a8c041b922d9587e16f6f19782a) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: Zod plugin generates response schemas

## 0.59.2

### Patch Changes

- [#1420](https://github.com/hey-api/hey-api/pull/1420) [`8010dbb`](https://github.com/hey-api/hey-api/commit/8010dbb1ab8b91d1d49d5cf16276183764a63ff3) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: generate querySerializer options for Axios client

- [#1419](https://github.com/hey-api/hey-api/pull/1419) [`4555796`](https://github.com/hey-api/hey-api/commit/4555796df3a33fb3fdf7d7417f7d1f3b22d89bcf) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: infer responseType in SDKs for axios client

- [#1409](https://github.com/hey-api/hey-api/pull/1409) [`646064d`](https://github.com/hey-api/hey-api/commit/646064d1aecea988d2b4df73bd24b2ee83394ae0) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: support oauth2 and apiKey security schemes

- [#1416](https://github.com/hey-api/hey-api/pull/1416) [`2a605b7`](https://github.com/hey-api/hey-api/commit/2a605b7e43655b3100e302e10b9979fbbad6cdfe) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: zod plugin handles recursive schemas

## 0.59.1

### Patch Changes

- [#1398](https://github.com/hey-api/hey-api/pull/1398) [`a88e7d9`](https://github.com/hey-api/hey-api/commit/a88e7d9f8a313c641cf651256a710d0610b95b5d) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: prefix restricted identifier names with underscore

- [#1394](https://github.com/hey-api/hey-api/pull/1394) [`ec48d32`](https://github.com/hey-api/hey-api/commit/ec48d323d80de8e6a47ce7ecd732288f0a47e17a) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: disallow additional query parameters in experimental parser output

## 0.59.0

### Minor Changes

- [#1387](https://github.com/hey-api/hey-api/pull/1387) [`7c4335d`](https://github.com/hey-api/hey-api/commit/7c4335d12782c73b5b242e7d5786ec8778857d1d) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: add `logs.level` option

  ### Added `logs.level` option

  You can now configure different log levels. As part of this feature, we had to introduce a breaking change by moving the `debug` option to `logs.level`. This will affect you if you're calling `@hey-api/openapi-ts` from Node.js (not CLI) or using the configuration file.

  ```js
  export default {
    client: "@hey-api/client-fetch",
    debug: true, // [!code --]
    input: "path/to/openapi.json",
    logs: {
      level: "debug", // [!code ++]
    },
    output: "src/client",
  };
  ```

- [#1389](https://github.com/hey-api/hey-api/pull/1389) [`f4c98ec`](https://github.com/hey-api/hey-api/commit/f4c98ec429ee989ae1c76328f4d42d44f14cb52e) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: remove `@hey-api/schemas` from default plugins

  ### Updated default `plugins`

  `@hey-api/schemas` has been removed from the default plugins. To continue using it, add it to your plugins array.

  ```js
  import { defaultPlugins } from "@hey-api/openapi-ts";

  export default {
    client: "@hey-api/client-fetch",
    experimentalParser: true,
    input: "path/to/openapi.json",
    output: "src/client",
    plugins: [
      ...defaultPlugins,
      "@hey-api/schemas", // [!code ++]
    ],
  };
  ```

### Patch Changes

- [#1382](https://github.com/hey-api/hey-api/pull/1382) [`3580c1e`](https://github.com/hey-api/hey-api/commit/3580c1eec4640d235a1e0f78bf76581e532aaf8b) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: correctly resolve required properties in nested allOf composition

- [#1387](https://github.com/hey-api/hey-api/pull/1387) [`7c4335d`](https://github.com/hey-api/hey-api/commit/7c4335d12782c73b5b242e7d5786ec8778857d1d) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add `--silent` or `-s` CLI option for silent log level

- [#1382](https://github.com/hey-api/hey-api/pull/1382) [`3580c1e`](https://github.com/hey-api/hey-api/commit/3580c1eec4640d235a1e0f78bf76581e532aaf8b) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: transformers handle allOf composition in experimental parser

- [#1387](https://github.com/hey-api/hey-api/pull/1387) [`0def82c`](https://github.com/hey-api/hey-api/commit/0def82c91d1be936702690b8cf5a21775974d946) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: add `logs` configuration option to customize log directory

- [#1390](https://github.com/hey-api/hey-api/pull/1390) [`8388c47`](https://github.com/hey-api/hey-api/commit/8388c4720dbb657899d5e30bd8d59c19583cad98) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: allow arbitrary object properties when additionalProperties is undefined

- [#1387](https://github.com/hey-api/hey-api/pull/1387) [`7c4335d`](https://github.com/hey-api/hey-api/commit/7c4335d12782c73b5b242e7d5786ec8778857d1d) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: support `DEBUG` environment variable

## 0.58.0

### Minor Changes

- [#1353](https://github.com/hey-api/hey-api/pull/1353) [`efd3e54`](https://github.com/hey-api/hey-api/commit/efd3e5444d208ea0c8dda7573f26bb04c31cc372) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: add typescript.identifierCase option

  ### Added `typescript.identifierCase` option

  **This change affects only the experimental parser.** By default, the generated TypeScript interfaces will follow the PascalCase naming convention. In the previous versions, we tried to preserve the original name as much as possible. To keep the previous behavior, set `typescript.identifierCase` to `preserve`.

  ```js
  export default {
    client: "@hey-api/client-fetch",
    experimentalParser: true,
    input: "path/to/openapi.json",
    output: "src/client",
    plugins: [
      // ...other plugins
      {
        identifierCase: "preserve", // [!code ++]
        name: "@hey-api/typescript",
      },
    ],
  };
  ```

- [#1360](https://github.com/hey-api/hey-api/pull/1360) [`5f6ddd7`](https://github.com/hey-api/hey-api/commit/5f6ddd796f0ce77bcca55fd13981f2a8481aecd3) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: remove schemas and transformers re-exports from index.ts

  ### Removed `schemas.gen.ts` re-export

  `index.ts` will no longer re-export `schemas.gen.ts` to reduce the chance of producing broken output. Please update your code to import from `schemas.gen.ts` directly.

  ```js
  import { mySchema } from "client"; // [!code --]
  import { mySchema } from "client/schemas.gen"; // [!code ++]
  ```

  ### Removed `transformers.gen.ts` re-export

  `index.ts` will no longer re-export `transformers.gen.ts` to reduce the chance of producing broken output. Please update your code to import from `transformers.gen.ts` directly.

  ```js
  import { myTransformer } from "client"; // [!code --]
  import { myTransformer } from "client/transformers.gen"; // [!code ++]
  ```

- [#1360](https://github.com/hey-api/hey-api/pull/1360) [`5f6ddd7`](https://github.com/hey-api/hey-api/commit/5f6ddd796f0ce77bcca55fd13981f2a8481aecd3) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: add output.clean option

  ### Added `output.clean` option

  By default, the `output.path` folder will be emptied on every run. To preserve the previous behavior, set `output.clean` to `false`.

  ```js
  export default {
    client: "@hey-api/client-fetch",
    input: "path/to/openapi.json",
    output: {
      clean: false, // [!code ++]
      path: "src/client",
    },
  };
  ```

- [#1362](https://github.com/hey-api/hey-api/pull/1362) [`3bf7169`](https://github.com/hey-api/hey-api/commit/3bf7169b620946d99c17cf5398d7a818d0099f94) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: add typescript.enumsCase option

### Patch Changes

- [#1361](https://github.com/hey-api/hey-api/pull/1361) [`a23c25e`](https://github.com/hey-api/hey-api/commit/a23c25ea1b5ca8bf421302bf93690168df3473cb) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add before and after to pagination keywords

- [#1368](https://github.com/hey-api/hey-api/pull/1368) [`cca2290`](https://github.com/hey-api/hey-api/commit/cca2290aeaab0b9807c928d73dbfc1e4bacadc4d) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: export Plugin API namespace

- [#1369](https://github.com/hey-api/hey-api/pull/1369) [`11163f0`](https://github.com/hey-api/hey-api/commit/11163f0d6885633078126849c04c0646e7d19255) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: TanStack Query plugin handles conflict with internal function name in experimental parser

## 0.57.1

### Patch Changes

- [#1335](https://github.com/hey-api/hey-api/pull/1335) [`bb9a848`](https://github.com/hey-api/hey-api/commit/bb9a84869dc911861f3b12f725a470b8fd6b67fe) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: transformers correctly handle an array

- [#1332](https://github.com/hey-api/hey-api/pull/1332) [`25b598b`](https://github.com/hey-api/hey-api/commit/25b598bcecd1dd3eb3da6b7c7f24f4adb0170114) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: improve camelcase with abbreviated plurals

- [#1333](https://github.com/hey-api/hey-api/pull/1333) [`734a62d`](https://github.com/hey-api/hey-api/commit/734a62dd8d594b8266964fe16766a481d37eb7df) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: experimental parser generates url inside data types

- [#1336](https://github.com/hey-api/hey-api/pull/1336) [`6857da8`](https://github.com/hey-api/hey-api/commit/6857da8a7f23829a89115b2237aaac9a71a38dfb) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: experimental parser transforms anyOf date and null

- [#1330](https://github.com/hey-api/hey-api/pull/1330) [`3d68587`](https://github.com/hey-api/hey-api/commit/3d6858748c94d6e33fd4dae7ddbf6cb70d21aaee) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: experimental parser handles empty string and null enum values in JavaScript mode

- [#1340](https://github.com/hey-api/hey-api/pull/1340) [`c8511e0`](https://github.com/hey-api/hey-api/commit/c8511e0d84dd408407bf764fb0bae4938b70dacb) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: experimental parser exports reusable request bodies

## 0.57.0

### Minor Changes

- [#1324](https://github.com/hey-api/hey-api/pull/1324) [`4e62378`](https://github.com/hey-api/hey-api/commit/4e62378352d8306580293ee4aeef43756d245f85) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: rename Hey API plugins

  ### Renamed `@hey-api/services` plugin

  This plugin has been renamed to `@hey-api/sdk`.

  ### Changed `sdk.output` value

  To align with the updated name, the `@hey-api/sdk` plugin will generate an `sdk.gen.ts` file. This will result in a breaking change if you're importing from `services.gen.ts`. Please update your imports to reflect this change.

  ```js
  import { client } from "client/services.gen"; // [!code --]
  import { client } from "client/sdk.gen"; // [!code ++]
  ```

  ### Renamed `@hey-api/types` plugin

  This plugin has been renamed to `@hey-api/typescript`.

- [#1327](https://github.com/hey-api/hey-api/pull/1327) [`62e37d5`](https://github.com/hey-api/hey-api/commit/62e37d51e9d829e11d08a494060c1e808ce2e3f3) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: add typescript.exportInlineEnums option

  ### Added `typescript.exportInlineEnums` option

  By default, inline enums (enums not defined as reusable components in the input file) will be generated only as inlined union types. You can set `exportInlineEnums` to `true` to treat inline enums as reusable components. When `true`, the exported enums will follow the style defined in `enums`.

  This is a breaking change since in the previous versions, inline enums were always treated as reusable components. To preserve your current output, set `exportInlineEnums` to `true`. This feature works only with the experimental parser.

  ```js
  export default {
    client: "@hey-api/client-fetch",
    experimentalParser: true,
    input: "path/to/openapi.json",
    output: "src/client",
    plugins: [
      // ...other plugins
      {
        exportInlineEnums: true, // [!code ++]
        name: "@hey-api/typescript",
      },
    ],
  };
  ```

### Patch Changes

- [#1326](https://github.com/hey-api/hey-api/pull/1326) [`01c3d69`](https://github.com/hey-api/hey-api/commit/01c3d69e4c97262cd6dda5061f0a76f3b4fda31a) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: improve generated enum keys in experimental parser

## 0.56.3

### Patch Changes

- [#1319](https://github.com/hey-api/hey-api/pull/1319) [`af76a77`](https://github.com/hey-api/hey-api/commit/af76a7705c585fcfae0c72872f358936f7d19d56) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: Zod plugin handles value constraints and defaults

## 0.56.2

### Patch Changes

- [#1316](https://github.com/hey-api/hey-api/pull/1316) [`a79fac8`](https://github.com/hey-api/hey-api/commit/a79fac8919ed29eec7195cbd441ffa38b559d63c) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add input.exclude option

- [#1316](https://github.com/hey-api/hey-api/pull/1316) [`a79fac8`](https://github.com/hey-api/hey-api/commit/a79fac8919ed29eec7195cbd441ffa38b559d63c) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: make Zod plugin available in plugins options

## 0.56.1

### Patch Changes

- [#1309](https://github.com/hey-api/hey-api/pull/1309) [`785480b`](https://github.com/hey-api/hey-api/commit/785480b2d5f96a681dfc1f7f0fb626f744bb221f) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: gracefully handle invalid schema type in experimental parser

## 0.56.0

### Minor Changes

- [#1286](https://github.com/hey-api/hey-api/pull/1286) [`5514de4`](https://github.com/hey-api/hey-api/commit/5514de46a8c913ddc40f07d0142c80266e9837cd) Thanks [@jacobinu](https://github.com/jacobinu)! - feat: add `fastify` plugin

### Patch Changes

- [#1286](https://github.com/hey-api/hey-api/pull/1286) [`cebf327`](https://github.com/hey-api/hey-api/commit/cebf327046c801b375846bae6b07561b8ad1bdd6) Thanks [@jacobinu](https://github.com/jacobinu)! - fix: export a map of error and response types by status code

- [#1286](https://github.com/hey-api/hey-api/pull/1286) [`8a15a35`](https://github.com/hey-api/hey-api/commit/8a15a35e86ff22eca85dc218bc1793315b934556) Thanks [@jacobinu](https://github.com/jacobinu)! - fix: deprecate types.tree option

- [#1305](https://github.com/hey-api/hey-api/pull/1305) [`a3698a7`](https://github.com/hey-api/hey-api/commit/a3698a7f1680d7dfb913c6253f8685ebbdd132ca) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle file-like content media type without explicit schema

## 0.55.3

### Patch Changes

- [#1283](https://github.com/hey-api/hey-api/pull/1283) [`781d1a4`](https://github.com/hey-api/hey-api/commit/781d1a40d10ce380f1ca2cb2bc7aca7d3b169bc6) Thanks [@hougesen](https://github.com/hougesen)! - feat: add support for oxlint as linter

## 0.55.2

### Patch Changes

- [#1253](https://github.com/hey-api/hey-api/pull/1253) [`01dee3d`](https://github.com/hey-api/hey-api/commit/01dee3df879232939e43355231147b3d910fb482) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: update sponsorship links

- [#1266](https://github.com/hey-api/hey-api/pull/1266) [`d60d260`](https://github.com/hey-api/hey-api/commit/d60d260342ff3013c2e228151e9b897224eb89cc) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: correctly generate array when items are a oneOf array with length 1

- [#1265](https://github.com/hey-api/hey-api/pull/1265) [`691cdc2`](https://github.com/hey-api/hey-api/commit/691cdc28b6ad5bc1a38e1ae9eb134a2b41d4ead8) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle non-exploded array query parameters

- [#1267](https://github.com/hey-api/hey-api/pull/1267) [`ff3aa4a`](https://github.com/hey-api/hey-api/commit/ff3aa4ac58068671d2b9eedbd7528eb4f9969386) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle discriminators in experimental parser

## 0.55.1

### Patch Changes

- [#1248](https://github.com/hey-api/hey-api/pull/1248) [`61cd848`](https://github.com/hey-api/hey-api/commit/61cd848262b20580fb185d023c28aa54754bf19c) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle nullable enums in experimental parser

- [#1251](https://github.com/hey-api/hey-api/pull/1251) [`07800d4`](https://github.com/hey-api/hey-api/commit/07800d4fbb849614ed2c23b8acc9c82f1ef74598) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add support for custom plugins

- [#1250](https://github.com/hey-api/hey-api/pull/1250) [`9e07675`](https://github.com/hey-api/hey-api/commit/9e07675802c75b8f5105dd104bb7736aeb83ece6) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: render void for empty response status codes in experimental parser

## 0.55.0

### Minor Changes

- [#1241](https://github.com/hey-api/hey-api/pull/1241) [`41cee41`](https://github.com/hey-api/hey-api/commit/41cee417055c50de6170e6fdeae65bd6e643d19c) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: add input.include option

### Patch Changes

- [#1239](https://github.com/hey-api/hey-api/pull/1239) [`319a28a`](https://github.com/hey-api/hey-api/commit/319a28af29541d7f61cca82389e1d486204f321f) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle pagination with basic refs

## 0.54.4

### Patch Changes

- [#1237](https://github.com/hey-api/hey-api/pull/1237) [`63ccc07`](https://github.com/hey-api/hey-api/commit/63ccc0775e24a096bc46ac7ff29b99b694aad621) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: forbid any body, path, or query parameters if not defined in spec

- [#1235](https://github.com/hey-api/hey-api/pull/1235) [`7a1a419`](https://github.com/hey-api/hey-api/commit/7a1a419f07d5ad39e07265771b30d49a4b754a88) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle additionalProperties: boolean in experimental parser

- [#1233](https://github.com/hey-api/hey-api/pull/1233) [`08baa77`](https://github.com/hey-api/hey-api/commit/08baa77afdc5e2c49d4789b20673e949951ab0b2) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: update schemas plugin to handle experimental 3.0.x parser

  This release adds an experimental parser for OpenAPI versions 3.0.x. In the future, this will become the default parser. If you're using OpenAPI 3.0 or newer, we encourage you to try it out today.

  You can enable the experimental parser by setting the `experimentalParser` boolean flag to `true` in your configuration file or CLI.

  ```js
  export default {
    client: "@hey-api/client-fetch",
    input: "path/to/openapi.json",
    output: "src/client",
    experimentalParser: true,
  };
  ```

  ```sh
  npx @hey-api/openapi-ts -i path/to/openapi.json -o src/client -c @hey-api/client-fetch -e
  ```

  The generated output should not structurally change, despite few things being generated in a different order. In fact, the output should be cleaner! That's the immediate side effect you should notice. If that's not true, please leave feedback in [GitHub issues](https://github.com/hey-api/hey-api/issues).

  Hey API parser marks an important milestone towards v1 of `@hey-api/openapi-ts`. More features will be added to the parser in the future and the original parser from `openapi-typescript-codegen` will be deprecated and used only for generating legacy clients.

  If you'd like to work with the parser more closely (e.g. to generate code not natively supported by this package), feel free to reach out with any feedback or suggestions. Happy parsing! 🎉

## 0.54.3

### Patch Changes

- [#1230](https://github.com/hey-api/hey-api/pull/1230) [`3e65ae0`](https://github.com/hey-api/hey-api/commit/3e65ae06bcd2823482cf012909388c7630e18229) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: add OpenAPI 3.0.x experimental parser

  This release adds an experimental parser for OpenAPI versions 3.0.x. In the future, this will become the default parser. If you're using OpenAPI 3.0 or newer, we encourage you to try it out today.

  You can enable the experimental parser by setting the `experimentalParser` boolean flag to `true` in your configuration file or CLI.

  ```js
  export default {
    client: "@hey-api/client-fetch",
    input: "path/to/openapi.json",
    output: "src/client",
    experimentalParser: true,
  };
  ```

  ```sh
  npx @hey-api/openapi-ts -i path/to/openapi.json -o src/client -c @hey-api/client-fetch -e
  ```

  The generated output should not structurally change, despite few things being generated in a different order. In fact, the output should be cleaner! That's the immediate side effect you should notice. If that's not true, please leave feedback in [GitHub issues](https://github.com/hey-api/hey-api/issues).

  Hey API parser marks an important milestone towards v1 of `@hey-api/openapi-ts`. More features will be added to the parser in the future and the original parser from `openapi-typescript-codegen` will be deprecated and used only for generating legacy clients.

  If you'd like to work with the parser more closely (e.g. to generate code not natively supported by this package), feel free to reach out with any feedback or suggestions. Happy parsing! 🎉

## 0.54.2

### Patch Changes

- [#1222](https://github.com/hey-api/hey-api/pull/1222) [`ceb4363`](https://github.com/hey-api/hey-api/commit/ceb4363d52893ebe947e21aac402b868ff2820d4) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: add support for @tanstack/angular-query-experimental package

## 0.54.1

### Patch Changes

- [#1211](https://github.com/hey-api/hey-api/pull/1211) [`c8a3e3d`](https://github.com/hey-api/hey-api/commit/c8a3e3d7e59692698b7cf45182ca92494fc4af96) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: ignore name option when not used with legacy clients to avoid producing broken output

- [#1209](https://github.com/hey-api/hey-api/pull/1209) [`3a80b9f`](https://github.com/hey-api/hey-api/commit/3a80b9fd009c8229d69f3f349acbfb19b7549a94) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add support for OpenAPI 3.1.1 to experimental parser

## 0.54.0

### Minor Changes

- [#1201](https://github.com/hey-api/hey-api/pull/1201) [`972a93a`](https://github.com/hey-api/hey-api/commit/972a93a91a945cc9ead73c08bb0fa9ee120433ba) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: make plugins first-class citizens

  This release makes plugins first-class citizens. In order to achieve that, the following breaking changes were introduced.

  ### Removed CLI options

  The `--types`, `--schemas`, and `--services` CLI options have been removed. You can list which plugins you'd like to use explicitly by passing a list of plugins as `--plugins <plugin1> <plugin2>`

  ### Removed `*.export` option

  Previously, you could explicitly disable export of certain artifacts using the `*.export` option or its shorthand variant. These were both removed. You can now disable export of specific artifacts by manually defining an array of `plugins` and excluding the unwanted plugin.

  ::: code-group

  ```js [shorthand]
  export default {
    client: "@hey-api/client-fetch",
    input: "path/to/openapi.json",
    output: "src/client",
    schemas: false, // [!code --]
    plugins: ["@hey-api/types", "@hey-api/services"], // [!code ++]
  };
  ```

  ```js [*.export]
  export default {
    client: "@hey-api/client-fetch",
    input: "path/to/openapi.json",
    output: "src/client",
    schemas: {
      export: false, // [!code --]
    },
    plugins: ["@hey-api/types", "@hey-api/services"], // [!code ++]
  };
  ```

  :::

  ### Renamed `schemas.name` option

  Each plugin definition contains a `name` field. This was conflicting with the `schemas.name` option. As a result, it has been renamed to `nameBuilder`.

  ```js
  export default {
    client: "@hey-api/client-fetch",
    input: "path/to/openapi.json",
    output: "src/client",
    schemas: {
      name: (name) => `${name}Schema`, // [!code --]
    },
    plugins: [
      // ...other plugins
      {
        nameBuilder: (name) => `${name}Schema`, // [!code ++]
        name: "@hey-api/schemas",
      },
    ],
  };
  ```

  ### Removed `services.include` shorthand option

  Previously, you could use a string value as a shorthand for the `services.include` configuration option. You can now achieve the same result using the `include` option.

  ```js
  export default {
    client: "@hey-api/client-fetch",
    input: "path/to/openapi.json",
    output: "src/client",
    services: "^MySchema", // [!code --]
    plugins: [
      // ...other plugins
      {
        include: "^MySchema", // [!code ++]
        name: "@hey-api/services",
      },
    ],
  };
  ```

  ### Renamed `services.name` option

  Each plugin definition contains a `name` field. This was conflicting with the `services.name` option. As a result, it has been renamed to `serviceNameBuilder`.

  ```js
  export default {
    client: "@hey-api/client-fetch",
    input: "path/to/openapi.json",
    output: "src/client",
    services: {
      name: "{{name}}Service", // [!code --]
    },
    plugins: [
      // ...other plugins
      {
        serviceNameBuilder: "{{name}}Service", // [!code ++]
        name: "@hey-api/services",
      },
    ],
  };
  ```

  ### Renamed `types.dates` option

  Previously, you could set `types.dates` to a boolean or a string value, depending on whether you wanted to transform only type strings into dates, or runtime code too. Many people found these options confusing, so they have been simplified to a boolean and extracted into a separate `@hey-api/transformers` plugin.

  ```js
  export default {
    client: "@hey-api/client-fetch",
    input: "path/to/openapi.json",
    output: "src/client",
    types: {
      dates: "types+transform", // [!code --]
    },
    plugins: [
      // ...other plugins
      {
        dates: true, // [!code ++]
        name: "@hey-api/transformers",
      },
    ],
  };
  ```

  ### Removed `types.include` shorthand option

  Previously, you could use a string value as a shorthand for the `types.include` configuration option. You can now achieve the same result using the `include` option.

  ```js
  export default {
    client: "@hey-api/client-fetch",
    input: "path/to/openapi.json",
    output: "src/client",
    types: "^MySchema", // [!code --]
    plugins: [
      // ...other plugins
      {
        include: "^MySchema", // [!code ++]
        name: "@hey-api/types",
      },
    ],
  };
  ```

  ### Renamed `types.name` option

  Each plugin definition contains a `name` field. This was conflicting with the `types.name` option. As a result, it has been renamed to `style`.

  ```js
  export default {
    client: "@hey-api/client-fetch",
    input: "path/to/openapi.json",
    output: "src/client",
    types: {
      name: "PascalCase", // [!code --]
    },
    plugins: [
      // ...other plugins
      {
        name: "@hey-api/types",
        style: "PascalCase", // [!code ++]
      },
    ],
  };
  ```

## 0.53.12

### Patch Changes

- [#1195](https://github.com/hey-api/hey-api/pull/1195) [`753643f`](https://github.com/hey-api/hey-api/commit/753643fae74d4248df8dc5fe9dda5f28a1dabdf1) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: TanStack Query plugin using missing import for infinite query

- [#1194](https://github.com/hey-api/hey-api/pull/1194) [`c38deaf`](https://github.com/hey-api/hey-api/commit/c38deaf02b606b92edd9c316b1444b6b6c12916d) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: pass TanStack query signal to client call

## 0.53.11

### Patch Changes

- [#1151](https://github.com/hey-api/hey-api/pull/1151) [`587791d`](https://github.com/hey-api/hey-api/commit/587791dfede0167fbed229281467e4c4875936f5) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: update website domain, add license documentation

## 0.53.10

### Patch Changes

- [#1145](https://github.com/hey-api/hey-api/pull/1145) [`a0a5551`](https://github.com/hey-api/hey-api/commit/a0a55510d30a1a8dea0ade4908b5b13d51b5f9e6) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: update license field in package.json to match the license, revert client packages license to MIT

## 0.53.9

### Patch Changes

- [#1137](https://github.com/hey-api/hey-api/pull/1137) [`f4566c2`](https://github.com/hey-api/hey-api/commit/f4566c2bcd67f45f069bfa6220d3c710177f28cc) Thanks [@BierDav](https://github.com/BierDav)! - Add support for passing mutation specific options to `<operation_id>Mutation(options)`

## 0.53.8

### Patch Changes

- [#1123](https://github.com/hey-api/hey-api/pull/1123) [`032338c`](https://github.com/hey-api/hey-api/commit/032338c47506ccfd567bbbf915398942c8394bc2) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: use correct relative path to bundled client when imported from nested module

## 0.53.7

### Patch Changes

- [#1113](https://github.com/hey-api/hey-api/pull/1113) [`dc696e0`](https://github.com/hey-api/hey-api/commit/dc696e0b4500dba5ceb4c772110b123bd2f71b40) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: skip nested properties in oneOf and anyOf compositions

- [#1115](https://github.com/hey-api/hey-api/pull/1115) [`5f077dd`](https://github.com/hey-api/hey-api/commit/5f077dd8d144bbfe71d8775bad5fe7ddda2315d6) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: abstract page params logic in TanStack Query plugin

## 0.53.6

### Patch Changes

- [#1104](https://github.com/hey-api/hey-api/pull/1104) [`a1eada1`](https://github.com/hey-api/hey-api/commit/a1eada1896046f0de1710682635efc59434a1e2c) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: export spec-compliant OpenAPI 3.1 interface

- [#1108](https://github.com/hey-api/hey-api/pull/1108) [`7677924`](https://github.com/hey-api/hey-api/commit/76779246534391deca5a371df2c7dc76e9d2eb73) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle multiple form-data parameters in Swagger 2.0

## 0.53.5

### Patch Changes

- [#1096](https://github.com/hey-api/hey-api/pull/1096) [`b6e350a`](https://github.com/hey-api/hey-api/commit/b6e350a9cc2d82ac4496b7d57ec8b58978c951c2) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: make TanStack Query plugin work with class-based services

- [#1095](https://github.com/hey-api/hey-api/pull/1095) [`11ee53f`](https://github.com/hey-api/hey-api/commit/11ee53f4f519643ae7e3f0997ce4fe9b6cb050a8) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: avoid printing duplicate null nodes

- [#1094](https://github.com/hey-api/hey-api/pull/1094) [`713ccd5`](https://github.com/hey-api/hey-api/commit/713ccd5e5e250a14cacf96fd1dffad252cc4cc6a) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: attach TanStack Query infinite page params only if they exist

## 0.53.4

### Patch Changes

- [#1087](https://github.com/hey-api/hey-api/pull/1087) [`b528236`](https://github.com/hey-api/hey-api/commit/b528236b626d12d4ac03b98b8abecc425291c5e5) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: import handlebars instead of runtime

- [#1086](https://github.com/hey-api/hey-api/pull/1086) [`0bc1ebe`](https://github.com/hey-api/hey-api/commit/0bc1ebe318399d01296777746ce0bccc83c0e83d) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: support dynamic require in child_process

## 0.53.3

### Patch Changes

- [#1075](https://github.com/hey-api/hey-api/pull/1075) [`11a276a`](https://github.com/hey-api/hey-api/commit/11a276a1e35dde0735363e892d8142016fd87eec) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: properly handle dual publishing and type generation

## 0.53.2

### Patch Changes

- [#1060](https://github.com/hey-api/hey-api/pull/1060) [`8d66c08`](https://github.com/hey-api/hey-api/commit/8d66c085cf81e0e166c3e172ce319d5e2d4002bf) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle colon in operation path

- [#1065](https://github.com/hey-api/hey-api/pull/1065) [`a756987`](https://github.com/hey-api/hey-api/commit/a756987ad396fd7e68cc5eff63f6615bffef3782) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: allow overriding generated headers from options

- [#1068](https://github.com/hey-api/hey-api/pull/1068) [`a48be86`](https://github.com/hey-api/hey-api/commit/a48be8660f6d1d84fdf25a3952587fb963482e8a) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: export Operation interface

- [#1067](https://github.com/hey-api/hey-api/pull/1067) [`5a52da1`](https://github.com/hey-api/hey-api/commit/5a52da1425abef9f4fef58ef077dbd05545e25a2) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle named object property with no nested properties

- [#1066](https://github.com/hey-api/hey-api/pull/1066) [`e8a38ae`](https://github.com/hey-api/hey-api/commit/e8a38ae4e3f021a105d18764ef3252db7efa9aa0) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: transform any-of nullable dates

## 0.53.1

### Patch Changes

- [#1050](https://github.com/hey-api/hey-api/pull/1050) [`6922b5a`](https://github.com/hey-api/hey-api/commit/6922b5a3ebe67190d2034ea79674706a5e80e818) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: throw error on invalid client value

## 0.53.0

### Minor Changes

- [#1008](https://github.com/hey-api/hey-api/pull/1008) [`dc4a40d`](https://github.com/hey-api/hey-api/commit/dc4a40d517853e4cf5be532f5bf4874c84c924be) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: rename legacy clients with 'legacy/' prefix

- [#1009](https://github.com/hey-api/hey-api/pull/1009) [`c6b044d`](https://github.com/hey-api/hey-api/commit/c6b044d0bc9dc54cb0eb58d23438f4e1d050cb38) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: change schemas name pattern, add schemas.name option

### Patch Changes

- [#989](https://github.com/hey-api/hey-api/pull/989) [`bc78a42`](https://github.com/hey-api/hey-api/commit/bc78a421eafed1920102b796842e227cacda6ef0) Thanks [@jacobinu](https://github.com/jacobinu)! - fix: make UserConfig interface instead of type

- [#1010](https://github.com/hey-api/hey-api/pull/1010) [`b6e58c6`](https://github.com/hey-api/hey-api/commit/b6e58c64d1b71897533a85d1738cd7ce7ede178d) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: set query key base url from supplied client if provided

## 0.52.11

### Patch Changes

- [#981](https://github.com/hey-api/hey-api/pull/981) [`afd8c43`](https://github.com/hey-api/hey-api/commit/afd8c4386fb7b2f86a54e73c9471945bdfad22ea) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: export query key functions from TanStack Query plugin

## 0.52.10

### Patch Changes

- [#973](https://github.com/hey-api/hey-api/pull/973) [`8f7a14f`](https://github.com/hey-api/hey-api/commit/8f7a14f570e2d17053f1e612f6e045df774916f1) Thanks [@jacobinu](https://github.com/jacobinu)! - fix: handle tree-shakeable angular client case

## 0.52.9

### Patch Changes

- [#948](https://github.com/hey-api/hey-api/pull/948) [`ebfd6ee`](https://github.com/hey-api/hey-api/commit/ebfd6eec434d7b84883a8f9058f31948fb1a40f2) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle schemas with generics from C#

- [#949](https://github.com/hey-api/hey-api/pull/949) [`16f8956`](https://github.com/hey-api/hey-api/commit/16f89566a7affeb09a6b928c43cfa2733e8b9adc) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: rename infinite key in query key to \_infinite

- [#946](https://github.com/hey-api/hey-api/pull/946) [`f873fa6`](https://github.com/hey-api/hey-api/commit/f873fa67befe60b2fd8f63bc2c8b73437591f686) Thanks [@mrlubos](https://github.com/mrlubos)! - chore: warn on duplicate operation ID

- [#947](https://github.com/hey-api/hey-api/pull/947) [`7f0fefe`](https://github.com/hey-api/hey-api/commit/7f0fefec92b25ce18ed0d1c6a6edf1adbc7d4481) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: correctly use parentheses around composed schemas

- [#944](https://github.com/hey-api/hey-api/pull/944) [`2f7cc89`](https://github.com/hey-api/hey-api/commit/2f7cc8986c0644b41cc6a5526ddf52ebff880c79) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: correctly handle integer type in additional properties

## 0.52.8

### Patch Changes

- [#932](https://github.com/hey-api/hey-api/pull/932) [`cdf01e8`](https://github.com/hey-api/hey-api/commit/cdf01e8cc0dc63213465b9e8fe33b80443d36f55) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: cherry pick keys in mutation page param type

## 0.52.7

### Patch Changes

- [#929](https://github.com/hey-api/hey-api/pull/929) [`b56c81c`](https://github.com/hey-api/hey-api/commit/b56c81ca67a2d069b33430c3139e2135a299b309) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle various issues with additionalProperties definitions

- [#927](https://github.com/hey-api/hey-api/pull/927) [`65f151d`](https://github.com/hey-api/hey-api/commit/65f151dc0004ce817bc370486495bdd281439e55) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: update TanStack Query key to contain base URL

- [#927](https://github.com/hey-api/hey-api/pull/927) [`65f151d`](https://github.com/hey-api/hey-api/commit/65f151dc0004ce817bc370486495bdd281439e55) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: change TanStack Query mutation helpers to functions for consistent API

## 0.52.6

### Patch Changes

- [#920](https://github.com/hey-api/hey-api/pull/920) [`4ff2404`](https://github.com/hey-api/hey-api/commit/4ff24049457b7d0d5333c3704f488f1f45dd0c5b) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add preview version of TanStack Query plugin

## 0.52.5

### Patch Changes

- [#910](https://github.com/hey-api/hey-api/pull/910) [`428dcad`](https://github.com/hey-api/hey-api/commit/428dcad06eba3ab14876c28092a6df81fcde7dbe) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: throw if prerequisite checks are not met

- [#907](https://github.com/hey-api/hey-api/pull/907) [`a2a1ab8`](https://github.com/hey-api/hey-api/commit/a2a1ab8bd78c2cbbdcb7adb2ba3815250843dbe7) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: correctly transform string to pascalcase when referenced inside schema

- [#908](https://github.com/hey-api/hey-api/pull/908) [`225b640`](https://github.com/hey-api/hey-api/commit/225b640b5ac628cb7ba3b7afb39ff271a0608055) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: do not generate types tree by default if services are enabled as it is unused

## 0.52.4

### Patch Changes

- [#895](https://github.com/hey-api/hey-api/pull/895) [`44de8d8`](https://github.com/hey-api/hey-api/commit/44de8d89556b3abf48acc4e23c9b9c198059c757) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: define ThrowOnError generic as the last argument

## 0.52.3

### Patch Changes

- [#884](https://github.com/hey-api/hey-api/pull/884) [`62a39e6`](https://github.com/hey-api/hey-api/commit/62a39e63f645bce0801779fb6b90531401748e86) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: generate ThrowOnError generic for class-based client methods

## 0.52.2

### Patch Changes

- [#881](https://github.com/hey-api/hey-api/pull/881) [`a9ddfe6`](https://github.com/hey-api/hey-api/commit/a9ddfe6c4487fe5debd04a194ee6c6b6c611dc6b) Thanks [@hougesen](https://github.com/hougesen)! - fix: check if key is schema property before removing

## 0.52.1

### Patch Changes

- [#855](https://github.com/hey-api/hey-api/pull/855) [`7ac6274`](https://github.com/hey-api/hey-api/commit/7ac627463a15fa6be2c9d103b25200355df6b166) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: define multiple errors type as union instead of intersection

- [#853](https://github.com/hey-api/hey-api/pull/853) [`6ab387d`](https://github.com/hey-api/hey-api/commit/6ab387d3440ec5ec524e7f198aedfa6734431d76) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: remove Content-Type header with multipart/form-data content type

- [#861](https://github.com/hey-api/hey-api/pull/861) [`21ccf90`](https://github.com/hey-api/hey-api/commit/21ccf90b864590c211fbfa3de5c687dd3c48f897) Thanks [@qqilihq](https://github.com/qqilihq)! - fix: Additional properties key

- [#869](https://github.com/hey-api/hey-api/pull/869) [`42d8a41`](https://github.com/hey-api/hey-api/commit/42d8a4151bace7b70af60a1abe46b7550ddad686) Thanks [@SamuelGuillemet](https://github.com/SamuelGuillemet)! - fix: add conditionnal generation for service related types

## 0.52.0

### Minor Changes

- [#835](https://github.com/hey-api/hey-api/pull/835) [`7ab277b`](https://github.com/hey-api/hey-api/commit/7ab277b22467fe268719af817aee701d6be3e828) Thanks [@LeeChSien](https://github.com/LeeChSien)! - feat: add namespace supporting for enums

### Patch Changes

- [#830](https://github.com/hey-api/hey-api/pull/830) [`babf11a`](https://github.com/hey-api/hey-api/commit/babf11ae082af642ac71cfee9c523cc976132a50) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: generate internal client for services when using standalone package

## 0.51.0

### Minor Changes

- [#828](https://github.com/hey-api/hey-api/pull/828) [`82a4696`](https://github.com/hey-api/hey-api/commit/82a4696b0b209ea2d9147f47f213479e61aed3d7) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: make `client` config option required

### Patch Changes

- [#823](https://github.com/hey-api/hey-api/pull/823) [`23c9dcd`](https://github.com/hey-api/hey-api/commit/23c9dcd5de19de62d745cc539674c815b2588cd2) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: correctly process body parameter for OpenAPI 2.0 specs

- [#827](https://github.com/hey-api/hey-api/pull/827) [`8d81c06`](https://github.com/hey-api/hey-api/commit/8d81c0605dbf4b4d19ec1c2dc51a93f8a2aca5b2) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: do not ignore api-version param in standalone clients

## 0.50.2

### Patch Changes

- [#818](https://github.com/hey-api/hey-api/pull/818) [`85d123c`](https://github.com/hey-api/hey-api/commit/85d123c9160f4ecb4c48e8a2ead54abf604dd21b) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle fully illegal schema names

## 0.50.1

### Patch Changes

- [#807](https://github.com/hey-api/hey-api/pull/807) [`ef249ba`](https://github.com/hey-api/hey-api/commit/ef249ba5bd04dbfb0e0a497caaa021f9c7de6949) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: generate types only for filtered services

- [#807](https://github.com/hey-api/hey-api/pull/807) [`ef249ba`](https://github.com/hey-api/hey-api/commit/ef249ba5bd04dbfb0e0a497caaa021f9c7de6949) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: allow any key/value pair in object types with empty properties object

## 0.50.0

### Minor Changes

- [#790](https://github.com/hey-api/hey-api/pull/790) [`68c3921`](https://github.com/hey-api/hey-api/commit/68c3921fd6e9a5db41ebd9f06e4f3ef6e64ab051) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: allow bundling standalone clients with `client.bundle = true`

## 0.49.0

### Minor Changes

- [#787](https://github.com/hey-api/hey-api/pull/787) [`327c5fb`](https://github.com/hey-api/hey-api/commit/327c5fb629f0c7b9c727da87b6bc287b8e98bcd5) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: allow filtering service endpoints with `services.filter`

### Patch Changes

- [#784](https://github.com/hey-api/hey-api/pull/784) [`f12dccf`](https://github.com/hey-api/hey-api/commit/f12dccf0ae3a05badb5783354bcd093f18f3ab74) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: suffix illegal service names

- [#786](https://github.com/hey-api/hey-api/pull/786) [`20759e2`](https://github.com/hey-api/hey-api/commit/20759e2cc52d78974fc0f78f581e9d9cb2d21ca5) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle references to schemas with illegal names

- [#788](https://github.com/hey-api/hey-api/pull/788) [`ecd94f2`](https://github.com/hey-api/hey-api/commit/ecd94f2adab1dbe10e7a9c310d1fb6d1f170d332) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle application/x-www-form-urlencoded content in request body

## 0.48.3

### Patch Changes

- [#781](https://github.com/hey-api/hey-api/pull/781) [`df3b799`](https://github.com/hey-api/hey-api/commit/df3b79996d47a69e4f2fdad93cea18ae1a01c419) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: use methodNameBuilder when asClass is false

- [#782](https://github.com/hey-api/hey-api/pull/782) [`edfd2bd`](https://github.com/hey-api/hey-api/commit/edfd2bdbb64f6682ded16f6da30f88f1c113bbe0) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: allow not generating types tree with types.tree = false

## 0.48.2

### Patch Changes

- [#746](https://github.com/hey-api/hey-api/pull/746) [`0448823`](https://github.com/hey-api/hey-api/commit/044882399d56d1532c7125df2e69cfb3b5fb4f34) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle formData parameters in generated types

- [#742](https://github.com/hey-api/hey-api/pull/742) [`efc30f4`](https://github.com/hey-api/hey-api/commit/efc30f4a2327b165b62f8467c68351a8bf94ffe5) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: ignore services.asClass setting for named clients

- [#744](https://github.com/hey-api/hey-api/pull/744) [`1e9edde`](https://github.com/hey-api/hey-api/commit/1e9edde54abd8978405f91b821c99b97f067d566) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: improve default response type detection

- [#745](https://github.com/hey-api/hey-api/pull/745) [`342772a`](https://github.com/hey-api/hey-api/commit/342772a560378c6718d25c29871eeab9a72c62a6) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle properties in one-of composition

## 0.48.1

### Patch Changes

- [#734](https://github.com/hey-api/hey-api/pull/734) [`1f52b26`](https://github.com/hey-api/hey-api/commit/1f52b260807531edb2c14003473ea4907007ecdb) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: generate service types when types are enabled, even if services are disabled

- [#737](https://github.com/hey-api/hey-api/pull/737) [`0537fe8`](https://github.com/hey-api/hey-api/commit/0537fe8682a93cc95d7637d643db4b9780318ea1) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: support custom config file path

- [#736](https://github.com/hey-api/hey-api/pull/736) [`8410046`](https://github.com/hey-api/hey-api/commit/8410046c45d25db48ba940a0c6c7a7cda9e86b6a) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle async response transformers

## 0.48.0

### Minor Changes

- [#696](https://github.com/hey-api/hey-api/pull/696) [`917405f`](https://github.com/hey-api/hey-api/commit/917405fcdcb2e978df693eb51720afa6fcf914e2) Thanks [@anchan828](https://github.com/anchan828)! - feat: pass the Operation object to methodNameBuilder

### Patch Changes

- [#708](https://github.com/hey-api/hey-api/pull/708) [`36cf95d`](https://github.com/hey-api/hey-api/commit/36cf95d319b175149d3b3ecc382b8d739186e658) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: make getHeaders() accept generic

- [#712](https://github.com/hey-api/hey-api/pull/712) [`6a5b96b`](https://github.com/hey-api/hey-api/commit/6a5b96b59e4248f2acaf5422be262edde97427dd) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle void responses in transformers

## 0.47.2

### Patch Changes

- [#701](https://github.com/hey-api/hey-api/pull/701) [`1081bbf`](https://github.com/hey-api/hey-api/commit/1081bbf5082450c18547dac4737ecc0e312cdd0e) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: add initial implementation of prefixItems

## 0.47.1

### Patch Changes

- [#690](https://github.com/hey-api/hey-api/pull/690) [`1017ace`](https://github.com/hey-api/hey-api/commit/1017acee80630d84a08bd8f0087c8fb0de270f1a) Thanks [@Nick-Lucas](https://github.com/Nick-Lucas)! - Fix an issue where transforms for endpoints with array returns were not generated correctly

## 0.47.0

### Minor Changes

- [#685](https://github.com/hey-api/hey-api/pull/685) [`8ca3e5e`](https://github.com/hey-api/hey-api/commit/8ca3e5e2990bc07ce0bac902245d08b67b6621e8) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: add initial support for response transformers (string -> Date)

- [#663](https://github.com/hey-api/hey-api/pull/663) [`e01c612`](https://github.com/hey-api/hey-api/commit/e01c61213e266afad5e3b159682b05957aac6534) Thanks [@Stono](https://github.com/Stono)! - Add support for customizing method names with `services.methodNameBuilder()`

## 0.46.3

### Patch Changes

- [#594](https://github.com/hey-api/hey-api/pull/594) [`9878381`](https://github.com/hey-api/hey-api/commit/98783811e0c90705ddac2cc5e54c524aae634865) Thanks [@SimenB](https://github.com/SimenB)! - Add explicit type annotations to `Interceptors`

  This allows the generated code to work with TypeScript 5.5's new `isolatedDeclarations` configuration.

- [#635](https://github.com/hey-api/hey-api/pull/635) [`0b09940`](https://github.com/hey-api/hey-api/commit/0b0994050dbcb6c17e8b78ca1c77738fc8e0d498) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle 1XX response status codes

- [#636](https://github.com/hey-api/hey-api/pull/636) [`498f459`](https://github.com/hey-api/hey-api/commit/498f45979b91bf93b319413c60492af94a08df48) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: improve default response status code classification

## 0.46.2

### Patch Changes

- fix: do not transform property names for standalone clients ([#616](https://github.com/hey-api/hey-api/pull/616))

## 0.46.1

### Patch Changes

- fix: handle application/json content type in parameter definitions ([#614](https://github.com/hey-api/hey-api/pull/614))

## 0.46.0

### Minor Changes

- feat: tree-shakeable services ([#602](https://github.com/hey-api/hey-api/pull/602))

## 0.45.1

### Patch Changes

- fix: use generated types in request object instead of inlined duplicated params ([#582](https://github.com/hey-api/hey-api/pull/582))

## 0.45.0

### Minor Changes

- feat: remove client inference ([#569](https://github.com/hey-api/hey-api/pull/569))

### Patch Changes

- fix: deduplicate inlined enums ([#573](https://github.com/hey-api/hey-api/pull/573))

- fix: generate correct optional key in types when using positional arguments (useOptions: false) ([#572](https://github.com/hey-api/hey-api/pull/572))

## 0.44.0

### Minor Changes

- feat: move format and lint config options to output object ([#546](https://github.com/hey-api/hey-api/pull/546))

### Patch Changes

- fix: comment position in JavaScript enums ([#544](https://github.com/hey-api/hey-api/pull/544))

- fix: export inlined enums from components ([#563](https://github.com/hey-api/hey-api/pull/563))

- fix: remove unused enums option from CLI ([#565](https://github.com/hey-api/hey-api/pull/565))

- fix: Support typescript in peerDependencies ([#551](https://github.com/hey-api/hey-api/pull/551))

## 0.43.2

### Patch Changes

- fix: deduplicate exported data and response types ([#538](https://github.com/hey-api/hey-api/pull/538))

## 0.43.1

### Patch Changes

- fix: use optional chaining in bin catch block ([#528](https://github.com/hey-api/hey-api/pull/528))

- fix: broken encoding ([#532](https://github.com/hey-api/hey-api/pull/532))

- fix(parser): handle type array ([#533](https://github.com/hey-api/hey-api/pull/533))

## 0.43.0

### Minor Changes

- feat: remove enum postfix, use typescript enums in types when generated, export enums from types.gen.ts ([#498](https://github.com/hey-api/hey-api/pull/498))

### Patch Changes

- fix: negative numbers in numeric enums ([#470](https://github.com/hey-api/hey-api/pull/470))

- fix: escape keys in schemas starting with digit but containing non-digit characters ([#502](https://github.com/hey-api/hey-api/pull/502))

- fix: issue causing code to not generate (t.filter is not a function) ([#507](https://github.com/hey-api/hey-api/pull/507))

- fix: handle additional properties union ([#499](https://github.com/hey-api/hey-api/pull/499))

- fix: do not export inline enums ([#508](https://github.com/hey-api/hey-api/pull/508))

- fix: prefix parameter type exports to avoid conflicts ([#501](https://github.com/hey-api/hey-api/pull/501))

- fix: export operation data and response types ([#500](https://github.com/hey-api/hey-api/pull/500))

- fix: handle cases where packages are installed globally ([#471](https://github.com/hey-api/hey-api/pull/471))

- fix: handle cases where package.json does not exist ([#471](https://github.com/hey-api/hey-api/pull/471))

## 0.42.1

### Patch Changes

- fix: properly set formData and body when using options ([#461](https://github.com/hey-api/hey-api/pull/461))

## 0.42.0

### Minor Changes

- change: config option `lint: true` has changed to `lint: 'eslint'` ([#455](https://github.com/hey-api/hey-api/pull/455))

- change: disable formatting with prettier by default ([#457](https://github.com/hey-api/hey-api/pull/457))

- feat: add support for biomejs as a formatter ([#455](https://github.com/hey-api/hey-api/pull/455))

- feat: move operationId config option to services object ([#441](https://github.com/hey-api/hey-api/pull/441))

- feat: add operation error type mappings ([#442](https://github.com/hey-api/hey-api/pull/442))

- feat: add support for biomejs as a linter ([#455](https://github.com/hey-api/hey-api/pull/455))

- change: config option `format: true` has changed to `format: 'prettier'` ([#455](https://github.com/hey-api/hey-api/pull/455))

### Patch Changes

- fix: do not destructure data when using use options ([#450](https://github.com/hey-api/hey-api/pull/450))

- feat: automatically handle dates in query string ([#443](https://github.com/hey-api/hey-api/pull/443))

- fix: only remove core directory when export core is true ([#449](https://github.com/hey-api/hey-api/pull/449))

- fix: add jsdoc comments with use options ([#439](https://github.com/hey-api/hey-api/pull/439))

## 0.41.0

### Minor Changes

- feat: add form type option for schemas ([#433](https://github.com/hey-api/hey-api/pull/433))

- feat: replace useDateType with option in types object ([#435](https://github.com/hey-api/hey-api/pull/435))

- feat: replace serviceResponse with option in services object ([#434](https://github.com/hey-api/hey-api/pull/434))

- feat: replace postfixServices with configuration object ([#430](https://github.com/hey-api/hey-api/pull/430))

### Patch Changes

- fix: properly escape backticks in template literals ([#431](https://github.com/hey-api/hey-api/pull/431))

- fix: transform names of referenced types ([#422](https://github.com/hey-api/hey-api/pull/422))

- fix: use config interceptors passed to constructor when using named client ([#432](https://github.com/hey-api/hey-api/pull/432))

- fix: properly escape expressions in template literals ([#431](https://github.com/hey-api/hey-api/pull/431))

- fix: do not export common properties as schemas ([#424](https://github.com/hey-api/hey-api/pull/424))

## 0.40.2

### Patch Changes

- fix: unhandled SyntaxKind unknown when specification has numeric enums ([#417](https://github.com/hey-api/hey-api/pull/417))

## 0.40.1

### Patch Changes

- fix: revert to generating commonjs for esm and commonjs support ([#409](https://github.com/hey-api/hey-api/pull/409))

## 0.40.0

### Minor Changes

- feat: allow choosing naming convention for types ([#402](https://github.com/hey-api/hey-api/pull/402))

### Patch Changes

- fix: rename exportModels to types ([#402](https://github.com/hey-api/hey-api/pull/402))

- fix: rename models.gen.ts to types.gen.ts ([#399](https://github.com/hey-api/hey-api/pull/399))

- fix: export enums from index.ts ([#399](https://github.com/hey-api/hey-api/pull/399))

## 0.39.0

### Minor Changes

- feat: rename generated files ([#363](https://github.com/hey-api/hey-api/pull/363))

- feat: add JSON-LD to content parsing ([#390](https://github.com/hey-api/hey-api/pull/390))

- fix: generate enums into their own file ([#358](https://github.com/hey-api/hey-api/pull/358))

### Patch Changes

- fix: remove file if no contents to write to it ([#373](https://github.com/hey-api/hey-api/pull/373))

- fix: eslint properly fixes output ([#375](https://github.com/hey-api/hey-api/pull/375))

- fix: invalid typescript Record generated with circular dependencies ([#374](https://github.com/hey-api/hey-api/pull/374))

- fix: prefer unknown type over any ([#392](https://github.com/hey-api/hey-api/pull/392))

- fix: only delete generated files instead of whole output directory ([#362](https://github.com/hey-api/hey-api/pull/362))

- fix: handle decoding models with `%` in description ([#360](https://github.com/hey-api/hey-api/pull/360))

- fix: throw error when typescript is missing ([#366](https://github.com/hey-api/hey-api/pull/366))

## 0.38.1

### Patch Changes

- fix: inconsistent indentation in models file when not using `format: true` ([#349](https://github.com/hey-api/hey-api/pull/349))

- fix: output path no longer required to be within cwd ([#353](https://github.com/hey-api/hey-api/pull/353))

## 0.38.0

### Minor Changes

- fix: rename write to dryRun and invert value ([#326](https://github.com/hey-api/hey-api/pull/326))

### Patch Changes

- fix: generate constant size array types properly ([#345](https://github.com/hey-api/hey-api/pull/345))

- fix: support x-enumNames for custom enum names ([#334](https://github.com/hey-api/hey-api/pull/334))

- fix: export service types from single namespace ([#341](https://github.com/hey-api/hey-api/pull/341))

- fix: generate models with proper indentation when formatting is false ([#340](https://github.com/hey-api/hey-api/pull/340))

- fix: log errors to file ([#329](https://github.com/hey-api/hey-api/pull/329))

- fix: cleanup some styling issues when generating client without formatting ([#330](https://github.com/hey-api/hey-api/pull/330))

## 0.37.3

### Patch Changes

- fix: do not ignore additionalProperties when object with properties object ([#323](https://github.com/hey-api/hey-api/pull/323))

## 0.37.2

### Patch Changes

- fix: escape schema names ([#317](https://github.com/hey-api/hey-api/pull/317))

- fix: escape backticks in strings starting with backtick ([#315](https://github.com/hey-api/hey-api/pull/315))

## 0.37.1

### Patch Changes

- fix: ensure strings with both single/double quotes and backticks are escaped properly ([#310](https://github.com/hey-api/hey-api/pull/310)) ([#310](https://github.com/hey-api/hey-api/pull/310))

## 0.37.0

### Minor Changes

- remove: `generics` as valid option for serviceResponse ([#299](https://github.com/hey-api/hey-api/pull/299))

### Patch Changes

- fix: escape dollar sign in operation names ([#307](https://github.com/hey-api/hey-api/pull/307))

## 0.36.2

### Patch Changes

- fix: move service types into models file ([#292](https://github.com/hey-api/hey-api/pull/292))

## 0.36.1

### Patch Changes

- fix: do not throw when failing to decode URI ([#296](https://github.com/hey-api/hey-api/pull/296))

## 0.36.0

### Minor Changes

- feat: export schemas directly from OpenAPI specification (ie. support exporting JSON schemas draft 2020-12 ([#285](https://github.com/hey-api/hey-api/pull/285))

### Patch Changes

- fix(config): rename exportSchemas to schemas ([#288](https://github.com/hey-api/hey-api/pull/288))

## 0.35.0

### Minor Changes

- fix(config): remove postfixModels option ([#266](https://github.com/hey-api/hey-api/pull/266))

- fix(client): do not send default params ([#267](https://github.com/hey-api/hey-api/pull/267))

### Patch Changes

- fix(api): use TypeScript Compiler API to create schemas ([#271](https://github.com/hey-api/hey-api/pull/271))

- fix(client): export APIResult when using serviceResponse as 'response' ([#283](https://github.com/hey-api/hey-api/pull/283))

- fix(parser): use only isRequired to determine if field is required ([#264](https://github.com/hey-api/hey-api/pull/264))

## 0.34.5

### Patch Changes

- fix(client): access service data type in namespace properly ([#258](https://github.com/hey-api/hey-api/pull/258))

## 0.34.4

### Patch Changes

- fix(client): namespace service data types ([#246](https://github.com/hey-api/hey-api/pull/246))

## 0.34.3

### Patch Changes

- fix(docs): link to docs hosted on vercel ([#244](https://github.com/hey-api/hey-api/pull/244))

## 0.34.2

### Patch Changes

- docs(readme): update broken contributing link ([#236](https://github.com/hey-api/hey-api/pull/236))

- fix(config): support ts config files and `defineConfig` syntax ([`0c92222ab74bb7d2391d49587760db9ea9228d5a`](https://github.com/hey-api/hey-api/commit/0c92222ab74bb7d2391d49587760db9ea9228d5a))

## 0.34.1

### Patch Changes

- fix(docs): ensure README is shown on NPMJS ([#229](https://github.com/hey-api/hey-api/pull/229))

## 0.34.0

### Minor Changes

- feat(client): generate all services in single `services.ts` file ([#215](https://github.com/hey-api/hey-api/pull/215))

- feat(schema): add support for default values ([#197](https://github.com/hey-api/hey-api/pull/197))

- feat(schema): add array of enum values for enums ([#197](https://github.com/hey-api/hey-api/pull/197))

### Patch Changes

- fix(axios): use builtin form data to ensure blob form data works in node environment ([#211](https://github.com/hey-api/hey-api/pull/211))

- fix(enum): append index number on duplicate name ([#220](https://github.com/hey-api/hey-api/pull/220))

## 0.33.2

### Patch Changes

- fix(axios): properly type content-type headers assignment ([#206](https://github.com/hey-api/hey-api/pull/206))

## 0.33.1

### Patch Changes

- fix(axios): set content type to multipart/form-data when using form data ([#204](https://github.com/hey-api/hey-api/pull/204))

## 0.33.0

### Minor Changes

- feat(fetch): detect form data repsonses properly ([#195](https://github.com/hey-api/hey-api/pull/195))

- feat(fetch): add application/octet-stream, application/pdf, and application/zip as binary response types ([#195](https://github.com/hey-api/hey-api/pull/195))

### Patch Changes

- fix(client): do not create or export empty files ([#200](https://github.com/hey-api/hey-api/pull/200))

- client(angular/fetch/xhr): detect all application/json or +json as JSON ([#195](https://github.com/hey-api/hey-api/pull/195))

## 0.32.1

### Patch Changes

- fix(schema): allow minimums/maximums to be 0 ([#194](https://github.com/hey-api/hey-api/pull/194))

- fix(axios): let axios handle serializing form data ([#192](https://github.com/hey-api/hey-api/pull/192))

## 0.32.0

### Minor Changes

- Support all HTTP error codes ([#188](https://github.com/hey-api/hey-api/pull/188))

- Use File or Blob type for binary types ([#186](https://github.com/hey-api/hey-api/pull/186))

- Check value instanceof Blob when using isBlob ([#186](https://github.com/hey-api/hey-api/pull/186))

### Patch Changes

- fix(cli): properly handle booleans ([#190](https://github.com/hey-api/hey-api/pull/190))

- Attempt to use body type as content type when sending Blob in node client ([#185](https://github.com/hey-api/hey-api/pull/185))

- fix(api): add experimental flag ([#191](https://github.com/hey-api/hey-api/pull/191))

## 0.31.1

### Patch Changes

- merge enums and useLegacyEnums into one option ([#178](https://github.com/hey-api/hey-api/pull/178))

- use FormData from node-fetch in node client ([#173](https://github.com/hey-api/hey-api/pull/173))

## 0.31.0

### Minor Changes

- Import all required models for a service in one import ([#172](https://github.com/hey-api/hey-api/pull/172))

- generate all models in single `models.ts` file ([#168](https://github.com/hey-api/hey-api/pull/168))

- generate all schemas in single `schemas.ts` file ([#168](https://github.com/hey-api/hey-api/pull/168))

### Patch Changes

- fix async response interceptors when using angular client ([#167](https://github.com/hey-api/hey-api/pull/167))

- fix deprecation warning on `throwError` in Angular client ([#167](https://github.com/hey-api/hey-api/pull/167))

- Do not create or export CancelablePromise when using Angular client ([#167](https://github.com/hey-api/hey-api/pull/167))

- Fix issue causing type error when targeting lower than ES2015 ([#171](https://github.com/hey-api/hey-api/pull/171))

- fix various warnings in generated client code ([#164](https://github.com/hey-api/hey-api/pull/164))

- fix providing interceptors in Angular client ([#167](https://github.com/hey-api/hey-api/pull/167))

## 0.30.0

### Minor Changes

- add support for interceptors ([#153](https://github.com/hey-api/hey-api/pull/153))

## 0.29.2

### Patch Changes

- Fix export types as type only when using useLegacyEnums ([#160](https://github.com/hey-api/hey-api/pull/160))

## 0.29.1

### Patch Changes

- Properly export enums when using useLegacyEnums ([#158](https://github.com/hey-api/hey-api/pull/158))

## 0.29.0

### Minor Changes

- Add useLegacyEnums options to generate TypeScript enums ([#147](https://github.com/hey-api/hey-api/pull/147))

## 0.28.0

### Minor Changes

- Add `index.ts` file to models, schemas, and services ([#137](https://github.com/hey-api/hey-api/pull/137))

## 0.27.39

### Patch Changes

- Warn users about missing dependencies used in the generated client ([#124](https://github.com/hey-api/hey-api/pull/124))

- Use AbortController in Axios client instead of deprecated CancelToken ([#124](https://github.com/hey-api/hey-api/pull/124))

## 0.27.38

### Minor Changes

- Make useOptions default to true

## 0.27.37

### Minor Changes

- Fix import error in generated Node client

- Update package dependencies

- Use engine-strict in .npmrc

## 0.27.36

### Minor Changes

- Handle falsy values in header

- Export schemas by default

## 0.27.35

### Minor Changes

- Update all project dependencies

- Discard only null or undefined in query string

## 0.27.34

### Minor Changes

- Add flag for linting generated code (default: false)

- Add flag for formatting generated code (default: true)

## 0.27.33

### Minor Changes

- Auto format with Eslint if available

- Add types for programmatic API

## 0.27.32

### Minor Changes

- Rename Config type to UserConfig

- Pass arguments in correct order in Angular client

## 0.27.31

### Minor Changes

- Add support for openapi-ts.config.js file

- Use built-in flat map

## 0.27.30

### Minor Changes

- Prefer unknown instead of any in generated client

## 0.27.29

### Minor Changes

- Rename openapi command to openapi-ts

- Add basic support for response that are Blobs

## 0.27.28

### Minor Changes

- Generate enums as JavaScript objects

- Use shorthand object properties in service calls

## 0.27.27

### Minor Changes

- Handle cases where a project does not have dependencies when checking to run Prettier

## 0.27.26

### Minor Changes

- Skip global parameters if they are duplicates of path parameters

- remove option to indent code

## 0.27.25

### Minor Changes

- Correctly set content-type header, even when body is falsy

## 0.27.24

### Minor Changes

- Remove union types flag (this is now default)

## 0.27.23

### Minor Changes

- Support printing exact arrays

## 0.27.22

### Minor Changes

- Add option to specify custom base path

- Fix spacing in cancelable promise

## 0.27.21

### Minor Changes

- Add explicit flags for generics

## 0.27.20

### Minor Changes

- Do not require type to be set for object properties

## 0.27.19

### Minor Changes

- Do not insert generics into custom client

## 0.27.18

### Minor Changes

- Support returning raw result object

- Allow passing config

## 0.27.17

### Minor Changes

- Generate nullable interface when isNullable is true

## 0.27.16

### Minor Changes

- Generate types for services when useOptions is true

## 0.27.15

### Minor Changes

- Fix wrong path on Windows

## 0.27.14

### Minor Changes

- Change imports to match project style

## 0.27.13

### Minor Changes

- Support printing Date instead of string for date-time formats in models

## 0.27.12

### Minor Changes

- Escape enum name when exported

## 0.27.11

### Minor Changes

- Fix typo in template header

## 0.27.10

### Minor Changes

- Escape newlines when outputting pattern string value in schemas

## 0.27.9

### Minor Changes

- Start passing options object instead of positional parameters

- Handle composition of any-of and properties

- Allow ignoring operation ID when generating operation names

- Propagate useVersionId to Swagger V2 parser

- Change --ingoreOperationId to --useOperationId

## 0.27.8

### Minor Changes

- Support non-ascii (unicode) characters in service name, operation name, and parameter name

## 0.27.7

### Minor Changes

- Bump dependencies

## 0.27.6

### Minor Changes

- Allow overriding request body name with x-body-name key

## 0.27.5

### Minor Changes

- Type additional properties with properties

- Parse array items only if parent definition has type

## 0.27.4

### Minor Changes

- Bump dependencies

## 0.27.3

### Minor Changes

- Support autoformat option flag

- Handle more cases of any-of

- Support regexp to select models to export

- Return optional success response on 204 status code

- Fix nested any-of

- Add const support

## 0.27.0

### Minor Changes

- Reverted `@apidevtools/json-schema-ref-parser` to version 10.1.0

## 0.26.0

### Minor Changes

- Upgraded dependencies

## 0.25.0

### Minor Changes

- Upgraded dependencies
- Allow usage of a custom axios instance
- Added message in generated files

## 0.24.0

### Minor Changes

- Upgraded dependencies
- Fixed issue with Cancelable promise
- Fixed issue with escaping reserved keywords in schema names
- Added `--postfixModels` option

## 0.23.0

### Minor Changes

- Upgraded dependencies
- Added blank line at the end of generated files
- Added support for Node.js v12
- Added `request` property inside `ApiError`
- Added support for `@depricated` inside models and operations

## 0.22.0

### Minor Changes

- Upgraded dependencies
- Fixed issue with `null` value inside comments for OpenAPI v2 enums
- Fixed issue with compatibility for latest version of Axios (0.27.x)
- Removed deprecated enum model generation

## 0.21.0

### Minor Changes

- Return `undefined` to match `noImplicitReturns` rule
- Made `BaseHttpRequest` class abstract
- Removed private fields using `#` inside `CancelablePromise`
- Removed unneeded import `AbortController` from `node-fetch` client
- Filter out wrong enum values

## 0.20.1

### Patch Changes

- Support enums with single quotes in names for V2

## 0.20.0

### Minor Changes

- Updated dependencies
- Support enums with single quotes in names for V3
- Generating better names when `operationId` is not given (breaking change)
- Fixed issue where `x-enum` flags where breaking due to non-string values

## 0.19.0

### Minor Changes

- Support for Angular client with `--name` option
- Added test cases for Angular client

## 0.18.2

### Patch Changes

- Updated dependencies
- Fixed type definition
- Added test cases for CLI commands
- Added test cases for query parsing

## 0.18.1

### Patch Changes

- Escaping error description
- Made `Client.request` and `BaseHttpRequest.config` props public

## 0.18.0

### Minor Changes

- Angular client generation!
- Updated documentation with more examples and better descriptions

## 0.17.0

### Minor Changes

- Shorthand notation for properties passed through constructor
- Simplified creation of headers
- Prepare codebase for Angular client

## 0.16.2

### Patch Changes

- Removed dependency on `URLSearchParams` to support browser and node without any additional imports

## 0.16.1

### Patch Changes

- Correct export inside `index.ts` when giving a custom name

## 0.16.0

### Minor Changes

- Added option to set the indentation (spaces and tabs)
- Added option to export separate client file that allows usage for multiple backends
- Decoupled OpenAPI object from requests
- Updated dependencies

## 0.15.0

### Minor Changes

- Added change log and releases on GitHub

## 0.14.0

### Minor Changes

- Added missing `postfix` options to typedef
- Updated escaping of comments and descriptions
- Better handling of services without tags
- Updated dependencies
  , // [!code --]
  path: 'hey-api/backend', // sign up at app.heyapi.dev
  },
  output: 'src/client',
  plugins: ['@hey-api/client-fetch'],
  };

  ```

  ```

### Patch Changes

- [#2079](https://github.com/hey-api/hey-api/pull/2079) [`d478d8a`](https://github.com/hey-api/hey-api/commit/d478d8a75b2691f2a113f3fe9cf7d1ce588baa0b) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(validators): generate JSDoc comments for validator schemas

- [#2081](https://github.com/hey-api/hey-api/pull/2081) [`4c076ee`](https://github.com/hey-api/hey-api/commit/4c076ee6e302ebdb587aaf4e7064aa086fd0bc5c) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(parser): handle exclusiveMinimum and exclusiveMaximum in OpenAPI 3.1.x when they're 0

- [#2080](https://github.com/hey-api/hey-api/pull/2080) [`2698a40`](https://github.com/hey-api/hey-api/commit/2698a4095f836b23248869018b98665d0afbcde7) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(sdk,axios): add responseType field when it's json so validators run by default

## 0.67.6

### Patch Changes

- [#2068](https://github.com/hey-api/hey-api/pull/2068) [`93b62fd`](https://github.com/hey-api/hey-api/commit/93b62fd433a09f28c75f58852e1baaa2b6fbd641) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(tanstack-query): require options when sdk client is set to false

- [#2060](https://github.com/hey-api/hey-api/pull/2060) [`373e15a`](https://github.com/hey-api/hey-api/commit/373e15a34fd81ac596a0797ddb133a47aeceee1f) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(valibot): add valibot plugin

## 0.67.5

### Patch Changes

- [#2052](https://github.com/hey-api/hey-api/pull/2052) [`f430eaa`](https://github.com/hey-api/hey-api/commit/f430eaad13d83d2191fff12802d9283099d7a527) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(tanstack-query): add SDK function comments to TanStack Query output

- [#2058](https://github.com/hey-api/hey-api/pull/2058) [`e9fda0b`](https://github.com/hey-api/hey-api/commit/e9fda0bff09c534333691f981363f445dc97129f) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(typescript): exclude $refs in readable/writable schemas when referenced schemas don't contain any readable/writable fields

- [#2059](https://github.com/hey-api/hey-api/pull/2059) [`af2082f`](https://github.com/hey-api/hey-api/commit/af2082f75dd02a52f8196709d7497dc99c5321e5) Thanks [@mrlubos](https://github.com/mrlubos)! - fix(typescript): add enumsConstantsIgnoreNull option to skip nulls from generated JavaScript objects

## 0.67.4

### Patch Changes

- [#2043](https://github.com/hey-api/hey-api/pull/2043) [`e3997c8`](https://github.com/hey-api/hey-api/commit/e3997c8d9a9e8a6da7bc4b417769e751887ff6ac) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle enum keyword with array type

## 0.67.3

### Patch Changes

- [#2020](https://github.com/hey-api/hey-api/pull/2020) [`27cb409`](https://github.com/hey-api/hey-api/commit/27cb4095383aff35f1d78094b8b73fb36f432d33) Thanks [@0xfurai](https://github.com/0xfurai)! - fix: handle references to properties

## 0.67.2

### Patch Changes

- [#2023](https://github.com/hey-api/hey-api/pull/2023) [`c6f01f3`](https://github.com/hey-api/hey-api/commit/c6f01f39493e241f01dd7997ccdb8b6bc3d1519c) Thanks [@kennidenni](https://github.com/kennidenni)! - fix: handle relative paths in client's `baseUrl` field

## 0.67.1

### Patch Changes

- [#2010](https://github.com/hey-api/hey-api/pull/2010) [`13c9577`](https://github.com/hey-api/hey-api/commit/13c9577f122eab7b7fdd92f67ac77cb334cbdcd5) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: do not use named imports from typescript module

## 0.67.0

### Minor Changes

- [#2003](https://github.com/hey-api/hey-api/pull/2003) [`1504a06`](https://github.com/hey-api/hey-api/commit/1504a0642fdb4f856d1650fade2d30988b35b4ff) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: respect `moduleResolution` value in `tsconfig.json`

  ### Respecting `moduleResolution` value in `tsconfig.json`

  This release introduces functionality related to your `tsconfig.json` file. The initial feature properly respects the value of your `moduleResolution` field. If you're using `nodenext`, the relative module paths in your output will be appended with `.js`. To preserve the previous behavior where we never appended `.js` to relative module paths, set `output.tsConfigPath` to `off`.

  ```js
  export default {
    input: "hey-api/backend", // sign up at app.heyapi.dev
    output: {
      path: "src/client",
      tsConfigPath: "off",
    },
  };
  ```

### Patch Changes

- [#2006](https://github.com/hey-api/hey-api/pull/2006) [`aa10522`](https://github.com/hey-api/hey-api/commit/aa10522f2bd018a417d875e5ab12ed0a848d2e49) Thanks [@Liooo](https://github.com/Liooo)! - fix: make discriminator field required when used with `oneOf` keyword

- [#2009](https://github.com/hey-api/hey-api/pull/2009) [`f45ba8e`](https://github.com/hey-api/hey-api/commit/f45ba8e96872a13be71c0d07e134f8c6717458d4) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: avoid including underscore for appended types (e.g. data, error, response) when preserving identifier case

## 0.66.7

### Patch Changes

- [#1981](https://github.com/hey-api/hey-api/pull/1981) [`955b95a`](https://github.com/hey-api/hey-api/commit/955b95ab051401bdbeaa8cfb93a7a7b707cb7529) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle schemas with all write-only or read-only fields

- [#1990](https://github.com/hey-api/hey-api/pull/1990) [`2fb1689`](https://github.com/hey-api/hey-api/commit/2fb1689b6538d32d123235175159d412df988241) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: avoid generating duplicate operation ids when sanitizing input

- [#1991](https://github.com/hey-api/hey-api/pull/1991) [`b6e654a`](https://github.com/hey-api/hey-api/commit/b6e654a6e18698f3c554848f8b8113e30f108fc4) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: Zod schemas use .and() instead of .merge()

- [#1919](https://github.com/hey-api/hey-api/pull/1919) [`ec62470`](https://github.com/hey-api/hey-api/commit/ec624709b1fb07da8d7234fe851561054dc68150) Thanks [@ngalluzzo](https://github.com/ngalluzzo)! - fix: correctly handle numeric property names with signs

- [#1984](https://github.com/hey-api/hey-api/pull/1984) [`0f305e0`](https://github.com/hey-api/hey-api/commit/0f305e06337758ee16c801ad437d9ce0996fc8b0) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: Zod plugin handles nullable enums

- [#1986](https://github.com/hey-api/hey-api/pull/1986) [`dbebff8`](https://github.com/hey-api/hey-api/commit/dbebff8dcba4c93d0c534e6e48e59e2aaaffd540) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle discriminator with multiple mappings to the same schema

- [#1980](https://github.com/hey-api/hey-api/pull/1980) [`0d7bede`](https://github.com/hey-api/hey-api/commit/0d7bede6e40553ae1c4c888770c84e55732b3cae) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: Zod schemas with BigInt and min/max constraints

- [#1987](https://github.com/hey-api/hey-api/pull/1987) [`71e2fd0`](https://github.com/hey-api/hey-api/commit/71e2fd029f2374ed8d2eaa01beecf254757e08d8) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: correct path to nested plugin files when using exportFromIndex

- [#1978](https://github.com/hey-api/hey-api/pull/1978) [`267f4b3`](https://github.com/hey-api/hey-api/commit/267f4b3730f2a477906e4e1593154dcd1723e554) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle extended `$ref` with `type` keyword in OpenAPI 3.1

- [#1982](https://github.com/hey-api/hey-api/pull/1982) [`1e6d74f`](https://github.com/hey-api/hey-api/commit/1e6d74f8321af5c61f86318b835d25db38609b03) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle additionalProperties empty object as unknown instead of preserving an empty interface

## 0.66.6

### Patch Changes

- [#1971](https://github.com/hey-api/hey-api/pull/1971) [`e1fb199`](https://github.com/hey-api/hey-api/commit/e1fb199a22a30653b95d498e6aaca2c59ed2b13b) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle Zod circular reference

## 0.66.5

### Patch Changes

- [#1951](https://github.com/hey-api/hey-api/pull/1951) [`4be46e5`](https://github.com/hey-api/hey-api/commit/4be46e506db1b2c53d1ddbf66e9919b5072f1cc0) Thanks [@devNameAsyraf](https://github.com/devNameAsyraf)! - fix: don't use JSON serializer for `application/octet-stream`

- [#1938](https://github.com/hey-api/hey-api/pull/1938) [`2a03e37`](https://github.com/hey-api/hey-api/commit/2a03e371715b5948ba568009975ad65ccbf7bfd7) Thanks [@sredni](https://github.com/sredni)! - fix: repeat tuple type `maxItems` times

## 0.66.4

### Patch Changes

- [#1936](https://github.com/hey-api/hey-api/pull/1936) [`ba2e5ca`](https://github.com/hey-api/hey-api/commit/ba2e5ca8af1cfe478963d72ff76d7d7ae026c5a5) Thanks [@seriouslag](https://github.com/seriouslag)! - fix: add return type to TanStack Query mutations

- [#1934](https://github.com/hey-api/hey-api/pull/1934) [`d4df550`](https://github.com/hey-api/hey-api/commit/d4df5503369b7aa105c7f6a49e1c7b43e0e50f49) Thanks [@seriouslag](https://github.com/seriouslag)! - fix: export some internal functions

## 0.66.3

### Patch Changes

- [#1917](https://github.com/hey-api/hey-api/pull/1917) [`d7af22c`](https://github.com/hey-api/hey-api/commit/d7af22c771af4bd2dab28acc69430717da390670) Thanks [@Freddis](https://github.com/Freddis)! - fix: handle nullable dates in transformers

## 0.66.2

### Patch Changes

- [#1913](https://github.com/hey-api/hey-api/pull/1913) [`7cfa4a7`](https://github.com/hey-api/hey-api/commit/7cfa4a76b13ca97d49c5f0366ba7264f94753d8b) Thanks [@BogdanMaier](https://github.com/BogdanMaier)! - fix: prevent crash when optional pagination field is missing

## 0.66.1

### Patch Changes

- [#1906](https://github.com/hey-api/hey-api/pull/1906) [`d1928d1`](https://github.com/hey-api/hey-api/commit/d1928d17710240bb42a6aa12da4618a9dd962df2) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: exclude and include expressions can be an array

- [#1906](https://github.com/hey-api/hey-api/pull/1906) [`d1928d1`](https://github.com/hey-api/hey-api/commit/d1928d17710240bb42a6aa12da4618a9dd962df2) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: support excluding deprecated fields with '@deprecated'

## 0.66.0

### Minor Changes

- [#1896](https://github.com/hey-api/hey-api/pull/1896) [`8840ed7`](https://github.com/hey-api/hey-api/commit/8840ed73df5ee718e803aa6e27b66e0c82ec3651) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: support read-only and write-only properties

  ### Read-only and write-only fields

  Starting with v0.66.0, `@hey-api/typescript` will generate separate types for payloads and responses if it detects any read-only or write-only fields. To preserve the previous behavior and generate a single type regardless, set `readOnlyWriteOnlyBehavior` to `off`.

  ```js
  export default {
    input: "hey-api/backend", // sign up at app.heyapi.dev
    output: "src/client",
    plugins: [
      // ...other plugins
      {
        name: "@hey-api/typescript",
        readOnlyWriteOnlyBehavior: "off", // [!code ++]
      },
    ],
  };
  ```

## 0.65.0

### Minor Changes

- [#1889](https://github.com/hey-api/hey-api/pull/1889) [`67c385b`](https://github.com/hey-api/hey-api/commit/67c385bf6289a79726b0cdd85fd81ca501cf2248) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: support custom clients

### Patch Changes

- [#1892](https://github.com/hey-api/hey-api/pull/1892) [`29fa764`](https://github.com/hey-api/hey-api/commit/29fa764986af3d3af842793c74d61681c7e967a1) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: allow passing fetch options to the request resolving a specification

- [#1877](https://github.com/hey-api/hey-api/pull/1877) [`6971f5b`](https://github.com/hey-api/hey-api/commit/6971f5bca4dd17ea65400c504ad0a4ffb083a38b) Thanks [@Matsuuu](https://github.com/Matsuuu)! - feat: ability to disable writing a log file via a `--no-log-file` flag or `logs.file` = `false`

## 0.64.15

### Patch Changes

- [#1850](https://github.com/hey-api/hey-api/pull/1850) [`fe43b88`](https://github.com/hey-api/hey-api/commit/fe43b889c20a2001f56e259f93f64851a1caa1d1) Thanks [@kelnos](https://github.com/kelnos)! - feat: add support for cookies auth

## 0.64.14

### Patch Changes

- [#1827](https://github.com/hey-api/hey-api/pull/1827) [`9dd43db`](https://github.com/hey-api/hey-api/commit/9dd43db54f2b7ebf87c5c7c118fdf149162a533d) Thanks [@john-cremit](https://github.com/john-cremit)! - feat: allow customizing pagination keywords using `input.pagination.keywords`

## 0.64.13

### Patch Changes

- [#1822](https://github.com/hey-api/hey-api/pull/1822) [`c73b0d4`](https://github.com/hey-api/hey-api/commit/c73b0d401c2bfa6f0b0d89d844a6aa09f2685a69) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: bump json-schema-ref-parser package

- [#1826](https://github.com/hey-api/hey-api/pull/1826) [`90886c1`](https://github.com/hey-api/hey-api/commit/90886c1372a999e8cb59d5da218762f6ee6cd459) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: allow config to be a function

## 0.64.12

### Patch Changes

- [#1816](https://github.com/hey-api/hey-api/pull/1816) [`b9e1b4b`](https://github.com/hey-api/hey-api/commit/b9e1b4bec5e1c5d1f2b5b9cfc7fa145274ae604d) Thanks [@shemsiu](https://github.com/shemsiu)! - Allow `scheme` property to be case-insensitive

## 0.64.11

### Patch Changes

- [#1800](https://github.com/hey-api/hey-api/pull/1800) [`a4811bd`](https://github.com/hey-api/hey-api/commit/a4811bdf178ec1a7f1602e0483a32fe7303f4eac) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: support Hey API platform input arguments

- [#1800](https://github.com/hey-api/hey-api/pull/1800) [`a4811bd`](https://github.com/hey-api/hey-api/commit/a4811bdf178ec1a7f1602e0483a32fe7303f4eac) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle raw OpenAPI specification input

## 0.64.10

### Patch Changes

- [#1779](https://github.com/hey-api/hey-api/pull/1779) [`57fcec8`](https://github.com/hey-api/hey-api/commit/57fcec804e339cfe508cfba4afd203c22495bff2) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: don't throw on missing performance marks

- [#1767](https://github.com/hey-api/hey-api/pull/1767) [`2de84ea`](https://github.com/hey-api/hey-api/commit/2de84ea3dbd2cba50150808a872aea8242c33014) Thanks [@Schroedi](https://github.com/Schroedi)! - fix: handle nested dates in transformers

## 0.64.9

### Patch Changes

- [#1774](https://github.com/hey-api/hey-api/pull/1774) [`c0b36b9`](https://github.com/hey-api/hey-api/commit/c0b36b95645d484034c3af145c5554867568979b) Thanks [@mrlubos](https://github.com/mrlubos)! - docs: announce Hey API platform

## 0.64.8

### Patch Changes

- [#1764](https://github.com/hey-api/hey-api/pull/1764) [`b3ecac3`](https://github.com/hey-api/hey-api/commit/b3ecac31d49a269ab400db4dbb84a22f1047e19a) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: reduce minimum Node.js 22 version to 22.10.0

## 0.64.7

### Patch Changes

- [#1755](https://github.com/hey-api/hey-api/pull/1755) [`82f7c14`](https://github.com/hey-api/hey-api/commit/82f7c1425dd903b75d15cf532b88580d180f281a) Thanks [@Matsuuu](https://github.com/Matsuuu)! - fix: Wrap the GET request in watch mode with try-catch to prevent crashes on no-head watch targets

## 0.64.6

### Patch Changes

- [#1748](https://github.com/hey-api/hey-api/pull/1748) [`7326d25`](https://github.com/hey-api/hey-api/commit/7326d2550ae3336fd8f754f8d4a25f1a40c13a2b) Thanks [@Matsuuu](https://github.com/Matsuuu)! - fix: Wrap HEAD request in a try-catch to prevent watch mode crashes on server reloads

## 0.64.5

### Patch Changes

- [#1728](https://github.com/hey-api/hey-api/pull/1728) [`cc8dabb`](https://github.com/hey-api/hey-api/commit/cc8dabbf1cb94879bb08fe66ecb04c4d0801e9cc) Thanks [@georgesmith46](https://github.com/georgesmith46)! - fix: correctly generate zod regex expressions when using patterns

## 0.64.4

### Patch Changes

- [#1710](https://github.com/hey-api/hey-api/pull/1710) [`4afdaa1`](https://github.com/hey-api/hey-api/commit/4afdaa1247b0bf0629817a51c29ca25840569b77) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: use relative path to custom config file if provided when resolving relative paths

## 0.64.3

### Patch Changes

- [#1701](https://github.com/hey-api/hey-api/pull/1701) [`e86629b`](https://github.com/hey-api/hey-api/commit/e86629bfa9ae2a47131d3a9a240a6aa2a4f67911) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: correctly type default value for Nuxt client

## 0.64.2

### Patch Changes

- [#1697](https://github.com/hey-api/hey-api/pull/1697) [`dec3fed`](https://github.com/hey-api/hey-api/commit/dec3fedb5f51aad4711fec15a006c525cb0bf7d8) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add exportFromIndex option to all plugins

- [#1699](https://github.com/hey-api/hey-api/pull/1699) [`8ff188f`](https://github.com/hey-api/hey-api/commit/8ff188fb269cf46321538dbe846e1b9ae3b8de42) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: allow passing arbitrary values to SDK functions via `meta` field

- [#1687](https://github.com/hey-api/hey-api/pull/1687) [`04c7cea`](https://github.com/hey-api/hey-api/commit/04c7ceac940a81cbed6a4070d9244aa5052ba4a2) Thanks [@hunshcn](https://github.com/hunshcn)! - sanitize "+" in uri to avoid plus in function name

## 0.64.1

### Patch Changes

- [#1668](https://github.com/hey-api/hey-api/pull/1668) [`7a03341`](https://github.com/hey-api/hey-api/commit/7a03341301d9d56ae93b4e4e3bd1ca469444f886) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: watch mode handles servers not exposing HEAD method for spec

- [#1668](https://github.com/hey-api/hey-api/pull/1668) [`7a03341`](https://github.com/hey-api/hey-api/commit/7a03341301d9d56ae93b4e4e3bd1ca469444f886) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add watch.timeout option

## 0.64.0

### Minor Changes

- [#1661](https://github.com/hey-api/hey-api/pull/1661) [`ccefe43`](https://github.com/hey-api/hey-api/commit/ccefe434ee83f1202769547ce128e1c134dee25f) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: added `client.baseUrl` option

  ### Added `client.baseUrl` option

  You can use this option to configure the default base URL for the generated client. By default, we will attempt to resolve the first defined server or infer the base URL from the input path. If you'd like to preserve the previous behavior, set `baseUrl` to `false`.

  ```js
  export default {
    input: "path/to/openapi.json",
    output: "src/client",
    plugins: [
      {
        baseUrl: false, // [!code ++]
        name: "@hey-api/client-fetch",
      },
    ],
  };
  ```

- [#1661](https://github.com/hey-api/hey-api/pull/1661) [`bb6d46a`](https://github.com/hey-api/hey-api/commit/bb6d46ae119ce4e7e3a2ab3fded74ac4fb4cdff2) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: make createConfig, CreateClientConfig, and Config accept ClientOptions generic

  ### Added `ClientOptions` interface

  The `Config` interface now accepts an optional generic extending `ClientOptions` instead of `boolean` type `ThrowOnError`.

  ```ts
  type Foo = Config<false>; // [!code --]
  type Foo = Config<{ throwOnError: false }>; // [!code ++]
  ```

## 0.63.2

### Patch Changes

- [#1651](https://github.com/hey-api/hey-api/pull/1651) [`df350f3`](https://github.com/hey-api/hey-api/commit/df350f31dae957d063010ba46c5008ae831b3a32) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: lower Node version requirements

## 0.63.1

### Patch Changes

- [#1637](https://github.com/hey-api/hey-api/pull/1637) [`2dc380e`](https://github.com/hey-api/hey-api/commit/2dc380eabc17c723654beb04ecd7bce6d33d3b49) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: update keywords in package.json

- [#1637](https://github.com/hey-api/hey-api/pull/1637) [`2dc380e`](https://github.com/hey-api/hey-api/commit/2dc380eabc17c723654beb04ecd7bce6d33d3b49) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add Next.js client

- [#1646](https://github.com/hey-api/hey-api/pull/1646) [`2cbffeb`](https://github.com/hey-api/hey-api/commit/2cbffeb2cdd6c6143cd68cac68369584879dda31) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: support required client in SDK using sdk.client = false

- [#1648](https://github.com/hey-api/hey-api/pull/1648) [`66a9e45`](https://github.com/hey-api/hey-api/commit/66a9e4517d2306da8c60750dc3380e6774a7177b) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add support for openIdConnect auth flow

## 0.63.0

### Minor Changes

- [#1626](https://github.com/hey-api/hey-api/pull/1626) [`8eba19d`](https://github.com/hey-api/hey-api/commit/8eba19d4092fc0903572ab9fdadf0b4c26928ba2) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: move clients to plugins

  ### Client plugins

  Clients are now plugins generating their own `client.gen.ts` file. There's no migration needed if you're using CLI. If you're using the configuration file, move `client` options to `plugins`.

  ```js
  export default {
    client: "@hey-api/client-fetch", // [!code --]
    input: "path/to/openapi.json",
    output: "src/client",
    plugins: ["@hey-api/client-fetch"], // [!code ++]
  };
  ```

### Patch Changes

- [#1626](https://github.com/hey-api/hey-api/pull/1626) [`8eba19d`](https://github.com/hey-api/hey-api/commit/8eba19d4092fc0903572ab9fdadf0b4c26928ba2) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: move sdk.throwOnError option to client.throwOnError

  ### Moved `sdk.throwOnError` option

  This SDK configuration option has been moved to the client plugins where applicable. Not every client can be configured to throw on error, so it didn't make sense to expose the option when it didn't have any effect.

  ```js
  export default {
    input: "path/to/openapi.json",
    output: "src/client",
    plugins: [
      {
        name: "@hey-api/client-fetch",
        throwOnError: true, // [!code ++]
      },
      {
        name: "@hey-api/sdk",
        throwOnError: true, // [!code --]
      },
    ],
  };
  ```

- [#1626](https://github.com/hey-api/hey-api/pull/1626) [`8eba19d`](https://github.com/hey-api/hey-api/commit/8eba19d4092fc0903572ab9fdadf0b4c26928ba2) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: sdks import client from client.gen.ts instead of defining it inside the file

  ### Added `client.gen.ts` file

  The internal `client` instance previously located in `sdk.gen.ts` is now defined in `client.gen.ts`. If you're importing it in your code, update the import module.

  ```js
  import { client } from "client/sdk.gen"; // [!code --]
  import { client } from "client/client.gen"; // [!code ++]
  ```

- [#1626](https://github.com/hey-api/hey-api/pull/1626) [`8eba19d`](https://github.com/hey-api/hey-api/commit/8eba19d4092fc0903572ab9fdadf0b4c26928ba2) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: throw if inferred plugin not found

## 0.62.3

### Patch Changes

- [#1600](https://github.com/hey-api/hey-api/pull/1600) [`0432418`](https://github.com/hey-api/hey-api/commit/0432418d72c94ef94865f8216ed2f723ad5191f9) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: bundle clients from compiled index file

- [#1594](https://github.com/hey-api/hey-api/pull/1594) [`bc66cde`](https://github.com/hey-api/hey-api/commit/bc66cde1ebe0e2df08c8d04b3ddc9504e4952cf3) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: generate correct response for text/plain content type

- [#1596](https://github.com/hey-api/hey-api/pull/1596) [`4784727`](https://github.com/hey-api/hey-api/commit/47847276e8bc854045044dd414382080270dd779) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: do not use a body serializer on text/plain sdks

- [#1602](https://github.com/hey-api/hey-api/pull/1602) [`194f941`](https://github.com/hey-api/hey-api/commit/194f94110545f2cae07bde13b863cd0cb5284d8a) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: support all oauth2 flows in sdk auth

- [#1596](https://github.com/hey-api/hey-api/pull/1596) [`4784727`](https://github.com/hey-api/hey-api/commit/47847276e8bc854045044dd414382080270dd779) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add null to valid bodySerializer types

## 0.62.2

### Patch Changes

- [#1519](https://github.com/hey-api/hey-api/pull/1519) [`14d3c4c`](https://github.com/hey-api/hey-api/commit/14d3c4ce0393d543e2d3aaebbfcf8f0cf32483b0) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add support for Nuxt client

## 0.62.1

### Patch Changes

- [#1574](https://github.com/hey-api/hey-api/pull/1574) [`51bf7fc`](https://github.com/hey-api/hey-api/commit/51bf7fc88cb6e9ab392106b85f900a75540e524f) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: generate bigint type instead of BigInt

- [#1572](https://github.com/hey-api/hey-api/pull/1572) [`0e4882a`](https://github.com/hey-api/hey-api/commit/0e4882ae3b0dc048a2d9a2a0b5c39fbdeed6de8d) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add ability to skip generating index file with output.indexFile

## 0.62.0

### Minor Changes

- [#1568](https://github.com/hey-api/hey-api/pull/1568) [`465410c`](https://github.com/hey-api/hey-api/commit/465410c201eb19e737e3143ad53a146e95f80107) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: change the default parser

### Patch Changes

- [#1566](https://github.com/hey-api/hey-api/pull/1566) [`39d558a`](https://github.com/hey-api/hey-api/commit/39d558afc6af97fe8de1a6471b9d1f172ec2960a) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: spread sdk options at the end to allow overriding generated values

## 0.61.3

### Patch Changes

- [#1552](https://github.com/hey-api/hey-api/pull/1552) [`ceb8bd7`](https://github.com/hey-api/hey-api/commit/ceb8bd74207566871e9f179cb28b2d8c440ef2c8) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: use z.coerce before calling z.bigint

## 0.61.2

### Patch Changes

- [#1543](https://github.com/hey-api/hey-api/pull/1543) [`7a2d6dc`](https://github.com/hey-api/hey-api/commit/7a2d6dcd6e30411178ac5c78db3f1dbbcc8d6b27) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: send GET request only on first spec fetch

## 0.61.1

### Patch Changes

- [#1530](https://github.com/hey-api/hey-api/pull/1530) [`67b7295`](https://github.com/hey-api/hey-api/commit/67b72959be499ff59f5f68bfdaa7e5568f5de02f) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: detect pagination in composite schemas with null type

- [#1535](https://github.com/hey-api/hey-api/pull/1535) [`d4cfa05`](https://github.com/hey-api/hey-api/commit/d4cfa05ed425d57f79b28efe76e6a33f1e892ec5) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle primitive constants in Zod and types

## 0.61.0

### Minor Changes

- [#1520](https://github.com/hey-api/hey-api/pull/1520) [`b3c23ba`](https://github.com/hey-api/hey-api/commit/b3c23ba99c361bdca3ab9c44017b6e5c044f40a7) Thanks [@chriswiggins](https://github.com/chriswiggins)! - Add support for HTTP Bearer Authentication Scheme

- [#1525](https://github.com/hey-api/hey-api/pull/1525) [`7b7313e`](https://github.com/hey-api/hey-api/commit/7b7313eeaf9a749fb81465546bc4e4bdce31d5ab) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: add OpenAPI 2.0 support to experimental parser

- [#1511](https://github.com/hey-api/hey-api/pull/1511) [`4e8064d`](https://github.com/hey-api/hey-api/commit/4e8064d9a589e14b42d2b1a329e2436f242884da) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: add watch mode

  ## Watch Mode

  ::: warning
  Watch mode currently supports only remote files via URL.
  :::

  If your schema changes frequently, you may want to automatically regenerate the output during development. To watch your input file for changes, enable `watch` mode in your configuration or pass the `--watch` flag to the CLI.

  ### Config

  ```js
  export default {
    client: "@hey-api/client-fetch",
    input: "path/to/openapi.json",
    output: "src/client",
    watch: true,
  };
  ```

  ### CLI

  ```sh
  npx @hey-api/openapi-ts \
    -c @hey-api/client-fetch \
    -i path/to/openapi.json \
    -o src/client \
    -w
  ```

- **BREAKING**: please update `@hey-api/client-*` packages to the latest version

  feat: add support for basic http auth

### Patch Changes

- [#1529](https://github.com/hey-api/hey-api/pull/1529) [`ccc0bbc`](https://github.com/hey-api/hey-api/commit/ccc0bbcbdeace22bbd8e92caadebdca81e61e393) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add support for long integers

- [#1512](https://github.com/hey-api/hey-api/pull/1512) [`dd0e0a2`](https://github.com/hey-api/hey-api/commit/dd0e0a266153e34448fbc3db6b0f864f75483280) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add `sdk.throwOnError` option

- [#1525](https://github.com/hey-api/hey-api/pull/1525) [`7b7313e`](https://github.com/hey-api/hey-api/commit/7b7313eeaf9a749fb81465546bc4e4bdce31d5ab) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: preserve leading separators in enum keys

## 0.60.1

### Patch Changes

- [#1468](https://github.com/hey-api/hey-api/pull/1468) [`20d7497`](https://github.com/hey-api/hey-api/commit/20d7497acb6c046f6a4206c2d8137414e17b2263) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle indexed access checks

- [#1469](https://github.com/hey-api/hey-api/pull/1469) [`a7608c2`](https://github.com/hey-api/hey-api/commit/a7608c27ced3419dee228f4b0cd96479b3dc2c04) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: zod: generate patterns and improve plain schemas

- [#1471](https://github.com/hey-api/hey-api/pull/1471) [`f86d293`](https://github.com/hey-api/hey-api/commit/f86d293f18f133ef6dd2f4864d037611b81edd26) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add links to the experimental parser callouts

- [#1462](https://github.com/hey-api/hey-api/pull/1462) [`893d6ef`](https://github.com/hey-api/hey-api/commit/893d6ef5677d17b96174f505937f6da686abb2bc) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: update types for custom plugins so defineConfig does not throw

- [#1464](https://github.com/hey-api/hey-api/pull/1464) [`787d59c`](https://github.com/hey-api/hey-api/commit/787d59c307549f5faf9f83314a8e9692bb01eb5d) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: export IR types

- [#1467](https://github.com/hey-api/hey-api/pull/1467) [`3a3f8d7`](https://github.com/hey-api/hey-api/commit/3a3f8d7ea4c993d4372e4bc52f6d9525bf1e45b6) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: export utils

- [#1457](https://github.com/hey-api/hey-api/pull/1457) [`bc03c37`](https://github.com/hey-api/hey-api/commit/bc03c373f4df61d8d715dc13badba2a6c5a3a450) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: allow plugins to explicitly declare whether they should be re-exported from the index file

## 0.60.0

### Minor Changes

- [#1430](https://github.com/hey-api/hey-api/pull/1430) [`9cec9e8`](https://github.com/hey-api/hey-api/commit/9cec9e8582c12a8c041b922d9587e16f6f19782a) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: require sdk.transformer to use generated transformers

  ### Added `sdk.transformer` option

  When generating SDKs, you now have to specify `transformer` in order to modify response data. By default, adding `@hey-api/transformers` to your plugins will only produce additional output. To preserve the previous functionality, set `sdk.transformer` to `true`.

  ```js
  import { defaultPlugins } from "@hey-api/openapi-ts";

  export default {
    client: "@hey-api/client-fetch",
    input: "path/to/openapi.json",
    output: "src/client",
    plugins: [
      ...defaultPlugins,
      {
        dates: true,
        name: "@hey-api/transformers",
      },
      {
        name: "@hey-api/sdk",
        transformer: true, // [!code ++]
      },
    ],
  };
  ```

- [#1447](https://github.com/hey-api/hey-api/pull/1447) [`200821b`](https://github.com/hey-api/hey-api/commit/200821b3ceea8ffca7656fe3f6e2ef98b7110a2a) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: revert license to MIT

### Patch Changes

- [#1430](https://github.com/hey-api/hey-api/pull/1430) [`9cec9e8`](https://github.com/hey-api/hey-api/commit/9cec9e8582c12a8c041b922d9587e16f6f19782a) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: Zod plugin generates response schemas

## 0.59.2

### Patch Changes

- [#1420](https://github.com/hey-api/hey-api/pull/1420) [`8010dbb`](https://github.com/hey-api/hey-api/commit/8010dbb1ab8b91d1d49d5cf16276183764a63ff3) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: generate querySerializer options for Axios client

- [#1419](https://github.com/hey-api/hey-api/pull/1419) [`4555796`](https://github.com/hey-api/hey-api/commit/4555796df3a33fb3fdf7d7417f7d1f3b22d89bcf) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: infer responseType in SDKs for axios client

- [#1409](https://github.com/hey-api/hey-api/pull/1409) [`646064d`](https://github.com/hey-api/hey-api/commit/646064d1aecea988d2b4df73bd24b2ee83394ae0) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: support oauth2 and apiKey security schemes

- [#1416](https://github.com/hey-api/hey-api/pull/1416) [`2a605b7`](https://github.com/hey-api/hey-api/commit/2a605b7e43655b3100e302e10b9979fbbad6cdfe) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: zod plugin handles recursive schemas

## 0.59.1

### Patch Changes

- [#1398](https://github.com/hey-api/hey-api/pull/1398) [`a88e7d9`](https://github.com/hey-api/hey-api/commit/a88e7d9f8a313c641cf651256a710d0610b95b5d) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: prefix restricted identifier names with underscore

- [#1394](https://github.com/hey-api/hey-api/pull/1394) [`ec48d32`](https://github.com/hey-api/hey-api/commit/ec48d323d80de8e6a47ce7ecd732288f0a47e17a) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: disallow additional query parameters in experimental parser output

## 0.59.0

### Minor Changes

- [#1387](https://github.com/hey-api/hey-api/pull/1387) [`7c4335d`](https://github.com/hey-api/hey-api/commit/7c4335d12782c73b5b242e7d5786ec8778857d1d) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: add `logs.level` option

  ### Added `logs.level` option

  You can now configure different log levels. As part of this feature, we had to introduce a breaking change by moving the `debug` option to `logs.level`. This will affect you if you're calling `@hey-api/openapi-ts` from Node.js (not CLI) or using the configuration file.

  ```js
  export default {
    client: "@hey-api/client-fetch",
    debug: true, // [!code --]
    input: "path/to/openapi.json",
    logs: {
      level: "debug", // [!code ++]
    },
    output: "src/client",
  };
  ```

- [#1389](https://github.com/hey-api/hey-api/pull/1389) [`f4c98ec`](https://github.com/hey-api/hey-api/commit/f4c98ec429ee989ae1c76328f4d42d44f14cb52e) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: remove `@hey-api/schemas` from default plugins

  ### Updated default `plugins`

  `@hey-api/schemas` has been removed from the default plugins. To continue using it, add it to your plugins array.

  ```js
  import { defaultPlugins } from "@hey-api/openapi-ts";

  export default {
    client: "@hey-api/client-fetch",
    experimentalParser: true,
    input: "path/to/openapi.json",
    output: "src/client",
    plugins: [
      ...defaultPlugins,
      "@hey-api/schemas", // [!code ++]
    ],
  };
  ```

### Patch Changes

- [#1382](https://github.com/hey-api/hey-api/pull/1382) [`3580c1e`](https://github.com/hey-api/hey-api/commit/3580c1eec4640d235a1e0f78bf76581e532aaf8b) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: correctly resolve required properties in nested allOf composition

- [#1387](https://github.com/hey-api/hey-api/pull/1387) [`7c4335d`](https://github.com/hey-api/hey-api/commit/7c4335d12782c73b5b242e7d5786ec8778857d1d) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add `--silent` or `-s` CLI option for silent log level

- [#1382](https://github.com/hey-api/hey-api/pull/1382) [`3580c1e`](https://github.com/hey-api/hey-api/commit/3580c1eec4640d235a1e0f78bf76581e532aaf8b) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: transformers handle allOf composition in experimental parser

- [#1387](https://github.com/hey-api/hey-api/pull/1387) [`0def82c`](https://github.com/hey-api/hey-api/commit/0def82c91d1be936702690b8cf5a21775974d946) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: add `logs` configuration option to customize log directory

- [#1390](https://github.com/hey-api/hey-api/pull/1390) [`8388c47`](https://github.com/hey-api/hey-api/commit/8388c4720dbb657899d5e30bd8d59c19583cad98) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: allow arbitrary object properties when additionalProperties is undefined

- [#1387](https://github.com/hey-api/hey-api/pull/1387) [`7c4335d`](https://github.com/hey-api/hey-api/commit/7c4335d12782c73b5b242e7d5786ec8778857d1d) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: support `DEBUG` environment variable

## 0.58.0

### Minor Changes

- [#1353](https://github.com/hey-api/hey-api/pull/1353) [`efd3e54`](https://github.com/hey-api/hey-api/commit/efd3e5444d208ea0c8dda7573f26bb04c31cc372) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: add typescript.identifierCase option

  ### Added `typescript.identifierCase` option

  **This change affects only the experimental parser.** By default, the generated TypeScript interfaces will follow the PascalCase naming convention. In the previous versions, we tried to preserve the original name as much as possible. To keep the previous behavior, set `typescript.identifierCase` to `preserve`.

  ```js
  export default {
    client: "@hey-api/client-fetch",
    experimentalParser: true,
    input: "path/to/openapi.json",
    output: "src/client",
    plugins: [
      // ...other plugins
      {
        identifierCase: "preserve", // [!code ++]
        name: "@hey-api/typescript",
      },
    ],
  };
  ```

- [#1360](https://github.com/hey-api/hey-api/pull/1360) [`5f6ddd7`](https://github.com/hey-api/hey-api/commit/5f6ddd796f0ce77bcca55fd13981f2a8481aecd3) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: remove schemas and transformers re-exports from index.ts

  ### Removed `schemas.gen.ts` re-export

  `index.ts` will no longer re-export `schemas.gen.ts` to reduce the chance of producing broken output. Please update your code to import from `schemas.gen.ts` directly.

  ```js
  import { mySchema } from "client"; // [!code --]
  import { mySchema } from "client/schemas.gen"; // [!code ++]
  ```

  ### Removed `transformers.gen.ts` re-export

  `index.ts` will no longer re-export `transformers.gen.ts` to reduce the chance of producing broken output. Please update your code to import from `transformers.gen.ts` directly.

  ```js
  import { myTransformer } from "client"; // [!code --]
  import { myTransformer } from "client/transformers.gen"; // [!code ++]
  ```

- [#1360](https://github.com/hey-api/hey-api/pull/1360) [`5f6ddd7`](https://github.com/hey-api/hey-api/commit/5f6ddd796f0ce77bcca55fd13981f2a8481aecd3) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: add output.clean option

  ### Added `output.clean` option

  By default, the `output.path` folder will be emptied on every run. To preserve the previous behavior, set `output.clean` to `false`.

  ```js
  export default {
    client: "@hey-api/client-fetch",
    input: "path/to/openapi.json",
    output: {
      clean: false, // [!code ++]
      path: "src/client",
    },
  };
  ```

- [#1362](https://github.com/hey-api/hey-api/pull/1362) [`3bf7169`](https://github.com/hey-api/hey-api/commit/3bf7169b620946d99c17cf5398d7a818d0099f94) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: add typescript.enumsCase option

### Patch Changes

- [#1361](https://github.com/hey-api/hey-api/pull/1361) [`a23c25e`](https://github.com/hey-api/hey-api/commit/a23c25ea1b5ca8bf421302bf93690168df3473cb) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add before and after to pagination keywords

- [#1368](https://github.com/hey-api/hey-api/pull/1368) [`cca2290`](https://github.com/hey-api/hey-api/commit/cca2290aeaab0b9807c928d73dbfc1e4bacadc4d) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: export Plugin API namespace

- [#1369](https://github.com/hey-api/hey-api/pull/1369) [`11163f0`](https://github.com/hey-api/hey-api/commit/11163f0d6885633078126849c04c0646e7d19255) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: TanStack Query plugin handles conflict with internal function name in experimental parser

## 0.57.1

### Patch Changes

- [#1335](https://github.com/hey-api/hey-api/pull/1335) [`bb9a848`](https://github.com/hey-api/hey-api/commit/bb9a84869dc911861f3b12f725a470b8fd6b67fe) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: transformers correctly handle an array

- [#1332](https://github.com/hey-api/hey-api/pull/1332) [`25b598b`](https://github.com/hey-api/hey-api/commit/25b598bcecd1dd3eb3da6b7c7f24f4adb0170114) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: improve camelcase with abbreviated plurals

- [#1333](https://github.com/hey-api/hey-api/pull/1333) [`734a62d`](https://github.com/hey-api/hey-api/commit/734a62dd8d594b8266964fe16766a481d37eb7df) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: experimental parser generates url inside data types

- [#1336](https://github.com/hey-api/hey-api/pull/1336) [`6857da8`](https://github.com/hey-api/hey-api/commit/6857da8a7f23829a89115b2237aaac9a71a38dfb) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: experimental parser transforms anyOf date and null

- [#1330](https://github.com/hey-api/hey-api/pull/1330) [`3d68587`](https://github.com/hey-api/hey-api/commit/3d6858748c94d6e33fd4dae7ddbf6cb70d21aaee) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: experimental parser handles empty string and null enum values in JavaScript mode

- [#1340](https://github.com/hey-api/hey-api/pull/1340) [`c8511e0`](https://github.com/hey-api/hey-api/commit/c8511e0d84dd408407bf764fb0bae4938b70dacb) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: experimental parser exports reusable request bodies

## 0.57.0

### Minor Changes

- [#1324](https://github.com/hey-api/hey-api/pull/1324) [`4e62378`](https://github.com/hey-api/hey-api/commit/4e62378352d8306580293ee4aeef43756d245f85) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: rename Hey API plugins

  ### Renamed `@hey-api/services` plugin

  This plugin has been renamed to `@hey-api/sdk`.

  ### Changed `sdk.output` value

  To align with the updated name, the `@hey-api/sdk` plugin will generate an `sdk.gen.ts` file. This will result in a breaking change if you're importing from `services.gen.ts`. Please update your imports to reflect this change.

  ```js
  import { client } from "client/services.gen"; // [!code --]
  import { client } from "client/sdk.gen"; // [!code ++]
  ```

  ### Renamed `@hey-api/types` plugin

  This plugin has been renamed to `@hey-api/typescript`.

- [#1327](https://github.com/hey-api/hey-api/pull/1327) [`62e37d5`](https://github.com/hey-api/hey-api/commit/62e37d51e9d829e11d08a494060c1e808ce2e3f3) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: add typescript.exportInlineEnums option

  ### Added `typescript.exportInlineEnums` option

  By default, inline enums (enums not defined as reusable components in the input file) will be generated only as inlined union types. You can set `exportInlineEnums` to `true` to treat inline enums as reusable components. When `true`, the exported enums will follow the style defined in `enums`.

  This is a breaking change since in the previous versions, inline enums were always treated as reusable components. To preserve your current output, set `exportInlineEnums` to `true`. This feature works only with the experimental parser.

  ```js
  export default {
    client: "@hey-api/client-fetch",
    experimentalParser: true,
    input: "path/to/openapi.json",
    output: "src/client",
    plugins: [
      // ...other plugins
      {
        exportInlineEnums: true, // [!code ++]
        name: "@hey-api/typescript",
      },
    ],
  };
  ```

### Patch Changes

- [#1326](https://github.com/hey-api/hey-api/pull/1326) [`01c3d69`](https://github.com/hey-api/hey-api/commit/01c3d69e4c97262cd6dda5061f0a76f3b4fda31a) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: improve generated enum keys in experimental parser

## 0.56.3

### Patch Changes

- [#1319](https://github.com/hey-api/hey-api/pull/1319) [`af76a77`](https://github.com/hey-api/hey-api/commit/af76a7705c585fcfae0c72872f358936f7d19d56) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: Zod plugin handles value constraints and defaults

## 0.56.2

### Patch Changes

- [#1316](https://github.com/hey-api/hey-api/pull/1316) [`a79fac8`](https://github.com/hey-api/hey-api/commit/a79fac8919ed29eec7195cbd441ffa38b559d63c) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add input.exclude option

- [#1316](https://github.com/hey-api/hey-api/pull/1316) [`a79fac8`](https://github.com/hey-api/hey-api/commit/a79fac8919ed29eec7195cbd441ffa38b559d63c) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: make Zod plugin available in plugins options

## 0.56.1

### Patch Changes

- [#1309](https://github.com/hey-api/hey-api/pull/1309) [`785480b`](https://github.com/hey-api/hey-api/commit/785480b2d5f96a681dfc1f7f0fb626f744bb221f) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: gracefully handle invalid schema type in experimental parser

## 0.56.0

### Minor Changes

- [#1286](https://github.com/hey-api/hey-api/pull/1286) [`5514de4`](https://github.com/hey-api/hey-api/commit/5514de46a8c913ddc40f07d0142c80266e9837cd) Thanks [@jacobinu](https://github.com/jacobinu)! - feat: add `fastify` plugin

### Patch Changes

- [#1286](https://github.com/hey-api/hey-api/pull/1286) [`cebf327`](https://github.com/hey-api/hey-api/commit/cebf327046c801b375846bae6b07561b8ad1bdd6) Thanks [@jacobinu](https://github.com/jacobinu)! - fix: export a map of error and response types by status code

- [#1286](https://github.com/hey-api/hey-api/pull/1286) [`8a15a35`](https://github.com/hey-api/hey-api/commit/8a15a35e86ff22eca85dc218bc1793315b934556) Thanks [@jacobinu](https://github.com/jacobinu)! - fix: deprecate types.tree option

- [#1305](https://github.com/hey-api/hey-api/pull/1305) [`a3698a7`](https://github.com/hey-api/hey-api/commit/a3698a7f1680d7dfb913c6253f8685ebbdd132ca) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle file-like content media type without explicit schema

## 0.55.3

### Patch Changes

- [#1283](https://github.com/hey-api/hey-api/pull/1283) [`781d1a4`](https://github.com/hey-api/hey-api/commit/781d1a40d10ce380f1ca2cb2bc7aca7d3b169bc6) Thanks [@hougesen](https://github.com/hougesen)! - feat: add support for oxlint as linter

## 0.55.2

### Patch Changes

- [#1253](https://github.com/hey-api/hey-api/pull/1253) [`01dee3d`](https://github.com/hey-api/hey-api/commit/01dee3df879232939e43355231147b3d910fb482) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: update sponsorship links

- [#1266](https://github.com/hey-api/hey-api/pull/1266) [`d60d260`](https://github.com/hey-api/hey-api/commit/d60d260342ff3013c2e228151e9b897224eb89cc) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: correctly generate array when items are a oneOf array with length 1

- [#1265](https://github.com/hey-api/hey-api/pull/1265) [`691cdc2`](https://github.com/hey-api/hey-api/commit/691cdc28b6ad5bc1a38e1ae9eb134a2b41d4ead8) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle non-exploded array query parameters

- [#1267](https://github.com/hey-api/hey-api/pull/1267) [`ff3aa4a`](https://github.com/hey-api/hey-api/commit/ff3aa4ac58068671d2b9eedbd7528eb4f9969386) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle discriminators in experimental parser

## 0.55.1

### Patch Changes

- [#1248](https://github.com/hey-api/hey-api/pull/1248) [`61cd848`](https://github.com/hey-api/hey-api/commit/61cd848262b20580fb185d023c28aa54754bf19c) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle nullable enums in experimental parser

- [#1251](https://github.com/hey-api/hey-api/pull/1251) [`07800d4`](https://github.com/hey-api/hey-api/commit/07800d4fbb849614ed2c23b8acc9c82f1ef74598) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add support for custom plugins

- [#1250](https://github.com/hey-api/hey-api/pull/1250) [`9e07675`](https://github.com/hey-api/hey-api/commit/9e07675802c75b8f5105dd104bb7736aeb83ece6) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: render void for empty response status codes in experimental parser

## 0.55.0

### Minor Changes

- [#1241](https://github.com/hey-api/hey-api/pull/1241) [`41cee41`](https://github.com/hey-api/hey-api/commit/41cee417055c50de6170e6fdeae65bd6e643d19c) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: add input.include option

### Patch Changes

- [#1239](https://github.com/hey-api/hey-api/pull/1239) [`319a28a`](https://github.com/hey-api/hey-api/commit/319a28af29541d7f61cca82389e1d486204f321f) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle pagination with basic refs

## 0.54.4

### Patch Changes

- [#1237](https://github.com/hey-api/hey-api/pull/1237) [`63ccc07`](https://github.com/hey-api/hey-api/commit/63ccc0775e24a096bc46ac7ff29b99b694aad621) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: forbid any body, path, or query parameters if not defined in spec

- [#1235](https://github.com/hey-api/hey-api/pull/1235) [`7a1a419`](https://github.com/hey-api/hey-api/commit/7a1a419f07d5ad39e07265771b30d49a4b754a88) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle additionalProperties: boolean in experimental parser

- [#1233](https://github.com/hey-api/hey-api/pull/1233) [`08baa77`](https://github.com/hey-api/hey-api/commit/08baa77afdc5e2c49d4789b20673e949951ab0b2) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: update schemas plugin to handle experimental 3.0.x parser

  This release adds an experimental parser for OpenAPI versions 3.0.x. In the future, this will become the default parser. If you're using OpenAPI 3.0 or newer, we encourage you to try it out today.

  You can enable the experimental parser by setting the `experimentalParser` boolean flag to `true` in your configuration file or CLI.

  ```js
  export default {
    client: "@hey-api/client-fetch",
    input: "path/to/openapi.json",
    output: "src/client",
    experimentalParser: true,
  };
  ```

  ```sh
  npx @hey-api/openapi-ts -i path/to/openapi.json -o src/client -c @hey-api/client-fetch -e
  ```

  The generated output should not structurally change, despite few things being generated in a different order. In fact, the output should be cleaner! That's the immediate side effect you should notice. If that's not true, please leave feedback in [GitHub issues](https://github.com/hey-api/hey-api/issues).

  Hey API parser marks an important milestone towards v1 of `@hey-api/openapi-ts`. More features will be added to the parser in the future and the original parser from `openapi-typescript-codegen` will be deprecated and used only for generating legacy clients.

  If you'd like to work with the parser more closely (e.g. to generate code not natively supported by this package), feel free to reach out with any feedback or suggestions. Happy parsing! 🎉

## 0.54.3

### Patch Changes

- [#1230](https://github.com/hey-api/hey-api/pull/1230) [`3e65ae0`](https://github.com/hey-api/hey-api/commit/3e65ae06bcd2823482cf012909388c7630e18229) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: add OpenAPI 3.0.x experimental parser

  This release adds an experimental parser for OpenAPI versions 3.0.x. In the future, this will become the default parser. If you're using OpenAPI 3.0 or newer, we encourage you to try it out today.

  You can enable the experimental parser by setting the `experimentalParser` boolean flag to `true` in your configuration file or CLI.

  ```js
  export default {
    client: "@hey-api/client-fetch",
    input: "path/to/openapi.json",
    output: "src/client",
    experimentalParser: true,
  };
  ```

  ```sh
  npx @hey-api/openapi-ts -i path/to/openapi.json -o src/client -c @hey-api/client-fetch -e
  ```

  The generated output should not structurally change, despite few things being generated in a different order. In fact, the output should be cleaner! That's the immediate side effect you should notice. If that's not true, please leave feedback in [GitHub issues](https://github.com/hey-api/hey-api/issues).

  Hey API parser marks an important milestone towards v1 of `@hey-api/openapi-ts`. More features will be added to the parser in the future and the original parser from `openapi-typescript-codegen` will be deprecated and used only for generating legacy clients.

  If you'd like to work with the parser more closely (e.g. to generate code not natively supported by this package), feel free to reach out with any feedback or suggestions. Happy parsing! 🎉

## 0.54.2

### Patch Changes

- [#1222](https://github.com/hey-api/hey-api/pull/1222) [`ceb4363`](https://github.com/hey-api/hey-api/commit/ceb4363d52893ebe947e21aac402b868ff2820d4) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: add support for @tanstack/angular-query-experimental package

## 0.54.1

### Patch Changes

- [#1211](https://github.com/hey-api/hey-api/pull/1211) [`c8a3e3d`](https://github.com/hey-api/hey-api/commit/c8a3e3d7e59692698b7cf45182ca92494fc4af96) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: ignore name option when not used with legacy clients to avoid producing broken output

- [#1209](https://github.com/hey-api/hey-api/pull/1209) [`3a80b9f`](https://github.com/hey-api/hey-api/commit/3a80b9fd009c8229d69f3f349acbfb19b7549a94) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add support for OpenAPI 3.1.1 to experimental parser

## 0.54.0

### Minor Changes

- [#1201](https://github.com/hey-api/hey-api/pull/1201) [`972a93a`](https://github.com/hey-api/hey-api/commit/972a93a91a945cc9ead73c08bb0fa9ee120433ba) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: make plugins first-class citizens

  This release makes plugins first-class citizens. In order to achieve that, the following breaking changes were introduced.

  ### Removed CLI options

  The `--types`, `--schemas`, and `--services` CLI options have been removed. You can list which plugins you'd like to use explicitly by passing a list of plugins as `--plugins <plugin1> <plugin2>`

  ### Removed `*.export` option

  Previously, you could explicitly disable export of certain artifacts using the `*.export` option or its shorthand variant. These were both removed. You can now disable export of specific artifacts by manually defining an array of `plugins` and excluding the unwanted plugin.

  ::: code-group

  ```js [shorthand]
  export default {
    client: "@hey-api/client-fetch",
    input: "path/to/openapi.json",
    output: "src/client",
    schemas: false, // [!code --]
    plugins: ["@hey-api/types", "@hey-api/services"], // [!code ++]
  };
  ```

  ```js [*.export]
  export default {
    client: "@hey-api/client-fetch",
    input: "path/to/openapi.json",
    output: "src/client",
    schemas: {
      export: false, // [!code --]
    },
    plugins: ["@hey-api/types", "@hey-api/services"], // [!code ++]
  };
  ```

  :::

  ### Renamed `schemas.name` option

  Each plugin definition contains a `name` field. This was conflicting with the `schemas.name` option. As a result, it has been renamed to `nameBuilder`.

  ```js
  export default {
    client: "@hey-api/client-fetch",
    input: "path/to/openapi.json",
    output: "src/client",
    schemas: {
      name: (name) => `${name}Schema`, // [!code --]
    },
    plugins: [
      // ...other plugins
      {
        nameBuilder: (name) => `${name}Schema`, // [!code ++]
        name: "@hey-api/schemas",
      },
    ],
  };
  ```

  ### Removed `services.include` shorthand option

  Previously, you could use a string value as a shorthand for the `services.include` configuration option. You can now achieve the same result using the `include` option.

  ```js
  export default {
    client: "@hey-api/client-fetch",
    input: "path/to/openapi.json",
    output: "src/client",
    services: "^MySchema", // [!code --]
    plugins: [
      // ...other plugins
      {
        include: "^MySchema", // [!code ++]
        name: "@hey-api/services",
      },
    ],
  };
  ```

  ### Renamed `services.name` option

  Each plugin definition contains a `name` field. This was conflicting with the `services.name` option. As a result, it has been renamed to `serviceNameBuilder`.

  ```js
  export default {
    client: "@hey-api/client-fetch",
    input: "path/to/openapi.json",
    output: "src/client",
    services: {
      name: "{{name}}Service", // [!code --]
    },
    plugins: [
      // ...other plugins
      {
        serviceNameBuilder: "{{name}}Service", // [!code ++]
        name: "@hey-api/services",
      },
    ],
  };
  ```

  ### Renamed `types.dates` option

  Previously, you could set `types.dates` to a boolean or a string value, depending on whether you wanted to transform only type strings into dates, or runtime code too. Many people found these options confusing, so they have been simplified to a boolean and extracted into a separate `@hey-api/transformers` plugin.

  ```js
  export default {
    client: "@hey-api/client-fetch",
    input: "path/to/openapi.json",
    output: "src/client",
    types: {
      dates: "types+transform", // [!code --]
    },
    plugins: [
      // ...other plugins
      {
        dates: true, // [!code ++]
        name: "@hey-api/transformers",
      },
    ],
  };
  ```

  ### Removed `types.include` shorthand option

  Previously, you could use a string value as a shorthand for the `types.include` configuration option. You can now achieve the same result using the `include` option.

  ```js
  export default {
    client: "@hey-api/client-fetch",
    input: "path/to/openapi.json",
    output: "src/client",
    types: "^MySchema", // [!code --]
    plugins: [
      // ...other plugins
      {
        include: "^MySchema", // [!code ++]
        name: "@hey-api/types",
      },
    ],
  };
  ```

  ### Renamed `types.name` option

  Each plugin definition contains a `name` field. This was conflicting with the `types.name` option. As a result, it has been renamed to `style`.

  ```js
  export default {
    client: "@hey-api/client-fetch",
    input: "path/to/openapi.json",
    output: "src/client",
    types: {
      name: "PascalCase", // [!code --]
    },
    plugins: [
      // ...other plugins
      {
        name: "@hey-api/types",
        style: "PascalCase", // [!code ++]
      },
    ],
  };
  ```

## 0.53.12

### Patch Changes

- [#1195](https://github.com/hey-api/hey-api/pull/1195) [`753643f`](https://github.com/hey-api/hey-api/commit/753643fae74d4248df8dc5fe9dda5f28a1dabdf1) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: TanStack Query plugin using missing import for infinite query

- [#1194](https://github.com/hey-api/hey-api/pull/1194) [`c38deaf`](https://github.com/hey-api/hey-api/commit/c38deaf02b606b92edd9c316b1444b6b6c12916d) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: pass TanStack query signal to client call

## 0.53.11

### Patch Changes

- [#1151](https://github.com/hey-api/hey-api/pull/1151) [`587791d`](https://github.com/hey-api/hey-api/commit/587791dfede0167fbed229281467e4c4875936f5) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: update website domain, add license documentation

## 0.53.10

### Patch Changes

- [#1145](https://github.com/hey-api/hey-api/pull/1145) [`a0a5551`](https://github.com/hey-api/hey-api/commit/a0a55510d30a1a8dea0ade4908b5b13d51b5f9e6) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: update license field in package.json to match the license, revert client packages license to MIT

## 0.53.9

### Patch Changes

- [#1137](https://github.com/hey-api/hey-api/pull/1137) [`f4566c2`](https://github.com/hey-api/hey-api/commit/f4566c2bcd67f45f069bfa6220d3c710177f28cc) Thanks [@BierDav](https://github.com/BierDav)! - Add support for passing mutation specific options to `<operation_id>Mutation(options)`

## 0.53.8

### Patch Changes

- [#1123](https://github.com/hey-api/hey-api/pull/1123) [`032338c`](https://github.com/hey-api/hey-api/commit/032338c47506ccfd567bbbf915398942c8394bc2) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: use correct relative path to bundled client when imported from nested module

## 0.53.7

### Patch Changes

- [#1113](https://github.com/hey-api/hey-api/pull/1113) [`dc696e0`](https://github.com/hey-api/hey-api/commit/dc696e0b4500dba5ceb4c772110b123bd2f71b40) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: skip nested properties in oneOf and anyOf compositions

- [#1115](https://github.com/hey-api/hey-api/pull/1115) [`5f077dd`](https://github.com/hey-api/hey-api/commit/5f077dd8d144bbfe71d8775bad5fe7ddda2315d6) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: abstract page params logic in TanStack Query plugin

## 0.53.6

### Patch Changes

- [#1104](https://github.com/hey-api/hey-api/pull/1104) [`a1eada1`](https://github.com/hey-api/hey-api/commit/a1eada1896046f0de1710682635efc59434a1e2c) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: export spec-compliant OpenAPI 3.1 interface

- [#1108](https://github.com/hey-api/hey-api/pull/1108) [`7677924`](https://github.com/hey-api/hey-api/commit/76779246534391deca5a371df2c7dc76e9d2eb73) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle multiple form-data parameters in Swagger 2.0

## 0.53.5

### Patch Changes

- [#1096](https://github.com/hey-api/hey-api/pull/1096) [`b6e350a`](https://github.com/hey-api/hey-api/commit/b6e350a9cc2d82ac4496b7d57ec8b58978c951c2) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: make TanStack Query plugin work with class-based services

- [#1095](https://github.com/hey-api/hey-api/pull/1095) [`11ee53f`](https://github.com/hey-api/hey-api/commit/11ee53f4f519643ae7e3f0997ce4fe9b6cb050a8) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: avoid printing duplicate null nodes

- [#1094](https://github.com/hey-api/hey-api/pull/1094) [`713ccd5`](https://github.com/hey-api/hey-api/commit/713ccd5e5e250a14cacf96fd1dffad252cc4cc6a) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: attach TanStack Query infinite page params only if they exist

## 0.53.4

### Patch Changes

- [#1087](https://github.com/hey-api/hey-api/pull/1087) [`b528236`](https://github.com/hey-api/hey-api/commit/b528236b626d12d4ac03b98b8abecc425291c5e5) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: import handlebars instead of runtime

- [#1086](https://github.com/hey-api/hey-api/pull/1086) [`0bc1ebe`](https://github.com/hey-api/hey-api/commit/0bc1ebe318399d01296777746ce0bccc83c0e83d) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: support dynamic require in child_process

## 0.53.3

### Patch Changes

- [#1075](https://github.com/hey-api/hey-api/pull/1075) [`11a276a`](https://github.com/hey-api/hey-api/commit/11a276a1e35dde0735363e892d8142016fd87eec) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: properly handle dual publishing and type generation

## 0.53.2

### Patch Changes

- [#1060](https://github.com/hey-api/hey-api/pull/1060) [`8d66c08`](https://github.com/hey-api/hey-api/commit/8d66c085cf81e0e166c3e172ce319d5e2d4002bf) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle colon in operation path

- [#1065](https://github.com/hey-api/hey-api/pull/1065) [`a756987`](https://github.com/hey-api/hey-api/commit/a756987ad396fd7e68cc5eff63f6615bffef3782) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: allow overriding generated headers from options

- [#1068](https://github.com/hey-api/hey-api/pull/1068) [`a48be86`](https://github.com/hey-api/hey-api/commit/a48be8660f6d1d84fdf25a3952587fb963482e8a) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: export Operation interface

- [#1067](https://github.com/hey-api/hey-api/pull/1067) [`5a52da1`](https://github.com/hey-api/hey-api/commit/5a52da1425abef9f4fef58ef077dbd05545e25a2) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle named object property with no nested properties

- [#1066](https://github.com/hey-api/hey-api/pull/1066) [`e8a38ae`](https://github.com/hey-api/hey-api/commit/e8a38ae4e3f021a105d18764ef3252db7efa9aa0) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: transform any-of nullable dates

## 0.53.1

### Patch Changes

- [#1050](https://github.com/hey-api/hey-api/pull/1050) [`6922b5a`](https://github.com/hey-api/hey-api/commit/6922b5a3ebe67190d2034ea79674706a5e80e818) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: throw error on invalid client value

## 0.53.0

### Minor Changes

- [#1008](https://github.com/hey-api/hey-api/pull/1008) [`dc4a40d`](https://github.com/hey-api/hey-api/commit/dc4a40d517853e4cf5be532f5bf4874c84c924be) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: rename legacy clients with 'legacy/' prefix

- [#1009](https://github.com/hey-api/hey-api/pull/1009) [`c6b044d`](https://github.com/hey-api/hey-api/commit/c6b044d0bc9dc54cb0eb58d23438f4e1d050cb38) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: change schemas name pattern, add schemas.name option

### Patch Changes

- [#989](https://github.com/hey-api/hey-api/pull/989) [`bc78a42`](https://github.com/hey-api/hey-api/commit/bc78a421eafed1920102b796842e227cacda6ef0) Thanks [@jacobinu](https://github.com/jacobinu)! - fix: make UserConfig interface instead of type

- [#1010](https://github.com/hey-api/hey-api/pull/1010) [`b6e58c6`](https://github.com/hey-api/hey-api/commit/b6e58c64d1b71897533a85d1738cd7ce7ede178d) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: set query key base url from supplied client if provided

## 0.52.11

### Patch Changes

- [#981](https://github.com/hey-api/hey-api/pull/981) [`afd8c43`](https://github.com/hey-api/hey-api/commit/afd8c4386fb7b2f86a54e73c9471945bdfad22ea) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: export query key functions from TanStack Query plugin

## 0.52.10

### Patch Changes

- [#973](https://github.com/hey-api/hey-api/pull/973) [`8f7a14f`](https://github.com/hey-api/hey-api/commit/8f7a14f570e2d17053f1e612f6e045df774916f1) Thanks [@jacobinu](https://github.com/jacobinu)! - fix: handle tree-shakeable angular client case

## 0.52.9

### Patch Changes

- [#948](https://github.com/hey-api/hey-api/pull/948) [`ebfd6ee`](https://github.com/hey-api/hey-api/commit/ebfd6eec434d7b84883a8f9058f31948fb1a40f2) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle schemas with generics from C#

- [#949](https://github.com/hey-api/hey-api/pull/949) [`16f8956`](https://github.com/hey-api/hey-api/commit/16f89566a7affeb09a6b928c43cfa2733e8b9adc) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: rename infinite key in query key to \_infinite

- [#946](https://github.com/hey-api/hey-api/pull/946) [`f873fa6`](https://github.com/hey-api/hey-api/commit/f873fa67befe60b2fd8f63bc2c8b73437591f686) Thanks [@mrlubos](https://github.com/mrlubos)! - chore: warn on duplicate operation ID

- [#947](https://github.com/hey-api/hey-api/pull/947) [`7f0fefe`](https://github.com/hey-api/hey-api/commit/7f0fefec92b25ce18ed0d1c6a6edf1adbc7d4481) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: correctly use parentheses around composed schemas

- [#944](https://github.com/hey-api/hey-api/pull/944) [`2f7cc89`](https://github.com/hey-api/hey-api/commit/2f7cc8986c0644b41cc6a5526ddf52ebff880c79) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: correctly handle integer type in additional properties

## 0.52.8

### Patch Changes

- [#932](https://github.com/hey-api/hey-api/pull/932) [`cdf01e8`](https://github.com/hey-api/hey-api/commit/cdf01e8cc0dc63213465b9e8fe33b80443d36f55) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: cherry pick keys in mutation page param type

## 0.52.7

### Patch Changes

- [#929](https://github.com/hey-api/hey-api/pull/929) [`b56c81c`](https://github.com/hey-api/hey-api/commit/b56c81ca67a2d069b33430c3139e2135a299b309) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle various issues with additionalProperties definitions

- [#927](https://github.com/hey-api/hey-api/pull/927) [`65f151d`](https://github.com/hey-api/hey-api/commit/65f151dc0004ce817bc370486495bdd281439e55) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: update TanStack Query key to contain base URL

- [#927](https://github.com/hey-api/hey-api/pull/927) [`65f151d`](https://github.com/hey-api/hey-api/commit/65f151dc0004ce817bc370486495bdd281439e55) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: change TanStack Query mutation helpers to functions for consistent API

## 0.52.6

### Patch Changes

- [#920](https://github.com/hey-api/hey-api/pull/920) [`4ff2404`](https://github.com/hey-api/hey-api/commit/4ff24049457b7d0d5333c3704f488f1f45dd0c5b) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: add preview version of TanStack Query plugin

## 0.52.5

### Patch Changes

- [#910](https://github.com/hey-api/hey-api/pull/910) [`428dcad`](https://github.com/hey-api/hey-api/commit/428dcad06eba3ab14876c28092a6df81fcde7dbe) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: throw if prerequisite checks are not met

- [#907](https://github.com/hey-api/hey-api/pull/907) [`a2a1ab8`](https://github.com/hey-api/hey-api/commit/a2a1ab8bd78c2cbbdcb7adb2ba3815250843dbe7) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: correctly transform string to pascalcase when referenced inside schema

- [#908](https://github.com/hey-api/hey-api/pull/908) [`225b640`](https://github.com/hey-api/hey-api/commit/225b640b5ac628cb7ba3b7afb39ff271a0608055) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: do not generate types tree by default if services are enabled as it is unused

## 0.52.4

### Patch Changes

- [#895](https://github.com/hey-api/hey-api/pull/895) [`44de8d8`](https://github.com/hey-api/hey-api/commit/44de8d89556b3abf48acc4e23c9b9c198059c757) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: define ThrowOnError generic as the last argument

## 0.52.3

### Patch Changes

- [#884](https://github.com/hey-api/hey-api/pull/884) [`62a39e6`](https://github.com/hey-api/hey-api/commit/62a39e63f645bce0801779fb6b90531401748e86) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: generate ThrowOnError generic for class-based client methods

## 0.52.2

### Patch Changes

- [#881](https://github.com/hey-api/hey-api/pull/881) [`a9ddfe6`](https://github.com/hey-api/hey-api/commit/a9ddfe6c4487fe5debd04a194ee6c6b6c611dc6b) Thanks [@hougesen](https://github.com/hougesen)! - fix: check if key is schema property before removing

## 0.52.1

### Patch Changes

- [#855](https://github.com/hey-api/hey-api/pull/855) [`7ac6274`](https://github.com/hey-api/hey-api/commit/7ac627463a15fa6be2c9d103b25200355df6b166) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: define multiple errors type as union instead of intersection

- [#853](https://github.com/hey-api/hey-api/pull/853) [`6ab387d`](https://github.com/hey-api/hey-api/commit/6ab387d3440ec5ec524e7f198aedfa6734431d76) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: remove Content-Type header with multipart/form-data content type

- [#861](https://github.com/hey-api/hey-api/pull/861) [`21ccf90`](https://github.com/hey-api/hey-api/commit/21ccf90b864590c211fbfa3de5c687dd3c48f897) Thanks [@qqilihq](https://github.com/qqilihq)! - fix: Additional properties key

- [#869](https://github.com/hey-api/hey-api/pull/869) [`42d8a41`](https://github.com/hey-api/hey-api/commit/42d8a4151bace7b70af60a1abe46b7550ddad686) Thanks [@SamuelGuillemet](https://github.com/SamuelGuillemet)! - fix: add conditionnal generation for service related types

## 0.52.0

### Minor Changes

- [#835](https://github.com/hey-api/hey-api/pull/835) [`7ab277b`](https://github.com/hey-api/hey-api/commit/7ab277b22467fe268719af817aee701d6be3e828) Thanks [@LeeChSien](https://github.com/LeeChSien)! - feat: add namespace supporting for enums

### Patch Changes

- [#830](https://github.com/hey-api/hey-api/pull/830) [`babf11a`](https://github.com/hey-api/hey-api/commit/babf11ae082af642ac71cfee9c523cc976132a50) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: generate internal client for services when using standalone package

## 0.51.0

### Minor Changes

- [#828](https://github.com/hey-api/hey-api/pull/828) [`82a4696`](https://github.com/hey-api/hey-api/commit/82a4696b0b209ea2d9147f47f213479e61aed3d7) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: make `client` config option required

### Patch Changes

- [#823](https://github.com/hey-api/hey-api/pull/823) [`23c9dcd`](https://github.com/hey-api/hey-api/commit/23c9dcd5de19de62d745cc539674c815b2588cd2) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: correctly process body parameter for OpenAPI 2.0 specs

- [#827](https://github.com/hey-api/hey-api/pull/827) [`8d81c06`](https://github.com/hey-api/hey-api/commit/8d81c0605dbf4b4d19ec1c2dc51a93f8a2aca5b2) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: do not ignore api-version param in standalone clients

## 0.50.2

### Patch Changes

- [#818](https://github.com/hey-api/hey-api/pull/818) [`85d123c`](https://github.com/hey-api/hey-api/commit/85d123c9160f4ecb4c48e8a2ead54abf604dd21b) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle fully illegal schema names

## 0.50.1

### Patch Changes

- [#807](https://github.com/hey-api/hey-api/pull/807) [`ef249ba`](https://github.com/hey-api/hey-api/commit/ef249ba5bd04dbfb0e0a497caaa021f9c7de6949) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: generate types only for filtered services

- [#807](https://github.com/hey-api/hey-api/pull/807) [`ef249ba`](https://github.com/hey-api/hey-api/commit/ef249ba5bd04dbfb0e0a497caaa021f9c7de6949) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: allow any key/value pair in object types with empty properties object

## 0.50.0

### Minor Changes

- [#790](https://github.com/hey-api/hey-api/pull/790) [`68c3921`](https://github.com/hey-api/hey-api/commit/68c3921fd6e9a5db41ebd9f06e4f3ef6e64ab051) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: allow bundling standalone clients with `client.bundle = true`

## 0.49.0

### Minor Changes

- [#787](https://github.com/hey-api/hey-api/pull/787) [`327c5fb`](https://github.com/hey-api/hey-api/commit/327c5fb629f0c7b9c727da87b6bc287b8e98bcd5) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: allow filtering service endpoints with `services.filter`

### Patch Changes

- [#784](https://github.com/hey-api/hey-api/pull/784) [`f12dccf`](https://github.com/hey-api/hey-api/commit/f12dccf0ae3a05badb5783354bcd093f18f3ab74) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: suffix illegal service names

- [#786](https://github.com/hey-api/hey-api/pull/786) [`20759e2`](https://github.com/hey-api/hey-api/commit/20759e2cc52d78974fc0f78f581e9d9cb2d21ca5) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle references to schemas with illegal names

- [#788](https://github.com/hey-api/hey-api/pull/788) [`ecd94f2`](https://github.com/hey-api/hey-api/commit/ecd94f2adab1dbe10e7a9c310d1fb6d1f170d332) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle application/x-www-form-urlencoded content in request body

## 0.48.3

### Patch Changes

- [#781](https://github.com/hey-api/hey-api/pull/781) [`df3b799`](https://github.com/hey-api/hey-api/commit/df3b79996d47a69e4f2fdad93cea18ae1a01c419) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: use methodNameBuilder when asClass is false

- [#782](https://github.com/hey-api/hey-api/pull/782) [`edfd2bd`](https://github.com/hey-api/hey-api/commit/edfd2bdbb64f6682ded16f6da30f88f1c113bbe0) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: allow not generating types tree with types.tree = false

## 0.48.2

### Patch Changes

- [#746](https://github.com/hey-api/hey-api/pull/746) [`0448823`](https://github.com/hey-api/hey-api/commit/044882399d56d1532c7125df2e69cfb3b5fb4f34) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle formData parameters in generated types

- [#742](https://github.com/hey-api/hey-api/pull/742) [`efc30f4`](https://github.com/hey-api/hey-api/commit/efc30f4a2327b165b62f8467c68351a8bf94ffe5) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: ignore services.asClass setting for named clients

- [#744](https://github.com/hey-api/hey-api/pull/744) [`1e9edde`](https://github.com/hey-api/hey-api/commit/1e9edde54abd8978405f91b821c99b97f067d566) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: improve default response type detection

- [#745](https://github.com/hey-api/hey-api/pull/745) [`342772a`](https://github.com/hey-api/hey-api/commit/342772a560378c6718d25c29871eeab9a72c62a6) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle properties in one-of composition

## 0.48.1

### Patch Changes

- [#734](https://github.com/hey-api/hey-api/pull/734) [`1f52b26`](https://github.com/hey-api/hey-api/commit/1f52b260807531edb2c14003473ea4907007ecdb) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: generate service types when types are enabled, even if services are disabled

- [#737](https://github.com/hey-api/hey-api/pull/737) [`0537fe8`](https://github.com/hey-api/hey-api/commit/0537fe8682a93cc95d7637d643db4b9780318ea1) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: support custom config file path

- [#736](https://github.com/hey-api/hey-api/pull/736) [`8410046`](https://github.com/hey-api/hey-api/commit/8410046c45d25db48ba940a0c6c7a7cda9e86b6a) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle async response transformers

## 0.48.0

### Minor Changes

- [#696](https://github.com/hey-api/hey-api/pull/696) [`917405f`](https://github.com/hey-api/hey-api/commit/917405fcdcb2e978df693eb51720afa6fcf914e2) Thanks [@anchan828](https://github.com/anchan828)! - feat: pass the Operation object to methodNameBuilder

### Patch Changes

- [#708](https://github.com/hey-api/hey-api/pull/708) [`36cf95d`](https://github.com/hey-api/hey-api/commit/36cf95d319b175149d3b3ecc382b8d739186e658) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: make getHeaders() accept generic

- [#712](https://github.com/hey-api/hey-api/pull/712) [`6a5b96b`](https://github.com/hey-api/hey-api/commit/6a5b96b59e4248f2acaf5422be262edde97427dd) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle void responses in transformers

## 0.47.2

### Patch Changes

- [#701](https://github.com/hey-api/hey-api/pull/701) [`1081bbf`](https://github.com/hey-api/hey-api/commit/1081bbf5082450c18547dac4737ecc0e312cdd0e) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: add initial implementation of prefixItems

## 0.47.1

### Patch Changes

- [#690](https://github.com/hey-api/hey-api/pull/690) [`1017ace`](https://github.com/hey-api/hey-api/commit/1017acee80630d84a08bd8f0087c8fb0de270f1a) Thanks [@Nick-Lucas](https://github.com/Nick-Lucas)! - Fix an issue where transforms for endpoints with array returns were not generated correctly

## 0.47.0

### Minor Changes

- [#685](https://github.com/hey-api/hey-api/pull/685) [`8ca3e5e`](https://github.com/hey-api/hey-api/commit/8ca3e5e2990bc07ce0bac902245d08b67b6621e8) Thanks [@mrlubos](https://github.com/mrlubos)! - feat: add initial support for response transformers (string -> Date)

- [#663](https://github.com/hey-api/hey-api/pull/663) [`e01c612`](https://github.com/hey-api/hey-api/commit/e01c61213e266afad5e3b159682b05957aac6534) Thanks [@Stono](https://github.com/Stono)! - Add support for customizing method names with `services.methodNameBuilder()`

## 0.46.3

### Patch Changes

- [#594](https://github.com/hey-api/hey-api/pull/594) [`9878381`](https://github.com/hey-api/hey-api/commit/98783811e0c90705ddac2cc5e54c524aae634865) Thanks [@SimenB](https://github.com/SimenB)! - Add explicit type annotations to `Interceptors`

  This allows the generated code to work with TypeScript 5.5's new `isolatedDeclarations` configuration.

- [#635](https://github.com/hey-api/hey-api/pull/635) [`0b09940`](https://github.com/hey-api/hey-api/commit/0b0994050dbcb6c17e8b78ca1c77738fc8e0d498) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: handle 1XX response status codes

- [#636](https://github.com/hey-api/hey-api/pull/636) [`498f459`](https://github.com/hey-api/hey-api/commit/498f45979b91bf93b319413c60492af94a08df48) Thanks [@mrlubos](https://github.com/mrlubos)! - fix: improve default response status code classification

## 0.46.2

### Patch Changes

- fix: do not transform property names for standalone clients ([#616](https://github.com/hey-api/hey-api/pull/616))

## 0.46.1

### Patch Changes

- fix: handle application/json content type in parameter definitions ([#614](https://github.com/hey-api/hey-api/pull/614))

## 0.46.0

### Minor Changes

- feat: tree-shakeable services ([#602](https://github.com/hey-api/hey-api/pull/602))

## 0.45.1

### Patch Changes

- fix: use generated types in request object instead of inlined duplicated params ([#582](https://github.com/hey-api/hey-api/pull/582))

## 0.45.0

### Minor Changes

- feat: remove client inference ([#569](https://github.com/hey-api/hey-api/pull/569))

### Patch Changes

- fix: deduplicate inlined enums ([#573](https://github.com/hey-api/hey-api/pull/573))

- fix: generate correct optional key in types when using positional arguments (useOptions: false) ([#572](https://github.com/hey-api/hey-api/pull/572))

## 0.44.0

### Minor Changes

- feat: move format and lint config options to output object ([#546](https://github.com/hey-api/hey-api/pull/546))

### Patch Changes

- fix: comment position in JavaScript enums ([#544](https://github.com/hey-api/hey-api/pull/544))

- fix: export inlined enums from components ([#563](https://github.com/hey-api/hey-api/pull/563))

- fix: remove unused enums option from CLI ([#565](https://github.com/hey-api/hey-api/pull/565))

- fix: Support typescript in peerDependencies ([#551](https://github.com/hey-api/hey-api/pull/551))

## 0.43.2

### Patch Changes

- fix: deduplicate exported data and response types ([#538](https://github.com/hey-api/hey-api/pull/538))

## 0.43.1

### Patch Changes

- fix: use optional chaining in bin catch block ([#528](https://github.com/hey-api/hey-api/pull/528))

- fix: broken encoding ([#532](https://github.com/hey-api/hey-api/pull/532))

- fix(parser): handle type array ([#533](https://github.com/hey-api/hey-api/pull/533))

## 0.43.0

### Minor Changes

- feat: remove enum postfix, use typescript enums in types when generated, export enums from types.gen.ts ([#498](https://github.com/hey-api/hey-api/pull/498))

### Patch Changes

- fix: negative numbers in numeric enums ([#470](https://github.com/hey-api/hey-api/pull/470))

- fix: escape keys in schemas starting with digit but containing non-digit characters ([#502](https://github.com/hey-api/hey-api/pull/502))

- fix: issue causing code to not generate (t.filter is not a function) ([#507](https://github.com/hey-api/hey-api/pull/507))

- fix: handle additional properties union ([#499](https://github.com/hey-api/hey-api/pull/499))

- fix: do not export inline enums ([#508](https://github.com/hey-api/hey-api/pull/508))

- fix: prefix parameter type exports to avoid conflicts ([#501](https://github.com/hey-api/hey-api/pull/501))

- fix: export operation data and response types ([#500](https://github.com/hey-api/hey-api/pull/500))

- fix: handle cases where packages are installed globally ([#471](https://github.com/hey-api/hey-api/pull/471))

- fix: handle cases where package.json does not exist ([#471](https://github.com/hey-api/hey-api/pull/471))

## 0.42.1

### Patch Changes

- fix: properly set formData and body when using options ([#461](https://github.com/hey-api/hey-api/pull/461))

## 0.42.0

### Minor Changes

- change: config option `lint: true` has changed to `lint: 'eslint'` ([#455](https://github.com/hey-api/hey-api/pull/455))

- change: disable formatting with prettier by default ([#457](https://github.com/hey-api/hey-api/pull/457))

- feat: add support for biomejs as a formatter ([#455](https://github.com/hey-api/hey-api/pull/455))

- feat: move operationId config option to services object ([#441](https://github.com/hey-api/hey-api/pull/441))

- feat: add operation error type mappings ([#442](https://github.com/hey-api/hey-api/pull/442))

- feat: add support for biomejs as a linter ([#455](https://github.com/hey-api/hey-api/pull/455))

- change: config option `format: true` has changed to `format: 'prettier'` ([#455](https://github.com/hey-api/hey-api/pull/455))

### Patch Changes

- fix: do not destructure data when using use options ([#450](https://github.com/hey-api/hey-api/pull/450))

- feat: automatically handle dates in query string ([#443](https://github.com/hey-api/hey-api/pull/443))

- fix: only remove core directory when export core is true ([#449](https://github.com/hey-api/hey-api/pull/449))

- fix: add jsdoc comments with use options ([#439](https://github.com/hey-api/hey-api/pull/439))

## 0.41.0

### Minor Changes

- feat: add form type option for schemas ([#433](https://github.com/hey-api/hey-api/pull/433))

- feat: replace useDateType with option in types object ([#435](https://github.com/hey-api/hey-api/pull/435))

- feat: replace serviceResponse with option in services object ([#434](https://github.com/hey-api/hey-api/pull/434))

- feat: replace postfixServices with configuration object ([#430](https://github.com/hey-api/hey-api/pull/430))

### Patch Changes

- fix: properly escape backticks in template literals ([#431](https://github.com/hey-api/hey-api/pull/431))

- fix: transform names of referenced types ([#422](https://github.com/hey-api/hey-api/pull/422))

- fix: use config interceptors passed to constructor when using named client ([#432](https://github.com/hey-api/hey-api/pull/432))

- fix: properly escape expressions in template literals ([#431](https://github.com/hey-api/hey-api/pull/431))

- fix: do not export common properties as schemas ([#424](https://github.com/hey-api/hey-api/pull/424))

## 0.40.2

### Patch Changes

- fix: unhandled SyntaxKind unknown when specification has numeric enums ([#417](https://github.com/hey-api/hey-api/pull/417))

## 0.40.1

### Patch Changes

- fix: revert to generating commonjs for esm and commonjs support ([#409](https://github.com/hey-api/hey-api/pull/409))

## 0.40.0

### Minor Changes

- feat: allow choosing naming convention for types ([#402](https://github.com/hey-api/hey-api/pull/402))

### Patch Changes

- fix: rename exportModels to types ([#402](https://github.com/hey-api/hey-api/pull/402))

- fix: rename models.gen.ts to types.gen.ts ([#399](https://github.com/hey-api/hey-api/pull/399))

- fix: export enums from index.ts ([#399](https://github.com/hey-api/hey-api/pull/399))

## 0.39.0

### Minor Changes

- feat: rename generated files ([#363](https://github.com/hey-api/hey-api/pull/363))

- feat: add JSON-LD to content parsing ([#390](https://github.com/hey-api/hey-api/pull/390))

- fix: generate enums into their own file ([#358](https://github.com/hey-api/hey-api/pull/358))

### Patch Changes

- fix: remove file if no contents to write to it ([#373](https://github.com/hey-api/hey-api/pull/373))

- fix: eslint properly fixes output ([#375](https://github.com/hey-api/hey-api/pull/375))

- fix: invalid typescript Record generated with circular dependencies ([#374](https://github.com/hey-api/hey-api/pull/374))

- fix: prefer unknown type over any ([#392](https://github.com/hey-api/hey-api/pull/392))

- fix: only delete generated files instead of whole output directory ([#362](https://github.com/hey-api/hey-api/pull/362))

- fix: handle decoding models with `%` in description ([#360](https://github.com/hey-api/hey-api/pull/360))

- fix: throw error when typescript is missing ([#366](https://github.com/hey-api/hey-api/pull/366))

## 0.38.1

### Patch Changes

- fix: inconsistent indentation in models file when not using `format: true` ([#349](https://github.com/hey-api/hey-api/pull/349))

- fix: output path no longer required to be within cwd ([#353](https://github.com/hey-api/hey-api/pull/353))

## 0.38.0

### Minor Changes

- fix: rename write to dryRun and invert value ([#326](https://github.com/hey-api/hey-api/pull/326))

### Patch Changes

- fix: generate constant size array types properly ([#345](https://github.com/hey-api/hey-api/pull/345))

- fix: support x-enumNames for custom enum names ([#334](https://github.com/hey-api/hey-api/pull/334))

- fix: export service types from single namespace ([#341](https://github.com/hey-api/hey-api/pull/341))

- fix: generate models with proper indentation when formatting is false ([#340](https://github.com/hey-api/hey-api/pull/340))

- fix: log errors to file ([#329](https://github.com/hey-api/hey-api/pull/329))

- fix: cleanup some styling issues when generating client without formatting ([#330](https://github.com/hey-api/hey-api/pull/330))

## 0.37.3

### Patch Changes

- fix: do not ignore additionalProperties when object with properties object ([#323](https://github.com/hey-api/hey-api/pull/323))

## 0.37.2

### Patch Changes

- fix: escape schema names ([#317](https://github.com/hey-api/hey-api/pull/317))

- fix: escape backticks in strings starting with backtick ([#315](https://github.com/hey-api/hey-api/pull/315))

## 0.37.1

### Patch Changes

- fix: ensure strings with both single/double quotes and backticks are escaped properly ([#310](https://github.com/hey-api/hey-api/pull/310)) ([#310](https://github.com/hey-api/hey-api/pull/310))

## 0.37.0

### Minor Changes

- remove: `generics` as valid option for serviceResponse ([#299](https://github.com/hey-api/hey-api/pull/299))

### Patch Changes

- fix: escape dollar sign in operation names ([#307](https://github.com/hey-api/hey-api/pull/307))

## 0.36.2

### Patch Changes

- fix: move service types into models file ([#292](https://github.com/hey-api/hey-api/pull/292))

## 0.36.1

### Patch Changes

- fix: do not throw when failing to decode URI ([#296](https://github.com/hey-api/hey-api/pull/296))

## 0.36.0

### Minor Changes

- feat: export schemas directly from OpenAPI specification (ie. support exporting JSON schemas draft 2020-12 ([#285](https://github.com/hey-api/hey-api/pull/285))

### Patch Changes

- fix(config): rename exportSchemas to schemas ([#288](https://github.com/hey-api/hey-api/pull/288))

## 0.35.0

### Minor Changes

- fix(config): remove postfixModels option ([#266](https://github.com/hey-api/hey-api/pull/266))

- fix(client): do not send default params ([#267](https://github.com/hey-api/hey-api/pull/267))

### Patch Changes

- fix(api): use TypeScript Compiler API to create schemas ([#271](https://github.com/hey-api/hey-api/pull/271))

- fix(client): export APIResult when using serviceResponse as 'response' ([#283](https://github.com/hey-api/hey-api/pull/283))

- fix(parser): use only isRequired to determine if field is required ([#264](https://github.com/hey-api/hey-api/pull/264))

## 0.34.5

### Patch Changes

- fix(client): access service data type in namespace properly ([#258](https://github.com/hey-api/hey-api/pull/258))

## 0.34.4

### Patch Changes

- fix(client): namespace service data types ([#246](https://github.com/hey-api/hey-api/pull/246))

## 0.34.3

### Patch Changes

- fix(docs): link to docs hosted on vercel ([#244](https://github.com/hey-api/hey-api/pull/244))

## 0.34.2

### Patch Changes

- docs(readme): update broken contributing link ([#236](https://github.com/hey-api/hey-api/pull/236))

- fix(config): support ts config files and `defineConfig` syntax ([`0c92222ab74bb7d2391d49587760db9ea9228d5a`](https://github.com/hey-api/hey-api/commit/0c92222ab74bb7d2391d49587760db9ea9228d5a))

## 0.34.1

### Patch Changes

- fix(docs): ensure README is shown on NPMJS ([#229](https://github.com/hey-api/hey-api/pull/229))

## 0.34.0

### Minor Changes

- feat(client): generate all services in single `services.ts` file ([#215](https://github.com/hey-api/hey-api/pull/215))

- feat(schema): add support for default values ([#197](https://github.com/hey-api/hey-api/pull/197))

- feat(schema): add array of enum values for enums ([#197](https://github.com/hey-api/hey-api/pull/197))

### Patch Changes

- fix(axios): use builtin form data to ensure blob form data works in node environment ([#211](https://github.com/hey-api/hey-api/pull/211))

- fix(enum): append index number on duplicate name ([#220](https://github.com/hey-api/hey-api/pull/220))

## 0.33.2

### Patch Changes

- fix(axios): properly type content-type headers assignment ([#206](https://github.com/hey-api/hey-api/pull/206))

## 0.33.1

### Patch Changes

- fix(axios): set content type to multipart/form-data when using form data ([#204](https://github.com/hey-api/hey-api/pull/204))

## 0.33.0

### Minor Changes

- feat(fetch): detect form data repsonses properly ([#195](https://github.com/hey-api/hey-api/pull/195))

- feat(fetch): add application/octet-stream, application/pdf, and application/zip as binary response types ([#195](https://github.com/hey-api/hey-api/pull/195))

### Patch Changes

- fix(client): do not create or export empty files ([#200](https://github.com/hey-api/hey-api/pull/200))

- client(angular/fetch/xhr): detect all application/json or +json as JSON ([#195](https://github.com/hey-api/hey-api/pull/195))

## 0.32.1

### Patch Changes

- fix(schema): allow minimums/maximums to be 0 ([#194](https://github.com/hey-api/hey-api/pull/194))

- fix(axios): let axios handle serializing form data ([#192](https://github.com/hey-api/hey-api/pull/192))

## 0.32.0

### Minor Changes

- Support all HTTP error codes ([#188](https://github.com/hey-api/hey-api/pull/188))

- Use File or Blob type for binary types ([#186](https://github.com/hey-api/hey-api/pull/186))

- Check value instanceof Blob when using isBlob ([#186](https://github.com/hey-api/hey-api/pull/186))

### Patch Changes

- fix(cli): properly handle booleans ([#190](https://github.com/hey-api/hey-api/pull/190))

- Attempt to use body type as content type when sending Blob in node client ([#185](https://github.com/hey-api/hey-api/pull/185))

- fix(api): add experimental flag ([#191](https://github.com/hey-api/hey-api/pull/191))

## 0.31.1

### Patch Changes

- merge enums and useLegacyEnums into one option ([#178](https://github.com/hey-api/hey-api/pull/178))

- use FormData from node-fetch in node client ([#173](https://github.com/hey-api/hey-api/pull/173))

## 0.31.0

### Minor Changes

- Import all required models for a service in one import ([#172](https://github.com/hey-api/hey-api/pull/172))

- generate all models in single `models.ts` file ([#168](https://github.com/hey-api/hey-api/pull/168))

- generate all schemas in single `schemas.ts` file ([#168](https://github.com/hey-api/hey-api/pull/168))

### Patch Changes

- fix async response interceptors when using angular client ([#167](https://github.com/hey-api/hey-api/pull/167))

- fix deprecation warning on `throwError` in Angular client ([#167](https://github.com/hey-api/hey-api/pull/167))

- Do not create or export CancelablePromise when using Angular client ([#167](https://github.com/hey-api/hey-api/pull/167))

- Fix issue causing type error when targeting lower than ES2015 ([#171](https://github.com/hey-api/hey-api/pull/171))

- fix various warnings in generated client code ([#164](https://github.com/hey-api/hey-api/pull/164))

- fix providing interceptors in Angular client ([#167](https://github.com/hey-api/hey-api/pull/167))

## 0.30.0

### Minor Changes

- add support for interceptors ([#153](https://github.com/hey-api/hey-api/pull/153))

## 0.29.2

### Patch Changes

- Fix export types as type only when using useLegacyEnums ([#160](https://github.com/hey-api/hey-api/pull/160))

## 0.29.1

### Patch Changes

- Properly export enums when using useLegacyEnums ([#158](https://github.com/hey-api/hey-api/pull/158))

## 0.29.0

### Minor Changes

- Add useLegacyEnums options to generate TypeScript enums ([#147](https://github.com/hey-api/hey-api/pull/147))

## 0.28.0

### Minor Changes

- Add `index.ts` file to models, schemas, and services ([#137](https://github.com/hey-api/hey-api/pull/137))

## 0.27.39

### Patch Changes

- Warn users about missing dependencies used in the generated client ([#124](https://github.com/hey-api/hey-api/pull/124))

- Use AbortController in Axios client instead of deprecated CancelToken ([#124](https://github.com/hey-api/hey-api/pull/124))

## 0.27.38

### Minor Changes

- Make useOptions default to true

## 0.27.37

### Minor Changes

- Fix import error in generated Node client

- Update package dependencies

- Use engine-strict in .npmrc

## 0.27.36

### Minor Changes

- Handle falsy values in header

- Export schemas by default

## 0.27.35

### Minor Changes

- Update all project dependencies

- Discard only null or undefined in query string

## 0.27.34

### Minor Changes

- Add flag for linting generated code (default: false)

- Add flag for formatting generated code (default: true)

## 0.27.33

### Minor Changes

- Auto format with Eslint if available

- Add types for programmatic API

## 0.27.32

### Minor Changes

- Rename Config type to UserConfig

- Pass arguments in correct order in Angular client

## 0.27.31

### Minor Changes

- Add support for openapi-ts.config.js file

- Use built-in flat map

## 0.27.30

### Minor Changes

- Prefer unknown instead of any in generated client

## 0.27.29

### Minor Changes

- Rename openapi command to openapi-ts

- Add basic support for response that are Blobs

## 0.27.28

### Minor Changes

- Generate enums as JavaScript objects

- Use shorthand object properties in service calls

## 0.27.27

### Minor Changes

- Handle cases where a project does not have dependencies when checking to run Prettier

## 0.27.26

### Minor Changes

- Skip global parameters if they are duplicates of path parameters

- remove option to indent code

## 0.27.25

### Minor Changes

- Correctly set content-type header, even when body is falsy

## 0.27.24

### Minor Changes

- Remove union types flag (this is now default)

## 0.27.23

### Minor Changes

- Support printing exact arrays

## 0.27.22

### Minor Changes

- Add option to specify custom base path

- Fix spacing in cancelable promise

## 0.27.21

### Minor Changes

- Add explicit flags for generics

## 0.27.20

### Minor Changes

- Do not require type to be set for object properties

## 0.27.19

### Minor Changes

- Do not insert generics into custom client

## 0.27.18

### Minor Changes

- Support returning raw result object

- Allow passing config

## 0.27.17

### Minor Changes

- Generate nullable interface when isNullable is true

## 0.27.16

### Minor Changes

- Generate types for services when useOptions is true

## 0.27.15

### Minor Changes

- Fix wrong path on Windows

## 0.27.14

### Minor Changes

- Change imports to match project style

## 0.27.13

### Minor Changes

- Support printing Date instead of string for date-time formats in models

## 0.27.12

### Minor Changes

- Escape enum name when exported

## 0.27.11

### Minor Changes

- Fix typo in template header

## 0.27.10

### Minor Changes

- Escape newlines when outputting pattern string value in schemas

## 0.27.9

### Minor Changes

- Start passing options object instead of positional parameters

- Handle composition of any-of and properties

- Allow ignoring operation ID when generating operation names

- Propagate useVersionId to Swagger V2 parser

- Change --ingoreOperationId to --useOperationId

## 0.27.8

### Minor Changes

- Support non-ascii (unicode) characters in service name, operation name, and parameter name

## 0.27.7

### Minor Changes

- Bump dependencies

## 0.27.6

### Minor Changes

- Allow overriding request body name with x-body-name key

## 0.27.5

### Minor Changes

- Type additional properties with properties

- Parse array items only if parent definition has type

## 0.27.4

### Minor Changes

- Bump dependencies

## 0.27.3

### Minor Changes

- Support autoformat option flag

- Handle more cases of any-of

- Support regexp to select models to export

- Return optional success response on 204 status code

- Fix nested any-of

- Add const support

## 0.27.0

### Minor Changes

- Reverted `@apidevtools/json-schema-ref-parser` to version 10.1.0

## 0.26.0

### Minor Changes

- Upgraded dependencies

## 0.25.0

### Minor Changes

- Upgraded dependencies
- Allow usage of a custom axios instance
- Added message in generated files

## 0.24.0

### Minor Changes

- Upgraded dependencies
- Fixed issue with Cancelable promise
- Fixed issue with escaping reserved keywords in schema names
- Added `--postfixModels` option

## 0.23.0

### Minor Changes

- Upgraded dependencies
- Added blank line at the end of generated files
- Added support for Node.js v12
- Added `request` property inside `ApiError`
- Added support for `@depricated` inside models and operations

## 0.22.0

### Minor Changes

- Upgraded dependencies
- Fixed issue with `null` value inside comments for OpenAPI v2 enums
- Fixed issue with compatibility for latest version of Axios (0.27.x)
- Removed deprecated enum model generation

## 0.21.0

### Minor Changes

- Return `undefined` to match `noImplicitReturns` rule
- Made `BaseHttpRequest` class abstract
- Removed private fields using `#` inside `CancelablePromise`
- Removed unneeded import `AbortController` from `node-fetch` client
- Filter out wrong enum values

## 0.20.1

### Patch Changes

- Support enums with single quotes in names for V2

## 0.20.0

### Minor Changes

- Updated dependencies
- Support enums with single quotes in names for V3
- Generating better names when `operationId` is not given (breaking change)
- Fixed issue where `x-enum` flags where breaking due to non-string values

## 0.19.0

### Minor Changes

- Support for Angular client with `--name` option
- Added test cases for Angular client

## 0.18.2

### Patch Changes

- Updated dependencies
- Fixed type definition
- Added test cases for CLI commands
- Added test cases for query parsing

## 0.18.1

### Patch Changes

- Escaping error description
- Made `Client.request` and `BaseHttpRequest.config` props public

## 0.18.0

### Minor Changes

- Angular client generation!
- Updated documentation with more examples and better descriptions

## 0.17.0

### Minor Changes

- Shorthand notation for properties passed through constructor
- Simplified creation of headers
- Prepare codebase for Angular client

## 0.16.2

### Patch Changes

- Removed dependency on `URLSearchParams` to support browser and node without any additional imports

## 0.16.1

### Patch Changes

- Correct export inside `index.ts` when giving a custom name

## 0.16.0

### Minor Changes

- Added option to set the indentation (spaces and tabs)
- Added option to export separate client file that allows usage for multiple backends
- Decoupled OpenAPI object from requests
- Updated dependencies

## 0.15.0

### Minor Changes

- Added change log and releases on GitHub

## 0.14.0

### Minor Changes

- Added missing `postfix` options to typedef
- Updated escaping of comments and descriptions
- Better handling of services without tags
- Updated dependencies
