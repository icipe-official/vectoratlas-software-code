export const occurrenceQuery = (skip: number, take: number) => {
  return `query Occurrence {
   OccurrenceData(skip:${skip}, take:${take})
   {
   items{
         year_start
         site{
         location
         }
      sample{
         n_all
      }
      }
      total
      hasMore
   }
   }`;
};
