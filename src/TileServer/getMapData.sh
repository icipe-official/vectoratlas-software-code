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

get_mbtiles () {
    gdaldem color-relief $1.tif ../colormap.txt ../overlays/$1_colorized.tif -alpha
    cd ../overlays
    gdal_translate -of MBTiles -ot Byte $1_colorized.tif $1.mbtiles
    gdaladdo -r nearest $1.mbtiles 2 4 8 16 32
    cd ../../
}

cleanup_data_geojson_json () {
    rm -r data/geojson/$1.json
}

cd ./data/blobStore/
for tif in *.tif; do
    get_mbtiles "${tif%.*}";
    done

get_naturalEarthData cultural ne_10m_admin_0_countries countries
get_naturalEarthData physical ne_10m_land land
get_naturalEarthData physical ne_10m_ocean oceans
get_naturalEarthData physical ne_10m_rivers_lake_centerlines rivers_lakes
get_naturalEarthData physical ne_10m_lakes lakes_reservoirs

cd ./data/geojson
tippecanoe -zg -Z5 -o rivers-and-lakes.mbtiles --coalesce-densest-as-needed --extend-zooms-if-still-dropping rivers_lakes.json lakes_reservoirs.json --force
tippecanoe -zg -o land-and-oceans.mbtiles --coalesce-densest-as-needed --extend-zooms-if-still-dropping countries.json land.json oceans.json --force
tile-join -o world.mbtiles rivers-and-lakes.mbtiles land-and-oceans.mbtiles  --force
cd ../../

cleanup_data_geojson_json countries
cleanup_data_geojson_json land
cleanup_data_geojson_json oceans
cleanup_data_geojson_json rivers_lakes
cleanup_data_geojson_json lakes_reservoirs
