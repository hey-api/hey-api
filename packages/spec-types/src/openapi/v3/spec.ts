import type { CodeSampleObject } from '../../extensions/code-samples';
import type { EnumExtensions } from '../../extensions/enum';
import type { SpecExtensions } from '../../extensions/spec';

/**
 * This is the root object of the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#openapi-description OpenAPI Description}.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 */
export interface Document extends SpecExtensions {
  /**
   * An element to hold various Objects for the OpenAPI Description.
   */
  components?: ComponentsObject;
  /**
   * Additional external documentation.
   */
  externalDocs?: ExternalDocumentationObject;
  /**
   * **REQUIRED**. Provides metadata about the API. The metadata MAY be used by tooling as required.
   */
  info: InfoObject;
  /**
   * **REQUIRED**. This string MUST be the {@link https://semver.org/spec/v2.0.0.html semantic version number} of the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#versions OpenAPI Specification version} that the OpenAPI document uses. The `openapi` field SHOULD be used by tooling specifications and clients to interpret the OpenAPI document. This is _not_ related to the API {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#infoVersion `info.version`} string.
   */
  openapi: '3.0.0' | '3.0.1' | '3.0.2' | '3.0.3' | '3.0.4';
  /**
   * **REQUIRED**. The available paths and operations for the API.
   */
  paths: PathsObject;
  /**
   * A declaration of which security mechanisms can be used across the API. The list of values includes alternative Security Requirement Objects that can be used. Only one of the Security Requirement Objects need to be satisfied to authorize a request. Individual operations can override this definition. The list can be incomplete, up to being empty or absent. To make security explicitly optional, an empty security requirement (`{}`) can be included in the array.
   */
  security?: Array<SecurityRequirementObject>;
  /**
   * An array of Server Objects, which provide connectivity information to a target server. If the `servers` field is not provided, or is an empty array, the default value would be a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#server-object Server Object} with a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#server-url url} value of `/`.
   */
  servers?: Array<ServerObject>;
  /**
   * A list of tags used by the OpenAPI Description with additional metadata. The order of the tags can be used to reflect on their order by the parsing tools. Not all tags that are used by the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#operation-object Operation Object} must be declared. The tags that are not declared MAY be organized randomly or based on the tools' logic. Each tag name in the list MUST be unique.
   */
  tags?: Array<TagObject>;
}

/**
 * A map of possible out-of band callbacks related to the parent operation. Each value in the map is a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#path-item-object Path Item Object} that describes a set of requests that may be initiated by the API provider and the expected responses. The key value used to identify the Path Item Object is an expression, evaluated at runtime, that identifies a URL to use for the callback operation.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * TODO: examples
 */
export interface CallbackObject extends SpecExtensions {
  /**
   * A Path Item Object used to define a callback request and expected responses. A {@link https://learn.openapis.org/examples/v3.0/callback-example.html complete example} is available.
   */
  [expression: string]: PathItemObject | ReferenceObject | unknown;
}

/**
 * Holds a set of reusable objects for different aspects of the OAS. All objects defined within the Components Object will have no effect on the API unless they are explicitly referenced from outside the Components Object.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * All the fixed fields declared above are objects that MUST use keys that match the regular expression: `^[a-zA-Z0-9\.\-_]+$`.
 *
 * TODO: examples
 */
export interface ComponentsObject extends SpecExtensions {
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#callback-object Callback Objects}.
   */
  callbacks?: Record<string, CallbackObject | ReferenceObject>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#example-object Example Objects}.
   */
  examples?: Record<string, ExampleObject | ReferenceObject>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#header-object Header Objects}.
   */
  headers?: Record<string, HeaderObject | ReferenceObject>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#link-object Link Objects}.
   */
  links?: Record<string, LinkObject | ReferenceObject>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-object Parameter Objects}.
   */
  parameters?: Record<string, ParameterObject | ReferenceObject>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#request-body-object Request Body Objects}.
   */
  requestBodies?: Record<string, RequestBodyObject | ReferenceObject>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#response-object Response Objects}.
   */
  responses?: Record<string, ResponseObject | ReferenceObject>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#schema-object Schema Objects}.
   */
  schemas?: Record<string, SchemaObject | ReferenceObject>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#security-scheme-object Security Scheme Objects}.
   */
  securitySchemes?: Record<string, SecuritySchemeObject | ReferenceObject>;
}

/**
 * Contact information for the exposed API.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * ```yaml
 * name: API Support
 * url: https://www.example.com/support
 * email: support@example.com
 * ```
 */
export interface ContactObject extends SpecExtensions {
  /**
   * The email address of the contact person/organization. This MUST be in the form of an email address.
   */
  email?: string;
  /**
   * The identifying name of the contact person/organization.
   */
  name?: string;
  /**
   * The URL for the contact information. This MUST be in the form of a URL.
   */
  url?: string;
}

/**
 * When request bodies or response payloads may be one of a number of different schemas, a Discriminator Object gives a hint about the expected schema of the document. This hint can be used to aid in serialization, deserialization, and validation. The Discriminator Object does this by implicitly or explicitly associating the possible values of a named property with alternative schemas.
 *
 * Note that `discriminator` MUST NOT change the validation outcome of the schema.
 *
 * **Conditions for Using the Discriminator Object**
 *
 * TODO: content, examples
 */
export interface DiscriminatorObject {
  /**
   * An object to hold mappings between payload values and schema names or URI references.
   */
  mapping?: Record<string, string>;
  /**
   * **REQUIRED**. The name of the property in the payload that will hold the discriminating value. This property SHOULD be required in the payload schema, as the behavior when the property is absent is undefined.
   */
  propertyName: string;
}

/**
 * A single encoding definition applied to a single schema property. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#appendix-b-data-type-conversion Appendix B} for a discussion of converting values of various types to string representations.
 *
 * Properties are correlated with `multipart` parts using the {@link https://www.rfc-editor.org/rfc/rfc7578#section-4.2 `name` parameter} of `Content-Disposition: form-data`, and with `application/x-www-form-urlencoded` using the query string parameter names. In both cases, their order is implementation-defined.
 *
 * See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#appendix-e-percent-encoding-and-form-media-types Appendix E} for a detailed examination of percent-encoding concerns for form media types.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * TODO: default values examples
 * TODO: examples
 */
