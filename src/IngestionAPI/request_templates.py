#-*- coding: utf-8 -*-

"""
the following content is the collection of database queries template used in
this script to facilitate maintenance.
"""


# base tables

template_insert_reference_data = """INSERT INTO public.reference
(id, author, article_title, journal_title, citation, "year", published, report_type, v_data)
VALUES(E'{id}', E'{author}', E'{article_title}', E'{journal_title}', E'{citation}', {year}, {published}, E'{report_type}', {v_data}');"""

template_insert_site_data = """INSERT INTO public.site
(id, country, "location", georef_source, location_2, latitude, longitude, latitude_2, longitude_2, site_notes, area_type, site, latitude_3, longitude_3, latitude_4, longitude_4, latitude_5, longitude_5, latitude_6, longitude_6, latitude_7, longitude_7, latitude_8, longitude_8, confidence_in_georef, admin_level_1, admin_level_2)
VALUES(E'{id}', E'{country}', ST_SetSRID(ST_MakePoint({latitude},{longitude}),4326), E'{georef_source}', ST_SetSRID(ST_MakePoint({latitude_2},{longitude_3}),4326), {latitude}, {longitude}, {latitude_2}, {longitude_2}, E'{site_notes}', E'{area_type}', E'{site}', {latitude_3}, {longitude_3}, {latitude_4}, {longitude_4}, {latitude_5}, {longitude_5}, {latitude_6}, {longitude_6}, {latitude_7}, {longitude_7}, {latitude_8}, {longitude_8}, E'{confidence_in_georef}', {admin_level_1}, E'{admin_level_2}');"""

template_insert_biology_data = """INSERT INTO public.biology
(id, sampling_1, sampling_2, sampling_3, sampling_n, parity_n, parity_total, parity_perc, daily_survival_rate, fecundity, gonotrophic_cycle_days, notes)
VALUES(E'{id}', E'{sampling_1}', E'{sampling_2}', E'{sampling_3}', E'{sampling_n}', {parity_n}, {parity_total}, {parity_perc}, {daily_survival_rate}, {fecundity}, {gonotrophic_cycle_days}, E'{notes}');"""

template_insert_infection_data = """INSERT INTO public.infection
(id, sampling_1, sampling_2, sampling_3, sampling_n, ir_by_csp_n_pool, ir_by_csp_total_pool, no_per_pool, sr_by_dissection_n, sr_by_dissection_total, sr_by_csp_n, sr_by_csp_total, sr_by_pf_n, sr_by_pf_total, oocyst_n, oocyst_total, eir_period, ir_by_csp_perc, sporozoite_rate_by_dissection_percent, sr_by_csp_perc, sr_by_p_falciparum, oocyst_rate, eir, eir_days, notes, sr_by_pv_n, sr_by_pv_total, sr_by_p_vivax)
VALUES(E'{id}', E'{sampling_1}', E'{sampling_2}', E'{sampling_3}', E'{sampling_n}', {ir_by_csp_n_pool}, {ir_by_csp_total_pool}, {no_per_pool}, {sr_by_dissection_n}, {sr_by_dissection_total}, {sr_by_csp_n},  {sr_by_csp_total}, {sr_by_pf_n}, {sr_by_pf_total}, {oocyst_n}, {oocyst_total}, E'{eir_period}', {ir_by_csp_perc}, E'{sr_by_dissection_perc}', {sr_by_csp_perc}, {sr_by_p_falciparum}, {oocyst_rate}, {eir}, {eir_days}, E'{notes}', {sr_by_pv_n}, {sr_by_pv_total}, {sr_by_p_vivax});"""

template_insert_bitting_rate_data = """INSERT INTO public.biting_rate
(id, hbr_sampling_indoor, hbr_sampling_outdoor, hbr_sampling_combined_1, hbr_sampling_combined_2, hbr_sampling_combined_3, hbr_sampling_combined_n, hbr_unit, abr_sampling_combined_1, abr_sampling_combined_2, abr_sampling_combined_3, abr_sampling_combined_n, abr_unit, indoor_hbr, outdoor_hbr, combined_hbr, abr, notes)
VALUES(E'{id}', E'{hbr_sampling_indoor}', E'{hbr_sampling_outdoor}', E'{hbr_sampling_combined_1}', E'{hbr_sampling_combined_2}', E'{hbr_sampling_combined_3}', E'{hbr_sampling_combined_n}', E'{hbr_unit}', E'{abr_sampling_combined_1}', E'{abr_sampling_combined_2}', E'{abr_sampling_combined_3}', E'{abr_sampling_combined_n}', E'{abr_unit}', {indoor_hbr}, {outdoor_hbr}, {combined_hbr}, {abr}, E'{notes}');"""

