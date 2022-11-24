import { VectorAtlasFilters } from '../state/state.types';
import { NewSource } from '../components/sources/source_form';
import { queryFilterMapper } from './utils/queryFilterMapper';

export const occurrenceQuery = (
  skip: number,
  take: number,
  filters: VectorAtlasFilters
) => {
  const queryFilters = queryFilterMapper(filters);
  return `
query Occurrence {
   OccurrenceData(skip:${skip}, take:${take}, filters: ${JSON.stringify(
    queryFilters
  ).replace(/"([^"]+)":/g, '$1:')})
   {
      items {
         year_start
         id
         site {
            location
         }
         sample {
            n_all
         }
         recorded_species {
            species
         }
      }
      total
      hasMore
   }
}`;
};

export const fullOccurrenceQuery = (selectedIds: string[]) => {
  return `
query Occurrence {
   FullOccurrenceData(selectedIds:${JSON.stringify(selectedIds)})
   {
        id
         year_start
         month_start
         sample {
            n_all
            mossamp_tech_1
         }
         recorded_species {
            species
         }
         reference {
          author
          year
          citation
         }
         bionomics {
          adult_data
          larval_site_data
          season_given
          season_calc
         }
      }
   }`;
};

export const occurrenceCsvFilterQuery = (
  skip: number,
  take: number,
  filters: VectorAtlasFilters
) => {
  const queryFilters = queryFilterMapper(filters);

  return `
query Occurrence {
   OccurrenceCsvData(skip:${skip}, take:${take}, filters: ${JSON.stringify(
    queryFilters
  ).replace(/"([^"]+)":/g, '$1:')})
   {
      items
      total
      hasMore
   }
}`;
};

export const referenceQuery = (
  skip: number,
  take: number,
  orderBy: string,
  order: string,
  startId: number | null,
  endId: number | null,
  textFilter: string
) => {
  return `
    query Reference{
        allReferenceData(skip:${skip}, take:${take}, orderBy:"${orderBy}", order:"${order}", startId: ${startId}, endId: ${endId}, textFilter: "${textFilter}") {
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
};

export const newSourceQuery = (source: NewSource) => {
  return `
   mutation CreateReference {
      createReference(input: {author: "${source.author}", citation: "${source.article_title}", journal_title: "${source.journal_title}", year: ${source.year}, published: ${source.published}, report_type: "${source.report_type}", v_data: ${source.v_data}})
      {num_id}
    }
   `;
};
