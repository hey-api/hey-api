import type { OpenAPIV2, OpenAPIV3, OpenAPIV3_1 } from '@hey-api/spec-types';

export namespace OpenApi {
  export type V2_0_X = OpenAPIV2.Document;

  export type V3_0_X = OpenAPIV3.Document;

  export type V3_1_X = OpenAPIV3_1.Document;
}

export namespace OpenApiMetaObject {
  export type V2_0_X = OpenAPIV2.InfoObject;

  export type V3_0_X = OpenAPIV3.InfoObject;

  export type V3_1_X = OpenAPIV3_1.InfoObject;
}

export namespace OpenApiOperationObject {
  export type V2_0_X = OpenAPIV2.OperationObject;

  export type V3_0_X = OpenAPIV3.OperationObject;

  export type V3_1_X = OpenAPIV3_1.OperationObject;
}

export namespace OpenApiParameterObject {
  export type V3_0_X = OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject;

  export type V3_1_X = OpenAPIV3_1.ParameterObject | OpenAPIV3_1.ReferenceObject;
}

export namespace OpenApiRequestBodyObject {
  export type V3_0_X = OpenAPIV3.RequestBodyObject | OpenAPIV3.ReferenceObject;

  export type V3_1_X = OpenAPIV3_1.RequestBodyObject | OpenAPIV3_1.ReferenceObject;
}

export namespace OpenApiResponseObject {
  export type V3_0_X = OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject;

  export type V3_1_X = OpenAPIV3_1.ResponseObject | OpenAPIV3_1.ReferenceObject;
}

export namespace OpenApiSchemaObject {
  export type V2_0_X = OpenAPIV2.SchemaObject;

  export type V3_0_X = OpenAPIV3.SchemaObject;

  export type V3_1_X = OpenAPIV3_1.SchemaObject;
}
