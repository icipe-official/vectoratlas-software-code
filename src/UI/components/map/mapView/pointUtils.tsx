import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import { responseToGEOJSON } from '../utils/map.utils';
import VectorLayer from 'ol/layer/Vector';
import { Circle, Style, Fill } from 'ol/style';
import Control from 'ol/control/Control';
import Map from 'ol/Map';
import { MapFilter } from '../../../state/state.types';

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

export const updateLegendForSpecies = (
  speciesFilters: MapFilter<string[]>,
  colorArray: string[],
  map: Map | null
) => {
  const speciesStyles = (species: string, colorArray: string[]) => {
    const ind = speciesFilters.value.indexOf(species);

    return new Style({
      image: new Circle({
        radius: 7,
        fill: new Fill({
          color: colorArray[ind],
        }),
      }),
    });
  };

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
        speciesStyles(feature.get('species'), colorArray)
      );
    }

    var legen = document.createElement('div');
    legen.className = 'ol-control-panel ol-unselectable ol-control';
    legen.style.bottom = '80px';
    legen.style.right = '0.5em';
    legen.style.border = '2px solid black';
    legen.style.padding = '5px';
    legen.style.lineHeight = '0.5';
    legen.innerHTML = '<span style = underline><b>Species</b>&nbsp;</span>';

    speciesFilters.value.forEach((species, i) => {
      var selspec = document.createElement('p');
      selspec.innerText = species;
      selspec.style.textDecoration = 'underline';
      selspec.style.fontStyle = 'italic';
      selspec.style.fontWeight = 'bold';
      selspec.style.color = colorArray[i];

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
        () =>
          new Style({
            image: new Circle({
              radius: 7,
              fill: new Fill({
                color: '#038543',
              }),
            }),
          })
      );
    }
  }
};
