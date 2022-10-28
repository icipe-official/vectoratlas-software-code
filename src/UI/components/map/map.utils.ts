export function unpackOverlays(map_layers: any) {
  if (map_layers.length === 0) {
    return [[], []];
  }
  const worldLayer = map_layers.find((l: any) => l.name === 'world');
  const overlayList = map_layers.filter((l: any) => l.name !== 'world');
  const worldMapLayers = worldLayer.overlays.map((o: any) => ({
    ...o,
    sourceLayer: worldLayer.name,
    sourceType: worldLayer.sourceType,
  }));
  return [overlayList, worldMapLayers];
}

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
