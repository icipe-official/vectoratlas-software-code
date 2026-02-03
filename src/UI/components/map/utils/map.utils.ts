import { normalizeSpeciesName, isDominantSpecies } from './speciesStyling';

export function responseToGEOJSON(
  occurrenceData: any,
  processedPoints: any[] = []
) {
  let geoJSONPoints = (occurrenceData || []).map((d: any) => {
    const cleanSpecies = normalizeSpeciesName(d.species);

    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          d.location.coordinates[1], // lon
          d.location.coordinates[0], // lat
        ],
      },
      properties: {
        id: d.id,
        species: cleanSpecies,          // normalized
        original_species: d.species,    // keep raw if needed
        binary_presence: d.binary_presence,
        isDominant: isDominantSpecies(cleanSpecies), // precomputed
      },
    };
  });

  geoJSONPoints = [...geoJSONPoints, ...processedPoints];
  processedPoints = [];
  processedPoints = [...geoJSONPoints];

  const geoJSONFeatureCollection = {
    type: 'FeatureCollection',
    features: geoJSONPoints,
  };

  return JSON.stringify(geoJSONFeatureCollection);
}

export function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
