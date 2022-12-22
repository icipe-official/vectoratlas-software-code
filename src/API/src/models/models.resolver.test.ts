import { ModelsResolver } from './models.resolver';

describe('ModelsResolver', () => {
  let resolver: ModelsResolver;
  let mockModelTransformationService;

  beforeEach(async () => {
    mockModelTransformationService = {
      postProcessModelOutput: jest.fn(),
    };

    resolver = new ModelsResolver(mockModelTransformationService);
  });

  it('postProcessModel delegates to modelsTransformationService', async () => {
    mockModelTransformationService.postProcessModelOutput.mockResolvedValue({
      status: 'RUNNING',
    });

    const status = await resolver.postProcessModel(
      'model 1',
      'Model 1 Display Name',
      1.0,
      'blob/container/model1.tif',
    );
    expect(
      mockModelTransformationService.postProcessModelOutput,
    ).toHaveBeenCalledWith(
      'model 1',
      'Model 1 Display Name',
      1.0,
      'blob/container/model1.tif',
    );
    expect(status).toEqual({ status: 'RUNNING' });
  });
});
