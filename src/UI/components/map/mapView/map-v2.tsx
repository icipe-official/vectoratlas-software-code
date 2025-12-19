// MapWrapperV3.tsx - Using existing pointutilswebgl.ts
import React, { useEffect, useRef, useState } from 'react';
import OlMap from 'ol/Map';
import View from 'ol/View';
import { transform } from 'ol/proj';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import WebGLPointsLayer from 'ol/layer/WebGLPoints';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import GeoJSON from 'ol/format/GeoJSON';
import 'ol/ol.css';

import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';

import {
  setSelectedIds,
  showLayerVisible,
  updateProcessedPoints,
  filterHandler,
} from '../../../state/map/mapSlice';

import { getOccurrenceData } from '../../../state/map/actions/getOccurrenceData';
import { getFullOccurrenceData } from '../../../state/map/actions/getFullOccurrenceData';

import {
  buildBaseMapLayer,
  updateBaseMapStyles,
  updateOverlayLayers,
} from './layerUtils';

import {
  buildPointLayerWebGL,
  cssColorToVec4,
  getSpeciesStyles,
  updateSelectionAttributesWebGL,
  updateLegendForSpeciesWebGL,
} from './pointutilswebgl';

import { speciesStyle } from './types';
import { responseToGEOJSON } from '../utils/map.utils';

import DrawerMap from '../layers/drawerMap';
import DataDrawer from '../layers/dataDrawer';
import ScaleLegend from './scaleLegend';

type MapWrapperV3Props = {
  doiResolverId?: string;
};