export interface EncodingObject extends SpecExtensions {
  /**
   * When this is true, parameter values are serialized using reserved expansion, as defined by {@link https://datatracker.ietf.org/doc/html/rfc6570#section-3.2.3 RFC6570}, which allows {@link https://datatracker.ietf.org/doc/html/rfc3986#section-2.2 RFC3986's reserved character set}, as well as percent-encoded triples, to pass through unchanged, while still percent-encoding all other disallowed characters (including `%` outside of percent-encoded triples). Applications are still responsible for percent-encoding reserved characters that are {@link https://datatracker.ietf.org/doc/html/rfc3986#section-3.4 not allowed in the query string} (`[`, `]`, `#`), or have a special meaning in `application/x-www-form-urlencoded` (`-`, `&`, `+`); see Appendices {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#appendix-c-using-rfc6570-based-serialization C} and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#appendix-e-percent-encoding-and-form-media-types E} for details. The default value is `false`. This field SHALL be ignored if the request body media type is not `application/x-www-form-urlencoded`.
   */
  allowReserved?: boolean;
  /**
   * The `Content-Type` for encoding a specific property. The value is a comma-separated list, each element of which is either a specific media type (e.g. `image/png`) or a wildcard media type (e.g. `image/*`). Default value depends on the property type as shown in the table below.
   */
  contentType?: string;
  /**
   * When this is true, property values of type `array` or `object` generate separate parameters for each value of the array, or key-value-pair of the map. For other types of properties this field has no effect. When {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#encoding-style `style`} is `"form"`, the default value is `true`. For all other styles, the default value is `false`. Note that despite `false` being the default for `deepObject`, the combination of `false` with `deepObject` is undefined. This field SHALL be ignored if the request body media type is not `application/x-www-form-urlencoded`.
   */
  explode?: boolean;
  /**
   * A map allowing additional information to be provided as headers. `Content-Type` is described separately and SHALL be ignored in this section. This field SHALL be ignored if the request body media type is not a `multipart`.
   */
  headers?: Record<string, HeaderObject | ReferenceObject>;
  /**
   * Describes how a specific property value will be serialized depending on its type. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-object Parameter Object} for details on the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-style `style`} field. The behavior follows the same values as `query` parameters, including default values. Note that the initial `?` used in query strings is not used in `application/x-www-form-urlencoded` message bodies, and MUST be removed (if using an RFC6570 implementation) or simply not added (if constructing the string manually). This field SHALL be ignored if the request body media type is not `application/x-www-form-urlencoded`.
   */
  style?:
    | 'deepObject'
    | 'form'
    | 'label'
    | 'matrix'
    | 'pipeDelimited'
    | 'simple'
    | 'spaceDelimited';
}

/**
 * An object grouping an internal or external example value with basic `summary` and `description` metadata. This object is typically used in fields named `examples` (plural), and is a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#reference-object referenceable} alternative to older `example` (singular) fields that do not support referencing or metadata.
 *
 * Examples allow demonstration of the usage of properties, parameters and objects within OpenAPI.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * In all cases, the example value SHOULD be compatible with the schema of its associated value. Tooling implementations MAY choose to validate compatibility automatically, and reject the example value(s) if incompatible.
 *
 * TODO: examples
 */
export interface ExampleObject extends SpecExtensions {
  /**
   * Long description for the example. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * A URL that points to the literal example. This provides the capability to reference examples that cannot easily be included in JSON or YAML documents. The `value` field and `externalValue` field are mutually exclusive. See the rules for resolving {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#relative-references-in-urls Relative References}.
   */
  externalValue?: string;
  /**
   * Short description for the example.
   */
  summary?: string;
  /**
   * Embedded literal example. The `value` field and `externalValue` field are mutually exclusive. To represent examples of media types that cannot naturally represented in JSON or YAML, use a string value to contain the example, escaping where necessary.
   */
  value?: unknown;
}

/**
 * Allows referencing an external resource for extended documentation.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * **External Documentation Object Example**
 *
 * ```yaml
 * description: Find more info here
 * url: https://example.com
 * ```
 */
export interface ExternalDocumentationObject extends SpecExtensions {
  /**
   * A description of the target documentation. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * **REQUIRED**. The URL for the target documentation. This MUST be in the form of a URL.
   */
  url: string;
}

/**
 * Describes a single header for {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#response-headers HTTP responses} and for {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#encoding-headers individual parts in `multipart` representations}; see the relevant {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#response-object Response Object} and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#encoding-object Encoding Object} documentation for restrictions on which headers can be described.
 *
 * The Header Object follows the structure of the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-object Parameter Object}, including determining its serialization strategy based on whether `schema` or `content` is present, with the following changes:
 * 1. `name` MUST NOT be specified, it is given in the corresponding `headers` map.
 * 1. `in` MUST NOT be specified, it is implicitly in `header`.
 * 1. All traits that are affected by the location MUST be applicable to a location of `header` (for example, {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-style `style`}). This means that `allowEmptyValue` and `allowReserved` MUST NOT be used, and `style`, if used, MUST be limited to `"simple"`.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * TODO: examples
 */
export type HeaderObject = Omit<ParameterObject, 'in' | 'name'>;

/**
 * The object provides metadata about the API. The metadata MAY be used by the clients if needed, and MAY be presented in editing or documentation generation tools for convenience.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * ```yaml
 * title: Example Pet Store App
 * description: This is an example server for a pet store.
 * termsOfService: https://example.com/terms/
 * contact:
 *   name: API Support
 *   url: https://www.example.com/support
 *   email: support@example.com
 * license:
 *   name: Apache 2.0
 *   url: https://www.apache.org/licenses/LICENSE-2.0.html
 * version: 1.0.1
 * ```
 */
export interface InfoObject extends SpecExtensions {
  /**
   * The contact information for the exposed API.
   */
  contact?: ContactObject;
  /**
   * A description of the API. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * The license information for the exposed API.
   */
  license?: LicenseObject;
  /**
   * A URL for the Terms of Service for the API. This MUST be in the form of a URL.
   */
  termsOfService?: string;
  /**
   * **REQUIRED**. The title of the API.
   */
  title: string;
  /**
   * **REQUIRED**. The version of the OpenAPI Document (which is distinct from the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#oas-version OpenAPI Specification version} or the version of the API being described or the version of the OpenAPI Description).
   */
  version: string;
}

/**
 * License information for the exposed API.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * ```yaml
 * name: Apache 2.0
 * url: https://www.apache.org/licenses/LICENSE-2.0.html
 * ```
 */
export interface LicenseObject extends SpecExtensions {
  /**
   * **REQUIRED**. The license name used for the API.
   */
  name: string;
  /**
   * A URL for the license used for the API. This MUST be in the form of a URL.
   */
  url?: string;
}

/**
 * The Link Object represents a possible design-time link for a response. The presence of a link does not guarantee the caller's ability to successfully invoke it, rather it provides a known relationship and traversal mechanism between responses and other operations.
 *
 * Unlike _dynamic links_ (i.e. links provided in the response payload), the OAS linking mechanism does not require link information in the runtime response.
 *
 * For computing links and providing instructions to execute them, a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#runtime-expressions runtime expression} is used for accessing values in an operation and using them as parameters while invoking the linked operation.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * A linked operation MUST be identified using either an `operationRef` or `operationId`. The identified or reference operation MUST be unique, and in the case of an `operationId`, it MUST be resolved within the scope of the OpenAPI Description (OAD). Because of the potential for name clashes, the `operationRef` syntax is preferred for multi-document OADs. However, because use of an operation depends on its URL path template in the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#paths-object Paths Object}, operations from any {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#path-item-object Path Item Object} that is referenced multiple times within the OAD cannot be resolved unambiguously. In such ambiguous cases, the resulting behavior is implementation-defined and MAY result in an error.
 *
 * Note that it is not possible to provide a constant value to `parameters` that matches the syntax of a runtime expression. It is possible to have ambiguous parameter names, e.g. `name: "id"`, `in: "path"` and `name: "path.id", in: "query"`; this is NOT RECOMMENDED and the behavior is implementation-defined, however implementations SHOULD prefer the qualified interpretation (`path.id` as a path parameter), as the names can always be qualified to disambiguate them (e.g. using `query.path.id` for the query parameter).
 *
 * TODO: examples
 */
