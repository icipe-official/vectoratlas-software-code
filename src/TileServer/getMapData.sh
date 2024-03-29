mkdir -p data
mkdir -p ./data/geojson
mkdir -p ./data/overlays

get_naturalEarthData () {
    wget -O data/$2.zip https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/$1/$2.zip
    unzip -o ./data/$2.zip -d ./data/$2
    rm -r data/$2.zip
    cd ./data/$2
    ogr2ogr -f GeoJSON $3.json $2.shp
    mv $3.json ../geojson/$3.json
    cd ../../
    rm -r ./data/$2
}

cleanup_data_geojson_json () {
    rm -r data/geojson/$1.json
}

get_naturalEarthData cultural ne_10m_admin_0_countries countries
get_naturalEarthData physical ne_10m_land land
get_naturalEarthData physical ne_10m_ocean oceans
get_naturalEarthData physical ne_10m_rivers_lake_centerlines rivers_lakes
# Lakes data comes from OSM and can't be built quickly during deployment
cp ./data/lakes.mbtiles ./data/geojson/lakes.mbtiles

cd ./data/geojson
tippecanoe -zg -o world-without-lakes.mbtiles --extend-zooms-if-still-dropping countries.json land.json oceans.json rivers_lakes.json --force
tile-join -o world.mbtiles world-without-lakes.mbtiles lakes.mbtiles --force
cd ../../

cleanup_data_geojson_json countries
cleanup_data_geojson_json land
cleanup_data_geojson_json oceans
cleanup_data_geojson_json rivers_lakes
