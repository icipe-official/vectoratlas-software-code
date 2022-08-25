import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('authz')
export class AuthzController {
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(): Promise<Boolean> {
    return true;
  }
}