export interface LinkObject extends SpecExtensions {
  /**
   * A description of the link. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * The name of an _existing_, resolvable OAS operation, as defined with a unique `operationId`. This field is mutually exclusive of the `operationRef` field.
   */
  operationId?: string;
  /**
   * A URI reference to an OAS operation. This field is mutually exclusive of the `operationId` field, and MUST point to an {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#operation-object Operation Object}.
   */
  operationRef?: string;
  /**
   * A map representing parameters to pass to an operation as specified with `operationId` or identified via `operationRef`. The key is the parameter name to be used (optionally qualified with the parameter location, e.g. `path.id` for an `id` parameter in the path), whereas the value can be a constant or an expression to be evaluated and passed to the linked operation.
   */
  parameters?: Record<string, unknown | string>;
  /**
   * A literal value or {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#runtime-expressions {expression}} to use as a request body when calling the target operation.
   */
  requestBody?: unknown | string;
  /**
   * A server object to be used by the target operation.
   */
  server?: ServerObject;
}

/**
 * Each Media Type Object provides schema and examples for the media type identified by its key.
 *
 * When `example` or `examples` are provided, the example SHOULD match the specified schema and be in the correct format as specified by the media type and its encoding. The `example` and `examples` fields are mutually exclusive, and if either is present it SHALL _override_ any `example` in the schema. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#working-with-examples Working With Examples} for further guidance regarding the different ways of specifying examples, including non-JSON/YAML values.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * TODO: examples
 */
export interface MediaTypeObject extends SpecExtensions {
  /**
   * A map between a property name and its encoding information. The key, being the property name, MUST exist in the schema as a property. The `encoding` field SHALL only apply to {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#request-body-object Request Body Objects}, and only when the media type is `multipart` or `application/x-www-form-urlencoded`. If no Encoding Object is provided for a property, the behavior is determined by the default values documented for the Encoding Object.
   */
  encoding?: Record<string, EncodingObject>;
  /**
   * Example of the media type; see {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#working-with-examples Working With Examples}.
   */
  example?: unknown;
  /**
   * Examples of the media type; see {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#working-with-examples Working With Examples}.
   */
  examples?: Record<string, ExampleObject | ReferenceObject>;
  /**
   * The schema defining the content of the request, response, parameter, or header.
   */
  schema?: SchemaObject | ReferenceObject;
}

/**
 * Configuration details for a supported OAuth Flow
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * TODO: examples
 */
export interface OAuthFlowObject extends SpecExtensions {
  /**
   * **REQUIRED (`"implicit"`, `"authorizationCode"`)**. The authorization URL to be used for this flow. This MUST be in the form of a URL. The OAuth2 standard requires the use of TLS.
   */
  authorizationUrl?: string;
  /**
   * The URL to be used for obtaining refresh tokens. This MUST be in the form of a URL. The OAuth2 standard requires the use of TLS.
   */
  refreshUrl?: string;
  /**
   * **REQUIRED**. The available scopes for the OAuth2 security scheme. A map between the scope name and a short description for it. The map MAY be empty.
   */
  scopes: Record<string, string>;
  /**
   * **REQUIRED (`"password"`, `"clientCredentials"`, `"authorizationCode"`)**. The token URL to be used for this flow. This MUST be in the form of a URL. The OAuth2 standard requires the use of TLS.
   */
  tokenUrl?: string;
}

/**
 * Allows configuration of the supported OAuth Flows.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 */
export interface OAuthFlowsObject extends SpecExtensions {
  /**
   * Configuration for the OAuth Authorization Code flow. Previously called `accessCode` in OpenAPI 2.0.
   */
  authorizationCode?: OAuthFlowObject;
  /**
   * Configuration for the OAuth Client Credentials flow. Previously called `application` in OpenAPI 2.0.
   */
  clientCredentials?: OAuthFlowObject;
  /**
   * Configuration for the OAuth Implicit flow
   */
  implicit?: OAuthFlowObject;
  /**
   * Configuration for the OAuth Resource Owner Password flow
   */
  password?: OAuthFlowObject;
}

/**
 * Describes a single API operation on a path.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * TODO: examples
 */
export interface OperationObject extends SpecExtensions {
  /**
   * A map of possible out-of band callbacks related to the parent operation. The key is a unique identifier for the Callback Object. Each value in the map is a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#callback-object Callback Object} that describes a request that may be initiated by the API provider and the expected responses.
   */
  callbacks?: Record<string, CallbackObject | ReferenceObject>;
  /**
   * Declares this operation to be deprecated. Consumers SHOULD refrain from usage of the declared operation. Default value is `false`.
   */
  deprecated?: boolean;
  /**
   * A verbose explanation of the operation behavior. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * Additional external documentation for this operation.
   */
  externalDocs?: ExternalDocumentationObject;
  /**
   * Unique string used to identify the operation. The id MUST be unique among all operations described in the API. The operationId value is **case-sensitive**. Tools and libraries MAY use the operationId to uniquely identify an operation, therefore, it is RECOMMENDED to follow common programming naming conventions.
   */
  operationId?: string;
  /**
   * A list of parameters that are applicable for this operation. If a parameter is already defined in the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#path-item-parameters Path Item}, the new definition will override it but can never remove it. The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-name name} and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-in location}. The list can use the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#reference-object Reference Object} to link to parameters that are defined in the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#components-parameters OpenAPI Object's `components.parameters`}.
   */
  parameters?: Array<ParameterObject | ReferenceObject>;
  /**
   * The request body applicable for this operation. The `requestBody` is only supported in HTTP methods where the HTTP 1.1 specification {@link https://tools.ietf.org/html/rfc7231#section-4.3.1 RFC7231} has explicitly defined semantics for request bodies. In other cases where the HTTP spec is vague (such as {@link https://tools.ietf.org/html/rfc7231#section-4.3.1 GET}, {@link https://tools.ietf.org/html/rfc7231#section-4.3.2 HEAD} and {@link https://tools.ietf.org/html/rfc7231#section-4.3.5 DELETE}), `requestBody` SHALL be ignored by consumers.
   */
  requestBody?: RequestBodyObject | ReferenceObject;
  /**
   * **REQUIRED**. The list of possible responses as they are returned from executing this operation.
   */
  responses: ResponsesObject;
  /**
   * A declaration of which security mechanisms can be used for this operation. The list of values includes alternative Security Requirement Objects that can be used. Only one of the Security Requirement Objects need to be satisfied to authorize a request. To make security optional, an empty security requirement (`{}`) can be included in the array. This definition overrides any declared top-level {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#oas-security `security`}. To remove a top-level security declaration, an empty array can be used.
   */
  security?: Array<SecurityRequirementObject>;
  /**
   * An alternative `servers` array to service this operation. If a `servers` array is specified at the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#path-item-servers Path Item Object} or {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#oas-servers OpenAPI Object} level, it will be overridden by this value.
   */
  servers?: Array<ServerObject>;
  /**
   * A short summary of what the operation does.
   */
  summary?: string;
  /**
   * A list of tags for API documentation control. Tags can be used for logical grouping of operations by resources or any other qualifier.
   */
  tags?: Array<string>;
  /**
   * A list of code samples associated with an operation.
   */
  'x-codeSamples'?: Array<CodeSampleObject>;
}

