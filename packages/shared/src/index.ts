export { isEnvironment, printCliIntro } from './cli';
export { checkNodeVersion } from './config/engine';
export { getInput } from './config/input/input';
export { compileInputPath, logInputPaths } from './config/input/path';
export type { Input, UserInput, UserWatch, Watch } from './config/input/types';
export { getLogs } from './config/logs';
export type { PostProcessor, UserPostProcessor } from './config/output/postprocess';
export { postprocessOutput } from './config/output/postprocess';
export { sourceConfig } from './config/output/source/config';
export type { SourceConfig, UserSourceConfig } from './config/output/source/types';
export type { OutputHeader } from './config/output/types';
export { defaultPaginationKeywords, getParser } from './config/parser/config';
export type { Filters } from './config/parser/filters';
export type { Patch } from './config/parser/patch';
export type { Parser, UserParser } from './config/parser/types';
export type { Preset, PresetPlugin } from './config/presets';
export type {
  AnyConfig,
  BaseConfig,
  BaseOutput,
  BaseUserConfig,
  BaseUserOutput,
  CommentsOption,
  FeatureToggle,
  IndexExportOption,
  NamingOptions,
  ResolveModuleFn,
  UserCommentsOption,
  UserIndexExportOption,
} from './config/shared';
export type { Dependency } from './config/utils/dependencies';
export { dependencyFactory, normalizeFull, satisfies } from './config/utils/dependencies';
export { debugTools } from './debug';
export {
  ConfigError,
  ConfigValidationError,
  getInputError,
  HeyApiError,
  InputError,
  JobError,
  logCrashReport,
  openGitHubIssueWithCrashReport,
  printCrashReport,
  shouldReportCrash,
} from './error';
export { ensureDirSync } from './fs';
export { getSpec } from './getSpec';
export { Context } from './ir/context';
export { IntentContext } from './ir/intents';
export {
  createOperationKey,
  hasOperationDataRequired,
  operationPagination,
  operationResponsesMap,
  statusCodeToGroup,
} from './ir/operation';
export {
  hasParameterGroupObjectRequired,
  hasParametersObjectRequired,
  parameterWithPagination,
} from './ir/parameter';
export { deduplicateSchema } from './ir/schema';
export type {
  SchemaExtractor,
  SchemaProcessor,
  SchemaProcessorContext,
  SchemaProcessorResult,
} from './ir/schema-processor';
export { createSchemaProcessor } from './ir/schema-processor';
export type { SchemaVisitor, SchemaVisitorContext, Walker } from './ir/schema-walker';
export { childContext, createSchemaWalker } from './ir/schema-walker';
export type {
  IR,
  IRModel,
  IROperationObject,
  IRParameterObject,
  IRParametersObject,
  IRSchemaObject,
  IRServerObject,
} from './ir/types';
export { addItemsToSchema } from './ir/utils';
export type { Coercer } from './normalize/coerce';
export { coerce, COERCER, isCoercer } from './normalize/coerce';
export type { ConfigNormalizer, ConfigTable } from './normalize/config';
export { defineConfig } from './normalize/config';
export type { CoercerMap, TableDirectives, WithCoercers } from './normalize/value';
export { collectDeps } from './normalize/value';
export { parseOpenApiSpec } from './openApi';
export { parseV2_0_X } from './openApi/2.0.x';
export { parseV3_0_X } from './openApi/3.0.x';
export { parseV3_1_X } from './openApi/3.1.x';
export type { OperationsStrategy } from './openApi/shared/locations';
export type { OperationPathStrategy, OperationStructureStrategy } from './openApi/shared/locations';
export { OperationPath, OperationStrategy } from './openApi/shared/locations';
export type {
  DiscriminatedUnionData,
  DiscriminatedUnionMember,
  DiscriminatorPropertyType,
} from './openApi/shared/utils/discriminator';
export {
  buildDiscriminatedUnion,
  convertDiscriminatorValue,
  discriminatorValues,
} from './openApi/shared/utils/discriminator';
export { buildGraph } from './openApi/shared/utils/graph';
export { patchOpenApiSpec } from './openApi/shared/utils/patch';
export type {
  OpenApi,
  OpenApiMetaObject,
  OpenApiOperationObject,
  OpenApiParameterObject,
  OpenApiRequestBodyObject,
  OpenApiResponseObject,
  OpenApiSchemaObject,
} from './openApi/types';
export type { GetNameContext, Hooks } from './parser/hooks';
export type { PluginResolutionInput, PluginResolutionResult } from './plugins/config';
export { definePluginConfig, resolvePlugins } from './plugins/config';
export { pluginHelper } from './plugins/helper';
export type { SchemaWithType } from './plugins/shared/types/schema';
export { PluginInstance } from './plugins/shared/utils/instance';
export { buildSymbolIn } from './plugins/symbol';
export type {
  AnyPluginName,
  DefinePlugin,
  Plugin,
  PluginConfigMap,
  PluginContext,
  PluginImports,
  PluginNames,
  PluginTag,
} from './plugins/types';
export type {
  DefaultRequestValidatorLayers,
  DefaultValidatorLayers,
  RequestSchemaContext,
  RequestValidatorLayer,
  RequestValidatorLayers,
  ResolvedRequestValidatorLayer,
  ValidatorLayers,
} from './plugins/validator';
export { requestValidatorLayers, resolveValidatorLayer } from './plugins/validator';
export { findPackageJson, findTsConfigPath, loadPackageJson } from './tsConfig';
export type { LogLevel, Logs } from './types/logs';
export type { WatchValues } from './types/watch';
export { escapeComment } from './utils/escape';
export { utils } from './utils/exports';
export { outputHeaderToPrefix } from './utils/header';
export { inputToApiRegistry } from './utils/input';
export { heyApiRegistryBaseUrl } from './utils/input/heyApi';
export { MinHeap } from './utils/minHeap';
export { applyNaming, resolveNaming, toCase } from './utils/naming/naming';
export type { Casing, NameTransformer, NamingConfig, NamingRule } from './utils/naming/types';
export { deepMerge, isPlainObject } from './utils/object';
export { pathToName } from './utils/path';
export {
  encodeJsonPointerSegment,
  isTopLevelComponent,
  jsonPointerToPath,
  normalizeJsonPointer,
  pathToJsonPointer,
  refToName,
  resolveRef,
} from './utils/ref';
export type { EventHooks, PluginInstanceTypes, ResolvedNode } from './utils/symbols';
export { SymbolFactory } from './utils/symbols';
export { getBaseUrl, parseUrl } from './utils/url';