template_insert_anthropozoophagic_data = """INSERT INTO public.anthropo_zoophagic
(id, host_sampling_indoor, indoor_host_n, host_sampling_outdoor, outdoor_host_n, host_sampling_combined_1, host_sampling_combined_2, host_sampling_combined_3, host_sampling_combined_n, combined_host_n, host_unit, host_sampling_other_1, host_sampling_other_2, host_sampling_other_3, host_sampling_other_n, other_host_n, other_host_total, host_other_unit, indoor_host_perc, outdoor_host_perc, combined_host, host_other, notes, indoor_host_total, outdoor_host_total, combined_host_total)
VALUES(E'{id}', E'{host_sampling_indoor}', {indoor_host_n}, E'{host_sampling_outdoor}', {outdoor_host_n}, E'{host_sampling_combined_1}', E'{host_sampling_combined_2}', E'{host_sampling_combined_3}', E'{host_sampling_combined_n}', {combined_host_n}, E'{host_unit}', E'{host_sampling_other_1}', E'{host_sampling_other_2}', E'{host_sampling_other_3}', E'{host_sampling_other_n}', {other_host_n}, {other_host_total}, E'{host_other_unit}', {indoor_host_perc}, {outdoor_host_perc}, {combined_host}, {host_other}, E'{notes}', {indoor_host_total}, {outdoor_host_total}, {combined_host_total});"""

template_insert_endoexophagic_data = """INSERT INTO public.endo_exophagic
(id, sampling_nights_no_indoor, biting_sampling_indoor, sampling_nights_no_outdoor, biting_sampling_outdoor, biting_unit, indoor_biting_n, indoor_biting_total, indoor_biting_data, outdoor_biting_n, outdoor_biting_total, outdoor_biting_data, notes)
VALUES(E'{id}', {sampling_nights_no_indoor}, E'{biting_sampling_indoor}', {sampling_nights_no_outdoor}, E'{biting_sampling_outdoor}', E'{biting_unit}', {indoor_biting_n}, {indoor_biting_total}, {indoor_biting_data}, {outdoor_biting_n}, {outdoor_biting_total}, {outdoor_biting_data}, E'{notes}');"""

template_insert_biting_activity_data = """INSERT INTO public.biting_activity
(id, sampling_nights_no_indoor, "18_30_21_30_indoor", "21_30_00_30_indoor", "00_30_03_30_indoor", "03_30_06_30_indoor", sampling_nights_no_outdoor, "18_30_21_30_outdoor", "21_30_00_30_outdoor", "00_30_03_30_outdoor", "03_30_06_30_outdoor", sampling_nights_no_combined, "18_30_21_30_combined", "21_30_00_30_combined", "00_30_03_30_combined", "03_30_06_30_combined", notes, "18_00_19_00_indoor", "19_00_20_00_indoor", "20_00_21_00_indoor", "21_00_22_00_indoor", "22_00_23_00_indoor", "23_00_00_00_indoor", "00_00_01_00_indoor", "01_00_02_00_indoor", "02_00_03_00_indoor", "03_00_04_00_indoor", "04_00_05_00_indoor", "05_00_06_00_indoor", "18_00_19_00_combined", "19_00_20_00_combined", "20_00_21_00_combined", "21_00_22_00_combined", "22_00_23_00_combined", "23_00_00_00_combined", "00_00_01_00_combined", "01_00_02_00_combined", "02_00_03_00_combined", "03_00_04_00_combined", "04_00_05_00_combined", "05_00_06_00_combined", "18_00_19_00_outdoor", "19_00_20_00_outdoor", "20_00_21_00_outdoor", "21_00_22_00_outdoor", "22_00_23_00_outdoor", "23_00_00_00_outdoor", "00_00_01_00_outdoor", "01_00_02_00_outdoor", "02_00_03_00_outdoor", "03_00_04_00_outdoor", "04_00_05_00_outdoor", "05_00_06_00_outdoor")
VALUES(E'{id}', {sampling_nights_no_indoor}, {_18_30_21_30_indoor}, {_21_30_00_30_indoor}, {_00_30_03_30_indoor}, {_03_30_06_30_indoor}, {sampling_nights_no_outdoor}, {_18_30_21_30_outdoor}, {_21_30_00_30_outdoor}, {_00_30_03_30_outdoor}, {_03_30_06_30_outdoor}, {sampling_nights_no_combined}, {_18_30_21_30_combined}, {_21_30_00_30_combined}, {_00_30_03_30_combined}, {_03_30_06_30_combined}, E'{notes}', {_18_00_19_00_indoor}, {_19_00_20_00_indoor}, {_20_00_21_00_indoor}, {_21_00_22_00_indoor}, {_22_00_23_00_indoor}, {_23_00_00_00_indoor}, {_00_00_01_00_indoor}, {_01_00_02_00_indoor}, {_02_00_03_00_indoor}, {_03_00_04_00_indoor}, {_04_00_05_00_indoor}, {_05_00_06_00_indoor}, {_18_00_19_00_combined}, {_19_00_20_00_combined}, {_20_00_21_00_combined}, {_21_00_22_00_combined}, {_22_00_23_00_combined}, {_23_00_00_00_combined}, {_00_00_01_00_combined}, {_01_00_02_00_combined}, {_02_00_03_00_combined}, {_03_00_04_00_combined}, {_04_00_05_00_combined}, {_05_00_06_00_combined}, {_18_00_19_00_outdoor}, {_19_00_20_00_outdoor}, {_20_00_21_00_outdoor}, {_21_00_22_00_outdoor}, {_22_00_23_00_outdoor}, {_23_00_00_00_outdoor}, {_00_00_01_00_outdoor}, {_01_00_02_00_outdoor}, {_02_00_03_00_outdoor}, {_03_00_04_00_outdoor}, {_04_00_05_00_outdoor}, {_05_00_06_00_outdoor});"""

