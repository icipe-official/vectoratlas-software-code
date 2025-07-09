import { useRouter } from 'next/router';
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
import { setSelectedIds, showLayerVisible } from '../../../state/map/mapSlice';
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
import { filterHandler } from '../../../state/map/mapSlice';
import Control from 'ol/control/Control';
import { useTranslations } from 'next-intl';

export type speciesStyle = {
  species: string;
  color: string;
  defaultStyle: Style;
  selectedStyle: Style;
};

export const MapWrapperV2 = ({
  doiResolverId,
}: { doiResolverId?: string } = {}) => {
  const router = useRouter();
  const t = useTranslations('MapPage');

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
    // Initialise map
    return () => initialMap.setTarget(undefined);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const speciesFromQuery = router.query.species;

    if (typeof speciesFromQuery === 'string') {
      dispatch(
        filterHandler({
          filterName: 'species',
          filterOptions: [speciesFromQuery], // wrap in array if expecting list
        })
      );
    }
  }, [router.query.species, dispatch]);
  useEffect(() => {
    if (map) {
      // Remove the legend if it exists when species filter changes
      const existingLegend = document.getElementById('basic-legend');
      if (existingLegend) {
        existingLegend.remove();
      }

      // Then create a new legend if needed
      // createBasicLegend();
    }
  }, [map, filters]);

  let legendControl: any = null;

  // const createBasicLegend = () => {
  //   // Check if the legend already exists
  //   const existingLegend = document.getElementById('basic-legend');
  //   if (existingLegend) {
  //     return; // Exit if the legend already exists
  //   }

  //   const legendContainer = document.createElement('div');
  //   legendContainer.id = 'basic-legend'; // Assign a unique ID
  //   legendContainer.className = 'basic-legend';
  //   legendContainer.style.position = 'absolute';
  //   legendContainer.style.top = '100px';
  //   legendContainer.style.right = '20px';
  //   legendContainer.style.border = '2px solid black';
  //   legendContainer.style.padding = '2px';
  //   legendContainer.style.zIndex = '1000';

  //   const presenceDiv = document.createElement('div');
  //   presenceDiv.innerHTML = `
  //     <span style="display: inline-block; width: 12px; height: 12px; background-color: #038543; border-radius: 50%; margin-right: 5px;"></span>
  //     Presence
  //   `;
  //   legendContainer.appendChild(presenceDiv);

  //   const absenceDiv = document.createElement('div');
  //   absenceDiv.innerHTML = `
  //     <span style="display: inline-block; width: 12px; height: 12px; background-color: #D3D3D3; border: 1px solid black; border-radius: 50%; margin-right: 5px;"></span>
  //     Not Found
  //   `;
  //   legendContainer.appendChild(absenceDiv);

  //   // Append the legend to your map container
  //   const legendControl = new Control({
  //     element: legendContainer,
  //   });

  //   // Add the control to the map
  //   map?.addControl(legendControl);
  // };

  // handle resizing the map issue
  useEffect(() => {
    let sleepTime: number = 200;
    for (let i = 0; i < 1000; i += sleepTime) {
      sleep(sleepTime).then(() => map?.updateSize());
    }
  }, [drawerOpen, map, selectedIds]);

  //handle doi filters
  useEffect(() => {
    /*       const dispatch = useAppDispatch(); */

    const loopAndUpdateFilters = (filtersObject: any) => {
      if (!filtersObject) {
        console.log('Filters object is null or undefined. Exiting function.');
        return;
      }

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
        } else {
          console.warn(
            `Skipping filterName: ${filterName}. Invalid or missing value.`
          );
        }
      });
    };

    const fetchAndDispatchOccurrenceData = async () => {
      try {
        if (doiResolverId) {
          // Fetch filters from the API if DOI is provided
          const response = await fetch(
            `/vector-api/doi/resolver/${doiResolverId}`
          );
          const data = await response.json();
          const fetchedFilters = data?.meta_data?.filters;
          if (fetchedFilters) {
            // Update filters using fetched filters
            loopAndUpdateFilters(fetchedFilters);
          } else {
            console.warn('No filters found for the provided DOI.');
          }

          if (data?.uploadedDatasetId) {
     
          } else if (data?.uploaded_model) {
            // for models
            const modelDisplayName = data?.uploaded_model.title
              .trim()
              .replace(/\s/g, '_');
            console.log('Layers: ', layerVisibility);
            dispatch(showLayerVisible(modelDisplayName));
          }
        }
      } catch (error) {
        console.error('Error updating filters:', error);
      }
    };

    fetchAndDispatchOccurrenceData();
  }, [dispatch, doiResolverId, layerVisibility]); // Only re-run if `dispatch` or `doi` changes

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
        map?.forEachFeatureAtPixel(evt.pixel, function(feat, layer) {
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
    if (legendControl) {
      map?.removeControl(legendControl); // Remove the legend
      legendControl = null; // Clear the reference
    }

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
          <Typography>{t('areaModeOn')}</Typography>
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
