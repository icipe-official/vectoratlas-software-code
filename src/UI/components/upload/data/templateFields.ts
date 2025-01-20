import { Field } from '../importWizard/types';

export const OccurenceFields: Field<any>[] = [
  {
    label: 'Country',
    key: 'country',
    description: 'Country where data was collected',
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
    description: 'Region in the country where data was collected',
    type: 'Text',
    required: false,
    unique: false,
  },
  {
    label: 'Latitude 1',
    key: 'latitude_1',
    description: 'Latitude 1',
    type: 'Number',
  },
  {
    label: 'Longitude 1',
    key: 'longitude_1',
    description: 'Longitude 1',
    type: 'Number',
  },
  {
    label: 'Latitude 2',
    key: 'latitude_2',
    description: 'Latitude 2',
    type: 'Number',
},
{
    label: 'Longitude 2',
    key: 'longitude_2',
    description: 'Longitude 2',
    type: 'Number',
},
{
    label: 'Latitude 3',
    key: 'latitude_3',
    description: 'Latitude 3',
    type: 'Number',
},
{
    label: 'Longitude 3',
    key: 'longitude_3',
    description: 'Longitude 3',
    type: 'Number',
},
{
    label: 'Latitude 4',
    key: 'latitude_4',
    description: 'Latitude 4',
    type: 'Number',
},
{
    label: 'Longitude 4',
    key: 'longitude_4',
    description: 'Longitude 4',
    type: 'Number',
},
{
    label: 'Latitude 5',
    key: 'latitude_5',
    description: 'Latitude 5',
    type: 'Number',
},
{
    label: 'Longitude 5',
    key: 'longitude_5',
    description: 'Longitude 5',
    type: 'Number',
},
{
    label: 'Latitude 6',
    key: 'latitude_6',
    description: 'Latitude 6',
    type: 'Number',
},
{
    label: 'Longitude 6',
    key: 'longitude_6',
    description: 'Longitude 6',
    type: 'Number',
},
{
    label: 'Latitude 7',
    key: 'latitude_7',
    description: 'Latitude 7',
    type: 'Number',
},
{
    label: 'Longitude 7',
    key: 'longitude_7',
    description: 'Longitude 7',
    type: 'Number',
},
{
    label: 'Latitude 8',
    key: 'latitude_8',
    description: 'Latitude 8',
    type: 'Number',
},
{
    label: 'Longitude 8',
    key: 'longitude_8',
    description: 'Longitude 8',
    type: 'Number',
},
{
    label: 'Confidence in Georef',
    key: 'confidence_in_georef',
    description: 'Confidence in Georef',
    type: 'String',
},
{
    label: 'Area Type',
    key: 'area_type',
    description: 'Area Type',
    type: 'String',
},
{
    label: 'Georef Source',
    key: 'georef_source',
    description: 'Georef Source',
    type: 'String',
},
{
    label: 'Admin Level 1',
    key: 'admin_level_1',
    description: 'Admin Level 1',
    type: 'String',
},
{
    label: 'Admin Level 2',
    key: 'admin_level_2',
    description: 'Admin Level 2',
    type: 'String',
},
{
    label: 'Site Notes',
    key: 'site_notes',
    description: 'Site Notes',
    type: 'String',
},

  {
    label: 'Source ID',
    key: 'source_id',
    description: 'Source ID',
    type: 'String',
},
{
    label: 'Citation DOI',
    key: 'citation_doi',
    description: 'Citation DOI',
    type: 'String',
},
{
    label: 'Author',
    key: 'author',
    description: 'Author',
    type: 'String',
},
{
    label: 'Article Title',
    key: 'article_title',
    description: 'Article Title',
    type: 'String',
},
{
    label: 'Journal Title',
    key: 'journal_title',
    description: 'Journal Title',
    type: 'String',
},
{
    label: 'Publication Year',
    key: 'publication_year',
    description: 'Publication Year',
    type: 'Number',
},
{
    label: 'Study Sampling Design',
    key: 'study_sampling_design',
    description: 'Study Sampling Design',
    type: 'String',
},
{
    label: 'Personal Communication',
    key: 'personal_communication',
    description: 'Personal Communication',
    type: 'String',
},
{
    label: 'Contact Authors',
    key: 'contact_authors',
    description: 'Contact Authors',
    type: 'String',
},
{
    label: 'Source Notes',
    key: 'source_notes',
    description: 'Source Notes',
    type: 'String',
},
{
  label: 'Insecticide Control',
  key: 'insecticide_control',
  description: 'Insecticide Control',
  type: 'String',
},
{
  label: 'Control Type',
  key: 'control_type',
  description: 'Control Type',
  type: 'String',
},
{
  label: 'ITN Use',
  key: 'itn_use',
  description: 'ITN Use',
  type: 'String',
},
{
  label: 'Control Notes',
  key: 'control_notes',
  description: 'Control Notes',
  type: 'String',
},
{
  label: 'Sampling Occurrence 1',
  key: 'sampling_occurrence_1',
  description: 'Sampling Occurrence 1',
  type: 'String',
},
{
  label: 'Occurrence N 1',
  key: 'occurrence_n_1',
  description: 'Occurrence N 1',
  type: 'Number',
},
{
  label: 'Sampling Occurrence 2',
  key: 'sampling_occurrence_2',
  description: 'Sampling Occurrence 2',
  type: 'String',
},
{
  label: 'Occurrence N 2',
  key: 'occurrence_n_2',
  description: 'Occurrence N 2',
  type: 'Number',
},
{
  label: 'Sampling Occurrence 3',
  key: 'sampling_occurrence_3',
  description: 'Sampling Occurrence 3',
  type: 'String',
},
{
  label: 'Occurrence N 3',
  key: 'occurrence_n_3',
  description: 'Occurrence N 3',
  type: 'Number',
},
{
  label: 'Sampling Occurrence 4',
  key: 'sampling_occurrence_4',
  description: 'Sampling Occurrence 4',
  type: 'String',
},
{
  label: 'Occurrence N 4',
  key: 'occurrence_n_4',
  description: 'Occurrence N 4',
  type: 'Number',
},
{
  label: 'Occurrence N Total',
  key: 'occurrence_n_total',
  description: 'Occurrence N Total',
  type: 'Number',
},
{
  label: 'Occurrence Notes',
  key: 'occurrence_notes',
  description: 'Occurrence Notes',
  type: 'String',
},
{
  label: 'Binary Presence',
  key: 'binary_presence',
  description: 'Binary Presence',
  type: 'Boolean',
},
{
  label: 'Binary Absence',
  key: 'binary_absence',
  description: 'Binary Absence',
  type: 'Boolean',
},
{
  label: 'Abundance Data in a Graph',
  key: 'abundance_data_in_a_graph',
  description: 'Abundance Data in a Graph',
  type: 'String',
},
{
  label: 'Month Start',
  key: 'month_start',
  description: 'Month Start',
  type: 'String',
},
{
  label: 'Month End',
  key: 'month_end',
  description: 'Month End',
  type: 'String',
},
{
  label: 'Year Start',
  key: 'year_start',
  description: 'Year Start',
  type: 'Number',
},
{
  label: 'Year End',
  key: 'year_end',
  description: 'Year End',
  type: 'Number',
},
{
  label: 'Season Given',
  key: 'season_given',
  description: 'Season Given',
  type: 'String',
},
{
  label: 'Season Calc',
  key: 'season_calc',
  description: 'Season Calc',
  type: 'String',
},
{
  label: 'Rainfall Time',
  key: 'rainfall_time',
  description: 'Rainfall Time',
  type: 'String',
},
{
  label: 'Season Notes',
  key: 'season_notes',
  description: 'Season Notes',
  type: 'String',
},
{
  label: 'Species',
  key: 'species',
  description: 'Species',
  type: 'String',
},
{
  label: 'Species Notes',
  key: 'species_notes',
  description: 'Species Notes',
  type: 'String',
},
{
  label: 'Species ID 1',
  key: 'species_id_1',
  description: 'Species ID 1',
  type: 'String',
},
{
  label: 'Species ID 2',
  key: 'species_id_2',
  description: 'Species ID 2',
  type: 'String',
},

];