template_insert_endoexophily_data = """INSERT INTO public.endo_exophily
(id, resting_sampling_indoor, resting_sampling_outdoor, resting_sampling_other, resting_unit, unfed_indoor, fed_indoor, gravid_indoor, total_indoor, unfed_outdoor, fed_outdoor, gravid_outdoor, total_outdoor, unfed_other, fed_other, gravid_other, total_other, notes)
VALUES(E'{id}', E'{resting_sampling_indoor}', E'{resting_sampling_outdoor}', E'{resting_sampling_other}', E'{resting_unit}', {unfed_indoor}, {fed_indoor}, {gravid_indoor}, {total_indoor}, {unfed_outdoor}, {fed_outdoor}, {gravid_outdoor}, {total_outdoor}, {unfed_other}, {fed_other}, {gravid_other}, {total_other}, E'{notes}');"""

template_insert_specie_data = """INSERT INTO public.recorded_species
(id, species_notes, species, species_id_1, species_id_2)
VALUES(E'{id}', E'{species_notes}', E'{species}', E'{species_id_1}', E'{species_id_2}');"""

template_insert_environment_data = """INSERT INTO public.environment
(id, roof, walls, house_screening, open_eaves, cooking, sleeping_outdoors, farming, local_plants, housing_notes, community_notes, farming_notes, livestock_notes, occupation_1, occupation_2, occupation_3, outdoor_timings_hours, outdoor_activities_notes, average_bedtime, average_waketime, leave_home_time, hours_away, seasonal_labour, livestock_1, livestock_2, livestock_3, livestock_4, environment_notes, outdoor_activities_night, forest)
VALUES(E'{id}', E'{roof}', E'{walls}', {house_screening}, {open_eaves}, E'{cooking}', {sleeping_outdoors}, E'{farming}', E'{local_plants}', E'{housing_notes}', E'{community_notes}', E'{farming_notes}', E'{livestock_notes}', E'{occupation_1}', E'{occupation_2}', E'{occupation_3}', E'{outdoor_timings_hours}', E'{outdoor_activities_notes}', E'{average_bedtime}', E'{average_waketime}', E'{leave_home_time}', E'{hours_away}', E'{seasonal_labour}', E'{livestock_1}', E'{livestock_2}', E'{livestock_3}', E'{livestock_4}', E'{environment_notes}', E'{outdoor_activities_night}', E'{forest}');"""

template_insert_larvasite_data = """INSERT INTO public."Larval_site"
(id, larval_instars_found_1, larval_habitat_1, larval_site_character_1, larval_turbidity_1, larval_salinity_1, larval_vegetation_1, larval_shade_1, larval_water_current_1, larval_size_1, larval_depth_1, larval_performance_1, larval_other_fauna_1, larval_control_present_1, larval_instars_found_2, larval_habitat_2, larval_site_character_2, larval_turbidity_2, larval_salinity_2, larval_vegetation_2, larval_shade_2, larval_water_current_2, larval_size_2, larval_depth_2, larval_performance_2, larval_other_fauna_2, larval_control_present_2, larval_instars_found_3, larval_habitat_3, larval_site_character_3, larval_tubidity_3, larval_salinity_3, larval_vegetation_3, larval_shade_3, larval_water_current_3, larval_size_3, larval_depth_3, larval_performance_3, larval_other_fauna_3, larval_control_present_3, larval_notes)
VALUES(E'{id}', E'{larval_instars_found_1}', E'{larval_habitat_1}', E'{larval_site_character_1}', E'{larval_turbidity_1}', E'{larval_salinity_1}', E'{larval_vegetation_1}', E'{larval_shade_1}', E'{larval_water_current_1}', E'{larval_size_1}', E'{larval_depth_1}', E'{larval_performance_1}', E'{larval_other_fauna_1}', E'{larval_control_present_1}', E'{larval_instars_found_2}', E'{larval_habitat_2}', E'{larval_site_character_2}', E'{larval_turbidity_2}', E'{larval_salinity_2}', E'{larval_vegetation_2}', E'{larval_shade_2}', E'{larval_water_current_2}', E'{larval_size_2}', E'{larval_depth_2}', E'{larval_performance_2}', E'{larval_other_fauna_2}', E'{larval_control_present_2}', E'{larval_instars_found_3}', E'{larval_habitat_3}', E'{larval_site_character_3}', E'{larval_tubidity_3}', E'{larval_salinity_3}', E'{larval_vegetation_3}', E'{larval_shade_3}', E'{larval_water_current_3}', E'{larval_size_3}', E'{larval_depth_3}', E'{larval_performance_3}', E'{larval_other_fauna_3}', E'{larval_control_present_3}', E'{larval_notes}');"""

