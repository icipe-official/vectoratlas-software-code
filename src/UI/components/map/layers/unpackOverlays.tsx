export function unpackOverlays(map_layers:any){
  if (map_layers.length === 0 ){
    return [[],[]];
  }
  const worldLayer = map_layers.find( l => l.name === 'world');
  const overlayList =  map_layers.filter( l =>l.name !== 'world' );
  const worldMapLayers = worldLayer.overlays.map( o => ({
    ...o,
    sourceLayer:worldLayer.name, 
    sourceType:worldLayer.sourceType
  }));
  return [overlayList, worldMapLayers];
}
