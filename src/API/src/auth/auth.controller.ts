import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'njwt';
import { AuthUser } from './user.decorator';
import { UserRole } from './user_role/user_role.entity';
import { UserRoleService } from './user_role/user_role.service'

@Controller('auth')
export class AuthController {
  constructor(private userRoleService: UserRoleService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('token')
  async getToken(@AuthUser() user: any): Promise<String> {
    const userId = user.sub;
    const userEntity = await this.userRoleService.findOneById(userId);
    const claims = {
      iss: process.env.AUTH0_ISSUER_URL,
      sub: userId,
      scope: createScope(userEntity)
    }
    const token = jwt.create(claims, process.env.TOKEN_KEY);
    token.setExpiration(new Date().getTime() + 60*1000)
    return token.compact();
  }
}

const createScope = (user: UserRole) => {
  const permissions = [];
  if (user.is_admin) permissions.push('admin');
  if (user.is_editor) permissions.push('editor');
  if (user.is_reviewer) permissions.push('reviewer');
  if (user.is_uploader) permissions.push('uploader');
  return permissions.toString();
}
