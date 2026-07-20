import type { CodeSampleObject } from '../../extensions/code-samples';
import type { EnumExtensions } from '../../extensions/enum';
import type { Document as JSONSchemaDraft4, JsonSchemaTypes } from '../../json-schema/draft-4';
import type { OpenAPIV2NullableExtensions } from './extensions';

/**
 * This is the root document object for the API specification. It combines what previously was the Resource Listing and API Declaration (version 1.2 and earlier) together into one document.
 */
export interface Document {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: unknown;
  /**
   * The base path on which the API is served, which is relative to the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#swaggerHost `host`}. If it is not included, the API is served directly under the `host`. The value MUST start with a leading slash (`/`). The `basePath` does not support {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#path-templating path templating}.
   */
  basePath?: string;
  /**
   * A list of MIME types the APIs can consume. This is global to all APIs but can be overridden on specific API calls. Value MUST be as described under {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#mime-types Mime Types}.
   */
  consumes?: Array<string>;
  /**
   * An object to hold data types produced and consumed by operations.
   */
  definitions?: DefinitionsObject;
  /**
   * Additional external documentation.
   */
  externalDocs?: ExternalDocumentationObject;
  /**
   * The host (name or ip) serving the API. This MUST be the host only and does not include the scheme nor sub-paths. It MAY include a port. If the `host` is not included, the host serving the documentation is to be used (including the port). The `host` does not support {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#path-templating path templating}.
   */
  host?: string;
  /**
   * **Required**. Provides metadata about the API. The metadata can be used by the clients if needed.
   */
  info: InfoObject;
  /**
   * An object to hold parameters that can be used across operations. This property _does not_ define global parameters for all operations.
   */
  parameters?: ParametersDefinitionsObject;
  /**
   * **Required**. The available paths and operations for the API.
   */
  paths: PathsObject;
  /**
   * A list of MIME types the APIs can produce. This is global to all APIs but can be overridden on specific API calls. Value MUST be as described under {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#mime-types Mime Types}.
   */
  produces?: Array<string>;
  /**
   * An object to hold responses that can be used across operations. This property _does not_ define global responses for all operations.
   */
  responses?: ResponsesDefinitionsObject;
  /**
   * The transfer protocol of the API. Values MUST be from the list: `"http"`, `"https"`, `"ws"`, `"wss"`. If the `schemes` is not included, the default scheme to be used is the one used to access the Swagger definition itself.
   */
  schemes?: Array<'http' | 'https' | 'ws' | 'wss'>;
  /**
   * A declaration of which security schemes are applied for the API as a whole. The list of values describes alternative security schemes that can be used (that is, there is a logical OR between the security requirements). Individual operations can override this definition.
   */
  security?: Array<SecurityRequirementObject>;
  /**
   * Security scheme definitions that can be used across the specification.
   */
  securityDefinitions?: SecurityDefinitionsObject;
  /**
   * **Required**. Specifies the Swagger Specification version being used. It can be used by the Swagger UI and other clients to interpret the API listing. The value MUST be `"2.0"`.
   */
  swagger: '2.0';
  /**
   * A list of tags used by the specification with additional metadata. The order of the tags can be used to reflect on their order by the parsing tools. Not all tags that are used by the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#operation-object Operation Object} must be declared. The tags that are not declared may be organized randomly or based on the tools' logic. Each tag name in the list MUST be unique.
   */
  tags?: Array<TagObject>;
}

/**
 * Contact information for the exposed API.
 *
 * @example
 * ```yaml
 * name: API Support
 * url: http://www.swagger.io/support
 * email: support@swagger.io
 * ```
 */
export interface ContactObject {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: unknown;
  /**
   * The email address of the contact person/organization. MUST be in the format of an email address.
   */
  email?: string;
  /**
   * The identifying name of the contact person/organization.
   */
  name?: string;
  /**
   * The URL pointing to the contact information. MUST be in the format of a URL.
   */
  url?: string;
}

/**
 * An object to hold data types that can be consumed and produced by operations. These data types can be primitives, arrays or models.
 *
 * **Definitions Object Example**
 *
 * @example
 * ```yaml
 * Category:
 *   type: object
 *   properties:
 *     id:
 *       type: integer
 *       format: int64
 *     name:
 *       type: string
 * Tag:
 *   type: object
 *   properties:
 *     id:
 *       type: integer
 *       format: int64
 *     name:
 *       type: string
 * ```
 */
export interface DefinitionsObject {
  /**
   * A single definition, mapping a "name" to the schema it defines.
   */
  [name: string]: SchemaObject;
}

/**
 * Allows sharing examples for operation responses.
 *
 * **Example Object Example**
 *
 * Example response for application/json mimetype of a Pet data type:
 *
 * @example
 * ```yaml
 * application/json:
 *   name: Puma
 *   type: Dog
 *   color: Black
 *   gender: Female
 *   breed: Mixed
 * ```
 */
export interface ExampleObject {
  /**
   * The name of the property MUST be one of the Operation `produces` values (either implicit or inherited). The value SHOULD be an example of what such a response would look like.
   */
  [mimeType: string]: unknown;
}

/**
 * Allows referencing an external resource for extended documentation.
 *
 * @example
 * ```yaml
 * description: Find more info here
 * url: https://swagger.io
 * ```
 */
export interface ExternalDocumentationObject {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: unknown;
  /**
   * A short description of the target documentation. {@link https://guides.github.com/features/mastering-markdown/#GitHub-flavored-markdown GFM syntax} can be used for rich text representation.
   */
  description?: string;
  /**
   * **Required**. The URL for the target documentation. Value MUST be in the format of a URL.
   */
  url: string;
}

/**
 * **Header Object Example**
 *
 * A simple header with of an integer type:
 *
 * @example
 * ```yaml
 * description: The number of allowed requests in the current period
 * type: integer
 * ```
 */
