import React, { useState, useRef, useEffect } from 'react';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import XYZ from 'ol/source/XYZ';
import MVT from 'ol/format/MVT';
import {transform} from 'ol/proj';
import {Style, Fill, Stroke, Text} from 'ol/style';

const landStyle = new Style({
  fill: new Fill({
    color: [0,0,0,1]
  })
});

const oceanStyle = new Style({
  fill: new Fill({
    color: [50,50,50,1]
  })
});

const riverStyle = new Style({
  stroke: new Stroke({
    color: [52, 235, 216,1]
  }),
});

const lakeStyle = new Style({
  fill: new Fill({
    color: [52, 235, 216,1]
  })
});

const Kenya = new Style({
  fill: new Fill({
    color: [52, 235, 70,1]
  })
});

const countryStyle = new Style({
  stroke: new Stroke({
    color: 'white',
    width: 1
  }),
  zIndex: 1,

});

export const MapWrapper= () => {
  // set intial state - used to track references to OpenLayers 
  //  objects for use in hooks, event handlers, etc.
  const [ map, setMap ] = useState();
  const [ featuresLayer, setFeaturesLayer ] = useState();
  const [ selectedCoord , setSelectedCoord ] = useState();

  // get ref to div element - OpenLayers will render into this div
  const mapElement = useRef();

  useEffect(() => {
    const initialMap = new Map({
      target: mapElement.current,
      layers: [
        new VectorTileLayer({
          source: new VectorTileSource({
            attributions:
              '&copy; OpenStreetMap contributors, Who’s On First, ' +
              'Natural Earth, and osmdata.openstreetmap.de',
            format: new MVT(),
            maxZoom: 5,
            url: '/data/world/{z}/{x}/{y}.pbf',
          }),
          style: (feature, resolution) => {            
            const layerName = feature.get('layer');
            if (layerName === 'oceans') {
              return oceanStyle;
            }
            else if (layerName === 'land') {
              
              return landStyle;
            }
            else if (layerName === 'lakes_reservoirs') {
              return lakeStyle;
            }
            else if (layerName === 'rivers_lakes') {
              return riverStyle;
            }
            else if (layerName === 'countries') {
              return countryStyle;
            }
            const countryName = feature.get('name');
            if (countryName === 'Kenya'){
              console.log('Kenya')
            }
            return new Style({
              fill: new Fill({
                color: 'red'
              }),
              stroke: new Stroke({
                color: 'white',
                width: 0.5
              }),
              text: new Text({
                text: feature.get('name'),
                fill: new Fill({
                  color: 'white'
                }),
              })
            })
          },
        })
      ],
      view: new View({
        center: transform([20, -5], 'EPSG:4326', 'EPSG:3857'),
        zoom: 4
      })
    });

    // save map and vector layer references to state
    setMap(initialMap);
    //setFeaturesLayer(initalFeaturesLayer)

    return () => initialMap.setTarget(undefined);
  }, []);

  return (
    <div ref={mapElement} style={{border: '1px solid black', height:'80vh', width: '95vw'}}></div>
  );

};
