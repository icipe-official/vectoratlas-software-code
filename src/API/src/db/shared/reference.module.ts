import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ReferenceService } from './reference.service';
import { ReferenceResolver } from './reference.resolver';
import { Reference } from './entities/reference.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reference])],
  providers: [ReferenceService, ReferenceResolver],
  exports: [ReferenceService],
})
export class ReferenceModule {}
