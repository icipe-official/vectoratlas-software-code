import { Category } from '@mui/icons-material';
import { Field, Fields, FieldType } from '../importWizard/types';

export const OccurrenceFields: Field<any>[] = [
  {
    label: 'Country',
    key: 'country',
    description: 'Country where the study was conducted',
    type: 'Select',
    options: [
      { label: 'Kenya', value: 'kenya' },
      { label: 'Uganda', value: 'uganda' },
    ],
    required: false,
    unique: false,
  },
  {
    label: 'Site',
    key: 'site',
    description: 'Site name where the mosquito sample was collected.',
    type: 'Text',
    required: false,
    unique: false,
  },
  {
    label: 'Latitude 1',
    key: 'latitude_1',
    description: 'Latitude of first site coordinates in decimal degrees',
    type: 'Number',
  },
  {
    label: 'Longitude 1',
    key: 'longitude_1',
    description: 'Longitude of first site coordinates in decimal degrees.',
    type: 'Number',
  },
  {
    label: 'Latitude 2',
    key: 'latitude_2',
    description: 'Latitude of second site coordinates in decimal degrees',
    type: 'Number',
  },
  {
    label: 'Longitude 2',
    key: 'longitude_2',
    description: 'Longitude of second site coordinates in decimal degrees.',
    type: 'Number',
  },
  {
    label: 'Latitude 3',
    key: 'latitude_3',
    description: 'Latitude of third site coordinates in decimal degrees',
    type: 'Number',
  },
  {
    label: 'Longitude 3',
    key: 'longitude_3',
    description: 'Longitude of third site coordinates in decimal degrees.',
    type: 'Number',
  },
  {
    label: 'Latitude 4',
    key: 'latitude_4',
    description: 'Latitude of fourth site coordinates in decimal degrees',
    type: 'Number',
  },
  {
    label: 'Longitude 4',
    key: 'longitude_4',
    description: 'Longitude of fourth site coordinates in decimal degrees.',
    type: 'Number',
  },
  {
    label: 'Latitude 5',
    key: 'latitude_5',
    description: 'Latitude of fifth site coordinates in decimal degrees',
    type: 'Number',
  },
  {
    label: 'Longitude 5',
    key: 'longitude_5',
    description: 'Longitude of fifth site coordinates in decimal degrees.',
    type: 'Number',
  },
  {
    label: 'Latitude 6',
    key: 'latitude_6',
    description: 'Latitude of sixth site coordinates in decimal degrees',
    type: 'Number',
  },
  {
    label: 'Longitude 6',
    key: 'longitude_6',
    description: 'Longitude of sixth site coordinates in decimal degrees.',
    type: 'Number',
  },
  {
    label: 'Latitude 7',
    key: 'latitude_7',
    description: 'Latitude of seventh site coordinates in decimal degrees',
    type: 'Number',
  },
  {
    label: 'Longitude 7',
    key: 'longitude_7',
    description: 'Longitude of seventh site coordinates in decimal degrees.',
    type: 'Number',
  },
  {
    label: 'Latitude 8',
    key: 'latitude_8',
    description: 'Latitude of eighth site coordinates in decimal degrees',
    type: 'Number',
  },
  {
    label: 'Longitude 8',
    key: 'longitude_8',
    description: 'Longitude of eighth site coordinates in decimal degrees.',
    type: 'Number',
  },
  {
    label: 'Confidence in Georef',
    key: 'confidence_in_georef',
    description:
      'The data abstractor assigns confidence in the location of the coordinates they have estimated: within 5km / between 5 - 10km / greater than 10km. We use this field only where the site cannot be found in a georeferencing source and when we are estimating the coordinates using a map or peripheral site information in the source.',
    type: 'String',
  },
  {
    label: 'Area Type',
    key: 'area_type',
    description:
      'The geographical area represented by the sampling location(s). Refer to the ‘Definitions’ tab of the abstraction template for a list of the options and definitions.',
    type: 'String',
  },
  {
    label: 'Georef Source',
    key: 'georef_source',
    description:
      'When the site name and corresponding coordinates have been found listed in the original article, source of data or from a mapping resource and its location confirmed to be accurate, indicate from which resource the site was found (e.g., the original paper, google maps, etc.).',
    type: 'String',
  },
  {
    label: 'Admin Level 1',
    key: 'admin_level_1',
    description:
      'The highest administration level after Country. In Africa, this may be Region, Province, District, Division etc. (see https://en.wikipedia.org/wiki/List_of_administrative_divisions_by_country).',
    type: 'String',
    required: true,
  },
  {
    label: 'Admin Level 2',
    key: 'admin_level_2',
    description: 'The highest administration level after Admin level_1. ',
    type: 'String',
  },
  {
    label: 'Site Notes',
    key: 'site_notes',
    description:
      'Free text additional information about the site and how co-ordinates were obtained.',
    type: 'String',
  },

  {
    label: 'Source ID',
    key: 'source_id',
    description: 'Unique Vector Atlas source identifier ',
    type: 'String',
  },
  {
    label: 'Citation DOI',
    key: 'citation_doi',
    description:
      'Unique Digital Object Identifier from the source. This maybe the journal article, or the DOI for a published dataset',
    type: 'String',
  },
  {
    label: 'Author',
    key: 'author',
    description: 'Surname of first author',
    type: 'String',
  },
  {
    label: 'Article Title',
    key: 'article_title',
    description: 'Full article title',
    type: 'String',
  },
  {
    label: 'Journal Title',
    key: 'journal_title',
    description: 'Full Journal Title',
    type: 'String',
  },
  {
    label: 'Publication Year',
    key: 'publication_year',
    description: 'Year the article was published',
    type: 'Number',
  },
  {
    label: 'Study Sampling Design',
    key: 'study_sampling_design',
    description:
      'Enter the study or sampling design if provided by author. Refer to the ‘Definitions’ tab of the abstraction template for a list of the options and definitions.',
    type: 'String',
  },
  {
    label: 'Personal Communication',
    key: 'personal_communication',
    description: 'Yes/no. Is this data row source personal communication?',
    type: 'String',
  },
  {
    label: 'Contact Authors',
    key: 'contact_authors',
    description:
      'Yes/no. Is there potential to obtain further information by contacting the author?',
    type: 'String',
  },
  {
    label: 'Source Notes',
    key: 'source_notes',
    description:
      'Free text additional information about the source and details of reason to contact author.',
    type: 'String',
  },
  {
    label: 'Insecticide Control',
    key: 'insecticide_control',
    description:
      'Yes/No/Na. Indicate whether insecticide-based control methods are in place (previously implemented or implemented as part of the referenced study) at the specified location and for the specified time period.',
    type: 'String',
  },
  {
    label: 'Control Type',
    key: 'control_type',
    description:
      'If ‘yes’ to insecticide control field, indicate the insecticide control method. Refer to the ‘Definitions’ tab of the abstraction template for a list of the options and definitions',
    type: 'String',
  },
  {
    label: 'ITN Use',
    key: 'itn_use',
    description:
      'Yes/No/Na. Where ITNs have been distributed, they may not always be used, especially during the warmer months. Indicate here if the source indicates good or non-use in the study community.',
    type: 'String',
  },
  {
    label: 'Control Notes',
    key: 'control_notes',
    description:
      'Free text additional information about the insecticide control',
    type: 'String',
  },
  {
    label: 'Sampling Occurrence 1',
    key: 'sampling_occurrence_1',
    description:
      'The sampling method reported that generated the most mosquitoes',
    type: 'String',
  },
  {
    label: 'Occurrence N 1',
    key: 'occurrence_n_1',
    description:
      'The number of mosquitoes reported for sampling occurrence_1. If the sampling method DID NOT CATCH specimens from a species, report it here by listing ‘0’.',
    type: 'Number',
  },
  {
    label: 'Sampling Occurrence 2',
    key: 'sampling_occurrence_2',
    description:
      'The sampling method reported that generated the second most mosquitoes',
    type: 'String',
  },
  {
    label: 'Occurrence N 2',
    key: 'occurrence_n_2',
    description:
      'The number of mosquitoes reported for sampling occurrence_2. If the sampling method DID NOT CATCH specimens from a species, report it here by listing ‘0’.',
    type: 'Number',
  },
  {
    label: 'Sampling Occurrence 3',
    key: 'sampling_occurrence_3',
    description:
      'The sampling method reported that generated the third most mosquitoes',
    type: 'String',
  },
  {
    label: 'Occurrence N 3',
    key: 'occurrence_n_3',
    description:
      'The number of mosquitoes reported for sampling occurrence_3. If the sampling method DID NOT CATCH specimens from a species, report it here by listing ‘0’.',
    type: 'Number',
  },
  {
    label: 'Sampling Occurrence 4',
    key: 'sampling_occurrence_4',
    description:
      'The sampling method reported that generated the fourth most mosquitoes ',
    type: 'String',
  },
  {
    label: 'Occurrence N 4',
    key: 'occurrence_n_4',
    description:
      'The number of mosquitoes reported for sampling occurrence_4. If the sampling method DID NOT CATCH specimens from a species, report it here by listing ‘0’.',
    type: 'Number',
  },
  {
    label: 'Occurrence N Total',
    key: 'occurrence_n_total',
    description:
      'The total number of mosquitoes reported for all sampling methods',
    type: 'Number',
  },
  {
    label: 'Occurrence Notes',
    key: 'occurrence_notes',
    description:
      'Where there are more than three sampling methods, report any additional ones in the notes alongside the number of mosquitoes collected, including where no mosquitoes were captured.',
    type: 'String',
  },
  {
    label: 'Binary Presence',
    key: 'binary_presence',
    description:
      'Yes/no. Indicate ‘yes’ if the source indicates the presence of a species at the given time and place (i.e., that data row), even if we have positive numbers in the n_1, n_2, or n-3 columns.',
    type: 'Boolean',
  },
  {
    label: 'Binary Absence',
    key: 'binary_absence',
    description:
      'Yes/no. Indicate ‘yes’ if the source indicates the absence of a species at the given time and place (i.e., that data row) for all sampling methods used in the study.',
    type: 'Boolean',
  },
  {
    label: 'Abundance Data in a Graph',
    key: 'abundance_data_in_a_graph',
    description:
      'Yes/no/na. We do not estimate numbers collected from graphs in the source. However, indicate here if there is such a graph in the source so we can go back to the author and ask for the raw data.',
    type: 'String',
  },
  {
    label: 'Month Start',
    key: 'month_start',
    description: 'Survey start month.',
    type: 'String',
  },
  {
    label: 'Month End',
    key: 'month_end',
    description: 'Survey end month.',
    type: 'String',
  },
  {
    label: 'Year Start',
    key: 'year_start',
    description: 'Survey start year.',
    type: 'Number',
  },
  {
    label: 'Year End',
    key: 'year_end',
    description: 'Survey end year.',
    type: 'Number',
  },
  {
    label: 'Season Given',
    key: 'season_given',
    description:
      'Rainy or dry season at the time of the survey, as indicated in the source',
    type: 'String',
  },
  {
    label: 'Season Calc',
    key: 'season_calc',
    description:
      'Rainy or dry season at the time of the survey, as derived from information on the general seasonal timings provided from the source or elsewhere',
    type: 'String',
  },
  {
    label: 'Rainfall Time',
    key: 'rainfall_time',
    description:
      'If the source provides information on the level of rainfall that relates to the time period represented in the sampling period shown, then enter it here. It must match the time period represented on that row.',
    type: 'String',
  },
  {
    label: 'Season Notes',
    key: 'season_notes',
    description:
      'Note anything here that relates to how you calculated the season.',
    type: 'String',
  },
  {
    label: 'Species',
    key: 'species',
    description:
      'The Anopheles species, species complex or subgroup. The drop-down list contains the most common African vectors listed first and then the remaining Anopheles species listed alphabetically. Accurately represent the species information as given, noting the cases outlined in the box on page 2 of the VA Protocol.',
    type: 'String',
  },
  {
    label: 'Species Notes',
    key: 'species_notes',
    description:
      'Note here anything that relates to the species or its identification, including any mention of additional molecular or chromosomal forms. However, the species listed must always accurately represent the data as we will search the data by species and not necessarily see the notes unless checking some query.',
    type: 'String',
  },
  {
    label: 'Species ID 1',
    key: 'species_id_1',
    description:
      'The first method used to identify species. Refer to the ‘Definitions’ tab of the abstraction template for a list of the options and definitions.',
    type: 'String',
  },
  {
    label: 'Species ID 2',
    key: 'species_id_2',
    description:
      'The second method used to identify species. Refer to the ‘Definitions’ tab of the abstraction template for a list of the options and definitions.',
    type: 'String',
  },
].map((el) => {
  return { category: 'Occurence', ...el, type: el.type as FieldType };
});

