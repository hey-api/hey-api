import type { AnyString, MaybeArray } from '@hey-api/types';

// TODO: left out some keywords related to structuring a complex schema and declaring a dialect
export interface BaseDocument<TDocument = unknown>
  extends ArrayKeywords<TDocument>, NumberKeywords, ObjectKeywords<TDocument>, StringKeywords {
  /**
   * The `$comment` {@link https://json-schema.org/learn/glossary#keyword keyword} is strictly intended for adding comments to a schema. Its value must always be a string. Unlike the annotations `title`, `description`, and `examples`, JSON schema {@link https://json-schema.org/learn/glossary#implementation implementations} aren't allowed to attach any meaning or behavior to it whatsoever, and may even strip them at any time. Therefore, they are useful for leaving notes to future editors of a JSON schema, but should not be used to communicate to users of the schema.
   */
  $comment?: string;
  /**
   * A schema can reference another schema using the `$ref` keyword. The value of `$ref` is a URI-reference that is resolved against the schema's {@link https://json-schema.org/understanding-json-schema/structuring#base-uri Base URI}. When evaluating a `$ref`, an implementation uses the resolved identifier to retrieve the referenced schema and applies that schema to the {@link https://json-schema.org/learn/glossary#instance instance}.
   *
   * The `$ref` keyword may be used to create recursive schemas that refer to themselves.
   */
  $ref?: string;
  /**
   * `allOf`: (AND) Must be valid against _all_ of the {@link https://json-schema.org/learn/glossary#subschema subschemas}
   *
   * To validate against `allOf`, the given data must be valid against all of the given subschemas.
   *
   * {@link https://json-schema.org/understanding-json-schema/reference/combining#allof allOf} can not be used to "extend" a schema to add more details to it in the sense of object-oriented inheritance. {@link https://json-schema.org/learn/glossary#instance Instances} must independently be valid against "all of" the schemas in the `allOf`. See the section on {@link https://json-schema.org/understanding-json-schema/reference/object#extending Extending Closed Schemas} for more information.
   */
  allOf?: Array<TDocument>;
  /**
   * `anyOf`: (OR) Must be valid against _any_ of the subschemas
   *
   * To validate against `anyOf`, the given data must be valid against any (one or more) of the given subschemas.
   */
  anyOf?: Array<TDocument>;
  /**
   * The `const` keyword is used to restrict a value to a single value.
   */
  const?: unknown;
  /**
   * The `contentEncoding` keyword specifies the encoding used to store the contents, as specified in {@link https://tools.ietf.org/html/rfc2045 RFC 2054, part 6.1} and {@link https://datatracker.ietf.org/doc/html/rfc4648 RFC 4648}.
   *
   * The acceptable values are `quoted-printable`, `base16`, `base32`, `base64`, and the RFC 2045 §6.1 values `7bit`, `8bit`, and `binary`. If not specified, the encoding is the same as the containing JSON document.
   *
   * Without getting into the low-level details of each of these encodings, there are really only two options useful for modern usage:
   * - If the content is encoded in the same encoding as the enclosing JSON document (which for practical purposes, is almost always UTF-8), leave `contentEncoding` unspecified, and include the content in a string as-is. This includes text-based content types, such as `text/html` or `application/xml`.
   * - If the content is binary data, set `contentEncoding` to `base64` and encode the contents using {@link https://tools.ietf.org/html/rfc4648 Base64}. This would include many image types, such as `image/png` or audio types, such as `audio/mpeg`.
   */
  contentEncoding?:
    | '7bit'
    | '8bit'
    | 'base16'
    | 'base32'
    | 'base64'
    | 'binary'
    | 'quoted-printable';
  /**
   * The `contentMediaType` keyword specifies the MIME type of the contents of a string, as described in {@link https://tools.ietf.org/html/rfc2046 RFC 2046}. There is a list of {@link http://www.iana.org/assignments/media-types/media-types.xhtml MIME types officially registered by the IANA}, but the set of types supported will be application and operating system dependent. Mozilla Developer Network also maintains a {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types shorter list of MIME types that are important for the web}
   */
  contentMediaType?: string;
  /**
   * The schema of the decoded content described by `contentMediaType`. Only relevant when `contentMediaType` is present; ignored otherwise.
   */
  contentSchema?: TDocument;
  /**
   * The `default` keyword specifies a default value. This value is not used to fill in missing values during the validation process. Non-validation tools such as documentation generators or form generators may use this value to give hints to users about how to use a value. However, `default` is typically used to express that if a value is missing, then the value is semantically the same as if the value was present with the default value. The value of `default` should validate against the schema in which it resides, but that isn't required.
   */
  default?: unknown;
  /**
   * The `dependentRequired` {@link https://json-schema.org/learn/glossary#keyword keyword} conditionally requires that certain properties must be present if a given property is present in an object. For example, suppose we have a {@link https://json-schema.org/learn/glossary#schema schema} representing a customer. If you have their credit card number, you also want to ensure you have a billing address. If you don't have their credit card number, a billing address would not be required. We represent this dependency of one property on another using the `dependentRequired` keyword. The value of the `dependentRequired` keyword is an object. Each entry in the object maps from the name of a property, _p_, to an array of strings listing properties that are required if _p_ is present.
   */
  dependentRequired?: Record<string, Array<string>>;
  /**
   * The `dependentSchemas` keyword conditionally applies a {@link https://json-schema.org/learn/glossary#subschema subschema} when a given property is present. This schema is applied in the same way {@link https://json-schema.org/understanding-json-schema/reference/combining#allof allOf} applies schemas. Nothing is merged or extended. Both schemas apply independently.
   */
  dependentSchemas?: Record<string, TDocument>;
  /**
   * The `deprecated` keyword is a boolean that indicates that the {@link https://json-schema.org/learn/glossary#instance instance} value the keyword applies to should not be used and may be removed in the future.
   */
  deprecated?: boolean;
  /**
   * The `title` and `description` keywords must be strings. A "title" will preferably be short, whereas a "description" will provide a more lengthy explanation about the purpose of the data described by the schema.
   */
  description?: string;
  /**
   * The `if`, `then` and `else` keywords allow the application of a subschema based on the outcome of another schema, much like the `if`/`then`/`else` constructs you've probably seen in traditional programming languages.
   *
   * If `if` is valid, `then` must also be valid (and `else` is ignored.) If `if` is invalid, `else` must also be valid (and `then` is ignored).
   *
   * If `then` or `else` is not defined, `if` behaves as if they have a value of `true`.
   *
   * If `then` and/or `else` appear in a schema without `if`, `then` and `else` are ignored.
   */
  else?: TDocument;
  /**
   * The `enum` {@link https://json-schema.org/learn/glossary#keyword keyword} is used to restrict a value to a fixed set of values. It must be an array with at least one element, where each element is unique.
   *
   * You can use `enum` even without a type, to accept values of different types.
   */
  enum?: Array<unknown>;
  /**
   * The `examples` keyword is a place to provide an array of examples that validate against the schema. This isn't used for validation, but may help with explaining the effect and purpose of the schema to a reader. Each entry should validate against the schema in which it resides, but that isn't strictly required. There is no need to duplicate the `default` value in the `examples` array, since `default` will be treated as another example.
   */
  examples?: Array<unknown>;
  /**
   * The `format` keyword allows for basic semantic identification of certain kinds of string values that are commonly used. For example, because JSON doesn't have a "DateTime" type, dates need to be encoded as strings. `format` allows the schema author to indicate that the string value should be interpreted as a date. By default, `format` is just an annotation and does not effect validation.
   *
   * Optionally, validator {@link https://json-schema.org/learn/glossary#implementation implementations} can provide a configuration option to enable `format` to function as an assertion rather than just an annotation. That means that validation will fail if, for example, a value with a `date` format isn't in a form that can be parsed as a date. This can allow values to be constrained beyond what the other tools in JSON Schema, including {@link https://json-schema.org/understanding-json-schema/reference/regular_expressions Regular Expressions} can do.
   *
   * There is a bias toward networking-related formats in the JSON Schema specification, most likely due to its heritage in web technologies. However, custom formats may also be used, as long as the parties exchanging the JSON documents also exchange information about the custom format types. A JSON Schema validator will ignore any format type that it does not understand.
   */
  format?: JsonSchemaFormats;
  /**
   * The `if`, `then` and `else` keywords allow the application of a subschema based on the outcome of another schema, much like the `if`/`then`/`else` constructs you've probably seen in traditional programming languages.
   *
   * If `if` is valid, `then` must also be valid (and `else` is ignored.) If `if` is invalid, `else` must also be valid (and `then` is ignored).
   *
   * If `then` or `else` is not defined, `if` behaves as if they have a value of `true`.
   *
   * If `then` and/or `else` appear in a schema without `if`, `then` and `else` are ignored.
   */
  if?: TDocument;
  /**
   * `not`: (NOT) Must _not_ be valid against the given schema
   *
   * The `not` keyword declares that an instance validates if it doesn't validate against the given subschema.
   */
  not?: TDocument;
  /**
   * `oneOf`: (XOR) Must be valid against _exactly one_ of the subschemas
   *
   * To validate against `oneOf`, the given data must be valid against exactly one of the given subschemas.
   *
   * Careful consideration should be taken when using `oneOf` entries as the nature of it requires verification of _every_ sub-schema which can lead to increased processing times. Prefer `anyOf` where possible.
   */
  oneOf?: Array<TDocument>;
  /**
   * The boolean keywords `readOnly` and `writeOnly` are typically used in an API context. `readOnly` indicates that a value should not be modified. It could be used to indicate that a `PUT` request that changes a value would result in a `400 Bad Request` response. `writeOnly` indicates that a value may be set, but will remain hidden. In could be used to indicate you can set a value with a `PUT` request, but it would not be included when retrieving that record with a `GET` request.
   */
  readOnly?: boolean;
  /**
   * The `if`, `then` and `else` keywords allow the application of a subschema based on the outcome of another schema, much like the `if`/`then`/`else` constructs you've probably seen in traditional programming languages.
   *
   * If `if` is valid, `then` must also be valid (and `else` is ignored.) If `if` is invalid, `else` must also be valid (and `then` is ignored).
   *
   * If `then` or `else` is not defined, `if` behaves as if they have a value of `true`.
   *
   * If `then` and/or `else` appear in a schema without `if`, `then` and `else` are ignored.
   */
  then?: TDocument;
  /**
   * The `title` and `description` keywords must be strings. A "title" will preferably be short, whereas a "description" will provide a more lengthy explanation about the purpose of the data described by the schema.
   */
  title?: string;
  /**
   * If it is an array, it must be an array of strings, where each string is the name of one of the basic types, and each element is unique. In this case, the JSON snippet is valid if it matches any of the given types.
   */
  type?: MaybeArray<JsonSchemaTypes>;
  /**
   * The boolean keywords `readOnly` and `writeOnly` are typically used in an API context. `readOnly` indicates that a value should not be modified. It could be used to indicate that a `PUT` request that changes a value would result in a `400 Bad Request` response. `writeOnly` indicates that a value may be set, but will remain hidden. In could be used to indicate you can set a value with a `PUT` request, but it would not be included when retrieving that record with a `GET` request.
   */
  writeOnly?: boolean;
}

