import type { CodeSampleObject } from '../../extensions/code-samples';
import type { EnumExtensions } from '../../extensions/enum';
import type { SpecExtensions } from '../../extensions/spec';
import type { BaseDocument as JSONSchemaDraft2020_12 } from '../../json-schema/draft-2020-12';
import type { OpenAPIV3_1SchemaExtensions } from './extensions';

/**
 * This is the root object of the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#openapi-document OpenAPI document}.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 */
export interface Document extends SpecExtensions {
  /**
   * An element to hold various schemas for the document.
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
   * The default value for the `$schema` keyword within {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#schema-object Schema Objects} contained within this OAS document. This MUST be in the form of a URI.
   */
  jsonSchemaDialect?: string;
  /**
   * **REQUIRED**. This string MUST be the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#versions version number} of the OpenAPI Specification that the OpenAPI document uses. The `openapi` field SHOULD be used by tooling to interpret the OpenAPI document. This is _not_ related to the API {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#infoVersion `info.version`} string.
   */
  openapi: '3.1.0' | '3.1.1' | '3.1.2';
  /**
   * The available paths and operations for the API.
   */
  paths?: PathsObject;
  /**
   * A declaration of which security mechanisms can be used across the API. The list of values includes alternative security requirement objects that can be used. Only one of the security requirement objects need to be satisfied to authorize a request. Individual operations can override this definition. To make security optional, an empty security requirement (`{}`) can be included in the array.
   */
  security?: Array<SecurityRequirementObject>;
  /**
   * An array of Server Objects, which provide connectivity information to a target server. If the `servers` property is not provided, or is an empty array, the default value would be a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#server-object Server Object} with a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#serverUrl url} value of `/`.
   */
  servers?: Array<ServerObject>;
  /**
   * A list of tags used by the document with additional metadata. The order of the tags can be used to reflect on their order by the parsing tools. Not all tags that are used by the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#operation-object Operation Object} must be declared. The tags that are not declared MAY be organized randomly or based on the tools' logic. Each tag name in the list MUST be unique.
   */
  tags?: Array<TagObject>;
  /**
   * The incoming webhooks that MAY be received as part of this API and that the API consumer MAY choose to implement. Closely related to the `callbacks` feature, this section describes requests initiated other than by an API call, for example by an out of band registration. The key name is a unique string to refer to each webhook, while the (optionally referenced) Path Item Object describes a request that may be initiated by the API provider and the expected responses. An {@link https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.1/webhook-example.yaml example} is available.
   */
  webhooks?: Record<string, PathItemObject | ReferenceObject>;
}

/**
 * A map of possible out-of band callbacks related to the parent operation. Each value in the map is a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#path-item-object Path Item Object} that describes a set of requests that may be initiated by the API provider and the expected responses. The key value used to identify the path item object is an expression, evaluated at runtime, that identifies a URL to use for the callback operation.
 *
 * To describe incoming requests from the API provider independent from another API call, use the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#oasWebhooks `webhooks`} field.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * **Key Expression**
 *
 * The key that identifies the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#path-item-object Path Item Object} is a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#runtime-expressions runtime expression} that can be evaluated in the context of a runtime HTTP request/response to identify the URL to be used for the callback request. A simple example might be $request.body#/url. However, using a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#runtime-expressions runtime expression} the complete HTTP message can be accessed. This includes accessing any part of a body that a JSON Pointer {@link https://tools.ietf.org/html/rfc6901 RFC6901} can reference.
 *
 * For example, given the following HTTP request:
 *
 * ```http
 * POST /subscribe/myevent?queryUrl=https://clientdomain.com/stillrunning HTTP/1.1
 * Host: example.org
 * Content-Type: application/json
 * Content-Length: 187
 *
 * {
 *   "failedUrl" : "https://clientdomain.com/failed",
 *   "successUrls" : [
 *     "https://clientdomain.com/fast",
 *     "https://clientdomain.com/medium",
 *     "https://clientdomain.com/slow"
 *   ]
 * }
 *
 * 201 Created
 * Location: https://example.org/subscription/1
 * ```
 *
 * The following examples show how the various expressions evaluate, assuming the callback operation has a path parameter named `eventType` and a query parameter named `queryUrl`.
 *
 * | Expression | Value |
 * | -------- | ------- |
 * | $url | https://example.org/subscribe/myevent?queryUrl=https://clientdomain.com/stillrunning |
 * | $method | POST |
 * | $request.path.eventType | myevent |
 * | $request.query.queryUrl | https://clientdomain.com/stillrunning |
 * | $request.header.content-Type | application/json |
 * | $request.body#/failedUrl | https://clientdomain.com/failed |
 * | $request.body#/successUrls/2 | https://clientdomain.com/medium |
 * | $response.header.Location | https://example.org/subscription/1 |
 *
 * **Callback Object Examples**
 *
 * The following example uses the user provided `queryUrl` query string parameter to define the callback URL. This is an example of how to use a callback object to describe a WebHook callback that goes with the subscription operation to enable registering for the WebHook.
 *
 * ```yaml
 * myCallback:
 *   '{$request.query.queryUrl}':
 *     post:
 *       requestBody:
 *         description: Callback payload
 *         content:
 *           'application/json':
 *             schema:
 *               $ref: '#/components/schemas/SomePayload'
 *       responses:
 *         '200':
 *           description: callback successfully processed
 * ```
 *
 * The following example shows a callback where the server is hard-coded, but the query string parameters are populated from the `id` and `email` property in the request body.
 *
 * ```yaml
 * transactionCallback:
 *   'http://notificationServer.com?transactionId={$request.body#/id}&email={$request.body#/email}':
 *     post:
 *       requestBody:
 *         description: Callback payload
 *         content:
 *           'application/json':
 *             schema:
 *               $ref: '#/components/schemas/SomePayload'
 *       responses:
 *         '200':
 *           description: callback successfully processed
 * ```
 */
export interface CallbackObject extends SpecExtensions {
  /**
   * A Path Item Object, or a reference to one, used to define a callback request and expected responses. A {@link https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.0/callback-example.yaml complete example} is available.
   */
  [expression: string]: PathItemObject | ReferenceObject | unknown;
}

/**
 * Holds a set of reusable objects for different aspects of the OAS. All objects defined within the components object will have no effect on the API unless they are explicitly referenced from properties outside the components object.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * All the fixed fields declared above are objects that MUST use keys that match the regular expression: `^[a-zA-Z0-9\.\-_]+$`.
 *
 * Field Name Examples:
 *
 * ```
 * User
 * User_1
 * User_Name
 * user-name
 * my.org.User
 * ```
 *
 * **Components Object Example**
 *
 * ```yaml
 * components:
 *   schemas:
 *     GeneralError:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *           format: int32
 *         message:
 *           type: string
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *         name:
 *           type: string
 *     Tag:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *         name:
 *           type: string
 *   parameters:
 *     skipParam:
 *       name: skip
 *       in: query
 *       description: number of items to skip
 *       required: true
 *       schema:
 *         type: integer
 *         format: int32
 *     limitParam:
 *       name: limit
 *       in: query
 *       description: max records to return
 *       required: true
 *       schema:
 *         type: integer
 *         format: int32
 *   responses:
 *     NotFound:
 *       description: Entity not found.
 *     IllegalInput:
 *       description: Illegal input for operation.
 *     GeneralError:
 *       description: General Error
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GeneralError'
 *   securitySchemes:
 *     api_key:
 *       type: apiKey
 *       name: api_key
 *       in: header
 *     petstore_auth:
 *       type: oauth2
 *       flows:
 *         implicit:
 *           authorizationUrl: https://example.org/api/oauth/dialog
 *           scopes:
 *             write:pets: modify pets in your account
 *             read:pets: read your pets
 * ```
 */
