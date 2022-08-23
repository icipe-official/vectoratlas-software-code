mkdir -p data
mkdir -p ./data/geojson

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
mv countries.json ../geojson/countries.json
cd ../ne_10m_land
ogr2ogr -f GeoJSON land.json ne_10m_land.shp
mv land.json ../geojson/land.json
cd ../ne_10m_ocean
ogr2ogr -f GeoJSON ocean.json ne_10m_ocean.shp
mv ocean.json ../geojson/ocean.json
cd ../ne_10m_rivers_lake_centerlines
ogr2ogr -f GeoJSON rivers_lakes.json ne_10m_rivers_lake_centerlines.shp
mv rivers_lakes.json ../geojson/rivers_lakes.json
cd ../ne_10m_lakes 
ogr2ogr -f GeoJSON lakes_reservoirs.json ne_10m_lakes.shp
mv lakes_reservoirs.json ../geojson/lakes_reservoirs.json
cd ../
rm -r ne_10m_* 
cd ../
cd data/geojson

tippecanoe -zg -Z5 -o rivers-and-lakes.mbtiles --coalesce-densest-as-needed --extend-zooms-if-still-dropping rivers_lakes.json lakes_reservoirs.json
tippecanoe -zg -o land-and-oceans.mbtiles --coalesce-densest-as-needed --extend-zooms-if-still-dropping countries.json land.json ocean.json
tile-join -o world.mbtiles rivers-and-lakes.mbtiles land-and-oceans.mbtiles --force
cd ..
