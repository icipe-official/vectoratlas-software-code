import React, { useRef, useEffect } from 'react';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import { transform } from 'ol/proj';
import { Icon,Style , Fill, Stroke } from 'ol/style';
import XYZ from 'ol/source/XYZ';
import GeoJSON from 'ol/format/GeoJSON';
import Overlay from 'ol/Overlay';
import Text from 'ol/style/Text';

import 'ol/ol.css';

import { useAppSelector } from '../../state/hooks';

import { pixelHoverInteraction, getPixelColorData, responseToGEOJSON } from './map.utils';

const defaultStyle = new Style({
  fill: new Fill({
    color: [0,0,0,0]
  }),
  stroke: new Stroke({
    color: 'white',
    width: 0.5
  })
});

var pointStyle = new Style({
  // text: new Text({
  //   font: '15px Calibri,sans-serif',
  //   fill: new Fill({ color: '#000' }),
  //   stroke: new Stroke({
  //     color: '#fff', width: 5
  //   }),
  //   offsetY: 18,
  // }),
  // fill: new Fill({
  //   color: [0,0,0,0],
  // }),
  // stroke: new Stroke({
  //   color: 'black'
  // }),
  image: new Icon({
    anchor: [0.5, 46],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: '../../public/Animals-Mosquito-icon.png',
  }),
});

export const MapWrapper= () => {
  const mapStyles = useAppSelector(state => state.map.map_styles);
  // const siteLocations = useAppSelector(state => state.map.site_locations);

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

    const dummyQueryResponse = {
      data: {
        allGeoData:[
          {
            longitude: 26,
            latitude: 23,
            value: 3
          },
          {
            longitude: 28,
            latitude: 20,
            value: 6
          },{
            longitude: 22.4,
            latitude:  18,
            value: 9
          }
        ]
      }
    };

    const an_gambiaeXYZ = new XYZ({
      url: '/data/overlays/{z}/{x}/{y}.png',
      maxZoom: 5,
    });

    // Generating Layers for Map
    const an_gambiae = new TileLayer({
      source: an_gambiaeXYZ,
      opacity: 1.0,
    });

    const pointLayer = new VectorLayer({
      source: new VectorSource({
        features: new GeoJSON().readFeatures(responseToGEOJSON(dummyQueryResponse), {featureProjection: 'EPSG:3857'}),
      }),
      style: (feature) => {
        pointStyle.getText().setText(String(feature.get('arbData')));
        return pointStyle;
      }
    });
    
    const baseMap = new VectorTileLayer({
      source: new VectorTileSource({
        attributions:
          'Made with Natural Earth. cc Vector Atlas',
        format: new MVT(),
        maxZoom: 5,
        url: '/data/world/{z}/{x}/{y}.pbf'
      }),
      style: (feature) => {
        const layerName = feature.get('layer');
        return layerStyles[layerName] ?? defaultStyle;
      },
    });

    // Passing in layers to generate map with overlays 
    const initialMap = new Map({
      target: 'mapDiv',
      layers: [ baseMap , an_gambiae , pointLayer ],
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
    

    // Vector Layer: Point
    const overlayContainerElement:any = document.getElementById('overlay-container');
    const overlayLayer = new Overlay({
      element: overlayContainerElement
    });
    initialMap.addOverlay(overlayLayer);
    const overlayArbData:any = document.getElementById('overlay-arbData');
    initialMap.on('pointermove', function(e){
      initialMap.forEachFeatureAtPixel(e.pixel, function(feature:any, layer:any){
        let clickedCoordinate = e.coordinate;
        const info2:any = document.getElementById('info2');
        if (layer === pointLayer){
          let arbData = feature.get('arbData');
          overlayLayer.setPosition(clickedCoordinate);
          console.log(arbData);
          info2.innerHTML = arbData;
        }
      });
    });

    // Initialise map
    return () => initialMap.setTarget(undefined);
  }, [layerStyles]);

  // Return fragment with map and information children 
  return (
    <>
      <div id='mapDiv' ref={mapElement} style={{height:'90vh', width: '99.3vw'}} data-testid='mapDiv'>
      </div>
      <div className='overlay-container' id='overlay-container'>
        <span className='overlay-text' id='overlay-arbData'></span>
      </div>
      <div style={{'display':'flex', 'justifyContent':'space-around'}}>
        <label data-testid='opacityScroll'>
          Layer opacity &nbsp;
          <input id='opacity-input'  className='slider' type='range' min='0' max='1' step='0.01' data-testid='opacity-input'/>
          <span id='opacity-output'  className='sliderDial' data-testid='opacity-output'></span>
        </label>
        <label style={{'display':'flex'}}>
          <div data-testid ='layerInteractionTitle'>Layer Interaction based on RGBA: &nbsp; </div><span id='info1' data-testid='info1'></span>
        </label>
        <label style={{'display':'flex'}}>
          <div data-testid ='layerInteractionTitle'>Point Interaction: &nbsp; </div><span id='info2' data-testid='info2'></span>
        </label>
      </div>
    </>
  );
};
