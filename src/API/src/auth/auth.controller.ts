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
    private authService: AuthService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('token')
  async getToken(@AuthUser() user: any): Promise<string> {
    const userId = user?.sub || '';
    const userEntity = await this.userRoleService.findOneById(userId);
    if (userEntity) {
      const claims = {
        iss: process.env.AUTH0_ISSUER_URL,
        sub: userId,
        scope: createScope(userEntity),
        aud: process.env.AUTH0_AUDIENCE,
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
    console.log('User Emails: ', userEmails);
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
  async getUserDetails(@Body('userId') userId: string) {
    await this.authService.init();
    return this.authService.getUserDetailsFromId(userId);
  }
}

// @Post('userDetails')
// async getUserDetails(@Body('userId') userId: string) {
//   await this.authService.init();
//   return this.authService.getUserDetailsFromId(userId);
// const hardcodedUserDetails = {
//   created_at: '2022-10-05T06:20:43.138Z',
//   email: 'petergituu@gmail.com',
//   email_verified: true,
//   identities: [
//     {
//       connection: 'Username-Password-Authentication',
//       provider: 'auth0',
//       user_id: '633d223bd2c75a12885805a8',
//       isSocial: false,
//     },
//   ],
//   auth0_id: 'auth0|633d223bd2c75a12885805a8',
//   name: 'petergituu@gmail.com',
//   nickname: 'petergituu',
//   picture:
//     'https://s.gravatar.com/avatar/4850a0a35ee31a4b2d85e102dd7ea732?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fpe.png',
//   updated_at: '2024-12-05T19:16:36.556Z',
//   user_id: 'auth0|633d223bd2c75a12885805a8',
//   last_password_reset: '2023-02-02T12:18:03.449Z',
//   last_ip: '105.27.236.251',
//   last_login: '2024-12-05T19:16:36.556Z',
//   logins_count: 136,
// };
//     return hardcodedUserDetails;
//   }
// }

const createScope = (user: UserRole) => {
  const permissions = [];
  if (user.is_admin) permissions.push('admin');
  if (user.is_editor) permissions.push('editor');
  if (user.is_reviewer) permissions.push('reviewer');
  if (user.is_uploader) permissions.push('uploader');
  if (user.is_reviewer_manager) permissions.push('reviewer-manager');
  return permissions.toString();
};