export interface HeaderObject extends EnumExtensions, OpenAPIV2NullableExtensions {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: unknown;
  /**
   * Determines the format of the array if type array is used. Possible values are:
   *
   * - `csv` - comma separated values `foo,bar`.
   * - `ssv` - space separated values `foo bar`.
   * - `tsv` - tab separated values `foo\tbar`.
   * - `pipes` - pipe separated values `foo|bar`.
   *
   * Default value is `csv`.
   */
  collectionFormat?: 'csv' | 'pipes' | 'ssv' | 'tsv';
  /**
   * Declares the value of the item that the server will use if none is provided. (Note: "default" has no meaning for required items.) See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-6.2 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-6.2}. Unlike JSON Schema this value MUST conform to the defined {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#itemsType `type`} for the data type.
   */
  default?: unknown;
  /**
   * A short description of the header.
   */
  description?: string;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.1 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.1}.
   */
  enum?: Array<unknown>;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2}.
   */
  exclusiveMaximum?: boolean;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3}.
   */
  exclusiveMinimum?: boolean;
  /**
   * The extending format for the previously mentioned {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#stType `type`}. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#dataTypeFormat Data Type Formats} for further details.
   */
  format?: string;
  /**
   * **Required if {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterType `type`} is "array"**. Describes the type of items in the array.
   */
  items?: ItemsObject;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.2 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.2}.
   */
  maxItems?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.1 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.1}.
   */
  maxLength?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2}.
   */
  maximum?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.3 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.3}.
   */
  minItems?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.2 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.2}.
   */
  minLength?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3}.
   */
  minimum?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.1 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.1}.
   */
  multipleOf?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.3 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.3}.
   */
  pattern?: string;
  /**
   * Required. The type of the object. The value MUST be one of `"string"`, `"number"`, `"integer"`, `"boolean"`, or `"array"`.
   */
  type: 'array' | 'boolean' | 'integer' | 'number' | 'string';
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.4 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.4}.
   */
  uniqueItems?: boolean;
}

/**
 * Lists the headers that can be sent as part of a response.
 *
 * **Headers Object Example**
 *
 * Rate-limit headers:
 *
 * @example
 * ```yaml
 * X-Rate-Limit-Limit:
 *   description: The number of allowed requests in the current period
 *   type: integer
 * X-Rate-Limit-Remaining:
 *   description: The number of remaining requests in the current period
 *   type: integer
 * X-Rate-Limit-Reset:
 *   description: The number of seconds left in the current period
 *   type: integer
 * ```
 */
export interface HeadersObject {
  /**
   * The name of the property corresponds to the name of the header. The value describes the type of the header.
   */
  [name: string]: HeaderObject;
}

/**
 * The object provides metadata about the API. The metadata can be used by the clients if needed, and can be presented in the Swagger-UI for convenience.
 *
 * @example
 * ```yaml
 * title: Swagger Sample App
 * description: This is a sample server Petstore server.
 * termsOfService: http://swagger.io/terms/
 * contact:
 *   name: API Support
 *   url: http://www.swagger.io/support
 *   email: support@swagger.io
 * license:
 *   name: Apache 2.0
 *   url: http://www.apache.org/licenses/LICENSE-2.0.html
 * version: 1.0.1
 * ```
 */
export interface InfoObject {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: unknown;
  /**
   * The contact information for the exposed API.
   */
  contact?: ContactObject;
  /**
   * A short description of the application. {@link https://guides.github.com/features/mastering-markdown/#GitHub-flavored-markdown GFM syntax} can be used for rich text representation.
   */
  description?: string;
  /**
   * The license information for the exposed API.
   */
  license?: LicenseObject;
  /**
   * The Terms of Service for the API.
   */
  termsOfService?: string;
  /**
   * **Required**. The title of the application.
   */
  title: string;
  /**
   * **Required** Provides the version of the application API (not to be confused with the specification version).
   */
  version: string;
}

/**
 * A limited subset of JSON-Schema's items object. It is used by parameter definitions that are not located {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterIn `in`} `"body"`.
 *
 * **Items Object Examples**
 *
 * Items must be of type string and have the minimum length of 2 characters:
 *
 * @example
 * ```yaml
 * type: string
 * minLength: 2
 * ```
 *
 * An array of arrays, the internal array being of type integer, numbers must be between 0 and 63 (inclusive):
 *
 * @example
 * ```yaml
 * type: array
 * items:
 *   type: integer
 *   minimum: 0
 *   maximum: 63
 * ```
 */
export interface ItemsObject extends EnumExtensions, OpenAPIV2NullableExtensions {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: unknown;
  /**
   * Determines the format of the array if type array is used. Possible values are:
   *
   * - `csv` - comma separated values `foo,bar`.
   * - `ssv` - space separated values `foo bar`.
   * - `tsv` - tab separated values `foo\tbar`.
   * - `pipes` - pipe separated values `foo|bar`.
   *
   * Default value is `csv`.
   */
  collectionFormat?: 'csv' | 'pipes' | 'ssv' | 'tsv';
  /**
   * Declares the value of the item that the server will use if none is provided. (Note: "default" has no meaning for required items.) See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-6.2 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-6.2}. Unlike JSON Schema this value MUST conform to the defined {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#itemsType `type`} for the data type.
   */
  default?: unknown;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.1 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.1}.
   */
  enum?: Array<unknown>;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2}.
   */
  exclusiveMaximum?: boolean;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3}.
   */
  exclusiveMinimum?: boolean;
  /**
   * The extending format for the previously mentioned {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterType `type`}. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#dataTypeFormat Data Type Formats} for further details.
   */
  format?: string;
  /**
   * **Required if {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterType `type`} is "array"**. Describes the type of items in the array.
   */
  items?: ItemsObject;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.2 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.2}.
   */
  maxItems?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.1 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.1}.
   */
  maxLength?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2}.
   */
  maximum?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.3 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.3}.
   */
  minItems?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.2 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.2}.
   */
  minLength?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3}.
   */
  minimum?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.1 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.1}.
   */
  multipleOf?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.3 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.3}.
   */
  pattern?: string;
  /**
   * **Required**. The internal type of the array. The value MUST be one of `"string"`, `"number"`, `"integer"`, `"boolean"`, or `"array"`. Files and models are not allowed.
   */
  type: 'array' | 'boolean' | 'integer' | 'number' | 'string';
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.4 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.4}.
   */
  uniqueItems?: boolean;
}

