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
  buildAreaSelectionLayer,
  updateLegendForSpecies,
  updateOccurrencePoints,
  removeAreaInteractions,
  addAreaInteractions,
  updateSelectedPolygons,
  getSpeciesStyles,
} from './pointUtils';
import { registerDownloadHandler } from './downloadImageHandler';
import { Typography } from '@mui/material';
import ScaleLegend from './scaleLegend';
import { Style } from 'ol/style';

export type speciesStyle = {
  species: string;
  color: string;
  defaultStyle: Style;
  selectedStyle: Style;
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
  const areaModeOn = useAppSelector((state) => state.map.areaSelectModeOn);

  const overlaysActive = layerVisibility.filter(
    (l) => l.sourceLayer === 'overlays' && l.isVisible === true
  );

  const uniqueScales = overlaysActive
    .map((o) => o.scale as string)
    .filter((s, pos, self) => self.indexOf(s) === pos);

  const dispatch = useAppDispatch();

  const [map, setMap] = useState<Map | null>(null);
  const mapElement = useRef(null);
  const [speciesStyles, setSpeciesStyles] = useState<speciesStyle[]>([]);

  useEffect(() => {
    // OpenLayers is event-based so we need to build a single
    // map instance and update it.
    const pointLayer = buildPointLayer(occurrenceData);
    const baseMapLayer = buildBaseMapLayer();
    const areaSelect = buildAreaSelectionLayer();

    const initialMap = new Map({
      target: 'mapDiv',
      layers: [baseMapLayer, pointLayer, areaSelect],
      view: new View({
        center: transform([20, -5], 'EPSG:4326', 'EPSG:3857'),
        zoom: 4,
      }),
    });

    setSpeciesStyles(getSpeciesStyles(speciesList));

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
    const openDetails = (evt: any) => {
      const idArray: string[] = [];
      if (!areaModeOn) {
        map?.forEachFeatureAtPixel(evt.pixel, function (feat, layer) {
          if (layer && layer.get('occurrence-data')) {
            idArray.push(feat.get('id'));
          }
        });

        dispatch(setSelectedIds(idArray));
        dispatch(getFullOccurrenceData());
      }
    };

    map?.on('singleclick', openDetails);

    return () => map?.removeEventListener('singleclick', openDetails);
  }, [map, areaModeOn, dispatch]);

  // register download handler
  useEffect(() => {
    return registerDownloadHandler(map, filters.species, speciesStyles);
  }, [map, download, filters.species, speciesStyles]);

  // update the legend when the species filter changes
  useEffect(() => {
    updateLegendForSpecies(filters.species, speciesStyles, selectedIds, map);
  }, [filters.species, speciesStyles, map, selectedIds]);

  useEffect(() => {
    if (!map) {
      return;
    }

    if (areaModeOn) {
      addAreaInteractions(map, dispatch);
    } else {
      removeAreaInteractions(map);
    }
  }, [areaModeOn, map, dispatch]);

  useEffect(() => {
    if (!map) {
      return;
    }

    updateSelectedPolygons(map, filters.areaCoordinates);
  }, [map, filters.areaCoordinates]);

  return (
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
      <DrawerMap />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <div
          id="mapDiv"
          ref={mapElement}
          style={{ height: 'calc(100vh - 230px)' }}
          data-testid="mapDiv"
        ></div>
      </Box>
      {selectedIds.length !== 0 && <DataDrawer />}
      {areaModeOn ? (
        <div
          style={{
            position: 'absolute',
            right: 20,
            top: 100,
            zIndex: 10,
            background: '#ebbd40',
            boxShadow: '0 0 10px black',
            paddingLeft: '20px',
            paddingRight: '20px',
            paddingTop: '5px',
            paddingBottom: '5px',
            color: 'black',
          }}
        >
          <Typography>Area mode on</Typography>
        </div>
      ) : null}
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
        {uniqueScales.map((s: any) => (
          <ScaleLegend key={s} overlayName={s} />
        ))}
      </div>
    </Box>
  );
};
