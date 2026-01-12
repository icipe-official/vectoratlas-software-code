// pointutilswebgl.ts
import WebGLPointsLayer from 'ol/layer/WebGLPoints';
import { Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import Feature from 'ol/Feature';
import OlMap from 'ol/Map';
import { Point } from 'ol/geom';
import { speciesStyle } from './types';
import { responseToGEOJSON } from '../utils/map.utils';

/**
 * Convert CSS hex/rgb/rgba to numeric vec4 [r,g,b,a] in 0–1 range
 */
export const cssColorToVec4 = (
  color: string
): [number, number, number, number] => {
  let r = 0,
    g = 0,
    b = 0,
    a = 1;

  if (!color) return [0, 0.5, 0.2, 1];
  color = color.trim();

  if (color.startsWith('#')) {
    const hex = color.slice(1);
    if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    } else if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    }
  } else {
    const m = color.match(/[\d.]+/g);
    if (m && m.length >= 3) {
      r = Number(m[0]);
      g = Number(m[1]);
      b = Number(m[2]);
      if (m.length >= 4) a = Number(m[3]);
    }
  }

  return [r / 255, g / 255, b / 255, a];
};

export const getSpeciesStyles = (speciesList: string[]): speciesStyle[] => {
  const colors = [
    '#44bc52',
    '#df4075',
    '#6fe746',
    '#df344e',
    '#63e4a8',
    '#e94b25',
    '#a6ea87',
    '#902441',
    '#bee844',
    '#390f1a',
    '#dfd840',
    '#5c2623',
    '#7bb131',
    '#c13a2c',
    '#499f6f',
    '#cd5c68',
    '#83b265',
    '#7f281f',
    '#b7ddb7',
    '#42291e',
    '#dadb89',
    '#312d1a',
    '#dfaa36',
    '#263b1f',
    '#db7e2c',
    '#335e32',
    '#dc8395',
    '#4e7929',
    '#e48067',
    '#a8a33b',
    '#8e5552',
    '#e1c4a7',
    '#a55324',
    '#8c9b77',
    '#774b26',
    '#d29e64',
    '#57521f',
    '#b48b84',
    '#8d7631',
    '#6d6c52',
  ];

  return speciesList.map((species, idx) => ({
    species,
    color: colors[idx % colors.length],
    defaultStyle: null as any, // Not used in WebGL version
    selectedStyle: null as any, // Not used in WebGL version
  }));
};

/**
 * Build WebGLPoints layer
 */
export const buildPointLayerWebGL = (
  occurrenceData: any[],
  speciesStyles: speciesStyle[] = [],
  idProperty = 'id'
) => {
  occurrenceData.forEach((o) => delete o.color);

  const features = new GeoJSON().readFeatures(
    responseToGEOJSON(occurrenceData),
    {
      featureProjection: 'EPSG:3857',
    }
  ) as Feature<Point>[];

  const speciesColorMap = new Map<string, [number, number, number, number]>();
  speciesStyles.forEach((s) => {
    speciesColorMap.set(s.species, cssColorToVec4(s.color));
  });

  features.forEach((f) => {
    const species = String(f.get('species') ?? '');
    const [r, g, b, a] =
      speciesColorMap.get(species) ?? cssColorToVec4('#038543');

    f.set('r', r);
    f.set('g', g);
    f.set('b', b);
    f.set('a', a);

    f.set('baseSize', 9);
    f.set('selected', 0);

    if (!f.get(idProperty) && f.getId()) {
      f.set(idProperty, f.getId());
    }
  });

  const source = new VectorSource<Point>({ features });

  const layer = new WebGLPointsLayer<VectorSource<Point>>({
    source,
    style: {
      symbol: {
        symbolType: 'circle',
        size: [
          'case',
          ['==', ['get', 'selected'], 1],
          ['*', ['get', 'baseSize'], 1.8],
          ['get', 'baseSize'],
        ],
        color: [
          'array',
          ['get', 'r'],
          ['get', 'g'],
          ['get', 'b'],
          ['get', 'a'],
        ],
        opacity: 0.95,
      },
    },
  });

  layer.set('occurrence-data', true);
  return layer;
};

/**
 * Update selection attributes for WebGLPoints
 */