/**
 * License information for the exposed API.
 *
 * @example
 * ```yaml
 * name: Apache 2.0
 * url: http://www.apache.org/licenses/LICENSE-2.0.html
 * ```
 */
export interface LicenseObject {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: unknown;
  /**
   * **Required**. The license name used for the API.
   */
  name: string;
  /**
   * A URL to the license used for the API. MUST be in the format of a URL.
   */
  url?: string;
}

/**
 * Describes a single API operation on a path.
 *
 * @example
 * ```yaml
 * tags:
 * - pet
 * summary: Updates a pet in the store with form data
 * description: ""
 * operationId: updatePetWithForm
 * consumes:
 * - application/x-www-form-urlencoded
 * produces:
 * - application/json
 * - application/xml
 * parameters:
 * - name: petId
 *   in: path
 *   description: ID of pet that needs to be updated
 *   required: true
 *   type: string
 * - name: name
 *   in: formData
 *   description: Updated name of the pet
 *   required: false
 *   type: string
 * - name: status
 *   in: formData
 *   description: Updated status of the pet
 *   required: false
 *   type: string
 * responses:
 *   '200':
 *     description: Pet updated.
 *   '405':
 *     description: Invalid input
 * security:
 * - petstore_auth:
 *   - write:pets
 *   - read:pets
 * ```
 */
