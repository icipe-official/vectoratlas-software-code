import { Module } from '@nestjs/common';
import { DoiService } from './doi.service';
import { DoiController } from './doi.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DOI } from './entities/doi.entity';
import { DoiResolver } from './doi.resolver';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([DOI])],
  controllers: [DoiController],
  providers: [DoiResolver, DoiService],
  exports: [DoiService],
})
export class DoiModule {}
