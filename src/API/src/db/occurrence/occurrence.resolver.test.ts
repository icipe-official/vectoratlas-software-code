import { buildTestingModule } from '../../testHelpers';
import { Occurrence } from './entities/occurrence.entity';
import {
  GetOccurrenceDataArgs,
  OccurrenceResolver,
} from './occurrence.resolver';
import { OccurrenceService } from './occurrence.service';
import { validate } from '@nestjs/class-validator';
import { SiteService } from '../shared/site.service';
import { Site } from '../shared/entities/site.entity';
import { Sample } from './entities/sample.entity';
import { SampleService } from './sample.service';
import { RecordedSpecies } from '../shared/entities/recorded_species.entity';
import { RecordedSpeciesService } from '../shared/recordedSpecies.service';

describe('OccurrenceResolver', () => {
  let resolver: OccurrenceResolver;
  let mockOccurrenceService;
  let mockSiteService;
  let mockSampleService;
  let mockRecordedSpeciesService;

  beforeEach(async () => {
    const module = await buildTestingModule();

    resolver = module.get<OccurrenceResolver>(OccurrenceResolver);

    mockOccurrenceService = module.get<OccurrenceService>(OccurrenceService);
    mockOccurrenceService.findOneById = jest.fn();
    mockOccurrenceService.findAll = jest.fn();
    mockOccurrenceService.findOccurrences = jest.fn().mockResolvedValue({
      items: [new Occurrence(), new Occurrence()],
      total: 2,
    });

    mockSiteService = module.get<SiteService>(SiteService);
    mockSiteService.findOneById = jest.fn();

    mockSampleService = module.get<SampleService>(SampleService);
    mockSampleService.findOneById = jest.fn();

    mockRecordedSpeciesService = module.get<RecordedSpeciesService>(
      RecordedSpeciesService,
    );
    mockRecordedSpeciesService.findOneById = jest.fn();
  });

  it('geoData function calls on findOneById from occurrence.service', () => {
    const mockId = 'mockGeoId';
    resolver.geoData(mockId);
    expect(mockOccurrenceService.findOneById).toHaveBeenCalledWith(mockId);
  });

  it('allGeoData function calls on findAll from occurrence.service', () => {
    resolver.allGeoData();
    expect(mockOccurrenceService.findAll).toHaveBeenCalled();
  });

  it('OccurrenceData function calls on findOccurrences with correct arguments', () => {
    resolver.OccurrenceData({ take: 2, skip: 2 });
    expect(mockOccurrenceService.findOccurrences).toHaveBeenCalled();
    expect(mockOccurrenceService.findOccurrences).toHaveBeenCalledWith(
      2,
      2,
      undefined,
    );
  });

  it('OccurrenceData function calls on findOccurrences with correct filters', () => {
    resolver.OccurrenceData(
      { take: 2, skip: 2 },
      { country: 'TestCountry', isAdult: false },
    );
    expect(mockOccurrenceService.findOccurrences).toHaveBeenCalled();
    expect(mockOccurrenceService.findOccurrences).toHaveBeenCalledWith(2, 2, {
      country: 'TestCountry',
      isAdult: false,
    });
  });

  it('OccurrenceCsvData function calls on findOccurrences with correct arguments', () => {
    resolver.OccurrenceCsvData({ take: 2, skip: 2 });
    expect(mockOccurrenceService.findOccurrences).toHaveBeenCalled();
    expect(mockOccurrenceService.findOccurrences).toHaveBeenCalledWith(
      2,
      2,
      undefined,
    );
  });

  it('OccurrenceCsvData function calls on findOccurrences with correct filters', () => {
    resolver.OccurrenceCsvData(
      { take: 2, skip: 2 },
      { country: 'TestCountry', isAdult: false },
    );
    expect(mockOccurrenceService.findOccurrences).toHaveBeenCalled();
    expect(mockOccurrenceService.findOccurrences).toHaveBeenCalledWith(2, 2, {
      country: 'TestCountry',
      isAdult: false,
    });
  });

  it('getSite delegates to the site service', async () => {
    const parent = new Occurrence();
    parent.site = {
      id: '123',
    } as Site;

    await resolver.getSite(parent);

    expect(mockSiteService.findOneById).toHaveBeenCalledWith('123');
  });

  it('getSample delegates to the sample service', async () => {
    const parent = new Occurrence();
    parent.sample = {
      id: '123',
    } as Sample;

    await resolver.getSample(parent);

    expect(mockSampleService.findOneById).toHaveBeenCalledWith('123');
  });

  it('getRecordedSpecies delegates to the recorded species service', async () => {
    const parent = new Occurrence();
    parent.recordedSpecies = {
      id: '123',
    } as RecordedSpecies;

    await resolver.getRecordedSpecies(parent);

    expect(mockRecordedSpeciesService.findOneById).toHaveBeenCalledWith('123');
  });
});

describe('GetOccurrenceDataArgs', () => {
  it('GetOccurrenceDataArgs validates take', async () => {
    const args = new GetOccurrenceDataArgs();
    args.take = 0;
    args.skip = 0;
    let errors = await validate(args);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toEqual('take');
    expect(errors[0].constraints).toEqual({
      min: 'take must not be less than 1',
    });

    args.take = 1;
    errors = await validate(args);
    expect(errors).toHaveLength(0);

    args.take = 100;
    errors = await validate(args);
    expect(errors).toHaveLength(0);

    args.take = 101;
    errors = await validate(args);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toEqual('take');
    expect(errors[0].constraints).toEqual({
      max: 'take must not be greater than 100',
    });
  });

  it('GetOccurrenceDataArgs validates skip', async () => {
    const args = new GetOccurrenceDataArgs();
    args.take = 1;
    args.skip = -1;
    let errors = await validate(args);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toEqual('skip');
    expect(errors[0].constraints).toEqual({
      min: 'skip must not be less than 0',
    });

    args.skip = 1;
    errors = await validate(args);
    expect(errors).toHaveLength(0);
  });
});
