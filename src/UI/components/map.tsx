import React, { useState, useRef, useEffect } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import XYZ from 'ol/source/XYZ';
import MVT from 'ol/format/MVT';
import {transform} from 'ol/proj';
import {Style, Fill, Stroke, setStyle} from 'ol/style';
import { useSelector } from 'react-redux';

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

const countryStyle = new Style({
  stroke: new Stroke({
    color: 'white',
    width: 1
  }),
  zIndex: 1,

});

const defaultStyle = new Style({
  fill: new Fill({
    color: [0,0,0,0]
  }),
  stroke: new Stroke({
    color: 'white',
    width: 0.5
  })
});

export const MapWrapper= () => {
  // set intial state - used to track references to OpenLayers 
  //  objects for use in hooks, event handlers, etc.
  const [ map, setMap ] = useState();
  const [ featuresLayer, setFeaturesLayer ] = useState();
  const [ selectedCoord , setSelectedCoord ] = useState();
  const mapStyles = useSelector(state => state.config.map_styles);

  const layerStyles = Object.assign({}, ...mapStyles.layers.map((layer:any) => ({[layer.name]: new Style({
    fill: new Fill({
      color: layer.fillColor
    }),
    stroke: new Stroke({
      color: layer.strokeColor,
      width: layer.strokeWidth
    }),
    zIndex: layer.zIndex
  })})));

  // get ref to div element - OpenLayers will render into this div
  const mapElement = useRef();



  useEffect(() => {
    const map = new Map({
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
          style: (feature) => {            
            const layerName = feature.get('layer');
            console.log(layerStyles);
            return layerStyles[layerName] ?? defaultStyle;
          },
        })
        ,
          
      ],
      view: new View({
        center: transform([20, -5], 'EPSG:4326', 'EPSG:3857'),
        zoom: 4
      })
    });

    // save map and vector layer references to state
    setMap(map);
    //setFeaturesLayer(initalFeaturesLayer)

    map.on('pointermove', function(e){
      console.log(e);
    });


    return () => map.setTarget('map');
  }, []);
  return (
    <div id='map' style={{height:'90vh', width: '99.3vw'}}></div>
  );

};