template_insert_bionomics_data = """INSERT INTO public.bionomics
(id, adult_data, larval_site_data, contact_authors, contact_notes, secondary_info, insecticide_control, "control", month_start, year_start, month_end, year_end, season_given, season_calc, data_abstracted_by, data_checked_by, control_notes, season_notes, "referenceId", "siteId", "biologyId", "infectionId", "bitingRateId", "anthropoZoophagicId", "endoExophagicId", "bitingActivityId", "endoExophilyId", study_sampling_design, itn_use, "environmentId", "datasetId", ir_data, rainfall_time, "larvalSiteId")
VALUES(E'{id}', {adult_data}, {larval_site_data}, {contact_authors}, E'{contact_notes}', E'{secondary_info}', {insecticide_control}, E'{control}', {month_start}, {year_start}, {month_end}, {year_end}, E'{season_given}', E'{season_calc}', E'{data_abstracted_by}', E'{data_checked_by}', E'{control_notes}', E'{season_notes}', E'{referenceId}', E'{siteId}', E'{biologyId}', E'{infectionId}', E'{bitingRateId}', E'{anthropoZoophagicId}', E'{endoExophagicId}', E'{bitingActivityId}', E'{endoExophilyId}', E'{study_sampling_design}', {itn_use}, E'{environmentId}', E'{datasetId}', E'{ir_data}', E'{rainfall_time}', E'{larvalSiteId}');"""

template_insert_sample_method_data = """INSERT INTO public.sample
(id, "control", control_type, sampling_occurrence_1, occurrence_n_1, sampling_occurrence_2, occurrence_n_2, sampling_occurrence_3, occurrence_n_3, sampling_occurrence_4, occurrence_n_4, occurrence_n_tot, occurrence_notes)
VALUES(E'{id}', {control}, E'{control_type}', E'{sampling_occurrence_1}', {occurrence_n_1}, E'{sampling_occurrence_2}', {occurrence_n_2}, E'{sampling_occurrence_3}', {occurrence_n_3}, E'{sampling_occurrence_4}', {occurrence_n_4}, {occurrence_n_tot}, E'{occurrence_notes}');"""

template_insert_occurrence_data = """INSERT INTO public.occurrence
(id, "datasetId", month_start, year_start, month_end, year_end, dec_id, dec_check, map_check, vector_notes, "referenceId", "siteId", "recordedSpeciesId", "sampleId", timestamp_start, timestamp_end, download_count, ir_data, binary_presence, abundance_data)
VALUES(E'{id}', E'{datasetId}', {month_start}, {year_start}, {month_end}, {year_end}, E'{dec_id}', E'{dec_check}', E'{map_check}', E'{vector_notes}', E'{referenceId}', E'{siteId}', E'{recordedSpeciesId}', E'{sampleId}', E'{timestamp_start}', E'{timestamp_end}', {download_count}, E'{ir_data}', E'{binary_presence}', E'{abundance_data}');"""

template_occurrence_update_bio_data = """update occurrence  set "bionomicsId" = E'{bionomicsId}' where id = E'{occ_id}' """

template_occurrence_update_ir_data = """update occurrence  set "insecticideResistanceBioassaysId" = E'{insecticideResistanceBioassaysId}' where id = E'{occ_id}' """

template_insert_dataset_data = """INSERT INTO public.dataset (id, status, "UpdatedBy", "UpdatedAt", doi) 
VALUES(E'{id}', E'{status}', E'{UpdatedBy}', E'{UpdatedAt}', E'{doi}');"""

template_insert_genotypicRepresentativeness_data = """INSERT INTO public."genotypicRepresentativeness"
(id, gen_test_rep_site, gen_test_rep_site_dis, minor_spec_miss_alle_freq_data, notes_population_rep, gen_sample_first_bio_tests, gen_sample_link_spec_bio, bio_subsample_used_gen_test, notes_on_bioessay_linkage)
VALUES('{id}', E'{gen_test_rep_site}', E'{gen_test_rep_site_dis}', E'{minor_spec_miss_alle_freq_data}', E'{notes_population_rep}', E'{gen_sample_first_bio_tests}', E'{gen_sample_link_spec_bio}', E'{bio_subsample_used_gen_test}', E'{notes_on_bioessay_linkage}');"""

template_insert_vgscmethodandsample_data = """INSERT INTO public."vgscMethodAndSample"
(id, vgsc_method_1, vgsc_method_2, vgsc_no_of_mosquitors_tested, vgsc_generation, vgsc_kdr_notes)
VALUES('{id}', E'{vgsc_method_1}', E'{vgsc_method_2}', E'{vgsc_no_of_mosquitors_tested}', E'{vgsc_generation}', E'{vgsc_kdr_notes}');"""

