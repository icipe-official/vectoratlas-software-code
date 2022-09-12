import { Test, TestingModule } from '@nestjs/testing';
import { AuthzController } from './auth.controller';
import { AuthGuard } from '@nestjs/passport';

describe('AuthzController', () => {
  let controller: AuthzController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthzController],
    }).compile();

    controller = module.get<AuthzController>(AuthzController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should ensure the AuthGuard is applied to the controller', async () => {
    const guards = Reflect.getMetadata('__guards__', controller.findAll);
    const guard = guards[0];
    expect(guard).toBe(AuthGuard('jwt'));
  });
});
