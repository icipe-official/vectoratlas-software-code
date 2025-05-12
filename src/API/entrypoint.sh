#!/bin/bash
set -x  # Enable debug mode

if [ ! -f /usr/src/app/dist/public/version.txt ]; then
  echo "version.txt not found in mounted volume. Copying from /usr/src/app/version.txt"
  cp /usr/src/app/version.txt /usr/src/app/dist/public/version.txt
fi

exec "$@"
