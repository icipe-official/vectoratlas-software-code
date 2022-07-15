# Map Library

## Status
In progress

## Context
The main feature of the Vector Atlas webpage will be an interactive map of Africa, allowing users to interact visually with the spatial data. The choice of the map library and underlying tile server are key to the success of the project. This ADR discusses the choice of library.
Features required:
 - Zoom and pan functionality
 - Pre-defined focus area (to allow users to view only specific countries/areas)
 - Plotting custom data points
 - Plotting polygons
 - Plotting multiple layers, allowing users to control opacity
 - Overlay custom components
 - Responsive & quick to load
Features desired:
 - Image download
 - Simple to develop against
 - Free to use
 - Mobile-friendly

### Options
#### [Leaflet.js](https://leafletjs.com/)
Leaflet is a widely-used javascript map library.

Pros:
 - Well supported
 - Lots of plugins for basemaps, and lots of other things
 - React wrapper
 - Free - BSD-2-Clause license


#### [OpenLayers](https://openlayers.org/)
OpenLayers is the library used by [Malaria Atlas Project](https://malariaatlas.org/).

Pros:
 - Lots of functionality
 - Well supported
 - Free - BSD-2-Clause license
 - Used by MAP

Cons:
 - No react wrapper - would have to use our own
 - MAP site is not responsive enough

#### [Google Maps](https://developers.google.com/maps)
Google Maps platform

Pros:
 - Users already familiar with controls
 - Extensively supported
 - React wrapper
 - Lots of features

Cons:
 - Associated cost

## Decision


## Consequences