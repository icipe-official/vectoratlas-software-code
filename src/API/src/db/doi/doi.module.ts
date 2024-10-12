import { Module } from '@nestjs/common';
import { DoiService } from './doi.service';
import { DoiController } from './doi.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DOI } from './entities/doi.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([DOI])],
  controllers: [DoiController],
  providers: [DoiService],
  exports: [DoiService],
})
export class DoiModule {}
