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

export const referenceQuery = (skip: number, take: number) => {
   return `
    query Reference{
        allReferenceData(skip:${skip}, take:${take}) {
         items{author
            article_title
            journal_title
            citation
            year
            published
            report_type
            v_data
            num_id

        }
    total
    hasMore
  }

    }
`;

}