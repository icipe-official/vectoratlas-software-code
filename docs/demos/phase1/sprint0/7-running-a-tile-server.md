# Investigate running our own tile server

## Stories covered

- [7. Investigate what would be needed to run our own tile server](https://github.com/icipe-official/vectoratlas-software-code/issues/7)
- [5. Investigate different map providers for displaying an interactive map](https://github.com/icipe-official/vectoratlas-software-code/issues/5)

## Demo

1. Check out the branch `investigation/map-rendering` to get the code used for experimenting with a tile server.
1. Start the database, api and UI.
1. The [investigation ticket](https://github.com/icipe-official/vectoratlas-software-code/issues/7) details how to run the tile server and generate the tile files needed.
1. Run the tile server with `docker run --rm -it -v $(pwd):/data -p 8080:80 maptiler/tileserver-gl`
1. Show the layers that have been configured with the tile server by going to http://localhost:8080/
1. Show the integration with OpenLayers by going to http://localhost:3000/
1. Demo changing the styling of the map by altering the styles in `src/UI/components/openLayersMap.tsx`

Points to describe:
1. We explored using leaflet.js but it wouldn't render vector layers (needed for the base map)
1. We discussed what the MAP team were using, they're running GeoServer along with OpenLayers. A lot of this is so people can connect against the GIS server directly - we don't need something this heavy weight.
1. tileserver-gl provides a much lighter weight solution and we need to document how to create the files to go with it.

Key feature to point out:
1. Our demo shows a raster layer using Marianne's model output.
1. The base map is all vector data.