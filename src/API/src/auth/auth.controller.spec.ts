import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'njwt';
import { UserRoleService } from './user_role/user_role.service';

describe('AuthzController', () => {
  const OLD_ENV = process.env;

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  let controller: AuthController;

  beforeEach(async () => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV, TOKEN_KEY: 'test' }; // Make a copy
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
    .useMocker((token) => {
      if (token === UserRoleService) {
        return {
          findOneById: jest.fn().mockImplementation(user => {
            if (user === 'existing') {
              return Promise.resolve({
                is_admin: true,
                is_editor: false,
                is_reviewer: true,
                is_uploader: false
              })
            } else {
              return null
            }
          }),
        };
      }
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('getToken', () => {
    it('should ensure the AuthGuard is applied', async () => {
      const guards = Reflect.getMetadata('__guards__', controller.getToken);
      const guard = guards[0];
      expect(guard).toBe(AuthGuard('jwt'));
    });

    it('should return the user information for an existing user', async () => {
      const token = await controller.getToken({sub: 'existing'});
      const verifiedToken = jwt.verify(token, 'test');
      expect(verifiedToken.body).toMatchObject({
        scope: 'admin,reviewer',
        sub: 'existing' });
    });

    it('should return null for a new user', async () => {
      const token = await controller.getToken({sub: 'new'});
      expect(token).toBe(null);
    });
  })
});
