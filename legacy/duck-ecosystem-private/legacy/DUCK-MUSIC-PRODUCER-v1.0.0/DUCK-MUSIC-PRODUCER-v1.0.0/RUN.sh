#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

command -v node >/dev/null 2>&1 || { echo "node is required" >&2; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "pnpm is required" >&2; exit 1; }

pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm duck:build
exec pnpm duck:api
