export function responseToGEOJSON(occurrenceData: any) {
  const geoJSONPoints = (occurrenceData || []).map((d: any) => ({
    type: 'Feature',
    geometry: d.site.location,
    properties: {
      species: d.recorded_species.species,
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
