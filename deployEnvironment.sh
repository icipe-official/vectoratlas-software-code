GREEN='\033[0;32m'
BROWN='\033[1;33m'
NC='\033[0m' # no colour

cd src/Docker

echo -e "${BROWN}Fetching and checking out commit $1 ....${NC}"
git fetch
git checkout --force $1

echo -e "${BROWN}Running configuration scripts....${NC}"
cd ..
chmod +x buildVersionFiles.sh
./buildVersionFiles.sh

cd Docker
echo -e "${BROWN}Building the new system....${NC}"
docker-compose build

echo -e "${BROWN}Shutting down the system....${NC}"
docker-compose down

echo -e "${BROWN}Starting the system again....${NC}"
docker-compose up --detach
cd ../..

echo -e "${GREEN}Vector Atlas updated and deployed${NC}"
