export interface OpenAPIV2NullableExtensions {
  /**
   * Not part of Swagger 2.0. Honored leniently because emitters produce this
   * bare form in the wild alongside `x-nullable`. Prefer `x-nullable` when
   * authoring documents.
   *
   * @deprecated Not part of the Swagger 2.0 specification. Present only for
   * lenient parsing of real-world documents. Do not set this intentionally.
   */
  nullable?: boolean;
  /**
   * OpenAPI 2.0 does not natively support null as a type, but you can use
   * `x-nullable` to polyfill this functionality.
   */
  'x-nullable'?: boolean;
}
