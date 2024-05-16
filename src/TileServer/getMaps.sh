#!/bin/bash

# Ensure directories exist
mkdir -p data
mkdir -p data/geojson
mkdir -p data/overlays

# Function to unzip files
unzip_files () {
    unzip -o "data/maps/$1.zip" -d "data/maps"
}

# Function to convert shapefile to GeoJSON
convert_to_geojson () {
    ogr2ogr -f GeoJSON "data/geojson/$2.json" "data/maps/$1.shp"
}

# Process Natural Earth data
process_natural_earth_data () {
    unzip_files "$1"
    convert_to_geojson "$1" "$2"
}

# Clean up GeoJSON files
cleanup_geojson () {
    rm -f "data/geojson/$1.json"
}

# Process Cultural Data
process_natural_earth_data ne_10m_admin_0_countries countries

# Process Physical Data
process_natural_earth_data ne_10m_land land
process_natural_earth_data ne_10m_ocean oceans
process_natural_earth_data ne_10m_rivers_lake_centerlines rivers_lakes

# Copy lakes data
cp "data/maps/lakes.mbtiles" "data/geojson/lakes.mbtiles"

# Run tile-join and tippecanoe
cd data/geojson
tippecanoe -zg -o world-without-lakes.mbtiles --extend-zooms-if-still-dropping countries.json land.json oceans.json rivers_lakes.json --force
tile-join -o world.mbtiles world-without-lakes.mbtiles lakes.mbtiles --force
cd ../..

# Clean up GeoJSON files
cleanup_geojson countries
cleanup_geojson land
cleanup_geojson oceans
cleanup_geojson rivers_lakes
