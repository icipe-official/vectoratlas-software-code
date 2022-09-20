import { v4 as uuidv4 } from 'uuid';
import { isEmpty } from 'src/utils';
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

export const mapBionomics = (bionomics): Partial<Bionomics> => {
  return {
    id: uuidv4(),
    adult_data: bionomics['Adult data'],
    larval_site_data: bionomics['Larval site data'],
    contact_authors: bionomics['Contact authors'],
    contact_notes: bionomics['Contact notes'],
    secondary_info: bionomics['Secondary or general info'],
    insecticide_control: bionomics['Insecticide control'],
    control: bionomics.Control,
    control_notes: bionomics['Control notes'],
    month_start: bionomics.Month_st,
    month_end: bionomics.Month_end,
    year_start: bionomics.Year_st,
    year_end: bionomics.Year_end,
    season_given: bionomics['Season (given)'],
    season_calc: bionomics['Season (calc)'],
    season_notes: bionomics['Season notes'],
    data_abstracted_by: bionomics['Data abstracted by'],
    data_checked_by: bionomics['Data checked by'],
  };
};

export const mapBionomicsReference = (bionomics): Partial<Reference> => {
  return {
    id: uuidv4(),
    author: bionomics.Author,
    article_title: bionomics['Article title'],
    journal_title: bionomics['Journal title'],
    year: bionomics.Year,
  };
};

export const mapBionomicsSpecies = (bionomics): Partial<RecordedSpecies> => {
  return {
    id: uuidv4(),
    assi: bionomics.ASSI,
    id_method_1: bionomics.Id_1,
    id_method_2: bionomics.Id_2,
  };
};

export const mapBionomicsSite = (bionomics): Partial<Site> => {
  return {
    id: uuidv4(),
    country: bionomics.Country,
    name: bionomics.Site,
    map_site: bionomics['MAP site id'],
    location: {
      type: 'Point',
      coordinates: [Number(bionomics.Longitude), Number(bionomics.Latitude)],
    },
    area_type: bionomics['Area type'],
    georef_source: bionomics['Georef source'],
    gaul_code: bionomics['GAUL code'],
    admin_level: bionomics['Admin level'],
    georef_notes: bionomics['Georef notes'],
    latitude: bionomics.Latitude,
    longitude: bionomics.Longitude,
  };
};

export const mapBionomicsBiology = (bionomics): Partial<Biology> => {
  const biology = {
    sampling_1: bionomics['Sampling (biology)_1'],
    sampling_2: bionomics['Sampling (biology)_2'],
    sampling_3: bionomics['Sampling (biology)_3'],
    sampling_n: bionomics['Sampling (biology)_n'],
    parity_n: bionomics['Parity (n)'],
    parity_total: bionomics['Parity (total)'],
    parity_perc: bionomics['Parity (%)'],
    daily_survival_rate: bionomics['Daily survival rate (%)'],
    fecundity: bionomics['Fecundity (mean batch size)'],
    gonotrophic_cycle_days: bionomics['Gonotrophic cycle (days)'],
    notes: bionomics['Biology notes'],
  };

  return isEmpty(biology) ? null : { ...biology, id: uuidv4() };
};

export const mapBionomicsInfection = (bionomics): Partial<Infection> => {
  const infection = {
    sampling_1: bionomics['Sampling (infection)_1'],
    sampling_2: bionomics['Sampling (infection)_2'],
    sampling_3: bionomics['Sampling (infection)_3'],
    sampling_n: bionomics['Sampling (infection)_n'],
    ir_by_csp_n_pool: bionomics['IR by CSP (n_pool)'],
    ir_by_csp_total_pool: bionomics['IR by CSP (total_pool)'],
    no_per_pool: bionomics['No. per pool'],
    ir_by_csp_perc: bionomics['IR by CSP (%)'],
    sr_by_dissection_n: bionomics['SR by dissection (n)'],
    sr_by_dissection_total: bionomics['SR by dissection (total)'],
    sr_by_dissection_perc: bionomics['SR by dissection (%)'],
    sr_by_csp_n: bionomics['SR by CSP (n)'],
    sr_by_csp_total: bionomics['SR by CSP (total)'],
    sr_by_csp_perc: bionomics['SR by CSP (%)'],
    sr_by_pf_n: bionomics['SR by Pf (n)'],
    sr_by_pf_total: bionomics['SR by Pf (total)'],
    sr_by_p_falciparum: bionomics['SR by P. falciparum'],
    oocyst_n: bionomics['Oocyst (n)'],
    oocyst_total: bionomics['Oocyst (total)'],
    oocyst_rate: bionomics['Oocyst rate (%)'],
    eir: bionomics['EIR'],
    eir_period: bionomics['EIR (period)'],
    eir_days: bionomics['Ext. incubation period (days)'],
    notes: bionomics['Infection notes'],
  };

  return isEmpty(infection) ? null : { ...infection, id: uuidv4() };
};

