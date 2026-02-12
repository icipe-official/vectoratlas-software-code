import WebGLPointsLayer from 'ol/layer/WebGLPoints';
import { Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import Feature from 'ol/Feature';
import OlMap from 'ol/Map';
import { Point } from 'ol/geom';
import { speciesStyle } from './types';
import { responseToGEOJSON } from '../utils/map.utils';

/**
 * --------------------------------
 * Convert CSS color → vec4 (0–1)
 * --------------------------------
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
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
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

/**
 * --------------------------------
 * Species → Color mapping ONLY
 * --------------------------------
 */
const SPECIES_COLOR_MAP: Record<string, string> = {
  arabiensis: '#0072B2',
  'coluzzii_gambiae_m form': '#D55E00',
  coustani: '#009E73',
  'coustani complex': '#66A61E',

  funestus: '#E69F00',
  'funestus complex': '#FDBF6F',

  'gambiae complex': '#1F78B4',
  'gambiae_s form': '#CC79A7',
  'gambiae_s form_m form': '#56B4E9',

  hybrid_coluzzii_melas: '#8B008B',
  'hybrid_funestus_rivulorum-like': '#7570B3',
  hybrid_gambiae_melas: '#E7298A',

  leesoni: '#A6761D',

  marshallii: '#999999',
  'marshallii complex': '#B2DF8A',

  melas: '#E31A1C',
  merus: '#FB9A99',

  moucheti: '#A6CEE3',
  multicolor: '#CAB2D6',

  nili: '#F0A3FF',
  'nili complex': '#BC80BD',

  ovengensis: '#B15928',
  paludis: '#33A02C',
  parensis: '#6A3D9A',
  pharoensis: '#FFFF99',

  rivulorum: '#1B9E77',
  'rivulorum complex': '#B3DE69',

  sergentii: '#FF7F00',
  stephensi: '#D73027',
  theileri: '#80B1D3',
  vaneedeni: '#8DD3C7',
  wellcomei: '#FCCDE5',
  ziemanni: '#BCBD22',
};

const GENERIC_GREEN = '#038543';

/**
 * -----------------------------
 * Species styles (unchanged behaviour)
 * -----------------------------
 */
export const getSpeciesStyles = (speciesList: string[]): speciesStyle[] => {
  return speciesList.map((species) => {
    const normalized = species.toLowerCase().trim();
    const color = SPECIES_COLOR_MAP[normalized] ?? GENERIC_GREEN;

    return {
      species,
      color,
      defaultStyle: null as any,
      selectedStyle: null as any,
    };
  });
};

/**
 * -----------------------------
 * Build WebGL point layer
 * -----------------------------
 */
export const buildPointLayerWebGL = (
  occurrenceData: any[],
  speciesStyles: speciesStyle[] = [],
  idProperty = 'id'
) => {
  occurrenceData.forEach((o) => delete o.color);

  const features = new GeoJSON().readFeatures(
    responseToGEOJSON(occurrenceData),
    { featureProjection: 'EPSG:3857' }
  ) as Feature<Point>[];

  features.forEach((f) => {
    const normalized = String(f.get('species') ?? '')
      .toLowerCase()
      .trim();

    const color = SPECIES_COLOR_MAP[normalized] ?? GENERIC_GREEN;

    const [r, g, b, a] = cssColorToVec4(color);

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

  const layer = new WebGLPointsLayer({
    source,
    style: {
      symbol: {
        symbolType: 'circle',
        size: ['get', 'baseSize'],
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
 * -----------------------------
 * Append new points safely
 * -----------------------------
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

  const layer = map
    .getLayers()
    .getArray()
    .find((l) => l.get('occurrence-data')) as
    | WebGLPointsLayer<VectorSource<Point>>
    | undefined;

  if (!layer) return processedPoints;

  const source = layer.getSource();
  if (!source) return processedPoints;

  const slice = occurrenceData.slice(lastProcessedPointIndex);
  if (!slice.length) return processedPoints;

  const newFeatures = new GeoJSON().readFeatures(responseToGEOJSON(slice), {
    featureProjection: 'EPSG:3857',
  }) as Feature<Point>[];

  newFeatures.forEach((f) => {
    const normalized = String(f.get('species') ?? '')
      .toLowerCase()
      .trim();

    const color = SPECIES_COLOR_MAP[normalized] ?? GENERIC_GREEN;

    const [r, g, b, a] = cssColorToVec4(color);

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

  return processedPoints.concat(
    newFeatures
      .map((f) => String(f.get(idProperty) ?? f.getId() ?? ''))
      .filter(Boolean)
  );
};
