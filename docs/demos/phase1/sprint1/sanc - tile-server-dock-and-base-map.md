# React app stories

## Stories covered

- [52. Develop a script to build the base map](https://github.com/icipe-official/vectoratlas-software-code/issues/52)
- [53. Add a tile server to the system](https://github.com/icipe-official/vectoratlas-software-code/issues/53)
- [54. Add a new interactive map using OpenLayers](https://github.com/icipe-official/vectoratlas-software-code/issues/54)

## Demo Setup
1. Check out `feature/add-new-interactive-map-OL-#54`
1. Ensure ./getMapData.sh and ./installTools.sh are present in the TileServer directory.
1. Remove tippecanoe and any data present in the TileServer/data directory.
1. Ensure you have given yourself permissions `chmod +x ./installTools.sh` & `chmod +x ./getMapData.sh`

## Demo
1. Check out `feature/add-new-interactive-map-OL-#54`
1. Describe `52`- require script we can call on to ensure local machine can download geojson data and produce mbtiles for OpenLayers to serve.
1. In a bash terminal, in the TileServer directory, run `sudo ./installTools.sh` to ensure we have the correct packages installed.
1. Highlight that tippecanoe is now present in our directory. This will be used to generate combined mbtiles for geojson data.
1. Now, run `./getMapData.sh`
1. The data required should now be present in data/geojson - Point out that this script does require some cleanup. So, removal of *.json files. And potentially renaming geojson to reflect the presence of mbtiles.

1. In order to serve this data up to OpenLayers, the tile server had to be added to our system. This meant esnuring we had a container to serve these up within our system. Configured so that tile server will be accessible with our mbtile data from 1234/8080

1. Finally, OpenLayers was used to serve this data, and visualise it as part of the system. Our demo during our last sprint review showed this running independently of the Vector Atlas site, but now it is properly integrated just like any other page.
1. Point out the zoom-river toggle. Highlight how the controls will be customised and the ability to filter and access layers/data interactively will be added at a later date. 
