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
import { Circle, Style, Fill, Stroke } from 'ol/style';
import XYZ from 'ol/source/XYZ';
import GeoJSON from 'ol/format/GeoJSON';
import Text from 'ol/style/Text';
import 'ol/ol.css';

import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { responseToGEOJSON } from './map.utils';
import { getOccurrenceData, getSpeciesList } from '../../state/mapSlice';
import DrawerMap from './layers/drawerMap';

import { speciesColorMapRGB } from './utils/speciesColorMapper';

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
  const speciesObject = useAppSelector((state) => state.map.species_list);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getOccurrenceData());
    dispatch(getSpeciesList());
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
    function markStyle(n_all: number, species: string) {
      return new Style({
        image: new Circle({
          radius: 15,
          fill: new Fill({
            color: speciesColorMapRGB(speciesObject, species).color,
          }),
        }),
        text: new Text({
          text: n_all !== null ? String(n_all) : '',
          scale: 1.0,
          fill: new Fill({
            color: '#fff',
          }),
          stroke: new Stroke({
            color: '0',
            width: 2,
          }),
        }),
      });
    }

    const selectStyle = new Style({
      fill: new Fill({
        color: '#eeeeee',
      }),
      stroke: new Stroke({
        color: 'rgba(255, 255, 255, 0.7)',
        width: 2,
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
        return markStyle(feature.get('n_all'), feature.get('species'));
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

    let selected: any = null;
    initialMap.on('click', function (e) {
      initialMap.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
        console.log(feature.values_);
      });
    });

    // Initialise map
    return () => initialMap.setTarget(undefined);
  }, [layerStyles, occurrenceData, speciesObject]);

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
