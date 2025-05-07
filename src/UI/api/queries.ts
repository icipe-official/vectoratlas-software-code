import {
  News,
  SpeciesInformation,
  UsersWithRoles,
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
         id
         location
         species
         binary_presence
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
         binary_presence
         sample {
            occurrence_n_tot
            sampling_occurrence_1
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
  filters: VectorAtlasFilters,
  generateDoi: boolean = false,
  downloaderName?: string, // Optional
  downloaderEmail?: string // Optional
) => {
  const queryFilters = queryFilterMapper(filters);
  const bounds = filters.areaCoordinates.value.map((c) => ({
    long: c[0],
    lat: c[1],
  }));

  return `
query Occurrence {
   OccurrenceCsvData(
     skip:${skip}, 
     take:${take}, 
     filters: ${JSON.stringify(queryFilters).replace(/"([^"]+)":/g, '$1:')}, 
     bounds: {
       locationWindowActive: ${bounds.length > 0 ? 'true' : 'false'}, 
       coords: ${JSON.stringify(bounds).replace(/"([^"]+)":/g, '$1:')}
     },
     generateDoi:${generateDoi},
     downloaderName:"${downloaderName}",
     downloaderEmail:"${downloaderEmail}"
   ) {
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

export const deleteSpeciesInformationMutation = (id: string) => {
  return `
   mutation {
      deleteSpeciesInformation(id: "${id}")
   }`;
};

export const datasetById = (id: string) => {
  return `
   query {
    datasetById(id: "${id}") {
      UpdatedBy
      UpdatedAt
      ReviewedBy
      ReviewedAt
      ApprovedBy
      ApprovedAt
      status
      title
      description
      doi
      dataSource
      dataType
      datasetLoc
      region
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

export const deleteNewsMutation = (id: string) => {
  return `
   mutation {
      deleteNews(id: "${id}")
   }`;
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
      eventDownload
      countries
      uniqueViews
      pageViews
      recordsTotal
    }
  }`;
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

export const disableNotificationsMutation = (
  userId: string,
  disable: boolean
) => {
  return `
  mutation {
    disableNotifications(userId: "${userId}", disable: ${disable})
  }
  `;
};

export const triggerModelTransform = (
  displayName: String,
  maxValue: number,
  blobLocation: String,
  uploadedModelId: String
) => {
  const modelName = displayName.replaceAll(' ', '_');
  return `
  query {
    postProcessModel(
      modelName: "${modelName}",
      displayName: "${displayName}",
      maxValue: ${maxValue},
      blobLocation: "${blobLocation},"
      uploadedModelId: "${uploadedModelId}"
    ) {
      status
    }
  }
  `;
};

export const getAllUsersWithRoles = () => {
  return `
    query {
      allUserRoles {
        email
        auth0_id
        is_admin
        is_editor
        is_reviewer
        is_uploader
      }
     }
     `;
};

export const updateUserRoles = (userRoles: UsersWithRoles) => {
  return `
    mutation {
      updateUserRoles(input: {
        auth0_id: "${userRoles.auth0_id}"
        is_admin: ${userRoles.is_admin}
        is_editor: ${userRoles.is_editor}
        is_uploader: ${userRoles.is_uploader}
        is_reviewer: ${userRoles.is_reviewer}
      }) {
        auth0_id
        is_admin
        is_editor
        is_reviewer
        is_uploader
      }
     }
     `;
};

export const uploadedDatasetById = (id: string) => {
  return `
   query {
    uploadedDatasetById(id: "${id}") {
        id
        owner
        creation
        updater
        modified
        title
        description
        author
        affiliated_institution
        dataset_type
        is_validated
        uploaded_file_name
        uploaded_file_name_primary_reviewed
        uploaded_file_name_tertiary_reviewed
        converted_file_name
        provided_doi   
        is_doi_requested 
        status
        last_status_update_date
        uploader_email
        uploader_name
        primary_reviewers
        tertiary_reviewers
        is_reupload_requested
        reupload_requested_date
        reupload_request_comment
        is_reuploaded
        reupload_date
        is_tertiary_review_reassigned
        reassigned_tertiary_reviewers
        uploaded_dataset_log {
          id
          action_type
          action_details
          action_date
          action_taker
        }
        doi {
          id
          doi_link
        }
      }
    }
    `;
};

export const getAllUploadedDatasets = () => {
  return `
    query {
       allUploadedDatasets {
         id
         title
         last_upload_date
         status
         primary_reviewers
         tertiary_reviewers
         is_reupload_requested
         reupload_requested_date
         reupload_request_comment
         is_reuploaded
         reupload_date
         source_country
         dataset_type
       }
     }
     `;
};

export const getUploadedDatasetsByUploader = (uploader: string) => {
  return `
    query {
        uploadedDatasetsByUploader(uploader: "${uploader}")  {
         id
         title
         last_upload_date
         status
         primary_reviewers
         tertiary_reviewers
         is_reupload_requested
         reupload_requested_date
         reupload_request_comment
         is_reuploaded
         reupload_date
         dataset_type
         source_country
       }
     }
     `;
};

export const getDOIsByStatus = (status: string) => {
  return `
    query {
       allDoisByStatus(status: "${status}")  {
         id
         doi_link
         source_type
         title
         creation
         approval_status
       }
     }
     `;
};

export const getDOIs = () => {
  return `
    query {
       allDois {
         id
         doi_link
         source_type
         title
         creation
         approval_status
       }
     }
     `;
};

export const getDoiById = (id: string) => {
  return `
   query {
    doiById(id: "${id}") {
        id,
        creation
        updater
        modified
        doi_link
        source_type
        publication_year
        title
        description
        approval_status
        source_type
        resolving_url
        doi_id
        is_draft
        comments 
        doi_link   
        status_updated_on
        uploaded_dataset {
          id
          title
        }
      }
    }
    `;
};

export const approveDoi = (
  id: string,
  comments?: string,
  recipients?: string[]
) => {
  return `
   query {
    approveDoi(id: "${id}", comments: "${comments}", recipients: "${recipients}") {
        id
        approval_status
      }
    }
    `;
};

export const rejectDoi = (
  id: string,
  comments?: string,
  recipients?: string[]
) => {
  return `
  query {
   rejectDoi(id: "${id}", comments: "${comments}", recipients: "${recipients}") {
       id
       approval_status
     }
   }
   `;
};

export const getCommunicationLogById = (id: string) => {
  return `
  query {
   communicationLogById(id: "${id}") {
       id
       subject
       communication_date
       channel_type
       message_type
       message
       sent_date
       sent_status
       recipients
       reference_entity_type
       reference_entity_name
       error_description
     }
   }
   `;
};

export const getCommunicationLogs = () => {
  return `
    query {
       allCommunicationLogs {
         id
         subject
         communication_date,
         message_type
         sent_status
         recipients
       }
     }
     `;
};

export const allCommunicationLogsBySentStatus = (sentStatus: string) => {
  return `
    query {
       allCommunicationLogsBySentStatus(sentStatus: "${sentStatus}") {
         id
         communication_date
         message_type
         sent_status
         recipients
       }
     }
     `;
};

export const uploadedModelById = (id: string) => {
  return `
   query {
    uploadedModelById(id: "${id}") {
        id
        owner
        creation
        updater
        modified
        title
        description
        author
        affiliated_institution 
        uploaded_file_name  
        provided_doi   
        is_doi_requested 
        status
        last_status_update_date
        uploader_email
        uploader_name 
        is_reupload_requested
        reupload_requested_date
        reupload_request_comment
        is_reuploaded
        reupload_date
        uploaded_model_log {
          id
          action_type
          action_details
          action_date
          action_taker
        }
        doi {
          id
          doi_link
        }
      }
    }
    `;
};

export const getAllUploadedModels = () => {
  return `
    query {
       allUploadedModels {
         id
         title
         last_upload_date
         description
         status
         is_reupload_requested
         reupload_requested_date
         reupload_request_comment
         is_reuploaded
         reupload_date
         source_country 
       }
     }
     `;
};

export const getUploadedModelsByUploader = (uploader: string) => {
  return `
    query {
        uploadedModelsByUploader(uploader: "${uploader}")  {
         id
         title
         last_upload_date
         description
         status
         primary_reviewers
         tertiary_reviewers
         is_reupload_requested
         reupload_requested_date
         reupload_request_comment
         is_reuploaded
         reupload_date
         dataset_type
         source_country
       }
     }
     `;
};
