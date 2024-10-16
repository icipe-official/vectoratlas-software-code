import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'njwt';
import { AuthUser } from './user.decorator';
import { UserRole } from './user_role/user_role.entity';
import { UserRoleService } from './user_role/user_role.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private userRoleService: UserRoleService,
    private authService: AuthService
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('token')
  async getToken(@AuthUser() user: any): Promise<string> {
    const userId = user.sub;
    const userEntity = await this.userRoleService.findOneById(userId);
    if (userEntity) {
      const claims = {
        iss: process.env.AUTH0_ISSUER_URL,
        sub: userId,
        scope: createScope(userEntity),
        aud: 'https://www.vectoratlas.org',
      };
      const token = jwt.create(claims, process.env.TOKEN_KEY);
      token.setExpiration(new Date().getTime() + 60000 * 1000);
      return token.toString();
    } else {
      return null;
    }
  }

  @Post('role-emails')
  async getRoleEmails(@Body('role') role: string) {
   const userEmails = await this.authService.getRoleEmails(role);
   console.log("User Emails: ", userEmails);
   return userEmails;
  }
  
  @Get('users')
  async getUsers() {
   const userEmails = await this.userRoleService.getAllUsersWithRoles();
   return userEmails;
  }

  @Post('usersByRole')
  async getUsersByRole(@Body('role') role: string) {
   const users = await this.userRoleService.findByRole(role);
   return users;
  }

  @Post('userDetails')
  async getUserDetails(@Body('userId') userId: string){
    return this.authService.getUserDetailsFromId(userId);
  }
}

const createScope = (user: UserRole) => {
  const permissions = [];
  if (user.is_admin) permissions.push('admin');
  if (user.is_editor) permissions.push('editor');
  if (user.is_reviewer) permissions.push('reviewer');
  if (user.is_uploader) permissions.push('uploader');
  return permissions.toString();
};