export type Document = BaseDocument<Schema>;

/**
 * A JSON Schema 2020-12 type: either a full schema object, or the boolean
 * schema forms `true` (always valid) / `false` (never valid).
 */
export type Schema = Document | boolean;

export interface ArrayKeywords<TDocument = unknown> {
  /**
   * While the `items` schema must be valid for every item in the array, the `contains` schema only needs to validate against one or more items in the array.
   */
  contains?: TDocument;
  /**
   * List validation is useful for arrays of arbitrary length where each item matches the same schema. For this kind of array, set the `items` {@link https://json-schema.org/learn/glossary#keyword keyword} to a single schema that will be used to validate all of the items in the array.
   *
   * The `items` keyword can be used to control whether it's valid to have additional items in a tuple beyond what is defined in `prefixItems`. The value of the `items` keyword is a schema that all additional items must pass in order for the keyword to validate.
   *
   * Note that `items` doesn't "see inside" any {@link https://json-schema.org/learn/glossary#instance instances} of `allOf`, `anyOf`, or `oneOf` in the same {@link https://json-schema.org/learn/glossary#subschema subschema}.
   */
  items?: TDocument | false;
  /**
   * `minContains` and `maxContains` can be used with `contains` to further specify how many times a schema matches a `contains` constraint. These keywords can be any non-negative number including zero.
   */
  maxContains?: number;
  /**
   * The length of the array can be specified using the `minItems` and `maxItems` keywords. The value of each keyword must be a non-negative number. These keywords work whether doing {@link https://json-schema.org/understanding-json-schema/reference/array#items list validation} or {@link https://json-schema.org/understanding-json-schema/reference/array#tupleValidation tuple-validation}.
   */
  maxItems?: number;
  /**
   * `minContains` and `maxContains` can be used with `contains` to further specify how many times a schema matches a `contains` constraint. These keywords can be any non-negative number including zero.
   */
  minContains?: number;
  /**
   * The length of the array can be specified using the `minItems` and `maxItems` keywords. The value of each keyword must be a non-negative number. These keywords work whether doing {@link https://json-schema.org/understanding-json-schema/reference/array#items list validation} or {@link https://json-schema.org/understanding-json-schema/reference/array#tupleValidation tuple-validation}.
   */
  minItems?: number;
  /**
   * `prefixItems` is an array, where each item is a schema that corresponds to each index of the document's array. That is, an array where the first element validates the first element of the input array, the second element validates the second element of the input array, etc.
   */
  prefixItems?: Array<TDocument>;
  /**
   * The `unevaluatedItems` keyword is useful mainly when you want to add or disallow extra items to an array.
   *
   * `unevaluatedItems` applies to any values not evaluated by an `items`, `prefixItems`, or `contains` keyword. Just as `unevaluatedProperties` affects only properties in an object, `unevaluatedItems` affects only items in an array.
   *
   * Watch out! The word "unevaluated" _does not mean_ "not evaluated by `items`, `prefixItems`, or `contains`." "Unevaluated" means "not successfully evaluated", or "does not evaluate to true".
   *
   * Like with `items`, if you set `unevaluatedItems` to false, you can disallow extra items in the array.
   */
  unevaluatedItems?: TDocument | false;
  /**
   * A schema can ensure that each of the items in an array is unique. Simply set the `uniqueItems` keyword to `true`.
   */
  uniqueItems?: boolean;
}