export const mapBionomicsBitingRate = (bionomics): Partial<BitingRate> => {
  const bitingRate = {
    hbr_sampling_indoor: bionomics['HBR sampling (indoor)'],
    indoor_hbr: bionomics['Indoor HBR'],
    hbr_sampling_outdoor: bionomics['HBR sampling (outdoor)'],
    outdoor_hbr: bionomics['Outdoor HBR'],
    hbr_sampling_combined_1: bionomics['HBR sampling (combined)_1'],
    hbr_sampling_combined_2: bionomics['HBR sampling (combined)_2'],
    hbr_sampling_combined_3: bionomics['HBR sampling (combined)_3'],
    hbr_sampling_combined_n: bionomics['HBR sampling (combined)_n'],
    combined_hbr: bionomics['Combined HBR'],
    hbr_unit: bionomics['HBR (unit)'],
    abr_sampling_combined_1: bionomics['ABR sampling_1'],
    abr_sampling_combined_2: bionomics['ABR sampling_2'],
    abr_sampling_combined_3: bionomics['ABR sampling_3'],
    abr_sampling_combined_n: bionomics['ABR sampling_n'],
    abr: bionomics['ABR'],
    abr_unit: bionomics['ABR unit'],
    notes: bionomics['Biting rate notes'],
  };

  return isEmpty(bitingRate) ? null : { ...bitingRate, id: uuidv4() };
};

export const mapBionomicsAnthropoZoophagic = (
  bionomics,
): Partial<AnthropoZoophagic> => {
  const anthropoZoophagic = {
    host_sampling_indoor: bionomics['Host sampling (indoor)'],
    indoor_host_n: bionomics['Indoor host (n)'],
    indoor_host_total: bionomics['Indoor host (total)'],
    indoor_host_perc: bionomics['Indoor host %'],
    host_sampling_outdoor: bionomics['Host sampling (outdoor)'],
    outdoor_host_n: bionomics['Outdoor host (n)'],
    outdoor_host_total: bionomics['Outdoor host (total)'],
    outdoor_host_perc: bionomics['Outdoor host %'],
    host_sampling_combined_1: bionomics['Host sampling (combined)_1'],
    host_sampling_combined_2: bionomics['Host sampling (combined)_2'],
    host_sampling_combined_3: bionomics['Host sampling (combined)_3'],
    host_sampling_combined_n: bionomics['Host sampling (combined)_n'],
    combined_host_n: bionomics['Combined host (n)'],
    combined_host_total: bionomics['Combined host (total)'],
    combined_host: bionomics['Combined host'],
    host_unit: bionomics['Host (unit)'],
    host_sampling_other_1: bionomics['Host sampling (other)_1'],
    host_sampling_other_2: bionomics['Host sampling (other)_2'],
    host_sampling_other_3: bionomics['Host sampling (other)_3'],
    host_sampling_other_n: bionomics['Host sampling (other)_n'],
    other_host_n: bionomics['Other host (n)'],
    other_host_total: bionomics['Other host (total)'],
    host_other: bionomics['Host (other)'],
    host_other_unit: bionomics['Host (other) unit'],
    notes: bionomics['Host notes'],
  };

  return isEmpty(anthropoZoophagic)
    ? null
    : { ...anthropoZoophagic, id: uuidv4() };
};

