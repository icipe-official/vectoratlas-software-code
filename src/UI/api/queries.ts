export const occurrenceQuery = (
  skip: number,
  take: number,
  filters: {
    country: string[];
    species: string[];
    startTimestamp: number;
    endTimestamp: number;
    isLarval: (boolean | string)[];
    isAdult: (boolean | string)[];
    season: string[];
    isControl: (boolean | string)[];
  }
) => {
  return `
query Occurrence {
   OccurrenceData(skip:${skip}, take:${take}, filters: ${filters})
   {
      items {
         year_start
         site {
            location
         }
         sample {
            n_all
         }
         recorded_species {
            species {
               species
               series
            }
         }
      }
      total
      hasMore
   }
}`;
};
