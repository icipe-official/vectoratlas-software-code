import { Inject, Injectable, Type } from '@nestjs/common';
import { randomInt } from 'crypto';
import { AuthService } from '../../auth/auth.service';

export const getRandomInt = (length: number) => {
  return randomInt(1001, 999999999).toString().substring(0, length);
};

export const getCurrentUser = () => {
  return 'google-oauth2|114640128305555424834'; // 'stevenyaga@gmail.com';
};

export const getCurrentUserName = () => {
  return 'Steve Nyaga';
};

// @Injectable()
// export class MainUtils {
//   constructor(private readonly authService: AuthService) {}

//   getCurrentUserEmail = async () => {
//     const res = await this.authService.getUserRole(
//       'google-oauth2|114640128305555424834',
//     );
//     return 'stevenyaga@gmail.com';
//   };
// }
