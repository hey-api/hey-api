import type { RangeInput, RangeOptions, SemVer } from 'verkit';
import { coerce, findMinimumForRange, satisfies, tryParse } from 'verkit';

export type Dependency = {
  /**
   * Get the installed version of a package.
   * @param name The name of the package to get the version for.
   * @returns A SemVer object containing version information, or undefined if the package is not installed
   *         or the version string is invalid.
   */
  getVersion: (name: string) => SemVer | undefined;
  /**
   * Check if a given package is installed in the project.
   * @param name The name of the package to check.
   */
  isInstalled: (name: string) => boolean;
  /**
   * Check if the installed version of a package or a given SemVer object satisfies a semver range.
   * @param nameOrVersion The name of the package to check, or a SemVer object.
   * @param range The semver range to check against.
   * @returns True if the version satisfies the range, false otherwise.
   */
  satisfies: (nameOrVersion: string | SemVer, range: RangeInput, options?: RangeOptions) => boolean;
};

export { normalizeFull, satisfies } from 'verkit';

export function dependencyFactory(dependencies: Record<string, string>): Dependency {
  return {
    getVersion: (name) => {
      const version = dependencies[name];
      if (!version) return;

      let parsed = tryParse(version);
      if (parsed) return parsed;

      try {
        const min = findMinimumForRange(version);
        if (min) return tryParse(min) ?? undefined;
      } catch {
        // noop
      }

      const coerced = coerce(version);
      parsed = coerced ? tryParse(coerced) : null;
      if (parsed) return parsed;
      return;
    },
    isInstalled: (name) => Boolean(dependencies[name]),
    satisfies: (nameOrVersion, range, options) => {
      const version =
        typeof nameOrVersion === 'string' ? dependencies[nameOrVersion] : nameOrVersion;
      return version ? satisfies(version, range, options) : false;
    },
  };
}
