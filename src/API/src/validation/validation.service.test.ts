/* eslint-disable max-len*/
import { Test, TestingModule } from '@nestjs/testing';
import { ValidationService } from './validation.service';
import { Validator } from './types/base.validator';
import { Logger } from '@nestjs/common';
import { MockType } from 'src/mocks';

jest.mock('./types/base.validator');

const occurrenceMockCsv = `
num_id,ENL_ID,Initials,Author,Year,Report Type,Published,V Data,SITE_ID,Country,Full Name,Admin 1 Paper,Admin 2 Paper,Admin 3 Paper,Admin 2 Id,Latitude,Longitude,Latitude 2,Longitude 2,LAT3,LONG3,LAT4,LONG4,LAT5,LONG5,LAT6,LONG6,LAT7,LONG7,LAT8,LONG8,Lat Long Source,Good guess,Bad guess,SITE_NOTES,Area type,Rural/Urban,Forest,Rice,Month Start,Month End,Year Start,Year End,Species 1,s.s./s.l.,ASSI,Notes ASSI,SPECIES2,Mossamp Tech 1,n1,Mossamp Tech 2,n2,Mossamp Tech 3,n3,Mossamp Tech 4,n4,All n,ALLNCHECK,MOS Id1,MOS Id2,MOS Id3,MOS_ID4,Control,Control Type,DEC Id,DEC Check,Map Check,Vector Notes
1,405,,Afari,1995,report,no,yes,28912,Ghana,Kasim el Girba,,,,22855,5.883,-0.118,,,,,,,,,,,,,,,,,,Is listed,point,rural,,,11,11,1992,1992,gambiae,s.l.,no,,arabiensis,MBI,,MBO,,L,0,HRI ,,,0,?,PCR,CBS,,yes,irs,RMO,RAH,RH,"Results are not presented in very clear way. Might be worth following up with author (WHO) to get site details etc, and results of subsequent trials (refered to in text)"
2,409,,Bosman,1992,report,no,yes,1000000305,Guinea,Aboke T. C.,Apac District,,,20503,2.351,32.682,,,,,,,,,,,,,,,Encarta,no,no,Not listed. Coords found in Geonames - correspond to Aboki in Encarta. ,point,,,,8,8,1989,1989,gambiae,,no,,arabiensis,HRI ,14,,,,,,,14,,M,,,,,,MS,RAH,RH,pdf hard to read in places (needs cropping too). Pdf is a series of reports from CDCD about surveys carried out in same areas.
`;
const bionomicsMockCsv = `
num_id,ID,enlid,citation,author,Article title,Journal title,Year,Adult data,Larval site data,contact authors,contact notes,secondary or general info,Country,Site,Site notes,MAP site id,Latitude,Longitude,Area type,Georef source,Gaul code,Admin level,Georef notes,insecticide control,Control,Control notes,Month_st,Month_end,Year_st,Year_end,Season (given),Season (calc),Season notes ,Species_1,species,ASSI,id_1,id_2,sampling (biology)_1,sampling (biology)_2,sampling (biology)_3,sampling (biology)_n,parity (n),parity (total),parity (%),daily survival rate (%),fecundity (mean batch size),gonotrophic cycle (days),biology notes,sampling (infection)_1,sampling (infection)_2,sampling (infection)_3,sampling (infection)_n,IR by CSP (n_pool),IR by CSP (total_pool),No. per pool,IR by CSP(%),SR by dissection (n),SR by dissection (total),SR by dissection ( %),SR by CSP (n),SR by CSP (total),SR by CSP ( %),SR by Pf (n),SR by Pf (total),SR by P. falciparum,oocyst (n),oocyst (total),oocyst rate (%),EIR,EIR (period),Ext. incubation period (days),infection notes,HBR sampling (indoor),indoor HBR,HBR sampling (outdoor),outdoor HBR,HBR sampling (combined)_1,HBR sampling (combined)_2,HBR sampling (combined)_3,HBR sampling (combined)_n,combined HBR,HBR (unit),ABR sampling_1,ABR sampling_2,ABR sampling_3,ABR sampling_n,ABR,ABR unit,host sampling (indoor),indoor host (n),indoor host (total),indoor host %,host sampling (outdoor),outdoor host (n),outdoor host (total),outdoor host %,host sampling (combined)_1,host sampling (combined)_2,host sampling (combined)_3,host sampling (combined)_n,combined host (n),combined host (total),combined host,host (unit),host sampling (other)_1,host sampling (other)_2,host sampling (other)_3,host sampling (other)_n,other host (n),other host (total),host (other),host (other) unit,host notes,biting -  No. of sampling nights (indoors),biting sampling (indoor),indoor biting (n),indoor biting (total),indoor biting data,biting -  No. of sampling nights (outdoors),biting sampling (outdoor),outdoor biting (n),outdoor biting (total),outdoor biting data,indoor/outdoor biting (unit),biting activity (indoor)  -  No. of sampling nights,18.30-21.30 (in),21.30-00.30 (in),00.30-03.30 (in),03.30-06.30 (in),biting activity (outdoor)  -  No. of sampling nights,18.30-21.30 (out),21.30-00.30 (out),00.30-03.30 (out),03.30-06.30 (out),biting activity (combined)  -  No. of sampling nights,18.30-21.30 (combined),21.30-00.30 (combined),00.30-03.30 (combined),03.30-06.30 (combined),biting notes,resting sampling (indoor),unfed (indoor),fed (indoor),gravid (indoor),total (indoor),resting sampling (outdoor),unfed (outdoor),fed (outdoor),gravid (outdoor),total (outdoor),resting sampling (other),unfed (other),fed (other),gravid (other),total (other),resting (unit),resting notes
1,4,355,"Malaria infection, morbidity and transmission in two ecological zones Southern Ghana",Afari,"Malaria infection, morbidity and transmission in two ecological zones Southern Ghana",Afr J Health Sci,1995,TRUE,FALSE,,,,Ghana,Dodowa,,28912,5.883,-0.118,,,,,,FALSE,,,11,11,1992,1992,,rainy,,gambiae,gambiae,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,MBI,MBO,,,3.13,HBR (night),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
2,5,386,Malaria transmission in a central area of Futa Dialon (Guinea): results of a parasitological survey during the 1989 rainy season,Bosman,Malaria transmission in a central area of Futa Dialon (Guinea): results of a parasitological survey during the 1989 rainy season,Parassitologia,1992,TRUE,FALSE,,,,Guinea,"Daka (Labe), Sombili, Timbi Madina",,1000000305,4.324,0.231,,,,,,FALSE,,,8,8,1989,1989,rainy,,,gambiae,gambiae,,,cyto,,,,,,,,,,,,HRI,,,,,,,,,,,,355,7.6,,,,,,,,,,,,,,,,,,,,,,,,,,,HRI,,,78,,,,,,,,,,,,HBI (%),,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
`;

