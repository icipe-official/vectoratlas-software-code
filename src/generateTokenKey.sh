key=`head -c 20 /dev/random | base64`
echo "${key}"
sed -i "s/<token-key>/$key/g" UI/.env.production;
sed -i "s/<token-key>/$key/g" UI/.env.local;
sed -i "s/<token-key>/$key/g" API/.envrc;
sed -i "s/<token-key>/$key/g" Docker/docker-compose.yml;
sed -i "s/<token-key>/$key/g" Docker/docker-compose.test-local.yml;