export const BionomicsFields: Field<any>[] = [
  // ...OccurrenceFields,
  {
    label: 'Roof',
    key: 'roof',
    description:
      'List if the majority of homes have a metal or thatched roof, or use ‘mix’ if there is a mix of metal and thatch in the study/survey area. Anything else, list as ‘other’ and give details in the housing notes. If no information is provided, leave blank.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Walls',
    key: 'walls',
    description:
      'List if the majority of homes have brick or mud walls, or use ‘mix’ if there is a mix of brick and mud in the study area. Anything else, list as ‘other’ and give details in the housing notes. If no information is provided, leave blank.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'House Screening',
    key: 'house_screening',
    description:
      'Add yes/no if the source indicates the majority of homes in the study area have or do not have screening (on windows and doors). Give details in the housing notes column.',
    type: 'Boolean',
    required: false,
    unique: false,
  },
  {
    label: 'Open Eaves',
    key: 'open_eaves',
    description:
      'Add yes/no if the source indicates the majority of homes in the study area have or do not have open eaves. Give details in the housing notes column.',
    type: 'Boolean',
    required: false,
    unique: false,
  },
  {
    label: 'Cooking',
    key: 'cooking',
    description:
      'List if the source indicates that the majority of homes in the survey area cook indoors or outdoors, and if further detail is given as to the use of open fires (inside or outside). If no information is provided, leave blank.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Housing Notes',
    key: 'housing_notes',
    description:
      'Add notes that relate to any housing metric captured or any other details that may be relevant to vector access to homes, disease transmission etc.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Common Occupation 1',
    key: 'common_occupation_1',
    description:
      'List any occupations as given in the source that best represent the sampling area referred to in the specific data row.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Common Occupation 2',
    key: 'common_occupation_2',
    description:
      'List any occupations as given in the source that best represent the sampling area referred to in the specific data row.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Common Occupation 3',
    key: 'common_occupation_3',
    description:
      'List any occupations as given in the source that best represent the sampling area referred to in the specific data row. If there are more than three occupations, or the occupation is not listed, use the ‘community notes’ column.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Outdoor Activities at Night',
    key: 'outdoor_activities_at_night',
    description:
      'Yes/No/Na. List ‘yes’ if the source reports that the community regularly engage in activities outdoors at night (socialising, watching sport, watch TV etc) during the period represented on the data row. List ‘no’ if the source specifically states the community does not engage in outdoor activities at night during the period of time indicated in the data row. Provide details in the ‘outdoor activities notes’ column. Leave blank if no information related to outdoor activities are reported.',
    type: 'Boolean',
    required: false,
    unique: false,
  },
  {
    label: 'Sleeping Outdoors',
    key: 'sleeping_outdoors',
    description:
      'Yes/No/Na. Indicate ‘yes’ if the source reports the community regularly sleeps outdoors during the period represented on the data row. List ‘no’ if the source specifically states the community does not sleep outdoors at night during the period of time indicated in the data row.',
    type: 'Boolean',
    required: false,
    unique: false,
  },
  {
    label: 'Outdoor Timings Hours',
    key: 'outdoor_timings_hours',
    description:
      'Provide details of the times (in 24-hour clock) or number of hours spent outdoors when provided by the source.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Outdoor Activities Notes',
    key: 'outdoor_activities_notes',
    description:
      'Provide any details of any outdoor activities given in the preceding columns that may be relevant to malaria transmission/vector activity at night.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Average Bedtime',
    key: 'average_bedtime',
    description:
      'Where given in the source, list the average bedtime of the community represented in the data row. Use 24-hour clock format.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Average Wake Time',
    key: 'average_wake_time',
    description:
      'Where given in the source, list the average awake time of the community represented in the data row. Use 24-hour clock format.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Time People Leave Home in Morning',
    key: 'time_people_leave_home_in_morning',
    description:
      'Where given in the source, list the average time members of the community represented in the data row leave their homes in the day. Use 24-hour clock format.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Hours Spent Away from Home Per Day',
    key: 'hours_spent_away_from_home_per_day',
    description:
      'Where given in the source, list the average time members of the community represented in the data row are away from home during the day.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Seasonal Labour',
    key: 'seasonal_labour',
    description:
      'Yes/No/Na. List ‘yes’ if the source indicates that significant numbers of the community represented in the data line engage in seasonal labour, i.e., leave their homes for a season to work in forestry, agriculture etc. Provide details in the community notes column.',
    type: 'Boolean',
    required: false,
    unique: false,
  },
  {
    label: 'Community Notes',
    key: 'community_notes',
    description:
      'List any details that relate to the entries in the community section. ',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Forest',
    key: 'forest',
    description:
      'Yes/no/na. Does the source indicate forest in the sampling location?',
    type: 'Boolean',
    required: false,
    unique: false,
  },
  {
    label: 'Farming',
    key: 'farming',
    description:
      'Does the source indicate forest in the sampling location? Refer to the ‘Definitions’ tab of the abstraction template for a list of the options.',
    type: 'Boolean',
    required: false,
    unique: false,
  },
  {
    label: 'Farming Notes',
    key: 'farming_notes',
    description:
      'Add any information here that relates to farming practices at the location/time relating to the data row.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Livestock 1',
    key: 'livestock_1',
    description:
      'List the livestock in the area that relates to the data row as given by the source (cattle, goats, chickens, horses, dogs, cats, pigs, combination, other, na).',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Livestock 2',
    key: 'livestock_2',
    description:
      'List the livestock in the area that relates to the data row as given by the source.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Livestock 3',
    key: 'livestock_3',
    description:
      'List the livestock in the area that relates to the data row as given by the source.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Livestock 4',
    key: 'livestock_4',
    description:
      'List the livestock in the area that relates to the data row as given by the source.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Livestock Notes',
    key: 'livestock_notes',
    description:
      'If there are more than four species of livestock provided by the source, list additional animal species here. Add any details relevant to the impact of livestock on malaria transmission.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Local Plants',
    key: 'local_plants',
    description:
      'List all the species of plants mentioned in the source that relate to the location/site in the data row.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Environment Notes',
    key: 'environment_notes',
    description:
      'Add any relevant information or detail about the local ecology or environment that are relevant to vector ecology/bionomics/disease transmission.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Sampling Biology 1',
    key: 'sampling_biology_1',
    description:
      'The sampling methods used to collect the specimens detailed in the BIOLOGY section. Three methods can be listed. If more than three methods have been used, this is indicated as "yes" in the sampling_biology_n column.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Sampling Biology 2',
    key: 'sampling_biology_2',
    description: 'As ‘sampling_biology_1’.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Sampling Biology 3',
    key: 'sampling_biology_3',
    description: 'As ‘sampling_biology_1’.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Sampling Biology N',
    key: 'sampling_biology_n',
    description:
      '‘Yes’ indicates that there are more than three sampling methods.',
    type: 'Boolean',
    required: false,
    unique: false,
  },
  {
    label: 'Parity N',
    key: 'parity_n',
    description:
      'The number of parous females detected from the total number examined.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Parity Total',
    key: 'parity_total',
    description: 'The total number of females examined for parity.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Parity Percent',
    key: 'parity_percent',
    description:
      'The percentage of parous females in the sample: = number of parous females/total number examined x 100.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Daily Survival Rate Percent',
    key: 'daily_survival_rate_percent',
    description:
      'The estimated proportion of female mosquitoes alive on day d that are still alive on day d+1.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Fecundity Mean Batch Size',
    key: 'fecundity_mean_batch_size',
    description: 'The number of eggs laid per batch.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Gonotrophic Cycle Days',
    key: 'gonotrophic_cycle_days',
    description:
      'The number of days for a female mosquito to go through the reproduce-feeding cycle.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Biology Notes',
    key: 'biology_notes',
    description: 'Free text additional information about the vector biology.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Sampling Infection 1',
    key: 'sampling_infection_1',
    description:
      'The sampling methods used to collect the specimens detailed in the VECTOR INFECTION RATE section. Three methods can be listed. If more than three methods have been used, this is indicated as "yes" in the final column. ',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Sampling Infection 2',
    key: 'sampling_infection_2',
    description: 'As ‘sampling_infection_1’',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Sampling Infection 3',
    key: 'sampling_infection_3',
    description: 'As ‘sampling_infection_1’',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Sampling Infection N',
    key: 'sampling_infection_n',
    description:
      '‘Yes’ indicates that there are more than three sampling methods',
    type: 'Boolean',
    required: false,
    unique: false,
  },
  {
    label: 'Sporozoite Rate by Dissection N',
    key: 'sporozoite_rate_by_dissection_n',
    description:
      'The number of sporozoite positive mosquitoes detected by dissection',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Sporozoite Rate by Dissection Total',
    key: 'sporozoite_rate_by_dissection_total',
    description: 'The total number of mosquitoes dissected',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Sporozoite Rate by Dissection Percent',
    key: 'sporozoite_rate_by_dissection_percent',
    description:
      'The sporozoite rate (percent) = SRn/SRtotal x 100 from dissection',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Sporozoite Rate by CSP N Pool',
    key: 'sporozoite_rate_by_csp_n_pool',
    description:
      'The number of sporozoite positive mosquitoes detected by circumsporozoite protein (CSP)in a sample (pool)',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Sporozoite Rate by CSP Total Pool',
    key: 'sporozoite_rate_by_csp_total_pool',
    description:
      'The total number of mosquitoes inThe pool (sample) tested by CSP',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Sporozoite Rate by CSP Percent',
    key: 'sporozoite_rate_by_csp_percent',
    description:
      'The sporozoite rate (percent) = SRn_pool/SRtotal_pool x 100 from CSP',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Sporozoite Rate P. falciparum N',
    key: 'sporozoite_rate_p_falciparum_n',
    description:
      'The number of P. falciparum sporozoite positive mosquitoes detected by CSP in a sample.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Sporozoite Rate P. falciparum Total',
    key: 'sporozoite_rate_p_falciparum_total',
    description:
      'The total number of mosquitoes in the pool (sample) tested by CSP for P. falciparum sporozoites.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Sporozoite Rate P. falciparum Percent',
    key: 'sporozoite_rate_p_falciparum_percent',
    description:
      'The P. falciparum sporozoite rate (percent) = PfSRnl/PfSRtotal x 100 from CSP.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Sporozoite Rate P. vivax N',
    key: 'sporozoite_rate_p_vivax_n',
    description:
      'The number of P. vivax sporozoite positive mosquitoes detected by CSP in a sample.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Sporozoite Rate P. vivax Total',
    key: 'sporozoite_rate_p_vivax_total',
    description:
      'The total number of mosquitoes in the pool (sample) tested by CSP for P. vivax sporozoites.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Sporozoite Rate P. vivax Percent',
    key: 'sporozoite_rate_p_vivax_percent',
    description:
      'The P. vivax sporozoite rate (percent) = PvSRnl/PvSRtotal x 100 from CSP. ',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Oocyst N',
    key: 'oocyst_n',
    description:
      'The number of oocyst infected females detected from the total number examined.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Oocyst Total',
    key: 'oocyst_total',
    description: 'The total number of females examined for oocysts.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Oocyst Rate Percent',
    key: 'oocyst_rate_percent',
    description:
      'The percentage of oocyst infected females detected in the sample: = number of infected females/total number examined x 100.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'EIR',
    key: 'eir',
    description: 'The entomological inoculation rate.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'EIR Period',
    key: 'eir_period',
    description:
      'The unit of time relating to the EIR (day, week, month, year).',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Extrinsic Incubation Period Days',
    key: 'ext_incubation_period_days',
    description:
      'The extrinsic incubation period of the malaria parasite in days.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Infection Notes',
    key: 'infection_notes',
    description:
      'Any additional details or information relating to the infection status of the mosquito species at the time and place given in the data row',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'HBR Sampling Indoor',
    key: 'hbr_sampling_indoor',
    description:
      'The sampling method used to collect the mosquitoes from which indoor human biting rate is evaluated. As ‘sampling_biology_1’.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Indoor HBR',
    key: 'indoor_hbr',
    description:
      'The indoor human biting rate; the number of bites per person per unit time.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'HBR Sampling Outdoor',
    key: 'hbr_sampling_outdoor',
    description:
      'The sampling method used to collect the mosquitoes from which outdoor human biting rate is evaluated. As ‘sampling_biology_1’.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Outdoor HBR',
    key: 'outdoor_hbr',
    description:
      'The outdoor human biting rate; the number of bites per person per unit time.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'HBR Sampling Combined 1',
    key: 'hbr_sampling_combined_1',
    description:
      'The sampling methods used to collect the mosquitoes from which human biting rate is evaluated where data are amalgamated from more than one method (e.g., where HBRs are given from combined indoor and outdoor sampling methods, or where the method used is unclear). Three methods can be listed. If more than three methods have been used, this is indicated as "yes" in the hbr sampling_combined_n column. As ‘_sampling_biology_1’.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'HBR Sampling Combined 2',
    key: 'hbr_sampling_combined_2',
    description: 'As ‘hbr sampling_combined_1’.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'HBR Sampling Combined 3',
    key: 'hbr_sampling_combined_3',
    description: 'As ‘hbr sampling_combined_1’.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'HBR Sampling Combined N',
    key: 'hbr_sampling_combined_n',
    description:
      '‘Yes’ indicates that there are more than three sampling methods.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Combined HBR',
    key: 'combined_hbr',
    description:
      'The human biting rate evaluated from the data from amalgamated sampling methods.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'HBR Unit',
    key: 'hbr_unit',
    description: 'The unit time for the HBR data.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'ABR Sampling 1',
    key: 'abr_sampling_1',
    description:
      'The sampling methods used to collect the mosquitoes from which the animal biting rate is evaluated where data are amalgamated from more than one method (e.g., where ABRs are given from combined indoor and outdoor sampling methods, or where the method used is unclear). Three methods can be listed. If more than three methods have been used, this is indicated as "yes" in the abr sampling_n column.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'ABR Sampling 2',
    key: 'abr_sampling_2',
    description: 'As ‘abr sampling_1’',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'ABR Sampling 3',
    key: 'abr_sampling_3',
    description: 'As ‘abr sampling_1’',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'ABR Sampling N',
    key: 'abr_sampling_n',
    description:
      '‘Yes’ indicates that there are more than three sampling methods',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'ABR',
    key: 'abr',
    description:
      'The animal biting rate evaluated from the data from amalgamated sampling methods.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'ABR Unit',
    key: 'abr_unit',
    description: 'The unit time for the ABR data.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Biting Rate Notes',
    key: 'biting_rate_notes',
    description:
      ' Free text additional information about the human and animal biting rates',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Host Sampling Indoor',
    key: 'host_sampling_indoor',
    description:
      'The indoor sampling method used to collect the mosquitoes from which indoor host preference is evaluated. As ‘sampling_biology_1.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Indoor Host N',
    key: 'indoor_host_n',
    description:
      'The number of mosquitoes positively indicating a measure of host preference fromThe total number collected indoors',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Indoor Host Total',
    key: 'indoor_host_total',
    description:
      'The total number of mosquitoes sampled indoors examined for measures of host preference',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Indoor Host Percent',
    key: 'indoor_host_percent',
    description:
      'The measure of host preference from indoor sampled mosquitoes',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Host Sampling Outdoor',
    key: 'host_sampling_outdoor',
    description:
      'The outdoor sampling method used to collectThe mosquitoes from which outdoor host preference is evaluated',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Outdoor Host N',
    key: 'outdoor_host_n',
    description:
      'The number of mosquitoes positively indicating a measure of host preference fromThe total number collected outdoors',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Outdoor Host Total',
    key: 'outdoor_host_total',
    description:
      'The total number of mosquitoes sampled outdoors examined for measures of host preference',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Outdoor Host Percent',
    key: 'outdoor_host_percent',
    description:
      'The measure of host preference from outdoor sampled mosquitoes',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Host Sampling Combined 1',
    key: 'host_sampling_combined_1',
    description:
      'The sampling methods used to collect the mosquitoes from which host preference is evaluated where data are amalgamated from more than one method, or where the method used is unclear. Three methods can be listed. If more than three methods have been used, this is indicated as "yes" in the final column. As ‘sampling_biology_1’.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Host Sampling Combined 2',
    key: 'host_sampling_combined_2',
    description: 'As ‘host sampling_combined_1.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Host Sampling Combined 3',
    key: 'host_sampling_combined_3',
    description: 'As ‘host sampling_combined_1.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Host Sampling Combined N',
    key: 'host_sampling_combined_n',
    description:
      '‘Yes’ indicates that there are more than three sampling methods.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Combined Host N',
    key: 'combined_host_n',
    description:
      'The number of mosquitoes positively indicating a measure of host preference collected by a combination of sampling methods.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Combined Host Total',
    key: 'combined_host_total',
    description:
      'The total number of mosquitoes sampled by a combination of sampling methods, examined for measures of host preference.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Combined Host',
    key: 'combined_host',
    description:
      'The measure of host preference from mosquitoes sampled by a combination of methods.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Host Unit',
    key: 'host_unit',
    description:
      'Indicates the measure used to identify host preference. Refer to the ‘Definitions’ tab of the abstraction template for a list of the options and definitions.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Host Sampling Other 1',
    key: 'host_sampling_other_1',
    description:
      'The sampling methods used to collect the mosquitoes from which host preference is evaluated where additional data are presented examining host preference. Three methods can be listed. If more than three methods have been used, this is indicated as "yes" in the final column. ',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Host Sampling Other 2',
    key: 'host_sampling_other_2',
    description: 'As ‘host sampling_other_1’.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Host Sampling Other 3',
    key: 'host_sampling_other_3',
    description: 'As ‘host sampling_other_1’.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Host Sampling Other N',
    key: 'host_sampling_other_n',
    description:
      '‘Yes’ indicates that there are more than three sampling methods.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Other Host N',
    key: 'other_host_n',
    description:
      'The number of mosquitoes positively indicating a measure of host preference.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Other Host Total',
    key: 'other_host_total',
    description:
      'The total number of mosquitoes examined for measures of host preference.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Host Other',
    key: 'host_other',
    description: 'The measure of host preference.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Host Other Unit',
    key: 'host_other_unit',
    description: 'As ‘host_unit’.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Host Notes',
    key: 'host_notes',
    description: 'Free text additional information about the host notes.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Biting Number of Sampling Nights Indoors',
    key: 'biting_number_of_sampling_nights_indoors',
    description:
      'The sampling effort, in number of "person nights", to collect the indoor biting data.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Biting Sampling Indoor',
    key: 'biting_sampling_indoor',
    description:
      'The sampling method used to collect the indoor mosquitoes from which biting location preference is determined. As ‘sampling_biology_1’.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Indoor Biting N',
    key: 'indoor_biting_n',
    description: 'The number of mosquitoes found biting indoors.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Indoor Biting Total',
    key: 'indoor_biting_total',
    description: 'The total number of indoor and outdoor biting mosquitoes.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Indoor Biting Data',
    key: 'indoor_biting_data',
    description: 'The percentage or ratio of mosquitoes found biting indoors.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Biting Number of Sampling Nights Outdoors',
    key: 'biting_number_of_sampling_nights_outdoors',
    description:
      'The sampling effort, in number of "person nights", to collect the outdoor biting data.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Biting Sampling Outdoor',
    key: 'biting_sampling_outdoor',
    description:
      'The sampling method used to collect the outdoor mosquitoes from which biting location preference is determined.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Outdoor Biting N',
    key: 'outdoor_biting_n',
    description: 'The number of mosquitoes found biting outdoors.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Outdoor Biting Total',
    key: 'outdoor_biting_total',
    description: 'The total number of indoor and outdoor biting mosquitoes.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Outdoor Biting Data',
    key: 'outdoor_biting_data',
    description: 'The percentage or ratio of mosquitoes found biting outdoors.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Indoor Outdoor Biting Unit',
    key: 'indoor_outdoor_biting_unit',
    description:
      'Indicates the data unit for the indoor and outdoor biting data. Refer to the ‘Definitions’ tab of the abstraction template for a list of the options and definitions.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Indoor Outdoor Biting Notes',
    key: 'indoor_outdoor_biting_notes',
    description:
      'Free text additional information about indoor/outdoor biting.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Biting Activity Indoor Number of Sampling Nights',
    key: 'biting_activity_indoor_number_of_sampling_nights',
    description:
      'The sampling effort, in number of "person nights", relevant to indoor biting activity data.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '1800-1900 Indoor',
    key: '1800_1900_in',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '1900-2000 Indoor',
    key: '1900_2000_in',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '2000-2100 Indoor',
    key: '2000_2100_in',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '2100-2200 Indoor',
    key: '2100_2200_in',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '2200-2300 Indoor',
    key: '2200_2300_in',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '2300-0000 Indoor',
    key: '2300_0000_in',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '0000-0100 Indoor',
    key: '0000_0100_in',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '0100-0200 Indoor',
    key: '0100_0200_in',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '0200-0300 Indoor',
    key: '0200_0300_in',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '0300-0400 Indoor',
    key: '0300_0400_in',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '0400-0500 Indoor',
    key: '0400_0500_in',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '0500-0600 Indoor',
    key: '0500_0600_in',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '1830-2130 Indoor',
    key: '1830_2130_in',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '2130-0030 Indoor',
    key: '2130_0030_in',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '0030-0330 Indoor',
    key: '0030_0330_in',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '0330-0630 Indoor',
    key: '0330_0630_in',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Biting Activity Outdoor Number of Sampling Nights',
    key: 'biting_activity_outdoor_number_of_sampling_nights',
    description:
      'The sampling effort, in number of "man nights", relevant to outdoor biting activity data.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '1800-1900 Outdoor',
    key: '1800_1900_out',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '1900-2000 Outdoor',
    key: '1900_2000_out',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '2000-2100 Outdoor',
    key: '2000_2100_out',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '2100-2200 Outdoor',
    key: '2100_2200_out',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '2200-2300 Outdoor',
    key: '2200_2300_out',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '2300-0000 Outdoor',
    key: '2300_0000_out',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '0000-0100 Outdoor',
    key: '0000_0100_out',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '0100-0200 Outdoor',
    key: '0100_0200_out',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '0200-0300 Outdoor',
    key: '0200_0300_out',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '0300-0400 Outdoor',
    key: '0300_0400_out',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '0400-0500 Outdoor',
    key: '0400_0500_out',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '0500-0600 Outdoor',
    key: '0500_0600_out',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '1830-2130 Outdoor',
    key: '1830_2130_out',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '2130-0030 Outdoor',
    key: '2130_0030_out',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '0030-0330 Outdoor',
    key: '0030_0330_out',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '0330-0630 Outdoor',
    key: '0330_0630_out',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks indoors. You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Biting Activity Combined Number of Sampling Nights',
    key: 'biting_activity_combined_number_of_sampling_nights',
    description:
      'The sampling effort, in number of "man nights", relevant to combined indoor and outdoor biting activity data.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '1800-1900 Combined',
    key: '1800_1900_combined',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks reported combined for indoors and outdoors You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '1900-2000 Combined',
    key: '1900_2000_combined',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks reported combined for indoors and outdoors You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '2000-2100 Combined',
    key: '2000_2100_combined',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks reported combined for indoors and outdoors You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '2100-2200 Combined',
    key: '2100_2200_combined',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks reported combined for indoors and outdoors You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '2200-2300 Combined',
    key: '2200_2300_combined',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks reported combined for indoors and outdoors You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '2300-0000 Combined',
    key: '2300_0000_combined',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks reported combined for indoors and outdoors You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '0000-0100 Combined',
    key: '0000_0100_combined',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks reported combined for indoors and outdoors You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '0100-0200 Combined',
    key: '0100_0200_combined',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks reported combined for indoors and outdoors You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '0200-0300 Combined',
    key: '0200_0300_combined',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks reported combined for indoors and outdoors You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '0300-0400 Combined',
    key: '0300_0400_combined',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks reported combined for indoors and outdoors You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '0400-0500 Combined',
    key: '0400_0500_combined',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks reported combined for indoors and outdoors You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '0500-0600 Combined',
    key: '0500_0600_combined',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks reported combined for indoors and outdoors You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '1830-2130 Combined',
    key: '1830_2130_combined',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks reported combined for indoors and outdoors You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '2130-0030 Combined',
    key: '2130_0030_combined',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks reported combined for indoors and outdoors You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '0030-0330 Combined',
    key: '0030_0330_combined',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks reported combined for indoors and outdoors You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: '0330-0630 Combined',
    key: '0330_0630_combined',
    description:
      'Add ‘1’ to the period of time where the mosquito activity (normally measured in terms of numbers of mosquitoes captured) peaks reported combined for indoors and outdoors You may use graphical data here',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Biting Notes',
    key: 'biting_notes',
    description: 'Free text additional information about biting activity.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Resting Sampling Indoor',
    key: 'resting_sampling_indoor',
    description:
      'Indoor sampling method used to collect the mosquitoes to assess indoor resting behaviour. As ‘Biology_sampling_1’.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Unfed Indoor',
    key: 'unfed_indoor',
    description:
      'Total number of unfed mosquitoes in the sample collected indoors.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Fed Indoor',
    key: 'fed_indoor',
    description:
      'Total number of fed mosquitoes in the sample collected indoors.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Gravid Indoor',
    key: 'gravid_indoor',
    description:
      'Total number of gravid mosquitoes in the sample collected indoors.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Total Indoor',
    key: 'total_indoor',
    description:
      'Total number of mosquitoes in the sample collected indoors, including unfed, fed, and gravid females.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Resting Sampling Outdoor',
    key: 'resting_sampling_outdoor',
    description:
      'Outdoor sampling method used to collect the mosquitoes to assess indoor resting behaviour. As ‘Biology_sampling_1’.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Unfed Outdoor',
    key: 'unfed_outdoor',
    description:
      'Total number of unfed mosquitoes in the sample collected outdoors.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Fed Outdoor',
    key: 'fed_outdoor',
    description:
      'Total number of fed mosquitoes in the sample collected outdoors.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Gravid Outdoor',
    key: 'gravid_outdoor',
    description:
      'Total number of gravid mosquitoes in the sample collected outdoors.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Total Outdoor',
    key: 'total_outdoor',
    description:
      'Total number of mosquitoes in the sample collected outdoors, including unfed, fed, and gravid females.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Resting Sampling Other',
    key: 'resting_sampling_other',
    description:
      'Sampling methods relevant to "other" data. These columns are used when additional sampling is reported, for example if indoor and outdoor resting mosquitoes are listed in the previous sections, but the source also reports data from a third sampling method such as mosquitoes resting in animal sheds. As ‘Biology_sampling_1’.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Unfed Other',
    key: 'unfed_other',
    description:
      'Total number of unfed mosquitoes in the sample collected by additional/"other" methods.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Fed Other',
    key: 'fed_other',
    description:
      'Total number of fed mosquitoes in the sample collected by additional/"other" methods.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Gravid Other',
    key: 'gravid_other',
    description:
      'Total number of gravid mosquitoes in the sample collected by additional/"other" methods.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Total Other',
    key: 'total_other',
    description:
      'Total number of mosquitoes in the sample collected by additional/"other" methods, including unfed, fed, and gravid females.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Resting Unit',
    key: 'resting_unit',
    description:
      'The unit relating to the indoor, outdoor, or other resting data. Refer to the ‘Definitions’ tab of the abstraction template for a list of the options and definitions.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Resting Notes',
    key: 'resting_notes',
    description:
      'Free text additional information about indoor, outdoor, and other resting sampling.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Instars Found 1',
    key: 'larval_instars_found_1',
    description:
      'The different larval instar(s) and pupae in the first sampling habitat as per the dropdown list.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Habitat 1',
    key: 'larval_habitat_1',
    description:
      'Enter first sampling habitat as per the drop-down list. If habitat not in list, select ‘other’ and enter the habitat in the notes.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Site Character 1',
    key: 'larval_site_character_1',
    description:
      'For the first habitat, indicate the site is naturally occurring or is an artificial habitat.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Turbidity 1',
    key: 'larval_turbidity_1',
    description:
      'For the first habitat, indicate the condition of the water if provided, whether it is turbid, clear, or polluted',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Salinity 1',
    key: 'larval_salinity_1',
    description:
      'For the first habitat, indicate the salinity of the water if provided, whether it is brackish or fresh',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Vegetation 1',
    key: 'larval_vegetation_1',
    description:
      'For the first habitat, indicate whether vegetation is present, absent, or partial coverage',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Shade 1',
    key: 'larval_shade_1',
    description:
      'For the first habitat, indicate whether the habitat is shaded, sunlit or partially shaded',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Water Current 1',
    key: 'larval_water_current_1',
    description:
      'For the first habitat, indicate whether the water is slow or fast flowing, or stagnant',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Size 1',
    key: 'larval_size_1',
    description:
      'For the first habitat, if provided, report the diameter of the habitat at its widest point (drop down categories in cm/m)',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Depth 1',
    key: 'larval_depth_1',
    description:
      'For the first habitat, if provided, report the depth of the habitat (categories in cm)',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Permanence 1',
    key: 'larval_permanence_1',
    description:
      'For the first habitat, indicate if the habitat is permanent, temporary, or seasonal',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Other Fauna 1',
    key: 'larval_other_fauna_1',
    description:
      'For the first habitat, indicate if other fauna (i.e., animals) are present in the habitat and if they are a predator to mosquitoes or competitor to mosquitoes.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Control Present 1',
    key: 'larval_control_present_1',
    description:
      'For the first habitat, indicate if larval control is present and whether it is physical or chemical control',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Instars Found 2',
    key: 'larval_instars_found_2',
    description:
      'The different larval instar(s) and pupae in the second sampling habitat as per the dropdown list.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Habitat 2',
    key: 'larval_habitat_2',
    description:
      'Enter second sampling habitat as per the drop-down list. If habitat not in list, select ‘other’ and enter the habitat in the notes.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Site Character 2',
    key: 'larval_site_character_2',
    description:
      'For the second habitat, indicate the site is naturally occurring or is an artificial habitat.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Turbidity 2',
    key: 'larval_turbidity_2',
    description:
      'For the second habitat, indicate the condition of the water if provided, whether it is turbid, clear, or polluted',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Salinity 2',
    key: 'larval_salinity_2',
    description:
      'For the second habitat, indicate the salinity of the water if provided, whether it is brackish or fresh',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Vegetation 2',
    key: 'larval_vegetation_2',
    description:
      'For the second habitat, indicate whether vegetation is present, absent, or partial coverage',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Shade 2',
    key: 'larval_shade_2',
    description:
      'For the second habitat, indicate whether the habitat is shaded, sunlit or partially shaded',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Water Current 2',
    key: 'larval_water_current_2',
    description:
      'For the second habitat, indicate whether the water is slow or fast flowing, or stagnant',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Size 2',
    key: 'larval_size_2',
    description:
      'For the second habitat, if provided, report the diameter of the habitat at its widest point (drop down categories in cm/m)',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Depth 2',
    key: 'larval_depth_2',
    description:
      'For the second habitat, if provided, report the depth of the habitat (categories in cm)',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Permanence 2',
    key: 'larval_permanence_2',
    description:
      'For the second habitat, indicate if the habitat is permanent, temporary, or seasonal',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Other Fauna 2',
    key: 'larval_other_fauna_2',
    description:
      'For the second habitat, indicate if other fauna (i.e., animals) are present in the habitat and if they are a predator to mosquitoes or competitor to mosquitoes.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Control Present 2',
    key: 'larval_control_present_2',
    description:
      'For the second habitat, indicate if larval control is present and whether it is physical or chemical control',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Instars Found 3',
    key: 'larval_instars_found_3',
    description:
      'The different larval instar(s) and pupae in the third sampling habitat as per the dropdown list.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Habitat 3',
    key: 'larval_habitat_3',
    description:
      'Enter third sampling habitat as per the drop-down list. If habitat not in list, select ‘other’ and enter the habitat in the notes.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Site Character 3',
    key: 'larval_site_character_3',
    description:
      'For the third habitat, indicate the site is naturally occurring or is an artificial habitat.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Turbidity 3',
    key: 'larval_turbidity_3',
    description:
      'For the third habitat, indicate the condition of the water if provided, whether it is turbid, clear, or polluted',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Salinity 3',
    key: 'larval_salinity_3',
    description:
      'For the third habitat, indicate the salinity of the water if provided, whether it is brackish or fresh',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Vegetation 3',
    key: 'larval_vegetation_3',
    description:
      'For the third habitat, indicate whether vegetation is present, absent, or partial coverage',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Shade 3',
    key: 'larval_shade_3',
    description:
      'For the third habitat, indicate whether the habitat is shaded, sunlit or partially shaded',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Water Current 3',
    key: 'larval_water_current_3',
    description:
      'For the third habitat, indicate whether the water is slow or fast flowing, or stagnant',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Size 3',
    key: 'larval_size_3',
    description:
      'For the third habitat, if provided, report the diameter of the habitat at its widest point (drop down categories in cm/m)',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Depth 3',
    key: 'larval_depth_3',
    description:
      'For the third habitat, if provided, report the depth of the habitat (categories in cm)',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Permanence 3',
    key: 'larval_permanence_3',
    description:
      'For the third habitat, indicate if the habitat is permanent, temporary, or seasonal',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Other Fauna 3',
    key: 'larval_other_fauna_3',
    description:
      'For the third habitat, indicate if other fauna (i.e., animals) are present in the habitat and if they are a predator to mosquitoes or competitor to mosquitoes.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Control Present 3',
    key: 'larval_control_present_3',
    description:
      'For the third habitat, indicate if larval control is present and whether it is physical or chemical control',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Larval Notes',
    key: 'larval_notes',
    description: 'Free text additional information about the larval habitats. ',
    type: 'String',
    required: false,
    unique: false,
  },
].map((el) => {
  return Object.keys(el).includes('category') //if category has been set, do not interfere
    ? { ...el, type: el.type as FieldType }
    : { category: 'Bionomics', ...el, type: el.type as FieldType };
});

