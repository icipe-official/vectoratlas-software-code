import React, { useRef, useEffect, useState } from 'react';

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
import { responseToGEOJSON } from './utils/map.utils';
import { getOccurrenceData, getSpeciesList } from '../../state/mapSlice';
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
  const layerVisibility = useAppSelector((state) => state.map.map_overlays);
  const overlaysList = layerVisibility.filter(
    (l: any) => l.sourceLayer !== 'world'
    );
  const seriesArray = useAppSelector((state) => state.map.species_list);

  const dispatch = useAppDispatch();

  const [map, setMap] = useState<Map>();
  const [pointsLayer, setPointsLayer] = useState<VectorLayer<VectorSource>>();

  useEffect(() => {
    dispatch(getOccurrenceData());
    dispatch(getSpeciesList());
  }, [dispatch]);

  const mapElement = useRef();

  const layerStyles = Object.assign(
    {},
    ...mapStyles.layers.map((layer: any) => ({
      [layer.name]: new Style({
        fill: new Fill({
          color: layerVisibility.find((l: any) => l.name === layer.name)
            ?.isVisible
            ? layer.fillColor
            : [0, 0, 0, 0],
        }),
        stroke: layer.strokeColor
          ? new Stroke({
              color: layerVisibility.find((l: any) => l.name === layer.name)
                ?.isVisible
                ? layer.strokeColor
                : [0, 0, 0, 0],
              width: layer.strokeWidth,
            })
          : undefined,
        zIndex: layer.zIndex,
      }),
    }))
  );

  function markStyle(n_all: number, seriesString: string) {
    return new Style({
      image: new Circle({
        radius: 15,
        fill: new Fill({
          color: seriesArray.find((s: any) => s.series === seriesString)
            ?.color ?? [0, 0, 0, 0.7],
        }),
        stroke: new Stroke({
          color: '0',
          width: 1,
        }),
      }),
      zIndex: 1000,
      text: new Text({
        text: n_all !== null ? String(n_all) : '',
        scale: 1.4,
        fill: new Fill({
          color: '#fff',
        }),
        stroke: new Stroke({
          color: '0',
          width: 1,
        }),
      }),
    });
  }

  function buildRasterLayer(layer: any) {
    const layerXYZ = new XYZ({
      url: `/data/${layer.name}/{z}/{x}/{y}.png`,
      maxZoom: 5,
    });
    return new TileLayer({
      preload: Infinity,
      source: layerXYZ,
      opacity: 1.0,
      zIndex: 1,
      visible: layerVisibility.find((l: any) => l.name === layer.name)
        ?.isVisible,
    });
  }
  useEffect(() => {
    const baseMapLayer = new VectorTileLayer({
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

    const initalPointsLayer = new VectorLayer({zIndex: 1000});

    // Passing in layers to generate map with overlays
    const initialMap = new Map({
      target: mapElement?.current ?? undefined,
      layers: [
        baseMapLayer,
        initalPointsLayer,
      ],
      view: new View({
        center: transform([20, -5], 'EPSG:4326', 'EPSG:3857'),
      }),
    });

    // Initialise map
    setMap(initialMap)
    setPointsLayer(initalPointsLayer)
  }, []);

  useEffect( () => {
    if (occurrenceData.length) { // may be null on first render
      // set features to map
      pointsLayer?.setSource(
        new VectorSource({
          features: new GeoJSON().readFeatures(
            responseToGEOJSON(occurrenceData),
            {
              featureProjection: 'EPSG:3857',
            }
          ),
        })
      );
      pointsLayer?.setStyle((feature) => {
        return markStyle(feature.get('n_all'), feature.get('series'));
      });

      // fit map to feature extent (with 100px of padding)
      map?.getView().fit(pointsLayer.getSource().getExtent())
    }
  },[occurrenceData])

  useEffect(() => {
    overlaysList.map((l: any) => map?.addLayer(buildRasterLayer(l)));
    map?.getAllLayers()[0].setStyle((feature: any) => {
      const layerName = feature.get('layer');
      return layerStyles[layerName] ?? defaultStyle;
    });
  }, [map])

  return (
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
      <DrawerMap />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <div
          ref={mapElement}
          style={{ height: 'calc(100vh - 230px)' }}
          data-testid="mapDiv"
        ></div>
      </Box>
    </Box>
  );
};
