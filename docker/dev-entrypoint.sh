#!/bin/sh
set -e
# Install deps when node_modules is missing or empty (named volume first boot).
if [ ! -d node_modules ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then
  npm ci
fi
exec "$@"
