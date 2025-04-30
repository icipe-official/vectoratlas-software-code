#!/bin/bash

# Ensure version.txt is copied to the mounted volume directory if it's missing
if [ ! -f /usr/src/app/dist/public/version.txt ]; then
  echo "version.txt not found in mounted volume. Copying from /usr/src/app/version.txt"
  cp /usr/src/app/version.txt /usr/src/app/dist/public/version.txt
fi

# Start your application
exec "$@"