export interface ComponentsObject extends SpecExtensions {
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#callback-object Callback Objects}.
   */
  callbacks?: Record<string, CallbackObject | ReferenceObject>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#example-object Example Objects}.
   */
  examples?: Record<string, ExampleObject | ReferenceObject>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#header-object Header Objects}.
   */
  headers?: Record<string, HeaderObject | ReferenceObject>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#link-object Link Objects}.
   */
  links?: Record<string, LinkObject | ReferenceObject>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameter-object Parameter Objects}.
   */
  parameters?: Record<string, ParameterObject | ReferenceObject>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#path-item-object Path Item Object}.
   */
  pathItems?: Record<string, PathItemObject | ReferenceObject>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#request-body-object Request Body Objects}.
   */
  requestBodies?: Record<string, RequestBodyObject | ReferenceObject>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#response-object Response Objects}.
   */
  responses?: Record<string, ResponseObject | ReferenceObject>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#schema-object Schema Objects}.
   */
  schemas?: Record<string, Schema>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#security-scheme-object Security Scheme Objects}.
   */
  securitySchemes?: Record<string, SecuritySchemeObject | ReferenceObject>;
}

/**
 * Contact information for the exposed API.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * @example
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
   * The URL pointing to the contact information. This MUST be in the form of a URL.
   */
  url?: string;
}

/**
 * When request bodies or response payloads may be one of a number of different schemas, a `discriminator` object can be used to aid in serialization, deserialization, and validation. The discriminator is a specific object in a schema which is used to inform the consumer of the document of an alternative schema based on the value associated with it.
 *
 * When using the discriminator, _inline_ schemas will not be considered.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * The discriminator object is legal only when using one of the composite keywords `oneOf`, `anyOf`, `allOf`.
 *
 * In OAS 3.0, a response payload MAY be described to be exactly one of any number of types:
 *
 * ```yaml
 * MyResponseType:
 *   oneOf:
 *   - $ref: '#/components/schemas/Cat'
 *   - $ref: '#/components/schemas/Dog'
 *   - $ref: '#/components/schemas/Lizard'
 * ```
 *
 * which means the payload _MUST_, by validation, match exactly one of the schemas described by `Cat`, `Dog`, or `Lizard`. In this case, a discriminator MAY act as a "hint" to shortcut validation and selection of the matching schema which may be a costly operation, depending on the complexity of the schema. We can then describe exactly which field tells us which schema to use:
 *
 * ```yaml
 * MyResponseType:
 *   oneOf:
 *   - $ref: '#/components/schemas/Cat'
 *   - $ref: '#/components/schemas/Dog'
 *   - $ref: '#/components/schemas/Lizard'
 *   discriminator:
 *     propertyName: petType
 * ```
 *
 * The expectation now is that a property with name `petType` _MUST_ be present in the response payload, and the value will correspond to the name of a schema defined in the OAS document. Thus the response payload:
 *
 * ```json
 * {
 *   "id": 12345,
 *   "petType": "Cat"
 * }
 * ```
 *
 * Will indicate that the `Cat` schema be used in conjunction with this payload.
 *
 * In scenarios where the value of the discriminator field does not match the schema name or implicit mapping is not possible, an optional `mapping` definition MAY be used:
 *
 * ```yaml
 * MyResponseType:
 *   oneOf:
 *   - $ref: '#/components/schemas/Cat'
 *   - $ref: '#/components/schemas/Dog'
 *   - $ref: '#/components/schemas/Lizard'
 *   - $ref: 'https://gigantic-server.com/schemas/Monster/schema.json'
 *   discriminator:
 *     propertyName: petType
 *     mapping:
 *       dog: '#/components/schemas/Dog'
 *       monster: 'https://gigantic-server.com/schemas/Monster/schema.json'
 * ```
 *
 * Here the discriminator _value_ of `dog` will map to the schema `#/components/schemas/Dog`, rather than the default (implicit) value of `Dog`. If the discriminator _value_ does not match an implicit or explicit mapping, no schema can be determined and validation SHOULD fail. Mapping keys MUST be string values, but tooling MAY convert response values to strings for comparison.
 *
 * When used in conjunction with the `anyOf` construct, the use of the discriminator can avoid ambiguity where multiple schemas may satisfy a single payload.
 *
 * In both the `oneOf` and `anyOf` use cases, all possible schemas MUST be listed explicitly. To avoid redundancy, the discriminator MAY be added to a parent schema definition, and all schemas comprising the parent schema in an `allOf` construct may be used as an alternate schema.
 *
 * For example:
 *
 * ```yaml
 * components:
 *   schemas:
 *     Pet:
 *       type: object
 *       required:
 *       - petType
 *       properties:
 *         petType:
 *           type: string
 *       discriminator:
 *         propertyName: petType
 *         mapping:
 *           dog: Dog
 *     Cat:
 *       allOf:
 *       - $ref: '#/components/schemas/Pet'
 *       - type: object
 *         # all other properties specific to a `Cat`
 *         properties:
 *           name:
 *             type: string
 *     Dog:
 *       allOf:
 *       - $ref: '#/components/schemas/Pet'
 *       - type: object
 *         # all other properties specific to a `Dog`
 *         properties:
 *           bark:
 *             type: string
 *     Lizard:
 *       allOf:
 *       - $ref: '#/components/schemas/Pet'
 *       - type: object
 *         # all other properties specific to a `Lizard`
 *         properties:
 *           lovesRocks:
 *             type: boolean
 * ```
 *
 * a payload like this:
 *
 * ```json
 * {
 *   "petType": "Cat",
 *   "name": "misty"
 * }
 * ```
 *
 * will indicate that the `Cat` schema be used. Likewise this schema:
 *
 * ```json
 * {
 *   "petType": "dog",
 *   "bark": "soft"
 * }
 * ```
 *
 * will map to `Dog` because of the definition in the `mapping` element.
 */
export interface DiscriminatorObject extends SpecExtensions {
  /**
   * An object to hold mappings between payload values and schema names or references.
   */
  mapping?: Record<string, string>;
  /**
   * **REQUIRED**. The name of the property in the payload that will hold the discriminator value.
   */
  propertyName: string;
}

/**
 * A single encoding definition applied to a single schema property.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * @example
 * ```yaml
 * requestBody:
 *   content:
 *     multipart/form-data:
 *       schema:
 *         type: object
 *         properties:
 *           id:
 *             # default is text/plain
 *             type: string
 *             format: uuid
 *           address:
 *             # default is application/json
 *             type: object
 *             properties: {}
 *           historyMetadata:
 *             # need to declare XML format!
 *             description: metadata in XML format
 *             type: object
 *             properties: {}
 *           profileImage: {}
 *       encoding:
 *         historyMetadata:
 *           # require XML Content-Type in utf-8 encoding
 *           contentType: application/xml; charset=utf-8
 *         profileImage:
 *           # only accept png/jpeg
 *           contentType: image/png, image/jpeg
 *           headers:
 *             X-Rate-Limit-Limit:
 *               description: The number of allowed requests in the current period
 *               schema:
 *                 type: integer
 * ```
 */