export interface NumberKeywords {
  /**
   * Ranges of numbers are specified using a combination of the `minimum` and `maximum` keywords, (or `exclusiveMinimum` and `exclusiveMaximum` for expressing exclusive range).
   *
   * If _x_ is the value being validated, the following must hold true:
   *
   * ```
   * x ≥ minimum
   * x > exclusiveMinimum
   * x ≤ maximum
   * x < exclusiveMaximum
   * ```
   *
   * While you can specify both of `minimum` and `exclusiveMinimum` or both of `maximum` and `exclusiveMaximum`, it doesn't really make sense to do so.
   */
  exclusiveMaximum?: number;
  /**
   * Ranges of numbers are specified using a combination of the `minimum` and `maximum` keywords, (or `exclusiveMinimum` and `exclusiveMaximum` for expressing exclusive range).
   *
   * If _x_ is the value being validated, the following must hold true:
   *
   * ```
   * x ≥ minimum
   * x > exclusiveMinimum
   * x ≤ maximum
   * x < exclusiveMaximum
   * ```
   *
   * While you can specify both of `minimum` and `exclusiveMinimum` or both of `maximum` and `exclusiveMaximum`, it doesn't really make sense to do so.
   */
  exclusiveMinimum?: number;
  /**
   * Ranges of numbers are specified using a combination of the `minimum` and `maximum` keywords, (or `exclusiveMinimum` and `exclusiveMaximum` for expressing exclusive range).
   *
   * If _x_ is the value being validated, the following must hold true:
   *
   * ```
   * x ≥ minimum
   * x > exclusiveMinimum
   * x ≤ maximum
   * x < exclusiveMaximum
   * ```
   *
   * While you can specify both of `minimum` and `exclusiveMinimum` or both of `maximum` and `exclusiveMaximum`, it doesn't really make sense to do so.
   */
  maximum?: number;
  /**
   * Ranges of numbers are specified using a combination of the `minimum` and `maximum` keywords, (or `exclusiveMinimum` and `exclusiveMaximum` for expressing exclusive range).
   *
   * If _x_ is the value being validated, the following must hold true:
   *
   * ```
   * x ≥ minimum
   * x > exclusiveMinimum
   * x ≤ maximum
   * x < exclusiveMaximum
   * ```
   *
   * While you can specify both of `minimum` and `exclusiveMinimum` or both of `maximum` and `exclusiveMaximum`, it doesn't really make sense to do so.
   */
  minimum?: number;
  /**
   * Numbers can be restricted to a multiple of a given number, using the `multipleOf` keyword. It may be set to any positive number. The multiple can be a floating point number.
   */
  multipleOf?: number;
}