/**
 * Describes a single operation parameter.
 *
 * A unique parameter is defined by a combination of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-name name} and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-in location}.
 *
 * See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#appendix-e-percent-encoding-and-form-media-types Appendix E} for a detailed examination of percent-encoding concerns, including interactions with the `application/x-www-form-urlencoded` query string format.
 *
 * **Parameter Locations**
 *
 * There are four possible parameter locations specified by the `in` field:
 *
 * - path - Used together with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#path-templating Path Templating}, where the parameter value is actually part of the operation's URL. This does not include the host or base path of the API. For example, in `/items/{itemId}`, the path parameter is `itemId`.
 * - query - Parameters that are appended to the URL. For example, in `/items?id=###`, the query parameter is `id`.
 * - header - Custom headers that are expected as part of the request. Note that {@link https://tools.ietf.org/html/rfc7230#section-3.2 RFC7230} states header names are case insensitive.
 * - cookie - Used to pass a specific cookie value to the API.
 *
 * **Fixed Fields**
 *
 * The rules for serialization of the parameter are specified in one of two ways. Parameter Objects MUST include either a `content` field or a `schema` field, but not both. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#appendix-b-data-type-conversion Appendix B} for a discussion of converting values of various types to string representations.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * Note that while `"Cookie"` as a `name` is not forbidden if `in` is `"header"`, the effect of defining a cookie parameter that way is undefined; use `in: "cookie"` instead.
 *
 * **Fixed Fields for use with schema**
 *
 * For simpler scenarios, a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-schema `schema`} and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-style `style`} can describe the structure and syntax of the parameter. When `example` or `examples` are provided in conjunction with the `schema` field, the example SHOULD match the specified schema and follow the prescribed serialization strategy for the parameter. The `example` and `examples` fields are mutually exclusive, and if either is present it SHALL _override_ any `example` in the schema.
 *
 * Serializing with `schema` is NOT RECOMMENDED for `in: "cookie"` parameters, `in: "header"` parameters that use HTTP header parameters (name=value pairs following a `;`) in their values, or `in: "header"` parameters where values might have non-URL-safe characters; see {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#appendix-d-serializing-headers-and-cookies Appendix D} for details.
 *
 * See also {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#appendix-c-using-rfc6570-based-serialization Appendix C: Using RFC6570-Based Serialization} for additional guidance.
 *
 * **Fixed Fields for use with `content`**
 *
 * For more complex scenarios, the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-content `content`} field can define the media type and schema of the parameter, as well as give examples of its use. Using `content` with a `text/plain` media type is RECOMMENDED for `in: "header"` and `in: "cookie"` parameters where the `schema` strategy is not appropriate.
 *
 * **Style Values**
 *
 * In order to support common ways of serializing simple parameters, a set of `style` values are defined.
 *
 * See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#appendix-e-percent-encoding-and-form-media-types Appendix E} for a discussion of percent-encoding, including when delimiters need to be percent-encoded and options for handling collisions with percent-encoded data.
 *
 * TODO: examples
 */
export interface ParameterObject extends SpecExtensions {
  /**
   * If `true`, clients MAY pass a zero-length string value in place of parameters that would otherwise be omitted entirely, which the server SHOULD interpret as the parameter being unused. Default value is `false`. If {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-style `style`} is used, and if {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#style-examples behavior is _n/a_ (cannot be serialized)}, the value of `allowEmptyValue` SHALL be ignored. Interactions between this field and the parameter's {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#schema-object Schema Object} are implementation-defined. This field is valid only for `query` parameters. Use of this field is NOT RECOMMENDED, and it is likely to be removed in a later revision.
   */
  allowEmptyValue?: boolean;
  /**
   * When this is true, parameter values are serialized using reserved expansion, as defined by {@link https://datatracker.ietf.org/doc/html/rfc6570#section-3.2.3 RFC6570}, which allows {@link https://datatracker.ietf.org/doc/html/rfc3986#section-2.2 RFC3986's reserved character set}, as well as percent-encoded triples, to pass through unchanged, while still percent-encoding all other disallowed characters (including `%` outside of percent-encoded triples). Applications are still responsible for percent-encoding reserved characters that are {@link https://datatracker.ietf.org/doc/html/rfc3986#section-3.4 not allowed in the query string} (`[`, `]`, `#`), or have a special meaning in `application/x-www-form-urlencoded` (`-`, `&`, `+`); see Appendices {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#appendix-c-using-rfc6570-based-serialization C} and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#appendix-e-percent-encoding-and-form-media-types E} for details. This field only applies to parameters with an `in` value of `query`. The default value is `false`.
   */
  allowReserved?: boolean;
  /**
   * A map containing the representations for the parameter. The key is the media type and the value describes it. The map MUST only contain one entry.
   */
  content?: Record<string, MediaTypeObject>;
  /**
   * Specifies that a parameter is deprecated and SHOULD be transitioned out of usage. Default value is `false`.
   */
  deprecated?: boolean;
  /**
   * A brief description of the parameter. This could contain examples of use. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * Example of the parameter's potential value; see {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#working-with-examples Working With Examples}.
   */
  example?: unknown;
  /**
   * Examples of the parameter's potential value; see {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#working-with-examples Working With Examples}.
   */
  examples?: Record<string, ExampleObject | ReferenceObject>;
  /**
   * When this is true, parameter values of type `array` or `object` generate separate parameters for each value of the array or key-value pair of the map. For other types of parameters this field has no effect. When {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-style `style`} is `"form"`, the default value is `true`. For all other styles, the default value is `false`. Note that despite `false` being the default for `deepObject`, the combination of `false` with `deepObject` is undefined.
   */
  explode?: boolean;
  /**
   * **REQUIRED**. The location of the parameter. Possible values are `"query"`, `"header"`, `"path"` or `"cookie"`.
   */
  in: 'cookie' | 'header' | 'path' | 'query';
  /**
   * **REQUIRED**. The name of the parameter. Parameter names are _case sensitive_.
   * - If {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-in `in`} is `"path"`, the `name` field MUST correspond to a template expression occurring within the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#paths-path path} field in the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#paths-object Paths Object}. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#path-templating Path Templating} for further information.
   * - If {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-in `in`} is `"header"` and the `name` field is `"Accept"`, `"Content-Type"` or `"Authorization"`, the parameter definition SHALL be ignored.
   * - For all other cases, the `name` corresponds to the parameter name used by the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-in `in`} field.
   */
  name: string;
  /**
   * Determines whether this parameter is mandatory. If the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-in parameter location} is `"path"`, this field is **REQUIRED** and its value MUST be `true`. Otherwise, the field MAY be included and its default value is `false`.
   */
  required?: boolean;
  /**
   * The schema defining the type used for the parameter.
   */
  schema?: SchemaObject | ReferenceObject;
  /**
   * Describes how the parameter value will be serialized depending on the type of the parameter value. Default values (based on value of `in`): for `"query"` - `"form"`; for `"path"` - `"simple"`; for `"header"` - `"simple"`; for `"cookie"` - `"form"`.
   */
  style?:
    | 'deepObject'
    | 'form'
    | 'label'
    | 'matrix'
    | 'pipeDelimited'
    | 'simple'
    | 'spaceDelimited';
}

/**
 * Describes the operations available on a single path. A Path Item MAY be empty, due to {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#security-filtering ACL constraints}. The path itself is still exposed to the documentation viewer but they will not know which operations and parameters are available.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * TODO: examples
 */
