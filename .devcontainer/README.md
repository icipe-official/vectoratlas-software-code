# Dev Container

This section contains instructions on how setup and run an isolated container for development.

The container can be used to execute setups and othe related scripts that require an ubuntu environment as well as run both the API, UI, and any other services.

The [container image](./Dockerfile) does the following:
1. Installs nvm, python, and other pre-requisite dependencies.
2. Sets up and runs an ssh service which allows for remoting via vscode.

## Build the container image

The shell script below is example on how to build the [dev](./Dockerfile) container.

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