export interface ObjectKeywords<TDocument = unknown> {
  /**
   * The `additionalProperties` keyword is used to control the handling of extra stuff, that is, properties whose names are not listed in the `properties` keyword or match any of the regular expressions in the `patternProperties` keyword. By default any additional properties are allowed.
   *
   * The value of the `additionalProperties` keyword is a schema that will be used to validate any properties in the {@link https://json-schema.org/learn/glossary#instance instance} that are not matched by `properties` or `patternProperties`. Setting the `additionalProperties` schema to `false` means no additional properties will be allowed.
   *
   * It's important to note that `additionalProperties` only recognizes properties declared in the same {@link https://json-schema.org/learn/glossary#subschema subschema} as itself. So, `additionalProperties` can restrict you from "extending" a schema using {@link https://json-schema.org/understanding-json-schema/reference/combining combining} keywords such as {@link https://json-schema.org/understanding-json-schema/reference/combining#allof allOf}.
   */
  additionalProperties?: TDocument | false;
  /**
   * The number of properties on an object can be restricted using the `minProperties` and `maxProperties` keywords. Each of these must be a non-negative integer.
   */
  maxProperties?: number;
  /**
   * The number of properties on an object can be restricted using the `minProperties` and `maxProperties` keywords. Each of these must be a non-negative integer.
   */
  minProperties?: number;
  /**
   * Sometimes you want to say that, given a particular kind of property name, the value should match a particular schema. That's where `patternProperties` comes in: it maps regular expressions to schemas. If a property name matches the given regular expression, the property value must validate against the corresponding schema.
   */
  patternProperties?: Record<string, TDocument>;
  /**
   * The properties (key-value pairs) on an object are defined using the `properties` {@link https://json-schema.org/learn/glossary#keyword keyword}. The value of `properties` is an object, where each key is the name of a property and each value is a {@link https://json-schema.org/learn/glossary#schema schema} used to validate that property. Any property that doesn't match any of the property names in the `properties` keyword is ignored by this keyword.
   */
  properties?: Record<string, TDocument | true>;
  /**
   * The names of properties can be validated against a schema, irrespective of their values. This can be useful if you don't want to enforce specific properties, but you want to make sure that the names of those properties follow a specific convention. You might, for example, want to enforce that all names are valid ASCII tokens so they can be used as attributes in a particular programming language.
   *
   * Since object keys must always be strings anyway, it is implied that the schema given to `propertyNames` is always at least:
   *
   * ```json
   * { "type": "string" }
   * ```
   */
  propertyNames?: TDocument;
  /**
   * By default, the properties defined by the `properties` keyword are not required. However, one can provide a list of required properties using the `required` keyword.
   *
   * The `required` keyword takes an array of zero or more strings. Each of these strings must be unique.
   */
  required?: Array<string>;
  /**
   * The `unevaluatedProperties` keyword is similar to `additionalProperties` except that it can recognize properties declared in subschemas. So, the example from the previous section can be rewritten without the need to redeclare properties.
   *
   * `unevaluatedProperties` works by collecting any properties that are successfully validated when processing the schemas and using those as the allowed list of properties. This allows you to do more complex things like conditionally adding properties.
   */
  unevaluatedProperties?: TDocument | false;
}

