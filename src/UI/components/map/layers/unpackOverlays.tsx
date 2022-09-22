export function unpackOverlays(map_layers:any){
  const overlayList:any = [];
  const baseMapList:any = [];
  for (let layer = 0; layer < map_layers.length ; layer++)
    if (map_layers[layer].name == 'world'){
      for (let overlay = 0; overlay < map_layers[layer].overlays.length; overlay++){
        const unpackedOverlay = {...map_layers[layer].overlays[overlay], sourceLayer: map_layers[layer].name, sourceType: map_layers[layer].sourceType}; 
        baseMapList.push(unpackedOverlay);
      }
    }
    else{
      overlayList.push(map_layers[layer]);
    }
  return [overlayList, baseMapList];
}
