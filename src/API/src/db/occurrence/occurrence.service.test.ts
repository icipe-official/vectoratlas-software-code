import { getRepositoryToken } from '@nestjs/typeorm';
import { OccurrenceService } from './occurrence.service';
import { Occurrence } from './entities/occurrence.entity';
import { buildTestingModule } from '../../testHelpers';
import { Brackets, In } from 'typeorm';
import { Site } from '../shared/entities/site.entity';

describe('Occurrence service', () => {
  let service: OccurrenceService;
  let occurrenceRepositoryMock;
  let siteRepositoryMock;
  let mockQueryBuilder;
  let mockSiteQueryBuilder;

  const expectedOccurrences = [
    new Occurrence(),
    new Occurrence(),
    new Occurrence(),
  ];

  beforeEach(async () => {
    const module = await buildTestingModule();

    service = module.get<OccurrenceService>(OccurrenceService);
    occurrenceRepositoryMock = module.get(getRepositoryToken(Occurrence));
    siteRepositoryMock = module.get(getRepositoryToken(Site));
    mockQueryBuilder = occurrenceRepositoryMock.createQueryBuilder();
    mockSiteQueryBuilder = siteRepositoryMock.createQueryBuilder();
    mockQueryBuilder.getManyAndCount = jest
      .fn()
      .mockReturnValue([expectedOccurrences, 1000]);
    mockSiteQueryBuilder.query = jest
      .fn()
      .mockReturnValue(['siteIdTest1', 'siteIdTest2']);
  });

  it('findOneById finds one by ID from the repository', async () => {
    const expectedOccurrence = new Occurrence();
    occurrenceRepositoryMock.findOne = jest
      .fn()
      .mockResolvedValue(expectedOccurrence);

    const result = await service.findOneById('123');
    expect(result).toEqual(expectedOccurrence);
    expect(occurrenceRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: '123' },
    });
  });

  it('findAll returns all samples', async () => {
    occurrenceRepositoryMock.find = jest
      .fn()
      .mockResolvedValue(expectedOccurrences);

    const result = await service.findAll();
    expect(result).toEqual(expectedOccurrences);
    expect(occurrenceRepositoryMock.find).toHaveBeenCalled();
  });

  it('findOccurrencesByIds calls correct methods', async () => {
    occurrenceRepositoryMock.find = jest
      .fn()
      .mockResolvedValue(expectedOccurrences);

    const result = await service.findOccurrencesByIds(['123', '456']);
    expect(result).toEqual(expectedOccurrences);
    expect(occurrenceRepositoryMock.find).toHaveBeenCalledWith({
      where: { id: In(['123', '456']) },
      relations: ['reference', 'sample', 'recordedSpecies', 'bionomics'],
    });
  });

  it('findOccurrences returns page and count', async () => {
    const result = await service.findOccurrences(
      3,
      10,
      {},
      { locationWindowActive: false },
    );
    expect(result.items).toEqual(expectedOccurrences);
    expect(result.total).toEqual(1000);
    expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('occurrence.id');
    expect(mockQueryBuilder.skip).toHaveBeenCalledWith(10);
    expect(mockQueryBuilder.take).toHaveBeenCalledWith(3);
  });

  describe('findOccurrences filters', () => {
    beforeEach(() => {
      mockQueryBuilder.andWhere = jest.fn().mockReturnValue(mockQueryBuilder);
    });

    it('on country', async () => {
      const result = await service.findOccurrences(
        3,
        10,
        {
          country: ['Kenya'],
        },
        { locationWindowActive: false },
      );
      expect(result.items).toEqual(expectedOccurrences);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '"site"."country" IN (:...country)',
        { country: ['Kenya'] },
      );
    });

    it('on species', async () => {
      const result = await service.findOccurrences(
        3,
        10,
        {
          species: ['Anopheles'],
        },
        { locationWindowActive: false },
      );
      expect(result.items).toEqual(expectedOccurrences);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '"recordedSpecies"."species" IN (:...species)',
        { species: ['Anopheles'] },
      );
    });

    it('on isLarval true', async () => {
      const result = await service.findOccurrences(
        3,
        10,
        { isLarval: [true] },
        { locationWindowActive: false },
      );
      expect(result.items).toEqual(expectedOccurrences);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '"bionomics"."larval_site_data" IN (:...isLarval)',
        { isLarval: [true] },
      );
    });

    it('on isLarval false', async () => {
      const result = await service.findOccurrences(
        3,
        10,
        {
          isLarval: [false],
        },
        { locationWindowActive: false },
      );
      expect(result.items).toEqual(expectedOccurrences);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '"bionomics"."larval_site_data" IN (:...isLarval)',
        { isLarval: [false] },
      );
    });

    it('on isAdult true', async () => {
      const result = await service.findOccurrences(
        3,
        10,
        { isAdult: [true] },
        { locationWindowActive: false },
      );
      expect(result.items).toEqual(expectedOccurrences);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '"bionomics"."adult_data" IN (:...isAdult)',
        { isAdult: [true] },
      );
    });

    it('on isAdult false', async () => {
      const result = await service.findOccurrences(
        3,
        10,
        { isAdult: [false] },
        { locationWindowActive: false },
      );
      expect(result.items).toEqual(expectedOccurrences);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '"bionomics"."adult_data" IN (:...isAdult)',
        { isAdult: [false] },
      );
    });

    it('on control true', async () => {
      const result = await service.findOccurrences(
        3,
        10,
        { control: [true] },
        { locationWindowActive: false },
      );
      expect(result.items).toEqual(expectedOccurrences);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '"sample"."control" IN (:...isControl)',
        { isControl: [true] },
      );
    });

    it('on control false', async () => {
      const result = await service.findOccurrences(
        3,
        10,
        { control: [false] },
        { locationWindowActive: false },
      );
      expect(result.items).toEqual(expectedOccurrences);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '"sample"."control" IN (:...isControl)',
        { isControl: [false] },
      );
    });

    it('on season', async () => {
      const result = await service.findOccurrences(
        3,
        10,
        { season: ['dry'] },
        { locationWindowActive: false },
      );
      expect(result.items).toEqual(expectedOccurrences);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        expect.any(Brackets),
      );
    });

    it('on startTimestamp', async () => {
      const result = await service.findOccurrences(
        3,
        10,
        {
          startTimestamp: 1666947960000,
        },
        { locationWindowActive: false },
      );
      const expectedTime = new Date(1666947960000);
      expect(result.items).toEqual(expectedOccurrences);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '"occurrence"."timestamp_end" >= :startTimestamp',
        { startTimestamp: expectedTime },
      );
    });

    it('on endTimestamp', async () => {
      const result = await service.findOccurrences(
        3,
        10,
        {
          endTimestamp: 1666947960000,
        },
        { locationWindowActive: false },
      );
      const expectedTime = new Date(1666947960000);
      expect(result.items).toEqual(expectedOccurrences);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '"occurrence"."timestamp_start" < :endTimestamp',
        { endTimestamp: expectedTime },
      );
    });

    it('on a combination of filters', async () => {
      const result = await service.findOccurrences(
        3,
        10,
        {
          endTimestamp: 1666947960000,
          control: [false],
          season: ['dry'],
        },
        { locationWindowActive: false },
      );
      const expectedTime = new Date(1666947960000);
      expect(result.items).toEqual(expectedOccurrences);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '"occurrence"."timestamp_start" < :endTimestamp',
        { endTimestamp: expectedTime },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        expect.any(Brackets),
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '"sample"."control" IN (:...isControl)',
        { isControl: [false] },
      );
    });
  });
});
