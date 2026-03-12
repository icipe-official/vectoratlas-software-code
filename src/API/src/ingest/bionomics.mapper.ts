import { v4 as uuidv4 } from 'uuid';
import { isEmpty, makeDate } from 'src/utils';
import { Bionomics } from 'src/db/bionomics/entities/bionomics.entity';
import { Reference } from 'src/db/shared/entities/reference.entity';
import { Site } from 'src/db/shared/entities/site.entity';
import { RecordedSpecies } from 'src/db/shared/entities/recorded_species.entity';
import { Biology } from 'src/db/bionomics/entities/biology.entity';
import { Infection } from 'src/db/bionomics/entities/infection.entity';
import { BitingRate } from 'src/db/bionomics/entities/biting_rate.entity';
import { AnthropoZoophagic } from 'src/db/bionomics/entities/anthropo_zoophagic.entity';
import { EndoExophagic } from 'src/db/bionomics/entities/endo_exophagic.entity';
import { BitingActivity } from 'src/db/bionomics/entities/biting_activity.entity';
import { EndoExophily } from 'src/db/bionomics/entities/endo_exophily.entity';
import { Environment } from 'src/db/bionomics/entities/environment.entity';

export const mapBionomics = (bionomics): Partial<Bionomics> => {
  return {
    id: uuidv4(),
    adult_data: bionomics['adult data'],
    larval_site_data: bionomics['larval site data'],
    study_sampling_design: bionomics['study/sampling design'],
    contact_authors: bionomics['contact authors'],
    contact_notes: bionomics['source notes'],
    insecticide_control: bionomics['insecticide control'],
    //ir_data: bionomics['ir data'],
    itn_use: bionomics['ITN use?'],
    control: bionomics['insecticide control'],
    control_notes: bionomics['control notes'],
    month_start: bionomics.month_st,
    month_end: bionomics.month_end,
    year_start: bionomics.year_st,
    year_end: bionomics.year_end,
    season_given: bionomics['season (given)'],
    season_calc: bionomics['season (calc)'],
    season_notes: bionomics['season notes'],
    data_abstracted_by: bionomics['data abstracted by'],
    data_checked_by: bionomics['data checked by'],
    final_check_by: bionomics['final check by'],
    timestamp_start: makeDate(bionomics.year_st, bionomics.month_st),
    timestamp_end: makeDate(bionomics.year_end, bionomics.month_end),
  };
};

export const mapBionomicsReference = (bionomics): Partial<Reference> => {
  return {
    id: uuidv4(),
    author: bionomics.author,
    article_title: bionomics['article title'],
    journal_title: bionomics['journal title'],
    year: bionomics['publication year'],
    citation: createReferenceCitation(bionomics),
  };
};

export const createReferenceCitation = (bionomics) =>
  'Author: ' + bionomics.author + ', Year: ' + bionomics['publication year'];

export const mapBionomicsRecordedSpecies = (
  bionomics,
): Partial<RecordedSpecies> => {
  return {
    id: uuidv4(),
    species_notes: bionomics['species notes'],
    species: bionomics['species'],
  };
};

export const mapBionomicsSite = (bionomics): Partial<Site> => {
  return {
    id: uuidv4(),
    country: bionomics.country,
    site: bionomics.site,
    site_notes: bionomics['site notes'],
    location: {
      type: 'Point',
      coordinates: [
        Number(bionomics.longitude_1),
        Number(bionomics.latitude_1),
      ],
    },
    area_type: bionomics['area type'],
    georef_source: bionomics['georef source'],

    admin_level_1: bionomics['admin level_1'],

    latitude: bionomics.latitude_1,
    longitude: bionomics.longitude_1,
  };
};

export const mapBionomicsBiology = (bionomics): Partial<Biology> => {
  const biology = {
    sampling_1: bionomics['sampling (biology)_1'],
    sampling_2: bionomics['sampling (biology)_2'],
    sampling_3: bionomics['sampling (biology)_3'],
    sampling_n: bionomics['sampling (biology)_n'],
    parity_n: bionomics['parity (n)'],
    parity_total: bionomics['parity (total)'],
    parity_percent: bionomics['parity (%)'],
    daily_survival_rate: bionomics['daily survival rate (%)'],
    fecundity_mean_batch_size: bionomics['fecundity (mean batch size)'],
    gonotrophic_cycle_days: bionomics['gonotrophic cycle (days)'],
    notes: bionomics['biology notes'],
  };

  return isEmpty(biology) ? null : { ...biology, id: uuidv4() };
};

