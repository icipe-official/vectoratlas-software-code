import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRoleService } from './user_role.service';
import { UserRole } from './user_role.entity';
import { buildTestingModule } from '../../testHelpers';

describe('User role service', () => {
  let service: UserRoleService;
  let userRoleRepositoryMock;

  beforeEach(async () => {
    const module = await buildTestingModule();

    service = module.get(UserRoleService);
    userRoleRepositoryMock = module.get(getRepositoryToken(UserRole));
  });

  it('findOneById finds one by ID from the repository', async () => {
    const expectedUserRole = new UserRole();
    userRoleRepositoryMock.findOne = jest
      .fn()
      .mockResolvedValue(expectedUserRole);

    const result = await service.findOneById('123');
    expect(result).toEqual(expectedUserRole);
    expect(userRoleRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { auth0_id: '123' },
    });
  });

  it('upsertUserRoles saves new roles to the db', async () => {
    const user = new UserRole();
    user.auth0_id = 'test';

    await service.upsertUserRoles(user);

    expect(userRoleRepositoryMock.save).toHaveBeenCalledWith(user);
  });

  it('getAllUsersWithRoles gets all users from the database', async () => {
    await service.getAllUsersWithRoles();

    expect(userRoleRepositoryMock.find).toHaveBeenCalled();
  });

  it('findByRole finds by role from the repository', async () => {
    const expectedUserRoles = [new UserRole(), new UserRole()];
    userRoleRepositoryMock.find = jest
      .fn()
      .mockResolvedValue(expectedUserRoles);

    const result = await service.findByRole('reviewer');
    expect(result).toEqual(expectedUserRoles);
    expect(userRoleRepositoryMock.find).toHaveBeenCalledWith({
      where: { ['is_reviewer']: true },
    });
  });
});
