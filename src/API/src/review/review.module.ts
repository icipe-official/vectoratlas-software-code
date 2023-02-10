import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { UserRole } from 'src/auth/user_role/user_role.entity';
import { UserRoleService } from 'src/auth/user_role/user_role.service';
import { Dataset } from 'src/db/shared/entities/dataset.entity';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, Logger],
  imports: [HttpModule, TypeOrmModule.forFeature([Dataset]), AuthModule],
  exports: [ReviewService],
})
export class ReviewModule {}
