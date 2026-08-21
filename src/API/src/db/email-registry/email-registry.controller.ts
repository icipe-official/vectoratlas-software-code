import { Controller, Get, Body, Post, Delete, UseInterceptors, ClassSerializerInterceptor, HttpStatus, HttpCode, Query} from '@nestjs/common';

import { SubscribeEmailDto } from './dto/subscribe-email.dto';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { UnsubscribeEmailDto } from './dto/unsubscribe-email.dto';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';

import { EmailRegistryService } from './email-registry.service';


@Controller('api')
@UseInterceptors(ClassSerializerInterceptor)
export class EmailREgistryController{

    constructor(private readonly emailRegistryService: EmailRegistryService) {}

    @Post('subscribe')
    @HttpCode(HttpStatus.CREATED)
    async subscribe(@Body() subscribeEmailDto: SubscribeEmailDto): Promise<SubscriptionResponseDto> {
        return this.emailRegistryService.subscribe(subscribeEmailDto);
    }

    @Get('verify')
    @HttpCode(HttpStatus.OK)
    async verify(@Query() query:VerifyTokenDto): Promise<SubscriptionResponseDto> {
        return this.emailRegistryService.verify(query);
    }

    @Delete('unsubscribe')
    @HttpCode(HttpStatus.NO_CONTENT)
    async unsubscribe(@Body() unsubscribeEmailDto: UnsubscribeEmailDto): Promise<void> {
        return this.emailRegistryService.unsubscribe(unsubscribeEmailDto);
    }
    

}