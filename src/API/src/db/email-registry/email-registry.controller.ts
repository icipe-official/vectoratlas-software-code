import {
  Controller,
  Get,
  Body,
  Post,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
  HttpCode,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { SubscribeEmailDto } from './dto/subscribe-email.dto';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { UnsubscribeEmailDto } from './dto/unsubscribe-email.dto';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';

import { EmailRegistryService } from './email-registry.service';
import { GqlAuthGuard } from 'src/auth/gqlAuthGuard';
import { RolesGuard } from 'src/auth/user_role/roles.guard';

@Controller('api')
@UseInterceptors(ClassSerializerInterceptor)
export class EmailRegistryController {
  constructor(private readonly emailRegistryService: EmailRegistryService) {}

  @Post('subscribe')
  @HttpCode(HttpStatus.CREATED)
  async subscribe(
    @Body() subscribeEmailDto: SubscribeEmailDto,
  ): Promise<SubscriptionResponseDto> {
    return this.emailRegistryService.subscribe(subscribeEmailDto);
  }

  @Get('verify')
  @HttpCode(HttpStatus.OK)
  async verify(
    @Query() query: VerifyTokenDto,
  ): Promise<SubscriptionResponseDto> {
    return this.emailRegistryService.verify(query);
  }

  @Delete('unsubscribe')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unsubscribe(
    @Body() unsubscribeEmailDto: UnsubscribeEmailDto,
  ): Promise<void> {
    return this.emailRegistryService.unsubscribe(unsubscribeEmailDto);
  }

  @Get('export')
  @UseGuards(GqlAuthGuard, RolesGuard)
  async export(@Res() res: Response) {
    return this.emailRegistryService.exportExcel(res);
  }
}
