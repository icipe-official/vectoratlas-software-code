import { UserRoleResolver } from './user_role.resolver';

describe('User role resolver', () => {
  let resolver: UserRoleResolver;
  let userRoleService;

  beforeEach(() => {
    userRoleService = {
      findOneById: jest.fn(),
    };

    resolver = new UserRoleResolver(userRoleService);
  });

  it('userRole delegates finding one by id to user role service', () => {
    resolver.userRole('123');

    expect(userRoleService.findOneById).toHaveBeenCalledWith('123');
  });
});
