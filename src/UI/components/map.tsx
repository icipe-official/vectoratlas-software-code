import React, { useRef, useEffect } from 'react';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import {transform} from 'ol/proj';
import {Style, Fill, Stroke} from 'ol/style';
import XYZ from 'ol/source/XYZ';

import { useAppSelector } from '../state/hooks';

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
  const mapStyles = useAppSelector(state => state.config.map_styles);

  const layerStyles = Object.assign({}, ...mapStyles.layers.map((layer:any) => ({[layer.name]: new Style({
    fill: new Fill({
      color: layer.fillColor
    }),
    stroke: layer.strokeColor ? new Stroke({ 
      color: layer.strokeColor,
      width: layer.strokeWidth
    }): undefined,
    zIndex: layer.zIndex
  })})));

  const mapElement =useRef(null);

  useEffect(() => {
    const initialMap = new Map({
      target: 'mapDiv',
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
            return layerStyles[layerName] ?? defaultStyle;
          },
        })
        ,
        new TileLayer({
          source: new XYZ({
            url: '/data/an_gambiae/{z}/{x}/{y}.png',
            maxZoom: 5,
          }),
          opacity: 1.0
        })
      ],
      view: new View({
        center: transform([20, -5], 'EPSG:4326', 'EPSG:3857'),
        zoom: 4
      })
    });

    return () => initialMap.setTarget(undefined);
  }, [layerStyles]);
  return (
    <div id='mapDiv' ref={mapElement} style={{height:'90vh', width: '99.3vw'}}></div>
  );

};
