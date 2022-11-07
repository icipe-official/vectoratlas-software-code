export const occurrenceQuery = (skip: number, take: number) => {
  return `
query Occurrence {
   OccurrenceData(skip:${skip}, take:${take})
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

export const referenceQuery = () => {
   return `
    query Reference{
        allReferenceData {
            author
            article_title
            journal_title
            citation
            year
            published
            report_type
            v_data

        }
        
    }
`;

}