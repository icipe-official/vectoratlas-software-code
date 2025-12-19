// MapWrapperV3.tsx — Option A (single map + single WebGL layer, source updates only)

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

  /* ---------------- derived scales ---------------- */
  const overlaysActive = mapOverlays.filter(
    (l) => l.sourceLayer === 'overlays' && l.isVisible
  );

  const uniqueScales = overlaysActive
    .map((o) => o.scale as string)
    .filter((s, i, self) => self.indexOf(s) === i);

  /* ---------------- map refs ---------------- */
  const mapElement = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<OlMap | null>(null);
  const pointLayerRef =
    useRef<WebGLPointsLayer<VectorSource<Point>> | null>(null);

  const [speciesStyles, setSpeciesStyles] = useState<speciesStyle[]>([]);

  /* ---------------- fetch occurrence data ---------------- */
  useEffect(() => {
    dispatch(getOccurrenceData(filters));
  }, [filters, dispatch]);

  /* ---------------- init map ONCE ---------------- */
  useEffect(() => {
    if (!mapElement.current || mapRef.current) return;

    dispatch(updateProcessedPoints([]));

    const baseLayer = buildBaseMapLayer();

    const styles = getSpeciesStyles(fullSpeciesList);
    setSpeciesStyles(styles);

    const pointLayer = buildPointLayerWebGL([], styles);
    pointLayerRef.current = pointLayer;

    const map = new OlMap({
      target: mapElement.current,
      layers: [baseLayer, pointLayer],
      view: new View({
        center: transform([20, -5], 'EPSG:4326', 'EPSG:3857'),
        zoom: 4,
      }),
    });

    mapRef.current = map;

    return () => {
      map.setTarget(undefined);
      map.dispose();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------------- update species styles ---------------- */
  useEffect(() => {
    if (!fullSpeciesList.length) return;
    setSpeciesStyles(getSpeciesStyles(fullSpeciesList));
  }, [fullSpeciesList]);

  /* ---------------- update point source (Option A) ---------------- */
  useEffect(() => {
    const layer = pointLayerRef.current;
    if (!layer || !speciesStyles.length) return;

    const source = layer.getSource();
    if (!source) return;

    source.clear(true);
    if (!occurrenceData.length) return;

    const speciesColorMap = new Map<
      string,
      [number, number, number, number]
    >();

    speciesStyles.forEach((s) =>
      speciesColorMap.set(s.species, cssColorToVec4(s.color))
    );

    const features: Feature<Point>[] = occurrenceData.map((o: any) => {
      const f = new Feature({
        geometry: new Point(
          transform([o.longitude, o.latitude], 'EPSG:4326', 'EPSG:3857')
        ),
      });

      const [r, g, b, a] =
        speciesColorMap.get(o.species) ?? cssColorToVec4('#038543');

      f.setProperties({
        id: o.id,
        species: o.species,
        r,
        g,
        b,
        a,
        baseSize: 6,
        selected: 0,
      });

      f.setId(o.id);
      return f;
    });

    source.addFeatures(features);
  }, [occurrenceData, speciesStyles]);

  /* ---------------- legend updates ---------------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const speciesList = Array.isArray(filters.species)
      ? filters.species
      : filters.species?.value || fullSpeciesList;

    updateLegendForSpeciesWebGL(
      speciesList,
      speciesStyles,
      selectedIds,
      map
    );
  }, [filters.species, fullSpeciesList, speciesStyles, selectedIds]);

  /* ---------------- selection highlighting ---------------- */
  useEffect(() => {
    const source = pointLayerRef.current?.getSource();
    if (!source) return;

    updateSelectionAttributesWebGL(source, selectedIds);
  }, [selectedIds]);

  /* ---------------- basemap & overlays ---------------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    updateBaseMapStyles(mapStyles, mapOverlays, map);
    updateOverlayLayers(mapStyles, mapOverlays, map);
  }, [mapStyles, mapOverlays]);

  /* ---------------- click handling ---------------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleClick = (evt: any) => {
      const ids: string[] = [];

      map.forEachFeatureAtPixel(evt.pixel, (feat) => {
        const id = feat.get('id');
        if (id) ids.push(id);
      });

      if (ids.length) {
        dispatch(setSelectedIds(ids));
        dispatch(getFullOccurrenceData());
      }
    };

    map.on('singleclick', handleClick);
    return () => map.un('singleclick', handleClick);
  }, [dispatch]);

  /* ---------------- resize ---------------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const t = setTimeout(() => map.updateSize(), 250);
    return () => clearTimeout(t);
  }, [drawerOpen]);

  /* ---------------- DOI filters ---------------- */
  useEffect(() => {
    if (!doiResolverId) return;

    (async () => {
      try {
        const res = await fetch(`/vector-api/doi/resolver/${doiResolverId}`);
        const data = await res.json();

        const fetchedFilters = data?.meta_data?.filters;
        if (fetchedFilters) {
          Object.entries(fetchedFilters).forEach(([filterName, filter]) =>
            dispatch(filterHandler({ filterName, filterOptions: filter }))
          );
        }

        if (data?.uploaded_model) {
          const name = data.uploaded_model.title.trim().replace(/\s/g, '_');
          dispatch(showLayerVisible(name));
        }
      } catch (e) {
        console.error('DOI resolver error', e);
      }
    })();
  }, [doiResolverId, dispatch]);

  /* ---------------- render ---------------- */
  return (
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
      <DrawerMap />

      <Box component="main" sx={{ flexGrow: 1 }}>
        <div
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
          }}
        >
          <Typography>{t('areaModeOn')}</Typography>
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          right: 10,
          top: 200,
          zIndex: 10,
          height: 200,
          display: 'flex',
        }}
      >
        {uniqueScales.map((s) => {
          const scale = mapStyles.scales.find((sc) => sc.name === s);
          return (
            <ScaleLegend key={s} overlayName={s} title={scale?.title} />
          );
        })}
      </div>
    </Box>
  );
};

export default MapWrapperV3;