export const mapBionomicsInfection = (bionomics): Partial<Infection> => {
  const infection = {
    sampling_infection_1: bionomics['sampling (infection)_1'],
    sampling_infection_2: bionomics['sampling (infection)_2'],
    sampling_infection_3: bionomics['sampling (infection)_3'],
    sampling_infection_n: bionomics['sampling (infection)_n'],
    ir_by_csp_n_pool: bionomics['IR by CSP (n_pool)'],
    ir_by_csp_total_pool: bionomics['IR by CSP (total_pool)'],
    no_per_pool: bionomics['No. per pool'],
    ir_by_csp_perc: bionomics['IR by CSP (%)'],
    sporozoite_rate_by_dissection_n: bionomics['SR by dissection (n)'],
    sporozoite_rate_by_dissection_total: bionomics['SR by dissection (total)'],
    sporozoite_rate_by_dissection_percent: bionomics['SR by dissection (%)'],
    sporozoite_rate_by_csp_n_pool: bionomics['SR by CSP (n_pool)'],
    sporozoite_rate_by_csp_total_pool: bionomics['SR by CSP (total_pool)'],
    sporozoite_rate_by_csp_percent: bionomics['SR by CSP (%)'],
    sporozoite_rate_p_falciparum_n: bionomics['SR by Pf (n)'],
    sporozoite_rate_p_falciparum_total: bionomics['SR by Pf (total)'],
    sporozoite_rate_p_falciparum_percent: bionomics['SR by P. falciparum'],
    sporozoite_rate_p_vivax_n: bionomics['SR by Pv (n)'],
    sporozoite_rate_p_vivax_total: bionomics['SR by Pv (total)'],
    sporozoite_rate_p_vivax_percent: bionomics['SR by P. vivax'],
    oocyst_n: bionomics['oocyst (n)'],
    oocyst_total: bionomics['oocyst (total)'],
    oocyst_rate_percent: bionomics['oocyst rate (%)'],
    eir: bionomics['EIR'],
    eir_period: bionomics['EIR (period)'],
    eir_days: bionomics['Ext. incubation period (days)'],
    infection_notes: bionomics['infection notes'],
  };

  return isEmpty(infection) ? null : { ...infection, id: uuidv4() };
};

export const mapBionomicsBitingRate = (bionomics): Partial<BitingRate> => {
  const bitingRate = {
    hbr_sampling_indoor: bionomics['HBR sampling (indoor)'],
    indoor_hbr: bionomics['indoor HBR'],
    hbr_sampling_outdoor: bionomics['HBR sampling (outdoor)'],
    outdoor_hbr: bionomics['outdoor HBR'],
    hbr_sampling_combined_1: bionomics['HBR sampling (combined)_1'],
    hbr_sampling_combined_2: bionomics['HBR sampling (combined)_2'],
    hbr_sampling_combined_3: bionomics['HBR sampling (combined)_3'],
    hbr_sampling_combined_n: bionomics['HBR sampling (combined)_n'],
    combined_hbr: bionomics['combined HBR'],
    hbr_unit: bionomics['HBR (unit)'],
    abr_sampling_1: bionomics['ABR sampling_1'],
    abr_sampling_2: bionomics['ABR sampling_2'],
    abr_sampling_3: bionomics['ABR sampling_3'],
    abr_sampling_n: bionomics['ABR sampling_n'],
    abr: bionomics['ABR'],
    abr_unit: bionomics['ABR unit'],
    biting_rate_notes: bionomics['biting rate notes'],
  };

  return isEmpty(bitingRate) ? null : { ...bitingRate, id: uuidv4() };
};

export const mapBionomicsAnthropoZoophagic = (
  bionomics,
): Partial<AnthropoZoophagic> => {
  const anthropoZoophagic = {
    host_sampling_indoor: bionomics['host sampling (indoor)'],
    indoor_host_n: bionomics['indoor host (n)'],
    indoor_host_total: bionomics['indoor host (total)'],
    indoor_host_perc: bionomics['indoor host %'],
    host_sampling_outdoor: bionomics['host sampling (outdoor)'],
    outdoor_host_n: bionomics['outdoor host (n)'],
    outdoor_host_total: bionomics['outdoor host (total)'],
    outdoor_host_percent: bionomics['outdoor host %'],
    host_sampling_combined_1: bionomics['host sampling (combined)_1'],
    host_sampling_combined_2: bionomics['host sampling (combined)_2'],
    host_sampling_combined_3: bionomics['host sampling (combined)_3'],
    host_sampling_combined_n: bionomics['host sampling (combined)_n'],
    combined_host_n: bionomics['combined host (n)'],
    combined_host_total: bionomics['combined host (total)'],
    combined_host: bionomics['combined host'],
    host_unit: bionomics['host (unit)'],
    host_sampling_other_1: bionomics['host sampling (other)_1'],
    host_sampling_other_2: bionomics['host sampling (other)_2'],
    host_sampling_other_3: bionomics['host sampling (other)_3'],
    host_sampling_other_n: bionomics['host sampling (other)_n'],
    other_host_n: bionomics['other host (n)'],
    other_host_total: bionomics['other host (total)'],
    host_other: bionomics['host (other)'],
    host_other_unit: bionomics['host (other) unit'],
    host_notes: bionomics['host notes'],
  };

  return isEmpty(anthropoZoophagic)
    ? null
    : { ...anthropoZoophagic, id: uuidv4() };
};

