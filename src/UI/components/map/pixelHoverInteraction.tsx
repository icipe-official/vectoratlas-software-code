export function pixelHoverInteraction( e:any, layer:any ,getDataFunction:Function, targetHTML:any ) {
  if (e.dragging) {
    return;
  }
  const pixelData = layer.getData(e.pixel);
  targetHTML.innerText = pixelData ? getDataFunction(pixelData).toFixed(2) : '0.00';
}
