cd src/Docker
docker-compose down
git fetch
git checkout --force $1

cd ..
chmod +x buildVersionFiles.sh
./buildVersionFiles.sh

cd Docker
docker-compose build
docker-compose up --detach
cd ../..