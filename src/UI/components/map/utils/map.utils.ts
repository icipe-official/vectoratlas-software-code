export function responseToGEOJSON(
  occurrenceData: any,
  processedPoints: any[] = [],
) {
  let geoJSONPoints = (occurrenceData || []).map((d: any) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [
        d.location.coordinates[1], // Swap lat and long
        d.location.coordinates[0], // Swap long and lat
      ],
    },
    properties: {
      species: d.species,
      id: d.id,
      binary_presence: d.binary_presence,
    },
  }));

  geoJSONPoints = [...geoJSONPoints, ...processedPoints];
  processedPoints = []; // reset first
  processedPoints = [...geoJSONPoints]; // modify the ref
  const geoJSONFeatureCollection = {
    type: 'FeatureCollection',
    features: geoJSONPoints,
  };
  return JSON.stringify(geoJSONFeatureCollection);
}

export function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
