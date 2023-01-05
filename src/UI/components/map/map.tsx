import React, { useRef, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import Raster from 'ol/source/Raster';
import VectorSource from 'ol/source/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import { transform } from 'ol/proj';
import { Circle, Style, Fill, Stroke } from 'ol/style';
import XYZ from 'ol/source/XYZ';
import GeoJSON from 'ol/format/GeoJSON';
import 'ol/ol.css';
import ImageLayer from 'ol/layer/Image';

import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { responseToGEOJSON, sleep } from './utils/map.utils';
import { setSelectedIds } from '../../state/map/mapSlice';
import DrawerMap from './layers/drawerMap';
import DataDrawer from './layers/dataDrawer';
import { getOccurrenceData } from '../../state/map/actions/getOccurrenceData';
import { getFullOccurrenceData } from '../../state/map/actions/getFullOccurrenceData';
import Control from 'ol/control/Control';
import { toPng } from 'html-to-image';

const defaultStyle = new Style({
  fill: new Fill({
    color: [0, 0, 0, 0],
  }),
  stroke: new Stroke({
    color: 'white',
    width: 0.5,
  }),
});

function buildNewRasterLayer(
  layerName: string,
  layerStyles: { [index: string]: Style },
  layerVisibility: { name: string; isVisible: boolean }[]
) {
  const layerXYZ = new XYZ({
    url: `/data/${layerName}/{z}/{x}/{y}.png`,
    maxZoom: 5,
  });

  const rasterLayer = new Raster({
    sources: [layerXYZ],
    threads: 4,
    operation: (pixels, data) => {
      const pixel = pixels[0] as number[];

      return [
        (data.fillColor[0] * pixel[0]) / 255,
        (data.fillColor[1] * pixel[1]) / 255,
        (data.fillColor[2] * pixel[2]) / 255,
        data.fillColor[3] * pixel[3],
      ];
    },
  });

  const layerColor = layerStyles[layerName]
    ? layerStyles[layerName].getFill().getColor()
    : [0, 0, 0, 1];
  rasterLayer.on('beforeoperations', function (event) {
    const data = event.data;
    data['fillColor'] = layerColor;
  });

  const imageLayer = new ImageLayer({
    source: rasterLayer,
    visible: layerVisibility.find((l: any) => l.name === layerName)?.isVisible,
  });
  imageLayer.set('name', layerName);
  imageLayer.set('overlay-map', true);
  imageLayer.set('overlay-color', layerColor);

  return imageLayer;
}

export const MapWrapper = () => {
  const mapStyles = useAppSelector((state) => state.map.map_styles);
  const filters = useAppSelector((state) => state.map.filters);
  const download = useAppSelector((state) => state.map.map_drawer.download);
  const occurrenceData = useAppSelector((state) => state.map.occurrence_data);
  const layerVisibility = useAppSelector((state) => state.map.map_overlays);
  const mapOverlays = useAppSelector((state) => state.map.map_overlays);
  const drawerOpen = useAppSelector((state) => state.map.map_drawer.open);
  const selectedIds = useAppSelector((state) => state.map.selectedIds);
  const overlaysList = mapOverlays.filter(
    (l: any) => l.sourceLayer !== 'world'
  );

  const dispatch = useAppDispatch();

  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    let sleepTime: number = 200;
    for (let i = 0; i < 1000; i += sleepTime) {
      sleep(sleepTime).then(() => map?.updateSize());
    }
  }, [drawerOpen, map, selectedIds]);

  useEffect(() => {
    dispatch(getOccurrenceData(filters));
  }, [dispatch, filters]);

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
    const pointLayer = new VectorLayer({
      source: new VectorSource({
        features: new GeoJSON().readFeatures(
          responseToGEOJSON(occurrenceData),
          {
            featureProjection: 'EPSG:3857',
          }
        ),
      }),
      style: () => {
        return new Style({
          image: new Circle({
            radius: 7,
            fill: new Fill({
              color: '#038543',
            }),
          }),
        });
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
        ...overlaysList.map((l: any) =>
          buildNewRasterLayer(l.name, layerStyles, layerVisibility)
        ),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapStyles]);

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

    // need to completely rebuild overlays when they change color as we can't seem
    // to update the existing operation with the new color. It might be possible if
    // we could retain the event handler function handle but it's easier to completely
    // rebuild the layer in the right position.
    const overlayMapLayers = map
      ?.getAllLayers()
      .filter((l) => l.get('overlay-map'));

    overlayMapLayers?.forEach((l) => {
      const layerName = l.get('name');
      const oldColor = l.get('overlay-color');
      const newColor = layerStyles[layerName]
        ? layerStyles[layerName].getFill().getColor()
        : [0, 0, 0, 1];
      if (newColor.some((c: number, i: number) => c !== oldColor[i])) {
        map?.removeLayer(l);
        map
          ?.getLayers()
          .insertAt(
            allLayers ? allLayers.length - 2 : 0,
            buildNewRasterLayer(layerName, layerStyles, layerVisibility)
          );
      }
    });

    map?.on('singleclick', function (evt) {
      const idArray: string[] = [];
      map?.forEachFeatureAtPixel(evt.pixel, function (feat, layer) {
        if (layer.get('occurrence-data')) {
          idArray.push(feat.get('id'));
        }
      });
      dispatch(setSelectedIds(idArray));
      dispatch(getFullOccurrenceData());
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, layerVisibility, mapStyles]);

  useEffect(() => {
    document
      .getElementById('export-png-draw')
      ?.addEventListener('click', function () {
        map?.once('rendercomplete', function () {/*
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
            map
              .getViewport()
              .querySelectorAll('.ol-layer canvas, canvas.ol-layer'),
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
          } */
          toPng(map?.getTargetElement()).then(function(dataURL) {
            const link = document.getElementById(
              'image-download'
            ) as HTMLAnchorElement | null;

            if (link != null) {
              link.href = dataURL;
              link.click();
            }
          })
        });

        if (map?.getRenderer()) {
          map?.renderSync();
        }
      });
  }, [map, download]);

  var element = document.createElement('div');
  element.className = 'ol-control-panel ol-unselectable ol-control';
  element.innerHTML="<b>Test legend</b>&nbsp;"
  var controlPanel = new Control({
    element: element
  });
  map?.addControl(controlPanel)
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
      {selectedIds.length !== 0 && <DataDrawer />}
    </Box>
  );
};
