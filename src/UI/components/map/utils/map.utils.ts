export function responseToGEOJSON(occurrenceData: any) {
  const geoJSONPoints = (occurrenceData || []).map((d: any) => ({
    type: 'Feature',
    geometry: d.site.location,
    properties: {
      name: d.site.name,
      year_start: d.year_start,
      n_all: d.sample.n_all,
      species: d.recorded_species.species.species,
      series: d.recorded_species.species.series,
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
