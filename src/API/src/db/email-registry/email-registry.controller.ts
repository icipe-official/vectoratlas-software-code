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
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

import { SubscribeEmailDto } from './dto/subscribe-email.dto';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { UnsubscribeEmailDto } from './dto/unsubscribe-email.dto';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';

import { EmailRegistryService } from './email-registry.service';
import { GqlAuthGuard } from 'src/auth/gqlAuthGuard';
import { RolesGuard } from 'src/auth/user_role/roles.guard';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Role } from 'src/auth/user_role/role.enum';
import { Roles } from 'src/auth/user_role/roles.decorator';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class EmailRegistryController {
  constructor(
    private readonly emailRegistryService: EmailRegistryService,
    @InjectQueue('subscription-queue')
    private readonly subscriptionQueue: Queue,
  ) {}

  @Post('subscribe')
  @HttpCode(HttpStatus.CREATED)
  async subscribe(
    @Body() subscribeEmailDto: SubscribeEmailDto,
  ): Promise<SubscriptionResponseDto> {
    return this.emailRegistryService.subscribe(subscribeEmailDto);
  }
  @Get('subscribers')
  @UseGuards(GqlAuthGuard, RolesGuard)
  async getSubscribers() {
    return this.emailRegistryService.findAll({});
  }
  @Get('verify')
  @HttpCode(HttpStatus.OK)
  async verify(
    @Query() query: VerifyTokenDto,
  ): Promise<SubscriptionResponseDto> {
    return this.emailRegistryService.verify(query);
  }
  @Post('cleanup-job')
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async startCleanupJob() {
    const job = await this.subscriptionQueue.add(
      'clean-expired-subscribers',
      { timestamp: new Date() },
      {
        repeat: {
          pattern: '0 0 * * 0',
        },
      },
    );

    return {
      message: 'Weekly cleanup job added to the background queue successfully.',
      jobId: job.id,
    };
  }

  @Delete('unsubscribe')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unsubscribe(
    @Body() unsubscribeEmailDto: UnsubscribeEmailDto,
  ): Promise<void> {
    return this.emailRegistryService.unsubscribe(unsubscribeEmailDto);
  }
  @Post('manual-add')
  @UseGuards(GqlAuthGuard, RolesGuard)
  async manualAdd(
    @Body() body: { email: string; first_name?: string; last_name?: string },
  ) {
    if (!body.email) {
      throw new BadRequestException('Email is required');
    }
    return this.emailRegistryService.createManual(body);
  }
  @Post('request-unsubscribe')
  @HttpCode(HttpStatus.OK)
  async requestUnsubscribe(
    @Body('email') email: string,
  ): Promise<{ message: string; type: string }> {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    return this.emailRegistryService.requestUnsubscribe(email);
  }

  @Get('export')
  @UseGuards(GqlAuthGuard, RolesGuard)
  async export(@Res() res: Response) {
    return this.emailRegistryService.exportExcel(res);
  }
}