export interface OperationObject {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: unknown;
  /**
   * A list of MIME types the operation can consume. This overrides the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#swaggerConsumes `consumes`} definition at the Swagger Object. An empty value MAY be used to clear the global definition. Value MUST be as described under {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#mime-types Mime Types}.
   */
  consumes?: Array<string>;
  /**
   * Declares this operation to be deprecated. Usage of the declared operation should be refrained. Default value is `false`.
   */
  deprecated?: boolean;
  /**
   * A verbose explanation of the operation behavior. {@link https://guides.github.com/features/mastering-markdown/#GitHub-flavored-markdown GFM syntax} can be used for rich text representation.
   */
  description?: string;
  /**
   * Additional external documentation for this operation.
   */
  externalDocs?: ExternalDocumentationObject;
  /**
   * Unique string used to identify the operation. The id MUST be unique among all operations described in the API. Tools and libraries MAY use the operationId to uniquely identify an operation, therefore, it is recommended to follow common programming naming conventions.
   */
  operationId?: string;
  /**
   * A list of parameters that are applicable for this operation. If a parameter is already defined at the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#pathItemParameters Path Item}, the new definition will override it, but can never remove it. The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterName name} and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterIn location}. The list can use the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#reference-object Reference Object} to link to parameters that are defined at the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#swaggerParameters Swagger Object's parameters}. There can be one "body" parameter at most.
   */
  parameters?: Array<ParameterObject | ReferenceObject>;
  /**
   * A list of MIME types the operation can produce. This overrides the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#swaggerProduces `produces`} definition at the Swagger Object. An empty value MAY be used to clear the global definition. Value MUST be as described under {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#mime-types Mime Types}.
   */
  produces?: Array<string>;
  /**
   * **Required**. The list of possible responses as they are returned from executing this operation.
   */
  responses: ResponsesObject;
  /**
   * The transfer protocol for the operation. Values MUST be from the list: `"http"`, `"https"`, `"ws"`, `"wss"`. The value overrides the Swagger Object {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#swaggerSchemes `schemes`} definition.
   */
  schemes?: Array<'http' | 'https' | 'ws' | 'wss'>;
  /**
   * A declaration of which security schemes are applied for this operation. The list of values describes alternative security schemes that can be used (that is, there is a logical OR between the security requirements). This definition overrides any declared top-level {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#swaggerSecurity `security`}. To remove a top-level security declaration, an empty array can be used.
   */
  security?: Array<SecurityRequirementObject>;
  /**
   * A short summary of what the operation does. For maximum readability in the swagger-ui, this field SHOULD be less than 120 characters.
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
 * A unique parameter is defined by a combination of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterName name} and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterIn location}.
 *
 * There are five possible parameter types.
 *
 * - Path - Used together with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#path-templating Path Templating}, where the parameter value is actually part of the operation's URL. This does not include the host or base path of the API. For example, in `/items/{itemId}`, the path parameter is `itemId`.
 * - Query - Parameters that are appended to the URL. For example, in `/items?id=###`, the query parameter is `id`.
 * - Header - Custom headers that are expected as part of the request.
 * - Body - The payload that's appended to the HTTP request. Since there can only be one payload, there can only be _one_ body parameter. The name of the body parameter has no effect on the parameter itself and is used for documentation purposes only. Since Form parameters are also in the payload, body and form parameters cannot exist together for the same operation.
 * - Form - Used to describe the payload of an HTTP request when either `application/x-www-form-urlencoded`, `multipart/form-data` or both are used as the content type of the request (in Swagger's definition, the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#operationConsumes `consumes`} property of an operation). This is the only parameter type that can be used to send files, thus supporting the `file` type. Since form parameters are sent in the payload, they cannot be declared together with a body parameter for the same operation. Form parameters have a different format based on the content-type used (for further details, consult {@link http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4 http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4}):
 *   - `application/x-www-form-urlencoded` - Similar to the format of Query parameters but as a payload. For example, `foo=1&bar=swagger` - both `foo` and `bar` are form parameters. This is normally used for simple parameters that are being transferred.
 *   - `multipart/form-data` - each parameter takes a section in the payload with an internal header. For example, for the header `Content-Disposition: form-data; name="submit-name"` the name of the parameter is `submit-name`. This type of form parameters is more commonly used for file transfers.
 *
 * **Parameter Object Examples**
 *
 * Body Parameters
 *
 * A body parameter with a referenced schema definition (normally for a model definition):
 *
 * @example
 * ```yaml
 * name: user
 * in: body
 * description: user to add to the system
 * required: true
 * schema:
 *   $ref: '#/definitions/User'
 * ```
 *
 * A body parameter that is an array of string values:
 *
 * @example
 * ```yaml
 * name: user
 * in: body
 * description: user to add to the system
 * required: true
 * schema:
 *   type: array
 *   items:
 *     type: string
 * ```
 *
 * Other Parameters
 *
 * A header parameter with an array of 64 bit integer numbers:
 *
 * @example
 * ```yaml
 * name: token
 * in: header
 * description: token to be passed as a header
 * required: true
 * type: array
 * items:
 *   type: integer
 *   format: int64
 * collectionFormat: csv
 * ```
 *
 * A path parameter of a string value:
 *
 * @example
 * ```yaml
 * name: username
 * in: path
 * description: username to fetch
 * required: true
 * type: string
 * ```
 *
 * An optional query parameter of a string value, allowing multiple values by repeating the query parameter:
 *
 * @example
 * ```yaml
 * name: id
 * in: query
 * description: ID of the object to fetch
 * required: false
 * type: array
 * items:
 *   type: string
 * collectionFormat: multi
 * ```
 *
 * A form data with file type for a file upload:
 *
 * @example
 * ```yaml
 * name: avatar
 * in: formData
 * description: The avatar of the user
 * required: true
 * type: file
 * ```
 */
export type ParameterObject = EnumExtensions &
  OpenAPIV2NullableExtensions & {
    /**
     * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
     */
    [name: `x-${string}`]: unknown;
    /**
     * A brief description of the parameter. This could contain examples of use. {@link https://guides.github.com/features/mastering-markdown/#GitHub-flavored-markdown GFM syntax} can be used for rich text representation.
     */
    description?: string;
    /**
     * **Required**. The name of the parameter. Parameter names are _case sensitive_.
     *
     * - If {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterIn `in`} is `"path"`, the `name` field MUST correspond to the associated path segment from the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#pathsPath path} field in the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#paths-object Paths Object}. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#path-templating Path Templating} for further information.
     * - For all other cases, the `name` corresponds to the parameter name used based on the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterIn `in`} property.
     */
    name: string;
    /**
     * Determines whether this parameter is mandatory. If the parameter is {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterIn `in`} "path", this property is **required** and its value MUST be `true`. Otherwise, the property MAY be included and its default value is `false`.
     */
    required?: boolean;
  } & (
    | {
        /**
         * **Required**. The location of the parameter. Possible values are "query", "header", "path", "formData" or "body".
         */
        in: 'body';
        /**
         * **Required**. The schema defining the type used for the body parameter.
         */
        schema: SchemaObject;
      }
    | {
        /**
         * Sets the ability to pass empty-valued parameters. This is valid only for either `query` or `formData` parameters and allows you to send a parameter with a name only or an empty value. Default value is `false`.
         */
        allowEmptyValue?: boolean;
        /**
         * Determines the format of the array if type array is used. Possible values are:
         *
         * - `csv` - comma separated values `foo,bar`.
         * - `ssv` - space separated values `foo bar`.
         * - `tsv` - tab separated values `foo\tbar`.
         * - `pipes` - pipe separated values `foo|bar`.
         * - `multi` - corresponds to multiple parameter instances instead of multiple values for a single instance `foo=bar&foo=baz`. This is valid only for parameters {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterIn `in`} "query" or "formData".
         *
         * Default value is `csv`.
         */
        collectionFormat?: 'csv' | 'multi' | 'pipes' | 'ssv' | 'tsv';
        /**
         * Declares the value of the parameter that the server will use if none is provided, for example a "count" to control the number of results per page might default to 100 if not supplied by the client in the request. (Note: "default" has no meaning for required parameters.) See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-6.2 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-6.2}. Unlike JSON Schema this value MUST conform to the defined {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterType `type`} for this parameter.
         */
        default?: unknown;
        /**
         * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.1 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.1}.
         */
        enum?: Array<unknown>;
        /**
         * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2}.
         */
        exclusiveMaximum?: boolean;
        /**
         * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3}.
         */
        exclusiveMinimum?: boolean;
        /**
         * The extending format for the previously mentioned {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterType `type`}. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#dataTypeFormat Data Type Formats} for further details.
         */
        format?: string;
        /**
         * **Required**. The location of the parameter. Possible values are "query", "header", "path", "formData" or "body".
         */
        in: 'formData' | 'header' | 'path' | 'query';
        /**
         * **Required if {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterType `type`} is "array"**. Describes the type of items in the array.
         */
        items?: ItemsObject;
        /**
         * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.2 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.2}.
         */
        maxItems?: number;
        /**
         * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.1 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.1}.
         */
        maxLength?: number;
        /**
         * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2}.
         */
        maximum?: number;
        /**
         * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.3 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.3}.
         */
        minItems?: number;
        /**
         * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.2 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.2}.
         */
        minLength?: number;
        /**
         * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3}.
         */
        minimum?: number;
        /**
         * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.1 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.1}.
         */
        multipleOf?: number;
        /**
         * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.3 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.3}.
         */
        pattern?: string;
        /**
         * **Required**. The type of the parameter. Since the parameter is not located at the request body, it is limited to simple types (that is, not an object). The value MUST be one of `"string"`, `"number"`, `"integer"`, `"boolean"`, `"array"` or `"file"`. If `type` is `"file"`, the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#operationConsumes `consumes`} MUST be either `"multipart/form-data"`, `"application/x-www-form-urlencoded"` or both and the parameter MUST be {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterIn `in`} `"formData"`.
         */
        type: 'array' | 'boolean' | 'file' | 'integer' | 'number' | 'string';
        /**
         * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.4 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.4}.
         */
        uniqueItems?: boolean;
      }
  );

/**
 * An object to hold parameters to be reused across operations. Parameter definitions can be referenced to the ones defined here.
 *
 * This does _not_ define global operation parameters.
 *
 * **Parameters Definition Object Example**
 *
 * @example
 * ```yaml
 * skipParam:
 *   name: skip
 *   in: query
 *   description: number of items to skip
 *   required: true
 *   type: integer
 *   format: int32
 * limitParam:
 *   name: limit
 *   in: query
 *   description: max records to return
 *   required: true
 *   type: integer
 *   format: int32
 * ```
 */
export interface ParametersDefinitionsObject {
  /**
   * A single parameter definition, mapping a "name" to the parameter it defines.
   */
  [name: string]: ParameterObject;
}

/**
 * Describes the operations available on a single path. A Path Item may be empty, due to {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#security-filtering ACL constraints}. The path itself is still exposed to the documentation viewer but they will not know which operations and parameters are available.
 *
 * @example
 * ```yaml
 * get:
 *   description: Returns pets based on ID
 *   summary: Find pets by ID
 *   operationId: getPetsById
 *   produces:
 *   - application/json
 *   - text/html
 *   responses:
 *     '200':
 *       description: pet response
 *       schema:
 *         type: array
 *         items:
 *           $ref: '#/definitions/Pet'
 *     default:
 *       description: error payload
 *       schema:
 *         $ref: '#/definitions/ErrorModel'
 * parameters:
 * - name: id
 *   in: path
 *   description: ID of pet to use
 *   required: true
 *   type: array
 *   items:
 *     type: string
 *   collectionFormat: csv
 * ```
 */
export interface PathItemObject {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: unknown;
  /**
   * Allows for an external definition of this path item. The referenced structure MUST be in the format of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#path-item-object Path Item Object}. If there are conflicts between the referenced definition and this Path Item's definition, the behavior is _undefined_.
   */
  $ref?: string;
  /**
   * A definition of a DELETE operation on this path.
   */
  delete?: OperationObject;
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
   * A list of parameters that are applicable for all the operations described under this path. These parameters can be overridden at the operation level, but cannot be removed there. The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterName name} and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterIn location}. The list can use the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#reference-object Reference Object} to link to parameters that are defined at the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#swaggerParameters Swagger Object's parameters}. There can be one "body" parameter at most.
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
}

