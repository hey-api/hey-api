#!/usr/bin/env python3
"""Build platform-specific wheels for hey-api.

Requires: pip install hatchling wheel

This script:
1. Resolves the version to publish, preferring HEY_API_SNAPSHOT_VERSION
   (set by CI for snapshot builds) and falling back to package.json for
   stable releases, then patches pyproject.toml with it
2. For each platform binary in build/, builds a wheel with hatchling
3. Re-tags the wheel with the correct platform tag using `wheel tags`
   (this updates both the filename AND internal WHEEL metadata)
"""

import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

PLATFORM_MAP = {
    "openapi-python-linux-x64": "manylinux_2_17_x86_64.manylinux2014_x86_64",
    "openapi-python-linux-arm64": "manylinux_2_17_aarch64.manylinux2014_aarch64",
    "openapi-python-darwin-arm64": "macosx_11_0_arm64",
    "openapi-python-win-x64.exe": "win_amd64",
}


def sync_version() -> str:
    """Resolve the version to publish and patch pyproject.toml with it.

    HEY_API_SNAPSHOT_VERSION (set by the snapshot-pypi CI job) takes
    precedence so snapshot builds get a unique, PEP 440-compliant dev
    version instead of the raw package.json version — otherwise every
    snapshot on the same day would collide and skip-existing would
    silently no-op after the first publish. Stable releases (publish-pypi)
    never set this env var, so they fall through to package.json unchanged.
    """
    version = os.environ.get("HEY_API_SNAPSHOT_VERSION")
    if not version:
        pkg_json = Path(__file__).parent.parent / "package.json"
        with open(pkg_json) as f:
            version = json.load(f)["version"]

    pyproject = Path(__file__).parent / "pyproject.toml"
    content = pyproject.read_text()
    content = re.sub(
        r'^version\s*=\s*".*"',
        f'version = "{version}"',
        content,
        flags=re.MULTILINE,
    )
    pyproject.write_text(content)
    return version


def build_wheel(binary_path: Path, platform_tag: str, dist_dir: Path) -> None:
    """Build a wheel for a specific platform by staging the binary."""
    pypi_dir = Path(__file__).parent
    bin_dir = pypi_dir / "hey_api" / "bin"
    bin_dir.mkdir(exist_ok=True)

    for f in bin_dir.iterdir():
        if f.name != ".gitkeep":
            f.unlink()

    dest = bin_dir / binary_path.name
    shutil.copy2(binary_path, dest)
    dest.chmod(0o755)

    subprocess.run(
        [
            sys.executable, "-m", "hatchling", "build",
            "--target", "wheel",
            "-d", str(dist_dir),
        ],
        cwd=str(pypi_dir),
        check=True,
    )

    # Re-tag with correct platform. `wheel tags` updates the internal
    # WHEEL metadata (Tag + Root-Is-Purelib) AND renames the file.
    for whl in sorted(dist_dir.glob("hey_api-*-py3-none-any.whl")):
        subprocess.run(
            [
                sys.executable, "-m", "wheel", "tags",
                "--remove",
                "--platform-tag", platform_tag,
                str(whl),
            ],
            check=True,
        )

    for f in bin_dir.iterdir():
        if f.name != ".gitkeep":
            f.unlink()


def main() -> None:
    build_dir = Path(__file__).parent.parent / "build"
    dist_dir = Path(__file__).parent / "dist"
    dist_dir.mkdir(exist_ok=True)

    for whl in dist_dir.glob("*.whl"):
        whl.unlink()

    version = sync_version()
    print(f"Building wheels for v{version}\n")

    built = 0
    for binary_name, platform_tag in PLATFORM_MAP.items():
        binary_path = build_dir / binary_name
        if not binary_path.exists():
            print(f"  skip  {binary_name} (not found)", file=sys.stderr)
            continue
        print(f"  build {platform_tag}")
        build_wheel(binary_path, platform_tag, dist_dir)
        built += 1

    wheels = list(dist_dir.glob("*.whl"))
    print(f"\n  {len(wheels)} wheels in {dist_dir}/")
    for whl in sorted(wheels):
        size_mb = whl.stat().st_size / (1024 * 1024)
        print(f"    {whl.name}  ({size_mb:.1f} MB)")

    if built < len(PLATFORM_MAP):
        print(
            f"\n  warning: only {built}/{len(PLATFORM_MAP)} platform "
            "binaries found — check the build step output above",
            file=sys.stderr,
        )


if __name__ == "__main__":
    main()
