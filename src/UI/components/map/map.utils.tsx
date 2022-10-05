import { geoJSON } from "leaflet";

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

export const blankGeoJson = {
  type: 'FeatureCollection',
  features: {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [0, 0],
    },
    properties: {
      name: 'Blank',
      yearStart: '0000',
    },
  },
};

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

//   var pointGeoJSONArray = [];
//   if (graphqlLocationObject.length === 0) {
//     return blankGeoJson;
//   }
//   for (
//     let i = 0;
//     i < graphqlLocationObject.data.OccurrenceData.items.length;
//     i++
//   ) {
//     const graphqlPointObject =
//       graphqlLocationObject.data.OccurrenceData.items[i];
//     const pointGeoJSON = {
//       type: 'Feature',
//       geometry: graphqlPointObject.site.location,
//       properties: {
//         name: graphqlPointObject.site.name,
//         year_start: graphqlPointObject.year_start,
//         n_all: graphqlPointObject.sample.n_all,
//       },
//     };
//     pointGeoJSONArray.push(pointGeoJSON);
//   }
//   const geoJSONFeatureCollection = {
//     type: 'FeatureCollection',
//     features: pointGeoJSONArray,
//   };
//   return JSON.stringify(geoJSONFeatureCollection);
}
