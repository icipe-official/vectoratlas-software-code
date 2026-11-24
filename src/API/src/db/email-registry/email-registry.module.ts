import { Module } from '@nestjs/common';
import { EmailRegistryService } from './email-registry.service';
import { EmailRegistryResolver } from './email-registry.resolver';
import { EmailRegistry } from './entities/email-registry.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { EmailModule } from 'src/email/email.module';
import { EmailRegistryController } from './email-registry.controller';
import { BullModule } from '@nestjs/bullmq';
import { UserRole } from 'src/auth/user_role/user_role.entity';
import { SubscriptionProcessor } from './email-registry.processor';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailRegistry, UserRole]),
    EmailModule,
    BullModule.registerQueue({ name: 'subscription-queue' }),
    AuthModule,
  ],
  providers: [
    EmailRegistryService,
    EmailRegistryResolver,
    SubscriptionProcessor,
  ],
  controllers: [EmailRegistryController],
})
export class EmailRegistryModule {}
