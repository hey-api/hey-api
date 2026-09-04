import type { IR } from '@hey-api/shared';

import type { HeyApiSdkPlugin } from '../types';

export interface PySecurityScheme {
  in?: 'cookie' | 'header' | 'query';
  key?: string;
  name?: string;
  scheme?: 'basic' | 'bearer';
  type: 'apiKey' | 'http';
}

// TODO: parser - handle more security types
function securitySchemeObjectToPySecurityScheme({
  securitySchemeObject,
}: {
  securitySchemeObject: IR.SecurityObject;
}): PySecurityScheme | undefined {
  // `key` is set by the parser only when the spec defines two or more
  // security schemes whose normalized scheme shape would collide; forward it
  // so the runtime callback can disambiguate.
  const keyField = securitySchemeObject.key ? { key: securitySchemeObject.key } : {};

  if (securitySchemeObject.type === 'openIdConnect') {
    return {
      ...keyField,
      scheme: 'bearer',
      type: 'http',
    };
  }

  if (securitySchemeObject.type === 'oauth2') {
    if (
      securitySchemeObject.flows.password ||
      securitySchemeObject.flows.authorizationCode ||
      securitySchemeObject.flows.clientCredentials ||
      securitySchemeObject.flows.implicit
    ) {
      return {
        ...keyField,
        scheme: 'bearer',
        type: 'http',
      };
    }

    return;
  }

  if (securitySchemeObject.type === 'apiKey') {
    if (securitySchemeObject.in === 'header') {
      return {
        ...keyField,
        name: securitySchemeObject.name,
        type: 'apiKey',
      };
    }

    if (securitySchemeObject.in === 'query' || securitySchemeObject.in === 'cookie') {
      return {
        ...keyField,
        in: securitySchemeObject.in,
        name: securitySchemeObject.name,
        type: 'apiKey',
      };
    }

    return;
  }

  if (securitySchemeObject.type === 'http') {
    const scheme = securitySchemeObject.scheme.toLowerCase();
    if (scheme === 'bearer' || scheme === 'basic') {
      return {
        ...keyField,
        scheme: scheme as 'bearer' | 'basic',
        type: 'http',
      };
    }

    return;
  }

  return;
}

export function operationAuth({
  operation,
  plugin,
}: {
  operation: IR.OperationObject;
  plugin: HeyApiSdkPlugin['Instance'];
}): Array<PySecurityScheme> {
  if (!operation.security || !plugin.config.auth) {
    return [];
  }

  const auth: Array<PySecurityScheme> = [];

  for (const securitySchemeObject of operation.security) {
    const scheme = securitySchemeObjectToPySecurityScheme({ securitySchemeObject });
    if (scheme) {
      auth.push(scheme);
    } else if (securitySchemeObject.type !== 'mutualTLS') {
      console.warn(
        `❗️ SDK warning: unsupported security scheme. Please open an issue if you'd like it added https://github.com/hey-api/hey-api/issues\n${JSON.stringify(securitySchemeObject, null, 2)}`,
      );
    }
  }

  return auth;
}
