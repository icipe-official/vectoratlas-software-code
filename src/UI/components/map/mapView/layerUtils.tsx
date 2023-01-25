import { Style, Fill, Stroke } from 'ol/style';
import Raster from 'ol/source/Raster';
import XYZ from 'ol/source/XYZ';
import ImageLayer from 'ol/layer/Image';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import Map from 'ol/Map';
import { MapOverlay, MapStyles } from '../../../state/state.types';


export const defaultStyle = new Style({
  fill: new Fill({
    color: [0, 0, 0, 0],
  }),
  stroke: new Stroke({
    color: 'white',
    width: 0.5,
  }),
});

const buildLayerStyles = (
  mapStyles: MapStyles,
  layerVisibility: MapOverlay[]
) => {
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

  return layerStyles;
};

const buildNewRasterLayer = (
  layerName: string,
  layerStyles: { [index: string]: Style },
  layerVisibility: { name: string; isVisible: boolean }[]
) => {
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
};

export const updateBaseMapStyles = (
  mapStyles: MapStyles,
  layerVisibility: MapOverlay[],
  map: Map | null
) => {
  const layerStyles = buildLayerStyles(mapStyles, layerVisibility);

  const allLayers = map?.getAllLayers();
  allLayers?.forEach((l) => {
    const matchingLayer = layerVisibility.find((v) => v.name === l.get('name'));
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
};

export const updateOverlayLayers = (
  mapStyles: MapStyles,
  layerVisibility: MapOverlay[],
  map: Map | null
) => {
  const layerStyles = buildLayerStyles(mapStyles, layerVisibility);
  const visibleLayers = layerVisibility
    .filter((l) => l.isVisible && l.sourceLayer !== 'world')
    .map((l) => l.name);

  const overlayMapLayers = map
    ?.getAllLayers()
    .filter((l) => l.get('overlay-map'));

  const currentLayers = overlayMapLayers?.map((l) => l.get('name') as string);

  // remove deleted layers
  overlayMapLayers?.forEach((l) => {
    const layerName = l.get('name');
    if (!visibleLayers.includes(layerName)) {
      map?.removeLayer(l);
    }
  });

  // update style of layers that have changed
  const numLayers = map?.getAllLayers().length;
  map
    ?.getAllLayers()
    .filter((l) => l.get('overlay-map'))
    .forEach((l) => {
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
            numLayers ? numLayers - 2 : 0,
            buildNewRasterLayer(layerName, layerStyles, layerVisibility)
          );
      }
    });

  // add new layers
  const newLayers = visibleLayers
    .filter((l) => !currentLayers?.includes(l))
    .map((l) => {
      return buildNewRasterLayer(l, layerStyles, layerVisibility);
    });

  const allLayers = map?.getAllLayers();
  newLayers.forEach((l) => {
    map?.getLayers().insertAt(allLayers ? allLayers.length - 1 : 0, l);
  });
};

export const buildBaseMapLayer = () => {
  
  const baseMapLayer = new VectorTileLayer({
    preload: Infinity,
    source: new VectorTileSource({
      attributions:
        '<div style="max-width:300px"><img style="max-height:200px;margin:3px;" height="30" src="vector-atlas-logo.png"></img><div>Made using Natural Earth</div></div>',
      attributionsCollapsible: false,
      
      format: new MVT(),
      maxZoom: 5,
      url: '/data/world/{z}/{x}/{y}.pbf',
    }),
    style: () => {
      return defaultStyle;
    },
  });
  baseMapLayer.set('base-map', true);

  return baseMapLayer;
};