template_insert_vgscgeneytpefrequencies_data = """INSERT INTO public."vgscGeneytpeFrequencies"
(id, "vgsc995l.vgsc995l_n", "vgsc995l.vgsc995l_percent", "vgsc995l.vgsc995f_n", "vgsc995l.vgsc995f_percent", "vgsc995f.vgsc995f_n", "vgsc995f.vgsc995f_percent", "vgsc995l.vgsc995s_n", "vgsc995l.vgsc995s_percent", "vgsc995s.vgsc995s_n", "vgsc995s.vgsc995s_percent", "vgsc995l.vgsc995c_percent", "vgsc995c.vgsc995c_n", "vgsc995c.vgsc995c_percent", "null.vgsc995c_or_vgsc995c.vgsc995c_n", "null.vgsc995c_or_vgsc995c.vgsc995c_percent", "vgsc995f.vgsc995s_percent", "vgsc995f.vgsc995c_n", "vgsc995f.vgsc995c_percent", "vgsc995l.vgsc995c_n", "vgsc995f.vgsc995s_n")
VALUES('{id}', E'{vgsc995l_vgsc995l_n}', E'{vgsc995l_vgsc995l_percent}', E'{vgsc995l_vgsc995f_n}', E'{vgsc995l_vgsc995f_percent}', E'{vgsc995f_vgsc995f_n}', E'{vgsc995f_vgsc995f_percent}', E'{vgsc995l_vgsc995s_n}', E'{vgsc995l_vgsc995s_percent}', E'{vgsc995s_vgsc995s_n}', E'{vgsc995s_vgsc995s_percent}', E'{vgsc995l_vgsc995c_percent}', E'{vgsc995c_vgsc995c_n}', E'{vgsc995c_vgsc995c_percent}', E'{null_vgsc995c_or_vgsc995c_vgsc995c_n}', E'{null_vgsc995c_or_vgsc995c_vgsc995c_percent}', E'{vgsc995f_vgsc995s_percent}', E'{vgsc995f_vgsc995c_n}', E'{vgsc995f_vgsc995c_percent}', E'{vgsc995l_vgsc995c_n}', E'{vgsc995f_vgsc995s_n}');"""

template_insert_kdrgenotypefrequencies_data = """INSERT INTO public."kdrGenotypeFrequencies"
(id, "susceptible.susceptible_n", "susceptible.susceptible_percent", "resistant.susceptible_n", "resistant.susceptible_percent", "resistant.resistant_n", "resistant.resistant_percent")
VALUES('{id}', E'{susceptible_susceptible_n}', E'{susceptible_susceptible_percent}', E'{resistant_susceptible_n}', E'{resistant_susceptible_percent}', E'{resistant_resistant_n}', E'{resistant_resistant_percent}');"""

template_insert_vgsc995allelefrequencies_data = """INSERT INTO public."vgsc995AlleleFrequencies"
(id, vgsc995l_percent, vgsc995f_percent, vgsc995s_percent, vgsc995c_percent, kdr_percent)
VALUES('{id}', E'{vgsc995l_percent}', E'{vgsc995f_percent}', E'{vgsc995s_percent}', E'{vgsc995c_percent}', E'{kdr_percent}');"""

template_insert_vgsc402GenotypeFrequencies_data = """
INSERT INTO public."vgsc402GenotypeFrequencies"
(id, "vgsc402v.vgsc402v_n", "vgsc402v.vgsc402v_percent", "vgsc402v.vgsc402l_n", "vgsc402v.vgsc402l_percent", "vgsc402l.vgsc402l_n", "vgsc402l.vgsc402l_percent")
VALUES('{id}', E'{vgsc402v_vgsc402v_n}', E'{vgsc402v_vgsc402v_percent}', E'{vgsc402v_vgsc402l_n}', E'{vgsc402v_vgsc402l_percent}', E'{vgsc402l_vgsc402l_n}', E'{vgsc402l_vgsc402l_percent}');"""

template_insert_vgsc402AlleleFrequencies_data = """
INSERT INTO public."vgsc402AlleleFrequencies"
(id, vgsc402v_percent, "vgsc.402l_percent")
VALUES('{id}', E'{vgsc402v_percent}', E'{vgsc_402l_percent}');"""

template_insert_cyp6aapAlleleFrequencies_data = """INSERT INTO public."cyp6aapAlleleFrequencies"
(id, "cyp6aap.wt_percent", "cyp6aap.dup1_percent")
VALUES('{id}', E'{cyp6aap_wt_percent}', E'{cyp6aap_dup1_percent}');"""