/**
 * Holds the relative paths to the individual endpoints. The path is appended to the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#swaggerBasePath `basePath`} in order to construct the full URL. The Paths may be empty, due to {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#security-filtering ACL constraints}.
 *
 * @example
 * ```yaml
 * /pets:
 *   get:
 *     description: Returns all pets from the system that the user has access to
 *     produces:
 *     - application/json
 *     responses:
 *       '200':
 *         description: A list of pets.
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/pet'
 * ```
 */
export interface PathsObject {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: unknown;
  /**
   * A relative path to an individual endpoint. The field name MUST begin with a slash. The path is appended to the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#swaggerBasePath `basePath`} in order to construct the full URL. {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#path-templating Path templating} is allowed.
   */
  [path: `/${string}`]: PathItemObject;
}

/**
 * A simple object to allow referencing other definitions in the specification. It can be used to reference parameters and responses that are defined at the top level for reuse.
 *
 * The Reference Object is a {@link http://tools.ietf.org/html/draft-pbryan-zyp-json-ref-02 JSON Reference} that uses a {@link http://tools.ietf.org/html/rfc6901 JSON Pointer} as its value. For this specification, only {@link https://tools.ietf.org/html/draft-zyp-json-schema-04#section-7.2.3 canonical dereferencing} is supported.
 *
 * **Reference Object Example**
 *
 * @example
 * ```yaml
 * $ref: '#/definitions/Pet'
 * ```
 *
 * **Relative Schema File Example**
 *
 * @example
 * ```yaml
 * $ref: 'Pet.yaml'
 * ```
 *
 * **Relative Files With Embedded Schema Example**
 *
 * @example
 * ```yaml
 * $ref: 'definitions.yaml#/Pet'
 * ```
 */
export interface ReferenceObject {
  /**
   * **Required**. The reference string.
   */
  $ref: string;
}

/**
 * Describes a single response from an API Operation.
 *
 * **Response Object Examples**
 *
 * Response of an array of a complex type:
 *
 * @example
 * ```yaml
 * description: A complex object array response
 * schema:
 *   type: array
 *   items:
 *     $ref: '#/definitions/VeryComplexType'
 * ```
 *
 * Response with a string type:
 *
 * @example
 * ```yaml
 * description: A simple string response
 * schema:
 *   type: string
 * ```
 *
 * Response with headers:
 *
 * @example
 * ```yaml
 * description: A simple string response
 * schema:
 *   type: string
 * headers:
 *   X-Rate-Limit-Limit:
 *     description: The number of allowed requests in the current period
 *     type: integer
 *   X-Rate-Limit-Remaining:
 *     description: The number of remaining requests in the current period
 *     type: integer
 *   X-Rate-Limit-Reset:
 *     description: The number of seconds left in the current period
 *     type: integer
 * ```
 *
 * Response with no return value:
 *
 * @example
 * ```yaml
 * description: object created
 * ```
 */
export interface ResponseObject {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: unknown;
  /**
   * **Required**. A short description of the response. {@link https://guides.github.com/features/mastering-markdown/#GitHub-flavored-markdown GFM syntax} can be used for rich text representation.
   */
  description: string;
  /**
   * An example of the response message.
   */
  examples?: ExampleObject;
  /**
   * A list of headers that are sent with the response.
   */
  headers?: HeadersObject;
  /**
   * A definition of the response structure. It can be a primitive, an array or an object. If this field does not exist, it means no content is returned as part of the response. As an extension to the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#schema-object Schema Object}, its root `type` value may also be `"file"`. This SHOULD be accompanied by a relevant `produces` mime-type.
   */
  schema?: SchemaObject;
}

/**
 * An object to hold responses to be reused across operations. Response definitions can be referenced to the ones defined here.
 *
 * This does _not_ define global operation responses.
 *
 * **Responses Definitions Object Example**
 *
 * @example
 * ```yaml
 * NotFound:
 *   description: Entity not found.
 * IllegalInput:
 *   description: Illegal input for operation.
 * GeneralError:
 *   description: General Error
 *   schema:
 *     $ref: '#/definitions/GeneralError'
 * ```
 */
export interface ResponsesDefinitionsObject {
  /**
   * A single response definition, mapping a "name" to the response it defines.
   */
  [name: string]: ResponseObject;
}