export const mapBionomicsEndoExophagic = (
  bionomics,
): Partial<EndoExophagic> => {
  const endoExophagic = {
    biting_number_of_sampling_nights_indoors:
      bionomics['biting -  No. of sampling nights (indoors)'],
    biting_sampling_indoor: bionomics['biting sampling (indoor)'],
    indoor_biting_n: bionomics['indoor biting (n)'],
    indoor_biting_total: bionomics['indoor biting (total)'],
    indoor_biting_data: bionomics['indoor biting data'],
    biting_number_of_sampling_nights_outdoors:
      bionomics['biting -  No. of sampling nights (outdoors)'],
    biting_sampling_outdoor: bionomics['biting sampling (outdoor)'],
    outdoor_biting_n: bionomics['outdoor biting (n)'],
    outdoor_biting_total: bionomics['outdoor biting (total)'],
    outdoor_biting_data: bionomics['outdoor biting data'],
    indoor_outdoor_biting_unit: bionomics['indoor/outdoor biting (unit)'],
    indoor_outdoor_biting_notes: bionomics['indoor/outdoor biting notes'],
  };

  return isEmpty(endoExophagic) ? null : { ...endoExophagic, id: uuidv4() };
};

export const mapBionomicsBitingActivity = (
  bionomics,
): Partial<BitingActivity> => {
  const bitingActivity = {
    biting_activity_indoor_number_of_sampling_nights:
      bionomics['biting activity (indoor)  -  No. of sampling nights'],
    '1800_1900_in': bionomics['18.00-19.00 (in)'],
    '1900_2000_in': bionomics['19.00-20.00 (in)'],
    '2000_2100_in': bionomics['20.00-21.00 (in)'],
    '2100_2200_in': bionomics['21.00-22.00 (in)'],
    '2200_2300_in': bionomics['22.00-23.00 (in)'],
    '2300_0000_in': bionomics['23.00-00.00 (in)'],
    '0000_0100_in': bionomics['00.00-01.00 (in)'],
    '0100_0200_in': bionomics['01.00-02.00 (in)'],
    '0200_0300_in': bionomics['02.00-03.00 (in)'],
    '0300_0400_in': bionomics['03.00-04.00 (in)'],
    '0400_0500_in': bionomics['04.00-05.00 (in)'],
    '0500_0600_in': bionomics['05.00-06.00 (in)'],
    '1830_2130_in': bionomics['18.30-21.30 (in)'],
    '2130_0030_in': bionomics['21.30-00.30 (in)'],
    '0030_0330_in': bionomics['00.30-03.30 (in)'],
    '0330_0630_in': bionomics['03.30-06.30 (in)'],
    biting_activity_outdoor_number_of_sampling_nights:
      bionomics['biting activity (outdoor)  -  No. of sampling nights'],
    '1800_1900_out': bionomics['18.00-19.00 (out)'],
    '1900_2000_out': bionomics['19.00-20.00 (out)'],
    '2000_2100_out': bionomics['20.00-21.00 (out)'],
    '2100_2200_out': bionomics['21.00-22.00 (out)'],
    '2200_2300_out': bionomics['22.00-23.00 (out)'],
    '2300_0000_out': bionomics['23.00-00.00 (out)'],
    '0000_0100_out': bionomics['00.00-01.00 (out)'],
    '0100_0200_out': bionomics['01.00-02.00 (out)'],
    '0200_0300_out': bionomics['02.00-03.00 (out)'],
    '0300_0400_out': bionomics['03.00-04.00 (out)'],
    '0400_0500_out': bionomics['04.00-05.00 (out)'],
    '0500_0600_out': bionomics['05.00-06.00 (out)'],
    '1830_2130_out': bionomics['18.30-21.30 (out)'],
    '2130_0030_out': bionomics['21.30-00.30 (out)'],
    '0030_0330_out': bionomics['00.30-03.30 (out)'],
    '0330_0630_out': bionomics['03.30-06.30 (out)'],
    biting_activity_combined_number_of_sampling_nights:
      bionomics['biting activity (combined)  -  No. of sampling nights'],
    '1800_1900_combined': bionomics['18.00-19.00 (combined)'],
    '1900_2000_combined': bionomics['19.00-20.00 (combined)'],
    '2000_2100_combined': bionomics['20.00-21.00 (combined)'],
    '2100_2200_combined': bionomics['21.00-22.00 (combined)'],
    '2200_2300_combined': bionomics['22.00-23.00 (combined)'],
    '2300_0000_combined': bionomics['23.00-00.00 (combined)'],
    '0000_0100_combined': bionomics['00.00-01.00 (combined)'],
    '0100_0200_combined': bionomics['01.00-02.00 (combined)'],
    '0200_0300_combined': bionomics['02.00-03.00 (combined)'],
    '0300_0400_combined': bionomics['03.00-04.00 (combined)'],
    '0400_0500_combined': bionomics['04.00-05.00 (combined)'],
    '0500_0600_combined': bionomics['05.00-06.00 (combined)'],
    '1830_2130_combined': bionomics['18.30-21.30 (combined)'],
    '2130_0030_combined': bionomics['21.30-00.30 (combined)'],
    '0030_0330_combined': bionomics['00.30-03.30 (combined)'],
    '0330_0630_combined': bionomics['03.30-06.30 (combined)'],
    biting_notes: bionomics['biting notes'],
  };

  return isEmpty(bitingActivity) ? null : { ...bitingActivity, id: uuidv4() };
};

