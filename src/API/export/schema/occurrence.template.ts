// src/export/templates/occurrence.template.ts
export const OCCURRENCE_TEMPLATE = [
  // {
  //   column: 'confidentiality_status',
  //   path: 'data_categorization.confidentiality_status',
  // },
  {
    column: 'bio_data',
    path: 'occurrence.bio_data',
  },
  {
    column: 'adult_data',
    path: 'bionomics data.adult_data',
  },
  {
    column: 'larval_site_data',
    path: 'bionomics data.larval_site_data',
  },
  // {
  //   column: 'insecticide_resistance_daat',
  //   path: 'data_categorization.insecticide_resistance_data',
  // },
  {
    column: 'source_id',
    path: 'occurrence.source_id',
  },
  {
    column: 'citation_doi',
    path: 'source_information.citation_doi',
  },
  {
    column: 'author',
    path: 'doi.author',
  },

  {
    column: 'article_title',
    path: 'reference.article_title',
  },
  {
    column: 'journal_title',
    path: 'reference.journal_title',
  },
  {
    column: 'publication_year',
    path: 'doi.publication_year',
  },
  {
    column: 'study_sampling_design',
    path: 'bionomics.study_sampling_design',
  },
  {
    column: 'personal_communication',
    path: 'occurrence.personal_communication',
  },
  {
    column: 'contact_authors',
    path: 'bionomics.contact_authors',
  },
  {
    column: 'source_notes',
    path: 'occurrence.source_notes',
  },
   {
    column: 'country',
    path: 'site.country',
  },
  {
    column: 'site',
    path: 'bionomics.site',
  },
  {
    column: 'latitude_1',
    path: 'site_and_georeferencing.latitude_1',
  },
  {
    column: 'longitude_1',
    path: 'site_and_georeferencing.longitude_1',
  },
  {
    column: 'latitude_2',
    path: 'site.latitude_2',
  },
  {
    column: 'longitude_2',
    path: 'site.lOngitude_2',
  },
  {
    column: 'latitude_3',
    path: 'site.latitude_3',
  },
  {
    column: 'longitude_3',
    path: 'site.longitude_3',
  },
  {
    column: 'latitude_4',
    path: 'site.latitude_4',
  },
  {
    column: 'longitude_4',
    path: 'site.longitude_4',
  },
  {
    column: 'latitude_5',
    path: 'site.latitude_5',
  },
  {
    column: 'longitude_5',
    path: 'site.longitude_5',
  },
  {
    column: 'latitude_6',
    path: 'site.latitude_6',
  },
  {
    column: 'longitude_6',
    path: 'site.longitude_6',
  },
  {
    column: 'latitude_7',
    path: 'site.latitude_7',
  },
  {
    column: 'longitude_7',
    path: 'site.longitude_7',
  },
  {
    column: 'latitude_8',
    path: 'site.latitude_8',
  },
  {
    column: 'longitude_8',
    path: 'site.longitude_8',
  },
  {
    column: 'confidence_in_georef',
    path: 'site.confidence_in_georef',
  },
  {
    column: 'area_type',
    path: 'site.area_type',
  },
  {
    column: 'georef_source',
    path: 'site.georef_source',
  },
  {
    column: 'admin_level_1',
    path: 'site.admin_level_1',
  },
  {
    column: 'admin_level_2',
    path: 'site.admin_level_2',
  },
  {
    column: 'site_notes',
    path: 'site.site_notes',
  },
  {
    column: 'insecticide_control',
    path: 'bionomics.insecticide_control',
  },
  {
    column: 'control_type',
    path: 'sample.control_type',
  },
  {
    column: 'itn_use',
    path: 'bionomics.itn_use',
  },
  {
    column: 'control_notes',
    path: 'bionomics.control_notes',
  },
  {
    column: 'sampling_occurrence_1',
    path: 'sample.sampling_occurrence_1',
  },
  {
    column: 'occurrence_n_1',
    path: 'sample.occurrence_n_1',
  },
  {
    column: 'sampling_occurrence_2',
    path: 'sample.sampling_occurrence_2',
  },
  {
    column: 'occurrence_n_2',
    path: 'sample.occurrence_n_2',
  },
  {
    column: 'sampling_occurrence_3',
    path: 'sample.sampling_occurrence_3',
  },
  {
    column: 'occurrence_n_3',
    path: 'sample.occurrence_n_3',
  },
  {
    column: 'sampling_occurrence_4',
    path: 'sample.sampling_occurrence_4',
  },
  {
    column: 'occurrence_n_4',
    path: 'sample.occurrence_n_4',
  },
  {
    column: 'occurrence_n_total',
    path: 'occurrence_abundance_sampling.occurrence_n_total',
  },
  
    {
    column: 'occurrence_notes',
    path: 'sample.occurrence_notes',
  },
  {
    column: 'binary_presence',
    path: 'occurrence.binary_presence',
  },
  // {
  //   column: 'binary_absence',
  //   path: 'occurrence_abundance_sampling.binary_absence',
  // },
  // {
  //   column: 'abundance_data_in_a_graph',
  //   path: 'occurrence_abundance_sampling.abundance_data_in_a_graph',
  // },
  {
    column: 'month_start',
    path: 'bionomics.month_start',
  },
  {
    column: 'month_end',
    path: 'bionomics.month_end',
  },
  {
    column: 'year_start',
    path: 'bionomics.year_start',
  },
  {
    column: 'year_end',
    path: 'bionomics.year_end',
  },
  {
    column: 'season_given',
    path: 'bionomics.season_given',
  },
  {
    column: 'season_calc',
    path: 'bionomics.season_calc',
  },
  {
    column: 'rainfall_time',
    path: 'bionomics.rainfall_time',
  },
  {
    column: 'season_notes',
    path: 'bionomics.season_notes',
  },
  {
    column: 'species',
    path: 'recorded_species.species',
  },
  {
    column: 'species_notes',
    path: 'recorded_species.species_notes',
  },
  {
    column: 'species_id_1',
    path: 'recorded_species.species_id_1',
  },
  {
    column: 'species_id_2',
    path: 'recorded_species.species_id_2',
  },
  
  {
    column: 'roof',
    path: 'environment.roof',
  },
  
  {
    column: 'walls',
    path: 'environment.walls',
  },
  {
    column: 'house_screening',
    path: 'environment.house_screening',
  },
  {
    column: 'open_eaves',
    path: 'environment.open_eaves',
  },
  {
    column: 'cooking',
    path: 'environment.cooking',
  },
  {
    column: 'housing_notes',
    path: 'environment.housing_notes',
  },
  // {
  //   column: 'common_occupation_1',
  //   path: 'community.common_occupation_1',
  // },
  // {
  //   column: 'common_occupation_2',
  //   path: 'community.common_occupation_2',
  // },
  // {
  //   column: 'common_occupation_3',
  //   path: 'community.common_occupation_3',
  // },
  // {
  //   column: 'outdoor_activities_at_night',
  //   path: 'community.outdoor_activities_at_night',
  // },
  {
    column: 'sleeping_outdoors',
    path: 'environment.sleeping_outdoors',
  },
  {
    column: 'outdoor_timings_hours',
    path: 'environment.outdoor_timings_hours',
  },
  {
    column: 'outdoor_activities_notes',
    path: 'environment.outdoor_activities_notes',
  },
  {
    column: 'average_bedtime',
    path: 'environment.average_bedtime',
  },
  // {
  //   column: 'average_wake_time',
  //   path: 'community.average_wake_time',
  // },
  // {
  //   column: 'time_people_leave_home_in_morning',
  //   path: 'community.time_people_leave_home_in_morning',
  // },
  // {
  //   column: 'hours_spent_away_from_home_per_day',
  //   path: 'community.hours_spent_away_from_home_per_day',
  // },
  {
    column: 'seasonal_labour',
    path: 'environment.seasonal_labour',
  },
  {
    column: 'community_notes',
    path: 'environment.community_notes',
  },
  {
    column: 'forest',
    path: 'environment.forest',
  },
  {
    column: 'farming',
    path: 'environment.farming',
  },
  {
    column: 'farming_notes',
    path: 'environment.farming_notes',
  },
  {
    column: 'livestock_1',
    path: 'environment.livestock_1',
  },
  {
    column: 'livestock_2',
    path: 'environment.livestock_2',
  },
  {
    column: 'livestock_3',
    path: 'environment.livestock_3',
  },
  {
    column: 'livestock_4',
    path: 'environment.livestock_4',
  },
  {
    column: 'livestock_notes',
    path: 'environment.livestock_notes',
  },
  {
    column: 'local_plants',
    path: 'environment.local_plants',
  },
  {
    column: 'environment_notes',
    path: 'environment.environment_notes',
  },
  {
    column: 'sampling_biology_1',
    path: 'biology.sampling_biology_1',
  },
  {
    column: 'sampling_biology_2',
    path: 'biology.sampling_biology_2',
  },
  {
    column: 'sampling_biology_3',
    path: 'biology.sampling_biology_3',
  },
  {
    column: 'sampling_biology_n',
    path: 'biology.sampling_biology_n',
  },
  {
    column: 'parity_n',
    path: 'biology.parity_n',
  },
  {
    column: 'parity_total',
    path: 'biology.parity_total',
  },
  {
    column: 'parity_percent',
    path: 'biology.parity_percent',
  },
  {
    column: 'daily_survival_rate_percent',
    path: 'biology.daily_survival_rate_percent',
  },
  {
    column: 'fecundity_mean_batch_size',
    path: 'biology.fecundity_mean_batch_size',
  },
  {
    column: 'gonotrophic_cycle_days',
    path: 'biology.gonotrophic_cycle_days',
  },
  {
    column: 'biology_notes',
    path: 'biology.biology_notes',
  },
  {
    column: 'sampling_infection_1',
    path: 'infection.sampling_infection_1',
  },
  {
    column: 'sampling_infection_2',
    path: 'infection.sampling_infection_2',
  },
  {
    column: 'sampling_infection_3',
    path: 'infection.sampling_infection_3',
  },
  {
    column: 'sampling_infection_n',
    path: 'infection.sampling_infection_n',
  },
  {
    column: 'sporozoite_rate_by_dissection_n_',
    path: 'infection.sporozoite_rate_by_dissection_n',
  },
  {
    column: 'sporozoite_rate_by_dissection_total',
    path: 'infection.sporozoite_rate_by_dissection_total',
  },
  {
    column: 'sporozoite_rate_by_dissection_percent',
    path: 'infection.sporozoite_rate_by_dissection_percent',
  },
  {
    column: 'sporozoite_rate_by_csp_n_pool',
    path: 'infection.sporozoite_rate_by_csp_n_pool',
  },
  {
    column: 'sporozoite_rate_by_csp_total_pool',
    path: 'infection.sporozoite_rate_by_csp_total_pool',
  },
  {
    column: 'sporozoite_rate_by_csp_percent',
    path: 'infection.sporozoite_rate_by_csp_percent',
  },
  {
    column: 'sporozoite_rate_p_falciparum_n',
    path: 'infection.sporozoite_rate_p_falciparum_n',
  },
  {
    column: 'sporozoite_rate_p_falciparum_total',
    path: 'infection.sporozoite_rate_p_falciparum_total',
  },
  {
    column: 'sporozoite_rate_p_falciparum_percent',
    path: 'infection.sporozoite_rate_p_falciparum_percent',
  },
  {
    column: 'sporozoite_rate_p_vivax_n',
    path: 'infection.sporozoite_rate_p_vivax_n',
  },
  {
    column: 'sporozoite_rate_p_vivax_total',
    path: 'infection.sporozoite_rate_p_vivax_total',
  },
  {
    column: 'sporozoite_rate_p_vivax_percent',
    path: 'infection.sporozoite_rate_p_vivax_percent',
  },
  {
    column: 'oocyst_n',
    path: 'infection.oocyst_n',
  },
  {
    column: 'oocyst_total',
    path: 'infection.oocyst_total',
  },
  {
    column: 'oocyst_rate_percent',
    path: 'infection.oocyst_rate_percent',
  },
  {
    column: 'eir',
    path: 'infection.eir',
  },
  {
    column: 'eir_period',
    path: 'infection.eir_period',
  },
  {
    column: 'ext_incubation_period_days',
    path: 'infection.ext_incubation_period_days',
  },
  {
    column: 'infection_notes',
    path: 'infection.infection_notes',
  },
  {
    column: 'hbr_sampling_indoor',
    path: 'biting_rate.hbr_sampling_indoor',
  },
  {
    column: 'indoor_hbr',
    path: 'biting_rate.indoor_hbr',
  },
  {
    column: 'hbr_sampling_outdoor',
    path: 'biting_rate.hbr_sampling_outdoor',
  },
  {
    column: 'outdoor_hbr',
    path: 'biting_rate.outdoor_hbr',
  },
  {
    column: 'hbr_sampling_combined_1',
    path: 'biting_rate.hbr_sampling_combined_1',
  },
  {
    column: 'hbr_sampling_combined_2',
    path: 'biting_rate.hbr_sampling_combined_2',
  },
  {
    column: 'hbr_sampling_combined_3',
    path: 'biting_rate.hbr_sampling_combined_3',
  },
  {
    column: 'hbr_sampling_combined_n',
    path: 'biting_rate.hbr_sampling_combined_n',
  },
  {
    column: 'combined_hbr',
    path: 'biting_rate.combined_hbr',
  },
  {
    column: 'hbr_unit',
    path: 'biting_rate.hbr_unit',
  },
  {
    column: 'abr_sampling_1',
    path: 'biting_rate.abr_sampling_1',
  },
  {
    column: 'abr_sampling_2',
    path: 'biting_rate.abr_sampling_2',
  },
  {
    column: 'abr_sampling_3',
    path: 'biting_rate.abr_sampling_3',
  },
  {
    column: 'abr_sampling_n',
    path: 'biting_rate.abr_sampling_n',
  },
  {
    column: 'abr',
    path: 'biting_rate.abr',
  },
  {
    column: 'abr_unit',
    path: 'biting_rate.abr_unit',
  },
  {
    column: 'biting_rate_notes',
    path: 'biting_rate.biting_rate_notes',
  },
  {
    column: 'host_sampling_indoor',
    path: 'anthropo_zoophagic.host_sampling_indoor',
  },
  {
    column: 'indoor_host_n',
    path: 'anthropo_zoophagic.indoor_host_n',
  },
  {
    column: 'indoor_host_total',
    path: 'anthropo_zoophagic.indoor_host_total',
  },
  {
    column: 'indoor_host_percent',
    path: 'host_preference.indoor_host_percent',
  },
  {
    column: 'host_sampling_outdoor',
    path: 'anthropo_zoophagic.host_sampling_outdoor',
  },
  {
    column: 'outdoor_host_n',
    path: 'arthropo_zoophagic.outdoor_host_n',
  },
  {
    column: 'outdoor_host_total',
    path: 'arthropo_zoophagic.outdoor_host_total',
  },
  {
    column: 'outdoor_host_percent',
    path: 'host_preference.outdoor_host_percent',
  },
  {
    column: 'host_sampling_combined_1',
    path: 'anthropo_zoophagic.host_sampling_combined_1',
  },
  {
    column: 'host_sampling_combined_2',
    path: 'anthropo_zoophagic.host_sampling_combined_2',
  },
  {
    column: 'host_sampling_combined_3',
    path: 'anthropo_zoophagic.host_sampling_combined_3',
  },
  {
    column: 'host_sampling_combined_n',
    path: 'anthropo_zoophagic.host_sampling_combined_n',
  },
  {
    column: 'combined_host_n',
    path: 'anthropo_zoophagic.combined_host_n',
  },
  {
    column: 'combined_host_total',
    path: 'anthropo_zoophagic.combined_host_total',
  },
  {
    column: 'combined_host',
    path: 'anthropo_zoophagic.combined_host',
  },
  
  {
    column: 'host_unit',
    path: 'anthropo_zoophagic.host_unit',
  },
  
  {
    column: 'host_sampling_other_1',
    path: 'anthropo_zoophagic.host_sampling_other_1',
  },
  
  {
    column: 'host_sampling_other_2',
    path: 'anthropo_zoophagic.host_sampling_other_2',
  },
  
  {
    column: 'host_sampling_other_3',
    path: 'anthropo_zoophagic.host_sampling_other_3',
  },
  
  {
    column: 'host_sampling_other_n',
    path: 'anthropo_zoophagic.host_sampling_other_n',
  },
  {
    column: 'other_host_n',
    path: 'anthropo_zoophagic.other_host_n',
  },
  
  {
    column: 'other_host_total',
    path: 'anthropo_zoophagic.other_host_total',
  },
  
  {
    column: 'host_other',
    path: 'anthropo_zoophagic.host_other',
  },
  
  {
    column: 'host_other_unit',
    path: 'anthropo_zoophagic.host_other_unit',
  },
  
  {
    column: 'host_notes',
    path: 'host_preference.host_notes',
  },
  
  {
    column: 'biting_number_of_sampling_nights_indoors',
    path: 'biting_location.biting_number_of_sampling_nights_indoors',
  },
  
  {
    column: 'biting_sampling_indoor',
    path: 'endo_exophagic.biting_sampling_indoor',
  },
  
  {
    column: 'indoor_biting_n',
    path: 'endo_exophagic.indoor_biting_n',
  },
  {
    column: 'indoor_biting_total',
    path: 'endo_exophagic.indoor_biting_total',
  },
  {
    column: 'indoor_biting_data',
    path: 'endo_exophagic.indoor_biting_data',
  },
  {
    column: 'biting_number_of_sampling_nights_outdoors',
    path: 'biting_location.biting_number_of_sampling_nights_outdoors',
  },
  {
    column: 'biting_sampling_outdoor',
    path: 'endo_exophagic.biting_sampling_outdoor',
  },
  {
    column: 'outdoor_biting_n',
    path: 'endo_exophagic.outdoor_biting_n',
  },
  {
    column: 'outdoor_biting_total',
    path: 'endo_exophagic.outdoor_biting_total',
  },
  {
    column: 'outdoor_biting_data',
    path: 'endo_exophagic.outdoor_biting_data',
  },
  {
    column: 'indoor_outdoor_biting_unit',
    path: 'biting_location.indoor_outdoor_biting_unit',
  },
  {
    column: 'indoor_outdoor_biting_notes',
    path: 'biting_location.indoor_outdoor_biting_notes',
  },
  {
    column: 'biting_activity_indoor_number_of_sampling_nights',
    path: 'HUMJAN',
  },
  {
    column: '1800_1900_in',
    path: 'biting_location.',
  },
  {
    column: '1900_2000_in',
    path: 'reference.citation',
  },
  {
    column: '2000_2100_in',
    path: 'reference.citation',
  },
  {
    column: '2100_2200_in',
    path: 'reference.citation',
  },
  {
    column: '2200_2300_in',
    path: 'reference.citation',
  },
  {
    column: '2300_0000_in',
    path: 'reference.citation',
  },
  {
    column: '0000_0100_in',
    path: 'reference.citation',
  },
  {
    column: '0100_0200_in',
    path: 'reference.citation',
  },
  {
    column: '0200_0300_in',
    path: 'reference.citation',
  },
  {
    column: '0300_0400_in',
    path: 'reference.citation',
  },
  {
    column: '0400_0500_in',
    path: 'reference.citation',
  },
  {
    column: '0500_0600_in',
    path: 'reference.citation',
  },
  {
    column: '1830_2130_in',
    path: 'reference.citation',
  },
  {
    column: '2130_0030_in',
    path: 'reference.citation',
  },
  {
    column: '0030_0330_in',
    path: 'reference.citation',
  },
  {
    column: '0330_0630_in',
    path: 'reference.citation',
  },
  {
    column: 'biting_activity_outdoor_number_of_sampling_nights',
    path: 'reference.citation',
  },
  {
    column: '1800_1900_out',
    path: 'reference.citation',
  },
  {
    column: '1900_2000_out',
    path: 'reference.citation',
  },
  {
    column: '2000_2100_out',
    path: 'reference.citation',
  },
  {
    column: '2100_2200_out',
    path: 'reference.citation',
  },
  {
    column: '2200_2300_out',
    path: 'reference.citation',
  },
  {
    column: '2300_0000_out',
    path: 'reference.citation',
  },
  {
    column: '0000_0100_out',
    path: 'reference.citation',
  },
  {
    column: '0100_0200_out',
    path: 'reference.citation',
  },
  {
    column: '0200_0300_out',
    path: 'reference.citation',
  },
  {
    column: '0300_0400_out',
    path: 'reference.citation',
  },
  {
    column: '0400_0500_out',
    path: 'reference.citation',
  },
  {
    column: '0500_0600_out',
    path: 'reference.citation',
  },
  {
    column: '1830_2130_out',
    path: 'reference.citation',
  },
  {
    column: '2130_0030_out',
    path: 'reference.citation',
  },
  {
    column: '0030_0330_out',
    path: 'reference.citation',
  },
  {
    column: '0330_0630_out',
    path: 'reference.citation',
  },
  {
    column: 'biting_activity_combined_number_of_sampling_nights',
    path: 'reference.citation',
  },
  {
    column: '1800_1900_combined',
    path: 'reference.citation',
  },
  {
    column: '1900_2000_combined',
    path: 'reference.citation',
  },
  {
    column: '2000_2100_combined',
    path: 'reference.citation',
  },
  {
    column: '2100_2200_combined',
    path: 'reference.citation',
  },
  {
    column: '2200_2300_combined',
    path: 'reference.citation',
  },
  {
    column: '2300_0000_combined',
    path: 'reference.citation',
  },
  {
    column: '0000_0100_combined',
    path: 'reference.citation',
  },
  {
    column: '0100_0200_combined',
    path: 'reference.citation',
  },
  {
    column: '0200_0300_combined',
    path: 'reference.citation',
  },
  {
    column: '0300_0400_combined',
    path: 'reference.citation',
  },
  {
    column: '0400_0500_combined',
    path: 'reference.citation',
  },
  {
    column: '0500_0600_combined',
    path: 'reference.citation',
  },
  {
    column: '1830_2130_combined',
    path: 'reference.citation',
  },
  {
    column: '2130_0030_combined',
    path: 'reference.citation',
  },
  {
    column: '0030_0330_combined',
    path: 'reference.citation',
  },
  {
    column: '0330_0630_combined',
    path: 'reference.citation',
  },
  {
    column: 'biting_notes',
    path: 'reference.citation',
  },
  {
    column: 'resting_sampling_indoor',
    path: 'endo_exophily.resting_sampling_indoor',
  },
  {
    column: 'unfed_indoor',
    path: 'endo_exophily.unfed_indoor',
  },
  {
    column: 'fed_indoor',
    path: 'endo_exophily.fed_indoor',
  },
  {
    column: 'gravid_indoor',
    path: 'endo_exophily.gravid_indoor',
  },
  {
    column: 'total_indoor',
    path: 'endo_exophily.total_indoor',
  },
  {
    column: 'resting_sampling_outdoor',
    path: 'endo_exophily.resting_sampling_outdoor',
  },
  {
    column: 'unfed_outdoor',
    path: 'endo_exophily.unfed_outdoor',
  },
  {
    column: 'fed_outdoor',
    path: 'endo_exophily.fed_outdoor',
  },
  {
    column: 'gravid_outdoor',
    path: 'endo_exophily.gravid_outdoor',
  },
  {
    column: 'total_outdoor',
    path: 'endo_exophily.total_outdoor',
  },
  {
    column: 'resting_sampling_other',
    path: 'endo_exophily.resting_sampling_other',
  },
  {
    column: 'unfed_other',
    path: 'endo_exophily.unfed_other',
  },
  {
    column: 'fed_other',
    path: 'endo_exophily.fed_other',
  },
  {
    column: 'gravid_other',
    path: 'endo_exophily.gravid_other',
  },
  {
    column: 'total_other',
    path: 'endo_exophily.total_other',
  },
  {
    column: 'resting_unit',
    path: 'endo_exophily.resting_unit',
  },
  {
    column: 'resting_notes',
    path: 'reference.citation',
  },
  {
    column: 'larval_instars_found_1',
    path: 'Larval_site.larval_instars_found_1',
  },
  {
    column: 'larval_habitat_1',
    path: 'Larval_site.larval_habitat_1',
  },
  {
    column: 'larval_site_character_1',
    path: 'Larval_site.larval_site_character_1',
  },
  {
    column: 'larval_turbidity_1',
    path: 'Larval_site.larval_turbidity_1',
  },
  {
    column: 'larval_salinity_1',
    path: 'Larval_site.larval_salinity_1',
  },
  {
    column: 'larval_vegetation_1',
    path: 'Larval_site.larval_vegetation_1',
  },
  {
    column: 'larval_shade_1',
    path: 'Larval_site.larval_shade_1',
  },
  {
    column: 'larval_water_current_1',
    path: 'Larval_site.larval_water_current_1',
  },
  {
    column: 'larval_size_1',
    path: 'Larval_site.larval_size_1',
  },
  {
    column: 'larval_depth_1',
    path: 'Larval_site.larval_depth_1',
  },
  {
    column: 'larval_permanence_1',
    path: 'reference.citation',
  },
  {
    column: 'larval_other_fauna_1',
    path: 'Larval_site.larval_other_fauna_1',
  },
  {
    column: 'larval_control_present_1',
    path: 'Larval_site.larval_control_present_1',
  },
  {
    column: 'larval_instars_found_2',
    path: 'Larval_site.larval_instars_found_2',
  },
  {
    column: 'larval_habitat_2',
    path: 'Larval_site.larval_habitat_2',
  },
  {
    column: 'larval_site_character_2',
    path: 'Larval_site.larval_site_character_2',
  },
  {
    column: 'larval_turbidity_2',
    path: 'Larval_site.larval_turbidity_2',
  },
  {
    column: 'larval_salinity_2',
    path: 'Larval_site.larval_salinity_2',
  },
  {
    column: 'larval__vegetation_2',
    path: 'reference.citation',
  },
  {
    column: 'larval_shade_2',
    path: 'Larval_site.larval_shade_2',
  },
  {
    column: 'larval_water_current_2',
    path: 'Larval_site.larval_water_current_2',
  },
  {
    column: 'larval_size_2',
    path: 'Larval_site.larval_size_2',
  },
  {
    column: 'larval_depth_2',
    path: 'Larval_site.larval_depth_2',
  },
  {
    column: 'larval_permanence_2',
    path: 'reference.citation',
  },
  {
    column: 'larval_other_fauna_2',
    path: 'Larval_site.larval_other_fauna_2',
  },
  {
    column: 'larval_control_present_2',
    path: 'Larval_site.larval_control_present_2',
  },
  {
    column: 'larval_instars_found_3',
    path: 'Larval_site.larval_instars_found_3',
  },
  {
    column: 'larval_habitat_3',
    path: 'Larval_site.larval_habitat_3',
  },
  {
    column: 'larval_site_character_3',
    path: 'Larval_site.larval_site_character_3',
  },
  {
    column: 'larval_turbidity_3',
    path: 'reference.citation',
  },
  {
    column: 'larval_salinity_3',
    path: 'Larval_site.larval_salinity_3',
  },
  {
    column: 'larval_vegetation_3',
    path: 'Larval_site.larval_vegetation_3',
  },
  {
    column: 'larval_shade_3',
    path: 'Larval_site.larval_shade_3',
  },
  {
    column: 'larval_water_current_3',
    path: 'Larval_site.larval_water_current_3',
  },
  {
    column: 'larval_size_3',
    path: 'Larval_site.larval_size_3',
  },
  {
    column: 'larval_depth_3',
    path: 'Larval_site.larval_depth_3',
  },
  {
    column: 'larval_permanence_3',
    path: 'reference.citation',
  },
  {
    column: 'larval_other_fauna_3',
    path: 'Larval_site.larval_other_fauna_3',
  },
  {
    column: 'larval_control_present_3',
    path: 'Larval_site.larval_control_present_3',
  },
  {
    column: 'larval_notes',
    path: 'Larval_site.larval_notes',
  },
  {
    column: 'bioassay_representative_of_complex_at_site',
    path: 'reference.citation',
  },
  {
    column: 'bioassay_representative_of_complex_at_site_if_disaggregated_values_combined_without_adjustments',
    path: 'reference.citation',
  },
  {
    column: 'generation',
    path: 'insecticideResistanceBioassays.generation',
  },
  {
    column: 'wild_caught_larvae_or_adults',
    path: 'reference.citation',
  },
  {
    column: 'lower_age_days',
    path: 'insecticideResistanceBioassays.lower_age_days',
  },
  {
    column: 'upper_age_days',
    path: 'insecticideResistanceBioassays.upper_age_days',
  },
  {
    column: 'test_protocol',
    path: 'reference.citation',
  },
  {
    column: 'insecticide_tested',
    path: 'insecticideResistanceBioassays.insecticide_tested',
  },
  {
    column: 'insecticide_class',
    path: 'insecticideResistanceBioassays.insecticide_class',
  },
  {
    column: 'irac_moa',
    path: 'insecticideResistanceBioassays.irac_moa',
  },
  {
    column: 'irac_moa_code',
    path: 'insecticideResistanceBioassays.irac_moa_code',
  },
  {
    column: 'concentration_percent',
    path: 'insecticideResistanceBioassays.concentration_percent',
  },
  {
    column: 'concentration_micrograms',
    path: 'reference.citation',
  },
  {
    column: 'exposure_period_min',
    path: 'insecticideResistanceBioassays.exposure_period_min',
  },
  {
    column: 'intensity_multiplier',
    path: 'insecticideResistanceBioassays.intensity_multiplier',
  },
  {
    column: 'synergist_tested',
    path: 'insecticideResistanceBioassays.synergist_tested',
  },
  {
    column: 'synergist_concentration',
    path: 'insecticideResistanceBioassays.synergist_concentration',
  },
  {
    column: 'synergist_concentration_unit',
    path: 'insecticideResistanceBioassays.synergist_concentration_unit',
  },
  {
    column: 'mosquitoes_tested_n',
    path: 'reference.citation',
  },
  {
    column: 'mosquitoes_dead_n',
    path: 'reference.citation',
  },
  {
    column: 'percent_mortality',
    path: 'insecticideResistanceBioassays.percent_mortality',
  },
  {
    column: 'knock_down_exposure_time_min',
    path: 'reference.citation',
  },
  {
    column: 'mosquitoes_knocked_down_n',
    path: 'reference.citation',
  },
  {
    column: 'knock_down_percent',
    path: 'insecticideResistanceBioassays.knock_down_percent',
  },
  {
    column: 'kdt_50_percent_min',
    path: 'reference.citation',
  },
  {
    column: 'kdt_90_percent_min',
    path: 'reference.citation',
  },
  {
    column: 'kdt_95_percent_min',
    path: 'reference.citation',
  },
  {
    collumn: 'bioassay_notes',
    path: 'insecticideResistanceBioassays.bioassay_notes',
  },
  {
    column: 'genotypic_test_representative_of_species_at_site',
    path: 'reference.citation',
  },
  {
    column: 'genotypic_test_representative_of_species_at_site_if_disaggregated_values_combined_without_adjustments',
    path: 'reference.citation',
  },
  {
    column: 'minor_species_missing_allele_frequency_data',
    path: 'reference.citation',
  },
  {
    column: 'notes_on_population_representative',
    path: 'reference.citation',
  },
  {
    column: 'genotypic_sample_first_been_through_bioassay_tests',
    path: 'reference.citation',
  },
  {
    column: 'genotypic_sample_linked_to_a_specific_bioassay',
    path: 'reference.citation',
  },
  {
    column: 'bioassay_subsample_used_in_genotypic_test',
    path: 'reference.citation',
  },
  {
    column: 'notes_on_bioassay_linkage',
    path: 'reference.citation',
  },
  {
    column: 'vgsc_method_1',
    path: 'vgscMethodAndSample.vgsc_method_1',
  },
  {
    column: 'vgsc_method_2',
    path: 'vgscMethodAndSample.vgsc_method_2',
  },
  {
    column: 'vgsc_number_of_mosquitoes_tested',
    path: 'reference.citation',
  },
  {
    column: 'vgsc_generation',
    path: 'vgscMethodAndSample.vgsc_generation',
  },
  {
    column: 'vgsc_kdr_notes',
    path: 'vgscMethodAndSample.vgsc_kdr_notes',
  },
  {
    column: 'vgsc995l_vgsc995l_n',
    path: 'reference.citation',
  },
  {
    column: 'vgsc995l_vgsc995l_percent',
    path: 'reference.citation',
  },
  {
    column: 'vgsc995l_vgsc995f_n',
    path: 'reference.citation',
  },
  {
    column: 'vgsc995l_vgsc995f_percent',
    path: 'reference.citation',
  },
  {
    column: 'vgsc995f_vgsc995f_n',
    path: 'reference.citation',
  },
  {
    column: 'vgsc995f_vgsc995f_percent',
    path: 'reference.citation',
  },
  {
    column: 'vgsc995l_vgsc995s_n',
    path: 'reference.citation',
  },
  {
    column: 'vgsc995l_vgsc995s_percent',
    path: 'reference.citation',
  },
  
  {
    column: 'vgsc995s_vgsc995s_n',
    path: 'reference.citation',
  },
  {
    column: 'vgsc995s_vgsc995s_percent',
    path: 'reference.citation',
  },
  {
    column: 'vgsc995l_vgsc995c_n',
    path: 'reference.citation',
  },
  {
    column: 'vgsc995l_vgsc995c_percent',
    path: 'reference.citation',
  },
  {
    column: 'vgsc995c_vgsc995c_n',
    path: 'reference.citation',
  },
  {
    column: 'vgsc995c_vgsc995c_percent',
    path: 'reference.citation',
  },
  {
    column: 'null_vgsc995c_or_vgsc995c_vgsc995c_n',
    path: 'reference.citation',
  },
  
  {
    column: 'null_vgsc995c_or_vgsc995c_vgsc995c_percent',
    path: 'reference.citation',
  },
  {
    column: 'vgsc995f_vgsc995s_n',
    path: 'reference.citation',
  },
  {
    column: 'vgsc995f_vgsc995s_percent',
    path: 'reference.citation',
  },
  {
    column: 'vgsc995f_vgsc995c_n',
    path: 'reference.citation',
  },
  {
    column: 'vgsc995f_vgsc995c_percent',
    path: 'reference.citation',
  },
  {
    column: 'susceptible_susceptible_percent',
    path: 'reference.citation',
  },
  {
    column: 'resistant_susceptible_n',
    path: 'reference.citation',
  },
  {
    column: 'resistant_susceptible_percent',
    path: 'reference.citation',
  },
  {
    column: 'resistant_resistant_n',
    path: 'reference.citation',
  },
  {
    column: 'resistant_resistant_percent',
    path: 'reference.citation',
  },
  {
    column: 'vgsc995l_percent',
    path: 'vvgsc995AlleleFrequencies.vgsc995l_percent',
  },
  {
    column: 'vgsc995f_percent',
    path: 'vgsc995AlleleFrequencies.vgsc995f_percent',
  },
  {
    column: 'vgsc995s_percent',
    path: 'vgsc995AlleleFrequencies.vgsc995s_percent',
  },
  {
    column: 'vgsc995c_percent',
    path: 'vgsc995AlleleFrequencies.vgsc995c_percent',
  },
  {
    column: 'kdr_percent',
    path: 'vgsc995AlleleFrequencies.kdr_percent',
  },
  {
    column: 'vgsc402v_vgsc402v_n',
    path: 'reference.citation',
  },
  {
    column: 'vgsc402v_vgsc402v_percent',
    path: 'reference.citation',
  },
  {
    column: 'vgsc402v_vgsc402l_n',
    path: 'reference.citation',
  },
  {
    column: 'vgsc402v_vgsc402l_percent',
    path: 'reference.citation',
  },
  {
    column: 'vgsc402l_vgsc402l_n',
    path: 'reference.citation',
  },
  {
    column: 'vgsc402l_vgsc402l_percent',
    path: 'reference.citation',
  },
  {
    column: 'vgsc402v_percent',
    path: 
    'vgsc402AlleleFrequencies.vgsc402v_percent',
  },
  {
    column: 'vgsc_402l_percent',
    path: 'reference.citation',
  },
  {
    column: 'vgsc1570n_vgsc1570n_n',
    path: 'reference.citation',
  },
  {
    column: 'vgsc1570n_vgsc1570n_percent',
    path: 'vgsc1570AlleleFrequencies.vgsc1570n_percent',
  },
  {
    column: 'vgsc1570n_vgsc1570y_n',
    path: 'reference.citation',
  },
  {
    column: 'vgsc1570n_1570y_percent',
    path: 'reference.citation',
  },
  {
    column: 'vgsc1570y_vgsc1570y_n',
    path: 'reference.citation',
  },
  {
    column: 'vgsc1570y_vgsc1570y_percent',
    path: 'reference.citation',
  },
  {
    column: 'vgsc1570n_percent',
    path: 'vgsc1570AlleleFrequencies.vgsc1570n_percent',
  },
  {
    column: 'vgsc1570y_percent',
    path: 'vgsc1570AlleleFrequencies.vgsc1570y_percent',
  },
  {
    column: 'rdl_method_1',
    path: 'rdlMethodAndSample.rdl_method_1',
  },
  {
    column: 'rdl_number_of_mosquitoes_tested',
    path: 'reference.citation',
  },
  {
    column: 'rdl_generation',
    path: 'rdlMethodAndSample.rdl_generation',
  },
  {
    column: 'rdl_notes',
    path: 'rdlMethodAndSample.rdl_notes',
  },
  {
    column: 'rdl296c_rdl296c__n',
    path: 'reference.citation',
  },
  {
    column: 'rdl296c_rdl296c_percent',
    path: 'reference.citation',
  },
  {
    column: 'rdl296c_rdl296g_n',
    path: 'reference.citation',
  },
  {
    column: 'rdl296c_rdl296g_percent',
    path: 'reference.citation',
  },
  {
    column: 'rdl296g_rdl296g_n',
    path: 'reference.citation',
  },
  {
    column: 'rdl296g_rdl296g_percent',
    path: 'reference.citation',
  },
  {
    column: 'rdl296c_rdl296s_n',
    path: 'reference.citation',
  },
  {
    column: 'rdl296c_rdl296s_percent',
    path: 'reference.citation',
  },
  {
    column: 'rdl296s_rdl296s_n',
    path: 'reference.citation',
  },
  {
    column: 'rdl296s_rdl296s_percent',
    path: 'reference.citation',
  },
  {
    column: 'rdl296g_rdl296s_n',
    path: 'reference.citation',
  },
  {
    column: 'rdl296g_rdl296s_percent',
    path: 'reference.citation',
  },
  {
    column: 'rdl296c_percent',
    path: 'rdl296AlleleFrequencies.rdl296c_percent',
  },
  {
    column: 'rdl296g_percent',
    path: 'rdl296AlleleFrequencies.rdl296g_percent',
  },
  {
    column: 'rdl296s_percent',
    path: 'rdl296AlleleFrequencies.rdl296s_percent',
  },
  {
    column: 'ace1_method_1',
    path: 'ace1MethodAndSample.ace1_method_1',
  },
  {
    column: 'ace1_number_of_mosquitoes_tested',
    path: 'reference.citation',
  },
  {
    column: 'ace1_generation',
    path: 'ace1MethodAndSample.ace1_generation',
  },
  {
    column: 'ace1_notes',
    path: 'ace1MethodAndSampleNotes.ace1_notes',
  },
  {
    column: 'ace1_280g_ace1_280g_n',
    path: 'reference.citation',
  },
  {
    column: 'ace1_280g_percent',
    path: 'ace1AlleleFrequencies.ace1_280g_percent',
  },
  {
    column: 'ace1_280g_ace1_280s_n',
    path: 'reference.citation',
  },
   {
    column: 'ace1_280g_ace1_280g_percent',
    path: 'reference.citation',
  },
  {
    column: 'ace1_280g_ace1_280s_percent',
    path: 'reference.citation',
  },
  {
    column: 'ace1_280s_ace1_280s_n',
    path: 'reference.citation',
  },
  {
    column: 'ace1_280s_ace1_280s_percent',
    path: 'reference.citation',
  },
  {
    column: 'ace1_280s_percent',
    path: 'ace1AlleleFrequencies.ace1_280s_percent',
  },
  {
    column: 'gste_method_1',
    path: 'gsteMethodAndSample.gste_method_1',
  },
  {
    column: 'gste_number_of_mosquitoes_tested',
    path: 'reference.citation',
  },
  {
    column: 'gste_generation',
    path: 'gsteMethodAndSample.gste_generation',
  },
  {
    column: 'gste_notes',
    path: 'gsteMethodAndSample.gste_notes',
  },
  {
    column: 'gste2_114I_gste2_114I_n',
    path: 'reference.citation',
  },
  {
    column: 'gste2_114I_gste2_114I_percent',
    path: 'gste2_114AlleleFrequencies.gste2_114I_gste2_114I_percent',
  },
  {
    column: 'gste2_114I_gste2_114t_n',
    path: 'reference.citation',
  },
  {
    column: 'gste2_114I_gste2_114t_percent',
    path: 'gste2_114AlleleFrequencies.gste2_114I_gste2_114t_percent',
  },
  {
    column: 'gste2_114t_gste2_114t_n',
    path: 'reference.citation',
  },
  {
    column: 'gste2_114t_gste2_114t_percent',
    path: 'reference.citation',
  },
  {
    column: 'gste2_114I_percent',
    path: 'gste2_114AlleleFrequencies.gste2_114I_percent',
  },
  {
    column: 'gste2_114t_percent',
    path: 'gste2_114AlleleFrequencies.gste2_114t_percent',
  },
  {
    column: 'gste2_119l_gste2_119l_n',
    path: 'reference.citation',
  },
  {
    column: 'gste2_119l_gste2_119l_percent',
    path: 'gste2_119AlleleFrequencies.gste2_119l_gste2_119l_percent',
  },
  {
    column: 'gste2_119l_gste2_119v_n',
    path: 'reference.citation',
  },
  {
    column: 'gste2_119l_gste2_119v_percent',
    path: 'gste2_119AlleleFrequencies.gste2_119l_gste2_119v_percent',
  },
  {
    column: 'gste2_119v_gste2_119v_n',
    path: 'reference.citation',
  },
  {
    column: 'gste2_119v_gste2_119v_percent',
    path: 'reference.citation',
  },
  {
    column: 'gste2_119l_percent',
    path: 'gste2_119AlleleFrequencies.gste2_119l_percent',
  },
  {
    column: 'gste2_119v_percent',
    path: 'gste2_119AlleleFrequencies.gste2_119v_percent',
  },
  {
    column: 'cyp_method_1',
    path: 'cytochromesP450_cypMethodAndSample.cyp_method_1',
  },
  {
    column: 'cyp_number_of_mosquitoes_tested',
    path: 'cytochromesP450_cypMethodAndSample.cyp_number_of_mosquitoes_tested',
  },
  {
    column: 'cyp_generation',
    path: 'cytochromesP450_cypMethodAndSample.cyp_generation',
  },
  {
    column: 'cyp_notes',
    path: 'cytochromesP450_cypMethodAndSample.cyp_notes',
  },
  {
    column: 'cyp4j5_43l_cyp4j5_43l_n',
    path: 'reference.citation',
  },
  {
    column: 'cyp4j5_43l_cyp4j5_43l_percent',
    path: 'cyp4j5GenotypeFrequencies.cyp4j5_43l_percent',
  },
  {
    column: 'cyp4j5_43l_cyp4j5_43f_n',
    path: 'reference.citation',
  },
  {
    column: 'cyp4j5_43l_cyp4j5_43f_percent',
    path: 'reference.citation',
  },
  {
    column: 'cyp4j5_43f_cyp4j5_43f_n',
    path: 'reference.citation',
  },
  {
    column: 'cyp4j5_43f_cyp4j5_43f_percent',
    path: 'cyp4j5GenotypeFrequencies.cyp4j5_43f_percent',
  },
  {
    column: 'cyp4j5_43l_percent',
    path: 'reference.citation',
  },
  {
    column: 'cyp4j5_43f_percent',
    path: 'reference.citation',
  },
  {
    column: 'cyp6p4_236wt_cyp6p4_236wt_n',
    path: 'reference.citation',
  },
  {
    column: 'cyp6p4_236wt_cyp6p4_236wt_percent',
    path: 'reference.citation',
  },
  {
    column: 'cyp6p4_236wt_cyp6p4_236m_n',
    path: 'reference.citation',
  },
  {
    column: 'cyp6p4_236wt_cyp6p4_236m_percent',
    path: 'reference.citation',
  },
  {
    column: 'cyp6p4_236m_cyp6p4_236m_n',
    path: 'reference.citation',
  },
  {
    column: 'cyp6p4_236m_cyp6p4_236m_percent',
    path: 'reference.citation',
  },
  {
    column: 'cyp6p4_236wt_percent',
    path: 'reference.citation',
  },
  {
    column: 'cyp6p4_236m_percent',
    path: 'reference.citation',
  },
  {
    column: 'cyp6aap_wt_cyp6aap_wt_n',
    path: 'reference.citation',
  },
  {
    column: 'cyp6aap_wt_cyp6aap_wt_percent',
    path: 'reference.citation',
  },
  {
    column: 'cyp6aap_wt_cyp6aap_dup1_n',
    path: 'reference.citation',
  },
  {
    column: 'cyp6aap_wt_cyp6aap_dup1_percent',
    path: 'reference.citation',
  },
  {
    column: 'cyp6aap_dup1_cyp6aap_dup1_n',
    path: 'reference.citation',
  },
  {
    column: 'cyp6aap_dup1_cyp6aap_dup1_percent',
    path: 'reference.citation',
  },
  {
    column: 'cyp6aap_wt_percent',
    path: 'reference.citation',
  },
  {
    column: 'cyp6aap_dup1_percent',
    path: 'reference.citation',
  },
  {
    column: 'data_abstracted_by',
    path: 'bionomics.data_abstracted_by',
  },
  {
    column: 'data_checked_by',
    path: 'bionomics.data_checked_by',
  },
  // {
  //   column: 'final_check_by',
  //   path: 'reference.citation',
  // },

  
  

  

  // … continue until template is 
  // complete
];
