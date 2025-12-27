#!/usr/bin/env bash
set -euo pipefail

BASE_URL=${BASE_URL:-"https://radikals.fun"}

check_url() {
  local url="$1"
  echo "Checking ${url}"
  curl -fsSL "${url}" > /dev/null
}

check_url "${BASE_URL}/manifest.json"
check_url "${BASE_URL}/sw.js"
check_url "${BASE_URL}/.well-known/assetlinks.json"

if command -v bubblewrap >/dev/null 2>&1; then
  bubblewrap doctor
else
  echo "bubblewrap not found in PATH. Run: npx @bubblewrap/cli doctor"
fi
