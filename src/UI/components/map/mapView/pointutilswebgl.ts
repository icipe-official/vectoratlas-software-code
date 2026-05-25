import WebGLPointsLayer from 'ol/layer/WebGLPoints';
import { Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import Feature from 'ol/Feature';
import OlMap from 'ol/Map';
import { Point } from 'ol/geom';
import { speciesStyle } from './types';
//import { responseToGEOJSON } from '../utils/map.utils';
import { createFeaturesFromData } from '../utils/map.utils';

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

/**
 * Predefined color mapping for specific species
 */
const SPECIES_COLOR_MAP: Record<string, string> = {
  arabiensis: '#252676',
  'coluzzii_gambiae_m form': '#badadd',
  funestus: '#47a2f7',
  'gambiae_s form': '#521986',
  'gambiae_s form_m form': '#065668',
  melas: '#f6568b',
  merus: '#34350e',
  moucheti: '#dc58ea',
  nili: '#88698d',
  coustani: '#8a1341',
  'coustani complex': '#29081a',
  'funestus complex': '#7f20ac',
  'gambiae complex': '#e3d769',
  hybrid_coluzzii_melas: '#513886',
  'hybrid_funestus_rivulorum-like': '#fea53b',
  hybrid_gambiae_melas: '#074d65',
  leesoni: '#f8a0b1',
  marshallii: '#3eeaef',
  'marshallii complex': '#ed0f26',
  multicolor: '#0d032f',
  'nili complex': '#a93705',
  ovengensis: '#83b0d8',
  paludis: '#76480d',
  parensis: '#ae79e0',
  pharoensis: '#7220f6',
  rivulorum: '#e0ae95',
  'rivulorum complex': '#643176',
  sergentii: '#e96b22',
  stephensi: '#90089c',
  theileri: '#d6bcf5',
  vaneedeni: '#84241a',
  wellcomei: '#e586fe',
  ziemanni: '#5d4030',
};

export const GENERIC_GREEN = '#038543';

const getPresenceStatus = (
  value: unknown
): 'presence' | 'absence' | 'unknown' => {
  const v = String(value ?? '')
    .toLowerCase()
    .trim();

  if (v === '1' || v === 'true' || v === 'presence' || v === 'present') {
    return 'presence';
  }

  if (v === '0' || v === 'false' || v === 'absence' || v === 'absent') {
    return 'absence';
  }

  return 'unknown';
};

const getFeatureColor = (
  species: string,
  speciesColorMap: Map<string, [number, number, number, number]>
): [number, number, number, number] => {
  const normalizedSpecies = species.toLowerCase().trim();

  if (speciesColorMap.has(species)) {
    return speciesColorMap.get(species)!;
  }

  const color = SPECIES_COLOR_MAP[normalizedSpecies] ?? GENERIC_GREEN;
  return cssColorToVec4(color);
};

export const setCommonFeatureAttrs = (
  f: Feature<Point>,
  speciesColorMap: Map<string, [number, number, number, number]>,
  idProperty = 'id',
  baseSize = 9
) => {
  const species = String(f.get('species') ?? '');
  const binaryPresence = f.get('binary_presence');
  const presenceStatus = getPresenceStatus(binaryPresence);
  const [r, g, b, a] = getFeatureColor(species, speciesColorMap);

  f.set('r', r);
  f.set('g', g);
  f.set('b', b);
  f.set('a', a);
  f.set('baseSize', baseSize);
  f.set('selected', 0);
  f.set('highlight', 0);
  f.set('presenceStatus', presenceStatus);
  f.set('isPresence', presenceStatus === 'presence' ? 1 : 0);
  f.set('isAbsence', presenceStatus === 'absence' ? 1 : 0);
  f.set('zBoost', 0);
  f.set('gpuVisible', 1);
  f.set('country', String(f.get('country') || '').toLowerCase());
  f.set('year', f.get('year_start'));

  // USE DIRECT GRAPHQL VALUES
  f.set('is_adult', f.get('is_adult') ? 1 : 0);
  f.set('is_larval', f.get('is_larval') ? 1 : 0);
  f.set('season_val', f.get('season_val') || '');
  f.set('insecticide', f.get('insecticide') || '');
  f.set('control', f.get('control') || '');

  // OPTIONAL
  const bionomics = f.get('bionomics');

  f.set('has_bionomics', bionomics ? 1 : 0);

  f.set('season_val', bionomics?.season_calc || bionomics?.season_given || '');

  if (!f.get(idProperty) && f.getId()) {
    f.set(idProperty, f.getId());
  }
};

export const getSpeciesStyles = (speciesList: string[]): speciesStyle[] => {
  return speciesList.map((species) => {
    const normalizedSpecies = species.toLowerCase().trim();
    const color = SPECIES_COLOR_MAP[normalizedSpecies] ?? GENERIC_GREEN;

    return {
      species,
      color,
      defaultStyle: null as any,
      selectedStyle: null as any,
    };
  });
};

/**
 * Build presence-only WebGLPoints layer (circles)
 */
export const buildPointLayerWebGL = (
  occurrenceData: any[],
  speciesStyles: speciesStyle[] = [],
  idProperty = 'id'
) => {
  occurrenceData.forEach((o) => delete o.color);

  // const allFeatures = new GeoJSON().readFeatures(
  //   responseToGEOJSON(occurrenceData),
  //   {
  //     featureProjection: 'EPSG:3857',
  //   }
  // ) as Feature<Point>[];

  const allFeatures = createFeaturesFromData(occurrenceData);

  const speciesColorMap = new Map<string, [number, number, number, number]>();
  speciesStyles.forEach((s) => {
    speciesColorMap.set(s.species, cssColorToVec4(s.color));
  });

  const presenceFeatures: Feature<Point>[] = [];

  allFeatures.forEach((f) => {
    setCommonFeatureAttrs(f, speciesColorMap, idProperty, 9);

    const presenceStatus = f.get('presenceStatus');
    if (presenceStatus === 'absence') return;

    f.set('baseSize', 9);
    presenceFeatures.push(f);
  });

  const source = new VectorSource<Point>({ features: presenceFeatures });

  const layer = new WebGLPointsLayer<VectorSource<Point>>({
    source,
    ...({} as any),
    style: {
      symbol: {
        symbolType: 'circle',
        size: [
          '*',
          [
            'case',
            ['==', ['get', 'highlight'], 1],
            ['*', ['get', 'baseSize'], 1.2],
            ['get', 'baseSize'], // fallback
          ],
          ['get', 'gpuVisible'],
        ],
        color: [
          'array',
          [
            'case',
            ['==', ['get', 'highlight'], 1],
            ['*', ['get', 'r'], 1.1],
            ['get', 'r'],
          ],
          [
            'case',
            ['==', ['get', 'highlight'], 1],
            ['*', ['get', 'g'], 1.1],
            ['get', 'g'],
          ],
          [
            'case',
            ['==', ['get', 'highlight'], 1],
            ['*', ['get', 'b'], 1.1],
            ['get', 'b'],
          ],
          ['get', 'a'],
        ],
        opacity: [
          '*', // MULTIPLY BY
          [
            'case',
            ['==', ['get', 'highlight'], 1],
            0.95,
            ['==', ['get', 'highlight'], -1],
            0.18,
            0.95,
          ],
          ['get', 'gpuVisible'],
        ],
      },
    },
  });

  layer.set('occurrence-data', true);
  layer.set('occurrence-data-presence', true);
  return layer;
};

/**
 * Build absence-only WebGLPoints layer (triangles)
 */
export const buildAbsenceLayerWebGL = (
  occurrenceData: any[],
  speciesStyles: speciesStyle[] = [],
  idProperty = 'id'
) => {
  occurrenceData.forEach((o) => delete o.color);

  // const allFeatures = new GeoJSON().readFeatures(
  //   responseToGEOJSON(occurrenceData),
  //   {
  //     featureProjection: 'EPSG:3857',
  //   }
  // ) as Feature<Point>[];

  const allFeatures = createFeaturesFromData(occurrenceData);

  const speciesColorMap = new Map<string, [number, number, number, number]>();
  speciesStyles.forEach((s) => {
    speciesColorMap.set(s.species, cssColorToVec4(s.color));
  });

  const absenceFeatures: Feature<Point>[] = [];

  allFeatures.forEach((f) => {
    setCommonFeatureAttrs(f, speciesColorMap, idProperty, 16);

    if (f.get('presenceStatus') === 'absence') {
      f.set('baseSize', 16);
      absenceFeatures.push(f);
    }
  });

  const source = new VectorSource<Point>({ features: absenceFeatures });

  const layer = new WebGLPointsLayer<VectorSource<Point>>({
    source,
    ...({} as any),
    style: {
      symbol: {
        symbolType: 'triangle',
        size: [
          '*',
          [
            'case',
            ['==', ['get', 'highlight'], 1],
            ['*', ['get', 'baseSize'], 1.2],
            ['get', 'baseSize'], // fallback
          ],
          ['get', 'gpuVisible'],
        ],
        color: [
          'array',
          [
            'case',
            ['==', ['get', 'highlight'], 1],
            ['*', ['get', 'r'], 1.1],
            ['get', 'r'],
          ],
          [
            'case',
            ['==', ['get', 'highlight'], 1],
            ['*', ['get', 'g'], 1.1],
            ['get', 'g'],
          ],
          [
            'case',
            ['==', ['get', 'highlight'], 1],
            ['*', ['get', 'b'], 1.1],
            ['get', 'b'],
          ],
          ['get', 'a'],
        ],
        opacity: [
          '*', // MULTIPLY BY
          [
            'case',
            ['==', ['get', 'highlight'], 1],
            0.95,
            ['==', ['get', 'highlight'], -1],
            0.18,
            0.95,
          ],
          ['get', 'gpuVisible'],
        ],
      },
    },
  });

  layer.set('occurrence-data', true);
  layer.set('occurrence-data-absence', true);
  return layer;
};

/**
 * Update selection attributes for presence/absence layers
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
 * Append new occurrence points safely to both layers:
 * - presence -> WebGLPointsLayer
 * - absence  -> WebGLPointsLayer
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

  const presenceLayer = map
    .getLayers()
    .getArray()
    .find((l) => l.get && l.get('occurrence-data-presence')) as
    | WebGLPointsLayer<VectorSource<Point>>
    | undefined;

  const absenceLayer = map
    .getLayers()
    .getArray()
    .find((l) => l.get && l.get('occurrence-data-absence')) as
    | WebGLPointsLayer<VectorSource<Point>>
    | undefined;

  const presenceSource = presenceLayer?.getSource();
  const absenceSource = absenceLayer?.getSource();

  if (!presenceSource && !absenceSource) return processedPoints;

  const rawSlice = occurrenceData.slice(lastProcessedPointIndex);
  if (!rawSlice || rawSlice.length === 0) return processedPoints;

  rawSlice.forEach((o) => delete o.color);

  // const newFeatures = new GeoJSON().readFeatures(responseToGEOJSON(rawSlice), {
  //   featureProjection: 'EPSG:3857',
  // }) as Feature<Point>[];

  const newFeatures = createFeaturesFromData(occurrenceData);

  const speciesColorMap = new Map<string, [number, number, number, number]>();
  speciesStyles.forEach((s) =>
    speciesColorMap.set(s.species, cssColorToVec4(s.color))
  );

  newFeatures.forEach((f) => {
    setCommonFeatureAttrs(f, speciesColorMap, idProperty, 6);

    if (f.get('presenceStatus') === 'absence') {
      f.set('baseSize', 8);
      absenceSource?.addFeature(f);
    } else {
      f.set('baseSize', 6);
      presenceSource?.addFeature(f);
    }
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
  legend.style.backgroundColor = 'rgba(255, 255, 255, 1)';

  const title = document.createElement('div');
  title.innerText = 'Species';
  title.style.fontWeight = '700';
  title.style.marginBottom = '6px';
  legend.appendChild(title);

  speciesList.forEach((species) => {
    const styleObj = styles.find(
      (s) => s.species.toLowerCase().trim() === species.toLowerCase().trim()
    );
    const normalizedSpecies = species.toLowerCase().trim();
    const color =
      styleObj?.color ?? SPECIES_COLOR_MAP[normalizedSpecies] ?? GENERIC_GREEN;

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
    label.innerText = `An. ${species}`;
    label.style.fontStyle = 'italic';
    label.style.fontWeight = '600';

    row.appendChild(swatch);
    row.appendChild(label);
    legend.appendChild(row);
  });

  const separator = document.createElement('div');
  separator.style.marginTop = '10px';
  separator.style.marginBottom = '6px';
  separator.style.borderTop = '1px solid rgba(0,0,0,0.2)';
  legend.appendChild(separator);

  const absenceRow = document.createElement('div');
  absenceRow.style.display = 'flex';
  absenceRow.style.alignItems = 'center';
  absenceRow.style.marginBottom = '6px';

  const absenceSwatch = document.createElement('span');
  absenceSwatch.style.width = '0';
  absenceSwatch.style.height = '0';
  absenceSwatch.style.display = 'inline-block';
  absenceSwatch.style.marginRight = '8px';
  absenceSwatch.style.borderLeft = '7px solid transparent';
  absenceSwatch.style.borderRight = '7px solid transparent';
  absenceSwatch.style.borderBottom = `14px solid ${GENERIC_GREEN}`;

  const absenceLabel = document.createElement('span');
  absenceLabel.innerText = 'Sampled, not detected';
  absenceLabel.style.fontWeight = '600';

  absenceRow.appendChild(absenceSwatch);
  absenceRow.appendChild(absenceLabel);
  legend.appendChild(absenceRow);

  const viewport = map.getViewport();
  viewport.style.position = viewport.style.position || 'relative';
  viewport.appendChild(legend);
};
