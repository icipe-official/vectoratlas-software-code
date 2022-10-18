export function occurrenceMapper(itemsArray) {
  const occurrenceArray = [
    [
      'id',
      'month_start',
      'year_start',
      'month_end',
      'year_end',
      'dec_id',
      'dec_check',
      'map_check',
      'vector_notes',
      'site_id',
      'site_country',
      'site_name',
      'site_map_site',
      'site_location_type',
      'site_location_coordinates_0',
      'site_location_coordinates_1',
      'site_latitude',
      'site_longitude',
      'site_georef_source',
      'site_site_notes',
      'site_gaul_code',
      'site_admin_level',
      'site_georef_notes',
      'site_admin_1',
      'site_admin_2',
      'site_admin_3',
      'site_admin_2_id',
      'site_location_2_type',
      'site_location_2_coordinates_0',
      'site_location_2_coordinates_1',
      'site_latitude_2',
      'site_longitude_2',
      'site_latlong_source',
      'site_good_guess',
      'site_bad_guess',
      'site_rural_urban',
      'site_is_forest',
      'site_is_rice',
      'site_area_type',
      'sample_id',
      'sample_mossamp_tech_1',
      'sample_n_1',
      'sample_mossamp_tech_2',
      'sample_n_2',
      'sample_mossamp_tech_3',
      'sample_n_3',
      'sample_mossamp_tech_4',
      'sample_n_4',
      'sample_n_all',
      'sample_control',
      'sample_control_type',
      'reference_id',
      'reference_author',
      'reference_article_title',
      'reference_journal_title',
      'reference_citation',
      'reference_year',
      'reference_published',
      'reference_report_type',
      'reference_v_data',
      'recordedSpecies_id',
      'recordedSpecies_ss_sl',
      'recordedSpecies_assi',
      'recordedSpecies_assi_notes',
      'recordedSpecies_id_method_1',
      'recordedSpecies_id_method_2',
      'recordedSpecies_id_method_3',
      'recordedSpecies_species_id',
      'recordedSpecies_species_subgenus',
      'recordedSpecies_species_series',
      'recordedSpecies_species_section',
      'recordedSpecies_species_complex',
      'recordedSpecies_species_species',
      'recordedSpecies_species_species_author',
      'recordedSpecies_species_year',
      'recordedSpecies_species_reference_id',
      'recordedSpecies_species_reference_author',
      'recordedSpecies_species_reference_article_title',
      'recordedSpecies_species_reference_journal_title',
      'recordedSpecies_species_reference_citation',
      'recordedSpecies_species_reference_year',
      'recordedSpecies_species_reference_published',
      'recordedSpecies_species_reference_report_type',
      'recordedSpecies_species_reference_v_data',
    ],
    ...itemsArray.map((item) => [
      item.id,
      item.month_start,
      item.year_start,
      item.month_end,
      item.year_end,
      item.dec_id,
      item.dec_check,
      item.map_check,
      item.vector_notes,
      item.site_id,
      item.site_country,
      item.site_name,
      item.site_map_site,
      item.site_location_type,
      item.site_location_coordinates_0,
      item.site_location_coordinates_1,
      item.site_latitude,
      item.site_longitude,
      item.site_georef_source,
      item.site_site_notes,
      item.site_gaul_code,
      item.site_admin_level,
      item.site_georef_notes,
      item.site_admin_1,
      item.site_admin_2,
      item.site_admin_3,
      item.site_admin_2_id,
      item.site_location_2_type,
      item.site_location_2_coordinates_0,
      item.site_location_2_coordinates_1,
      item.site_latitude_2,
      item.site_longitude_2,
      item.site_latlong_source,
      item.site_good_guess,
      item.site_bad_guess,
      item.site_rural_urban,
      item.site_is_forest,
      item.site_is_rice,
      item.site_area_type,
      item.sample_id,
      item.sample_mossamp_tech_1,
      item.sample_n_1,
      item.sample_mossamp_tech_2,
      item.sample_n_2,
      item.sample_mossamp_tech_3,
      item.sample_n_3,
      item.sample_mossamp_tech_4,
      item.sample_n_4,
      item.sample_n_all,
      item.sample_control,
      item.sample_control_type,
      item.reference_id,
      item.reference_author,
      item.reference_article_title,
      item.reference_journal_title,
      item.reference_citation,
      item.reference_year,
      item.reference_published,
      item.reference_report_type,
      item.reference_v_data,
      item.recordedSpecies_id,
      item.recordedSpecies_ss_sl,
      item.recordedSpecies_assi,
      item.recordedSpecies_assi_notes,
      item.recordedSpecies_id_method_1,
      item.recordedSpecies_id_method_2,
      item.recordedSpecies_id_method_3,
      item.recordedSpecies_species_id,
      item.recordedSpecies_species_subgenus,
      item.recordedSpecies_species_series,
      item.recordedSpecies_species_section,
      item.recordedSpecies_species_complex,
      item.recordedSpecies_species_species,
      item.recordedSpecies_species_species_author,
      item.recordedSpecies_species_year,
      item.recordedSpecies_species_reference_id,
      item.recordedSpecies_species_reference_author,
      item.recordedSpecies_species_reference_article_title,
      item.recordedSpecies_species_reference_journal_title,
      item.recordedSpecies_species_reference_citation,
      item.recordedSpecies_species_reference_year,
      item.recordedSpecies_species_reference_published,
      item.recordedSpecies_species_reference_report_type,
      item.recordedSpecies_species_reference_v_data,
    ]),
  ]
    .map((e) => e.join(','))
    .join('\n');
  return occurrenceArray;
}