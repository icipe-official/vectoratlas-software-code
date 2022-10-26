export function unpackOverlays(map_layers: any) {
  if (map_layers.length === 0) {
    return [[], []];
  }
  const map_layersVis = map_layers.map((l: any) => ({
    ...l,
    isVisible: true,
  }));
  const worldLayer = map_layersVis.find((l: any) => l.name === 'world');
  const overlayList = map_layersVis.filter((l: any) => l.name !== 'world');
  const worldMapLayers = worldLayer.overlays.map((o: any) => ({
    ...o,
    sourceLayer: worldLayer.name,
    sourceType: worldLayer.sourceType,
    isVisible: true,
  }));
  return overlayList.concat(worldMapLayers);
}

export function responseToGEOJSON(occurrenceData: any) {
  const geoJSONPoints = (occurrenceData || []).map((d: any) => ({
    type: 'Feature',
    geometry: d.site.location,
    properties: {
      name: d.site.name,
      year_start: d.year_start,
      n_all: d.sample.n_all,
    },
  }));
  const geoJSONFeatureCollection = {
    type: 'FeatureCollection',
    features: geoJSONPoints,
  };
  return JSON.stringify(geoJSONFeatureCollection);
}
