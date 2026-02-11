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

/* ------------------------------------------------------------------ */
/* Constants */
/* ------------------------------------------------------------------ */

export const DEFAULT_COLOR_MAP: number[][] = [
  [60, 150, 180, 0.1],
  [60, 150, 180, 0.15],
  [60, 150, 180, 0.24],
  [60, 150, 180, 1],
  [40, 100, 160, 1],
  [30, 60, 120, 1], // deep blue (high intensity)
];

export const defaultStyle = new Style({
  fill: new Fill({
    color: [0, 0, 0, 0],
  }),
  stroke: new Stroke({
    color: 'white',
    width: 0.5,
  }),
});

/* ------------------------------------------------------------------ */
/* Style builders */
/* ------------------------------------------------------------------ */

const buildLayerStyles = (
  mapStyles: MapStyles,
  layerVisibility: MapOverlay[]
) => {
  return Object.assign(
    {},
    ...mapStyles.layers.map((layer: any) => ({
      [layer.name]: new Style({
        fill: new Fill({
          color: layerVisibility.find((l) => l.name === layer.name)?.isVisible
            ? layer.fillColor
            : [0, 0, 0, 0],
        }),
        stroke: layer.strokeColor
          ? new Stroke({
              color: layerVisibility.find((l) => l.name === layer.name)
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
};

/* ------------------------------------------------------------------ */
/* Raster layer */
/* ------------------------------------------------------------------ */

const buildNewRasterLayer = (
  layerName: string,
  layerStyles: { [index: string]: Style },
  layerVisibility: { name: string; isVisible: boolean }[],
  colourMap: number[][] = DEFAULT_COLOR_MAP
) => {
  const layerXYZ = new XYZ({
    url: `/data/${layerName}/{z}/{x}/{y}.png`,
    maxZoom: 5,
  });

  const rasterSource = new Raster({
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
    ? layerStyles[layerName].getFill()?.getColor()
    : [0, 0, 0, 1];

  rasterSource.on('beforeoperations', (event) => {
    event.data['colourMap'] = colourMap;
    event.data['fillColor'] = layerColor;
  });

  const imageLayer = new ImageLayer({
    source: rasterSource,
    visible: layerVisibility.find((l) => l.name === layerName)?.isVisible,
  });

  imageLayer.set('name', layerName);
  imageLayer.set('overlay-map', true);
  imageLayer.set('overlay-color', layerColor);

  return imageLayer;
};

/* ------------------------------------------------------------------ */
/* WMS layer */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* Base map updates */
/* ------------------------------------------------------------------ */

export const updateBaseMapStyles = (
  mapStyles: MapStyles,
  layerVisibility: MapOverlay[],
  map: Map | null
) => {
  const layerStyles = buildLayerStyles(mapStyles, layerVisibility);

  map?.getAllLayers().forEach((l) => {
    const matching = layerVisibility.find((v) => v.name === l.get('name'));
    if (matching) {
      l.setVisible(matching.isVisible);
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

/* ------------------------------------------------------------------ */
/* Overlay updates */
/* ------------------------------------------------------------------ */

export const updateOverlayLayers = (
  mapStyles: MapStyles,
  layerVisibility: MapOverlay[],
  map: Map | null
) => {
  const layerStyles = buildLayerStyles(mapStyles, layerVisibility);

  const visibleLayers = layerVisibility
    .filter((l) => l.isVisible && l.sourceLayer !== 'world')
    .map((l) => l.name);

  const overlayLayers = map?.getAllLayers().filter((l) => l.get('overlay-map'));

  const currentLayerNames = overlayLayers?.map((l) => l.get('name') as string);

  // Remove hidden layers
  overlayLayers?.forEach((l) => {
    if (!visibleLayers.includes(l.get('name'))) {
      map?.removeLayer(l);
    }
  });

  // Update layers whose color changed
  const numLayers = map?.getAllLayers().length ?? 0;

  overlayLayers?.forEach((l) => {
    const layerName = l.get('name');
    const oldColor = l.get('overlay-color');

    const newColor = layerStyles[layerName]
      ? layerStyles[layerName].getFill()?.getColor()
      : [0, 0, 0, 1];

    if (
      Array.isArray(oldColor) &&
      newColor?.some((c: number, i: number) => c !== oldColor[i])
    ) {
      map?.removeLayer(l);
      map
        ?.getLayers()
        .insertAt(
          numLayers ? numLayers - 3 : 0,
          buildNewRasterLayer(layerName, layerStyles, layerVisibility)
        );
    }
  });

  // Add new layers
  const newLayers = visibleLayers
    .filter((name) => !currentLayerNames?.includes(name))
    .map((name) => {
      const layerInfo = layerVisibility.find((l) => l.name === name);
      return layerInfo?.sourceType === 'external-wms'
        ? buildWMSLayer(layerInfo)
        : buildNewRasterLayer(name, layerStyles, layerVisibility);
    });

  const allLayers = map?.getAllLayers();

  newLayers.forEach((l) => {
    const insertIndex =
      allLayers && allLayers.length > 2 ? allLayers.length - 2 : 1;

    map?.getLayers().insertAt(insertIndex, l);
  });
};

/* ------------------------------------------------------------------ */
/* Base map layer */
/* ------------------------------------------------------------------ */

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
    style: () => defaultStyle,
  });

  baseMapLayer.set('base-map', true);
  return baseMapLayer;
};

/* ------------------------------------------------------------------ */
/* Scale helpers */
/* ------------------------------------------------------------------ */

export const maxMinUnitsScaleValues = (
  scaleName: { overlayName: string },
  styles: MapStyles
) => {
  const style = styles.scales.find(
    (s: any) => s.name === scaleName.overlayName
  );

  const unit = style?.unit === 'percentage' ? '%' : '';
  return style
    ? { min: style.min, max: style.max, unit }
    : { min: 0, max: 100, unit: '%' };
};

export const linearGradientColorMap = (
  scaleName: { overlayName: string },
  styles: MapStyles
) => {
  const style = styles.scales.find(
    (s: any) => s.name === scaleName.overlayName
  );

  const colorMap = style?.colorMap ?? DEFAULT_COLOR_MAP;
  const rgbType = colorMap[0].length === 4 ? 'rgba' : 'rgb';

  return `linear-gradient(${colorMap
    .map((c) => `${rgbType}(${c})`)
    .reverse()
    .toString()})`;
};
