// Opacity Control Functionality:  
export function updateOpacity(layer:any, opacityInput:any, opacityOutput:any) {
  const opacity = parseFloat(opacityInput.value);
  layer.setOpacity(opacity);
  opacityOutput.innerText = opacity.toFixed(2);
}
