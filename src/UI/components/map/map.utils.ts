export const getPixelColorData = (rgba:any) => {
  return ((rgba[0] + rgba[1] + rgba[2])*0.1);
};

export function pixelHoverInteraction( e:any, layer:any ,getDataFunction:Function, targetHTML:any ) {
  if (e.dragging) {
    return;
  }
  const pixelData = layer.getData(e.pixel);
  targetHTML.innerText = pixelData ? getDataFunction(pixelData).toFixed(2) : '0.00';
}

export function unpackOverlays(map_layers:any){
  if (map_layers.length === 0 ){
    return [[],[]];
  }
  const worldLayer = map_layers.find( (l:any) => l.name === 'world');
  const overlayList =  map_layers.filter( (l:any) =>l.name !== 'world' );
  const worldMapLayers = worldLayer.overlays.map( (o:any) => ({
    ...o,
    sourceLayer:worldLayer.name, 
    sourceType:worldLayer.sourceType
  }));
  return [overlayList, worldMapLayers];
}
