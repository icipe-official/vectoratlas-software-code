import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { assert } from 'console';
import { AnthropoZoophagic } from 'src/db/bionomics/entities/anthropo_zoophagic.entity';
import { Biology } from 'src/db/bionomics/entities/biology.entity';
import { Bionomics } from 'src/db/bionomics/entities/bionomics.entity';
import { BitingActivity } from 'src/db/bionomics/entities/biting_activity.entity';
import { BitingRate } from 'src/db/bionomics/entities/biting_rate.entity';
import { EndoExophagic } from 'src/db/bionomics/entities/endo_exophagic.entity';
import { EndoExophily } from 'src/db/bionomics/entities/endo_exophily.entity';
import { Infection } from 'src/db/bionomics/entities/infection.entity';
import { Occurrence } from 'src/db/occurrence/entities/occurrence.entity';
import { Sample } from 'src/db/occurrence/entities/sample.entity';
import { Reference } from 'src/db/shared/entities/reference.entity';
import { Site } from 'src/db/shared/entities/site.entity';
import { Species } from 'src/db/shared/entities/species.entity';
import { MockType, repositoryMockFactory } from 'src/mocks';
import { Repository } from 'typeorm';
import { IngestService } from './ingest.service';
import * as bionomics_single_row from './test_data/bionomics_single_row.json';

jest.mock('csvtojson', () => () => ({
  fromString: jest.fn().mockImplementation((csv) => {
    if (csv === "empty") {
      return [];
    } else if (csv === "single_row") {
      return bionomics_single_row;
    }
  })
}));

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('id123')
}))

/* Test cases

1. Empty csv, no uploads, no failure - done
2. Full bionomics, single row, no existing
3. Full bionomics, single row, existing
4. Full bionomics, multiple rows, no existing, no overlap
5. Full bionomics, multiple rows, no existing, overlap
6. Full bionomics, multiple rows, existing
7. Bionomics with missing essential info
8. Bionomics with incorrect data types
Repeat 2-8 for occurrence

 */

