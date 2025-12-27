#!/usr/bin/env bash
set -euo pipefail

KEYSTORE_PATH=${1:-"android-twa/keystore.jks"}
KEY_ALIAS=${2:-"upload"}

if [[ ! -f "${KEYSTORE_PATH}" ]]; then
  echo "Keystore not found at ${KEYSTORE_PATH}."
  echo "Usage: $0 /path/to/keystore.jks [alias]"
  exit 1
fi

keytool -list -v -keystore "${KEYSTORE_PATH}" -alias "${KEY_ALIAS}" \
  | awk '/SHA256:/{print $2}'