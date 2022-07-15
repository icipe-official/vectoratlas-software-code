# Tile server

## Status
In progress

## Context
The main feature of the Vector Atlas webpage will be an interactive map of Africa, allowing users to interact visually with the spatial data. The choice of the map library and underlying tile server are key to the success of the project. This ADR discusses the choice of tile server.

### Options
#### [GeoNode](geonode.org)
GeoNode is a geospatial content management system, a platform for the management and publication of geospatial data. This is a Django application, so would have to be hosted separately to the javascript UI.
Cost - Free

#### [ESRI ArcGIS](https://developers.arcgis.com/documentation/mapping-apis-and-services/maps/services/basemap-layer-service/)
Includes terrain and topographic tiles.
Cost - Free up to 2 million tiles (which will be hard to reach - 100 users with terrain tiles for Africa = 20000)

#### [OpenStreetMap](https://www.openstreetmap.org/about)
Cost - Free

#### Google
We would use this if we were using Google Maps as our map library (see [map_library](./map_library.md))
Cost - ?

#### Custom
We could host our own tile server, and just display the GeoJSON for the country outlines as this is all the map data we will need. This would be more work.

## Decision

## Consequences