export const IRFields: Field<any>[] = [
  ...OccurrenceFields,
  {
    label: 'Bioassay Representative of Complex at Site',
    key: 'bioassay_representative_of_complex_at_site',
    description:
      'Yes/no. A representative sample is a random sample that is representative of the population of interest. Is the mosquito population utilised for the susceptibility test representative of the complex at the site?',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label:
      'Bioassay Representative of Complex at Site if Disaggregated Values Combined Without Adjustments',
    key: 'bioassay_representative_of_complex_at_site_if_disaggregated_values_combined_without_adjustments',
    description:
      'Yes/no. Multiple rows of data would be representative if disaggregated values were combined. For example, if individual species values were combined to give result as the complex.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Generation',
    key: 'generation',
    description:
      'The mosquito generation tested: F0, F1 or a mix of both. F0: wild caught adults or wild caught larvae that were reared to adults before testing.  F1: first generation offspring of wild caught adults or larvae.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Wild Caught Larvae or Adults',
    key: 'wild_caught_larvae_or_adults',
    description:
      'Whether the mosquito was caught as an adult or caught as larvae and raised to adult for testing.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Lower Age (Days)',
    key: 'lower_age_days',
    description:
      'Lower age in days if age range given for mosquito (e.g. 3 if 3-5 days).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Upper Age (Days)',
    key: 'upper_age_days',
    description:
      'Upper age in days, if age range given for mosquito (e.g., 5 if 3-5 days).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Test Protocol',
    key: 'test_protocol',
    description:
      'The WHO or CDC bioassay protocol followed is listed by organisation and publication year.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Insecticide Tested',
    key: 'insecticide_tested',
    description: 'The insecticide tested is named.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Insecticide Class',
    key: 'insecticide_class',
    description:
      'The chemical class the insecticide tested belongs to as per drop down list.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'IRAC MOA',
    key: 'irac_moa',
    description:
      'Insecticide Resistance Action Committee (IRAC) mode of action (MoA) as per drop down list. See IRAC Classification website for details. https://irac-online.org/mode-of-action/classification-online/',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'IRAC MOA Code',
    key: 'irac_moa_code',
    description:
      'Number letter code of the IRAC MoA e.g., 1A. Refer toIRAC Classification website. https://irac-online.org/mode-of-action/classification-online/',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Concentration Percent',
    key: 'concentration_percent',
    description:
      'If a WHO protocol was followed, the insecticide concentration is given as a percent.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Concentration (Micrograms)',
    key: 'concentration_micrograms',
    description:
      'If the CDC protocol was followed, the insecticide concentration is given in μg/bottle.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Exposure Period (Min)',
    key: 'exposure_period_min',
    description:
      'The period of time the mosquitoes are exposed to the insecticide in minutes.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Intensity Multiplier',
    key: 'intensity_multiplier',
    description:
      'The number by which the recommended or baseline insecticide concentration is multiplied If several tests are done exposing mosquitoes to an insecticide at different dose concentrations (intensity bioassays), then enter ‘1’ for the baseline/standard concentration and the appropriate multiplied number for higher concentrations, e.g. if standard dose is 0.75%, then enter ‘2’ for a concentration of 1.5%.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Synergist Tested',
    key: 'synergist_tested',
    description:
      'The synergist tested is named for susceptibility tests where mosquitoes are exposed to a synergist as well as the insecticide.  Leave blank if no synergist used.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Synergist Concentration',
    key: 'synergist_concentration',
    description: 'The synergist concentration is given.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Synergist Concentration Unit',
    key: 'synergist_concentration_unit',
    description:
      'The concentration unit is recorded depending on whether CDC or WHO test procedures.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Mosquitoes Tested (N)',
    key: 'mosquitoes_tested_n',
    description: 'The total number of mosquitoes tested in all replicates.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Mosquitoes Dead (N)',
    key: 'mosquitoes_dead_n',
    description:
      'The total number of mosquitoes tested in all replicates. If range given, e.g. 80-100 mosquitoes tested, enter the lowest value of range, e.g. 80, and put range in bioassay notes.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Percent Mortality',
    key: 'percent_mortality',
    description:
      'The percentage of mosquitoes that died across all replicates, adjusted using Abbot’s formula if applicable.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Knock Down Exposure Time (Min)',
    key: 'knock_down_exposure_time_min',
    description:
      'The period of exposure to the insecticide in minutes before knock down recorded.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Mosquitoes Knocked Down (N)',
    key: 'mosquitoes_knocked_down_n',
    description: 'Number of mosquitoes knocked down at recorded exposure time.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Knock Down Percent',
    key: 'knock_down_percent',
    description:
      'Percentage of mosquitoes knocked down at recorded exposure time.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'KDT 50 Percent (Min)',
    key: 'kdt_50_percent_min',
    description: 'The time it takes to knock down 50% of the mosquito sample.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'KDT 90 Percent (Min)',
    key: 'kdt_90_percent_min',
    description: 'The time it takes to knock down 90% of the mosquito sample.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'KDT 95 Percent (Min)',
    key: 'kdt_95_percent_min',
    description: 'The time it takes to knock down 95% of the mosquito sample.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Bioassay Notes',
    key: 'bioassay_notes',
    description: 'Free text additional information about the bioassay tests.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Genotypic Test Representative of Species at Site',
    key: 'genotypic_test_representative_of_species_at_site',
    description:
      'Yes/no. A representative sample is a random sample that is representative of the population of interest.  Is the mosquito population utilised for the genotypic test representative of the species at the site?',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label:
      'Genotypic Test Representative of Species at Site if Disaggregated Values Combined Without Adjustments',
    key: 'genotypic_test_representative_of_species_at_site_if_disaggregated_values_combined_without_adjustments',
    description:
      'Yes/no. Multiple rows of data would be representative if disaggregated values were combined.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Minor Species Missing Allele Frequency Data',
    key: 'minor_species_missing_allele_frequency_data',
    description:
      'Yes/no.  Indicate ‘yes’ if minor species identified but genetic mechanism data for that species is not reported.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Notes on Population Representative',
    key: 'notes_on_population_representative',
    description:
      'Free text for additional information related to sample representativeness.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Genotypic Sample First Been Through Bioassay Tests',
    key: 'genotypic_sample_first_been_through_bioassay_tests',
    description:
      'Yes/no.  Did the sample first go through bioassay testing before being selected for genotypic tests?  Including pooled samples from multiple bioassays.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Genotypic Sample Linked to a Specific Bioassay',
    key: 'genotypic_sample_linked_to_a_specific_bioassay',
    description:
      'Yes/no. Indicate ‘yes’ if the sample used in the genetic mechanisms tests matches to a specific bioassay test (not a pooled sample but linked to a specific insecticide tested).',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Bioassay Subsample Used in Genotypic Test',
    key: 'bioassay_subsample_used_in_genotypic_test',
    description:
      'What subsample of mosquitoes from the bioassay test were utilised in genotypic tests: dead only, alive only, dead and alive or not specified?',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Notes on Bioassay Linkage',
    key: 'notes_on_bioassay_linkage',
    description:
      'Free text for additional information related to bioassay matching to the genetic mechanisms.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC Method 1',
    key: 'vgsc_method_1',
    description:
      'Enter the first method used for the Voltage gated sodium channels (Vgsc) test. ',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC Method 2',
    key: 'vgsc_method_2',
    description:
      'Enter the second method used for the Voltage gated sodium channels (Vgsc) test.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC Number of Mosquitoes Tested',
    key: 'vgsc_number_of_mosquitoes_tested',
    description: 'Number of mosquitoes tested in the Vgsc tests.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC Generation',
    key: 'vgsc_generation',
    description:
      'The mosquito generation tested: F0, F1 or a mix of both. F0: wild caught adults or wild caught larvae that were reared to adults before testing. F1: first generation offspring of wild caught adults or larvae.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC KDR Notes',
    key: 'vgsc_kdr_notes',
    description: 'Free text additional information about the Vgsc/kdr data.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC995L VGSC995L N',
    key: 'vgsc995l_vgsc995l_n',
    description:
      'Number of samples with 995L/995L genotype (could be presented as homozygous susceptible i.e., SS).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC995L VGSC995L Percent',
    key: 'vgsc995l_vgsc995l_percent',
    description:
      'Frequency of 995L/995L genotype (could be presented as homozygous susceptible/wild type i.e., SS) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC995L VGSC995F N',
    key: 'vgsc995l_vgsc995f_n',
    description:
      'Number of samples with 995L/995F genotype (could be presented as heterozygous i.e., RS).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC995L VGSC995F Percent',
    key: 'vgsc995l_vgsc995f_percent',
    description:
      'Frequency of 995L/995F genotype (could be presented as heterozygous i.e., RS) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC995F VGSC995F N',
    key: 'vgsc995f_vgsc995f_n',
    description:
      'Number of samples with 995F/995F genotype (could be presented as homozygous resistant/mutant i.e., RR)',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC995F VGSC995F Percent',
    key: 'vgsc995f_vgsc995f_percent',
    description:
      'Frequency of 995F/995F genotype (could be presented as homozygous resistant/mutant i.e., RR) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC995L VGSC995S N',
    key: 'vgsc995l_vgsc995s_n',
    description:
      'Number of samples with 995L/995S (could be presented as heterozygous i.e., RS).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC995L VGSC995S Percent',
    key: 'vgsc995l_vgsc995s_percent',
    description:
      'Frequency of 995L/995S genotype (could be presented as heterozygous i.e., RS) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC995S VGSC995S N',
    key: 'vgsc995s_vgsc995s_n',
    description:
      'Number of samples with 995S/995S genotype (could be presented as homozygous resistant/mutant i.e., RR).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC995S VGSC995S Percent',
    key: 'vgsc995s_vgsc995s_percent',
    description:
      'Frequency of 995S/995S genotype (could be presented as homozygous resistant/mutant i.e., RR) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC995L VGSC995C N',
    key: 'vgsc995l_vgsc995c_n',
    description:
      'Number of samples with 995L/995C (could be presented as heterozygous i.e., RS).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC995L VGSC995C Percent',
    key: 'vgsc995l_vgsc995c_percent',
    description:
      'Frequency of 995L/995C genotype (could be presented as heterozygous i.e., RS) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC995C VGSC995C N',
    key: 'vgsc995c_vgsc995c_n',
    description:
      'Number of samples with 995C/995C genotype (could be presented as homozygous resistant/mutant i.e., RR).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC995C VGSC995C Percent',
    key: 'vgsc995c_vgsc995c_percent',
    description:
      'Frequency of 995C/995C genotype (could be presented as homozygous resistant/mutant i.e., RR) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Null VGSC995C or VGSC995C VGSC995C N',
    key: 'null_vgsc995c_or_vgsc995c_vgsc995c_n',
    description:
      'Number of samples with null/995C genotype (null = non-functional allele).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Null VGSC995C or VGSC995C VGSC995C Percent',
    key: 'null_vgsc995c_or_vgsc995c_vgsc995c_percent',
    description:
      'Frequency of null/995C genotype (null = non-functional allele) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC995F VGSC995S N',
    key: 'vgsc995f_vgsc995s_n',
    description: 'Number of samples with 995F/995S genotype.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC995F VGSC995S Percent',
    key: 'vgsc995f_vgsc995s_percent',
    description: 'Frequency of 995F/995S genotype as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC995F VGSC995C N',
    key: 'vgsc995f_vgsc995c_n',
    description:
      'Could be presented as ‘SS’. Number of homozygous susceptible/wild type genotype (i.e., L/L).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC995F VGSC995C Percent',
    key: 'vgsc995f_vgsc995c_percent',
    description:
      'Could be presented as ‘SS’. Frequency of homozygous susceptible/wild type genotype (i.e., percentage of L/L) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Susceptible Susceptible N',
    key: 'susceptible_susceptible_n',
    description:
      'Could be presented as ‘RS’. Number of samples with heterozygous genotype (i.e., L/F or L/S or L/C).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Susceptible Susceptible Percent',
    key: 'susceptible_susceptible_percent',
    description:
      'Could be presented as ‘RS’. Frequency of heterozygous genotype (i.e., L/F or L/S or L/C) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Resistant Susceptible N',
    key: 'resistant_susceptible_n',
    description:
      'Could be presented as ‘RR’. Number of homozygous resistant/mutant genotype (i.e., F/F, S/S or C/C).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Resistant Susceptible Percent',
    key: 'resistant_susceptible_percent',
    description:
      'Could be presented as ‘RR’. Frequency of homozygous resistant/mutant genotype (i.e., F/F, S/S or C/C) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Resistant Resistant N',
    key: 'resistant_resistant_n',
    description:
      'Could be presented as ‘RR’. Number of homozygous resistant/mutant genotype (i.e., F/F, S/S or C/C).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Resistant Resistant Percent',
    key: 'resistant_resistant_percent',
    description:
      'Could be presented as ‘RR’. Frequency of homozygous resistant/mutant genotype (i.e., F/F, S/S or C/C) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC995L Percent',
    key: 'vgsc995l_percent',
    description: 'Frequency of the 995L (wild type) allele as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC995F Percent',
    key: 'vgsc995f_percent',
    description: 'Frequency of the 995F allele as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC995S Percent',
    key: 'vgsc995s_percent',
    description: 'Frequency of the 995S allele as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC995C Percent',
    key: 'vgsc995c_percent',
    description: 'Frequency of the 995C allele as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'KDR Percent',
    key: 'kdr_percent',
    description: 'If result given simply as ‘kdr’ enter allele frequency here.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC402V VGSC402V N',
    key: 'vgsc402v_vgsc402v_n',
    description: 'Number of samples with 402/402 genotype (wildtype).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC402V VGSC402V Percent',
    key: 'vgsc402v_vgsc402v_percent',
    description: 'Frequency of 402/402 genotype (wildtype) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC402V VGSC402L N',
    key: 'vgsc402v_vgsc402l_n',
    description: 'Number of samples with 402/402L genotype (heterozygous).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC402V VGSC402L Percent',
    key: 'vgsc402v_vgsc402l_percent',
    description:
      'Frequency of 402/402L genotype (heterozygous) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC402L VGSC402L N',
    key: 'vgsc402l_vgsc402l_n',
    description:
      'Number of samples with 402L/402L genotype (homozygous resistant).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC402L VGSC402L Percent',
    key: 'vgsc402l_vgsc402l_percent',
    description:
      'Frequency of 402L/402L genotype (homozygous resistant) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC402V Percent',
    key: 'vgsc402v_percent',
    description: 'Frequency of the Vgsc-402 allele as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC 402L Percent',
    key: 'vgsc_402l_percent',
    description: 'Frequency of the Vgsc-402L allele as a percentage',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC1570N VGSC1570N N',
    key: 'vgsc1570n_vgsc1570n_n',
    description: 'Number of samples with the 1570/1570 genotype (wildtype).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC1570N VGSC1570N Percent',
    key: 'vgsc1570n_vgsc1570n_percent',
    description:
      'Frequency of the 1570/1570 genotype (wildtype) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC1570N VGSC1570Y N',
    key: 'vgsc1570n_vgsc1570y_n',
    description:
      'Number of samples with the 1570/1570Y genotype (heterozygous).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC1570N VGSC1570Y Percent',
    key: 'vgsc1570n_1570y_percent',
    description:
      'Frequency of the 1570/1570Y genotype (heterozygous) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC1570Y VGSC1570Y N',
    key: 'vgsc1570y_vgsc1570y_n',
    description:
      'Number of samples with the 1570Y/1570Y genotype (homozygous resistant).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC1570Y VGSC1570Y Percent',
    key: 'vgsc1570y_vgsc1570y_percent',
    description:
      'Frequency of the 1570/1570Y genotype (homozygous resistant) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC1570N Percent',
    key: 'vgsc1570n_percent',
    description: 'Frequency of the 1570 allele as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'VGSC1570Y Percent',
    key: 'vgsc1570y_percent',
    description: 'Frequency of the 1570Y allele as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'RDL Method 1',
    key: 'rdl_method_1',
    description:
      'Enter method used for the Resistance to dieldrin locus (Rdl) test in the format Author Year of Publication.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'RDL Number of Mosquitoes Tested',
    key: 'rdl_number_of_mosquitoes_tested',
    description: 'Number of mosquitoes tested in the Rdl resistance.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'RDL Generation',
    key: 'rdl_generation',
    description:
      'The mosquito generation tested: F0, F1 or a mix of both. F0: wild caught adults or wild caught larvae that were reared to adults before testing.  F1: first generation offspring of wild caught adults or larvae.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'RDL Notes',
    key: 'rdl_notes',
    description: 'Free text additional information about the Rdl data.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'RDL296C RDL296C N',
    key: 'rdl296c_rdl296c__n',
    description: 'Number of samples with 296C/296C genotype (wildtype).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'RDL296C RDL296C Percent',
    key: 'rdl296c_rdl296c_percent',
    description: 'Frequency of 296C/296C genotype (wildtype) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'RDL296C RDL296G N',
    key: 'rdl296c_rdl296g_n',
    description: 'Number of samples with 296C/296G genotype (heterozygous).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'RDL296C RDL296G Percent',
    key: 'rdl296c_rdl296g_percent',
    description:
      'Frequency of 296C/296G genotype (heterozygous) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'RDL296G RDL296G N',
    key: 'rdl296g_rdl296g_n',
    description:
      'Number of samples with 296G/296G genotype (homozygous resistant).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'RDL296G RDL296G Percent',
    key: 'rdl296g_rdl296g_percent',
    description:
      'Frequency of 296G/296G genotype (homozygous resistant) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'RDL296C RDL296S N',
    key: 'rdl296c_rdl296s_n',
    description: 'Number of samples with 296C/296S genotype (heterozygous).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'RDL296C RDL296S Percent',
    key: 'rdl296c_rdl296s_percent',
    description:
      'Frequency of 296C/296S genotype (heterozygous) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'RDL296S RDL296S N',
    key: 'rdl296s_rdl296s_n',
    description:
      'Number of samples with 296S/296S genotype (homozygous resistant).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'RDL296S RDL296S Percent',
    key: 'rdl296s_rdl296s_percent',
    description:
      'Frequency of 296S/296S genotype (homozygous resistant) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'RDL296G RDL296S N',
    key: 'rdl296g_rdl296s_n',
    description:
      'Number of samples with 296G/296S genotype (homozygous resistant).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'RDL296G RDL296S Percent',
    key: 'rdl296g_rdl296s_percent',
    description:
      'Frequency of 296G/296S genotype (homozygous resistant) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'RDL296C Percent',
    key: 'rdl296c_percent',
    description: 'Frequency of the 296C allele as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'RDL296G Percent',
    key: 'rdl296g_percent',
    description: 'Frequency of the 296G allele as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'RDL296S Percent',
    key: 'rdl296s_percent',
    description: 'Frequency of the 296S allele as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'ACE1 Method 1',
    key: 'ace1_method_1',
    description:
      'Enter method used for the acetylcholinesterase 1 (ace-1) test in the format Author Year of publication.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'ACE1 Number of Mosquitoes Tested',
    key: 'ace1_number_of_mosquitoes_tested',
    description: 'Number of mosquitoes tested for ace-1 resistance.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'ACE1 Generation',
    key: 'ace1_generation',
    description:
      'The mosquito generation tested: F0, F1 or a mix of both. F0: wild caught adults or wild caught larvae that were reared to adults before testing.  F1: first generation offspring of wild caught adults or larvae.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'ACE1 Notes',
    key: 'ace1_notes',
    description: 'Free text additional information about the ace-1 data.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'ACE1 280G ACE1 280G N',
    key: 'ace1_280g_ace1_280g_n',
    description: 'Number of samples with 280/280 genotype (wildtype).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'ACE1 280G ACE1 280G Percent',
    key: 'ace1_280g_ace1_280g_percent',
    description: 'Frequency of 280/280 genotype (wildtype) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'ACE1 280G ACE1 280S N',
    key: 'ace1_280g_ace1_280s_n',
    description: 'Number of samples with 280/280S genotype (heterozygous).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'ACE1 280G ACE1 280S Percent',
    key: 'ace1_280g_ace1_280s_percent',
    description:
      'Frequency of 280/280S genotype (heterozygous) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'ACE1 280S ACE1 280S N',
    key: 'ace1_280s_ace1_280s_n',
    description:
      'Number of samples with 280/280S genotype (homozygous resistant).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'ACE1 280S ACE1 280S Percent',
    key: 'ace1_280s_ace1_280s_percent',
    description:
      'Frequency of 280/280S genotype (homozygous resistant) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'ACE1 280G Percent',
    key: 'ace1_280g_percent',
    description: 'Frequency of the 280G allele as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'ACE1 280S Percent',
    key: 'ace1_280s_percent',
    description: 'Frequency of the 280S allele as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'GSTE Method 1',
    key: 'gste_method_1',
    description:
      'Enter method used for the Glutathione S-transferases (Gste) test in the format Author Year of publication',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'GSTE Number of Mosquitoes Tested',
    key: 'gste_number_of_mosquitoes_tested',
    description: 'Number of mosquitoes tested for GSte resistance.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'GSTE Generation',
    key: 'gste_generation',
    description:
      'The mosquito generation tested: F0, F1 or a mix of both. F0: wild caught adults or wild caught larvae that were reared to adults before testing.  F1: first generation offspring of wild caught adults or larvae.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'GSTE Notes',
    key: 'gste_notes',
    description: 'Free text additional information about the GSte data',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'GSTE2 114I GSTE2 114I N',
    key: 'gste2_114i_gste2_114i_n',
    description: 'Number of samples with 114L/114L genotype (wildtype).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'GSTE2 114I GSTE2 114I Percent',
    key: 'gste2_114i_gste2_114i_percent',
    description: 'Frequency of 114L/114L genotype (wildtype) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'GSTE2 114I GSTE2 114T N',
    key: 'gste2_114i_gste2_114t_n',
    description: 'Number of samples with 114L/114T genotype (heterozygous).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'GSTE2 114I GSTE2 114T Percent',
    key: 'gste2_114i_gste2_114t_percent',
    description:
      'Frequency of114L/114T genotype (heterozygous) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'GSTE2 114T GSTE2 114T N',
    key: 'gste2_114t_gste2_114t_n',
    description:
      'Number of samples with 114T/114T genotype (homozygous resistant).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'GSTE2 114T GSTE2 114T Percent',
    key: 'gste2_114t_gste2_114t_percent',
    description:
      'Frequency of 114T/114T genotype (homozygous resistant) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'GSTE2 114I Percent',
    key: 'gste2_114i_percent',
    description: 'Frequency of the 114L allele as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'GSTE2 114T Percent',
    key: 'gste2_114t_percent',
    description: 'Frequency of the 114T allele as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'GSTE2 119L GSTE2 119L N',
    key: 'gste2_119l_gste2_119l_n',
    description: 'Number of samples with 119/119 genotype (wildtype).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'GSTE2 119L GSTE2 119L Percent',
    key: 'gste2_119l_gste2_119l_percent',
    description: 'Frequency of 119/119 genotype (wildtype) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'GSTE2 119L GSTE2 119V N',
    key: 'gste2_119l_gste2_119v_n',
    description: 'Number of samples with 119/119V genotype (heterozygous).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'GSTE2 119L GSTE2 119V Percent',
    key: 'gste2_119l_gste2_119v_percent',
    description:
      'Frequency of 119/119V genotype (heterozygous) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'GSTE2 119V GSTE2 119V N',
    key: 'gste2_119v_gste2_119v_n',
    description:
      'Number of samples with 119V/119V genotype (homozygous resistant).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'GSTE2 119V GSTE2 119V Percent',
    key: 'gste2_119v_gste2_119v_percent',
    description:
      'Frequency of 119V/119V genotype (homozygous resistant) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'GSTE2 119L Percent',
    key: 'gste2_119l_percent',
    description: 'Frequency of the 119 allele as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'GSTE2 119V Percent',
    key: 'gste2_119v_percent',
    description: 'Frequency of the 119V allele as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'CYP Method 1',
    key: 'cyp_method_1',
    description:
      'Enter method used for the Cytochrome p450s (Cyp) test in the format Author Year of publication.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'CYP Number of Mosquitoes Tested',
    key: 'cyp_number_of_mosquitoes_tested',
    description: 'Number of mosquitoes tested for Cyp resistance. ',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'CYP Generation',
    key: 'cyp_generation',
    description:
      'The mosquito generation tested: F0, F1 or a mix of both. F0: wild caught adults or wild caught larvae that were reared to adults before testing.  F1: first generation offspring of wild caught adults or larvae.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'CYP Notes',
    key: 'cyp_notes',
    description: 'Free text additional information about the Cyp data.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'CYP4J5 43L CYP4J5 43L N',
    key: 'cyp4j5_43l_cyp4j5_43l_n',
    description:
      'Number of samples with Cyp4j5-L43L/ Cyp4j5-L43L genotype (wildtype).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'CYP4J5 43L CYP4J5 43L Percent',
    key: 'cyp4j5_43l_cyp4j5_43l_percent',
    description:
      'Frequency of Cyp4j5-L43L/ Cyp4j5-L43L genotype (wildtype) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'CYP4J5 43L CYP4J5 43F N',
    key: 'cyp4j5_43l_cyp4j5_43f_n',
    description:
      'Number of samples with Cyp4j5-L43L/ Cyp4j5-L43F genotype (heterozygous).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'CYP4J5 43L CYP4J5 43F Percent',
    key: 'cyp4j5_43l_cyp4j5_43f_percent',
    description:
      'Frequency of Cyp4j5-L43L/ Cyp4j5-L43F genotype (heterozygous) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'CYP4J5 43F CYP4J5 43F N',
    key: 'cyp4j5_43f_cyp4j5_43f_n',
    description:
      'Number of samples with Cyp4j5-L43F/ Cyp4j5-L43LF genotype (homozygous resistant).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'CYP4J5 43F CYP4J5 43F Percent',
    key: 'cyp4j5_43f_cyp4j5_43f_percent',
    description:
      'Frequency of Cyp4j5-L43F/ Cyp4j5-L43LF genotype (homozygous resistant) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'CYP4J5 43L Percent',
    key: 'cyp4j5_43l_percent',
    description: 'Frequency of the Cyp4j5-L43L allele as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'CYP4J5 43F Percent',
    key: 'cyp4j5_43f_percent',
    description: 'Frequency of the Cyp4j5-L43F allele as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'CYP6P4 236WT CYP6P4 236WT N',
    key: 'cyp6p4_236wt_cyp6p4_236wt_n',
    description:
      'Number of samples with Cyp6p4-236WT/ Cyp6p4-236WT genotype (wildtype).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'CYP6P4 236WT CYP6P4 236WT Percent',
    key: 'cyp6p4_236wt_cyp6p4_236wt_percent',
    description:
      'Frequency of Cyp6p4-236WT/ Cyp6p4-236WT genotype (wildtype) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'CYP6P4 236WT CYP6P4 236M N',
    key: 'cyp6p4_236wt_cyp6p4_236m_n',
    description:
      'Number of samples with Cyp6p4-236WT/ Cyp6p4-236M genotype (heterozygous).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'CYP6P4 236WT CYP6P4 236M Percent',
    key: 'cyp6p4_236wt_cyp6p4_236m_percent',
    description:
      'Frequency of Cyp6p4-236WT/ Cyp6p4-236M genotype (heterozygous) as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'CYP6P4 236M CYP6P4 236M N',
    key: 'cyp6p4_236m_cyp6p4_236m_n',
    description:
      'Number of samples with Cyp6p4-236M/ Cyp6p4-236M genotype (homozygous resistant).',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'CYP6P4 236M CYP6P4 236M Percent',
    key: 'cyp6p4_236m_cyp6p4_236m_percent',
    description:
      'Frequency of Cyp6p4-236M/ Cyp6p4-236M genotype (homozygous resistant) as a percentage',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'CYP6P4 236WT Percent',
    key: 'cyp6p4_236wt_percent',
    description: 'Frequency of the Cyp6p4-236WT allele as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'CYP6P4 236M Percent',
    key: 'cyp6p4_236m_percent',
    description: 'Frequency of the Cyp6p4-236M allele as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'CYP6AAP WT CYP6AAP WT N',
    key: 'cyp6aap_wt_cyp6aap_wt_n',
    description:
      'Number of samples with Cyp6aap-WT/Cyp6aap-WT genotype (wildtype)',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'CYP6AAP WT CYP6AAP WT Percent',
    key: 'cyp6aap_wt_cyp6aap_wt_percent',
    description:
      'Frequency of Cyp6aap-WT/Cyp6aap-WT genotype (wildtype) as a percentage',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'CYP6AAP WT CYP6AAP DUP1 N',
    key: 'cyp6aap_wt_cyp6aap_dup1_n',
    description:
      'Number of samples with Cyp6aap-WT/Cyp6aap-Dup1 genotype (heterozygous)',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'CYP6AAP WT CYP6AAP DUP1 Percent',
    key: 'cyp6aap_wt_cyp6aap_dup1_percent',
    description:
      'Frequency of Cyp6aap-WT/Cyp6aap-Dup1 genotype (heterozygous) as a percentage',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'CYP6AAP DUP1 CYP6AAP DUP1 N',
    key: 'cyp6aap_dup1_cyp6aap_dup1_n',
    description:
      'Number of samples with Cyp6aap-Dup1/Cyp6aap-Dup1 genotype (homozygous resistant)',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'CYP6AAP DUP1 CYP6AAP DUP1 Percent',
    key: 'cyp6aap_dup1_cyp6aap_dup1_percent',
    description:
      'Frequency of Cyp6aap-Dup1/Cyp6aap-Dup1 genotype (homozygous resistant) as a percentage',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'CYP6AAP WT Percent',
    key: 'cyp6aap_wt_percent',
    description: 'Frequency of the Cyp6aap-WT allele as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'CYP6AAP DUP1 Percent',
    key: 'cyp6aap_dup1_percent',
    description: 'Frequency of the Cyp6aap-Dup1 allele as a percentage.',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Data Abstracted By',
    key: 'data_abstracted_by',
    description: 'Initials of primary data abstractor.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Data Checked By',
    key: 'data_checked_by',
    description:
      'Initials of abstractor that carried out the secondary checks.',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Final Check By',
    key: 'final_check_by',
    description: 'Initials of abstractor that carried out the tertiary checks.',
    type: 'String',
    required: false,
    unique: false,
  },
].map((el) => {
  return Object.keys(el).includes('category') //if category has been set, do not interfere
    ? { ...el, type: el.type as FieldType }
    : { category: 'IR', ...el, type: el.type as FieldType };
});

export const CombinedFields: Field<any>[] = Array.from(
  new Set<Field<any>>([...OccurrenceFields, ...BionomicsFields, ...IRFields])
);
