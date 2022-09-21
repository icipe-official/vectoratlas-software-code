import React, { useRef, useEffect } from 'react';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import { transform } from 'ol/proj';
import { Style, Fill, Stroke } from 'ol/style';
import XYZ from 'ol/source/XYZ';

import 'ol/ol.css';

import { useAppSelector } from '../../state/hooks';

import { pixelHoverInteraction, getPixelColorData } from './map.utils';

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
  const mapStyles = useAppSelector(state => state.map.map_styles);

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

    const an_gambiaeXYZ = new XYZ({
      url: '/data/overlays/{z}/{x}/{y}.png',
      maxZoom: 5,
    });

    // Generating Layers for Map
    const an_gambiae = new TileLayer({
      source: an_gambiaeXYZ,
      opacity: 1.0,
    });

   
    
    const baseMap = new VectorTileLayer({
      source: new VectorTileSource({
        attributions:
          'Made with Natural Earth. cc Vector Atlas',
        format: new MVT(),
        maxZoom: 5,
        url: '/data/world/{z}/{x}/{y}.pbf',
        
        
      }),
      style: (feature) => {
        const layerName = feature.get('layer');
        return layerStyles[layerName] ?? defaultStyle;
        
      },
    });

    // Passing in layers to generate map with overlays 
    const initialMap = new Map({
      target: 'mapDiv',
      layers: [ baseMap , an_gambiae ],
      view: new View({
        center: transform([20, -5], 'EPSG:4326', 'EPSG:3857'),
        zoom: 4
      })
    });

    // Opacity Control Functionality:  
    const opacityInput:any = document.getElementById('opacity-input');
    const opacityOutput:any = document.getElementById('opacity-output');
    function update() {
      const opacity = parseFloat(opacityInput.value);
      an_gambiae.setOpacity(opacity);
      opacityOutput.innerText = opacity.toFixed(2);
    }
    opacityInput.addEventListener('input', update);
    update();

    // Layer Hover Information based on rgba values
    const info1:any = document.getElementById('info1');
    initialMap.on('pointermove', e => pixelHoverInteraction(e, an_gambiae, getPixelColorData, info1));

    // Initialise map
    return () => initialMap.setTarget(undefined);
  }, [layerStyles]);

  // Return fragment with map and information children 
  return (
    <>
      <div id='mapDiv' ref={mapElement} style={{height:'90vh', width: '99.3vw'}} data-testid='mapDiv'></div>
      <div style={{'display':'flex', 'justifyContent':'space-around'}}>
        <label data-testid='opacityScroll'>
          Layer opacity &nbsp;
          <input id='opacity-input'  className='slider' type='range' min='0' max='1' step='0.01' data-testid='opacity-input'/>
          <span id='opacity-output'  className='sliderDial' data-testid='opacity-output'></span>
        </label>
        <label style={{'display':'flex'}}>
          <div data-testid ='layerInteractionTitle'>Layer Interaction based on RGBA: &nbsp; </div><span id='info1' data-testid='info1'></span>
        </label>
      </div>
    </>
  );
};