const MapWrapperV3: React.FC<MapWrapperV3Props> = ({ doiResolverId }) => {
  const dispatch = useAppDispatch();
  const t = useTranslations('MapPage');

  /* ---------------- Redux selectors ---------------- */
  const occurrenceData = useAppSelector((s) => s.map.occurrence_data);
  const filters = useAppSelector((s) => s.map.filters);
  const drawerOpen = useAppSelector((s) => s.map.map_drawer.open);
  const selectedIds = useAppSelector((s) => s.map.selectedIds);
  const mapStyles = useAppSelector((s) => s.map.map_styles);
  const mapOverlays = useAppSelector((s) => s.map.map_overlays);
  const fullSpeciesList = useAppSelector((s) => s.map.filterValues.species);
  const areaModeOn = useAppSelector((s) => s.map.areaSelectModeOn);
  const occurrenceProgress = useAppSelector((s) => s.map.occurrence_progress ?? 0);

  /* ---------------- derive unique scales ---------------- */
  const overlaysActive = mapOverlays.filter(
    (l) => l.sourceLayer === 'overlays' && l.isVisible === true
  );

  const uniqueScales = overlaysActive
    .map((o) => o.scale as string)
    .filter((s, i, self) => self.indexOf(s) === i);

  /* ---------------- map state ---------------- */
  const [map, setMap] = useState<OlMap | null>(null);
  const [speciesStyles, setSpeciesStyles] = useState<speciesStyle[]>([]);
  const mapElement = useRef<HTMLDivElement | null>(null);
  const pointLayerRef = useRef<WebGLPointsLayer<VectorSource<Point>> | null>(
    null
  );

  /* ---------------- fetch data ---------------- */
  useEffect(() => {
    dispatch(getOccurrenceData(filters));
  }, [filters, dispatch]);

  /* ---------------- init map ONCE ---------------- */
  useEffect(() => {
    if (!mapElement.current || map) return;

    console.log('Initializing map...');
    dispatch(updateProcessedPoints([]));

    const baseLayer = buildBaseMapLayer();

    const styles = getSpeciesStyles(fullSpeciesList);
    setSpeciesStyles(styles);

    const pointLayer = buildPointLayerWebGL([], styles);
    pointLayerRef.current = pointLayer;

    const olMap = new OlMap({
      target: mapElement.current,
      layers: [baseLayer, pointLayer],
      view: new View({
        center: transform([20, -5], 'EPSG:4326', 'EPSG:3857'),
        zoom: 4,
      }),
    });

    setMap(olMap);

    return () => {
      olMap.setTarget(undefined);
      olMap.dispose();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------------- Update species styles when list changes ---------------- */
  useEffect(() => {
    if (!fullSpeciesList.length) return;
    const styles = getSpeciesStyles(fullSpeciesList);
    setSpeciesStyles(styles);
  }, [fullSpeciesList]);

  /* ---------------- Update points when data changes (NO MAP RECREATION) ---------------- */
  useEffect(() => {
    if (!pointLayerRef.current || !speciesStyles.length) return;

    const source = pointLayerRef.current.getSource();
    if (!source) return;

    console.log(
      `Updating ${occurrenceData.length} points without recreating map...`
    );

    source.clear();

    if (occurrenceData.length === 0) return;

    const cleanData = occurrenceData.map((o) => {
      const copy = { ...o };
      delete copy.color;
      return copy;
    });

    const features = new GeoJSON().readFeatures(responseToGEOJSON(cleanData), {
      featureProjection: 'EPSG:3857',
    }) as Feature<Point>[];

    const speciesColorMap = new Map<string, [number, number, number, number]>();
    speciesStyles.forEach((s) => {
      const color = cssColorToVec4(s.color);
      speciesColorMap.set(s.species, color);
    });

    features.forEach((f) => {
      const species = String(f.get('species') ?? '');
      const [r, g, b, a] =
        speciesColorMap.get(species) ?? cssColorToVec4('#038543');

      f.set('r', r);
      f.set('g', g);
      f.set('b', b);
      f.set('a', a);
      f.set('baseSize', 6);
      f.set('selected', 0);

      if (!f.get('id') && f.getId()) {
        f.set('id', f.getId());
      }
    });

    source.addFeatures(features);
    console.log('Points updated successfully');
  }, [occurrenceData, speciesStyles]);

  /* ---------------- Update legend when species or selection changes ---------------- */
  useEffect(() => {
    if (!map) return;
    const speciesList = Array.isArray(filters.species)
      ? filters.species
      : filters.species?.value || fullSpeciesList;

    updateLegendForSpeciesWebGL(speciesList, speciesStyles, selectedIds, map);
  }, [map, filters.species, fullSpeciesList, speciesStyles, selectedIds]);

  /* ---------------- Update selection highlighting ---------------- */
  useEffect(() => {
    if (!pointLayerRef.current) return;
    const source = pointLayerRef.current.getSource();
    if (!source) return;

    updateSelectionAttributesWebGL(source, selectedIds);
  }, [selectedIds]);

  /* ---------------- update overlays & basemap ---------------- */
  useEffect(() => {
    if (!map) return;

    console.log('Updating map styles and overlays...');
    updateBaseMapStyles(mapStyles, mapOverlays, map);
    updateOverlayLayers(mapStyles, mapOverlays, map);
  }, [map, mapStyles, mapOverlays]);

  /* ---------------- click handler ---------------- */
  useEffect(() => {
    if (!map) return;

    const handleClick = (evt: any) => {
      const ids: string[] = [];
      map.forEachFeatureAtPixel(evt.pixel, (feat, layer) => {
        if (layer?.get('occurrence-data') || feat.get('id')) {
          ids.push(feat.get('id'));
        }
      });

      if (ids.length) {
        dispatch(setSelectedIds(ids));
        dispatch(getFullOccurrenceData());
      }
    };

    map.on('singleclick', handleClick);
    return () => map.un('singleclick', handleClick);
  }, [map, dispatch]);

  /* ---------------- resize on drawer ---------------- */
  useEffect(() => {
    if (!map) return;
    const timer = setTimeout(() => map.updateSize(), 250);
    return () => clearTimeout(timer);
  }, [drawerOpen, map]);

  /* ---------------- DOI filters ---------------- */
  useEffect(() => {
    if (!doiResolverId) return;

    const fetchAndApply = async () => {
      try {
        const res = await fetch(`/vector-api/doi/resolver/${doiResolverId}`);
        const data = await res.json();

        const fetchedFilters = data?.meta_data?.filters;
        if (fetchedFilters) {
          Object.entries(fetchedFilters).forEach(([filterName, filter]) => {
            dispatch(
              filterHandler({
                filterName,
                filterOptions: filter,
              })
            );
          });
        }

        if (data?.uploaded_model) {
          const name = data.uploaded_model.title.trim().replace(/\s/g, '_');
          dispatch(showLayerVisible(name));
        }
      } catch (e) {
        console.error('DOI resolver error', e);
      }
    };

    fetchAndApply();
  }, [doiResolverId, dispatch]);

  /* ---------------- render ---------------- */
  return (
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
      <DrawerMap />

      <Box component="main" sx={{ flexGrow: 1 }}>
        <div
          id="mapDiv"
          ref={mapElement}
          style={{ height: 'calc(100vh - 230px)' }}
        />
      </Box>

      {selectedIds.length > 0 && <DataDrawer />}

      {areaModeOn && (
        <div
          style={{
            position: 'absolute',
            right: 20,
            top: 100,
            zIndex: 10,
            background: '#EBBD40',
            boxShadow: '0 0 10px black',
            padding: '5px 20px',
            color: 'black',
          }}
        >
          <Typography>{t('areaModeOn')}</Typography>
        </div>
      )}

      {occurrenceProgress > 0 && occurrenceProgress < 100 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0,0,0,0.7)',
            padding: '20px 40px',
            borderRadius: '8px',
            color: 'white',
            zIndex: 20,
            textAlign: 'center',
          }}
        >
          <Typography variant="body1">
            {t('loadingPoints', { progress: Math.round(occurrenceProgress) })}
          </Typography>
          <div
            style={{
              marginTop: 10,
              width: 200,
              height: 10,
              background: '#555',
              borderRadius: 5,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${occurrenceProgress}%`,
                height: '100%',
                background: '#EBBD40',
              }}
            />
          </div>
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          display: 'flex',
          right: 10,
          top: 200,
          zIndex: 10,
          height: 200,
          color: 'black',
        }}
      >
        {uniqueScales.map((s) => {
          const scale = mapStyles.scales.find((sc) => sc.name === s);
          return <ScaleLegend key={s} overlayName={s} title={scale?.title} />;
        })}
      </div>
    </Box>
  );
};

export default MapWrapperV3;

