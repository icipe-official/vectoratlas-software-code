export const locationsQuery = `query Occurrence {
  allGeoData { year_start, site { name, longitude, latitude } }
}`;