export const mapBionomicsEndoExophagic = (
  bionomics,
): Partial<EndoExophagic> => {
  const endoExophagic = {
    sampling_nights_no_indoor:
      bionomics['Biting -  No. of sampling nights (indoors)'],
    biting_sampling_indoor: bionomics['Biting sampling (indoor)'],
    indoor_biting_n: bionomics['Indoor biting (n)'],
    indoor_biting_total: bionomics['Indoor biting (total)'],
    indoor_biting_data: bionomics['Indoor biting data'],
    sampling_nights_no_outdoor:
      bionomics['Biting -  No. of sampling nights (outdoors)'],
    biting_sampling_outdoor: bionomics['Biting sampling (outdoor)'],
    outdoor_biting_n: bionomics['Outdoor biting (n)'],
    outdoor_biting_total: bionomics['Outdoor biting (total)'],
    outdoor_biting_data: bionomics['Outdoor biting data'],
    biting_unit: bionomics['Indoor/outdoor biting (unit)'],
    notes: bionomics['Indoor/outdoor biting notes'],
  };

  return isEmpty(endoExophagic) ? null : { ...endoExophagic, id: uuidv4() };
};

export const mapBionomicsBitingActivity = (
  bionomics,
): Partial<BitingActivity> => {
  const bitingActivity = {
    sampling_nights_no_indoor:
      bionomics['Biting activity (indoor)  -  No. of sampling nights'],
    '18_30_21_30_indoor': bionomics['18.30-21.30 (in)'],
    '21_30_00_30_indoor': bionomics['21.30-00.30 (in)'],
    '00_30_03_30_indoor': bionomics['00.30-03.30 (in)'],
    '03_30_06_30_indoor': bionomics['03.30-06.30 (in)'],
    sampling_nights_no_outdoor:
      bionomics['Biting activity (outdoor)  -  No. of sampling nights'],
    '18_30_21_30_outdoor': bionomics['18.30-21.30 (out)'],
    '21_30_00_30_outdoor': bionomics['21.30-00.30 (out)'],
    '00_30_03_30_outdoor': bionomics['00.30-03.30 (out)'],
    '03_30_06_30_outdoor': bionomics['03.30-06.30 (out)'],
    sampling_nights_no_combined:
      bionomics['Biting activity (combined)  -  No. of sampling nights'],
    '18_30_21_30_combined': bionomics['18.30-21.30 (combined)'],
    '21_30_00_30_combined': bionomics['21.30-00.30 (combined)'],
    '00_30_03_30_combined': bionomics['00.30-03.30 (combined)'],
    '03_30_06_30_combined': bionomics['03.30-06.30 (combined)'],
    notes: bionomics['Biting notes'],
  };

  return isEmpty(bitingActivity) ? null : { ...bitingActivity, id: uuidv4() };
};

export const mapBionomicsEndoExophily = (bionomics): Partial<EndoExophily> => {
  const endoExophily = {
    resting_sampling_indoor: bionomics['Resting sampling (indoor)'],
    unfed_indoor: bionomics['Unfed (indoor)'],
    fed_indoor: bionomics['Fed (indoor)'],
    gravid_indoor: bionomics['Gravid (indoor)'],
    total_indoor: bionomics['Total (indoor)'],
    resting_sampling_outdoor: bionomics['Resting sampling (outdoor)'],
    unfed_outdoor: bionomics['Unfed (outdoor)'],
    fed_outdoor: bionomics['Fed (outdoor)'],
    gravid_outdoor: bionomics['Gravid (outdoor)'],
    total_outdoor: bionomics['Total (outdoor)'],
    resting_sampling_other: bionomics['Resting sampling (other)'],
    unfed_other: bionomics['Unfed (other)'],
    fed_other: bionomics['Fed (other)'],
    gravid_other: bionomics['Gravid (other)'],
    total_other: bionomics['Total (other)'],
    resting_unit: bionomics['Resting (unit)'],
    notes: bionomics['Resting notes'],
  };

  return isEmpty(endoExophily) ? null : { ...endoExophily, id: uuidv4() };
};
