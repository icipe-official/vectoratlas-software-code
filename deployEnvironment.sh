#!/bin/bash
# Stop the script if any command fails
set -e

GREEN='\033[0;32m'
BROWN='\033[1;33m'
NC='\033[0m'

# 1. Stay in the project root for Git operations
echo -e "${BROWN}Fetching and checking out branch $1 ....${NC}"
git fetch
git checkout --force "$1"

# 2. Run configuration scripts
echo -e "${BROWN}Running configuration scripts....${NC}"
chmod +x src/buildVersionFiles.sh
./src/buildVersionFiles.sh

# 3. Build and Deploy from the root
# We use '-f' to point to the file, which lets Docker see the whole 'src' folder
echo -e "${BROWN}Building the new system....${NC}"
docker-compose -f src/Docker/docker-compose.yml build

echo -e "${BROWN}Shutting down the system....${NC}"
docker-compose -f src/Docker/docker-compose.yml down

echo -e "${BROWN}Starting the system again....${NC}"
docker-compose -f src/Docker/docker-compose.yml up --detach

echo -e "${GREEN}Vector Atlas updated and deployed on branch $1${NC}"