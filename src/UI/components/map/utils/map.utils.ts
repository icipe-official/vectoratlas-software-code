export function responseToGEOJSON(occurrenceData: any) {
  const geoJSONPoints = (occurrenceData || []).map((d: any) => ({
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
    },
  }));

  const geoJSONFeatureCollection = {
    type: 'FeatureCollection',
    features: geoJSONPoints,
  };
  return JSON.stringify(geoJSONFeatureCollection);
}

export function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
