export function unpackOverlays(map_layers:any){
  if (map_layers.length === 0 ){
    return [[],[]];
  }
  console.log(map_layers);
  const worldLayer = map_layers.find( l => l.name === 'world');
  console.log(worldLayer);
  const overlayList =  map_layers.filter( l =>l.name !== 'world' );
  console.log(overlayList);
  const worldMapLayers = worldLayer.overlays.map( o => ({
    ...o,
    sourceLayer:worldLayer.sourceLayer, 
    sourceType:worldLayer.sourceType
  }));
  console.log(worldMapLayers);
  return [overlayList, worldMapLayers];
}
