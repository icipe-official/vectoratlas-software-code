export const getPixelColorData = (rgba: any) => {
  return (rgba[0] + rgba[1] + rgba[2]) * 0.1;
};

export function pixelHoverInteraction(
  e: any,
  layer: any,
  getDataFunction: Function,
  targetHTML: any
) {
  if (e.dragging) {
    return;
  }
  const pixelData = layer.getData(e.pixel);
  targetHTML.innerText = pixelData
    ? getDataFunction(pixelData).toFixed(2)
    : '0.00';
}

export function responseToGEOJSON(graphqlLocationObject){
  var pointGeoJSONArray = [];
  for (let i = 0; i < graphqlLocationObject.data.allGeoData.length; i++) {
    const graphqlPointObject = graphqlLocationObject.data.allGeoData[i];
    const pointGeoJSON = 
    { type: 'Feature',
      geometry: {
        type: 'Point', 
        coordinates: [graphqlPointObject.longitude, graphqlPointObject.latitude]
      },
      properties: {
        arbData: graphqlPointObject.value
      }
    };
    pointGeoJSONArray.push(pointGeoJSON);
  }
  const geoJSONFeatureCollection = 
  {type: 'FeatureCollection',
    features: pointGeoJSONArray
  };
  return JSON.stringify(geoJSONFeatureCollection);
}