export interface PathItemObject extends SpecExtensions {
  /**
   * Allows for a referenced definition of this path item. The value MUST be in the form of a URL, and the referenced structure MUST be in the form of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#path-item-object Path Item Object}. In case a Path Item Object field appears both in the defined object and the referenced object, the behavior is undefined. See the rules for resolving {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#relative-references-in-urls Relative References}.
   */
  $ref?: string;
  /**
   * A definition of a DELETE operation on this path.
   */
  delete?: OperationObject;
  /**
   * An optional string description, intended to apply to all operations in this path. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * A definition of a GET operation on this path.
   */
  get?: OperationObject;
  /**
   * A definition of a HEAD operation on this path.
   */
  head?: OperationObject;
  /**
   * A definition of a OPTIONS operation on this path.
   */
  options?: OperationObject;
  /**
   * A list of parameters that are applicable for all the operations described under this path. These parameters can be overridden at the operation level, but cannot be removed there. The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-name name} and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-in location}. The list can use the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#reference-object Reference Object} to link to parameters that are defined in the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#components-parameters OpenAPI Object's `components.parameters`}.
   */
  parameters?: Array<ParameterObject | ReferenceObject>;
  /**
   * A definition of a PATCH operation on this path.
   */
  patch?: OperationObject;
  /**
   * A definition of a POST operation on this path.
   */
  post?: OperationObject;
  /**
   * A definition of a PUT operation on this path.
   */
  put?: OperationObject;
  /**
   * An alternative `servers` array to service all operations in this path. If a `servers` array is specified at the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#oas-servers OpenAPI Object} level, it will be overridden by this value.
   */
  servers?: Array<ServerObject>;
  /**
   * An optional string summary, intended to apply to all operations in this path.
   */
  summary?: string;
  /**
   * A definition of a TRACE operation on this path.
   */
  trace?: OperationObject;
}

/**
 * Holds the relative paths to the individual endpoints and their operations. The path is appended to the URL from the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#server-object Server Object} in order to construct the full URL. The Paths Object MAY be empty, due to {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#security-filtering Access Control List (ACL) constraints}.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * TODO: examples
 */
export interface PathsObject extends SpecExtensions {
  /**
   * A relative path to an individual endpoint. The field name MUST begin with a forward slash (`/`). The path is **appended** (no relative URL resolution) to the expanded URL from the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#server-object Server Object}'s `url` field in order to construct the full URL. {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#path-templating Path templating} is allowed. When matching URLs, concrete (non-templated) paths would be matched before their templated counterparts. Templated paths with the same hierarchy but different templated names MUST NOT exist as they are identical. In case of ambiguous matching, it's up to the tooling to decide which one to use.
   */
  [path: `/${string}`]: PathItemObject;
}

/**
 * A simple object to allow referencing other components in the OpenAPI Description, internally and externally.
 *
 * The Reference Object is defined by {@link https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03 JSON Reference} and follows the same structure, behavior and rules.
 *
 * For this specification, reference resolution is accomplished as defined by the JSON Reference specification and not by the JSON Schema specification.
 *
 * This object cannot be extended with additional properties, and any properties added SHALL be ignored.
 *
 * **Reference Object Example**
 *
 * ```yaml
 * $ref: '#/components/schemas/Pet'
 * ```
 *
 * **Relative Schema Document Example**
 *
 * ```yaml
 * $ref: Pet.yaml
 * ```
 *
 * **Relative Documents with Embedded Schema Example**
 *
 * ```yaml
 * $ref: definitions.yaml#/Pet
 * ```
 */
export interface ReferenceObject {
  /**
   * **REQUIRED**. The reference string.
   */
  $ref: string;
}

/**
 * Describes a single request body.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * TODO: examples
 */
export interface RequestBodyObject extends SpecExtensions {
  /**
   * **REQUIRED**. The content of the request body. The key is a media type or {@link https://tools.ietf.org/html/rfc7231#appendix-D media type range} and the value describes it. For requests that match multiple keys, only the most specific key is applicable. e.g. `"text/plain"` overrides `"text/*"`
   */
  content: Record<string, MediaTypeObject>;
  /**
   * A brief description of the request body. This could contain examples of use. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * Determines if the request body is required in the request. Defaults to `false`.
   */
  required?: boolean;
}

/**
 * Describes a single response from an API operation, including design-time, static `links` to operations based on the response.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * TODO: examples
 */
export interface ResponseObject extends SpecExtensions {
  /**
   * A map containing descriptions of potential response payloads. The key is a media type or {@link https://tools.ietf.org/html/rfc7231#appendix-D media type range} and the value describes it. For responses that match multiple keys, only the most specific key is applicable. e.g. `"text/plain"` overrides `"text/*"`
   */
  content?: Record<string, MediaTypeObject>;
  /**
   * **REQUIRED**. A description of the response. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description: string;
  /**
   * Maps a header name to its definition. {@link https://tools.ietf.org/html/rfc7230#section-3.2 RFC7230} states header names are case insensitive. If a response header is defined with the name `"Content-Type"`, it SHALL be ignored.
   */
  headers?: Record<string, HeaderObject | ReferenceObject>;
  /**
   * A map of operations links that can be followed from the response. The key of the map is a short name for the link, following the naming constraints of the names for {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#components-object Component Objects}.
   */
  links?: Record<string, LinkObject | ReferenceObject>;
}

/**
 * A container for the expected responses of an operation. The container maps a HTTP response code to the expected response.
 *
 * The documentation is not necessarily expected to cover all possible HTTP response codes because they may not be known in advance. However, documentation is expected to cover a successful operation response and any known errors.
 *
 * The `default` MAY be used as a default Response Object for all HTTP codes that are not covered individually by the Responses Object.
 *
 * The Responses Object MUST contain at least one response code, and if only one response code is provided it SHOULD be the response for a successful operation call.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * TODO: examples
 */
export interface ResponsesObject extends SpecExtensions {
  /**
   * Any {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#http-status-codes HTTP status code} can be used as the property name, but only one property per code, to describe the expected response for that HTTP status code. A {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#reference-object Reference Object} can link to a response that is defined in the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#components-responses OpenAPI Object's `components.responses`} section. This field MUST be enclosed in quotation marks (for example, "200") for compatibility between JSON and YAML. To define a range of response codes, this field MAY contain the uppercase wildcard character `X`. For example, `2XX` represents all response codes between `200` and `299`. Only the following range definitions are allowed: `1XX`, `2XX`, `3XX`, `4XX`, and `5XX`. If a response is defined using an explicit code, the explicit code definition takes precedence over the range definition for that code.
   */
  [httpStatusCode: string]: ResponseObject | ReferenceObject | undefined | unknown;
  /**
   * The documentation of responses other than the ones declared for specific HTTP response codes. Use this field to cover undeclared responses. A {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#reference-object Reference Object} can link to a response that the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#components-responses OpenAPI Object's `components.responses`} section defines.
   */
  default?: ResponseObject | ReferenceObject;
}

