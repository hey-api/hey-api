import type { StructureLocation } from '@hey-api/codegen-core';

import type { IR } from '../../../ir/types';
import { operationBaseName } from '../utils/operation';

/**
 * A function that derives path segments from an operation.
 *
 * Used by location strategies to build paths within containers.
 */
export type OperationPathStrategy = (operation: IR.OperationObject) => ReadonlyArray<string>;

/**
 * A function that determines where an operation appears in the structure.
 *
 * Returns one or more locations, each with a full path.
 */
export type OperationStructureStrategy = (
  operation: IR.OperationObject,
) => ReadonlyArray<StructureLocation['path']>;

export type OperationsStrategy = 'byTags' | 'flat' | 'single' | OperationStructureStrategy;

/**
 * Built-in strategies for operations.
 */
export const OperationStrategy = {
  /**
   * Creates one root container per operation tag.
   *
   * Operations with multiple tags appear in multiple root containers.
   * Operations without tags use the fallback root container.
   *
   * @example
   * // Operation with tags: ['users', 'admin']
   * // Path function returns: ['list']
   * // Result: [{ path: ['users', 'list'], shell }, { path: ['admin', 'list'], shell }]
   */
  byTags:
    (config: {
      /**
       * Root name for operations without tags.
       */
      fallback: string;
      /**
       * Derives path segments from the operation.
       *
       * @default OperationPath.id()
       */
      path?: OperationPathStrategy;
    }): OperationStructureStrategy =>
    (operation) => {
      const tags = operation.tags && operation.tags.length ? operation.tags : [config.fallback];
      const path = config.path ?? OperationPath.id();
      const pathSegments = path(operation);
      return tags.map((tag) => [tag, ...pathSegments]);
    },

  /**
   * Creates flat functions without any container.
   *
   * Each operation becomes a standalone function at the root level.
   * No shell is applied.
   *
   * @example
   * // Operation id: 'getUsers'
   * // Result: [{ path: ['getUsers'] }]
   */
  flat:
    (config?: {
      /**
       * Derives path segments within the root from the operation.
       *
       * @default OperationPath.id()
       */
      path?: OperationPathStrategy;
    }): OperationStructureStrategy =>
    (operation) => {
      const path = config?.path ?? OperationPath.id();
      const pathSegments = path(operation);
      return [[pathSegments[pathSegments.length - 1]!]];
    },

  /**
   * Places all operations under a single root container.
   *
   * @example
   * // Root: 'Sdk', path function returns: ['users', 'list']
   * // Result: [{ path: ['Sdk', 'users', 'list'], shell }]
   */
  single:
    (config: {
      /**
       * Derives path segments within the root from the operation.
       *
       * @default OperationPath.id()
       */
      path?: OperationPathStrategy;
      /**
       * Name of the container.
       */
      root: string;
    }): OperationStructureStrategy =>
    (operation) => {
      const path = config.path ?? OperationPath.id();
      const pathSegments = path(operation);
      return [[config.root, ...pathSegments]];
    },
};

/**
 * Built-in path derivation helpers for operations.
 */
export const OperationPath = {
  /**
   * Splits operationId by delimiters to create nested paths.
   *
   * @example
   * // operationId: 'users.accounts.list'
   * // Result: ['users', 'accounts', 'list']
   *
   * @example
   * // operationId: 'users/accounts/getAll'
   * // Result: ['users', 'accounts', 'getAll']
   */
  fromOperationId:
    (config?: {
      /**
       * Pattern to split operationId.
       *
       * @default /[./]/
       */
      delimiters?: RegExp;
      /**
       * Fallback strategy if operationId is missing.
       *
       * @default OperationPath.id()
       */
      fallback?: OperationPathStrategy;
    }): OperationPathStrategy =>
    (operation) => {
      const fallback = config?.fallback ?? OperationPath.id();
      if (!operation.operationId) return fallback(operation);
      const delimiters = config?.delimiters ?? /[./]/;
      const segments = operation.operationId.split(delimiters).filter(Boolean);
      return !segments.length ? fallback(operation) : segments;
    },

  /**
   * Splits path by delimiters to create nested paths.
   *
   * Can include the method as a prefix or suffix segment.
   *
   * @example
   * // path: '/users/{id}/accounts', method: 'get', delimiters: /[\/{}]+/, methodPosition: 'none'
   * // Result: ['users', 'id', 'accounts']
   *
   * @example
   * // path: '/users/{id}/accounts', method: 'get', delimiters: /[\/{}]+/, methodPosition: 'prefix'
   * // Result: ['get', 'users', 'id', 'accounts']
   *
   * @example
   * // path: '/users/{id}/accounts', method: 'get', delimiters: /[\/{}]+/, methodPosition: 'suffix'
   * // Result: ['users', 'id', 'accounts', 'get']
   */
  fromPath:
    (config?: {
      /**
       * Pattern to split the path.
       *
       * @default /[./]/
       */
      delimiters?: RegExp;
      /**
       * Position of the method segment.
       *
       * @default 'none'
       */
      methodPosition?: 'prefix' | 'suffix';
    }): OperationPathStrategy =>
    (operation) => {
      const delimiters = config?.delimiters ?? /[./]/;
      const segments = operation.path.split(delimiters).filter(Boolean);
      switch (config?.methodPosition) {
        case 'prefix':
          segments.unshift(operation.method.toLowerCase());
          break;
        case 'suffix':
          segments.push(operation.method.toLowerCase());
          break;
        default:
          break;
      }
      return segments;
    },

  /**
   * Uses operation.id as a single path segment.
   *
   * @example
   * // operation.id: 'getUserById'
   * // Result: ['getUserById']
   */
  id: (): OperationPathStrategy => (operation) => [operationBaseName(operation)],
};
