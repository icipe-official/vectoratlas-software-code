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
    return this.userRoleRepository.find({ where: { [`is_${role}`]: true } });
  }
}
