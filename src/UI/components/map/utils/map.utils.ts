import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';

/**
 * Creates OpenLayers Features directly from the raw occurrence data.
 * This completely avoids the expensive JSON.stringify -> GeoJSON.parse cycle.
 */
export function createFeaturesFromData(
  occurrenceData: any[]
): Feature<Point>[] {
  if (!occurrenceData || occurrenceData.length === 0) return [];

  return occurrenceData.map((d: any) => {
    // Your original code swapped these.
    // fromLonLat expects [longitude, latitude].
    const lon = d.location.coordinates[1];
    const lat = d.location.coordinates[0];

    // Create the geometry directly in EPSG:3857 (Web Mercator)
    const feature = new Feature({
      geometry: new Point(fromLonLat([lon, lat])),
    });

    // Set all properties at once
    feature.setProperties({
      species: d.species,
      id: d.id,
      binary_presence: d.binary_presence,
      country: d.country,
      year_start: d.year_start,
      is_adult: d.is_adult,
      is_larval: d.is_larval,
      // You can also assign the entire object if you need deeper fields like bionomics later:
      // rawData: d
    });

    return feature;
  });
}

export function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
