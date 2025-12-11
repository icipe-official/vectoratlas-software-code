import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import { responseToGEOJSON } from '../utils/map.utils';
import VectorLayer from 'ol/layer/Vector';
import { Circle, Style, Fill, Stroke, RegularShape } from 'ol/style';
import Control from 'ol/control/Control';
import Map from 'ol/Map';
import { MapFilter } from '../../../state/state.types';
import { Draw, Modify, Snap } from 'ol/interaction.js';
import { updateAreaFilter } from '../../../state/map/mapSlice';
import { Polygon, SimpleGeometry } from 'ol/geom';
import { transform } from 'ol/proj';
import { never } from 'ol/events/condition';
import { AppDispatch } from '../../../state/store';
import { Coordinate } from 'ol/coordinate';
import Feature from 'ol/Feature';
import { speciesStyle } from './map-v2';

let draw: Draw, snap: Snap, modify: Modify;

const fixedColourMap: any = {
  gambiae: 'red',
  arabiensis: 'grey',
  funestus: 'green',
};

// Create cross style for absence data
const createCrossStyle = (color: string, isSelected: boolean) => {
  return new Style({
    image: new RegularShape({
      points: 4,
      radius: 7,
      radius2: 0,
      angle: Math.PI / 4, // 45 degrees to make an X
      stroke: new Stroke({
        color: isSelected ? 'white' : color,
        width: isSelected ? 2.5 : 1.5,
      }),
    }),
  });
};

// Create style for both presence (circles) and absence (crosses)
const createStyle = (color: string, isSelected: boolean, isAbsence: boolean = false) => {
  // If it's absence data, return cross style
  if (isAbsence) {
    return createCrossStyle(color, isSelected);
  }
  
  // Original circle style for presence
  return new Style({
    image: new Circle({
      radius: 5,
      fill: new Fill({
        color: color,
      }),
      stroke: new Stroke({
        color: isSelected ? 'white' : 'black',
        width: isSelected ? 2 : 0.5,
      }),
    }),
  });
};

export const updateOccurrencePoints = (
  map: Map | null,
  occurrenceData: any[],
  processedPoints: any[],
  lastProcessedIndex: number = 0
) => {
  const pointsLayer = map?.getAllLayers().find((l) => l.get('occurrence-data'));
  const allProcessedPoints = responseToGEOJSON(
    occurrenceData.slice(lastProcessedIndex),
    processedPoints
  );
  pointsLayer?.setSource(
    new VectorSource({
      features: new GeoJSON().readFeatures(allProcessedPoints, {
        featureProjection: 'EPSG:3857',
      }),
    })
  );
  return processedPoints;
};

export const buildPointLayer = (occurrenceData: any[]) => {
  const source = new VectorSource({
    features: new GeoJSON().readFeatures(responseToGEOJSON(occurrenceData), {
      featureProjection: 'EPSG:3857',
    }),
  });
  
  const pointLayer = new VectorLayer({
    source: source,
    style: (feature) => {
      // Check for absence data
      const isAbsence = feature.get('binary_presence') === 'False' || 
                       feature.get('binary_presence') === false ||
                       feature.get('binaryPresence') === 'False' ||
                       feature.get('binaryPresence') === false;
      
      return createStyle('#038543', false, isAbsence);
    },
  });
  
  pointLayer.set('occurrence-data', true);
  return pointLayer;
};

export const buildAreaSelectionLayer = () => {
  const source = new VectorSource();
  const vector = new VectorLayer({
    source: source,
    style: () => {
      return new Style({
        fill: new Fill({ color: 'rgba(255, 255, 255, 0.2)' }),
        stroke: new Stroke({
          color: '#ffcc33',
          width: 2,
        }),
        image: new Circle({
          radius: 7,
          fill: new Fill({
            color: '#ffcc33',
          }),
        }),
      });
    },
  });
  vector.set('area-select', true);

  return vector;
};

