# Dev Container

This section contains instructions on how setup and run an isolated container for development.

The container can be used to execute setups and othe related scripts that require an ubuntu environment as well as run both the API, UI, and any other services.

The [container image](./Dockerfile) does the following:
1. Installs nvm, python, and other pre-requisite dependencies.
2. Sets up and runs an ssh service which allows for remoting via vscode.

## Build the container image

The shell script below is example on how to build the [dev](./Dockerfile) container. Assumption is script is in `.devcontainer/.tmp` directory.

```bash
#!/bin/bash

CONTAINER_ENGINE="docker" # docker or podman
CONTAINER_IMAGE_NAME="localhost/vector-atlas-dev"
CONTAINER_TAG="latest"
DIRECTORY="." # Where the Dockerfile is located

$CONTAINER_ENGINE build -t $CONTAINER_IMAGE_NAME:$CONTAINER_TAG $DIRECTORY
```

## Run the container image

The shell script below is example on how to run the [dev](./Dockerfile) container.

```bash
#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# Container
CONTAINER_ENGINE="sudo podman"
CONTAINER="vector-atlas-dev"
NETWORK="vector-atlas"
NETWORK_ALIAS="vector-atlas-dev"
CONTAINER_UID=1000
IMAGE="localhost/vector-atlas-dev:latest"


# Ports
SSH_PORT="127.0.0.1:2200:22" # for local proxy vscode ssh access


# Check if container exists (Running or Stopped)
if $CONTAINER_ENGINE ps -a --format '{{.Names}}' | grep -q "^$CONTAINER$"; then
    echo "   Found existing container: $CONTAINER"
    # Check if it is currently running
    if $CONTAINER_ENGINE ps --format '{{.Names}}' | grep -q "^$CONTAINER$"; then
        echo "✅ Container is already running."
    else
        echo "🔄 Container stopped. Starting it..."
        $CONTAINER_ENGINE start $CONTAINER
        echo "✅ Started."
    fi
else
    # Container doesn't exist -> Create and Run it
    echo "🆕 Container not found. Creating new..."
    $CONTAINER_ENGINE run -d \
    # start container from scratch
    # `sudo` is used because systemd-leap network was created in `sudo`
    # Ensure container image exists in `sudo`
    # Not needed if target network is not in `sudo`
    sudo podman run -d \
        --name $CONTAINER \
        --network $NETWORK \
        --network-alias $NETWORK_ALIAS \
        --user $CONTAINER_UID:$CONTAINER_UID \
        -p $SSH_PORT \
        -v $SCRIPT_DIR/../../:/home/dev/Projects/vectoratlas-software-code:Z \
        $IMAGE
    echo "✅ Created and Started."
fi
```
