import React, { useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import Map from 'ol/Map';
import View from 'ol/View';
import { transform } from 'ol/proj';
import Box from '@mui/material/Box';
import DrawerMap from '../layers/drawerMap';
import DataDrawer from '../layers/dataDrawer';
import { sleep } from '../utils/map.utils';
import { getOccurrenceData } from '../../../state/map/actions/getOccurrenceData';
import {
  buildBaseMapLayer,
  updateBaseMapStyles,
  updateOverlayLayers,
} from './layerUtils';
import 'ol/ol.css';
import { getFullOccurrenceData } from '../../../state/map/actions/getFullOccurrenceData';
import { setSelectedIds } from '../../../state/map/mapSlice';
import {
  buildPointLayer,
  updateLegendForSpecies,
  updateOccurrencePoints,
} from './pointUtils';
import { registerDownloadHandler } from './downloadImageHandler';

const getNewColor = () => {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);

  return `rgb(${r},${g},${b})`;
};

export const MapWrapperV2 = () => {
  const mapStyles = useAppSelector((state) => state.map.map_styles);
  const filters = useAppSelector((state) => state.map.filters);
  const download = useAppSelector((state) => state.map.map_drawer.download);
  const occurrenceData = useAppSelector((state) => state.map.occurrence_data);
  const layerVisibility = useAppSelector((state) => state.map.map_overlays);
  const drawerOpen = useAppSelector((state) => state.map.map_drawer.open);
  const selectedIds = useAppSelector((state) => state.map.selectedIds);
  const speciesList = useAppSelector((state) => state.map.filterValues.species);

  const dispatch = useAppDispatch();

  const [map, setMap] = useState<Map | null>(null);
  const mapElement = useRef(null);
  const [colorArray, setColorArray] = useState<string[]>([
    '#dc267f',
    '#648fff',
    '#785ef0',
    '#fe6100',
    '#ffb000',
    '#000000',
    '#ffffff',
  ]);

  useEffect(() => {
    // OpenLayers is event-based so we need to build a single
    // map instance and update it.
    const pointLayer = buildPointLayer(occurrenceData);
    const baseMapLayer = buildBaseMapLayer();

    const initialMap = new Map({
      target: 'mapDiv',
      layers: [baseMapLayer, pointLayer],
      view: new View({
        center: transform([20, -5], 'EPSG:4326', 'EPSG:3857'),
        zoom: 4,
      }),
    });

    setColorArray([...colorArray, ...speciesList.map(getNewColor)]);
    setMap(initialMap);

    // Initialise map
    return () => initialMap.setTarget(undefined);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handle resizing the map issue
  useEffect(() => {
    let sleepTime: number = 200;
    for (let i = 0; i < 1000; i += sleepTime) {
      sleep(sleepTime).then(() => map?.updateSize());
    }
  }, [drawerOpen, map, selectedIds]);

  // update the data points when new filters are set, or initial point load
  useEffect(() => {
    dispatch(getOccurrenceData(filters));
  }, [dispatch, filters]);

  // update the base map and overlay styling if the styles change
  useEffect(() => {
    updateBaseMapStyles(mapStyles, layerVisibility, map);
    updateOverlayLayers(mapStyles, layerVisibility, map);
  }, [map, layerVisibility, mapStyles]);

  // update the points layer when new data comes in
  useEffect(() => {
    updateOccurrencePoints(map, occurrenceData);
  }, [map, occurrenceData]);

  // register click detection for the points
  useEffect(() => {
    map?.on('singleclick', function (evt) {
      const idArray: string[] = [];
      map?.forEachFeatureAtPixel(evt.pixel, function (feat, layer) {
        if (layer.get('occurrence-data')) {
          idArray.push(feat.get('id'));
        }
      });
      dispatch(setSelectedIds(idArray));
      dispatch(getFullOccurrenceData());
    });
  }, [map, dispatch]);

  // register download handler
  useEffect(() => {
    return registerDownloadHandler(map, filters.species, colorArray);
  }, [map, download, filters.species, colorArray]);

  // update the legend when the species filter changes
  useEffect(() => {
    updateLegendForSpecies(filters.species, colorArray, map);
  }, [filters.species, colorArray, map]);

  return (
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
      <DrawerMap />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <div
          id="mapDiv"
          ref={mapElement}
          style={{ height: 'calc(100vh - 230px)' }}
          data-testid="mapDiv"
        ></div>
      </Box>
      {selectedIds.length !== 0 && <DataDrawer />}
    </Box>
  );
};