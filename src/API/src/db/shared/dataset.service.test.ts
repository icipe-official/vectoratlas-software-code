import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { buildTestingModule } from '../../testHelpers';
import { DatasetService } from './dataset.service';
import { Dataset } from './entities/dataset.entity';

describe('Dataset service', () => {
  let service: DatasetService;
  let authServiceMock: AuthService;
  let datasetRepositoryMock;

  beforeEach(async () => {
    const module = await buildTestingModule();

    service = module.get<DatasetService>(DatasetService);
    authServiceMock = module.get<AuthService>(AuthService);
    authServiceMock.getEmailFromUserId = jest.fn().mockResolvedValue('email');
    authServiceMock.init = jest.fn();
    datasetRepositoryMock = module.get(getRepositoryToken(Dataset));
  });

  it('findOneById finds one by ID from the repository and converts ids to email', async () => {
    const expectedDataset = new Dataset();
    expectedDataset.UpdatedBy = 'id123';
    expectedDataset.ReviewedBy = ['id456', 'id789'];
    expectedDataset.ApprovedBy = ['id234', 'id567'];
    datasetRepositoryMock.findOne = jest
      .fn()
      .mockResolvedValue(expectedDataset);

    const result = await service.findOneById('123');
    expect(result.ApprovedBy).toEqual(['email', 'email']);
    expect(result.ReviewedBy).toEqual(['email', 'email']);
    expect(result.UpdatedBy).toEqual('email');
    expect(datasetRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: '123' },
    });
  });

  it('findUpdatedBy finds all by userID from the repository', async() => {
    const expectedDataset = new Dataset();
    datasetRepositoryMock.find = jest
      .fn()
      .mockResolvedValue(expectedDataset);
    const result = await service.findUpdatedBy('user_id123');
    expect(result).toEqual(expectedDataset);
    expect(datasetRepositoryMock.find).toHaveBeenCalledWith({
      where: { UpdatedBy: 'user_id123' },
    });

  });
});
