import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from 'src/auth/user_role/roles.guard';
import { MockType } from 'src/mocks';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

describe('ReviewController', () => {
  let controller: ReviewController;
  let reviewService: MockType<ReviewService>;

  beforeEach(async () => {
    reviewService = {
      reviewDataset: jest.fn(),
      approveDataset: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewController],
      providers: [
        {
          provide: ReviewService,
          useValue: reviewService,
        },
      ],
    }).compile();

    controller = module.get<ReviewController>(ReviewController);
  });
  describe('reviewCsv', () => {
    it('should delegate to the review service', async () => {
      await controller.reviewCsv({ sub: 'id123' }, 'dataset_id123', '');

      expect(reviewService.reviewDataset).toHaveBeenCalledWith(
        'dataset_id123',
        'id123',
        '',
      );
    });

    it('should ensure the guards are applied', async () => {
      const guards = Reflect.getMetadata('__guards__', controller.reviewCsv);
      expect(guards[0]).toBe(AuthGuard('va'));
      expect(guards[1]).toBe(RolesGuard);
    });
  });

  describe('approveDataset', () => {
    it('has guards applied', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        controller.approveDataset,
      );
      expect(guards[0]).toBe(AuthGuard('va'));
      expect(guards[1]).toBe(RolesGuard);
    });
    it('should delegate to the review service', async () => {
      await controller.approveDataset({ sub: 'id123' }, 'dataset_id123');

      expect(reviewService.approveDataset).toHaveBeenCalledWith(
        'dataset_id123',
        'id123',
      );
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