export interface StringKeywords {
  /**
   * The length of a string can be constrained using the `minLength` and `maxLength` {@link https://json-schema.org/learn/glossary#keyword keywords}. For both keywords, the value must be a non-negative number.
   */
  maxLength?: number;
  /**
   * The length of a string can be constrained using the `minLength` and `maxLength` {@link https://json-schema.org/learn/glossary#keyword keywords}. For both keywords, the value must be a non-negative number.
   */
  minLength?: number;
  /**
   * The `pattern` keyword is used to restrict a string to a particular regular expression. The regular expression syntax is the one defined in JavaScript ({@link https://www.ecma-international.org/publications-and-standards/standards/ecma-262/ ECMA 262} specifically) with Unicode support. See {@link https://json-schema.org/understanding-json-schema/reference/regular_expressions Regular Expressions} for more information.
   */
  pattern?: string;
}

export type JsonSchemaFormats =
  | 'date'
  | 'date-time'
  | 'duration'
  | 'email'
  | 'hostname'
  | 'idn-email'
  | 'idn-hostname'
  | 'ipv4'
  | 'ipv6'
  | 'iri'
  | 'iri-reference'
  | 'json-pointer'
  | 'regex'
  | 'relative-json-pointer'
  | 'time'
  | 'uri'
  | 'uri-reference'
  | 'uri-template'
  | 'uuid'
  | AnyString;

export type JsonSchemaTypes =
  | 'array'
  | 'boolean'
  | 'integer'
  | 'null'
  | 'number'
  | 'object'
  | 'string';