export const getSpeciesStyles = (speciesList: string[]) => {
  const getNewColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r},${g},${b})`;
  };

  const speciesStyleArray: speciesStyle[] = speciesList.map((species) => {
    const color = fixedColourMap[species] ?? getNewColor();
    return {
      species,
      color,
      // Presence styles (circles)
      defaultStyle: createStyle(color, false, false),
      selectedStyle: createStyle(color, true, false),
      // Absence styles (crosses)
      absenceStyle: createStyle(color, false, true),
      selectedAbsenceStyle: createStyle(color, true, true),
    };
  });

  return speciesStyleArray;
};

export const updateLegendForSpecies = (
  speciesFilters: MapFilter<string[]>,
  speciesStyles: speciesStyle[],
  selectedIds: string[],
  map: Map | null
) => {
  const getSpeciesStyle = (species: string, isSelected: boolean, isAbsence: boolean = false) => {
    const speciesStyle = speciesStyles.find((x) => x.species === species);
    
    if (isAbsence) {
      return isSelected
        ? speciesStyle?.selectedAbsenceStyle
        : speciesStyle?.absenceStyle;
    }
    
    return isSelected
      ? speciesStyle?.selectedStyle
      : speciesStyle?.defaultStyle;
  };

  if (!map) {
    return;
  }

  // Map internal values to display labels
  const speciesDisplayMap: Record<string, string> = {
    'coluzzii_gambiae_m form': 'coluzzii',
    'gambiae_s form': 'gambiae',
    'gambiae_s form_m form': 'gambiae/coluzzii',
  };

  // Remove old control panel
  map.getControls().forEach((control) => {
    if (control?.getProperties().name === 'legend') {
      map.removeControl(control);
    }
  });

  if (speciesFilters.value.length > 0) {
    const pointLayer = map
      .getAllLayers()
      .find((l) => l.get('occurrence-data')) as VectorLayer<VectorSource>;

    if (pointLayer) {
      pointLayer.setStyle((feature) => {
        // Check for absence data
        const isAbsence = feature.get('binary_presence') === 'False' || 
                         feature.get('binary_presence') === false ||
                         feature.get('binaryPresence') === 'False' ||
                         feature.get('binaryPresence') === false;
        
        return getSpeciesStyle(
          feature.get('species'),
          selectedIds.includes(feature.get('id')),
          isAbsence
        );
      });
    }

    const legen = document.createElement('div');
    legen.className = 'ol-control-panel ol-unselectable ol-control';
    legen.style.bottom = '80px';
    legen.style.right = '0.5em';
    legen.style.border = '2px solid black';
    legen.style.padding = '5px';
    legen.style.lineHeight = '0.5';
    legen.style.maxHeight = '80%';
    legen.style.overflowY = 'auto';
    legen.innerHTML =
      '<span style="text-decoration: underline;"><b>Species</b>&nbsp;</span>';

    speciesFilters.value.forEach((species) => {
      const displayName = speciesDisplayMap[species] || species;

      const selspec = document.createElement('p');
      selspec.innerText = 'An. ' + displayName.toLowerCase();
      selspec.style.fontStyle = 'italic';
      selspec.style.fontWeight = 'bold';
      selspec.style.color =
        speciesStyles.find((x) => x.species === species)?.color ?? 'black';

      legen.appendChild(selspec);
    });

    const controlPanel = new Control({ element: legen });
    controlPanel.setProperties({ name: 'legend' });
    map.addControl(controlPanel);
  } else {
    const pointLayer = map
      .getAllLayers()
      .find((l) => l.get('occurrence-data')) as VectorLayer<VectorSource>;

    if (pointLayer) {
      pointLayer.setStyle((feature) => {
        const isSelected = selectedIds.includes(feature.get('id'));
        // Check for absence even when no species filter is applied
        const isAbsence = feature.get('binary_presence') === 'False' || 
                         feature.get('binary_presence') === false ||
                         feature.get('binaryPresence') === 'False' ||
                         feature.get('binaryPresence') === false;
        
        return createStyle('#038543', isSelected, isAbsence);
      });
    }
  }
};

export const removeAreaInteractions = (map: Map) => {
  map.removeInteraction(modify);
  map.removeInteraction(draw);
  map.removeInteraction(snap);
};

export const addAreaInteractions = (map: Map, dispatch: AppDispatch) => {
  const areaSelect = map.getAllLayers().find((l) => l.get('area-select'));
  const source = areaSelect?.getSource() as VectorSource;

  modify = new Modify({ source: source });
  modify.on('modifyend', (e) => {
    const geom = e.features.item(0).getGeometry() as SimpleGeometry;
    const coords = geom?.getCoordinates();
    if (coords && coords.length > 0) {
      dispatch(
        updateAreaFilter(
          coords[0].map((c: Coordinate) =>
            transform(c, 'EPSG:3857', 'EPSG:4326')
          )
        )
      );
    }
  });
  map.addInteraction(modify);

  draw = new Draw({
    source: source,
    type: 'Polygon',
    freehandCondition: never,
  });
  draw.on('drawend', (e) => {
    const geom = e.feature.getGeometry() as SimpleGeometry;
    const coords = geom?.getCoordinates();
    if (coords && coords.length > 0) {
      dispatch(
        updateAreaFilter(
          coords[0].map((c: Coordinate) =>
            transform(c, 'EPSG:3857', 'EPSG:4326')
          )
        )
      );
    }
  });
  map.addInteraction(draw);
  snap = new Snap({ source: source });
  map.addInteraction(snap);
};

export const updateSelectedPolygons = (
  map: Map,
  areaCoordinates: MapFilter<number[][]>
) => {
  // clear out old polygons
  const areaSelectLayer = map.getAllLayers().find((l) => l.get('area-select'));
  const source = areaSelectLayer?.getSource();
  (source as VectorSource)
    .getFeatures()
    .forEach((f) => (source as VectorSource).removeFeature(f));

  // draw the new one if it exists
  if (areaCoordinates.value.length > 0) {
    const coordinates = areaCoordinates.value.map((c) =>
      transform(c, 'EPSG:4326', 'EPSG:3857')
    );
    const polygon = new Polygon([coordinates]);
    (source as VectorSource).addFeature(new Feature({ geometry: polygon }));
  }
};