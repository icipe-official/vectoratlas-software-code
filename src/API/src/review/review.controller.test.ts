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
      await controller.reviewCsv('dataset_id123', 'reviewer_id', '');

      expect(reviewService.reviewDataset).toHaveBeenCalledWith(
        'dataset_id123',
        'reviewer_id',
        '',
      );
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should ensure the guards are applied', async () => {
    const guards = Reflect.getMetadata('__guards__', controller.reviewCsv);
    expect(guards[0]).toBe(AuthGuard('va'));
    expect(guards[1]).toBe(RolesGuard);
  });
});
