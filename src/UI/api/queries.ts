import { VectorAtlasFilters } from "../state/state.types";
import { NewSource } from "../components/sources/source_form";

export const occurrenceQuery = (skip: number, take: number, filters: VectorAtlasFilters) => {
   const queryFilters = {}

   Object.keys(filters).forEach(f => {
    if (f === "timeRange") {
      if (filters[f].value && filters[f].value.start) {
         queryFilters.startTimestamp = filters[f].value.start
      }
      if (filters[f].value && filters[f].value.end) {
         queryFilters.endTimestamp = filters[f].value.end
      }
    } else if (filters[f].value) {
       queryFilters[f] = filters[f].value === "empty" ? null : filters[f].value
    }
   })

  return `
query Occurrence {
   OccurrenceData(skip:${skip}, take:${take}, filters: ${JSON.stringify(
      queryFilters
  ).replace(/"([^"]+)":/g, '$1:')})
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

export const newSourceQuery = (source: NewSource) => {
   return `
   mutation CreateReference {
      createReference(input: {author: "${source.author}", citation: "${source.article_title}", journal_title: "${source.journal_title}", year: ${source.year}, published: ${source.published}, report_type: "${source.report_type}", v_data: ${source.v_data}})
      {citation}
    }
   `
}