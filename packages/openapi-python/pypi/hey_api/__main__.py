"""Run as `python -m hey_api`, `hey-api`, or `openapi-python`."""

import os
import platform
from pathlib import Path
import signal
import subprocess
import sys


def _get_binary_path() -> str:
    """Returns the path to the bundled openapi-python binary."""
    bin_dir = Path(__file__).parent / "bin"
    system = platform.system().lower()
    machine = platform.machine().lower()

    if machine in ("x86_64", "amd64"):
        arch = "x64"
    elif machine in ("arm64", "aarch64"):
        arch = "arm64"
    else:
        raise RuntimeError(f"Unsupported architecture: {machine}")

    if system == "windows":
        name = f"openapi-python-win-{arch}.exe"
    elif system == "darwin":
        name = f"openapi-python-darwin-{arch}"
    elif system == "linux":
        name = f"openapi-python-linux-{arch}"
    else:
        raise RuntimeError(f"Unsupported platform: {system}")

    path = bin_dir / name
    if not path.is_file():
        raise FileNotFoundError(
            f"Binary not found at {path}. "
            f"This pre-release does not include bundled binaries. "
            f"Install a stable release or use npx @hey-api/openapi-python instead. "
            f"https://heyapi.dev/docs/openapi/python/get-started"
        )
    return str(path)


def main() -> int:
    try:
        binary = _get_binary_path()
    except (FileNotFoundError, RuntimeError) as exc:
      print(f"Error: {exc}", file=sys.stderr)
      return 1

    if sys.platform != "win32":
        os.chmod(binary, 0o755)

    try:
        result = subprocess.run(
            [binary, *sys.argv[1:]],
            stdin=sys.stdin,
            stdout=sys.stdout,
            stderr=sys.stderr,
        )
        return result.returncode
    except KeyboardInterrupt:
        return 128 + signal.SIGINT


if __name__ == "__main__":
    raise SystemExit(main())