export interface EncodingObject extends SpecExtensions {
  /**
   * Determines whether the parameter value SHOULD allow reserved characters, as defined by {@link https://tools.ietf.org/html/rfc3986#section-2.2 RFC3986} `:/?#[]@!$&'()*+,;=` to be included without percent-encoding. The default value is `false`. This property SHALL be ignored if the request body media type is not `application/x-www-form-urlencoded` or `multipart/form-data`. If a value is explicitly defined, then the value of {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#encodingContentType `contentType`} (implicit or explicit) SHALL be ignored.
   */
  allowReserved?: boolean;
  /**
   * The Content-Type for encoding a specific property. Default value depends on the property type: for `object` - `application/json`; for `array` – the default is defined based on the inner type; for all other cases the default is `application/octet-stream`. The value can be a specific media type (e.g. `application/json`), a wildcard media type (e.g. `image/*`), or a comma-separated list of the two types.
   */
  contentType?: string;
  /**
   * When this is true, property values of type `array` or `object` generate separate parameters for each value of the array, or key-value-pair of the map. For other types of properties this property has no effect. When {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#encodingStyle `style`} is `form`, the default value is `true`. For all other styles, the default value is `false`. This property SHALL be ignored if the request body media type is not `application/x-www-form-urlencoded` or `multipart/form-data`. If a value is explicitly defined, then the value of {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#encodingContentType `contentType`} (implicit or explicit) SHALL be ignored.
   */
  explode?: boolean;
  /**
   * A map allowing additional information to be provided as headers, for example `Content-Disposition`. `Content-Type` is described separately and SHALL be ignored in this section. This property SHALL be ignored if the request body media type is not a `multipart`.
   */
  headers?: Record<string, HeaderObject | ReferenceObject>;
  /**
   * Describes how a specific property value will be serialized depending on its type. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameter-object Parameter Object} for details on the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterStyle `style`} property. The behavior follows the same values as `query` parameters, including default values. This property SHALL be ignored if the request body media type is not `application/x-www-form-urlencoded` or `multipart/form-data`. If a value is explicitly defined, then the value of {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#encodingContentType `contentType`} (implicit or explicit) SHALL be ignored.
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
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * In all cases, the example value is expected to be compatible with the type schema of its associated value. Tooling implementations MAY choose to validate compatibility automatically, and reject the example value(s) if incompatible.
 *
 * Example Object Examples
 *
 * In a request body:
 *
 * @example
 * ```yaml
 * requestBody:
 *   content:
 *     'application/json':
 *       schema:
 *         $ref: '#/components/schemas/Address'
 *       examples:
 *         foo:
 *           summary: A foo example
 *           value: {"foo": "bar"}
 *         bar:
 *           summary: A bar example
 *           value: {"bar": "baz"}
 *     'application/xml':
 *       examples:
 *         xmlExample:
 *           summary: This is an example in XML
 *           externalValue: 'https://example.org/examples/address-example.xml'
 *     'text/plain':
 *       examples:
 *         textExample:
 *           summary: This is a text example
 *           externalValue: 'https://foo.bar/examples/address-example.txt'
 * ```
 *
 * In a parameter:
 *
 * @example
 * ```yaml
 * parameters:
 *   - name: 'zipCode'
 *     in: 'query'
 *     schema:
 *       type: 'string'
 *       format: 'zip-code'
 *     examples:
 *       zip-example:
 *         $ref: '#/components/examples/zip-example'
 * ```
 *
 * In a response:
 *
 * @example
 * ```yaml
 * responses:
 *   '200':
 *     description: your car appointment has been booked
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/SuccessResponse'
 *         examples:
 *           confirmation-success:
 *             $ref: '#/components/examples/confirmation-success'
 * ```
 */
export interface ExampleObject extends SpecExtensions {
  /**
   * Long description for the example. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * A URI that points to the literal example. This provides the capability to reference examples that cannot easily be included in JSON or YAML documents. The `value` field and `externalValue` field are mutually exclusive. See the rules for resolving {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#relative-references-in-uris Relative References}.
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
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * @example
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
 * The Header Object follows the structure of the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameter-object Parameter Object} with the following changes:
 *
 * 1. `name` MUST NOT be specified, it is given in the corresponding `headers` map.
 * 1. `in` MUST NOT be specified, it is implicitly in `header`.
 * 1. All traits that are affected by the location MUST be applicable to a location of `header` (for example, {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterStyle `style`}).
 *
 * @example
 * ```yaml
 * description: The number of allowed requests in the current period
 * schema:
 *   type: integer
 * ```
 */
export type HeaderObject = Omit<ParameterObject, 'in' | 'name'>;

/**
 * The object provides metadata about the API. The metadata MAY be used by the clients if needed, and MAY be presented in editing or documentation generation tools for convenience.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * @example
 * ```yaml
 * title: Sample Pet Store App
 * summary: A pet store manager.
 * description: This is a sample server for a pet store.
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
   * A short summary of the API.
   */
  summary?: string;
  /**
   * A URL to the Terms of Service for the API. This MUST be in the form of a URL.
   */
  termsOfService?: string;
  /**
   * **REQUIRED**. The title of the API.
   */
  title: string;
  /**
   * **REQUIRED**. The version of the OpenAPI document (which is distinct from the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#oasVersion OpenAPI Specification version} or the API implementation version).
   */
  version: string;
}

/**
 * License information for the exposed API.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * @example
 * ```yaml
 * name: Apache 2.0
 * identifier: Apache-2.0
 * ```
 */
export interface LicenseObject extends SpecExtensions {
  /**
   * An {@link https://spdx.org/licenses/ SPDX} license expression for the API. The `identifier` field is mutually exclusive of the `url` field.
   */
  identifier?: string;
  /**
   * **REQUIRED**. The license name used for the API.
   */
  name: string;
  /**
   * A URL to the license used for the API. This MUST be in the form of a URL. The `url` field is mutually exclusive of the `identifier` field.
   */
  url?: string;
}

/**
 * The `Link object` represents a possible design-time link for a response. The presence of a link does not guarantee the caller's ability to successfully invoke it, rather it provides a known relationship and traversal mechanism between responses and other operations.
 *
 * Unlike _dynamic_ links (i.e. links provided in the response payload), the OAS linking mechanism does not require link information in the runtime response.
 *
 * For computing links, and providing instructions to execute them, a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#runtime-expressions runtime expression} is used for accessing values in an operation and using them as parameters while invoking the linked operation.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * A linked operation MUST be identified using either an `operationRef` or `operationId`. In the case of an `operationId`, it MUST be unique and resolved in the scope of the OAS document. Because of the potential for name clashes, the `operationRef` syntax is preferred for OpenAPI documents with external references.
 *
 * **Examples**
 *
 * Computing a link from a request operation where the `$request.path.id` is used to pass a request parameter to the linked operation.
 *
 * ```yaml
 * paths:
 *   /users/{id}:
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: the user identifier, as userId
 *       schema:
 *         type: string
 *     get:
 *       responses:
 *         '200':
 *           description: the user being returned
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   uuid: # the unique user id
 *                     type: string
 *                     format: uuid
 *           links:
 *             address:
 *               # the target link operationId
 *               operationId: getUserAddress
 *               parameters:
 *                 # get the `id` field from the request path parameter named `id`
 *                 userId: $request.path.id
 *   # the path item of the linked operation
 *   /users/{userid}/address:
 *     parameters:
 *     - name: userid
 *       in: path
 *       required: true
 *       description: the user identifier, as userId
 *       schema:
 *         type: string
 *     # linked operation
 *     get:
 *       operationId: getUserAddress
 *       responses:
 *         '200':
 *           description: the user's address
 * ```
 *
 * When a runtime expression fails to evaluate, no parameter value is passed to the target operation.
 *
 * Values from the response body can be used to drive a linked operation.
 *
 * ```yaml
 * links:
 *   address:
 *     operationId: getUserAddressByUUID
 *     parameters:
 *       # get the `uuid` field from the `uuid` field in the response body
 *       userUuid: $response.body#/uuid
 * ```
 *
 * Clients follow all links at their discretion. Neither permissions, nor the capability to make a successful call to that link, is guaranteed solely by the existence of a relationship.
 *
 * **OperationRef Examples**
 *
 * As references to `operationId` MAY NOT be possible (the `operationId` is an optional field in an {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#operation-object Operation Object}), references MAY also be made through a relative `operationRef`:
 *
 * ```yaml
 * links:
 *   UserRepositories:
 *     # returns array of '#/components/schemas/repository'
 *     operationRef: '#/paths/~12.0~1repositories~1{username}/get'
 *     parameters:
 *       username: $response.body#/username
 * ```
 *
 * or an absolute `operationRef`:
 *
 * ```yaml
 * links:
 *   UserRepositories:
 *     # returns array of '#/components/schemas/repository'
 *     operationRef: 'https://na2.gigantic-server.com/#/paths/~12.0~1repositories~1{username}/get'
 *     parameters:
 *       username: $response.body#/username
 * ```
 *
 * Note that in the use of `operationRef`, the _escaped forward-slash_ is necessary when using JSON references.
 *
 * **Runtime Expressions**
 *
 * Runtime expressions allow defining values based on information that will only be available within the HTTP message in an actual API call. This mechanism is used by {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#link-object Link Objects} and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#callback-object Callback Objects}.
 *
 * The runtime expression is defined by the following {@link https://tools.ietf.org/html/rfc5234 ABNF} syntax
 *
 * ```abnf
 * expression = ( "$url" / "$method" / "$statusCode" / "$request." source / "$response." source )
 * source = ( header-reference / query-reference / path-reference / body-reference )
 * header-reference = "header." token
 * query-reference = "query." name
 * path-reference = "path." name
 * body-reference = "body" ["#" json-pointer ]
 * json-pointer    = *( "/" reference-token )
 * reference-token = *( unescaped / escaped )
 * unescaped       = %x00-2E / %x30-7D / %x7F-10FFFF
 *   ; %x2F ('/') and %x7E ('~') are excluded from 'unescaped'
 * escaped         = "~" ( "0" / "1" )
 *   ; representing '~' and '/', respectively
 * name = *( CHAR )
 * token = 1*tchar
 * tchar = "!" / "#" / "$" / "%" / "&" / "'" / "*" / "+" / "-" / "." /
 *   "^" / "_" / "`" / "|" / "~" / DIGIT / ALPHA
 * ```
 *
 * Here, `json-pointer` is taken from {@link https://tools.ietf.org/html/rfc6901 RFC6901}, `char` from {@link https://tools.ietf.org/html/rfc7159#section-7 RFC7159} and `token` from {@link https://tools.ietf.org/html/rfc7230#section-3.2.6 RFC7230}.
 *
 * The `name` identifier is case-sensitive, whereas `token` is not.
 *
 * The table below provides examples of runtime expressions and examples of their use in a value:
 *
 * **Examples**
 *
 * | Source Location | example expression | notes |
 * | -------- | ------- | ------- |
 * | HTTP Method | `$method` | The allowable values for the `$method` will be those for the HTTP operation. |
 * | Requested media type | `$request.header.accept` | |
 * | Request parameter | `$request.path.id` | Request parameters MUST be declared in the `parameters` section of the parent operation or they cannot be evaluated. This includes request headers. |
 * | Request body property | `$request.body#/user/uuid` | In operations which accept payloads, references may be made to portions of the `requestBody` or the entire body. |
 * | Request URL | `$url` | |
 * | Response value | `$response.body#/status` | In operations which return payloads, references may be made to portions of the response body or the entire body. |
 * | Response header | `$response.header.Server` | Single header values only are available |
 *
 * Runtime expressions preserve the type of the referenced value. Expressions can be embedded into string values by surrounding the expression with `{}` curly braces.
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
   * A relative or absolute URI reference to an OAS operation. This field is mutually exclusive of the `operationId` field, and MUST point to an {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#operation-object Operation Object}. Relative `operationRef` values MAY be used to locate an existing {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#operation-object Operation Object} in the OpenAPI definition. See the rules for resolving {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#relative-references-in-uris Relative References}.
   */
  operationRef?: string;
  /**
   * A map representing parameters to pass to an operation as specified with `operationId` or identified via `operationRef`. The key is the parameter name to be used, whereas the value can be a constant or an expression to be evaluated and passed to the linked operation. The parameter name can be qualified using the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterIn parameter location} `[{in}.]{name}` for operations that use the same parameter name in different locations (e.g. path.id).
   */
  parameters?: Record<string, unknown | string>;
  /**
   * A literal value or {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#runtime-expressions {expression}} to use as a request body when calling the target operation.
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
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * **Media Type Examples**
 *
 * @example
 * ```yaml
 * application/json:
 *   schema:
 *     $ref: "#/components/schemas/Pet"
 *   examples:
 *     cat:
 *       summary: An example of a cat
 *       value:
 *         name: Fluffy
 *         petType: Cat
 *         color: White
 *         gender: male
 *         breed: Persian
 *     dog:
 *       summary: An example of a dog with a cat's name
 *       value:
 *         name: Puma
 *         petType: Dog
 *         color: Black
 *         gender: Female
 *         breed: Mixed
 *     frog:
 *       $ref: "#/components/examples/frog-example"
 * ```
 */
export interface MediaTypeObject extends SpecExtensions {
  /**
   * A map between a property name and its encoding information. The key, being the property name, MUST exist in the schema as a property. The encoding object SHALL only apply to `requestBody` objects when the media type is `multipart` or `application/x-www-form-urlencoded`.
   */
  encoding?: Record<string, EncodingObject>;
  /**
   * Example of the media type. The example object SHOULD be in the correct format as specified by the media type. The `example` field is mutually exclusive of the `examples` field. Furthermore, if referencing a `schema` which contains an example, the `example` value SHALL _override_ the example provided by the schema.
   */
  example?: unknown;
  /**
   * Examples of the media type. Each example object SHOULD match the media type and specified schema if present. The `examples` field is mutually exclusive of the `example` field. Furthermore, if referencing a `schema` which contains an example, the `examples` value SHALL _override_ the example provided by the schema.
   */
  examples?: Record<string, ExampleObject | ReferenceObject>;
  /**
   * The schema defining the content of the request, response, or parameter.
   */
  schema?: Schema;
}

/**
 * Configuration details for a supported OAuth Flow
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * **OAuth Flow Object Examples**
 *
 * ```yaml
 * type: oauth2
 * flows:
 *   implicit:
 *     authorizationUrl: https://example.com/api/oauth/dialog
 *     scopes:
 *       write:pets: modify pets in your account
 *       read:pets: read your pets
 *   authorizationCode:
 *     authorizationUrl: https://example.com/api/oauth/dialog
 *     tokenUrl: https://example.com/api/oauth/token
 *     scopes:
 *       write:pets: modify pets in your account
 *       read:pets: read your pets
 * ```
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
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
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
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * @example
 * ```yaml
 * tags:
 * - pet
 * summary: Updates a pet in the store with form data
 * operationId: updatePetWithForm
 * parameters:
 * - name: petId
 *   in: path
 *   description: ID of pet that needs to be updated
 *   required: true
 *   schema:
 *     type: string
 * requestBody:
 *   content:
 *     'application/x-www-form-urlencoded':
 *       schema:
 *         type: object
 *         properties:
 *           name:
 *             description: Updated name of the pet
 *             type: string
 *           status:
 *             description: Updated status of the pet
 *             type: string
 *         required:
 *           - status
 * responses:
 *   '200':
 *     description: Pet updated.
 *     content:
 *       'application/json': {}
 *       'application/xml': {}
 *   '405':
 *     description: Method Not Allowed
 *     content:
 *       'application/json': {}
 *       'application/xml': {}
 * security:
 * - petstore_auth:
 *   - write:pets
 *   - read:pets
 * ```
 */
export interface OperationObject extends SpecExtensions {
  /**
   * A map of possible out-of band callbacks related to the parent operation. The key is a unique identifier for the Callback Object. Each value in the map is a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#callback-object Callback Object} that describes a request that may be initiated by the API provider and the expected responses.
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
   * A list of parameters that are applicable for this operation. If a parameter is already defined at the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#pathItemParameters Path Item}, the new definition will override it but can never remove it. The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterName name} and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterIn location}. The list can use the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#reference-object Reference Object} to link to parameters that are defined at the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#componentsParameters OpenAPI Object's components/parameters}.
   */
  parameters?: Array<ParameterObject | ReferenceObject>;
  /**
   * The request body applicable for this operation. The `requestBody` is fully supported in HTTP methods where the HTTP 1.1 specification {@link https://datatracker.ietf.org/doc/html/rfc7231#section-4.3.1 RFC7231} has explicitly defined semantics for request bodies. In other cases where the HTTP spec is vague (such as {@link https://datatracker.ietf.org/doc/html/rfc7231#section-4.3.1 GET}, {@link https://datatracker.ietf.org/doc/html/rfc7231#section-4.3.2 HEAD} and {@link https://datatracker.ietf.org/doc/html/rfc7231#section-4.3.5 DELETE}), `requestBody` is permitted but does not have well-defined semantics and SHOULD be avoided if possible.
   */
  requestBody?: RequestBodyObject | ReferenceObject;
  /**
   * The list of possible responses as they are returned from executing this operation.
   */
  responses?: ResponsesObject;
  /**
   * A declaration of which security mechanisms can be used for this operation. The list of values includes alternative security requirement objects that can be used. Only one of the security requirement objects need to be satisfied to authorize a request. To make security optional, an empty security requirement (`{}`) can be included in the array. This definition overrides any declared top-level {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#oasSecurity `security`}. To remove a top-level security declaration, an empty array can be used.
   */
  security?: Array<SecurityRequirementObject>;
  /**
   * An alternative `server` array to service this operation. If an alternative `server` object is specified at the Path Item Object or Root level, it will be overridden by this value.
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
 * A unique parameter is defined by a combination of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterName name} and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterIn location}.
 *
 * **Parameter Locations**
 *
 * There are four possible parameter locations specified by the `in` field:
 *
 * - path - Used together with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#path-templating Path Templating}, where the parameter value is actually part of the operation's URL. This does not include the host or base path of the API. For example, in `/items/{itemId}`, the path parameter is `itemId`.
 * - query - Parameters that are appended to the URL. For example, in `/items?id=###`, the query parameter is `id`.
 * - header - Custom headers that are expected as part of the request. Note that {@link https://datatracker.ietf.org/doc/html/rfc7230#page-22 RFC7230} states header names are case insensitive.
 * - cookie - Used to pass a specific cookie value to the API.
 *
 * The rules for serialization of the parameter are specified in one of two ways. For simpler scenarios, a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterSchema `schema`} and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterStyle `style`} can describe the structure and syntax of the parameter.
 *
 * For more complex scenarios, the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterContent `content`} property can define the media type and schema of the parameter. A parameter MUST contain either a `schema` property, or a `content` property, but not both. When `example` or `examples` are provided in conjunction with the `schema` object, the example MUST follow the prescribed serialization strategy for the parameter.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * A header parameter with an array of 64 bit integer numbers:
 *
 * @example
 * ```yaml
 * name: token
 * in: header
 * description: token to be passed as a header
 * required: true
 * schema:
 *   type: array
 *   items:
 *     type: integer
 *     format: int64
 * style: simple
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
 * schema:
 *   type: string
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
 * schema:
 *   type: array
 *   items:
 *     type: string
 * style: form
 * explode: true
 * ```
 *
 * A free-form query parameter, allowing undefined parameters of a specific type:
 *
 * @example
 * ```yaml
 * in: query
 * name: freeForm
 * schema:
 *   type: object
 *   additionalProperties:
 *     type: integer
 * style: form
 * ```
 *
 * A complex parameter using `content` to define serialization:
 *
 * @example
 * ```yaml
 * in: query
 * name: coordinates
 * content:
 *   application/json:
 *     schema:
 *       type: object
 *       required:
 *         - lat
 *         - long
 *       properties:
 *         lat:
 *           type: number
 *         long:
 *           type: number
 * ```
 */
export interface ParameterObject extends SpecExtensions {
  /**
   * Sets the ability to pass empty-valued parameters. This is valid only for `query` parameters and allows sending a parameter with an empty value. Default value is `false`. If {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterStyle `style`} is used, and if behavior is `n/a` (cannot be serialized), the value of `allowEmptyValue` SHALL be ignored. Use of this property is NOT RECOMMENDED, as it is likely to be removed in a later revision.
   */
  allowEmptyValue?: boolean;
  /**
   * Determines whether the parameter value SHOULD allow reserved characters, as defined by {@link https://datatracker.ietf.org/doc/html/rfc3986#section-2.2 RFC3986} `:/?#[]@!$&'()*+,;=` to be included without percent-encoding. This property only applies to parameters with an `in` value of `query`. The default value is `false`.
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
   * Example of the parameter's potential value. The example SHOULD match the specified schema and encoding properties if present. The `example` field is mutually exclusive of the `examples` field. Furthermore, if referencing a `schema` that contains an example, the `example` value SHALL _override_ the example provided by the schema. To represent examples of media types that cannot naturally be represented in JSON or YAML, a string value can contain the example with escaping where necessary.
   */
  example?: unknown;
  /**
   * Examples of the parameter's potential value. Each example SHOULD contain a value in the correct format as specified in the parameter encoding. The `examples` field is mutually exclusive of the `example` field. Furthermore, if referencing a `schema` that contains an example, the `examples` value SHALL _override_ the example provided by the schema.
   */
  examples?: Record<string, ExampleObject | ReferenceObject>;
  /**
   * When this is true, parameter values of type `array` or `object` generate separate parameters for each value of the array or key-value pair of the map. For other types of parameters this property has no effect. When {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterStyle `style`} is `form`, the default value is `true`. For all other styles, the default value is `false`.
   */
  explode?: boolean;
  /**
   * **REQUIRED**. The location of the parameter. Possible values are `"query"`, `"header"`, `"path"` or `"cookie"`.
   */
  in: 'cookie' | 'header' | 'path' | 'query';
  /**
   * **REQUIRED**. The name of the parameter. Parameter names are _case sensitive_.
   * - If {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterIn `in`} is `"path"`, the `name` field MUST correspond to a template expression occurring within the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#pathsPath path} field in the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#paths-object Paths Object}. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#path-templating Path Templating} for further information.
   * - If {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterIn `in`} is `"header"` and the `name` field is `"Accept"`, `"Content-Type"` or `"Authorization"`, the parameter definition SHALL be ignored.
   * - For all other cases, the `name` corresponds to the parameter name used by the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterIn `in`} property.
   */
  name: string;
  /**
   * Determines whether this parameter is mandatory. If the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterIn parameter location} is `"path"`, this property is **REQUIRED** and its value MUST be `true`. Otherwise, the property MAY be included and its default value is `false`.
   */
  required?: boolean;
  /**
   * The schema defining the type used for the parameter.
   */
  schema?: Schema;
  /**
   * Describes how the parameter value will be serialized depending on the type of the parameter value. Default values (based on value of `in`): for `query` - `form`; for `path` - `simple`; for `header` - `simple`; for `cookie` - `form`.
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
 * Describes the operations available on a single path. A Path Item MAY be empty, due to {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#security-filtering ACL constraints}. The path itself is still exposed to the documentation viewer but they will not know which operations and parameters are available.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * @example
 * ```yaml
 * get:
 *   description: Returns pets based on ID
 *   summary: Find pets by ID
 *   operationId: getPetsById
 *   responses:
 *     '200':
 *       description: pet response
 *       content:
 *         '*\/*':
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Pet'
 *     default:
 *       description: error payload
 *       content:
 *         'text/html':
 *           schema:
 *             $ref: '#/components/schemas/ErrorModel'
 * parameters:
 * - name: id
 *   in: path
 *   description: ID of pet to use
 *   required: true
 *   schema:
 *     type: array
 *     items:
 *       type: string
 *   style: simple
 * ```
 */
export interface PathItemObject extends SpecExtensions {
  /**
   * Allows for a referenced definition of this path item. The referenced structure MUST be in the form of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#path-item-object Path Item Object}. In case a Path Item Object field appears both in the defined object and the referenced object, the behavior is undefined. See the rules for resolving {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#relative-references-in-uris Relative References}.
   */
  $ref?: string;
  /**
   * A definition of a DELETE operation on this path.
   */
  delete?: OperationObject;
  /**
   * An optional, string description, intended to apply to all operations in this path. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
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
   * A list of parameters that are applicable for all the operations described under this path. These parameters can be overridden at the operation level, but cannot be removed there. The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterName name} and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterIn location}. The list can use the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#reference-object Reference Object} to link to parameters that are defined at the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#componentsParameters OpenAPI Object's components/parameters}.
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
   * An alternative `server` array to service all operations in this path.
   */
  servers?: Array<ServerObject>;
  /**
   * An optional, string summary, intended to apply to all operations in this path.
   */
  summary?: string;
  /**
   * A definition of a TRACE operation on this path.
   */
  trace?: OperationObject;
}

/**
 * Holds the relative paths to the individual endpoints and their operations. The path is appended to the URL from the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#server-object `Server Object`} in order to construct the full URL. The Paths MAY be empty, due to {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#security-filtering Access Control List (ACL) constraints}.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * **Path Templating Matching**
 *
 * Assuming the following paths, the concrete definition, `/pets/mine`, will be matched first if used:
 *
 * ```
 * /pets/{petId}
 * /pets/mine
 * ```
 *
 * The following paths are considered identical and invalid:
 *
 * ```
 * /pets/{petId}
 * /pets/{name}
 * ```
 *
 * The following may lead to ambiguous resolution:
 *
 * ```
 * /{entity}/me
 * /books/{id}
 * ```
 *
 * **Paths Object Example**
 *
 * ```yaml
 * /pets:
 *   get:
 *     description: Returns all pets from the system that the user has access to
 *     responses:
 *       '200':
 *         description: A list of pets.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/pet'
 * ```
 */
export interface PathsObject extends SpecExtensions {
  /**
   * A relative path to an individual endpoint. The field name MUST begin with a forward slash (`/`). The path is **appended** (no relative URL resolution) to the expanded URL from the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#server-object `Server Object`}'s `url` field in order to construct the full URL. {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#path-templating Path templating} is allowed. When matching URLs, concrete (non-templated) paths would be matched before their templated counterparts. Templated paths with the same hierarchy but different templated names MUST NOT exist as they are identical. In case of ambiguous matching, it's up to the tooling to decide which one to use.
   */
  [path: `/${string}`]: PathItemObject;
}

/**
 * A simple object to allow referencing other components in the OpenAPI document, internally and externally.
 *
 * The `$ref` string value contains a URI {@link https://datatracker.ietf.org/doc/html/rfc3986 RFC3986}, which identifies the location of the value being referenced.
 *
 * See the rules for resolving {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#relative-references-in-uris Relative References}.
 *
 * This object cannot be extended with additional properties and any properties added SHALL be ignored.
 *
 * Note that this restriction on additional properties is a difference between Reference Objects and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#schema-object `Schema Objects`} that contain a `$ref` keyword.
 *
 * Reference Object Example
 *
 * @example
 * ```yaml
 * $ref: '#/components/schemas/Pet'
 * ```
 *
 * Relative Schema Document Example
 *
 * @example
 * ```yaml
 * $ref: Pet.yaml
 * ```
 *
 * Relative Documents With Embedded Schema Example
 *
 * @example
 * ```yaml
 * $ref: definitions.yaml#/Pet
 * ```
 */
export interface ReferenceObject {
  /**
   * **REQUIRED**. The reference identifier. This MUST be in the form of a URI.
   */
  $ref: string;
  /**
   * A description which by default SHOULD override that of the referenced component. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation. If the referenced object-type does not allow a `description` field, then this field has no effect.
   */
  description?: string;
  /**
   * A short summary which by default SHOULD override that of the referenced component. If the referenced object-type does not allow a `summary` field, then this field has no effect.
   */
  summary?: string;
}

/**
 * Describes a single request body.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * **Request Body Examples**
 *
 * A request body with a referenced model definition.
 *
 * ```yaml
 * description: user to add to the system
 * content:
 *   'application/json':
 *     schema:
 *       $ref: '#/components/schemas/User'
 *     examples:
 *       user:
 *         summary: User Example
 *         externalValue: 'https://foo.bar/examples/user-example.json'
 *   'application/xml':
 *     schema:
 *       $ref: '#/components/schemas/User'
 *     examples:
 *       user:
 *         summary: User example in XML
 *         externalValue: 'https://foo.bar/examples/user-example.xml'
 *   'text/plain':
 *     examples:
 *       user:
 *         summary: User example in Plain text
 *         externalValue: 'https://foo.bar/examples/user-example.txt'
 *   '*\/*':
 *     examples:
 *       user:
 *         summary: User example in other format
 *         externalValue: 'https://foo.bar/examples/user-example.whatever'
 * ```
 *
 * A body parameter that is an array of string values:
 *
 * ```yaml
 * description: user to add to the system
 * required: true
 * content:
 *   text/plain:
 *     schema:
 *       type: array
 *       items:
 *         type: string
 * ```
 */
export interface RequestBodyObject extends SpecExtensions {
  /**
   * **REQUIRED**. The content of the request body. The key is a media type or {@link https://tools.ietf.org/html/rfc7231#appendix-D media type range} and the value describes it. For requests that match multiple keys, only the most specific key is applicable. e.g. text/plain overrides text/*
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
 * Describes a single response from an API Operation, including design-time, static `links` to operations based on the response.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * Response of an array of a complex type:
 *
 * @example
 * ```yaml
 * description: A complex object array response
 * content:
 *   application/json:
 *     schema:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/VeryComplexType'
 * ```
 *
 * Response with a string type:
 *
 * @example
 * ```yaml
 * description: A simple string response
 * content:
 *   text/plain:
 *     schema:
 *       type: string
 * ```
 *
 * Plain text response with headers:
 *
 * @example
 * ```yaml
 * description: A simple string response
 * content:
 *   text/plain:
 *     schema:
 *       type: string
 *     example: 'whoa!'
 * headers:
 *   X-Rate-Limit-Limit:
 *     description: The number of allowed requests in the current period
 *     schema:
 *       type: integer
 *   X-Rate-Limit-Remaining:
 *     description: The number of remaining requests in the current period
 *     schema:
 *       type: integer
 *   X-Rate-Limit-Reset:
 *     description: The number of seconds left in the current period
 *     schema:
 *       type: integer
 * ```
 *
 * Response with no return value:
 *
 * @example
 * ```yaml
 * description: object created
 * ```
 */
export interface ResponseObject extends SpecExtensions {
  /**
   * A map containing descriptions of potential response payloads. The key is a media type or {@link https://datatracker.ietf.org/doc/html/rfc7231#appendix-D media type range} and the value describes it. For responses that match multiple keys, only the most specific key is applicable. e.g. text/plain overrides text/*
   */
  content?: Record<string, MediaTypeObject>;
  /**
   * **REQUIRED**. A description of the response. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description: string;
  /**
   * Maps a header name to its definition. {@link https://datatracker.ietf.org/doc/html/rfc7230#page-22 RFC7230} states header names are case insensitive. If a response header is defined with the name `"Content-Type"`, it SHALL be ignored.
   */
  headers?: Record<string, HeaderObject | ReferenceObject>;
  /**
   * A map of operations links that can be followed from the response. The key of the map is a short name for the link, following the naming constraints of the names for {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#components-object Component Objects}.
   */
  links?: Record<string, LinkObject | ReferenceObject>;
}

/**
 * A container for the expected responses of an operation. The container maps a HTTP response code to the expected response.
 *
 * The documentation is not necessarily expected to cover all possible HTTP response codes because they may not be known in advance. However, documentation is expected to cover a successful operation response and any known errors.
 *
 * The `default` MAY be used as a default response object for all HTTP codes that are not covered individually by the `Responses Object`.
 *
 * The `Responses Object` MUST contain at least one response code, and if only one response code is provided it SHOULD be the response for a successful operation call.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * A 200 response for a successful operation and a default response for others (implying an error):
 *
 * @example
 * ```yaml
 * '200':
 *   description: a pet to be returned
 *   content:
 *     application/json:
 *       schema:
 *         $ref: '#/components/schemas/Pet'
 * default:
 *   description: Unexpected error
 *   content:
 *     application/json:
 *       schema:
 *         $ref: '#/components/schemas/ErrorModel'
 * ```
 */
export interface ResponsesObject extends SpecExtensions {
  /**
   * Any {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#http-status-codes HTTP status code} can be used as the property name, but only one property per code, to describe the expected response for that HTTP status code. This field MUST be enclosed in quotation marks (for example, "200") for compatibility between JSON and YAML. To define a range of response codes, this field MAY contain the uppercase wildcard character `X`. For example, `2XX` represents all response codes between `[200-299]`. Only the following range definitions are allowed: `1XX`, `2XX`, `3XX`, `4XX`, and `5XX`. If a response is defined using an explicit code, the explicit code definition takes precedence over the range definition for that code.
   */
  [httpStatusCode: string]: ResponseObject | ReferenceObject | undefined | unknown;
  /**
   * The documentation of responses other than the ones declared for specific HTTP response codes. Use this field to cover undeclared responses.
   */
  default?: ResponseObject | ReferenceObject;
}

/**
 * The Schema Object allows the definition of input and output data types. These types can be objects, but also primitives and arrays. This object is a superset of the {@link https://tools.ietf.org/html/draft-bhutton-json-schema-00 JSON Schema Specification Draft 2020-12}.
 *
 * For more information about the properties, see {@link https://tools.ietf.org/html/draft-bhutton-json-schema-00 JSON Schema Core} and {@link https://tools.ietf.org/html/draft-bhutton-json-schema-validation-00 JSON Schema Validation}.
 *
 * Unless stated otherwise, the property definitions follow those of JSON Schema and do not add any additional semantics. Where JSON Schema indicates that behavior is defined by the application (e.g. for annotations), OAS also defers the definition of semantics to the application consuming the OpenAPI document.
 *
 * **Properties**
 *
 * The OpenAPI Schema Object {@link https://tools.ietf.org/html/draft-bhutton-json-schema-00#section-4.3.3 dialect} is defined as requiring the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#fixed-fields-20 OAS base vocabulary}, in addition to the vocabularies as specified in the JSON Schema draft 2020-12 {@link https://tools.ietf.org/html/draft-bhutton-json-schema-00#section-8 general purpose meta-schema}.
 *
 * The OpenAPI Schema Object dialect for this version of the specification is identified by the URI `https://spec.openapis.org/oas/3.1/dialect/base` (the "OAS dialect schema id").
 *
 * The following properties are taken from the JSON Schema specification but their definitions have been extended by the OAS:
 *
 * - description - {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
 * - format - See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#dataTypeFormat Data Type Formats} for further details. While relying on JSON Schema's defined formats, the OAS offers a few additional predefined formats.
 *
 * In addition to the JSON Schema properties comprising the OAS dialect, the Schema Object supports keywords from any other vocabularies, or entirely arbitrary properties.
 *
 * The OpenAPI Specification's base vocabulary is comprised of the following keywords:
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}, though as noted, additional properties MAY omit the `x-` prefix within this object.
 */
export interface SchemaObject
  extends
    JSONSchemaDraft2020_12<Schema>,
    OpenAPIV3_1SchemaExtensions,
    SpecExtensions,
    EnumExtensions {}

/**
 * A Schema Object type: either a full {@link SchemaObject}, or the boolean
 * schema forms `true` (always valid) / `false` (never valid) inherited from
 * the JSON Schema Draft 2020-12. Legal anywhere a schema is referenced.
 */
export type Schema = SchemaObject | boolean;

/**
 * Lists the required security schemes to execute this operation. The name used for each property MUST correspond to a security scheme declared in the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#componentsSecuritySchemes Security Schemes} under the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#components-object Components Object}.
 *
 * Security Requirement Objects that contain multiple schemes require that all schemes MUST be satisfied for a request to be authorized. This enables support for scenarios where multiple query parameters or HTTP headers are required to convey security information.
 *
 * When a list of Security Requirement Objects is defined on the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#openapi-object OpenAPI Object} or {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#operation-object Operation Object}, only one of the Security Requirement Objects in the list needs to be satisfied to authorize the request.
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
 *
 * Optional OAuth2 Security
 *
 * @example
 * ```yaml
 * security:
 * - {}
 * - petstore_auth:
 *   - write:pets
 *   - read:pets
 * ```
 */
export interface SecurityRequirementObject {
  /**
   * Each name MUST correspond to a security scheme which is declared in the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#componentsSecuritySchemes Security Schemes} under the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#components-object Components Object}. If the security scheme is of type `"oauth2"` or `"openIdConnect"`, then the value is a list of scope names required for the execution, and the list MAY be empty if authorization does not require a specified scope. For other security scheme types, the array MAY contain a list of role names which are required for the execution, but are not otherwise defined or exchanged in-band.
   */
  [name: string]: Array<string>;
}

/**
 * Defines a security scheme that can be used by the operations.
 *
 * Supported schemes are HTTP authentication, an API key (either as a header, a cookie parameter or as a query parameter), mutual TLS (use of a client certificate), OAuth2's common flows (implicit, password, client credentials and authorization code) as defined in {@link https://tools.ietf.org/html/rfc6749 RFC6749}, and {@link https://tools.ietf.org/html/draft-ietf-oauth-discovery-06 OpenID Connect Discovery}. Please note that as of 2020, the implicit flow is about to be deprecated by {@link https://tools.ietf.org/html/draft-ietf-oauth-security-topics OAuth 2.0 Security Best Current Practice}. Recommended for most use case is Authorization Code Grant flow with PKCE.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * **Security Scheme Object Example**
 *
 * **Basic Authentication Sample**
 *
 * ```yaml
 * type: http
 * scheme: basic
 * ```
 *
 * **API Key Sample**
 *
 * ```yaml
 * type: apiKey
 * name: api_key
 * in: header
 * ```
 *
 * **JWT Bearer Sample**
 *
 * ```yaml
 * type: http
 * scheme: bearer
 * bearerFormat: JWT
 * ```
 *
 * **Implicit OAuth2 Sample**
 *
 * ```yaml
 * type: oauth2
 * flows:
 *   implicit:
 *     authorizationUrl: https://example.com/api/oauth/dialog
 *     scopes:
 *       write:pets: modify pets in your account
 *       read:pets: read your pets
 * ```
 */
export type SecuritySchemeObject = SpecExtensions & {
  /**
   * A description for security scheme. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
} & (
    | {
        /**
         * **REQUIRED**. The location of the API key. Valid values are "query", "header" or "cookie".
         */
        in: 'cookie' | 'header' | 'query';
        /**
         * **REQUIRED**. The name of the header, query or cookie parameter to be used.
         */
        name: string;
        /**
         * **REQUIRED**. The type of the security scheme. Valid values are `"apiKey"`, `"http"`, `"mutualTLS"`, `"oauth2"`, `"openIdConnect"`.
         */
        type: 'apiKey';
      }
    | {
        /**
         * A hint to the client to identify how the bearer token is formatted. Bearer tokens are usually generated by an authorization server, so this information is primarily for documentation purposes.
         */
        bearerFormat?: string;
        /**
         * **REQUIRED**. The name of the HTTP Authorization scheme to be used in the {@link https://tools.ietf.org/html/rfc7235#section-5.1 Authorization header as defined in RFC7235}. The values used SHOULD be registered in the {@link https://www.iana.org/assignments/http-authschemes/http-authschemes.xhtml IANA Authentication Scheme registry}.
         */
        scheme: string;
        /**
         * **REQUIRED**. The type of the security scheme. Valid values are `"apiKey"`, `"http"`, `"mutualTLS"`, `"oauth2"`, `"openIdConnect"`.
         */
        type: 'http';
      }
    | {
        /**
         * **REQUIRED**. The type of the security scheme. Valid values are `"apiKey"`, `"http"`, `"mutualTLS"`, `"oauth2"`, `"openIdConnect"`.
         */
        type: 'mutualTLS';
      }
    | {
        /**
         * **REQUIRED**. An object containing configuration information for the flow types supported.
         */
        flows: OAuthFlowsObject;
        /**
         * **REQUIRED**. The type of the security scheme. Valid values are `"apiKey"`, `"http"`, `"mutualTLS"`, `"oauth2"`, `"openIdConnect"`.
         */
        type: 'oauth2';
      }
    | {
        /**
         * **REQUIRED**. OpenId Connect URL to discover OAuth2 configuration values. This MUST be in the form of a URL. The OpenID Connect standard requires the use of TLS.
         */
        openIdConnectUrl: string;
        /**
         * **REQUIRED**. The type of the security scheme. Valid values are `"apiKey"`, `"http"`, `"mutualTLS"`, `"oauth2"`, `"openIdConnect"`.
         */
        type: 'openIdConnect';
      }
  );

/**
 * An object representing a Server.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * @example
 * ```yaml
 * url: https://development.gigantic-server.com/v1
 * description: Development server
 * ```
 */
export interface ServerObject extends SpecExtensions {
  /**
   * An optional string describing the host designated by the URL. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * **REQUIRED**. A URL to the target host. This URL supports Server Variables and MAY be relative, to indicate that the host location is relative to the location where the OpenAPI document is being served. Variable substitutions will be made when a variable is named in `{`brackets`}`.
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
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 */
export interface ServerVariableObject extends SpecExtensions {
  /**
   * **REQUIRED**. The default value to use for substitution, which SHALL be sent if an alternate value is _not_ supplied. Note this behavior is different than the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#schema-object Schema Object's} treatment of default values, because in those cases parameter values are optional. If the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#serverVariableEnum `enum`} is defined, the value MUST exist in the enum's values.
   */
  default: string;
  /**
   * An optional description for the server variable. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * An enumeration of string values to be used if the substitution options are from a limited set. The array MUST NOT be empty.
   */
  enum?: Array<string>;
}

/**
 * Adds metadata to a single tag that is used by the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#operation-object Operation Object}. It is not mandatory to have a Tag Object per tag defined in the Operation Object instances.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * @example
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
 * When using arrays, XML element names are _not_ inferred (for singular/plural forms) and the `name` property SHOULD be used to add that information. See examples for expected behavior.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * **XML Object Examples**
 *
 * The examples of the XML object definitions are included inside a property definition of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#schema-object Schema Object} with a sample of the XML representation of it.
 *
 * **No XML Element**
 *
 * Basic string property:
 *
 * ```yaml
 * animals:
 *   type: string
 * ```
 *
 * ```xml
 * <animals>...</animals>
 * ```
 *
 * Basic string array property ({@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#xmlWrapped `wrapped`} is `false` by default):
 *
 * ```yaml
 * animals:
 *   type: array
 *   items:
 *     type: string
 * ```
 *
 * ```xml
 * <animals>...</animals>
 * <animals>...</animals>
 * <animals>...</animals>
 * ```
 *
 * **XML Name Replacement**
 *
 * ```yaml
 * animals:
 *   type: string
 *   xml:
 *     name: animal
 * ```
 *
 * ```xml
 * <animal>...</animal>
 * ```
 *
 * **XML Attribute, Prefix and Namespace**
 *
 * In this example, a full model definition is shown.
 *
 * ```yaml
 * Person:
 *   type: object
 *   properties:
 *     id:
 *       type: integer
 *       format: int32
 *       xml:
 *         attribute: true
 *     name:
 *       type: string
 *       xml:
 *         namespace: https://example.com/schema/sample
 *         prefix: sample
 * ```
 *
 * ```xml
 * <Person id="123">
 *   <sample:name xmlns:sample="https://example.com/schema/sample">example</sample:name>
 * </Person>
 * ```
 *
 * **XML Arrays**
 *
 * Changing the element names:
 *
 * ```yaml
 * animals:
 *   type: array
 *   items:
 *     type: string
 *     xml:
 *       name: animal
 * ```
 *
 * ```xml
 * <animal>value</animal>
 * <animal>value</animal>
 * ```
 *
 * The external `name` property has no effect on the XML:
 *
 * ```yaml
 * animals:
 *   type: array
 *   items:
 *     type: string
 *     xml:
 *       name: animal
 *   xml:
 *     name: aliens
 * ```
 *
 * ```xml
 * <animal>value</animal>
 * <animal>value</animal>
 * ```
 *
 * Even when the array is wrapped, if a name is not explicitly defined, the same name will be used both internally and externally:
 *
 * ```yaml
 * animals:
 *   type: array
 *   items:
 *     type: string
 *   xml:
 *     wrapped: true
 * ```
 *
 * ```xml
 * <animals>
 *   <animals>value</animals>
 *   <animals>value</animals>
 * </animals>
 * ```
 *
 * To overcome the naming problem in the example above, the following definition can be used:
 *
 * ```yaml
 * animals:
 *   type: array
 *   items:
 *     type: string
 *     xml:
 *       name: animal
 *   xml:
 *     wrapped: true
 * ```
 *
 * ```xml
 * <animals>
 *   <animal>value</animal>
 *   <animal>value</animal>
 * </animals>
 * ```
 *
 * Affecting both internal and external names:
 *
 * ```yaml
 * animals:
 *   type: array
 *   items:
 *     type: string
 *     xml:
 *       name: animal
 *   xml:
 *     name: aliens
 *     wrapped: true
 * ```
 *
 * ```xml
 * <aliens>
 *   <animal>value</animal>
 *   <animal>value</animal>
 * </aliens>
 * ```
 *
 * If we change the external element but not the internal ones:
 *
 * ```yaml
 * animals:
 *   type: array
 *   items:
 *     type: string
 *   xml:
 *     name: aliens
 *     wrapped: true
 * ```
 *
 * ```xml
 * <aliens>
 *   <aliens>value</aliens>
 *   <aliens>value</aliens>
 * </aliens>
 * ```
 */
export interface XMLObject extends SpecExtensions {
  /**
   * Declares whether the property definition translates to an attribute instead of an element. Default value is `false`.
   */
  attribute?: boolean;
  /**
   * Replaces the name of the element/attribute used for the described schema property. When defined within `items`, it will affect the name of the individual XML elements within the list. When defined alongside `type` being `array` (outside the `items`), it will affect the wrapping element and only if `wrapped` is `true`. If `wrapped` is `false`, it will be ignored.
   */
  name?: string;
  /**
   * The URI of the namespace definition. This MUST be in the form of an absolute URI.
   */
  namespace?: string;
  /**
   * The prefix to be used for the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#xmlName name}.
   */
  prefix?: string;
  /**
   * MAY be used only for an array definition. Signifies whether the array is wrapped (for example, `<books><book/><book/></books>`) or unwrapped (`<book/><book/>`). Default value is `false`. The definition takes effect only when defined alongside `type` being `array` (outside the `items`).
   */
  wrapped?: boolean;
}