/**
 * The Schema Object allows the definition of input and output data types. These types can be objects, but also primitives and arrays. This object is an extended subset of the [[JSON-Schema-05|JSON Schema Specification Draft Wright-00]].
 *
 * For more information about the keywords, see {@link https://tools.ietf.org/html/draft-wright-json-schema-00 JSON Schema Core} and {@link https://tools.ietf.org/html/draft-wright-json-schema-validation-00 JSON Schema Validation}. Unless stated otherwise, the keyword definitions follow those of JSON Schema and do not add any additional semantics.
 *
 * **JSON Schema Keywords**
 *
 * The following keywords are taken directly from the JSON Schema definition and follow the same specifications:
 * - title
 * - multipleOf
 * - maximum
 * - exclusiveMaximum
 * - minimum
 * - exclusiveMinimum
 * - maxLength
 * - minLength
 * - pattern (This string SHOULD be a valid regular expression, according to the {@link https://www.ecma-international.org/ecma-262/5.1/#sec-15.10.1 Ecma-262 Edition 5.1 regular expression} dialect)
 * - maxItems
 * - minItems
 * - uniqueItems
 * - maxProperties
 * - minProperties
 * - required
 * - enum
 *
 * The following keywords are taken from the JSON Schema definition but their definitions were adjusted to the OpenAPI Specification.
 *
 * - type - Value MUST be a string. Multiple types via an array are not supported.
 * - allOf - Inline or referenced schema MUST be of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#schema-object Schema Object} and not a standard JSON Schema.
 * - oneOf - Inline or referenced schema MUST be of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#schema-object Schema Object} and not a standard JSON Schema.
 * - anyOf - Inline or referenced schema MUST be of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#schema-object Schema Object} and not a standard JSON Schema.
 * - not - Inline or referenced schema MUST be of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#schema-object Schema Object} and not a standard JSON Schema.
 * - items - Value MUST be an object and not an array. Inline or referenced schema MUST be of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#schema-object Schema Object} and not a standard JSON Schema. `items` MUST be present if `type` is `"array"`.
 * - properties - Property definitions MUST be a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#schema-object Schema Object} and not a standard JSON Schema (inline or referenced).
 * - additionalProperties - Value can be boolean or object. Inline or referenced schema MUST be of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#schema-object Schema Object} and not a standard JSON Schema. Consistent with JSON Schema, `additionalProperties` defaults to `true`.
 * - description - {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
 * - format - See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#data-type-format Data Type Formats} for further details. While relying on JSON Schema's defined formats, the OAS offers a few additional predefined formats.
 * - default - The default value represents what would be assumed by the consumer of the input as the value of the schema if one is not provided. Unlike JSON Schema, the value MUST conform to the defined `type` for the Schema Object defined at the same level. For example, if `type` is `"string"`, then `default` can be `"foo"` but cannot be `1`.
 *
 * Alternatively, any time a Schema Object can be used, a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#reference-object Reference Object} can be used in its place. This allows referencing definitions instead of defining them inline.
 *
 * Additional keywords defined by the JSON Schema specification that are not mentioned here are strictly unsupported.
 *
 * Other than the JSON Schema subset fields, the following fields MAY be used for further schema documentation:
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * **Composition and Inheritance (Polymorphism)**
 *
 * TODO: content, examples
 */
