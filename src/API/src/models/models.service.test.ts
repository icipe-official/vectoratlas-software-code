import { Test, TestingModule } from '@nestjs/testing';
import { ModelsService } from './models.service';
import { BlobServiceClient } from '@azure/storage-blob';

jest.mock('@azure/storage-blob');

describe('ModelsService', () => {
  let service: ModelsService;

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2020, 3, 1));
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModelsService],
    }).compile();

    service = module.get<ModelsService>(ModelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should upload to the correct destination', async () => {
    const mockBlobClient = { uploadData: jest.fn() };
    const mockContainerClient = {
      getBlockBlobClient: jest.fn().mockReturnValue(mockBlobClient),
    };
    const mockClient = {
      getContainerClient: jest.fn().mockReturnValue(mockContainerClient),
    };
    BlobServiceClient.fromConnectionString = jest
      .fn()
      .mockReturnValue(mockClient);

    process.env.AZURE_STORAGE_CONNECTION_STRING = 'testConnString';
    const file: Partial<Express.Multer.File> = {
      originalname: 'file.csv',
      mimetype: 'text/csv',
      path: 'something',
      buffer: Buffer.from('one,two,three'),
    };

    await service.uploadModelFileToBlob(file as Express.Multer.File);
    expect(BlobServiceClient.fromConnectionString).toHaveBeenCalledWith(
      'testConnString',
    );
    expect(mockClient.getContainerClient).toHaveBeenCalledWith(
      'vectoratlas-container',
    );
    expect(mockContainerClient.getBlockBlobClient).toHaveBeenCalledWith(
      'models/file/1585695600000_file.csv',
    );
    expect(mockBlobClient.uploadData).toHaveBeenCalled();
  });
});
