import React, { useRef, useEffect } from 'react';

import Box from '@mui/material/Box';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';

import MVT from 'ol/format/MVT';
import { transform } from 'ol/proj';
import { Icon, Style, Fill, Stroke } from 'ol/style';
import XYZ from 'ol/source/XYZ';
import GeoJSON from 'ol/format/GeoJSON';
import Text from 'ol/style/Text';

import 'ol/ol.css';

import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { responseToGEOJSON } from './map.utils';
import { getOccurrenceData } from '../../state/mapSlice';
import DrawerMap from './layers/drawerMap';

const defaultStyle = new Style({
  fill: new Fill({
    color: [0, 0, 0, 0],
  }),
  stroke: new Stroke({
    color: 'white',
    width: 0.5,
  }),
});

export const MapWrapper = () => {
  const mapStyles = useAppSelector((state) => state.map.map_styles);
  const occurrenceData = useAppSelector((state) => state.map.occurrence_data);
  const an_gambiaeVis = useAppSelector(
    (state) =>
      state.map.map_overlays.find((l: any) => l.name === 'an_gambiae')
        ?.isVisible
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getOccurrenceData());
  }, [dispatch]);

  const layerStyles = Object.assign(
    {},
    ...mapStyles.layers.map((layer: any) => ({
      [layer.name]: new Style({
        fill: new Fill({
          color: layer.fillColor,
        }),
        stroke: layer.strokeColor
          ? new Stroke({
              color: layer.strokeColor,
              width: layer.strokeWidth,
            })
          : undefined,
        zIndex: layer.zIndex,
      }),
    }))
  );

  const mapElement = useRef(null);

  useEffect(() => {
    const markStyle = new Style({
      image: new Icon({
        scale: 0.4,
        crossOrigin: 'anonymous',
        src: 'icons/marker.png',
      }),
      text: new Text({
        text: 'Test text',
        scale: 1.2,
        fill: new Fill({
          color: '#fff',
        }),
        offsetY: -5,
        stroke: new Stroke({
          color: '0',
          width: 3,
        }),
      }),
    });

    const an_gambiaeXYZ = new XYZ({
      url: '/data/overlays/{z}/{x}/{y}.png',
      maxZoom: 5,
    });

    // Generating Layers for Map
    const an_gambiae = new TileLayer({
      preload: Infinity,
      source: an_gambiaeXYZ,
      opacity: 1.0,
      visible: an_gambiaeVis,
    });

    const pointLayer = new VectorLayer({
      source: new VectorSource({
        features: new GeoJSON().readFeatures(
          responseToGEOJSON(occurrenceData),
          {
            featureProjection: 'EPSG:3857',
          }
        ),
      }),
      style: (feature) => {
        markStyle.getText().setText(String(feature.get('n_all')));
        return markStyle;
      },
    });

    const baseMap = new VectorTileLayer({
      preload: Infinity,
      source: new VectorTileSource({
        attributions: 'Made with Natural Earth. cc Vector Atlas',
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
      layers: [baseMap, an_gambiae, pointLayer],
      view: new View({
        center: transform([20, -5], 'EPSG:4326', 'EPSG:3857'),
        zoom: 4,
      }),
    });

    // Initialise map
    return () => initialMap.setTarget(undefined);
  }, [layerStyles, occurrenceData]);

  return (
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
      <DrawerMap />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <div
          id="mapDiv"
          ref={mapElement}
          style={{ height: 'calc(100vh - 230px)' }}
          data-testid="mapDiv"
        ></div>
      </Box>
    </Box>
  );
};