/**
 * A container for the expected responses of an operation. The container maps a HTTP response code to the expected response. It is not expected from the documentation to necessarily cover all possible HTTP response codes, since they may not be known in advance. However, it is expected from the documentation to cover a successful operation response and any known errors.
 *
 * The `default` can be used as the default response object for all HTTP codes that are not covered individually by the specification.
 *
 * The `Responses Object` MUST contain at least one response code, and it SHOULD be the response for a successful operation call.
 *
 * **Responses Object Example**
 *
 * A 200 response for successful operation and a default response for others (implying an error):
 *
 * @example
 * ```yaml
 * '200':
 *   description: a pet to be returned
 *   schema:
 *     $ref: '#/definitions/Pet'
 * default:
 *   description: Unexpected error
 *   schema:
 *     $ref: '#/definitions/ErrorModel'
 * ```
 */
export interface ResponsesObject {
  /**
   * Any {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#http-status-codes HTTP status code} can be used as the property name (one property per HTTP status code). Describes the expected response for that HTTP status code. {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#reference-object Reference Object} can be used to link to a response that is defined at the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#swaggerResponses Swagger Object's responses} section.
   */
  [httpStatusCode: string]: ResponseObject | ReferenceObject | undefined;
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: any;
  /**
   * The documentation of responses other than the ones declared for specific HTTP response codes. It can be used to cover undeclared responses. {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#reference-object Reference Object} can be used to link to a response that is defined at the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#swaggerResponses Swagger Object's responses} section.
   */
  default?: ResponseObject | ReferenceObject;
}

/**
 * The Schema Object allows the definition of input and output data types. These types can be objects, but also primitives and arrays. This object is based on the {@link http://json-schema.org/ JSON Schema Specification Draft 4} and uses a predefined subset of it. On top of this subset, there are extensions provided by this specification to allow for more complete documentation.
 *
 * Further information about the properties can be found in {@link https://tools.ietf.org/html/draft-zyp-json-schema-04 JSON Schema Core} and {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00 JSON Schema Validation}. Unless stated otherwise, the property definitions follow the JSON Schema specification as referenced here.
 *
 * The following properties are taken directly from the JSON Schema definition and follow the same specifications:
 *
 * - $ref - As a {@link https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03 JSON Reference}
 * - format (See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#dataTypeFormat Data Type Formats} for further details)
 * - title
 * - description ({@link https://guides.github.com/features/mastering-markdown/#GitHub-flavored-markdown GFM syntax} can be used for rich text representation)
 * - default (Unlike JSON Schema, the value MUST conform to the defined type for the Schema Object)
 * - multipleOf
 * - maximum
 * - exclusiveMaximum
 * - minimum
 * - exclusiveMinimum
 * - maxLength
 * - minLength
 * - pattern
 * - maxItems
 * - minItems
 * - uniqueItems
 * - maxProperties
 * - minProperties
 * - required
 * - enum
 * - type
 *
 * The following properties are taken from the JSON Schema definition but their definitions were adjusted to the Swagger Specification. Their definition is the same as the one from JSON Schema, only where the original definition references the JSON Schema definition, the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#schema-object Schema Object} definition is used instead.
 *
 * - items
 * - allOf
 * - properties
 * - additionalProperties
 *
 * Other than the JSON Schema subset fields, the following fields may be used for further schema documentation.
 *
 * **Composition and Inheritance (Polymorphism)**
 *
 * Swagger allows combining and extending model definitions using the `allOf` property of JSON Schema, in effect offering model composition. `allOf` takes in an array of object definitions that are validated _independently_ but together compose a single object.
 *
 * While composition offers model extensibility, it does not imply a hierarchy between the models. To support polymorphism, Swagger adds the support of the `discriminator` field. When used, the `discriminator` will be the name of the property used to decide which schema definition is used to validate the structure of the model. As such, the `discriminator` field MUST be a required field. The value of the chosen property has to be the friendly name given to the model under the `definitions` property. As such, inline schema definitions, which do not have a given id, _cannot_ be used in polymorphism.
 *
 * **XML Modeling**
 *
 * The {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#schemaXml xml} property allows extra definitions when translating the JSON definition to XML. The {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#xml-object XML Object} contains additional information about the available options.
 *
 * **Schema Object Examples**
 *
 * Primitive Sample
 *
 * Unlike previous versions of Swagger, Schema definitions can be used to describe primitive and arrays as well.
 *
 * @example
 * ```yaml
 * type: string
 * format: email
 * ```
 *
 * Simple Model
 *
 * @example
 * ```yaml
 * type: object
 * required:
 * - name
 * properties:
 *   name:
 *     type: string
 *   address:
 *     $ref: '#/definitions/Address'
 *   age:
 *     type: integer
 *     format: int32
 *     minimum: 0
 * ```
 *
 * Model with Map/Dictionary Properties
 *
 * For a simple string to string mapping:
 *
 * @example
 * ```yaml
 * type: object
 * additionalProperties:
 *   type: string
 * ```
 *
 * For a string to model mapping:
 *
 * @example
 * ```yaml
 * type: object
 * additionalProperties:
 *   $ref: '#/definitions/ComplexModel'
 * ```
 *
 * Model with Example
 *
 * @example
 * ```yaml
 * type: object
 * properties:
 *   id:
 *     type: integer
 *     format: int64
 *   name:
 *     type: string
 * required:
 * - name
 * example:
 *   name: Puma
 *   id: 1
 * ```
 *
 * Models with Composition
 *
 * @example
 * ```yaml
 * definitions:
 *   ErrorModel:
 *     type: object
 *     required:
 *     - message
 *     - code
 *     properties:
 *       message:
 *         type: string
 *       code:
 *         type: integer
 *         minimum: 100
 *         maximum: 600
 *   ExtendedErrorModel:
 *     allOf:
 *     - $ref: '#/definitions/ErrorModel'
 *     - type: object
 *       required:
 *       - rootCause
 *       properties:
 *         rootCause:
 *           type: string
 * ```
 *
 * Models with Polymorphism Support
 *
 * @example
 * ```yaml
 * definitions:
 *   Pet:
 *     type: object
 *     discriminator: petType
 *     properties:
 *       name:
 *         type: string
 *       petType:
 *         type: string
 *     required:
 *     - name
 *     - petType
 *   Cat:
 *     description: A representation of a cat
 *     allOf:
 *     - $ref: '#/definitions/Pet'
 *     - type: object
 *       properties:
 *         huntingSkill:
 *           type: string
 *           description: The measured skill for hunting
 *           default: lazy
 *           enum:
 *           - clueless
 *           - lazy
 *           - adventurous
 *           - aggressive
 *       required:
 *       - huntingSkill
 *   Dog:
 *     description: A representation of a dog
 *     allOf:
 *     - $ref: '#/definitions/Pet'
 *     - type: object
 *       properties:
 *         packSize:
 *           type: integer
 *           format: int32
 *           description: the size of the pack the dog is from
 *           default: 0
 *           minimum: 0
 *       required:
 *       - packSize
 * ```
 */
