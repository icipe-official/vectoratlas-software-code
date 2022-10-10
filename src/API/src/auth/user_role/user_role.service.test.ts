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
});