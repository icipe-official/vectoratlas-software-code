import { Test, TestingModule } from '@nestjs/testing';
import { SiteService } from '../shared/site.service';
import { OccurrenceResolver } from './occurrence.resolver';
import { OccurrenceService } from './occurrence.service';
import { SampleService } from './sample.service';

describe('OccurrenceResolver', () => {
  let resolver: OccurrenceResolver;



  const occurrenceService = {
  findOccurrences: jest.fn(() => {
    return {items:[{name:'mockOcc1'},{name:'mockOcc2'}], total:2}
  }),
  findOneById: jest.fn(),
  findAll: jest.fn(),
  }
  const sampleService = jest.fn();
  const siteService = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OccurrenceResolver,{
        provide: OccurrenceService,
        useValue: occurrenceService,
      }, 
      {
      provide: SampleService,
      useValue: sampleService
      },
      {
      provide: SiteService,
      useValue: siteService
      }
    ],
    }).compile();

    resolver = module.get<OccurrenceResolver>(OccurrenceResolver);
  });

  it('geoData function calls on findOneById from occurrence.service', () => {
    const mockId = 'mockGeoId';
    resolver.geoData(mockId)
    expect(occurrenceService.findOneById).toHaveBeenCalled();
  })

  it('allGeoData function calls on findAll from occurrence.service', () => {
    resolver.allGeoData()
    expect(occurrenceService.findAll).toHaveBeenCalled();
  })

  it('OccurrenceData function calls on findOccurrences with correct arguments', () => {
    resolver.OccurrenceData({take:2, skip:2})
    expect(occurrenceService.findOccurrences).toHaveBeenCalled();
    expect(occurrenceService.findOccurrences).toHaveBeenCalledWith(2,2);
  })
});

