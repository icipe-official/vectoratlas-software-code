// MapWrapperV3.tsx
import React, { useEffect, useRef, useState } from 'react';
import OlMap from 'ol/Map';
import View from 'ol/View';
import { transform } from 'ol/proj';
import Box from '@mui/material/Box';
import { speciesStyle } from './types';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';

import {
  setSelectedIds,
  showLayerVisible,
  updateProcessedPoints,
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
import { filterHandler } from '../../../state/map/mapSlice';
import WebGLPointsLayer from 'ol/layer/WebGLPoints';
import DrawerMap from '../layers/drawerMap';
import DataDrawer from '../layers/dataDrawer';
import { Style, Circle as CircleStyle, Fill, Stroke } from 'ol/style';
import 'ol/ol.css';

type MapWrapperV3Props = {
  doiResolverId?: string;
};

const MapWrapperV3: React.FC<MapWrapperV3Props> = ({ doiResolverId }) => {
  const dispatch = useAppDispatch();

  // Redux selectors
  const occurrenceData = useAppSelector((s) => s.map.occurrence_data);
  const filters = useAppSelector((s) => s.map.filters);
  const drawerOpen = useAppSelector((s) => s.map.map_drawer.open);
  const selectedIds = useAppSelector((s) => s.map.selectedIds);
  const mapStyles = useAppSelector((s) => s.map.map_styles);
  const mapOverlays = useAppSelector((s) => s.map.map_overlays);
  const fullSpeciesList = useAppSelector((s) => s.map.filterValues.species);

  const [map, setMap] = useState<OlMap | null>(null);
  const mapElement = useRef<HTMLDivElement | null>(null);

  /** Convert species list from Redux → styling objects */
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

  // Fetch occurrence data when filters change
  useEffect(() => {
    dispatch(getOccurrenceData(filters));
  }, [filters, dispatch]);

  // Initialize map
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

  // Update overlays + basemap style
  useEffect(() => {
    if (!map) return;
    updateBaseMapStyles(mapStyles, mapOverlays, map);
    updateOverlayLayers(mapStyles, mapOverlays, map);
  }, [map, mapStyles, mapOverlays]);

  // Update selection state inside WebGL layer
  useEffect(() => {
    if (!map) return;
    map.getLayers().forEach((layer) => {
      if (layer instanceof WebGLPointsLayer) {
        const src = layer.getSource();
        if (src) updateSelectionAttributesWebGL(src, selectedIds);
      }
    });
  }, [selectedIds, map]);

  // Click → select point → fetch full detail
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
  }, [map]);

  // Legend update (uses species styles only)
  useEffect(() => {
    updateLegendForSpeciesWebGL(
      fullSpeciesList,
      speciesStyles,
      selectedIds,
      map
    );
  }, [fullSpeciesList, speciesStyles, selectedIds, map]);

  // Handle drawer → resize map
  useEffect(() => {
    if (!map) return;
    setTimeout(() => map.updateSize(), 250);
  }, [drawerOpen, map]);

  // Handle DOI filters
  useEffect(() => {
    const loopAndUpdateFilters = (filtersObject: any) => {
      if (!filtersObject) return;
      Object.keys(filtersObject).forEach((filterName) => {
        const filter = filtersObject[filterName];
        if (
          filter !== undefined &&
          (Array.isArray(filter)
            ? filter.length > 0
            : Object.keys(filter).length > 0)
        ) {
          dispatch(
            filterHandler({
              filterName,
              filterOptions: filter,
            })
          );
        }
      });
    };

    const fetchAndDispatchOccurrenceData = async () => {
      if (!doiResolverId) return;
      try {
        const response = await fetch(
          `/vector-api/doi/resolver/${doiResolverId}`
        );
        const data = await response.json();
        const fetchedFilters = data?.meta_data?.filters;
        if (fetchedFilters) loopAndUpdateFilters(fetchedFilters);

        if (data?.uploaded_model) {
          const modelDisplayName = data.uploaded_model.title
            .trim()
            .replace(/\s/g, '_');
          dispatch(showLayerVisible(modelDisplayName));
        }
      } catch (error) {
        console.error('Error updating filters:', error);
      }
    };

    fetchAndDispatchOccurrenceData();
  }, [doiResolverId, dispatch]);

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
    </Box>
  );
};

export default MapWrapperV3;