template_insert_cyp6aapGenotypeFrequencies_data = """INSERT INTO public."cyp6aapGenotypeFrequencies"
(id, "cyp6aap.wt.cyp6aap.wt_n", "cyp6aap.wt.cyp6aap.wt_percent", "cyp6aap.wt.cyp6aap.dup1_n", "cyp6aap.wt.cyp6aap.dup1_percent", "cyp6aap.dup1.cyp6aap.dup1_n", "cyp6aap.dup1.cyp6aap.dup1_percent")
VALUES('{id}', E'{cyp6aap_wt_cyp6aap_wt_n}', E'{cyp6aap_wt_cyp6aap_wt_percent}', E'{cyp6aap_wt_cyp6aap_dup1_n}', E'{cyp6aap_wt_cyp6aap_dup1_percent}', E'{cyp6aap_dup1_cyp6aap_dup1_n}', E'{cyp6aap_dup1_cyp6aap_dup1_percent}');"""

template_insert_cyp6p4AlleleFrequencies_data = """INSERT INTO public."cyp6p4AlleleFrequencies"
(id, "cyp6p4.236wt_percent", "cyp6p4.236m_percent")
VALUES('{id}', E'{cyp6p4_236wt_percent}', E'{cyp6p4_236m_percent}');"""

template_insert_cyp6p4GenotypeFrequencies_data = """INSERT INTO public."cyp6p4GenotypeFrequencies"
(id, "cyp6p4.236wt_cyp6p4.236wt_n", "cyp6p4.236wt_cyp6p4.236wt_percent", "cyp6p4.236wt_cyp6p4.236m_n", "cyp6p4.236wt_cyp6p4.236m_percent", "cyp6p4.236m_cyp6p4.236m_n", "cyp6p4.236m_cyp6p4.236m_percent")
VALUES('{id}', E'{cyp6p4_236wt_cyp6p4_236wt_n}', E'{cyp6p4_236wt_cyp6p4_236wt_percent}', E'{cyp6p4_236wt_cyp6p4_236m_n}', E'{cyp6p4_236wt_cyp6p4_236m_percent}', E'{cyp6p4_236m_cyp6p4_236m_n}', E'{cyp6p4_236m_cyp6p4_236m_percent}');"""

template_insert_cyp4j5AlleleFrequencies_data = """INSERT INTO public."cyp4j5AlleleFrequencies"
(id, "cyp4j5.43l_percent", "cyp4j5.43f_percent")
VALUES('{id}', E'{cyp4j5_43l_percent}', E'{cyp4j5_43f_percent}');"""

template_insert_cyp4j5GenotypeFrequencies_data = """INSERT INTO public."cyp4j5GenotypeFrequencies"
(id, "cyp4j5_43l.cyp4j5_43l_n", "cyp4j5_43l.cyp4j5_43l_percent", "cyp4j5_43l.cyp4j5_43f_n", "cyp4j5_43l.cyp4j5_43f_percent", "cyp4j5_43f.cyp4j5_43f_n", "cyp4j5_43f.cyp4j5_43f_percent")
VALUES('{id}', E'{cyp4j5_43l_cyp4j5_43l_n}', E'{cyp4j5_43l_cyp4j5_43l_percent}', E'{cyp4j5_43l_cyp4j5_43f_n}', E'{cyp4j5_43l_cyp4j5_43f_percent}', E'{cyp4j5_43f_cyp4j5_43f_n}', E'{cyp4j5_43f_cyp4j5_43f_percent}');"""

template_insert_cytochromesP450_cypMethodAndSample_data = """INSERT INTO public."cytochromesP450_cypMethodAndSample"
(id, cyp_method_1, cyp_number_of_mosquitoes_tested, cyp_generation, cyp_notes)
VALUES('{id}', E'{cyp_method_1}', E'{cyp_number_of_mosquitoes_tested}', E'{cyp_generation}', E'{cyp_notes}');"""

template_insert_gste2_119AlleleFrequencies_data = """INSERT INTO public."gste2_119AlleleFrequencies"
(id, gste2_119l_percent, gste2_119v_percent)
VALUES('{id}', E'{gste2_119l_percent}', E'{gste2_119v_percent}');"""

template_insert_gste2_119GenotypeFrequencies_data = """INSERT INTO public."gste2_119GenotypeFrequencies"
(id, "gste2_119l.gste2_119l_n", "gste2_119l.gste2_119l_percent", "gste2_119l.gste2_119v_n", "gste2_119l.gste2_119v_percent", "gste2_119v.gste2_119v_n", "gste2_119v.gste2_119v_percent")
VALUES('{id}', E'{gste2_119l_gste2_119l_n}', E'{gste2_119l_gste2_119l_percent}', E'{gste2_119l_gste2_119v_n}', E'{gste2_119l_gste2_119v_percent}', E'{gste2_119v_gste2_119v_n}', E'{gste2_119v_gste2_119v_percent}');"""

template_insert_gste2_114AlleleFrequencies_data = """INSERT INTO public."gste2_114AlleleFrequencies"
(id, "gste2_114I_percent", gste2_114t_percent)
VALUES('{id}', E'{gste2_114I_percent}', E'{gste2_114t_percent}');"""

