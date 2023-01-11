import { Test, TestingModule } from '@nestjs/testing';
import { ValidationService } from './validation.service';
import { Validator }  from './types/base.validator';
import { Logger } from '@nestjs/common';
import { MockType } from 'src/mocks';

jest.mock('./types/base.validator')
// const csvJsonFromStringSpy = jest.spyOn(csvtojson, 'fromString').mockResolvedValue('csv to json return')

const occurrenceMockCsv = `
num_id,ENL_ID,Initials,Author,Year,Report Type,Published,V Data,SITE_ID,Country,Full Name,Admin 1 Paper,Admin 2 Paper,Admin 3 Paper,Admin 2 Id,Latitude,Longitude,Latitude 2,Longitude 2,LAT3,LONG3,LAT4,LONG4,LAT5,LONG5,LAT6,LONG6,LAT7,LONG7,LAT8,LONG8,Lat Long Source,Good guess,Bad guess,SITE_NOTES,Area type,Rural/Urban,Forest,Rice,Month Start,Month End,Year Start,Year End,Species 1,s.s./s.l.,ASSI,Notes ASSI,SPECIES2,Mossamp Tech 1,n1,Mossamp Tech 2,n2,Mossamp Tech 3,n3,Mossamp Tech 4,n4,All n,ALLNCHECK,MOS Id1,MOS Id2,MOS Id3,MOS_ID4,Control,Control Type,DEC Id,DEC Check,Map Check,Vector Notes
1,405,,Afari,1995,report,no,yes,28912,Ghana,Kasim el Girba,,,,22855,5.883,-0.118,,,,,,,,,,,,,,,,,,Is listed,point,rural,,,11,11,1992,1992,gambiae,s.l.,no,,arabiensis,MBI,,MBO,,L,0,HRI ,,,0,?,PCR,CBS,,yes,irs,RMO,RAH,RH,"Results are not presented in very clear way. Might be worth following up with author (WHO) to get site details etc, and results of subsequent trials (refered to in text)"
2,409,,Bosman,1992,report,no,yes,1000000305,Guinea,Aboke T. C.,Apac District,,,20503,2.351,32.682,,,,,,,,,,,,,,,Encarta,no,no,Not listed. Coords found in Geonames - correspond to Aboki in Encarta. ,point,,,,8,8,1989,1989,gambiae,,no,,arabiensis,HRI ,14,,,,,,,14,,M,,,,,,MS,RAH,RH,pdf hard to read in places (needs cropping too). Pdf is a series of reports from CDCD about surveys carried out in same areas.
`

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
            useValue: logger
          }
        ],
      }).compile();

    validationService = module.get<ValidationService>(ValidationService);
  });

  describe('validateOccurrenceCsv', () => {
    it('Validator is initialised with correct arguments for occurrence and returns no errors for complete and correct csv data', async () => {
      let validate = await validationService.validateOccurrenceCsv(occurrenceMockCsv);
      expect(Validator).toHaveBeenCalledTimes(2);
      expect(Validator).toHaveBeenCalledWith("occurrence", {"ALLNCHECK": "0", "ASSI": "no", "Admin 2 Id": "22855", "Area type": "point", "Author": "Afari", "Control": "yes", "Control Type": "irs", "Country": "Ghana", "DEC Check": "RAH", "DEC Id": "RMO", "ENL_ID": "405", "Full Name": "Kasim el Girba", "Latitude": "5.883", "Longitude": "-0.118", "MOS Id1": "?", "MOS Id2": "PCR", "MOS Id3": "CBS", "Map Check": "RH", "Month End": "11", "Month Start": "11", "Mossamp Tech 1": "MBI", "Mossamp Tech 2": "MBO", "Mossamp Tech 3": "L", "Mossamp Tech 4": "HRI", "Published": "no", "Report Type": "report", "Rural/Urban": "rural", "SITE_ID": "28912", "SITE_NOTES": "Is listed", "SPECIES2": "arabiensis", "Species 1": "gambiae", "V Data": "yes", "Vector Notes": "Results are not presented in very clear way. Might be worth following up with author (WHO) to get site details etc, and results of subsequent trials (refered to in text)", "Year": "1995", "Year End": "1992", "Year Start": "1992", "n3": "0", "num_id": "1", "s.s./s.l.": "s.l."}, 0);
      expect(Validator).toHaveBeenCalledWith("occurrence", {"ASSI": "no", "Admin 1 Paper": "Apac District", "Admin 2 Id": "20503", "All n": "14", "Area type": "point", "Author": "Bosman", "Bad guess": "no", "Country": "Guinea", "DEC Check": "RAH", "DEC Id": "MS", "ENL_ID": "409", "Full Name": "Aboke T. C.", "Good guess": "no", "Lat Long Source": "Encarta", "Latitude": "2.351", "Longitude": "32.682", "MOS Id1": "M", "Map Check": "RH", "Month End": "8", "Month Start": "8", "Mossamp Tech 1": "HRI", "Published": "no", "Report Type": "report", "SITE_ID": "1000000305", "SITE_NOTES": "Not listed. Coords found in Geonames - correspond to Aboki in Encarta.", "SPECIES2": "arabiensis", "Species 1": "gambiae", "V Data": "yes", "Vector Notes": "pdf hard to read in places (needs cropping too). Pdf is a series of reports from CDCD about surveys carried out in same areas.", "Year": "1992", "Year End": "1989", "Year Start": "1989", "n1": "14", "num_id": "2"}, 1)
      expect(validate).toEqual([[],[]]);
    });
  });

  // describe('validateBionomicsCsv', () => {
  //   it('Validator is initialised with correct arguments for bionomics and returns no errors for complete and correct csv data', async () => {
  //     let validate = await validationService.validateBionomicsCsv(bionomicsMockCsv);
  //     expect(Validator).toHaveBeenCalledTimes(2);
  //     expect(Validator).toHaveBeenCalledWith("occurrence", {"ALLNCHECK": "0", "ASSI": "no", "Admin 2 Id": "22855", "Area type": "point", "Author": "Afari", "Control": "yes", "Control Type": "irs", "Country": "Ghana", "DEC Check": "RAH", "DEC Id": "RMO", "ENL_ID": "405", "Full Name": "Kasim el Girba", "Latitude": "5.883", "Longitude": "-0.118", "MOS Id1": "?", "MOS Id2": "PCR", "MOS Id3": "CBS", "Map Check": "RH", "Month End": "11", "Month Start": "11", "Mossamp Tech 1": "MBI", "Mossamp Tech 2": "MBO", "Mossamp Tech 3": "L", "Mossamp Tech 4": "HRI", "Published": "no", "Report Type": "report", "Rural/Urban": "rural", "SITE_ID": "28912", "SITE_NOTES": "Is listed", "SPECIES2": "arabiensis", "Species 1": "gambiae", "V Data": "yes", "Vector Notes": "Results are not presented in very clear way. Might be worth following up with author (WHO) to get site details etc, and results of subsequent trials (refered to in text)", "Year": "1995", "Year End": "1992", "Year Start": "1992", "n3": "0", "num_id": "1", "s.s./s.l.": "s.l."}, 0);
  //     expect(Validator).toHaveBeenCalledWith("occurrence", {"ASSI": "no", "Admin 1 Paper": "Apac District", "Admin 2 Id": "20503", "All n": "14", "Area type": "point", "Author": "Bosman", "Bad guess": "no", "Country": "Guinea", "DEC Check": "RAH", "DEC Id": "MS", "ENL_ID": "409", "Full Name": "Aboke T. C.", "Good guess": "no", "Lat Long Source": "Encarta", "Latitude": "2.351", "Longitude": "32.682", "MOS Id1": "M", "Map Check": "RH", "Month End": "8", "Month Start": "8", "Mossamp Tech 1": "HRI", "Published": "no", "Report Type": "report", "SITE_ID": "1000000305", "SITE_NOTES": "Not listed. Coords found in Geonames - correspond to Aboki in Encarta.", "SPECIES2": "arabiensis", "Species 1": "gambiae", "V Data": "yes", "Vector Notes": "pdf hard to read in places (needs cropping too). Pdf is a series of reports from CDCD about surveys carried out in same areas.", "Year": "1992", "Year End": "1989", "Year Start": "1989", "n1": "14", "num_id": "2"}, 1)
  //     expect(validate).toEqual([[],[]]);
  //   });
  // });
});
