import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import { responseToGEOJSON } from '../utils/map.utils';
import VectorLayer from 'ol/layer/Vector';
import { Circle, Style, Fill, Stroke } from 'ol/style';
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

let draw: Draw, snap: Snap, modify: Modify;

export const updateOccurrencePoints = (
  map: Map | null,
  occurrenceData: any[]
) => {
  const pointsLayer = map?.getAllLayers().find((l) => l.get('occurrence-data'));

  pointsLayer?.setSource(
    new VectorSource({
      features: new GeoJSON().readFeatures(responseToGEOJSON(occurrenceData), {
        featureProjection: 'EPSG:3857',
      }),
    })
  );
};

export const buildPointLayer = (occurrenceData: any[]) => {
  const pointLayer = new VectorLayer({
    source: new VectorSource({
      features: new GeoJSON().readFeatures(responseToGEOJSON(occurrenceData), {
        featureProjection: 'EPSG:3857',
      }),
    }),
    style: () => {
      return new Style({
        image: new Circle({
          radius: 7,
          fill: new Fill({
            color: '#038543',
          }),
        }),
      });
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

export const updateLegendForSpecies = (
  speciesFilters: MapFilter<string[]>,
  colorArray: string[],
  selectedIds: string[],
  map: Map | null
) => {
  const speciesStyles = (
    species: string,
    colorArray: string[],
    isSelected: boolean
  ) => {
    const ind = speciesFilters.value.indexOf(species);

    return new Style({
      image: new Circle({
        radius: 5,
        fill: new Fill({
          color: colorArray[ind],
        }),
        stroke: new Stroke({
          color: isSelected ? 'white' : 'black',
          width: isSelected ? 2 : 0.5,
        }),
      }),
    });
  };

  if (!map) {
    return;
  }

  // Remove old control panel
  map?.getControls().forEach(function (control) {
    if (control?.getProperties().name === 'legend') {
      map?.removeControl(control);
    }
  });

  if (speciesFilters.value.length > 0) {
    const pointLayer = map
      ?.getAllLayers()
      .find((l) => l.get('occurrence-data')) as VectorLayer<VectorSource>;

    if (pointLayer) {
      pointLayer.setStyle((feature) =>
        speciesStyles(
          feature.get('species'),
          colorArray,
          selectedIds.some((s) => s === feature.get('id'))
        )
      );
    }

    var legen = document.createElement('div');
    legen.className = 'ol-control-panel ol-unselectable ol-control';
    legen.style.bottom = '80px';
    legen.style.right = '0.5em';
    legen.style.border = '2px solid black';
    legen.style.padding = '5px';
    legen.style.lineHeight = '0.5';
    legen.style.maxHeight = '80%';
    legen.style.overflowY = 'auto';
    legen.innerHTML = '<span style = underline><b>Species</b>&nbsp;</span>';

    speciesFilters.value.forEach((species, i) => {
      const fixedColourMap: any = {
        gambiae: 'red',
        arabiensis: 'yellow',
        funestus: 'green',
      };
      var selspec = document.createElement('p');
      selspec.innerText = 'An. ' + species;
      selspec.style.fontStyle = 'italic';
      selspec.style.fontWeight = 'bold';

      selspec.style.color = fixedColourMap[species] ?? colorArray[i];
      legen.appendChild(selspec);
    });

    var controlPanel = new Control({
      element: legen,
    });
    controlPanel.setProperties({ name: 'legend' });
    map?.addControl(controlPanel);
  } else {
    const pointLayer = map
      ?.getAllLayers()
      .find((l) => l.get('occurrence-data')) as VectorLayer<VectorSource>;

    if (pointLayer) {
      pointLayer.setStyle(
        (feature) =>
          new Style({
            image: new Circle({
              radius: 5,
              fill: new Fill({
                color: '#038543',
              }),
              stroke: new Stroke({
                color: selectedIds.some((s) => s === feature.get('id'))
                  ? 'white'
                  : 'black',
                width: selectedIds.some((s) => s === feature.get('id'))
                  ? 2
                  : 0.5,
              }),
            }),
          })
      );
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
