#!/bin/bash

set -e

if [ "$#" -eq 0 ]; then
  set -- just
fi

if [ "${1#-}" != "$1" ]; then
  set -- just "$@"
fi

exec "$@"
