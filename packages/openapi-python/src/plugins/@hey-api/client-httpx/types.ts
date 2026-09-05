import type { DefinePlugin, Plugin } from '@hey-api/shared';

export type UserConfig = Plugin.Name<'@hey-api/client-httpx'> & {
  /**
   * Also generate an async counterpart of every SDK class, backed by
   * `httpx.AsyncClient`? The async classes sit alongside the sync ones with
   * an `Async` prefix (e.g. `Sdk` and `AsyncSdk`) and expose identical
   * method names, so switching a call site from sync to async is just
   * adding `await`.
   *
   * Off by default, so an existing output does not grow without being asked.
   *
   * @default false
   */
  asyncMode?: boolean;
  /**
   * Set a default base URL when creating the client? You can set `baseUrl`
   * to a string which will be used as the base URL. If your input defines
   * server(s), you can set `baseUrl` to a number to pick a specific server
   * to use as the base URL. You can disable setting the base URL by setting
   * `baseUrl` to `false`. By default, `baseUrl` is `true` and it will try to
   * use the first defined server value. If there's none, we won't set a
   * base URL.
   *
   * If the matched URL contains template literals, it will be ignored.
   *
   * @default true
   */
  baseUrl?: string | number | boolean;
};

export type Config = Plugin.Name<'@hey-api/client-httpx'> & {
  asyncMode: boolean;
  baseUrl: string | number | boolean;
};

export type HeyApiClientHttpxPlugin = DefinePlugin<UserConfig, Config>;
