#!/usr/bin/env bash
set -euo pipefail

KEYSTORE_PATH=${1:-"android-twa/keystore.jks"}
KEY_ALIAS=${2:-"upload"}

if [[ -f "${KEYSTORE_PATH}" ]]; then
  echo "Keystore already exists at ${KEYSTORE_PATH}."
  exit 1
fi

mkdir -p "$(dirname "${KEYSTORE_PATH}")"

echo "Generating keystore at ${KEYSTORE_PATH} (alias: ${KEY_ALIAS})"
keytool -genkeypair -v \
  -keystore "${KEYSTORE_PATH}" \
  -alias "${KEY_ALIAS}" \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

echo "Done. Store the keystore securely and do not commit it."