describe('IngestService', () => {
  let service: IngestService;
  let bionomicsRepositoryMock: MockType<Repository<Bionomics>>;
  let referenceRepositoryMock: MockType<Repository<Reference>>;
  let siteRepositoryMock: MockType<Repository<Site>>;
  let speciesRepositoryMock: MockType<Repository<Species>>;
  let biologyRepositoryMock: MockType<Repository<Biology>>;
  let infectionRepositoryMock: MockType<Repository<Infection>>;
  let bitingRateRepositoryMock: MockType<Repository<BitingRate>>;
  let anthropoZoophagicRepositoryMock: MockType<Repository<AnthropoZoophagic>>;
  let endoExophagicRepositoryMock: MockType<Repository<EndoExophagic>>;
  let bitingActivityRepositoryMock: MockType<Repository<BitingActivity>>;
  let endoExophilyRepositoryMock: MockType<Repository<EndoExophily>>;
  let sampleRepositoryMock: MockType<Repository<Sample>>;
  let occurrenceRepositoryMock: MockType<Repository<Occurrence>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestService,
        { provide: getRepositoryToken(Bionomics), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(Reference), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(Site), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(Species), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(Biology), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(Infection), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(BitingRate), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(AnthropoZoophagic), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(EndoExophagic), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(BitingActivity), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(EndoExophily), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(Sample), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(Occurrence), useFactory: repositoryMockFactory },
      ],
      imports: [
        Bionomics
      ]
    }).compile();

    service = module.get<IngestService>(IngestService);
    bionomicsRepositoryMock = module.get(getRepositoryToken(Bionomics));
    referenceRepositoryMock = module.get(getRepositoryToken(Reference));
    siteRepositoryMock = module.get(getRepositoryToken(Site));
    speciesRepositoryMock = module.get(getRepositoryToken(Species));
    biologyRepositoryMock = module.get(getRepositoryToken(Biology));
    infectionRepositoryMock = module.get(getRepositoryToken(Infection));
    bitingRateRepositoryMock = module.get(getRepositoryToken(BitingRate));
    anthropoZoophagicRepositoryMock = module.get(getRepositoryToken(AnthropoZoophagic));
    endoExophagicRepositoryMock = module.get(getRepositoryToken(EndoExophagic));
    bitingActivityRepositoryMock = module.get(getRepositoryToken(BitingActivity));
    endoExophilyRepositoryMock = module.get(getRepositoryToken(EndoExophily));
    sampleRepositoryMock = module.get(getRepositoryToken(Sample));
    occurrenceRepositoryMock = module.get(getRepositoryToken(Occurrence));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Empty csv, no uploads, no failure', async () => {
    await service.saveBionomicsCsvToDb("empty");
    expect(bionomicsRepositoryMock.save).toHaveBeenCalledWith([]);
  });

  fit('Full bionomics, single row, no existing', async () => {
    await service.saveBionomicsCsvToDb("single_row");
    expect(bionomicsRepositoryMock.save).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining(bionomics_rows[0])
      ])
    );
    expect(referenceRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining(reference_rows[0])
    );
    expect(siteRepositoryMock.save).toHaveBeenCalledWith(site_rows[0]);
    expect(speciesRepositoryMock.save).toHaveBeenCalledWith(species_rows[0]);
    expect(biologyRepositoryMock.save).toHaveBeenCalledWith(biology_rows[0]);
    expect(infectionRepositoryMock.save).toHaveBeenCalledWith(infection_rows[0]);
    expect(bitingRateRepositoryMock.save).toHaveBeenCalledWith(biting_rate_rows[0]);
    expect(anthropoZoophagicRepositoryMock.save).toHaveBeenCalledWith(anth_zoo_rows[0]);
    expect(endoExophagicRepositoryMock.save).toHaveBeenCalledWith(endo_exophagic_rows[0]);
    expect(bitingActivityRepositoryMock.save).toHaveBeenCalledWith(biting_activity_rows[0]);
    expect(endoExophilyRepositoryMock.save).toHaveBeenCalledWith(endo_exophily_rows[0]);
  });
});

const bionomics_rows = [{
  id: 'id123',
  adult_data: 'TRUE',
  larval_site_data: 'FALSE',
  contact_authors: 'TRUE',
  contact_notes: '10',
  secondary_info: '11',
  insecticide_control: 'FALSE',
  control: '24',
  control_notes: '25',
  month_start: '26',
  month_end: '27',
  year_start: '28',
  year_end: '29',
  season_given: '30',
  season_calc: '31',
  season_notes: '32',
  data_abstracted_by: '159',
  data_checked_by: '160'
}];

const reference_rows = [{
  id: 'id123',
  author: '3',
  article_title: '4',
  journal_title: '5',
  year: '6'
}];

const site_rows = [{
  id: 'id123',
  country: '12',
  name: '13',
  map_site: '15',
  location: { type: 'Point', coordinates: [ 17, 16 ] },
  area_type: '18',
  georef_source: '19',
  gaul_code: '20',
  admin_level: '21',
  georef_notes: '22',
  latitude: '16',
  longitude: '17'
}]

const species_rows = [{
  id: 'id123',
  species_1: '33',
  species_2: '34',
  assi: 'TRUE',
  id_method_1: '36',
  id_method_2: '37'
}];

const biology_rows = [{
  sampling_1: '38',
  sampling_2: '39',
  sampling_3: '40',
  sampling_n: '41',
  parity_n: '42',
  parity_total: '43',
  parity_perc: '44',
  daily_survival_rate: '45',
  fecundity: '46',
  gonotrophic_cycle_days: '47',
  notes: '48',
  id: 'id123'
}]

