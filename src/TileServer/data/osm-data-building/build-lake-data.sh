npm ci

node_modules/.bin/query-overpass query.ql > lakes.geojson
node_modules/.bin/query-overpass query2.ql > lakes2.geojson
node_modules/.bin/query-overpass query3.ql > lakes3.geojson

node process-geojson.js

tippecanoe -z5 -o lakes.mbtiles -l lakes --extend-zooms-if-still-dropping allLakes.geojson --force