export interface SchemaObject extends EnumExtensions, SpecExtensions {
  /**
   * The value of "additionalProperties" MUST be a boolean or a schema.
   *
   * If "additionalProperties" is absent, it may be considered present with an empty schema as a value.
   *
   * If "additionalProperties" is true, validation always succeeds.
   *
   * If "additionalProperties" is false, validation succeeds only if the instance is an object and all properties on the instance were covered by "properties" and/or "patternProperties".
   *
   * If "additionalProperties" is an object, validate the value as a schema to all of the properties that weren't validated by "properties" nor "patternProperties".
   *
   * Value can be boolean or object. Inline or referenced schema MUST be of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#schema-object Schema Object} and not a standard JSON Schema. Consistent with JSON Schema, `additionalProperties` defaults to `true`.
   */
  additionalProperties?: boolean | SchemaObject | ReferenceObject;
  /**
   * This keyword's value MUST be an array.  This array MUST have at least one element.
   *
   * Elements of the array MUST be objects.  Each object MUST be a valid Schema Object.
   *
   * An instance validates successfully against this keyword if it validates successfully against all schemas defined by this keyword's value.
   */
  allOf?: Array<SchemaObject | ReferenceObject>;
  /**
   * This keyword's value MUST be an array.  This array MUST have at least one element.
   *
   * Elements of the array MUST be objects.  Each object MUST be a valid Schema Object.
   *
   * An instance validates successfully against this keyword if it validates successfully against at least one schema defined by this
   keyword's value.
   */
  anyOf?: Array<SchemaObject | ReferenceObject>;
  /**
   * The default value represents what would be assumed by the consumer of the input as the value of the schema if one is not provided. Unlike JSON Schema, the value MUST conform to the defined `type` for the Schema Object defined at the same level. For example, if `type` is `"string"`, then `default` can be `"foo"` but cannot be `1`.
   */
  default?: unknown;
  /**
   * Specifies that a schema is deprecated and SHOULD be transitioned out of usage. Default value is `false`.
   */
  deprecated?: boolean;
  /**
   * The value of both of these keywords MUST be a string.
   *
   * Both of these keywords can be used to decorate a user interface with information about the data produced by this user interface.  A title will preferrably be short, whereas a description will provide explanation about the purpose of the instance described by this schema.
   *
   * Both of these keywords MAY be used in root schemas, and in any subschemas.
   */
  description?: string;
  /**
   * Adds support for polymorphism. The discriminator is used to determine which of a set of schemas a payload is expected to satisfy. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#composition-and-inheritance-polymorphism Composition and Inheritance} for more details.
   */
  discriminator?: DiscriminatorObject;
  /**
   * The value of this keyword MUST be an array.  This array SHOULD have at least one element.  Elements in the array SHOULD be unique.
   *
   * Elements in the array MAY be of any type, including null.
   *
   * An instance validates successfully against this keyword if its value is equal to one of the elements in this keyword's array value.
   */
  enum?: Array<unknown>;
  /**
   * A free-form field to include an example of an instance for this schema. To represent examples that cannot be naturally represented in JSON or YAML, a string value can be used to contain the example with escaping where necessary.
   */
  example?: unknown;
  /**
   * The value of "exclusiveMaximum" MUST be a boolean, representing whether the limit in "maximum" is exclusive or not.  An undefined value is the same as false.
   *
   * If "exclusiveMaximum" is true, then a numeric instance SHOULD NOT be equal to the value specified in "maximum".  If "exclusiveMaximum" is false (or not specified), then a numeric instance MAY be equal to the value of "maximum".
   */
  exclusiveMaximum?: boolean;
  /**
   * The value of "exclusiveMinimum" MUST be a boolean, representing whether the limit in "minimum" is exclusive or not.  An undefined value is the same as false.
   *
   * If "exclusiveMinimum" is true, then a numeric instance SHOULD NOT be equal to the value specified in "minimum".  If "exclusiveMinimum" is false (or not specified), then a numeric instance MAY be equal to the value of "minimum".
   */
  exclusiveMinimum?: boolean;
  /**
   * Additional external documentation for this schema.
   */
  externalDocs?: ExternalDocumentationObject;
  /**
   * While relying on JSON Schema's defined formats, the OAS offers a few additional predefined formats.
   */
  format?: Format;
  /**
   * `items` MUST be present if `type` is `"array"`.
   */
  items?: SchemaObject | ReferenceObject;
  /**
   * The value of this keyword MUST be an integer.  This integer MUST be greater than, or equal to, 0.
   *
   * An array instance is valid against "maxItems" if its size is less than, or equal to, the value of this keyword.
   */
  maxItems?: number;
  /**
   * The value of this keyword MUST be a non-negative integer.
   *
   * The value of this keyword MUST be an integer.  This integer MUST be greater than, or equal to, 0.
   *
   * A string instance is valid against this keyword if its length is less than, or equal to, the value of this keyword.
   *
   * The length of a string instance is defined as the number of its characters as defined by {@link https://datatracker.ietf.org/doc/html/rfc7159 RFC 7159} [RFC7159].
   */
  maxLength?: number;
  /**
   * The value of this keyword MUST be an integer.  This integer MUST be greater than, or equal to, 0.
   *
   * An object instance is valid against "maxProperties" if its number of properties is less than, or equal to, the value of this keyword.
   */
  maxProperties?: number;
  /**
   * The value of "maximum" MUST be a number, representing an upper limit for a numeric instance.
   *
   * If the instance is a number, then this keyword validates if "exclusiveMaximum" is true and instance is less than the provided value, or else if the instance is less than or exactly equal to the provided value.
   */
  maximum?: number;
  /**
   * The value of this keyword MUST be an integer.  This integer MUST be greater than, or equal to, 0.
   *
   * An array instance is valid against "minItems" if its size is greater than, or equal to, the value of this keyword.
   *
   * If this keyword is not present, it may be considered present with a value of 0.
   */
  minItems?: number;
  /**
   * A string instance is valid against this keyword if its length is greater than, or equal to, the value of this keyword.
   *
   * The length of a string instance is defined as the number of its characters as defined by {@link https://datatracker.ietf.org/doc/html/rfc7159 RFC 7159} [RFC7159].
   *
   * The value of this keyword MUST be an integer.  This integer MUST be greater than, or equal to, 0.
   *
   * "minLength", if absent, may be considered as being present with integer value 0.
   */
  minLength?: number;
  /**
   * The value of this keyword MUST be an integer.  This integer MUST be greater than, or equal to, 0.
   *
   * An object instance is valid against "minProperties" if its number of properties is greater than, or equal to, the value of this keyword.
   *
   * If this keyword is not present, it may be considered present with a value of 0.
   */
  minProperties?: number;
  /**
   * The value of "minimum" MUST be a number, representing a lower limit for a numeric instance.
   *
   * If the instance is a number, then this keyword validates if "exclusiveMinimum" is true and instance is greater than the provided value, or else if the instance is greater than or exactly equal to the provided value.
   */
  minimum?: number;
  /**
   * The value of "multipleOf" MUST be a number, strictly greater than 0.
   *
   * A numeric instance is only valid if division by this keyword's value results in an integer.
   */
  multipleOf?: number;
  /**
   * This keyword's value MUST be an object.  This object MUST be a valid Schema Object.
   *
   * An instance is valid against this keyword if it fails to validate successfully against the schema defined by this keyword.
   */
  not?: SchemaObject | ReferenceObject;
  /**
   * This keyword only takes effect if `type` is explicitly defined within the same Schema Object. A `true` value indicates that both `null` values and values of the type specified by `type` are allowed. Other Schema Object constraints retain their defined behavior, and therefore may disallow the use of `null` as a value. A `false` value leaves the specified or default `type` unmodified. The default value is `false`.
   */
  nullable?: boolean;
  /**
   * This keyword's value MUST be an array.  This array MUST have at least one element.
   *
   * Elements of the array MUST be objects.  Each object MUST be a valid Schema Object.
   *
   * An instance validates successfully against this keyword if it validates successfully against exactly one schema defined by this keyword's value.
   */
  oneOf?: Array<SchemaObject | ReferenceObject>;
  /**
   * The value of this keyword MUST be a string.  This string SHOULD be a valid regular expression, according to the ECMA 262 regular expression dialect.
   *
   * A string instance is considered valid if the regular expression matches the instance successfully.  Recall: regular expressions are not implicitly anchored.
   */
  pattern?: string;
  /**
   * The value of "properties" MUST be an object.  Each value of this object MUST be an object, and each object MUST be a valid Schema Object.
   *
   * If absent, it can be considered the same as an empty object.
   */
  properties?: Record<string, SchemaObject | ReferenceObject>;
  /**
   * Relevant only for Schema Object `properties` definitions. Declares the property as "read only". This means that it MAY be sent as part of a response but SHOULD NOT be sent as part of the request. If the property is marked as `readOnly` being `true` and is in the `required` list, the `required` will take effect on the response only. A property MUST NOT be marked as both `readOnly` and `writeOnly` being `true`. Default value is `false`.
   */
  readOnly?: boolean;
  /**
   * The value of this keyword MUST be an array.  This array MUST have at least one element.  Elements of this array MUST be strings, and MUST be unique.
   *
   * An object instance is valid against this keyword if its property set contains all elements in this keyword's array value.
   */
  required?: Array<string>;
  /**
   * The value of both of these keywords MUST be a string.
   *
   * Both of these keywords can be used to decorate a user interface with information about the data produced by this user interface.  A title will preferrably be short, whereas a description will provide explanation about the purpose of the instance described by this schema.
   *
   * Both of these keywords MAY be used in root schemas, and in any subschemas.
   */
  title?: string;
  /**
   * The value of this keyword MUST be a string.
   *
   * An instance matches successfully if its primitive type is one of the types defined by keyword.  Recall: "number" includes "integer".
   */
  type?: 'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string';
  /**
   * The value of this keyword MUST be a boolean.
   *
   * If this keyword has boolean value false, the instance validates successfully.  If it has boolean value true, the instance validates successfully if all of its elements are unique.
   *
   * If not present, this keyword may be considered present with boolean value false.
   */
  uniqueItems?: boolean;
  /**
   * Relevant only for Schema Object `properties` definitions. Declares the property as "write only". Therefore, it MAY be sent as part of a request but SHOULD NOT be sent as part of the response. If the property is marked as `writeOnly` being `true` and is in the `required` list, the `required` will take effect on the request only. A property MUST NOT be marked as both `readOnly` and `writeOnly` being `true`. Default value is `false`.
   */
  writeOnly?: boolean;
  /**
   * This MAY be used only on property schemas. It has no effect on root schemas. Adds additional metadata to describe the XML representation of this property.
   */
  xml?: XMLObject;
}

/**
 * Lists the required security schemes to execute this operation. The name used for each property MUST correspond to a security scheme declared in the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#security-scheme-object Security Schemes} under the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#components-object Components Object}.
 *
 * A Security Requirement Object MAY refer to multiple security schemes in which case all schemes MUST be satisfied for a request to be authorized. This enables support for scenarios where multiple query parameters or HTTP headers are required to convey security information.
 *
 * When the `security` field is defined on the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#openapi-object OpenAPI Object} or {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#operation-object Operation Object} and contains multiple Security Requirement Objects, only one of the entries in the list needs to be satisfied to authorize the request. This enables support for scenarios where the API allows multiple, independent security schemes.
 *
 * An empty Security Requirement Object (`{}`) indicates anonymous access is supported.
 *
 * TODO: examples
 */
export interface SecurityRequirementObject {
  /**
   * Each name MUST correspond to a security scheme which is declared in the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#security-scheme-object Security Schemes} under the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#components-object Components Object}. If the security scheme is of type `"oauth2"` or `"openIdConnect"`, then the value is a list of scope names required for the execution, and the list MAY be empty if authorization does not require a specified scope. For other security scheme types, the array MUST be empty.
   */
  [name: string]: Array<string>;
}

