import { getRepositoryToken } from '@nestjs/typeorm';
import { SampleService } from './sample.service';
import { Sample } from './entities/sample.entity';
import { buildTestingModule } from '../../testHelpers';

describe('Sample service', () => {
  let service: SampleService;
  let sampleRepositoryMock;

  beforeEach(async () => {
    const module = await buildTestingModule();

    service = module.get<SampleService>(SampleService);
    sampleRepositoryMock = module.get(getRepositoryToken(Sample));
  });

  it('findOneById finds one by ID from the repository', async () => {
    const expectedSample = new Sample();
    sampleRepositoryMock.findOne = jest.fn().mockResolvedValue(expectedSample);

    const result = await service.findOneById('123');
    expect(result).toEqual(expectedSample);
    expect(sampleRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: '123' },
    });
  });

  it('findAll returns all samples', async () => {
    const expectedSamples = [new Sample(), new Sample(), new Sample()];
    sampleRepositoryMock.find = jest.fn().mockResolvedValue(expectedSamples);

    const result = await service.findAll();
    expect(result).toEqual(expectedSamples);
    expect(sampleRepositoryMock.find).toHaveBeenCalled();
  });
});
