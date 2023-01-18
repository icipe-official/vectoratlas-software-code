import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import { responseToGEOJSON } from '../utils/map.utils';
import VectorLayer from 'ol/layer/Vector';
import { Circle, Style, Fill } from 'ol/style';

export const updateOccurrencePoints = (map, occurrenceData) => {
  const pointsLayer = map?.getAllLayers().find((l) => l.get('occurrence-data'));

  pointsLayer?.setSource(
    new VectorSource({
      features: new GeoJSON().readFeatures(responseToGEOJSON(occurrenceData), {
        featureProjection: 'EPSG:3857',
      }),
    })
  );
};

export const buildPointLayer = (occurrenceData) => {
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