export interface SchemaObject
  extends Omit<JSONSchemaDraft4, 'type'>, EnumExtensions, OpenAPIV2NullableExtensions {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: unknown;
  /**
   * The `additionalProperties` keyword is used to control the handling of extra stuff, that is, properties whose names are not listed in the `properties` keyword or match any of the regular expressions in the `patternProperties` keyword. By default any additional properties are allowed.
   *
   * The value of the `additionalProperties` keyword is a schema that will be used to validate any properties in the {@link https://json-schema.org/learn/glossary#instance instance} that are not matched by `properties` or `patternProperties`. Setting the `additionalProperties` schema to `false` means no additional properties will be allowed.
   *
   * It's important to note that `additionalProperties` only recognizes properties declared in the same {@link https://json-schema.org/learn/glossary#subschema subschema} as itself. So, `additionalProperties` can restrict you from "extending" a schema using {@link https://json-schema.org/understanding-json-schema/reference/combining combining} keywords such as {@link https://json-schema.org/understanding-json-schema/reference/combining#allof allOf}.
   */
  additionalProperties?: SchemaObject | boolean;
  /**
   * `allOf`: (AND) Must be valid against _all_ of the {@link https://json-schema.org/learn/glossary#subschema subschemas}
   *
   * To validate against `allOf`, the given data must be valid against all of the given subschemas.
   *
   * {@link https://json-schema.org/understanding-json-schema/reference/combining#allof allOf} can not be used to "extend" a schema to add more details to it in the sense of object-oriented inheritance. {@link https://json-schema.org/learn/glossary#instance Instances} must independently be valid against "all of" the schemas in the `allOf`. See the section on {@link https://json-schema.org/understanding-json-schema/reference/object#extending Extending Closed Schemas} for more information.
   */
  allOf?: Array<SchemaObject>;
  /**
   * Adds support for polymorphism. The discriminator is the schema property name that is used to differentiate between other schema that inherit this schema. The property name used MUST be defined at this schema and it MUST be in the `required` property list. When used, the value MUST be the name of this schema or any schema that inherits it.
   */
  discriminator?: string;
  /**
   * A free-form property to include an example of an instance for this schema.
   */
  example?: unknown;
  /**
   * Additional external documentation for this schema.
   */
  externalDocs?: ExternalDocumentationObject;
  /**
   * List validation is useful for arrays of arbitrary length where each item matches the same schema. For this kind of array, set the `items` {@link https://json-schema.org/learn/glossary#keyword keyword} to a single schema that will be used to validate all of the items in the array.
   *
   * The `items` keyword can be used to control whether it's valid to have additional items in a tuple beyond what is defined in `prefixItems`. The value of the `items` keyword is a schema that all additional items must pass in order for the keyword to validate.
   *
   * Note that `items` doesn't "see inside" any {@link https://json-schema.org/learn/glossary#instance instances} of `allOf`, `anyOf`, or `oneOf` in the same {@link https://json-schema.org/learn/glossary#subschema subschema}.
   */
  items?: SchemaObject;
  /**
   * The properties (key-value pairs) on an object are defined using the `properties` {@link https://json-schema.org/learn/glossary#keyword keyword}. The value of `properties` is an object, where each key is the name of a property and each value is a {@link https://json-schema.org/learn/glossary#schema schema} used to validate that property. Any property that doesn't match any of the property names in the `properties` keyword is ignored by this keyword.
   */
  properties?: Record<string, SchemaObject>;
  /**
   * Relevant only for Schema `"properties"` definitions. Declares the property as "read only". This means that it MAY be sent as part of a response but MUST NOT be sent as part of the request. Properties marked as `readOnly` being `true` SHOULD NOT be in the `required` list of the defined schema. Default value is `false`.
   */
  readOnly?: boolean;
  /**
   * Primitive data types in the Swagger Specification are based on the types supported by the {@link https://tools.ietf.org/html/draft-zyp-json-schema-04#section-3.5 JSON-Schema Draft 4}. Models are described using the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#schema-object Schema Object} which is a subset of JSON Schema Draft 4.
   *
   * `'file'` is a Swagger 2.0 extension of draft-04: the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#responseObject Response Object} allows a schema of `type: file` to describe a downloadable file response.
   */
  type?: SchemaType;
  /**
   * This MAY be used only on properties schemas. It has no effect on root schemas. Adds Additional metadata to describe the XML representation format of this property.
   */
  xml?: XMLObject;
}

/**
 * The primitive data types supported by a Swagger 2.0 {@link SchemaObject}:
 * the JSON Schema Draft 4 types plus the Swagger-only `'file'` extension
 * used to describe downloadable file responses.
 */
export type SchemaType = JsonSchemaTypes | 'file';

/**
 * Lists the available scopes for an OAuth2 security scheme.
 *
 * **Scopes Object Example**
 *
 * @example
 * ```yaml
 * write:pets: modify pets in your account
 * read:pets: read your pets
 * ```
 */
export interface ScopesObject {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: any;
  /**
   * Maps between a name of a scope to a short description of it (as the value of the property).
   */
  [name: string]: string;
}

