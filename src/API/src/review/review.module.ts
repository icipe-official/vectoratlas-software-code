import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Dataset } from 'src/db/shared/entities/dataset.entity';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, Logger, AuthService],
  imports: [HttpModule, TypeOrmModule.forFeature([Dataset])],
  exports: [ReviewService],
})
export class ReviewModule {}
