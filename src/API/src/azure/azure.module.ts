import { Module } from '@nestjs/common';
import { AzureController } from './azure.controller';

@Module({
  controllers: [AzureController]
})
export class AzureModule {}
