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
import {Color} from 'ol/color';

const landStyle = new Style({
  fill: new Fill({
    color: [246,204,169,1]
  }),
  // stroke: new Stroke({
  //   color: 'white'
  // })
})

const oceanStyle = new Style({
  fill: new Fill({
    color: [150,180,190,1]
  }),
  // stroke: new Stroke({
  //   color: 'white'
  // })
})

const riverStyle = new Style({
  fill: new Fill({
    color: [150,180,190,1]
  }),
  stroke: new Stroke({
    color: [150,180,190,1]
  })
})

const countryStyle = new Style({
  // fill: new Fill({
  //   color: 'red'
  // }),
  stroke: new Stroke({
    color: 'white',
    width: 1
  }),
  zIndex: 1,

})

export const MapWrapper= () => {

  // set intial state - used to track references to OpenLayers 
  //  objects for use in hooks, event handlers, etc.
  const [ map, setMap ] = useState()
  const [ featuresLayer, setFeaturesLayer ] = useState()
  const [ selectedCoord , setSelectedCoord ] = useState()

  // get ref to div element - OpenLayers will render into this div
  const mapElement = useRef()

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
            if (layerName === 'ocean') {
              return oceanStyle;
            }
            else if (layerName === 'land') {
              
              return landStyle;
            }
            else if (layerName === 'rivers') {
              return riverStyle;
            }
            else if (layerName === 'countries') {
              console.log(feature);
              return countryStyle;
            }

            //console.log(feature)
            return new Style({
              fill: new Fill({
                color: 'red'
              }),
              stroke: new Stroke({
                color: 'white',
                width: 0.5
              }),
              // text: new Text({
              //   text: feature.get('name'),
              //   fill: new Fill({
              //     color: 'white'
              //   }),
              // })
            });
          },
        }),
        new TileLayer({
          source: new XYZ({
            url: '/data/an_gambiae/{z}/{x}/{y}.png',
            maxZoom: 5,
          }),
          opacity: 0.3
        }),
      ],
      view: new View({
        center: transform([20, -5], 'EPSG:4326', 'EPSG:3857'),
        zoom: 4
      })
    });

    // save map and vector layer references to state
    setMap(initialMap);
    console.log('rendering');
    //setFeaturesLayer(initalFeaturesLayer);

    return () => initialMap.setTarget(undefined);
  }, []);

  
  
  return (
    <div ref={mapElement} style={{border: '1px solid black', height:'80vh', width: '95vw'}}></div>
  )

}

const OpenLayersMap = () => {
  useEffect(() => {
    new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: '/data/an_gambiae/{z}/{x}/{y}.png',
            maxZoom: 5,
          }),
          opacity: 0.5
        }),
        new VectorTileLayer({
          source: new VectorTileSource({
            attributions:
              '&copy; OpenStreetMap contributors, Who’s On First, ' +
              'Natural Earth, and osmdata.openstreetmap.de',
            format: new MVT(),
            maxZoom: 5,
            url: '/data/africa/{z}/{x}/{y}.pbf',
          }),
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 5
      })
    });
  }, []);

  return <div>Open Layers Map</div>;
};

export default OpenLayersMap;