/**
 * Defines a security scheme that can be used by the operations.
 *
 * Supported schemes are HTTP authentication, an API key (either as a header, a cookie parameter, or as a query parameter), OAuth2's common flows (implicit, password, client credentials, and authorization code) as defined in {@link https://tools.ietf.org/html/rfc6749 RFC6749}, and [[OpenID-Connect-Core]]. Please note that as of 2020, the implicit flow is about to be deprecated by {@link https://tools.ietf.org/html/draft-ietf-oauth-security-topics OAuth 2.0 Security Best Current Practice}. Recommended for most use cases is Authorization Code Grant flow with PKCE.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * TODO: examples
 */
export type SecuritySchemeObject = SpecExtensions & {
  /**
   * A description for security scheme. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
} & (
    | {
        /**
         * **REQUIRED**. The location of the API key. Valid values are `"query"`, `"header"`, or `"cookie"`.
         */
        in: 'cookie' | 'header' | 'query';
        /**
         * **REQUIRED**. The name of the header, query or cookie parameter to be used.
         */
        name: string;
        /**
         * **REQUIRED**. The type of the security scheme. Valid values are `"apiKey"`, `"http"`, `"oauth2"`, `"openIdConnect"`.
         */
        type: 'apiKey';
      }
    | {
        /**
         * A hint to the client to identify how the bearer token is formatted. Bearer tokens are usually generated by an authorization server, so this information is primarily for documentation purposes.
         */
        bearerFormat?: string;
        /**
         * **REQUIRED**. The name of the HTTP Authentication scheme to be used in the {@link https://tools.ietf.org/html/rfc7235#section-5.1 Authorization header as defined in RFC7235}. The values used SHOULD be registered in the {@link https://www.iana.org/assignments/http-authschemes/http-authschemes.xhtml IANA Authentication Scheme registry}. The value is case-insensitive, as defined in {@link https://datatracker.ietf.org/doc/html/rfc7235#section-2.1 RFC7235}.
         */
        scheme: string;
        /**
         * **REQUIRED**. The type of the security scheme. Valid values are `"apiKey"`, `"http"`, `"oauth2"`, `"openIdConnect"`.
         */
        type: 'http';
      }
    | {
        /**
         * **REQUIRED**. An object containing configuration information for the flow types supported.
         */
        flows: OAuthFlowsObject;
        /**
         * **REQUIRED**. The type of the security scheme. Valid values are `"apiKey"`, `"http"`, `"oauth2"`, `"openIdConnect"`.
         */
        type: 'oauth2';
      }
    | {
        /**
         * **REQUIRED**. {@link https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig Well-known URL} to discover the [[OpenID-Connect-Discovery]] {@link https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata provider metadata}.
         */
        openIdConnectUrl: string;
        /**
         * **REQUIRED**. The type of the security scheme. Valid values are `"apiKey"`, `"http"`, `"oauth2"`, `"openIdConnect"`.
         */
        type: 'openIdConnect';
      }
  );

/**
 * An object representing a Server.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * TODO: examples
 */
export interface ServerObject extends SpecExtensions {
  /**
   * An optional string describing the host designated by the URL. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * **REQUIRED**. A URL to the target host. This URL supports Server Variables and MAY be relative, to indicate that the host location is relative to the location where the document containing the Server Object is being served. Variable substitutions will be made when a variable is named in `{`braces`}`.
   */
  url: string;
  /**
   * A map between a variable name and its value. The value is used for substitution in the server's URL template.
   */
  variables?: Record<string, ServerVariableObject>;
}

/**
 * An object representing a Server Variable for server URL template substitution.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 */
export interface ServerVariableObject extends SpecExtensions {
  /**
   * **REQUIRED**. The default value to use for substitution, which SHALL be sent if an alternate value is _not_ supplied. If the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#server-variable-enum `enum`} is defined, the value SHOULD exist in the enum's values. Note that this behavior is different from the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#schema-object Schema Object}'s `default` keyword, which documents the receiver's behavior rather than inserting the value into the data.
   */
  default: string;
  /**
   * An optional description for the server variable. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * An enumeration of string values to be used if the substitution options are from a limited set. The array SHOULD NOT be empty.
   */
  enum?: Array<string>;
}

/**
 * Adds metadata to a single tag that is used by the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#operation-object Operation Object}. It is not mandatory to have a Tag Object per tag defined in the Operation Object instances.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * **Tag Object Example**
 *
 * ```yaml
 * name: pet
 * description: Pets operations
 * ```
 */
export interface TagObject extends SpecExtensions {
  /**
   * A description for the tag. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * Additional external documentation for this tag.
   */
  externalDocs?: ExternalDocumentationObject;
  /**
   * **REQUIRED**. The name of the tag.
   */
  name: string;
}

/**
 * A metadata object that allows for more fine-tuned XML model definitions.
 *
 * When using arrays, XML element names are _not_ inferred (for singular/plural forms) and the `name` field SHOULD be used to add that information. See examples for expected behavior.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * The `namespace` field is intended to match the syntax of {@link https://www.w3.org/TR/xml-names11/ XML namespaces}, although there are a few caveats:
 * - Version 3.0.3 and earlier of this specification erroneously used the term "absolute URI" instead of "non-relative URI", so authors using namespaces that include a fragment should check tooling support carefully.
 * - XML allows but discourages relative URI-references, while this specification outright forbids them.
 * - XML 1.1 allows IRIs ({@link https://datatracker.ietf.org/doc/html/rfc3987 RFC3987}) as namespaces, and specifies that namespaces are compared without any encoding or decoding, which means that IRIs encoded to meet this specification's URI syntax requirement cannot be compared to IRIs as-is.
 *
 * TODO: examples
 */
export interface XMLObject extends SpecExtensions {
  /**
   * Declares whether the property definition translates to an attribute instead of an element. Default value is `false`.
   */
  attribute?: boolean;
  /**
   * Replaces the name of the element/attribute used for the described schema property. When defined within `items`, it will affect the name of the individual XML elements within the list. When defined alongside `type` being `"array"` (outside the `items`), it will affect the wrapping element if and only if `wrapped` is `true`. If `wrapped` is `false`, it will be ignored.
   */
  name?: string;
  /**
   * The URI of the namespace definition. Value MUST be in the form of a non-relative URI.
   */
  namespace?: string;
  /**
   * The prefix to be used for the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#xml-name name}.
   */
  prefix?: string;
  /**
   * MAY be used only for an array definition. Signifies whether the array is wrapped (for example, `<books><book/><book/></books>`) or unwrapped (`<book/><book/>`). Default value is `false`. The definition takes effect only when defined alongside `type` being `"array"` (outside the `items`).
   */
  wrapped?: boolean;
}

type JsonSchemaFormats = 'date-time' | 'email' | 'hostname' | 'ipv4' | 'ipv6' | 'uri' | 'uriref';

type OpenApiSchemaFormats =
  | 'int32'
  | 'int64'
  | 'float'
  | 'double'
  | 'byte'
  | 'binary'
  | 'date'
  | 'date-time'
  | 'password';

type Format = JsonSchemaFormats | OpenApiSchemaFormats | (string & {});