describe('ValidationService', () => {
  let validationService: ValidationService;
  let logger: MockType<Logger>;

  beforeEach(async () => {
    logger = {
      log: jest.fn(),
      error: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidationService,
        {
          provide: Logger,
          useValue: logger,
        },
      ],
    }).compile();

    validationService = module.get<ValidationService>(ValidationService);
    jest.clearAllMocks();
  });

  describe('validateOccurrenceCsv', () => {
    it('Validator is initialised with correct arguments for occurrence and returns no errors for complete and correct csv data', async () => {
      const validate = await validationService.validateCsv(
        occurrenceMockCsv,
        'occurrence'
      );
      expect(Validator).toHaveBeenCalledTimes(2);
      expect(Validator).toHaveBeenCalledWith(
        'occurrence',
        {
          ALLNCHECK: '0',
          ASSI: 'no',
          'Admin 2 Id': '22855',
          'Area type': 'point',
          Author: 'Afari',
          Control: 'yes',
          'Control Type': 'irs',
          Country: 'Ghana',
          'DEC Check': 'RAH',
          'DEC Id': 'RMO',
          ENL_ID: '405',
          'Full Name': 'Kasim el Girba',
          Latitude: '5.883',
          Longitude: '-0.118',
          'MOS Id1': '?',
          'MOS Id2': 'PCR',
          'MOS Id3': 'CBS',
          'Map Check': 'RH',
          'Month End': '11',
          'Month Start': '11',
          'Mossamp Tech 1': 'MBI',
          'Mossamp Tech 2': 'MBO',
          'Mossamp Tech 3': 'L',
          'Mossamp Tech 4': 'HRI',
          Published: 'no',
          'Report Type': 'report',
          'Rural/Urban': 'rural',
          SITE_ID: '28912',
          SITE_NOTES: 'Is listed',
          SPECIES2: 'arabiensis',
          'Species 1': 'gambiae',
          'V Data': 'yes',
          'Vector Notes':
            'Results are not presented in very clear way. Might be worth following up with author (WHO) to get site details etc, and results of subsequent trials (refered to in text)',
          Year: '1995',
          'Year End': '1992',
          'Year Start': '1992',
          n3: '0',
          num_id: '1',
          's.s./s.l.': 's.l.',
        },
        0,
      );
      expect(Validator).toHaveBeenCalledWith(
        'occurrence',
        {
          ASSI: 'no',
          'Admin 1 Paper': 'Apac District',
          'Admin 2 Id': '20503',
          'All n': '14',
          'Area type': 'point',
          Author: 'Bosman',
          'Bad guess': 'no',
          Country: 'Guinea',
          'DEC Check': 'RAH',
          'DEC Id': 'MS',
          ENL_ID: '409',
          'Full Name': 'Aboke T. C.',
          'Good guess': 'no',
          'Lat Long Source': 'Encarta',
          Latitude: '2.351',
          Longitude: '32.682',
          'MOS Id1': 'M',
          'Map Check': 'RH',
          'Month End': '8',
          'Month Start': '8',
          'Mossamp Tech 1': 'HRI',
          Published: 'no',
          'Report Type': 'report',
          SITE_ID: '1000000305',
          SITE_NOTES:
            'Not listed. Coords found in Geonames - correspond to Aboki in Encarta.',
          SPECIES2: 'arabiensis',
          'Species 1': 'gambiae',
          'V Data': 'yes',
          'Vector Notes':
            'pdf hard to read in places (needs cropping too). Pdf is a series of reports from CDCD about surveys carried out in same areas.',
          Year: '1992',
          'Year End': '1989',
          'Year Start': '1989',
          n1: '14',
          num_id: '2',
        },
        1,
      );
      expect(validate).toEqual([undefined, undefined]);
    });
  });

  describe('validateBionomicsCsv', () => {
    it('Validator is initialised with correct arguments for bionomics and returns no errors for complete and correct csv data', async () => {
      const validate = await validationService.validateCsv(
        bionomicsMockCsv,
        'bionomics'
      );
      expect(Validator).toHaveBeenCalledTimes(2);
      expect(Validator).toHaveBeenCalledWith(
        'bionomics',
        {
          'Adult data': 'TRUE',
          'Article title':
            'Malaria infection, morbidity and transmission in two ecological zones Southern Ghana',
          Country: 'Ghana',
          'HBR (unit)': 'HBR (night)',
          'HBR sampling (combined)_1': 'MBI',
          'HBR sampling (combined)_2': 'MBO',
          ID: '4',
          'Journal title': 'Afr J Health Sci',
          'Larval site data': 'FALSE',
          Latitude: '5.883',
          Longitude: '-0.118',
          'MAP site id': '28912',
          Month_end: '11',
          Month_st: '11',
          'Season (calc)': 'rainy',
          Site: 'Dodowa',
          Species_1: 'gambiae',
          Year_end: '1992',
          Year_st: '1992',
          author: 'Afari',
          citation:
            'Malaria infection, morbidity and transmission in two ecological zones Southern Ghana',
          'combined HBR': '3.13',
          enlid: '355',
          'insecticide control': 'FALSE',
          num_id: '1',
          species: 'gambiae',
          Year: '1995',
        },
        0,
      );
      expect(Validator).toHaveBeenCalledWith(
        'bionomics',
        {
          'Adult data': 'TRUE',
          'Article title':
            'Malaria transmission in a central area of Futa Dialon (Guinea): results of a parasitological survey during the 1989 rainy season',
          Country: 'Guinea',
          ID: '5',
          'Journal title': 'Parassitologia',
          'Larval site data': 'FALSE',
          Latitude: '4.324',
          Longitude: '0.231',
          'MAP site id': '1000000305',
          Month_end: '8',
          Month_st: '8',
          'SR by CSP ( %)': '7.6',
          'SR by CSP (total)': '355',
          'Season (given)': 'rainy',
          Site: 'Daka (Labe), Sombili, Timbi Madina',
          Species_1: 'gambiae',
          Year_end: '1989',
          Year_st: '1989',
          author: 'Bosman',
          citation:
            'Malaria transmission in a central area of Futa Dialon (Guinea): results of a parasitological survey during the 1989 rainy season',
          enlid: '386',
          'host (unit)': 'HBI (%)',
          'host sampling (indoor)': 'HRI',
          id_2: 'cyto',
          'indoor host %': '78',
          'insecticide control': 'FALSE',
          num_id: '2',
          'sampling (infection)_1': 'HRI',
          species: 'gambiae',
          Year: '1992',
        },
        1,
      );

      expect(validate).toEqual([undefined, undefined]);
    });
  });
});