template_insert_gste2_114GenotypeFrequencies_data = """INSERT INTO public."gste2_114GenotypeFrequencies"
(id, "gste2_114I.gste2_114I_n", "gste2_114I.gste2_114I_percent", "gste2_114I.gste2_114t_n", "gste2_114I.gste2_114t_percent", "gste2_114t.gste2_114t_n", "gste2_114t.gste2_114t_percent")
VALUES('{id}', E'{gste2_114I_gste2_114I_n}', E'{gste2_114I_gste2_114I_percent}', E'{gste2_114I_gste2_114t_n}', E'{gste2_114I_gste2_114t_percent}', E'{gste2_114t_gste2_114t_n}', E'{gste2_114t_gste2_114t_percent}');"""

template_insert_vgsc1570GenotypeFrequencies_data = """INSERT INTO public."vgsc1570GenotypeFrequencies"
(id, "vgsc1570n.vgsc1570n_n", "vgsc1570n.vgsc1570n_percent", "vgsc1570n.vgsc1570y_n", "vgsc1570n.1570y_percent", "vgsc1570y.vgsc1570y_n", "vgsc1570y.vgsc1570y_percent")
VALUES('{id}', E'{vgsc1570n_vgsc1570n_n}', E'{vgsc1570n_vgsc1570n_percent}', E'{vgsc1570n_vgsc1570y_n}', E'{vgsc1570n_1570y_percent}', E'{vgsc1570y_vgsc1570y_n}', E'{vgsc1570y_vgsc1570y_percent}');"""

template_insert_vgsc1570AlleleFrequencies_data = """INSERT INTO public."vgsc1570AlleleFrequencies"
(id, vgsc1570n_percent, vgsc1570y_percent)
VALUES('{id}', E'{vgsc1570n_percent}', E'{vgsc1570y_percent}');"""

template_insert_rdlMethodAndSample_data = """INSERT INTO public."rdlMethodAndSample"
(id, rdl_method_1, rdl_no_of_mosquitoes_tested, rdl_generation, rdl_notes)
VALUES('{id}', E'{rdl_method_1}', E'{rdl_no_of_mosquitoes_tested}', E'{rdl_generation}', E'{rdl_notes}');"""

template_insert_rdl296GenotypeFrequencies_data = """INSERT INTO public."rdl296GenotypeFrequencies"
(id, "rdl296c.rdl296c_n", "rdl296c.rdl296c_percent", "rdl296c.rdl296g_n", "rdl296c.rdl296g_percent", "rdl296g.rdl296g_n", "rdl296g.rdl296g_percent", "rdl296c.rdl296s_n", "rdl296c.rdl296s_percent", "rdl296s.rdl296s_n", "rdl296s.rdl296s_percent", "rdl296g.rdl296s_n", "rdl296g.rdl296s_percent")
VALUES('{id}', E'{rdl296c_rdl296c_n}', E'{rdl296c_rdl296c_percent}', E'{rdl296c_rdl296g_n}', E'{rdl296c_rdl296g_percent}', E'{rdl296g_rdl296g_n}', E'{rdl296g_rdl296g_percent}', E'{rdl296c_rdl296s_n}', E'{rdl296c_rdl296s_percent}', E'{rdl296s_rdl296s_n}', E'{rdl296s_rdl296s_percent}', E'{rdl296g_rdl296s_n}', E'{rdl296g_rdl296s_percent}');"""

template_insert_rdl296AlleleFrequencies_data = """INSERT INTO public."rdl296AlleleFrequencies"
(id, rdl296c_percent, rdl296g_percent, rdl296s_percent)
VALUES('{id}', E'{rdl296c_percent}', E'{rdl296g_percent}', E'{rdl296s_percent}');"""

template_insert_ace1MethodAndSample_data = """INSERT INTO public."ace1MethodAndSample"
(id, ace1_method_1, ace1_no_of_mosquitoes_tested, ace1_generation, ace1_notes)
VALUES('{id}', E'{ace1_method_1}', E'{ace1_no_of_mosquitoes_tested}', E'{ace1_generation}', E'{ace1_notes}');"""

template_insert_ace1GenotypeFrequencies_data = """INSERT INTO public."ace1GenotypeFrequencies"
(id, "ace1_280g.ace1_280g_n", "ace1_280g.ace1_280g_percent", "ace1_280g.ace1_280s_n", "ace1_280g.ace1_280s_percent", "ace1_280s.ace1_280s_n", "ace1_280s.ace1_280s_percent")
VALUES('{id}', E'{ace1_280g_ace1_280g_n}', E'{ace1_280g_ace1_280g_percent}', E'{ace1_280g_ace1_280s_n}', E'{ace1_280g_ace1_280s_percent}', E'{ace1_280s_ace1_280s_n}', E'{ace1_280s_ace1_280s_percent}');"""

template_insert_ace1AlleleFrequencies_data = """INSERT INTO public."ace1AlleleFrequencies"
(id, ace1_280g_percent, ace1_280s_percent)
VALUES('{id}', E'{ace1_280g_percent}', E'{ace1_280s_percent}');"""

