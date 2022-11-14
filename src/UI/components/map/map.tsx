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
  const mapOverlays = useAppSelector((state) => state.map.map_overlays);

  const overlaysList = mapOverlays.filter(
    (l: any) => l.sourceLayer !== 'world'
  );

  const seriesArray = useAppSelector((state) => state.map.species_list);

  const dispatch = useAppDispatch();

  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    console.log('getting data');
    dispatch(getOccurrenceData());
    dispatch(getSpeciesList());
  }, [dispatch]);

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

  const mapElement = useRef(null);

  useEffect(() => {
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
      const tileLayer = new TileLayer({
        preload: Infinity,
        source: layerXYZ,
        opacity: 1.0,
        visible: layerVisibility.find((l: any) => l.name === layer.name)
          ?.isVisible,
      });
      tileLayer.set('name', layer.name);

      return tileLayer;
    }

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
        return markStyle(feature.get('n_all'), feature.get('series'));
      },
    });
    pointLayer.set('occurrence-data', true);

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
    baseMapLayer.set('base-map', true);

    // Passing in layers to generate map with overlays
    const initialMap = new Map({
      target: 'mapDiv',
      layers: [
        baseMapLayer,
        ...overlaysList.map((l: any) => buildRasterLayer(l)),
        pointLayer,
      ],
      view: new View({
        center: transform([20, -5], 'EPSG:4326', 'EPSG:3857'),
        zoom: 4,
      }),
    });


    setMap(initialMap);

    // Initialise map
    return () => initialMap.setTarget(undefined);
  }, [mapStyles, seriesArray]);

  useEffect(() => {
    const pointsLayer = map
      ?.getAllLayers()
      .find((l) => l.get('occurrence-data'));

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
  }, [map, occurrenceData]);

  useEffect(() => {
    const allLayers = map?.getAllLayers();
    allLayers?.forEach((l) => {
      const matchingLayer = layerVisibility.find(
        (v) => v.name === l.get('name')
      );
      if (matchingLayer) {
        l.setVisible(matchingLayer.isVisible);
      }
    });

    const baseMapLayer = map
      ?.getAllLayers()
      .find((l) => l.get('base-map')) as VectorTileLayer;
    baseMapLayer?.setStyle((feature) => {
      const layerName = feature.get('layer');
      return layerStyles[layerName] ?? defaultStyle;
    });
  }, [map, layerVisibility, mapStyles]);

  useEffect(() => {
    document.getElementById('export-png')?.addEventListener('click', function () {
      map?.once('rendercomplete', function () {
        const mapCanvas = document.createElement('canvas');
        const size = map.getSize();
        if (!size || size.length < 2) {
          return;
        }
        mapCanvas.width = size[0];
        mapCanvas.height = size[1];
        const mapContext = mapCanvas.getContext('2d');
        if (!mapContext) {
          return;
        }
        Array.prototype.forEach.call(
          map.getViewport().querySelectorAll('.ol-layer canvas, canvas.ol-layer'),
          function (canvas) {
            if (canvas.width > 0) {
              const opacity =
                canvas.parentNode.style.opacity || canvas.style.opacity;
              mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
              let matrix;
              const transform = canvas.style.transform;

              if (transform) {
                matrix = transform
                  .match(/^matrix\(([^\(]*)\)$/)[1]
                  .split(',')
                  .map(Number);
              } else {
                matrix = [
                  parseFloat(canvas.style.width) / canvas.width,
                  0,
                  0,
                  parseFloat(canvas.style.height) / canvas.height,
                  0,
                  0,
                ];
              }
              CanvasRenderingContext2D.prototype.setTransform.apply(
                mapContext,
                matrix
              );
              const backgroundColor = canvas.parentNode.style.backgroundColor;
              if (backgroundColor) {
                mapContext.fillStyle = backgroundColor;
                mapContext.fillRect(0, 0, canvas.width, canvas.height);
              }

              mapContext.drawImage(canvas, 0, 0);
            }
          }
        );
        mapContext.globalAlpha = 1;
        mapContext.setTransform(1, 0, 0, 1, 0, 0);
        const link = document.getElementById(
          'image-download'
        ) as HTMLAnchorElement | null;

        if (link != null) {
          link.href = mapCanvas.toDataURL();
          link.click();
        }
      });

        if(map?.getRenderer()){
          map?.renderSync();
        }


    });
  }, [map])


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
