GREEN='\033[0;32m'
LIGHTBLUE='\033[1;34m'
NC='\033[0m' # no colour

cd src/Docker
echo -e "${LIGHTBLUE}Shutting down the system....${NC}"
docker-compose down

echo -e "${LIGHTBLUE}Fetching and checking out commit $1 ....${NC}"
git fetch
git checkout --force $1

echo -e "${LIGHTBLUE}Running configuration scripts....${NC}"
cd ..
chmod +x buildVersionFiles.sh
./buildVersionFiles.sh

cd Docker
echo -e "${LIGHTBLUE}Building the new system....${NC}"
docker-compose build

echo -e "${LIGHTBLUE}Starting the system again....${NC}"
docker-compose up --detach
cd ../..