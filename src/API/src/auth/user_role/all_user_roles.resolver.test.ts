import { buildTestingModule } from '../../testHelpers';
import { UserRoleService } from './user_role.service';
import { AllUserRolesResolver } from './all_user_roles.resolver';
import { AuthService } from '../auth.service';

describe('all user roles resolver', () => {
  let resolver: AllUserRolesResolver;
  let mockUserRoleService;
  let mockAuthService;

  beforeEach(async () => {
    const module = await buildTestingModule();

    resolver = module.get<AllUserRolesResolver>(AllUserRolesResolver);

    mockUserRoleService = module.get<UserRoleService>(UserRoleService);
    mockUserRoleService.getAllUsersWithRoles = jest.fn().mockResolvedValue([
      {
        auth0_id: 'user B',
        is_admin: false,
        is_uploader: true,
        is_reviewer: true,
        is_editor: false,
      },
    ]);
    mockUserRoleService.upsertUserRoles = jest.fn();

    mockAuthService = module.get<AuthService>(AuthService);
    mockAuthService.init = jest.fn();
    mockAuthService.getAllUsers = jest.fn().mockResolvedValue([
      { email: 'user B@test', user_id: 'user B' },
      { email: 'user A@test', user_id: 'user A' },
    ]);
  });

  describe('allUserRoles', () => {
    it('returns all users and matches roles to the database', async () => {
      const allUsers = await resolver.allUserRoles();

      expect(allUsers).toEqual([
        {
          email: 'user A@test',
          auth0_id: 'user A',
          is_admin: false,
          is_uploader: false,
          is_reviewer: false,
          is_editor: false,
        },
        {
          email: 'user B@test',
          auth0_id: 'user B',
          is_admin: false,
          is_uploader: true,
          is_reviewer: true,
          is_editor: false,
        },
      ]);
    });

    it('sorts the results alphabetically by email', async () => {
      const allUsers = await resolver.allUserRoles();

      expect(allUsers[0].email).toEqual('user A@test');
      expect(allUsers[1].email).toEqual('user B@test');
    });
  });

  describe('updateUserRoles', () => {
    it('should delgate to the user role service to upsert new roles', async () => {
      const newRoles = {
        auth0_id: 'test user',
        is_admin: true,
        is_editor: false,
        is_uploader: true,
        is_reviewer: false,
        is_reviewer_manager: false,
      };
      await resolver.updateUserRoles(newRoles);

      expect(mockUserRoleService.upsertUserRoles).toHaveBeenCalledWith(
        newRoles,
      );
    });
  });
});