template_insert_gsteMethodAndSample_data = """INSERT INTO public."gsteMethodAndSample"
(id, gste_method_1, gste_no_of_mosquitoes_tested, gste_generation, gste_notes)
VALUES('{id}', E'{gste_method_1}', E'{gste_no_of_mosquitoes_tested}', E'{gste_generation}', E'{gste_notes}');"""

template_insert_ir_data = """INSERT INTO public."insecticideResistanceBioassays"
(id, bio_rep_complex_site, bio_rep_complex_site_disaggregated, generation, wild_caught_larvae_adults, lower_age_days, upper_age_days, test_protocal, insecticide_tested, insecticide_class, irac_moa, irac_moa_code, concentration_percent, concentration_microgram, exposure_period_min, intensity_multiplier, synergist_tested, synergist_concentration, synergist_concentration_unit, mosquitors_tested_n, mosquitors_dead_n, percent_mortality, knock_down_expo_time_min, no_mosq_knock_down, knock_down_percent, ktd_50_percent_min, ktd_90_percent_min, ktd_95_percent_min, bioassay_notes, "genotypicRepresentativenessId", "vgscMethodAndSampleId", "vgscGeneytpeFrequenciesId", "kdrGenotypeFrequenciesId", "vgsc995AlleleFrequenciesId", "vgsc402GenotypeFrequenciesId", "vgsc402AlleleFrequenciesId", "cyp6aapAlleleFrequenciesId", "cyp6aapGenotypeFrequenciesId", "cyp6p4AlleleFrequenciesId", "cyp6p4GenotypeFrequenciesId", "cyp4j5AlleleFrequenciesId", "cyp4j5GenotypeFrequenciesId", "cytochromesP450CypMethodAndSampleId", "gste2119AlleleFrequenciesId", "gste2119GenotypeFrequenciesId", "gste2114AlleleFrequenciesId", "gste2114GenotypeFrequenciesId", "vgsc1570GenotypeFrequenciesId", "vgsc1570AlleleFrequenciesId", "rdlMethodAndSampleId", "rdl296GenotypeFrequenciesId", "rdl296AlleleFrequenciesId", "ace1MethodAndSampleId", "ace1GenotypeFrequenciesId", "ace1AlleleFrequenciesId", "gsteMethodAndSampleId")
VALUES('{id}', E'{bio_rep_complex_site}', E'{bio_rep_complex_site_disaggregated}', E'{generation}', E'{wild_caught_larvae_adults}', E'{lower_age_days}', E'{upper_age_days}', E'{test_protocal}', E'{insecticide_tested}', E'{insecticide_class}', E'{irac_moa}', E'{irac_moa_code}', E'{concentration_percent}', E'{concentration_microgram}', E'{exposure_period_min}', E'{intensity_multiplier}', E'{synergist_tested}', E'{synergist_concentration}', E'{synergist_concentration_unit}', E'{mosquitors_tested_n}', E'{mosquitors_dead_n}', E'{percent_mortality}', E'{knock_down_expo_time_min}', E'{no_mosq_knock_down}', E'{knock_down_percent}', E'{ktd_50_percent_min}', E'{ktd_90_percent_min}', E'{ktd_95_percent_min}', E'{bioassay_notes}', E'{genotypicRepresentativenessId}', E'{vgscMethodAndSampleId}', E'{vgscGeneytpeFrequenciesId}', E'{kdrGenotypeFrequenciesId}', E'{vgsc995AlleleFrequenciesId}', E'{vgsc402GenotypeFrequenciesId}', E'{vgsc402AlleleFrequenciesId}', E'{cyp6aapAlleleFrequenciesId}', E'{cyp6aapGenotypeFrequenciesId}', E'{cyp6p4AlleleFrequenciesId}', E'{cyp6p4GenotypeFrequenciesId}', E'{cyp4j5AlleleFrequenciesId}', E'{cyp4j5GenotypeFrequenciesId}', E'{cytochromesP450CypMethodAndSampleId}', E'{gste2119AlleleFrequenciesId}', E'{gste2119GenotypeFrequenciesId}', E'{gste2114AlleleFrequenciesId}', E'{gste2114GenotypeFrequenciesId}', E'{vgsc1570GenotypeFrequenciesId}', E'{vgsc1570AlleleFrequenciesId}', E'{rdlMethodAndSampleId}', E'{rdl296GenotypeFrequenciesId}', E'{rdl296AlleleFrequenciesId}', E'{ace1MethodAndSampleId}', E'{ace1GenotypeFrequenciesId}', E'{ace1AlleleFrequenciesId}', E'{gsteMethodAndSampleId}');"""

template_select_reference_data = """SELECT id FROM public.reference WHERE citation=E'{citation}' AND year={year};"""

template_select_site_data = """SELECT id FROM public.site WHERE latitude=E'{latitude}' AND longitude=E'{longitude}';"""

template_select_specie_data = """SELECT id FROM public.recorded_species WHERE species=E'{species}';"""

