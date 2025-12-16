// MapWrapperV3.tsx
import React, { useEffect, useRef, useState } from 'react';
import OlMap from 'ol/Map';
import View from 'ol/View';
import { transform } from 'ol/proj';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import WebGLPointsLayer from 'ol/layer/WebGLPoints';
import { Style, Circle as CircleStyle, Fill, Stroke } from 'ol/style';
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
  updateSelectionAttributesWebGL,
  updateLegendForSpeciesWebGL,
} from './pointutilswebgl';

import DrawerMap from '../layers/drawerMap';
import DataDrawer from '../layers/dataDrawer';
import ScaleLegend from './scaleLegend';
import { speciesStyle } from './types';

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

  /* ---------------- derive unique scales (same as V2) ---------------- */
  const overlaysActive = mapOverlays.filter(
    (l) => l.sourceLayer === 'overlays' && l.isVisible === true
  );

  const uniqueScales = overlaysActive
    .map((o) => o.scale as string)
    .filter((s, i, self) => self.indexOf(s) === i);

  /* ---------------- map state ---------------- */
  const [map, setMap] = useState<OlMap | null>(null);
  const mapElement = useRef<HTMLDivElement | null>(null);

  /* ---------------- species styles ---------------- */
  const speciesStyles: speciesStyle[] = fullSpeciesList.map((sp) => {
    const color = '#038543';

    return {
      species: sp,
      color,
      defaultStyle: new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({ color }),
          stroke: new Stroke({ color: '#ffffff', width: 1 }),
        }),
      }),
      selectedStyle: new Style({
        image: new CircleStyle({
          radius: 10,
          fill: new Fill({ color }),
          stroke: new Stroke({ color: '#000000', width: 1 }),
        }),
      }),
    };
  });

  /* ---------------- fetch data ---------------- */
  useEffect(() => {
    dispatch(getOccurrenceData(filters));
  }, [filters, dispatch]);

  /* ---------------- init map ---------------- */
  useEffect(() => {
    if (!mapElement.current) return;

    dispatch(updateProcessedPoints([]));

    const base = buildBaseMapLayer();
    const pointLayer = buildPointLayerWebGL(occurrenceData, speciesStyles);

    const olMap = new OlMap({
      target: mapElement.current,
      layers: [base, pointLayer],
      view: new View({
        center: transform([20, -5], 'EPSG:4326', 'EPSG:3857'),
        zoom: 4,
      }),
    });

    setMap(olMap);
    return () => olMap.setTarget(undefined);
  }, [occurrenceData, fullSpeciesList]);

  /* ---------------- update overlays & basemap ---------------- */
  useEffect(() => {
    if (!map) return;
    updateBaseMapStyles(mapStyles, mapOverlays, map);
    updateOverlayLayers(mapStyles, mapOverlays, map);
  }, [map, mapStyles, mapOverlays]);

  /* ---------------- selection sync ---------------- */
  useEffect(() => {
    if (!map) return;

    map.getLayers().forEach((layer) => {
      if (layer instanceof WebGLPointsLayer) {
        const src = layer.getSource();
        if (src) updateSelectionAttributesWebGL(src, selectedIds);
      }
    });
  }, [selectedIds, map]);

  /* ---------------- click handler ---------------- */
  useEffect(() => {
    if (!map) return;

    const handleClick = (evt: any) => {
      const ids: string[] = [];
      map.forEachFeatureAtPixel(evt.pixel, (feat, layer) => {
        if (layer?.get('occurrence-data')) {
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

  /* ---------------- legend update ---------------- */
  useEffect(() => {
    updateLegendForSpeciesWebGL(
      fullSpeciesList,
      speciesStyles,
      selectedIds,
      map
    );
  }, [fullSpeciesList, speciesStyles, selectedIds, map]);

  /* ---------------- resize on drawer ---------------- */
  useEffect(() => {
    if (!map) return;
    setTimeout(() => map.updateSize(), 250);
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
  const scale = mapStyles.scales.find(
    (sc) => sc.name === s
  );

  return (
    <ScaleLegend
      key={s}
      overlayName={s}
      title={scale?.title}
    />
  );
})}
      </div>
    </Box>
  );
};

export default MapWrapperV3;