const infection_rows = [{
  sampling_1: undefined,
  sampling_2: '49',
  sampling_3: '50',
  sampling_n: '51',
  ir_by_csp_n_pool: '52',
  ir_by_csp_total_pool: '53',
  no_per_pool: '54',
  ir_by_csp_perc: '55',
  sr_by_dissection_n: '56',
  sr_by_dissection_total: '57',
  sr_by_dissection_perc: '58',
  sr_by_csp_n: '59',
  sr_by_csp_total: '60',
  sr_by_csp_perc: '61',
  sr_by_pf_n: '62',
  sr_by_pf_total: '63',
  sr_by_p_falciparum: '64',
  oocyst_n: '65',
  oocyst_total: '66',
  oocyst_rate: '67',
  eir: '68',
  eir_period: '69',
  eir_days: '70',
  notes: '71',
  id: 'id123'
}]

const biting_rate_rows = [{
  hbr_sampling_indoor: '72',
  indoor_hbr: '73',
  hbr_sampling_outdoor: '74',
  outdoor_hbr: '75',
  hbr_sampling_combined_1: '76',
  hbr_sampling_combined_2: '77',
  hbr_sampling_combined_3: '78',
  hbr_sampling_combined_n: '79',
  combined_hbr: '80',
  hbr_unit: '81',
  abr_sampling_combined_1: '82',
  abr_sampling_combined_2: '83',
  abr_sampling_combined_3: '84',
  abr_sampling_combined_n: '85',
  abr: '86',
  abr_unit: '87',
  notes: '88',
  id: 'id123'
}]

const anth_zoo_rows = [{
  host_sampling_indoor: '89',
  indoor_host_n: '90',
  indoor_host_total: '91',
  indoor_host_perc: '92',
  host_sampling_outdoor: '93',
  outdoor_host_n: '94',
  outdoor_host_total: '95',
  outdoor_host_perc: '96',
  host_sampling_combined_1: '97',
  host_sampling_combined_2: '98',
  host_sampling_combined_3: '99',
  host_sampling_combined_n: '100',
  combined_host_n: '101',
  combined_host_total: '102',
  combined_host: '103',
  host_unit: '104',
  host_sampling_other_1: '105',
  host_sampling_other_2: '106',
  host_sampling_other_3: '107',
  host_sampling_other_n: '108',
  other_host_n: '109',
  other_host_total: '110',
  host_other: '111',
  host_other_unit: '112',
  notes: '113',
  id: 'id123'
}]

const endo_exophagic_rows = [{
  sampling_nights_no_indoor: '114',
  biting_sampling_indoor: '115',
  indoor_biting_n: '116',
  indoor_biting_total: '117',
  indoor_biting_data: '118',
  sampling_nights_no_outdoor: '119',
  biting_sampling_outdoor: '120',
  outdoor_biting_n: '121',
  outdoor_biting_total: '122',
  outdoor_biting_data: '123',
  biting_unit: '124',
  notes: '125',
  id: 'id123'
}]

const biting_activity_rows = [{
  sampling_nights_no_indoor: '126',
  '18_30_21_30_indoor': '127',
  '21_30_00_30_indoor': '128',
  '00_30_03_30_indoor': '129',
  '03_30_06_30_indoor': '130',
  sampling_nights_no_outdoor: '131',
  '18_30_21_30_outdoor': '132',
  '21_30_00_30_outdoor': '133',
  '00_30_03_30_outdoor': '134',
  '03_30_06_30_outdoor': '135',
  sampling_nights_no_combined: '136',
  '18_30_21_30_combined': '137',
  '21_30_00_30_combined': '138',
  '00_30_03_30_combined': '139',
  '03_30_06_30_combined': '140',
  notes: '141',
  id: 'id123'
}]

const endo_exophily_rows = [{
  resting_sampling_indoor: '142',
  unfed_indoor: '143',
  fed_indoor: '144',
  gravid_indoor: '145',
  total_indoor: '146',
  resting_sampling_outdoor: '147',
  unfed_outdoor: '148',
  fed_outdoor: '149',
  gravid_outdoor: '150',
  total_outdoor: '151',
  resting_sampling_other: '152',
  unfed_other: '153',
  fed_other: '154',
  gravid_other: '155',
  total_other: '156',
  resting_unit: '157',
  notes: '158',
  id: 'id123'
}]
