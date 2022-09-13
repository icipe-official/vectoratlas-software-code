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
