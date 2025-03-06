import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from './user_role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
  ) {}

  findOneById(id: string): Promise<UserRole> {
    return this.userRoleRepository.findOne({ where: { auth0_id: id } });
  }

  upsertUserRoles(userRoles: UserRole): Promise<UserRole> {
    return this.userRoleRepository.save(userRoles);
  }

  getAllUsersWithRoles(): Promise<UserRole[]> {
    return this.userRoleRepository.find();
  }

  findByRole(role: string): Promise<UserRole[]> {
    const roleName = role.replace(/-/g, '_');
    return this.userRoleRepository.find({
      where: { [`is_${roleName}`]: true },
    });
  }

  async disableNotifications(
    userId: string,
    disable: boolean,
  ): Promise<UserRole> {
    const exists = await this.findOneById(userId);
    if (!exists) {
      throw 'User role does not exist';
    }
    exists.disable_notification = disable;
    return this.upsertUserRoles(exists);
  }
}
