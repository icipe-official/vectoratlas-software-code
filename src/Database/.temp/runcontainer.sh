#!/bin/bash

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)

# Container
CONTAINER=vector-atlas-db
NETWORK=vectoratlas
NETWORK_ALIAS=vector-atlas-db
IMAGE=docker-db:latest

# Ports
HTTP_PORT=127.0.0.1:5432:5432

docker run -d \
    --name $CONTAINER \
    --network $NETWORK \
    --network-alias $NETWORK_ALIAS \
    -p $HTTP_PORT \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=postgrespass \
    -e POSTGRES_DB=mva \
    $IMAGE