export const updateSelectionAttributesWebGL = (
  source: VectorSource<Point>,
  selectedIds: string[],
  idProperty = 'id'
) => {
  if (!source) return;

  const idSet = new Set(selectedIds.map(String));

  source.getFeatures().forEach((f) => {
    const fid = String(f.get(idProperty) ?? f.getId() ?? '');
    f.set('selected', idSet.has(fid) ? 1 : 0);
  });

  source.changed();
};

/**
 * Append new WebGL-occurrence points safely
 */
export const updateOccurrencePoints = (
  map: OlMap | null,
  occurrenceData: any[],
  speciesStyles: speciesStyle[] = [],
  processedPoints: any[] = [],
  lastProcessedPointIndex = 0,
  idProperty = 'id'
): any[] => {
  if (!map) return processedPoints;

  const pointLayer = map
    .getLayers()
    .getArray()
    .find((l) => l.get && l.get('occurrence-data')) as
    | WebGLPointsLayer<VectorSource<Point>>
    | undefined;

  if (!pointLayer) return processedPoints;

  const source = pointLayer.getSource();
  if (!source) return processedPoints;

  const rawSlice = occurrenceData.slice(lastProcessedPointIndex);
  if (!rawSlice || rawSlice.length === 0) return processedPoints;

  rawSlice.forEach((o) => delete o.color);

  const newFeatures = new GeoJSON().readFeatures(responseToGEOJSON(rawSlice), {
    featureProjection: 'EPSG:3857',
  }) as Feature<Point>[];

  const speciesColorMap = new Map<string, [number, number, number, number]>();
  speciesStyles.forEach((s) =>
    speciesColorMap.set(s.species, cssColorToVec4(s.color))
  );

  newFeatures.forEach((f) => {
    const species = String(f.get('species') ?? '');
    const [r, g, b, a] =
      speciesColorMap.get(species) ?? cssColorToVec4('#038543');

    f.set('r', r);
    f.set('g', g);
    f.set('b', b);
    f.set('a', a);

    f.set('baseSize', 6);
    f.set('selected', 0);

    if (!f.get(idProperty) && f.getId()) {
      f.set(idProperty, f.getId());
    }

    source.addFeature(f);
  });

  const newIds = newFeatures
    .map((f) => String(f.get(idProperty) ?? f.getId() ?? ''))
    .filter((id) => id !== '');

  return processedPoints.concat(newIds);
};

/**
 * Update species legend
 */
export const updateLegendForSpeciesWebGL = (
  speciesList: string[],
  styles: speciesStyle[],
  selectedIds: string[] = [],
  map: OlMap | null
) => {
  if (!map) return;

  const existing = document.getElementById('species-legend');
  if (existing && existing.parentNode)
    existing.parentNode.removeChild(existing);

  if (!speciesList || speciesList.length === 0) return;

  const legend = document.createElement('div');
  legend.id = 'species-legend';
  legend.style.position = 'absolute';
  legend.style.bottom = '80px';
  legend.style.right = '0.5em';
  legend.style.border = '2px solid black';
  legend.style.padding = '5px';
  legend.style.lineHeight = '0.5';
  legend.style.maxHeight = '30%';
  legend.style.overflowY = 'auto';
  legend.style.zIndex = '999';
  legend.setAttribute('role', 'region');
  legend.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'; // white background, 80% opacity

  const title = document.createElement('div');
  title.innerText = 'Species';
  title.style.fontWeight = '700';
  title.style.marginBottom = '6px';
  legend.appendChild(title);

  speciesList.forEach((species) => {
    const styleObj = styles.find((s) => s.species === species);
    const color = styleObj?.color ?? '#038543';

    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.marginBottom = '6px';

    const swatch = document.createElement('span');
    swatch.style.width = '14px';
    swatch.style.height = '14px';
    swatch.style.display = 'inline-block';
    swatch.style.marginRight = '8px';
    swatch.style.borderRadius = '50%';
    swatch.style.background = color;
    swatch.style.border = '1px solid rgba(0,0,0,0.2)';

    const label = document.createElement('span');
    label.innerText = species;
    label.style.fontStyle = 'italic';
    label.style.fontWeight = '600';

    row.appendChild(swatch);
    row.appendChild(label);
    legend.appendChild(row);
  });

  const viewport = map.getViewport();
  viewport.style.position = viewport.style.position || 'relative';
  viewport.appendChild(legend);
};
