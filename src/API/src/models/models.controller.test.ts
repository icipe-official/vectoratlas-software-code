import { HttpException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from 'src/auth/user_role/roles.guard';
import { MockType } from 'src/mocks';
import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';

describe('ModelsController', () => {
  let controller: ModelsController;
  let modelsService: MockType<ModelsService>;
  let downloadMock;

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2020, 3, 1, 0, 0, 0, 0));
  });

  beforeEach(async () => {
    downloadMock = {
      pipe: jest.fn(),
    };

    modelsService = {
      uploadModelFileToBlob: jest.fn().mockResolvedValue({}),
      downloadModelFile: jest.fn().mockResolvedValue(downloadMock),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModelsController],
      providers: [
        {
          provide: ModelsService,
          useValue: modelsService,
        },
      ],
    }).compile();

    controller = module.get<ModelsController>(ModelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('uploadModel', () => {
    it('should ensure the guards are applied', async () => {
      const guards = Reflect.getMetadata('__guards__', controller.uploadModel);
      expect(guards[0]).toBe(AuthGuard('va'));
      expect(guards[1]).toBe(RolesGuard);
    });

    it('should delegate to the service', async () => {
      const file: Partial<Express.Multer.File> = {
        originalname: 'file.csv',
        mimetype: 'text/csv',
        path: 'something',
        buffer: Buffer.from('one,two,three'),
      };
      controller.uploadModel(file as Express.Multer.File);
      expect(modelsService.uploadModelFileToBlob).toHaveBeenCalledWith(file, 'models/file/1585699200000_file.csv');
    });

    it('should throw on error response', async () => {
      modelsService.uploadModelFileToBlob = jest
        .fn()
        .mockResolvedValue({ errorCode: 500 });
      const file: Partial<Express.Multer.File> = {
        originalname: 'file.csv',
        mimetype: 'text/csv',
        path: 'something',
        buffer: Buffer.from('one,two,three'),
      };
      await expect(
        controller.uploadModel(file as Express.Multer.File),
      ).rejects.toThrowError(HttpException);
    });

    it('should return file path', async () => {
      const file: Partial<Express.Multer.File> = {
        originalname: 'file.csv',
        mimetype: 'text/csv',
        path: 'something',
        buffer: Buffer.from('one,two,three'),
      };
      expect(await controller.uploadModel(file as Express.Multer.File)).toBe('models/file/1585699200000_file.csv');
    })
  });

  describe('downloadModel', () => {
    it('should delegate to the service', async () => {
      const res = jest.fn();
      await controller.downloadModel(res, 'blob/location/123.tif');

      expect(downloadMock.pipe).toHaveBeenCalledWith(res);
    });
  });
});
