#!/bin/bash

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)

# Container
CONTAINER_ENGINE=docker
CONTAINER=vector-atlas-tileserver
NETWORK=vectoratlas
NETWORK_ALIAS=vector-atlas-tileserver
IMAGE=docker-tileserver:latest

# Ports
HTTP_PORT=127.0.0.1:8080:80

docker run -d \
    --name $CONTAINER \
    --network $NETWORK \
    --network-alias $NETWORK_ALIAS \
    --cap-add CAP_NET_BIND_SERVICE \
    -p $HTTP_PORT \
    -v "$SCRIPT_DIR/../data:/data" \
    $IMAGE