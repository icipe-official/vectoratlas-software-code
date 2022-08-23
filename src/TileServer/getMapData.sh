# sudo apt-get install unzip / Will likely need a separate install folder
# sudo apt-get update
# sudo apt-get install gdal-bin
chmod +x ./getMapData.sh
mkdir -p data
mkdir -p ./data/geojson_tippe

wget -O data/ne_10m_admin_0_countries.zip https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_admin_0_countries.zip
wget -O ./data/ne_10m_land.zip https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/physical/ne_10m_land.zip
wget -O ./data/ne_10m_ocean.zip https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/physical/ne_10m_ocean.zip
wget -O ./data/ne_10m_rivers_lake_centerlines.zip https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/physical/ne_10m_rivers_lake_centerlines.zip
wget -O ./data/ne_10m_lakes.zip https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/physical/ne_10m_lakes.zip

unzip -o ./data/ne_10m_admin_0_countries.zip -d ./data/ne_10m_admin_0_countries
unzip -o ./data/ne_10m_land.zip -d ./data/ne_10m_land
unzip -o ./data/ne_10m_ocean.zip -d ./data/ne_10m_ocean
unzip -o ./data/ne_10m_rivers_lake_centerlines.zip -d ./data/ne_10m_rivers_lake_centerlines
unzip -o ./data/ne_10m_lakes.zip -d ./data/ne_10m_lakes

find . -name "*.zip" -type f -delete

cd ./data/ne_10m_admin_0_countries
ogr2ogr -f GeoJSON countries.json ne_10m_admin_0_countries.shp
mv countries.json ../geojson_tippe/countries.json
cd ../ne_10m_land
ogr2ogr -f GeoJSON land.json ne_10m_land.shp
mv land.json ../geojson_tippe/land.json
cd ../ne_10m_ocean
ogr2ogr -f GeoJSON ocean.json ne_10m_ocean.shp
mv ocean.json ../geojson_tippe/ocean.json
cd ../ne_10m_rivers_lake_centerlines
ogr2ogr -f GeoJSON rivers_lakes.json ne_10m_rivers_lake_centerlines.shp
mv rivers_lakes.json ../geojson_tippe/rivers_lakes.json
cd ../ne_10m_lakes 
ogr2ogr -f GeoJSON lakes_reservoirs.json ne_10m_lakes.shp
mv lakes_reservoirs.json ../geojson_tippe/lakes_reservoirs.json
cd ../
rm -r ne_10m_* 
cd ../

git clone https://github.com/mapbox/tippecanoe.git
cd tippecanoe
make -j
make install
