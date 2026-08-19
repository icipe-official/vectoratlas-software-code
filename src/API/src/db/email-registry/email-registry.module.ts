import { Module } from '@nestjs/common';
import { EmailRegistryService } from './email-registry.service';
import { EmailRegistryResolver } from './email-registry.resolver';

@Module({
  providers: [EmailRegistryService, EmailRegistryResolver]
})
export class EmailRegistryModule {}
