export const locationsQuery = `{
  allGeoData{
     year_start,
     site{
        name,
        location
     },
     sample{
      n_all
     }
    }
  }`;
