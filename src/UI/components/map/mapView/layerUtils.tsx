import { Style, Fill, Stroke } from 'ol/style';
import Raster from 'ol/source/Raster';
import XYZ from 'ol/source/XYZ';
import ImageLayer from 'ol/layer/Image';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import Map from 'ol/Map';
import { MapOverlay, MapStyles } from '../../../state/state.types';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import { ServerType } from 'ol/source/wms';

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
  layerVisibility: { name: string; isVisible: boolean }[],
  colourMap: number[][]
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

      const numColours = data.colourMap.length;
      const index = Math.floor((pixel[0] * (numColours - 1)) / 256);

      const fill2 = data.colourMap[index];
      const fill3 = data.colourMap[index + 1];

      const step = 256 / (numColours - 1);
      const lower = index * step;

      return [
        Math.floor(
          (fill3[0] * (pixel[0] - lower) +
            (step - (pixel[0] - lower)) * fill2[0]) /
            step
        ),
        Math.floor(
          (fill3[1] * (pixel[0] - lower) +
            (step - (pixel[0] - lower)) * fill2[1]) /
            step
        ),
        Math.floor(
          (fill3[2] * (pixel[0] - lower) +
            (step - (pixel[0] - lower)) * fill2[2]) /
            step
        ),
        Math.floor(fill2[3] * pixel[3]),
      ];
    },
  });

  const layerColor = layerStyles[layerName]
    ? layerStyles[layerName].getFill().getColor()
    : [0, 0, 0, 1];
  rasterLayer.on('beforeoperations', function (event) {
    const data = event.data;
    data['fillColor'] = layerColor;
    data['colourMap'] = colourMap;
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

const buildWMSLayer = (layerInfo: MapOverlay) => {
  const wmsLayer = new TileLayer({
    source: new TileWMS({
      url: layerInfo.url,
      params: JSON.parse(layerInfo.params as string),
      serverType: layerInfo.serverType as ServerType,
    }),
  });
  wmsLayer.set('name', layerInfo.name);

  return wmsLayer;
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

const defaultColorMap = [
  [2, 138, 208, 1],
  [245, 253, 157, 1],
  [255, 0, 0, 1],
];

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
            numLayers ? numLayers - 3 : 0,
            buildNewRasterLayer(
              layerName,
              layerStyles,
              layerVisibility,
              defaultColorMap
            )
          );
      }
    });

  // add new layers
  const newLayers = visibleLayers
    .filter((l) => !currentLayers?.includes(l))
    .map((l) => {
      const matchingLayer = layerVisibility.find(
        (layer: MapOverlay) => l === layer.name
      );
      return matchingLayer?.sourceType === 'external-wms'
        ? buildWMSLayer(matchingLayer)
        : buildNewRasterLayer(l, layerStyles, layerVisibility, defaultColorMap);
    });

  const allLayers = map?.getAllLayers();
  newLayers.forEach((l) => {
    map?.getLayers().insertAt(allLayers ? allLayers.length - 2 : 0, l);
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

export const maxMinUnitsScaleValues = (
  scaleName: { overlayName: string },
  styles: MapStyles
) => {
  const style = styles.scales.find(
    (style: any) => style.name === scaleName.overlayName
  );
  const unit = style?.unit === 'percentage' ? '%' : '';
  return style === undefined
    ? { min: 0, max: 100, unit: '%' }
    : { min: style.min, max: style.max, unit: unit };
};

export const linearGradientColorMap = (
  scaleName: { overlayName: string },
  styles: MapStyles
) => {
  const style = styles.scales.find(
    (style: any) => style.name === scaleName.overlayName
  );
  const colorMap = style === undefined ? defaultColorMap : style.colorMap;
  const rgbOrRgba = colorMap[0].length === 4 ? 'rgba' : 'rgb';
  const separateGradientString = colorMap
    .map((color) => `${rgbOrRgba}(${color})`)
    .reverse()
    .toString();
  return `linear-gradient(${separateGradientString})`;
};
