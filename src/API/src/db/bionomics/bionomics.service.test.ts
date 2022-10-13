import { getRepositoryToken } from '@nestjs/typeorm';
import { BionomicsService } from './bionomics.service';
import { Bionomics } from './entities/bionomics.entity';
import { buildTestingModule } from '../../testHelpers';

describe('Bionomics service', () => {
  let service: BionomicsService;
  let bionomicsRepositoryMock;

  beforeEach(async () => {
    const module = await buildTestingModule();

    service = module.get(BionomicsService);
    bionomicsRepositoryMock = module.get(getRepositoryToken(Bionomics));
  });

  it('findOneById finds one by ID from the repository', async () => {
    const expectedBionomics = new Bionomics();
    bionomicsRepositoryMock.findOne = jest
      .fn()
      .mockResolvedValue(expectedBionomics);

    const result = await service.findOneById('123');
    expect(result).toEqual(expectedBionomics);
    expect(bionomicsRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: '123' },
    });
  });

  it('findAll returns all samples', async () => {
    const expectedBionomics = [
      new Bionomics(),
      new Bionomics(),
      new Bionomics(),
    ];
    bionomicsRepositoryMock.find = jest
      .fn()
      .mockResolvedValue(expectedBionomics);

    const result = await service.findAll();
    expect(result).toEqual(expectedBionomics);
    expect(bionomicsRepositoryMock.find).toHaveBeenCalled();
  });
});