export const BionomicsFields: Field<any>[] = [
  ...OccurenceFields,
  {
    label: 'Adult Data',
    key: 'adult_data',
    description: 'Information on adult vector',
    type: 'Boolean',
    required: false,
    unique: false,
  },
];

// export const IRFields: Field<any>[] = [
//   ...OccurenceFields,
//   {
//     label: 'Insecticide Control',
//     key: 'insecticide control',
//     description: 'Information on insecticide control',
//     type: 'Boolean',
//     required: false,
//     unique: false,
//   },
// ];

export const IRFields: Field<any>[] = [
  ...OccurenceFields,
  {
    label: 'Insecticide Control',
    key: 'insecticide_control',
    description: 'Information on insecticide control',
    type: 'Boolean',
    required: false,
    unique: false,
  },
  {
    label: 'Control Type',
    key: 'control_type',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'ITN Use',
    key: 'itn_use',
    description: '', 
    type: 'Boolean',
    required: false,
    unique: false,
  },
  {
    label: 'Control Notes',
    key: 'control_notes',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Sampling Occurrence 1',
    key: 'sampling_occurrence_1',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Occurrence N 1',
    key: 'occurrence_n_1',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Sampling Occurrence 2',
    key: 'sampling_occurrence_2',
    description: '',
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Occurrence N 2',
    key: 'occurrence_n_2',
    description: '',
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Sampling Occurrence 3',
    key: 'sampling_occurrence_3',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Occurrence N 3',
    key: 'occurrence_n_3',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Sampling Occurrence 4',
    key: 'sampling_occurrence_4',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Occurrence N 4',
    key: 'occurrence_n_4',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Occurrence N Total',
    key: 'occurrence_n_total',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Occurrence Notes',
    key: 'occurrence_notes',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Binary Presence',
    key: 'binary_presence',
    description: '', 
    type: 'Boolean',
    required: false,
    unique: false,
  },
  {
    label: 'Binary Absence',
    key: 'binary_absence',
    description: '', 
    type: 'Boolean',
    required: false,
    unique: false,
  },
  {
    label: 'Abundance Data in a Graph',
    key: 'abundance_data_in_a_graph',
    description: '', 
    type: 'Boolean',
    required: false,
    unique: false,
  },
  {
    label: 'Month Start',
    key: 'month_start',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Month End',
    key: 'month_end',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Year Start',
    key: 'year_start',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Year End',
    key: 'year_end',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Season Given',
    key: 'season_given',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Season Calculated',
    key: 'season_calc',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Rainfall Time',
    key: 'rainfall_time',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Season Notes',
    key: 'season_notes',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Species',
    key: 'species',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Species Notes',
    key: 'species_notes',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Species ID 1',
    key: 'species_id_1',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Species ID 2',
    key: 'species_id_2',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Roof',
    key: 'roof',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Walls',
    key: 'walls',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'House Screening',
    key: 'house_screening',
    description: '', 
    type: 'Boolean',
    required: false,
    unique: false,
  },
  {
    label: 'Open Eaves',
    key: 'open_eaves',
    description: '', 
    type: 'Boolean',
    required: false,
    unique: false,
  },
  {
    label: 'Cooking',
    key: 'cooking',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Housing Notes',
    key: 'housing_notes',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Common Occupation 1',
    key: 'common_occupation_1',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Common Occupation 2',
    key: 'common_occupation_2',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Common Occupation 3',
    key: 'common_occupation_3',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Outdoor Activities at Night',
    key: 'outdoor_activities_at_night',
    description: '', 
    type: 'Boolean',
    required: false,
    unique: false,
  },
  {
    label: 'Sleeping Outdoors',
    key: 'sleeping_outdoors',
    description: '', 
    type: 'Boolean',
    required: false,
    unique: false,
  },
  {
    label: 'Outdoor Timings Hours',
    key: 'outdoor_timings_hours',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Outdoor Activities Notes',
    key: 'outdoor_activities_notes',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Average Bedtime',
    key: 'average_bedtime',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Average Wake Time',
    key: 'average_wake_time',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Time People Leave Home in Morning',
    key: 'time_people_leave_home_in_morning',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Hours Spent Away from Home Per Day',
    key: 'hours_spent_away_from_home_per_day',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Seasonal Labour',
    key: 'seasonal_labour',
    description: '', 
    type: 'Boolean',
    required: false,
    unique: false,
  },
  {
    label: 'Community Notes',
    key: 'community_notes',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Forest',
    key: 'forest',
    description: '', 
    type: 'Boolean',
    required: false,
    unique: false,
  },
  {
    label: 'Farming',
    key: 'farming',
    description: '', 
    type: 'Boolean',
    required: false,
    unique: false,
  },
  {
    label: 'Farming Notes',
    key: 'farming_notes',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Livestock 1',
    key: 'livestock_1',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Livestock 2',
    key: 'livestock_2',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Livestock 3',
    key: 'livestock_3',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Livestock 4',
    key: 'livestock_4',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Livestock Notes',
    key: 'livestock_notes',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Local Plants',
    key: 'local_plants',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Environment Notes',
    key: 'environment_notes',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Sampling Biology 1',
    key: 'sampling_biology_1',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Sampling Biology 2',
    key: 'sampling_biology_2',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Sampling Biology 3',
    key: 'sampling_biology_3',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Sampling Biology N',
    key: 'sampling_biology_n',
    description: '', 
    type: 'Boolean',
    required: false,
    unique: false,
  },
  {
    label: 'Parity N',
    key: 'parity_n',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Parity Total',
    key: 'parity_total',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Parity Percent',
    key: 'parity_percent',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Daily Survival Rate Percent',
    key: 'daily_survival_rate_percent',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Fecundity Mean Batch Size',
    key: 'fecundity_mean_batch_size',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Gonotrophic Cycle Days',
    key: 'gonotrophic_cycle_days',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Biology Notes',
    key: 'biology_notes',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Sampling Infection 1',
    key: 'sampling_infection_1',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Sampling Infection 2',
    key: 'sampling_infection_2',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Sampling Infection 3',
    key: 'sampling_infection_3',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Sampling Infection N',
    key: 'sampling_infection_n',
    description: '', 
    type: 'Boolean',
    required: false,
    unique: false,
  },
  {
    label: 'Sporozoite Rate by Dissection N',
    key: 'sporozoite_rate_by_dissection_n',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Sporozoite Rate by Dissection Total',
    key: 'sporozoite_rate_by_dissection_total',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Sporozoite Rate by Dissection Percent',
    key: 'sporozoite_rate_by_dissection_percent',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Sporozoite Rate by CSP N Pool',
    key: 'sporozoite_rate_by_csp_n_pool',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Sporozoite Rate by CSP Total Pool',
    key: 'sporozoite_rate_by_csp_total_pool',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Sporozoite Rate by CSP Percent',
    key: 'sporozoite_rate_by_csp_percent',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Sporozoite Rate P. falciparum N',
    key: 'sporozoite_rate_p_falciparum_n',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Sporozoite Rate P. falciparum Total',
    key: 'sporozoite_rate_p_falciparum_total',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Sporozoite Rate P. falciparum Percent',
    key: 'sporozoite_rate_p_falciparum_percent',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Sporozoite Rate P. vivax N',
    key: 'sporozoite_rate_p_vivax_n',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Sporozoite Rate P. vivax Total',
    key: 'sporozoite_rate_p_vivax_total',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Sporozoite Rate P. vivax Percent',
    key: 'sporozoite_rate_p_vivax_percent',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Oocyst N',
    key: 'oocyst_n',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Oocyst Total',
    key: 'oocyst_total',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Oocyst Rate Percent',
    key: 'oocyst_rate_percent',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'EIR',
    key: 'eir',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'EIR Period',
    key: 'eir_period',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Extrinsic Incubation Period Days',
    key: 'ext_incubation_period_days',
    description: '', 
    type: 'Number',
    required: false,
    unique: false,
  },
  {
    label: 'Infection Notes',
    key: 'infection_notes',
    description: '', 
    type: 'String',
    required: false,
    unique: false,
  },
  {
    label: 'Infection Notes',
    key: 'infection_notes',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'HBR Sampling Indoor',
    key: 'hbr_sampling_indoor',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Indoor HBR',
    key: 'indoor_hbr',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'HBR Sampling Outdoor',
    key: 'hbr_sampling_outdoor',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Outdoor HBR',
    key: 'outdoor_hbr',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'HBR Sampling Combined 1',
    key: 'hbr_sampling_combined_1',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'HBR Sampling Combined 2',
    key: 'hbr_sampling_combined_2',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'HBR Sampling Combined 3',
    key: 'hbr_sampling_combined_3',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'HBR Sampling Combined N',
    key: 'hbr_sampling_combined_n',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Combined HBR',
    key: 'combined_hbr',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'HBR Unit',
    key: 'hbr_unit',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'ABR Sampling 1',
    key: 'abr_sampling_1',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'ABR Sampling 2',
    key: 'abr_sampling_2',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'ABR Sampling 3',
    key: 'abr_sampling_3',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'ABR Sampling N',
    key: 'abr_sampling_n',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'ABR',
    key: 'abr',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'ABR Unit',
    key: 'abr_unit',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Biting Rate Notes',
    key: 'biting_rate_notes',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Host Sampling Indoor',
    key: 'host_sampling_indoor',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Indoor Host N',
    key: 'indoor_host_n',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Indoor Host Total',
    key: 'indoor_host_total',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Indoor Host Percent',
    key: 'indoor_host_percent',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Host Sampling Outdoor',
    key: 'host_sampling_outdoor',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Outdoor Host N',
    key: 'outdoor_host_n',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Outdoor Host Total',
    key: 'outdoor_host_total',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Outdoor Host Percent',
    key: 'outdoor_host_percent',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Host Sampling Combined 1',
    key: 'host_sampling_combined_1',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Host Sampling Combined 2',
    key: 'host_sampling_combined_2',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Host Sampling Combined 3',
    key: 'host_sampling_combined_3',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Host Sampling Combined N',
    key: 'host_sampling_combined_n',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Combined Host N',
    key: 'combined_host_n',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Combined Host Total',
    key: 'combined_host_total',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Combined Host',
    key: 'combined_host',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Host Unit',
    key: 'host_unit',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Host Sampling Other 1',
    key: 'host_sampling_other_1',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Host Sampling Other 2',
    key: 'host_sampling_other_2',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Host Sampling Other 3',
    key: 'host_sampling_other_3',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Host Sampling Other N',
    key: 'host_sampling_other_n',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Other Host N',
    key: 'other_host_n',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Other Host Total',
    key: 'other_host_total',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Host Other',
    key: 'host_other',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Host Other Unit',
    key: 'host_other_unit',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Host Notes',
    key: 'host_notes',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Biting Number of Sampling Nights Indoors',
    key: 'biting_number_of_sampling_nights_indoors',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Biting Sampling Indoor',
    key: 'biting_sampling_indoor',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Indoor Biting N',
    key: 'indoor_biting_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Indoor Biting Total',
    key: 'indoor_biting_total',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Indoor Biting Data',
    key: 'indoor_biting_data',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Biting Number of Sampling Nights Outdoors',
    key: 'biting_number_of_sampling_nights_outdoors',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Biting Sampling Outdoor',
    key: 'biting_sampling_outdoor',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Outdoor Biting N',
    key: 'outdoor_biting_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Outdoor Biting Total',
    key: 'outdoor_biting_total',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Outdoor Biting Data',
    key: 'outdoor_biting_data',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Indoor Outdoor Biting Unit',
    key: 'indoor_outdoor_biting_unit',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Indoor Outdoor Biting Notes',
    key: 'indoor_outdoor_biting_notes',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Biting Activity Indoor Number of Sampling Nights',
    key: 'biting_activity_indoor_number_of_sampling_nights',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '1800-1900 Indoor',
    key: '1800_1900_in',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '1900-2000 Indoor',
    key: '1900_2000_in',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '2000-2100 Indoor',
    key: '2000_2100_in',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '2100-2200 Indoor',
    key: '2100_2200_in',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '2200-2300 Indoor',
    key: '2200_2300_in',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '2300-0000 Indoor',
    key: '2300_0000_in',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '0000-0100 Indoor',
    key: '0000_0100_in',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '0100-0200 Indoor',
    key: '0100_0200_in',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '0200-0300 Indoor',
    key: '0200_0300_in',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '0300-0400 Indoor',
    key: '0300_0400_in',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '0400-0500 Indoor',
    key: '0400_0500_in',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '0500-0600 Indoor',
    key: '0500_0600_in',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '1830-2130 Indoor',
    key: '1830_2130_in',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '2130-0030 Indoor',
    key: '2130_0030_in',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '0030-0330 Indoor',
    key: '0030_0330_in',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '0330-0630 Indoor',
    key: '0330_0630_in',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Biting Activity Outdoor Number of Sampling Nights',
    key: 'biting_activity_outdoor_number_of_sampling_nights',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '1800-1900 Outdoor',
    key: '1800_1900_out',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '1900-2000 Outdoor',
    key: '1900_2000_out',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '2000-2100 Outdoor',
    key: '2000_2100_out',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '2100-2200 Outdoor',
    key: '2100_2200_out',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '2200-2300 Outdoor',
    key: '2200_2300_out',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '2300-0000 Outdoor',
    key: '2300_0000_out',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '0000-0100 Outdoor',
    key: '0000_0100_out',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '0100-0200 Outdoor',
    key: '0100_0200_out',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '0200-0300 Outdoor',
    key: '0200_0300_out',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '0300-0400 Outdoor',
    key: '0300_0400_out',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '0400-0500 Outdoor',
    key: '0400_0500_out',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '0500-0600 Outdoor',
    key: '0500_0600_out',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '1830-2130 Outdoor',
    key: '1830_2130_out',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '2130-0030 Outdoor',
    key: '2130_0030_out',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '0030-0330 Outdoor',
    key: '0030_0330_out',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '0330-0630 Outdoor',
    key: '0330_0630_out',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Biting Activity Combined Number of Sampling Nights',
    key: 'biting_activity_combined_number_of_sampling_nights',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '1800-1900 Combined',
    key: '1800_1900_combined',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '1900-2000 Combined',
    key: '1900_2000_combined',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '2000-2100 Combined',
    key: '2000_2100_combined',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '2100-2200 Combined',
    key: '2100_2200_combined',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '2200-2300 Combined',
    key: '2200_2300_combined',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '2300-0000 Combined',
    key: '2300_0000_combined',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '0000-0100 Combined',
    key: '0000_0100_combined',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '0100-0200 Combined',
    key: '0100_0200_combined',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '0200-0300 Combined',
    key: '0200_0300_combined',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '0300-0400 Combined',
    key: '0300_0400_combined',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '0400-0500 Combined',
    key: '0400_0500_combined',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '0500-0600 Combined',
    key: '0500_0600_combined',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '1830-2130 Combined',
    key: '1830_2130_combined',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '2130-0030 Combined',
    key: '2130_0030_combined',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '0030-0330 Combined',
    key: '0030_0330_combined',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: '0330-0630 Combined',
    key: '0330_0630_combined',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Biting Notes',
    key: 'biting_notes',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Resting Sampling Indoor',
    key: 'resting_sampling_indoor',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Unfed Indoor',
    key: 'unfed_indoor',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Fed Indoor',
    key: 'fed_indoor',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Gravid Indoor',
    key: 'gravid_indoor',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Total Indoor',
    key: 'total_indoor',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Resting Sampling Outdoor',
    key: 'resting_sampling_outdoor',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Unfed Outdoor',
    key: 'unfed_outdoor',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Fed Outdoor',
    key: 'fed_outdoor',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Gravid Outdoor',
    key: 'gravid_outdoor',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Total Outdoor',
    key: 'total_outdoor',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Resting Sampling Other',
    key: 'resting_sampling_other',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Unfed Other',
    key: 'unfed_other',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Fed Other',
    key: 'fed_other',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Gravid Other',
    key: 'gravid_other',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Total Other',
    key: 'total_other',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Resting Unit',
    key: 'resting_unit',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Resting Notes',
    key: 'resting_notes',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Instars Found 1',
    key: 'larval_instars_found_1',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Larval Habitat 1',
    key: 'larval_habitat_1',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Site Character 1',
    key: 'larval_site_character_1',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Turbidity 1',
    key: 'larval_turbidity_1',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Salinity 1',
    key: 'larval_salinity_1',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Vegetation 1',
    key: 'larval_vegetation_1',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Shade 1',
    key: 'larval_shade_1',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Water Current 1',
    key: 'larval_water_current_1',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Size 1',
    key: 'larval_size_1',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Depth 1',
    key: 'larval_depth_1',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Permanence 1',
    key: 'larval_permanence_1',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Other Fauna 1',
    key: 'larval_other_fauna_1',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Control Present 1',
    key: 'larval_control_present_1',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Instars Found 2',
    key: 'larval_instars_found_2',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Larval Habitat 2',
    key: 'larval_habitat_2',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Site Character 2',
    key: 'larval_site_character_2',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Turbidity 2',
    key: 'larval_turbidity_2',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Salinity 2',
    key: 'larval_salinity_2',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Vegetation 2',
    key: 'larval_vegetation_2',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Shade 2',
    key: 'larval_shade_2',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Water Current 2',
    key: 'larval_water_current_2',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Size 2',
    key: 'larval_size_2',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Depth 2',
    key: 'larval_depth_2',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Permanence 2',
    key: 'larval_permanence_2',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Other Fauna 2',
    key: 'larval_other_fauna_2',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Control Present 2',
    key: 'larval_control_present_2',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Instars Found 3',
    key: 'larval_instars_found_3',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Larval Habitat 3',
    key: 'larval_habitat_3',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Site Character 3',
    key: 'larval_site_character_3',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Turbidity 3',
    key: 'larval_turbidity_3',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Salinity 3',
    key: 'larval_salinity_3',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Vegetation 3',
    key: 'larval_vegetation_3',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Shade 3',
    key: 'larval_shade_3',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Water Current 3',
    key: 'larval_water_current_3',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Size 3',
    key: 'larval_size_3',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Depth 3',
    key: 'larval_depth_3',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Permanence 3',
    key: 'larval_permanence_3',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Other Fauna 3',
    key: 'larval_other_fauna_3',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Control Present 3',
    key: 'larval_control_present_3',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Larval Notes',
    key: 'larval_notes',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Bioassay Representative of Complex at Site',
    key: 'bioassay_representative_of_complex_at_site',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Bioassay Representative of Complex at Site if Disaggregated Values Combined Without Adjustments',
    key: 'bioassay_representative_of_complex_at_site_if_disaggregated_values_combined_without_adjustments',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Generation',
    key: 'generation',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Wild Caught Larvae or Adults',
    key: 'wild_caught_larvae_or_adults',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Lower Age (Days)',
    key: 'lower_age_days',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Upper Age (Days)',
    key: 'upper_age_days',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Test Protocol',
    key: 'test_protocol',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Insecticide Tested',
    key: 'insecticide_tested',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Insecticide Class',
    key: 'insecticide_class',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'IRAC MOA',
    key: 'irac_moa',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'IRAC MOA Code',
    key: 'irac_moa_code',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Concentration Percent',
    key: 'concentration_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Concentration (Micrograms)',
    key: 'concentration_micrograms',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Exposure Period (Min)',
    key: 'exposure_period_min',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Intensity Multiplier',
    key: 'intensity_multiplier',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Synergist Tested',
    key: 'synergist_tested',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Synergist Concentration',
    key: 'synergist_concentration',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Synergist Concentration Unit',
    key: 'synergist_concentration_unit',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Mosquitoes Tested (N)',
    key: 'mosquitoes_tested_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Mosquitoes Dead (N)',
    key: 'mosquitoes_dead_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Percent Mortality',
    key: 'percent_mortality',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Knock Down Exposure Time (Min)',
    key: 'knock_down_exposure_time_min',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Mosquitoes Knocked Down (N)',
    key: 'mosquitoes_knocked_down_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Knock Down Percent',
    key: 'knock_down_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'KDT 50 Percent (Min)',
    key: 'kdt_50_percent_min',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'KDT 90 Percent (Min)',
    key: 'kdt_90_percent_min',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'KDT 95 Percent (Min)',
    key: 'kdt_95_percent_min',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Bioassay Notes',
    key: 'bioassay_notes',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Genotypic Test Representative of Species at Site',
    key: 'genotypic_test_representative_of_species_at_site',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Genotypic Test Representative of Species at Site if Disaggregated Values Combined Without Adjustments',
    key: 'genotypic_test_representative_of_species_at_site_if_disaggregated_values_combined_without_adjustments',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Minor Species Missing Allele Frequency Data',
    key: 'minor_species_missing_allele_frequency_data',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Notes on Population Representative',
    key: 'notes_on_population_representative',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Genotypic Sample First Been Through Bioassay Tests',
    key: 'genotypic_sample_first_been_through_bioassay_tests',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Genotypic Sample Linked to a Specific Bioassay',
    key: 'genotypic_sample_linked_to_a_specific_bioassay',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Bioassay Subsample Used in Genotypic Test',
    key: 'bioassay_subsample_used_in_genotypic_test',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Notes on Bioassay Linkage',
    key: 'notes_on_bioassay_linkage',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'VGSC Method 1',
    key: 'vgsc_method_1',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'VGSC Method 2',
    key: 'vgsc_method_2',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'VGSC Number of Mosquitoes Tested',
    key: 'vgsc_number_of_mosquitoes_tested',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC Generation',
    key: 'vgsc_generation',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'VGSC KDR Notes',
    key: 'vgsc_kdr_notes',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'VGSC995L VGSC995L N',
    key: 'vgsc995l_vgsc995l_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC995L VGSC995L Percent',
    key: 'vgsc995l_vgsc995l_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC995L VGSC995F N',
    key: 'vgsc995l_vgsc995f_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC995L VGSC995F Percent',
    key: 'vgsc995l_vgsc995f_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC995F VGSC995F N',
    key: 'vgsc995f_vgsc995f_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC995F VGSC995F Percent',
    key: 'vgsc995f_vgsc995f_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC995L VGSC995S N',
    key: 'vgsc995l_vgsc995s_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC995L VGSC995S Percent',
    key: 'vgsc995l_vgsc995s_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC995S VGSC995S N',
    key: 'vgsc995s_vgsc995s_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC995S VGSC995S Percent',
    key: 'vgsc995s_vgsc995s_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC995L VGSC995C N',
    key: 'vgsc995l_vgsc995c_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC995L VGSC995C Percent',
    key: 'vgsc995l_vgsc995c_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC995C VGSC995C N',
    key: 'vgsc995c_vgsc995c_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC995C VGSC995C Percent',
    key: 'vgsc995c_vgsc995c_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Null VGSC995C or VGSC995C VGSC995C N',
    key: 'null_vgsc995c_or_vgsc995c_vgsc995c_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Null VGSC995C or VGSC995C VGSC995C Percent',
    key: 'null_vgsc995c_or_vgsc995c_vgsc995c_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC995F VGSC995S N',
    key: 'vgsc995f_vgsc995s_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC995F VGSC995S Percent',
    key: 'vgsc995f_vgsc995s_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC995F VGSC995C N',
    key: 'vgsc995f_vgsc995c_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC995F VGSC995C Percent',
    key: 'vgsc995f_vgsc995c_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Susceptible Susceptible N',
    key: 'susceptible_susceptible_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Susceptible Susceptible Percent',
    key: 'susceptible_susceptible_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Resistant Susceptible N',
    key: 'resistant_susceptible_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Resistant Susceptible Percent',
    key: 'resistant_susceptible_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Resistant Resistant N',
    key: 'resistant_resistant_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Resistant Resistant Percent',
    key: 'resistant_resistant_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC995L Percent',
    key: 'vgsc995l_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC995F Percent',
    key: 'vgsc995f_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC995S Percent',
    key: 'vgsc995s_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC995C Percent',
    key: 'vgsc995c_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'KDR Percent',
    key: 'kdr_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC402V VGSC402V N',
    key: 'vgsc402v_vgsc402v_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC402V VGSC402V Percent',
    key: 'vgsc402v_vgsc402v_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC402V VGSC402L N',
    key: 'vgsc402v_vgsc402l_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC402V VGSC402L Percent',
    key: 'vgsc402v_vgsc402l_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC402L VGSC402L N',
    key: 'vgsc402l_vgsc402l_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC402L VGSC402L Percent',
    key: 'vgsc402l_vgsc402l_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC402V Percent',
    key: 'vgsc402v_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC 402L Percent',
    key: 'vgsc_402l_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC1570N VGSC1570N N',
    key: 'vgsc1570n_vgsc1570n_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC1570N VGSC1570N Percent',
    key: 'vgsc1570n_vgsc1570n_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC1570N VGSC1570Y N',
    key: 'vgsc1570n_vgsc1570y_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC1570N VGSC1570Y Percent',
    key: 'vgsc1570n_1570y_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC1570Y VGSC1570Y N',
    key: 'vgsc1570y_vgsc1570y_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC1570Y VGSC1570Y Percent',
    key: 'vgsc1570y_vgsc1570y_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC1570N Percent',
    key: 'vgsc1570n_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'VGSC1570Y Percent',
    key: 'vgsc1570y_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'RDL Method 1',
    key: 'rdl_method_1',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'RDL Number of Mosquitoes Tested',
    key: 'rdl_number_of_mosquitoes_tested',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'RDL Generation',
    key: 'rdl_generation',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'RDL Notes',
    key: 'rdl_notes',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'RDL296C RDL296C N',
    key: 'rdl296c_rdl296c__n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'RDL296C RDL296C Percent',
    key: 'rdl296c_rdl296c_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'RDL296C RDL296G N',
    key: 'rdl296c_rdl296g_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'RDL296C RDL296G Percent',
    key: 'rdl296c_rdl296g_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'RDL296G RDL296G N',
    key: 'rdl296g_rdl296g_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'RDL296G RDL296G Percent',
    key: 'rdl296g_rdl296g_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'RDL296C RDL296S N',
    key: 'rdl296c_rdl296s_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'RDL296C RDL296S Percent',
    key: 'rdl296c_rdl296s_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'RDL296S RDL296S N',
    key: 'rdl296s_rdl296s_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'RDL296S RDL296S Percent',
    key: 'rdl296s_rdl296s_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'RDL296G RDL296S N',
    key: 'rdl296g_rdl296s_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'RDL296G RDL296S Percent',
    key: 'rdl296g_rdl296s_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'RDL296C Percent',
    key: 'rdl296c_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'RDL296G Percent',
    key: 'rdl296g_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'RDL296S Percent',
    key: 'rdl296s_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'ACE1 Method 1',
    key: 'ace1_method_1',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'ACE1 Number of Mosquitoes Tested',
    key: 'ace1_number_of_mosquitoes_tested',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'ACE1 Generation',
    key: 'ace1_generation',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'ACE1 Notes',
    key: 'ace1_notes',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'ACE1 280G ACE1 280G N',
    key: 'ace1_280g_ace1_280g_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'ACE1 280G ACE1 280G Percent',
    key: 'ace1_280g_ace1_280g_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'ACE1 280G ACE1 280S N',
    key: 'ace1_280g_ace1_280s_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'ACE1 280G ACE1 280S Percent',
    key: 'ace1_280g_ace1_280s_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'ACE1 280S ACE1 280S N',
    key: 'ace1_280s_ace1_280s_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'ACE1 280S ACE1 280S Percent',
    key: 'ace1_280s_ace1_280s_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'ACE1 280G Percent',
    key: 'ace1_280g_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'ACE1 280S Percent',
    key: 'ace1_280s_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'GSTE Method 1',
    key: 'gste_method_1',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'GSTE Number of Mosquitoes Tested',
    key: 'gste_number_of_mosquitoes_tested',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'GSTE Generation',
    key: 'gste_generation',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'GSTE Notes',
    key: 'gste_notes',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'GSTE2 114I GSTE2 114I N',
    key: 'gste2_114i_gste2_114i_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'GSTE2 114I GSTE2 114I Percent',
    key: 'gste2_114i_gste2_114i_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'GSTE2 114I GSTE2 114T N',
    key: 'gste2_114i_gste2_114t_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'GSTE2 114I GSTE2 114T Percent',
    key: 'gste2_114i_gste2_114t_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'GSTE2 114T GSTE2 114T N',
    key: 'gste2_114t_gste2_114t_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'GSTE2 114T GSTE2 114T Percent',
    key: 'gste2_114t_gste2_114t_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'GSTE2 114I Percent',
    key: 'gste2_114i_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'GSTE2 114T Percent',
    key: 'gste2_114t_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'GSTE2 119L GSTE2 119L N',
    key: 'gste2_119l_gste2_119l_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'GSTE2 119L GSTE2 119L Percent',
    key: 'gste2_119l_gste2_119l_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'GSTE2 119L GSTE2 119V N',
    key: 'gste2_119l_gste2_119v_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'GSTE2 119L GSTE2 119V Percent',
    key: 'gste2_119l_gste2_119v_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'GSTE2 119V GSTE2 119V N',
    key: 'gste2_119v_gste2_119v_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'GSTE2 119V GSTE2 119V Percent',
    key: 'gste2_119v_gste2_119v_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'GSTE2 119L Percent',
    key: 'gste2_119l_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'GSTE2 119V Percent',
    key: 'gste2_119v_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'CYP Method 1',
    key: 'cyp_method_1',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'CYP Number of Mosquitoes Tested',
    key: 'cyp_number_of_mosquitoes_tested',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'CYP Generation',
    key: 'cyp_generation',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'CYP Notes',
    key: 'cyp_notes',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'CYP4J5 43L CYP4J5 43L N',
    key: 'cyp4j5_43l_cyp4j5_43l_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'CYP4J5 43L CYP4J5 43L Percent',
    key: 'cyp4j5_43l_cyp4j5_43l_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'CYP4J5 43L CYP4J5 43F N',
    key: 'cyp4j5_43l_cyp4j5_43f_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'CYP4J5 43L CYP4J5 43F Percent',
    key: 'cyp4j5_43l_cyp4j5_43f_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'CYP4J5 43F CYP4J5 43F N',
    key: 'cyp4j5_43f_cyp4j5_43f_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'CYP4J5 43F CYP4J5 43F Percent',
    key: 'cyp4j5_43f_cyp4j5_43f_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'CYP4J5 43L Percent',
    key: 'cyp4j5_43l_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'CYP4J5 43F Percent',
    key: 'cyp4j5_43f_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'CYP6P4 236WT CYP6P4 236WT N',
    key: 'cyp6p4_236wt_cyp6p4_236wt_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'CYP6P4 236WT CYP6P4 236WT Percent',
    key: 'cyp6p4_236wt_cyp6p4_236wt_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'CYP6P4 236WT CYP6P4 236M N',
    key: 'cyp6p4_236wt_cyp6p4_236m_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'CYP6P4 236WT CYP6P4 236M Percent',
    key: 'cyp6p4_236wt_cyp6p4_236m_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'CYP6P4 236M CYP6P4 236M N',
    key: 'cyp6p4_236m_cyp6p4_236m_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'CYP6P4 236M CYP6P4 236M Percent',
    key: 'cyp6p4_236m_cyp6p4_236m_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'CYP6P4 236WT Percent',
    key: 'cyp6p4_236wt_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'CYP6P4 236M Percent',
    key: 'cyp6p4_236m_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'CYP6AAP WT CYP6AAP WT N',
    key: 'cyp6aap_wt_cyp6aap_wt_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'CYP6AAP WT CYP6AAP WT Percent',
    key: 'cyp6aap_wt_cyp6aap_wt_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'CYP6AAP WT CYP6AAP DUP1 N',
    key: 'cyp6aap_wt_cyp6aap_dup1_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'CYP6AAP WT CYP6AAP DUP1 Percent',
    key: 'cyp6aap_wt_cyp6aap_dup1_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'CYP6AAP DUP1 CYP6AAP DUP1 N',
    key: 'cyp6aap_dup1_cyp6aap_dup1_n',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'CYP6AAP DUP1 CYP6AAP DUP1 Percent',
    key: 'cyp6aap_dup1_cyp6aap_dup1_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'CYP6AAP WT Percent',
    key: 'cyp6aap_wt_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'CYP6AAP DUP1 Percent',
    key: 'cyp6aap_dup1_percent',
    description: '',
    type: 'Number',
    required: false,
    unique: false
  },
  {
    label: 'Data Abstracted By',
    key: 'data_abstracted_by',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Data Checked By',
    key: 'data_checked_by',
    description: '',
    type: 'String',
    required: false,
    unique: false
  },
  {
    label: 'Final Check By',
    key: 'final_check_by',
    description: '',
    type: 'String',
    required: false,
    unique: false
  }
]









