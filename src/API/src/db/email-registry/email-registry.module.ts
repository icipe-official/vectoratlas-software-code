import { Module } from '@nestjs/common';
import { EmailRegistryService } from './email-registry.service';
import { EmailRegistryResolver } from './email-registry.resolver';
import { EmailRegistry } from './entities/email-registry.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { EmailModule } from 'src/email/email.module';
import { EmailRegistryController } from './email-registry.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EmailRegistry]), EmailModule],
  providers: [EmailRegistryService, EmailRegistryResolver],
  controllers: [EmailRegistryController],
})
export class EmailRegistryModule {}