/**
 * A declaration of the security schemes available to be used in the specification. This does not enforce the security schemes on the operations and only serves to provide the relevant details for each scheme.
 *
 * **Security Definitions Object Example**
 *
 * @example
 * ```yaml
 * api_key:
 *   type: apiKey
 *   name: api_key
 *   in: header
 * petstore_auth:
 *   type: oauth2
 *   authorizationUrl: http://swagger.io/api/oauth/dialog
 *   flow: implicit
 *   scopes:
 *     write:pets: modify pets in your account
 *     read:pets: read your pets
 * ```
 */
export interface SecurityDefinitionsObject {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: any;
  /**
   * A single security scheme definition, mapping a "name" to the scheme it defines.
   */
  [name: string]: SecuritySchemeObject;
}

/**
 * Lists the required security schemes to execute this operation. The object can have multiple security schemes declared in it which are all required (that is, there is a logical AND between the schemes).
 *
 * The name used for each property MUST correspond to a security scheme declared in the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#security-definitions-object Security Definitions}.
 *
 * **Security Requirement Object Examples**
 *
 * Non-OAuth2 Security Requirement
 *
 * @example
 * ```yaml
 * api_key: []
 * ```
 *
 * OAuth2 Security Requirement
 *
 * @example
 * ```yaml
 * petstore_auth:
 * - write:pets
 * - read:pets
 * ```
 */
export interface SecurityRequirementObject {
  /**
   * Each name must correspond to a security scheme which is declared in the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#securityDefinitions Security Definitions}. If the security scheme is of type `"oauth2"`, then the value is a list of scope names required for the execution. For other security scheme types, the array MUST be empty.
   */
  [name: string]: Array<string>;
}

/**
 * Allows the definition of a security scheme that can be used by the operations. Supported schemes are basic authentication, an API key (either as a header or as a query parameter) and OAuth2's common flows (implicit, password, application and access code).
 *
 * **Security Scheme Object Example**
 *
 * Basic Authentication Sample
 *
 * @example
 * ```yaml
 * type: basic
 * ```
 *
 * API Key Sample
 *
 * @example
 * ```yaml
 * type: apiKey
 * name: api_key
 * in: header
 * ```
 *
 * Implicit OAuth2 Sample
 *
 * @example
 * ```yaml
 * type: oauth2
 * authorizationUrl: http://swagger.io/api/oauth/dialog
 * flow: implicit
 * scopes:
 *   write:pets: modify pets in your account
 *   read:pets: read your pets
 * ```
 */
export type SecuritySchemeObject = {
  /**
   * A short description for security scheme.
   */
  description?: string;
} & (
  | {
      /**
       * **Required** The location of the API key. Valid values are `"query"` or `"header"`.
       */
      in: 'header' | 'query';
      /**
       * **Required**. The name of the header or query parameter to be used.
       */
      name: string;
      /**
       * **Required**. The type of the security scheme. Valid values are `"basic"`, `"apiKey"` or `"oauth2"`.
       */
      type: 'apiKey';
    }
  | {
      /**
       * **Required (`"implicit"`, `"accessCode"`)**. The authorization URL to be used for this flow. This SHOULD be in the form of a URL.
       */
      authorizationUrl?: string;
      /**
       * **Required**. The flow used by the OAuth2 security scheme. Valid values are `"implicit"`, `"password"`, `"application"` or `"accessCode"`.
       */
      flow: 'accessCode' | 'application' | 'implicit' | 'password';
      /**
       * **Required**. The available scopes for the OAuth2 security scheme.
       */
      scopes: ScopesObject;
      /**
       * **Required (`"password"`, `"application"`, `"accessCode"`)**. The token URL to be used for this flow. This SHOULD be in the form of a URL.
       */
      tokenUrl?: string;
      /**
       * **Required**. The type of the security scheme. Valid values are `"basic"`, `"apiKey"` or `"oauth2"`.
       */
      type: 'oauth2';
    }
  | {
      /**
       * **Required**. The type of the security scheme. Valid values are `"basic"`, `"apiKey"` or `"oauth2"`.
       */
      type: 'basic';
    }
);

/**
 * Allows adding meta data to a single tag that is used by the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#operation-object Operation Object}. It is not mandatory to have a Tag Object per tag used there.
 *
 * **Tag Object Example**
 *
 * @example
 * ```yaml
 * name: pet
 * description: Pets operations
 * ```
 */
export interface TagObject {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: unknown;
  /**
   * A short description for the tag. {@link https://guides.github.com/features/mastering-markdown/#GitHub-flavored-markdown GFM syntax} can be used for rich text representation.
   */
  description?: string;
  /**
   * Additional external documentation for this tag.
   */
  externalDocs?: ExternalDocumentationObject;
  /**
   * **Required**. The name of the tag.
   */
  name: string;
}

/**
 * A metadata object that allows for more fine-tuned XML model definitions.
 *
 * When using arrays, XML element names are _not_ inferred (for singular/plural forms) and the `name` property should be used to add that information. See examples for expected behavior.
 */
export interface XMLObject {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: unknown;
  /**
   * Declares whether the property definition translates to an attribute instead of an element. Default value is `false`.
   */
  attribute?: boolean;
  /**
   * Replaces the name of the element/attribute used for the described schema property. When defined within the Items Object (`items`), it will affect the name of the individual XML elements within the list. When defined alongside `type` being `array` (outside the `items`), it will affect the wrapping element and only if `wrapped` is `true`. If `wrapped` is `false`, it will be ignored.
   */
  name?: string;
  /**
   * The URL of the namespace definition. Value SHOULD be in the form of a URL.
   */
  namespace?: string;
  /**
   * The prefix to be used for the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#xmlName name}.
   */
  prefix?: string;
  /**
   * MAY be used only for an array definition. Signifies whether the array is wrapped (for example, `<books><book/><book/></books>`) or unwrapped (`<book/><book/>`). Default value is `false`. The definition takes effect only when defined alongside `type` being `array` (outside the `items`).
   */
  wrapped?: boolean;
}
