import type { Patch } from '../../../config/parser/patch';
import { satisfies } from '../../../config/utils/dependencies';
import type { OpenApi } from '../../../openApi/types';

export async function patchOpenApiSpec({
  patchOptions,
  spec: _spec,
}: {
  patchOptions: Patch | undefined;
  spec: unknown;
}) {
  if (!patchOptions) {
    return;
  }

  const spec = _spec as OpenApi.V2_0_X | OpenApi.V3_0_X | OpenApi.V3_1_X;

  if (typeof patchOptions === 'function') {
    await patchOptions(spec);
    return;
  }

  if (patchOptions.input) {
    await patchOptions.input(spec);
  }

  if ('swagger' in spec) {
    if (patchOptions.version && spec.swagger) {
      spec.swagger = (
        typeof patchOptions.version === 'string'
          ? patchOptions.version
          : patchOptions.version(spec.swagger)
      ) as typeof spec.swagger;
    }

    if (patchOptions.meta && spec.info) {
      patchOptions.meta(spec.info);
    }

    if (patchOptions.schemas && spec.definitions) {
      if (typeof patchOptions.schemas === 'function') {
        for (const [key, schema] of Object.entries(spec.definitions)) {
          if (schema && typeof schema === 'object') {
            await patchOptions.schemas(key, schema);
          }
        }
      } else {
        for (const key in patchOptions.schemas) {
          const schema = spec.definitions[key];
          if (!schema || typeof schema !== 'object') continue;

          const patchFn = patchOptions.schemas[key]!;
          await patchFn(schema);
        }
      }
    }

    if (patchOptions.operations && spec.paths) {
      if (typeof patchOptions.operations === 'function') {
        // Bulk callback: iterate all operations
        for (const [path, pathItem] of Object.entries(spec.paths)) {
          if (!pathItem || typeof pathItem !== 'object') continue;
          for (const method of [
            'get',
            'put',
            'post',
            'delete',
            'options',
            'head',
            'patch',
            'trace',
          ]) {
            const operation = pathItem[method as keyof typeof pathItem];
            if (!operation || typeof operation !== 'object') continue;
            await patchOptions.operations(method, path, operation as any);
          }
        }
      } else {
        // Record-based: iterate named operations
        for (const key in patchOptions.operations) {
          const [method, path] = key.split(' ');
          if (!method || !path) continue;

          const pathItem = spec.paths[path as keyof typeof spec.paths];
          if (!pathItem) continue;

          const operation =
            pathItem[method.toLocaleLowerCase() as keyof typeof pathItem] ||
            pathItem[method.toLocaleUpperCase() as keyof typeof pathItem];
          if (!operation || typeof operation !== 'object') continue;

          const patchFn = patchOptions.operations[key]!;
          await patchFn(operation as any);
        }
      }
    }
    return;
  }

  if (patchOptions.version && spec.openapi) {
    spec.openapi = (
      typeof patchOptions.version === 'string'
        ? patchOptions.version
        : patchOptions.version(spec.openapi)
    ) as typeof spec.openapi;
  }

  if (patchOptions.meta && spec.info) {
    patchOptions.meta(spec.info);
  }

  if (spec.components) {
    if (patchOptions.schemas && spec.components.schemas) {
      if (typeof patchOptions.schemas === 'function') {
        for (const [key, schema] of Object.entries(spec.components.schemas)) {
          if (schema && typeof schema === 'object') {
            await patchOptions.schemas(key, schema as Parameters<typeof patchOptions.schemas>[1]);
          }
        }
      } else {
        for (const key in patchOptions.schemas) {
          const schema = spec.components.schemas[key];
          if (!schema || typeof schema !== 'object') continue;

          const patchFn = patchOptions.schemas[key]!;
          await patchFn(schema as Parameters<typeof patchFn>[0]);
        }
      }
    }

    if (patchOptions.parameters && spec.components.parameters) {
      for (const key in patchOptions.parameters) {
        const schema = spec.components.parameters[key];
        if (!schema || typeof schema !== 'object') continue;

        const patchFn = patchOptions.parameters[key]!;
        patchFn(schema);
      }
    }

    if (patchOptions.requestBodies && spec.components.requestBodies) {
      for (const key in patchOptions.requestBodies) {
        const schema = spec.components.requestBodies[key];
        if (!schema || typeof schema !== 'object') continue;

        const patchFn = patchOptions.requestBodies[key]!;
        patchFn(schema);
      }
    }

    if (patchOptions.responses && spec.components.responses) {
      for (const key in patchOptions.responses) {
        const schema = spec.components.responses[key];
        if (!schema || typeof schema !== 'object') continue;

        const patchFn = patchOptions.responses[key]!;
        patchFn(schema);
      }
    }
  }

  if (patchOptions.operations && spec.paths) {
    if (typeof patchOptions.operations === 'function') {
      // Bulk callback: iterate all operations
      for (const [path, pathItem] of Object.entries(spec.paths)) {
        if (!pathItem || typeof pathItem !== 'object') continue;
        const methods = [
          'get',
          'put',
          'post',
          'delete',
          'options',
          'head',
          'patch',
          ...(satisfies(spec.openapi, '>=3.2.0') ? (['query'] as const) : []),
          'trace',
        ] as const;
        for (const method of methods) {
          const operation = pathItem[method as keyof typeof pathItem];
          if (!operation || typeof operation !== 'object') continue;
          await patchOptions.operations(method, path, operation as any);
        }
      }
    } else {
      // Record-based: iterate named operations
      for (const key in patchOptions.operations) {
        const [method, path] = key.split(' ');
        if (!method || !path) continue;

        const pathItem = spec.paths[path as keyof typeof spec.paths];
        if (!pathItem) continue;

        const operation =
          pathItem[method.toLocaleLowerCase() as keyof typeof pathItem] ||
          pathItem[method.toLocaleUpperCase() as keyof typeof pathItem];
        if (!operation || typeof operation !== 'object') continue;

        const patchFn = patchOptions.operations[key]!;
        await patchFn(operation as any);
      }
    }
  }
}
