import {
  News,
  SpeciesInformation,
  VectorAtlasFilters,
} from '../state/state.types';
import { NewSource } from '../components/sources/source_form';
import { queryFilterMapper } from './utils/queryFilterMapper';
import { sourceStringValidation } from './utils/sourceStringValidation';

export const occurrenceQuery = (
  skip: number,
  take: number,
  filters: VectorAtlasFilters
) => {
  const queryFilters = queryFilterMapper(filters);
  const bounds = filters.areaCoordinates.value.map((c) => ({
    long: c[0],
    lat: c[1],
  }));
  return `
query Occurrence {
   OccurrenceData(skip:${skip}, take:${take}, filters: ${JSON.stringify(
    queryFilters
  ).replace(/"([^"]+)":/g, '$1:')}, bounds: {locationWindowActive: ${
    bounds.length > 0 ? 'true' : 'false'
  }, coords: ${JSON.stringify(bounds).replace(/"([^"]+)":/g, '$1:')}})
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
  ).replace(/"([^"]+)":/g, '$1:')}, bounds: {locationWindowActive: false})
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
  const validatedSourceString = sourceStringValidation(source);
  const year = new Date(source.year).getFullYear();
  return `
   mutation CreateReference {
      createReference(input: {author: "${validatedSourceString.author}", article_title: "${validatedSourceString.article_title}", journal_title: "${validatedSourceString.journal_title}", citation: "${validatedSourceString.citation}",  year: ${year}, published: ${validatedSourceString.published}, report_type: "${validatedSourceString.report_type}", v_data: ${validatedSourceString.v_data}})
      {num_id}
    }
   `;
};

export const upsertSpeciesInformationMutation = (
  speciesInformation: SpeciesInformation
) => {
  return `
   mutation {
      createEditSpeciesInformation(input: {
         ${speciesInformation.id ? 'id: "' + speciesInformation.id + '"' : ''}
         name: "${speciesInformation.name}"
         shortDescription: "${speciesInformation.shortDescription}"
         description: """${speciesInformation.description}"""
         speciesImage: "${speciesInformation.speciesImage}"
      }) {
         name
         id
         description
         shortDescription
         speciesImage
      }
   }`;
};

export const speciesInformationById = (id: string) => {
  return `
   query {
      speciesInformationById(id: "${id}") {
        id
        name
        shortDescription
        description
        speciesImage
      }
    }
    `;
};

export const allSpecies = () => {
  return `
   query {
      allSpeciesInformation{
        id
        name
        shortDescription
        description
        speciesImage
      }
    }
    `;
};

export const upsertNewsMutation = (news: News) => {
  return `
    mutation {
       createEditNews(input: {
          ${news.id ? 'id: "' + news.id + '"' : ''}
          title: "${news.title}"
          summary: "${news.summary}"
          article: """${news.article}"""
          image: "${news.image}"
       }) {
          title
          id
          summary
          article
          image
       }
    }`;
};

export const newsById = (id: string) => {
  return `
    query {
       newsById(id: "${id}") {
         id
         title
         summary
         article
         image
       }
     }
     `;
};

export const getAllNews = () => {
  return `
    query {
       allNews {
         id
         title
         summary
         image
       }
     }
     `;
};

export const getAllNewsIds = () => {
  return `
     query {
        allNews {
          id
        }
      }
      `;
};

export const getHomepageAnalytics = (
  startAt: number,
  endAt: number,
  unit: string,
  timezone: string
) => {
  return `
  query HomepageAnalytics {
    getHomepageAnalytics(startAt:${startAt}, endAt:${endAt}, unit: "${unit}", timezone: "${timezone}") {
      events
      countries
      uniqueViews
      pageViews
    }
  }`
};

export const roleRequestMutation = (
  requestReason: string,
  rolesRequested: string[],
  email: string
) => {
  const rolesRequestedString = rolesRequested.join('", "');
  return `
  mutation {
    requestRoles(requestReason: "${requestReason}", rolesRequested: ["${rolesRequestedString}"], email: "${email}")
  }
  `;
};

export const triggerModelTransform = (
  displayName: String,
  maxValue: number,
  blobLocation: String
) => {
  const modelName = displayName.replaceAll(' ', '_');
  return `
  query {
    postProcessModel(
      modelName: "${modelName}",
      displayName: "${displayName}",
      maxValue: ${maxValue},
      blobLocation: "${blobLocation}"
    ) {
      status
    }
  }
  `;
};