export const mapBionomicsEndoExophily = (bionomics): Partial<EndoExophily> => {
  const endoExophily = {
    resting_sampling_indoor: bionomics['resting sampling (indoor)'],
    unfed_indoor: bionomics['unfed (indoor)'],
    fed_indoor: bionomics['fed (indoor)'],
    gravid_indoor: bionomics['gravid (indoor)'],
    total_indoor: bionomics['total (indoor)'],
    resting_sampling_outdoor: bionomics['resting sampling (outdoor)'],
    unfed_outdoor: bionomics['unfed (outdoor)'],
    fed_outdoor: bionomics['fed (outdoor)'],
    gravid_outdoor: bionomics['gravid (outdoor)'],
    total_outdoor: bionomics['total (outdoor)'],
    resting_sampling_other: bionomics['resting sampling (other)'],
    unfed_other: bionomics['unfed (other)'],
    fed_other: bionomics['fed (other)'],
    gravid_other: bionomics['gravid (other)'],
    total_other: bionomics['total (other)'],
    resting_unit: bionomics['resting (unit)'],
    resting_notes: bionomics['resting notes'],
  };

  return isEmpty(endoExophily) ? null : { ...endoExophily, id: uuidv4() };
};

export const mapEnvironment = (bionomics): Partial<Environment> => {
  const environment = {
    roof: bionomics['roof'],
    walls: bionomics['walls'],
    house_screening: bionomics['house screening'],
    open_eaves: bionomics['open eaves'],
    cooking: bionomics['cooking'],
    housing_notes: bionomics['housing notes'],
    common_occupation_1: bionomics['common occupation_1'],
    common_occupation_2: bionomics['common occupation_2'],
    common_occupation_3: bionomics['common occupation_3'],
    outdoor_activities_night: bionomics['outdoor activities at night'],
    sleeping_outdoors: bionomics['sleeping outdoors'],
    outdoor_timings_hours: bionomics['outdoor timings/hours'],
    outdoor_activities_notes: bionomics['outdoor activities notes'],
    average_bedtime: bionomics['average bedtime'],
    average_wake_time: bionomics['average wake time'],
    time_people_leave_home_in_morning:
      bionomics['time people leave home  in morning'],
    hours_spent_away_from_home_per_day:
      bionomics['hours spent away from home per day'],
    seasonal_labour: bionomics['seasonal labour'],
    community_notes: bionomics['community notes'],
    farming: bionomics['farming'],
    farming_notes: bionomics['farming notes'],
    livestock_1: bionomics['livestock_1'],
    livestock_2: bionomics['livestock_2'],
    livestock_3: bionomics['livestock_3'],
    livestock_4: bionomics['livestock_4'],
    livestock_notes: bionomics['livestock notes'],
    local_plants: bionomics['local plants'],
    environment_notes: bionomics['environment notes'],
  };

  return isEmpty(environment) ? null : { ...environment, id: uuidv4() };
};
